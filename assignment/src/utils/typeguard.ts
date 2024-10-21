import { ILoanInfo } from "../models";

export function isLoan(loan: any): loan is ILoanInfo{
    return (loan as ILoanInfo).loan_id !== undefined;
}
