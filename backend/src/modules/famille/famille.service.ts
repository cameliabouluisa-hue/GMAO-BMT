import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class FamilleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.famille.findMany({
      include: {
        modele: true,
      },
      orderBy: {
        idFamille: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const famille = await this.prisma.famille.findUnique({
      where: { idFamille: id },
      include: { modele: true },
    });

    if (!famille) {
      throw new NotFoundException('Famille introuvable');
    }

    return famille;
  }

  create(data: { code?: string; libelle?: string; parent_id?: number | null }) {
    return this.prisma.famille.create({
      data: {
        code: data.code,
        libelle: data.libelle,
        parent_id: data.parent_id ?? null,
      },
    });
  }

  async update(
    id: number,
    data: { code?: string; libelle?: string; parent_id?: number | null },
  ) {
    await this.findOne(id);

    return this.prisma.famille.update({
      where: { idFamille: id },
      data: {
        code: data.code,
        libelle: data.libelle,
        parent_id: data.parent_id ?? null,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.famille.delete({
      where: { idFamille: id },
    });
  }
}
