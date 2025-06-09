import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const itemsFilePath = path.resolve(process.cwd(), "public/json/items.json");

interface Item {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  image?: string;
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

async function writeItems(data: Item[]) {
  try {
    await fs.promises.writeFile(itemsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to items.json:", error);
    throw new Error("Could not save items");
  }
}

export async function DELETE(
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
    const itemIndex = items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { message: `Item with ID ${itemId} not found.` },
        { status: 404 }
      );
    }

    // Remove the item
    items.splice(itemIndex, 1);

    await writeItems(items);

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    let message = "Failed to delete item";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error in DELETE /api/delete-item/[id]:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
