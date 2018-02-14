import { Vehicle } from "../types";
import { ObjectToXmlTransformer, XmlToObjectTransformer } from "./transformer";

export class VehicleTransformer implements ObjectToXmlTransformer {

  public item(object: Vehicle): string {
    return `<VehicleRequest>
   ${object.adaptedFordisabledUse ? "<AdaptedForDisabledUse>${object.adaptedFordisabledUse}</AdaptedForDisabledUse>" : "" }
   ${object.amountAdvanced ? "<AmountAdvanced>${object.amountAdvanced / 100}</AmountAdvanced>" : ""}
   ${object.amountOutstanding ? "<AmountOutstanding>${object.amountOutstanding}</AmountOutstanding>" : ""}
   <Applicant>${object.applicant}</Applicant>
   ${object.balloonPayment ? "<BalloonPayment>${object.balloonPayment}</BalloonPayment>" : ""}
   ${object.dateOfAdvance ? "<DateOfAdvance>${object.dateOfAdvance.format('YYYY-MM-DD')}</DateOfAdvance>" : ""}
   ${object.dateOfRegistration ? "<DateOfRegistration>${object.dateOfRegistration.format('YYYY-MM-DD')}</DateOfRegistration>" : ""}
   <DefaultedOnTheLoan>${object.defaulted ? "true" : "false"}</DefaultedOnTheLoan>
   ${object.endDate ? "<EndDate>${object.endDate.format('YYYY-MM-DD')</EndDate>" : ""}
   <FinanceOutstanding>${object.financeOustanding ? "true" : "false"}</FinanceOutstanding>
   ${object.financeType ? "<FinanceType>${object.financeType}</FinanceType>" : ""}
   ${object.reference ? "<LoanReferenceNo>${object.reference}</LoanReferenceNo>" : ""}
   <Make>${object.make}</Make>
   <Model>${object.model}</Model>
   ${object.monthlyCost ? "<MonthlyCost>${object.monthlyCost / 100}</MonthlyCost>" : ""}
   <RegistrationNo>${object.registrationNumber}</RegistrationNo>
   ${object.termInMonths ? "<TermInMonths>${object.termInMonths}</TermInMonths>" : ""}
   ${object.age ? "<VehicleAge>${object.age}</VehicleAge>" : ""}
   ${object.mileage ? "<VehicleMileage>${object.mileage}</VehicleMileage>" : ""}
   <VehicleNecessary>${object.necessary ? "true" : "false"}</VehicleNecessary>
   <VehicleUse>${object.useType}</VehicleUse>
   <VehicleValue>${object.value / 100}</VehicleValue>
</VehicleRequest>`;
  }

  public items(object: Vehicle[]): string {
    if (object === undefined || object.length === 0) { return ""; }

    return `<Vehicles>
  ${object.map((item) => this.item(item)).join("\n")}
</Vehicles>`;
  }

}
