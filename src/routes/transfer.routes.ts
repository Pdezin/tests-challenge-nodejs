import { Router } from "express";
import { StatementTransferController } from "../modules/statements/useCases/statementTransfer/StatementTransferController";
import { ensureAuthenticated } from "../shared/infra/http/middlwares/ensureAuthenticated";

const transferRouter = Router();
const statementTransferController: StatementTransferController = new StatementTransferController();

transferRouter.use(ensureAuthenticated);
transferRouter.post("/:user_transfer_id", statementTransferController.handle);

export {transferRouter};
