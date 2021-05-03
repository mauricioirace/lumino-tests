import Lumino from "lumino-js-sdk";

export function isEmpty(value: any): boolean {
  return Array.isArray(value) ? value.length <= 0 : !value;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ChannelTestCase {
  token: string; // hex address
  partner: string; // hex address
  deposit: number; // in Wei
  balance: number; // in Wei
  state: string; // "opened", "closed"

  constructor(
    tokenAddr: string,
    partnerAddr: string,
    totalDeposit: number,
    balance: number,
    channelState: string
  ) {
    this.token = tokenAddr;
    this.partner = partnerAddr;
    this.deposit = totalDeposit;
    this.balance = balance;
    this.state = channelState;
  }
}

export async function verifyChannel(
  sdk: Lumino,
  tc: ChannelTestCase
): Promise<void> {
  const channelInfo = await sdk.getChannel({
    tokenAddress: tc.token,
    partnerAddress: tc.partner,
  });

  expect(channelInfo.token_address).toBe(tc.token);
  expect(channelInfo.partner_address).toBe(tc.partner);
  expect(channelInfo.total_deposit).toBe(tc.deposit);
  expect(channelInfo.balance).toBe(tc.balance);
  expect(channelInfo.state).toBe(tc.state);
}
