import "./styles.css";
import { useReducer } from 'react';
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit'
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }

      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      };
      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOperand == null && state.previousOperand == null) {
          return state
        }
        if(state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }
        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation
          }
        }
         // to calculate the prev each time new operation is clicked
        return {
          ...state,
          operation: payload.operation,
          previousOperand: evaluate(state),
          currentOperand: null,
        }
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite){
          return{
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }
        if(state.currentOperand == null) return state
        if(state.currentOperand.length === 1) {
          return {
            ...state,
            currentOperand: null
          }
          

        }
        return{
          ...state,
          currentOperand: state.currentOperand.slice(0,-1)
        }
      case ACTIONS.EVALUATE:
        
          if(state.operation == null ||
             state.previousOperand == null ||
             state.currentOperand == null) {
              return state
             }
          return {
            ...state,
            overwrite: true,
            operation: null,
            previousOperand: null,
            currentOperand: evaluate(state)
          }
        
      
      case ACTIONS.CLEAR:
        return {}
    
  }
}
function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(curr)) return ""
  let compute = ""
  switch(operation){
    case "+":
      compute = prev + curr
      break
    case "-":
      compute = prev - curr
      break
    case "*":
      compute = prev * curr
      break
    case "/":
      compute = prev / curr
      break
  }
  return compute.toString()

}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {
    currentOperand: '',   // Initialize currentOperand
    previousOperand: '',  // Initialize previousOperand
    operation: ''         // Initialize operation
  });

  // dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit : 1}})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;





