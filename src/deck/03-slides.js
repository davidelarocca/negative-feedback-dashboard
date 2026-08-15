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

/* ── 01 ─────────────────────────────────────────────────────────────────── */
{ n:'01', rail:0, steps:4, center:true, html:`
  <div class="stack gap-l">
    <div class="stack gap-m">
      <p class="said" data-step="1">“Do you even know what you’re doing?”</p>
      <p class="said" data-step="2">“How many times do I have to tell you this?”</p>
      <p class="said" data-step="3">“Never mind. I’ll do it myself.”</p>
    </div>
    <div class="stack gap-s mw-lg" data-step="4">
      <div class="rule"></div>
      <p class="lead accent">Three sentences. Three different people. Not one bad manager among them.</p>
    </div>
  </div>`,
  notes:`Reveal one at a time. Two seconds of silence after the third. Then: <em>Nobody in this room would call that abuse. Nobody would report it. It takes two seconds and it costs nothing to say. By the end of this session I want to show you what it actually costs.</em>` },

/* ── 02 ─────────────────────────────────────────────────────────────────── */
{ n:'02', rail:0, steps:2, center:true, html:`
  <div class="stack gap-m mw-lg">
    <p class="display" data-step="1">This is not a session about being nice.</p>
    <p class="display" data-step="2">It is about the quality of the information you make decisions on.</p>
  </div>`,
  notes:`Flat, no smile. This buys you the room before they finish deciding it is thirty minutes of soft skills.` },

/* ── 03 ─────────────────────────────────────────────────────────────────── */
{ n:'03', rail:0, steps:2, center:true, html:`
  <div class="stack gap-l">
    <p class="eyebrow" data-step="0">Before I built this session</p>
    <div class="stack gap-m mw-lg">
      <p class="headline" data-step="1">I asked our HR one question: what is the most urgent topic on board right now?</p>
      <p class="display accent" data-step="2">This was the answer.</p>
    </div>
  </div>`,
  notes:`A method, not an anecdote. It is not my opinion of what we need. It is ours.` },

/* ── 04 ─────────────────────────────────────────────────────────────────── */
{ n:'04', rail:0, steps:5, html:`
  <p class="eyebrow" data-step="0">What we know about feedback</p>
  <div class="stack gap-l" style="margin-top:44px">
    <div class="stats-row">
      <div class="stack gap-s">
        <div class="stat" data-step="1">
          <span class="stat__n fig down" data-count="38" data-suffix="%">0%</span>
          <span class="stat__l">of feedback interventions made performance worse</span>
        </div>
        <p class="src" data-step="2">Kluger &amp; DeNisi · Psychological Bulletin, 1996 · 131 experiments, 607 effect sizes, 23,663 observations · average effect positive at d&nbsp;=&nbsp;0.41</p>
      </div>
      <div class="stack gap-s">
        <div class="stat" data-step="3">
          <span class="stat__n fig accent" data-count="72" data-suffix="%">0%</span>
          <span class="stat__l">of employees believe their performance would improve if their manager gave them corrective feedback</span>
        </div>
        <p class="src" data-step="4">Zenger &amp; Folkman · Harvard Business Review, 2014 · self-selected sample of 899</p>
      </div>
    </div>
    <div class="stack gap-s" data-step="5">
      <div class="rule"></div>
      <p class="display">They want it. A third of the time, we make it worse.</p>
    </div>
  </div>`,
  notes:`The anchor of the session. Feedback is not automatically good. On average it works, and in more than one case in three it backfires. Say <em>d = 0.41</em> out loud; it shows you read the paper and not the headline.` },

