import {useState} from 'react';
import {NavLink, useNavigation} from 'react-router';

interface FooterProps {
  footer?: any;
  header?: any;
  publicStoreDomain?: string;
}

export function Footer({
  footer,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Email Subscription Section */}
        <div className="footer-email-section">
          <h3 className="footer-email-title">Join our email list</h3>
          <p className="footer-email-description">Get exclusive deals and early access to new products.</p>
          <EmailSubscriptionForm />
        </div>

        {/* Copyright and Legal Links Section */}
        <div className="footer-legal-section">
          <p className="footer-copyright">
            © 2025 Foreign X-Change, Powered by{' '}
            <a href="https://shopify.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              Shopify
            </a>{' '}
            <NavLink to="/policies" className="footer-link">
              Terms and Policies
            </NavLink>
          </p>
        </div>
      </div>
    </footer>
  );
}


function EmailSubscriptionForm() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const handleSubmit = (e: React.FormEvent) => {
    // For now, just prevent default and show success
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="footer-email-form">
      <div className="footer-email-input-container">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="footer-email-input"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="footer-email-submit"
        >
          →
        </button>
      </div>
    </form>
  );
}

