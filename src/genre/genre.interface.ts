import { Types } from 'mongoose'

export interface IPublicGenre {
	_id: Types.ObjectId
	name: string
	description: string
	slug: string
	icon: string
}
