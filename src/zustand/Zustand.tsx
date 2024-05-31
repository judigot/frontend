import { useCounterStore } from '@/zustand/store';

export default function Zustand() {
  const { count, increment } = useCounterStore();

  return (
    <button type="button" onMouseDown={increment}>
      Count: {count}
    </button>
  );
}
