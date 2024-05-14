import { Injectable } from "@nestjs/common";
@Injectable()
export class AppService {
  async payment() {
    return "Hello World!";
  }
}
