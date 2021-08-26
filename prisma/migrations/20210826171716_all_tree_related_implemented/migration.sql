/*
  Warnings:

  - Added the required column `orderId` to the `Fund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Fund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Tree` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumb` to the `Tree` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FundStatus" AS ENUM ('Pending', 'Approved', 'Refunded', 'Rejected');

-- CreateEnum
CREATE TYPE "VolunteeringStatus" AS ENUM ('Interested', 'Evaluated', 'Accepted', 'Rejected', 'Completed', 'Reported');

-- AlterTable
ALTER TABLE "Fund" ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "paymentId" TEXT[],
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tree" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "thumb" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TreeLike" (
    "id" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreeScoring" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteering" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "status" "VolunteeringStatus" NOT NULL DEFAULT E'Interested',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "proof" TEXT[],
    "treeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteeringVerification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "volunteeringId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TreeLike" ADD FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeScoring" ADD FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeScoring" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Volunteering" ADD FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Volunteering" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteeringVerification" ADD FOREIGN KEY ("volunteeringId") REFERENCES "Volunteering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteeringVerification" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
