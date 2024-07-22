# voting-system-dapp
Decentralized voting system application where you can vote for candidates, view results and restart voting
if you are on deployer's account and voting results are undecided.
Using this application you need to use Ethereum wallets to interact with the blockchain.
Main technologies used: Hardhat, Solidity, Vite with React Typescript and ethers.js.

## How to run
Clone the repository:
```shell
git clone https://github.com/Stakljar/voting-system-dapp.git
```
Inside root directory type:
```shell
npm install
```
Navigate to frontend directory and type the same thing.
Then navigate back to the root directory and type:
```shell
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Voting.ts --network localhost
```
Set the following variable to match the deployed contract address:
```typescript
export const contractAddress: string
```
Navigate to the frontend directory and type:
```shell
npm run dev
```

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
