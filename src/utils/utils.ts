/**
 * @method isEmpty
 * @param {any} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: any): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * @method stringToNumber
 * @param {{value: any, type: any}}
 * @returns {number | undefined} true & false
 * @description stringToNumber convert time & date to number
 */
export const stringToNumber = ({
  value,
  type,
}: {
  value: any;
  type?: any;
}): number | undefined => {
  try {
    if (
      value &&
      type &&
      ['datetime-local', 'date', 'time'].includes(type?.toLowerCase?.())
    ) {
      if (
        type === 'time' &&
        new RegExp(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).test(value)
      ) {
        value = `2000-01-01 ${value}`;
      }
      const date = new Date(value.toString());
      value = date.getTime();
    }
    if (!isNaN(Number(value))) {
      return Number(value);
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};
