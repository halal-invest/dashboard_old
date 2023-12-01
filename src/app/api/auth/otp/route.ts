import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../utils/constants';
import axios from 'axios';
const MAX_AGE = 60 * 60 * 24 *30;
export const POST = async (request: Request) => {
    const { phone } = await request.json();
    try {
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
