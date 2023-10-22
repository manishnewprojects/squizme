
// Make the Axios GET request to retrieve random facts

function getFacts() {

        console.log("using url", apiUrl);

return axios.get(apiUrl)
    .then(response => {

        
        const facts = response.data;

        const fact_list = facts.facts;

      return fact_list;
    })
    .catch(error => {
      console.error('Error:', error);
      return []; // Return an empty array if there's an error
});
}

function populateStateID(state) {
    //console.log("state info", state);

    const got_stateID = state.gen_stateId[0][0].generated_stateId;

    console.log(`State ID: ${got_stateID}`);

    stateId = `${got_stateID}`;

    // Define the URL of your Express route
 apiUrl = "/randomFacts/" + stateId.toString(); // Replace with the correct URL for your route

        console.log("sending url", apiUrl);

 
}

function populateStateName(state) {
    //console.log("state info", state);

    const got_stateName = state.gen_stateId[0][0].ret_state_name;

    console.log(`State name: ${got_stateName}`);

    stateName = `${got_stateName}`;

    correctState = stateName;
    console.log("statefromdb:", stateName);
 
}

// Call getState to retrieve facts and populate the list
getState()
  .then(statefortheday => {
    //populateStateID(statefortheday);
    //populateStateName(statefortheday);
    // Call getFacts to retrieve facts and populate the list
    getFacts()
      .then(fact_list => {
        populateFactList(fact_list);
     });
  });

  // Make the Axios GET request to retrieve random facts

function getState() {
 
return axios.get("/statefortoday")
    .then(response => {
         
         return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      return []; // Return an empty array if there's an error
});
}



// Function to populate the fact list
function populateFactList(fact_list) {
  const factList = document.getElementById('fact-list');
 
  fact_list.forEach(fact => {
    const listItem = document.createElement('li');
    listItem.textContent = `${fact.fact_text}`;
    factList.appendChild(listItem);

    const additional_facts = document.createElement('div');
    additional_facts.classList.add('hidden', 'fact');


    // Create the anchor element for "Read more"
    const readMoreLink = document.createElement('a');
    readMoreLink.href = fact.fact_link;
    readMoreLink.textContent = ' (Read more)';

    // Concatenate the description and the "Read more" link
    additional_facts.textContent = `${fact.fact_description}`;
    additional_facts.appendChild(readMoreLink);

    factList.appendChild(additional_facts);

  });

}

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.get('/randomFacts/:stateId', (req, res) => {
  const stateId = req.params.stateId;
  
  db.getRandomFactsForState(stateId, (err, randomFacts) => {
    if (err) {
      // Handle the error, e.g., send an error response
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the random facts as a JSON response
    res.json({ facts: randomFacts });
  });
});

app.get('/statefortoday', (req, res) => {
  db.getStateForToday((err, results) => {
    if (err) {
      // Handle the error, e.g., send an error response
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the random facts as a JSON response
    res.json({ gen_stateId: results });
  });
});


//db functions

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