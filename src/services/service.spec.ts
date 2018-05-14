jest.mock('request-promise-native');

import { Service } from './service';
import * as request from 'request-promise-native';
import { PartnerLinkCredentials } from '../types';

beforeEach(() => {
  request.mockClear();
});

describe('Service', () => {
  it('soapRequest should be successful', async () => {
    request.mockImplementation(async () => {
      return Promise.resolve('ok');
    });

    expect(request).not.toBeCalled();
    const service = new Service({} as PartnerLinkCredentials);
    expect(await service.soapRequest('???', 'google.com', '/', 'get')).toEqual(
      'ok',
    );
  });

  it('soapRequest should fail', async () => {
    request
      .mockImplementationOnce(async () => {
        return Promise.resolve('ok');
      })
      .mockImplementation(async () => {
        return Promise.reject(Error('Noo!'));
      });

    const service = new Service({} as PartnerLinkCredentials);
    // should resolve because error has already been caught
    expect(
      await service.soapRequest('???', 'google.com', '/', 'get'),
    ).toBeUndefined();
  });

  it('tokenPostRequest should be successful', async () => {
    request.mockImplementation(async () => {
      return Promise.resolve('ok');
    });

    const service = new Service({} as PartnerLinkCredentials);
    expect(await service.tokenPostRequest('', 'google.com', '/')).toBe('ok');
  });

  it('tokenPostRequest should fail', async () => {
    request
      .mockImplementationOnce(async () => {
        return Promise.resolve('ok');
      })
      .mockImplementation(async () => {
        return Promise.reject(Error('Ooh!'));
      });

    const service = new Service({} as PartnerLinkCredentials);
    return expect(
      service.tokenPostRequest('', 'google.com', '/'),
    ).rejects.toThrowError('Ooh!');
  });

  it('postRequest should be successful', async () => {
    request.mockImplementation(async () => {
      return Promise.resolve('ok');
    });

    const service = new Service({} as PartnerLinkCredentials);
    expect(await service.postRequest('', 'google.com', '/')).toBe('ok');
  });

  it('log should output', () => {
    global.console = {
      log: jest.fn(),
    };

    const service = new Service({ debug: true } as PartnerLinkCredentials);
    service.log('test');

    expect(global.console.log).toHaveBeenCalledWith('test');
  });
});
