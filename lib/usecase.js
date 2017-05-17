module.exports = {
  handledIntent: 'sim-card-problem',
  handledEntity: 'puk',
  getReply: (db, entities) => new Promise(resolve => {
    const puk = (entities.puk || [])[0] || null
    if (puk) {
      const simcard = db.find(entry => entry.puk === puk)
      if (simcard) {
        resolve({ type: 'text', content: 'Alright, you sim card will be unlocked within a few minutes.' })
      }
      resolve({ type: 'text', content: 'Sorry, your puk code seems invalid, can you check again and send the right one?' })
    }
    resolve({ type: 'text', content: 'Alright, I need the PUK code in order to unlock your sim card.' })
  }),
}
