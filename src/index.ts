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

const defaultMessages = {
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
        const {
          required,
          match,
          max,
          min,
          maxLength,
          minLength,
          messages,
          regex
        } = field;
        if (required && isEmpty(value)) {
          results.status = false;
          errorsList[name] =
            messages?.required ||
            defaultMessages.required.replace('{field}', name);
        } else if (
          !required &&
          match &&
          data?.[match] &&
          value !== data?.[match]
        ) {
          results.status = false;
          errorsList[name] =
            messages?.match || defaultMessages.match.replace('{match}', match);
        } else if (!required && isEmpty(value)) {
          results.status = true;
          if (name in errorsList) {
            delete errorsList[name];
          }
        } else if (
          (regex || defaultRegex?.[field?.name]) &&
          !new RegExp(regex || defaultRegex?.[field?.name]).test(value)
        ) {
          results.status = false;
          errorsList[name] =
            messages?.regex || defaultMessages.regex.replace('{field}', name);
        } else if (minLength && !(value.length >= minLength)) {
          results.status = false;
          errorsList[name] =
            messages?.minLength ||
            defaultMessages.minLength
              .replace('{min}', minLength.toString())
              .replace('{field}', name);
        } else if (maxLength && !(value.length <= maxLength)) {
          results.status = false;
          errorsList[name] =
            messages?.maxLength ||
            defaultMessages.maxLength
              .replace('{max}', maxLength.toString())
              .replace('{field}', name);
        } else if (min && !(Number(value) >= min)) {
          results.status = false;
          errorsList[name] =
            messages?.min ||
            defaultMessages.min
              .replace('{min}', min.toString())
              .replace('{field}', name);
        } else if (max && !(Number(value) <= max)) {
          results.status = false;
          errorsList[name] =
            messages?.max ||
            defaultMessages.max
              .replace('{max}', max.toString())
              .replace('{field}', name);
        } else if (match && data?.[match] && value !== data?.[match]) {
          results.status = false;
          errorsList[name] =
            messages?.match || defaultMessages.match.replace('{match}', match);
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
    if (refForm?.current) {
      //console.log('relod', 'useEffect');
      setData(RefEvent());
    }
  }, [refForm?.current]);

  useEffect(() => {
    if (refForm.current) {
      const observer = new MutationObserver(() => {
        //console.log('relod', 'observer');
        setData(RefEvent());
      });
      observer.observe(refForm.current, { childList: true, subtree: true });
    }
  }, []);

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
