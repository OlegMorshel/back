import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators'
import { IdValidationPipe } from 'src/pipes'
import { UpdateGenreDto } from './dto'
import { IPublicGenre } from './genre.interface'
import { GenreId } from './genre.model'
import { GenreService } from './genre.service'

@Controller('genres')
export class GenreController {
	constructor(private readonly GenreService: GenreService) {}

	@Get('by-slug/:slug')
	@HttpCode(200)
	async getGenreBySlug(@Param('slug') slug: string): Promise<IPublicGenre> {
		return this.GenreService.bySlug(slug)
	}

	@Get('/collections')
	@HttpCode(200)
	async getCollections() {
		return this.GenreService.getCollections()
	}

	@Get()
	@HttpCode(200)
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.GenreService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	@HttpCode(200)
	async getGenreById(
		@Param('id', IdValidationPipe) _id: GenreId
	): Promise<IPublicGenre> {
		return this.GenreService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') _id: GenreId, @Body() dto: UpdateGenreDto) {
		return this.GenreService.update(_id, dto)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.GenreService.create()
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) _id: GenreId) {
		return this.GenreService.delete(_id)
	}
}
