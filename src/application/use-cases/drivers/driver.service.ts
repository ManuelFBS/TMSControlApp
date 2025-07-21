import {
        Injectable,
        Inject,
        ConflictException,
        NotFoundException,
        BadRequestException,
} from '@nestjs/common';
import { Driver } from '../../../core/entities/drivers/driver.entity';
import { DriverRepository } from '../../../core/repositories/drivers/driver.repository';
import { CreateDriverDTO } from '../../dto/drivers/create-driver.dto';
import { privateDecrypt } from 'crypto';

@Injectable()
export class DriverService {
        constructor(
                @Inject('DriverRepository')
                private readonly driverRepository: DriverRepository,
        ) {}
}
