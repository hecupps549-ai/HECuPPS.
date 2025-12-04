
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getUserIdFromRequest } from '@/lib/auth';
import eventEmitter from '@/lib/events';
import { generateOrderId } from '@/lib/utils';
import { z } from 'zod';

const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  // Add other fields from CartItem that you need to store
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema),
  totalAmount: z.number().positive(),
  shippingDetails: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
  }),
});

// Create a new order
export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, totalAmount, shippingDetails } = createOrderSchema.parse(body);


    // Use a transaction to ensure atomicity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newOrder = await prisma.$transaction(async (tx: any) => {
      for (const item of items) {
        const inventory = await tx.inventory.findUnique({
          where: { productId: item.id },
        });
        if (!inventory || inventory.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.id}`);
        }
        await tx.inventory.update({
          where: { productId: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const order = await tx.order.create({
        data: {
          id: generateOrderId(),
          userId,
          totalAmount,
          status: 'PENDING',
          shippingAddress: shippingDetails,
          customerName: shippingDetails.name,
          currency: 'INR', // Default, should be dynamic
          orderType: 'ONLINE',
          items: {
            create: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          payment: {
            create: {
              amount: totalAmount,
              status: 'PAID', // Assume payment is successful
              paymentMethod: 'RAZORPAY', // Placeholder
              transactionId: `txn_${Date.now()}` // Placeholder
            }
          }
        },
        include: { items: true, payment: true },
      });
      return order;
    });

    eventEmitter.emit('OrderCreated', newOrder);

    return NextResponse.json({ message: 'Order created successfully', order: newOrder }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      // FIX: Changed error.errors to error.issues to match Zod v3+ API.
      return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
    }
    console.error('Order creation failed:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
