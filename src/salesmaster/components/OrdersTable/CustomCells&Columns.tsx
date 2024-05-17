import { createColumnHelper } from '@tanstack/react-table';

import OrderDetailsTable from './OrderDetails/OrderDetails';
import ClickToSearch from './ClickToSearch';
import { Datatype } from './Data';

import { formatDate } from './helpers';

const columnHelper = createColumnHelper<Datatype>();

// Visible columns
export default [
  columnHelper.accessor((row) => row.order_id, {
    id: 'Order ID',
    header: (info) => {
      return <h1>{info.column.id}</h1>;
    },
    cell: (info) => {
      if (Object.keys(info).includes('getValue')) {
        const cellValue = info.getValue();
        return cellValue;
      } else {
        const cellValue = info;
        return JSON.stringify(cellValue);
      }
    },
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.customer, {
    id: 'Customer',
    header: (info) => {
      return <h1>{info.column.id}</h1>;
    },
    cell: (info) => {
      console.log(); // true

      if (Object.keys(info).includes('getValue')) {
        const cellValue = info.getValue();
        return <ClickToSearch forCustomer={true} item={cellValue} />;
      } else {
        const cellValue = info;
        return JSON.stringify(cellValue);
      }
    },
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.order_product, {
    id: 'Order Products',
    header: (info) => {
      return <h1>{info.column.id}</h1>;
    },
    cell: (info) => {
      if (Object.keys(info).includes('getValue')) {
        const cellValue = info.getValue();
        return <OrderDetailsTable items={cellValue} />;
      } else {
        const cellValue = info;
        return JSON.stringify(cellValue);
      }
    },
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.order_date, {
    id: 'Date',
    header: (info) => {
      return <h1>{info.column.id}</h1>;
    },
    cell: (info) => {
      if (Object.keys(info).includes('getValue')) {
        const cellValue = info.getValue();

        const date = new Date(cellValue);

        return <ClickToSearch forDate={true} item={formatDate(date)} />;
      } else {
        const cellValue = info;
        return JSON.stringify(cellValue);
      }
    },
    // footer: (info) => info.column.id,
  }),
];
