import { IsString } from 'class-validator'

export class UpdateMostPopularDto {
	@IsString()
	slug: string
}
