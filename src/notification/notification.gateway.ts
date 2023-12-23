import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { OnModuleInit } from "@nestjs/common";

import { NotificationService } from "./notification.service";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { CreateNotificationDto } from "./dto/create-notification.dto";

interface JwtPayload {
  _id: string;
  email?: string;
  username?: string;
  iat?: number;
  exp?: number;
}

interface SocketMetaPayload {
  socketId: string;
  userId: number;
}

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  socketMap = new Map<string, SocketMetaPayload>();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.server.on("connection", async (socket: Socket) => {
      socket.on("join", (userId: number) => {
        if (!userId) {
          socket.disconnect(true);
          return;
        }
        this.socketMap.set(socket.id, {
          socketId: socket.id,
          userId: userId,
        });
      });

      socket.on("disconnect", () => {
        this.socketMap.delete(socket.id);
      });
    });
  }

  async emitNotification(userId: number, notification: CreateNotificationDto) {
    const socketId = this.getUserSocketId(userId);
    if (socketId) {
      const notif = await this.notificationService.create(notification);
      this.server.to(socketId).emit("notification", notif);
    } else {
      throw new Error("User is not online at the moment!");
    }
  }

  async increaseBadge(value = 1) {
    this.server.emit("increaseBadges", value);
  }

  async updateBadges(authorId) {
    this.server.emit("updateBadge", authorId);
  }

  @SubscribeMessage("currentUsers")
  currentUsers(client: Socket) {
    client.emit("currentUsers", Array.from(this.socketMap.values()));
  }

  @SubscribeMessage("getNotificationsById")
  async getNotificationsById(client: Socket, userId: number) {
    const notifications = await this.notificationService.findAllByUser(userId);
    client.emit("getNotificationsById", notifications);
  }

  @SubscribeMessage("updatedRead")
  async updatedRead(client: Socket, notificationId: number) {
    const notification = await this.notificationService.updated(
      +notificationId,
      { isRead: true },
    );
    client.emit("updatedRead", notification);
  }

  @SubscribeMessage("createNotification")
  async createNotification(client: Socket, notificationData: any) {
    const notification = await this.notificationService.create({
      ...notificationData,
    });
    client.emit("createNotification", notification);
  }

  @SubscribeMessage("updateBadge")
  async updateBadge(client: Socket, authorId: number) {
    client.emit("updateBadge", authorId);
  }

  @SubscribeMessage("increaseBadges")
  async onIncreaseBadges(client: Socket, value = 1) {
    client.emit("increaseBadges", value);
  }

  @SubscribeMessage("orderStatusUpdated")
  async orderStatusUpdated(client: Socket, data: any) {
    const { userId, orderId, status } = data;

    const socketId = this.getUserSocketId(userId);
    if (socketId) {
      this.server.to(socketId).emit("orderStatusUpdated", { orderId, status });
    } else {
      throw new Error("User is not online at the moment!");
    }
  }

  private getUserSocketId(userId: number): string | undefined {
    const userSocket = Array.from(this.socketMap.values()).find(
      (socketMeta) => socketMeta.userId === userId,
    );
    return userSocket?.socketId;
  }
}
