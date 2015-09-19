var Promise = require("bluebird");

var request = Promise.promisify(require("request"));
var prompt = Promise.promisifyAll(require('prompt'));
// use : prompt.getAsync()

var inquirer = Promise.promisifyAll(require("inquirer"));
//use : inquirer.promptAsync([questions],function(answers) {        do stuff       }) ;or.then( function ( res ){  more stuff  } ) ;or.then...

//EXAMPLE
// inquirer.promptAsync([/* Pass your questions in here */], function( answers ) {
//     // Use user feedback for... whatever!! 
// });

var Table = require('cli-table');


//
//   ---- ----   MAIN   ---- ----
//
var addressBook = [
    
    { first_name: 'Dude',
  last_name: 'Man',
  birthday: '44hug',
  address: '234',
  phone: '9876543214',
  email: 'sexy@gmail.com' }
  ,
  { first_name: 'Kayla',
  last_name: 'Hennig',
  birthday: 'something',
  address: 'beside me',
  phone: '4567891456',
  email: 'nathaniel@gmail.com' }
  ,
  { first_name: 'Nathaniel',
  last_name: 'Kitzke',
  birthday: 'something',
  address: 'right here',
  phone: '4567891456',
  email: 'You' }
  ,
  { first_name: 'Nathaniel',
  last_name: 'hamilton',
  birthday: 'something',
  address: 'beside me',
  phone: '4567891456',
  email: 'george@gmail.com' }
    
];

mainMenu();




//
// -- - -- FUNCTIONS -- - --
//

function mainMenu(){
    inquirer.promptAsync([
        {
            type: "list",
            name: "Main_Menu",
            message: "\n --- WELCOME TO THE ADDRESS BOOK ---\nWhat would you like to do?\n",
            choices: [
                "Create new entry",
                "Search for an entry",
                "Exit"
        ]
        }
    ], function( selection ) {
        console.log( "You selected : "+selection.Main_Menu );
        switch (selection.Main_Menu) {
            case "Create new entry" :
                // Start new entry functionality
                createNewEntry();
                break;
            case "Search for an entry" :   
                //Start searching functionality
                searchForContact();
                break;
            case "Exit" :
                //End Program
                break;
            default:
                // code
        }      
    });
}

function createNewEntry(){

    var questionsForEntry = [
        {
            type: "input",
            name: "first_name",
            message: "First name :"
        },
        {
            type: "input",
            name: "last_name",
            message: "Last name :",
        },
        {
            type: "input",
            name: "birthday",
            message: "Birthday :",
        },
        {
            type: "input",
            name: "address",
            message: "Address :",
        },
        {
            type: "input",
            name: "phone",
            message: "Phone number :",
            validate: function( value ) {
                var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
                if (pass) {
                    return true;
                } else {
                    return "Please enter a valid phone number";
                }
            }
        }, 
        {
            type: "input",
            name: "email",
            message: "Email :",
        },
    ];
    
    inquirer.promptAsync( questionsForEntry, function( entry ) {
        addressBook.push(entry);
        console.log(entry);
        console.log(addressBook.indexOf(entry));
        viewContact(addressBook.indexOf(entry));
    });
}

function viewContact(index){
    var table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });
    table.push(
        ["First Name", addressBook[index].first_name],
        ["Last Name", addressBook[index].last_name],
        ["Birthday", addressBook[index].birthday],
        ["Adresses", addressBook[index].address],
        ["Phones", addressBook[index].phone],
        ["Emails", addressBook[index].email]
    );
    console.log(table.toString());
    inquirer.promptAsync([
        {
            type: "list",
            name: "viewing_contact_menu",
            message: "\n- Options -\n",
            choices: [
                "Edit the current entry",
                "Delete the current entry",
                "Go back to Main Menu"
        ]
        }
    ], function( option ) {
        console.log( "You selected : "+option.viewing_contact_menu );
        switch (option.viewing_contact_menu) {
            case "Edit the current entry" :
                // Start new entry functionality
                editContact(index);
                break;
            case "Delete the current entry" :   
                deleteEntry(index);
                break;
            case "Go back to Main Menu" :
                mainMenu();
                break;
            default:
                // code
        }      
    });
}

function editContact(index){
    var questionsForEntry = [
        {
            type: "input",
            name: "first_name",
            message: "First name :",
            default: function () { return addressBook[index].first_name; }
        },
        {
            type: "input",
            name: "last_name",
            message: "Last name :",
            default: function () { return addressBook[index].last_name; }
        },
        {
            type: "input",
            name: "birthday",
            message: "Birthday :",
            default: function () { return addressBook[index].birthday; }
        },
        {
            type: "input",
            name: "address",
            message: "Address :",
            default: function () { return addressBook[index].address; }
        },
        {
            type: "input",
            name: "phone",
            message: "Phone number :",
            validate: function( value ) {
                var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
                if (pass) {
                    return true;
                } else {
                    return "Please enter a valid phone number";
                }
            },
            default: function () { return addressBook[index].phone; }
        }, 
        {
            type: "input",
            name: "email",
            message: "Email :",
            default: function () { return addressBook[index].email; }
        },
    ];
    inquirer.promptAsync( questionsForEntry, function( entry ) {
        addressBook[index] = entry;
        console.log(entry);
        console.log(addressBook.indexOf(entry));
        viewContact(addressBook.indexOf(entry));
    });
}

function deleteEntry(index){
    addressBook.splice(index, 1);
    mainMenu();
}

function searchForContact(){
    var contactToSearch = [
        {
            type: "input",
            name: "search_term",
            message: "Please enter a single name to search for :"
        }
    ];
    
    inquirer.promptAsync( contactToSearch, function( name ) {
        var searchResults1 = [];
        var searchResults2 = [];
        var searchResults3 = [];
        var searchResults = [];       
        searchResults1 = addressBook.filter(function ( obj ) {
            return obj.first_name.toLowerCase() === name.search_term.toLowerCase();
        });
        
        searchResults2 = addressBook.filter(function ( obj ) {
             return obj.last_name.toLowerCase() === name.search_term.toLowerCase();
        });
        
        searchResults3 = addressBook.filter(function ( obj ) {
             return obj.email.substring( 0, ( obj.email.indexOf( '@' )-1)  ).toLowerCase() === name.search_term.toLowerCase();
        });
        
        if(searchResults1){
            searchResults = searchResults1;
            if(searchResults2){
                searchResults = searchResults.concat(searchResults2);
            }
            if(searchResults3){
                searchResults1 = searchResults.concat(searchResults3);
            }
        }
        else if(searchResults2){
            searchResults = searchResults2;
            if(searchResults3){
                searchResults = searchResults.concat(searchResults3);
            }
        }
        else if(searchResults3){
            searchResults = searchResults3;
        }
        
        
        console.log( JSON.stringify(searchResults) );
        
        mainMenu();
        

    });
}