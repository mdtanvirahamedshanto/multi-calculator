import { useState } from 'react'

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState(null)
  const [totalPayment, setTotalPayment] = useState(null)
  const [totalInterest, setTotalInterest] = useState(null)

  const calculateMortgage = () => {
    if (loanAmount && interestRate && loanTerm) {
      const principal = parseFloat(loanAmount)
      const monthlyRate = parseFloat(interestRate) / 100 / 12
      const numberOfPayments = parseFloat(loanTerm) * 12

      const monthly = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

      const total = monthly * numberOfPayments
      const interest = total - principal

      setMonthlyPayment(monthly.toFixed(2))
      setTotalPayment(total.toFixed(2))
      setTotalInterest(interest.toFixed(2))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    calculateMortgage()
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mortgage Calculator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700">
            Loan Amount ($)
          </label>
          <input
            type="number"
            id="loanAmount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter loan amount"
            required
            min="0"
          />
        </div>

        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter interest rate"
            required
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700">
            Loan Term (years)
          </label>
          <input
            type="number"
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter loan term"
            required
            min="1"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calculate Mortgage
        </button>
      </form>

      {monthlyPayment && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Payment Summary</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Monthly Payment</p>
              <p className="text-xl font-semibold text-indigo-600">
                {formatCurrency(monthlyPayment)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Total Payment</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(totalPayment)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Total Interest</p>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(totalInterest)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Principal Amount</p>
              <p className="text-xl font-semibold text-blue-600">
                {formatCurrency(loanAmount)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MortgageCalculator