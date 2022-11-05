import * as React from 'react';
import { useEffect } from 'react';
import PopularCoins from '../components/index/popularCoins';
import { BinanceTickerModel } from '../models/binanceTickerModel';
// import websocket

export default function Home() {
  return (
    <>
      <PopularCoins></PopularCoins>
    </>
  )
}
