export function convertFromJSONstring(dateString: string): Date {
  return new Date(JSON.parse(dateString.match(/\d+/)[0]));
}
