import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    taxApplicability: {
      type: Boolean,
      default: false
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    taxType: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Category = mongoose.model('Category', CategorySchema);
