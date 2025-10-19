// frontend/src/utils/badgeUtils.js

/**
 * Calculate badge eligibility and progress
 * @param {object} userData - Complete user profile data
 * @returns {object} Badge eligibility status
 */
export const calculateBadgeEligibility = (userData) => {
  if (!userData) return {};

  const completedCourses = userData.learning_progress?.filter(
    course => course.progress_percentage === 100
  ).length || 0;

  const mentorCount = userData.mentorships?.asMentor?.length || 0;
  const wellbeingCheckins = userData.wellbeing_history?.length || 0;

  return {
    learning: {
      firstVoyage: completedCourses >= 1,
      seasonedNavigator: completedCourses >= 5,
      masterExplorer: completedCourses >= 10,
      progress: {
        firstVoyage: Math.min((completedCourses / 1) * 100, 100),
        seasonedNavigator: Math.min((completedCourses / 5) * 100, 100),
        masterExplorer: Math.min((completedCourses / 10) * 100, 100)
      }
    },
    mentorship: {
      guidingStar: mentorCount >= 1,
      fleetCaptain: mentorCount >= 3,
      admiral: mentorCount >= 5,
      progress: {
        guidingStar: Math.min((mentorCount / 1) * 100, 100),
        fleetCaptain: Math.min((mentorCount / 3) * 100, 100),
        admiral: Math.min((mentorCount / 5) * 100, 100)
      }
    },
    wellbeing: {
      calmWaters: wellbeingCheckins >= 5,
      balancedVoyage: wellbeingCheckins >= 20,
      progress: {
        calmWaters: Math.min((wellbeingCheckins / 5) * 100, 100),
        balancedVoyage: Math.min((wellbeingCheckins / 20) * 100, 100)
      }
    }
  };
};

/**
 * Get badge tier color
 * @param {string} tier - Badge tier (bronze, silver, gold)
 * @returns {string} Color code
 */
export const getBadgeTierColor = (tier) => {
  const colors = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2'
  };
  return colors[tier] || '#a296ca';
};

/**
 * Format badge earned date
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatBadgeDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

/**
 * Get next badge milestone
 * @param {object} badgeProgress - Badge progress data
 * @param {string} category - Badge category
 * @returns {object} Next milestone info
 */
export const getNextMilestone = (badgeProgress, category) => {
  if (!badgeProgress || !category) return null;

  const milestones = {
    learning: [
      { name: 'First Voyage', requirement: 1 },
      { name: 'Seasoned Navigator', requirement: 5 },
      { name: 'Master Explorer', requirement: 10 }
    ],
    mentorship: [
      { name: 'Guiding Star', requirement: 1 },
      { name: 'Fleet Captain', requirement: 3 },
      { name: 'Admiral', requirement: 5 }
    ],
    wellbeing: [
      { name: 'Calm Waters', requirement: 5 },
      { name: 'Balanced Voyage', requirement: 20 }
    ]
  };

  const categoryMilestones = milestones[category];
  if (!categoryMilestones) return null;

  // Find the first milestone not yet achieved
  return categoryMilestones.find(milestone => {
    const progress = badgeProgress[category]?.progress?.[
      milestone.name.toLowerCase().replace(/\s/g, '')
    ];
    return progress < 100;
  });
};

export default {
  calculateBadgeEligibility,
  getBadgeTierColor,
  formatBadgeDate,
  getNextMilestone
};