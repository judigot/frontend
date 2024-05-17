import { IOrderDetails } from '@/salesmaster/components/OrdersTable/OrderDetails/OrderDetails';
import { assignColumnNames } from './CustomColumns';

export interface Datatype {
  order_id: number;
  customer_id: number;
  customer: string;
  order_product: IOrderDetails[];
  order_date: Date;
  [key: string]: number | string | IOrderDetails[] | Date;
}

const URL = `http://localhost:5000/api/orders`;

// const titleCaseColumnNames = true;

const Data = async () => {
  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP error: ${String(response)}`);
    }
  } catch (error: unknown) {
    if (typeof error === `string`) {
      throw new Error(`There was an error: ${error}`);
    }
    if (error instanceof Error) {
      throw new Error(`There was an error: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Syntax Error: ${String(error)}`);
    }
  }
};

const titleCase = (string: string) => {
  return string
    .replace(/^[-_]*(.)/, (_, c: string) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c: string) => ' ' + c.toUpperCase());
};

export const DefaultColumns = await (async () => {
  try {
    const data = (await Data()) as unknown as object[];
    const keys: string[] = Object.keys(data[0]);
    const columnNames: { [key: string]: string } = {};

    for (let i = 0, arrayLength = keys.length; i < arrayLength; i++) {
      columnNames[keys[i] as keyof typeof columnNames] = titleCase(keys[i]);
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

export default Data;
