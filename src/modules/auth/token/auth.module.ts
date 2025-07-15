import { Module } from '@nestjs/common';
//>< -------------------------------------------------------------------------
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../../users/user.module';
import { AuthService } from '../../../application/use-cases/auth/auth.service';
import { JWTStrategy } from '../../../auth/strategies/jwt.strategy';
import { AuthController } from '../../../infrastructure/interface-adapters/auth/auth.controller';
//>< -------------------------------------------------------------------------
import { RedisModule } from '../../../shared/redis/redis.module';
import { RedisTokenBlacklistService } from '../../../infrastructure/token/redis-token-blacklist.service';
import { TokenBlacklistService } from '../../../application/use-cases/token/token-blacklist.service';
//>< -------------------------------------------------------------------------
import { UserSessionModule } from '../../users-sessions/user-session.module';
//>< -------------------------------------------------------------------------

@Module({
        imports: [
                PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.register({
                        secret: process.env.JWT_SECRET,
                        signOptions: {
                                expiresIn: process.env.JWT_EXPIRES_IN || '8h',
                        },
                }),
                RedisModule.forRoot({
                        host: process.env.REDIS_HOST || 'localhost',
                        port: Number(process.env.REDIS_PORT) || 6379,
                        db: 0,
                        password: process.env.REDIS_PASSWORD || '',
                }),
                UserModule,
                UserSessionModule,
        ],
        providers: [
                AuthService,
                JWTStrategy,
                {
                        provide: 'TokenBlacklist',
                        useClass: RedisTokenBlacklistService,
                },
                {
                        provide: TokenBlacklistService,
                        useFactory: (blacklist) =>
                                new TokenBlacklistService(blacklist),
                        inject: ['TokenBlacklist'],
                },
        ],
        controllers: [AuthController],
        exports: [JWTStrategy, PassportModule, TokenBlacklistService],
})
export class AuthModule {}
