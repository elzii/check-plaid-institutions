const fetch = require('node-fetch')
const fs = require('fs')
const flatten = require('flat')
const json2csv = require('json2csv')
const PromiseBar = require('promise.bar')
const exec = require('child_process').exec

PromiseBar.enable()

const PLAID_PUBLIC_KEY = '5ffa12ccbd81bf8576529fb09df5d9'
const OUTPUT_FILE = './results.csv'
const url = 'https://sandbox.plaid.com/institutions/search'


const institutionNames = [
  "Affinity Plus Credit Union",
  "Ally Bank",
  "Altura Credit Union",
  "Americas Credit Union",
  "Arvest Bank",
  "Associated Bank",
  "Bank of America",
  "Bank of America",
  "Bank of America",
  "Bank of America",
  "Bank of America",
  "Bank of America",
  "Bank of America -Direct Debits 2",
  "BB&T",
  "BBVA Compass Bank",
  "BOA",
  "Bock",
  "Bulman-Griggs",
  "callahan",
  "Cape Cod 5 bank",
  "Capital One Bank",
  "Capital One Bank",
  "Centennial Bank",
  "Charles Schwab",
  "Charles Schwab",
  "Charles Schwab Bank",
  "Chase",
  "Chase",
  "Chase Bank",
  "Chase Bank",
  "Chase Bank",
  "citibank",
  "CITIZENS BANK",
  "CITIZENS BANK",
  "CITIZENS BANK",
  "Comerica Bank",
  "Commerce Bank",
  "Commerce Bank NA",
  "Community First Credit Union",
  "Disantostefano",
  "Discover Bank",
  "Downs",
  "EvergreenDirect Credit Union",
  "Fagan",
  "Federal Credit Union",
  "First citizens bank",
  "First International Bank and Trust",
  "First Niagara",
  "First United Bank and Trust",
  "Forum Credit Union",
  "Fresno County Federal Credit union",
  "Frost Bank",
  "Golden",
  "Golden 1",
  "Golden 1 Credit Union",
  "Golden One Crdeit Union",
  "Huntington Bank",
  "ING Direct",
  "Jackson",
  "JP Morgan Chase",
  "JP Morgan Chase Bank",
  "JPMorgan Chase Bank, N.A.",
  "Kathy White (B of A)",
  "Key Bank",
  "Keybank",
  "Keys",
  "Kouba",
  "Liberty Bay Credit Union",
  "Logan Medical Federal Credit Union",
  "Long Beach Schools Financial Credit Union",
  "Lueke",
  "Malaga Bank",
  "Malkin-Weber",
  "Martin",
  "McGraw",
  "Medina Savings and Loan",
  "Members 1st",
  "Merchants Bank",
  "Michigan 1st Credit Union",
  "Moore",
  "NORTH CAROLINA STATE EMPLOYEES CREDIT UNION",
  "OnPoint CU",
  "Oswald",
  "Pentagon Federal Credit Union",
  "People's Bank",
  "PNC",
  "PNC",
  "PNC",
  "PNC",
  "PNC Bank",
  "PNC Bank",
  "PNC Bank",
  "PNC Bank",
  "PNC Bank",
  "PNC Bank",
  "Rabideau",
  "Randolph Brooks FCU",
  "Regions",
  "Sarr",
  "Schools first",
  "Schools First Credit Union",
  "SchoolsFirst federal credit union",
  "Scott",
  "Scott Credit Union",
  "Sound CU",
  "Southwest Bank",
  "sovereign santander bank",
  "Spage Age Federal Credit Unit",
  "spokane teachers credit union",
  "Spollen",
  "Sweeny",
  "Tri counties Bank",
  "united community bank",
  "university federal credit union",
  "US Bank",
  "USAA",
  "USAA",
  "USAA Federal Savings Bank",
  "USAA Federal Savings Bank",
  "USAA Federal Savings Bank",
  "Wachovia Bank",
  "Washington Mutual",
  "Wells Fargo",
  "Wells Fargo",
  "Wells Fargo",
  "Wells Fargo",
  "Wells Fargo",
  "Wells Fargo Bank"
]

const results = []

const samples = [
  'wells fargo',
  'chase',
  'a bank that doesnt exist'
]


const promises = institutionNames.map(query => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      products: ['auth', 'identity'],
      public_key: PLAID_PUBLIC_KEY
    })
  })
  .then(res => res.json())
  .then(json => {
    return flatten(
      Object.assign({}, json, {
        query: query
        // exists: !!json.institutions.length
      })
    )
  })
})

// Promise.all(promises)
PromiseBar.all(promises, {label: 'Searching Plaid & Compiling CSV'})
  .then(res => {
    // console.log(res)
    const csv = json2csv({
      data: res,
      fields: [
        'query',
        'institutions.0.name',
        'institutions.0.has_mfa',
        'institutions.0.institution_id',
      ]
    })
    return csv
  })
  .then(csv => {
    fs.writeFile(OUTPUT_FILE, csv, (res) => {
      console.log('Done writing CSV')
      exec(`open ${OUTPUT_FILE}`, (err, stdout, stderr) => {
        if ( err ) console.log('Error automatically opening file.')
      })
    })
  })
