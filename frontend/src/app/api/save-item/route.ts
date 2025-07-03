import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const itemsFilePath = path.resolve(process.cwd(), "public/json/items.json");
const categoriesFilePath = path.resolve(
  process.cwd(),
  "public/json/categories.json"
);

interface Item {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  image?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

async function readItems(): Promise<Item[]> {
  try {
    const data = await fs.promises.readFile(itemsFilePath, "utf-8");
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData)) {
      return parsedData.map((item) => ({
        id: typeof item.id === "number" ? item.id : 0,
        name: typeof item.name === "string" ? item.name : "",
        description:
          typeof item.description === "string" ? item.description : undefined,
        price: typeof item.price === "number" ? item.price : 0,
        categoryId: typeof item.categoryId === "number" ? item.categoryId : 0,
        categoryName:
          typeof item.categoryName === "string" ? item.categoryName : undefined,
        image: typeof item.image === "string" ? item.image : undefined,
      }));
    }
    return [];
  } catch (error) {
    // Check if it's a file system error with a 'code' property
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return []; // Return empty array if file doesn't exist
    }
    console.error("Error reading items.json:", error);
    throw new Error("Could not read items");
  }
}

async function readCategories(): Promise<Category[]> {
  try {
    const data = await fs.promises.readFile(categoriesFilePath, "utf-8");
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData)) {
      return parsedData.map((cat) => ({
        id: typeof cat.id === "number" ? cat.id : 0,
        name: typeof cat.name === "string" ? cat.name : "",
        description:
          typeof cat.description === "string" ? cat.description : undefined,
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

async function writeItems(data: Item[]) {
  try {
    await fs.promises.writeFile(itemsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to items.json:", error);
    throw new Error("Could not save item");
  }
}

export async function POST(req: NextRequest) {
  try {
    const newItemData = await req.json();

    if (!newItemData || !newItemData.name) {
      return NextResponse.json(
        { message: "Invalid item data. Name is required." },
        { status: 400 }
      );
    }

    if (
      !newItemData.price ||
      typeof newItemData.price !== "number" ||
      newItemData.price < 0
    ) {
      return NextResponse.json(
        { message: "Invalid item data. Price must be a non-negative number." },
        { status: 400 }
      );
    }

    if (!newItemData.categoryId || typeof newItemData.categoryId !== "number") {
      return NextResponse.json(
        { message: "Invalid item data. Category ID is required." },
        { status: 400 }
      );
    }

    // Validate and find category name
    const categories = await readCategories();
    const category = categories.find(
      (cat) => cat.id === newItemData.categoryId
    );
    if (!category) {
      return NextResponse.json(
        { message: `Category with ID ${newItemData.categoryId} not found.` },
        { status: 404 }
      );
    }

    const items = await readItems();

    // Determine the next ID
    let nextId = 1;
    if (items.length > 0) {
      const maxId = Math.max(...items.map((item: Item) => item.id || 0));
      nextId = maxId + 1;
    }

    const newItemWithId: Item = {
      ...newItemData,
      id: nextId,
      categoryName: category.name,
    };

    items.push(newItemWithId);
    await writeItems(items);

    return NextResponse.json(
      { message: "Item saved successfully", item: newItemWithId },
      { status: 200 }
    );
  } catch (error) {
    let message = "Failed to save item";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await readItems();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    let message = "Failed to fetch items";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
