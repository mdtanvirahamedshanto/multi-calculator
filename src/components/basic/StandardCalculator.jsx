import { useState, useEffect } from 'react';
import * as math from 'mathjs';

export default function StandardCalculator() {
  const [display, setDisplay] = useState('0');
  const [currentInput, setCurrentInput] = useState('0');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperation, setPendingOperation] = useState(null);
  const [storedValue, setStoredValue] = useState(null);
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);

  // Update the expression whenever relevant state changes
  useEffect(() => {
    let newExpression = '';
    
    if (storedValue !== null) {
      newExpression += String(storedValue);
    }
    
    if (pendingOperation) {
      newExpression += ` ${pendingOperation} `;
    }
    
    if (pendingOperation && !waitingForOperand) {
      newExpression += currentInput;
    }
    
    setExpression(newExpression || currentInput);
  }, [storedValue, pendingOperation, currentInput, waitingForOperand]);

  const clearAll = () => {
    setDisplay('0');
    setCurrentInput('0');
    setWaitingForOperand(false);
    setPendingOperation(null);
    setStoredValue(null);
    setExpression('');
  };

  const clearEntry = () => {
    setDisplay('0');
    setCurrentInput('0');
  };

  const toggleSign = () => {
    const value = -parseFloat(currentInput);
    setCurrentInput(String(value));
    setDisplay(String(value));
  };

  const percentage = () => {
    const value = parseFloat(currentInput) / 100;
    setCurrentInput(String(value));
    setDisplay(String(value));
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setCurrentInput('0.');
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!currentInput.includes('.')) {
      setCurrentInput(`${currentInput}.`);
      setDisplay(`${currentInput}.`);
    }
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setCurrentInput(digit);
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setCurrentInput(currentInput === '0' ? digit : `${currentInput}${digit}`);
      setDisplay(currentInput === '0' ? digit : `${currentInput}${digit}`);
    }
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(currentInput);

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (pendingOperation) {
      const newValue = calculateResult(storedValue, inputValue, pendingOperation);
      setStoredValue(newValue);
      setDisplay(String(newValue));
      
      // Add to history
      const historyItem = `${storedValue} ${pendingOperation} ${inputValue} = ${newValue}`;
      setHistory(prevHistory => [historyItem, ...prevHistory.slice(0, 2)]);
    }

    setWaitingForOperand(true);
    setPendingOperation(nextOperator);
  };

  const calculateResult = (a, b, operator) => {
    switch (operator) {
      case '+': return math.add(a, b);
      case '-': return math.subtract(a, b);
      case '×': return math.multiply(a, b);
      case '÷': return math.divide(a, b);
      default: return b;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(currentInput);

    if (pendingOperation && storedValue !== null) {
      const newValue = calculateResult(storedValue, inputValue, pendingOperation);
      
      // Add to history
      const historyItem = `${storedValue} ${pendingOperation} ${inputValue} = ${newValue}`;
      setHistory(prevHistory => [historyItem, ...prevHistory.slice(0, 2)]);
      
      // Update display
      setDisplay(String(newValue));
      setCurrentInput(String(newValue));
      setStoredValue(null);
      setPendingOperation(null);
      setWaitingForOperand(true);
      setExpression('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= '0' && event.key <= '9') {
        inputDigit(event.key);
      } else {
        switch (event.key) {
          case '+': performOperation('+'); break;
          case '-': performOperation('-'); break;
          case '*': performOperation('×'); break;
          case '/': performOperation('÷'); break;
          case '.': inputDecimal(); break;
          case 'Enter': handleEquals(); break;
          case 'Escape': clearAll(); break;
          case 'Backspace': clearEntry(); break;
          case '%': percentage(); break;
          default: break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="w-80 bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
        {/* History display */}
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
          {history.map((item, index) => (
            <div key={index} className="text-gray-400 text-xs text-right">{item}</div>
          ))}
        </div>
        
        {/* Expression display */}
        <div className="h-10 px-6 flex justify-end items-center bg-gray-800 text-gray-400 text-lg">
          {expression}
        </div>
        
        {/* Main display */}
        <div className="h-20 px-6 flex justify-end items-end bg-gray-800 text-white text-4xl font-medium overflow-hidden">
          {display}
        </div>
        
        {/* Calculator buttons */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-gray-900">
          {/* Row 1 */}
          <button 
            onClick={clearAll} 
            className="bg-gray-700 text-white p-4 rounded-xl text-lg font-medium hover:bg-gray-600 active:bg-gray-500 transition-colors shadow-md"
          >
            AC
          </button>
          <button 
            onClick={clearEntry} 
            className="bg-gray-700 text-white p-4 rounded-xl text-lg font-medium hover:bg-gray-600 active:bg-gray-500 transition-colors shadow-md"
          >
            C
          </button>
          <button 
            onClick={percentage} 
            className="bg-gray-700 text-white p-4 rounded-xl text-lg font-medium hover:bg-gray-600 active:bg-gray-500 transition-colors shadow-md"
          >
            %
          </button>
          <button 
            onClick={() => performOperation('÷')} 
            className="bg-amber-500 text-white p-4 rounded-xl text-xl font-medium hover:bg-amber-400 active:bg-amber-300 transition-colors shadow-md"
          >
            ÷
          </button>
          
          {/* Row 2 */}
          <button 
            onClick={() => inputDigit('7')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            7
          </button>
          <button 
            onClick={() => inputDigit('8')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            8
          </button>
          <button 
            onClick={() => inputDigit('9')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            9
          </button>
          <button 
            onClick={() => performOperation('×')} 
            className="bg-amber-500 text-white p-4 rounded-xl text-xl font-medium hover:bg-amber-400 active:bg-amber-300 transition-colors shadow-md"
          >
            ×
          </button>
          
          {/* Row 3 */}
          <button 
            onClick={() => inputDigit('4')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            4
          </button>
          <button 
            onClick={() => inputDigit('5')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            5
          </button>
          <button 
            onClick={() => inputDigit('6')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            6
          </button>
          <button 
            onClick={() => performOperation('-')} 
            className="bg-amber-500 text-white p-4 rounded-xl text-xl font-medium hover:bg-amber-400 active:bg-amber-300 transition-colors shadow-md"
          >
            -
          </button>
          
          {/* Row 4 */}
          <button 
            onClick={() => inputDigit('1')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            1
          </button>
          <button 
            onClick={() => inputDigit('2')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            2
          </button>
          <button 
            onClick={() => inputDigit('3')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            3
          </button>
          <button 
            onClick={() => performOperation('+')} 
            className="bg-amber-500 text-white p-4 rounded-xl text-xl font-medium hover:bg-amber-400 active:bg-amber-300 transition-colors shadow-md"
          >
            +
          </button>
          
          {/* Row 5 */}
          <button 
            onClick={toggleSign} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            +/-
          </button>
          <button 
            onClick={() => inputDigit('0')} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            0
          </button>
          <button 
            onClick={inputDecimal} 
            className="bg-gray-800 text-white p-4 rounded-xl text-xl font-medium hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md"
          >
            .
          </button>
          <button 
            onClick={handleEquals} 
            className="bg-amber-500 text-white p-4 rounded-xl text-xl font-medium hover:bg-amber-400 active:bg-amber-300 transition-colors shadow-md"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}