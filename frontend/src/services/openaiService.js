import axios from 'axios';

// Azure OpenAI Configuration
const AZURE_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const DEPLOYMENT_ID = 'gpt-4.1-nano'; 
const API_VERSION = '2025-01-01-preview';
const isDevelopment = process.env.NODE_ENV === 'development';
const AZURE_BASE_URL = isDevelopment 
  ? '/openai' 
  : 'https://psacodesprint2025.azure-api.net/openai';

// Construct full Azure endpoint
const AZURE_ENDPOINT = `${AZURE_BASE_URL}/deployments/${DEPLOYMENT_ID}/chat/completions?api-version=${API_VERSION}`;

/**
 * Make a request to Azure OpenAI API
 * @param {Array} messages - Conversation messages
 * @param {number} temperature - Creativity level (0-1)
 * @param {number} maxTokens - Maximum tokens in response
 * @returns {Promise} AI response
 */
const callAzureOpenAI = async (messages, temperature = 0.7, maxTokens = 1000) => {
  try {
    const response = await axios.post(
      AZURE_ENDPOINT,
      {
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_API_KEY // Azure uses 'api-key' header, not Bearer token
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Azure OpenAI API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your Azure OpenAI credentials.');
    } else if (error.response?.status === 404) {
      throw new Error('Deployment not found. Please verify the deployment ID.');
    }
    throw new Error('Failed to get AI response. Please try again.');
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

Format the response in a clear, structured JSON format with this structure:
{
  "career_pathways": [
    {
      "title": "pathway name",
      "match_score": 85,
      "timeline": "12-18 months",
      "target_roles": ["role1", "role2"],
      "skill_gaps": ["skill1", "skill2"],
      "courses": ["course1", "course2"],
      "next_steps": ["step1", "step2"]
    }
  ],
  "summary": "overall career guidance"
}
`;

  const messages = [
    { role: 'system', content: 'You are an expert career advisor specializing in maritime logistics and PSA career development.' },
    { role: 'user', content: prompt }
  ];

  const response = await callAzureOpenAI(messages, 0.7, 1500);
  
  try {
    return JSON.parse(response);
  } catch {
    return { career_pathways: [], summary: response };
  }
};

/**
 * Analyze skill gaps between current and target role
 * @param {Array} currentSkills - User's current skills
 * @param {string} targetRole - Desired role
 * @param {Array} requiredSkills - Skills required for target role
 * @returns {Promise} Skill gap analysis
 */
export const analyzeSkillGap = async (currentSkills, targetRole, requiredSkills) => {
  const prompt = `
Analyze the skill gap for career transition at PSA.

Current Skills:
${currentSkills.map(skill => `- ${skill.skill_name} (Level: ${skill.proficiency || 'N/A'})`).join('\n')}

Target Role: ${targetRole}

Required Skills for Target Role:
${requiredSkills.map(skill => `- ${skill}`).join('\n')}

Provide:
1. **Critical Gaps**: Skills missing that are essential for the role
2. **Priority Ranking**: Which skills to develop first (High/Medium/Low priority)
3. **Current Strengths**: Skills the user already has that align with the target role
4. **Development Plan**: Step-by-step plan to close gaps
5. **Estimated Timeline**: Time needed to be role-ready

Return as JSON:
{
  "critical_gaps": ["skill1", "skill2"],
  "priority_skills": [
    {"skill": "name", "priority": "High", "current_level": 2, "target_level": 4}
  ],
  "strengths": ["skill1", "skill2"],
  "development_plan": "detailed plan",
  "timeline": "6-12 months"
}
`;

  const messages = [
    { role: 'system', content: 'You are a skills development advisor for PSA.' },
    { role: 'user', content: prompt }
  ];

  const response = await callAzureOpenAI(messages, 0.6, 1200);
  
  try {
    return JSON.parse(response);
  } catch {
    return { analysis: response };
  }
};

/**
 * AI chatbot for conversational support
 * @param {string} userMessage - Current user message
 * @param {Array} conversationHistory - Previous messages
 * @param {object} context - User context (profile, mood, etc.)
 * @returns {Promise} AI chatbot response
 */
export const chatWithAI = async (userMessage, conversationHistory = [], context = {}) => {
  const systemPrompt = `
You are PSA Pathways AI Assistant, a supportive and empathetic career development chatbot for PSA employees.

Your role:
- Provide career guidance and mentorship
- Support employee wellbeing and mental health
- Answer questions about learning opportunities
- Offer encouragement and motivation
- Help with work-life balance advice

Context about the user:
${context.userName ? `- Name: ${context.userName}` : ''}
${context.role ? `- Role: ${context.role}` : ''}
${context.department ? `User's department: ${context.department}` : ''}
${context.mood ? `- Current mood: ${context.mood}` : ''}

Be warm, professional, and supportive. Keep responses concise (2-3 paragraphs max).
`;

  const history = Array.isArray(conversationHistory) ? conversationHistory : [];

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    })),
    { role: 'user', content: userMessage }
  ];

  return await callAzureOpenAI(messages, 0.8, 500);
};

/**
 * Predict leadership potential using behavioral and performance data
 * @param {object} userProfile - User profile
 * @param {object} performanceData - Performance metrics
 * @param {object} engagementData - Engagement metrics
 * @returns {Promise} Leadership potential analysis
 */
export const predictLeadershipPotential = async (userProfile, performanceData, engagementData) => {
  const prompt = `
Analyze leadership potential for PSA employee.

Employee Profile:
- Name: ${userProfile.first_name} ${userProfile.last_name}
- Current Role: ${userProfile.user_role}
- Years at PSA: ${userProfile.years_at_company}
- Department: ${userProfile.department}

Performance Data:
- Recent Projects: ${performanceData.projects_completed || 0}
- Team Collaboration Score: ${performanceData.collaboration_score || 'N/A'}/10
- Innovation Initiatives: ${performanceData.innovation_count || 0}
- Problem-Solving Rating: ${performanceData.problem_solving || 'N/A'}/10

Engagement Data:
- Mentorship: ${engagementData.is_mentor ? 'Active Mentor' : 'Not Currently Mentoring'}
- Training Completed: ${engagementData.training_hours || 0} hours
- Peer Recognition: ${engagementData.peer_recognition || 0} endorsements
- Cross-functional Experience: ${engagementData.cross_functional ? 'Yes' : 'No'}
- Learning Hours: ${engagementData.learning_hours} hours

Provide:
1. **Leadership Score**: Overall score (0-100)
2. **Key Strengths**: Leadership qualities already demonstrated
3. **Development Areas**: Skills to develop for leadership roles
4. **Readiness Assessment**: Timeline to leadership readiness
5. **Recommended Actions**: Specific steps to enhance leadership potential

Format as structured JSON:
{
  "leadership_score": 78,
  "category": "High Potential / Emerging Leader / Ready Now",
  "strengths": ["strength1", "strength2"],
  "development_areas": ["area1", "area2"],
  "readiness": "12-18 months to leadership role",
  "actions": ["action1", "action2"]
}
`;

  const messages = [
    { role: 'system', content: 'You are a leadership assessment expert using data-driven insights.' },
    { role: 'user', content: prompt }
  ];

  const response = await callAzureOpenAI(messages, 0.6, 1000);
  
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
  if (!availableMentors || availableMentors.length === 0) {
    return { matches: [], recommendations: 'No mentors available at this time.' };
  }

  const prompt = `
Find the best mentor matches for this PSA employee:

User Profile:
- Name: ${userProfile.first_name} ${userProfile.last_name}
- Current Role: ${userProfile.user_role}
- Department: ${userProfile.department}
- Experience: ${userProfile.years_at_company || 'Unknown'} years at PSA

User's Interests & Goals:
${userInterests && userInterests.length > 0 ? userInterests.map(interest => `- ${interest}`).join('\n') : '- Career development\n- Skill enhancement'}

Available Mentors:
${availableMentors.map((mentor, idx) => `
${idx + 1}. ${mentor.first_name} ${mentor.last_name}
   Role: ${mentor.user_role || 'Not specified'}
   Department: ${mentor.department || 'Not specified'}
   Skills: ${mentor.user_skills?.map(s => s.skill_name).join(', ') || mentor.skills?.map(s => s.skill_name).join(', ') || 'Not specified'}
   Experience: ${mentor.years_at_company || 'Unknown'} years
`).join('\n')}

Please analyze and provide:
1. **Top 3-5 Mentor Matches**: Rank the best mentors with match percentage (0-100%)
2. **Match Reasoning**: Why each mentor is a good fit
3. **What You'll Learn**: Specific skills/knowledge you can gain from each mentor
4. **Compatibility Score**: Based on interests, department overlap, and experience gap

Return as structured JSON with this EXACT format:
{
  "matches": [
    {
      "mentor_index": 0,
      "mentor_name": "Full Name",
      "match_percentage": 95,
      "reasoning": "Detailed explanation of why this is a good match",
      "learning_opportunities": ["skill1", "skill2", "skill3"],
      "compatibility_factors": {
        "skill_overlap": 8,
        "interest_alignment": 9,
        "experience_gap": 10
      }
    }
  ],
  "recommendations": "Overall mentorship advice for the user"
}
`;

  const messages = [
    { role: 'system', content: 'You are an expert mentorship matching advisor for PSA. Always return valid JSON.' },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await callAzureOpenAI(messages, 0.7, 1200);
    const parsed = JSON.parse(response);
    return parsed;
  } catch (error) {
    console.error('Error in recommendMentors:', error);
    return { 
      matches: [], 
      recommendations: 'Unable to generate AI recommendations at this time. Please try manual search.' 
    };
  }
};

/**
 * Recommend personalized learning courses
 * @param {Array} skillGaps - Skills to develop
 * @param {string} careerGoal - Career objective
 * @param {string} learningStyle - Preferred learning style
 * @returns {Promise} Course recommendations
 */
export const recommendCourses = async (skillGaps, careerGoal, learningStyle = 'mixed') => {
  const prompt = `
Recommend learning courses for PSA employee.

Skills to Develop:
${skillGaps.map(skill => `- ${skill}`).join('\n')}

Career Goal: ${careerGoal}
Learning Style: ${learningStyle}

Provide course recommendations that:
- Are available online (Coursera, Udemy, LinkedIn Learning, edX, etc.)
- Range from beginner to advanced
- Include both technical and soft skills
- Are relevant to maritime logistics industry

Return as JSON:
{
  "courses": [
    {
      "title": "course name",
      "provider": "Coursera/Udemy/etc",
      "duration": "4 weeks",
      "difficulty": "Beginner/Intermediate/Advanced",
      "priority": 1,
      "skills_gained": ["skill1", "skill2"],
      "cost": "Free/Paid",
      "url": "course URL if available"
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

  const response = await callAzureOpenAI(messages, 0.7, 1500);
  
  try {
    return JSON.parse(response);
  } catch {
    return { courses: [], learning_path: response };
  }
};

/**
 * Analyze wellbeing and provide mental health support suggestions
 * @param {object} moodData - Recent mood check-ins
 * @param {object} stressIndicators - Stress level data
 * @returns {Promise} Wellbeing recommendations
 */
export const analyzeWellbeing = async (moodData, stressIndicators) => {
  const prompt = `
Analyze employee wellbeing and provide supportive recommendations.

Recent Mood Data:
${JSON.stringify(moodData, null, 2)}

Stress Indicators:
${JSON.stringify(stressIndicators, null, 2)}

Provide:
1. **Wellbeing Assessment**: Overall mental health status
2. **Concerns**: Any red flags or patterns to address
3. **Recommendations**: Practical steps to improve wellbeing
4. **Resources**: PSA resources or external support options
5. **Follow-up**: When to check in again

Be empathetic, non-judgmental, and supportive. Format as JSON.
`;

  const messages = [
    { role: 'system', content: 'You are a compassionate wellbeing advisor focused on employee mental health and work-life balance.' },
    { role: 'user', content: prompt }
  ];

  const response = await callAzureOpenAI(messages, 0.8, 800);
  
  try {
    return JSON.parse(response);
  } catch {
    return { assessment: response };
  }
};

// Export all functions
export default {
  getCareerRecommendations,
  analyzeSkillGap,
  chatWithAI,
  predictLeadershipPotential,
  recommendMentors,
  recommendCourses,
  analyzeWellbeing
};