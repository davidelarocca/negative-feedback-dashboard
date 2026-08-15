/* ══════════════════════════════════════════════════════════════════════════
   CONTENT — all training copy lives here and nowhere else.
   To re-word the session, edit this block only.
   ══════════════════════════════════════════════════════════════════════════ */

/* The five points at which the loop breaks, each mapped to a Carnival value. */
const LOOP_POINTS = [
  { id:'respect',   name:'Respect & Protect', where:'The moment' },
  { id:'listen',    name:'Listen & Learn',    where:'The diagnosis' },
  { id:'speakup',   name:'Speak Up',          where:'The consequence' },
  { id:'together',  name:'Better Together',   where:'The audience' },
  { id:'improving', name:'Always Improving',  where:'The outcome' }
];

const ALL = LOOP_POINTS.map(p => p.id);

/* note — the one-line caption under each gauge, kept to a single line at
   every supported width.  desc — the fuller definition on the summary. */
const GAUGES = [
  { id:'trust',    name:'Trust',    note:'the person in front of you',
    desc:'What the conversation cost the person in front of you.' },
  { id:'signal',   name:'Signal',   note:'will they tell you next time',
    desc:'Whether they will bring you the next problem, or handle it quietly.' },
  { id:'standard', name:'Standard', note:'does the behaviour change',
    desc:'Whether the behaviour actually changes after the conversation.' }
];

