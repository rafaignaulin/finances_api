const express = require("express");
const app = express();
const {v4: uuidv4} = require("uuid");

app.use(express.json());


const customers = [];

//Middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer){
        return response.status(400).json({error: "Customer doesnt exists"});
    }

    request.customer = customer;

    return next();
}


function getBalance(statement){
    const balance = statement.reduce((accumulator, operation) => {
       if(operation.type === 'credit'){
        return accumulator + operation.value;
       }
       if(operation.type === 'debit'){
        return accumulator - operation.value;
       }

    }, 0);

    return balance;
}



app.post("/account", (request, response) => {
    const {cpf, name} = request.body;
    
        const verifyCustomerAlreadyExists = customers.some((customer) => customer.cpf === cpf);
        

        if(verifyCustomerAlreadyExists){
            console.log("Ja existe");
            return response.status(400).json({error: "Cusstomer already exists"});
        }

        
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: [],
    });
    console.log(customers);

    return response.status(201).send();
});

//app.use(verifyIfExistsAccountCPF);

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    return response.json(customer.statement);

})

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter(
        (statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    )

    return response.json(statement);

})



app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request
    const { value, description } = request.body;

    const statementOperation = {
        value,
        description,
        created_at: new Date(),
        type: "credit",
    }

    customer.statement.push(statementOperation);
    return response.status(201).json({message: `Balance added, value = ${value}`});

})

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request
    const { value, description } = request.body;

    const balance = getBalance(customer.statement);

    if(balance < value) return response.status(400).json({error: " Do you not have money!"});

    const statementOperation = {
        value,
        description,
        created_at: new Date(),
        type: "debit",
    }

    customer.statement.push(statementOperation);
    return response.status(201).json({message: `Balance removed, value = ${value}`});

})


app.put("/account" , verifyIfExistsAccountCPF, (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;
    return response.status(201).send();
})

app.get("/account" , verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    return response.json(customer);
})

app.delete("/account" , verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    customers.splice(customer , 1);

    return response.json(customers);
})


app.get("/balance" , verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    const balance = getBalance(customer.statement);

    return response.json(balance);
})
app.listen(3333, () => {
    console.log("FinAPI has started!!!");
})