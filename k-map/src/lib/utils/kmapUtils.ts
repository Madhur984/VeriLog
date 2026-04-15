export const getGrayCode = (n: number): string[] => {
  if (n <= 0) return ["0"];
  if (n === 1) return ["0", "1"];
  const prev = getGrayCode(n - 1);
  const reflected = [...prev].reverse().map(s => "1" + s);
  return [...prev.map(s => "0" + s), ...reflected];
};

export const getKMapDimensions = (numVars: number): { rows: number; cols: number } => {
  switch (numVars) {
    case 2: return { rows: 2, cols: 2 };
    case 3: return { rows: 2, cols: 4 };
    case 4: return { rows: 4, cols: 4 };
    case 5: return { rows: 4, cols: 8 };
    default: return { rows: 4, cols: 4 };
  }
};

/**
 * Maps (row, col) back to the minterm index.
 */
export const getMintermIndex = (row: number, col: number, numVars: number): number => {
  const { rows, cols } = getKMapDimensions(numVars);
  const rowGray = getGrayCode(Math.log2(rows));
  const colGray = getGrayCode(Math.log2(cols));
  
  const rowBin = parseInt(rowGray[row], 2);
  const colBin = parseInt(colGray[col], 2);
  
  return (rowBin << Math.log2(cols)) | colBin;
};
