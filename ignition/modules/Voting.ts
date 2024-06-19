import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const VotingModule = buildModule("VotingModule", (m) => {
  const VOTING_TIME: number = 864_000;
  const voting = m.contract("Voting", [
    [
      ethers.encodeBytes32String("William Black"), ethers.encodeBytes32String("Ryan Boyd"), ethers.encodeBytes32String("Derek Smith"),
      ethers.encodeBytes32String("Henry Cooper"), ethers.encodeBytes32String("Robert Warner")
    ],
    [
      ethers.getAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"), ethers.getAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"),
      ethers.getAddress("0x90F79bf6EB2c4f870365E785982E1f101E93b906"), ethers.getAddress("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"),
      ethers.getAddress("0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"), ethers.getAddress("0x976EA74026E726554dB657fA54763abd0C3a0aa9"),
      ethers.getAddress("0x14dC79964da2C08b23698B3D3cc7Ca32193d9955"), ethers.getAddress("0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"),
      ethers.getAddress("0xa0Ee7A142d267C1f36714E4a8F75612F20a79720"), ethers.getAddress("0xBcd4042DE499D14e55001CcbB24a551F3b954096"),
      ethers.getAddress("0x71bE63f3384f5fb98995898A86B02Fb2426c5788"), ethers.getAddress("0xFABB0ac9d68B0B445fB7357272Ff202C5651694a"),
      ethers.getAddress("0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec"), ethers.getAddress("0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097"),
      ethers.getAddress("0xcd3B766CCDd6AE721141F452C550Ca635964ce71"),
    ],
    VOTING_TIME
  ]);

  return { voting };
});

export default VotingModule;
