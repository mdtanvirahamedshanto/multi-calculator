/* eslint-disable no-unused-vars */
import { useState } from 'react'

const ProgrammerCalculator = () => {
  const [display, setDisplay] = useState('0')
  const [currentBase, setCurrentBase] = useState(10)
  const [bits, setBits] = useState(32)
  const [values, setValues] = useState({
    binary: '0',
    octal: '0',
    decimal: '0',
    hexadecimal: '0'
  })

  const updateAllBases = (value, fromBase) => {
    try {
      const decimal = parseInt(value, fromBase)
      if (isNaN(decimal)) throw new Error('Invalid number')

      const maxValue = Math.pow(2, bits) - 1
      const minValue = -Math.pow(2, bits - 1)
      const clampedValue = Math.max(minValue, Math.min(maxValue, decimal))

      setValues({
        binary: clampedValue.toString(2).padStart(bits, '0'),
        octal: clampedValue.toString(8),
        decimal: clampedValue.toString(10),
        hexadecimal: clampedValue.toString(16).toUpperCase()
      })
      setDisplay(value)
    } catch (e) {
      // Keep the previous valid state
      setDisplay(values[getBaseKey(currentBase)])
    }
  }

  const getBaseKey = (base) => {
    switch (base) {
      case 2: return 'binary'
      case 8: return 'octal'
      case 10: return 'decimal'
      case 16: return 'hexadecimal'
      default: return 'decimal'
    }
  }

  const handleDigitClick = (digit) => {
    const newDisplay = display === '0' ? digit : display + digit
    updateAllBases(newDisplay, currentBase)
  }

  const handleBaseChange = (newBase) => {
    setCurrentBase(newBase)
    setDisplay(values[getBaseKey(newBase)])
  }

  const handleBitwiseOperation = (operation) => {
    const decimal = parseInt(values.decimal)
    let result

    switch (operation) {
      case 'NOT':
        result = ~decimal
        break
      case 'LSH':
        result = decimal << 1
        break
      case 'RSH':
        result = decimal >> 1
        break
      case 'AND':
        result = decimal & 0
        break
      case 'OR':
        result = decimal | 0
        break
      case 'XOR':
        result = decimal ^ 0
        break
      default:
        return
    }

    updateAllBases(result.toString(10), 10)
  }

  const handleClear = () => {
    setDisplay('0')
    updateAllBases('0', 10)
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      const newDisplay = display.slice(0, -1)
      updateAllBases(newDisplay, currentBase)
    } else {
      handleClear()
    }
  }

  const isValidDigit = (digit) => {
    const digitValue = parseInt(digit, 16)
    switch (currentBase) {
      case 2: return digitValue < 2
      case 8: return digitValue < 8
      case 10: return digitValue < 10
      case 16: return true
      default: return false
    }
  }

  const renderDigitButtons = () => {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    return digits.map((digit) => (
      <button
        key={digit}
        onClick={() => handleDigitClick(digit)}
        disabled={!isValidDigit(digit)}
        className={`p-2 text-sm font-medium rounded
          ${isValidDigit(digit)
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`}
      >
        {digit}
      </button>
    ))
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      {/* Display and base selection */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { base: 2, name: 'BIN' },
            { base: 8, name: 'OCT' },
            { base: 10, name: 'DEC' },
            { base: 16, name: 'HEX' }
          ].map(({ base, name }) => (
            <button
              key={base}
              onClick={() => handleBaseChange(base)}
              className={`p-2 text-sm font-medium rounded ${currentBase === base ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-right text-sm text-gray-500">BIN</div>
            <div className="col-span-3 font-mono">{values.binary}</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-right text-sm text-gray-500">OCT</div>
            <div className="col-span-3 font-mono">{values.octal}</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-right text-sm text-gray-500">DEC</div>
            <div className="col-span-3 font-mono">{values.decimal}</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-right text-sm text-gray-500">HEX</div>
            <div className="col-span-3 font-mono">{values.hexadecimal}</div>
          </div>
        </div>
      </div>

      {/* Bit width selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Bit Width</label>
        <div className="grid grid-cols-3 gap-2">
          {[8, 16, 32].map((width) => (
            <button
              key={width}
              onClick={() => setBits(width)}
              className={`p-2 text-sm font-medium rounded
                ${bits === width ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {width} bits
            </button>
          ))}
        </div>
      </div>

      {/* Bitwise operations */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Bitwise Operations</label>
        <div className="grid grid-cols-3 gap-2">
          {['NOT', 'LSH', 'RSH', 'AND', 'OR', 'XOR'].map((op) => (
            <button
              key={op}
              onClick={() => handleBitwiseOperation(op)}
              className="p-2 text-sm font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      {/* Number pad */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2">
          {renderDigitButtons()}
        </div>
      </div>

      {/* Control buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleClear}
          className="p-2 text-sm font-medium bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Clear
        </button>
        <button
          onClick={handleBackspace}
          className="p-2 text-sm font-medium bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
        >
          Backspace
        </button>
      </div>
    </div>
  )
}

export default ProgrammerCalculator