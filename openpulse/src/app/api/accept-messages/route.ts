import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import {User} from 'next-auth'

 export async function POST(request : Request) {

    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized , Not Authenticated",
            status: 401
          });
    } 

const userId = user._id
const {acceptMessage} = await request.json()

try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessage }, { new: true })

    if(!updatedUser){
        return Response.json({
            success: false,
            message: "failed to update user preference to accept messages",
            status: 401
          });
    }

    return Response.json({
        success: true,
        message: "User preference to accept messages updated successfully",
        data: updatedUser,
        status: 200
    });



} catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({
        success: false,
        message: "Error Fetching User",
        status: 500
    });
}

}

export async function GET(request : Request) {

    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized , Not Authenticated",
            status: 401
          });
    } 

    const userId = user._id

    try {
        const foundUser = await userModel.findById(userId)

        if(!foundUser){
            return Response.json({
                success: false,
                message: "User Not Found",
                status: 404
            });
        }

        return Response.json({
            success: true,
            message: "User Found",
            data: foundUser.isAcceptingMessage,
            status: 200
        });


    } catch (error) {
        console.error("Error fetching user:", error);
        return Response.json({
            success: false,
            message: "Error in getting user preference to accept messages",
            status: 500
        });
    }
}
