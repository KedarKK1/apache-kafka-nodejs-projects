const { Kafka } = require('kafkajs')

// kafka client
const kafka = new Kafka({
    clientId: "transaction-producer-application",
    brokers: ['localhost:9092']
})

const startProducer = async () => {
    
    // kafka producer
    const producer = kafka.producer({
        idempotent: true,
        maxInFlightRequests: 1,
        transactionalId: 'someId',
    }); 

    await producer.connect();
    const transaction = await producer.transaction();

    try {
        await producer.send({
            topic: 'topic-transaction',
            messages:[
                {
                    key: "transaction1",
                    value: "Transaction producer demo",
                },
            ],
        });

        await transaction.commit();
        await producer.disconnect();
    }catch(e) {
        console.log("err in transaction: ", e);
        await transaction.abort();
    }

    
}

const startConsumer = async () => {
    const consumer = kafka.consumer({
        groupId: "simple-group2",
    });

    await consumer.connect();
    await consumer.subscribe({
        topic: "topic-transaction",
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
                key: message.key.toString(),
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