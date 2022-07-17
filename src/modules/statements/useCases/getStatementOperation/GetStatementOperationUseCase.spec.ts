import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe("User Statement Operation", () => {
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;
  let createUserUseCase: CreateUserUseCase
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("Should be able to view a user statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "Herman Stephens",
      email: "tun@oniefono.il",
      password: "test"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id ?? "",
      amount: 1000,
      description: "test",
      type: OperationType.DEPOSIT
    });

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id ?? "",
      statement_id: statement.id ?? ""
    });

    expect(result).toHaveProperty("id");
  })

  it("Should not be able to view statement operation if user is not exists", async () => {
    const user = await createUserUseCase.execute({
      name: "Herman Stephens",
      email: "tun@oniefono.il",
      password: "test"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id ?? "",
      amount: 1000,
      description: "test",
      type: OperationType.DEPOSIT
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "invalid_user_id",
        statement_id: statement.id ?? ""
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it("Should not be able to view statement operation if not exists", async () => {
    const user = await createUserUseCase.execute({
      name: "Herman Stephens",
      email: "tun@oniefono.il",
      password: "test"
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id ?? "",
        statement_id: "invalid_statement_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
})
