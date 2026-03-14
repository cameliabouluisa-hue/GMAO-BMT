import { Injectable } from '@nestjs/common';
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

  create(data: { code?: string; libelle?: string; parent_id?: number | null }) {
    return this.prisma.famille.create({
      data,
    });
  }
}
/*import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FamilleService {
  constructor(private readonly prisma: PrismaService) {}
findAll() {
  return this.prisma.famille.findMany({
    where: {
      parent_id: {
        not: null,
      },
    },
   /* include: {
      famille: true,
    }, 
  });
}
  /*findAll() {
  return this.prisma.famille.findMany({
    include: {
       famille: true,
       other_famille: true,
    },
  });
} 

  create(data: { code?: string; libelle?: string }) {
    return this.prisma.famille.create({
      data,
    });
  }
}*/