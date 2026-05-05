import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EntreeStockDto } from './dto/entree-stock.dto';
import { SortieStockDto } from './dto/sortie-stock.dto';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllStock() {
    return this.prisma.stock_article_magasin.findMany({
      include: {
        article: true,
        magasin: true,
      },
      orderBy: {
        idStock: 'desc',
      },
    });
  }

  async findAllMouvements() {
    return this.prisma.mouvement_stock.findMany({
      include: {
        article: true,
        materiel: true,
        magasinSource: true,
        magasinDestination: true,
      },
      orderBy: {
        dateMouvement: 'desc',
      },
    });
  }
async findEntreeById(idEntreeStock: number) {
  const entree = await this.prisma.entree_stock.findUnique({
    where: {
      idEntreeStock,
    },
    include: {
      lignes: {
        include: {
          article: true,
          magasin: true,
          emplacement: true,
          materiels: true,
        },
        orderBy: {
          idLigneEntreeStock: 'asc',
        },
      },
    },
  });

  if (!entree) {
    throw new NotFoundException(
      `Le bon d'entrée stock #${idEntreeStock} est introuvable.`,
    );
  }

  return entree;
}
  async findEntrees() {
    return this.prisma.entree_stock.findMany({
      orderBy: {
        idEntreeStock: 'desc',
      },
      include: {
        lignes: {
          include: {
            article: true,
            magasin: true,
            emplacement: true,
            materiels: true,
          },
        },
      },
    });
  }

  async findSorties() {
    return this.prisma.sortie_stock.findMany({
      orderBy: {
        idSortieStock: 'desc',
      },
      include: {
        lignes: {
          include: {
            article: true,
            magasin: true,
            emplacement: true,
            materiel: true,
          },
        },
      },
    });
  }

  async entreeStock(dto: EntreeStockDto) {
    const dateReception = new Date(dto.dateReception);

    return this.prisma.$transaction(async (tx) => {
      const numero =
        dto.numero?.trim() ||
        (await this.generateNumeroEntree(tx, dateReception));

      const entreeStock = await tx.entree_stock.create({
        data: {
          numero,
          dateReception,
          commentaire: dto.commentaire?.trim(),
          statut: 'VALIDEE',
        },
      });

      const lignesCreees: any[] = [];
const materielsCrees: any[] = [];

      for (const ligne of dto.lignes) {
        const article = await tx.article.findUnique({
          where: { idArticle: ligne.idArticle },
        });

        if (!article) {
          throw new NotFoundException(
            `Article introuvable : ${ligne.idArticle}.`,
          );
        }

        if (!article.gereEnStock) {
          throw new BadRequestException(
            `L'article ${article.reference ?? article.idArticle} n'est pas géré en stock.`,
          );
        }

        const magasin = await tx.magasin.findUnique({
          where: { idMagasin: ligne.idMagasin },
        });

        if (!magasin) {
          throw new NotFoundException(
            `Magasin introuvable : ${ligne.idMagasin}.`,
          );
        }

        if (ligne.idEmplacement) {
          const emplacement = await tx.emplacement_magasin.findUnique({
            where: { idEmplacement: ligne.idEmplacement },
          });

          if (!emplacement) {
            throw new NotFoundException(
              `Emplacement introuvable : ${ligne.idEmplacement}.`,
            );
          }

          if (emplacement.idMagasin !== ligne.idMagasin) {
            throw new BadRequestException(
              "L'emplacement choisi n'appartient pas au magasin sélectionné.",
            );
          }
        }

        const articleSerialise = Boolean(article.serialise);

        if (articleSerialise) {
          if (!Number.isInteger(ligne.quantite)) {
            throw new BadRequestException(
              `L'article ${article.reference ?? article.idArticle} est sérialisé : la quantité doit être un nombre entier.`,
            );
          }

          if (!ligne.materiels || ligne.materiels.length !== ligne.quantite) {
            throw new BadRequestException(
              `Pour l'article sérialisé ${article.reference ?? article.idArticle}, le nombre de matériels doit être égal à la quantité reçue.`,
            );
          }

          this.validateMaterielsSansDoublons(ligne.materiels);
        } else {
          if (ligne.materiels && ligne.materiels.length > 0) {
            throw new BadRequestException(
              `L'article ${article.reference ?? article.idArticle} n'est pas sérialisé : vous ne devez pas saisir de matériels.`,
            );
          }
        }

        const ligneCreee = await tx.entree_stock_ligne.create({
          data: {
            idEntreeStock: entreeStock.idEntreeStock,
            idArticle: ligne.idArticle,
            idMagasin: ligne.idMagasin,
            idEmplacement: ligne.idEmplacement,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            numeroLot: ligne.numeroLot?.trim(),
            datePeremption: ligne.datePeremption
              ? new Date(ligne.datePeremption)
              : undefined,
            commentaire: ligne.commentaire?.trim(),
          },
        });

        lignesCreees.push(ligneCreee);

        await this.incrementerStock(tx, {
          idArticle: ligne.idArticle,
          idMagasin: ligne.idMagasin,
          quantite: ligne.quantite,
        });

        if (articleSerialise && ligne.materiels) {
          for (const item of ligne.materiels) {
            const code = item.code.trim();
            const numeroSerie = item.numeroSerie?.trim();

            const conditionsDoublon = [
              {
                code,
              },
            ];

            if (numeroSerie) {
              conditionsDoublon.push({
                numeroSerie,
              } as any);
            }

            const existingMateriel = await tx.materiel.findFirst({
              where: {
                OR: conditionsDoublon,
              },
            });

            if (existingMateriel) {
              throw new BadRequestException(
                `Le matériel ${code} ou son numéro de série existe déjà.`,
              );
            }

            const materiel = await tx.materiel.create({
              data: {
                code,
                numeroSerie,
                idArticle: article.idArticle,
                idModele: article.idModele,
                idLigneEntreeStock: ligneCreee.idLigneEntreeStock,
                actif: true,
              },
            });

            materielsCrees.push(materiel);

            await tx.mouvement_stock.create({
              data: {
                typeMouvement: 'ENTREE',
                dateMouvement: dateReception,
                quantite: 1,
                idArticle: article.idArticle,
                idMateriel: materiel.idMateriel,
                idMagasinDestination: ligne.idMagasin,
                origineType: 'ENTREE_STOCK',
                origineId: entreeStock.idEntreeStock,
                commentaire:
                  ligne.commentaire?.trim() ||
                  dto.commentaire?.trim() ||
                  `Réception du matériel ${materiel.code}`,
              },
            });
          }
        } else {
          await tx.mouvement_stock.create({
            data: {
              typeMouvement: 'ENTREE',
              dateMouvement: dateReception,
              quantite: ligne.quantite,
              idArticle: article.idArticle,
              idMagasinDestination: ligne.idMagasin,
              origineType: 'ENTREE_STOCK',
              origineId: entreeStock.idEntreeStock,
              commentaire:
                ligne.commentaire?.trim() ||
                dto.commentaire?.trim() ||
                'Entrée en stock',
            },
          });
        }
      }

      return {
        message: 'Bon d’entrée stock enregistré avec succès.',
        entreeStock,
        lignesCreees,
        materielsCrees,
      };
    });
  }

  async sortieStock(dto: SortieStockDto) {
    const dateSortie = new Date(dto.dateSortie);

    return this.prisma.$transaction(async (tx) => {
      const numero =
        dto.numero?.trim() ||
        (await this.generateNumeroSortie(tx, dateSortie));

      const sortieStock = await tx.sortie_stock.create({
        data: {
          numero,
          dateSortie,
          commentaire: dto.commentaire?.trim(),
          statut: 'VALIDEE',
        },
      });

     const lignesCreees: any[] = [];

      for (const ligne of dto.lignes) {
        const article = await tx.article.findUnique({
          where: { idArticle: ligne.idArticle },
        });

        if (!article) {
          throw new NotFoundException(
            `Article introuvable : ${ligne.idArticle}.`,
          );
        }

        if (!article.gereEnStock) {
          throw new BadRequestException(
            `L'article ${article.reference ?? article.idArticle} n'est pas géré en stock.`,
          );
        }

        const magasin = await tx.magasin.findUnique({
          where: { idMagasin: ligne.idMagasin },
        });

        if (!magasin) {
          throw new NotFoundException(
            `Magasin introuvable : ${ligne.idMagasin}.`,
          );
        }

        if (ligne.idEmplacement) {
          const emplacement = await tx.emplacement_magasin.findUnique({
            where: { idEmplacement: ligne.idEmplacement },
          });

          if (!emplacement) {
            throw new NotFoundException(
              `Emplacement introuvable : ${ligne.idEmplacement}.`,
            );
          }

          if (emplacement.idMagasin !== ligne.idMagasin) {
            throw new BadRequestException(
              "L'emplacement choisi n'appartient pas au magasin sélectionné.",
            );
          }
        }

        const articleSerialise = Boolean(article.serialise);

        if (articleSerialise) {
          if (!ligne.idMateriel) {
            throw new BadRequestException(
              `L'article ${article.reference ?? article.idArticle} est sérialisé : vous devez choisir le matériel exact à sortir.`,
            );
          }

          if (ligne.quantite !== 1) {
            throw new BadRequestException(
              "Pour un article sérialisé, la quantité de sortie doit être égale à 1 par matériel.",
            );
          }

          const materiel = await tx.materiel.findUnique({
            where: { idMateriel: ligne.idMateriel },
          });

          if (!materiel) {
            throw new NotFoundException(
              `Matériel introuvable : ${ligne.idMateriel}.`,
            );
          }

          if (materiel.idArticle !== ligne.idArticle) {
            throw new BadRequestException(
              "Le matériel choisi ne correspond pas à l'article sélectionné.",
            );
          }

          await this.verifierMaterielDisponibleDansMagasin(tx, {
            idMateriel: ligne.idMateriel,
            idMagasin: ligne.idMagasin,
          });
        } else {
          if (ligne.idMateriel) {
            throw new BadRequestException(
              "Un article non sérialisé ne doit pas avoir de matériel sélectionné.",
            );
          }
        }

        await this.verifierQuantiteDisponible(tx, {
          idArticle: ligne.idArticle,
          idMagasin: ligne.idMagasin,
          quantiteDemandee: ligne.quantite,
        });

        const ligneCreee = await tx.sortie_stock_ligne.create({
          data: {
            idSortieStock: sortieStock.idSortieStock,
            idArticle: ligne.idArticle,
            idMagasin: ligne.idMagasin,
            idEmplacement: ligne.idEmplacement,
            idMateriel: ligne.idMateriel,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            commentaire: ligne.commentaire?.trim(),
          },
        });

        lignesCreees.push(ligneCreee);

        await this.decrementerStock(tx, {
          idArticle: ligne.idArticle,
          idMagasin: ligne.idMagasin,
          quantite: ligne.quantite,
        });

        await tx.mouvement_stock.create({
          data: {
            typeMouvement: 'SORTIE',
            dateMouvement: dateSortie,
            quantite: ligne.quantite,
            idArticle: ligne.idArticle,
            idMateriel: ligne.idMateriel,
            idMagasinSource: ligne.idMagasin,
            origineType: 'SORTIE_STOCK',
            origineId: sortieStock.idSortieStock,
            commentaire:
              ligne.commentaire?.trim() ||
              dto.commentaire?.trim() ||
              'Sortie de stock',
          },
        });
      }

      return {
        message: 'Bon de sortie stock enregistré avec succès.',
        sortieStock,
        lignesCreees,
      };
    });
  }

  private async incrementerStock(
    tx: any,
    params: {
      idArticle: number;
      idMagasin: number;
      quantite: number;
    },
  ) {
    const stockExistant = await tx.stock_article_magasin.findUnique({
      where: {
        idArticle_idMagasin: {
          idArticle: params.idArticle,
          idMagasin: params.idMagasin,
        },
      },
    });

    if (!stockExistant) {
      return tx.stock_article_magasin.create({
        data: {
          idArticle: params.idArticle,
          idMagasin: params.idMagasin,
          quantitePhysique: params.quantite,
          quantiteReservee: 0,
          quantiteDisponible: params.quantite,
        },
      });
    }

    const nouvelleQuantitePhysique =
      Number(stockExistant.quantitePhysique) + params.quantite;

    const quantiteReservee = Number(stockExistant.quantiteReservee ?? 0);

    return tx.stock_article_magasin.update({
      where: {
        idStock: stockExistant.idStock,
      },
      data: {
        quantitePhysique: nouvelleQuantitePhysique,
        quantiteDisponible: nouvelleQuantitePhysique - quantiteReservee,
      },
    });
  }

  private async decrementerStock(
    tx: any,
    params: {
      idArticle: number;
      idMagasin: number;
      quantite: number;
    },
  ) {
    const stockExistant = await tx.stock_article_magasin.findUnique({
      where: {
        idArticle_idMagasin: {
          idArticle: params.idArticle,
          idMagasin: params.idMagasin,
        },
      },
    });

    if (!stockExistant) {
      throw new BadRequestException('Aucun stock trouvé pour cet article.');
    }

    const quantitePhysique = Number(stockExistant.quantitePhysique ?? 0);
    const quantiteReservee = Number(stockExistant.quantiteReservee ?? 0);
    const quantiteDisponible = Number(stockExistant.quantiteDisponible ?? 0);

    if (quantiteDisponible < params.quantite) {
      throw new BadRequestException(
        `Stock insuffisant. Disponible : ${quantiteDisponible}, demandé : ${params.quantite}.`,
      );
    }

    const nouvelleQuantitePhysique = quantitePhysique - params.quantite;
    const nouvelleQuantiteDisponible =
      nouvelleQuantitePhysique - quantiteReservee;

    return tx.stock_article_magasin.update({
      where: {
        idStock: stockExistant.idStock,
      },
      data: {
        quantitePhysique: nouvelleQuantitePhysique,
        quantiteDisponible: nouvelleQuantiteDisponible,
      },
    });
  }

  private async verifierQuantiteDisponible(
    tx: any,
    params: {
      idArticle: number;
      idMagasin: number;
      quantiteDemandee: number;
    },
  ) {
    const stock = await tx.stock_article_magasin.findUnique({
      where: {
        idArticle_idMagasin: {
          idArticle: params.idArticle,
          idMagasin: params.idMagasin,
        },
      },
    });

    if (!stock) {
      throw new BadRequestException('Aucun stock disponible pour cet article.');
    }

    const disponible = Number(stock.quantiteDisponible ?? 0);

    if (disponible < params.quantiteDemandee) {
      throw new BadRequestException(
        `Quantité insuffisante. Disponible : ${disponible}, demandé : ${params.quantiteDemandee}.`,
      );
    }
  }

  private async verifierMaterielDisponibleDansMagasin(
    tx: any,
    params: {
      idMateriel: number;
      idMagasin: number;
    },
  ) {
    const dernierMouvement = await tx.mouvement_stock.findFirst({
      where: {
        idMateriel: params.idMateriel,
      },
      orderBy: {
        idMouvement: 'desc',
      },
    });

    if (!dernierMouvement) {
      throw new BadRequestException(
        "Ce matériel n'a aucun mouvement stock.",
      );
    }

    if (
      dernierMouvement.typeMouvement !== 'ENTREE' ||
      dernierMouvement.idMagasinDestination !== params.idMagasin
    ) {
      throw new BadRequestException(
        "Ce matériel n'est pas disponible dans ce magasin.",
      );
    }
  }

  private validateMaterielsSansDoublons(
    materiels: {
      code: string;
      numeroSerie?: string;
    }[],
  ) {
    const codes = new Set<string>();
    const numerosSerie = new Set<string>();

    for (const materiel of materiels) {
      const code = materiel.code.trim();

      if (codes.has(code)) {
        throw new BadRequestException(
          `Le code matériel ${code} est saisi plusieurs fois.`,
        );
      }

      codes.add(code);

      const numeroSerie = materiel.numeroSerie?.trim();

      if (numeroSerie) {
        if (numerosSerie.has(numeroSerie)) {
          throw new BadRequestException(
            `Le numéro de série ${numeroSerie} est saisi plusieurs fois.`,
          );
        }

        numerosSerie.add(numeroSerie);
      }
    }
  }

  private async generateNumeroEntree(tx: any, date: Date) {
    const year = date.getFullYear();

    const last = await tx.entree_stock.findFirst({
      where: {
        numero: {
          startsWith: `BE-${year}-`,
        },
      },
      orderBy: {
        idEntreeStock: 'desc',
      },
    });

    const nextNumber = last
      ? Number(last.numero.split('-').at(-1)) + 1
      : 1;

    return `BE-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  private async generateNumeroSortie(tx: any, date: Date) {
    const year = date.getFullYear();

    const last = await tx.sortie_stock.findFirst({
      where: {
        numero: {
          startsWith: `BS-${year}-`,
        },
      },
      orderBy: {
        idSortieStock: 'desc',
      },
    });

    const nextNumber = last
      ? Number(last.numero.split('-').at(-1)) + 1
      : 1;

    return `BS-${year}-${String(nextNumber).padStart(4, '0')}`;
  }
}