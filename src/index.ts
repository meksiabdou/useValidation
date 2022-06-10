/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import { isEmpty } from './utils/utils';
export interface ValidationInputType {
  name: string;
  type?: string;
  defaultValue?: string;
  // placeholder?: string;
  regex?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  match?: string;
  messages?: {
    regex?: string;
    min?: string;
    max?: string;
    match?: string;
    required?: string;
    minLength?: string;
    maxLength?: string;
  };
}

const messages = {
  regex: 'the {field} is invalid',
  min: '{field} should be more or equal than {min}',
  max: '{field} must be less than or equal to {max}',
  minLength: '{field} should be more than {min} characters',
  maxLength: '{field} must be less than or equal to {max} characters',
  match: 'Be sure to match the {match}',
  required: 'the {field} is required'
};

const defaultRegex = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  url: /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i
};

const useValidation = (inputs: Array<ValidationInputType>) => {
  const [errors, setErrors] = useState<any>({});
  const [data, setData] = useState<any>({});
  const refForm = useRef<HTMLFormElement>(null);

  const validation = ({ name, value }: { name: string; value: string }) => {
    const errorsList = {};
    const results = { status: false, errors: errorsList };
    try {
      const [field] = inputs.filter(
        (item) => item.name.toLowerCase() === name?.toLowerCase()
      );
      if (field) {
        if (field.required && isEmpty(value)) {
          errorsList[name] =
            field.messages?.required ||
            messages.required.replace('{field}', name);
        } else if (
          !field.required &&
          field.match &&
          data?.[field.match] &&
          value !== data?.[field.match]
        ) {
          errorsList[name] =
            field.messages?.match ||
            messages.match.replace('{match}', field.match);
        } else if (!field.required && isEmpty(value)) {
          results.status = true;
          if (name in errorsList) {
            delete errorsList[name];
          }
        } else if (
          (field.regex || defaultRegex?.[field?.name]) &&
          !new RegExp(field.regex || defaultRegex?.[field?.name]).test(value)
        ) {
          errorsList[name] =
            field.messages?.regex || messages.regex.replace('{field}', name);
        } else if (field.minLength && !(value.length >= field.minLength)) {
          errorsList[name] =
            field.messages?.minLength ||
            messages.minLength
              .replace('{min}', field.minLength.toString())
              .replace('{field}', name);
        } else if (field.maxLength && !(value.length <= field.maxLength)) {
          errorsList[name] =
            field.messages?.maxLength ||
            messages.maxLength
              .replace('{max}', field.maxLength.toString())
              .replace('{field}', name);
        } else if (field.min && !(Number(value) >= field.min)) {
          errorsList[name] =
            field.messages?.min ||
            messages.min
              .replace('{min}', field.min.toString())
              .replace('{field}', name);
        } else if (field.max && !(Number(value) <= field.max)) {
          errorsList[name] =
            field.messages?.max ||
            messages.max
              .replace('{max}', field.max.toString())
              .replace('{field}', name);
        } else if (
          field.match &&
          data?.[field.match] &&
          value !== data?.[field.match]
        ) {
          errorsList[name] =
            field.messages?.match ||
            messages.match.replace('{match}', field.match);
        } else {
          results.status = true;
          if (name in errorsList) {
            delete errorsList[name];
          }
        }
      }
      results.errors = errorsList;
      return results;
    } catch (error) {
      results.status = false;
      console.error(error);
      return results;
    }
  };

  const handelOnSubmit = (
    event: React.FormEvent,
    onSubmit: (status: boolean, e: React.FormEvent) => void
  ) => {
    try {
      event.preventDefault();
      const target = event.target as HTMLFormElement;
      const elements: any = [
        ...(target.querySelectorAll('input') as any),
        ...(target.querySelectorAll('textarea') as any),
        ...(target.querySelectorAll('select') as any)
      ];

      let i = 0;
      let results = [];
      const _errors = {};

      for (const element in elements) {
        const { value, name } = elements[element] as HTMLInputElement;
        if (name && inputs.map((item) => item.name).includes(name)) {
          results[i] = validation({ name, value });
          if (results[i]['errors'][name]) {
            _errors[name] = results[i]['errors'][name];
          }
          i = i + 1;
        }
      }
      setErrors({ ...errors, ..._errors });
      return onSubmit(
        !results.map((item) => item.status).includes(false),
        event
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handelOnChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    try {
      const name = event.target.name;
      const value = event.target.value?.trim();

      const results = validation({ name, value });

      setErrors({
        ...errors,
        [name]: results.errors[name]
      });

      setData({
        ...data,
        [name]: value
      });
    } catch (error) {
      console.error(error);
    }
  };

  const RefEvent = () => {
    const ref = refForm.current;
    const dataInput = {};

    if (ref && ref !== null) {
      const inputs = ref.getElementsByTagName('input');
      const selects = ref.getElementsByTagName('select');
      const textarea = ref.getElementsByTagName('textarea');

      Object.keys(inputs).map((key) => {
        if (inputs[key].name) {
          dataInput[inputs[key].name] = inputs[key].value?.trim();
        }
        return true;
      });

      Object.keys(textarea).map((key) => {
        if (textarea[key].name) {
          dataInput[textarea[key].name] = textarea[key].value;
        }
        return true;
      });

      Object.keys(selects).map((key) => {
        if (selects[key].name) {
          dataInput[selects[key].name] = selects[key].value?.trim();
        }
        return true;
      });
    }
    return dataInput;
  };

  useEffect(() => {
    setData(RefEvent());
  }, [refForm]);

  return {
    errors,
    setErrors,
    refForm,
    handelOnSubmit,
    handelOnChange,
    setData,
    RefEvent,
    data
  };
};

export default useValidation;
