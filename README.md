## Node Batch Process Example

Process data in batches.
Based on this
[example](!https://www.codexpedia.com/node-js/node-js-batch-process-records-in-parallel-from-mysql-table/).

## Dependencies 
- [async](!https://www.npmjs.com/package/async)
- [mysql](!https://www.npmjs.com/package/mysql)

## Getting Started

```sh
# Instanciate database or any database instance can be used
$ docker-compose up -d
## and create table required SQL provided below

# Install depencencis
$ yarn install # or npm install

# Seed database
$ node seedTestData.js

# Run test in batches
$ node index.js 
```

## SQL for sample table
```sql
CREATE TABLE `testTable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_processed` tinyint(1) DEFAULT NULL,
  `evenNum` int(11) DEFAULT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## Thoughts
- Create batch process example using ORMs (e.g. Sequelize)
- Make script that runs the batch processing script using cron jobs.