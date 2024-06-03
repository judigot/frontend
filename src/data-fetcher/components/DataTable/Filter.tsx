import { FilterFn } from '@tanstack/react-table';

/*
 * Normalizes cell values for consistent processing.
 * Converts Dates to ISO strings, arrays and objects to JSON strings,
 * and other types to strings.
 */
function normalizeCellValue(
  cellValue: Date | string | Array<string | number | object> | object,
): string {
  if (cellValue instanceof Date) {
    return cellValue.toISOString();
  }
  if (Array.isArray(cellValue) || typeof cellValue === 'object') {
    return JSON.stringify(cellValue);
  }
  return String(cellValue);
}

/*
 * Normalizes and sanitizes a string by removing spaces and converting to uppercase.
 */
function normalizeString(str: string): string {
  return str.replace(/\s+/g, '').toUpperCase();
}

/*
 * A fuzzy filter function for table rows.
 * Normalizes cell values and concatenates them into a single string.
 * Sanitizes the row string and the search input by removing spaces and converting to uppercase.
 * Checks if the search input is included in the row string.
 */
export const fuzzyFilter: FilterFn<unknown> = (
  row,
  _columnId,
  searchInput: string,
  _addMeta,
) => {
  // Extract, normalize, and concatenate cell values from the row
  const rowContent = row
    .getVisibleCells()
    .map((cell) =>
      normalizeCellValue(
        cell.getValue() as
          | Date
          | string
          | Array<string | number | object>
          | object,
      ),
    )
    .join(' ');

  // Normalize and sanitize search input and row string
  const normalizedSearchInput = normalizeString(searchInput);
  const normalizedRowContent = normalizeString(rowContent);

  // Check if the sanitized row string includes the sanitized search input
  return normalizedRowContent.includes(normalizedSearchInput);
};
