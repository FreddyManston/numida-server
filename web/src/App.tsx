import React from 'react'
import './App.css'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { LoanCalculator } from './components/LoanCalculator';

const client = new ApolloClient({
    // TODO: figure out why the /loan and /loan_payment endpoints on port 5000 isn't working
    uri: 'http://localhost:2024/graphql',
    cache: new InMemoryCache(),
})

// GraphQL Queries to get Loan and Loan Payment data:
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
const getCategorizedLoanPayments = () => {
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

// Consider splitting this out if it becomes too complex
const DisplayCategorizedLoans = () => {
    const categorizedLoans = getCategorizedLoanPayments();
    const { loading } = useQuery(GET_LOANS);

    if (loading) return <p>Loading...</p>;
    if (!categorizedLoans) return <p>No loans available.</p>;

    return (
        <div>
            <h2>Categorized Loans</h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'black' }}>
                        <tr>
                            <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Interest Rate</th>
                            <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Principal</th>
                            <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Due Date</th>
                            <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Payment Date</th>
                            <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Status</th>
                            <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Loan Interest</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorizedLoans.map((loan: any) => (
                            <tr key={loan.id}>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{loan.name}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{loan.interestRate}%</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>${loan.principal}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{loan.dueDate}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{loan.paymentDate || '-'}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                    <span style={{ color: loan.status === 'Defaulted' ? 'red' : 
                                                        loan.status === 'Late' ? 'orange' : 
                                                        loan.status === 'On Time' ? 'green' : 'grey' }}>
                                        {loan.status}
                                    </span>
                                </td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                    <LoanCalculator principal={loan.principal} rate={loan.interestRate} months={1} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

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
