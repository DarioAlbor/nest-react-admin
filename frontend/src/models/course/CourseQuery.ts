import { PaginationParams } from '../../types/pagination';

export default interface CourseQuery extends PaginationParams {
  name?: string;
  description?: string;
}
