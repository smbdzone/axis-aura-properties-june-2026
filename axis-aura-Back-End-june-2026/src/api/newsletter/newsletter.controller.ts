import { Request, Response } from 'express';
import EmailModel from '../../models/email.model';
import { getMailFrom, getTransporter } from '../../services/mailer';
import { buildPageMeta, getPagination, MAX_UNPAGINATED } from '../../utils/pagination';

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

    // Best-effort email notifications; never block the subscription on mail failures.
    try {
      const transporter = getTransporter();
      if (transporter) {
        const mailFrom = getMailFrom();

        const senderMailPromise = transporter.sendMail({
          from: mailFrom,
          to: email,
          subject: 'Newsletter subscription confirmed - Suits and Sand',
          text: `Hi,

Thanks for subscribing to the Suits and Sand newsletter.

You will receive the latest updates on listings, insights, and company news.

Best regards,
Suits and Sand`,
        });

        const receiverMailPromise = transporter.sendMail({
          from: mailFrom,
          to: process.env.EMAIL_TO || mailFrom,
          subject: 'New Newsletter Subscription',
          text: `A new user subscribed to the newsletter.

Subscriber email: ${email}`,
        });

        await Promise.all([senderMailPromise, receiverMailPromise]);
      }
    } catch (mailError) {
      console.error('Newsletter email notification failed:', mailError);
    }

    res.status(201).json({ message: 'Subscribed successfully', subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getNewsletterSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = getPagination(req);
    const query = EmailModel.find({}, { email: 1, date: 1 }).sort({ date: -1 }).lean();

    type SubscriberDoc = { _id: unknown; email: string; date: Date | string };
    const format = (sub: SubscriberDoc) => ({
      id: String(sub._id),
      email: sub.email,
      date: new Date(sub.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    });

    if (!pagination.paginated) {
      const subscribers = (await query.limit(MAX_UNPAGINATED)) as unknown as SubscriberDoc[];
      res.status(200).json(subscribers.map(format));
      return;
    }

    const [subscribers, total] = await Promise.all([
      query.skip(pagination.skip).limit(pagination.limit) as unknown as Promise<SubscriberDoc[]>,
      EmailModel.countDocuments(),
    ]);
    res.status(200).json({ data: subscribers.map(format), pagination: buildPageMeta(total, pagination) });
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