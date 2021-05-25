import { tokenAddresses, toWei } from '../../../src/util/token';
import mediated from '../../../topologies/mediated.json';
import setupTestEnvironment from '../../../src';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNodeList } from '../../../src/types/node';
import { Timeouts } from '../../common';
import { given } from '../../utils/assertions';
import { PaymentParams } from 'lumino-js-sdk';

describe('payments mediated', () => {
    let nodes: LuminoNodeList;
    let env: LuminoTestEnvironment;

    // starting balance for each node
    const aliceDeposit = toWei(mediated.channels[0].participant1.deposit);
    const bobAliceDeposit = toWei(mediated.channels[0].participant2.deposit);
    const bobCharlieDeposit = toWei(mediated.channels[1].participant1.deposit);
    const charlieDeposit = toWei(mediated.channels[1].participant2.deposit);

    const paymentAmount = toWei(1);

    beforeAll(async () => {
        env = await setupTestEnvironment(mediated);
        nodes = env.nodes;
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    test(
        'alice node, 1 token',
        async () => {
            const payment: PaymentParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.charlie.client.address,
                amountOnWei: paymentAmount
            };

            await nodes.alice.client.sdk.makePayment(payment);

            // verify alice -> charlie
            await given(nodes.alice)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.bob.client.address
                })
                .toHaveBalance(aliceDeposit - paymentAmount);

            await given(nodes.bob)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.charlie.client.address
                })
                .toHaveBalance(bobCharlieDeposit - paymentAmount);

            // now verify charlie -> alice
            await given(nodes.charlie)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.bob.client.address
                })
                .toHaveBalance(charlieDeposit + paymentAmount);

            await given(nodes.bob)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.alice.client.address
                })
                .toHaveBalance(bobAliceDeposit + paymentAmount);
        },
        Timeouts.TEST
    );
});
