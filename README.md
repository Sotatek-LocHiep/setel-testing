## To run:

- requirements: Docker, docker-componse , sh
- Setup .env file like my .env.example template (unnecessary because you can use my .env file without modify)
- Command to run:

```
# Command to run
  sh start.sh
```

- web app: [http://localhost:3000](http://localhost:3000)
- order service: [http://localhost:3001](http://localhost:3001)
- order service swagger: [http://localhost:3001/docs](http://localhost:3001/docs)
- payment service: [http://localhost:3002](http://localhost:3002)
- MySql: [http://localhost:3003](http://localhost:3003)

## To stop:

```
# Command to run
  sh stop.sh
```

## Note:

- If mysql DB don't have any table at first time run project, you must exec to order-service container to migrate database:

```
# exec to order-service-container
  docker exec -it <order-service-container-id> sh
# run migrate database
  yarn db:migrate
```

- If mysql DB don't have any records on products table, you must exec to order-service container to seeding product table:

```
# exec to order-service-container
  docker exec -it <order-service-container-id> sh
# run seeding to add default records to tables
  yarn db:seed
```

In other exception i don't know exactly what problem your device has with my code while my devices work properly with my code, docker, docker-compose, i have deployed application on my VPS, you can access it here in case something bad happens:
web app: http://103.153.68.164:3000
order service: http://103.153.68.164:3001
order service swagger:http://103.153.68.164:3001/docs
payment service: http://103.153.68.164:3002
MySql: http://103.153.68.164:3003
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=order
MYSQL_USER=root
MYSQL_PORT=3003
