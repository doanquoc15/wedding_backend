import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ZoneController],
  providers: [ZoneService],
  imports:[PrismaModule]
})
export class ZoneModule {}
