import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, // recommended for BullMQ with Upstash
});

export type AdsJobData = {
  description: string;        // e.g. 10
  imageUrl?: string;         // Cloudinary input url
  folderName: string;          // Cloudinary output folder name
  userId: string;            // User who created the job
};

export type AdsJobResult = { urls: string[] };

export const adsQueue = new Queue<AdsJobData, AdsJobResult>("meme-worker", {
  connection,
  defaultJobOptions: {
    removeOnComplete: { age: 3600 * 24, count: 1000 },
    removeOnFail: { age: 3600 * 24, count: 1000 },
    attempts: 2,
  },
});