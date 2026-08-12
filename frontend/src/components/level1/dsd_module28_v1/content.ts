import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/28 - Sequential Logic Fundamentals, "Circuits That Remember".
 * Opening module of the SEQUENTIAL track. The one new idea is MEMORY: a
 * combinational circuit obeys Output = f(Input) and forgets the instant its
 * inputs change, while a sequential circuit obeys Next = f(Present Input, Past
 * State) - its answer also depends on stored history. That stored history is
 * the STATE, and it is created physically by a FEEDBACK LOOP (an output wired
 * back to an input). Memory elements split into latches (level-triggered /
 * transparent) and flip-flops (edge-triggered / synchronized); systems split
 * into synchronous (one master clock, discrete edges) and asynchronous (no
 * clock, instant reaction). Analogy anchor: a push-button two-state machine -
 * press toggles OFF<->ON, release self-loops and remembers. Facts lead; the
 * push-button picture supports.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Sequential Logic Fundamentals - Circuits That Remember",
  moduleSubtitle: "The jump from combinational to sequential: a feedback loop stores state, so the next output depends on the present input AND the remembered past.",
  scenes: [
    {
      id: "S00_Cover",
      label: "Circuits That Remember",
      kind: "cover",
      subtitle: "A push-button that keeps its answer after you let go - the whole idea of memory in one tap.",
      theoryEN: [
        "This module is the doorway out of combinational logic, where a circuit only ever reacts to the inputs it has right now, and into sequential logic, where a circuit can remember. That one new power - memory - is what lets digital systems count, store data, and follow a sequence of steps instead of merely reacting.",
        "A combinational circuit obeys a single rule: Output = f(Input). Feed it the same inputs and it always returns the same output, with no history involved. A sequential circuit obeys a richer rule: Next = f(Present Input, Past State). Its answer depends not only on what you feed it now, but on what it already remembers.",
        "That remembered quantity is called the STATE. State is stored past information that persists even after the input that set it is removed - the circuit literally remembers your last action, the way a light switch stays on after your finger leaves it.",
        "Memory is built from a single trick: a feedback loop. Wire a logic block's output back into its own input and the circuit can hold a value, feeding its own answer to itself over and over until something deliberately tells it to change.",
        "By the end you will tell a latch (transparent, level-triggered) from a flip-flop (edge-triggered, synchronized), separate synchronous circuits from asynchronous ones, and read the push-button two-state machine that anchors the entire track."
      ],
      theoryHI: [
        "यह module combinational logic से बाहर निकलने का दरवाज़ा है, जहाँ circuit सिर्फ़ अभी मौजूद inputs पर प्रतिक्रिया देता है, और sequential logic में प्रवेश, जहाँ circuit याद रख सकता है। वही एक नई शक्ति - memory - digital systems को गिनने, data store करने, और महज़ प्रतिक्रिया देने के बजाय कदमों का एक क्रम निभाने देती है।",
        "combinational circuit एक ही नियम मानता है: Output = f(Input)। वही inputs दीजिए और यह हमेशा वही output लौटाता है, कोई history शामिल नहीं। sequential circuit एक समृद्ध नियम मानता है: Next = f(Present Input, Past State)। इसका उत्तर सिर्फ़ इस पर निर्भर नहीं कि आप अभी क्या दे रहे हैं, बल्कि इस पर भी कि यह पहले से क्या याद रखता है।",
        "उस याद रखी गई मात्रा को STATE कहते हैं। State वह संचित बीता जानकारी है जो उस input के हटने के बाद भी बनी रहती है जिसने उसे set किया था - circuit सचमुच आपकी पिछली क्रिया याद रखता है, जैसे light switch आपकी उँगली हटने के बाद भी जला रहता है।",
        "Memory एक ही तरकीब से बनती है: एक feedback loop। किसी logic block के output को उसके अपने input में वापस wire कीजिए और circuit एक मान पकड़ सकता है, अपना ही उत्तर बार-बार ख़ुद को feed करते हुए, जब तक कुछ जानबूझकर उसे बदलने को न कहे।",
        "अंत तक आप latch (transparent, level-triggered) को flip-flop (edge-triggered, synchronized) से अलग पहचानेंगे, synchronous circuits को asynchronous से अलग करेंगे, और वह push-button two-state machine पढ़ेंगे जो पूरे track को anchor करती है।"
      ],
      transcriptEN: "Welcome to sequential logic - circuits that remember. Every circuit you've built so far is combinational: its output is a pure function of its inputs right now, written Output equals f of Input. Feed it the same inputs and it always answers the same, with no memory of the past. A sequential circuit adds one ingredient: state. Its rule becomes Next equals f of present input and past state, so the same input can give different answers depending on what the circuit already remembers. That memory is created by a feedback loop - an output wired back to an input, so a bit can circulate and hold itself. Memory elements come in two kinds: latches, which are transparent and follow their input while an enable level is high, and flip-flops, which capture only at a clock edge. And whole systems are either synchronous, marching to one master clock, or asynchronous, reacting the instant an input changes. The push-button on this page is the whole idea: press it and the stored state flips and stays, even after you let go.",
      transcriptHI: "Sequential logic में स्वागत है - circuits जो याद रखते हैं। अब तक आपने जो भी circuit बनाया वह combinational था: इसका output अभी के inputs का शुद्ध function है, लिखा Output बराबर f of Input। वही inputs दीजिए और यह हमेशा वही उत्तर देता है, बीते की कोई memory नहीं। sequential circuit एक घटक जोड़ता है: state। इसका नियम बनता है Next बराबर f of present input और past state, तो वही input अलग उत्तर दे सकता है इस पर निर्भर कि circuit पहले से क्या याद रखता है। वह memory एक feedback loop से बनती है - output वापस input में wire, ताकि एक bit घूमकर ख़ुद को टिका सके। Memory elements दो तरह के होते हैं: latches, जो transparent हैं और enable level high रहते input को follow करते हैं, और flip-flops, जो सिर्फ़ clock edge पर capture करते हैं। और पूरे systems या तो synchronous होते हैं, एक master clock पर चलते, या asynchronous, input बदलते ही प्रतिक्रिया देते। इस page का push-button पूरा विचार है: दबाइए और stored state पलटकर टिका रहता है, छोड़ने के बाद भी।",
      visualNote: "Hero: a push-button. Press it and a stored State bit flips 0->1; release and it STAYS - beside a momentary lamp that only glows while pressed, proving memory."
    },
    {
      id: "S01_Video",
      label: "Sequential Logic, The Big Idea",
      kind: "video",
      subtitle: "A short film on the jump from 'reacts to inputs' to 'remembers state'.",
      theoryEN: [
        "Before you watch, hold the core contrast in your head. A combinational circuit is a pure function of its inputs - adders, multiplexers, decoders. Nothing it does depends on the past; give it the same inputs and it gives the same output every single time.",
        "A sequential circuit adds one ingredient: state. It carries a memory of where it has been, and its next output is computed from both the present input and that stored past state, written Next = f(Present Input, Past State).",
        "The physical secret is feedback. By routing an output wire back to an input, the circuit can latch onto a value and keep regenerating it, which is exactly what storing a bit means in real hardware.",
        "Two families of memory element will appear: the latch, which is transparent and follows its input while its enable level is high, and the flip-flop, which captures only on a clock edge - the instant the clock rises from 0 to 1.",
        "Finally, timing style. A synchronous circuit marches to one shared master clock and changes only at its discrete edges; an asynchronous circuit has no clock and reacts the instant an input changes."
      ],
      theoryHI: [
        "देखने से पहले मूल विरोधाभास मन में पकड़िए। combinational circuit अपने inputs का शुद्ध function है - adders, multiplexers, decoders। इसका किया कुछ भी बीते पर निर्भर नहीं; वही inputs दीजिए और यह हर बार वही output देता है।",
        "sequential circuit एक घटक जोड़ता है: state। यह इस बात की memory रखता है कि यह कहाँ रहा है, और इसका अगला output present input और उस संचित past state दोनों से निकाला जाता है, लिखा Next = f(Present Input, Past State)।",
        "भौतिक रहस्य है feedback। एक output wire को वापस input में route करके, circuit किसी मान को पकड़कर उसे बार-बार पुनः उत्पन्न कर सकता है, और असली hardware में एक bit store करने का यही अर्थ है।",
        "memory element के दो परिवार सामने आएँगे: latch, जो transparent है और enable level high रहते अपने input को follow करता है, और flip-flop, जो सिर्फ़ clock edge पर capture करता है - उस पल जब clock 0 से 1 तक उठता है।",
        "अंत में, timing शैली। synchronous circuit एक साझा master clock पर चलता है और सिर्फ़ इसके discrete edges पर बदलता है; asynchronous circuit के पास कोई clock नहीं और यह input बदलते ही प्रतिक्रिया देता है।"
      ],
      transcriptEN: "Here's the whole idea before you watch. A combinational circuit is a pure function of its inputs - an adder, a multiplexer, a decoder. Nothing depends on the past, so identical inputs always give identical outputs. A sequential circuit adds state: a memory of where it has been. Its next output is computed from both the present input and that stored past state - Next equals f of present input and past state. The physical secret is feedback: route an output back to an input and a bit can latch and sustain itself. Two memory elements appear. A latch is level-triggered and transparent - while its enable is high, the output follows the input straight through. A flip-flop is edge-triggered - it samples the input only at the clock edge, when the clock rises from zero to one. And systems are classed by timing: synchronous circuits share one master clock and change only at its discrete edges, marching in lockstep; asynchronous circuits have no clock and react the instant an input changes. Watch how each of these follows from one thing - a circuit that can remember.",
      transcriptHI: "देखने से पहले पूरा विचार। combinational circuit अपने inputs का शुद्ध function है - एक adder, एक multiplexer, एक decoder। कुछ भी बीते पर निर्भर नहीं, तो एक जैसे inputs हमेशा एक जैसे outputs देते हैं। sequential circuit state जोड़ता है: यह कहाँ रहा इसकी memory। इसका अगला output present input और उस संचित past state दोनों से निकाला जाता है - Next बराबर f of present input और past state। भौतिक रहस्य feedback है: output को वापस input में route कीजिए और एक bit latch होकर ख़ुद को टिका सकता है। दो memory elements सामने आते हैं। latch level-triggered और transparent है - enable high रहते output सीधे input को follow करता है। flip-flop edge-triggered है - यह input को सिर्फ़ clock edge पर sample करता है, जब clock शून्य से एक तक उठता है। और systems timing से वर्गीकृत होते हैं: synchronous circuits एक master clock साझा करते और सिर्फ़ इसके discrete edges पर बदलते, lockstep में चलते; asynchronous circuits के पास कोई clock नहीं और वे input बदलते ही प्रतिक्रिया देते हैं। देखिए कैसे ये सब एक ही चीज़ से निकलते हैं - एक circuit जो याद रख सकता है।",
      visualNote: "Animated explainer: a combinational block recomputing instantly beside a sequential block with a feedback loop holding a bit; then a latch's open window versus a flip-flop's single edge."
    },
    {
      id: "S02_Facts",
      label: "Combinational vs Sequential",
      kind: "theory",
      subtitle: "Output = f(Input) versus Next = f(Present Input, Past State).",
      theoryEN: [
        "Every digital circuit you have met so far this course has been combinational, meaning its output at any instant is a pure function of the inputs present at that same instant. Write it as Output = f(Input). An adder handed 3 and 5 always answers 8; a multiplexer handed a select code always routes the same input. There is no notion of before - remove the inputs and the circuit has nothing left to say.",
        "Sequential logic breaks that limitation by giving the circuit a memory. Its defining equation gains a second argument: Next = f(Present Input, Past State). The output now depends on two things at once - the inputs you are applying right now, and the state the circuit was already holding from everything that happened before.",
        "Concretely, imagine two boxes fed the exact same input sequence. The combinational box recomputes from scratch every time, so identical inputs always produce identical outputs. The sequential box first looks at what it remembers, combines that with the input, produces a new output, and stores an updated memory - so the very same input can produce different outputs depending on the box's history.",
        "This is why sequential circuits can do things combinational circuits fundamentally cannot: count, where each tick depends on the previous count; detect sequences, where the answer depends on the bits that came before; and hold data in registers and memories. Anything that needs the past needs state, and anything with state is sequential.",
        "Keep the interactive above as your mental model. The left block is combinational: toggle its inputs and the output snaps to f(Input) with zero memory. The right block is sequential: it carries a stored State, and its next value is computed from your input together with that state - the past leaking into the present through a single feedback wire."
      ],
      theoryHI: [
        "इस course में अब तक आप जिस भी digital circuit से मिले हैं वह combinational रहा है, यानी किसी भी पल इसका output उसी पल मौजूद inputs का शुद्ध function है। इसे Output = f(Input) लिखिए। 3 और 5 दिया गया adder हमेशा 8 उत्तर देता है; एक select code दिया गया multiplexer हमेशा वही input route करता है। 'पहले' की कोई धारणा नहीं - inputs हटा दीजिए और circuit के पास कहने को कुछ नहीं बचता।",
        "sequential logic circuit को memory देकर उस सीमा को तोड़ता है। इसका परिभाषक समीकरण एक दूसरा argument पाता है: Next = f(Present Input, Past State)। अब output एक साथ दो चीज़ों पर निर्भर करता है - वे inputs जो आप अभी लगा रहे हैं, और वह state जो circuit पहले हुई हर बात से पहले से पकड़े था।",
        "ठोस रूप में, दो boxes की कल्पना कीजिए जिन्हें बिल्कुल वही input क्रम दिया जाए। combinational box हर बार शून्य से पुनर्गणना करता है, तो एक जैसे inputs हमेशा एक जैसे outputs देते हैं। sequential box पहले देखता है कि यह क्या याद रखता है, उसे input के साथ मिलाता है, एक नया output बनाता है, और एक अद्यतन memory store करता है - तो वही input, box के इतिहास के अनुसार, अलग outputs दे सकता है।",
        "इसीलिए sequential circuits वे काम कर सकते हैं जो combinational circuits मूलतः नहीं कर सकते: गिनना, जहाँ हर tick पिछली गिनती पर निर्भर है; क्रम पहचानना, जहाँ उत्तर पहले आए bits पर निर्भर है; और registers तथा memories में data पकड़ना। जिस भी चीज़ को बीता चाहिए उसे state चाहिए, और जिसमें state है वह sequential है।",
        "ऊपर के interactive को अपना मानसिक मॉडल रखिए। बायाँ block combinational है: इसके inputs toggle कीजिए और output शून्य memory के साथ f(Input) पर आ जाता है। दायाँ block sequential है: यह एक संचित State रखता है, और इसका अगला मान आपके input को उस state के साथ मिलाकर निकाला जाता है - बीता एक अकेले feedback wire से वर्तमान में रिसता हुआ।"
      ],
      transcriptEN: "Every circuit so far has been combinational: its output at any instant is a pure function of the inputs at that same instant, Output equals f of Input. An adder given three and five always says eight; there's no notion of before. Sequential logic gives the circuit memory. Its equation gains a second argument: Next equals f of present input and past state. Imagine two boxes fed the same input sequence. The combinational box recomputes from scratch, so identical inputs give identical outputs. The sequential box first reads what it remembers, combines it with the input, produces an output, and stores an updated memory - so the same input can give different outputs depending on its history. That's why sequential circuits can count, detect sequences, and hold data - anything that needs the past needs state, and anything with state is sequential.",
      transcriptHI: "अब तक हर circuit combinational रहा है: किसी पल इसका output उसी पल के inputs का शुद्ध function है, Output बराबर f of Input। तीन और पाँच दिया adder हमेशा आठ कहता है; 'पहले' की धारणा नहीं। sequential logic circuit को memory देता है। इसका समीकरण दूसरा argument पाता है: Next बराबर f of present input और past state। दो boxes सोचिए जिन्हें वही input क्रम मिले। combinational box शून्य से पुनर्गणना करता है, तो एक जैसे inputs एक जैसे outputs देते हैं। sequential box पहले पढ़ता है कि यह क्या याद रखता है, उसे input से मिलाता है, output बनाता है, और अद्यतन memory store करता है - तो वही input इतिहास के अनुसार अलग outputs दे सकता है। इसीलिए sequential circuits गिन सकते हैं, क्रम पहचान सकते हैं, और data पकड़ सकते हैं - जिसे बीता चाहिए उसे state चाहिए, और जिसमें state है वह sequential है।",
      visualNote: "Side-by-side: a combinational block (Y = A XOR B) that recomputes instantly, and a sequential block (Next = In XOR Q) with a stored state Q fed back, plus a clock tick to commit."
    },
    {
      id: "S03_Feedback",
      label: "The Feedback Loop Is The Memory",
      kind: "theory",
      subtitle: "Wire an output back to an input and the circuit can hold a bit forever.",
      theoryEN: [
        "Where does state physically live? Not in a special memory atom - it lives in a wire that loops back on itself. The entire secret of digital memory is feedback: take a logic block's output and route it back into that same block's input, so the circuit is continuously told what it just said.",
        "Picture a block whose output Q is fed back as one of its own inputs. If the logic is arranged so that when nothing new arrives it keeps repeating Q, then Q sustains itself. The 1, or the 0, circulates around the loop, each pass regenerating the next, and the value simply persists. That self-sustaining circulation is a stored bit.",
        "The loop is also what makes memory writable. External inputs can reach into the loop and force it to a new value - set it to 1, or clear it to 0 - and once they let go, the feedback takes over again and holds whatever was last forced in. Write, then hold; write again, then hold. Nothing about the loop is passive.",
        "Cut the loop and the magic vanishes. With no path from output back to input, the block becomes ordinary combinational logic again: the moment the driving input disappears, the output collapses and nothing is remembered. Reconnect the loop and memory returns. The interactive above lets you snip and restore that feedback wire and watch the stored bit appear and disappear.",
        "This one idea - an output cross-fed to an input - is the seed of every latch, flip-flop, register, and RAM cell in existence. Everything else on this track is just increasingly careful machinery for controlling exactly WHEN that loop is allowed to accept a new value."
      ],
      theoryHI: [
        "State भौतिक रूप से कहाँ रहती है? किसी विशेष memory परमाणु में नहीं - यह एक ऐसी wire में रहती है जो ख़ुद पर वापस लूप करती है। digital memory का पूरा रहस्य feedback है: किसी logic block के output को लेकर उसी block के input में वापस route कीजिए, ताकि circuit को लगातार बताया जाए कि इसने अभी क्या कहा।",
        "एक ऐसे block की कल्पना कीजिए जिसका output Q उसके अपने ही एक input के रूप में वापस feed होता है। अगर logic ऐसे व्यवस्थित हो कि जब कुछ नया न आए तो यह Q दोहराता रहे, तब Q ख़ुद को टिकाए रखता है। वह 1, या 0, loop के चारों ओर घूमता है, हर चक्कर अगले को पुनः उत्पन्न करता, और मान बस बना रहता है। वह स्वयं-टिकाऊ परिसंचरण एक संचित bit है।",
        "loop ही memory को लिखने-योग्य भी बनाता है। बाहरी inputs loop तक पहुँचकर उसे एक नए मान पर बाध्य कर सकते हैं - 1 पर set, या 0 पर clear - और जैसे ही वे छोड़ते हैं, feedback फिर सँभाल लेता है और जो अंतिम बार बाध्य किया गया उसे पकड़े रहता है। लिखिए, फिर पकड़िए; फिर लिखिए, फिर पकड़िए। loop के बारे में कुछ भी निष्क्रिय नहीं।",
        "loop काटिए और जादू ग़ायब हो जाता है। output से input तक कोई रास्ता न होने पर, block फिर से साधारण combinational logic बन जाता है: जिस पल चलाने वाला input ग़ायब होता है, output ढह जाता है और कुछ याद नहीं रहता। loop फिर जोड़िए और memory लौट आती है। ऊपर का interactive आपको उस feedback wire को काटने और बहाल करने देता है, और stored bit को प्रकट व लुप्त होते देखने देता है।",
        "यही एक विचार - एक output का एक input में cross-feed होना - अस्तित्व में मौजूद हर latch, flip-flop, register, और RAM cell का बीज है। इस track की बाक़ी हर चीज़ बस उत्तरोत्तर सावधान मशीनरी है, यह नियंत्रित करने के लिए कि वह loop नया मान कब स्वीकार करने पाए।"
      ],
      transcriptEN: "Where does state physically live? Not in a special memory atom - in a wire that loops back on itself. The secret of digital memory is feedback: take a logic block's output and route it back into its own input, so the circuit is continuously told what it just said. If the logic keeps repeating that value when nothing new arrives, the bit circulates around the loop and sustains itself - that self-sustaining circulation is a stored bit. The loop also makes memory writable: external inputs can force it to one or to zero, and when they let go, the feedback holds whatever was last written. Cut the loop and the magic vanishes - with no path from output back to input, the output collapses the instant the driving input disappears, and nothing is remembered. Reconnect it and memory returns. This one idea, an output cross-fed to an input, is the seed of every latch, flip-flop, register, and RAM cell there is.",
      transcriptHI: "State भौतिक रूप से कहाँ रहती है? किसी विशेष memory परमाणु में नहीं - एक ऐसी wire में जो ख़ुद पर वापस लूप करती है। digital memory का रहस्य feedback है: logic block के output को उसके अपने input में वापस route कीजिए, ताकि circuit को लगातार बताया जाए कि इसने अभी क्या कहा। अगर कुछ नया न आने पर logic उस मान को दोहराता रहे, तो bit loop के चारों ओर घूमकर ख़ुद को टिकाता है - वह स्वयं-टिकाऊ परिसंचरण एक संचित bit है। loop memory को लिखने-योग्य भी बनाता है: बाहरी inputs इसे एक या शून्य पर बाध्य कर सकते हैं, और छोड़ते ही feedback जो अंतिम बार लिखा उसे पकड़ता है। loop काटिए और जादू ग़ायब - output से input तक रास्ता न होने पर, चलाने वाला input ग़ायब होते ही output ढह जाता है, और कुछ याद नहीं रहता। फिर जोड़िए और memory लौटती है। यही एक विचार, output का input में cross-feed, हर latch, flip-flop, register, और RAM cell का बीज है।",
      visualNote: "A logic block whose output Q is cross-fed to its own input; SET/CLR write into the loop while it holds; a 'cut the loop' toggle severs the feedback and the stored bit collapses to 0."
    },
    {
      id: "S04_State",
      label: "State Persists After The Input Is Gone",
      kind: "theory",
      subtitle: "Pulse an input once; the stored state holds long after it falls.",
      theoryEN: [
        "The signature test of memory is simple: apply an input briefly, take it away, and check whether anything remains. In a combinational circuit the answer is always no - the output tracks the input and drops the instant the input drops. In a sequential circuit the answer can be yes, and that lingering yes is the state.",
        "Formally, state is stored past information that persists after the input that created it has been removed. It is the circuit's summary of its own history - just enough of the past to decide the future. A wall light switch is the everyday picture: flick it once and it stays on; your finger, the input, is long gone, yet the state, on, remains.",
        "Watch the timing strip above. A short Set pulse rises and then falls back to 0 after a moment. The stored output Q rises with it - and then, crucially, stays high through every following idle tick, even though the input is now 0. The input was momentary; the state is permanent until something deliberately changes it.",
        "That permanence is exactly what a counter, a register, or a traffic-light controller relies on. Each depends on holding where we are steady between events, so that when the next event arrives the circuit knows what to do next. Without persistent state, every clock tick would have to start again from nothing.",
        "A separate Reset input can force the state back to 0, proving the memory is controllable, not stuck. Set makes it remember a 1; Reset makes it remember a 0; and in between, with no input applied at all, it simply keeps whatever it was last told - that quiet keeping is the essence of state."
      ],
      theoryHI: [
        "memory की पहचान वाली परीक्षा सरल है: एक input थोड़ी देर लगाइए, हटा दीजिए, और जाँचिए कि कुछ बचता है या नहीं। combinational circuit में उत्तर हमेशा नहीं होता है - output input को track करता है और input गिरते ही गिर जाता है। sequential circuit में उत्तर हाँ हो सकता है, और वह टिका हुआ हाँ ही state है।",
        "औपचारिक रूप से, state वह संचित बीता जानकारी है जो उसे बनाने वाले input के हटने के बाद बनी रहती है। यह circuit का अपने ही इतिहास का सारांश है - भविष्य तय करने भर का बीता। दीवार का light switch रोज़मर्रा की तस्वीर है: एक बार दबाइए और यह जला रहता है; आपकी उँगली, input, कब की जा चुकी, फिर भी state, जला, बना रहता है।",
        "ऊपर की timing strip देखिए। एक छोटी Set pulse उठती है और फिर एक पल बाद 0 पर लौट आती है। संचित output Q उसके साथ उठता है - और फिर, अहम बात, हर आगे आने वाले idle tick में high बना रहता है, भले ही input अब 0 है। input क्षणिक था; state स्थायी है जब तक कुछ जानबूझकर उसे न बदले।",
        "वह स्थायित्व ही है जिस पर एक counter, एक register, या एक traffic-light controller टिका होता है। हर एक घटनाओं के बीच 'हम कहाँ हैं' को स्थिर पकड़े रहने पर निर्भर है, ताकि अगली घटना आने पर circuit जाने कि आगे क्या करना है। स्थायी state के बिना, हर clock tick को फिर शून्य से शुरू करना पड़ता।",
        "एक अलग Reset input state को वापस 0 पर बाध्य कर सकता है, यह साबित करते कि memory नियंत्रणीय है, अटकी हुई नहीं। Set इसे 1 याद कराता है; Reset इसे 0 याद कराता है; और बीच में, बिल्कुल कोई input लगाए बिना, यह बस जो अंतिम बार बताया गया उसे पकड़े रहता है - वही शांत पकड़ना state का सार है।"
      ],
      transcriptEN: "The signature test of memory is simple: apply an input briefly, take it away, and see whether anything remains. In a combinational circuit, nothing does - the output drops the instant the input drops. In a sequential circuit, something can remain, and that lingering value is the state. Formally, state is stored past information that persists after the input that created it is removed - the circuit's summary of its own history, just enough of the past to decide the future. Watch the strip: a short Set pulse rises and falls back to zero, but the stored output Q rises and then stays high through every idle tick that follows, even though the input is now zero. The input was momentary; the state is permanent until something changes it. That's exactly what counters, registers, and controllers rely on. A separate Reset input can force the state back to zero, proving the memory is controllable - set remembers a one, reset remembers a zero, and with no input at all it simply keeps its last value.",
      transcriptHI: "memory की पहचान वाली परीक्षा सरल है: एक input थोड़ी देर लगाइए, हटा दीजिए, और देखिए कि कुछ बचता है या नहीं। combinational circuit में कुछ नहीं बचता - input गिरते ही output गिर जाता है। sequential circuit में कुछ बच सकता है, और वह टिका मान ही state है। औपचारिक रूप से, state वह संचित बीता जानकारी है जो उसे बनाने वाले input के हटने के बाद बनी रहती है - circuit का अपने इतिहास का सारांश, भविष्य तय करने भर का बीता। strip देखिए: एक छोटी Set pulse उठकर शून्य पर लौटती है, पर संचित output Q उठकर हर आगे idle tick में high बना रहता है, भले input अब शून्य है। input क्षणिक था; state स्थायी है जब तक कुछ उसे न बदले। यही है जिस पर counters, registers, और controllers टिके हैं। एक अलग Reset input state को वापस शून्य पर बाध्य कर सकता है, memory को नियंत्रणीय साबित करते - set एक याद रखता, reset शून्य याद रखता, और बिना किसी input के यह बस अपना अंतिम मान पकड़े रहता है।",
      visualNote: "A rolling timing strip: a Set pulse goes high then low; Q latches high and holds through every idle tick after the input falls; a Reset pulse clears it to 0."
    },
    {
      id: "S05_LatchVsFF",
      label: "Latch vs Flip-Flop",
      kind: "theory",
      subtitle: "Transparent while a level is high, versus captured only on a clock edge.",
      theoryEN: [
        "Both latches and flip-flops store exactly one bit, but they differ in precisely WHEN they are willing to accept a new value - and that single difference decides almost everything about how you design with them.",
        "A latch is level-triggered, also called transparent. While its enable (or clock level) is high, the latch is wide open: its output Q continuously follows the input, copying every change straight through as if the memory were not there. Only when the enable goes low does it freeze, holding the last value it saw. Look at the gated D latch on the left - with EN = 1 the output tracks D live; with EN = 0 it is frozen.",
        "A flip-flop is edge-triggered, also called synchronized. It ignores its input at all times except one razor-thin instant: the clock edge, the moment the clock transitions from 0 to 1, called a positive or rising edge. At that edge it samples the input once, stores it, and then ignores the input again until the next edge. The D flip-flop on the right only moves Q when you tick the clock, never in between.",
        "The consequence is transparency versus discipline. A latch's output can wobble at any time the enable is high, because it passes input changes through the whole time - a wide, leaky window. A flip-flop's output can only change at clean, predictable, evenly spaced clock edges - a single, sharp sampling instant - which is what lets thousands of them stay perfectly in step.",
        "That is why almost all modern synchronous systems are built from edge-triggered flip-flops rather than transparent latches: the sharp edge removes the timing ambiguity of the open window. Later modules build the latch first, then fix its transparent-window flaw with edge triggering to obtain the flip-flop."
      ],
      theoryHI: [
        "latches और flip-flops दोनों ठीक एक bit store करते हैं, पर वे इसमें भिन्न हैं कि वे नया मान स्वीकार करने को ठीक कब तैयार होते हैं - और वही एक भिन्नता तय करती है कि आप उनसे कैसे design करते हैं।",
        "latch level-triggered है, जिसे transparent भी कहते हैं। जब तक इसका enable (या clock level) high है, latch पूरा खुला है: इसका output Q लगातार input को follow करता है, हर बदलाव को सीधे copy करते हुए मानो memory है ही नहीं। सिर्फ़ जब enable low होता है तब यह जम जाता है, अंतिम देखा मान पकड़ते हुए। बाईं ओर gated D latch देखिए - EN = 1 पर output D को live track करता है; EN = 0 पर यह जमा हुआ है।",
        "flip-flop edge-triggered है, जिसे synchronized भी कहते हैं। यह हर समय अपने input को नज़रअंदाज़ करता है, सिवाय एक बाल-बराबर पल के: clock edge, वह क्षण जब clock 0 से 1 तक बदलता है, जिसे positive या rising edge कहते हैं। उस edge पर यह input को एक बार sample करता है, store करता है, और फिर अगले edge तक input को फिर नज़रअंदाज़ करता है। दाईं ओर D flip-flop Q को सिर्फ़ तब हिलाता है जब आप clock tick करते हैं, बीच में कभी नहीं।",
        "परिणाम है transparency बनाम अनुशासन। latch का output किसी भी समय हिल सकता है जब enable high हो, क्योंकि यह पूरे समय input बदलावों को पार होने देता है - एक चौड़ी, रिसती खिड़की। flip-flop का output सिर्फ़ साफ़, अनुमेय, समान-दूरी clock edges पर बदल सकता है - एक अकेला, तीखा sampling पल - और यही हज़ारों को एकदम कदम-से-कदम रखता है।",
        "इसीलिए लगभग सभी आधुनिक synchronous systems transparent latches के बजाय edge-triggered flip-flops से बने हैं: तीखा edge खुली खिड़की की timing अस्पष्टता को हटा देता है। आगे के modules पहले latch बनाते हैं, फिर उसकी transparent-window ख़ामी को edge triggering से ठीक करके flip-flop पाते हैं।"
      ],
      transcriptEN: "Both latches and flip-flops store one bit, but they differ in exactly when they'll accept a new value. A latch is level-triggered, or transparent: while its enable is high, it's wide open and its output continuously follows the input, copying every change straight through. Only when the enable goes low does it freeze the last value. Look at the gated D latch - with enable one the output tracks D live; with enable zero it's frozen. A flip-flop is edge-triggered, or synchronized: it ignores its input except at one razor-thin instant, the clock edge, when the clock goes from zero to one. There it samples once, stores, and ignores the input until the next edge. The D flip-flop only moves Q when you tick the clock, never in between. So a latch's output can wobble any time the enable is high - a wide, leaky window - while a flip-flop's output changes only at clean, evenly spaced edges - a single sharp instant. That sharp edge is why nearly all synchronous systems use edge-triggered flip-flops rather than transparent latches.",
      transcriptHI: "latches और flip-flops दोनों एक bit store करते हैं, पर वे इसमें भिन्न हैं कि वे नया मान ठीक कब स्वीकार करेंगे। latch level-triggered या transparent है: enable high रहते यह पूरा खुला है और इसका output लगातार input को follow करता है, हर बदलाव को सीधे copy करते। सिर्फ़ enable low होने पर यह अंतिम मान जमा देता है। gated D latch देखिए - enable एक पर output D को live track करता है; enable शून्य पर यह जमा है। flip-flop edge-triggered या synchronized है: यह input को नज़रअंदाज़ करता है सिवाय एक बाल-बराबर पल के, clock edge, जब clock शून्य से एक तक जाता है। वहाँ यह एक बार sample करता, store करता, और अगले edge तक input नज़रअंदाज़ करता है। D flip-flop Q को सिर्फ़ tick पर हिलाता है, बीच में कभी नहीं। तो latch का output enable high रहते किसी भी समय हिल सकता है - चौड़ी, रिसती खिड़की - जबकि flip-flop का output सिर्फ़ साफ़, समान-दूरी edges पर बदलता है - एक तीखा पल। वही तीखा edge है जिससे लगभग सभी synchronous systems transparent latches के बजाय edge-triggered flip-flops वापरते हैं।",
      visualNote: "Left: a gated D latch, transparent while EN=1 (Q follows D live). Right: a D flip-flop, Q moves only on the clock edge you tick - two contrasting live cells."
    },
    {
      id: "S06_SyncVsAsync",
      label: "Synchronous vs Asynchronous",
      kind: "theory",
      subtitle: "One master clock and discrete edges, versus no clock and instant reaction.",
      theoryEN: [
        "Beyond how a single element captures data, there is a system-wide question: does everything change together on a schedule, or does each part react whenever it likes? That split is synchronous versus asynchronous, and it shapes how an entire chip behaves.",
        "A synchronous circuit is governed by one shared master clock - a square wave ticking at a fixed rate. Every memory element is allowed to update only at the clock's discrete edges, so the whole machine advances in lockstep, one well-defined step per tick. The clock waveform above marks exactly the instants where state is permitted to change; between edges, everything is frozen and stable.",
        "Because all changes line up on the same edges, synchronous design is predictable and easy to reason about. Signals are given the whole clock period to settle before the next edge samples them, so glitches that appear mid-period simply die out before they can matter. This is why the overwhelming majority of real chips are synchronous.",
        "An asynchronous circuit has no clock at all. Each element reacts the instant one of its inputs changes, propagating as fast as the gates allow, unmetered by any global tick. The scribbly track above stands for this: events land at irregular, arbitrary moments rather than on a neat, evenly spaced grid.",
        "Asynchronous logic can be faster and lower-power because nothing waits for a clock, but it is far harder to design correctly - with no common reference edge, races and hazards between signals become the designer's problem. The clean discipline of one master clock is the price paid, and usually paid gladly, for predictable behaviour."
      ],
      theoryHI: [
        "एक अकेला element data कैसे capture करता है इससे परे, एक system-भर का सवाल है: क्या सब कुछ एक समय-सारणी पर साथ बदलता है, या हर हिस्सा जब चाहे तब प्रतिक्रिया देता है? वही विभाजन synchronous बनाम asynchronous है, और यह तय करता है कि पूरा chip कैसे बर्ताव करे।",
        "synchronous circuit एक साझा master clock द्वारा शासित होता है - एक square wave जो एक निश्चित दर पर tick करती है। हर memory element को सिर्फ़ clock के discrete edges पर अद्यतन करने दिया जाता है, तो पूरी मशीन lockstep में आगे बढ़ती है, प्रति tick एक सुपरिभाषित कदम। ऊपर की clock waveform ठीक वे पल चिह्नित करती है जहाँ state को बदलने दिया जाता है; edges के बीच, सब कुछ जमा और स्थिर है।",
        "चूँकि सभी बदलाव एक ही edges पर पंक्तिबद्ध होते हैं, synchronous design अनुमेय और तर्क करने में आसान है। signals को अगला edge उन्हें sample करने से पहले settle होने के लिए पूरा clock period मिलता है, तो जो glitches बीच-period में उठते हैं वे मायने रखने से पहले ही मर जाते हैं। इसीलिए असली chips का भारी बहुमत synchronous है।",
        "asynchronous circuit के पास बिल्कुल कोई clock नहीं। हर element उस पल प्रतिक्रिया देता है जब इसका कोई एक input बदलता है, gates जितनी तेज़ी दें उतनी फैलते हुए, किसी global tick से अनियंत्रित। ऊपर का बिखरा track इसे दर्शाता है: घटनाएँ एक साफ़, समान-दूरी grid के बजाय अनियमित, मनमाने पलों पर उतरती हैं।",
        "asynchronous logic तेज़ और कम-power हो सकती है क्योंकि कुछ भी clock की प्रतीक्षा नहीं करता, पर इसे सही design करना कहीं कठिन है - किसी साझा संदर्भ edge के बिना, signals के बीच races और hazards designer की समस्या बन जाते हैं। एक master clock का साफ़ अनुशासन अनुमेय बर्ताव के लिए चुकाई गई क़ीमत है, और आमतौर पर ख़ुशी से चुकाई जाती है।"
      ],
      transcriptEN: "Beyond how one element captures data, there's a system-wide question: does everything change together on a schedule, or does each part react whenever it likes? That's synchronous versus asynchronous. A synchronous circuit is governed by one shared master clock, a square wave at a fixed rate. Every memory element updates only at the clock's discrete edges, so the whole machine advances in lockstep, one well-defined step per tick. The clock above marks exactly where state may change; between edges everything is frozen. Because all changes line up on the same edges, synchronous design is predictable: signals get the whole clock period to settle before the next edge samples them, so mid-period glitches die out. That's why the vast majority of chips are synchronous. An asynchronous circuit has no clock - each element reacts the instant an input changes, unmetered by any global tick. Events land at irregular moments, not on a neat grid. That can be faster and lower-power, but it's far harder to get right, because with no common edge, races and hazards become the designer's problem.",
      transcriptHI: "एक element data कैसे capture करता है इससे परे, एक system-भर का सवाल है: क्या सब कुछ एक समय-सारणी पर साथ बदलता है, या हर हिस्सा जब चाहे प्रतिक्रिया देता है? वही synchronous बनाम asynchronous है। synchronous circuit एक साझा master clock द्वारा शासित है, एक निश्चित दर पर square wave। हर memory element सिर्फ़ clock के discrete edges पर अद्यतन होता है, तो पूरी मशीन lockstep में बढ़ती है, प्रति tick एक सुपरिभाषित कदम। ऊपर की clock ठीक चिह्नित करती है कि state कहाँ बदल सकता है; edges के बीच सब जमा है। चूँकि सभी बदलाव एक ही edges पर पंक्तिबद्ध हैं, synchronous design अनुमेय है: signals को अगला edge sample करने से पहले settle होने को पूरा clock period मिलता है, तो बीच-period glitches मर जाते हैं। इसीलिए chips का भारी बहुमत synchronous है। asynchronous circuit के पास कोई clock नहीं - हर element input बदलते ही प्रतिक्रिया देता है, किसी global tick से अनियंत्रित। घटनाएँ अनियमित पलों पर उतरती हैं, साफ़ grid पर नहीं। यह तेज़ और कम-power हो सकती है, पर सही करना कहीं कठिन, क्योंकि साझा edge न होने से races और hazards designer की समस्या बन जाते हैं।",
      visualNote: "Left: a clean master-clock square wave with rising edges marked (synchronous, discrete edges). Right: a scribbly asynchronous track with events landing at irregular, arbitrary times."
    },
    {
      id: "S07_Analogy",
      label: "The Push-Button State Machine",
      kind: "theory",
      subtitle: "Press to toggle, release to remember - a two-state machine you already own.",
      theoryEN: [
        "Everything on this track collapses into one homely device: a push-button that latches, like the power button on a desk lamp or the click of a retractable pen. It has exactly two states, OFF and ON, and it is the smallest complete sequential circuit you will ever meet.",
        "Trace its behaviour as a state machine, drawn above. Start in OFF. Press the button and it toggles to ON. Let go, and here is the sequential magic: it does not fall back to OFF - it self-loops on ON, holding that state while released. Press again and it toggles back to OFF, where it once more self-loops while released.",
        "Read the pieces against the definitions. The two circles OFF and ON are the STATE - the stored past. The press is the input event that triggers a transition. The self-loops labelled release are the memory: with no input arriving, the machine stays exactly where it was, which is precisely state persists after the input is removed.",
        "Notice that the same input - a press - produces different results depending on the current state: from OFF a press gives ON, from ON a press gives OFF. That is the hallmark Next = f(Present Input, Past State) made visible; the input alone does not determine the output, the stored state shares the decision.",
        "Hold this picture for the rest of the track. Every latch, flip-flop, counter and controller you are about to study is just this idea scaled up: a set of states, input events that move between them, and self-loops that remember. Master the push-button and you have mastered the soul of sequential logic."
      ],
      theoryHI: [
        "इस track की हर चीज़ एक घरेलू उपकरण में सिमट जाती है: एक push-button जो latch करता है, जैसे desk lamp का power button या एक retractable pen की click। इसकी ठीक दो states हैं, OFF और ON, और यह सबसे छोटा पूर्ण sequential circuit है जिससे आप कभी मिलेंगे।",
        "इसके बर्ताव को एक state machine के रूप में देखिए, ऊपर बनी हुई। OFF में शुरू कीजिए। button दबाइए और यह ON पर toggle करता है। छोड़िए, और यहाँ sequential जादू है: यह OFF पर वापस नहीं गिरता - यह ON पर self-loop करता है, छूटे रहते उस state को पकड़ते हुए। फिर दबाइए और यह वापस OFF पर toggle करता है, जहाँ यह छूटे रहते फिर self-loop करता है।",
        "टुकड़ों को परिभाषाओं के सामने पढ़िए। दो वृत्त OFF और ON हैं STATE - संचित बीता। press वह input घटना है जो एक transition trigger करती है। release लेबल वाले self-loops memory हैं: कोई input न आने पर, मशीन ठीक वहीं रहती है जहाँ थी, जो बिल्कुल यही है कि 'state input हटने के बाद बनी रहती है'।",
        "ग़ौर कीजिए कि वही input - एक press - मौजूदा state के अनुसार अलग परिणाम देता है: OFF से एक press ON देता है, ON से एक press OFF देता है। यही पहचान Next = f(Present Input, Past State) को दृश्य बनाती है; अकेला input output तय नहीं करता, संचित state निर्णय में साझा करती है।",
        "इस तस्वीर को बाक़ी track के लिए पकड़े रखिए। हर latch, flip-flop, counter और controller जिसे आप अभी पढ़ने वाले हैं बस यही विचार बड़ा किया हुआ है: states का एक समूह, input घटनाएँ जो उनके बीच घुमाती हैं, और self-loops जो याद रखते हैं। push-button में महारत पाइए और आपने sequential logic की आत्मा में महारत पा ली।"
      ],
      transcriptEN: "Everything on this track collapses into one homely device: a push-button that latches, like the power button on a lamp or the click of a retractable pen. It has exactly two states, OFF and ON - the smallest complete sequential circuit there is. Trace it as a state machine. Start in OFF. Press and it toggles to ON. Let go, and here's the magic: it doesn't fall back - it self-loops on ON, holding that state while released. Press again and it toggles back to OFF, self-looping while released. Read the pieces: the two circles are the state, the stored past; the press is the input event that triggers a transition; the release self-loops are the memory - with no input, the machine stays where it was, which is exactly state persisting after the input is removed. And notice the same press gives different results depending on the state - from OFF you get ON, from ON you get OFF. That's Next equals f of present input and past state, made visible. Master this button and you've mastered the soul of sequential logic.",
      transcriptHI: "इस track की हर चीज़ एक घरेलू उपकरण में सिमटती है: एक push-button जो latch करता है, जैसे lamp का power button या retractable pen की click। इसकी ठीक दो states हैं, OFF और ON - सबसे छोटा पूर्ण sequential circuit। इसे एक state machine के रूप में देखिए। OFF में शुरू कीजिए। दबाइए और यह ON पर toggle करता है। छोड़िए, और यहाँ जादू है: यह वापस नहीं गिरता - यह ON पर self-loop करता है, छूटे रहते उस state को पकड़ते। फिर दबाइए और यह वापस OFF पर toggle करता है, छूटे रहते self-loop करते। टुकड़े पढ़िए: दो वृत्त हैं state, संचित बीता; press वह input घटना है जो transition trigger करती है; release self-loops memory हैं - कोई input न होने पर मशीन वहीं रहती है, जो बिल्कुल state का input हटने के बाद बने रहना है। और ग़ौर कीजिए वही press state के अनुसार अलग परिणाम देता है - OFF से ON मिलता है, ON से OFF। यही Next बराबर f of present input और past state, दृश्य बनाया हुआ। इस button में महारत पाइए और आपने sequential logic की आत्मा में महारत पा ली।",
      visualNote: "A live state diagram: two nodes OFF and ON; press edges toggle between them; release self-loops on each node labelled 'holds'; the current state highlights as you press."
    },
    {
      id: "S08_Build",
      label: "Build The First Memory Cell",
      kind: "theory",
      subtitle: "Cross-couple two gates on the workbench and watch a bit hold itself.",
      theoryEN: [
        "Theory becomes real the moment you wire a feedback loop yourself. The simplest memory you can build is the SR latch: two logic gates cross-coupled so that each one's output feeds the other's input, forming the very loop that stores a bit.",
        "On the workbench you will connect two NOR gates back to back. One gate's output is Q, the other's is Q-bar, and each output is wired into the other gate's input - that cross-coupling is the feedback that holds state. Two external inputs, Set and Reset, let you write into the loop.",
        "Drive Set high and Q latches to 1; drive Reset high and Q clears to 0; drop both back to 0 and the loop simply holds whatever it last stored. You will watch, on real gates, a bit that persists with no input applied - memory you built from nothing but two gates and a loop.",
        "You will also meet the loop's dark side: force both Set and Reset high at once and the latch enters its forbidden state, with Q and Q-bar driven the same and the final value unpredictable. Seeing that failure first-hand is exactly why the next modules add enables and edge triggering.",
        "Open the workbench, build the cross-coupled pair, and prove every case - set, reset, and hold - for yourself. It is the seed cell from which every flip-flop, register and memory in this entire track grows."
      ],
      theoryHI: [
        "theory उसी पल असली बन जाती है जब आप ख़ुद एक feedback loop wire करते हैं। सबसे सरल memory जो आप बना सकते हैं वह SR latch है: दो logic gates cross-coupled ताकि हर एक का output दूसरे के input को feed करे, वही loop बनाते जो एक bit store करता है।",
        "workbench पर आप दो NOR gates को आमने-सामने जोड़ेंगे। एक gate का output Q है, दूसरे का Q-bar, और हर output दूसरे gate के input में wire है - वही cross-coupling वह feedback है जो state पकड़ता है। दो बाहरी inputs, Set और Reset, आपको loop में लिखने देते हैं।",
        "Set को high कीजिए और Q 1 पर latch होता है; Reset को high कीजिए और Q 0 पर clear होता है; दोनों को वापस 0 कीजिए और loop बस जो अंतिम बार store किया उसे पकड़ता है। आप असली gates पर देखेंगे, एक bit जो बिना कोई input लगाए बना रहता है - memory जो आपने महज़ दो gates और एक loop से बनाई।",
        "आप loop का अँधेरा पक्ष भी देखेंगे: Set और Reset दोनों को एक साथ high कीजिए और latch अपनी forbidden state में प्रवेश करता है, Q और Q-bar एक जैसे चलाए जाते और अंतिम मान अनुमेय नहीं। उस विफलता को प्रत्यक्ष देखना ही कारण है कि अगले modules enables और edge triggering जोड़ते हैं।",
        "workbench खोलिए, cross-coupled जोड़ी बनाइए, और हर स्थिति - set, reset, और hold - ख़ुद साबित कीजिए। यही वह बीज cell है जिससे इस पूरे track का हर flip-flop, register और memory उगता है।"
      ],
      transcriptEN: "Theory becomes real the moment you wire a feedback loop yourself. The simplest memory you can build is the SR latch: two gates cross-coupled so each one's output feeds the other's input, forming the loop that stores a bit. On the workbench you'll connect two NOR gates back to back - one output is Q, the other Q-bar, and each feeds the other's input. Two external inputs, Set and Reset, write into the loop. Set high latches Q to one; Reset high clears Q to zero; both low and the loop holds its last value - a bit that persists with no input applied. You'll also meet the dark side: force both Set and Reset high and the latch enters its forbidden state, Q and Q-bar driven the same and the final value unpredictable. Seeing that failure first-hand is why the next modules add enables and edge triggering. Open the workbench, build the cross-coupled pair, and prove set, reset, and hold for yourself - the seed cell of every flip-flop, register, and memory ahead.",
      transcriptHI: "theory उसी पल असली बनती है जब आप ख़ुद एक feedback loop wire करते हैं। सबसे सरल memory जो आप बना सकते हैं वह SR latch है: दो gates cross-coupled ताकि हर एक का output दूसरे के input को feed करे, वही loop बनाते जो bit store करता है। workbench पर आप दो NOR gates आमने-सामने जोड़ेंगे - एक output Q, दूसरा Q-bar, और हर एक दूसरे के input को feed करता है। दो बाहरी inputs, Set और Reset, loop में लिखते हैं। Set high Q को एक पर latch करता है; Reset high Q को शून्य पर clear करता है; दोनों low और loop अपना अंतिम मान पकड़ता है - एक bit जो बिना input लगाए बना रहता है। आप अँधेरा पक्ष भी देखेंगे: Set और Reset दोनों high कीजिए और latch forbidden state में जाता है, Q और Q-bar एक जैसे चलाए और अंतिम मान अनुमेय नहीं। उस विफलता को प्रत्यक्ष देखना ही कारण है कि अगले modules enables और edge triggering जोड़ते हैं। workbench खोलिए, cross-coupled जोड़ी बनाइए, और set, reset, और hold ख़ुद साबित कीजिए - आगे के हर flip-flop, register, और memory का बीज cell।",
      visualNote: "WorkbenchCTA -> /workbench?tutorial=sr-latch: build two cross-coupled NOR gates, drive Set/Reset, and watch Q hold, with the forbidden 1,1 case called out."
    },
    {
      id: "S09_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Eight cards on state, feedback, latch vs flip-flop, and clocking.",
      theoryEN: ["Flip each card: the term on the front, the real logic on the back."],
      theoryHI: ["हर card पलटिए: सामने पद, पीछे असली logic।"],
      transcriptEN: "Eight quick flip-cards to lock in the fundamentals of sequential logic.",
      transcriptHI: "sequential logic की बुनियाद पक्की करने को आठ त्वरित flip-cards।"
    },
    {
      id: "S10_Quiz",
      label: "Quiz",
      kind: "quiz",
      subtitle: "Seven questions on the fundamentals of sequential logic.",
      theoryEN: ["Answer each question, then read the explanation to see why."],
      theoryHI: ["हर सवाल का उत्तर दीजिए, फिर कारण देखने को व्याख्या पढ़िए।"],
      transcriptEN: "Seven questions covering combinational vs sequential, state, feedback, latches, flip-flops, and clocking.",
      transcriptHI: "combinational बनाम sequential, state, feedback, latches, flip-flops, और clocking पर सात सवाल।"
    },
    {
      id: "S11_Recap",
      label: "Recap",
      kind: "recap",
      subtitle: "Memory, state, feedback, latch vs flip-flop, synchronous vs asynchronous.",
      theoryEN: [
        "Sequential logic is combinational logic plus memory. A combinational circuit obeys Output = f(Input) and forgets everything the instant its inputs change; a sequential circuit obeys Next = f(Present Input, Past State), letting the remembered past share in deciding the present.",
        "That memory is the state: stored past information that persists after the input that set it has been removed. It is created physically by feedback - an output wire routed back to an input - which lets a bit circulate and sustain itself until it is deliberately changed. Cut the loop and the memory disappears.",
        "Memory elements come in two flavours. A latch is level-triggered and transparent, copying its input straight through while its enable level is high and freezing when that level falls. A flip-flop is edge-triggered, sampling its input only at the clock edge as the clock rises from 0 to 1, and ignoring it otherwise.",
        "Circuits are also classed by timing. Synchronous circuits share one master clock and change only on its discrete edges, marching in predictable lockstep; asynchronous circuits have no clock and react instantly to input changes, faster but far harder to keep correct.",
        "The push-button two-state machine ties it all together: OFF and ON are the states, a press is the input that toggles between them, and the release self-loops are the memory that holds a state with no input. That is the soul of every latch, flip-flop, counter and controller ahead."
      ],
      theoryHI: [
        "sequential logic है combinational logic जमा memory। combinational circuit Output = f(Input) मानता है और अपने inputs बदलते ही सब कुछ भूल जाता है; sequential circuit Next = f(Present Input, Past State) मानता है, याद रखे बीते को वर्तमान तय करने में साझा करने देते हुए।",
        "वह memory ही state है: संचित बीता जानकारी जो उसे set करने वाले input के हटने के बाद बनी रहती है। यह भौतिक रूप से feedback से बनती है - एक output wire वापस input में route - जो एक bit को घूमकर ख़ुद को टिकाने देती है जब तक इसे जानबूझकर न बदला जाए। loop काटिए और memory ग़ायब हो जाती है।",
        "memory elements दो स्वादों में आते हैं। latch level-triggered और transparent है, enable level high रहते अपने input को सीधे copy करते और वह level गिरते जमते हुए। flip-flop edge-triggered है, input को सिर्फ़ clock edge पर sample करते जब clock 0 से 1 तक उठता है, और अन्यथा नज़रअंदाज़ करते।",
        "circuits timing से भी वर्गीकृत होते हैं। synchronous circuits एक master clock साझा करते और सिर्फ़ इसके discrete edges पर बदलते, अनुमेय lockstep में चलते; asynchronous circuits के पास कोई clock नहीं और वे input बदलावों पर तुरंत प्रतिक्रिया देते, तेज़ पर सही रखना कहीं कठिन।",
        "push-button two-state machine सब जोड़ती है: OFF और ON हैं states, एक press वह input है जो उनके बीच toggle करता है, और release self-loops वह memory हैं जो बिना input एक state पकड़ती है। यही आगे के हर latch, flip-flop, counter और controller की आत्मा है।"
      ],
      transcriptEN: "To recap: sequential logic is combinational logic plus memory. Combinational obeys Output equals f of Input and forgets instantly; sequential obeys Next equals f of present input and past state. That memory is the state - stored past information that persists after the input is removed - created by feedback, an output routed back to an input, holding a bit until it's deliberately changed. Memory elements are latches, level-triggered and transparent while enabled, and flip-flops, edge-triggered, capturing only at the clock's rising edge. And systems are synchronous, sharing one master clock and changing only on its edges, or asynchronous, with no clock, reacting instantly. The push-button two-state machine ties it together: OFF and ON are the states, a press toggles them, and the release self-loops are the memory - the soul of every latch, flip-flop, counter, and controller ahead.",
      transcriptHI: "संक्षेप में: sequential logic है combinational logic जमा memory। combinational Output बराबर f of Input मानता और तुरंत भूलता; sequential Next बराबर f of present input और past state मानता है। वह memory ही state है - संचित बीता जानकारी जो input हटने के बाद बनी रहती - feedback से बनी, output वापस input में route, एक bit पकड़ते जब तक जानबूझकर न बदला जाए। memory elements हैं latches, level-triggered और enable रहते transparent, और flip-flops, edge-triggered, सिर्फ़ clock के rising edge पर capture करते। और systems synchronous हैं, एक master clock साझा करते और सिर्फ़ इसके edges पर बदलते, या asynchronous, बिना clock, तुरंत प्रतिक्रिया देते। push-button two-state machine सब जोड़ती है: OFF और ON हैं states, एक press उन्हें toggle करता, और release self-loops memory हैं - आगे के हर latch, flip-flop, counter, और controller की आत्मा।"
    }
  ],
  flashcards: [
    {
      frontEN: "Combinational vs sequential",
      backEN: "Combinational: Output = f(Input), no memory - the same inputs always give the same output. Sequential: Next = f(Present Input, Past State) - the output also depends on stored history.",
      frontHI: "Combinational बनाम sequential",
      backHI: "Combinational: Output = f(Input), कोई memory नहीं - वही inputs हमेशा वही output देते हैं। Sequential: Next = f(Present Input, Past State) - output संचित इतिहास पर भी निर्भर।"
    },
    {
      frontEN: "State",
      backEN: "Stored past information that persists after the input that set it is removed. It is the circuit's memory of where it has been - just enough of the past to decide the future.",
      frontHI: "State",
      backHI: "संचित बीता जानकारी जो उसे set करने वाले input के हटने के बाद बनी रहती है। यह circuit की याद है कि यह कहाँ रहा - भविष्य तय करने भर का बीता।"
    },
    {
      frontEN: "Feedback loop",
      backEN: "Routing a logic block's output back to its own input. The value circulates and regenerates itself, so a bit is held. Feedback is the physical mechanism behind all digital memory.",
      frontHI: "Feedback loop",
      backHI: "किसी logic block के output को उसके अपने input में वापस route करना। मान घूमकर ख़ुद को पुनः उत्पन्न करता है, तो एक bit पकड़ा जाता है। feedback हर digital memory के पीछे की भौतिक क्रियाविधि है।"
    },
    {
      frontEN: "Latch (level-triggered)",
      backEN: "Transparent: while its enable/clock level is high, Q continuously follows the input. It freezes the last value only when the enable goes low. A wide, leaky window.",
      frontHI: "Latch (level-triggered)",
      backHI: "Transparent: enable/clock level high रहते Q लगातार input को follow करता है। यह अंतिम मान सिर्फ़ enable low होने पर जमाता है। एक चौड़ी, रिसती खिड़की।"
    },
    {
      frontEN: "Flip-flop (edge-triggered)",
      backEN: "Synchronized: it captures the input only at the clock edge (the 0->1 rising instant), then ignores the input until the next edge. A single, sharp sampling instant.",
      frontHI: "Flip-flop (edge-triggered)",
      backHI: "Synchronized: यह input को सिर्फ़ clock edge (0->1 rising पल) पर capture करता है, फिर अगले edge तक input नज़रअंदाज़ करता है। एक अकेला, तीखा sampling पल।"
    },
    {
      frontEN: "Synchronous circuit",
      backEN: "Governed by one shared master clock; every state element updates only at the clock's discrete edges, so the whole machine advances in lockstep - predictable and easy to reason about.",
      frontHI: "Synchronous circuit",
      backHI: "एक साझा master clock द्वारा शासित; हर state element सिर्फ़ clock के discrete edges पर अद्यतन होता है, तो पूरी मशीन lockstep में बढ़ती है - अनुमेय और तर्क में आसान।"
    },
    {
      frontEN: "Asynchronous circuit",
      backEN: "No clock at all; each element reacts the instant an input changes, unmetered by any global tick. Potentially faster and lower-power, but prone to races and much harder to design correctly.",
      frontHI: "Asynchronous circuit",
      backHI: "बिल्कुल कोई clock नहीं; हर element input बदलते ही प्रतिक्रिया देता है, किसी global tick से अनियंत्रित। संभवतः तेज़ और कम-power, पर races के प्रति संवेदनशील और सही design करना कहीं कठिन।"
    },
    {
      frontEN: "The push-button state machine",
      backEN: "A two-state (OFF/ON) latching button: a press toggles the state, a release self-loops and holds it. A live picture of Next = f(input, state) and of state persisting with no input.",
      frontHI: "Push-button state machine",
      backHI: "एक two-state (OFF/ON) latching button: एक press state को toggle करता है, एक release self-loop करके उसे पकड़ता है। Next = f(input, state) और बिना input state के बने रहने की जीवंत तस्वीर।"
    }
  ],
  quiz: [
    {
      questionEN: "A circuit whose output depends only on its present inputs, with no memory, is called:",
      questionHI: "वह circuit जिसका output सिर्फ़ अपने वर्तमान inputs पर निर्भर करता है, कोई memory नहीं, कहलाता है:",
      options: ["Sequential", "Combinational", "Latched", "Clocked"],
      answerIndex: 1,
      explainEN: "Combinational logic obeys Output = f(Input): no memory, no history. Sequential circuits are the ones that add stored state.",
      explainHI: "Combinational logic Output = f(Input) मानता है: कोई memory नहीं, कोई इतिहास नहीं। Sequential circuits वे हैं जो संचित state जोड़ते हैं।"
    },
    {
      questionEN: "The defining equation of a sequential circuit is:",
      questionHI: "एक sequential circuit का परिभाषक समीकरण है:",
      options: ["Next = f(Present Input, Past State)", "Output = f(Input)", "Output = constant", "Input = f(Output)"],
      answerIndex: 0,
      explainEN: "Sequential logic computes its next value from both the present input and the stored past state - that second argument is exactly what combinational logic lacks.",
      explainHI: "Sequential logic अपना अगला मान present input और संचित past state दोनों से निकालता है - वही दूसरा argument ठीक वह है जो combinational logic में नहीं है।"
    },
    {
      questionEN: "In digital hardware, memory is physically created by:",
      questionHI: "digital hardware में, memory भौतिक रूप से किससे बनती है:",
      options: ["A feedback loop from output back to input", "A faster clock", "Adding more inputs", "Removing the inputs"],
      answerIndex: 0,
      explainEN: "Feedback - wiring an output back to an input - lets a bit circulate and sustain itself. That self-holding loop is the physical basis of every latch, flip-flop, and RAM cell.",
      explainHI: "Feedback - एक output को वापस input में wire करना - एक bit को घूमकर ख़ुद को टिकाने देता है। वह स्वयं-पकड़ता loop हर latch, flip-flop, और RAM cell का भौतिक आधार है।"
    },
    {
      questionEN: "'State' is best defined as:",
      questionHI: "'State' की सबसे अच्छी परिभाषा है:",
      options: ["The instantaneous input value", "The clock's period", "Stored past information that persists after the input is removed", "The length of the output wire"],
      answerIndex: 2,
      explainEN: "State is the circuit's memory of its history - stored past information that lingers even after the input that set it is gone, like a light switch staying on.",
      explainHI: "State circuit की उसके इतिहास की memory है - संचित बीता जानकारी जो उसे set करने वाले input के जाने के बाद भी टिकी रहती है, जैसे एक light switch जला रहना।"
    },
    {
      questionEN: "A latch differs from a flip-flop because a latch is:",
      questionHI: "latch, flip-flop से इसलिए भिन्न है क्योंकि latch:",
      options: ["Edge-triggered", "Level-triggered and transparent while enabled", "Always faster", "Unable to store a bit"],
      answerIndex: 1,
      explainEN: "A latch is level-triggered: while its enable is high it is transparent, so Q follows the input continuously. A flip-flop instead captures only at a clock edge.",
      explainHI: "latch level-triggered है: enable high रहते यह transparent है, तो Q लगातार input को follow करता है। flip-flop इसके बजाय सिर्फ़ clock edge पर capture करता है।"
    },
    {
      questionEN: "A flip-flop captures its input:",
      questionHI: "flip-flop अपना input capture करता है:",
      options: ["Continuously while the clock level is high", "Only at the clock edge, when the clock goes 0->1", "At random moments", "Only at power-up"],
      answerIndex: 1,
      explainEN: "An edge-triggered flip-flop samples the input at one razor-thin instant - the rising clock edge (0->1) - and ignores it the rest of the time.",
      explainHI: "एक edge-triggered flip-flop input को एक बाल-बराबर पल पर sample करता है - rising clock edge (0->1) - और बाक़ी समय उसे नज़रअंदाज़ करता है।"
    },
    {
      questionEN: "A synchronous system changes state:",
      questionHI: "एक synchronous system state बदलता है:",
      options: ["Whenever any input changes, instantly", "Only at the discrete edges of one shared master clock", "Never", "Only once, at power-up"],
      answerIndex: 1,
      explainEN: "Synchronous circuits march to one master clock and update only at its discrete edges, so the whole machine advances in lockstep. Asynchronous circuits are the ones that react instantly to input changes.",
      explainHI: "Synchronous circuits एक master clock पर चलते और सिर्फ़ इसके discrete edges पर अद्यतन होते हैं, तो पूरी मशीन lockstep में बढ़ती है। Asynchronous circuits वे हैं जो input बदलावों पर तुरंत प्रतिक्रिया देते हैं।"
    }
  ]
};
