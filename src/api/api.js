import * as bitcoin from 'bitcoinjs-lib'
import axios from 'axios'

//bitcoin.crypto.hash160(toHex)

const NETWORK = bitcoin.networks.regtest
//const NETWORK = bitcoin.networks.testnet
const explorerUrl = 'http://localhost:3000'
//const explorerUrl = 'https://blockstream.info/testnet/api'

const generateAddress = () => {
  const keyPair = bitcoin.ECPair.makeRandom({
    network: NETWORK,
  });
  const {
    address
  } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: NETWORK,
  });

  const segwitAddress = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: NETWORK,
  }).address;

  const pubKey = keyPair.publicKey.toString('hex')
  const privKey = keyPair.privateKey.toString('hex')
  const wif = keyPair.toWIF()

  const res = {
    pubKey,
    privKey,
    wif,
    address,
    segwitAddress
  }
  /*const prettyRes = JSON.stringify(res, null, 4)
  console.log(prettyRes)*/
  return res
}

const getUtxosAndSats = async (adr) => {
  try {
    let utxos = await axios.get(
      `${explorerUrl}/address/${adr.segwitAddress}/utxo`
    )
    utxos = utxos.data
    console.log(utxos)
    let sats = 0;
    if (utxos.length !== 0)
      for (const utxo of utxos)
        sats += utxo.value
    return {
      sats,
      utxos
    }
    //console.log(utxos)
  } catch (err) {
    console.error(err)
  }
}

const sendTransaction = async (
  wif,
  senderSegwitAddress,
  utxos,
  sats,
  satsToSend,
  toAddress,
) => {
  const FEE = 500
  satsToSend = Number(satsToSend)
  if (satsToSend > sats - FEE)
    throw 'Not enough funds'

  let sender = bitcoin.ECPair.fromWIF(wif, NETWORK)
  const psbt = new bitcoin.Psbt({
    'network': NETWORK
  });
  console.log('utxos~~')
  console.log(utxos)

  for (let utxo of utxos) {
    // fetch the scriptPubkey
    let tx = await axios.get(`${explorerUrl}/tx/${utxo.txid}`)
    tx = tx.data
    const scriptPubkey = tx.vout[utxo.vout].scriptpubkey

    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        script: Buffer.from(scriptPubkey, 'hex'),
        value: utxo.value,
      },
    })
  }
  
  psbt.addOutput({
    address: toAddress,
    value: satsToSend,
  })
  let senderPubKey = sender.publicKey.toString('hex')
  console.log(senderPubKey)
  if (satsToSend < sats - FEE)
    psbt.addOutput({
      address: senderSegwitAddress,
      value: sats - satsToSend - FEE,
    })

  psbt.signAllInputs(sender)
  psbt.validateSignaturesOfAllInputs()
  psbt.finalizeAllInputs()
  const rawTx = psbt.extractTransaction().toHex()
  console.log(rawTx)

  try {
    const txid = await axios.post(`${explorerUrl}/tx`, rawTx)
    console.log(txid)
  } catch(err) {
    console.log(err)
  }
}


export {
  generateAddress,
  getUtxosAndSats,
  sendTransaction,
}
