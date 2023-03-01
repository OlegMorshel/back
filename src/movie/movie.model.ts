import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { ActorModel } from 'src/actor/actor.model'
import { GenreModel } from 'src/genre/genre.model'

export type MovieId = string

export interface MovieModel extends Base {}

export class Paraments {
	@prop()
	year: number

	@prop()
	duration: number

	@prop()
	country: string
}

export class MovieModel extends TimeStamps {
	@prop()
	poster: string

	@prop()
	bigPoster: string

	@prop()
	title: string

	@prop()
	description: string

	@prop({ unique: true })
	slug: string

	@prop()
	paraments?: Paraments

	@prop({ default: 4.0 })
	rating?: number

	@prop()
	videoUrl: string

	@prop({ default: 0 })
	countOpened?: number

	@prop({ ref: () => ActorModel })
	actors: Ref<ActorModel>[]

	@prop({ ref: () => GenreModel })
	genres: Ref<GenreModel>[]

	@prop({ default: false })
	isSendTelegram?: boolean
}
