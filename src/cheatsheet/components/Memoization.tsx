import React, { useMemo } from 'react';

export default function Counter() {
  const initialDependency: number = 2;

  const [message, setMessage] = React.useState<string>(() => {
    return ``;
  });

  const [calcTrigger, setCalcTrigger] = React.useState(initialDependency);
  const [renderInvoker, setRenderInvoker] = React.useState(0);

  const timerRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    clearTimeout(timerRef.current as NodeJS.Timeout);
    timerRef.current = setTimeout(function () {
      // Reset state
      setMessage(``);
    }, 2000);
  });

  const cachedValue = useMemo(() => {
    if (initialDependency !== calcTrigger) {
      setMessage(`Calculating`);
      for (let i = 0; i < 2000000000; i++) {
        /**/
      }
      setMessage(`Done calculating! Cached the value.`);
      return calcTrigger * 2;
    }
  }, [calcTrigger]);

  const incrementOne = () => {
    setCalcTrigger(calcTrigger * 2);
  };

  const incrementTwo = () => {
    setRenderInvoker(renderInvoker + 1);
    setMessage(`Invoked a render but didn't recalculate!`);
  };

  return (
    <div>
      <h2>Memoization</h2>
      <p>Caching: Save value to memory to avoid unnecessary re-renders</p>
      <p>Cached Value: {cachedValue}</p>
      <button onClick={incrementOne}>Calculation Trigger: {calcTrigger}</button>
      <button onClick={incrementTwo}>
        Invoked a render {renderInvoker} times
      </button>
      <p>{message}</p>
    </div>
  );
}
