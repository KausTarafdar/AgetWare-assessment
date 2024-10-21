import dotenv from 'dotenv'

dotenv.config()

export const config = {
    PORT: process.env.PORT || '8000' ,
    DB: process.env.DB!,
    LUMP_SUM: 'lump_sum',
    EMI: 'emi',
    SUCCESS: 'success',
    ERROR: 'error'
}