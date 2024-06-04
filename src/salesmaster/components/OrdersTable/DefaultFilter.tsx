export function DefaultFilter(
  cellValue: Date | string | (string | number | object)[] | object,
  _columnName: string,
  _cell: {
    column: { columnDef: { cell: () => void } };
    // id: object; row: object; getValue: object; renderValue: object; getContext: object; getIsGrouped: object; getIsPlaceholder: object; getIsAggregated: object;
  },
) {
  if (cellValue.constructor.name === 'Date') {
    return String(cellValue);
  }
  if (['Array', 'Object'].includes(cellValue.constructor.name)) {
    return JSON.stringify(cellValue);
  }
  return cellValue;
}

export default DefaultFilter;
