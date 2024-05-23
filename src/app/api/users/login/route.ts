import connectToDb from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectToDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, pasword } = reqBody;
    console.log('reqbody', reqBody);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password and user not found' },
        { status: 400 }
      );
    }
    console.log('user exists', user);
    const validPassword = await bcryptjs.compare(pasword, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }
    const tokenData = {
      id: user._id,
      email: user.email
    };
    const token = await jwt.sign(tokenData, process.env.MONGO_URI!, {
      expiresIn: '1h'
    });

    const response = NextResponse.json({
      message: 'Login successful',
      success: true
    });

    response.cookies.set('token', token, {
      httpOnly: true
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
