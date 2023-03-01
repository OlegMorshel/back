import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators'
import { IdValidationPipe } from 'src/pipes'
import { User } from './decorators'
import { UpdateUserDto } from './dto'
import { UserId, UserModel } from './user.model'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: UserId): Promise<UserModel> {
		return this.UserService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@User('_id') _id: UserId, @Body() dto: UpdateUserDto) {
		return this.UserService.updateProfile(_id, dto)
	}

	@Get('profile/favorites')
	@HttpCode(200)
	@Auth()
	async getFavorites(@User('_id') _id: Types.ObjectId) {
		return this.UserService.getFavoriteMovies(_id)
	}

	@Put('profile/favorites')
	@HttpCode(200)
	@Auth()
	async updateFavorites(
		@Body() { movieId }: { movieId: Types.ObjectId },
		@User() user: UserModel
	) {
		return this.UserService.toggleFavorite(movieId, user)
	}

	// ADMIN

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateUser(
		@Param('id', IdValidationPipe) _id: UserId,
		@Body() dto: UpdateUserDto
	) {
		return this.UserService.updateProfile(_id, dto)
	}

	@Get('count')
	@HttpCode(200)
	@Auth('admin')
	async getCountUsers() {
		return this.UserService.getCount()
	}

	@Get()
	@HttpCode(200)
	@Auth('admin')
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.UserService.getAll(searchTerm)
	}

	@Get(':id')
	@HttpCode(200)
	@Auth('admin')
	async getUser(@Param('id', IdValidationPipe) _id: UserId) {
		return this.UserService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) _id: UserId) {
		return this.UserService.delete(_id)
	}
}
