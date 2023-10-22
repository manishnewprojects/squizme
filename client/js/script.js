// JavaScript code for handling the selection, providing feedback, and counting attempts
const selectButton = document.getElementById('selectButton');
const stateInput = document.getElementById('stateInput');
const statesDatalist = document.getElementById('states');
const feedback = document.getElementById('feedback');
const attempts = document.getElementById('attempts');

// A list of all U.S. states
const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// Populate the data list with states

usStates.forEach(function(state) {
    const option = document.createElement('option');
    option.value = state;
    statesDatalist.appendChild(option);
});


let incorrectAttempts =0;
let last_attempt_date = null;

function getCurrentDatePST() {
  return moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
}

selectButton.addEventListener('click', checkState);

stateInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkState();
    }
});


function state_chk() {

    const today = getCurrentDatePST();

    last_attempt_date = localStorage.getItem('solved_date');
    //console.log("day",last_attempt_date,"attempts",incorrectAttempts);

    if (today == last_attempt_date) {
        incorrectAttempts = localStorage.getItem('attempts');
        
    }

     if (incorrectAttempts >= 2) {
        const state_answer = localStorage.getItem('answerState');
        const messageDiv = document.getElementById('answer_header');
        const resultsDiv = document.getElementById('answer_and_results');

        messageDiv.textContent = 'Thanks for playing. Come back tomorrow for a new quiz.';
        messageDiv.textContent += ` Today's answer was: ${state_answer}`;
      // Replace the entire content of the body with the message
        resultsDiv.textContent = "Share with friends & family";

        showCorrectAnswer();

         //disableInputAndButton();


    }

}

function checkState() {

    var selectedState = stateInput.value.trim();
    const today = getCurrentDatePST();

    last_attempt_date = localStorage.getItem('solved_date');
    //console.log("day",last_attempt_date,"attempts",incorrectAttempts);


    if (today == last_attempt_date) {
        incorrectAttempts = localStorage.getItem('attempts');
        //console.log("yes same day","attempts",incorrectAttempts);
    }

    // Clear the input box
    stateInput.value = '';
    

    // Check if selectedState is empty
    if (selectedState.trim() === '') {
        feedback.innerHTML = 'Error: Please select a state.';
        return; // Exit the function without further actions
    }

    if (incorrectAttempts < 2) {
        if (selectedState === correctState) {
            incorrectAttempts++;
            feedback.innerHTML = '<span class="green-check">&#10004;</span> Correct!';
            
            const descriptions = document.querySelectorAll('.hidden');
            descriptions.forEach(description => {
              description.classList.remove('hidden'); // Remove the 'hidden' class to show descriptions
            });

            disableInputAndButton();
        } else {
              
                feedback.innerHTML = '<span class="red-cross">&#10008;</span> Incorrect. Try again.';
                incorrectAttempts++;
            }
    }

    else {

        feedback.innerHTML = 'You have reached the maximum number of attempts.';
        showCorrectAnswer();
        disableInputAndButton();
    }

    
    attempts.innerHTML = `Attempts: ${incorrectAttempts}/3`;
    feedback.style.display = 'block';
    selectedState.value = '';

    localStorage.setItem('solved_date', getCurrentDatePST());
    localStorage.setItem('attempts', incorrectAttempts);

     
}

function disableInputAndButton() {
    stateInput.disabled = true;
    selectButton.disabled = true;
}

function showCorrectAnswer() {

    feedback.innerHTML += `<br>The correct answer is: ${correctState}`;
    feedback.innerHTML += `<br>New quiz tomorrow!`;
    
    incorrectAttempts = 3;
    const descriptions = document.querySelectorAll('.hidden');
        descriptions.forEach(description => {
          description.classList.remove('hidden'); // Remove the 'hidden' class to show descriptions
        });

    localStorage.setItem('answerState', correctState);
}



