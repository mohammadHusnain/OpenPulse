import dbConnect from '../../../lib/dbConnect'
import userModel from '@/models/User.model'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
import { request } from 'https'
import UserModel from '@/models/User.model'

 export async function POST(request : Request)
 await dbConnect()

 try {
    const { username, email, password } = await request.json()
    const existingUserVerifiedByUsername = await userModel.findOne({
        username,
        isVerified: true
    })
    if (existingUserVerifiedByUsername) {
        return Response.json(
            {
                success: false,
                message: "User with this email or username already exists"
            },
            { 
                status: 400
             })
    
        }

      const existingUserByEmail = await   UserModel.findOne({email})

      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

if(existingUserByEmail){
      
    }

else{
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 60 minutes from now
    const hashedPassword = await bcrypt.hash(password, 10)

    new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: []
    })

}

  catch (error) {
    console.error("Error Registering User:", error);
    return Response.json(
        {
            success: false,
            message: "Error Registering User"
        },
        { status: 500 }
    )
 }