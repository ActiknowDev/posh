export const SCENARIOS = [
  {
    id: 'scen_1',
    title: 'Scenario 1: Team Outing',
    story: 'During a company dinner, a colleague repeatedly asks another employee personal questions about dating and relationships. The employee gives short answers and tries to leave the conversation. The colleague follows and says, "Why are you acting so serious? I\'m just being friendly."',
    question: 'What should the colleague have done?',
    options: [
      { id: 'A', text: 'Continue because it was outside office hours.' },
      { id: 'B', text: 'Stop when the employee appeared uncomfortable.' },
      { id: 'C', text: 'Ask the team to convince the employee to relax.' },
      { id: 'D', text: 'Send more messages after the dinner via social media.' }
    ],
    correctAnswer: 'B',
    feedback: 'Correct. Social settings connected to work still require professional behaviour and respect for personal boundaries.',
    audioDurationText: '0:14'
  },
  {
    id: 'scen_2',
    title: 'Scenario 2: WhatsApp Group',
    story: 'A sexual meme is posted in a team WhatsApp group. A few people laugh. One person leaves the group quietly because they feel uncomfortable.',
    question: 'What is the best response for other team members / manager?',
    options: [
      { id: 'A', text: 'Forward it to other friends inside the company.' },
      { id: 'B', text: 'Ignore it because everyone jokes around nowadays.' },
      { id: 'C', text: 'Ask that such content not be shared in work groups, and inform HR/IC if needed.' },
      { id: 'D', text: 'Add the person back and tell them not to be so sensitive.' }
    ],
    correctAnswer: 'C',
    feedback: 'Correct. Work groups must remain professional. Sexual content, even digitally, can create a hostile work environment.',
    audioDurationText: '0:12'
  },
  {
    id: 'scen_3',
    title: 'Scenario 3: Senior Employee Pressure',
    story: 'A senior employee tells a junior colleague, "If you come out with me this weekend, I\'ll make sure you get assigned to the prestigious international project."',
    question: 'What is the main issue with this conduct?',
    options: [
      { id: 'A', text: 'No issue, because it is only a suggestion, not a direct command.' },
      { id: 'B', text: 'It is a clear case of sexual harassment (Quid Pro Quo) because a work opportunity is being linked to personal attention.' },
      { id: 'C', text: 'It is okay if the junior employee does not file a complaint immediately.' },
      { id: 'D', text: 'It is only wrong if money or physical gifts are exchanged.' }
    ],
    correctAnswer: 'B',
    feedback: 'Correct. Linking work advancement, allocations, or benefits to personal or sexual favors is a severe violation called Quid Pro Quo (this-for-that) harassment.',
    audioDurationText: '0:15'
  },
  {
    id: 'scen_4',
    title: 'Scenario 4: Bystander Response',
    story: 'You see a colleague looking highly uncomfortable while another colleague stands extremely close and makes personal, suggestive comments.',
    question: 'What can you do safely as a bystander?',
    options: [
      { id: 'A', text: 'Laugh along so that the situation does not become awkward for everyone.' },
      { id: 'B', text: 'Create a helpful interruption, check privately if they are okay, and guide them to support.' },
      { id: 'C', text: 'Record with your phone secretly and share in office group chats.' },
      { id: 'D', text: 'Tell the uncomfortable colleague to just ignore it and move on.' }
    ],
    correctAnswer: 'B',
    feedback: 'Correct. Bystanders play a vital role. Direct assistance, distraction, or checking-in can defuse situations and offer immediate, safe support.',
    audioDurationText: '0:13'
  },
  {
    id: 'scen_5',
    title: 'Scenario 5: Manager Mishandling',
    story: 'An employee reports receiving repeated inappropriate late-night messages from a colleague. The manager says, "He is a top performer. Let\'s not make it official. I\'ll just speak to him informally and warn him."',
    question: 'What is wrong with the manager\'s response?',
    options: [
      { id: 'A', text: 'Nothing. Managers have the authority to settle complaints informally.' },
      { id: 'B', text: 'The manager is correctly trying to protect team productivity.' },
      { id: 'C', text: 'The manager must guide the employee to the formal IC/POSH process and protect confidentiality instead of settling it privately.' },
      { id: 'D', text: 'The manager should ask the reporting employee to change teams to avoid confrontation.' }
    ],
    correctAnswer: 'C',
    feedback: 'Correct. Managers are not legal investigators. They must never suppress or informally "settle" harassment or push it under the rug.',
    audioDurationText: '0:16'
  },
  {
    id: 'scen_6',
    title: 'Scenario 6: Rumours and Gossip',
    story: 'You hear that a formal POSH complaint has been filed. Several colleagues are aggressively discussing names and speculating about details in the dining area.',
    question: 'What should you do?',
    options: [
      { id: 'A', text: 'Ask for more details to understand who is telling the truth.' },
      { id: 'B', text: 'Share what you heard with close colleague friends.' },
      { id: 'C', text: 'Explain that POSH matters are strictly confidential, avoid participating, and refrain from speculation.' },
      { id: 'D', text: 'Form a support group in the office to judge the respondent before the inquiry concludes.' }
    ],
    correctAnswer: 'C',
    feedback: 'Correct. Maintaining strict confidentiality is a legal mandate under POSH and protects everyone\'s rights and safety during the process.',
    audioDurationText: '0:11'
  },
  {
    id: 'scen_7',
    title: 'Scenario 7: The Ended Romance',
    story: 'Neha and Amit, two software engineers in the same team, were in a consensual romantic relationship for six months. After they broke up, Amit repeatedly sends her late-night messages asking to get back together, leaves romantic notes on her desk, and questions colleagues about who she is meeting outside work. Neha told Amit clearly that these messages are unwelcome and must stop, but Amit says, "We have a history, so trying to fix this isn\'t a POSH issue."',
    question: 'Is Amit\'s behavior a POSH violation?',
    options: [
      { id: 'A', text: 'No, because they have a personal history and it is a private matter, not workplace harassment.' },
      { id: 'B', text: 'No, since Amit has no bad intention and is only trying to reconcile a previous relationship.' },
      { id: 'C', text: 'Yes, because once a relationship ends, any continued unwelcome attention of a personal or romantic nature is a clear POSH violation if it occurs in a work-connected setting.' },
      { id: 'D', text: 'Only if Amit threatens Neha\'s professional performance rating or career prospects.' }
    ],
    correctAnswer: 'C',
    feedback: 'Correct! Consent is not permanent. Once a relationship ends, prior consent is revoked. Any continued, unwelcome personal or romantic attention is evaluated strictly as unwelcome conduct under POSH.',
    audioDurationText: '0:18'
  },
  {
    id: 'scen_8',
    title: 'Scenario 8: Reporting Lines Consensual Relationship',
    story: 'A team lead begins dating a software engineer who reports directly to them on team projects. They keep the relationship secret to avoid office gossip, but team members notice that the team lead consistently assigns the engineer the best clients and gives them high performance ratings.',
    question: 'What is the correct expectation under compliance guidelines?',
    options: [
      { id: 'A', text: 'Nothing, since the relationship is consensual, they have a right to privacy without HR or management interference.' },
      { id: 'B', text: 'The team lead must immediately disclose the relationship to HR so that reporting lines can be restructured to eliminate conflicts of interest, appraisals bias, and power disparities.' },
      { id: 'C', text: 'The team lead should ask other team members to ignore it to preserve team harmony.' },
      { id: 'D', text: 'The software engineer must transfer to another company to avoid any compliance issues.' }
    ],
    correctAnswer: 'B',
    feedback: 'Correct! Consensual romance itself is not banned, but relationships involving direct or indirect reporting lines create severe conflicts of interest and compromise workplace fairness. Immediate disclosure to HR is required to restructure reporting roles.',
    audioDurationText: '0:19'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Which word is absolutely central to understanding workplace sexual harassment?',
    options: [
      { id: 'A', text: 'Seniority' },
      { id: 'B', text: 'Unwelcome' },
      { id: 'C', text: 'Humour' },
      { id: 'D', text: 'Performance' }
    ],
    correctAnswer: 'B',
    feedback: 'Correct! The main criterion is whether the conduct is unwelcome to the recipient, regardless of the sender\'s intent.'
  },
  {
    id: 'q2',
    question: 'Can workplace sexual harassment occur through messaging apps, emails, or online meetings?',
    options: [
      { id: 'A', text: 'Yes, if connected to work, clients, or workplace relationships.' },
      { id: 'B', text: 'No, only physical, in-office behavior counts under the law.' },
      { id: 'C', text: 'Only if sent using official company email during office hours.' },
      { id: 'D', text: 'Only if it involves video recordings.' }
    ],
    correctAnswer: 'A',
    feedback: 'Correct. The virtual workplace (Work from Home, chat apps like WhatsApp/Slack, emails) is fully recognized under the POSH framework.'
  },
  {
    id: 'q3',
    question: 'What is a manager required to do when an employee shares a POSH concern?',
    options: [
      { id: 'A', text: 'Conduct a private investigation and assign punishments.' },
      { id: 'B', text: 'Ask the employee to manage it or ignore it.' },
      { id: 'C', text: 'Listen respectfully, maintain strict confidentiality, and guide them to the IC or POSH coordinator.' },
      { id: 'D', text: 'Warn the respondent casually over coffee.' }
    ],
    correctAnswer: 'C',
    feedback: 'Correct. Managers must route concerns to the Internal Committee (IC) and not handle/judge instances informally.'
  },
  {
    id: 'q4',
    question: 'What must employees absolutely avoid in relation to POSH complaints under company policy?',
    options: [
      { id: 'A', text: 'Maintaining confidentiality' },
      { id: 'B', text: 'Cooperating with the IC inquiry' },
      { id: 'C', text: 'Gossip, rumors, and retaliation' },
      { id: 'D', text: 'Supporting the safe process' }
    ],
    correctAnswer: 'C',
    feedback: 'Correct! Gossip, leaks of identity, or retaliation against the complainant or witnesses is highly illegal and results in strict disciplinary action.'
  },
  {
    id: 'q5',
    question: 'If someone says they were "just joking", does that automatically clear them of harassment?',
    options: [
      { id: 'A', text: 'Yes, because jokes show there was no bad intent.' },
      { id: 'B', text: 'No, because the impact, context, and whether it was unwelcome are what matter.' },
      { id: 'C', text: 'Only if other teammates who witnessed it laughed as well.' },
      { id: 'D', text: 'Only if it happened for the very first time.' }
    ],
    correctAnswer: 'B',
    feedback: 'Correct. Intent is not a defense. Conduct is assessed by the impact on the recipient and whether a reasonable person would find it hostile or unwelcome.'
  }
];

