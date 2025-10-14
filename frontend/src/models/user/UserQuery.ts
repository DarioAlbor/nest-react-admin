import { PaginationParams } from '../../types/pagination';

export default interface UserQuery extends PaginationParams {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
}
