const axios = require('axios');
const router = require('express').Router();
const {StatusCodes}=require("http-status-codes");

require('dotenv').config();


const initiateUrl = 'https://a.khalti.com/api/v2/epayment/initiate/';
const verificationUrl = 'https://a.khalti.com/api/v2/epayment/lookup/';
const Khalti_key = process.env.KhaltiAuth_KEY;
const authorizationKey = Khalti_key; // Replace with your actual authorization key


router.post('/initiate-payment',
    // clientauthentication,
    async (req, res) => {
        try {
            const initiatePayload = req.body;
            const initiateResponse = await axios.post(initiateUrl, initiatePayload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${authorizationKey}`
                }
            });
            if (initiateResponse.data.pidx) {
                return res.status(StatusCodes.OK).json(initiateResponse.data.payment_url);
            } else {
                res.json({ message: 'Payment initiation failed' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

router.get('/success', async (req, res) => {
    const pidx = req.query.pidx;

    try {
        const verificationResponse = await axios.post(
            verificationUrl,
            { pidx },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${authorizationKey}`
                }
            }
        );

        if (verificationResponse.data.status === 'Completed') {

            res.json({
                message: 'Payment verification completed',
                verificationResponse: verificationResponse.data
            });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;