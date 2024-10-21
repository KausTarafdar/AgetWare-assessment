const sql3 = require('sqlite3').verbose()
const DB = new sql3.Database('./bank.db', sql3.OPEN_READWRITE, connected);

function connected(err) {
  if (err) {
    console.log(err);
    return;
  }
}

async function up(db) {
    await create_accounts_table(db);
    await create_loans_table(db);
    await create_ledger_table(db);
    db.close();
}

async function create_accounts_table(db) {
    let user_table_schema = `
        CREATE TABLE IF NOT EXISTS account(
        id char(15) NOT NULL UNIQUE PRIMARY KEY,
        customer_name VARCHAR NOT NULL,
        created_at DEFAULT CURRENT_TIMESTAMP
        )`;

    db.run(user_table_schema, [], (err) => {
        //callback function
        if (err) {
          console.log('Error creating account table', err.message);
          return;
        }
        console.log('Created account table', new Date());
      });
}

async function create_loans_table(db) {
    let note_table_schema = `
        CREATE TABLE IF NOT EXISTS loan(
        id CHAR(15) NOT NULL UNIQUE PRIMARY KEY,
        customer_id CHAR(15) NOT NULL,
        loan_amount INTEGER NOT NULL,
        loan_period INTEGER NOT NULL,
        rate INTEGER NOT NULL,
        payable INTEGER NOT NULL,
        created_at DEFAULT CURRENT_TIMESTAMP,
        updated_at DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES account(id)
    )`;

    db.run(note_table_schema, [], (err) => {
        //callback function
        if (err) {
          console.log('Error creating loan table', err.message);
          return;
        }
        console.log('Created loan table', new Date());
      });
}

async function create_ledger_table(db) {
    let note_table_schema = `
        CREATE TABLE IF NOT EXISTS ledger(
        id CHAR(15) NOT NULL UNIQUE PRIMARY KEY,
        cust_id CHAR(15) NOT NULL,
        loan_id CHAR(15) NOT NULL,
        amount_paid INTEGER NOT NULL,
        payment_type CHAR(10) NOT NULL,
        created_at DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(cust_id) REFERENCES account(id),
        FOREIGN KEY(loan_id) REFERENCES loan(id)
    )`;

    db.run(note_table_schema, [], (err) => {
        //callback function
        if (err) {
          console.log('Error creating ledger table', err.message);
          return;
        }
        console.log('Created ledger table', new Date());
      });
}

up(DB);