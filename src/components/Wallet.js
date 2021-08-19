import React from 'react'
import './Wallet.css'
import {
  generateAddress
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
    console.log(addresses)
    //this.state.addresses = getAddresses()
    this.setState(() => ({
      addresses: addresses,
    }))
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
            return <Address adr={adr} index={i} key={i}/>
          })
        }
      </div>
    )
  }
}

function Address(props) {
  return (
    <div className="adress">
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
    </div>

  )
}

export default Wallet
