import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export default function getDataFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No token found' }, { status: 401 });
  }
  try {
    const data: any = jwt.verify(token, process.env.MONGO_URI!);
    return data.id;
  } catch (error: any) {
    console.log('error', error.message);
    return null;
  }
}
