type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  role?: string;
};

// WCAG 2.2 — 1.1.1 ✓ Iconos decorativos ocultos; informativos con aria-label
export function Icon({ name, className = '', filled, role, ...rest }: IconProps) {
  const ariaHidden =
    rest['aria-hidden'] !== undefined ? rest['aria-hidden'] : !rest['aria-label'];
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'filled' : ''} ${className}`.trim()}
      aria-hidden={ariaHidden}
      aria-label={rest['aria-label']}
      role={role ?? (rest['aria-label'] ? 'img' : undefined)}
    >
      {name}
    </span>
  );
}
