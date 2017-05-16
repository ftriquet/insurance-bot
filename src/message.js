/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai')

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

export const replyText = text => {
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  return new Promise((success, failure) => {
    request.analyseText(text)
      .then(result => {
        success({ type: 'text', content: `Hey! You talk about ${(result.intents[0] || {}).slug || 'nothing I know about'}` })
      })
      .catch(err => {
        console.error('Error while sending message to Recast.AI', err)
        failure(err)
      })
  })
}
