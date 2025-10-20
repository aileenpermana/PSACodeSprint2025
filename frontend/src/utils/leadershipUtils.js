// frontend/src/utils/leadershipUtils.js

/**
 * Get leadership score interpretation
 * @param {number} score - Leadership score (0-100)
 * @returns {object} Interpretation details
 */
export const getLeadershipInterpretation = (score) => {
  if (score >= 86) {
    return {
      label: 'Exceptional',
      color: '#4ade80',
      readiness: 'Ready for leadership now',
      timeline: '0-6 months',
      description: 'You demonstrate exceptional leadership qualities and are ready for immediate leadership opportunities.'
    };
  } else if (score >= 76) {
    return {
      label: 'Strong',
      color: '#60a5fa',
      readiness: 'Ready for stretch assignments',
      timeline: '6-12 months',
      description: 'You show strong leadership potential and should pursue stretch assignments to prepare for leadership roles.'
    };
  } else if (score >= 61) {
    return {
      label: 'Growing',
      color: '#fbbf24',
      readiness: 'Good potential, needs development',
      timeline: '12-18 months',
      description: 'You have good leadership potential. Focus on targeted development in key areas.'
    };
  } else if (score >= 41) {
    return {
      label: 'Emerging',
      color: '#fb923c',
      readiness: 'Building foundation',
      timeline: '18-24 months',
      description: 'You are building a solid foundation. Continue developing core competencies and gaining experience.'
    };
  } else {
    return {
      label: 'Developing',
      color: '#f87171',
      readiness: 'Focus on fundamentals',
      timeline: '24+ months',
      description: 'Focus on developing fundamental skills and building a strong performance track record.'
    };
  }
};

/**
 * Calculate leadership score percentile
 * @param {number} score - User's leadership score
 * @returns {number} Percentile rank
 */
export const calculatePercentile = (score) => {
  // Simplified percentile calculation
  // In production, this would compare against actual distribution
  if (score >= 90) return 95;
  if (score >= 80) return 85;
  if (score >= 70) return 70;
  if (score >= 60) return 55;
  if (score >= 50) return 40;
  if (score >= 40) return 25;
  return 10;
};

/**
 * Get score color based on value
 * @param {number} score - Score value (0-100)
 * @returns {string} Color code
 */
export const getScoreColor = (score) => {
  if (score >= 86) return '#4ade80'; // Green
  if (score >= 76) return '#60a5fa'; // Blue
  if (score >= 61) return '#fbbf24'; // Yellow
  if (score >= 41) return '#fb923c'; // Orange
  return '#f87171'; // Red
};

/**
 * Normalize leadership data format
 * THIS IS THE CRITICAL FIX FOR THE CACHING ISSUE!
 * Handles both database format and calculated format
 * @param {object} data - Leadership data in any format
 * @returns {object} Normalized data structure
 */
export const normalizeLeadershipData = (data) => {
  if (!data) return null;

  // Check if data is already in the calculated format (has breakdown object)
  const hasBreakdown = data.breakdown && typeof data.breakdown === 'object';

  // Check if data has factors object (from database)
  const hasFactors = data.factors && typeof data.factors === 'object';

  return {
    // Overall score - try multiple possible locations
    overall_score: data.overall_score || data.prediction_score || 0,
    
    // Behavioral score - handle both formats
    behavioral_score: hasBreakdown 
      ? (data.breakdown.behavioral?.score || 0)
      : (data.behavioral_score || 0),
    
    // Performance score - handle both formats
    performance_score: hasBreakdown 
      ? (data.breakdown.performance?.score || 0)
      : (data.performance_score || 0),
    
    // Engagement score - handle both formats
    engagement_score: hasBreakdown 
      ? (data.breakdown.engagement?.score || 0)
      : (data.engagement_score || 0),

    // Interpretation text
    interpretation: hasBreakdown 
      ? data.interpretation 
      : (hasFactors ? data.factors.interpretation : ''),
    
    // Readiness assessment
    readiness: hasBreakdown 
      ? data.readiness 
      : (hasFactors ? data.factors.readiness : ''),
    
    // Timeline to leadership
    timeline: hasBreakdown 
      ? data.timeline 
      : (hasFactors ? data.factors.timeline : ''),
    
    // Key strengths
    strengths: hasBreakdown 
      ? data.strengths 
      : (hasFactors ? data.factors.strengths : []),
    
    // Development areas
    development_areas: hasBreakdown 
      ? data.development_areas 
      : (hasFactors ? data.factors.development_areas : []),
    
    // Recommendations
    recommendations: hasBreakdown 
      ? data.recommendations 
      : (hasFactors ? data.factors.recommendations : []),

    // Keep breakdown if it exists for detailed view
    breakdown: data.breakdown || null,

    // Metadata
    calculated_at: data.calculated_at || data.predicted_at || new Date().toISOString()
  };
};

