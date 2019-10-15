const paypal = require('paypal-rest-sdk');
const axios = require('axios')
const qs = require('qs')

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AfPNQ1vJBY5ApfIBeS776NHjErcWozrZK43qIsmr8mAwC8a-ltpmYbP3nePxi-IpXGlqa5Kf1McMtLaR',
    'client_secret': 'EDUmxcQPp1PcxLDzRrR81PuoqXi3c-7LalRvbgrHGfbaQGLusChy4VUE4QzkRVnb6FN2_UtZO0_LQ_LX'
});

class PaymentController {

    async index(req, res) {

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        GetToken().then((response) => {
            //doidera(payerId, response.data.access_token);
        });

        let paymentInformation = await ListProductByPayId();

        var objectValue = JSON.parse(paymentInformation);
        console.log(objectValue.transactions);

        let execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "BRL",
                    "total": "25.00"
                }
            }]
        };

        paypal.payment.execute(paymentId, paymentInformation, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                res.send('Success');
            }
        });
    }

    async store(req, res) {
        try {
            const create_payment_json = req.body

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    return res.json(payment);
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
}

const GetToken = async () =>  {
    const url = "https://api.sandbox.paypal.com/v1/oauth2/token";

    const data = {
        grant_type: 'client_credentials'
    };

    const auth = {
        username: 'AfPNQ1vJBY5ApfIBeS776NHjErcWozrZK43qIsmr8mAwC8a-ltpmYbP3nePxi-IpXGlqa5Kf1McMtLaR',
        password: 'EDUmxcQPp1PcxLDzRrR81PuoqXi3c-7LalRvbgrHGfbaQGLusChy4VUE4QzkRVnb6FN2_UtZO0_LQ_LX'
    };

    const options = {
        method: 'post',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Credentials': true
        },
        data: qs.stringify(data),
        auth: auth,
        url,
    };

     return await axios(options)
}

const ListProductByPayId = async (payId, token) => {

    
    var request = require("request");

    var options = { method: 'GET',
      url: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-LWSQGVI3MX64531ER789714H',
      headers: 
       { Connection: 'keep-alive',
         'Accept-Encoding': 'gzip, deflate',
         Host: 'api.sandbox.paypal.com',
         Accept: '*/*',
         Authorization: 'Bearer A21AAGGHOEmvFEaUuAr8WipSp3C52w1cXHUSDbCoLih9NV_3U-KeWWviIjZZjQnNbmu7uBozfe4no-8R9EEX0hDp25sqqD6GA' } 
        };
        
        return new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                return resolve(body);
            });
        });
}

module.exports = new PaymentController();