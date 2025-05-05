import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as fsPromises from "fs/promises"; 

@Injectable()
export class FsHelper {
    async uploadFile(file: Express.Multer.File) {
        const fileFolder = path.join(process.cwd(), "uploads");

        if(!fs.existsSync(fileFolder)) {
            fs.mkdirSync(fileFolder, {recursive: true});
        }

        let fileName = `${Date.now()}-image.${file.originalname.split(".")[1]}`;

        await fsPromises.writeFile(path.join(fileFolder, fileName), file.buffer);
        return {
            message: "File uploaded successfully",
            fileUrl: path.join(fileFolder, fileName)
        }
    };
    async deleteFile(fileUrl: string) {
        const fileFolder = path.join(process.cwd(), "uploads");
        const fileName = path.basename(fileUrl);
        await fsPromises.unlink(path.join(fileFolder, fileName));
        return {
            message: "File deleted successfully"

        }
    };
}