import React from 'react'
import './App.css'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { LoanCalculator } from './components/LoanCalculator';

const client = new ApolloClient({
    uri: 'http://localhost:2024/graphql', // Adjust this if your backend runs on a different port
    cache: new InMemoryCache(),
})

// GraphQL Query to Get Existing Loans
const GET_LOANS = gql`
    query
    {
        loans
        {
            id,
            name,
            interestRate,
            principal,
            dueDate
        }
    }
`
// GraphQL Query to Get Existing Loans
const GET_LOAN_PAYMENTS = gql`
    query
    {
        loanPayments
        {
            id,
            loanId,
            paymentDate
        }
    }
`

// Helper function to get loan status based on due date and payment date
const getLoanStatus = (dueDate: string, paymentDate: string | null): string => {
    if (!paymentDate) return "Unpaid";
    
    const paymentDateTime = new Date(paymentDate);
    const dueDateTime = new Date(dueDate);
    const daysDiff = Math.floor((paymentDateTime.getTime() - dueDateTime.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 5) return "On Time";
    if (daysDiff <= 30) return "Late";
    return "Defaulted";
};

// Helper function to categorize loan payments
const useCategorizedLoanPayments = () => {
    const { data: loanData } = useQuery(GET_LOANS);
    const { data: paymentData } = useQuery(GET_LOAN_PAYMENTS);

    if (!loanData?.loans || !paymentData?.loanPayments) return null;

    const paymentsByLoanId = paymentData.loanPayments.reduce((acc: any, payment: any) => {
        acc[payment.loanId] = payment.paymentDate;
        return acc;
    }, {});

    return loanData.loans.map((loan: any) => ({
        ...loan,
        paymentDate: paymentsByLoanId[loan.id] || null,
        status: getLoanStatus(loan.dueDate, paymentsByLoanId[loan.id])
    }));
};

const DisplayCategorizedLoans = () => {
    const categorizedLoans = useCategorizedLoanPayments();
    const { loading } = useQuery(GET_LOANS);

    if (loading) return <p>Loading...</p>;
    if (!categorizedLoans) return <p>No loans available.</p>;

    return (
        <div>
            <h2>Categorized Loans</h2>
            <ul>
                {categorizedLoans.map((loan: any) => (
                    <li key={loan.id}>
                        <strong>Loan Name:</strong> {loan.name} <br />
                        <strong>Interest Rate:</strong> {loan.interestRate}% <br />
                        <strong>Principal:</strong> ${loan.principal} <br />
                        <strong>Due Date:</strong> {loan.dueDate} <br />
                        <strong>Status:</strong> <span style={{ color: loan.status === 'Defaulted' ? 'red' : 
                                                                loan.status === 'Late' ? 'orange' : 
                                                                loan.status === 'On Time' ? 'green' : 'grey' }}>
                            {loan.status}
                        </span>
                        <LoanCalculator principal={loan.principal} rate={loan.interestRate} months={2}></LoanCalculator>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};


const DisplayLoans = () => {
    const { loading: loan_loading, error: loan_error, data: loan_data } = useQuery(GET_LOANS)
    const { loading: loan_payment_loading, error: loan_payment_error, data: loan_payment_data } = useQuery(GET_LOAN_PAYMENTS)

    if (loan_loading || loan_payment_loading) return <p>Loading loans...</p>
    if (loan_error || loan_payment_error) return <p>Error loading loans</p>
    // ✅ Check if 'data' and 'data.loans' exist before mapping
    if (!loan_data || !loan_payment_data || 
        !loan_data.loans || loan_data.loans.length === 0 ||
        !loan_payment_data.loanPayments || loan_payment_data.loanPayments.length === 0
    ) {
        return <p>No loans available.</p>;
    }

    return (
        <div>
            <h1>Existing Loans</h1>
            <ul>
                {loan_data.loans.map((loan: any) => (
                    <li key={loan.id}>
                        <strong>Loan Name:</strong> {loan.name} <br />
                        <strong>Interest Rate:</strong> {loan.interestRate}% <br />
                        <strong>Principal:</strong> ${loan.principal} <br />
                        <strong>Due Date:</strong> {loan.dueDate} <br />
                        <hr />
                    </li>
                ))}
            </ul>
            <h1>Loan Payments</h1>
            <ul>
                {loan_payment_data.loanPayments.map((loan_payment: any) => (
                    <li key={loan_payment.id}>
                        <strong>Loan ID:</strong> {loan_payment.loanId} <br />
                        <strong>Loan Payment Date:</strong> {loan_payment.paymentDate} <br />
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
}

const AddNewPayment = () => {
    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                }}
            >
                <p>
                    <label>Payment Loan Id: </label>
                    <input name="loan-id" onChange={() => {}} />
                </p>

                <p>
                    <label>Payment Amount: </label>
                    <input
                        name="payment-amount"
                        type="number"
                        onChange={() => {}}
                    />
                </p>
                <p>
                    <button type="submit">Add Payment</button>
                </p>
            </form>
        </div>
    )
}

function App() {
    return (
        <ApolloProvider client={client}>
            <div>
                <h1>Existing Loans & Payments</h1>
                <DisplayCategorizedLoans />
                <ul></ul>

                <h1>Add New Payment</h1>
                <AddNewPayment />
            </div>
        </ApolloProvider>
    )
}

export default App
