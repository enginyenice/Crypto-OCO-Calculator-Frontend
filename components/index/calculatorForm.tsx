import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid'; // Grid item version 1
import { OCOFormModel } from '../../models/ocoFormModel';
import { useEffect, useState } from 'react';
import CalculatorModal from './calculatorModal';
import { OCOTableModel } from '../../models/ocoTableModel';
import { BinanceTickerModel } from '../../models/binanceTickerModel';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { TotalModel } from '../../models/totalModel';
export default function CalculatorForm() {
    const [OCOTableModelList, setOCOTableModelList] = useState<Array<OCOTableModel>>([]);
    const [Total, setTotal] = useState<TotalModel>({ total: 0, ocoLimitTotal: 0, ocoStopTotal: 0, lastTotal: 0 });
    useEffect(() => {

        let wss = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        wss.onmessage = function (event: any) {
            let tempTotal: TotalModel = { total: 0, ocoLimitTotal: 0, ocoStopTotal: 0, lastTotal: 0 };
            let savedSymbol: Array<OCOFormModel> = JSON.parse(localStorage.getItem("OCOList") || "[]");
            let tempObj: Array<BinanceTickerModel> | undefined = JSON.parse(event.data);
            if (savedSymbol === undefined || savedSymbol.length == 0) {
                setTotal(tempTotal);
                return;
            }

            let tempOcoTable = OCOTableModelList;
            savedSymbol.forEach(element => {
                if (OCOTableModelList.findIndex(x => x.symbol == element.symbol) == -1) {
                    let ocoTableModel = new OCOTableModel();
                    ocoTableModel.symbol = element.symbol;
                    ocoTableModel.price = element.price;
                    ocoTableModel.ocoPercentage = element.ocoPercentage;
                    ocoTableModel.ocoLimitPrice = (100 + element.ocoPercentage) * element.price / 100;
                    ocoTableModel.ocoStopPrice = (100 - element.ocoPercentage) * element.price / 100;
                    ocoTableModel.quantity = element.quantity;
                    tempOcoTable.push(ocoTableModel);
                    setOCOTableModelList(tempOcoTable);
                }
            });


            let tempOcoTableModelList: Array<OCOTableModel> = [];
            OCOTableModelList.forEach(element => {
                let symbol = tempObj?.find(x => x.s == element.symbol);
                let savedSymbolFind = savedSymbol?.find(x => x.symbol == element.symbol);
                if (symbol !== undefined && savedSymbolFind !== undefined) {
                    element.lastPrice = symbol.c;
                    element.ocoLimitPrice = (100 + element.ocoPercentage) * element.price / 100;
                    element.ocoLimitTotal = element.ocoLimitPrice * element.quantity;
                    element.ocoStopPrice = (100 - element.ocoPercentage) * element.price / 100;
                    element.ocoStopTotal = element.ocoStopPrice * element.quantity;
                    element.total = Number(element.lastPrice) * element.quantity;
                    element.percentage = symbol.P;
                    element.ocoProfitLoss = ((Number(element.lastPrice) * 100) / element.price) - 100;


                }
                if (savedSymbolFind !== undefined) {
                    tempOcoTableModelList.push(element);
                }

            });
            tempOcoTableModelList.forEach(element => {
                tempTotal.total += element.quantity * element.price;
                tempTotal.lastTotal += element.total;
                tempTotal.ocoLimitTotal += element.ocoLimitTotal;
                tempTotal.ocoStopTotal += element.ocoStopTotal;
            })
            setOCOTableModelList(tempOcoTableModelList);
            setTotal(tempTotal);








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
        if(value == undefined || value == null || value == "") return 0;
        value = Number(value).toFixed(8).toString();
        let splitvalue = value.toString().split('.');
        if (splitvalue.length > 1) {
            splitvalue[1] = splitvalue[1].replace(/0+$/, '');
            value = splitvalue[0] + '.' + splitvalue[1];
        }
        return value;
    }
    let totalPriceFormat = (value: number) => {
        return value.toFixed(4);
    }
    let formatName = (value: string) => {
        return value.replace("USDT", "");
    }
    const handleDelete = (symbol: string) => {
        let savedSymbol: Array<OCOFormModel> = JSON.parse(localStorage.getItem("OCOList") || "[]");
        savedSymbol = savedSymbol.filter(x => x.symbol !== symbol);
        let tempOcoTableModelList = OCOTableModelList.filter(x => x.symbol !== symbol);
        localStorage.setItem("OCOList", JSON.stringify(savedSymbol));
        setOCOTableModelList(tempOcoTableModelList);
    };





    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    let changeModal = (x: any) => {
        setOpen(!open);
    };
    const formDataAdd = () => {
        setOpen(!open);
    };
    return (
        <>
            <Card sx={{ minWidth: 275, mt: 2 }}>
                <CardContent>
                    <Grid item container justifyContent={'end'}>
                        <Button variant="outlined" onClick={handleOpen} >Add</Button>
                    </Grid>
                    <TableContainer >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Symbol</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="right">Percentage</TableCell>
                                    <TableCell align="right">Last Price</TableCell>
                                    <TableCell align="right">OCO Limit</TableCell>
                                    <TableCell align="right">OCO Stop</TableCell>
                                    <TableCell align="right">OCO Percentage</TableCell>
                                    <TableCell align="right">OCO Profit Loss</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {OCOTableModelList.map((row, index) => (
                                    <TableRow
                                        key={index}
                                    >
                                        <TableCell component="td" scope="row">
                                            <IconButton onClick={() => handleDelete(row.symbol)} color="error" aria-label="add an alarm">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            <Typography fontWeight={700}>
                                                {formatName(row.symbol)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" component="td" scope="row">
                                            <Typography fontWeight={700}>
                                                {row.price}
                                            </Typography>
                                            
                                        </TableCell>
                                        <TableCell align="right" component="td" scope="row">
                                            <Typography fontWeight={700}>
                                                {row.quantity}
                                            </Typography>
                                            
                                        </TableCell>
                                        <TableCell align="right" component="td" scope="row">
                                            <Typography fontWeight={700}>
                                                {totalPriceFormat(row.total)}
                                            </Typography>
                                            
                                        </TableCell>
                                        <TableCell style={{ color: createColor(row.percentage) }} align="right" component="td" scope="row">
                                            <Typography fontWeight={700}>
                                                {formatPercentage(row.percentage)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" component="td" scope="row">
                                            <Typography fontWeight={700}>
                                                {clearLastZerosToPrice(row.lastPrice)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" component="td" scope="row">
                                            <Typography fontWeight={700}>
                                                {clearLastZerosToPrice(row.ocoLimitPrice?.toString())}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" component="td" scope="row">
                                            <Typography fontWeight={700}>
                                                {clearLastZerosToPrice(row.ocoStopPrice?.toString())}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" component="td" scope="row">
                                            <Typography fontWeight={700} style={{ color: '#0288d1' }}>
                                                {formatPercentage(row.ocoPercentage?.toString())}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: createColor(row.ocoProfitLoss?.toString()) }} component="td" scope="row">
                                            <Typography fontWeight={700}>
                                                {formatPercentage(row.ocoProfitLoss?.toString())}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
                <CardActions>
                    <Grid item container textAlign={'center'}>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <Typography fontWeight={700}>
                                Total: {totalPriceFormat(Total.total)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <Typography fontWeight={700}>
                                Last Total: {totalPriceFormat(Total.lastTotal)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <Typography fontWeight={700}>
                                OCO Stop Total: {totalPriceFormat(Total.ocoStopTotal)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <Typography fontWeight={700}>
                                OCO Limit Total: {totalPriceFormat(Total.ocoLimitTotal)}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardActions>

            </Card>

            <CalculatorModal OpenModal={open} ChangeModal={changeModal} FormDataAdd={formDataAdd} />


        </>
    );
}
