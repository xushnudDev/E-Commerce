import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CheckFileSizePipe implements PipeTransform {
  constructor(private readonly limit: number) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fayl yuborilmagan');
    }
    if (file.size > this.limit) {
      throw new BadRequestException(`Fayl hajmi ${this.limit / (1024 * 1024)}MB dan oshmasligi kerak`);
    }
    return file;
  }
}
