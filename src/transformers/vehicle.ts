import * as moment from "moment";
import {Vehicle} from "../types";
import {ObjectToXmlTransformer} from "./transformer";

export class VehicleTransformer implements ObjectToXmlTransformer {

    public item(object: Vehicle) {

        return {
            VehicleRequest: {
                AdaptedForDisabledUse: object.adaptedFordisabledUse ? "true" : "false",
                AmountAdvanced: object.amountAdvanced / 100,
                AmountOutstanding: object.amountOutstanding,
                Applicant: object.applicant,
                BalloonPayment: object.balloonPayment,
                DateOfAdvance: object.dateOfAdvance,
                DateOfRegistration: object.dateOfRegistration.format("YYYY-MM-DD"),
                DefaultedOnTheLoan: object.defaulted ? "true" : "false",
                EndDate: object.endDate.format("YYYY-MM-DD"),
                FinanceOutstanding: object.financeOustanding ? "true" : "false",
                FinanceType: object.financeType,
                LoanReferenceNo: object.reference,
                Make: object.make,
                Model: object.model,
                MonthlyCost: object.monthlyCost,
                RegistrationNo: object.registrationNumber,
                TermInMonths: object.termInMonths,
                VehicleAge: object.age,
                VehicleMileage: object.mileage,
                VehicleNecessary: object.necessary ? "true" : "false",
                VehicleUse: object.useType,
                VehicleValue: object.value / 100,
            },
        };
    }

    public items(object: Vehicle[]) {
        if (!object || !object.length) {
            return {};
        }

        return {Vehicles: object.map((item) => this.item(item))};
    }

}
