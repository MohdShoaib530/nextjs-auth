import connectToDb from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';

connectToDb();

export async function POST(request: NextRequest){
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true
    });

    response.cookies.set('token','',{
      httpOnly: true
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500  });
  }
}