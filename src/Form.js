import React, { useState, useRef, useMemo, Children } from 'react'
import PropTypes from 'prop-types'
import styles from './Form.module.css'


/**
 * Reusable custom form component. Supports easy creation of form view and logic
 * 
 * @component
 */
export default function Form(props) {
  const {
    className,
    children, 
    onSubmit, 
    submitLabel,
    submitClassName 
  } = props

  /**
   * Holds the values of each form field and errors if they have any 
   */
  const values = useRef({}) // Example: values.current['email'] = "abc@xyz.com"
  const errors = useRef({}) // Example: errors.current['email] = false


  /**
   * Error count is a state. If its value is more than 0, the submit button disappears.
   */
  const [errorCount, setErrorCount] = useState(0)


  /**
   * While the form is submitting, do the required things
   */
  const onClickSubmit = useMemo(() => event => {
    /* Preventing form's default behaviour */
    event.preventDefault()
    /* Do some common works */
    /* Do custom works */
    onSubmit(values.current)

  }, [onSubmit])


  /**
   * Saves a new value for a particular field name. 
   * This method is passed to all the child field components and only gets called from inside them 
   */
  const onValidValue = useMemo(() => (name, value) => {
    /* Save the value */
    values.current[name] = value
    
    /* Remove the previously happened error if any */
    if (errors.current[name]) {
      errors.current[name] = false
      setErrorCount(c => c - 1) // TODO: keep this in a ref, and use this to manipulate a boolean state
    }
  }, [])


  /**
   * Records an error for a particular field name. 
   * This method is passed to all the child field components and only gets called from inside them 
   */
  const onError = useMemo(() => name => {
    /* Flag an error for this field. Ignore if it is already flagged */
    if (!errors.current[name]) {
      errors.current[name] = true
      setErrorCount(c => c + 1)
    }
  }, [])


  return (
    <form className={`${styles.Form} ${className}`} onSubmit={onClickSubmit}>
      
      {/* Pass two functions "onValidValue" and "onError" to the child field components */}
      {
        Children.map(children, function(element) {
          return React.cloneElement(
            element,
            {
              onValidValue,
              onError
            }
          )
        })
      }
      
      {/* Show the submit button if there are totally no errors */}
      {
        !errorCount && (
          <div className="tac">
            <input className={`${styles.submitBtn} ${submitClassName}`} 
              type='submit' 
              value={submitLabel || 'Submit'}/>
          </div>
        )
      }
    </form>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string // Label of the submit button
}
