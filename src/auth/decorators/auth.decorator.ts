import { applyDecorators, UseGuards } from '@nestjs/common'
import { TypeRole } from '../auth.interface'
import { JwtAuthGuard, OnlyAdminGuard } from '../guards'

export const Auth = (role: TypeRole = 'user') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, OnlyAdminGuard)
			: UseGuards(JwtAuthGuard)
	)
