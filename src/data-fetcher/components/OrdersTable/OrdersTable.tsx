import React, { useRef } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

import { RankingInfo } from '@tanstack/match-sorter-utils';
import TextField from '@mui/material/TextField/TextField';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import styled from 'styled-components';

// Generic table
// import Data, { Datatype, DefaultColumns as Columns } from "./Data";
// import Filter from "./DefaultFilter";

// Salesmaster table
import Data, { Datatype } from './Data';
import Columns from './CustomCells&Columns';
import Filter from './CustomCells&ColumnsFilter';

// import Data, { Datatype } from "./Data";
// import Columns from "./CustomColumns";
// import Filter from "./DefaultFilter";

import { useAtom } from 'jotai';
import { searchQueryAtom } from './state';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const OrdersLayout = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  color: white !important;
  height: 100px;
  width: 100%;
  background-color: black;
`;
const OrdersSearch = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  width: 100%;
`;
const OrdersBody = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  background-color: black;
  height: 100%;
  width: 100%;
`;
const OrdersFooter = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background-color: black;
  width: 100%;
`;

const PageInfoContainer = styled.div`
  color: white;
  padding: 20px;
  margin: auto 0% auto 0%;
`;

const PageNavigationContainer = styled.div`
  /* background-color: black; */
  padding: 20px;
  text-align: right;
  position: relative;
  float: right;
`;

const SearchBarContainer = styled.div`
  /* width: 100%; */
  /* background-color: black; */
  padding: 20px;
  text-align: center;
`;

// declare module '@tanstack/table-core' {
export interface FilterFns {
  fuzzy: FilterFn<unknown>;
}
export interface FilterMeta {
  itemRank: RankingInfo;
}
// }

const fuzzyFilter: FilterFn<Datatype> = (
  row,
  _columnId,
  searchInput: string,
  _addMeta,
) => {
  const rowContent = [];
  for (
    let i = 0, arrayLength = row.getVisibleCells().length;
    i < arrayLength;
    i++
  ) {
    const columnName = row.getVisibleCells()[i].column.id;

    const cell = row.getVisibleCells()[i] as unknown as {
      column: { columnDef: { cell: () => void } };
    };

    const cellValue = row.getVisibleCells()[i].getValue() as
      | string
      | object
      | Date
      | (string | number | object)[];

    rowContent.push(Filter(cellValue, columnName, cell));
    // rowContent.push(CustomFilter(cellValue, columnName, cell));
  }

  // Convert array to string and remove commas
  let rowInStringForm = rowContent.join('');

  // Sanitize: remove all spaces for better matching, convert to uppercase
  searchInput = searchInput.replace(/\s+/g, '').toUpperCase();
  rowInStringForm = rowInStringForm.replace(/\s+/g, '').toUpperCase();

  if (rowInStringForm.includes(searchInput)) {
    return true;
  }

  return false;
};

export default function App() {
  const [searchQuery, setSearchQuery] = useAtom<string>(searchQueryAtom);

  const [data, setData] = React.useState<Datatype[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState(searchQuery);

  React.useEffect(() => {
    void (async () => {
      const data = (await Data()) as Datatype[];
      setData([...data]);
    })();
  }, []);

  const table = useReactTable({
    data,
    columns: Columns as unknown as ColumnDef<Datatype>[],
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: false,
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <OrdersLayout>
        <OrdersSearch>
          <SearchBarContainer>
            <DebouncedInput
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(String(value));
                setGlobalFilter(String(value));
              }}
              placeholder="Search"
            />
          </SearchBarContainer>
        </OrdersSearch>
        <OrdersBody>
          <TableContainer style={{ height: 400 }} component={Paper}>
            <Table stickyHeader>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableCell key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <>
                              <div
                                role="button"
                                onKeyDown={() => {}}
                                tabIndex={0}
                                aria-label="Close modal"
                                className={
                                  header.column.getCanSort()
                                    ? 'cursor-pointer select-none'
                                    : ''
                                }
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}

                                {header.column.getIsSorted() !== false ? (
                                  <i>
                                    {
                                      {
                                        asc: '(Ascending)',
                                        desc: '(Descending)',
                                      }[header.column.getIsSorted() as string]
                                    }
                                  </i>
                                ) : null}
                              </div>
                              {header.column.getCanFilter() ? (
                                <div></div>
                              ) : null}
                            </>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </OrdersBody>
        <OrdersFooter>
          <PageInfoContainer>
            {/* <pre>{JSON.stringify(table.getState(), null, 2)}</pre> */}
            <span>{table.getPrePaginationRowModel().rows.length} Orders</span>
            <span> | </span>
            <span className="flex items-center gap-1">
              <span>Page </span>
              <strong>
                {`${String(
                  Number(table.getState().pagination.pageIndex) + 1,
                )} of ${String(table.getPageCount())}`}
              </strong>
            </span>
            <span> | </span>
            <span className="flex items-center gap-1">
              Go to page: &nbsp;
              <Select
                value={table.getState().pagination.pageIndex}
                renderValue={(value) => value + 1}
                onChange={(e) => {
                  table.setPageIndex(Number(e.target.value));
                }}
              >
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    Page {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </span>

            <Select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20].map((pageSize) => (
                <MenuItem key={pageSize} value={pageSize}>
                  Show {pageSize}
                </MenuItem>
              ))}
            </Select>
          </PageInfoContainer>
          <PageNavigationContainer>
            <IconButton
              size="large"
              aria-label="first page"
              className="border rounded p-1"
              onClick={() => {
                table.setPageIndex(0);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="previous page"
              className="border rounded p-1"
              onClick={() => {
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="next page"
              className="border rounded p-1"
              onClick={() => {
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
            >
              <NavigateNextIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="last page"
              className="border rounded p-1"
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
              }}
              disabled={!table.getCanNextPage()}
            >
              <LastPageIcon />
            </IconButton>
          </PageNavigationContainer>
        </OrdersFooter>
      </OrdersLayout>
    </ThemeProvider>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 0, // Search delay
  // ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  // let timer: NodeJS.Timeout | undefined = undefined;
  const timer = useRef<NodeJS.Timeout | null>(null);

  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [debounce, onChange, value]);

  return (
    <TextField
      inputProps={{
        autoFocus: true,
        id: 'searchInput',
        style: {
          width: '100%',
          backgroundColor: 'darkblue',
          textAlign: 'center',
        },
        debounce: 1000,
        value,
        onChange: (e: React.FormEvent<HTMLInputElement>) => {
          if (timer.current) {
            clearTimeout(timer.current);
            setValue(e.currentTarget.value);
          }
        },
      }}
      id="filled-basic"
      label="Search"
      variant="outlined"
    />
  );
}
