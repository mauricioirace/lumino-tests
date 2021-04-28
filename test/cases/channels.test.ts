import setupTestEnvironment from "../../src";
import noChannels from "../../topologies/no-channels.json";
import { tokenAddresses, toWei } from "../../src/util/token";
import { LuminoTestEnvironment } from "../../src/types/lumino-test-environment";
import { Dictionary } from "../../src/util/collection";
import { LuminoNode } from "../../src/types/node";
import { Token } from "../../src/constants";

const TIMEOUT = 10 * 60 * 1000;

describe("Channels", () => {
  let nodes: Dictionary<LuminoNode>;
  let tester: LuminoTestEnvironment;

  beforeAll(async () => {
    tester = await setupTestEnvironment(noChannels);
    nodes = tester.nodes as Dictionary<LuminoNode>;
  }, TIMEOUT);

  afterAll(async () => {
    await tester.stop();
  }, TIMEOUT);

  it(
    "should open a channel with no balance",
    async () => {
      const tokenAddress = tokenAddresses.LUM;
      const partnerAddress = "0x8645315E490A05FeE7EDcF671B096E82D9b616a4";
      await nodes.initiator.client.sdk.openChannel({
        tokenAddress,
        amountOnWei: toWei(0),
        rskPartnerAddress: partnerAddress,
      });
      await nodes.initiator.client.sdk.getChannel({
        tokenAddress,
        partnerAddress,
      });
    },
    TIMEOUT
  );

  it(
    "should open a channel with 1 token",
    async () => {
      const tokenAddress = tokenAddresses.LUM;
      const partnerAddress = "0xb9eA1f16E4f1E5CAF211aF150F2147eEd9Fb2245";
      await nodes.initiator.client.sdk.openChannel({
        tokenAddress,
        amountOnWei: toWei(0),
        rskPartnerAddress: partnerAddress,
      });
      await nodes.initiator.client.sdk.getChannel({
        tokenAddress,
        partnerAddress,
      });
    },
    60 * 1000
  );

  it(
    "should deposit 1 token",
    async () => {
      const tokenAddress = tokenAddresses.LUM;
      const partnerAddress = "0x907E188cAFdE3913296c3d526cD06F103Dbf15a3";
      await nodes.initiator.client.sdk.openChannel({
        tokenAddress,
        amountOnWei: toWei(0),
        rskPartnerAddress: partnerAddress,
      });
      await nodes.initiator.client.sdk.depositTokens({
        tokenAddress,
        amountOnWei: toWei(1),
        partnerAddress: partnerAddress,
      });
      await nodes.initiator.client.sdk.getChannel({
        tokenAddress,
        partnerAddress,
      });
    },
    60 * 1000
  );

  it(
    "should close a channel with 1 token",
    async () => {
      const tokenAddress = tokenAddresses.LUM;
      const partnerAddress = "0x03c173e750DDd140D4eB186c5fe76dfa7dff926C";
      await nodes.initiator.client.sdk.openChannel({
        tokenAddress,
        amountOnWei: toWei(0),
        rskPartnerAddress: partnerAddress,
      });
      await nodes.initiator.client.sdk.closeChannel({
        tokenAddress,
        partnerAddress: partnerAddress,
      });
      await nodes.initiator.client.sdk.getChannel({
        tokenAddress,
        partnerAddress,
      });
    },
    60 * 1000
  );

  it(
    "should close a channel with no balance",
    async () => {
      const tokenAddress = tokenAddresses.LUM;
      const partnerAddress = "0xa749925DC36f4f15fdA3E23325097A42Cb0369D0";
      await nodes.initiator.client.sdk.openChannel({
        tokenAddress,
        amountOnWei: toWei(0),
        rskPartnerAddress: partnerAddress,
      });
      await nodes.initiator.client.sdk.closeChannel({
        tokenAddress,
        partnerAddress: partnerAddress,
      });
      await nodes.initiator.client.sdk.getChannel({
        tokenAddress,
        partnerAddress,
      });
    },
    60 * 1000
  );

  it(
    "should close a channel from partner",
    async () => {
      await nodes.initiator.client.sdk.openChannel({
        tokenAddress: tokenAddresses.LUM,
        amountOnWei: toWei(0),
        rskPartnerAddress: nodes.target.client.address,
      });
      await nodes.target.client.sdk.closeChannel({
        tokenAddress: tokenAddresses.LUM,
        partnerAddress: nodes.initiator.client.address,
      });
    },
    60 * 1000
  );
});
