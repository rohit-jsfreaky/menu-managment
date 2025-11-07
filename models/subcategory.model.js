import mongoose from 'mongoose';

const { Schema } = mongoose;

const SubCategorySchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
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
      type: Boolean
    },
    tax: {
      type: Number,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

SubCategorySchema.index({ category: 1, name: 1 }, { unique: true });

export const SubCategory = mongoose.model('SubCategory', SubCategorySchema);
