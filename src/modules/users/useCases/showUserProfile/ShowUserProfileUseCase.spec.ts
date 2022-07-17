import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("User profile", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show user profile", async () => {

    const user = await createUserUseCase.execute({
      email: "fafug@di.sh",
      name: "Miguel Hubbard",
      password: "test"
    });

    const result = await showUserProfileUseCase.execute(user.id ?? "");

    expect(result).toHaveProperty("id");
  });

  it("Should not be able to show user profile if user is not exists", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("test")
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
