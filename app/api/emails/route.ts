import { Resend } from "resend";
import WelcomeTemplate from '@/emails'
import {render} from '@react-email/render'
import Welcome, { WelcomeEmail } from "@/emails/Welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request, res: Response) {
    const { email, patient, doctor, date } = await request.json()
    const fromEmail = process.env.FROM_EMAIL!;
    
    await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Appointment Confirmation!',
        react: WelcomeEmail({patient, doctor, date})
    })


    return Response.json({message: 'Email sent successfully!!!'})
}