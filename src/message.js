/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai')
const fs = require('fs')

const consumeDb = () => new Promise((success, failure) => {
  fs.readFile('src/db.json', (err, data) => {
    if (err) { return failure(err) }
    success(JSON.parse(data))
  })
})

// This function is the core of the bot behaviour
export const replyMessage = (message) => {
  // Get text from message received
  const text = message.content

  replyText(text).then(reply => {
    message.addReply(reply)
    return message.reply()
  }).then(() => {
    console.log('Message sent')
  }).catch(err => {
    console.error('Error while sending message to Recast.AI', err)
  })
}

const callSF = () => Promise.resolve('TODO')

const handleSimCard = (db, result) => {
  const puk = ((result.entities.puk || [])[0] || {}).value
  if (result.entities.puk) {
    const simcard = db.find(entry => entry.puk === puk)
    if (simcard) {
      return { type: 'text', content: 'Alright, you sim card will be unlocked within a few minutes.' }
    }
    return { type: 'text', content: 'Sorry, your puk code seems invalid, can you check again and send the right one?' }
  }
  return { type: 'text', content: 'Alright, I need the PUK code in order to unlock your sim card.' }
}

export const replyText = text => {
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  return new Promise((success, failure) => {
    Promise.all([consumeDb(), request.analyseText(text)])
      .then(([db, result]) => {
        console.log(result.intents)
        console.log(result.entities)
        const intent = result.intent()

        if (intent && intent.slug === 'sim-card-problem') {
          return success(handleSimCard(db, result))
        }

        callSF().then(res => success({ type: 'text', content: res }))

      })
      .catch(failure)
  })
}
