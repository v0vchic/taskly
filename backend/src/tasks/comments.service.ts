import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CardComment } from './card-comment.entity'

export interface CommentDto {
    id: string
    text: string
    authorId: string | null
    authorEmail: string | null
    createdAt: string
}

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CardComment)
        private readonly commentRepo: Repository<CardComment>,
    ) {}

    async findByCard(cardId: string): Promise<CommentDto[]> {
        const comments = await this.commentRepo.find({
            where: { card: { id: cardId } },
            relations: ['author'],
            order: { createdAt: 'ASC' },
        })
        return comments.map(this.toDto)
    }

    async create(cardId: string, text: string, authorId: string): Promise<CommentDto> {
        const comment = this.commentRepo.create({
            text,
            card: { id: cardId } as any,
            author: { id: authorId } as any,
        })
        const saved = await this.commentRepo.save(comment)
        // reload with author relation
        const full = await this.commentRepo.findOne({
            where: { id: saved.id },
            relations: ['author'],
        })
        return this.toDto(full!)
    }

    async update(commentId: string, text: string, requesterId: string): Promise<CommentDto> {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
            relations: ['author'],
        })
        if (!comment) throw new NotFoundException('Comment not found')
        if (comment.author?.id !== requesterId) {
            throw new ForbiddenException('Only the author can edit this comment')
        }
        comment.text = text
        await this.commentRepo.save(comment)
        return this.toDto(comment)
    }

    async remove(commentId: string, requesterId: string, requesterRole: string): Promise<void> {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
            relations: ['author'],
        })
        if (!comment) throw new NotFoundException('Comment not found')
        // author or manager can delete
        if (comment.author?.id !== requesterId && requesterRole !== 'manager') {
            throw new ForbiddenException('Not allowed to delete this comment')
        }
        await this.commentRepo.remove(comment)
    }

    private toDto(c: CardComment): CommentDto {
        return {
            id: c.id,
            text: c.text,
            authorId: c.author?.id ?? null,
            authorEmail: c.author?.email ?? null,
            createdAt: c.createdAt.toISOString(),
        }
    }
}