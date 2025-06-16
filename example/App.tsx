import * as React from 'react';
import useValidation, { ValidationInputType } from '../.';

interface InputProps extends ValidationInputType {
  placeholder?: string;
  as?: 'textarea' | 'input';
}

const App = () => {
  const _inputs: Array<InputProps> = [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'Mohamed',
      placeholder: 'Full Name',
      required: true,
      //regExp: '',
      messages: {
        required: 'the field is required',
      },
    },
    {
      name: 'user-email',
      type: 'email',
      placeholder: 'E-mail',
      defaultValue: '',
      regExp: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      required: true,
      messages: {
        required: '',
        regExp: 'the field is invalid',
      },
    },
    {
      name: 'phone',
      type: 'text',
      placeholder: 'Phone',
      defaultValue: '0552000000',
      regExp: /^[0]{1}[5-7]{1}[0-9]{8}$/m,
      required: true,
      messages: {
        required: '',
        regExp: 'رقم الهاتف غير الصالح',
      },
    },
    {
      name: 'password',
      type: 'password',
      defaultValue: '',
      placeholder: 'Password',
      required: true,
      //regExp: '',
      minLength: -8,
      maxLength: 20,
      messages: {
        required: '',
        regExp: '',
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
      //regExp: '',
      match: 'password',
      messages: {
        regExp: '',
        match: '',
      },
    },
    {
      name: 'buying_price',
      type: 'text',
      defaultValue: '',
      required: true,
      placeholder: 'Buying price',
      //regExp: '',
      min: -10,
      max: 20,
      messages: {
        regExp: '',
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
        regExp: '',
        match: '',
        min: '',
        max: '',
      },
    },
    {
      name: 'start_date',
      type: 'datetime-local',
      defaultValue: '',
      placeholder: 'Start Date',
      required: true,
      min: '2025-06-01',
      lt: 'end_date',
      //regExp: '',
      messages: {
        regExp: '',
        match: '',
        min: '',
        max: '',
      },
    },
    {
      name: 'end_date',
      type: 'datetime-local',
      defaultValue: '',
      placeholder: 'End Date',
      max: new Date(),
      required: true,
      gt: 'start_date',
      //regExp: '',
      messages: {
        regExp: '',
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
      //regExp: '',
      messages: {
        required: '',
        regExp: '',
        match: '',
      },
    },
  ];

  const [inputs, setInputs] = React.useState<Array<InputProps>>(_inputs);

  const {
    errors,
    handleOnSubmit,
    refForm,
    handleOnChange,
    data,
  } = useValidation(React.useMemo(() => inputs, [inputs]));

  /*const errors: any = {};
  const handleOnSubmit = (s: any, e: any) => null;
  const refForm = React.useRef<any>(null)
  const data: any = {};
  const handleOnChange = (e: any) => null;*/

  const addNewInput = () => {
    const name = 'input_' + Number((Math.random() * 1000).toFixed(0));
    setInputs([
      ...inputs,
      {
        name: name,
        type: 'text',
        defaultValue: Number((Math.random() * 1000).toFixed(0)),
        placeholder: name,
        required: true,
        regExp: /^[\d.]+$/m,
        messages: {
          regExp: 'The field must be a number',
        },
      },
    ]);
  };

  const deleteInput = (name: string) => {
    setInputs(inputs.filter(item => item.name !== name));
  };

  const onSubmit = (status: boolean) => {
    console.log({ status });
    console.log(errors);
    console.log(data);
  };

  const getValue = (value: any, defaultValue: any) => {
    if (value === undefined) {
      return defaultValue || '';
    } else {
      return value;
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
      <form onSubmit={event => handleOnSubmit(event, onSubmit)} ref={refForm} noValidate>
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
                    //defaultValue={item.defaultValue}
                    className={`form-control`}
                    onChange={handleOnChange}
                    placeholder={item.placeholder}
                    value={getValue(data[item.name], item.defaultValue)}
                    //required={item.required}
                    style={{ minHeight: 100, minWidth: 200 }}
                  />
                ) : (
                  <input
                    type={item.type}
                    name={item.name}
                    //defaultValue={item.defaultValue}
                    className={`form-control`}
                    onChange={handleOnChange}
                    placeholder={item.placeholder}
                    value={getValue(data[item.name], item.defaultValue)}
                    //required={item.required}
                    style={{ minHeight: 35, width: 200 }}
                  />
                )}
                <button
                  onClick={() => deleteInput(item.name)}
                  style={{ margin: '0 5px' }}
                  type="button"
                >
                  Delete
                </button>
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
