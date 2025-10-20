import { supabase } from './supabaseClient';


// USER PROFILE OPERATIONS
// ============================================
/**
 * Create initial user profile after signup
 * @param {string} userId - Auth user ID
 * @param {object} profileData - Profile information
 * @returns {Promise} Created profile
 */
export const createUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        employee_id: profileData.employee_id,
        user_role: profileData.user_role,
        department: profileData.department,
        hire_date: profileData.hire_date || new Date().toISOString(),
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Create profile error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get complete user profile with all related data
 * @param {string} userId - User ID
 * @returns {Promise} Complete user profile
 */
export const getCompleteUserProfile = async (userId) => {
  try {
    // Get user basic info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Get user skills
    const { data: skills, error: skillsError } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId);

    if (skillsError) throw skillsError;

    // Get achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (achievementsError) throw achievementsError;

    // Get learning progress
    const { data: learningProgress, error: learningError } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (learningError) throw learningError;

    // Combine all data
    return {
      data: {
        ...user,
        skills,
        achievements,
        learningProgress
      },
      error: null
    };
  } catch (error) {
    console.error('Get complete profile error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Update user profile
 * @param {string} userId - User's ID
 * @param {object} updates - Fields to update
 * @returns {Promise} Updated profile data
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Update user profile error:', error.message);
    return { data: null, error: error.message };
  }
};

// SKILLS OPERATIONS
// ============================================

/**
 * Add skill to user profile
 * @param {string} userId - User ID
 * @param {object} skillData - Skill information
 * @returns {Promise} Added skill
 */
