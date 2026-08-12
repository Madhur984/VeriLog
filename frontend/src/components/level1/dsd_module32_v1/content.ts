import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/32 - Flip-Flop Representations, "One Cell, Three Tables" (Sequential Logic track).
 * A single flip-flop can be described in three interchangeable "dialects": the
 * operating / truth table (input combo -> mode), the CHARACTERISTIC table &
 * equation (inputs + present state Qn -> next state Qn+1; the ANALYSIS / forward
 * view), and the EXCITATION table (a required transition Qn -> Qn+1 -> the input
 * needed; the SYNTHESIS / reverse view). Canonical characteristic equations:
 * SR Q(t+1)=S+R'Q (S.R=0); JK Q(t+1)=J.Q'+K'.Q; D Q(t+1)=D; T Q(t+1)=T(+)Q.
 * Analysis workflow: circuit -> FF input eqns -> char eqns -> state table/diagram.
 * Synthesis workflow: state diagram -> transitions -> excitation tables -> K-maps
 * -> circuit. Every table in scenes.tsx is COMPUTED from the shared _sequential
 * blocks (CharTable / ExciteTable / ffCharRows / ffExcite), never hardcoded.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Flip-Flop Representations - One Cell, Three Tables",
  moduleSubtitle: "The operating, characteristic and excitation views of one flip-flop - and how analysis reads a circuit forward while synthesis builds one in reverse.",
  scenes: [
    {
      id: "S00_Cover",
      label: "One Flip-Flop, Three Tables",
      kind: "cover",
      subtitle: "The same memory cell, written three ways - pick a type and read it forward and backward.",
      theoryEN: [
        "A single flip-flop can be described in three interchangeable ways, and this module teaches you to move between them fluently. Engineers call them the operating (truth) table, the characteristic table and equation, and the excitation table. They are three dialects for one underlying device, and knowing all three is what lets you both analyse an existing circuit and design a new one.",
        "The one idea to fix first is the notation of time. The present state, the value stored right now at time t, is written Qₙ. The next state, the value the flip-flop will hold after the next clock edge, at time t+1, is written Qₙ₊₁ (often Q(t+1)). Every table on this track is really a statement about how Qₙ and the inputs decide Qₙ₊₁.",
        "The characteristic table and equation are the FORWARD, analysis view: given the inputs and the present state Qₙ, they tell you the next state Qₙ₊₁. The four laws are worth memorising now - SR: Q(t+1) = S + R'·Q, JK: Q(t+1) = J·Q' + K'·Q, D: Q(t+1) = D, and T: Q(t+1) = T ⊕ Q.",
        "The excitation table is the REVERSE, synthesis view: given a transition you want, Qₙ → Qₙ₊₁, it tells you which inputs to apply to force it. Some of its entries are don't-cares, written x, and those x's are a gift - in a K-map they can be read as 0 or 1, whichever makes the final input equation simplest.",
        "By the end you will read any of the four flip-flops forward with its characteristic equation, backward with its excitation table, run the full analysis workflow from a circuit to a state diagram, run the full synthesis workflow from a state diagram back to a circuit, and build a JK flip-flop for real on the workbench to see all three tables at once."
      ],
      theoryHI: [
        "एक अकेले flip-flop को तीन आपस में बदले जा सकने वाले तरीक़ों से बताया जा सकता है, और यह module आपको इनके बीच धाराप्रवाह घूमना सिखाता है। Engineer इन्हें operating (truth) table, characteristic table और equation, तथा excitation table कहते हैं। ये एक ही device के तीन dialect हैं, और तीनों जानना ही आपको मौजूदा circuit का विश्लेषण और नया design दोनों करने देता है।",
        "पहले जो एक बात पक्की करनी है वह है समय की notation। present state, यानी अभी समय t पर जमा मान, लिखा जाता है Qₙ। next state, यानी अगले clock edge के बाद, समय t+1 पर, जो मान flip-flop रखेगा, लिखा जाता है Qₙ₊₁ (अक्सर Q(t+1))। इस track की हर table असल में यही कहती है कि Qₙ और inputs मिलकर Qₙ₊₁ कैसे तय करते हैं।",
        "characteristic table और equation FORWARD, यानी analysis नज़रिया हैं: inputs और present state Qₙ दिए हों, तो ये next state Qₙ₊₁ बता देते हैं। चारों नियम अभी याद कर लीजिए - SR: Q(t+1) = S + R'·Q, JK: Q(t+1) = J·Q' + K'·Q, D: Q(t+1) = D, और T: Q(t+1) = T ⊕ Q।",
        "excitation table REVERSE, यानी synthesis नज़रिया है: आप जो transition चाहते हैं, Qₙ → Qₙ₊₁, दिया हो, तो यह बताती है कि उसे मजबूर करने के लिए कौन से inputs लगाएँ। इसकी कुछ entries don't-care हैं, x लिखी जाती हैं, और वे x एक तोहफ़ा हैं - K-map में इन्हें 0 या 1, जो भी final input equation सबसे सरल बनाए, पढ़ा जा सकता है।",
        "अंत तक आप चारों flip-flops को characteristic equation से आगे, excitation table से पीछे पढ़ पाएँगे, circuit से state diagram तक पूरा analysis workflow चलाएँगे, state diagram से वापस circuit तक पूरा synthesis workflow चलाएँगे, और workbench पर एक JK flip-flop असली में बनाकर तीनों tables एक साथ देखेंगे।"
      ],
      transcriptEN: "A single flip-flop can be described three interchangeable ways: the operating or truth table, the characteristic table and equation, and the excitation table. Three dialects for one device. Fix the notation of time first: the present state at time t is Q-n, and the next state after the next clock edge, at t plus one, is Q-n-plus-one, often written Q of t plus one. The characteristic view is forward, for analysis: given the inputs and the present state, it gives the next state. The four laws: SR is Q-next equals S plus R-prime Q; JK is J Q-prime plus K-prime Q; D is just D; T is T XOR Q. The excitation view is reverse, for synthesis: given a transition you want, from present to next, it gives the inputs to force it, and its don't-care x entries can be read as zero or one to simplify the K-map. By the end you'll read any flip-flop forward and backward, run analysis from a circuit to a state diagram, run synthesis from a state diagram back to a circuit, and build a JK for real.",
      transcriptHI: "एक अकेले flip-flop को तीन आपस में बदले जा सकने वाले तरीक़ों से बताया जा सकता है: operating या truth table, characteristic table और equation, तथा excitation table। एक device के तीन dialect। पहले समय की notation पक्की कीजिए: समय t पर present state है Q-n, और अगले clock edge के बाद, t plus one पर, next state है Q-n-plus-one, अक्सर Q of t plus one। characteristic नज़रिया forward है, analysis के लिए: inputs और present state दिए हों तो next state देता है। चार नियम: SR है Q-next बराबर S plus R-prime Q; JK है J Q-prime plus K-prime Q; D है सिर्फ़ D; T है T XOR Q। excitation नज़रिया reverse है, synthesis के लिए: आप जो transition चाहें, present से next, उसे मजबूर करने के inputs देता है, और इसकी don't-care x entries K-map सरल करने को zero या one पढ़ी जा सकती हैं। अंत तक आप किसी भी flip-flop को आगे-पीछे पढ़ेंगे, circuit से state diagram तक analysis चलाएँगे, state diagram से circuit तक synthesis चलाएँगे, और एक JK असली में बनाएँगे।",
      visualNote: "Hero: a type selector (SR/JK/D/T); choosing one shows its characteristic table (forward) and excitation table (reverse) side by side, both computed."
    },
    {
      id: "S01_Video",
      label: "The Three Views Of A Flip-Flop",
      kind: "video",
      subtitle: "A short film: reading one memory cell forward with its characteristic table and backward with its excitation table.",
      theoryEN: [
        "Here is the whole idea in one breath before you watch. A flip-flop has exactly one job - remember one bit - but design work asks two opposite questions about it, so we keep two tables. When you have a circuit and want to know what it does, you go forward. When you want a specific behaviour and need to know how to wire it, you go backward.",
        "Forward is the characteristic table: list every combination of the inputs and the present state Qₙ, and record the next state Qₙ₊₁. Squeeze that table with a Karnaugh map and it collapses to the characteristic equation, one compact Boolean law per flip-flop type.",
        "Backward is the excitation table: for each of the four possible transitions - 0→0, 0→1, 1→0, 1→1 - record what the inputs must be to make it happen. This is the table you reach for when you are building a counter or a state machine and you already know the state sequence you want.",
        "Watch for the don't-cares in the reverse table. For the SR and JK flip-flops several entries are x, meaning 'either value works here'. Those free choices are exactly what lets a K-map produce a smaller circuit, which is why JK and SR are so popular for hand design.",
        "Keep one running example for the whole module: a flip-flop sitting at present state Qₙ = 0. Its characteristic equation predicts Qₙ₊₁ from the inputs; its excitation table, read the other way, tells you which inputs would drive that 0 up to a 1. Same cell, two directions, three tables."
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार एक साँस में। flip-flop का काम ठीक एक है - एक bit याद रखना - पर design में इसके बारे में दो उलटे सवाल पूछे जाते हैं, तो हम दो tables रखते हैं। जब आपके पास circuit हो और जानना हो कि यह क्या करता है, तो आप आगे जाते हैं। जब आपको एक ख़ास बर्ताव चाहिए और जानना हो कि कैसे wire करें, तो आप पीछे जाते हैं।",
        "आगे है characteristic table: inputs और present state Qₙ का हर combination लिखिए, और next state Qₙ₊₁ दर्ज कीजिए। उस table को Karnaugh map से निचोड़िए तो यह characteristic equation में सिमट जाती है, हर flip-flop type के लिए एक सघन Boolean नियम।",
        "पीछे है excitation table: चार संभव transitions - 0→0, 0→1, 1→0, 1→1 - में से हर एक के लिए दर्ज कीजिए कि उसे कराने को inputs क्या होने चाहिए। यही वह table है जिसे आप तब उठाते हैं जब एक counter या state machine बना रहे हों और आपको मनचाहा state क्रम पहले से पता हो।",
        "reverse table में don't-cares पर ग़ौर कीजिए। SR और JK flip-flops के लिए कई entries x हैं, यानी 'यहाँ कोई भी मान चलेगा'। वे मुफ़्त विकल्प ही K-map को छोटा circuit देने देते हैं, इसीलिए JK और SR हाथ से design के लिए इतने लोकप्रिय हैं।",
        "पूरे module के लिए एक उदाहरण मन में रखिए: एक flip-flop present state Qₙ = 0 पर बैठा है। इसका characteristic equation inputs से Qₙ₊₁ भविष्यवाणी करता है; इसकी excitation table, उलटा पढ़ी, बताती है कि कौन से inputs उस 0 को 1 तक चढ़ाएँगे। वही cell, दो दिशाएँ, तीन tables।"
      ],
      transcriptEN: "Here's the whole idea in one breath. A flip-flop has one job, remember one bit, but design asks two opposite questions, so we keep two tables. When you have a circuit and want to know what it does, you go forward with the characteristic table: list every combination of inputs and the present state Q-n, and record the next state Q-n-plus-one. Squeeze it with a Karnaugh map and it becomes the characteristic equation, one compact law per type. When you want a specific behaviour and need to wire it, you go backward with the excitation table: for each of the four transitions, zero to zero, zero to one, one to zero, one to one, record what the inputs must be. Watch the don't-cares, the x entries, for SR and JK: they mean either value works, and a K-map uses that freedom to shrink the circuit. Keep one example: a flip-flop at present state zero. Its characteristic equation predicts the next state from the inputs; its excitation table tells you which inputs would drive that zero up to a one. Same cell, two directions, three tables.",
      transcriptHI: "पूरा विचार एक साँस में। flip-flop का काम एक है, एक bit याद रखना, पर design दो उलटे सवाल पूछता है, तो हम दो tables रखते हैं। circuit हो और जानना हो कि यह क्या करता है, तो characteristic table से आगे जाइए: inputs और present state Q-n का हर combination लिखिए, और next state Q-n-plus-one दर्ज कीजिए। Karnaugh map से निचोड़िए तो यह characteristic equation बन जाती है, हर type का एक सघन नियम। ख़ास बर्ताव चाहिए और wire करना हो, तो excitation table से पीछे जाइए: चार transitions में से हर एक के लिए दर्ज कीजिए कि inputs क्या होने चाहिए। SR और JK के don't-cares, x entries, पर ग़ौर कीजिए: इनका मतलब कोई भी मान चलेगा, और K-map उस आज़ादी से circuit छोटा करता है। एक उदाहरण रखिए: present state zero पर एक flip-flop। इसका characteristic equation inputs से next state की भविष्यवाणी करता है; इसकी excitation table बताती है कि कौन से inputs उस zero को one तक चढ़ाएँगे। वही cell, दो दिशाएँ, तीन tables।",
      visualNote: "Animated explainer: a flip-flop box with a forward arrow (inputs + Qn -> Qn+1, characteristic) and a backward arrow (Qn -> Qn+1 => required inputs, excitation), the four characteristic equations flashing on the box."
    },
    {
      id: "S02_Facts",
      label: "Present State And Next State",
      kind: "theory",
      subtitle: "Qₙ now, Qₙ₊₁ after the edge - and the three dialects that connect them.",
      theoryEN: [
        "Start with the vocabulary, because every later table depends on it. A clocked flip-flop lives in discrete time: it holds a value between clock edges and can only change at an edge. The value it holds right now, at time t, is the present state, written Qₙ. The value it will hold after the next active clock edge, at time t+1, is the next state, written Qₙ₊₁ or Q(t+1). Analysis and synthesis are nothing more than relationships between these two symbols and the flip-flop's inputs.",
        "With that fixed, the three representations line up cleanly. The first is the operating or truth table: it lists, for each input combination, the MODE the flip-flop enters - hold, reset (0), set (1), toggle, or the invalid case for SR. This is the plain-language datasheet view, the one you meet first when you learn a flip-flop.",
        "The second is the characteristic table, and it is the operating table made precise. Instead of a word like 'toggle', it writes the actual next state Qₙ₊₁ as a function of the inputs and the present state Qₙ, one row per combination. Because it maps (inputs, Qₙ) forward to Qₙ₊₁, it is the analysis view, and minimising it in a K-map yields the characteristic equation.",
        "The third is the excitation table, and it runs the other way. It fixes a wanted transition Qₙ → Qₙ₊₁ and asks what inputs are required. There are only four transitions, so it is only four rows, and it is the synthesis view: it is the table you consult when a state diagram tells you which state must follow which, and you need the wiring to enforce it.",
        "The timeline picture keeps it all straight. Draw the present state Qₙ on the left at time t, the clock edge as a rising arrow in the middle, and the next state Qₙ₊₁ on the right at time t+1. The characteristic equation is the machine that computes the right box from the left box and the inputs; the excitation table is the machine that, given both boxes, hands you the inputs. Same edge, read two ways.",
        "One habit will save you every time: before you write any row, decide which direction you are travelling. If you are told the inputs and asked for the result, you are doing analysis and you want the characteristic table. If you are told the result you want and asked for the inputs, you are doing synthesis and you want the excitation table. The whole module is learning to pick the right dialect on sight."
      ],
      theoryHI: [
        "शब्दावली से शुरू कीजिए, क्योंकि आगे की हर table इसी पर टिकी है। एक clocked flip-flop discrete समय में जीता है: यह clock edges के बीच एक मान रखता है और सिर्फ़ edge पर बदल सकता है। अभी, समय t पर, जो मान यह रखता है वह है present state, लिखा Qₙ। अगले active clock edge के बाद, समय t+1 पर, जो मान यह रखेगा वह है next state, लिखा Qₙ₊₁ या Q(t+1)। analysis और synthesis इन्हीं दो चिह्नों और flip-flop के inputs के बीच रिश्तों से ज़्यादा कुछ नहीं।",
        "यह पक्का होते ही तीनों representations साफ़ पंक्ति में आ जाते हैं। पहला है operating या truth table: यह हर input combination के लिए वह MODE बताता है जिसमें flip-flop जाता है - hold, reset (0), set (1), toggle, या SR के लिए invalid स्थिति। यह सादी-भाषा वाला datasheet नज़रिया है, जिससे आप flip-flop सीखते वक़्त सबसे पहले मिलते हैं।",
        "दूसरा है characteristic table, और यह operating table को सटीक बनाकर है। 'toggle' जैसे शब्द के बजाय यह असली next state Qₙ₊₁ को inputs और present state Qₙ के function के रूप में लिखती है, हर combination की एक row। चूँकि यह (inputs, Qₙ) को आगे Qₙ₊₁ पर map करती है, यह analysis नज़रिया है, और इसे K-map में minimise करने से characteristic equation मिलता है।",
        "तीसरा है excitation table, और यह उलटी दिशा में चलती है। यह एक मनचाही transition Qₙ → Qₙ₊₁ तय करती है और पूछती है कि inputs क्या चाहिए। transitions सिर्फ़ चार हैं, तो यह सिर्फ़ चार rows की है, और यह synthesis नज़रिया है: यही वह table है जिसे आप तब देखते हैं जब एक state diagram बताता है कि किस state के बाद कौन सा आना चाहिए, और आपको उसे लागू करने की wiring चाहिए।",
        "timeline की तस्वीर सब कुछ सीधा रखती है। बाएँ समय t पर present state Qₙ, बीच में ऊपर जाते तीर के रूप में clock edge, और दाएँ समय t+1 पर next state Qₙ₊₁ बनाइए। characteristic equation वह मशीन है जो बाएँ box और inputs से दायाँ box निकालती है; excitation table वह मशीन है जो, दोनों box दिए हों, आपको inputs थमाती है। वही edge, दो तरह पढ़ा।",
        "एक आदत हर बार बचाएगी: कोई भी row लिखने से पहले तय कीजिए कि आप किस दिशा में चल रहे हैं। अगर आपको inputs बताए गए हों और नतीजा पूछा गया हो, तो आप analysis कर रहे हैं और आपको characteristic table चाहिए। अगर आपको मनचाहा नतीजा बताया गया हो और inputs पूछे गए हों, तो आप synthesis कर रहे हैं और आपको excitation table चाहिए। पूरा module यही सीखना है कि सही dialect पहली नज़र में चुनें।"
      ],
      transcriptEN: "Start with the vocabulary, because every later table depends on it. A clocked flip-flop lives in discrete time: it holds a value between edges and changes only at an edge. The value it holds now, at time t, is the present state, Q-n. The value after the next edge, at t plus one, is the next state, Q-n-plus-one. Analysis and synthesis are just relationships between these two symbols and the inputs. The three representations line up. The operating or truth table lists, per input combination, the mode: hold, reset, set, toggle, or invalid for SR. The characteristic table makes that precise: instead of the word toggle it writes the actual next state as a function of inputs and present state, and minimising it gives the characteristic equation - the forward, analysis view. The excitation table runs the other way: fix a wanted transition, present to next, and ask what inputs are required; only four transitions, four rows, the synthesis view. Picture a timeline: present state on the left at t, the clock edge in the middle, next state on the right at t plus one. The characteristic equation computes the right box; the excitation table hands you the inputs. Before writing any row, decide your direction: inputs to result is analysis; result to inputs is synthesis.",
      transcriptHI: "शब्दावली से शुरू कीजिए, क्योंकि आगे की हर table इसी पर टिकी है। clocked flip-flop discrete समय में जीता है: edges के बीच मान रखता है, सिर्फ़ edge पर बदलता है। अभी, समय t पर मान है present state, Q-n। अगले edge के बाद, t plus one पर, next state, Q-n-plus-one। analysis और synthesis बस इन दो चिह्नों और inputs के रिश्ते हैं। तीनों representations पंक्ति में आते हैं। operating या truth table हर input combination का mode बताती है: hold, reset, set, toggle, या SR के लिए invalid। characteristic table इसे सटीक बनाती है: toggle शब्द के बजाय असली next state को inputs और present state के function के रूप में लिखती है, और minimise करने पर characteristic equation देती है - forward, analysis नज़रिया। excitation table उलटी चलती है: एक मनचाही transition, present से next, तय कीजिए और पूछिए inputs क्या चाहिए; सिर्फ़ चार transitions, चार rows, synthesis नज़रिया। timeline सोचिए: बाएँ t पर present state, बीच में clock edge, दाएँ t plus one पर next state। characteristic equation दायाँ box निकालती है; excitation table inputs थमाती है। row लिखने से पहले दिशा तय कीजिए: inputs से नतीजा analysis है; नतीजे से inputs synthesis है।",
      visualNote: "A t -> t+1 timeline: present state Qn box, a rising clock edge, next state Qn+1 box; plus a three-card strip labelling the operating, characteristic (forward) and excitation (reverse) dialects."
    },
    {
      id: "S03_Characteristic",
      label: "The Characteristic Table & Equation",
      kind: "theory",
      subtitle: "Forward / analysis: inputs + Qₙ tell you Qₙ₊₁, and a K-map compresses it to one law.",
      theoryEN: [
        "The characteristic table is the flip-flop read forwards. You list every combination of the control inputs together with the present state Qₙ, and in the last column you write the resulting next state Qₙ₊₁. For a two-input flip-flop like SR or JK that is eight rows (four input combinations times two present states, though it is usually condensed to four rows with Qₙ₊₁ written symbolically as 0, 1, Q or Q'); for D or T it is just two.",
        "Read the SR flip-flop's rows as a sentence. With S=0, R=0 the cell holds, so Qₙ₊₁ = Qₙ. With S=0, R=1 it resets, Qₙ₊₁ = 0. With S=1, R=0 it sets, Qₙ₊₁ = 1. With S=1, R=1 the inputs conflict and the state is invalid, marked with an x. That last forbidden square is the whole reason SR is fragile.",
        "Now compress the table into an equation with a Karnaugh map. Plot Qₙ₊₁ against S, R and Qₙ, and treat the S=R=1 squares as don't-cares because we forbid that input. The map folds to the compact law Q(t+1) = S + R'·Q: the cell becomes 1 if you set it (S), or if it was already 1 and you are not resetting it (R'·Q). Each flip-flop has its own such law - JK: Q(t+1) = J·Q' + K'·Q, D: Q(t+1) = D, T: Q(t+1) = T ⊕ Q.",
        "These four characteristic equations ARE the analysis toolkit. Whenever you meet a flip-flop wired into a bigger circuit, you find what its inputs equal in terms of the circuit's signals, drop those expressions into the characteristic equation, and out comes a formula for the next state. That single substitution is the engine of every analysis problem you will do.",
        "Prove any of them to yourself with the live flip-flop beside this text. Pick a type, set the inputs and the present state, and read the predicted Qₙ₊₁ straight from its characteristic equation; then press the clock and watch Q actually move there. The table on the right is generated by the same equation, so the prediction and the hardware can never disagree.",
        "A final reading tip. The symbolic Qₙ₊₁ entries pack the whole behaviour into four glyphs: 0 means reset, 1 means set, Q means hold, and Q' means toggle. Learning to see 'Q' and instantly think 'this row holds', or 'Q'' and think 'this row inverts', is what makes reading a characteristic table fast."
      ],
      theoryHI: [
        "characteristic table flip-flop को आगे की ओर पढ़ना है। आप control inputs और present state Qₙ का हर combination सूचीबद्ध करते हैं, और आख़िरी column में उससे बनने वाला next state Qₙ₊₁ लिखते हैं। SR या JK जैसे दो-input flip-flop के लिए वह आठ rows हैं (चार input combinations गुणा दो present states, हालाँकि आमतौर पर Qₙ₊₁ को 0, 1, Q या Q' के रूप में symbolic लिखकर चार rows में संघनित कर दिया जाता है); D या T के लिए बस दो।",
        "SR flip-flop की rows को एक वाक्य की तरह पढ़िए। S=0, R=0 पर cell hold करता है, तो Qₙ₊₁ = Qₙ। S=0, R=1 पर reset, Qₙ₊₁ = 0। S=1, R=0 पर set, Qₙ₊₁ = 1। S=1, R=1 पर inputs टकराते हैं और state invalid है, x से चिह्नित। वही आख़िरी निषिद्ध खाना ही पूरी वजह है कि SR नाज़ुक है।",
        "अब table को Karnaugh map से equation में संघनित कीजिए। Qₙ₊₁ को S, R और Qₙ के सामने plot कीजिए, और S=R=1 खानों को don't-care मानिए क्योंकि हम वह input मना करते हैं। map सघन नियम Q(t+1) = S + R'·Q में मुड़ जाता है: cell 1 बनता है अगर आप इसे set करें (S), या अगर यह पहले से 1 था और आप reset नहीं कर रहे (R'·Q)। हर flip-flop का अपना ऐसा नियम है - JK: Q(t+1) = J·Q' + K'·Q, D: Q(t+1) = D, T: Q(t+1) = T ⊕ Q।",
        "ये चार characteristic equations ही analysis का औज़ार-थैला हैं। जब भी आप किसी बड़े circuit में wired flip-flop से मिलें, आप निकालते हैं कि इसके inputs circuit के signals के रूप में किसके बराबर हैं, उन expressions को characteristic equation में डालते हैं, और next state का सूत्र निकल आता है। वही एक substitution हर analysis समस्या का इंजन है।",
        "इनमें से किसी को इस text के साथ वाले live flip-flop से ख़ुद साबित कीजिए। एक type चुनिए, inputs और present state set कीजिए, और इसके characteristic equation से सीधे भविष्यवाणी किया Qₙ₊₁ पढ़िए; फिर clock दबाइए और देखिए Q सचमुच वहीं जाता है। दाईं table उसी equation से बनी है, तो भविष्यवाणी और hardware कभी असहमत नहीं हो सकते।",
        "एक आख़िरी पढ़ने की युक्ति। symbolic Qₙ₊₁ entries पूरे बर्ताव को चार चिह्नों में भर देती हैं: 0 मतलब reset, 1 मतलब set, Q मतलब hold, और Q' मतलब toggle। 'Q' देखकर तुरंत 'यह row hold करती है' सोचना, या 'Q'' देखकर 'यह row पलटती है' सोचना ही characteristic table पढ़ना तेज़ बनाता है।"
      ],
      transcriptEN: "The characteristic table is the flip-flop read forwards. List every combination of the inputs with the present state Q-n, and in the last column write the resulting next state Q-n-plus-one. Read the SR rows as a sentence: S zero R zero holds, so next equals present; S zero R one resets to zero; S one R zero sets to one; S one R one is invalid, marked x. Compress with a Karnaugh map, treating the S equals R equals one squares as don't-cares, and it folds to Q-next equals S plus R-prime Q: the cell is one if you set it, or if it was already one and you're not resetting it. Each type has its law: JK is J Q-prime plus K-prime Q, D is D, T is T XOR Q. These four equations are the analysis toolkit: find what the inputs equal in terms of the circuit, substitute into the characteristic equation, and out comes the next state. Prove it with the live flip-flop: pick a type, set the inputs and present state, read the predicted next state from the equation, then press the clock and watch Q move there. And the symbolic entries pack it into four glyphs: zero reset, one set, Q hold, Q-prime toggle.",
      transcriptHI: "characteristic table flip-flop को आगे की ओर पढ़ना है। inputs और present state Q-n का हर combination सूचीबद्ध कीजिए, आख़िरी column में बनने वाला next state Q-n-plus-one लिखिए। SR rows को वाक्य की तरह पढ़िए: S zero R zero hold, तो next बराबर present; S zero R one reset zero; S one R zero set one; S one R one invalid, x से चिह्नित। Karnaugh map से संघनित कीजिए, S बराबर R बराबर one खानों को don't-care मानते हुए, और यह Q-next बराबर S plus R-prime Q में मुड़ता है: cell one है अगर आप set करें, या अगर यह पहले से one था और आप reset नहीं कर रहे। हर type का नियम है: JK है J Q-prime plus K-prime Q, D है D, T है T XOR Q। ये चार equations analysis का औज़ार हैं: निकालिए inputs circuit के रूप में किसके बराबर हैं, characteristic equation में डालिए, next state निकल आता है। live flip-flop से साबित कीजिए: type चुनिए, inputs और present state set कीजिए, equation से भविष्यवाणी किया next state पढ़िए, फिर clock दबाइए और Q को वहीं जाते देखिए। symbolic entries इसे चार चिह्नों में भरती हैं: zero reset, one set, Q hold, Q-prime toggle।",
      visualNote: "A type selector driving the computed CharTable and the FF_META equation, next to the live FlipFlopViz so the predicted Qn+1 and the actual clocked Q always agree."
    },
    {
      id: "S04_Excitation",
      label: "The Excitation Table",
      kind: "theory",
      subtitle: "Reverse / synthesis: name the transition Qₙ → Qₙ₊₁, read off the inputs (x = free choice).",
      theoryEN: [
        "The excitation table is the flip-flop read backwards, and it is the single most useful table for building things. Instead of asking 'what will the next state be', it fixes the transition you want and asks 'what inputs excite it'. There are only four possible transitions of a single bit - 0→0, 0→1, 1→0, 1→1 - so every flip-flop's excitation table is just four rows.",
        "Read the SR column. To hold at 0 (0→0) you need S=0 and R anything, written 0,x. To go 0→1 you must set, S=1,R=0. To go 1→0 you must reset, S=0,R=1. To hold at 1 (1→1) you need R=0 and S anything, x,0. Notice how it is literally the characteristic table solved for the inputs instead of for the next state.",
        "The x entries are don't-cares, and they are the reason JK and SR are the designer's favourites. An x means 'this input may be 0 or 1, the transition happens either way'. The JK table is especially generous: 0→0 is 0,x; 0→1 is 1,x; 1→0 is x,1; 1→1 is x,0 - four of its eight cells are free. D, by contrast, is rigid: Qₙ₊₁=D forces D=0 for the two →0 rows and D=1 for the two →1 rows, with no freedom at all. T sits between: T=0 to hold, T=1 to change.",
        "Those free x's pay off in the Karnaugh map. When you later plot the required input against the state variables to find its equation, each x is a square you may fill with whichever value - 0 or 1 - grows a bigger, simpler group. That extra freedom routinely turns a messy expression into a one-gate input equation, which is exactly why hand-designed counters usually use JK flip-flops.",
        "Try it on the live table beside this text. Pick a flip-flop type and watch its four excitation rows appear, computed straight from the same logic the characteristic table uses - so the forward and reverse views are guaranteed consistent. Count the x's: you will see JK and SR carrying several, D carrying none, and T carrying none, which tells you at a glance how much K-map freedom each type will give you when you build with it.",
        "The mental rule to carry away: the characteristic table answers 'given the inputs, where do I land', while the excitation table answers 'to land there, what inputs do I apply'. Same four flip-flops, same underlying logic, simply solved in the opposite direction - and the second direction is the one you use whenever you are the designer rather than the analyst."
      ],
      theoryHI: [
        "excitation table flip-flop को पीछे की ओर पढ़ना है, और चीज़ें बनाने के लिए यह अकेली सबसे उपयोगी table है। 'next state क्या होगा' पूछने के बजाय यह आपकी मनचाही transition तय करती है और पूछती है 'इसे कौन से inputs भड़काते हैं'। एक अकेले bit की सिर्फ़ चार संभव transitions हैं - 0→0, 0→1, 1→0, 1→1 - तो हर flip-flop की excitation table बस चार rows की है।",
        "SR column पढ़िए। 0 पर hold (0→0) को S=0 और R कुछ भी चाहिए, लिखा 0,x। 0→1 को set करना होगा, S=1,R=0। 1→0 को reset करना होगा, S=0,R=1। 1 पर hold (1→1) को R=0 और S कुछ भी चाहिए, x,0। ग़ौर कीजिए यह शब्दशः characteristic table है जो next state के बजाय inputs के लिए हल की गई है।",
        "x entries don't-cares हैं, और यही वजह है कि JK और SR designer के पसंदीदा हैं। x का मतलब 'यह input 0 या 1 हो सकता है, transition दोनों तरह होती है'। JK table ख़ासकर उदार है: 0→0 है 0,x; 0→1 है 1,x; 1→0 है x,1; 1→1 है x,0 - इसके आठ में से चार cells मुफ़्त हैं। D इसके उलट कठोर है: Qₙ₊₁=D दोनों →0 rows के लिए D=0 और दोनों →1 rows के लिए D=1 मजबूर करता है, कोई आज़ादी नहीं। T बीच में है: hold को T=0, बदलने को T=1।",
        "वे मुफ़्त x Karnaugh map में फल देते हैं। जब आप बाद में required input को state variables के सामने plot करके इसका equation निकालते हैं, हर x एक ऐसा खाना है जिसे आप जो भी मान - 0 या 1 - बड़ा, सरल समूह बनाए, उससे भर सकते हैं। वह अतिरिक्त आज़ादी अक्सर एक उलझे expression को एक-gate input equation में बदल देती है, ठीक इसीलिए हाथ से बने counters आमतौर पर JK flip-flops वापरते हैं।",
        "इस text के साथ वाली live table पर आज़माइए। एक flip-flop type चुनिए और देखिए इसकी चार excitation rows प्रकट होती हैं, उसी logic से सीधे computed जो characteristic table वापरती है - तो forward और reverse नज़रिये पक्के तौर पर संगत हैं। x गिनिए: आप देखेंगे JK और SR कई रखते हैं, D कोई नहीं, और T कोई नहीं, जो एक नज़र में बता देता है कि हर type आपको बनाते वक़्त कितनी K-map आज़ादी देगा।",
        "साथ ले जाने वाला मानसिक नियम: characteristic table जवाब देती है 'inputs दिए हों तो मैं कहाँ पहुँचता हूँ', जबकि excitation table जवाब देती है 'वहाँ पहुँचने को कौन से inputs लगाऊँ'। वही चार flip-flops, वही अंतर्निहित logic, बस उलटी दिशा में हल - और दूसरी दिशा वही है जो आप तब वापरते हैं जब आप analyst नहीं, designer हों।"
      ],
      transcriptEN: "The excitation table is the flip-flop read backwards, the single most useful table for building. Instead of asking what the next state will be, it fixes the transition you want and asks what inputs excite it. Only four transitions of a single bit, so only four rows. Read the SR column: to hold at zero, zero-to-zero, S is zero and R is anything, written zero comma x; to go zero to one you set, S one R zero; one to zero you reset, S zero R one; to hold at one, R zero and S anything, x comma zero. It's the characteristic table solved for the inputs. The x entries are don't-cares, and they're why JK and SR are favourites: an x means either value works. JK is generous, four of eight cells free; D is rigid with none; T sits between, zero to hold, one to change. Those free x's pay off in the Karnaugh map: each is a square you fill with whatever grows a bigger, simpler group, often turning a messy expression into a one-gate input equation, which is why hand-designed counters use JK. Try the live table: pick a type, watch its four rows computed from the same logic as the characteristic table, and count the x's to see how much K-map freedom each gives.",
      transcriptHI: "excitation table flip-flop को पीछे की ओर पढ़ना है, बनाने के लिए अकेली सबसे उपयोगी table। next state क्या होगा पूछने के बजाय यह मनचाही transition तय करती है और पूछती है कौन से inputs इसे भड़काते हैं। एक bit की सिर्फ़ चार transitions, तो सिर्फ़ चार rows। SR column पढ़िए: zero पर hold, zero-to-zero, S zero और R कुछ भी, लिखा zero comma x; zero to one set, S one R zero; one to zero reset, S zero R one; one पर hold, R zero और S कुछ भी, x comma zero। यह characteristic table है जो inputs के लिए हल है। x entries don't-cares हैं, इसीलिए JK और SR पसंदीदा हैं: x मतलब कोई भी मान चलेगा। JK उदार है, आठ में चार cells मुफ़्त; D कठोर, कोई नहीं; T बीच में, hold को zero, बदलने को one। वे मुफ़्त x Karnaugh map में फल देते हैं: हर एक ऐसा खाना जिसे आप बड़ा, सरल समूह बनाने वाले मान से भरते हैं, अक्सर उलझे expression को एक-gate input equation में बदलते हुए, इसीलिए हाथ से बने counters JK वापरते हैं। live table आज़माइए: type चुनिए, इसकी चार rows characteristic table वाली logic से computed देखिए, और x गिनिए कि हर type कितनी K-map आज़ादी देता है।",
      visualNote: "A type selector driving the computed ExciteTable (Qn, Qn+1 -> required inputs), with a live count of the don't-care x cells per type to show why JK/SR minimise best."
    },
    {
      id: "S05_Analysis",
      label: "The Analysis Workflow (Forward)",
      kind: "theory",
      subtitle: "Circuit → FF input equations → characteristic equations → state table → state diagram.",
      theoryEN: [
        "Analysis is the forward journey: you are handed a finished clocked circuit and must discover its behaviour. The workflow is a fixed four-step pipeline, and every step is mechanical once you know the characteristic equations. Do them in order and a wiring diagram turns into a state diagram with no guessing.",
        "Step one, read the input equations off the schematic. For each flip-flop, write its control inputs as Boolean expressions in the circuit's state variables and external inputs. Take a single D flip-flop whose D pin is driven by an XOR of an external input X and the fed-back output Q: the input equation is simply D = X ⊕ Q.",
        "Step two, substitute into the characteristic equation. D's law is Q(t+1) = D, so dropping in the input equation gives the flip-flop's own next-state law, Q(t+1) = X ⊕ Q. For a JK or SR stage you would instead substitute your J,K or S,R expressions into their characteristic equations - the move is identical, only the law changes.",
        "Step three, tabulate the state table. Enumerate every combination of the present state Qₙ and the external inputs, evaluate the next-state law for each, and record Qₙ₊₁. For our example the four rows read: X=0 holds the state (0→0, 1→1) and X=1 flips it (0→1, 1→0). The circuit is a controllable toggle - it inverts on X=1 and remembers on X=0.",
        "Step four, draw the state diagram. Make one node per state, here just two (Q=0 and Q=1), and one arrow per row labelled with the input that causes it. You end with two self-loops labelled X=0 and two crossing arrows labelled X=1 - the picture of a divide-by-two that you can pause with X. The live machine beside this text walks exactly this diagram as you toggle X and tick the clock.",
        "That four-step pipeline - circuit, input equations, characteristic substitution, state table, state diagram - never changes. Whatever the flip-flop mix, analysis is always this same forward march, and the only skill it demands is fluent use of the four characteristic equations you drilled a moment ago."
      ],
      theoryHI: [
        "analysis आगे की यात्रा है: आपको एक बना-बनाया clocked circuit थमाया जाता है और इसका बर्ताव खोजना होता है। workflow एक तय चार-चरण pipeline है, और characteristic equations जानते ही हर चरण यांत्रिक है। इन्हें क्रम में कीजिए और एक wiring diagram बिना अंदाज़े के state diagram बन जाता है।",
        "चरण एक, schematic से input equations पढ़िए। हर flip-flop के लिए, इसके control inputs को circuit के state variables और बाहरी inputs में Boolean expressions के रूप में लिखिए। एक अकेला D flip-flop लीजिए जिसका D pin एक बाहरी input X और feed-back किए output Q के XOR से चलता है: input equation बस D = X ⊕ Q है।",
        "चरण दो, characteristic equation में substitute कीजिए। D का नियम Q(t+1) = D है, तो input equation डालने पर flip-flop का अपना next-state नियम मिलता है, Q(t+1) = X ⊕ Q। JK या SR stage के लिए आप इसके बजाय अपने J,K या S,R expressions को उनके characteristic equations में डालेंगे - चाल वही है, सिर्फ़ नियम बदलता है।",
        "चरण तीन, state table बनाइए। present state Qₙ और बाहरी inputs का हर combination गिनिए, हर के लिए next-state नियम का मान निकालिए, और Qₙ₊₁ दर्ज कीजिए। हमारे उदाहरण की चार rows पढ़ती हैं: X=0 state hold करता है (0→0, 1→1) और X=1 इसे पलटता है (0→1, 1→0)। circuit एक नियंत्रित toggle है - X=1 पर पलटता है और X=0 पर याद रखता है।",
        "चरण चार, state diagram बनाइए। हर state का एक node बनाइए, यहाँ बस दो (Q=0 और Q=1), और हर row का एक तीर उस input से लेबल करके जो इसे कराता है। आप दो self-loops X=0 से और दो पार करते तीर X=1 से लेबल किए के साथ ख़त्म करते हैं - एक divide-by-two की तस्वीर जिसे आप X से रोक सकते हैं। इस text के साथ वाली live machine ठीक इसी diagram पर चलती है जैसे आप X toggle करते और clock tick करते हैं।",
        "वह चार-चरण pipeline - circuit, input equations, characteristic substitution, state table, state diagram - कभी नहीं बदलता। flip-flop का मिश्रण चाहे जो हो, analysis हमेशा यही आगे का कूच है, और इसकी एकमात्र माँग है उन चार characteristic equations का धाराप्रवाह उपयोग जो आपने अभी रटे।"
      ],
      transcriptEN: "Analysis is the forward journey: you're handed a finished clocked circuit and must discover its behaviour, in a fixed four-step pipeline. Step one, read the input equations off the schematic: for each flip-flop write its control inputs as Boolean expressions in the state variables and external inputs. Take a D flip-flop whose D pin is an XOR of an external input X and the fed-back Q: the input equation is D equals X XOR Q. Step two, substitute into the characteristic equation: D's law is Q-next equals D, so Q-next equals X XOR Q. Step three, tabulate the state table: enumerate every present state and input, evaluate, and record the next state. Here X zero holds, X one flips - a controllable toggle. Step four, draw the state diagram: one node per state, two here, one arrow per row labelled with its input; you get two self-loops for X zero and two crossing arrows for X one, a divide-by-two you can pause with X. The pipeline - circuit, input equations, characteristic substitution, state table, state diagram - never changes; the only skill is fluent use of the four characteristic equations.",
      transcriptHI: "analysis आगे की यात्रा है: आपको बना-बनाया clocked circuit थमाया जाता है और बर्ताव खोजना होता है, एक तय चार-चरण pipeline में। चरण एक, schematic से input equations पढ़िए: हर flip-flop के control inputs को state variables और बाहरी inputs में Boolean expressions लिखिए। एक D flip-flop लीजिए जिसका D pin एक बाहरी input X और feed-back Q का XOR है: input equation है D बराबर X XOR Q। चरण दो, characteristic equation में substitute कीजिए: D का नियम Q-next बराबर D, तो Q-next बराबर X XOR Q। चरण तीन, state table बनाइए: हर present state और input गिनिए, मान निकालिए, next state दर्ज कीजिए। यहाँ X zero hold करता है, X one पलटता है - एक नियंत्रित toggle। चरण चार, state diagram बनाइए: हर state का एक node, यहाँ दो, हर row का एक तीर उसके input से लेबल; आपको X zero के दो self-loops और X one के दो पार करते तीर मिलते हैं, एक divide-by-two जिसे X से रोक सकते हैं। pipeline - circuit, input equations, characteristic substitution, state table, state diagram - कभी नहीं बदलता; एकमात्र कौशल चार characteristic equations का धाराप्रवाह उपयोग है।",
      visualNote: "A four-step StepThrough on a D flip-flop with D = X XOR Q: schematic -> input eqn -> characteristic substitution -> computed state table -> a live state diagram (two nodes, self-loops on X=0, crossing arrows on X=1) the student can walk."
    },
    {
      id: "S06_Synthesis",
      label: "The Synthesis Workflow (Reverse)",
      kind: "theory",
      subtitle: "State diagram → transition list → excitation tables → K-maps → circuit.",
      theoryEN: [
        "Synthesis is the reverse journey: you START from the behaviour you want and END with a wired circuit. It uses the excitation table where analysis used the characteristic equation, and its pipeline runs the opposite way. We will design the very machine we just analysed - a toggle you can pause with an input X - so you can watch the loop close.",
        "Step one, state the wanted behaviour as a state diagram. We want two states, Q=0 and Q=1; while X=0 the machine must stay put, and while X=1 it must flip. That is the same two-node picture the analysis produced, only now it is the specification we are given rather than the answer we found.",
        "Step two, list the transitions. Walk every (present state, input) pair and write down the required next state: X=0 gives 0→0 and 1→1, and X=1 gives 0→1 and 1→0. This transition list is the bridge between the diagram and the tables - it is exactly the Qₙ → Qₙ₊₁ column the excitation table needs.",
        "Step three, look up the excitation entries for your chosen flip-flop. Suppose we build with a T flip-flop. From the excitation table, a transition that keeps the state (0→0 or 1→1) needs T=0, and a transition that changes it (0→1 or 1→0) needs T=1. Filling that in against our four rows gives T=0 whenever X=0 and T=1 whenever X=1.",
        "Step four, minimise with a K-map to get the input equation. Plotting the required T against X and Qₙ, the whole X=1 column is 1 and the whole X=0 column is 0, independent of Qₙ, so the map collapses to T = X. (Had we chosen a JK flip-flop, its don't-cares would have let the K-map simplify J and K down to J = K = X in the same way - that is the payoff of the reverse table's x's.)",
        "Step five, draw the circuit: a T flip-flop with its T input wired straight to X, clocked normally. That single connection realises the entire specification. Notice the symmetry with analysis: there we started at a circuit and marched forward to a diagram; here we started at a diagram and marched backward to a circuit, using the excitation table as the reverse of the characteristic equation. Master both directions and you can read any sequential circuit and build any behaviour you can describe."
      ],
      theoryHI: [
        "synthesis उलटी यात्रा है: आप जो बर्ताव चाहते हैं वहाँ से शुरू करते हैं और एक wired circuit पर ख़त्म करते हैं। यह वहाँ excitation table वापरती है जहाँ analysis characteristic equation वापरती थी, और इसका pipeline उलटी दिशा में चलता है। हम ठीक वही machine design करेंगे जिसका हमने अभी विश्लेषण किया - एक toggle जिसे आप input X से रोक सकते हैं - ताकि आप loop को बंद होते देखें।",
        "चरण एक, मनचाहे बर्ताव को state diagram के रूप में बताइए। हमें दो states चाहिए, Q=0 और Q=1; जब X=0 तब machine को टिके रहना है, और जब X=1 तब पलटना है। यह वही दो-node तस्वीर है जो analysis ने बनाई, बस अब यह हमें दी गई specification है, न कि हमारा पाया जवाब।",
        "चरण दो, transitions सूचीबद्ध कीजिए। हर (present state, input) जोड़ी चलिए और ज़रूरी next state लिखिए: X=0 देता है 0→0 और 1→1, और X=1 देता है 0→1 और 1→0। यह transition सूची diagram और tables के बीच पुल है - यह ठीक वही Qₙ → Qₙ₊₁ column है जो excitation table को चाहिए।",
        "चरण तीन, अपने चुने flip-flop के लिए excitation entries देखिए। मान लीजिए हम एक T flip-flop से बनाते हैं। excitation table से, जो transition state रखे (0→0 या 1→1) उसे T=0 चाहिए, और जो इसे बदले (0→1 या 1→0) उसे T=1 चाहिए। इसे हमारी चार rows के सामने भरने पर मिलता है T=0 जब भी X=0 और T=1 जब भी X=1।",
        "चरण चार, input equation पाने को K-map से minimise कीजिए। required T को X और Qₙ के सामने plot करने पर, पूरा X=1 column 1 है और पूरा X=0 column 0 है, Qₙ से स्वतंत्र, तो map T = X में सिमट जाता है। (अगर हमने JK flip-flop चुना होता, तो इसके don't-cares K-map को J और K को उसी तरह J = K = X तक सरल करने देते - यही reverse table के x का फल है।)",
        "चरण पाँच, circuit बनाइए: एक T flip-flop जिसका T input सीधे X से wired, सामान्य रूप से clocked। वह अकेला connection पूरी specification साकार करता है। analysis से समरूपता ग़ौर कीजिए: वहाँ हमने circuit से शुरू किया और आगे diagram तक कूच किया; यहाँ हमने diagram से शुरू किया और पीछे circuit तक कूच किया, excitation table को characteristic equation के उलट के रूप में वापरते हुए। दोनों दिशाओं में महारत पाइए और आप कोई भी sequential circuit पढ़ सकते हैं और कोई भी बर्ताव बना सकते हैं जिसे आप बता सकें।"
      ],
      transcriptEN: "Synthesis is the reverse journey: you start from the behaviour you want and end with a wired circuit, using the excitation table where analysis used the characteristic equation. We'll design the same machine we just analysed - a toggle you can pause with X - to watch the loop close. Step one, state the behaviour as a state diagram: two states, hold while X is zero, flip while X is one. Step two, list the transitions: X zero gives zero-to-zero and one-to-one; X one gives zero-to-one and one-to-zero - exactly the present-to-next column the excitation table needs. Step three, look up the excitation for your chosen flip-flop; with a T flip-flop, keeping the state needs T zero and changing it needs T one, so T is zero when X is zero and one when X is one. Step four, minimise with a K-map: the whole X-one column is one, the X-zero column is zero, independent of Q, so T equals X. With a JK, its don't-cares would simplify J and K to J equals K equals X the same way. Step five, draw the circuit: a T flip-flop with T wired straight to X. That one connection realises the whole specification. Analysis marches a circuit forward to a diagram; synthesis marches a diagram backward to a circuit.",
      transcriptHI: "synthesis उलटी यात्रा है: आप मनचाहे बर्ताव से शुरू करते हैं और wired circuit पर ख़त्म, excitation table वापरते हुए जहाँ analysis characteristic equation वापरती थी। हम वही machine design करेंगे जिसका अभी विश्लेषण किया - एक toggle जिसे X से रोक सकते हैं - ताकि loop बंद होते देखें। चरण एक, बर्ताव को state diagram बताइए: दो states, X zero पर hold, X one पर flip। चरण दो, transitions सूचीबद्ध कीजिए: X zero देता है zero-to-zero और one-to-one; X one देता है zero-to-one और one-to-zero - ठीक वह present-to-next column जो excitation table को चाहिए। चरण तीन, अपने चुने flip-flop की excitation देखिए; T flip-flop से, state रखने को T zero और बदलने को T one, तो T zero है जब X zero और one जब X one। चरण चार, K-map से minimise कीजिए: पूरा X-one column one, X-zero column zero, Q से स्वतंत्र, तो T बराबर X। JK से, इसके don't-cares J और K को उसी तरह J बराबर K बराबर X तक सरल करते। चरण पाँच, circuit बनाइए: एक T flip-flop जिसका T सीधे X से wired। वह एक connection पूरी specification साकार करता है। analysis circuit को आगे diagram तक कूच कराती है; synthesis diagram को पीछे circuit तक।",
      visualNote: "A given state diagram, then a StepThrough: transition list -> T excitation entries -> a computed 2x2 K-map reading T = X -> a T flip-flop schematic with T tied to X, closing the loop with the analysis scene."
    },
    {
      id: "S07_Analogy",
      label: "Four Portraits Of One Person",
      kind: "theory",
      subtitle: "A photo, a bio, a map and a blueprint - different renderings, one underlying element.",
      theoryEN: [
        "Here is the picture to remember the whole module by. Imagine one person, and four very different portraits of them hanging in a gallery: a photograph, a written biography, a map of where they live, and an architect's blueprint of the house they are building. The renderings could not look more different, yet all four describe the same single person. A flip-flop is that person, and its tables are the portraits.",
        "The photograph is the operating or truth table: the quick, plain likeness - 'this input combination puts the cell in hold, that one in reset, that one in set, that one in toggle'. It is how you recognise the flip-flop at a glance, the same way a photo lets you recognise a face.",
        "The biography is the characteristic equation: a few precise sentences that capture the whole life in compressed form. Q(t+1) = J·Q' + K'·Q says everything the JK photograph shows, but as one dense, quotable law you can carry in your pocket and substitute into any larger circuit.",
        "The map is the characteristic table: it lays every (inputs, present state) location out in a grid and marks exactly where each leads next, Qₙ₊₁. Like a street map, it is the forward, 'if I am here and go this way, I arrive there' view - the analyst's portrait.",
        "The blueprint is the excitation table: the builder's drawing that says, for each transition you want to construct, precisely which inputs to install to make it stand. It is the reverse, 'to end up there, lay these inputs' view - the designer's portrait, complete with the don't-care x's that leave a builder freedom in the details.",
        "The lesson under the analogy is exact, not loose: these are not four different flip-flops, they are four renderings of one. Change nothing about the device; only change the question you ask, and a different portrait answers. Learn to glance at any one of them and instantly know which of the four you are looking at, and you will never again confuse analysis with synthesis."
      ],
      theoryHI: [
        "पूरे module को याद रखने की तस्वीर यह है। एक व्यक्ति की कल्पना कीजिए, और एक gallery में टँगे उनके चार बहुत अलग portraits: एक photograph, एक लिखित जीवनी, वे कहाँ रहते हैं उसका एक नक़्शा, और वे जो घर बना रहे हैं उसका एक architect का blueprint। renderings इससे ज़्यादा अलग नहीं दिख सकतीं, फिर भी चारों उसी एक व्यक्ति को बताते हैं। एक flip-flop वही व्यक्ति है, और इसकी tables portraits हैं।",
        "photograph है operating या truth table: झटपट, सादी शक्ल - 'यह input combination cell को hold में डालता है, वह reset में, वह set में, वह toggle में'। यह वह तरीक़ा है जिससे आप flip-flop को एक नज़र में पहचानते हैं, ठीक जैसे एक photo आपको चेहरा पहचानने देता है।",
        "जीवनी है characteristic equation: कुछ सटीक वाक्य जो पूरी ज़िंदगी को संघनित रूप में पकड़ लेते हैं। Q(t+1) = J·Q' + K'·Q वह सब कहता है जो JK का photograph दिखाता है, पर एक सघन, उद्धरण-योग्य नियम के रूप में जिसे आप जेब में रख सकते हैं और किसी भी बड़े circuit में substitute कर सकते हैं।",
        "नक़्शा है characteristic table: यह हर (inputs, present state) जगह को एक grid में बिछाती है और ठीक चिह्नित करती है कि हर एक आगे कहाँ ले जाती है, Qₙ₊₁। एक सड़क-नक़्शे की तरह, यह forward, 'अगर मैं यहाँ हूँ और इस ओर जाऊँ, तो वहाँ पहुँचता हूँ' नज़रिया है - analyst का portrait।",
        "blueprint है excitation table: builder का चित्र जो कहता है, आप जो हर transition बनाना चाहते हैं उसके लिए, ठीक कौन से inputs लगाएँ ताकि यह खड़ी रहे। यह reverse, 'वहाँ पहुँचने को, ये inputs बिछाइए' नज़रिया है - designer का portrait, उन don't-care x के साथ पूरा जो builder को ब्योरों में आज़ादी देते हैं।",
        "analogy के नीचे का सबक़ सटीक है, ढीला नहीं: ये चार अलग flip-flops नहीं, ये एक ही के चार renderings हैं। device के बारे में कुछ मत बदलिए; सिर्फ़ अपना सवाल बदलिए, और एक अलग portrait जवाब देता है। किसी एक पर नज़र डालकर तुरंत जानना सीखिए कि आप चार में से किसे देख रहे हैं, और आप फिर कभी analysis को synthesis से नहीं उलझाएँगे।"
      ],
      transcriptEN: "Here's the picture to remember the module by. Imagine one person and four very different portraits in a gallery: a photograph, a written biography, a map of where they live, and an architect's blueprint of the house they're building. All four describe the same single person. A flip-flop is that person, its tables the portraits. The photograph is the operating or truth table: the quick likeness - this input combination is hold, that one reset, set, toggle. The biography is the characteristic equation: a few precise sentences, Q-next equals J Q-prime plus K-prime Q, the whole life compressed into one quotable law. The map is the characteristic table: every input-and-present-state location gridded out with exactly where each leads next - the forward, analyst's view. The blueprint is the excitation table: the builder's drawing saying, for each transition you want, precisely which inputs to install, complete with don't-care x's that leave freedom in the details - the designer's view. The lesson is exact: these aren't four flip-flops, they're four renderings of one. Change nothing about the device, only the question you ask, and a different portrait answers.",
      transcriptHI: "module को याद रखने की तस्वीर यह है। एक व्यक्ति और एक gallery में उनके चार बहुत अलग portraits सोचिए: एक photograph, एक लिखित जीवनी, वे कहाँ रहते हैं उसका नक़्शा, और वे जो घर बना रहे हैं उसका architect का blueprint। चारों उसी एक व्यक्ति को बताते हैं। एक flip-flop वही व्यक्ति, इसकी tables portraits। photograph है operating या truth table: झटपट शक्ल - यह input combination hold, वह reset, set, toggle। जीवनी है characteristic equation: कुछ सटीक वाक्य, Q-next बराबर J Q-prime plus K-prime Q, पूरी ज़िंदगी एक उद्धरण-योग्य नियम में संघनित। नक़्शा है characteristic table: हर input-और-present-state जगह grid में, ठीक कहाँ आगे ले जाती है - forward, analyst का नज़रिया। blueprint है excitation table: builder का चित्र जो हर मनचाही transition के लिए ठीक कौन से inputs लगाएँ बताता है, उन don't-care x के साथ जो ब्योरों में आज़ादी देते हैं - designer का नज़रिया। सबक़ सटीक है: ये चार flip-flops नहीं, एक के चार renderings हैं। device कुछ मत बदलिए, सिर्फ़ सवाल, और एक अलग portrait जवाब देता है।",
      visualNote: "A gallery of one central figure with four framed portraits - photo (operating table), bio (characteristic equation), map (characteristic table), blueprint (excitation table) - each showing the real computed content for a chosen flip-flop type."
    },
    {
      id: "S08_Build",
      label: "Build It And Read All Three Tables",
      kind: "theory",
      subtitle: "Wire a JK flip-flop and watch its operating, characteristic and excitation tables come alive.",
      theoryEN: [
        "Now stop reading and build the one flip-flop that shows off all three tables at once: the JK. On the workbench you will wire an edge-triggered JK from its characteristic equation Q(t+1) = J·Q' + K'·Q, then drive it by hand and confirm every representation you have learned against real hardware.",
        "First prove the operating table. Set J=0,K=0 and clock it - the state holds. Set J=0,K=1 - it resets to 0. Set J=1,K=0 - it sets to 1. Set J=1,K=1 - it toggles on every tick. Those four modes ARE the truth table you would read off a datasheet, now flashing on gates you wired yourself.",
        "Next confirm the characteristic equation. For any inputs and any present state Q, compute J·Q' + K'·Q on paper, then press the clock and check that Q lands exactly there. Doing this for a few rows is the fastest way to trust the forward, analysis law - the hardware becomes your answer key.",
        "Finally exercise the excitation table in reverse. Decide a transition you want - say drive Q from 0 up to 1 - and use the excitation entry (J=1, K=x) to pick inputs that force it; watch the clock make it happen regardless of what you put on the don't-care K. That single experiment makes the reverse, synthesis view concrete. Open the workbench below and read one flip-flop three ways."
      ],
      theoryHI: [
        "अब पढ़ना रोकिए और वह एक flip-flop बनाइए जो तीनों tables एक साथ दिखाता है: JK। workbench पर आप इसके characteristic equation Q(t+1) = J·Q' + K'·Q से एक edge-triggered JK wire करेंगे, फिर इसे हाथ से चलाकर हर representation को असली hardware के सामने पुष्टि करेंगे।",
        "पहले operating table साबित कीजिए। J=0,K=0 set करके clock कीजिए - state hold करता है। J=0,K=1 - 0 पर reset। J=1,K=0 - 1 पर set। J=1,K=1 - हर tick पर toggle। वे चार modes ही वह truth table हैं जिसे आप datasheet से पढ़ते, अब आपके ख़ुद wire किए gates पर चमकते।",
        "आगे characteristic equation पुष्टि कीजिए। किसी भी inputs और किसी भी present state Q के लिए, काग़ज़ पर J·Q' + K'·Q निकालिए, फिर clock दबाइए और जाँचिए कि Q ठीक वहीं पहुँचता है। कुछ rows के लिए यह करना forward, analysis नियम पर भरोसा करने का सबसे तेज़ रास्ता है - hardware आपकी answer key बन जाता है।",
        "आख़िर में excitation table को उलटा आज़माइए। एक मनचाही transition तय कीजिए - मान लीजिए Q को 0 से 1 तक चढ़ाना - और excitation entry (J=1, K=x) से वे inputs चुनिए जो इसे मजबूर करें; देखिए clock इसे कराता है चाहे don't-care K पर आप जो भी रखें। वही एक प्रयोग reverse, synthesis नज़रिये को ठोस बना देता है। नीचे workbench खोलिए और एक flip-flop को तीन तरह पढ़िए।"
      ],
      transcriptEN: "Now stop reading and build the one flip-flop that shows all three tables at once: the JK. Wire an edge-triggered JK from its characteristic equation Q-next equals J Q-prime plus K-prime Q, then drive it by hand. First prove the operating table: J zero K zero holds, J zero K one resets, J one K zero sets, J one K one toggles every tick - the datasheet's four modes on gates you wired. Next confirm the characteristic equation: for any inputs and present state, compute J Q-prime plus K-prime Q on paper, press the clock, and check Q lands there. Finally exercise the excitation table in reverse: pick a transition, say drive Q from zero to one, use the excitation entry J one K don't-care to force it, and watch it happen regardless of K. Open the workbench and read one flip-flop three ways.",
      transcriptHI: "अब पढ़ना रोकिए और वह एक flip-flop बनाइए जो तीनों tables एक साथ दिखाता है: JK। इसके characteristic equation Q-next बराबर J Q-prime plus K-prime Q से एक edge-triggered JK wire कीजिए, फिर हाथ से चलाइए। पहले operating table साबित कीजिए: J zero K zero hold, J zero K one reset, J one K zero set, J one K one हर tick toggle - datasheet के चार modes आपके wire किए gates पर। आगे characteristic equation पुष्टि कीजिए: किसी भी inputs और present state के लिए, काग़ज़ पर J Q-prime plus K-prime Q निकालिए, clock दबाइए, जाँचिए Q वहीं पहुँचता है। आख़िर में excitation table उलटा आज़माइए: एक transition चुनिए, मान लीजिए Q को zero से one, excitation entry J one K don't-care से मजबूर कीजिए, और देखिए यह होता है चाहे K कुछ भी हो। workbench खोलिए और एक flip-flop को तीन तरह पढ़िए।",
      visualNote: "WorkbenchCTA opening /workbench?tutorial=jk-flipflop, framed as proving the operating, characteristic and excitation tables on one real JK flip-flop."
    },
    {
      id: "S09_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Eight flip-cards to lock in Qₙ vs Qₙ₊₁, the three tables and both workflows.",
      theoryEN: [
        "These eight flip-cards drill the facts that matter most: the three representations and their directions, the meaning of Qₙ versus Qₙ₊₁, the four characteristic equations, the four-row excitation entries for SR and JK, and the exact order of the analysis and synthesis workflows. Cover the back, say the answer out loud, then flip to check.",
        "Give the equation cards extra reps - the four characteristic equations and the SR/JK excitation rows are the ones examiners ask you to reproduce from memory, and they are the raw material of every analysis and synthesis question.",
        "If you keep only one idea, keep this: the characteristic table reads a flip-flop forward (inputs + Qₙ → Qₙ₊₁, for analysis) and the excitation table reads it backward (Qₙ → Qₙ₊₁ ⇒ required inputs, for synthesis) - same cell, opposite directions."
      ],
      theoryHI: [
        "ये आठ flip-cards सबसे ज़रूरी तथ्य रटाते हैं: तीन representations और उनकी दिशाएँ, Qₙ बनाम Qₙ₊₁ का मतलब, चार characteristic equations, SR और JK की चार-row excitation entries, और analysis तथा synthesis workflows का ठीक क्रम। पीछे ढककर जवाब ज़ोर से बोलिए, फिर जाँचने को पलटिए।",
        "equation cards को ज़्यादा दोहराइए - चार characteristic equations और SR/JK excitation rows वही हैं जिन्हें examiner याद से लिखवाते हैं, और ये हर analysis तथा synthesis सवाल का कच्चा माल हैं।",
        "अगर आप सिर्फ़ एक विचार रखें, तो यह: characteristic table flip-flop को आगे पढ़ती है (inputs + Qₙ → Qₙ₊₁, analysis के लिए) और excitation table इसे पीछे पढ़ती है (Qₙ → Qₙ₊₁ ⇒ ज़रूरी inputs, synthesis के लिए) - वही cell, उलटी दिशाएँ।"
      ],
      transcriptEN: "Eight quick flip-cards to set it solid. Front asks, back answers - cover the back, say it aloud, then flip. Give extra reps to the equation cards: the four characteristic equations and the SR and JK excitation rows, the raw material of every analysis and synthesis question. Keep one idea: the characteristic table reads a flip-flop forward, inputs plus present state to next state for analysis, and the excitation table reads it backward, a wanted transition to the required inputs for synthesis - same cell, opposite directions.",
      transcriptHI: "इसे पक्का करने को आठ तेज़ flip-cards। आगे सवाल, पीछे जवाब - पीछे ढककर ज़ोर से बोलिए, फिर पलटिए। equation cards को ज़्यादा दोहराइए: चार characteristic equations और SR तथा JK excitation rows, हर analysis और synthesis सवाल का कच्चा माल। एक विचार रखिए: characteristic table flip-flop को आगे पढ़ती है, inputs plus present state से next state analysis के लिए, और excitation table पीछे पढ़ती है, एक मनचाही transition से ज़रूरी inputs synthesis के लिए - वही cell, उलटी दिशाएँ।",
      visualNote: "Standard bilingual flip deck, eight cards."
    },
    {
      id: "S10_Quiz",
      label: "Quiz Arena",
      kind: "quiz",
      subtitle: "Seven questions - prove you can read a flip-flop forward and backward.",
      theoryEN: [
        "Seven multiple-choice questions now check that the three tables and two workflows have really sunk in. They probe the meaning of the representations and their directions, Qₙ versus Qₙ₊₁, the JK characteristic equation, specific SR and JK excitation entries, and the order of the analysis and synthesis pipelines.",
        "Several questions are look-up questions, not recall: you will be given a transition and asked for the exciting inputs, or given inputs and asked for the next state. Work them by writing the relevant row - do not guess - and check your entry against the characteristic or excitation table.",
        "Aim for full marks, because clearing all seven means you can move fluently in both directions - reading an existing circuit forward and building a wanted behaviour backward - which is exactly the skill the workbench build will put in your hands."
      ],
      theoryHI: [
        "सात bahu-vikalp सवाल अब जाँचते हैं कि तीन tables और दो workflows सचमुच बैठे या नहीं। ये पूछते हैं representations और उनकी दिशाओं का मतलब, Qₙ बनाम Qₙ₊₁, JK characteristic equation, ख़ास SR और JK excitation entries, और analysis तथा synthesis pipelines का क्रम।",
        "कई सवाल look-up हैं, याद नहीं: आपको एक transition देकर exciting inputs पूछे जाएँगे, या inputs देकर next state। इन्हें सम्बंधित row लिखकर कीजिए - अंदाज़ा मत लगाइए - और अपनी entry characteristic या excitation table के सामने जाँचिए।",
        "पूरे अंक का लक्ष्य रखिए, क्योंकि सातों साफ़ करना मतलब आप दोनों दिशाओं में धाराप्रवाह घूम सकते हैं - मौजूदा circuit को आगे पढ़ना और मनचाहे बर्ताव को पीछे बनाना - ठीक वही कौशल जो workbench build आपके हाथ में देगा।"
      ],
      transcriptEN: "Seven questions in the arena. They check the meaning of the three representations and their directions, present state versus next state, the JK characteristic equation, specific SR and JK excitation entries, and the order of the analysis and synthesis pipelines. Several are look-up questions: given a transition, name the exciting inputs; given inputs, name the next state. Work them by writing the relevant row and checking against the characteristic or excitation table. Clear all seven and you can move fluently in both directions - reading a circuit forward and building a behaviour backward.",
      transcriptHI: "Arena में सात सवाल। ये जाँचते हैं तीन representations और उनकी दिशाओं का मतलब, present state बनाम next state, JK characteristic equation, ख़ास SR और JK excitation entries, और analysis तथा synthesis pipelines का क्रम। कई look-up हैं: एक transition देकर exciting inputs बताइए; inputs देकर next state बताइए। इन्हें सम्बंधित row लिखकर और characteristic या excitation table के सामने जाँचकर कीजिए। सातों साफ़ कीजिए और आप दोनों दिशाओं में धाराप्रवाह घूम सकते हैं - circuit को आगे पढ़ना और बर्ताव को पीछे बनाना।",
      visualNote: "Parameterized QuizArena with the seven spec questions."
    },
    {
      id: "S11_Recap",
      label: "Recap & Bank It",
      kind: "recap",
      subtitle: "One cell, three tables, two directions - you can now read a flip-flop forward and backward.",
      theoryEN: [
        "Let us bank the whole thing. A flip-flop is a one-bit memory described in three interchangeable dialects. The operating (truth) table names the mode per input combination; the characteristic table and equation give the next state Qₙ₊₁ from the inputs and the present state Qₙ (the forward, analysis view); and the excitation table gives the inputs required for a wanted transition Qₙ → Qₙ₊₁ (the reverse, synthesis view).",
        "The four characteristic equations are the law and worth carrying everywhere: SR is Q(t+1) = S + R'·Q with S·R = 0, JK is Q(t+1) = J·Q' + K'·Q, D is Q(t+1) = D, and T is Q(t+1) = T ⊕ Q. The excitation table is their inverse, only four rows, and its don't-care x entries - plentiful for SR and JK, absent for D and T - are the freedom that lets a K-map shrink the final input equations.",
        "The two workflows are mirror images. Analysis marches forward: circuit → FF input equations → substitute into the characteristic equations → state table → state diagram. Synthesis marches backward: state diagram → transition list → excitation-table look-up → K-map minimisation → circuit. We ran both on one machine - a toggle you can pause with X - and closed the loop: analysis of a D flip-flop with D = X ⊕ Q, and synthesis of the same behaviour as a T flip-flop with T = X.",
        "Step back and see where this sits on the sequential track. You have learned what a flip-flop remembers, how it is clocked, and now how to describe it three ways and travel both directions between a circuit and its behaviour. That fluency is the foundation for everything that follows - registers, counters and full state machines are just many of these cells wired together, analysed and synthesised with exactly these tables.",
        "The quiet lesson is that there is only one flip-flop, seen from different sides. Pick your direction before you write a row, reach for the characteristic table to read forward and the excitation table to build backward, and no sequential-logic problem will ever again be a wall you cannot climb."
      ],
      theoryHI: [
        "चलिए पूरी बात जमा कर लें। एक flip-flop एक one-bit memory है जिसे तीन आपस में बदले जा सकने वाले dialects में बताया जाता है। operating (truth) table हर input combination का mode बताती है; characteristic table और equation inputs और present state Qₙ से next state Qₙ₊₁ देते हैं (forward, analysis नज़रिया); और excitation table एक मनचाही transition Qₙ → Qₙ₊₁ के लिए ज़रूरी inputs देती है (reverse, synthesis नज़रिया)।",
        "चार characteristic equations नियम हैं और हर जगह साथ ले जाने लायक़: SR है Q(t+1) = S + R'·Q, S·R = 0 के साथ, JK है Q(t+1) = J·Q' + K'·Q, D है Q(t+1) = D, और T है Q(t+1) = T ⊕ Q। excitation table इनका उलट है, सिर्फ़ चार rows, और इसकी don't-care x entries - SR और JK के लिए भरपूर, D और T के लिए ग़ैरहाज़िर - वह आज़ादी हैं जो K-map को final input equations छोटा करने देती हैं।",
        "दोनों workflows दर्पण-प्रतिबिंब हैं। analysis आगे कूच करती है: circuit → FF input equations → characteristic equations में substitute → state table → state diagram। synthesis पीछे कूच करती है: state diagram → transition सूची → excitation-table look-up → K-map minimisation → circuit। हमने दोनों एक machine पर चलाए - एक toggle जिसे X से रोक सकते हैं - और loop बंद किया: D = X ⊕ Q वाले D flip-flop का analysis, और उसी बर्ताव का T = X वाले T flip-flop के रूप में synthesis।",
        "पीछे हटकर देखिए यह sequential track पर कहाँ बैठता है। आपने सीखा कि flip-flop क्या याद रखता है, यह कैसे clocked है, और अब इसे तीन तरह बताना और circuit तथा इसके बर्ताव के बीच दोनों दिशाओं में यात्रा करना। वह धाराप्रवाहता आगे आने वाली हर चीज़ की नींव है - registers, counters और पूरी state machines बस इन्हीं cells के कई आपस में wired, इन्हीं tables से analyse और synthesise किए हैं।",
        "चुपचाप सबक़ यह है कि सिर्फ़ एक flip-flop है, अलग-अलग तरफ़ से देखा। row लिखने से पहले अपनी दिशा चुनिए, आगे पढ़ने को characteristic table और पीछे बनाने को excitation table उठाइए, और कोई sequential-logic समस्या फिर कभी ऐसी दीवार नहीं होगी जिस पर आप न चढ़ सकें।"
      ],
      transcriptEN: "Let's bank the whole thing. A flip-flop is a one-bit memory described in three interchangeable dialects: the operating table names the mode per input combination; the characteristic table and equation give the next state from the inputs and present state, the forward, analysis view; the excitation table gives the inputs required for a wanted transition, the reverse, synthesis view. The four characteristic equations are the law: SR is S plus R-prime Q with S dot R zero, JK is J Q-prime plus K-prime Q, D is D, T is T XOR Q. The excitation table is their inverse, four rows, and its don't-care x entries - plentiful for SR and JK, absent for D and T - are the freedom a K-map uses to shrink the input equations. The two workflows mirror each other: analysis marches circuit, input equations, characteristic substitution, state table, state diagram; synthesis marches state diagram, transition list, excitation look-up, K-map, circuit. We ran both on one machine, a toggle you pause with X, closing the loop: a D flip-flop with D equals X XOR Q, and the same behaviour as a T flip-flop with T equals X. Registers, counters and state machines are just many of these cells, analysed and synthesised with exactly these tables.",
      transcriptHI: "चलिए पूरी बात जमा कर लें। एक flip-flop एक one-bit memory है जिसे तीन आपस में बदले जा सकने वाले dialects में बताया जाता है: operating table हर input combination का mode बताती है; characteristic table और equation inputs और present state से next state देते हैं, forward, analysis नज़रिया; excitation table एक मनचाही transition के लिए ज़रूरी inputs देती है, reverse, synthesis नज़रिया। चार characteristic equations नियम हैं: SR है S plus R-prime Q, S dot R zero के साथ, JK है J Q-prime plus K-prime Q, D है D, T है T XOR Q। excitation table इनका उलट है, चार rows, और इसकी don't-care x entries - SR और JK के लिए भरपूर, D और T के लिए ग़ैरहाज़िर - वह आज़ादी हैं जो K-map input equations छोटा करने को वापरता है। दोनों workflows एक-दूसरे का दर्पण हैं: analysis कूच करती है circuit, input equations, characteristic substitution, state table, state diagram; synthesis कूच करती है state diagram, transition सूची, excitation look-up, K-map, circuit। हमने दोनों एक machine पर चलाए, एक toggle जिसे X से रोकते हैं, loop बंद करते: D बराबर X XOR Q वाला D flip-flop, और उसी बर्ताव का T बराबर X वाला T flip-flop। registers, counters और state machines बस इन्हीं cells के कई, इन्हीं tables से analyse और synthesise किए।",
      visualNote: "Recap ribbon: operating -> characteristic (forward) -> excitation (reverse); the four characteristic equations, the four-row excitation table, and the two mirrored workflows closing on the X-toggle machine."
    }
  ],
  flashcards: [
    {
      frontEN: "What are the three standard representations of a flip-flop, and the direction each serves?",
      backEN: "Operating/truth table (mode per input combo); characteristic table & equation (inputs + Qn -> next Qn+1, the forward / analysis view); excitation table (Qn -> Qn+1 => required inputs, the reverse / synthesis view).",
      frontHI: "एक flip-flop के तीन मानक representations क्या हैं, और हर एक किस दिशा में काम आता है?",
      backHI: "Operating/truth table (हर input combo का mode); characteristic table और equation (inputs + Qn -> next Qn+1, forward / analysis नज़रिया); excitation table (Qn -> Qn+1 => ज़रूरी inputs, reverse / synthesis नज़रिया)।"
    },
    {
      frontEN: "What do Qₙ and Qₙ₊₁ mean?",
      backEN: "Qn is the PRESENT state - the bit stored right now at time t. Qn+1 (Q(t+1)) is the NEXT state - the bit the flip-flop will hold after the next active clock edge, at time t+1.",
      frontHI: "Qₙ और Qₙ₊₁ का क्या मतलब है?",
      backHI: "Qn है PRESENT state - अभी समय t पर जमा bit। Qn+1 (Q(t+1)) है NEXT state - अगले active clock edge के बाद, समय t+1 पर, जो bit flip-flop रखेगा।"
    },
    {
      frontEN: "What is a characteristic table, and how do you get the characteristic equation?",
      backEN: "It lists the next state Qn+1 for every combination of the inputs and the present state Qn (the FF read forward). Minimising that table in a Karnaugh map gives the characteristic equation.",
      frontHI: "characteristic table क्या है, और characteristic equation कैसे मिलता है?",
      backHI: "यह inputs और present state Qn के हर combination के लिए next state Qn+1 बताती है (FF आगे की ओर पढ़ा)। उस table को Karnaugh map में minimise करने से characteristic equation मिलता है।"
    },
    {
      frontEN: "State the four characteristic equations.",
      backEN: "SR: Q(t+1) = S + R'·Q  (with S·R = 0);  JK: Q(t+1) = J·Q' + K'·Q;  D: Q(t+1) = D;  T: Q(t+1) = T ⊕ Q.",
      frontHI: "चारों characteristic equations बताइए।",
      backHI: "SR: Q(t+1) = S + R'·Q  (S·R = 0 के साथ);  JK: Q(t+1) = J·Q' + K'·Q;  D: Q(t+1) = D;  T: Q(t+1) = T ⊕ Q।"
    },
    {
      frontEN: "What is an excitation table, and what does an x entry mean?",
      backEN: "For each transition Qn -> Qn+1 it gives the inputs required to force it (the FF read backward, for synthesis). An x is a don't-care: that input may be 0 or 1, so a K-map can use it to simplify the input equation.",
      frontHI: "excitation table क्या है, और x entry का क्या मतलब है?",
      backHI: "हर transition Qn -> Qn+1 के लिए यह उसे मजबूर करने को ज़रूरी inputs देती है (FF पीछे की ओर पढ़ा, synthesis के लिए)। x एक don't-care है: वह input 0 या 1 हो सकता है, तो K-map इसे input equation सरल करने को वापर सकता है।"
    },
    {
      frontEN: "Give the SR and JK excitation entries for all four transitions.",
      backEN: "SR (S,R): 0→0 = 0,x · 0→1 = 1,0 · 1→0 = 0,1 · 1→1 = x,0.  JK (J,K): 0→0 = 0,x · 0→1 = 1,x · 1→0 = x,1 · 1→1 = x,0.",
      frontHI: "चारों transitions के लिए SR और JK की excitation entries दीजिए।",
      backHI: "SR (S,R): 0→0 = 0,x · 0→1 = 1,0 · 1→0 = 0,1 · 1→1 = x,0.  JK (J,K): 0→0 = 0,x · 0→1 = 1,x · 1→0 = x,1 · 1→1 = x,0।"
    },
    {
      frontEN: "List the analysis (forward) workflow in order.",
      backEN: "Circuit → write each FF's input equations → substitute into its characteristic equation → build the state table → draw the state diagram.",
      frontHI: "analysis (forward) workflow क्रम में बताइए।",
      backHI: "Circuit → हर FF के input equations लिखिए → इसके characteristic equation में substitute कीजिए → state table बनाइए → state diagram बनाइए।"
    },
    {
      frontEN: "List the synthesis (reverse) workflow in order.",
      backEN: "State diagram → list the transitions → look up the chosen FF's excitation entries → minimise with K-maps to get the input equations → draw the circuit.",
      frontHI: "synthesis (reverse) workflow क्रम में बताइए।",
      backHI: "State diagram → transitions सूचीबद्ध कीजिए → चुने FF की excitation entries देखिए → input equations पाने को K-maps से minimise कीजिए → circuit बनाइए।"
    }
  ],
  quiz: [
    {
      questionEN: "Which statement correctly names the three flip-flop representations and their design direction?",
      options: [
        "Timing, state and Karnaugh diagrams, all used for analysis",
        "Operating/truth table; characteristic table & equation (analysis, forward); excitation table (synthesis, reverse)",
        "SR, JK and T tables, one per flip-flop type",
        "Input, output and clock tables, all used for synthesis"
      ],
      answerIndex: 1,
      explainEN: "The three dialects are the operating/truth table, the characteristic table/equation (forward, for analysis: inputs + Qn -> Qn+1), and the excitation table (reverse, for synthesis: Qn -> Qn+1 => inputs).",
      explainHI: "तीन dialect हैं operating/truth table, characteristic table/equation (forward, analysis के लिए: inputs + Qn -> Qn+1), और excitation table (reverse, synthesis के लिए: Qn -> Qn+1 => inputs)।",
      questionHI: "कौन सा कथन तीन flip-flop representations और उनकी design दिशा को सही बताता है?"
    },
    {
      questionEN: "In sequential notation, what do Qₙ and Qₙ₊₁ represent?",
      options: [
        "Qn is the output of flip-flop number n; Qn+1 is the next flip-flop in the chain",
        "Qn is the present state at time t; Qn+1 is the next state after the clock edge, at time t+1",
        "Qn is the input and Qn+1 is the output of the same flip-flop",
        "They are the same signal measured at two different pins"
      ],
      answerIndex: 1,
      explainEN: "Qn is the present (current) state at time t; Qn+1 = Q(t+1) is the next state the cell takes after the next active clock edge.",
      explainHI: "Qn समय t पर present (मौजूदा) state है; Qn+1 = Q(t+1) वह next state है जो cell अगले active clock edge के बाद लेता है।",
      questionHI: "sequential notation में, Qₙ और Qₙ₊₁ क्या दर्शाते हैं?"
    },
    {
      questionEN: "What is the characteristic equation of a JK flip-flop?",
      options: [
        "Q(t+1) = D",
        "Q(t+1) = S + R'·Q",
        "Q(t+1) = J·Q' + K'·Q",
        "Q(t+1) = T ⊕ Q"
      ],
      answerIndex: 2,
      explainEN: "The JK characteristic equation is Q(t+1) = J·Q' + K'·Q: the cell becomes 1 if J sets it while it was 0, or if K is 0 while it was already 1.",
      explainHI: "JK characteristic equation है Q(t+1) = J·Q' + K'·Q: cell 1 बनता है अगर J इसे तब set करे जब यह 0 था, या अगर K 0 हो जबकि यह पहले से 1 था।",
      questionHI: "एक JK flip-flop का characteristic equation क्या है?"
    },
    {
      questionEN: "For an SR flip-flop, which inputs (S,R) are required for the transition Qₙ → Qₙ₊₁ of 1 → 1?",
      options: ["0, 1", "1, 0", "x, 0", "0, x"],
      answerIndex: 2,
      explainEN: "To hold at 1 you must not reset, so R = 0, while S is free: the excitation entry is S,R = x,0.",
      explainHI: "1 पर hold को reset नहीं करना है, तो R = 0, जबकि S मुक्त है: excitation entry है S,R = x,0।",
      questionHI: "एक SR flip-flop के लिए, transition Qₙ → Qₙ₊₁ के 1 → 1 के लिए कौन से inputs (S,R) चाहिए?"
    },
    {
      questionEN: "For a JK flip-flop, which inputs (J,K) drive the transition 0 → 1?",
      options: ["1, x", "0, x", "x, 1", "1, 0"],
      answerIndex: 0,
      explainEN: "To go 0 → 1 you must set, so J = 1, while K is a don't-care: the excitation entry is J,K = 1,x.",
      explainHI: "0 → 1 जाने को set करना है, तो J = 1, जबकि K एक don't-care है: excitation entry है J,K = 1,x।",
      questionHI: "एक JK flip-flop के लिए, transition 0 → 1 को कौन से inputs (J,K) चलाते हैं?"
    },
    {
      questionEN: "Which sequence is the correct forward (analysis) workflow?",
      options: [
        "State diagram → excitation tables → K-maps → circuit",
        "Circuit → FF input equations → characteristic equations → state table/diagram",
        "Truth table → sum-of-products → gate network",
        "Excitation table → characteristic table → state diagram"
      ],
      answerIndex: 1,
      explainEN: "Analysis goes forward: read the FF input equations off the circuit, substitute into the characteristic equations, tabulate the state table, then draw the state diagram.",
      explainHI: "Analysis आगे जाती है: circuit से FF input equations पढ़िए, characteristic equations में substitute कीजिए, state table बनाइए, फिर state diagram बनाइए।",
      questionHI: "कौन सा क्रम सही forward (analysis) workflow है?"
    },
    {
      questionEN: "Why are the don't-care (x) entries in the SR and JK excitation tables valuable during synthesis?",
      options: [
        "They make the flip-flop switch faster",
        "They mean the transition is impossible and can be skipped",
        "They can be read as 0 or 1 in a K-map, giving simpler minimised input equations",
        "They force the output to a fixed constant value"
      ],
      answerIndex: 2,
      explainEN: "A don't-care may be taken as 0 or 1, so a K-map picks whichever value grows a larger group - yielding a simpler input equation. This is why JK/SR designs minimise best.",
      explainHI: "एक don't-care को 0 या 1 माना जा सकता है, तो K-map वह मान चुनता है जो बड़ा समूह बनाए - सरल input equation देते हुए। इसीलिए JK/SR designs सबसे अच्छे minimise होते हैं।",
      questionHI: "SR और JK excitation tables में don't-care (x) entries synthesis के दौरान क्यों मूल्यवान हैं?"
    }
  ]
};
