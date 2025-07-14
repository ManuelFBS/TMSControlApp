export class UserSession {
        constructor(
                public id: number,
                public dni: string,
                public username: string,
                public role: string,
                public initDate: Date,
                public initHour: string,
                public finalDate?: Date | null,
                public finalHour?: string | null,
        ) {}
}
