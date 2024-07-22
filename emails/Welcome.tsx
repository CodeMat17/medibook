import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import dayjs from "dayjs";

type Props = {
    patient: string;
    doctor: string;
    date: string;
};

export const WelcomeEmail = ({ patient, doctor, date }: Props) => (
  <Html>
    <Head />
    <Preview>Medibook clinic appointment confirmation email template</Preview>
    <Body style={main}>
      <Container style={container}>
        <h1 className='text-sky-500 text-center'>MediBook Clinic</h1>

        {/* <Img
          src={`${baseUrl}/static/koala-logo.png`}
          width='170'
          height='50'
          alt='Koala'
          style={logo}
        /> */}
        <Text style={paragraph}>Hi {patient},</Text>
        <Text style={paragraph}>
          Welcome to MediBook Clinic, this is to notify you that your appointment
          request with {doctor} has been scheduled for {dayjs(date).format('MMM DD, YYYY | hh:mm A')}. Please do a calender reminder for the set date so you do not come
          late or miss your appointment.
        </Text>
        <br />

        {/* <Section style={btnContainer}>
          <Button style={button} href='https://getkoala.com'>
            Get started
          </Button>
        </Section> */}
        <Text style={paragraph}>
        Thank you.
          <br />
          Team Medibook
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
         Medibook clinic is an online appointment scheduler for demo purposes. Contact us if you like.
        </Text>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  patient: "Alan",
} as Props;

export default WelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
