const Mailchimp = require('mailchimp-api-v3');
const keys = require('../config/keys');

const { key, listKey } = keys.mailchimp;

class MailchimpService {
  constructor() {
    try {
      this.mailchimp = new Mailchimp(key);
    } catch (error) {
      console.warn('Missing mailchimp keys');
    }
  }

  async subscribeToNewsletter(email) {
    try {
      return await this.mailchimp.post(`lists/${listKey}/members`, {
        email_address: email,
        status: 'subscribed'
      });
    } catch (error) {
      return error;
    }
  }
}

const mailchimpService = new MailchimpService();

exports.subscribeToNewsletter = async email => {
  try {
    return await mailchimpService.subscribeToNewsletter(email);
  } catch (error) {
    return error;
  }
};

exports.sendEmail = async (email, type, host, data) => {
  try {
    const message = prepareTemplate(type, host, data);

    const config = {
      from: `MERN Store! <${sender}>`,
      to: email,
      subject: message.subject,
      text: message.text
    };

    return await mailgun.messages().send(config);
  } catch (error) {
    return error;
  }
};

const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case 'reset':
      message = template.resetEmail(host, data);
      break;

    case 'reset-confirmation':
      message = template.confirmResetPasswordEmail();
      break;

    case 'signup':
      message = template.signupEmail(data);
      break;

    case 'merchant-signup':
      message = template.merchantSignup(host, data);
      break;

    case 'merchant-welcome':
      message = template.merchantWelcome(data);
      break;

    case 'newsletter-subscription':
      message = template.newsletterSubscriptionEmail();
      break;

    case 'contact':
      message = template.contactEmail();
      break;

    case 'merchant-application':
      message = template.merchantApplicationEmail();
      break;

    case 'merchant-deactivate-account':
      message = template.merchantDeactivateAccount();
      break;

    case 'order-confirmation':
      message = template.orderConfirmationEmail(data);
      break;

    default:
      message = '';
  }

  return message;
};
