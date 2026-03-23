import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLienArborescenceDto } from './dto/create-lien-arborescence.dto';
import { MoveNodeDto } from './dto/move-node.dto';

type TypeArborescence = 'GEOGRAPHIQUE' | 'TECHNIQUE' | 'MATERIEL';
type NodeType = 'POINT_STRUCTURE' | 'MATERIEL';

export type TreeNode = {
  key: string;
  id: number;
  type: NodeType;
  code: string | null;
  libelle: string | null;
  typePoint?: string | null;
  children: TreeNode[];
};

@Injectable()
export class ArborescenceService {
  constructor(private readonly prisma: PrismaService) {}

  async createLien(dto: CreateLienArborescenceDto) {
    await this.validateLien(dto);

    const exists = await this.prisma.lien_arborescence.findFirst({
      where: {
        typeArborescence: dto.typeArborescence,
        parentType: dto.parentType,
        parentPointId: dto.parentPointId ?? null,
        parentMaterielId: dto.parentMaterielId ?? null,
        enfantType: dto.enfantType,
        enfantPointId: dto.enfantPointId ?? null,
        enfantMaterielId: dto.enfantMaterielId ?? null,
      },
    });

    if (exists) {
      throw new BadRequestException('Ce lien existe déjà.');
    }

    await this.assertNoCycle(dto);

    return this.prisma.lien_arborescence.create({
      data: {
        typeArborescence: dto.typeArborescence,
        parentType: dto.parentType,
        parentPointId: dto.parentPointId ?? null,
        parentMaterielId: dto.parentMaterielId ?? null,
        enfantType: dto.enfantType,
        enfantPointId: dto.enfantPointId ?? null,
        enfantMaterielId: dto.enfantMaterielId ?? null,
        ordre: dto.ordre ?? null,
        actif: true,
      },
    });
  }

  async deleteLien(id: number) {
    const lien = await this.prisma.lien_arborescence.findUnique({
      where: { idLien: id },
    });

    if (!lien) {
      throw new NotFoundException('Lien introuvable.');
    }

    return this.prisma.lien_arborescence.delete({
      where: { idLien: id },
    });
  }

  async moveNode(dto: MoveNodeDto) {
    const existingLinks = await this.prisma.lien_arborescence.findMany({
      where: {
        typeArborescence: dto.typeArborescence,
        enfantType: dto.enfantType,
        enfantPointId: dto.enfantPointId ?? null,
        enfantMaterielId: dto.enfantMaterielId ?? null,
      },
    });

    if (!existingLinks.length) {
      throw new NotFoundException(
        "Aucun lien existant trouvé pour ce nœud dans cette arborescence.",
      );
    }

    await this.validateLien({
      typeArborescence: dto.typeArborescence,
      parentType: dto.nouveauParentType,
      parentPointId: dto.nouveauParentPointId,
      parentMaterielId: dto.nouveauParentMaterielId,
      enfantType: dto.enfantType,
      enfantPointId: dto.enfantPointId,
      enfantMaterielId: dto.enfantMaterielId,
    });

    await this.assertNoCycle({
      typeArborescence: dto.typeArborescence,
      parentType: dto.nouveauParentType,
      parentPointId: dto.nouveauParentPointId,
      parentMaterielId: dto.nouveauParentMaterielId,
      enfantType: dto.enfantType,
      enfantPointId: dto.enfantPointId,
      enfantMaterielId: dto.enfantMaterielId,
    });

    await this.prisma.lien_arborescence.deleteMany({
      where: {
        typeArborescence: dto.typeArborescence,
        enfantType: dto.enfantType,
        enfantPointId: dto.enfantPointId ?? null,
        enfantMaterielId: dto.enfantMaterielId ?? null,
      },
    });

    return this.prisma.lien_arborescence.create({
      data: {
        typeArborescence: dto.typeArborescence,
        parentType: dto.nouveauParentType,
        parentPointId: dto.nouveauParentPointId ?? null,
        parentMaterielId: dto.nouveauParentMaterielId ?? null,
        enfantType: dto.enfantType,
        enfantPointId: dto.enfantPointId ?? null,
        enfantMaterielId: dto.enfantMaterielId ?? null,
        actif: true,
      },
    });
  }

