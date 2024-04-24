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
    let isAllFilesPropertyUploaded = true;
    let isAllFilesOwnerUploaded = true;
    const property = await this.propertiesService.findOne(
      createPolicyDto.propertyId,
    );
    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }
    // Verify required documents from the property
    property.files.map((file) => {
      if (!file.mediaId) {
        isAllFilesPropertyUploaded = false;
      }
    });
    if (!isAllFilesPropertyUploaded) {
      throw new NotFoundException(
        'Por favor adjunta todos los documentos obligatorios de la propiedad',
      );
    }
    // Verify required documents from the owner
    property.owner.files.map((file) => {
      if (!file.mediaId) {
        isAllFilesOwnerUploaded = false;
      }
    });
    if (!isAllFilesOwnerUploaded) {
      throw new NotFoundException(
        'Por favor adjunta todos los documentos obligatorios del arrendador',
      );
    }

    const status = await this.statusPolicyNumberService.findOne(1);
    if (!status) {
      throw new NotFoundException('Estado no encontrado');
    }
    const user = await this.usersService.findOne(createPolicyDto.createdById);
    const estateAgent = property.owner.createdBy;
    const owner = property.owner;
    const policyTmp = new Policy();
    policyTmp.property = property;
    policyTmp.status = status;
    policyTmp.estateAgent = estateAgent;
    policyTmp.owner = owner;
    policyTmp.createdBy = user;
    policyTmp.modifiedBy = user;

    const policy = await this.repository.save(policyTmp);

    // Save policy history
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(PolicyHistory)
      .values({
        note: 'Póliza creada',
        policy: policy,
        status: status,
        createdBy: user,
        modifiedBy: user,
      })
      .execute();

    const siteUrl = this.configService.get('SITE_URL');
    const resetLink = `${siteUrl}/policy/${policy.id}`;
    // Send email to the owner
    await this.emailService.sendEmailPolicyCreatedOwner(
      owner.email,
      owner.name,
      resetLink,
      policy.name,
    );
    // Send email to the state agent
    await this.emailService.sendEmailPolicyCreatedAgent(
      estateAgent.email,
      estateAgent.name,
      resetLink,
      policy.name,
    );

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
      },

      relations: [
        'property',
        'status',
        'estateAgent',
        'owner',
        'guarantor',
        'createdBy',
        'modifiedBy',
      ],
    });
  }

  async findOne(id: number, ownerId?: number): Promise<Policy> {
    if (ownerId) {
      return await this.repository.findOneBy({ id, owner: { id: ownerId } });
    } else {
      return await this.repository.findOneBy({ id });
    }
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
}
