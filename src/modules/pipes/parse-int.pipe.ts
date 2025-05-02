import { ArgumentMetadata, BadRequestException,Injectable, PipeTransform } from "@nestjs/common";
import { isNumber } from "class-validator";

@Injectable()
export class ParseIntCustomPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {        
        if(isNumber(value)) {
            console.log(value);
            return Number(value)
        } else {
            throw new BadRequestException(`${metadata.data} must be a number`);
        }
    }
}