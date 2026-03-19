I need to build a SaaS application called SaaSgenius that solves the problem of turning raw startup ideas into production-ready SaaS blueprints for aspiring founders, developers, and product teams.
The core value proposition is: It helps users validate, structure, and plan their SaaS idea by generating a comprehensive and tailored business blueprint—including market analysis, technical recommendations, monetization strategy, and product roadmap—all within minutes.

The application should have the following high-level goals:
- Generate accurate and actionable SaaS blueprints from minimal user input.
- Evaluate market feasibility and suggest key differentiators and improvements.
- Provide clear, customizable outputs for tech stack, pricing plans, and go-to-market strategy
- Offer insightful analytics on productivity and bottlenecks
- Provide a visual, drag-and-drop interface for managing tasks


Technical Stack:
Frontend: Vite(React) with Tailwind CSS for styling 
Backend: react-router-dom routes and Supabase for additional backend functionality
Database: Supabase PostgreSQL
Authentication: Supabase Auth with social login options
State Management: React Context and SWR for data fetching
Hosting/Deployment: Vercel 


Additional Technologies:
- Chart.js for analytics visualizations
- react-beautiful-dnd for drag-and-drop functionality
- React Flow for userflow diagram builder


Core Features (in priority order):
1. User Management: Complete user system with roles and permissions
   - User registration and authentication
   - Role-based access control (Admin, Manager, Member)
   - Team creation and member invitations
2. AI-Powered SaaS Blueprint Generator:
   - Input: User enters a SaaS idea/problem description
   - Output: Full blueprint with business, market, and tech sections
   - GPT-powered processing
   - Structured output sections (market, features, tech stack, pricing, etc.)
   - Customization based on user goals (MVP, startup-ready, investor-ready)  


UI/UX Requirements:
Design Style: Modern, clean interface with subtle shadows and rounded corners
Color Scheme: Background : black (#0B0B0B), Primary: blue (#4300FF), Secondary: purple (#4D55CC), Neutral: slate gray (#7F8CAA)
Responsive Design: Mobile-first approach, with optimized layouts for tablet and desktop
Accessibility: WCAG AA compliance, with keyboard navigation support

Key UI Components:
- Navigation: Sidebar navigation on desktop, bottom navigation on mobile
- Task Cards: Visual representation of tasks with clear status indicators
- Dashboard Widgets: Compact, data-rich components with minimal visual noise

Layout Preferences:
- Use a card-based interface for main content areas
- Implement collapsible sections for complex forms
- Keep primary actions visible and easily accessible

Define the data structure and relationships:

Data Model:
1. User:
   - Fields: id (UUID), email (string), name (string), avatar (string), created_at (timestamp)
   - Relationships: has many Projects, has many Blueprints, has many Tasks (as assignee)

2. Project:
   - Fields: id (UUID), name (string), description (text), status (enum: draft | active | archived), owner_id (UUID), created_at (timestamp)
   - Relationships: belongs to User (owner), has many Blueprints, has many Tasks, has many Diagrams

3. Blueprint:
   - Fields: id (UUID), title (string), problem_statement (text), target_users (string), core_value (text), generated_data (jsonb), created_at (timestamp), project_id (UUID)
   - Relationships: belongs to Project

4. Task:
   - Fields: id (UUID), title (string), description (text), status (enum: todo | in_progress | done), priority (enum: low | medium | high), due_date (date), project_id (UUID), assignee_id (UUID), created_at (timestamp)
   - Relationships: belongs to Project, belongs to User (assignee)

5. Diagram:
   - Fields: id (UUID), name (string), nodes (jsonb), edges (jsonb), project_id (UUID), created_at (timestamp)
   - Relationships: belongs to Project

6. Suggestion:
   - Fields: id (UUID), blueprint_id (UUID), suggestion_type (string), content (text), created_at (timestamp)
   - Relationships: belongs to Blueprint

API Endpoints:  
1.Project Endpoints
GET    /api/projects               : Get all projects for the authenticated user
POST   /api/projects               : Create a new project
GET    /api/projects/:id           : Get project details
PUT    /api/projects/:id           : Update project details
DELETE /api/projects/:id           : Delete a project

2.Blueprint Endpoints
GET    /api/projects/:id/blueprints        : Get all blueprints in a project
POST   /api/projects/:id/blueprints        : Create/generate a blueprint
GET    /api/blueprints/:id                 : Get blueprint details
PUT    /api/blueprints/:id                 : Update blueprint content
DELETE /api/blueprints/:id                 : Delete a blueprint

3.Task Endpoints
GET    /api/projects/:id/tasks             : Get all tasks in a project
POST   /api/projects/:id/tasks             : Create a task
PUT    /api/tasks/:id                      : Update task status or details
DELETE /api/tasks/:id                      : Delete a task

4.Diagram Endpoints
GET    /api/projects/:id/diagrams          : Get all diagrams for a project
POST   /api/projects/:id/diagrams          : Create a new diagram
GET    /api/diagrams/:id                   : Get diagram data
PUT    /api/diagrams/:id                   : Update diagram nodes/edges
DELETE /api/diagrams/:id                   : Delete diagram

5.Suggestion Endpoints
GET    /api/blueprints/:id/suggestions     : Get all AI suggestions for a blueprint
POST   /api/blueprints/:id/suggestions     : Generate new suggestions (AI call)


Authentication:
Provider: Supabase Auth
Methods: Email/password, Google OAuth, GitHub OAuth
Flow: Redirect-based auth with JWT tokens stored securely

Authorization:
Role System: Three-tier role system: Admin, Manager, Member
Permission Model: Row-level security (RLS) in Supabase with policy functions
Security Considerations:
- Implement CSRF protection
- Set proper secure and httpOnly flags for cookies
- Apply rate limiting on authentication endpoints

Payment Requirements:
Provider: Stripe
Pricing Model: Monthly and annual subscription plans
Plans:
- Free: Basic features, limit of 3 projects and 5 team members
- Pro ($12/user/month): Unlimited projects, advanced reporting
- Enterprise ($25/user/month): Custom fields, priority support, SAML SSO
Features:
- Seamless checkout experience
- Automatic billing and invoicing
- Proration for plan changes
- Team seat management

Deployment Strategy:
Hosting: Vercel for frontend and serverless functions
CI/CD: GitHub Actions for testing, Vercel for deployment
Environment Setup:
- Development, staging, and production environments
- Environment-specific variables for API keys and endpoints
- Database migrations handled via Supabase migration tools


Development Constraints:
Focus first on:Core user authentication and basic project management functionality
Required for MVP:
-User registration & login
-Project creation, viewing, updating, and deletion (CRUD)
-Basic task management with drag-and-drop task flow (e.g., To Do → In Progress → Done)
Nice to have:
-Analytics dashboard for tracking blueprint performance or task activity
-Email notifications on task assignment or blueprint generation
-Activity logs for project and blueprint changes
-Export blueprint as PDF
Do not implement:
-Real-time chat or messaging
-File upload or cloud storage integration
-Time tracking or timesheet logging
-Multi-language support
-Full access roles/permissions beyond basic user