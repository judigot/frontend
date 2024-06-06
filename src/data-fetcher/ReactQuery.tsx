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

function App() {
  const { searchQuery, getData } = useDataTableStore();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: getData,
    // gcTime: 5 * 60000, // 5 minutes cache time
    // refetchOnWindowFocus: true,
    // refetchInterval: 1 * 1000, // Refetch every n seconds
    // staleTime: 1 * 1000, // Refresh if n seconds has passed on window focus
  });

  if (isLoading) {
    return <DataTable isLoading={isLoading} data={[{}]} />;
  }

  if (isError) {
    return <DataTable isError={isError} data={[{}]} />;
  }

  return (
    <DataTable
      isLoading={isLoading}
      isError={isError}
      totalRecords={(data as IDataType[])[0]?.total_rows ?? 0}
      data={(data as IDataType[])[0]?.rows ?? []}
    />
  );
}

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
