export default function Validator({ expectedSign, currentSign }) {
  const validate = (expectedSign, currentSign) => {
    return expectedSign==currentSign
  }

 if(validate(expectedSign, currentSign)) {              
  return <div>'Correct'</div>}
 else return <div>{expectedSign} {currentSign}</div>
}