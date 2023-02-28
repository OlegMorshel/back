import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoDbConfig = async (
  _configService: ConfigService
): Promise<TypegooseModuleOptions> => ({
  uri: _configService.get('MONGO_URI')
});
