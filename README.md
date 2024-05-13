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


