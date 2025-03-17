/* eslint-disable */
/* eslint-disable @typescript-eslint/no-explicit-any */

// src/app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/db";
import Item, { IItem } from "../../../models/Items";

// Fungsi bantu untuk mengirim respons JSON
function jsonResponse(data: any, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

type Item = {
  id: string;
  name: string;
  // Add other properties as needed
};

// GET: Ambil semua item
export async function GET(): Promise<NextResponse> {
  await connectToDatabase();
  try {
    const items: IItem[] = await Item.find({});
    return jsonResponse({ success: true, data: items });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return jsonResponse({ success: false, error: error.message }, 500);
    }
    return jsonResponse({ success: false, error: "Unknown error" }, 500);
  }
}

// POST: Buat item baru
export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectToDatabase();
  try {
    const body = await req.json();
    const newItem = new Item(body);
    const savedItem = await newItem.save();
    return jsonResponse({ success: true, data: savedItem }, 201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }
    return jsonResponse({ success: false, error: "Unknown error" }, 400);
  }
}

// PUT: Update item (menggunakan parameter query id)
// Karena App Router API belum menyediakan dynamic route file untuk PUT/DELETE,
// kita ambil id dari query parameter.
export async function PUT(req: NextRequest): Promise<NextResponse> {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return jsonResponse({ success: false, error: "ID tidak ditemukan" }, 400);
  }
  try {
    const body = await req.json();
    const updatedItem = await Item.findByIdAndUpdate(id, body, { new: true });
    if (!updatedItem) {
      return jsonResponse(
        { success: false, error: "Item tidak ditemukan" },
        404
      );
    }
    return jsonResponse({ success: true, data: updatedItem });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }
    return jsonResponse({ success: false, error: "Unknown error" }, 400);
  }
}

// DELETE: Hapus item berdasarkan id (dari query parameter)
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return jsonResponse({ success: false, error: "ID tidak ditemukan" }, 400);
  }
  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return jsonResponse(
        { success: false, error: "Item tidak ditemukan" },
        404
      );
    }
    return jsonResponse({ success: true, data: deletedItem });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }
    return jsonResponse({ success: false, error: "Unknown error" }, 400);
  }
}
