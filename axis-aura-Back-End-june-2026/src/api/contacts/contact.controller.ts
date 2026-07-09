import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import ContactModel from '../../models/contact.model';

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
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const userMailPromise = transporter.sendMail({
          from: process.env.EMAIL_USER,
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
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
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

export const getAllContacts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await ContactModel.find().sort({ date: -1 });
    res.json(contacts);
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
