## To run: 
+ requirements: Docker, docker-componse , sh
+ Setup .env file like my .env.example template (unnecessary because you can use my .env file without modify)
+ Command to run:
```
# Command to run
- sh start.sh
```
+ web app: <a>localhost:3000</a>
+ order service: <a>localhost:3001</a>
+ order service swagger: <a>localhost:3001/docs</a>
+ payment service: <a>localhost:3002</a>
+ MySql: <a>localhost:3003</a>

## To stop: 
```
# Command to run
- sh stop.sh
```


## Note:
+ If mysql DB don't have any table at first time run project, you must exec to order-service container to migrate database:
```
# exec to order-service-container
- docker exec -it <order-service-container-id> sh
# run migrate database
- yarn db:migrate
```
+ If mysql DB don't have any records on products table, you must exec to order-service container to seeding product table:
```
# exec to order-service-container
- docker exec -it <order-service-container-id> sh
# run seeding to add default records to tables
- yarn db:seed
```
