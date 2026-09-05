import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { generateAccessToken } from "../src/utils/jwt.js";
import { Role } from "@prisma/client";

// Mock ImageKit SDK
vi.mock("../src/lib/imagekit.js", () => {
  return {
    getImageKitClient: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({
        fileId: "file_ik_12345",
        name: "test_avatar.jpg",
        url: "https://ik.imagekit.io/frbjdpcvl/farmer_avatars/test_avatar.jpg",
        thumbnailUrl: "https://ik.imagekit.io/frbjdpcvl/tr:n-media_library_thumbnail/farmer_avatars/test_avatar.jpg",
        height: 600,
        width: 600,
        size: 45000,
        filePath: "/farmer_avatars/test_avatar.jpg",
        fileType: "image",
      }),
      getAuthenticationParameters: vi.fn(() => ({
        token: "test_token_abc123",
        expire: 1725550000,
        signature: "test_signature_xyz789",
      })),
      deleteFile: vi.fn().mockResolvedValue({}),
    })),
  };
});

describe("ImageKit Upload Module Suite (/api/v1/upload/*)", () => {
  const farmerUserId = "farmer-user-123";
  const farmerToken = generateAccessToken({
    userId: farmerUserId,
    email: "farmer@example.com",
    role: Role.FARMER,
    isVerified: true,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/upload/auth", () => {
    it("should return ImageKit client-side auth parameters", async () => {
      const response = await request(app).get("/api/v1/upload/auth");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe("test_token_abc123");
      expect(response.body.data.signature).toBe("test_signature_xyz789");
      expect(response.body.data.publicKey).toBeDefined();
      expect(response.body.data.urlEndpoint).toContain("imagekit.io");
    });
  });

  describe("POST /api/v1/upload/image", () => {
    it("should reject unauthenticated upload requests with 401", async () => {
      const response = await request(app)
        .post("/api/v1/upload/image")
        .send({ file: "data:image/jpeg;base64,abc123==" });

      expect(response.status).toBe(401);
    });

    it("should upload base64 image data to designated folder", async () => {
      const response = await request(app)
        .post("/api/v1/upload/image")
        .set("Authorization", `Bearer ${farmerToken}`)
        .send({
          file: "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          fileName: "farmer_profile.png",
          folder: "farmer_avatars",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.url).toContain("https://ik.imagekit.io/frbjdpcvl/farmer_avatars/");
      expect(response.body.data.fileId).toBe("file_ik_12345");
    });

    it("should reject upload if no file is provided", async () => {
      const response = await request(app)
        .post("/api/v1/upload/image")
        .set("Authorization", `Bearer ${farmerToken}`)
        .send({ folder: "farmer_avatars" });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("NO_FILE_PROVIDED");
    });
  });

  describe("DELETE /api/v1/upload/image/:fileId", () => {
    it("should delete image from ImageKit", async () => {
      const response = await request(app)
        .delete("/api/v1/upload/image/file_ik_12345")
        .set("Authorization", `Bearer ${farmerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
