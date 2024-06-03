import React, { useEffect, useRef } from 'react';

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

import { useSearchQueryStore } from './store';

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

import { fuzzyFilter } from './Filter';
import assignColumnNames from '@/data-fetcher/components/DataTable/Columns';
import { titleCase } from '@/data-fetcher/components/DataTable/helpers/helpers';

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
export interface IFilterFns {
  fuzzy: FilterFn<unknown>;
}
export interface IFilterMeta {
  itemRank: RankingInfo;
}

interface IProps {
  data: unknown[];
}

export default function App({ data }: IProps) {
  const { searchQuery, setSearchQuery } = useSearchQueryStore();

  const [globalFilter, setGlobalFilter] = React.useState(searchQuery);

  const isTitleCaseColumnNames = true;

  const dynamicColumns = (<T extends Record<string, unknown>>() => {
    const keys: string[] = Object.keys(data[0] as T);
    const columnNames: { [key in keyof T]: string } = {} as {
      [key in keyof T]: string;
    };

    for (let i = 0, arrayLength = keys.length; i < arrayLength; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      columnNames[keys[i] as keyof typeof columnNames] = isTitleCaseColumnNames
        ? titleCase(keys[i])
        : keys[i];
    }

    return assignColumnNames(columnNames);
  })();

  const table = useReactTable({
    data,
    columns: dynamicColumns as ColumnDef<(typeof data)[0]>[],
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

  const numOfRows: number[] = [5, 10, 20];
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
            <span>
              {table.getPrePaginationRowModel().rows.length}&nbsp;
              {table.getPrePaginationRowModel().rows.length > 1
                ? 'rows'
                : 'row'}
            </span>

            {table.getPrePaginationRowModel().rows.length > numOfRows[0] && (
              <>
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
                  {numOfRows.map((pageSize) => (
                    <MenuItem key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </PageInfoContainer>

          {table.getPrePaginationRowModel().rows.length > numOfRows[0] && (
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
          )}
        </OrdersFooter>
      </OrdersLayout>
    </ThemeProvider>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 250, // Search delay
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  // let timer: NodeJS.Timeout | undefined = undefined;
  const timer = useRef<NodeJS.Timeout | null>(null);

  const [value, setValue] = React.useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
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
