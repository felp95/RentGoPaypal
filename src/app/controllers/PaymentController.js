const paypal = require('paypal-rest-sdk');
var request = require("request");

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AfPNQ1vJBY5ApfIBeS776NHjErcWozrZK43qIsmr8mAwC8a-ltpmYbP3nePxi-IpXGlqa5Kf1McMtLaR',
    'client_secret': 'EDUmxcQPp1PcxLDzRrR81PuoqXi3c-7LalRvbgrHGfbaQGLusChy4VUE4QzkRVnb6FN2_UtZO0_LQ_LX'
});

class PaymentController {

    async index(req, res) {

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        let tokenInformation = await GetToken();
        let token = JSON.parse(tokenInformation);

        let paymentInformation = await ListProductByPayId(paymentId, token.access_token);
        var objectValue = JSON.parse(paymentInformation);

        let execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": objectValue.transactions[0].amount.currency,
                    "total": objectValue.transactions[0].amount.total
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(payment)
                res.render('payment');
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
                    console.log(payment)
                    return res.json(payment);
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
}

const GetToken = async () =>  {
    var options = { 
        method: 'POST',
        url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
        headers: {   
            Host: 'api.sandbox.paypal.com',
            Authorization: 'Basic QWZQTlExdkpCWTVBcGZJQmVTNzc2TkhqRXJjV296clpLNDNxSXNtcjhtQXdDOGEtbHRwbVliUDNuZVB4aS1JcFhHbHFhNUtmMU1jTXRMYVI6RURVbXhjUVBwMVBjeExEelJyUjgxUHVvcVhpM2MtN0xhbFJ2YmdySEdmYmFRR0x1c0NoeTRWVUU0UXprUlZuYjZGTjJfVXRaTzBfTFFfTFg=',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Language': 'en_US',
            Accept: 'application/json' 
        },
        form: { 
            grant_type: 'client_credentials' 
        } 
    };

    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            return resolve(body);
        });
    });
}

const ListProductByPayId = async (paymentId, token) => {
    var options = { method: 'GET',
      url: `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}`,
      headers: 
       { Connection: 'keep-alive',
         'Accept-Encoding': 'gzip, deflate',
         Host: 'api.sandbox.paypal.com',
         Accept: '*/*',
         Authorization: `Bearer ${token}`} 
        };
        
        return new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                return resolve(body);
            });
        });
}

module.exports = new PaymentController();