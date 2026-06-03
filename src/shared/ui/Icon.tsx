type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  'aria-hidden'?: boolean;
};

export function Icon({ name, className = '', filled, ...rest }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'filled' : ''} ${className}`.trim()}
      aria-hidden={rest['aria-hidden'] ?? true}
    >
      {name}
    </span>
  );
}
