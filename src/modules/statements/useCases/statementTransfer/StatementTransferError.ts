import { AppError } from "../../../../shared/errors/AppError";

export namespace StatementTransferError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class UserTransferNotFound extends AppError {
    constructor() {
      super('User transfer not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }
}
