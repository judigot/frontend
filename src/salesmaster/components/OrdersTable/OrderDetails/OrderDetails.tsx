import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface IProps {
  items: IOrderDetails[];
}

// interface Order {
//   order_id: number;
//   customer: string;
//   orderProducts: OrderDetails[];
//   order_date: Date;
// }

export interface IOrderDetails {
  id: number;
  order_id: number;
  product_name: number | string;
  quantity: number;
  product_cost: number;
  product_price: number;
  discount: number;
}

const CURRENCY = '₱';

import { ThemeProvider, createTheme } from '@mui/material/styles';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const OrderDetailsTable = ({ items }: IProps) => {
  const defVal = 0;

  let totalItems = defVal,
    totalAmount = defVal,
    totalProfit = defVal;

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(
                ({
                  id,
                  order_id: _order_id,
                  product_name,
                  quantity,
                  product_cost,
                  product_price,
                  discount,
                }: IOrderDetails) => {
                  const amount = quantity * product_price;
                  const profit = amount - quantity * product_cost - discount;

                  totalItems = totalItems + quantity;
                  totalAmount = totalAmount + (amount - discount);
                  totalProfit = totalProfit + profit;

                  return (
                    <TableRow
                      key={id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="left">{product_name}</TableCell>
                      <TableCell align="right">{quantity}</TableCell>
                      <TableCell align="right">
                        {CURRENCY} {product_cost}
                      </TableCell>
                      <TableCell align="right">
                        {CURRENCY} {product_price}
                      </TableCell>
                      <TableCell align="right">
                        {CURRENCY} {amount}
                        {discount !== 0 ? (
                          <>
                            &nbsp;
                            <i
                              style={{
                                color: 'black',
                                padding: '5px',
                                borderRadius: '5px',
                                backgroundColor: 'lightgreen',
                              }}
                            >
                              ({CURRENCY} {discount} discount)
                            </i>
                          </>
                        ) : (
                          false
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {CURRENCY} {profit}
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
              <TableRow
                key={JSON.stringify(items)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell colSpan={1}></TableCell>
                <TableCell align="right">Total items: {totalItems}</TableCell>
                <TableCell colSpan={2}></TableCell>
                <TableCell align="right">
                  Total amount:{` ${CURRENCY} `}
                  {totalAmount}
                </TableCell>
                <TableCell align="right">
                  Total profit:{` ${CURRENCY} `}
                  {totalProfit}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </>
  );
};
export default OrderDetailsTable;
