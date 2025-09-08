// models/User.ts
import mongoose, { Schema, Types } from 'mongoose';

export interface User extends Document {
    _id: string;
    email: string;
    password: string;

}

const UserSchema: Schema<User> = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

}, { timestamps: true });

const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>('User', UserSchema);


export default UserModel
