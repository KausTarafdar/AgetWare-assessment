import { Request, Response} from "express";

import { config } from "../../config/config";
import { BankRepository } from "../../models";
import { Banking_services } from "../../services/banking_services";

const bankRepository: BankRepository = new BankRepository();
const banking_services: Banking_services = new Banking_services(bankRepository);

export async function handleNewUser(req: Request, res: Response) {
    try {
        const { username } = req.body

        if(!username) {
            res.status(400).json({
                status: config.ERROR,
                message: "No username provided",
                data: {}
            })
            return
        }

        const createNewUser = await banking_services.addCustomer(username);

        res.status(200).json({
            status: config.SUCCESS,
            message: 'New user created',
            data: createNewUser
        })
        return

    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: config.ERROR,
            message: "Something went wrong",
            data: {}
        })
        return
    }

}

export function handleGetLoans(req: Request, res: Response) {
    try {
        const { userId } = req.params

        if(!userId) {
            res.status(400).json({
                status: config.ERROR,
                message: "No user ID provided",
                data: {}
            })
            return
        }

        const getLoans = banking_services.account_overview(userId);

        res.status(200).json({
            status: config.SUCCESS,
            message: 'Retrieved all loans',
            data: getLoans
        })
        return

    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: config.ERROR,
            message: "Something went wrong",
            data: {}
        })
        return
    }
}

export function handleGetLedger(req: Request, res: Response) {
    try {
        const { userId, loanId } = req.params

        if(!userId || !loanId) {
            res.status(400).json({
                status: config.ERROR,
                message: "No user Id or loan Id provided",
                data: {}
            })
            return
        }

        const getLedger = banking_services.ledger(userId, loanId);

        res.status(200).json({
            status: config.SUCCESS,
            message: 'Retrieved ledger for loan',
            data: getLedger
        })
        return

    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: config.ERROR,
            message: "Something went wrong",
            data: {}
        })
        return
    }
}