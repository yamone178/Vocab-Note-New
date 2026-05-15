require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

async function run() {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const userId = (await prisma.user.findFirst()).id;
    console.log("Found user", userId);
    
    const userVocabs = await prisma.vocabulary.findMany({
      where: { userId },
      select: { word: true },
    });
    
    const userInteractions = await prisma.userInteraction.findMany({
      where: { userId },
      select: { vocabularyWord: true },
    });

    const userWordSet = new Set([
      ...userVocabs.map(v => v.word.toLowerCase()),
      ...userInteractions.map(i => i.vocabularyWord.toLowerCase())
    ]);

    const allOtherVocabs = await prisma.vocabulary.findMany({
      where: {
        userId: { not: userId }
      },
      select: {
        word: true,
        definition: true,
        example: true,
        userId: true,
      }
    });

    console.log("Success", allOtherVocabs.length);
  } catch (err) {
    console.error("FAIL:", err)
  }
}
run()
