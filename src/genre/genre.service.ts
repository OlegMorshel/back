import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { MovieService } from 'src/movie/movie.service'
import { CreateGenreDto, UpdateGenreDto } from './dto'
import { ICollection, IPublicGenre } from './genre.interface'
import { GenreId, GenreModel } from './genre.model'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly MovieService: MovieService
	) {}

	bySlug = async (slug: string): Promise<IPublicGenre> => {
		const genre = await this.GenreModel.findOne({ slug }).exec()
		if (!genre) throw new NotFoundException('Genre not found')
		return this.getPublicGenreFormat(genre)
	}

	getAll = async (searchTerm?: string) => {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i')
					},
					{
						slug: new RegExp(searchTerm, 'i')
					},
					{
						description: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.GenreModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	getCollections = async () => {
		const genres = await this.getAll()

		const collections = await Promise.all(
			genres.map(async (genre) => {
				const moviesByGenre = await this.MovieService.byGenres([genre._id])

				const result: ICollection = {
					_id: String(genre._id),
					image: moviesByGenre[0]?.bigPoster,
					slug: genre.slug,
					title: genre.name
				}

				return result
			})
		)

		return collections
	}

	// Admin responsibility

	byId = async (_id: GenreId) => {
		const genre = await this.GenreModel.findById(_id)

		if (!genre) throw new NotFoundException('Genre not found')

		return this.getPublicGenreFormat(genre)
	}

	update = async (_id: Types.ObjectId, dto: UpdateGenreDto) => {
		const genre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()
		if (!genre) throw new NotFoundException('Genre not found')
		return this.getPublicGenreFormat(genre)
	}

	create = async () => {
		const initialValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: ''
		}
		const genre = await this.GenreModel.create(initialValue)
		return genre._id
	}

	delete = async (_id: GenreId) => {
		const genre = await this.GenreModel.findByIdAndDelete(_id).exec()
		if (!genre) throw new NotFoundException('Genre not found')
		return this.getPublicGenreFormat(genre)
	}

	private getPublicGenreFormat = ({
		_id,
		description,
		name,
		slug,
		icon
	}: GenreModel): IPublicGenre => ({
		_id,
		description,
		slug,
		name,
		icon
	})
}
