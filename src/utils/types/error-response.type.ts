import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: Object, nullable: true })
  details: Record<string, string[]> | null;

  @ApiProperty({ type: String, nullable: true })
  errorCode: string | null;

  @ApiProperty({ type: String, nullable: true })
  stack?: string | null;
}
