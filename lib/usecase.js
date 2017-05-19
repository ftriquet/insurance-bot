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
}

module.exports = {
  handledIntent: 'record',
  handledEntity: 'record_number',
  handledLanguages: ['en', 'fr'],
  getReply: (db, entities, language) => new Promise(resolve => {
    const recordNumber = (entities.record_number || [])[0] || null
    if (recordNumber) {
      const { statuses, records } = db
      const record = records[recordNumber]
      if (record) {
        resolve({ type: 'text', content: replies.recordFound[language].replace('RECORD_NUMBER', recordNumber).replac('STATE', statuses[recordNumber][language]) })
      }
      resolve({ type: 'text', content: replies.recordNotFound[language] })
    }
    resolve({ type: 'text', content: replies.recordMissing[language] })
  }),
}
