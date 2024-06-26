import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { IDatatype } from './Data';
import { IOrderDetails } from '@/salesmaster/components/OrdersTable/OrderDetails/OrderDetails';

const columnHelper = createColumnHelper<IDatatype>();

// Visible columns
const defaultColumnNames: Record<string, string> = {
  order_id: 'Order ID',
  customer: 'Customer',
  order_product: 'Order Products',
  order_date: 'Date',
};

export const assignColumnNames = (
  columnNames: Record<string, string> = defaultColumnNames,
) => {
  const columns: ColumnDef<
    IDatatype,
    number | string | IOrderDetails[] | Date
  >[] = [];

  for (
    let i = 0, arrayLength = Object.keys(columnNames).length;
    i < arrayLength;
    i++
  ) {
    const key: string[] = Object.keys(columnNames);
    const columnName: string = columnNames[key[i]];
    columns.push(
      columnHelper.accessor(
        (row: IDatatype) => {
          return row[key[i]];
        },
        {
          id: columnName,
          header: (info) => {
            return info.column.id;
          },
          cell: (info) => {
            if (Object.keys(info).includes('getValue')) {
              const cellValue = info.getValue();
              if (cellValue.constructor.name === 'Date') {
                return cellValue.toString();
              }
              if (['Array', 'Object'].includes(cellValue.constructor.name)) {
                return JSON.stringify(cellValue);
              }
              return cellValue.toString();
            } else {
              const cellValue = info;
              return JSON.stringify(cellValue);
            }
          },
          // footer: (info) => info.column.id,
        },
      ),
    );
  }
  return columns;
};

export default assignColumnNames;
