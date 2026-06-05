const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

const sampleJobs = [
  {
    title: 'Senior Frontend React Developer',
    description: 'We are seeking a talented Senior Frontend Developer with expertise in React.js and modern state management. You will build and optimize user-facing dashboards and work closely with product designers to create premium experiences.',
    location: 'San Francisco, CA',
    salaryRange: { min: 120000, max: 160000 },
    jobType: 'Full-time',
    workplaceType: 'Hybrid',
    experienceLevel: 'Senior',
    requirements: ['React.js', 'Tailwind CSS', 'Redux Toolkit / Context API', 'REST & GraphQL APIs', '5+ years experience'],
    responsibilities: ['Build modular, reusable React elements', 'Optimize components for responsive performance', 'Mentor junior and mid-level web developers', 'Participate in agile sprints and design reviews'],
    benefits: ['Comprehensive medical/dental/vision', '401(k) matching up to 5%', 'Unlimited paid time off', 'Annual home-office hardware allowance'],
  },
  {
    title: 'Junior Full Stack Engineer',
    description: 'Join our growing engineering team as a Junior Full Stack developer. You will assist in building features across our Node.js backends and React frontends, debugging APIs, and deploying serverless functions.',
    location: 'Remote',
    salaryRange: { min: 75000, max: 95000 },
    jobType: 'Full-time',
    workplaceType: 'Remote',
    experienceLevel: 'Entry-level',
    requirements: ['Node.js & Express', 'MongoDB / Mongoose', 'HTML/CSS/Javascript', 'Git & GitHub workflows'],
    responsibilities: ['Write clean, readable backend APIs', 'Integrate frontend forms with backend systems', 'Debug database queries and optimize indexes', 'Draft automated unit and integration tests'],
    benefits: ['100% remote workspace setup stipend', 'Health savings account contribution', 'Career mentorship and training stipend', 'Generous parental leave policy'],
  },
  {
    title: 'UI/UX Designer',
    description: 'Acme is looking for a creative UI/UX designer to lead redesign initiatives across our core products. You will build wireframes, high-fidelity mockups, and work closely with frontend developers to bring designs to life.',
    location: 'New York, NY',
    salaryRange: { min: 90000, max: 130000 },
    jobType: 'Full-time',
    workplaceType: 'Onsite',
    experienceLevel: 'Mid-level',
    requirements: ['Figma / Adobe XD', 'Wireframing & prototyping', 'User research & usability testing', 'Basic understanding of HTML/CSS'],
    responsibilities: ['Create visual design patterns and mockups', 'Conduct user interviews to gather product feedback', 'Develop interactive user flow designs', 'Maintain and scale our Figma design systems'],
    benefits: ['Onsite gym membership and subsidized lunches', 'Annual conference attendance ticket', 'Comprehensive dental and medical coverage', 'Stock option options availability'],
  },
  {
    title: 'Data Science Intern',
    description: 'We are offering a summer internship for an aspiring Data Scientist. You will work on cleaning raw datasets, training predictive ML models, and visualizing business intelligence metrics.',
    location: 'Austin, TX',
    salaryRange: { min: 50000, max: 70000 },
    jobType: 'Internship',
    workplaceType: 'Hybrid',
    experienceLevel: 'Entry-level',
    requirements: ['Python (Pandas, Numpy, Scikit-learn)', 'SQL querying', 'Data visualization tools (Tableau/Matplotlib)', 'Currently studying CS or related major'],
    responsibilities: ['Clean and pre-process tabular datasets', 'Perform exploratory data analysis sessions', 'Train simple regression and classification models', 'Build interactive dashboards for executive summaries'],
    benefits: ['Subsidized commuter passes', 'Flexible internship duration options', 'Weekly team happy hours and outings', 'Strong potential for transition to full-time post grad'],
  },
  {
    title: 'Engineering Lead (Node / AWS)',
    description: 'We are seeking an Engineering Lead to architect and support our high-traffic API platform. You will make core system decisions, direct technical roadmaps, and oversee security standards.',
    location: 'Seattle, WA',
    salaryRange: { min: 160000, max: 210000 },
    jobType: 'Full-time',
    workplaceType: 'Onsite',
    experienceLevel: 'Lead',
    requirements: ['Node.js microservices', 'AWS (Lambda, S3, RDS, ECS)', 'Docker & Kubernetes container systems', 'System design architectures', '8+ years experience'],
    responsibilities: ['Architect database systems and backend APIs', 'Oversee security reviews and CI/CD pipelines', 'Establish engineering best-practices and conventions', 'Manage developer sprints and coordinate deliverables'],
    benefits: ['Comprehensive health and life insurance plans', 'Generous ESPP (Employee Stock Purchase Plan)', 'Fully funded parking and travel vouchers', '4 weeks paid annual vacation allowance'],
  }
];

const seedDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobboard';
    await mongoose.connect(connString);
    console.log('Connected to MongoDB database...');

    // Clear existing collections
    await User.deleteMany();
    await Profile.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    console.log('Cleared existing records from database.');

    // Create a seed Recruiter
    const recruiterUser = await User.create({
      name: 'Jane Employer',
      email: 'recruiter@example.com',
      password: 'password123', // Will be hashed in pre-save hook
      role: 'recruiter'
    });

    // Create Recruiter Profile
    const recruiterProfile = await Profile.create({
      userId: recruiterUser._id,
      role: 'recruiter',
      companyName: 'Vortex Tech Solutions',
      companyLogo: '',
      website: 'https://vortextech.com',
      industry: 'Software & Technology Services',
      companySize: '51-200',
      description: 'Vortex is a global technology company providing cloud systems and premium interface solutions.'
    });
    console.log('Created seed recruiter account (recruiter@example.com / password123).');

    // Create a seed Candidate
    const candidateUser = await User.create({
      name: 'Alex Candidate',
      email: 'candidate@example.com',
      password: 'password123', // Will be hashed in pre-save hook
      role: 'candidate'
    });

    // Create Candidate Profile
    await Profile.create({
      userId: candidateUser._id,
      role: 'candidate',
      skills: ['React.js', 'Tailwind CSS', 'Node.js', 'MongoDB'],
      experience: [
        {
          title: 'Frontend Developer Intern',
          company: 'AppInc',
          duration: 'Jun 2024 - Dec 2024',
          description: 'Constructed responsive page grids using React and Tailwind, increasing mobile engagement by 15%.'
        }
      ],
      education: [
        {
          school: 'State University',
          degree: 'B.S.',
          field: 'Computer Science',
          year: '2025'
        }
      ],
      resume: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCjIgMCBvYmoKICA8PCAvVHlwZSAvUGFnZXMKICAgICAvS2lkcyBbIDMgMCBSIF0KICAgICAvQ291bnQgMQogID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UKICAgICAvUGFyZW50IDIgMCBSCiAgICAgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXQogICAgIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDQgMCBSID4+ID4+CiAgICAgL0NvbnRlbnRzIDUgMCBSCiAgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvVHlwZSAvRm9udAogICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgIC9CYXNlRm9udCAvSGVsdmV0aWNhCiAgPj4KZW5kb2JqCjUgMCBvYmoKICA8PCAvTGVuZ3RoIDgwID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooQWxleCBDYW5kaWRhdGUgLSBSZXN1bWUpIFRqCjAgLTMwIFRkCigxKyB5ZWFycyBleHBlcmllbmNlIGJ1aWxkaW5nIHJlYWN0IHdlYiBhcHBsaWNhdGlvbnMuKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNyAwMDAwMCBuIAowMDAwMDAwMDc5IDA5MDAwIG4gCjAwMDAwMDAxNDQgMDAwMDAgbiAK0MDAwMDAwMjQ5IDAwMDAwIG4gCjAwMDAwMDAzMTggMDAwMDAgbiAKdHJhaWxlcgogIDw8IC9TaXplIDYKICAgICAvUm9vdCAxIDAgUgogID4+CnN0YXJ0eHJlZgogIDQ0OAolJUVPRgo=',
      resumeName: 'Alex_Candidate_Resume.pdf'
    });
    console.log('Created seed candidate account (candidate@example.com / password123).');

    // Create Jobs
    for (const job of sampleJobs) {
      await Job.create({
        ...job,
        recruiterId: recruiterUser._id,
        companyName: recruiterProfile.companyName,
        companyLogo: recruiterProfile.companyLogo,
        views: Math.floor(Math.random() * 25) + 5,
      });
    }
    console.log(`Seeded ${sampleJobs.length} sample job vacancies.`);

    console.log('Database Seeding Successful.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
