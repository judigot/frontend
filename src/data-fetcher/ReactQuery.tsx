import { Suspense, useEffect, useRef } from 'react';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

import Data from './api/getData';
import { isIDataType } from '@/data-fetcher/components/types/TypeGuards';

const queryClient = new QueryClient();

const App = () => {
  const searchRef = useRef<HTMLInputElement>(null);

  async function getData() {
    const result = await Data();

    if (!isIDataType(result)) {
      throw new Error('Result is not of type IData[]');
    }
    return result;
  }

  const {
    data = undefined,
    isError,
    isSuccess,
    isLoading,
    dataUpdatedAt,
    // refetch,
  } = useQuery({
    queryKey: ['users', { searchQuery: searchRef.current?.value }],
    queryFn: getData, // Function to fetch data
    //==========BEHAVIOR==========//
    gcTime: 5 * 60000, // 5 minutes cache time
    refetchOnWindowFocus: true,
    refetchInterval: 1 * 1000, // Refetch every n seconds
    staleTime: 1 * 1000, // Refresh if n seconds has passed on window focus
    //==========BEHAVIOR==========//
    // initialData: [
    //   {
    //     Name: 'Loading',
    //     Description: 'Loading',
    //   },
    // ],
  });

  // prettier-ignore
  useEffect(() => { if (isError) { console.log('There was an error!'); } }, [isError]);

  // prettier-ignore
  useEffect(() => { if (isSuccess) { console.log('Success!'); } }, [dataUpdatedAt, isSuccess]);

  return (
    <>
      {/* If there's no initialData, you can use isLoading */}
      {isLoading && <h1>Loading</h1>}

      {isError && <h1>Error</h1>}

      {data?.map(({ Name, Description }) => (
        <div key={Name}>
          <h1>{Name}</h1>
          <p>{Description}</p>
        </div>
      ))}
    </>
  );
};

export const ReactQuery = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </QueryClientProvider>
  );
};

export default ReactQuery;
