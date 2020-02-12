const mysql = require('mysql');
const async = require('async');

const dbPool = mysql.createPool({
  host: 'localhost',
  database: 'batchTestDB',
  user: 'batchuser',
  password: 'batchpassw0rd',
  port: 3396,
});

function insertData(idx, cb) {
  const insertQuery = 'INSERT INTO testTable(is_processed) VALUES (0)';
  console.log(`Processing: ${idx}`);
  dbPool.query(insertQuery, function(err) {
    if(err) {
      console.log('Error inserting:: ', err);
      cb(err);
    } else {
      console.log(`Processed: ${idx}`); 
      cb(null, idx);
    }
  });
}


function run(totalCount) {
  async.times(totalCount, function(n, next) {
    insertData(n, function(err, r) {
      next(err, r); // move to next 
    });
  }, function(err, returnData) {
    if(err) {
      console.log('Incomplete insert', err);
    }
    dbPool.end();
    console.log('Completed');
  })
};



const TOTAL_TEST_RECORD = 10000;
console.log('Started....');
run(TOTAL_TEST_RECORD);