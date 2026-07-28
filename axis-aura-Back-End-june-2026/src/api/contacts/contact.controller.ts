import { Request, Response } from 'express';
import ContactModel from '../../models/contact.model';
import { getMailFrom, getTransporter } from '../../services/mailer';
import { buildPageMeta, getPagination, MAX_UNPAGINATED } from '../../utils/pagination';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !message) {
      res.status(400).json({ message: 'Please provide your name, email, and message.' });
      return;
    }

    const newContact = new ContactModel({
      fullName,
      email,
      phone,
      subject,
      message,
    });

    await newContact.save();

    // Best-effort email notifications; never block the submission on email failures
    try {
      const transporter = getTransporter();
      if (transporter) {
        const mailFrom = getMailFrom();

        const userMailPromise = transporter.sendMail({
          from: mailFrom,
          to: email,
          subject: 'We have received your message - AXIS AURA',
          text: `Hi ${fullName},

Thank you for reaching out to AXIS AURA. We have received your message and our team will get back to you shortly.

Your message:
${message}

Best regards,
AXIS AURA`,
        });

        const adminMailPromise = transporter.sendMail({
          from: mailFrom,
          to: process.env.EMAIL_TO || mailFrom,
          subject: `New Contact Message: ${fullName}`,
          text: `A new contact message has been submitted.

Name: ${fullName}
Email: ${email}
Phone: ${phone || '-'}
Subject: ${subject || '-'}
Message: ${message}`,
        });

        await Promise.all([userMailPromise, adminMailPromise]);
      }
    } catch (mailError) {
      console.error('Contact email notification failed:', mailError);
    }

    res.status(201).json({ message: 'Message sent successfully', contact: newContact });
  } catch (error) {
    console.error('Submit Contact Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = getPagination(req);
    const query = ContactModel.find().sort({ date: -1 });

    if (!pagination.paginated) {
      res.json(await query.limit(MAX_UNPAGINATED));
      return;
    }

    const [contacts, total] = await Promise.all([
      query.skip(pagination.skip).limit(pagination.limit),
      ContactModel.countDocuments(),
    ]);
    res.json({ data: contacts, pagination: buildPageMeta(total, pagination) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ContactModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Contact message not found' });
      return;
    }
    res.status(200).json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkDeleteContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (!ids.length) {
      res.status(400).json({ message: 'No contact ids provided' });
      return;
    }
    await ContactModel.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Contact messages deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
