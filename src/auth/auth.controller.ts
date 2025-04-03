import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthService } from './auth.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { apiResponse } from '@/@core/domain/api-response';

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

  @ApiOkResponse({
    description: 'Register with email and password',
  })
  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  public async register(@Body() registerDto: AuthRegisterLoginDto) {
    return apiResponse({
      metadata: await this.authService.register(registerDto),
      message: 'User registered successfully and email sent',
    });
  }
}
