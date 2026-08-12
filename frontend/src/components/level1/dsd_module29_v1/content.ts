import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/29 - Latches, "The First Memory Cell".
 * Source: Sequential facts batch A (module 29). A latch is the simplest memory
 * element: cross-couple two gates (feed each output back to the other's input)
 * and the loop holds its last state while powered. We build the NOR SR latch
 * (active-HIGH: 10 Set, 01 Reset, 00 Hold, 11 Invalid), the NAND SR latch
 * (active-LOW, inputs S',R': 01 Set, 10 Reset, 11 Hold, 00 Forbidden), expose the
 * S=R=1 failure (Q=Q'=0 contradiction + race + unpredictable settle), add an
 * EN/clock through AND gates to make the gated SR latch (EN=0 locked, EN=1
 * transparent, 1,1 still forbidden), and finally fix everything with the gated D
 * latch by forcing R = D' so the inputs are always complementary. Latches are
 * level-sensitive / transparent - Q follows D the whole time EN=1 - and that
 * transparent window is exactly the flaw edge-triggered flip-flops later fix.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Latches - The First Memory Cell",
  moduleSubtitle: "Cross-couple two gates and a plain combinational circuit suddenly remembers: how the SR latch is born, why S=R=1 is forbidden, and how the gated D latch makes memory safe.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The First Memory Cell",
      kind: "cover",
      subtitle: "Feed a gate's output back to an input and the circuit stops forgetting - that feedback loop is memory.",
      theoryEN: [
        "Every circuit you have built so far was combinational: its output depended only on the inputs present right now, with no memory of the past. This module builds the first circuit that remembers. The trick is astonishingly small - take two logic gates and cross-couple them, meaning you feed each gate's output back into the other gate's input, forming a loop.",
        "That feedback loop is where memory is born. Once the loop settles on a value, it keeps driving itself, so the stored bit persists even after you remove the input that set it. Engineers call that stored, self-sustaining bit the state, and the element that holds it is called a latch.",
        "You will build two versions of the basic latch. The NOR SR latch is active-HIGH: raise S to Set the output to 1, raise R to Reset it to 0, hold both low to remember. The NAND SR latch is the same idea drawn with NAND gates and active-LOW inputs S' and R'. Both share one dangerous input combination that we will study carefully - the forbidden state.",
        "Then we make the latch controllable. Gating the inputs with an enable line (EN, often a clock) gives the gated SR latch: when EN is 0 the latch is locked and simply holds, and when EN is 1 it becomes transparent and passes changes through. Finally we fix the forbidden state entirely with the gated D latch, which forces the two inputs to always be complements so the illegal combination can never occur.",
        "Hold onto one caution for the whole module: a latch is transparent. While the enable is high, the output follows the data continuously, for the entire width of the pulse. That transparent window is genuinely useful here, but it is also the single flaw that the edge-triggered flip-flops of the next module are built to eliminate."
      ],
      theoryHI: [
        "अब तक आपने जो भी circuit बनाया वह combinational था: उसका output सिर्फ़ अभी मौजूद inputs पर निर्भर था, बीते की कोई memory नहीं। इस module में हम पहला circuit बनाते हैं जो याद रखता है। तरकीब हैरान कर देने वाली छोटी है - दो logic gates लीजिए और उन्हें cross-couple कीजिए, यानी हर gate का output दूसरे gate के input में वापस feed कीजिए, एक loop बनाते हुए।",
        "यही feedback loop वह जगह है जहाँ memory जन्म लेती है। एक बार loop किसी मान पर settle हो जाए, वह ख़ुद को चलाता रहता है, तो stored bit उस input के हटने के बाद भी बना रहता है जिसने उसे set किया था। Engineer उस stored, ख़ुद-को-बनाए-रखते bit को state कहते हैं, और जो element इसे थामे रहता है उसे latch कहते हैं।",
        "आप basic latch के दो रूप बनाएँगे। NOR SR latch active-HIGH है: S को उठाइए तो output 1 पर Set, R को उठाइए तो 0 पर Reset, दोनों low रखिए तो याद। NAND SR latch वही विचार है NAND gates से बना और active-LOW inputs S' और R' के साथ। दोनों एक ख़तरनाक input combination साझा करते हैं जिसे हम ध्यान से पढ़ेंगे - forbidden state।",
        "फिर हम latch को नियंत्रित बनाते हैं। inputs को एक enable line (EN, अक्सर एक clock) से gate करना gated SR latch देता है: जब EN 0 हो तो latch locked होकर बस hold करता है, और जब EN 1 हो तो यह transparent बन जाता है और बदलाव को आगे pass कर देता है। अंत में हम forbidden state को पूरी तरह ठीक करते हैं gated D latch से, जो दोनों inputs को हमेशा एक-दूसरे का complement बना देता है ताकि अवैध combination कभी हो ही न सके।",
        "पूरे module के लिए एक चेतावनी पकड़े रखिए: latch transparent होता है। जब तक enable high है, output लगातार data का पीछा करता है, पूरे pulse की चौड़ाई भर। वह transparent window यहाँ सचमुच उपयोगी है, पर यही एकमात्र दोष भी है जिसे अगले module के edge-triggered flip-flops मिटाने के लिए बनाए गए हैं।"
      ],
      transcriptEN: "Everything you've built so far was combinational - output depends only on the inputs present right now, with no memory. This module builds the first circuit that remembers. The trick is tiny: take two gates and cross-couple them, feeding each output back into the other's input to form a loop. That loop is memory. Once it settles on a value it keeps driving itself, so the bit persists after you remove the input that set it - that stored bit is the state, and the element is a latch. We'll build the NOR SR latch, active-high, and the NAND SR latch, active-low, study their shared forbidden input, add an enable to make the gated SR latch, and finally fix the forbidden state with the gated D latch. One caution throughout: a latch is transparent - while enable is high the output follows the data the whole time, and that transparent window is exactly what flip-flops later fix.",
      transcriptHI: "अब तक आपने जो बनाया वह combinational था - output सिर्फ़ अभी मौजूद inputs पर, कोई memory नहीं। इस module में पहला circuit जो याद रखता है। तरकीब छोटी है: दो gates लीजिए और cross-couple कीजिए, हर output दूसरे के input में वापस feed करके एक loop बनाइए। वही loop memory है। एक बार किसी मान पर settle हो जाए वह ख़ुद को चलाता रहता है, तो bit उस input के हटने पर भी बना रहता है - वही stored bit state है, और element latch है। हम NOR SR latch बनाएँगे, active-high, और NAND SR latch, active-low, उनके साझा forbidden input को पढ़ेंगे, एक enable जोड़कर gated SR latch बनाएँगे, और अंत में gated D latch से forbidden state ठीक करेंगे। एक चेतावनी: latch transparent है - जब enable high है output पूरे समय data का पीछा करता है, और वही transparent window आगे flip-flops ठीक करते हैं।",
      visualNote: "Hero: the live cross-coupled NOR SR latch. Toggle S and R and watch Q / Q' settle and then hold when both go low."
    },
    {
      id: "S01_Video",
      label: "Latches, Where Memory Begins",
      kind: "video",
      subtitle: "A short film: how a feedback loop turns two gates into a one-bit memory.",
      theoryEN: [
        "Before you watch, fix the core mechanism in your mind. A latch is two cross-coupled gates. Cross-coupled means gate one's output wire runs back to gate two's input, and gate two's output wire runs back to gate one's input. The two outputs are Q and its complement Q', and they hold each other steady.",
        "That mutual holding is the whole story. When both control inputs are inactive, each gate keeps re-asserting whatever the other is already producing, so the pair locks onto its last value and remembers it indefinitely. Remove your hand and the bit stays.",
        "The controls just nudge the loop. In the NOR SR latch, S (set) forces Q to 1, R (reset) forces Q to 0, and 00 means leave it alone. Exactly one thing may not be asked for: setting and resetting at the same time. S=R=1 tries to force Q to be both 1 and 0, which the loop cannot honour.",
        "Keep one running example: start the latch holding Q=1. Pulse R high then low - Q resets to 0 and stays 0 after R returns low. Pulse S high then low - Q sets to 1 and stays. The pulses write; the loop remembers. That persistence-after-the-pulse is the difference between combinational and sequential logic."
      ],
      theoryHI: [
        "देखने से पहले, core तंत्र मन में जमा लीजिए। एक latch दो cross-coupled gates है। Cross-coupled का मतलब gate एक का output wire वापस gate दो के input तक जाता है, और gate दो का output wire वापस gate एक के input तक। दोनों outputs हैं Q और उसका complement Q', और ये एक-दूसरे को स्थिर थामे रखते हैं।",
        "वही आपसी थामना पूरी कहानी है। जब दोनों control inputs निष्क्रिय हों, हर gate वही फिर से जताता रहता है जो दूसरा पहले से बना रहा है, तो जोड़ी अपने आख़िरी मान पर lock हो जाती है और उसे अनिश्चित काल तक याद रखती है। हाथ हटाइए और bit बना रहता है।",
        "Controls बस loop को हल्का धक्का देते हैं। NOR SR latch में, S (set) Q को 1 पर मजबूर करता है, R (reset) Q को 0 पर, और 00 का मतलब उसे छोड़ दो। ठीक एक चीज़ नहीं माँगी जा सकती: एक ही समय set और reset करना। S=R=1 Q को एक साथ 1 और 0 दोनों बनाने की कोशिश करता है, जिसे loop पूरा नहीं कर सकता।",
        "एक उदाहरण मन में रखिए: latch को Q=1 थामे शुरू कीजिए। R को high फिर low pulse कीजिए - Q 0 पर reset होता है और R के वापस low होने पर भी 0 रहता है। S को high फिर low pulse कीजिए - Q 1 पर set होता है और रहता है। Pulses लिखते हैं; loop याद रखता है। Pulse के बाद वही बने रहना combinational और sequential logic का फ़र्क़ है।"
      ],
      transcriptEN: "Before you watch, fix the core mechanism. A latch is two cross-coupled gates: gate one's output runs back to gate two's input and vice versa. The two outputs are Q and Q-prime, and they hold each other steady. When both controls are inactive, each gate keeps re-asserting what the other already produces, so the pair locks onto its last value and remembers it. The controls just nudge the loop: in the NOR SR latch, S sets Q to one, R resets Q to zero, and zero-zero means leave it alone. The one thing you may not ask for is set and reset together - S equals R equals one tries to force Q to be both one and zero, which the loop can't honour. Run one example: hold Q at one, pulse R high then low and Q resets to zero and stays; pulse S high then low and Q sets to one and stays. The pulses write, the loop remembers - that persistence after the pulse is the whole difference between combinational and sequential logic.",
      transcriptHI: "देखने से पहले core तंत्र जमा लीजिए। latch दो cross-coupled gates है: gate एक का output वापस gate दो के input तक और उल्टा भी। दोनों outputs Q और Q-prime हैं, और एक-दूसरे को स्थिर थामे रखते हैं। जब दोनों controls निष्क्रिय हों, हर gate वही फिर जताता है जो दूसरा बना रहा है, तो जोड़ी अपने आख़िरी मान पर lock होकर याद रखती है। Controls बस loop को धक्का देते हैं: NOR SR latch में S Q को एक पर set, R Q को शून्य पर reset, और शून्य-शून्य मतलब छोड़ दो। जो नहीं माँगा जा सकता वह है set और reset एक साथ - S बराबर R बराबर एक Q को एक और शून्य दोनों बनाने की कोशिश करता है, जो loop पूरा नहीं कर सकता। एक उदाहरण: Q को एक पर थामिए, R high फिर low pulse कीजिए Q शून्य पर reset होकर रहता है; S high फिर low pulse कीजिए Q एक पर set होकर रहता है। Pulses लिखते हैं, loop याद रखता है - pulse के बाद वही बने रहना combinational और sequential logic का पूरा फ़र्क़ है।",
      visualNote: "Animated explainer: two cross-coupled gates, Q and Q' feeding back; a set pulse writes 1, a reset pulse writes 0, and the bit persists between pulses."
    },
    {
      id: "S02_Facts",
      label: "Memory Is Born From Cross-Coupling",
      kind: "theory",
      subtitle: "Feedback of an output back to an input turns a gate pair into a bistable that holds its last state.",
      theoryEN: [
        "Start with the single idea that separates sequential logic from everything before it: feedback. In a combinational circuit signals flow strictly forward, inputs to outputs, and the moment inputs change the output recomputes with no memory of what came before. Cross-coupling breaks that one-way flow by routing an output wire back to an input, and that loop is what lets a circuit hold on to a value.",
        "Picture the smallest possible memory: two inverters wired in a ring, output of the first driving the input of the second, output of the second driving the input of the first. Call the two nodes Q and Q'. If Q is 1, the first inverter forces Q' to 0, and Q'=0 feeds the second inverter which forces Q back to 1 - the state reinforces itself. The mirror case with Q=0 is equally stable. Two stable resting points, one for each stored bit, is exactly what the word bistable means.",
        "Because the loop keeps re-driving itself, the stored bit survives with no external input at all, for as long as the circuit is powered. That surviving value is the state - the circuit's memory of the last thing that happened to it. Everything else in this module is just adding controlled ways to write a chosen value into this loop.",
        "The plain two-inverter ring has one shortcoming: it holds a bit but gives you no way to change it, because inverters have no spare input. The fix is to replace each inverter with a two-input NOR or NAND gate. The extra input on each gate becomes a control line - Set and Reset - and now you can force the loop into the 1 state or the 0 state on demand while keeping the self-holding feedback intact.",
        "So the whole latch family grows from one seed. Cross-coupling gives you memory; a second input on each gate gives you control; and the rest of the story is about controlling that memory safely - which is where the forbidden state, the enable, and the D-input trick all come in."
      ],
      theoryHI: [
        "उस एक विचार से शुरू कीजिए जो sequential logic को उससे पहले की हर चीज़ से अलग करता है: feedback। combinational circuit में signals सख़्ती से आगे बहते हैं, inputs से outputs की ओर, और जिस पल inputs बदलें output फिर से गिन लेता है, पहले के किसी की memory के बिना। Cross-coupling उस एकतरफ़ा बहाव को तोड़ता है एक output wire को वापस input तक भेजकर, और वही loop एक circuit को किसी मान को थामे रखने देता है।",
        "सबसे छोटी संभव memory सोचिए: दो inverters एक ring में जुड़े, पहले का output दूसरे के input को चलाता, दूसरे का output पहले के input को चलाता। दोनों nodes को Q और Q' कहिए। अगर Q 1 है, पहला inverter Q' को 0 पर मजबूर करता है, और Q'=0 दूसरे inverter को feed करता है जो Q को वापस 1 पर मजबूर करता है - state ख़ुद को मज़बूत करता है। Q=0 वाला दर्पण-रूप उतना ही स्थिर है। दो स्थिर विश्राम-बिंदु, हर stored bit के लिए एक, यही bistable शब्द का ठीक अर्थ है।",
        "चूँकि loop ख़ुद को फिर-फिर चलाता रहता है, stored bit बिना किसी बाहरी input के भी बचा रहता है, जब तक circuit को power मिलती है। वही बचता मान state है - circuit की उस आख़िरी घटना की memory जो उसके साथ हुई। इस module में बाक़ी सब बस इस loop में एक चुना मान लिखने के नियंत्रित तरीक़े जोड़ना है।",
        "सादे दो-inverter ring में एक कमी है: यह bit थामता है पर उसे बदलने का कोई रास्ता नहीं देता, क्योंकि inverters में कोई फ़ालतू input नहीं। हल है हर inverter को एक two-input NOR या NAND gate से बदलना। हर gate पर वह अतिरिक्त input एक control line बन जाता है - Set और Reset - और अब आप loop को माँग पर 1 state या 0 state में मजबूर कर सकते हैं, ख़ुद-को-थामते feedback को बरक़रार रखते हुए।",
        "तो पूरा latch परिवार एक बीज से उगता है। Cross-coupling memory देता है; हर gate पर दूसरा input नियंत्रण देता है; और बाक़ी कहानी उस memory को सुरक्षित रूप से नियंत्रित करने की है - जहाँ forbidden state, enable, और D-input की तरकीब सब आते हैं।"
      ],
      transcriptEN: "Start with the one idea that separates sequential logic from everything before it: feedback. In a combinational circuit signals flow strictly forward and the output recomputes with no memory. Cross-coupling routes an output wire back to an input, and that loop lets the circuit hold a value. Picture the smallest memory: two inverters in a ring, each driving the other, with nodes Q and Q-prime. If Q is one, the first inverter forces Q-prime to zero, which feeds back to force Q to one - the state reinforces itself; Q equals zero is equally stable. Two stable resting points, one per stored bit, is what bistable means. Because the loop keeps re-driving itself, the bit survives with no input as long as there's power - that surviving value is the state. The plain ring can't be changed because inverters have no spare input, so we swap each inverter for a two-input NOR or NAND; the extra input becomes Set and Reset, letting us write a chosen value while keeping the self-holding feedback.",
      transcriptHI: "उस एक विचार से शुरू कीजिए जो sequential logic को अलग करता है: feedback। combinational circuit में signals सख़्ती से आगे बहते हैं और output बिना memory के फिर गिनता है। Cross-coupling एक output wire वापस input तक भेजता है, और वह loop circuit को मान थामने देता है। सबसे छोटी memory: दो inverters एक ring में, हर एक दूसरे को चलाता, nodes Q और Q-prime। अगर Q एक है, पहला inverter Q-prime को शून्य पर मजबूर करता है, जो वापस Q को एक पर मजबूर करता है - state ख़ुद को मज़बूत करता है; Q बराबर शून्य उतना ही स्थिर। दो स्थिर बिंदु, हर stored bit के लिए एक, यही bistable है। चूँकि loop ख़ुद को चलाता रहता है, bit बिना input के भी बचा रहता है जब तक power है - वही state है। सादे ring को बदला नहीं जा सकता क्योंकि inverters में फ़ालतू input नहीं, तो हम हर inverter को two-input NOR या NAND से बदलते हैं; अतिरिक्त input Set और Reset बनता है, हमें ख़ुद-थामते feedback के साथ मान लिखने देता है।",
      visualNote: "Bespoke: a two-node cross-coupled ring (Q and Q'); flip the stored bit and watch the feedback pulses re-assert it. Then note the extra gate input becomes Set/Reset."
    },
    {
      id: "S03_SRNor",
      label: "The NOR SR Latch",
      kind: "theory",
      subtitle: "Active-HIGH: 10 Set, 01 Reset, 00 Hold, 11 Invalid - every row computed from the gates.",
      theoryEN: [
        "The NOR SR latch is the classic active-HIGH memory cell. It is two cross-coupled NOR gates: the top gate takes R and the fed-back Q' and produces Q, the bottom gate takes S and the fed-back Q and produces Q'. Active-HIGH means a control does its job when it is a 1 - you raise S to set, you raise R to reset.",
        "Read the four input combinations one at a time. With S=1, R=0 the latch Sets: Q is driven to 1 and Q' to 0. With S=0, R=1 it Resets: Q goes to 0 and Q' to 1. These two are the write operations, and the outputs are always proper complements.",
        "With S=0, R=0 the latch Holds. Feed 0 into a NOR gate and its output is simply the complement of the other input, so each gate just re-inverts the value coming around the loop - the previous Q is preserved unchanged. This is the memory case: no input asserted, last state remembered. In the truth table the Hold row is written as Q(t+1) = Q, meaning next equals present.",
        "The remaining combination, S=1, R=1, is the Invalid or forbidden state, and it is the one flaw of the SR latch. A NOR gate with any input at 1 outputs 0, so both gates output 0 at once: Q=0 AND Q'=0. That violates the basic promise that Q and Q' are complements, and it leads to a race when the inputs are released, which the next page dissects in full.",
        "The whole behaviour is captured by the characteristic equation Q(t+1) = S + R'.Q, valid under the constraint S.R = 0 (that is, you promise never to raise both). Read it plainly: the output becomes 1 if you Set (S=1), otherwise it keeps its old value Q as long as you are not Resetting (R=0). Toggle the live latch beside this text - every Set, Reset and Hold you see is computed straight from the cross-coupled NOR gates."
      ],
      theoryHI: [
        "NOR SR latch classic active-HIGH memory cell है। यह दो cross-coupled NOR gates है: ऊपरी gate R और वापस-feed हुआ Q' लेता है और Q बनाता है, निचला gate S और वापस-feed हुआ Q लेता है और Q' बनाता है। Active-HIGH का मतलब एक control अपना काम तब करता है जब वह 1 हो - set के लिए S उठाइए, reset के लिए R उठाइए।",
        "चारों input combinations एक-एक करके पढ़िए। S=1, R=0 पर latch Set करता है: Q को 1 और Q' को 0 पर चलाया जाता है। S=0, R=1 पर यह Reset करता है: Q 0 पर और Q' 1 पर जाता है। ये दोनों write operations हैं, और outputs हमेशा सही complements होते हैं।",
        "S=0, R=0 पर latch Hold करता है। NOR gate में 0 feed कीजिए तो उसका output बस दूसरे input का complement होता है, तो हर gate loop में आते मान को फिर से invert कर देता है - पिछला Q बिना बदले सुरक्षित रहता है। यही memory case है: कोई input नहीं जताया, आख़िरी state याद। Truth table में Hold row को Q(t+1) = Q लिखा जाता है, यानी अगला बराबर मौजूदा।",
        "बचा combination, S=1, R=1, Invalid या forbidden state है, और यही SR latch का एकमात्र दोष है। किसी भी input पर 1 वाला NOR gate 0 output देता है, तो दोनों gates एक साथ 0 output देते हैं: Q=0 और Q'=0। यह इस बुनियादी वादे का उल्लंघन है कि Q और Q' complements हैं, और inputs छोड़ने पर यह एक race की ओर ले जाता है, जिसे अगला page पूरा चीरता है।",
        "पूरा बर्ताव characteristic equation Q(t+1) = S + R'.Q से पकड़ा जाता है, जो constraint S.R = 0 के तहत मान्य है (यानी आप वादा करते हैं कि दोनों कभी नहीं उठाएँगे)। इसे सीधा पढ़िए: output 1 बन जाता है अगर आप Set करें (S=1), वरना जब तक आप Reset न कर रहे हों (R=0) यह अपना पुराना मान Q रखता है। पास वाले live latch को toggle कीजिए - जो भी Set, Reset और Hold दिखता है वह सीधे cross-coupled NOR gates से गिना जाता है।"
      ],
      transcriptEN: "The NOR SR latch is the classic active-high memory cell: two cross-coupled NOR gates, the top taking R and fed-back Q-prime to make Q, the bottom taking S and fed-back Q to make Q-prime. Active-high means a control acts when it's one. Read the four combinations: S one R zero Sets, Q goes to one; S zero R one Resets, Q goes to zero - these are the writes, and the outputs are proper complements. S zero R zero Holds: a NOR with a zero input just inverts the other input, so each gate re-inverts the looped value and the previous Q is preserved - that's memory, written Q-next equals Q. The last case, S one R one, is invalid: a NOR with any one-input outputs zero, so both gates output zero at once, Q and Q-prime both zero, breaking complementarity and setting up a race on release. The characteristic equation is Q-next equals S plus R-prime Q, valid when S dot R equals zero. Toggle the live latch - every Set, Reset and Hold is computed from the gates.",
      transcriptHI: "NOR SR latch classic active-high memory cell है: दो cross-coupled NOR gates, ऊपरी R और वापस-feed Q-prime लेकर Q बनाता, निचला S और वापस-feed Q लेकर Q-prime। Active-high मतलब control तब काम करता है जब वह एक हो। चारों combinations पढ़िए: S एक R शून्य Set करता, Q एक पर; S शून्य R एक Reset करता, Q शून्य पर - ये writes हैं, outputs सही complements। S शून्य R शून्य Hold: शून्य input वाला NOR बस दूसरे input को invert करता है, तो हर gate looped मान फिर invert करता और पिछला Q सुरक्षित रहता - वही memory, Q-next बराबर Q। आख़िरी case, S एक R एक, invalid है: किसी एक-input वाला NOR शून्य देता है, तो दोनों gates एक साथ शून्य, Q और Q-prime दोनों शून्य, complementarity तोड़ते और छोड़ने पर race बनाते। Characteristic equation Q-next बराबर S plus R-prime Q, मान्य जब S dot R बराबर शून्य। live latch toggle कीजिए - हर Set, Reset, Hold gates से गिना जाता है।",
      visualNote: "SRLatchViz gate=NOR (live) beside a computed 4-row StateTable: S,R -> Q(t+1), Action (Set/Reset/Hold/Invalid), all derived by iterating the cross-coupled NOR gates."
    },
    {
      id: "S04_SRNand",
      label: "The NAND SR Latch",
      kind: "theory",
      subtitle: "Active-LOW, inputs S' and R': 01 Set, 10 Reset, 11 Hold, 00 Forbidden - the NOR table, mirrored.",
      theoryEN: [
        "The same latch can be drawn with two cross-coupled NAND gates instead of NORs, and it is the version you will meet most often in real hardware because NAND gates are cheap and universal. The catch is that a NAND latch is active-LOW: its inputs do their work when they are 0, not 1, so we label them S' and R' to remind us that a low pulse is the active one.",
        "Everything flips relative to the NOR version. A NAND gate outputs 1 whenever any input is 0, so pulling S' low forces its gate output high and Sets Q to 1; pulling R' low forces the other gate high and Resets Q to 0. In shorthand: S'=0, R'=1 Sets, and S'=1, R'=0 Resets.",
        "The Hold state is now S'=1, R'=1. With both inputs high, each NAND behaves like an inverter of the looped signal (a NAND with one input tied to 1 is just a NOT of the other), so the cross-coupled pair preserves its last value exactly as the NOR latch did with 0,0. High-high is the quiet, remembering state here.",
        "The forbidden combination moves too: for the NAND latch it is S'=0, R'=0. Any 0 on a NAND forces its output to 1, so both gates output 1 at once, giving Q=1 AND Q'=1 - again a broken complement pair and the same race hazard on release. Notice the pattern: the NAND latch is the exact logical mirror of the NOR latch, with active levels and the forbidden corner swapped from 1s to 0s.",
        "Because the behaviour is identical up to inversion, everything you learned about Set, Reset, Hold and the forbidden state carries straight over - you just translate active-HIGH thinking into active-LOW. The live NAND latch beside this text is computed by the very same cross-coupled logic; only the gate type and the input labels S', R' have changed."
      ],
      theoryHI: [
        "वही latch NORs की जगह दो cross-coupled NAND gates से भी बनाया जा सकता है, और असली hardware में आप यही रूप सबसे ज़्यादा देखेंगे क्योंकि NAND gates सस्ते और universal हैं। पेच यह है कि NAND latch active-LOW है: इसके inputs अपना काम तब करते हैं जब वे 0 हों, 1 नहीं, तो हम उन्हें S' और R' नाम देते हैं ताकि याद रहे कि active pulse low है।",
        "NOR रूप के मुक़ाबले सब उलट जाता है। NAND gate 1 output देता है जब भी कोई input 0 हो, तो S' को low खींचना उसके gate output को high करके Q को 1 पर Set करता है; R' को low खींचना दूसरे gate को high करके Q को 0 पर Reset करता है। संक्षेप में: S'=0, R'=1 Set करता है, और S'=1, R'=0 Reset करता है।",
        "Hold state अब S'=1, R'=1 है। दोनों inputs high के साथ, हर NAND looped signal के inverter जैसा बर्ताव करता है (एक input 1 से बँधा NAND बस दूसरे का NOT है), तो cross-coupled जोड़ी अपना आख़िरी मान ठीक वैसे ही सुरक्षित रखती है जैसे NOR latch ने 0,0 पर रखा था। यहाँ high-high शांत, याद रखने वाली state है।",
        "Forbidden combination भी खिसकता है: NAND latch के लिए यह S'=0, R'=0 है। NAND पर कोई भी 0 उसके output को 1 पर मजबूर करता है, तो दोनों gates एक साथ 1 output देते हैं, देते हुए Q=1 और Q'=1 - फिर टूटी complement जोड़ी और छोड़ने पर वही race hazard। pattern देखिए: NAND latch NOR latch का ठीक logical दर्पण है, active levels और forbidden कोना 1 से 0 में बदले हुए।",
        "चूँकि बर्ताव inversion तक समान है, Set, Reset, Hold और forbidden state के बारे में जो कुछ आपने सीखा वह सीधे यहाँ आ जाता है - आप बस active-HIGH सोच को active-LOW में अनुवाद करते हैं। पास वाला live NAND latch उसी cross-coupled logic से गिना जाता है; सिर्फ़ gate type और input labels S', R' बदले हैं।"
      ],
      transcriptEN: "The same latch can use two cross-coupled NANDs instead of NORs, and it's the version you meet most in real hardware because NANDs are cheap and universal. The catch: a NAND latch is active-low - inputs act when they're zero, so we label them S-prime and R-prime. Everything flips: a NAND outputs one whenever any input is zero, so pulling S-prime low sets Q to one, and pulling R-prime low resets Q to zero. So S-prime zero R-prime one Sets, S-prime one R-prime zero Resets. Hold is now one-one: with both inputs high each NAND acts as an inverter of the looped signal, preserving the last value just as the NOR latch did at zero-zero. The forbidden combination moves to zero-zero: any zero forces a NAND output to one, so both gates output one, Q and Q-prime both one - a broken complement pair with the same race on release. The NAND latch is the exact logical mirror of the NOR latch, active levels and the forbidden corner swapped from ones to zeros. The live NAND latch is computed by the same cross-coupled logic; only the gate type and labels changed.",
      transcriptHI: "वही latch NORs की जगह दो cross-coupled NANDs वापर सकता है, और असली hardware में यही रूप सबसे ज़्यादा मिलता है क्योंकि NANDs सस्ते और universal हैं। पेच: NAND latch active-low है - inputs तब काम करते हैं जब शून्य हों, तो हम उन्हें S-prime और R-prime कहते हैं। सब उलट जाता है: NAND एक देता है जब कोई input शून्य हो, तो S-prime को low खींचना Q को एक पर set करता, R-prime को low खींचना Q को शून्य पर reset। तो S-prime शून्य R-prime एक Set, S-prime एक R-prime शून्य Reset। Hold अब एक-एक है: दोनों inputs high के साथ हर NAND looped signal का inverter बनता, आख़िरी मान वैसे ही रखता जैसे NOR latch ने शून्य-शून्य पर। Forbidden combination शून्य-शून्य पर खिसकता: कोई भी शून्य NAND output को एक पर मजबूर करता, तो दोनों gates एक, Q और Q-prime दोनों एक - टूटी जोड़ी वही race के साथ। NAND latch NOR latch का ठीक दर्पण है, active levels और forbidden कोना एक से शून्य बदले। live NAND latch उसी logic से गिना जाता; सिर्फ़ gate type और labels बदले।",
      visualNote: "SRLatchViz gate=NAND (live, inputs S'/R') beside a computed 4-row StateTable: S',R' -> Q(t+1), Action, showing 01 Set, 10 Reset, 11 Hold, 00 Forbidden."
    },
    {
      id: "S05_Forbidden",
      label: "The Forbidden State",
      kind: "theory",
      subtitle: "S=R=1 breaks the complement, and releasing both at once starts an unpredictable race.",
      theoryEN: [
        "The forbidden state is the single reason the raw SR latch cannot be trusted as a general memory element, so it is worth understanding exactly what goes wrong. Take the NOR latch and assert both controls: S=1 and R=1 at the same time. Since a NOR gate outputs 0 whenever any input is 1, both gates are forced to output 0, so Q=0 and Q'=0 together.",
        "The first failure is a contradiction. Q and Q' are supposed to be complements - the whole design assumes Q' is always the inverse of Q - but now they are equal, both 0. Any downstream logic that reads Q' expecting NOT-Q is being lied to. The named outputs no longer mean what they claim.",
        "The second and more dangerous failure is the race. Suppose you now release both inputs, dropping S and R from 1 to 0 at the same instant. The latch must fall back into a legal hold state, either Q=1 or Q=0, but which one it lands in depends on microscopic differences in gate delay - whichever gate happens to switch a hair faster wins the loop. Two supposedly identical gates never switch at exactly the same time.",
        "The third failure follows from the second: the settled result is unpredictable. On one chip, or at one temperature, the latch might land on Q=1; on another it lands on Q=0; and near the balance point it can even hover in a metastable, undefined level for a while before tipping. A memory element whose remembered value is decided by a coin-flip of gate delays is unusable in practice.",
        "The lesson is not that the SR latch is broken but that it carries a rule: never drive S and R active together. Real designs must guarantee S.R = 0 at all times, and rather than trust every downstream circuit to obey that promise, engineers redesign the input logic so the illegal combination becomes physically impossible - which is precisely what the gated D latch will do."
      ],
      theoryHI: [
        "Forbidden state वही एकमात्र कारण है जिसकी वजह से कच्चे SR latch पर एक सामान्य memory element के रूप में भरोसा नहीं किया जा सकता, तो ठीक-ठीक समझना ज़रूरी है कि ग़लत क्या होता है। NOR latch लीजिए और दोनों controls जताइए: S=1 और R=1 एक साथ। चूँकि NOR gate 0 output देता है जब भी कोई input 1 हो, दोनों gates 0 output देने पर मजबूर हैं, तो Q=0 और Q'=0 एक साथ।",
        "पहला दोष एक contradiction है। Q और Q' को complements होना चाहिए - पूरा design मानता है कि Q' हमेशा Q का उल्टा है - पर अब वे बराबर हैं, दोनों 0। जो भी downstream logic Q' को NOT-Q समझकर पढ़ता है उससे झूठ कहा जा रहा है। नामित outputs अब वह नहीं मतलब रखते जो वे दावा करते हैं।",
        "दूसरा और ज़्यादा ख़तरनाक दोष race है। मान लीजिए अब आप दोनों inputs छोड़ते हैं, S और R को एक ही पल में 1 से 0 गिराते हुए। latch को किसी वैध hold state में गिरना है, या तो Q=1 या Q=0, पर वह किसमें उतरेगा यह gate delay के सूक्ष्म फ़र्क़ों पर निर्भर करता है - जो gate ज़रा तेज़ switch कर जाए वही loop जीत लेता है। दो कथित रूप से एक जैसे gates कभी ठीक एक ही समय switch नहीं करते।",
        "तीसरा दोष दूसरे से निकलता है: settle हुआ नतीजा अप्रत्याशित है। एक chip पर, या एक temperature पर, latch Q=1 पर उतर सकता है; दूसरे पर Q=0 पर; और संतुलन बिंदु के पास यह एक metastable, अपरिभाषित level पर कुछ देर मँडरा भी सकता है इससे पहले कि झुके। जिस memory element का याद किया मान gate delays के सिक्के-उछाल से तय हो वह व्यवहार में बेकार है।",
        "सबक़ यह नहीं कि SR latch टूटा हुआ है बल्कि यह कि वह एक नियम रखता है: S और R को कभी एक साथ active मत चलाइए। असली designs को हर समय S.R = 0 की गारंटी देनी होती है, और हर downstream circuit पर उस वादे के पालन का भरोसा करने के बजाय, engineer input logic को फिर से design करते हैं ताकि अवैध combination भौतिक रूप से असंभव हो जाए - ठीक वही जो gated D latch करेगा।"
      ],
      transcriptEN: "The forbidden state is the single reason the raw SR latch can't be trusted, so understand exactly what breaks. Take the NOR latch and assert both controls, S and R one together. A NOR outputs zero whenever any input is one, so both gates are forced to zero: Q and Q-prime both zero. First failure - a contradiction: Q and Q-prime are supposed to be complements, but now they're equal, so any logic reading Q-prime as not-Q is being lied to. Second failure, the race: release both inputs, dropping S and R to zero at the same instant, and the latch must fall back to Q equals one or Q equals zero - but which one depends on microscopic gate-delay differences, whichever gate switches a hair faster wins. Third failure, from the second: the result is unpredictable - one chip lands on one, another on zero, and near the balance point it can hover in a metastable undefined level before tipping. So the SR latch carries a rule: never drive S and R active together, guarantee S dot R equals zero - and rather than trust everyone to obey, we redesign the inputs so the illegal case can't happen, which is what the gated D latch does.",
      transcriptHI: "Forbidden state वही एकमात्र कारण है जिससे कच्चे SR latch पर भरोसा नहीं होता, तो समझिए ठीक क्या टूटता है। NOR latch लीजिए और दोनों controls जताइए, S और R एक साथ। NOR शून्य देता है जब कोई input एक हो, तो दोनों gates शून्य पर मजबूर: Q और Q-prime दोनों शून्य। पहला दोष - contradiction: Q और Q-prime को complements होना चाहिए, पर अब बराबर हैं, तो जो logic Q-prime को not-Q समझ पढ़ता है उससे झूठ कहा जाता है। दूसरा दोष, race: दोनों inputs छोड़िए, S और R एक ही पल शून्य पर गिराते, latch को Q बराबर एक या Q बराबर शून्य पर गिरना है - पर किसमें यह सूक्ष्म gate-delay फ़र्क़ों पर, जो gate ज़रा तेज़ switch करे वही जीतता। तीसरा दोष, दूसरे से: नतीजा अप्रत्याशित - एक chip एक पर उतरे, दूसरा शून्य पर, और संतुलन के पास metastable अपरिभाषित level पर मँडरा सकता झुकने से पहले। तो SR latch नियम रखता है: S और R कभी एक साथ active मत चलाइए, S dot R बराबर शून्य की गारंटी दीजिए - और सबके पालन पर भरोसे के बजाय हम inputs फिर design करते हैं ताकि अवैध case हो ही न सके, जो gated D latch करता है।",
      visualNote: "Bespoke: force S=R=1 and show Q=Q'=0 lit red (contradiction); a 'release both together' button triggers a random settle to Q=0 or Q=1, illustrating the unpredictable race; three labelled failure points."
    },
    {
      id: "S06_GatedSR",
      label: "The Gated SR Latch",
      kind: "theory",
      subtitle: "AND each input with EN: EN=0 locks and holds, EN=1 opens a transparent window (1,1 still forbidden).",
      theoryEN: [
        "The raw SR latch reacts the instant its inputs change, which is inconvenient - you usually want the latch to update only at chosen moments, not continuously. The fix is to add an enable line, EN (often a clock), and gate the two control inputs through it. Put an AND gate in front of each input: the latch now sees Sg = S AND EN and Rg = R AND EN instead of S and R directly.",
        "When EN=0, both AND gates output 0 no matter what S and R are doing. The internal latch therefore sees Sg=0, Rg=0, which is its Hold command, so the output is frozen and the latch is locked. You can wave S and R around all you like; nothing reaches the memory loop. This is the closed window.",
        "When EN=1, each AND gate passes its input straight through: Sg=S and Rg=R. Now the latch behaves exactly like the plain SR latch - S sets, R resets, 0,0 holds. The latch is said to be transparent, because changes on S and R flow through to Q for the whole time EN stays high. This is the open window.",
        "Gating buys you timing control but it does not cure the forbidden state. During the open window, S=1 with R=1 still produces Sg=1, Rg=1, driving the internal latch into the same invalid Q=Q'=0 condition. The enable decides when the latch may change; it does nothing about what the illegal input combination does once it gets through.",
        "So the gated SR latch is a real step forward - you have won the ability to say when memory updates - but it is only half the fix. The remaining job is to make the forbidden combination unreachable by construction, and for that we stop feeding S and R independently and derive them both from a single data input. Toggle EN on the live gated latch: watch it lock at EN=0 and pass S/R through at EN=1."
      ],
      theoryHI: [
        "कच्चा SR latch अपने inputs बदलते ही प्रतिक्रिया देता है, जो असुविधाजनक है - आप आमतौर पर चाहते हैं कि latch सिर्फ़ चुने पलों पर update हो, लगातार नहीं। हल है एक enable line जोड़ना, EN (अक्सर एक clock), और दोनों control inputs को उसके ज़रिए gate करना। हर input के आगे एक AND gate रखिए: latch अब S और R के सीधे बजाय Sg = S AND EN और Rg = R AND EN देखता है।",
        "जब EN=0, दोनों AND gates 0 output देते हैं चाहे S और R कुछ भी कर रहे हों। इसलिए internal latch Sg=0, Rg=0 देखता है, जो उसका Hold आदेश है, तो output जम जाता है और latch locked है। आप S और R को जितना चाहे हिलाइए; memory loop तक कुछ नहीं पहुँचता। यह बंद window है।",
        "जब EN=1, हर AND gate अपना input सीधे pass करता है: Sg=S और Rg=R। अब latch ठीक सादे SR latch जैसा बर्ताव करता है - S set करता, R reset करता, 0,0 hold करता। latch को transparent कहा जाता है, क्योंकि S और R पर बदलाव पूरे समय Q तक बहते रहते हैं जब तक EN high रहता है। यह खुली window है।",
        "Gating आपको timing नियंत्रण देता है पर forbidden state ठीक नहीं करता। खुली window के दौरान, S=1 और R=1 अब भी Sg=1, Rg=1 बनाता है, internal latch को उसी invalid Q=Q'=0 स्थिति में चलाते हुए। enable तय करता है कि latch कब बदल सकता है; अवैध input combination एक बार पहुँचने पर क्या करता है उसके बारे में यह कुछ नहीं करता।",
        "तो gated SR latch एक असली क़दम आगे है - आपने यह कहने की क्षमता जीत ली कि memory कब update हो - पर यह आधा ही fix है। बचा काम forbidden combination को रचना से ही अगम्य बनाना है, और उसके लिए हम S और R को स्वतंत्र रूप से feed करना बंद करते हैं और दोनों को एक अकेले data input से निकालते हैं। live gated latch पर EN toggle कीजिए: देखिए यह EN=0 पर lock होता है और EN=1 पर S/R pass करता है।"
      ],
      transcriptEN: "The raw SR latch reacts the instant its inputs change, but you usually want updates only at chosen moments. The fix is an enable line, EN, often a clock, gating both controls: put an AND gate in front of each input so the latch sees S-gated equals S and EN, and R-gated equals R and EN. When EN is zero, both ANDs output zero regardless of S and R, so the latch sees zero-zero, its hold command - the output freezes and the latch is locked; that's the closed window. When EN is one, each AND passes its input through, so the latch behaves exactly like a plain SR latch and is transparent, changes flowing to Q the whole time EN is high; that's the open window. But gating buys timing control, not a cure for the forbidden state: during the open window S and R both one still gives gated ones, driving the same invalid Q equals Q-prime equals zero. The enable decides when the latch may change, not what an illegal input does once through. So it's half the fix - next we make the forbidden combination unreachable by deriving both inputs from one data line.",
      transcriptHI: "कच्चा SR latch inputs बदलते ही प्रतिक्रिया देता है, पर आप अक्सर सिर्फ़ चुने पलों पर update चाहते हैं। हल है एक enable line, EN, अक्सर clock, दोनों controls को gate करती: हर input के आगे एक AND gate रखिए ताकि latch S-gated बराबर S and EN, और R-gated बराबर R and EN देखे। जब EN शून्य, दोनों ANDs शून्य देते चाहे S और R कुछ भी, तो latch शून्य-शून्य देखता, उसका hold आदेश - output जमता और latch locked; वह बंद window। जब EN एक, हर AND अपना input pass करता, तो latch ठीक सादे SR latch जैसा और transparent, बदलाव Q तक बहते पूरे समय जब EN high; वह खुली window। पर gating timing नियंत्रण देता, forbidden state का इलाज नहीं: खुली window में S और R दोनों एक अब भी gated एक देते, वही invalid Q बराबर Q-prime बराबर शून्य चलाते। enable तय करता latch कब बदले, अवैध input एक बार पहुँचने पर क्या करे यह नहीं। तो यह आधा fix है - आगे हम forbidden combination अगम्य बनाते दोनों inputs एक data line से निकालकर।",
      visualNote: "Bespoke gated-SR SVG: live S, R, EN toggles feeding two AND gates (S.EN, R.EN) into a cross-coupled latch. EN=0 shows LOCKED/hold; EN=1 shows transparent Set/Reset; S=R=1 with EN=1 flags the forbidden state."
    },
    {
      id: "S07_DLatch",
      label: "The Gated D Latch",
      kind: "theory",
      subtitle: "Force R = D' (and S = D): the inputs are always complementary, so the forbidden state can never occur.",
      theoryEN: [
        "Now the clean fix. The forbidden state only exists because S and R can be set independently, letting someone drive both to 1. Remove that freedom: take a single data input D, feed it directly to S, and feed its inverse D' to R. An inverter between D and the R input guarantees that S and R are always opposite - whenever S is 1, R is 0, and whenever S is 0, R is 1.",
        "With S = D and R = D', the two illegal combinations become unreachable by construction. S=R=1 would need D=1 and D'=1 simultaneously, which is impossible; S=R=0 would need D=0 and D'=0, equally impossible. The forbidden state, the race and the metastability that came with it are all designed out - not merely avoided by a promise, but made electrically impossible.",
        "What remains is beautifully simple. When the enable is high, D=1 gives S=1, R=0 which Sets Q to 1, and D=0 gives S=0, R=1 which Resets Q to 0. In other words the output simply copies the data input: Q = D. The characteristic equation collapses to Q(t+1) = D, the simplest of all memory equations.",
        "This element is the gated D latch, also called a transparent D latch, and it is the workhorse level-sensitive memory cell. It has just two useful inputs, D (the data to store) and EN (when to store it), plus the outputs Q and Q'. Store a bit by presenting it on D while EN is high; freeze it by dropping EN low.",
        "Notice how the whole module has converged. Cross-coupling gave raw memory; the SR latch gave named Set and Reset controls but carried a forbidden state; gating added timing control but not safety; and forcing R = D' finally delivers a safe, single-input, one-equation memory cell. The live D latch beside this text shows Q tracking D whenever EN=1 and holding the instant EN goes to 0."
      ],
      theoryHI: [
        "अब साफ़ fix। Forbidden state सिर्फ़ इसलिए मौजूद है क्योंकि S और R को स्वतंत्र रूप से set किया जा सकता है, किसी को दोनों को 1 पर चलाने देते हुए। वह आज़ादी हटाइए: एक अकेला data input D लीजिए, उसे सीधे S को feed कीजिए, और उसका उल्टा D' R को feed कीजिए। D और R input के बीच एक inverter गारंटी देता है कि S और R हमेशा विपरीत हों - जब भी S 1 हो, R 0, और जब भी S 0 हो, R 1।",
        "S = D और R = D' के साथ, दोनों अवैध combinations रचना से ही अगम्य हो जाते हैं। S=R=1 को एक साथ D=1 और D'=1 चाहिए, जो असंभव है; S=R=0 को D=0 और D'=0 चाहिए, उतना ही असंभव। Forbidden state, race और उसके साथ आई metastability सब design से बाहर कर दी गईं - महज़ एक वादे से टाली नहीं, बल्कि विद्युतीय रूप से असंभव बनाई गईं।",
        "जो बचता है वह ख़ूबसूरती से सरल है। जब enable high हो, D=1 देता है S=1, R=0 जो Q को 1 पर Set करता है, और D=0 देता है S=0, R=1 जो Q को 0 पर Reset करता है। दूसरे शब्दों में output बस data input की नक़ल करता है: Q = D। Characteristic equation सिमटकर Q(t+1) = D बन जाता है, सभी memory equations में सबसे सरल।",
        "यह element gated D latch है, जिसे transparent D latch भी कहते हैं, और यह workhorse level-sensitive memory cell है। इसमें बस दो उपयोगी inputs हैं, D (store करने का data) और EN (कब store करना है), साथ में outputs Q और Q'। एक bit store कीजिए उसे D पर दिखाकर जब EN high हो; उसे जमा दीजिए EN को low गिराकर।",
        "ग़ौर कीजिए पूरा module कैसे एक बिंदु पर मिला। Cross-coupling ने कच्ची memory दी; SR latch ने नामित Set और Reset controls दिए पर forbidden state ढोया; gating ने timing नियंत्रण जोड़ा पर सुरक्षा नहीं; और R = D' मजबूर करना अंततः एक सुरक्षित, single-input, एक-equation memory cell देता है। पास वाला live D latch दिखाता है Q, D का पीछा करता जब भी EN=1 और जमता जिस पल EN 0 पर जाए।"
      ],
      transcriptEN: "Now the clean fix. The forbidden state exists only because S and R can be set independently. Remove that freedom: take one data input D, feed it to S, and feed its inverse D-prime to R. An inverter guarantees S and R are always opposite - S one means R zero, S zero means R one. With S equals D and R equals D-prime, both illegal cases are unreachable by construction: S equals R equals one would need D and D-prime both one, impossible; S equals R equals zero would need both zero, impossible. Forbidden state, race, metastability - all designed out, made electrically impossible, not just promised away. What remains is simple: with enable high, D one sets Q to one, D zero resets Q to zero, so Q simply copies D - the characteristic equation collapses to Q-next equals D. This is the gated D latch, or transparent D latch: two useful inputs, D the data and EN when to store, plus Q and Q-prime. The whole module converges - cross-coupling gave memory, the SR latch gave controls but a forbidden state, gating gave timing, and forcing R equals D-prime finally gives a safe one-equation memory cell.",
      transcriptHI: "अब साफ़ fix। Forbidden state सिर्फ़ इसलिए है क्योंकि S और R स्वतंत्र रूप से set हो सकते हैं। वह आज़ादी हटाइए: एक data input D लीजिए, उसे S को feed कीजिए, और उसका उल्टा D-prime R को। एक inverter गारंटी देता S और R हमेशा विपरीत - S एक मतलब R शून्य, S शून्य मतलब R एक। S बराबर D और R बराबर D-prime के साथ, दोनों अवैध cases रचना से अगम्य: S बराबर R बराबर एक को D और D-prime दोनों एक चाहिए, असंभव; S बराबर R बराबर शून्य को दोनों शून्य, असंभव। Forbidden state, race, metastability - सब design से बाहर, विद्युतीय रूप से असंभव, महज़ वादे से नहीं। जो बचता सरल है: enable high के साथ, D एक Q को एक पर set, D शून्य Q को शून्य पर reset, तो Q बस D की नक़ल करता - equation सिमटकर Q-next बराबर D। यह gated D latch है, या transparent D latch: दो उपयोगी inputs, D data और EN कब store, साथ Q और Q-prime। पूरा module मिलता है - cross-coupling ने memory दी, SR latch ने controls पर forbidden state, gating ने timing, और R बराबर D-prime मजबूर करना अंततः सुरक्षित एक-equation memory cell देता।",
      visualNote: "DLatchViz (live): Q follows D while EN=1 (transparent) and freezes when EN=0. Note internally S=D, R=D' so the forbidden state is impossible."
    },
    {
      id: "S08_Transparency",
      label: "Level-Sensitive Transparency",
      kind: "theory",
      subtitle: "While EN=1 the output Q follows D continuously; while EN=0 it holds - watch it on the waveform.",
      theoryEN: [
        "The defining behaviour of a latch is that it is level-sensitive: what matters is the level of the enable, high or low, not the moment it changes. While EN is held high the latch is open and Q continuously follows D; while EN is held low the latch is closed and Q holds whatever it last captured. Read the timing diagram beside this text as one long story of open and closed windows.",
        "Trace it carefully. During any stretch where EN=1, the Q trace is a copy of the D trace - every wiggle on D, however many times it changes, passes straight through to Q. This is transparency: for the entire width of the high pulse the input is wired through to the output, not sampled once but followed the whole time.",
        "The instant EN falls to 0, the latch closes and Q latches - it holds the value D happened to have at that closing moment. From then until the next time EN rises, D can move anywhere it likes and Q ignores it completely, sitting frozen. That frozen segment is the memory doing its job.",
        "This is a genuinely useful mode - transparent latches are used deliberately in many designs - but it carries a hazard. Because Q follows D for the whole time the window is open, a glitch on D, or an input that keeps changing during a long enable pulse, is faithfully copied to the output. The latch cannot pin down a single clean value per enable; it passes through everything that arrives while open.",
        "That is the transparent-window flaw, and it is exactly the problem the next module solves. An edge-triggered flip-flop replaces level-sensitivity with edge-sensitivity: instead of following D the whole time EN is high, it samples D at one precise instant, the rising or falling edge of the clock, and ignores it otherwise. Toggle the D and EN cells on the waveform and watch Q copy D inside every open window and hold flat everywhere else."
      ],
      theoryHI: [
        "एक latch का परिभाषित बर्ताव यह है कि वह level-sensitive है: मायने enable का level रखता है, high या low, वह पल नहीं जब वह बदलता है। जब तक EN high थमा है latch खुला है और Q लगातार D का पीछा करता है; जब तक EN low थमा है latch बंद है और Q जो आख़िरी बार पकड़ा उसे थामे रखता है। पास वाले timing diagram को खुली और बंद windows की एक लंबी कहानी की तरह पढ़िए।",
        "इसे ध्यान से trace कीजिए। जिस भी खिंचाव में EN=1, Q trace D trace की नक़ल है - D पर हर हरकत, चाहे कितनी बार बदले, सीधे Q तक पहुँचती है। यही transparency है: high pulse की पूरी चौड़ाई भर input output तक wired रहता है, एक बार sample नहीं बल्कि पूरे समय पीछा किया जाता है।",
        "जिस पल EN 0 पर गिरता है, latch बंद होता है और Q latch हो जाता है - वह मान थामता है जो D के पास उस बंद होते पल पर था। तब से अगली बार EN के उठने तक, D कहीं भी जा सकता है और Q उसे पूरी तरह अनदेखा करता है, जमा बैठा। वह जमा हिस्सा memory का अपना काम करना है।",
        "यह सचमुच एक उपयोगी mode है - transparent latches कई designs में जानबूझकर वापरे जाते हैं - पर यह एक hazard ढोता है। चूँकि window खुले पूरे समय Q, D का पीछा करता है, D पर एक glitch, या एक input जो लंबे enable pulse के दौरान बदलता रहे, वफ़ादारी से output तक copy हो जाता है। latch प्रति enable एक अकेला साफ़ मान तय नहीं कर सकता; खुले रहते जो भी आए वह सब pass कर देता है।",
        "वही transparent-window दोष है, और ठीक यही समस्या अगला module हल करता है। एक edge-triggered flip-flop level-sensitivity को edge-sensitivity से बदल देता है: EN high के पूरे समय D का पीछा करने के बजाय, यह D को एक सटीक पल पर sample करता है, clock के rising या falling edge पर, और बाक़ी समय उसे अनदेखा करता है। waveform पर D और EN cells toggle कीजिए और देखिए Q हर खुली window के भीतर D की नक़ल करता है और बाक़ी हर जगह सपाट थमा रहता है।"
      ],
      transcriptEN: "The defining behaviour of a latch is that it's level-sensitive: what matters is the level of the enable, high or low, not the moment it changes. While EN is high the latch is open and Q continuously follows D; while EN is low the latch is closed and Q holds its last captured value. On the timing diagram, during any stretch where EN is one the Q trace copies the D trace - every wiggle on D passes straight through, because for the whole width of the high pulse the input is wired to the output, followed the whole time, not sampled once. The instant EN falls to zero the latch closes and Q latches the value D had at that moment, then ignores D completely until EN rises again - that frozen segment is the memory working. It's useful, but hazardous: because Q follows D the whole open window, a glitch on D or an input that keeps changing during a long pulse is copied faithfully. The latch can't pin one clean value per enable. That's the transparent-window flaw the next module fixes: an edge-triggered flip-flop samples D at one precise clock edge instead of following it the whole time.",
      transcriptHI: "latch का परिभाषित बर्ताव यह है कि वह level-sensitive है: मायने enable का level रखता है, high या low, वह पल नहीं जब बदलता है। जब EN high latch खुला और Q लगातार D का पीछा करता; जब EN low latch बंद और Q अपना आख़िरी पकड़ा मान थामता। timing diagram पर, जिस खिंचाव में EN एक, Q trace D trace की नक़ल करता - D की हर हरकत सीधे pass होती, क्योंकि high pulse की पूरी चौड़ाई input output तक wired, पूरे समय पीछा, एक बार sample नहीं। जिस पल EN शून्य पर गिरे latch बंद और Q उस पल का D मान latch करता, फिर EN के दुबारा उठने तक D को पूरी तरह अनदेखा - वह जमा हिस्सा memory का काम। उपयोगी पर hazardous: चूँकि Q पूरी खुली window D का पीछा करता, D पर glitch या लंबे pulse में बदलता input वफ़ादारी से copy होता। latch प्रति enable एक साफ़ मान तय नहीं कर सकता। वही transparent-window दोष अगला module ठीक करता: edge-triggered flip-flop D को एक सटीक clock edge पर sample करता पूरे समय पीछा करने के बजाय।",
      visualNote: "Bespoke transparency lab: editable D and EN waveforms feeding a computed Q (Q=D while EN=1, holds while EN=0), rendered as an aligned TimingDiagram with the open windows shaded."
    },
    {
      id: "S09_Analogy",
      label: "The Doorman Analogy",
      kind: "theory",
      subtitle: "A spring-loaded door held open by a doorman (Enable): open lets data flow, closed freezes the last one through.",
      theoryEN: [
        "To make the gated D latch stick, picture a spring-loaded door at the entrance of a room, and a doorman whose hand controls it. The doorman is the enable line EN; the door itself is the latch's transparency; the people trying to walk through are the data input D; and whoever is currently standing inside the room is the stored output Q.",
        "While the doorman holds the door open (EN=1), the entrance is transparent: whoever walks up simply strolls straight through into the room. If a stream of people arrive, the person inside keeps being replaced by the latest one to enter - exactly as Q continuously follows D while the enable is high. Nothing is held back; the room shows whoever is at the door right now.",
        "The moment the doorman lets go, the spring snaps the door shut (EN=0). Now the room is sealed: whoever was inside at the instant it closed stays inside, and no matter how many people crowd at the door afterward, none get through. That frozen occupant is Q holding its last captured value - the memory, keeping the last person who made it in.",
        "The analogy even carries the hazard honestly. Because the door is open for a stretch of time rather than for a single instant, if several people shuffle in and out while it is open, the one who ends up inside is just whoever happened to be there at closing - the door followed the whole busy window, not one clean choice. That is the transparent-latch flaw in human form.",
        "And it points straight at the cure. A flip-flop is a turnstile that admits exactly one person at the single tick of a clock, not a door propped open for a while. Same purpose - control who gets into the room - but by sampling at one sharp instant instead of following an open window, it removes the ambiguity. Hold the doorman picture and the whole latch-versus-flip-flop story stays intuitive."
      ],
      theoryHI: [
        "Gated D latch को जमाने के लिए, एक कमरे के प्रवेश पर एक spring-loaded दरवाज़ा सोचिए, और एक doorman जिसका हाथ उसे नियंत्रित करता है। doorman है enable line EN; दरवाज़ा ख़ुद है latch की transparency; जो लोग अंदर जाने की कोशिश कर रहे हैं वे हैं data input D; और अभी जो कमरे के अंदर खड़ा है वह है stored output Q।",
        "जब तक doorman दरवाज़ा खुला थामे रखता है (EN=1), प्रवेश transparent है: जो भी पास आए बस सीधे कमरे में टहलता चला जाता है। अगर लोगों की धारा आए, अंदर वाला व्यक्ति नए आने वाले से बदलता रहता है - ठीक वैसे जैसे Q लगातार D का पीछा करता है जब enable high हो। कुछ रोका नहीं जाता; कमरा वही दिखाता है जो अभी दरवाज़े पर है।",
        "जिस पल doorman छोड़ता है, spring दरवाज़ा बंद कर देता है (EN=0)। अब कमरा सील है: जो भी बंद होते पल अंदर था वह अंदर रहता है, और बाद में चाहे कितने लोग दरवाज़े पर भीड़ लगाएँ, कोई अंदर नहीं आता। वह जमा निवासी है Q अपना आख़िरी पकड़ा मान थामे - memory, आख़िरी व्यक्ति को रखे जो अंदर पहुँचा।",
        "Analogy hazard को भी ईमानदारी से ढोता है। चूँकि दरवाज़ा एक अकेले पल के बजाय कुछ समय के खिंचाव के लिए खुला है, अगर खुले रहते कई लोग अंदर-बाहर होते रहें, जो अंत में अंदर रह जाता है वह बस वही है जो बंद होते वक़्त वहाँ था - दरवाज़े ने पूरी व्यस्त window का पीछा किया, एक साफ़ चुनाव नहीं। यही transparent-latch दोष मानवी रूप में है।",
        "और यह सीधे इलाज की ओर इशारा करता है। एक flip-flop एक turnstile है जो clock के अकेले tick पर ठीक एक व्यक्ति को अंदर लेता है, कुछ देर टिका रखा दरवाज़ा नहीं। वही उद्देश्य - नियंत्रित करना कौन कमरे में आए - पर एक खुली window का पीछा करने के बजाय एक तीखे पल पर sample करके, यह अस्पष्टता हटा देता है। doorman की तस्वीर पकड़े रखिए और पूरी latch-बनाम-flip-flop कहानी सहज बनी रहती है।"
      ],
      transcriptEN: "To make the gated D latch stick, picture a spring-loaded door with a doorman controlling it. The doorman is the enable EN, the door is the latch's transparency, the people trying to enter are the data D, and whoever is inside the room is the stored Q. While the doorman holds the door open, EN one, the entrance is transparent: whoever walks up strolls straight in, and a stream of arrivals keeps replacing the person inside - exactly as Q follows D while enable is high. The moment he lets go, the spring shuts the door, EN zero: whoever was inside stays sealed in, and later arrivals can't get through - that's Q holding its last value, the memory. The analogy even carries the hazard: because the door is open for a stretch, not an instant, the one left inside is just whoever happened to be there at closing - it followed the whole busy window, not one clean choice. And it points at the cure: a flip-flop is a turnstile admitting exactly one person at a single clock tick, not a door propped open - same job, but sampling one sharp instant removes the ambiguity.",
      transcriptHI: "Gated D latch को जमाने के लिए, एक spring-loaded दरवाज़ा सोचिए एक doorman के साथ जो उसे नियंत्रित करता। doorman है enable EN, दरवाज़ा है latch की transparency, अंदर जाने वाले हैं data D, और कमरे में जो है वह stored Q। जब doorman दरवाज़ा खुला थामे, EN एक, प्रवेश transparent: जो पास आए सीधे अंदर, और आने वालों की धारा अंदर वाले को बदलती रहती - ठीक जैसे Q, D का पीछा करता जब enable high। जिस पल वह छोड़े, spring दरवाज़ा बंद, EN शून्य: जो अंदर था सील रहता, बाद वाले नहीं आ सकते - वही Q अपना आख़िरी मान थामे, memory। Analogy hazard भी ढोता: चूँकि दरवाज़ा कुछ देर खुला, एक पल नहीं, अंदर बचा वही जो बंद होते वहाँ था - पूरी व्यस्त window का पीछा, एक साफ़ चुनाव नहीं। और यह इलाज की ओर इशारा: flip-flop एक turnstile जो clock के अकेले tick पर ठीक एक व्यक्ति लेता, टिका दरवाज़ा नहीं - वही काम, पर एक तीखे पल पर sample अस्पष्टता हटाता।",
      visualNote: "Bespoke doorman visual: toggle EN (doorman's hand) and D (person at the door); Q shows who's inside - follows D while the door is open, freezes when it shuts."
    },
    {
      id: "S10_Build",
      label: "Build The SR Latch",
      kind: "theory",
      subtitle: "Wire two cross-coupled NOR gates on the live workbench and watch a circuit remember.",
      theoryEN: [
        "You have read the theory and driven the live latches; now build one yourself on the workbench. Wiring two cross-coupled NOR gates by hand is the moment cross-coupling stops being a diagram and becomes a real circuit that visibly refuses to forget.",
        "Place two 2-input NOR gates. Feed the output of the first gate into an input of the second, and the output of the second back into an input of the first - that is the cross-couple. The free input of the top gate is R, the free input of the bottom gate is S; the output of one gate is Q and the other is Q'.",
        "Now exercise it. Pulse S high then low and confirm Q latches to 1 and stays there after S returns low. Pulse R high then low and confirm Q resets to 0 and stays. Set both S and R to 0 and watch Q hold indefinitely - that persistence with no active input is the memory you built.",
        "Finally, prove the theory's warning to yourself: raise S and R to 1 together and observe both Q and Q' go to 0, the forbidden state in the flesh. Then extend the build by AND-gating S and R with an enable to make it gated, and, if you like, tie R to an inverter fed from D to turn it into a safe D latch."
      ],
      theoryHI: [
        "आपने theory पढ़ी और live latches चलाए; अब workbench पर एक ख़ुद बनाइए। दो cross-coupled NOR gates हाथ से wire करना वह पल है जब cross-coupling एक diagram होना बंद करके एक असली circuit बन जाता है जो साफ़ दिखते हुए भूलने से इनकार करता है।",
        "दो 2-input NOR gates रखिए। पहले gate का output दूसरे के input में feed कीजिए, और दूसरे का output वापस पहले के input में - यही cross-couple है। ऊपरी gate का ख़ाली input R है, निचले gate का ख़ाली input S है; एक gate का output Q और दूसरा Q' है।",
        "अब इसे चलाइए। S को high फिर low pulse कीजिए और पुष्टि कीजिए कि Q 1 पर latch होता है और S के वापस low होने पर भी वहाँ रहता है। R को high फिर low pulse कीजिए और पुष्टि कीजिए कि Q 0 पर reset होता है और रहता है। S और R दोनों को 0 कीजिए और देखिए Q अनिश्चित काल तक hold करता है - बिना किसी active input के वह बने रहना ही वह memory है जो आपने बनाई।",
        "अंत में, theory की चेतावनी ख़ुद को साबित कीजिए: S और R को एक साथ 1 उठाइए और देखिए Q और Q' दोनों 0 पर जाते हैं, forbidden state साक्षात्। फिर build को बढ़ाइए S और R को एक enable से AND करके इसे gated बनाइए, और चाहें तो R को D से feed हुए एक inverter से बाँधकर इसे एक सुरक्षित D latch में बदल दीजिए।"
      ],
      transcriptEN: "You've read the theory and driven the live latches; now build one on the workbench. Wiring two cross-coupled NOR gates by hand is the moment cross-coupling becomes a real circuit that visibly refuses to forget. Place two two-input NOR gates, feed each output back into an input of the other - that's the cross-couple. The free input of the top gate is R, the free input of the bottom is S, one output is Q, the other Q-prime. Pulse S high then low and Q latches to one and stays; pulse R and Q resets to zero and stays; set both to zero and Q holds indefinitely - that's the memory. Then raise both to one and watch Q and Q-prime both go to zero, the forbidden state in the flesh. Extend it by AND-gating S and R with an enable, and tie R to an inverter from D to make a safe D latch.",
      transcriptHI: "आपने theory पढ़ी और live latches चलाए; अब workbench पर एक बनाइए। दो cross-coupled NOR gates हाथ से wire करना वह पल है जब cross-coupling एक असली circuit बनता जो साफ़ भूलने से इनकार करता। दो two-input NOR gates रखिए, हर output वापस दूसरे के input में feed कीजिए - यही cross-couple। ऊपरी gate का ख़ाली input R, निचले का S, एक output Q, दूसरा Q-prime। S को high फिर low pulse कीजिए Q एक पर latch होकर रहता; R pulse कीजिए Q शून्य पर reset होकर रहता; दोनों शून्य कीजिए Q अनिश्चित काल hold करता - वही memory। फिर दोनों एक उठाइए और देखिए Q और Q-prime दोनों शून्य पर, forbidden state साक्षात्। इसे बढ़ाइए S और R को enable से AND करके, और R को D से एक inverter से बाँधकर सुरक्षित D latch बनाइए।",
      visualNote: "WorkbenchCTA -> /workbench?tutorial=sr-latch: build two cross-coupled NOR gates, test Set/Reset/Hold and the forbidden state, then extend to gated and D latch."
    },
    {
      id: "S11_Flashcards",
      label: "Latch Flashcards",
      kind: "flashcards",
      subtitle: "Eight cards from cross-coupling to the transparent window - term on the front, the real logic on the back.",
      theoryEN: ["Flip each card: the front names a latch concept, the back gives the exact behaviour."],
      theoryHI: ["हर card पलटिए: सामने एक latch concept का नाम, पीछे ठीक बर्ताव।"],
      transcriptEN: "Eight cards covering cross-coupling, the NOR and NAND SR latches, the forbidden state, gating, the D-latch fix and transparency.",
      transcriptHI: "आठ cards: cross-coupling, NOR और NAND SR latches, forbidden state, gating, D-latch fix और transparency।",
      visualNote: "SubFlashCards deck of 8 bilingual cards."
    },
    {
      id: "S12_Quiz",
      label: "Latch Quiz",
      kind: "quiz",
      subtitle: "Seven questions on cross-coupling, forbidden states and the gated D fix.",
      theoryEN: ["Answer each question, then read the explanation to lock the idea in."],
      theoryHI: ["हर सवाल का जवाब दीजिए, फिर explanation पढ़कर विचार पक्का कीजिए।"],
      transcriptEN: "Seven multiple-choice questions on the latch family.",
      transcriptHI: "latch परिवार पर सात multiple-choice सवाल।",
      visualNote: "QuizScene with 7 problems."
    },
    {
      id: "S13_Recap",
      label: "Recap, From Feedback To Safe Memory",
      kind: "recap",
      subtitle: "Cross-couple -> SR latch -> gated SR -> gated D: the four steps that build a safe one-bit memory.",
      theoryEN: [
        "Step back and read the whole arc as one synthesis timeline. Plain combinational logic has no memory. Cross-couple two gates and feedback appears, giving a bistable that holds its last state - that is raw memory. Add named controls and you have the SR latch, but it carries a forbidden state and its attendant race. Gate the inputs with an enable and you win timing control - the gated SR latch - but not safety. Force R = D' and you finally get the gated D latch, a safe single-input memory whose equation is simply Q(t+1) = D.",
        "Keep the two SR truth tables opposite in your memory. The NOR SR latch is active-HIGH: 10 Set, 01 Reset, 00 Hold, and 11 forbidden. The NAND SR latch is active-LOW with inputs S', R': 01 Set, 10 Reset, 11 Hold, and 00 forbidden. They are logical mirrors - the forbidden corner and the active level simply swap between 1 and 0.",
        "Never forget why the forbidden state matters. Driving both controls active forces Q and Q' to the same value, breaking the complement, and releasing them together starts a race whose winner is decided by tiny gate-delay differences, so the settled bit is unpredictable and can even go metastable. The whole point of the D latch is to make that combination physically unreachable by tying the two inputs to be complements.",
        "Finally, hold the one caution that carries into the next module. A latch is level-sensitive and transparent: while the enable is high the output follows the data for the entire pulse, copying every change and every glitch that arrives. That transparent window is the latch's defining flaw, and eliminating it - by sampling the data at a single clock edge instead of following it - is exactly what the edge-triggered flip-flop is built to do."
      ],
      theoryHI: [
        "पीछे हटकर पूरे चाप को एक synthesis timeline की तरह पढ़िए। सादे combinational logic में memory नहीं। दो gates cross-couple कीजिए और feedback प्रकट होता है, एक bistable देते हुए जो अपना आख़िरी state थामता है - वही कच्ची memory है। नामित controls जोड़िए और आपके पास SR latch है, पर वह एक forbidden state और उसकी साथी race ढोता है। inputs को एक enable से gate कीजिए और timing नियंत्रण जीतिए - gated SR latch - पर सुरक्षा नहीं। R = D' मजबूर कीजिए और अंततः gated D latch मिलता है, एक सुरक्षित single-input memory जिसका equation बस Q(t+1) = D है।",
        "दोनों SR truth tables को अपनी memory में विपरीत रखिए। NOR SR latch active-HIGH है: 10 Set, 01 Reset, 00 Hold, और 11 forbidden। NAND SR latch active-LOW है inputs S', R' के साथ: 01 Set, 10 Reset, 11 Hold, और 00 forbidden। ये logical दर्पण हैं - forbidden कोना और active level बस 1 और 0 के बीच बदल जाते हैं।",
        "कभी मत भूलिए forbidden state क्यों मायने रखता है। दोनों controls को active चलाना Q और Q' को एक ही मान पर मजबूर करता है, complement तोड़ते, और उन्हें एक साथ छोड़ना एक race शुरू करता है जिसका विजेता छोटे gate-delay फ़र्क़ों से तय होता है, तो settle हुआ bit अप्रत्याशित है और metastable भी जा सकता है। D latch का पूरा मक़सद उस combination को भौतिक रूप से अगम्य बनाना है दोनों inputs को complements होने के लिए बाँधकर।",
        "अंत में, वह एक चेतावनी पकड़े रखिए जो अगले module में जाती है। एक latch level-sensitive और transparent है: जब enable high हो output पूरे pulse भर data का पीछा करता है, हर बदलाव और हर glitch की नक़ल करता जो आए। वह transparent window latch का परिभाषित दोष है, और उसे मिटाना - data को एक अकेले clock edge पर sample करके उसका पीछा करने के बजाय - ठीक वही है जो edge-triggered flip-flop करने के लिए बना है।"
      ],
      transcriptEN: "Read the whole arc as one synthesis timeline. Combinational logic has no memory; cross-couple two gates and feedback gives a bistable that holds its last state - raw memory. Add controls for the SR latch, but it carries a forbidden state and race. Gate the inputs with an enable for timing control - the gated SR latch - but not safety. Force R equals D-prime and you get the gated D latch, a safe single-input memory, Q-next equals D. Keep the two SR tables opposite: NOR is active-high, one-zero Set, zero-one Reset, zero-zero Hold, one-one forbidden; NAND is active-low with S-prime R-prime, zero-one Set, one-zero Reset, one-one Hold, zero-zero forbidden - logical mirrors. Never forget why the forbidden state matters: both controls active break the complement, and releasing them together races to an unpredictable, possibly metastable result. And carry the caution forward: a latch is level-sensitive and transparent - it follows the data the whole pulse - and eliminating that transparent window by sampling at one clock edge is exactly what the edge-triggered flip-flop does next.",
      transcriptHI: "पूरे चाप को एक synthesis timeline की तरह पढ़िए। combinational logic में memory नहीं; दो gates cross-couple कीजिए और feedback एक bistable देता जो आख़िरी state थामता - कच्ची memory। SR latch के लिए controls जोड़िए, पर वह forbidden state और race ढोता। inputs को enable से gate कीजिए timing नियंत्रण के लिए - gated SR latch - पर सुरक्षा नहीं। R बराबर D-prime मजबूर कीजिए और gated D latch मिलता, सुरक्षित single-input memory, Q-next बराबर D। दोनों SR tables विपरीत रखिए: NOR active-high, एक-शून्य Set, शून्य-एक Reset, शून्य-शून्य Hold, एक-एक forbidden; NAND active-low S-prime R-prime के साथ, शून्य-एक Set, एक-शून्य Reset, एक-एक Hold, शून्य-शून्य forbidden - logical दर्पण। forbidden state क्यों मायने रखता कभी मत भूलिए: दोनों controls active complement तोड़ते, और साथ छोड़ना एक अप्रत्याशित, संभवतः metastable नतीजे की ओर race करता। और चेतावनी आगे ले जाइए: latch level-sensitive और transparent है - पूरे pulse data का पीछा करता - और उस transparent window को एक clock edge पर sample करके मिटाना ठीक वही है जो edge-triggered flip-flop आगे करता।",
      visualNote: "RecapScene: the FlowRail plus a synthesis-timeline card - combinational -> SR latch -> gated SR -> gated D."
    }
  ],
  flashcards: [
    {
      frontEN: "Cross-coupling",
      backEN: "Feeding each gate's output back into the other gate's input. The loop becomes bistable and holds its last value with no external input - that self-sustaining stored bit is memory (the state).",
      frontHI: "Cross-coupling",
      backHI: "हर gate का output दूसरे gate के input में वापस feed करना। loop bistable बन जाता है और बिना बाहरी input के अपना आख़िरी मान थामता है - वही ख़ुद-को-बनाए-रखता stored bit memory है (state)।"
    },
    {
      frontEN: "Latch vs flip-flop",
      backEN: "A latch is level-sensitive / transparent: Q follows the input the whole time the enable is high. A flip-flop is edge-triggered: it captures the input only at one clock edge.",
      frontHI: "Latch बनाम flip-flop",
      backHI: "Latch level-sensitive / transparent है: enable high के पूरे समय Q input का पीछा करता है। Flip-flop edge-triggered है: यह input को सिर्फ़ एक clock edge पर पकड़ता है।"
    },
    {
      frontEN: "NOR SR latch (active-HIGH)",
      backEN: "Two cross-coupled NOR gates. S=1,R=0 Set Q=1; S=0,R=1 Reset Q=0; S=0,R=0 Hold; S=1,R=1 Invalid (drives Q=Q'=0). Characteristic: Q(t+1)=S+R'.Q with S.R=0.",
      frontHI: "NOR SR latch (active-HIGH)",
      backHI: "दो cross-coupled NOR gates। S=1,R=0 Set Q=1; S=0,R=1 Reset Q=0; S=0,R=0 Hold; S=1,R=1 Invalid (Q=Q'=0 चलाता)। Characteristic: Q(t+1)=S+R'.Q, S.R=0 के साथ।"
    },
    {
      frontEN: "NAND SR latch (active-LOW, S',R')",
      backEN: "Two cross-coupled NAND gates. S'=0,R'=1 Set; S'=1,R'=0 Reset; S'=1,R'=1 Hold; S'=0,R'=0 Forbidden (drives Q=Q'=1). It is the logical mirror of the NOR latch.",
      frontHI: "NAND SR latch (active-LOW, S',R')",
      backHI: "दो cross-coupled NAND gates। S'=0,R'=1 Set; S'=1,R'=0 Reset; S'=1,R'=1 Hold; S'=0,R'=0 Forbidden (Q=Q'=1 चलाता)। यह NOR latch का logical दर्पण है।"
    },
    {
      frontEN: "The forbidden state",
      backEN: "Asserting both controls (NOR: S=R=1) forces Q and Q' to the same value, breaking the complement. Releasing both together starts a race whose winner is set by gate delays, so the result is unpredictable and can go metastable.",
      frontHI: "Forbidden state",
      backHI: "दोनों controls जताना (NOR: S=R=1) Q और Q' को एक ही मान पर मजबूर करता है, complement तोड़ते। दोनों को साथ छोड़ना एक race शुरू करता जिसका विजेता gate delays से तय, तो नतीजा अप्रत्याशित और metastable जा सकता।"
    },
    {
      frontEN: "Gated SR latch",
      backEN: "Each control is AND-ed with an enable: Sg=S.EN, Rg=R.EN. EN=0 locks the latch (hold); EN=1 opens a transparent window where it acts as a plain SR latch - so 1,1 is still forbidden. Gating adds timing control, not safety.",
      frontHI: "Gated SR latch",
      backHI: "हर control एक enable से AND: Sg=S.EN, Rg=R.EN। EN=0 latch को lock करता (hold); EN=1 एक transparent window खोलता जहाँ यह सादे SR latch जैसा - तो 1,1 अब भी forbidden। Gating timing नियंत्रण जोड़ता, सुरक्षा नहीं।"
    },
    {
      frontEN: "Gated D latch (the fix)",
      backEN: "Use one data input D: feed D to S and D' to R via an inverter, so S and R are always complementary. The forbidden and metastable states become impossible, and Q(t+1)=D - the output stores D while EN=1.",
      frontHI: "Gated D latch (fix)",
      backHI: "एक data input D वापरिए: D को S और D' को R एक inverter से feed कीजिए, तो S और R हमेशा complementary। Forbidden और metastable states असंभव हो जाते, और Q(t+1)=D - output D store करता जब EN=1।"
    },
    {
      frontEN: "Transparent window (the flaw)",
      backEN: "While EN=1 the D latch is transparent - Q copies D continuously, glitches and all, for the whole pulse; while EN=0 Q holds. This transparent window is the latch's flaw that edge-triggered flip-flops remove by sampling at one clock edge.",
      frontHI: "Transparent window (दोष)",
      backHI: "जब EN=1 D latch transparent है - Q लगातार D की नक़ल करता, glitches समेत, पूरे pulse भर; जब EN=0 Q hold करता। यह transparent window latch का दोष है जिसे edge-triggered flip-flops एक clock edge पर sample करके हटाते हैं।"
    }
  ],
  quiz: [
    {
      questionEN: "How does a latch create memory out of ordinary logic gates?",
      questionHI: "एक latch साधारण logic gates से memory कैसे बनाता है?",
      options: [
        "By adding a large capacitor to store charge",
        "By cross-coupling: feeding each gate's output back into the other gate's input to form a self-holding loop",
        "By using a faster clock",
        "By connecting many gates in a straight line"
      ],
      answerIndex: 1,
      explainEN: "Memory comes from feedback. Cross-coupling routes each output back to an input, forming a bistable loop that keeps re-driving itself and holds the last state with no external input.",
      explainHI: "Memory feedback से आती है। Cross-coupling हर output को वापस एक input तक भेजता है, एक bistable loop बनाते हुए जो ख़ुद को चलाता रहता है और बिना बाहरी input के आख़िरी state थामता है।"
    },
    {
      questionEN: "In a NOR SR latch (active-HIGH), which input combination is the forbidden/invalid state?",
      questionHI: "एक NOR SR latch (active-HIGH) में, कौन सा input combination forbidden/invalid state है?",
      options: ["S=0, R=0", "S=1, R=0", "S=0, R=1", "S=1, R=1"],
      answerIndex: 3,
      explainEN: "S=R=1 drives both NOR gates to 0, so Q=Q'=0 - the complement is broken. 00 holds, 10 sets, 01 resets; only 11 is forbidden.",
      explainHI: "S=R=1 दोनों NOR gates को 0 पर चलाता है, तो Q=Q'=0 - complement टूट जाता है। 00 hold, 10 set, 01 reset; सिर्फ़ 11 forbidden है।"
    },
    {
      questionEN: "For a NAND SR latch with active-LOW inputs S' and R', which combination is forbidden?",
      questionHI: "active-LOW inputs S' और R' वाले NAND SR latch के लिए, कौन सा combination forbidden है?",
      options: ["S'=0, R'=0", "S'=1, R'=1", "S'=0, R'=1", "S'=1, R'=0"],
      answerIndex: 0,
      explainEN: "The NAND latch is the mirror of the NOR latch. Any 0 forces a NAND output to 1, so S'=R'=0 gives Q=Q'=1 - forbidden. Here 11 is Hold, 01 Sets, 10 Resets.",
      explainHI: "NAND latch, NOR latch का दर्पण है। कोई भी 0 NAND output को 1 पर मजबूर करता, तो S'=R'=0 देता है Q=Q'=1 - forbidden। यहाँ 11 Hold, 01 Set, 10 Reset।"
    },
    {
      questionEN: "In a NOR SR latch, what does the input S=0, R=0 do?",
      questionHI: "एक NOR SR latch में, input S=0, R=0 क्या करता है?",
      options: ["Sets Q to 1", "Resets Q to 0", "Holds the last stored state", "Is the forbidden state"],
      answerIndex: 2,
      explainEN: "With both controls low, each NOR just re-inverts the looped value, so the previous Q is preserved. This is the Hold (memory) case: Q(t+1)=Q.",
      explainHI: "दोनों controls low के साथ, हर NOR बस looped मान को फिर invert करता है, तो पिछला Q सुरक्षित रहता है। यह Hold (memory) case है: Q(t+1)=Q।"
    },
    {
      questionEN: "Why is the forbidden state genuinely dangerous, not just 'not allowed'?",
      questionHI: "Forbidden state सचमुच ख़तरनाक क्यों है, महज़ 'मना' नहीं?",
      options: [
        "It permanently latches Q to 1 and cannot be reset",
        "It makes Q=Q' (breaking the complement), and releasing both inputs together causes an unpredictable, gate-delay-dependent race",
        "It draws so much current the gates overheat",
        "It has no real effect on the circuit"
      ],
      answerIndex: 1,
      explainEN: "It breaks the Q/Q' complement, and when both inputs drop together the loop settles by whichever gate is microscopically faster - an unpredictable, possibly metastable result.",
      explainHI: "यह Q/Q' complement तोड़ता है, और जब दोनों inputs साथ गिरें तो loop उसी gate से settle होता जो सूक्ष्म रूप से तेज़ हो - एक अप्रत्याशित, संभवतः metastable नतीजा।"
    },
    {
      questionEN: "How does the gated D latch make the forbidden state impossible?",
      questionHI: "Gated D latch forbidden state को असंभव कैसे बनाता है?",
      options: [
        "It removes the enable line",
        "It forces R = D' (and S = D) so S and R are always complementary, so S=R can never both be 1 or both be 0",
        "It replaces the NOR gates with XOR gates",
        "It adds a second, slower clock"
      ],
      answerIndex: 1,
      explainEN: "Deriving R from D through an inverter means S and R are always opposite. S=R=1 needs D=D'=1 and S=R=0 needs D=D'=0 - both impossible. The result is Q(t+1)=D.",
      explainHI: "R को D से एक inverter के ज़रिए निकालना मतलब S और R हमेशा विपरीत। S=R=1 को D=D'=1 चाहिए और S=R=0 को D=D'=0 - दोनों असंभव। नतीजा Q(t+1)=D।"
    },
    {
      questionEN: "What does 'level-sensitive transparency' mean for a gated D latch?",
      questionHI: "एक gated D latch के लिए 'level-sensitive transparency' का क्या मतलब है?",
      options: [
        "Q changes only on the rising edge of the clock",
        "While EN=1 the output Q continuously follows D; while EN=0 Q holds the last captured value",
        "The latch is physically see-through",
        "Q is always exactly equal to D regardless of EN"
      ],
      answerIndex: 1,
      explainEN: "A latch responds to the level of EN. While EN=1 it is open and transparent - Q tracks every change on D; the instant EN=0 it closes and Q freezes. That whole-pulse transparency is the flaw flip-flops fix.",
      explainHI: "एक latch EN के level पर प्रतिक्रिया देता है। जब EN=1 यह खुला और transparent - Q, D के हर बदलाव को track करता; जिस पल EN=0 यह बंद होकर Q जमा देता। वह पूरे-pulse transparency ही दोष है जिसे flip-flops ठीक करते हैं।"
    }
  ]
};
