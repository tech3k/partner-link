jest.mock('request-promise-native');

import { Service } from './service';
import * as request from 'request-promise-native';
import { PartnerLinkCredentials } from '../types';

beforeEach(() => {
  request.mockClear();
});

describe('Service', () => {
  it('soapRequest should be successful', () => {
    request.mockImplementation(() => Promise.resolve('ok'));
    expect(request).not.toBeCalled();

    const service = new Service({} as PartnerLinkCredentials);
    return expect(
      service.soapRequest('???', 'google.com', '/', 'get'),
    ).resolves.toEqual('ok');
  });

  it('soapRequest should fail', () => {
    request
      .mockImplementationOnce(() => Promise.resolve('ok'))
      .mockImplementation(() => Promise.reject(Error('Noo!')));

    const service = new Service({} as PartnerLinkCredentials);
    return expect(
      service.soapRequest('???', 'google.com', '/', 'get'),
    ).rejects.toThrowError('Noo!');
  });

  it('tokenPostRequest should be successful', async () => {
    request.mockImplementation(() => Promise.resolve('ok'));

    const service = new Service({} as PartnerLinkCredentials);
    return expect(
      service.tokenPostRequest('', 'google.com', '/'),
    ).resolves.toBe('ok');
  });

  it('tokenPostRequest should fail', () => {
    request
      .mockImplementationOnce(async () => Promise.resolve('ok'))
      .mockImplementation(async () => Promise.reject(Error('Ooh!')));

    const service = new Service({} as PartnerLinkCredentials);
    return expect(
      service.tokenPostRequest('', 'google.com', '/'),
    ).rejects.toThrowError('Ooh!');
  });

  it('postRequest should be successful', () => {
    request.mockImplementation(async () => Promise.resolve('ok'));

    const service = new Service({} as PartnerLinkCredentials);
    return expect(service.postRequest('', 'google.com', '/')).resolves.toBe(
      'ok',
    );
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
