import { UserAgent } from '@/@core/decorators';
import { apiResponse, CoreApiResponse } from '@/@core/domain/api-response';
import { IUserAgentDevice } from '@/utils/types';
import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto, AuthEmailLoginResponseDto } from './dto/auth-email-login.dto';
import { AuthEmailVerifyDto } from './dto/auth-email-query.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthResendEmailDto } from './dto/auth-resend-email.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Login with email and password',
    description: 'Login with email and password',
    tags: ['Auth'],
  })
  @ApiOkResponse({
    description: 'Login with email and password',
    type: CoreApiResponse(AuthEmailLoginResponseDto),
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @UserAgent() userAgent: IUserAgentDevice,
  ) {
    return apiResponse({
      metadata: await this.authService.validateLogin(loginDto, userAgent),
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

  @ApiBearerAuth()
  @ApiSecurity('clientId')
  @ApiSecurity('refreshToken')
  @ApiOperation({
    summary: 'Get me',
    description: 'Get me',
  })
  @ApiOkResponse({
    description: 'Get me',
  })
  @UseGuards(AuthGuard)
  @Get('me')
  public getMe() {
    return apiResponse({
      metadata: 'Hello',
      message: 'Get me successfully',
    });
  }
}
