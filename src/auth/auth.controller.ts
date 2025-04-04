import { Body, Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { apiResponse } from '@/@core/domain/api-response';
import { AuthEmailVerifyDto } from './dto/auth-email-query.dto';
import { AuthResendEmailDto } from './dto/auth-resend-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Login with email and password',
    description: 'Login with email and password',
  })
  @ApiOkResponse({
    description: 'Login with email and password',
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: AuthEmailLoginDto) {
    return apiResponse({
      metadata: await this.authService.validateLogin(loginDto),
      message: 'User logged in successfully',
    });
  }

  @ApiOperation({
    summary: 'Register with email and password',
    description: 'Register with email and password',
  })
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

  @ApiOperation({
    summary: 'Verify email',
    description: 'Verify email',
  })
  @ApiOkResponse({
    description: 'Verify email',
  })
  @Post('email/verify')
  @HttpCode(HttpStatus.OK)
  public async verifyEmail(@Body() hashDto: AuthEmailVerifyDto) {
    return apiResponse({
      metadata: await this.authService.confirmEmail(hashDto.hash),
      message: 'Email verified successfully',
    });
  }

  @ApiOperation({
    summary: 'Resend email',
    description: 'Resend email',
  })
  @ApiOkResponse({
    description: 'Resend email',
  })
  @Post('email/resend')
  @HttpCode(HttpStatus.OK)
  public async resendEmail(@Body() resendDto: AuthResendEmailDto) {
    return apiResponse({
      metadata: await this.authService.resendConfirmEmail(resendDto.email),
      message: 'Resent email confirm successfully',
    });
  }
}
