import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust this import path as needed

export async function GET() {
  const churches = await prisma.church.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
    },
  });
  return NextResponse.json(churches);
}
