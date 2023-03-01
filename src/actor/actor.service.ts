import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ActorDto } from './actor.dto'
import { IPublicActor } from './actor.interface'
import { ActorId, ActorModel } from './actor.model'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	bySlug = async (slug: string): Promise<IPublicActor> => {
		const actor = await this.ActorModel.findOne({ slug }).exec()
		if (!actor) throw new NotFoundException('Actor not found')
		return this.getPublicActorFormat(actor)
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
					}
				]
			}
		}

		// Aggregation

		return this.ActorModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	// Admin responsibility

	byId = async (_id: ActorId) => {
		const genre = await this.ActorModel.findById(_id)

		if (!genre) throw new NotFoundException('Actor not found')

		return this.getPublicActorFormat(genre)
	}

	update = async (_id: ActorId, dto: ActorDto) => {
		const actor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()
		if (!actor) throw new NotFoundException('Actor not found')
		return this.getPublicActorFormat(actor)
	}

	create = async () => {
		const initialValue: ActorDto = {
			name: '',
			slug: '',
			photo: ''
		}
		const actor = await this.ActorModel.create(initialValue)
		return actor._id
	}

	delete = async (_id: ActorId) => {
		const genre = await this.ActorModel.findByIdAndDelete(_id).exec()
		if (!genre) throw new NotFoundException('Actor not found')
		return this.getPublicActorFormat(genre)
	}

	private getPublicActorFormat = ({
		_id,
		photo,
		name,
		slug
	}: ActorModel): IPublicActor => ({
		_id,
		photo,
		name,
		slug
	})
}
