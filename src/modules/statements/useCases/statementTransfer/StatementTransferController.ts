import { Response, Request } from "express";
import { container } from "tsyringe";

import {StatementTransferUseCase} from "./StatementTransferUseCase"

export class StatementTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {amount, description} = request.body;
    const {user_transfer_id} = request.params;
    const {id: user_id} = request.user;

    const statementTransferUseCase = container.resolve(StatementTransferUseCase)


    const transferStatement = await statementTransferUseCase.execute({
      user_id,
      amount,
      description,
      user_transfer_id
    })

    return response.json(transferStatement);
  }
}
