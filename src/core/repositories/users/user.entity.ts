export enum UserRole {
        OWNER = 'Owner',
        ADMIN = 'Admin',
        EMPLOYEE = 'Employee',
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
