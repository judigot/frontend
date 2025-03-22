import { Suspense } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useUserData } from '@/data-fetcher/api/useUserData';

const queryClient = new QueryClient();

function App() {
  const { data, isError, isLoading } = useUserData({
    //==========OVERRIDE DEFAULT BEHAVIOR==========//
    refetchInterval: 1 * 1000, // Refresh every 1 second
    staleTime: 1 * 1000, // 1 minute
    gcTime: 5 * 60000, // 5 minutes
    refetchOnWindowFocus: 'always', // Refetch on window focus — but only if stale
    retry: 2,
    // enabled: !!exampleParameter, // Only run refetch when exampleParameter is truthy
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
