## To run: 
+ requirements: Docker, docker-componse , sh
+ Setup .env file like my .env.example template (unnecessary because you can use my .env file without modify)
+ Command to run:
```
sh start.sh
```

## To stop: 
+ Command to run:
```
sh stop.sh
```


## Note:
+ If mysql DB don't have any table at first time run project, you must exec to order-service container to migrate database:
```
docker exec -it <order-service-container-id> sh
yarn db:migrate
```
+ If mysql DB don't have any records on products table, you must exec to order-service container to seeding product table:
```
docker exec -it <order-service-container-id> sh
yarn db:seed
```
