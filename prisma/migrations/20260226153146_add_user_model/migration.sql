/*
  Warnings:

  - You are about to drop the column `proficiencyLevel` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vocabularies` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_user_id_fkey";

-- DropForeignKey
ALTER TABLE "vocabularies" DROP CONSTRAINT "vocabularies_category_id_fkey";

-- DropForeignKey
ALTER TABLE "vocabularies" DROP CONSTRAINT "vocabularies_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "proficiencyLevel",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "proficiency_level" "ProficiencyLevel" NOT NULL DEFAULT 'BEGINNER',
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "vocabularies";
