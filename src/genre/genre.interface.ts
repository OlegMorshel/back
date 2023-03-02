import { Types } from 'mongoose'

export interface IPublicGenre {
	_id: Types.ObjectId
	name: string
	description: string
	slug: string
	icon: string
}

export interface ICollection {
	_id: string
	image: string
	title: string
	slug: string
}
