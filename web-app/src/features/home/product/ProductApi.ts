import { ApiBaseService } from 'shared/services/api/api-base.service'
import { QueryPaginatorInterface } from 'shared/utils/query-paginator-interface'
import { ResponsePaginatorInterface } from 'shared/utils/response-paginator-interface'
import { parseUrl } from 'shared/utils/parse-url'
import { ProductInterface } from './product-interface'

interface GetProductQueryInterface extends QueryPaginatorInterface {
  search?: string
}

export const requestGetProducts = (
  query: GetProductQueryInterface
): Promise<ResponsePaginatorInterface<ProductInterface>> =>
  ApiBaseService.get(parseUrl('/api/v1/product', query))
