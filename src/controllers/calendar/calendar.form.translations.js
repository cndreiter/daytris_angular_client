'use strict'

var calendarInputs = {
  // Neuer Kalender
  'Create a new Calendar': 'Neuen Kalender anlegen',
  
  // Bezeichnung
  'Name': 'Bezeichnung',
  'Calendar Name': 'Bezeichnung des Kalenders',
  
  // Terminauswahl
  'Scheduler': 'Terminauswahl',
  'Use this Calendar as a Scheduler:': 'Diesen Kalender als Terminwahl-Instrument nutzen:',
  'Let people choose between multiple appointments.': 'Personen aus mehreren Terminvorschlägen wählen lassen.',
  
  // Farbe
  'Color': 'Farbe',
  
  // E-Mail-Adresse
  'E-Mail Address': 'E-Mail-Adresse',
  'Your E-Mail Address': 'Deine E-Mail-Adresse',
  
  // URL
  "Calendar's URL ending (part after last /)": "URL-Ende (Teil der URL nach dem letzten /)",
  'Copy URL': 'URL kopieren',
  'Copy URL again': 'URL erneut kopieren',
  'Reset URL': 'URL zurücksetzen',
  
  // Speichern/Löschen
  'Create': 'Kalender anlegen',
  'Save': 'Änderungen speichern',
  'Delete': 'Kalender löschen',
  'Delete Disabled': 'Löschen deaktiviert',
  'This calendar has sub-calendars.': 'Dieser Kalender hat untergeordnete Kalender.',
  'You need to delete or disconnect them before you can delete this calendar.': 'Du musst die untergeordneten Kalender löschen oder von diesem Kalender trennen, bevor du ihn löschen kannst.'
  
}

var subCalendarInputs = {
  // Unter-Kalender
  'Sub-Calendars of Calendar': 'Unter-Kalender von',
  'Existing Sub-Calendars': 'Vorhandene untergeordnete Kalender',
  'New Sub-Calendar': 'Neuer untergeordneter Kalender',
  'Connect an existing Calendar': 'Einen existierenden Kalender verbinden',
  'Create a new Calendar': 'Neuen Kalender anlegen'
}

var calendarReadOnly = {
  'Edit': 'Bearbeiten',
  'Disconnect': 'Trennen'
}

var alternatives = {
  'Comments of': 'Kommentare zu'
}

var commentInputs = {
  'Message': 'Nachricht',
  'Your Message': 'Deine Nachricht'
}

module.exports = function(t) {
  t.add('calendarInputs', calendarInputs)
  t.add('subCalendarInputs', subCalendarInputs)
  t.add('calendarReadOnly', calendarReadOnly)
  t.add('alternatives', alternatives)
  t.add('commentInputs', commentInputs)
}
