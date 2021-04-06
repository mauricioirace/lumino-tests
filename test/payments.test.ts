import { getTokenAddress } from "../src/token/util";
import p2p from '../sample-toplogies/p2p.json';
import LuminoTesting from "../src";

describe("Payments", () => {
  let tester;

  beforeAll(async () => {
    tester = await LuminoTesting(p2p);
  }, 60 * 1000)

  it('should make a payment', async () => {
    const OldInitiatorChannel = await tester.nodes().initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().target.client.address
    });
    const OldTargetChannel = await tester.nodes().target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().initiator.client.address
    });
    await tester.nodes().initiator.client.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().target.client.address,
      amountOnWei: 1
    });
    const initiatorChannel = await tester.nodes().initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().target.client.address
    });
    const targetChannel = await tester.nodes().target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().initiator.client.address
    });
    expect(initiatorChannel.balance === OldInitiatorChannel.balance - 1);
    expect(targetChannel.balance === OldTargetChannel.balance + 1);
  }, 60 * 1000);


  it('should make payments in both directions', async () => {
    const OldInitiatorChannel = await tester.nodes().initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().target.client.address
    });
    const OldTargetChannel = await tester.nodes().target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().initiator.client.address
    });
    await tester.nodes().initiator.client.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().target.client.address,
      amountOnWei: 1
    });
    await tester.nodes().target.client.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().initiator.client.address,
      amountOnWei: 1
    });
    const initiatorChannel = await tester.nodes().initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().target.client.address
    });
    const targetChannel = await tester.nodes().target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: tester.nodes().initiator.client.address
    });
    expect(initiatorChannel.balance === OldInitiatorChannel.balance);
    expect(targetChannel.balance === OldTargetChannel.balance);
  }, 60 * 1000);

})
