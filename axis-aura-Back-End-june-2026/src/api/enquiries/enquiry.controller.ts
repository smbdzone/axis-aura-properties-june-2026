import { Request, Response } from 'express';
import EnquiryModel from '../../models/enquire.model';
import { getMailFrom, getTransporter } from '../../services/mailer';
import { buildPageMeta, getPagination, MAX_UNPAGINATED } from '../../utils/pagination';

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
      const transporter = getTransporter();
      if (transporter) {
        const mailFrom = getMailFrom();

        // 1) Confirmation email to the user
        const userMailPromise = transporter.sendMail({
          from: mailFrom,
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
          from: mailFrom,
          to: process.env.EMAIL_TO || mailFrom,
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
    const pagination = getPagination(req);
    const query = EnquiryModel.find().sort({ createdAt: -1 });

    if (!pagination.paginated) {
      res.json(await query.limit(MAX_UNPAGINATED));
      return;
    }

    const [enquiries, total] = await Promise.all([
      query.skip(pagination.skip).limit(pagination.limit),
      EnquiryModel.countDocuments(),
    ]);
    res.json({ data: enquiries, pagination: buildPageMeta(total, pagination) });
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
