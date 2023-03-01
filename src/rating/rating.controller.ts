import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators'
import { IdValidationPipe } from 'src/pipes'
import { User } from 'src/user/decorators'
import { SetRatingDto } from './dto/set-rating.dto'
import { RatingService } from './rating.service'

@Controller('ratings')
export class RatingController {
	constructor(private readonly RatingService: RatingService) {}

	@Get(':movieId')
	@Auth()
	@HttpCode(200)
	async getMovieValue(
		@User('_id') _id: Types.ObjectId,
		@Param('movieId', IdValidationPipe) movieId: Types.ObjectId
	) {
		return this.RatingService.getMovieValueByUser(movieId, _id)
	}

	@UsePipes(new ValidationPipe())
	@Post('set-rating')
	@HttpCode(200)
	@Auth()
	async setRating(@User('_id') _id: Types.ObjectId, @Body() dto: SetRatingDto) {
		return this.RatingService.setRating(_id, dto)
	}
}
