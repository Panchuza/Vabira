import { Module } from '@nestjs/common';
import { TurnService } from './turn.service';
import { TurnController } from './turn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turn } from 'src/entities/turn.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Type } from 'src/entities/type.entity';
import { TypeService } from 'src/type/type.service';
import { TurnStatus } from 'src/entities/turnStatus.entity';

@Module({imports: [TypeOrmModule.forFeature([Turn, AuthGuard, User, Type, TurnStatus]),
],
  controllers: [TurnController],
  providers: [TurnService, JwtService, AuthGuard, TypeService]
})
export class TurnModule {}
