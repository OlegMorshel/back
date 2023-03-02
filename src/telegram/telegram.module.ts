import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegramService } from './telegram.service'

@Module({
	imports: [ConfigModule],
	providers: [TelegramService, ConfigService],
	exports: [TelegramService]
})
export class TelegramModule {}
