import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateModeleDto } from './dto/create-modele.dto';
import { UpdateModeleDto } from './dto/update-modele.dto';

@Injectable()
export class ModeleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.modele.findMany({
      include: {
        famille: true,
        etat_modele: true,
      },
      orderBy: {
        idModele: 'desc',
      },
    });
  }

  async findOne(idModele: number) {
    const modele = await this.prisma.modele.findUnique({
      where: { idModele },
      include: {
        famille: true,
        etat_modele: true,
        gamme: true,
        materiel: true,
      },
    });

    if (!modele) {
      throw new NotFoundException('Modèle introuvable.');
    }

    return modele;
  }

  async create(createModeleDto: CreateModeleDto) {
    if (createModeleDto.idFamille) {
      const famille = await this.prisma.famille.findUnique({
        where: { idFamille: createModeleDto.idFamille },
      });

      if (!famille) {
        throw new BadRequestException('La famille sélectionnée est introuvable.');
      }
    }

    const etat = await this.prisma.etat_modele.findUnique({
      where: { idEtat: createModeleDto.idEtat },
    });

    if (!etat) {
      throw new BadRequestException("L'état du modèle est introuvable.");
    }

    return this.prisma.modele.create({
      data: {
        code: createModeleDto.code ?? null,
        libelle: createModeleDto.libelle ?? null,
        idFamille: createModeleDto.idFamille ?? null,
        idEtat: createModeleDto.idEtat,
      },
      include: {
        famille: true,
        etat_modele: true,
      },
    });
  }

  async update(idModele: number, updateModeleDto: UpdateModeleDto) {
    const existingModele = await this.prisma.modele.findUnique({
      where: { idModele },
    });

    if (!existingModele) {
      throw new NotFoundException('Modèle introuvable.');
    }

    if (updateModeleDto.idFamille !== undefined && updateModeleDto.idFamille !== null) {
      const famille = await this.prisma.famille.findUnique({
        where: { idFamille: updateModeleDto.idFamille },
      });

      if (!famille) {
        throw new BadRequestException('La famille sélectionnée est introuvable.');
      }
    }

    if (updateModeleDto.idEtat !== undefined) {
      const etat = await this.prisma.etat_modele.findUnique({
        where: { idEtat: updateModeleDto.idEtat },
      });

      if (!etat) {
        throw new BadRequestException("L'état du modèle est introuvable.");
      }
    }

    return this.prisma.modele.update({
      where: { idModele },
      data: {
        code: updateModeleDto.code,
        libelle: updateModeleDto.libelle,
        idFamille: updateModeleDto.idFamille,
        idEtat: updateModeleDto.idEtat,
      },
      include: {
        famille: true,
        etat_modele: true,
      },
    });
  }

  async remove(idModele: number) {
    const existingModele = await this.prisma.modele.findUnique({
      where: { idModele },
      include: {
        _count: {
          select: {
            gamme: true,
            materiel: true,
          },
        },
      },
    });

    if (!existingModele) {
      throw new NotFoundException('Modèle introuvable.');
    }

    if (existingModele._count.gamme > 0 || existingModele._count.materiel > 0) {
      throw new BadRequestException(
        'Impossible de supprimer ce modèle car il est déjà utilisé par une gamme ou un matériel.',
      );
    }

    return this.prisma.modele.delete({
      where: { idModele },
    });
  }
}