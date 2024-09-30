#Startup script
sudo docker compose -p bet-mavrik up -d

#Shutdown script and volume cleanup
sudo docker compose -p bet-mavrik down
sudo docker volume rm bet-mavrik_redis-data
sudo docker compose up
