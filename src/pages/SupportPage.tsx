import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useChat } from '@/shared/context/ChatContext';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { VideoTutorialModal } from '@/components/accessibility/VideoTutorialModal';

const helpCategories = [
  {
    icon: 'package_2',
    title: 'Pedidos',
    description: 'Rastreo, cancelaciones y problemas con entregas.',
    tags: ['Rastreo', 'Cancelación'],
    to: '/historial',
  },
  {
    icon: 'payments',
    title: 'Pagos',
    description: 'Métodos de pago, facturas y reembolsos.',
    tags: ['Facturas', 'Seguridad'],
    to: '/metodos-pago',
  },
  {
    icon: 'assignment_return',
    title: 'Devoluciones',
    description: 'Garantías y políticas de retorno de productos.',
    tags: ['Política', 'Proceso'],
    to: '/politicas-devoluciones',
  },
  {
    icon: 'account_circle',
    title: 'Cuenta',
    description: 'Seguridad, perfil y preferencias de usuario.',
    tags: ['Contraseña', 'Privacidad'],
    to: '/configuracion',
  },
];

const tutorials = [
  {
    tag: 'Vídeo',
    title: 'Cómo configurar tu cuenta',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfZyBw2nrSsbsFnoVWHzO7puPWKfCkAASzkSMF5XxPwlkk55lExKyVpSfKah9ooCOhTnAWNlhyHFd1_pSh23_ubDvXXaQ_0Kh47vAIMjUMU66wQvtxf19eKs5Zir6BrUCYcnT6LUYuOo8k9jAYXM9NdixmI9waFIvaQlsmzmBzGufkukw1zdvucvd8hgcUQ7gTC86GQU1izgNSY9-9NQE_xB8RzzuknXB5UwCOxFfnM3B7OU4EgToUA6JGeJ-C5uXP-86XBOcmq-U',
  },
  {
    tag: 'Guía',
    title: 'Seguridad en tus transacciones',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGMEXXd4DqBSqGM0wasOrrkaiYl63-zmCGir22lrJ2sEGqzp9kohDSDR6Y_PkJdJ1HAGSoY6EzHhbzqNW58VCJRAEEZ9eMOpGm2iRLNGVKkXzl9vUwCSIITp4jvCk8U5fCoVCOWDmrZQ7sKHeWMYYRwkBzzYGCYgXWLtOsZ56VtvvhS3YRBC4PqXHlf53VEsWIyOoSk9LHGaqMFyaEG9XDoWdhQT0XqwPVUPIjCvs9d4Yx3ijlb7zYmbh9ZfMLurIdYhrHSxs7iQ0',
  },
  {
    tag: 'Novedad',
    title: 'Nuevas funciones de NexusFlow',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBp7hjq17uoR7z4rY0qDS2IKurq_lBvhIfMhq2Lb7GnBUKq0HhUG6_6DMES_K4aVzcFrG2mQ50ZcSsqoj1MF789ScN7iTSwHqL9PBYYJrdpwpp71SIPsllNOKZLeIud1WZ1YnhW5mH2DBoHeWYbAktPLtnlqpCcISo-8z0B7gFexo6OXbyg9HG-AQAJrN3Ow6gg_8t9HHBCfapkVTHEFnT9lfBKXK0NPJRFiGC45BpzZkEXkgBAwDIDD9n-OllrPxcVUsyfedRLtHM',
  },
];

const videoTutorials = [
  {
    id: 'tutorial-contactar-soporte',
    title: 'Cómo contactar a Soporte',
    description: 'Aprende a abrir un hilo de mensajería y usar las acciones rápidas de IA Nexus.',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
    poster: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    videoSrc: '/support-contacto.mp4',
    subtitlesSrc: '/support-video-contacto-subtitles-es.vtt',
    descriptionsSrc: '/support-video-contacto-descriptions-es.vtt',
    transcriptSrc: '/support-video-contacto-transcript.txt',
  },
  {
    id: 'tutorial-realizar-compra',
    title: 'Cómo realizar una compra',
    description: 'Guía visual para avanzar por carrito, envío y pago con claridad y seguridad.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
    poster: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    videoSrc: '/support-compra.mp4',
    subtitlesSrc: '/support-video-compra-subtitles-es.vtt',
    descriptionsSrc: '/support-video-compra-descriptions-es.vtt',
    transcriptSrc: '/support-video-compra-transcript.txt',
  },
];

