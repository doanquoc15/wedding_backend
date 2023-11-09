import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';

//import { Cart } from './Cart.model';

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
  }

  async checkout(cart: any) {
    console.log(cart?.products);
     const lineItems = cart?.products.map((item)=>({
        price_data:{
            currency:"usd",
            product_data:{
                name:item.name,
            },
            unit_amount:item.price * 100,
        },
        quantity : 1
    }));

    const session = await this.stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/sucess",
        cancel_url:"http://localhost:3000/cancel",
    });

    return session;
  }
}