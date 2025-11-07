import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { Category } from '../models/category.model.js';
import { SubCategory } from '../models/subcategory.model.js';
import { Item } from '../models/item.model.js';
import { errorResponse, successResponse } from '../utils/response.js';

const { ObjectId } = mongoose.Types;

export const createSubCategory = async (req, res, next) => {
  try {
    const { categoryId, name } = req.body;

    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse('Category not found.'));
    }

    const existing = await SubCategory.findOne({
      category: categoryId,
      name: { $regex: `^${name}$`, $options: 'i' }
    }).lean();

    if (existing) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(errorResponse('Sub-category with the same name already exists in this category.'));
    }

    const taxApplicability =
      req.body.taxApplicability !== undefined
        ? req.body.taxApplicability
        : category.taxApplicability;

    const taxValue =
      taxApplicability === true
        ? req.body.tax ?? category.tax
        : 0;

    const payload = {
      category: categoryId,
      name,
      image: req.body.image,
      description: req.body.description,
      taxApplicability,
      tax: taxValue
    };

    const subCategory = await SubCategory.create(payload);
    const subCategoryData = await SubCategory.findById(subCategory._id)
      .populate('category', 'name')
      .lean();

    return res
      .status(StatusCodes.CREATED)
      .json(successResponse('Sub-category created successfully.', subCategoryData));
  } catch (error) {
    return next(error);
  }
};

export const getAllSubCategories = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find()
      .sort({ name: 1 })
      .populate('category', 'name')
      .lean();

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Sub-categories fetched successfully.', subCategories));
  } catch (error) {
    return next(error);
  }
};

export const getSubCategoriesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse('Category not found.'));
    }

    const subCategories = await SubCategory.find({ category: categoryId })
      .sort({ name: 1 })
      .lean();

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Sub-categories fetched successfully.', subCategories));
  } catch (error) {
    return next(error);
  }
};

export const getSubCategoryDetails = async (req, res, next) => {
  try {
    const { id, name, categoryId } = req.query;

    const filter = id
      ? { _id: new ObjectId(id) }
      : {
          name: { $regex: `^${name}$`, $options: 'i' },
          ...(categoryId ? { category: categoryId } : {})
        };

    const subCategory = await SubCategory.findOne(filter)
      .populate('category', 'name')
      .lean();

    if (!subCategory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse('Sub-category not found.'));
    }

    const items = await Item.find({ subCategory: subCategory._id })
      .sort({ name: 1 })
      .lean();

    return res.status(StatusCodes.OK).json(
      successResponse('Sub-category fetched successfully.', {
        ...subCategory,
        items
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const updateSubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    const subCategory = await SubCategory.findById(subCategoryId).lean();

    if (!subCategory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse('Sub-category not found.'));
    }

    const updates = { ...req.body };

    if (updates.name) {
      const duplicate = await SubCategory.findOne({
        category: subCategory.category,
        name: { $regex: `^${updates.name}$`, $options: 'i' },
        _id: { $ne: subCategoryId }
      }).lean();

      if (duplicate) {
        return res
          .status(StatusCodes.CONFLICT)
          .json(errorResponse('Another sub-category with the same name exists in this category.'));
      }
    }

    if (updates.taxApplicability !== undefined) {
      if (updates.taxApplicability === false) {
        updates.tax = 0;
      } else if (updates.taxApplicability === true && typeof updates.tax !== 'number') {
        updates.tax = subCategory.tax ?? 0;
      }
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      subCategoryId,
      updates,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('category', 'name')
      .lean();

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Sub-category updated successfully.', updatedSubCategory));
  } catch (error) {
    return next(error);
  }
};