export function SupportPage() {
  const navigate = useNavigate();
  const { open: openChat } = useChat();
  const { openPanel } = useAccessibility();
  const [activeVideo, setActiveVideo] = useState<(typeof videoTutorials)[number] | null>(null);
  const [draftTicket, setDraftTicket] = useState('');
  const [tickets, setTickets] = useState<Array<{id:string; title:string; status:string; preview:string; category:string; createdAt:string}>>(() => {
    if (typeof window === 'undefined') {
      return [
        {
          id: 'NF-8821',
          title: 'Error en pago',
          status: 'Resuelto',
          preview: 'Tu pago fue procesado correctamente.',
          category: 'Pagos',
          createdAt: 'Hace 2 días',
        },
        {
          id: 'NF-9102',
          title: 'Cambio de dirección',
          status: 'En progreso',
          preview: 'Estamos validando la nueva dirección.',
          category: 'Envío',
          createdAt: 'Hace 4 horas',
        },
      ];
    }

    try {
      const raw = window.localStorage.getItem('nexusflow_support_tickets');
      return raw ? JSON.parse(raw) : [
        {
          id: 'NF-8821',
          title: 'Error en pago',
          status: 'Resuelto',
          preview: 'Tu pago fue procesado correctamente.',
          category: 'Pagos',
          createdAt: 'Hace 2 días',
        },
        {
          id: 'NF-9102',
          title: 'Cambio de dirección',
          status: 'En progreso',
          preview: 'Estamos validando la nueva dirección.',
          category: 'Envío',
          createdAt: 'Hace 4 horas',
        },
      ];
    } catch {
      return [
        {
          id: 'NF-8821',
          title: 'Error en pago',
          status: 'Resuelto',
          preview: 'Tu pago fue procesado correctamente.',
          category: 'Pagos',
          createdAt: 'Hace 2 días',
        },
        {
          id: 'NF-9102',
          title: 'Cambio de dirección',
          status: 'En progreso',
          preview: 'Estamos validando la nueva dirección.',
          category: 'Envío',
          createdAt: 'Hace 4 horas',
        },
      ];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('nexusflow_support_tickets', JSON.stringify(tickets));
    } catch {
      // ignore storage errors
    }
  }, [tickets]);

  const ticketCountLabel = useMemo(() => `${tickets.length} ${tickets.length === 1 ? 'ticket' : 'tickets'}`, [tickets.length]);

  const handleCreateTicket = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = draftTicket.trim();
    if (!trimmed) return;

    const newTicket = {
      id: `NF-${Math.floor(10000 + Math.random() * 90000)}`,
      title: trimmed.length > 48 ? `${trimmed.slice(0, 45)}...` : trimmed,
      status: 'Recibido',
      preview: trimmed,
      category: 'Soporte',
      createdAt: 'Ahora',
    };

    setTickets((prev) => [newTicket, ...prev]);
    setDraftTicket('');
    navigate('/mensajeria', { state: { ticketCreated: true, ticketTitle: newTicket.title, ticketId: newTicket.id } });
  };

  return (
    <div className="max-w-container-max mx-auto w-full px-lg py-xl space-y-xxl">
      <section className="relative overflow-hidden rounded-xl bg-primary-container p-xl flex flex-col items-center justify-center text-center min-h-[300px]">
        <h1 className="font-headline-lg text-headline-lg text-white mb-md">Centro de Ayuda y Soporte</h1>
        <p className="text-on-primary-container font-body-lg max-w-2xl mb-xl">
          ¿En qué podemos ayudarte hoy? Busca artículos, gestiona tus tickets o contacta con nuestro equipo.
        </p>
        <div className="flex flex-wrap justify-center gap-md">
          <button
            type="button"
            onClick={() => document.getElementById('create-ticket-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="min-h-11 px-xl bg-white text-primary rounded-xl font-button hover:shadow-lg flex items-center gap-sm focus-ring"
          >
            <Icon name="add_circle" /> Crear Ticket
          </button>
          <Link to="/mensajeria" className="min-h-11 px-xl border-2 border-white text-white rounded-xl font-button hover:bg-white/10 flex items-center gap-sm focus-ring">
            <Icon name="assignment" /> Seguimiento de Tickets
          </Link>
          <Link
            to="/mensajeria"
            className="min-h-11 px-xl bg-secondary text-white rounded-xl font-button hover:bg-secondary/90 flex items-center gap-sm focus-ring"
          >
            <Icon name="chat" /> Soporte en Tiempo Real
          </Link>
        </div>
      </section>

      <section id="create-ticket-form" className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm space-y-lg">
        <div className="flex flex-col gap-md lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-label-md uppercase tracking-[0.2em] text-secondary mb-xs">Crear nuevo ticket</p>
            <h2 className="font-headline-md text-headline-md">¿Necesitas ayuda? Cuéntanos qué pasó.</h2>
          </div>
          <p className="text-on-surface-variant">{ticketCountLabel} activos en tu historial.</p>
        </div>

        <form onSubmit={handleCreateTicket} className="space-y-md">
          <label className="block text-label-md text-on-surface" htmlFor="ticket-description">
            Describe tu problema o solicitud
          </label>
          <textarea
            id="ticket-description"
            value={draftTicket}
            onChange={(e) => setDraftTicket(e.target.value)}
            rows={4}
            placeholder="Ej. No recibí la confirmación de mi compra y necesito ayuda con el envío."
            className="w-full rounded-xl border border-outline-variant bg-surface px-md py-md text-body-md focus-ring"
          />
          <div className="flex flex-wrap items-center justify-between gap-md">
            <p className="text-sm text-on-surface-variant">Tu solicitud quedará registrada y aparecerá en Seguimiento de Tickets.</p>
            <button type="submit" className="min-h-11 rounded-xl bg-primary px-xl py-md font-button text-on-primary hover:bg-primary-container focus-ring">
              Enviar ticket
            </button>
          </div>
        </form>

        <div className="rounded-xl border border-outline-variant bg-surface-container p-md">
          <h3 className="font-label-md text-primary mb-sm">Tickets recientes</h3>
          <ul className="space-y-sm">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="flex flex-col gap-1 rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-md sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-label-md text-on-surface">{ticket.title}</p>
                  <p className="text-sm text-on-surface-variant">{ticket.id} • {ticket.category} • {ticket.createdAt}</p>
                </div>
                <span className="rounded-full bg-secondary-fixed px-sm py-xs text-xs font-semibold text-secondary">{ticket.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm">
        <div className="space-y-md">
          <div className="flex flex-col gap-md lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-label-md uppercase tracking-[0.2em] text-secondary mb-xs">Video tutorial</p>
              <h2 className="font-headline-md text-headline-md">Cómo usar el Centro de Soporte</h2>
            </div>
            <p className="max-w-2xl text-on-surface-variant">
              Reproduce este video para activar las opciones auditivas del menú de accesibilidad: subtítulos, audio descripciones y transcripción.
            </p>
          </div>
          <div className="space-y-md">
            <video
              controls
              className="w-full rounded-2xl border border-outline-variant bg-black"
              aria-label="Video tutorial de soporte de NexusFlow"
            >
              <source
                src="/support-contacto.mp4"
                type="video/mp4"
              />
              <track
                kind="captions"
                src="/support-video-contacto-subtitles-es.vtt"
                srcLang="es"
                label="Español"
                default
              />
              <track
                kind="descriptions"
                src="/support-video-contacto-descriptions-es.vtt"
                srcLang="es"
                label="Audiodescripciones"
              />
              Tu navegador no soporta video HTML5.
            </video>
            <div className="transcripcion" style={{ display: 'none' }}>
              <h3 className="sr-only">Transcripción del video</h3>
              <p>
                Bienvenido a NexusFlow. En este video aprenderás a usar el Centro de Soporte y las funciones de accesibilidad disponibles en la plataforma.
              </p>
              <p>
                Primero, abre el menú de accesibilidad para activar subtítulos o audiodescripción. Después, usa la opción de transcripción para leer el contenido del video.
              </p>
              <p>
                Si necesitas ayuda adicional, crea un ticket o abre el chat en tiempo real para contactar a nuestro equipo de soporte.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-8 space-y-xl">
          <h2 className="font-headline-md text-headline-md text-primary">Categorías de Ayuda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {helpCategories.map((cat) => (
              <Link
                key={cat.title}
                to={cat.to}
                className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-surface-container hover:-translate-y-1 transition-transform cursor-pointer group block focus-ring"
              >
                <Icon name={cat.icon} className="text-[32px] text-primary mb-md group-hover:scale-110 transition-transform" filled />
                <h3 className="font-bold text-body-lg mb-xs">{cat.title}</h3>
                <p className="text-on-surface-variant text-label-md">{cat.description}</p>
                <div className="mt-md flex gap-sm flex-wrap">
                  {cat.tags.map((t) => (
                    <span key={t} className="px-sm py-xs bg-surface-container-low text-primary text-xs rounded-lg">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-secondary-fixed p-xl rounded-xl border border-secondary-container flex items-center gap-xl flex-col md:flex-row">
            <div className="bg-primary text-white p-lg rounded-full">
              <Icon name="settings_accessibility" className="text-[40px]" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-secondary-fixed mb-xs">Ayuda de Accesibilidad</h3>
              <p className="text-on-secondary-fixed-variant mb-md">
                NexusFlow se compromete con la inclusión. Encuentra guías sobre lectores de pantalla y navegación asistida.
              </p>
              <button
                type="button"
                onClick={openPanel}
                className="min-h-11 px-lg bg-primary text-white rounded-xl font-button hover:bg-primary-container focus-ring"
              >
                Ver Guías de Accesibilidad
              </button>
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-xl">
          <div className="bg-primary-container text-white p-xl rounded-xl shadow-lg relative overflow-hidden">
            <h3 className="font-headline-md text-headline-md mb-md flex items-center gap-sm">
              <Icon name="auto_awesome" /> Asistente NexusFlow
            </h3>
            <p className="text-on-primary-container text-body-md mb-xl">
              Analizando tu actividad reciente para ofrecerte soluciones inmediatas.
            </p>
            <div className="space-y-sm mb-xl">
              <Link
                to="/historial"
                className="w-full text-left p-md bg-white/10 hover:bg-white/20 rounded-lg text-label-md flex justify-between items-center transition-colors min-h-11"
              >
                ¿Dónde está mi último pedido?
                <Icon name="arrow_forward" className="text-sm" />
              </Link>
              <Link
                to="/configuracion"
                className="w-full text-left p-md bg-white/10 hover:bg-white/20 rounded-lg text-label-md flex justify-between items-center transition-colors min-h-11"
              >
                Cambiar método de pago
                <Icon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <button
              type="button"
              onClick={openChat}
              className="w-full min-h-11 bg-secondary text-white rounded-xl font-button hover:bg-secondary/90 shadow-md focus-ring"
            >
              Iniciar Chat con IA
            </button>
          </div>

          <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-surface-container space-y-xl">
            <div>
              <h4 className="font-label-md text-outline uppercase tracking-wider mb-md">Estado del Servicio</h4>
              <div className="flex items-center gap-sm p-md bg-green-50 border border-green-100 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-800 font-bold text-label-md">Sistemas Operativos</span>
              </div>
            </div>
            <hr className="border-surface-variant" />
            <div>
              <h4 className="font-label-md text-outline uppercase tracking-wider mb-md">Consultas Recientes</h4>
              <ul className="space-y-md">
                <li className="flex justify-between items-center group cursor-pointer">
                  <div>
                    <p className="font-label-md text-primary">#NF-8821: Error en pago</p>
                    <p className="text-xs text-outline">Finalizado • hace 2 días</p>
                  </div>
                  <Icon name="open_in_new" className="text-outline group-hover:text-primary" />
                </li>
                <li className="flex justify-between items-center group cursor-pointer">
                  <div>
                    <p className="font-label-md text-primary">#NF-9102: Cambio de dirección</p>
                    <p className="text-xs text-outline">En proceso • hace 4 horas</p>
                  </div>
                  <Icon name="open_in_new" className="text-outline group-hover:text-primary" />
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <section className="space-y-xl pb-xxl">
        <h2 className="font-headline-md text-headline-md text-primary">Guías Rápidas y Tutoriales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {tutorials.map((t) => (
            <div key={t.title} className="group relative overflow-hidden rounded-xl h-64 shadow-sm cursor-pointer">
              {/* WCAG 2.2 — 1.1.1 ✓ */}
              <img src={t.image} alt={t.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-xl">
                <span className="bg-secondary text-white text-[10px] px-sm py-xs rounded-full w-fit mb-sm uppercase font-bold tracking-widest">
                  {t.tag}
                </span>
                <h4 className="text-white font-headline-md text-body-lg">{t.title}</h4>
              </div>
            </div>
          ))}

          {videoTutorials.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video)}
              aria-haspopup="dialog"
              aria-label={`Abrir video tutorial: ${video.title}`}
              className="group relative overflow-hidden rounded-xl h-64 shadow-sm text-left focus-ring"
            >
              <img src={video.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-transparent flex flex-col justify-end p-xl">
                <span className="mb-sm w-fit rounded-full bg-secondary px-sm py-xs text-[10px] font-bold uppercase tracking-widest text-white">
                  VÍDEO
                </span>
                <h4 className="text-white font-headline-md text-body-lg">{video.title}</h4>
                <p className="mt-sm text-sm text-white/90">{video.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <VideoTutorialModal video={activeVideo} isOpen={Boolean(activeVideo)} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
