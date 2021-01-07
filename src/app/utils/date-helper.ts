export function convertFromJSONstring(dateString: string): Date {
  if (dateString === '/Date(-62135596800000)/') {
    return null;
  } else {
    return new Date(JSON.parse(dateString.match(/\d+/)[0]));
  }
}
