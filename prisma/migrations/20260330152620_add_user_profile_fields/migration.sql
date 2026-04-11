-- AlterTable
ALTER TABLE "users" ADD COLUMN     "current_daily_words_learned" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "daily_goal" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "user_interactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vocabulary_word" TEXT NOT NULL,
    "interaction_type" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_interactions_user_id_vocabulary_word_interaction_type_key" ON "user_interactions"("user_id", "vocabulary_word", "interaction_type");

-- AddForeignKey
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
