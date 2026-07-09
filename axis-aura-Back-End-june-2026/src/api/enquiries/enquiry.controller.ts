import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import EnquiryModel from '../../models/enquire.model';

const enquiryBudgets = ['500k - 1M', '1M - 2M', '2M - 4M', '4M+'];
const enquiryTypes = ['Residential', 'Commercial'];

export const submitEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phone, email, budget, type } = req.body;

    // Validate required fields
    if (!firstName || !phone || !email || !budget || !type) {
      res.status(400).json({ message: 'Please provide all required fields.' });
      return;
    }

    const newEnquiry = new EnquiryModel({
      firstName,
      lastName,
      phone,
      email,
      budget,
      type,
    });

    await newEnquiry.save();

    const fullName = `${firstName}${lastName ? ` ${lastName}` : ''}`;

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

        // 1) Confirmation email to the user
        const userMailPromise = transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'We have received your enquiry - AXIS AURA',
          text: `Hi ${firstName},

Thank you for contacting AXIS AURA. We have received your enquiry and our team will contact you shortly.

Your submitted details:
- Name: ${fullName}
- Phone: ${phone}
- Email: ${email}
- Budget: ${budget}
- Type: ${type}

Best regards,
AXIS AURA`,
        });

        // 2) Notification email to admin with enquiry details
        const adminMailPromise = transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `New Enquiry Received: ${fullName}`,
          text: `A new enquiry has been submitted.

Name: ${fullName}
Phone: ${phone}
Email: ${email}
Budget: ${budget}
Type: ${type}`,
        });

        await Promise.all([userMailPromise, adminMailPromise]);
      }
    } catch (mailError) {
      console.error('Enquiry email notification failed:', mailError);
    }

    res.status(201).json(newEnquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const enquiries = await EnquiryModel.find();
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await EnquiryModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Enquiry not found' });
      return;
    }
    res.status(200).json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkDeleteEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (!ids.length) {
      res.status(400).json({ message: 'No enquiry ids provided' });
      return;
    }
    await EnquiryModel.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Enquiries deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEnquiryOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      budgets: enquiryBudgets,
      types: enquiryTypes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
