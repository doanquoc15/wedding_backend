/*
  Warnings:

  - The `roleName` column on the `roles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "roles" DROP COLUMN "roleName",
ADD COLUMN     "roleName" "ROLE" NOT NULL DEFAULT 'CUSTOMER';
