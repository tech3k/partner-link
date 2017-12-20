import { XmlToObjectTransformer, ObjectToXmlTransformer } from "./transformer";
import { Asset } from "../types";

export class AssetTransformer implements ObjectToXmlTransformer {

  item(object: Asset): string {
    return `
<OtherAssetRequest>
   <Applicant>${object.applicant}</Applicant>
   <AssetOwner>${object.assetOwner}</AssetOwner>
   <AssetType>${object.assetType}</AssetType>
   <AssetValue>${object.assetValue / 100}</AssetValue>
   <Notes>${object.note}</Notes>
</OtherAssetRequest>
    `;
  }

  items(object: Asset[]): string {
    if (object === undefined || object.length === 0) { return ''; }

    return `
<OtherAssets>
  ${object.map(item => this.item(item)).join("\n")}
</OtherAssets>
    `;
  }

}
