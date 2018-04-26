import {ObjectToXmlTransformer} from "./transformer";
import {Expenditure, Income} from "../types";

export class IncomeTransformer implements ObjectToXmlTransformer {

    public item(object: Income) {
        return {
            Name: object.name,
            Value: object.value,
            UserDefinedName: object.customName ? object.customName : null,
        };
    }

    public items(object: Income[]) {
        if (!object || !object.length) {
            return {};
        }

        return {
            IncomeFields: {IncomeField: object.map((item) => this.item(item))},
        };
    }

}

export class ExpenditureTransformer implements ObjectToXmlTransformer {

    public item(object: Expenditure) {
        return {
            Name: object.name,
            Value: object.value,
        };
    }

    public items(object: Expenditure[]) {
        if (!object || !object.length) {
            return {};
        }

        return {
            ExpenditureFields: {ExpenditureField: object.map((item) => this.item(item))},
        };
    }

}
