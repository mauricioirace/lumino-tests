import basic from "../../topologies/basic.json";
import advanced from "../../topologies/advanced.json";
import { SetupJson } from "../../src/types/setup";
import setupTestEnvironment from "../../src";
import { LuminoTestEnvironment } from "../../src/types/lumino-test-environment";
import { LuminoNode } from "../../src/types/node";
import { isEmpty } from "../utils";

const SETUP_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const TEARDOWN_TIMEOUT = 1 * 60 * 1000; // 1 minute

describe("bootstrapping", () => {
  let env: LuminoTestEnvironment;

  afterEach(async () => {
    await env.stop();
  }, TEARDOWN_TIMEOUT);

  it(
    "should be able to boot up a basic node setup",
    async () => {
      env = await setupTestEnvironment(basic as SetupJson);
      await verifyEnv(env);
    },
    SETUP_TIMEOUT
  );

  it(
    "should be able to boot up an advanced node setup",
    async () => {
      env = await setupTestEnvironment(advanced as SetupJson);
      await verifyEnv(env);
    },
    SETUP_TIMEOUT
  );
});

async function verifyEnv(env: LuminoTestEnvironment): Promise<void> {
  expect(Object.keys(env.nodes).length).toBe(2);
  const firstNode = env.nodes.node0 as LuminoNode;
  const secondNode = env.nodes.node1 as LuminoNode;
  const firstAddr = (await firstNode.client.sdk.getAddress()).our_address;
  const secondAddr = (await secondNode.client.sdk.getAddress()).our_address;
  expect(isEmpty(firstAddr)).toBe(false);
  expect(isEmpty(secondAddr)).toBe(false);
}