export const ALL_SLIDES = [
  {
    id: 'slide_1',
    moduleId: 1,
    moduleTitle: 'Welcome & Why It Matters',
    title: 'Prevention of Sexual Harassment (POSH)',
    subtitle: 'A practical training module for a safe and respectful workplace',
    type: 'title',
    audioScript: 'Welcome. This digital session is designed to help you understand respectful workplace behaviour under India\'s POSH Act, identify inappropriate conduct, and know your rights and resources.'
  },
  {
    id: 'slide_2',
    moduleId: 1,
    moduleTitle: 'Welcome & Why It Matters',
    title: 'Why This Training Matters',
    subtitle: 'A respectful environment is a right, not a privilege',
    type: 'click-reveal',
    audioScript: 'This training helps you identify boundaries, understand the legal framework, know what to do if an incident happens, and learn how to help maintain a completely safe, dignified, and supportive environment.'
  },
  {
    id: 'slide_3',
    moduleId: 1,
    moduleTitle: 'Welcome & Why It Matters',
    title: 'How This Module Works',
    subtitle: 'Active learning, not passive lecturing',
    type: 'info',
    audioScript: 'We will walk through quick theories, clear examples, interactive quizzes, and case situations. You cannot skip interactions, as completion records are tracked for regulatory compliance.'
  },
  {
    id: 'slide_4',
    moduleId: 1,
    moduleTitle: 'Welcome & Why It Matters',
    title: 'Important Compliance Note',
    subtitle: 'Training Disclaimer',
    type: 'info',
    audioScript: 'Please note: This course offers educational guidance on POSH Act concepts. It does not replace legal-consultant advice or our official POSH Policy Document. Let\'s proceed.'
  },
  {
    id: 'slide_5',
    moduleId: 2,
    moduleTitle: 'What is Sexual Harassment?',
    title: 'The Core Concept',
    subtitle: 'Understanding the legal threshold',
    type: 'click-reveal',
    audioScript: 'Under Indian Law, sexual harassment includes any unwelcome acts or behaviours of a sexual nature. The most crucial word here is "unwelcome" — meaning it is uninvited, unwanted, and offensive to the recipient.'
  },
  {
    id: 'slide_6',
    moduleId: 2,
    moduleTitle: 'What is Sexual Harassment?',
    title: 'Recognising Forms of Harassment',
    subtitle: 'The 5 categorized forms of behavior',
    type: 'flip-cards',
    audioScript: 'Sexual harassment can occur in multiple ways: physical, verbal, digital, non-verbal, or environment-based. Click through these interactive cards to explore distinct workplace examples.'
  },
  {
    id: 'slide_7',
    moduleId: 2,
    moduleTitle: 'What is Sexual Harassment?',
    title: 'Intent vs. Impact',
    subtitle: 'Which governs workplace behavior?',
    type: 'quiz-single',
    audioScript: 'A common excuse is: "I didn\'t mean it that way, I was just being friendly." Test your understanding on this concept here.'
  },
  {
    id: 'slide_8',
    moduleId: 2,
    moduleTitle: 'What is Sexual Harassment?',
    title: 'Consent & comfort signals',
    subtitle: 'Recognising early signs of discomfort',
    type: 'consent-slider',
    audioScript: 'Politeness or silence does not equal consent. Use the interactive slider to view subtle non-verbal signs that indicate an employee is feeling uncomfortable or tense.'
  },
  {
    id: 'slide_9',
    moduleId: 2,
    moduleTitle: 'What is Sexual Harassment?',
    title: 'Defining the "Workplace"',
    subtitle: 'Expanding beyond the physical layout',
    type: 'timeline',
    audioScript: 'The "Workplace" under POSH is broad. It includes the office, transport provided by the firm, offsites, client premises, team dinners, virtual Slack spaces, and late-night calls.'
  },
  {
    id: 'slide_10',
    moduleId: 3,
    moduleTitle: 'Workplace Situations & Grey Areas',
    title: 'Grey Areas & Office Conduct',
    subtitle: 'Navigating professional boundaries',
    type: 'info',
    audioScript: 'Not every awkward moment is a legal POSH case, but boundary-pushing behaviour is where escalation begins. The safest rule of work conduct is: respect personal boundaries instantly.'
  },
  {
    id: 'slide_11',
    moduleId: 3,
    moduleTitle: 'Workplace Situations & Grey Areas',
    title: 'Compliment or Inappropriate Remarks?',
    subtitle: 'Quick boundary check',
    type: 'quiz-single',
    audioScript: 'Commenting "You look hot in that dress" is sexual and highly inappropriate at work, unlike standard professional praises like "That outline was very well prepared."'
  },
  {
    id: 'slide_12',
    moduleId: 3,
    moduleTitle: 'Workplace Situations & Grey Areas',
    title: 'Digital Harassment Rules',
    subtitle: 'Workplace chats are official records',
    type: 'info',
    audioScript: 'Late night informal messages saying "Send a selfie" or "Let\'s keep this secret" create an abusive atmosphere and are fully actionable under Indian workplace compliance laws.'
  },
  {
    id: 'slide_13',
    moduleId: 3,
    moduleTitle: 'Workplace Situations & Grey Areas',
    title: 'Humor & Safe Work Atmosphere',
    subtitle: 'Categorize safe vs risky humor',
    type: 'drag-drop',
    audioScript: 'Drag and drop standard office jokes vs. boundary-pushing jokes to see how casual humour can contribute to a hostile workplace environment if not corrected.'
  },
  {
    id: 'slide_14',
    moduleId: 3,
    moduleTitle: 'Workplace Situations & Grey Areas',
    title: 'The Role of Power Dynamics',
    subtitle: 'Why hierarchy complicates consent',
    type: 'click-reveal',
    audioScript: 'Power dynamics are highly critical. If a senior person requests personal space, the junior employee might feel unable to refuse for fear of negative performance ratings or losing their job.'
  },
  {
    id: 'slide_14_a',
    moduleId: 3,
    moduleTitle: 'Workplace Situations & Grey Areas',
    title: 'Relationships Between Employees',
    subtitle: 'Consent, Reporting Lines, and HR Disclosures',
    type: 'click-reveal',
    audioScript: 'Consensual romantic relationships between employees are not banned, but they carry risks. If employees in a direct reporting line are dating, they must disclose it to HR so that reporting lines can be restructured to remove bias risks.'
  },
  {
    id: 'slide_14_b',
    moduleId: 3,
    moduleTitle: 'Workplace Situations & Grey Areas',
    title: 'When Romances End',
    subtitle: 'Transitioning back to professional boundaries',
    type: 'quiz-single',
    audioScript: 'If a workplace romance or dating relationship ends, prior consent is fully revoked. Any continued unwelcome attention, romantic messages, or monitoring is considered sexual harassment.'
  },
  {
    id: 'slide_15',
    moduleId: 3,
    moduleTitle: 'Workplace Situations & Grey Areas',
    title: 'Bystander Responsibility',
    subtitle: 'Act, don\'t spectate',
    type: 'checklist',
    audioScript: 'If you witness inappropriate behaviour: don\'t gossip, laugh, or turn a blind eye. Instead, check on the affected colleague and offer them a safe, supportive path forward.'
  },
  {
    id: 'slide_16',
    moduleId: 4,
    moduleTitle: 'What Should You Do?',
    title: 'Action Steps If Harassed',
    subtitle: 'Your immediate response options',
    type: 'click-reveal',
    audioScript: 'If you face inappropriate behavior: say no clearly, keep records like screenshot logs, write details down using our template, and report the matter to the Internal Committee.'
  },
  {
    id: 'slide_17',
    moduleId: 4,
    moduleTitle: 'What Should You Do?',
    title: 'Receiving a Harassment Disclosure',
    subtitle: 'If someone confides in you',
    type: 'quiz-single',
    audioScript: 'If a colleague tells you they were harassed, listen calmly and neutrally. Avoid blaming questions. Guide them to our official Internal Committee with supportive empathy.'
  },
  {
    id: 'slide_18',
    moduleId: 4,
    moduleTitle: 'What Should You Do?',
    title: 'If You Are Accused',
    subtitle: 'Understanding your rights and obligations',
    type: 'info',
    audioScript: 'If accused of harassment: cooperate fully, don\'t contact the complainant, maintain complete confidentiality, and file your official response with the Internal Committee.'
  },
  {
    id: 'slide_19',
    moduleId: 4,
    moduleTitle: 'What Should You Do?',
    title: 'The Manager\'s Strict Directive',
    subtitle: 'Managers must not handle cases privately',
    type: 'checklist',
    audioScript: 'Managers copy: You must NEVER try to negotiate or privately settle POSH claims. Your legal mandate is to route cases to the Internal Committee immediately and protect confidentiality.'
  },
  {
    id: 'slide_20',
    moduleId: 5,
    moduleTitle: 'Complaint Process & Internal Committee',
    title: 'What is the Internal Committee?',
    subtitle: 'Your workplace grievance body under law',
    type: 'click-reveal',
    audioScript: 'Every employer with 10 or more staff must appoint an Internal Committee (IC), led by a senior woman Presiding Officer and including an external independent expert, to investigate complaints.'
  },
  {
    id: 'slide_21',
    moduleId: 5,
    moduleTitle: 'Complaint Process & Internal Committee',
    title: 'The Legal inquiry Timelines',
    subtitle: 'Clear steps set by the POSH Act',
    type: 'timeline',
    audioScript: 'The law sets clear timelines: written complaints must be submitted within 3 months, inquiries must finish in 90 days, and the employer must enforce findings within 60 days.'
  },
  {
    id: 'slide_22',
    moduleId: 5,
    moduleTitle: 'Complaint Process & Internal Committee',
    title: 'Conciliation Process',
    subtitle: 'Voluntary resolution before formal inquiry',
    type: 'quiz-single',
    audioScript: 'Conciliation can be requested by the complainant, but is completely voluntary. It cannot be forced and cannot involve monetary transactions as settlement terms.'
  },
  {
    id: 'slide_23',
    moduleId: 5,
    moduleTitle: 'Complaint Process & Internal Committee',
    title: 'The Iron-Clad Rule: Confidentiality',
    subtitle: 'Identity leaks are punishable',
    type: 'click-reveal',
    audioScript: 'Confidentiality is a statutory requirement. Under POSH, publishing or gossiping about names of the parties or the process is strictly prohibited and heavily penalized.'
  },
  {
    id: 'slide_24',
    moduleId: 5,
    moduleTitle: 'Complaint Process & Internal Committee',
    title: 'Understanding Retaliation',
    subtitle: 'Zero tolerance for victimisation',
    type: 'checklist',
    audioScript: 'Retaliation includes bad grading, sudden project reassignment, or social isolation because of a complaint. The company maintains an absolute zero-tolerance policy for retaliation.'
  },
  {
    id: 'slide_25',
    moduleId: 5,
    moduleTitle: 'Complaint Process & Internal Committee',
    title: 'The Pillars of a Fair Inquiry',
    subtitle: 'Natural justice protects everyone',
    type: 'info',
    audioScript: 'A POSH inquiry operates like a neutral tribunal. Both sides receive written notices, review evidence, call witnesses, and details are kept fully confidential to ensure fairness.'
  },
  {
    id: 'slide_26',
    moduleId: 6,
    moduleTitle: 'Responsibilities under POSH',
    title: 'Your Personal Responsibility',
    subtitle: 'Safe environment is built daily',
    type: 'click-reveal',
    audioScript: 'Every single employee is responsible for treating others with professional posture, keeping work groups respectful, maintaining boundaries, and resisting malicious gossip.'
  },
  {
    id: 'slide_27',
    moduleId: 6,
    moduleTitle: 'Responsibilities under POSH',
    title: 'Our Employer Mandate',
    subtitle: 'Annual legal commitments',
    type: 'info',
    audioScript: 'The firm must maintain a transparent POSH charter, keep the Internal Committee functional, hold standard awareness cycles, and file annual progress files to the District Captain.'
  },
  {
    id: 'slide_28',
    moduleId: 7,
    moduleTitle: 'Interactive Case Scenarios',
    title: 'Case 1: Late Night Diner Borders',
    subtitle: 'Module Scenario Walkthrough',
    type: 'scenario',
    audioScript: 'Read the description in Case Scenario 1. Choose what the colleague should have done, then review the corrective feedback.'
  },
  {
    id: 'slide_29',
    moduleId: 7,
    moduleTitle: 'Interactive Case Scenarios',
    title: 'Case 2: The Social Group Chat',
    subtitle: 'Module Scenario Walkthrough',
    type: 'scenario',
    audioScript: 'Review Case 2 which covers inappropriate media forwarded inside an unofficial team WhatsApp chat, and choose the correct course of action.'
  },
  {
    id: 'slide_30',
    moduleId: 7,
    moduleTitle: 'Interactive Case Scenarios',
    title: 'Case 3: Prestige Project Pressure',
    subtitle: 'Module Scenario Walkthrough',
    type: 'scenario',
    audioScript: 'Scenario 3 covers a senior manager linking a favorable project assignment to a personal social outing. Identify the critical legal problem.'
  },
  {
    id: 'slide_31',
    moduleId: 7,
    moduleTitle: 'Interactive Case Scenarios',
    title: 'Case 4: Office Stand-Close Observers',
    subtitle: 'Module Scenario Walkthrough',
    type: 'scenario',
    audioScript: 'Let\'s check scenario 4. See how a bystander can make a major positive difference when witnessing boundary violations.'
  },
  {
    id: 'slide_32',
    moduleId: 7,
    moduleTitle: 'Interactive Case Scenarios',
    title: 'Case 5: The Star Performer Shield',
    subtitle: 'Module Scenario Walkthrough',
    type: 'scenario',
    audioScript: 'Check Case 5. See why "business impact" or "star performance" must never block or downplay formal compliance proceedings.'
  },
  {
    id: 'slide_33',
    moduleId: 7,
    moduleTitle: 'Interactive Case Scenarios',
    title: 'Case 6: Dining Area Speculations',
    subtitle: 'Module Scenario Walkthrough',
    type: 'scenario',
    audioScript: 'Read Scenario 6 regarding workplace gossip after a formal POSH file is raised. Choose the correct professional behaviour.'
  },
  {
    id: 'slide_33_a',
    moduleId: 7,
    moduleTitle: 'Interactive Case Scenarios',
    title: 'Case 7: The Ended Romance',
    subtitle: 'Module Scenario Walkthrough',
    type: 'scenario',
    audioScript: 'Read Case Scenario 7. Note what Amit should do regarding his relationship break-up and whether his behavior represents a violation.'
  },
  {
    id: 'slide_33_b',
    moduleId: 7,
    moduleTitle: 'Interactive Case Scenarios',
    title: 'Case 8: Consensual Reporting Lines',
    subtitle: 'Module Scenario Walkthrough',
    type: 'scenario',
    audioScript: 'Read Case Scenario 8 to cover power dynamics and conflict of interest details when dating inside a direct reporting line.'
  },
  {
    id: 'slide_34',
    moduleId: 8,
    moduleTitle: 'Final Quiz & Certification',
    title: 'Final Quiz & Verification',
    subtitle: 'Demonstrating your POSH compliance',
    type: 'quiz-intro',
    audioScript: 'You have completed the structural modules! Let\'s proceed to the final compliance verification quiz. You will need to answer the questions to complete training.'
  },
  {
    id: 'slide_35',
    moduleId: 8,
    moduleTitle: 'Final Quiz & Certification',
    title: 'Let\'s Verify Your Understanding',
    subtitle: 'Knowledge Check',
    type: 'final-quiz',
    audioScript: 'Complete the quiz questions on screen. You need to answer correctly to progress. If you fail, you can retry immediately.'
  },
  {
    id: 'slide_36',
    moduleId: 8,
    moduleTitle: 'Final Quiz & Certification',
    title: 'Sign POSH Acknowledgement',
    subtitle: 'Statutory compliance sign-off',
    type: 'acknowledgement',
    audioScript: 'Please fill out your formal employee details below, check the acknowledgment boxes, and sign. This records your official POSH training logs.'
  },
  {
    id: 'slide_37',
    moduleId: 8,
    moduleTitle: 'Final Quiz & Certification',
    title: 'Training Module Complete!',
    subtitle: 'Resource and Helpline Contacts',
    type: 'support',
    audioScript: 'Your training is fully complete and submitted. Your digital completion certificate is now printable. Here is a directory of key support contacts.'
  }
];