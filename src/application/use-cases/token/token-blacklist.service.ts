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
