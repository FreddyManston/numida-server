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

    def resolve_loans(self, info):
        return loans

schema = graphene.Schema(query=Query)
