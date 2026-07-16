import { useEffect, useRef } from 'react';
import { useI18n } from '@/shared/i18n/I18nContext';
import { useShortcuts } from '@/shared/context/ShortcutsContext';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';

type ShortcutEntry = {
  keys: string;
  descriptionKey: string;
};

function ShortcutRow({ keys, descriptionKey }: ShortcutEntry) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between py-sm px-md hover:bg-surface-container rounded-lg">
      <span className="text-body-md text-on-surface">{t(descriptionKey)}</span>
      <kbd className="ml-md inline-flex items-center gap-0.5 rounded-lg border border-outline-variant bg-surface-container-high px-sm py-xs font-mono text-label-md text-on-surface-variant shadow-sm">
        {keys.split(' ').map((k, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-0.5 text-outline">+</span>}
            <span className="rounded bg-surface px-1.5 py-0.5">{k}</span>
          </span>
        ))}
      </kbd>
    </div>
  );
}

function ShortcutGroup({ titleKey, items }: { titleKey: string; items: ShortcutEntry[] }) {
  const { t } = useI18n();
  return (
    <div className="space-y-xs">
      <h3 className="font-label-md text-primary uppercase tracking-wider px-md pt-sm pb-xs">
        {t(titleKey)}
      </h3>
      {items.map((item) => (
        <ShortcutRow key={item.keys + item.descriptionKey} {...item} />
      ))}
    </div>
  );
}

const generalShortcuts: ShortcutEntry[] = [
  { keys: '? / Ctrl+/', descriptionKey: 'shortcuts.help' },
  { keys: 'Esc', descriptionKey: 'shortcuts.closeModal' },
];

const navigationShortcuts: ShortcutEntry[] = [
  { keys: 'g H', descriptionKey: 'home.title' },
  { keys: 'g S', descriptionKey: 'nav.shop' },
  { keys: 'g C', descriptionKey: 'nav.cart' },
  { keys: 'Ctrl+K', descriptionKey: 'shortcuts.search' },
];

const actionShortcuts: ShortcutEntry[] = [
  { keys: 'Ctrl+N', descriptionKey: 'shortcuts.create' },
  { keys: 'Ctrl+S', descriptionKey: 'shortcuts.save' },
  { keys: 'Tab Shift+Tab', descriptionKey: 'shortcuts.nextSection' },
];

export function ShortcutsModal() {
  const { t } = useI18n();
  const { shortcutsOpen, closeShortcuts } = useShortcuts();
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, shortcutsOpen, closeShortcuts);

  useEffect(() => {
    document.body.style.overflow = shortcutsOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [shortcutsOpen]);

  if (!shortcutsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-md">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('shortcuts.title')}
        className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl border border-outline-variant bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-lg py-md bg-surface-container-low rounded-t-2xl">
          <h2 className="font-headline-md text-headline-md text-primary">
            {t('shortcuts.title')}
          </h2>
          <button
            type="button"
            onClick={closeShortcuts}
            aria-label={t('shortcuts.close')}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high focus-ring"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-lg space-y-md">
          <ShortcutGroup titleKey="shortcuts.help" items={generalShortcuts} />
          <div className="border-t border-outline-variant/40" />
          <ShortcutGroup titleKey="nav.shop" items={navigationShortcuts} />
          <div className="border-t border-outline-variant/40" />
          <ShortcutGroup titleKey="common.save" items={actionShortcuts} />
        </div>

        <div className="border-t border-outline-variant px-lg py-md text-center text-label-md text-on-surface-variant bg-surface-container-low rounded-b-2xl">
          {t('mobile.language', { lang: '' }).replace(': ', '')}
        </div>
      </div>
    </div>
  );
}
