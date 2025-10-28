import db from "..";
import { advocates, specialties as specialtiesTable, advocateSpecialties } from "../schema";

const specialtiesList = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const randomSpecialtyIndices = () => {
  const totalSpecialties = specialtiesList.length; // 26 specialties
  const indices = new Set<number>();
  
  // Generate 2-10 random unique indices
  const count = Math.floor(Math.random() * 9) + 2;
  
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * totalSpecialties));
  }
  
  return Array.from(indices);
};

const advocateData = [
  {
    firstName: "John",
    lastName: "Doe",
    city: "New York",
    degree: "MD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 10,
    phoneNumber: 5551234567,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    city: "Los Angeles",
    degree: "PhD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 8,
    phoneNumber: 5559876543,
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    city: "Chicago",
    degree: "MSW",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 5,
    phoneNumber: 5554567890,
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    city: "Houston",
    degree: "MD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 12,
    phoneNumber: 5556543210,
  },
  {
    firstName: "Emily",
    lastName: "Davis",
    city: "Phoenix",
    degree: "PhD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 7,
    phoneNumber: 5553210987,
  },
  {
    firstName: "Chris",
    lastName: "Martinez",
    city: "Philadelphia",
    degree: "MSW",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 9,
    phoneNumber: 5557890123,
  },
  {
    firstName: "Jessica",
    lastName: "Taylor",
    city: "San Antonio",
    degree: "MD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 11,
    phoneNumber: 5554561234,
  },
  {
    firstName: "David",
    lastName: "Harris",
    city: "San Diego",
    degree: "PhD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 6,
    phoneNumber: 5557896543,
  },
  {
    firstName: "Laura",
    lastName: "Clark",
    city: "Dallas",
    degree: "MSW",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 4,
    phoneNumber: 5550123456,
  },
  {
    firstName: "Daniel",
    lastName: "Lewis",
    city: "San Jose",
    degree: "MD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 13,
    phoneNumber: 5553217654,
  },
  {
    firstName: "Sarah",
    lastName: "Lee",
    city: "Austin",
    degree: "PhD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 10,
    phoneNumber: 5551238765,
  },
  {
    firstName: "James",
    lastName: "King",
    city: "Jacksonville",
    degree: "MSW",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 5,
    phoneNumber: 5556540987,
  },
  {
    firstName: "Megan",
    lastName: "Green",
    city: "San Francisco",
    degree: "MD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 14,
    phoneNumber: 5559873456,
  },
  {
    firstName: "Joshua",
    lastName: "Walker",
    city: "Columbus",
    degree: "PhD",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 9,
    phoneNumber: 5556781234,
  },
  {
    firstName: "Amanda",
    lastName: "Hall",
    city: "Fort Worth",
    degree: "MSW",
    specialtyIndices: randomSpecialtyIndices(),
    yearsOfExperience: 3,
    phoneNumber: 5559872345,
  },
];

// Function to seed advocates with the new normalized structure
async function seedAdvocatesWithSpecialties() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return;
  }

  if (!db) {
    console.error("Database not configured");
    return;
  }

  // Check if specialties table is empty
  const existingSpecialties = await db.select().from(specialtiesTable);
  
  if (existingSpecialties.length === 0) {
    console.log("🌱 Seeding specialties...");
    // Insert all specialties if table is empty
    for (const specialty of specialtiesList) {
      await (db as any).insert(specialtiesTable)
        .values({ name: specialty })
        .onConflictDoNothing();
    }
    console.log(`✅ Inserted ${specialtiesList.length} specialties`);
  } else {
    console.log(`ℹ️  Specialties already exist (${existingSpecialties.length} found), skipping insert`);
  }

  // Get all specialty IDs
  const allSpecialties = await db.select().from(specialtiesTable);
  const specialtyMap = new Map(allSpecialties.map((s: any) => [s.name, s.id]));

  // Insert advocates and their specialties
  for (const advocate of advocateData) {
    const { specialtyIndices, ...advocateDataWithoutSpecialties } = advocate;

    // Insert advocate
    const [insertedAdvocate] = await (db as any).insert(advocates)
      .values({
        ...advocateDataWithoutSpecialties,
      })
      .returning();

    // Insert advocate-specialty relationships using specialtyIndices
    for (const index of specialtyIndices) {
      const specialtyName = specialtiesList[index];
      const specialtyId = specialtyMap.get(specialtyName);
      if (specialtyId) {
        await (db as any).insert(advocateSpecialties)
          .values({
            advocateId: insertedAdvocate.id,
            specialtyId: specialtyId,
          })
          .onConflictDoNothing();
      }
    }
  }

  const allDbAdvocates = await db.select().from(advocates);
  const allDbSpecialties = await db.select().from(specialtiesTable);

  return { allDbAdvocates, allDbSpecialties };
}

export { advocateData, specialtiesList, seedAdvocatesWithSpecialties };
