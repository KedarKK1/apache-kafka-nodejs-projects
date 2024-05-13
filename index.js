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
    await producer.send({
        topic: "simple-topic",
        messages: [
            {
                value: "my 1st nodejs message",
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
            })
        },
    })
}

startProducer().then(() => {
    console.log("producer run successfully!");
    startConsumer();
})