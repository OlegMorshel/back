import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { ActorId } from 'src/actor/actor.model'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieId, MovieModel } from './movie.model'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
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
		// Telegram notification

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
}
