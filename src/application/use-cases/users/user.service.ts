import {
        Injectable,
        Inject,
        ConflictException,
        NotFoundException,
} from '@nestjs/common';
import { User } from '../../../core/entities/users/user.entity';
import { UserRepository } from '../../../core/repositories/users/user.repository';
import { EmployeeRepository } from '../../../core/repositories/employees/employee.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from '../../dto/users/create-user.dto';

@Injectable()
export class UserService {
        constructor(
                @Inject('UserRepository')
                private readonly userRepository: UserRepository,
                @Inject('EmployeeRepository')
                private readonly employeeRepository: EmployeeRepository,
        ) {}

        async createUser(createUserDto: CreateUserDTO): Promise<User> {
                //* 1. Verificar que el empleado existe...
                const employee = await this.employeeRepository.findByDNI(
                        createUserDto.dni,
                );
                if (!employee) {
                        throw new NotFoundException(
                                `Employee with DNI ${createUserDto.dni} not found`,
                        );
                }

                //* 2. Verificar que no exista otro usuario con el mismo DNI...
                const existingUserByDni = await this.userRepository.findByDNI(
                        createUserDto.dni,
                );
                if (existingUserByDni) {
                        throw new ConflictException(
                                `User with DNI ${createUserDto.dni} already exists`,
                        );
                }

                //* 3. Verificar que no exista otro usuario con el mismo username...
                const existingUserByUsername =
                        await this.userRepository.findByUsername(
                                createUserDto.username,
                        );
                if (existingUserByUsername) {
                        throw new ConflictException(
                                `User with Username ${createUserDto.username} already exists...`,
                        );
                }

                //* 4. Encriptar la contraseña antes de guardar...
                const hashedPassword = await bcrypt.hash(
                        createUserDto.password,
                        10,
                );

                //* 5. Crear el objeto usuario con la contraseña encriptada...
                //* Nota: Los campos id, createdAt y updatedAt serán manejados por la base de datos...
                const userToCreate = new User(
                        0, //> ID temporal, será asignado por la base de datos...
                        createUserDto.dni,
                        createUserDto.username,
                        hashedPassword,
                        createUserDto.role,
                        new Date(), //> createdAt
                        new Date(), //> updatedAt
                );

                //* 6. Guardar el usuario en la base de datos...
                const createdUser =
                        await this.userRepository.create(userToCreate);

                //* 7. Retornar el usuario creado (sin la contraseña por seguridad)
                return createdUser;
        }

        async findAllUsers(): Promise<User[]> {
                return this.userRepository.findAll();
        }

        async findUserByID(id: number): Promise<User> {
                const user = await this.userRepository.findByID(id);

                if (!user) {
                        throw new NotFoundException(
                                `User with ID ${id} not found...`,
                        );
                }

                return user;
        }

        async findUserByDNI(dni: string): Promise<User> {
                const user = await this.userRepository.findByDNI(dni);

                if (!user) {
                        throw new NotFoundException(
                                `User with DNI ${dni} not found...`,
                        );
                }

                return user;
        }

        async findByUsername(username: string): Promise<User> {
                const user = await this.userRepository.findByUsername(username);

                if (!user) {
                        throw new NotFoundException(
                                `User with DNI ${username} not found...`,
                        );
                }

                return user;
        }

        async updateUser(
                id: number,
                updateUserDTO: UpdateUserDTO,
        ): Promise<User> {
                //* 1. Verificar que el usuario existe...
                const existingUser = await this.userRepository.findByID(id);
                if (!existingUser) {
                        throw new NotFoundException(
                                `User with ID ${id} not found`,
                        );
                }

                //* 2. Si se actualiza el username, verificar que no esté en uso...
                if (
                        updateUserDTO.username &&
                        updateUserDTO.username !== existingUser.username
                ) {
                        const userWithSameUsername =
                                await this.userRepository.findByUsername(
                                        updateUserDTO.username,
                                );
                        if (
                                userWithSameUsername &&
                                userWithSameUsername.id !== id
                        ) {
                                throw new ConflictException(
                                        `Username ${updateUserDTO.username} is already taken`,
                                );
                        }
                }

                //* 3. Hashear la nueva contraseña si se proporciona...
                const updates: Partial<User> = { ...updateUserDTO };
                if (updateUserDTO.password) {
                        updates.password = await bcrypt.hash(
                                updateUserDTO.password,
                                10,
                        );
                }

                //* 4. Actualizar el usuario...
                return this.userRepository.update(id, updates);
        }

        async deleteUser(id: number): Promise<void> {
                await this.findUserByID(id);
                await this.userRepository.delete(id);
        }

        async validateUser(
                username: string,
                password: string,
        ): Promise<User | null> {
                const user = await this.userRepository.findByUsername(username);
                if (!user) return null;

                const isPasswordValid = await bcrypt.compare(
                        password,
                        user.password,
                );
                if (!isPasswordValid) return null;

                return user;
        }
}
