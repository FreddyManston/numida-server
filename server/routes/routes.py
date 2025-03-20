from flask import Blueprint
from flask_graphql import GraphQLView
from graphene import Schema
from schemas.loan_payments_schema import Query as LoanPaymentQuery
from schemas.loans_schema import Query as LoanQuery
from services import loan_payments_service, loans_service

blueprint = Blueprint("loans", __name__)

# Combine schemas
class Query(LoanQuery, LoanPaymentQuery):
    pass

combined_schema = Schema(query=Query)

# GraphQL route
blueprint.add_url_rule(
    "/graphql", view_func=GraphQLView.as_view("graphql", schema=combined_schema, graphiql=True)
)

# REST API Routes
@blueprint.route("/")
def home():
    return "Welcome to the Loan Application API"

@blueprint.route("/loans")
def existing_loans_endpoint():
    return loans_service.get_loans()

@blueprint.route("/loan_payments")
def loan_payments_endpoint():
    return loan_payments_service.get_loan_payments()