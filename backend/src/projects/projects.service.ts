import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './project.entity'
import { BoardColumn } from './board-column.entity'
import { Card } from '../tasks/card.entity'

export interface ProjectDto {
  id: string;
  title: string;
  color: string;
  columns: ColumnDto[];
  cards: Record<string, CardDto>;
}

export interface CardDto {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  columnId: string;
  labels: LabelDto[];
  assigneeId?: string;
  assigneeEmail?: string;
}

export interface LabelDto {
  id: string;
  text: string;
  color: string;
}

export interface ColumnDto {
  id: string;
  title: string;
  cardIds: string[];
}

@Injectable()
export class ProjectsService {
  constructor(
      @InjectRepository(Project)
      private readonly projectRepo: Repository<Project>,
      @InjectRepository(BoardColumn)
      private readonly columnRepo: Repository<BoardColumn>,
      @InjectRepository(Card)
      private readonly cardRepo: Repository<Card>,
  ) {}

  private async buildDto(project: Project): Promise<ProjectDto> {
    const columns = await this.columnRepo.find({
      where: { project: { id: project.id } },
      order: { position: 'ASC' },
    })

    const cards: Record<string, CardDto> = {}
    const columnDtos: ColumnDto[] = []

    for (const col of columns) {
      const colCards = await this.cardRepo.find({
        where: { column: { id: col.id } },
        relations: ['labels', 'assignee'],
        order: { position: 'ASC' },
      })
      columnDtos.push({ id: col.id, title: col.title, cardIds: colCards.map((c) => c.id) })
      for (const card of colCards) {
        cards[card.id] = {
          id: card.id,
          title: card.title,
          description: card.description ?? undefined,
          dueDate: card.dueDate ?? undefined,
          columnId: col.id,
          labels: card.labels.map((l) => ({ id: l.id, text: l.text, color: l.color })),
          assigneeId: card.assignee?.id ?? undefined,
          assigneeEmail: card.assignee?.email ?? undefined,
        }
      }
    }

    return { id: project.id, title: project.title, color: project.color, columns: columnDtos, cards }
  }

  async findAll(): Promise<ProjectDto[]> {
    const projects = await this.projectRepo.find({ order: { createdAt: 'ASC' } })
    return Promise.all(projects.map((p) => this.buildDto(p)))
  }

  async findOne(id: string): Promise<ProjectDto> {
    const project = await this.projectRepo.findOne({ where: { id } })
    if (!project) throw new NotFoundException('Project not found')
    return this.buildDto(project)
  }

  async create(title: string, color: string, ownerId: string): Promise<ProjectDto> {
    const project = this.projectRepo.create({ title, color, owner: { id: ownerId } })
    await this.projectRepo.save(project)

    const defaultCols = ['To Do', 'In Progress', 'Done']
    for (let i = 0; i < defaultCols.length; i++) {
      await this.columnRepo.save(
          this.columnRepo.create({ title: defaultCols[i], position: i, project }),
      )
    }
    return this.findOne(project.id)
  }

  async rename(id: string, title: string): Promise<ProjectDto> {
    const project = await this.projectRepo.findOne({ where: { id } })
    if (!project) throw new NotFoundException('Project not found')
    project.title = title
    await this.projectRepo.save(project)
    return this.findOne(id)
  }

  async updateColor(id: string, color: string): Promise<ProjectDto> {
    const project = await this.projectRepo.findOne({ where: { id } })
    if (!project) throw new NotFoundException('Project not found')
    project.color = color
    await this.projectRepo.save(project)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    const project = await this.projectRepo.findOne({ where: { id } })
    if (!project) throw new NotFoundException('Project not found')
    await this.projectRepo.remove(project)
  }

