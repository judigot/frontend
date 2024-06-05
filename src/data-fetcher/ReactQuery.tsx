import { Suspense, useEffect } from 'react';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

import DataTable from '@/data-fetcher/components/DataTable';
import { useDataTableStore } from '@/data-fetcher/components/DataTable/store';

const queryClient = new QueryClient();

interface IDataType {
  total_rows: number;
  rows: Record<string, unknown>[];
}

const App = () => {
  const { searchQuery, data, getData, 
    // setData
   } = useDataTableStore();

  const {
    // data = undefined,
    isError,
    // isSuccess,
    isLoading,
    // dataUpdatedAt,
    // refetch,
  } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: getData, // Function to fetch data
    // gcTime: 5 * 60000, // 5 minutes cache time
    // refetchOnWindowFocus: true,
    // refetchInterval: 1 * 1000, // Refetch every n seconds
    // staleTime: 1 * 1000, // Refresh if n seconds has passed on window focus
  });

  // prettier-ignore
  useEffect(() => { if (isError) { console.log('There was an error!'); } }, [isError]);

  // prettier-ignore
  // useEffect(() => { if (isSuccess) { setData(data) } }, [data, dataUpdatedAt, isSuccess, setData]);

  // If there's no initialData, you can use isLoading
  if (isLoading) {
    return <DataTable data={[{}]} />;
  }

  if (isError) {
    return <h1>Error</h1>;
  }

  if (Boolean(data) && Array.isArray(data) && data.length > 0) {
    return (
      <DataTable
        totalRows={(data as IDataType[])[0]?.total_rows ?? 0}
        data={(data as IDataType[])[0]?.rows ?? [{}]}
      />
    );
    // return <DataTable data={data[0].rows ?? [{}]} />;
  } else {
    return <DataTable data={[{}]} />;
  }
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
