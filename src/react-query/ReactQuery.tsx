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

  if (Object.keys(formData).includes('searchQuery')) {
    console.log(`${resource}__${JSON.stringify(formData, null, 4)}`);
    return Data();
  }
}

const ReactQuery = () => {
  const [message, setMessage] = useState<string>(``);

  const searchRef = useRef<HTMLInputElement>(null);

  const { data, isError, isSuccess, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['users', { searchQuery: searchRef.current?.value }],
    queryFn: getData, // Function to fetch data
    //==========BEHAVIOR==========//
    gcTime: 5 * 60000, // 5 minutes cache time
    refetchOnWindowFocus: 'always',
    refetchInterval: 2 * 1000, // Every 30 seconds
    staleTime: 2 * 1000, // Every 30 seconds
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
};

export default ReactQuery;
