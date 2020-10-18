import React, { useEffect, useState } from 'react'
import { Formular, Formularfield } from 'react-formular'
import 'react-formular/dist/index.css'

const App = () => {
  return (
    <Formular
      onSubmit={
        formData => {
          // 'formData' contains the values of all the form fields by their name
          // Do whatever you like with this data when the form is submitted
          // Example: formData.email should contain the value of the email field
        }
      }
    >
      <Formularfield
        className='example'
        name="fullname"
        type="text"
        placeholder="Your name"
      />

      <Formularfield
        name="email"
        type="email"
        placeholder="Enter a password"
        validate={ value => !!value && value.indexOf('@') !== -1 }
        errorMsg={ <b>Must be a real email</b> }
      />

      <Formularfield
        name="password"
        placeholder="Enter a password"
        type="password"
        validate={ value => value.length > 5 && /^(([a-z]+)|([A-Z]+))+$/ }
        errorMsg={
          value => {
            if (value.length <= 5) return <b>Password must be larger than 5 characters</b>
            return 'Password is invalid'
          }
        }
      />

      <Formularfield
        name="gender"
        type="dropdown"
        placeholder="Your gender"
        defaultValue={'M'}
        options={[
          { name: "Male", value: "M" },
          { name: "Female", value: "F" },
          { name: "Whatever", value: "X" }
        ]}
      />

      {/* To create a custom complex field */}
      <FormField
        name="example"
        type="component"
        validate={
          function (value) {
            // do whatever validation you want, return a boolean
          }
        }
        getErrorMsg={
          function (value) {
            // must return a string / react element with custom error message
          }
        }
        Component={
          function CustomFormField(props) {
            /* This onChange function is provided by parent Form */
            const { onChange } = props

            /* Store your custom field value in a internal state */
            const [value, setValue] = useState() 

            /* When the value changes, inform parent form about it */
            useEffect(
              function sendValueToParentForm() {
                onChange(value)
              },
              [value]
            )

            return <>
              <input type="text" onChange={ e => setValue(e.target.value)}/>
            </>
          }
        }
      />

      {/* A submit button will automatically appear when all form fields have valid data */}
    </Formular>
  )
}

export default App
