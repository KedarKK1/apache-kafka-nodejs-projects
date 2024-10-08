const { Kafka } = require('kafkajs')

// kafka client
const kafka = new Kafka({
    clientId: "simple-producer-consumer-application",
    brokers: ['localhost:9092']
})


const startProducer = async () => {
    
    // kafka producer
    const producer = kafka.producer(); 

    await producer.connect();
    /*
        control the no of required ackns
        -1 = all in replicas must acknowledge
        0 = no acknowledgement
        1 = only waits for the leader to acknowledge
    */ 
    await producer.send({
        topic: "simple-topic",
        acks: -1,
        messages: [
            {
                key: 'key1',
                value: "my 1st nodejs message",
            },
            {
                key: 'key2',
                value: "my 2nd nodejs message",
                headers: {
                    'correlation-id': "uuid",
                }
            },
            {
                key: 'key3',
                value: "3rd message",
            }
        ],
    })

    await producer.disconnect();
}

const startConsumer = async () => {
    const consumer = kafka.consumer({
        groupId: "simple-group",
    });

    await consumer.connect();
    await consumer.subscribe({
        topic: "simple-topic",
        fromBeginning: true
    })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
                key: message.key.toString(),
                headers: message.headers.toString(),
                topic:topic,
                partition
            })
        },
    })
}

startProducer().then(() => {
    console.log("producer run successfully!");
    startConsumer();
})