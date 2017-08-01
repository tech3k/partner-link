import * as moment from "moment";

import { Case, CreditSearchAddress, CreditSearchAddressResult, CreditSearchPerson, Creditor, Document, Expenditure, Income, Note, NoteRequest, PartnerLink, PartnerLinkCredentials, PartnerLinkError, Person } from "./";


let partnerLink = new PartnerLink({
  url: "partnerlinkapidev.azurewebsites.net",
  username: "beyondplapi",
  password: "PartnerLink!1",
  leadProviderId: 302,
  sourceCode: "REFERRAL",
  creditSearchUrl: "searchfulllive.azurewebsites.net",
  creditSearchClient: "BeyondComparison",
  creditSearchUsername: "simonbc",
  creditSearchPassword: "c9ee1b951fd661d23e82c9175afd8182398d68f194b149669e971e1f71edb75b",
  debug: true
} as PartnerLinkCredentials);


// Submit Details to Partner Link
// ------------------------------
//
partnerLink.submission.createFullCase({
  people: [
    {title: "Mr", firstName: "Simon", middleNames: 'Peter', lastName: "Skinner", maidenName: "", dateOfBirth: moment("1982-04-28"), gender: "M",
     addresses: [
       {id: "3253224", address1: "123 Test Lane", address2: "sdfgsd", town: "Testing", county: "testashire", postalCode: "TE5 7ER", surname: "Skinner"} as CreditSearchAddressResult
     ],
     homeNumber: "01204297397", mobileNumber: "07402444653", emailAddress: "simon@sisk-ltd.co.uk",
     employmentStatus: "Employed", employerName: "Beyond Comparison", jobTitle: "IT Director"} as Person,
     {title: "Mrs", firstName: "Katie", middleNames: 'Ellen', lastName: "Skinner", maidenName: "Smith", dateOfBirth: moment("1987-01-12"), gender: "F",
      addresses: [
        {id: "3253224", address1: "Flat 10a Witherfood Road", address2: "sdfsd", town: "Testing", county: "testashire", postalCode: "TE5 7ER", surname: "Skinner"} as CreditSearchAddressResult
      ],
      homeNumber: "01204297397", mobileNumber: "07402444653", emailAddress: "simon@sisk-ltd.co.uk",
      employmentStatus: "Employed", employerName: "Beyond Comparison", jobTitle: "IT Director"} as Person
  ],
  dependants: [
    moment('2005-07-12')
  ],
  expenditure: [
    {name: "Food", value: 2000} as Expenditure
  ],
  income: [
    {name: "Wage", value: 10000} as Income
  ],
} as Case)
  .then(caseResult => {
    return partnerLink.creditSearch.checkMultipleAddresses([
      {houseNumber: "51", postalCode: "BL1 8WB", street: "Waterside Gardens", town: "Bolton", surname: "Fish"} as CreditSearchAddress,
      {houseNumber: "128 Hulton Lane", postalCode: "BL3 4JD", street: "128 Hulton Lane", town: "Bolton", surname: "Fish"} as CreditSearchAddress
    ])
    .then(result => {
      return {caseResult: caseResult, addresses: result}
    })
  })
  .then(({caseResult, addresses}) => partnerLink.submission.addAddresses(caseResult, addresses))
  .then(caseResult => partnerLink.submission.addNotes(caseResult, {
    id: caseResult.id,
    notes: [
      {note: "This is a Test Note", export: true} as Note,
      {note: "This is another Test Note", export: true} as Note,
      {note: "This is a third Test Note", export: true} as Note
    ]
  } as NoteRequest))
  .then(caseResult => partnerLink.submission.addCreditors(caseResult, [
    {
      name: "123 Debt Solutions Ltd.",
      creditorType: "Communications Supplier",
      reference: 'NA',
      accountType: "Communications Supplier",
      jointAccount: false,
      startBalance: 20000,
      delinquentBalance: 2300,
      currentBalance: 7800,
      creditStartDate: moment("2016-04-09"),
      creditUpdateDate: moment("2017-07-01"),
      creditAmount: 20000,
      creditTerms: "MONTHLY@23",
      latestStatus: "D",
      applicant: 1,
      owner: 1,
      creditCheck: true
    } as Creditor,
    {
      name: "123 Debt Solutions Ltd.",
      creditorType: "Communications Supplier",
      reference: 'NA',
      accountType: "Communications Supplier",
      jointAccount: true,
      startBalance: 75000,
      delinquentBalance: 8500,
      currentBalance: 18600,
      creditStartDate: moment("2016-04-09"),
      creditUpdateDate: moment("2017-07-01"),
      creditAmount: 75000,
      creditTerms: "MONTHLY@23",
      latestStatus: "D",
      applicant: 1,
      owner: 1,
      creditCheck: false
    } as Creditor
  ]))
  .then(caseResult => partnerLink.submission.addDocuments(caseResult, [
    { applicant: 1, encodedDocument: "YQ==", typeId: 1, fileName: "test1.txt" } as Document,
    { applicant: 1, encodedDocument: "YQ==", typeId: 1, fileName: "test2.txt" } as Document,
    { applicant: 1, encodedDocument: "YQ==", typeId: 1, fileName: "test3.txt" } as Document
  ]))
    .then(caseResult => { console.log(caseResult); return caseResult; })





// YQ==

// Credit Searching someone
// ------------------------
//
// partnerLink.creditSearch.checkMultipleAddresses([
//   {houseNumber: "128 Hulton Lane", postalCode: "BL3 4JD", street: "128 Hulton Lane", town: "Bolton", surname: "Fish"} as CreditSearchAddress,
//   {houseNumber: "Flat 10a Bigford Lane", postalCode: "BL3 4JD", street: "Flat 10a Bigford Lane", town: "Bolton", surname: "Fish"} as CreditSearchAddress,
//   {houseNumber: "Flat 991", postalCode: "BL3 4JD", street: "Salisbury Avenue", town: "Bolton", surname: "Fish"} as CreditSearchAddress
// ])
// .then(addresses => partnerLink.creditSearch.performCreditCheck({
//   clientReference: "asdi7gasfdi87asgf9a8sf",
//   title: "Mr",
//   firstName: "Scott",
//   lastName: "Fish",
//   dateOfBirth: moment("1994-11-13"),
//   addresses: addresses
// } as CreditSearchPerson))
// .then(results => console.log(results))
// .catch((e: PartnerLinkError) => console.log(e.code, e.message));
