// import { Injectable } from '@nestjs/common';
// import { RedisService } from '../../shared/redis/redis.service';
// import * as jwt from 'jsonwebtoken';

// @Injectable()
// export class TokenBlacklistService {
//         private readonly prefix: string;

//         constructor(private readonly redis: RedisService) {
//                 this.prefix = process.env.REDIS_KEY_PREFIX
//                         ? `${process.env.REDIS_KEY_PREFIX}blacklist:`
//                         : 'blacklist:';
//         }

//         private getKey(token: string): string {
//                 return `${this.prefix}${token}`;
//         }

//         async addToBlacklist(token: string): Promise<void> {
//                 try {
//                         const decoded = jwt.decode(token) as { exp?: number };

//                         if (!decoded) return;

//                         const ttl = decoded.exp
//                                 ? Math.max(
//                                           0,
//                                           decoded.exp -
//                                                   Math.floor(Date.now() / 1000),
//                                   )
//                                 : 3600; //> 1 hora por defecto si no hay expiración...

//                         await this.redis.set(
//                                 this.getKey(token),
//                                 '1',
//                                 'EX',
//                                 ttl,
//                         );
//                 } catch (error) {
//                         console.error(
//                                 'Error adding token to blacklist: ',
//                                 error,
//                         );
//                 }
//         }

//         async isBlacklisted(token: string): Promise<boolean> {
//                 try {
//                         const result = await this.redis.exists(
//                                 this.getKey(token),
//                         );
//                         return result === 1;
//                 } catch (error) {
//                         console.error(
//                                 'Error checking token blacklist: ',
//                                 error,
//                         );

//                         return false;
//                 }
//         }

//         async cleanExpiredTokens(): Promise<void> {
//                 //? Redis maneja automáticamente la expiración...
//                 //? Este método es para futuras extensiones...
//         }
// }
import { TokenBlacklist } from '../../../core/interfaces/token/token-blacklist.interface';

export class TokenBlacklistService {
        constructor(private readonly blacklist: TokenBlacklist) {}

        async blacklistToken(token: string) {
                await this.blacklist.addToBlacklist(token);
        }

        async isTokenBlacklisted(token: string) {
                return this.blacklist.isBlacklisted(token);
        }
}
