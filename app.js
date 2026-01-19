// ===================================
// NORTH POLE RISK AND TEAM DECISION GAME
// Instructions: Open index.html in a web browser
// No server required - runs completely client-side
// ===================================

// Game State
const gameState = {
    currentStep: 0, // 0=start, 1=pitch, 2=overview, 3-8=scenarios, 9=results
    safety: 16,
    time: 16,
    focus: 16,
    currentDay: 11,
    teamName: 'PIHC Team',
    preparationNotes: '',
    scenarioResults: [],
    optionOrderByScenario: [],
    failed: false
};

// Fixed day schedule for controlled timeline
const daySchedule = [11, 23, 39, 44, 56, 68, 70];

// Scenario Data with ratings and consequences
const scenarios = [
    {
        id: 1,
        title: 'Ice Descent and Wrist Injury',
        narrative: 'The expedition has begun. The explorer is descending a steep ice ridge when a ski pole catches awkwardly and hyperextends a wrist. There is immediate pain and swelling, and grip strength drops. The terrain ahead requires full use of both poles for stability and safety. The team must decide how to proceed while balancing the fixed extraction window and limited food supplies.',
        question: 'What do you advise?',
        bestPractice: 'Stop briefly to assess wrist function including grip, range of motion, and sensation. Protect and stabilise, manage swelling, and modify load and technique early. Hands are survival critical in polar travel.',
        keyLesson: 'Small upper limb injuries compound fast in cold, and early protection preserves self care capacity later.',
        optionLabelMap: {
            fast: 'B',
            balanced: 'C',
            bestPractice: 'A'
        },
        options: [
            {
                id: 'fast',
                text: 'Push on immediately',
                ratings: { safety: 1, time: 3, focus: 1 },
                consequence: 'The explorer continues but the wrist pain worsens throughout the day.',
                bestPractice: 'Continuing without assessment risks worsening the injury and compromising safety. Early intervention prevents escalation.',
                costReason: 'Pushing through injury depletes safety capacity significantly, drains focus through pain, but preserves immediate time.',
                lessons: [
                    'Early assessment prevents minor injuries from becoming expedition-ending',
                    'Interprofessional input (physiotherapy, occupational therapy) optimises function under constraint',
                    'Risk escalation is non-linear in harsh environments',
                    'Time pressure must not override basic safety protocols'
                ]
            },
            {
                id: 'balanced',
                text: 'Slow down, support wrist, reassess',
                ratings: { safety: 2, time: 2, focus: 2 },
                consequence: 'The supported wrist allows cautious progress with ongoing monitoring.',
                bestPractice: 'A balanced approach that provides some support while maintaining progress. Monitoring is essential.',
                costReason: 'Moderate intervention costs capacity across all domains but prevents escalation.',
                lessons: [
                    'Adaptive support allows continued progress with reduced risk',
                    'Regular reassessment is critical for evolving conditions',
                    'Team communication ensures early detection of deterioration',
                    'Modification of technique can preserve function'
                ]
            },
            {
                id: 'bestPractice',
                text: 'Stop, assess, stabilise, modify tasks',
                ratings: { safety: 3, time: 0, focus: 3 },
                consequence: 'The wrist is properly stabilised and the explorer adapts technique.',
                bestPractice: 'Full assessment, stabilisation, and task modification prevent escalation. Physiotherapy and occupational therapy input guide safe adaptation.',
                costReason: 'Best practice for injury management minimizes safety and focus costs but requires significant time investment.',
                lessons: [
                    'Proper assessment and stabilisation are foundational to expedition safety',
                    'Task modification guided by physiotherapy prevents compensation injuries',
                    'Short-term time investment prevents long-term catastrophic loss',
                    'Interprofessional collaboration optimises decision-making under pressure'
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Eye Irritation and Damaged Glasses',
        narrative: 'The explorer develops significant eye irritation from wind and ice crystals, with redness and watering affecting vision. Protective glasses are also damaged, reducing clarity and making navigation more difficult. Reading the compass and map accurately becomes harder. The team must weigh the need for visual clarity against time constraints.',
        question: 'What do you advise?',
        bestPractice: 'Treat as an immediate navigation and safety risk. Get sheltered from wind and spindrift, avoid rubbing, irrigate if a foreign body is suspected, and use lubricating drops. If abrasion is likely and available, apply ophthalmic antibiotic ointment. Repair or improvise eyewear now. If severe pain, marked photophobia, or vision loss persists, escalate or evacuate.',
        keyLesson: 'In solo expeditions you cannot share tasks, so protect the cornea, restore functional vision, and reduce visual cognitive load before moving.',
        optionLabelMap: {
            fast: 'C',
            balanced: 'A',
            bestPractice: 'B'
        },
        options: [
            {
                id: 'fast',
                text: 'Push on relying on memory and instinct',
                ratings: { safety: 0, time: 3, focus: 0 },
                costOverride: { focus: 5 },
                consequence: 'The explorer squints through the day, struggling with navigation and increasing eye pain.',
                bestPractice: 'Navigating without clear vision is extremely dangerous in polar conditions. Optometry assessment is essential.',
                costReason: 'Ignoring visual impairment creates maximum safety depletion and severe focus depletion due to navigation errors and cognitive strain, though maintains immediate time.',
                lessons: [
                    'Visual impairment in navigation-critical environments is a major risk factor',
                    'Optometry input is essential for managing eye health and visual aids',
                    'Relying on memory in featureless terrain leads to disorientation',
                    'Sensory impairment compounds cognitive load and error risk'
                ]
            },
            {
                id: 'balanced',
                text: 'Slow down, compensate verbally, share tasks',
                ratings: { safety: 2, time: 2, focus: 2 },
                consequence: 'Reduced pace helps manage the visual challenges with ongoing discomfort.',
                bestPractice: 'Slowing and sharing tasks reduces immediate risk but does not address the root cause. Some support for the eye is needed.',
                costReason: 'Partial compensation requires moderate resource investment across all domains.',
                lessons: [
                    'Team-based compensation strategies reduce individual risk',
                    'Communication protocols support shared situational awareness',
                    'Partial adaptations are better than none but may not be sufficient',
                    'Collaborative decision-making distributes cognitive load'
                ]
            },
            {
                id: 'bestPractice',
                text: 'Stop, protect eye, repair or adapt visual aids',
                ratings: { safety: 3, time: 0, focus: 3 },
                consequence: 'The eye is protected and visual aids are restored, enabling clear navigation.',
                bestPractice: 'Protecting the eye and restoring visual function is critical. Optometry guidance ensures safe continuation. Repairing or adapting glasses prevents further deterioration.',
                costReason: 'Best practice for sensory protection minimizes safety and focus costs but requires significant time.',
                lessons: [
                    'Protecting sensory function is non-negotiable in extreme environments',
                    'Optometry and occupational therapy guide adaptive equipment solutions',
                    'Immediate intervention prevents progressive impairment',
                    'Visual clarity underpins safe navigation and decision-making'
                ]
            }
        ]
    },
    {
        id: 3,
        title: 'Polar Bear Stalking',
        narrative: 'The team spots a polar bear approximately 400 metres away, moving parallel to the route. The explorer is visibly anxious, heart rate elevated, and concentration is affected. The bear has not shown direct aggression but is maintaining proximity. Protocol requires maintaining distance, monitoring behaviour, and managing psychological stress. The team must decide how to proceed.',
        question: 'What do you advise?',
        bestPractice: 'Follow a rehearsed protocol. Regulate breathing to prevent panic narrowing, maintain situational awareness, avoid chaotic movement, prepare deterrents if carried, and execute a clear decision sequence.',
        keyLesson: 'Fear narrows attention, and simple protocols keep judgement online.',
        optionLabelMap: {
            fast: 'B',
            balanced: 'A',
            bestPractice: 'C'
        },
        options: [
            {
                id: 'fast',
                text: 'Move quickly to create distance',
                ratings: { safety: 2, time: 3, focus: 1 },
                consequence: 'The explorer moves fast but remains anxious and hypervigilant throughout the day.',
                bestPractice: 'Rapid movement may provoke the bear or cause injury. A measured response is safer.',
                costReason: 'Panic-driven movement preserves time but depletes safety and focus reserves significantly.',
                lessons: [
                    'Rapid movement in wildlife encounters can escalate risk',
                    'Psychological stress management is essential for safe decision-making',
                    'Psychology input supports regulation and maintains concentration',
                    'Protocols exist for a reason and should guide behaviour'
                ]
            },
            {
                id: 'balanced',
                text: 'Continue cautiously, maintain alertness',
                ratings: { safety: 1, time: 2, focus: 2 },
                consequence: 'The bear eventually moves away, but ongoing stress affects concentration.',
                bestPractice: 'Continuing under heightened stress without regulating arousal risks poor judgment. Some pause for psychological grounding is needed.',
                costReason: 'Sustained stress without regulation drains all resource pools moderately.',
                lessons: [
                    'Sustained heightened arousal impairs judgment and endurance',
                    'Continuous monitoring without stress regulation is unsustainable',
                    'Team vigilance supports safety but does not replace psychological support',
                    'Balance between progress and well-being is essential'
                ]
            },
            {
                id: 'bestPractice',
                text: 'Brief pause to regulate, assess distance, follow protocol',
                ratings: { safety: 3, time: 0, focus: 3 },
                consequence: 'The explorer regulates the stress response and continues with restored concentration.',
                bestPractice: 'A brief pause to regulate arousal, follow bear protocol, and assess distance is the safest approach. Psychology input supports emotional regulation and concentration restoration.',
                costReason: 'Protocol-based stress management minimizes safety and focus costs but requires time investment.',
                lessons: [
                    'Psychological regulation under acute stress prevents poor decision-making',
                    'Following established protocols reduces risk in wildlife encounters',
                    'Brief pauses for regulation are time-efficient compared to panic-driven errors',
                    'Interprofessional support (psychology) is essential for managing fear and maintaining performance'
                ]
            }
        ]
    },
    {
        id: 4,
        title: 'Fall into Icy Water and Frostbite Risk',
        narrative: 'The explorer breaks through thin ice and falls waist-deep into freezing water. They extract quickly but lower layers are soaked. Air temperature is -30 degrees Celsius. Shivering begins, and there is immediate risk of hypothermia and frostbite. The team must act decisively to prevent life-threatening deterioration.',
        question: 'What do you advise?',
        bestPractice: 'Treat as a cold injury emergency. Get out of wind, remove wet layers, insulate, and rewarm safely. For frostbite risk, rewarm only if tissue can be kept warm and refreezing prevented. Do not rub, and avoid direct high heat on numb tissue. Prioritise systemic hypothermia management if present.',
        keyLesson: 'Wet plus wind accelerates risk, and delaying dry insulation and controlled rewarming increases injury severity.',
        optionLabelMap: {
            fast: 'C',
            balanced: 'B',
            bestPractice: 'A'
        },
        options: [
            {
                id: 'fast',
                text: 'Move fast to rewarm and regain pace',
                ratings: { safety: 1, time: 3, focus: 2 },
                costOverride: { safety: 5 },
                consequence: 'The explorer moves quickly but shivering intensifies and extremities become numb.',
                bestPractice: 'Rapid movement without changing wet layers risks severe hypothermia and frostbite. Immediate intervention is required.',
                costReason: 'Delaying proper warming in sub-zero wet conditions creates severe safety risk with potential for life-threatening hypothermia, while maintaining time but stressing focus.',
                lessons: [
                    'Hypothermia and frostbite require immediate intervention, not delayed warming',
                    'Wet layers in sub-zero temperatures escalate risk exponentially',
                    'Movement alone does not address core temperature loss',
                    'Medical and nursing input guide life-saving warming protocols'
                ]
            },
            {
                id: 'balanced',
                text: 'Change wet layers quickly, keep moving with caution',
                ratings: { safety: 2, time: 2, focus: 2 },
                consequence: 'Dry layers help but cautious movement is needed to monitor for deterioration.',
                bestPractice: 'Changing layers is essential but should be paired with controlled rewarming. Monitoring for frostbite and hypothermia is critical.',
                costReason: 'Rapid layer change reduces immediate risk but requires moderate capacity across all domains.',
                lessons: [
                    'Rapid layer change reduces immediate risk but does not guarantee safe rewarming',
                    'Continued movement must be paired with monitoring for deterioration',
                    'Interprofessional input (nursing, paramedicine) supports safe assessment',
                    'Partial interventions may be insufficient in extreme cold'
                ]
            },
            {
                id: 'bestPractice',
                text: 'Full stop: shelter, remove wet layers, controlled rewarming',
                ratings: { safety: 3, time: 0, focus: 3 },
                consequence: 'Proper rewarming protocol prevents hypothermia and the explorer recovers fully.',
                bestPractice: 'Full stop, shelter, layer change, and controlled rewarming prevent hypothermia and frostbite. Medical, nursing, and paramedic input guide safe protocols.',
                costReason: 'Life-saving intervention minimizes safety and focus costs but requires significant time.',
                lessons: [
                    'Cold water immersion requires immediate, structured intervention',
                    'Controlled rewarming prevents rewarming shock and cardiac events',
                    'Shelter and layer management are non-negotiable in sub-zero conditions',
                    'Interprofessional protocols (nursing, paramedicine, medicine) save lives'
                ]
            }
        ]
    },
    {
        id: 5,
        title: 'Nutritional Failure and Sickness',
        narrative: 'The explorer has been struggling to consume adequate calories for two days due to nausea and loss of appetite. They are now feeling weak, dizzy, and unable to maintain pace. Hydration is also compromised. The physical and cognitive demands of polar travel require consistent energy intake. The team must address the nutritional and physiological crisis.',
        question: 'What do you advise?',
        bestPractice: 'Break the spiral early. Reduce output, stabilise hydration and energy, use small frequent intake, treat nausea per field protocol if available, and monitor for dehydration and cognitive decline.',
        keyLesson: 'Nutrition is a cognitive safety system, and low fuel increases decision errors and cold injury risk.',
        optionLabelMap: {
            fast: 'A',
            balanced: 'C',
            bestPractice: 'B'
        },
        options: [
            {
                id: 'fast',
                text: 'Push on and hope appetite returns',
                ratings: { safety: 0, time: 3, focus: 0 },
                consequence: 'The explorer grows weaker and dizziness increases, creating dangerous instability.',
                bestPractice: 'Ignoring nutritional failure leads to collapse, injury, and mission failure. Immediate intervention is essential.',
                costReason: 'Ignoring energy crisis creates maximum depletion of safety and focus while maintaining time.',
                lessons: [
                    'Nutritional failure in high-demand environments leads to rapid deterioration',
                    'Dietetic and medical input are essential for managing intake and hydration',
                    'Cognitive and physical performance are directly linked to energy availability',
                    'Ignoring early warning signs escalates to crisis'
                ]
            },
            {
                id: 'balanced',
                text: 'Reduce workload slightly, sip fluids, small intake',
                ratings: { safety: 2, time: 2, focus: 1 },
                consequence: 'Small intake helps stabilize energy but weakness persists.',
                bestPractice: 'Reducing workload and supporting intake is helpful but may not be sufficient if underlying sickness is not addressed. Medical assessment is important.',
                costReason: 'Partial nutritional intervention requires moderate safety and time costs with higher focus cost.',
                lessons: [
                    'Workload reduction supports recovery but does not replace nutritional intervention',
                    'Small, frequent intake may help but requires monitoring',
                    'Medical and dietetic collaboration optimises intervention',
                    'Partial solutions must be escalated if symptoms persist'
                ]
            },
            {
                id: 'bestPractice',
                text: 'Stop to stabilise hydration and energy, reduce load until settled',
                ratings: { safety: 3, time: 0, focus: 3 },
                consequence: 'Proper stabilisation allows the explorer to recover strength and resume safely.',
                bestPractice: 'Full stabilisation, rehydration, and nutritional support prevent collapse. Medical, dietetic, and nursing input guide safe recovery. Load reduction allows physiological reset.',
                costReason: 'Full stabilisation minimizes safety and focus costs but requires significant time for recovery.',
                lessons: [
                    'Stabilisation and rehydration are non-negotiable in nutritional crisis',
                    'Interprofessional input (dietetics, nursing, medicine) ensures safe recovery',
                    'Load reduction allows physiological systems to recover',
                    'Time invested in stabilisation prevents catastrophic failure'
                ]
            }
        ]
    },
    {
        id: 6,
        title: 'Ski Rub and Calf Injury',
        narrative: 'The explorer has developed a painful friction rub on the calf from a ski boot. The skin is broken and inflamed. Muscle tightness and pain in the same leg are affecting gait and increasing the risk of compensatory injury. The team must manage both the acute skin injury and the biomechanical implications.',
        question: 'What do you advise?',
        bestPractice: 'Stop early to treat hot spots. Dry and protect skin, offload pressure, adjust boot fit and technique, prevent breakdown and infection, and preserve gait.',
        keyLesson: 'Minor skin issues are high leverage, and prevention saves more time than it costs.',
        optionLabelMap: {
            fast: 'A',
            balanced: 'B',
            bestPractice: 'C'
        },
        options: [
            {
                id: 'fast',
                text: 'Ignore and push on',
                ratings: { safety: 1, time: 3, focus: 1 },
                consequence: 'The wound worsens and gait deterioration creates additional strain.',
                bestPractice: 'Ignoring skin breakdown and altered gait leads to infection, compensation injury, and mission failure. Immediate intervention is required.',
                costReason: 'Ignoring injury creates high safety and focus costs while maintaining time.',
                lessons: [
                    'Skin breakdown in extreme environments risks infection and sepsis',
                    'Altered gait due to pain leads to compensatory injury',
                    'Podiatry, physiotherapy, and nursing input guide safe wound and gait management',
                    'Small injuries escalate rapidly if ignored'
                ]
            },
            {
                id: 'balanced',
                text: 'Pad and monitor, adjust pacing a bit',
                ratings: { safety: 2, time: 2, focus: 2 },
                consequence: 'Padding provides relief and monitoring prevents immediate escalation.',
                bestPractice: 'Padding and monitoring reduce immediate pain but do not address underlying biomechanical issues or wound care. More comprehensive intervention is safer.',
                costReason: 'Symptomatic management requires moderate costs across all domains.',
                lessons: [
                    'Padding provides symptomatic relief but does not address root causes',
                    'Monitoring allows early detection of deterioration',
                    'Interprofessional input (podiatry, physiotherapy) optimises outcomes',
                    'Partial interventions may delay but not prevent escalation'
                ]
            },
            {
                id: 'bestPractice',
                text: 'Treat skin, adjust equipment, modify technique and pacing',
                ratings: { safety: 3, time: 1, focus: 3 },
                consequence: 'Comprehensive treatment prevents infection and restores proper movement.',
                bestPractice: 'Full wound care, equipment adjustment, and biomechanical correction prevent infection and compensatory injury. Podiatry, physiotherapy, and nursing input guide comprehensive management.',
                costReason: 'Comprehensive intervention minimizes safety and focus costs with moderate time cost.',
                lessons: [
                    'Comprehensive wound care and biomechanical correction prevent escalation',
                    'Equipment adjustment is as important as clinical intervention',
                    'Interprofessional collaboration (podiatry, physiotherapy, nursing) optimises function and safety',
                    'Technique modification prevents compensatory injuries and preserves long-term capability'
                ]
            }
        ]
    }
];

const rehabGuidanceByOptionId = {
    fast: {
        actions: [
            'Backfill assessment and document symptoms.',
            'Use protective loading and corrective rehab.',
            'Set clear escalation checks and monitoring intervals.'
        ],
        summary: {
            physical: ['Protective loading and swelling control after delayed care.'],
            psychological: ['Reset decision thresholds after risk creep.'],
            nutrition: ['Prioritize hydration and calorie intake during recovery.'],
            graded: ['Brief step-back followed by a structured ramp-up.'],
            monitoring: ['Frequent checks with explicit escalation triggers.']
        }
    },
    balanced: {
        actions: [
            'Monitor closely and document change.',
            'Use graded progression with contingency triggers.',
            'Adjust load and technique to reduce strain.'
        ],
        summary: {
            physical: ['Supportive padding or bracing with technique adjustments.'],
            psychological: ['Shared decision check-ins to reduce cognitive load.'],
            nutrition: ['Small, regular intake to stabilize energy.'],
            graded: ['Maintain progress with moderated load.'],
            monitoring: ['Daily reassessment with clear stop points.']
        }
    },
    bestPractice: {
        actions: [
            'Plan return to function with clear steps.',
            'Build a prevention plan and re exposure strategy.',
            'Continue monitoring to prevent relapse.'
        ],
        summary: {
            physical: ['Full stabilization, wound care, or rewarming as indicated.'],
            psychological: ['Regulation pause and readiness reset before resuming.'],
            nutrition: ['Rehydrate and refuel before workload resumes.'],
            graded: ['Structured return-to-pace plan with checkpoints.'],
            monitoring: ['Protocol-based monitoring and clear escalation triggers.']
        }
    }
};

const rehabSummaryContent = {
    physical: [
        'Tissue-specific management: immobilise or protect injured structures early and control inflammation using compression, insulation, and load reduction to prevent secondary injury in cold environments.',
        'Cold injury protocol: rewarm only when refreezing can be prevented, avoid friction or dry heat, and prioritise systemic hypothermia management before local tissue care.'
    ],
    psychological: [
        'Stress response down-regulation using deliberate breathing or grounding to restore executive function before resuming complex tasks.',
        'Decision hygiene reset with explicit thresholds to counter fatigue-related risk creep and overconfidence.'
    ],
    nutrition: [
        'Active rehydration using sodium-containing fluids to restore plasma volume and support thermoregulation.',
        'Frequent carbohydrate intake to stabilise blood glucose and cognitive performance under cold stress.'
    ],
    graded: [
        'Restore pain-free movement and task tolerance before increasing pace, distance, or technical complexity.',
        'Progress workload only if function and symptoms remain stable across predefined checkpoints.'
    ],
    monitoring: [
        'Immediate escalation for loss of function, worsening pain, sensory changes, infection signs, persistent vomiting, visual disturbance, or cognitive impairment.',
        'Daily trend-based reassessment, with deterioration over 24–48 hours triggering stop or evacuation.'
    ]
};

function getOptionLetter(scenario, option) {
    return scenario.optionLabelMap[option.id];
}

function getOptionLabel(scenario, option) {
    return `Option ${getOptionLetter(scenario, option)}`;
}

function getShuffledOptionOrder(optionCount) {
    const order = Array.from({ length: optionCount }, (_, index) => index);
    for (let i = order.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

function handleOptionKeydown(event, scenarioIndex, optionIndex) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectOption(scenarioIndex, optionIndex);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderStartScreen();
});

// Render Start Screen
function renderStartScreen() {
    const content = `
        <div class="card">
            <svg class="icon-compass" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#F28C28" stroke-width="3" fill="none"/>
                <polygon points="50,20 55,50 50,45 45,50" fill="#F28C28"/>
                <polygon points="50,80 45,50 50,55 55,50" fill="#666"/>
                <circle cx="50" cy="50" r="5" fill="#111"/>
                <text x="50" y="15" text-anchor="middle" font-size="12" fill="#111" font-weight="bold">N</text>
            </svg>
            
            <p class="hero-welcome"><strong>Welcome to an interprofessional expedition challenge.</strong></p>
            <img class="hero-image" src="./northpole0.png" alt="North Pole expedition illustration">
            
            <p><strong>Your Mission:</strong> Guide an explorer safely to the North Pole across approximately 70 days while managing three critical resources:</p>
            
            <ul>
                <li><strong>Safety:</strong> Physical wellbeing and injury prevention</li>
                <li><strong>Time:</strong> Progress toward extraction window with finite food</li>
                <li><strong>Focus:</strong> Concentration and psychological resilience</li>
            </ul>
            
            <p><strong>The Challenge:</strong> You will face six realistic scenarios requiring immediate decisions. Each choice affects your three tracked resources. Small risks compound. Time pressure is relentless. Food and extraction plans are fixed.</p>
            
            <div class="highlight-box">
                <h3>Win or Learn Conditions</h3>
                <ul>
                    <li><strong>Success:</strong> Reach the North Pole with Safety, Time, and Focus as high as possible.</li>
                    <li><strong>Severe Risk:</strong> If any resource drops below 6, the mission continues but becomes fragile</li>
                    <li>Either way, you will complete the story and receive a comprehensive debrief</li>
                </ul>
            </div>
            
            <p>At the end, you will export an actionable Debrief and Risk Assessment document based on your decisions and best practice recommendations.</p>
            
            <div class="btn-center">
                <button class="btn" onclick="renderPitchScreen()">Start Game</button>
            </div>
        </div>
    `;
    
    document.getElementById('mainContent').innerHTML = content;
}

// Render Pitch Screen
function renderPitchScreen() {
    gameState.currentStep = 1;
    
    const content = `
        <div class="card">
            <h2>The Pitch: Forming the Support Team</h2>
            
            <p>An experienced explorer has set an ambitious goal: to complete a solo, unsupported expedition to the North Pole. This is one of the most dangerous and demanding journeys on Earth.</p>
            
            <p>She approaches your group - an interprofessional team with expertise across health, rehabilitation, psychology, and emergency care - to serve as her remote support network. You will provide guidance on medical emergencies, injury management, nutritional crises, equipment failures, psychological stress, and risk escalation.</p>
            
            <p>You are not on the ice with her, but your collective expertise will be critical to her survival and success.</p>
            
            <svg class="icon-sled" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="25" width="80" height="20" fill="#F28C28" rx="3"/>
                <rect x="15" y="30" width="70" height="10" fill="#FFA855"/>
                <line x1="10" y1="50" x2="90" y2="50" stroke="#111" stroke-width="3"/>
                <circle cx="25" cy="50" r="5" fill="#666"/>
                <circle cx="75" cy="50" r="5" fill="#666"/>
                <line x1="5" y1="25" x2="5" y2="15" stroke="#111" stroke-width="2"/>
                <line x1="5" y1="15" x2="30" y2="15" stroke="#111" stroke-width="2"/>
            </svg>
            
            <h3>Team Name (Optional)</h3>
            <input type="text" class="input-field" id="teamNameInput" value="${gameState.teamName}" placeholder="Enter your team name">
            
            <h3>Preparation Plan Notes</h3>
            <p>As a team, discuss and document your initial preparation plan. What protocols, risk thresholds, and decision rules should guide the expedition? These notes will be included in your final Debrief document.</p>
            <textarea class="text-area" id="preparationNotes" placeholder="Enter your preparation plan notes here (e.g., decision rules, escalation triggers, prevention strategies)..."></textarea>
            
            <div class="btn-center">
                <button class="btn" onclick="savePreparationAndProceed()">Continue to Expedition Briefing</button>
            </div>
        </div>
    `;
    
    document.getElementById('mainContent').innerHTML = content;
}

function savePreparationAndProceed() {
    const teamNameInput = document.getElementById('teamNameInput').value.trim();
    const preparationNotes = document.getElementById('preparationNotes').value.trim();
    
    if (teamNameInput) gameState.teamName = teamNameInput;
    gameState.preparationNotes = preparationNotes;
    
    renderExpeditionOverview();
}

// Render Expedition Overview
function renderExpeditionOverview() {
    gameState.currentStep = 2;
    document.getElementById('scoreStrip').style.display = 'flex';
    
    const content = `
        <div class="card">
            <h2>Expedition Begins</h2>
            
            <p>The explorer has completed initial preparations and is now 11 days into the North Pole expedition. The early days have gone well, but the real challenges are beginning to emerge.</p>
            
            <div class="highlight-box">
                <h3>Current Situation: Day 11 of 70</h3>
                <ul>
                    <li><strong>Food Supply:</strong> Fixed and calculated for exactly 70 days</li>
                    <li><strong>Extraction Window:</strong> Aircraft pickup is scheduled for Day 70</li>
                    <li><strong>Solo and Unsupported:</strong> No resupply, no physical backup</li>
                    <li><strong>Your Resources:</strong> Safety 16, Time 16, Focus 16</li>
                    <li><strong>Critical Threshold:</strong> If any resource drops below 6, mission failure risk becomes severe</li>
                    <li><strong>Small Risks Compound:</strong> Every decision consumes resources</li>
                </ul>
            </div>
            
            <p><strong>Your Role:</strong> You will face six critical scenarios. For each, you will choose how the explorer should respond. Your choices will affect Safety, Time, and Focus. Balance is essential, but perfect balance is impossible.</p>
            
            <p>Remember: you are playing as yourselves. Bring your professional expertise and interprofessional mindset to each decision.</p>
            
            <div class="btn-center">
                <button class="btn" onclick="startScenarios()">Begin Expedition</button>
            </div>
        </div>
    `;
    
    document.getElementById('mainContent').innerHTML = content;
}

function startScenarios() {
    gameState.currentStep = 3;
    renderScenario(0);
}

// Render Scenario
function renderScenario(scenarioIndex) {
    const scenario = scenarios[scenarioIndex];
    updateProgressIndicator(scenarioIndex + 1);
    
    // Set current day to the scheduled day for this scenario
    gameState.currentDay = daySchedule[scenarioIndex];
    updateScoresAnimated();
    
    const optionOrder = gameState.optionOrderByScenario[scenarioIndex]
        ?? getShuffledOptionOrder(scenario.options.length);
    gameState.optionOrderByScenario[scenarioIndex] = optionOrder;

    const optionsHtml = optionOrder.map((optionIndex, displayIndex) => {
        const option = scenario.options[optionIndex];
        return `
            <div class="option-card" role="button" tabindex="0" data-option-index="${optionIndex}" aria-label="Choice ${displayIndex + 1}. ${option.text}" onclick="selectOption(${scenarioIndex}, ${optionIndex})" onkeydown="handleOptionKeydown(event, ${scenarioIndex}, ${optionIndex})" id="option-${optionIndex}">
                <div class="option-text">${option.text}</div>
            </div>
        `;
    }).join('');
    
    const content = `
        <div class="card">
            <div class="scenario-day-badge">Day ${gameState.currentDay} of 70</div>
            <h2>Scenario ${scenario.id}: ${scenario.title}</h2>
            
            <p>${scenario.narrative}</p>
            
            <h3>${scenario.question}</h3>
            
            <div class="options-grid">
                ${optionsHtml}
            </div>
            
            <div id="feedbackArea"></div>
            
            <div class="btn-center">
                <button class="btn" id="nextBtn" disabled onclick="nextScenario(${scenarioIndex})">Next</button>
            </div>
        </div>
    `;
    
    document.getElementById('mainContent').innerHTML = content;
}

let selectedOptionIndex = null;

function selectOption(scenarioIndex, optionIndex) {
    // Prevent reselection
    if (selectedOptionIndex !== null) return;
    
    selectedOptionIndex = optionIndex;
    const scenario = scenarios[scenarioIndex];
    const option = scenario.options[optionIndex];
    const optionLetter = getOptionLetter(scenario, option);
    const optionDisplayLabel = `Option ${optionLetter}`;
    
    // Visual feedback
    document.querySelectorAll('.option-card').forEach((card) => {
        const cardOptionIndex = Number(card.dataset.optionIndex);
        if (cardOptionIndex === optionIndex) {
            card.classList.add('selected');
        } else {
            card.classList.add('disabled');
        }
    });
    
    // Store state before applying costs
    const beforeState = {
        safety: gameState.safety,
        time: gameState.time,
        focus: gameState.focus,
        day: gameState.currentDay
    };
    
    // Check for cost overrides
    const safetyCost = option.costOverride?.safety ?? ratingToCost(option.ratings.safety);
    const timeCost = option.costOverride?.time ?? ratingToCost(option.ratings.time);
    const focusCost = option.costOverride?.focus ?? ratingToCost(option.ratings.focus);
    
    // Apply difficulty rule: after Day 35, if Time rating is 0, apply extra Focus cost +1
    let extraFocusCost = 0;
    if (gameState.currentDay >= 35 && option.ratings.time === 0) {
        extraFocusCost = 1;
    }

    // Day 44 ice exposure penalty: apply only when the runtime label is not Option A
    let extraTimePenalty = 0;
    let extraFocusPenalty = 0;
    let extraPenaltyNote = '';
    if (scenario.id === 4 && optionLetter !== 'A') {
        extraTimePenalty = 2;
        extraFocusPenalty = 2;
        extraPenaltyNote = 'Extra penalty applied (Day 44 ice exposure).';
    }
    
    const finalTimeCost = timeCost + extraTimePenalty;
    const finalFocusCost = focusCost + extraFocusCost + extraFocusPenalty;

    // Apply costs to pools (ensure they don't go below 0)
    gameState.safety = Math.max(0, Math.min(16, gameState.safety - safetyCost));
    gameState.time = Math.max(0, Math.min(16, gameState.time - finalTimeCost));
    gameState.focus = Math.max(0, Math.min(16, gameState.focus - finalFocusCost));
    
    // Day progression is now controlled by the fixed schedule, not by time rating
    // But we still track time pressure feedback
    const timePressureText = getTimePressureText(option.ratings.time);
    
    // Check for critical threshold
    gameState.failed = gameState.safety < 6 || gameState.time < 6 || gameState.focus < 6;
    
    // Update scores with animation
    updateScoresAnimated();

    // Store result with full details
    gameState.scenarioResults.push({
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        optionId: option.id,
        chosenLabel: optionLetter,
        chosenOptionLabel: optionDisplayLabel,
        chosenText: option.text,
        ratings: option.ratings,
        baseCosts: {
            safety: safetyCost,
            time: timeCost,
            focus: focusCost
        },
        costs: {
            safety: safetyCost,
            time: finalTimeCost,
            focus: finalFocusCost
        },
        extraFocusCost: extraFocusCost,
        extraTimePenalty: extraTimePenalty,
        extraFocusPenalty: extraFocusPenalty,
        extraPenaltyNote: extraPenaltyNote,
        beforeState: beforeState,
        afterState: {
            safety: gameState.safety,
            time: gameState.time,
            focus: gameState.focus,
            day: gameState.currentDay
        },
        consequence: option.consequence,
        timePressure: timePressureText,
        bestPractice: scenario.bestPractice,
        keyLesson: scenario.keyLesson,
        costReason: option.costReason,
        lessons: option.lessons
    });

    
    // Show feedback with consequence and time pressure
    let feedbackHtml = `
        <div class="feedback-box">
            <h4>Immediate Consequence</h4>
            <p>${option.consequence}</p>
            <p style="font-style: italic; color: var(--gray-dark); margin-top: 0.5rem;">${timePressureText}</p>
    `;
    
    if (extraFocusCost > 0) {
        feedbackHtml += `
            <p style="color: var(--orange); font-weight: 600; margin-top: 0.5rem;">⚠ Late expedition difficulty: Extended stops after Day 35 carry additional psychological strain.</p>
        `;
    }
    
    if (gameState.failed && !document.getElementById('failBanner')) {
        feedbackHtml += `
            <div id="failBanner" style="background: #DC3545; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; font-weight: 600;">
                ⚠ Critical threshold reached.
            </div>
        `;
    }
    
    feedbackHtml += `</div>`;
    
    document.getElementById('feedbackArea').innerHTML = feedbackHtml;
    document.getElementById('nextBtn').disabled = false;
}

function ratingToCost(rating) {
    const mapping = {
        3: 1,
        2: 2,
        1: 3,
        0: 4
    };
    return mapping[rating] || 4;
}

function getTimePressureText(timeRating) {
    if (timeRating === 0 || timeRating === 1) {
        return 'Time pressure increases';
    } else if (timeRating === 2) {
        return 'Time preserved';
    } else {
        return 'Time gained';
    }
}

function updateScoresAnimated() {
    const safetyEl = document.getElementById('safetyScore');
    const timeEl = document.getElementById('timeScore');
    const focusEl = document.getElementById('focusScore');
    const dayEl = document.getElementById('currentDay');
    
    safetyEl.classList.add('updating');
    timeEl.classList.add('updating');
    focusEl.classList.add('updating');
    dayEl.classList.add('updating');
    
    setTimeout(() => {
        safetyEl.textContent = gameState.safety;
        timeEl.textContent = gameState.time;
        focusEl.textContent = gameState.focus;
        dayEl.textContent = gameState.currentDay;
        
        // Update color coding
        updateScoreColor(safetyEl, gameState.safety);
        updateScoreColor(timeEl, gameState.time);
        updateScoreColor(focusEl, gameState.focus);
        
        safetyEl.classList.remove('updating');
        timeEl.classList.remove('updating');
        focusEl.classList.remove('updating');
        dayEl.classList.remove('updating');
    }, 100);
    
    // Update fail indicator
    const failIndicator = document.getElementById('failIndicator');
    if (gameState.failed) {
        failIndicator.classList.add('active');
    }
}

function updateScoreColor(element, value) {
    element.classList.remove('critical', 'warning', 'normal');
    if (value < 6) {
        element.classList.add('critical');
    } else if (value < 10) {
        element.classList.add('warning');
    } else {
        element.classList.add('normal');
    }
}

function updateProgressIndicator(step) {
    document.getElementById('progressIndicator').textContent = `${step} of 6`;
}

function nextScenario(currentIndex) {
    selectedOptionIndex = null;
    
    if (currentIndex < scenarios.length - 1) {
        renderScenario(currentIndex + 1);
    } else {
        renderResults();
    }
}

function getEndingDetails(finalMin) {
    if (finalMin >= 6) {
        return {
            label: 'Expedition Success',
            subheading: 'You reach the North Pole',
            statusClass: 'success',
            narrative: 'Your decisions protected safety while still preserving time and focus. The team balanced urgency with stabilisation, and the expedition remained resilient under pressure.',
            debrief: [
                'You maintained healthy margins in all three pools, which shows consistent risk trade-offs and disciplined prioritisation.',
                'Standardise the decision rules that worked well here: early stabilisation, structured pacing, and shared monitoring.',
                'Carry forward the same interprofessional rhythm to keep safety and focus protected as conditions intensify.'
            ]
        };
    }

    if (finalMin >= 1) {
        return {
            label: 'Severe Risk of Failure',
            subheading: 'You reach the North Pole but extraction is fragile',
            statusClass: 'severe',
            narrative: 'Progress continued, but one or more pools were pushed to the edge. The mission outcome is intact, yet fragile, and the next unexpected stressor could have tipped it into failure.',
            debrief: [
                'Review where thresholds were repeatedly crossed and which risks compounded across scenarios.',
                'Strengthen escalation triggers so early warning signs prompt more decisive intervention.',
                'Plan for slightly larger buffers in time and focus to prevent the final stretch from becoming brittle.'
            ]
        };
    }

    return {
        label: 'Expedition Failure',
        subheading: 'The expedition does not safely complete',
        statusClass: 'failed',
        narrative: 'The expedition could not safely continue once a resource pool reached zero. This outcome is more common than success in extreme environments and provides high-value learning.',
        debrief: [
            'Trace the compounding points where short-term speed outweighed stabilisation and monitoring.',
            'Prioritise early assessment and decisive protection of core resources to avoid rapid collapse later.',
            'Use this ending to reset protocols, build stronger buffers, and support recovery before the next attempt.'
        ]
    };
}

function buildRehabSummary() {
    return rehabSummaryContent;
}

// Render Results
function renderResults() {
    gameState.currentStep = 9;
    gameState.currentDay = 70; // Arrival at North Pole
    updateScoresAnimated();
    document.getElementById('progressIndicator').textContent = 'EXTRACTION';
    
    const finalMin = Math.min(gameState.safety, gameState.time, gameState.focus);
    const ending = getEndingDetails(finalMin);
    const rehabSummary = buildRehabSummary();
    
    const scenarioCards = gameState.scenarioResults.map((result, index) => {
        const whatYouDid = result.extraPenaltyNote
            ? `${result.chosenText} ${result.extraPenaltyNote}`
            : result.chosenText;
        return `
            <div class="scenario-card">
                <div class="scenario-card-header">
                    <h4>Day ${daySchedule[index]}: ${result.scenarioTitle}</h4>
                    <span class="scenario-chip">${result.chosenOptionLabel}</span>
                </div>
                <p><strong>What you did:</strong> ${whatYouDid}</p>
                <p><strong>Best practice:</strong> ${result.bestPractice}</p>
                <p><strong>Key lesson:</strong> ${result.keyLesson}</p>
            </div>
        `;
    }).join('');
    
    const content = `
        <div class="card">
            <div class="results-header">
                <h2>${ending.subheading}</h2>
                <img class="hero-image" src="./northpole1.png" alt="North Pole expedition illustration">
                <p>${ending.narrative}</p>
                <div class="status-badge ${ending.statusClass}">${ending.label}</div>
            </div>
            
            <div class="timeline-summary">
                <h3>Expedition Timeline</h3>
                <ul>
                    <li><strong>Scenario 1:</strong> Day 11 (Ice Descent)</li>
                    <li><strong>Scenario 2:</strong> Day 23 (Eye Irritation)</li>
                    <li><strong>Scenario 3:</strong> Day 39 (Polar Bear)</li>
                    <li><strong>Scenario 4:</strong> Day 44 (Icy Water)</li>
                    <li><strong>Scenario 5:</strong> Day 56 (Nutrition)</li>
                    <li><strong>Scenario 6:</strong> Day 68 (Ski Rub)</li>
                    <li><strong>Arrival and Extraction:</strong> Day 70</li>
                </ul>
            </div>
            
            <div class="final-scores">
                <div class="final-score-item">
                    <h3>Safety Remaining</h3>
                    <div class="value">${gameState.safety}/16</div>
                </div>
                <div class="final-score-item">
                    <h3>Time Remaining</h3>
                    <div class="value">${gameState.time}/16</div>
                </div>
                <div class="final-score-item">
                    <h3>Focus Remaining</h3>
                    <div class="value">${gameState.focus}/16</div>
                </div>
            </div>
            
            <div class="learning-debrief">
                <h3>Full Learning Debrief</h3>
                ${ending.debrief.map(item => `<p>${item}</p>`).join('')}
            </div>
            
            <div class="scenario-summary">
                <h3>Scenario Feedback Summary</h3>
                <div class="scenario-grid">
                    ${scenarioCards}
                </div>
            </div>
            
            <div class="rehab-summary">
                <h3>Rehabilitation Summary</h3>
                <div class="rehab-grid">
                    <div class="rehab-card">
                        <h4>Physical recovery</h4>
                        <ul>
                            ${rehabSummary.physical.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="rehab-card">
                        <h4>Psychological recovery</h4>
                        <ul>
                            ${rehabSummary.psychological.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="rehab-card">
                        <h4>Nutrition and hydration</h4>
                        <ul>
                            ${rehabSummary.nutrition.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="rehab-card">
                        <h4>Graded return to function</h4>
                        <ul>
                            ${rehabSummary.graded.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="rehab-card">
                        <h4>Monitoring and escalation triggers</h4>
                        <ul>
                            ${rehabSummary.monitoring.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="btn-center no-print" style="gap: 1rem; flex-wrap: wrap;">
                <button class="btn" onclick="downloadPDF()">Download PDF</button>
                <button class="btn" onclick="location.reload()">Restart Game</button>
            </div>
        </div>
    `;
    
    document.getElementById('mainContent').innerHTML = content;
}

function generateDebrief() {
    const timestamp = new Date().toLocaleString('en-GB', { 
        timeZone: 'Europe/London',
        dateStyle: 'full',
        timeStyle: 'short'
    });
    
    return `
        <div class="sop-section">
            <h3>Actionable Debrief and Risk Assessment</h3>
            
            <p><strong>Team:</strong> ${gameState.teamName}</p>
            <p><strong>Generated:</strong> ${timestamp}</p>
            
            <h4>Overview</h4>
            <p>This Debrief and Risk Assessment document is derived from the North Pole expedition simulation completed by ${gameState.teamName}. It synthesises preparation planning, scenario-based learning, and best practice recommendations to guide future extreme environment operations.</p>
            
            <h4>Preparation Plan (Team Input)</h4>
            ${gameState.preparationNotes ? 
                `<p style="white-space: pre-wrap;">${gameState.preparationNotes}</p>` :
                '<p><em>No preparation notes provided during the exercise.</em></p>'
            }
            
            <h4>Key Risks Identified</h4>
            <ul>
                <li>Progressive injury escalation from minor musculoskeletal trauma</li>
                <li>Visual impairment affecting navigation and safety</li>
                <li>Acute psychological stress from wildlife encounters</li>
                <li>Hypothermia and frostbite from cold water immersion</li>
                <li>Nutritional failure and energy depletion</li>
                <li>Skin breakdown and compensatory biomechanical injury</li>
            </ul>
            
            <h4>Decision Rules (If X, Then Y)</h4>
            <ul>
                <li><strong>If injury occurs:</strong> Stop, assess, stabilise, and modify tasks before continuing</li>
                <li><strong>If sensory impairment develops:</strong> Protect the affected sense, repair/adapt aids, do not rely on memory alone</li>
                <li><strong>If acute stress or fear arises:</strong> Brief pause for psychological regulation and protocol adherence</li>
                <li><strong>If cold exposure or immersion occurs:</strong> Immediate shelter, layer change, and controlled rewarming</li>
                <li><strong>If nutritional intake fails:</strong> Stabilise hydration and energy before resuming workload</li>
                <li><strong>If skin breakdown or pain alters movement:</strong> Treat wound, adjust equipment, and modify technique</li>
            </ul>
            
            <h4>Prevention Steps</h4>
            <ul>
                <li>Daily equipment and body checks to identify early warning signs</li>
                <li>Proactive task modification and ergonomic adjustment</li>
                <li>Scheduled nutrition and hydration protocols, not demand-driven</li>
                <li>Pre-defined psychological regulation techniques for stress management</li>
                <li>Layering systems and warming protocols prepared in advance</li>
                <li>Interprofessional input integrated into planning, not reactive</li>
            </ul>
            
            <h4>Escalation Triggers</h4>
            <ul>
                <li>Pain that alters gait, grip, or posture</li>
                <li>Visual or sensory impairment affecting navigation</li>
                <li>Sustained elevated heart rate or anxiety affecting concentration</li>
                <li>Shivering, numbness, or confusion suggesting hypothermia</li>
                <li>Two consecutive days of inadequate caloric or fluid intake</li>
                <li>Any skin breakdown or bleeding from equipment friction</li>
            </ul>
            
            <h4>Rehabilitation and Recovery Plan Template</h4>
            <ul>
                <li><strong>Immediate:</strong> Identify injury or deficit, stabilise, and prevent further harm</li>
                <li><strong>Short-term:</strong> Implement task modification, equipment adjustment, and symptom monitoring</li>
                <li><strong>Medium-term:</strong> Gradual return to full workload with interprofessional oversight</li>
                <li><strong>Long-term:</strong> Debrief, document lessons, and integrate into future planning</li>
                <li><strong>Interprofessional roles:</strong> Physiotherapy for biomechanics, nursing for wound care, psychology for stress regulation, dietetics for nutrition, medicine for medical oversight, podiatry for foot health, optometry for vision, paramedicine for emergency response</li>
            </ul>
            
            <h4>Interprofessional Learning Points</h4>
            <ul>
                <li>No single profession holds all expertise; collaboration is essential</li>
                <li>Early intervention prevents escalation and preserves mission capability</li>
                <li>Time pressure must not override safety fundamentals</li>
                <li>Small risks compound exponentially in extreme environments</li>
                <li>Psychological and physiological health are equally critical</li>
                <li>Protocols exist to guide decisions under stress and uncertainty</li>
                <li>Decision diversity (combining quick action, moderate approaches, and full interventions) optimizes outcomes</li>
            </ul>
        </div>
    `;
}

// PDF Download Function
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const accent = [242, 140, 40];
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const timestamp = new Date().toLocaleString('en-GB', {
        timeZone: 'Europe/London',
        dateStyle: 'full',
        timeStyle: 'short'
    });
    const dateStamp = new Date().toISOString().split('T')[0];
    const finalMin = Math.min(gameState.safety, gameState.time, gameState.focus);
    const ending = getEndingDetails(finalMin);
    const rehabSummary = buildRehabSummary();

    function ensureSpace(height) {
        if (y + height > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    }

    function addTitle(text) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(...accent);
        doc.text(text, margin, y);
        doc.setTextColor(0, 0, 0);
        y += 26;
    }

    function addHeading(text) {
        ensureSpace(24);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...accent);
        doc.text(text, margin, y);
        doc.setTextColor(0, 0, 0);
        y += 18;
    }

    function addParagraph(text, fontSize = 11) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, contentWidth);
        ensureSpace(lines.length * fontSize * 1.3);
        doc.text(lines, margin, y);
        y += lines.length * fontSize * 1.3;
    }

    function addKeyValue(label, value) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(label, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, margin + 140, y);
        y += 16;
    }

    addTitle('The Expedition Game: the North Pole');
    addParagraph(`Generated: ${timestamp}`);
    addParagraph(`Team: ${gameState.teamName}`);
    addParagraph('Timeline: Day 11 to Day 70');

    addHeading('Final Outcome');
    addKeyValue('Ending:', ending.label);
    addKeyValue('Subheading:', ending.subheading);
    addKeyValue('Safety Pool:', `${gameState.safety}/16`);
    addKeyValue('Time Pool:', `${gameState.time}/16`);
    addKeyValue('Focus Pool:', `${gameState.focus}/16`);
    addParagraph(ending.narrative);

    addHeading('Full Learning Debrief');
    ending.debrief.forEach((item) => addParagraph(item));

    addHeading('Per-Scenario Learning Table');

    const columns = [
        { title: 'Day', width: 40 },
        { title: 'Scenario', width: 130 },
        { title: 'Option', width: 70 },
        { title: 'What you did', width: 150 },
        { title: 'Best practice', width: 170 },
        { title: 'Key lesson', width: 120 },
        { title: 'Rehab actions', width: 140 }
    ];

    const tableStartX = margin;
    const lineHeight = 12;

    function renderTableHeader() {
        ensureSpace(24);
        let x = tableStartX;
        doc.setFillColor(242, 140, 40);
        doc.setDrawColor(204, 204, 204);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        columns.forEach((col) => {
            doc.rect(x, y, col.width, 22, 'FD');
            doc.text(col.title, x + 4, y + 14);
            x += col.width;
        });
        doc.setTextColor(0, 0, 0);
        y += 22;
    }

    function renderRow(cells) {
        const cellLines = cells.map((cell, idx) =>
            doc.splitTextToSize(cell, columns[idx].width - 8)
        );
        const rowHeight = Math.max(...cellLines.map(lines => lines.length)) * lineHeight + 8;
        ensureSpace(rowHeight);
        let x = tableStartX;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        cellLines.forEach((lines, idx) => {
            doc.rect(x, y, columns[idx].width, rowHeight);
            doc.text(lines, x + 4, y + 14);
            x += columns[idx].width;
        });
        y += rowHeight;
    }

    renderTableHeader();
    gameState.scenarioResults.forEach((result, index) => {
        if (y > pageHeight - margin - 60) {
            doc.addPage();
            y = margin;
            renderTableHeader();
        }
        const whatYouDid = result.extraPenaltyNote
            ? `${result.chosenText} ${result.extraPenaltyNote}`
            : result.chosenText;
        const rehabActions = (rehabGuidanceByOptionId[result.optionId]?.actions || [])
            .map(item => `- ${item}`)
            .join('\n');
        renderRow([
            `${daySchedule[index]}`,
            result.scenarioTitle,
            `${result.chosenOptionLabel}`,
            whatYouDid,
            result.bestPractice,
            result.keyLesson,
            rehabActions || '-'
        ]);
    });

    addHeading('Medical escalation triggers');
    addParagraph('Escalate if marked vision loss, severe photophobia, suspected penetrating injury, severe pain not improving, or symptoms persist beyond 24 to 48 hours.');

    addHeading('Rehabilitation Summary');
    addParagraph(`Physical recovery: ${rehabSummary.physical.join(' ')}`);
    addParagraph(`Psychological recovery: ${rehabSummary.psychological.join(' ')}`);
    addParagraph(`Nutrition and hydration: ${rehabSummary.nutrition.join(' ')}`);
    addParagraph(`Graded return to function: ${rehabSummary.graded.join(' ')}`);
    addParagraph(`Monitoring and escalation triggers: ${rehabSummary.monitoring.join(' ')}`);

    addHeading('Preparation Plan Notes');
    addParagraph(gameState.preparationNotes || 'No preparation notes provided.');

    const safeTeamName = gameState.teamName.replace(/\s+/g, '_');
    doc.save(`North_Pole_Risk_Assessment_${safeTeamName}_${dateStamp}.pdf`);
}
