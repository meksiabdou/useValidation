import React from 'react'
import useValidation from '@meksiabdou/usevalidation'

const App = () => {
  const { errors, handelOnSubmit, refForm, handelOnChange, data } =
    useValidation({})

  const onSubmit = (status: boolean) => {
    console.log(status, data)
  }

  return (
    <form onSubmit={(event) => handelOnSubmit(event, onSubmit)} ref={refForm}>
      <div className='title'>
        <h4>{'Login'}</h4>
      </div>
      <div className='form-group'>
        <span className='error form-text'>{errors.email && errors.email}</span>
        <div className={`input-group`}>
          <input
            type='email'
            name='email'
            defaultValue='contact@example.com'
            className={`form-control`}
            onChange={handelOnChange}
            placeholder={'email'}
          />
        </div>
      </div>
      <div>
        <span className='error form-text'>
          {errors.password && errors.password}
        </span>
        <div className={`input-group`}>
          <input
            type={'password'}
            name='password'
            defaultValue='@10203040@'
            className={`form-control ${errors.password ? 'input-error' : ''}`}
            onChange={handelOnChange}
            placeholder={'password'}
          />
        </div>
      </div>
      <button type='submit' className='btn btn-default btn-submit'>
        login
      </button>
    </form>
  )
}

export default App
