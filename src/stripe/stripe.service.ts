import { Injectable, UnauthorizedException } from "@nestjs/common";
import { GetCurrentUser, GetCurrentUserId } from "src/common/decorators";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      typescript: true,
    });
  }

  async checkout(userId : number, user: any){
    if(!userId || !user){
      throw new UnauthorizedException();
    }
    
    const userSubscription = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
  }

  async createCheckoutSession(
    productIds: number[],
    userId: number,
  ): Promise<{ url: string }> {
    productIds = [5];
    userId = 1;
    const bookings = await this.prisma.booking.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    bookings.forEach((booking) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: "aoo",
          },
          unit_amount: 10 * 100,
        },
      });
    });

    const session = await this.stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "auto",
      phone_number_collection: {
        enabled: false,
      },
      success_url: `${process.env.YOUR_DOMAIN}/cart?success=1`,
      cancel_url: `${process.env.YOUR_DOMAIN}/cart?cancelled=1`,
      metadata: {
        productIds: JSON.stringify(productIds),
        userId,
      },
    });

    return { url: session.url };
  }
}
