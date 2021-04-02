# APLICACAO IGNITE _ FINANCES API
### Rafael Ignaulin

### Middlewares:

Verify if account exists ( with unique CPF )
Get account Balance


Rotas:

* (Get) /account = List data Account
* (Post) /account = Create Account
* (Put) /account = Rename Account
* (Delete) /account = Delete Account

* (Get) /statement = Verify account statements
* (Get) /statement/date = Verify account statements by date

* (Post) /deposit = Deposit a value in account, with desc.
* (Post) /withdraw = Withdraw a value in account, with desc (verified positive balance).

* (Get) /balance = Shows the current balance for the account.