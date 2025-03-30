import { apiResponse, CoreApiResponse } from '@/@core/domain/api-response';
import { AcceptLang, UseLanguageInterceptor } from '@/@core/interceptor';
import { ErrorResponse } from '@/utils/types';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user',
  })
  @ApiCreatedResponse({
    type: User,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
    type: ErrorResponse,
  })
  @AcceptLang()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseLanguageInterceptor()
  async create(@Body() createProfileDto: CreateUserDto) {
    return apiResponse({
      metadata: await this.userService.create(createProfileDto),
      message: 'User created successfully',
    });
  }

  @ApiOkResponse({
    type: CoreApiResponse(User),
  })
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users',
  })
  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  @AcceptLang()
  @UseLanguageInterceptor()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryUserDto) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const response = await this.userService.findManyWithPagination({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });

    return apiResponse({
      metadata: response.data,
      message: 'Get all users successfully',
      options: {
        page,
        limit,
        total: response.total,
        totalPage: Math.ceil(response.total / limit),
      },
    });
  }
}
