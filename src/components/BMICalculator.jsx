import { useState } from 'react'

const BMICalculator = () => {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi, setBmi] = useState(null)
  const [status, setStatus] = useState('')

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1)
      setBmi(bmiValue)

      // Determine BMI status
      if (bmiValue < 18.5) setStatus('Underweight')
      else if (bmiValue >= 18.5 && bmiValue < 25) setStatus('Normal weight')
      else if (bmiValue >= 25 && bmiValue < 30) setStatus('Overweight')
      else setStatus('Obese')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    calculateBMI()
  }

  const getStatusColor = () => {
    switch (status) {
      case 'Underweight': return 'text-blue-600'
      case 'Normal weight': return 'text-green-600'
      case 'Overweight': return 'text-yellow-600'
      case 'Obese': return 'text-red-600'
      default: return ''
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">BMI Calculator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter weight in kilograms"
            required
          />
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter height in centimeters"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calculate BMI
        </button>
      </form>

      {bmi && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">Your Results</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">{bmi}</p>
            <p className={`text-lg font-medium ${getStatusColor()}`}>{status}</p>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>BMI Categories:</p>
            <ul className="mt-2 space-y-1">
              <li>Underweight: &lt; 18.5</li>
              <li>Normal weight: 18.5 - 24.9</li>
              <li>Overweight: 25 - 29.9</li>
              <li>Obese: ≥ 30</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default BMICalculator