# NestJS Base Starter

- [Introduction](#introduction)
- [Setup](#setup)
- [Folder structure](#folder-structure)
- [Configuration](#configure)
- [Migration & Seed](#migration--seed)
- [Command](#command)

<a name="introduction"></a>

## Introduce

Information about [NestJS](https://docs.nestjs.com/)

<a name="setup"></a>

## Setup

<a name="directory-structure"></a>

## Directory structure

Use the tree command to view the directory structure

```
tree -L 4 -I 'node_modules|dist|test|README*|tsconfig*|yarn*'
```

<a name="configuration"></a>

## Configuration

The basic configuration of the system will be saved in the file `.env`.
To get started, initialize the file `.env` with the same content as the file `.env.example`

Configure basic information

```
# App name
APP_NAME=
# Working application environment, can be local, testing or production
APP_ENV=
# Any string used to encrypt the user's token
APP_KEY=
# Token valid time
JWT_TTL=2592000000
# Enable / Disable debugging or logging
APP_DEBUG=true
```

Database configuration

```
# Database type using `mysql`, `postgres`, `cockroachdb`, `mariadb`, `sqlite`, `better-sqlite3`, `cordova`, `nativescript`, `oracle`, `mssql`, `mongodb` , `sqljs`, `react-native`
# For each type, you will need to install additional packages
# By default KIT is supporting mysql
DB_CONNECTION=
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
# Enable / Disable log all queries to the file `buglogs.log`
DB_LOGGING=true
```


<a name="migration--seed"></a>

## Migration & Seed

Migration is like being able to manage your database, it supports creating, editing and restoring your database.

System migration files are stored in `database/migrations`

To create a new migration file

```
yarn migration:create FileNameHere
```

For example:

```
yarn migration:create CreateUsersTable
```

Migrate database

```
yarn db:migrate
```

On production the migrate command will be run automatically every time the application starts

> details at config file `config/database.ts`

To add default information for the tables in the database we can use the seeder, to create a new seeder file we have the command

```
yarn command make:seeder SeederFileName
```

For example:

```
yarn command make:seeder UsersTableSeeder
```

<a name="command"></a>

## Command

Built-in support system for building custom commands, this greatly aids in product development.
Commands are stored at `src/console/Commands`

To create a new command

```
yarn command make:command CommandNameHere
```

For example:

```
yarn command make:command MyCustomCommand
```

After initializing the command, you need to declare it to the system to be able to use it, to declare you need to update the information in the file `src/console/Kernel.ts`

About how to use the command, please check the notes in the file you just created
