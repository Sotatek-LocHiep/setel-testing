import { PaginatorInterface } from './pagination-interface'

export interface ResponsePaginatorInterface<T> {
  data: T[]
  meta: {
    pagination: PaginatorInterface
  }
}
