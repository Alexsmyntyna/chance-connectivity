const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const User = require("../models/userModel");
const Event = require("../models/eventModel");

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

describe("POST /api/event/create", () => {
    it("should create new event", async () => {
        const response = await request(app)
            .post("/api/event/create")
            .set("Authorization", "Bearer " + token)
            .send({
                event_name: "TestEvent",
                country: "TestCountry",
                start_date: "2023-10-01T17:00:00.000+00:00",
                end_date: "2023-10-01T19:00:00.000+00:00"
            });
        event_id = response.body._id;

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("event_name", "TestEvent");
        expect(response.body).toHaveProperty("country", "TestCountry");
        expect(response.body).toHaveProperty("user_id", user_id);
    });
});

describe("GET /api/event/event_id", () => {
    it("should get single event", async () => {
        const response = await request(app)
            .get("/api/event/" + event_id)
            .set("Authorization", "Bearer " + token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("event_name", "TestEvent");
        expect(response.body).toHaveProperty("country", "TestCountry");
        expect(response.body).toHaveProperty("user_id", user_id);
    });
});

describe("GET /api/event/", () => {
    it("should get all events", async () => {
        const response = await request(app)
            .get("/api/event/")
            .set("Authorization", "Bearer " + token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("events");
        expect(response.body.events).toHaveLength(1);
    });
});

describe("PATCH /api/event/update/event_id", () => {
    it("should update event", async () => {
        const response = await request(app)
            .patch("/api/event/update/" + event_id)
            .set("Authorization", "Bearer " + token)
            .send({
                event_name: "TestEvent1",
                country: "TestCountry1",
                start_date: "2023-11-01T17:00:00.000+00:00",
                end_date: "2023-11-01T19:00:00.000+00:00",
                description: "testDescription",
                capacity: 200,
                ticket_start_sale_date: "2023-11-01T17:00:00.000+00:00",
                ticket_end_sale_date: "2023-11-01T19:00:00.000+00:00",
                ticket_price: 100,
                ticket_currency: "usdollar",
                age_min: 18,
                age_max: 40
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("event_name", "TestEvent1");
        expect(response.body).toHaveProperty("country", "TestCountry1");
        expect(response.body).toHaveProperty("description", "testDescription");
        expect(response.body).toHaveProperty("capacity", 200);
        expect(response.body).toHaveProperty("ticket_price", 100);
        expect(response.body).toHaveProperty("ticket_currency", "usdollar");
        expect(response.body).toHaveProperty("age_min", 18);
        expect(response.body).toHaveProperty("age_max", 40);
        expect(response.body).toHaveProperty("user_id", user_id);
    });
});

afterAll(async () => {
    await User.deleteOne({ email });
    await Event.deleteOne({ _id: event_id });
});