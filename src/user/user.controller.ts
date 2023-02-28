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
import { Auth } from 'src/auth/decorators'
import { IdValidationPipe } from 'src/pipes'
import { User } from './decorators'
import { UpdateUserDto } from './dto'
import { UserId, UserModel } from './user.model'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: UserId): Promise<UserModel> {
		return this.userService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@User('_id') _id: UserId, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateUser(
		@Param('id', IdValidationPipe) _id: UserId,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(_id, dto)
	}

	@Get('count')
	@HttpCode(200)
	@Auth('admin')
	async getCountUsers() {
		return this.userService.getCount()
	}

	@Get()
	@HttpCode(200)
	@Auth('admin')
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm)
	}

	@Get(':id')
	@HttpCode(200)
	@Auth('admin')
	async getUser(@Param('id', IdValidationPipe) _id: UserId) {
		return this.userService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) _id: UserId) {
		return this.userService.delete(_id)
	}
}
