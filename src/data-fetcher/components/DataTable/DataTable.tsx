import React, { useRef, useState } from 'react';
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
import { useDataTableStore } from './store';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import TextField from '@mui/material/TextField/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { exactMatchFilter } from './Filter';
import assignColumnNames from '@/data-fetcher/components/DataTable/Columns';
import { titleCase } from '@/data-fetcher/components/DataTable/helpers/helpers';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface IProps {
  totalRecords?: number;
  data: unknown[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function DataTable({
  totalRecords = undefined,
  data,
  isLoading = false,
  isError = false,
}: IProps) {
  const { searchQuery, setSearchQuery } = useDataTableStore();

  const isTitleCaseColumnNames = true;

  const dynamicColumns = (<T extends Record<string, unknown>>() => {
    if (data.length === 0) return [];
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

  const numOfRowsOptions: number[] = [5, 10, 20];

  const table = useReactTable({
    data,
    columns: dynamicColumns as ColumnDef<(typeof data)[0]>[],
    enableColumnFilters: false,
    filterFns: {},
    state: {
      globalFilter: searchQuery.query,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: numOfRowsOptions[0],
      },
    },
    globalFilterFn: exactMatchFilter,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const pageNumber: number = table.getState().pagination.pageIndex + 1;
  const resultsLength = table.getPrePaginationRowModel().rows.length;
  const actualRowCount = totalRecords ?? resultsLength;
  const rowCountPerPage = table.getState().pagination.pageSize;
  const totalPages = (() => {
    if (searchQuery.query !== '') {
      return Math.ceil(data.length / rowCountPerPage);
    }

    if (totalRecords !== undefined) {
      return Math.ceil(totalRecords / rowCountPerPage);
    }

    return table.getPageCount();
  })();
  const visibleRowsCount = table.getRowModel().rows.length;

  const displayMessage = isLoading
    ? 'Loading...'
    : isError
      ? 'Error loading data.'
      : resultsLength === 0
        ? 'No records found.'
        : searchQuery.query === ''
          ? `Displaying ${String(rowCountPerPage)} records out of ${String(
              actualRowCount.toLocaleString(),
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
          : resultsLength === 0
            ? `No records found for "${searchQuery.query}". Displaying 0 of ${actualRowCount.toLocaleString()} records.`
            : `Displaying ${String(Math.min(rowCountPerPage, visibleRowsCount))} of ${resultsLength.toLocaleString()} records for "${searchQuery.query}".`;

  return (
    <ThemeProvider theme={darkTheme}>
      <h1 style={{ textAlign: 'center' }}>
        {JSON.stringify(searchQuery, null, 4)}
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'repeat(3, 1fr)',
          color: 'red !important',
          height: 100,
          width: '100%',
          backgroundColor: 'black',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            width: '100%',
          }}
        >
          <div style={{ padding: 20, textAlign: 'center' }}>
            <DebouncedInput
              value={searchQuery.query}
              onChange={(value) => {
                setSearchQuery({
                  query: String(value),
                });
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            backgroundColor: 'black',
            height: '100%',
            width: '100%',
          }}
        >
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
                                onKeyDown={() => {
                                  return false;
                                }}
                                tabIndex={0}
                                aria-label="Close modal"
                                style={{
                                  cursor: 'pointer',
                                  width: 'max-content',
                                }}
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
                                        asc: ' (Ascending)',
                                        desc: ' (Descending)',
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
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={dynamicColumns.length}
                      style={{ textAlign: 'center' }}
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={dynamicColumns.length}
                      style={{ textAlign: 'center' }}
                    >
                      Error loading data
                    </TableCell>
                  </TableRow>
                ) : resultsLength > 0 ? (
                  table.getRowModel().rows.map((row) => {
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
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={dynamicColumns.length}
                      style={{ textAlign: 'center' }}
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            backgroundColor: 'black',
            width: '100%',
          }}
        >
          <div
            style={{ color: 'white', padding: 20, margin: 'auto 0% auto 0%' }}
          >
            <span>{displayMessage}</span>

            <span> | </span>
            <span className="flex items-center gap-1">
              <span>Page </span>
              <strong>
                {`${String(pageNumber)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} of ${String(
                  totalPages,
                )
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
              </strong>
            </span>
            <span> | </span>

            {/* Page selector */}
            {/* <span className="flex items-center gap-1">
              Page: &nbsp;
              <Select
                value={pageNumber - 1}
                renderValue={(value) => value + 1}
                onChange={(e) => {
                  setSearchQuery({
                    page: Number(e.target.value),
                  });
                  table.setPageIndex(Number(e.target.value));
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    Page {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </span> */}

            <Select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {numOfRowsOptions.map((pageSize) => (
                <MenuItem key={pageSize} value={pageSize}>
                  Show {pageSize}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div
            style={{
              padding: 20,
              textAlign: 'right',
              position: 'relative',
              float: 'right',
            }}
          >
            <IconButton
              size="large"
              aria-label="first page"
              className="border rounded p-1"
              onClick={() => {
                const targetPage = 1;
                table.setPageIndex(targetPage - 1);
                setSearchQuery({
                  page: targetPage,
                });
              }}
              disabled={pageNumber === 1}
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
              disabled={!(pageNumber > 1)}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="next page"
              className="border rounded p-1"
              onClick={() => {
                table.nextPage();
                if (pageNumber * rowCountPerPage === resultsLength) {
                  // Fetch new data
                  setSearchQuery({ page: pageNumber });
                }
              }}
              disabled={!(pageNumber < totalPages)}
            >
              <NavigateNextIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="last page"
              className="border rounded p-1"
              onClick={() => {
                const targetPage = totalPages;
                table.setPageIndex(targetPage - 1);
                setSearchQuery({
                  page: targetPage,
                });
              }}
              disabled={pageNumber === totalPages}
            >
              <LastPageIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
}: {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
}) {
  const [value, setValue] = useState(initialValue);
  const debounceTimeout = useRef<number | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (debounceTimeout.current != null) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = window.setTimeout(() => {
      onChange(newValue);
    }, debounce);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (debounceTimeout.current != null) {
        clearTimeout(debounceTimeout.current);
      }
      onChange(value);
    }
  };

  return (
    <TextField
      id="searchInput"
      label="Search"
      variant="outlined"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      inputProps={{
        autoFocus: true,
        style: {
          backgroundColor: 'black',
          textAlign: 'center',
        },
      }}
    />
  );
}
