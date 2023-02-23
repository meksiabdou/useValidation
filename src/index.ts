import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { isEmpty, stringToNumbre } from './utils/utils';

type ValidationParams =
  | 'regExp'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'match'
  | 'required';

type ValidationOperators = 'ne' | 'eq' | 'gt' | 'gte' | 'lte' | 'lt';

export type MessagesType = Record<
  ValidationParams | ValidationOperators,
  string
>;

export interface ValidationInputType {
  name: string;
  type?: string;
  defaultValue?: any;
  //value?: any;
  // placeholder?: string;
  //regex?: RegExp;
  regExp?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  match?: string;
  eq?: string;
  ne?: string;
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
  messages?: {
    //regex?: string;
    regExp?: string;
    min?: string;
    max?: string;
    match?: string;
    required?: string;
    minLength?: string;
    maxLength?: string;
    eq?: string;
    ne?: string;
    gt?: string;
    gte?: string;
    lt?: string;
    lte?: string;
  };
}

const defaultMessages: MessagesType = {
  regExp: 'the {field} is invalid',
  min: '{field} should be more or equal than {min}',
  max: '{field} must be less than or equal to {max}',
  minLength: '{field} should be more than {min} characters',
  maxLength: '{field} must be less than or equal to {max} characters',
  match: 'Be sure to match the {match}',
  required: 'the {field} is required',
  eq: 'Be sure to equal than {field}',
  ne: 'Be sure to not equal to {field}',
  gt: 'Be sure to greater than {field}',
  gte: 'Be sure to greater than or equal to {field}',
  lt: 'Be sure to less than {field}',
  lte: 'Be sure to less than or equal to {field}',
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
          // regex,
          eq,
          ne,
          gt,
          gte,
          lt,
          lte,
        } = field;

        const regExp = field?.regExp || (field as any)?.regex;

        const getMessage = (
          key: ValidationParams | ValidationOperators,
          _field = name
        ) => {
          return (
            messages?.[key] ||
            defaultMessages?.[key]?.replace?.('{field}', _field)
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
          (regExp || (defaultRegex as any)?.[field?.name]) &&
          !new RegExp(regExp || (defaultRegex as any)?.[field?.name]).test(
            value
          )
        ) {
          results.status = false;
          errorsList[name] = getMessage('regExp');
        } else if (
          !isEmpty(minLength) &&
          !(value.length >= Math.abs(minLength as any))
        ) {
          results.status = false;
          errorsList[name] = getMessage('minLength').replace(
            '{min}',
            Math.abs(minLength as any).toString()
          );
        } else if (
          !isEmpty(maxLength) &&
          !(value.length <= Math.abs(maxLength as any))
        ) {
          results.status = false;
          errorsList[name] = getMessage('maxLength').replace(
            '{max}',
            Math.abs(maxLength as any).toString()
          );
        } else if (!isEmpty(min) && !(Number(value) >= (min as any))) {
          results.status = false;
          errorsList[name] = getMessage('min').replace(
            '{min}',
            (min as any).toString()
          );
        } else if (!isEmpty(max) && !(Number(value) <= (max as any))) {
          results.status = false;
          errorsList[name] = getMessage('max').replace(
            '{max}',
            (max as any).toString()
          );
        } else if (match && data?.[match] && value !== data?.[match]) {
          results.status = false;
          errorsList[name] = getMessage('match').replace(
            '{match}',
            match.toString()
          );
        } else if (!isEmpty(stringToNumbre({ value, type }))) {
          const numbre: any = stringToNumbre({ value, type });
          const getNumbre = (key: any) =>
            stringToNumbre({ value: data?.[key], type }) as any;
          if (eq && !isEmpty(data?.[eq]) && numbre !== getNumbre(eq)) {
            results.status = false;
            errorsList[name] = getMessage('eq', eq);
          } else if (ne && !isEmpty(data?.[ne]) && numbre === getNumbre(ne)) {
            results.status = false;
            errorsList[name] = getMessage('ne', ne);
          } else if (gt && !isEmpty(data?.[gt]) && numbre <= getNumbre(gt)) {
            results.status = false;
            errorsList[name] = getMessage('gt', gt);
          } else if (gte && !isEmpty(data?.[gte]) && numbre < getNumbre(gte)) {
            results.status = false;
            errorsList[name] = getMessage('gte', gte);
          } else if (lt && !isEmpty(data?.[lt]) && numbre >= getNumbre(lt)) {
            results.status = false;
            errorsList[name] = getMessage('lt', lt);
          } else if (lte && !isEmpty(data?.[lte]) && numbre > getNumbre(lte)) {
            results.status = false;
            errorsList[name] = getMessage('lte', lt);
          } else {
            results.status = true;
            const [compareName] = [eq, ne, gt, gte, lt, lte].filter(i => i);
            if (compareName) {
              errorsList[compareName] = undefined;
            }
            errorsList[name] = undefined;
          }
        } else {
          results.status = true;
          errorsList[name] = undefined;
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
    event: FormEvent,
    onSubmit: (status: boolean, event: FormEvent) => void
  ) => {
    try {
      event.preventDefault();
      const target = event.target as HTMLFormElement;
      const elements: Array<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      > = [
        ...Array.from(target.querySelectorAll('input')),
        ...Array.from(target.querySelectorAll('textarea')),
        ...Array.from(target.querySelectorAll('select')),
      ];
      const results: Array<{ status: boolean; errors: Record<any, any> }> = [];
      const status: Array<boolean> = [];
      const resultsErrors: any = {};
      const names = inputs.map(item => item.name);

      elements.map((element, index) => {
        const { value, name, type } = element;
        if (name && names.includes(name)) {
          results[index] = validation({ name, value, type });
          resultsErrors[name] = results?.[index]?.['errors']?.[name];
          status[index] = results[index].status;
        }
      });

      setErrors({ ...errors, ...resultsErrors });
      return onSubmit(!(results.length === 0 || status.includes(false)), event);
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
      const value = event?.target?.value;
      const type = event?.target?.type;

      const results = validation({ name, value, type });

      setErrors({
        ...errors,
        ...results.errors,
        //[name]: results.errors[name],
      });

      setData({
        ...data,
        [name]: value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const RefEvent = (prevData: Record<any, any>) => {
    const ref = refForm.current;
    const newData: any = {};
    if (ref && ref !== null) {
      const elements: Array<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      > = [
        ...Array.from(ref.querySelectorAll('input')),
        ...Array.from(ref.querySelectorAll('textarea')),
        ...Array.from(ref.querySelectorAll('select')),
      ];
      elements.map((element: any) => {
        const { name } = element;
        const value = prevData?.[name];
        if (name && !isEmpty(value)) {
          newData[name] = value;
        }
        return true;
      });
    }
    return newData;
  };

  useEffect(() => {
    if (refForm.current) {
      const observer = new MutationObserver(() => {
        setData((prev: Record<any, any>) => {
          return RefEvent(prev);
        });
      });
      observer.observe(refForm.current, { childList: true, subtree: false });
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
