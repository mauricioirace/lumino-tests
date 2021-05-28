import p2p from '../../../../topologies/p2p.json';
import { LuminoTestEnvironment } from '../../../../src/types/lumino-test-environment';
import { LuminoNodeList } from '../../../../src/types/node';
import setupTestEnvironment from '../../../../src';
import { tokenAddresses, toWei } from '../../../../src/util/token';
import { Timeouts } from '../../../common';
import { PaymentParams } from 'lumino-js-sdk';
import { given } from '../../../utils/assertions';

describe('payments p2p', () => {
    let nodes: LuminoNodeList;
    let env: LuminoTestEnvironment;

    // starting deposit for nodes
    const aliceDeposit = toWei(
        p2p.channels[0].participant1.deposit // should be inferred
    );
    const bobDeposit = toWei(
        p2p.channels[0].participant2.deposit // should be inferred
    );

    // payment amounts to be made
    const alicePaymentAmount = toWei(1);
    const bobPaymentAmount = toWei(2);

    beforeEach(async () => {
        env = await setupTestEnvironment(p2p);
        nodes = env.nodes;
    }, Timeouts.SETUP);

    afterEach(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    test(
        'alice node, 1 token',
        async () => {
            const payment: PaymentParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.bob.client.address,
                amountOnWei: alicePaymentAmount
            };
            await nodes.alice.client.sdk.makePayment(payment);
            // verify alice -> bob
            await given(nodes.alice)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.bob.client.address
                })
                .toHaveBalance(aliceDeposit - alicePaymentAmount);
            // now verify from "bob" node
            await given(nodes.bob)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.alice.client.address
                })
                .toHaveBalance(bobDeposit + alicePaymentAmount);
        },
        Timeouts.TEST
    );

    test(
        '2 tokens, bob node',
        async () => {
            // pay alice -> bob
            await nodes.alice.client.sdk.makePayment({
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.bob.client.address,
                amountOnWei: alicePaymentAmount
            });
            // pay bob -> alice
            await nodes.bob.client.sdk.makePayment({
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.alice.client.address,
                amountOnWei: bobPaymentAmount
            });
            // verify from "bob" node
            await given(nodes.bob)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.alice.client.address
                })
                .toHaveBalance(
                    bobDeposit + alicePaymentAmount - bobPaymentAmount
                );
            // repeat verification from "alice" node
            await given(nodes.alice)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.bob.client.address
                })
                .toHaveBalance(
                    aliceDeposit - alicePaymentAmount + bobPaymentAmount
                );
        },
        Timeouts.TEST
    );
});
