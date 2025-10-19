// CONTINENT VIEW COMPONENT

import React, { useState } from 'react';
import { Map, Compass, TrendingUp, Users, BookOpen, Award, ChevronRight, Ship, Anchor, X } from 'lucide-react';

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
      color: 'rgba(232, 180, 249, 0.6)',
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
      color: '#B8B5E8',
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
      color: '#C1AEDB',
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

    const handleNavigateToRole = (role) => {
    if (userData?.user_role === role.title) {
      return;
    }

    const currentSkills = userData?.skills?.map(s => s.skill_name) || [];
    const requiredSkills = role.keySkills;
    const missingSkills = requiredSkills.filter(skill => 
      !currentSkills.some(current => 
        current.toLowerCase().includes(skill.toLowerCase())
      )
    );

    setShowTransitionPath(true);
    setSelectedRole({
      ...role,
      missingSkills,
      estimatedTime: calculateTransitionTime(missingSkills.length)
    });
  };

  const handleViewRoleDetails = (role) => {
    setSelectedRole(role);
  };

  const calculateTransitionTime = (skillGapCount) => {
    if (skillGapCount === 0) return '0-3 months';
    if (skillGapCount <= 2) return '3-6 months';
    if (skillGapCount <= 4) return '6-12 months';
    return '12-18 months';
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

          {/* ADD THIS NEW SECTION - Navigate button for current continent */}
          {isCurrentDivision && (
            <button
              onClick={() => {
                // Scroll to roles section
                const rolesSection = document.querySelector('[class*="roles"]') || 
                                   document.querySelector('h2');
                if (rolesSection) {
                  rolesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: currentDivision.color,
                border: `2px solid ${currentDivision.color}`,
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                marginTop: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = currentDivision.color;
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = currentDivision.color;
              }}
            >
              <Anchor size={18} />
              Explore Different Roles Here
            </button>
          )}

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

      {/* Roles Section */}
        <div id="roles-section" style={{ marginTop: '2rem' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--psa-secondary)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Compass size={24} />
            Available Roles in {currentDivision.name}
          </h3>

          <div style={{ 
            display: 'grid', 
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
          }}>
            {currentDivision.roles.map((role) => {
              const isCurrentRole = userData?.user_role === role.title;
              
              return (
                <div
                  key={role.id}
                  style={{
                    background: isCurrentRole 
                      ? 'linear-gradient(135deg, rgba(162, 150, 202, 0.3) 0%, rgba(122, 111, 160, 0.2) 100%)'
                      : 'var(--psa-primary)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: isCurrentRole 
                      ? '3px solid var(--psa-secondary)' 
                      : '2px solid rgba(162, 150, 202, 0.3)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isCurrentRole && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'var(--psa-secondary)',
                      color: '#1d161e',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      <Anchor size={12} />
                      YOUR PORT
                    </div>
                  )}

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                      {role.icon}
                    </div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: '#fff',
                      marginBottom: '0.5rem'
                    }}>
                      {role.title}
                    </h4>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.75rem',
                      background: 'rgba(162, 150, 202, 0.2)',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: 'var(--psa-secondary)',
                      fontWeight: '600'
                    }}>
                      {role.level}
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#ccc',
                    marginBottom: '1.25rem'
                  }}>
                    {role.description}
                  </p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--psa-secondary)',
                      marginBottom: '0.5rem'
                    }}>
                      Key Skills:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {role.keySkills.map((skill, skillIdx) => (
                        <span
                          key={skillIdx}
                          style={{
                            padding: '0.4rem 0.75rem',
                            background: 'var(--psa-accent)',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            color: '#fff',
                            border: '1px solid rgba(162, 150, 202, 0.3)'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--psa-secondary)',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <TrendingUp size={14} />
                      Career Path:
                    </div>
                    {role.growthPath.map((path, pathIdx) => (
                      <div
                        key={pathIdx}
                        style={{
                          fontSize: '0.85rem',
                          color: '#aaa',
                          lineHeight: '1.8'
                        }}
                      >
                        {path}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>Demand</div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: role.demand === 'Very High' || role.demand === 'High' ? '#4CAF50' : '#FFA726'
                      }}>
                        {role.demand}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>Salary Range</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>
                        {role.avgSalary}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => handleNavigateToRole(role)}
                      disabled={isCurrentRole}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        background: isCurrentRole ? 'rgba(162, 150, 202, 0.3)' : 'linear-gradient(135deg, #A296ca 0%, #7a6fa0 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: isCurrentRole ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        opacity: isCurrentRole ? 0.7 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Ship size={18} />
                      {isCurrentRole ? 'Current Role' : 'Navigate Here'}
                    </button>

                    <button
                      onClick={() => handleViewRoleDetails(role)}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'transparent',
                        color: 'var(--psa-secondary)',
                        border: '2px solid var(--psa-secondary)',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronRight size={18} />
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
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
      {showTransitionPath && selectedRole && (
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
              background: 'var(--psa-dark)',
              border: '2px solid var(--psa-secondary)',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '2rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--psa-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Ship size={24} />
                  Chart Your Course
                </h3>
                <button
                  onClick={() => setShowTransitionPath(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'rgba(162, 150, 202, 0.1)',
                borderRadius: '12px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {selectedRole.icon}
                </div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>
                  {selectedRole.title}
                </h4>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  {selectedRole.description}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '1.1rem',
                  color: 'var(--psa-secondary)',
                  marginBottom: '1rem'
                }}>
                  Skills to Develop
                </h4>
                {selectedRole.missingSkills.length === 0 ? (
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(76, 175, 80, 0.1)',
                    borderRadius: '8px',
                    border: '2px solid rgba(76, 175, 80, 0.3)',
                    color: '#4CAF50',
                    textAlign: 'center'
                  }}>
                    ✓ You already have all the key skills for this role!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedRole.missingSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.75rem 1rem',
                          background: 'var(--psa-accent)',
                          borderRadius: '8px',
                          border: '1px solid rgba(162, 150, 202, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#fff'
                        }}
                      >
                        <Award size={16} color="var(--psa-secondary)" />
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '1.1rem',
                  color: 'var(--psa-secondary)',
                  marginBottom: '0.75rem'
                }}>
                  Estimated Timeline
                </h4>
                <div style={{
                  padding: '1rem',
                  background: 'rgba(162, 150, 202, 0.1)',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  color: '#fff'
                }}>
                  {selectedRole.estimatedTime}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowTransitionPath(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'transparent',
                    border: '2px solid rgba(162, 150, 202, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Create dev plan for:', selectedRole);
                    setShowTransitionPath(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #A296ca 0%, #7a6fa0 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <TrendingUp size={18} />
                  Create Dev Plan
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ContinentView;