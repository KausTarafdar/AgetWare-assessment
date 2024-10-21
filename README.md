# AgetWare-assessment
This is a repository to store assessment for AgetWare Backend Web Developer Internship

- `/assingment` - API in response to [assignment.md](assignment/assignments.md)
- `problem` - Answers for the questions provided in [problems.md](problems/problems.md)


### API Documentation
All routes are start with /api

- `POST /user/account` To register user
```JSON
Request :
{
    "username": "KayTee"
}

Response :
{
    "status": "success",
    "message": "New user created",
    "data": {
        "id": "bfae9ccb-5072-44d8-9095-440ecc068f46",
        "username": "KayTee",
        "created": "2024-10-21T18:59:17.715Z"
    }
}
```

- `POST /bank/loan` - To create/lend a loan for a user
```JSON
Request :
{
    "userId": "bfae9ccb-5072-44d8-9095-440ecc068f46",
    "loanAmount": 100000,
    "period": 5, //In years
    "interest": 12 //In percentage
}

Response :
{
    "status": "success",
    "message": "New loan successfully alloted",
    "data": {
        "cust_id": "bfae9ccb-5072-44d8-9095-440ecc068f46",
        "total": 160000,
        "id": "ed9113a6-e858-4d82-abca-2f4b38f4885d",
        "emi": 2666.6666666666665,
        "date": "2024-10-21T19:00:11.802Z"
    }
}
```

- `POST /bank/payment` - To create a payment order for a **Loan**
```JSON
//For Emi Payment
Request :
{
    "userId": "bfae9ccb-5072-44d8-9095-440ecc068f46",
    "loanId": "ed9113a6-e858-4d82-abca-2f4b38f4885d",
    "type": "EMI"
}
Response :
{
    "status": "success",
    "message": "Payment successfully made",
    "data": {
        "paid": 2666.6666666666665,
        "date": "2024-10-21T19:03:01.208Z",
        "type": "emi",
        "amountLeftToPay": 157333.33333333334,
        "durationleftInMonths": 60
    }
}

//For Lump Sum payment
Request :
{
    "userId": "bfae9ccb-5072-44d8-9095-440ecc068f46",
    "loanId": "ed9113a6-e858-4d82-abca-2f4b38f4885d",
    "amount": 25000,
    "type": "lump_sum"
}

Response :
{
    "status": "success",
    "message": "Payment successfully made",
    "data": {
        "paid": 25000,
        "date": "2024-10-21T19:05:02.918Z",
        "type": "lump_sum",
        "newEmi": 2666.6666666666665,
        "numberOfEmis": 49.62500000000001,
        "amountLeftToPay": 132333.33333333334,
        "durationleftInMonths": 60
    }
}
```

- `GET /user/:userId/loans` - To get the loans for a **User Id**
```JSON
{
    "status": "success",
    "message": "Retrieved all loans",
    "data": [
        {
            "loan_amount": 100000,
            "total_amount": 160000,
            "total_interest": 60000,
            "emi": 2666.6666666666665,
            "paid": 27666.666666666657,
            "emis_left": 49.62500000000001
        }
    ]
}
```

- `GET /user/:userId/:loanId/legder` - To get the transactions on a loan for **Loan Id** and **User Id**
```JSON
{
    "status": "success",
    "message": "Retrieved ledger for loan",
    "data": {
        "userId": "bfae9ccb-5072-44d8-9095-440ecc068f46",
        "loanId": "ed9113a6-e858-4d82-abca-2f4b38f4885d",
        "ledger": [
            {
                "id": "c6dbbc90-738d-4b3d-b3de-3a9a490f1cac",
                "cust_id": "bfae9ccb-5072-44d8-9095-440ecc068f46",
                "loan_id": "ed9113a6-e858-4d82-abca-2f4b38f4885d",
                "amount_paid": 2666.6666666666665,
                "payment_type": "emi",
                "created_at": "2024-10-21 19:03:01"
            },
            {
                "id": "6afd68f5-582f-463e-a744-5b74b2f7df91",
                "cust_id": "bfae9ccb-5072-44d8-9095-440ecc068f46",
                "loan_id": "ed9113a6-e858-4d82-abca-2f4b38f4885d",
                "amount_paid": 25000,
                "payment_type": "lump_sum",
                "created_at": "2024-10-21 19:05:02"
            }
        ]
    }
}
```


### Installation

To run the API, follow the steps to start the project

1. Run the following in the `/assignment` directory:-
```bash
npm i
```

2. To set up the Database, use the following command:-
```bash
npm run migrate:reset
```

3. The app can be run in **development** with the following command
```bash
npm run start:dev
```

For **production** mode, run the following command
```bash
npm run start:prod
```
The app runs by default at `http://localhost:8000`