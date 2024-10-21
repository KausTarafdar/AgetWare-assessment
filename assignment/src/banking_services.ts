import { randomUUID } from "crypto"
import { config } from "./config/config"
import { BankRepository } from "./models"
import { getMonthsLeft } from "./utils/getMonthLeft"

interface ICustomer {
    id: string,
    username: string,
    created: Date
}

interface ILend {
    cust_id: string
    total: number,
    id: string,
    emi: number,
    date: Date
}

interface IPayment {
    paid: number,
    type: string,
    date: Date,
    amountLeftToPay: number,
    newEmi?: number,
    numberOfEmis?: number,
    durationleft: number
}

interface ILoan {
    id: string,
    loan_amount: number,
    total_interest: number,
    total_amount: number,
    emi: number,
    paid: number,
    emis_left: number
}

export class Banking_services {
    private bankRepository
    constructor(bankrepository: BankRepository){
        this.bankRepository = bankrepository
    }

    public async addCustomer(customer_name: string): Promise<ICustomer> {
        const customer_id = randomUUID().toString();
        await this.bankRepository.addAccount({
            username: customer_name,
            account_id: customer_id
        })

        return {
            id: customer_id,
            username: customer_name,
            created: new Date()
        }
    }

    private caculateEmi(total_amount: number, period: number) {
        return (total_amount) / (period * 12)
    }

    //Function operations ==>
    // loan_amount = 30000 (rs)
    // time = 2 (yrs)
    //interest = 5 (%) / 100 = 0.05
    //total amount = 30000 + (30000 * 2 * 0.05) = 33000
    public lend(cust_id: string, loan_amount: number, period: number, interest: number): ILend {
        const loan_id = randomUUID().toString();
        const total_amount = loan_amount + (loan_amount * period * (interest / 100))
        const emi = (total_amount) / (period * 12)
        this.bankRepository.addLoan({
            loan_id: loan_id,
            cust_id: cust_id,
            loan_amount: loan_amount,
            loan_period: period,
            rate: interest,
            payable: total_amount
        })
        return {
            cust_id: cust_id,
            total: total_amount,
            id: loan_id,
            emi: emi,
            date: new Date()
        }
    }

    public async payment(cust_id: string, loan_id: string, amount: number, type: string): Promise<IPayment> {
        const transaction_id = randomUUID().toString();
        let loan = await this.bankRepository.getLoan(loan_id);

        if (type === config.EMI) {
            //get the loan from db and calculate emi
            //deduct emi
            // @ts-ignore
            const total_amount = loan.loan_amount + (loan.loan_amount * loan.loan_period * (loan.rate / 100));
            // @ts-ignore
            const standard_emi = this.caculateEmi(total_amount, loan.loan_period)
            loan.payable = loan.payable - standard_emi
            //update loan remaining
            this.bankRepository.updateLoan({
                loan_id: loan_id,
                payable: loan.payable
            })
            //add to ledger
            this.bankRepository.appendTransaction({
                tran_id: transaction_id,
                cust_id: cust_id,
                loan_id: loan_id,
                amount_paid: standard_emi,
                payment_type: config.EMI
            })

            return {
                paid: standard_emi,
                date: new Date(),
                type: config.EMI,
                amountLeftToPay: loan.payable,
                durationleft: getMonthsLeft(loan.created_at!, loan.loan_period!, new Date()) / 12
            }
        }
        if (type === config.LUMP_SUM) {
            //deduct
            loan.payable = loan.payable - amount
            //get no of months left
            //@ts-ignore
            const monthsLeft = getMonthsLeft(loan.created_at, loan.loan_period, new Date());
            //recalculate the emi
            // @ts-ignore
            const total_amount = loan.loan_amount + (loan.loan_amount * loan.loan_period * (loan.rate / 100));
            const new_emi = this.caculateEmi(total_amount, monthsLeft / 12)
            this.bankRepository.updateLoan({
                loan_id: loan_id,
                payable: loan.payable
            })
            this.bankRepository.appendTransaction({
                tran_id: transaction_id,
                cust_id: cust_id,
                loan_id: loan_id,
                amount_paid: amount,
                payment_type: config.LUMP_SUM,
            })
            return {
                paid: amount,
                date: new Date(),
                type: config.LUMP_SUM,
                newEmi: new_emi,
                numberOfEmis: loan.payable / new_emi,
                amountLeftToPay: loan.payable,
                durationleft: monthsLeft / 12
            }
        }

        else {
            throw new Error("Check transaction type");
        }
    }

    public ledger(cust_id: string, loan_id: string) {
        //return all transactions
        const transactions = this.bankRepository.getTransactions({
            cust_id: cust_id,
            loan_id: loan_id
        })

        return transactions
    }

    public account_overview(cust_id: string): ILoan[]{
        //return all loans for a account id
        const loans = this.bankRepository.getOverview(cust_id);
        const loanInfo: ILoan[] = []

        loans.forEach((loan) => {
            let total_amount = loan.loan_amount! + (loan.loan_amount! * loan.loan_period! * (loan.rate! / 100));
            let emi = this.caculateEmi(total_amount, loan.loan_period!);
            let total_interest = total_amount - loan.loan_amount!;
            let paid = total_amount - loan.payable;
            let emis_left = loan.payable / emi;

            loanInfo.push({
                id: loan.loan_id,
                loan_amount: loan.loan_amount!,
                total_amount: total_amount,
                total_interest: total_interest,
                emi: emi,
                paid: paid,
                emis_left: emis_left
            })
        })

        return loanInfo
    }
}