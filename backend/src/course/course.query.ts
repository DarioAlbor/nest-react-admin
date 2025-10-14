import { PaginationDto } from '../common/dto/pagination.dto';

export class CourseQuery extends PaginationDto {
  name?: string;
  description?: string;
}
