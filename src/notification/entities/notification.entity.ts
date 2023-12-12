export enum NotificationType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export class Notification {
  readonly title: string;
  readonly description: string;
  readonly image?: string;
  readonly type: NotificationType;
  readonly read: boolean;
}
