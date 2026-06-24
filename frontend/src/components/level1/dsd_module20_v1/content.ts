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
        "This module builds the BCD adder, the circuit that adds numbers which are stored one decimal digit per 4 bits. BCD is short for binary-coded decimal: instead of converting the whole number into pure binary, you keep each decimal digit (0 to 9) in its own little 4-bit box. It is the format behind digital clocks, calculators and seven-segment displays, where the machine must show clean decimal digits to a human.",
        "Here is the picture to hold onto for the whole module: think of each 4-bit group as one wheel of a car's odometer. A real decimal wheel has exactly ten stops, marked 0 through 9, and when it ticks past 9 it rolls back to 0 and nudges the wheel on its left. But a 4-bit group can count all the way to 15, so this wheel has accidentally been given 16 stops instead of 10.",
        "The six extra stops, the values 10 through 15 (binary 1010 through 1111), are the 'forbidden six'. They are perfectly legal binary patterns but they are not valid decimal digits, so a BCD wheel must never come to rest on one of them.",
        "The hack that fixes everything is a single, fixed nudge: whenever a wheel's sum lands above 9, add 6. That +6 leaps straight over the six forbidden stops and forces the wheel to roll over to 0 and throw a carry, exactly like a proper decimal odometer.",
        "By the end you will be able to do the two jobs yourself: detect when a digit has overflowed past 9 using the logic C = K + Z8.Z4 + Z8.Z2, and apply the +6 correction by hand to land on the right decimal answer."
      ],
      theoryHI: [
        "इस module में हम BCD adder बनाएँगे, वह circuit जो उन संख्याओं को जोड़ती है जिन्हें हर decimal digit के हिसाब से 4 bits में रखा जाता है। BCD यानी binary-coded decimal: पूरी संख्या को pure binary में बदलने के बजाय, आप हर decimal digit (0 से 9) को उसके अपने छोटे 4-bit डिब्बे में रखते हैं। यही format digital clocks, calculators और seven-segment displays के पीछे है, जहाँ machine को इंसान के लिए साफ़ decimal digits दिखाने होते हैं।",
        "पूरे module के लिए यह तस्वीर पकड़े रखिए: हर 4-bit समूह को एक कार के odometer का एक wheel समझिए। एक असली decimal wheel में ठीक दस stops होते हैं, 0 से 9 तक, और जब वह 9 के पार टिकता है तो 0 पर लौट जाता है और अपनी बाईं ओर वाले wheel को धकेलता है। पर एक 4-bit समूह 15 तक गिन सकता है, तो इस wheel को ग़लती से 10 के बजाय 16 stops दे दिए गए हैं।",
        "छह अतिरिक्त stops, मान 10 से 15 (binary 1010 से 1111), 'forbidden six' हैं। ये बिलकुल वैध binary patterns हैं पर वैध decimal digits नहीं, इसलिए एक BCD wheel को कभी इनमें से किसी पर रुकना नहीं चाहिए।",
        "जो hack सब कुछ ठीक करता है वह एक अकेला, तय धक्का है: जब भी किसी wheel का sum 9 से ऊपर जाए, 6 जोड़ दीजिए। वह +6 सीधे छह forbidden stops को छलाँग जाता है और wheel को 0 पर roll-over करवा कर एक carry निकलवा देता है, बिलकुल एक सही decimal odometer की तरह।",
        "अंत तक आप दोनों काम ख़ुद कर पाएँगे: logic C = K + Z8.Z4 + Z8.Z2 से पहचानना कि कोई digit 9 के पार overflow हुआ या नहीं, और +6 सुधार हाथ से लगाकर सही decimal जवाब पर पहुँचना।"
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
        "Here is the whole idea in one breath before you watch. A plain binary adder takes two 4-bit groups and is perfectly happy to report any sum from 0 up to 15. But in BCD a 4-bit group is supposed to be a single decimal digit, which only legally runs 0 to 9, so the moment two BCD digits add up to 10 or more the adder hands you a bit pattern that simply is not a valid decimal digit.",
        "When that happens the 4-bit result has landed on one of the forbidden stops on our odometer wheel, and the digit looks wrong until we repair it. Leaving it uncorrected would be like an odometer reading the meaningless symbol 'twelve' on a single wheel that should only show one figure.",
        "The cure is a tiny, fixed nudge: add the number 6, which in binary is 0110. That +6 leaps over the six illegal codes and, as a bonus, kicks out a carry to the next digit on the left, which is exactly the roll-over a decimal odometer should do.",
        "The hardware performs this in a clean three-phase pipeline that the video walks through: first it adds normally, then it detects whether the sum overflowed past 9, and finally it conditionally adds 6 only when correction is needed.",
        "Keep one running example in your head the whole time: 5 + 7 = 12. The adder first shows 12 as 1100, an illegal forbidden-six code, and the +6 repairs it into the clean BCD for twelve, 0001 0010 - a carry digit 1 sitting beside a digit 2."
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार एक साँस में। एक सादा binary adder दो 4-bit समूह लेता है और 0 से 15 तक कोई भी sum बताने में बिलकुल ख़ुश रहता है। पर BCD में एक 4-bit समूह को एक अकेला decimal digit होना चाहिए, जो वैध रूप से सिर्फ़ 0 से 9 तक चलता है, तो जैसे ही दो BCD digits मिलकर 10 या उससे ज़्यादा बनते हैं, adder आपको एक ऐसा bit pattern थमा देता है जो वैध decimal digit है ही नहीं।",
        "जब ऐसा होता है तो 4-bit नतीजा हमारे odometer wheel के किसी forbidden stop पर पहुँच जाता है, और digit तब तक ग़लत दिखता है जब तक हम उसे न सुधारें। इसे बिना सुधारे छोड़ना ऐसा होगा जैसे एक odometer किसी अकेले wheel पर बेमतलब 'बारह' का चिह्न दिखा रहा हो, जबकि उसे सिर्फ़ एक अंक दिखाना चाहिए।",
        "इलाज है एक नन्हा, तय धक्का: संख्या 6 जोड़ दीजिए, जो binary में 0110 है। वह +6 छह अवैध codes को छलाँग जाता है और, bonus में, बाईं ओर वाले अगले digit के लिए एक carry भी निकाल देता है, जो ठीक वही roll-over है जो एक decimal odometer को करना चाहिए।",
        "Hardware यह एक साफ़ तीन-चरण pipeline में करता है जिसे video दिखाता है: पहले यह सामान्य रूप से जोड़ता है, फिर पहचानता है कि sum 9 के पार overflow हुआ या नहीं, और आख़िर में शर्त के साथ 6 जोड़ता है, सिर्फ़ तब जब सुधार चाहिए।",
        "पूरे समय एक उदाहरण मन में रखिए: 5 + 7 = 12। adder पहले 12 को 1100 दिखाता है, एक अवैध forbidden-six code, और +6 इसे बारह के साफ़ BCD में सुधार देता है, 0001 0010 - एक carry digit 1, बग़ल में एक digit 2।"
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
        "Let us get crystal clear about what BCD actually is. Binary-coded decimal keeps each decimal digit in its own little 4-bit box, so the number 12 is not stored as the plain binary 1100; it is stored as two separate boxes, 0001 for the 1 and 0010 for the 2. The boxes sit side by side just like the digits you would write on paper.",
        "Now count the codes a single box can hold. Four bits give you 16 possible patterns, from 0000 up to 1111. But one decimal digit only needs ten of those patterns, the values 0 through 9, which in binary are 0000 through 1001. That leaves six patterns unused.",
        "Those six leftover codes, 1010 through 1111 (the decimal values 10 to 15), are what we call the FORBIDDEN SIX. A 4-bit adder can easily produce them, but they are never a valid BCD digit, so in a BCD machine they are simply illegal and must not appear at an output.",
        "This is exactly the odometer picture: each 4-bit group is one wheel that was accidentally manufactured with 16 stops, when a real decimal wheel should have exactly 10. The forbidden six are those extra six stops past the 9 that should not exist on a decimal wheel at all.",
        "So the whole job of a BCD adder, everything we build in this module, is to guarantee that a wheel never comes to rest on one of those six forbidden stops. Drag the pointer on the wheel below into the red zone to feel the problem the +6 hack is going to solve."
      ],
      theoryHI: [
        "चलिए बिलकुल साफ़ हो जाएँ कि BCD है क्या। Binary-coded decimal हर decimal digit को उसके अपने छोटे 4-bit डिब्बे में रखता है, तो संख्या 12 सादा binary 1100 के रूप में नहीं रखी जाती; यह दो अलग डिब्बों में रखी जाती है, 1 के लिए 0001 और 2 के लिए 0010। डिब्बे बग़ल-बग़ल बैठते हैं, ठीक वैसे ही जैसे आप काग़ज़ पर digits लिखते हैं।",
        "अब गिनिए कि एक अकेला डिब्बा कितने codes रख सकता है। चार bits आपको 16 संभव patterns देते हैं, 0000 से 1111 तक। पर एक decimal digit को इनमें से सिर्फ़ दस चाहिए, मान 0 से 9, जो binary में 0000 से 1001 हैं। बचते हैं छह अनुपयोगी patterns।",
        "वे बचे छह codes, 1010 से 1111 (decimal मान 10 से 15), वही हैं जिन्हें हम FORBIDDEN SIX कहते हैं। एक 4-bit adder इन्हें आसानी से बना सकता है, पर ये कभी वैध BCD digit नहीं होते, तो एक BCD machine में ये बस अवैध हैं और किसी output पर दिखने नहीं चाहिए।",
        "यही ठीक odometer वाली तस्वीर है: हर 4-bit समूह एक wheel है जो ग़लती से 16 stops के साथ बना, जबकि एक असली decimal wheel में ठीक 10 होने चाहिए। forbidden six वही 9 के बाद वाले छह अतिरिक्त stops हैं जो एक decimal wheel पर होने ही नहीं चाहिए।",
        "तो BCD adder का पूरा काम, जो कुछ हम इस module में बनाते हैं, यह पक्का करना है कि कोई wheel कभी उन छह forbidden stops में से किसी पर आकर न रुके। नीचे wheel पर pointer को लाल क्षेत्र में खींचिए और वह समस्या महसूस कीजिए जिसे +6 hack हल करने वाला है।"
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
        "Before we build anything, we should find the worst case: how big can the raw sum of one decimal column actually get? In any single column you add three things - digit A, digit B, and possibly a carry that came in from the column to its right. The largest A can be is 9, the largest B can be is 9, and a carry-in is at most 1, so the absolute maximum is 9 + 9 + 1 = 19.",
        "That tells us a column's raw sum can land anywhere from 0 to 19. The wheel only has legal stops at 0 through 9, so everything from 10 to 19 is out of legal range and will need fixing. Splitting that 0-to-19 span into bands shows us three distinct situations.",
        "If the sum is 0 to 9, wonderful - the wheel is already sitting on a legal stop, the result is a valid BCD digit, and you leave it completely alone. No correction is needed here.",
        "If the sum is 10 to 15, the 4-bit adder shows you one of the forbidden six. The pattern looks valid in binary but is illegal in BCD, so the digit looks wrong and must be corrected with the +6 nudge.",
        "If the sum is 16 to 19, the number is so big that the 4-bit adder itself overflowed and threw its own carry bit, a signal we will call K = 1. This band also needs the +6 correction, and notice the carry has already started moving toward the next wheel. So every value from 10 to 19, the entire upper half, demands the fix, while only 0 to 9 gets a free pass."
      ],
      theoryHI: [
        "कुछ बनाने से पहले हमें worst case ढूँढना चाहिए: एक decimal column का कच्चा sum असल में कितना बड़ा हो सकता है? किसी एक column में आप तीन चीज़ें जोड़ते हैं - digit A, digit B, और शायद दाईं ओर वाले column से आता एक carry। A सबसे बड़ा 9 हो सकता है, B सबसे बड़ा 9, और carry-in अधिकतम 1, तो बिलकुल अधिकतम है 9 + 9 + 1 = 19।",
        "यह बताता है कि किसी column का कच्चा sum 0 से 19 तक कहीं भी पहुँच सकता है। wheel पर वैध stops सिर्फ़ 0 से 9 तक हैं, तो 10 से 19 तक सब कुछ वैध सीमा से बाहर है और सुधार माँगेगा। इस 0-से-19 दायरे को बैंड में बाँटने पर हमें तीन अलग हालात दिखते हैं।",
        "अगर sum 0 से 9 है, बढ़िया - wheel पहले से एक वैध stop पर है, नतीजा एक वैध BCD digit है, और आप उसे बिलकुल छोड़ देते हैं। यहाँ कोई सुधार नहीं चाहिए।",
        "अगर sum 10 से 15 है, तो 4-bit adder आपको forbidden six में से एक दिखाता है। pattern binary में वैध दिखता है पर BCD में अवैध है, तो digit ग़लत दिखता है और उसे +6 धक्के से सुधारना ज़रूरी है।",
        "अगर sum 16 से 19 है, तो संख्या इतनी बड़ी है कि 4-bit adder ख़ुद overflow होकर अपना carry bit निकाल देता है, एक संकेत जिसे हम K = 1 कहेंगे। इस बैंड को भी +6 सुधार चाहिए, और ग़ौर कीजिए carry पहले ही अगले wheel की ओर बढ़ने लगा है। तो 10 से 19 तक का हर मान, पूरा ऊपरी आधा, सुधार माँगता है, जबकि सिर्फ़ 0 से 9 को मुफ़्त छूट मिलती है।"
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
        "Now the clever part: how does the hardware know when to add 6? It reads the preliminary sum coming out of the first adder. Let us name that sum's four bits by their decimal weights - Z8 is the 8s bit, Z4 the 4s bit, Z2 the 2s bit, and Z1 the 1s bit. Separately, K is the carry that spilled out of the top of the 4-bit adder.",
        "Correction is needed, which we signal as C = 1, exactly when the sum is 10 to 19. The Boolean logic that detects this in one line is C = K + Z8.Z4 + Z8.Z2, where a dot means AND and a plus means OR. Each of the three terms is responsible for catching a different slice of that 10-to-19 range.",
        "The K term fires for sums 16 to 19, because only those big sums made the adder overflow in the first place. The Z8.Z4 term fires whenever both the 8s and 4s bits are set, which happens for 12 to 15 (since 8 + 4 = 12). The Z8.Z2 term fires when the 8s and 2s bits are set, catching 10, 11, 14 and 15 (since 8 + 2 = 10).",
        "Overlay all three terms and they light up for every single value from 10 to 19, and - this is the crucial part - they stay completely dark for 0 through 9. The Z8.Z2 term is what plugs the otherwise-missed gap at 10 and 11, so the union is precisely the forbidden range and nothing more.",
        "Best of all, this rule costs only three gates: two AND gates to form the two product terms Z8.Z4 and Z8.Z2, and one OR gate to fold those two products together with K. Three little gates decide the entire correction. Try the slider below and watch which terms light as the raw sum crosses 9."
      ],
      theoryHI: [
        "अब चतुर हिस्सा: hardware को कैसे पता चलता है कि 6 कब जोड़ना है? वह पहले adder से आते कच्चे sum को पढ़ता है। चलिए उस sum के चार bits को उनके decimal weights से नाम दें - Z8 आठ वाला bit, Z4 चार वाला, Z2 दो वाला, और Z1 एक वाला। अलग से, K वह carry है जो 4-bit adder के ऊपर से छलका।",
        "सुधार तब चाहिए, जिसे हम C = 1 से बताते हैं, ठीक तब जब sum 10 से 19 हो। इसे एक line में पहचानने वाली Boolean logic है C = K + Z8.Z4 + Z8.Z2, जहाँ dot का मतलब AND और plus का मतलब OR है। तीनों terms में से हर एक उस 10-से-19 दायरे का एक अलग टुकड़ा पकड़ने के लिए ज़िम्मेदार है।",
        "K term sum 16 से 19 के लिए जलता है, क्योंकि सिर्फ़ उन्हीं बड़े sums ने adder को overflow करवाया। Z8.Z4 term तब जलता है जब 8s और 4s दोनों bits set हों, जो 12 से 15 के लिए होता है (क्योंकि 8 + 4 = 12)। Z8.Z2 term तब जलता है जब 8s और 2s bits set हों, पकड़ता है 10, 11, 14 और 15 (क्योंकि 8 + 2 = 10)।",
        "तीनों terms को ऊपर-नीचे रखिए और वे 10 से 19 तक के हर एक मान के लिए जल उठते हैं, और - यही अहम बात है - वे 0 से 9 के लिए बिलकुल बुझे रहते हैं। Z8.Z2 term ही वह है जो 10 और 11 का छूटा हुआ gap भरता है, तो union बिलकुल forbidden दायरा है और उससे ज़्यादा कुछ नहीं।",
        "सबसे अच्छी बात, इस नियम की क़ीमत सिर्फ़ तीन gates है: दो product terms Z8.Z4 और Z8.Z2 बनाने के लिए दो AND gates, और इन दो products को K के साथ जोड़ने के लिए एक OR gate। तीन छोटे gates पूरा सुधार तय करते हैं। नीचे slider आज़माइए और देखिए कि जैसे-जैसे कच्चा sum 9 के पार जाता है कौन-कौन से terms जलते हैं।"
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
        "Let us compress everything we have learned into one tidy table, the BCD state matrix, which has just three rows. Each row covers a band of raw sums and tells you the carry K, the correction signal C, and the action to take. This single table is the complete behaviour of a BCD-adder stage.",
        "Row one is the easy case: the sum is 0 to 9. The 4-bit adder did not overflow so K = 0, the digit is already legal so C = 0, and the action is to ADD 0 (binary 0000), meaning do nothing at all - the wheel is already on a valid stop.",
        "Row two is the forbidden-six case: the sum is 10 to 15. The 4-bit adder still has not overflowed, so K stays 0, but the result is one of the forbidden patterns, so C goes to 1 and the action is ADD 6 (0110). That +6 both repairs the digit and pops out a carry to the next column.",
        "Row three is the overflow case: the sum is 16 to 19. Now the 4-bit adder itself has overflowed, so K = 1, C = 1, and the action is again ADD 6. Even though the adder already overflowed, the +6 still produces the correct decimal digit and the right carry.",
        "Step back and notice the beautiful regularity: C is 1 in exactly the rows that need fixing, and the fix is never anything but the same constant, 6. That is why the whole circuit is so cheap - the complete BCD adder is just 2 binary 4-bit adders plus the 3 logic gates that implement this matrix. The computed map below checks all 20 raw sums against these three rows."
      ],
      theoryHI: [
        "चलिए जो कुछ हमने सीखा उसे एक सुथरी table में दबा दें, BCD state matrix, जिसमें बस तीन rows हैं। हर row कच्चे sums का एक बैंड ढकती है और आपको carry K, सुधार संकेत C, और लेने वाली action बताती है। यह अकेली table एक BCD-adder चरण का पूरा व्यवहार है।",
        "पहली row आसान हालत है: sum 0 से 9। 4-bit adder overflow नहीं हुआ तो K = 0, digit पहले से वैध है तो C = 0, और action है ADD 0 (binary 0000), यानी बिलकुल कुछ न करो - wheel पहले से एक वैध stop पर है।",
        "दूसरी row forbidden-six हालत है: sum 10 से 15। 4-bit adder अब भी overflow नहीं हुआ, तो K 0 रहता है, पर नतीजा forbidden patterns में से एक है, तो C 1 हो जाता है और action है ADD 6 (0110)। वह +6 digit को भी सुधारता है और अगले column के लिए एक carry भी निकाल देता है।",
        "तीसरी row overflow हालत है: sum 16 से 19। अब 4-bit adder ख़ुद overflow हो गया, तो K = 1, C = 1, और action फिर से ADD 6 है। हालाँकि adder पहले ही overflow हो चुका, +6 फिर भी सही decimal digit और सही carry देता है।",
        "पीछे हटकर इस सुंदर नियमितता पर ग़ौर कीजिए: ठीक उन्हीं rows में C 1 है जिन्हें सुधार चाहिए, और सुधार वही स्थिरांक 6 के सिवा कभी कुछ नहीं। इसीलिए पूरी circuit इतनी सस्ती है - पूरा BCD adder बस 2 binary 4-bit adders जमा 3 logic gates है जो यह matrix लागू करते हैं। नीचे code में बना नक़्शा सभी 20 कच्चे sums को इन तीन rows के सामने जाँचता है।"
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
        "Now let us draw the actual machine. It is two adders with three gates wedged between them, and once you see the layout the whole odometer hack becomes a piece of hardware you could build on a breadboard.",
        "The first block, Adder 1, is an ordinary 4-bit binary adder. It takes your two BCD digits A and B plus any carry-in arriving from the column on the right, and it produces the preliminary 4-bit sum together with its own carry-out, K. At this stage it knows nothing about decimal rules; it just adds binary.",
        "Those preliminary sum bits and K flow into the detection gates: two AND gates compute the products Z8.Z4 and Z8.Z2, and a single OR gate folds those two products together with K to produce the correction signal C. This is the three-gate brain that decides whether the wheel has rolled into the forbidden zone.",
        "The second block, Adder 2, is another 4-bit binary adder that does the actual fixing. Its second input is wired so that when C = 1 it adds 0110 (six) and when C = 0 it adds 0000 (nothing). Its outputs are the corrected 4-bit BCD digit, labelled S8 S4 S2 S1, and a clean carry-out that feeds the next decimal column to the left.",
        "Add it all up and one digit-stage costs just 2 four-bit adders plus 3 gates. Because each stage hands a tidy carry to the next, you simply chain one block per digit to add BCD numbers of any length, exactly like a row of odometer wheels nudging each other along."
      ],
      theoryHI: [
        "अब चलिए असली machine बनाएँ। यह दो adders है जिनके बीच तीन gates ठुँसे हैं, और जैसे ही आप layout देखते हैं पूरा odometer hack hardware का एक टुकड़ा बन जाता है जिसे आप breadboard पर बना सकें।",
        "पहला block, Adder 1, एक साधारण 4-bit binary adder है। यह आपके दो BCD digits A और B, साथ ही दाईं ओर वाले column से आता कोई भी carry-in लेता है, और कच्चा 4-bit sum अपने carry-out K के साथ बनाता है। इस चरण पर इसे decimal नियमों का कुछ पता नहीं; यह बस binary जोड़ता है।",
        "वे कच्चे sum bits और K detection gates में बहते हैं: दो AND gates products Z8.Z4 और Z8.Z2 निकालते हैं, और एक अकेला OR gate उन दो products को K के साथ मोड़कर सुधार संकेत C बनाता है। यही तीन-gate दिमाग़ तय करता है कि wheel forbidden क्षेत्र में लुढ़का या नहीं।",
        "दूसरा block, Adder 2, एक और 4-bit binary adder है जो असली सुधार करता है। इसका दूसरा input ऐसे wire किया है कि जब C = 1 हो तो यह 0110 (छह) जोड़े और जब C = 0 हो तो 0000 (कुछ नहीं) जोड़े। इसके outputs हैं सुधरा 4-bit BCD digit, जिसे S8 S4 S2 S1 कहा जाता है, और एक साफ़ carry-out जो बाईं ओर वाले अगले decimal column को feed करता है।",
        "सब जोड़िए तो एक digit-चरण की क़ीमत बस 2 four-bit adders जमा 3 gates है। चूँकि हर चरण अगले को एक सुथरा carry थमाता है, आप बस हर digit के लिए एक block chain कर देते हैं और किसी भी लंबाई की BCD संख्याएँ जोड़ लेते हैं, बिलकुल odometer wheels की एक कतार की तरह जो एक-दूसरे को आगे धकेलते हैं।"
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
        "Now you build and run one yourself. Use the steppers to choose digit A (0 to 9), digit B (0 to 9) and whether a carry-in (0 or 1) is arriving, then watch the panel perform all three phases live, computing every value in code so nothing is taken on faith.",
        "The panel shows the raw 4-bit sum and breaks it into its bits Z8 Z4 Z2 Z1 alongside the adder's carry K, then it evaluates the detection signal C from those bits, lighting it green the moment correction is needed.",
        "Finally it applies the fix: when C = 1 it adds 0110 and lights the carry-out lamp, and when C = 0 it adds 0000 and leaves the digit exactly as it was. The corrected digit S8 S4 S2 S1 and the carry-out are your final BCD answer.",
        "Start with the running example, 5 + 7. The raw sum is 12, which appears as 1100 - a forbidden code - so C lights up and the +6 produces 0001 0010, the proper BCD for twelve, a carry-1 wheel beside a digit-2 wheel.",
        "Then push the machine to its absolute limit: 9 + 9 with a carry-in of 1, the worst case of 19. Watch K go high all on its own, C light up, and the +6 deliver BCD 0001 1001 (decimal 19). Once you can predict the C signal before the panel does, you truly own the BCD adder. The guided three-phase walkthrough below lets you single-step both presets."
      ],
      theoryHI: [
        "अब आप ख़ुद एक बनाकर चलाइए। steppers से digit A (0 से 9), digit B (0 से 9) और क्या carry-in (0 या 1) आ रहा है चुनिए, फिर देखिए panel तीनों चरण live करता है, हर मान code में गिनता है ताकि कुछ भी भरोसे पर न लिया जाए।",
        "Panel कच्चा 4-bit sum दिखाता है और उसे उसके bits Z8 Z4 Z2 Z1 में बाँटता है, adder के carry K के साथ, फिर वह उन bits से detection संकेत C निकालता है, और जैसे ही सुधार चाहिए उसे हरा जला देता है।",
        "आख़िर में यह सुधार लगाता है: जब C = 1 तो 0110 जोड़ता है और carry-out lamp जलाता है, और जब C = 0 तो 0000 जोड़ता है और digit बिलकुल वैसा ही छोड़ देता है। सुधरा digit S8 S4 S2 S1 और carry-out आपका आख़िरी BCD जवाब हैं।",
        "शुरुआत चलते उदाहरण से कीजिए, 5 + 7। कच्चा sum 12 है, जो 1100 के रूप में दिखता है - एक forbidden code - तो C जल उठता है और +6 बनाता है 0001 0010, बारह का सही BCD, एक carry-1 wheel, बग़ल में एक digit-2 wheel।",
        "फिर machine को उसकी आख़िरी हद तक धकेलिए: 9 + 9, carry-in 1 के साथ, उन्नीस का worst case। देखिए K ख़ुद-ब-ख़ुद high होता है, C जलता है, और +6 BCD 0001 1001 (decimal 19) दे देता है। जब आप panel से पहले C संकेत बता पाएँ, तब आप सचमुच BCD adder के मालिक हैं। नीचे का guided तीन-चरण walkthrough आपको दोनों presets को single-step करने देता है।"
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
        "These eight flip-cards drill the facts that matter most: the forbidden six, the detection formula, the three-row state matrix, and the gate count. The way to use them is simple - cover the back, say the answer out loud, then flip to check, and repeat any card you fumble until the recall is reflex.",
        "Give extra reps to the detection-formula card, C = K + Z8.Z4 + Z8.Z2, because that one expression is the brain of the whole circuit and the one examiners most love to ask you to derive from scratch.",
        "If you walk away remembering only one fact, make it this: whenever a BCD digit's sum exceeds 9, add 6 to correct the digit and generate a carry - the same +6 odometer roll-over you have been watching all module."
      ],
      theoryHI: [
        "ये आठ flip-cards सबसे ज़रूरी तथ्य रटाते हैं: forbidden six, detection formula, तीन-row state matrix, और gate गिनती। इन्हें वापरने का तरीक़ा आसान है - पीछे ढककर जवाब ज़ोर से बोलिए, फिर जाँचने के लिए पलटिए, और जो card अटके उसे तब तक दोहराइए जब तक याद reflex न बन जाए।",
        "detection-formula वाले card, C = K + Z8.Z4 + Z8.Z2, को ज़्यादा दोहराइए, क्योंकि वही एक expression पूरी circuit का दिमाग़ है और examiner इसे शुरू से derive करवाना सबसे ज़्यादा पसंद करते हैं।",
        "अगर आप सिर्फ़ एक बात याद रखकर जाएँ, तो यह हो: जब भी किसी BCD digit का sum 9 से ज़्यादा हो, 6 जोड़कर digit सुधारिए और एक carry बनाइए - वही +6 odometer roll-over जो आप पूरे module देखते रहे हैं।"
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
        "Six multiple-choice questions now check that the odometer hack has really sunk in: they probe which 4-bit codes are valid BCD, what the maximum column sum is and why, how the detection logic C = K + Z8.Z4 + Z8.Z2 works, and how to actually apply the +6 correction.",
        "At least two of the questions hand you a specific sum, like 8 + 5, and ask for the corrected BCD result, so work those carefully bit by bit rather than guessing - add the 6 and read off the carry and digit.",
        "Aim for full marks here, because clearing all six closes out not just this module but the entire complement and BCD arithmetic track you have been climbing."
      ],
      theoryHI: [
        "छह bahu-vikalp सवाल अब जाँचते हैं कि odometer hack सचमुच बैठा या नहीं: ये पूछते हैं कि कौन से 4-bit codes वैध BCD हैं, अधिकतम column sum क्या है और क्यों, detection logic C = K + Z8.Z4 + Z8.Z2 कैसे काम करती है, और +6 सुधार असल में कैसे लगाते हैं।",
        "इनमें से कम से कम दो सवाल आपको एक ख़ास sum देते हैं, जैसे 8 + 5, और सुधरा BCD नतीजा पूछते हैं, तो उन्हें अंदाज़े के बजाय bit-दर-bit ध्यान से कीजिए - 6 जोड़िए और carry तथा digit पढ़ लीजिए।",
        "यहाँ पूरे अंक का लक्ष्य रखिए, क्योंकि छहों साफ़ करना सिर्फ़ यह module नहीं बल्कि पूरा complement और BCD arithmetic track ख़त्म कर देता है जिस पर आप चढ़ते आए हैं।"
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
        "Let us bank the whole thing. BCD packs one decimal digit into every 4 bits, and the codes 1010 through 1111 - the forbidden six - are illegal and must never appear at an output, because they are the six phantom stops past 9 on a wheel that should only have ten.",
        "A single column's raw sum can climb as high as 9 + 9 + 1 = 19, so every sum from 10 to 19 needs correcting while 0 to 9 is left alone. You detect that band with one Boolean expression, C = K + Z8.Z4 + Z8.Z2, and whenever C = 1 you add 6 (0110), which simultaneously repairs the digit and generates the carry to the next column - the odometer roll-over made real.",
        "In hardware all of this is just 2 four-bit binary adders plus 3 logic gates per digit, and because each stage passes a clean carry along you chain one block per digit to add decimal numbers as wide as you like.",
        "Step back and see what you have built across this whole track. You started by turning subtraction into addition with the 9's and 1's complements, you streamlined it with the 10's complement that simply discards the end carry, and now you can add decimal numbers directly in hardware with the BCD adder's +6.",
        "Every one of those tricks lets a single, humble binary adder do arithmetic it was never obviously built for - subtracting, working in decimal, rolling a wheel over cleanly. That quiet reuse of one simple block is the real genius of digital design, and the complement and BCD arithmetic track is now complete."
      ],
      theoryHI: [
        "चलिए पूरी बात जमा कर लें। BCD हर 4 bits में एक decimal digit भरता है, और codes 1010 से 1111 - forbidden six - अवैध हैं और किसी output पर कभी दिखने नहीं चाहिए, क्योंकि ये उस wheel पर 9 के बाद वाले छह phantom stops हैं जिसमें सिर्फ़ दस होने चाहिए।",
        "एक अकेले column का कच्चा sum 9 + 9 + 1 = 19 तक चढ़ सकता है, तो 10 से 19 तक हर sum को सुधार चाहिए जबकि 0 से 9 को छोड़ दिया जाता है। आप उस बैंड को एक Boolean expression से पहचानते हैं, C = K + Z8.Z4 + Z8.Z2, और जब भी C = 1 हो आप 6 (0110) जोड़ते हैं, जो एक साथ digit सुधारता है और अगले column के लिए carry बनाता है - odometer का roll-over हक़ीक़त में।",
        "Hardware में यह सब बस हर digit के लिए 2 four-bit binary adders जमा 3 logic gates है, और चूँकि हर चरण एक साफ़ carry आगे पास करता है, आप हर digit के लिए एक block chain करके जितनी चौड़ी चाहें उतनी decimal संख्याएँ जोड़ लेते हैं।",
        "पीछे हटकर देखिए कि आपने इस पूरे track में क्या बनाया। आपने 9's और 1's complement से subtraction को addition में बदलकर शुरू किया, इसे 10's complement से चिकना किया जो बस end carry को discard कर देता है, और अब आप BCD adder के +6 से decimal संख्याएँ सीधे hardware में जोड़ सकते हैं।",
        "इनमें से हर trick एक अकेले, मामूली binary adder से वह arithmetic करवाती है जिसके लिए वह साफ़-साफ़ बना ही नहीं था - घटाना, decimal में काम करना, एक wheel को साफ़ roll-over करवाना। एक ही सरल block का वह चुपचाप दोबारा इस्तेमाल ही digital design की असली प्रतिभा है, और complement तथा BCD arithmetic track अब पूरा हो गया।"
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
