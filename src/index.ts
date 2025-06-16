import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { isEmpty, stringToNumber } from './utils/utils';

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
  regExp?: RegExp;
  min?: number | string | Date;
  max?: number | string | Date;
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

export const defaultValidationRegex: {
  email: any;
  phone: any;
  url: any;
  password: any;
} = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  url: /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&\_\-\x20-\x7E])[A-Za-z\d\W\_\-\x20-\x7E]{8,}$/,
};

const useValidation = (
  inputs: Array<ValidationInputType>,
  config: { mutationObserverInit?: MutationObserverInit } = {}
) => {
  const [errors, setErrors] = useState<Record<any, any>>({});
  const [data, setData] = useState<Record<any, any>>({});
  const refForm = useRef<HTMLFormElement>(null);

  const getMessage = (
    key: ValidationParams | ValidationOperators,
    name: string,
    messages?: MessagesType
  ) => {
    return (
      messages?.[key] || defaultMessages?.[key]?.replace?.('{field}', name)
    );
  };

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
          maxLength,
          minLength,
          messages,
          eq,
          ne,
          gt,
          gte,
          lt,
          lte,
        } = field;

        const _getMessage = (
          key: ValidationParams | ValidationOperators,
          fieldName: string = name
        ) => {
          return getMessage(key, fieldName, messages as any);
        };

        const getNumber = (key: any) => {
          if (key in data && typeof key === 'string') {
            return stringToNumber({ value: data?.[key], type }) as any;
          }
          return stringToNumber({ value: key, type }) as any;
        };

        const max = stringToNumber({ value: field?.max, type });
        const min = stringToNumber({ value: field?.min, type });
        const number = stringToNumber({ value, type }) as number;

        const regExp =
          field?.regExp ||
          (defaultValidationRegex as any)?.[field?.name] ||
          (defaultValidationRegex as any)?.[type];

        if (required && isEmpty(value)) {
          results.status = false;
          errorsList[name] = _getMessage('required');
        } else if (
          !required &&
          match &&
          data?.[match] &&
          value !== data?.[match]
        ) {
          results.status = false;
          errorsList[name] = _getMessage('match').replace('{match}', match);
        } else if (!required && isEmpty(value)) {
          results.status = true;
          if (name in errorsList) {
            delete errorsList[name];
          }
        } else if (regExp && !new RegExp(regExp).test(value)) {
          results.status = false;
          errorsList[name] = _getMessage('regExp');
        } else if (
          !isEmpty(minLength) &&
          !(value.length >= Math.abs(minLength as any))
        ) {
          results.status = false;
          errorsList[name] = _getMessage('minLength').replace(
            '{min}',
            Math.abs(minLength as any).toString()
          );
        } else if (
          !isEmpty(maxLength) &&
          !(value.length <= Math.abs(maxLength as any))
        ) {
          results.status = false;
          errorsList[name] = _getMessage('maxLength').replace(
            '{max}',
            Math.abs(maxLength as any).toString()
          );
        } else if (match && data?.[match] && value !== data?.[match]) {
          results.status = false;
          errorsList[name] = _getMessage('match').replace(
            '{match}',
            match.toString()
          );
        } else if (!isEmpty(number)) {
          if (eq && !isEmpty(data?.[eq]) && number !== getNumber(eq)) {
            results.status = false;
            errorsList[name] = _getMessage('eq', eq);
          } else if (ne && !isEmpty(data?.[ne]) && number === getNumber(ne)) {
            results.status = false;
            errorsList[name] = _getMessage('ne', ne);
          } else if (gt && !isEmpty(data?.[gt]) && number <= getNumber(gt)) {
            results.status = false;
            errorsList[name] = _getMessage('gt', gt);
          } else if (gte && !isEmpty(data?.[gte]) && number < getNumber(gte)) {
            results.status = false;
            errorsList[name] = _getMessage('gte', gte);
          } else if (lt && !isEmpty(data?.[lt]) && number >= getNumber(lt)) {
            results.status = false;
            errorsList[name] = _getMessage('lt', lt);
          } else if (lte && !isEmpty(data?.[lte]) && number > getNumber(lte)) {
            results.status = false;
            errorsList[name] = _getMessage('lte', lt);
          } else if (!isEmpty(min) && !(number >= (min as any))) {
            results.status = false;
            errorsList[name] = _getMessage('min').replace(
              '{min}',
              (min as any).toString()
            );
          } else if (!isEmpty(max) && !(number <= (max as any))) {
            results.status = false;
            errorsList[name] = _getMessage('max').replace(
              '{max}',
              (max as any).toString()
            );
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

  const handleOnSubmit = (
    event: FormEvent,
    onSubmit: (
      status: boolean,
      event: FormEvent,
      inputsErrors: Record<any, any>
    ) => void
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
        return true;
      });
      const _errors = { ...errors, ...resultsErrors };
      setErrors(_errors);
      return onSubmit?.(
        !(results.length === 0 || status.includes(false)),
        event,
        _errors
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChange = (
    event: ChangeEvent<
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
      });

      setData({
        ...data,
        [name]: value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const RefEvent = (ref: HTMLFormElement) => {
    try {
      const elements: Array<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      > = [
        ...Array.from(ref.querySelectorAll('input')),
        ...Array.from(ref.querySelectorAll('textarea')),
        ...Array.from(ref.querySelectorAll('select')),
      ];
      const newErrors: Record<any, any> = {};
      const names = inputs.map(item => item.name);
      setData((prevData: Record<any, any>) => {
        const newData: Record<any, any> = {};
        elements.map((element: any) => {
          const { name, value: defaultValue } = element;
          const value = prevData?.[name] || defaultValue;
          if (name && names.includes(name)) {
            if (!isEmpty(value)) {
              newData[name] = value;
            }
          }
          return name;
        });
        setErrors(prevErrors => {
          names.map(name => {
            if (name in prevErrors) {
              newErrors[name] = prevErrors[name];
            }
            return true;
          });
          return newErrors;
        });
        return newData;
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (refForm.current) {
      const observer = new MutationObserver(() => {
        RefEvent(refForm.current as HTMLFormElement);
      });
      observer.observe(refForm.current, {
        childList: true,
        subtree: false,
        ...config?.mutationObserverInit,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Array.isArray(inputs)) {
      const newData: Record<any, any> = {};
      inputs.map(item => {
        if (
          !isEmpty(item?.defaultValue) &&
          isEmpty(data?.[item?.name]) &&
          item?.name
        ) {
          newData[item.name] = item.defaultValue;
        }
        return item.name;
      });
      setData({ ...data, ...newData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    errors,
    setErrors,
    refForm,
    handleOnSubmit,
    handleOnChange,
    setData,
    RefEvent,
    data,
  };
};

export default useValidation;
