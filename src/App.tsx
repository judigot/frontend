import React, { useEffect } from 'react';

interface IData {
  message: string;
}

function App(): JSX.Element {
  const [data, setData] = React.useState<IData | undefined>(undefined);

  useEffect(() => {
    fetch('http://localhost:3000/api', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result: IData | undefined) => {
        // Success
        if (result) {
          setData(result);
        }
      })
      .catch((error: unknown) => {
        // Failure
        throw error instanceof Error ? error : new Error(String(error));
      });
  }, []);

  return (
    <div style={{ zoom: '500%', textAlign: 'center' }}>
      <pre>
        <code>{JSON.stringify(data, null, 4)}</code>
      </pre>
    </div>
  );
}

export default App;
