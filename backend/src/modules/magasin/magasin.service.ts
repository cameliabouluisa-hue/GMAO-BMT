import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMagasinDto } from './dto/create-magasin.dto';
import { UpdateMagasinDto } from './dto/update-magasin.dto';

@Injectable()
export class MagasinService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMagasinDto) {
    const existing = await this.prisma.magasin.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException('Un magasin avec ce code existe déjà.');
    }

    return this.prisma.magasin.create({
      data: {
        code: dto.code.trim(),
        libelle: dto.libelle.trim(),
        actif: dto.actif ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.magasin.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async findOne(id: number) {
    const magasin = await this.prisma.magasin.findUnique({
      where: { idMagasin: id },
    });

    if (!magasin) {
      throw new NotFoundException('Magasin introuvable.');
    }

    return magasin;
  }

  async update(id: number, dto: UpdateMagasinDto) {
    await this.findOne(id);

    if (dto.code) {
      const existing = await this.prisma.magasin.findFirst({
        where: {
          code: dto.code,
          NOT: { idMagasin: id },
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Un magasin avec ce code existe déjà.',
        );
      }
    }

    return this.prisma.magasin.update({
      where: { idMagasin: id },
      data: {
        ...(dto.code !== undefined && { code: dto.code.trim() }),
        ...(dto.libelle !== undefined && {
          libelle: dto.libelle.trim(),
        }),
        ...(dto.actif !== undefined && { actif: dto.actif }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const stockExists = await this.prisma.stock_article_magasin.count({
      where: { idMagasin: id },
    });

    if (stockExists > 0) {
      throw new BadRequestException(
        'Impossible de supprimer ce magasin car il contient du stock.',
      );
    }

    return this.prisma.magasin.delete({
      where: { idMagasin: id },
    });
  }
}