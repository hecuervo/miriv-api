import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  ServiceUnavailableException,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { StorageFile } from "src/storage/storage-file";
import { StorageService } from "src/storage/storage.service";

@Controller("media")
export class MediaController {
  constructor(private storageService: StorageService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
    })
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
    @Body("mediaId") mediaId: string
  ) {
    if (!file) {
      throw new NotFoundException("file not found");
    }
    await this.storageService.save(
      folder + '/' + mediaId + '.' + file.originalname.split('.').pop(),
      file.mimetype,
      file.buffer,
      [{ mediaId: mediaId }],
    );
  }

  @Get("/:folder/:mediaId")
  async downloadMedia(@Param("mediaId") mediaId: string,@Param('folder') folder: string, @Res() res: Response) {
    let storageFile: StorageFile;
    try {
      
      storageFile = await this.storageService.getWithMetaData(
        folder + '/' + mediaId,
      );
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("image not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }
    res.setHeader("Content-Type", storageFile.contentType);
    res.setHeader("Cache-Control", "max-age=60d");
    res.end(storageFile.buffer);
  }
}