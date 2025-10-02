import dbConnect from "@/lib/dbConnect";
import {success, z} from "zod";
import userModel from "@/models/User.model";

import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {

    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username") || "",
    }

    // Validate query parameters with zod
    const result  = UsernameQuerySchema.safeParse(queryParams);
    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message: "Invalid query parameters",
        errors: usernameErrors,
        status: 400
      });
    }

    const {username} = result.data;

    const existingVerifiedUser = await userModel.findOne({ username, isVerified: true });
    if (existingVerifiedUser) {
      return Response.json({
        success: true,
        isUnique: false,
        message: "Username is already taken by a verified user",
        status: 200
      });
    }

    return Response.json({
      success: true,
      isUnique: true,
      message: "Username is available",
      status: 200
    });

    
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return Response.json({
      success: false,
      message: "Internal Server Error",
      status: 500
    });
  }

}
