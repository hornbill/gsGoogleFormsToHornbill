function onSubmit(e) {
  var apiKey = 'yourapikey';
  var instanceId = 'yourinstanceid';
  var endpoint = getEndpoint(instanceId);
  
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();
  
  //Get Request Reference from form
  var requestRef = "";
  for (var i = 0; i < itemResponses.length; i++) {
    if (itemResponses[i].getItem().getTitle() === "Request Reference") requestRef = itemResponses[i].getResponse();
  }
  
  updateCustomFields(endpoint, apiKey, requestRef, itemResponses);
  updateStatus(endpoint, apiKey, requestRef);
}

function getEndpoint(instanceId) {
  var url = 'https://files.hornbill.com/instances/' + instanceId + '/zoneinfo';
  var options = {
    'method' : 'get',
    'contentType': 'application/json',
    'headers': {
      'Accept': 'application/json'
    }
  };
  var  ziParsed = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
  return ziParsed.zoneinfo.endpoint ? ziParsed.zoneinfo.apiEndpoint : ziParsed.zoneinfo.endpoint + "xmlmc/" ;
}

function updateCustomFields(endpoint, apiKey, requestRef, itemResponses) {
  var requestRef = "";
  var customFields = {};
  var forename = "";
  var surname = "";
  
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    switch (itemResponse.getItem().getTitle()) {
      case "Address":
        customFields.h_custom_d = itemResponse.getResponse();
        break;
      case "Contact Number":
        customFields.h_custom_e = itemResponse.getResponse();
        break;
      case "Date Of Birth":
        customFields.h_custom_f = itemResponse.getResponse();
        break;
    }
  }
  
  var url = endpoint + 'apps/com.hornbill.servicemanager/Requests?op=update';
  var methodCall={
      "@service":"apps/com.hornbill.servicemanager/Requests",
      "@method":"update",
      "params": {
        "requestId": requestRef,
        "customFields": JSON.stringify(customFields)
      }
  };
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'ESP-APIKEY ' + apiKey,
    },
    'payload' : JSON.stringify(methodCall)
  };
 
  UrlFetchApp.fetch(url, options);
}

function updateStatus(endpoint, apiKey, requestRef) {
  var url = endpoint + 'apps/com.hornbill.servicemanager/Requests?op=smUpdateStatus';
  var methodCall={
      "@service":"apps/com.hornbill.servicemanager/Requests",
      "@method":"smUpdateStatus",
      "params": {
        "requestId": requestRef,
        "status": "Open",
        "manualUpdateTimeline": "The customer has submitted their personal details via Google Forms."
      }
  };
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'ESP-APIKEY ' + apiKey,
    },
    'payload' : JSON.stringify(methodCall)
  };
 
  UrlFetchApp.fetch(url, options);
}