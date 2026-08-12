import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/39 - Mealy & Moore Machines, "Two Philosophies Of Output" (Sequential Logic track).
 * Core contrast: a Moore machine's output is a function of the CURRENT STATE ONLY,
 * Y = lambda(S) - written inside the state node, registered, so it changes one
 * clock cycle after the input that caused it. A Mealy machine's output is a
 * function of the CURRENT STATE AND THE CURRENT INPUT, Y = lambda(S, X) - written
 * on the transition arc, combinational, so it can react within the very same
 * clock cycle. Worked example throughout: a "1011" overlap-allowed sequence
 * detector, built once as a 4-state Mealy machine (states a/b/c/d, 2 flip-flops)
 * and once as a 5-state Moore machine (states a/b/c/d/e, 3 flip-flops - the extra
 * state e exists purely to give the "just matched" output somewhere to live).
 * Every transition in scenes.tsx is derived in code from a real KMP-style
 * automaton built from the pattern [1,0,1,1] (prefix function + delta table),
 * never hand-typed per input. State-encoding section covers binary / Gray /
 * one-hot applied to those same detector states.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Mealy & Moore Machines - Two Philosophies Of Output",
  moduleSubtitle: "The same finite-state machine, read two ways: an output tied only to the state, or an output tied to the state and the input together.",
  scenes: [
    {
      id: "S00_Cover",
      label: "Two Machines, One Idea",
      kind: "cover",
      subtitle: "Same states, same transitions - only WHEN and WHAT decides the output changes.",
      theoryEN: [
        "Every clocked sequential circuit you have already met is built from the same two blocks: a state register that remembers where you are, and next-state logic that decides where to go next. This module answers the one question left over - how does the OUTPUT get computed - and there are exactly two textbook answers, named after the engineers who formalised them.",
        "A Moore machine (Edward Moore) computes its output purely from the current state: Y = lambda(S). The output is conceptually written inside the state itself, so it can only ever change when the state changes - one clock edge after whatever input caused that change.",
        "A Mealy machine (George Mealy) computes its output from the current state AND the current input together: Y = lambda(S, X). The output is written on the transition arc, so it is free to react within the very same clock cycle the input arrives, before any clock edge fires.",
        "Both machines in this module solve the exact same task - spotting the bit pattern 1011 in a serial stream - and you will drive one shared bit stream into both live diagrams below and watch their outputs answer at different moments, even though they agree on every match.",
        "By the end you can build either style from a specification, count how many flip-flops each needs, choose a state encoding, and explain in one sentence why Mealy is called faster-but-riskier and Moore is called slower-but-safer."
      ],
      theoryHI: [
        "आपने अब तक जो भी clocked sequential circuit देखा है वह इन्हीं दो blocks से बना है: एक state register जो याद रखता है आप कहाँ हैं, और next-state logic जो तय करता है आगे कहाँ जाना है। यह module बचा हुआ एक सवाल हल करता है - OUTPUT कैसे compute होता है - और इसके ठीक दो textbook जवाब हैं, उन engineers के नाम पर जिन्होंने इन्हें formalise किया।",
        "एक Moore machine (Edward Moore) अपना output सिर्फ़ current state से compute करती है: Y = lambda(S)। Output concept में state के अंदर ही लिखा जाता है, तो यह तभी बदल सकता है जब state बदले - जिस input ने वह बदलाव कराया उसके एक clock edge बाद।",
        "एक Mealy machine (George Mealy) अपना output current state AND current input दोनों से compute करती है: Y = lambda(S, X)। Output transition arc पर लिखा जाता है, तो यह उसी clock cycle में react करने को स्वतंत्र है जिसमें input आता है, किसी भी clock edge से पहले।",
        "इस module की दोनों machines बिल्कुल वही काम हल करती हैं - serial stream में bit pattern 1011 पकड़ना - और आप नीचे दोनों live diagrams में एक साझा bit stream feed करेंगे और देखेंगे कि उनके outputs अलग-अलग पलों पर जवाब देते हैं, भले ही वे हर match पर सहमत हों।",
        "अंत तक आप specification से दोनों styles बना पाएँगे, हर एक को कितने flip-flops चाहिए गिन पाएँगे, state encoding चुन पाएँगे, और एक वाक्य में बता पाएँगे कि Mealy को faster-but-riskier और Moore को slower-but-safer क्यों कहा जाता है।"
      ],
      transcriptEN: "Welcome to Mealy and Moore machines. Every clocked sequential circuit is built from a state register plus next-state logic; this module answers the one remaining question - how the output gets computed. A Moore machine's output is a function of the current state only, written inside the state, changing one clock edge after the causing input. A Mealy machine's output is a function of the current state and the current input together, written on the transition arc, able to react within the same clock cycle. Both machines here solve the same task - spotting 1011 in a bit stream - and you'll feed one shared stream into both live diagrams and watch their outputs answer at different moments. By the end you'll build either style, count flip-flops, choose an encoding, and explain why Mealy is faster-but-riskier and Moore is slower-but-safer.",
      transcriptHI: "Mealy और Moore machines में आपका स्वागत है। हर clocked sequential circuit एक state register और next-state logic से बना है; यह module बचा हुआ सवाल हल करता है - output कैसे compute होता है। Moore machine का output सिर्फ़ current state का function है, state के अंदर लिखा, causing input के एक clock edge बाद बदलता है। Mealy machine का output current state और current input दोनों का function है, transition arc पर लिखा, उसी clock cycle में react कर सकता है। यहाँ दोनों machines एक ही काम हल करती हैं - bit stream में 1011 पकड़ना - और आप एक साझा stream दोनों live diagrams में feed करेंगे और देखेंगे उनके outputs अलग पलों पर जवाब देते हैं। अंत तक आप दोनों styles बनाएँगे, flip-flops गिनेंगे, encoding चुनेंगे, और बताएँगे Mealy faster-but-riskier और Moore slower-but-safer क्यों है।",
      visualNote: "Hero: side-by-side Mealy (4-state) and Moore (5-state) StateDiagrams sharing one live input-bit toggle and a feed button; each machine's live Y is shown beside its diagram, computed from the same automaton in code."
    },
    {
      id: "S01_Video",
      label: "Mealy & Moore, The Two Philosophies Of Output",
      kind: "video",
      subtitle: "A short film: one finite-state machine, two ways to wire its output.",
      theoryEN: [
        "Here is the whole idea in one breath before you watch. Every finite-state machine already has a state register and next-state logic; the only design choice left is where the output logic gets its inputs from - the state alone, or the state plus the raw input line.",
        "Moore ties the output to the state alone: Y = lambda(S). Picture the output as a label painted inside each state circle - the label only changes when you physically move to a different circle, and moving only happens on a clock edge.",
        "Mealy ties the output to the state and the input together: Y = lambda(S, X). Picture the output as a label painted on the arrow between circles - it depends on which arrow you are currently traversing, and which arrow that is can be known the instant the input changes, no clock edge required.",
        "Watch for the running example: a detector for the bit pattern 1011. The Moore version needs five states because it needs one whole state, e, dedicated to nothing but holding the 1 output. The Mealy version needs only four states because the same 1 output rides directly on the arc leaving the fourth state.",
        "Keep the trade-off in mind for the rest of the module: Mealy answers faster (same cycle) but is more exposed to input noise (a glitch on X becomes a glitch on Y); Moore answers one cycle slower but is completely shielded from any input transient that happens between clock edges."
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार एक साँस में। हर finite-state machine में पहले से एक state register और next-state logic है; बचा हुआ design चुनाव यह है कि output logic अपने inputs कहाँ से ले - सिर्फ़ state से, या state जमा raw input line से।",
        "Moore output को सिर्फ़ state से बाँधती है: Y = lambda(S)। output को हर state circle के अंदर पेंट किया लेबल सोचिए - लेबल तभी बदलता है जब आप शारीरिक रूप से दूसरे circle पर जाते हैं, और जाना सिर्फ़ clock edge पर होता है।",
        "Mealy output को state और input दोनों से बाँधती है: Y = lambda(S, X)। output को circles के बीच वाले arrow पर पेंट किया लेबल सोचिए - यह इस पर निर्भर करता है कि आप अभी कौन सा arrow पार कर रहे हैं, और वह arrow input बदलते ही, बिना किसी clock edge के, जाना जा सकता है।",
        "चलते उदाहरण पर ग़ौर कीजिए: bit pattern 1011 का एक detector। Moore version को पाँच states चाहिए क्योंकि इसे एक पूरा state, e, सिर्फ़ 1 output रखने के लिए समर्पित करना पड़ता है। Mealy version को सिर्फ़ चार states चाहिए क्योंकि वही 1 output सीधे चौथे state से निकलते arc पर सवार हो जाता है।",
        "बाक़ी module के लिए trade-off याद रखिए: Mealy तेज़ जवाब देती है (उसी cycle में) पर input के शोर के लिए ज़्यादा उजागर है (X पर glitch, Y पर glitch बन जाता है); Moore एक cycle देर से जवाब देती है पर clock edges के बीच होने वाले किसी भी input transient से पूरी तरह सुरक्षित है।"
      ],
      transcriptEN: "Every finite-state machine has a state register and next-state logic; the only design choice left is where the output logic reads from - the state alone, or the state plus the raw input. Moore ties output to state alone: Y equals lambda of S, a label painted inside each state circle that only changes when you move circles, and moving only happens on a clock edge. Mealy ties output to state and input together: Y equals lambda of S comma X, a label painted on the arrow between circles, knowable the instant the input changes, no clock edge required. Watch the running example, a detector for 1011: the Moore version needs five states because it needs a whole state dedicated to holding the one output; the Mealy version needs only four states because that same output rides directly on the arc leaving the fourth state. Keep the trade-off in mind: Mealy answers faster but is more exposed to input noise; Moore answers one cycle slower but is fully shielded from transients between clock edges.",
      transcriptHI: "हर finite-state machine में state register और next-state logic है; बचा design चुनाव यह है कि output logic कहाँ से पढ़े - सिर्फ़ state से, या state जमा raw input से। Moore output को सिर्फ़ state से बाँधती है: Y बराबर lambda of S, हर state circle के अंदर पेंट लेबल, जो सिर्फ़ circle बदलने पर बदलता है, और बदलना सिर्फ़ clock edge पर होता है। Mealy output को state और input दोनों से बाँधती है: Y बराबर lambda of S comma X, circles के बीच arrow पर पेंट लेबल, input बदलते ही जाना जा सकता है, कोई clock edge नहीं चाहिए। चलता उदाहरण देखिए, 1011 का detector: Moore version को पाँच states चाहिए क्योंकि एक पूरा state सिर्फ़ output रखने को समर्पित है; Mealy version को सिर्फ़ चार states चाहिए क्योंकि वही output सीधे चौथे state से निकलते arc पर सवार है। Trade-off याद रखिए: Mealy तेज़ जवाब देती पर input के शोर से ज़्यादा उजागर; Moore एक cycle देर से पर clock edges के बीच transients से पूरी तरह सुरक्षित।",
      visualNote: "Animated explainer: a state circle vs a labelled arrow, morphing between the Moore and Mealy notations over the same 1011 detector."
    },
    {
      id: "S02_Facts",
      label: "Two Philosophies Of Output",
      kind: "theory",
      subtitle: "Output = f(state) only, versus output = f(state, input) - and exactly where that extra wire goes.",
      theoryEN: [
        "Strip a clocked sequential circuit down to its three blocks and both machines share the first two identically: next-state logic (combinational gates) computes what the state register should load next, and the state register (the flip-flop bank) latches that value on every clock edge and feeds it straight back into the next-state logic as the present state. Nothing about that loop differs between Moore and Mealy - the entire difference lives in the third block, the output logic.",
        "In a Moore machine the output logic has exactly one input bus: the state register's output, Q. Its equation is Y = lambda(S). Because Q can only change value at a clock edge, and Y is a pure combinational function of Q, Y is guaranteed not to change until the next clock edge lands - even if the input that will eventually flip Q is already sitting, stable, on the input pin right now.",
        "In a Mealy machine the output logic has two input buses: the state register's output Q, exactly as before, AND the raw external input line X, wired in directly, bypassing the register entirely. Its equation is Y = lambda(S, X). That second wire is the entire structural difference between the two philosophies - one extra bus running from the primary input straight into the output gates, in parallel with the wire that already runs from the primary input into the next-state gates.",
        "Because that wire is a plain combinational path, Y in a Mealy machine can move the instant X moves, with no register in between and therefore no clock edge to wait for. In a Moore machine no such path exists at all - trace the output logic's inputs and you will only ever find wires coming from Q, never a wire coming straight from a primary input.",
        "This single wiring fact - present or absent - explains every other difference you will meet in this module: why Mealy can announce a result the same cycle the deciding bit arrives, why Moore cannot, why Mealy is vulnerable to a glitchy input and Moore is not, and why Mealy typically gets away with fewer states (output rides an arc that already exists) while Moore typically needs an extra state whose entire purpose is to host one output value.",
        "Keep the comparison table in view for the rest of the module: output dependence (state only vs state+input), output timing (synchronous-to-clock vs asynchronous/immediate), typical state count (higher vs lower), hardware complexity (more flip-flops/logic vs highly minimised), and glitch susceptibility (immune/shielded vs highly vulnerable) - Moore on the safe side of every row, Mealy on the fast side of every row."
      ],
      theoryHI: [
        "किसी clocked sequential circuit को उसके तीन blocks तक उतार दीजिए, और पहले दो blocks दोनों machines में बिल्कुल एक जैसे हैं: next-state logic (combinational gates) तय करता है कि state register आगे क्या load करे, और state register (flip-flop bank) हर clock edge पर वह मान latch करता है और उसे present state की तरह सीधे next-state logic में वापस feed करता है। उस loop में Moore और Mealy के बीच कुछ भी अलग नहीं है - पूरा अंतर तीसरे block, output logic, में रहता है।",
        "Moore machine में output logic का इनपुट बस ठीक एक है: state register का output, Q। इसका equation है Y = lambda(S)। चूँकि Q सिर्फ़ clock edge पर बदल सकता है, और Y, Q का शुद्ध combinational function है, Y तब तक नहीं बदल सकता जब तक अगला clock edge न आए - चाहे जो input आख़िर में Q बदलने वाला है वह अभी input pin पर स्थिर बैठा भी हो।",
        "Mealy machine में output logic के दो इनपुट बस हैं: state register का output Q, ठीक पहले जैसा, AND raw external input line X, सीधे wired, register को पूरी तरह bypass करते हुए। इसका equation है Y = lambda(S, X)। वह दूसरी wire ही दोनों नज़रियों के बीच पूरा structural अंतर है - primary input से सीधे output gates तक जाने वाली एक अतिरिक्त bus, उस wire के समानांतर जो पहले से primary input से next-state gates तक जाती है।",
        "चूँकि वह wire एक सादी combinational path है, Mealy machine में Y, X के बदलते ही बदल सकता है, बीच में कोई register नहीं, इसलिए किसी clock edge का इंतज़ार नहीं। Moore machine में ऐसी कोई path सिरे से मौजूद ही नहीं है - output logic के इनपुट्स trace कीजिए और आपको सिर्फ़ Q से आती wires मिलेंगी, कभी किसी primary input से सीधे आती wire नहीं।",
        "यह अकेला wiring तथ्य - मौजूद या ग़ैर-मौजूद - इस module में मिलने वाले बाक़ी सारे अंतरों को समझा देता है: Mealy उसी cycle में नतीजा क्यों घोषित कर सकती है जिसमें फ़ैसला करने वाला bit आता है, Moore क्यों नहीं कर सकती, Mealy glitchy input से क्यों असुरक्षित है और Moore नहीं, और Mealy अक्सर कम states में क्यों निकल जाती है (output पहले से मौजूद arc पर सवार होता है) जबकि Moore को अक्सर एक अतिरिक्त state चाहिए जिसका पूरा काम बस एक output मान रखना है।",
        "बाक़ी module के लिए comparison table नज़र में रखिए: output dependence (सिर्फ़ state बनाम state+input), output timing (clock-synchronous बनाम asynchronous/immediate), typical state count (ज़्यादा बनाम कम), hardware complexity (ज़्यादा flip-flops/logic बनाम highly minimised), और glitch susceptibility (immune/shielded बनाम highly vulnerable) - हर row में Moore सुरक्षित पक्ष पर, Mealy तेज़ पक्ष पर।"
      ],
      transcriptEN: "Strip a sequential circuit to three blocks: next-state logic, a state register, and output logic. Moore and Mealy share the first two identically; the difference lives entirely in the third. Moore's output logic reads only the register's Q, so Y equals lambda of S, and Y cannot move before the next clock edge. Mealy's output logic reads Q AND the raw input X directly, bypassing the register - Y equals lambda of S comma X - so Y can move the instant X moves, no clock edge required. That one extra wire, present in Mealy and absent in Moore, explains everything else in this module: same-cycle response, glitch vulnerability, and typical state count.",
      transcriptHI: "एक sequential circuit को तीन blocks तक उतारिए: next-state logic, एक state register, और output logic। Moore और Mealy पहले दो में बिल्कुल एक जैसे हैं; अंतर पूरी तरह तीसरे में है। Moore की output logic सिर्फ़ register का Q पढ़ती है, तो Y बराबर lambda of S, और Y अगले clock edge से पहले नहीं हिल सकता। Mealy की output logic Q AND raw input X दोनों सीधे पढ़ती है, register को bypass करते हुए - Y बराबर lambda of S comma X - तो Y, X के बदलते ही हिल सकता है, कोई clock edge नहीं चाहिए। वह एक अतिरिक्त wire, Mealy में मौजूद और Moore में ग़ैर-मौजूद, इस module की बाक़ी हर बात समझा देती है।",
      visualNote: "Bespoke twin block diagram: next-state logic -> register -> output logic for both machines, with a live X/Q/Y toy circuit; only the Mealy diagram shows a wire from X straight into the output-logic box."
    },
    {
      id: "S03_Compare",
      label: "The Timing Consequence",
      kind: "theory",
      subtitle: "Moore's output lags one clock behind Mealy's - and Mealy can glitch if the input does.",
      theoryEN: [
        "Because Mealy's output logic reads the raw input directly, Y can change the instant X changes - mid-cycle, well before any clock edge - since it is a purely combinational path from X to Y with zero register delay sitting in between.",
        "Moore's output logic reads only the registered state, so Y cannot move until the NEXT clock edge updates that state. Even if the input that will eventually cause the change is already sitting stable on the input pin, Y stays frozen at its old value for the rest of the current cycle - it simply has no wire to look at that would tell it otherwise.",
        "Feed the exact same bit stream into both machines and read the computed timing diagram below: every Mealy Y sample lines up with the very cycle that produced it, while every Moore Y sample trails one full clock cycle behind the Moore state that produced it - the diagram is generated straight from the same automaton you have been driving all module, so the lag is not an illustration, it is the literal output of the code.",
        "That lag buys Moore a safety property: because Y only samples the state right after a clean clock edge, a momentary junk value on X - a glitch while a long combinational path upstream is still settling, or contact bounce on a real button - never touches Y at all. By the time the next edge arrives, X has settled to its real value, and Moore's output logic never had a chance to see the bad intermediate value in the first place. Moore is immune, shielded.",
        "The same lag costs Mealy that safety: because Y is a direct combinational function of X, any spurious bounce on X - 0 to 1 to 0 within a few nanoseconds - propagates straight through the output gates and appears on Y for exactly as long as the bounce lasts. Downstream logic sampling Y at the wrong instant can latch that spurious pulse as if it were a real, intended result. Mealy is highly vulnerable.",
        "Try it directly in the glitch check below: toggle the input rapidly with no clock press at all, and watch the Mealy output chatter along with every toggle while the Moore output sits perfectly still, refusing to move until you actually press the clock."
      ],
      theoryHI: [
        "चूँकि Mealy की output logic raw input सीधे पढ़ती है, Y, X के बदलते ही बदल सकता है - mid-cycle, किसी भी clock edge से बहुत पहले - क्योंकि यह X से Y तक एक शुद्ध combinational path है, बीच में शून्य register delay।",
        "Moore की output logic सिर्फ़ registered state पढ़ती है, तो Y तब तक नहीं हिल सकता जब तक अगला clock edge वह state update न करे। चाहे जो input आख़िर में बदलाव कराने वाला है वह अभी input pin पर स्थिर बैठा हो, Y बाक़ी current cycle के लिए अपने पुराने मान पर जमा रहता है - इसके पास बस देखने को कोई ऐसी wire ही नहीं है जो कुछ और बताए।",
        "बिल्कुल वही bit stream दोनों machines में feed कीजिए और नीचे computed timing diagram पढ़िए: हर Mealy Y sample ठीक उसी cycle से मेल खाता है जिसने उसे बनाया, जबकि हर Moore Y sample उस Moore state से पूरा एक clock cycle पीछे चलता है जिसने उसे बनाया - diagram उसी automaton से सीधे बनता है जिसे आप पूरे module में चला रहे हैं, तो यह देरी कोई चित्रण नहीं, code का शाब्दिक output है।",
        "वह देरी Moore को एक सुरक्षा गुण देती है: चूँकि Y state को सिर्फ़ एक साफ़ clock edge के ठीक बाद sample करता है, X पर एक क्षणिक junk मान - ऊपर कहीं लंबे combinational path के settle होते समय एक glitch, या असली button पर contact bounce - Y को कभी छूता ही नहीं। अगले edge तक X अपने असली मान पर settle हो चुका होता है, और Moore की output logic को कभी वह ख़राब intermediate मान देखने का मौक़ा ही नहीं मिलता। Moore immune है, shielded है।",
        "वही देरी Mealy से वह सुरक्षा छीन लेती है: चूँकि Y, X का सीधा combinational function है, X पर कोई भी fake bounce - कुछ nanoseconds में 0 से 1 से 0 - सीधे output gates से गुज़र जाता है और Y पर ठीक उतनी ही देर दिखता है जितनी देर bounce चला। ग़लत पल पर Y को sample करती downstream logic उस fake pulse को असली, इरादतन नतीजे की तरह latch कर सकती है। Mealy highly vulnerable है।",
        "इसे नीचे glitch check में सीधे आज़माइए: बिना किसी clock press के input को तेज़ी से toggle कीजिए, और देखिए Mealy output हर toggle के साथ chatter करता है जबकि Moore output बिल्कुल स्थिर बैठा रहता है, तब तक हिलने से इनकार करते हुए जब तक आप असल में clock न दबाएँ।"
      ],
      transcriptEN: "Because Mealy's output logic reads the raw input directly, Y can change mid-cycle, before any clock edge - a purely combinational path. Moore's output reads only the registered state, so Y cannot move until the next clock edge. Feed the same stream into both and the timing diagram shows every Mealy Y aligned with its own cycle while every Moore Y trails one cycle behind. That lag buys Moore immunity to input glitches, since Y only samples state right after a clean edge; the same lag costs Mealy that immunity, since any bounce on X propagates straight to Y. Try the glitch check: toggle the input with no clock press, and Mealy chatters while Moore sits still.",
      transcriptHI: "चूँकि Mealy की output logic raw input सीधे पढ़ती है, Y mid-cycle बदल सकता है, किसी clock edge से पहले - एक शुद्ध combinational path। Moore का output सिर्फ़ registered state पढ़ता है, तो Y अगले clock edge तक नहीं हिल सकता। दोनों में वही stream feed कीजिए और timing diagram दिखाता है हर Mealy Y अपने cycle से मेल खाता है जबकि हर Moore Y एक cycle पीछे चलता है। वह देरी Moore को input glitches से immunity देती है, क्योंकि Y state को साफ़ edge के ठीक बाद sample करता है; वही देरी Mealy से वह immunity छीनती है, क्योंकि X पर कोई bounce सीधे Y तक पहुँचता है। glitch check आज़माइए: बिना clock press input toggle कीजिए, Mealy chatter करता है जबकि Moore स्थिर बैठा रहता है।",
      visualNote: "A computed TimingDiagram (CLK, X, Mealy Y, Moore Y) driven from the same automaton, plus a small live glitch-check widget (toggle X with no clock press)."
    },
    {
      id: "S04_SequenceDetector",
      label: "Worked Example, The 1011 Detector",
      kind: "theory",
      subtitle: "The same pattern, built as a 4-state Mealy machine and a 5-state Moore machine.",
      theoryEN: [
        "Specification: build a detector for the bit pattern 1011 arriving one bit per clock over a serial line, with overlap allowed - meaning the trailing bits of one completed match are permitted to double as the opening bits of the next match, rather than forcing a full reset back to the very beginning.",
        "Name the states by how much of the pattern has been matched so far: a = nothing matched yet, b = 1 matched, c = 10 matched, d = 101 matched. The Mealy machine stops right there, at four states, because its output = 1 is placed directly ON the arc leaving d the instant the fourth bit (a 1) arrives and completes the pattern - there is no need for a fifth state, the arc itself carries the announcement.",
        "The Moore machine cannot do that trick, because a Moore output must live inside a state, never on an arc - so it needs a fifth, dedicated state e (1011 fully matched) whose entire job is to exist for exactly one clock cycle and output a 1 while the machine sits in it, before moving on. Same detection logic, one whole extra state purely to give the output somewhere to be written.",
        "The overlap mechanic falls straight out of the pattern's own shape: 1011 ends in a 1, and 1011 also starts with a 1, so the very last bit that completes a match has already, by itself, started a fresh candidate match. Both machines therefore fall back to state b (one bit already matched) immediately after a match, not all the way back to a - which is exactly why the interactive below can find three matches inside a twelve-bit stream where a no-overlap detector would only ever find two.",
        "Step through the stream in the lab below: click any bit to feed the machine through every bit up to and including it, watch both live diagrams' active state move together (they are built from the identical underlying transition table), and read the live outputs - the two machines must always agree on WHERE inside the stream a match occurred, even though, as you saw in the previous scene, they announce it at different moments relative to the clock.",
        "The state-count difference has a direct hardware cost you already know how to compute: Mealy's 4 states need ceil(log2 4) = 2 flip-flops; Moore's 5 states need ceil(log2 5) = 3 flip-flops - one entire extra flip-flop, purely to hold a state whose only purpose is housing the output bit that Mealy got for free on an arc."
      ],
      theoryHI: [
        "Specification: bit pattern 1011 का एक detector बनाइए जो serial line पर हर clock एक bit आता है, overlap allowed के साथ - यानी एक पूरे हो चुके match के trailing bits अगले match के opening bits की तरह दोबारा वापर सकते हैं, बजाय इसके कि पूरी तरह शुरुआत तक reset किया जाए।",
        "States को इस आधार पर नाम दीजिए कि अब तक pattern का कितना हिस्सा match हुआ है: a = अभी कुछ भी match नहीं, b = 1 match हुआ, c = 10 match हुआ, d = 101 match हुआ। Mealy machine वहीं, चार states पर रुक जाती है, क्योंकि इसका output = 1 सीधे d से निकलते arc पर रखा जाता है, ठीक उस पल जब चौथा bit (एक 1) आता है और pattern पूरा करता है - पाँचवें state की ज़रूरत ही नहीं, arc ख़ुद घोषणा ले जाता है।",
        "Moore machine यह चाल नहीं चल सकती, क्योंकि Moore output को state के अंदर ही रहना होता है, arc पर कभी नहीं - तो इसे एक पाँचवाँ, समर्पित state e (1011 पूरा match) चाहिए जिसका पूरा काम बस ठीक एक clock cycle के लिए मौजूद रहना और उसमें बैठे रहते हुए 1 output देना है, फिर आगे बढ़ना। वही detection logic, बस एक पूरा अतिरिक्त state सिर्फ़ output को कहीं लिखने की जगह देने के लिए।",
        "overlap की mechanic सीधे pattern के अपने आकार से निकलती है: 1011 एक 1 पर ख़त्म होता है, और 1011 एक 1 से शुरू भी होता है, तो जो आख़िरी bit match पूरा करता है वह अपने आप में पहले ही एक नया संभावित match शुरू कर चुका होता है। इसलिए match के तुरंत बाद दोनों machines state b (एक bit पहले से matched) पर वापस गिरती हैं, पूरी तरह a तक नहीं - इसीलिए नीचे का interactive बारह-bit stream में तीन matches पा सकता है जहाँ एक no-overlap detector सिर्फ़ दो ही पाता।",
        "नीचे lab में stream से क़दम-दर-क़दम गुज़रिए: किसी bit पर click कीजिए और machine उस तक (उसे शामिल करते हुए) हर bit से feed होगी, देखिए दोनों live diagrams का active state साथ-साथ चलता है (दोनों एक ही underlying transition table से बने हैं), और live outputs पढ़िए - दोनों machines को हमेशा इस पर सहमत होना चाहिए कि stream के अंदर कहाँ match हुआ, भले ही, जैसा आपने पिछले scene में देखा, वे इसे clock के सापेक्ष अलग-अलग पलों पर घोषित करती हैं।",
        "state-count के अंतर की सीधी hardware क़ीमत है जो आप पहले से compute करना जानते हैं: Mealy के 4 states को ceil(log2 4) = 2 flip-flops चाहिए; Moore के 5 states को ceil(log2 5) = 3 flip-flops चाहिए - एक पूरा अतिरिक्त flip-flop, सिर्फ़ एक ऐसा state रखने के लिए जिसका इकलौता काम वह output bit रखना है जो Mealy को एक arc पर मुफ़्त में मिल गया।"
      ],
      transcriptEN: "Build a detector for 1011, arriving one bit per clock, with overlap allowed. Name states by progress: a nothing, b one, c ten, d one-oh-one matched. Mealy stops at four states because its output rides the arc leaving d the instant the fourth bit completes the pattern. Moore needs a fifth dedicated state e, since a Moore output must live inside a state, never on an arc - one whole extra state just to host the output bit. Overlap falls out of the pattern's own shape: 1011 starts and ends in 1, so both machines fall back to state b, not all the way to a, right after a match. Step through the stream below - click any bit to feed through it - and watch both diagrams agree on where matches occur, even as they announce it at different moments. The state-count gap costs a real flip-flop: two for Mealy, three for Moore.",
      transcriptHI: "1011 का detector बनाइए, हर clock एक bit आता है, overlap allowed के साथ। States को progress से नाम दीजिए: a कुछ नहीं, b एक, c दस, d one-oh-one matched। Mealy चार states पर रुकती है क्योंकि इसका output d से निकलते arc पर सवार है, ठीक जब चौथा bit pattern पूरा करता है। Moore को पाँचवाँ समर्पित state e चाहिए, क्योंकि Moore output को state के अंदर रहना होता है, arc पर कभी नहीं - बस output bit रखने को एक पूरा अतिरिक्त state। Overlap pattern के अपने आकार से निकलता है: 1011 एक 1 से शुरू और ख़त्म होता है, तो match के ठीक बाद दोनों machines state b पर गिरती हैं, पूरा a तक नहीं। नीचे stream से क़दम-दर-क़दम गुज़रिए - किसी bit पर click कीजिए - और देखिए दोनों diagrams इस पर सहमत हैं कि matches कहाँ हुए, भले ही वे इसे अलग पलों पर घोषित करें। state-count का अंतर एक असली flip-flop की क़ीमत लेता है: Mealy को दो, Moore को तीन।",
      visualNote: "Live lab: a clickable 12-bit stream, two StateDiagrams (Mealy 4-state, Moore 5-state) whose active node and live Y are both derived by walking the same automaton in code, plus two computed transition StateTables."
    },
    {
      id: "S05_Encoding",
      label: "Naming The States, Binary vs Gray vs One-Hot",
      kind: "theory",
      subtitle: "The states don't change - only which bit pattern is chosen to name each one.",
      theoryEN: [
        "Once you know how many states a machine needs, you still have to choose a concrete bit pattern to load into the flip-flops for each one - that choice is called state encoding (or state assignment), and it changes only the wires of the next-state and output logic, never the machine's actual behaviour.",
        "Binary, highly-encoded mapping: number the states sequentially, 0, 1, 2, and so on. This needs the fewest possible flip-flops, exactly ceil(log2 N), but successive states in the sequence can differ in several bits at once, and the decoding logic that answers am I in state 2 tends to grow large and slow, because every state's condition mixes several AND-ed literals together.",
        "Gray code encoding: choose the codes so that any two states adjacent in the counting order differ in exactly one bit. It still needs the same ceil(log2 N) flip-flops as binary, but it halves the risk of a decoding hazard whenever several bits would otherwise have to flip at once and might, for a few nanoseconds, pass through a wrong intermediate code before settling.",
        "One-hot encoding: give every single state its own private flip-flop - N states, N flip-flops, exactly one bit high at any instant. It costs far more registers than the other two schemes, but the next-state and output logic collapses to almost nothing, because being in state k literally IS bit k being 1 - no decoding step required at all. That trade is exactly why one-hot dominates FPGA and CPLD designs, where flip-flops are cheap and plentiful but combinational gate delay is the precious resource.",
        "Apply all three straight to this module's detector in the computed table below: Mealy's 4 states need 2 bits of binary or Gray, or 4 one-hot bits; Moore's 5 states need 3 bits of binary or Gray (with 3 codes left over, unused), or 5 one-hot bits - the same states, three completely different wirings.",
        "Watch the short video alongside this table for a walked-through worked example of choosing between the three."
      ],
      theoryHI: [
        "एक बार जान लें कि machine को कितने states चाहिए, फिर भी आपको हर एक के लिए flip-flops में load करने को एक ठोस bit pattern चुनना पड़ता है - यही चुनाव state encoding (या state assignment) कहलाता है, और यह सिर्फ़ next-state और output logic की wires बदलता है, machine का असली बर्ताव कभी नहीं।",
        "Binary, highly-encoded mapping: states को क्रम से गिनिए, 0, 1, 2, वग़ैरह। इसे सबसे कम मुमकिन flip-flops चाहिए, ठीक ceil(log2 N), पर क्रम में लगातार states एक साथ कई bits में अलग हो सकते हैं, और am I in state 2 का जवाब देती decoding logic अक्सर बड़ी और धीमी हो जाती है, क्योंकि हर state की शर्त कई literals को AND करके मिलती है।",
        "Gray code encoding: codes ऐसे चुनिए कि counting order में सटे किन्हीं भी दो states ठीक एक bit में अलग हों। इसे binary जितने ही ceil(log2 N) flip-flops चाहिए, पर decoding hazard का जोखिम आधा कर देता है जब कई bits एक साथ flip होते और शायद कुछ nanoseconds के लिए settle होने से पहले किसी ग़लत intermediate code से गुज़र जाते।",
        "One-hot encoding: हर अकेले state को उसका अपना निजी flip-flop दीजिए - N states, N flip-flops, किसी भी पल ठीक एक bit high। इसे बाक़ी दो schemes से कहीं ज़्यादा registers चाहिए, पर next-state और output logic लगभग कुछ नहीं में सिमट जाती है, क्योंकि state k में होना शाब्दिक रूप से bit k का 1 होना ही है - कोई decoding step चाहिए ही नहीं। यही trade है जो one-hot को FPGA और CPLD designs में हावी बनाता है, जहाँ flip-flops सस्ते और भरपूर हैं पर combinational gate delay कीमती resource है।",
        "नीचे computed table में तीनों को सीधे इस module के detector पर लगाइए: Mealy के 4 states को 2 bits binary या Gray चाहिए, या 4 one-hot bits; Moore के 5 states को 3 bits binary या Gray चाहिए (3 codes बचे, बिना वापरे), या 5 one-hot bits - वही states, तीन बिल्कुल अलग wirings।",
        "इस table के साथ छोटी वीडियो देखिए, जिसमें तीनों में चुनाव का एक worked उदाहरण चलाया गया है।"
      ],
      transcriptEN: "Once you know how many states a machine needs, you still choose a concrete bit pattern for each - state encoding, which changes only wiring, never behaviour. Binary numbers states sequentially, needing the fewest flip-flops, ceil log-base-two N, but decoding logic can grow large. Gray code keeps adjacent states one bit apart, same flip-flop count as binary, half the decoding hazard. One-hot gives every state its own flip-flop, N states N flip-flops, one bit high at a time, collapsing decoding logic to almost nothing - the dominant choice on FPGAs where registers are cheap. Apply all three to this module's detector: Mealy's four states need two bits binary or Gray, or four one-hot bits; Moore's five states need three bits binary or Gray, or five one-hot bits.",
      transcriptHI: "एक बार जान लें machine को कितने states चाहिए, फिर भी हर एक के लिए ठोस bit pattern चुनना पड़ता है - state encoding, जो सिर्फ़ wiring बदलती है, बर्ताव कभी नहीं। Binary states को क्रम से गिनती है, सबसे कम flip-flops चाहिए, ceil log-base-two N, पर decoding logic बड़ी हो सकती है। Gray code सटे states को एक bit दूर रखती है, binary जितने ही flip-flops, आधा decoding hazard। One-hot हर state को उसका अपना flip-flop देती है, N states N flip-flops, किसी पल एक bit high, decoding logic को लगभग कुछ नहीं में समेट देती - FPGAs पर हावी चुनाव जहाँ registers सस्ते हैं। तीनों को इस module के detector पर लगाइए: Mealy के चार states को दो bits binary या Gray, या चार one-hot bits; Moore के पाँच states को तीन bits binary या Gray, या पाँच one-hot bits चाहिए।",
      visualNote: "A computed StateTable (state / binary / gray / one-hot) toggled between the Mealy-4 and Moore-5 state sets, plus an embedded second video player on encoding."
    },
    {
      id: "S06_Analogy",
      label: "Two Vending Machines",
      kind: "theory",
      subtitle: "One dispenses the instant the right coin lands; the other waits for its display to catch up.",
      theoryEN: [
        "Picture two vending machines that both need two coins before they dispense a snack, and both remember how many coins they have collected so far - that memory is their internal state, exactly like a flip-flop bank.",
        "The Mealy machine has its coin sensor wired straight to the dispense motor: the instant a second coin lands on top of an already-remembered first coin, the motor fires immediately, in the very same moment the coin is still falling, combining coin already banked (the state) with coin arriving right now (the input) to make the decision on the spot.",
        "The Moore machine's dispense motor is wired only to its internal coin-counter display, never to the coin slot directly. When the second coin lands, the counter itself does tick up right then, but the dispense-motor logic only ever looks at the display's number - and in this simplified machine that display is only re-read on the NEXT button press. So you press once to register the coin, and you only find out it is dispensing when you press again.",
        "Neither machine is wrong - they are both counting the exact same coins and reach the exact same conclusion eventually - but the Mealy machine reacts inside the very transaction that completes it, while the Moore machine reports back one interaction later, matching precisely the flip-flop-registered output you already measured on the timing diagram a few scenes ago.",
        "Try both below: toggle whether you are inserting a coin right now, and watch the Mealy dispense light react before you even press confirm; then press confirm and watch the Moore light lag by exactly one press behind it."
      ],
      theoryHI: [
        "दो vending machines सोचिए जिन दोनों को snack देने से पहले दो coins चाहिए, और दोनों याद रखती हैं अब तक कितने coins जमा हुए - वह memory ही उनका internal state है, बिल्कुल flip-flop bank जैसा।",
        "Mealy machine का coin sensor सीधे dispense motor से wired है: जैसे ही पहले से याद रखे एक coin के ऊपर दूसरा coin गिरता है, motor तुरंत चल पड़ता है, ठीक उसी पल जब coin अभी गिर ही रहा है, coin पहले से जमा (state) को coin अभी आ रहा (input) से जोड़कर मौक़े पर फ़ैसला लेते हुए।",
        "Moore machine का dispense motor सिर्फ़ उसके internal coin-counter display से wired है, coin slot से सीधे कभी नहीं। जब दूसरा coin गिरता है, counter उसी पल बढ़ जाता है, पर dispense-motor logic हमेशा सिर्फ़ display का नंबर देखती है - और इस simplified machine में वह display अगले button press पर ही दोबारा पढ़ी जाती है। तो आप एक बार दबाकर coin दर्ज कराते हैं, और तभी पता चलता है कि dispense हो रहा है जब आप फिर से दबाते हैं।",
        "कोई भी machine ग़लत नहीं है - दोनों बिल्कुल वही coins गिनती हैं और आख़िर में वही नतीजा पाती हैं - पर Mealy machine उसी transaction के अंदर react करती है जो उसे पूरा करता है, जबकि Moore machine एक interaction देर से report करती है, ठीक उसी flip-flop-registered output से मेल खाते हुए जो आपने कुछ scenes पहले timing diagram पर नापा था।",
        "दोनों नीचे आज़माइए: toggle कीजिए कि आप अभी coin डाल रहे हैं या नहीं, और देखिए Mealy का dispense light confirm दबाने से पहले ही react करता है; फिर confirm दबाइए और देखिए Moore का light ठीक एक press पीछे उसका पीछा करता है।"
      ],
      transcriptEN: "Two vending machines, both needing two coins to dispense, both remembering coins collected so far as their internal state. Mealy's coin sensor wires straight to the dispense motor - the instant the second coin lands on an already-banked first coin, the motor fires immediately, combining state and input on the spot. Moore's dispense motor wires only to its coin-counter display, never the slot directly; the counter ticks up the moment the coin lands, but the dispense logic only rereads the display on the next button press. Neither machine is wrong - they reach the same conclusion - but Mealy reacts inside the completing transaction while Moore reports one interaction later, matching the registered output you already measured.",
      transcriptHI: "दो vending machines, दोनों को dispense करने के लिए दो coins चाहिए, दोनों अब तक जमा coins को अपने internal state की तरह याद रखती हैं। Mealy का coin sensor सीधे dispense motor से wired है - जैसे ही दूसरा coin पहले से जमा coin पर गिरता है, motor तुरंत चलता है, state और input को मौक़े पर जोड़ते हुए। Moore का dispense motor सिर्फ़ उसके coin-counter display से wired है, slot से सीधे कभी नहीं; counter coin गिरते ही बढ़ता है, पर dispense logic अगले button press पर ही display दोबारा पढ़ती है। कोई machine ग़लत नहीं - दोनों वही नतीजा पाती हैं - पर Mealy पूरा करने वाले transaction के अंदर react करती है जबकि Moore एक interaction देर से report करती है।",
      visualNote: "Two side-by-side vending-machine cards sharing one coin-insert toggle plus a shared confirm button; the Mealy dispense light is computed live from state+input, the Moore light only from the registered state."
    },
    {
      id: "S07_Build",
      label: "Build A Sequence Detector For Real",
      kind: "theory",
      subtitle: "Wire the 4-state Mealy 1011 detector from real flip-flops and gates on the live workbench.",
      theoryEN: [
        "Recap the 4-state Mealy machine you just proved on paper: two flip-flops hold the state code for a/b/c/d, next-state logic reads those two state bits plus the input X to pick the next code, and the output logic reads the SAME state bits plus X directly - exactly the extra wire you traced in the block diagram back in the Facts scene.",
        "On the workbench you will wire that next-state logic straight from the transition table, wire the one-bit output equation straight off the row for state d, and prove, bit by bit, that toggling in your own 1011 sequence lights the output pulse at exactly the instant the pattern completes - never a cycle early, never a cycle late.",
        "Open the guided build below when you are ready; it walks the same circuit you just designed on paper into real gates and flip-flops you can clock by hand."
      ],
      theoryHI: [
        "उस 4-state Mealy machine को दोहराइए जिसे आपने अभी काग़ज़ पर साबित किया: दो flip-flops a/b/c/d के लिए state code रखते हैं, next-state logic वे दो state bits जमा input X पढ़कर अगला code चुनती है, और output logic वही state bits जमा X सीधे पढ़ती है - ठीक वही अतिरिक्त wire जो आपने Facts scene में block diagram पर trace की थी।",
        "Workbench पर आप वह next-state logic सीधे transition table से wire करेंगे, one-bit output equation सीधे state d की row से wire करेंगे, और bit-दर-bit साबित करेंगे कि अपनी 1011 sequence toggle करना output pulse को ठीक उसी पल जलाता है जब pattern पूरा होता है - कभी एक cycle जल्दी नहीं, कभी एक cycle देर से नहीं।",
        "तैयार होने पर नीचे guided build खोलिए; यह उसी circuit को जो आपने अभी काग़ज़ पर design किया, असली gates और flip-flops में ले जाता है जिन्हें आप हाथ से clock कर सकते हैं।"
      ],
      transcriptEN: "Recap the four-state Mealy machine: two flip-flops hold the state, next-state logic reads the state bits plus X, and the output logic reads the same state bits plus X directly. On the workbench, wire that next-state logic from the transition table, wire the output equation off the row for state d, and prove that toggling in your own 1011 sequence lights the pulse at exactly the right instant.",
      transcriptHI: "चार-state Mealy machine दोहराइए: दो flip-flops state रखते हैं, next-state logic state bits जमा X पढ़ती है, और output logic वही state bits जमा X सीधे पढ़ती है। Workbench पर वह next-state logic transition table से wire कीजिए, output equation state d की row से wire कीजिए, और साबित कीजिए कि अपनी 1011 sequence toggle करना pulse को ठीक सही पल जलाता है।",
      visualNote: "WorkbenchCTA panel linking to the guided sequence-detector build."
    },
    {
      id: "S08_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Flip each card - the term, then the real logic underneath it.",
      theoryEN: [],
      theoryHI: [],
      transcriptEN: "Flip through the flashcards to drill the Mealy/Moore vocabulary and facts.",
      transcriptHI: "Mealy/Moore की vocabulary और facts पक्की करने को flashcards पलटिए।",
      visualNote: "SubFlashCards deck."
    },
    {
      id: "S09_Quiz",
      label: "Practice · Mealy & Moore",
      kind: "quiz",
      subtitle: "Seven questions - definitions, timing, glitches, state counts and encoding.",
      theoryEN: [],
      theoryHI: [],
      transcriptEN: "Work through the practice quiz on Mealy and Moore machines.",
      transcriptHI: "Mealy और Moore machines पर practice quiz हल कीजिए।",
      visualNote: "QuizArena wrapper."
    },
    {
      id: "S10_Recap",
      label: "One Circuit, Two Output Philosophies",
      kind: "recap",
      subtitle: "State register and next-state logic never change - only where the output logic listens.",
      theoryEN: [
        "You now know the whole story in one wiring fact: a Moore machine's output logic listens ONLY to the state register, Y = lambda(S), so it is registered, safe, and exactly one clock cycle behind whatever input caused the change. A Mealy machine's output logic ALSO listens to the raw input directly, Y = lambda(S, X), so it is combinational, immediate, and exposed to whatever glitches ride in on that input.",
        "You proved both sides of the 1011 sequence detector - Mealy stopping at four states because its output rides an existing arc, Moore needing a fifth dedicated state because its output must live inside a node - and you watched them agree on every match while disagreeing on exactly when to announce it.",
        "You applied all three state-encoding schemes to those very states: binary and Gray both need the minimum ceil(log2 N) flip-flops (Gray trading nothing for a one-bit-at-a-time toggle that halves decoding hazards), while one-hot spends N flip-flops to erase almost all of the decoding logic - a trade that only makes sense when flip-flops are the cheap resource.",
        "And you carried the same fact into a vending machine you could feel in your hands: a Mealy dispenser that fires the instant the right coin lands, and a Moore dispenser whose display only catches up on the next press - two philosophies of output, one shared underlying machine.",
        "Carry the comparison table forward as your working memory of this module: output dependence, output timing, typical state count, hardware complexity, glitch susceptibility - Moore safe and heavier on every row, Mealy fast and lighter on every row, and now you can build either one from a blank state diagram."
      ],
      theoryHI: [
        "अब आप पूरी कहानी एक wiring तथ्य में जानते हैं: Moore machine की output logic सिर्फ़ state register सुनती है, Y = lambda(S), तो यह registered, सुरक्षित, और बदलाव कराने वाले input से ठीक एक clock cycle पीछे है। Mealy machine की output logic raw input भी सीधे सुनती है, Y = lambda(S, X), तो यह combinational, तुरंत, और उस input पर सवार किसी भी glitch के लिए उजागर है।",
        "आपने 1011 sequence detector के दोनों पहलू साबित किए - Mealy चार states पर रुकी क्योंकि इसका output पहले से मौजूद arc पर सवार है, Moore को पाँचवाँ समर्पित state चाहिए क्योंकि इसका output किसी node के अंदर रहना चाहिए - और आपने देखा वे हर match पर सहमत हैं जबकि इसे कब घोषित करना है इस पर असहमत हैं।",
        "आपने तीनों state-encoding schemes उन्हीं states पर लगाईं: binary और Gray दोनों को न्यूनतम ceil(log2 N) flip-flops चाहिए (Gray कुछ नहीं गँवाकर एक-bit-एक-समय toggle देती है जो decoding hazards आधे कर देती है), जबकि one-hot N flip-flops ख़र्च करके लगभग सारी decoding logic मिटा देती है - एक trade जो तभी समझ आता है जब flip-flops सस्ता resource हों।",
        "और आपने वही तथ्य एक vending machine तक ले गए जिसे आप हाथों में महसूस कर सकते थे: एक Mealy dispenser जो सही coin गिरते ही चलता है, और एक Moore dispenser जिसका display अगले press पर ही पकड़ता है - output की दो philosophies, एक साझा underlying machine।",
        "इस module की working memory की तरह comparison table आगे ले जाइए: output dependence, output timing, typical state count, hardware complexity, glitch susceptibility - हर row में Moore सुरक्षित और भारी, हर row में Mealy तेज़ और हल्की, और अब आप किसी भी खाली state diagram से दोनों में से कोई भी बना सकते हैं।"
      ],
      transcriptEN: "One wiring fact tells the whole story: Moore's output logic listens only to the state register, registered and safe, one cycle behind. Mealy's output logic also listens to the raw input, combinational and immediate, exposed to glitches. You proved both sides of the 1011 detector, applied all three encodings, and felt the same fact in a vending machine. Carry the comparison table forward - Moore safe and heavier, Mealy fast and lighter - and now you can build either from a blank state diagram.",
      transcriptHI: "एक wiring तथ्य पूरी कहानी बताता है: Moore की output logic सिर्फ़ state register सुनती है, registered और सुरक्षित, एक cycle पीछे। Mealy की output logic raw input भी सुनती है, combinational और तुरंत, glitches के लिए उजागर। आपने 1011 detector के दोनों पहलू साबित किए, तीनों encodings लगाईं, और वही तथ्य एक vending machine में महसूस किया। comparison table आगे ले जाइए - Moore सुरक्षित और भारी, Mealy तेज़ और हल्की - और अब आप किसी भी खाली state diagram से दोनों बना सकते हैं।",
      visualNote: "Standard recap flow rail plus prose summary."
    }
  ],
  flashcards: [
    {
      frontEN: "Moore machine - output equation",
      backEN: "Y = lambda(S). The output is a function of the current state ONLY, conceptually written inside the state node. Because Q only changes at a clock edge, Y is registered - it cannot move until the next edge.",
      frontHI: "Moore machine - output equation",
      backHI: "Y = lambda(S)। Output सिर्फ़ current state का function है, state node के अंदर लिखा माना जाता है। चूँकि Q सिर्फ़ clock edge पर बदलता है, Y registered है - अगला edge आने तक नहीं हिल सकता।"
    },
    {
      frontEN: "Mealy machine - output equation",
      backEN: "Y = lambda(S, X). The output is a function of the current state AND the current input, written on the transition arc. The output logic reads X directly, so Y can change mid-cycle, before any clock edge.",
      frontHI: "Mealy machine - output equation",
      backHI: "Y = lambda(S, X)। Output current state AND current input दोनों का function है, transition arc पर लिखा। Output logic X सीधे पढ़ती है, तो Y mid-cycle बदल सकता है, किसी clock edge से पहले।"
    },
    {
      frontEN: "Why is Moore's output called safe / immune?",
      backEN: "Its output logic never reads a primary input directly - only the registered state - so a momentary glitch on X between clock edges never has a wire to travel down to reach Y.",
      frontHI: "Moore के output को safe / immune क्यों कहते हैं?",
      backHI: "इसकी output logic कभी primary input सीधे नहीं पढ़ती - सिर्फ़ registered state - तो clock edges के बीच X पर क्षणिक glitch को Y तक पहुँचने की कोई wire ही नहीं मिलती।"
    },
    {
      frontEN: "Why is Mealy's output called vulnerable?",
      backEN: "Its output logic reads the raw input X directly through a combinational path with no register in between, so any spurious bounce on X propagates straight through to Y for as long as the bounce lasts.",
      frontHI: "Mealy के output को vulnerable क्यों कहते हैं?",
      backHI: "इसकी output logic raw input X सीधे एक combinational path से पढ़ती है, बीच में कोई register नहीं, तो X पर कोई भी fake bounce सीधे Y तक पहुँच जाता है, जितनी देर bounce चले उतनी देर।"
    },
    {
      frontEN: "Required flip-flops for N states (binary or Gray encoding)",
      backEN: "ceil(log2 N) - the minimum possible, since each flip-flop doubles the number of codes available.",
      frontHI: "N states के लिए ज़रूरी flip-flops (binary या Gray encoding)",
      backHI: "ceil(log2 N) - न्यूनतम मुमकिन, क्योंकि हर flip-flop उपलब्ध codes की संख्या दोगुनी कर देता है।"
    },
    {
      frontEN: "One-hot encoding",
      backEN: "N states get N flip-flops, exactly one bit high at any instant. Costs the most registers of the three schemes, but next-state/output decoding logic nearly vanishes - the FPGA/CPLD favourite where registers are cheap.",
      frontHI: "One-hot encoding",
      backHI: "N states को N flip-flops मिलते हैं, किसी भी पल ठीक एक bit high। तीनों में सबसे ज़्यादा registers लेता है, पर next-state/output decoding logic लगभग ग़ायब हो जाती है - FPGA/CPLD का पसंदीदा जहाँ registers सस्ते हैं।"
    },
    {
      frontEN: "1011 detector - state counts",
      backEN: "Mealy needs 4 states (a,b,c,d) and 2 flip-flops, since the match output rides the arc leaving d. Moore needs 5 states (a,b,c,d,e) and 3 flip-flops, since a dedicated state e is needed to hold the output.",
      frontHI: "1011 detector - state counts",
      backHI: "Mealy को 4 states (a,b,c,d) और 2 flip-flops चाहिए, क्योंकि match output d से निकलते arc पर सवार है। Moore को 5 states (a,b,c,d,e) और 3 flip-flops चाहिए, क्योंकि output रखने को एक समर्पित state e चाहिए।"
    },
    {
      frontEN: "Gray code encoding - the one fact to remember",
      backEN: "Any two states adjacent in the counting order differ in exactly one bit. Same flip-flop count as binary (ceil(log2 N)), but halves the risk of a decoding glitch when several bits would otherwise flip together.",
      frontHI: "Gray code encoding - याद रखने वाला एक तथ्य",
      backHI: "counting order में सटे किन्हीं भी दो states ठीक एक bit में अलग होते हैं। Binary जितने ही flip-flops (ceil(log2 N)), पर decoding glitch का जोखिम आधा कर देता है जब कई bits अन्यथा एक साथ flip होते।"
    }
  ],
  quiz: [
    {
      questionEN: "Which equation correctly describes a Moore machine's output?",
      questionHI: "कौन सा equation Moore machine के output को सही बताता है?",
      options: ["Y = lambda(S)", "Y = lambda(S, X)", "Y = lambda(X)", "Y = S XOR X"],
      answerIndex: 0,
      explainEN: "Moore ties the output to the current state only - the output logic has no wire coming from a primary input.",
      explainHI: "Moore output को सिर्फ़ current state से बाँधती है - output logic में किसी primary input से आती wire नहीं होती।"
    },
    {
      questionEN: "Which equation correctly describes a Mealy machine's output?",
      questionHI: "कौन सा equation Mealy machine के output को सही बताता है?",
      options: ["Y = lambda(S)", "Y = lambda(S, X)", "Y = lambda(X) only, ignoring state", "Y = 1 always, once matched"],
      answerIndex: 1,
      explainEN: "Mealy's output logic reads the state AND the current input together - that second wire is the entire structural difference from Moore.",
      explainHI: "Mealy की output logic state AND current input दोनों साथ पढ़ती है - वही दूसरी wire Moore से पूरा structural अंतर है।"
    },
    {
      questionEN: "Which machine's output can change mid-clock-cycle, in direct reaction to the input, before any clock edge?",
      questionHI: "किस machine का output clock edge से पहले, input की सीधी प्रतिक्रिया में, mid-cycle बदल सकता है?",
      options: ["Moore", "Mealy", "Neither - both wait for the clock", "Both, equally"],
      answerIndex: 1,
      explainEN: "Mealy's output logic has a direct combinational path from the input, with no register delay - it can react instantly.",
      explainHI: "Mealy की output logic में input से एक सीधी combinational path है, कोई register delay नहीं - यह तुरंत react कर सकती है।"
    },
    {
      questionEN: "Which machine's output is immune to a momentary glitch on the input line between clock edges?",
      questionHI: "किस machine का output clock edges के बीच input line पर क्षणिक glitch से immune है?",
      options: ["Mealy - it reacts fast enough to absorb any glitch", "Moore - its output logic never reads a primary input directly", "Neither is immune", "Both are equally immune"],
      answerIndex: 1,
      explainEN: "Moore's output logic only ever reads the registered state, so a glitch on X that never survives to a clock edge simply never reaches Y.",
      explainHI: "Moore की output logic हमेशा सिर्फ़ registered state पढ़ती है, तो X पर एक glitch जो किसी clock edge तक नहीं टिकता वह Y तक कभी पहुँचता ही नहीं।"
    },
    {
      questionEN: "For the same 1011 detection task, why does the Mealy machine typically need fewer states than the Moore machine?",
      questionHI: "एक ही 1011 detection काम के लिए, Mealy machine को Moore से अक्सर कम states क्यों चाहिए होते हैं?",
      options: ["Mealy uses a faster clock", "Mealy's output can ride an existing transition arc, so it never needs a dedicated \"just matched\" state", "Mealy ignores some input bits", "Moore machines are always built with more flip-flops by convention, unrelated to states"],
      answerIndex: 1,
      explainEN: "Because a Mealy output lives on an arc, the arc leaving the last matching state can carry the 1 output directly - Moore needs a whole extra state purely to host that same output value inside a node.",
      explainHI: "चूँकि Mealy output arc पर रहता है, आख़िरी matching state से निकलता arc सीधे 1 output ले जा सकता है - Moore को उसी output मान को node के अंदर रखने के लिए एक पूरा अतिरिक्त state चाहिए।"
    },
    {
      questionEN: "The Moore version of the 1011 detector has 5 states. With binary or Gray encoding, how many flip-flops does it need?",
      questionHI: "1011 detector के Moore version में 5 states हैं। Binary या Gray encoding के साथ इसे कितने flip-flops चाहिए?",
      options: ["2", "3", "4", "5"],
      answerIndex: 1,
      explainEN: "ceil(log2 5) = 3. Three flip-flops give 8 possible codes, enough to cover 5 states with 3 unused codes left over.",
      explainHI: "ceil(log2 5) = 3। तीन flip-flops 8 संभव codes देते हैं, 5 states को cover करने के लिए काफ़ी, 3 codes बिना वापरे बचते हैं।"
    },
    {
      questionEN: "Which state-encoding scheme uses exactly one flip-flop per state, with exactly one bit high at any instant?",
      questionHI: "कौन सी state-encoding scheme हर state के लिए ठीक एक flip-flop वापरती है, किसी भी पल ठीक एक bit high?",
      options: ["Binary / highly-encoded", "Gray code", "One-hot", "Two's complement"],
      answerIndex: 2,
      explainEN: "One-hot spends N flip-flops on N states, exactly one bit active at a time, in exchange for nearly eliminating the decoding logic.",
      explainHI: "One-hot N states पर N flip-flops ख़र्च करती है, किसी भी समय ठीक एक bit active, बदले में decoding logic लगभग मिटा देती है।"
    }
  ]
};
