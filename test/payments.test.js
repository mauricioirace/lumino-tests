import LuminoNode from "./src/LuminoNode";
import { ETHER } from './src/units';

describe("Payments", () => {
  const nodes = {};

  beforeAll(async () => {
    nodes.initiator = await LuminoNode.fromUrl("http://localhost:5001/api/v1");
    nodes.target = await LuminoNode.fromUrl( "http://localhost:5002/api/v1");
    await nodes.initiator.client.openChannel({
      tokenAddress: nodes.initiator.tokens[0],
      amountOnWei: 10 * ETHER,
      rskPartnerAddress: nodes.target.address
    });
    await nodes.target.client.depositTokens({
      tokenAddress: nodes.initiator.tokens[0],
      amountOnWei: 10 * ETHER,
      partnerAddress: nodes.initiator.address
    });
  }, 60 * 1000)
  
  it('should make a payment', async () => {
    const OldInitiatorChannel = await nodes.initiator.client.getChannel({ 
      tokenAddress: nodes.initiator.tokens[0], 
      partnerAddress: nodes.target.address 
    });
    const OldTargetChannel = await nodes.target.client.getChannel({ 
      tokenAddress: nodes.initiator.tokens[0], 
      partnerAddress: nodes.initiator.address 
    });
    await nodes.initiator.client.makePayment({
      tokenAddress: nodes.initiator.tokens[0],
      partnerAddress: nodes.target.address,
      amountOnWei: 1 * ETHER
    });
    const initiatorChannel = await nodes.initiator.client.getChannel({ 
      tokenAddress: nodes.initiator.tokens[0], 
      partnerAddress: nodes.target.address 
    });
    const targetChannel = await nodes.target.client.getChannel({ 
      tokenAddress: nodes.initiator.tokens[0], 
      partnerAddress: nodes.initiator.address 
    });
    expect(initiatorChannel.balance === OldInitiatorChannel.balance - 1 * ETHER);
    expect(targetChannel.balance === OldTargetChannel.balance + 1 * ETHER);
  }, 60 * 1000);


  it('should make payments in both directions', async () => {
    const OldInitiatorChannel = await nodes.initiator.client.getChannel({ 
      tokenAddress: nodes.initiator.tokens[0], 
      partnerAddress: nodes.target.address 
    });
    const OldTargetChannel = await nodes.target.client.getChannel({ 
      tokenAddress: nodes.initiator.tokens[0], 
      partnerAddress: nodes.initiator.address 
    });
    await nodes.initiator.client.makePayment({
      tokenAddress: nodes.initiator.tokens[0],
      partnerAddress: nodes.target.address,
      amountOnWei: 1 * ETHER
    });
    await nodes.target.client.makePayment({
      tokenAddress: nodes.initiator.tokens[0],
      partnerAddress: nodes.initiator.address,
      amountOnWei: 1 * ETHER
    });
    const initiatorChannel = await nodes.initiator.client.getChannel({ 
      tokenAddress: nodes.initiator.tokens[0], 
      partnerAddress: nodes.target.address 
    });
    const targetChannel = await nodes.target.client.getChannel({ 
      tokenAddress: nodes.initiator.tokens[0], 
      partnerAddress: nodes.initiator.address 
    });
    expect(initiatorChannel.balance === OldInitiatorChannel.balance);
    expect(targetChannel.balance === OldTargetChannel.balance);
  }, 60 * 1000);

})