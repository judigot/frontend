import { IOrderDetails } from '@/salesmaster/components/OrdersTable/OrderDetails/OrderDetails';
import { assignColumnNames } from './CustomColumns';
import { titleCase } from './helpers/helpers';
import getData from '@/data-fetcher/api/getData';

export interface Datatype {
  order_id: number;
  customer_id: number;
  customer: string;
  order_product: IOrderDetails[];
  order_date: Date;
  [key: string]: number | string | IOrderDetails[] | Date;
}

const isTitleCaseColumnNames = true;

export const DefaultColumns = await (async () => {
  try {
    const data = (await getData()) as object[];
    const keys: string[] = Object.keys(data[0]);
    const columnNames: { [key: string]: string } = {};

    for (let i = 0, arrayLength = keys.length; i < arrayLength; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      columnNames[keys[i] as keyof typeof columnNames] = isTitleCaseColumnNames
        ? titleCase(keys[i])
        : keys[i];
    }

    return assignColumnNames(columnNames);
  } catch (error: unknown) {
    if (typeof error === `string`) {
      throw new Error(error);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
})();
