import connectToDb from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import sendEmail from '@/helpers/mailer';

connectToDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log('reqbody', reqBody);

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: 'user already exists' },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // send email verification

    const eamilsent = await sendEmail({
      email,
      emailType: 'VERIFY',
      userId: savedUser._id
    });

    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      data: savedUser
    });
  } catch (error: any) {
    console.log('error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
