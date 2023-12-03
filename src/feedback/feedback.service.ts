import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    const createRating = await this.prisma.feedback.create({
      data: {
        ...createFeedbackDto,
        userId: createFeedbackDto.userId,
        comboMenuId: createFeedbackDto.comboMenuId,
        rating: createFeedbackDto.rating,
        comment: createFeedbackDto.comment,
      },
    });

    return createRating;
  }

  async findAll() {
    return await this.prisma.feedback.findMany();
  }

  async findOne(id: number) {
    const feedback = await this.prisma.feedback.findMany({
      where: {
        comboMenuId: +id,
      },
    });

    if (!feedback) {
      throw new NotFoundException("Không tìm tấy đánh gi nào cho dịch vụ này");
    }

    return feedback;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
