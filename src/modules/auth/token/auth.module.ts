import { Module } from '@nestjs/common';
import { RedisModule } from '../../../shared/redis/redis.module';
import { RedisTokenBlacklistService } from '../../../infrastructure/token/redis-token-blacklist.service';
import { TokenBlacklistService } from '../../../application/use-cases/token/token-blacklist.service';

@Module({
        imports: [
                RedisModule.forRoot({
                        host: process.env.REDIS_HOST || 'localhost',
                        port: Number(process.env.REDIS_PORT) || 6379,
                        db: 0,
                        password: process.env.REDIS_PASSWORD || '',
                }),
        ],
        providers: [
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
        exports: [TokenBlacklistService],
})
export class AuthModule {}
