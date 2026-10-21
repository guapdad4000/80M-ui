export const CONTACT_EMAIL = 'contact@80m.ai';
export const DRAFT_KEY = '80m-project-intake-v1';

export const services = [
  {
    id: 'build', label: 'Build it.', tag: 'Apps & websites',
    description: 'A custom app, website, store, or tool. Built around your idea.',
    startingPoints: ['Just an idea', 'A rough draft', 'Something already live', 'Help me figure it out'],
    question: 'What do you want to make?',
    hint: 'Who is it for, and what should it help them do? A few sentences is plenty.',
    example: 'I want a booking website for my studio. People should be able to see my work, choose a session, and get in touch.',
  },
  {
    id: 'fix', label: 'Fix it.', tag: 'Rework & rescue',
    description: 'A tired website, a stuck vibe-coded app, or a security review.',
    startingPoints: ['A live website', 'A vibe-coded app', 'An unfinished project', 'Not sure what’s wrong'],
    question: 'What needs a fresh pair of eyes?',
    hint: 'Tell us what exists, what is getting in the way, and what better would look like.',
    example: 'I built an app with AI, but sign-in is broken and I’m unsure about security. I need help getting it ready for real users.',
  },
  {
    id: 'create', label: 'Make it look right.', tag: 'Art & content',
    description: 'Refine AI art, shape a visual identity, or make content people notice.',
    startingPoints: ['AI art to refine', 'A brand to create', 'Content to make', 'Help me find a direction'],
    question: 'What are we making or refining?',
    hint: 'Where will it show up, and what should it feel like? Tell us what you have in mind.',
    example: 'I have AI-generated artwork for my launch. I want it refined into a consistent set of visuals for my website and social posts.',
  },
  {
    id: 'learn', label: 'Learn to build.', tag: 'Hands-on teaching',
    description: 'Learn to vibe-code by making something that matters to you.',
    startingPoints: ['Brand new to this', 'I’ve been experimenting', 'I’ve built a little', 'Ready for the next step'],
    question: 'What would you love to build yourself?',
    hint: 'Tell us what you want to learn, what you have tried, and where you could use a hand.',
    example: 'I want to build my own portfolio. I’ve tried a few prompts, but I need help understanding how to turn them into a working site.',
  },
];

export const steps = [
  { label: 'Your direction', note: 'What you need a hand with' },
  { label: 'Starting point', note: 'Where you are right now' },
  { label: 'The idea', note: 'What you want to make happen' },
  { label: 'Scope & timing', note: 'A little room to plan' },
  { label: 'About you', note: 'Who we’re building with' },
  { label: 'Review & send', note: 'Your brief, all together' },
];

const legacyServices = {
  'discovery-call': 'build', 'design-review': 'create', 'video-consult': 'create',
  'tech-setup': 'fix', 'strategy-call': 'build',
};

export function resolveService(value) {
  const id = legacyServices[value] || value;
  return services.some(service => service.id === id) ? id : '';
}

export function emptyData(serviceId = '') {
  return {
    serviceId, startingPoint: '', goal: '', links: '', budgetMode: 'discuss', budget: '',
    timingChoice: 'Flexible', timeline: '', name: '', email: '',
  };
}

export function readDraft(requestedService) {
  const serviceId = resolveService(requestedService);
  const fresh = { data: emptyData(serviceId), step: 0, furthest: 0 };
  try {
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
    if (!saved?.data || typeof saved.data !== 'object') return fresh;
    const data = emptyData();
    const limits = { goal: 3000, links: 1000, name: 120, email: 254, budget: 150, timeline: 150 };
    for (const key of Object.keys(data)) {
      if (typeof saved.data[key] === 'string') data[key] = saved.data[key].slice(0, limits[key] || 100);
    }
    data.serviceId = resolveService(data.serviceId);
    if (serviceId && serviceId !== data.serviceId) return { ...fresh, data: { ...data, serviceId, startingPoint: '' } };
    const service = services.find(item => item.id === data.serviceId);
    if (!service?.startingPoints.includes(data.startingPoint)) data.startingPoint = '';
    if (!['discuss', 'range'].includes(data.budgetMode)) data.budgetMode = 'discuss';
    if (!['Flexible', 'Next few weeks', 'This month', 'A specific window'].includes(data.timingChoice)) data.timingChoice = 'Flexible';
    const firstIncomplete = [0, 1, 2, 3, 4].find(index => Object.keys(validateStep(index, data)).length);
    const allowed = firstIncomplete ?? 5;
    const furthest = Math.max(0, Math.min(Number.isInteger(saved.furthest) ? saved.furthest : 0, allowed, 5));
    const step = Math.max(0, Math.min(Number.isInteger(saved.step) ? saved.step : 0, furthest));
    return { data, step, furthest };
  } catch { return fresh; }
}

export function validateStep(step, data) {
  const errors = {};
  const service = services.find(item => item.id === data.serviceId);
  if (step === 0 && !service) errors.serviceId = 'Choose a direction so we can ask the right questions.';
  if (step === 1 && !service?.startingPoints.includes(data.startingPoint)) errors.startingPoint = 'Choose the starting point that feels closest.';
  if (step === 2 && !data.goal.trim()) errors.goal = 'Tell us a little about what you have in mind.';
  if (step === 4) {
    if (!data.name.trim()) errors.name = 'What should we call you?';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Enter an email address we can reply to.';
  }
  return errors;
}

export function scopeAnswers(data) {
  return {
    budget: data.budgetMode === 'range' && data.budget.trim() ? data.budget.trim() : 'Let’s scope it together',
    timing: data.timingChoice === 'A specific window' ? data.timeline.trim() || 'A window to discuss' : data.timingChoice,
  };
}

export function buildBrief(data) {
  const service = services.find(item => item.id === data.serviceId);
  const { budget, timing } = scopeAnswers(data);
  return `80M PROJECT INQUIRY

Service: ${service?.label || 'To discuss'}
Starting point: ${data.startingPoint}
Name: ${data.name.trim()}
Email: ${data.email.trim()}

WHAT I WANT TO MAKE OR CHANGE
${data.goal.trim()}

EXISTING PROJECT / REFERENCES
${data.links.trim() || 'Not provided'}

BUDGET
${budget}

TIMING
${timing}`;
}

export function stepCopy(step, service) {
  return [
    ['What can we help you with?', 'Pick the closest fit. We can work out the details together.'],
    [service?.id === 'learn' ? 'Where are you starting?' : 'What are you bringing with you?', 'An idea counts. A rough draft counts. Start wherever you are.'],
    [service?.question, service?.hint],
    ['A little room to plan.', 'A rough idea is useful. “Let’s figure it out” is a good answer too.'],
    ['Who are we building with?', 'Just your name and the best email for the next conversation.'],
    ['Your next thing starts here.', 'Give it a once-over. You can edit any part before sharing.'],
  ][step];
}
