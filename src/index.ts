import express, { Request, Response, Nextfunction } from 'express';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import bodyParser  from 'body-parser';
import NodeCache from 'node-cache';
import axios from 'axios';

dotenv.config();
const PORT = process.env.PORT
const app = express();
const localCache = new NodeCache()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/convert',
    body('amount')
        .isCurrency().withMessage('amount should be a currency value')
        .exists({checkFalsy:true}).withMessage('Missing value :amount'),
    body('fromCurrency')
        .isString().withMessage('fromCurrency should be a string value')
        .isLength({ min: 3 , max: 3}).withMessage('fromCurrecny should be 3 leters')
        .exists({checkFalsy:true}).withMessage('Missing value :fromCurrency"'),
    body('toCurrency')
        .isString().withMessage('toCurrency should be a string value')
        .isLength({ min: 3 , max: 3}).withMessage('fromCurrecny should be 3 leters')
        .exists({checkFalsy:true}).withMessage('Missing value :toCurrency'),

    async (req: Request, res: Response, next: Nextfunction) => {
        try{
            //checking if there are any error sin the request body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            let cacheData;
            const fromCurrency = req.body.fromCurrency;
            const toCurrency = req.body.toCurrency;
            const reqestedAmount = req.body.amount;
            const ttl = process.env.CACHE_TIME_TO_LIVE as string;
            const cacheKey = process.env.CACHE_KEY_NAME as string;

            //checking if cache availabe by its key name
            if(localCache.has(cacheKey)) {            
                cacheData = localCache.get(cacheKey)
            }
            else {
                const exchangeRates = await axios.get(`${process.env.CONVERTER_URL}?access_key=${process.env.ACCESS_KEY}`)
                cacheData = JSON.parse(JSON.stringify(exchangeRates.data)); 
                localCache.set(cacheKey,cacheData,ttl)
            }

            const fromCurrencyRate = cacheData.rates[fromCurrency]
            const toCurrencyRate = cacheData.rates[toCurrency]
            const amount = ((1/fromCurrencyRate)*toCurrencyRate)*reqestedAmount
            let result = {amount,currency:toCurrency};
            return res.send(result);
        }
        catch(error){
            console.error(
                `error occurred when converting: ${error}`,
            );
            next(error)
        }  
    });

app.listen(PORT, () => console.log(`Running on ${process.env.PORT} ⚡`));