import { useState } from 'react'

const MathTools = () => {
  const [selectedTool, setSelectedTool] = useState('basic')
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [operation, setOperation] = useState('add')
  const [result, setResult] = useState(null)

  const tools = [
    { id: 'basic', name: 'Basic Calculator', icon: '🔢' },
    { id: 'percentage', name: 'Percentage Calculator', icon: '%' },
    { id: 'unit', name: 'Unit Converter', icon: '📏' }
  ]

  const handleCalculate = (e) => {
    e.preventDefault()
    const num1 = parseFloat(input1)
    const num2 = parseFloat(input2)

    switch (selectedTool) {
      case 'basic':
        switch (operation) {
          case 'add': setResult(num1 + num2); break
          case 'subtract': setResult(num1 - num2); break
          case 'multiply': setResult(num1 * num2); break
          case 'divide': setResult(num2 !== 0 ? num1 / num2 : 'Cannot divide by zero'); break
          default: setResult(null)
        }
        break

      case 'percentage':
        switch (operation) {
          case 'percent': setResult((num1 * num2) / 100); break
          case 'percentOf': setResult((num1 / num2) * 100); break
          case 'increase': setResult(num1 + (num1 * num2) / 100); break
          case 'decrease': setResult(num1 - (num1 * num2) / 100); break
          default: setResult(null)
        }
        break

      case 'unit':
        switch (operation) {
          case 'kmToMiles': setResult(num1 * 0.621371); break
          case 'milesToKm': setResult(num1 * 1.60934); break
          case 'kgToLbs': setResult(num1 * 2.20462); break
          case 'lbsToKg': setResult(num1 * 0.453592); break
          default: setResult(null)
        }
        break

      default:
        setResult(null)
    }
  }

  const renderToolInputs = () => {
    switch (selectedTool) {
      case 'basic':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="number"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="First number"
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Second number"
                className="p-2 border rounded"
              />
            </div>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="add">Add (+)</option>
              <option value="subtract">Subtract (-)</option>
              <option value="multiply">Multiply (×)</option>
              <option value="divide">Divide (÷)</option>
            </select>
          </>
        )

      case 'percentage':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="number"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Number"
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Percentage"
                className="p-2 border rounded"
              />
            </div>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="percent">Percentage of number</option>
              <option value="percentOf">Percentage one number is of another</option>
              <option value="increase">Increase by percentage</option>
              <option value="decrease">Decrease by percentage</option>
            </select>
          </>
        )

      case 'unit':
        return (
          <>
            <input
              type="number"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="Enter value"
              className="w-full p-2 border rounded mb-4"
            />
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="kmToMiles">Kilometers to Miles</option>
              <option value="milesToKm">Miles to Kilometers</option>
              <option value="kgToLbs">Kilograms to Pounds</option>
              <option value="lbsToKg">Pounds to Kilograms</option>
            </select>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Math Tools</h2>

      <div className="flex space-x-4 mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setSelectedTool(tool.id)
              setResult(null)
              setInput1('')
              setInput2('')
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${selectedTool === tool.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="block text-xl mb-1">{tool.icon}</span>
            {tool.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleCalculate} className="space-y-4">
        {renderToolInputs()}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calculate
        </button>
      </form>

      {result !== null && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Result</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {typeof result === 'number' ? result.toFixed(2) : result}
          </p>
        </div>
      )}
    </div>
  )
}

export default MathTools