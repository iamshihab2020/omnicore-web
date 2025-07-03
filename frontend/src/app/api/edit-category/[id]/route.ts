import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const categoriesFilePath = path.resolve(
  process.cwd(),
  "public/json/categories.json"
);

interface Category {
  id: number;
  name: string;
  description?: string;
}

async function readCategories(): Promise<Category[]> {
  try {
    const data = await fs.promises.readFile(categoriesFilePath, "utf-8");
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData)) {
      return parsedData.map((item) => ({
        id: typeof item.id === "number" ? item.id : 0,
        name: typeof item.name === "string" ? item.name : "",
        description:
          typeof item.description === "string" ? item.description : undefined,
      }));
    }
    return [];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    console.error("Error reading categories.json:", error);
    throw new Error("Could not read categories");
  }
}

async function writeCategories(data: Category[]) {
  try {
    await fs.promises.writeFile(
      categoriesFilePath,
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error("Error writing to categories.json:", error);
    throw new Error("Could not save categories");
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Invalid category ID." },
        { status: 400 }
      );
    }

    const updatedCategoryData = await req.json();

    if (
      !updatedCategoryData ||
      typeof updatedCategoryData.name !== "string" ||
      updatedCategoryData.name.trim() === ""
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid category data. Name is required and must be a string.",
        },
        { status: 400 }
      );
    }

    const categories = await readCategories();
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);

    if (categoryIndex === -1) {
      return NextResponse.json(
        { message: `Category with ID ${categoryId} not found.` },
        { status: 404 }
      );
    }

    // Update the category
    categories[categoryIndex] = {
      ...categories[categoryIndex], // Preserve other properties if any
      name: updatedCategoryData.name,
      description: updatedCategoryData.description, // Ensure description is also updated
      id: categoryId, // Ensure ID remains the same
    };

    await writeCategories(categories);

    return NextResponse.json(
      {
        message: "Category updated successfully",
        category: categories[categoryIndex],
      },
      { status: 200 }
    );
  } catch (error) {
    let message = "Failed to update category";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error in PUT /api/edit-category/[id]:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
