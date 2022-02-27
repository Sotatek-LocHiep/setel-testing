export type MoneyType = 'USD' | 'EURO' | 'CNY' | 'GBP' | 'VND'
export function formatMoney(money: number, moneyType: MoneyType) {
  if (money === null || money === undefined || Number.isNaN(money)) return ''
  const result = money.toString().replace(/,/g, '')
  return (
    result.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
    ` ${moneyType}`
  )
}
