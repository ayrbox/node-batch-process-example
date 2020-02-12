/*
  https://www.codexpedia.com/node-js/node-js-batch-process-records-in-parallel-from-mysql-table/
*/

const mysql = require('mysql');
const async = require('async');

const dbPool = mysql.createPool({
  host: 'localhost',
  database: 'batch-test',
  user: 'batchuser',
  password: 'batchpassw0rd',
  port: 3306,
});

// Update the record of provided 
function process(id) {
  const updateQuery = mysql.format('UPDATE testTable SET is_processed = 1, evenNum= id * 2 WHERE id = ?', [id]);
  return function(cb) {
    dbPool.query(updateQuery, function(err, result) {
      if(err) {
        console.log('Error 3: ', err);
        cb(err);
      } else {
        cb();
      }
    });
  }
}



function batch(batchSize, parallelLimit) {
  const selectQuery = mysql.format('SELECT * FROM testTable WHERE is_processed=0 limit ?', [batchSize]);

  const statusQuery = 'SELECT COUNT(*) AS count FROM testTable WHERE is_processed=1';
  
  return function(cb) {
    const toDo = [];
    dbPool.query(selectQuery, function(err, result) {
      if(err) {
        console.log('Error', err);
        cb(err);
      } else {
        for(var i = 0; i < result.length; i++) {
          toDo.push(process(result[i].id));
        } 

        async.parallelLimit(toDo, parallelLimit, function(err, result) {
          if(err) {
            console.log('Error 2, err');
            cb(err);
          } else {
            dbPool.query(statusQuery, function(err, total) {
              console.log(total[0].count + ' row processed');
              cb();
            });
          }
        });
      }
    });

  }
}




function run(batchSize, parallelLimit, total) {

  function startBatches(total) {
    var toDo = [];
    console.log(`${total} rows to process`);

    for(var i = 0; i  < total; i+= batchSize) {
      toDo.push(batch(batchSize, parallelLimit));
    }


    async.series(toDo, function(err, results) {

      if(err) console.log('Error', err);

      dbPool.end();
      console.log(new Date());
    });
  }


  if(total) {
    startBatches(total);
  } else {
    dbPool.query('SELECT COUNT(*) AS count FROM testTable where is_processed=0', function(err, result) {
      if(err) {
        console.log('Unexpected error', err);
      } else {
        const totalCount = result[0].count;
        startBatches(totalCount);
      }
    });
  }
}


run(1000, 100);