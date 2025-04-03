import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthService } from './auth.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @ApiOkResponse({
    description: 'Login with email and password',
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto) {
    return this.authService.validateLogin(loginDto);
  }
}
