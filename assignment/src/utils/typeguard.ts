import { ILoanInfo, ITransactionInfo } from "../models";

export function isLoan(loan: any): loan is ILoanInfo{
    return (loan.id !== undefined);
}

export function isLoanArray(loanArray: any): loanArray is ILoanInfo[] {
    return isLoan(loanArray[0])
}

function isTransaction(trans: any): trans is ITransactionInfo{
    return (trans.id !== undefined)
}

export function isTransactionArray(transArray: any): transArray is ITransactionInfo[] {
    return isTransaction(transArray[0])
}