import {
        Controller,
        Post,
        Body,
        UseGuards,
        Req,
        UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../../application/use-cases/auth/auth.service';
import { LoginDTO } from '../../../application/dto/auth/login.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Permissions } from '../../../core/permissions/permissions.decorator';

@Controller('api/auth')
export class AuthController {
        constructor(private readonly authService: AuthService) {}

        @Post('login')
        @Permissions('auth:login')
        async login(@Body() loginDTO: LoginDTO) {
                const user = await this.authService.validateUser(
                        loginDTO.username,
                        loginDTO.password,
                );

                if (!user) {
                        throw new UnauthorizedException('Invalid credentials');
                }

                return this.authService.login(user);
        }

        @Post('logout')
        @UseGuards(JWTAuthGuard)
        @Permissions('auth:logout')
        async logout(@Req() req: any) {
                const token = req.headers.authorization?.split(' ')[1];

                if (token) {
                        await this.authService.logout(token);
                }

                return { message: 'Logged out successfully' };
        }
}
