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
            message: "success",
            fileUrl: path.join('uploads', fileName)
        }
    };
    async deleteFile(fileUrl: string) {
        const fileFolder = path.join(process.cwd(), fileUrl);
        try {
            if(fs.existsSync(fileFolder)) {
               await fsPromises.unlink(fileFolder); 
            } else {
                throw new Error("File not found");
            }
        } catch (error) {
            console.log("Error deleting file:", error);
        }
    };
}