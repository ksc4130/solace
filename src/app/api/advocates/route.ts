import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates, specialties, advocateSpecialties } from "../../../db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function GET() {
  try {
    if (!db) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Single query to get all advocates with their specialties using left join
    const result = await db
      .select({
        id: advocates.id,
        firstName: advocates.firstName,
        lastName: advocates.lastName,
        city: advocates.city,
        degree: advocates.degree,
        yearsOfExperience: advocates.yearsOfExperience,
        phoneNumber: advocates.phoneNumber,
        createdAt: advocates.createdAt,
        specialtyName: specialties.name,
      })
      .from(advocates)
      .leftJoin(advocateSpecialties, eq(advocates.id, advocateSpecialties.advocateId))
      .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id));

    // Group results by advocate
    const advocatesMap = new Map<number, any>();
    
    for (const row of result) {
      const advocateId = row.id;
      
      if (!advocatesMap.has(advocateId)) {
        advocatesMap.set(advocateId, {
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          city: row.city,
          degree: row.degree,
          yearsOfExperience: row.yearsOfExperience,
          phoneNumber: row.phoneNumber,
          createdAt: row.createdAt,
          specialties: []
        });
      }
      
      // Add specialty if it exists (won't be null due to left join)
      if (row.specialtyName) {
        advocatesMap.get(advocateId)!.specialties.push(row.specialtyName);
      }
    }

    // Convert map to array
    const advocatesWithSpecialties = Array.from(advocatesMap.values());

    return Response.json({ data: advocatesWithSpecialties });
  } catch (error) {
    console.error('Error fetching advocates:', error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { specialties: specialtyNames, ...advocateData } = body;
    
    // Insert advocate
    const [newAdvocate] = await db
      .insert(advocates)
      .values(advocateData)
      .returning();
    
    // Insert advocate-specialty relationships
    if (specialtyNames && specialtyNames.length > 0) {
      const specialtiesData = await db
        .select()
        .from(specialties)
        .where(inArray(specialties.name, specialtyNames));
      
      const advocateSpecialtyInserts = specialtiesData.map((specialty) => ({
        advocateId: newAdvocate.id,
        specialtyId: specialty.id
      }));
      
      if (advocateSpecialtyInserts.length > 0) {
        await db
          .insert(advocateSpecialties)
          .values(advocateSpecialtyInserts);
      }
    }
    
    return Response.json({ 
      data: {
        ...newAdvocate,
        specialties: specialtyNames || []
      }
    });
  } catch (error) {
    console.error('Error creating advocate:', error);
    return Response.json(
      { error: "Failed to create advocate" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!db) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id, specialties: specialtyNames, ...advocateData } = body;
    
    // Update advocate
    const [updatedAdvocate] = await db
      .update(advocates)
      .set(advocateData)
      .where(eq(advocates.id, id))
      .returning();
    
    // Delete existing specialty relationships
    await db
      .delete(advocateSpecialties)
      .where(eq(advocateSpecialties.advocateId, id));
    
    // Insert new specialty relationships
    if (specialtyNames && specialtyNames.length > 0) {
      const specialtiesData = await db
        .select()
        .from(specialties)
        .where(inArray(specialties.name, specialtyNames));
      
      const advocateSpecialtyInserts = specialtiesData.map((specialty) => ({
        advocateId: id,
        specialtyId: specialty.id
      }));
      
      if (advocateSpecialtyInserts.length > 0) {
        await db
          .insert(advocateSpecialties)
          .values(advocateSpecialtyInserts);
      }
    }
    
    return Response.json({ 
      data: {
        ...updatedAdvocate,
        specialties: specialtyNames || []
      }
    });
  } catch (error) {
    console.error('Error updating advocate:', error);
    return Response.json(
      { error: "Failed to update advocate" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!db) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json(
        { error: "Advocate ID is required" },
        { status: 400 }
      );
    }
    
    // Delete advocate (cascade will handle specialty relationships)
    await db
      .delete(advocates)
      .where(eq(advocates.id, parseInt(id)));
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting advocate:', error);
    return Response.json(
      { error: "Failed to delete advocate" },
      { status: 500 }
    );
  }
}
