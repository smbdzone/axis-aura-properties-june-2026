import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import EmailModel from '../../models/email.model';

export const subscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Please provide an email.' });
      return;
    }

    // Check if email already subscribed
    const existingSubscription = await EmailModel.findOne({ email });
    if (existingSubscription) {
      res.status(400).json({ message: 'This email is already subscribed.' });
      return;
    }

    const newSubscription = new EmailModel({ email });
    await newSubscription.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const senderMailPromise = transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Newsletter subscription confirmed - Suits and Sand',
      text: `Hi,

Thanks for subscribing to the Suits and Sand newsletter.

You will receive the latest updates on listings, insights, and company news.

Best regards,
Suits and Sand`,
    });

    const receiverMailPromise = transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: 'New Newsletter Subscription',
      text: `A new user subscribed to the newsletter.

Subscriber email: ${email}`,
    });

    await Promise.all([senderMailPromise, receiverMailPromise]);

    res.status(201).json({ message: 'Subscribed successfully', subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getNewsletterSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscribers = await EmailModel.find({}, { email: 1, date: 1 }).lean();
    const formattedSubscribers = subscribers.map(sub => ({
      id: String(sub._id),
      email: sub.email,
      date: new Date(sub.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    }));

    res.status(200).json(formattedSubscribers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNewsletterSubscriber = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await EmailModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Subscriber not found' });
      return;
    }
    res.status(200).json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkDeleteNewsletterSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (!ids.length) {
      res.status(400).json({ message: 'No subscriber ids provided' });
      return;
    }

    await EmailModel.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Subscribers deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};