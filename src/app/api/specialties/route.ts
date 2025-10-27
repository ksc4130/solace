import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { specialties } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const allSpecialties = await db.select().from(specialties).orderBy(asc(specialties.name));
    
    return NextResponse.json(allSpecialties);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return NextResponse.json(
      { error: "Failed to fetch specialties" },
      { status: 500 }
    );
  }
}
