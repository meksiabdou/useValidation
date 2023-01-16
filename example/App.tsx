import * as React from 'react';
import useValidation, { ValidationInputType } from '../.';

interface InputProps extends ValidationInputType {
  placeholder?: string;
  as?: 'textarea' | 'input'
}

const App = () => {
  const _inputs: Array<InputProps> = [
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
        required: '',
        regex: 'the field is invalid',
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
        required: '',
        regex: '',
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
        required: '',
        regex: '',
        min: '',
        max: '',
        minLength: '',
        maxLength: '',
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
        regex: '',
        match: '',
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
        regex: '',
        match: '',
        min: '',
        max: '',
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
        regex: '',
        match: '',
        min: '',
        max: '',
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
        regex: '',
        match: '',
        min: '',
        max: '',
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
        regex: '',
        match: '',
        min: '',
        max: '',
      },
    },
    {
      name: 'start_time',
      type: 'time',
      defaultValue: '',
      placeholder: 'Start Time',
      //regex: '',
      messages: {
        regex: '',
        match: '',
        min: '',
        max: '',
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
        regex: '',
        match: '',
        min: '',
        max: '',
      },
    },
    {
      name: 'message',
      as: 'textarea',
      defaultValue: '',
      placeholder: 'Message',
      //regex: '',
      messages: {
        required: '',
        regex: '',
        match: '',
      },
    },
  ];

  const [inputs, setInputs] = React.useState<Array<InputProps>>(_inputs);

  const {
    errors,
    handelOnSubmit,
    refForm,
    handelOnChange,
    data,
  } = useValidation(inputs);

  /*const errors: any = {};
  const handelOnSubmit = (s: any, e: any) => null;
  const refForm = React.useRef<any>(null)
  const data: any = {};
  const handelOnChange = (e: any) => null;*/

  const addNewInput = () => {
    const name = 'input_' + Number((Math.random() * 1000).toFixed(0));
    setInputs([
      ...inputs,
      {
        name: name,
        type: 'text',
        defaultValue: '',
        placeholder: name,
        required: true,
        regex: /^[\d.]+$/m,
      },
    ]);
  };

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
      <form onSubmit={event => handelOnSubmit(event, onSubmit)} ref={refForm}>
        <div className="title">
          <h4>{'Form'}</h4>
        </div>

        {inputs.map((item, index) => {
          return (
            <div
              className="form-group"
              style={{ marginBottom: 10 }}
              key={index.toString()}
            >
              <p className="form-text">{item.placeholder}</p>
              <div className={`input-group`}>
                {item.as === 'textarea' ? (
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
              <p
                className="error form-text"
                style={{ color: '#ff0000', marginBottom: 5, marginTop: 10 }}
              >
                {errors[item.name] && errors[item.name]}
              </p>
            </div>
          );
        })}
        <br />
        <button type="submit" className="btn btn-default btn-submit">
          login
        </button>
        <br />
        <br />
        <button
          type="button"
          className="btn btn-default btn-submit"
          onClick={addNewInput}
        >
          Add new input
        </button>
      </form>
    </div>
  );
};

export default App;
