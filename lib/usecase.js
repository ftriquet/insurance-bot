const salesforce = require('./salesforce')

const replies = {
  recordFound: {
    en: 'Your insurance record, number RECORD_NUMBER, is currently "STATE".',
    fr: 'Votre dossier numéro RECORD_NUMBER est "STATE".',
  },
  recordNotFound: {
    en: 'I don’t know this insurance record number. You can find the number at the top right of the record (like A234).',
    fr: 'Je crois que ce numéro de dossier n’existe pas. Le numéro se trouve en haut à droite de votre dossier, (sous la forme A234).',
  },
  recordMissing: {
    en: 'Can you give me your insurance record number? (for example: A234).',
    fr: 'Pouvez-vous me donner votre numéro de dossier ? (par exemple : A234).',
  },
  greetings: {
    en: 'Hello, how can I help you?',
    fr: 'Bonjour, comment puis-je vous aider?',
  },
  goodbye: {
    en: 'Goodbye',
    fr: 'Au revoir',
  },
  thanks: {
    en: 'You are welcome',
    fr: 'Je vous en prie',
  },
}

module.exports = {
  handledIntent: 'record',
  handledEntity: 'record_number',
  handledLanguages: ['en', 'fr'],
  floatingIntents: [
    'greetings',
    'goodbye',
    'thanks',
  ],
  getReply: (oauth, entities, conversations, userId) => new Promise(resolve => {
    const recordNumber = (entities.record_number || [])[0] || null
    salesforce.getRecord(recordNumber.raw).then((record) => {
      console.log('RecordNumber: ', recordNumber)
      if (recordNumber) {
        // const { statuses, records } = db
        // const record = records[recordNumber.raw]
        console.log(record)
        if (record !== undefined) {
          const recordStatus = { en: record._fields.phone, fr: record._fields.billingcity }
          // resolve({ type: 'text', content: replies.recordFound[conversations[userId]].replace('RECORD_NUMBER', recordNumber.raw).replace('STATE', statuses[conversations[userId]][record]) })
          resolve({ type: 'text', content: replies.recordFound[conversations[userId]].replace('RECORD_NUMBER', recordNumber.raw).replace('STATE', recordStatus[conversations[userId]]) })

          if (conversations[userId]) {
            console.log("Delete language: " + conversations[userId] + " for id " + userId)
            delete conversations[userId]
          }
        }
        resolve({ type: 'text', content: replies.recordNotFound[conversations[userId]] })
      }
      resolve({ type: 'text', content: replies.recordMissing[conversations[userId]] })
    })
  }),
  getFloatingReply: (intent, conversations, userId) => new Promise(resolve => {
    resolve({ type: 'text', content: replies[intent][conversations[userId]] })

    if (conversations[userId] && (intent === 'thanks' || intent === 'goodbye')) {
      console.log("Delete language: " + conversations[userId] + " for id " + userId)
      delete conversations[userId]
    }
  }),
}
