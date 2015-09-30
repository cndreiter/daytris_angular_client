'use strict'

var navigation = {
  // Kopfleiste
  'New Calendar': 'Neuen Kalender anlegen',
  
  // Menüeinträge
  'Calendar Grid': 'Kalender',
  'Calendar Details': 'Details',
  'Sub-Calendars': 'Unter-Kalender',
  'Event': 'Termin',
  
  // Knöpfe
  'Day': 'Tag',
  'Week': 'Woche',
  'Month': 'Monat',
  'Events Visible': 'Termine einblenden',
  'New Event': 'Neuen Termin anlegen',
  'The new event will appear in the main calendar.': 'Der neue Termin wird im Haupt-Kalender angelegt.',
  'To create an event in a sub-calendar, click one of them:': 'Klicke einen Unter-Kalender an, um darin einen Termin anzulegen:'
}

var participantMessageModal = {
  // Text (Information, Warnung, Frage, ...)
  'Remove participant ': 'Teilnehmer ', '?': ' entfernen?',
  
  // Knöpfe
  'Yes, remove participant': 'Ja, Teilnehmer entfernen',
  'Cancel': 'Abbrechen'
}

var calendarMessageModal = {
  // Text (Information, Warnung, Frage, ...)
  'Delete calendar ': 'Kalender ', ' and its events?': ' und seine Termine löschen?',
  'Delete empty calendar ': 'Leeren Kalender ', '?': ' löschen?',
  
  // Knöpfe
  'Yes, delete calendar and its events': 'Ja, Kalender und seine Termine löschen',
  'Yes, delete empty calendar': 'Ja, leeren Kalender löschen',
  'Cancel': 'Abbrechen'
}

var emailAddressModal = {
  'Provide your e-mail address to stay informed about changes.': 'Gib deine E-Mail-Adresse ein, um über Änderungen informiert zu werden.',
  'Please type your e-mail address': 'Deine E-Mail-Adresse',
  'OK': 'OK',
  'Skip this': 'Überspringen (keine E-Mail-Benachrichtigung)',
  'Cancel': 'Abbrechen'
}

var subCalendarMessageModal = {
  // Text (Information, Warnung, Frage, ...)
  "Remove this sub-calendar's last parent link? This action will make it stand-alone. Please remember its URL ": 'Die letzte Verbindung zu diesem Unter-Kalender trennen? Dadurch wird der Unter-Kalender eigenständig. Bitte merke dir seine URL: ',
  '.': '.',
  
  // Knöpfe
  'Disconnect and make calendar stand-alone': 'Trennen und Unter-Kalender eigenständig machen',
  'Cancel': 'Abbrechen'
}

var user = {
  'Set your name:': 'Dein Name:',
  'My name is': 'Mein Name ist',
  'Your Nickname': 'Dein Name',
  'Set': 'Diesen Namen verwenden'
}

module.exports = function(t) {
  t.add('navigation', navigation)
  t.add('participantMessageModal', participantMessageModal)
  t.add('calendarMessageModal', calendarMessageModal)
  t.add('emailAddressModal', emailAddressModal)
  t.add('subCalendarMessageModal', subCalendarMessageModal)
  t.add('user', user)
}
