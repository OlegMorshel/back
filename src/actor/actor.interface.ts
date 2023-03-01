import { Types } from 'mongoose'

export interface IPublicActor {
	_id: Types.ObjectId
	photo: string
	name: string
	slug: string
}
