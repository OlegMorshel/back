import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { MovieService } from 'src/movie/movie.service'
import { SetRatingDto } from './dto/set-rating.dto'
import { RatingModel } from './rating.model'

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel)
		private readonly RatingModel: ModelType<RatingModel>,
		private readonly MovieService: MovieService
	) {}

	getMovieValueByUser = async (movie: Types.ObjectId, user: Types.ObjectId) =>
		this.RatingModel.findOne({ movie, user })
			.select('value')
			.exec()
			.then((data) => (data ? data.value : 0))

	setRating = async (user: Types.ObjectId, dto: SetRatingDto) => {
		const { movieId, value } = dto

		const newRating = await this.RatingModel.findOneAndUpdate(
			{ movie: movieId, user },
			{
				movieId,
				user,
				value
			},
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true
			}
		).exec()
		const avarageRating = await this.averageRatingByMovie(movieId)

		await this.MovieService.updateRating(movieId, avarageRating)

		return newRating
	}

	private averageRatingByMovie = async (movieId: Types.ObjectId | string) => {
		const ratingMovie: RatingModel[] = await this.RatingModel.aggregate().match(
			{
				movie: new Types.ObjectId(movieId)
			}
		)

		return (
			ratingMovie.reduce((acc, item) => acc + item.value, 0) /
			ratingMovie.length
		)
	}
}
