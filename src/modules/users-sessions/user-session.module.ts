import { Module } from '@nestjs/common';
import { UserSessionController } from '../../infrastructure/interface-adapters/users-sessions/user-session.controller';
import { UserSessionService } from '../../application/use-cases/users-sessions/user-session.service';
import { PrismaUserSessionRepository } from '../../infrastructure/repositories/users-sessions/prisma-user-session.repository';
import { UserSessionRepository } from '../../core/repositories/users-sessions/user-session.repository';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

@Module({
        imports: [PrismaModule],
        controllers: [UserSessionController],
        providers: [
                UserSessionService,
                {
                        provide: UserSessionRepository,
                        useClass: PrismaUserSessionRepository,
                },
        ],
})
export class UserSessionModule {}
