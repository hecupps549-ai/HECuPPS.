import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      totalAmount,
      currency,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      paymentGateway, // 'razorpay', 'stripe', 'interac'
    } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingName || !shippingEmail || !shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping details are required' },
        { status: 400 }
      );
    }

    // Create order with transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // Check stock availability and calculate total
      let calculatedTotal = 0;
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          throw new Error(`Product ${item.id} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        calculatedTotal += item.quantity * (currency === 'CAD' ? (product.priceCAD || product.price) : (product.priceINR || product.price));
      }

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: userId || 0, // Guest user if not logged in
          totalAmount,
          currency: currency || 'INR',
          status: 'PENDING',
          paymentStatus: paymentGateway === 'interac' ? 'PENDING' : 'PENDING', // Will be updated after payment
          paymentGateway,
          shippingName,
          shippingEmail,
          shippingPhone,
          shippingAddress,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              priceAtPurchase: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Deduct stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
