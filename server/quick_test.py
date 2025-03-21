from datetime import datetime

loan_data = {'loans': [{'id': 1, 'name': "Tom's Loan", 'interestRate': 5.0, 'principal': 10000, 'dueDate': '2025-03-01'}, {'id': 2, 'name': 'Chris Wailaka', 'interestRate': 3.5, 'principal': 500000, 'dueDate': '2025-03-01'}, {'id': 3, 'name': 'NP Mobile Money', 'interestRate': 4.5, 'principal': 30000, 'dueDate': '2025-03-01'}, {'id': 4, 'name': "Esther's Autoparts", 'interestRate': 1.5, 'principal': 40000, 'dueDate': '2025-03-01'}]}
loan_payment_data = {'loanPayments': [{'id': 1, 'loanId': 1, 'paymentDate': '2025-03-04'}, {'id': 2, 'loanId': 2, 'paymentDate': '2025-03-15'}, {'id': 3, 'loanId': 3, 'paymentDate': '2025-04-05'}]}


def _get_loan_status(due_date, payment_date):
    print(due_date)
    print(payment_date)
    payment_date = datetime.strptime(payment_date, '%Y-%m-%d') if payment_date else None
    due_date = datetime.strptime(due_date, '%Y-%m-%d')

    if not payment_date:
        return "Unpaid"

    days_diff = (payment_date - due_date).days
    print(days_diff)

    if days_diff <= 5:
        return "On Time"
    elif 6 <= days_diff <= 30:
        return "Late"
    else:
        return "Defaulted"


for loan in loan_data['loans']:
    for loan_payment in loan_payment_data['loanPayments']:
        if loan['id'] == loan_payment['loanId']:
            print(loan['name'])
            loan['paymentDate'] = loan_payment['paymentDate']
            loan['status'] = _get_loan_status(loan['dueDate'], loan_payment['paymentDate'])
            break
        loan['status'] = 'Unpaid'


print(loan_data)

{'loans': [{'id': 1, 'name': "Tom's Loan", 'interestRate': 5.0, 'principal': 10000, 'dueDate': '2025-03-01', 'paymentDate': '2025-03-04', 'status': 'Unpaid'}, {'id': 2, 'name': 'Chris Wailaka', 'interestRate': 3.5, 'principal': 500000, 'dueDate': '2025-03-01', 'paymentDate': '2025-03-15', 'status': 'Unpaid'}, {'id': 3, 'name': 'NP Mobile Money', 'interestRate': 4.5, 'principal': 30000, 'dueDate': '2025-03-01', 'paymentDate': '2025-04-05', 'status': 'Unpaid'}, {'id': 4, 'name': "Esther's Autoparts", 'interestRate': 1.5, 'principal': 40000, 'dueDate': '2025-03-01', 'status': 'Unpaid'}]}