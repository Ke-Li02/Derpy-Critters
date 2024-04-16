let critters;
let imageIndex;

function updateTime() {
    const date = document.getElementById("date");
    date.innerHTML = new Date(); //to avoid any onload delay
    setInterval(function() {date.innerHTML = new Date()}, 1000);
}

function validFind() {
    const form = document.getElementById("find");
    let valid = true;
    
    if (!validRadio(form["type"])) {
        document.getElementById("typeError").innerHTML = "Please select the critter's type!";
        valid = false;
    }
    else {
        document.getElementById("typeError").innerHTML = "";
    }

    if (!validRadio(form["breed"])) {
        document.getElementById("breedError").innerHTML = "Please select the critter's breed!";
        valid = false;
    }
    else if (form["breed"][0].checked && form["specificBreed"].value == "") {
        document.getElementById("breedError").innerHTML = "Please write the critter's breed!";
        valid = false;
    }
    else {
        document.getElementById("breedError").innerHTML = "";
    }
    
    if (!validRadio(form["age"])) {
        document.getElementById("ageError").innerHTML = "Please select the critter's age!";
        valid = false;
    }
    else {
        document.getElementById("ageError").innerHTML = "";
    }

    if (!validRadio(form["gender"])) {
        document.getElementById("genderError").innerHTML = "Please select the critter's gender!";
        valid = false;
    }
    else {
        document.getElementById("genderError").innerHTML = "";
    }

    return valid;
}

function validGive() {
    const form = document.getElementById("give");
    let valid = true;

    if (form["critterName"].value == "") {
        document.getElementById("critterNameError").innerHTML = "Please give a name to your critter!";
        valid = false;
    }
    else {
        document.getElementById("critterNameError").innerHTML = "";
    }

    if (!validRadio(form["type"])) {
        document.getElementById("typeError").innerHTML = "Please select your critter's type!";
        valid = false;
    }
    else {
        document.getElementById("typeError").innerHTML = "";
    }

    if (!validRadio(form["breed"])) {
        document.getElementById("breedError").innerHTML = "Please select your critter's breed!";
        valid = false;
    }
    else if (form["breed"][0].checked && form["specificBreed"].value == "") {
        document.getElementById("breedError").innerHTML = "Please write your critter's breed!";
        valid = false;
    }
    else {
        document.getElementById("breedError").innerHTML = "";
    }

    if (!validRadio(form["age"])) {
        document.getElementById("ageError").innerHTML = "Please select your critter's age!";
        valid = false;
    }
    else {
        document.getElementById("ageError").innerHTML = "";
    }

    if (!validRadio(form["gender"])) {
        document.getElementById("genderError").innerHTML = "Please select your critter's gender!";
        valid = false;
    }
    else {
        document.getElementById("genderError").innerHTML = "";
    }

    if (form["firstName"].value == "") {
        document.getElementById("firstNameError").innerHTML = "Please enter the owner's first name!";
        valid = false;
    }
    else {
        document.getElementById("firstNameError").innerHTML = "";
    }

    if (form["lastName"].value == "") {
        document.getElementById("lastNameError").innerHTML = "Please enter the owner's last name!";
        valid = false;
    }
    else {
        document.getElementById("lastNameError").innerHTML = "";
    }

    if (form["email"].value == "") {
        document.getElementById("emailError").innerHTML = "Please enter your email address!";
        valid = false;
    }
    else if (!(/^[\w-\.]+@[\w-\.]+\.[\w-\.]+$/i.test(form["email"].value))) {
        document.getElementById("emailError").innerHTML = "Please enter a valid email address!";
        valid = false;
    }
    else {
        document.getElementById("emailError").innerHTML = "";
    }

    if (form["description"].value == "") {
        document.getElementById("descriptionError").innerHTML = "Please give us a description of your critter!";
        valid = false;
    }
    else {
        document.getElementById("descriptionError").innerHTML = "";
    }

    return valid;
}

function validRadio(radios) {

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return true;
        }
    }

    return false;
}

function browse(critterNumber, change) {
    imageIndex[critterNumber] += change;

    if (imageIndex[critterNumber] < 0) {
        imageIndex[critterNumber] = 0;
    }
    else if (imageIndex[critterNumber] >= critters[critterNumber].length) {
        imageIndex[critterNumber] = critters[critterNumber].length - 1;
    }

    if (document.getElementById("images" + critterNumber) != null) {
        document.getElementById("images" + critterNumber).src = "images/" + critters[critterNumber][imageIndex[critterNumber]];
    }
    if (document.getElementById("count" + critterNumber) != null) {
        document.getElementById("count" + critterNumber).innerHTML = `Image: ${imageIndex[critterNumber] + 1}/${critters[critterNumber].length}`;
    }
}

function imageInit() {
    fetch('images/images.txt').then(res => res.text()).then((data) => {
        critters = data.split('\n');

        for (let i = 0; i < critters.length; i++) {
            critters[i] = critters[i].split(':');
        }
        
        imageIndex = new Array(critters.length);
    
        for (let i = 0; i < imageIndex.length; i++) {
            imageIndex[i] = 0;
            if (critters[i][0] != '') {
                browse(i, 0);
            }
        } 
    }).catch((reason) => {
        console.log(reason);
    });
}    
    

    
    

