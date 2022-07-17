import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { StatementTransferError } from "./StatementTransferError";
import { IStatementTransferDTO } from "./IStatementTransferDTO";

@injectable()
export class StatementTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({user_id, amount, description, user_transfer_id}: IStatementTransferDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new StatementTransferError.UserNotFound();
    }

    const userTransfer = await this.usersRepository.findById(user_transfer_id);

    if(!userTransfer) {
      throw new StatementTransferError.UserTransferNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    if (balance < amount) {
      throw new StatementTransferError.InsufficientFunds()
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    await this.statementsRepository.create({
      user_id: user_transfer_id,
      type: OperationType.DEPOSIT,
      amount,
      description: "Transferência de " + user.name
    });

    return statementOperation;
  }
}