  async addColumn(projectId: string, title: string): Promise<ProjectDto> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } })
    if (!project) throw new NotFoundException('Project not found')
    const count = await this.columnRepo.count({ where: { project: { id: projectId } } })
    await this.columnRepo.save(
        this.columnRepo.create({ title, position: count, project }),
    )
    return this.findOne(projectId)
  }

  async renameColumn(projectId: string, columnId: string, title: string): Promise<ProjectDto> {
    const col = await this.columnRepo.findOne({ where: { id: columnId } })
    if (!col) throw new NotFoundException('Column not found')
    col.title = title
    await this.columnRepo.save(col)
    return this.findOne(projectId)
  }

  async deleteColumn(projectId: string, columnId: string): Promise<ProjectDto> {
    const col = await this.columnRepo.findOne({ where: { id: columnId } })
    if (!col) throw new NotFoundException('Column not found')
    await this.columnRepo.remove(col)
    return this.findOne(projectId)
  }

  async reorderColumns(projectId: string, columnIds: string[]): Promise<ProjectDto> {
    for (let i = 0; i < columnIds.length; i++) {
      await this.columnRepo.update(columnIds[i], { position: i })
    }
    return this.findOne(projectId)
  }

  async addCard(columnId: string, title: string): Promise<ProjectDto> {
    const col = await this.columnRepo.findOne({
      where: { id: columnId },
      relations: ['project'],
    })
    if (!col) throw new NotFoundException('Column not found')
    const count = await this.cardRepo.count({ where: { column: { id: columnId } } })
    await this.cardRepo.save(
        this.cardRepo.create({ title, position: count, column: col }),
    )
    return this.findOne(col.project.id)
  }

  async updateCard(
      cardId: string,
      data: {
        title?: string;
        description?: string;
        dueDate?: string;
        labels?: LabelDto[];
        assigneeId?: string | null;
      },
  ): Promise<ProjectDto> {
    const card = await this.cardRepo.findOne({
      where: { id: cardId },
      relations: ['column', 'column.project', 'labels', 'assignee'],
    })
    if (!card) throw new NotFoundException('Card not found')

    if (data.title !== undefined) card.title = data.title
    if (data.description !== undefined) card.description = data.description
    if (data.dueDate !== undefined) card.dueDate = data.dueDate

    // Handle assignee
    if ('assigneeId' in data) {
      if (data.assigneeId === null || data.assigneeId === undefined) {
        card.assignee = null
      } else {
        card.assignee = { id: data.assigneeId } as any
      }
    }

    if (data.labels !== undefined) {
      const { CardLabel } = require('../tasks/card-label.entity')
      card.labels = data.labels.map((l) => {
        const label = new CardLabel()
        label.text = l.text
        label.color = l.color
        return label
      })
    }

    await this.cardRepo.save(card)
    return this.findOne(card.column.project.id)
  }

  async deleteCard(cardId: string): Promise<ProjectDto> {
    const card = await this.cardRepo.findOne({
      where: { id: cardId },
      relations: ['column', 'column.project'],
    })
    if (!card) throw new NotFoundException('Card not found')
    const projectId = card.column.project.id
    await this.cardRepo.remove(card)
    return this.findOne(projectId)
  }

  async moveCard(
      cardId: string,
      targetColumnId: string,
      newPosition: number,
  ): Promise<ProjectDto> {
    const card = await this.cardRepo.findOne({
      where: { id: cardId },
      relations: ['column', 'column.project'],
    })
    if (!card) throw new NotFoundException('Card not found')
    const projectId = card.column.project.id

    const targetCol = await this.columnRepo.findOne({ where: { id: targetColumnId } })
    if (!targetCol) throw new NotFoundException('Target column not found')

    card.column = targetCol
    card.position = newPosition
    await this.cardRepo.save(card)

    const colCards = await this.cardRepo.find({
      where: { column: { id: targetColumnId } },
      order: { position: 'ASC' },
    })
    for (let i = 0; i < colCards.length; i++) {
      if (colCards[i].position !== i) {
        await this.cardRepo.update(colCards[i].id, { position: i })
      }
    }

    return this.findOne(projectId)
  }
}