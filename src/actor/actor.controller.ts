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
import { ActorDto } from './actor.dto'
import { IPublicActor } from './actor.interface'
import { ActorId } from './actor.model'
import { ActorService } from './actor.service'

@Controller('actors')
export class ActorController {
	constructor(private readonly ActorService: ActorService) {}

	@Get('by-slug/:slug')
	@HttpCode(200)
	async getGenreBySlug(@Param('slug') slug: string): Promise<IPublicActor> {
		return this.ActorService.bySlug(slug)
	}

	@Get()
	@HttpCode(200)
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.ActorService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	@HttpCode(200)
	async getGenreById(
		@Param('id', IdValidationPipe) _id: ActorId
	): Promise<IPublicActor> {
		return this.ActorService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') _id: ActorId, @Body() dto: ActorDto) {
		return this.ActorService.update(_id, dto)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.ActorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) _id: ActorId) {
		return this.ActorService.delete(_id)
	}
}