const CASES = [
  /* ── 01 ──────────────────────────────────────────────────────────────── */
  {
    n:'01', title:'Galley: repeated sanitization gaps',
    dept:'Food & Beverage', role:'F&B Manager',
    setup:'Third spot check this month. Same section, same gaps: waste not segregated, sanitizer log not filled in. The section is run by a crew member who reports to the Executive Chef. Two crew are working two metres away.',
    question:'What do you do first',
    options:[
      { id:'A', label:'Correct on the spot', audience:true,
        text:'Correct him on the spot, in the section, so the crew see the standard is not negotiable.',
        d:{trust:-2, signal:-2, standard:1}, min:1,
        breaks:['respect','speakup'],
        conseq:'The gap closes today and the standard is visibly enforced. But you corrected another manager’s crew member in front of his own colleagues, and you have taught two people that being seen is more dangerous than being wrong. The next gap gets tidied before your round, not fixed.' },
      { id:'B', label:'Cover it, mention it later', absorb:true,
        text:'Say nothing in the section. Fill the log yourself and mention it to the Executive Chef if it happens again.',
        d:{trust:0, signal:0, standard:-3}, min:0,
        breaks:['improving'],
        conseq:'Nobody is embarrassed and nothing changes. The third occurrence becomes the fourth, and when it surfaces in an audit it will surface as a pattern you already knew about. Silence is not neutrality. It is a decision to carry the risk personally.' },
      { id:'C', label:'Aside, tell him clearly',
        text:'Take him aside immediately, out of earshot, and tell him clearly what you found and that this is the third time.',
        d:{trust:1, signal:0, standard:2}, min:3,
        breaks:['listen'],
        conseq:'Right place, right facts, right tone. But you delivered a verdict without asking why this same gap keeps appearing in this same section, and you left without agreeing what changes. This is the version most managers believe is good practice, and it is the one that quietly repeats.' },
      { id:'D', label:'Aside, ask, agree, brief', asks:true,
        text:'Take him aside, name the specific gap, ask what makes this section harder to keep compliant than the others, agree one change and a check date. Brief the Executive Chef afterwards so he is not surprised.',
        d:{trust:2, signal:2, standard:3}, min:6,
        holds:ALL,
        conseq:'The section runs its sanitizer log at the end of a double shift, one man short. The gap was structural and it is now fixed at the source. Telling your peer afterwards protects the relationship you will need next week.' }
    ]
  },

  /* ── 02 ──────────────────────────────────────────────────────────────── */
  {
    n:'02', title:'Bar: inventory does not match sales',
    dept:'Food & Beverage', role:'Bar Manager',
    setup:'Stock has failed to reconcile against recorded sales for three consecutive weeks in the same outlet. The variance is small, consistent, and always in the same direction. Four bartenders work that outlet. One of them is your strongest seller.',
    question:'What is your first move',
    options:[
      { id:'A', label:'Straight to the top seller',
        text:'Speak to the strongest seller first, privately. The variance tracks his shifts.',
        d:{trust:-3, signal:-1, standard:0}, min:5,
        breaks:['listen','respect'],
        conseq:'You have built an accusation out of a correlation and delivered it to the person with the most to lose. Whatever the truth is, you will not hear it now. If he is innocent you have damaged your best performer. If he is not, you have warned him.' },
      { id:'B', label:'Brief all four together', audience:true,
        text:'Brief all four together on pour standards and stock discipline, without mentioning the variance.',
        d:{trust:-1, signal:-1, standard:0}, min:5,
        breaks:['respect','speakup'],
        conseq:'Three people who did nothing wrong now know something is wrong and that you will not say what. Collective feedback for an individual problem punishes the compliant and quietly warns the responsible.' },
      { id:'C', label:'Escalate to the Director', escalate:true,
        text:'Escalate to the F&B Director and let the process handle it. Say nothing to the team.',
        d:{trust:0, signal:-1, standard:1}, min:2,
        conseq:'Defensible, and in a genuine misconduct case this is correct. But you have skipped the step that would tell you whether this is misconduct at all. If it turns out to be a broken stock-count procedure, you have escalated your own team over a spreadsheet error.' },
      { id:'D', label:'Check the process first', asks:true,
        text:'Check the process before the people. Pull the count method, the transfer records, the shift pattern. If the variance survives that, open with facts and a question rather than a conclusion.',
        d:{trust:2, signal:3, standard:3}, min:30,
        holds:['listen','speakup'],
        conseq:'You separate honest error from risky habit from deliberate act before anyone is named. This is the only sequence that leaves all four people willing to tell you the truth, whichever of the three it turns out to be.' }
    ],
    note:'This is where the room learns that error, at-risk behaviour and misconduct need three different conversations, and that you cannot tell which one you have until you look at the process. Expect option C to split the room. <em>It is not wrong. It is early.</em>'
  },

  /* ── 03 ──────────────────────────────────────────────────────────────── */
  {
    n:'03', title:'Excursion: forty minutes late on the pier',
    dept:'Guest Commerce / Shore Excursions', role:'Tour Manager',
    setup:'An excursion departed forty minutes late. Coaches were booked to the published time; the operations team worked from an updated time that was never circulated back. Guests waited on the pier. The team is back on board and visibly rattled. Complaints are already logged. It is 18:00 and the team goes off shift at 19:00.',
    question:'What do you do',
    options:[
      { id:'A', label:'Debrief now, establish who', audience:true,
        text:'Debrief the whole team now while it is fresh, and establish who changed the time.',
        d:{trust:-2, signal:-2, standard:1}, min:20,
        breaks:['listen','together'],
        conseq:'Fresh is not the same as ready. A group debrief that opens with <em>who</em> becomes a search for whoever will absorb it, and the two people who actually know what happened will now describe it carefully rather than accurately.' },
      { id:'B', label:'Thank them, wait four days', absorb:true,
        text:'Message the team thanking them for recovering the situation, and leave it until the scheduled meeting in four days.',
        d:{trust:1, signal:0, standard:-2}, min:2,
        breaks:['improving'],
        conseq:'Kind, and it costs you the only window in which anyone still remembers the sequence. In four days you will get a reconstruction rather than a record, and the same handover gap is still live for the next port.' },
      { id:'C', label:'Fix tonight, talk tomorrow',
        text:'Stop the operational bleeding first. Confirm tomorrow’s timings in writing with everyone tonight, and hold the conversation about what happened tomorrow morning.',
        d:{trust:2, signal:2, standard:2}, min:10,
        conseq:'You have separated the fix from the lesson, which is the right order while guests are still affected and the team is still hot. The risk is that tomorrow morning never arrives. This is exactly how a fix becomes a substitute for learning.' },
      { id:'D', label:'Two conversations tonight', asks:true,
        text:'Speak tonight, individually, to the two people closest to the handover. Ask each what they were working from. Bring the team together tomorrow with the sequence already established.',
        d:{trust:2, signal:3, standard:3}, min:25,
        conseq:'You get the facts before the story sets, and nobody has to defend themselves in front of the group. The team meeting then becomes a conversation about the process, which is where it belongs.' }
    ]
  },

  /* ── 04 ──────────────────────────────────────────────────────────────── */
  {
    n:'04', title:'A manager below target',
    dept:'Any', role:'Director',
    setup:'One of your managers has been under target for six weeks. The previous six months were consistently at or above. Nothing in the reports explains it. Your own numbers are reviewed on Friday.',
    question:'How do you open',
    options:[
      { id:'A', label:'Trend, plan by Friday',
        text:'Present the six-week trend and ask for a recovery plan by Friday.',
        d:{trust:-1, signal:-2, standard:1}, min:15,
        breaks:['listen'],
        conseq:'You have transmitted your own deadline downward, unaltered. You will get a plan on Friday because you asked for one by Friday. Whether it addresses the actual cause is now a separate question that nobody in the room will raise.' },
      { id:'B', label:'Say nothing yet', absorb:true,
        text:'Say nothing yet. Six weeks is short and the previous six months were strong.',
        d:{trust:0, signal:0, standard:-2}, min:0,
        conseq:'Patience without inquiry is not patience, it is delay. If the cause is structural it compounds while you wait. If the cause is personal, your silence reads as indifference.' },
      { id:'C', label:'Ask what changed', asks:true,
        text:'Ask what has changed in the last six weeks, before looking at the numbers together.',
        d:{trust:3, signal:3, standard:2}, min:20,
        conseq:'Six weeks of decline after six months of delivery is almost never a competence signal. Something changed: a supplier, a staffing level, an itinerary, a person. The question finds it. The target does not.' },
      { id:'D', label:'What the numbers do not show', asks:true,
        text:'Bring the numbers and ask him to walk you through what they are not showing.',
        d:{trust:2, signal:3, standard:3}, min:20,
        conseq:'You have made the data a shared object rather than a verdict, and explicitly invited the information the report cannot carry. He is still accountable, because he is still explaining his own numbers.' }
    ],
    note:'C and D are both strong. The difference is whether you want the person’s account first or the data first. Ask the room which they chose and why. This is where the question <em>how far do the numbers tell the truth</em> opens on its own.'
  },

  /* ── 05 ──────────────────────────────────────────────────────────────── */
  {
    n:'05', title:'Cabin signed off, standard not met',
    dept:'Hospitality', role:'Housekeeping Manager',
    setup:'Spot check during a compressed turnaround, two cabin stewards short. One cabin is signed off and does not meet standard. The steward who signed it is three doors away with eleven cabins still to do. Guests board in ninety minutes.',
    question:'What do you do',
    options:[
      { id:'A', label:'Show him, name it now',
        text:'Call him over, show him the cabin, tell him it is not acceptable.',
        d:{trust:-3, signal:-2, standard:1}, min:3,
        breaks:['respect'],
        conseq:'Correct on the facts, wrong on every other axis. Under this load a verdict lands as a threat, and you have spent three minutes of a ninety-minute window on the one intervention that will slow him down further. He will finish the eleven cabins worse, not better.' },
      { id:'B', label:'Fix it, raise it after', absorb:true,
        text:'Fix the cabin yourself, say nothing, raise it after the turnaround.',
        d:{trust:1, signal:0, standard:1}, min:8,
        conseq:'You protected the guest, the person and today’s standard. Nothing about tomorrow has changed unless the later conversation actually happens, and after a turnaround it usually does not.' },
      { id:'C', label:'Fix it, one sentence now',
        text:'Fix the cabin. Tell him now, in one sentence, that it was short and that you covered it. Have the full conversation after the turnaround.',
        d:{trust:3, signal:2, standard:3}, min:10,
        conseq:'He knows immediately, without being stopped, that the standard was missed and that you neither hid it nor stored it. Nothing is being saved up, which is precisely what makes the later conversation possible.' },
      { id:'D', label:'Raise the staffing instead', escalate:true,
        text:'Say nothing to him. Raise the staffing shortfall with the Hospitality Operations Director instead.',
        d:{trust:0, signal:0, standard:0}, min:10,
        conseq:'The systemic cause is real and worth raising. But treating the condition as the whole explanation removes the person from their own work, and the standard still went out unmet with his signature on it. Context explains. It does not replace.' }
    ],
    note:'Option D is the trap for a room that has just been taught to think systemically. Conditions explain behaviour; they do not remove accountability. <em>Say this out loud.</em>'
  },

  /* ── 06 ──────────────────────────────────────────────────────────────── */
  {
    n:'06', title:'VIP complaint, escalated to the HGM',
    dept:'Hospitality', role:'Hospitality Manager',
    setup:'A high-tier guest complaint was handled poorly at the desk. The guest went to the Hotel General Manager. The HGM has just messaged you one line: deal with it. The crew member involved is competent and has never had an issue.',
    question:'What do you do',
    options:[
      { id:'A', label:'Name the altitude',
        text:'Speak to her straight away and make clear the complaint reached the HGM.',
        d:{trust:-3, signal:-2, standard:0}, min:10,
        breaks:['respect'],
        conseq:'Naming the altitude the complaint reached adds no information and multiplies the threat. You have passed pressure through yourself without absorbing any of it. Absorbing it is the part of the job that is hardest to see and easiest to skip.' },
      { id:'B', label:'Handle it, shield her', absorb:true,
        text:'Handle it yourself with the guest, close the loop with the HGM, say nothing to her.',
        d:{trust:1, signal:-1, standard:-2}, min:20,
        conseq:'You protected her from a bad hour and denied her the information she needed. She will find out anyway, from someone else, and that version will be worse than the one you would have given her.' },
      { id:'C', label:'Ask what happened first', asks:true,
        text:'Ask her what happened before you say anything about the complaint. Then decide.',
        d:{trust:3, signal:3, standard:2}, min:15,
        conseq:'A competent person with no history and a bad outcome is a question, not a verdict. You may find a guest who was already impossible, a system that failed her, or a genuine lapse. All three need a different response and you cannot tell which you have until you ask.' },
      { id:'D', label:'Wait until the cruise ends',
        text:'Wait until the end of the cruise, so the conversation happens away from the pressure.',
        d:{trust:0, signal:-1, standard:-2}, min:15,
        conseq:'Distance from the pressure is worth something. Distance from the facts is not. In six days the detail is gone and the conversation becomes about character instead of about an incident.' }
    ]
  },

  /* ── 07 ──────────────────────────────────────────────────────────────── */
  {
    n:'07', title:'A shipwide event that ran badly',
    dept:'Cross-departmental', role:'Director',
    setup:'A major onboard event ran badly. Technical support arrived after the scheduled build. The crew list went out from another department to the wrong distribution. The venue was double-booked for thirty minutes. Three departments were involved and no single person made a decisive error. Two Directors have already told you it was not their team.',
    question:'Who gets the feedback',
    options:[
      { id:'A', label:'Each department, separately',
        text:'Give each of the three departments feedback on its own part.',
        d:{trust:-1, signal:-1, standard:0}, min:30,
        conseq:'Three correct conversations that fix nothing, because no single part was the failure. You spend your credibility on a diagnosis you already know is incomplete, and each department concludes the others got off more lightly.' },
      { id:'B', label:'Ask the HGM to assign it', escalate:true,
        text:'Take it to the HGM and ask for a decision on ownership.',
        d:{trust:0, signal:0, standard:1}, min:10,
        conseq:'Ownership gets assigned, which is real progress. But feedback arriving from above onto a coordination problem tends to produce compliance with a new rule rather than actual coordination.' },
      { id:'C', label:'Let it go', absorb:true,
        text:'Say nothing. The event happened, the guests were served, and the cost of the argument exceeds the cost of the failure.',
        d:{trust:0, signal:-2, standard:-3}, min:0,
        conseq:'Guaranteed to repeat, at a larger event, with less time. The absence of an owner is exactly why nobody else will raise it if you do not.' },
      { id:'D', label:'Build the timeline together', asks:true,
        text:'Bring the three together and reconstruct the sequence with times, before anyone gives an account. Then agree who holds the handover next time.',
        d:{trust:2, signal:3, standard:3}, min:45,
        conseq:'A timeline is not an accusation, so people can contribute to it without defending themselves. Once the sequence is visible the gap is obvious, and ownership becomes an answer rather than a contest.' }
    ],
    note:'This is the case where individual feedback is the wrong instrument entirely. <em>Name that.</em>'
  },

  /* ── 08 ──────────────────────────────────────────────────────────────── */
  {
    n:'08', title:'Two Directors, one undefined boundary',
    dept:'Cross-departmental', role:'Director',
    setup:'Another Director’s team has twice acted inside an area where your responsibilities overlap. The split has never been written down. It has cost you rework both times. You have no authority over him and you will work alongside him for the next four months.',
    question:'How do you raise it',
    options:[
      { id:'A', label:'At the Directors’ meeting', audience:true,
        text:'Raise it at the next Directors’ meeting, so it is on the record with everyone present.',
        d:{trust:-3, signal:-2, standard:1}, min:5,
        breaks:['respect','together'],
        conseq:'You chose the room with the most witnesses, which guarantees a defensive answer and turns a boundary question into a status contest. Whatever is agreed in that room will be complied with, not adopted.' },
      { id:'B', label:'Absorb the rework', absorb:true,
        text:'Absorb it. The rework is manageable and the working relationship matters more.',
        d:{trust:0, signal:-1, standard:-3}, min:0,
        conseq:'It happens a third time, and by then your tolerance has become the precedent. Peer feedback avoided is not neutral. It is a boundary conceded.' },
      { id:'C', label:'Ask the HGM to clarify', escalate:true,
        text:'Go to the HGM and ask for the split to be clarified.',
        d:{trust:-1, signal:-1, standard:2}, min:10,
        conseq:'The ambiguity is genuinely structural and the HGM is the right person to resolve it. But going up before going across tells your peer exactly what you think of him, and you will pay for that in every unwritten cooperation for four months.' },
      { id:'D', label:'Speak to him directly',
        text:'Speak to him directly. Describe the two instances and the rework, without attributing intent, and propose you agree the split together and put it in writing.',
        d:{trust:3, signal:3, standard:3}, min:20,
        conseq:'Between peers you have no authority, so the only thing carrying the conversation is the absence of blame inside it. Naming the effect rather than the motive is what lets him agree without conceding anything.' }
    ],
    note:'Option C becomes correct once option D has been tried and failed. <em>Sequence matters more than choice.</em>'
  }
];

/* Profiles, derived from the gauge pattern at the end of the round. */
const PROFILES = {
  enforcer:  { name:'The Enforcer',   line:'The standard holds while you are watching.' },
  diplomat:  { name:'The Diplomat',   line:'Everyone likes working for you and nothing changes.' },
  escalator: { name:'The Escalator',  line:'Correct outcomes, borrowed ownership.' },
  absorber:  { name:'The Absorber',   line:'You carried all of it yourself, and nobody learned anything.' },
  keeper:    { name:'The Loop Keeper', line:'The most expensive path, and the only one that compounds.' }
};
