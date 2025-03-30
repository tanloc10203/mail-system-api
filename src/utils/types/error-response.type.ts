import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ type: Number, example: 400 })
  statusCode: number;

  @ApiProperty({ type: String, example: 'Bad Request' })
  message: string;

  @ApiProperty({
    type: Object,
    nullable: true,
    example: {
      email: 'Email already exists',
      password: 'Password must be at least 6 characters',
    },
  })
  details: Record<string, string> | null;

  @ApiProperty({ type: Number, nullable: true, example: 111111 })
  errorCode: number | null;

  @ApiProperty({ type: String, nullable: true, example: 'Error message' })
  stack?: string | null;
}
