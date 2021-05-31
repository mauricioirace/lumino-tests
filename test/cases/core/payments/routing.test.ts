import { tokenAddresses, toWei } from '../../../../src/util/token';
import mediated from '../../../../topologies/diamond.json';
import setupTestEnvironment from '../../../../src';
import { LuminoTestEnvironment } from '../../../../src/types/lumino-test-environment';
import { LuminoNodeList } from '../../../../src/types/node';
import { Timeouts } from '../../../common';
import { given } from '../../../utils/assertions';
import { PaymentParams } from 'lumino-js-sdk';

describe('payments routing', () => {
    let nodes: LuminoNodeList;
    let env: LuminoTestEnvironment;

    // starting balance for each node
    const aliceDaveLumDeposit = toWei(
        mediated.channels[7].participant2.deposit
    );
    const daveAliceLumDeposit = toWei(
        mediated.channels[7].participant1.deposit
    );
    const daveEveLumDeposit = toWei(mediated.channels[8].participant1.deposit);
    const eveLumDeposit = toWei(mediated.channels[8].participant2.deposit);

    // starting balance for each node
    const aliceBobRifDeposit = toWei(mediated.channels[0].participant2.deposit);
    // starting balance for each node
    const aliceDaveRifDeposit = toWei(
        mediated.channels[3].participant2.deposit
    );

    const paymentAmount = toWei(1);

    beforeAll(async () => {
        env = await setupTestEnvironment(mediated);
        nodes = env.nodes;
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    it(
        'should pay through shortest path',
        async () => {
            // shortest Path is alice -> dave -> eve
            const payment: PaymentParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.eve.client.address,
                amountOnWei: paymentAmount
            };

            await nodes.alice.client.sdk.makePayment(payment);

            // verify alice -> eve
            await given(nodes.alice)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.dave.client.address
                })
                .toHaveBalance(aliceDaveLumDeposit - paymentAmount);

            await given(nodes.dave)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.eve.client.address
                })
                .toHaveBalance(daveEveLumDeposit - paymentAmount);

            // now verify charlie -> alice
            await given(nodes.eve)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.dave.client.address
                })
                .toHaveBalance(eveLumDeposit + paymentAmount);

            await given(nodes.dave)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.alice.client.address
                })
                .toHaveBalance(daveAliceLumDeposit + paymentAmount);
        },
        Timeouts.TEST
    );

    it(
        'should notify error if no path',
        async () => {
            const payment: PaymentParams = {
                tokenAddress: tokenAddresses.RIF,
                partnerAddress: nodes.eve.client.address,
                amountOnWei: toWei(0.00001)
            };

            await expect(
                nodes.alice.client.sdk.makePayment(payment)
            ).rejects.toEqual({
                errors: "Payment couldn't be completed (insufficient funds, no route to target or target offline)."
            });

            // Alice RIF balance should not change
            await given(nodes.alice)
                .expectChannel({
                    tokenAddress: tokenAddresses.RIF,
                    partnerAddress: nodes.dave.client.address
                })
                .toHaveBalance(aliceDaveRifDeposit);
            await given(nodes.alice)
                .expectChannel({
                    tokenAddress: tokenAddresses.RIF,
                    partnerAddress: nodes.bob.client.address
                })
                .toHaveBalance(aliceBobRifDeposit);
        },
        Timeouts.TEST
    );

    it(
        'should notify error if mediator has insufficient funds',
        async () => {
            const payment: PaymentParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.alice.client.address,
                amountOnWei: toWei(5)
            };

            await expect(
                nodes.charlie.client.sdk.makePayment(payment)
            ).rejects.toEqual({
                errors: "Payment couldn't be completed (insufficient funds, no route to target or target offline)."
            });
        },
        Timeouts.TEST
    );
});
