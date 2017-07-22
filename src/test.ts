import * as moment from "moment";
import { PartnerLinkError, PartnerLink, PartnerLinkCredentials, CreditSearchAddress, CreditSearchPerson } from "./";

let partnerLink = new PartnerLink({
  url: "requestb.in/1a78bl41",
  username: "testUsername",
  password: "testPassword",
  leadProviderId: 300,
  sourceCode: "API",
  creditSearchUrl: "searchfulllive.azurewebsites.net",
  creditSearchClient: "BeyondComparison",
  creditSearchUsername: "simonbc",
  creditSearchPassword: "c9ee1b951fd661d23e82c9175afd8182398d68f194b149669e971e1f71edb75b"
} as PartnerLinkCredentials);


partnerLink.creditSearch.checkMultipleAddresses([
  {houseNumber: "51", postalCode: "BL1 8WB", street: "Waterside Gardens", town: "Bolton", surname: "Fish"} as CreditSearchAddress,
  {houseNumber: "128 Hulton Lane", postalCode: "BL3 4JD", street: "128 Hulton Lane", town: "Bolton", surname: "Fish"} as CreditSearchAddress
])
.then(addresses => partnerLink.creditSearch.performCreditCheck({
  clientReference: "asdi7gasfdi87asgf9a8sf",
  title: "Mr",
  firstName: "Scott",
  lastName: "Fish",
  dateOfBirth: moment("1994-11-13"),
  addresses: addresses
} as CreditSearchPerson))
.then(results => console.log(results))
.catch((e: PartnerLinkError) => console.log(e.code, e.message));
