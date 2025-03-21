import { useEffect, useState } from 'react'

// SECTION 4 Debugging & Code Refactoring
interface LoanCalculatorProps {
    principal: number;
    rate: number;
    months: number;
}

export const LoanCalculator = ({ principal, rate, months }: LoanCalculatorProps) => {
    const [interest, setInterest] = useState(0)

    useEffect(() => {
        setInterest((principal * rate * months) / 100)
    }, [principal, rate, months])

    return (
        <div>
            <p>{interest}</p>
        </div>
    )
}
