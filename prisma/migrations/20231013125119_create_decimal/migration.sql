/*
  Warnings:

  - The values [EMPLOYEE] on the enum `ROLE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `totalPrice` on the `BookingFood` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,2)`.
  - You are about to alter the column `depositMoney` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,2)`.
  - You are about to alter the column `totalMoney` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,2)`.
  - You are about to alter the column `price` on the `menu_item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(60,2)`.
  - You are about to alter the column `totalPrice` on the `menus` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,2)`.
  - You are about to alter the column `price` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,2)`.
  - You are about to drop the `emoloyees` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLE_new" AS ENUM ('ADMIN', 'CUSTOMER');
ALTER TABLE "roles" ALTER COLUMN "roleName" DROP DEFAULT;
ALTER TABLE "roles" ALTER COLUMN "roleName" TYPE "ROLE_new" USING ("roleName"::text::"ROLE_new");
ALTER TYPE "ROLE" RENAME TO "ROLE_old";
ALTER TYPE "ROLE_new" RENAME TO "ROLE";
DROP TYPE "ROLE_old";
ALTER TABLE "roles" ALTER COLUMN "roleName" SET DEFAULT 'CUSTOMER';
COMMIT;

-- AlterTable
ALTER TABLE "BookingFood" ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(20,2);

-- AlterTable
ALTER TABLE "booking" ALTER COLUMN "depositMoney" SET DATA TYPE DECIMAL(20,2),
ALTER COLUMN "totalMoney" SET DATA TYPE DECIMAL(20,2);

-- AlterTable
ALTER TABLE "menu_item" ALTER COLUMN "price" SET DATA TYPE DECIMAL(60,2),
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "menus" ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(20,2);

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "image" TEXT DEFAULT 'https://img.freepik.com/free-vector/young-waitress-waiter-object-element-professional-service-restaurant_24797-2133.jpg',
ALTER COLUMN "price" SET DATA TYPE DECIMAL(20,2);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT DEFAULT 'https://haycafe.vn/wp-content/uploads/2023/04/Hinh-anh-avatar-cute-TikTok-nam.jpg';

-- DropTable
DROP TABLE "emoloyees";

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "employeeName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "salary" DECIMAL(20,2) NOT NULL,
    "age" INTEGER NOT NULL,
    "experience" INTEGER NOT NULL,
    "gender" "GENDER_ENUM_TYPE" NOT NULL,
    "position" "POSITION_ENUM" NOT NULL,
    "regency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);
