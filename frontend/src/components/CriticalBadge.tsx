import { useIncidentStore } from '@/store';
export function CriticalBadge() {
  const { incidents } = useIncidentStore();

  return (
   <span className="inline-flex absolute items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 inset-ring inset-ring-pink-700/10">{incidents.length}</span>
  );
}
