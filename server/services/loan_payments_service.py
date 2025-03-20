from schemas.loan_payments_schema import schema as loan_payments_schema

def get_loan_payments():
    query = "{ loanPayments { id, loanId, paymentDate } }"
    return loan_payments_schema.execute(query).data
