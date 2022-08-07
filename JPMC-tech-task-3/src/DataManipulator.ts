import { ServerRespond } from './DataStreamer';

export interface Row { // updataing schema
  price_abc: number, 
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2; // data abc
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2; // data def
    const ratio = priceABC / priceDEF; //ratio
    const upperBound = 1 + 0.05;   // upper bound 
    const lowerBound = 1 - 0.05;//lower bound
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,  //threshold 
    }; // preserving consistency single object is passed 
  }
}
