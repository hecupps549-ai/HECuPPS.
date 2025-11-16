import { NextResponse } from 'next/server';

type RateLimitStore = {
  [key: string]: {
    count: number;
    expiry: number;
  };
};

const rateLimitStore: RateLimitStore = {};

export const rateLimiter = (
  requests: number = 10,
  timeWindow: number = 60 * 1000 // 1 minute
) => {
  return (req: Request) => {
    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    const now = Date.now();
    const entry = rateLimitStore[ip];

    if (entry && now < entry.expiry) {
      entry.count++;
      if (entry.count > requests) {
        return new NextResponse(JSON.stringify({ message: 'Too many requests' }), { status: 429 });
      }
    } else {
      rateLimitStore[ip] = {
        count: 1,
        expiry: now + timeWindow,
      };
    }
    return null;
  };
};
