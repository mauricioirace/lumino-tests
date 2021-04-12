
import setupTestEnvironment from "../../src";
import noChannels from '../../sample-toplogies/no-channels.json';
import Web3 from 'web3';
import { getTokenAddress } from "../../src/util/token";
import { LuminoTestEnvironment } from "../../src/types/lumino-test-environment";
import { Dictionary } from "../../src/util/collection";
import { LuminoNode } from "../../src/types/node";

describe("Channels", () => {
  let nodes: Dictionary<LuminoNode>;

  beforeAll(async () => {
    const tester = await setupTestEnvironment(noChannels);
    nodes = tester.nodes as Dictionary<LuminoNode>;
  }, 60 * 1000);

  it('should open a channel with no balance', async () => {
    await nodes.initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("0")),
      rskPartnerAddress: '0x8645315E490A05FeE7EDcF671B096E82D9b616a4'
    });
  }, 60 * 1000);


  it('should open a channel with 1 token', async () => {
    await nodes.initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("0")),
      rskPartnerAddress: '0xb9eA1f16E4f1E5CAF211aF150F2147eEd9Fb2245'
    });
  }, 60 * 1000);


  it('should deposit 1 token', async () => {
    await nodes.initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("0")),
      rskPartnerAddress: '0x907E188cAFdE3913296c3d526cD06F103Dbf15a3'
    });
    await nodes.initiator.client.sdk.depositTokens({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("1")),
      partnerAddress: '0x907E188cAFdE3913296c3d526cD06F103Dbf15a3'
    });
  }, 60 * 1000);


  it('should close a channel with 1 token', async () => {
    await nodes.initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("1")),
      rskPartnerAddress: '0x03c173e750DDd140D4eB186c5fe76dfa7dff926C'
    });
    await nodes.initiator.client.sdk.closeChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: '0x03c173e750DDd140D4eB186c5fe76dfa7dff926C'
    });
  }, 60 * 1000);


  it('should close a channel with no balance', async () => {
    await nodes.initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei:Number(Web3.utils.toWei("0")),
      rskPartnerAddress: '0xa749925DC36f4f15fdA3E23325097A42Cb0369D0'
    });
    await nodes.initiator.client.sdk.closeChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: '0xa749925DC36f4f15fdA3E23325097A42Cb0369D0'
    });
  }, 60 * 1000);



  it('should close a channel from partner', async () => {
    /* TODO: Uncomment when we have dynamic node creation
    await nodes.initiator.client.sdk.openChannel({
      tokenAddress: getTokenAddress("LUM"),
      amountOnWei: Number(Web3.utils.toWei("0")),
      rskPartnerAddress: nodes.target.address
    });
    await nodes.target.client.sdk.closeChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.initiator.address
    });
  }, 60 * 1000);
*/
  })  
})
