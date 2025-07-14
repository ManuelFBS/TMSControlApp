import { Module } from '@nestjs/common';
import { RedisService } from '../../../shared/redis/redis.service';
import { RedisTokenBlacklistService } from '../../../infrastructure/token/redis-token-blacklist.service';
import { TokenBlacklistService } from '../../../application/use-cases/token/token-blacklist.service';

@Module({
        providers: [
                RedisService,
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
