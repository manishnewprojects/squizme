
// Define the stateId you want to retrieve facts for
var stateId = ''; // Replace with the actual stateId you want to query
var stateName = ''; // Replace with the actual stateId you want to query
var apiUrl = '';
var correctState = '';

// Make the Axios GET request to retrieve state name & ALL random facts

function get_state_and_all_data() {
return axios.get("/get_state_data_for_the_day")
    .then(response => {
         
         return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      return []; // Return an empty array if there's an error
});
}
     
get_state_and_all_data()
    .then(all_facts => {
        //console.log("got all",all_facts);
        const factList = document.getElementById('fact-list');

        stateName    = all_facts.all_data_for_the_day[0][0].ret_state_name;
        correctState = stateName;
        
        for (let i=0; i < 3; i++){

            const listItem = document.createElement('li');
            listItem.textContent = all_facts.all_data_for_the_day[0][i].fact_text;
            factList.appendChild(listItem);

            const additional_facts = document.createElement('div');
            additional_facts.classList.add('hidden', 'fact');

            // Create the anchor element for "Read more"
            const readMoreLink = document.createElement('a');
            readMoreLink.href = all_facts.all_data_for_the_day[0][i].fact_link;
            readMoreLink.textContent = ' (Read more)';
            readMoreLink.target = '_blank';

            // Concatenate the description and the "Read more" link
            additional_facts.textContent = all_facts.all_data_for_the_day[0][i].fact_description;

            additional_facts.appendChild(readMoreLink);
            factList.appendChild(additional_facts);
        }

    });










