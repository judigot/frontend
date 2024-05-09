import { forwardRef, useRef, useState, useImperativeHandle } from 'react';

export const AccessChildState = () => {
  // Using `null` as initial value to match the type `RefObject`.
  const childRef = useRef<{ getNumber: () => { number: number } } | null>(null);

  return (
    <>
      <h2>Access child component refs/state from the parent component</h2>
      <h2>Parent</h2>
      <button
        onClick={() => {
          alert(
            'Child component state: \n' +
              JSON.stringify(childRef.current?.getNumber(), null, 2),
          );
        }}
      >
        Access child component state/refs
      </button>
      <h2>Children</h2>
      <ChildComponent ref={childRef} />
    </>
  );
};

const ChildComponent = forwardRef<{ getNumber: () => { number: number } }>(
  (_, ref) => {
    const [number, setNumber] = useState(100);

    useImperativeHandle(ref, () => ({
      getNumber: () => {
        return { number };
      },
    }));

    return (
      <div>
        Child component state: {number}
        <button
          onClick={() => {
            setNumber(number + 1);
          }}
        >
          Modify this child&apos;s state
        </button>
      </div>
    );
  },
);

ChildComponent.displayName = 'ChildComponent';

export default AccessChildState;
