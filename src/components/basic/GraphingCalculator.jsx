/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { evaluate } from 'mathjs'

const GraphingCalculator = () => {
  const [expression, setExpression] = useState('x^2')
  const [points, setPoints] = useState([])
  const [xRange, setXRange] = useState({ min: -10, max: 10 })
  const [yRange, setYRange] = useState({ min: -10, max: 10 })
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(true)

  const generatePoints = () => {
    try {
      const numPoints = 200
      const step = (xRange.max - xRange.min) / numPoints
      const newPoints = []

      for (let i = 0; i <= numPoints; i++) {
        const x = xRange.min + (step * i)
        try {
          const y = evaluate(expression, { x })
          if (!isNaN(y) && isFinite(y) && y >= yRange.min && y <= yRange.max) {
            newPoints.push({ x, y })
          }
        } catch (e) {
          // Skip points that can't be evaluated
          continue
        }
      }

      setPoints(newPoints)
      setError('')
      setIsValid(true)
    } catch (e) {
      setError('Invalid expression')
      setIsValid(false)
    }
  }

  useEffect(() => {
    if (isValid) {
      generatePoints()
    }
  }, [expression, xRange, yRange, isValid])

  const handleExpressionChange = (e) => {
    const newExpression = e.target.value
    setExpression(newExpression)
    try {
      // Test if expression is valid with a sample value
      evaluate(newExpression, { x: 1 })
      setIsValid(true)
      setError('')
    } catch (e) {
      setIsValid(false)
      setError('Invalid expression')
    }
  }

  const handleRangeChange = (axis, bound, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      if (axis === 'x') {
        setXRange(prev => ({ ...prev, [bound]: numValue }))
      } else {
        setYRange(prev => ({ ...prev, [bound]: numValue }))
      }
    }
  }

  const zoomIn = () => {
    const xCenter = (xRange.max + xRange.min) / 2
    const yCenter = (yRange.max + yRange.min) / 2
    const xSpan = (xRange.max - xRange.min) / 2
    const ySpan = (yRange.max - yRange.min) / 2
    
    setXRange({
      min: xCenter - xSpan / 2,
      max: xCenter + xSpan / 2
    })
    setYRange({
      min: yCenter - ySpan / 2,
      max: yCenter + ySpan / 2
    })
  }

  const zoomOut = () => {
    const xCenter = (xRange.max + xRange.min) / 2
    const yCenter = (yRange.max + yRange.min) / 2
    const xSpan = (xRange.max - xRange.min)
    const ySpan = (yRange.max - yRange.min)
    
    setXRange({
      min: xCenter - xSpan,
      max: xCenter + xSpan
    })
    setYRange({
      min: yCenter - ySpan,
      max: yCenter + ySpan
    })
  }

  const commonFunctions = [
    { name: 'Quadratic', expr: 'x^2' },
    { name: 'Cubic', expr: 'x^3' },
    { name: 'Sine', expr: 'sin(x)' },
    { name: 'Cosine', expr: 'cos(x)' },
    { name: 'Exponential', expr: 'e^x' },
    { name: 'Logarithm', expr: 'log(x)' },
  ]

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Function f(x) =
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            value={expression}
            onChange={handleExpressionChange}
            className={`flex-1 p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter a mathematical expression (e.g., x^2)"
          />
          <button
            onClick={zoomIn}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Zoom In
          </button>
          <button
            onClick={zoomOut}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Zoom Out
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">X Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={xRange.min}
              onChange={(e) => handleRangeChange('x', 'min', e.target.value)}
              className="w-24 p-2 border rounded-md"
            />
            <span className="self-center">to</span>
            <input
              type="number"
              value={xRange.max}
              onChange={(e) => handleRangeChange('x', 'max', e.target.value)}
              className="w-24 p-2 border rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Y Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={yRange.min}
              onChange={(e) => handleRangeChange('y', 'min', e.target.value)}
              className="w-24 p-2 border rounded-md"
            />
            <span className="self-center">to</span>
            <input
              type="number"
              value={yRange.max}
              onChange={(e) => handleRangeChange('y', 'max', e.target.value)}
              className="w-24 p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Common Functions</label>
        <div className="flex flex-wrap gap-2">
          {commonFunctions.map((func) => (
            <button
              key={func.name}
              onClick={() => setExpression(func.expr)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {func.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[xRange.min, xRange.max]}
              dataKey="x"
              tickCount={11}
            />
            <YAxis
              type="number"
              domain={[yRange.min, yRange.max]}
              tickCount={11}
            />
            <Tooltip
              formatter={(value) => value.toFixed(2)}
              labelFormatter={(value) => `x: ${value.toFixed(2)}`}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#4f46e5"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default GraphingCalculator