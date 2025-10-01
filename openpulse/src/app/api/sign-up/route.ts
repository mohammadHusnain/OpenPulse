import dbConnect from '../../../lib/dbConnect'
import userModel from '@/models/User.model'
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
import { request } from 'https'
import bcrypt from 'bcryptjs'
import UserModel from '@/models/User.model'

 export async function POST(request : Request) {
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
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User with this email or username already exists"
                    },
                    { 
                        status: 400
                    })

            }
            else{
                // user is existed with email but not verified
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000) // 60 minutes from now
                await existingUserByEmail.save()
            }
        }

        // user is existed with email but not verified
        

        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 60 minutes from now

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()

        }

        // send verification email
        const emailResponse = await sendVerificationEmail(username, email, verifyCode)
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                { status: 500 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please check your email for verification instructions."
            },
            { status: 201 }

        )

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
}