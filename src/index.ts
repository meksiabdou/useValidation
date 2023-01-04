/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import { isEmpty, stringToNumbre } from './utils/utils';

export type ValidationParams =
  | 'regex'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'match'
  | 'required';

export type ValidationOperators =
  | '$ne'
  | '$eq'
  | '$gt'
  | '$gte'
  | '$lte'
  | '$lt';

export interface ValidationInputType {
  name: string;
  type?: string;
  defaultValue?: any;
  //value?: any;
  // placeholder?: string;
  regex?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  match?: string;
  $eq?: string;
  $ne?: string;
  $gt?: string;
  $gte?: string;
  $lt?: string;
  $lte?: string;
  messages?: {
    regex?: string;
    min?: string;
    max?: string;
    match?: string;
    required?: string;
    minLength?: string;
    maxLength?: string;
    $eq?: string;
    $ne?: string;
    $gt?: string;
    $gte?: string;
    $lt?: string;
    $lte?: string;
  };
}

const defaultMessages: Record<
  ValidationParams | ValidationOperators,
  string
> = {
  regex: 'the {field} is invalid',
  min: '{field} should be more or equal than {min}',
  max: '{field} must be less than or equal to {max}',
  minLength: '{field} should be more than {min} characters',
  maxLength: '{field} must be less than or equal to {max} characters',
  match: 'Be sure to match the {match}',
  required: 'the {field} is required',
  $eq: 'Be sure to equal than {field}',
  $ne: 'Be sure to not equal to {field}',
  $gt: 'Be sure to greater than {field}',
  $gte: 'Be sure to greater than or equal to {field}',
  $lt: 'Be sure to less than {field}',
  $lte: 'Be sure to less than or equal to {field}',
};

const defaultRegex: { email: any; phone: any; url: any } = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  url: /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i,
};

const useValidation = (inputs: Array<ValidationInputType>) => {
  const [errors, setErrors] = useState<any>({});
  const [data, setData] = useState<any>({});
  const refForm = useRef<HTMLFormElement>(null);

  const validation = ({
    name,
    value,
    type,
  }: {
    name: string;
    value: string;
    type: string;
  }) => {
    const errorsList: any = {};
    const results = { status: false, errors: errorsList };
    try {
      const [field] = inputs.filter(
        item => item.name.toLowerCase() === name?.toLowerCase()
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
          regex,
          $eq,
          $ne,
          $gt,
          $gte,
          $lt,
          $lte,
        } = field;

        const getMessage = (key: ValidationParams | ValidationOperators, _field = name) => {
          return (
            messages?.[key] || defaultMessages?.[key].replace('{field}', _field)
          );
        };

        if (required && isEmpty(value)) {
          results.status = false;
          errorsList[name] = getMessage('required');
        } else if (
          !required &&
          match &&
          data?.[match] &&
          value !== data?.[match]
        ) {
          results.status = false;
          errorsList[name] = getMessage('match').replace('{match}', match);
        } else if (!required && isEmpty(value)) {
          results.status = true;
          if (name in errorsList) {
            delete errorsList[name];
          }
        } else if (
          (regex || (defaultRegex as any)?.[field?.name]) &&
          !new RegExp(regex || (defaultRegex as any)?.[field?.name]).test(value)
        ) {
          results.status = false;
          errorsList[name] = getMessage('regex');
        } else if (minLength && !(value.length >= minLength)) {
          results.status = false;
          errorsList[name] = getMessage('minLength').replace('{min}', minLength.toString());
        } else if (maxLength && !(value.length <= maxLength)) {
          results.status = false;
          errorsList[name] = getMessage('maxLength').replace('{max}', maxLength.toString());
        } else if (min && !(Number(value) >= min)) {
          results.status = false;
          errorsList[name] = getMessage('min').replace('{min}', min.toString());
        } else if (max && !(Number(value) <= max)) {
          results.status = false;
          errorsList[name] = getMessage('max').replace('{max}', max.toString());
        } else if (match && data?.[match] && value !== data?.[match]) {
          results.status = false;
          errorsList[name] = getMessage('match').replace('{match}', match.toString());
        } else if (!isEmpty(stringToNumbre({ value, type }))) {
          const numbre: any = stringToNumbre({ value, type });
          const getNumbre = (key: any) => stringToNumbre({ value: data?.[key], type }) as any
          if ($eq && !isEmpty(data?.[$eq]) && numbre !== getNumbre($eq)) {
            results.status = false;
            errorsList[name] = getMessage('$eq', $eq);
          } else if ($ne && !isEmpty(data?.[$ne]) && numbre === getNumbre($ne)) {
            results.status = false;
            errorsList[name] = getMessage('$ne', $ne);
          }else if ($gt && !isEmpty(data?.[$gt]) && numbre <= getNumbre($gt)) {
            results.status = false;
            errorsList[name] = getMessage('$gt', $gt);
          } else if ($gte && !isEmpty(data?.[$gte]) && numbre < getNumbre($gte)) {
            results.status = false;
            errorsList[name] = getMessage('$gte', $gte);
          } else if ($lt && !isEmpty(data?.[$lt]) && numbre >= getNumbre($lt)) {
            results.status = false;
            errorsList[name] = getMessage('$lt', $lt);
          } else if ($lte && !isEmpty(data?.[$lte]) && numbre > getNumbre($lte)) {
            results.status = false;
            errorsList[name] = getMessage('$lte', $lt);
          }
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
        ...Array.from(target.querySelectorAll('input')),
        ...Array.from(target.querySelectorAll('textarea')),
        ...Array.from(target.querySelectorAll('select')),
      ];

      let i = 0;
      let results: Array<any> = [];
      const _errors: any = {};

      for (const element in elements) {
        const { value, name, type } = elements[element] as HTMLInputElement;
        if (name && inputs.map(item => item.name).includes(name)) {
          results[i] = validation({ name, value, type });
          if (results[i]['errors'][name]) {
            _errors[name] = results[i]['errors'][name];
          }
          i = i + 1;
        }
      }

      setErrors({ ...errors, ..._errors });
      return onSubmit(
        !(
          results.length === 0 ||
          results.map(item => item.status).includes(false)
        ),
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
      const name = event?.target?.name;
      const value = event?.target?.value?.trim();
      const type = event?.target?.type;

      const results = validation({ name, value, type });

      setErrors({
        ...errors,
        [name]: results.errors[name],
      });

      setData({
        ...data,
        [name]: value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const RefEvent = () => {
    const ref = refForm.current;
    const dataInput: any = {};

    if (ref && ref !== null) {
      const inputs = ref.getElementsByTagName('input');
      const selects = ref.getElementsByTagName('select');
      const textarea = ref.getElementsByTagName('textarea');

      Object.keys(inputs).map((key: any) => {
        if (inputs[key].name) {
          dataInput[inputs[key].name] = inputs[key].value?.trim();
        }
        return true;
      });

      Object.keys(textarea).map((key: any) => {
        if (textarea[key].name) {
          dataInput[textarea[key].name] = textarea[key].value;
        }
        return true;
      });

      Object.keys(selects).map((key: any) => {
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
      setData(RefEvent());
    }
  }, [refForm?.current]);

  useEffect(() => {
    if (refForm.current) {
      const observer = new MutationObserver(() => {
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
    data,
  };
};

export default useValidation;
