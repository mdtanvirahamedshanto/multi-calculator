
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

// Import calculator components
import StandardCalculator from './components/basic/StandardCalculator'
import ScientificCalculator from './components/basic/ScientificCalculator'
import GraphingCalculator from './components/basic/GraphingCalculator'
import ProgrammerCalculator from './components/basic/ProgrammerCalculator'

// financial calculators
import LoanCalculator from './components/financial/LoanCalculator'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const calculatorCategories = [
    {
      name: 'Basic Calculators',
      icon: '🔢',
      items: [
        { name: 'Standard Calculator', path: '/basic/standard', icon: '➕' },
        { name: 'Scientific Calculator', path: '/basic/scientific', icon: '🧮' },
        { name: 'Graphing Calculator', path: '/basic/graphing', icon: '📈' },
        { name: 'Programmer Calculator', path: '/basic/programmer', icon: '💻' }
      ]
    },
    {
      name: 'Financial Calculators',
      icon: '💰',
      items: [
        { name: 'Loan Calculator', path: '/financial/loan', icon: '💵' },
        { name: 'Investment Calculator', path: '/financial/investment', icon: '📊' },
        { name: 'Mortgage Calculator', path: '/financial/mortgage', icon: '🏠' },
        { name: 'Currency Converter', path: '/financial/currency', icon: '💱' },
        { name: 'Retirement Calculator', path: '/financial/retirement', icon: '👴' }
      ]
    },
    {
      name: 'Health & Fitness',
      icon: '❤️',
      items: [
        { name: 'BMI Calculator', path: '/health/bmi', icon: '⚖️' },
        { name: 'Calorie Calculator', path: '/health/calorie', icon: '🍎' },
        { name: 'BMR Calculator', path: '/health/bmr', icon: '🏃' },
        { name: 'Heart Rate Zones', path: '/health/heart-rate', icon: '💓' },
        { name: 'Body Fat Calculator', path: '/health/body-fat', icon: '📏' }
      ]
    },
    {
      name: 'Engineering & Technical',
      icon: '⚙️',
      items: [
        { name: 'Unit Converter', path: '/engineering/unit-converter', icon: '📐' },
        { name: 'Ohms Law', path: '/engineering/ohms-law', icon: '⚡' },
        { name: 'Resistor Color Code', path: '/engineering/resistor', icon: '🎨' },
        { name: 'Power Consumption', path: '/engineering/power', icon: '🔌' },
        { name: 'Structural Load', path: '/engineering/structural', icon: '🏗️' }
      ]
    },
    {
      name: 'Developer Tools',
      icon: '💻',
      items: [
        { name: 'Number Base Converter', path: '/dev/base-converter', icon: '🔄' },
        { name: 'Color Code Converter', path: '/dev/color-converter', icon: '🎨' },
        { name: 'Password Strength', path: '/dev/password', icon: '🔒' },
        { name: 'Hash Generator', path: '/dev/hash', icon: '#️⃣' },
        { name: 'Base64 Converter', path: '/dev/base64', icon: '📝' }
      ]
    },
    {
      name: 'Educational',
      icon: '🎓',
      items: [
        { name: 'GPA Calculator', path: '/edu/gpa', icon: '📚' },
        { name: 'Date Calculator', path: '/edu/date', icon: '📅' },
        { name: 'Probability', path: '/edu/probability', icon: '🎲' },
        { name: 'Scientific Notation', path: '/edu/scientific', icon: '🔬' },
        { name: 'Typing Speed', path: '/edu/typing', icon: '⌨️' }
      ]
    },
    {
      name: 'Specialized',
      icon: '🔧',
      items: [
        { name: '3D Printer Cost', path: '/special/3d-printer', icon: '🖨️' },
        { name: 'Fuel Efficiency', path: '/special/fuel', icon: '⛽' },
        { name: 'Trip Cost', path: '/special/trip', icon: '✈️' },
        { name: 'Cooking Converter', path: '/special/cooking', icon: '👩‍🍳' },
        { name: 'Time Zone', path: '/special/timezone', icon: '🌍' }
      ]
    }
  ]

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        {/* Navigation */}
        <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-indigo-400">Multi-Calculator</Link>
                </div>
              </div>
              
              {/* Mobile menu button */}
              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-gray-100 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-400"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? 'X' : '☰'}
                </button>
              </div>

              {/* Desktop menu */}
              <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-4">
                {calculatorCategories.map((category) => (
                  <div key={category.name} className="relative group">
                    <button className="text-gray-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute z-10 left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                      <div className="rounded-md shadow-lg bg-gray-800 ring-1 ring-gray-700 ring-opacity-50">
                        <div className="py-1">
                          {category.items.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-indigo-400"
                            >
                              {item.icon} {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
            <div className="pt-2 pb-3 space-y-1">
              {calculatorCategories.map((category) => (
                <div key={category.name}>
                  <div className="px-3 py-2 text-base font-medium text-gray-300 bg-gray-700">
                    {category.icon} {category.name}
                  </div>
                  {category.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block pl-6 pr-3 py-2 text-base font-medium text-gray-400 hover:text-indigo-400 hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon} {item.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="/" element={<Dashboard categories={calculatorCategories} />} />
              
              {/* Basic Calculator Routes */}
              <Route path="/basic/standard" element={<StandardCalculator />} />
              <Route path="/basic/scientific" element={<ScientificCalculator />} />
              <Route path="/basic/graphing" element={<GraphingCalculator />} />
              <Route path="/basic/programmer" element={<ProgrammerCalculator />} />
              
              {/* Legacy routes - will be updated to new paths */}
              {/* <Route path="/bmi" element={<BMICalculator />} />
              <Route path="/mortgage" element={<MortgageCalculator />} />
              <Route path="/currency" element={<CurrencyConverter />} />
              <Route path="/math" element={<MathTools />} /> */}

              {/* Financial Calculator Routes */}
              <Route path="/financial/loan" element={<LoanCalculator />} />
              {/* <Route path="/financial/credit" element={<CreditCalculator />} />
              <Route path="/financial/investment" element={<InvestmentCalculator />} />
              <Route path="/financial/retirement" element={<RetirementCalculator />} />
              <Route path="/financial/income" element={<IncomeCalculator />} />
              <Route path="/financial/expense" element={<ExpenseCalculator />} /> */}
              
              {/* Placeholder routes for other calculators */}
              <Route path="*" element={<div className="text-center p-8"><h2 className="text-2xl font-bold text-gray-800">Coming Soon!</h2><p className="text-gray-600 mt-2">This calculator is under development.</p></div>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

// Dashboard component
const Dashboard = ({ categories }) => {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.name} className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-200 mb-4 flex items-center">
            <span className="text-3xl mr-2">{category.icon}</span>
            {category.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center p-4 rounded-lg border border-gray-700 hover:border-indigo-500 bg-gray-800 hover:bg-gray-700 hover:shadow-md transition-all duration-300"
              >
                <span className="text-3xl mr-3">{item.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">{item.name}</h3>
                  <p className="text-sm text-gray-400">Click to calculate</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
