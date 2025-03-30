import { ErrorResponse } from '@/utils/types';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AcceptLang, UseLanguageInterceptor } from '@/@core/interceptor';

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
  create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return this.userService.create(createProfileDto);
  }
}
