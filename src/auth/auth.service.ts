import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { compare, genSalt, hash } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'

import { UserId, UserModel } from 'src/user/user.model'
import { AuthDto, RefreshTokenDto } from './dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		const tokens = await this.getTokens(String(user._id))

		return {
			user: this.getUserFields(user),
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.UserModel.findOne({ email: dto.email })
		if (oldUser) {
			throw new BadRequestException(
				`User with email: ${oldUser.email} already exist!`
			)
		}

		const salt = await genSalt(10)
		const newUser = await new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt)
		}).save()

		const tokens = await this.getTokens(String(newUser._id))

		return {
			user: this.getUserFields(newUser),
			...tokens
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException('Please sign in!')

		const result = await this.jwtService.verifyAsync<UserModel>(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid token or expired!')

		const user = await this.UserModel.findById(result._id)

		const tokens = await this.getTokens(String(user._id))

		return {
			user: this.getUserFields(user),
			...tokens
		}
	}

	async validateUser(dto: AuthDto): Promise<UserModel> {
		const user = await this.UserModel.findOne({ email: dto.email })

		if (!user) throw new UnauthorizedException('User not found')

		const isValidPassword = await compare(dto.password, user.password)

		if (!isValidPassword) throw new UnauthorizedException('Invalid password')

		return user
	}

	async getTokens(userId: UserId) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d'
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1d'
		})

		return { accessToken, refreshToken }
	}

	getUserFields({ _id, email, isAdmin }: UserModel) {
		return {
			_id,
			email,
			isAdmin
		}
	}
}
