import { IData } from '@/data-fetcher/components/types/types';

export const isIDataType = (value: unknown): value is IData[] => {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'Name' in item &&
        typeof (item as { Name: unknown }).Name === 'string' &&
        'Description' in item &&
        typeof (item as { Description: unknown }).Description === 'string',
    )
  );
};
