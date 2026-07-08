import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';

type VideoTutorial = {
  id: string;
  title: string;
  description: string;
  image: string;
  poster: string;
  videoSrc: string;
  subtitlesSrc: string;
  descriptionsSrc: string;
  transcriptSrc: string;
};

type VideoTutorialModalProps = {
  video: VideoTutorial | null;
  isOpen: boolean;
  onClose: () => void;
};

export function VideoTutorialModal({ video, isOpen, onClose }: VideoTutorialModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const { closePanel, transcripts } = useAccessibility();

  useFocusTrap(dialogRef, isOpen, onClose);

  useEffect(() => {
    if (!isOpen || !video) return;

    closePanel();
    setShowTranscript(false);
    setTranscriptText('');

    const mediaEvent = new Event('accessibility-media-updated');
    window.dispatchEvent(mediaEvent);

    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event('accessibility-media-updated'));
    }, 0);

    let cancelled = false;
    fetch(video.transcriptSrc)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar la transcripción');
        return response.text();
      })
      .then((text) => {
        if (!cancelled) setTranscriptText(text);
      })
      .catch(() => {
        if (!cancelled) setTranscriptText('La transcripción estará disponible próximamente.');
      });

    document.body.style.overflow = 'hidden';
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [closePanel, isOpen, video]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const shouldShowTranscript = showTranscript || transcripts;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${video.id}-title`}
        aria-describedby={`${video.id}-description`}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-xl py-lg">
          <div>
            <p className="mb-xs text-label-md uppercase tracking-[0.2em] text-secondary">Tutorial en video</p>
            <h2 id={`${video.id}-title`} className="font-headline-md text-headline-md text-primary">
              {video.title}
            </h2>
            <p id={`${video.id}-description`} className="mt-sm max-w-2xl text-on-surface-variant">
              {video.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-full border border-outline-variant bg-white px-md py-sm text-label-md text-on-surface focus-ring"
            aria-label="Cerrar reproductor de video"
          >
            ✕ Cerrar
          </button>
        </div>

        <div className="space-y-lg p-xl">
          <video
            key={video.id}
            controls
            preload="metadata"
            poster={video.poster}
            className="w-full rounded-xl border border-outline-variant bg-black"
            aria-label={video.title}
            data-accessibility-active="true"
          >
            <source src={video.videoSrc} type="video/mp4" />
            <track kind="subtitles" src={video.subtitlesSrc} srcLang="es" label="Subtítulos en español" default />
            <track kind="descriptions" src={video.descriptionsSrc} srcLang="es" label="Audiodescripciones" />
            Tu navegador no soporta video HTML5.
          </video>

          <div className="flex flex-wrap items-center justify-between gap-sm">
            <button
              type="button"
              onClick={() => setShowTranscript((current) => !current)}
              className="min-h-11 rounded-xl border border-outline-variant bg-surface px-lg py-sm font-button text-primary focus-ring"
              aria-expanded={shouldShowTranscript}
              aria-controls={`${video.id}-transcript`}
            >
              {shouldShowTranscript ? 'Ocultar' : 'Mostrar'} transcripción
            </button>
            <p className="text-sm text-on-surface-variant">
              Los subtítulos, la audiodescripción y la transcripción se controlan desde el menú de accesibilidad.
            </p>
          </div>

          <div
            id={`${video.id}-transcript`}
            className="transcripcion rounded-xl border border-outline-variant bg-surface-container-low p-lg"
            data-video-id={video.id}
            style={{ display: shouldShowTranscript ? 'block' : 'none' }}
            aria-live="polite"
          >
            <h3 className="mb-sm font-label-lg text-primary">Transcripción</h3>
            <p className="whitespace-pre-wrap text-sm leading-7 text-on-surface">{transcriptText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
