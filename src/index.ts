/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react'

interface dataType {
  password?: string
  phone?: string
  confirmPassword?: string
  fullname?: string
  email?: string
  address?: string
  website?: string
  name?: string
  firstname?: string
  lastname?: string
}

const useValidation = ({
  inputNotReq,
  phoneRegex
}: {
  inputNotReq?: Array<string>
  phoneRegex?: RegExp
}) => {
  const [errors, setErrors] = useState<dataType>({})
  const [status, setStatus] = useState<boolean>(false)
  const [data, setData] = useState<dataType>({})
  const refForm = useRef<HTMLFormElement>(null)
  const urlRegex = new RegExp(
    /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i
  )
  const emailRegex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
  phoneRegex = phoneRegex
    ? new RegExp(phoneRegex)
    : new RegExp(/^[0]{1}[5-7]{1}[0-9]{8}$/m)
  inputNotReq = inputNotReq || []

  const validation = (name: string, value: string, type = 'text') => {
    let result = {
      status: true,
      error: ''
    } as {
      status: boolean
      error?: string
    }

    value = value?.toString()?.trim();

    try {
      if (value === '') {
        result = {
          status: false,
          error: 'The field is required'
        }
      } else {
        if (name === 'email' && !emailRegex.test(value)) {
          result = {
            status: false,
            error: 'Email Invalid'
          }
        } else if (type === 'url' && !urlRegex.test(value)) {
          result = {
            status: false,
            error: 'Url Invalid'
          }
        } else if (name === 'phone' && !phoneRegex?.test(value)) {
          result = {
            status: false,
            error: 'Phone number Invalid'
          }
        } else if (name === 'password' && value.length < 8) {
          result = {
            status: false,
            error: 'Password should be more than 8 characters'
          }
        }
      }
    } catch (e) {
      result = {
        status: false,
        error: undefined
      }
    }

    return result;
  }

  const handelOnSubmit = (
    event: React.FormEvent,
    callback: (status: boolean, e: React.FormEvent) => void
  ) => {
    event.preventDefault()
    // return errors;
    const elements = (event.target as HTMLFormElement).elements
    const errorsList = {}
    const _status: Array<boolean> = []

    for (const element in elements) {
      const elm = elements[element] as HTMLInputElement
      const name = elm.name
      const value = elm.value
      const type = elm.type

      if (elm && name && value !== undefined && !inputNotReq?.includes(name)) {
        let result = validation(name, value, type)

        if (name === 'confirmPassword') {
          if (data.password) {
            if (data.password === value) {
              result = {
                status: true
              }
            } else {
              result = {
                status: false,
                error: 'Be sure to match the two passwords'
              }
            }
          }
        }

        _status.push(result.status)

        if (result.status !== true) {
          errorsList[name] = result.error
        } else {
          delete errorsList[name]
        }
      }
    }

    //console.log(_status);
    

    setErrors(errorsList)
    setStatus(!(_status.length === 0 || _status.includes(false)))
    // eslint-disable-next-line standard/no-callback-literal
    return callback(!(_status.length === 0 || _status.includes(false)), event)
  }

  const handelOnChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = event.target.name
    const value = event.target.value
    let errorsList = errors

    let result = validation(name, value)

    if (inputNotReq?.includes(name)) {
      result = {
        status: true,
        error: ''
      }
    }

    if (name === 'confirmPassword') {
      if (data.password?.trim()) {
        if (data.password?.trim() === value?.trim()) {
          result = {
            status: true
          }
        } else {
          result = {
            status: false,
            error: 'Be sure to match the two passwords'
          }
        }
      } else {
        result = {
          status: false,
          error: 'Be sure to match the two passwords'
        }
      }
    }

    if (result.status === true) {
      delete errorsList[name]
    } else {
      errorsList = {
        ...errorsList,
        [name]: result.error
      }
    }

    if (name === 'password') {
      if (errors.confirmPassword) {
        delete errorsList.confirmPassword
      }
    }

    setStatus(result.status)
    setErrors(errorsList)

    setData({
      ...data,
      [name]: value
    })
  }

  const RefEvent = () => {
    const ref = refForm.current
    const dataInput = {}

    if (ref && ref !== null) {
      const inputs = ref.getElementsByTagName('input')
      const selects = ref.getElementsByTagName('select')
      const textarea = ref.getElementsByTagName('textarea')

      Object.keys(inputs).map((key) => {
        if (inputs[key].name) {
          dataInput[inputs[key].name] = inputs[key].value?.trim()
        }
        return true
      })

      Object.keys(textarea).map((key) => {
        if (textarea[key].name) {
          dataInput[textarea[key].name] = textarea[key].value
        }
        return true
      })

      Object.keys(selects).map((key) => {
        if (selects[key].name) {
          dataInput[selects[key].name] = selects[key].value?.trim()
        }
        return true
      })
    }
    return dataInput
  }

  useEffect(() => {
    setData(RefEvent())
  }, [refForm])

  return {
    errors,
    refForm,
    handelOnSubmit,
    handelOnChange,
    setData,
    RefEvent,
    status,
    data
  }
}

export default useValidation
