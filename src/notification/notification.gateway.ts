import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { NotificationService } from "./notification.service";
import { Server, Socket } from "socket.io";
import { OnModuleInit } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateNotificationDto } from "./dto/create-notification.dto";

interface JwtPayload {
  _id: string;
  email?: string;
  username?: string;
  iat?: number;
  exp?: number;
}

export interface socketMetaPayload {
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
  socketMap = new Map<string, socketMetaPayload>();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.server.on("connection", async (socket) => {
      socket.on("join", (userId) => {
        this.socketMap.set(userId, {
          socketId: socket.id.toString(),
          userId: +userId,
        });

        if (!userId) {
          socket.disconnect(true);
          return true;
        }
      });
      socket.on("disconnect", () => {
        this.socketMap.delete(socket.id);
      });
    });
  }

  async emitNotification(userId: string, notification: CreateNotificationDto) {
    console.log({ userId }, { notification });
    const socketMeta = this.socketMap.get(userId.toString());
    const notif = await this.notificationService.create(notification);
    if (socketMeta) {
      this.server.to(socketMeta?.socketId).emit("notification", notif);
    } else {
      throw new Error("user is not online at the moment!");
    }
  }

  @SubscribeMessage("currentUsers")
  currentUsers(client: Socket) {
    client.emit("currentUsers", Array.from(this.socketMap.values()));
  }

  //event name: "getNotificationsById"
  @SubscribeMessage("getNotificationsById")
  async getNotificationsById(client: Socket, userId: number) {
    const notifications = await this.notificationService.findAllByUser(+userId);
    client.emit("getNotificationsById", notifications);
  }

  //event name: "updatedRead"
  @SubscribeMessage("updatedRead")
  async updatedRead(client: Socket, notificationId: number) {
    const notification = await this.notificationService.updatedRead(
      notificationId,
    );
    client.emit("updatedRead", notification);
  }
}
