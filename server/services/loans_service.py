from datetime import datetime
from schemas.loans_schema import schema as loan_schema
from schemas.loan_payments_schema import schema as loan_payments_schema


def get_loans():
    query = "{ loans { id, name, interestRate, principal, dueDate } }"
    return loan_schema.execute(query).data

def get_loan_payments():
    query = "{ loanPayments { id, loanId, paymentDate } }"
    return loan_payments_schema.execute(query).data

# Helper function
# TODO:
#   - Look into storing loan_payments as:
#       {
#           'loan_id': (payment_date)}
#       }
#       That way we don't need a 2nd loop.
def get_categorised_loan_payments():
    loans = get_loans()
    loan_payments = get_loan_payments()

    for loan in loans['loans']:
        for loan_payment in loan_payments['loanPayments']:
            if loan['id'] == loan_payment['loanId']:
                loan['paymentDate'] = loan_payment['paymentDate']
                loan['status'] = _get_loan_status(loan['dueDate'], loan_payment['paymentDate'])
                break
            loan['status'] = 'Unpaid'

    return loans


# Helper function
# TODO:
#   - Better way to organise status and rules: store status in dict where value is lambda function.
def _get_loan_status(due_date, payment_date):
    payment_date = datetime.strptime(payment_date, '%Y-%m-%d') if payment_date else None
    due_date = datetime.strptime(due_date, '%Y-%m-%d')

    if not payment_date:
        return "Unpaid"

    days_diff = (payment_date - due_date).days

    if days_diff <= 5:
        return "On Time"
    elif 6 <= days_diff <= 30:
        return "Late"
    else:
        return "Defaulted"
