import { Driver } from '../../entities/drivers/driver.entity';

export abstract class DriverRepository {
        abstract create(driver: Driver): Promise<Driver>;
        abstract findAll(): Promise<Driver[]>;
        abstract findByID(id: number): Promise<Driver | null>;
        abstract findByDNI(dni: string): Promise<Driver | null>;
        abstract delete(id: number): Promise<void>;
}
