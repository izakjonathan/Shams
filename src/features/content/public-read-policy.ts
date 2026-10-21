/** Public reads must never let a single malformed record take down an entire collection. */
export function mapValidPublicRecords<Row, Result>(
  rows: readonly Row[],
  parse: (row: Row) => Result,
  onInvalid: (row: Row, error: unknown) => void,
): Result[] {
  const result: Result[] = [];
  for (const row of rows) {
    try { result.push(parse(row)); }
    catch (error) { onInvalid(row, error); }
  }
  return result;
}
