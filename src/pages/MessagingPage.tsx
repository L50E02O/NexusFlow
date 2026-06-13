import { useMemo, useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import {
  messageThreads,
  messagingAiSuggestions,
  threadMessages,
  type MessageThread,
} from '@/shared/data/mock';

type FilterTab = 'todos' | 'unread' | 'important';

export function MessagingPage() {
  const [filter, setFilter] = useState<FilterTab>('todos');
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState(messageThreads[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(threadMessages);

  const threads = useMemo(() => {
    let list = messageThreads;
    if (filter === 'unread') list = list.filter((t) => t.unread);
    if (filter === 'important') list = list.filter((t) => t.important);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, search]);

  const active: MessageThread | undefined = messageThreads.find((t) => t.id === activeId);
  const chat = messages[activeId] ?? [];

  const send = (text?: string) => {
    const body = (text ?? draft).trim();
    if (!body || !activeId) return;
    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), { role: 'me', text: body, time }],
    }));
    setDraft('');
  };

  return (
    <div className="max-w-container-max w-full mx-auto flex h-[calc(100vh-8rem)] min-h-[520px] bg-surface overflow-hidden border-t border-outline-variant">
      <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-outline-variant flex flex-col bg-surface-container-lowest">
        <div className="p-md space-y-md">
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar mensajes..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-body-md"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(
              [
                { id: 'todos' as const, label: 'Todos' },
                { id: 'unread' as const, label: 'No leídos' },
                { id: 'important' as const, label: 'Importantes' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap min-h-[44px] transition-colors ${
                  filter === tab.id
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActiveId(thread.id)}
              className={`w-full flex items-center gap-md p-md text-left transition-all ${
                activeId === thread.id
                  ? 'bg-secondary-fixed border-l-4 border-primary'
                  : 'hover:bg-surface-container'
              }`}
            >
              <div className="relative shrink-0">
                {/* WCAG 2.2 — 1.1.1 ✓ */}
                <img src={thread.avatar} alt={`Avatar de ${thread.name}`} className="w-12 h-12 rounded-full object-cover" />
                {thread.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-label-md text-label-md text-on-surface truncate">{thread.name}</h3>
                  <span className="text-[12px] text-on-surface-variant">{thread.time}</span>
                </div>
                <p
                  className={`text-label-md truncate ${
                    thread.unread ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {thread.preview}
                </p>
              </div>
              {thread.unread ? (
                <span className="w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center text-[10px] shrink-0">
                  {thread.unread}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </aside>

      <section className="hidden md:flex flex-grow flex-col bg-surface shadow-inner">
        {active ? (
          <>
            <header className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-md">
                <div className="relative">
                  <img src={active.avatar} alt={`Avatar de ${active.name}`} className="w-10 h-10 rounded-full object-cover" />
                  {active.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h2 className="font-headline-md text-on-surface font-bold leading-tight">{active.name}</h2>
                  <span className="text-label-md text-green-600 font-medium">
                    {active.online ? 'En línea' : 'Desconectado'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" aria-label="Buscar en conversación" className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant min-h-[44px] min-w-[44px]">
                  <Icon name="search" />
                </button>
                <button type="button" aria-label="Más opciones" className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant min-h-[44px] min-w-[44px]">
                  <Icon name="more_vert" />
                </button>
              </div>
            </header>

            <div className="flex-grow overflow-y-auto p-lg space-y-lg custom-scrollbar">
              <div className="flex justify-center">
                <span className="bg-surface-container px-3 py-1 rounded-full text-[12px] text-on-surface-variant font-medium">
                  Hoy
                </span>
              </div>
              {chat.map((msg, i) =>
                msg.role === 'them' ? (
                  <div key={i} className="flex items-end gap-md max-w-[80%]">
                    <div className="bg-surface-container-high p-md rounded-xl rounded-bl-none shadow-sm">
                      <p className="text-body-md text-on-surface">{msg.text}</p>
                      <span className="block text-[11px] text-on-surface-variant mt-1 text-right">{msg.time}</span>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-end gap-md max-w-[80%] ml-auto flex-row-reverse">
                    <div className="bg-primary text-on-primary p-md rounded-xl rounded-br-none shadow-md">
                      <p className="text-body-md">{msg.text}</p>
                      <span className="block text-[11px] text-primary-fixed-dim mt-1 text-right">{msg.time}</span>
                    </div>
                  </div>
                ),
              )}
            </div>

            <footer className="p-md border-t border-outline-variant bg-surface-container-lowest space-y-md">
              <div className="bg-secondary-fixed/30 p-md rounded-xl border border-secondary-container/30">
                <div className="flex items-center gap-sm mb-sm text-primary">
                  <Icon name="auto_awesome" className="text-secondary" filled />
                  <span className="text-label-md font-label-md">IA Nexus:</span>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {messagingAiSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="px-4 py-1.5 border border-outline-variant hover:border-primary hover:text-primary rounded-full text-label-md whitespace-nowrap transition-all"
                    >
                      {s === 'Traducir' ? (
                        <span className="flex items-center gap-1">
                          <Icon name="translate" className="text-[18px]" /> Traducir
                        </span>
                      ) : (
                        s
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-md">
                <button type="button" aria-label="Adjuntar archivo" className="text-on-surface-variant hover:text-primary min-h-[44px] min-w-[44px]">
                  <Icon name="attach_file" />
                </button>
                <button type="button" aria-label="Emoji" className="text-on-surface-variant hover:text-primary min-h-[44px] min-w-[44px]">
                  <Icon name="mood" />
                </button>
                <div className="flex-grow bg-surface-container rounded-xl">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    rows={1}
                    placeholder="Escribe un mensaje..."
                    className="w-full bg-transparent border-none focus:ring-0 text-body-md py-3 resize-none rounded-xl px-4 min-h-[48px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => send()}
                  aria-label="Enviar mensaje"
                  className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all shadow-md focus-ring"
                >
                  <Icon name="send" filled />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">
            Selecciona una conversación
          </div>
        )}
      </section>

      <div className="md:hidden flex-1 flex items-center justify-center p-lg text-on-surface-variant text-center">
        {active ? (
          <p>
            Abre esta vista en pantalla grande para chatear con <strong>{active.name}</strong>, o usa el
            asistente flotante en la esquina.
          </p>
        ) : (
          'Selecciona un chat de la lista'
        )}
      </div>
    </div>
  );
}
