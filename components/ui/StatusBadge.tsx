/**
 * components/ui/StatusBadge.tsx
 * Renders a status pill with icon + color (warning/fined/resolved)
 */
import { getStatusLabel } from '@/utils/helpers';

interface Props {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, label, size = 'md' }: Props) {
  const meta = getStatusLabel(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${meta.bg} ${meta.color} ${sizeClasses}`}
    >
      <span>{meta.icon}</span>
      <span>{label ?? meta.label}</span>
    </span>
  );
}
