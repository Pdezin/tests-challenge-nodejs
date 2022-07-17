import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

describe("Create user", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })
  it("Should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "Sophie West",
      email: "vila@inafsuz.il",
      password: "test"
    }

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty("id");
  })

  it("Should not be able to create user if already exists", async () => {
    const user: ICreateUserDTO = {
      name: "Sophie West",
      email: "vila@inafsuz.il",
      password: "test"
    }

    await createUserUseCase.execute(user);

    await expect(createUserUseCase.execute(user)).rejects.toBeInstanceOf(CreateUserError);
  })
})
