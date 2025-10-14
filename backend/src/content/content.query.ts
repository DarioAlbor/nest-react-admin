import { PaginationDto } from '../common/dto/pagination.dto';

export class ContentQuery extends PaginationDto {
  name?: string;
  description?: string;
}
