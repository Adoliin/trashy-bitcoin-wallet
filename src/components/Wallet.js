import React, {
  useState,
  useEffect,
} from 'react'
import './Wallet.css'
import {
  generateAddress,
  getUtxosAndSats,
  sendTransaction,
} from '../api/api.js'
import {
  getAddresses,
  setAddresses,
} from '../api/data.js'

class Wallet extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addresses: [],
    }
  }

  handleGenerateAdr() {
    const adr = generateAddress()
    const newAddresses = [...this.state.addresses, adr];
    this.setState(() => ({
      addresses: newAddresses,
    }))
    setAddresses(newAddresses)
  }

  componentDidMount() {
    let addresses = getAddresses()
    //console.log(addresses)
    //this.state.addresses = getAddresses()
    this.setState(() => ({
      addresses: addresses,
    }))
  }

  deleteAddress(index) {
    if (window.confirm('DELETE this address?')) {
      let newAddresses = this.state.addresses
      newAddresses.splice(index, 1);
      this.setState(() => ({
        addresses: newAddresses,
      }))
      setAddresses(newAddresses)
    }
  }

  render() {
    const addresses = this.state.addresses
    return (
      <div className="wallet">
        <button onClick={this.handleGenerateAdr.bind(this)}>
          Generate Address
        </button>
        {
          addresses.map((adr, i) => {
            return (
            <Address
              adr={adr}
              index={i}
              key={i}
              onDeleteAddress={this.deleteAddress.bind(this, i)}
            />
            )
          })
        }
      </div>
    )
  }
}


function Address(props) {
  const [sats, setSats]   = useState(0)
  const [utxos, setUtxos] = useState([])

  async function handleGetSats() {
    const tmp = await getUtxosAndSats(props.adr)
    setSats(tmp.sats)
    setUtxos(tmp.utxos)
  }

  useEffect(() => {
    handleGetSats()
  }, [props.adr])

  function handleDeleteAddress() {
    props.onDeleteAddress()
  }

  return (
    <div className="address">
      <h2>Address {props.index}:</h2>
      <table>
        <tbody>
          <tr>
            <td>Public Key:</td>
            <td>{props.adr.pubKey}</td>
          </tr>
          <tr>
            <td>Private Key:</td>
            <td>{props.adr.privKey}</td>
          </tr>
          <tr>
            <td>WIF:</td>
            <td>{props.adr.wif}</td>
          </tr>
          <tr>
            <td>Address:</td>
            <td>{props.adr.address}</td>
          </tr>
          <tr>
            <td>Segwit:</td>
            <td>{props.adr.segwitAddress}</td>
          </tr>
        </tbody>
      </table>
      <div className="sats">
        <button onClick={()=>handleGetSats()}>refresh</button>
        <h4>Sats: {sats}</h4>
      </div>
      <SendAllTo 
        utxos={utxos}
        wif={props.adr.wif}
        sats={sats}
        segwitAddress={props.adr.segwitAddress}
      />
      <button
        className="rem-adr"
        onClick={handleDeleteAddress}
      >X</button>
    </div>
  )
}

function SendAllTo(props) {
  const [toAddress, setToAddress] = useState('')
  const [satsToSend, setSatsToSend] = useState('')

  function handleAddressChange(e) {
    setToAddress(e.target.value)
    e.preventDefault()
  }
  function handleSatsChange(e) {
    setSatsToSend(e.target.value)
    e.preventDefault()
  }

  function handleSendSats() {
    sendTransaction(
      props.wif,
      props.segwitAddress,
      props.utxos,
      props.sats,
      satsToSend,
      toAddress
    )
  }

  return (
    <div>
      <div>
          Send To:
        <input 
          type="text"
          value={toAddress} 
          onChange={(e)=>{handleAddressChange(e)}}
        />
      </div>
      <div>
        Amount:
        <input 
          type="number"
          value={satsToSend} 
          onChange={(e)=>{handleSatsChange(e)}}
        />
      </div>
      <button onClick={()=>handleSendSats()}>SEND</button>
    </div>
  )
}

export default Wallet
