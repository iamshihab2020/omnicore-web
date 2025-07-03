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
        id: typeof item.id === "number" ? item.id : 0, // Ensure id is a number
        name: typeof item.name === "string" ? item.name : "", // Ensure name is a string
        description:
          typeof item.description === "string"
            ? item.description
            : undefined, // Ensure description is a string or undefined
      }));
    }
    return [];
  } catch (error) {
    // Check if it's a file system error with a 'code' property
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return []; // Return empty array if file doesn't exist
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
    throw new Error("Could not save category");
  }
}

export async function POST(req: NextRequest) {
  try {
    const newCategoryData = await req.json();

    if (!newCategoryData || !newCategoryData.name) {
      return NextResponse.json(
        { message: "Invalid category data. Name is required." },
        { status: 400 }
      );
    }

    const categories = await readCategories();

    // Determine the next ID
    let nextId = 1;
    if (categories.length > 0) {
      const maxId = Math.max(...categories.map((cat: Category) => cat.id || 0));
      nextId = maxId + 1;
    }

    const newCategoryWithId: Category = {
      ...newCategoryData,
      id: nextId,
    };

    categories.push(newCategoryWithId);
    await writeCategories(categories);

    return NextResponse.json(
      { message: "Category saved successfully", category: newCategoryWithId },
      { status: 200 }
    );
  } catch (error) {
    let message = "Failed to save category";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await readCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    let message = "Failed to fetch categories";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
