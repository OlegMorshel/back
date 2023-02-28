import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString({
    message: 'You do not have a refresh token or it is not a string'
  })
  refreshToken: string
}
