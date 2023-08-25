import { Module } from '@nestjs/common';
import { TurnService } from './turn.service';
import { TurnController } from './turn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turn } from 'src/entities/turn.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Module({imports: [TypeOrmModule.forFeature([Turn, AuthGuard, User]),
],
  controllers: [TurnController],
  providers: [TurnService, JwtService, AuthGuard]
})
export class TurnModule {}
