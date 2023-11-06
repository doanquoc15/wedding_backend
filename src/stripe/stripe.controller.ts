import { Controller, Post, Body, Get } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { GetCurrentUser, GetCurrentUserId } from "src/common/decorators";

@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get("checkout")
  async checkoutStripe (@GetCurrentUserId() userId: number,@GetCurrentUser() user : any ) {
    return this.stripeService.checkout(userId, user);
  }


  @Post("webhook")
  async createCheckoutSession(@Body() data: { productIds; userId }) {
    const session = await this.stripeService.createCheckoutSession(
      data.productIds,
      data.userId,
    );

    return session.url;
  }
}