  async getGeographiqueTree(): Promise<TreeNode[]> {
    return this.getMergedTree('GEOGRAPHIQUE');
  }

  async getTechniqueTree(): Promise<TreeNode[]> {
    return this.getMergedTree('TECHNIQUE');
  }

  async getMaterielTree(): Promise<TreeNode[]> {
    return this.getTreeByType('MATERIEL');
  }

  private async getTreeByType(
    typeArborescence: TypeArborescence,
  ): Promise<TreeNode[]> {
    const liens = await this.prisma.lien_arborescence.findMany({
      where: {
        typeArborescence,
        actif: true,
      },
      orderBy: [{ ordre: 'asc' }, { idLien: 'asc' }],
    });

    const pointIds = new Set<number>();
    const materielIds = new Set<number>();

    for (const lien of liens) {
      if (lien.parentType === 'POINT_STRUCTURE' && lien.parentPointId) {
        pointIds.add(lien.parentPointId);
      }
      if (lien.enfantType === 'POINT_STRUCTURE' && lien.enfantPointId) {
        pointIds.add(lien.enfantPointId);
      }
      if (lien.parentType === 'MATERIEL' && lien.parentMaterielId) {
        materielIds.add(lien.parentMaterielId);
      }
      if (lien.enfantType === 'MATERIEL' && lien.enfantMaterielId) {
        materielIds.add(lien.enfantMaterielId);
      }
    }

    const [points, materiels] = await Promise.all([
      pointIds.size
        ? this.prisma.point_structure.findMany({
            where: { idPoint: { in: [...pointIds] } },
          })
        : Promise.resolve([]),
      materielIds.size
        ? this.prisma.materiel.findMany({
            where: { idMateriel: { in: [...materielIds] } },
          })
        : Promise.resolve([]),
    ]);

    const nodeMap = new Map<string, TreeNode>();

    for (const p of points) {
      nodeMap.set(`POINT_STRUCTURE-${p.idPoint}`, {
        key: `POINT_STRUCTURE-${p.idPoint}`,
        id: p.idPoint,
        type: 'POINT_STRUCTURE',
        code: p.code,
        libelle: p.libelle,
        typePoint: p.typePoint,
        children: [],
      });
    }

    for (const m of materiels) {
      nodeMap.set(`MATERIEL-${m.idMateriel}`, {
        key: `MATERIEL-${m.idMateriel}`,
        id: m.idMateriel,
        type: 'MATERIEL',
        code: m.code,
        libelle: m.numeroSerie,
        children: [],
      });
    }

    const childKeys = new Set<string>();

    for (const lien of liens) {
      const parentKey =
        lien.parentType === 'POINT_STRUCTURE'
          ? `POINT_STRUCTURE-${lien.parentPointId}`
          : `MATERIEL-${lien.parentMaterielId}`;

      const childKey =
        lien.enfantType === 'POINT_STRUCTURE'
          ? `POINT_STRUCTURE-${lien.enfantPointId}`
          : `MATERIEL-${lien.enfantMaterielId}`;

      const parentNode = nodeMap.get(parentKey);
      const childNode = nodeMap.get(childKey);

      if (!parentNode || !childNode) continue;

      if (!parentNode.children.some((c) => c.key === childNode.key)) {
        parentNode.children.push(childNode);
      }

      childKeys.add(childKey);
    }

    const roots: TreeNode[] = [];

    for (const [key, node] of nodeMap.entries()) {
      if (!childKeys.has(key)) {
        roots.push(node);
      }
    }

    return roots;
  }

