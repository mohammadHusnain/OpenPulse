import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { Message } from "@/models/User.model";


export async function POST(request : Request) {

    dbConnect()

   const {username , content} = await request.json()

   try {
    
    const user = await userModel.findOne({username})

    if(!user){
        return Response.json({
            success: false,
            message: "User Not Found",
            status: 404
          });
    } 

    //is user accepting messages

    if(!user.isAcceptingMessage){
        return Response.json({
            success: false,
            message: "User is not accepting messages",
            status: 403
          });
    }

    const newMessage = {
        content,
        createdAt: new Date()
    };
    user.messages.push(newMessage as Message);
    await user.save()

    return Response.json({
       success: true,
       message: "Message Sent Successfully",
       status: 200
    });

   } 

   catch (error) {
       console.error("Error adding message:", error);
       return Response.json({
           success: false,
           message: "Error Sending Message due to Internal Server Error",
           status: 500
       });
   }

}
