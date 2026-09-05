import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { generateAccessToken } from "../src/utils/jwt.js";
import { Role } from "@prisma/client";

// Mock Prisma & email service
vi.mock("../src/lib/prisma.js", () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      farmerProfile: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        upsert: vi.fn(),
        count: vi.fn(),
      },
      $transaction: vi.fn(),
    },
  };
});

describe("Farmer Profile Management Suite (/api/v1/farmer/*)", () => {
  const farmerUserId = "farmer-user-123";
  const farmerToken = generateAccessToken({
    userId: farmerUserId,
    email: "farmer@example.com",
    role: Role.FARMER,
    isVerified: true,
  });

  const mandiToken = generateAccessToken({
    userId: "mandi-user-456",
    email: "mandi@example.com",
    role: Role.MANDI_OPERATOR,
    isVerified: true,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/farmer/profile", () => {
    it("should allow authenticated farmer to fetch their profile", async () => {
      const mockProfile = {
        id: farmerUserId,
        name: "Ramesh Kisan",
        email: "farmer@example.com",
        phone: "9876543210",
        role: Role.FARMER,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        farmerProfile: {
          id: "fp-123",
          userId: farmerUserId,
          farmerCode: "FAR001",
          isProfileComplete: true,
          addressLine1: "House No 42",
          addressLine2: "Near Gram Panchayat",
          village: "Lasalgaon",
          taluka: "Niphad",
          district: "Nashik",
          state: "Maharashtra",
          pincode: "422306",
          landSizeAcres: 5.5,
          mainCrops: ["Onion", "Wheat"],
          secondaryCrops: ["Tomato"],
          irrigationType: "Drip",
          farmLocation: "20.145, 74.234",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProfile as any);

      const response = await request(app)
        .get("/api/v1/farmer/profile")
        .set("Authorization", `Bearer ${farmerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Ramesh Kisan");
      expect(response.body.data.farmerProfile.pincode).toBe("422306");
      expect(response.body.data.farmerProfile.mainCrops).toContain("Onion");
    });

    it("should reject non-farmer users with 403 Forbidden", async () => {
      const response = await request(app)
        .get("/api/v1/farmer/profile")
        .set("Authorization", `Bearer ${mandiToken}`);

      expect(response.status).toBe(403);
    });

    it("should reject unauthenticated requests with 401 Unauthorized", async () => {
      const response = await request(app).get("/api/v1/farmer/profile");

      expect(response.status).toBe(401);
    });
  });

  describe("PUT /api/v1/farmer/profile", () => {
    it("should update farmer name, address with pincode, and crops", async () => {
      const existingUser = {
        id: farmerUserId,
        name: "Old Name",
        email: "farmer@example.com",
        phone: "9876543210",
        role: Role.FARMER,
        isVerified: true,
      };

      const updatedUser = {
        id: farmerUserId,
        name: "Ramesh Jagtap",
        email: "farmer@example.com",
        phone: "9876543210",
        role: Role.FARMER,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProfile = {
        id: "fp-123",
        userId: farmerUserId,
        addressLine1: "Plot 10, Kisan Nagar",
        addressLine2: "Post Road",
        village: "Lasalgaon",
        taluka: "Niphad",
        district: "Nashik",
        state: "Maharashtra",
        pincode: "422306",
        landSizeAcres: 6.0,
        mainCrops: ["Onion", "Tomato", "Soybean"],
        secondaryCrops: ["Gram"],
        irrigationType: "Drip Irrigation",
        farmLocation: "Farm Gate 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.$transaction).mockResolvedValue([updatedUser, updatedProfile] as any);
      vi.mocked(prisma.farmerProfile.findUnique).mockResolvedValue(updatedProfile as any);

      const payload = {
        name: "Ramesh Jagtap",
        addressLine1: "Plot 10, Kisan Nagar",
        addressLine2: "Post Road",
        village: "Lasalgaon",
        taluka: "Niphad",
        district: "Nashik",
        state: "Maharashtra",
        pincode: "422306",
        landSizeAcres: 6.0,
        mainCrops: ["Onion", "Tomato", "Soybean"],
        secondaryCrops: ["Gram"],
        irrigationType: "Drip Irrigation",
        farmLocation: "Farm Gate 1",
      };

      const response = await request(app)
        .put("/api/v1/farmer/profile")
        .set("Authorization", `Bearer ${farmerToken}`)
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Ramesh Jagtap");
      expect(response.body.data.farmerProfile.pincode).toBe("422306");
      expect(response.body.data.farmerProfile.mainCrops).toEqual(["Onion", "Tomato", "Soybean"]);
    });

    it("should reject invalid pincode with validation error", async () => {
      const response = await request(app)
        .put("/api/v1/farmer/profile")
        .set("Authorization", `Bearer ${farmerToken}`)
        .send({
          pincode: "123", // invalid length
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_ERROR");
    });
  });
});
