/**
 * @method isEmpty
 * @param {String | Number | Object} value
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

export const stringToNumbre = ({ value, type }: { value: any; type?: any }) => {
  try {
    if (['datetime-local', 'date', 'time'].includes(type?.toLowerCase())) {
      if (type === 'time') {
        value = `2000-01-01 ${value}`;
      }
      const date = new Date(value);
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
