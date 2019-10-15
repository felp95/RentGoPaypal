const paypal = require('paypal-rest-sdk');
const axios = require('axios')
const qs = require('qs')

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AfPNQ1vJBY5ApfIBeS776NHjErcWozrZK43qIsmr8mAwC8a-ltpmYbP3nePxi-IpXGlqa5Kf1McMtLaR',
    'client_secret': 'EDUmxcQPp1PcxLDzRrR81PuoqXi3c-7LalRvbgrHGfbaQGLusChy4VUE4QzkRVnb6FN2_UtZO0_LQ_LX'
});

class PaymentController {

    async index(req, res) {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

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


        const response = await axios(options)


        const paymentPaypal = await axios({
            url: `https://api.sandbox.paypal.com/v1/payments/payment/${payerId}`,
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${response.data.access_token}`
            }
        })

        console.log('asçihsalsihf', paymentPaypal)

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "BRL",
                    "total": "25.00"
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                res.send('Success');
            }
        });
    }

    async show(req, res) {

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

        try {

            axios(options)
                .then((response) => {
                    return res.json({
                        token: response.data.access_token
                    })
                }).catch((err) => {
                    console.log(err);
                });

        } catch (error) {
            console.log(error)
        }
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

module.exports = new PaymentController()