/**
 * Generate development recommendations based on scores
 * @param {object} scores - Score breakdown
 * @returns {array} Recommendations
 */
export const generateRecommendations = (scores) => {
  const recommendations = [];

  if (scores.behavioral < 60) {
    recommendations.push('Focus on developing collaborative skills through team projects');
  }
  if (scores.performance < 60) {
    recommendations.push('Seek feedback regularly and set clear performance goals');
  }
  if (scores.engagement < 60) {
    recommendations.push('Increase platform engagement and complete learning courses');
  }
  if (scores.behavioral >= 75) {
    recommendations.push('Consider mentoring others to share your strong behavioral traits');
  }
  if (scores.performance >= 75) {
    recommendations.push('Take on stretch assignments to further develop your capabilities');
  }

  return recommendations;
};

/**
 * Calculate trend from historical data
 * @param {array} history - Array of historical scores
 * @returns {object} Trend analysis
 */
export const calculateTrend = (history) => {
  if (!history || history.length < 2) {
    return { direction: 'stable', percentage: 0 };
  }

  const latest = history[history.length - 1].overall_score;
  const previous = history[history.length - 2].overall_score;
  const change = latest - previous;
  const percentage = Math.round((change / previous) * 100);

  return {
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    percentage: Math.abs(percentage),
    change: change
  };
};

/**
 * Get score label based on value
 * @param {number} score - Score value (0-100)
 * @returns {string} Label text
 */
export const getScoreLabel = (score) => {
  if (score >= 86) return 'Exceptional';
  if (score >= 76) return 'Strong';
  if (score >= 61) return 'Growing';
  if (score >= 41) return 'Emerging';
  return 'Developing';
};

/**
 * Format score for display
 * @param {number} score - Score value
 * @returns {number} Rounded score
 */
export const formatScore = (score) => {
  if (score === null || score === undefined) return 0;
  return Math.round(score);
};

/**
 * Check if leadership data is valid
 * @param {object} data - Leadership data
 * @returns {boolean} Is valid
 */
export const isValidLeadershipData = (data) => {
  if (!data) return false;
  if (typeof data !== 'object') return false;
  
  // Must have at least an overall score
  if (!data.overall_score && !data.prediction_score) return false;
  
  return true;
};

/**
 * Get detailed breakdown explanation
 * @param {string} category - Category name (behavioral, performance, engagement)
 * @param {number} score - Score for that category
 * @returns {object} Explanation
 */
export const getBreakdownExplanation = (category, score) => {
  const explanations = {
    behavioral: {
      high: 'You demonstrate strong collaborative skills, initiative, and problem-solving abilities.',
      medium: 'You show good behavioral traits with room for growth in collaboration and leadership.',
      low: 'Focus on developing teamwork, communication, and initiative-taking skills.'
    },
    performance: {
      high: 'Your performance ratings and project outcomes are excellent.',
      medium: 'You deliver solid performance with opportunities to take on more complex work.',
      low: 'Focus on improving work quality and meeting performance expectations consistently.'
    },
    engagement: {
      high: 'You are highly engaged with learning, mentorship, and platform activities.',
      medium: 'You show good engagement with room to increase participation in development activities.',
      low: 'Increase your engagement through learning courses, mentorship, and platform usage.'
    }
  };

  const level = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';
  return {
    category: category,
    score: score,
    level: level,
    explanation: explanations[category]?.[level] || ''
  };
};

/**
 * Compare two leadership assessments
 * @param {object} previous - Previous assessment
 * @param {object} current - Current assessment
 * @returns {object} Comparison analysis
 */
export const compareAssessments = (previous, current) => {
  if (!previous || !current) return null;

  const prevNorm = normalizeLeadershipData(previous);
  const currNorm = normalizeLeadershipData(current);

  return {
    overall: {
      previous: prevNorm.overall_score,
      current: currNorm.overall_score,
      change: currNorm.overall_score - prevNorm.overall_score
    },
    behavioral: {
      previous: prevNorm.behavioral_score,
      current: currNorm.behavioral_score,
      change: currNorm.behavioral_score - prevNorm.behavioral_score
    },
    performance: {
      previous: prevNorm.performance_score,
      current: currNorm.performance_score,
      change: currNorm.performance_score - prevNorm.performance_score
    },
    engagement: {
      previous: prevNorm.engagement_score,
      current: currNorm.engagement_score,
      change: currNorm.engagement_score - prevNorm.engagement_score
    },
    trend: calculateTrend([prevNorm, currNorm])
  };
};

export default {
  getLeadershipInterpretation,
  calculatePercentile,
  getScoreColor,
  normalizeLeadershipData,
  generateRecommendations,
  calculateTrend,
  getScoreLabel,
  formatScore,
  isValidLeadershipData,
  getBreakdownExplanation,
  compareAssessments
};