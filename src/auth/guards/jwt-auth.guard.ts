import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
        //? Opcional: Personalizar el manejo de errores...
        handleRequest(err: any, user: any, info: any) {
                if (err || !user) {
                        throw (
                                err ||
                                new UnauthorizedException(
                                        'Token inválido o expirado...',
                                )
                        );
                }

                return user;
        }
}
