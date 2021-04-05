export default {
    nodes: [
        "initiator", 
        "target"
    ],
    channels: [
        {
            token: "LUM",
            participant1: {
                node: "initiator",
                deposit: 1
            },
            participant2: {
                node: "target",
                deposit: 1
            }
        }
    ]    
}