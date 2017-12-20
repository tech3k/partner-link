import { XmlToObjectTransformer, ObjectToXmlTransformer } from "./transformer";
import { Income, Expenditure } from "../types";

export class IncomeTransformer implements ObjectToXmlTransformer {

  item(object: Income): string {
    return `
<IncomeField>
   <Name>${object.name}</Name>
   <Value>${object.value / 100}</Value>
   <UserDefinedName>${object.customName}</UserDefinedName>
</IncomeField>
    `;
  }

  items(object: Income[]): string {
    if (object === undefined || object.length === 0) { return ''; }

    return `
<Income>
  <IncomeFields>
    ${object.map(item => this.item(item)).join("\n")}
  </IncomeFields>
</Income>
    `;
  }

}

export class ExpenditureTransformer implements ObjectToXmlTransformer {

  item(object: Expenditure): string {
    return `
<ExpenditureField>
   <Name>${object.name}</Name>
   <Value>${object.value / 100}</Value>
</ExpenditureField>
    `;
  }

  items(object: Expenditure[]): string {
    if (object === undefined || object.length === 0) { return ''; }

    return `
<Expenditure>
  <ExpenditureFields>
    ${object.map(item => this.item(item)).join("\n")}
  </ExpenditureFields>
</Expenditure>
    `;
  }

}
