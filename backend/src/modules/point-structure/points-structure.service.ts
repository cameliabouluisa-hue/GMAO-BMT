import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePointStructureDto } from './dto/create-points-structure.dto';
import { UpdatePointStructureDto } from './dto/update-points-structure.dto';
import { FindPointsStructureQueryDto } from './dto/find-points-structure-query.dto';

@Injectable()
export class PointsStructureService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeCode(code?: string): string {
    return (code ?? '').trim().toUpperCase();
  }

  private normalizeText(value?: string | null): string | null {
    const cleaned = (value ?? '').trim();
    return cleaned.length > 0 ? cleaned : null;
  }

  private normalizeTypePoint(typePoint?: string): 'GEOGRAPHIQUE' | 'TECHNIQUE' {
    const value = (typePoint ?? '').trim().toUpperCase();

    if (value !== 'GEOGRAPHIQUE' && value !== 'TECHNIQUE') {
      throw new BadRequestException(
        'Le type du point doit être GEOGRAPHIQUE ou TECHNIQUE.',
      );
    }

    return value;
  }

  async findAll(query: FindPointsStructureQueryDto) {
    const where: any = {};

    const search = query.search?.trim();

    if (search) {
      where.OR = [
        { code: { contains: search } },
        { libelle: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (query.typePoint && query.typePoint !== 'TOUS') {
      where.typePoint = this.normalizeTypePoint(query.typePoint);
    }

    if (query.actif === 'true') {
      where.actif = true;
    }

    if (query.actif === 'false') {
      where.actif = false;
    }

    const points = await this.prisma.point_structure.findMany({
      where,
      orderBy: [
        { actif: 'desc' },
        { code: 'asc' },
      ],
      include: {
        _count: {
          select: {
            materiels: true,
            gamme_operation: true,
            plan_preventif: true,
            plan_preventif_declencheur: true,
            historique_declenchement_preventif: true,
          },
        },
      },
    });

    return points.map((point) => ({
      idPoint: point.idPoint,
      code: point.code,
      libelle: point.libelle,
      description: point.description,
      typePoint: point.typePoint,
      actif: point.actif,

      nbMateriels: point._count.materiels,
      nbGammesOperations: point._count.gamme_operation,
      nbPlansPreventifs: point._count.plan_preventif,
      nbDeclencheursPreventifs: point._count.plan_preventif_declencheur,
      nbHistoriquesPreventifs: point._count.historique_declenchement_preventif,
    }));
  }

  async findOne(idPoint: number) {
    const point = await this.prisma.point_structure.findUnique({
      where: { idPoint },
      include: {
        materiels: {
          select: {
            idMateriel: true,
            code: true,
            numeroSerie: true,
            actif: true,
          },
          orderBy: {
            code: 'asc',
          },
        },
        _count: {
          select: {
            materiels: true,
            gamme_operation: true,
            plan_preventif: true,
            plan_preventif_declencheur: true,
            historique_declenchement_preventif: true,
          },
        },
      },
    });

    if (!point) {
      throw new NotFoundException('Point de structure introuvable.');
    }

    const liens = await this.prisma.lien_arborescence.findMany({
      where: {
        OR: [
          { parentPointId: idPoint },
          { enfantPointId: idPoint },
        ],
      },
      orderBy: [
        { typeArborescence: 'asc' },
        { ordre: 'asc' },
      ],
    });

    return {
      ...point,
      liens,
    };
  }

  async create(dto: CreatePointStructureDto) {
    const code = this.normalizeCode(dto.code);
    const libelle = this.normalizeText(dto.libelle);
    const description = this.normalizeText(dto.description);
    const typePoint = this.normalizeTypePoint(dto.typePoint);

    if (!code) {
      throw new BadRequestException('Le code est obligatoire.');
    }

    if (!libelle) {
      throw new BadRequestException('Le libellé est obligatoire.');
    }

    const existing = await this.prisma.point_structure.findUnique({
      where: { code },
    });

    if (existing) {
      throw new ConflictException('Ce code de point de structure existe déjà.');
    }

    return this.prisma.point_structure.create({
      data: {
        code,
        libelle,
        description,
        typePoint,
        actif: dto.actif ?? true,
      },
    });
  }

  async update(idPoint: number, dto: UpdatePointStructureDto) {
    const existing = await this.prisma.point_structure.findUnique({
      where: { idPoint },
    });

    if (!existing) {
      throw new NotFoundException('Point de structure introuvable.');
    }

    const data: any = {};

    if (dto.code !== undefined) {
      const code = this.normalizeCode(dto.code);

      if (!code) {
        throw new BadRequestException('Le code ne peut pas être vide.');
      }

      const codeAlreadyUsed = await this.prisma.point_structure.findFirst({
        where: {
          code,
          idPoint: {
            not: idPoint,
          },
        },
      });

      if (codeAlreadyUsed) {
        throw new ConflictException('Ce code est déjà utilisé par un autre point.');
      }

      data.code = code;
    }

    if (dto.libelle !== undefined) {
      const libelle = this.normalizeText(dto.libelle);

      if (!libelle) {
        throw new BadRequestException('Le libellé ne peut pas être vide.');
      }

      data.libelle = libelle;
    }

    if (dto.description !== undefined) {
      data.description = this.normalizeText(dto.description);
    }

    if (dto.typePoint !== undefined) {
      data.typePoint = this.normalizeTypePoint(dto.typePoint);
    }

    if (dto.actif !== undefined) {
      data.actif = dto.actif;
    }

    return this.prisma.point_structure.update({
      where: { idPoint },
      data,
    });
  }

  async softDelete(idPoint: number) {
    const existing = await this.prisma.point_structure.findUnique({
      where: { idPoint },
    });

    if (!existing) {
      throw new NotFoundException('Point de structure introuvable.');
    }

    return this.prisma.point_structure.update({
      where: { idPoint },
      data: {
        actif: false,
      },
    });
  }

  async restore(idPoint: number) {
    const existing = await this.prisma.point_structure.findUnique({
      where: { idPoint },
    });

    if (!existing) {
      throw new NotFoundException('Point de structure introuvable.');
    }

    return this.prisma.point_structure.update({
      where: { idPoint },
      data: {
        actif: true,
      },
    });
  }
}