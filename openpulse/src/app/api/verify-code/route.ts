import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";

export async function POST(request: Request) {
    await dbConnect();

try {
    
const {username , code} = await request.json()

const decodedUsername =  decodeURIComponent(username)
const user = await userModel.findOne({username: decodedUsername})

if(!user){
    return Response.json({
      success: false,
      message: "User Not Found",
      status: 404
    });
  }

  const isCodeValid = user.verifyCode === code
  const isCodeNotExpired = new Date(user.verifyCode) > new Date()

if(isCodeValid && isCodeNotExpired){
    user.isVerified = true
    await user.save()
    return Response.json({
      success: true,
      message: "User Verified Successfully",
      status: 200
    });
  }

  else if(!isCodeNotExpired){
    return Response.json({
      success: false,
      message: "Verification Code Expired ! Please SignUp Again",
      status: 400
    });
  }

else{
    return Response.json({
      success: false,
      message: "Invalid Verification Code",
      status: 400
    });
  }

} catch (error) {
 
     console.error("Error verifying user:", error);
    return Response.json({
      success: false,
      message: "Error Verifying User",
      status: 500
    });

}

}