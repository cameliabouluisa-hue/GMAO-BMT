import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';

@Injectable()
export class MaterielService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    article: true,
    modele: true,
    etat_materiel: true,
    type_materiel: true,
    point_structure: true,
  };

  async create(createDto: CreateMaterielDto) {
    const existing = await this.prisma.materiel.findFirst({
      where: {
        code: createDto.code,
      },
    });

    if (existing) {
      throw new BadRequestException('Un matériel avec ce code existe déjà.');
    }

    return this.prisma.materiel.create({
      data: {
        code: createDto.code?.trim(),
        numeroSerie: createDto.numeroSerie?.trim() || null,
        dateMiseService: createDto.dateMiseService
          ? new Date(createDto.dateMiseService)
          : null,

        idArticle: createDto.idArticle ?? null,
        idModele: createDto.idModele ?? null,
        idEtat: createDto.idEtat ?? null,
        idType: createDto.idType ?? null,
        idPointStructure: createDto.idPointStructure ?? null,

        actif: createDto.actif ?? true,
      },
      include: this.includeRelations,
    });
  }

  async findAll() {
    return this.prisma.materiel.findMany({
      orderBy: {
        idMateriel: 'desc',
      },
      include: this.includeRelations,
    });
  }

  async findOne(id: number) {
    const materiel = await this.prisma.materiel.findUnique({
      where: {
        idMateriel: id,
      },
      include: this.includeRelations,
    });

    if (!materiel) {
      throw new NotFoundException('Matériel introuvable.');
    }

    return materiel;
  }

  async update(id: number, updateDto: UpdateMaterielDto) {
    await this.findOne(id);

    if (updateDto.code) {
      const existing = await this.prisma.materiel.findFirst({
        where: {
          code: updateDto.code,
          NOT: {
            idMateriel: id,
          },
        },
      });

      if (existing) {
        throw new BadRequestException('Un autre matériel utilise déjà ce code.');
      }
    }

    return this.prisma.materiel.update({
      where: {
        idMateriel: id,
      },
      data: {
        ...(updateDto.code !== undefined && {
          code: updateDto.code.trim(),
        }),

        ...(updateDto.numeroSerie !== undefined && {
          numeroSerie: updateDto.numeroSerie?.trim() || null,
        }),

        ...(updateDto.dateMiseService !== undefined && {
          dateMiseService: updateDto.dateMiseService
            ? new Date(updateDto.dateMiseService)
            : null,
        }),

        ...(updateDto.idArticle !== undefined && {
          idArticle: updateDto.idArticle ?? null,
        }),

        ...(updateDto.idModele !== undefined && {
          idModele: updateDto.idModele ?? null,
        }),

        ...(updateDto.idEtat !== undefined && {
          idEtat: updateDto.idEtat ?? null,
        }),

        ...(updateDto.idType !== undefined && {
          idType: updateDto.idType ?? null,
        }),

        ...(updateDto.idPointStructure !== undefined && {
          idPointStructure: updateDto.idPointStructure ?? null,
        }),

        ...(updateDto.actif !== undefined && {
          actif: updateDto.actif,
        }),
      },
      include: this.includeRelations,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.materiel.delete({
      where: {
        idMateriel: id,
      },
    });
  }
}