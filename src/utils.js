const errorHandler = (error, vm, info) => {
  console.log('Vue error Handler', error, vm, info)
}

const formatError = message => {
  console.log(message)

  if (typeof message === 'object') {
    const messages = Object.values(message).map(res => res)
    console.log(messages)
    return messages.join(' ')
  } else {
    const messageSplit = message.split(':')
    console.log('message', messageSplit)
    return messageSplit[messageSplit.length - 1].trim()
  }
}

const currencyFormatter = ({ locale, currency } = { locale: 'pt-BR', currency: 'BRL' }) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  })
}

const groupBy = (array, key, makeCurrentKey) => {
  return array.reduce((accumulated, item) => {
    const currentKey = makeCurrentKey(item, key)
    return {
      ...accumulated,
      [currentKey]: [
        ...(accumulated[currentKey] || []),
        item
      ]
    }
  }, {})
}

const registerVuexModule = (rootStore, moduleName, store) => {
  if (!(moduleName in rootStore._modules.root._children)) {
    rootStore.registerModule(moduleName, store)
  }
}

export {
  groupBy,
  errorHandler,
  formatError,
  currencyFormatter,
  registerVuexModule
}
