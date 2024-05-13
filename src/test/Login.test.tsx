import { useState } from 'react';
import '@testing-library/jest-dom';

import { act, render, renderHook, screen } from '@testing-library/react';
import Login from './Login';

const useCustomHook = ({
  propVal,
}: {
  propVal: string;
}): { name: string; mutateData: (mutationValue: string) => Promise<void> } => {
  const [name, setName] = useState<string>(propVal);

  const mutateData = async (mutationValue: string): Promise<void> => {
    await fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => response.json())
      .then(() => {
        setName(mutationValue);
      });
  };
  return { name, mutateData };
};

describe('Tester', () => {
  it('test', async () => {
    const { result } = renderHook(useCustomHook, {
      initialProps: { propVal: 'Old Name' },
    });

    console.log(result.current.name);

    expect(result.current.name).toBe('Old Name');

    await act(async () => result.current.mutateData('New Name'));

    expect(result.current.name).toBe('New Name');

    console.log(result.current.name);

    render(<Login isPasswordCorrect={true} />);
    const component = screen.getByTestId('admin-container');
    expect(component).toBeInTheDocument();
  });
});
