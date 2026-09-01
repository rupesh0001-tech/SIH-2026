-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'ARRIVED', 'VERIFIED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MandiApprovalStatus" AS ENUM ('PENDING_ONBOARDING', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'REQUIRES_DOCUMENTS');

-- CreateEnum
CREATE TYPE "LegalDocType" AS ENUM ('MANDI_LICENSE', 'APMC_REGISTRATION', 'GST_CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "DocVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "FarmerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "village" TEXT,
    "taluka" TEXT,
    "district" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "landSizeAcres" DOUBLE PRECISION,
    "mainCrops" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "secondaryCrops" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "irrigationType" TEXT,
    "farmLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MandiProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mandiName" TEXT,
    "apmcCode" TEXT,
    "address" TEXT,
    "district" TEXT,
    "state" TEXT,
    "operatingHours" TEXT DEFAULT '08:00 AM - 06:00 PM (Mon-Sat)',
    "aadhaarNumber" TEXT,
    "aadhaarVerified" BOOLEAN NOT NULL DEFAULT false,
    "aadhaarDocUrl" TEXT,
    "avatarUrl" TEXT,
    "approvalStatus" "MandiApprovalStatus" NOT NULL DEFAULT 'PENDING_ONBOARDING',
    "rejectionReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.8,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MandiProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MandiSlot" (
    "id" TEXT NOT NULL,
    "mandiProfileId" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "totalCapacityQuintals" DOUBLE PRECISION NOT NULL,
    "bookedCapacityQuintals" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "capacityPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxFarmers" INTEGER NOT NULL,
    "bookedFarmers" INTEGER NOT NULL DEFAULT 0,
    "availableBookings" INTEGER NOT NULL,
    "bufferMinutes" INTEGER NOT NULL DEFAULT 15,
    "bufferPercentage" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MandiSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "mandiProfileId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "variety" TEXT,
    "quantityQuintals" DOUBLE PRECISION NOT NULL,
    "capacityPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vehicleNumber" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MandiLegalDoc" (
    "id" TEXT NOT NULL,
    "mandiProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LegalDocType" NOT NULL DEFAULT 'MANDI_LICENSE',
    "status" "DocVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MandiLegalDoc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FarmerProfile_userId_key" ON "FarmerProfile"("userId");

-- CreateIndex
CREATE INDEX "FarmerProfile_userId_idx" ON "FarmerProfile"("userId");

-- CreateIndex
CREATE INDEX "FarmerProfile_district_state_idx" ON "FarmerProfile"("district", "state");

-- CreateIndex
CREATE INDEX "FarmerProfile_pincode_idx" ON "FarmerProfile"("pincode");

-- CreateIndex
CREATE UNIQUE INDEX "MandiProfile_userId_key" ON "MandiProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MandiProfile_apmcCode_key" ON "MandiProfile"("apmcCode");

-- CreateIndex
CREATE INDEX "MandiProfile_userId_idx" ON "MandiProfile"("userId");

-- CreateIndex
CREATE INDEX "MandiProfile_apmcCode_idx" ON "MandiProfile"("apmcCode");

-- CreateIndex
CREATE INDEX "MandiProfile_approvalStatus_idx" ON "MandiProfile"("approvalStatus");

-- CreateIndex
CREATE INDEX "MandiProfile_district_state_idx" ON "MandiProfile"("district", "state");

-- CreateIndex
CREATE INDEX "MandiSlot_mandiProfileId_idx" ON "MandiSlot"("mandiProfileId");

-- CreateIndex
CREATE INDEX "MandiSlot_date_crop_idx" ON "MandiSlot"("date", "crop");

-- CreateIndex
CREATE INDEX "MandiSlot_isActive_idx" ON "MandiSlot"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_token_key" ON "Booking"("token");

-- CreateIndex
CREATE INDEX "Booking_farmerId_idx" ON "Booking"("farmerId");

-- CreateIndex
CREATE INDEX "Booking_mandiProfileId_idx" ON "Booking"("mandiProfileId");

-- CreateIndex
CREATE INDEX "Booking_slotId_idx" ON "Booking"("slotId");

-- CreateIndex
CREATE INDEX "Booking_token_idx" ON "Booking"("token");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "MandiLegalDoc_mandiProfileId_idx" ON "MandiLegalDoc"("mandiProfileId");

-- AddForeignKey
ALTER TABLE "FarmerProfile" ADD CONSTRAINT "FarmerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MandiProfile" ADD CONSTRAINT "MandiProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MandiSlot" ADD CONSTRAINT "MandiSlot_mandiProfileId_fkey" FOREIGN KEY ("mandiProfileId") REFERENCES "MandiProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_mandiProfileId_fkey" FOREIGN KEY ("mandiProfileId") REFERENCES "MandiProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MandiSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MandiLegalDoc" ADD CONSTRAINT "MandiLegalDoc_mandiProfileId_fkey" FOREIGN KEY ("mandiProfileId") REFERENCES "MandiProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
