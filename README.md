for error

```
docker-compose up -d
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?   
```
use
```
systemctl start docker
It worked fine for me.

P.S.: after if there is commands that you can't do without sudo, try this:

gpasswd -a $USER docker
```

run 
```
sudo docker run hello-world
```

or 

sudo snap install docker wagere karke dekhow

```
docker-compose up -d
docker ps -a
docker exec -it img_id /bin/sh
docker logs img_id
telnet localhost 9092
docker exec kafka kafka-topics --create --if-not-exists --zookeeper zookeeper:2181 --partitions 1 --replication-factor 1 --topic MY_AWESOME_TOPIC_TWO
```
