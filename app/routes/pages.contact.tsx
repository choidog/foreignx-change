import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {type ActionFunctionArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useActionData, useLoaderData, Form, useNavigation} from 'react-router';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Foreign X-Change | Contact'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const {name, email, subject, message} = Object.fromEntries(formData);

  // Here you would typically send the email using a service like:
  // - Shopify's built-in contact form
  // - A third-party service like SendGrid, Mailgun, etc.
  // - Your own email service

  // For now, we'll simulate processing
  console.log('Contact form submission:', {name, email, subject, message});

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    message: 'Thank you for your message! We\'ll get back to you soon.'
  };
}

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact</h1>
        </div>

        <div className="contact-content">
          <div className="contact-form-section">
            <h3>Send us a Message</h3>
            <Form method="post" className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {actionData?.success && (
                <div className="success-message">
                  {actionData.message}
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
