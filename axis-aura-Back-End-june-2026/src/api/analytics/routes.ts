// backend/routes/analytics.ts

import express from 'express';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const keyPath = path.join(__dirname, '..', 'analytics-credentials.json');
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

if (fs.existsSync(keyPath)) {
  const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
  analyticsDataClient = new BetaAnalyticsDataClient({ credentials });
} else {
  console.warn(`Analytics disabled: credentials file not found at ${keyPath}`);
}

router.get('/analytics', async (req, res) => {
  if (!analyticsDataClient) {
    res.status(503).json({
      error: 'Analytics is not configured on this environment',
    });
    return;
  }

  try {
    const [response] = await analyticsDataClient.runReport({
      property: 'properties/YOUR_GA4_495390133', // 🔁 Replace with your ID
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const formatted = response.rows?.map(row => ({
      name: row.dimensionValues?.[0].value,
      value: parseFloat(row.metricValues?.[0].value || '0'),
    })) || [];

    res.json({ data: formatted });
  } catch (error) {
    console.error('GA Error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
