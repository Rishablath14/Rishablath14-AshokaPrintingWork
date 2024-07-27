
import { connect } from '@/app/actions/dbconnect.action';
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Admin from '@/app/utils/adminSchema';

export async function GET() {
    try {
        const response = NextResponse.json(
            {
                message: "Logout successful",
                success: true,
            }
        )
        response.cookies.set("token", "", 
        { httpOnly: true, expires: new Date(0) });
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
        
    }

export async function POST(request){
    try {
        await connect();
        const reqBody = await request.json()
        const {username, password} = reqBody;
        const admin = await Admin.findOne({username})
        if(!admin){
            return NextResponse.json({message: "Invalid Admin Username"}, {status: 400})
        }
        const correct = password===admin.password;
        if(!correct){
            return NextResponse.json({message: "Invalid password"}, {status: 400})
        }
        const tokenData = {
            id: admin._id,
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"})

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
