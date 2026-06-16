import { useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import {
  assistantMessages,
  assistantSuggestions,
  assistantInsights,
} from '@/shared/data/merchantMock';

export function MerchantAssistantPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(assistantMessages);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: 'user', text, time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) },
      {
        role: 'assistant',
        text: 'Gracias por tu consulta. En un entorno conectado, aquí tendrías métricas en vivo. Por ahora, revisa el panel de inventario para stock bajo.',
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-[1400px] flex-col gap-lg p-lg lg:flex-row">
      <section className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden min-h-[500px]">
        <div className="h-16 px-xl flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center gap-md">
            <span className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
              <Icon name="smart_toy" className="text-on-primary" filled />
            </span>
            <div>
              <h2 className="font-headline-md text-headline-md text-primary">Asistente IA NexusFlow</h2>
              <span className="text-xs text-secondary font-semibold uppercase flex items-center gap-1">
                <span className="w-2 h-2 bg-secondary rounded-full" /> En línea
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-xl space-y-lg bg-surface-container-lowest">
          {messages.map((msg, i) =>
            msg.role === 'assistant' ? (
              <div key={i} className="flex gap-md max-w-[85%] items-start">
                <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Icon name="smart_toy" className="text-white text-sm" filled />
                </span>
                <div className="bg-surface-container-low p-md rounded-xl rounded-tl-none border border-outline-variant space-y-md">
                  <p className="text-body-md">{msg.text}</p>
                  {'stats' in msg && msg.stats && (
                    <div className="grid grid-cols-2 gap-md">
                      <div className="bg-white p-md rounded-lg border border-outline-variant">
                        <span className="text-label-md text-outline block">Ventas (Hoy)</span>
                        <span className="text-headline-md text-primary">{msg.stats.sales}</span>
                      </div>
                      <div className="bg-white p-md rounded-lg border border-outline-variant">
                        <span className="text-label-md text-outline block">Pedidos</span>
                        <span className="text-headline-md text-primary">{msg.stats.orders}</span>
                      </div>
                    </div>
                  )}
                  <span className="text-[10px] text-outline uppercase font-bold block">{msg.time}</span>
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-md max-w-[80%] ml-auto flex-row-reverse items-start">
                {/* WCAG 2.2 — 1.1.1 ✓ */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp-7J5kTNeel5W0NDC66l_BJqh1HInMr3EaxDPHDyroPlEZNFCV9y-7jWkmiWVXk_v69bNlT7OQoHlmpM6Hay160GtZcBeqawsfzP76nPmvoynitgTpEA4JWjKHeUugRt0QqiNM0-1Bfz0KG0Ckl-cI8h_CMJ9J_Q4xLha7VJfO4MlxHSwvuTNoEhCjb57NW8yXQPzj6WeJsqaEhs_CfLvVeBrc6hSPl2VJS_Rx9GtVG8JNt_Xt0S_c22mFQQ_3czBrg5HVJnbQLs"
                  alt="Avatar del comerciante"
                  className="w-8 h-8 rounded-full border border-primary"
                />
                <div className="bg-primary p-md rounded-xl rounded-tr-none text-white shadow-sm">
                  <p className="text-body-md">{msg.text}</p>
                  <span className="text-[10px] text-primary-fixed-dim uppercase font-bold block mt-sm">{msg.time}</span>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="p-lg border-t border-outline-variant bg-white">
          <div className="flex gap-sm mb-md overflow-x-auto pb-xs">
            {assistantSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setInput(s)}
                className="px-md py-sm bg-surface-container-high hover:bg-secondary-container rounded-full font-label-md whitespace-nowrap flex items-center gap-xs focus-ring"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-md border border-outline-variant rounded-xl p-xs">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Escribe un mensaje al asistente..."
              className="flex-1 bg-transparent border-none focus:ring-2 focus:ring-primary px-md py-md h-12"
            />
            <button type="button" onClick={send} className="w-11 h-11 bg-primary text-white rounded-lg flex items-center justify-center focus-ring" aria-label="Enviar">
              <Icon name="send" filled />
            </button>
          </div>
        </div>
      </section>

      <aside className="w-full lg:w-80 bg-surface-container-low p-lg rounded-xl border border-outline-variant/10 space-y-lg overflow-y-auto">
        <h3 className="font-headline-md text-label-md uppercase tracking-widest text-outline">
          Inteligencia de Negocio
        </h3>
        {assistantInsights.map((ins) => (
          <div
            key={ins.title}
            className={`bg-white p-lg rounded-xl shadow-sm border border-outline-variant hover:-translate-y-1 transition-transform ${
              ins.action ? 'border-l-4 border-l-error' : ''
            }`}
          >
            <p className="text-label-md text-on-surface-variant mb-xs">{ins.title}</p>
            <p className="font-headline-md text-primary">{ins.value}</p>
            <p className="text-xs text-outline mt-sm">{ins.note}</p>
            {ins.action && (
              <button type="button" className="mt-md w-full border-2 border-primary text-primary py-sm rounded-lg font-button hover:bg-primary hover:text-on-primary transition-colors focus-ring">
                {ins.action}
              </button>
            )}
          </div>
        ))}
        <div className="bg-surface-container-high p-md rounded-xl border border-dashed border-outline">
          <p className="text-xs text-on-surface-variant">
            <Icon name="lightbulb" className="text-primary text-sm mr-1 align-middle" />
            Bundle &quot;Vuelta a Clases&quot; podría aumentar el ticket promedio un 15%.
          </p>
        </div>
      </aside>
    </div>
  );
}
