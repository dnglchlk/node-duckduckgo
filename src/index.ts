import * as request from 'request';
import { RequestCallback, RequestResponse } from 'request';
import {
  allowedFormat,
  getFormatter,
  IFormatter,
  JsonFormatter
} from './formatHelper';
import { OptionHelper, optionType } from './optionHelper';
import { getBuilder } from './queryBuilder';

export { JsonFormatter, RequestCallback, RequestResponse };

export class Requester {
  private baseUrl = 'https://api.duckduckgo.com/';
  // tslint:disable-next-line:variable-name
  private _formatter = getFormatter('json');
  private noRedirect = new OptionHelper('no_redirect');
  private noHtml = new OptionHelper('no_html');
  private skipDisambig = new OptionHelper('skip_disambig');

  constructor(private appName = 'node-duckduckgo') { }

  public requestP(search: string): Promise<RequestResponse> {
    return new Promise<RequestResponse>((resolve, reject) => {
      const cb: RequestCallback = (error, response, body: any) => {
        if (error !== undefined && error !== null) {
          reject(error);
        }
        resolve(response);
      };
      this.request(search, cb);
    });
  }

  public request(search: string, callBack?: RequestCallback) {
    const builder = getBuilder();
    builder.q(search);
    builder.t(this.appName);
    this._formatter.buildQueryParam(builder);
    this.buildQueryOptions(builder);
    const queryString = builder.toString();

    return request(`${this.baseUrl}?${queryString}`, callBack);
  }

  private buildQueryOptions(builder: any) {
    this.noRedirect.buildQueryParam(builder);
    this.noHtml.buildQueryParam(builder);
    this.skipDisambig.buildQueryParam(builder);
  }

  set format(format: allowedFormat) {
    this._formatter = getFormatter(format);
  }

  get format() {
    return this._formatter.getFormat();
  }

  get formatter() {
    return this._formatter;
  }

  set no_redirect(value: optionType) {
    this.noRedirect.option = value;
  }

  get no_redirect() {
    return this.noRedirect.option;
  }

  set no_html(value: optionType) {
    this.noHtml.option = value;
  }

  get no_html() {
    return this.noHtml.option;
  }

  set skip_disambig(value: optionType) {
    this.skipDisambig.option = value;
  }

  get skip_disambig() {
    return this.skipDisambig.option;
  }
}