  private async validateLien(dto: {
    typeArborescence: TypeArborescence;
    parentType: NodeType;
    parentPointId?: number | null;
    parentMaterielId?: number | null;
    enfantType: NodeType;
    enfantPointId?: number | null;
    enfantMaterielId?: number | null;
  }) {
    const parent = await this.getNode(
      dto.parentType,
      dto.parentPointId ?? null,
      dto.parentMaterielId ?? null,
    );

    const enfant = await this.getNode(
      dto.enfantType,
      dto.enfantPointId ?? null,
      dto.enfantMaterielId ?? null,
    );

    if (!parent) {
      throw new NotFoundException('Parent introuvable.');
    }

    if (!enfant) {
      throw new NotFoundException('Enfant introuvable.');
    }

    const parentKey = this.makeNodeKey(
      dto.parentType,
      dto.parentPointId ?? null,
      dto.parentMaterielId ?? null,
    );
    const childKey = this.makeNodeKey(
      dto.enfantType,
      dto.enfantPointId ?? null,
      dto.enfantMaterielId ?? null,
    );

    if (parentKey === childKey) {
      throw new BadRequestException(
        'Un nœud ne peut pas être parent de lui-même.',
      );
    }

    switch (dto.typeArborescence) {
      case 'GEOGRAPHIQUE': {
        if (dto.parentType !== 'POINT_STRUCTURE') {
          throw new BadRequestException(
            "Dans l'arborescence géographique, le parent doit être un point de structure.",
          );
        }

        const parentPoint = parent as { typePoint: string | null };

        if (parentPoint.typePoint !== 'GEOGRAPHIQUE') {
          throw new BadRequestException(
            'Le parent doit être un point de type GEOGRAPHIQUE.',
          );
        }

        if (dto.enfantType === 'POINT_STRUCTURE') {
          const enfantPoint = enfant as { typePoint: string | null };

          if (
            enfantPoint.typePoint !== 'GEOGRAPHIQUE' &&
            enfantPoint.typePoint !== 'TECHNIQUE'
          ) {
            throw new BadRequestException(
              "Un point géographique peut avoir comme fils un point GEOGRAPHIQUE ou TECHNIQUE.",
            );
          }
        }
        break;
      }

      case 'TECHNIQUE': {
        if (dto.parentType !== 'POINT_STRUCTURE') {
          throw new BadRequestException(
            "Dans l'arborescence technique, le parent doit être un point de structure.",
          );
        }

        const parentPoint = parent as { typePoint: string | null };

        if (parentPoint.typePoint !== 'TECHNIQUE') {
          throw new BadRequestException(
            'Le parent doit être un point de type TECHNIQUE.',
          );
        }

        if (dto.enfantType === 'POINT_STRUCTURE') {
          const enfantPoint = enfant as { typePoint: string | null };

          if (enfantPoint.typePoint !== 'TECHNIQUE') {
            throw new BadRequestException(
              "Dans l'arborescence technique, un point technique ne peut avoir comme fils qu'un point technique.",
            );
          }
        }
        break;
      }

      case 'MATERIEL':
        if (dto.parentType !== 'MATERIEL' || dto.enfantType !== 'MATERIEL') {
          throw new BadRequestException(
            "Dans l'arborescence matériel, le parent et l'enfant doivent être des matériels.",
          );
        }
        break;

      default:
        throw new BadRequestException("Type d'arborescence invalide.");
    }
  }

