# @meksiabdou/usevalidation

> Hook useValidation for reactjs

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add https://github.com/meksiabdou/usevalidation
```

## Usage

```tsx
import React from 'react';
import useValidation, {ValidationInputType} from '@meksiabdou/usevalidation';


interface InputProps extends ValidationInputType  {
  placeholder?: string;
}

const App = () => {
  const inputs: Array<InputProps> = [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'Mohamed',
      placeholder: 'name',
      required: true,
      //regex: '',
      messages: {
        required: 'the is required',
      }
    },
    {
      name: 'email',
      type: 'text',
      placeholder: 'email',
      defaultValue: 'mohamed@example.com',
      regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      required: true,
      messages: {
        required: '',
        regex: 'the is invalid'
      }
    },
    {
      name: 'phone',
      type: 'text',
      placeholder: 'phone',
      defaultValue: '0552000000',
      regex: /^[0]{1}[5-7]{1}[0-9]{8}$/m,
      required: true,
      messages: {
        required: '',
        regex: ''
      }
    },
    {
      name: 'password',
      type: 'password',
      defaultValue: '',
      placeholder: 'password',
      required: true,
      //regex: '',
      minLength: 8,
      maxLength: 20,
      messages: {
        required: '',
        regex: '',
        min: '',
        max: '',
        minLength: '',
        maxLength: ''
      }
    },
    {
      name: 'confirm-password',
      type: 'password',
      defaultValue: '',
      placeholder: 'confirm password',
      required: true,
      //regex: '',
      match: 'password',
      messages: {
        regex: '',
        match: ''
      }
    },
    {
      name: 'amount',
      type: 'text',
      defaultValue: '',
      placeholder: 'amount',
      //regex: '',
      min: 8,
      max: 20,
      messages: {
        regex: '',
        match: '',
        min: '',
        max: ''
      }
    },
    {
      name: 'message',
      type: 'textarea',
      defaultValue: '',
      placeholder: 'message',
      //regex: '',
      messages: {
        required: '',
        regex: '',
        match: ''
      }
    }
  ];

  const { errors, handelOnSubmit, refForm, handelOnChange, data } =
    useValidation(inputs);

  const onSubmit = (status: boolean) => {
    console.log(status, data, errors);
  };

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
          <h4>{'Form'}</h4>
        </div>

        {inputs.map((item) => {
          return (
            <div
              className='form-group'
              style={{ marginBottom: 10 }}
              key={item.name}
            >
              <p
                className='error form-text'
                style={{ color: '#ff0000', marginBottom: 5 }}
              >
                {errors[item.name] && errors[item.name]}
              </p>
              <div className={`input-group`}>
                {item.type === 'textarea' ? (
                  <textarea
                    name={item.name}
                    defaultValue={item.defaultValue}
                    className={`form-control`}
                    onChange={handelOnChange}
                    placeholder={item.placeholder}
                    //required={item.required}
                    style={{ minHeight: 100, minWidth: 200 }}
                  />
                ) : (
                  <input
                    type={item.type}
                    name={item.name}
                    defaultValue={item.defaultValue}
                    className={`form-control`}
                    onChange={handelOnChange}
                    placeholder={item.placeholder}
                    //required={item.required}
                    style={{ minHeight: 35, width: 200 }}
                  />
                )}
              </div>
            </div>
          );
        })}
        <br />
        <button type='submit' className='btn btn-default btn-submit'>
          login
        </button>
      </form>
    </div>
  );
};

export default App;
```

## License

MIT © [meksiabdou](https://github.com/meksiabdou)
