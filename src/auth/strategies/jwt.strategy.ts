import {
        Injectable,
        ForbiddenException,
        UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../application/use-cases/auth/auth.service';
import { JWTPayload } from '../interfaces/jwt-payload.interface';
import { TokenBlacklistService } from '../../application/use-cases/token/token-blacklist.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
        constructor(
                private readonly authService: AuthService,
                private readonly tokenBlacklist: TokenBlacklistService,
        ) {
                super({
                        jwtFromRequest:
                                ExtractJwt.fromAuthHeaderAsBearerToken(),
                        ignoreExpiration: false,
                        secretOrKey:
                                process.env.JWT_SECRET || 'fallback-secret-key',
                        passReqToCallback: true,
                });
        }

        async validate(req: any, payload: JWTPayload) {
                const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

                if (!token) {
                        throw new ForbiddenException('Token not provided...');
                }

                if (await this.tokenBlacklist.isBlacklisted(token)) {
                        throw new UnauthorizedException('Token revoked...');
                }

                return this.authService.validateUserByPayload(payload);
        }
}
