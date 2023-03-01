import { Injectable, NotFoundException } from '@nestjs/common'
import { getTelegramConfig } from 'src/config/telegram.config'
import { Telegraf } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
import { ITelegram } from './telegram.interface'

@Injectable()
export class TelegramService {
	bot: Telegraf
	options: ITelegram

	constructor() {
		this.options = getTelegramConfig()
		this.bot = new Telegraf(this.options.token)
	}

	sendMessage = async (
		msg: string,
		options: ExtraReplyMessage,
		chatId: string = this.options.chatId
	) => {
		const result = await this.bot.telegram.sendMessage(chatId, msg, {
			parse_mode: 'HTML',
			...options
		})

		if (!result) throw new NotFoundException('Chat not found')
		return result
	}

	sendPhoto = async (
		photo: string,
		msg?: string,
		chatId: string = this.options.chatId
	) => {
		const result = await this.bot.telegram.sendPhoto(
			chatId,
			photo,
			msg
				? {
						caption: msg
				  }
				: {}
		)

		if (!result) throw new NotFoundException('Chat not found')
		return result
	}
}
