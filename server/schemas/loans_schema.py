import graphene
from models.loans_model import loans

class ExistingLoans(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    interest_rate = graphene.Float()
    principal = graphene.Int()
    due_date = graphene.Date()

class Query(graphene.ObjectType):
    loans = graphene.List(ExistingLoans)
    hello = graphene.String(name=graphene.String(default_value="stranger"))

    def resolve_loans(self, info):
        return loans

    def resolve_hello(self, info, name):
        return f"Hello {name}"

schema = graphene.Schema(query=Query)
