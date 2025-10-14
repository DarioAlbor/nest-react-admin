import { PaginationDto } from '../common/dto/pagination.dto';

export class UserQuery extends PaginationDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
}
