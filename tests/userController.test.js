const request = require("supertest");
const app = require("../server"); 
const User = require("../models/userModel");

const generateRandomString = (length = 6) => {
    return Math.random().toString(20).substr(2, length);
}

describe("POST /api/user/signup", () => {
    it("should signup with tests data", async () => {
        genString = generateRandomString();
        const email = genString + "admin@admin.com";
        const response = await request(app)
            .post("/api/user/signup")
            .send({
                    firstName: "TestFirst",
                    lastName: "TestLast",
                    role: "leader",
                    email,
                    password: "Temppass12!",
                    city: "CityTest",
                    age: 18,
                    sex: "male",
                });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("email", email);
        expect(response.body).toHaveProperty("token");
    });
});

describe("POST /api/user/login", () => {
    it("should login with admin user", async () => {
        const email = genString + "admin@admin.com";
        const response = await request(app)
          .post("/api/user/login")
          .send({
            email,
            password: "Temppass12!",
        });
        
        await User.deleteOne({ email });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("email", email);
        expect(response.body).toHaveProperty("token");
    });
});


