import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Policy } from './entities/policy.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import { PropertiesService } from 'src/properties/properties.service';
import { StatusPolicyNumberService } from 'src/status-policy-number/status-policy-number.service';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { PolicyHistory } from 'src/policy-history/entities/policy-history.entity';

@Injectable()
export class PolicyService {
  constructor(
    @InjectRepository(Policy)
    private readonly repository: Repository<Policy>,
    private usersService: UsersService,
    private propertiesService: PropertiesService,
    private statusPolicyNumberService: StatusPolicyNumberService,
    private emailService: EmailService,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  async create(createPolicyDto: CreatePolicyDto): Promise<Policy> {
    const property = await this.propertiesService.findOne(
      createPolicyDto.propertyId,
    );
    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    const status = await this.statusPolicyNumberService.findOne(1);
    if (!status) {
      throw new NotFoundException('Estado no encontrado');
    }
    const createdBy = await this.usersService.findOne(
      createPolicyDto.createdById,
    );
    const tenant = await this.usersService.findOne(createPolicyDto.tenantId);
    const guarantor = await this.usersService.findOne(
      createPolicyDto.guarantorId,
    );
    const estateAgent = property.owner.createdBy;
    const owner = property.owner;
    const lastPolicy = await this.repository
      .createQueryBuilder('policy')
      .orderBy('policy.lastNumber', 'DESC')
      .getOne();
    let lastNumber = 1;
    if (lastPolicy) {
      lastNumber = lastPolicy.lastNumber + 1;
    }

    const policyTmp = new Policy();
    policyTmp.property = property;
    policyTmp.status = status;
    policyTmp.estateAgent = estateAgent;
    policyTmp.owner = owner;
    policyTmp.tenant = tenant;
    policyTmp.guarantor = guarantor;
    policyTmp.price = createPolicyDto.price;
    policyTmp.description = createPolicyDto.description;
    policyTmp.createdBy = createdBy;
    policyTmp.modifiedBy = createdBy;
    policyTmp.name = `F-${lastNumber.toString().padStart(7, '0')}`;

    const policy = await this.repository.save(policyTmp);

    // Save policy history
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(PolicyHistory)
      .values({
        note: 'Póliza GENERADA',
        policy: policy,
        status: status,
        createdBy: createdBy,
        modifiedBy: createdBy,
      })
      .execute();

    return policy;
  }

  async findAll(ownerId?: number): Promise<Policy[]> {
    return await this.repository.find({
      where: {
        ...(ownerId && { owner: { id: ownerId } }),
      },
      select: {
        property: {
          id: true,
          name: true,
          isActive: true,
        },
        status: {
          id: true,
          name: true,
        },
        estateAgent: {
          id: true,
          name: true,
        },
        owner: {
          id: true,
          name: true,
          isActive: true,
          isVerified: true,
        },
        createdBy: {
          id: true,
          name: true,
        },
        modifiedBy: {
          id: true,
          name: true,
        },
        guarantor: {
          id: true,
          name: true,
          isActive: true,
          isVerified: true,
        },
        tenant: {
          id: true,
          name: true,
          isActive: true,
          isVerified: true,
        },
      },

      relations: [
        'property',
        'status',
        'estateAgent',
        'owner',
        'tenant',
        'guarantor',
        'createdBy',
        'modifiedBy',
      ],
    });
  }

  async findOne(id: number, ownerId?: number): Promise<Policy> {
    return await this.repository.findOne({
      where: {
        id,
        ...(ownerId && { owner: { id: ownerId } }),
      },
      select: {
        property: {
          id: true,
          name: true,
          isActive: true,
        },
        status: {
          id: true,
          name: true,
        },
        estateAgent: {
          id: true,
          name: true,
        },
        owner: {
          id: true,
          name: true,
          isActive: true,
          isVerified: true,
        },
        createdBy: {
          id: true,
          name: true,
        },
        modifiedBy: {
          id: true,
          name: true,
        },
        guarantor: {
          id: true,
          name: true,
          isActive: true,
          isVerified: true,
        },
        tenant: {
          id: true,
          name: true,
          isActive: true,
          isVerified: true,
        },
      },

      relations: [
        'property',
        'status',
        'estateAgent',
        'owner',
        'tenant',
        'guarantor',
        'createdBy',
        'modifiedBy',
        'policyHistories',
      ],
    });
  }

  async update(id: number, updatePolicyDto: UpdatePolicyDto): Promise<Policy> {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    const modifiedBy = await this.usersService.findOne(
      updatePolicyDto.modifiedById,
    );
    Object.assign(item, updatePolicyDto);
    item.modifiedBy = modifiedBy;
    return await this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    return await this.repository.softRemove(item);
  }

  async changeStatus(id: number, nextStatusId: number, modifiedById: number) {
    const policy = await this.repository.findOne({
      where: { id },
      relations: [
        'status',
        'property',
        'property',
        'owner',
        'tenant',
        'guarantor',
      ],
    });
    if (!policy) {
      throw new NotFoundException('Póliza no encontrada');
    }
    const status = await this.statusPolicyNumberService.findOne(nextStatusId);
    if (!status) {
      throw new NotFoundException('Estado no encontrado');
    }

    if (nextStatusId === 4) {
      if (!policy.property.isActive) {
        throw new NotFoundException('La propiedad no está verificada');
      }
      if (!policy.owner.isVerified) {
        throw new NotFoundException('El arrendador no está verificado');
      }
      if (policy.tenant && !policy.tenant.isVerified) {
        throw new NotFoundException('El arrendatario no está verificado');
      }
      if (policy.guarantor && !policy.guarantor.isVerified) {
        throw new NotFoundException('El Fiador no está verificado');
      }
      const date = new Date();
      policy.startDate = date;
      policy.endDate = new Date(
        date.setMonth(date.getMonth() + policy.validityTime),
      );
      const siteUrl = this.configService.get('SITE_URL');
      const resetLink = `${siteUrl}/policy/${policy.id}`;
      // Send email to the owner
      await this.emailService.sendEmailPolicyActivated(
        policy.owner.email,
        policy.owner.name,
        resetLink,
        policy.name,
        policy.startDate.toLocaleDateString(),
        policy.endDate.toLocaleDateString(),
      );
    }
    const user = await this.usersService.findOne(modifiedById);
    policy.status = status;
    policy.modifiedBy = user;
    await this.repository.save(policy);

    // Save policy history
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(PolicyHistory)
      .values({
        note: `Póliza ${status.name}`,
        policy: policy,
        status: status,
        createdBy: user,
        modifiedBy: user,
      })
      .execute();

    return policy;
  }

  async sendReminderToCompletePolicy(id: number) {
    const policy = await this.repository.findOne({
      where: { id },
      relations: ['owner', 'tenant'],
    });
    if (!policy) {
      throw new NotFoundException('Póliza no encontrada');
    }
    const siteUrl = this.configService.get('SITE_URL');
    const resetLink = `${siteUrl}/policy/${policy.id}`;
    // Send email to the owner
    await this.emailService.sendEmailPolicyReminderToCompleteOwner(
      policy.owner.email,
      policy.owner.name,
      resetLink,
      policy.name,
    );
    // Send email to the state agent
    await this.emailService.sendEmailPolicyReminderToCompleteTenant(
      policy.tenant.email,
      policy.tenant.name,
      resetLink,
      policy.name,
    );
  }
}
