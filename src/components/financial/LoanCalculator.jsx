/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Calculator, DollarSign, Calendar, Percent, PlusCircle, MinusCircle, Download } from 'lucide-react';
import * as math from 'mathjs';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [termType, setTermType] = useState('years');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [extraPayment, setExtraPayment] = useState(0);
  const [loanType, setLoanType] = useState('home');
  const [showAmortization, setShowAmortization] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹',
    BDT: '৳'
  };

  const currencyFormats = {
    USD: { style: 'currency', currency: 'USD' },
    EUR: { style: 'currency', currency: 'EUR' },
    GBP: { style: 'currency', currency: 'GBP' },
    JPY: { style: 'currency', currency: 'JPY' },
    INR: { style: 'currency', currency: 'INR' },
    BDT: { style: 'currency', currency: 'BDT' }
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, termType, extraPayment]);

  const calculateLoan = () => {
    try {
      // Parse input values using mathjs to ensure precision
      const principal = math.bignumber(loanAmount || 0);
      const yearlyRate = math.bignumber(interestRate || 0).div(100);
      const monthlyRate = yearlyRate.div(12);
      const termMonths = termType === 'years' ? math.multiply(loanTerm, 12) : math.bignumber(loanTerm);
      const extraPaymentAmount = math.bignumber(extraPayment || 0);

      if (math.smaller(principal, 0) || math.smaller(monthlyRate, 0) || math.smaller(termMonths, 0)) {
        setMonthlyPayment(0);
        setTotalInterest(0);
        setTotalPayment(0);
        setAmortizationSchedule([]);
        return;
      }

      // Calculate monthly payment (EMI) using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
      let monthly;
      
      if (math.equal(monthlyRate, 0)) {
        // If interest rate is zero, simply divide principal by term
        monthly = math.divide(principal, termMonths);
      } else {
        const onePlusR = math.add(1, monthlyRate);
        const power = math.pow(onePlusR, termMonths);
        const numerator = math.multiply(principal, monthlyRate, power);
        const denominator = math.subtract(power, 1);
        monthly = math.divide(numerator, denominator);
      }

      setMonthlyPayment(math.number(monthly));

      // Generate amortization schedule
      let balance = math.number(principal);
      let totalInterestPaid = 0;
      const schedule = [];
      const startDateObj = new Date(startDate);
      let yearlyInterest = {};
      let yearlyPrincipal = {};
      const extraPaymentNum = math.number(extraPaymentAmount);
      const monthlyNum = math.number(monthly);
      const monthlyRateNum = math.number(monthlyRate);

      for (let month = 1; balance > 0 && month <= math.number(termMonths) + 100; month++) {
        const interestPayment = balance * monthlyRateNum;
        let principalPayment = monthlyNum - interestPayment;
        
        // Add extra payment if any
        const actualPrincipalPayment = Math.min(balance, principalPayment + extraPaymentNum);
        const paymentDate = new Date(startDateObj);
        paymentDate.setMonth(startDateObj.getMonth() + month - 1);
        
        const year = paymentDate.getFullYear();
        
        // Track yearly totals
        if (!yearlyInterest[year]) yearlyInterest[year] = 0;
        if (!yearlyPrincipal[year]) yearlyPrincipal[year] = 0;
        
        yearlyInterest[year] += interestPayment;
        yearlyPrincipal[year] += actualPrincipalPayment;

        const newBalance = balance - actualPrincipalPayment;
        totalInterestPaid += interestPayment;

        schedule.push({
          month,
          paymentDate: paymentDate.toISOString().split('T')[0],
          payment: actualPrincipalPayment + interestPayment,
          principalPayment: actualPrincipalPayment,
          interestPayment,
          remainingBalance: newBalance > 0 ? newBalance : 0,
          totalInterestPaid
        });

        if (newBalance <= 0) break;
        balance = newBalance;
      }

      // Convert yearly data for charts
      const yearlyChartData = Object.keys(yearlyInterest).map(year => ({
        name: year,
        interest: yearlyInterest[year],
        principal: yearlyPrincipal[year]
      }));

      setTotalInterest(totalInterestPaid);
      setTotalPayment(math.number(principal) + totalInterestPaid);
      setAmortizationSchedule(schedule);
      setYearlyData(yearlyChartData);
    } catch (error) {
      console.error("Calculation error:", error);
      // Reset values on error
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalPayment(0);
      setAmortizationSchedule([]);
    }
  };

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('en-US', {
        ...currencyFormats[currency],
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    } catch (e) {
      // Fallback formatting if Intl API fails
      return currencySymbols[currency] + value.toFixed(2);
    }
  };

  const pieChartData = [
    { name: 'Principal', value: math.number(loanAmount) },
    { name: 'Interest', value: totalInterest }
  ];

  const COLORS = ['#3B82F6', '#EC4899'];

  const handleDownloadCSV = () => {
    if (amortizationSchedule.length === 0) return;
    
    let csvContent = "Month,Date,Payment,Principal,Interest,Remaining Balance,Total Interest Paid\n";
    
    amortizationSchedule.forEach(row => {
      csvContent += `${row.month},${row.paymentDate},${row.payment.toFixed(2)},${row.principalPayment.toFixed(2)},${row.interestPayment.toFixed(2)},${row.remainingBalance.toFixed(2)},${row.totalInterestPaid.toFixed(2)}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'loan_amortization.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-gray-100 rounded-xl shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">Loan Calculator</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-pink-500" />
            Loan Details
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Loan Type</label>
              <select 
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
              >
                <option value="home">Home Loan</option>
                <option value="car">Car Loan</option>
                <option value="personal">Personal Loan</option>
                <option value="education">Education Loan</option>
                <option value="business">Business Loan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Loan Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">{currencySymbols[currency]}</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full p-2 pl-8 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Interest Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                  step="0.1"
                  min="0"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Loan Term</label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Term Type</label>
                <select
                  value={termType}
                  onChange={(e) => setTermType(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Extra Monthly Payment</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">{currencySymbols[currency]}</span>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                  className="w-full p-2 pl-8 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
              >
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="JPY">Japanese Yen (¥)</option>
                <option value="INR">Indian Rupee (₹)</option>
                <option value="BDT">Bangladeshi Taka (৳)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              Loan Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Monthly Payment</p>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(monthlyPayment)}</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Total Interest</p>
                <p className="text-2xl font-bold text-pink-400">{formatCurrency(totalInterest)}</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Total Payment</p>
                <p className="text-2xl font-bold text-purple-400">{formatCurrency(totalPayment)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Payment Breakdown</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Yearly Breakdown</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="principal" name="Principal" fill="#3B82F6" />
                    <Bar dataKey="interest" name="Interest" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Amortization Schedule Toggle */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Amortization Schedule
              </h2>
              <button 
                onClick={() => setShowAmortization(!showAmortization)}
                className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-1 px-3 rounded"
              >
                {showAmortization ? (
                  <>
                    <MinusCircle className="w-4 h-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Show Details
                  </>
                )}
              </button>
            </div>
            
            {showAmortization && (
              <div>
                <div className="flex justify-end mb-2">
                  <button 
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Month</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Principal</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Interest</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {amortizationSchedule.slice(0, 24).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-750' : 'bg-gray-800'}>
                          <td className="px-4 py-2 text-sm text-gray-300">{row.month}</td>
                          <td className="px-4 py-2 text-sm text-gray-300">{row.paymentDate}</td>
                          <td className="px-4 py-2 text-sm text-gray-300">{formatCurrency(row.payment)}</td>
                          <td className="px-4 py-2 text-sm text-blue-400">{formatCurrency(row.principalPayment)}</td>
                          <td className="px-4 py-2 text-sm text-pink-400">{formatCurrency(row.interestPayment)}</td>
                          <td className="px-4 py-2 text-sm text-gray-300">{formatCurrency(row.remainingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {amortizationSchedule.length > 24 && (
                    <div className="text-center py-2 text-sm text-gray-400">
                      Showing first 24 months of {amortizationSchedule.length} total months
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}