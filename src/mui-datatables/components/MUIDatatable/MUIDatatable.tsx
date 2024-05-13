import MUIDataTable, { MUIDataTableColumnDef } from 'mui-datatables';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import Data, { User } from '../../helpers/Data';

interface Props {
  title: string;
  customColumnNames?: MUIDataTableColumnDef[];
  data: object[];
}

const muiCache = createCache({
  key: 'mui-datatables',
  prepend: true,
});

export default function MUIDatatable({ title, customColumnNames }: Props) {
  // const [responsive, setResponsive] = useState('vertical');
  const [tableBodyHeight] = useState('100%');
  const [tableBodyMaxHeight] = useState<string>('1000%');
  const [searchBtn] = useState<boolean>(true);
  const [downloadBtn] = useState<boolean>(true);
  const [printBtn] = useState<boolean>(true);
  const [viewColumnBtn] = useState<boolean>(true);
  const [filterBtn] = useState<boolean>(true);

  let timer: NodeJS.Timeout | undefined = undefined;

  const [isLoading, setIsLOading] = useState<boolean>(false);

  const [columnNames, setColumnNames] = useState<MUIDataTableColumnDef[]>(
    customColumnNames ?? [],
  );

  const [rowValues, setRowValues] = useState<
    Array<object | string[] | number[]>
  >([]);

  const columnNameAliases = useRef<HTMLElement[]>([]);

  const oldCellValue = useRef<string>('');

  function extractData(result: User[]) {
    const array = result;
    const dataColumnNames = Object.keys(array[0]);
    const rowValues = [];
    for (let i = 0, arrayLength = array.length; i < arrayLength; i++) {
      const row = array[i];
      rowValues.push(Object.values(row));
    }
    return {
      rowValues,
      dataColumnNames,
    };
  }

  const fetchFreshData = useCallback(async () => {
    try {
      const result = (await Data()) as unknown as User[];
      const { dataColumnNames, rowValues } = extractData(result);
      setColumnNames(customColumnNames ?? dataColumnNames);
      setRowValues(rowValues);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [customColumnNames]);

  useEffect(() => {
    if (rowValues.length === 0) {
      void (async () => {
        await fetchFreshData();
      })();
    }
  }, [fetchFreshData, rowValues.length]); // Remove unnecessary dependencies

  const options: object = {
    //==========AJAX==========//
    // serverSide: true,
    onTableChange: (action: string, state: { [key: string]: string }) => {
      console.dir(action);
      // setIsLOading(true);

      if (action === 'changeRowsPerPage') {
        console.log(state.rowsPerPage);
      }

      if (action === 'viewColumnsChange' && state.searchText) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          void fetchFreshData();
        }, 1000);
      }

      if (action === 'search' && state.searchText) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          const query: string = state.searchText;
          // Reset state
          fetch(`http://localhost:5000/api/users`, {
            // *GET, POST, PUT, DELETE
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            // For POST/PUT requests
            body: JSON.stringify({ searchQuery: query }),
          })
            .then((response) => response.json())
            .then((result: User[]) => {
              // Success
              if (result.length !== 0) {
                setRowValues(extractData(result).rowValues);
              } else {
                setRowValues([]);
              }
              setIsLOading(false);
            })
            .catch(() => {});
        }, 1000);
      }
      if (action === 'search' && !state.searchText) {
        // alert(state.searchText)
        void (async () => {
          await fetchFreshData();
        })();
      }
    },
    //==========AJAX==========//
    pagination: true,
    resizableColumns: false,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10],
    selectableRows: 'multiple', // single, multiple, none
    // selectableRowsOnClick: true,
    // rowsSelected: [1], // Pre-selected rows
    responsive: 'standard',
    draggableColumns: {
      enabled: true,
      transitionTime: 500,
    },
    expandableRows: false,
    search: searchBtn, // Show search button
    searchOpen: true, // Show search bar  on initial render
    // searchText: "Initial search query",
    searchPlaceholder: 'Search placeholder',
    searchProps: {
      onBlur: (_e: Event) => {
        // console.log("onBlur!");
      },
      onKeyUp: (_e: Event) => {
        // console.log(e);
      },
    },
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: 'dropdown',
    tableBodyHeight,
    tableBodyMaxHeight,

    textLabels: {
      body: {
        noMatch: 'Sorry, no matching records found',
      },
    },

    rowHover: true,

    selectableRowsHideCheckboxes: true, // Show/Hide row checkboxes
    selectableRowsHeader: false, // Show/Hide select-all-rows checkbox

    customRowRender: (row: string[], rowIndex: number) => {
      return (
        <TableRow key={rowIndex}>
          {/* <TableCell>
            <Checkbox />
          </TableCell> */}
          {row.map((cellValue: string, cellIndex: number) => {
            return (
              <TableCell
                // contentEditable="true"
                // suppressContentEditableWarning={true}
                onBlur={(e) => {
                  e.target.setAttribute('contenteditable', 'false');
                  if (e.target.dataset.rowId != null) {
                    const rowID: number = parseInt(e.target.dataset.rowId);

                    fetch(`http://localhost:5000/api/users/${String(rowID)}`, {
                      // *GET, POST, PATCH, PUT, DELETE
                      method: 'PATCH',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      // For POST/PUT requests
                      body: JSON.stringify({
                        columnName: columnNameAliases.current[cellIndex],
                        newValue: e.target.innerHTML,
                      }),
                    })
                      .then((response) => response.json())
                      .then((result: { affectedRows: number }) => {
                        // Success
                        if (!result.affectedRows) {
                          e.target.innerHTML = oldCellValue.current;
                          console.log('Failed to update cell value');
                        }
                      })
                      .catch(() => {
                        e.target.innerHTML = oldCellValue.current;
                      });
                  }

                  // alert(
                  //   `Row ID: ${rowID}\nCell Column Index: ${cellIndex}\nCell Value: ${e.target.innerHTML}`
                  // );
                }}
                onDoubleClick={(e) => {
                  if (e.target instanceof HTMLElement) {
                    oldCellValue.current = e.target.innerHTML;
                    e.target.setAttribute('contenteditable', 'true');
                    e.target.focus();
                  }
                }}
                data-row-id={row[0]}
                key={cellIndex}
              >
                {cellValue}
              </TableCell>
            );
          })}
        </TableRow>
      );
    },
  };

  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={createTheme()}>
        <div style={{ userSelect: 'none' }}>
          {isLoading && <h1>Loading</h1>}

          {!isLoading && (
            <MUIDataTable
              title={title}
              data={rowValues}
              columns={columnNames}
              options={options}
            />
          )}
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
