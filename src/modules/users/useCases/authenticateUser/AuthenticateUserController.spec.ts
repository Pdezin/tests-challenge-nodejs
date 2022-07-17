import { app } from "../../../../app"
import request from "supertest";
import { v4 as uuid} from "uuid";

import createConnection from "../../../../database"
import { Connection } from "typeorm";
import { hash } from "bcryptjs";

describe("Authenticate User controller", () => {
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

  it("Should be able to authenticate an user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "teste@email.com",
      password: "teste"
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate an nonexistent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "1234"
    });

    expect(response.status).toBe(401);
  });

  it("Should not be able authenticate with incorrect password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "teste@email.com",
      password: "invalid_password"
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect email or password");
  });

});

