import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";

export async function GET(req: Request) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const next7Days = new Date(today);
    next7Days.setDate(next7Days.getDate() + 7);
    next7Days.setHours(23, 59, 59, 999);

    // Fetch all relevant vocabularies for schedule calculation
    const vocabularies = await db.vocabulary.findMany({
      where: { userId },
      select: { nextReview: true, isMastered: true, interval: true }
    });

    let dueToday = 0;
    let upcomingSevenDays = 0;
    let masteredCount = 0;
    let learning = 0;
    let reviewing = 0;

    // Initialize forecast array mapped by date string
    const forecastMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      forecastMap.set(dateString, 0);
    }

    const now = new Date(); // To accurately count due Today

    vocabularies.forEach(vocab => {
      if (vocab.isMastered) {
        masteredCount++;
      } else {
        // Breakdown logic
        if (vocab.interval <= 3) {
          learning++;
        } else {
          reviewing++;
        }

        // Schedule logic
        if (vocab.nextReview) {
          const reviewDate = new Date(vocab.nextReview);
          
          if (reviewDate <= now) {
            dueToday++;
            // If it's overdue or due today, count it in today's forecast
            const todayString = today.toISOString().split('T')[0];
            forecastMap.set(todayString, forecastMap.get(todayString)! + 1);
          } else if (reviewDate > now && reviewDate <= next7Days) {
            upcomingSevenDays++;
            const reviewDateString = reviewDate.toISOString().split('T')[0];
            if (forecastMap.has(reviewDateString)) {
              forecastMap.set(reviewDateString, forecastMap.get(reviewDateString)! + 1);
            }
          }
        } else {
           // If nextReview is null, it's due today (new word)
           dueToday++;
           const todayString = today.toISOString().split('T')[0];
           forecastMap.set(todayString, forecastMap.get(todayString)! + 1);
        }
      }
    });

    const forecast = Array.from(forecastMap.entries()).map(([date, count]) => {
      const d = new Date(date);
      return {
        date,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      };
    });

    return NextResponse.json({
      summary: {
        dueToday,
        upcomingSevenDays,
        mastered: masteredCount
      },
      forecast,
      breakdown: {
        learning,
        reviewing,
        mastered: masteredCount
      }
    });
  } catch (error) {
    console.error("Error fetching review schedule:", error);
    return NextResponse.json(
      { message: "Error fetching review schedule", error },
      { status: 500 }
    );
  }
}
