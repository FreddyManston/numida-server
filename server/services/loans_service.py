from schemas.loans_schema import schema as loan_schema

def get_loans():
    query = "{ loans { id, name, interestRate, principal, dueDate } }"
    return loan_schema.execute(query).data
