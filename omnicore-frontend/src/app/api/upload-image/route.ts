import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Define the directory where images should be saved
const imagesDirectory = path.resolve(process.cwd(), "public/images");

// Ensure the images directory exists
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    // Check file type (ensure it's an image)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Generate a unique filename to avoid collisions
    // Extract extension from original filename
    const fileExtension = path.extname(file.name).toLowerCase();
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const imagePath = path.join(imagesDirectory, uniqueFileName);

    // Convert the file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save the file to the public/images directory
    fs.writeFileSync(imagePath, buffer);

    // Return the path that can be used in <Image> component
    // This will be relative to the public directory
    const imageUrl = `/images/${uniqueFileName}`;

    return NextResponse.json(
      {
        success: true,
        imageUrl,
        message: "Image uploaded successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
