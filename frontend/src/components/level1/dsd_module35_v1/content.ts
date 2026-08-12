import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/35 - Asynchronous (Ripple) Counters, "The Domino Chain Counter"
 * (Sequential Logic track). A ripple counter is the simplest possible binary
 * counter: only the first flip-flop (the LSB, FF0) is wired to the external
 * clock. Every following stage is clocked by the previous flip-flop's output
 * (Q or Q̄), so the counting trigger "ripples" down the chain one flip-flop
 * delay at a time - the stages never change together. Every flip-flop is a JK
 * in toggle mode (J = K = 1). Central analogy: a row of dominoes, where each
 * one topples the next after a fixed delay, so the last falls only after N
 * delays - exactly the ripple counter's t_pd_total = N × t_pd_FF. The chain is
 * cheap (no next-state logic, fewest gates) but slow and glitchy: decoding the
 * outputs mid-ripple reads transient wrong values (011 → 010 → 000 → 100).
 * A master matrix (NGT/PGT × up/down → feed Q or Q̄) and a 2:1-MUX steering
 * signal Clock_next = M̄·Q + M·Q̄ make it count up, down, or either on demand.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Asynchronous (Ripple) Counters - The Domino Chain",
  moduleSubtitle: "Only the first flip-flop hears the clock; each stage then clocks the next, so the count ripples down the chain one flip-flop delay at a time.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The Domino Chain Counter",
      kind: "cover",
      subtitle: "One clock in, a chain of toggling flip-flops, and a count that ripples down like falling dominoes.",
      theoryEN: [
        "A counter is a register that walks through a fixed sequence of binary values, one step per clock pulse. This module builds the simplest kind of all: the asynchronous or ripple counter, made from nothing but toggle flip-flops wired nose to tail.",
        "Here is the one picture to hold: a row of dominoes. Only the first domino gets pushed by hand (the external clock). Each falling domino knocks over the next, so the topple travels down the line one delay at a time - the whole row is never down at the same instant.",
        "Every flip-flop is a JK held in toggle mode with J = K = 1, so it flips its output on each clock edge it receives. Only FF0, the least-significant bit, is driven by the real clock; every later stage is clocked by the flip-flop before it.",
        "Because the trigger has to walk from stage to stage, a ripple counter is cheap (no extra gates) but slow, and it shows brief wrong values while the ripple is still travelling. Those two facts - simple but slow-and-glitchy - are the whole story.",
        "By the end you will read the master up/down configuration matrix, build a 3-bit ripple up counter by hand, compute its worst-case delay and top speed, watch the decoding glitch appear, steer it up or down with a single mode bit, and then build one for real on the workbench."
      ],
      theoryHI: [
        "Counter एक register है जो binary values के एक तय क्रम में चलता है, हर clock pulse पर एक कदम। यह module सबसे सरल किस्म बनाता है: asynchronous या ripple counter, जो सिर्फ़ toggle flip-flops को नाक-से-पूँछ जोड़कर बनता है।",
        "एक तस्वीर मन में रखिए: dominoes की एक कतार। सिर्फ़ पहले domino को हाथ से धक्का मिलता है (external clock)। हर गिरता domino अगले को गिराता है, तो गिरना कतार में एक-एक delay करके आगे बढ़ता है - पूरी कतार कभी एक ही पल में नहीं गिरती।",
        "हर flip-flop एक JK है जो toggle mode में J = K = 1 पर रखा है, तो हर मिलने वाले clock edge पर अपना output पलटता है। सिर्फ़ FF0, यानी least-significant bit, असली clock से चलता है; हर बाद का stage उससे पहले वाले flip-flop से clock पाता है।",
        "चूँकि trigger को stage-दर-stage चलना पड़ता है, ripple counter सस्ता है (कोई अतिरिक्त gates नहीं) पर धीमा, और जब तक ripple चल रहा होता है यह थोड़ी देर के लिए ग़लत मान दिखाता है। यही दो तथ्य - सरल पर धीमा-और-glitchy - पूरी कहानी हैं।",
        "अंत तक आप master up/down configuration matrix पढ़ेंगे, हाथ से एक 3-bit ripple up counter बनाएँगे, इसका worst-case delay और top speed निकालेंगे, decoding glitch को उभरते देखेंगे, एक mode bit से इसे up या down steer करेंगे, और फिर workbench पर असली में एक बनाएँगे।"
      ],
      transcriptEN: "Welcome to the domino chain counter. Picture a row of dominoes: only the first is pushed by hand - that is the external clock - and each falling domino knocks over the next, so the topple ripples down the line one delay at a time. That is an asynchronous, or ripple, counter. It is built from JK flip-flops all held in toggle mode with J and K tied to one, so each flip-flop flips on every clock edge it receives. Only the least-significant flip-flop hears the real clock; every later stage is clocked by the output of the stage before it. This makes the counter dead simple and cheap, but slow, because the trigger must walk from stage to stage - and it flashes brief wrong values while the ripple is still travelling. By the end you will read the up-down configuration matrix, build a three-bit ripple counter, compute its delay and top speed, see the decoding glitch, steer it up or down, and build one for real.",
      transcriptHI: "Domino chain counter में आपका स्वागत है। dominoes की एक कतार सोचिए: सिर्फ़ पहला हाथ से धकेला जाता है - वही external clock है - और हर गिरता domino अगले को गिराता है, तो गिरना कतार में एक-एक delay करके नीचे ripple करता है। यही asynchronous, या ripple, counter है। यह JK flip-flops से बनता है जो सब toggle mode में J और K को एक से बाँधकर रखे हैं, तो हर flip-flop हर मिलने वाले clock edge पर पलटता है। सिर्फ़ least-significant flip-flop असली clock सुनता है; हर बाद का stage अपने से पहले stage के output से clock पाता है। इससे counter बेहद सरल और सस्ता बनता है, पर धीमा, क्योंकि trigger को stage-दर-stage चलना पड़ता है - और जब तक ripple चल रहा है यह थोड़ी देर के लिए ग़लत मान दिखाता है। अंत तक आप up-down configuration matrix पढ़ेंगे, एक three-bit ripple counter बनाएँगे, इसका delay और top speed निकालेंगे, decoding glitch देखेंगे, इसे up या down steer करेंगे, और असली में एक बनाएँगे।",
      visualNote: "Hero: a live 3-bit ripple counter (CounterViz mode=ripple) whose bits flip one after another with a staggered delay, exactly like dominoes toppling."
    },
    {
      id: "S01_Video",
      label: "Ripple Counters, The Chain Reaction",
      kind: "video",
      subtitle: "A short film: how one clock pulse ripples through a chain of toggle flip-flops.",
      theoryEN: [
        "Here is the whole idea in one breath before you watch. A ripple counter is a line of toggle flip-flops. You clock only the first one; each flip-flop then clocks the next, so a single trigger races down the chain and the binary count advances by one.",
        "Each stage is a JK flip-flop with J = K = 1, which is toggle mode: on every active clock edge it receives, its output Q simply flips. A stage that flips its output at half the rate of the stage below it is exactly what a binary count needs - each bit runs at half the frequency of the one to its right.",
        "The word asynchronous is the key. The stages do NOT all move on the same clock edge. FF0 flips first, and only when its output makes the right transition does FF1 see an edge and flip, and so on up the chain. The change ripples, it does not happen all at once.",
        "That ripple is both the charm and the flaw. There is no next-state logic to design - you just chain toggles - so the circuit is the cheapest counter you can build. But the trigger takes time to walk the chain, so a wide counter is slow, and mid-ripple the outputs briefly spell out wrong numbers.",
        "Keep one running example in mind for the whole module: a 3-bit ripple up counter with bits Q2 Q1 Q0. FF0 is clocked by CLK, FF1 by Q0, FF2 by Q1, and all three are toggles. It counts 000, 001, 010, 011, 100, 101, 110, 111, and then wraps back to 000."
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार एक साँस में। Ripple counter toggle flip-flops की एक कतार है। आप सिर्फ़ पहले को clock करते हैं; फिर हर flip-flop अगले को clock करता है, तो एक अकेला trigger कतार में दौड़ता है और binary count एक से आगे बढ़ता है।",
        "हर stage एक JK flip-flop है जिसमें J = K = 1, यानी toggle mode: हर मिलने वाले active clock edge पर इसका output Q बस पलटता है। एक stage जो अपने नीचे वाले stage की आधी दर पर पलटता है, ठीक वही है जो binary count को चाहिए - हर bit अपने दाईं ओर वाले की आधी frequency पर चलता है।",
        "शब्द asynchronous ही कुंजी है। stages सब एक ही clock edge पर नहीं चलते। FF0 पहले पलटता है, और तभी जब उसका output सही transition करता है तो FF1 को edge दिखता है और वह पलटता है, और ऐसे ही कतार में ऊपर। बदलाव ripple करता है, एक साथ नहीं होता।",
        "वही ripple इसका आकर्षण भी है और दोष भी। design करने को कोई next-state logic नहीं - आप बस toggles जोड़ते हैं - तो यह सबसे सस्ता counter है जो आप बना सकते हैं। पर trigger को कतार चलने में समय लगता है, तो चौड़ा counter धीमा होता है, और ripple के बीच outputs थोड़ी देर ग़लत संख्याएँ बोलते हैं।",
        "पूरे module के लिए एक उदाहरण मन में रखिए: एक 3-bit ripple up counter जिसके bits Q2 Q1 Q0 हैं। FF0 को CLK clock करता है, FF1 को Q0, FF2 को Q1, और तीनों toggles हैं। यह 000, 001, 010, 011, 100, 101, 110, 111 गिनता है, और फिर वापस 000 पर wrap करता है।"
      ],
      transcriptEN: "Here's the whole idea in one breath. A ripple counter is a line of toggle flip-flops. You clock only the first one; each flip-flop then clocks the next, so a single trigger races down the chain and the binary count advances by one. Every stage is a JK flip-flop with J and K tied to one - toggle mode - so on each active clock edge it receives, its output just flips. A stage that flips at half the rate of the one below it is exactly what binary counting needs: each bit runs at half the frequency of the bit to its right. The word asynchronous is the key: the stages do not all move on the same edge. FF0 flips first, and only when its output makes the right transition does FF1 see an edge and flip, and so on up the chain. The change ripples; it does not happen all at once. That ripple is both the charm and the flaw - there's no next-state logic to design, so it's the cheapest counter you can build, but the trigger takes time to walk the chain, so a wide counter is slow and briefly shows wrong values mid-ripple. Keep one example in mind: a three-bit ripple up counter, FF0 clocked by CLK, FF1 by Q0, FF2 by Q1, counting zero through seven and wrapping.",
      transcriptHI: "पूरा विचार एक साँस में। Ripple counter toggle flip-flops की एक कतार है। आप सिर्फ़ पहले को clock करते हैं; फिर हर flip-flop अगले को clock करता है, तो एक अकेला trigger कतार में दौड़ता है और binary count एक से आगे बढ़ता है। हर stage एक JK flip-flop है जिसमें J और K एक से बँधे हैं - toggle mode - तो हर मिलने वाले active clock edge पर इसका output बस पलटता है। एक stage जो अपने नीचे वाले की आधी दर पर पलटता है, ठीक वही है जो binary counting को चाहिए: हर bit अपने दाईं ओर वाले bit की आधी frequency पर चलता है। शब्द asynchronous कुंजी है: stages सब एक ही edge पर नहीं चलते। FF0 पहले पलटता है, और तभी जब उसका output सही transition करता है तो FF1 को edge दिखता है और वह पलटता है, और ऐसे ही ऊपर। बदलाव ripple करता है; एक साथ नहीं होता। वही ripple आकर्षण भी है और दोष भी - design करने को कोई next-state logic नहीं, तो यह सबसे सस्ता counter है, पर trigger को कतार चलने में समय लगता है, तो चौड़ा counter धीमा है और ripple के बीच थोड़ी देर ग़लत मान दिखाता है। एक उदाहरण मन में रखिए: एक three-bit ripple up counter, FF0 को CLK, FF1 को Q0, FF2 को Q1 clock करते हैं, zero से seven तक गिनते और wrap करते।",
      visualNote: "Animated explainer: three JK flip-flops in a row, a clock edge hitting FF0, then Q0's edge triggering FF1, then Q1's edge triggering FF2 - the trigger visibly rippling down the chain."
    },
    {
      id: "S02_Facts",
      label: "What Makes A Counter Asynchronous",
      kind: "theory",
      subtitle: "Only FF0 gets the clock; every later stage is clocked by the flip-flop before it.",
      theoryEN: [
        "Let us pin down exactly what makes a counter asynchronous, because the word is doing all the work. In a synchronous counter, every flip-flop shares one common clock and they all update on the same edge together. In an asynchronous - or ripple - counter, they do not: only the first flip-flop, FF0, is connected to the external clock, and each later stage takes its clock from the output of the stage before it.",
        "Because of that wiring, a clock edge does not reach all the flip-flops at once. It reaches FF0, FF0 responds, and only that response can trigger FF1; FF1's response can then trigger FF2, and so on. The trigger therefore ripples from the least-significant bit up toward the most-significant bit, which is exactly why the circuit is named a ripple counter. The stages never change simultaneously - each one waits for the one below it.",
        "Every flip-flop in the chain is a JK flip-flop wired in toggle mode, which simply means J and K are both tied to logic 1. With J = K = 1 the JK characteristic equation Q(t+1) = J·Q̄ + K̄·Q collapses to Q(t+1) = Q̄, so the output flips - toggles - on every active clock edge the flip-flop actually receives. No data input, no steering logic: each stage is a pure divide-by-two.",
        "That divide-by-two behaviour is the whole trick of binary counting. FF0 toggles once per external clock, so Q0 runs at half the clock frequency. FF1 toggles once per two of FF0's toggles, so Q1 runs at a quarter. FF2 at an eighth. Reading Q2 Q1 Q0 as a binary number, the chain of halvings spells out 0, 1, 2, 3, 4, 5, 6, 7 - a binary up count - all by itself.",
        "So the definition is compact: chain toggle flip-flops, clock only the first, and let each stage clock the next from its own output. There is no next-state logic to derive and no shared clock tree to route - which is why the ripple counter is the least-hardware counter that exists, and the natural first counter to learn."
      ],
      theoryHI: [
        "चलिए ठीक-ठीक तय करें कि किसी counter को asynchronous क्या बनाता है, क्योंकि पूरा काम यही शब्द कर रहा है। एक synchronous counter में हर flip-flop एक साझा clock बाँटता है और सब एक ही edge पर एक साथ update होते हैं। एक asynchronous - या ripple - counter में ऐसा नहीं: सिर्फ़ पहला flip-flop, FF0, external clock से जुड़ा है, और हर बाद का stage अपना clock अपने से पहले stage के output से लेता है।",
        "उस wiring की वजह से, एक clock edge सभी flip-flops तक एक साथ नहीं पहुँचता। यह FF0 तक पहुँचता है, FF0 प्रतिक्रिया देता है, और सिर्फ़ वही प्रतिक्रिया FF1 को trigger कर सकती है; फिर FF1 की प्रतिक्रिया FF2 को trigger कर सकती है, और ऐसे ही। इसलिए trigger least-significant bit से most-significant bit की ओर ripple करता है, और ठीक इसीलिए circuit का नाम ripple counter है। stages कभी एक साथ नहीं बदलते - हर एक अपने नीचे वाले का इंतज़ार करता है।",
        "कतार का हर flip-flop एक JK flip-flop है जो toggle mode में wired है, यानी बस J और K दोनों logic 1 से बँधे हैं। J = K = 1 पर JK का characteristic equation Q(t+1) = J·Q̄ + K̄·Q सिमटकर Q(t+1) = Q̄ बन जाता है, तो output हर सच में मिलने वाले active clock edge पर पलटता - toggle करता - है। न कोई data input, न steering logic: हर stage एक शुद्ध divide-by-two है।",
        "वही divide-by-two बर्ताव binary counting की पूरी चाल है। FF0 हर external clock पर एक बार toggle करता है, तो Q0 clock की आधी frequency पर चलता है। FF1, FF0 के हर दो toggles पर एक बार toggle करता है, तो Q1 चौथाई पर चलता है। FF2 आठवें पर। Q2 Q1 Q0 को एक binary संख्या की तरह पढ़िए, और halvings की यह कतार अपने आप 0, 1, 2, 3, 4, 5, 6, 7 बोलती है - एक binary up count।",
        "तो परिभाषा संक्षिप्त है: toggle flip-flops जोड़िए, सिर्फ़ पहले को clock कीजिए, और हर stage को अगले को अपने output से clock करने दीजिए। न कोई next-state logic निकालनी है और न कोई साझा clock tree route करना है - इसीलिए ripple counter सबसे कम-hardware वाला counter है जो मौजूद है, और सीखने के लिए स्वाभाविक पहला counter।"
      ],
      transcriptEN: "What makes a counter asynchronous is the clock wiring. In a synchronous counter all flip-flops share one clock and update together. In a ripple counter only FF0 sees the external clock; each later stage takes its clock from the previous stage's output, so the trigger ripples from the LSB up to the MSB and the stages never change at the same instant. Every flip-flop is a JK in toggle mode, J equals K equals one, which makes Q-next equal Q-bar - the output flips on each edge it receives. That divide-by-two is binary counting: FF0 runs at half the clock, FF1 at a quarter, FF2 at an eighth, and reading the outputs as a binary number counts zero through seven. There's no next-state logic to derive, which is why the ripple counter is the cheapest counter there is.",
      transcriptHI: "किसी counter को asynchronous उसकी clock wiring बनाती है। synchronous counter में सब flip-flops एक clock बाँटते हैं और एक साथ update होते हैं। ripple counter में सिर्फ़ FF0 external clock देखता है; हर बाद का stage अपना clock पिछले stage के output से लेता है, तो trigger LSB से MSB तक ripple करता है और stages कभी एक ही पल में नहीं बदलते। हर flip-flop toggle mode में एक JK है, J बराबर K बराबर एक, जो Q-next को Q-bar बनाता है - output हर मिलने वाले edge पर पलटता है। वही divide-by-two binary counting है: FF0 clock की आधी पर चलता है, FF1 चौथाई पर, FF2 आठवें पर, और outputs को binary संख्या पढ़ना zero से seven गिनता है। design करने को कोई next-state logic नहीं, इसीलिए ripple counter सबसे सस्ता counter है।",
      visualNote: "Bespoke cascaded-JK schematic: three JK boxes with J=K=1 tied high, FF0's clock from CLK, FF1's from Q0, FF2's from Q1; the clock line that just fired each stage lights up as the count advances."
    },
    {
      id: "S03_UpDown",
      label: "The Up/Down Configuration Matrix",
      kind: "theory",
      subtitle: "Neg- or pos-edge triggered, up or down - four wirings, decided by whether you feed Q or Q̄.",
      theoryEN: [
        "The single fact that decides how a ripple counter counts is this: which signal from each stage you feed into the next stage's clock. You have two choices - the true output Q or its complement Q̄ - and combined with the flip-flop's edge type they give the four standard wirings you must be able to recall.",
        "Start from what a stage needs. For an up counter, the next stage must toggle exactly when the current stage rolls over from 1 back to 0 - that is, on the current Q's falling edge (1 → 0). For a down counter, the next stage must toggle when the current stage goes from 0 up to 1 - the current Q's rising edge (0 → 1). That required moment is fixed by the direction alone.",
        "Now match it to the flip-flop. A negative-edge-triggered (NGT) flip-flop fires on a falling clock edge; a positive-edge-triggered (PGT) one fires on a rising edge. To make the stage fire at the required moment you simply pick the feed whose own edge lands there. If feeding Q gives the wrong edge, feeding Q̄ inverts it and gives the right one - that is the entire decision.",
        "Work the four cases and the master matrix falls out. NGT + up: fire on Q's fall, feed Q. NGT + down: fire on Q's rise, but NGT wants a fall, so feed Q̄. PGT + up: fire on Q's fall, but PGT wants a rise, so feed Q̄. PGT + down: fire on Q's rise, feed Q. Two cells take Q, two take Q̄ - and they sit on the diagonals of the table.",
        "The counts themselves are just binary. A 3-bit up counter walks 000 → 001 → 010 → 011 → 100 → 101 → 110 → 111 and wraps to 000; a 3-bit down counter walks 111 → 110 → 101 → 100 → 011 → 010 → 001 → 000 and wraps to 111. Same three toggle flip-flops, same chain - only the choice of Q versus Q̄ reverses the direction."
      ],
      theoryHI: [
        "एक ripple counter कैसे गिनता है यह तय करने वाला अकेला तथ्य यह है: हर stage से कौन सा signal आप अगले stage के clock में देते हैं। आपके पास दो विकल्प हैं - असली output Q या इसका complement Q̄ - और flip-flop के edge type के साथ मिलकर ये चार मानक wirings देते हैं जो आपको याद रहनी चाहिए।",
        "stage को क्या चाहिए, वहाँ से शुरू कीजिए। up counter के लिए, अगला stage ठीक तब toggle करे जब मौजूदा stage 1 से वापस 0 पर roll-over करे - यानी मौजूदा Q के falling edge (1 → 0) पर। down counter के लिए, अगला stage तब toggle करे जब मौजूदा stage 0 से 1 पर जाए - मौजूदा Q के rising edge (0 → 1) पर। वह ज़रूरी पल अकेले direction से तय होता है।",
        "अब इसे flip-flop से मिलाइए। negative-edge-triggered (NGT) flip-flop falling clock edge पर fire करता है; positive-edge-triggered (PGT) rising edge पर। stage को ज़रूरी पल पर fire कराने के लिए आप बस वह feed चुनिए जिसका अपना edge वहीं गिरे। अगर Q देना ग़लत edge देता है, तो Q̄ देना उसे उलट देता है और सही देता है - यही पूरा निर्णय है।",
        "चारों cases चलाइए और master matrix निकल आता है। NGT + up: Q के fall पर fire, Q दीजिए। NGT + down: Q के rise पर fire, पर NGT को fall चाहिए, तो Q̄ दीजिए। PGT + up: Q के fall पर fire, पर PGT को rise चाहिए, तो Q̄ दीजिए। PGT + down: Q के rise पर fire, Q दीजिए। दो cells Q लेते हैं, दो Q̄ - और वे table के diagonals पर बैठते हैं।",
        "counts ख़ुद बस binary हैं। एक 3-bit up counter 000 → 001 → 010 → 011 → 100 → 101 → 110 → 111 चलता है और 000 पर wrap करता है; एक 3-bit down counter 111 → 110 → 101 → 100 → 011 → 010 → 001 → 000 चलता है और 111 पर wrap करता है। वही तीन toggle flip-flops, वही chain - सिर्फ़ Q बनाम Q̄ का चुनाव direction उलट देता है।"
      ],
      transcriptEN: "How a ripple counter counts is decided by one wiring choice: whether each stage feeds its true output Q or its complement Q-bar into the next stage's clock. For an up counter the next stage must toggle when the current Q falls from one to zero; for a down counter, when it rises from zero to one. A negative-edge flip-flop fires on a falling edge, a positive-edge flip-flop on a rising edge, so you pick the feed whose edge lands at the required moment - and if Q gives the wrong edge, Q-bar inverts it. Working the four cases gives the master matrix: NGT up feeds Q, NGT down feeds Q-bar, PGT up feeds Q-bar, PGT down feeds Q. Two cells take Q, two take Q-bar, on the diagonals. The counts are plain binary: up walks zero to seven, down walks seven to zero, same chain, only the feed reversed.",
      transcriptHI: "ripple counter कैसे गिनता है यह एक wiring चुनाव से तय होता है: हर stage अपना असली output Q देता है या अपना complement Q-bar, अगले stage के clock में। up counter के लिए अगला stage तब toggle करे जब मौजूदा Q एक से शून्य पर गिरे; down के लिए जब वह शून्य से एक पर चढ़े। negative-edge flip-flop falling edge पर fire करता है, positive-edge rising पर, तो आप वह feed चुनिए जिसका edge ज़रूरी पल पर गिरे - और अगर Q ग़लत edge देता है तो Q-bar उसे उलट देता है। चारों cases चलाने से master matrix मिलता है: NGT up में Q, NGT down में Q-bar, PGT up में Q-bar, PGT down में Q। दो cells Q, दो Q-bar, diagonals पर। counts सादा binary हैं: up zero से seven, down seven से zero, वही chain, सिर्फ़ feed उलटा।",
      visualNote: "The NGT/PGT × up/down matrix rebuilt by code from the edge-matching rule, plus a 3-bit up sequence 000→111 and down sequence 111→000 generated by iteration."
    },
    {
      id: "S04_Build3bit",
      label: "Build A 3-Bit Ripple Up Counter",
      kind: "theory",
      subtitle: "FF0 on CLK, Q0 → CLK1, Q1 → CLK2, all three in toggle mode - a MOD-8 up counter.",
      theoryEN: [
        "Now put the pieces together into the counter you will meet most often: a 3-bit ripple up counter, which cycles through eight states and is therefore a MOD-8 counter. It needs exactly three JK flip-flops, each in toggle mode with J = K = 1, and a handful of wires - no gates at all.",
        "The wiring is the whole design. FF0's clock comes from the external CLK. FF0's output Q0 becomes the clock of FF1. FF1's output Q1 becomes the clock of FF2. The outputs Q2 Q1 Q0 are read as a 3-bit binary number, with Q0 the least-significant bit. That is it - three toggles chained by their outputs.",
        "Assume the flip-flops are negative-edge-triggered, which is the classic ripple up-counter choice: feeding the true Q into the next clock, a stage advances the one above it exactly when its own output falls from 1 to 0. So FF1 toggles each time Q0 completes a full 1 → 0, and FF2 toggles each time Q1 does - the up-count edge-matching from the matrix.",
        "Walk it from reset. Start at 000. First clock: FF0 toggles, Q0 goes 0 → 1, state 001; Q0 rose, not fell, so FF1 stays. Second clock: Q0 goes 1 → 0 (state momentarily has Q0 = 0), and that fall clocks FF1, which toggles Q1 to 1 - state 010. Continue and you generate 000, 001, 010, 011, 100, 101, 110, 111, then 000 again.",
        "Notice the rhythm in the generated sequence: Q0 flips every clock, Q1 flips every second clock, Q2 flips every fourth. That is the divide-by-two cascade doing binary counting for free. Change the flip-flops to feed Q̄ instead and the very same three-stage chain counts 111 down to 000 - one wire choice flips the whole direction."
      ],
      theoryHI: [
        "अब टुकड़ों को उस counter में जोड़िए जिससे आप सबसे ज़्यादा मिलेंगे: एक 3-bit ripple up counter, जो आठ states में घूमता है और इसलिए एक MOD-8 counter है। इसे ठीक तीन JK flip-flops चाहिए, हर एक toggle mode में J = K = 1 पर, और कुछ wires - कोई gate नहीं।",
        "wiring ही पूरा design है। FF0 का clock external CLK से आता है। FF0 का output Q0 FF1 का clock बनता है। FF1 का output Q1 FF2 का clock बनता है। outputs Q2 Q1 Q0 को एक 3-bit binary संख्या की तरह पढ़ा जाता है, जिसमें Q0 least-significant bit है। बस इतना ही - तीन toggles अपने outputs से जुड़े।",
        "मान लीजिए flip-flops negative-edge-triggered हैं, जो classic ripple up-counter का चुनाव है: असली Q को अगले clock में देते हुए, एक stage अपने ऊपर वाले को ठीक तब आगे बढ़ाता है जब उसका अपना output 1 से 0 पर गिरे। तो FF1 हर बार toggle करता है जब Q0 एक पूरा 1 → 0 पूरा करे, और FF2 हर बार जब Q1 करे - matrix वाला up-count edge-matching।",
        "reset से चलाइए। 000 से शुरू। पहला clock: FF0 toggle करता है, Q0 0 → 1 जाता है, state 001; Q0 चढ़ा, गिरा नहीं, तो FF1 वैसा ही। दूसरा clock: Q0 1 → 0 जाता है (state में पल भर Q0 = 0), और वह fall FF1 को clock करता है, जो Q1 को 1 पर toggle करता है - state 010। जारी रखिए और आप 000, 001, 010, 011, 100, 101, 110, 111, फिर वापस 000 बनाते हैं।",
        "बनाए क्रम में लय पर ग़ौर कीजिए: Q0 हर clock पलटता है, Q1 हर दूसरे clock, Q2 हर चौथे। वही divide-by-two cascade मुफ़्त में binary counting कर रहा है। flip-flops को बदलकर Q̄ देने पर वही तीन-stage chain 111 से 000 तक गिनता है - एक wire का चुनाव पूरी direction पलट देता है।"
      ],
      transcriptEN: "Put the pieces together into a three-bit ripple up counter - eight states, so a MOD-8 counter. It needs three JK flip-flops, each in toggle mode with J and K at one, and just wires, no gates. FF0's clock is the external CLK, Q0 is FF1's clock, and Q1 is FF2's clock; read Q2 Q1 Q0 as a binary number with Q0 the LSB. Take the flip-flops as negative-edge-triggered and feed the true Q, the classic up-counter wiring: each stage advances the one above it when its own output falls from one to zero. Walk it from 000: first clock, Q0 goes to one, state 001; second clock, Q0 falls to zero and clocks FF1, which toggles Q1, state 010; continue and you generate zero through seven, then wrap. Q0 flips every clock, Q1 every second, Q2 every fourth - the divide-by-two cascade counting in binary. Feed Q-bar instead and the same chain counts down.",
      transcriptHI: "टुकड़ों को एक three-bit ripple up counter में जोड़िए - आठ states, तो MOD-8 counter। इसे तीन JK flip-flops चाहिए, हर एक toggle mode में J और K एक पर, और बस wires, कोई gate नहीं। FF0 का clock external CLK है, Q0 FF1 का clock है, और Q1 FF2 का clock; Q2 Q1 Q0 को binary संख्या पढ़िए जिसमें Q0 LSB है। flip-flops को negative-edge-triggered लीजिए और असली Q दीजिए, classic up-counter wiring: हर stage अपने ऊपर वाले को तब आगे बढ़ाता है जब उसका output एक से शून्य पर गिरे। 000 से चलाइए: पहला clock, Q0 एक पर, state 001; दूसरा clock, Q0 शून्य पर गिरता है और FF1 को clock करता है, जो Q1 toggle करता है, state 010; जारी रखिए और zero से seven बनता है, फिर wrap। Q0 हर clock पलटता है, Q1 हर दूसरे, Q2 हर चौथे - divide-by-two cascade binary में गिनता। Q-bar दीजिए और वही chain नीचे गिनता है।",
      visualNote: "Bespoke 3-FF schematic (FF0←CLK, FF1←Q0, FF2←Q1, all J=K=1) driven live, a CounterViz mode=ripple, and the full 000→111 count sequence generated by iterating."
    },
    {
      id: "S05_RippleDelay",
      label: "The Price: Ripple Delay & Top Speed",
      kind: "theory",
      subtitle: "t_pd(total) = N × t_pd(FF), so f_max ≤ 1 / (N × t_pd(FF)) - a bigger counter is a slower one.",
      theoryEN: [
        "The ripple counter buys its simplicity with speed, and this scene puts a number on the cost. Because a clock edge has to walk from stage to stage, the flip-flops do not settle together - each one waits for the propagation delay of the one below it before it can even begin to change.",
        "Call one flip-flop's propagation delay t_pd(FF). In the worst case a single clock edge has to ripple through all N flip-flops in the chain - this happens at the rollover, like 0111 → 1000, where every bit flips in sequence. The total time for the whole word to settle is therefore t_pd(total) = N × t_pd(FF): the delays simply add, stage after stage.",
        "That settling time sets the fastest clock you may use. You must not send the next clock edge until the previous count has fully rippled and settled, so the clock period T must be at least t_pd(total). Turning that into frequency gives the ceiling f_max ≤ 1 / (N × t_pd(FF)). The more bits you add, the lower that ceiling drops.",
        "Put numbers to it. With t_pd(FF) = 10 ns, a 4-bit counter settles in 4 × 10 = 40 ns, capping the clock at 1/40 ns = 25 MHz. Widen it to an 8-bit counter and the worst-case delay doubles to 80 ns, halving the ceiling to 12.5 MHz. The counter got no faster per stage - you simply strung more delays in a line.",
        "This is the fundamental limitation of ripple counters and the reason synchronous counters exist. In a synchronous design every flip-flop is clocked together, so the settling time is just one t_pd(FF) regardless of width, and the maximum frequency no longer collapses as the counter grows. The ripple counter trades that speed away for its bare-bones simplicity."
      ],
      theoryHI: [
        "ripple counter अपनी सरलता speed देकर ख़रीदता है, और यह scene उस क़ीमत पर एक संख्या रखता है। चूँकि एक clock edge को stage-दर-stage चलना पड़ता है, flip-flops एक साथ settle नहीं होते - हर एक अपने नीचे वाले के propagation delay का इंतज़ार करता है, बदलना शुरू करने से पहले भी।",
        "एक flip-flop के propagation delay को t_pd(FF) कहिए। worst case में एक अकेले clock edge को chain के सभी N flip-flops में ripple करना पड़ता है - यह rollover पर होता है, जैसे 0111 → 1000, जहाँ हर bit क्रम से पलटता है। पूरे word के settle होने का कुल समय इसलिए t_pd(total) = N × t_pd(FF) है: delays बस जुड़ते जाते हैं, stage दर stage।",
        "वही settling time सबसे तेज़ clock तय करता है जो आप वापर सकते हैं। आपको अगला clock edge तब तक नहीं भेजना जब तक पिछली count पूरी तरह ripple होकर settle न हो जाए, तो clock period T कम से कम t_pd(total) होना चाहिए। इसे frequency में बदलने पर ceiling मिलती है f_max ≤ 1 / (N × t_pd(FF))। आप जितने ज़्यादा bits जोड़ेंगे, वह ceiling उतनी नीचे गिरेगी।",
        "इस पर संख्याएँ रखिए। t_pd(FF) = 10 ns के साथ, एक 4-bit counter 4 × 10 = 40 ns में settle होता है, clock को 1/40 ns = 25 MHz पर capping करते। इसे 8-bit counter तक चौड़ा कीजिए और worst-case delay दोगुना होकर 80 ns, ceiling को आधा 12.5 MHz कर देता है। counter per stage तेज़ नहीं हुआ - आपने बस और delays एक कतार में पिरो दिए।",
        "यही ripple counters की मूल सीमा है और synchronous counters के होने की वजह। synchronous design में हर flip-flop एक साथ clock होता है, तो settling time width चाहे कुछ भी हो बस एक t_pd(FF) है, और maximum frequency counter बढ़ने पर ढहती नहीं। ripple counter उस speed को अपनी नंगी सरलता के बदले छोड़ देता है।"
      ],
      transcriptEN: "The ripple counter buys simplicity with speed. Because a clock edge walks from stage to stage, the flip-flops don't settle together; each waits for the propagation delay of the one below it. Call one flip-flop's delay t-pd-FF. In the worst case, at a rollover like 0111 to 1000, the edge ripples through all N flip-flops, so the whole word settles in t-pd-total equals N times t-pd-FF - the delays just add. You can't send the next clock edge until that's finished, so the period must be at least t-pd-total, and the top frequency is f-max at most one over N times t-pd-FF. With ten nanoseconds per flip-flop, a four-bit counter settles in forty nanoseconds and caps at twenty-five megahertz; an eight-bit doubles to eighty nanoseconds and halves to twelve-point-five. Wider means slower. That's why synchronous counters exist: clock every flip-flop together and the settling time is just one t-pd-FF, no matter the width.",
      transcriptHI: "ripple counter सरलता speed देकर ख़रीदता है। चूँकि clock edge stage-दर-stage चलता है, flip-flops एक साथ settle नहीं होते; हर एक अपने नीचे वाले के propagation delay का इंतज़ार करता है। एक flip-flop के delay को t-pd-FF कहिए। worst case में, 0111 से 1000 जैसे rollover पर, edge सभी N flip-flops में ripple करता है, तो पूरा word t-pd-total बराबर N गुणा t-pd-FF में settle होता है - delays बस जुड़ते हैं। आप अगला clock edge तब तक नहीं भेज सकते, तो period कम से कम t-pd-total हो, और top frequency f-max अधिकतम एक बटा N गुणा t-pd-FF है। दस nanosecond प्रति flip-flop पर, चार-bit counter चालीस nanosecond में settle होकर पच्चीस megahertz पर cap होता है; आठ-bit दोगुना अस्सी होकर आधा साढ़े बारह हो जाता है। चौड़ा मतलब धीमा। इसीलिए synchronous counters हैं: हर flip-flop एक साथ clock कीजिए और settling time width चाहे कुछ भी हो बस एक t-pd-FF है।",
      visualNote: "Bespoke staggered stair-step waveform of the 111→000 rollover (each edge offset by t_pd) plus a live calculator: pick N and t_pd(FF), read out t_pd(total) and f_max."
    },
    {
      id: "S06_Glitch",
      label: "The Decoding Glitch",
      kind: "theory",
      subtitle: "Mid-ripple the outputs briefly spell wrong numbers: 011 → 010 → 000 → 100.",
      theoryEN: [
        "The ripple counter's second flaw follows directly from the first. Because the stages change one after another instead of together, there is a short window during every rollover when the output bits show a value the counter was never supposed to visit. This transient is called the decoding glitch, and it is the classic exam trap.",
        "Trace the transition from 3 to 4 in a 3-bit up counter, which as binary is 011 → 100. Ideally the outputs jump straight from three to four. In a ripple counter they cannot: the trigger has to ripple through three stages, and the outputs pass through intermediate combinations on the way, one flip-flop delay apart.",
        "Follow the ripple step by step. The clock edge toggles FF0, so Q0 falls: 011 becomes 010. That fall of Q0 clocks FF1, which toggles Q1 down: 010 becomes 000. That fall of Q1 clocks FF2, which toggles Q2 up: 000 becomes the final 100. So the true path is 011 → 010 → 000 → 100, and the counter momentarily displays 2 and then 0 before landing on 4.",
        "For the counter's own operation those flickers are harmless - by the next clock everything has settled to the correct value. The danger is any circuit that decodes the outputs while the ripple is still travelling. A decoder watching for the value 0, for instance, would fire a false pulse during that 000 flicker, even though the counter never truly rested at 0.",
        "This is exactly why you must not decode a ripple counter's outputs combinationally at full speed, and why glitch-sensitive designs reach for synchronous counters instead. In a synchronous counter all bits change on the same edge, so the outputs step cleanly from 011 to 100 with no illegal in-between states to decode by mistake."
      ],
      theoryHI: [
        "ripple counter का दूसरा दोष सीधे पहले से निकलता है। चूँकि stages एक साथ नहीं, एक के बाद एक बदलते हैं, हर rollover के दौरान एक छोटा window होता है जब output bits एक ऐसा मान दिखाते हैं जिसे counter को कभी visit नहीं करना था। इस transient को decoding glitch कहते हैं, और यही classic exam trap है।",
        "एक 3-bit up counter में 3 से 4 का transition trace कीजिए, जो binary में 011 → 100 है। आदर्श रूप से outputs सीधे तीन से चार पर कूदें। ripple counter में वे नहीं कूद सकते: trigger को तीन stages में ripple करना पड़ता है, और outputs रास्ते में बीच के combinations से गुज़रते हैं, एक-एक flip-flop delay की दूरी पर।",
        "ripple को कदम-दर-कदम follow कीजिए। clock edge FF0 को toggle करता है, तो Q0 गिरता है: 011 बनता है 010। Q0 का वह गिरना FF1 को clock करता है, जो Q1 को नीचे toggle करता है: 010 बनता है 000। Q1 का वह गिरना FF2 को clock करता है, जो Q2 को ऊपर toggle करता है: 000 बनता है अंतिम 100। तो सच्चा रास्ता 011 → 010 → 000 → 100 है, और counter पल भर के लिए 2 और फिर 0 दिखाता है, 4 पर उतरने से पहले।",
        "counter के अपने operation के लिए ये झिलमिलाहट हानिरहित हैं - अगले clock तक सब सही मान पर settle हो चुका होता है। ख़तरा कोई भी ऐसा circuit है जो outputs को तब decode करे जब ripple अभी चल रहा हो। मान 0 ताकने वाला एक decoder, मिसाल के तौर पर, उस 000 झिलमिलाहट के दौरान एक झूठा pulse fire करेगा, भले ही counter सच में कभी 0 पर टिका ही न हो।",
        "ठीक इसीलिए आपको ripple counter के outputs को पूरी speed पर combinationally decode नहीं करना, और इसीलिए glitch-sensitive designs इसके बजाय synchronous counters उठाते हैं। synchronous counter में सब bits एक ही edge पर बदलते हैं, तो outputs 011 से 100 पर साफ़-साफ़ क़दम रखते हैं, कोई अवैध बीच-की states नहीं जिन्हें ग़लती से decode किया जाए।"
      ],
      transcriptEN: "The ripple counter's second flaw follows from the first. Because the stages change one after another, there's a brief window at every rollover when the outputs spell a value the counter should never show - the decoding glitch. Trace three to four, binary 011 to 100. The trigger toggles FF0 so Q0 falls: 011 becomes 010. That fall clocks FF1, Q1 falls: 010 becomes 000. That fall clocks FF2, Q2 rises: 000 becomes 100. So the real path is 011, 010, 000, 100 - the counter flickers through two then zero before landing on four. For the counter itself that's harmless, it settles by the next clock. The danger is decoding the outputs mid-ripple: a decoder watching for zero would fire a false pulse during that 000 flicker. That's why you don't decode a ripple counter at full speed, and why glitch-sensitive designs use synchronous counters, where all bits change together and step cleanly from 011 to 100.",
      transcriptHI: "ripple counter का दूसरा दोष पहले से निकलता है। चूँकि stages एक के बाद एक बदलते हैं, हर rollover पर एक छोटा window होता है जब outputs एक ऐसा मान बोलते हैं जो counter को कभी नहीं दिखाना था - decoding glitch। तीन से चार trace कीजिए, binary 011 से 100। trigger FF0 को toggle करता है तो Q0 गिरता है: 011 बनता है 010। वह गिरना FF1 को clock करता है, Q1 गिरता है: 010 बनता है 000। वह गिरना FF2 को clock करता है, Q2 चढ़ता है: 000 बनता है 100। तो सच्चा रास्ता 011, 010, 000, 100 है - counter चार पर उतरने से पहले दो फिर शून्य से झिलमिलाता है। counter के लिए यह हानिरहित है, अगले clock तक settle हो जाता है। ख़तरा outputs को ripple के बीच decode करना है: शून्य ताकने वाला decoder उस 000 झिलमिलाहट में झूठा pulse fire करेगा। इसीलिए ripple counter को पूरी speed पर decode नहीं करते, और glitch-sensitive designs synchronous counters वापरते हैं, जहाँ सब bits एक साथ बदलते और 011 से 100 पर साफ़ क़दम रखते हैं।",
      visualNote: "Bespoke glitch tracer: pick a rollover transition, and code generates the true transient path (e.g. 011 → 010 → 000 → 100) marking the intermediate glitch states in a warning colour."
    },
    {
      id: "S07_DualMode",
      label: "One Counter, Both Directions",
      kind: "theory",
      subtitle: "A mode bit M steers each stage: Clock_next = M̄·Q + M·Q̄ - a 2:1 MUX per stage.",
      theoryEN: [
        "The up/down matrix showed that direction is decided by whether a stage feeds Q or Q̄ to the next clock. If you want a counter that can count either way on command, you do not build two counters - you put a switch between the stages that selects Q or Q̄ under the control of a single mode bit M.",
        "That switch is a 2:1 multiplexer, one per inter-stage link. Its two data inputs are the stage's own Q and Q̄; its select line is the mode bit M; its output becomes the clock of the next stage. Written as Boolean logic the steering signal is Clock_next = M̄·Q + M·Q̄, which is precisely the 2-to-1 MUX equation with M choosing between the two feeds.",
        "Read the two settings straight off the equation. When M = 0 the term M̄·Q survives and M·Q̄ dies, so Clock_next = Q - the true output is passed and, for negative-edge flip-flops, the chain counts up. When M = 1 the term M·Q̄ survives, so Clock_next = Q̄ - the complement is passed and the very same chain now counts down.",
        "So a single control line reverses the whole counter. Flip M and every inter-stage MUX simultaneously switches its stage from feeding Q to feeding Q̄, which the matrix tells us flips the counting direction from up to down. Nothing else in the design changes - the flip-flops, their toggle mode, and the chaining all stay exactly as they were.",
        "This is the standard way real up/down ripple counters are drawn, and it is a clean payoff for having learned the matrix: the abstract 'feed Q or Q̄' rule becomes one concrete gate, a MUX, dropped between each pair of stages, driven by one bit you can flip at will."
      ],
      theoryHI: [
        "up/down matrix ने दिखाया कि direction इससे तय होता है कि एक stage अगले clock को Q देता है या Q̄। अगर आपको ऐसा counter चाहिए जो हुक्म पर किसी भी दिशा में गिन सके, तो आप दो counters नहीं बनाते - आप stages के बीच एक switch रखते हैं जो एक अकेले mode bit M के नियंत्रण में Q या Q̄ चुनता है।",
        "वह switch एक 2:1 multiplexer है, हर inter-stage link के लिए एक। इसके दो data inputs stage के अपने Q और Q̄ हैं; इसका select line mode bit M है; इसका output अगले stage का clock बनता है। Boolean logic में steering signal Clock_next = M̄·Q + M·Q̄ है, जो ठीक 2-to-1 MUX का equation है जिसमें M दोनों feeds के बीच चुनता है।",
        "दोनों settings equation से सीधे पढ़िए। जब M = 0 तो term M̄·Q बचता है और M·Q̄ मरता है, तो Clock_next = Q - असली output pass होता है और, negative-edge flip-flops के लिए, chain up गिनता है। जब M = 1 तो term M·Q̄ बचता है, तो Clock_next = Q̄ - complement pass होता है और वही chain अब down गिनता है।",
        "तो एक अकेला control line पूरे counter को उलट देता है। M पलटिए और हर inter-stage MUX एक साथ अपने stage को Q देने से Q̄ देने पर switch कर देता है, जो matrix के अनुसार counting direction को up से down पलटता है। design में और कुछ नहीं बदलता - flip-flops, उनका toggle mode, और chaining सब ठीक वैसे ही रहते हैं।",
        "असली up/down ripple counters इसी मानक तरीक़े से बनाए जाते हैं, और यह matrix सीखने का साफ़ फल है: अमूर्त 'Q या Q̄ दो' नियम एक ठोस gate बन जाता है, एक MUX, हर stage-जोड़ी के बीच रखा, एक bit से चलता जिसे आप जब चाहें पलट सकते हैं।"
      ],
      transcriptEN: "The matrix showed direction is set by whether a stage feeds Q or Q-bar. To count either way on command, don't build two counters - put a switch between the stages that selects Q or Q-bar under a mode bit M. That switch is a two-to-one multiplexer, one per link: data inputs are the stage's Q and Q-bar, the select is M, the output is the next stage's clock. As Boolean logic the steering signal is Clock-next equals M-bar times Q plus M times Q-bar - exactly the two-to-one MUX equation. When M is zero, Clock-next is Q, and for negative-edge flip-flops the chain counts up. When M is one, Clock-next is Q-bar, and the same chain counts down. So one control line reverses the whole counter: flip M and every inter-stage MUX switches from Q to Q-bar, flipping the direction, while the flip-flops and chaining stay the same. That's how real up/down ripple counters are drawn.",
      transcriptHI: "matrix ने दिखाया direction इससे तय होता है कि stage Q देता है या Q-bar। हुक्म पर किसी भी दिशा में गिनने के लिए, दो counters मत बनाइए - stages के बीच एक switch रखिए जो mode bit M के तहत Q या Q-bar चुने। वह switch एक two-to-one multiplexer है, हर link के लिए एक: data inputs stage के Q और Q-bar, select M, output अगले stage का clock। Boolean logic में steering signal Clock-next बराबर M-bar गुणा Q जमा M गुणा Q-bar है - ठीक two-to-one MUX equation। जब M शून्य, Clock-next Q है, और negative-edge flip-flops के लिए chain up गिनता है। जब M एक, Clock-next Q-bar है, और वही chain down गिनता है। तो एक control line पूरे counter को उलट देता है: M पलटिए और हर inter-stage MUX Q से Q-bar पर switch करता है, direction पलटता, जबकि flip-flops और chaining वही रहते हैं। असली up/down ripple counters इसी तरह बनते हैं।",
      visualNote: "Bespoke steering visual: a 2:1 MUX per stage with Q and Q̄ as data, M as select, computing Clock_next = M̄·Q + M·Q̄ live; a mode toggle reverses a running counter up ↔ down."
    },
    {
      id: "S08_Analogy",
      label: "The Falling Dominoes",
      kind: "theory",
      subtitle: "Push the first, and the topple travels down the line one delay at a time.",
      theoryEN: [
        "Everything about a ripple counter is captured by a single household picture: a row of standing dominoes. You push only the first one. It falls into the second, the second into the third, and the topple travels down the whole line - one at a time, never all at once. That travelling wave is the ripple.",
        "Map it onto the circuit and every fact lines up. The push on the first domino is the external clock reaching FF0. Each domino knocking over the next is one flip-flop clocking the stage above it. And the fact that a domino cannot fall until the one before it has struck it is exactly why the stages change in sequence rather than together.",
        "The analogy even carries the timing. Each domino takes a fixed moment to fall and hit its neighbour - that fixed moment is the flip-flop propagation delay t_pd(FF). The last domino in a line of N therefore falls only after N of those moments have passed, which is precisely the counter's worst-case settling time t_pd(total) = N × t_pd(FF).",
        "It even explains the glitch. If you photograph the row halfway through the cascade, some dominoes are down and some are still standing - an arrangement that is neither the fully-standing start nor the fully-fallen end. Read that half-toppled row as a binary number and it is a value the counter never means to rest at: the decoding glitch, frozen in a snapshot.",
        "And it shows the cure. To make all the dominoes fall at the same instant you would need to push every one simultaneously with its own finger, instead of relying on each to knock the next. Giving every flip-flop its own common clock, rather than chaining them, is exactly what a synchronous counter does - and why it has no ripple and no glitch."
      ],
      theoryHI: [
        "ripple counter के बारे में सब कुछ एक घरेलू तस्वीर में क़ैद है: खड़े dominoes की एक कतार। आप सिर्फ़ पहले को धक्का देते हैं। वह दूसरे पर गिरता है, दूसरा तीसरे पर, और गिरना पूरी कतार में चलता है - एक-एक करके, कभी सब एक साथ नहीं। वही चलती लहर ripple है।",
        "इसे circuit पर बैठाइए और हर तथ्य पंक्तिबद्ध हो जाता है। पहले domino पर धक्का external clock का FF0 तक पहुँचना है। हर domino का अगले को गिराना एक flip-flop का अपने ऊपर वाले stage को clock करना है। और यह कि एक domino तब तक नहीं गिर सकता जब तक उससे पहला उससे न टकराए, ठीक यही वजह है कि stages क्रम से बदलते हैं, एक साथ नहीं।",
        "analogy timing भी साथ लाती है। हर domino को गिरने और अपने पड़ोसी से टकराने में एक तय पल लगता है - वह तय पल flip-flop propagation delay t_pd(FF) है। N की कतार का आख़िरी domino इसलिए तभी गिरता है जब उन पलों में से N बीत चुके हों, जो ठीक counter का worst-case settling time t_pd(total) = N × t_pd(FF) है।",
        "यह glitch भी समझाती है। अगर आप कतार को cascade के बीचोबीच photograph करें, कुछ dominoes गिरे और कुछ अब भी खड़े हैं - एक व्यवस्था जो न पूरी-खड़ी शुरुआत है न पूरी-गिरी अंत। उस आधी-गिरी कतार को एक binary संख्या पढ़िए और यह एक ऐसा मान है जिस पर counter कभी टिकना नहीं चाहता: decoding glitch, एक snapshot में जमी।",
        "और यह इलाज भी दिखाती है। सभी dominoes को एक ही पल में गिराने के लिए आपको हर एक को अपनी उँगली से एक साथ धकेलना होगा, यह भरोसे के बजाय कि हर एक अगले को गिराए। हर flip-flop को उसका अपना साझा clock देना, उन्हें chain करने के बजाय, ठीक वही है जो synchronous counter करता है - और इसीलिए इसमें न ripple है न glitch।"
      ],
      transcriptEN: "Everything about a ripple counter is one household picture: a row of dominoes. You push only the first; it falls into the second, the second into the third, and the topple travels down the line one at a time, never all at once - that's the ripple. The push is the external clock reaching FF0; each domino knocking the next is one flip-flop clocking the stage above it; and because a domino can't fall until the one before strikes it, the stages change in sequence, not together. The timing carries too: each domino takes a fixed moment to fall and hit its neighbour, the propagation delay t-pd-FF, so the last of N dominoes falls only after N of those moments - the settling time N times t-pd-FF. It even shows the glitch: photograph the row halfway and some are down, some standing, a pattern that's neither the start nor the end - read as binary, a value the counter never rests at. And the cure: to drop them all at once you'd push each with its own finger instead of chaining - which is exactly a synchronous counter, giving every flip-flop a common clock, with no ripple and no glitch.",
      transcriptHI: "ripple counter के बारे में सब कुछ एक घरेलू तस्वीर है: dominoes की एक कतार। आप सिर्फ़ पहले को धक्का देते हैं; वह दूसरे पर गिरता है, दूसरा तीसरे पर, और गिरना कतार में एक-एक करके चलता है, कभी सब एक साथ नहीं - वही ripple है। धक्का external clock का FF0 तक पहुँचना है; हर domino का अगले को गिराना एक flip-flop का ऊपर वाले stage को clock करना है; और चूँकि domino तब तक नहीं गिर सकता जब तक पहला न टकराए, stages क्रम से बदलते हैं, एक साथ नहीं। timing भी साथ है: हर domino को गिरने और पड़ोसी से टकराने में एक तय पल लगता है, propagation delay t-pd-FF, तो N dominoes का आख़िरी तभी गिरता है जब N पल बीतें - settling time N गुणा t-pd-FF। यह glitch भी दिखाती है: कतार को बीच में photograph कीजिए, कुछ गिरे, कुछ खड़े, एक pattern जो न शुरुआत है न अंत - binary पढ़िए, एक मान जिस पर counter कभी नहीं टिकता। और इलाज: सबको एक साथ गिराने के लिए हर एक को अपनी उँगली से धकेलिए chain के बजाय - जो ठीक synchronous counter है, हर flip-flop को साझा clock देता, न ripple न glitch।",
      visualNote: "Bespoke domino animation: N standing dominoes topple in sequence after a push, each after a fixed delay; readouts tie the last-domino time to N × t_pd and the half-toppled snapshot to the glitch."
    },
    {
      id: "S09_Build",
      label: "Build It On The Workbench",
      kind: "theory",
      subtitle: "Chain three toggle flip-flops and clock the chain by hand.",
      theoryEN: [
        "You now know every part of the ripple counter, so build one for real. On the workbench you will place three JK flip-flops, tie every J and K to logic 1 so each is a pure toggle, and chain them: the external clock into FF0, Q0 into FF1's clock, and Q1 into FF2's clock.",
        "Once it is wired, drive the clock by hand one edge at a time and read Q2 Q1 Q0 as a binary number. Confirm the sequence you derived on paper - 000, 001, 010, 011, 100, 101, 110, 111, then wrapping back to 000 - appears bit for bit as you tick.",
        "Watch the rhythm as you go: Q0 flips on every clock, Q1 on every second clock, Q2 on every fourth. Seeing that divide-by-two cascade produce a binary count with no gates at all is the moment the whole idea clicks into place.",
        "Then push it further. Reverse a feed from Q to Q̄ and confirm the same chain now counts down; slow the clock and watch the outputs ripple stage by stage. Building it with your own hands turns the domino picture into something you have actually clocked."
      ],
      theoryHI: [
        "अब आप ripple counter का हर हिस्सा जानते हैं, तो एक असली में बनाइए। workbench पर आप तीन JK flip-flops रखेंगे, हर J और K को logic 1 से बाँधेंगे ताकि हर एक शुद्ध toggle हो, और उन्हें chain करेंगे: external clock FF0 में, Q0 FF1 के clock में, और Q1 FF2 के clock में।",
        "एक बार wired होने पर, clock को हाथ से एक-एक edge चलाइए और Q2 Q1 Q0 को binary संख्या पढ़िए। जो क्रम आपने काग़ज़ पर निकाला - 000, 001, 010, 011, 100, 101, 110, 111, फिर वापस 000 - पुष्टि कीजिए कि वह हर bit के साथ दिखता है जैसे आप tick करते हैं।",
        "चलते-चलते लय देखिए: Q0 हर clock पर पलटता है, Q1 हर दूसरे clock पर, Q2 हर चौथे पर। उस divide-by-two cascade को बिना किसी gate के binary count बनाते देखना वही पल है जब पूरा विचार जगह पर बैठ जाता है।",
        "फिर इसे और आगे धकेलिए। एक feed को Q से Q̄ पर उलटिए और पुष्टि कीजिए कि वही chain अब down गिनता है; clock धीमा कीजिए और outputs को stage-दर-stage ripple करते देखिए। इसे अपने हाथों से बनाना domino तस्वीर को उस चीज़ में बदल देता है जिसे आपने सच में clock किया है।"
      ],
      transcriptEN: "You know every part now, so build one for real. Place three JK flip-flops, tie every J and K to one so each is a pure toggle, and chain them - the clock into FF0, Q0 into FF1's clock, Q1 into FF2's clock. Drive the clock one edge at a time and read Q2 Q1 Q0 as binary; confirm the sequence you derived, zero through seven and wrapping. Watch Q0 flip every clock, Q1 every second, Q2 every fourth - the divide-by-two cascade counting with no gates. Then reverse a feed to Q-bar and watch it count down, and slow the clock to see the ripple stage by stage.",
      transcriptHI: "अब आप हर हिस्सा जानते हैं, तो एक असली में बनाइए। तीन JK flip-flops रखिए, हर J और K को एक से बाँधिए ताकि हर एक शुद्ध toggle हो, और उन्हें chain कीजिए - clock FF0 में, Q0 FF1 के clock में, Q1 FF2 के clock में। clock को एक-एक edge चलाइए और Q2 Q1 Q0 को binary पढ़िए; जो क्रम निकाला उसकी पुष्टि कीजिए, zero से seven और wrap। Q0 को हर clock, Q1 हर दूसरे, Q2 हर चौथे पलटते देखिए - divide-by-two cascade बिना gates गिनता। फिर एक feed को Q-bar पर उलटिए और down गिनते देखिए, और clock धीमा कर के ripple को stage-दर-stage देखिए।",
      visualNote: "WorkbenchCTA launching the guided 'ripple-counter' build."
    },
    {
      id: "S10_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Flip each card: term on the front, the real logic on the back.",
      theoryEN: ["Eight cards distilling the ripple counter: the clocking rule, toggle mode, the up/down matrix, ripple delay, top speed, the decoding glitch, mode steering, and async-versus-sync."],
      theoryHI: ["ripple counter को निचोड़ते आठ cards: clocking नियम, toggle mode, up/down matrix, ripple delay, top speed, decoding glitch, mode steering, और async-बनाम-sync।"],
      transcriptEN: "Flip through the eight cards to lock in every fact about ripple counters.",
      transcriptHI: "ripple counters का हर तथ्य पक्का करने को आठ cards पलटिए।",
      visualNote: "SubFlashCards deck from CONTENT.flashcards."
    },
    {
      id: "S11_Quiz",
      label: "Quiz",
      kind: "quiz",
      subtitle: "Seven questions on clocking, direction, delay, and the glitch.",
      theoryEN: ["Seven questions covering how a ripple counter is clocked, which feed sets the direction, how delay and top speed scale, and why the decoding glitch appears."],
      theoryHI: ["सात सवाल: ripple counter कैसे clock होता है, कौन सा feed direction तय करता है, delay और top speed कैसे बढ़ते हैं, और decoding glitch क्यों उभरता है।"],
      transcriptEN: "Seven questions to test your grip on ripple counters.",
      transcriptHI: "ripple counters पर आपकी पकड़ जाँचने को सात सवाल।",
      visualNote: "QuizScene over CONTENT.quiz."
    },
    {
      id: "S12_Recap",
      label: "Recap: The Ripple Counter",
      kind: "recap",
      subtitle: "Cheap and simple, but slow and glitchy - the trade you now understand.",
      theoryEN: [
        "Step back and the ripple counter is one clean idea. Chain toggle flip-flops (JK with J = K = 1), clock only the first from the external clock, and let each stage clock the next from its own output. The counting trigger then ripples from the LSB up the chain, one flip-flop at a time, and the outputs read out a binary count for free.",
        "Direction is a single wiring choice captured by the master matrix. Feed the true Q or the complement Q̄ into the next clock, matched to whether the flip-flop is negative- or positive-edge triggered: NGT-up and PGT-down feed Q, while NGT-down and PGT-up feed Q̄. A per-stage 2:1 MUX, Clock_next = M̄·Q + M·Q̄, lets one mode bit M switch the whole counter between up and down.",
        "The cost of the simplicity is speed and cleanliness. Delays add along the chain, so the worst-case settling time is t_pd(total) = N × t_pd(FF) and the top clock is f_max ≤ 1 / (N × t_pd(FF)) - wider means slower. And because the stages change in sequence, the outputs flicker through illegal values mid-ripple, like 011 → 010 → 000 → 100, which any decoder watching at full speed can misread.",
        "Hold the domino picture for all of it: push the first, the topple ripples down one delay at a time, the last falls after N delays, and a half-toppled snapshot is the glitch. When you need the count fast and clean instead of small and simple, you clock every flip-flop together - a synchronous counter - which is exactly where the next module goes."
      ],
      theoryHI: [
        "पीछे हटिए और ripple counter एक साफ़ विचार है। toggle flip-flops (JK जिसमें J = K = 1) chain कीजिए, सिर्फ़ पहले को external clock से clock कीजिए, और हर stage को अगले को अपने output से clock करने दीजिए। counting trigger फिर LSB से chain में ऊपर ripple करता है, एक-एक flip-flop, और outputs मुफ़्त में एक binary count पढ़ते हैं।",
        "Direction एक अकेला wiring चुनाव है जो master matrix में क़ैद है। असली Q या complement Q̄ को अगले clock में दीजिए, इससे मिलाकर कि flip-flop negative- या positive-edge triggered है: NGT-up और PGT-down में Q, जबकि NGT-down और PGT-up में Q̄। हर stage पर एक 2:1 MUX, Clock_next = M̄·Q + M·Q̄, एक mode bit M को पूरे counter को up और down के बीच switch करने देता है।",
        "सरलता की क़ीमत speed और सफ़ाई है। delays chain के साथ जुड़ते हैं, तो worst-case settling time t_pd(total) = N × t_pd(FF) है और top clock f_max ≤ 1 / (N × t_pd(FF)) - चौड़ा मतलब धीमा। और चूँकि stages क्रम से बदलते हैं, outputs ripple के बीच अवैध मानों से झिलमिलाते हैं, जैसे 011 → 010 → 000 → 100, जिसे पूरी speed पर ताकता कोई भी decoder ग़लत पढ़ सकता है।",
        "इन सबके लिए domino तस्वीर पकड़े रखिए: पहले को धकेलिए, गिरना एक-एक delay करके नीचे ripple करता है, आख़िरी N delays बाद गिरता है, और आधी-गिरी snapshot ही glitch है। जब आपको count छोटा-और-सरल के बजाय तेज़-और-साफ़ चाहिए, तो आप हर flip-flop को एक साथ clock करते हैं - एक synchronous counter - जहाँ ठीक अगला module जाता है।"
      ],
      transcriptEN: "Step back and the ripple counter is one clean idea: chain toggle flip-flops, clock only the first, and let each stage clock the next from its own output, so the trigger ripples up the chain and the outputs count in binary for free. Direction is one wiring choice from the master matrix - feed Q or Q-bar, matched to the flip-flop's edge, with a per-stage two-to-one MUX letting a mode bit switch up versus down. The cost is speed and cleanliness: delays add, so settling is N times t-pd-FF and the top clock is one over that, wider meaning slower, and the outputs flicker through illegal values mid-ripple like 011, 010, 000, 100. Hold the domino picture throughout, and when you need fast and clean instead of small and simple, clock every flip-flop together - a synchronous counter - which is where we go next.",
      transcriptHI: "पीछे हटिए और ripple counter एक साफ़ विचार है: toggle flip-flops chain कीजिए, सिर्फ़ पहले को clock कीजिए, और हर stage को अगले को अपने output से clock करने दीजिए, तो trigger chain में ऊपर ripple करता है और outputs मुफ़्त में binary गिनते हैं। Direction master matrix से एक wiring चुनाव है - Q या Q-bar दीजिए, flip-flop के edge से मिलाकर, हर stage पर एक two-to-one MUX एक mode bit को up बनाम down switch करने देता। क़ीमत speed और सफ़ाई है: delays जुड़ते हैं, तो settling N गुणा t-pd-FF है और top clock उसका उल्टा, चौड़ा मतलब धीमा, और outputs ripple के बीच अवैध मानों से झिलमिलाते हैं जैसे 011, 010, 000, 100। domino तस्वीर पूरे समय पकड़िए, और जब छोटा-और-सरल के बजाय तेज़-और-साफ़ चाहिए, हर flip-flop एक साथ clock कीजिए - एक synchronous counter - जहाँ हम आगे जाते हैं।",
      visualNote: "RecapScene: FlowRail + the closing prose."
    }
  ],
  flashcards: [
    {
      frontEN: "What makes a counter 'asynchronous'?",
      frontHI: "किसी counter को 'asynchronous' क्या बनाता है?",
      backEN: "Only FF0 (the LSB) is driven by the external clock; every later stage takes its clock from the previous flip-flop's output. So the trigger ripples up the chain one stage at a time - the flip-flops do NOT all change on one common edge.",
      backHI: "सिर्फ़ FF0 (LSB) external clock से चलता है; हर बाद का stage अपना clock पिछले flip-flop के output से लेता है। तो trigger chain में एक-एक stage करके ऊपर ripple करता है - flip-flops सब एक साझा edge पर नहीं बदलते।"
    },
    {
      frontEN: "Why is every flip-flop set to J = K = 1?",
      frontHI: "हर flip-flop J = K = 1 पर क्यों रखा जाता है?",
      backEN: "J = K = 1 is toggle mode: the JK equation Q(t+1) = J·Q̄ + K̄·Q collapses to Q(t+1) = Q̄, so Q flips on every clock edge received. Each stage becomes a divide-by-two, which is exactly what binary counting needs.",
      backHI: "J = K = 1 toggle mode है: JK equation Q(t+1) = J·Q̄ + K̄·Q सिमटकर Q(t+1) = Q̄ बनता है, तो Q हर मिलने वाले clock edge पर पलटता है। हर stage एक divide-by-two बनता है, ठीक वही जो binary counting को चाहिए।"
    },
    {
      frontEN: "Up/down matrix: what feeds the next stage's clock?",
      frontHI: "up/down matrix: अगले stage का clock क्या feed करता है?",
      backEN: "NGT (neg-edge): up feeds Q, down feeds Q̄. PGT (pos-edge): up feeds Q̄, down feeds Q. You pick the feed whose edge lands where the stage must toggle - the two Q cells and two Q̄ cells sit on the diagonals.",
      backHI: "NGT (neg-edge): up में Q, down में Q̄। PGT (pos-edge): up में Q̄, down में Q। आप वह feed चुनते हैं जिसका edge वहाँ गिरे जहाँ stage को toggle करना है - दो Q cells और दो Q̄ cells diagonals पर बैठते हैं।"
    },
    {
      frontEN: "How is a 3-bit ripple up counter wired?",
      frontHI: "3-bit ripple up counter कैसे wired होता है?",
      backEN: "Three JK toggles (J=K=1). FF0's clock = external CLK; Q0 → FF1's clock; Q1 → FF2's clock. Read Q2 Q1 Q0 as binary. It cycles 000…111 (MOD-8), with Q0 flipping every clock, Q1 every second, Q2 every fourth.",
      backHI: "तीन JK toggles (J=K=1)। FF0 का clock = external CLK; Q0 → FF1 का clock; Q1 → FF2 का clock। Q2 Q1 Q0 को binary पढ़िए। यह 000…111 (MOD-8) घूमता है, Q0 हर clock, Q1 हर दूसरे, Q2 हर चौथे पलटता।"
    },
    {
      frontEN: "What is the total ripple (propagation) delay?",
      frontHI: "कुल ripple (propagation) delay क्या है?",
      backEN: "In the worst case the edge ripples through all N flip-flops, so t_pd(total) = N × t_pd(FF): the per-stage delays simply add along the chain. This happens at a full rollover, e.g. 0111 → 1000.",
      backHI: "worst case में edge सभी N flip-flops में ripple करता है, तो t_pd(total) = N × t_pd(FF): per-stage delays chain के साथ बस जुड़ते हैं। यह पूरे rollover पर होता है, जैसे 0111 → 1000।"
    },
    {
      frontEN: "What sets the maximum clock frequency?",
      frontHI: "maximum clock frequency क्या तय करता है?",
      backEN: "The next edge cannot arrive until the count has fully settled, so T ≥ N × t_pd(FF), giving f_max ≤ 1 / (N × t_pd(FF)). Adding bits lowers the ceiling - a wider ripple counter is a slower one.",
      backHI: "अगला edge तब तक नहीं आ सकता जब तक count पूरी तरह settle न हो, तो T ≥ N × t_pd(FF), जो f_max ≤ 1 / (N × t_pd(FF)) देता है। bits जोड़ना ceiling गिराता है - चौड़ा ripple counter धीमा होता है।"
    },
    {
      frontEN: "What is the decoding glitch?",
      frontHI: "decoding glitch क्या है?",
      backEN: "Because stages change in sequence, the outputs pass through illegal intermediate values mid-ripple. E.g. 011 → 100 actually goes 011 → 010 → 000 → 100, so a decoder watching at full speed can read a false 2 or 0 that the counter never rested at.",
      backHI: "चूँकि stages क्रम से बदलते हैं, outputs ripple के बीच अवैध बीच-के मानों से गुज़रते हैं। जैसे 011 → 100 असल में 011 → 010 → 000 → 100 जाता है, तो पूरी speed पर ताकता decoder एक झूठा 2 या 0 पढ़ सकता है जिस पर counter कभी टिका ही नहीं।"
    },
    {
      frontEN: "Ripple vs synchronous - the trade-off?",
      frontHI: "ripple बनाम synchronous - trade-off क्या है?",
      backEN: "Ripple: fewest gates, no next-state logic, but slow (delays add) and glitchy (ripple flickers). Synchronous: all flip-flops share one clock, so settling is one t_pd regardless of width and there is no decoding glitch - at the cost of extra next-state logic.",
      backHI: "Ripple: सबसे कम gates, कोई next-state logic नहीं, पर धीमा (delays जुड़ते हैं) और glitchy (ripple झिलमिलाता है)। Synchronous: सब flip-flops एक clock बाँटते हैं, तो settling width चाहे कुछ भी हो एक t_pd और कोई decoding glitch नहीं - अतिरिक्त next-state logic की क़ीमत पर।"
    }
  ],
  quiz: [
    {
      questionEN: "In a ripple counter, which flip-flop receives the external clock?",
      questionHI: "ripple counter में external clock कौन सा flip-flop पाता है?",
      options: ["All of them, in parallel", "Only FF0, the LSB", "Only the MSB flip-flop", "None - it is combinational"],
      answerIndex: 1,
      explainEN: "Only FF0 (the least-significant bit) is wired to the external clock. Every later stage takes its clock from the previous flip-flop's output, so the trigger ripples up the chain.",
      explainHI: "सिर्फ़ FF0 (least-significant bit) external clock से wired है। हर बाद का stage अपना clock पिछले flip-flop के output से लेता है, तो trigger chain में ऊपर ripple करता है।"
    },
    {
      questionEN: "Why is each JK flip-flop set to J = K = 1?",
      questionHI: "हर JK flip-flop J = K = 1 पर क्यों रखा जाता है?",
      options: ["To hold its state (no change)", "To force a permanent reset", "To toggle (divide by two) on each edge", "To make it level-sensitive"],
      answerIndex: 2,
      explainEN: "J = K = 1 is toggle mode: Q(t+1) = Q̄, so Q flips on every clock edge received. Each stage divides frequency by two, which produces a binary count.",
      explainHI: "J = K = 1 toggle mode है: Q(t+1) = Q̄, तो Q हर मिलने वाले clock edge पर पलटता है। हर stage frequency को दो से भाग देता है, जो binary count बनाता है।"
    },
    {
      questionEN: "For a negative-edge-triggered ripple UP counter, each stage feeds the next stage's clock with…",
      questionHI: "एक negative-edge-triggered ripple UP counter के लिए, हर stage अगले stage के clock को feed करता है…",
      options: ["Q̄ (the complement)", "Q (the true output)", "the external clock directly", "a constant 1"],
      answerIndex: 1,
      explainEN: "NGT + up feeds the true Q. A negative-edge flip-flop fires on a falling edge, and for an up count the next stage must toggle exactly when Q falls 1→0 - which is Q's own falling edge.",
      explainHI: "NGT + up असली Q feed करता है। negative-edge flip-flop falling edge पर fire करता है, और up count के लिए अगला stage ठीक तब toggle करे जब Q 1→0 गिरे - जो Q का अपना falling edge है।"
    },
    {
      questionEN: "A 4-bit ripple counter uses flip-flops with t_pd(FF) = 10 ns. Its worst-case settling delay is…",
      questionHI: "एक 4-bit ripple counter t_pd(FF) = 10 ns वाले flip-flops वापरता है। इसका worst-case settling delay है…",
      options: ["10 ns", "2.5 ns", "40 ns", "16 ns"],
      answerIndex: 2,
      explainEN: "t_pd(total) = N × t_pd(FF) = 4 × 10 ns = 40 ns. In the worst case the edge ripples through all four flip-flops in sequence, so their delays add.",
      explainHI: "t_pd(total) = N × t_pd(FF) = 4 × 10 ns = 40 ns। worst case में edge चारों flip-flops में क्रम से ripple करता है, तो उनके delays जुड़ते हैं।"
    },
    {
      questionEN: "For that same 4-bit counter, the maximum clock frequency is about…",
      questionHI: "उसी 4-bit counter के लिए, maximum clock frequency लगभग है…",
      options: ["100 MHz", "25 MHz", "40 MHz", "10 MHz"],
      answerIndex: 1,
      explainEN: "f_max ≤ 1 / (N × t_pd(FF)) = 1 / 40 ns = 25 MHz. The clock period must be at least the total settling time, so the frequency is its reciprocal.",
      explainHI: "f_max ≤ 1 / (N × t_pd(FF)) = 1 / 40 ns = 25 MHz। clock period कम से कम कुल settling time होना चाहिए, तो frequency उसका व्युत्क्रम है।"
    },
    {
      questionEN: "In a 3-bit ripple up counter, the 011 → 100 transition transiently passes through…",
      questionHI: "एक 3-bit ripple up counter में, 011 → 100 transition पल भर के लिए किससे गुज़रता है…",
      options: ["011 → 111 → 101 → 100", "no intermediate states", "011 → 010 → 000 → 100", "011 → 001 → 000 → 100"],
      answerIndex: 2,
      explainEN: "The ripple goes 011 → 010 (Q0 falls) → 000 (Q1 falls) → 100 (Q2 rises). The transient values 2 and 0 are the decoding glitch - values the counter never truly rests at.",
      explainHI: "ripple जाता है 011 → 010 (Q0 गिरता है) → 000 (Q1 गिरता है) → 100 (Q2 चढ़ता है)। transient मान 2 और 0 ही decoding glitch हैं - मान जिन पर counter सच में कभी नहीं टिकता।"
    },
    {
      questionEN: "The steering signal Clock_next = M̄·Q + M·Q̄ does what?",
      questionHI: "steering signal Clock_next = M̄·Q + M·Q̄ क्या करता है?",
      options: ["Resets the counter when M = 1", "A 2:1 MUX selecting Q (up) or Q̄ (down) by mode M", "Doubles the clock frequency", "Disables the clock when M = 0"],
      answerIndex: 1,
      explainEN: "It is a 2:1 MUX per stage: M = 0 passes Q (count up), M = 1 passes Q̄ (count down). One mode bit M reverses the whole counter's direction without changing anything else.",
      explainHI: "यह हर stage पर एक 2:1 MUX है: M = 0 Q pass करता है (up गिनती), M = 1 Q̄ pass करता है (down गिनती)। एक mode bit M बाक़ी कुछ बदले बिना पूरे counter की direction उलट देता है।"
    }
  ]
};
