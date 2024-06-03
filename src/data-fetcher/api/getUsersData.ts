import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

const fetchDinoData = async (): Promise<unknown> => {
  let data: unknown;

  try {
    const response = await fetch(
      // `https://dinosaur-facts-api.shultzlab.com/dinosaurs`,
      `https://jsonplaceholder.typicode.com/users`,
      {
        // *GET, POST, PATCH, PUT, DELETE
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*', // Same as axios
          'Content-Type': 'application/json',
        },
        // For POST/PUT requests
        // body: JSON.stringify({ key: "value" }),
      },
    );
    if (response.ok) {
      data = response.json();
    } else {
      throw new Error(`HTTP error: ${String(response)}`);
    }
  } catch (error: unknown) {
    if (typeof error === `string`) {
      throw new Error(`There was an error: ${error}`);
    }
    if (error instanceof Error) {
      throw new Error(`There was an error: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      // Unexpected token < in JSON
      throw new Error(`Syntax Error: ${String(error)}`);
    }
  }

  // Success
  return data;
};

export const useDinoData = (
  behavior?: Omit<UseQueryOptions, 'queryKey'>,
): UseQueryResult => {
  return useQuery({
    queryKey: ['dinoData'],
    queryFn: fetchDinoData,
    ...behavior,
  });
};
