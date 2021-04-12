import { getTokenAddress, toWei } from "../../src/util/token";
import p2p from '../../sample-toplogies/p2p.json';
import setupTestEnvironment from "../../src";
import { LuminoTestEnvironment } from "../../src/types/lumino-test-environment";
import { LuminoNode } from "../../src/types/node";
import { Dictionary } from "../../src/util/collection";

const TIMEOUT = 10 * 60 * 1000;


describe("Payments", () => {
  let nodes: Dictionary<LuminoNode>;
  let tester: LuminoTestEnvironment;

  beforeAll(async () => {
    tester = await setupTestEnvironment(p2p);
    nodes = tester.nodes as Dictionary<LuminoNode>;
  }, TIMEOUT);

  afterAll(async () => {
    await tester.stop();
  }, TIMEOUT);

  it('should make a payment', async () => {
    const OldInitiatorChannel = await nodes.initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address
    });
    const OldTargetChannel = await nodes.target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.initiator.client.address
    });
    console.debug(OldInitiatorChannel.balance)
    console.debug(OldTargetChannel)
    await nodes.initiator.client.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address,
      amountOnWei: toWei(1)
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
  }, TIMEOUT);


  it('should make payments in both directions', async () => {
    const OldInitiatorChannel = await nodes.initiator.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address
    });
    const OldTargetChannel = await nodes.target.client.sdk.getChannel({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.initiator.client.address
    });
    console.debug(OldInitiatorChannel.balance)
    console.debug(OldTargetChannel)
    await nodes.initiator.client.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.target.client.address,
      amountOnWei: toWei(1)
    });
    await nodes.target.client.sdk.makePayment({
      tokenAddress: getTokenAddress("LUM"),
      partnerAddress: nodes.initiator.client.address,
      amountOnWei: toWei(1)
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
  }, TIMEOUT);

})
