import { BadRequestException, Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from './aws-s3.service';
import { MulterFileDto } from './dto/multerFile.dto';
import {
  ApiBadRequestResponse, ApiBody, ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { Response } from "express";
import { ResponseErrorMessageDto } from "../../config/dto";
import { UrlResponseDto } from "./dto/url-response.dto";
import { CookiesEnum } from "../../config/enums/cookies.enum";

@ApiTags('upload')
@Controller('upload')
export class AwsS3Controller {
  constructor(private awsS3Service: AwsS3Service) {
  }

  @ApiOperation({summary: 'Загрузка файлов на сервер'})
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @ApiBody({
    type: MulterFileDto
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Документ успешно загружен на сервер',
    type: UrlResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не авторизован',
    type: ResponseErrorMessageDto,
  })
  @ApiPayloadTooLargeResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: 'Превышен лимит на размер файла 5Mb',
    type: ResponseErrorMessageDto,
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFileDto,
    @Res() res: Response
  ) {

    const url = await this.awsS3Service.uploadFile(file);
    if (!url) {
      throw new BadRequestException('Не удалось загрузить файл на сервер');
    }

    res
      .status(HttpStatus.CREATED)
      .json({url})
      .send();
  }
}
