import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/42 - Hazards & Races, "Correct Logic, Wrong Instant".
 * FINAL module of the Sequential Logic track (dsd 28-42). A hazard is a brief,
 * WRONG output produced by a circuit whose steady-state Boolean algebra is
 * completely correct - the culprit is never the logic, it is the unequal
 * propagation delay of two different paths carrying the same information to
 * one gate. Four named kinds: static-1 (SOP, output should hold 1, dips to 0),
 * static-0 (POS, dual), dynamic (>=3 levels, one edge becomes several toggles),
 * and essential (structural, async-feedback only, fixable ONLY by adding
 * physical delay - never by redundant logic). The consensus theorem
 * XY+X'Z+YZ=XY+X'Z is the one general cure behind the first three. Worked
 * examples throughout: Y=A'C+AB -> +BC (static-1) and its dual
 * Y=(A+B')(B+C) -> +(A+C) (static-0). Recap closes the whole track by tying
 * back to dsd/31 (timing, t_pd) and dsd/41 (races in async feedback).
 */
export const CONTENT: SubContent = {
  moduleTitle: "Hazards & Races - When Correct Logic Still Glitches",
  moduleSubtitle: "Real gates take real time. This module shows exactly how that single fact produces four distinct kinds of transient wrong output - and how to design them away.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The Glitch That Shouldn't Exist",
      kind: "cover",
      subtitle: "A signal that should hold steady at 1 dips to 0 for an instant - because two paths to the same gate don't arrive together.",
      theoryEN: [
        "A hazard is a brief, wrong output produced by a circuit whose steady-state Boolean logic is completely correct - the algebra never lied, only the timing did.",
        "The root cause is always the same: two different paths carry information to the same gate, and those paths take different amounts of time, because every real gate has a non-zero propagation delay.",
        "This module sorts hazards into four kinds you must be able to name on sight - static-1, static-0, dynamic, and essential - and hands you the one tool, the consensus theorem, that cures the first three.",
        "It closes the entire Sequential Logic track. Module 31 taught you that timing constraints keep a clocked circuit honest; module 41 taught you that races can corrupt an asynchronous circuit's state; this module shows the same unequal-delay disease living quietly inside ordinary combinational gates.",
        "Watch the scope above - it is not decoration. Every dip is computed live from two simulated gate paths of different length, exactly the mechanism you are about to take apart."
      ],
      theoryHI: [
        "Hazard एक संक्षिप्त, ग़लत output है जो एक ऐसे circuit से निकलता है जिसका steady-state Boolean logic पूरी तरह सही होता है - algebra ने कभी झूठ नहीं बोला, सिर्फ़ timing ने बोला।",
        "जड़ कारण हमेशा एक ही है: दो अलग paths एक ही gate तक जानकारी ले जाते हैं, और वे paths अलग-अलग समय लेते हैं, क्योंकि हर असली gate का propagation delay कभी शून्य नहीं होता।",
        "यह module hazards को चार क़िस्मों में बाँटता है जिन्हें आप देखते ही पहचान सकें - static-1, static-0, dynamic, और essential - और आपको एक ही औज़ार देता है, consensus theorem, जो पहले तीनों को ठीक करता है।",
        "यह पूरे Sequential Logic track को बंद करता है। Module 31 ने सिखाया कि timing constraints एक clocked circuit को ईमानदार रखती हैं; module 41 ने सिखाया कि races एक asynchronous circuit की state को बिगाड़ सकती हैं; यह module दिखाता है कि वही असमान-delay बीमारी मामूली combinational gates के अंदर चुपचाप रहती है।",
        "ऊपर scope देखिए - यह सजावट नहीं है। हर dip दो simulated gate paths से, अलग-अलग लंबाई के, live compute होता है - ठीक वही mechanism जिसे आप अभी खोलने वाले हैं।"
      ],
      transcriptEN: "Welcome to Hazards and Races, the final stop of the Sequential Logic track. A hazard is a brief, wrong output from a circuit whose steady-state Boolean algebra is completely correct - the algebra never lied, only the timing did. The root cause is always the same: two different paths carry the same information to one gate, and those paths take different amounts of time, because every real gate has non-zero propagation delay. This module names four kinds - static-1, static-0, dynamic, essential - and hands you the consensus theorem as the general cure for the first three. It closes the track: module 31 taught timing constraints, module 41 taught races in asynchronous feedback, and this module shows the same unequal-delay disease hiding inside ordinary combinational gates.",
      transcriptHI: "Hazards and Races में आपका स्वागत है, Sequential Logic track का आख़िरी पड़ाव। Hazard एक संक्षिप्त, ग़लत output है एक ऐसे circuit से जिसका steady-state Boolean algebra पूरी तरह सही है - algebra ने कभी झूठ नहीं बोला, सिर्फ़ timing ने बोला। जड़ कारण हमेशा एक ही है: दो अलग paths एक ही gate तक वही जानकारी ले जाते हैं, और वे paths अलग-अलग समय लेते हैं, क्योंकि हर असली gate का propagation delay कभी शून्य नहीं होता। यह module चार क़िस्में नाम देता है - static-1, static-0, dynamic, essential - और आपको consensus theorem पहले तीनों के सामान्य इलाज के रूप में देता है। यह track बंद करता है: module 31 ने timing constraints सिखाईं, module 41 ने asynchronous feedback में races सिखाईं, और यह module दिखाता है कि वही असमान-delay बीमारी मामूली combinational gates के अंदर छुपी रहती है।",
      visualNote: "Hero: a live 'glitch scope' - an oscilloscope-style trace of a signal that should sit flat at 1 but dips to 0 during a simulated transition, the dip width computed live from the difference between two gate-path delays."
    },
    {
      id: "S01_Video",
      label: "Hazards & Races, The Film",
      kind: "video",
      subtitle: "A short film: why correct logic can still glitch, and the four hazard types.",
      theoryEN: [
        "Here is the whole idea before you watch. Real gates are not instantaneous - each one takes a small but real amount of time (propagation delay, t_pd) to react after its inputs change.",
        "Whenever two different paths, of different length, carry the SAME input change to the SAME downstream gate, that gate can briefly see an inconsistent mix of old and new values - a hazard.",
        "The video walks all four named kinds: static-1 (should hold 1, dips), static-0 (should hold 0, spikes), dynamic (needs 3+ levels, multiple toggles), and essential (structural, only in asynchronous feedback circuits).",
        "Keep one running example in your head: Y = A'C + AB. Its steady-state truth table never changes, yet a real gate-level build of it can flash 0 for an instant while A is transitioning, purely because the inverter making A' is slower than the direct path carrying A.",
        "By the end you will read a K-map and instantly spot the hazard-causing gap between two groups, apply the consensus theorem to close it, and know exactly which one hazard type consensus logic can never fix."
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार यह है। असली gates instant नहीं होते - हर एक अपने inputs बदलने के बाद react करने में एक छोटा पर असली समय (propagation delay, t_pd) लेता है।",
        "जब भी दो अलग-अलग लंबाई वाले paths एक ही input बदलाव को एक ही downstream gate तक ले जाते हैं, वह gate क्षण भर के लिए पुराने और नए मानों का असंगत मिश्रण देख सकता है - यही hazard है।",
        "Video सभी चार नामित क़िस्मों से गुज़रता है: static-1 (1 पर टिकना चाहिए, dip करता है), static-0 (0 पर टिकना चाहिए, spike करता है), dynamic (3+ levels चाहिए, कई toggles), और essential (structural, सिर्फ़ asynchronous feedback circuits में)।",
        "एक चलता उदाहरण मन में रखिए: Y = A'C + AB। इसकी steady-state truth table कभी नहीं बदलती, फिर भी इसका असली gate-level build A के transition के दौरान क्षण भर के लिए 0 flash कर सकता है, सिर्फ़ इसलिए कि A' बनाने वाला inverter A ले जाने वाले direct path से धीमा है।",
        "अंत तक आप एक K-map पढ़कर तुरंत दो groups के बीच hazard-कारक gap पहचान लेंगे, उसे बंद करने को consensus theorem apply करेंगे, और ठीक-ठीक जानेंगे कि consensus logic किस एक hazard क़िस्म को कभी ठीक नहीं कर सकता।"
      ],
      transcriptEN: "Real gates are not instantaneous - each takes a small but real propagation delay to react after its inputs change. Whenever two different paths of different length carry the same input change to the same downstream gate, that gate can briefly see an inconsistent mix of old and new values - a hazard. Four named kinds: static-1 should hold 1 but dips, static-0 should hold 0 but spikes, dynamic needs three or more levels and multiple toggles, essential is structural and lives only in asynchronous feedback circuits. Keep one example in mind: Y equals A-prime C plus A B. Its steady-state truth table never changes, yet a real gate-level build can flash zero for an instant while A transitions, because the inverter making A-prime is slower than the direct path carrying A. By the end you'll read a K-map, spot the hazard gap, apply the consensus theorem, and know which hazard type consensus logic can never fix.",
      transcriptHI: "असली gates instant नहीं होते - हर एक अपने inputs बदलने के बाद react करने में एक छोटा पर असली propagation delay लेता है। जब भी दो अलग लंबाई वाले paths एक ही input बदलाव को एक ही downstream gate तक ले जाते हैं, वह gate क्षण भर पुराने-नए मानों का असंगत मिश्रण देख सकता है - यही hazard है। चार नामित क़िस्में: static-1 को 1 पर टिकना चाहिए पर dip करता है, static-0 को 0 पर टिकना चाहिए पर spike करता है, dynamic को 3+ levels चाहिए और कई toggles देता है, essential structural है और सिर्फ़ asynchronous feedback circuits में रहता है। एक उदाहरण मन में रखिए: Y बराबर A-prime C plus A B। इसकी steady-state truth table कभी नहीं बदलती, फिर भी इसका असली gate-level build A के transition के दौरान क्षण भर 0 flash कर सकता है, क्योंकि A-prime बनाने वाला inverter A ले जाने वाले direct path से धीमा है। अंत तक आप K-map पढ़ेंगे, hazard gap पहचानेंगे, consensus theorem apply करेंगे, और जानेंगे कि consensus logic किस hazard क़िस्म को कभी ठीक नहीं कर सकता।",
      visualNote: "Animated explainer: a wire splits into a short path and a long (inverter) path into one OR gate; as the input flips, the output trace dips for exactly the extra delay of the long path."
    },
    {
      id: "S02_Facts",
      label: "What A Hazard Actually Is",
      kind: "theory",
      subtitle: "Correct algebra, wrong instant: two paths, two delays, one fooled gate.",
      theoryEN: [
        "Let's be precise about what a hazard is, because the word gets used loosely. A hazard is a TRANSIENT, unwanted output value produced during a signal transition, in a circuit whose steady-state (settled, after-everything-has-caught-up) Boolean behaviour is completely correct. If you compare only the 'before' and 'after' logic values, nothing is wrong - the bug lives strictly in the moments between them.",
        "Why does this happen at all, if the Boolean equation is right? Because Boolean algebra is a zero-delay abstraction: it assumes every gate updates its output the instant its inputs change. Real transistors do not - every gate has a propagation delay, t_pd, a small but non-zero time between an input changing and the output catching up. The equation is a snapshot of the destination; a hazard is what happens on the road there.",
        "The general mechanism behind every hazard is called reconvergent fanout: a single input signal splits and travels along two or more different paths - through a different number of gates, or through gates of different speed - to reach a common downstream point. Because the paths differ in length, that downstream gate briefly sees one copy of the signal still carrying its OLD value while another copy already carries the NEW value, and for that instant its output can be computing an answer that matches neither the old steady state nor the new one.",
        "Hold this taxonomy loosely for now, because the rest of the module builds it precisely: static hazards (the output should not move at all, but flickers) split into static-1 (should hold 1) and static-0 (should hold 0, its dual); dynamic hazards (the output should move exactly once, but overshoots); and essential hazards (a structural problem unique to asynchronous feedback circuits). The first three all trace back to reconvergent fanout in pure combinational logic and share one general cure. The last does not."
      ],
      theoryHI: [
        "चलिए ठीक-ठीक साफ़ हों कि hazard क्या है, क्योंकि यह शब्द ढीले ढंग से वापरा जाता है। Hazard एक TRANSIENT, अनचाहा output मान है जो एक signal transition के दौरान बनता है, एक ऐसे circuit में जिसका steady-state (settled, सब कुछ पकड़ने के बाद वाला) Boolean बर्ताव पूरी तरह सही होता है। अगर आप सिर्फ़ 'पहले' और 'बाद' के logic मानों की तुलना करें, तो कुछ ग़लत नहीं है - bug ठीक उनके बीच के क्षणों में रहता है।",
        "अगर Boolean equation सही है तो यह होता ही क्यों है? क्योंकि Boolean algebra एक zero-delay abstraction है: यह मानता है कि हर gate अपना output उसी क्षण update कर देता है जब उसके inputs बदलते हैं। असली transistors ऐसा नहीं करते - हर gate का एक propagation delay, t_pd, होता है, input बदलने और output के पकड़ने के बीच एक छोटा पर non-zero समय। Equation मंज़िल की एक snapshot है; hazard वहाँ तक की सड़क पर होता है।",
        "हर hazard के पीछे सामान्य mechanism reconvergent fanout कहलाता है: एक अकेला input signal बँटता है और दो या ज़्यादा अलग paths से - अलग संख्या के gates से, या अलग गति के gates से - एक साझा downstream point तक पहुँचता है। चूँकि paths लंबाई में अलग हैं, वह downstream gate क्षण भर के लिए signal की एक copy को अभी भी उसका पुराना मान ढोते देखता है जबकि दूसरी copy पहले ही नया मान ढो रही है, और उस क्षण उसका output एक ऐसा जवाब compute कर सकता है जो न पुरानी steady state से मेल खाता है न नई से।",
        "अभी इस taxonomy को ढीला पकड़ें, क्योंकि बाक़ी module इसे ठीक-ठीक बनाता है: static hazards (output को बिलकुल नहीं हिलना चाहिए, पर flicker करता है) static-1 (1 पर टिकना चाहिए) और static-0 (0 पर टिकना चाहिए, इसका dual) में बँटते हैं; dynamic hazards (output को ठीक एक बार हिलना चाहिए, पर overshoot करता है); और essential hazards (एक structural समस्या जो सिर्फ़ asynchronous feedback circuits में होती है)। पहले तीन सब pure combinational logic में reconvergent fanout से निकलते हैं और एक सामान्य इलाज साझा करते हैं। आख़िरी नहीं करता।"
      ],
      transcriptEN: "A hazard is a transient, unwanted output value during a signal transition, in a circuit whose steady-state Boolean behaviour is completely correct. Compare only before and after and nothing is wrong - the bug lives strictly between them. This happens because Boolean algebra is a zero-delay abstraction, while real gates have a non-zero propagation delay, t_pd. The general mechanism is reconvergent fanout: one input signal splits, travels different-length paths, and reconverges at a common gate that briefly sees an inconsistent old-new mix. Four kinds: static-1, static-0, dynamic, essential - the first three share one cure, the last does not.",
      transcriptHI: "Hazard एक transient, अनचाहा output मान है signal transition के दौरान, एक ऐसे circuit में जिसका steady-state Boolean बर्ताव पूरी तरह सही है। सिर्फ़ पहले-बाद की तुलना करें तो कुछ ग़लत नहीं - bug ठीक उनके बीच रहता है। यह इसलिए होता है क्योंकि Boolean algebra एक zero-delay abstraction है, जबकि असली gates का propagation delay, t_pd, non-zero होता है। सामान्य mechanism reconvergent fanout है: एक input signal बँटता है, अलग-लंबाई paths से गुज़रता है, और एक साझा gate पर reconverge करता है जो क्षण भर पुराने-नए का असंगत मिश्रण देखता है। चार क़िस्में: static-1, static-0, dynamic, essential - पहले तीन एक इलाज साझा करते हैं, आख़िरी नहीं।",
      visualNote: "TwoPathGlitchViz: an input splits into a fast (direct) wire and a slow (extra gate-levels) wire feeding one OR gate; a +/- control changes the slow path's extra delay and the glitch window recomputes live, collapsing to zero width when the delays are made equal."
    },
    {
      id: "S03_Static1",
      label: "The Static-1 Hazard",
      kind: "theory",
      subtitle: "Y=A'C+AB dips through A's transition - add BC and it holds.",
      theoryEN: [
        "A static-1 hazard is an output that should stay steadily at 1 across an input transition but instead dips to 0 for an instant. Its root cause is a single algebraic fact taken for granted: A + A' = 1. In a sum-of-products (SOP) circuit that fact is what keeps the output at 1 while one product term switches off and another switches on - but only if both switches happen at the same instant, which real gates never guarantee.",
        "Work the standard example. Take Y = A'C + AB with B = C = 1 held fixed, and watch what happens as A transitions. At A=0, the term A'C is the one holding Y=1 (since A'=1, C=1); AB is 0. At A=1, AB takes over (A=1, B=1); A'C drops to 0. Steady-state, Y=1 on both sides - correct. But A'C depends on A only through an inverter, an extra gate the AB term never has to pass through, so A'C reacts to A's change one gate-delay LATER than AB does.",
        "Run the A: 1-to-0 edge in slow motion. AB is on the fast, direct path, so it switches off almost immediately. A'C is on the slow, inverted path, so it is still 0 (not yet caught up) at that same moment. For that window, both terms read 0, and Y = OR(0,0) = 0 - a dip to 0 in a signal that is supposed to stay at 1 the whole time. That dip is the static-1 hazard, and on a K-map it shows up as exactly this: two separate groups (A'C and AB) cover all the 1s, but the two minterms that sit on the A=0/A=1 border with B=C=1 are each covered by a DIFFERENT group, not a shared one.",
        "The consensus theorem supplies the fix. Add the product of the two literals that never change during this particular transition - B and C - as a third, logically redundant term: Y = A'C + AB + BC. Because BC does not depend on A at all, it is already sitting at 1 before, during, and after the whole A transition, holding the OR steady no matter how late A'C or how early AB happen to switch. The K-map picture matches: BC is exactly the group that bridges the two existing groups across their shared border."
      ],
      theoryHI: [
        "Static-1 hazard एक ऐसा output है जिसे एक input transition के दौरान लगातार 1 पर रहना चाहिए पर इसके बजाय क्षण भर के लिए 0 पर dip करता है। इसकी जड़ एक algebraic तथ्य है जिसे हल्के में लिया जाता है: A + A' = 1। एक sum-of-products (SOP) circuit में यही तथ्य output को 1 पर रखता है जब एक product term बंद होता है और दूसरा खुलता है - पर तभी जब दोनों switch एक ही क्षण हों, जिसकी असली gates कभी गारंटी नहीं देते।",
        "मानक उदाहरण चलाइए। Y = A'C + AB लीजिए जिसमें B = C = 1 स्थिर हैं, और देखिए जब A transition करता है तो क्या होता है। A=0 पर, term A'C वह है जो Y=1 पर रखता है (चूँकि A'=1, C=1); AB 0 है। A=1 पर, AB संभाल लेता है (A=1, B=1); A'C 0 पर गिर जाता है। Steady-state में, दोनों तरफ़ Y=1 - सही। पर A'C A पर सिर्फ़ एक inverter से निर्भर करता है, एक अतिरिक्त gate जिससे AB term को कभी गुज़रना नहीं पड़ता, तो A'C, A के बदलाव पर AB से एक gate-delay LATER react करता है।",
        "A: 1-से-0 edge को धीमी गति में चलाइए। AB तेज़, direct path पर है, तो यह लगभग तुरंत बंद हो जाता है। A'C धीमे, inverted path पर है, तो उसी क्षण यह अभी भी 0 है (अभी नहीं पकड़ा)। उस window के लिए, दोनों terms 0 पढ़ते हैं, और Y = OR(0,0) = 0 - एक ऐसे signal में 0 पर dip जिसे पूरे समय 1 पर रहना चाहिए था। वही dip static-1 hazard है, और एक K-map पर यह ठीक ऐसे दिखता है: दो अलग groups (A'C और AB) सभी 1s को cover करते हैं, पर A=0/A=1 सीमा पर B=C=1 वाले दो minterms हर एक एक अलग group से cover होते हैं, साझा group से नहीं।",
        "Consensus theorem इलाज देता है। इस ख़ास transition के दौरान कभी न बदलने वाले दो literals - B और C - का गुणनफल तीसरे, logically redundant term के रूप में जोड़िए: Y = A'C + AB + BC। चूँकि BC बिलकुल A पर निर्भर नहीं करता, यह पूरे A transition से पहले, दौरान, और बाद हमेशा 1 पर बैठा रहता है, OR को स्थिर रखता है चाहे A'C कितनी भी देर से या AB कितनी भी जल्दी switch करे। K-map तस्वीर मेल खाती है: BC ठीक वही group है जो दोनों मौजूदा groups को उनकी साझा सीमा पर जोड़ता है।"
      ],
      transcriptEN: "A static-1 hazard is an output that should hold steadily at 1 across a transition but dips to 0 for an instant, rooted in A plus A-prime equals 1. In Y equals A-prime C plus A B with B, C held at 1, at A=0 the term A-prime-C holds Y=1, at A=1 the term A-B takes over - correct on both sides. But A-prime-C passes through an extra inverter, so it reacts one gate-delay later than A-B. On the A: 1-to-0 edge, A-B switches off fast while A-prime-C hasn't switched on yet - both read 0 briefly, and Y dips to 0. The cure: add the consensus term B-C, which doesn't depend on A at all, so it holds Y at 1 through the whole transition. Y equals A-prime-C plus A-B plus B-C.",
      transcriptHI: "Static-1 hazard एक ऐसा output है जिसे transition के दौरान 1 पर टिकना चाहिए पर क्षण भर 0 पर dip करता है, जड़ है A plus A-prime बराबर 1। Y = A-prime-C plus A-B में, B, C को 1 पर रखते हुए, A=0 पर term A-prime-C, Y=1 रखता है, A=1 पर term A-B संभालता है - दोनों तरफ़ सही। पर A-prime-C एक अतिरिक्त inverter से गुज़रता है, तो यह A-B से एक gate-delay बाद react करता है। A: 1-से-0 edge पर, A-B तेज़ी से बंद होता है जबकि A-prime-C अभी चालू नहीं हुआ - दोनों क्षण भर 0 पढ़ते हैं, और Y 0 पर dip करता है। इलाज: consensus term B-C जोड़िए, जो बिलकुल A पर निर्भर नहीं करता, तो यह पूरे transition में Y को 1 पर रखता है। Y = A-prime-C plus A-B plus B-C।",
      visualNote: "Static1Lab: a computed 2x4 K-map for Y=A'C+AB with the two groups and the uncovered A=0/A=1 border highlighted; an 'add BC' toggle; a run-the-A:1->0-transition button producing a tick-by-tick table of AB, A'C, BC, Y that visibly stops dipping once BC is added."
    },
    {
      id: "S04_Static0",
      label: "The Static-0 Hazard",
      kind: "theory",
      subtitle: "Y=(A+B')(B+C) spikes through B's transition - add (A+C) and it holds.",
      theoryEN: [
        "A static-0 hazard is the exact dual of a static-1: an output that should stay steadily at 0 across a transition instead spikes up to 1 for an instant. Its root fact is the dual of before: A . A' = 0. In a product-of-sums (POS) circuit that fact is what keeps the output pinned at 0 as one sum term stops forcing a 0 and another sum term takes over the job - again, only if the handover is instantaneous.",
        "Work the dual example. Take Y = (A+B')(B+C) with A=0, C=0 held fixed, and watch B transition. At A=0, C=0 the algebra collapses to (0+B').(B+0) = B'.B, which is 0 for every value of B - so Y is steadily 0 on both sides of B's transition. The term (B+C) reads B directly (fast, no inversion needed since C=0 leaves it as B); the term (A+B') reads B only through an inverter (slow, an extra gate), since A=0 leaves it as B'.",
        "Run the B: 0-to-1 edge in slow motion. (B+C) is on the fast path, so it switches ON (to 1) almost immediately. (A+B') is on the slow, inverted path, so it is STILL 1 (hasn't switched off yet) at that same moment. For that window both sum terms read 1, and Y = AND(1,1) = 1 - a spike to 1 in a signal that is supposed to sit at 0 the entire time. On a K-map this is the mirror image of the static-1 picture: two groups of 0s ((A+B')=0 and (B+C)=0) cover all the 0-cells, but the two adjacent 0-minterms straddling the B=0/B=1 border with A=0, C=0 belong to different groups.",
        "The dual consensus theorem supplies the fix. Add the SUM of the two literals that never change during this transition - A and C - as a third, logically redundant sum term: Y = (A+B')(B+C)(A+C). Because (A+C) does not depend on B at all, and A=0, C=0 makes it identically 0 the whole time, it forces the AND to 0 no matter how late (A+B') or how early (B+C) happen to switch. General rule to lock in: static-1 <-> SOP <-> uncovered adjacent 1s <-> AND the unchanging literals in; static-0 <-> POS <-> uncovered adjacent 0s <-> OR the unchanging literals in."
      ],
      theoryHI: [
        "Static-0 hazard static-1 का ठीक dual है: एक ऐसा output जिसे एक transition के दौरान लगातार 0 पर रहना चाहिए इसके बजाय क्षण भर के लिए 1 पर spike करता है। इसका जड़ तथ्य पहले वाले का dual है: A . A' = 0। एक product-of-sums (POS) circuit में यही तथ्य output को 0 पर टिकाए रखता है जब एक sum term 0 मजबूर करना बंद करता है और दूसरा sum term काम संभालता है - फिर से, तभी जब handover instantaneous हो।",
        "Dual उदाहरण चलाइए। Y = (A+B')(B+C) लीजिए जिसमें A=0, C=0 स्थिर हैं, और B का transition देखिए। A=0, C=0 पर algebra सिमटकर (0+B').(B+0) = B'.B हो जाता है, जो B के हर मान के लिए 0 है - तो B के transition के दोनों तरफ़ Y लगातार 0 है। Term (B+C) B को सीधे पढ़ता है (तेज़, कोई inversion नहीं चाहिए क्योंकि C=0 इसे B छोड़ देता है); term (A+B') B को सिर्फ़ एक inverter से पढ़ता है (धीमा, अतिरिक्त gate), क्योंकि A=0 इसे B' छोड़ देता है।",
        "B: 0-से-1 edge को धीमी गति में चलाइए। (B+C) तेज़ path पर है, तो यह लगभग तुरंत ON (1 पर) switch करता है। (A+B') धीमे, inverted path पर है, तो उसी क्षण यह अभी भी 1 है (अभी बंद नहीं हुआ)। उस window के लिए दोनों sum terms 1 पढ़ते हैं, और Y = AND(1,1) = 1 - एक ऐसे signal में 1 पर spike जिसे पूरे समय 0 पर बैठना था। एक K-map पर यह static-1 तस्वीर का दर्पण-प्रतिबिंब है: 0s के दो groups ((A+B')=0 और (B+C)=0) सभी 0-cells को cover करते हैं, पर A=0, C=0 वाली B=0/B=1 सीमा पर बैठे दो adjacent 0-minterms अलग groups से हैं।",
        "Dual consensus theorem इलाज देता है। इस transition के दौरान कभी न बदलने वाले दो literals - A और C - का SUM तीसरे, logically redundant sum term के रूप में जोड़िए: Y = (A+B')(B+C)(A+C)। चूँकि (A+C) बिलकुल B पर निर्भर नहीं करता, और A=0, C=0 इसे पूरे समय समान रूप से 0 बनाता है, यह AND को 0 पर मजबूर करता है चाहे (A+B') कितनी भी देर से या (B+C) कितनी भी जल्दी switch करे। याद रखने का सामान्य नियम: static-1 <-> SOP <-> uncovered adjacent 1s <-> न बदलने वाले literals AND करें; static-0 <-> POS <-> uncovered adjacent 0s <-> न बदलने वाले literals OR करें।"
      ],
      transcriptEN: "A static-0 hazard is the dual of static-1: an output that should stay at 0 spikes to 1 for an instant, rooted in A AND A-prime equals 0. In Y equals (A+B') times (B+C), with A=0, C=0 held fixed, Y is steadily 0 across B's transition. (B+C) reads B directly - fast; (A+B') reads B through an inverter - slow. On B: 0-to-1, (B+C) switches on fast while (A+B') hasn't switched off yet - both read 1 briefly, and Y spikes to 1. The cure: add the consensus sum term (A+C), which doesn't depend on B and is identically 0 here, forcing Y to 0 throughout. Y equals (A+B')(B+C)(A+C).",
      transcriptHI: "Static-0 hazard static-1 का dual है: एक output जिसे 0 पर रहना चाहिए क्षण भर 1 पर spike करता है, जड़ है A AND A-prime बराबर 0। Y = (A+B') गुणा (B+C) में, A=0, C=0 स्थिर रखते हुए, Y B के transition में लगातार 0 है। (B+C) B को सीधे पढ़ता है - तेज़; (A+B') B को inverter से पढ़ता है - धीमा। B: 0-से-1 पर, (B+C) तेज़ी से ON होता है जबकि (A+B') अभी बंद नहीं हुआ - दोनों क्षण भर 1 पढ़ते हैं, और Y 1 पर spike करता है। इलाज: consensus sum term (A+C) जोड़िए, जो B पर निर्भर नहीं करता और यहाँ समान रूप से 0 है, Y को पूरे समय 0 पर मजबूर करता है। Y = (A+B')(B+C)(A+C)।",
      visualNote: "Static0Lab: dual K-map of zero-cells for Y=(A+B')(B+C) with the uncovered B=0/B=1 border highlighted; an 'add (A+C)' toggle; a run-the-B:0->1-transition button showing the computed spike disappear once the term is added."
    },
    {
      id: "S05_Dynamic",
      label: "The Dynamic Hazard",
      kind: "theory",
      subtitle: "Three levels or more, and a single edge can flicker on its way to landing.",
      theoryEN: [
        "A dynamic hazard is what happens when the output is supposed to make exactly ONE clean transition (say 0 to 1) but instead bounces through several - 0 to 1 to 0 to 1 - before finally settling on the correct final value. Unlike a static hazard, the endpoints are not equal (the output really is meant to change), but the ROUTE it takes to get there is not a straight line.",
        "The mechanism needs at least 3 logic levels, and is always reconvergent fanout again, just with more than two paths. A single input change fans out and travels through paths of different gate-count - say 1, 2 and 3 levels deep - before all of them reconverge at a shared downstream gate. Because the three copies of the same edge arrive at three different ticks, the combining gate is fed a sequence of partial updates, and if the logic function is sensitive enough (an odd/parity-style combination is the cleanest illustration), each partial update can flip the output again before the slowest path finally arrives and locks in the correct value.",
        "Walk the concrete illustration below: three copies of the same rising input reach a shared gate after 1, 2, and 3 gate-levels of delay respectively. Tick by tick - only the fastest path has updated, then the fastest two, then all three - the combining gate's output computes 0, then 1, then 0, then finally settles at 1: an intended single 0-to-1 edge that visibly flickered twice on the way.",
        "The cure is structural, not algebraic: flatten the implementation to exactly 2 logic levels (a plain single-level SOP or POS, with any needed consensus terms already folded in, exactly what the last two scenes built). With only two levels there is no room for a third path of a DIFFERENT depth to reconverge later than the other two, so a two-level AND-OR or OR-AND circuit cannot exhibit a dynamic hazard by construction - it is a defect that only appears once you factor or multi-level-optimise a design for fewer gates."
      ],
      theoryHI: [
        "Dynamic hazard तब होता है जब output को ठीक ONE साफ़ transition करना चाहिए (मान लीजिए 0 से 1) पर इसके बजाय यह कई बार उछलता है - 0 से 1 से 0 से 1 - आख़िर में सही अंतिम मान पर टिकने से पहले। Static hazard के विपरीत, endpoints बराबर नहीं हैं (output सच में बदलना चाहिए), पर वहाँ तक पहुँचने का रास्ता सीधी लाइन नहीं है।",
        "Mechanism को कम से कम 3 logic levels चाहिए, और यह फिर वही reconvergent fanout है, बस दो से ज़्यादा paths के साथ। एक अकेला input बदलाव बँटता है और अलग gate-गिनती वाले paths से गुज़रता है - मान लीजिए 1, 2 और 3 levels गहरे - इससे पहले कि सब एक साझा downstream gate पर reconverge करें। चूँकि एक ही edge की तीन copies तीन अलग ticks पर पहुँचती हैं, combining gate को partial updates का एक क्रम मिलता है, और अगर logic function काफ़ी संवेदनशील हो (एक odd/parity-शैली combination सबसे साफ़ उदाहरण है), हर partial update output को फिर पलट सकता है इससे पहले कि सबसे धीमा path आख़िर पहुँचे और सही मान जमा दे।",
        "नीचे ठोस उदाहरण चलाइए: एक ही बढ़ते input की तीन copies एक साझा gate तक क्रमशः 1, 2, और 3 gate-levels delay के बाद पहुँचती हैं। Tick दर tick - पहले सिर्फ़ सबसे तेज़ path updated, फिर सबसे तेज़ दो, फिर तीनों - combining gate का output 0, फिर 1, फिर 0 compute करता है, आख़िर 1 पर settle होता है: एक इरादा किया 0-से-1 edge जो रास्ते में साफ़ दो बार flicker करता दिखा।",
        "इलाज structural है, algebraic नहीं: implementation को ठीक 2 logic levels तक flatten कीजिए (एक सादा single-level SOP या POS, ज़रूरी consensus terms पहले से जोड़े हुए, ठीक वही जो पिछले दो scenes ने बनाया)। सिर्फ़ दो levels के साथ किसी तीसरे, अलग-गहराई वाले path के लिए बाक़ी दो से बाद में reconverge होने की जगह नहीं है, तो एक two-level AND-OR या OR-AND circuit निर्माण से ही dynamic hazard नहीं दिखा सकता - यह एक ख़राबी है जो सिर्फ़ तब दिखती है जब आप कम gates के लिए design को factor या multi-level-optimise करते हैं।"
      ],
      transcriptEN: "A dynamic hazard happens when the output should make exactly one clean transition but bounces through several before settling. It needs at least three logic levels and is reconvergent fanout with more than two paths - a single input change travels paths of different gate-count, say one, two, and three levels deep, before reconverging at a shared gate. Three copies of the same rising edge arriving at three different ticks make the combining gate flicker zero, one, zero, before finally settling at one. The cure is structural: flatten to exactly two logic levels, where a third, differently-delayed path has no room to reconverge - a two-level design cannot exhibit a dynamic hazard by construction.",
      transcriptHI: "Dynamic hazard तब होता है जब output को ठीक एक साफ़ transition करना चाहिए पर settle होने से पहले कई बार उछलता है। इसे कम से कम तीन logic levels चाहिए और यह दो से ज़्यादा paths वाला reconvergent fanout है - एक input बदलाव अलग gate-गिनती वाले paths से गुज़रता है, मान लीजिए एक, दो, और तीन levels गहरे, एक साझा gate पर reconverge होने से पहले। एक ही बढ़ते edge की तीन copies तीन अलग ticks पर पहुँचकर combining gate को शून्य, एक, शून्य flicker कराती हैं, आख़िर एक पर settle होने से पहले। इलाज structural है: ठीक दो logic levels तक flatten कीजिए, जहाँ किसी तीसरे, अलग-delay वाले path के लिए reconverge करने की जगह नहीं - एक two-level design निर्माण से dynamic hazard नहीं दिखा सकता।",
      visualNote: "DynamicHazardViz: three wires of gate-depth 1, 2, 3 converge on an odd/parity gate; a tick timeline table (v1,v2,v3,Y) computed step by step shows Y = 0,1,0,1; a 'flatten to 2-level' toggle collapses all three delays to equal and the flicker disappears, leaving a single clean edge."
    },
    {
      id: "S06_Essential",
      label: "The Essential Hazard",
      kind: "theory",
      subtitle: "Only in feedback circuits - and no amount of extra logic can fix it.",
      theoryEN: [
        "An essential hazard is a purely structural problem, and it occurs ONLY in asynchronous sequential circuits - the feedback-driven, unclocked machines from module 41. It is caused by a single input change reaching two different points of the feedback network at different times: once directly, and once after travelling all the way around the feedback loop.",
        "Contrast it sharply with the previous three. Static and dynamic hazards live entirely inside pure combinational logic, and are cured by adding or rearranging gates - the consensus theorem. An essential hazard lives in the TIMING relationship between a direct path and a looped path: the direct copy of the input reaches a decision gate quickly; the looped copy must first travel out to the feedback variable, be recomputed, and travel back, which takes strictly longer under correct design. If that margin ever collapses - the loop no longer arrives safely later than the direct path - the circuit can react to a single input change TWICE, landing on the wrong stable state.",
        "This is the exam trap, stated as bluntly as possible: no amount of redundant or consensus logic fixes an essential hazard, because the problem was never about which minterms are covered. Adding gates changes WHAT is computed, not WHEN the two copies of the same signal arrive relative to each other - and an essential hazard is entirely about the second thing. The only real fix is to physically lengthen one of the paths - almost always by inserting a delay element in the feedback path - so the looped copy is guaranteed to arrive after the direct copy has already been accounted for.",
        "Tie this back to module 41 directly: fundamental-mode operation there required one input change at a time, with the circuit fully settled (Y=y) before the next change is allowed. An essential hazard is precisely the mechanism by which that settling promise can quietly break, even when your flow table is correctly reduced and your state assignment is race-free - because those two safeguards fix the LOGIC, and an essential hazard is a problem of TIMING, hiding one level below the algebra."
      ],
      theoryHI: [
        "Essential hazard एक शुद्ध structural समस्या है, और यह सिर्फ़ asynchronous sequential circuits में होती है - module 41 वाली feedback-चालित, unclocked मशीनें। यह तब होती है जब एक अकेला input बदलाव feedback network के दो अलग-अलग बिंदुओं तक अलग-अलग समय पर पहुँचता है: एक बार सीधे, और एक बार पूरे feedback loop के चक्कर के बाद।",
        "इसे पिछले तीनों से तीखा contrast कीजिए। Static और dynamic hazards पूरी तरह pure combinational logic के अंदर रहते हैं, और gates जोड़कर या फिर से सजाकर ठीक होते हैं - consensus theorem। Essential hazard एक direct path और एक looped path के बीच TIMING रिश्ते में रहता है: input की direct copy एक decision gate तक जल्दी पहुँचती है; looped copy को पहले feedback variable तक जाना, फिर से compute होना, और वापस आना है, जो सही design के तहत सख़्ती से ज़्यादा समय लेता है। अगर वह मार्जिन कभी ढह जाए - loop अब direct path से सुरक्षित रूप से बाद में नहीं पहुँचता - तो circuit एक अकेले input बदलाव पर DOUBLE react कर सकता है, ग़लत stable state पर उतरते हुए।",
        "यही exam trap है, जितना साफ़ हो सके कहिए: कोई भी redundant या consensus logic essential hazard को ठीक नहीं करती, क्योंकि समस्या कभी इस बारे में नहीं थी कि कौन से minterms cover होते हैं। Gates जोड़ना बदलता है कि WHAT compute होता है, न कि एक ही signal की दो copies एक-दूसरे के सापेक्ष WHEN पहुँचती हैं - और essential hazard पूरी तरह दूसरी बात के बारे में है। एकमात्र असली इलाज है किसी एक path को भौतिक रूप से लंबा करना - लगभग हमेशा feedback path में एक delay element डालकर - ताकि looped copy की गारंटी हो कि यह direct copy के पहले ही हिसाब में आ जाने के बाद पहुँचे।",
        "इसे सीधे module 41 से जोड़िए: वहाँ fundamental-mode operation को एक बार में एक input बदलाव चाहिए था, अगले बदलाव की इजाज़त से पहले circuit को पूरी तरह settle (Y=y) होना था। Essential hazard ठीक वही mechanism है जिससे वह settling वादा चुपचाप टूट सकता है, तब भी जब आपका flow table सही तरह reduce हुआ हो और state assignment race-free हो - क्योंकि वे दो safeguards LOGIC ठीक करते हैं, और essential hazard TIMING की समस्या है, algebra से एक स्तर नीचे छुपी।"
      ],
      transcriptEN: "An essential hazard is a purely structural problem, occurring only in asynchronous sequential circuits, caused by a single input change reaching two points of the feedback network at different times - once directly, once after looping all the way around. Static and dynamic hazards live in combinational logic and are cured by adding gates; an essential hazard lives in the timing relationship between a direct path and a looped path, and if the loop's safety margin collapses, the circuit reacts twice, landing on the wrong stable state. No redundant logic fixes this - the problem isn't what's computed, it's when the two copies arrive. The only fix is physically lengthening the feedback path with a delay element.",
      transcriptHI: "Essential hazard एक शुद्ध structural समस्या है, सिर्फ़ asynchronous sequential circuits में होती है, एक अकेले input बदलाव के feedback network के दो बिंदुओं तक अलग समय पर पहुँचने से - एक बार सीधे, एक बार पूरा loop घूमकर। Static और dynamic hazards combinational logic में रहते हैं और gates जोड़कर ठीक होते हैं; essential hazard एक direct path और एक looped path के बीच timing रिश्ते में रहता है, और अगर loop का सुरक्षा मार्जिन ढह जाए, circuit दो बार react करता है, ग़लत stable state पर उतरते हुए। कोई redundant logic इसे ठीक नहीं करती - समस्या यह नहीं कि क्या compute होता है, बल्कि यह कि दो copies कब पहुँचती हैं। एकमात्र इलाज है feedback path को एक delay element से भौतिक रूप से लंबा करना।",
      visualNote: "EssentialHazardViz: an SVG splits an input into a short direct path and a long feedback-loop path into a shared decision gate, with a computed race verdict; an 'add consensus gate' button visibly fails to change the verdict, an 'add feedback delay' button lengthens the loop path and flips the verdict to safe."
    },
    {
      id: "S07_Consensus",
      label: "The Consensus Theorem",
      kind: "theory",
      subtitle: "XY+X'Z+YZ = XY+X'Z - redundant on paper, essential in time.",
      theoryEN: [
        "State the theorem precisely: XY + X'Z + YZ = XY + X'Z. This is an algebraic identity, true for every one of the 8 combinations of X, Y, Z - provable either by an exhaustive truth table or by the standard proof (multiply the redundant term YZ by (X+X')=1, expand, and watch it fully absorb into the first two terms).",
        "Here is the paradox that makes all of hazard theory click into place: LOGICALLY, the term YZ is 100% redundant - delete it and the truth table of the function does not change by a single row. But TIMING-wise it is essential - delete it and a static-1 hazard appears the instant X transitions while Y=Z=1, exactly the gap you watched open up in the last two scenes. This is precisely why the 'optimal' minimized SOP or POS (fewest literals, the answer a plain K-map or Boolean-algebra minimisation chases) is often the WORST choice for real hardware: hazard-free design deliberately keeps an 'extra' gate that a minimiser would happily throw away.",
        "Toggle X, Y, Z below and watch the three live gates - XY, X'Z, and YZ - confirm the identity on every single combination, then trace the exact substitution back into this module's two worked examples: setting X=A, Y=B, Z=C recovers Y=A'C+AB+BC exactly; setting X=B', Y=A, Z=C in the dual (OR/AND) form of the theorem, (X+Y)(X'+Z)(Y+Z)=(X+Y)(X'+Z), recovers the static-0 cure (A+B')(B+C)(A+C) exactly.",
        "Keep the general recipe for any K-map: find the two adjacent groups whose product (or sum) terms are separated by exactly the variable that is transitioning; AND (or OR, for POS) together the literals that BOTH groups already agree on; add that as a new term. That single recipe is the one general cure behind both static-1 and static-0 hazards - which is why it earns its name as the module's central tool."
      ],
      theoryHI: [
        "Theorem को ठीक-ठीक कहिए: XY + X'Z + YZ = XY + X'Z। यह एक algebraic identity है, X, Y, Z के सभी 8 combinations के लिए सच - या तो exhaustive truth table से या मानक प्रमाण से साबित (redundant term YZ को (X+X')=1 से गुणा कीजिए, फैलाइए, और देखिए यह पूरी तरह पहले दो terms में समा जाता है)।",
        "यहाँ वह paradox है जो पूरी hazard theory को जमा देता है: LOGICALLY, term YZ 100% redundant है - इसे हटाइए और function की truth table एक भी row से नहीं बदलती। पर TIMING की दृष्टि से यह essential है - इसे हटाइए और X के transition पर जब Y=Z=1 हो तो ठीक उसी क्षण static-1 hazard आ जाता है, वही gap जो आपने पिछले दो scenes में खुलते देखा। यही वजह है कि 'optimal' minimized SOP या POS (सबसे कम literals, जिसका जवाब एक सादा K-map या Boolean-algebra minimisation पीछा करता है) अक्सर असली hardware के लिए सबसे ख़राब चुनाव होता है: hazard-free design जान-बूझकर एक 'अतिरिक्त' gate रखता है जिसे एक minimiser ख़ुशी-ख़ुशी फेंक देगा।",
        "नीचे X, Y, Z toggle कीजिए और तीन live gates - XY, X'Z, और YZ - को हर एक combination पर identity साबित करते देखिए, फिर ठीक substitution को इस module के दो worked examples में वापस trace कीजिए: X=A, Y=B, Z=C रखने से ठीक Y=A'C+AB+BC मिलता है; theorem के dual (OR/AND) रूप, (X+Y)(X'+Z)(Y+Z)=(X+Y)(X'+Z), में X=B', Y=A, Z=C रखने से ठीक static-0 इलाज (A+B')(B+C)(A+C) मिलता है।",
        "किसी भी K-map के लिए सामान्य recipe याद रखिए: वे दो adjacent groups खोजिए जिनके product (या sum) terms ठीक उस variable से अलग होते हैं जो transition कर रहा है; उन literals को AND (या POS के लिए OR) कीजिए जिन पर दोनों groups पहले से सहमत हैं; इसे एक नए term के रूप में जोड़िए। यही एक recipe static-1 और static-0 दोनों hazards के पीछे सामान्य इलाज है - इसीलिए यह module के केंद्रीय औज़ार का नाम कमाता है।"
      ],
      transcriptEN: "State the theorem: XY plus X-prime-Z plus YZ equals XY plus X-prime-Z, an algebraic identity provable by exhaustive truth table. The paradox: logically YZ is fully redundant, deleting it never changes the truth table; timing-wise it's essential, deleting it opens a static-1 hazard exactly when X transitions with Y=Z=1. That's why a minimized SOP is often the worst hardware choice - hazard-free design deliberately keeps the extra gate. Setting X=A, Y=B, Z=C recovers this module's static-1 cure exactly; the dual substitution recovers the static-0 cure. General recipe: find two adjacent K-map groups separated by the transitioning variable, AND or OR together the literals both already agree on, add it as a new term.",
      transcriptHI: "Theorem कहिए: XY plus X-prime-Z plus YZ बराबर XY plus X-prime-Z, एक algebraic identity जो exhaustive truth table से साबित होती है। Paradox: logically YZ पूरी तरह redundant है, इसे हटाना truth table कभी नहीं बदलता; timing की दृष्टि से यह essential है, इसे हटाना ठीक तभी static-1 hazard खोलता है जब X transition करे और Y=Z=1 हो। इसीलिए एक minimized SOP अक्सर सबसे ख़राब hardware चुनाव होता है - hazard-free design जान-बूझकर अतिरिक्त gate रखता है। X=A, Y=B, Z=C रखने से इस module का static-1 इलाज ठीक मिलता है; dual substitution static-0 इलाज देता है। सामान्य recipe: transition करने वाले variable से अलग हुए दो adjacent K-map groups खोजिए, उन literals को AND या OR कीजिए जिन पर दोनों पहले से सहमत हैं, इसे नए term के रूप में जोड़िए।",
      visualNote: "ConsensusStepThrough: a StepThrough deriving the identity + LiveGate trio for XY, X'Z, YZ driven by X,Y,Z toggles, plus an all-8-combination computed check confirming XY|X'Z equals XY|X'Z|YZ every time."
    },
    {
      id: "S08_Analogy",
      label: "The Two-Wire Bulb",
      kind: "theory",
      subtitle: "Two wires, one bulb, and a flicker that isn't a fault.",
      theoryEN: [
        "Picture a single bulb wired to a switch by two parallel wires instead of one - a slightly redundant, slightly silly wiring job. One wire runs the short, direct way; the other loops the long way around the room. Both wires ultimately agree on the switch's new position, but the electrical signal measurably takes longer to travel the long wire, exactly the way a signal takes longer through an extra inverter than through a bare wire.",
        "Watch what happens on a flip. The moment someone flips the switch off, the short wire 'hears' it almost instantly and stops supplying the bulb from that side; the long wire is still carrying the OLD 'on' signal for a moment longer. If the bulb is wired to light whenever EITHER wire says on (an OR, exactly the static-1 circuit shape), the room does not dip dark, because the long wire is still covering. But wire it the other way - bulb lights only when a wire says off, an AND-style dual - and swap which wire is fast, and you get a visible flicker: a brief, wrong state on the way to the correct one, purely because the two wires disagree for an instant.",
        "Anchor this back to the facts, because the picture is only useful if it stays honest: the flicker is not imagined and is not a wiring defect - the switch's final, settled state is exactly correct, and a photograph taken ten seconds later would show nothing unusual. That is the entire nature of a hazard: the algebra of 'which wire says what' was never wrong, only the instant you looked mid-transition caught it disagreeing with itself.",
        "The fix mirrors the module exactly. An electrician who knows the long wire runs slower can add a third bridge wire, wired straight from the switch's neutral terminal, that stays live through the whole changeover regardless of which of the other two wires is ahead - the physical, hands-on version of adding the consensus term BC to Y=A'C+AB."
      ],
      theoryHI: [
        "एक अकेले bulb की कल्पना कीजिए जो एक switch से एक की जगह दो parallel wires से जुड़ा है - थोड़ा redundant, थोड़ा हास्यास्पद wiring काम। एक wire छोटे, direct रास्ते से जाती है; दूसरी कमरे के चक्कर लगाते हुए लंबे रास्ते से। दोनों wires आख़िर switch की नई स्थिति पर सहमत होती हैं, पर electrical signal को लंबी wire से गुज़रने में मापने लायक़ ज़्यादा समय लगता है - ठीक वैसे जैसे एक signal को एक अतिरिक्त inverter से गुज़रने में एक नंगी wire से ज़्यादा समय लगता है।",
        "फ्लिप पर क्या होता है देखिए। जिस क्षण कोई switch बंद करता है, छोटी wire इसे लगभग तुरंत 'सुनती' है और उस तरफ़ से bulb को supply देना बंद कर देती है; लंबी wire अभी भी पुराना 'on' signal थोड़ी देर और ढो रही है। अगर bulb ऐसे wired हो कि जब भी कोई wire on कहे तब जले (एक OR, ठीक static-1 circuit का आकार), कमरा अंधेरा नहीं dip करता, क्योंकि लंबी wire अभी भी cover कर रही है। पर इसे उल्टा wire कीजिए - bulb तभी जले जब कोई wire off कहे, एक AND-शैली dual - और यह बदल दीजिए कि कौन सी wire तेज़ है, और आपको दिखता है flicker: सही स्थिति तक पहुँचने के रास्ते में एक संक्षिप्त, ग़लत स्थिति, सिर्फ़ इसलिए क्योंकि दोनों wires क्षण भर असहमत हैं।",
        "इसे तथ्यों से जोड़े रखिए, क्योंकि तस्वीर तभी उपयोगी है जब वह ईमानदार रहे: flicker कल्पना नहीं है और wiring की ख़राबी नहीं है - switch की अंतिम, settled स्थिति बिलकुल सही है, और दस सेकंड बाद ली गई तस्वीर में कुछ भी असामान्य नहीं दिखेगा। यही hazard की पूरी प्रकृति है: 'कौन सी wire क्या कहती है' का algebra कभी ग़लत नहीं था, सिर्फ़ जिस क्षण आपने transition के बीच देखा उसने इसे ख़ुद से असहमत पकड़ा।",
        "इलाज ठीक module जैसा है। एक बिजली मिस्त्री जो जानता है कि लंबी wire धीमी चलती है, एक तीसरी bridge wire जोड़ सकता है, सीधे switch के neutral terminal से wired, जो पूरे बदलाव के दौरान live रहती है चाहे बाक़ी दो wires में से कोई भी आगे हो - Y=A'C+AB में consensus term BC जोड़ने का भौतिक, हाथों-हाथ संस्करण।"
      ],
      transcriptEN: "Picture a bulb wired to a switch by two parallel wires - one short and direct, one looping the long way. Both eventually agree on the switch's new position, but the long wire measurably takes longer, just like a signal through an extra inverter. Flip the switch off: the short wire hears it almost instantly, the long wire still carries the old 'on' signal a moment longer. Wired so the bulb lights whenever either wire says off, you get a brief flicker on the way to the correct final state - not a wiring fault, purely a timing artifact. The fix: an electrician adds a third bridge wire straight from the switch's neutral terminal that stays live through the whole changeover - the physical version of adding the consensus term BC.",
      transcriptHI: "एक bulb की कल्पना कीजिए जो switch से दो parallel wires से जुड़ा है - एक छोटी direct, एक लंबे रास्ते घूमती। दोनों आख़िर switch की नई स्थिति पर सहमत होती हैं, पर लंबी wire मापने लायक़ ज़्यादा समय लेती है, ठीक वैसे जैसे एक अतिरिक्त inverter से गुज़रता signal। Switch बंद करें: छोटी wire इसे लगभग तुरंत सुनती है, लंबी wire अभी भी पुराना 'on' signal थोड़ी देर ढोती है। ऐसे wired जहाँ bulb तब जले जब कोई भी wire off कहे, आपको सही अंतिम स्थिति तक पहुँचने के रास्ते में एक संक्षिप्त flicker मिलता है - wiring की ख़राबी नहीं, शुद्ध timing artifact। इलाज: एक मिस्त्री switch के neutral terminal से सीधे एक तीसरी bridge wire जोड़ता है जो पूरे बदलाव में live रहती है - consensus term BC जोड़ने का भौतिक संस्करण।",
      visualNote: "LightSwitchAnalogy: an SVG bulb with a short wire and a long looping wire from a switch, an animated pulse travelling each wire at a different computed speed, the bulb's brightness computed live from the OR/AND of arrival state, flickering exactly when the two pulses disagree."
    },
    {
      id: "S09_Build",
      label: "Build A Hazard-Free Circuit",
      kind: "theory",
      subtitle: "Wire a hazard, then wire its cure, on the live workbench.",
      theoryEN: [
        "Theory and a live scope trace can only take you so far - the next step is wiring the actual gates and watching a real simulated glitch happen, then watching it disappear the instant you add the consensus term.",
        "On the workbench you will build Y = A'C + AB from a NOT, two 2-input ANDs and an OR exactly as derived in this module, drive B=C=1, and step A through a transition to confirm the output dips exactly where the theory predicts.",
        "Then you will add the third AND gate computing BC and OR it in, rebuild Y = A'C + AB + BC, and repeat the exact same A transition - proving with your own hands that the dip is gone while every steady-state row of the truth table stays identical.",
        "This closes the loop the whole module has been building toward: a hazard is not a mysterious defect, it is a predictable, computable consequence of gate delay - which means it is also a predictable, buildable, and verifiable cure."
      ],
      theoryHI: [
        "Theory और एक live scope trace आपको बस यहाँ तक ले जा सकते हैं - अगला कदम असली gates wire करना और एक असली simulated glitch होते देखना है, फिर उसे consensus term जोड़ते ही ग़ायब होते देखना है।",
        "Workbench पर आप Y = A'C + AB को एक NOT, दो 2-input ANDs और एक OR से बनाएँगे ठीक जैसे इस module में निकाला गया, B=C=1 चलाएँगे, और A को एक transition से गुज़ारकर पुष्टि करेंगे कि output ठीक वहीं dip करता है जहाँ theory भविष्यवाणी करती है।",
        "फिर आप BC compute करने वाला तीसरा AND gate जोड़ेंगे और उसे OR करेंगे, Y = A'C + AB + BC फिर से बनाएँगे, और ठीक वही A transition दोहराएँगे - अपने हाथों से साबित करते हुए कि dip चला गया जबकि truth table की हर steady-state row बिलकुल वही रहती है।",
        "यह उस पूरे loop को बंद करता है जिसकी ओर पूरा module बढ़ रहा था: hazard कोई रहस्यमय ख़राबी नहीं है, यह gate delay का एक अनुमानित, compute-योग्य परिणाम है - जिसका मतलब है कि यह एक अनुमानित, बनाने योग्य, और verify-योग्य इलाज भी है।"
      ],
      transcriptEN: "Theory and a live scope trace can only take you so far - open the workbench, build Y equals A-prime-C plus A-B from a NOT, two ANDs and an OR, drive B=C=1, step A through a transition and watch the output dip exactly where the theory predicts. Then add the third AND gate for BC, rebuild with the consensus term, and repeat the transition to prove with your own hands the dip is gone while every steady-state row stays identical.",
      transcriptHI: "Theory और एक live scope trace आपको बस यहाँ तक ले जा सकते हैं - workbench खोलिए, Y = A-prime-C plus A-B को एक NOT, दो ANDs और एक OR से बनाइए, B=C=1 चलाइए, A को transition से गुज़ारिए और output को ठीक वहीं dip करते देखिए जहाँ theory भविष्यवाणी करती है। फिर BC के लिए तीसरा AND gate जोड़िए, consensus term के साथ फिर से बनाइए, और transition दोहराकर अपने हाथों से साबित कीजिए कि dip चला गया जबकि हर steady-state row बिलकुल वही रहती है।",
      visualNote: "WorkbenchCTA -> /workbench?tutorial=hazard-free-sop"
    },
    {
      id: "S10_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Eight cards - the four hazard types, the theorem, and the one exception.",
      theoryEN: [],
      theoryHI: [],
      transcriptEN: "Flip through the flashcards to drill the four hazard types, the consensus theorem, and the one type it can never fix.",
      transcriptHI: "चार hazard क़िस्मों, consensus theorem, और उस एक क़िस्म को drill करने के लिए flashcards पलटिए जिसे यह कभी ठीक नहीं कर सकता।",
      visualNote: "SubFlashCards grid."
    },
    {
      id: "S11_Quiz",
      label: "Quiz · Hazards & Races",
      kind: "quiz",
      subtitle: "Seven questions - name the hazard, find the fix, spot the exception.",
      theoryEN: [],
      theoryHI: [],
      transcriptEN: "Seven questions on naming hazards, applying the consensus theorem, and knowing exactly which hazard resists it.",
      transcriptHI: "Hazards को नाम देने, consensus theorem apply करने, और ठीक-ठीक जानने पर सात सवाल कि कौन सा hazard इसका विरोध करता है।",
      visualNote: "QuizScene with QuizArena."
    },
    {
      id: "S12_Recap",
      label: "Recap · The Track's Last Lesson",
      kind: "recap",
      subtitle: "Correct algebra, wrong instant - and the two modules this one quietly completes.",
      theoryEN: [
        "Bank the whole module in one pass. A hazard is a transient wrong output produced by unequal, non-zero gate propagation delay across two paths that reconverge on one gate, even though the steady-state Boolean algebra is completely correct. Four named kinds, sorted by symptom: static-1 (SOP, should hold 1, dips), static-0 (POS, dual, should hold 0, spikes), dynamic (needs 3+ levels, one edge becomes several toggles), and essential (structural, only in asynchronous feedback, an input reaching different feedback points at different times). The consensus theorem, XY+X'Z+YZ=XY+X'Z, is the one general cure for the first three - a logically redundant term that is timing-essential. Essential hazards resist it entirely; they need a physical delay in the feedback path instead.",
        "Tie this back to module 31 on timing. There, setup/hold windows and propagation-delay budgets existed to guarantee a clocked circuit samples the RIGHT value at the RIGHT clock edge. This module has shown the same underlying physical fact - nonzero, unequal t_pd across different paths - operating on the purely combinational side, before any clock is even in the picture. The unit is literally the same; only the consequence changes, from a missed sample to a momentary wrong output.",
        "Tie this back to module 41 on races. There, critical versus non-critical races in asynchronous feedback circuits were fixed at the STATE-ASSIGNMENT level, with Gray-coded or one-hot encoding chosen specifically to make every required transition safe. Essential hazards in this module are the sharper, structural cousin of that exact problem, living specifically in the feedback path itself - and, just like a critical race, no amount of reworking the combinational Boolean logic touches it; both problems are solved only by respecting, or deliberately engineering, the physical timing.",
        "That closes the whole Sequential Logic track, modules 28 through 42. From a single transparent latch to a race-free asynchronous state machine to the hazard that can hide inside a perfectly minimized equation, every module has circled one lesson from a different angle: a digital circuit is never just an equation - it is an equation happening IN TIME - and the entire discipline of sequential design is making sure the timing tells the same truth the algebra already knows."
      ],
      theoryHI: [
        "पूरे module को एक बार में जमा कर लें। Hazard एक transient ग़लत output है जो दो paths के असमान, non-zero gate propagation delay से बनता है जो एक gate पर reconverge करते हैं, तब भी जब steady-state Boolean algebra पूरी तरह सही होता है। चार नामित क़िस्में, लक्षण से छाँटी गईं: static-1 (SOP, 1 पर टिकना चाहिए, dip करता है), static-0 (POS, dual, 0 पर टिकना चाहिए, spike करता है), dynamic (3+ levels चाहिए, एक edge कई toggles बन जाता है), और essential (structural, सिर्फ़ asynchronous feedback में, एक input अलग feedback बिंदुओं तक अलग समय पर पहुँचता है)। Consensus theorem, XY+X'Z+YZ=XY+X'Z, पहले तीनों का सामान्य इलाज है - एक logically redundant term जो timing-essential है। Essential hazards इसका पूरी तरह विरोध करते हैं; उन्हें इसके बजाय feedback path में एक physical delay चाहिए।",
        "इसे module 31 (timing) से जोड़िए। वहाँ, setup/hold windows और propagation-delay budgets इसलिए थे ताकि एक clocked circuit सही clock edge पर सही मान sample करे। इस module ने वही अंतर्निहित physical तथ्य दिखाया है - अलग paths पर non-zero, असमान t_pd - जो शुद्ध combinational पक्ष पर काम कर रहा है, किसी clock के चित्र में आने से पहले ही। इकाई शब्दशः वही है; सिर्फ़ परिणाम बदलता है, एक चूके sample से एक क्षणिक ग़लत output तक।",
        "इसे module 41 (races) से जोड़िए। वहाँ, asynchronous feedback circuits में critical बनाम non-critical races STATE-ASSIGNMENT स्तर पर ठीक हुईं, Gray-coded या one-hot encoding ख़ास तौर पर हर ज़रूरी transition को सुरक्षित बनाने को चुनी गई। इस module में essential hazards उसी समस्या के तीखे, structural चचेरे भाई हैं, ख़ासकर feedback path के अंदर रहते हुए - और, ठीक एक critical race की तरह, combinational Boolean logic को दोबारा काम करने की कोई भी मात्रा इसे नहीं छूती; दोनों समस्याएँ सिर्फ़ physical timing का सम्मान करके, या जान-बूझकर design करके हल होती हैं।",
        "यह पूरे Sequential Logic track को बंद करता है, modules 28 से 42 तक। एक अकेले transparent latch से लेकर एक race-free asynchronous state machine तक और उस hazard तक जो एक बिलकुल minimized equation के अंदर छुप सकता है, हर module ने एक ही सबक़ को अलग कोण से घेरा है: एक digital circuit कभी सिर्फ़ एक equation नहीं है - यह एक equation है जो TIME में हो रहा है - और sequential design का पूरा अनुशासन यह सुनिश्चित करना है कि timing वही सच बताए जो algebra पहले से जानता है।"
      ],
      transcriptEN: "A hazard is a transient wrong output from unequal, non-zero gate delay across two paths reconverging on one gate, even though the steady-state algebra is correct. Four kinds by symptom: static-1, static-0, dynamic, essential - the consensus theorem cures the first three, essential resists it and needs a physical feedback delay instead. This ties to module 31's timing budgets - the same nonzero, unequal t_pd, now on the combinational side before any clock - and to module 41's races, where essential hazards are the structural cousin living in the feedback path, fixable only by respecting physical timing, never by reworking the logic. That closes the Sequential Logic track: a digital circuit is never just an equation, it is an equation happening in time.",
      transcriptHI: "Hazard एक transient ग़लत output है दो paths के असमान, non-zero gate delay से जो एक gate पर reconverge करते हैं, तब भी जब steady-state algebra सही है। लक्षण से चार क़िस्में: static-1, static-0, dynamic, essential - consensus theorem पहले तीनों को ठीक करता है, essential इसका विरोध करता है और इसके बजाय एक physical feedback delay चाहता है। यह module 31 के timing budgets से जुड़ता है - वही non-zero, असमान t_pd, अब combinational पक्ष पर किसी clock से पहले - और module 41 की races से, जहाँ essential hazards वह structural चचेरा भाई है जो feedback path में रहता है, सिर्फ़ physical timing का सम्मान करके ठीक होता है, logic को दोबारा काम करके कभी नहीं। यह Sequential Logic track बंद करता है: एक digital circuit कभी सिर्फ़ एक equation नहीं है, यह एक equation है जो time में हो रहा है।"
    }
  ],
  flashcards: [
    {
      frontEN: "What is a hazard, in one sentence?",
      backEN: "A transient, wrong output during a signal transition, in a circuit whose steady-state Boolean logic is completely correct - caused by unequal propagation delay across two paths reconverging on one gate.",
      frontHI: "Hazard क्या है, एक वाक्य में?",
      backHI: "एक signal transition के दौरान एक transient, ग़लत output, एक ऐसे circuit में जिसका steady-state Boolean logic पूरी तरह सही है - दो paths के असमान propagation delay से बनता है जो एक gate पर reconverge करते हैं।"
    },
    {
      frontEN: "Static-1 hazard - symptom, form, cure?",
      backEN: "Output should hold at 1, dips to 0. Happens in SOP circuits. Cure: add the consensus AND term of the two literals that don't change across the transition (e.g. Y=A'C+AB -> +BC).",
      frontHI: "Static-1 hazard - लक्षण, रूप, इलाज?",
      backHI: "Output को 1 पर टिकना चाहिए, 0 पर dip करता है। SOP circuits में होता है। इलाज: transition में न बदलने वाले दो literals का consensus AND term जोड़िए (जैसे Y=A'C+AB -> +BC)।"
    },
    {
      frontEN: "Static-0 hazard - symptom, form, cure?",
      backEN: "Output should hold at 0, spikes to 1. Happens in POS circuits (the dual). Cure: add the consensus OR term of the two literals that don't change (e.g. Y=(A+B')(B+C) -> ·(A+C)).",
      frontHI: "Static-0 hazard - लक्षण, रूप, इलाज?",
      backHI: "Output को 0 पर टिकना चाहिए, 1 पर spike करता है। POS circuits में होता है (dual)। इलाज: न बदलने वाले दो literals का consensus OR term जोड़िए (जैसे Y=(A+B')(B+C) -> ·(A+C))।"
    },
    {
      frontEN: "Dynamic hazard - requirement, symptom, cure?",
      backEN: "Needs 3 or more logic levels. An intended single transition becomes several toggles (e.g. 0->1->0->1) before settling. Cure: flatten the design to exactly 2 logic levels - a two-level circuit cannot exhibit one.",
      frontHI: "Dynamic hazard - ज़रूरत, लक्षण, इलाज?",
      backHI: "3 या ज़्यादा logic levels चाहिए। एक इरादा किया single transition settle होने से पहले कई toggles बन जाता है (जैसे 0->1->0->1)। इलाज: design को ठीक 2 logic levels तक flatten कीजिए - एक two-level circuit इसे नहीं दिखा सकता।"
    },
    {
      frontEN: "Essential hazard - where, cause, cure?",
      backEN: "Only in asynchronous feedback circuits. Caused by a single input reaching different feedback points at different times. Cannot be fixed by redundant/consensus logic - only by adding physical delay in the feedback path.",
      frontHI: "Essential hazard - कहाँ, कारण, इलाज?",
      backHI: "सिर्फ़ asynchronous feedback circuits में। एक अकेले input के अलग-अलग feedback बिंदुओं तक अलग समय पर पहुँचने से होता है। Redundant/consensus logic से ठीक नहीं होता - सिर्फ़ feedback path में physical delay जोड़ने से।"
    },
    {
      frontEN: "State the consensus theorem.",
      backEN: "XY + X'Z + YZ = XY + X'Z. YZ is logically redundant (truth table unchanged) but timing-essential (removing it opens a static-1 hazard when X transitions with Y=Z=1).",
      frontHI: "Consensus theorem बताइए।",
      backHI: "XY + X'Z + YZ = XY + X'Z। YZ logically redundant है (truth table नहीं बदलती) पर timing-essential है (इसे हटाना X के transition पर Y=Z=1 होने पर static-1 hazard खोलता है)।"
    },
    {
      frontEN: "Why does a minimized (fewest-literal) SOP often make bad hardware?",
      backEN: "K-map/algebra minimisation deletes exactly the 'redundant' consensus terms that a real, delay-carrying gate implementation needs to stay glitch-free across a transition.",
      frontHI: "एक minimized (सबसे कम literals वाला) SOP अक्सर ख़राब hardware क्यों बनाता है?",
      backHI: "K-map/algebra minimisation ठीक उन 'redundant' consensus terms को मिटा देता है जिन्हें एक असली, delay-वाहक gate implementation को transition में glitch-free रहने के लिए चाहिए।"
    },
    {
      frontEN: "One-line memory device for all four hazard types.",
      backEN: "SOP dips (static-1), POS spikes (static-0), 3+ levels flicker (dynamic), feedback races and only delay fixes it (essential).",
      frontHI: "चारों hazard क़िस्मों के लिए एक-पंक्ति याद-सूत्र।",
      backHI: "SOP dip करता है (static-1), POS spike करता है (static-0), 3+ levels flicker करते हैं (dynamic), feedback race करता है और सिर्फ़ delay इसे ठीक करता है (essential)।"
    }
  ],
  quiz: [
    {
      questionEN: "Which hazard type CANNOT be fixed by adding a redundant/consensus gate?",
      options: ["Static-1", "Static-0", "Dynamic", "Essential"],
      answerIndex: 3,
      explainEN: "Essential hazards are a timing problem in an asynchronous feedback loop, not a logic-coverage problem - only adding physical delay in the feedback path fixes them.",
      explainHI: "Essential hazards एक asynchronous feedback loop की timing समस्या है, logic-coverage की नहीं - सिर्फ़ feedback path में physical delay जोड़ना इसे ठीक करता है।",
      questionHI: "किस hazard क़िस्म को redundant/consensus gate जोड़कर ठीक नहीं किया जा सकता?"
    },
    {
      questionEN: "For Y = A'C + AB (B=C=1), what term removes the static-1 hazard on A's transition?",
      options: ["AC", "BC", "A'B", "AB'"],
      answerIndex: 1,
      explainEN: "BC is the consensus term of the two literals (B, C) that stay constant while A transitions; it doesn't depend on A, so it holds Y=1 through the gap.",
      explainHI: "BC उन दो literals (B, C) का consensus term है जो A के transition के दौरान स्थिर रहते हैं; यह A पर निर्भर नहीं करता, तो यह gap के दौरान Y=1 पर रखता है।",
      questionHI: "Y = A'C + AB (B=C=1) के लिए, A के transition पर static-1 hazard कौन सा term हटाता है?"
    },
    {
      questionEN: "A static-0 hazard appears in which circuit form, and how does the output misbehave?",
      options: [
        "SOP; output should hold 1, dips to 0",
        "POS; output should hold 0, spikes to 1",
        "SOP; output should hold 0, spikes to 1",
        "POS; output should hold 1, dips to 0"
      ],
      answerIndex: 1,
      explainEN: "Static-0 is the dual of static-1: it lives in product-of-sums (POS) circuits, and a steady 0 output briefly spikes to 1.",
      explainHI: "Static-0, static-1 का dual है: यह product-of-sums (POS) circuits में होता है, और एक steady 0 output क्षण भर के लिए 1 पर spike करता है।",
      questionHI: "Static-0 hazard किस circuit रूप में दिखता है, और output कैसे ग़लत बर्ताव करता है?"
    },
    {
      questionEN: "What is the minimum number of logic levels needed for a dynamic hazard to occur?",
      options: ["1", "2", "3", "4"],
      answerIndex: 2,
      explainEN: "Dynamic hazards need 3 or more logic levels - with only 2 levels there's no room for a third, differently-delayed path to reconverge and cause extra toggles.",
      explainHI: "Dynamic hazards को 3 या ज़्यादा logic levels चाहिए - सिर्फ़ 2 levels के साथ किसी तीसरे, अलग-delay वाले path के लिए reconverge होकर अतिरिक्त toggles पैदा करने की जगह नहीं है।",
      questionHI: "Dynamic hazard होने के लिए कम से कम कितने logic levels चाहिए?"
    },
    {
      questionEN: "In the consensus theorem XY + X'Z + YZ = XY + X'Z, why is YZ called 'redundant'?",
      options: [
        "Because it makes the circuit slower",
        "Because deleting it never changes the function's truth table, even though it removes a hazard",
        "Because Y and Z are always equal",
        "Because it only matters when X is undefined"
      ],
      answerIndex: 1,
      explainEN: "YZ is logically redundant - the truth table is identical with or without it - yet it is timing-essential, since removing it opens a static-1 hazard when X transitions with Y=Z=1.",
      explainHI: "YZ logically redundant है - इसके साथ या बिना truth table वही रहती है - फिर भी यह timing-essential है, क्योंकि इसे हटाना X के transition पर Y=Z=1 होने पर static-1 hazard खोलता है।",
      questionHI: "Consensus theorem XY + X'Z + YZ = XY + X'Z में, YZ को 'redundant' क्यों कहा जाता है?"
    },
    {
      questionEN: "What is the only real fix for an essential hazard?",
      options: [
        "Add a consensus/redundant logic term",
        "Re-minimize the Boolean equation",
        "Insert a physical delay element in the feedback path",
        "Switch from SOP to POS form"
      ],
      answerIndex: 2,
      explainEN: "Essential hazards are caused by a race between a direct path and a feedback-loop path; only physically lengthening the feedback path restores the correct arrival order.",
      explainHI: "Essential hazards एक direct path और एक feedback-loop path के बीच race से होते हैं; सिर्फ़ feedback path को भौतिक रूप से लंबा करना सही पहुँचने का क्रम बहाल करता है।",
      questionHI: "एक essential hazard का एकमात्र असली इलाज क्या है?"
    },
    {
      questionEN: "What is the single root cause shared by all hazards?",
      options: [
        "A mistake in the Boolean equation",
        "Two different paths to the same gate with unequal, non-zero propagation delay",
        "Using too many gates in the design",
        "The circuit missing a clock signal"
      ],
      answerIndex: 1,
      explainEN: "Every hazard traces back to the same physical fact: real gates have non-zero, unequal propagation delay, so two paths carrying the same change can briefly disagree at a shared downstream gate.",
      explainHI: "हर hazard उसी physical तथ्य पर वापस जाता है: असली gates का propagation delay non-zero और असमान होता है, तो एक ही बदलाव ले जाने वाले दो paths एक साझा downstream gate पर क्षण भर असहमत हो सकते हैं।",
      questionHI: "सभी hazards का साझा जड़ कारण क्या है?"
    }
  ]
};
