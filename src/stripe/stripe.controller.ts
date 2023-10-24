import { Controller, Post, Body } from "@nestjs/common";
import { StripeService } from "./stripe.service";

@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post("checkout")
  async createCheckoutSession(@Body() data: { productIds; userId }) {
    const session = await this.stripeService.createCheckoutSession(
      data.productIds,
      data.userId,
    );

    return session.url;
  }
}
