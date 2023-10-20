const mysql = require('mysql2');

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '$Skipper!1213',
  database: 'statesquiz_db',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Server console log: Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Server console log: Connected to MySQL database as id ' + db.threadId);
});

module.exports = db;
const NodeCache = require('node-cache');
const moment = require('moment-timezone');

const cache = new NodeCache();
var lastDatabaseQueryDate = null;
let StateFresh = 0;

function getCurrentDatePST() {
  return moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
}


function getStateForToday(callback) {
  // Get the current date in PST timezone
const currentDatePST = getCurrentDatePST();

  
console.log("lastchk", lastDatabaseQueryDate, "now", currentDatePST);
  console.log("compare", getCurrentDatePST(lastDatabaseQueryDate) !== currentDatePST);

  // If it's a new day, perform the database query
 if (!lastDatabaseQueryDate || getCurrentDatePST(lastDatabaseQueryDate) !== currentDatePST) {


  const sql = `
    CALL GenerateUniqueStateId();
  `;

  db.query(sql,(err, results) => {
    if (err) {
      // Handle any error that occurred during the query
      return callback(err, null);
    }
    
    // Return the results as an array  
    // Update the last query date to the current date
      lastDatabaseQueryDate = currentDatePST;
      // Cache the results for this new day
      cache.set('stateForToday', results);
      StateFresh = 1;
     callback(null, results);
  });
} else {
     // Try to retrieve cached data
    const cachedData = cache.get('stateForToday');
     if (cachedData) {
        StateFresh = 0;
       callback(null, cachedData);
   } else {
      callback(null, []);
    }
  }
}


function getRandomFactsForState(stateId, callback) {

console.log("statefresh in get facts", StateFresh);

if (StateFresh == 1) {

  const sql = `
    SELECT fact_id, fact_text, fact_description, fact_link
    FROM statesquiz_db.fact
    WHERE state_id = ?
    ORDER BY RAND()
    LIMIT 3;
  `;
  
  db.query(sql, [stateId], (err, results) => {
    if (err) {
      // Handle any error that occurred during the query
      return callback(err, null);
    }
    
    // Return the results as an array of fact_text values
    // const randomFacts = results.map(row => row.fact_text);
    cache.set('randomFacts', results);
   
    callback(null, results);
  });
} else {

// Try to retrieve cached data
     const cachedData = cache.get('randomFacts');
      if (cachedData) {
      callback(null, cachedData);
     } else {
        callback(null, []);
     }     
   }

 }


function getCurrentDatePST() {
  return moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
}


function get_state_data_for_the_day(callback) {
  // Get the current date in PST timezone
const currentDatePST = getCurrentDatePST();

  
console.log("lastchk", lastDatabaseQueryDate, "now", currentDatePST);
  console.log("compare", getCurrentDatePST(lastDatabaseQueryDate) !== currentDatePST);

  // If it's a new day, perform the database query
 //if (!lastDatabaseQueryDate || getCurrentDatePST(lastDatabaseQueryDate) !== currentDatePST) {


  const sql = `
    CALL GenerateUniqueStateIdWithFacts();
  `;

  db.query(sql,(err, results) => {
    if (err) {
      // Handle any error that occurred during the query
      return callback(err, null);
    }
    
    // Return the results as an array  
    // Update the last query date to the current date
      lastDatabaseQueryDate = currentDatePST;
      // Cache the results for this new day
      cache.set('state_data_for_the_day', results);
      //console.log("all data in the world", results);
      StateFresh = 1;
     callback(null, results);
  });
// } else {
//      // Try to retrieve cached data
//     const cachedData = cache.get('state_date_for_the_day');
//      if (cachedData) {
//         StateFresh = 0;
//        callback(null, cachedData);
//    } else {
//       callback(null, []);
//     }
//   }
}

module.exports = {
  getStateForToday,
  getRandomFactsForState,
  get_state_data_for_the_day
};

