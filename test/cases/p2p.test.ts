import { tokenAddresses, toWei } from "../../src/util/token";
import p2p from "../../topologies/p2p.json";
import setupTestEnvironment from "../../src";
import { LuminoTestEnvironment } from "../../src/types/lumino-test-environment";
import { LuminoNode } from "../../src/types/node";
import { Dictionary } from "../../src/util/collection";
import { ChannelTestCase, sleep, verifyChannel } from "../utils";
const SETUP_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const TEARDOWN_TIMEOUT = 1 * 60 * 1000; // 1 minute
const TEST_TIMEOUT = 1 * 60 * 1000; // 1 minute

describe("payments", () => {
  let nodes: Dictionary<LuminoNode>;
  let tester: LuminoTestEnvironment;

  // starting balance for both channels
  const initiatorDeposit = p2p.channels[0].participant1.deposit;
  const targetDeposit = p2p.channels[0].participant2.deposit;

  // amounts for payments to be made from each node
  const initiatorPayment = 1;
  const targetPayment = 2;

  beforeAll(async () => {
    tester = await setupTestEnvironment(p2p);
    nodes = tester.nodes as Dictionary<LuminoNode>;
  }, SETUP_TIMEOUT);

  afterAll(async () => {
    await tester.stop();
  }, TEARDOWN_TIMEOUT);

  it(
    "should be able to be made in one direction",
    async () => {
      const tcInitiator = new ChannelTestCase(
        tokenAddresses.LUM,
        nodes.target.client.address,
        toWei(initiatorDeposit),
        toWei(initiatorDeposit - initiatorPayment),
        "opened"
      );

      const tcTarget = new ChannelTestCase(
        tokenAddresses.LUM,
        nodes.initiator.client.address,
        toWei(targetDeposit),
        toWei(targetDeposit + initiatorPayment),
        "opened"
      );

      await nodes.initiator.client.sdk.makePayment({
        tokenAddress: tokenAddresses.LUM,
        partnerAddress: nodes.target.client.address,
        amountOnWei: toWei(initiatorPayment),
      });

      await sleep(5000);

      await verifyChannel(nodes.initiator.client.sdk, tcInitiator);
      await verifyChannel(nodes.target.client.sdk, tcTarget);
    },
    TEST_TIMEOUT
  );

  it(
    "should be able to be made in both directions",
    async () => {
      const tcInitiator = new ChannelTestCase(
        tokenAddresses.LUM,
        nodes.target.client.address,
        toWei(initiatorDeposit),
        toWei(initiatorDeposit - initiatorPayment + targetPayment),
        "opened"
      );

      const tcTarget = new ChannelTestCase(
        tokenAddresses.LUM,
        nodes.initiator.client.address,
        toWei(targetDeposit),
        toWei(targetDeposit + initiatorPayment - targetPayment),
        "opened"
      );

      await nodes.target.client.sdk.makePayment({
        tokenAddress: tokenAddresses.LUM,
        partnerAddress: nodes.initiator.client.address,
        amountOnWei: toWei(targetPayment),
      });

      await sleep(5000);

      await verifyChannel(nodes.initiator.client.sdk, tcInitiator);
      await verifyChannel(nodes.target.client.sdk, tcTarget);
    },
    TEST_TIMEOUT
  );
});
