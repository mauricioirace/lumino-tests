import { ETHER } from "../test/src/units";

export default {
    basic: {
        nodes: 2,
        tokens: [ {
            symbol: "LUM",
            amount: 1
        }, {
            symbol: "RIF",
            amount: 2
        }]
    },
    advanced: {
        nodes: [
            "node00", 
            "node01"
        ],
        channels: [
            {
                token: "LUM",
                particpant1: {
                    node: "node00",
                    deposit: 1
                },
                particpant2: {
                    node: "node01",
                    deposit: 1
                }
            }
        ]
    }
        
        
}