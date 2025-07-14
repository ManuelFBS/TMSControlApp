import {
        CanActivate,
        ExecutionContext,
        ForbiddenException,
        Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../core/entities/users/user.entity';
import { Permission } from '../../core/permissions/permission';
import { hasPermission } from '../../core/permissions/permission';

@Injectable()
export class PermissionsGuard implements CanActivate {
        constructor(private reflector: Reflector) {}

        canActivate(context: ExecutionContext): boolean {
                const requiredPermissions =
                        this.reflector.get<Permission[]>(
                                'permissions',
                                context.getHandler(),
                        ) || [];

                if (requiredPermissions.length === 0) {
                        return true;
                }

                const request = context.switchToHttp().getRequest();
                const user: User = request.user;

                if (!user) {
                        throw new ForbiddenException('User not authenticated');
                }

                const hasAllPermissions = requiredPermissions.every(
                        (permission) => hasPermission(user.role, permission),
                );

                if (!hasAllPermissions) {
                        throw new ForbiddenException(
                                `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
                        );
                }

                return true;
        }
}
