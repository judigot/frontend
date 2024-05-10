import ReactQuery from './ReactQuery';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const ReactQueryRoot = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQuery />
    </QueryClientProvider>
  );
};

export default ReactQueryRoot;
