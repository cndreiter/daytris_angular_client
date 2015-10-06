/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

var eventInputs = {
  // Überschrift
  'Event of Calendar': 'Termin im Kalender',
  
  // Bezeichnung
  'Name': 'Bezeichnung',
  'Event Name': 'Bezeichnung des Termins',
  
  // Beschreibung
  'Description': 'Beschreibung',
  'Event Description': 'Beschreibung des Termins',
  
  // Heute
  'Today': 'Heute',
  
  // Beginn
  'Start': 'Beginn',
  "Event's Start Day": 'Beginn-Tag des Termins',
  "Event's Start Time": 'Beginn-Zeit des Termins',
  'Single-Day Event (start day = end day)': 'Eintägig (beginnt und endet am selben Tag)',
  
  // Ende
  'End': 'Ende',
  "Event's End Day": 'Ende-Tag des Termins',
  "Event's End Time": 'Ende-Zeit des Termins',
  
  // E-Mail-Adresse
  'E-Mail Address': 'E-Mail-Adresse',
  'Your E-Mail Address': 'Deine E-Mail-Adresse',
  
  // URL
  "Event's URL ending (part after last /)": "URL-Ende (Teil der URL nach dem letzten /)",
  'Copy URL': 'URL kopieren',
  'Copy URL again': 'URL erneut kopieren',
  'Reset URL': 'URL zurücksetzen'
}

var participants = {
  'Participants': 'Teilnehmer',
  'Participate': 'Teilnehmen',
  'Decline': 'Absagen',
  'Be the first participant': 'Sei der erste Teilnehmer'
}

var commentInputs = {
  'Message': 'Nachricht',
  'Your Message': 'Deine Nachricht'
}

module.exports = function(t) {
  t.add('eventInputs', eventInputs)
  t.add('participants', participants)
  t.add('commentInputs', commentInputs)
}
