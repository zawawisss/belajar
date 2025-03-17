// src/models/Item.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IItem extends Document {
  title: string;
  description: string;
  price: number;
}

const ItemSchema: Schema<IItem> = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
}, { timestamps: true });

const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

export default Item;
