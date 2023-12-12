import { PrismaService } from "../prisma/prisma.service";

export const NotificationProviders = [
  {
    provide: "NOTIFICATION_MODEL",
    useFactory: (prismaService: PrismaService) => {
      return prismaService.notification;
    },
    inject: [PrismaService],
  },
];
