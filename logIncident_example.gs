function onSubmit(e) {
  var apiKey = 'yourkey';
  var instanceId = 'yourinstance';
  var endpoint = getEndpoint(instanceId);
  
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();
  
  var requestRef = logIncident(endpoint, apiKey, itemResponses);
  updateCustomFields(endpoint, apiKey, requestRef, itemResponses);
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
  return ziParsed.zoneinfo.endpoint + "xmlmc/";
}
function logIncident(endpoint, apiKey, itemResponses) {
  var service = 'apps/com.hornbill.servicemanager/Incidents';
  var method = 'logIncident';
  var url = endpoint + service + '?op=' + method;
  var description = "";
  var summary = "";
  
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    switch (itemResponse.getItem().getTitle()) {
      case "Summary":
        summary = itemResponse.getResponse();
        break;
      case "Description":
        description = itemResponse.getResponse();
        break;
    }
  }
  var data = {
    "methodCall":{
      "@service":service,
      "@method":method,
      "params": {
        "summary": summary,
        "description": description
      }
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
    'payload' : JSON.stringify(data)
  };
 
  var response = UrlFetchApp.fetch(url, options);
  var hbObjResp = JSON.parse(response.getContentText());
  return hbObjResp.params.requestId;
}
function updateCustomFields(endpoint, apiKey, requestRef, itemResponses) {
  var service = 'apps/com.hornbill.servicemanager/Requests';
  var method = 'update'
  var customFields = {};
  var forename = "";
  var surname = "";
  
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    switch (itemResponse.getItem().getTitle()) {
      case "Custom A":
        customFields.h_custom_a = itemResponse.getResponse();
        break;
      case "Custom B":
        customFields.h_custom_b = itemResponse.getResponse();
        break;
    }
  }
  
  var url = endpoint + service + '?op=' + method;
  var data = {
    "methodCall":{
      "@service":service,
      "@method":method,
      "params": {
        "requestId": requestRef,
        "customFields": JSON.stringify(customFields)
      }
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
    'payload' : JSON.stringify(data)
  };
 
  UrlFetchApp.fetch(url, options);
}
