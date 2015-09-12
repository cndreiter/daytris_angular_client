'use strict'

var navigation = {
  // Menüeinträge
  'Calendar': 'Kalender',
  'Event': 'Termin',
  
  // Knöpfe
  'Day': 'Tag',
  'Week': 'Woche',
  'Month': 'Monat',
  'New Event': 'Neuen Termin anlegen'
}

var messageModal = {
  // Text (Information, Warnung, Frage, ...)
  'Remove participant ': 'Teilnehmer ', '?': ' entfernen?',
  
  // Knöpfe
  'Yes, remove participant': 'Ja, Teilnehmer entfernen',
  'Cancel': 'Abbrechen'
}

var user = {
  'Your Nickname': 'Dein Name',
  'Set': 'Diesen Namen verwenden'
}

module.exports = function(t) {
  t.add('navigation', navigation)
  t.add('messageModal', messageModal)
  t.add('user', user)
}
