export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  skills: string[];
  image?: string;
  initials: string;
  github?: string;
  linkedin?: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Krishna Pratik',
    role: 'Founder',
    bio: "The visionary behind Devnexus Studio. Krishna architected the company's core philosophy of building software that pushes boundaries and sets new standards.",
    skills: ['Leadership', 'Full-Stack', 'System Architecture'],
    image: '/team/krishna-pratik.jpg',
    initials: 'KP',
    github: 'https://github.com/Krishna-Pratik',
    linkedin: 'https://www.linkedin.com/in/krishna-pratik',
  },
  {
    name: 'Manish Upadhyay',
    role: 'Co-Founder',
    bio: "Co-architect of Devnexus's growth strategy. Manish blends technical depth with business acumen to drive meaningful product decisions.",
    skills: ['Business Strategy', 'Backend', 'Product Management'],
    image: '/team/manish-upadhyay.jpeg',
    initials: 'MU',
    github: 'https://github.com/ManishUpadhyay-dev',
    linkedin: 'https://linkedin.com/in/manish-upadhyay-838aa13a2',
  },
  {
    name: 'Aditya Kumar',
    role: 'CTO',
    bio: 'The technical backbone of Devnexus. Aditya drives architectural decisions, tech innovation, and engineering culture with precision and passion.',
    skills: ['System Design', 'Cloud', 'AI/ML', 'DevOps'],
    image: '/team/aditya-kumar.jpeg',
    initials: 'AK',
    github: 'https://github.com/Adiii-ku',
    linkedin: 'https://www.linkedin.com/in/aditya-kumar-729891275',
  },
  {
    name: 'Prince Pandey',
    role: 'Director',
    bio: 'Prince oversees key partnerships, project delivery, and business development - ensuring Devnexus always operates at its highest potential.',
    skills: ['Business Dev', 'Project Management', 'Strategy'],
    image: '/team/prince-pandey.jpeg',
    initials: 'PP',
    github: 'https://github.com/Prince11235',
    linkedin: 'https://www.linkedin.com/in/prince-pandey-689b85274',
  },
];
