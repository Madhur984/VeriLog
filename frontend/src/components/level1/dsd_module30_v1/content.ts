import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/30 - Flip-Flops, "The Clock-Ticked Memory Cell" (Sequential Logic track).
 * A flip-flop is a one-bit EDGE-TRIGGERED memory: it samples its inputs only at
 * the instant of a clock edge, closing the latch's transparent-window race so
 * thousands of cells update in lockstep. Four classic types, four characteristic
 * equations: SR Q(t+1)=S+R'Q (S.R=0), JK Q(t+1)=J.Q'+K'.Q (11=toggle, the SR
 * fix), D Q(t+1)=D (delay/data cell), T Q(t+1)=T XOR Q (toggle/counting cell).
 * JK is universal: J=D,K=D' builds a D; J=K=T builds a T. Applications: D ->
 * shift registers & RAM, T -> counters & frequency dividers, JK -> control logic
 * & FSMs, SR -> switch debounce. Every displayed value is computed by the shared
 * _sequential/blocks.tsx logic (ffNext, ffCharRows), never hardcoded.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Flip-Flops - The Clock-Ticked Memory Cell",
  moduleSubtitle: "One bit of memory that updates only on the clock's edge - the SR, JK, D and T flip-flops, and how one turns into another.",
  scenes: [
    {
      id: "S00_Cover",
      label: "Flip-Flops, The Clocked Memory Cell",
      kind: "cover",
      subtitle: "One bit of memory that captures its input only on the clock's edge.",
      theoryEN: [
        "A flip-flop is a one-bit memory cell that captures its input only at the instant of a clock edge, so every cell in a system updates in perfect lockstep.",
        "That one upgrade - edge-triggering instead of a latch's level - kills the transparent-window race, where a latch keeps copying its input for the whole time the clock is high.",
        "There are four classic types, each defined by a single characteristic equation: SR (Q+ = S + R'Q), JK (Q+ = JQ' + K'Q), D (Q+ = D) and T (Q+ = T XOR Q).",
        "JK is the fix for SR: the forbidden 11 input, illegal on an SR flip-flop, becomes a clean and useful TOGGLE on a JK.",
        "You will read every characteristic table live, drive each type by hand, and prove how a JK becomes a D (J=D, K=D') or a T (J=K=T)."
      ],
      theoryHI: [
        "Flip-flop एक one-bit memory cell है जो अपने input को सिर्फ़ clock edge के पल पर पकड़ता है, ताकि system की हर cell एकदम lockstep में update हो।",
        "यही एक upgrade - latch के level के बजाय edge-triggering - transparent-window race को ख़त्म कर देता है, जहाँ latch पूरे clock-high समय अपने input की नक़ल करता रहता है।",
        "चार classic types हैं, हर एक एक characteristic equation से तय: SR (Q+ = S + R'Q), JK (Q+ = JQ' + K'Q), D (Q+ = D) और T (Q+ = T XOR Q)।",
        "JK, SR का इलाज है: SR flip-flop पर अवैध 11 input JK पर एक साफ़ और उपयोगी TOGGLE बन जाता है।",
        "आप हर characteristic table live पढ़ेंगे, हर type को हाथ से चलाएँगे, और साबित करेंगे कि JK कैसे D (J=D, K=D') या T (J=K=T) बनता है।"
      ],
      transcriptEN: "A flip-flop is one bit of memory that updates only on the clock's edge. Meet the four types - SR, JK, D and T - and the edge-triggering that makes them safe.",
      transcriptHI: "Flip-flop एक bit memory है जो सिर्फ़ clock के edge पर update होती है। चार types से मिलिए - SR, JK, D और T - और वह edge-triggering जो इन्हें सुरक्षित बनाती है।",
      visualNote: "Hero: a live JK flip-flop symbol with an edge-trigger clock triangle, driven Q and Q', and a rolling waveform of the last few ticks."
    },
    {
      id: "S01_Video",
      label: "Flip-Flops, Caught On The Edge",
      kind: "video",
      subtitle: "A short film on edge-triggering and the four flip-flop types.",
      theoryEN: [
        "Before you watch, hold the one idea: a flip-flop samples its inputs at a clock EDGE - a single instant - and ignores them the rest of the time.",
        "A latch is level-triggered and transparent while its enable is high, so it can copy a wrong value mid-cycle; a flip-flop's edge closes that window.",
        "The video walks the four types by their characteristic equations: SR (with a forbidden 11), JK (11 becomes toggle), D (Q+ = D) and T (Q+ = T XOR Q).",
        "It also shows how a JK becomes a D by setting J=D, K=D', and a T by tying J=K=T - so JK is the universal flip-flop.",
        "Keep one running example in mind: a JK held at J=K=1 flips Q on every clock tick, 0,1,0,1 - the toggle that makes counters possible."
      ],
      theoryHI: [
        "देखने से पहले एक विचार पकड़िए: flip-flop अपने inputs को clock EDGE पर - एक अकेले पल पर - sample करता है और बाक़ी समय अनदेखा करता है।",
        "Latch level-triggered है और अपने enable के high रहते transparent रहता है, तो वह mid-cycle में ग़लत मान copy कर सकता है; flip-flop का edge उस window को बंद कर देता है।",
        "Video चारों types को उनके characteristic equations से चलाता है: SR (एक forbidden 11 के साथ), JK (11 toggle बन जाता है), D (Q+ = D) और T (Q+ = T XOR Q)।",
        "यह यह भी दिखाता है कि JK, J=D, K=D' रखने पर D बनता है, और J=K=T बाँधने पर T - तो JK universal flip-flop है।",
        "एक उदाहरण मन में रखिए: J=K=1 पर रखा JK हर clock tick पर Q पलटता है, 0,1,0,1 - वही toggle जो counters को संभव बनाता है।"
      ],
      transcriptEN: "Here is the whole idea in one breath. A latch watches its inputs the entire time its clock is high - a transparent window through which a wrong value can race. A flip-flop fixes this by sampling only at the clock edge, a single instant, so data is captured once per tick and the rest of the cycle is ignored. A positive-edge flip-flop fires on the rising zero-to-one transition; a negative-edge one fires on the falling one-to-zero and wears a bubble on its clock. You can even build that edge out of two ordinary latches, a master and a slave, clocked on opposite phases so they are never open together. There are four classic types. SR is clocked set-reset, characteristic equation Q-next equals S plus R-prime Q, with the eleven input forbidden. JK is SR's fix: same hold, set and reset, but the old forbidden eleven now toggles the output, and its equation is Q-next equals J Q-prime plus K-prime Q. D is the delay cell, Q-next equals D - the value in comes out one clock later. T is the toggle cell, Q-next equals T XOR Q - hold when T is zero, flip when T is one. And JK is universal: wire J equals D and K equals D-prime to get a D, or tie J equals K equals T to get a T. D lives in registers and RAM, T in counters and dividers, JK in control logic, SR in debouncing - four little cells, one shared clock.",
      transcriptHI: "पूरा विचार एक साँस में। Latch अपने inputs को उतनी देर देखता है जितनी देर उसका clock high रहता है - एक transparent window जिससे ग़लत मान race कर सकता है। Flip-flop इसे सुधारता है सिर्फ़ clock edge पर sample करके, एक अकेला पल, तो data हर tick पर एक बार पकड़ा जाता है और बाक़ी cycle अनदेखा। Positive-edge flip-flop rising zero-to-one पर fire करता है; negative-edge वाला falling one-to-zero पर, और अपने clock पर एक bubble पहनता है। आप उस edge को दो साधारण latches से भी बना सकते हैं, एक master और एक slave, उलटी phases पर clocked ताकि वे कभी एक साथ खुले न हों। चार classic types हैं। SR clocked set-reset है, equation Q-next बराबर S plus R-prime Q, जहाँ eleven input forbidden है। JK, SR का इलाज है: वही hold, set और reset, पर पुराना forbidden eleven अब output को toggle करता है, equation Q-next बराबर J Q-prime plus K-prime Q। D delay cell है, Q-next बराबर D - अंदर गया मान एक clock बाद बाहर आता है। T toggle cell है, Q-next बराबर T XOR Q - T शून्य पर hold, T एक पर flip। और JK universal है: J बराबर D और K बराबर D-prime बाँधिए तो D, या J बराबर K बराबर T बाँधिए तो T। D registers और RAM में रहता है, T counters और dividers में, JK control logic में, SR debouncing में - चार छोटी cells, एक साझा clock।",
      visualNote: "Animated explainer: a clock line ticking, a latch output leaking during the high window while a flip-flop output steps cleanly on each edge; then the SR/JK/D/T symbols in turn."
    },
    {
      id: "S02_Facts",
      label: "Edge vs Level",
      kind: "theory",
      subtitle: "Why a flip-flop samples on the edge and a latch leaks through its window.",
      theoryEN: [
        "Everything in this module turns on one upgrade over the latch: a flip-flop is edge-triggered. Instead of watching its inputs the whole time the clock is high, a flip-flop looks at its inputs only at the single instant the clock changes - the clock edge - and captures whatever it sees there. Between edges it is deaf: the input can wiggle all it likes and the stored bit does not move.",
        "Compare that to a latch, which is level-triggered. A gated latch is transparent for the entire span its enable or clock is high, and during that window Q simply copies D, following every change. That transparent window is the latch's fatal flaw. If the data feeding a latch changes while the clock is still high - and in real feedback circuits it always does - the new value races straight through, and the latch can capture the wrong thing or even oscillate.",
        "Edge-triggering slams that window shut. Because the flip-flop only samples at the edge, its window of vulnerability shrinks from a whole half-cycle down to a single instant. Data is captured once per clock, cleanly, and the rest of the cycle is irrelevant. This is exactly what lets thousands of flip-flops across a chip update together, in perfect synchronization, all driven by one shared clock.",
        "The interactive above makes the difference concrete. A level latch and an edge flip-flop are fed the same data D and the same clock. Watch the latch's output copy every glitch that occurs while the clock is high - the transparent window leaking - while the flip-flop's output changes just once, at the rising edge, then holds rock-steady until the next edge. Add the glitch and the latch follows it; the flip-flop, which already sampled at the edge, ignores it entirely.",
        "So the one-liner for the rest of digital design is this: a latch is a door propped open while the clock is high; a flip-flop is a turnstile that clicks exactly once as the clock ticks past its edge. Everything that follows - the SR, JK, D and T types - is edge-triggered, and that is what makes them safe, predictable memory."
      ],
      theoryHI: [
        "इस module में सब कुछ latch पर एक upgrade पर टिका है: flip-flop edge-triggered है। पूरे clock-high समय अपने inputs को देखने के बजाय, flip-flop अपने inputs को सिर्फ़ उस अकेले पल पर देखता है जब clock बदलता है - clock edge - और वहाँ जो दिखे वही पकड़ लेता है। Edges के बीच वह बहरा है: input जितना चाहे हिले, जमा bit नहीं हिलता।",
        "इसकी तुलना latch से कीजिए, जो level-triggered है। Gated latch अपने enable या clock के high रहने की पूरी अवधि transparent रहता है, और उस window में Q बस D की नक़ल करता है, हर बदलाव का पीछा करते हुए। यही transparent window latch की घातक ख़ामी है। अगर latch को खिलाया जा रहा data clock के अब भी high रहते बदल जाए - और असली feedback circuits में यह हमेशा होता है - नया मान सीधे race कर जाता है, और latch ग़लत चीज़ पकड़ सकता है या oscillate भी कर सकता है।",
        "Edge-triggering उस window को ज़ोर से बंद कर देता है। चूँकि flip-flop सिर्फ़ edge पर sample करता है, उसकी असुरक्षा की window पूरे आधे-cycle से घटकर एक अकेला पल रह जाती है। Data हर clock पर एक बार, साफ़-सुथरा पकड़ा जाता है, और बाक़ी cycle बेमानी है। ठीक यही चीज़ chip भर के हज़ारों flip-flops को एक साथ, एकदम synchronization में, एक साझा clock से update होने देती है।",
        "ऊपर का interactive फ़र्क़ को ठोस बनाता है। एक level latch और एक edge flip-flop को वही data D और वही clock दिया जाता है। देखिए latch का output हर उस glitch की नक़ल करता है जो clock-high के दौरान होता है - transparent window का रिसाव - जबकि flip-flop का output बस एक बार, rising edge पर बदलता है, फिर अगले edge तक अडिग रहता है। Glitch जोड़िए तो latch उसका पीछा करता है; flip-flop, जो edge पर पहले ही sample कर चुका, उसे पूरी तरह अनदेखा करता है।",
        "तो बाक़ी digital design के लिए एक-पंक्ति यह है: latch clock-high रहते खुला छोड़ा दरवाज़ा है; flip-flop एक turnstile है जो clock के edge से गुज़रते ठीक एक बार click करता है। आगे जो भी आता है - SR, JK, D और T types - सब edge-triggered हैं, और यही उन्हें सुरक्षित, पूर्वानुमेय memory बनाता है।"
      ],
      transcriptEN: "A flip-flop samples on the clock edge; a latch is transparent through the whole high window, which is where a wrong value can race through.",
      transcriptHI: "Flip-flop clock edge पर sample करता है; latch पूरे high window में transparent रहता है, जहाँ ग़लत मान race कर सकता है।",
      visualNote: "ClockWave with rising and falling edge markers, a shaded transparent-window vs a single edge line, and a computed timing diagram: same D + clock into a level latch (follows glitches) and an edge flip-flop (one clean step per edge)."
    },
    {
      id: "S03_Edge",
      label: "Edges & Master-Slave",
      kind: "theory",
      subtitle: "Positive vs negative edges, and two latches that fake one edge.",
      theoryEN: [
        "There are two flavours of edge. A positive or rising edge is the clock going from 0 to 1: the flip-flop fires on that upward transition. A negative or falling edge is the clock going from 1 to 0: the flip-flop fires on the downward transition. On a schematic the clock input always gets a small triangle - the dynamic-input marker meaning edge-triggered - and a negative-edge device adds a bubble, the same inversion circle you see on a NOT gate, right on that clock input. Triangle alone means rising; triangle plus bubble means falling.",
        "Neither polarity is better; a design simply picks one convention and sticks to it so that every flip-flop samples at the same moment. What matters is that sampling happens at an instant, not across a window - the polarity just says which instant.",
        "How do you actually build an edge out of latches, which are level things? The classic answer is the master-slave arrangement: two latches in series, clocked on opposite phases. The first latch, the master, is transparent while the clock is high; the second latch, the slave, is transparent while the clock is low, because its clock input is the inverted clock.",
        "Walk one cycle with the live model above. While the clock is high the master opens and grabs the current data, but the slave is locked, so the output does not move yet. When the clock falls to low, the master locks - freezing whatever it captured - and the slave opens, passing that frozen value out to Q. The data therefore reaches the output at one instant, the falling edge, even though only level-sensitive latches were used.",
        "The crucial property is phase isolation: master and slave are never transparent at the same time, so there is never a straight path from input to output. A change at the input cannot ripple through in a single clock, and the feedback race that plagues level circuits is broken. Two ordinary latches, clocked out of phase, emulate one clean edge - which is why the master-slave is the textbook way to make a flip-flop."
      ],
      theoryHI: [
        "Edge के दो प्रकार हैं। Positive या rising edge clock का 0 से 1 जाना है: flip-flop उस ऊपर की ओर के transition पर fire करता है। Negative या falling edge clock का 1 से 0 जाना है: flip-flop नीचे की ओर के transition पर fire करता है। Schematic पर clock input को हमेशा एक छोटा triangle मिलता है - dynamic-input marker यानी edge-triggered - और negative-edge device उस clock input पर ठीक एक bubble जोड़ता है, वही inversion circle जो आप NOT gate पर देखते हैं। सिर्फ़ triangle मतलब rising; triangle जमा bubble मतलब falling।",
        "कोई भी polarity बेहतर नहीं; design बस एक convention चुनकर उस पर टिका रहता है ताकि हर flip-flop उसी पल पर sample करे। मायने यह रखता है कि sampling एक पल पर हो, किसी window भर में नहीं - polarity बस बताती है कौन सा पल।",
        "आप latches से, जो level चीज़ें हैं, edge असल में कैसे बनाते हैं? Classic जवाब master-slave व्यवस्था है: दो latches श्रृंखला में, उलटी phases पर clocked। पहली latch, master, clock के high रहते transparent है; दूसरी latch, slave, clock के low रहते transparent है, क्योंकि उसका clock input उलटा clock है।",
        "ऊपर के live model के साथ एक cycle चलिए। जब clock high है master खुलता है और मौजूदा data पकड़ता है, पर slave locked है, तो output अभी नहीं हिलता। जब clock गिरकर low होता है, master lock हो जाता है - जो पकड़ा था उसे जमाते हुए - और slave खुलता है, वह जमा मान Q पर भेजते हुए। इसलिए data output तक एक पल पर, falling edge पर पहुँचता है, भले सिर्फ़ level-sensitive latches वापरे गए हों।",
        "अहम गुण phase isolation है: master और slave कभी एक ही समय transparent नहीं होते, तो input से output तक कभी सीधा रास्ता नहीं बनता। Input पर बदलाव एक ही clock में पार नहीं जा सकता, और वह feedback race जो level circuits को सताती है टूट जाती है। दो साधारण latches, उलटी phase पर clocked, एक साफ़ edge की नक़ल करते हैं - इसीलिए master-slave, flip-flop बनाने का textbook तरीक़ा है।"
      ],
      transcriptEN: "Positive edge fires on 0 to 1, negative edge on 1 to 0 with a bubble on the clock; a master and slave latch on opposite phases emulate one edge and break the race.",
      transcriptHI: "Positive edge 0 से 1 पर fire करता है, negative edge 1 से 0 पर clock पर bubble के साथ; उलटी phases पर master और slave latch एक edge की नक़ल करते हैं और race तोड़ते हैं।",
      visualNote: "A live positive/negative edge polarity demo (toggle the clock, watch the matching FF fire) and a two-phase master-slave: master transparent when CLK=1, slave when CLK=0, output updating on the falling edge."
    },
    {
      id: "S04_SR",
      label: "The SR Flip-Flop",
      kind: "theory",
      subtitle: "Set-Reset, clocked - with one forbidden input.",
      theoryEN: [
        "The SR flip-flop is the clocked, edge-triggered cousin of the SR latch. It has two data inputs, S (set) and R (reset), plus the clock. At each active edge it reads S and R and updates: S=1, R=0 sets Q to 1; S=0, R=1 resets Q to 0; S=0, R=0 holds the previous state; and S=1, R=1 is forbidden.",
        "Its characteristic equation is Q(t+1) = S + R'.Q, valid under the constraint S.R = 0 - the two inputs must never both be 1. Read it: Q becomes 1 whenever S is 1 (set), otherwise Q keeps its old value only when R is 0 (that is, when it is not being reset). Check the rows: S=1 gives Q+=1; S=0, R=1 gives Q+=0; S=0, R=0 gives Q+=Q, a hold.",
        "Why is 11 forbidden? Commanding set and reset at once is a contradiction - you are telling Q to be both 1 and 0. In the underlying cross-coupled gates it drives Q and Q' to the same level, and worse, if both inputs then fall together the circuit settles unpredictably into a race. So S.R=0 is a hard rule and the SR truth table simply marks 11 as invalid.",
        "The characteristic table beside this text is computed straight from the equation for all four input combinations and both present states - read off hold, reset, set and the invalid entry. Now drive the live flip-flop: set S and R, press the clock, and watch Q obey Q(t+1) = S + R'Q on every edge. Try 11 and the model refuses to move, exactly as the forbidden rule demands.",
        "The SR flip-flop is rarely the final choice, precisely because of that forbidden corner - but it is the foundation. The very next type, JK, keeps everything good about SR and turns its one illegal input into the single most useful operation."
      ],
      theoryHI: [
        "SR flip-flop, SR latch का clocked, edge-triggered भाई है। इसमें दो data inputs हैं, S (set) और R (reset), साथ में clock। हर active edge पर यह S और R पढ़ता है और update करता है: S=1, R=0 Q को 1 set करता है; S=0, R=1 Q को 0 reset करता है; S=0, R=0 पिछली स्थिति hold करता है; और S=1, R=1 forbidden है।",
        "इसका characteristic equation है Q(t+1) = S + R'.Q, जो शर्त S.R = 0 के तहत मान्य है - दोनों inputs कभी दोनों 1 न हों। पढ़िए: जब भी S 1 हो Q 1 बन जाता है (set), वरना Q अपना पुराना मान तभी रखता है जब R 0 हो (यानी जब वह reset नहीं हो रहा)। Rows जाँचिए: S=1 देता है Q+=1; S=0, R=1 देता है Q+=0; S=0, R=0 देता है Q+=Q, एक hold।",
        "11 forbidden क्यों है? एक साथ set और reset का आदेश एक विरोधाभास है - आप Q से कह रहे हैं कि वह 1 भी हो और 0 भी। नीचे के cross-coupled gates में यह Q और Q' को एक ही level पर धकेल देता है, और बदतर, अगर फिर दोनों inputs साथ गिरें तो circuit अप्रत्याशित रूप से एक race में जम जाता है। तो S.R=0 एक सख़्त नियम है और SR truth table 11 को बस invalid चिह्नित करती है।",
        "इस text के बग़ल की charactertistic table equation से सीधे, चारों input combinations और दोनों present states के लिए compute की गई है - hold, reset, set और invalid entry पढ़ लीजिए। अब live flip-flop चलाइए: S और R set कीजिए, clock दबाइए, और देखिए Q हर edge पर Q(t+1) = S + R'Q मानता है। 11 आज़माइए और model हिलने से इनकार करता है, ठीक जैसा forbidden नियम माँगता है।",
        "SR flip-flop शायद ही कभी अंतिम पसंद होता है, ठीक उसी forbidden कोने की वजह से - पर यह नींव है। ठीक अगला type, JK, SR की हर अच्छी बात रखता है और उसके एक अवैध input को सबसे उपयोगी operation में बदल देता है।"
      ],
      transcriptEN: "SR flip-flop: Q-next equals S plus R-prime Q with S-R equal to zero. Set, reset and hold are fine; S equals R equals one is forbidden.",
      transcriptHI: "SR flip-flop: Q-next बराबर S plus R-prime Q, जहाँ S-R बराबर शून्य। Set, reset और hold ठीक हैं; S बराबर R बराबर एक forbidden है।",
      visualNote: "Live SR flip-flop (drive S, R, tick the clock; 11 refuses to move) beside its computed characteristic table with the invalid row marked."
    },
    {
      id: "S05_JK",
      label: "The JK Flip-Flop",
      kind: "theory",
      subtitle: "SR's fix: the 11 input becomes a clean toggle.",
      theoryEN: [
        "The JK flip-flop is the SR flip-flop with its one flaw engineered away. J plays the role of set and K the role of reset, and three of the four input combinations behave exactly like SR: J=0, K=0 holds; J=0, K=1 resets Q to 0; J=1, K=0 sets Q to 1. The magic is in the fourth row.",
        "Where SR forbade 11, JK defines it: J=1, K=1 makes the flip-flop TOGGLE - Q flips to its complement, Q(t+1) = Q'. The old illegal state becomes the single most useful operation in all of sequential design, because a toggle is exactly what you need to count and to divide a clock.",
        "The characteristic equation folds all four rows into one line: Q(t+1) = J.Q' + K'.Q. Trace it. J=1, K=0 gives Q' + Q = 1 (set). J=0, K=1 gives 0 + 0 = 0 (reset). J=0, K=0 gives 0 + Q = Q (hold). J=1, K=1 gives Q' + 0 = Q' (toggle). One equation, four behaviours.",
        "The computed characteristic table shows those four rows for you, and the live JK flip-flop lets you feel the toggle: hold J=K=1 and press the clock repeatedly, and Q flips 0, 1, 0, 1 on every edge. That clean, predictable toggle is impossible on an SR flip-flop, and it is exactly why JK is often called the universal flip-flop.",
        "Because JK covers hold, set, reset and toggle, every other flip-flop can be built from it by wiring its inputs appropriately - which is precisely what the next two pages do to make a D and a T from a JK."
      ],
      theoryHI: [
        "JK flip-flop, SR flip-flop है जिसकी एक ख़ामी engineering से हटा दी गई। J, set की भूमिका निभाता है और K, reset की, और चार में से तीन input combinations ठीक SR जैसे बर्ताव करते हैं: J=0, K=0 hold; J=0, K=1 Q को 0 reset; J=1, K=0 Q को 1 set। जादू चौथी row में है।",
        "जहाँ SR ने 11 को मना किया, JK उसे परिभाषित करता है: J=1, K=1 flip-flop को TOGGLE करता है - Q अपने complement में पलटता है, Q(t+1) = Q'। पुरानी अवैध स्थिति पूरे sequential design की सबसे उपयोगी operation बन जाती है, क्योंकि toggle ठीक वही है जो गिनने और clock को divide करने के लिए चाहिए।",
        "Characteristic equation चारों rows को एक पंक्ति में समेटता है: Q(t+1) = J.Q' + K'.Q। इसे trace कीजिए। J=1, K=0 देता है Q' + Q = 1 (set)। J=0, K=1 देता है 0 + 0 = 0 (reset)। J=0, K=0 देता है 0 + Q = Q (hold)। J=1, K=1 देता है Q' + 0 = Q' (toggle)। एक equation, चार बर्ताव।",
        "Computed characteristic table आपके लिए वे चारों rows दिखाती है, और live JK flip-flop आपको toggle महसूस कराता है: J=K=1 पर रखिए और clock बार-बार दबाइए, और Q हर edge पर 0, 1, 0, 1 पलटता है। वह साफ़, पूर्वानुमेय toggle SR flip-flop पर असंभव है, और ठीक इसीलिए JK को अक्सर universal flip-flop कहते हैं।",
        "चूँकि JK, hold, set, reset और toggle को समेटता है, हर दूसरा flip-flop इसके inputs को ठीक से wire करके इससे बनाया जा सकता है - ठीक वही जो अगले दो पन्ने JK से D और T बनाने में करते हैं।"
      ],
      transcriptEN: "JK flip-flop: Q-next equals J Q-prime plus K-prime Q. Hold, reset and set like SR, but the old forbidden one-one now toggles the output.",
      transcriptHI: "JK flip-flop: Q-next बराबर J Q-prime plus K-prime Q। Hold, reset और set SR जैसे, पर पुराना forbidden one-one अब output को toggle करता है।",
      visualNote: "Live JK flip-flop (hold J=K=1 and tick to watch Q toggle 0,1,0,1) beside its computed characteristic table with the toggle row highlighted."
    },
    {
      id: "S06_D",
      label: "The D Flip-Flop",
      kind: "theory",
      subtitle: "Q(t+1) = D - the delay cell, and JK to D.",
      theoryEN: [
        "The D flip-flop is the simplest and by far the most used flip-flop. It has a single data input D, and its characteristic equation is the shortest in the subject: Q(t+1) = D. Whatever D is at the clock edge becomes the new stored bit - no hold row to worry about, no forbidden input, no toggle. It is a one-bit memory that samples D once per tick.",
        "The letter D stands for data, and also for delay, because that captures its behaviour perfectly: the value present on D appears at Q one clock later. Feed a bit in, and exactly one clock edge afterwards it comes out. This delay-by-one-clock is the atom from which shift registers and pipelines are built.",
        "The characteristic table has just two rows, both computed beside this text: D=0 gives Q+=0, and D=1 gives Q+=1. There is nothing to memorise - the output simply equals the input at the edge. That very simplicity is why the D flip-flop dominates real chips: it can never be commanded to do something contradictory.",
        "You can make a D flip-flop out of a JK with a one-inverter trick: set J=D and K=D'. Then the JK equation Q(t+1) = J.Q' + K'.Q becomes D.Q' + (D')'.Q = D.Q' + D.Q = D.(Q'+Q) = D - exactly the D flip-flop. The conversion gadget above lets you toggle D and watch a JK wired with J=D, K=D' produce the same next state as a true D flip-flop, for both present states.",
        "In practice a gated D latch plus edge triggering (or a master-slave pair) gives the D flip-flop directly, but the JK-to-D conversion is the standard worked example that proves you understand how the characteristic equations connect."
      ],
      theoryHI: [
        "D flip-flop सबसे सरल और अब तक का सबसे ज़्यादा वापरा जाने वाला flip-flop है। इसमें एक अकेला data input D है, और इसका characteristic equation विषय का सबसे छोटा है: Q(t+1) = D। Clock edge पर D जो भी हो वही नया जमा bit बन जाता है - कोई hold row की चिंता नहीं, कोई forbidden input नहीं, कोई toggle नहीं। यह एक one-bit memory है जो D को हर tick पर एक बार sample करती है।",
        "अक्षर D का मतलब data है, और delay भी, क्योंकि यह इसके बर्ताव को एकदम पकड़ता है: D पर मौजूद मान एक clock बाद Q पर आता है। एक bit अंदर खिलाइए, और ठीक एक clock edge बाद वह बाहर आता है। यह एक-clock-की-देरी वह परमाणु है जिससे shift registers और pipelines बनते हैं।",
        "Characteristic table में बस दो rows हैं, दोनों इस text के बग़ल compute की गईं: D=0 देता है Q+=0, और D=1 देता है Q+=1। याद करने को कुछ नहीं - output बस edge पर input के बराबर है। यही सादगी वजह है कि D flip-flop असली chips पर हावी है: इसे कभी कोई विरोधाभासी आदेश नहीं दिया जा सकता।",
        "आप एक-inverter की चाल से JK से D flip-flop बना सकते हैं: J=D और K=D' रखिए। तब JK equation Q(t+1) = J.Q' + K'.Q बन जाता है D.Q' + (D')'.Q = D.Q' + D.Q = D.(Q'+Q) = D - ठीक D flip-flop। ऊपर का conversion gadget आपको D toggle करने देता है और देखिए J=D, K=D' से wire किया JK दोनों present states के लिए एक असली D flip-flop जैसा ही next state देता है।",
        "व्यवहार में gated D latch जमा edge triggering (या एक master-slave जोड़ी) सीधे D flip-flop देता है, पर JK-to-D conversion वह मानक worked example है जो साबित करता है कि आप समझते हैं characteristic equations कैसे जुड़ते हैं।"
      ],
      transcriptEN: "D flip-flop: Q-next equals D. The data in comes out one clock later - the delay cell. From a JK, wire J equals D and K equals D-prime.",
      transcriptHI: "D flip-flop: Q-next बराबर D। अंदर गया data एक clock बाद बाहर - delay cell। JK से, J बराबर D और K बराबर D-prime बाँधिए।",
      visualNote: "Live D flip-flop beside its two-row computed table, plus a JK-to-D conversion proof: toggle D, see J=D and K=D', and the JK next state equals the D next state for both Q."
    },
    {
      id: "S07_T",
      label: "The T Flip-Flop",
      kind: "theory",
      subtitle: "Q(t+1) = T XOR Q - the toggle cell, and JK to T.",
      theoryEN: [
        "The T flip-flop - T for toggle - has a single input T and one job: when T=1 it flips its state on every clock edge, and when T=0 it holds. Its characteristic equation is Q(t+1) = T XOR Q, the exclusive-OR of the input with the current state.",
        "Read the two rows. With T=0: Q+ = 0 XOR Q = Q, so the bit holds. With T=1: Q+ = 1 XOR Q = Q', so the bit toggles. That is the whole device - hold or invert - and the computed characteristic table beside this text shows exactly those two rows.",
        "A T flip-flop tied permanently to T=1 becomes a divide-by-two: it flips once per input clock, so its output completes one full cycle for every two input cycles - half the frequency. Chain these and each stage halves the frequency again, which is precisely how a binary ripple counter is built. The T flip-flop is the counting cell.",
        "T comes from a JK just as easily: tie J and K together onto the single line T, so J=K=T. The JK equation then gives Q(t+1) = T.Q' + T'.Q = T XOR Q - the T flip-flop exactly. The conversion tool above proves it: set J=K=T, sweep T, and the JK next state matches the T next state for both values of Q.",
        "So D and T are both just a JK with clever input wiring: J=D, K=D' gives delay, and J=K=T gives toggle. Two inputs, two behaviours, one underlying flip-flop - which is the whole point of calling JK universal."
      ],
      theoryHI: [
        "T flip-flop - T यानी toggle - में एक अकेला input T है और एक काम: जब T=1 हो यह हर clock edge पर अपनी स्थिति पलटता है, और जब T=0 हो यह hold करता है। इसका characteristic equation है Q(t+1) = T XOR Q, input का current state के साथ exclusive-OR।",
        "दो rows पढ़िए। T=0 पर: Q+ = 0 XOR Q = Q, तो bit hold करता है। T=1 पर: Q+ = 1 XOR Q = Q', तो bit toggle करता है। यही पूरा device है - hold या invert - और इस text के बग़ल की computed characteristic table ठीक वही दो rows दिखाती है।",
        "स्थायी रूप से T=1 पर बँधा T flip-flop एक divide-by-two बन जाता है: यह हर input clock पर एक बार पलटता है, तो इसका output हर दो input cycles पर एक पूरा cycle पूरा करता है - आधी frequency। इन्हें श्रृंखला में बाँधिए और हर stage frequency को फिर आधा करता है, ठीक यही तरीक़ा है जिससे binary ripple counter बनता है। T flip-flop counting cell है।",
        "T, JK से उतनी ही आसानी से आता है: J और K को एक अकेली line T पर बाँधिए, तो J=K=T। तब JK equation देता है Q(t+1) = T.Q' + T'.Q = T XOR Q - ठीक T flip-flop। ऊपर का conversion tool इसे साबित करता है: J=K=T रखिए, T घुमाइए, और JK का next state Q के दोनों मानों के लिए T के next state से मेल खाता है।",
        "तो D और T दोनों बस चतुर input wiring वाला JK हैं: J=D, K=D' देता है delay, और J=K=T देता है toggle। दो inputs, दो बर्ताव, एक अंतर्निहित flip-flop - यही JK को universal कहने का पूरा मतलब है।"
      ],
      transcriptEN: "T flip-flop: Q-next equals T XOR Q. T zero holds, T one toggles; held at one it divides the clock by two. From a JK, tie J equals K equals T.",
      transcriptHI: "T flip-flop: Q-next बराबर T XOR Q। T शून्य hold, T एक toggle; एक पर रखा यह clock को दो से divide करता है। JK से, J बराबर K बराबर T बाँधिए।",
      visualNote: "Live T flip-flop beside its two-row computed table, a JK-to-T conversion proof (J=K=T), and a computed divide-by-two timing diagram of a T=1 stage."
    },
    {
      id: "S08_Apps",
      label: "Where Each Type Lives",
      kind: "theory",
      subtitle: "D for storage, T for counting, JK for control, SR for debounce.",
      theoryEN: [
        "Each flip-flop type earns its place by matching a job. The D flip-flop, being pure one-clock delay, is the natural cell for storing and moving data: registers, shift registers, and the storage cells of static RAM are all banks of D flip-flops. When you just need to hold or move bits, you reach for D.",
        "The T flip-flop, the toggle cell, is the counting element. Because a T=1 stage divides frequency by two, cascades of T flip-flops build binary counters and frequency dividers - the timing backbone of digital clocks, timers and prescalers. The live divide-by-two above shows a single T stage running at exactly half the input rate.",
        "The JK flip-flop, with its full hold, set, reset and toggle repertoire, is the flexible workhorse for control logic and finite-state machines, where different inputs must drive different next-state actions. Its four behaviours make it easy to realise arbitrary state transitions from a state diagram.",
        "The SR flip-flop, closest to the bare latch, shows up wherever a simple set-and-hold is enough - classically for switch debouncing, where a noisy mechanical contact is cleaned into one solid set or reset. The mapping above lines up each type with its home; every characteristic equation shown there is pulled straight from the shared flip-flop logic, not retyped.",
        "The takeaway is a quick lookup you can carry into any datasheet: need storage or a pipeline, use D; need to count or divide a clock, use T; need general control or an FSM, use JK; need a clean set-reset or a debounce, use SR."
      ],
      theoryHI: [
        "हर flip-flop type एक काम से मेल खाकर अपनी जगह कमाता है। D flip-flop, शुद्ध एक-clock delay होने से, data जमा करने और सरकाने की स्वाभाविक cell है: registers, shift registers, और static RAM की storage cells सब D flip-flops के bank हैं। जब आपको बस bits रखने या सरकाने हों, आप D उठाते हैं।",
        "T flip-flop, toggle cell, counting element है। चूँकि T=1 stage frequency को दो से divide करता है, T flip-flops की cascades binary counters और frequency dividers बनाती हैं - digital clocks, timers और prescalers की timing रीढ़। ऊपर का live divide-by-two एक अकेला T stage दिखाता है जो input दर से ठीक आधी पर चलता है।",
        "JK flip-flop, अपने पूरे hold, set, reset और toggle भंडार के साथ, control logic और finite-state machines के लिए लचीला workhorse है, जहाँ अलग inputs को अलग next-state क्रियाएँ चलानी होती हैं। इसके चार बर्ताव state diagram से मनचाहे state transitions साकार करना आसान कर देते हैं।",
        "SR flip-flop, नंगे latch के सबसे क़रीब, वहाँ दिखता है जहाँ एक सादा set-and-hold काफ़ी हो - classic रूप से switch debouncing के लिए, जहाँ शोर भरे mechanical contact को एक ठोस set या reset में साफ़ किया जाता है। ऊपर का mapping हर type को उसके घर से जोड़ता है; वहाँ दिखाया हर characteristic equation साझा flip-flop logic से सीधे लिया गया है, दोबारा टाइप नहीं किया।",
        "निचोड़ एक झटपट lookup है जिसे आप किसी भी datasheet में ले जा सकते हैं: storage या pipeline चाहिए, D वापरिए; गिनना या clock divide करना है, T वापरिए; सामान्य control या FSM चाहिए, JK वापरिए; साफ़ set-reset या debounce चाहिए, SR वापरिए।"
      ],
      transcriptEN: "D for registers, shift registers and RAM; T for counters and frequency dividers; JK for control logic and state machines; SR for debouncing.",
      transcriptHI: "D registers, shift registers और RAM के लिए; T counters और frequency dividers के लिए; JK control logic और state machines के लिए; SR debouncing के लिए।",
      visualNote: "A mapping panel: each of D/T/JK/SR (with its computed characteristic equation) linked to its application, plus a live T divide-by-two timing diagram."
    },
    {
      id: "S09_Analogy",
      label: "The Turnstile",
      kind: "theory",
      subtitle: "A gate that advances exactly once per tick - the edge, made physical.",
      theoryEN: [
        "Picture a subway turnstile. No matter how long or how hard you lean on it, it advances exactly one quarter-turn and lets exactly one person through per push, then locks again until the next push. That single, discrete advance per event is the physical picture of edge-triggering.",
        "Now picture the alternative: an ordinary door propped open. While it is open - the whole time - anyone and everyone streams through. That is the level-triggered latch and its transparent window: hold the enable high and the output keeps following the input, letting a whole crowd of changes pour through uncontrolled.",
        "The turnstile fixes this by responding to the event, not the duration. It does not matter that your hand rests on the bar for a whole second; the mechanism only registers the click as it turns past its catch point. In exactly the same way, a flip-flop ignores how long the clock stays high and captures data only at the instant of the edge.",
        "Map it precisely with the live turnstile above. Each clock tick is one push on the bar; the person who passes is the one data value captured at that edge; and the lock between pushes is the flip-flop holding its bit, deaf to any input change until the next tick. One tick, one controlled advance - that is the whole discipline of synchronous design in a single image.",
        "The picture even carries the counting idea: a turnstile tallies people the same way a T flip-flop tallies clocks, one advance per event. Hold that turnstile in mind and every waveform in the rest of the track reads as a sequence of clean, once-per-tick clicks."
      ],
      theoryHI: [
        "एक subway turnstile सोचिए। आप उस पर जितनी देर या जितनी ज़ोर से टिकें, वह ठीक एक चौथाई-घुमाव आगे बढ़ता है और हर धक्के पर ठीक एक व्यक्ति को गुज़रने देता है, फिर अगले धक्के तक फिर lock हो जाता है। हर घटना पर वही एक, अलग advance edge-triggering की भौतिक तस्वीर है।",
        "अब विकल्प सोचिए: एक साधारण दरवाज़ा खुला छोड़ा हुआ। जब तक वह खुला है - पूरे समय - कोई भी और सब streams में गुज़रते हैं। वही level-triggered latch और उसका transparent window है: enable को high रखिए और output input का पीछा करता रहता है, बदलावों की पूरी भीड़ को बेक़ाबू बहने देते हुए।",
        "Turnstile इसे घटना पर प्रतिक्रिया देकर सुधारता है, अवधि पर नहीं। इससे फ़र्क़ नहीं पड़ता कि आपका हाथ bar पर पूरे एक सेकंड टिका है; तंत्र सिर्फ़ उस click को दर्ज करता है जब वह अपने catch point से गुज़रता है। ठीक उसी तरह, flip-flop अनदेखा करता है कि clock कितनी देर high रहा और data सिर्फ़ edge के पल पकड़ता है।",
        "ऊपर के live turnstile से इसे ठीक से बैठाइए। हर clock tick bar पर एक धक्का है; जो व्यक्ति गुज़रता है वह उस edge पर पकड़ा एक data मान है; और धक्कों के बीच का lock वह flip-flop है जो अपना bit रखता है, अगले tick तक किसी input बदलाव से बहरा। एक tick, एक क़ाबू किया advance - यही पूरे synchronous design का अनुशासन एक अकेली तस्वीर में है।",
        "तस्वीर counting का विचार भी ढोती है: turnstile लोगों को उसी तरह गिनता है जैसे T flip-flop clocks गिनता है, हर घटना पर एक advance। उस turnstile को मन में रखिए और बाक़ी track की हर waveform साफ़, हर-tick-एक-बार clicks की श्रृंखला-सी पढ़ती है।"
      ],
      transcriptEN: "A turnstile advances exactly one person per push, no matter how long you lean; that is the clock edge, versus a propped-open door that lets a crowd through.",
      transcriptHI: "Turnstile हर धक्के पर ठीक एक व्यक्ति आगे बढ़ाता है, चाहे आप जितनी देर टिकें; वही clock edge है, बनाम खुला छोड़ा दरवाज़ा जो भीड़ गुज़रने देता है।",
      visualNote: "A live turnstile that rotates one quarter-turn per clock tick and counts people through, contrasted with the propped-open (level) door."
    },
    {
      id: "S10_Build",
      label: "Build A JK Flip-Flop",
      kind: "theory",
      subtitle: "Wire an edge-triggered JK on the live workbench.",
      theoryEN: [
        "Now build the universal flip-flop for real. On the workbench you will wire an edge-triggered JK flip-flop and prove all four behaviours - hold, set, reset and toggle - by driving J, K and the clock and reading Q on each edge.",
        "The plan follows the characteristic equation Q(t+1) = J.Q' + K'.Q. Feed J and the fed-back Q' into one AND, K' and the fed-back Q into another, OR the two, and clock the result into the storage element so the update lands on the edge, not across a window.",
        "The all-important test is the toggle row: hold J=K=1 and pulse the clock, and Q must flip 0, 1, 0, 1 - one clean inversion per tick. If it oscillates while the clock is high instead, you have built a level-triggered version and reintroduced the race; edge-triggering (or a master-slave pair) is what fixes it.",
        "Once the JK works you effectively have D and T too: wire J=D, K=D' for a D flip-flop, or tie J=K=T for a T flip-flop, and confirm each against the characteristic tables you drove on the earlier pages."
      ],
      theoryHI: [
        "अब universal flip-flop असल में बनाइए। Workbench पर आप एक edge-triggered JK flip-flop wire करेंगे और चारों बर्ताव - hold, set, reset और toggle - साबित करेंगे, J, K और clock चलाकर और हर edge पर Q पढ़कर।",
        "योजना characteristic equation Q(t+1) = J.Q' + K'.Q का पालन करती है। J और feed-back हुए Q' को एक AND में, K' और feed-back हुए Q को दूसरे में खिलाइए, दोनों को OR कीजिए, और नतीजे को storage element में clock कीजिए ताकि update edge पर उतरे, किसी window भर में नहीं।",
        "सबसे अहम test toggle row है: J=K=1 पर रखिए और clock pulse कीजिए, और Q को 0, 1, 0, 1 पलटना चाहिए - हर tick एक साफ़ inversion। अगर वह इसके बजाय clock-high रहते oscillate करे, तो आपने level-triggered संस्करण बनाया है और race दोबारा ला दी; edge-triggering (या एक master-slave जोड़ी) ही इसे सुधारती है।",
        "एक बार JK चल जाए तो असल में आपके पास D और T भी हैं: D flip-flop के लिए J=D, K=D' wire कीजिए, या T flip-flop के लिए J=K=T बाँधिए, और हर एक को उन characteristic tables के सामने जाँचिए जो आपने पिछले पन्नों पर चलाईं।"
      ],
      transcriptEN: "Build an edge-triggered JK on the workbench and prove hold, set, reset and toggle - then wire J=D, K=D' for a D and J=K=T for a T.",
      transcriptHI: "Workbench पर एक edge-triggered JK बनाइए और hold, set, reset और toggle साबित कीजिए - फिर D के लिए J=D, K=D' और T के लिए J=K=T wire कीजिए।",
      visualNote: "WorkbenchCTA launching the jk-flipflop guided build."
    },
    {
      id: "S11_Flashcards",
      label: "Flip-Flop Flashcards",
      kind: "flashcards",
      subtitle: "Nine cards: every type, plus edges, master-slave and the conversions.",
      theoryEN: ["Flip the cards: term on the front, the real logic on the back."],
      theoryHI: ["Cards पलटिए: सामने पद, पीछे असली logic।"],
      transcriptEN: "Nine flashcards covering edge-triggering, the four types, and the JK conversions.",
      transcriptHI: "नौ flashcards जो edge-triggering, चारों types और JK conversions समेटती हैं।",
      visualNote: "Flip-card deck."
    },
    {
      id: "S12_Quiz",
      label: "Flip-Flop Quiz",
      kind: "quiz",
      subtitle: "Eight questions across edges, the four types and the conversions.",
      theoryEN: ["Eight questions to lock in edge-triggering, the four characteristic equations and the JK-to-D / JK-to-T conversions."],
      theoryHI: ["आठ सवाल edge-triggering, चारों characteristic equations और JK-to-D / JK-to-T conversions पक्का करने को।"],
      transcriptEN: "Prove you can tell a flip-flop from a latch and read every characteristic equation.",
      transcriptHI: "साबित कीजिए कि आप flip-flop को latch से अलग बता सकते हैं और हर characteristic equation पढ़ सकते हैं।",
      visualNote: "QuizArena with 8 problems."
    },
    {
      id: "S13_Recap",
      label: "Recap",
      kind: "recap",
      subtitle: "The edge, the four equations, and where each type lives.",
      theoryEN: [
        "A flip-flop is a one-bit, edge-triggered memory: it samples its inputs only at the clock edge, closing the transparent window that makes a level latch race. Positive-edge devices fire on 0 to 1, negative-edge devices on 1 to 0 and wear a bubble on the clock; a master-slave pair of latches, clocked on opposite phases, emulates that edge while breaking the feedback path.",
        "Four types, four characteristic equations: SR gives Q(t+1) = S + R'Q with 11 forbidden; JK gives Q(t+1) = J.Q' + K'.Q and turns 11 into a clean toggle; D gives Q(t+1) = D, the delay cell; and T gives Q(t+1) = T XOR Q, the toggle cell. JK is universal - J=D, K=D' makes a D, and J=K=T makes a T.",
        "And each has a home: D for registers, shift registers and RAM; T for counters and frequency dividers; JK for control logic and state machines; SR for debouncing. Master the edge and these four equations and you hold the whole vocabulary of clocked memory - the foundation for the counters, registers and state machines still to come."
      ],
      theoryHI: [
        "Flip-flop एक one-bit, edge-triggered memory है: यह अपने inputs को सिर्फ़ clock edge पर sample करता है, उस transparent window को बंद करते हुए जो level latch को race कराती है। Positive-edge devices 0 से 1 पर fire करते हैं, negative-edge devices 1 से 0 पर और clock पर एक bubble पहनते हैं; उलटी phases पर clocked latches की एक master-slave जोड़ी उस edge की नक़ल करती है और feedback रास्ता तोड़ देती है।",
        "चार types, चार characteristic equations: SR देता है Q(t+1) = S + R'Q, 11 forbidden के साथ; JK देता है Q(t+1) = J.Q' + K'.Q और 11 को एक साफ़ toggle में बदलता है; D देता है Q(t+1) = D, delay cell; और T देता है Q(t+1) = T XOR Q, toggle cell। JK universal है - J=D, K=D' बनाता है D, और J=K=T बनाता है T।",
        "और हर एक का एक घर है: D registers, shift registers और RAM के लिए; T counters और frequency dividers के लिए; JK control logic और state machines के लिए; SR debouncing के लिए। Edge और इन चार equations में महारत पाइए और आपके पास clocked memory की पूरी शब्दावली है - आगे आने वाले counters, registers और state machines की नींव।"
      ],
      transcriptEN: "Edge-triggered memory, four characteristic equations, and one home for each type - the vocabulary of every clocked circuit.",
      transcriptHI: "Edge-triggered memory, चार characteristic equations, और हर type का एक घर - हर clocked circuit की शब्दावली।",
      visualNote: "FlowRail recap loop, then the summary prose."
    }
  ],
  flashcards: [
    {
      frontEN: "Edge-triggered (flip-flop)",
      backEN: "A flip-flop samples its inputs only at the instant the clock changes (the edge), not for the whole time the clock is high. This closes the latch's transparent window, so data is captured once per clock and thousands of cells can update in lockstep.",
      frontHI: "Edge-triggered (flip-flop)",
      backHI: "Flip-flop अपने inputs को सिर्फ़ उस पल sample करता है जब clock बदलता है (edge), पूरे clock-high समय नहीं। यह latch की transparent window बंद कर देता है, तो data हर clock पर एक बार पकड़ा जाता है और हज़ारों cells lockstep में update हो सकती हैं।"
    },
    {
      frontEN: "Positive vs negative edge",
      backEN: "A positive (rising) edge triggers on the clock's 0 to 1 transition; a negative (falling) edge on 1 to 0. A negative-edge clock input is drawn with a bubble (inversion circle) added to the edge triangle.",
      frontHI: "Positive बनाम negative edge",
      backHI: "Positive (rising) edge clock के 0 से 1 transition पर trigger करता है; negative (falling) edge 1 से 0 पर। Negative-edge clock input edge triangle पर एक bubble (inversion circle) जोड़कर बनाया जाता है।"
    },
    {
      frontEN: "Master-slave flip-flop",
      backEN: "Two level latches in series on opposite clock phases: the master is transparent when the clock is high, the slave when it is low. They are never open together (phase isolation), so the pair emulates a single edge and breaks the feedback race.",
      frontHI: "Master-slave flip-flop",
      backHI: "उलटी clock phases पर श्रृंखला में दो level latches: master clock के high रहते transparent, slave low रहते। वे कभी एक साथ खुले नहीं होते (phase isolation), तो जोड़ी एक अकेले edge की नक़ल करती है और feedback race तोड़ती है।"
    },
    {
      frontEN: "SR flip-flop",
      backEN: "Clocked set-reset. Q(t+1) = S + R'.Q with the constraint S.R = 0. Rows: 00 hold, 01 reset, 10 set, 11 forbidden (it commands Q = 0 and Q = 1 at once).",
      frontHI: "SR flip-flop",
      backHI: "Clocked set-reset. Q(t+1) = S + R'.Q, शर्त S.R = 0 के साथ। Rows: 00 hold, 01 reset, 10 set, 11 forbidden (यह एक साथ Q = 0 और Q = 1 का आदेश देता है)।"
    },
    {
      frontEN: "JK flip-flop",
      backEN: "SR's fix. Q(t+1) = J.Q' + K'.Q. Rows: 00 hold, 01 reset, 10 set, and the old forbidden 11 becomes TOGGLE (Q to Q'). Because it does all four, it is called the universal flip-flop.",
      frontHI: "JK flip-flop",
      backHI: "SR का इलाज। Q(t+1) = J.Q' + K'.Q। Rows: 00 hold, 01 reset, 10 set, और पुराना forbidden 11 TOGGLE बन जाता है (Q से Q')। चारों करने की वजह से इसे universal flip-flop कहते हैं।"
    },
    {
      frontEN: "D flip-flop",
      backEN: "Q(t+1) = D - the delay/data cell. The value on D appears at Q one clock later. No forbidden input, nothing to memorise; it is the workhorse of registers and RAM.",
      frontHI: "D flip-flop",
      backHI: "Q(t+1) = D - delay/data cell। D पर मौजूद मान एक clock बाद Q पर आता है। कोई forbidden input नहीं, याद करने को कुछ नहीं; यह registers और RAM का workhorse है।"
    },
    {
      frontEN: "T flip-flop",
      backEN: "Q(t+1) = T XOR Q - the toggle cell. T=0 holds, T=1 flips on every edge. Held at T=1 it divides the clock frequency by two: the counting element.",
      frontHI: "T flip-flop",
      backHI: "Q(t+1) = T XOR Q - toggle cell। T=0 hold, T=1 हर edge पर flip। T=1 पर रखा यह clock frequency को दो से divide करता है: counting element।"
    },
    {
      frontEN: "JK to D conversion",
      backEN: "Set J = D and K = D'. Then J.Q' + K'.Q = D.Q' + D.Q = D, exactly a D flip-flop. One inverter turns a JK into a D - no feedback needed.",
      frontHI: "JK से D conversion",
      backHI: "J = D और K = D' रखिए। तब J.Q' + K'.Q = D.Q' + D.Q = D, ठीक एक D flip-flop। एक inverter JK को D बना देता है - कोई feedback नहीं चाहिए।"
    },
    {
      frontEN: "JK to T conversion",
      backEN: "Tie J = K = T. Then J.Q' + K'.Q = T.Q' + T'.Q = T XOR Q, exactly a T flip-flop. A JK with both inputs joined is a T flip-flop.",
      frontHI: "JK से T conversion",
      backHI: "J = K = T बाँधिए। तब J.Q' + K'.Q = T.Q' + T'.Q = T XOR Q, ठीक एक T flip-flop। दोनों inputs जुड़ा JK एक T flip-flop है।"
    }
  ],
  quiz: [
    {
      questionEN: "What most fundamentally distinguishes a flip-flop from a latch?",
      questionHI: "Flip-flop को latch से सबसे बुनियादी तौर पर क्या अलग करता है?",
      options: [
        "A flip-flop is edge-triggered; a latch is level-triggered",
        "A flip-flop has more inputs than a latch",
        "A latch is always faster than a flip-flop",
        "A flip-flop needs no clock at all"
      ],
      answerIndex: 0,
      explainEN: "A flip-flop captures data only at the clock edge (an instant); a latch is transparent for the whole time its enable is high, which is the transparent-window race that edge-triggering removes.",
      explainHI: "Flip-flop data सिर्फ़ clock edge पर (एक पल) पकड़ता है; latch अपने enable के high रहते पूरे समय transparent रहता है, वही transparent-window race जिसे edge-triggering हटाती है।"
    },
    {
      questionEN: "A positive-edge flip-flop fires on which clock transition?",
      questionHI: "Positive-edge flip-flop किस clock transition पर fire करता है?",
      options: ["0 to 1 (rising)", "1 to 0 (falling)", "The whole time the clock is high", "The whole time the clock is low"],
      answerIndex: 0,
      explainEN: "Positive edge means the rising 0 to 1 transition. A negative-edge device instead fires on the falling 1 to 0 transition.",
      explainHI: "Positive edge यानी rising 0 से 1 transition। Negative-edge device इसके बजाय falling 1 से 0 transition पर fire करता है।"
    },
    {
      questionEN: "How is a negative-edge clock input drawn, and when does it fire?",
      questionHI: "Negative-edge clock input कैसे बनाया जाता है, और वह कब fire करता है?",
      options: [
        "With a bubble on the clock triangle; it fires on the falling 1 to 0 edge",
        "With a double triangle; it fires on the rising edge",
        "With no triangle at all; it fires on any input change",
        "With an AND gate; it fires while the clock is high"
      ],
      answerIndex: 0,
      explainEN: "The edge triangle marks a dynamic (edge-triggered) input; adding an inversion bubble makes it negative-edge, firing on the 1 to 0 transition.",
      explainHI: "Edge triangle एक dynamic (edge-triggered) input दिखाता है; एक inversion bubble जोड़ना उसे negative-edge बना देता है, जो 1 से 0 transition पर fire करता है।"
    },
    {
      questionEN: "A master-slave flip-flop emulates an edge by...",
      questionHI: "Master-slave flip-flop एक edge की नक़ल कैसे करता है...",
      options: [
        "using two latches clocked on opposite phases so they are never transparent together",
        "using two independent clocks running at different speeds",
        "removing the clock entirely and reacting to data",
        "adding an OR gate across the two data inputs"
      ],
      answerIndex: 0,
      explainEN: "The master is transparent while the clock is high and the slave while it is low; because they are never open at once (phase isolation), data reaches the output at a single edge and the feedback race is broken.",
      explainHI: "Master clock के high रहते transparent है और slave low रहते; चूँकि वे कभी एक साथ खुले नहीं होते (phase isolation), data एक अकेले edge पर output तक पहुँचता है और feedback race टूट जाती है।"
    },
    {
      questionEN: "Which input combination is forbidden on an SR flip-flop?",
      questionHI: "SR flip-flop पर कौन सा input combination forbidden है?",
      options: ["S = 1, R = 1", "S = 0, R = 0", "S = 1, R = 0", "S = 0, R = 1"],
      answerIndex: 0,
      explainEN: "S = R = 1 commands set and reset at once - a contradiction (Q told to be both 1 and 0) - so the constraint S.R = 0 forbids it.",
      explainHI: "S = R = 1 एक साथ set और reset का आदेश देता है - एक विरोधाभास (Q से 1 भी और 0 भी कहना) - तो शर्त S.R = 0 इसे मना करती है।"
    },
    {
      questionEN: "On a JK flip-flop, holding J = K = 1 makes the output...",
      questionHI: "JK flip-flop पर J = K = 1 रखने से output...",
      options: ["toggle to its complement (Q to Q') on each edge", "hold its current value", "reset to 0", "enter a forbidden state"],
      answerIndex: 0,
      explainEN: "JK defines the old forbidden 11 as a toggle: Q(t+1) = Q'. This is the operation that makes counters and dividers possible, and it is why JK fixes SR.",
      explainHI: "JK पुराने forbidden 11 को toggle के रूप में परिभाषित करता है: Q(t+1) = Q'। यही operation counters और dividers को संभव बनाता है, और इसीलिए JK, SR को सुधारता है।"
    },
    {
      questionEN: "The T flip-flop's characteristic equation and headline use are:",
      questionHI: "T flip-flop का characteristic equation और मुख्य उपयोग हैं:",
      options: [
        "Q(t+1) = T XOR Q; held at T = 1 it divides clock frequency by two for counters",
        "Q(t+1) = T; it is used mainly as RAM storage",
        "Q(t+1) = T'.Q; it is used mainly for debouncing",
        "Q(t+1) = T + Q; it is used mainly inside adders"
      ],
      answerIndex: 0,
      explainEN: "T=0 holds and T=1 toggles, so a stage tied to T=1 flips once per clock - a divide-by-two, the counting cell of binary counters.",
      explainHI: "T=0 hold और T=1 toggle करता है, तो T=1 पर बँधा stage हर clock एक बार पलटता है - एक divide-by-two, binary counters की counting cell।"
    },
    {
      questionEN: "To convert a JK flip-flop into a D flip-flop, you wire:",
      questionHI: "JK flip-flop को D flip-flop में बदलने के लिए आप wire करते हैं:",
      options: ["J = D and K = D'", "J = K = D", "J = D' and K = D", "J = D and K = D"],
      answerIndex: 0,
      explainEN: "With J = D, K = D', the JK equation gives J.Q' + K'.Q = D.Q' + D.Q = D = Q(t+1), exactly a D flip-flop.",
      explainHI: "J = D, K = D' के साथ, JK equation देता है J.Q' + K'.Q = D.Q' + D.Q = D = Q(t+1), ठीक एक D flip-flop।"
    }
  ]
};
