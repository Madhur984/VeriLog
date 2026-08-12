import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/41 - Asynchronous Sequential Circuits, "No Clock, Just Feedback".
 * Source: FACTS_C.md (module 41 section). No master clock: state changes the
 * instant an input changes, governed purely by feedback loops and gate delays.
 * Central model: excitation Y_i (what the combinational logic computes right
 * now) vs secondary y_i (the delayed, fed-back copy actually held); a total
 * state is stable exactly when Y_i = y_i for every loop at once. Two operating
 * disciplines keep that from turning into chaos - fundamental mode (one input
 * at a time, always settle first) and pulse mode (t_pd_FF < t_w <
 * t_feedback_delay). The primitive flow table records one stable/circled entry
 * per row. Races (critical vs non-critical) and the three race-free
 * assignment techniques (Gray coding, a transition-bridge variable, one-hot)
 * close the module out.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Asynchronous Sequential Circuits - No Clock, Just Feedback",
  moduleSubtitle: "State changes the instant an input changes - no clock, only feedback loops and gate delays deciding when it is safe to move again.",
  scenes: [
    {
      id: "S00_Cover",
      label: "No Clock, Just Feedback",
      kind: "cover",
      subtitle: "The moment an input changes, the whole circuit reacts - there is no clock edge waiting to give permission.",
      theoryEN: [
        "Every sequential circuit you have met so far - latches, flip-flops, registers, counters - has leaned on a clock: a periodic tick that says 'now it is safe to remember.' An asynchronous sequential circuit throws that clock away entirely.",
        "There is no CLK pin anywhere in this circuit. The moment any input changes, the combinational logic recomputes instantly, and that new value races back through a feedback wire to become the circuit's new remembered state.",
        "Because nothing waits for an edge, an async circuit can react in the time it takes signals to crawl through a handful of gates - often far faster than a clocked design limited by a fixed clock period.",
        "That speed is not free. Without a clock to line everyone up, two feedback loops can occasionally fight over which one gets to move first, and if the design is careless the circuit can settle into the wrong state. This module is about earning that speed safely.",
        "By the end you will read the excitation-vs-secondary-variable model, work in fundamental and pulse mode, build a primitive flow table, tell a critical race from a harmless one, and fix a racy design with a real assignment technique."
      ],
      theoryHI: [
        "अब तक जिन भी sequential circuits से आप मिले हैं - latches, flip-flops, registers, counters - सब एक clock पर टिके थे: एक periodic tick जो कहती थी 'अब याद रखना सुरक्षित है।' एक asynchronous sequential circuit उस clock को पूरी तरह फेंक देता है।",
        "इस circuit में कहीं कोई CLK pin नहीं है। जैसे ही कोई input बदलता है, combinational logic तुरंत फिर से गिनता है, और वह नया मान एक feedback wire से होकर दौड़ता हुआ वापस आता है और circuit की नई याद बन जाता है।",
        "चूँकि कोई edge का इंतज़ार नहीं होता, एक async circuit उतनी ही जल्दी react कर सकता है जितनी देर signals को कुछ gates से गुज़रने में लगती है - अक्सर एक तय clock period से बँधे clocked design से कहीं तेज़।",
        "पर यह रफ़्तार मुफ़्त नहीं है। सबको एक साथ लाइन में लगाने वाली कोई clock न होने से, कभी-कभी दो feedback loops यह लड़ाई लड़ सकते हैं कि पहले कौन चले, और अगर design लापरवाह हो तो circuit ग़लत state में जाकर बैठ सकता है। यह module इसी रफ़्तार को सुरक्षित तरीक़े से कमाने के बारे में है।",
        "अंत तक आप excitation-बनाम-secondary variable model पढ़ेंगे, fundamental और pulse mode में काम करेंगे, एक primitive flow table बनाएँगे, critical race को harmless race से अलग पहचानेंगे, और एक racy design को असली assignment तकनीक से ठीक करेंगे।"
      ],
      transcriptEN: "Welcome to Asynchronous Sequential Circuits, where the clock disappears. Every latch, flip-flop and register you've studied waited for a clock edge before it dared to remember anything new. Here there is no edge to wait for: the instant an input changes, the combinational logic recomputes, and the result feeds straight back to become the circuit's new state. That is thrilling and dangerous in equal measure - thrilling because reaction time collapses to a few gate delays, dangerous because without a clock to referee the order of events, two parts of the feedback path can race each other and the circuit can land in the wrong place. By the end of this module you will read the excitation-versus-secondary-variable model that governs every async circuit, work through fundamental mode and pulse mode design discipline, build a primitive flow table by hand, tell a critical race apart from a harmless one, and repair a racy circuit with a real state-assignment fix.",
      transcriptHI: "Asynchronous Sequential Circuits में आपका स्वागत है, जहाँ clock ग़ायब हो जाती है। हर latch, flip-flop और register जिसे आपने पढ़ा, कुछ भी नया याद रखने की हिम्मत करने से पहले एक clock edge का इंतज़ार करता था। यहाँ इंतज़ार करने को कोई edge नहीं: जिस पल एक input बदलता है, combinational logic फिर से गिनती है, और नतीजा सीधे वापस जाकर circuit की नई state बन जाता है। यह उतना ही रोमांचक है जितना ख़तरनाक - रोमांचक क्योंकि reaction time सिकुड़कर कुछ gate delays रह जाता है, ख़तरनाक क्योंकि घटनाओं के क्रम का referee बनने को कोई clock न होने से, feedback path के दो हिस्से एक-दूसरे से race कर सकते हैं और circuit ग़लत जगह जा सकता है। इस module के अंत तक आप हर async circuit को चलाने वाला excitation-बनाम-secondary variable model पढ़ेंगे, fundamental mode और pulse mode की design discipline से गुज़रेंगे, हाथ से एक primitive flow table बनाएँगे, critical race को harmless race से अलग पहचानेंगे, और एक racy circuit को असली state-assignment fix से ठीक करेंगे।",
      visualNote: "Hero: a cross-coupled feedback loop that updates the instant an input toggles, no clock button anywhere, with a small ticking-clock icon crossed out beside it."
    },
    {
      id: "S01_Video",
      label: "Asynchronous Sequential Circuits, Explained",
      kind: "video",
      subtitle: "A short film: why no clock means instant reaction and instant risk.",
      theoryEN: [
        "Picture every clocked circuit you've built as a room where nobody speaks until the teacher rings a bell. An async circuit is the same room with no teacher and no bell - everyone reacts to whatever they just heard, the instant they hear it.",
        "That reaction loop has two halves: an excitation variable Y, which is whatever the combinational logic computes right now from the current inputs and the current memory, and a secondary variable y, which is that same signal after it has travelled back through the feedback wires and become the circuit's new memory.",
        "The circuit is stable exactly when Y equals y for every one of its feedback loops at once - the logic has nothing new to say, so nothing moves until an input changes again.",
        "Two disciplines keep this from turning to chaos: fundamental mode, where you change only one input at a time and always wait for full settling before the next change, and pulse mode, where inputs arrive as short, well-timed pulses instead of held levels.",
        "Watch for the recurring picture: a feedback wire with a small delay symbol on it, a comparison between Y and y, and a green light only when they finally agree."
      ],
      theoryHI: [
        "हर clocked circuit को एक ऐसे कमरे की तरह सोचिए जहाँ कोई तब तक नहीं बोलता जब तक teacher घंटी न बजाए। एक async circuit वही कमरा है बिना teacher और बिना घंटी के - हर कोई जो अभी सुना उस पर react करता है, उसी पल।",
        "उस reaction loop के दो हिस्से हैं: एक excitation variable Y, जो कुछ भी combinational logic अभी मौजूदा inputs और मौजूदा memory से गिनती है, और एक secondary variable y, वही signal feedback wires से होकर वापस घूमने और circuit की नई memory बनने के बाद।",
        "Circuit ठीक तभी stable है जब उसके हर feedback loop के लिए एक साथ Y, y के बराबर हो - logic के पास कहने को कुछ नया नहीं, तो जब तक कोई input फिर न बदले, कुछ नहीं हिलता।",
        "दो disciplines इसे अराजकता में बदलने से रोकती हैं: fundamental mode, जहाँ आप एक बार में सिर्फ़ एक input बदलते हैं और अगले बदलाव से पहले हमेशा पूरा settle होने देते हैं, और pulse mode, जहाँ inputs स्थिर levels के बजाय छोटे, सही-समय वाले pulses की तरह आते हैं।",
        "बार-बार लौटती इस तस्वीर पर ध्यान दीजिए: एक feedback wire जिस पर एक छोटा delay symbol है, Y और y की तुलना, और एक green light सिर्फ़ तभी जब वे आख़िर में मेल खाएँ।"
      ],
      transcriptEN: "Picture every clocked circuit as a room where nobody speaks until the teacher rings a bell. An asynchronous sequential circuit is the same room with no teacher and no bell - everyone reacts to whatever they just heard, the instant they hear it. That reaction has two halves: an excitation variable Y, whatever the combinational logic computes right now from the current inputs and the current memory, and a secondary variable y, that same signal after it travels back through the feedback wires and becomes the new memory. The circuit is stable exactly when Y equals y for every feedback loop at once. Two disciplines keep this from turning into chaos: fundamental mode, where you change one input at a time and always wait for full settling before the next change, and pulse mode, where inputs arrive as short, well-timed pulses instead of held levels. Watch for the recurring picture in this module: a feedback wire with a small delay on it, Y and y compared, and a green light only when they finally agree.",
      transcriptHI: "हर clocked circuit को एक ऐसे कमरे की तरह सोचिए जहाँ कोई तब तक नहीं बोलता जब तक teacher घंटी न बजाए। एक asynchronous sequential circuit वही कमरा है बिना teacher और बिना घंटी के - हर कोई जो अभी सुना उस पर react करता है, उसी पल। उस reaction के दो हिस्से हैं: एक excitation variable Y, जो combinational logic अभी मौजूदा inputs और मौजूदा memory से गिनती है, और एक secondary variable y, वही signal feedback wires से घूमकर वापस आने और नई memory बनने के बाद। Circuit ठीक तभी stable है जब हर feedback loop के लिए एक साथ Y, y के बराबर हो। दो disciplines इसे अराजकता में बदलने से रोकती हैं: fundamental mode, जहाँ एक बार में एक input बदलते हैं और अगले बदलाव से पहले हमेशा पूरा settle होने देते हैं, और pulse mode, जहाँ inputs स्थिर levels के बजाय छोटे, सही-समय वाले pulses की तरह आते हैं। इस module में बार-बार लौटती इस तस्वीर पर ध्यान दीजिए: एक feedback wire जिस पर एक delay है, Y और y की तुलना, और एक green light सिर्फ़ तभी जब वे आख़िर में मेल खाएँ।",
      visualNote: "Animated explainer: input changes, Y computes instantly, travels around a feedback loop with a visible delay, becomes y; a green check appears only once Y=y."
    },
    {
      id: "S02_Facts",
      label: "Excitation Y vs Secondary y",
      kind: "theory",
      subtitle: "Y is computed the instant inputs change; y is the delayed, fed-back copy the circuit actually remembers.",
      theoryEN: [
        "Every asynchronous sequential circuit is built from the same two pieces: a block of ordinary combinational logic, and one or more feedback wires that loop its output back around to its own input. There is no separate 'memory element' the way a flip-flop is a separate box - the memory lives entirely inside the loop itself, in the fact that the wire takes real, physical time to carry a signal from output back to input.",
        "That physical delay is what gives the two names their meaning. The excitation variable, written Y_i, is whatever the combinational logic computes right now, this instant, from the present inputs and the present feedback values. The secondary variable, written y_i, is the value actually sitting on the feedback wire - the same signal as Y_i, just a propagation delay behind it, because it takes a little time to travel around the loop.",
        "So at the instant an input changes, Y_i can suddenly differ from y_i: the logic has already computed a new answer, but the wire is still carrying the old one. The circuit is UNSTABLE while that mismatch persists. As soon as the delayed signal catches up and y_i becomes equal to Y_i again, the loop has nothing left to correct, and the circuit is STABLE - it will not move again until some input changes.",
        "Write that condition once, precisely, because it is the single test you will run for the rest of the module: a total state (inputs, y1, y2, ... yk) is stable if and only if Y_i = y_i for every secondary variable i, simultaneously. Even one mismatched pair means the circuit is still settling.",
        "Contrast this with a synchronous design, where a flip-flop is only allowed to change on a clock edge, and the clock period Tc must satisfy Tc >= t_pcq + t_pd + t_setup so every signal has time to arrive before the next edge samples it. An async circuit has no such guardrail - there is no edge to wait for, so it is entirely up to the designer's discipline, not a clock's, to keep the loop from settling on the wrong answer.",
        "The feedback-loop diagram below is the picture to memorise: an input feeds a small combinational block, the block's output IS Y, and Y is looped back with a short delay to become y, which then feeds back into the block alongside the input. Toggle the input and watch Y jump immediately while y visibly lags, then let the delay elapse and watch the stable light turn on the moment they agree."
      ],
      theoryHI: [
        "हर asynchronous sequential circuit एक ही दो हिस्सों से बनता है: साधारण combinational logic का एक block, और एक या ज़्यादा feedback wires जो उसके output को उसी के input पर वापस लूप करती हैं। कोई अलग 'memory element' नहीं होता जैसे flip-flop एक अलग box होता है - memory पूरी तरह loop के भीतर ही रहती है, इस तथ्य में कि wire को output से input तक signal ले जाने में असली, भौतिक समय लगता है।",
        "यही भौतिक delay दोनों नामों को अर्थ देता है। Excitation variable, जिसे Y_i लिखते हैं, वह है जो combinational logic अभी, इसी पल, मौजूदा inputs और मौजूदा feedback मानों से गिनता है। Secondary variable, जिसे y_i लिखते हैं, वह मान है जो असल में feedback wire पर बैठा है - वही signal जो Y_i है, बस propagation delay जितना पीछे, क्योंकि loop के चारों ओर घूमने में थोड़ा समय लगता है।",
        "तो जिस पल कोई input बदलता है, Y_i अचानक y_i से अलग हो सकता है: logic ने पहले ही नया जवाब गिन लिया है, पर wire अभी भी पुराना ढो रही है। जब तक यह बेमेल बना रहता है, circuit UNSTABLE रहता है। जैसे ही delayed signal पकड़ लेता है और y_i फिर Y_i के बराबर हो जाता है, loop के पास सुधारने को कुछ नहीं बचता, और circuit STABLE है - जब तक कोई input फिर न बदले, यह फिर नहीं हिलेगा।",
        "इस शर्त को एक बार ठीक-ठीक लिख लीजिए, क्योंकि बाक़ी पूरे module में आप यही एक test चलाएँगे: एक total state (inputs, y1, y2, ... yk) तभी stable है जब हर secondary variable i के लिए, एक साथ, Y_i = y_i हो। एक भी बेमेल जोड़ी का मतलब है circuit अभी भी settle हो रहा है।",
        "इसकी तुलना एक synchronous design से कीजिए, जहाँ एक flip-flop सिर्फ़ clock edge पर बदलने की इजाज़त रखता है, और clock period Tc को Tc >= t_pcq + t_pd + t_setup पूरा करना होता है ताकि हर signal अगली edge के sample करने से पहले पहुँच जाए। एक async circuit में ऐसी कोई guardrail नहीं है - कोई edge नहीं जिसका इंतज़ार किया जाए, तो loop को ग़लत जवाब पर settle होने से रोकना पूरी तरह designer के discipline पर निर्भर है, किसी clock पर नहीं।",
        "नीचे वाला feedback-loop diagram वह तस्वीर है जो याद रखनी है: एक input एक छोटे combinational block में जाता है, block का output ही Y है, और Y एक छोटी delay के साथ लूप होकर y बन जाता है, जो फिर input के साथ वापस block में जाता है। Input toggle कीजिए और देखिए Y तुरंत उछलता है जबकि y साफ़ पीछे रहता है, फिर delay गुज़रने दीजिए और देखिए stable लाइट तभी जलती है जब वे मेल खाते हैं।"
      ],
      transcriptEN: "Every async circuit is combinational logic wrapped in a feedback loop with real delay in it. What the logic computes right now is the excitation Y; what's actually sitting on the feedback wire, a delay behind, is the secondary y. The circuit is stable exactly when every Y matches its y.",
      transcriptHI: "हर async circuit combinational logic है जो एक असली delay वाले feedback loop में लिपटा है। Logic अभी जो गिनता है वह excitation Y है; feedback wire पर असल में जो बैठा है, एक delay पीछे, वह secondary y है। Circuit तभी stable है जब हर Y अपने y से मेल खाए।",
      visualNote: "Feedback-loop SVG: input -> combinational block -> Y output, looped with a delay box back into y, live comparison badge STABLE/SETTLING."
    },
    {
      id: "S03_FundamentalMode",
      label: "Fundamental Mode",
      kind: "theory",
      subtitle: "Change one input at a time, and always wait for the circuit to settle before changing the next.",
      theoryEN: [
        "Fundamental mode is the first, and most common, discipline used to operate an asynchronous sequential circuit safely. It is a promise the designer makes about how inputs are allowed to arrive, not something the circuit enforces on its own: at any given moment, at most ONE input is allowed to change, and it must be a clean level change (0 stays 0 or moves to 1 and stays there, no glitches).",
        "The second half of the promise matters just as much as the first: after that one input changes, you must wait until the circuit reaches a stable total state - every Y_i equal to its y_i - before you are allowed to change any input again, including the one that just moved. Only once the dust has fully settled is it safe to move the next input.",
        "Why the rule exists is easy to see once you imagine breaking it. If two inputs changed at literally the same instant, the combinational logic would briefly see an input pattern that never corresponds to any real single-variable transition the designer planned for, and different gates along different paths would resolve that ambiguous pattern in different amounts of time - exactly the recipe for a race, covered in a couple of scenes from now.",
        "Fundamental mode buys you something valuable in exchange for that one-at-a-time discipline: with only one input ever moving, the circuit's next total state is always well-defined, and every meaningful state table you build under this discipline - like the primitive flow table coming up - is guaranteed to make sense, because it was only ever asked to describe single-input transitions.",
        "The simulator below lets you try to break the rule on purpose. Flip one input and it applies cleanly, but the circuit will refuse the next flip until you have let it settle; try to select two inputs to change at once and it will flag the attempt as illegal before anything moves, exactly the way a real fundamental-mode design must be protected by its operating environment."
      ],
      theoryHI: [
        "Fundamental mode एक asynchronous sequential circuit को सुरक्षित तरीक़े से चलाने की पहली, और सबसे आम, discipline है। यह डिज़ाइनर का एक वादा है कि inputs किस तरह आने की इजाज़त हैं, न कि कोई ऐसी चीज़ जिसे circuit ख़ुद लागू करता हो: किसी भी क्षण, ज़्यादा से ज़्यादा एक input बदलने की इजाज़त है, और वह एक साफ़ level change होना चाहिए (0 वहीं रहे या 1 पर जाकर टिक जाए, कोई glitch नहीं)।",
        "वादे का दूसरा आधा हिस्सा पहले जितना ही ज़रूरी है: उस एक input के बदलने के बाद, जब तक circuit एक stable total state तक न पहुँच जाए - हर Y_i अपने y_i के बराबर - तब तक आपको किसी भी input को फिर से बदलने की इजाज़त नहीं, उस input समेत जो अभी-अभी हिला था। धूल पूरी तरह बैठने के बाद ही अगला input हिलाना सुरक्षित है।",
        "यह नियम क्यों है यह तब आसानी से दिखता है जब आप इसे तोड़कर देखें। अगर दो inputs ठीक एक ही क्षण बदल जाएँ, तो combinational logic पल भर के लिए एक ऐसा input pattern देख लेगी जो किसी भी real single-variable transition से मेल नहीं खाता जिसकी डिज़ाइनर ने योजना बनाई थी, और अलग-अलग रास्तों पर बैठे अलग-अलग gates उस अस्पष्ट pattern को अलग-अलग समय में सुलझाएँगे - ठीक वही नुस्खा जो एक race बनाता है, जिसे अगले कुछ scenes में देखेंगे।",
        "Fundamental mode उस एक-बार-में-एक discipline के बदले कुछ क़ीमती देता है: जब हमेशा सिर्फ़ एक input हिलता है, circuit की अगली total state हमेशा साफ़-साफ़ परिभाषित होती है, और इस discipline के तहत आप जो भी सार्थक state table बनाते हैं - जैसे आगे आने वाला primitive flow table - वह ज़रूर समझ में आएगा, क्योंकि उससे कभी भी सिर्फ़ single-input transitions describe करने को कहा गया था।",
        "नीचे का simulator आपको जान-बूझकर नियम तोड़ने देता है। एक input flip कीजिए तो वह साफ़-साफ़ लागू होता है, पर circuit अगला flip तब तक मना करेगा जब तक आप उसे settle न होने दें; दो inputs एक साथ बदलने की कोशिश कीजिए तो कुछ हिलने से पहले ही यह उस कोशिश को illegal चिह्नित कर देगा, ठीक वैसे ही जैसे एक असली fundamental-mode design को अपने operating environment से सुरक्षित रहना पड़ता है।"
      ],
      transcriptEN: "Fundamental mode means one input changes at a time, and you wait for the circuit to fully settle - every Y equal to its y - before changing another. Break that rule and the combinational logic briefly sees a pattern it was never designed to handle, which is exactly how races start.",
      transcriptHI: "Fundamental mode का मतलब है एक बार में एक input बदलना, और दूसरा बदलने से पहले circuit को पूरी तरह settle होने देना - हर Y अपने y के बराबर। यह नियम तोड़िए तो combinational logic पल भर के लिए एक ऐसा pattern देखती है जिसे संभालने के लिए वह कभी बनी ही नहीं थी - यही race की शुरुआत है।",
      visualNote: "Two-input change simulator: checkbox per input, Apply button flags simultaneous selection as illegal, single legal changes require a settle step before the next."
    },
    {
      id: "S04_PulseMode",
      label: "Pulse Mode",
      kind: "theory",
      subtitle: "Inputs arrive as brief pulses; the pulse width has to thread a narrow needle.",
      theoryEN: [
        "Fundamental mode assumes inputs are held steady as levels between changes. Pulse mode is the other operating discipline: inputs arrive as brief pulses feeding storage built from unclocked SR or T-type elements, and the circuit is designed around the timing of those pulses rather than around levels settling.",
        "A pulse that is too short is simply invisible to the storage element. Every real flip-flop needs its input held for at least its own propagation delay, t_pd_FF, for the change to register; a pulse narrower than that comes and goes before the storage element can react, and the intended state change never happens at all.",
        "A pulse that is too long causes a different failure. If the pulse is still present by the time its own effect has travelled all the way around the feedback path and come back - after the feedback delay, t_feedback_delay - the circuit can re-trigger itself on the same still-active pulse, flipping again, and again, for as long as the pulse remains: an oscillation, not a single clean state change.",
        "Put those two failure modes together and you get the pulse-width inequality that defines a safe pulse: t_pd_FF < t_w < t_feedback_delay. The pulse must be wide enough for the flip-flop to actually see it, but narrower than the time it takes the effect of that pulse to loop back around and matter again.",
        "This is the pulse-mode analogue of the sizing rule you saw for fundamental mode's one-input-at-a-time discipline: fundamental mode disciplines which inputs may move and when, pulse mode disciplines how long a pulse is allowed to last. Use the sliders below to drag the pulse width across both failure zones and watch the verdict - too short, safe, or oscillating - update live from the same delay numbers."
      ],
      theoryHI: [
        "Fundamental mode यह मान लेता है कि बदलावों के बीच inputs level की तरह स्थिर बने रहते हैं। Pulse mode दूसरी operating discipline है: inputs छोटे pulses की तरह आते हैं जो unclocked SR या T-type elements से बने storage को feed करते हैं, और circuit levels के settle होने के बजाय उन pulses के timing के इर्द-गिर्द design किया जाता है।",
        "बहुत छोटा pulse storage element के लिए बस अदृश्य होता है। हर असली flip-flop को change register करने के लिए अपने input को कम से कम अपने propagation delay, t_pd_FF, जितनी देर held चाहिए; उससे संकरा pulse storage element के react करने से पहले ही आ-जा चुका होता है, और इरादा किया गया state change होता ही नहीं।",
        "बहुत लंबा pulse एक अलग तरह की विफलता देता है। अगर pulse तब भी मौजूद है जब उसका ख़ुद का असर पूरे feedback path से घूमकर - feedback delay, t_feedback_delay, के बाद - वापस आ चुका है, तो circuit उसी अब भी active pulse पर ख़ुद को फिर trigger कर सकता है, फिर पलट सकता है, और फिर, जब तक pulse बना रहे: यह एक साफ़-सुथरा state change नहीं बल्कि एक oscillation है।",
        "इन दोनों विफलताओं को साथ रखिए तो वह pulse-width असमानता मिलती है जो एक सुरक्षित pulse परिभाषित करती है: t_pd_FF < t_w < t_feedback_delay। Pulse इतना चौड़ा होना चाहिए कि flip-flop उसे सच में देख ले, पर उतने समय से संकरा जितना उस pulse के असर को घूमकर वापस मायने रखने में लगे।",
        "यह उसी sizing नियम का pulse-mode संस्करण है जो आपने fundamental mode के एक-बार-में-एक-input discipline में देखा था: fundamental mode यह अनुशासित करता है कि कौन सा input कब हिले, pulse mode यह अनुशासित करता है कि एक pulse कितनी देर टिक सकता है। नीचे वाले sliders से pulse width को दोनों विफलता क्षेत्रों में खींचिए और देखिए verdict - too short, safe, या oscillating - उन्हीं delay संख्याओं से live update होता है।"
      ],
      transcriptEN: "Pulse mode trades held levels for brief, timed pulses. Too short and the flip-flop never sees it; too long and the pulse is still around when its own feedback returns, retriggering the circuit into oscillation. Safe means t_pd_FF < t_w < t_feedback_delay.",
      transcriptHI: "Pulse mode स्थिर levels की जगह छोटे, समयबद्ध pulses वापरता है। बहुत छोटा तो flip-flop उसे कभी देखता ही नहीं; बहुत लंबा तो जब तक उसका अपना feedback लौटता है pulse अब भी मौजूद रहता है, और circuit को oscillation में फिर से trigger कर देता है। सुरक्षित का मतलब है t_pd_FF < t_w < t_feedback_delay।",
      visualNote: "Three sliders (t_pd_FF, t_w, t_feedback_delay) drawn as proportional bars; live verdict badge: too short / safe / oscillating."
    },
    {
      id: "S05_FlowTable",
      label: "The Primitive Flow Table",
      kind: "theory",
      subtitle: "One stable, circled entry per row - every other cell points toward where the circuit is still headed.",
      theoryEN: [
        "A primitive flow table is the async-circuit equivalent of a state table, built directly from a fundamental-mode specification. Its rows are total states - really just the secondary-variable combination the circuit currently holds - and its columns are the reachable input combinations, since fundamental mode only ever asks about single-input changes from wherever the row currently sits.",
        "Every row contains exactly one STABLE entry: the column where the row's own state is also the correct response, meaning Y_i = y_i already holds and the circuit has nothing left to do. That stable entry is traditionally circled - or, as printed here, wrapped in parentheses - to mark it apart from every other entry in the row.",
        "Every other entry in a row is a transient pointer: it names the row the circuit will move toward, not the state it is sitting in right now. Follow that pointer down to the row it names, and you will find that same total state listed there as its stable, circled entry - the table always leads you to where the circuit actually settles.",
        "Some cells in the table are simply left blank, written as a dash. That happens whenever the input combination in that column is unreachable from that row by a single, fundamental-mode-legal input change - there is no meaningful transition to record there, so the designer leaves it don't-care rather than inventing one.",
        "Work the example below the way you would with a road map. Start on row A (a stable state at input 00). Change the input to 01 and the table sends you to row B; row B is not yet the answer, so look up what row B does at 01 - itself, stable, circled - and you have arrived. The output column z is read off the row you finally land on, not the row you started from.",
        "The second video below walks through building one of these tables from a plain-English specification, then extracting the excitation equations from it - the exact skill you need before you can design a real asynchronous circuit rather than just read one."
      ],
      theoryHI: [
        "एक primitive flow table async-circuit की state table के बराबर चीज़ है, जो सीधे एक fundamental-mode specification से बनाई जाती है। इसकी rows total states होती हैं - असल में बस वह secondary-variable combination जो circuit अभी थामे है - और इसके columns वे input combinations होते हैं जिन तक पहुँचा जा सकता है, क्योंकि fundamental mode हमेशा सिर्फ़ यही पूछता है कि row जहाँ अभी बैठी है वहाँ से single-input बदलाव से क्या होगा।",
        "हर row में ठीक एक STABLE entry होती है: वह column जहाँ row की अपनी state ही सही जवाब भी है, यानी Y_i = y_i पहले से सच है और circuit के पास करने को कुछ नहीं बचा। उस stable entry को परंपरागत रूप से circle किया जाता है - या, जैसे यहाँ छापा गया है, parentheses में लपेटा जाता है - ताकि वह row की बाक़ी हर entry से अलग दिखे।",
        "किसी row की बाक़ी हर entry एक transient pointer है: वह उस row का नाम लेती है जिस ओर circuit बढ़ेगा, न कि उस state का जिसमें वह अभी बैठा है। उस pointer को उसकी बताई row तक पीछा कीजिए, और आपको वही total state वहाँ उसकी अपनी stable, circled entry के रूप में मिलेगी - table हमेशा आपको वहाँ ले जाती है जहाँ circuit असल में settle होता है।",
        "Table में कुछ cells बस ख़ाली छोड़ दिए जाते हैं, dash से लिखे। ऐसा तब होता है जब उस column का input combination उस row से किसी एक, fundamental-mode-legal input बदलाव से पहुँचने लायक़ ही नहीं है - वहाँ दर्ज करने को कोई सार्थक transition नहीं, तो डिज़ाइनर एक गढ़ने के बजाय उसे don't-care छोड़ देता है।",
        "नीचे दिए example को वैसे ही चलाइए जैसे एक road map के साथ करते। Row A से शुरू कीजिए (input 00 पर एक stable state)। Input को 01 पर बदलिए और table आपको row B पर भेजती है; row B अभी जवाब नहीं है, तो देखिए row B 01 पर क्या करती है - ख़ुद, stable, circled - और आप पहुँच गए। Output column z उस row से पढ़ा जाता है जहाँ आप आख़िर में उतरते हैं, उस row से नहीं जहाँ से शुरू किया था।",
        "नीचे वाला दूसरा video दिखाता है कि एक plain-English specification से इनमें से एक table कैसे बनाई जाए, फिर उससे excitation equations कैसे निकाले जाएँ - बिल्कुल वही skill जो असली asynchronous circuit design करने के लिए चाहिए, सिर्फ़ पढ़ने के लिए नहीं।"
      ],
      transcriptEN: "A primitive flow table has exactly one stable, circled entry per row and reachable-only columns; every other cell points at the row the circuit is heading toward. Follow the pointers until you land on a circled entry, and read the output there.",
      transcriptHI: "एक primitive flow table में हर row में ठीक एक stable, circled entry होती है और सिर्फ़ पहुँचने-लायक़ columns होते हैं; बाक़ी हर cell उस row की ओर इशारा करता है जिस ओर circuit बढ़ रहा है। Pointers का पीछा कीजिए जब तक एक circled entry पर न उतरें, और वहाँ output पढ़िए।",
      visualNote: "Rendered flow table A-F x DN=00/01/10 + z, stable cells marked with parentheses; second video embedded below on this scene walks through the design process."
    },
    {
      id: "S06_Races",
      label: "Critical vs Non-Critical Races",
      kind: "theory",
      subtitle: "Two secondary variables go unstable at once - does the order they resolve in matter?",
      theoryEN: [
        "A race happens whenever more than one secondary variable is unstable at exactly the same instant - both Y1 differs from y1 AND Y2 differs from y2 (or more, for larger circuits) - so real gate delays, not the design, end up deciding which one physically changes first.",
        "That uncertainty is only dangerous if it changes the answer. A NON-CRITICAL race is one where, no matter which unstable variable happens to change first, every possible order eventually settles into the same final stable total state. The order was genuinely arbitrary, and the circuit still works correctly.",
        "A CRITICAL race is the failure case: different orders settle into different final stable states. Which one you actually get depends entirely on which gate happened to be a few picoseconds faster that particular time the circuit ran - the same input change can produce two different, both individually self-consistent, but disagreeing outcomes.",
        "The classic source of a critical race is two secondary variables that depend on each other's current value in their own excitation equations - each one's next value is computed from what the other one currently is, so whichever one moves first immediately changes the ground the other one's equation was standing on.",
        "The lab below runs exactly that cross-coupled pair, Y1 = w.y2' and Y2 = w.y1', starting from a stable state where both are about to go unstable together. Pick which variable you think should 'win' and watch the circuit settle by itself, computed a step at a time - then compare the other choice and see whether the two orders agree.",
        "Notice that non-critical races are common and completely harmless - two variables that both simply track the same input independently, for instance, will always land on the same answer no matter which one the gate delays happened to let through first. It is only the cross-dependency that turns a shared instant of instability into a real design bug."
      ],
      theoryHI: [
        "एक race तब होती है जब एक से ज़्यादा secondary variable ठीक एक ही क्षण unstable हों - Y1, y1 से अलग हो AND Y2, y2 से अलग हो (बड़े circuits में और भी) - तो असली gate delays, न कि design, यह तय करती हैं कि कौन सा पहले physically बदलता है।",
        "यह अनिश्चितता तभी ख़तरनाक है जब यह जवाब बदल दे। एक NON-CRITICAL race वह है जहाँ, चाहे कोई भी unstable variable पहले बदले, हर संभव क्रम आख़िर में उसी एक same final stable total state पर settle होता है। क्रम सच में मनमाना था, और circuit फिर भी सही काम करता है।",
        "एक CRITICAL race विफलता का मामला है: अलग-अलग क्रम अलग-अलग final stable states पर settle होते हैं। आपको असल में कौन सा मिलेगा यह पूरी तरह इस पर निर्भर करता है कि उस ख़ास बार जब circuit चला, कौन सा gate कुछ picoseconds तेज़ था - वही input change दो अलग, हर एक अपने-आप में self-consistent, पर एक-दूसरे से असहमत परिणाम दे सकता है।",
        "एक critical race का क्लासिक स्रोत दो secondary variables हैं जो अपने-अपने excitation equations में एक-दूसरे के मौजूदा मान पर निर्भर करते हैं - हर एक का अगला मान इससे गिना जाता है कि दूसरा अभी क्या है, तो जो भी पहले हिले वह तुरंत उस ज़मीन को बदल देता है जिस पर दूसरे का equation खड़ा था।",
        "नीचे वाला lab ठीक वही cross-coupled जोड़ी चलाता है, Y1 = w.y2' और Y2 = w.y1', एक stable state से शुरू होकर जहाँ से दोनों साथ unstable होने वाले हैं। आप जिस variable को 'जीतना' चाहिए सोचते हैं वह चुनिए और देखिए circuit ख़ुद settle होता है, एक step code में गिना गया - फिर दूसरा चुनाव जाँचिए और देखिए दोनों क्रम सहमत हैं या नहीं।",
        "ग़ौर कीजिए कि non-critical races आम और पूरी तरह harmless हैं - जैसे दो variables जो दोनों बस एक ही input को अलग-अलग follow करते हों, हमेशा एक ही जवाब पर उतरेंगे चाहे gate delays ने पहले किसे जाने दिया हो। सिर्फ़ cross-dependency है जो unstability के साझा पल को एक असली design bug में बदल देती है।"
      ],
      transcriptEN: "A race is two secondaries unstable at once. Non-critical: every order settles to the same final state, harmless. Critical: different orders settle to different final states, a real failure - almost always caused by two variables that each depend on the other's current value.",
      transcriptHI: "एक race दो secondaries का एक साथ unstable होना है। Non-critical: हर क्रम एक ही final state पर settle होता है, harmless। Critical: अलग-अलग क्रम अलग-अलग final states पर settle होते हैं, एक असली विफलता - लगभग हमेशा दो variables की वजह से जो एक-दूसरे के मौजूदा मान पर निर्भर हों।",
      visualNote: "Race lab: pick y1-first or y2-first, computed step trace, final state per order, computed verdict CRITICAL/NON-CRITICAL by comparing both orders."
    },
    {
      id: "S07_RaceFree",
      label: "Race-Free State Assignment",
      kind: "theory",
      subtitle: "Three ways to make sure no two secondary variables are ever unstable at the same instant.",
      theoryEN: [
        "Once you can recognise a critical race, the next question is how to design it away, and there are three standard techniques, all aimed at the same underlying goal: never let more than one secondary variable be unstable at the same instant, so there is never anything left for gate-delay luck to decide.",
        "GRAY-CODE THE STATE ASSIGNMENT. If two states that must transition into one another can be given codes that differ in only one bit - a Hamming distance of 1 - then that transition can only ever require a single secondary variable to change, and a race between two variables is structurally impossible for that step, no matter how the equations are wired.",
        "ADD A TRANSITION-BRIDGE VARIABLE. Sometimes you cannot re-code the states you already have without breaking some other transition elsewhere in the table. In that case, add an extra secondary variable whose only job is to change first and carry the transition through one or more extra single-bit hops, so what used to be one risky multi-bit jump becomes a short, safe, single-file chain.",
        "USE ONE-HOT CODING. Dedicate one secondary variable per state, and design each variable's excitation so it turns on only in response to the previous state's variable, never in response to another variable that is also mid-change. Handled this way, the active bit hands off to the next one in a controlled, ordered fashion instead of two bits racing to resolve an ambiguous shared pattern.",
        "All three techniques are really the same idea wearing different clothes: keep the number of secondary variables that are simultaneously unstable at one, for every transition your circuit will ever make. The lab below lets you apply each technique to the exact cross-coupled pair from the previous scene and checks, by simulating the settle just like before, that no step ever asks two variables to move at once.",
        "Compare the numbers honestly: the original racy pair could see two variables unstable in the very same step; every fix below settles the same transition one variable at a time, all the way through - which is the entire, computable definition of race-free."
      ],
      theoryHI: [
        "एक बार जब आप एक critical race पहचान सकें, अगला सवाल है इसे design से कैसे मिटाया जाए, और इसके तीन मानक तरीक़े हैं, सब एक ही मूल लक्ष्य के लिए: एक ही क्षण में कभी भी एक से ज़्यादा secondary variable unstable न रहे, ताकि gate-delay की क़िस्मत के लिए तय करने को कुछ बचे ही नहीं।",
        "STATE ASSIGNMENT को GRAY-CODE करें। अगर दो states जिन्हें एक-दूसरे में जाना है उन्हें ऐसे codes दिए जा सकें जो सिर्फ़ एक bit में अलग हों - Hamming distance 1 - तो उस transition को कभी भी सिर्फ़ एक secondary variable के बदलने की ज़रूरत पड़ेगी, और उस step के लिए दो variables के बीच race structurally असंभव है, चाहे equations कैसे भी wire हों।",
        "एक TRANSITION-BRIDGE VARIABLE जोड़ें। कभी-कभी आप मौजूदा states को बिना table में कहीं और कोई दूसरा transition तोड़े दोबारा code नहीं कर सकते। ऐसे में, एक अतिरिक्त secondary variable जोड़िए जिसका इकलौता काम पहले बदलना और transition को एक या ज़्यादा अतिरिक्त single-bit hops से ले जाना है, ताकि जो पहले एक जोखिम भरा multi-bit जंप था वह अब एक छोटी, सुरक्षित, एक-एक करके चलती chain बन जाए।",
        "ONE-HOT CODING वापरें। हर state के लिए एक समर्पित secondary variable रखिए, और हर variable का excitation ऐसे design कीजिए कि वह सिर्फ़ पिछली state के variable के जवाब में on हो, किसी ऐसे दूसरे variable के जवाब में नहीं जो ख़ुद भी mid-change हो। इस तरह संभाला जाए तो active bit अगले को नियंत्रित, क्रमबद्ध तरीक़े से सौंपता है, न कि दो bits किसी अस्पष्ट साझा pattern को सुलझाने की दौड़ लगाएँ।",
        "तीनों तकनीकें असल में एक ही विचार हैं, बस अलग कपड़ों में: आपके circuit के हर transition के लिए, एक साथ unstable secondary variables की गिनती को एक पर रखिए। नीचे वाला lab आपको पिछले scene वाली उसी cross-coupled जोड़ी पर हर तकनीक लगाने देता है और, पहले जैसे ही settle को simulate करके, जाँचता है कि कोई भी step कभी दो variables को एक साथ हिलने को नहीं कहता।",
        "संख्याओं की ईमानदारी से तुलना कीजिए: मूल racy जोड़ी में एक ही step में दो variables unstable दिख सकते थे; नीचे का हर fix उसी transition को शुरू से आख़िर तक एक बार में एक variable settle करता है - यही race-free का पूरा, गिना जाने वाला मतलब है।"
      ],
      transcriptEN: "Three fixes, one goal: never let two secondaries be unstable together. Gray-code the assignment so transitions differ by one bit, add a bridge variable to sequence a jump you can't re-code, or dedicate one variable per state with one-hot coding. All three are checked the same way - simulate the settle and confirm no step ever needs two variables at once.",
      transcriptHI: "तीन fixes, एक लक्ष्य: दो secondaries को कभी साथ unstable न होने दें। Assignment को Gray-code कीजिए ताकि transitions एक bit से अलग हों, एक bridge variable जोड़िए उस जंप को sequence करने के लिए जिसे आप दोबारा code नहीं कर सकते, या one-hot coding से हर state के लिए एक variable समर्पित कीजिए। तीनों को एक ही तरीक़े से जाँचा जाता है - settle को simulate कीजिए और पुष्टि कीजिए कि किसी step को कभी एक साथ दो variables नहीं चाहिए।",
      visualNote: "Strategy selector Gray/Bridge/One-hot, each running the settle simulation on a redesigned version of the S06 pair; computed max-simultaneous-instability count shown per strategy, contrasted with the racy baseline."
    },
    {
      id: "S08_Analogy",
      label: "The Conversation With No Referee",
      kind: "theory",
      subtitle: "One speaks at a time and the message is clear; both speak at once and nobody can tell what was said.",
      theoryEN: [
        "Here is the plain fact this whole module has been building toward, dressed in an everyday picture: fundamental mode's one-input-at-a-time rule is exactly the etiquette of a conversation between two people with no moderator, no chairperson, and no bell to say whose turn it is.",
        "When only one person speaks at a time, the message that arrives is always correct - the listener heard the words in the order they were spoken, and there is nothing to reconstruct or guess at. That is fundamental mode working exactly as intended: one input changes, the circuit settles, the result is deterministic.",
        "When both people start talking over each other, there is no referee to decide whose sentence gets heard first, and the outcome genuinely depends on unpredictable, moment-to-moment factors - who happened to be a fraction of a second faster, who paused to breathe. That is a race, and if the two garbled halves of the conversation can be misheard as two different complete sentences, that is a critical race: the same crosstalk, different rooms, different final understanding.",
        "Notice the analogy also explains why races are not always fatal. If both people were about to say the exact same word anyway, it genuinely does not matter who said it first - the listener ends up with the same understanding regardless. That is the everyday version of a non-critical race: unpredictable timing, but a predictable, safe outcome.",
        "Try it below. With only one speaker at a time, every attempt lands the same, clear message. Let both speak at once, repeatedly, and watch the outcome tally drift - sometimes one message wins, sometimes the other, with no reliable pattern at all, exactly the unpredictability a critical race inflicts on real hardware."
      ],
      theoryHI: [
        "यह वह सादा तथ्य है जिसकी ओर पूरा module बढ़ रहा था, एक रोज़मर्रा तस्वीर में लिपटा: fundamental mode का एक-बार-में-एक-input नियम ठीक उसी शिष्टाचार जैसा है जो दो लोगों की बातचीत में होता है जहाँ कोई moderator नहीं, कोई chairperson नहीं, और बारी बताने को कोई घंटी नहीं है।",
        "जब एक समय में सिर्फ़ एक व्यक्ति बोलता है, तो जो संदेश पहुँचता है वह हमेशा सही होता है - सुनने वाले ने शब्द उसी क्रम में सुने जिसमें बोले गए, और फिर से जोड़ने या अंदाज़ा लगाने को कुछ नहीं बचता। यही fundamental mode ठीक वैसे काम करना है जैसा इरादा था: एक input बदलता है, circuit settle होता है, नतीजा निश्चित है।",
        "जब दोनों एक-दूसरे के ऊपर बोलना शुरू कर देते हैं, तो यह तय करने को कोई referee नहीं कि किसका वाक्य पहले सुना जाए, और नतीजा सच में अनिश्चित, पल-पल बदलते कारणों पर निर्भर करता है - कौन एक सेकंड के हिस्से जितना तेज़ था, कौन साँस लेने को रुका। यही एक race है, और अगर बातचीत के दोनों गड्डमड्ड हिस्सों को दो अलग-अलग पूरे वाक्यों की तरह ग़लत सुना जा सके, तो यह एक critical race है: वही crosstalk, अलग कमरे, अलग अंतिम समझ।",
        "ग़ौर कीजिए यह उपमा यह भी समझाती है कि races हमेशा घातक क्यों नहीं होतीं। अगर दोनों वैसे भी बिल्कुल वही शब्द कहने वाले थे, तो सच में कोई फ़र्क़ नहीं पड़ता कि किसने पहले कहा - सुनने वाला वैसे भी वही समझ पाता है। यही एक non-critical race का रोज़मर्रा संस्करण है: अनिश्चित timing, पर एक अनुमानित, सुरक्षित नतीजा।",
        "नीचे आज़माइए। एक समय में सिर्फ़ एक वक्ता के साथ, हर कोशिश वही, साफ़ संदेश देती है। दोनों को बार-बार साथ बोलने दीजिए, और देखिए नतीजों की गिनती बहकती है - कभी एक संदेश जीतता है, कभी दूसरा, कोई भरोसेमंद pattern नहीं - ठीक वही अनिश्चितता जो एक critical race असली hardware पर थोपती है।"
      ],
      transcriptEN: "Fundamental mode is just conversational etiquette with no referee: one speaker at a time and the message is always clear; both speak at once and the outcome is a coin flip, sometimes safe, sometimes a critical misunderstanding.",
      transcriptHI: "Fundamental mode बस बिना referee की बातचीत का शिष्टाचार है: एक समय में एक वक्ता तो संदेश हमेशा साफ़; दोनों साथ बोलें तो नतीजा coin-flip है, कभी सुरक्षित, कभी एक critical ग़लतफ़हमी।",
      visualNote: "Two speaker avatars; one-at-a-time gives a deterministic clear message every time; both-at-once gives a repeated-trial tally of two competing garbled outcomes."
    },
    {
      id: "S09_Build",
      label: "Build It For Real",
      kind: "theory",
      subtitle: "Wire an unclocked SR latch and force it through fundamental mode by hand.",
      theoryEN: [
        "Every idea in this module - excitation versus secondary, fundamental mode, pulse-width limits, races - lives inside even the simplest asynchronous circuit you already know: the cross-coupled SR latch. It has no clock, its output feeds straight back into its own input logic, and it is stable exactly when Y equals y for both of its cross-coupled gates.",
        "Open the live workbench and wire that latch from two cross-coupled NOR gates. Then, by hand, obey fundamental mode yourself: change S or R by itself, watch the outputs settle, and only then change the other input. You are the discipline that a real designer's timing analysis would normally enforce automatically.",
        "Once it behaves, try to provoke the exact failure this module studied: change S and R at what feels like the same instant and watch the outputs disagree with what a clean, one-at-a-time change would have produced - a hands-on, unmistakable feel for why the rule exists."
      ],
      theoryHI: [
        "इस module का हर विचार - excitation बनाम secondary, fundamental mode, pulse-width सीमाएँ, races - उसी सबसे सरल asynchronous circuit के भीतर रहता है जिसे आप पहले से जानते हैं: cross-coupled SR latch। इसमें कोई clock नहीं, इसका output सीधे अपने ही input logic में वापस जाता है, और यह ठीक तभी stable है जब इसके दोनों cross-coupled gates के लिए Y, y के बराबर हो।",
        "Live workbench खोलिए और दो cross-coupled NOR gates से वह latch बनाइए। फिर, हाथ से, ख़ुद fundamental mode का पालन कीजिए: S या R को अकेले बदलिए, outputs को settle होते देखिए, और तभी दूसरा input बदलिए। आप ही वह discipline हैं जिसे एक असली designer का timing analysis आमतौर पर अपने-आप लागू करता।",
        "एक बार यह ठीक व्यवहार करे, तो ठीक वही विफलता भड़काने की कोशिश कीजिए जो इस module ने पढ़ी: S और R को उस पल बदलिए जो लगभग एक जैसा महसूस हो और देखिए outputs उससे असहमत हो जाते हैं जो एक साफ़, एक-बार-में-एक बदलाव देता - एक हाथों-हाथ, बेशक़ अहसास कि यह नियम क्यों है।"
      ],
      transcriptEN: "Build the SR latch with no clock and put fundamental mode into practice with your own hands - change one input, let it settle, then the other.",
      transcriptHI: "बिना clock वाला SR latch बनाइए और fundamental mode को अपने हाथों से अमल में लाइए - एक input बदलिए, उसे settle होने दीजिए, फिर दूसरा।",
      visualNote: "WorkbenchCTA linking to the async-sr-latch guided build."
    },
    {
      id: "S10_Flashcards",
      label: "Async Sequential Flashcards",
      kind: "flashcards",
      subtitle: "Eight cards from excitation vs secondary to race-free assignment - term on the front, the real logic on the back.",
      theoryEN: ["Flip each card: the front names an async-sequential concept, the back gives the exact behaviour."],
      theoryHI: ["हर card पलटिए: सामने एक async-sequential concept का नाम, पीछे ठीक बर्ताव।"],
      transcriptEN: "Eight cards covering excitation and secondary variables, stability, fundamental mode, pulse-width limits, the primitive flow table, and critical versus non-critical races.",
      transcriptHI: "आठ cards: excitation और secondary variables, stability, fundamental mode, pulse-width सीमाएँ, primitive flow table, और critical बनाम non-critical races।",
      visualNote: "SubFlashCards deck of 8 bilingual cards."
    },
    {
      id: "S11_Quiz",
      label: "Quiz, Async Sequential Circuits",
      kind: "quiz",
      subtitle: "Seven questions on stability, fundamental mode, pulse width and races.",
      theoryEN: ["Answer each question, then read the explanation to lock the idea in."],
      theoryHI: ["हर सवाल का जवाब दीजिए, फिर explanation पढ़कर विचार पक्का कीजिए।"],
      transcriptEN: "Seven multiple-choice questions on asynchronous sequential circuits.",
      transcriptHI: "asynchronous sequential circuits पर सात multiple-choice सवाल।",
      visualNote: "QuizScene with 7 problems."
    },
    {
      id: "S12_Recap",
      label: "Recap, No Clock, Just Feedback",
      kind: "recap",
      subtitle: "Excitation vs secondary, fundamental and pulse mode, flow tables, and how to design out a race.",
      theoryEN: [
        "Strip everything in this module down to one sentence and it is this: an asynchronous sequential circuit is combinational logic wrapped in a feedback loop that has real, physical delay in it, and that delay alone is the entire memory mechanism - there is no clock anywhere to help.",
        "Two names carry the whole model. The excitation variable Y_i is whatever the logic computes right now from the present inputs and present secondaries; the secondary variable y_i is that same signal after the loop's delay, actually sitting on the feedback wire. A total state is stable exactly when Y_i = y_i for every loop at once, and unstable the instant even one pair disagrees.",
        "Two disciplines keep that instability from turning into chaos. Fundamental mode holds inputs as steady levels and insists on changing only one at a time, always waiting for full settling before the next change. Pulse mode instead feeds brief pulses into unclocked SR/T storage, and survives only inside the narrow window t_pd_FF < t_w < t_feedback_delay - too short and the flip-flop never sees it, too long and it retriggers into oscillation.",
        "The primitive flow table is fundamental mode written down as a state table: one circled, stable entry per row, every other entry a transient pointer toward wherever the circuit is actually headed, with unreachable input combinations simply left blank.",
        "When two secondary variables go unstable at the same instant, that is a race. A non-critical race is harmless - every possible order settles into the same final state. A critical race is a real failure - different orders settle into different final states, decided purely by which gate happened to be faster that particular time. The fix is always the same idea: never let two secondaries be unstable together, achieved by Gray-coding the assignment, adding a transition-bridge variable, or dedicating one variable per state with one-hot coding.",
        "Carry the picture, not just the vocabulary: a feedback wire, a delay on it, Y and y compared, and the discipline - one input at a time, or one safe pulse width - that keeps that comparison from ever becoming a coin flip."
      ],
      theoryHI: [
        "इस पूरे module को एक वाक्य में समेटिए तो यही है: एक asynchronous sequential circuit combinational logic है जो एक ऐसे feedback loop में लिपटा है जिसमें असली, भौतिक delay है, और अकेला वही delay पूरा memory तंत्र है - मदद के लिए कहीं कोई clock नहीं।",
        "पूरे model को दो नाम ढोते हैं। Excitation variable Y_i वह है जो logic अभी मौजूदा inputs और मौजूदा secondaries से गिनती है; secondary variable y_i वही signal है loop की delay के बाद, असल में feedback wire पर बैठा। एक total state तभी stable है जब हर loop के लिए एक साथ Y_i = y_i हो, और एक भी जोड़ी असहमत होते ही unstable।",
        "दो disciplines इस unstability को अराजकता में बदलने से रोकती हैं। Fundamental mode inputs को स्थिर levels की तरह रखता है और ज़ोर देता है कि एक बार में सिर्फ़ एक बदले, अगले बदलाव से पहले हमेशा पूरा settle होने दिया जाए। Pulse mode इसके बजाय unclocked SR/T storage में छोटे pulses भेजता है, और सिर्फ़ संकरी खिड़की t_pd_FF < t_w < t_feedback_delay के भीतर ही टिकता है - बहुत छोटा तो flip-flop उसे कभी देखता ही नहीं, बहुत लंबा तो oscillation में फिर trigger हो जाता है।",
        "Primitive flow table fundamental mode को एक state table में लिखा हुआ रूप है: हर row में एक circled, stable entry, बाक़ी हर entry एक transient pointer उस ओर जहाँ circuit असल में जा रहा है, और अपहुँच input combinations बस ख़ाली छोड़ दिए गए।",
        "जब दो secondary variables एक ही क्षण unstable हों, वह एक race है। Non-critical race harmless है - हर संभव क्रम उसी final state पर settle होता है। Critical race एक असली विफलता है - अलग-अलग क्रम अलग-अलग final states पर settle होते हैं, सिर्फ़ इससे तय कि उस बार कौन सा gate तेज़ था। Fix हमेशा एक ही विचार है: दो secondaries को कभी साथ unstable न होने दें, जो Gray-coding से, एक transition-bridge variable जोड़कर, या one-hot coding से हर state को एक variable समर्पित करके पाया जाता है।",
        "सिर्फ़ शब्दावली नहीं, तस्वीर साथ ले जाइए: एक feedback wire, उस पर एक delay, Y और y की तुलना, और वह discipline - एक बार में एक input, या एक सुरक्षित pulse width - जो उस तुलना को कभी coin-flip नहीं बनने देती।"
      ],
      transcriptEN: "No clock, just feedback: Y versus y, fundamental and pulse mode, the primitive flow table, and telling a harmless race from a critical one - then fixing it for good.",
      transcriptHI: "कोई clock नहीं, सिर्फ़ feedback: Y बनाम y, fundamental और pulse mode, primitive flow table, और एक harmless race को critical race से पहचानकर हमेशा के लिए ठीक करना।",
      visualNote: "FlowRail + closing prose summary."
    }
  ],
  flashcards: [
    {
      frontEN: "Excitation variable Y_i",
      backEN: "What the combinational logic computes right now from the present inputs and present secondaries - the circuit's proposed next state, not yet stored anywhere.",
      frontHI: "Excitation variable Y_i",
      backHI: "जो combinational logic अभी, मौजूदा inputs और मौजूदा secondaries से गिनती है - circuit की प्रस्तावित अगली state, अभी कहीं stored नहीं।"
    },
    {
      frontEN: "Secondary variable y_i",
      backEN: "The delayed, fed-back copy of Y_i actually sitting on the loop - what the circuit currently remembers. Stability needs Y_i = y_i.",
      frontHI: "Secondary variable y_i",
      backHI: "Y_i की देरी वाली, feedback की गई copy जो असल में loop पर बैठी है - circuit अभी जो याद रखता है। Stability के लिए Y_i = y_i चाहिए।"
    },
    {
      frontEN: "Stable total state",
      backEN: "Every Y_i equals its y_i at once. Nothing left to correct; the circuit will not move again until an input changes.",
      frontHI: "Stable total state",
      backHI: "हर Y_i एक साथ अपने y_i के बराबर। सुधारने को कुछ नहीं बचा; जब तक कोई input न बदले, circuit फिर नहीं हिलेगा।"
    },
    {
      frontEN: "Fundamental mode",
      backEN: "Change one input at a time and always wait for full settling (Y=y everywhere) before changing another - the discipline that keeps the next state well-defined.",
      frontHI: "Fundamental mode",
      backHI: "एक बार में एक input बदलिए और दूसरा बदलने से पहले हमेशा पूरा settle होने दीजिए (हर जगह Y=y) - वह discipline जो अगली state को अच्छी तरह परिभाषित रखती है।"
    },
    {
      frontEN: "Pulse-width inequality",
      backEN: "t_pd_FF < t_w < t_feedback_delay. Too short and the flip-flop never sees the pulse; too long and it retriggers into oscillation.",
      frontHI: "Pulse-width असमानता",
      backHI: "t_pd_FF < t_w < t_feedback_delay। बहुत छोटा तो flip-flop pulse देखता ही नहीं; बहुत लंबा तो oscillation में फिर trigger हो जाता है।"
    },
    {
      frontEN: "Primitive flow table",
      backEN: "One circled/stable entry per row; every other entry is a transient pointer toward the row where the circuit is actually headed.",
      frontHI: "Primitive flow table",
      backHI: "हर row में एक circled/stable entry; बाक़ी हर entry उस row की ओर transient pointer है जिस ओर circuit असल में जा रहा है।"
    },
    {
      frontEN: "Critical race",
      backEN: "Two secondaries go unstable together and different orders settle into different final states - a genuine design failure, decided by chance gate delays.",
      frontHI: "Critical race",
      backHI: "दो secondaries साथ unstable होते हैं और अलग-अलग क्रम अलग-अलग final states पर settle होते हैं - एक असली design विफलता, संयोग से gate delays तय करते हैं।"
    },
    {
      frontEN: "Non-critical race",
      backEN: "Multiple secondaries change together, but every possible order still converges on the same final state - unpredictable timing, safe result.",
      frontHI: "Non-critical race",
      backHI: "कई secondaries साथ बदलते हैं, पर हर संभव क्रम फिर भी उसी same final state पर मिलता है - अनिश्चित timing, सुरक्षित नतीजा।"
    }
  ],
  quiz: [
    {
      questionEN: "In an asynchronous sequential circuit, a total state is stable exactly when...",
      questionHI: "एक asynchronous sequential circuit में, एक total state ठीक तभी stable है जब...",
      options: [
        "Every excitation Y_i equals its secondary y_i",
        "A clock edge has just occurred",
        "Every secondary variable equals 1",
        "The pulse width exceeds t_feedback_delay"
      ],
      answerIndex: 0,
      explainEN: "Stability is defined purely by every excitation matching its fed-back secondary at once - there is no clock edge involved anywhere in the definition.",
      explainHI: "Stability सिर्फ़ इससे परिभाषित है कि हर excitation एक साथ अपने fed-back secondary से मेल खाए - इस परिभाषा में कहीं कोई clock edge शामिल नहीं।"
    },
    {
      questionEN: "Under fundamental mode, what must happen before you are allowed to change a second input?",
      questionHI: "Fundamental mode के तहत, दूसरा input बदलने की इजाज़त मिलने से पहले क्या होना चाहिए?",
      options: [
        "The circuit must fully settle (every Y_i = y_i)",
        "One full clock period must pass",
        "The output z must equal 1",
        "The pulse width must exceed t_pd_FF"
      ],
      answerIndex: 0,
      explainEN: "Fundamental mode requires the circuit to reach a stable total state - every excitation matching its secondary - before any other input is allowed to move.",
      explainHI: "Fundamental mode को चाहिए कि circuit एक stable total state तक पहुँचे - हर excitation अपने secondary से मेल खाए - इससे पहले कि कोई और input हिलने की इजाज़त पाए।"
    },
    {
      questionEN: "Which inequality defines a safe pulse width in pulse-mode design?",
      questionHI: "Pulse-mode design में एक सुरक्षित pulse width किस असमानता से परिभाषित है?",
      options: [
        "t_pd_FF < t_w < t_feedback_delay",
        "t_w < t_pd_FF",
        "t_w > t_feedback_delay",
        "t_pd_FF = t_feedback_delay"
      ],
      answerIndex: 0,
      explainEN: "The pulse must be wide enough for the flip-flop's own propagation delay to register it, but narrower than the feedback delay, or it retriggers the circuit and oscillates.",
      explainHI: "Pulse को इतना चौड़ा होना चाहिए कि flip-flop के अपने propagation delay में register हो जाए, पर feedback delay से संकरा, वरना यह circuit को फिर trigger कर देता है और oscillate करता है।"
    },
    {
      questionEN: "In a primitive flow table, how many stable (circled) entries does each row contain?",
      questionHI: "एक primitive flow table में, हर row में कितने stable (circled) entries होती हैं?",
      options: [
        "Exactly one",
        "Exactly two",
        "One per input column",
        "None - stability is only in the output column"
      ],
      answerIndex: 0,
      explainEN: "Every row has exactly one entry where the row's own state is also the correct settled response; every other entry is a transient pointer to some other row.",
      explainHI: "हर row में ठीक एक entry होती है जहाँ row की अपनी state ही सही settled जवाब भी है; बाक़ी हर entry किसी और row की ओर transient pointer है।"
    },
    {
      questionEN: "What distinguishes a critical race from a non-critical race?",
      questionHI: "एक critical race को non-critical race से क्या अलग करता है?",
      options: [
        "In a critical race, different resolution orders settle into different final states; in a non-critical race, every order settles into the same state",
        "A critical race only happens in pulse mode; a non-critical race only happens in fundamental mode",
        "A critical race involves the output z; a non-critical race never does",
        "A critical race is any race where more than two variables are unstable at once"
      ],
      answerIndex: 0,
      explainEN: "The defining test is the final outcome, not how many variables raced: if every possible order of resolution converges on the same total state the race is harmless (non-critical); if orders disagree, it is critical and a real design failure.",
      explainHI: "तय करने वाला test अंतिम नतीजा है, न कि कितने variables दौड़े: अगर हर संभव क्रम एक ही total state पर पहुँचे तो race harmless है (non-critical); अगर क्रम असहमत हों, तो यह critical है और एक असली design विफलता है।"
    },
    {
      questionEN: "Which of these is a standard technique for a race-free state assignment?",
      questionHI: "इनमें से कौन सी एक मानक race-free state-assignment तकनीक है?",
      options: [
        "Gray-coding the state assignment",
        "Increasing the clock frequency",
        "Reducing the number of gates in the excitation logic",
        "Adding a setup-time margin"
      ],
      answerIndex: 0,
      explainEN: "Gray-coding, adding a transition-bridge variable, and one-hot coding are the three standard race-free techniques; the other options are either meaningless (there is no clock) or unrelated to race-freedom.",
      explainHI: "Gray-coding, एक transition-bridge variable जोड़ना, और one-hot coding तीन मानक race-free तकनीकें हैं; बाक़ी विकल्प या तो अर्थहीन हैं (कोई clock ही नहीं है) या race-freedom से असंबंधित।"
    },
    {
      questionEN: "Why can't an asynchronous sequential circuit rely on a clock edge to keep its state changes safe?",
      questionHI: "एक asynchronous sequential circuit अपने state बदलावों को सुरक्षित रखने के लिए clock edge पर भरोसा क्यों नहीं कर सकता?",
      options: [
        "Because there is no clock at all - state changes ripple immediately from input changes through feedback and gate delays",
        "Because the clock period is always too short to be useful",
        "Because clocks only work with synchronous flip-flops, never with combinational logic",
        "Because a clock would make the circuit slower than a synchronous design"
      ],
      answerIndex: 0,
      explainEN: "There is no CLK pin anywhere in the circuit; the moment an input changes, the excitation recomputes and propagates back through the feedback loop entirely on its own, so correctness depends on design discipline (fundamental or pulse mode) rather than a clock edge separating changes in time.",
      explainHI: "Circuit में कहीं कोई CLK pin नहीं है; जिस पल input बदलता है, excitation ख़ुद ही फिर से गिनकर feedback loop से होकर वापस propagate होता है, तो सही होना clock edge के समय में बदलावों को अलग करने पर नहीं बल्कि design discipline (fundamental या pulse mode) पर निर्भर करता है।"
    }
  ]
};
