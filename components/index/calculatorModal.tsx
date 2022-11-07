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
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid'; // Grid item version 1
import { OCOFormModel } from '../../models/ocoFormModel';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Axios from 'axios';
import { SymbolModel } from '../../models/symbolModel';
import Autocomplete from '@mui/material/Autocomplete';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};



export default function CalculatorModal(props: any) {
    const [SymbolList, setSymbolList] = useState<Array<string>>(['']);

    useEffect(() => {
        let symbolListStringArray: Array<string> = [];
        Axios.get<Array<SymbolModel>>('https://api.binance.com/api/v3/ticker/price').then((response) => {
            response.data.forEach((x) => {
                x.symbol.endsWith('USDT') ? symbolListStringArray.push(x.symbol) : null;
            });
        }).finally(() => {
            setSymbolList(symbolListStringArray);
        });

    }, [])

    const [OCOForm, setOCOForm] = useState(new OCOFormModel());


    const changePrice = (changeEvent: any) => {
        setOCOForm({ ...OCOForm, price: Number(changeEvent.target.value ?? 0) });
    }
    const changeQuantity = (changeEvent: any) => {
        setOCOForm({ ...OCOForm, quantity: Number(changeEvent.target.value ?? 0) });
    }
    const changeOCOPercentage = (changeEvent: any) => {
        setOCOForm({ ...OCOForm, ocoPercentage: Number(changeEvent.target.value ?? 0) });
    }
    const saveOCO = () => {
        console.log(OCOForm);
        let OCOList: Array<OCOFormModel> = JSON.parse(localStorage.getItem('OCOList') as string);
        if (OCOForm === null || OCOForm === undefined || OCOForm.symbol === undefined) { return; }

        if (OCOList !== null) {
            OCOList.push(OCOForm);
        } else {
            OCOList = new Array<OCOFormModel>();
            OCOList.push(OCOForm);
        }
        localStorage.setItem('OCOList', JSON.stringify(OCOList));
        props.FormDataAdd();
    }

    const handleClose = () => props.ChangeModal(false);
    const handleClear = () => setOCOForm(new OCOFormModel());
    return (
        <Modal
            open={props.OpenModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid item container sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Typography>Symbol</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={SymbolList}
                            onChange={(event: any, newValue: string | null) => {
                                setOCOForm({ ...OCOForm, symbol: newValue === null || newValue === undefined ? 'BTCUSDT' : newValue });
                            }}
                            renderInput={(params) => <TextField {...params} label="Symbol" />}
                        />
                    </Grid>
                </Grid>
                <Grid item container sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Typography>Price</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="outlined-number"
                            label="Number"
                            style={{ width: '100%' }}
                            type="number"
                            value={OCOForm?.price}
                            onChange={changePrice}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item container sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Typography>Quantity</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="outlined-number"
                            label="Number"
                            type="number"
                            value={OCOForm?.quantity}
                            onChange={changeQuantity}
                            style={{ width: '100%' }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item container sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Typography>OCO Percentage</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="outlined-number"
                            label="Number"
                            type="number"
                            value={OCOForm?.ocoPercentage}
                            onChange={changeOCOPercentage}
                            style={{ width: '100%' }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item container sx={{ mt: 2 }}>
                    <Grid item xs={12} justifyContent={"end"} display={"flex"}>
                        {/* Clear Button */}
                        <Button sx={{ mr: 2 }} variant="contained" color={'error'} onClick={handleClear}>Clear</Button>

                        {/* Cancel Button */}
                        <Button sx={{ mr: 2 }} variant="contained" color={'error'} onClick={handleClose}>Cancel</Button>

                        {/* Save Button */}
                        <Button variant="contained" color={'success'} onClick={saveOCO}>Save</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}
