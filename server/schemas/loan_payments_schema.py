import graphene
from models.loan_payments_model import loan_payments

class LoanPayments(graphene.ObjectType):
    id = graphene.Int()
    loan_id = graphene.Int()
    payment_date = graphene.Date()

class Query(graphene.ObjectType):
    loan_payments = graphene.List(LoanPayments)

    def resolve_loan_payments(self, info):
        return loan_payments

schema = graphene.Schema(query=Query)
