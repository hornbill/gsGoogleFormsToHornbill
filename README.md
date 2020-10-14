# Google Forms to Hornbill Service Manager Integration Demo

This gs script is provided as an example of how you may interact with Hornbill Service Manager when Google Forms responses are submitted.

The script will populate a number of custom fields against a Hornbill request with values passed from a Google Form, then update the request status to `Open`, adding an entry of "`The customer has submitted their personal details via Google Forms.`" to the request timeline.

## Installation

- From your Google Form, click the menu icon and hit `Script Editor`;
- Paste the code into Code.gs, then:
  - Update the `apiKey` and `instanceId` variables with those relevant to your Hornbill instance;
  - Update the `questions` and `target fields` in the `updateCustomFields()` function to match your form and Hornbill request configuration;
  - Click Save.
- Click Edit, then Current Projects Triggers;
- Create a new Trigger, selecting the onSubmit function and define the trigger when the function should be run.
