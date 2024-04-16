import uploadApi from "@/apis/uploadApi";
import _, { isNumber } from "lodash";
import slugify from "slugify";

export function uploadImage(loader) {
  return {
    upload: () => {
      return new Promise(async (resolve, reject) => {
        loader.file.then(async (file) => {
          try {
            if (!file) return;

            //*Call Api upload image to server
            const response = await uploadApi.image(file);

            if (response) {
              const urlImage = response?.path;
              resolve({ default: urlImage });
            }
          } catch (error) {
            reject(error);
          }
        });
      });
    },
  };
}

/**
 *
 * @param {string} text
 * @returns
 */
export function convertSlug(text) {
  return slugify(text, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: false, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: "vi", // language code of the locale to use
    trim: true,
  });
}

/**
 *
 * @param {object} obj
 * @returns
 */
export function deleteKeyObjectNull(obj) {
  Object.keys(obj).forEach((key) => {
    if (
      (Array.isArray(obj[key]) && !obj[key]?.length) ||
      (!isNumber(obj[key]) && _.isEmpty(obj[key])) ||
      !obj[key]
    ) {
      delete obj[key];
    }
  });

  return obj;
}

/**
 *
 * @param {Array<string>} fields
 * @param {object} obj
 * @returns
 */
export function getKeyObject(fields = [], obj = {}) {
  if (_.isEmpty(obj)) return {};
  return _.pick(obj, fields);
}

/**
 *
 * @param {number} price
 * @returns
 */
export function fPrice(price) {
  return price.toLocaleString("it-IT", { style: "currency", currency: "VND" });
}

export function getToISOString00() {
  const newDate = new Date().toUTCString();
  const toISOString = new Date(newDate).toISOString().split(":");
  const _toISOString = toISOString[2].split(".");
  const _newToISOString = `${toISOString[0]}:${toISOString[1]}:00.${_toISOString[1]}`;
  return _newToISOString;
}

export function parserIsoStringZeroMinus(dateIsoString) {
  const toISOString = dateIsoString.split(":");
  const _newToISOString = `${toISOString[0]}`;
  return _newToISOString;
}

/**
 * Tính số ngày trong 1 tháng
 *
 * @param {number} year
 * @param {number} month
 * @returns
 */
export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Đếm số tuần trong 1 tháng.
 * Ngày đầu từ chủ nhật
 * @param {number} year
 * @param {number} month
 * @returns
 */
export function weekCount(year, month) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const lastOfMonth = new Date(year, month, 0);

  const used = firstOfMonth.getDay() + lastOfMonth.getDate();

  return Math.ceil(used / 7);
}

/**
 * Lấy ngày thuộc tuần mấy trong tháng
 * @param {Date} date
 * @param {number} weekCount
 * @returns {number}
 */
export function getWeekOfMonth(date, weekCount) {
  let day = date.getDate();
  day -= date.getDay() == 0 ? 6 : date.getDay() - 1;
  day += 7;

  const prefixes = [...Array(weekCount)].map((_, i) => `${i + 1}`);

  return +prefixes[0 | (day / 7)];
}

/**
 * Trả về thứ của ngày bắt đầu trong tháng
 * @param {number} year
 * @param {number} month
 * @returns
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay() + 1;
}

/**
 *
 * @param {number} year
 * @param {number} month
 * @returns
 */
export function getAllDates(year, month) {
  // * Đếm tuần trong 1 tháng
  const _weekCount = weekCount(year, month);

  // * Ngày trong 1 tháng
  const _daysInMonth = daysInMonth(year, month);

  // * Số dư của tuần
  const _calcDaysDivOfMonth = _weekCount * 7 - _daysInMonth;

  // * Tìm thứ trong ngày đâu tiên của tháng.
  const _getFirstDayOfMonth = getFirstDayOfMonth(year, month - 1);

  const minusDate = _getFirstDayOfMonth - 1;

  const monthPrev = month - 1;

  const _daysInMonthPrev = daysInMonth(
    month === 1 ? year - 1 : year,
    monthPrev
  );

  // * Tính số ngày còn lại của tháng trước.
  const _fewDatesOfMonthPrev = _daysInMonthPrev - minusDate;

  // Mảng của ngày còn lại.
  const arrayDatesOfMonthPrev = [...Array(minusDate)].map((_, index) => ({
    month: monthPrev,
    day: _fewDatesOfMonthPrev + index + 1,
  }));

  const arrayDatesOfMonthNext = [...Array(_calcDaysDivOfMonth - minusDate)].map(
    (_, index) => ({ month: month + 1, day: index + 1 })
  );

  let result = {};

  let allDateOfMonth = [...Array(_daysInMonth)].map((_, index) => ({
    month: month,
    day: index + 1,
  }));

  allDateOfMonth = [
    ...arrayDatesOfMonthPrev,
    ...allDateOfMonth,
    ...arrayDatesOfMonthNext,
  ];

  [...Array(_weekCount)].map((_, index) => {
    const dates = allDateOfMonth.slice(7 * index, 7 * (index + 1));

    result = {
      ...result,
      [index + 1]: dates,
    };
  });

  return result;
}

export const parserJson = (data) => {
  return JSON.stringify(data);
};

export const parserArrayAddYear = (array, year) => {
  return array.map((i) => ({ ...i, year }));
};
