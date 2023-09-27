import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Nếu không có quyền được đánh dấu, cho phép truy cập.
    }

    const { user } = context.switchToHttp().getRequest();
    return this.matchRoles(requiredRoles, user.role);
  }

  private matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
    return requiredRoles.every((role) => userRoles.includes(role));
  }
}
