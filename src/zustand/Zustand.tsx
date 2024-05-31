import { useStore } from '@/zustand/store';

export default function App() {
  const { count, increment, searchQuery, setSearchQuery } = useStore();

  return (
    <>
      <h1>Zustand</h1>
      <button type="button" onMouseDown={increment}>
        Count: {count}
      </button>
      <button
        type="button"
        onMouseDown={() => {
          setSearchQuery('newValue');
        }}
      >
        Search Query: {searchQuery}
      </button>
    </>
  );
}
