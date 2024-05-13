const { Kafka } = require('kafkajs')

// kafka client
const kafka = new Kafka({
    clientId: "multi-topic-producer-application",
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
    await producer.sendBatch({
        // topic: "simple-topic",
        // acks: -1,
        topicMessages: [
            {
                topic: 'topic-a',
                messages: [
                    {
                        key: 'key1',
                        value: "my 1st nodejs message",
                    }
                ]
            },
            {
                topic:"topic-b",
                messages: [
                    {
                        key: 'key2',
                        value: "my 2nd nodejs message",
                        headers: {
                            'correlation-id': "uuid",
                        }
                    }
                ]
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
        topic: "topic-a",
        fromBeginning: true
    })
    await consumer.subscribe({
        topic: "topic-b",
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
