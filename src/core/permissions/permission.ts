import { UserRole } from '../entities/users/user.entity';

export type Permission =
        | 'employee:create'
        | 'employee:read'
        | 'employee:update'
        | 'employee:delete'
        | 'user:create'
        | 'user:read'
        | 'user:update'
        | 'user:delete'
        | 'auth:login'
        | 'auth:logout'
        | 'sessions:read'
        | 'company:create'
        | 'company:read'
        | 'company:update'
        | 'company:delete'
        | 'driver:create'
        | 'driver:read'
        | 'driver:update'
        | 'driver:delete'
        | 'client:create'
        | 'client:read'
        | 'client:update'
        | 'client:delete';

export const RolePermissions: Record<UserRole, Permission[]> = {
        [UserRole.ADMIN]: [
                'employee:create',
                'employee:read',
                'employee:update',
                'employee:delete',
                'user:create',
                'user:read',
                'user:update',
                'user:delete',
                'auth:login',
                'auth:logout',
                'sessions:read',
                'company:create',
                'company:read',
                'company:update',
                'company:delete',
                'driver:create',
                'driver:read',
                'driver:update',
                'driver:delete',
                'client:create',
                'client:read',
                'client:update',
                'client:delete',
        ],
        [UserRole.CLIENT]: ['client:read'],
        [UserRole.DRIVER]: ['driver:read'],
        [UserRole.COMPANY]: ['company:read'],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
        return RolePermissions[role].includes(permission);
}
