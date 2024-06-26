type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };
type IJSONObject = Record<string, JsonValue>;

export const isIDataType = (data: unknown): data is (typeof data)[] => {
  return (
    Array.isArray(data) &&
    data.every(
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

export const isValidDataType = (arr: unknown[]): boolean => {
  /* Usage:
    async function getData() {
    const result = await Data();

    // Check if row values have consistent typings based on the first row
    if (Array.isArray(result) && !isValidDataType(result)) {
      console.error('Result is not of type IData[]');
      return;
    }

    return result;
  }
   */
  /* 
  This function checks the type of a value. 
  It handles arrays and null values separately from primitive types.
  */
  const isType = (value: unknown, type: string): boolean =>
    type === 'array'
      ? Array.isArray(value)
      : type === 'null'
        ? value === null
        : typeof value === type;

  // If the array is empty, it's considered valid since there's nothing to invalidate.
  if (arr.length === 0) return true;

  // Infer the structure from the first item in the array
  const firstItem = arr[0] as IJSONObject;

  // Get the keys of the first object and determine the types of the values associated with each key
  const keys = Object.keys(firstItem);
  const types = keys.map((key) =>
    Array.isArray(firstItem[key])
      ? 'array'
      : firstItem[key] === null
        ? 'null'
        : typeof firstItem[key],
  );

  // Validate each item in the array against the inferred structure
  return arr.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      keys.every((key, index) => {
        const value = (item as IJSONObject)[key];
        return value === null || isType(value, types[index]);
      }),
  );
};
