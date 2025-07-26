import { Vehicle } from '../../entities/vehicles/vehicle.entity';

export abstract class VehicleRepository {
        abstract create(vehicle: Vehicle): Promise<Vehicle>;
        abstract findAll(): Promise<Vehicle[]>;
        abstract findByType(typeOfVehicle: string): Promise<Vehicle[] | null>;
        abstract findByBrand(brand: string): Promise<Vehicle[] | null>;
        abstract findByID(id: number): Promise<Vehicle | null>;
        abstract findByPlate(plate: string): Promise<Vehicle | null>;
        abstract FindByAssignment(dniDriver: string): Promise<Vehicle | null>;
        abstract update(id: number, plate: Partial<Vehicle>): Promise<Vehicle>;
        abstract delete(id: number, plate: Partial<Vehicle>): Promise<void>;
}
