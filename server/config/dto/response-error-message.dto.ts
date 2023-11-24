import { ApiProperty } from '@nestjs/swagger';

export class ResponseErrorMessageDto {
  @ApiProperty({
    description: 'Response message',
    oneOf: [{ type: 'array', items: { type: 'string' } }, { type: 'string' }],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Type of error',
  })
  error: string;

  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;
}
