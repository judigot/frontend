import { Suspense, useEffect, useRef, useState } from 'react';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

import Data from './helpers/Data';

interface IFormData {
  searchQuery: string | undefined;
}

interface IQuery {
  queryKey: [string, IFormData];
}

export interface IQuote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: Date;
  dateModified: Date;
}

function App() {
  const [message, setMessage] = useState<string>(``);

  const searchRef = useRef<HTMLInputElement>(null);

  async function getData({ queryKey }: IQuery) {
    const [resource, formData] = queryKey;

    if (Object.keys(formData).includes('searchQuery')) {
      console.log(`${resource}__${JSON.stringify(formData, null, 4)}`);
      return Data();
    }
  }

  const { data, isError, isSuccess, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['users', { searchQuery: searchRef.current?.value }],
    queryFn: getData, // Function to fetch data
    //==========BEHAVIOR==========//
    gcTime: 5 * 60000, // 5 minutes cache time
    refetchOnWindowFocus: true,
    refetchInterval: 1 * 1000, // Refetch every n seconds
    staleTime: 1 * 1000, // Refresh if n seconds has passed on window focus
    //==========BEHAVIOR==========//
    initialData: {
      _id: '1',
      content: 'Lorem ipsum dolor sit amet, consectetur adip.',
      author: 'Anonymous',
      tags: ['Famous Quotes'],
      authorSlug: 'anonymous',
      length: 46,
      dateAdded: new Date('2019-08-16'),
      dateModified: new Date('2023-04-14'),
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
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });

      setMessage(`${month} ${String(day)}, ${String(year)} at ${time}`);
    }
  }, [dataUpdatedAt, isSuccess]);

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
}

export const ReactQuery = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

export default ReactQuery;
