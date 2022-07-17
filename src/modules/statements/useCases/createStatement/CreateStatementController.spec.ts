import { app } from "../../../../app"
import request from "supertest";
import { v4 as uuid} from "uuid";

import createConnection from "../../../../database"
import { Connection } from "typeorm";
import { hash } from "bcryptjs";

describe("Create statement controller", () => {
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

  it("Should be able to create a new statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@email.com",
      password: "teste"
    });

    const {token} = responseToken.body

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "teste"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
});

