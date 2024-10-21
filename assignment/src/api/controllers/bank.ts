import { Request, Response } from "express";

import { config } from "../../config/config";
import { BankRepository } from "../../models";
import { Banking_services } from "../../services/banking_services";

const bankRepository: BankRepository = new BankRepository();
const banking_services: Banking_services = new Banking_services(bankRepository);

export function handleLending(req: Request, res: Response) {
    try {
        const { userId, loanAmount, period, interest } = req.body

        if(
            !userId ||
            !loanAmount ||
            !period ||
            !interest
        ) {
            res.status(400).json({
                status: config.ERROR,
                message: "Request body incorrect",
                data: {}
            })
            return
        }

        const getNewLoan = banking_services.lend(userId, loanAmount, period, interest);

        res.status(200).json({
            status: config.SUCCESS,
            message: 'New user created',
            data: getNewLoan
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

export function handlePayment(req: Request, res: Response) {
    try {
        const { userId, loanId, amount, type } = req.body

        if(
            !userId ||
            !loanId ||
            !type
        ) {
            res.status(400).json({
                status: config.ERROR,
                message: "Request body incorrect",
                data: {}
            })
            return
        }

        if(
            type === config.LUMP_SUM && !amount
        ) {
            res.status(400).json({
                status: config.ERROR,
                message: "Specify amount for lumpsum payment",
                data: {}
            })
            return
        }

        const makePayment = banking_services.payment(userId, loanId, amount, type);

        res.status(200).json({
            status: config.SUCCESS,
            message: 'Payment successfully made',
            data: makePayment
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
