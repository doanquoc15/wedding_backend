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
        bookingId: createFeedbackDto.bookingId,
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
        id: +id,
      },
    });

    if (!feedback) {
      throw new NotFoundException("Không tìm tấy đánh gi nào cho dịch vụ này");
    }

    return feedback;
  }

  async findBookingId(id: number) {
    const feedback = await this.prisma.feedback.findMany({
      where: {
        bookingId: +id,
      },
    });

    if (!feedback) {
      throw new NotFoundException("Không tìm tấy đánh gi nào cho dịch vụ này");
    }

    return feedback;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    const updatedFeedback = this.prisma.feedback.update({
      where: {
        id: +id,
      },
      data: {
        ...updateFeedbackDto,
      },
    });

    return updatedFeedback;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
