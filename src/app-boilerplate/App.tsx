import React from 'react';

import Data from './helpers/Data';

import { Layouts } from './components';

//==========STYLE==========//
import './styles/main.scss';
import styled from 'styled-components';
const H1Styled = styled.h1`
  color: blue;
`;
//==========STYLE==========//

export const App = () => {
  // const [count, setCount] = React.useState<number>(0);

  const [number, setNumber] = React.useState<number>(expensiveCalculation);

  const [initialData, setInitialData] = React.useState<object>();

  function expensiveCalculation(): number {
    console.log('Calculating...');
    for (let i = 0; i < 3000000000; i++) {
      /* empty */
    }

    console.log('Done calculating!');
    return 0;
  }

  React.useEffect(() => {
    // Initial render
    void (async () => {
      const data = await Data();
      setInitialData(data);
    })();

    // Cleanup function
    return () => {
      setInitialData(undefined);
    };
  }, []);

  React.useEffect(() => {
    // Runs after every successful render or state change
  });

  //====================HELPER FUNCTIONS====================//
  // Function expression syntax to save memory
  const handleClick = () => {
    if (number !== 5) {
      setNumber(number + 1);
    }
  };
  //====================HELPER FUNCTIONS====================//

  return (
    <>
      <H1Styled>Styled Functional Component</H1Styled>
      <h5>Initial Data:</h5>
      <p>{JSON.stringify(initialData)}</p>
      <button onClick={handleClick}>You&apos;ve clicked {number} times.</button>

      <div>
        {[...(Array(number) as number[])].map((_element, i) => {
          return (
            <Layouts.Child key={i} name={'Firstname Lastname'} index={i + 1} />
          );
        })}
      </div>
    </>
  );
};

export default App;
