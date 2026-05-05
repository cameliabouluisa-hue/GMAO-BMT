import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePointStructureDto } from './dto/create-point-structure.dto';
import { UpdatePointStructureDto } from './dto/update-point-structure.dto';

@Injectable()
export class PointStructureService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreatePointStructureDto) {
    const code = createDto.code.trim();
    const libelle = createDto.libelle.trim();

    const existing = await this.prisma.point_structure.findFirst({
      where: {
        code,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Un point de structure avec ce code existe déjà.',
      );
    }

    return this.prisma.point_structure.create({
      data: {
        code,
        libelle,
        description: createDto.description?.trim(),
        typePoint: createDto.typePoint,
        actif: createDto.actif ?? true,
      },
    });
  }

  async findAll(typePoint?: string) {
    return this.prisma.point_structure.findMany({
      where: {
        actif: true,
        ...(typePoint ? { typePoint } : {}),
      },
      orderBy: {
        libelle: 'asc',
      },
      include: {
        materiels: {
          select: {
            idMateriel: true,
            code: true,
            numeroSerie: true,
            actif: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const point = await this.prisma.point_structure.findUnique({
      where: {
        idPoint: id,
      },
      include: {
        materiels: {
          select: {
            idMateriel: true,
            code: true,
            numeroSerie: true,
            actif: true,
          },
        },
      },
    });

    if (!point) {
      throw new NotFoundException('Point de structure introuvable.');
    }

    return point;
  }

  async update(id: number, updateDto: UpdatePointStructureDto) {
    await this.findOne(id);

    if (updateDto.code) {
      const existing = await this.prisma.point_structure.findFirst({
        where: {
          code: updateDto.code.trim(),
          NOT: {
            idPoint: id,
          },
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Un autre point de structure utilise déjà ce code.',
        );
      }
    }

    return this.prisma.point_structure.update({
      where: {
        idPoint: id,
      },
      data: {
        ...(updateDto.code !== undefined && {
          code: updateDto.code.trim(),
        }),
        ...(updateDto.libelle !== undefined && {
          libelle: updateDto.libelle.trim(),
        }),
        ...(updateDto.description !== undefined && {
          description: updateDto.description?.trim(),
        }),
        ...(updateDto.typePoint !== undefined && {
          typePoint: updateDto.typePoint,
        }),
        ...(updateDto.actif !== undefined && {
          actif: updateDto.actif,
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const materielsCount = await this.prisma.materiel.count({
      where: {
        idPointStructure: id,
      },
    });

    if (materielsCount > 0) {
      throw new BadRequestException(
        'Impossible de supprimer ce point car des matériels sont affectés à cet emplacement.',
      );
    }

    return this.prisma.point_structure.delete({
      where: {
        idPoint: id,
      },
    });
  }
}