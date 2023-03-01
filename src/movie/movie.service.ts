import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { ActorId } from 'src/actor/actor.model'
import { TelegramService } from 'src/telegram/telegram.service'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieId, MovieModel } from './movie.model'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
		private readonly TelegramService: TelegramService
	) {}

	getAll = async (searchTerm?: string) => {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec()
	}
	bySlug = async (slug: string) => {
		const movies = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()
		if (!movies) throw new NotFoundException('Movies not found')
		return movies
	}

	byActor = async (actorId: ActorId) => {
		const movies = await this.MovieModel.findOne({ actors: actorId }).exec()
		if (!movies) throw new NotFoundException('Movies not found')
		return movies
	}

	byGenres = async (genreIds: Types.ObjectId[]) => {
		const movies = await this.MovieModel.findOne({
			genres: { $in: genreIds }
		}).exec()
		if (!movies) throw new NotFoundException('Movies not found')
		return movies
	}

	getMostPopulars = async () =>
		this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()

	updateCountOpened = async (slug: string) => {
		const movie = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 }
			},
			{ new: true }
		).exec()
		if (!movie) throw new NotFoundException('Movie not found')
		return movie
	}

	updateRating = async (id: Types.ObjectId, rating: number) =>
		this.MovieModel.findByIdAndUpdate(id, { rating }, { new: true }).exec()

	// Admin responsibility

	byId = async (_id: MovieId) => {
		const movie = await this.MovieModel.findById(_id)

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}

	create = async () => {
		const initialValue: UpdateMovieDto = {
			actors: [],
			bigPoster: '',
			genres: [],
			poster: '',
			slug: '',
			title: '',
			videoUrl: ''
		}
		const movie = await this.MovieModel.create(initialValue)
		return movie._id
	}

	update = async (_id: MovieId, dto: UpdateMovieDto) => {
		if (!dto.isSendTelegram) {
			await this.sendNotification(dto)
			dto.isSendTelegram = true
		}

		const movie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()
		if (!movie) throw new NotFoundException('Movie not found')
		return movie
	}

	delete = async (_id: MovieId) => {
		const movie = await this.MovieModel.findByIdAndDelete(_id).exec()
		if (!movie) throw new NotFoundException('Movie not found')
		return movie
	}

	private sendNotification = async (dto: UpdateMovieDto) => {
		// if (process.env.NODE_ENV !== 'development') {
		await this.TelegramService.sendPhoto(
			'https://avatars.dzeninfra.ru/get-zen_doc/5335282/pub_60df27dcbaf4b439d333ecf8_60df27e9baf4b439d3341264/scale_1200'
		)
		// }

		const msg = `<b>${dto.title}</b>`

		await this.TelegramService.sendMessage(msg, {
			reply_markup: {
				inline_keyboard: [
					[{ url: 'https://okko.tv/movie/free-guy', text: 'Go to watch' }]
				]
			}
		})
	}
}
