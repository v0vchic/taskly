import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './project.entity'
import { BoardColumn } from './board-column.entity'
import { Card } from '../tasks/card.entity'
import { CardLabel } from '../tasks/card-label.entity'
import { CardComment } from '../tasks/card-comment.entity'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'
import { CommentsService } from '../tasks/comments.service'
import { CommentsController } from '../tasks/comments.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Project, BoardColumn, Card, CardLabel, CardComment])],
  providers: [ProjectsService, CommentsService],
  controllers: [ProjectsController, CommentsController],
})
export class ProjectsModule {}