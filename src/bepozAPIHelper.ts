import * as xml2js from 'xml-js';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { HmacSHA1 } from 'crypto-js';


// global axios setting
axios.interceptors.response.use(function (response):any{
    // Do something with response data
    if(response.headers.mac){
        let res = JSON.parse(xml2js.xml2json(response.data, {compact: true}));
        if(res.Header.ReqType._text === 'ERROR'){          
            throw res.Header.Data1._text;
        }
        res.Header.XMLData._text = JSON.parse(xml2js.xml2json(decodeURI(res.Header.XMLData._text), {compact: true}));
        return res;
    }
    return response;
}, function (error) {
    // console.log(error);
    // Do something with response error
    throw 'Error please try again later.';
});

export const xmlBody = {
    "_declaration": {
        "_attributes": {
            "version": "1.0",
            "encoding": "utf-8"
        }
    },
    "Header": {
        "ReqType": {
            "_text": 'SystemCheck'
        },
        "Data1": {
            "_text": ''
        },
        "Data2": {
            "_text": ''
        },
        "Data3": {
            "_text": ''
        },
        "Data4": {
            "_text": ''
        },
        "Data5": {
            "_text": ''
        },
        "Data6": {
            "_text": ''
        },
        "ClassName": {
            "_text": ''
        }
    }
};

export class Bepoz {

    private constructor(private url: string, private port: string, private mac: string) { }

    public static connect(url: string, port: string, mac: string) {
        // return a bepoz instance below
        return new this(url, port, mac);
    }

    public SystemCheck(): AxiosPromise {
        const resBody = Object.assign({}, xmlBody);
        // resBody.Header.ReqType._text = 'ProductsSearch';
        // resBody.Header.Data3._text = 'Cascade';


        const options = { compact: true, ignoreComment: true };
        const result = xml2js.js2xml(xmlBody, options);
        const hash = HmacSHA1(result, this.mac).toString();

        const config = {
            url: `${this.url}:${this.port}`,
            method: 'post',
            headers: { 'Content-Type': 'application/xml', 'mac': hash.toUpperCase() },
            data: result
        }

        return axios.request(config);
    }
}