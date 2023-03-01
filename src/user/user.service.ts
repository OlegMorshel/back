import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateUserDto } from './dto'
import { UserId, UserModel } from './user.model'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async byId(_id: UserId) {
		const user = await this.UserModel.findById(_id)

		if (!user) throw new NotFoundException('User not found!')

		return user
	}

	async updateProfile(_id: UserId, dto: UpdateUserDto) {
		const user = await this.byId(_id)

		const sameUser = await this.UserModel.findOne({ email: dto.email })

		if (sameUser && _id === String(sameUser._id)) {
			throw new NotFoundException('Email busy')
		}

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}
		user.email = dto.email

		if (dto.isAdmin !== undefined) {
			user.isAdmin = dto.isAdmin
		}

		return await user.save()
	}

	getCount = async () => this.UserModel.find().count().exec()

	getAll = async (searchTerm?: string) => {
		let options = {}

		if (searchTerm)
			options = {
				$or: [{ email: new RegExp(searchTerm, 'i') }]
			}

		return this.UserModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	delete = async (id: UserId) => this.UserModel.findByIdAndDelete(id).exec()

	toggleFavorite = async (movieId: Types.ObjectId, user: UserModel) => {
		const { _id, favorites } = user

		await this.UserModel.findByIdAndUpdate(_id, {
			favorites: favorites.includes(movieId)
				? favorites.filter((id) => String(id) !== String(movieId))
				: [...favorites, movieId]
		})
	}

	getFavoriteMovies = async (_id: Types.ObjectId) =>
		this.UserModel.findById(_id, 'favorite')
			.populate({
				path: 'favorites',
				populate: { path: 'genres' }
			})
			.exec()
			.then((data) => data.favorites)
}
