import connectToDb from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataFromToken from '@/helpers/getDataFromToken';

connectToDb();

export async function GET(request: NextRequest) {
  const userId = await getDataFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({
    user:"user found",
    data: user,
  });
}
