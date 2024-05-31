import { useStore } from '@/zustand/store';

export default function Zustand() {
  const { count, increment } = useStore();

  return (
    <button type="button" onMouseDown={increment}>
      Count: {count}
    </button>
  );
}
