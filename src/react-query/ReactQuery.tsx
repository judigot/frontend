import { Suspense, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import Data from './helpers/Data';

interface FormData {
  searchQuery: string | undefined;
}

interface Query {
  queryKey: [string, FormData];
}

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: Date;
  dateModified: Date;
}

async function getData({ queryKey }: Query) {
  const [resource, formData] = queryKey;
  console.log(`${resource}__${JSON.stringify(formData, null, 4)}`);

  return Data();
}

const ReactQuery = () => {
  const [message, setMessage] = useState<string>(``);

  const searchRef = useRef<HTMLInputElement>(null);

  const {
    data,
    isLoading,
    dataUpdatedAt,
    refetch,
    error,
    // errorUpdatedAt,
    // failureCount,
    // failureReason,
    isError,
    // isFetched,
    // isFetchedAfterMount,
    // isFetching,
    // isPaused,
    // isLoadingError,
    // isPlaceholderData,
    // isPreviousData,
    // isRefetchError,
    // isRefetching,
    // isInitialLoading,
    // isStale,
    isSuccess,
    // remove,
    // status,
    // fetchStatus,
  } = useQuery({
    queryKey: ['users', { searchQuery: searchRef.current?.value }],
    queryFn: getData, // Function to fetch data
    //==========BEHAVIOR==========//
    gcTime: 5 * 60000, // 5 minutes cache time
    refetchOnWindowFocus: 'always',
    refetchInterval: 2 * 1000, // Every 30 seconds
    staleTime: 2 * 1000, // Every 30 seconds
    //==========BEHAVIOR==========//
    //
    //
    // initialData: { asdasd: 'asdasd' },
    initialData: () => {
      getData({
        queryKey: ['users', { searchQuery: 'initialData' }],
      })
        .then((result) => {
          // Success
          return result;
        })
        .catch(() => {})
        .finally(() => {});
    },
  });

  useEffect(() => {
    if (isError) {
      console.log('There was an error!');
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      const date = new Date(dataUpdatedAt);

      const year = date.getFullYear();
      const day = date.getDate();
      const month = date.toLocaleString('default', {
        month: 'long',
      });

      const time = new Date(dataUpdatedAt).toLocaleString('en-US', {
        // year: "numeric",
        // month: "numeric",
        // day: "numeric",
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });

      setMessage(`${month} ${String(day)}, ${String(year)} at ${time}`);
    }
  }, [dataUpdatedAt, isSuccess]);

  if (error) {
    setMessage(JSON.stringify(error));
  }
  // if (dataUpdatedAt) {setMessage(JSON.stringify(dataUpdatedAt))};
  // if (errorUpdatedAt) {setMessage(JSON.stringify(errorUpdatedAt))};
  // if (failureCount) {setMessage(JSON.stringify(failureCount))};
  // if (failureReason) {setMessage(JSON.stringify(failureReason))};
  // if (isError) {setMessage(JSON.stringify(isError))};
  // if (isFetched) {setMessage(JSON.stringify(isFetched))};
  // if (isFetchedAfterMount)
  //   {setMessage(JSON.stringify(isFetchedAfterMount))};
  // if (isFetching) {setMessage(JSON.stringify(isFetching))};
  // if (isPaused) {setMessage(JSON.stringify(isPaused))};

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (isLoading) return <div>Loading...</div>;

  // if (isLoadingError) {setMessage(JSON.stringify(isLoadingError))};
  // if (isPlaceholderData) {setMessage(JSON.stringify(isPlaceholderData))};
  // if (isPreviousData) {setMessage(JSON.stringify(isPreviousData))};
  // if (isRefetchError) {setMessage(JSON.stringify(isRefetchError))};
  // if (isRefetching) {setMessage(JSON.stringify(isRefetching))};
  // if (isInitialLoading) {setMessage(JSON.stringify(isInitialLoading))};
  // if (isStale) {setMessage(JSON.stringify(isStale))};
  // if (refetch) {setMessage(JSON.stringify(refetch))};
  // if (remove) {setMessage(JSON.stringify(remove))};
  // if (status) {setMessage(JSON.stringify(status))};
  // if (fetchStatus) {setMessage(JSON.stringify(fetchStatus))};

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <h1>{message}</h1>

        <input
          onChange={() => {
            void refetch();
          }}
          required
          ref={searchRef}
          type="text"
          name="username"
        />

        <p>
          <a
            href="https://tanstack.com/query/v4/docs/react/community/tkdodos-blog"
            target="_blank"
            rel="noreferrer"
          >
            TanStack React Query Best Practices
          </a>
        </p>

        <code>{JSON.stringify(data)}</code>
      </Suspense>
    </>
  );
};

export default ReactQuery;
