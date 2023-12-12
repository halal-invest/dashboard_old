import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { IP_ADDRESS_URL, JWT_SECRET } from '../../../../utils/constants';
import axios from 'axios';
const MAX_AGE = 60 * 60 * 24 *30;

import { string, number, object } from 'yup';
import sanitize from 'sanitize-html';
import { get, set } from 'lodash';
import { NextApiRequest } from 'next';

const rateLimit = 3;
const rateLimiter: Record<string, number[]> = {}; // Use Record type to define rateLimiter as an object with string keys and number array values

const rateLimiterMiddleware = (ip: string): boolean => {
    const now = Date.now();
    const windowStart = now - 60 * 1000 * 5;
    const requestTimestamps = get(rateLimiter, ip, []).filter((timestamp: number) => timestamp > windowStart);
    requestTimestamps.push(now);

    set(rateLimiter, ip, requestTimestamps);

    return requestTimestamps.length <= rateLimit;
};
const schema = object().shape({
    phone: string().test(
        'len',
        'Phone number must be exactly 11 digits',
        val => String(val).length === 11
    ),
});
export const POST = async (request: Request, req: NextApiRequest) => {
    const { phone } = await request.json();
    try {
        const ipAddress = await axios(IP_ADDRESS_URL);
        const ip = ipAddress.data.userPrivateIpAddress;
        if (ip !== null) {
            if (!rateLimiterMiddleware(ip)) {
                return NextResponse.json({ message: 'Too Many Requests. Try agian after 5 minutes.' });
            }
        }
        const cleanInput = {
            phone: sanitize(phone)
        };
        await schema.validate(cleanInput);

            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            const jwtToken = jwt.sign({ phone,randomNumber }, JWT_SECRET, { expiresIn: MAX_AGE });
            const greenwebsms = new URLSearchParams();
            greenwebsms.append(
              "token",
              "94851718001686568680ec1c8ceb843a5a1f671b95cd2c01e5a9"
            );
            greenwebsms.append("to", phone);
            greenwebsms.append("message", `আপনার লগইন OTP: ${randomNumber}`);
            const response = await axios.post(
              "http://api.greenweb.com.bd/api.php",
              greenwebsms
            );
            if(response.data.includes('Ok')){
                return NextResponse.json({ message: 'sms sent',phone: phone,number:randomNumber, token:jwtToken, status: true });
            }else if(response.data.includes('Invalid')){
                return NextResponse.json({ message: 'Invalid Phone Number',phone: phone,status: false });
            }
            else{
                return NextResponse.json({ message: 'Something went wrong',phone: phone,status: false });
            }

    } catch (error) {
        return NextResponse.json({ message: error, status: 500, msg: 'catch error' });
    }
};
