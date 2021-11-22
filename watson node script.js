var readline = require('readline-sync');

const AssistantV2 = require('watson-developer-cloud/assistant/v2');
var service = new AssistantV2({
  iam_apikey: 'N6aVgbwc2HSjsEoLtjoGBVqheR_30Jxdn_jQw6nz-UCW',
  version: '2019-02-02'
});
var assistantId = 'dbdb7d30-0fb5-4b86-8290-22a90b7b467b';
var sessionId;
var exit = false;

// Create session.
service.createSession({
  assistant_id: assistantId
}, function(err, result) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }
  sessionId = result.session_id;
  sendMessage(); // start conversation with empty message
});

// Send message to assistant.
function sendMessage(messageText) {
  service.message({
    assistant_id: assistantId,
    session_id: sessionId,
    input: {
      message_type: 'text',
      text: messageText,
      'options': {
      	'debug':true,
      	'restart':false,
      	'return_context': true
    	}
    }
  }, processResponse);
}

// Process the response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  //console.log(response.output.actions);

  
  var context_variables = response.context.skills["main skill"].user_defined;

  //lists context variables
  /*
  for (var context_var in context_variables)
  {
  	console.log("~~ " + context_var + ":  " + context_variables[context_var] );
  }
  */
  

  //console.log("skip_user_input" in context_variables);
  
	  var currentIntent;
	  console.log(response.output.actions);
	  //console.log(response.output.generic.actions);
	  //console.log(response.actions);
	  
	  if (response.output.actions) {
	   	console.log("action: " + response.output.actions[0].name);
		  if (response.output.actions[0].name == "quit") {
		   			exit = true;
			   	}
		}
	   
	   	
	  // If an intent was detected, log it out to the console.
	  
	  if (response.output.intents.length > 0) {
	  	currentIntent = response.output.intents[0].intent;
	    console.log('Detected intent: #' + currentIntent);
	  }
	 //console.log(currentIntent);
	  // Display the output from assistant, if any.
	  if (response.output.generic.length != 0) {
	    var i
	      for (i = 0; i < response.output.generic.length; i++)
	      {
	      	console.log(response.output.generic[i].text);
	      }
	  }
	  if (exit)
	    {
		    service.deleteSession({
		        assistant_id: assistantId,
		        session_id: sessionId
		      }, function(err, result) {
		        if (err) {
		          console.error(err); // something went wrong
		        }
		      });
		      return;
	    }
	  
	  //console.log(response.output.debug);
	  //console.log(response.output.generic);
	  //console.log(response.system);
	  //console.log(response.debug);

	  //console.log(response.output.actions)
	  

	  if (response.output.actions)
	   {
	   		//console.log(response.output.actions[0].name);
	   		//console.log(response.entities[0]);
	   		//console.log(JSON.stringify(response, null, 2));
	   		
	   		//action name
	   		//console.log(response.output.actions[0].value);
	   		if (response.output.actions[0].name == "make_playlist") {
	   			console.log("make Playlist")
		   		

		   		var j;
		   		var artist_name = "Undefined";


				  
		   		for (j = 0; j < response.output.entities.length; j++)
		   		{
		   			if (response.output.entities[j].entity == "artist")
		   			{
		   				artist_name = response.output.entities[j].value
		   			}
		   			if (response.output.entities[j].entity == "album")
		   			{
		   				artist_name = response.output.entities[j].value
		   			}
		   		}
		   		
		   		console.log("spotify.com"/*spotify function here*/);
		   	}
		   	
	  }

	   

	  // Prompt for the next round of input.
	  var newMessageFromUser = readline.question(">> ");

	   exit |= (newMessageFromUser == "q"); //failsafe
	    if (exit)
	    {
	    	console.log(">>Force Quit<<");
		    service.deleteSession({
		        assistant_id: assistantId,
		        session_id: sessionId
		      }, function(err, result) {
		        if (err) {
		          console.error(err); // something went wrong
		        }
		      });
		      return;
	    }
	    if ((newMessageFromUser == "w"))
	    {
	 
  			console.log(response.output.entities);
  			console.log("");
  			
  			newMessageFromUser = readline.question(">> ");
	    }
	  sendMessage(newMessageFromUser);
	
}