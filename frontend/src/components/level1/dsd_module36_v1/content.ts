import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/36 - Synchronous Counters, "One Clock, Every Flip-Flop" (Sequential Logic
 * track). A synchronous counter is the fix for the ripple counter's two flaws:
 * every flip-flop shares ONE common clock, so all of them see the same edge at
 * the same instant and update together - no rippling trigger, no accumulating
 * delay, no transient decoding glitch. The price is a little combinational
 * next-state logic (a handful of AND gates) between the stages, because the
 * flip-flops no longer clock each other. The design procedure is mechanical: (1)
 * write the count table present -> next; (2) for each flip-flop read the required
 * excitation - with a T flip-flop, T_i = 1 exactly when bit i toggles between
 * present and next; (3) simplify each T_i as a function of the current count
 * bits; (4) realise with gates. For a 3-bit binary up counter the classic result
 * is T0 = 1, T1 = Q0, T2 = Q0·Q1 - each bit toggles only when every lower bit is
 * 1. Down-counting flips that rule to "every lower bit is 0" (feed Q'); a MOD-N
 * counter detects the terminal count and synchronously clears or loads to
 * truncate the sequence; and combinational gates on the outputs decode specific
 * states into one-hot / timing signals. Central analogy: a marching band all
 * stepping on the same drumbeat (one clock, everyone together) versus a line of
 * dominoes (the ripple counter, each toppling the next).
 */
export const CONTENT: SubContent = {
  moduleTitle: "Synchronous Counters - One Clock, Every Flip-Flop",
  moduleSubtitle: "Every flip-flop shares a single clock edge, so all bits update together - no ripple and no accumulating delay. A little next-state logic decides who toggles.",
  scenes: [
    {
      id: "S00_Cover",
      label: "One Clock, Every Flip-Flop",
      kind: "cover",
      subtitle: "One clock wired to every stage at once, a few AND gates deciding who flips, and a count that steps in perfect lockstep.",
      theoryEN: [
        "A synchronous counter walks through the same binary sequence as a ripple counter, but it fixes the ripple counter's two weaknesses at a stroke: every single flip-flop is wired to ONE common clock, so all of them see the same edge at the same instant and change together.",
        "Because the flip-flops no longer clock each other, a little combinational logic - usually just a few AND gates - has to sit between the stages to decide which flip-flops should toggle on the next edge. That next-state logic is the whole difference between a ripple counter and a synchronous one.",
        "The payoff is speed and cleanliness. There is no trigger rippling down a chain, so the worst-case delay is just one flip-flop delay plus one gate delay - it does not grow with the number of bits - and there are no transient wrong values to glitch a decoder.",
        "Every flip-flop here is usually a T (toggle) flip-flop. The design job is to work out, for each bit, the exact condition under which it must toggle, and to build that condition with gates. For a binary up counter the rule is beautifully simple: a bit toggles only when every lower bit is 1.",
        "By the end you will contrast ripple versus synchronous, run the four-step design procedure to derive T0 = 1, T1 = Q0, T2 = Q0·Q1 for a 3-bit up counter, reverse it to count down, truncate it into a MOD-N counter, decode its states with gates, and then build one for real on the workbench."
      ],
      theoryHI: [
        "Synchronous counter उसी binary sequence में चलता है जैसे ripple counter, पर यह ripple counter की दो कमज़ोरियाँ एक ही झटके में ठीक कर देता है: हर एक flip-flop एक ही common clock से जुड़ा है, तो सब एक ही पल में एक ही edge देखते हैं और एक साथ बदलते हैं।",
        "चूँकि flip-flops अब एक-दूसरे को clock नहीं करते, थोड़ी combinational logic - आमतौर पर बस कुछ AND gates - stages के बीच बैठनी पड़ती है जो तय करे कि अगले edge पर कौन से flip-flops toggle करें। वही next-state logic ripple और synchronous counter के बीच पूरा फ़र्क़ है।",
        "फ़ायदा है speed और सफ़ाई। कोई trigger chain में ripple नहीं करता, तो worst-case delay बस एक flip-flop delay जमा एक gate delay है - यह bits की संख्या के साथ नहीं बढ़ता - और कोई transient ग़लत मान नहीं जो किसी decoder को glitch करे।",
        "यहाँ हर flip-flop आमतौर पर एक T (toggle) flip-flop है। design का काम है हर bit के लिए वह ठीक शर्त निकालना जिसमें उसे toggle करना है, और उस शर्त को gates से बनाना। एक binary up counter के लिए नियम बेहद सरल है: एक bit तभी toggle करता है जब उसके नीचे का हर bit 1 हो।",
        "अंत तक आप ripple बनाम synchronous की तुलना करेंगे, एक 3-bit up counter के लिए T0 = 1, T1 = Q0, T2 = Q0·Q1 निकालने की चार-कदम design procedure चलाएँगे, इसे उलटकर down गिनेंगे, इसे MOD-N counter में truncate करेंगे, इसके states को gates से decode करेंगे, और फिर workbench पर असली में एक बनाएँगे।"
      ],
      transcriptEN: "Welcome to synchronous counters. A synchronous counter counts through the same binary sequence as a ripple counter, but it fixes both of the ripple counter's flaws at once: every flip-flop shares one common clock, so they all see the same edge at the same instant and update together. Because the flip-flops no longer clock each other, a little combinational logic - usually a few AND gates - sits between the stages to decide which flip-flops toggle on the next edge. That's the whole cost, and in return you get speed and cleanliness: no trigger ripples down a chain, so the worst-case delay is just one flip-flop delay plus one gate delay, no matter how many bits, and there are no transient wrong values to glitch a decoder. Each flip-flop is usually a T flip-flop, and the design job is to find, for each bit, the exact condition under which it must toggle. For a binary up counter that rule is simple: a bit toggles only when every lower bit is one. By the end you'll contrast ripple with synchronous, derive T-zero equals one, T-one equals Q-zero, T-two equals Q-zero AND Q-one, reverse it to count down, truncate it into a mod-N counter, decode its states, and build one for real.",
      transcriptHI: "Synchronous counters में आपका स्वागत है। Synchronous counter उसी binary sequence में गिनता है जैसे ripple counter, पर यह ripple counter के दोनों दोष एक साथ ठीक करता है: हर flip-flop एक common clock बाँटता है, तो सब एक ही पल में एक ही edge देखते हैं और एक साथ update होते हैं। चूँकि flip-flops अब एक-दूसरे को clock नहीं करते, थोड़ी combinational logic - आमतौर पर कुछ AND gates - stages के बीच बैठती है जो तय करे अगले edge पर कौन toggle करे। यही पूरी क़ीमत है, और बदले में मिलती है speed और सफ़ाई: कोई trigger chain में ripple नहीं करता, तो worst-case delay बस एक flip-flop delay जमा एक gate delay है, bits चाहे जितने हों, और कोई transient ग़लत मान नहीं जो decoder को glitch करे। हर flip-flop आमतौर पर एक T flip-flop है, और design का काम है हर bit के लिए वह शर्त निकालना जिसमें उसे toggle करना है। binary up counter के लिए नियम सरल है: एक bit तभी toggle करता है जब उसके नीचे का हर bit एक हो। अंत तक आप ripple और synchronous की तुलना करेंगे, T-zero बराबर एक, T-one बराबर Q-zero, T-two बराबर Q-zero AND Q-one निकालेंगे, इसे उलटकर down गिनेंगे, MOD-N में truncate करेंगे, states decode करेंगे, और असली में एक बनाएँगे।",
      visualNote: "Hero: a live 3-bit synchronous counter (CounterViz mode=sync) whose three bits all flip on the very same clock edge, in lockstep - no stagger."
    },
    {
      id: "S01_Video",
      label: "Synchronous Counters, In Lockstep",
      kind: "video",
      subtitle: "A short film: one clock to every flip-flop, and gates that decide who toggles.",
      theoryEN: [
        "Here is the whole idea in one breath before you watch. A synchronous counter ties every flip-flop's clock to the same wire, so all the flip-flops are triggered by the same edge at the same time - nothing ripples, everything moves at once.",
        "Because the stages are no longer chained clock-to-clock, they cannot toggle themselves in order. Instead, combinational logic reads the current count and drives each flip-flop's toggle input, telling it whether to flip on the coming edge.",
        "For a binary up counter that logic is tiny. A given bit needs to toggle exactly when all the bits below it are 1 - that is the moment a carry reaches it. So T0 is always 1, T1 = Q0, and T2 = Q0·Q1: each toggle input is just the AND of the lower bits.",
        "The reward is that the counter's speed no longer falls apart as it grows. All flip-flops settle within one clock-to-Q delay plus one gate delay, so the top clock frequency is set by a single stage, not by the whole chain, and the outputs step cleanly with no illegal in-between states.",
        "Keep one running example in mind for the whole module: a 3-bit synchronous up counter with bits Q2 Q1 Q0, all clocked together, with T0 = 1, T1 = Q0, T2 = Q0·Q1. It counts 000, 001, 010, 011, 100, 101, 110, 111, then wraps to 000 - every step landing on a single edge."
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार एक साँस में। Synchronous counter हर flip-flop के clock को एक ही wire से बाँध देता है, तो सब flip-flops एक ही edge से एक ही समय trigger होते हैं - कुछ ripple नहीं करता, सब एक साथ चलता है।",
        "चूँकि stages अब clock-से-clock जुड़े नहीं हैं, वे ख़ुद को क्रम में toggle नहीं कर सकते। इसके बजाय combinational logic मौजूदा count पढ़ती है और हर flip-flop के toggle input को चलाती है, बताते हुए कि आने वाले edge पर पलटना है या नहीं।",
        "एक binary up counter के लिए वह logic नन्ही है। किसी bit को ठीक तब toggle करना है जब उसके नीचे के सारे bits 1 हों - वही पल है जब carry उस तक पहुँचता है। तो T0 हमेशा 1, T1 = Q0, और T2 = Q0·Q1: हर toggle input बस नीचे के bits का AND है।",
        "इनाम यह है कि counter की speed बढ़ने पर बिखरती नहीं। सारे flip-flops एक clock-to-Q delay जमा एक gate delay में settle हो जाते हैं, तो top clock frequency एक अकेले stage से तय होती है, पूरी chain से नहीं, और outputs साफ़-साफ़ क़दम रखते हैं, कोई अवैध बीच-की states नहीं।",
        "पूरे module के लिए एक उदाहरण मन में रखिए: एक 3-bit synchronous up counter जिसके bits Q2 Q1 Q0 हैं, सब एक साथ clock होते, T0 = 1, T1 = Q0, T2 = Q0·Q1 के साथ। यह 000, 001, 010, 011, 100, 101, 110, 111 गिनता है, फिर 000 पर wrap - हर क़दम एक ही edge पर उतरता।"
      ],
      transcriptEN: "Here's the whole idea in one breath. A synchronous counter ties every flip-flop's clock to the same wire, so all flip-flops are triggered by the same edge at the same time - nothing ripples, everything moves at once. Because the stages are no longer chained clock to clock, they can't toggle themselves in order, so combinational logic reads the current count and drives each flip-flop's toggle input, telling it whether to flip on the coming edge. For a binary up counter that logic is tiny: a bit needs to toggle exactly when all the bits below it are one - the moment a carry reaches it - so T-zero is always one, T-one equals Q-zero, and T-two equals Q-zero AND Q-one. Each toggle input is just the AND of the lower bits. The reward is that the counter's speed no longer collapses as it grows: all flip-flops settle within one clock-to-Q delay plus one gate delay, so the top frequency is set by a single stage, not the whole chain, and the outputs step cleanly with no illegal in-between states. Keep one example in mind: a three-bit synchronous up counter, all bits clocked together, T-zero one, T-one Q-zero, T-two Q-zero-and-Q-one, counting zero through seven and wrapping, every step on a single edge.",
      transcriptHI: "पूरा विचार एक साँस में। Synchronous counter हर flip-flop के clock को एक ही wire से बाँधता है, तो सब flip-flops एक ही edge से एक ही समय trigger होते हैं - कुछ ripple नहीं करता, सब एक साथ चलता है। चूँकि stages अब clock-से-clock जुड़े नहीं, वे ख़ुद को क्रम में toggle नहीं कर सकते, तो combinational logic मौजूदा count पढ़ती है और हर flip-flop के toggle input को चलाती है, बताते हुए आने वाले edge पर पलटना है या नहीं। एक binary up counter के लिए वह logic नन्ही है: एक bit को ठीक तब toggle करना है जब उसके नीचे के सारे bits एक हों - वही पल जब carry उस तक पहुँचे - तो T-zero हमेशा एक, T-one बराबर Q-zero, और T-two बराबर Q-zero AND Q-one। हर toggle input बस नीचे के bits का AND है। इनाम: counter की speed बढ़ने पर ढहती नहीं: सारे flip-flops एक clock-to-Q delay जमा एक gate delay में settle होते हैं, तो top frequency एक stage से तय होती है, पूरी chain से नहीं, और outputs साफ़ क़दम रखते हैं। एक उदाहरण मन में रखिए: एक three-bit synchronous up counter, सब bits एक साथ clock, T-zero एक, T-one Q-zero, T-two Q-zero-and-Q-one, zero से seven गिनते और wrap करते, हर क़दम एक ही edge पर।",
      visualNote: "Animated explainer: three T flip-flops in a row sharing one clock bus; AND gates feed T1 from Q0 and T2 from Q0 AND Q1; all three outputs flip together on one edge."
    },
    {
      id: "S02_Facts",
      label: "What Makes A Counter Synchronous",
      kind: "theory",
      subtitle: "One shared clock to every flip-flop; next-state logic feeds each toggle input; all edges land at once.",
      theoryEN: [
        "Let us pin down exactly what makes a counter synchronous, because the word carries the whole design. In a ripple counter only the first flip-flop hears the external clock and each later stage is clocked by the one before it. In a synchronous counter that chaining is gone: a single common clock line runs to the clock input of every flip-flop at once, so all of them are triggered by the very same edge at the very same instant.",
        "That one wiring change has an immediate consequence. Since the flip-flops are no longer clocking each other, they can no longer take turns toggling in sequence. Something else has to decide, before each clock edge, which flip-flops should flip and which should hold. That job falls to a block of combinational logic - the next-state logic - that reads the current count on the Q outputs and drives each flip-flop's control inputs accordingly.",
        "With T (toggle) flip-flops the next-state logic is a set of toggle conditions, one per bit. Each flip-flop's T input is a Boolean function of the current outputs that is 1 exactly when that bit must change on the coming edge. For a binary up counter, bit i must toggle precisely when a carry reaches it - that is, when every bit below it is currently 1 - so T0 = 1, T1 = Q0, and T2 = Q0·Q1. Those AND gates are the entire extra hardware.",
        "Now the key behavioural fact: because the clock reaches all stages simultaneously, every flip-flop that is told to toggle does so on the same edge, so the whole output word changes together in one step. There is no trigger walking down a chain and no stage waiting for the one below it - the update is parallel, not serial.",
        "That parallel update is why synchronous counters are the default in real designs. The outputs step directly from one legal count to the next with no transient in-between values, so their outputs are safe to decode at full speed, and the maximum clock rate is set by a single flip-flop plus its gates rather than by the length of a ripple chain. The only price you pay is that small block of next-state gates."
      ],
      theoryHI: [
        "चलिए ठीक-ठीक तय करें कि किसी counter को synchronous क्या बनाता है, क्योंकि पूरा design यही शब्द ढोता है। ripple counter में सिर्फ़ पहला flip-flop external clock सुनता है और हर बाद का stage अपने से पहले वाले से clock होता है। synchronous counter में वह chaining ग़ायब है: एक अकेली common clock line एक साथ हर flip-flop के clock input तक जाती है, तो सब उसी एक edge से उसी एक पल पर trigger होते हैं।",
        "उस एक wiring बदलाव का तुरंत नतीजा है। चूँकि flip-flops अब एक-दूसरे को clock नहीं कर रहे, वे बारी-बारी क्रम में toggle नहीं कर सकते। कुछ और को, हर clock edge से पहले, तय करना है कि कौन से flip-flops पलटें और कौन रुकें। यह काम combinational logic के एक block पर आता है - next-state logic - जो Q outputs पर मौजूदा count पढ़ती है और उसी हिसाब से हर flip-flop के control inputs को चलाती है।",
        "T (toggle) flip-flops के साथ next-state logic toggle conditions का एक सेट है, हर bit के लिए एक। हर flip-flop का T input मौजूदा outputs का एक Boolean function है जो ठीक तब 1 होता है जब उस bit को आने वाले edge पर बदलना है। एक binary up counter के लिए, bit i को ठीक तब toggle करना है जब carry उस तक पहुँचे - यानी जब उसके नीचे का हर bit इस समय 1 हो - तो T0 = 1, T1 = Q0, और T2 = Q0·Q1। वही AND gates पूरा अतिरिक्त hardware हैं।",
        "अब मुख्य behavioural तथ्य: चूँकि clock सारे stages तक एक साथ पहुँचता है, हर वह flip-flop जिसे toggle करने को कहा गया है उसी edge पर पलटता है, तो पूरा output word एक ही क़दम में एक साथ बदलता है। कोई trigger chain में नहीं चलता और कोई stage अपने नीचे वाले का इंतज़ार नहीं करता - update समानांतर है, क्रमिक नहीं।",
        "वही समानांतर update synchronous counters को असली designs में default बनाता है। outputs सीधे एक वैध count से अगली पर क़दम रखते हैं, कोई transient बीच-का मान नहीं, तो उनके outputs पूरी speed पर decode करने के लिए सुरक्षित हैं, और maximum clock rate एक अकेले flip-flop जमा उसके gates से तय होती है, न कि ripple chain की लंबाई से। एकमात्र क़ीमत वही next-state gates का छोटा block है।"
      ],
      transcriptEN: "What makes a counter synchronous is the clock wiring. In a ripple counter only the first flip-flop hears the clock and each later stage is clocked by the one before it. In a synchronous counter that chaining is gone: one common clock line runs to every flip-flop's clock input at once, so all of them are triggered by the same edge at the same instant. Since the flip-flops no longer clock each other, they can't take turns toggling, so a block of combinational logic - the next-state logic - reads the current count and drives each flip-flop's control inputs. With T flip-flops that logic is a set of toggle conditions: each T input is one exactly when that bit must change. For a binary up counter, bit i toggles when a carry reaches it - when every lower bit is one - so T-zero is one, T-one equals Q-zero, T-two equals Q-zero AND Q-one. Because the clock reaches all stages together, every flip-flop that's told to toggle does so on the same edge, so the whole word changes at once - the update is parallel, not serial. That's why synchronous counters are the default: the outputs step directly from one legal count to the next with no transient values, safe to decode at full speed, and the top clock rate is set by one flip-flop plus its gates, not the chain length. The only price is that small block of gates.",
      transcriptHI: "किसी counter को synchronous उसकी clock wiring बनाती है। ripple counter में सिर्फ़ पहला flip-flop clock सुनता है और हर बाद का stage अपने से पहले वाले से clock होता है। synchronous counter में वह chaining ग़ायब है: एक common clock line एक साथ हर flip-flop के clock input तक जाती है, तो सब उसी edge से उसी पल trigger होते हैं। चूँकि flip-flops अब एक-दूसरे को clock नहीं करते, वे बारी-बारी toggle नहीं कर सकते, तो combinational logic का एक block - next-state logic - मौजूदा count पढ़कर हर flip-flop के control inputs चलाता है। T flip-flops के साथ वह logic toggle conditions का सेट है: हर T input ठीक तब एक होता है जब उस bit को बदलना है। binary up counter के लिए, bit i तब toggle करता है जब carry उस तक पहुँचे - जब नीचे का हर bit एक हो - तो T-zero एक, T-one बराबर Q-zero, T-two बराबर Q-zero AND Q-one। चूँकि clock सारे stages तक एक साथ पहुँचता है, हर वह flip-flop जिसे toggle कहा गया उसी edge पर पलटता है, तो पूरा word एक साथ बदलता है - update समानांतर है, क्रमिक नहीं। इसीलिए synchronous counters default हैं: outputs सीधे एक वैध count से अगली पर क़दम रखते हैं, कोई transient मान नहीं, पूरी speed पर decode के लिए सुरक्षित, और top clock rate एक flip-flop जमा उसके gates से तय, chain की लंबाई से नहीं। एकमात्र क़ीमत वही gates का छोटा block है।",
      visualNote: "Bespoke schematic: three T flip-flops sharing one horizontal clock bus (drawn to all three CLK inputs at once), with AND gates feeding T1 = Q0 and T2 = Q0 AND Q1; ticking advances all bits together and highlights which T inputs are hot."
    },
    {
      id: "S03_RippleVsSync",
      label: "Ripple vs Synchronous",
      kind: "theory",
      subtitle: "Same count, opposite trade-offs: staggered and slow versus aligned and fast.",
      theoryEN: [
        "Both counters produce the identical binary sequence, so the difference is entirely in how and when the bits get there. The cleanest way to see it is side by side: hold the two designs against four properties - clock distribution, delay accumulation, top speed, and glitches - and the whole story falls out of the first one.",
        "Clock distribution is the root cause. A ripple counter feeds the external clock only to FF0 and lets each stage clock the next, so a trigger has to travel the chain. A synchronous counter runs one clock to every flip-flop, so every stage is triggered at the same instant. Everything else follows from that single choice.",
        "Delay accumulation is the direct consequence. In the ripple counter the worst-case settling time is N × t_pd, because the edge must ripple through all N flip-flops one after another. In the synchronous counter the settling time is just t_pcq + t_gate - one clock-to-Q delay plus the slowest next-state gate - and it does not grow with N at all.",
        "Top speed and glitches follow in turn. Because ripple delay grows with width, a wide ripple counter's maximum clock frequency collapses as you add bits, and mid-ripple its outputs pass through transient wrong values - the decoding glitch. The synchronous counter keeps a nearly constant top frequency regardless of width, and its outputs jump straight from one legal count to the next with no illegal in-between states.",
        "The timing diagrams make it visible. In the synchronous trace, the Q0, Q1, Q2 edges all line up on the same vertical clock lines - the word changes in one clean step. In the ripple trace, each higher bit's edge lags the bit below it by one flip-flop delay, so the edges fan out into a staircase and there is a brief window where the displayed number is simply wrong. Same count, opposite timing - that is the whole trade-off, and it is exactly why the small cost of next-state logic is almost always worth paying."
      ],
      theoryHI: [
        "दोनों counters वही एक-सी binary sequence बनाते हैं, तो फ़र्क़ पूरी तरह इसमें है कि bits वहाँ कैसे और कब पहुँचते हैं। इसे देखने का सबसे साफ़ तरीक़ा साथ-साथ रखना है: दोनों designs को चार गुणों के सामने रखिए - clock distribution, delay accumulation, top speed, और glitches - और पूरी कहानी पहले वाले से निकल आती है।",
        "Clock distribution मूल कारण है। ripple counter external clock सिर्फ़ FF0 को देता है और हर stage को अगले को clock करने देता है, तो एक trigger को chain चलनी पड़ती है। synchronous counter एक clock हर flip-flop तक चलाता है, तो हर stage उसी पल trigger होता है। बाक़ी सब इसी एक चुनाव से निकलता है।",
        "Delay accumulation सीधा नतीजा है। ripple counter में worst-case settling time N × t_pd है, क्योंकि edge को सारे N flip-flops में एक के बाद एक ripple करना पड़ता है। synchronous counter में settling time बस t_pcq + t_gate है - एक clock-to-Q delay जमा सबसे धीमा next-state gate - और यह N के साथ बढ़ता ही नहीं।",
        "Top speed और glitches बारी-बारी निकलते हैं। चूँकि ripple delay width के साथ बढ़ता है, चौड़े ripple counter की maximum clock frequency bits जोड़ते ही ढह जाती है, और ripple के बीच इसके outputs transient ग़लत मानों से गुज़रते हैं - decoding glitch। synchronous counter width चाहे कुछ भी हो लगभग स्थिर top frequency रखता है, और इसके outputs सीधे एक वैध count से अगली पर कूदते हैं, कोई अवैध बीच-की states नहीं।",
        "Timing diagrams इसे दिखा देते हैं। synchronous trace में Q0, Q1, Q2 के edges सब एक ही खड़ी clock lines पर मिलते हैं - word एक साफ़ क़दम में बदलता है। ripple trace में हर ऊपरी bit का edge अपने नीचे वाले से एक flip-flop delay पीछे रहता है, तो edges एक सीढ़ी में फैल जाते हैं और एक छोटा window होता है जहाँ दिखा मान बस ग़लत है। वही count, उलटी timing - यही पूरा trade-off है, और ठीक इसीलिए next-state logic की छोटी क़ीमत लगभग हमेशा चुकाने लायक़ है।"
      ],
      transcriptEN: "Both counters produce the identical binary sequence, so the difference is entirely in how and when the bits arrive. Hold the two designs against four properties: clock distribution, delay accumulation, top speed, and glitches. Clock distribution is the root cause: a ripple counter feeds the clock only to FF0 and lets each stage clock the next, so a trigger travels the chain, while a synchronous counter runs one clock to every flip-flop, so every stage triggers at the same instant. Delay accumulation follows: the ripple counter's worst-case settling time is N times t-pd, because the edge ripples through all N flip-flops, but the synchronous counter settles in just one clock-to-Q delay plus one gate delay, and that doesn't grow with N. So a wide ripple counter's top frequency collapses as you add bits and its outputs flicker through wrong values mid-ripple, while the synchronous counter keeps a nearly constant top speed and steps straight from one legal count to the next. In the timing diagrams, the synchronous edges all line up on the same clock lines - one clean step - while the ripple edges fan out into a staircase, each higher bit lagging the one below by a flip-flop delay, with a brief window where the number is wrong. Same count, opposite timing - which is why the small cost of next-state logic is almost always worth it.",
      transcriptHI: "दोनों counters वही binary sequence बनाते हैं, तो फ़र्क़ पूरी तरह इसमें है कि bits कैसे और कब पहुँचते हैं। दोनों designs को चार गुणों के सामने रखिए: clock distribution, delay accumulation, top speed, और glitches। Clock distribution मूल कारण है: ripple counter clock सिर्फ़ FF0 को देता है और हर stage को अगले को clock करने देता है, तो trigger chain चलता है, जबकि synchronous counter एक clock हर flip-flop तक चलाता है, तो हर stage उसी पल trigger होता है। Delay accumulation उससे निकलता है: ripple counter का worst-case settling time N गुणा t-pd है, क्योंकि edge सारे N flip-flops में ripple करता है, पर synchronous counter बस एक clock-to-Q delay जमा एक gate delay में settle होता है, और वह N के साथ नहीं बढ़ता। तो चौड़े ripple counter की top frequency bits जोड़ते ही ढहती है और उसके outputs ripple के बीच ग़लत मानों से झिलमिलाते हैं, जबकि synchronous counter लगभग स्थिर top speed रखता है और सीधे एक वैध count से अगली पर क़दम रखता है। Timing diagrams में synchronous edges सब एक ही clock lines पर मिलते हैं - एक साफ़ क़दम - जबकि ripple edges सीढ़ी में फैलते हैं, हर ऊपरी bit नीचे वाले से एक flip-flop delay पीछे, एक छोटे window में संख्या ग़लत। वही count, उलटी timing - इसीलिए next-state logic की छोटी क़ीमत लगभग हमेशा चुकाने लायक़ है।",
      visualNote: "Bespoke computed StateTable of the four contrast rows plus two TimingDiagrams from the same 3-bit count: sync (edges aligned on one clock line) versus ripple (each higher bit shifted one flip-flop delay later, staircased)."
    },
    {
      id: "S04_Design",
      label: "The Design Procedure",
      kind: "theory",
      subtitle: "Count table -> per-bit toggle -> simplify -> gates, giving T0 = 1, T1 = Q0, T2 = Q0·Q1.",
      theoryEN: [
        "Designing a synchronous counter is a fixed four-step recipe, and once you have run it a couple of times it becomes automatic. We will run it for the standard example - a 3-bit binary up counter built from T flip-flops - and derive its gates from scratch, with every cell computed, not quoted.",
        "Step one: write the state (count) table, present state next to next state. The up counter cycles 000 -> 001 -> 010 -> 011 -> 100 -> 101 -> 110 -> 111 -> 000, so each row lists the current Q2 Q1 Q0 and the Q2 Q1 Q0 it must become on the next clock. This table is the complete specification of what the counter must do.",
        "Step two: for each flip-flop, read off the required excitation. A T flip-flop obeys Q(t+1) = T ⊕ Q, so its toggle input must be T = 1 exactly when that bit differs between present and next, and T = 0 when it stays the same. In other words, for every row, T_i is simply the XOR of the present and next value of bit i - fill that in for all three bits across all eight rows.",
        "Step three: simplify each T_i as a function of the current count bits, reading the columns you just filled. Look at when each column is 1. The T0 column is 1 in every single row, so T0 = 1. The T1 column is 1 exactly in the rows where Q0 = 1, so T1 = Q0. The T2 column is 1 exactly in the rows where Q0 and Q1 are both 1, so T2 = Q0·Q1. The pattern is unmistakable: a bit toggles if and only if every lower bit is currently 1 - that is exactly the carry condition of binary counting.",
        "Step four: realise it with gates. T0 is tied to constant 1, T1 is wired directly from Q0, and T2 is the output of a single 2-input AND gate fed by Q0 and Q1. Three T flip-flops sharing one clock, plus that one AND gate, are the entire 3-bit synchronous up counter. Widen it and the pattern continues - T3 = Q0·Q1·Q2 - each new bit just AND-ing in one more lower output."
      ],
      theoryHI: [
        "एक synchronous counter design करना एक तय चार-कदम नुस्ख़ा है, और एक-दो बार चलाने पर यह अपने आप हो जाता है। हम इसे standard उदाहरण के लिए चलाएँगे - एक 3-bit binary up counter जो T flip-flops से बना है - और इसके gates को शून्य से निकालेंगे, हर cell गिना हुआ, उद्धृत नहीं।",
        "कदम एक: state (count) table लिखिए, present state के बगल next state। up counter 000 -> 001 -> 010 -> 011 -> 100 -> 101 -> 110 -> 111 -> 000 घूमता है, तो हर row मौजूदा Q2 Q1 Q0 और वह Q2 Q1 Q0 सूचीबद्ध करती है जो उसे अगले clock पर बनना है। यह table पूरी विशिष्टि है कि counter को क्या करना है।",
        "कदम दो: हर flip-flop के लिए ज़रूरी excitation पढ़िए। एक T flip-flop Q(t+1) = T ⊕ Q मानता है, तो इसका toggle input ठीक तब T = 1 हो जब वह bit present और next के बीच अलग हो, और T = 0 जब वही रहे। दूसरे शब्दों में, हर row के लिए, T_i बस bit i के present और next मान का XOR है - इसे तीनों bits के लिए सभी आठ rows में भर दीजिए।",
        "कदम तीन: हर T_i को मौजूदा count bits के function की तरह simplify कीजिए, अभी भरे columns पढ़ते हुए। देखिए हर column कब 1 है। T0 column हर एक row में 1 है, तो T0 = 1। T1 column ठीक उन rows में 1 है जहाँ Q0 = 1, तो T1 = Q0। T2 column ठीक उन rows में 1 है जहाँ Q0 और Q1 दोनों 1 हैं, तो T2 = Q0·Q1। pattern साफ़ है: एक bit तभी toggle करता है जब उसके नीचे का हर bit इस समय 1 हो - वही binary counting की carry condition है।",
        "कदम चार: इसे gates से साकार कीजिए। T0 constant 1 से बँधा है, T1 सीधे Q0 से wired है, और T2 एक अकेले 2-input AND gate का output है जिसे Q0 और Q1 खिलाते हैं। तीन T flip-flops एक clock बाँटते, जमा वह एक AND gate, पूरा 3-bit synchronous up counter हैं। इसे चौड़ा कीजिए और pattern जारी रहता है - T3 = Q0·Q1·Q2 - हर नया bit बस एक और नीचे वाला output AND कर लेता है।"
      ],
      transcriptEN: "Designing a synchronous counter is a fixed four-step recipe. We'll run it for the standard example - a three-bit binary up counter from T flip-flops - deriving its gates from scratch, every cell computed. Step one: write the count table, present state beside next state. The up counter cycles zero-zero-zero up to one-one-one and wraps, so each row lists the current Q2 Q1 Q0 and what it must become next. Step two: for each flip-flop read the required excitation. A T flip-flop obeys Q-next equals T XOR Q, so its toggle input must be one exactly when that bit differs between present and next, and zero when it stays the same - so T-i is just the XOR of the present and next value of bit i, filled in for all three bits across all eight rows. Step three: simplify each T as a function of the current bits by reading the columns. The T-zero column is one in every row, so T-zero is one. The T-one column is one exactly where Q-zero is one, so T-one equals Q-zero. The T-two column is one exactly where Q-zero and Q-one are both one, so T-two equals Q-zero AND Q-one. A bit toggles if and only if every lower bit is one - the carry condition of binary counting. Step four: realise it. T-zero ties to one, T-one wires straight from Q-zero, and T-two is one two-input AND of Q-zero and Q-one. Three T flip-flops on one clock plus one AND gate is the whole counter; widen it and T-three equals Q-zero AND Q-one AND Q-two.",
      transcriptHI: "एक synchronous counter design करना एक तय चार-कदम नुस्ख़ा है। हम इसे standard उदाहरण के लिए चलाएँगे - एक three-bit binary up counter T flip-flops से - इसके gates शून्य से निकालते, हर cell गिना हुआ। कदम एक: count table लिखिए, present state के बगल next state। up counter zero-zero-zero से one-one-one तक घूमकर wrap करता है, तो हर row मौजूदा Q2 Q1 Q0 और अगला मान सूचीबद्ध करती है। कदम दो: हर flip-flop के लिए ज़रूरी excitation पढ़िए। T flip-flop Q-next बराबर T XOR Q मानता है, तो इसका toggle input ठीक तब एक हो जब वह bit present और next के बीच अलग हो, और शून्य जब वही रहे - तो T-i बस bit i के present और next मान का XOR है, तीनों bits के लिए सभी आठ rows में भरा। कदम तीन: हर T को मौजूदा bits के function की तरह simplify कीजिए, columns पढ़ते हुए। T-zero column हर row में एक है, तो T-zero एक। T-one column ठीक वहाँ एक है जहाँ Q-zero एक, तो T-one बराबर Q-zero। T-two column ठीक वहाँ एक है जहाँ Q-zero और Q-one दोनों एक, तो T-two बराबर Q-zero AND Q-one। एक bit तभी toggle करता है जब नीचे का हर bit एक हो - binary counting की carry condition। कदम चार: इसे साकार कीजिए। T-zero एक से बँधा, T-one सीधे Q-zero से, और T-two Q-zero और Q-one का एक two-input AND। तीन T flip-flops एक clock पर जमा एक AND gate पूरा counter है; चौड़ा कीजिए तो T-three बराबर Q-zero AND Q-one AND Q-two।",
      visualNote: "Bespoke StepThrough: (1) the computed present->next count table; (2) the excitation table with T2 T1 T0 = present XOR next per row; (3) the columns grouped to T0=1, T1=Q0, T2=Q0.Q1 with each row verified in code; (4) the gate circuit with one AND gate."
    },
    {
      id: "S05_UpDown",
      label: "Counting Up And Down",
      kind: "theory",
      subtitle: "Toggle when every lower bit is 1 (up) versus every lower bit is 0 (down) - feed Q or Q'.",
      theoryEN: [
        "Reversing a synchronous counter needs no new flip-flops - only different toggle logic. Repeat the design procedure for a down counter and a single, satisfying mirror-image appears: where the up counter toggled a bit when all lower bits were 1, the down counter toggles it when all lower bits are 0.",
        "The reason is the borrow, the mirror of the carry. Counting down, a bit flips exactly when every bit below it is 0, because that is the moment a borrow propagates up to it - think of 100 going to 011, where the two low zeros force the top bit to drop. So the toggle condition simply swaps 'all lower bits are 1' for 'all lower bits are 0'.",
        "In gates that means feeding the complements. The up counter uses T0 = 1, T1 = Q0, T2 = Q0·Q1. The down counter uses T0 = 1, T1 = Q0', T2 = Q0'·Q1'. The T0 = 1 stays - the least-significant bit toggles on every clock in both directions - and every higher bit just ANDs the complemented lower outputs instead of the true ones.",
        "The sequences confirm it. The up counter runs 000, 001, 010, 011, 100, 101, 110, 111 and wraps to 000; the down counter runs 111, 110, 101, 100, 011, 010, 001, 000 and wraps to 111. Both are still fully synchronous - every bit lands on the same clock edge - so both step cleanly with no glitch, unlike the ripple version.",
        "This is also how an up/down counter is built: put a mode bit M in front of the AND gates and let it select between the true outputs and their complements - Q for up, Q' for down - typically with a small 2-to-1 multiplexer on each stage. One control line then flips the entire counting direction while the clock, the flip-flops, and the lockstep timing all stay exactly the same."
      ],
      theoryHI: [
        "एक synchronous counter को उलटने के लिए कोई नया flip-flop नहीं चाहिए - सिर्फ़ अलग toggle logic। एक down counter के लिए design procedure दोहराइए और एक अकेली, संतोषजनक mirror-image उभरती है: जहाँ up counter एक bit को तब toggle करता था जब सारे नीचे के bits 1 थे, down counter उसे तब toggle करता है जब सारे नीचे के bits 0 हों।",
        "वजह है borrow, carry का दर्पण। नीचे गिनते हुए, एक bit ठीक तब पलटता है जब उसके नीचे का हर bit 0 हो, क्योंकि वही पल है जब borrow उस तक ऊपर propagate करता है - 100 का 011 बनना सोचिए, जहाँ दो निचले zeros ऊपरी bit को गिरने पर मजबूर करते हैं। तो toggle condition बस 'सारे नीचे के bits 1' को 'सारे नीचे के bits 0' से बदल देती है।",
        "gates में इसका मतलब complements खिलाना है। up counter T0 = 1, T1 = Q0, T2 = Q0·Q1 वापरता है। down counter T0 = 1, T1 = Q0', T2 = Q0'·Q1' वापरता है। T0 = 1 वैसा ही रहता है - least-significant bit दोनों दिशाओं में हर clock पर toggle करता है - और हर ऊपरी bit बस असली के बजाय complemented नीचे वाले outputs AND कर लेता है।",
        "sequences इसकी पुष्टि करते हैं। up counter 000, 001, 010, 011, 100, 101, 110, 111 चलता है और 000 पर wrap करता है; down counter 111, 110, 101, 100, 011, 010, 001, 000 चलता है और 111 पर wrap करता है। दोनों अब भी पूरी तरह synchronous हैं - हर bit एक ही clock edge पर उतरता है - तो दोनों साफ़ क़दम रखते हैं, कोई glitch नहीं, ripple version के उलट।",
        "यही तरीक़ा है जिससे एक up/down counter बनता है: AND gates के आगे एक mode bit M रखिए और उसे असली outputs और उनके complements के बीच चुनने दीजिए - up के लिए Q, down के लिए Q' - आमतौर पर हर stage पर एक छोटे 2-to-1 multiplexer से। फिर एक control line पूरी counting direction पलट देती है जबकि clock, flip-flops, और lockstep timing सब बिलकुल वैसे ही रहते हैं।"
      ],
      transcriptEN: "Reversing a synchronous counter needs no new flip-flops, only different toggle logic. Run the design procedure for a down counter and a mirror-image appears: where the up counter toggled a bit when all lower bits were one, the down counter toggles it when all lower bits are zero. That's the borrow, the mirror of the carry - a bit flips when every bit below it is zero, the moment a borrow reaches it, like one-zero-zero going to zero-one-one. In gates that means feeding the complements: the up counter uses T-zero one, T-one Q-zero, T-two Q-zero AND Q-one; the down counter uses T-zero one, T-one Q-zero-prime, T-two Q-zero-prime AND Q-one-prime. T-zero stays one - the LSB toggles every clock either way - and each higher bit just ANDs the complemented lower outputs. The sequences confirm it: up runs zero to seven and wraps, down runs seven to zero and wraps, and both are fully synchronous, every bit on the same edge, so both step cleanly with no glitch. That's also how an up-down counter is built: put a mode bit in front of the AND gates to select true outputs or their complements, Q for up, Q-prime for down, usually with a small two-to-one multiplexer per stage. One control line flips the whole direction while the clock, the flip-flops, and the lockstep timing stay the same.",
      transcriptHI: "एक synchronous counter उलटने को कोई नया flip-flop नहीं चाहिए, सिर्फ़ अलग toggle logic। down counter के लिए design procedure चलाइए और mirror-image उभरती है: जहाँ up counter एक bit को तब toggle करता था जब सारे नीचे के bits एक थे, down counter उसे तब toggle करता है जब सारे नीचे के bits शून्य हों। वही borrow है, carry का दर्पण - एक bit तब पलटता है जब उसके नीचे का हर bit शून्य हो, वही पल जब borrow उस तक पहुँचे, जैसे one-zero-zero का zero-one-one बनना। gates में इसका मतलब complements खिलाना: up counter T-zero एक, T-one Q-zero, T-two Q-zero AND Q-one वापरता है; down counter T-zero एक, T-one Q-zero-prime, T-two Q-zero-prime AND Q-one-prime। T-zero एक ही रहता है - LSB दोनों तरफ़ हर clock toggle करता है - और हर ऊपरी bit बस complemented नीचे वाले outputs AND करता है। sequences पुष्टि करते हैं: up zero से seven चलकर wrap, down seven से zero चलकर wrap, और दोनों पूरी तरह synchronous, हर bit एक ही edge पर, तो दोनों साफ़ क़दम रखते, कोई glitch नहीं। यही तरीक़ा है up-down counter बनाने का: AND gates के आगे एक mode bit रखिए जो असली outputs या उनके complements चुने, up को Q, down को Q-prime, आमतौर पर हर stage पर एक छोटे two-to-one multiplexer से। एक control line पूरी direction पलट देती है जबकि clock, flip-flops, और lockstep timing वैसे ही रहते हैं।",
      visualNote: "Bespoke up/down picker showing the derived toggle equations (T0=1, T1=Q0, T2=Q0.Q1 for up; T0=1, T1=Q0', T2=Q0'.Q1' for down) recomputed live, plus CounterViz mode=sync dir=up and CounterViz mode=sync dir=down running side by side."
    },
    {
      id: "S06_ModN",
      label: "MOD-N: Truncating The Count",
      kind: "theory",
      subtitle: "Detect the terminal count and synchronously clear or load, e.g. a MOD-6 that counts 0 to 5.",
      theoryEN: [
        "A plain n-bit counter is a MOD-2^n counter: it visits all 2^n states before wrapping. Often you want a shorter cycle - a MOD-10 for a decimal digit, a MOD-6 for the tens of a clock's seconds. A MOD-N counter counts through exactly N states, 0 up to N-1, and then jumps back to 0, so it needs a way to cut the natural sequence short.",
        "The number of flip-flops is set by how many bits N needs: you use the smallest number of flip-flops that can hold N-1, which is ceil(log2 N). A MOD-6 counter needs 3 flip-flops (because 3 bits reach 5), and it will simply skip the two states 6 and 7 that those 3 bits could otherwise represent.",
        "The truncation trick is terminal-count detection. Add a small combinational detector - an AND gate - that recognises the last valid count, N-1, by ANDing together the output bits that are 1 in that value. For MOD-6 the terminal count is 5 = 101, so the detector is Q2·Q0 (the bits that are high in 101), which goes to 1 exactly when the counter reaches 5.",
        "In a synchronous design that detector does not clear the flip-flops the instant it fires. Instead its output is routed to a synchronous clear or parallel-load input, so the reset takes effect on the next clock edge - the same edge that would have advanced the count. The counter reaches 5, the detector arms the clear, and on the following edge every flip-flop loads 0 together, cleanly, in lockstep with the rest of the machine.",
        "That word 'synchronous' matters. If you instead used an asynchronous clear that fires the moment the counter momentarily hits 6, the outputs would flicker through 6 before snapping back to 0 - a glitch, exactly the disease synchronous counters were built to avoid. Detecting N-1 and clearing on the next edge keeps the whole cycle clean: 0, 1, 2, 3, 4, 5, back to 0, with no illegal state ever shown."
      ],
      theoryHI: [
        "एक सादा n-bit counter एक MOD-2^n counter है: यह wrap करने से पहले सारे 2^n states देखता है। अक्सर आपको एक छोटा cycle चाहिए - एक decimal digit के लिए MOD-10, एक घड़ी के seconds के tens के लिए MOD-6। एक MOD-N counter ठीक N states में गिनता है, 0 से N-1 तक, और फिर वापस 0 पर कूदता है, तो इसे स्वाभाविक sequence को छोटा काटने का एक तरीक़ा चाहिए।",
        "flip-flops की संख्या इससे तय होती है कि N को कितने bits चाहिए: आप सबसे कम flip-flops वापरते हैं जो N-1 रख सकें, यानी ceil(log2 N)। एक MOD-6 counter को 3 flip-flops चाहिए (क्योंकि 3 bits 5 तक पहुँचते हैं), और यह बस उन दो states 6 और 7 को छोड़ देगा जिन्हें वे 3 bits वरना दिखा सकते थे।",
        "truncation की चाल terminal-count detection है। एक छोटा combinational detector जोड़िए - एक AND gate - जो आख़िरी वैध count, N-1, को उसमें 1 होने वाले output bits को AND करके पहचाने। MOD-6 के लिए terminal count 5 = 101 है, तो detector Q2·Q0 है (वे bits जो 101 में high हैं), जो ठीक तब 1 हो जाता है जब counter 5 पर पहुँचे।",
        "एक synchronous design में वह detector जिस पल fire करे उसी पल flip-flops को clear नहीं करता। इसके बजाय इसका output एक synchronous clear या parallel-load input तक जाता है, तो reset अगले clock edge पर लागू होता है - वही edge जो count को आगे बढ़ाता। counter 5 पर पहुँचता है, detector clear को arm करता है, और अगले edge पर हर flip-flop एक साथ 0 load करता है, साफ़-साफ़, बाक़ी machine के साथ lockstep में।",
        "वह शब्द 'synchronous' मायने रखता है। अगर आप इसके बजाय एक asynchronous clear वापरें जो counter के पल भर 6 पर पहुँचते ही fire करे, तो outputs 0 पर वापस झटकने से पहले 6 से झिलमिलाएँगे - एक glitch, ठीक वही बीमारी जिससे बचने को synchronous counters बने थे। N-1 detect करना और अगले edge पर clear करना पूरे cycle को साफ़ रखता है: 0, 1, 2, 3, 4, 5, वापस 0, कोई अवैध state कभी दिखे बिना।"
      ],
      transcriptEN: "A plain n-bit counter is a mod-two-to-the-n counter: it visits all its states before wrapping. Often you want a shorter cycle - a mod-ten for a decimal digit, a mod-six for the tens of a clock's seconds. A mod-N counter counts through exactly N states, zero up to N-minus-one, then jumps back to zero, so it needs a way to cut the natural sequence short. The number of flip-flops is the smallest that can hold N-minus-one, which is ceiling of log-two of N: a mod-six needs three flip-flops, because three bits reach five, and it just skips the two states six and seven. The truncation trick is terminal-count detection: add an AND gate that recognises the last valid count, N-minus-one, by ANDing the output bits that are one in that value. For mod-six the terminal count is five, one-zero-one, so the detector is Q2 AND Q0, which goes high exactly at five. In a synchronous design that detector doesn't clear the flip-flops the instant it fires; its output goes to a synchronous clear or parallel-load, so the reset takes effect on the next clock edge - the counter reaches five, the detector arms the clear, and on the following edge every flip-flop loads zero together, cleanly. That word synchronous matters: an asynchronous clear that fires the moment the counter momentarily hits six would flicker through six before snapping to zero - a glitch, the very disease synchronous counters avoid. Detecting N-minus-one and clearing on the next edge keeps the cycle clean: zero through five, back to zero, no illegal state ever shown.",
      transcriptHI: "एक सादा n-bit counter एक mod-two-to-the-n counter है: यह wrap से पहले सारे states देखता है। अक्सर आपको छोटा cycle चाहिए - decimal digit को mod-ten, घड़ी के seconds के tens को mod-six। एक mod-N counter ठीक N states में गिनता है, zero से N-minus-one तक, फिर वापस zero, तो इसे sequence छोटा काटने का तरीक़ा चाहिए। flip-flops की संख्या वह सबसे कम है जो N-minus-one रख सके, यानी ceiling of log-two of N: mod-six को तीन flip-flops चाहिए, क्योंकि तीन bits five तक पहुँचते हैं, और यह बस states six और seven छोड़ देता है। truncation की चाल terminal-count detection है: एक AND gate जोड़िए जो आख़िरी वैध count, N-minus-one, को उसमें एक होने वाले output bits AND करके पहचाने। mod-six के लिए terminal count five, one-zero-one है, तो detector Q2 AND Q0 है, जो ठीक five पर high होता है। synchronous design में वह detector जिस पल fire करे उसी पल flip-flops clear नहीं करता; इसका output एक synchronous clear या parallel-load तक जाता है, तो reset अगले clock edge पर लागू होता है - counter five पर पहुँचता है, detector clear arm करता है, और अगले edge पर हर flip-flop एक साथ zero load करता है, साफ़-साफ़। वह शब्द synchronous मायने रखता है: एक asynchronous clear जो counter के पल भर six पर पहुँचते ही fire करे, zero पर झटकने से पहले six से झिलमिलाएगा - एक glitch, वही बीमारी जिससे synchronous counters बचते हैं। N-minus-one detect करना और अगले edge पर clear करना cycle साफ़ रखता है: zero से five, वापस zero, कोई अवैध state कभी दिखे बिना।",
      visualNote: "Bespoke MOD-N panel: pick N (3..8), code computes the truncated sequence 0..N-1, the required flip-flop count ceil(log2 N), and the minimal terminal-count detect term (AND of the set bits of N-1); plus a live CounterViz mod=6 wrapping at 5->0."
    },
    {
      id: "S07_Decoding",
      label: "Decoding Counter States",
      kind: "theory",
      subtitle: "Gates on the outputs turn each count into a one-hot / timing signal.",
      theoryEN: [
        "A counter's Q outputs are a binary number, but often you want a signal that fires on one specific count - a pulse when the count is exactly 5, or a set of one-hot lines that light up one at a time as the counter steps. Turning the binary count into those signals is called decoding, and it is pure combinational logic sitting on top of the counter.",
        "Decoding a single state is just detecting its minterm. For a 3-bit counter, the value k is present exactly when the outputs match its binary pattern, so you AND together the output literals for that pattern: use Q where the bit is 1 and Q' where the bit is 0. State 5 = 101 is decoded by Q2·Q1'·Q0; state 2 = 010 by Q2'·Q1·Q0'. Each decode line is one 3-input AND gate, and exactly one of them is high at any time.",
        "Wire up all 2^n such gates and you have a full decoder: n counter outputs fan out into 2^n one-hot lines, and as the counter advances the high line walks 0, 1, 2, ... in step with the clock. This is exactly a binary-to-one-hot decoder driven by the counter, and it is how a counter sequences a machine through phases - one line active per clock, in a fixed order.",
        "This decoding is the backbone of countless timing generators. A ring of one-hot outputs from a decoded counter drives a multiplexed seven-segment display digit by digit, steps a traffic-light controller through its phases, strobes the rows of a keypad scan, or generates the enable pulses of a simple control unit. The counter provides the timing; the decoder picks out the moments.",
        "And here synchronous timing earns its keep. Because a synchronous counter's outputs change all at once with no transient in-between values, its decoded lines are clean single pulses - no false spikes. Decode a ripple counter the same way and the mid-ripple glitch states would fire spurious pulses on the wrong lines, which is exactly why glitch-sensitive decoding is always driven from a synchronous counter."
      ],
      theoryHI: [
        "एक counter के Q outputs एक binary संख्या हैं, पर अक्सर आपको एक ऐसा signal चाहिए जो किसी एक ख़ास count पर fire करे - जब count ठीक 5 हो तब एक pulse, या one-hot lines का एक सेट जो एक-एक करके जलें जैसे counter क़दम रखता है। binary count को उन signals में बदलना decoding कहलाता है, और यह counter के ऊपर बैठी शुद्ध combinational logic है।",
        "एक अकेली state को decode करना बस उसका minterm detect करना है। एक 3-bit counter के लिए, मान k ठीक तब मौजूद है जब outputs उसके binary pattern से मेल खाएँ, तो आप उस pattern के output literals AND करते हैं: जहाँ bit 1 हो वहाँ Q और जहाँ 0 हो वहाँ Q' वापरिए। State 5 = 101 Q2·Q1'·Q0 से decode होती है; State 2 = 010 Q2'·Q1·Q0' से। हर decode line एक 3-input AND gate है, और किसी भी समय ठीक एक high होती है।",
        "ऐसे सारे 2^n gates जोड़िए और आपके पास एक पूरा decoder है: n counter outputs 2^n one-hot lines में फैलते हैं, और जैसे counter आगे बढ़ता है high line 0, 1, 2, ... clock के साथ चलती है। यह ठीक counter से चलने वाला एक binary-to-one-hot decoder है, और यही तरीक़ा है जिससे एक counter एक machine को phases में sequence करता है - प्रति clock एक line active, एक तय क्रम में।",
        "यह decoding असंख्य timing generators की रीढ़ है। एक decode किए counter के one-hot outputs का एक ring एक multiplexed seven-segment display को अंक-दर-अंक चलाता है, एक traffic-light controller को उसके phases में क़दम कराता है, एक keypad scan की rows को strobe करता है, या एक सरल control unit की enable pulses बनाता है। counter timing देता है; decoder पल चुनता है।",
        "और यहाँ synchronous timing अपनी क़ीमत कमाती है। चूँकि एक synchronous counter के outputs एक साथ बदलते हैं, कोई transient बीच-का मान नहीं, इसकी decode की गई lines साफ़ अकेली pulses होती हैं - कोई झूठा spike नहीं। एक ripple counter को इसी तरह decode कीजिए और ripple के बीच की glitch states ग़लत lines पर फ़र्ज़ी pulses fire करेंगी, ठीक इसीलिए glitch-sensitive decoding हमेशा एक synchronous counter से चलाई जाती है।"
      ],
      transcriptEN: "A counter's outputs are a binary number, but often you want a signal that fires on one specific count - a pulse when the count is exactly five, or one-hot lines that light one at a time as the counter steps. Turning the binary count into those signals is decoding, pure combinational logic on top of the counter. Decoding one state is just detecting its minterm: for a three-bit counter, value k is present when the outputs match its binary pattern, so you AND the output literals - Q where the bit is one, Q-prime where it's zero. State five, one-zero-one, is Q2 AND Q1-prime AND Q0; state two, zero-one-zero, is Q2-prime AND Q1 AND Q0-prime. Each decode line is one three-input AND, and exactly one is high at a time. Wire up all two-to-the-n gates and you have a full decoder: n outputs fan out into two-to-the-n one-hot lines, and the high line walks in step with the clock. That's how a counter sequences a machine through phases - one line active per clock. It's the backbone of timing generators: a decoded counter drives a multiplexed seven-segment display, steps a traffic light through its phases, strobes a keypad scan, or makes the enable pulses of a control unit. And synchronous timing earns its keep here: because the outputs change all at once with no transient values, the decoded lines are clean single pulses; decode a ripple counter the same way and the mid-ripple glitch states fire spurious pulses on the wrong lines - which is why glitch-sensitive decoding is always driven from a synchronous counter. Watch the second short film for a full walkthrough of decoding.",
      transcriptHI: "एक counter के outputs एक binary संख्या हैं, पर अक्सर आपको एक ऐसा signal चाहिए जो किसी एक ख़ास count पर fire करे - जब count ठीक five हो तब एक pulse, या one-hot lines जो एक-एक करके जलें जैसे counter क़दम रखता है। binary count को उन signals में बदलना decoding है, counter के ऊपर शुद्ध combinational logic। एक state decode करना बस उसका minterm detect करना है: एक three-bit counter के लिए, मान k तब मौजूद है जब outputs उसके binary pattern से मेल खाएँ, तो आप output literals AND करते हैं - जहाँ bit एक वहाँ Q, जहाँ शून्य वहाँ Q-prime। State five, one-zero-one, Q2 AND Q1-prime AND Q0 है; state two, zero-one-zero, Q2-prime AND Q1 AND Q0-prime है। हर decode line एक three-input AND है, और एक समय ठीक एक high होती है। सारे two-to-the-n gates जोड़िए और आपके पास पूरा decoder है: n outputs two-to-the-n one-hot lines में फैलते हैं, और high line clock के साथ चलती है। यही तरीक़ा है जिससे counter एक machine को phases में sequence करता है - प्रति clock एक line active। यह timing generators की रीढ़ है: एक decode किया counter एक multiplexed seven-segment display चलाता है, एक traffic light को phases में क़दम कराता है, एक keypad scan strobe करता है, या एक control unit की enable pulses बनाता है। और synchronous timing यहाँ क़ीमत कमाती है: चूँकि outputs एक साथ बदलते हैं, कोई transient मान नहीं, decode की lines साफ़ अकेली pulses हैं; ripple counter को इसी तरह decode कीजिए और ripple के बीच की glitch states ग़लत lines पर फ़र्ज़ी pulses fire करेंगी - इसीलिए glitch-sensitive decoding हमेशा synchronous counter से चलती है। decoding के पूरे walkthrough के लिए दूसरी छोटी फ़िल्म देखिए।",
      visualNote: "Bespoke decode grid: step a 3-bit count, and code computes all eight one-hot decode outputs plus the AND-of-literals expression (minterm) for the active line; below it, a second CustomVideoPlayer plays /videos/dsd36-decoding.mp4."
    },
    {
      id: "S08_Analogy",
      label: "The Marching Band",
      kind: "theory",
      subtitle: "A whole band stepping on one drumbeat (synchronous) versus a line of dominoes (ripple).",
      theoryEN: [
        "Here is the picture to keep. A synchronous counter is a marching band: one drummer beats time, every musician hears the same beat, and on each beat the entire band takes its step together. A ripple counter is a line of falling dominoes: you push only the first, and the topple travels down the line one piece at a time.",
        "The drumbeat is the shared clock. In the band, the drum reaches every player at once, so all of them move on the same instant - nobody waits for their neighbour. In the counter, the single clock wire reaches every flip-flop at once, so every flip-flop that is due to toggle does so on the very same edge. The band steps in lockstep exactly as the counter's bits change in lockstep.",
        "But a band cannot march randomly - each player has to know whether to step or hold on this beat. That knowing is the next-state logic. In the counter the AND gates read the current count and tell each flip-flop, before the beat arrives, whether its bit should flip. The choreography is worked out in advance; the beat only triggers it.",
        "Contrast the dominoes, which is the ripple counter. There is no shared beat - each domino is knocked over only by the one before it, so the fall ripples down the line and the far end moves noticeably later than the near end. That lag is the ripple delay, and the moment when some dominoes are down and others still standing is the transient glitch.",
        "So the whole module lives in this one image. Shared drumbeat, everyone together, choreography decided beforehand: synchronous - fast, clean, glitch-free, at the cost of the little AND-gate choreographer. One push travelling down a chain, each waiting for the last: ripple - dead simple, but slow and briefly wrong. Same count either way; only the timing, and the trade-off, differ."
      ],
      theoryHI: [
        "यह तस्वीर याद रखिए। एक synchronous counter एक marching band है: एक drummer समय पीटता है, हर संगीतकार वही beat सुनता है, और हर beat पर पूरी band एक साथ अपना क़दम रखती है। एक ripple counter गिरते dominoes की एक कतार है: आप सिर्फ़ पहले को धकेलते हैं, और गिरना कतार में एक-एक टुकड़ा करके आगे बढ़ता है।",
        "drumbeat साझा clock है। band में drum हर player तक एक साथ पहुँचता है, तो सब एक ही पल पर चलते हैं - कोई अपने पड़ोसी का इंतज़ार नहीं करता। counter में अकेली clock wire हर flip-flop तक एक साथ पहुँचती है, तो हर वह flip-flop जिसे toggle करना है उसी एक edge पर करता है। band lockstep में क़दम रखती है ठीक जैसे counter के bits lockstep में बदलते हैं।",
        "पर एक band बेतरतीब march नहीं कर सकती - हर player को पता होना चाहिए कि इस beat पर क़दम रखना है या रुकना। वह जानना next-state logic है। counter में AND gates मौजूदा count पढ़ते हैं और हर flip-flop को, beat पहुँचने से पहले, बताते हैं कि उसका bit पलटे या नहीं। नृत्य-रचना पहले से तय होती है; beat बस उसे trigger करता है।",
        "dominoes से तुलना कीजिए, जो ripple counter है। कोई साझा beat नहीं - हर domino सिर्फ़ अपने से पहले वाले से गिरता है, तो गिरना कतार में ripple करता है और दूर का सिरा पास वाले से साफ़-साफ़ बाद में हिलता है। वह देर ripple delay है, और वह पल जब कुछ dominoes गिरे और कुछ अब भी खड़े हों, वह transient glitch है।",
        "तो पूरा module इसी एक छवि में बसता है। साझा drumbeat, सब एक साथ, नृत्य-रचना पहले से तय: synchronous - तेज़, साफ़, glitch-free, उस छोटे AND-gate नृत्य-निर्देशक की क़ीमत पर। एक धक्का chain में चलता, हर एक पिछले का इंतज़ार करता: ripple - बेहद सरल, पर धीमा और पल भर ग़लत। दोनों तरफ़ वही count; सिर्फ़ timing, और trade-off, अलग।"
      ],
      transcriptEN: "Here's the picture to keep. A synchronous counter is a marching band: one drummer beats time, every musician hears the same beat, and on each beat the whole band steps together. A ripple counter is a line of falling dominoes: you push only the first, and the topple travels down the line one piece at a time. The drumbeat is the shared clock - it reaches every player at once, so all of them move on the same instant, just as the single clock wire reaches every flip-flop at once and every flip-flop due to toggle does so on the same edge. But a band can't march randomly; each player must know whether to step or hold on this beat, and that knowing is the next-state logic - the AND gates read the current count and tell each flip-flop, before the beat, whether its bit should flip. The choreography is worked out in advance; the beat only triggers it. Contrast the dominoes: no shared beat, each knocked over only by the one before it, so the fall ripples down and the far end moves later than the near end - that lag is the ripple delay, and the moment when some are down and others still standing is the glitch. So the whole module lives in one image: shared drumbeat, everyone together, choreography decided beforehand - synchronous, fast and clean at the cost of a little AND-gate choreographer; one push travelling a chain, each waiting for the last - ripple, dead simple but slow and briefly wrong. Same count either way; only the timing differs.",
      transcriptHI: "यह तस्वीर याद रखिए। एक synchronous counter एक marching band है: एक drummer समय पीटता है, हर संगीतकार वही beat सुनता है, और हर beat पर पूरी band एक साथ क़दम रखती है। एक ripple counter गिरते dominoes की कतार है: आप सिर्फ़ पहले को धकेलते हैं, और गिरना कतार में एक-एक टुकड़ा आगे बढ़ता है। drumbeat साझा clock है - यह हर player तक एक साथ पहुँचता है, तो सब एक ही पल चलते हैं, ठीक जैसे अकेली clock wire हर flip-flop तक एक साथ पहुँचती है और हर toggle-योग्य flip-flop उसी edge पर पलटता है। पर band बेतरतीब march नहीं कर सकती; हर player को पता हो कि इस beat पर क़दम रखना है या रुकना, और वह जानना next-state logic है - AND gates मौजूदा count पढ़ते हैं और हर flip-flop को beat से पहले बताते हैं कि bit पलटे या नहीं। नृत्य-रचना पहले तय होती है; beat बस trigger करता है। dominoes से तुलना: कोई साझा beat नहीं, हर एक सिर्फ़ अपने से पहले वाले से गिरता, तो गिरना ripple करता और दूर का सिरा पास वाले से बाद में हिलता - वह देर ripple delay है, और वह पल जब कुछ गिरे कुछ खड़े, वह glitch है। तो पूरा module एक छवि में: साझा drumbeat, सब एक साथ, नृत्य-रचना पहले से - synchronous, तेज़ और साफ़, एक छोटे AND-gate नृत्य-निर्देशक की क़ीमत पर; एक धक्का chain में, हर एक पिछले का इंतज़ार - ripple, बेहद सरल पर धीमा और पल भर ग़लत। दोनों तरफ़ वही count; सिर्फ़ timing अलग।",
      visualNote: "Bespoke animation: toggle between a marching band (all figures bob on the same beat, in lockstep) and dominoes (staggered topple), tied to the shared-clock versus rippling-trigger fact."
    },
    {
      id: "S09_Build",
      label: "Build A Synchronous Counter",
      kind: "theory",
      subtitle: "Three T flip-flops on one clock, T1 = Q0 and T2 = Q0·Q1 - wire it and watch it step.",
      theoryEN: [
        "Now build the 3-bit synchronous up counter for real, so the four-step design procedure turns into a working circuit under your own hands. You will place three T flip-flops, tie their clock inputs to one common clock, and add the single AND gate that the derivation demanded.",
        "The wiring is exactly what you derived. T0 is tied high to constant 1, so FF0 toggles on every clock. T1 is wired straight from Q0, so FF1 toggles whenever Q0 is 1. T2 is the output of a 2-input AND gate fed by Q0 and Q1, so FF2 toggles only when both lower bits are 1. Every clock edge hits all three flip-flops at once.",
        "Tick the clock and prove the sequence. The outputs should step 000, 001, 010, 011, 100, 101, 110, 111 and wrap to 000, with all three bits landing on the same edge and never showing an illegal in-between value. That clean, simultaneous stepping is the whole point of building it synchronous.",
        "Then push the design further with two small changes. Swap the AND feeds from Q0, Q1 to their complements Q0', Q1' and the same three flip-flops now count down, 111 to 000. Or add a terminal-count AND gate and route it to a synchronous clear to make a MOD-6, and watch it cycle 0 through 5 and reset cleanly.",
        "Open the workbench and wire it up. Building the next-state logic by hand - one AND gate for a 3-bit counter, two for a 4-bit - is the fastest way to feel why a synchronous counter trades a few gates for speed, cleanliness, and a top clock rate that no longer collapses as the counter grows."
      ],
      theoryHI: [
        "अब 3-bit synchronous up counter को असली में बनाइए, ताकि चार-कदम design procedure आपके अपने हाथों के नीचे एक चलता हुआ circuit बन जाए। आप तीन T flip-flops रखेंगे, उनके clock inputs को एक common clock से बाँधेंगे, और वह अकेला AND gate जोड़ेंगे जिसकी derivation ने माँग की थी।",
        "wiring ठीक वही है जो आपने निकाली। T0 constant 1 से high बँधा है, तो FF0 हर clock पर toggle करता है। T1 सीधे Q0 से wired है, तो FF1 तब toggle करता है जब Q0 1 हो। T2 एक 2-input AND gate का output है जिसे Q0 और Q1 खिलाते हैं, तो FF2 तभी toggle करता है जब दोनों नीचे के bits 1 हों। हर clock edge तीनों flip-flops को एक साथ मारता है।",
        "clock tick कीजिए और sequence साबित कीजिए। outputs को 000, 001, 010, 011, 100, 101, 110, 111 क़दम रखना चाहिए और 000 पर wrap, तीनों bits एक ही edge पर उतरते और कभी कोई अवैध बीच-का मान न दिखाते। वही साफ़, एक साथ क़दम रखना इसे synchronous बनाने का पूरा मक़सद है।",
        "फिर design को दो छोटे बदलावों से आगे बढ़ाइए। AND feeds को Q0, Q1 से उनके complements Q0', Q1' पर बदलिए और वही तीन flip-flops अब नीचे गिनते हैं, 111 से 000। या एक terminal-count AND gate जोड़िए और उसे एक synchronous clear तक route कीजिए ताकि एक MOD-6 बने, और इसे 0 से 5 घूमते और साफ़ reset होते देखिए।",
        "workbench खोलिए और इसे wire कीजिए। next-state logic हाथ से बनाना - एक 3-bit counter को एक AND gate, एक 4-bit को दो - सबसे तेज़ तरीक़ा है यह महसूस करने का कि एक synchronous counter कुछ gates को speed, सफ़ाई, और एक top clock rate के बदले क्यों देता है जो counter बढ़ने पर अब ढहती नहीं।"
      ],
      transcriptEN: "Now build the three-bit synchronous up counter for real, so the four-step design procedure becomes a working circuit under your own hands. Place three T flip-flops, tie their clock inputs to one common clock, and add the single AND gate the derivation demanded. The wiring is exactly what you derived: T-zero tied high to one, so FF0 toggles every clock; T-one wired straight from Q-zero, so FF1 toggles when Q-zero is one; T-two the output of a two-input AND of Q-zero and Q-one, so FF2 toggles only when both lower bits are one. Every clock edge hits all three flip-flops at once. Tick the clock and prove the sequence: the outputs should step zero through seven and wrap, all three bits landing on the same edge and never showing an illegal in-between value - that clean simultaneous stepping is the whole point. Then push further: swap the AND feeds to the complements Q-zero-prime and Q-one-prime and the same three flip-flops count down; or add a terminal-count AND gate routed to a synchronous clear to make a mod-six, cycling zero through five and resetting cleanly. Open the workbench and wire it up - building the next-state logic by hand is the fastest way to feel why a synchronous counter trades a few gates for speed, cleanliness, and a top clock rate that no longer collapses as the counter grows.",
      transcriptHI: "अब three-bit synchronous up counter को असली में बनाइए, ताकि चार-कदम design procedure आपके हाथों के नीचे एक चलता circuit बन जाए। तीन T flip-flops रखिए, उनके clock inputs को एक common clock से बाँधिए, और वह अकेला AND gate जोड़िए जिसकी derivation ने माँग की। wiring ठीक वही है जो आपने निकाली: T-zero एक से high बँधा, तो FF0 हर clock toggle करता है; T-one सीधे Q-zero से wired, तो FF1 तब toggle करता है जब Q-zero एक हो; T-two Q-zero और Q-one का एक two-input AND, तो FF2 तभी toggle करता है जब दोनों नीचे के bits एक हों। हर clock edge तीनों flip-flops को एक साथ मारता है। clock tick कीजिए और sequence साबित कीजिए: outputs को zero से seven क़दम रखकर wrap करना चाहिए, तीनों bits एक ही edge पर उतरते और कभी अवैध बीच-का मान न दिखाते - वही साफ़ एक साथ क़दम रखना पूरा मक़सद है। फिर आगे बढ़िए: AND feeds को complements Q-zero-prime और Q-one-prime पर बदलिए और वही तीन flip-flops नीचे गिनते हैं; या एक terminal-count AND gate जोड़कर उसे एक synchronous clear तक route कीजिए ताकि mod-six बने, zero से five घूमते और साफ़ reset होते। workbench खोलिए और इसे wire कीजिए - next-state logic हाथ से बनाना सबसे तेज़ तरीक़ा है यह महसूस करने का कि synchronous counter कुछ gates को speed, सफ़ाई, और एक top clock rate के बदले क्यों देता है जो बढ़ने पर ढहती नहीं।",
      visualNote: "WorkbenchCTA -> /workbench?tutorial=sync-counter: three T flip-flops on a shared clock, T0=1, T1=Q0, T2=Q0.Q1 via one AND gate; verify the 000->111 sequence, then reverse to Q' for down and add a terminal-count clear for MOD-6."
    },
    {
      id: "S10_Flashcards",
      label: "Flip To Remember",
      kind: "flashcards",
      subtitle: "Eight cards on the core synchronous-counter facts.",
      theoryEN: ["Flip each card: the term in front, the real logic behind."],
      theoryHI: ["हर card पलटिए: आगे पद, पीछे असली logic।"],
      transcriptEN: "Eight quick cards on the facts that matter: the shared clock, the next-state logic, the four-step design procedure, the up and down toggle rules, MOD-N truncation, decoding, and why synchronous beats ripple.",
      transcriptHI: "आठ तेज़ cards उन तथ्यों पर जो मायने रखते हैं: साझा clock, next-state logic, चार-कदम design procedure, up और down toggle नियम, MOD-N truncation, decoding, और synchronous ripple को क्यों हराता है।",
      visualNote: "Eight flip cards."
    },
    {
      id: "S11_Quiz",
      label: "Prove You've Got It",
      kind: "quiz",
      subtitle: "Seven questions on synchronous counters.",
      theoryEN: ["Answer, then read why."],
      theoryHI: ["उत्तर दीजिए, फिर वजह पढ़िए।"],
      transcriptEN: "Seven questions covering the shared clock, next-state logic, the design procedure, up/down toggle conditions, MOD-N truncation, decoding, and the ripple-versus-synchronous trade-off.",
      transcriptHI: "सात सवाल जो साझा clock, next-state logic, design procedure, up/down toggle conditions, MOD-N truncation, decoding, और ripple-बनाम-synchronous trade-off को समेटते हैं।",
      visualNote: "Seven-question quiz."
    },
    {
      id: "S12_Recap",
      label: "The Whole Picture",
      kind: "recap",
      subtitle: "One clock, next-state gates, lockstep bits.",
      theoryEN: [
        "Step back and the synchronous counter is one clean idea: wire a single clock to every flip-flop so they all update on the same edge, and use a small block of combinational logic to decide, before each edge, which flip-flops toggle. That is the entire difference from a ripple counter, and it buys away both of the ripple counter's flaws.",
        "The design procedure is a fixed recipe you can now run on any counter: write the present-to-next count table, read each flip-flop's required excitation (for a T flip-flop, toggle when the bit changes), simplify each toggle input as a function of the current bits, and build it with gates. For a 3-bit binary up counter it gives the memorable T0 = 1, T1 = Q0, T2 = Q0·Q1 - a bit toggles when every lower bit is 1.",
        "From that one core you reach everything else. Feed complements instead and it counts down (toggle when every lower bit is 0). Add a terminal-count detector on a synchronous clear or load and it becomes a MOD-N counter that truncates the sequence cleanly. Put a decoder of ANDed literals on the outputs and each state becomes a one-hot timing pulse.",
        "Hold the marching-band image: one drumbeat, the whole band steps together, the choreography decided in advance by the next-state gates - fast, clean, and glitch-free, unlike the rippling dominoes. The few AND gates you add are a small price for a counter whose speed and cleanliness no longer fall apart as it grows, which is why synchronous counters are the default in real hardware."
      ],
      theoryHI: [
        "एक क़दम पीछे हटिए और synchronous counter एक साफ़ विचार है: एक अकेला clock हर flip-flop से बाँधिए ताकि सब एक ही edge पर update हों, और combinational logic का एक छोटा block वापरिए जो हर edge से पहले तय करे कि कौन से flip-flops toggle करें। यही ripple counter से पूरा फ़र्क़ है, और यह ripple counter के दोनों दोष ख़रीदकर हटा देता है।",
        "design procedure एक तय नुस्ख़ा है जो आप अब किसी भी counter पर चला सकते हैं: present-से-next count table लिखिए, हर flip-flop की ज़रूरी excitation पढ़िए (T flip-flop के लिए, जब bit बदले तब toggle), हर toggle input को मौजूदा bits के function की तरह simplify कीजिए, और इसे gates से बनाइए। एक 3-bit binary up counter के लिए यह यादगार T0 = 1, T1 = Q0, T2 = Q0·Q1 देता है - एक bit तब toggle करता है जब उसके नीचे का हर bit 1 हो।",
        "उस एक core से आप बाक़ी सब तक पहुँचते हैं। इसके बजाय complements खिलाइए और यह नीचे गिनता है (जब हर नीचे का bit 0 हो तब toggle)। एक synchronous clear या load पर एक terminal-count detector जोड़िए और यह एक MOD-N counter बन जाता है जो sequence साफ़ truncate करता है। outputs पर ANDed literals का एक decoder रखिए और हर state एक one-hot timing pulse बन जाती है।",
        "marching-band छवि पकड़िए: एक drumbeat, पूरी band एक साथ क़दम रखती है, नृत्य-रचना next-state gates से पहले तय - तेज़, साफ़, और glitch-free, ripple करते dominoes के उलट। आप जो कुछ AND gates जोड़ते हैं वे एक ऐसे counter के लिए छोटी क़ीमत हैं जिसकी speed और सफ़ाई बढ़ने पर अब नहीं बिखरती, इसीलिए synchronous counters असली hardware में default हैं।"
      ],
      transcriptEN: "Step back and the synchronous counter is one clean idea: wire a single clock to every flip-flop so they all update on the same edge, and use a small block of combinational logic to decide, before each edge, which flip-flops toggle. That's the whole difference from a ripple counter, and it buys away both of its flaws. The design procedure is a fixed recipe: write the present-to-next count table, read each flip-flop's required excitation, simplify each toggle input as a function of the current bits, and build it with gates. For a three-bit up counter it gives T-zero one, T-one Q-zero, T-two Q-zero AND Q-one - a bit toggles when every lower bit is one. Feed complements and it counts down; add a terminal-count detector on a synchronous clear and it becomes a mod-N; decode the outputs and each state becomes a one-hot pulse. Keep the marching-band image: one drumbeat, the whole band steps together, the choreography decided in advance by the gates - fast, clean, glitch-free, unlike the rippling dominoes. A few AND gates are a small price for a counter whose speed no longer collapses as it grows, which is why synchronous counters are the default.",
      transcriptHI: "एक क़दम पीछे हटिए और synchronous counter एक साफ़ विचार है: एक अकेला clock हर flip-flop से बाँधिए ताकि सब एक ही edge पर update हों, और combinational logic का एक छोटा block वापरिए जो हर edge से पहले तय करे कि कौन toggle करे। यही ripple counter से पूरा फ़र्क़ है, और यह इसके दोनों दोष हटा देता है। design procedure एक तय नुस्ख़ा है: present-से-next count table लिखिए, हर flip-flop की ज़रूरी excitation पढ़िए, हर toggle input को मौजूदा bits के function की तरह simplify कीजिए, और gates से बनाइए। एक three-bit up counter के लिए यह T-zero एक, T-one Q-zero, T-two Q-zero AND Q-one देता है - एक bit तब toggle करता है जब नीचे का हर bit एक हो। complements खिलाइए और यह नीचे गिनता है; एक synchronous clear पर terminal-count detector जोड़िए और यह mod-N बन जाता है; outputs decode कीजिए और हर state एक one-hot pulse बन जाती है। marching-band छवि पकड़िए: एक drumbeat, पूरी band एक साथ क़दम, नृत्य-रचना gates से पहले तय - तेज़, साफ़, glitch-free, ripple करते dominoes के उलट। कुछ AND gates एक ऐसे counter के लिए छोटी क़ीमत हैं जिसकी speed बढ़ने पर नहीं ढहती, इसीलिए synchronous counters default हैं।",
      visualNote: "Recap: the flow rail plus the core takeaways as calm prose."
    }
  ],
  flashcards: [
    {
      frontEN: "What defines a synchronous counter?",
      frontHI: "एक synchronous counter को क्या परिभाषित करता है?",
      backEN: "Every flip-flop shares one common clock, so all stages are triggered by the same edge at the same instant and update together - no rippling trigger.",
      backHI: "हर flip-flop एक common clock बाँटता है, तो सारे stages उसी edge से उसी पल trigger होते और एक साथ update होते हैं - कोई rippling trigger नहीं।"
    },
    {
      frontEN: "Why does a synchronous counter need extra gates?",
      frontHI: "एक synchronous counter को अतिरिक्त gates क्यों चाहिए?",
      backEN: "Since the flip-flops no longer clock each other, combinational next-state logic (usually AND gates) must read the current count and drive each flip-flop's toggle input.",
      backHI: "चूँकि flip-flops अब एक-दूसरे को clock नहीं करते, combinational next-state logic (आमतौर पर AND gates) को मौजूदा count पढ़कर हर flip-flop का toggle input चलाना पड़ता है।"
    },
    {
      frontEN: "The four-step design procedure?",
      frontHI: "चार-कदम design procedure?",
      backEN: "1) Write the present->next count table. 2) Read each flip-flop's required excitation. 3) Simplify each input as a function of the current bits. 4) Realise with gates.",
      backHI: "1) present->next count table लिखिए। 2) हर flip-flop की ज़रूरी excitation पढ़िए। 3) हर input को मौजूदा bits के function की तरह simplify कीजिए। 4) gates से साकार कीजिए।"
    },
    {
      frontEN: "T-inputs for a 3-bit binary up counter?",
      frontHI: "एक 3-bit binary up counter के T-inputs?",
      backEN: "T0 = 1, T1 = Q0, T2 = Q0·Q1. Each bit toggles only when every lower bit is 1 - the carry condition of binary counting.",
      backHI: "T0 = 1, T1 = Q0, T2 = Q0·Q1। हर bit तभी toggle करता है जब नीचे का हर bit 1 हो - binary counting की carry condition।"
    },
    {
      frontEN: "How do you make it count down instead?",
      frontHI: "इसे इसके बजाय down कैसे गिनाएँ?",
      backEN: "Toggle a bit when every lower bit is 0: feed the complements. T0 = 1, T1 = Q0', T2 = Q0'·Q1'. It's the borrow, the mirror of the carry.",
      backHI: "एक bit को तब toggle कीजिए जब नीचे का हर bit 0 हो: complements खिलाइए। T0 = 1, T1 = Q0', T2 = Q0'·Q1'। यही borrow है, carry का दर्पण।"
    },
    {
      frontEN: "How is a MOD-N counter made?",
      frontHI: "एक MOD-N counter कैसे बनता है?",
      backEN: "Use ceil(log2 N) flip-flops; add an AND detector for the terminal count N-1 and route it to a synchronous clear/load, so it resets on the next edge - cleanly, no glitch.",
      backHI: "ceil(log2 N) flip-flops वापरिए; terminal count N-1 के लिए एक AND detector जोड़कर उसे एक synchronous clear/load तक route कीजिए, तो यह अगले edge पर reset होता है - साफ़, कोई glitch नहीं।"
    },
    {
      frontEN: "How do you decode a single count?",
      frontHI: "एक अकेली count कैसे decode करते हैं?",
      backEN: "AND the output literals of its minterm - Q where the bit is 1, Q' where it is 0. E.g. state 5 = 101 -> Q2·Q1'·Q0. Exactly one decode line is high at a time.",
      backHI: "इसके minterm के output literals AND कीजिए - जहाँ bit 1 वहाँ Q, जहाँ 0 वहाँ Q'। जैसे state 5 = 101 -> Q2·Q1'·Q0। एक समय ठीक एक decode line high होती है।"
    },
    {
      frontEN: "Ripple vs synchronous, in one line?",
      frontHI: "Ripple बनाम synchronous, एक पंक्ति में?",
      backEN: "Ripple: one clock chained stage to stage, delay N·t_pd, slow and glitchy but cheapest. Synchronous: one clock to all, delay ~t_pcq+t_gate, fast and clean for a few gates.",
      backHI: "Ripple: एक clock stage-दर-stage जुड़ा, delay N·t_pd, धीमा और glitchy पर सबसे सस्ता। Synchronous: एक clock सबको, delay ~t_pcq+t_gate, कुछ gates में तेज़ और साफ़।"
    }
  ],
  quiz: [
    {
      questionEN: "What is the defining feature of a synchronous counter?",
      questionHI: "एक synchronous counter की परिभाषित विशेषता क्या है?",
      options: [
        "Only the first flip-flop is clocked; the rest ripple",
        "Every flip-flop is driven by the same common clock",
        "It uses no flip-flops, only combinational logic",
        "Each stage is clocked by the previous stage's output"
      ],
      answerIndex: 1,
      explainEN: "In a synchronous counter one common clock reaches every flip-flop, so all stages are triggered by the same edge at the same instant. (The other options describe a ripple counter.)",
      explainHI: "एक synchronous counter में एक common clock हर flip-flop तक पहुँचता है, तो सारे stages उसी edge से उसी पल trigger होते हैं। (बाक़ी विकल्प एक ripple counter को बताते हैं।)"
    },
    {
      questionEN: "For a 3-bit binary up counter with T flip-flops, what is T2?",
      questionHI: "T flip-flops वाले एक 3-bit binary up counter के लिए, T2 क्या है?",
      options: ["T2 = 1", "T2 = Q1", "T2 = Q0·Q1", "T2 = Q0 + Q1"],
      answerIndex: 2,
      explainEN: "Bit 2 toggles only when a carry reaches it, i.e. when both lower bits are 1, so T2 = Q0·Q1. (T0 = 1 and T1 = Q0 complete the set.)",
      explainHI: "Bit 2 तभी toggle करता है जब carry उस तक पहुँचे, यानी जब दोनों नीचे के bits 1 हों, तो T2 = Q0·Q1। (T0 = 1 और T1 = Q0 सेट पूरा करते हैं।)"
    },
    {
      questionEN: "Why does a synchronous counter need combinational logic between stages?",
      questionHI: "एक synchronous counter को stages के बीच combinational logic क्यों चाहिए?",
      options: [
        "To slow the clock down so bits settle",
        "Because the flip-flops no longer clock each other, so something must decide which toggle",
        "To convert the outputs to decimal",
        "To generate the clock signal itself"
      ],
      answerIndex: 1,
      explainEN: "With a shared clock the stages can't take turns toggling, so next-state logic reads the current count and drives each flip-flop's toggle input - deciding who flips on the next edge.",
      explainHI: "साझा clock के साथ stages बारी-बारी toggle नहीं कर सकते, तो next-state logic मौजूदा count पढ़कर हर flip-flop का toggle input चलाती है - तय करते हुए अगले edge पर कौन पलटे।"
    },
    {
      questionEN: "In the design procedure with a T flip-flop, when must T be 1 for a given bit?",
      questionHI: "T flip-flop वाली design procedure में, किसी bit के लिए T कब 1 होना चाहिए?",
      options: [
        "When the bit is 1 in the present state",
        "When the bit changes (differs) between present and next state",
        "Always",
        "When the bit is the most-significant bit"
      ],
      answerIndex: 1,
      explainEN: "A T flip-flop obeys Q(t+1) = T ⊕ Q, so T = 1 exactly when the bit must change, and T = 0 when it stays - i.e. T is the XOR of the present and next values.",
      explainHI: "एक T flip-flop Q(t+1) = T ⊕ Q मानता है, तो T = 1 ठीक तब जब bit को बदलना हो, और T = 0 जब वही रहे - यानी T present और next मानों का XOR है।"
    },
    {
      questionEN: "How does the same 3-bit design count down instead of up?",
      questionHI: "वही 3-bit design up के बजाय down कैसे गिनता है?",
      options: [
        "Reverse the clock polarity only",
        "Feed the complements: T1 = Q0', T2 = Q0'·Q1' (toggle when every lower bit is 0)",
        "Remove the AND gate",
        "Add one more flip-flop"
      ],
      answerIndex: 1,
      explainEN: "Down-counting toggles a bit when every lower bit is 0 (the borrow), so you AND the complemented lower outputs: T0 = 1, T1 = Q0', T2 = Q0'·Q1'.",
      explainHI: "नीचे गिनना एक bit को तब toggle करता है जब नीचे का हर bit 0 हो (borrow), तो आप complemented नीचे वाले outputs AND करते हैं: T0 = 1, T1 = Q0', T2 = Q0'·Q1'।"
    },
    {
      questionEN: "How is a MOD-6 counter built from a 3-bit synchronous counter?",
      questionHI: "एक MOD-6 counter एक 3-bit synchronous counter से कैसे बनता है?",
      options: [
        "Remove one flip-flop so only 6 states remain",
        "Detect the terminal count 5 and synchronously clear/load to 0 on the next edge",
        "Run the clock six times faster",
        "It is impossible with only 3 flip-flops"
      ],
      answerIndex: 1,
      explainEN: "A MOD-6 uses 3 flip-flops but truncates the cycle: an AND gate detects the terminal count 5 = 101 (Q2·Q0) and drives a synchronous clear, so on the next edge it resets to 0 cleanly - counting 0 through 5.",
      explainHI: "एक MOD-6, 3 flip-flops वापरता है पर cycle truncate करता है: एक AND gate terminal count 5 = 101 (Q2·Q0) detect करके एक synchronous clear चलाता है, तो अगले edge पर यह साफ़ 0 पर reset होता है - 0 से 5 गिनते।"
    },
    {
      questionEN: "Compared with a ripple counter, why does a synchronous counter's top speed not collapse as it grows?",
      questionHI: "एक ripple counter की तुलना में, एक synchronous counter की top speed बढ़ने पर क्यों नहीं ढहती?",
      options: [
        "Its settling time is N × t_pd, same as ripple",
        "Its bits settle within one clock-to-Q delay plus one gate delay, independent of N",
        "It has no propagation delay at all",
        "Because it uses fewer flip-flops"
      ],
      answerIndex: 1,
      explainEN: "All flip-flops are clocked together, so the whole word settles in ~t_pcq + t_gate regardless of width, unlike a ripple counter whose worst-case delay grows as N × t_pd.",
      explainHI: "सारे flip-flops एक साथ clock होते हैं, तो पूरा word width चाहे कुछ भी हो ~t_pcq + t_gate में settle होता है, एक ripple counter के उलट जिसका worst-case delay N × t_pd के रूप में बढ़ता है।"
    }
  ]
};
