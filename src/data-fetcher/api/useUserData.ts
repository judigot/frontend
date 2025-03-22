import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

const fetchUserData = async (): Promise<unknown> => {
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

export const useUserData = (
  behavior?: Omit<UseQueryOptions, 'queryKey'>,
): UseQueryResult => {
  return useQuery({
    queryKey: ['dinoData'],
    queryFn: fetchUserData,

    // Default settings that can be overridden by the behavior parameter
    refetchInterval: 30 * 1000, //
    // Poll every 1 second (short polling).
    // Common use cases: live dashboards, chat notifications, stock tickers, monitoring tools.

    staleTime: 5 * 60 * 1000, // 5 minutes
    // After this period, React Query will treat the data as stale.
    // On remount (when a component using this query mounts again), stale data triggers a refetch.
    // Common use cases: moderately dynamic data like config settings, price lists, user permissions.

    gcTime: 10 * 60 * 1000, // 10 minutes
    // Keep stale and unused cached data for 10 minutes before garbage-collecting it.
    // This allows reusing cached data without fetching again if a component remounts within that period.
    // Common use cases: large or complex data where refetching too often is wasteful, but you still want quick reuse if the user navigates back.

    refetchOnWindowFocus: 'always', // Refetch on window focus — but only if stale
    retry: 1,

    ...behavior, // This will override the default settings
  });
};
