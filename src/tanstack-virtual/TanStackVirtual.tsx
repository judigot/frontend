import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function App() {
  // The scrollable element for your list
  const parentRef = useRef(null);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 100000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
  });
  return (
    <>
      <div
        ref={parentRef}
        style={{
          height: `400px`,
          width: `200px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${String(rowVirtualizer.getTotalSize())}px`,
            // width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                // width: '100%',
                height: `${String(virtualItem.size)}px`,
                transform: `translateY(${String(virtualItem.start)}px)`,
              }}
            >
              Row{' '}
              {String(virtualItem.index + 1)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
