import { AssetTransformer } from './asset';

describe('Asset Transformer', () => {
  it('should transform a single item', () => {
    const data = {
      applicant: 1,
      assetOwner: 'single',
      assetType: 'Investment',
      assetValue: 10000,
      note: 'Some text',
    };

    expect(new AssetTransformer().item(data)).toEqual({
      Applicant: 1,
      AssetOwner: 'single',
      AssetType: 'Investment',
      AssetValue: 100,
      Notes: 'Some text',
    });
  });

  it('should return an empty object', () => {
    expect(new AssetTransformer().items([])).toEqual({});
  });

  it('should return multi items', () => {
    const data = [
      {
        applicant: 1,
        assetOwner: 'single',
        assetType: 'Investment',
        assetValue: 10000,
        note: 'Some text',
      },
    ];

    expect(new AssetTransformer().items(data)).toEqual({
      OtherAssets: {
        OtherAssetRequest: [
          {
            Applicant: 1,
            AssetOwner: 'single',
            AssetType: 'Investment',
            AssetValue: 100,
            Notes: 'Some text',
          },
        ],
      },
    });
  });
});
