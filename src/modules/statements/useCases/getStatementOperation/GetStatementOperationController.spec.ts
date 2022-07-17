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

  it("Should be able to view a user statement operation", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@email.com",
      password: "teste"
    });

    const {token} = responseToken.body

    const statementResponse = await request(app).post("/api/v1/statements/deposit").send({
      amount: 30,
	    description: "Compras"
    }).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).get(`/api/v1/statements/${statementResponse.body.id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});

