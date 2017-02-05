const csvArray = require('./rawData.csv')
const moment = require('moment')
const groupBy = require('lodash.groupby')
const map = require('lodash.map')
const flatten = require('lodash.flatten')
const range = require('lodash.range')
const uniq = require('lodash.uniq')
const $ = require('jquery')

const filteredArray = csvArray.filter((row, i, arr) => {
  return row['Who are you with?'].length > 0
})

const onlyFCArray = filteredArray.map((row, i, arr) => {
  return {
    timestamp: moment(row['Timestamp of Report (Local Time)'], 'MMMM D, YYYY HH:mm:ss').format('M/D/YYYY'),
    friends: row['Who are you with?'].split(','),
    clothes: row['Shirt?'].split(',')
  }
})

const rowsGroupedByDate = groupBy(onlyFCArray, row => row.timestamp)

const parsedData = map(rowsGroupedByDate, (objectArray, timestamp) => {
  const friends = uniq(flatten(map(objectArray, obj => (obj.friends))))
  const clothes = uniq(flatten(map(objectArray, obj => (obj.clothes))))
  return {
    friends,
    clothes,
    timestamp
  }
})

const uniqueFriendsList = uniq(flatten(parsedData.map((row, i, arr) => {
  return row.friends
})))

const $table = $(`
  <table>
    <thead>
      <tr id="header"></tr>
    </thead>
    <tbody id="body">
    </tbody>
  </table>
`)
$('body').append($table)

// go through unique friends, and create a <td> for each one, and append it to #header
uniqueFriendsList.forEach ((name, i, arr) => {
  const $td = $(`<td> ${name.substr(0, 2)}</td>`)
  $('#header').append($td)
})

parsedData.forEach ((row, r, arr) => {
  const $tr = $(`<tr></tr>`)
  uniqueFriendsList.forEach((friendInThisColumn, c) => {
    const $td = $(`<td></td>`)
    // what is the name in the column that im in right now
    const theFriendsISawToday = row.friends
    $tr.append($td)
    if (row.friends.includes(friendInThisColumn)) {
      $td.css({ background: '#000000' })
    }
  })

  $('#body').append($tr)
})
// create a table, throw it on the page
// go through FCArray. and for each filtered/mapped rows
// generate a tr, and put

/*
[
[...].
[...].
[...].
[...].
[...].
[...].
[...].
]
*/

// only ge t the friends, and put them in a huge list
// map down to just friends
// flatten friends
// remove all duplicate friends
