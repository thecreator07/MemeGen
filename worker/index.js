import { configDotenv } from "dotenv";
import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import { GoogleGenAI } from "@google/genai";
import { uploadBufferToCloudinary } from "./utils/cloudinary.js";
import { buildAdPrompt } from "./lib/promtBuilder.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";


configDotenv()

const BASE_API_URL = process.env.API_URL || "http://localhost:3000";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


console.log(process.env.GEMINI_API_KEY)
const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

async function urlToBase64(url) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log("buf", buf)
  return { base64: buf.toString("base64"), mime: res.headers.get("content-type") || "image/png" };
}

async function processJob(job) {
  try {
    const {  description, folderName, userId,imageUrl } = job.data;
    console.log(description, imageUrl);

    const urls = [];
    if(!userId) {
      job.log("Missing userId");
      return { urls };
    }
    const prompts=[]
    if(!description) {
      job.log("Missing description");
      return "Provide description"
    }
    prompts.push({ text: buildAdPrompt(description) });

    if (imageUrl) {
      const [image] = await Promise.all([urlToBase64(imageUrl)]);
      console.log("mime", image.mime);
      prompts.push({ inlineData: { mimeType: image.mime, data: image.base64 } });
    }



    // const productbase64 = await urlToBase64(productUrl)
    // console.log("productbase64", productbase64)
    // prepare inputs once

    // const prompt = buildAdPrompt(description);
    // console.log("base64", product.base64, template.base64);
    // const prompts = [
    //   { text: prompt },
    //   { inlineData: { mimeType: image.mime, data: image.base64 } },
    //   // { inlineData: { mimeType: template.mime, data: template.base64 } },
    // ];

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompts,
    });
    const parts = res.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        const data = part.inlineData.data || "";
        const buffer = Buffer.from(data, "base64");
        // console.log(buffer)
        // const filePath = path.join(process.cwd(), "public", `gemini-test-${iteration}.png`);
        // fs.writeFileSync(filePath, buffer);

        const result = await uploadBufferToCloudinary(buffer, job, folderName);
        await axios.post(`${BASE_API_URL}/api/images`, {
          publicId: result.public_id,
          url: result.url,
          folder: folderName,
          userId: userId,
        });
        console.log("result", result.url);
        urls.push(result.url);
      }
    }

    return { urls };
  } catch (err) {
    job.log(`Error in job ${job.id}: ${err.message}`);
    throw err; // ensures job is marked as failed
  }
}

// Start worker
new Worker(
  "meme-worker",
  async (job) => {
    const result = await processJob(job);

    console.log(result.urls)
    return result;
  },
  { connection, concurrency: 3 }
).on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
  // Handle successful job completion
  console.log("Result:", job.returnvalue);
})
  .on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });
