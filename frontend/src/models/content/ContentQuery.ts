import { PaginationParams } from '../../types/pagination';

export default interface ContentQuery extends PaginationParams {
  name?: string;
  description?: string;
}