/* ── 05 ─────────────────────────────────────────────────────────────────── */
{ n:'05', rail:0, steps:3, html:`
  <p class="eyebrow" data-step="0">Our continuous improvement cycle</p>
  <div class="stack gap-l" style="margin-top:44px">
    <div class="cycle">
      <div class="cycle__b" data-step="1" style="--i:0">Plan</div>
      <div class="cycle__b" data-step="1" style="--i:1">Execute</div>
      <div class="cycle__b" data-step="1" style="--i:2">Measure</div>
      <div class="cycle__b" data-step="1" style="--i:3">Learn</div>
      <div class="cycle__b" data-step="1" style="--i:4">Adjust</div>
    </div>
    <p class="display mw-lg" data-step="2">The cycle only closes if somebody says that something did not work.</p>
    <div class="stack gap-s mw-lg" data-step="3">
      <div class="rule"></div>
      <p class="lead accent">That sentence is the joint. It is the only part of the cycle that depends entirely on how a human being behaves under pressure.</p>
    </div>
  </div>`,
  notes:`Take the wheel exactly as it is on the wall. Do not critique it. Use it.` },

/* ── 06 ─────────────────────────────────────────────────────────────────── */
{ n:'06', rail:0, steps:1, center:true, html:`
  <div class="stack gap-m">
    <h1 class="title" data-step="0">The Broken Loop<span class="dot"></span></h1>
    <p class="lead" data-step="1" style="color:var(--mute)">Where the cycle breaks, and which value stops working when it does.</p>
  </div>`,
  notes:`Slow down. This is the name they repeat afterwards.` },

