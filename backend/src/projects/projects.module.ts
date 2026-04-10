import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './project.entity'
import { BoardColumn } from './board-column.entity'
import { Card } from '../tasks/card.entity'
import { CardLabel } from '../tasks/card-label.entity'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Project, BoardColumn, Card, CardLabel])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
