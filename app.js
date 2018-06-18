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
			//pass in criteriaCounter = 5 so we don't start recursivley stacking "Include more criteria?" prompts.
			ilteredPeople = executeSearch(people,5);
			break;
	}

	//Asks the user if they would like to include more traits for their search
	if (criteriaCounter < 5){
		let moreCriteriaPrompt = promptFor("Do you want to include more search criteria?",yesNo);
		if (moreCriteriaPrompt === "yes"){
			filteredPeople = executeSearch(filteredPeople,criteriaCounter);
		}
	}
	return filteredPeople;
}

//Search by trait function
function searchByTraits(people) {
	let moreCriteria = true;
	let filteredPeople = executeSearch(people, 0);

	if(filteredPeople.length === 0){
		alert("No results found");
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
	let userInputAge = Number(promptFor("What is this person's age?",isNumeric));
	let newArray = people.filter(function (el){
		if(calculateAgeFromBirthDate(el.dob)===Number(userInputAge)){
			return true;
		}
		// return true if current date - el.dob matches userInputAge
	});
	return newArray;
}

function searchByEyeColor(people){
	let userInputEyeColor = prompt("What is this person's eye color?");
	let newArray = people.filter(function(el){
		if(el.eyeColor === userInputEyeColor){
			return true;
		}
		// return true if el.eyeColor matches userInputEyeColor
	});
	return newArray;
}

function searchByGender(people){
	let userInputGender = promptFor("What is this person's gender?",isGender);
	let newArray = people.filter(function(el){
		if(el.gender === userInputGender){
			return true;
	    }
		// return true if el.gender matches userInputGender
	});
	return newArray;
}

function searchByHeight(people){
	let userInputHeight = Number(promptFor("How tall is the person?",isNumeric));
	let newArray = people.filter(function(el){
		if(el.height === userInputHeight){
			return true;
		}
		// return true if el.Height matches userInputHeight
	});
	return newArray;
}

function searchByOccupation(people){
	let userInputOccupation = prompt("What is this person's occupation?");
	let newArray = people.filter(function(el){
		if(el.occupation === userInputOccupation){
			return true;
		}
		// return true if el.occupation matches userInputOccupation
	});
	return newArray;
}

function searchByWeight(people){
	let userInputWeight = Number(promptFor("How much does the person weigh?",isNumeric));
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
			let descendantString = descendentInfo(person, people,true);

			descendantString = descendantString.map(function(el){
				return el.firstName + " " + el.lastName;
			});

			if(descendantString.length > 1){
				alert(person.firstName + " " + person.lastName + "'s descendants are:\n" + descendantString.join("\n"));
			} else {
				alert("This person does not have any descendants.")
			}
			
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
	for(i = 0; i < arrayLength; i++){
		if(people[i].firstName.toLowerCase() === firstName && people[i].lastName.toLowerCase() === lastName){
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

//Get and display the descendant info, including children and grandchildren
function descendentInfo(person, people, getGrandChildren){
	let parentsArray = [];
	let personInfo = Object.values(person);
	let personID = personInfo[0];
	peopleArray = people;

	let descendantsArray = peopleArray.filter(function(el){
		for(let i = 0; i < el.parents.length; i++){
			if(personID === el.parents[i]){
				return true;
			}
		}
	});
	if (getGrandChildren){
		for(let j = 0; j < descendantsArray.length; j++){
			descendantsArray.push.apply(descendantsArray, descendentInfo(descendantsArray[j], people, true));
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
	let currentFamilySet = [];
	let personPropertyKeys = Object.keys(person); //Get the persons object keys/names.
	let personPropertyValues = Object.values(person); //Get the perons objects values.
	let displayString = "";
	let personParents = personPropertyValues[9]; //Find and sets the persons parents to a variable.
	let personSpouse = personPropertyValues[10]; //Find and set the persons spous to a variable.

	//Code for parents and siblings
	if(personParents.length >= 1){ //Checks to see if the persons parents isn't empty.
		for(i = 0; i < personParents.length; i++){ //Loops through the parents array, number of times depends on length of the size of the array.
			for(let j = 0; j < people.length; j++){ //Loop through the whole database of people.
				if(personParents[i] === people[j].id){ //Compares persons parent id/ids to the ids in the database and if true...
					let parentName = people[j].firstName + " " + people[j].lastName; //Combine the first name and last name
					siblings = descendentInfo(people[j], people, false);
					siblings = (siblings.map(function(el){
						return el.firstName + " " + el.lastName;
        			}))
					siblingSet.push(siblings.join(", "));

					//Code for siblings
					if(siblingSet[0] === siblingSet[1]){
						siblingSet.splice(0,1);
					}
					console.log("Siblings: " + siblingSet)
					parentSet.push(parentName); //Insert into the next available spot in the array
				}
			}
		}
	}

	//Checks for matched names
	for(let i = 0;i < siblingSet.length; i++){
		if(siblingSet[i].indexOf(person.firstName + " " + person.lastName) !== -1){
			console.log("MATCHED NAME")
			let indexOfStart = siblingSet[i].indexOf(person.firstName + " " + person.lastName);
			let indexOfEnd = indexOfStart + person.firstName.length + person.lastName.length;
			let forwardString = siblingSet[i].slice(0, indexOfStart - 2);
			let rearString = siblingSet[i].slice(indexOfEnd, siblingSet[i].length);
			siblingSet[i] = forwardString + rearString;
		}
	}
	
	//Checks for descendants and grandchildren
	let childArray = descendentInfo(person, people, false);
	let childSet = childArray.map(function(el){
		return el.firstName + " " + el.lastName;
	});

	//Code for spouse
	if(personSpouse !== null){ //If the persons spouse isn't empty.
		for(let j = 0; j < people.length; j++){ //Loop through the whole database of people.
			if(personSpouse === people[j].id){ //Compares the spouses id to the ids in the database and if true...
				let spouseName = people[j].firstName + " " + people[j].lastName; //Combine the first name and last name.
				spouseSet.push(spouseName); //Insert into the next available spot in the provided array.
			}
		}
	}else if(personSpouse === null){
		spouseSet.push("No spouse found");
	}

	if(siblingSet < 1){
		siblingSet.push("No siblings found");
	}

	if(parentSet < 1){
		parentSet.push("No parents listed");
	}

	if(childSet.length < 1){
		childSet.push("No children found");
	}

	//Display the message
	displayString = "Parents: " + parentSet.join(", ") + "\nSiblings: " + siblingSet[0] + "\nSpouse: " + spouseSet[0] + "\nChildren: " + childSet.join(", ");

	for(i = 0; i < currentFamilySet.length; i++){
		displayString += currentFamilySet[i] + "\n";
	}
	alert(displayString);
}

// function that prompts and validates user input, and change all input toLowerCase
function promptFor(question, valid){
	let response;
	do{
		response = prompt(question).trim();
	}while(!response || !valid(response));
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