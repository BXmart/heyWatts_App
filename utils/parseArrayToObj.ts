export function parseArrayToObj(arr: any[]): { [key: string]: number } {
  const obj: { [key: string]: number } = {};
  arr.forEach(([keyword, value]) => {
    if (value !== undefined && value !== 'None') {
      obj[keyword] = value;
    }
  });
  return obj;
}
