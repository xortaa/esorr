import { FormatMoney } from "format-money-js";

const fm = new FormatMoney({
  decimals: 2,
});

const formatMoney = (value: number) => { 
  // PESO SYMBOL
  return fm.from(value, {symbol:  'PHP '})
}

export default formatMoney;
