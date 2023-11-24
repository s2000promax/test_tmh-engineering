import { ApiProperty } from "@nestjs/swagger";

export class UrlResponseDto {
  @ApiProperty({
    description: 'url загруженного документа',
  })
  url: string;
}
