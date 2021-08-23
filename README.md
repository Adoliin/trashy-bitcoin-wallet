# Motivation
This was built to test and play around with `bitcoinjs-lib` javascript/typescript
library

As the name implies this is a _trashy_ bitcoin wallet and should **NEVER** be
used as a real wallet securing real mainet bitcoin

# How to use
Set a regtest node using bitcoind or as I prefer using [nigiri](https://github.com/vulpemventures/nigiri) as it ship
with `esplora` block explorer and API that make things easier

To use this wallet in testnet network (instead of regtest ) you can
just uncomment these 2 lines inside `/src/api/api.js` to use blockstream as a
3rd party bitcoin provider
- `const NETWORK = bitcoin.networks.regtest`
- `const explorerUrl = 'https://blockstream.info/testnet/api`
 
and comment the previous two lines.
