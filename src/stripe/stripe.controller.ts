import { Body, Controller, Post } from "@nestjs/common";

import { StripeService } from "./stripe.service";

@Controller("stripe")
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post()
  checkout(@Body() body) {
    try {
      return this.stripeService.checkout(body);
    } catch (error) {
      return error;
    }
  }
}
