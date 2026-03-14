import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModeleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.modele.findMany({
      include: {
        famille: true,
      },
    });
  }

  create(data: { code?: string; libelle?: string; idFamille?: number }) {
    return this.prisma.modele.create({
      data,
      include: {
        famille: true,
      },
    });
  }
}