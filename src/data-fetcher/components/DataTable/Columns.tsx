import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<unknown[]>();

// Visible columns
const customColumnNames: { [key: string]: string } = {
  column_name: 'Custom Column Name',
};

export const assignColumnNames = (
  columnNames: { [key: string]: string } = customColumnNames,
) => {
  const columns = [];

  for (
    let i = 0, arrayLength = Object.keys(columnNames).length;
    i < arrayLength;
    i++
  ) {
    const key: string[] = Object.keys(columnNames);
    const columnName: string = columnNames[key[i]];
    columns.push(
      columnHelper.accessor(
        (row: unknown[]) => {
          return row[key[i] as keyof typeof row];
        },
        {
          id: columnName,
          header: (info) => info.column.id,
          cell: (info) => {
            const cellValue = info.getValue();

            if (cellValue === undefined) {
              return '';
            }

            if (cellValue instanceof Date) {
              return cellValue.toString();
            }

            if (Array.isArray(cellValue) || typeof cellValue === 'object') {
              return JSON.stringify(cellValue);
            }

            return String(cellValue);
          },
          footer: (info) => info.column.id,
        },
      ),
    );
  }
  return columns;
};

export default assignColumnNames;
