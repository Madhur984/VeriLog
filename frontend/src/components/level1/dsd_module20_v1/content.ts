import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/20 - The BCD Adder ("The Odometer Hack").
 * Source: BCD_Adders___Odometer_Hack.mp4 + BCD_Adder_Logic.pdf + BCD_Addition_Logic.pdf.
 * BCD = 4 bits per decimal digit, valid 0000-1001 (0-9). A 4-bit adder reaches
 * 15, but a decimal digit stops at 9, so sums 10-19 are illegal. Detection:
 * C = K + Z8.Z4 + Z8.Z2 (K = carry out of adder-1; Z8 Z4 Z2 = preliminary sum
 * bits). When C = 1, add 6 (0110). Verified: 5+7 = 12 (1100) -> +6 -> 0001 0010.
 */
export const CONTENT: SubContent = {
  moduleTitle: "The BCD Adder - The Odometer Hack",
  moduleSubtitle: "A decimal odometer built from 4-bit wheels: when a wheel passes 9, add 6 to force it to roll over like a real digit.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The Odometer Hack",
      kind: "cover",
      subtitle: "Four bits can count to 15, but a decimal digit stops at 9. The fix is a single, beautiful +6.",
      theoryEN: [
        "This module builds the BCD adder - the circuit that adds numbers stored one decimal digit per 4 bits.",
        "The picture: a 4-bit group is an odometer wheel that wrongly has 16 positions, when a digit needs only 10.",
        "Positions 10 to 15 (1010 to 1111) are the 'forbidden six' - illegal BCD that must never appear.",
        "The hack: whenever a wheel's sum lands above 9, add 6 to skip the forbidden six and force a clean roll-over.",
        "You will leave able to detect the overflow (C = K + Z8.Z4 + Z8.Z2) and apply the +6 correction yourself."
      ],
      theoryHI: [
        "इस module में हम BCD adder बनाएँगे - वह circuit जो हर decimal digit को 4 bits में रखकर संख्याएँ जोड़ती है।",
        "तस्वीर: एक 4-bit समूह एक odometer wheel है जिसमें ग़लती से 16 positions हैं, जबकि एक digit को सिर्फ़ 10 चाहिए।",
        "Positions 10 से 15 (1010 से 1111) 'forbidden six' हैं - अवैध BCD जो कभी दिखना नहीं चाहिए।",
        "Hack: जब भी किसी wheel का sum 9 से ऊपर जाए, 6 जोड़कर forbidden six को छोड़िए और साफ़ roll-over करवाइए।",
        "अंत तक आप overflow पहचान पाएँगे (C = K + Z8.Z4 + Z8.Z2) और +6 सुधार ख़ुद लगा पाएँगे।"
      ],
      transcriptEN: "Welcome to the Odometer Hack. Picture the odometer in an old car: a row of wheels, each showing a single decimal digit, and when a wheel ticks past nine it rolls back to zero and nudges the wheel to its left. Computers store decimal the same way, four bits per digit, and they call it BCD - binary-coded decimal. But here's the bug built into the hardware: four bits can count all the way to fifteen, while a real decimal wheel only has ten positions, zero through nine. The six extra positions, ten through fifteen, are illegal - the forbidden six. So when you add two BCD digits and the raw sum lands in that forbidden zone, the wheel is stuck in a position that shouldn't exist. The fix is astonishingly clean: add six. That single nudge skips the forbidden six and forces the wheel to roll over to zero and carry, exactly like a proper decimal odometer. By the end you'll detect when correction is needed and apply that plus-six yourself.",
      transcriptHI: "Odometer Hack में आपका स्वागत है। पुरानी कार का odometer सोचिए: wheels की एक कतार, हर एक पर एक decimal digit, और जब कोई wheel नौ के पार टिकता है तो शून्य पर लौट जाता है और अपनी बाईं ओर वाले wheel को धकेल देता है। Computer decimal को इसी तरह रखते हैं, हर digit के लिए चार bits, और इसे BCD कहते हैं - binary-coded decimal। पर hardware में एक bug बना हुआ है: चार bits पंद्रह तक गिन सकते हैं, जबकि असली decimal wheel में सिर्फ़ दस positions हैं, शून्य से नौ। छह अतिरिक्त positions, दस से पंद्रह, अवैध हैं - forbidden six। तो जब आप दो BCD digits जोड़ते हैं और कच्चा sum उस forbidden क्षेत्र में पहुँचता है, wheel एक ऐसी position पर फँस जाता है जो होनी ही नहीं चाहिए। इसका इलाज हैरान कर देने वाला साफ़ है: छह जोड़ दीजिए। वह एक धक्का forbidden six को छोड़ देता है और wheel को शून्य पर roll-over करवा कर carry करवा देता है, बिलकुल एक सही decimal odometer की तरह। अंत तक आप पहचानेंगे कि सुधार कब चाहिए और वह plus-six ख़ुद लगाएँगे।",
      visualNote: "Hero: a car odometer with one 4-bit wheel; positions 0-9 in green, 10-15 in red marked 'forbidden'. A +6 arrow jumps the pointer over the red zone to a rolled-over 0 with a carry."
    },
    {
      id: "S01_Video",
      label: "BCD Adders & The Odometer Hack",
      kind: "video",
      subtitle: "A short film: why decimal-in-binary needs a +6 nudge.",
      theoryEN: [
        "Video framing: a binary adder happily produces sums up to 15, but valid BCD only goes up to 9.",
        "When a digit's sum exceeds 9, the 4-bit result is no longer a legal decimal digit.",
        "The correction is to add 6 (0110), which jumps over the six illegal codes and produces a carry.",
        "Watch the three-phase pipeline: add, detect the overflow, then conditionally add 6.",
        "Keep one example in mind: 5 + 7 = 12, which is 1100 - illegal, fixed by +6 into 0001 0010."
      ],
      theoryHI: [
        "Video का सार: एक binary adder ख़ुशी-ख़ुशी 15 तक sum बनाता है, पर वैध BCD सिर्फ़ 9 तक जाता है।",
        "जब किसी digit का sum 9 से ज़्यादा हो, तो 4-bit नतीजा अब वैध decimal digit नहीं रहता।",
        "सुधार है 6 (0110) जोड़ना, जो छह अवैध codes को छलाँग कर एक carry पैदा करता है।",
        "तीन-चरण pipeline देखिए: जोड़ो, overflow पहचानो, फिर शर्त के साथ 6 जोड़ो।",
        "एक उदाहरण मन में रखिए: 5 + 7 = 12, जो 1100 है - अवैध, +6 से ठीक होकर 0001 0010।"
      ],
      transcriptEN: "Here's the whole idea in one breath. A plain binary adder takes two four-bit groups and is perfectly happy to report any sum from zero up to fifteen. But in BCD, a four-bit group is supposed to be a single decimal digit, which only legally runs zero to nine. So the moment two BCD digits add up to ten or more, the adder hands you a bit pattern that simply isn't a valid decimal digit. The cure is a tiny, fixed nudge: add the number six, binary one-one-zero-zero - sorry, zero-one-one-zero. That plus-six leaps over the six illegal codes and, as a bonus, kicks out a carry to the next digit, which is exactly the roll-over a decimal odometer should do. The hardware does this in three phases: first add normally, then detect whether the sum overflowed past nine, then conditionally add six. Hold onto one running example throughout - five plus seven is twelve, which the adder first shows as one-one-zero-zero, an illegal code, and the plus-six repairs it into the clean BCD for twelve, zero-zero-zero-one zero-zero-one-zero.",
      transcriptHI: "पूरा विचार एक साँस में। एक सादा binary adder दो four-bit समूह लेता है और शून्य से पंद्रह तक कोई भी sum बताने में बिलकुल ख़ुश रहता है। पर BCD में, एक four-bit समूह को एक अकेला decimal digit होना चाहिए, जो वैध रूप से सिर्फ़ शून्य से नौ तक चलता है। तो जैसे ही दो BCD digits मिलकर दस या उससे ज़्यादा बनते हैं, adder आपको एक ऐसा bit pattern थमा देता है जो वैध decimal digit है ही नहीं। इलाज है एक नन्हा, तय धक्का: छह जोड़ दीजिए, binary में zero-one-one-zero। वह plus-six छह अवैध codes को छलाँग जाता है और, bonus में, अगले digit के लिए एक carry भी निकाल देता है, जो ठीक वही roll-over है जो एक decimal odometer को करना चाहिए। Hardware यह तीन चरणों में करता है: पहले सामान्य रूप से जोड़ो, फिर पहचानो कि sum नौ के पार overflow हुआ या नहीं, फिर शर्त के साथ छह जोड़ो। पूरे समय एक उदाहरण पकड़े रखिए - पाँच plus सात बारह है, जिसे adder पहले one-one-zero-zero दिखाता है, एक अवैध code, और plus-six इसे बारह के साफ़ BCD में ठीक कर देता है, zero-zero-zero-one zero-zero-one-zero।",
      visualNote: "Animated explainer: two 4-bit groups feed an adder; the result 1100 flashes red 'illegal', a +0110 block drops in, and the output becomes 0001 0010 with a carry to the next wheel."
    },
    {
      id: "S02_Forbidden",
      label: "BCD & The Forbidden Six",
      kind: "theory",
      subtitle: "Four bits, sixteen codes, but only ten are legal decimal digits.",
      theoryEN: [
        "BCD stores each decimal digit in its own 4-bit group, so the number 12 is 0001 0010, not plain binary 1100.",
        "Four bits have 16 codes (0000 to 1111), but a decimal digit needs only 10 (0 to 9 = 0000 to 1001).",
        "The six leftover codes, 1010 to 1111 (10 to 15), are the FORBIDDEN SIX - never a valid BCD digit.",
        "Think of each 4-bit group as one odometer wheel that has accidentally been given 16 stops instead of 10.",
        "The whole job of a BCD adder is to make sure a wheel never gets stuck on one of those six forbidden stops."
      ],
      theoryHI: [
        "BCD हर decimal digit को उसके अपने 4-bit समूह में रखता है, तो संख्या 12 है 0001 0010, सादा binary 1100 नहीं।",
        "चार bits में 16 codes हैं (0000 से 1111), पर एक decimal digit को सिर्फ़ 10 चाहिए (0 से 9 = 0000 से 1001)।",
        "बचे छह codes, 1010 से 1111 (10 से 15), FORBIDDEN SIX हैं - कभी वैध BCD digit नहीं।",
        "हर 4-bit समूह को एक odometer wheel समझिए जिसे ग़लती से 10 के बजाय 16 stops दे दिए गए हैं।",
        "BCD adder का पूरा काम यह पक्का करना है कि कोई wheel कभी उन छह forbidden stops पर न फँसे।"
      ],
      transcriptEN: "Let's get crystal clear about what BCD actually is. Binary-coded decimal keeps each decimal digit in its own little four-bit box. So the number twelve isn't stored as plain binary one-one-zero-zero; it's stored as two boxes, zero-zero-zero-one for the one and zero-zero-one-zero for the two. Now count the codes. Four bits give you sixteen possible patterns, zero-zero-zero-zero up to one-one-one-one. But a single decimal digit only needs ten of them, zero through nine, which is zero-zero-zero-zero through one-zero-zero-one. That leaves six patterns over - one-zero-one-zero through one-one-one-one, the values ten through fifteen - and in BCD those are simply illegal. We call them the forbidden six. Picture each four-bit group as an odometer wheel that was accidentally manufactured with sixteen stops when a decimal wheel should have exactly ten. The entire purpose of a BCD adder, everything we build in this module, is to guarantee that wheel never comes to rest on one of the six forbidden stops.",
      transcriptHI: "चलिए बिलकुल साफ़ हो जाएँ कि BCD है क्या। Binary-coded decimal हर decimal digit को उसके अपने छोटे चार-bit डिब्बे में रखता है। तो संख्या बारह सादा binary one-one-zero-zero के रूप में नहीं रखी जाती; यह दो डिब्बों में रखी जाती है, एक के लिए zero-zero-zero-one और दो के लिए zero-zero-one-zero। अब codes गिनिए। चार bits आपको सोलह संभव patterns देते हैं, zero-zero-zero-zero से one-one-one-one तक। पर एक अकेले decimal digit को इनमें से सिर्फ़ दस चाहिए, शून्य से नौ, यानी zero-zero-zero-zero से one-zero-zero-one। बचते हैं छह patterns - one-zero-one-zero से one-one-one-one, मान दस से पंद्रह - और BCD में ये बस अवैध हैं। हम इन्हें forbidden six कहते हैं। हर चार-bit समूह को एक odometer wheel समझिए जो ग़लती से सोलह stops के साथ बना दिया गया जबकि एक decimal wheel में ठीक दस होने चाहिए। इस module में हम जो कुछ बनाते हैं, BCD adder का वह पूरा मक़सद यही है कि वह wheel कभी उन छह forbidden stops में से किसी पर आकर न रुके।",
      visualNote: "OdometerWheel viz: 16 cells 0000..1111; 0-9 green and labelled with decimal, 10-15 red and labelled 'forbidden'. A pointer the student can drag."
    },
    {
      id: "S03_Gap",
      label: "The Sum Can Reach 19",
      kind: "theory",
      subtitle: "9 + 9 + 1 = 19, so every sum from 10 to 19 needs fixing.",
      theoryEN: [
        "The biggest a single BCD column can get is 9 (digit A) + 9 (digit B) + 1 (carry in) = 19.",
        "So a column's raw sum can be anything from 0 to 19 - and everything from 10 to 19 is out of legal range.",
        "Sums 0 to 9: already a valid BCD digit, no correction needed.",
        "Sums 10 to 15: the 4-bit result is one of the forbidden six - it looks wrong and must be corrected.",
        "Sums 16 to 19: the 4-bit adder even produced its own carry (K=1) - also needs the +6 correction."
      ],
      theoryHI: [
        "एक BCD column सबसे ज़्यादा हो सकता है 9 (digit A) + 9 (digit B) + 1 (carry in) = 19।",
        "तो किसी column का कच्चा sum 0 से 19 तक कुछ भी हो सकता है - और 10 से 19 तक सब कुछ वैध सीमा से बाहर है।",
        "Sum 0 से 9: पहले से वैध BCD digit, कोई सुधार नहीं चाहिए।",
        "Sum 10 से 15: 4-bit नतीजा forbidden six में से एक है - ग़लत दिखता है और सुधारना ज़रूरी है।",
        "Sum 16 से 19: 4-bit adder ने ख़ुद का carry भी बना दिया (K=1) - इसे भी +6 सुधार चाहिए।"
      ],
      transcriptEN: "How bad can a single column get? Let's find the worst case. In any one decimal column you add digit A, digit B, and possibly a carry coming in from the column to the right. The largest A can be is nine, the largest B can be is nine, and the carry in is at most one. Nine plus nine plus one is nineteen. So a column's raw sum lands somewhere between zero and nineteen. Now split that range. If the sum is zero through nine, wonderful - that's already a legal BCD digit and you leave it alone. If the sum is ten through fifteen, the four-bit adder shows you one of the forbidden six, a pattern that looks valid in binary but is illegal in BCD, so it must be corrected. And if the sum is sixteen through nineteen, it's so big the four-bit adder itself overflowed and threw its own carry bit; that case also needs correcting. So everything from ten to nineteen, the entire upper half, demands the fix. Only zero through nine gets a free pass.",
      transcriptHI: "एक column सबसे ख़राब कितना हो सकता है? चलिए worst case ढूँढें। किसी एक decimal column में आप digit A, digit B, और शायद दाईं ओर वाले column से आता एक carry जोड़ते हैं। A सबसे बड़ा नौ हो सकता है, B सबसे बड़ा नौ, और carry in अधिकतम एक। नौ plus नौ plus एक उन्नीस। तो किसी column का कच्चा sum शून्य से उन्नीस के बीच कहीं पहुँचता है। अब इस range को बाँटिए। अगर sum शून्य से नौ है, बढ़िया - वह पहले से वैध BCD digit है और आप उसे छोड़ देते हैं। अगर sum दस से पंद्रह है, तो four-bit adder आपको forbidden six में से एक दिखाता है, एक pattern जो binary में वैध दिखता है पर BCD में अवैध है, तो उसे सुधारना पड़ता है। और अगर sum सोलह से उन्नीस है, यह इतना बड़ा है कि four-bit adder ख़ुद overflow होकर अपना carry bit निकाल देता है; वह हालत भी सुधार माँगती है। तो दस से उन्नीस तक सब कुछ, पूरा ऊपरी आधा, सुधार माँगता है। सिर्फ़ शून्य से नौ को मुफ़्त छूट मिलती है।",
      visualNote: "A horizontal 0-19 number line. 0-9 green ('valid'), 10-15 amber ('forbidden six'), 16-19 rose ('overflow, K=1'). Labelled 'all 10-19 need +6'."
    },
    {
      id: "S04_Detect",
      label: "Detecting The Overflow",
      kind: "theory",
      subtitle: "C = K + Z8.Z4 + Z8.Z2 - the gate that decides whether to add 6.",
      theoryEN: [
        "Name the bits of the preliminary 4-bit sum: Z8 (the 8s bit), Z4, Z2, Z1. K is the carry out of that adder.",
        "Correction is needed (C = 1) whenever the sum is 10 to 19. The logic that detects this is C = K + Z8.Z4 + Z8.Z2.",
        "K catches 16 to 19 (the adder already overflowed). Z8.Z4 catches 12 to 15. Z8.Z2 catches 10, 11, 14, 15.",
        "Together those terms light up for every value 10 to 19 and stay dark for 0 to 9 - exactly the rule we want.",
        "It takes just three gates: two AND gates (Z8.Z4 and Z8.Z2) and one OR gate combining them with K."
      ],
      theoryHI: [
        "कच्चे 4-bit sum के bits के नाम: Z8 (8s bit), Z4, Z2, Z1। K उस adder का carry out है।",
        "सुधार तब चाहिए (C = 1) जब sum 10 से 19 हो। इसे पहचानने वाली logic है C = K + Z8.Z4 + Z8.Z2।",
        "K पकड़ता है 16 से 19 (adder पहले ही overflow)। Z8.Z4 पकड़ता है 12 से 15। Z8.Z2 पकड़ता है 10, 11, 14, 15।",
        "मिलकर ये terms हर मान 10 से 19 के लिए जलते हैं और 0 से 9 के लिए बुझे रहते हैं - ठीक वही नियम जो हमें चाहिए।",
        "इसमें बस तीन gates लगते हैं: दो AND gates (Z8.Z4 और Z8.Z2) और एक OR gate जो इन्हें K के साथ जोड़ता है।"
      ],
      transcriptEN: "Now the clever part - how does the hardware know when to add six? It reads the preliminary sum. Let's name its four bits by their decimal weights: Z8 is the eights bit, Z4 the fours, Z2 the twos, Z1 the ones. And K is the carry that spilled out of the four-bit adder. The detection rule is a single boolean expression: C equals K, OR Z8 AND Z4, OR Z8 AND Z2. Let's see why it's exactly right. The K term fires for sixteen through nineteen, because only those made the adder overflow. The Z8-AND-Z4 term fires whenever both the eights and fours bits are set, which is the values twelve through fifteen. The Z8-AND-Z2 term fires when the eights and twos bits are set, catching ten, eleven, fourteen, and fifteen. Overlay all three and you light up every single value from ten to nineteen, and crucially you stay completely dark for zero through nine. That's the rule we wanted, and it costs only three gates: two AND gates for the two product terms, and one OR gate to fold them together with K. Three little gates decide the whole correction.",
      transcriptHI: "अब चतुर हिस्सा - hardware को कैसे पता चलता है कि छह कब जोड़ना है? वह कच्चे sum को पढ़ता है। इसके चार bits को उनके decimal weights से नाम दें: Z8 आठ वाला bit, Z4 चार वाला, Z2 दो वाला, Z1 एक वाला। और K वह carry है जो four-bit adder से छलका। पहचान का नियम एक अकेली boolean expression है: C बराबर K, OR Z8 AND Z4, OR Z8 AND Z2। देखें यह ठीक क्यों है। K वाला term सोलह से उन्नीस के लिए जलता है, क्योंकि सिर्फ़ उन्हीं ने adder को overflow करवाया। Z8-AND-Z4 वाला term तब जलता है जब आठ और चार दोनों bits set हों, यानी मान बारह से पंद्रह। Z8-AND-Z2 वाला term तब जलता है जब आठ और दो वाले bits set हों, पकड़ता है दस, ग्यारह, चौदह, और पंद्रह। तीनों को ऊपर-नीचे रखिए और आप दस से उन्नीस तक का हर एक मान जला देते हैं, और अहम बात, शून्य से नौ के लिए बिलकुल बुझे रहते हैं। यही नियम हमें चाहिए था, और इसकी क़ीमत सिर्फ़ तीन gates: दो product terms के लिए दो AND gates, और इन्हें K के साथ जोड़ने के लिए एक OR gate। तीन छोटे gates पूरा सुधार तय कर देते हैं।",
      visualNote: "DetectFormula viz: a 0-19 slider showing K, Z8 Z4 Z2 Z1 as lit/dark bits, the three terms (K, Z8.Z4, Z8.Z2) lighting up, and the resulting C with a green 'ADD 6' / grey 'ADD 0' verdict."
    },
    {
      id: "S05_StateMatrix",
      label: "The BCD State Matrix",
      kind: "truth",
      subtitle: "Three rows that capture every case: when K and C fire, and what to add.",
      theoryEN: [
        "Sum 0 to 9: K = 0, C = 0, action ADD 0 (0000) - the digit is already valid.",
        "Sum 10 to 15: K = 0, C = 1, action ADD 6 (0110) - a forbidden-six pattern, corrected and a carry is generated.",
        "Sum 16 to 19: K = 1, C = 1, action ADD 6 (0110) - the adder overflowed; +6 still produces the right digit and carry.",
        "Notice C is 1 for every row that needs fixing, and the correction is always the same constant: add 6.",
        "The complete BCD adder is just 2 binary 4-bit adders plus 3 logic gates that implement this matrix."
      ],
      theoryHI: [
        "Sum 0 से 9: K = 0, C = 0, action ADD 0 (0000) - digit पहले से वैध है।",
        "Sum 10 से 15: K = 0, C = 1, action ADD 6 (0110) - forbidden-six pattern, सुधरता है और एक carry बनता है।",
        "Sum 16 से 19: K = 1, C = 1, action ADD 6 (0110) - adder overflow हुआ; +6 फिर भी सही digit और carry देता है।",
        "ग़ौर कीजिए हर सुधार-माँगती row के लिए C = 1 है, और सुधार हमेशा वही स्थिरांक है: 6 जोड़ो।",
        "पूरा BCD adder बस 2 binary 4-bit adders जमा 3 logic gates है जो यह matrix लागू करते हैं।"
      ],
      transcriptEN: "Let's compress everything into one tidy table, the BCD state matrix, with just three rows. Row one: the sum is zero through nine. The carry K is zero, the correction signal C is zero, and the action is to add zero - nothing to fix, the digit is already legal. Row two: the sum is ten through fifteen. The four-bit adder hasn't overflowed so K is still zero, but the result is one of the forbidden six, so C goes to one and the action is add six. That plus-six both repairs the digit and kicks out a carry to the next column. Row three: the sum is sixteen through nineteen. Now the four-bit adder has overflowed, so K is one, C is one, and again the action is add six. Look at the pattern: C is one in exactly the rows that need fixing, and the fix is never anything but the same constant, six. That regularity is why the whole circuit is so cheap - two four-bit binary adders and just three logic gates implementing this matrix, and you have a complete BCD adder.",
      transcriptHI: "चलिए सब कुछ एक सुथरी table में दबा दें, BCD state matrix, बस तीन rows के साथ। पहली row: sum शून्य से नौ। carry K शून्य, सुधार संकेत C शून्य, और action है शून्य जोड़ो - कुछ ठीक करने को नहीं, digit पहले से वैध है। दूसरी row: sum दस से पंद्रह। four-bit adder overflow नहीं हुआ तो K अब भी शून्य, पर नतीजा forbidden six में से एक है, तो C एक हो जाता है और action है छह जोड़ो। वह plus-six digit को भी सुधारता है और अगले column के लिए एक carry भी निकालता है। तीसरी row: sum सोलह से उन्नीस। अब four-bit adder overflow हो गया, तो K एक, C एक, और फिर action है छह जोड़ो। pattern देखिए: ठीक उन्हीं rows में C एक है जिन्हें सुधार चाहिए, और सुधार वही स्थिरांक छह के सिवा कभी कुछ नहीं। वही नियमितता है जिससे पूरी circuit इतनी सस्ती है - दो four-bit binary adders और बस तीन logic gates जो यह matrix लागू करते हैं, और आपके पास पूरा BCD adder है।",
      visualNote: "A clean 3-row table: Sum range | K | C | Action. Rows 0-9/0/0/ADD 0 (green), 10-15/0/1/ADD 6 (amber), 16-19/1/1/ADD 6 (rose)."
    },
    {
      id: "S06_Circuit",
      label: "The Two-Adder Blueprint",
      kind: "circuit",
      subtitle: "Adder 1 sums, three gates detect, Adder 2 applies +6 or +0.",
      theoryEN: [
        "Adder 1: a 4-bit binary adder takes digit A, digit B and the carry-in, producing the preliminary sum and K.",
        "Detection gates: two ANDs (Z8.Z4, Z8.Z2) and one OR combine with K to make the correction signal C.",
        "Adder 2: a second 4-bit binary adder adds 0110 (when C=1) or 0000 (when C=0) to the preliminary sum.",
        "Outputs: the corrected 4-bit BCD digit (S8 S4 S2 S1) and a clean carry-out (C) to the next BCD column.",
        "Total cost: 2 four-bit adders + 3 gates. Chain these blocks to add multi-digit BCD numbers."
      ],
      theoryHI: [
        "Adder 1: एक 4-bit binary adder digit A, digit B और carry-in लेता है, कच्चा sum और K बनाता है।",
        "Detection gates: दो AND (Z8.Z4, Z8.Z2) और एक OR, K के साथ मिलकर सुधार संकेत C बनाते हैं।",
        "Adder 2: एक दूसरा 4-bit binary adder कच्चे sum में 0110 (जब C=1) या 0000 (जब C=0) जोड़ता है।",
        "Outputs: सुधरा 4-bit BCD digit (S8 S4 S2 S1) और अगले BCD column के लिए साफ़ carry-out (C)।",
        "कुल लागत: 2 four-bit adders + 3 gates। multi-digit BCD संख्याएँ जोड़ने के लिए इन blocks को chain कीजिए।"
      ],
      transcriptEN: "Let's draw the machine. It's two adders with three gates wedged between them. The first adder is an ordinary four-bit binary adder. It takes your two BCD digits, A and B, plus any carry coming in from the right, and it produces a preliminary four-bit sum along with its own carry-out, K. Those preliminary sum bits and K now flow into the detection logic: two AND gates compute Z8-and-Z4 and Z8-and-Z2, and a single OR gate folds those two products together with K to produce the correction signal C. Now the second adder, also a four-bit binary adder, does the actual fixing. One of its inputs is the preliminary sum; the other is wired so that when C is one it adds zero-one-one-zero, which is six, and when C is zero it adds zero-zero-zero-zero, which leaves the sum untouched. The outputs are the final corrected BCD digit - S8, S4, S2, S1 - and a clean carry-out that feeds the next decimal column to the left. Add it all up: two four-bit adders and three gates per digit. Chain one block per digit and you can add BCD numbers of any length.",
      transcriptHI: "चलिए machine बनाएँ। यह दो adders है जिनके बीच तीन gates ठुँसे हैं। पहला adder एक साधारण four-bit binary adder है। यह आपके दो BCD digits, A और B, साथ ही दाईं ओर से आता कोई भी carry लेता है, और एक कच्चा four-bit sum अपने carry-out K के साथ बनाता है। वे कच्चे sum bits और K अब detection logic में बहते हैं: दो AND gates, Z8-and-Z4 और Z8-and-Z2 निकालते हैं, और एक अकेला OR gate उन दो products को K के साथ मोड़कर सुधार संकेत C बनाता है। अब दूसरा adder, वह भी एक four-bit binary adder, असली सुधार करता है। इसका एक input कच्चा sum है; दूसरा ऐसे wire किया है कि जब C एक हो तो वह zero-one-one-zero जोड़े, यानी छह, और जब C शून्य हो तो zero-zero-zero-zero जोड़े, जो sum को अछूता छोड़ देता है। Outputs हैं आख़िरी सुधरा BCD digit - S8, S4, S2, S1 - और एक साफ़ carry-out जो बाईं ओर वाले अगले decimal column को feed करता है। सब जोड़िए: हर digit के लिए दो four-bit adders और तीन gates। हर digit के लिए एक block chain कीजिए और आप किसी भी लंबाई की BCD संख्याएँ जोड़ सकते हैं।",
      visualNote: "Schematic: A,B,Cin -> [4-bit ADDER 1] -> Z8 Z4 Z2 Z1 + K. Two AND gates and an OR produce C. C selects 0110/0000 into [4-bit ADDER 2] -> S8 S4 S2 S1 + carry-out."
    },
    {
      id: "S07_AdderDemo",
      label: "Build & Run A BCD Adder",
      kind: "activity",
      subtitle: "Set two decimal digits and a carry-in; watch the raw sum, the C signal, and the +6 fix.",
      theoryEN: [
        "Interactive: choose digit A (0-9), digit B (0-9) and a carry-in (0 or 1).",
        "The panel shows the raw 4-bit sum, the bits Z8 Z4 Z2 Z1, the carry K, and the detection signal C.",
        "When C = 1 it adds 0110 and lights the carry-out; when C = 0 it adds 0000 and leaves the digit as-is.",
        "Try 5 + 7: raw sum 12 (1100) is illegal, so +6 gives 0001 0010 - the BCD for twelve.",
        "Try 9 + 9 + 1 (carry-in): the worst case 19, where K=1 and +6 yields BCD 0001 1001."
      ],
      theoryHI: [
        "Interactive: digit A (0-9), digit B (0-9) और एक carry-in (0 या 1) चुनिए।",
        "Panel दिखाता है कच्चा 4-bit sum, bits Z8 Z4 Z2 Z1, carry K, और detection संकेत C।",
        "जब C = 1 तो यह 0110 जोड़ता है और carry-out जलाता है; जब C = 0 तो 0000 जोड़ता है और digit वैसा ही रहता है।",
        "आज़माइए 5 + 7: कच्चा sum 12 (1100) अवैध है, तो +6 देता है 0001 0010 - बारह का BCD।",
        "आज़माइए 9 + 9 + 1 (carry-in): worst case 19, जहाँ K=1 और +6 देता है BCD 0001 1001।"
      ],
      transcriptEN: "Now you build and run one. Pick digit A, digit B, and whether a carry is coming in. The panel performs all three phases live. It first shows the raw four-bit sum and breaks it into its bits, Z8 Z4 Z2 Z1, alongside the adder's carry K. Then it evaluates the detection signal C from K and those bits, lighting it green when correction is needed. Finally it adds either zero-one-one-zero or zero-zero-zero-zero and shows the final BCD digit plus the carry-out to the next column. Start with the running example, five plus seven. The raw sum is twelve, which appears as one-one-zero-zero, a forbidden code, so C lights up and the plus-six produces zero-zero-zero-one zero-zero-one-zero - the proper BCD for twelve, a one and a two. Then push it to the absolute limit: nine plus nine plus a carry-in of one, the worst case of nineteen. Watch K go high all on its own, C light up, and the plus-six deliver BCD one-nine. Once you can predict the C signal before the panel does, you truly own the BCD adder.",
      transcriptHI: "अब आप एक बनाकर चलाइए। digit A, digit B, और क्या carry आ रहा है, चुनिए। Panel तीनों चरण live करता है। पहले यह कच्चा four-bit sum दिखाता है और उसे उसके bits में बाँटता है, Z8 Z4 Z2 Z1, adder के carry K के साथ। फिर यह K और उन bits से detection संकेत C निकालता है, और जब सुधार चाहिए तो उसे हरा जलाता है। आख़िर में यह या तो zero-one-one-zero या zero-zero-zero-zero जोड़ता है और आख़िरी BCD digit अगले column के carry-out के साथ दिखाता है। शुरुआत चलते उदाहरण से, पाँच plus सात। कच्चा sum बारह, जो one-one-zero-zero के रूप में दिखता है, एक forbidden code, तो C जल उठता है और plus-six बनाता है zero-zero-zero-one zero-zero-one-zero - बारह का सही BCD, एक और दो। फिर इसे आख़िरी हद तक धकेलिए: नौ plus नौ plus carry-in एक, उन्नीस का worst case। देखिए K ख़ुद-ब-ख़ुद high होता है, C जलता है, और plus-six BCD एक-नौ दे देता है। जब आप panel से पहले C संकेत बता पाएँ, तब आप सचमुच BCD adder के मालिक हैं।",
      visualNote: "BcdAdderDemo: steppers for A, B, carry-in. Shows raw sum, the 4 Z-bits + K, the lit C verdict, the conditional +0110, and the final S8 S4 S2 S1 with a carry-out lamp. Highlights 5+7 and 9+9+1."
    },
    {
      id: "S08_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Eight flip-cards to lock in BCD, the forbidden six and the +6 fix.",
      theoryEN: [
        "Drill the forbidden six, the detection formula, the state matrix and the gate count until they're reflex.",
        "Cover the back, recall out loud, then flip - focus on the C = K + Z8.Z4 + Z8.Z2 card.",
        "If you keep one fact: when a BCD digit sum exceeds 9, add 6 to correct it and generate a carry."
      ],
      theoryHI: [
        "Forbidden six, detection formula, state matrix और gate गिनती को तब तक रटिए जब तक reflex न बन जाएँ।",
        "पीछे ढककर ज़ोर से याद कीजिए, फिर पलटिए - C = K + Z8.Z4 + Z8.Z2 वाले card पर ध्यान दीजिए।",
        "अगर एक बात रखें: जब BCD digit sum 9 से ज़्यादा हो, तो 6 जोड़कर सुधारिए और एक carry बनाइए।"
      ],
      transcriptEN: "Eight quick flip-cards to set it solid. Front asks, back answers - cover the back, say it aloud, then flip to check. Give extra reps to the detection-formula card, C equals K or Z8-and-Z4 or Z8-and-Z2, because that one expression is the brain of the whole circuit and the one examiners love to ask you to derive.",
      transcriptHI: "इसे पक्का करने के लिए आठ तेज़ flip-cards। आगे सवाल, पीछे जवाब - पीछे ढककर ज़ोर से बोलिए, फिर जाँचने के लिए पलटिए। detection-formula वाले card को ज़्यादा दोहराइए, C बराबर K या Z8-and-Z4 या Z8-and-Z2, क्योंकि वही एक expression पूरी circuit का दिमाग़ है और examiner इसे derive करवाना पसंद करते हैं।",
      visualNote: "Standard bilingual flip deck, eight cards."
    },
    {
      id: "S09_Quiz",
      label: "Quiz Arena",
      kind: "quiz",
      subtitle: "Six questions - prove you can detect the overflow and apply +6.",
      theoryEN: [
        "Six multiple-choice questions on BCD validity, the maximum sum, the detection logic and the +6 correction.",
        "At least two questions ask you to apply the correction to a specific sum.",
        "Aim for full marks to close out the complement and BCD arithmetic track."
      ],
      theoryHI: [
        "छह bahu-vikalp सवाल - BCD वैधता, अधिकतम sum, detection logic और +6 सुधार पर।",
        "कम से कम दो सवाल किसी ख़ास sum पर सुधार लगाने को कहते हैं।",
        "complement और BCD arithmetic track ख़त्म करने के लिए पूरे अंक का लक्ष्य रखिए।"
      ],
      transcriptEN: "Six questions in the arena. They check that you know which 4-bit codes are legal BCD, what the maximum column sum is and why, how the detection logic C equals K or Z8-and-Z4 or Z8-and-Z2 works, and how to actually apply the plus-six. A couple of them will hand you a specific sum and ask for the corrected BCD - work those carefully, bit by bit. Clear all six and you've finished the complement and BCD arithmetic track.",
      transcriptHI: "Arena में छह सवाल। ये जाँचते हैं कि आप जानते हैं कौन से 4-bit codes वैध BCD हैं, अधिकतम column sum क्या है और क्यों, detection logic C बराबर K या Z8-and-Z4 या Z8-and-Z2 कैसे काम करती है, और plus-six असल में कैसे लगाते हैं। इनमें से कुछ आपको एक ख़ास sum देकर सुधरा BCD पूछेंगे - उन्हें bit-दर-bit ध्यान से कीजिए। छहों साफ़ कीजिए और आपने complement और BCD arithmetic track पूरा कर लिया।",
      visualNote: "Parameterized QuizArena."
    },
    {
      id: "S10_Recap",
      label: "Recap & Track Complete",
      kind: "recap",
      subtitle: "You can now add decimal in hardware - the odometer hack is yours.",
      theoryEN: [
        "BCD packs one decimal digit per 4 bits; codes 1010 to 1111 (the forbidden six) are illegal.",
        "A column sum can reach 9 + 9 + 1 = 19; every sum from 10 to 19 must be corrected.",
        "Detect with C = K + Z8.Z4 + Z8.Z2; when C = 1, add 6 (0110) to fix the digit and generate a carry.",
        "Hardware: 2 four-bit binary adders + 3 gates per digit, chained for multi-digit decimal addition.",
        "Track complete: complements (9's/1's) -> 10's complement (discard) -> BCD adder (+6) - decimal arithmetic, all from one adder."
      ],
      theoryHI: [
        "BCD हर 4 bits में एक decimal digit रखता है; codes 1010 से 1111 (forbidden six) अवैध हैं।",
        "एक column sum 9 + 9 + 1 = 19 तक पहुँच सकता है; 10 से 19 तक हर sum को सुधारना ज़रूरी है।",
        "C = K + Z8.Z4 + Z8.Z2 से पहचानिए; जब C = 1, तो 6 (0110) जोड़कर digit सुधारिए और carry बनाइए।",
        "Hardware: हर digit के लिए 2 four-bit binary adders + 3 gates, multi-digit decimal addition के लिए chained।",
        "Track पूरा: complements (9's/1's) -> 10's complement (discard) -> BCD adder (+6) - decimal arithmetic, सब एक ही adder से।"
      ],
      transcriptEN: "Let's bank the whole thing. BCD stores one decimal digit in every four bits, and the codes one-zero-one-zero through one-one-one-one, the forbidden six, are illegal and must never appear. A single column's sum can climb as high as nine plus nine plus one, which is nineteen, so every raw sum from ten to nineteen needs fixing. You detect that with one boolean expression, C equals K or Z8-and-Z4 or Z8-and-Z2, and whenever C is one you add six, which simultaneously repairs the digit and generates a carry to the next column - the odometer roll-over. In hardware that's just two four-bit binary adders and three gates per digit, chained as wide as your numbers. And step back to see what you've built across this whole track: you started by turning subtraction into addition with the nine's and one's complements, you streamlined it with the ten's complement that simply discards the carry, and now you can add decimal numbers directly in hardware with the BCD adder's plus-six. Every one of those tricks lets a single, humble adder do arithmetic it was never obviously built for. That's the quiet genius of digital design.",
      transcriptHI: "चलिए पूरी बात जमा कर लें। BCD हर चार bits में एक decimal digit रखता है, और codes one-zero-one-zero से one-one-one-one, forbidden six, अवैध हैं और कभी दिखने नहीं चाहिए। एक अकेले column का sum नौ plus नौ plus एक तक चढ़ सकता है, यानी उन्नीस, तो दस से उन्नीस तक हर कच्चे sum को सुधार चाहिए। आप इसे एक boolean expression से पहचानते हैं, C बराबर K या Z8-and-Z4 या Z8-and-Z2, और जब भी C एक हो आप छह जोड़ते हैं, जो एक साथ digit सुधारता है और अगले column के लिए carry बनाता है - odometer का roll-over। Hardware में यह बस हर digit के लिए दो four-bit binary adders और तीन gates है, आपकी संख्याओं जितना चौड़ा chained। और पीछे हटकर देखिए कि आपने इस पूरे track में क्या बनाया: आपने नौ's और एक's complement से subtraction को addition में बदलकर शुरू किया, इसे ten's complement से चिकना किया जो बस carry को discard कर देता है, और अब आप BCD adder के plus-six से decimal संख्याएँ सीधे hardware में जोड़ सकते हैं। इनमें से हर trick एक अकेले, मामूली adder से वह arithmetic करवाती है जिसके लिए वह साफ़-साफ़ बना ही नहीं था। यही digital design की चुपचाप प्रतिभा है।",
      visualNote: "Recap card: state matrix + detection formula on the left, the two-adder block on the right. A track ribbon: Complements -> 10's Complement -> BCD Adder, all three ticked complete."
    }
  ],
  flashcards: [
    {
      frontEN: "What is BCD, and how is the number 12 stored?",
      backEN: "Binary-coded decimal stores each decimal digit in its own 4 bits. So 12 is 0001 0010, not plain binary 1100.",
      frontHI: "BCD क्या है, और संख्या 12 कैसे रखी जाती है?",
      backHI: "Binary-coded decimal हर decimal digit को उसके अपने 4 bits में रखता है। तो 12 है 0001 0010, सादा binary 1100 नहीं।"
    },
    {
      frontEN: "What are the 'forbidden six' in BCD?",
      backEN: "The codes 1010 to 1111 (decimal 10 to 15). Four bits can form them, but they are not valid BCD digits (which stop at 9).",
      frontHI: "BCD में 'forbidden six' क्या हैं?",
      backHI: "Codes 1010 से 1111 (decimal 10 से 15)। चार bits इन्हें बना सकते हैं, पर ये वैध BCD digits नहीं हैं (जो 9 पर रुकते हैं)।"
    },
    {
      frontEN: "What is the maximum possible sum in one BCD column, and why?",
      backEN: "19, because 9 (digit A) + 9 (digit B) + 1 (carry-in) = 19. So a raw column sum ranges 0 to 19.",
      frontHI: "एक BCD column में अधिकतम संभव sum क्या है, और क्यों?",
      backHI: "19, क्योंकि 9 (digit A) + 9 (digit B) + 1 (carry-in) = 19। तो कच्चा column sum 0 से 19 तक होता है।"
    },
    {
      frontEN: "When does a BCD adder need to add 6?",
      backEN: "Whenever the raw sum exceeds 9 (i.e. lands in 10 to 19). Sums 0 to 9 are already valid and need no correction.",
      frontHI: "BCD adder को 6 कब जोड़ना पड़ता है?",
      backHI: "जब भी कच्चा sum 9 से ज़्यादा हो (यानी 10 से 19 में हो)। Sum 0 से 9 पहले से वैध हैं, सुधार नहीं चाहिए।"
    },
    {
      frontEN: "Write the BCD overflow-detection formula and name its parts.",
      backEN: "C = K + Z8.Z4 + Z8.Z2. K is the carry out of adder-1; Z8, Z4, Z2 are bits of the preliminary 4-bit sum. C=1 means add 6.",
      frontHI: "BCD overflow-detection formula लिखिए और उसके हिस्सों के नाम बताइए।",
      backHI: "C = K + Z8.Z4 + Z8.Z2। K adder-1 का carry out है; Z8, Z4, Z2 कच्चे 4-bit sum के bits हैं। C=1 मतलब 6 जोड़ो।"
    },
    {
      frontEN: "In the BCD state matrix, what are K, C and the action for a sum of 16 to 19?",
      backEN: "K = 1 (adder overflowed), C = 1, action = ADD 6. The +6 produces the correct digit and a carry to the next column.",
      frontHI: "BCD state matrix में, sum 16 से 19 के लिए K, C और action क्या हैं?",
      backHI: "K = 1 (adder overflow हुआ), C = 1, action = ADD 6। +6 सही digit और अगले column के लिए carry देता है।"
    },
    {
      frontEN: "How many adders and gates make one BCD-adder stage?",
      backEN: "Two 4-bit binary adders (one to sum, one to add 6 or 0) plus three logic gates (two AND, one OR) for detection.",
      frontHI: "एक BCD-adder चरण कितने adders और gates से बनता है?",
      backHI: "दो 4-bit binary adders (एक जोड़ने को, एक 6 या 0 जोड़ने को) जमा तीन logic gates (दो AND, एक OR) detection के लिए।"
    },
    {
      frontEN: "Add 5 + 7 in BCD. Show the correction.",
      backEN: "Raw sum 12 = 1100 (illegal). Since it exceeds 9, add 6: 1100 + 0110 = 10010 = 0001 0010 = BCD for 12 (carry 1, digit 2).",
      frontHI: "BCD में 5 + 7 जोड़िए। सुधार दिखाइए।",
      backHI: "कच्चा sum 12 = 1100 (अवैध)। 9 से ज़्यादा है, तो 6 जोड़िए: 1100 + 0110 = 10010 = 0001 0010 = 12 का BCD (carry 1, digit 2)।"
    }
  ],
  quiz: [
    {
      questionEN: "Which 4-bit code is NOT a valid BCD digit?",
      options: ["1001", "0111", "1011", "0000"],
      answerIndex: 2,
      explainEN: "1011 is decimal 11, one of the forbidden six (1010 to 1111). Valid BCD digits are only 0000 to 1001 (0 to 9).",
      explainHI: "1011 decimal 11 है, forbidden six (1010 से 1111) में से एक। वैध BCD digits सिर्फ़ 0000 से 1001 (0 से 9) हैं।",
      questionHI: "कौन सा 4-bit code वैध BCD digit नहीं है?"
    },
    {
      questionEN: "What is the largest raw sum a single BCD column can produce?",
      options: ["15", "18", "19", "20"],
      answerIndex: 2,
      explainEN: "9 + 9 + 1 (carry-in) = 19. That is why every sum from 10 to 19 must be checked and possibly corrected.",
      explainHI: "9 + 9 + 1 (carry-in) = 19। इसीलिए 10 से 19 तक हर sum को जाँचना और शायद सुधारना पड़ता है।",
      questionHI: "एक अकेला BCD column सबसे बड़ा कच्चा sum कितना बना सकता है?"
    },
    {
      questionEN: "When the raw sum of a BCD column is between 10 and 19, what correction is applied?",
      options: [
        "Subtract 6",
        "Add 6 (0110)",
        "Add 10 (1010)",
        "No correction is needed"
      ],
      answerIndex: 1,
      explainEN: "Adding 6 (0110) skips over the six illegal codes, producing the correct decimal digit and a carry to the next column.",
      explainHI: "6 (0110) जोड़ना छह अवैध codes को छलाँग जाता है, सही decimal digit और अगले column के लिए carry बनाता है।",
      questionHI: "जब किसी BCD column का कच्चा sum 10 और 19 के बीच हो, तो क्या सुधार लगाया जाता है?"
    },
    {
      questionEN: "In the formula C = K + Z8.Z4 + Z8.Z2, what does K represent?",
      options: [
        "The carry-in to the BCD column",
        "The carry-out of the first 4-bit adder",
        "The least significant bit of the sum",
        "A constant equal to 6"
      ],
      answerIndex: 1,
      explainEN: "K is the carry-out of adder-1. It alone flags sums 16 to 19; the Z8.Z4 and Z8.Z2 terms catch 10 to 15.",
      explainHI: "K adder-1 का carry-out है। यह अकेला 16 से 19 की झंडी देता है; Z8.Z4 और Z8.Z2 terms 10 से 15 पकड़ते हैं।",
      questionHI: "Formula C = K + Z8.Z4 + Z8.Z2 में, K किसका प्रतिनिधित्व करता है?"
    },
    {
      questionEN: "Add 8 + 5 in BCD. What is the final result?",
      options: [
        "1101 (no correction)",
        "0001 0011 (after adding 6)",
        "0001 0000",
        "0000 1101"
      ],
      answerIndex: 1,
      explainEN: "Raw sum 13 = 1101 is illegal. It exceeds 9, so add 6: 1101 + 0110 = 10011 = 0001 0011, the BCD for 13.",
      explainHI: "कच्चा sum 13 = 1101 अवैध है। 9 से ज़्यादा है, तो 6 जोड़िए: 1101 + 0110 = 10011 = 0001 0011, 13 का BCD।",
      questionHI: "BCD में 8 + 5 जोड़िए। आख़िरी नतीजा क्या है?"
    },
    {
      questionEN: "How many binary adders does one BCD-adder stage use, and why two?",
      options: [
        "One - it adds and corrects in a single pass",
        "Two - one to add the digits, one to add the +6 (or +0) correction",
        "Three - one per output bit",
        "Four - one per input bit"
      ],
      answerIndex: 1,
      explainEN: "Adder-1 forms the raw sum; the detection gates compute C; adder-2 adds 0110 when C=1 or 0000 when C=0. Two adders plus three gates.",
      explainHI: "Adder-1 कच्चा sum बनाता है; detection gates C निकालते हैं; adder-2, C=1 पर 0110 या C=0 पर 0000 जोड़ता है। दो adders जमा तीन gates।",
      questionHI: "एक BCD-adder चरण कितने binary adders वापरता है, और दो क्यों?"
    }
  ]
};
