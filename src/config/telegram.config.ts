import { ConfigService } from '@nestjs/config'
import { ITelegram } from 'src/telegram/telegram.interface'

export const getTelegramConfig = (
	_configService: ConfigService
): ITelegram => ({
	chatId: _configService.get('TELEGRAM_CHAT_ID'),
	token: _configService.get('TELEGRAM_CHAT_TOKEN')
})
