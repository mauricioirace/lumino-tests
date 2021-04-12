import { getTokenAddress } from "../../src/util/token";
import p2p from '../../sample-toplogies/p2p.json';
import setupTestEnvironment from "../../src";
import { LuminoTestEnvironment } from "../../src/types/lumino-test-environment";
import { LuminoNode } from "../../src/types/node";
import { Dictionary } from "../../src/util/collection";

describe("Payments", () => {
  let nodes: Dictionary<LuminoNode>;

  beforeAll(async () => {
    const tester = await setupTestEnvironment(p2p);
    nodes = tester.nodes as Dictionary<LuminoNode>;
  }, 60 * 1000)

  it('should make a payment', async () => {
    const OldInitiatorChannel = await nodes.initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address
    });
    const OldTargetChannel = await nodes.target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.initiator.client.address
    });
    await nodes.initiator.client.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address,
      amountOnWei: 1
    });
    const initiatorChannel = await nodes.initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address
    });
    const targetChannel = await nodes.target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.initiator.client.address
    });
    expect(initiatorChannel.balance === OldInitiatorChannel.balance - 1);
    expect(targetChannel.balance === OldTargetChannel.balance + 1);
  }, 60 * 1000);


  it('should make payments in both directions', async () => {
    const OldInitiatorChannel = await nodes.initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address
    });
    const OldTargetChannel = await nodes.target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.initiator.client.address
    });
    await nodes.initiator.client.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address,
      amountOnWei: 1
    });
    await nodes.target.client.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.initiator.client.address,
      amountOnWei: 1
    });
    const initiatorChannel = await nodes.initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address
    });
    const targetChannel = await nodes.target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.initiator.client.address
    });
    expect(initiatorChannel.balance === OldInitiatorChannel.balance);
    expect(targetChannel.balance === OldTargetChannel.balance);
  }, 60 * 1000);

})
