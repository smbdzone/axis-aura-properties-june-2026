import { Request, Response } from 'express';
import { Faq } from '../../models/faq.model';

export const getFaqs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await Faq.find().sort({ createdAt: 1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error in getFaqs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      res.status(400).json({ message: 'Question and answer are required.' });
      return;
    }

    const faq = await Faq.create({
      question,
      answer,
      category: category?.trim() || 'General',
    });
    res.status(201).json(faq);
  } catch (error) {
    console.error('Error in createFaq:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createFaqsBulk = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Request body must be a non-empty array.' });
      return;
    }

    const invalidIndex = items.findIndex(
      (item) =>
        !item ||
        typeof item.question !== 'string' ||
        !item.question.trim() ||
        typeof item.answer !== 'string' ||
        !item.answer.trim()
    );

    if (invalidIndex !== -1) {
      res.status(400).json({
        message: `Invalid FAQ item at index ${invalidIndex}. Each item needs question and answer.`,
      });
      return;
    }

    const payload = items.map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
      category:
        typeof item.category === 'string' && item.category.trim()
          ? item.category.trim()
          : 'General',
    }));

    const createdFaqs = await Faq.insertMany(payload);
    res.status(201).json({
      message: `${createdFaqs.length} FAQs created successfully.`,
      data: createdFaqs,
    });
  } catch (error) {
    console.error('Error in createFaqsBulk:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { question, answer, category } = req.body;

    const updateData: Record<string, string> = { question, answer };
    if (typeof category === 'string') {
      updateData.category = category.trim() || 'General';
    }

    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedFaq) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }

    res.json(updatedFaq);
  } catch (error) {
    console.error('Error in updateFaq:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedFaq = await Faq.findByIdAndDelete(id);

    if (!deletedFaq) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }

    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFaq:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
