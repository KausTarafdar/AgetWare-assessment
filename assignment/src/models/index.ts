import Database, { Transaction } from "better-sqlite3"
import { isLoan, isLoanArray, isTransactionArray } from "../utils/typeguard";

const DB = new Database('bank.db')

export interface IAccountInfo {
    username: string,
    account_id: string,
}

export interface ILoanInfo{
    loan_id: string,
    cust_id?: string,
    loan_amount?: number,
    loan_period?: number,
    rate?: number,
    payable: number,
    created_at?: Date,
    updated_at?: Date
}

export interface ITransactionInfo {
    tran_id?: string,
    cust_id: string,
    loan_id: string,
    amount_paid?: number,
    payment_type?: string
}

export class BankRepository {
    public addAccount(customer: IAccountInfo){
        try {
            const query = DB.prepare(`INSERT INTO account(id, customer_name)
                                    VALUES('${customer.account_id}', '${customer.username}')`);
            const transaction = DB.transaction(() => {
                const info = query.run();
                console.log(`Added transaction: ${info.changes}`)
            })
            transaction()
        } catch (err) {
            console.error(err)
            throw new Error('DB transaction error')
        }
    }

    public async getLoan(loan_id: string){
        try {
            const result = await DB.prepare(`SELECT * FROM loan
                                            where id = '${loan_id}'`).get();
            if (isLoan(result)) {
                return result
            }
            else {
                throw new Error("No value returned");
            }
        } catch (err) {
            console.error(err)
            throw new Error("DB transaction error");
        }
    }

    public addLoan(loan: ILoanInfo) {
        try {
            const query = DB.prepare(`INSERT INTO loan(id, customer_id, loan_amount, loan_period, rate, payable)
                                    VALUES('${loan.loan_id}','${loan.cust_id}',${loan.loan_amount},${loan.loan_period}, ${loan.rate}, ${loan.payable})`);
            const transaction = DB.transaction(() => {
                const info = query.run();
                console.log(`Added transaction: ${info.changes}`)
            })
            transaction()
        } catch (err) {
            console.error(err)
            throw new Error('DB transaction error')
        }
    }

    public updateLoan(loan: ILoanInfo) {
        try {
            console.log(loan.payable, loan.loan_id)
            const query = DB.prepare(`UPDATE loan
                                    SET updated_at=CURRENT_TIMESTAMP,
                                    payable=${loan.payable}
                                    WHERE id='${loan.loan_id}'`);
            const transaction = DB.transaction(() => {
                const info = query.run();
                console.log(`Added transaction: ${info.changes}`)
            })
            transaction()
        } catch (err) {
            console.error(err)
            throw new Error('DB transaction error')
        }
    }

    public getTransactions(trans: ITransactionInfo): ITransactionInfo[] {
        try {
            const result = DB.prepare(`SELECT * FROM ledger
                                        where cust_id = '${trans.cust_id}'
                                        AND loan_id = '${trans.loan_id}'`).all();
            if (isTransactionArray(result)) {
                return result
            }
            else {
                throw new Error("No value returned");
            }
        } catch (err) {
            console.error(err)
            throw new Error("DB transaction error");
        }
    }

    public appendTransaction(trans: ITransactionInfo) {
        try {
            const query = DB.prepare(`INSERT INTO ledger(id, cust_id, loan_id, amount_paid, payment_type)
                                    VALUES('${trans.tran_id}', '${trans.cust_id}', '${trans.loan_id}', ${trans.amount_paid}, '${trans.payment_type}')`);
            const transaction = DB.transaction(() => {
                const info = query.run();
                console.log(`Added transaction: ${info.changes}`)
            })
            transaction()
        } catch (err) {
            console.error(err)
            throw new Error('DB transaction error')
        }
    }

    public getOverview(user_id: string) {
        try {
            const result = DB.prepare(`SELECT * FROM loan
                                    WHERE customer_id = '${user_id}'`).all()
            console.log(result)
            if(isLoanArray(result)) {
                return result
            }
            else {
                throw new Error("No value returned");

            }
        } catch (err) {
            console.error(err)
            throw new Error("DB transaction error");
        }
    }
}