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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Invalid category ID." },
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

    // Remove the category
    categories.splice(categoryIndex, 1);

    await writeCategories(categories);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    let message = "Failed to delete category";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error in DELETE /api/delete-category/[id]:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
