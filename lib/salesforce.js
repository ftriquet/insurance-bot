/* module imports */
const nforce = require('nforce')

/* ENV variables */
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const USER_NAME = process.env.USER_NAME
const PASSWORD = process.env.PASSWORD
const SECURITY_TOKEN = process.env.SECURITY_TOKEN
const MDP_SECURITY = PASSWORD + SECURITY_TOKEN

const org = nforce.createConnection({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/oauth/_callback',
  mode: 'single',
  autoRefresh: true,
})

const login = () => {
  return new Promise((resolve, reject) => {
    org.authenticate({ username: USER_NAME, password: MDP_SECURITY }, (err, resp) => {
      if (err) {
        console.error('Authentication error')
        reject(err)
      } else {
        console.log('Authentication successful')
        resolve(resp)
      }
    })
  })
}

const insertRecord = (name, phone, billingCity) => {
  const record = nforce.createSObject('Account')
  record.set('Name', name)
  record.set('Phone', phone)
  record.set('BillingCity', billingCity)

  org.insert({ sobject: record }, (err) => {
    if (err) {
      console.error('Record insertion failed')
      console.error(err)
    } else {
      console.log('New record added')
    }
  })
}

const deleteRecord = (name) => {
  getRecord(name).then(record => {
    org.delete({ sobject: record }, (err) => {
      if (err) {
        console.error('Error when deleting record')
        console.error(err)
      } else {
        console.log('Record deleted succesfully')
      }
    })
  })
}

const updateRecord = (name, newname, phone, newphone, oauth) => {
  getRecord(name).then(record => {
    console.log(record)
    console.log(oauth)
    record.set('Name', newname)
    record.set('Phone', newphone)

    org.update({ sobject: record, oauth }, (err) => {
      if (err) {
        console.error('Record update failed')
        console.error(err)
      } else {
        console.log('Record updated')
      }
    })
  })
}

const getRecord = (name) => {
  return new Promise((resolve, reject) => {
    const q = 'SELECT Id, Name, Phone, BillingCity from Account where Name = \'NAME\''.replace('NAME', name)

    org.query({ query: q }, (err, resp) => {
      if (err) {
        console.error('Error when getting record')
        reject(err)
      } else {
        resolve(resp.records[0])
      }
    })
  })
}

module.exports = { login, getRecord }

// login()
  // .then(() => deleteRecord('A1'))
  // .then((oauth) => updateRecord('A1', 'A1', '0', 'waiting for vouchers', oauth))
  // .then(() => getRecord('A1'))
  // .then(record => {
  //   console.log(record)
  //   console.log(record._fields)
  // })
  // .catch((err) => {
  //   console.log(err)
  // })

/* ====================================== */
/* code used to add db.json in salesforce */
/* ====================================== */
// const msg = require('./message')

// login()
// .then(() => msg.consumeDb()
//   .then((db) => {
//     const { statuses, records } = db
//     for (const i in records) {
//       // console.log(i, records[i], statuses.en[records[i]], statuses.fr[records[i]])
//       if (typeof (i) === 'string') {
//         insertRecord(i, statuses.en[records[i]], statuses.fr[records[i]])
//       }
//     }
//   }))
//   .catch((err) => {
//     console.log(err)
//   })
