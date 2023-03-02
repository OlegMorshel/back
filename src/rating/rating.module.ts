import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { MovieModel } from 'src/movie/movie.model'
import { MovieModule } from 'src/movie/movie.module'
import { MovieService } from 'src/movie/movie.service'
import { TelegramModule } from 'src/telegram/telegram.module'
import { TelegramService } from 'src/telegram/telegram.service'
import { RatingController } from './rating.controller'
import { RatingModel } from './rating.model'
import { RatingService } from './rating.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{ typegooseClass: RatingModel, schemaOptions: { collection: 'Rating' } },
			{ typegooseClass: MovieModel, schemaOptions: { collection: 'Movie' } }
		]),
		MovieModule,
		TelegramModule,
		ConfigModule
	],
	controllers: [RatingController],
	providers: [RatingService, MovieService, TelegramService, ConfigService]
})
export class RatingModule {}
