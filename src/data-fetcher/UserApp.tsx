import { Suspense } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useUserData } from '@/data-fetcher/api/useUserData';

const queryClient = new QueryClient();

function App() {
  const { data, isError, isLoading } = useUserData({
    //==========OVERRIDE DEFAULT BEHAVIOR==========//
    gcTime: 5 * 60000, // 5 minutes cache time
    refetchOnWindowFocus: true,
    refetchInterval: 1 * 1000,
    staleTime: 1 * 1000,
    retry: 2,
    //==========OVERRIDE DEFAULT BEHAVIOR==========//
  });

  // If there's no initialData, you can use isLoading
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error</h1>;
  }

  return <pre>{JSON.stringify(data, null, 4)}</pre>;
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
