import { Suspense, useEffect } from 'react';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

import Data from './api/getData';
import DataTable from '@/data-fetcher/components/DataTable';
import { useDataTableStore } from '@/data-fetcher/components/DataTable/store';

const queryClient = new QueryClient();

const App = () => {
  const { searchQuery, setData } = useDataTableStore();

  async function getData() {
    const result = await Data(searchQuery);

    setData(result);

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
    queryKey: ['users', searchQuery],
    queryFn: getData, // Function to fetch data
    //==========BEHAVIOR==========//
    gcTime: 5 * 60000, // 5 minutes cache time
    refetchOnWindowFocus: true,
    refetchInterval: 1 * 1000, // Refetch every n seconds
    staleTime: 1 * 1000, // Refresh if n seconds has passed on window focus
    //==========BEHAVIOR==========//
  });

  // prettier-ignore
  useEffect(() => { if (isError) { console.log('There was an error!'); } }, [isError]);

  // prettier-ignore
  useEffect(() => { if (isSuccess) { setData(data) } }, [data, dataUpdatedAt, isSuccess, setData]);

  // If there's no initialData, you can use isLoading
  if (isLoading) {
    return <DataTable data={[{}]} />;
  }

  if (isError) {
    return <h1>Error</h1>;
  }

  if (isSuccess) {
    if (Boolean(data) && Array.isArray(data) && data.length > 0) {
      return <DataTable data={data} />;
    } else {
      return <DataTable data={[{}]} />;
    }
  }

  return null; // Added to handle the case where no conditions are met
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
