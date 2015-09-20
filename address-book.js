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
    
  { first_name: 'Nathaniel',
  last_name: 'Kitzke',
  birthday: '44hug',
  address_home: '234',
  address_work: '',
  address_other: '',
  phone_home: '9876543214',
  phone_work: '',
  phone_other: '',
  email_home: 'sexy@gmail.com',
  email_work: '',
  email_other: '' 
  }
  ,
  { first_name: 'Ulaize',
  last_name: 'Pistachio',
  birthday: 'GGG',
  address_home: '894654',
  address_work: '',
  address_other: '',
  phone_home: '9876543214',
  phone_work: '',
  phone_other: '',
  email_home: 'apachupa@gmail.com',
  email_work: '',
  email_other: ''  }
  
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
            message: "First name :",
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
            name: "address_home",
            message: "Address (home):",
        },
        {
            type: "input",
            name: "address_work",
            message: "Address (work):",
        },
        {
            type: "input",
            name: "address_other",
            message: "Address (other):",
        },
        {
            type: "input",
            name: "phone_home",
            message: "Phone number (home):",
            validate: function( value ) {
                var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
                if (pass) {
                    return true;
                } else {
                    return "Please enter a valid phone number";
                }
            },
        },
        {
            type: "input",
            name: "phone_work",
            message: "Phone number (work):",
        }, 
        {
            type: "input",
            name: "phone_other",
            message: "Phone number (other):",
        }, 
        {
            type: "input",
            name: "email_home",
            message: "Email (home):",
        },
         {
            type: "input",
            name: "email_work",
            message: "Email (work):",
        },
         {
            type: "input",
            name: "email_other",
            message: "Email (other):",
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
        ["Adresses", "Home: " + addressBook[index].address_home +"\nWork: "+ addressBook[index].address_work +"\nOther: "+ addressBook[index].address_other],
        ["Phones", "Home: " + addressBook[index].phone_home +"\nWork: " + addressBook[index].phone_work +"\nOther: " + addressBook[index].phone_other],
        ["Emails", "Home: " + addressBook[index].email_home +"\nWork: " + addressBook[index].email_work +"\nOther: " + addressBook[index].email_other]
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
            name: "address_home",
            message: "Address (home):",
            default: function () { return addressBook[index].address_home; }
        },
        {
            type: "input",
            name: "address_work",
            message: "Address (work):",
            default: function () { return addressBook[index].address_work; }
        },
        {
            type: "input",
            name: "address_other",
            message: "Address (other):",
            default: function () { return addressBook[index].address_other; }
        },
        {
            type: "input",
            name: "phone_home",
            message: "Phone number (home):",
            validate: function( value ) {
                var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
                if (pass) {
                    return true;
                } else {
                    return "Please enter a valid phone number";
                }
            },
            default: function () { return addressBook[index].phone_home; }
        },
        {
            type: "input",
            name: "phone_work",
            message: "Phone number (work):",
            default: function () { return addressBook[index].phone_work; }
        }, 
        {
            type: "input",
            name: "phone_other",
            message: "Phone number (other):",
            default: function () { return addressBook[index].phone_other; }
        }, 
        {
            type: "input",
            name: "email_home",
            message: "Email (home):",
            default: function () { return addressBook[index].email_home; }
        },
         {
            type: "input",
            name: "email_work",
            message: "Email (work):",
            default: function () { return addressBook[index].email_work; }
        },
         {
            type: "input",
            name: "email_other",
            message: "Email (other):",
            default: function () { return addressBook[index].email_other; }
        },
    ];
    inquirer.promptAsync( questionsForEntry, function( entry ) {
        addressBook[index] = entry;

        viewContact(addressBook.indexOf(entry));
    });
}

function deleteEntry(index){
    inquirer.promptAsync([
        {
            type: "list",
            name: "deleteIt",
            message: "\nAre you sure you want to delete this entry?\n",
            choices: ["Yes" , "No"]
        }
    ], function( selection ) {
        console.log( "You selected : " + selection.deleteIt );
        if(selection.deleteIt === "Yes"){
            addressBook.splice(index, 1);
            mainMenu();
        }  
        else{
            viewContact( index );
        }
    });
    
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
        var searchResults = [];   
        addressBook.forEach(function ( obj ) {
            if( obj.first_name.toLowerCase() === name.search_term.toLowerCase() ){
                searchResults.push( addressBook.indexOf(obj) );
            }
            else if( obj.last_name.toLowerCase() === name.search_term.toLowerCase() ){
                searchResults.push( addressBook.indexOf(obj) );
            }
             else if( obj.email_home.substring( 0,  obj.email_home.indexOf( '@' ) ).toLowerCase() === name.search_term.toLowerCase() ){
                searchResults.push( addressBook.indexOf(obj) );
             }
        });
        viewSearchResults( searchResults );
    });
}

function viewSearchResults(searchResults){
    var searchResultsPresented = [];
    searchResults.forEach(function(ele) {
        searchResultsPresented.push( addressBook[ele].first_name + " , " + addressBook[ele].last_name );
    });
    inquirer.promptAsync([
        {
            type: "list",
            name: "search_results",
            message: "\nHere is what your search has turned up:\n",
            choices: searchResultsPresented
        }
    ], function( selection ) {
        console.log( "You selected : " + selection.search_results );
        viewContact( searchResults[ searchResultsPresented.indexOf(selection.search_results) ] );
    });
}