export const addUserSkill = async (userId, skillData) => {
  try {
    const { data, error } = await supabase
      .from('user_skills')
      .insert([{
        user_id: userId,
        function_area: skillData.function_area,
        specialization: skillData.specialization,
        skill_name: skillData.skill_name,
        proficiency_level: skillData.proficiency_level || 1,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Add skill error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Update skill proficiency level
 * @param {string} skillId - Skill ID
 * @param {number} newLevel - New proficiency level (1-5)
 * @returns {Promise} Updated skill
 */
export const updateSkillProficiency = async (skillId, newLevel) => {
  try {
    const { data, error } = await supabase
      .from('user_skills')
      .update({ proficiency_level: newLevel })
      .eq('id', skillId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Update skill error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get all available skills from the Functions & Skills dataset
 * @returns {Promise} All available skills
 */
export const getAllAvailableSkills = async () => {
  try {
    const { data, error } = await supabase
      .from('available_skills')
      .select('*')
      .order('function_area');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get available skills error:', error.message);
    return { data: null, error: error.message };
  }
};

// CAREER PATHS OPERATIONS
// ============================================

/**
 * Save career path for user
 * @param {string} userId - User ID
 * @param {object} pathData - Career path information
 * @returns {Promise} Saved career path
 */
export const saveCareerPath = async (userId, pathData) => {
  try {
    const { data, error } = await supabase
      .from('career_paths')
      .insert([{
        user_id: userId,
        current_level: pathData.current_level,
        target_level: pathData.target_level,
        target_division: pathData.target_division,
        skills_gap: pathData.skills_gap,
        recommended_courses: pathData.recommended_courses,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Save career path error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get user's saved career paths
 * @param {string} userId - User ID
 * @returns {Promise} User's career paths
 */
export const getUserCareerPaths = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('career_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get career paths error:', error.message);
    return { data: null, error: error.message };
  }
};

// MENTORSHIP OPERATIONS
// ============================================

/**
 * Find potential mentors based on skills and interests
 * @param {string} userId - Current user ID
 * @param {Array} interests - Areas of interest
 * @returns {Promise} List of potential mentors
 */
export const findMentors = async (userId, interests = []) => {
  try {
    // Get users with relevant skills who are not the current user
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_skills (
          skill_name,
          proficiency_level,
          function_area
        )
      `)
      .neq('id', userId);

    if (error) throw error;
    
    // Filter by interests if provided
    let filteredData = data || [];
    if (interests && interests.length > 0) {
      filteredData = data.filter(user => 
        interests.some(interest => 
          user.department?.toLowerCase().includes(interest.toLowerCase())
        )
      );
    }
    
    return { data: filteredData, error: null };
  } catch (error) {
    console.error('Find mentors error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Request mentorship
 * @param {string} menteeId - Mentee user ID
 * @param {string} mentorId - Mentor user ID
 * @param {Array} focusAreas - Areas to focus on
 * @returns {Promise} Mentorship request
 */
export const requestMentorship = async (menteeId, mentorId, focusAreas) => {
  try {
    const { data, error } = await supabase
      .from('mentorships')
      .insert([{
        mentee_id: menteeId,
        mentor_id: mentorId,
        status: 'pending',
        focus_areas: focusAreas,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Request mentorship error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get user's mentorships (as mentee or mentor)
 * @param {string} userId - User ID
 * @returns {Promise} Mentorship relationships
 */
export const getUserMentorships = async (userId) => {
  try {
    // Get mentorships where user is mentee
    const { data: asMentee, error: menteeError } = await supabase
      .from('mentorships')
      .select(`
        *,
        mentor:mentor_id (
          id,
          first_name,
          last_name,
          user_role,
          department
        )
      `)
      .eq('mentee_id', userId);

    if (menteeError) throw menteeError;

    // Get mentorships where user is mentor
    const { data: asMentor, error: mentorError } = await supabase
      .from('mentorships')
      .select(`
        *,
        mentee:mentee_id (
          id,
          first_name,
          last_name,
          user_role,
          department
        )
      `)
      .eq('mentor_id', userId);

    if (mentorError) throw mentorError;

    return {
      data: {
        asMentee,
        asMentor
      },
      error: null
    };
  } catch (error) {
    console.error('Get mentorships error:', error.message);
    return { data: null, error: error.message };
  }
};

// WELLBEING OPERATIONS
// ============================================

/**
 * Submit weekly wellbeing survey
 * @param {string} userId - User ID
 * @param {object} surveyData - Survey responses
 * @returns {Promise} Submitted survey
 */
export const submitWellbeingSurvey = async (userId, surveyData) => {
  try {
    const { data, error } = await supabase
      .from('wellbeing_surveys')
      .insert([{
        user_id: userId,
        week_number: surveyData.week_number,
        tide_level: surveyData.tide_level,
        stress_factors: surveyData.stress_factors,
        responses: surveyData.responses,
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Submit survey error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get user's wellbeing history
 * @param {string} userId - User ID
 * @param {number} weeks - Number of weeks to retrieve
 * @returns {Promise} Wellbeing history
 */
export const getWellbeingHistory = async (userId, weeks = 12) => {
  try {
    const { data, error } = await supabase
      .from('wellbeing_surveys')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(weeks);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get wellbeing history error:', error.message);
    return { data: null, error: error.message };
  }
};




// chatbot operations - tbd





// ACHIEVEMENTS OPERATIONS
// ============================================

/**
 * Award achievement to user
 * @param {string} userId - User ID
 * @param {object} achievementData - Achievement details
 * @returns {Promise} Awarded achievement
 */
export const awardAchievement = async (userId, achievementData) => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .insert([{
        user_id: userId,
        badge_type: achievementData.badge_type,
        badge_name: achievementData.badge_name,
        description: achievementData.description,
        earned_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Award achievement error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Check and award achievements based on user activity
 * This function checks for various achievement conditions
 * @param {string} userId - User ID
 * @returns {Promise} Newly earned achievements
 */
export const checkAndAwardAchievements = async (userId) => {
  const newAchievements = [];

  try {
    // Get user's learning progress
    const { data: progress } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    // Check for course completion achievements
    const completedCourses = progress?.filter(p => p.progress_percentage === 100) || [];
    
    if (completedCourses.length >= 1 && completedCourses.length < 5) {
      // First Course badge
      await awardAchievement(userId, {
        badge_type: 'course_completion',
        badge_name: 'First Voyage',
        description: 'Completed your first course'
      });
      newAchievements.push('First Voyage');
    }

    if (completedCourses.length >= 5) {
      // Five Courses badge
      await awardAchievement(userId, {
        badge_type: 'course_completion',
        badge_name: 'Seasoned Navigator',
        description: 'Completed 5 courses'
      });
      newAchievements.push('Seasoned Navigator');
    }

    // Check for consistency (learning for 4 consecutive weeks)
    const { data: recentActivity } = await supabase
      .from('learning_progress')
      .select('started_at')
      .eq('user_id', userId)
      .gte('started_at', new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString());

    if (recentActivity && recentActivity.length >= 4) {
      await awardAchievement(userId, {
        badge_type: 'consistency',
        badge_name: 'Steady Sailor',
        description: 'Maintained learning streak for 4 weeks'
      });
      newAchievements.push('Steady Sailor');
    }

    return { data: newAchievements, error: null };
  } catch (error) {
    console.error('Check achievements error:', error.message);
    return { data: null, error: error.message };
  }
};

// LEARNING PROGRESS OPERATIONS
// ============================================

/**
 * Start a new course
 * @param {string} userId - User ID
 * @param {object} courseData - Course information
 * @returns {Promise} Learning progress record
 */
export const startCourse = async (userId, courseData) => {
  try {
    const { data, error } = await supabase
      .from('learning_progress')
      .insert([{
        user_id: userId,
        course_id: courseData.course_id,
        course_name: courseData.course_name,
        progress_percentage: 0,
        started_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Start course error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Update course progress
 * @param {string} progressId - Learning progress ID
 * @param {number} percentage - Completion percentage
 * @returns {Promise} Updated progress
 */
export const updateCourseProgress = async (progressId, percentage) => {
  try {
    const updateData = {
      progress_percentage: percentage
    };

    // If course completed, add completion timestamp
    if (percentage === 100) {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('learning_progress')
      .update(updateData)
      .eq('id', progressId)
      .select()
      .single();

    if (error) throw error;

    // Check for achievements if course completed
    if (percentage === 100 && data) {
      await checkAndAwardAchievements(data.user_id);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Update progress error:', error.message);
    return { data: null, error: error.message };
  }
};

// LEADERSHIP PREDICTION OPERATIONS
// ============================================

/**
 * Save leadership prediction
 * @param {string} userId - User ID
 * @param {object} predictionData - Prediction scores and factors
 * @returns {Promise} Saved prediction
 */
export const saveLeadershipPrediction = async (userId, predictionData) => {
  try {
    const { data, error } = await supabase
      .from('leadership_predictions')
      .insert([{
        user_id: userId,
        prediction_score: predictionData.prediction_score,
        behavioral_score: predictionData.behavioral_score,
        performance_score: predictionData.performance_score,
        engagement_score: predictionData.engagement_score,
        factors: predictionData.factors,
        predicted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Save prediction error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get latest leadership prediction for user
 * @param {string} userId - User ID
 * @returns {Promise} Latest prediction
 */
export const getLeadershipPrediction = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('leadership_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('predicted_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get prediction error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Calculate comprehensive leadership score
 * This is the MAIN function that calculates all the scores we discussed
 * @param {string} userId - User ID
 * @returns {Promise} Complete leadership analysis with scores
 */
export const calculateLeadershipScore = async (userId) => {
  try {
    // Fetch all required data
    const { data: profile } = await getCompleteUserProfile(userId);
    const { data: mentorships } = await getUserMentorships(userId);
    const { data: wellbeing } = await getWellbeingHistory(userId, 12);

    if (!profile) {
      return { data: null, error: 'Profile not found' };
    }

    // 1. BEHAVIORAL SCORE (0-100)
    const behavioral = {
      // Team Collaboration (max 25 points)
      // Active mentees: 5 points each (max 15)
      // Projects: 2 points each (max 10)
      teamCollaboration: Math.min(
        ((mentorships?.asMentor?.length || 0) * 5) + 
        ((profile.projects?.length || 0) * 2),
        25
      ),

      // Initiative (max 25 points)
      // Courses started voluntarily: 3 points each (max 15)
      // Skills added: 2 points each (max 10)
      initiative: Math.min(
        ((profile.learningProgress?.length || 0) * 3) + 
        ((profile.skills?.length || 0) * 2),
        25
      ),

      // Problem Solving (max 25 points)
      // Completed courses: 5 points each (max 20)
      // Early completion bonus: 5 points
      problemSolving: Math.min(
        (profile.learningProgress?.filter(c => c.progress_percentage === 100).length || 0) * 5,
        25
      ),

      // Communication (max 25 points)
      // Wellbeing surveys: 3 points each (max 15)
      // Base activity: 10 points
      communication: Math.min(
        ((wellbeing?.length || 0) * 3) + 10,
        25
      )
    };

    const behavioralScore = Object.values(behavioral).reduce((sum, val) => sum + val, 0);


    // 2. PERFORMANCE SCORE (0-100)
    // Performance Rating (max 40 points)
    // 1=0, 2=16, 3=28, 4=36, 5=40
    const performanceRating = profile.performance_rating || 3;
    const ratingPoints = [0, 16, 28, 36, 40][performanceRating - 1] || 28;

    // Project Completion (max 30 points)
    // On-time projects: 6 points each
    const completedProjects = profile.projects?.filter(p => p.status === 'completed').length || 0;
    const projectPoints = Math.min(completedProjects * 6, 30);

    // Quality Score (max 30 points)
    // Course completion rate
    const totalStarted = profile.learningProgress?.length || 0;
    const totalCompleted = profile.learningProgress?.filter(c => c.progress_percentage === 100).length || 0;
    const completionRate = totalStarted > 0 ? (totalCompleted / totalStarted) : 0;
    const qualityPoints = completionRate * 30;

    const performanceScore = Math.min(ratingPoints + projectPoints + qualityPoints, 100);


    // 3. ENGAGEMENT SCORE (0-100)
    // Learning Activity (max 40 points)
    // Completed courses: 8 points each (max 32)
    // Learning hours: 1 point per 10 hours (max 8)
    const learningPoints = Math.min(
      (totalCompleted * 8) + ((profile.learning_hours || 0) / 10),
      40
    );

    // Mentorship Activity (max 30 points)
    // As mentor: 10 points per mentee (max 20) + rating bonus (max 10)
    // OR as mentee: 15 points for having mentor + meetings
    let mentorshipPoints = 0;
    if (mentorships?.asMentor?.length > 0) {
      mentorshipPoints = Math.min(
        (mentorships.asMentor.length * 10) + 10,
        30
      );
    } else if (mentorships?.asMentee?.length > 0) {
      mentorshipPoints = 15;
    }

    // Platform Usage (max 30 points)
    // Surveys: 5 points each (max 20)
    // Base activity: 10 points
    const platformPoints = Math.min(
      ((wellbeing?.length || 0) * 5) + 10,
      30
    );

    const engagementScore = Math.min(learningPoints + mentorshipPoints + platformPoints, 100);


    // 4. FINAL WEIGHTED SCORE
    const finalScore = Math.round(
      (behavioralScore * 0.40) +    // 40% weight
      (performanceScore * 0.35) +   // 35% weight
      (engagementScore * 0.25)      // 25% weight
    );


    // 5. INTERPRETATION
    let interpretation = '';
    let readiness = '';
    let timeline = '';

    if (finalScore >= 86) {
      interpretation = 'Exceptional';
      readiness = 'Ready for leadership now';
      timeline = '0-6 months';
    } else if (finalScore >= 76) {
      interpretation = 'Strong';
      readiness = 'Ready for stretch assignments';
      timeline = '6-12 months';
    } else if (finalScore >= 61) {
      interpretation = 'Growing';
      readiness = 'Good potential, needs development';
      timeline = '12-18 months';
    } else if (finalScore >= 41) {
      interpretation = 'Emerging';
      readiness = 'Building foundation';
      timeline = '18-24 months';
    } else {
      interpretation = 'Developing';
      readiness = 'Focus on fundamentals';
      timeline = '24+ months';
    }


    // 6. STRENGTHS & DEVELOPMENT AREAS
    const strengths = [];
    const developmentAreas = [];

    // Analyze each category
    if (behavioralScore >= 75) strengths.push('Strong behavioral traits');
    else if (behavioralScore < 50) developmentAreas.push('Behavioral skills');

    if (performanceScore >= 75) strengths.push('Excellent performance record');
    else if (performanceScore < 50) developmentAreas.push('Performance improvement');

    if (engagementScore >= 75) strengths.push('High engagement');
    else if (engagementScore < 50) developmentAreas.push('Platform engagement');

    // Specific recommendations
    const recommendations = [];
    if (behavioral.teamCollaboration < 15) {
      recommendations.push('Consider mentoring junior colleagues');
    }
    if (behavioral.initiative < 15) {
      recommendations.push('Start more learning courses');
    }
    if (mentorshipPoints < 15) {
      recommendations.push('Seek a mentor or become one');
    }
    if (totalCompleted < 3) {
      recommendations.push('Complete at least 3 courses');
    }


    // 7. RETURN COMPLETE ANALYSIS
    const result = {
      overall_score: finalScore,
      interpretation: interpretation,
      readiness: readiness,
      timeline: timeline,
      breakdown: {
        behavioral: {
          score: Math.round(behavioralScore),
          details: behavioral
        },
        performance: {
          score: Math.round(performanceScore),
          rating_points: ratingPoints,
          project_points: projectPoints,
          quality_points: Math.round(qualityPoints)
        },
        engagement: {
          score: Math.round(engagementScore),
          learning_points: Math.round(learningPoints),
          mentorship_points: mentorshipPoints,
          platform_points: platformPoints
        }
      },
      strengths: strengths,
      development_areas: developmentAreas,
      recommendations: recommendations,
      calculated_at: new Date().toISOString()
    };

    return { data: result, error: null };

  } catch (error) {
    console.error('Calculate leadership score error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get or calculate leadership prediction for user
 * Checks if recent prediction exists, otherwise calculates new one
 * @param {string} userId - User ID
 * @param {boolean} forceRecalculate - Force new calculation even if recent exists
 * @returns {Promise} Leadership prediction
 */
export const getOrCalculateLeadership = async (userId, forceRecalculate = false) => {
  try {
    // Check for recent prediction (within last 7 days)
    if (!forceRecalculate) {
      const { data: recentPrediction } = await supabase
        .from('leadership_predictions')
        .select('*')
        .eq('user_id', userId)
        .gte('predicted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('predicted_at', { ascending: false })
        .limit(1)
        .single();

      if (recentPrediction) {
        return { data: recentPrediction, error: null };
      }
    }

    // Calculate new prediction
    const { data: calculation, error: calcError } = await calculateLeadershipScore(userId);
    
    if (calcError) {
      return { data: null, error: calcError };
    }

    // Save to database
    const predictionData = {
      user_id: userId,
      prediction_score: calculation.overall_score,
      behavioral_score: calculation.breakdown.behavioral.score,
      performance_score: calculation.breakdown.performance.score,
      engagement_score: calculation.breakdown.engagement.score,
      factors: {
        interpretation: calculation.interpretation,
        readiness: calculation.readiness,
        timeline: calculation.timeline,
        strengths: calculation.strengths,
        development_areas: calculation.development_areas,
        recommendations: calculation.recommendations
      }
    };

    const { data: savedPrediction, error: saveError } = await saveLeadershipPrediction(userId, predictionData);

    if (saveError) {
      console.error('Error saving prediction:', saveError);
      // Return calculation even if save fails
      return { data: calculation, error: null };
    }

    return { data: calculation, error: null };

  } catch (error) {
    console.error('Get/calculate leadership error:', error.message);
    return { data: null, error: error.message };
  }
};

// CHAT MESSAGES OPERATIONS
// ============================================

/**
 * Send message to mentor
 * @param {string} senderId - Sender user ID
 * @param {string} receiverId - Receiver user ID
 * @param {string} messageText - Message content
 * @returns {Promise} Sent message
 */
export const sendMessage = async (senderId, receiverId, messageText) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        message_text: messageText,
        is_ai: false,
        sent_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Send message error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get chat history between two users
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {Promise} Chat messages
 */
export const getChatHistory = async (userId1, userId2) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('sent_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get chat history error:', error.message);
    return { data: null, error: error.message };
  }
};

export default {
  // User Profile
  createUserProfile,
  getCompleteUserProfile,
  updateUserProfile,
  
  // Skills
  addUserSkill,
  updateSkillProficiency,
  getAllAvailableSkills,
  
  // Career Paths
  saveCareerPath,
  getUserCareerPaths,
  
  // Mentorship
  findMentors,
  requestMentorship,
  getUserMentorships,
  
  // Wellbeing
  submitWellbeingSurvey,
  getWellbeingHistory,
  
  // Achievements
  awardAchievement,
  checkAndAwardAchievements,
  
  // Learning
  startCourse,
  updateCourseProgress,
  
  // Leadership
  saveLeadershipPrediction,
  getLeadershipPrediction,
  calculateLeadershipScore,
  getOrCalculateLeadership,
  
  // Chat
  sendMessage,
  getChatHistory
};

