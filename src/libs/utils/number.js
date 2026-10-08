import { replace } from "lodash";
import numeral from "numeral";

// ----------------------------------------------------------------------

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? "$0,0" : "$0,0.00");
}

export function fPercent(number) {
  return numeral(number / 100).format("0.0%");
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fNumberPoint(number) {
  return numeral(number).format("0,0.0");
}

export function fNumberDoublePoint(number) {
  return numeral(number).format("0,0.00");
}

export function fNumberMorePoint(number) {
  let formattedNumber = number.toString().replace(/(\.\d*?[1-9])0+$/, "$1");
  return parseFloat(formattedNumber);
}

export function fShortenNumber(number) {
  return replace(numeral(number).format("0.00a"), ".00", "");
}

export function fData(number) {
  return numeral(number).format("0.0 b");
}

export function isWholeNumber(number) {
  return number % 1 === 0;
}

export function decimalNumber(number) {
  return Math.round(number * 100) / 100;
}

export function formatWithGaps(number) {
  // Convert the number to a string
  let numberStr = number.toString();

  // Use a regular expression to add a space after every 4 digits
  let formattedStr = numberStr.replace(/(\d{4})(?=\d)/g, "$1 ");

  return formattedStr;
}
