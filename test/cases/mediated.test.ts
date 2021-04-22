import { tokenAddresses, toWei } from "../../src/util/token";
import mediated from '../../sample-toplogies/mediated.json';
import setupTestEnvironment from "../../src";
import { LuminoTestEnvironment } from "../../src/types/lumino-test-environment";
import { LuminoNode } from "../../src/types/node";
import { Dictionary } from "../../src/util/collection";
import { Token } from '../../src/constants';

const TIMEOUT = 10 * 60 * 1000;

describe("Mediated Payments", () => {
  let nodes: Dictionary<LuminoNode>;
  let tester: LuminoTestEnvironment;

  beforeAll(async () => {
    tester = await setupTestEnvironment(mediated);
    nodes = tester.nodes as Dictionary<LuminoNode>;
  }, TIMEOUT);

  afterAll(async () => {
    await tester.stop();
  }, TIMEOUT);

  it('should make a payment', async () => {
    const oldInitiatorMediatorChannel = await nodes.initiator.client.sdk.getChannel({
      tokenAddress: tokenAddresses.LUM,
      partnerAddress: nodes.mediator.client.address
    });
    const oldMediatoInitiatorrChannel = await nodes.mediator.client.sdk.getChannel({
      tokenAddress: tokenAddresses.LUM,
      partnerAddress: nodes.initiator.client.address
    });
    const oldMediatorTargetChannel = await nodes.mediator.client.sdk.getChannel({
      tokenAddress: tokenAddresses.LUM,
      partnerAddress: nodes.target.client.address
    });
    const oldTargetMediatorChannel = await nodes.target.client.sdk.getChannel({
      tokenAddress: tokenAddresses.LUM,
      partnerAddress: nodes.mediator.client.address
    });
    await nodes.initiator.client.sdk.makePayment({
      tokenAddress: tokenAddresses.LUM,
      partnerAddress: nodes.target.client.address,
      amountOnWei: toWei(1)
    });
    const initiatorMediatorChannel = await nodes.initiator.client.sdk.getChannel({
      tokenAddress: tokenAddresses.LUM,
      partnerAddress: nodes.mediator.client.address
    });
    const mediatoInitiatorrChannel = await nodes.mediator.client.sdk.getChannel({
      tokenAddress: tokenAddresses.LUM,
      partnerAddress: nodes.initiator.client.address
    });
    const mediatorTargetChannel = await nodes.mediator.client.sdk.getChannel({
      tokenAddress: tokenAddresses.LUM,
      partnerAddress: nodes.target.client.address
    });
    const targetMediatorChannel = await nodes.target.client.sdk.getChannel({
      tokenAddress: tokenAddresses.LUM,
      partnerAddress: nodes.mediator.client.address
    });
    expect(initiatorMediatorChannel.balance === oldInitiatorMediatorChannel.balance - 1);
    expect(mediatoInitiatorrChannel.balance === oldMediatoInitiatorrChannel.balance + 1);
    expect(mediatorTargetChannel.balance === oldMediatorTargetChannel.balance - 1);
    expect(targetMediatorChannel.balance === oldTargetMediatorChannel.balance + 1);
  }, TIMEOUT);


})
