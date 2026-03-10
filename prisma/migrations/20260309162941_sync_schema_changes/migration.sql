-- AlterTable
ALTER TABLE "vocabularies" ADD COLUMN     "interval" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_mastered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_review" TIMESTAMP(3),
ADD COLUMN     "next_review" TIMESTAMP(3);
