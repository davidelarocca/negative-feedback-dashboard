/* ══════════════════════════════════════════════════════════════════════════
   SLIDES — all presentation copy lives here and nowhere else.

   data-step="0"  visible on arrival
   data-step="n"  revealed on the nth advance
   data-until="n" fades back out once the step passes n
   --i            stagger index within a reveal group (80ms apart)
   data-count     animates from zero over 900ms
   ══════════════════════════════════════════════════════════════════════════ */

const RAIL = ['Respect & Protect', 'Listen & Learn', 'Speak Up', 'Better Together', 'Always Improving'];

const SLIDES = [

/* ── 01 ──────────────────────────────────────────────────────────── */
{ n:'01', rail:0, steps:4, center:true, html:`
  <div class="stack gap-l">
    <div class="stack gap-m">
      <p class="said" data-split="words" data-step="1">“Do you even know what you’re doing?”</p>
      <p class="said" data-split="words" data-step="2">“How many times do I have to tell you this?”</p>
      <p class="said" data-split="words" data-step="3">“Never mind. I’ll do it myself.”</p>
    </div>
    <div class="stack gap-s mw-lg" data-step="4">
      <div class="rule"></div>
      <p class="lead accent">Three sentences. Three examples of negative feedback. What are the outcomes?</p>
    </div>
  </div>`,
  notes:`Reveal one at a time. Two seconds of silence after the third. Then: <em>Nobody in this room would call that abuse. Nobody would report it. It takes two seconds and it costs nothing to say. By the end of this session I want to show you what it actually costs.</em>` },

/* ── 02 ──────────────────────────────────────────────────────────── */
{ n:'02', rail:0, steps:2, center:true, html:`
  <div class="stack gap-m mw-lg">
    <p class="display" data-split="words" data-step="1">This is not a session about being nice.</p>
    <p class="display" data-split="words" data-step="2">It is about the quality of the feedback we provide, and the cascading effects are bigger than we can imagine.</p>
  </div>`,
  notes:`Flat, no smile. This buys you the room before they finish deciding it is thirty minutes of soft skills.` },

/* ── 03 ──────────────────────────────────────────────────────────── */
{ n:'03', rail:0, steps:5, html:`
  <p class="eyebrow" data-step="0">What we know about feedback</p>
  <div class="stack gap-l" style="margin-top:44px">
    <div class="stats-row">
      <div class="stack gap-s">
        <div class="stat lift" data-step="1">
          <span class="stat__n fig down" data-count="38" data-suffix="%">0%</span>
          <span class="stat__l">of feedback interventions made performance worse</span>
        </div>
        <p class="src" data-step="2">Kluger &amp; DeNisi · Psychological Bulletin, 1996 · 131 experiments, 607 effect sizes, 23,663 observations · average effect positive at d&nbsp;=&nbsp;0.41</p>
      </div>
      <div class="stack gap-s">
        <div class="stat lift" data-step="3">
          <span class="stat__n fig accent" data-count="72" data-suffix="%">0%</span>
          <span class="stat__l">of employees believe their performance would improve if their manager gave them corrective feedback</span>
        </div>
        <p class="src" data-step="4">Zenger &amp; Folkman · Harvard Business Review, 2014 · self-selected sample of 899</p>
      </div>
    </div>
    <div class="stack gap-s" data-step="5">
      <div class="rule"></div>
      <p class="display">Feedback is welcomed. A third of the time, we make it worse.</p>
    </div>
  </div>`,
  notes:`The anchor of the session. Feedback is not automatically good. On average it works, and in more than one case in three it backfires. Say <em>d = 0.41</em> out loud; it shows you read the paper and not the headline.` },

/* ── 04 ──────────────────────────────────────────────────────────── */
{ n:'04', rail:0, steps:3, html:`
  <p class="eyebrow" data-step="0">Our continuous improvement cycle</p>
  <div class="stack gap-l" style="margin-top:44px">
    <div class="cycle">
      <div class="cycle__b lift" data-step="1" style="--i:0">Plan</div>
      <div class="cycle__b lift" data-step="1" style="--i:1">Execute</div>
      <div class="cycle__b lift" data-step="1" style="--i:2">Measure</div>
      <div class="cycle__b lift" data-step="1" style="--i:3">Learn</div>
      <div class="cycle__b lift" data-step="1" style="--i:4">Adjust</div>
    </div>
    <p class="display mw-lg" data-step="2">The cycle only closes if somebody says that something did not work.</p>
    <div class="stack gap-s mw-lg" data-step="3">
      <div class="rule"></div>
      <p class="lead accent">High quality feedback is the essential joint of our improvement cycle. And it depends entirely on how a human being behaves under pressure.</p>
    </div>
  </div>`,
  notes:`Take the wheel exactly as it is on the wall. Do not critique it. Use it.` },

/* ── 05 ──────────────────────────────────────────────────────────── */
{ n:'05', rail:0, steps:1, center:true, html:`
  <div class="stack gap-m">
    <h1 class="title" data-step="0">The Broken Loop<span class="dot"></span></h1>
    <p class="lead" data-step="1" style="color:var(--mute)">Where the cycle breaks, and which value stops working when it does.</p>
  </div>`,
  notes:`Slow down. This is the name they repeat afterwards.` },

/* ── 06 ──────────────────────────────────────────────────────────── */
{ n:'06', cls:'tight', rail:1, steps:4, html:`
  <p class="eyebrow" data-step="0">Break point 01 · Respect &amp; Protect</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">The moment.</h2>
  <div class="stack gap-m" style="margin-top:22px">
    <p class="body mw-lg" data-step="1">Where, when, and in front of whom. Criticise the behaviour and you get repair. Criticise the person and you get defence.</p>
    <div class="stats-row">
      <div class="stat lift" data-step="2" style="--i:0">
        <span class="stat__n stat__n--sm fig down" data-count="48" data-suffix="%">0%</span>
        <span class="stat__l">deliberately reduced their effort</span>
      </div>
      <div class="stat lift" data-step="2" style="--i:1">
        <span class="stat__n stat__n--sm fig down" data-count="38" data-suffix="%">0%</span>
        <span class="stat__l">deliberately reduced the quality of their work</span>
      </div>
      <div class="stat lift" data-step="2" style="--i:2">
        <span class="stat__n stat__n--sm fig down" data-count="25" data-suffix="%">0%</span>
        <span class="stat__l">admitted taking their frustration out on customers</span>
      </div>
    </div>
    <p class="src" data-step="3">Porath &amp; Pearson · Harvard Business Review, 2013 · 800 people across 17 industries</p>
    <div class="stack gap-s" data-step="4">
      <div class="rule"></div>
      <p class="lead accent">A quarter of them carried it straight to the guest.</p>
    </div>
  </div>`,
  notes:`Land hard on <em>25%</em>. That is our product.` },

/* ── 07 ──────────────────────────────────────────────────────────── */
{ n:'07', cls:'tight', rail:2, steps:3, html:`
  <p class="eyebrow" data-step="0">Break point 02 · Listen &amp; Learn</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">The verdict before the question.</h2>
  <div class="split" style="margin-top:52px">
    <div class="col">
      <p class="body" data-step="1">Under pressure we explain other people’s mistakes by their character, and our own by our circumstances.</p>
    </div>
    <div class="divider rule rule--v" data-step="1" style="--i:1"></div>
    <div class="col">
      <p class="lead" data-step="2">“He is careless.”</p>
      <p class="body" data-step="2" style="--i:1">Two short. Compressed turnaround. A handover that never closed.</p>
    </div>
  </div>
  <div class="stack gap-s push" data-step="3">
    <div class="rule"></div>
    <p class="lead accent">Same facts. One of them is useful.</p>
  </div>`,
  notes:`No statistic. The mechanism is enough. Keep this the shortest slide in the deck.` },

/* ── 08 ──────────────────────────────────────────────────────────── */
{ n:'08', cls:'tight', rail:3, steps:2, html:`
  <p class="eyebrow" data-step="0">Break point 03 · Speak Up</p>
  <h2 class="headline mw-lg" data-step="0" style="--i:1;margin-top:12px">They do not stop making mistakes. They stop reporting them.</h2>
  <div class="stack gap-m" style="margin-top:24px">
    <p class="body mw-lg" data-step="1">A study of hospital nursing units found that units with better leadership and team climate reported <b>more</b> errors, not fewer. Not because they made more. Because their people felt safe enough to say so.</p>
    <p class="src" data-step="2">Edmondson · Journal of Applied Behavioral Science, 1996</p>
  </div>`,
  notes:`State Edmondson precisely: better climate raises <em>detection</em>, it does not lower the error rate. Then stop — the room finishes the thought about their own reports without being told.` },

/* ── 09 ──────────────────────────────────────────────────────────── */
{ n:'09', cls:'tight', rail:4, steps:4, html:`
  <p class="eyebrow" data-step="0">Break point 04 · Better Together</p>
  <h2 class="headline mw-lg" data-step="0" style="--i:1;margin-top:12px">The people watching learn more than the person receiving.</h2>
  <div class="stack gap-m" style="margin-top:34px">
    <p class="body mw-lg" data-step="1">Across three experiments, people who merely witnessed rudeness performed
      <span class="fig down" data-count="22" data-suffix="%" style="font-size:1.1em">0%</span> and
      <span class="fig down" data-count="28" data-suffix="%" style="font-size:1.1em">0%</span>
      worse on two tasks, were less creative, and were less willing to help others.</p>
    <div class="stack gap-s mw-lg" data-step="2">
      <div class="rule"></div>
      <p class="lead accent">It made no difference whether the rudeness came from a superior or from a peer.</p>
    </div>
    <p class="src" data-step="3">Porath &amp; Erez · Organizational Behavior and Human Decision Processes, 2009</p>
    <p class="body mw-lg" data-step="4">On a ship there is no private conversation. There is only a smaller audience.</p>
  </div>`,
  notes:`The one nobody expects. Not the recipient: <em>the room</em>.` },

/* ── 10 ──────────────────────────────────────────────────────────── */
{ n:'10', cls:'tight', rail:5, steps:3, html:`
  <p class="eyebrow" data-step="0">Break point 05 · Always Improving</p>
  <h2 class="headline mw-lg" data-step="0" style="--i:1;margin-top:12px">Adjust runs on whatever survived the first four.</h2>
  <div class="stack gap-m" style="margin-top:34px">
    <p class="body mw-lg" data-step="1">If the moment was wrong, the diagnosis was skipped and the reporting dried up, the cycle is still turning. It just has nothing true left inside it.</p>
    <div class="stack gap-s mw-lg" data-step="2">
      <div class="rule"></div>
      <p class="lead accent">This is the expensive part. Not the bad hour somebody had. The decisions we make afterwards, on information we no longer receive.</p>
    </div>
    <p class="display" data-step="3">The loop looks intact from the outside.</p>
  </div>`,
  notes:`Close the argument without a statistic. By now they are making the conclusion themselves.` },

/* ── 11 ──────────────────────────────────────────────────────────── */
{ n:'11', rail:0, cls:'dense', steps:3, html:`
  <p class="eyebrow" data-step="0">Two variables the cycle does not see</p>
  <h2 class="headline mw-lg" data-step="0" style="--i:1;margin-top:12px">The same feedback is not the same feedback.</h2>
  <div class="stack gap-m fill" style="margin-top:30px">
    <p class="body mw-lg" data-step="1">The five break points tell you how a conversation goes wrong. They assume every conversation starts from the same place. Two things decide that it does not.</p>
    <div class="vars">
      <div class="vars__c lift" data-step="2" style="--i:0">
        <span class="vars__h">
          <svg class="ico" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-people"/></svg>
          <span class="vars__k">Who</span>
        </span>
        <span class="vars__d">Who is in front of you, and what they were taught a manager is allowed to say.</span>
      </div>
      <div class="vars__c lift" data-step="2" style="--i:1">
        <span class="vars__h">
          <svg class="ico" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-clock"/></svg>
          <span class="vars__k">When</span>
        </span>
        <span class="vars__d">Where they are in a contract, and how much they have left to absorb it with.</span>
      </div>
    </div>
    <div class="stack gap-s push" data-step="3">
      <div class="rule"></div>
      <p class="lead accent">Neither changes what you say. Both change what arrives.</p>
    </div>
  </div>`,
  notes:`Twenty seconds — this is a frame, the next two slides are the evidence. The line to land: <em>you can deliver the identical sentence twice and have it arrive as coaching once and as a threat the other time.</em>` },

/* ── 12 ──────────────────────────────────────────────────────────── */
{ n:'12', rail:0, steps:4, cls:'dense', html:`
  <p class="eyebrow" data-step="0">Who is in the room</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">The same sentence is not the same sentence.</h2>
  <div class="stack gap-m" style="margin-top:34px">
    <div class="stack gap-s">
      <p class="eyebrow" data-step="1">Power Distance Index — the expectation that hierarchy is fixed and unquestioned</p>
      <div class="data-row">
        <div class="data-row__c lift" data-step="1" style="--i:0"><span class="data-row__v fig" data-count="94">0</span><span class="data-row__k"><svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><use href="#f-ph"/></svg>Philippines</span></div>
        <div class="data-row__c lift" data-step="1" style="--i:1"><span class="data-row__v fig" data-count="81">0</span><span class="data-row__k"><svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><use href="#f-mx"/></svg>Mexico</span></div>
        <div class="data-row__c lift" data-step="1" style="--i:2"><span class="data-row__v fig" data-count="78">0</span><span class="data-row__k"><svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><use href="#f-id"/></svg>Indonesia</span></div>
        <div class="data-row__c lift" data-step="1" style="--i:3"><span class="data-row__v fig" data-count="77">0</span><span class="data-row__k"><svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><use href="#f-in"/></svg>India</span></div>
        <div class="data-row__c lift" data-step="1" style="--i:4"><span class="data-row__v fig" data-count="69">0</span><span class="data-row__k"><svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><use href="#f-br"/></svg>Brazil</span></div>
        <div class="data-row__c lift" data-step="1" style="--i:5"><span class="data-row__v fig" data-count="67">0</span><span class="data-row__k"><svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><use href="#f-co"/></svg>Colombia</span></div>
        <div class="data-row__c lift" data-step="1" style="--i:6"><span class="data-row__v fig" data-count="64">0</span><span class="data-row__k"><svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><use href="#f-pe"/></svg>Peru</span></div>
        <div class="data-row__c lift" data-step="1" style="--i:7"><span class="data-row__v fig" data-count="50">0</span><span class="data-row__k"><svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><use href="#f-it"/></svg>Italy</span></div>
      </div>
    </div>
    <p class="src" data-step="2">Hofstede · national averages from employee survey data · a description of populations, not of the person in front of you</p>
    <div class="stack gap-s" data-step="3" style="margin-top:8px">
      <div class="rule"></div>
      <p class="display accent">Nodding is not agreement. Silence is not acceptance.</p>
    </div>
    <p class="body mw-lg" data-step="4">If you need to know whether they understood, ask a question that cannot be answered with yes.</p>
  </div>`,
  notes:`The most delicate slide in the deck. Do not characterise nationalities. Say it as: <em>the gap between the top and the bottom of this list is wider than the gap between any two departments on this ship, and it sits inside every team you run.</em> Then go straight to the operational point. The takeaway is not <em>adapt your message to their passport</em>. It is <em>stop assuming your message was received the way you sent it</em>.` },

/* ── 13 ──────────────────────────────────────────────────────────── */
{ n:'13', rail:0, cls:'dense', steps:3, html:`
  <p class="eyebrow" data-step="0">When you deliver it</p>
  <h2 class="headline mw-lg" data-step="0" style="--i:1;margin-top:12px">The same feedback lands differently in month one and month seven.</h2>
  <div class="stack gap-m" style="margin-top:34px">
    <p class="body mw-lg" data-step="1">A three-year study of seafarers found that mood, team-working and social cohesion all deteriorate after around six months on board, while fatigue and stress rise across the length of a contract.</p>
    <p class="src" data-step="2">Project MARTHA · Warsash Maritime Academy and international consortium · 937 questionnaires, 110 weekly diaries, 70 sleep and activity records · presented to the IMO, 2017</p>
    <div class="stack gap-s mw-lg push" data-step="3">
      <div class="rule"></div>
      <p class="display accent">Nobody on this ship is the same person in month seven that they were in month one. Including us.</p>
    </div>
  </div>`,
  notes:`Short. It buys you the right to talk about timing without sounding like you are excusing anyone.` },

/* ── 14 ──────────────────────────────────────────────────────────── */
{ n:'14', rail:0, cls:'dense', steps:7, html:`
  <p class="eyebrow" data-step="0">Before you open your mouth</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">The set-up-to-fail syndrome.</h2>
  <div class="spiral" style="margin-top:28px">
    <svg class="spiral__svg" viewBox="0 0 340 340" aria-hidden="true">
      <circle class="sp-track" cx="170" cy="170" r="140"/>
      <path class="sp-arc" data-step="1" d="M 170 30 A 140 140 0 0 1 303.13 126.74"/>
      <path class="sp-arc" data-step="2" d="M 303.13 126.74 A 140 140 0 0 1 252.29 283.26"/>
      <path class="sp-arc" data-step="3" d="M 252.29 283.26 A 140 140 0 0 1 87.71 283.26"/>
      <path class="sp-arc" data-step="4" d="M 87.71 283.26 A 140 140 0 0 1 36.87 126.74"/>
      <path class="sp-arc" data-step="5" d="M 36.87 126.74 A 140 140 0 0 1 170 30"/>
      <circle class="sp-node" data-step="1" cx="170" cy="30" r="7"/>
      <circle class="sp-node" data-step="2" cx="303.13" cy="126.74" r="7"/>
      <circle class="sp-node" data-step="3" cx="252.29" cy="283.26" r="7"/>
      <circle class="sp-node" data-step="4" cx="87.71" cy="283.26" r="7"/>
      <circle class="sp-node" data-step="5" cx="36.87" cy="126.74" r="7"/>
    </svg>
    <div class="spiral__steps">
      <div class="spiral__step lift" data-step="1"><span class="spiral__n">01</span><span class="spiral__t">Something goes wrong once.</span></div>
      <div class="spiral__step lift" data-step="2"><span class="spiral__n">02</span><span class="spiral__t">You quietly downgrade your expectation of them.</span></div>
      <div class="spiral__step lift" data-step="3"><span class="spiral__n">03</span><span class="spiral__t">You monitor more closely and delegate less.</span></div>
      <div class="spiral__step lift" data-step="4"><span class="spiral__n">04</span><span class="spiral__t">They sense the loss of confidence, withdraw, and stop volunteering.</span></div>
      <div class="spiral__step lift" data-step="5"><span class="spiral__n">05</span><span class="spiral__t">You read the withdrawal as proof you were right.</span></div>
    </div>
  </div>
  <div class="stack gap-s push">
    <div class="rule" data-step="6"></div>
    <p class="display accent" data-step="6" style="--i:1">The performance you are about to correct may be partly something you produced.</p>
    <p class="src" data-step="7">Manzoni &amp; Barsoux · Harvard Business Review, 1998</p>
  </div>`,
  notes:`The uncomfortable slide, and the one that separates you from someone reading a model off a slide. Do not soften it. Pause before advancing, because the next slide is the way out.` },

/* ── 15 ──────────────────────────────────────────────────────────── */
{ n:'15', rail:0, steps:5, cls:'dense', html:`
  <p class="eyebrow" data-step="0">The way out</p>
  <div class="stack gap-l" style="margin-top:24px">
    <p class="quote" data-step="1">“I’m giving you these comments because I have very high expectations and I know that you can reach them.”</p>
    <p class="body mw-lg" data-step="2">In a double-blind field experiment, that single added sentence raised the proportion of students who revised their work from
      <span class="fig" data-count="27" data-suffix="%" style="font-size:1.1em">0%</span> to
      <span class="fig" data-count="64" data-suffix="%" style="font-size:1.1em">0%</span>.</p>
    <div class="pair" data-step="3">
      <div class="pair__c lift">
        <span class="pair__n fig" style="color:var(--alert)" data-count="0" data-suffix="%">0%</span>
        <span class="pair__l">revised without the sentence</span>
      </div>
      <div class="pair__c lift">
        <span class="pair__n fig" style="color:var(--signal)" data-count="82" data-suffix="%">0%</span>
        <span class="pair__l">revised with it</span>
      </div>
      <div class="pair__c lift" style="justify-content:flex-end">
        <span class="pair__l" style="max-width:240px">among those who trusted the institution least</span>
      </div>
    </div>
    <p class="src" data-step="4">Yeager, Cohen et al. · Journal of Experimental Psychology: General, 2014</p>
    <div class="stack gap-s mw-lg" data-step="5">
      <div class="rule"></div>
      <p class="lead accent">Two parts, and it only works with both. A high standard, and the stated belief that they can meet it.</p>
    </div>
  </div>`,
  notes:`Hold on the zero. Not a low number: <em>zero</em>. Nobody in the control group revised anything. Then give the caveat plainly, because it earns you more than it costs: this was tested on students, not on crew, and a 2024 replication in a university setting did not reproduce the trust effect. What transfers is the principle, not a magic sentence.` },

/* ── 16 ──────────────────────────────────────────────────────────── */
{ n:'16', rail:0, cls:'dense', steps:5, html:`
  <p class="eyebrow" data-step="0">Three moves</p>
  <div class="cols3" style="margin-top:44px">
    <div class="col">
      <span class="col__k" data-step="1">Stop.</span>
      <p class="body" data-step="1" style="--i:1">Stop the damage, not the person, and not with the lesson attached.</p>
    </div>
    <div class="divider rule rule--v" data-step="2"></div>
    <div class="col">
      <span class="col__k" data-step="2" style="--i:1">Ask.</span>
      <p class="body" data-step="2" style="--i:2">One question before the conclusion. You are not being generous. You are collecting the information you are missing.</p>
    </div>
    <div class="divider rule rule--v" data-step="3"></div>
    <div class="col">
      <span class="col__k" data-step="3" style="--i:1">Agree.</span>
      <p class="body" data-step="3" style="--i:2">Not “do better”. A specific <em>if this happens, I will do that</em>, and a date to check it.</p>
      <p class="src" data-step="4">Plans in that form raise goal attainment with a medium-to-large effect, d&nbsp;=&nbsp;0.65 · Gollwitzer &amp; Sheeran · meta-analysis of 94 tests, 8,000+ participants</p>
    </div>
  </div>
  <div class="stack gap-s push" data-step="5">
    <div class="rule"></div>
    <p class="display accent">Five values diagnose where the loop breaks. Three moves repair it.</p>
  </div>`,
  notes:`Twenty seconds each. <em>Agree</em> is the one everybody skips, and it is the one with the strongest evidence behind it.` },

/* ── 17 ──────────────────────────────────────────────────────────── */
{ n:'17', rail:0, cls:'dense', steps:2, html:`
  <p class="eyebrow" data-step="0">One thing to drop</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">The sandwich.</h2>
  <div class="stack gap-m fill" style="margin-top:30px">
    <div class="sand mw-lg">
      <div class="sand__l sand__l--bread lift" data-step="1" style="--i:0">
        <span class="sand__t">Something positive</span>
        <span class="sand__h">they stop hearing this</span>
      </div>
      <div class="sand__l sand__l--fill lift" data-step="1" style="--i:1">
        <span class="sand__t">The actual message</span>
        <span class="sand__h">and wait for this</span>
      </div>
      <div class="sand__l sand__l--bread lift" data-step="1" style="--i:2">
        <span class="sand__t">Something positive</span>
        <span class="sand__h">and discount this</span>
      </div>
    </div>
    <div class="stack gap-s push" data-step="2">
      <div class="rule"></div>
      <p class="display accent mw-lg">Once the pattern is predictable, you have not softened the criticism. You have taught your team that praise is a warning.</p>
    </div>
  </div>`,
  notes:`Say it in one line and move. Do not defend it and do not take a show of hands — half the room uses it. Out loud, over the three layers: <em>the structure is not the problem, the predictability is — by the third time, the opening compliment is the cue.</em> The point is not that the shape is wrong, it is that <em>a shape they can see coming stops carrying information</em>. If they want a replacement, it is the previous slide: stop, ask, agree.` },

/* ── 18 ──────────────────────────────────────────────────────────── */
{ n:'18', rail:0, cls:'dense', steps:4, html:`
  <p class="eyebrow" data-step="0">One conversation, three separate effects</p>
  <h2 class="headline mw-lg" data-step="0" style="--i:1;margin-top:12px">The same thirty seconds does three different things.</h2>
  <div class="stack gap-m fill" style="margin-top:30px">
    <div class="effects">
      <div class="effects__r lift" data-step="1">
        <svg class="ico" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-person"/></svg>
        <span class="effects__t">It lands on a person, who remembers how it felt long after what it was about.</span>
      </div>
      <div class="effects__r lift" data-step="2">
        <svg class="ico" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-listen"/></svg>
        <span class="effects__t">It decides what they bring you next time, or whether they bring you anything.</span>
      </div>
      <div class="effects__r lift" data-step="3">
        <svg class="ico" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-repeat"/></svg>
        <span class="effects__t">It changes the behaviour, or it does not, and you find out weeks later.</span>
      </div>
    </div>
    <div class="stack gap-s push" data-step="4">
      <div class="rule"></div>
      <p class="lead accent">These three move independently. One score cannot tell you what a conversation cost.</p>
    </div>
  </div>`,
  notes:`The hinge into the dashboard. A single sentence is not one outcome, it is three, and they pull against each other. <em>Which is why we are about to watch three needles and not one.</em>` },

/* ── 19 ──────────────────────────────────────────────────────────── */
{ n:'19', rail:0, steps:2, html:`
  <p class="eyebrow" data-step="0">What the dashboard measures</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">Three instruments.</h2>
  <div class="stack gap-l" style="margin-top:38px">
    <div class="instr">
      <div class="instr__c lift" data-step="1" style="--i:0">
        <div class="instr__top">
          <svg class="instr__dial" viewBox="0 0 66 38" aria-hidden="true">
            <path class="dial-track" d="M 7.6 24.8 A 27 27 0 0 1 58.4 24.8"/>
            <path class="dial-live"  d="M 33 7 A 27 27 0 0 0 16.4 12.7"/>
            <line class="dial-needle" x1="33" y1="34" x2="19.5" y2="16.7"/>
          </svg>
          <span class="instr__k">Trust</span>
        </div>
        <p class="instr__d">What the conversation costs the person in front of you.</p>
        <p class="instr__tie">Held or lost at <b>Respect &amp; Protect</b> and <b>Better Together</b> — the moment, and who was watching.</p>
      </div>
      <div class="instr__c lift" data-step="1" style="--i:1">
        <div class="instr__top">
          <svg class="instr__dial" viewBox="0 0 66 38" aria-hidden="true">
            <path class="dial-track" d="M 7.6 24.8 A 27 27 0 0 1 58.4 24.8"/>
            <path class="dial-live"  d="M 33 7 A 27 27 0 0 1 36.8 7.3"/>
            <line class="dial-needle" x1="33" y1="34" x2="36.1" y2="12.2"/>
          </svg>
          <span class="instr__k">Signal</span>
        </div>
        <p class="instr__d">Whether that person brings you the next problem.</p>
        <p class="instr__tie">Held or lost at <b>Speak Up</b> — the consequence. When signal falls, the data stops arriving before the problem does.</p>
      </div>
      <div class="instr__c lift" data-step="1" style="--i:2">
        <div class="instr__top">
          <svg class="instr__dial" viewBox="0 0 66 38" aria-hidden="true">
            <path class="dial-track" d="M 7.6 24.8 A 27 27 0 0 1 58.4 24.8"/>
            <path class="dial-live"  d="M 33 7 A 27 27 0 0 1 52.1 14.9"/>
            <line class="dial-needle" x1="33" y1="34" x2="48.6" y2="18.4"/>
          </svg>
          <span class="instr__k">Standard</span>
        </div>
        <p class="instr__d">Whether the behaviour actually changes.</p>
        <p class="instr__tie">Held or lost at <b>Listen &amp; Learn</b> and <b>Always Improving</b> — the diagnosis, and what you adjust on afterwards.</p>
      </div>
    </div>
    <div class="stack gap-s push" data-step="2">
      <div class="rule"></div>
      <p class="lead accent">The five values tell you where the loop breaks. These three tell you what the break cost.</p>
    </div>
  </div>`,
  notes:`Twenty seconds. They are about to move these three by hand, so name them now. The point to land: <em>these are not scores. They are three different things a single sentence does at the same time.</em>` },

/* ── 20 ──────────────────────────────────────────────────────────── */
{ n:'20', rail:0, cls:'dense', steps:3, html:`
  <p class="eyebrow" data-step="0">The trade</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">No move takes all three up for free.</h2>
  <div class="stack gap-m fill" style="margin-top:22px">
    <div class="trade">
      <div class="trade__hd">
        <span class="trade__n"></span>
        <span class="trade__marks"></span>
        <span class="waste__hd">Time wasted</span>
      </div>
      <div class="trade__r lift" data-step="1" style="--i:0">
        <span class="trade__n">Correct it on the spot, in front of the section</span>
        <span class="trade__marks">
          <span class="mk mk--down"><span class="mk__k">Trust</span><span class="mk__bar"><span class="mk__fill"></span></span></span>
          <span class="mk mk--down"><span class="mk__k">Signal</span><span class="mk__bar"><span class="mk__fill"></span></span></span>
          <span class="mk mk--up"><span class="mk__k">Standard</span><span class="mk__bar"><span class="mk__fill"></span></span></span>
        </span>
        <span class="waste waste--mid"><span class="waste__bars"><i></i><i></i><i></i></span><span class="waste__k">Medium</span></span>
      </div>
      <div class="trade__r lift" data-step="1" style="--i:1">
        <span class="trade__n">Say nothing, and quietly fix it yourself</span>
        <span class="trade__marks">
          <span class="mk mk--flat"><span class="mk__k">Trust</span><span class="mk__bar"><span class="mk__fill"></span></span></span>
          <span class="mk mk--flat"><span class="mk__k">Signal</span><span class="mk__bar"><span class="mk__fill"></span></span></span>
          <span class="mk mk--down"><span class="mk__k">Standard</span><span class="mk__bar"><span class="mk__fill"></span></span></span>
        </span>
        <span class="waste waste--high"><span class="waste__bars"><i></i><i></i><i></i></span><span class="waste__k">High</span></span>
      </div>
      <div class="trade__r lift" data-step="1" style="--i:2">
        <span class="trade__n">Ask first, then agree one change and a date</span>
        <span class="trade__marks">
          <span class="mk mk--up"><span class="mk__k">Trust</span><span class="mk__bar"><span class="mk__fill"></span></span></span>
          <span class="mk mk--up"><span class="mk__k">Signal</span><span class="mk__bar"><span class="mk__fill"></span></span></span>
          <span class="mk mk--up"><span class="mk__k">Standard</span><span class="mk__bar"><span class="mk__fill"></span></span></span>
        </span>
        <span class="waste waste--low"><span class="waste__bars"><i></i><i></i><i></i></span><span class="waste__k">Low</span></span>
      </div>
    </div>
    <p class="body mw-lg" data-step="2">The third one is the only one that moves all three. It is also the only one you do once.</p>
    <div class="stack gap-s push" data-step="3">
      <div class="rule"></div>
      <p class="lead accent">Time wasted is not how long the conversation takes. It is how many times you have to have it.</p>
    </div>
  </div>`,
  notes:`The column is <em>time wasted</em>, not minutes spent, and that reversal is the point. Correcting publicly is quick and you repeat it. Fixing it yourself costs nothing today and costs you forever. Asking takes longest once and closes it. <em>You are about to make this trade eight times.</em>` },

/* ── 20 ──────────────────────────────────────────────────────────── */
/* Step 2 is the handoff itself: nothing is revealed, the console takes over. */
{ n:'21', rail:0, steps:2, center:true, handoffAt:2, html:`
  <div class="stack gap-l">
    <p class="eyebrow" data-step="0">Now it is your turn</p>
    <div class="stack gap-m">
      <h2 class="title" data-step="0" style="--i:1">Eight decisions.</h2>
      <p class="display" data-step="1">No right answers. Three instruments.</p>
    </div>
    <p class="src fallback" id="handoff-fallback">Open <b>broken-loop.html</b> to run the console, then press Esc to come back.</p>
  </div>`,
  notes:`Advance once more and the console takes over — the screen is already its colour. Read each case, take the room’s answer out loud, register it, move on. Open discussion only where the room splits. <em>Esc brings you back here.</em>` },

/* ── 21 ──────────────────────────────────────────────────────────── */
{ n:'22', rail:0, steps:3, arriveDark:true, html:`
  <p class="eyebrow" data-step="0">What just happened</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">Same facts. Different verdicts.</h2>
  <div class="stack gap-m" style="margin-top:34px">
    <p class="body mw-lg" data-step="1">Experienced people, the same information, different answers. That is not a memory problem and it is not a character problem.</p>
    <div class="stack gap-s mw-lg" data-step="2">
      <div class="rule"></div>
      <p class="display accent">It is the point in the loop where each of us stopped.</p>
    </div>
    <p class="lead accent" data-step="3">And it is the only part of this that is trainable.</p>
  </div>`,
  notes:`Point at the cases where the room split. The disagreement is the evidence, not a problem.` },

/* ── 22 ──────────────────────────────────────────────────────────── */
{ n:'23', rail:0, cls:'dense', steps:2, html:`
  <p class="eyebrow" data-step="0">What the three instruments buy</p>
  <h2 class="headline mw-lg" data-step="0" style="--i:1;margin-top:12px">Delegation, cascading, and the time you get back.</h2>
  <div class="stack gap-m" style="margin-top:30px">
    <div class="buys">
      <div class="buys__r lift" data-step="1" style="--i:0">
        <span class="buys__k"><svg class="ico" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-handover"/></svg>Delegation</span>
        <span class="buys__d">You can only hand work to someone whose standard you trust. Trust and Standard together decide how much of your job you are able to stop doing yourself.</span>
      </div>
      <div class="buys__r lift" data-step="1" style="--i:1">
        <span class="buys__k"><svg class="ico" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-cascade"/></svg>Cascading</span>
        <span class="buys__d">A message survives one level down only if the people carrying it will tell you when it is not landing. That is Signal, and it is the first of the three to go.</span>
      </div>
      <div class="buys__r lift" data-step="1" style="--i:2">
        <span class="buys__k"><svg class="ico" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-clock"/></svg>Time</span>
        <span class="buys__d">The minutes you spent asking are cheaper than the third occurrence, the audit that follows it, and the conversation you end up having anyway.</span>
      </div>
    </div>
    <div class="stack gap-s push" data-step="2">
      <div class="rule"></div>
      <p class="display accent">The minutes are not the cost. They are what stops the same conversation happening three more times.</p>
    </div>
  </div>`,
  notes:`This is where the minutes they just spent turn into an argument rather than a complaint. Ask: <em>which of your managers could you hand more to tomorrow, and what would have to be true first?</em>` },

/* ── 23 ──────────────────────────────────────────────────────────── */
{ n:'24', rail:0, cls:'dense', steps:6, html:`
  <p class="eyebrow" data-step="0">What we take off this call</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">Five things, in order.</h2>
  <div class="stack gap-m fill" style="margin-top:26px">
    <div class="recap">
      <div class="recap__r lift" data-step="1">
        <span class="recap__n">01</span>
        <span class="recap__k">Feedback is not automatically good</span>
        <span class="recap__d">On average it works. One case in three makes it worse.</span>
      </div>
      <div class="recap__r lift" data-step="2">
        <span class="recap__n">02</span>
        <span class="recap__k">Five places the loop breaks</span>
        <span class="recap__d">The moment, diagnosis, consequence, audience, outcome.</span>
      </div>
      <div class="recap__r lift" data-step="3">
        <span class="recap__n">03</span>
        <span class="recap__k">Who and when change what arrives</span>
        <span class="recap__d">Nodding is not agreement. Month seven is not month one.</span>
      </div>
      <div class="recap__r lift" data-step="4">
        <span class="recap__n">04</span>
        <span class="recap__k">Three moves, and one habit to drop</span>
        <span class="recap__d">Stop. Ask. Agree. And stop wrapping it in praise.</span>
      </div>
      <div class="recap__r lift" data-step="5">
        <span class="recap__n">05</span>
        <span class="recap__k">Three instruments, not one score</span>
        <span class="recap__d">They move independently. Time wasted is repetition.</span>
      </div>
    </div>
    <div class="stack gap-s push" data-step="6">
      <div class="rule"></div>
      <p class="lead accent">None of this asks you to be softer. It asks you to be deliberate for thirty seconds.</p>
    </div>
  </div>`,
  notes:`The slide they photograph. Do not read it out — let them read, and name only the one you most want them to leave with. Then advance once for the close.` },

/* ── 24 ──────────────────────────────────────────────────────────── */
{ n:'25', rail:0, steps:1, center:true, html:`
  <p class="closing accent mw-lg" data-split="words" data-step="1">Continuous improvement is not a wheel. It is a conversation somebody has to be willing to have.</p>`,
  notes:`Nothing else on the screen and nothing else to say. Let it sit, then stop sharing.` },
];
