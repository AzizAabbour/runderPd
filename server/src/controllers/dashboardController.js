import { getOverviewForUser } from '../services/jobStore.js';

export function getDashboardOverview(req, res) {
  const overview = getOverviewForUser(req.user.id);
  res.json({
    success: true,
    overview,
  });
}

