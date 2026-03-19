const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generateBlueprint = async (title, description) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file');
  }

  const prompt = `Generate a comprehensive SaaS blueprint for the following project:

Title: ${title}
Description: ${description}

Please provide a detailed analysis in the following JSON format:

{
  "marketFeasibility": {
    "overallScore": "8.3/10",
    "metrics": [
      {"name": "Uniqueness", "score": 8, "maxScore": 10},
      {"name": "Stickiness", "score": 7, "maxScore": 10},
      {"name": "Growth Trend", "score": 8, "maxScore": 10},
      {"name": "Pricing Potential", "score": 9, "maxScore": 10},
      {"name": "Upsell Potential", "score": 9, "maxScore": 10},
      {"name": "Customer Purchasing Power", "score": 8, "maxScore": 10}
    ]
  },
  "suggestedImprovements": [
    "Consider adding AI-driven competitive analysis to differentiate from existing solutions",
    "Implement interactive roadmap planning with real-time collaboration features",
    "Add financial modeling tools with scenario planning capabilities"
  ],
  "coreFeatures": [
    "SaaS idea validation and scoring system",
    "Interactive project planning with AI recommendations",
    "Market fit analysis with actionable insights",
    "Technical stack recommendations",
    "Development resource planning",
    "Features prioritization framework"
  ],
  "technicalRequirements": {
    "expertiseLevel": "Mid Developer",
    "techStack": [
      "Next.js 15",
      "React",
      "Tailwind CSS",
      "Uploadcare",
      "PostgreSQL",
      "TypeScript",
      "Framer Motion"
    ]
  },
  "pricingPlans": [
    {
      "name": "Starter",
      "price": "$29/mo",
      "description": "Perfect for solo entrepreneurs and small teams",
      "features": ["Basic visualization", "Core blueprint features", "Email support"]
    },
    {
      "name": "Pro",
      "price": "$199/mo",
      "description": "For growing teams and established startups",
      "features": ["Advanced visualization", "Priority support", "Custom integrations", "Team collaboration"]
    },
    {
      "name": "Enterprise",
      "price": "$799/mo",
      "description": "For established companies and large teams",
      "features": ["All Pro features", "Dedicated support", "Custom development", "White-label options"]
    }
  ]
}

Focus on providing realistic, actionable insights based on the project description.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SaaS consultant and technical architect. Provide detailed, realistic analysis and recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (response.status === 400) {
        throw new Error('Invalid request. Please check your input.');
      } else {
        throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
      }
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to parse the JSON response
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // If JSON parsing fails, return a structured error response
      return {
        error: 'Failed to parse AI response',
        rawResponse: content
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

export const generateUserFlow = async (projectTitle, projectDescription) => {
  // Demo data - no API call needed
  const demoUserFlow = {
    "userFlow": {
      "columns": [
        {
          "id": "discovery",
          "title": "Discovery & Onboarding",
          "color": "#3B82F6",
          "cards": [
            {
              "id": "landing-page",
              "title": "Landing Page Visit",
              "description": "User discovers the SaaS platform through marketing channels",
              "priority": "high",
              "estimatedTime": "2-3 minutes",
              "tags": ["marketing", "conversion"]
            },
            {
              "id": "signup",
              "title": "User Registration",
              "description": "New user creates account with email/password or social login",
              "priority": "high",
              "estimatedTime": "5-7 minutes",
              "tags": ["onboarding", "authentication"]
            },
            {
              "id": "onboarding",
              "title": "Onboarding Flow",
              "description": "Guided tour of key features and platform capabilities",
              "priority": "medium",
              "estimatedTime": "10-15 minutes",
              "tags": ["education", "retention"]
            },
            {
              "id": "email-verification",
              "title": "Email Verification",
              "description": "User verifies email address to activate account",
              "priority": "medium",
              "estimatedTime": "2-5 minutes",
              "tags": ["security", "verification"]
            }
          ]
        },
        {
          "id": "core-features",
          "title": "Core Features",
          "color": "#10B981",
          "cards": [
            {
              "id": "dashboard",
              "title": "Dashboard Overview",
              "description": "Main dashboard with key metrics and project overview",
              "priority": "high",
              "estimatedTime": "3-5 minutes",
              "tags": ["analytics", "overview"]
            },
            {
              "id": "project-creation",
              "title": "Create New Project",
              "description": "Start building a new SaaS blueprint with AI assistance",
              "priority": "high",
              "estimatedTime": "15-20 minutes",
              "tags": ["creation", "planning"]
            },
            {
              "id": "blueprint-generation",
              "title": "Generate Blueprint",
              "description": "AI-powered blueprint generation with market analysis",
              "priority": "high",
              "estimatedTime": "5-10 minutes",
              "tags": ["ai", "automation"]
            },
            {
              "id": "template-library",
              "title": "Template Library",
              "description": "Browse and use pre-built SaaS templates",
              "priority": "medium",
              "estimatedTime": "8-12 minutes",
              "tags": ["templates", "inspiration"]
            }
          ]
        },
        {
          "id": "analysis",
          "title": "Analysis & Planning",
          "color": "#F59E0B",
          "cards": [
            {
              "id": "market-analysis",
              "title": "Market Analysis",
              "description": "Review market feasibility scores and competitive landscape",
              "priority": "medium",
              "estimatedTime": "8-12 minutes",
              "tags": ["research", "validation"]
            },
            {
              "id": "feature-prioritization",
              "title": "Feature Prioritization",
              "description": "Prioritize features based on impact and development effort",
              "priority": "medium",
              "estimatedTime": "10-15 minutes",
              "tags": ["planning", "strategy"]
            },
            {
              "id": "technical-planning",
              "title": "Technical Planning",
              "description": "Review tech stack recommendations and architecture",
              "priority": "medium",
              "estimatedTime": "12-18 minutes",
              "tags": ["technical", "architecture"]
            },
            {
              "id": "pricing-strategy",
              "title": "Pricing Strategy",
              "description": "Define pricing tiers and monetization approach",
              "priority": "medium",
              "estimatedTime": "15-20 minutes",
              "tags": ["pricing", "business"]
            }
          ]
        },
        {
          "id": "execution",
          "title": "Execution & Launch",
          "color": "#EF4444",
          "cards": [
            {
              "id": "development",
              "title": "Development Phase",
              "description": "Build the MVP based on generated blueprint",
              "priority": "high",
              "estimatedTime": "2-4 weeks",
              "tags": ["development", "mvp"]
            },
            {
              "id": "testing",
              "title": "Testing & QA",
              "description": "Comprehensive testing of features and user flows",
              "priority": "medium",
              "estimatedTime": "1-2 weeks",
              "tags": ["quality", "testing"]
            },
            {
              "id": "beta-launch",
              "title": "Beta Launch",
              "description": "Soft launch with limited user base for feedback",
              "priority": "high",
              "estimatedTime": "1 week",
              "tags": ["launch", "feedback"]
            },
            {
              "id": "full-launch",
              "title": "Full Product Launch",
              "description": "Go live with the complete SaaS product",
              "priority": "high",
              "estimatedTime": "1 week",
              "tags": ["launch", "deployment"]
            }
          ]
        }
      ],
      "metrics": {
        "totalSteps": 16,
        "estimatedTime": "6-8 weeks",
        "successRate": "87%",
        "conversionRate": "14%"
      }
    }
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return demoUserFlow;
};