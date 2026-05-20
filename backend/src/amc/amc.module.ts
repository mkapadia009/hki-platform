import { Module } from '@nestjs/common';
import { AmcController } from './amc.controller';
import { AmcService } from './amc.service';

@Module({
  controllers: [AmcController],
  providers: [AmcService]
})
export class AmcModule {}
