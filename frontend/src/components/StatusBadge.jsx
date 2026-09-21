export default function StatusBadge({ status }) {
  const label = String(status).replaceAll('_', ' ');
  const tone = {
    SUBMITTED: 'bg-stone-100 text-stone-700',
    UNDER_REVIEW: 'bg-jp-yellow/30 text-stone-800',
    APPROVED: 'bg-jp-leaf/20 text-jp-green',
    REJECTED: 'bg-red-50 text-red-700',
  }[status] ?? 'bg-stone-100 text-stone-700';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tone}`}>{label}</span>;
}
