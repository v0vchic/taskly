import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'

@Controller('cards/:cardId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get()
    findAll(@Param('cardId') cardId: string) {
        return this.commentsService.findByCard(cardId)
    }

    @Post()
    create(
        @Param('cardId') cardId: string,
        @Body() body: { text: string },
        @Req() req: any,
    ) {
        return this.commentsService.create(cardId, body.text, req.user.id)
    }

    @Patch(':commentId')
    update(
        @Param('commentId') commentId: string,
        @Body() body: { text: string },
        @Req() req: any,
    ) {
        return this.commentsService.update(commentId, body.text, req.user.id)
    }

    @Delete(':commentId')
    remove(
        @Param('commentId') commentId: string,
        @Req() req: any,
    ) {
        return this.commentsService.remove(commentId, req.user.id, req.user.role)
    }
}