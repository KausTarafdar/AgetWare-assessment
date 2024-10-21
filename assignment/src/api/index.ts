import { Router } from "express";
import { handleGetLedger, handleGetLoans, handleNewUser } from "./controllers/user";
import { handleLending, handlePayment } from "./controllers/bank";

const apiRouter = Router()

apiRouter.post('/user/account', handleNewUser);
apiRouter.get('/user/:userId/loans', handleGetLoans);
apiRouter.get('/user/:userId/:loanId/ledger', handleGetLedger)

apiRouter.post('/bank/loan', handleLending);
apiRouter.post('/bank/payment', handlePayment);

export default apiRouter