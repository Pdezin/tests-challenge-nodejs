import { app } from "../../../../app"
import request from "supertest";
import { v4 as uuid} from "uuid";

import createConnection from "../../../../database"
import { Connection } from "typeorm";
import { hash } from "bcryptjs";

describe("Create user", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const passwordHash = await hash("teste", 8);

    await connection.query(`INSERT INTO users(id, name, email, password, created_at, updated_at) values ('${id}', 'teste', 'teste@email.com', '${passwordHash}', 'now()', 'now()')`)
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Henry Armstrong",
      email: "cittu@fa.ni",
      password: "123456"
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create user if already exists", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Henry Armstrong",
      email: "cittu@fa.ni",
      password: "123456"
    });

    expect(response.status).toBe(400);
  });
});

