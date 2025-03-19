import datetime
from flask import Flask
from flask_graphql import GraphQLView
from flask_cors import CORS
import graphene

app = Flask(__name__)
CORS(app)

loans = [
    {
        "id": 1,
        "name": "Tom's Loan",
        "interest_rate": 5.0,
        "principal": 10000,
        "due_date": datetime.date(2025, 3, 1),
    },
    {
        "id": 2,
        "name": "Chris Wailaka",
        "interest_rate": 3.5,
        "principal": 500000,
        "due_date": datetime.date(2025, 3, 1),
    },
    {
        "id": 3,
        "name": "NP Mobile Money",
        "interest_rate": 4.5,
        "principal": 30000,
        "due_date": datetime.date(2025, 3, 1),
    },
    {
        "id": 4,
        "name": "Esther's Autoparts",
        "interest_rate": 1.5,
        "principal": 40000,
        "due_date": datetime.date(2025, 3, 1),
    },
]

loan_payments = [
    {"id": 1, "loan_id": 1, "payment_date": datetime.date(2024, 3, 4)},
    {"id": 2, "loan_id": 2, "payment_date": datetime.date(2024, 3, 15)},
    {"id": 3, "loan_id": 3, "payment_date": datetime.date(2024, 4, 5)},
]


class ExistingLoans(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    interest_rate = graphene.Float()
    principal = graphene.Int()
    due_date = graphene.Date()

class LoanPayments(graphene.ObjectType):
    id = graphene.Int()
    loan_id = graphene.Int()
    payment_date = graphene.Date()


class Query(graphene.ObjectType):
    loans = graphene.List(ExistingLoans)
    loan_payments = graphene.List(LoanPayments)

    hello = graphene.String(name=graphene.String(default_value="stranger"))

    def resolve_loans(self, info):
        return loans

    def resolve_loan_payments(self, info):
        return loan_payments
    
    def resolve_hello(self, info, name):
        return f"Hello {name}"


schema = graphene.Schema(query=Query)


app.add_url_rule(
    "/graphql", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)


@app.route("/")
def home():
    return "Welcome to the Loan Application API"

@app.route("/loans")
def existing_loans_endpoint():
    result = schema.execute(" {loans { id, name, interestRate, principal, dueDate } }")
    return result.data

@app.route("/loan_payments")
def loan_payments_endpoint():
    result = schema.execute("{ loanPayments { id, loanId, paymentDate} }")
    return result.data


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
