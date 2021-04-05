import SetupLoader from "../src/setup";
import { getTokenAddress } from "../src/token/util";
import p2p from '../samples/p2p.json';

describe("Payments", () => {
  let setup;

  beforeAll(async () => {
    setup = await SetupLoader.of(p2p);
  }, 60 * 1000)
  
  it('should make a payment', async () => {
    const OldInitiatorChannel = await setup.nodes.initiator.sdk.getChannel({ 
      tokenAddress: getTokenAddress("LUM"), 
      partnerAddress: (await setup.nodes.target.sdk.getAddress()).our_address
    });
    const OldTargetChannel = await setup.nodes.target.sdk.getChannel({ 
      tokenAddress: getTokenAddress("LUM"), 
      partnerAddress: (await setup.nodes.initiator.sdk.getAddress()).our_address
    });
    await setup.nodes.initiator.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: (await setup.nodes.target.sdk.getAddress()).our_address,
      amountOnWei: 1
    });
    const initiatorChannel = await setup.nodes.initiator.sdk.getChannel({ 
      tokenAddress: getTokenAddress("LUM"), 
      partnerAddress: (await setup.nodes.target.sdk.getAddress()).our_address
    });
    const targetChannel = await setup.nodes.target.sdk.getChannel({ 
      tokenAddress: getTokenAddress("LUM"), 
      partnerAddress: (await setup.nodes.initiator.sdk.getAddress()).our_address
    });
    expect(initiatorChannel.balance === OldInitiatorChannel.balance - 1);
    expect(targetChannel.balance === OldTargetChannel.balance + 1);
  }, 60 * 1000);


  it('should make payments in both directions', async () => {
    const OldInitiatorChannel = await setup.nodes.initiator.sdk.getChannel({ 
      tokenAddress: getTokenAddress("LUM"), 
      partnerAddress: (await setup.nodes.target.sdk.getAddress()).our_address
    });
    const OldTargetChannel = await setup.nodes.target.sdk.getChannel({ 
      tokenAddress: getTokenAddress("LUM"), 
      partnerAddress: (await setup.nodes.initiator.sdk.getAddress()).our_address
    });
    await setup.nodes.initiator.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: (await setup.nodes.target.sdk.getAddress()).our_address,
      amountOnWei: 1
    });
    await setup.nodes.target.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: (await setup.nodes.initiator.sdk.getAddress()).our_address,
      amountOnWei: 1
    });
    const initiatorChannel = await setup.nodes.initiator.sdk.getChannel({ 
      tokenAddress: getTokenAddress("LUM"), 
      partnerAddress: (await setup.nodes.target.sdk.getAddress()).our_address
    });
    const targetChannel = await setup.nodes.target.sdk.getChannel({ 
      tokenAddress: getTokenAddress("LUM"), 
      partnerAddress: (await setup.nodes.initiator.sdk.getAddress()).our_address
    });
    expect(initiatorChannel.balance === OldInitiatorChannel.balance);
    expect(targetChannel.balance === OldTargetChannel.balance);
  }, 60 * 1000);

})