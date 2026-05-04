import { HttpError } from "../../utils/httpError";
import Category from "./category.model";

export async function createCategory(dto: { categoryName?: string }) {
    const category = await Category.create({
        categoryName: dto.categoryName
    });

    return sanitizeCategory(category);
}

export async function getAllCategory() {
    const category = await Category.find();
    if (!category || category.length === 0) throw new HttpError(404, "No category found.");
    return category.map(sanitizeCategory);
}

export async function getSingleCategory(id: string) {
    const category = await Category.findById(id);
    if (!category) throw new HttpError(404, "Category not found");
    return sanitizeCategory(category);
}

export async function updateCategory(id: string, dto: { categoryName?: string }) {
  const category = await Category.findById(id);
  if (!category) throw new HttpError(404, "Category not found");

  if (dto.categoryName) category.categoryName = dto.categoryName;

  await category.save();
  return sanitizeCategory(category);
}

export async function deleteCategory(id: string) {
  await Category.findByIdAndDelete(id);
  return true;
}

function sanitizeCategory(category: any) {
  return {
    id: String(category._id),
    categoryName: category.categoryName,
  };
}
