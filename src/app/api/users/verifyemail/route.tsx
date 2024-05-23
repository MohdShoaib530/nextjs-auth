import connectToDb from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connectToDb();

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await  request.json();
    const {token} =reqBody;
    console.log('reqbody',reqBody);

    const user = await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt: Date.now()}});

    if(!user){
      return NextResponse.json({error:'Invalid or expired token'},{status:400
      });
    }
    console.log('user',user);
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message:"email verified",
      success:true
    },{status:500});
    
  } catch (error:any){
    return NextResponse.json({error:error.message},{status:500});
  }
}
