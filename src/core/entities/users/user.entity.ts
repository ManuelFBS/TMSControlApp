export enum UserRole {
        ADMIN = 'Administrador',
        CLIENT = 'Cliente',
        DRIVER = 'Conductor',
        COMPANY = 'Empresa',
}

export class User {
        constructor(
                public id: number,
                public dni: string,
                public username: string,
                public password: string,
                public role: UserRole,
                public createdAt: Date,
                public updatedAt: Date,
        ) {}
}
