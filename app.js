/*
Build all of your functions for displaying and gathering information below (GUI).
*/

app(data);

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch(searchType){
    case 'yes':
      searchByName(people);
    break;
    case 'no':
      searchByTraits(people);
      break;
    default:
      alert("Wrong! Please try again, following the instructions dummy. :)");
      app(people); // restart app
    break;
  }
}

function executeSearch(people){
  let userSearchChoice = prompt("What would you like to search by? 'height', 'weight', 'eye color', 'gender', 'age', 'occupation'.");

    switch(userSearchChoice) {
      case "height":
        filteredPeople = searchByHeight(people);
        break;
      case "weight":
        filteredPeople = searchByWeight(people);
        break;
      case "eye color":
        filteredPeople = searchByEyeColor(people);
        break;
      case "gender":
        filteredPeople = searchByGender(people);
        break;
      case "age":
        filteredPeople = searchByAge(people);
        break;
      case "occupation":
        filteredPeople = searchByOccupation(people);
        break;
      default:
        alert("You entered an invalid search type! Please try again.");
        searchByTraits(people);
        break;
      }
      let moreCriteriaPrompt = promptFor("Do you want to include more search criteria?",yesNo);
      if (moreCriteriaPrompt === "yes"){
        filteredPeople = executeSearch(filteredPeople);
      }
      return filteredPeople;
}

function searchByTraits(people) {
  let moreCriteria = true;
  let filteredPeople = executeSearch(people);

  let arrayIndexCounter = 0;
  let searchResultArray = filteredPeople.map(function(el){
    arrayIndexCounter++;
    return arrayIndexCounter+". "+el.lastName+", "+el.firstName;
  })

  let searchResultString = searchResultArray.join("\n");
  let selectedPerson = prompt("The following people matched the search criteria:\n"+searchResultString);

  mainMenu(filteredPeople[selectedPerson-1], people);
}

function searchByAge(people){
  let userInputAge = Number(promptFor("What is this person's age?",isNumeric));

  let newArray = people.filter(function (el) {
    if(calculateAgeFromBirthDate(el.dob)===Number(userInputAge)){
      return true;
    }
    // return true if current date - el.dob matches userInputEyeColor
  });
  return newArray;
}

function searchByEyeColor(people){
  let userInputEyeColor = prompt("What is this person's eye color?");

  let newArray = people.filter(function (el) {
    if(el.eyeColor === userInputEyeColor) {
      return true;
    }
    // return true if el.eyeColor matches userInputEyeColor
  });
  return newArray;
}

function searchByGender(people){
  let userInputGender = promptFor("What is this person's gender?",isGender);

  let newArray = people.filter(function (el) {
    if(el.gender === userInputGender) {
      return true;
    }
    // return true if el.gender matches userInputGender
  });
  return newArray;
}

function searchByHeight(people) {
  let userInputHeight = Number(promptFor("How tall is the person?",isNumeric));

  let newArray = people.filter(function (el) {
    if(el.height === userInputHeight) {
      return true;
    }
    // return true if el.Height matches userInputHeight
  });
  return newArray;
}

function searchByOccupation(people){
  let userInputOccupation = prompt("What is this person's occupation?");

  let newArray = people.filter(function (el) {
    if(el.occupation === userInputOccupation) {
      return true;
    }
    // return true if el.occupation matches userInputOccupation
  });
  return newArray;
}

function searchByWeight(people) {
  let userInputWeight = Number(promptFor("How much does the person weigh?",isNumeric));

  let newArray = people.filter(function (el) {
    if(el.weight === userInputWeight) {
      return true;
    }
    // return true if el.weight matches userInputWeight
  });

  return newArray;
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");


  switch(displayOption){
    case "info":
      displayPerson(person);
    break;
    case "family":
    // TODO: get person's family
    break;
    case "descendants":
    // TODO: get person's descendants
    break;
    case "restart":
      app(people); // restart
    break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);
  let arrayLength = people.length;

  //loop through the array until the person is found, then alert the user
  for (i=0; i<arrayLength; i++){
    if (people[i].firstName.toLowerCase() === firstName && people[i].lastName.toLowerCase() === lastName){
      let selectedPerson = people[i];
      mainMenu(selectedPerson,people);
      break;
    }
  }
}

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personPropertyKeys = Object.keys(person);
  let personPropertyValues = Object.values(person);
  let displayString="";
  for (let i=0;i<9;i++){
    displayString += personPropertyKeys[i]+": "+personPropertyValues[i]+"\n";
  }
  alert(displayString);
}

// function that prompts and validates user input, and change all input toLowerCase
function promptFor(question, valid){
  let response;
  do{
    response = prompt(question).trim().toLowerCase();
  }while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

function isGender(input){
  return input === "male" || input === "female";
}

function isNumeric(input){
  input = Number(input);
  return Number.isInteger(input);
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}

function calculateAgeFromBirthDate(birthDateString){
  let today = new Date();
  let birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();

  if(birthDate.getMonth()>today.getMonth()){
    age--;
  } else if(birthDate.getMonth()===today.getMonth()&&birthDate.getDate()>today.getDate()){
    age--
  }
  return age;
}
