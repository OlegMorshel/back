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
import { ActorId } from 'src/actor/actor.model'
import { Auth } from 'src/auth/decorators'
import { IdValidationPipe } from 'src/pipes'
import { GenreIdsDto } from './dto/genreIds.dto'
import { UpdateMostPopularDto } from './dto/update-most-popular.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieId } from './movie.model'
import { MovieService } from './movie.service'

@Controller('movies')
export class MovieController {
	constructor(private readonly MovieService: MovieService) {}

	@Get('by-slug/:slug')
	@HttpCode(200)
	async getMovieBySlug(@Param('slug') slug: string) {
		return this.MovieService.bySlug(slug)
	}

	@Get('by-actor/:actorId')
	@HttpCode(200)
	async getMovieByActor(@Param('actorId', IdValidationPipe) actorId: ActorId) {
		return this.MovieService.byActor(actorId)
	}

	@UsePipes(new ValidationPipe())
	@Post('by-genres')
	@HttpCode(200)
	async getMovieByGenre(@Body() { genreIds }: GenreIdsDto) {
		return this.MovieService.byGenres(genreIds)
	}

	@Get()
	@HttpCode(200)
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.MovieService.getAll(searchTerm)
	}

	@Get('most-popular')
	@HttpCode(200)
	async getMostPopular() {
		return this.MovieService.getMostPopulars()
	}

	@UsePipes(new ValidationPipe())
	@Put('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body() dto: UpdateMostPopularDto) {
		return this.MovieService.updateCountOpened(dto.slug)
	}

	// Admin

	@Get(':id')
	@Auth('admin')
	@HttpCode(200)
	async getmovieById(@Param('id', IdValidationPipe) _id: MovieId) {
		return this.MovieService.byId(_id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.MovieService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) _id: MovieId,
		@Body() dto: UpdateMovieDto
	) {
		return this.MovieService.update(_id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) _id: MovieId) {
		return this.MovieService.delete(_id)
	}
}
