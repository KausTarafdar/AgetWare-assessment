import Database from "better-sqlite3"
import { config } from "../config/config";

const DB = new Database('bank.db')

interface IAccountInfo {
    username: string,
    account_id: string,
}

interface ILoanInfo{
    loan_id: string,
    cust_id?: string,
    loan_amount?: number,
    loan_period?: number,
    rate?: number,
    payable: number,
}

interface ITransaction {
    tran_id: string,
    cust_id: string,
    loan_id: string,
    amount_paid: number,
    payment_type: string
}

export class BankRepository {
    public async addAccount(customer: IAccountInfo){
        try {
            const query = DB.prepare(`INSERT INTO account(id, customer_name)
                                    VALUES('${customer.account_id}', '${customer.username}')`);
            const transaction = DB.transaction(() => {
                const info = query.run();
                console.log(`Added transaction: ${info.changes}`)
            })
            transaction()
        } catch (err) {
            if(err) {
                console.log(err)
            }
            throw new Error('DB transaction error')
        }
    }

    public async addLoan(loan: ILoanInfo) {
        try {
            const query = DB.prepare(`INSERT INTO loan(id, customer_id, loan_amount, loan_period, rate, payable)
                                    VALUES('${loan.loan_id}','${loan.cust_id}',${loan.loan_amount},${loan.loan_period},${loan.loan_period}, ${loan.rate}, ${loan.payable})`);
            const transaction = DB.transaction(() => {
                const info = query.run();
                console.log(`Added transaction: ${info.changes}`)
            })
            transaction()
        } catch (err) {
            if(err) {
                console.log(err)
            }
            throw new Error('DB transaction error')
        }
    }

    public async updateLoan(loan: ILoanInfo) {
        try {
            const query = DB.prepare(`UPDATE loan
                                    SET update_at=CURRENT_TIMESTAMP,
                                    payable=${loan.payable}
                                    WHERE id=${loan.loan_id}`);
            const transaction = DB.transaction(() => {
                const info = query.run();
                console.log(`Added transaction: ${info.changes}`)
            })
            transaction()
        } catch (err) {
            if(err) {
                console.log(err)
            }
            throw new Error('DB transaction error')
        }
    }

    public appendTransaction(trans: ITransaction) {
        try {
            const query = DB.prepare(`INSERT INTO ledger(id, cust_id, loan_id, amount_paid, payment_type)
                                    VALUES('${trans.tran_id}', '${trans.cust_id}', '${trans.loan_id}', ${trans.amount_paid}, '${trans.payment_type}')`);
            const transaction = DB.transaction(() => {
                const info = query.run();
                console.log(`Added transaction: ${info.changes}`)
            })
            transaction()
        } catch (err) {
            if(err) {
                console.log(err)
            }
            throw new Error('DB transaction error')
        }
    }
}