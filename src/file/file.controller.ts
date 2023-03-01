import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/auth/decorators'
import { FileService } from './file.service'

@Controller('files')
export class FileController {
	constructor(private readonly FileService: FileService) {}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	@UseInterceptors(FileInterceptor('image'))
	async create(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	) {
		return this.FileService.saveFiles([file], folder)
	}
}
