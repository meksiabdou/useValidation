import React from 'react'
import useValidation from '@meksiabdou/usevalidation'

const App = () => {
  const { errors, handelOnSubmit, refForm, handelOnChange, data } =
    useValidation({})

  const onSubmit = (status: boolean) => {
    console.log(status, data)
  }

  return (
    <div
      style={{
        margin: '50px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <form onSubmit={(event) => handelOnSubmit(event, onSubmit)} ref={refForm}>
        <div className='title'>
          <h4>{'Login'}</h4>
        </div>
        <div className='form-group'>
          <span className='error form-text'>
            {errors.email && errors.email}
          </span>
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

        <br />

        <div>
          <span className='error form-text'>
            {errors.password && errors.password}
          </span>
          <div className={`input-group`}>
            <input
              type={'password'}
              name='password'
              defaultValue=''
              className={`form-control ${errors.password ? 'input-error' : ''}`}
              onChange={handelOnChange}
              placeholder={'password'}
            />
          </div>
        </div>

        <br />

        <div>
          <span className='error form-text'>
            {errors.confirmPassword && errors.confirmPassword}
          </span>
          <div className={`input-group`}>
            <input
              type={'password'}
              name='confirmPassword'
              defaultValue=''
              className={`form-control ${
                errors.confirmPassword ? 'input-error' : ''
              }`}
              onChange={handelOnChange}
              placeholder={'Confirm Password'}
            />
          </div>
        </div>

        <br />

        <div>
          <span className='error form-text'>
            {(errors as any).information && (errors as any).information}
          </span>
          <div className={`input-group`}>
            <textarea
              //type={'password'}
              name='information'
              defaultValue=''
              value={data['information']}
              className={`form-control ${
                (errors as any).information ? 'input-error' : ''
              }`}
              onChange={handelOnChange}
              placeholder={'information'}
            />
          </div>
        </div>

        <button type='submit' className='btn btn-default btn-submit'>
          login
        </button>
      </form>
    </div>
  )
}

export default App
