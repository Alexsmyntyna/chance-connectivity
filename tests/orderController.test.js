const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const getToken = async (email) => {
    const createTestUser = await User.signup("TestFirst", "TestLast", "leader", "CityTest", 18, "male", email, "Temppass12!");
    global.user_id = createTestUser._id.toString();
    return createToken(user_id);
}

const generateRandomString = (length = 6) => {
    return Math.random().toString(20).substr(2, length);
}

global.email = generateRandomString() + "admin@admin.com";
global.token = await getToken(email);
global.event_id = null;

describe("POST /api/order/create", () => {
    it("should create new order", async () => {
        const response = await request(app)
            .post("/api/order/create")
            .set("Authorization", "Bearer " + token)
            .send({
                order_name: "Latte",
                amount: 200
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("user_id", user_id);
        expect(response.body).toHaveProperty("first_name", "TestFirst");
        expect(response.body).toHaveProperty("last_name", "TestLast");
        expect(response.body).toHaveProperty("order_name", "Latte");
        expect(response.body).toHaveProperty("is_complete", false);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("status_payment", "pending");
        expect(response.body).toHaveProperty("stripe_id", "");
        expect(response.body).toHaveProperty("client_secret");
        expect(response.body).toHaveProperty("createdAt");
        expect(response.body).toHaveProperty("updatedAt");
        global.order_id = response.body._id;
    });
});

describe("GET /api/order", () => {
    it("should get list of orders", async () => {
        const response = await request(app)
            .get("/api/order")
            .set("Authorization", "Bearer " + token);

        expect(response.status).toBe(200);
    });
});

describe("POST /api/order/complete/{id}", () => {
    it("should complete orders", async () => {
        const response = await request(app)
            .post("/api/order/complete/" + order_id)
            .set("Authorization", "Bearer " + token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("mssg");
    });
});

afterAll(async () => {
    await User.deleteOne({ _id: user_id });
    await Order.deleteOne({ _id: order_id });
});