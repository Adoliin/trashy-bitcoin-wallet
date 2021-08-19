import * as bitcoin from 'bitcoinjs-lib'
const NETWORK = bitcoin.networks.testnet

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

const generateAddress = () => {
  const keyPair = bitcoin.ECPair.makeRandom({
    network: NETWORK,
  });
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: NETWORK,
  });

  const  segwitAddress = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: NETWORK,
  }).address;
  
  const pubKey  = buf2hex(keyPair.publicKey)
  const privKey = buf2hex(keyPair.privateKey)
  const wif = keyPair.toWIF()

  const res = { pubKey, privKey, wif, address, segwitAddress}
  /*const prettyRes = JSON.stringify(res, null, 4)
  console.log(prettyRes)*/
  return res
}


export {
  generateAddress
}
