'use strict'

var navigation = {
  // Menüeinträge
  'Calendar': 'Kalender',
  'Event': 'Termin',
  
  // Knöpfe
  'New Event': 'Neuen Termin anlegen'
}

var user = {
  'Your Nickname': 'Dein Name',
  'Set': 'Diesen Namen verwenden'
}

module.exports = function(t) {
  t.add('navigation', navigation)
  t.add('user', user)
}
