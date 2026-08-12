import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/37 - Ring & Johnson Counters, "The Loop That Feeds Itself"
 * (Sequential Logic track).
 * Both counters are a shift register whose serial output is wired back into its
 * own serial input - no external data source needed once seeded. The ring counter
 * uses DIRECT feedback (D0 = Q(n-1)): a single one-hot bit just circulates,
 * MOD-n, and needs zero decoding gates because Qi itself IS the decoded signal
 * for state i. The Johnson (twisted-ring / switched-tail) counter crosses the
 * feedback wire through one inverter (D0 = Q(n-1)'): that twist doubles the
 * useful states to MOD-2n, makes every neighbouring state differ by exactly one
 * bit (Hamming distance 1, glitch-free), and still only needs ONE 2-input gate
 * per state to decode, however long the counter grows. Both are non-self-starting
 * (a lockup hazard): of the 2^n total flip-flop states only n (ring) or 2n
 * (Johnson) sit on the intended cycle, so a bad power-up state can strand the
 * counter forever. The classic ring fix adds correction logic D0 = Q0'.Q1'.Q2'
 * (n=4), which inserts a 1 the moment the counter hits all-zeros. Every displayed
 * value (sequences, Hamming distances, the comparison table, the self-start
 * simulation, the decode-gate map) is COMPUTED in code by iterating the feedback
 * equation, never hardcoded.
 */
export const CONTENT: SubContent = {
  moduleTitle: 'Ring & Johnson Counters - The Loop That Feeds Itself',
  moduleSubtitle: 'A shift register wired tail-to-head: straight feedback makes a one-hot ring, one inverter in the loop makes a Johnson counter with double the states and almost-free decoding.',
  scenes: [
    {
      id: 'S00_Cover',
      label: 'The Loop That Feeds Itself',
      kind: 'cover',
      subtitle: 'A shift register whose own output feeds its own input - no external data needed once it is seeded.',
      theoryEN: [
        "This module builds two close cousins of the shift register you already met: the ring counter and the Johnson counter. Both are simply a shift register whose serial output is wired back around into its own serial input - the loop feeds itself - so once you seed it with a starting pattern it needs no outside data ever again, only a clock.",
        'The ring counter uses direct feedback: D0 = Q3 (the last flip-flop\'s output copied straight back to the first). Seed it with a single 1 and the rest 0s and that lone 1 just keeps circulating forever, one bit hot at a time, cycling through exactly n states - MOD-n.',
        "The Johnson counter, also called a twisted-ring or switched-tail counter, crosses that same feedback wire through one inverter: D0 = Q3'. One twist doubles the useful states to MOD-2n and, as a bonus, makes every neighbouring state differ from the last by exactly one bit.",
        "Both circuits are prized because they need almost no extra logic to read: a ring counter's output IS the decoded signal for free, and a Johnson counter needs only one 2-input gate per state to decode, no matter how long the counter grows.",
        'By the end you will run both counters live, prove their sequences by iterating the feedback equation in code, fix the lockup hazard that haunts every ring counter, derive the Johnson decode gates from scratch by search, and build a Johnson counter for real on the workbench.'
      ],
      theoryHI: [
        'इस module में shift register के दो नज़दीकी रिश्तेदार बनेंगे: ring counter और Johnson counter। दोनों बस एक shift register हैं जिसका serial output घुमाकर वापस उसी के serial input से जोड़ दिया गया है - loop अपने आप को feed करता है - तो एक बार शुरुआती pattern से seed करने के बाद इसे फिर कभी बाहरी data नहीं चाहिए, सिर्फ़ clock।',
        "Ring counter direct feedback वापरता है: D0 = Q3 (आख़िरी flip-flop का output सीधे पहले को वापस)। इसे एक अकेले 1 और बाक़ी 0s से seed कीजिए और वह अकेला 1 हमेशा के लिए घूमता रहता है, एक समय में एक bit hot, ठीक n states के चक्कर में - MOD-n।",
        "Johnson counter, जिसे twisted-ring या switched-tail counter भी कहते हैं, वही feedback wire एक inverter से पार कराता है: D0 = Q3'। एक मोड़ useful states को दोगुना करके MOD-2n बना देता है, और bonus में हर पड़ोसी state पिछले से ठीक एक bit से अलग होता है।",
        'दोनों circuits इसलिए क़ीमती हैं क्योंकि इन्हें पढ़ने को लगभग कोई अतिरिक्त logic नहीं चाहिए: ring counter का output मुफ़्त में ही decoded signal है, और Johnson counter को decode करने के लिए बस एक 2-input gate प्रति state चाहिए, चाहे counter कितना भी लंबा हो।',
        'अंत तक आप दोनों counters को live चलाएँगे, code में feedback equation iterate करके उनके sequences साबित करेंगे, हर ring counter को सताने वाला lockup hazard ठीक करेंगे, search से Johnson decode gates शुरू से derive करेंगे, और workbench पर असली में एक Johnson counter बनाएँगे।'
      ],
      transcriptEN: 'Welcome to Ring and Johnson counters - the loop that feeds itself. Both are a shift register with the serial output wired back into the serial input. The ring counter uses direct feedback, D0 equals the last flip-flop\'s output, so a single seeded 1 just circulates forever - one-hot, MOD-n. The Johnson counter crosses that same wire through an inverter, D0 equals the last output complemented, which doubles the states to MOD-2n and makes every neighbouring state differ by exactly one bit. Both need almost no decoding: a ring counter\'s output is its own decode, and a Johnson counter needs only one two-input gate per state. By the end you will run both live, fix the lockup hazard, derive the Johnson decode gates, and build one for real.',
      transcriptHI: 'Ring और Johnson counters में आपका स्वागत है - वह loop जो अपने आप को feed करता है। दोनों एक shift register हैं जिसका serial output वापस serial input से जुड़ा है। Ring counter direct feedback वापरता है, D0 बराबर आख़िरी flip-flop का output, तो एक seeded 1 हमेशा घूमता रहता है - one-hot, MOD-n। Johnson counter वही wire एक inverter से पार कराता है, D0 बराबर आख़िरी output का complement, जो states को दोगुना करके MOD-2n बना देता है और हर पड़ोसी state को पिछले से ठीक एक bit अलग बनाता है। दोनों को decoding के लिए लगभग कुछ नहीं चाहिए: ring counter का output ख़ुद ही अपना decode है, और Johnson counter को बस एक two-input gate प्रति state चाहिए। अंत तक आप दोनों को live चलाएँगे, lockup hazard ठीक करेंगे, Johnson decode gates derive करेंगे, और असली में एक बनाएँगे।',
      visualNote: 'Hero: a live 4-bit ring counter drawn as an actual ring of 4 D flip-flops, a single one-hot bit visibly circulating (1000->0100->0010->0001->...), advanced by a clock button.'
    },
    {
      id: 'S01_Video',
      label: 'Ring & Johnson Counters, On Film',
      kind: 'video',
      subtitle: 'A short film: a shift register that loops its own tail back into its own head.',
      theoryEN: [
        'Before you watch, hold one picture: take the shift register you already built, stop feeding it from outside, and instead run a wire from its very last output back to its very first input. Now the register recycles whatever pattern is already inside it, clock after clock, with no external source at all.',
        "The plainest version of that loop is the ring counter. Wire the last stage's Q straight back to the first stage's D - direct feedback, D0 = Q(n-1). Seed the register with exactly one 1 and the rest 0s, and that lone 1 just marches around the loop forever, one position per clock, visiting exactly n distinct states before repeating.",
        "Twist the loop and you get something richer: the Johnson counter. Route the same feedback wire through a single inverter - D0 = Q(n-1)' - and the register no longer just circulates a fixed pattern. Watch the count of 1s grow one at a time until the register is full, then shrink one at a time back to empty, for a total of 2n distinct states from only n flip-flops.",
        'Keep one running example for the whole module: a 4-bit register. As a ring counter it produces four states, 1000, 0100, 0010, 0001. As a Johnson counter the very same four flip-flops, with only the feedback wire changed, produce eight states: 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001.',
        'One more thing to watch for: both loops can get stuck. Power the flip-flops up in the wrong pattern and the loop might circulate among states that were never meant to be visited, forever. Later in the module you will see exactly how that lockup happens, and the small piece of extra logic that cures it.'
      ],
      theoryHI: [
        'देखने से पहले एक तस्वीर पकड़िए: वह shift register जो आप पहले बना चुके हैं लीजिए, उसे बाहर से feed करना बंद कीजिए, और इसके बजाय उसके सबसे आख़िरी output से एक wire वापस उसके सबसे पहले input तक ले जाइए। अब register जो भी pattern पहले से अंदर है उसे clock-दर-clock recycle करता है, कोई बाहरी स्रोत बिना।',
        "उस loop का सबसे सादा रूप ring counter है। आख़िरी stage के Q को सीधे पहले stage के D से wire कीजिए - direct feedback, D0 = Q(n-1)। Register को ठीक एक 1 और बाक़ी 0s से seed कीजिए, और वह अकेला 1 हमेशा के लिए loop के इर्द-गिर्द चलता है, हर clock एक position, दोहराने से पहले ठीक n अलग states देखते हुए।",
        "Loop को मोड़िए और आपको कुछ ज़्यादा समृद्ध मिलता है: Johnson counter। वही feedback wire एक अकेले inverter से route कीजिए - D0 = Q(n-1)' - और register अब बस एक तय pattern circulate नहीं करता। 1s की गिनती को एक-एक करके तब तक बढ़ते देखिए जब तक register भर न जाए, फिर एक-एक करके वापस ख़ाली होते, कुल 2n अलग states के लिए सिर्फ़ n flip-flops से।",
        'पूरे module के लिए एक उदाहरण मन में रखिए: एक 4-bit register। Ring counter के रूप में यह चार states देता है, 1000, 0100, 0010, 0001। Johnson counter के रूप में वही चार flip-flops, सिर्फ़ feedback wire बदलकर, आठ states देते हैं: 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001।',
        'एक और चीज़ पर नज़र रखिए: दोनों loops फँस सकते हैं। Flip-flops को ग़लत pattern पर power up कीजिए और loop उन states में हमेशा के लिए circulate कर सकता है जिन्हें कभी देखा ही नहीं जाना था। Module में आगे आप ठीक-ठीक देखेंगे यह lockup कैसे होता है, और वह छोटा अतिरिक्त logic जो इसे ठीक करता है।'
      ],
      transcriptEN: 'Take a shift register, stop feeding it from outside, and wire its last output back to its first input. Now it recycles whatever pattern is already inside. The plainest version is the ring counter: direct feedback, D0 equals the last stage\'s output. Seed one lone 1 and it marches around forever, visiting n distinct states. Twist the loop through one inverter and you get the Johnson counter: D0 equals the last output complemented. Now the count of 1s grows to full, then shrinks back to empty, for 2n distinct states from the same n flip-flops. Keep the 4-bit example in mind: ring gives 1000, 0100, 0010, 0001; Johnson gives 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001. And both loops can get stuck if they power up wrong - you will see exactly how, and the fix.',
      transcriptHI: 'एक shift register लीजिए, उसे बाहर से feed करना बंद कीजिए, और उसके आख़िरी output को पहले input से वापस wire कीजिए। अब यह जो भी pattern पहले से अंदर है उसे recycle करता है। सबसे सादा रूप ring counter है: direct feedback, D0 बराबर आख़िरी stage का output। एक अकेला 1 seed कीजिए और यह हमेशा घूमता है, n अलग states देखते हुए। Loop को एक inverter से मोड़िए और आपको Johnson counter मिलता है: D0 बराबर आख़िरी output का complement। अब 1s की गिनती भर जाने तक बढ़ती है, फिर वापस ख़ाली होती है, उन्हीं n flip-flops से 2n अलग states के लिए। 4-bit उदाहरण मन में रखिए: ring देता है 1000, 0100, 0010, 0001; Johnson देता है 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001। और दोनों loops ग़लत power up पर फँस सकते हैं - आप देखेंगे कैसे, और इलाज।',
      visualNote: 'Animated explainer: a shift register morphs into a closed loop; the feedback wire is shown plain (ring) then crossed through a small inverter bubble (Johnson), with the bit pattern circulating each cut.'
    },
    {
      id: 'S02_Facts',
      label: 'Two Ways To Feed A Loop',
      kind: 'theory',
      subtitle: 'Direct feedback (D0=Q(n-1)) builds a ring; complemented feedback (D0=Q(n-1)\') builds a Johnson counter.',
      theoryEN: [
        "Let us be precise about what a ring or Johnson counter actually is. Both are a circular shift register: an ordinary shift register - flip-flops chained output to input on a common clock - with one extra wire closing the chain into a loop, from the last stage's output back to the first stage's input. Nothing else changes; every cell is still a plain D flip-flop obeying Q(t+1) = D.",
        "The entire difference between the two circuits is a single design choice at that one closing wire. Run it straight and you get D0 = Q(n-1): the ring counter. Route it through one inverter and you get D0 = Q(n-1)': the Johnson counter. That one bubble - present or absent - is the whole distinction, which is why the Johnson counter's older names, twisted-ring or switched-tail, describe exactly this: the tail of the chain is twisted with an inversion before it is switched back to the head.",
        "Seed each circuit differently to see its character. Seed the ring with a single 1 (say 1000) and the rest 0s: because D0 just copies Q3 unchanged, the population of 1s never changes - exactly one bit is hot at every instant, forever. That is what one-hot means, and it is why a ring counter of n flip-flops has exactly n valid states: one for each position the lone 1 can occupy.",
        "Seed the Johnson counter with all 0s instead and watch the complement do its work. D0 = Q3' is 1 whenever the last stage currently holds 0, so a fresh 1 keeps entering at the front until the register is entirely full of 1s; from there D0 = Q3' becomes 0 whenever the last stage holds 1, so 0s start entering and empty the register back out. That fill-then-drain rhythm is what gives n flip-flops 2n distinct states instead of just n.",
        'A second key fact follows straight from this: because a ring counter\'s output is always one-hot, the single bit Qi that is high IS, by itself, the signal "the counter is in state i" - no extra gate is needed to know which state you are in. A Johnson counter is not one-hot, so reading its state needs a small amount of extra logic - but, remarkably, never more than one 2-input gate per state, as you will derive later in this module.'
      ],
      theoryHI: [
        "चलिए ठीक-ठीक साफ़ हों कि ring या Johnson counter असल में है क्या। दोनों एक circular shift register हैं: एक सादा shift register - flip-flops एक common clock पर output-से-input chained - जिसमें chain को एक loop में बंद करने वाली एक अतिरिक्त wire है, आख़िरी stage के output से वापस पहले stage के input तक। बाक़ी कुछ नहीं बदलता; हर cell अब भी एक सादा D flip-flop है जो Q(t+1) = D मानता है।",
        "दोनों circuits के बीच पूरा फ़र्क़ उस एक बंद करने वाली wire पर एक अकेला design चुनाव है। इसे सीधा चलाइए और मिलता है D0 = Q(n-1): ring counter। इसे एक inverter से route कीजिए और मिलता है D0 = Q(n-1)': Johnson counter। वह एक bubble - मौजूद या ग़ैरमौजूद - ही पूरा फ़र्क़ है, इसीलिए Johnson counter के पुराने नाम, twisted-ring या switched-tail, ठीक यही बताते हैं: chain की tail को inversion से मोड़ा जाता है इससे पहले कि वह head पर वापस switch हो।",
        "हर circuit को अलग-अलग seed करके उसका चरित्र देखिए। Ring को एक अकेले 1 (मान लीजिए 1000) और बाक़ी 0s से seed कीजिए: चूँकि D0 बस Q3 की बिना बदले नक़ल करता है, 1s की आबादी कभी नहीं बदलती - हर पल ठीक एक bit hot है, हमेशा के लिए। यही one-hot का मतलब है, और इसीलिए n flip-flops वाले ring counter में ठीक n valid states होते हैं: उन जगहों में से हर एक के लिए जहाँ वह अकेला 1 बैठ सकता है।",
        "इसके बजाय Johnson counter को सभी 0s से seed कीजिए और complement को काम करते देखिए। D0 = Q3' तब 1 होता है जब आख़िरी stage अभी 0 रखता है, तो सामने एक ताज़ा 1 तब तक घुसता रहता है जब तक register पूरी तरह 1s से न भर जाए; वहाँ से D0 = Q3' तब 0 हो जाता है जब आख़िरी stage 1 रखता है, तो 0s घुसना शुरू होते हैं और register को वापस ख़ाली कर देते हैं। यही भरना-फिर-ख़ाली-होना ताल है जो n flip-flops को सिर्फ़ n के बजाय 2n अलग states देती है।",
        'एक दूसरा अहम तथ्य सीधे इससे निकलता है: चूँकि ring counter का output हमेशा one-hot है, वह अकेला bit Qi जो high है वह अपने आप में "counter state i में है" का संकेत है - यह जानने को कोई अतिरिक्त gate नहीं चाहिए कि आप किस state में हैं। Johnson counter one-hot नहीं है, तो उसकी state पढ़ने को थोड़ा अतिरिक्त logic चाहिए - पर, हैरानी की बात, प्रति state कभी भी एक 2-input gate से ज़्यादा नहीं, जैसा आप module में आगे derive करेंगे।'
      ],
      transcriptEN: "A ring or Johnson counter is a circular shift register - flip-flops chained on a common clock, with one wire closing the last stage's output back to the first stage's input. The whole difference is that one wire: run it straight, D0 equals Q(n-1), and you get a ring counter - seed one 1 and it stays one-hot forever, n valid states. Route it through an inverter, D0 equals Q(n-1) complemented, and you get a Johnson counter - seeded at all-zero, ones fill in one at a time then drain back out, 2n distinct states from the same n flip-flops. Because the ring counter is always one-hot, the hot bit itself tells you the state, no gate needed. The Johnson counter needs a little logic to decode, but never more than one two-input gate per state.",
      transcriptHI: 'एक ring या Johnson counter एक circular shift register है - flip-flops एक common clock पर chained, एक wire आख़िरी stage के output को वापस पहले के input से बंद करती है। पूरा फ़र्क़ वही एक wire है: इसे सीधा चलाइए, D0 बराबर Q(n-1), और आपको मिलता है ring counter - एक 1 seed कीजिए और यह हमेशा one-hot रहता है, n valid states। इसे एक inverter से route कीजिए, D0 बराबर Q(n-1) का complement, और आपको मिलता है Johnson counter - all-zero से seed किया, ones एक-एक करके भरते हैं फिर वापस ख़ाली होते हैं, उन्हीं n flip-flops से 2n अलग states। चूँकि ring counter हमेशा one-hot है, hot bit ख़ुद state बता देता है, कोई gate नहीं चाहिए। Johnson counter को decode करने को थोड़ा logic चाहिए, पर कभी भी प्रति state एक two-input gate से ज़्यादा नहीं।',
      visualNote: 'FeedbackCompare: two small live 4-bit loops side by side - one with a plain feedback wire (ring), one with the wire passing through a NOT bubble (Johnson) - each advanced by its own clock button.'
    },
    {
      id: 'S03_Ring',
      label: 'The Ring Counter',
      kind: 'theory',
      subtitle: 'D0 = Q(n-1): one-hot, MOD-n, and the output is already the decode.',
      theoryEN: [
        'Formalise the ring counter now that you have felt it run. It is n D flip-flops chained on a common clock into a loop, with the closing rule D0 = Q(n-1). Seeded with exactly one 1, it is a one-hot generator: at every clock instant exactly one Qi is 1 and the rest are 0, and which one is hot advances by exactly one position on every edge.',
        'Trace the live 4-bit example bit by bit. Start at 1000. D0 copies Q3, which is 0, so the register becomes 0100. Next D0 copies the new Q3, still 0, giving 0010. Next it becomes 0001. Now Q3 is 1, so D0 copies that 1 back to the front, and the register returns exactly to 1000 - a complete lap in exactly 4 clocks, which is why this is called a MOD-n counter: n flip-flops, n valid states, one full cycle every n clocks.',
        "That MOD-n figure is small on purpose - and it is the ring counter's one real cost. Out of the 2^n total combinations a 4-bit register can hold, only 4 of the 16 are ever visited; the ring counter deliberately throws away 12 combinations to guarantee that the ones it does visit are always exactly one-hot.",
        'The payoff for that trade is zero decoding logic. Because exactly one Qi is high at a time, Qi itself already means "we are in state i" - there is nothing to compute, nothing to gate, you just read the wire. Compare that to a binary counter reaching the same 4 states, which would still need a small decoder built from AND gates to turn the binary code into individual one-hot signals; the ring counter is that decoder, for free, built into the flip-flops themselves.',
        "That is exactly why ring counters show up wherever you need to walk a single active line around a fixed set of positions. A multiplexed 7-segment display uses a ring counter to enable one digit at a time, in turn, fast enough that the eye sees all digits lit at once. A round-robin bus arbiter uses the same idea to hand one requester the bus, then the next, then the next, cycling fairly with no arithmetic at all."
      ],
      theoryHI: [
        'अब जब आप इसे चलते देख चुके हैं, ring counter को formal कीजिए। यह n D flip-flops हैं एक common clock पर एक loop में chained, बंद करने का नियम D0 = Q(n-1) के साथ। ठीक एक 1 से seeded, यह एक one-hot generator है: हर clock instant पर ठीक एक Qi 1 है और बाक़ी 0, और कौन सा hot है वह हर edge पर ठीक एक position आगे बढ़ता है।',
        'Live 4-bit उदाहरण को bit-दर-bit trace कीजिए। 1000 पर शुरू कीजिए। D0 Q3 की नक़ल करता है, जो 0 है, तो register 0100 बन जाता है। अगला D0 नए Q3 की नक़ल करता है, अब भी 0, देते हुए 0010। अगला 0001 बन जाता है। अब Q3 1 है, तो D0 उस 1 को वापस सामने की नक़ल करता है, और register ठीक 1000 पर लौटता है - ठीक 4 clocks में एक पूरा चक्कर, इसीलिए इसे MOD-n counter कहते हैं: n flip-flops, n valid states, हर n clocks में एक पूरा cycle।',
        "वह MOD-n आँकड़ा जानबूझकर छोटा है - और यही ring counter की एक असली लागत है। एक 4-bit register जो 2^n कुल combinations रख सकता है, उनमें से सिर्फ़ 4 (16 में से) कभी देखे जाते हैं; ring counter जानबूझकर 12 combinations फेंक देता है ताकि जो देखे जाएँ वे हमेशा ठीक one-hot रहें।",
        'उस trade का इनाम है शून्य decoding logic। चूँकि किसी भी समय ठीक एक Qi high है, Qi ख़ुद ही "हम state i में हैं" का मतलब रखता है - कुछ compute करने को नहीं, gate करने को नहीं, आप बस wire पढ़ते हैं। इसकी तुलना उसी 4 states तक पहुँचते binary counter से कीजिए, जिसे binary code को अलग-अलग one-hot signals में बदलने को AND gates से बना एक छोटा decoder फिर भी चाहिए होगा; ring counter वही decoder है, मुफ़्त में, flip-flops के अंदर ही बना।',
        'इसीलिए ring counters वहाँ दिखते हैं जहाँ आपको एक अकेली active line को स्थितियों के एक तय समूह में घुमाना हो। एक multiplexed 7-segment display एक ring counter वापरता है एक समय में एक digit को बारी-बारी enable करने को, इतनी तेज़ी से कि आँख को सारे digits एक साथ जले दिखें। एक round-robin bus arbiter वही विचार वापरता है एक requester को bus देने को, फिर अगले को, फिर अगले को, बिना किसी arithmetic के निष्पक्ष चक्कर लगाते हुए।'
      ],
      transcriptEN: 'The ring counter is n D flip-flops chained on a common clock into a loop, D0 equals Q(n-1). Seeded with one 1, it is a one-hot generator - exactly one Qi is high at a time, advancing one position per edge. Trace 4 bits: 1000, 0100, 0010, 0001, back to 1000 - a full lap in exactly 4 clocks, MOD-n. Only n of the 2 to the n possible states are ever visited - that is the cost, in exchange for zero decoding: the hot Qi already means state i, no gate needed. That is why ring counters walk a single active line - a multiplexed 7-segment display, a round-robin bus arbiter.',
      transcriptHI: 'Ring counter n D flip-flops है एक common clock पर एक loop में chained, D0 बराबर Q(n-1)। एक 1 से seeded, यह एक one-hot generator है - हर समय ठीक एक Qi high, हर edge पर एक position आगे। 4 bits trace कीजिए: 1000, 0100, 0010, 0001, वापस 1000 पर - ठीक 4 clocks में एक पूरा चक्कर, MOD-n। 2 to the n संभव states में से सिर्फ़ n कभी देखे जाते हैं - यही लागत है, बदले में शून्य decoding: hot Qi पहले से state i का मतलब रखता है, कोई gate नहीं चाहिए। इसीलिए ring counters एक अकेली active line घुमाते हैं - एक multiplexed 7-segment display, एक round-robin bus arbiter।',
      visualNote: 'RingCounterViz (johnson=false) live, plus a computed state table of the 4-clock lap 1000->0100->0010->0001->1000 with the one-hot column highlighted and the 12-of-16-unused count noted.'
    },
    {
      id: 'S04_Johnson',
      label: 'The Johnson (Twisted-Ring) Counter',
      kind: 'theory',
      subtitle: "D0 = Q(n-1)': MOD-2n from the same n flip-flops, and every step changes exactly one bit.",
      theoryEN: [
        "Formalise the Johnson counter the same way. It is the same circular shift register as the ring counter, with exactly one change: the closing wire carries the complement, D0 = Q(n-1)'. That single inversion is why it is also called a twisted-ring or switched-tail counter - picture physically giving the loop's tail a half-twist, like starting a Möbius strip, before switching it back onto the head.",
        'Trace the live 4-bit example from all zeros. D0 = Q3\' = 1 (since Q3 is 0), so 0000 becomes 1000. That 1 keeps entering at the front while Q3 stays 0, so the count of 1s climbs: 1000, 1100, 1110, 1111. The instant Q3 finally turns 1, D0 = Q3\' flips to 0, and now 0s enter at the front while the register drains: 0111, 0011, 0001, and back to 0000. Fill, then drain - 8 distinct states from only 4 flip-flops.',
        "That MOD-2n figure is the headline advantage: a Johnson counter gets twice the states of a ring counter from the very same number of flip-flops, because it no longer restricts itself to one-hot patterns - it uses the smoothly growing and shrinking block of 1s instead.",
        'The second advantage is just as valuable and easy to miss: look at any two neighbouring rows in the sequence above and exactly one bit has changed. 0000 to 1000 changes only Q0; 1110 to 1111 changes only Q3; 1111 to 0111 changes only Q0 again. This Hamming distance of 1 means the outputs behave like a Gray code - no two bits ever flip on the same edge, so there is no instant where a decoder could glimpse a false, transient in-between state.',
        'A Johnson counter with n flip-flops needs half as many stages as a ring counter to produce the same number of output phases, which is exactly why it is the classic choice for decade (divide-by-10) counters and frequency dividers: 5 flip-flops give a clean MOD-10 Johnson counter, each of its 10 states decodable with one 2-input gate, at half the flip-flop cost of a 10-flip-flop ring counter doing the same job.'
      ],
      theoryHI: [
        'Johnson counter को उसी तरह formal कीजिए। यह वही circular shift register है जो ring counter है, ठीक एक बदलाव के साथ: बंद करने वाली wire complement ले जाती है, D0 = Q(n-1)\'। यही एक inversion है जिसके कारण इसे twisted-ring या switched-tail counter भी कहते हैं - सोचिए कि loop की tail को भौतिक रूप से आधा-मोड़ दिया गया है, जैसे एक Möbius strip शुरू करना, इससे पहले कि वह वापस head पर switch हो।',
        "Live 4-bit उदाहरण को सभी zeros से trace कीजिए। D0 = Q3' = 1 (चूँकि Q3 0 है), तो 0000 1000 बन जाता है। वह 1 सामने घुसता रहता है जब तक Q3 0 रहे, तो 1s की गिनती चढ़ती है: 1000, 1100, 1110, 1111। जिस पल Q3 आख़िरकार 1 बनता है, D0 = Q3' 0 पर पलट जाता है, और अब 0s सामने घुसते हैं जबकि register ख़ाली होता है: 0111, 0011, 0001, और वापस 0000 पर। भरना, फिर ख़ाली होना - सिर्फ़ 4 flip-flops से 8 अलग states।",
        'वह MOD-2n आँकड़ा मुख्य फ़ायदा है: Johnson counter को उन्हीं flip-flops की संख्या से ring counter के दोगुने states मिलते हैं, क्योंकि यह अब ख़ुद को one-hot patterns तक सीमित नहीं रखता - इसके बजाय यह 1s के धीरे-धीरे बढ़ते-घटते block को वापरता है।',
        'दूसरा फ़ायदा उतना ही क़ीमती है और भूलना आसान है: ऊपर sequence में किन्हीं दो पड़ोसी rows को देखिए और ठीक एक bit बदला है। 0000 से 1000 सिर्फ़ Q0 बदलता है; 1110 से 1111 सिर्फ़ Q3 बदलता है; 1111 से 0111 फिर सिर्फ़ Q0 बदलता है। यह Hamming distance 1 का मतलब है कि outputs Gray code की तरह बर्ताव करते हैं - कभी दो bits एक ही edge पर नहीं पलटते, तो कोई ऐसा पल नहीं जहाँ एक decoder एक झूठी, क्षणिक बीच-की state झलक जाए।',
        'n flip-flops वाले Johnson counter को उतने ही output phases बनाने के लिए ring counter के आधे stages चाहिए, इसीलिए यह decade (divide-by-10) counters और frequency dividers के लिए classic पसंद है: 5 flip-flops एक साफ़ MOD-10 Johnson counter देते हैं, इसकी 10 states में से हर एक एक 2-input gate से decodable, वही काम करते 10-flip-flop ring counter के आधे flip-flop लागत पर।'
      ],
      transcriptEN: "The Johnson counter is the same circular shift register, with one change: the closing wire carries the complement, D0 equals Q(n-1) complemented - the twisted tail. Trace from 0000: it fills, 1000, 1100, 1110, 1111, then drains, 0111, 0011, 0001, back to 0000 - 8 states from 4 flip-flops, MOD-2n. Look at any two neighbours and exactly one bit changed - Hamming distance 1, Gray-code-like, glitch-free. And because n flip-flops give 2n phases, half as many stages as a ring counter for the same output count, this is the classic choice for decade counters and frequency dividers.",
      transcriptHI: "Johnson counter वही circular shift register है, एक बदलाव के साथ: बंद करने वाली wire complement ले जाती है, D0 बराबर Q(n-1) का complement - twisted tail। 0000 से trace कीजिए: यह भरता है, 1000, 1100, 1110, 1111, फिर ख़ाली होता है, 0111, 0011, 0001, वापस 0000 पर - 4 flip-flops से 8 states, MOD-2n। किन्हीं दो पड़ोसियों को देखिए और ठीक एक bit बदला - Hamming distance 1, Gray-code-जैसा, glitch-free। और चूँकि n flip-flops 2n phases देते हैं, उतने ही output count के लिए ring counter के आधे stages, यही decade counters और frequency dividers के लिए classic पसंद है।",
      visualNote: 'RingCounterViz (johnson=true) live, plus a computed 8-row state table of the full lap with a Hamming-distance-to-previous-row column, verified in code to equal 1 on every transition.'
    },
    {
      id: 'S05_Compare',
      label: 'Ring vs Johnson, Side By Side',
      kind: 'theory',
      subtitle: 'A flip-flops-vs-gates trade-off: zero gates and double the flip-flops, or half the flip-flops and one gate per state.',
      theoryEN: [
        'Put the two circuits side by side and a single trade-off explains almost every difference between them: a ring counter spends flip-flops to buy zero decoding, while a Johnson counter spends one small gate per state to buy back half the flip-flops. Neither is universally "better" - which one you reach for depends on whether flip-flops or gates are the scarcer resource in your design.',
        "Feedback and modulus set up the trade. The ring counter's direct feedback keeps it strictly one-hot, so n flip-flops buy exactly n states, MOD-n. The Johnson counter's complemented feedback lets the register fill and drain instead, so the very same n flip-flops buy 2n states, MOD-2n - double the mileage per flip-flop.",
        'That doubling is exactly why the stages-for-k-signals row matters in practice: to generate k distinct one-hot-style output signals, a ring counter needs k flip-flops, one per signal, while a Johnson counter needs only k/2 flip-flops, because each of its flip-flops participates in producing two of the final decoded signals across the fill-and-drain cycle.',
        "Decoding overhead is the other side of that same coin. A ring counter's Qi output already IS its own decode - 0 extra gates, ever. A Johnson counter is not one-hot, so each of its states costs exactly one 2-input AND to decode - a small, fixed, and provably sufficient price, never more, however long the counter grows.",
        "Hamming distance closes the comparison. Between a ring counter's neighbouring states two bits differ (one turns off, the next turns on), while a Johnson counter's neighbouring states differ by only one bit. That does not matter for the ring counter's own one-hot output, since it needs no decoding anyway - but it is precisely why the Johnson counter's decoded outputs are glitch-free: with only one bit ever changing at a time, there is no race between two simultaneous transitions for a decoder to catch in an invalid in-between state."
      ],
      theoryHI: [
        'दोनों circuits को अगल-बगल रखिए और एक अकेला trade-off लगभग हर फ़र्क़ समझा देता है: ring counter flip-flops ख़र्च करके शून्य decoding ख़रीदता है, जबकि Johnson counter प्रति state एक छोटा gate ख़र्च करके आधे flip-flops वापस ख़रीदता है। कोई भी सार्वभौमिक रूप से "बेहतर" नहीं है - आप किसे चुनें यह इस पर निर्भर करता है कि आपके design में flip-flops या gates में से कौन दुर्लभ संसाधन है।',
        'Feedback और modulus इस trade को तय करते हैं। Ring counter का direct feedback इसे सख़्ती से one-hot रखता है, तो n flip-flops ठीक n states ख़रीदते हैं, MOD-n। Johnson counter का complemented feedback register को इसके बजाय भरने-ख़ाली होने देता है, तो वही n flip-flops 2n states ख़रीदते हैं, MOD-2n - प्रति flip-flop दोगुना mileage।',
        'वही दोगुनापन इसीलिए व्यवहार में stages-for-k-signals row को मायने रखता है: k अलग one-hot-जैसे output signals बनाने को, एक ring counter को k flip-flops चाहिए, प्रति signal एक, जबकि Johnson counter को सिर्फ़ k/2 flip-flops चाहिए, क्योंकि इसका हर flip-flop fill-and-drain cycle भर में अंतिम decoded signals में से दो बनाने में हिस्सा लेता है।',
        'Decoding overhead उसी सिक्के का दूसरा पहलू है। Ring counter का Qi output पहले से ही अपना decode है - 0 अतिरिक्त gates, कभी भी। Johnson counter one-hot नहीं है, तो इसकी हर state को decode करने में ठीक एक 2-input AND लगता है - एक छोटी, तय, और साबित रूप से पर्याप्त क़ीमत, कभी ज़्यादा नहीं, चाहे counter कितना भी लंबा हो।',
        'Hamming distance तुलना पूरी करती है। Ring counter की पड़ोसी states के बीच दो bits अलग होते हैं (एक बंद होता है, अगला चालू होता है), जबकि Johnson counter की पड़ोसी states सिर्फ़ एक bit से अलग होती हैं। यह ring counter के अपने one-hot output के लिए मायने नहीं रखता, चूँकि उसे वैसे भी कोई decoding नहीं चाहिए - पर यही ठीक-ठीक वजह है कि Johnson counter के decoded outputs glitch-free हैं: चूँकि किसी भी समय सिर्फ़ एक bit बदलता है, दो साथ-साथ transitions की कोई race नहीं जिसे एक decoder किसी अमान्य बीच-की state में पकड़ ले।'
      ],
      transcriptEN: 'A single trade-off explains the two circuits: a ring counter spends flip-flops to buy zero decoding, a Johnson counter spends one gate per state to buy back half the flip-flops. Ring is MOD-n, direct feedback, one-hot; Johnson is MOD-2n, complemented feedback, fill-and-drain. For k output signals, a ring needs k flip-flops, a Johnson needs only k over 2. Decoding costs the ring 0 gates ever, the Johnson exactly one 2-input gate per state. And ring neighbours differ by 2 bits while Johnson neighbours differ by only 1 - which is why the Johnson counter\'s decoded outputs come out glitch-free.',
      transcriptHI: 'एक अकेला trade-off दोनों circuits समझा देता है: ring counter flip-flops ख़र्च करके शून्य decoding ख़रीदता है, Johnson counter प्रति state एक gate ख़र्च करके आधे flip-flops वापस ख़रीदता है। Ring MOD-n है, direct feedback, one-hot; Johnson MOD-2n है, complemented feedback, fill-and-drain। k output signals के लिए, ring को k flip-flops चाहिए, Johnson को सिर्फ़ k/2। Decoding ring को 0 gates लेती है कभी भी, Johnson को ठीक एक 2-input gate प्रति state। और ring के पड़ोसी 2 bits से अलग होते हैं जबकि Johnson के पड़ोसी सिर्फ़ 1 bit से - इसीलिए Johnson counter के decoded outputs glitch-free आते हैं।',
      visualNote: 'CompareTable: a computed StateTable of feedback / modulus / stages-for-8-signals / decode gates per state / adjacent Hamming distance, every cell derived from the actual generated sequences, not hardcoded.'
    },
    {
      id: 'S06_SelfStart',
      label: 'The Lockup Hazard & The Self-Start Fix',
      kind: 'theory',
      subtitle: "Neither counter is self-starting; the classic ring fix adds D0 = Q0'.Q1'.Q2' to escape the all-zeros lockup.",
      theoryEN: [
        "Here is the hazard hiding behind both circuits: a 4-bit register has 2^4 = 16 possible flip-flop states, but a ring counter's intended cycle uses only 4 of them and a Johnson counter's uses only 8. The rest are perfectly valid electrically, and nothing stops a real flip-flop from waking up in one of them when power is first applied - flip-flops have no built-in preference for which state they power up in.",
        'If that happens, the counter never "self-starts" onto its intended cycle - it just keeps obediently applying its feedback equation among the wrong states, forever, because the feedback equation on its own has no way to know which cycle it should be on. The worst case for a ring counter is landing on all-zeros: D0 = Q3 = 0 forever, so the register is frozen at 0000 for the entire life of the circuit, never producing a single 1.',
        'The classic fix adds a small amount of correction logic to the feedback path. Instead of the plain D0 = Q3, wire D0 = Q0\'.Q1\'.Q2\' - a 3-input AND of the first three outputs, all complemented. On the intended one-hot cycle this changes nothing: whenever exactly one bit is hot, Q0, Q1 and Q2 are all 0 at exactly the moment that hot bit is Q3, so Q0\'.Q1\'.Q2\' equals 1 exactly when Q3 does - the corrected equation silently agrees with the plain one everywhere on the good cycle.',
        "The fix only disagrees at the one dangerous state: 0000. There Q0=Q1=Q2=0, so the corrected D0 forces a 1 even though Q3 is also 0 - injecting a fresh one-hot bit and pulling the counter onto the valid cycle within a single clock, instead of leaving it stuck forever.",
        'A full simulation of all 16 states under the plain feedback equation, grouped by where each one eventually cycles, is honest about the fix\'s exact scope: it rescues the all-zeros lockup (its documented job) and, as a bonus, redirects the all-ones state too, but the remaining stray loops among the 16 states are untouched by this particular correction term - a fully bullet-proof design would need to examine every unused state and add whatever extra terms are needed to funnel each one home.'
      ],
      theoryHI: [
        "यहाँ है वह hazard जो दोनों circuits के पीछे छिपा है: एक 4-bit register में 2^4 = 16 संभव flip-flop states हैं, पर ring counter का इच्छित cycle उनमें से सिर्फ़ 4 वापरता है और Johnson counter का सिर्फ़ 8। बाक़ी बिजली की दृष्टि से पूरी तरह valid हैं, और कुछ भी एक असली flip-flop को power पहली बार लगने पर उनमें से किसी एक में जागने से नहीं रोकता - flip-flops के पास कोई built-in पसंद नहीं होती कि वे किस state में power up हों।",
        'अगर ऐसा हो, तो counter कभी अपने इच्छित cycle पर "self-start" नहीं करता - यह बस ग़लत states के बीच अपना feedback equation आज्ञाकारी ढंग से लगाता रहता है, हमेशा के लिए, क्योंकि feedback equation को अपने आप पता नहीं कि उसे किस cycle पर होना चाहिए। Ring counter के लिए सबसे बुरा मामला all-zeros पर उतरना है: D0 = Q3 = 0 हमेशा के लिए, तो register circuit की पूरी ज़िंदगी भर 0000 पर जमा रहता है, कभी एक भी 1 पैदा किए बिना।',
        "classic इलाज feedback path में थोड़ा correction logic जोड़ता है। सादे D0 = Q3 की जगह, D0 = Q0'.Q1'.Q2' wire कीजिए - पहले तीन outputs का एक 3-input AND, सब complemented। इच्छित one-hot cycle पर यह कुछ नहीं बदलता: जब भी ठीक एक bit hot है, Q0, Q1 और Q2 सब 0 होते हैं ठीक उसी पल जब वह hot bit Q3 हो, तो Q0'.Q1'.Q2' ठीक तभी 1 होता है जब Q3 होता है - corrected equation पूरे अच्छे cycle पर चुपचाप सादे वाले से सहमत रहता है।",
        'इलाज सिर्फ़ एक ख़तरनाक state पर असहमत होता है: 0000। वहाँ Q0=Q1=Q2=0, तो corrected D0 एक 1 मजबूर करता है भले ही Q3 भी 0 हो - एक ताज़ा one-hot bit inject करते हुए और counter को एक ही clock में valid cycle पर खींचते हुए, इसके बजाय कि वह हमेशा के लिए फँसा रहे।',
        'सादे feedback equation के तहत सभी 16 states का पूरा simulation, हर एक आख़िर में कहाँ cycle करता है इससे समूहीकृत, इलाज के ठीक दायरे के बारे में ईमानदार है: यह all-zeros lockup को बचाता है (इसका दर्ज काम) और, bonus में, all-ones state को भी redirect करता है, पर 16 states के बीच बाक़ी बचे भटके loops इस ख़ास correction term से अछूते रहते हैं - एक पूरी तरह bullet-proof design को हर अनवापरे state की जाँच करके जो भी अतिरिक्त terms चाहिए वे जोड़ने पड़ेंगे ताकि हर एक घर पहुँच जाए।'
      ],
      transcriptEN: "A 4-bit register has 16 possible states, but a ring counter's cycle uses only 4 and a Johnson counter's only 8 - the rest are valid but unintended, and a flip-flop can power up in any of them. Worst case for a ring counter: all-zeros, D0 equals Q3 equals 0 forever, frozen at 0000 for good. The classic fix wires D0 equals Q0-prime AND Q1-prime AND Q2-prime instead of plain Q3. On the good cycle this changes nothing, since Q0 Q1 Q2 are all zero exactly when the hot bit is Q3. But at 0000 it forces a 1, injecting a fresh bit and recovering in one clock. A full simulation of all 16 states shows the fix rescues all-zeros and, as a bonus, all-ones - but leaves the other stray loops untouched.",
      transcriptHI: "एक 4-bit register में 16 संभव states हैं, पर ring counter का cycle सिर्फ़ 4 वापरता है और Johnson counter का सिर्फ़ 8 - बाक़ी valid हैं पर अनइच्छित, और एक flip-flop उनमें से किसी में भी power up हो सकता है। Ring counter के लिए सबसे बुरा मामला: all-zeros, D0 बराबर Q3 बराबर 0 हमेशा के लिए, 0000 पर हमेशा के लिए जमा। Classic इलाज सादे Q3 की जगह D0 बराबर Q0-prime AND Q1-prime AND Q2-prime wire करता है। अच्छे cycle पर यह कुछ नहीं बदलता, चूँकि Q0 Q1 Q2 सब शून्य ठीक तभी होते हैं जब hot bit Q3 हो। पर 0000 पर यह एक 1 मजबूर करता है, एक ताज़ा bit inject करते हुए और एक clock में recover करते हुए। सभी 16 states का पूरा simulation दिखाता है कि इलाज all-zeros को बचाता है और, bonus में, all-ones को भी - पर बाक़ी भटके loops को अछूता छोड़ता है।",
      visualNote: 'SelfStartDemo: a live linear 4-bit ring with a fix toggle and a "force lockup to 0000" button, plus a computed table of every distinct cycle among all 16 states and whether the fix rescues it.'
    },
    {
      id: 'S07_Decoding',
      label: 'Johnson Decoding, One Gate Per State',
      kind: 'theory',
      subtitle: 'Every one of the 2n states decodes with exactly one 2-input gate, no matter how long the counter is.',
      theoryEN: [
        "Here is the fact worth memorising about Johnson counters: however many flip-flops n you use, every one of its 2n states can be told apart from all the others using just two of the flip-flop outputs, ANDed together - one 2-input gate, full stop. That is a remarkably small price for a counter that is not one-hot.",
        'The reason is the shape of the sequence itself. Because the 1s always sit together as one unbroken block that slides and grows or shrinks around the loop (never scattered), each state is uniquely marked by where that block\'s two edges currently sit. Pick the flip-flop just inside the rising edge of the block and the flip-flop just inside the falling edge, AND the right true/complemented pair of those two, and only that one state makes both literals 1 at once.',
        'This module derives every gate by search rather than memorising a formula: for each of the 8 states in the 4-bit example, every pair of the four outputs is tried, in both true and complemented form, until a pair is found that reads 1 at that state and 0 at all 7 others. A solution always exists, and the search below finds one for every single state live in your browser.',
        "Watch the found gate work on the live counter: step through the 8 states and, at each one, the discovered 2-literal AND lights up to exactly 1 only while the counter sits in the state it was built to catch, and drops to 0 the instant the counter moves on - proof, not assertion, that the one-gate claim holds.",
        'That "regardless of length" clause is the real payoff. The same slide-the-block argument holds for a 5-bit, MOD-10 Johnson counter, a 6-bit, MOD-12 one, or any size - the rising and falling edges of the 1-block are always exactly two flip-flops, so the gate count per state never grows past one, which is why Johnson counters stay cheap to decode even as they scale up.'
      ],
      theoryHI: [
        "Johnson counters के बारे में याद रखने लायक़ तथ्य यह है: आप चाहे कितने भी flip-flops n वापरें, इसकी 2n states में से हर एक को बाक़ी सबसे अलग बताया जा सकता है सिर्फ़ दो flip-flop outputs वापरकर, AND किए हुए - एक 2-input gate, बस। यह एक counter के लिए बेहद छोटी क़ीमत है जो one-hot नहीं है।",
        'वजह ख़ुद sequence का आकार है। चूँकि 1s हमेशा एक अटूट block की तरह साथ बैठते हैं जो loop भर सरकता और बढ़ता-घटता है (कभी बिखरा नहीं), हर state उसकी अनोखी पहचान इससे मिलती है कि उस block के दो किनारे अभी कहाँ बैठे हैं। block के rising edge के ठीक अंदर वाला flip-flop और falling edge के ठीक अंदर वाला flip-flop चुनिए, उन दोनों का सही true/complemented जोड़ा AND कीजिए, और सिर्फ़ वही एक state दोनों literals को एक साथ 1 बनाती है।',
        'यह module हर gate को formula याद करने के बजाय search से derive करता है: 4-bit उदाहरण की 8 states में से हर एक के लिए, चारों outputs का हर जोड़ा, true और complemented दोनों रूपों में, तब तक आज़माया जाता है जब तक एक ऐसा जोड़ा न मिले जो उस state पर 1 और बाक़ी 7 पर 0 पढ़े। एक हल हमेशा मौजूद होता है, और नीचे की search आपके browser में live हर एक state के लिए एक ढूँढ लेती है।',
        'मिले gate को live counter पर काम करते देखिए: 8 states में step-through कीजिए और, हर एक पर, खोजा गया 2-literal AND ठीक तभी 1 जलता है जब counter उसी state में बैठा हो जिसे पकड़ने को यह बना था, और जिस पल counter आगे बढ़े 0 पर गिर जाता है - सबूत, दावा नहीं, कि एक-gate का दावा सही है।',
        '"चाहे लंबाई कुछ भी हो" वाला हिस्सा असली फ़ायदा है। वही block-सरकाने वाला तर्क एक 5-bit, MOD-10 Johnson counter, एक 6-bit, MOD-12, या किसी भी आकार के लिए सही रहता है - 1-block के rising और falling edges हमेशा ठीक दो flip-flops होते हैं, तो प्रति state gate की गिनती कभी एक से आगे नहीं बढ़ती, इसीलिए Johnson counters बड़े होने पर भी decode करने में सस्ते रहते हैं।'
      ],
      transcriptEN: 'However many flip-flops a Johnson counter uses, every one of its 2n states can be told apart with just two outputs ANDed together - one 2-input gate. The 1s always sit as one unbroken sliding block, so each state is marked by where its two edges sit - pick the flip-flop just inside the rising edge and the one just inside the falling edge, AND the right polarities, and only that state lights both literals. This module derives every gate by brute-force search rather than a memorised formula, and proves it live: step through the 8 states and watch the found gate read 1 only at its own state. The same argument holds at any length, which is why Johnson counters stay cheap to decode as they scale.',
      transcriptHI: 'Johnson counter चाहे कितने भी flip-flops वापरे, उसकी 2n states में से हर एक को सिर्फ़ दो outputs AND करके अलग बताया जा सकता है - एक 2-input gate। 1s हमेशा एक अटूट सरकते block की तरह बैठते हैं, तो हर state की पहचान इससे होती है कि उसके दो edges कहाँ बैठे हैं - rising edge के ठीक अंदर वाला flip-flop और falling edge के ठीक अंदर वाला चुनिए, सही polarities AND कीजिए, और सिर्फ़ वही state दोनों literals जलाती है। यह module हर gate को याद किए formula के बजाय brute-force search से derive करता है, और इसे live साबित करता है: 8 states में step-through कीजिए और मिले gate को सिर्फ़ अपनी state पर 1 पढ़ते देखिए। वही तर्क किसी भी लंबाई पर सही रहता है, इसीलिए Johnson counters बड़े होने पर भी decode करने में सस्ते रहते हैं।',
      visualNote: 'JohnsonDecodeMap: a live 8-state Johnson counter beside its brute-force-derived 2-literal decode gate, stepping through every state and showing the gate output flip to 1 only at its own state, plus the full computed table.'
    },
    {
      id: 'S08_Analogy',
      label: 'The Carousel and the Twisted Loop',
      kind: 'theory',
      subtitle: 'A carousel with one lit seat is the ring; a belt given a half-twist before it is joined is the Johnson.',
      theoryEN: [
        "Picture a carousel: n seats bolted around a circular platform, and at any instant a single spotlight is lit on exactly one seat. As the platform turns, the light hands off to the next seat in line, and after n positions it is back on the seat where it started. That is the ring counter exactly - direct feedback closes a genuine circle, one lit position marching around it, MOD-n.",
        "Now build the platform differently: take the same loop of belt, but before you join its two ends, give the belt a single half-twist - the way you would start building a Möbius strip out of a paper ring. Mark one edge of the belt at the join. Follow that mark around: after one full lap it has swapped which face of the belt it is on, because of the twist, and it needs a SECOND full lap to return to its exact original face and position.",
        "That two-lap trip is the Johnson counter's MOD-2n written as geometry. The n physical stations on the belt are the n flip-flops; the single twist is the one inverter in the feedback path; and the fact that it takes two full laps, not one, to return home is exactly why n flip-flops produce 2n distinct states instead of n. The 'switched-tail' name is literal: the tail of the loop is switched to the opposite face before it rejoins the head.",
        'Both pictures obey the same facts you already derived, they just make them visible. On the carousel, exactly one seat is ever lit - one-hot, and reading which seat is lit needs no extra instrument, exactly like the ring counter needing zero decode gates. On the twisted belt, the mark drifts smoothly from one face to the other one small step at a time, never jumping - exactly like the Johnson counter\'s Hamming distance of 1 between neighbouring states.',
        "Keep both pictures side by side as you finish the module: the carousel for the ring counter's clean, cost-free one-hot decode, and the twisted belt for the Johnson counter's extra mileage - double the states from the same flip-flops, paid for with one small twist in the feedback wire and one small gate per state to read it back out."
      ],
      theoryHI: [
        'एक carousel सोचिए: n seats एक गोल platform पर बोल्ट की हुई, और किसी भी पल एक अकेली spotlight ठीक एक seat पर जली है। जैसे platform घूमता है, light अगली seat को सौंप दी जाती है, और n positions बाद यह उसी seat पर वापस आ जाती है जहाँ से शुरू हुई थी। यही ring counter है बिल्कुल - direct feedback एक असली circle बंद करता है, एक जली position उसके इर्द-गिर्द मार्च करती हुई, MOD-n।',
        'अब platform को अलग तरह बनाइए: वही belt का loop लीजिए, पर इसके दोनों सिरे जोड़ने से पहले, belt को एक अकेला आधा-मोड़ दीजिए - जैसे आप एक paper ring से Möbius strip बनाना शुरू करते हैं। जोड़ पर belt के एक किनारे को निशान लगाइए। उस निशान का पीछा कीजिए: एक पूरा चक्कर बाद यह बदल चुका है कि belt की कौन सी सतह पर है, मोड़ के कारण, और इसे अपनी ठीक मूल सतह और position पर लौटने को एक दूसरा पूरा चक्कर चाहिए।',
        "वह दो-चक्कर वाला सफ़र Johnson counter का MOD-2n है geometry के रूप में लिखा हुआ। Belt पर n भौतिक stations n flip-flops हैं; अकेला मोड़ feedback path में वह एक inverter है; और यह तथ्य कि घर लौटने को दो पूरे चक्कर चाहिए, एक नहीं, ठीक-ठीक वजह है कि n flip-flops n के बजाय 2n अलग states देते हैं। 'switched-tail' नाम शब्दशः है: loop की tail head से फिर जुड़ने से पहले विपरीत सतह पर switch होती है।",
        'दोनों तस्वीरें वही तथ्य मानती हैं जो आप पहले derive कर चुके हैं, वे बस उन्हें दिखने लायक़ बनाती हैं। Carousel पर, हमेशा ठीक एक seat जली है - one-hot, और कौन सी seat जली है यह पढ़ने को कोई अतिरिक्त यंत्र नहीं चाहिए, ठीक जैसे ring counter को शून्य decode gates चाहिए। मुड़े belt पर, निशान एक सतह से दूसरी पर धीरे-धीरे, एक छोटे कदम में सरकता है, कभी कूदता नहीं - ठीक जैसे Johnson counter की पड़ोसी states के बीच Hamming distance 1।',
        'Module ख़त्म करते हुए दोनों तस्वीरें साथ रखिए: carousel ring counter के साफ़, मुफ़्त one-hot decode के लिए, और मुड़ा belt Johnson counter की अतिरिक्त mileage के लिए - उन्हीं flip-flops से दोगुने states, feedback wire में एक छोटे मोड़ और इसे वापस पढ़ने को प्रति state एक छोटे gate की क़ीमत पर।'
      ],
      transcriptEN: "Picture a carousel: n seats, one spotlight lit at a time, handed to the next seat each turn, back home after n positions - that is the ring counter, direct feedback, one-hot, MOD-n. Now twist the belt half a turn before joining its ends, like starting a Möbius strip, and mark one edge: it takes two full laps to return to its exact original face - that is the Johnson counter's MOD-2n as geometry, the twist is the one inverter, and the second lap is why n flip-flops give 2n states. The carousel shows the ring's free one-hot decode; the twisted belt shows the Johnson counter's Hamming-distance-1 smoothness.",
      transcriptHI: 'एक carousel सोचिए: n seats, एक समय में एक spotlight जली, हर बार अगली seat को सौंपी, n positions बाद घर वापस - यही ring counter है, direct feedback, one-hot, MOD-n। अब belt को सिरे जोड़ने से पहले आधा मोड़ दीजिए, जैसे एक Möbius strip शुरू करना, और एक किनारे को निशान लगाइए: अपनी ठीक मूल सतह पर लौटने को दो पूरे चक्कर चाहिए - यही Johnson counter का MOD-2n है geometry के रूप में, मोड़ वह एक inverter है, और दूसरा चक्कर वजह है कि n flip-flops 2n states देते हैं। Carousel ring के मुफ़्त one-hot decode दिखाता है; मुड़ा belt Johnson counter की Hamming-distance-1 चिकनाई दिखाता है।',
      visualNote: 'Two live RingCounterViz side by side captioned carousel (johnson=false) and twisted ride (johnson=true), plus a MobiusAnalogy strip showing a token needing two laps of 4 to complete one 8-step Johnson cycle.'
    },
    {
      id: 'S09_Build',
      label: 'Build It For Real',
      kind: 'theory',
      subtitle: 'Wire the twisted tail yourself and watch the fill-and-drain pattern march out live.',
      theoryEN: [
        "You have iterated both feedback equations in code and watched both counters run live on screen. The only step left is to wire the actual flip-flops yourself and watch the same fill-and-drain pattern come out of real gates.",
        "Start from a 4-bit shift register: four D flip-flops, each Q feeding the next D, all sharing one clock - exactly the chain you built in the registers module. The only new wire is the one that closes the loop.",
        "For a plain ring counter, run the last flip-flop's Q straight back to the first flip-flop's D and preset the register to one lone 1. For the Johnson counter you are about to build, add a single inverter on that same closing wire and start the register at all zeros instead.",
        'Clock it by hand and watch what you predicted on paper appear on the workbench: 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001, and back to 0000 - eight distinct states from four flip-flops, one inverter, and nothing else.',
        'Once it runs, try wiring the single 2-input decode gate you derived earlier for one chosen state, and confirm on the real circuit that it lights up only while the counter sits in exactly that state.'
      ],
      theoryHI: [
        'आप code में दोनों feedback equations iterate कर चुके हैं और screen पर दोनों counters को live चलते देख चुके हैं। बचा हुआ इकलौता कदम है असली flip-flops ख़ुद wire करना और वही fill-and-drain pattern असली gates से निकलते देखना।',
        'एक 4-bit shift register से शुरू कीजिए: चार D flip-flops, हर Q अगले D को feed करता, सब एक clock साझा करते - ठीक वही chain जो आपने registers module में बनाई थी। इकलौती नई wire वह है जो loop बंद करती है।',
        'एक सादे ring counter के लिए, आख़िरी flip-flop के Q को सीधे पहले flip-flop के D तक वापस चलाइए और register को एक अकेले 1 पर preset कीजिए। जो Johnson counter आप अभी बनाने वाले हैं उसके लिए, उसी बंद करने वाली wire पर एक अकेला inverter जोड़िए और register को इसके बजाय सभी zeros पर शुरू कीजिए।',
        'इसे हाथ से clock कीजिए और देखिए जो आपने काग़ज़ पर अनुमान लगाया था वह workbench पर दिखता है: 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001, और वापस 0000 - चार flip-flops, एक inverter, और कुछ नहीं से आठ अलग states।',
        'एक बार यह चले, तो पहले derive किया अकेला 2-input decode gate किसी चुनी state के लिए wire करके देखिए, और असली circuit पर पुष्टि कीजिए कि यह सिर्फ़ तभी जलता है जब counter ठीक उसी state में बैठा हो।'
      ],
      transcriptEN: "You have iterated both equations in code and watched both counters run live - now wire the real flip-flops. Start from a 4-bit shift register with a common clock, then close the loop: straight back for a ring counter seeded with one 1, or through one inverter for a Johnson counter seeded at all zeros. Clock it by hand and watch 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001, back to 0000 appear on real hardware. Then wire the single decode gate you derived and confirm it lights only in its own state.",
      transcriptHI: 'आपने code में दोनों equations iterate किए और दोनों counters को live चलते देखा - अब असली flip-flops wire कीजिए। एक common clock वाले 4-bit shift register से शुरू कीजिए, फिर loop बंद कीजिए: एक ring counter के लिए सीधे वापस, एक 1 से seeded, या एक Johnson counter के लिए एक inverter से, सभी zeros से seeded। इसे हाथ से clock कीजिए और असली hardware पर 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001, वापस 0000 दिखते देखिए। फिर derive किया अकेला decode gate wire कीजिए और पुष्टि कीजिए कि यह सिर्फ़ अपनी state में जलता है।',
      visualNote: 'WorkbenchCTA linking to the johnson-counter guided build.'
    },
    {
      id: 'S10_Flashcards',
      label: 'Flip To Remember',
      kind: 'flashcards',
      subtitle: 'Eight cards on ring vs Johnson feedback, one-hot, MOD-n vs MOD-2n, decoding and the self-start fix.',
      theoryEN: [
        'Flip each card to turn a term into the real logic behind it.',
        'Ring and Johnson feedback, one-hot, zero-decode vs one-gate decode, Hamming distance, the lockup hazard and its fix, and the real-world uses - the whole module on eight cards.'
      ],
      theoryHI: [
        'हर card पलटकर एक पद को उसके पीछे की असली logic में बदलिए।',
        'Ring और Johnson feedback, one-hot, zero-decode बनाम one-gate decode, Hamming distance, lockup hazard और उसका fix, और असली उपयोग - पूरा module आठ cards पर।'
      ],
      transcriptEN: 'Flip through eight flashcards covering ring and Johnson feedback, one-hot, decoding cost, Hamming distance, the lockup hazard and its fix, and where each counter is actually used.',
      transcriptHI: 'ring और Johnson feedback, one-hot, decoding लागत, Hamming distance, lockup hazard और उसके fix, और हर counter कहाँ असल में वापरा जाता है इन्हें कवर करते आठ flashcards पलटिए।',
      visualNote: 'SubFlashCards: eight flip cards, term on the front, the computed logic on the back.'
    },
    {
      id: 'S11_Quiz',
      label: "Prove You've Got It",
      kind: 'quiz',
      subtitle: 'Seven questions across feedback equations, modulus, decoding cost and the self-start fix.',
      theoryEN: [
        'Seven questions to check every idea in the module.',
        'The two feedback equations, the 4-bit ring and Johnson modulus, why decoding is free or nearly free, and the lockup hazard with its classic fix.'
      ],
      theoryHI: [
        'Module के हर विचार को जाँचने को सात सवाल।',
        'दोनों feedback equations, 4-bit ring और Johnson modulus, decoding मुफ़्त या लगभग मुफ़्त क्यों है, और lockup hazard उसके classic fix के साथ।'
      ],
      transcriptEN: 'Seven questions on the ring and Johnson feedback equations, their modulus, decoding cost, and the lockup hazard and its fix.',
      transcriptHI: 'Ring और Johnson feedback equations, उनके modulus, decoding लागत, और lockup hazard व उसके fix पर सात सवाल।',
      visualNote: 'QuizScene: seven graded multiple-choice questions with explanations.'
    },
    {
      id: 'S12_Recap',
      label: 'Full Circle',
      kind: 'recap',
      subtitle: 'From a shift register with its tail wired to its head, to two counters that need almost no decoding at all.',
      theoryEN: [
        "Both counters in this module are the same idea: take a shift register, close it into a loop by wiring the last output back to the first input, and let it recycle whatever you seeded it with. The ring counter runs that wire straight, D0 = Q(n-1), and stays one-hot forever, cycling through exactly n states, MOD-n, with zero decoding needed because the hot bit already is the state.",
        "Cross that same wire through one inverter, D0 = Q(n-1)', and the shift register becomes a Johnson counter: the same n flip-flops now fill with 1s and drain back out, visiting 2n states, MOD-2n, with every neighbouring state exactly one bit apart - a Hamming distance of 1 that keeps every decoded output glitch-free. The whole trade-off is flip-flops versus gates: the ring counter spends flip-flops to buy zero decoding, the Johnson counter spends one small 2-input gate per state to buy back half the flip-flops.",
        "Neither counter starts itself. Of the 2^n total flip-flop states only n or 2n sit on the intended cycle, so a bad power-up state can strand the counter forever - the ring counter's worst case is freezing at all-zeros. The classic fix, D0 = Q0'.Q1'.Q2', agrees with plain feedback everywhere on the valid cycle but forces a fresh 1 the instant the register hits all-zeros, recovering within a single clock.",
        "You proved by brute-force search, live in your browser, that any of a Johnson counter's states can be decoded with exactly one 2-input AND gate of the right two outputs - regardless of how long the counter grows - because the sliding block of 1s always has exactly two edges to key off.",
        'The carousel and the twisted belt are the same two facts made visible: one lit seat marching around a plain circle is the ring counter\'s free one-hot read, and a belt with a single half-twist needing two full laps to return to its exact starting face is the Johnson counter\'s MOD-2n. You have now built both counters live, fixed the lockup hazard, derived the decode gates from scratch, and wired the twisted tail for real on the workbench.'
      ],
      theoryHI: [
        "इस module के दोनों counters एक ही विचार हैं: एक shift register लीजिए, आख़िरी output को वापस पहले input से wire करके इसे एक loop में बंद कीजिए, और इसे वही recycle करने दीजिए जो आपने seed किया। Ring counter उस wire को सीधा चलाता है, D0 = Q(n-1), और हमेशा one-hot रहता है, ठीक n states के चक्कर लगाते हुए, MOD-n, कोई decoding चाहिए नहीं क्योंकि hot bit पहले से ही state है।",
        "वही wire एक inverter से पार कराइए, D0 = Q(n-1)', और shift register एक Johnson counter बन जाता है: वही n flip-flops अब 1s से भरते हैं और वापस ख़ाली होते हैं, 2n states देखते हुए, MOD-2n, हर पड़ोसी state ठीक एक bit अलग - Hamming distance 1 जो हर decoded output को glitch-free रखती है। पूरा trade-off flip-flops बनाम gates है: ring counter flip-flops ख़र्च करके शून्य decoding ख़रीदता है, Johnson counter प्रति state एक छोटा 2-input gate ख़र्च करके आधे flip-flops वापस ख़रीदता है।",
        "कोई भी counter ख़ुद-शुरू नहीं होता। 2^n कुल flip-flop states में से सिर्फ़ n या 2n इच्छित cycle पर हैं, तो एक ग़लत power-up state counter को हमेशा के लिए फँसा सकता है - ring counter का सबसे बुरा मामला all-zeros पर जमना है। Classic इलाज, D0 = Q0'.Q1'.Q2', valid cycle पर हर जगह सादे feedback से सहमत रहता है पर register के all-zeros पर पहुँचते ही एक ताज़ा 1 मजबूर करता है, एक ही clock में recover करते हुए।",
        'आपने अपने browser में live brute-force search से साबित किया कि Johnson counter की किसी भी state को ठीक सही दो outputs के एक 2-input AND gate से decode किया जा सकता है - चाहे counter कितना भी लंबा हो जाए - क्योंकि 1s का सरकता block हमेशा ठीक दो edges रखता है जिन पर पकड़ बनाई जा सके।',
        'Carousel और मुड़ा belt वही दो तथ्य दिखने लायक़ बनाते हैं: एक सादे circle के इर्द-गिर्द मार्च करती एक जली seat ring counter का मुफ़्त one-hot read है, और एक अकेले आधे-मोड़ वाला belt जिसे अपनी ठीक मूल सतह पर लौटने को दो पूरे चक्कर चाहिए वह Johnson counter का MOD-2n है। अब आपने दोनों counters live बनाए हैं, lockup hazard ठीक किया है, decode gates शुरू से derive किए हैं, और twisted tail असली में workbench पर wire की है।'
      ],
      transcriptEN: 'Both counters close a shift register into a loop. Ring: direct feedback, one-hot forever, MOD-n, zero decoding. Johnson: one inverter in the feedback path, fill-and-drain, MOD-2n, Hamming distance 1, one gate per state to decode. Neither self-starts; the classic ring fix forces a 1 the instant it hits all-zeros. You derived the Johnson decode gates by brute-force search, and pictured both counters as a carousel and a twisted belt needing two laps home. Now go build the twisted tail for real.',
      transcriptHI: 'दोनों counters एक shift register को एक loop में बंद करते हैं। Ring: direct feedback, हमेशा one-hot, MOD-n, शून्य decoding। Johnson: feedback path में एक inverter, fill-and-drain, MOD-2n, Hamming distance 1, decode करने को प्रति state एक gate। कोई भी self-start नहीं करता; classic ring fix all-zeros पर पहुँचते ही एक 1 मजबूर करता है। आपने Johnson decode gates brute-force search से derive किए, और दोनों counters को एक carousel और घर लौटने को दो laps चाहने वाले मुड़े belt की तरह चित्रित किया। अब असली में twisted tail बनाने जाइए।',
      visualNote: 'RecapScene: the module FlowRail plus a closing Prose summary of both feedback equations, the trade-off, the fix and the decode derivation.'
    }
  ],
  flashcards: [
    {
      frontEN: 'Ring counter',
      backEN: "A circular shift register with direct feedback, D0 = Q(n-1). Seeded with a single 1, it stays one-hot forever, cycling through exactly n states (MOD-n) out of the 2^n possible.",
      frontHI: 'Ring counter',
      backHI: "Direct feedback वाला एक circular shift register, D0 = Q(n-1)। एक अकेले 1 से seeded, यह हमेशा one-hot रहता है, 2^n संभव में से ठीक n states (MOD-n) के चक्कर लगाते हुए।"
    },
    {
      frontEN: 'Johnson (twisted-ring / switched-tail) counter',
      backEN: "A circular shift register with complemented feedback, D0 = Q(n-1)'. Seeded at all zeros, it fills with 1s then drains back out, visiting 2n distinct states (MOD-2n) from the same n flip-flops.",
      frontHI: 'Johnson (twisted-ring / switched-tail) counter',
      backHI: "Complemented feedback वाला एक circular shift register, D0 = Q(n-1)'। सभी zeros से seeded, यह 1s से भरता है फिर वापस ख़ाली होता है, उन्हीं n flip-flops से 2n अलग states (MOD-2n) देखते हुए।"
    },
    {
      frontEN: "Zero decoding (ring counter)",
      backEN: "Because a ring counter's output is always one-hot, the single high Qi already IS the signal for state i - no decode gate is ever needed to know which state the counter is in.",
      frontHI: 'Zero decoding (ring counter)',
      backHI: "चूँकि ring counter का output हमेशा one-hot है, वह अकेला high Qi पहले से state i का signal है - counter किस state में है यह जानने को कभी कोई decode gate नहीं चाहिए।"
    },
    {
      frontEN: 'Johnson decoding, one gate per state',
      backEN: "Every one of a Johnson counter's 2n states can be decoded with exactly one 2-input AND of two of the flip-flop outputs, regardless of how long the counter is - because the block of 1s always has exactly two edges.",
      frontHI: 'Johnson decoding, प्रति state एक gate',
      backHI: 'Johnson counter की 2n states में से हर एक को ठीक एक 2-input AND से decode किया जा सकता है, चाहे counter कितना भी लंबा हो - क्योंकि 1s के block के हमेशा ठीक दो edges होते हैं।'
    },
    {
      frontEN: 'Hamming distance: ring (2) vs Johnson (1)',
      backEN: "A ring counter's neighbouring states differ by 2 bits (one turns off, the next turns on); a Johnson counter's neighbouring states differ by only 1 bit - Gray-code-like and glitch-free when decoded.",
      frontHI: 'Hamming distance: ring (2) बनाम Johnson (1)',
      backHI: 'Ring counter की पड़ोसी states 2 bits से अलग होती हैं (एक बंद, अगला चालू); Johnson counter की पड़ोसी states सिर्फ़ 1 bit से अलग होती हैं - Gray-code-जैसा और decode करने पर glitch-free।'
    },
    {
      frontEN: 'The lockup hazard (non-self-starting)',
      backEN: "Of a 4-bit register's 16 possible states, only n (ring) or 2n (Johnson) sit on the intended cycle. A flip-flop can power up in any of the rest, and the counter can circulate among the wrong states forever - it does not self-start.",
      frontHI: 'Lockup hazard (non-self-starting)',
      backHI: 'एक 4-bit register की 16 संभव states में से सिर्फ़ n (ring) या 2n (Johnson) इच्छित cycle पर हैं। एक flip-flop बाक़ी में से किसी में भी power up हो सकता है, और counter हमेशा के लिए ग़लत states के बीच circulate कर सकता है - यह self-start नहीं करता।'
    },
    {
      frontEN: "Ring self-start fix: D0 = Q0'.Q1'.Q2'",
      backEN: 'Replaces plain D0=Q3 with a 3-input AND of the first three outputs complemented. Agrees with plain feedback everywhere on the valid one-hot cycle, but forces a fresh 1 the moment the counter hits all-zeros, recovering in one clock.',
      frontHI: "Ring self-start fix: D0 = Q0'.Q1'.Q2'",
      backHI: 'सादे D0=Q3 की जगह पहले तीन outputs के complement का 3-input AND। Valid one-hot cycle पर हर जगह सादे feedback से सहमत, पर counter के all-zeros पर पहुँचते ही एक ताज़ा 1 मजबूर करता है, एक clock में recover करते हुए।'
    },
    {
      frontEN: 'Real-world uses',
      backEN: 'Ring counters walk a single active line: multiplexed 7-segment digit selection, round-robin bus arbitration. Johnson counters build decade (divide-by-10) counters and frequency dividers - 5 flip-flops give a clean MOD-10 with one-gate decoding per state.',
      frontHI: 'असली उपयोग',
      backHI: 'Ring counters एक अकेली active line घुमाते हैं: multiplexed 7-segment digit selection, round-robin bus arbitration। Johnson counters decade (divide-by-10) counters और frequency dividers बनाते हैं - 5 flip-flops एक साफ़ MOD-10 देते हैं प्रति state एक-gate decoding के साथ।'
    }
  ],
  quiz: [
    {
      questionEN: "What is the ring counter's feedback equation for an n-flip-flop register?",
      questionHI: 'n-flip-flop register के लिए ring counter का feedback equation क्या है?',
      options: [
        'D0 = Q(n-1) - the last output copied straight back to the first input',
        "D0 = Q(n-1)' - the last output complemented",
        'D0 = Q0 XOR Q(n-1)',
        'D0 is tied permanently to 1'
      ],
      answerIndex: 0,
      explainEN: 'The ring counter uses direct feedback: the last stage\'s output is wired unchanged to the first stage\'s input, so a seeded one-hot bit just circulates.',
      explainHI: "Ring counter direct feedback वापरता है: आख़िरी stage का output बिना बदले पहले stage के input से wired है, तो एक seeded one-hot bit बस circulate करता है।"
    },
    {
      questionEN: "What is the Johnson counter's feedback equation, and what does it change?",
      questionHI: 'Johnson counter का feedback equation क्या है, और यह क्या बदलता है?',
      options: [
        "D0 = Q(n-1)' - one inverter in the feedback path, doubling the useful states",
        'D0 = Q(n-1), identical to the ring counter',
        'D0 = Q0 AND Q(n-1)',
        'D0 is disconnected entirely'
      ],
      answerIndex: 0,
      explainEN: "The Johnson counter crosses the same feedback wire through one inverter, D0 = Q(n-1)'. That single twist takes the register from n one-hot states to 2n fill-and-drain states.",
      explainHI: "Johnson counter वही feedback wire एक inverter से पार कराता है, D0 = Q(n-1)'। वह एक मोड़ register को n one-hot states से 2n fill-and-drain states तक ले जाता है।"
    },
    {
      questionEN: 'A 4-bit ring counter cycles through how many valid states, and what is that called?',
      questionHI: 'एक 4-bit ring counter कितनी valid states के चक्कर लगाता है, और इसे क्या कहते हैं?',
      options: [
        '4 states - MOD-4, one lap every 4 clocks',
        '16 states - MOD-16',
        '8 states - MOD-8',
        '2 states - MOD-2'
      ],
      answerIndex: 0,
      explainEN: 'A ring counter with n flip-flops visits exactly n one-hot states before repeating - for n=4 that is 1000, 0100, 0010, 0001, a MOD-4 cycle.',
      explainHI: 'n flip-flops वाला ring counter दोहराने से पहले ठीक n one-hot states देखता है - n=4 के लिए यह है 1000, 0100, 0010, 0001, एक MOD-4 cycle।'
    },
    {
      questionEN: 'A 4-bit Johnson counter cycles through how many valid states?',
      questionHI: 'एक 4-bit Johnson counter कितनी valid states के चक्कर लगाता है?',
      options: [
        '8 states - MOD-8 (0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001)',
        '4 states - MOD-4, same as the ring counter',
        '16 states - every combination',
        '5 states'
      ],
      answerIndex: 0,
      explainEN: 'A Johnson counter with n flip-flops visits 2n states - for n=4 the register fills 0000 to 1111 then drains back to 0000, 8 states total.',
      explainHI: 'n flip-flops वाला Johnson counter 2n states देखता है - n=4 के लिए register 0000 से 1111 तक भरता है फिर वापस 0000 पर ख़ाली होता है, कुल 8 states।'
    },
    {
      questionEN: "Why does a ring counter need zero decoding gates to know its current state?",
      questionHI: "एक ring counter को अपनी मौजूदा state जानने के लिए शून्य decoding gates क्यों चाहिए?",
      options: [
        'Its output is always one-hot, so the single high Qi already IS the state-i signal',
        'It has a built-in decoder chip',
        'Its states never change',
        'Decoding is impossible for any counter'
      ],
      answerIndex: 0,
      explainEN: "Because exactly one Qi is high at any instant (one-hot), Qi itself already means 'state i' - there is nothing left to compute or gate.",
      explainHI: "चूँकि किसी भी पल ठीक एक Qi high है (one-hot), Qi ख़ुद ही 'state i' का मतलब रखता है - compute या gate करने को कुछ नहीं बचता।"
    },
    {
      questionEN: "How many flip-flop outputs does decoding any single Johnson-counter state need, ANDed together?",
      questionHI: 'किसी एक Johnson-counter state को decode करने के लिए कितने flip-flop outputs AND करने पड़ते हैं?',
      options: [
        'Exactly 2, regardless of how many flip-flops the counter has',
        'All n outputs, ANDed together',
        'n/2 outputs',
        'None - Johnson counters also need zero gates'
      ],
      answerIndex: 0,
      explainEN: 'Because the block of 1s in a Johnson counter always has exactly two edges, any state can be uniquely identified with a single 2-input AND of the right two outputs (true or complemented), no matter how long the counter is.',
      explainHI: 'चूँकि Johnson counter में 1s के block के हमेशा ठीक दो edges होते हैं, कोई भी state सही दो outputs (true या complemented) के एक 2-input AND से अनोखी पहचानी जा सकती है, चाहे counter कितना भी लंबा हो।'
    },
    {
      questionEN: 'A ring counter powers up at all-zeros (0000). What happens without a fix, and what is the classic fix?',
      questionHI: 'एक ring counter all-zeros (0000) पर power up होता है। बिना fix के क्या होता है, और classic fix क्या है?',
      options: [
        "It stays locked at 0000 forever (D0=Q3=0); the fix wires D0 = Q0'.Q1'.Q2' to force a 1 in and escape",
        'It automatically resets to 1000 on its own',
        'It counts up in binary instead',
        'It destroys the flip-flops'
      ],
      answerIndex: 0,
      explainEN: "With plain D0=Q3, 0000 feeds back 0 forever - a permanent lockup, since 0000 is not on the intended n-state cycle. The fix, D0 = Q0'.Q1'.Q2', agrees with plain feedback everywhere on the valid cycle but forces a 1 exactly at 0000, injecting a fresh bit and recovering within one clock.",
      explainHI: "सादे D0=Q3 के साथ, 0000 हमेशा 0 वापस feed करता है - एक स्थायी lockup, चूँकि 0000 इच्छित n-state cycle पर नहीं है। इलाज, D0 = Q0'.Q1'.Q2', valid cycle पर हर जगह सादे feedback से सहमत रहता है पर ठीक 0000 पर एक 1 मजबूर करता है, एक ताज़ा bit inject करते हुए और एक clock में recover करते हुए।"
    }
  ]
};
