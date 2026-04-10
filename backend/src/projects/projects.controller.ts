import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /** Any authenticated user can read projects */
  @Get()
  findAll() {
    return this.projectsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id)
  }

  /** Manager only: create project */
  @Post()
  @Roles('manager')
  create(@Body() body: { title: string; color?: string; ownerId: string }) {
    return this.projectsService.create(body.title, body.color ?? '#6366f1', body.ownerId)
  }

  /** Manager only: rename project */
  @Patch(':id/rename')
  @Roles('manager')
  rename(@Param('id') id: string, @Body() body: { title: string }) {
    return this.projectsService.rename(id, body.title)
  }

  /** Manager only: change project color */
  @Patch(':id/color')
  @Roles('manager')
  updateColor(@Param('id') id: string, @Body() body: { color: string }) {
    return this.projectsService.updateColor(id, body.color)
  }

  /** Manager only: delete project */
  @Delete(':id')
  @Roles('manager')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id)
  }

  /* ── Columns — manager only ── */

  @Post(':id/columns')
  @Roles('manager')
  addColumn(@Param('id') id: string, @Body() body: { title: string }) {
    return this.projectsService.addColumn(id, body.title)
  }

  @Patch(':id/columns/:colId/rename')
  @Roles('manager')
  renameColumn(
      @Param('id') id: string,
      @Param('colId') colId: string,
      @Body() body: { title: string },
  ) {
    return this.projectsService.renameColumn(id, colId, body.title)
  }

  @Delete(':id/columns/:colId')
  @Roles('manager')
  deleteColumn(@Param('id') id: string, @Param('colId') colId: string) {
    return this.projectsService.deleteColumn(id, colId)
  }

  @Patch(':id/columns/reorder')
  @Roles('manager')
  reorderColumns(@Param('id') id: string, @Body() body: { columnIds: string[] }) {
    return this.projectsService.reorderColumns(id, body.columnIds)
  }

  /* ── Cards (any authenticated user) ── */

  @Post(':id/columns/:colId/cards')
  addCard(@Param('colId') colId: string, @Body() body: { title: string }) {
    return this.projectsService.addCard(colId, body.title)
  }

  @Patch(':id/cards/:cardId')
  updateCard(
      @Param('cardId') cardId: string,
      @Body() body: {
        title?: string;
        description?: string;
        dueDate?: string;
        labels?: { id: string; text: string; color: string }[];
      },
  ) {
    return this.projectsService.updateCard(cardId, body)
  }

  @Delete(':id/cards/:cardId')
  deleteCard(@Param('cardId') cardId: string) {
    return this.projectsService.deleteCard(cardId)
  }

  @Patch(':id/cards/:cardId/move')
  moveCard(
      @Param('cardId') cardId: string,
      @Body() body: { targetColumnId: string; position: number },
  ) {
    return this.projectsService.moveCard(cardId, body.targetColumnId, body.position)
  }
}