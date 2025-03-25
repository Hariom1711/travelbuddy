import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const profileSchema = z.object({
  username: z.string().min(3).max(20),
  name: z.string().min(2),
  bio: z.string().max(300).optional(),
  location: z.string().optional(),
  travelStyles: z.array(z.string()).min(1),
  budget: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const { username, name, bio, location, travelStyles, budget } = profileSchema.parse(body);

    // Check if username is already taken
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { message: 'Username is already taken' },
          { status: 409 }
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        name,
        bio,
        location,
        preferences: {
          upsert: {
            create: {
              travelStyle: travelStyles,
              budget,
            },
            update: {
              travelStyle: travelStyles,
              budget,
            },
          },
        },
      },
      include: {
        preferences: true,
      },
    });

    // Return the user without sensitive information
    const { password, ...userWithoutPassword } = updatedUser;
    
    return NextResponse.json(
      { 
        message: 'Profile updated successfully', 
        user: userWithoutPassword 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}