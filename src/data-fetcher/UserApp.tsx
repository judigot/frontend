import { Suspense } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import DataTable from '@/data-fetcher/components/DataTable';
import { useUserData } from '@/data-fetcher/api/getUsersData';

const queryClient = new QueryClient();

const App = () => {
  const { data, isError, isLoading } = useUserData({
    //==========BEHAVIOR==========//
    gcTime: 5 * 60000, // 5 minutes cache time
    refetchOnWindowFocus: true,
    refetchInterval: 1 * 1000,
    staleTime: 1 * 1000,
    //==========BEHAVIOR==========//
  });

  // If there's no initialData, you can use isLoading
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error</h1>;
  }

  return Boolean(data) && Array.isArray(data) && <DataTable data={data} />;
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
