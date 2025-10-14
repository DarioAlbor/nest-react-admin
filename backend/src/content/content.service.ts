import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { PaginatedResult } from '../common/dto/pagination.dto';
import { CourseService } from '../course/course.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { ContentQuery } from './content.query';

@Injectable()
export class ContentService {
  constructor(private readonly courseService: CourseService) {}

  async save(
    courseId: string,
    createContentDto: CreateContentDto,
  ): Promise<Content> {
    const { name, description } = createContentDto;
    const course = await this.courseService.findById(courseId);
    return await Content.create({
      name,
      description,
      course,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(contentQuery: ContentQuery): Promise<PaginatedResult<Content>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC',
      ...filters
    } = contentQuery;

    // build where conditions
    const whereConditions: any = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key].trim() !== '') {
        whereConditions[key] = ILike(`%${filters[key]}%`);
      }
    });

    // build order
    const order: any = {};
    if (sortBy && ['name', 'description', 'dateCreated'].includes(sortBy)) {
      order[sortBy] = sortOrder;
    } else {
      order.name = 'ASC';
    }

    // calculate pagination
    const skip = (page - 1) * limit;

    // execute queries
    const [data, total] = await Content.findAndCount({
      where: whereConditions,
      order,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string): Promise<Content> {
    const content = await Content.findOne(id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return content;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    const content = await Content.findOne({ where: { courseId, id } });
    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return content;
  }

  async findAllByCourseId(
    courseId: string,
    contentQuery: ContentQuery,
  ): Promise<PaginatedResult<Content>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC',
      ...filters
    } = contentQuery;

    // build where conditions
    const whereConditions: any = { courseId };
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key].trim() !== '') {
        whereConditions[key] = ILike(`%${filters[key]}%`);
      }
    });

    // build order
    const order: any = {};
    if (sortBy && ['name', 'description', 'dateCreated'].includes(sortBy)) {
      order[sortBy] = sortOrder;
    } else {
      order.name = 'ASC';
    }

    // calculate pagination
    const skip = (page - 1) * limit;

    // execute queries
    const [data, total] = await Content.findAndCount({
      where: whereConditions,
      order,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async update(
    courseId: string,
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    const content = await this.findByCourseIdAndId(courseId, id);
    return await Content.create({ id: content.id, ...updateContentDto }).save();
  }

  async delete(courseId: string, id: string): Promise<string> {
    const content = await this.findByCourseIdAndId(courseId, id);
    await Content.delete(content);
    return id;
  }

  async count(): Promise<number> {
    return await Content.count();
  }
}
