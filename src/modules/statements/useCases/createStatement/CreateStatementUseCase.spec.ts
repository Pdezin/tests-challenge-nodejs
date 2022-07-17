import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import {CreateStatementError} from "../../useCases/createStatement/CreateStatementError"

describe("Create Statement", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Lelia Cross",
      email: "mezzagcor@aba.rs",
      password: "test"
    })

    const result = await createStatementUseCase.execute({
      user_id: user.id ?? "",
      amount: 1000,
      description: "test",
      type: OperationType.DEPOSIT
    });

    expect(result).toHaveProperty("id")
  });

  it("Should not be able to create statement if user is not exists", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "test",
        amount: 1000,
        description: "test",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("Should not be able to withdraw an amount greater than the current balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Lelia Cross",
      email: "mezzagcor@aba.rs",
      password: "test"
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id ?? "",
        amount: 2000,
        description: "Withdraw 2000",
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
