-- DropForeignKey
ALTER TABLE "Fund" DROP CONSTRAINT "Fund_treeId_fkey";

-- DropForeignKey
ALTER TABLE "Fund" DROP CONSTRAINT "Fund_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tree" DROP CONSTRAINT "Tree_userId_fkey";

-- DropForeignKey
ALTER TABLE "TreeLike" DROP CONSTRAINT "TreeLike_treeId_fkey";

-- DropForeignKey
ALTER TABLE "TreeLike" DROP CONSTRAINT "TreeLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "TreeScoring" DROP CONSTRAINT "TreeScoring_treeId_fkey";

-- DropForeignKey
ALTER TABLE "TreeScoring" DROP CONSTRAINT "TreeScoring_userId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteeringVerification" DROP CONSTRAINT "VolunteeringVerification_userId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteeringVerification" DROP CONSTRAINT "VolunteeringVerification_volunteeringId_fkey";

-- AddForeignKey
ALTER TABLE "Tree" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fund" ADD FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fund" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeLike" ADD FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeScoring" ADD FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeScoring" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteeringVerification" ADD FOREIGN KEY ("volunteeringId") REFERENCES "Volunteering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteeringVerification" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
