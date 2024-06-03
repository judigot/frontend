import React, { Dispatch, useEffect } from 'react';

interface IPerson {
  id?: number;
  firstName?: string;
  lastName?: string; // ? means optional
  parentFunction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  changeParentState?: Dispatch<React.SetStateAction<string>>;
  readonly type?: string; // Value cannot be changed once declared
}

const student: IPerson = {
  id: 13105179,
  firstName: 'Jude Francis',
  lastName: 'Igot',
  type: 'human',
};

student.id = 1; // Can be changed
// student["type"] = "alien"; // Readonly. Can't be changed

export const ChildComponent = (props: IPerson) => {
  useEffect(() => {
    console.log('Initial code: child');
  }, []);

  return (
    <>
      <div>{props.id}</div>
      <div>{props.firstName}</div>
      <button onClick={props.parentFunction}>
        Execute parent component&apos;s function from its child component
      </button>

      <button
        onClick={() => {
          const changeParentState = props.changeParentState;
          if (changeParentState) {
            changeParentState(
              'Changed parent state. This sentence is from the child component',
            );
          }
        }}
      >
        Change a parent&apos;s state with values from child component
      </button>
    </>
  );
};
