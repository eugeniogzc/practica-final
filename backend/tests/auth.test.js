const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());

app.set("sql", {
  request: () => ({
    input: () => ({
      query: () => ({
        recordset: [], // Simula usuario no encontrado
      }),
    }),
  }),
});

const authRoutes = require("../routes/authRoutes");
app.use("/api", authRoutes);

describe("POST /api/login", () => {
  it("debería fallar si el usuario no existe", async () => {
    const res = await request(app).post("/api/login").send({
      correo: "noexiste@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.mensaje).toBe("Usuario no encontrado");
  });
});
