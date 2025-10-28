import db from "../../../db";
import { advocates } from "../../../db/schema";
import { seedAdvocatesWithSpecialties } from "../../../db/seed/advocates";

export async function POST() {
  if (!db) {
    return Response.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  const records = await seedAdvocatesWithSpecialties();

  return Response.json(records);
}
