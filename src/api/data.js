import Cookies from 'js-cookie'

const getAddresses = () => {
  let res = Cookies.get('addresses')
  if (res === undefined)
    return []
  else
    return JSON.parse(res)
}

const setAddresses = (addresses) => {
  Cookies.set(
    'addresses', 
    JSON.stringify(addresses)
  )
}

export {
  getAddresses,
  setAddresses,
}
