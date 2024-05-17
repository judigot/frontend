import React from 'react';
import { VariableSizeList as List } from 'react-window';

import Data from './helpers/Data';

interface Datatype {
  id: number;
  'Column 1': string;
  order_id: number;
  customer_id: number;
  customer: string;
  order_product: object[];
  order_date: Date;
  [key: string]: number | string | object[] | Date;
}

export function ReactWindow() {
  const [data, setInitialData] = React.useState<Datatype[]>();

  React.useEffect(() => {
    // Initial render
    if (!data) {
      void getData();
    }

    async function getData() {
      const result = (await Data()) as Datatype[];
      setInitialData(result);
    }
  }, [data]);

  return (
    <>
      {data && (
        <List
          height={500}
          itemCount={data.length}
          itemSize={() => 100} // Row spacing
          width={'100%'}
          useIsScrolling={true}
        >
          {({ index, isScrolling: _, style }) => {
            const { order_id, customer, order_date } = data[index];

            return (
              <div style={style}>
                {/* {isScrolling ? <div>Loading...</div> : <div>Data {index}</div>} */}
                <div>
                  <div style={{ backgroundColor: 'steelblue' }}>
                    <p>{order_id}</p>
                    <p>{customer}</p>
                    <p>{order_date.toString()}</p>
                  </div>
                </div>
              </div>
            );
          }}
        </List>
      )}
    </>
  );
}

export default ReactWindow;
