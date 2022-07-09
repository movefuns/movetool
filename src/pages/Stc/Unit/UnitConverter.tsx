import {FormControl, TextField} from "@mui/material";
import {useState} from "react";
import {NANO_STC} from "../../../utils/consts";
import useSWR from "swr";

function formatValue(value:string){
   return  Number(value.trim().replaceAll(",",""))
}

async function fetchPair(url: string) {
    return fetch(url).then(async r => {
        let lastPrice = 0
        let lastInputPrice = 0
        const data = await r.json()
        if (data) {
            lastPrice = data.latestPrice / (10 ** data.decimals)
            lastInputPrice = lastPrice > 0 ? parseFloat((1 / lastPrice).toFixed(data.decimals)) : 0
        }
        return lastInputPrice;
    })
}

export default function UnitConverter() {
    const [stc, setStc] = useState(0)
    const [nanoStc, setNanoStc] = useState(0)
    const [usdt, setUSDT] = useState(0)
    const [cny, setCny] = useState(0)
    const [btc, setBtc] = useState(0)
    const [eth, setEth] = useState(0)
    const [star, setStar] = useState(0)


    const STC_USD = useSWR(`https://price-api.starcoin.org/main/v1/priceFeeds/STCUSD`, fetchPair).data
    const BTC_USD = useSWR(`https://price-api.starcoin.org/main/v1/priceFeeds/BTC_USD`, fetchPair).data
    const ETH_USD = useSWR(`https://price-api.starcoin.org/main/v1/priceFeeds/ETH_USD`, fetchPair).data
    const STAR_USD = useSWR(`https://price-api.starcoin.org/main/v1/priceFeeds/STAR_USD`, fetchPair).data
    const CNY_USD = useSWR(`https://api.it120.cc/gooking/forex/rate?fromCode=CNY&toCode=USD`, (url) => {
        return fetch(url).then(async r => {
            const data = await r.json()
            return data.data.rate
        })
    }).data

    const handleChangeUsdt = (t: any) => {
        const value = formatValue(t.target.value);
        setUSDT(value)

        if (STC_USD && CNY_USD && BTC_USD && ETH_USD && STAR_USD) {
            setStc(value * STC_USD)
            setNanoStc(value * STC_USD * NANO_STC)
            setCny(value * CNY_USD)
            setBtc(value * BTC_USD)
            setEth(value * ETH_USD)
            setStar(value * STAR_USD)
        }


    }


    const handleChangeStc = (t: any) => {
        const value = formatValue(t.target.value);
        setStc(value)
        setNanoStc(value * NANO_STC)
        if (STC_USD && CNY_USD && BTC_USD && ETH_USD && STAR_USD) {
            const worthUSD =  value/STC_USD
            setUSDT(worthUSD)
            setCny(worthUSD * CNY_USD)
            setBtc(worthUSD * BTC_USD)
            setEth(worthUSD * ETH_USD)
            setStar(worthUSD * STAR_USD)
        }
    }


    const handleChangeNanoStc = (t: any) => {
        setNanoStc(t.target.value)
        setStc(formatValue(t.target.value) / NANO_STC)
        const value = formatValue(t.target.value) / NANO_STC;
        if (STC_USD && CNY_USD && BTC_USD && ETH_USD && STAR_USD) {
            const worthUSD =  value/STC_USD
            setUSDT(worthUSD)
            setCny(worthUSD * CNY_USD)
            setBtc(worthUSD * BTC_USD)
            setEth(worthUSD * ETH_USD)
            setStar(worthUSD * STAR_USD)
        }
    }


    const handleChangeBtc = (t: any) => {
        const value = formatValue(t.target.value);
        setBtc(value)
        if (STC_USD && CNY_USD && BTC_USD && ETH_USD && STAR_USD) {
            const worthUSD = value / BTC_USD
            setUSDT(worthUSD)
            setCny(worthUSD * CNY_USD)
            setStc(worthUSD * STC_USD)
            setNanoStc(worthUSD * STC_USD * NANO_STC)
            setEth(worthUSD * ETH_USD)
            setStar(worthUSD * STAR_USD)
        }
    }


    const handleChangeEth = (t: any) => {
        const value = formatValue(t.target.value);
        setEth(value)
        if (STC_USD && CNY_USD && BTC_USD && ETH_USD && STAR_USD) {
            const worthUSD = value / ETH_USD
            setUSDT(worthUSD)
            setBtc(worthUSD * BTC_USD)
            setCny(worthUSD * CNY_USD)
            setStc(worthUSD * STC_USD)
            setNanoStc(worthUSD * STC_USD * NANO_STC)
            setStar(worthUSD * STAR_USD)
        }
    }




    const handleChangeCny = (t: any) => {
        const value = formatValue(t.target.value);
        setCny(value)

        if (STC_USD && CNY_USD && BTC_USD && ETH_USD && STAR_USD) {
            const worthUSD = value / CNY_USD
            setUSDT(worthUSD)
            setStc(worthUSD * STC_USD)
            setBtc(worthUSD * BTC_USD)
            setNanoStc(worthUSD * BTC_USD * NANO_STC)
            setEth(worthUSD * ETH_USD)
            setStar(worthUSD * STAR_USD)
        }
    }

    const handleChangeStar = (t: any) => {
        const value = formatValue(t.target.value);
        setStar(value)

        if (STC_USD && CNY_USD && BTC_USD && ETH_USD && STAR_USD) {
            const worthUSD = value / STAR_USD
            setUSDT(worthUSD)
            setCny(worthUSD * CNY_USD)
            setStc(worthUSD * STC_USD)
            setBtc(worthUSD * BTC_USD)
            setNanoStc(worthUSD * BTC_USD * NANO_STC)
            setEth(worthUSD * ETH_USD)
            setStar(worthUSD * STAR_USD)
        }
    }




    //


    return <>
        <FormControl fullWidth sx={{m: 1}} variant="standard">
            <TextField
                value={usdt}
                onChange={handleChangeUsdt}
                label="USDT"
            />
        </FormControl>

        <FormControl fullWidth sx={{m: 1}} variant="standard">
            <TextField
                value={cny}
                onChange={handleChangeCny}
                label="CNY"
            />
        </FormControl>


        <FormControl fullWidth sx={{m: 1}} variant="standard">
            <TextField
                value={stc}
                onChange={handleChangeStc}
                label="STC"
            />
        </FormControl>


        <FormControl fullWidth sx={{m: 1}} variant="standard">
            <TextField
                value={nanoStc}
                onChange={handleChangeNanoStc}
                label="nanoStc"
            />
        </FormControl>


        <FormControl fullWidth sx={{m: 1}} variant="standard">
            <TextField
                value={star}
                onChange={handleChangeStar}
                label="Star"
            />
        </FormControl>


        <FormControl fullWidth sx={{m: 1}} variant="standard">
            <TextField
                value={btc}
                onChange={handleChangeBtc}
                label="BTC"
            />
        </FormControl>

        <FormControl fullWidth sx={{m: 1}} variant="standard">
            <TextField
                value={eth}
                onChange={handleChangeEth}
                label="ETH"
            />
        </FormControl>


    </>
}