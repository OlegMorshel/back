import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { MovieModel } from 'src/movie/movie.model'
import { MovieModule } from 'src/movie/movie.module'
import { MovieService } from 'src/movie/movie.service'
import { TelegramModule } from 'src/telegram/telegram.module'
import { GenreController } from './genre.controller'
import { GenreModel } from './genre.model'
import { GenreService } from './genre.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{ typegooseClass: GenreModel, schemaOptions: { collection: 'Genre' } },
			{ typegooseClass: MovieModel, schemaOptions: { collection: 'Movie' } }
		]),
		MovieModule,
		TelegramModule,
		ConfigModule
	],
	controllers: [GenreController],
	providers: [GenreService, MovieService]
})
export class GenreModule {}
