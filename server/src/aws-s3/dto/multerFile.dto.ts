import { ApiProperty } from "@nestjs/swagger";

export class MulterFileDto {
    @ApiProperty()
    fieldname: string;

    @ApiProperty()
    originalname: string;

    @ApiProperty()
    encoding: string;

    @ApiProperty()
    mimetype: string;

    @ApiProperty()
    size: number;

    @ApiProperty()
    buffer: Buffer;

    @ApiProperty()
    destination: string;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    path: string;
}
