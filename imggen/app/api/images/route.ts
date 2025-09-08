import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import ImageModel from "@/models/image.model";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "@/utils/cloudinary";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {

        const { publicId, url, folder, userId } = await req.json();
        console.log("Received data:", { publicId, url, folder, userId });
        function isValidObjectId(id: string): boolean {
            return mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id)).toString() === id;
        }

        console.log("userId:", userId);
        if (!isValidObjectId(userId)) {
            return NextResponse.json({ success: false, message: "Invalid userId" }, { status: 400 });
        }

        if (!publicId || !url || !userId) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create new Image document
        const newImage = await ImageModel.create({
            publicId,
            url,
            folder,
            user: new mongoose.Types.ObjectId(userId), // link image to logged-in user
        });

        return NextResponse.json(
            { success: true, image: newImage },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Error creating image:", error instanceof Error?error.message:"something went wrong");
        return NextResponse.json(
            { success: false, message:error instanceof Error ? error.message :"something went wrong"},
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { _id } = session.user;
    console.log("session user:", _id);

    try {

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return NextResponse.json({ success: false, message: "Invalid userId" }, { status: 400 });
        }

        // Get pagination info from the query parameters
        const page = new URL(request.url).searchParams.get('page') || '1';
        const limit = new URL(request.url).searchParams.get('limit') || '10';

        const images = await ImageModel.find({ user: _id })
            .skip((parseInt(page) - 1) * parseInt(limit)) // Skip the already fetched images
            .limit(parseInt(limit)) // Limit the number of images per request
            .sort({ createdAt: -1 });

        const totalImages = await ImageModel.countDocuments({ user: _id });

        return NextResponse.json({
            success: true,
            images,
            pagination: {
                total: totalImages,
                page: parseInt(page),
                pages: Math.ceil(totalImages / parseInt(limit)),
            },
        }, { status: 200 });

    } catch (error: unknown) {
        return NextResponse.json({ success: false, message:error instanceof Error? error.message:"Something went wrong" }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { _id } = session.user;
    const { public_id } = await request.json();
    try {

        const deletedImage = await ImageModel.findOneAndDelete({ publicId: public_id, user: _id });
        if (!deletedImage) {
            return NextResponse.json({ success: false, message: "Image not found or not authorized" }, { status: 404 });
        }
        const deletedimgcloudinary=await deleteFromCloudinary(public_id);
        console.log("Deleted from Cloudinary:", deletedimgcloudinary);
        return NextResponse.json({ success: true, message: "Image deleted" }, { status: 200 });
    } catch (error:unknown) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "error during deleting image" }, { status: 500 });
    }


}