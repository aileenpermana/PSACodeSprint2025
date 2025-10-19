// ============================================
// CONTINENT VIEW COMPONENT
// ============================================
// File: src/components/Explore/ContinentView.jsx
// ============================================

import React, { useState } from 'react';
import { Map, Compass, TrendingUp, Users, BookOpen, Award, ChevronRight, Ship, Anchor } from 'lucide-react';

const ContinentView = ({ division, currentDepartment, userData, onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showTransitionPath, setShowTransitionPath] = useState(false);

  // Division data with detailed role information
  const divisionData = {
    it: {
      name: 'Information Technology',
      icon: '💻',
      color: '#A296ca',
      description: 'Navigate the digital seas with cutting-edge technology and innovation',
      terrain: 'Mountain ranges of servers, valleys of code, and rivers of data',
      climate: 'Fast-paced, innovative, constantly evolving',
      roles: [
        {
          id: 'software-dev',
          title: 'Software Developer',
          level: 'Junior-Senior',
          icon: '👨‍💻',
          description: 'Build and maintain software applications that power PSA operations',
          keySkills: ['Programming', 'Problem Solving', 'Version Control', 'Testing'],
          growthPath: ['Junior Dev → Senior Dev → Tech Lead → Engineering Manager'],
          demand: 'High',
          avgSalary: '$60K-$120K'
        },
        {
          id: 'cloud-architect',
          title: 'Cloud Architect',
          level: 'Senior',
          icon: '☁️',
          description: 'Design and implement cloud infrastructure solutions',
          keySkills: ['Cloud Platforms', 'Architecture Design', 'Security', 'DevOps'],
          growthPath: ['Systems Engineer → Cloud Engineer → Cloud Architect → Principal Architect'],
          demand: 'Very High',
          avgSalary: '$100K-$180K'
        },
        {
          id: 'security-analyst',
          title: 'Security Analyst',
          level: 'Junior-Senior',
          icon: '🔒',
          description: 'Protect PSA systems and data from cyber threats',
          keySkills: ['Cybersecurity', 'Risk Assessment', 'Incident Response', 'Compliance'],
          growthPath: ['Security Analyst → Senior Analyst → Security Manager → CISO'],
          demand: 'High',
          avgSalary: '$70K-$130K'
        },
        {
          id: 'devops',
          title: 'DevOps Engineer',
          level: 'Mid-Senior',
          icon: '⚙️',
          description: 'Streamline development and operations through automation',
          keySkills: ['CI/CD', 'Containerization', 'Infrastructure as Code', 'Monitoring'],
          growthPath: ['Sys Admin → DevOps Engineer → Platform Engineer → SRE Lead'],
          demand: 'Very High',
          avgSalary: '$80K-$150K'
        }
      ]
    },
    operations: {
      name: 'Operations',
      icon: '⚙️',
      color: '#FF6B6B',
      description: 'The heartbeat of PSA - ensuring smooth terminal operations 24/7',
      terrain: 'Bustling ports, cargo terminals, and logistics hubs',
      climate: 'Dynamic, hands-on, mission-critical',
      roles: [
        {
          id: 'ops-manager',
          title: 'Operations Manager',
          level: 'Mid-Senior',
          icon: '📋',
          description: 'Oversee daily terminal operations and team coordination',
          keySkills: ['Leadership', 'Process Optimization', 'Safety Management', 'Communication'],
          growthPath: ['Coordinator → Supervisor → Manager → Senior Manager'],
          demand: 'High',
          avgSalary: '$80K-$140K'
        },
        {
          id: 'logistics',
          title: 'Logistics Coordinator',
          level: 'Entry-Mid',
          icon: '🚚',
          description: 'Coordinate vessel movements and cargo handling',
          keySkills: ['Planning', 'Coordination', 'Problem Solving', 'Systems'],
          growthPath: ['Junior Coordinator → Coordinator → Senior Coordinator → Planning Manager'],
          demand: 'Medium',
          avgSalary: '$45K-$80K'
        },
        {
          id: 'terminal-super',
          title: 'Terminal Supervisor',
          level: 'Mid-Level',
          icon: '🏗️',
          description: 'Supervise terminal activities and equipment operations',
          keySkills: ['Team Management', 'Equipment Operation', 'Safety', 'Decision Making'],
          growthPath: ['Equipment Operator → Team Leader → Supervisor → Operations Manager'],
          demand: 'High',
          avgSalary: '$60K-$100K'
        }
      ]
    },
    engineering: {
      name: 'Engineering',
      icon: '🔧',
      color: '#4ECDC4',
      description: 'Build and maintain the infrastructure that moves global trade',
      terrain: 'Industrial landscapes, construction sites, and innovation labs',
      climate: 'Technical, problem-solving, hands-on',
      roles: [
        {
          id: 'mech-engineer',
          title: 'Mechanical Engineer',
          level: 'Mid-Senior',
          icon: '🔩',
          description: 'Design and maintain mechanical systems and equipment',
          keySkills: ['Mechanical Design', 'CAD', 'Maintenance', 'Project Management'],
          growthPath: ['Graduate Engineer → Engineer → Senior Engineer → Principal Engineer'],
          demand: 'High',
          avgSalary: '$70K-$130K'
        },
        {
          id: 'automation',
          title: 'Automation Engineer',
          level: 'Mid-Senior',
          icon: '🤖',
          description: 'Develop automated systems for terminal operations',
          keySkills: ['PLC Programming', 'Robotics', 'Control Systems', 'Integration'],
          growthPath: ['Control Engineer → Automation Engineer → Principal Engineer → Director'],
          demand: 'Very High',
          avgSalary: '$80K-$150K'
        },
        {
          id: 'project-manager',
          title: 'Project Manager',
          level: 'Senior',
          icon: '📊',
          description: 'Lead engineering projects from concept to completion',
          keySkills: ['Project Management', 'Stakeholder Management', 'Budgeting', 'Leadership'],
          growthPath: ['Engineer → Project Engineer → Project Manager → Program Manager'],
          demand: 'High',
          avgSalary: '$90K-$160K'
        }
      ]
    },
    finance: {
      name: 'Finance',
      icon: '💰',
      color: '#FFD93D',
      description: 'Navigate financial waters and chart PSA\'s economic course',
      terrain: 'Trading floors, boardrooms, and financial markets',
      climate: 'Analytical, strategic, detail-oriented',
      roles: [
        {
          id: 'financial-analyst',
          title: 'Financial Analyst',
          level: 'Entry-Mid',
          icon: '📈',
          description: 'Analyze financial data and support business decisions',
          keySkills: ['Financial Analysis', 'Excel', 'Forecasting', 'Reporting'],
          growthPath: ['Junior Analyst → Analyst → Senior Analyst → Manager'],
          demand: 'Medium',
          avgSalary: '$55K-$95K'
        },
        {
          id: 'accountant',
          title: 'Accountant',
          level: 'Entry-Senior',
          icon: '📚',
          description: 'Manage accounts and ensure financial compliance',
          keySkills: ['Accounting', 'GAAP/IFRS', 'Audit', 'Financial Systems'],
          growthPath: ['Junior Accountant → Accountant → Senior Accountant → Finance Manager'],
          demand: 'Medium',
          avgSalary: '$50K-$90K'
        },
        {
          id: 'treasury',
          title: 'Treasury Manager',
          level: 'Senior',
          icon: '💎',
          description: 'Manage cash flow, investments, and financial risk',
          keySkills: ['Treasury Management', 'Risk Management', 'Financial Markets', 'Strategy'],
          growthPath: ['Treasury Analyst → Assistant Manager → Manager → Director'],
          demand: 'Medium',
          avgSalary: '$90K-$150K'
        }
      ]
    },
    hr: {
      name: 'Human Resources',
      icon: '👥',
      color: '#FF6B9D',
      description: 'Cultivate PSA\'s greatest asset - its people',
      terrain: 'Networks of talent, communities of growth, and pathways of development',
      climate: 'People-focused, collaborative, empathetic',
      roles: [
        {
          id: 'hr-bp',
          title: 'HR Business Partner',
          level: 'Mid-Senior',
          icon: '🤝',
          description: 'Strategic partner to business units on talent matters',
          keySkills: ['HR Strategy', 'Business Acumen', 'Change Management', 'Consulting'],
          growthPath: ['HR Generalist → HR BP → Senior BP → HR Director'],
          demand: 'High',
          avgSalary: '$70K-$130K'
        },
        {
          id: 'recruiter',
          title: 'Recruiter',
          level: 'Entry-Mid',
          icon: '🎯',
          description: 'Attract and hire top talent for PSA',
          keySkills: ['Sourcing', 'Interviewing', 'Employer Branding', 'ATS'],
          growthPath: ['Recruitment Coordinator → Recruiter → Senior Recruiter → Talent Lead'],
          demand: 'Medium',
          avgSalary: '$50K-$90K'
        },
        {
          id: 'training',
          title: 'Training Manager',
          level: 'Mid-Senior',
          icon: '📚',
          description: 'Design and deliver learning programs',
          keySkills: ['L&D', 'Training Design', 'Facilitation', 'LMS'],
          growthPath: ['Training Coordinator → Specialist → Manager → L&D Head'],
          demand: 'Medium',
          avgSalary: '$65K-$115K'
        }
      ]
    },
    data: {
      name: 'Data & AI',
      icon: '📊',
      color: '#9B59B6',
      description: 'Unlock insights from data and pioneer AI solutions',
      terrain: 'Data lakes, algorithm forests, and AI frontiers',
      climate: 'Innovative, analytical, cutting-edge',
      roles: [
        {
          id: 'data-scientist',
          title: 'Data Scientist',
          level: 'Mid-Senior',
          icon: '🔬',
          description: 'Extract insights and build predictive models',
          keySkills: ['Statistics', 'Machine Learning', 'Python/R', 'Visualization'],
          growthPath: ['Data Analyst → Data Scientist → Senior Scientist → Lead Scientist'],
          demand: 'Very High',
          avgSalary: '$85K-$160K'
        },
        {
          id: 'data-engineer',
          title: 'Data Engineer',
          level: 'Mid-Senior',
          icon: '🏗️',
          description: 'Build and maintain data infrastructure',
          keySkills: ['ETL', 'SQL', 'Big Data', 'Data Warehousing'],
          growthPath: ['Junior Engineer → Data Engineer → Senior Engineer → Principal Engineer'],
          demand: 'Very High',
          avgSalary: '$80K-$150K'
        },
        {
          id: 'ml-engineer',
          title: 'ML Engineer',
          level: 'Senior',
          icon: '🤖',
          description: 'Deploy and scale machine learning models',
          keySkills: ['MLOps', 'Deep Learning', 'Model Deployment', 'Cloud ML'],
          growthPath: ['Software Engineer → ML Engineer → Senior ML Engineer → ML Architect'],
          demand: 'Very High',
          avgSalary: '$95K-$180K'
        }
      ]
    }
  };

  const currentDivision = divisionData[division] || divisionData.it;
  const isCurrentDivision = currentDivision.name === currentDepartment;

  return (
    <div style={{
      background: '#1a1a2e',
      borderRadius: '12px',
      padding: '2rem',
      border: `2px solid ${currentDivision.color}`,
      minHeight: '700px'
    }}>
      {/* Continent Header */}
      <div style={{
        background: `linear-gradient(135deg, ${currentDivision.color}40 0%, transparent 100%)`,
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: `2px solid ${currentDivision.color}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          fontSize: '15rem',
          opacity: 0.1,
          lineHeight: 1
        }}>
          {currentDivision.icon}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>{currentDivision.icon}</div>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: currentDivision.color,
                margin: 0
              }}>
                {currentDivision.name}
              </h1>
              {isCurrentDivision && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: currentDivision.color,
                  color: '#000',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginTop: '0.5rem'
                }}>
                  <Ship size={16} />
                  YOUR CURRENT PORT
                </div>
              )}
            </div>
          </div>

          <p style={{
            fontSize: '1.2rem',
            color: '#fff',
            marginBottom: '1.5rem',
            maxWidth: '800px'
          }}>
            {currentDivision.description}
          </p>

          {/* Continent Info Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              border: `1px solid ${currentDivision.color}40`
            }}>
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '0.25rem' }}>
                🗺️ TERRAIN
              </div>
              <div style={{ fontSize: '0.9rem', color: '#fff' }}>
                {currentDivision.terrain}
              </div>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              border: `1px solid ${currentDivision.color}40`
            }}>
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '0.25rem' }}>
                🌡️ CLIMATE
              </div>
              <div style={{ fontSize: '0.9rem', color: '#fff' }}>
                {currentDivision.climate}
              </div>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              border: `1px solid ${currentDivision.color}40`
            }}>
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '0.25rem' }}>
                🎯 OPPORTUNITIES
              </div>
              <div style={{ fontSize: '0.9rem', color: '#fff' }}>
                {currentDivision.roles.length} Career Paths
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: currentDivision.color,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Compass size={24} />
          Available Positions
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {currentDivision.roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id === selectedRole ? null : role.id)}
              style={{
                background: selectedRole === role.id 
                  ? `linear-gradient(135deg, ${currentDivision.color}40 0%, #2b1d5a 100%)`
                  : 'linear-gradient(135deg, #2b1d5a 0%, #1a1a2e 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: selectedRole === role.id 
                  ? `3px solid ${currentDivision.color}`
                  : '2px solid rgba(162, 150, 202, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Demand Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.25rem 0.75rem',
                background: role.demand === 'Very High' 
                  ? '#4CAF50' 
                  : role.demand === 'High' 
                  ? '#FF9800' 
                  : '#2196F3',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '600'
              }}>
                {role.demand} Demand
              </div>

              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                {role.icon}
              </div>

              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '0.5rem'
              }}>
                {role.title}
              </h3>

              <div style={{
                fontSize: '0.8rem',
                color: currentDivision.color,
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {role.level}
              </div>

              <p style={{
                fontSize: '0.85rem',
                color: '#aaa',
                lineHeight: '1.5',
                marginBottom: '1rem'
              }}>
                {role.description}
              </p>

              <div style={{
                padding: '0.75rem',
                background: 'rgba(162, 150, 202, 0.1)',
                borderRadius: '6px',
                marginBottom: '0.75rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '0.25rem' }}>
                  💰 AVG SALARY
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: currentDivision.color }}>
                  {role.avgSalary}
                </div>
              </div>

              {selectedRole === role.id && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: `1px solid ${currentDivision.color}40`
                }}>
                  {/* Key Skills */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: currentDivision.color,
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Award size={14} />
                      KEY SKILLS
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {role.keySkills.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(162, 150, 202, 0.2)',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            color: '#fff',
                            border: '1px solid rgba(162, 150, 202, 0.4)'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Growth Path */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: currentDivision.color,
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <TrendingUp size={14} />
                      GROWTH PATH
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#aaa',
                      lineHeight: '1.6',
                      padding: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '6px',
                      borderLeft: `3px solid ${currentDivision.color}`
                    }}>
                      {role.growthPath[0]}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: currentDivision.color,
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      <BookOpen size={16} />
                      Learn More
                    </button>
                    {!isCurrentDivision && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTransitionPath(true);
                        }}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: 'rgba(162, 150, 202, 0.2)',
                          color: '#fff',
                          border: `2px solid ${currentDivision.color}`,
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Anchor size={16} />
                        Navigate Here
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!selectedRole || selectedRole !== role.id ? (
                <div style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentDivision.color,
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  Click to explore
                  <ChevronRight size={16} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Transition Path Modal */}
      {showTransitionPath && !isCurrentDivision && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: '#1a1a2e',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            border: `2px solid ${currentDivision.color}`,
            boxShadow: `0 0 50px ${currentDivision.color}40`
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              color: currentDivision.color,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Ship size={28} />
              Chart Your Course
            </h2>

            <p style={{ fontSize: '1rem', color: '#fff', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Ready to set sail from <strong style={{ color: '#A296ca' }}>{currentDepartment}</strong> to <strong style={{ color: currentDivision.color }}>{currentDivision.name}</strong>?
            </p>

            <div style={{
              background: 'rgba(162, 150, 202, 0.1)',
              padding: '1.25rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(162, 150, 202, 0.3)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: '#A296ca', marginBottom: '1rem' }}>
                Your Transition Journey:
              </h3>
              <ol style={{ paddingLeft: '1.5rem', color: '#fff', lineHeight: '2' }}>
                <li>Complete skill gap analysis</li>
                <li>Enroll in recommended courses</li>
                <li>Connect with mentors in {currentDivision.name}</li>
                <li>Apply for internal mobility program</li>
                <li>Start your new adventure!</li>
              </ol>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowTransitionPath(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'rgba(162, 150, 202, 0.2)',
                  color: '#fff',
                  border: '2px solid rgba(162, 150, 202, 0.4)',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Not Yet
              </button>
              <button
                onClick={() => {
                  setShowTransitionPath(false);
                  // Navigate to development plan
                }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: currentDivision.color,
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Compass size={20} />
                Start Planning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(162, 150, 202, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(162, 150, 202, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: '#A296ca', marginBottom: '0.5rem' }}>
            Ready to explore more?
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>
            Return to the world map to discover other continents
          </p>
        </div>
        <button
          onClick={onNavigate}
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #A296ca 0%, #7a6fa0 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 4px 15px rgba(162, 150, 202, 0.3)'
          }}
        >
          <Map size={20} />
          Back to World Map
        </button>
      </div>
    </div>
  );
};

export default ContinentView;