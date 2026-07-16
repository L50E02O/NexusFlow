import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { homeAiQuickReplies } from '@/shared/data/mock';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';
import { useChat } from '@/shared/context/ChatContext';
import { useDraggable } from '@/shared/hooks/useDraggable';

const welcome =
  '¡Hola! Soy tu conserje de IA. ¿Buscas algo específico hoy? Puedo ayudarte con pedidos, ofertas o devoluciones.';

export function AiChatWidget() {
  const { isOpen, open, close, toggle } = useChat();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: welcome },
  ]);
  const panelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const widgetDrag = useDraggable();

  useFocusTrap(panelRef, isOpen, close);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [input]);

  const reply = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('pedido') || lower.includes('envío')) {
      return 'Tu último pedido #NF-88219 está en camino. Llegada estimada: 2-3 días hábiles.';
    }
    if (lower.includes('oferta') || lower.includes('descuento')) {
      return 'Tienes un 20% OFF en accesorios (código TECH20AUTO) y una oferta flash en Hogar. ¿Quieres ver la página de cupones?';
    }
    if (lower.includes('devol')) {
      return 'Puedes iniciar una devolución desde Historial de compras o Soporte. ¿Necesitas la política de 30 días?';
    }
    return 'Gracias por tu mensaje. Para conversaciones con vendedores, visita Mensajería. ¿Hay algo más en lo que pueda ayudarte?';
  };

  const send = (text?: string) => {
    const body = (text ?? input).trim();
    if (!body) return;
    setMessages((m) => [...m, { role: 'user', text: body }, { role: 'bot', text: reply(body) }]);
    setInput('');
    if (!isOpen) open();
  };

  const handleFabPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    widgetDrag.onPointerEnd(e);
    if (!widgetDrag.wasDragged()) toggle();
  };

  const dragHandlers = {
    onPointerDown: widgetDrag.onPointerDown,
    onPointerMove: widgetDrag.onPointerMove,
    onPointerUp: widgetDrag.onPointerEnd,
    onPointerCancel: widgetDrag.onPointerEnd,
  };

  const wrapperClass = widgetDrag.fixedStyle
    ? 'flex max-w-[calc(100vw-1rem)] flex-col items-end gap-md'
    : 'fixed bottom-xl right-xl z-[60] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-md';

  return (
    <div data-draggable className={wrapperClass} style={widgetDrag.fixedStyle}>
      {isOpen && (
        <div
          ref={panelRef}
          id="chat-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Asistente NexusFlow"
          className="flex max-h-[min(32rem,75vh)] w-[min(22.5rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-2xl"
        >
          <div
            className="flex cursor-grab touch-none items-center justify-between bg-primary px-lg py-md active:cursor-grabbing"
            {...dragHandlers}
            aria-label="Arrastrar ventana de chat"
          >
            <div className="flex min-w-0 items-center gap-sm">
              <Icon name="drag_indicator" className="shrink-0 text-on-primary/70" />
              <Icon name="smart_toy" filled className="shrink-0 text-[1.75rem]" />
              <span className="truncate font-headline-md text-headline-md text-on-primary">
                Asistente NexusFlow
              </span>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar chat"
              className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full p-1 hover:bg-white/10 focus-ring"
            >
              <Icon name="close" />
            </button>
          </div>
          <div
            className="custom-scrollbar min-h-[12.5rem] flex-1 space-y-md overflow-y-auto bg-surface-container-lowest p-md"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[92%] break-words rounded-xl p-md text-body-md leading-relaxed [overflow-wrap:anywhere] ${
                  msg.role === 'bot'
                    ? 'rounded-tl-none bg-surface-container-high text-on-surface'
                    : 'ml-auto rounded-br-none bg-primary text-on-primary whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="space-y-sm border-t border-outline-variant bg-surface p-md">
            <div className="flex flex-wrap gap-xs" role="group" aria-label="Respuestas rápidas">
              {homeAiQuickReplies.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="min-h-11 rounded-full border border-outline-variant px-3 py-1 text-label-md transition-colors hover:border-primary hover:text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-sm">
              <label htmlFor="chat-input" className="sr-only">
                Escribe tu mensaje al asistente
              </label>
              <textarea
                id="chat-input"
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Escribe aquí..."
                className="max-h-32 min-h-11 min-w-0 flex-1 resize-none overflow-y-auto rounded-lg border-none bg-surface-container px-md py-2.5 text-body-md leading-relaxed focus:ring-2 focus:ring-primary [overflow-wrap:anywhere]"
              />
              <button
                type="button"
                onClick={() => send()}
                aria-label="Enviar mensaje"
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary focus-ring"
              >
                <Icon name="send" filled />
              </button>
            </div>
            <Link
              to="/mensajeria"
              className="block text-center text-label-md text-secondary hover:underline"
            >
              Ir a Mensajería y Comunicación
            </Link>
          </div>
        </div>
      )}

      {!isOpen && (
        <div
          className="hidden max-w-[17.5rem] rounded-xl border border-outline-variant bg-surface p-md shadow-xl md:block"
          role="status"
        >
          <p className="text-body-md font-medium leading-relaxed text-primary">{welcome}</p>
        </div>
      )}

      <button
        type="button"
        onPointerDown={widgetDrag.onPointerDown}
        onPointerMove={widgetDrag.onPointerMove}
        onPointerUp={handleFabPointerUp}
        onPointerCancel={widgetDrag.onPointerEnd}
        aria-label="Abrir asistente de IA. Mantén y arrastra para mover."
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        className="relative flex h-16 w-16 min-h-16 min-w-16 cursor-grab touch-none items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition-all hover:scale-105 active:cursor-grabbing active:scale-95 focus-ring"
      >
        <Icon name="smart_toy" className="text-[2rem]" filled />
        <span
          className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-surface bg-error"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
