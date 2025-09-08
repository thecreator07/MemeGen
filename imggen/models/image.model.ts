import mongoose, { Schema, Document, Types } from "mongoose";

export interface Image extends Document {
  _id: string;
  publicId: string;
  url: string;
//   format: string;
  folder?: string;
  user: Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema: Schema<Image> = new Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    // format: { type: String, required: true },
    folder: { type: String },

    // Relation: reference to User
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const ImageModel =
  (mongoose.models.Image as mongoose.Model<Image>) ||
  mongoose.model<Image>("Image", ImageSchema);

export default ImageModel;