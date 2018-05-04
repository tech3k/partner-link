import { Asset } from '../types';
import { ObjectToXmlTransformer } from './transformer';

export class AssetTransformer implements ObjectToXmlTransformer {
  public item(object: Asset) {
    return {
      Applicant: object.applicant,
      AssetOwner: object.assetOwner,
      AssetType: object.assetType,
      AssetValue: object.assetValue / 100,
      Notes: object.note,
    };
  }

  public items(object: Asset[]) {
    if (!object || !object.length) {
      return {};
    }

    return {
      OtherAssets: { OtherAssetRequest: object.map(item => this.item(item)) },
    };
  }
}
