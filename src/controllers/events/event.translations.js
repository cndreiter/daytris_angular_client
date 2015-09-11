'use strict'

var eventInputs = {
  // Bezeichnung
  'Name': 'Bezeichnung',
  'Event Name': 'Bezeichnung des Termins',
  
  // Beginn
  'Start': 'Beginn',
  "Event's Start Day": 'Beginn-Tag des Termins',
  "Event's Start Time": 'Beginn-Zeit des Termins',
  
  // Ende
  'End': 'Ende',
  "Event's End Day": 'Ende-Tag des Termins',
  "Event's End Time": 'Ende-Zeit des Termins',
  
  // URL
  "Event's URL ending (part after last /)": "URL-Ende (Teil der URL nach dem letzten /)"
}

module.exports = function(t) {
  t.add('eventInputs', eventInputs)
}
