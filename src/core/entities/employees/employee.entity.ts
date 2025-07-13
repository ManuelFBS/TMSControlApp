export class Employee {
        constructor(
                public id: number,
                public dni: string,
                public names: string,
                public lastNames: string,
                public phone: string,
                public address: string,
                public createdAt: Date,
                public updatedAt: Date,
        ) {}
}
