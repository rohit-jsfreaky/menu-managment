import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { Category } from '../models/category.model.js';
import { SubCategory } from '../models/subcategory.model.js';
import { Item } from '../models/item.model.js';
import { errorResponse, successResponse } from '../utils/response.js';

const { ObjectId } = mongoose.Types;

export const createCategory = async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      taxApplicability: req.body.taxApplicability ?? false,
      tax: req.body.taxApplicability ? req.body.tax ?? 0 : 0,
      taxType: req.body.taxType
    };

    const existingCategory = await Category.findOne({
      name: { $regex: `^${payload.name}$`, $options: 'i' }
    }).lean();

    if (existingCategory) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(errorResponse('Category with the same name already exists.'));
    }

    const category = await Category.create(payload);
    const categoryData = await Category.findById(category._id).lean();

    return res
      .status(StatusCodes.CREATED)
      .json(successResponse('Category created successfully.', categoryData));
  } catch (error) {
    return next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Categories fetched successfully.', categories));
  } catch (error) {
    return next(error);
  }
};

export const getCategoryDetails = async (req, res, next) => {
  try {
    const { id, name } = req.query;

    const filter = id
      ? { _id: new ObjectId(id) }
      : { name: { $regex: `^${name}$`, $options: 'i' } };

    const category = await Category.findOne(filter).lean();

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse('Category not found.'));
    }

    const subCategories = await SubCategory.find({ category: category._id })
      .sort({ name: 1 })
      .lean();

    const items = await Item.find({ category: category._id })
      .sort({ name: 1 })
      .lean();

    return res.status(StatusCodes.OK).json(
      successResponse('Category fetched successfully.', {
        ...category,
        subCategories,
        items
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const updates = { ...req.body };

    if (updates.name) {
      const nameExists = await Category.findOne({
        _id: { $ne: categoryId },
        name: { $regex: `^${updates.name}$`, $options: 'i' }
      }).lean();

      if (nameExists) {
        return res
          .status(StatusCodes.CONFLICT)
          .json(errorResponse('Another category with the same name already exists.'));
      }
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'taxApplicability')) {
      if (updates.taxApplicability === false) {
        updates.tax = 0;
      }

      if (updates.taxApplicability === true && typeof updates.tax !== 'number') {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(errorResponse('Tax is required when tax applicability is true.'));
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updates, {
      new: true,
      runValidators: true
    }).lean();

    if (!updatedCategory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse('Category not found.'));
    }

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Category updated successfully.', updatedCategory));
  } catch (error) {
    return next(error);
  }
};
