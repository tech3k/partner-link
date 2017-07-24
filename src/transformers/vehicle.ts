import { XmlToObjectTransformer, ObjectToXmlTransformer } from "./transformer";
import { Vehicle } from "../types";

export class VehicleTransformer implements ObjectToXmlTransformer {

  item(object: Vehicle): string {
    return `
<VehicleRequest>
   <AdaptedForDisabledUse>${object.adaptedFordisabledUse}</AdaptedForDisabledUse>
   <AmountAdvanced>${object.amountAdvanced / 100}</AmountAdvanced>
   <AmountOutstanding>${object.amountOutstanding}</AmountOutstanding>
   <Applicant>${object.applicant}</Applicant>
   <BalloonPayment>${object.balloonPayment}</BalloonPayment>
   <DateOfAdvance>${object.dateOfAdvance.format('YYYY-MM-DD')}</DateOfAdvance>
   <DateOfRegistration>${object.dateOfRegistration.format('YYYY-MM-DD')}</DateOfRegistration>
   <DefaultedOnTheLoan>${object.defaulted ? 'true' : 'false'}</DefaultedOnTheLoan>
   <EndDate>${object.endDate.format('YYYY-MM-DD')}</EndDate>
   <FinanceOutstanding>${object.financeOustanding ? 'true' : 'false'}</FinanceOutstanding>
   <FinanceType>${object.financeType}</FinanceType>
   <LoanReferenceNo>${object.reference}</LoanReferenceNo>
   <Make>${object.make}</Make>
   <Model>${object.model}</Model>
   <MonthlyCost>${object.monthlyCost / 100}</MonthlyCost>
   <RegistrationNo>${object.registrationNumber}</RegistrationNo>
   <TermInMonths>${object.termInMonths}</TermInMonths>
   <VehicleAge>${object.age}</VehicleAge>
   <VehicleMileage>${object.mileage}</VehicleMileage>
   <VehicleNecessary>${object.necessary ? 'true' : 'false'}</VehicleNecessary>
   <VehicleUse>${object.useType}</VehicleUse>
   <VehicleValue>${object.value / 100}</VehicleValue>
</VehicleRequest>
    `;
  }

  items(object: Vehicle[]): string {
    if (object === undefined || object.length === 0) { return ''; }

    return `
<Vehicles>
  ${object.map(item => this.item(item)).join("\n")}
</Vehicles>
    `;
  }

}
