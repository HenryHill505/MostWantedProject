"use strict";

/*
Build all of your functions for displaying and gathering information below (GUI).
*/

app(data);

// app is the function called to start the entire application
function app(people){
	let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo);

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

//Main search function
function executeSearch(people, criteriaCounter){
	let userSearchChoice = prompt("What would you like to search by? 'height', 'weight', 'eye color', 'gender', 'age', 'occupation'.");
	let filteredPeople;

	criteriaCounter++;
    switch(userSearchChoice){
		case "height": //Search by height
			filteredPeople = searchByHeight(people);
			break;
		case "weight": //Search by weight
			filteredPeople = searchByWeight(people);
			break;
		case "eye color": //Search my eye color
			filteredPeople = searchByEyeColor(people);
			break;
		case "gender": //Search by gender
			filteredPeople = searchByGender(people);
			break;
		case "age": //Search by age
			filteredPeople = searchByAge(people);
			break;
		case "occupation": //Search by occupation
			filteredPeople = searchByOccupation(people);
			break;
		default:
			alert("You entered an invalid search type! Please try again.");
			filteredPeople = executeSearch(people,5); //pass in criteriaCounter = 5 so we don't start recursivley stacking "Include more criteria?" prompts.
			break;
	}

	//Asks the user if they would like to include more traits for their search. 5 traits maximum
	if (criteriaCounter < 5){
		let moreCriteriaPrompt = promptFor("Do you want to include more search criteria? Answer 'Yes' or 'No'",yesNo);
		if (moreCriteriaPrompt === "yes"){
			filteredPeople = executeSearch(filteredPeople,criteriaCounter);
		}
	}
	return filteredPeople;
}

//Search by trait
function searchByTraits(people) {
	let moreCriteria = true;
	let filteredPeople = executeSearch(people, 0);

	if(filteredPeople.length === 0){
		alert("Unable to find anyone matching search criteria.");
		app(people);
	}else{
		let arrayIndexCounter = 0;
		let searchResultArray = filteredPeople.map(function(el){
			arrayIndexCounter++;
			return arrayIndexCounter+". "+el.lastName+", "+el.firstName;
		})

		let searchResultString = searchResultArray.join("\n");
		let selectedPersonNumber;

		do{
			selectedPersonNumber = Number(prompt("The following people matched the search criteria. Select a person by number:\n"+searchResultString+"\n"));
		}while(!Number.isInteger(selectedPersonNumber) || selectedPersonNumber > searchResultArray.length || selectedPersonNumber <= 0)
		mainMenu(filteredPeople[selectedPersonNumber-1], people);
	}
}

//Search by age function
function searchByAge(people){
	let userInputAge = Number(promptFor("Enter this person's age as an integer",isNumeric));
	let newArray = people.filter(function (el){
		if(calculateAgeFromBirthDate(el.dob)===Number(userInputAge)){
			return true;
		}
		// return true if current date - el.dob matches userInputAge
	});
	return newArray;
}

function searchByEyeColor(people){
	let userInputEyeColor = prompt("Enter this person's eye color.");
	let newArray = people.filter(function(el){
		if(el.eyeColor === userInputEyeColor){
			return true;
		}
		// return true if el.eyeColor matches userInputEyeColor
	});
	return newArray;
}

function searchByGender(people){
	let userInputGender = promptFor("Enter this person's gender as 'male' or 'female'",isGender);
	let newArray = people.filter(function(el){
		if(el.gender === userInputGender){
			return true;
	    }
		// return true if el.gender matches userInputGender
	});
	return newArray;
}

function searchByHeight(people){
	let userInputHeight = Number(promptFor("Enter this person's height as an integer.",isNumeric));
	let newArray = people.filter(function(el){
		if(el.height === userInputHeight){
			return true;
		}
		// return true if el.Height matches userInputHeight
	});
	return newArray;
}

function searchByOccupation(people){
	let userInputOccupation = prompt("Enter this person's occupation.");
	let newArray = people.filter(function(el){
		if(el.occupation === userInputOccupation){
			return true;
		}
		// return true if el.occupation matches userInputOccupation
	});
	return newArray;
}

function searchByWeight(people){
	let userInputWeight = Number(promptFor("Enter this person's weight as an integer",isNumeric));
	let newArray = people.filter(function(el){
		if(el.weight === userInputWeight) {
			return true;
		}
		// return true if el.weight matches userInputWeight
	});
	return newArray;
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

	/* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people.
	We need people in order to find descendants and other information that the user may want. */

	if(!person){
		alert("Could not find that individual.");
		return app(people); // restart
	}

	let displayOption = prompt("Found " + person.firstName + " " + person.lastName
		+ " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'").toLowerCase();

	switch(displayOption){
		case "info":
			displayPerson(person);
			break;
		case "family":
			familyInfo(person, people);
			break;
		case "descendants":
			let descendantString = descendantInfo(person, people,true);

			descendantString = descendantString.map(function(el){
				return el.firstName + " " + el.lastName;
			});

			if(descendantString.length >= 1){
				alert(person.firstName + " " + person.lastName + "'s descendants are:\n" + descendantString.join("\n"));
			} else {
				alert("This person does not have any descendants.")
			}
			break;
		case "restart":
			app(people); //Restart
			break;
		case "quit":
			return; //Stop execution
		default:
			return mainMenu(person, people); // ask again
	}
}

