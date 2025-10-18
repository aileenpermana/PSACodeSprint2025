import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const AZURE_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

/**
 * Make a request to OpenAI API
 * @param {Array} messages - Conversation messages
 * @param {number} temperature - Creativity level (0-1)
 * @returns {Promise} AI response
 */
const callOpenAI = async (messages, temperature = 0.7) => {
  try {
    const response = await axios.post(
      AZURE_ENDPOINT,
      {
        model: 'gpt-4', 
        messages: messages,
        temperature: temperature,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response');
  }
};

/**
 * Get personalized career pathway recommendations
 * @param {object} userProfile - User's profile data
 * @param {Array} userSkills - User's current skills
 * @param {string} targetRole - Desired role (optional)
 * @returns {Promise} Career recommendations
 */
export const getCareerRecommendations = async (userProfile, userSkills, targetRole = null) => {
  const prompt = `
You are a career advisor for PSA (Port of Singapore Authority), a maritime logistics company.

User Profile:
- Name: ${userProfile.first_name} ${userProfile.last_name}
- Current Role: ${userProfile.user_role}
- Department: ${userProfile.department}
- Years at Company: ${userProfile.years_at_company || 'Unknown'}

Current Skills:
${userSkills.map(skill => `- ${skill.skill_name} (${skill.function_area})`).join('\n')}

${targetRole ? `Target Role: ${targetRole}` : 'User is exploring career options'}

Please provide:
1. **Career Pathways**: 2-3 recommended career paths within PSA (vertical or horizontal moves)
2. **Skill Gaps**: Specific skills needed for each pathway
3. **Recommended Courses**: 3-5 courses or training programs for each pathway
4. **Timeline**: Estimated time to be ready for each pathway
5. **Next Steps**: Immediate actions the user can take

Format the response in a clear, structured JSON format.
`;

  const messages = [
    { role: 'system', content: 'You are an expert career advisor specializing in maritime logistics and PSA career development.' },
    { role: 'user', content: prompt }
  ];

  const response = await callOpenAI(messages, 0.7);
  
  try {
    // Try to parse as JSON, fallback to text if it fails
    return JSON.parse(response);
  } catch {
    return { recommendations: response };
  }
};

/**
 * Analyze skill gaps for a target role
 * @param {Array} currentSkills - User's current skills
 * @param {string} targetRole - Target position
 * @param {Array} requiredSkills - Skills needed for target role
 * @returns {Promise} Skill gap analysis
 */
export const analyzeSkillGap = async (currentSkills, targetRole, requiredSkills) => {
  const prompt = `
Analyze the skill gap for transitioning to: ${targetRole}

Current Skills:
${currentSkills.map(skill => `- ${skill.skill_name}`).join('\n')}

Required Skills for ${targetRole}:
${requiredSkills.map(skill => `- ${skill}`).join('\n')}

Please provide:
1. **Skill Gap Summary**: Overall assessment of readiness
2. **Missing Skills**: Critical skills that need to be developed
3. **Existing Strengths**: Skills already possessed that are valuable
4. **Learning Priority**: Order in which to acquire missing skills
5. **Development Plan**: Specific actions and resources

Return as structured JSON.
`;

  const messages = [
    { role: 'system', content: 'You are a skills development expert for PSA.' },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, 0.6);
};

//AI Chatbot - tbd
//Mental Wellbeing - tbd
//Chat analysis for Mental Wellbeing - tbd

/**
 * Predict leadership potential based on multiple factors
 * @param {object} performanceData - Performance metrics
 * @param {object} behavioralData - Behavioral assessments
 * @param {object} engagementData - Engagement scores
 * @returns {Promise} Leadership prediction and insights
 */
export const predictLeadershipPotential = async (performanceData, behavioralData, engagementData) => {
  const prompt = `
Assess leadership potential based on:

Performance Metrics:
- Performance Rating: ${performanceData.rating}/5
- Projects Completed: ${performanceData.projects_completed}
- Quality Score: ${performanceData.quality_score}/100

Behavioral Indicators:
- Team Collaboration: ${behavioralData.collaboration}/5
- Initiative Taking: ${behavioralData.initiative}/5
- Problem Solving: ${behavioralData.problem_solving}/5
- Communication: ${behavioralData.communication}/5

Engagement Data:
- Engagement Score: ${engagementData.score}/100
- Mentorship Activity: ${engagementData.mentorship_active ? 'Yes' : 'No'}
- Learning Hours: ${engagementData.learning_hours} hours

Provide:
1. **Leadership Score**: Overall score (0-100)
2. **Key Strengths**: Leadership qualities already demonstrated
3. **Development Areas**: Skills to develop for leadership roles
4. **Readiness Assessment**: Timeline to leadership readiness
5. **Recommended Actions**: Specific steps to enhance leadership potential

Format as structured JSON with numeric scores.
`;

  const messages = [
    { role: 'system', content: 'You are a leadership assessment expert using data-driven insights.' },
    { role: 'user', content: prompt }
  ];

  const response = await callOpenAI(messages, 0.6);
  
  try {
    return JSON.parse(response);
  } catch {
    return { analysis: response };
  }
};

/**
 * Find suitable mentors based on user interests and goals
 * @param {object} userProfile - User's profile
 * @param {Array} userInterests - User's areas of interest
 * @param {Array} availableMentors - List of potential mentors
 * @returns {Promise} Ranked mentor recommendations
 */
export const recommendMentors = async (userProfile, userInterests, availableMentors) => {
  const prompt = `
Find the best mentor matches for this employee:

User Profile:
- Name: ${userProfile.first_name} ${userProfile.last_name}
- Current Role: ${userProfile.user_role}
- Department: ${userProfile.department}
- Experience: ${userProfile.years_at_company || 'Unknown'} years at PSA

User's Interests & Goals:
${userInterests.map(interest => `- ${interest}`).join('\n')}

Available Mentors:
${availableMentors.map((mentor, idx) => `
${idx + 1}. ${mentor.first_name} ${mentor.last_name}
   Role: ${mentor.user_role}
   Department: ${mentor.department}
   Skills: ${mentor.skills?.map(s => s.skill_name).join(', ') || 'Not specified'}
   Experience: ${mentor.years_at_company || 'Unknown'} years
`).join('\n')}

Please analyze and provide:
1. **Top 3 Mentor Matches**: Rank the best mentors with match percentage (0-100%)
2. **Match Reasoning**: Why each mentor is a good fit
3. **What You'll Learn**: Specific skills/knowledge you can gain from each mentor
4. **Compatibility Score**: Based on interests, department overlap, and experience gap

Return as structured JSON with this format:
{
  "matches": [
    {
      "mentor_id": "index from list",
      "mentor_name": "name",
      "match_percentage": 95,
      "reasoning": "why good match",
      "learning_opportunities": ["skill1", "skill2"],
      "compatibility_factors": {
        "skill_overlap": 8,
        "interest_alignment": 9,
        "experience_gap": 10
      }
    }
  ],
  "recommendations": "overall advice for mentorship"
}
`;

  const messages = [
    { role: 'system', content: 'You are an expert mentorship matching advisor for PSA, using data-driven insights to create meaningful mentor-mentee relationships.' },
    { role: 'user', content: prompt }
  ];

  const response = await callOpenAI(messages, 0.7);
  
  try {
    return JSON.parse(response);
  } catch {
    return { matches: [], recommendations: response };
  }
};

/**
 * Get personalized course recommendations based on skill gaps
 * @param {Array} currentSkills - User's current skills
 * @param {Array} targetSkills - Skills user wants to develop
 * @param {string} careerGoal - User's career objective
 * @returns {Promise} Course recommendations
 */
export const recommendCourses = async (currentSkills, targetSkills, careerGoal) => {
  const prompt = `
Recommend learning courses for career development:

Current Skills:
${currentSkills.map(skill => `- ${skill.skill_name}`).join('\n')}

Target Skills to Develop:
${targetSkills.map(skill => `- ${skill}`).join('\n')}

Career Goal: ${careerGoal}

Please recommend:
1. **Priority Courses**: 5 courses to take first (most important)
2. **Learning Path**: Suggested order to take courses
3. **Time Estimate**: How long each course takes
4. **Platforms**: Where to find these courses (Coursera, Udemy, LinkedIn Learning, etc.)
5. **Expected Outcome**: What skills you'll gain from each

Focus on practical, industry-recognized courses. Include both technical and soft skills.

Return as JSON:
{
  "courses": [
    {
      "title": "course name",
      "platform": "Coursera/Udemy/etc",
      "duration": "4 weeks",
      "difficulty": "Beginner/Intermediate/Advanced",
      "priority": 1,
      "skills_gained": ["skill1", "skill2"],
      "cost": "Free/Paid"
    }
  ],
  "learning_path": "suggested order and rationale",
  "total_time": "estimated completion time"
}
`;

  const messages = [
    { role: 'system', content: 'You are a learning and development advisor specializing in career growth at PSA.' },
    { role: 'user', content: prompt }
  ];

  const response = await callOpenAI(messages, 0.7);
  
  try {
    return JSON.parse(response);
  } catch {
    return { courses: [], learning_path: response };
  }
};

export default {
  getCareerRecommendations,
  analyzeSkillGap,
  getChatbotResponse,
  analyzeWellbeing,
  predictLeadershipPotential,
  recommendMentors,
  recommendCourses,
  analyzeSentiment
};

