import type { Project } from '../data/mockProjects';
import mlInsights from '../data/ml_insights.json';

export interface RiskFactor {
  label: string;
  points: number;
}

export function computeRisk(
  project: Project,
  allProjects: Project[]
): { score: number; factors: RiskFactor[] } {
  const factors: RiskFactor[] = [];
  const today = new Date();
  
  // 🧠 ML Isolation Forest Model Insights
  const mlData = (mlInsights as Record<string, any>)[project.id];
  if (mlData && mlData.is_anomaly) {
    if (mlData.ai_insights.length > 0) {
      mlData.ai_insights.forEach((insight: string) => {
        factors.push({
          label: `🧠 ${insight}`,
          points: Math.max(25, Math.round(mlData.ml_risk_score / mlData.ai_insights.length)),
        });
      });
    } else {
      factors.push({
        label: `🧠 ML Model detected statistical anomaly (Risk: ${mlData.ml_risk_score}%)`,
        points: mlData.ml_risk_score,
      });
    }
  } else if (mlData && mlData.ml_risk_score > 40) {
     factors.push({
        label: `🧠 ML Model predicts elevated outlier risk`,
        points: Math.round(mlData.ml_risk_score / 2)
     });
  }
  
  // Cost Outlier
  const schemeProjects = allProjects.filter((p) => p.scheme === project.scheme);
  if (schemeProjects.length > 0) {
    const avgBudget =
      schemeProjects.reduce((sum, p) => sum + p.budget, 0) / schemeProjects.length;
    if (avgBudget > 0) {
      const percentAbove = ((project.budget - avgBudget) / avgBudget) * 100;
      if (percentAbove > 40) {
        // scale points with how far above, cap at 30
        const points = Math.min(30, Math.floor(percentAbove - 40));
        factors.push({
          label: `Cost ${Math.round(percentAbove)}% above ${project.scheme} average`,
          points: Math.max(1, points),
        });
      }
    }
  }

  // Round Figure Amount
  if (project.budget > 0 && project.budget % 10000000 === 0) {
    factors.push({
      label: 'Round-figure sanction amount, no itemized breakdown',
      points: 10,
    });
  }

  // Fund Utilization Mismatch
  const startTime = new Date(project.startDate).getTime();
  const endTime = new Date(project.endDate).getTime();
  const todayTime = today.getTime();
  
  let expectedProgress = 0;
  if (endTime > startTime) {
    expectedProgress = (todayTime - startTime) / (endTime - startTime);
    expectedProgress = Math.max(0, Math.min(1, expectedProgress));
  } else if (todayTime >= startTime) {
    expectedProgress = 1;
  }
  
  const actualProgress = project.budget > 0 ? project.spent / project.budget : 0;
  
  if (actualProgress > expectedProgress + 0.25) {
    factors.push({
      label: `Fund utilization (${Math.round(actualProgress * 100)}%) outpaces physical timeline (${Math.round(expectedProgress * 100)}%)`,
      points: 25,
    });
  }

  // Vendor Concentration
  const vendorCount = allProjects.filter(
    (p) => p.contractor === project.contractor && p.state === project.state
  ).length;
  if (vendorCount >= 3) {
    const points = vendorCount === 3 ? 15 : vendorCount === 4 ? 20 : 25;
    factors.push({
      label: `Contractor awarded ${vendorCount} works in ${project.state}`,
      points,
    });
  }

  // Excessive Delay
  if (todayTime > endTime && project.status !== 'Completed') {
    const daysOverdue = Math.floor((todayTime - endTime) / (1000 * 60 * 60 * 24));
    if (daysOverdue > 0) {
      factors.push({
        label: `Project overdue by ${daysOverdue} days with no closure`,
        points: Math.min(20, daysOverdue), // scale by days overdue, cap 20
      });
    }
  }

  // Inactive with High Spend
  if (
    actualProgress > 0.7 &&
    (project.status === 'Delayed' || project.status === 'Registered')
  ) {
    factors.push({
      label: `High fund disbursement (${Math.round(actualProgress * 100)}%) despite stalled status`,
      points: 20,
    });
  }

  // Flagged Status
  if (project.status === 'Flagged') {
    factors.push({
      label: 'Manually flagged for review',
      points: 15,
    });
  }

  // Rapid Completion
  if (project.status === 'Completed') {
    const durationDays = Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24));
    if (durationDays < 90) {
      factors.push({
        label: `Completed in ${durationDays} days — unusually fast for project scale`,
        points: 15,
      });
    }
  }

  // Sort descending by points
  factors.sort((a, b) => b.points - a.points);

  const rawScore = factors.reduce((sum, f) => sum + f.points, 0);
  const score = Math.min(100, rawScore);

  return { score, factors };
}
