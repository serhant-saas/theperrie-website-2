import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { FC } from 'react';

import { RegisterFormSchema } from '@/lib/register-form-config';
import { cn } from '@/lib/utils';

interface EmailTemplateProps {
  formData?: RegisterFormSchema;
  subscriberId: string;
}

export const EmailTemplate: FC<EmailTemplateProps> = ({
  formData,
  subscriberId,
}: EmailTemplateProps) => {
  const firstName = formData?.first_name.toString();
  const lastName = formData?.last_name.toString();
  const email = formData?.email.toString();
  const phone = formData?.phone_number.toString();
  const currentLocation = formData?.current_location?.toString() || '-';
  const isBroker = formData?.is_broker.toString();
  const hasRepresentativeBroker =
    formData?.has_representative_broker?.toString() || '-';
  const contact = formData?.contact?.toString() || '-';
  const discovery = formData?.discovery?.toString() || '-';
  const preferredBudget = formData?.preferred_budget?.toString() || '-';

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const headline = `${firstName} just subscribed!`;

  return (
    <Html>
      <Head>
        <title>New Subscriber!</title>
      </Head>
      <Preview>{headline}</Preview>

      <Body
        style={{
          ...main,
        }}
      >
        <Container style={container}>
          <Section style={logo}>
            <Row>
              <Column style={{ verticalAlign: 'bottom' }}>
                <Section>
                  <Text style={heading}>{headline}</Text>
                </Section>
              </Column>
              <Column>
                <Img
                  src={`${baseURL}/logo-perrie.svg`}
                  alt='The Perrie logo'
                  width={71}
                  height={51}
                />
              </Column>
            </Row>
          </Section>

          <Row style={{ paddingBottom: '32px' }}>
            <Section>
              <Text style={informationTableSection}>Information</Text>
              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableHeader}>First Name</Text>
                  <Text style={informationTableHeader}>Last Name</Text>
                  <Text style={informationTableHeader}>Email</Text>
                  <Text style={informationTableHeader}>Phone Number</Text>
                  <Text style={informationTableHeader}>Current Location</Text>
                  <Text style={informationTableHeader}>Are you a broker?</Text>
                  <Text style={informationTableHeader}>
                    If no, are you working with a broker?
                  </Text>
                  <Text style={informationTableHeader}>
                    How would you like to be contacted?
                  </Text>
                  <Text style={informationTableHeader}>
                    How did you hear about us?
                  </Text>
                  <Text style={informationTableHeader}>Preferred Budget</Text>
                </Column>
                <Column>
                  <Text style={informationTableData}>{firstName}</Text>
                  <Text style={informationTableData}>{lastName}</Text>
                  <Text style={informationTableData}>{email}</Text>
                  <Text style={informationTableData}>{phone}</Text>
                  <Text style={informationTableData}>{currentLocation}</Text>
                  <Text style={informationTableData}>{isBroker}</Text>
                  <Text style={informationTableData}>
                    {hasRepresentativeBroker}
                  </Text>
                  <Text style={informationTableData}>{contact}</Text>
                  <Text style={informationTableData}>{discovery}</Text>
                  <Text style={informationTableData}>{preferredBudget}</Text>
                </Column>
              </Row>

              <Row>
                <Text style={mailchimpText}>Mailchimp Links:</Text>
              </Row>
              <Row style={{ width: '80%', margin: '0' }}>
                <Column>
                  <Section style={mailChimpLink}>
                    <Container>
                      <Row>
                        <Column>
                          <Link
                            href={`https://us14.admin.mailchimp.com/audience/contact-profile?contact_id=${subscriberId}`}
                            style={{ color: '#83626A', paddingRight: '10px' }}
                          >
                            View Subscriber
                          </Link>
                        </Column>
                      </Row>
                    </Container>
                  </Section>
                </Column>
                <Column>
                  <Section style={mailChimpLink}>
                    <Container>
                      <Row>
                        <Column>
                          <Link
                            href='https://us14.admin.mailchimp.com/audience/contacts'
                            style={{ color: '#83626A', paddingRight: '10px' }}
                          >
                            View Audience
                          </Link>
                        </Column>
                      </Row>
                    </Container>
                  </Section>
                </Column>
              </Row>
            </Section>
          </Row>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  padding: '48px 0',
};

const container = {
  margin: '48px auto',
  padding: '48px 48px',
  maxWidth: '570px',
  border: '1px solid #83626A',
  backgroundColor: '#fff',
};

const heading = {
  fontSize: '32px',
  color: '#83626A',
  marginBottom: '0',
};

const logo = {
  borderBottom: '1px solid #83626A',
  paddingBottom: '16px',
};

const informationTableSection = {
  color: '#83626A',
  fontSize: '16px',
  borderBottom: '1px solid #83626A',
  padding: '24px 0 8px 0',
};

const informationTableColumn = {
  width: '50%',
};
const informationTableHeader = {
  fontSize: '16px',
  lineHeight: '120%',
  fontWeight: '500',
  color: 'rgba(131, 98, 106, 0.40)',
  margin: '0 0 16px 0',
};

const informationTableData = {
  color: '#83626A',
  fontSize: '16px',
  lineHeight: '120%',
  margin: '0 0 16px 0',
  fontWeight: '500',
};

const mailchimpText = {
  fontSize: '16px',
  lineHeight: '120%',
  fontWeight: '500',
  color: 'rgba(131, 98, 106, 0.40)',
};

const mailChimpLink = {
  border: '1px solid #83626A',
  borderRadius: '28px',
  width: 'fit-content',
  padding: '7px 15px',
  margin: '0 15px 0 0',
  fontSize: '16px',
  fontWeight: '500',
};