/* ── 07 ─────────────────────────────────────────────────────────────────── */
{ n:'07', cls:'tight', rail:1, steps:4, html:`
  <p class="eyebrow" data-step="0">Break point 01 · Respect &amp; Protect</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">The moment.</h2>
  <div class="stack gap-m" style="margin-top:34px">
    <p class="body mw-lg" data-step="1">Where, when, and in front of whom. Criticise the behaviour and you get repair. Criticise the person and you get defence.</p>
    <div class="stats-row">
      <div class="stat" data-step="2" style="--i:0">
        <span class="stat__n stat__n--sm fig down" data-count="48" data-suffix="%">0%</span>
        <span class="stat__l">deliberately reduced their effort</span>
      </div>
      <div class="stat" data-step="2" style="--i:1">
        <span class="stat__n stat__n--sm fig down" data-count="38" data-suffix="%">0%</span>
        <span class="stat__l">deliberately reduced the quality of their work</span>
      </div>
      <div class="stat" data-step="2" style="--i:2">
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

/* ── 08 ─────────────────────────────────────────────────────────────────── */
{ n:'08', cls:'tight', rail:2, steps:3, html:`
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

/* ── 09 ─────────────────────────────────────────────────────────────────── */
{ n:'09', cls:'tight', rail:3, steps:4, html:`
  <p class="eyebrow" data-step="0">Break point 03 · Speak Up</p>
  <h2 class="headline mw-lg" data-step="0" style="--i:1;margin-top:12px">They do not stop making mistakes. They stop reporting them.</h2>
  <div class="stack gap-m" style="margin-top:34px">
    <p class="body mw-lg" data-step="1">A study of hospital nursing units found that units with better leadership and team climate reported <b>more</b> errors, not fewer. Not because they made more. Because their people felt safe enough to say so.</p>
    <p class="src" data-step="2">Edmondson · Journal of Applied Behavioral Science, 1996</p>
    <div class="stack gap-s mw-lg" data-step="3">
      <div class="rule"></div>
      <p class="lead accent">And on ships: seafarers who had worked with their manager for less than one year reported significantly fewer near-misses.</p>
    </div>
    <p class="body mw-lg" data-step="4">Your data starts telling you what people think you can hear.</p>
  </div>`,
  notes:`State Edmondson precisely: better climate raises <em>detection</em>, it does not lower the error rate. The seafarer finding is what makes it ours. On a ship with rotating contracts, most crew are inside that first year most of the time.` },

/* ── 10 ─────────────────────────────────────────────────────────────────── */
{ n:'10', cls:'tight', rail:4, steps:4, html:`
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

/* ── 11 ─────────────────────────────────────────────────────────────────── */
{ n:'11', cls:'tight', rail:5, steps:3, html:`
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

/* ── 12 ─────────────────────────────────────────────────────────────────── */
{ n:'12', rail:0, steps:4, cls:'dense', html:`
  <p class="eyebrow" data-step="0">Who is in the room</p>
  <h2 class="headline" data-step="0" style="--i:1;margin-top:12px">The same sentence is not the same sentence.</h2>
  <div class="stack gap-m" style="margin-top:34px">
    <div class="stack gap-s">
      <p class="eyebrow" data-step="1">Power Distance Index — the expectation that hierarchy is fixed and unquestioned</p>
      <div class="data-row">
        <div class="data-row__c" data-step="1" style="--i:0"><span class="data-row__v fig" data-count="94">0</span><span class="data-row__k">Philippines</span></div>
        <div class="data-row__c" data-step="1" style="--i:1"><span class="data-row__v fig" data-count="81">0</span><span class="data-row__k">Mexico</span></div>
        <div class="data-row__c" data-step="1" style="--i:2"><span class="data-row__v fig" data-count="78">0</span><span class="data-row__k">Indonesia</span></div>
        <div class="data-row__c" data-step="1" style="--i:3"><span class="data-row__v fig" data-count="77">0</span><span class="data-row__k">India</span></div>
        <div class="data-row__c" data-step="1" style="--i:4"><span class="data-row__v fig" data-count="69">0</span><span class="data-row__k">Brazil</span></div>
        <div class="data-row__c" data-step="1" style="--i:5"><span class="data-row__v fig" data-count="67">0</span><span class="data-row__k">Colombia</span></div>
        <div class="data-row__c" data-step="1" style="--i:6"><span class="data-row__v fig" data-count="64">0</span><span class="data-row__k">Peru</span></div>
        <div class="data-row__c" data-step="1" style="--i:7"><span class="data-row__v fig" data-count="50">0</span><span class="data-row__k">Italy</span></div>
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

/* ── 13 ─────────────────────────────────────────────────────────────────── */
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

/* ── 14 ─────────────────────────────────────────────────────────────────── */
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
      <div class="spiral__step" data-step="1"><span class="spiral__n">01</span><span class="spiral__t">Something goes wrong once.</span></div>
      <div class="spiral__step" data-step="2"><span class="spiral__n">02</span><span class="spiral__t">You quietly downgrade your expectation of them.</span></div>
      <div class="spiral__step" data-step="3"><span class="spiral__n">03</span><span class="spiral__t">You monitor more closely and delegate less.</span></div>
      <div class="spiral__step" data-step="4"><span class="spiral__n">04</span><span class="spiral__t">They sense the loss of confidence, withdraw, and stop volunteering.</span></div>
      <div class="spiral__step" data-step="5"><span class="spiral__n">05</span><span class="spiral__t">You read the withdrawal as proof you were right.</span></div>
    </div>
  </div>
  <div class="stack gap-s push">
    <div class="rule" data-step="6"></div>
    <p class="display accent" data-step="6" style="--i:1">The performance you are about to correct may be partly something you produced.</p>
    <p class="src" data-step="7">Manzoni &amp; Barsoux · Harvard Business Review, 1998</p>
  </div>`,
  notes:`The uncomfortable slide, and the one that separates you from someone reading a model off a slide. Do not soften it. Pause before advancing, because the next slide is the way out.` },

/* ── 15 ─────────────────────────────────────────────────────────────────── */
{ n:'15', rail:0, steps:5, cls:'dense', html:`
  <p class="eyebrow" data-step="0">The way out</p>
  <div class="stack gap-l" style="margin-top:24px">
    <p class="quote" data-step="1">“I’m giving you these comments because I have very high expectations and I know that you can reach them.”</p>
    <p class="body mw-lg" data-step="2">In a double-blind field experiment, that single added sentence raised the proportion of students who revised their work from
      <span class="fig" data-count="27" data-suffix="%" style="font-size:1.1em">0%</span> to
      <span class="fig" data-count="64" data-suffix="%" style="font-size:1.1em">0%</span>.</p>
    <div class="pair" data-step="3">
      <div class="pair__c">
        <span class="pair__n fig" style="color:var(--alert)" data-count="0" data-suffix="%">0%</span>
        <span class="pair__l">revised without the sentence</span>
      </div>
      <div class="pair__c">
        <span class="pair__n fig" style="color:var(--signal)" data-count="82" data-suffix="%">0%</span>
        <span class="pair__l">revised with it</span>
      </div>
      <div class="pair__c" style="justify-content:flex-end">
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

/* ── 16 ─────────────────────────────────────────────────────────────────── */
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

/* ── 17 ─────────────────────────────────────────────────────────────────── */
{ n:'17', rail:0, steps:1, center:true, html:`
  <div class="stack gap-l">
    <div class="stack gap-s">
      <p class="eyebrow" data-step="0">One thing to drop</p>
      <h2 class="title" data-step="0" style="--i:1">The sandwich.</h2>
    </div>
    <p class="display mw-lg" data-step="1">Once the pattern is predictable, you have not softened the criticism. You have taught your team that praise is a warning.</p>
  </div>`,
  notes:`One line, then move. Do not defend it.` },

/* ── 18 ─────────────────────────────────────────────────────────────────── */
/* Step 2 is the handoff itself: nothing is revealed, the console takes over. */
{ n:'18', rail:0, steps:2, center:true, handoffAt:2, html:`
  <div class="stack gap-l">
    <p class="eyebrow" data-step="0">Now it is your turn</p>
    <div class="stack gap-m">
      <h2 class="title" data-step="0" style="--i:1">Eight decisions.</h2>
      <p class="display" data-step="1">No right answers. Three instruments.</p>
    </div>
    <p class="src fallback" id="handoff-fallback">Open <b>broken-loop.html</b> to run the console, then press Esc to come back.</p>
  </div>`,
  notes:`Advance once more and the console takes over — the screen is already its colour. Read each case, take the room’s answer out loud, register it, move on. Open discussion only where the room splits. <em>Esc brings you back here.</em>` },

/* ── 19 ─────────────────────────────────────────────────────────────────── */
{ n:'19', rail:0, steps:3, arriveDark:true, html:`
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

/* ── 20 ─────────────────────────────────────────────────────────────────── */
{ n:'20', rail:0, steps:1, center:true, html:`
  <div class="stack gap-m mw-lg">
    <h2 class="headline" data-step="0">You will give feedback on this session.</h2>
    <p class="display" data-step="1">Same rules. Stop, ask, agree.</p>
  </div>`,
  notes:`Once, lightly, do not linger.` },

/* ── 21 ─────────────────────────────────────────────────────────────────── */
{ n:'21', rail:0, steps:3, center:true, html:`
  <div class="stack gap-l">
    <div class="stack gap-xs">
      <p class="said said--muted" data-step="1" style="--i:0">“Do you even know what you’re doing?”</p>
      <p class="said said--muted" data-step="1" style="--i:1">“How many times do I have to tell you this?”</p>
      <p class="said said--muted" data-step="1" style="--i:2">“Never mind. I’ll do it myself.”</p>
    </div>
    <div class="stack gap-s mw-lg" data-step="2">
      <div class="rule"></div>
      <p class="display accent">None of them was a bad manager. All of them were in a hurry.</p>
    </div>
    <p class="lead mw-lg" data-step="3">The hurry is not going away. The two seconds before the sentence are the only thing we control.</p>
  </div>`,
  notes:`Let the room recognise them. This is where the session closes on itself.` },

/* ── 22 ─────────────────────────────────────────────────────────────────── */
{ n:'22', rail:0, steps:3, center:true, html:`
  <div class="stack gap-l">
    <div class="stack gap-s" data-until="2">
      <p class="eyebrow" data-step="0">Monday morning</p>
      <h2 class="headline" data-step="0" style="--i:1">Before the verdict, one question.</h2>
    </div>
    <div class="stack gap-m mw-lg" data-until="2">
      <p class="display" data-step="1">Once. This week. With the person you were most sure about.</p>
      <p class="body" data-step="2">The eight cases stay open. Run them with your own managers, in your own department, in ten minutes.</p>
    </div>
  </div>
  <div style="position:absolute;left:72px;right:72px;top:50%;transform:translateY(-50%)">
    <p class="accent mw-lg" data-step="3"
       style="font-size:56px;font-weight:700;line-height:1.15;letter-spacing:-.025em">Continuous improvement is not a wheel. It is a conversation somebody has to be willing to have.</p>
  </div>`,
  notes:`Smallest possible commitment. Big ones do not survive the first turnaround. Let the last line sit before you stop sharing.` }

];
