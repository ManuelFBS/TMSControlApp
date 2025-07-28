import { Vehicle } from '../../entities/vehicles/vehicle.entity';

export abstract class VehicleRepository {
        abstract create(vehicle: Vehicle): Promise<Vehicle>;
        abstract findAll(): Promise<Vehicle[]>;
        abstract findByType(typeOfVehicle: string): Promise<Vehicle[]>;
        abstract findByBrand(brandOfVehicle: string): Promise<Vehicle[]>;
        abstract findByID(id: number): Promise<Vehicle | null>;
        abstract findByPlate(carLicensePlate: string): Promise<Vehicle | null>;
        abstract FindByAssignment(dniDriver: string): Promise<Vehicle | null>;
        abstract updateByID(
                id: number,
                vehicle: Partial<Vehicle>,
        ): Promise<Vehicle>;
        abstract updateByPlate(
                carLicensePlate: string,
                vehicle: Partial<Vehicle>,
        ): Promise<Vehicle>;
        abstract deleteByID(id: number): Promise<void>;
        abstract deleteByPlate(carLicensePlate: string): Promise<void>;
}
