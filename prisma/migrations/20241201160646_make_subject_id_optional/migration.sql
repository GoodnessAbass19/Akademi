/*
  Warnings:

  - You are about to drop the column `lessonId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentId` on the `Result` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_assignmentId_fkey";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "lessonId",
ADD COLUMN     "subjectId" INTEGER;

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "assignmentId";

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
