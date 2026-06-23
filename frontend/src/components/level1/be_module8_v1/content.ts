import type { SubContent } from '../_transistor/kit';

/**
 * be8 - "BJT AC Analysis & the Small-Signal Model".
 * Central analogy woven through EVERY scene: the VIP Megaphone Club. A quiet
 * whisper (vin) is broadcast loud; the DC bias is the steady house power; beta is
 * the loudness multiplier; re is the bouncer at the emitter door; coupling/bypass
 * caps are velvet ropes that pass the music (AC) but block the DC barriers; the
 * minus sign is the upside-down broadcast (180-degree inversion).
 */
export const CONTENT = ({
  moduleTitle: 'BJT AC Analysis & the Small-Signal Model',
  moduleSubtitle:
    'From two-port h-parameters to the physical re model: isolate the AC whisper and turn it into a loud, predictable amplifier.',
  scenes: [
    {
      id: 'S00_Cover',
      label: 'BJT AC Analysis',
      kind: 'cover',
      subtitle: 'The VIP Megaphone Club - turning a whisper into a broadcast',
      theoryEN: [
        'Picture a tiny club where a singer\'s quiet whisper must fill a stadium. The transistor is the club\'s megaphone system.',
        'A faint AC voice walks in; the amplifier broadcasts it loud and clear. The steady DC house power keeps the gear idling in its sweet spot.',
        'AC analysis means listening ONLY to the music (the small signal) and ignoring the constant hum of the power (the DC bias).',
        're is the bouncer guarding the emitter door, beta is the loudness multiplier, and the coupling/bypass caps are velvet ropes that wave the music through.',
        'By the end you will compute Zi, Zo and the voltage gain Av of a real common-emitter amplifier by hand.',
      ],
      theoryHI: [
        'सोचिए एक छोटा club जहाँ एक singer की धीमी whisper को पूरा stadium भरना है। Transistor इस club का megaphone system है।',
        'एक हल्की AC आवाज़ अंदर आती है; amplifier उसे ज़ोरदार broadcast कर देता है। steady DC house power gear को उसके sweet spot पर idle रखती है।',
        'AC analysis का मतलब है सिर्फ़ music (small signal) सुनना और power की लगातार hum (DC bias) को ignore करना।',
        're emitter door का bouncer है, beta loudness multiplier है, और coupling/bypass caps velvet ropes हैं जो music को अंदर आने देती हैं।',
        'अंत तक आप एक असली common-emitter amplifier का Zi, Zo और voltage gain Av हाथ से निकालना सीख जाएँगे।',
      ],
      transcriptEN:
        'Welcome to the VIP Megaphone Club, where a whisper becomes a broadcast. This module is about AC analysis of the BJT.',
      transcriptHI:
        'VIP Megaphone Club में स्वागत है, जहाँ एक whisper एक broadcast बन जाती है। यह module BJT के AC analysis के बारे में है।',
      visualNote:
        'Cover: a small blue signal enters the npn device and exits as a large inverted accent-colored swing - a small change in, a big change out.',
    },
    {
      id: 'S01_Video',
      label: 'Video - The Small-Signal Idea',
      kind: 'video',
      subtitle: 'Lesson lecture: isolating the AC whisper from the DC hum',
      theoryEN: [
        'Watch the lesson before the deep dive: it frames why we split DC and AC and what the re model buys us.',
        'It shows the AC whisper riding on the DC house power, and how superposition lets us study them separately.',
        'It introduces re = VT/IE - the emitter-door bouncer - and the master gain Av = -(Rc||RL)/re.',
        'Watch for the velvet-rope capacitors: at signal frequency their reactance Xc collapses to zero, so they pass the music.',
        'Keep the minus sign in mind: it is the mandatory 180-degree phase inversion, the upside-down broadcast.',
      ],
      theoryHI: [
        'गहराई में जाने से पहले lesson देखें: यह बताता है कि हम DC और AC को क्यों अलग करते हैं और re model से क्या फ़ायदा होता है।',
        'यह दिखाता है कि AC whisper DC house power पर सवार है, और superposition से हम दोनों को अलग-अलग पढ़ सकते हैं।',
        'यह re = VT/IE - emitter-door bouncer - और master gain Av = -(Rc||RL)/re से परिचय कराता है।',
        'velvet-rope capacitors पर ध्यान दें: signal frequency पर उनका reactance Xc शून्य हो जाता है, तो वे music को गुज़रने देती हैं।',
        'minus चिह्न याद रखें: यह ज़रूरी 180-degree phase inversion है, यानी उल्टा broadcast।',
      ],
      transcriptEN:
        'Every working amplifier carries two things at once: a constant DC level that fixes the operating point, and a tiny time-varying AC signal riding on top of it. DC biasing is the foundation - the house power that switches the transistor on and parks it in the linear sweet spot. The AC small-signal is the actual information being amplified, the singer\'s whisper, with its own amplitude, frequency and phase. The whole job of AC analysis is to isolate and study the AC behaviour without the DC clutter, so the maths stays simple. Because the AC signal is small, the transistor behaves as a nearly linear device around the Q-point, and that linearity is exactly what lets us split the two and analyse them separately. We replace the device with its re model: a resistance beta times re looking into the base, a controlled current source beta times the base current at the collector, and the output resistance ro. From there a couple of Kirchhoff loops hand us the input impedance, the output impedance and the voltage gain. And that gain carries a minus sign - the broadcast always comes out upside-down, a mandatory 180-degree phase inversion.',
      transcriptHI:
        'हर चलता हुआ amplifier एक साथ दो चीज़ें रखता है: एक constant DC level जो operating point तय करता है, और उसके ऊपर सवार एक छोटा time-varying AC signal। DC biasing नींव है - वही house power जो transistor को ON करके linear sweet spot पर खड़ा रखती है। AC small-signal असली amplify होने वाली information है, singer की whisper, अपने amplitude, frequency और phase के साथ। AC analysis का पूरा काम है AC behaviour को DC clutter के बिना अलग करके पढ़ना, ताकि गणित आसान रहे। चूँकि AC signal छोटा है, transistor Q-point के आसपास लगभग linear device की तरह बर्ताव करता है, और यही linearity हमें दोनों को अलग करके पढ़ने देती है। हम device को उसके re model से बदल देते हैं: base में देखने पर beta गुना re का resistance, collector पर base current का beta गुना एक controlled current source, और output resistance ro। यहाँ से कुछ Kirchhoff loops हमें input impedance, output impedance और voltage gain दे देते हैं। और उस gain के साथ एक minus चिह्न होता है - broadcast हमेशा उल्टा निकलता है, एक ज़रूरी 180-degree phase inversion।',
      visualNote: 'Embed be8-bjt-ac video with chapters: DC vs AC, superposition, re=VT/IE, the AC equivalent, gain and inversion.',
    },
    {
      id: 'S02_SignalInTheNoise',
      label: 'The Signal in the Noise',
      kind: 'theory',
      subtitle: 'DC bias vs the AC whisper - and superposition',
      theoryEN: [
        'Every working amplifier carries two things at once: a constant DC level that sets the operating point, and a tiny AC signal riding on top.',
        'DC biasing is the foundation - the house power that switches the transistor on and parks it in the linear sweet spot. It never varies.',
        'The AC small-signal is the singer\'s whisper - the real information, with amplitude, frequency and phase.',
        'Goal of AC analysis: isolate and study the AC behaviour WITHOUT the DC clutter, so the maths stays simple (v_total = V_DC + v_ac).',
        'Superposition: because the signal is small, the transistor is locally linear, so DC analysis (the Q-point) and AC analysis (the music) are done separately, then added back.',
      ],
      theoryHI: [
        'हर चलता amplifier एक साथ दो चीज़ें रखता है: एक constant DC level जो operating point तय करता है, और ऊपर सवार एक छोटा AC signal।',
        'DC biasing नींव है - house power जो transistor को ON करके linear sweet spot पर रखती है। यह कभी बदलती नहीं।',
        'AC small-signal singer की whisper है - असली information, अपने amplitude, frequency और phase के साथ।',
        'AC analysis का goal: AC behaviour को DC clutter के बिना अलग करके पढ़ना, ताकि गणित आसान रहे (v_total = V_DC + v_ac)।',
        'Superposition: signal छोटा होने से transistor locally linear है, इसलिए DC analysis (Q-point) और AC analysis (music) अलग-अलग करके फिर जोड़ देते हैं।',
      ],
      transcriptEN:
        'Two things ride together: a flat DC house power and a tiny AC whisper. Isolate the whisper and the maths stays simple.',
      transcriptHI:
        'दो चीज़ें साथ चलती हैं: एक flat DC house power और एक छोटी AC whisper। whisper को अलग कर लीजिए, गणित आसान रहता है।',
      visualNote:
        'A sine wave (AC whisper) oscillating around a flat DC line, then a toggle peeling the DC away to show the pure isolated AC sine.',
    },
    {
      id: 'S03_TwoPortAndHybrid',
      label: 'The Two-Port Black Box',
      kind: 'theory',
      subtitle: 'Hybrid h-parameter equations from a four-variable port',
      theoryEN: [
        'Any linear three-terminal device can be a black-box two-port. Port 1 (input) = base-emitter junction; Port 2 (output) = collector-base junction.',
        'Four variables describe it: input Vi, Ii and output Vo, Io - no internal physics needed.',
        'The hybrid (h) equations MIX voltage and current, giving mixed units (Ohms, Siemens, unitless): Vi = h11*Ii + h12*Vo and Io = h21*Ii + h22*Vo.',
        'In common-emitter notation: h11 = hie (input impedance), h12 = hre (reverse voltage ratio), h21 = hfe (forward current gain), h22 = hoe (output admittance).',
        'Each h-parameter is measured by holding one variable at zero - input shorted (Vce = 0) or output open (Ib = 0) - which is why datasheets can list them.',
      ],
      theoryHI: [
        'कोई भी linear तीन-terminal device एक black-box two-port बन सकता है। Port 1 (input) = base-emitter junction; Port 2 (output) = collector-base junction।',
        'इसे चार variables बताते हैं: input Vi, Ii और output Vo, Io - अंदर की physics जानने की ज़रूरत नहीं।',
        'Hybrid (h) equations voltage और current को MIX करती हैं, जिससे mixed units आते हैं (Ohms, Siemens, unitless): Vi = h11*Ii + h12*Vo और Io = h21*Ii + h22*Vo।',
        'Common-emitter notation में: h11 = hie (input impedance), h12 = hre (reverse voltage ratio), h21 = hfe (forward current gain), h22 = hoe (output admittance)।',
        'हर h-parameter एक variable को शून्य रखकर मापा जाता है - input shorted (Vce = 0) या output open (Ib = 0) - इसीलिए datasheets इन्हें list कर पाती हैं।',
      ],
      transcriptEN:
        'Treat the BJT as a four-variable black box; the hybrid equations mix voltage and current and give the hie/hre/hfe/hoe set.',
      transcriptHI:
        'BJT को चार-variable black box मानिए; hybrid equations voltage और current को mix करके hie/hre/hfe/hoe set देती हैं।',
      visualNote:
        'A grey box with terminals 1-1\' (Vi, Ii) on the left and 2-2\' (Vo, Io) on the right, with the two stacked hybrid equations beside it.',
    },
    {
      id: 'S04_FourHParameters',
      label: 'The Four h-Parameters & the Hybrid Circuit',
      kind: 'theory',
      subtitle: 'hie, hre, hfe, hoe - defined and drawn',
      theoryEN: [
        'hie - input impedance (Ohms): resistance seen at the base, hie = dVbe/dIb at constant Vce. Drawn as a resistor.',
        'hre - reverse voltage ratio (unitless): fraction of output voltage fed back, hre = dVbe/dVce at constant Ib. A dependent voltage source, typically tiny (~1e-4).',
        'hfe - forward current gain (unitless): the small-signal current gain beta_ac, hfe = dIc/dIb at constant Vce. A dependent current source.',
        'hoe - output admittance (Siemens): inherent leakage, hoe = dIc/dVce at constant Ib. A resistor whose inverse is ro.',
        'Complete hybrid circuit: input = hie in series with a source hre*Vce; output = a current source hfe*Ib in parallel with 1/hoe. Accurate, but cluttered by the tiny hre term.',
      ],
      theoryHI: [
        'hie - input impedance (Ohms): base पर दिखने वाला resistance, hie = dVbe/dIb (Vce constant)। एक resistor की तरह drawn।',
        'hre - reverse voltage ratio (unitless): output voltage का जो हिस्सा वापस feed होता है, hre = dVbe/dVce (Ib constant)। एक dependent voltage source, आमतौर पर बहुत छोटा (~1e-4)।',
        'hfe - forward current gain (unitless): small-signal current gain beta_ac, hfe = dIc/dIb (Vce constant)। एक dependent current source।',
        'hoe - output admittance (Siemens): inherent leakage, hoe = dIc/dVce (Ib constant)। एक resistor जिसका inverse ro है।',
        'पूरा hybrid circuit: input = hie series में एक source hre*Vce के साथ; output = current source hfe*Ib, 1/hoe के parallel में। सटीक, पर छोटे hre term से भरा हुआ।',
      ],
      transcriptEN:
        'Four h-parameters: hie a resistor, hre a tiny feedback source, hfe a current-gain source, hoe an output conductance whose inverse is ro.',
      transcriptHI:
        'चार h-parameters: hie एक resistor, hre एक छोटा feedback source, hfe एक current-gain source, hoe एक output conductance जिसका inverse ro है।',
      visualNote:
        'Four lettered panels pairing each definition with its symbol, then the two-box hybrid schematic (hie + hre*Vce on input, hfe*Ib || 1/hoe on output).',
    },
    {
      id: 'S05_ReModel',
      label: 'The re Model: Physical Foundation',
      kind: 'theory',
      subtitle: 're = VT/IE - the bouncer at the emitter door',
      theoryEN: [
        'Datasheet h-parameters are universal but lack physical intuition. The re model ties straight to the device physics and the real DC bias.',
        're is the dynamic AC resistance of the forward-biased base-emitter diode - the bouncer guarding the emitter door.',
        'Master formula: re = VT/IE, where VT is the thermal voltage (~26 mV at room temperature) and IE is the DC bias emitter current.',
        'Key insight (inverse relationship): a HIGHER DC bias current gives a LOWER re, which yields a stronger amplifier - push the bias up and the bouncer steps aside.',
        'Transconductance ties in directly: gm = IC/VT = 1/re, the slope that converts input voltage into output current. Walk the proof on the right.',
      ],
      theoryHI: [
        'Datasheet h-parameters universal तो हैं पर physical intuition नहीं देते। re model सीधे device physics और असली DC bias से जुड़ता है।',
        're forward-biased base-emitter diode का dynamic AC resistance है - emitter door की रखवाली करता bouncer।',
        'Master formula: re = VT/IE, जहाँ VT thermal voltage है (~26 mV room temperature पर) और IE DC bias emitter current है।',
        'मुख्य insight (inverse relationship): ज़्यादा DC bias current से re कम होता है, जिससे amplifier मज़बूत बनता है - bias बढ़ाइए, bouncer हट जाता है।',
        'Transconductance सीधे जुड़ता है: gm = IC/VT = 1/re, वह slope जो input voltage को output current में बदलता है। proof दाईं ओर चलाइए।',
      ],
      transcriptEN:
        're = VT/IE is the cornerstone: a dynamic diode resistance set by the bias current. Higher IE means smaller re means more gain.',
      transcriptHI:
        're = VT/IE आधारशिला है: bias current से तय एक dynamic diode resistance। ज़्यादा IE यानी छोटा re यानी ज़्यादा gain।',
      visualNote:
        'An IE slider driving re = 26mV/IE live, with the bouncer door narrowing (low re) or widening (high re), plus a StepThrough deriving re from the diode equation.',
    },
    {
      id: 'S06_BridgingModels',
      label: 'Bridging the Models',
      kind: 'theory',
      subtitle: 'h-parameters collapse into the clean re model',
      theoryEN: [
        'hie maps to beta*re: the base sees the emitter resistance multiplied by the current gain.',
        'hfe maps to beta_ac: the core amplification factor is identical in both models.',
        'hre maps to approximately 0: the feedback is so minute it is safely neglected (the input source is shorted out).',
        'hoe maps to 1/ro: the output admittance is just the inverse of the output resistance, so ro = 1/hoe.',
        'The messy four-parameter hybrid box collapses into a clean blueprint: input = beta*re, output = a beta*Ib current source in parallel with ro.',
      ],
      theoryHI: [
        'hie, beta*re बन जाता है: base, emitter resistance को current gain से गुणा करके देखता है।',
        'hfe, beta_ac बन जाता है: मूल amplification factor दोनों models में एक जैसा है।',
        'hre लगभग 0 बन जाता है: feedback इतना छोटा है कि सुरक्षित रूप से neglect कर दिया जाता है (input source short हो जाता है)।',
        'hoe, 1/ro बन जाता है: output admittance बस output resistance का inverse है, तो ro = 1/hoe।',
        'गन्दा चार-parameter hybrid box एक साफ़ blueprint में सिमट जाता है: input = beta*re, output = beta*Ib current source, ro के parallel में।',
      ],
      transcriptEN:
        'hie becomes beta*re, hfe becomes beta, hre becomes zero, hoe becomes 1/ro - the hybrid box collapses into a clean re blueprint.',
      transcriptHI:
        'hie बनता है beta*re, hfe बनता है beta, hre बनता है zero, hoe बनता है 1/ro - hybrid box एक साफ़ re blueprint में सिमट जाता है।',
      visualNote:
        'Arrow mappings hie->beta*re, hfe->beta_ac, hre->0, hoe->1/ro, ending in the simplified equivalent: beta*re input, beta*Ib source and ro on output.',
    },
    {
      id: 'S07_ThreeStepTransform',
      label: 'The 3-Step AC Transformation',
      kind: 'theory',
      subtitle: 'Short the velvet ropes, ground the DC, redraw',
      theoryEN: [
        'Step 1 - the original schematic: draw the full biased common-emitter amplifier with Vcc, R1/R2, Rc, Re and all the capacitors.',
        'Step 2 - short the caps and ground the DC: at signal frequency Xc = 1/(2*pi*f*C) collapses to zero, so coupling and bypass caps become wires; the steady Vcc node becomes an AC ground.',
        'Velvet ropes pass the music: the caps wave the AC through while the DC crowd-control barriers vanish.',
        'Step 3 - redraw the AC equivalent: what remains is the clean AC-only circuit, and the transistor is swapped for its re engine (beta*re input, beta*Ib source, ro).',
        'Now apply Kirchhoff\'s laws to read off the input impedance Zi, the output impedance Zo and the gain Av.',
      ],
      theoryHI: [
        'Step 1 - original schematic: पूरा biased common-emitter amplifier बनाइए, Vcc, R1/R2, Rc, Re और सारे capacitors के साथ।',
        'Step 2 - caps short करो और DC ground करो: signal frequency पर Xc = 1/(2*pi*f*C) शून्य हो जाता है, तो coupling और bypass caps wires बन जाती हैं; steady Vcc node एक AC ground बन जाता है।',
        'velvet ropes music को गुज़रने देती हैं: caps AC को अंदर लातीं हैं जबकि DC crowd-control barriers गायब हो जाते हैं।',
        'Step 3 - AC equivalent फिर से बनाओ: जो बचता है वह साफ़ AC-only circuit है, और transistor को उसके re engine से बदल दिया जाता है (beta*re input, beta*Ib source, ro)।',
        'अब Kirchhoff के नियम लगाकर input impedance Zi, output impedance Zo और gain Av पढ़ लीजिए।',
      ],
      transcriptEN:
        'At AC the caps short and Vcc grounds, so the biased schematic morphs into a clean AC equivalent ready for the re model.',
      transcriptHI:
        'AC पर caps short और Vcc ground हो जाता है, तो biased schematic एक साफ़ AC equivalent में बदल जाता है जो re model के लिए तैयार है।',
      visualNote:
        'A coupling-cap visual showing DC blocked and AC passed, plus an SVG of the full CE amplifier (Vcc, R1/R2, Rc, Re, Ce, coupling caps).',
    },
    {
      id: 'S08_GoldenTrinity',
      label: 'The Golden Trinity: Zi, Zo, Av',
      kind: 'theory',
      subtitle: 'Voltage gain, phase inversion and the unbypassed emitter',
      theoryEN: [
        'AC analysis boils down to three metrics: Zi (input impedance the source faces), Zo (output impedance the load sees), and Av = Vo/Vi (the gain).',
        'Zi: base resistance Zb = beta*re, then Zi = RB||beta*re (or R1||R2||beta*re for divider bias). Since RB is large, Zi is dictated by beta*re.',
        'Zo: set Vi = 0 so Ib = 0 and the beta*Ib source opens; what remains is Zo = RC||ro (~RC when ro is large).',
        'Gain (bypassed): Vi = Ib*beta*re and Vo = -(beta*Ib)*(RC||RL), so Av = -(RC||RL)/re (or -RC/re unloaded). The minus sign is a mandatory 180-degree phase inversion - the broadcast comes out upside-down.',
        'Unbypassed emitter trade-off: remove Ce and the full AC travels through RE, so Zb = beta*(re+RE) and Av drops to -(RC||RL)/(re+RE) - lower gain, but higher Zi and a more stable, linear amp (emitter resistance is reflected beta times larger at the base).',
      ],
      theoryHI: [
        'AC analysis तीन metrics में सिमट जाता है: Zi (source को दिखने वाला input impedance), Zo (load को दिखने वाला output impedance), और Av = Vo/Vi (gain)।',
        'Zi: base resistance Zb = beta*re, फिर Zi = RB||beta*re (या divider bias के लिए R1||R2||beta*re)। RB बड़ा होने से Zi को beta*re तय करता है।',
        'Zo: Vi = 0 रखिए ताकि Ib = 0 हो और beta*Ib source खुल जाए; जो बचता है वह Zo = RC||ro है (ro बड़ा हो तो ~RC)।',
        'Gain (bypassed): Vi = Ib*beta*re और Vo = -(beta*Ib)*(RC||RL), तो Av = -(RC||RL)/re (या unloaded -RC/re)। minus चिह्न ज़रूरी 180-degree phase inversion है - broadcast उल्टा निकलता है।',
        'Unbypassed emitter trade-off: Ce हटाइए तो पूरा AC RE से गुज़रता है, तो Zb = beta*(re+RE) और Av गिरकर -(RC||RL)/(re+RE) हो जाता है - कम gain, पर ज़्यादा Zi और ज़्यादा stable, linear amp (emitter resistance base पर beta गुना बड़ा दिखता है)।',
      ],
      transcriptEN:
        'Zi = RB||beta*re, Zo = RC||ro, and Av = -(RC||RL)/re with the mandatory inversion. Unbypassing RE trades gain for stability and Zi.',
      transcriptHI:
        'Zi = RB||beta*re, Zo = RC||ro, और Av = -(RC||RL)/re ज़रूरी inversion के साथ। RE को unbypass करना gain को stability और Zi से बदल देता है।',
      visualNote:
        'The SmallSignalGain lab (live Av, in/out waves) plus a bypassed-vs-unbypassed Ce toggle comparing -(RC||RL)/re against -(RC||RL)/(re+RE).',
    },
    {
      id: 'S09_EarlyAndLoading',
      label: 'The Early Effect, Loading & Synthesis',
      kind: 'theory',
      subtitle: 'ro, source and load loading, and the master matrix',
      theoryEN: [
        'Early effect: real transistors have an internal leakage path ro = (VA + VCEQ)/ICQ, where VA is the Early voltage. Including it, Av = -(RC||ro)/re slightly trims the gain.',
        'Source loading: the source resistance Rs forms a divider at the input so Vi < Vs - the amp never sees the full source voltage (the crowd at the door soaks up some signal).',
        'Output loading: the load RL sits in parallel with RC, dropping the effective collector load, so loaded gain Av_L = -(RC||RL)/re is always lower than the ideal unloaded gain - the room\'s crowd soaks up the broadcast.',
        'Synthesis matrix - Fixed bias: Zi = RB||beta*re, Zo = RC, Av = -RC/re.',
        'Voltage divider: Zi = R1||R2||beta*re, Zo = RC, Av = -RC/re. Unbypassed emitter: Zi = RB||beta*(re+RE), Zo = RC, Av = -RC/(re+RE).',
      ],
      theoryHI: [
        'Early effect: असली transistors में एक internal leakage path ro = (VA + VCEQ)/ICQ होता है, जहाँ VA Early voltage है। इसे जोड़ने पर Av = -(RC||ro)/re gain को थोड़ा कम कर देता है।',
        'Source loading: source resistance Rs input पर एक divider बना देता है तो Vi < Vs - amp को पूरा source voltage कभी नहीं मिलता (door पर भीड़ कुछ signal सोख लेती है)।',
        'Output loading: load RL, RC के parallel में बैठता है, effective collector load गिरा देता है, तो loaded gain Av_L = -(RC||RL)/re हमेशा ideal unloaded gain से कम होता है - कमरे की भीड़ broadcast सोख लेती है।',
        'Synthesis matrix - Fixed bias: Zi = RB||beta*re, Zo = RC, Av = -RC/re।',
        'Voltage divider: Zi = R1||R2||beta*re, Zo = RC, Av = -RC/re। Unbypassed emitter: Zi = RB||beta*(re+RE), Zo = RC, Av = -RC/(re+RE)।',
      ],
      transcriptEN:
        'ro from the Early effect and the source/load dividers all trim the gain; the synthesis matrix tabulates Zi, Zo, Av for the three configs.',
      transcriptHI:
        'Early effect से ro और source/load dividers सब gain को कम करते हैं; synthesis matrix तीनों configs के लिए Zi, Zo, Av tabulate करता है।',
      visualNote:
        'A loading lab with Rs and RL sliders showing Vi < Vs and RC||RL shrinking the load, plus a synthesis-matrix table for the three CE configurations.',
    },
    {
      id: 'S10_Flashcards',
      label: 'Flashcards - Lock It In',
      kind: 'flashcards',
      subtitle: 'Eight cards: re, superposition, caps, gain, the h-to-re bridge',
      theoryEN: [
        'Flip each card: term on the front, the plain explanation on the back.',
        'These eight cover re = VT/IE, why we split DC and AC, the coupling cap at AC, the CE gain, the hie->re map, hre/hoe, the output impedance Zo and the unbypassed-emitter trade-off.',
        'Aim to explain each back in your own words before flipping - that is real recall.',
      ],
      theoryHI: [
        'हर card पलटें: सामने term, पीछे सीधी व्याख्या।',
        'ये आठ cards re = VT/IE, DC और AC को क्यों अलग करते हैं, AC पर coupling cap, CE gain, hie->re map, hre/hoe, output impedance Zo और unbypassed-emitter trade-off को cover करते हैं।',
        'पलटने से पहले हर पीछे वाली बात अपने शब्दों में बताने की कोशिश करें - यही असली recall है।',
      ],
      transcriptEN: 'Eight cards to lock the small-signal model into memory. Teach the back in your own words before flipping.',
      transcriptHI: 'small-signal model को याददाश्त में बैठाने के लिए आठ cards। पलटने से पहले पीछे वाली बात अपने शब्दों में सिखाइए।',
      visualNote: 'Watermarked shareable flip-card deck: bold term on the front, explanation on the back, accent colours per card.',
    },
    {
      id: 'S11_Quiz',
      label: 'Quiz - Test the Amplifier',
      kind: 'quiz',
      subtitle: 'Eight questions on re, gain, caps and the h-model',
      theoryEN: [
        'Eight multiple-choice questions on the small-signal model, re, the AC equivalent and the voltage gain.',
        'Read every option - the wrong ones are the misconceptions this module exists to break.',
        'Explanations follow each answer so a miss becomes a lesson.',
      ],
      theoryHI: [
        'small-signal model, re, AC equivalent और voltage gain पर आठ multiple-choice सवाल।',
        'हर option पढ़ें - ग़लत वाले वही misconceptions हैं जिन्हें तोड़ने के लिए यह module बना है।',
        'हर जवाब के बाद explanation है ताकि चूक भी एक सबक़ बन जाए।',
      ],
      transcriptEN: 'Eight quick questions on the re model and CE amplifier gain. Read all four options - the wrong ones are the classic traps.',
      transcriptHI: 're model और CE amplifier gain पर आठ तेज़ सवाल। चारों options पढ़ें - ग़लत वाले classic traps हैं।',
      visualNote: 'QuizArena with eight problems; show running score and reveal the explanation on answer.',
    },
    {
      id: 'S12_Recap',
      label: 'Recap - The Amplifier in One Page',
      kind: 'recap',
      subtitle: 'Everything that turns the whisper into a broadcast',
      theoryEN: [
        'Split DC and AC by superposition: the DC bias is the house power, the AC small-signal is the music. Analyse them separately, then add.',
        're = VT/IE is the bouncer at the emitter door; higher bias IE means smaller re means more gain. gm = IC/VT = 1/re.',
        'Coupling and bypass caps are velvet ropes: at AC their reactance Xc -> 0, so they short, pass the music and let Vcc become an AC ground.',
        'The h-model collapses to the re blueprint: hie -> beta*re, hfe -> beta, hre -> 0, hoe -> 1/ro.',
        'The golden trinity: Zi = RB||beta*re, Zo = RC||ro, Av = -(RC||RL)/re. The minus sign is the mandatory 180-degree phase inversion - the upside-down broadcast.',
        'Sources for the formulas and proofs are listed below.',
      ],
      theoryHI: [
        'Superposition से DC और AC अलग करिए: DC bias house power है, AC small-signal music है। दोनों को अलग-अलग पढ़कर फिर जोड़िए।',
        're = VT/IE emitter door का bouncer है; ज़्यादा bias IE यानी छोटा re यानी ज़्यादा gain। gm = IC/VT = 1/re।',
        'Coupling और bypass caps velvet ropes हैं: AC पर उनका reactance Xc -> 0, तो वे short हो जाती हैं, music को गुज़रने देती हैं और Vcc को AC ground बना देती हैं।',
        'h-model, re blueprint में सिमट जाता है: hie -> beta*re, hfe -> beta, hre -> 0, hoe -> 1/ro।',
        'Golden trinity: Zi = RB||beta*re, Zo = RC||ro, Av = -(RC||RL)/re। minus चिह्न ज़रूरी 180-degree phase inversion है - उल्टा broadcast।',
        'Formulas और proofs के sources नीचे दिए हैं।',
      ],
      transcriptEN:
        'The whole amplifier on one page: split DC and AC, re = VT/IE sets the gain, caps short at AC, the h-model becomes the re blueprint, and Av = -(RC||RL)/re inverts the signal.',
      transcriptHI:
        'पूरा amplifier एक page पर: DC और AC अलग करिए, re = VT/IE gain तय करता है, caps AC पर short होती हैं, h-model re blueprint बनता है, और Av = -(RC||RL)/re signal को invert करता है।',
      visualNote:
        'One-page cheat grid: split / re / caps / h-to-re / trinity, plus a small Sources list of the reference links.',
    },
  ],
  flashcards: [
    {
      frontEN: 're (emitter resistance)',
      backEN:
        'The dynamic AC resistance of the forward-biased base-emitter diode: re = VT/IE ~ 26mV/IE. It is the bouncer at the emitter door - higher bias current makes it smaller, raising the gain.',
      frontHI: 're (emitter resistance)',
      backHI:
        'Forward-biased base-emitter diode का dynamic AC resistance: re = VT/IE ~ 26mV/IE। यह emitter door का bouncer है - ज़्यादा bias current इसे छोटा करता है, gain बढ़ाता है।',
    },
    {
      frontEN: 'Why split DC and AC analysis?',
      backEN:
        'Superposition. The AC signal is small, so the transistor is locally linear around the Q-point. Analyse the DC bias (the house power) and the AC small-signal (the music) separately, then add them back.',
      frontHI: 'DC और AC analysis क्यों अलग करें?',
      backHI:
        'Superposition। AC signal छोटा है, तो transistor Q-point के आसपास locally linear है। DC bias (house power) और AC small-signal (music) को अलग-अलग पढ़कर फिर जोड़ लीजिए।',
    },
    {
      frontEN: 'Coupling/bypass capacitor at AC',
      backEN:
        'Its reactance Xc = 1/(2*pi*f*C) -> 0 at signal frequency, so it acts as a short. A velvet rope that passes the music (AC) but blocks the DC barrier - and it makes Vcc an AC ground.',
      frontHI: 'AC पर coupling/bypass capacitor',
      backHI:
        'Signal frequency पर इसका reactance Xc = 1/(2*pi*f*C) -> 0, तो यह short की तरह काम करता है। एक velvet rope जो music (AC) गुज़रने देती है पर DC barrier रोकती है - और Vcc को AC ground बना देती है।',
    },
    {
      frontEN: 'CE voltage gain (bypassed)',
      backEN:
        'Av = -(Rc||RL)/re. The whisper is multiplied by the ratio of collector resistance to the bouncer resistance. The minus sign is the mandatory 180-degree phase inversion - the broadcast comes out upside-down.',
      frontHI: 'CE voltage gain (bypassed)',
      backHI:
        'Av = -(Rc||RL)/re। whisper को collector resistance और bouncer resistance के ratio से गुणा किया जाता है। minus चिह्न ज़रूरी 180-degree phase inversion है - broadcast उल्टा निकलता है।',
    },
    {
      frontEN: 'hie -> re model',
      backEN:
        'hie ~ beta*re: the input impedance at the base equals the emitter resistance reflected by the current gain. The base "sees" re multiplied by beta.',
      frontHI: 'hie -> re model',
      backHI:
        'hie ~ beta*re: base पर input impedance, current gain से reflect हुए emitter resistance के बराबर है। base, re को beta गुना "देखता" है।',
    },
    {
      frontEN: 'hre and hoe in the re model',
      backEN:
        'hre ~ 0: the reverse feedback (~1e-4) is so tiny it is neglected, the input source shorted out. hoe = 1/ro: the output admittance is the inverse of the output resistance ro.',
      frontHI: 're model में hre और hoe',
      backHI:
        'hre ~ 0: reverse feedback (~1e-4) इतना छोटा है कि neglect कर दिया जाता है, input source short हो जाता है। hoe = 1/ro: output admittance, output resistance ro का inverse है।',
    },
    {
      frontEN: 'Output impedance Zo',
      backEN:
        'Set Vi = 0, so Ib = 0 and the beta*Ib current source opens. What remains is Zo = RC||ro, which is approximately RC when ro is large.',
      frontHI: 'Output impedance Zo',
      backHI:
        'Vi = 0 रखिए, तो Ib = 0 और beta*Ib current source खुल जाता है। जो बचता है वह Zo = RC||ro है, जो ro बड़ा होने पर लगभग RC होता है।',
    },
    {
      frontEN: 'Unbypassed emitter trade-off',
      backEN:
        'Remove Ce and the full AC flows through RE: Zb = beta*(re+RE) raises Zi and stabilises gain, but Av falls to -(Rc||RL)/(re+RE). Emitter resistance is reflected beta times larger at the base.',
      frontHI: 'Unbypassed emitter trade-off',
      backHI:
        'Ce हटाइए तो पूरा AC RE से बहता है: Zb = beta*(re+RE) Zi बढ़ाता है और gain stable करता है, पर Av गिरकर -(Rc||RL)/(re+RE) हो जाता है। Emitter resistance base पर beta गुना बड़ा reflect होता है।',
    },
  ],
  quiz: [
    {
      questionEN: 'What does the small-signal emitter resistance re equal?',
      questionHI: 'small-signal emitter resistance re किसके बराबर होता है?',
      options: ['re = IE/VT', 're = VT/IE', 're = beta*IE', 're = VT*IE'],
      answerIndex: 1,
      explainEN: 're = VT/IE, with VT ~ 26 mV. A higher bias current IE gives a smaller re - the bouncer steps aside and the gain rises.',
      explainHI: 're = VT/IE, जहाँ VT ~ 26 mV। ज़्यादा bias current IE से re छोटा होता है - bouncer हट जाता है और gain बढ़ता है।',
    },
    {
      questionEN: 'Why do we short coupling and bypass capacitors when drawing the AC equivalent circuit?',
      questionHI: 'AC equivalent circuit बनाते समय हम coupling और bypass capacitors को short क्यों करते हैं?',
      options: [
        'They block AC and pass DC',
        'At signal frequency their reactance Xc is near zero, so they act as shorts to AC',
        'They become open circuits to AC',
        'They turn into current sources',
      ],
      answerIndex: 1,
      explainEN: 'At AC, Xc = 1/(2*pi*f*C) is very small, so caps behave as shorts - the velvet ropes pass the music and Vcc becomes an AC ground.',
      explainHI: 'AC पर Xc = 1/(2*pi*f*C) बहुत छोटा है, तो caps short की तरह काम करती हैं - velvet ropes music गुज़रने देती हैं और Vcc AC ground बन जाता है।',
    },
    {
      questionEN: 'For a common-emitter amp with the emitter fully bypassed, the voltage gain is:',
      questionHI: 'emitter पूरी तरह bypassed वाले common-emitter amp के लिए voltage gain है:',
      options: ['Av = +(Rc||RL)/re', 'Av = -(Rc||RL)/re', 'Av = -re/(Rc||RL)', 'Av = -(Rc||RL)*re'],
      answerIndex: 1,
      explainEN: 'Av = -(Rc||RL)/re. The minus sign signals the mandatory 180-degree phase inversion - the broadcast is amplified but flipped.',
      explainHI: 'Av = -(Rc||RL)/re। minus चिह्न ज़रूरी 180-degree phase inversion दिखाता है - broadcast amplify तो होता है पर उल्टा।',
    },
    {
      questionEN: 'In the re model, the hybrid parameter hie corresponds to:',
      questionHI: 're model में hybrid parameter hie किसके बराबर होता है?',
      options: ['1/ro', 'beta*re', 'beta_ac', 'approximately 0'],
      answerIndex: 1,
      explainEN: 'hie ~ beta*re: the base sees the emitter resistance multiplied by the current gain, so the input impedance is beta*re.',
      explainHI: 'hie ~ beta*re: base, emitter resistance को current gain से गुणा करके देखता है, तो input impedance beta*re है।',
    },
    {
      questionEN: 'Why is hre usually neglected when converting to the re model?',
      questionHI: 're model में बदलते समय hre को आमतौर पर क्यों neglect किया जाता है?',
      options: [
        'It is infinitely large',
        'The reverse feedback effect is extremely small and can be safely shorted out',
        'It equals beta',
        'It sets the output impedance',
      ],
      answerIndex: 1,
      explainEN: 'hre (~1e-4) represents a tiny output-to-input feedback that is negligible, so hre ~ 0 and the source is shorted out.',
      explainHI: 'hre (~1e-4) एक छोटा output-to-input feedback है जो नगण्य है, तो hre ~ 0 और source short कर दिया जाता है।',
    },
    {
      questionEN: 'To find the output impedance Zo of the CE amplifier, you:',
      questionHI: 'CE amplifier का output impedance Zo निकालने के लिए आप:',
      options: [
        'Set Vo = 0 and solve for Ii',
        'Set Vi = 0, which makes Ib = 0 and opens the beta*Ib source, leaving Zo = RC||ro',
        'Open the load RL only',
        'Short the collector to ground',
      ],
      answerIndex: 1,
      explainEN: 'With Vi = 0, Ib = 0 so the dependent source opens; Zo = RC||ro, which is approximately RC when ro is large.',
      explainHI: 'Vi = 0 पर Ib = 0, तो dependent source खुल जाता है; Zo = RC||ro, जो ro बड़ा होने पर लगभग RC है।',
    },
    {
      questionEN: 'Removing the emitter bypass capacitor Ce causes the base input resistance to become:',
      questionHI: 'emitter bypass capacitor Ce हटाने से base input resistance बन जाता है:',
      options: ['beta*re only', 'beta*(re + RE)', 're/beta', 'RE/beta'],
      answerIndex: 1,
      explainEN: 'Without the bypass, the full AC travels through RE, reflected to the base as beta*(re+RE) - so Zi rises and the gain falls.',
      explainHI: 'bypass के बिना, पूरा AC RE से गुज़रता है, base पर beta*(re+RE) के रूप में reflect होकर - तो Zi बढ़ता है और gain गिरता है।',
    },
    {
      questionEN: 'The transconductance gm of a BJT is best expressed as:',
      questionHI: 'किसी BJT का transconductance gm सबसे सही ढंग से कैसे लिखा जाता है?',
      options: ['gm = re/VT', 'gm = IC/VT = 1/re', 'gm = VT/IC', 'gm = beta*re'],
      answerIndex: 1,
      explainEN: 'gm = IC/VT, which is exactly 1/re - the slope converting input voltage into output current. Higher IC means a larger gm.',
      explainHI: 'gm = IC/VT, जो बिल्कुल 1/re है - वह slope जो input voltage को output current में बदलती है। ज़्यादा IC यानी बड़ा gm।',
    },
  ],
}) as unknown as SubContent;
