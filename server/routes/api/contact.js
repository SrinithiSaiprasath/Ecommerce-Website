const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const Contact = require('../../models/contact');
const mailchimp = require('../../services/mailchimp');

router.post('/add', async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email address.' });
    }

    if (!name || !message) {
      return res
        .status(400)
        .json({ error: 'You must enter name and message.' });
    }

    const existingContact = await Contact.findOne({ email });

    if (existingContact) {
      return res
        .status(400)
        .json({ error: 'A request already exists for the same email address' });
    }

    const contact = new Contact({ name, email, message });
    const contactDoc = await contact.save();

    // Send email using Mailchimp
    await mailchimp.sendContactEmail(email);

    res.status(200).json({
      success: true,
      message: `We received your message. We will reach you at ${email}!`,
      contact: contactDoc
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
