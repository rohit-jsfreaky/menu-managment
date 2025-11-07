import mongoose from 'mongoose';

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
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
      type: Boolean,
      default: false
    },
    tax: {
      type: Number,
      min: 0,
      default: 0
    },
    baseAmount: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

ItemSchema.index({ name: 1, category: 1 }, { unique: true });

ItemSchema.pre('save', function computeTotal(next) {
  if (typeof this.baseAmount === 'number' && typeof this.discount === 'number') {
    this.totalAmount = this.baseAmount - this.discount;
  }

  if (this.totalAmount < 0) {
    this.totalAmount = 0;
  }

  next();
});

export const Item = mongoose.model('Item', ItemSchema);
