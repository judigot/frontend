import { IOrderDetails } from './OrderDetails/OrderDetails';

import { formatDate } from './helpers';

export function CustomCellsAndColumnsFilter(
  cellValue: Date | string | (string | number | object)[] | object,
  columnName: string,
  _cell: {
    column: { columnDef: { cell: () => void } };
    // id: object; row: object; getValue: object; renderValue: object; getContext: object; getIsGrouped: object; getIsPlaceholder: object; getIsAggregated: object;
  },
) {
  // const cellRendererFunction = cell.column.columnDef.cell;

  // Order ID
  if (columnName === 'Order ID') {
    return `orderID='${String(cellValue)}'`;
  }

  // Customer
  if (columnName === 'Customer') {
    return `customerName='${String(cellValue)}'`;
  }

  // Order Products
  if (columnName === 'Order Products') {
    const orderDetails: string[] = [];
    const value = cellValue;
    let totalItems = 0;
    let totalAmount = 0;
    let totalProfit = 0;

    (value as IOrderDetails[]).map(
      ({
        id: _id,
        order_id: _order_id,
        product_name,
        quantity,
        product_cost,
        product_price,
        discount,
      }: IOrderDetails) => {
        orderDetails.push(`productName='${String(product_name)}'`);
        const amount = quantity * product_price;
        const profit = amount - quantity * product_cost - discount;

        totalItems += quantity;
        totalAmount += amount - discount;
        totalProfit += profit;
      },
    );

    orderDetails.push(`totalItems='${String(totalItems)}'`);
    orderDetails.push(`totalAmount='${String(totalAmount)}'`);
    orderDetails.push(`totalProfit='${String(totalProfit)}'`);
    orderDetails.push(`totalAmount='Total items: ${String(totalItems)}'`);
    orderDetails.push(`totalAmount='Total amount: ₱ ${String(totalAmount)}'`);
    orderDetails.push(`totalProfit='Total profit: ₱ ${String(totalProfit)}'`);

    return orderDetails.join('');
  }

  // Date
  if (columnName === 'Date') {
    return `orderDate='${String(cellValue)}' orderDate='${formatDate(
      new Date(cellValue as Date),
    )}'`;
  }
}

export default CustomCellsAndColumnsFilter;
