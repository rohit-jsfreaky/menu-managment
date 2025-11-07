import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { Category } from '../models/category.model.js';
import { SubCategory } from '../models/subcategory.model.js';
import { Item } from '../models/item.model.js';
import { errorResponse, successResponse } from '../utils/response.js';

const { ObjectId } = mongoose.Types;

const buildItemResponse = (itemId) =>
  Item.findById(itemId)
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .lean();

export const createItem = async (req, res, next) => {
  try {
    const { categoryId, subCategoryId } = req.body;

    const category = await Category.findById(categoryId).lean();
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse('Category not found.'));
    }

    let subCategory = null;
    if (subCategoryId) {
      subCategory = await SubCategory.findOne({
        _id: subCategoryId,
        category: categoryId
      }).lean();

      if (!subCategory) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(errorResponse('Sub-category does not belong to the specified category.'));
      }
    }

    const duplicateItem = await Item.findOne({
      category: categoryId,
      name: { $regex: `^${req.body.name}$`, $options: 'i' }
    }).lean();

    if (duplicateItem) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(errorResponse('Item with the same name already exists in this category.'));
    }

    const taxApplicability =
      req.body.taxApplicability !== undefined
        ? req.body.taxApplicability
        : subCategory?.taxApplicability ?? category.taxApplicability;

    const taxValue =
      taxApplicability === true
        ? req.body.tax ?? subCategory?.tax ?? category.tax
        : 0;

    const discount = req.body.discount ?? 0;

    if (discount > req.body.baseAmount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse('Discount cannot exceed the base amount.'));
    }

    const totalAmount = Math.max(0, req.body.baseAmount - discount);

    const payload = {
      category: categoryId,
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      taxApplicability,
      tax: taxValue,
      baseAmount: req.body.baseAmount,
      discount,
      totalAmount
    };

    if (subCategory) {
      payload.subCategory = subCategory._id;
    }

    const item = await Item.create(payload);
    const itemData = await buildItemResponse(item._id);

    return res
      .status(StatusCodes.CREATED)
  .json(successResponse('Item created successfully.', itemData));
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(errorResponse('Item with the same name already exists.'));
    }

    return next(error);
  }
};

export const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find()
      .sort({ name: 1 })
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .lean();

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Items fetched successfully.', items));
  } catch (error) {
    return next(error);
  }
};

export const getItemsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse('Category not found.'));
    }

    const items = await Item.find({ category: categoryId })
      .sort({ name: 1 })
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .lean();

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Items fetched successfully.', items));
  } catch (error) {
    return next(error);
  }
};

export const getItemsBySubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;

    const subCategoryExists = await SubCategory.exists({ _id: subCategoryId });
    if (!subCategoryExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse('Sub-category not found.'));
    }

    const items = await Item.find({ subCategory: subCategoryId })
      .sort({ name: 1 })
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .lean();

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Items fetched successfully.', items));
  } catch (error) {
    return next(error);
  }
};

export const getItemDetails = async (req, res, next) => {
  try {
    const { id, name } = req.query;

    const filter = id
      ? { _id: new ObjectId(id) }
      : { name: { $regex: `^${name}$`, $options: 'i' } };

    const item = await Item.findOne(filter)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .lean();

    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json(errorResponse('Item not found.'));
    }

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Item fetched successfully.', item));
  } catch (error) {
    return next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const existingItem = await Item.findById(itemId);
    if (!existingItem) {
      return res.status(StatusCodes.NOT_FOUND).json(errorResponse('Item not found.'));
    }

    const updates = { ...req.body };

    const nextCategoryId = updates.categoryId ?? existingItem.category.toString();

    const nextCategory = await Category.findById(nextCategoryId).lean();
    if (!nextCategory) {
      return res.status(StatusCodes.NOT_FOUND).json(errorResponse('Category not found.'));
    }

    if (updates.name) {
      const duplicate = await Item.findOne({
        _id: { $ne: itemId },
        category: nextCategoryId,
        name: { $regex: `^${updates.name}$`, $options: 'i' }
      }).lean();

      if (duplicate) {
        return res
          .status(StatusCodes.CONFLICT)
          .json(errorResponse('Another item with the same name exists in the target category.'));
      }
    }

    if (updates.categoryId) {
      updates.category = updates.categoryId;
    }
    delete updates.categoryId;

    let subCategory = null;
    if (Object.prototype.hasOwnProperty.call(updates, 'subCategoryId')) {
      if (updates.subCategoryId === null) {
        updates.subCategory = null;
      } else {
        subCategory = await SubCategory.findOne({
          _id: updates.subCategoryId,
          category: nextCategoryId
        }).lean();

        if (!subCategory) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(errorResponse('Sub-category does not belong to the specified category.'));
        }

        updates.subCategory = subCategory._id;
      }

      delete updates.subCategoryId;
    } else if (existingItem.subCategory) {
      subCategory = await SubCategory.findById(existingItem.subCategory).lean();
      if (subCategory && subCategory.category.toString() !== nextCategoryId) {
        subCategory = null;
        updates.subCategory = null;
      }
    }

    const taxApplicability =
      updates.taxApplicability ?? subCategory?.taxApplicability ?? nextCategory.taxApplicability;
    updates.taxApplicability = taxApplicability;

    if (taxApplicability === false) {
      updates.tax = 0;
    } else if (taxApplicability === true && updates.tax === undefined) {
      updates.tax = subCategory?.tax ?? nextCategory.tax ?? existingItem.tax;
    }

    const baseAmount = updates.baseAmount ?? existingItem.baseAmount;
    const discount = updates.discount ?? existingItem.discount;

    if (discount > baseAmount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse('Discount cannot exceed the base amount.'));
    }

    if (updates.baseAmount !== undefined || updates.discount !== undefined) {
      updates.totalAmount = Math.max(0, baseAmount - discount);
    }

    const updatedItem = await Item.findByIdAndUpdate(itemId, updates, {
      new: true,
      runValidators: true
    })
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .lean();

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Item updated successfully.', updatedItem));
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(errorResponse('Item with the same name already exists.'));
    }

    return next(error);
  }
};

export const searchItems = async (req, res, next) => {
  try {
    const { name, limit } = req.query;

    const items = await Item.find({
      name: { $regex: name, $options: 'i' }
    })
      .limit(limit)
      .sort({ name: 1 })
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .lean();

    return res
      .status(StatusCodes.OK)
      .json(successResponse('Items fetched successfully.', items));
  } catch (error) {
    return next(error);
  }
};
