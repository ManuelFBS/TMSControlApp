import { User } from '../../entities/users/user.entity';

export abstract class UserRepository {
        abstract create(user: User): Promise<User>;
        abstract findAll(): Promise<User[]>;
        abstract findByID(id: number): Promise<User | null>;
        abstract findByDNI(dni: string): Promise<User | null>;
        abstract findByUsername(username: string): Promise<User | null>;
        abstract update(id: number, user: Partial<User>): Promise<User>;
        abstract delete(id: number): Promise<void>;
}
