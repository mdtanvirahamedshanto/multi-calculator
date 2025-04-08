/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
import { useState, useEffect } from 'react';
import * as math from 'mathjs';

// Constants
const CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
  PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
  G: 9.80665, // Gravity constant
  NA: 6.02214076e23, // Avogadro's number
  H: 6.62607015e-34, // Planck's constant
};

// Remove number input spinners
const inputStyles = {
  WebkitAppearance: 'none',
  MozAppearance: 'textfield',
  margin: 0
};

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [input, setInput] = useState('');
  const [prevAnswer, setPrevAnswer] = useState(null);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [isRadian, setIsRadian] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showConstants, setShowConstants] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showConversions, setShowConversions] = useState(false);
  const [statisticalValues, setStatisticalValues] = useState('');
  const [conversionType, setConversionType] = useState('degRad');
  const [conversionInput, setConversionInput] = useState('');
  const [conversionResult, setConversionResult] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      calculateResult();
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (/^[0-9+\-*/().%]$/.test(e.key)) {
      handleButtonPress(e.key);
    }
  };

  const handleButtonPress = (value) => {
    if (display === '0' || display === 'Error') {
      setDisplay(value);
      setInput(value);
    } else {
      setDisplay(display + value);
      setInput(input + value);
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setInput('');
  };

  const handleBackspace = () => {
    if (display !== '0' && display.length > 1) {
      setDisplay(display.slice(0, -1));
      setInput(input.slice(0, -1));
    } else {
      setDisplay('0');
      setInput('');
    }
  };

  const toggleSign = () => {
    if (display === '0') return;
    
    try {
      const evaluated = math.evaluate(display);
      setDisplay((-evaluated).toString());
      setInput((-evaluated).toString());
    } catch (e) {
      if (display.startsWith('-')) {
        setDisplay(display.slice(1));
        setInput(input.slice(1));
      } else {
        setDisplay('-' + display);
        setInput('-' + input);
      }
    }
  };

  const calculateResult = () => {
    try {
      let expr = input.replace(/×/g, '*').replace(/÷/g, '/');
      
      // Replace ^ with ** for power
      expr = expr.replace(/\^/g, '**');
      
      // Handle trig functions based on the current angle mode
      if (!isRadian) {
        expr = expr.replace(/sin\(([^)]+)\)/g, `sin($1 * ${Math.PI / 180})`);
        expr = expr.replace(/cos\(([^)]+)\)/g, `cos($1 * ${Math.PI / 180})`);
        expr = expr.replace(/tan\(([^)]+)\)/g, `tan($1 * ${Math.PI / 180})`);
      }

      let result = math.evaluate(expr);

      // Format the result
      if (Math.abs(result) < 1e-10 && result !== 0) {
        result = result.toExponential(5);
      } else if (Math.abs(result) > 1e10) {
        result = result.toExponential(5);
      } else {
        result = result.toString();
        // Limit decimal places for readability
        if (result.includes('.') && result.split('.')[1].length > 10) {
          result = parseFloat(result).toFixed(10).replace(/\.?0+$/, '');
        }
      }

      setDisplay(result);
      setInput(result);
      setPrevAnswer(result);
      
      // Add to history
      setHistory([...history, { expression: expr, result }]);
    } catch (e) {
      setDisplay('Error');
      setTimeout(() => setDisplay(input || '0'), 1500);
    }
  };

  const handleMemoryOperation = (operation) => {
    switch (operation) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        const memoryValue = memory.toString();
        setDisplay(memoryValue);
        setInput(input + memoryValue);
        break;
      case 'M+':
        try {
          const currentValue = parseFloat(math.evaluate(input));
          setMemory(memory + currentValue);
        } catch (e) {
          // Ignore if input can't be evaluated
        }
        break;
      case 'M-':
        try {
          const currentValue = parseFloat(math.evaluate(input));
          setMemory(memory - currentValue);
        } catch (e) {
          // Ignore if input can't be evaluated
        }
        break;
      case 'MS':
        try {
          const currentValue = parseFloat(math.evaluate(input));
          setMemory(currentValue);
        } catch (e) {
          // Ignore if input can't be evaluated
        }
        break;
      default:
        break;
    }
  };

  const handleFunction = (func) => {
    switch (func) {
      case 'sqrt':
        handleButtonPress('sqrt(');
        break;
      case 'cbrt':
        handleButtonPress('cbrt(');
        break;
      case 'square':
        handleButtonPress('^2');
        break;
      case 'cube':
        handleButtonPress('^3');
        break;
      case 'pow':
        handleButtonPress('^');
        break;
      case 'exp':
        handleButtonPress('e^');
        break;
      case 'log':
        handleButtonPress('log10(');
        break;
      case 'ln':
        handleButtonPress('log(');
        break;
      case 'log_base':
        handleButtonPress('log(');
        break;
      case 'sin':
        handleButtonPress('sin(');
        break;
      case 'cos':
        handleButtonPress('cos(');
        break;
      case 'tan':
        handleButtonPress('tan(');
        break;
      case 'csc':
        handleButtonPress('1/sin(');
        break;
      case 'sec': 
        handleButtonPress('1/cos(');
        break;
      case 'cot':
        handleButtonPress('1/tan(');
        break;
      case 'asin':
        handleButtonPress('asin(');
        break;
      case 'acos':
        handleButtonPress('acos(');
        break;
      case 'atan':
        handleButtonPress('atan(');
        break;
      case 'nPr':
        handleButtonPress('factorial(');
        break;
      case 'nCr':
        handleButtonPress('combinations(');
        break;
      case 'factorial':
        handleButtonPress('factorial(');
        break;
      case 'ans':
        if (prevAnswer !== null) {
          handleButtonPress(prevAnswer);
        }
        break;
      default:
        break;
    }
  };

  const handleConstant = (constant) => {
    const value = CONSTANTS[constant];
    handleButtonPress(value.toString());
    setShowConstants(false);
  };

  const toggleAngleMode = () => {
    setIsRadian(!isRadian);
  };

  const calculateStatistics = () => {
    try {
      const values = statisticalValues.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
      
      if (values.length === 0) {
        return "Please enter valid data";
      }

      // Calculate mean
      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / values.length;
      
      // Calculate median
      const sortedValues = [...values].sort((a, b) => a - b);
      const middle = Math.floor(sortedValues.length / 2);
      const median = sortedValues.length % 2 === 0 
        ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
        : sortedValues[middle];
      
      // Calculate mode
      const counts = {};
      values.forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
      });
      
      let maxCount = 0;
      let modes = [];
      for (const [val, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          modes = [parseFloat(val)];
        } else if (count === maxCount) {
          modes.push(parseFloat(val));
        }
      }
      
      const modeText = modes.length === values.length 
        ? "No mode" 
        : modes.join(", ");
      
      // Calculate standard deviation and variance
      const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
      const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      return `Mean: ${mean.toFixed(4)}
Median: ${median.toFixed(4)}
Mode: ${modeText}
Std Dev: ${stdDev.toFixed(4)}
Variance: ${variance.toFixed(4)}
Count: ${values.length}`;
    } catch (e) {
      return "Error calculating statistics";
    }
  };

  const handleConversion = () => {
    try {
      let result = '';
      const value = parseFloat(conversionInput);
      
      if (isNaN(value)) {
        setConversionResult('Invalid input');
        return;
      }
      
      switch (conversionType) {
        case 'degRad':
          result = `${value} degrees = ${(value * Math.PI / 180).toFixed(6)} radians
${value} radians = ${(value * 180 / Math.PI).toFixed(6)} degrees`;
          break;
        case 'decFrac':
          // Simple decimal to fraction conversion
          const decimalToFraction = (decimal) => {
            if (decimal === 0) return "0";
            
            const tolerance = 1.0E-10;
            let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
            let b = decimal;
            
            do {
              let a = Math.floor(b);
              let aux = h1;
              h1 = a * h1 + h2;
              h2 = aux;
              aux = k1;
              k1 = a * k1 + k2;
              k2 = aux;
              b = 1 / (b - a);
            } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
            
            return `${h1}/${k1}`;
          };
          
          result = `${value} = ${decimalToFraction(value)}`;
          break;
        case 'numSys':
          result = `Decimal: ${value}
Binary: ${Math.floor(value).toString(2)}
Octal: ${Math.floor(value).toString(8)}
Hexadecimal: ${Math.floor(value).toString(16).toUpperCase()}`;
          break;
        default:
          result = 'Invalid conversion type';
      }
      
      setConversionResult(result);
    } catch (e) {
      setConversionResult('Error performing conversion');
    }
  };

  // Button component for consistent styling
  const Button = ({ children, onClick, className = "", colSpan = 1 }) => (
    <button 
      onClick={onClick} 
      className={`py-3 px-2 rounded-lg text-center transition-all duration-150 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
        colSpan > 1 ? `col-span-${colSpan}` : ''
      } ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Display */}
        <div className="p-4 bg-gray-900">
          <div className="h-6 text-right text-gray-400 text-sm mb-1 overflow-x-auto whitespace-nowrap">
            {input || '0'}
          </div>
          <div className="text-right text-3xl font-bold whitespace-nowrap overflow-hidden ">
            {display}
          </div>
          
          {/* Memory and angle mode indicators */}
          <div className="flex justify-between mt-2 text-xs">
            <div>
              <span className={`${memory !== 0 ? 'text-purple-400' : 'text-gray-500'}`}>
                M: {memory}
              </span>
            </div>
            <div>
              <span className="text-purple-400">
                {isRadian ? 'RAD' : 'DEG'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button 
            className={`px-4 py-2 text-sm ${activeTab === 'basic' ? 'bg-gray-700 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic
          </button>
          <button 
            className={`px-4 py-2 text-sm ${activeTab === 'advanced' ? 'bg-gray-700 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
          <button 
            className={`px-4 py-2 text-sm ${activeTab === 'tools' ? 'bg-gray-700 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('tools')}
          >
            Tools
          </button>
        </div>

        {/* Basic Calculator */}
        {activeTab === 'basic' && (
          <div className="p-3">
            {/* Memory functions */}
            <div className="grid grid-cols-5 gap-2 mb-2">
              <Button onClick={() => handleMemoryOperation('MC')} className="bg-gray-700 text-gray-300">MC</Button>
              <Button onClick={() => handleMemoryOperation('MR')} className="bg-gray-700 text-gray-300">MR</Button>
              <Button onClick={() => handleMemoryOperation('M+')} className="bg-gray-700 text-gray-300">M+</Button>
              <Button onClick={() => handleMemoryOperation('M-')} className="bg-gray-700 text-gray-300">M-</Button>
              <Button onClick={() => handleMemoryOperation('MS')} className="bg-gray-700 text-gray-300">MS</Button>
            </div>

            {/* Main calculator buttons */}
            <div className="grid grid-cols-4 gap-2">
              {/* Row 1 */}
              <Button onClick={clearDisplay} className="bg-red-700 hover:bg-red-600">C</Button>
              <Button onClick={() => handleButtonPress('(')} className="bg-gray-700 text-gray-300">(</Button>
              <Button onClick={() => handleButtonPress(')')} className="bg-gray-700 text-gray-300">)</Button>
              <Button onClick={handleBackspace} className="bg-gray-700 text-gray-300">⌫</Button>

              {/* Row 2 */}
              <Button onClick={() => handleFunction('square')} className="bg-gray-700 text-gray-300">x²</Button>
              <Button onClick={() => handleFunction('sqrt')} className="bg-gray-700 text-gray-300">√</Button>
              <Button onClick={() => handleButtonPress('%')} className="bg-gray-700 text-gray-300">%</Button>
              <Button onClick={() => handleButtonPress('÷')} className="bg-indigo-800 text-gray-100">÷</Button>

              {/* Row 3 */}
              <Button onClick={() => handleButtonPress('7')} className="bg-gray-600">7</Button>
              <Button onClick={() => handleButtonPress('8')} className="bg-gray-600">8</Button>
              <Button onClick={() => handleButtonPress('9')} className="bg-gray-600">9</Button>
              <Button onClick={() => handleButtonPress('×')} className="bg-indigo-800 text-gray-100">×</Button>

              {/* Row 4 */}
              <Button onClick={() => handleButtonPress('4')} className="bg-gray-600">4</Button>
              <Button onClick={() => handleButtonPress('5')} className="bg-gray-600">5</Button>
              <Button onClick={() => handleButtonPress('6')} className="bg-gray-600">6</Button>
              <Button onClick={() => handleButtonPress('-')} className="bg-indigo-800 text-gray-100">−</Button>

              {/* Row 5 */}
              <Button onClick={() => handleButtonPress('1')} className="bg-gray-600">1</Button>
              <Button onClick={() => handleButtonPress('2')} className="bg-gray-600">2</Button>
              <Button onClick={() => handleButtonPress('3')} className="bg-gray-600">3</Button>
              <Button onClick={() => handleButtonPress('+')} className="bg-indigo-800 text-gray-100">+</Button>

              {/* Row 6 */}
              <Button onClick={toggleSign} className="bg-gray-600">+/-</Button>
              <Button onClick={() => handleButtonPress('0')} className="bg-gray-600">0</Button>
              <Button onClick={() => handleButtonPress('.')} className="bg-gray-600">.</Button>
              <Button onClick={calculateResult} className="bg-purple-700 text-white">=</Button>
            </div>
          </div>
        )}

        {/* Advanced Functions */}
        {activeTab === 'advanced' && (
          <div className="p-3">
            {/* Function tabs */}
            <div className="flex overflow-x-auto mb-2 pb-1 border-b border-gray-700">
              <button 
                className={`px-3 py-1 text-xs mr-2 rounded-t-lg ${!showConstants && !showStatistics && !showConversions ? 'bg-gray-700 text-purple-400' : 'text-gray-400'}`}
                onClick={() => {
                  setShowConstants(false);
                  setShowStatistics(false);
                  setShowConversions(false);
                }}
              >
                Functions
              </button>
              <button 
                className={`px-3 py-1 text-xs mr-2 rounded-t-lg ${showConstants ? 'bg-gray-700 text-purple-400' : 'text-gray-400'}`}
                onClick={() => {
                  setShowConstants(true);
                  setShowStatistics(false);
                  setShowConversions(false);
                }}
              >
                Constants
              </button>
              <button 
                className={`px-3 py-1 text-xs mr-2 rounded-t-lg ${showHistory ? 'bg-gray-700 text-purple-400' : 'text-gray-400'}`}
                onClick={() => {
                  setShowHistory(!showHistory);
                  setShowConstants(false);
                  setShowStatistics(false);
                  setShowConversions(false);
                }}
              >
                History
              </button>
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className="mb-3 p-2 bg-gray-900 rounded-lg max-h-36 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center p-2">No history yet</p>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className="text-sm border-b border-gray-800 py-1">
                      <div className="text-gray-400">{item.expression}</div>
                      <div className="text-right font-bold">{item.result}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Constants Panel */}
            {showConstants && (
              <div className="mb-3 grid grid-cols-2 gap-2">
                <Button onClick={() => handleConstant('PI')} className="bg-gray-700">π (Pi)</Button>
                <Button onClick={() => handleConstant('E')} className="bg-gray-700">e (Euler's)</Button>
                <Button onClick={() => handleConstant('PHI')} className="bg-gray-700">φ (Golden)</Button>
                <Button onClick={() => handleConstant('G')} className="bg-gray-700">g (Gravity)</Button>
                <Button onClick={() => handleConstant('NA')} className="bg-gray-700 text-sm">N<sub>A</sub> (Avogadro)</Button>
                <Button onClick={() => handleConstant('H')} className="bg-gray-700">h (Planck)</Button>
              </div>
            )}

            {/* Advanced Functions */}
            {!showConstants && !showStatistics && !showConversions && (
              <>
                {/* Toggle Angle Mode */}
                <div className="flex justify-center mb-3">
                  <button 
                    onClick={toggleAngleMode} 
                    className={`px-4 py-1 rounded-full text-sm ${
                      isRadian ? 'bg-purple-700' : 'bg-gray-700'
                    }`}
                  >
                    {isRadian ? 'RAD' : 'DEG'}
                  </button>
                </div>

                {/* Advanced Functions Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Row 1 */}
                  <Button onClick={() => handleFunction('pow')} className="bg-gray-700">x^y</Button>
                  <Button onClick={() => handleFunction('square')} className="bg-gray-700">x²</Button>
                  <Button onClick={() => handleFunction('cube')} className="bg-gray-700">x³</Button>
                  <Button onClick={() => handleFunction('factorial')} className="bg-gray-700">n!</Button>

                  {/* Row 2 */}
                  <Button onClick={() => handleFunction('sqrt')} className="bg-gray-700">√x</Button>
                  <Button onClick={() => handleFunction('cbrt')} className="bg-gray-700">∛x</Button>
                  <Button onClick={() => handleFunction('exp')} className="bg-gray-700">e^x</Button>
                  <Button onClick={() => handleFunction('ln')} className="bg-gray-700">ln</Button>

                  {/* Row 3 */}
                  <Button onClick={() => handleFunction('log')} className="bg-gray-700">log₁₀</Button>
                  <Button onClick={() => handleFunction('log_base')} className="bg-gray-700">log_b</Button>
                  <Button onClick={() => handleFunction('nPr')} className="bg-gray-700">nPr</Button>
                  <Button onClick={() => handleFunction('nCr')} className="bg-gray-700">nCr</Button>

                  {/* Row 4 - Trigonometric */}
                  <Button onClick={() => handleFunction('sin')} className="bg-indigo-800">sin</Button>
                  <Button onClick={() => handleFunction('cos')} className="bg-indigo-800">cos</Button>
                  <Button onClick={() => handleFunction('tan')} className="bg-indigo-800">tan</Button>
                  <Button onClick={() => handleButtonPress('π')} className="bg-indigo-800">π</Button>

                  {/* Row 5 - Inverse Trig */}
                  <Button onClick={() => handleFunction('asin')} className="bg-indigo-800">sin⁻¹</Button>
                  <Button onClick={() => handleFunction('acos')} className="bg-indigo-800">cos⁻¹</Button>
                  <Button onClick={() => handleFunction('atan')} className="bg-indigo-800">tan⁻¹</Button>
                  <Button onClick={() => handleFunction('ans')} className="bg-purple-700">ANS</Button>

                  {/* Row 6 - Other Trig */}
                  <Button onClick={() => handleFunction('csc')} className="bg-indigo-800">csc</Button>
                  <Button onClick={() => handleFunction('sec')} className="bg-indigo-800">sec</Button>
                  <Button onClick={() => handleFunction('cot')} className="bg-indigo-800">cot</Button>
                  <Button onClick={calculateResult} className="bg-purple-700">=</Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tools */}
        {activeTab === 'tools' && (
          <div className="p-3">
            <div className="flex overflow-x-auto mb-2 pb-1 border-b border-gray-700">
              <button 
                className={`px-3 py-1 text-xs mr-2 rounded-t-lg ${showStatistics ? 'bg-gray-700 text-purple-400' : 'text-gray-400'}`}
                onClick={() => {
                  setShowStatistics(true);
                  setShowConversions(false);
                }}
              >
                Statistics
              </button>
              <button 
                className={`px-3 py-1 text-xs mr-2 rounded-t-lg ${showConversions ? 'bg-gray-700 text-purple-400' : 'text-gray-400'}`}
                onClick={() => {
                  setShowConversions(true);
                  setShowStatistics(false);
                }}
              >
                Conversions
              </button>
            </div>

            {/* Statistics */}
            {showStatistics && (
              <div className="p-2 bg-gray-900 rounded-lg">
                <div className="mb-2">
                  <label className="block text-sm text-gray-400 mb-1">Enter comma-separated values:</label>
                  <textarea 
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
                    rows="3"
                    value={statisticalValues}
                    onChange={(e) => setStatisticalValues(e.target.value)}
                    placeholder="e.g., 1, 2, 3, 4, 5"
                  />
                </div>
                <button 
                  className="w-full py-2 bg-purple-700 rounded-lg hover:bg-purple-600 transition-colors mb-2"
                  onClick={() => setConversionResult(calculateStatistics())}
                >
                  Calculate
                </button>
                <div className="mt-2 p-2 bg-gray-800 rounded whitespace-pre-line text-sm">
                  {conversionResult}
                </div>
              </div>
            )}

            {/* Conversions */}
            {showConversions && (
              <div className="p-2 bg-gray-900 rounded-lg">
                <div className="mb-2">
                  <label className="block text-sm text-gray-400 mb-1">Conversion Type:</label>
                  <select 
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
                    value={conversionType}
                    onChange={(e) => setConversionType(e.target.value)}
                  >
                    <option value="degRad">Degrees ↔ Radians</option>
                    <option value="decFrac">Decimal ↔ Fraction</option>
                    <option value="numSys">Number Systems (Bin/Oct/Dec/Hex)</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm text-gray-400 mb-1">Enter value:</label>
                  <input 
                    type="text"
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
                    value={conversionInput}
                    onChange={(e) => setConversionInput(e.target.value)}
                    placeholder="Enter value to convert"
                  />
                </div>
                <button 
                  className="w-full py-2 bg-purple-700 rounded-lg hover:bg-purple-600 transition-colors mb-2"
                  onClick={handleConversion}
                >
                  Convert
                </button>
                <div className="mt-2 p-2 bg-gray-800 rounded whitespace-pre-line text-sm">
                  {conversionResult}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Footer with info */}
        <div className="bg-gray-900 p-2 text-center text-xs text-gray-500">
          Scientific Calculator
        </div>
      </div>
    </div>
  );
}