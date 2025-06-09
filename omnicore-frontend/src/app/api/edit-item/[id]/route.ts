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
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
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
    throw new Error("Could not save items");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { message: "Invalid item ID." },
        { status: 400 }
      );
    }

    const updatedItemData = await req.json();

    if (
      !updatedItemData ||
      !updatedItemData.name ||
      updatedItemData.name.trim() === ""
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid item data. Name is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    if (
      !updatedItemData.price ||
      typeof updatedItemData.price !== "number" ||
      updatedItemData.price < 0
    ) {
      return NextResponse.json(
        { message: "Invalid item data. Price must be a non-negative number." },
        { status: 400 }
      );
    }

    if (
      !updatedItemData.categoryId ||
      typeof updatedItemData.categoryId !== "number"
    ) {
      return NextResponse.json(
        { message: "Invalid item data. Category ID is required." },
        { status: 400 }
      );
    }

    // Validate and find category name
    const categories = await readCategories();
    const category = categories.find(
      (cat) => cat.id === updatedItemData.categoryId
    );
    if (!category) {
      return NextResponse.json(
        {
          message: `Category with ID ${updatedItemData.categoryId} not found.`,
        },
        { status: 404 }
      );
    }

    const items = await readItems();
    const itemIndex = items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { message: `Item with ID ${itemId} not found.` },
        { status: 404 }
      );
    }

    // Update the item
    items[itemIndex] = {
      ...items[itemIndex], // Preserve other properties
      name: updatedItemData.name,
      description: updatedItemData.description,
      price: updatedItemData.price,
      categoryId: updatedItemData.categoryId,
      categoryName: category.name,
      image: updatedItemData.image || items[itemIndex].image,
      id: itemId, // Ensure ID remains the same
    };

    await writeItems(items);

    return NextResponse.json(
      {
        message: "Item updated successfully",
        item: items[itemIndex],
      },
      { status: 200 }
    );
  } catch (error) {
    let message = "Failed to update item";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error in PUT /api/edit-item/[id]:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { message: "Invalid item ID." },
        { status: 400 }
      );
    }

    const items = await readItems();
    const item = items.find((item) => item.id === itemId);

    if (!item) {
      return NextResponse.json(
        { message: `Item with ID ${itemId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    let message = "Failed to fetch item";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error in GET /api/edit-item/[id]:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