  private async assertNoCycle(dto: {
    typeArborescence: TypeArborescence;
    parentType: NodeType;
    parentPointId?: number | null;
    parentMaterielId?: number | null;
    enfantType: NodeType;
    enfantPointId?: number | null;
    enfantMaterielId?: number | null;
  }) {
    const liens = await this.prisma.lien_arborescence.findMany({
      where: {
        typeArborescence: dto.typeArborescence,
        actif: true,
      },
    });

    const graph = new Map<string, string[]>();

    for (const lien of liens) {
      const pKey = this.makeNodeKey(
        lien.parentType as NodeType,
        lien.parentPointId,
        lien.parentMaterielId,
      );
      const cKey = this.makeNodeKey(
        lien.enfantType as NodeType,
        lien.enfantPointId,
        lien.enfantMaterielId,
      );

      if (!graph.has(pKey)) {
        graph.set(pKey, []);
      }
      graph.get(pKey)!.push(cKey);
    }

    const newParentKey = this.makeNodeKey(
      dto.parentType,
      dto.parentPointId ?? null,
      dto.parentMaterielId ?? null,
    );
    const newChildKey = this.makeNodeKey(
      dto.enfantType,
      dto.enfantPointId ?? null,
      dto.enfantMaterielId ?? null,
    );

    if (!graph.has(newParentKey)) {
      graph.set(newParentKey, []);
    }
    graph.get(newParentKey)!.push(newChildKey);

    const visited = new Set<string>();
    const stack = new Set<string>();

    const hasCycle = (node: string): boolean => {
      if (stack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      stack.add(node);

      const neighbors = graph.get(node) ?? [];
      for (const next of neighbors) {
        if (hasCycle(next)) return true;
      }

      stack.delete(node);
      return false;
    };

    for (const node of graph.keys()) {
      if (hasCycle(node)) {
        throw new BadRequestException(
          "Cette liaison créerait une boucle dans l'arborescence.",
        );
      }
    }
  }

  private async getNode(
    nodeType: NodeType,
    pointId?: number | null,
    materielId?: number | null,
  ) {
    if (nodeType === 'POINT_STRUCTURE') {
      if (!pointId) return null;
      return this.prisma.point_structure.findUnique({
        where: { idPoint: pointId },
      });
    }

    if (!materielId) return null;
    return this.prisma.materiel.findUnique({
      where: { idMateriel: materielId },
    });
  }

  private makeNodeKey(
    nodeType: NodeType,
    pointId?: number | null,
    materielId?: number | null,
  ) {
    return nodeType === 'POINT_STRUCTURE'
      ? `POINT_STRUCTURE-${pointId}`
      : `MATERIEL-${materielId}`;
  }

  private async getMergedTree(
  rootType: 'GEOGRAPHIQUE' | 'TECHNIQUE',
): Promise<TreeNode[]> {
  const [rootLiens, techLiens, materielLiens] = await Promise.all([
    this.prisma.lien_arborescence.findMany({
      where: { typeArborescence: rootType, actif: true },
      orderBy: [{ ordre: 'asc' }, { idLien: 'asc' }],
    }),
    this.prisma.lien_arborescence.findMany({
      where: { typeArborescence: 'TECHNIQUE', actif: true },
      orderBy: [{ ordre: 'asc' }, { idLien: 'asc' }],
    }),
    this.prisma.lien_arborescence.findMany({
      where: { typeArborescence: 'MATERIEL', actif: true },
      orderBy: [{ ordre: 'asc' }, { idLien: 'asc' }],
    }),
  ]);

  const pointIds = new Set<number>();
  const materielIds = new Set<number>();

  const collectIds = (
    liens: Awaited<ReturnType<typeof this.prisma.lien_arborescence.findMany>>,
  ) => {
    for (const lien of liens) {
      if (lien.parentType === 'POINT_STRUCTURE' && lien.parentPointId) {
        pointIds.add(lien.parentPointId);
      }
      if (lien.enfantType === 'POINT_STRUCTURE' && lien.enfantPointId) {
        pointIds.add(lien.enfantPointId);
      }
      if (lien.parentType === 'MATERIEL' && lien.parentMaterielId) {
        materielIds.add(lien.parentMaterielId);
      }
      if (lien.enfantType === 'MATERIEL' && lien.enfantMaterielId) {
        materielIds.add(lien.enfantMaterielId);
      }
    }
  };

  collectIds(rootLiens);
  collectIds(techLiens);
  collectIds(materielLiens);

  const [points, materiels] = await Promise.all([
    pointIds.size
      ? this.prisma.point_structure.findMany({
          where: { idPoint: { in: [...pointIds] } },
        })
      : Promise.resolve([]),
    materielIds.size
      ? this.prisma.materiel.findMany({
          where: { idMateriel: { in: [...materielIds] } },
        })
      : Promise.resolve([]),
  ]);

  const baseNodeMap = new Map<string, TreeNode>();

  for (const p of points) {
    baseNodeMap.set(`POINT_STRUCTURE-${p.idPoint}`, {
      key: `POINT_STRUCTURE-${p.idPoint}`,
      id: p.idPoint,
      type: 'POINT_STRUCTURE',
      code: p.code,
      libelle: p.libelle,
      typePoint: p.typePoint,
      children: [],
    });
  }

  for (const m of materiels) {
    baseNodeMap.set(`MATERIEL-${m.idMateriel}`, {
      key: `MATERIEL-${m.idMateriel}`,
      id: m.idMateriel,
      type: 'MATERIEL',
      code: m.code,
      libelle: m.numeroSerie,
      children: [],
    });
  }

  const buildChildrenMap = (
    liens: Awaited<ReturnType<typeof this.prisma.lien_arborescence.findMany>>,
  ) => {
    const map = new Map<string, string[]>();

    for (const lien of liens) {
      const parentKey =
        lien.parentType === 'POINT_STRUCTURE'
          ? `POINT_STRUCTURE-${lien.parentPointId}`
          : `MATERIEL-${lien.parentMaterielId}`;

      const childKey =
        lien.enfantType === 'POINT_STRUCTURE'
          ? `POINT_STRUCTURE-${lien.enfantPointId}`
          : `MATERIEL-${lien.enfantMaterielId}`;

      if (!map.has(parentKey)) {
        map.set(parentKey, []);
      }

      map.get(parentKey)!.push(childKey);
    }

    return map;
  };

  const rootChildrenMap = buildChildrenMap(rootLiens);
  const techChildrenMap = buildChildrenMap(techLiens);
  const materielChildrenMap = buildChildrenMap(materielLiens);

  const childKeysInRoot = new Set<string>();
  for (const childKeys of rootChildrenMap.values()) {
    for (const key of childKeys) {
      childKeysInRoot.add(key);
    }
  }

  const buildNode = (key: string, visited = new Set<string>()): TreeNode => {
    if (visited.has(key)) {
      const existing = baseNodeMap.get(key);
      if (!existing) {
        throw new NotFoundException(`Nœud introuvable pour la clé ${key}`);
      }
      return {
        key: existing.key,
        id: existing.id,
        type: existing.type,
        code: existing.code,
        libelle: existing.libelle,
        typePoint: existing.typePoint,
        children: [],
      };
    }

    const original = baseNodeMap.get(key);
    if (!original) {
      throw new NotFoundException(`Nœud introuvable pour la clé ${key}`);
    }

    const nextVisited = new Set(visited);
    nextVisited.add(key);

    const node: TreeNode = {
      key: original.key,
      id: original.id,
      type: original.type,
      code: original.code,
      libelle: original.libelle,
      typePoint: original.typePoint,
      children: [],
    };

    const childKeys: string[] = [];

    // liens de l’arborescence demandée
    if (rootChildrenMap.has(key)) {
      childKeys.push(...rootChildrenMap.get(key)!);
    }

    // si on est dans le géographique et que le nœud est technique,
    // on ajoute aussi ses enfants techniques
    if (
      rootType === 'GEOGRAPHIQUE' &&
      node.type === 'POINT_STRUCTURE' &&
      node.typePoint === 'TECHNIQUE'
    ) {
      childKeys.push(...(techChildrenMap.get(key) ?? []));
    }

    // si le nœud est un matériel, on ajoute ses enfants matériels
    if (node.type === 'MATERIEL') {
      childKeys.push(...(materielChildrenMap.get(key) ?? []));
    }

    const uniqueChildKeys = [...new Set(childKeys)];

    for (const childKey of uniqueChildKeys) {
      node.children.push(buildNode(childKey, nextVisited));
    }

    return node;
  };

  const roots: TreeNode[] = [];

  for (const parentKey of rootChildrenMap.keys()) {
    if (!childKeysInRoot.has(parentKey)) {
      roots.push(buildNode(parentKey));
    }
  }

  return roots;
}
}  