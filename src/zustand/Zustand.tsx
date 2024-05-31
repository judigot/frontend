import { useCounterStore } from '@/zustand/store';

export default function Zustand() {
  const { count, increment } = useCounterStore();

  return (
    <>
      <h1>Zustand</h1>
      <button type="button" onMouseDown={increment}>
        Count: {count}
      </button>
    </>
  );
}
