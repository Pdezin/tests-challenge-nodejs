import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository"
import {CreateStatementError} from "../../useCases/createStatement/CreateStatementError"
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("User balance", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("Should be able to view user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Lelia Cross",
      email: "mezzagcor@aba.rs",
      password: "test"
    })

    const result = await getBalanceUseCase.execute({
      user_id: user.id ?? "",
    });

    expect(result).toHaveProperty("balance")
  });

  it("Should not be able to view a balance if user is not exists", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "test",
      });
    }).rejects.toBeInstanceOf(GetBalanceError)
  });
});
