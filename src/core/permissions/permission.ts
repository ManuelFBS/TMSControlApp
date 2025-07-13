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
        | 'sessions:read';

export const RolePermissions: Record<UserRole, Permission[]> = {
        [UserRole.OWNER]: [
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
        ],
        [UserRole.ADMIN]: [
                'employee:create',
                'employee:read',
                'employee:update',
                'user:create',
                'user:read',
                'user:update',
                'auth:login',
                'auth:logout',
                'sessions:read',
        ],
        [UserRole.EMPLOYEE]: [
                'employee:read',
                'user:read',
                'auth:login',
                'auth:logout',
                'sessions:read',
        ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
        return RolePermissions[role].includes(permission);
}
