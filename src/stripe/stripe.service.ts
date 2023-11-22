import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
  }

  async checkout(cart: any) {
     const lineItems = cart?.map((item)=>({
        price_data:{
            currency:"usd",
            product_data:{
                name:item.name,
            },
            unit_amount:item.price * 100,
        },
        quantity : cart.quantity || 1,
    }));

    const session = await this.stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:`${process.env.YOUR_DOMAIN}/success`,
        cancel_url:`${process.env.YOUR_DOMAIN}/cancel`,
    });

    return session;
  }
}