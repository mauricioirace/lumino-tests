import LuminoNode from "./src/LuminoNode";
import { ETHER } from './src/units';

describe("Channels", () => {
  const nodes = {};

  beforeAll(async () => {
    nodes.initiator = await LuminoNode.fromUrl("http://localhost:5001/api/v1");
    nodes.target = await LuminoNode.fromUrl( "http://localhost:5002/api/v1");
  })
  
  it('should open a channel with no balance', async () => {
    await nodes.initiator.client.openChannel({
      tokenAddress: nodes.initiator.tokens[0],
      amountOnWei: 0 * ETHER,
      rskPartnerAddress: '0x8645315E490A05FeE7EDcF671B096E82D9b616a4'
    });
  }, 60 * 1000);


  it('should open a channel with 1 token', async () => {
    await nodes.initiator.client.openChannel({
      tokenAddress: nodes.initiator.tokens[0],
      amountOnWei: 0 * ETHER,
      rskPartnerAddress: '0xb9eA1f16E4f1E5CAF211aF150F2147eEd9Fb2245'
    });
  }, 60 * 1000);

  
  it('should deposit 1 token', async () => {
    await nodes.initiator.client.openChannel({
      tokenAddress: nodes.initiator.tokens[0],
      amountOnWei: 0 * ETHER,
      rskPartnerAddress: '0x907E188cAFdE3913296c3d526cD06F103Dbf15a3'
    });
    await nodes.initiator.client.depositTokens({
      tokenAddress: nodes.initiator.tokens[0],
      amountOnWei: 1 * ETHER,
      partnerAddress: '0x907E188cAFdE3913296c3d526cD06F103Dbf15a3'
    });
  }, 60 * 1000);


  it('should close a channel with 1 token', async () => {
    await nodes.initiator.client.openChannel({
      tokenAddress: nodes.initiator.tokens[0],
      amountOnWei: 1 * ETHER,
      rskPartnerAddress: '0x03c173e750DDd140D4eB186c5fe76dfa7dff926C'
    });
    await nodes.initiator.client.closeChannel({
      tokenAddress: nodes.initiator.tokens[0],
      partnerAddress: '0x03c173e750DDd140D4eB186c5fe76dfa7dff926C'
    });
  }, 60 * 1000);


  it('should close a channel with no balance', async () => {
    await nodes.initiator.client.openChannel({
      tokenAddress: nodes.initiator.tokens[0],
      amountOnWei: 0 * ETHER,
      rskPartnerAddress: '0xa749925DC36f4f15fdA3E23325097A42Cb0369D0'
    });
    await nodes.initiator.client.closeChannel({
      tokenAddress: nodes.initiator.tokens[0],
      partnerAddress: '0xa749925DC36f4f15fdA3E23325097A42Cb0369D0'
    });
  }, 60 * 1000);



  it('should close a channel from partner', async () => {
    await nodes.initiator.client.openChannel({
      tokenAddress: nodes.initiator.tokens[0],
      amountOnWei: 0 * ETHER,
      rskPartnerAddress: nodes.target.address
    });
    await nodes.target.client.closeChannel({
      tokenAddress: nodes.initiator.tokens[0],
      partnerAddress: nodes.initiator.address
    });
  }, 60 * 1000);

})