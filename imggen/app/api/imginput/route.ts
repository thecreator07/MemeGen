import { adsQueue } from "@/lib/queque";
import { uploadFileToCloudinary } from "@/utils/cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import ImageModel from "@/models/image.model";

export const runtime = "nodejs"; // Ensure Node.js runtime (not edge)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("session user:", session.user._id);
  const { _id } = session.user;
  try {
    const form = await req.formData();

    const image = form.get("image") as File | null;
    const folderName = (form.get("folderName") as string) || "ads/inputs";
    const description = (form.get("description") as string) ?? "Default meme description";

    let imageUrl: string | undefined = undefined;

    //i have to check if images are greater than 5 then do not process
    const imageCount = (await ImageModel.find({ user: _id })).length
    if (imageCount > 5) {
      return NextResponse.json({ message: "image count greater than 5" })
    }
    // Upload image only if provided and valid
    if (image && image.size > 0) {
      try {
        const imgRes = await uploadFileToCloudinary(image, `${folderName}/inputs`);
        imageUrl = imgRes.secure_url;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }
    }

    // Enqueue job to BullMQ
    const job = await adsQueue.add(
      "generate-meme", // job name inside the queue
      {
        description,
        folderName,
        imageUrl, // optional
        userId: session.user._id,
      },
      {
        removeOnComplete: { age: 24 * 3600, count: 1000 },
        removeOnFail: { age: 24 * 3600, count: 1000 },
        attempts: 2, // retry once
      }
    );

    const jobIds = job.id ? [job.id] : [];

    console.log("Enqueued job ID:", jobIds);

    return NextResponse.json({ jobIds });
  } catch (err) {
    console.error("Job enqueue failed:", err);
    return NextResponse.json({ error: "Job enqueue failed" }, { status: 500 });
  }
}
