import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateRelations(
    idFamille?: number,
    idUniteArticle?: number,
    idModele?: number,
  ) {
    if (idFamille !== undefined) {
      const famille = await this.prisma.famille.findUnique({
        where: { idFamille },
      });

      if (!famille) {
        throw new BadRequestException('Famille introuvable.');
      }
    }

    if (idUniteArticle !== undefined) {
      const unite = await this.prisma.unite_article.findUnique({
        where: { idUniteArticle },
      });

      if (!unite) {
        throw new BadRequestException("Unité d'article introuvable.");
      }
    }

    if (idModele !== undefined) {
      const modele = await this.prisma.modele.findUnique({
        where: { idModele },
      });

      if (!modele) {
        throw new BadRequestException('Modèle introuvable.');
      }
    }
  }

  private validateBusinessRules(dto: {
    serialise?: boolean;
    gereEnStock?: boolean;
  }) {
    if (dto.serialise === true && dto.gereEnStock === false) {
      throw new BadRequestException(
        'Un article sérialisé doit être géré en stock.',
      );
    }
  }

  async create(createDto: CreateArticleDto) {
    this.validateBusinessRules(createDto);

    const existing = await this.prisma.article.findUnique({
      where: { reference: createDto.reference },
    });

    if (existing) {
      throw new BadRequestException(
        'Un article avec cette référence existe déjà.',
      );
    }

    await this.validateRelations(
      createDto.idFamille,
      createDto.idUniteArticle,
      createDto.idModele,
    );

    return this.prisma.article.create({
      data: {
        reference: createDto.reference.trim(),
        designation: createDto.designation.trim(),
        description: createDto.description?.trim(),
        prixUnitaire: createDto.prixUnitaire,
        idFamille: createDto.idFamille,
        idUniteArticle: createDto.idUniteArticle,
        idModele: createDto.idModele,
        gereEnStock: createDto.gereEnStock ?? true,
        serialise: createDto.serialise ?? false,
        reparable: createDto.reparable ?? false,
        actif: createDto.actif ?? true,
      },
      include: {
        famille: true,
        uniteArticle: true,
        modele: true,
        consommations: true,
      },
    });
  }

  async findAll() {
    return this.prisma.article.findMany({
      include: {
        famille: true,
        uniteArticle: true,
        modele: true,
        consommations: true,
      },
      orderBy: { reference: 'asc' },
    });
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { idArticle: id },
      include: {
        famille: true,
        uniteArticle: true,
        modele: true,
        consommations: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Article introuvable.');
    }

    return article;
  }

  async update(id: number, updateDto: UpdateArticleDto) {
    const existingArticle = await this.findOne(id);

    const futureSerialise = updateDto.serialise ?? existingArticle.serialise;
    const futureGereEnStock =
      updateDto.gereEnStock ?? existingArticle.gereEnStock;

    this.validateBusinessRules({
      serialise: futureSerialise,
      gereEnStock: futureGereEnStock,
    });

    if (updateDto.reference) {
      const existing = await this.prisma.article.findFirst({
        where: {
          reference: updateDto.reference,
          NOT: { idArticle: id },
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Un article avec cette référence existe déjà.',
        );
      }
    }

    await this.validateRelations(
      updateDto.idFamille,
      updateDto.idUniteArticle,
      updateDto.idModele,
    );

    return this.prisma.article.update({
      where: { idArticle: id },
      data: {
        ...(updateDto.reference !== undefined && {
          reference: updateDto.reference.trim(),
        }),
        ...(updateDto.designation !== undefined && {
          designation: updateDto.designation.trim(),
        }),
        ...(updateDto.description !== undefined && {
          description: updateDto.description?.trim(),
        }),
        ...(updateDto.prixUnitaire !== undefined && {
          prixUnitaire: updateDto.prixUnitaire,
        }),
        ...(updateDto.idFamille !== undefined && {
          idFamille: updateDto.idFamille,
        }),
        ...(updateDto.idUniteArticle !== undefined && {
          idUniteArticle: updateDto.idUniteArticle,
        }),
        ...(updateDto.idModele !== undefined && {
          idModele: updateDto.idModele,
        }),
        ...(updateDto.gereEnStock !== undefined && {
          gereEnStock: updateDto.gereEnStock,
        }),
        ...(updateDto.serialise !== undefined && {
          serialise: updateDto.serialise,
        }),
        ...(updateDto.reparable !== undefined && {
          reparable: updateDto.reparable,
        }),
        ...(updateDto.actif !== undefined && {
          actif: updateDto.actif,
        }),
      },
      include: {
        famille: true,
        uniteArticle: true,
        modele: true,
        consommations: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const consommationCount = await this.prisma.consommation.count({
      where: { idArticle: id },
    });

    if (consommationCount > 0) {
      throw new BadRequestException(
        'Impossible de supprimer cet article car il est utilisé dans des consommations.',
      );
    }

    return this.prisma.article.delete({
      where: { idArticle: id },
    });
  }
}