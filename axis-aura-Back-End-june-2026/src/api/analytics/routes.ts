// backend/routes/analytics.ts

import express from 'express';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';
import fs from 'fs';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * Credentials come from GOOGLE_ANALYTICS_CREDENTIALS (raw JSON, preferred for
 * containers/serverless where there is no writable disk) or from a file path in
 * GOOGLE_ANALYTICS_CREDENTIALS_PATH. The old hardcoded path is kept as the last
 * fallback so existing deployments keep working.
 */
const GA_PROPERTY_ID = process.env.GA4_PROPERTY_ID;

function loadCredentials(): Record<string, unknown> | null {
  const inline = process.env.GOOGLE_ANALYTICS_CREDENTIALS;
  if (inline) {
    try {
      return JSON.parse(inline);
    } catch {
      console.error('GOOGLE_ANALYTICS_CREDENTIALS is not valid JSON — analytics disabled.');
      return null;
    }
  }

  const keyPath =
    process.env.GOOGLE_ANALYTICS_CREDENTIALS_PATH ||
    path.join(__dirname, '..', 'analytics-credentials.json');

  if (!fs.existsSync(keyPath)) {
    console.warn(`Analytics disabled: credentials not found at ${keyPath}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
  } catch {
    console.error(`Analytics disabled: could not parse credentials at ${keyPath}`);
    return null;
  }
}

const credentials = loadCredentials();
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

if (credentials && GA_PROPERTY_ID) {
  analyticsDataClient = new BetaAnalyticsDataClient({ credentials });
} else if (credentials && !GA_PROPERTY_ID) {
  console.warn('Analytics disabled: GA4_PROPERTY_ID is not set.');
}

// Dashboard-only data — requires a valid session with dashboard view access.
router.get('/analytics', authenticate, requirePermission('dashboard'), async (req, res) => {
  if (!analyticsDataClient) {
    res.status(503).json({
      error: 'Analytics is not configured on this environment',
    });
    return;
  }

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
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
