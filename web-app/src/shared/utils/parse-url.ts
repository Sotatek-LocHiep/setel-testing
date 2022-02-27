import qs from 'query-string'
export function parseUrl(url: string, query: any) {
  return qs.stringifyUrl({ url: url, query })
}
