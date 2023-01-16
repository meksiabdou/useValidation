# @meksiabdou/usevalidation

> Hook useValidation for reactjs

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add https://github.com/meksiabdou/usevalidation.git
```

## Usage

```tsx
import React from 'react';
import useValidation, { ValidationInputType } from '@meksiabdou/usevalidation';

interface InputProps extends ValidationInputType {
  placeholder?: string;
}

const App = () => {
  const inputs: Array<InputProps> = [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'Mohamed',
      placeholder: 'Full Name',
      required: true,
      //regex: '',
      messages: {
        required: 'the field is required',
      },
    },
    {
      name: 'email',
      type: 'text',
      placeholder: 'E-mail',
      defaultValue: '',
      regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      required: true,
      messages: {
        required: 'the field is required',
        regex: 'email is invalid',
      },
    },
    {
      name: 'phone',
      type: 'text',
      placeholder: 'Phone',
      defaultValue: '0552000000',
      regex: /^[0]{1}[5-7]{1}[0-9]{8}$/m,
      required: true,
      messages: {
        required: 'the field is required',
        regex: 'phone is invalid',
      },
    },
    {
      name: 'password',
      type: 'password',
      defaultValue: '',
      placeholder: 'Password',
      required: true,
      //regex: '',
      minLength: 8,
      maxLength: 20,
      messages: {
        required: 'the password field is required',
        minLength: 'password should be more than 8 characters',
        maxLength: 'password must be less than or equal to 20 characters',
      },
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
        match: 'Be sure to match the password',
      },
    },
    {
      name: 'buying_price',
      type: 'text',
      defaultValue: '',
      required: true,
      placeholder: 'Buying price',
      //regex: '',
      min: 8,
      max: 20,
      messages: {
        required: 'the buying_priceis required',
      },
    },
    {
      name: 'selling_price',
      type: 'text',
      defaultValue: '',
      required: true,
      placeholder: 'Selling price',
      gte: 'buying_price',
      min: 8,
      max: 20,
      messages: {
        required: 'the selling price required',
        gte: 'Be sure to greater than or equal to buying price',
      },
    },
    {
      name: 'start_date',
      type: 'date',
      defaultValue: '',
      placeholder: 'Start Date',
      required: true,
      lt: 'end_date',
      //regex: '',
      messages: {
        required: 'the start date price required',
        lt: 'Be sure to less than end date',
      },
    },
    {
      name: 'end_date',
      type: 'date',
      defaultValue: '',
      placeholder: 'End Date',
      required: true,
      gt: 'start_date',
      //regex: '',
      messages: {
        required: 'the end date price required',
        gt: 'Be sure to greater than start date',
      },
    },
    {
      name: 'start_time',
      type: 'time',
      defaultValue: '',
      placeholder: 'Start Time',
      //regex: '',
      messages: {
        required: 'the Start Time price required',
      },
    },
    {
      name: 'end_time',
      type: 'time',
      defaultValue: '',
      placeholder: 'End Time',
      gte: 'start_time',
      //regex: '',
      messages: {
        required: 'the End Time price required',
        gte: 'Be sure to greater than or equal to Start Time',
      },
    },
    {
      name: 'message',
      as: 'textarea',
      defaultValue: '',
      placeholder: 'Message',
    },
  ];

  const { errors, handelOnSubmit, handelOnChange, data } = useValidation(
    inputs
  );

  const onSubmit = (status: boolean) => {
    if (status) {
      console.log(status, data);
    } else {
      console.log(status, errors);
    }
  };

  return (
    <div
      style={{
        margin: '50px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={event => handelOnSubmit(event, onSubmit)}>
        <div className="title">
          <h4>{'Form'}</h4>
        </div>

        {inputs.map(item => {
          return (
            <div
              className="form-group"
              style={{ marginBottom: 10 }}
              key={item.name}
            >
              <p
                className="error form-text"
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
        <button type="submit" className="btn btn-default btn-submit">
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
