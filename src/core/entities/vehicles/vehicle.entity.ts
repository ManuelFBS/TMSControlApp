export enum TypeOfVehicle {
        VOLQUETA_DTRQ = 'Volqueta_Dtrq',
        VOLQUETA = 'Volqueta',
        CARRO_TANQUE = 'Carro_Tanque',
        CAMION_SENCILLO = 'Camion_Sencillo',
        TRACTOCAMION = 'Tractocamion',
}

export class Vehicle {
        constructor(
                public id: number,
                public carLicensePlate: string,
                public typeOfVehicle: TypeOfVehicle,
                public brandOfVehicle: string,
                public idCompany: string,
                public dniDriver: string,
                public createdAt: Date,
                public updatedAt: Date,
        ) {}
}
