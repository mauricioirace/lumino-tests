import LuminoTesting from "index";
import noChannels from '../samples/no-channels.json';
import Web3 from 'web3';
import { getTokenAddress } from "token/util";
import { LuminoTesting } from "../src/types/lumino-testing";

describe("Channels", () => {
  let tester: LuminoTesting;

  beforeAll(async () => {
    tester = await LuminoTesting(noChannels);
  }, 60 * 1000)

  it('should open a channel with no balance', async () => {
    await tester.nodes().initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("0")),
      rskPartnerAddress: '0x8645315E490A05FeE7EDcF671B096E82D9b616a4'
    });
  }, 60 * 1000);


  it('should open a channel with 1 token', async () => {
    await tester.nodes().initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("0")),
      rskPartnerAddress: '0xb9eA1f16E4f1E5CAF211aF150F2147eEd9Fb2245'
    });
  }, 60 * 1000);


  it('should deposit 1 token', async () => {
    await tester.nodes().initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("0")),
      rskPartnerAddress: '0x907E188cAFdE3913296c3d526cD06F103Dbf15a3'
    });
    await tester.nodes().initiator.client.sdk.depositTokens({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("1")),
      partnerAddress: '0x907E188cAFdE3913296c3d526cD06F103Dbf15a3'
    });
  }, 60 * 1000);


  it('should close a channel with 1 token', async () => {
    await tester.nodes().initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("1")),
      rskPartnerAddress: '0x03c173e750DDd140D4eB186c5fe76dfa7dff926C'
    });
    await tester.nodes().initiator.client.sdk.closeChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: '0x03c173e750DDd140D4eB186c5fe76dfa7dff926C'
    });
  }, 60 * 1000);


  it('should close a channel with no balance', async () => {
    await tester.nodes().initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei:Number(Web3.utils.toWei("0")),
      rskPartnerAddress: '0xa749925DC36f4f15fdA3E23325097A42Cb0369D0'
    });
    await tester.nodes().initiator.client.sdk.closeChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: '0xa749925DC36f4f15fdA3E23325097A42Cb0369D0'
    });
  }, 60 * 1000);



  it('should close a channel from partner', async () => {
    /* TODO: Uncomment when we have dynamic node creation
    await tester.nodes().initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("0")),
      rskPartnerAddress: tester.nodes().target.address
    });
    await tester.nodes().target.client.sdk.closeChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().initiator.address
    });
  }, 60 * 1000);
*/
  })  
})
