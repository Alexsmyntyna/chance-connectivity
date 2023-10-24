const request = require("supertest");
const app = require("../server"); 
const User = require("../models/userModel");

describe("POST /api/user/signup", () => {
    it("should signup with tests data", async () => {
        const response = await request(app)
            .post("/api/user/signup")
            .send({
                    firstName: "TestFirst",
                    lastName: "TestLast",
                    role: "leader",
                    email: "admintestemail1029385@admin.com",
                    password: "Temppass12!"
                });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("email", "admintestemail1029385@admin.com");
        expect(response.body).toHaveProperty("token");
    });
});

describe("POST /api/user/login", () => {
  it("should login with admin user", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: "admintestemail1029385@admin.com",
        password: "Temppass12!",
      });
    
    await User.deleteOne({ email: "admintestemail1029385@admin.com" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email", "admintestemail1029385@admin.com");
    expect(response.body).toHaveProperty("token");
  });
});


