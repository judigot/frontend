import { Suspense, useEffect, useRef } from 'react';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

import Data from './api/getData';
import DataTable from '@/data-fetcher/components/DataTable';
import { isValidDataType } from '@/data-fetcher/components/types/TypeGuards';

const queryClient = new QueryClient();

const App = () => {
  const searchRef = useRef<HTMLInputElement>(null);

  async function getData() {
    const result = await Data();

    // Check if row values have consistent typings based on the first row
    if (Array.isArray(result) && !isValidDataType(result)) {
      console.error('Result is not of type IData[]');
      return;
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
    // initialData: [
    //   {
    //     Name: 'Loading',
    //     Description: 'Loading',
    //   },
    // ],
    //==========BEHAVIOR==========//
    // gcTime: 5 * 60000, // 5 minutes cache time
    // refetchOnWindowFocus: true,
    // refetchInterval: 1 * 1000, // Refetch every n seconds
    // staleTime: 1 * 1000, // Refresh if n seconds has passed on window focus
    //==========BEHAVIOR==========//
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

      {Boolean(data) && Array.isArray(data) && <DataTable data={data} />}
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
