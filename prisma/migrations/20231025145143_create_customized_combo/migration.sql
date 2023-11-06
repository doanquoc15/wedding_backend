/*
  Warnings:

  - You are about to drop the `BookingFood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comboMenuId` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "STATUS_COMBO" AS ENUM ('CUSTOMIZED', 'AVAILABLE');

-- DropForeignKey
ALTER TABLE "BookingFood" DROP CONSTRAINT "BookingFood_menuId_fkey";

-- DropForeignKey
ALTER TABLE "BookingFood" DROP CONSTRAINT "BookingFood_menuItemId_fkey";

-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_serviceId_fkey";

-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "comboMenuId" INTEGER NOT NULL,
ALTER COLUMN "depositMoney" SET DATA TYPE DECIMAL(60,2),
ALTER COLUMN "totalMoney" SET DATA TYPE DECIMAL(60,2);

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "salary" SET DATA TYPE DECIMAL(60,2);

-- AlterTable
ALTER TABLE "menu_item" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "price" SET DATA TYPE DECIMAL(60,2);

-- DropTable
DROP TABLE "BookingFood";

-- DropTable
DROP TABLE "menus";

-- CreateTable
CREATE TABLE "comboMenus" (
    "id" SERIAL NOT NULL,
    "comboName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalPrice" DECIMAL(60,2),
    "serviceId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comboMenus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customizedComboMenus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "comboMenuId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customizedComboMenus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComboItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DECIMAL(60,2) NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "comboMenuId" INTEGER,
    "comboCustomizedMenuId" INTEGER,
    "status" "STATUS_COMBO" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComboItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_comboMenuId_fkey" FOREIGN KEY ("comboMenuId") REFERENCES "comboMenus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comboMenus" ADD CONSTRAINT "comboMenus_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customizedComboMenus" ADD CONSTRAINT "customizedComboMenus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customizedComboMenus" ADD CONSTRAINT "customizedComboMenus_comboMenuId_fkey" FOREIGN KEY ("comboMenuId") REFERENCES "comboMenus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComboItem" ADD CONSTRAINT "ComboItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComboItem" ADD CONSTRAINT "ComboItem_comboMenuId_fkey" FOREIGN KEY ("comboMenuId") REFERENCES "comboMenus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComboItem" ADD CONSTRAINT "ComboItem_comboCustomizedMenuId_fkey" FOREIGN KEY ("comboCustomizedMenuId") REFERENCES "customizedComboMenus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
