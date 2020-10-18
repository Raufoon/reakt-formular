import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './FormField.module.css'

/**
 * Reusable custom form field component. Must be added inside a <Form/> component
 * 
 * @component
 */
export default function FormField(props) {
  const {
    name,
    type,
    validate,
    errorMsg,
    title,
    placeholder,
    defaultValue,
    onValidValue,
    onError,
    className,
    Component,
    getErrorMsg,
    options
  } = props


  const [error, setErrorState] = useState(false)


  useEffect(function initialFeedbackToParentForm() {
    if (!validate || validate(defaultValue || "")) {
      onValidValue(name, defaultValue);
    }
    else {
      onError(name)
    }
  }, [name, validate, defaultValue, onError, onValidValue])


  const onChange = useMemo(() => event => {
    const { name, value } = event.target

    if (!validate || validate(value)) {
      /* Inform the parent Form about the new value */
      onValidValue(name, value)

      setErrorState(false) // TODO: Conditionally set this state to prevent unnecessary render
    }
    else {
      const currentError = getErrorMsg ? getErrorMsg(value) : errorMsg 
      setErrorState(currentError) // TODO: Conditionally set this state to prevent unnecessary render

      /* Inform the parent Form about the new error */
      onError(name)
    }
  }, [validate, onValidValue, onError, getErrorMsg, errorMsg])


  return (
    <div className={`${styles.FormField} ${className}`}>
      {/* Title of the form */}
      {
        !!title &&
        <label className={styles.title}>{title}</label>
      }

      {
        type === 'component' && <Component onChange={onChange} />
      }

      {
        type === "dropdown" && (
          <select
            className={styles.input}
            name={name}
            onChange={onChange}
            defaultValue={defaultValue}
            placeholder={placeholder}
          >
            <option
              value="xxx"
              style={{ display: 'none' }}
              > Select {name} </option>
            {
              options.map(function (option) {
                return (
                  <option
                    key={option.value}
                    value={option.value}
                  >{option.value}
                  </option>
                )
              })
            }
          </select>
        )
      }

      {/* Actual form field */}
      {
        type !== 'component' && type !== 'dropdown' && (
          <input className={styles.input}
            name={name}
            type={type}
            onChange={onChange}
            defaultValue={defaultValue}
            placeholder={placeholder} />
        )
      }

      {/* Show error message if an error has happened */}
      {
        error && <div className={styles.error}>
          {error}
        </div>
      }
    </div>
  )
}

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  validate: PropTypes.func, // A function "(value) => boolean" to validate the input value
  errorMsg: PropTypes.any,
  title: PropTypes.string, // A nice heading above the input
  placeholder: PropTypes.string,
  defaultValue: PropTypes.any,
  Compoent: PropTypes.func,

  /**
   * These properties are automatically given by the parent <Form/> component. 
   * @warning Do not provide them by yourself 
   */
  onValidValue: PropTypes.func,
  onError: PropTypes.func,

  options: PropTypes.array
}