function searchByName(people){
	let firstName = promptFor("What is the person's first name?", chars);
	let lastName = promptFor("What is the person's last name?", chars);
	let arrayLength = people.length;

	//loop through the array until the person is found, then alert the user
	for(let i = 0; i < arrayLength; i++){
		if(people[i].firstName.toLowerCase() === firstName && people[i].lastName.toLowerCase() === lastName){
			let selectedPerson = people[i];
			mainMenu(selectedPerson,people);
		}
	}

	if(people[i].firstName.toLowerCase() !== firstName && people[i].lastName.toLowerCase() !== lastName){
		alert("We couldn't find the person you were looking for.");
		searchByName(people);
	}

}

// alerts a list of people
function displayPeople(people){
	alert(people.map(function(person){
		return person.firstName + " " + person.lastName;
	}).join("\n"));
}

// print all of the information about a person:
// height, weight, age, name, occupation, eye color.
function displayPerson(person){
	let personPropertyKeys = Object.keys(person);
	let personPropertyValues = Object.values(person);

	let displayString = "";
	for (let i = 0; i < 9; i++){
		displayString += personPropertyKeys[i] + ": " + personPropertyValues[i] + "\n";
	}
	alert(displayString);
}

//Get and display the descendant info
function descendantInfo(person, people, getAllDescendants){

	let descendantsArray = people.filter(function(el){
		for(let i = 0; i < el.parents.length; i++){
			if(person.id === el.parents[i]){
				return true;
			}
		}
	});
	//If trying to find all descendants, call descendantInfo recursively on the previous round of descendants
	if (getAllDescendants){
		for(let j = 0; j < descendantsArray.length; j++){
			descendantsArray.push.apply(descendantsArray, descendantInfo(descendantsArray[j], people, true));
		}
  }
    return descendantsArray;
}

//Get and display family information of the person, such as spouse, siblings, parents and children
function familyInfo(person, people){
	let parentSet = [];
	let spouseSet = [];
	let siblings = [];
	let siblingSet = [];

	//Code for parents and siblings
	if(person.parents.length >= 1){ //Checks to see if the persons parents isn't empty.
		for(let i = 0; i < person.parents.length; i++){ //Loops through the parents array, number of times depends on length of the size of the array.
			for(let j = 0; j < people.length; j++){ //Loop through the whole database of people.
				if(person.parents[i] === people[j].id){ //Compares persons parent id/ids to the ids in the database and if true...
					let parentName = people[j].firstName + " " + people[j].lastName; //Combine the first name and last name
					parentSet.push(parentName); //Insert into the next available spot in the array
					//Get siblings from current parent
					siblings = descendantInfo(people[j], people, false);
					siblings = (siblings.map(function(el){
						return el.firstName + " " + el.lastName;
        			}))
					siblingSet.push(siblings.join(", "));
				}
			}
		}
	}

//Remove duplicate string from array
	if(siblingSet[0] === siblingSet[1]){
		siblingSet.splice(0,1);
	}
	//Remove the subject's name from the list of his siblings
		if (siblingSet[0] !== undefined){
	    if (siblingSet[0].indexOf(person.firstName+" "+person.lastName)!==-1){
	      let indexOfStart = siblingSet[0].indexOf(person.firstName+" "+person.lastName);
	      let indexOfEnd = indexOfStart+person.firstName.length+person.lastName.length+1;
	      let forwardString = siblingSet[0].slice(0,indexOfStart);
	      let rearString = siblingSet[0].slice(indexOfEnd+2,siblingSet[0].length);
	      siblingSet[0] = forwardString+rearString;
				//remove trailing punctuation
	      if (siblingSet[0].slice(siblingSet[0].length-1) === " "){
	        siblingSet[0] = siblingSet[0].slice(0,siblingSet[0].length-2);
	      }
	    }
		}

	//Checks for children
	let childArray = descendantInfo(person, people, false);
	let childSet = childArray.map(function(el){
		return el.firstName + " " + el.lastName;
	});

	//Code for spouse
	if(person.currentSpouse !== null){ //If the persons spouse isn't empty.
		for(let j = 0; j < people.length; j++){ //Loop through the whole database of people.
			if(person.currentSpouse === people[j].id){ //Compares the spouses id to the ids in the database and if true...
				let spouseName = people[j].firstName + " " + people[j].lastName; //Combine the first name and last name.
				spouseSet.push(spouseName); //Insert into the next available spot in the provided array.
			}
		}
	}else if(person.currentSpouse === null){
		spouseSet.push("No spouse found");
	}
	console.log(siblingSet);
	if(siblingSet < 1){
		siblingSet.unshift("No siblings found");
	}

	if(parentSet < 1){
		parentSet.push("No parents found");
	}

	if(childSet.length < 1){
		childSet.push("No children found");
	}

	//Display the message

	let displayString = "Parents: " + parentSet.join(", ") + "\nSiblings: " + siblingSet[0] + "\nSpouse: " + spouseSet[0] + "\nChildren: " + childSet.join(", ");


	alert(displayString);
}

// function that prompts and validates user input, and change all input toLowerCase
function promptFor(question, valid){
	let response;
	response = prompt(question).trim();
	while (!response || !valid(response)){
		alert("Invalid input. Please enter data as prompted.")
		response = prompt(question).trim();
	}
		return response.toLowerCase();
	}

//Helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
	return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

//Get gender
function isGender(input){
	return input === "male" || input === "female";
}

//Get
function isNumeric(input){
	input = Number(input);
	return Number.isInteger(input);
}

//Helper function to pass in as default promptFor validation
function chars(input){
	return true; // default validation only
}

//Age calculator function
function calculateAgeFromBirthDate(birthDateString){
	let today = new Date();
	let birthDate = new Date(birthDateString);
	let age = today.getFullYear() - birthDate.getFullYear();

	if(birthDate.getMonth() > today.getMonth()){
		age--;
	}else if(birthDate.getMonth()===today.getMonth() && birthDate.getDate() > today.getDate()){
		age--;
	}
	return age;
}
