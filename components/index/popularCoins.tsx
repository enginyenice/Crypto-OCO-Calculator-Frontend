import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // Grid version 1
import { useEffect, useState } from 'react';
import { BinanceTickerModel } from '../../models/binanceTickerModel';

export default function PopularCoins() {
  const [TikerArrayModel, setTikerArrayModel] = useState<Array<BinanceTickerModel>>();
  const [PopularCoins, SetPopularCoins] = useState(["BTCUSDT", "ETHUSDT", "BNBUSDT", "LINKUSDT",])
  useEffect(() => {
    let wss = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    wss.onmessage = function (event: any) {
      let tempObj: Array<BinanceTickerModel> | undefined = JSON.parse(event.data);
      if (TikerArrayModel === undefined) {
        setTikerArrayModel(JSON.parse(event.data));
      } else {

        tempObj?.forEach(element => {
          let findIndex = TikerArrayModel?.findIndex(x => x.s == element.s);
          if (findIndex != undefined && findIndex != -1) {
            TikerArrayModel?.splice(findIndex, 1, element);
          } else {
            TikerArrayModel?.push(element);
          }
        });
      }
    }
  }, [])

  let createColor = (value: string) => {
    if (Number(value) > 0) {
      return '#00FF00';
    } else if (Number(value) < 0) {
      return '#FF0000';
    } else {
      return "#1976d2";
    }
  }
  let formatPercentage = (value: string) => {
    return Number(value).toFixed(2) + '%';
  }
  let clearLastZerosToPrice = (value: string) => {
    return value.replace(/0+$/, '').toString();
  }
  let formatName = (value: string) => {
    return value.replace("USDT", "");
  }
  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Grid container>
            {PopularCoins.map((item) => {
              return (
                <Grid xs={12} md={3} sm={6} className="popularCoinBorderRight">
                  <Grid container>
                    <Grid xs={6}>
                      <Typography color="black" fontWeight={700}>
                        {formatName(item)}
                      </Typography>
                      <Typography color="text.primary" fontSize={12} gutterBottom>
                        $ {clearLastZerosToPrice(TikerArrayModel?.filter(p => p.s === item)[0]?.c ?? "0")}
                      </Typography>
                    </Grid>
                    <Grid xs={6} alignItems={'center'} justifyContent={'start'} display={'flex'} >
                      <Typography style={{ color: createColor(TikerArrayModel?.filter(p => p.s === item)[0]?.P ?? "0") }} fontWeight={700} fontSize={30}>
                        {formatPercentage(TikerArrayModel?.filter(p => p.s === item)[0]?.P ?? "#N/A")}
                      </Typography>
                    </Grid>
                  </Grid>

                </Grid>
              )
            })}
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
