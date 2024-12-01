/*
  Warnings:

  - You are about to drop the column `score` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "score",
ADD COLUMN     "ThirdTermscore" INTEGER,
ADD COLUMN     "firstTermscore" INTEGER,
ADD COLUMN     "secondTermscore" INTEGER;

-- AlterTable
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_SubjectToTeacher_AB_unique";
