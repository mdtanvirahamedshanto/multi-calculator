import { useState, useEffect } from 'react'

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(null)

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  ]

  // Simulated exchange rates (in a real app, these would come from an API)
  const getExchangeRate = (from, to) => {
    const rates = {
      'USD': { 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110.0, 'AUD': 1.35, 'CAD': 1.25, 'CHF': 0.92, 'CNY': 6.45, 'INR': 74.5 },
      'EUR': { 'USD': 1.18, 'GBP': 0.86, 'JPY': 129.5, 'AUD': 1.59, 'CAD': 1.47, 'CHF': 1.08, 'CNY': 7.59, 'INR': 87.8 },
      'GBP': { 'USD': 1.37, 'EUR': 1.16, 'JPY': 150.6, 'AUD': 1.85, 'CAD': 1.71, 'CHF': 1.26, 'CNY': 8.83, 'INR': 102.1 },
      'JPY': { 'USD': 0.0091, 'EUR': 0.0077, 'GBP': 0.0066, 'AUD': 0.012, 'CAD': 0.011, 'CHF': 0.0084, 'CNY': 0.059, 'INR': 0.68 },
      'AUD': { 'USD': 0.74, 'EUR': 0.63, 'GBP': 0.54, 'JPY': 81.5, 'CAD': 0.93, 'CHF': 0.68, 'CNY': 4.78, 'INR': 55.2 },
      'CAD': { 'USD': 0.80, 'EUR': 0.68, 'GBP': 0.58, 'JPY': 88.0, 'AUD': 1.08, 'CHF': 0.74, 'CNY': 5.16, 'INR': 59.6 },
      'CHF': { 'USD': 1.09, 'EUR': 0.93, 'GBP': 0.79, 'JPY': 119.6, 'AUD': 1.47, 'CAD': 1.36, 'CNY': 7.01, 'INR': 81.0 },
      'CNY': { 'USD': 0.15, 'EUR': 0.13, 'GBP': 0.11, 'JPY': 17.1, 'AUD': 0.21, 'CAD': 0.19, 'CHF': 0.14, 'INR': 11.6 },
      'INR': { 'USD': 0.013, 'EUR': 0.011, 'GBP': 0.0098, 'JPY': 1.47, 'AUD': 0.018, 'CAD': 0.017, 'CHF': 0.012, 'CNY': 0.086 }
    }
    return rates[from][to] || 1/rates[to][from]
  }

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const rate = getExchangeRate(fromCurrency, toCurrency)
      setExchangeRate(rate)
      setConvertedAmount((amount * rate).toFixed(2))
    }
  }, [amount, fromCurrency, toCurrency])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (amount && fromCurrency && toCurrency) {
      const rate = getExchangeRate(fromCurrency, toCurrency)
      setExchangeRate(rate)
      setConvertedAmount((amount * rate).toFixed(2))
    }
  }

  const formatCurrency = (value, currency) => {
    const symbol = currencies.find(c => c.code === currency)?.symbol || ''
    return `${symbol}${value}`
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Currency Converter</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter amount"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700">
              From
            </label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700">
              To
            </label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Convert
        </button>
      </form>

      {convertedAmount && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-lg text-gray-600">
              {formatCurrency(amount, fromCurrency)} = 
            </p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {formatCurrency(convertedAmount, toCurrency)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrencyConverter