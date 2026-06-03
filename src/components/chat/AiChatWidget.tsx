import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { homeAiQuickReplies } from '@/shared/data/mock';

const welcome =
  '¡Hola! Soy tu conserje de IA. ¿Buscas algo específico hoy? Puedo ayudarte con pedidos, ofertas o devoluciones.';

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: welcome },
  ]);

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
    if (!open) setOpen(true);
  };

  return (
    <div className="fixed bottom-xl right-xl z-[60] flex flex-col items-end gap-md">
      {open && (
        <div className="w-[min(360px,calc(100vw-2rem))] bg-surface shadow-2xl rounded-xl border border-outline-variant overflow-hidden flex flex-col max-h-[min(480px,70vh)]">
          <div className="bg-primary text-on-primary px-lg py-md flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <Icon name="smart_toy" filled className="text-[28px]" />
              <span className="font-headline-md text-headline-md">Asistente NexusFlow</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="p-1 rounded-full hover:bg-white/10"
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-md space-y-md custom-scrollbar bg-surface-container-lowest min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[90%] p-md rounded-xl text-body-md ${
                  msg.role === 'bot'
                    ? 'bg-surface-container-high text-on-surface rounded-tl-none'
                    : 'bg-primary text-on-primary ml-auto rounded-br-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-md border-t border-outline-variant space-y-sm bg-surface">
            <div className="flex flex-wrap gap-xs">
              {homeAiQuickReplies.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="px-3 py-1 text-label-md border border-outline-variant rounded-full hover:border-primary hover:text-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-sm items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Escribe aquí..."
                className="flex-1 bg-surface-container rounded-lg px-md py-2 text-body-md border-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => send()}
                aria-label="Enviar"
                className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center focus-ring"
              >
                <Icon name="send" filled />
              </button>
            </div>
            <Link to="/mensajeria" className="text-label-md text-secondary hover:underline block text-center">
              Ir a Mensajería y Comunicación
            </Link>
          </div>
        </div>
      )}

      {!open && (
        <div className="bg-surface shadow-xl rounded-xl border border-outline-variant p-md max-w-[280px] hidden md:block">
          <p className="text-body-md text-primary font-medium">{welcome}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Asistente IA"
        aria-expanded={open}
        className="w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus-ring relative"
      >
        <Icon name="smart_toy" className="text-[32px]" filled />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-surface" />
      </button>
    </div>
  );
}
