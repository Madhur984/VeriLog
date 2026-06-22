import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/19 - The 10's Complement ("Discard, Don't Carry").
 * Source: 10s_Complement_in_BCD.mp4 + 10s_Complement_Arithmetic.pdf.
 * The RADIX complement (Base): 10's complement of B = 10^n - B. Subtraction
 * A - B becomes A + (10's complement of B). Unlike the diminished-radix method,
 * a carry out of the top is simply DISCARDED (no end-around carry). Numbers
 * verified: 7-4=3 (discard carry), 4-7=-3 (re-complement + minus sign).
 */
export const CONTENT: SubContent = {
  moduleTitle: "The 10's Complement - Discard, Don't Carry",
  moduleSubtitle: "The radix mirror that subtracts with a single adder and then just throws the leftover carry away.",
  scenes: [
    {
      id: "S00_Cover",
      label: "Discard, Don't Carry",
      kind: "cover",
      subtitle: "The 10's complement is the cleaner cousin of the 9's: same add, but the spare carry goes in the bin.",
      theoryEN: [
        "This module teaches the 10's complement - the RADIX complement of decimal (and the model for binary's 2's complement).",
        "One rule drives everything: 10's complement of B = 10^n - B, then compute A - B as A + (10's complement of B).",
        "The signature move: when a carry spills out of the top, you DISCARD it - no end-around carry, no wrap.",
        "A carry still means positive; its absence still means negative (then you re-complement and add a minus sign).",
        "Last stop: the exact hardware - a 10's-complement generator plus a BCD adder - that sets up the next module."
      ],
      theoryHI: [
        "इस module में हम 10's complement सीखेंगे - decimal का RADIX complement (और binary के 2's complement का नमूना)।",
        "एक नियम सब कुछ चलाता है: 10's complement of B = 10^n - B, फिर A - B को A + (B का 10's complement) से निकालिए।",
        "ख़ास चाल: जब ऊपर से carry छलके, तो उसे DISCARD कर दीजिए - कोई end-around carry नहीं, कोई wrap नहीं।",
        "carry फिर भी धनात्मक का संकेत है; इसका न होना अब भी ऋणात्मक (तब फिर से complement लेकर minus लगाइए)।",
        "आख़िरी पड़ाव: असली hardware - एक 10's-complement generator और एक BCD adder - जो अगले module की तैयारी है।"
      ],
      transcriptEN: "Welcome back to the mirror, with one upgrade. Last time the 9's complement worked, but it had a fussy final step - the end-around carry, where a leftover carry had to loop all the way back to the bottom. The 10's complement, the radix mirror, gets rid of that fuss entirely. The rule is just as simple: the 10's complement of a number B is ten-to-the-power-n minus B, and to compute A minus B you add A to that complement. Then comes the beautiful difference: if the addition produces a carry out of the top, you don't loop it anywhere - you simply discard it, drop it in the bin, done. The carry's mere presence still tells you the answer is positive, and its absence still tells you the answer is negative, in which case you complement the result once more and attach a minus sign. By the end you'll see exactly the hardware that does this - a 10's-complement generator feeding a BCD adder - which is the doorway into our final module.",
      transcriptHI: "Mirror पर फिर से स्वागत है, एक upgrade के साथ। पिछली बार 9's complement काम तो करता था, पर उसका एक नख़रीला आख़िरी कदम था - end-around carry, जहाँ बचे हुए carry को पूरा घूमकर नीचे वापस आना पड़ता था। 10's complement, यानी radix mirror, उस नख़रे को पूरी तरह हटा देता है। नियम उतना ही सरल है: किसी संख्या B का 10's complement है दस-की-घात-n minus B, और A minus B निकालने के लिए A को उस complement में जोड़ दीजिए। फिर आता है वह सुंदर फ़र्क़: अगर addition ऊपर से carry पैदा करे, तो आप उसे कहीं loop नहीं करते - बस DISCARD कर देते हैं, कूड़े में डाल देते हैं, ख़त्म। carry का बस होना ही बताता है कि जवाब धनात्मक है, और इसका न होना बताता है कि जवाब ऋणात्मक है, जिस हालत में आप नतीजे का एक बार और complement लेकर minus चिह्न लगाते हैं। अंत तक आप ठीक वही hardware देखेंगे जो यह करता है - एक 10's-complement generator जो एक BCD adder को feed करता है - और वही हमारे आख़िरी module का दरवाज़ा है।",
      visualNote: "Hero: a sum with a leading carry digit; a hand flicks that top carry into a trash bin labelled 'DISCARD'. The remaining digits glow as the answer."
    },
    {
      id: "S01_Video",
      label: "10's Complement In BCD",
      kind: "video",
      subtitle: "A short film: subtraction without borrowing, and without the end-around carry.",
      theoryEN: [
        "Video framing: the radix complement converts A - B into A + (10's complement of B), just like before.",
        "But the radix family throws the top carry away instead of folding it back - that is the whole distinction.",
        "Goal stated cleanly: compute A - B. Rule: add A to (10 - B) for single digits, or (10^n - B) in general.",
        "Two cases to watch: a carry appears (positive, discard it) or no carry (negative, re-complement and sign it).",
        "The film ends in hardware, hinting at the BCD adder you'll build fully next."
      ],
      theoryHI: [
        "Video का सार: radix complement, A - B को A + (B का 10's complement) में बदल देता है, बिलकुल पहले की तरह।",
        "पर radix परिवार ऊपरी carry को वापस मोड़ने के बजाय फेंक देता है - यही पूरा फ़र्क़ है।",
        "लक्ष्य साफ़-साफ़: A - B निकालिए। नियम: single digit के लिए A में (10 - B) जोड़िए, या आम तौर पर (10^n - B)।",
        "दो हालतें देखिए: carry आता है (धनात्मक, discard कीजिए) या carry नहीं (ऋणात्मक, फिर से complement और sign)।",
        "Film hardware पर ख़त्म होती है, उस BCD adder का इशारा देती जिसे आप अगली बार पूरा बनाएँगे।"
      ],
      transcriptEN: "Here's the whole idea in one breath, building straight on the last module. We still want A minus B without borrowing, so we still rewrite it as A plus the complement of B. The change is which complement: now it's the radix one, the 10's complement, defined as ten-to-the-n minus B - for a single digit that's just ten minus B. Add it to A and look at the top. If a carry pops out, the answer is positive and you throw that carry straight in the bin; there is no looping it back. If no carry pops out, the answer is negative; the sum is still in complement form, so you take its 10's complement again and stamp a minus sign. That's the entire method. The film closes by showing the two hardware blocks that perform it - a 10's-complement generator and a BCD adder - which is precisely where the next module picks up.",
      transcriptHI: "पूरा विचार एक साँस में, सीधे पिछले module पर बनाते हुए। हमें अब भी borrow किए बिना A minus B चाहिए, तो हम इसे अब भी A plus B का complement लिखते हैं। बदलाव सिर्फ़ कौन सा complement: अब radix वाला, 10's complement, परिभाषा दस-की-घात-n minus B - single digit के लिए बस दस minus B। इसे A में जोड़िए और ऊपर देखिए। अगर carry निकले, जवाब धनात्मक है और आप उस carry को सीधे कूड़े में डाल देते हैं; उसे वापस loop करना नहीं है। अगर कोई carry न निकले, जवाब ऋणात्मक है; sum अब भी complement रूप में है, तो उसका 10's complement फिर से लेकर minus चिह्न ठोक दीजिए। यही पूरी विधि है। Film उन दो hardware blocks को दिखाकर ख़त्म होती है जो यह करते हैं - एक 10's-complement generator और एक BCD adder - और ठीक वहीं अगला module शुरू होता है।",
      visualNote: "Animated explainer: A - B rewritten as A + (10 - B); a carry bit travels out of the MSB and drops into a trash icon (vs the previous module's loop-back)."
    },
    {
      id: "S02_RadixIdea",
      label: "The Radix Mirror",
      kind: "theory",
      subtitle: "10's complement of B = 10^n - B, and it is the 9's complement plus 1.",
      theoryEN: [
        "Radix complement uses the FULL base: the 10's complement of B is 10^n - B (n = number of digits).",
        "Shortcut: the 10's complement is just the 9's complement plus 1 (mirror against 9, then add one).",
        "Example (1 digit): 10's complement of 4 is 10 - 4 = 6. Of 7 it is 10 - 7 = 3.",
        "Goal: A - B. Rule: A - B = A + (10's complement of B), computed by ordinary addition.",
        "Because the complement already 'pre-paid' that extra 1, there is no end-around carry to do later."
      ],
      theoryHI: [
        "Radix complement पूरे base का इस्तेमाल करता है: B का 10's complement है 10^n - B (n = digits की संख्या)।",
        "Shortcut: 10's complement बस 9's complement plus 1 है (9 के सामने mirror, फिर एक जोड़ो)।",
        "उदाहरण (1 digit): 4 का 10's complement है 10 - 4 = 6. 7 का है 10 - 7 = 3।",
        "लक्ष्य: A - B। नियम: A - B = A + (B का 10's complement), साधारण addition से।",
        "क्योंकि complement ने वह अतिरिक्त 1 पहले ही 'चुका' दिया, इसलिए बाद में कोई end-around carry नहीं करना पड़ता।"
      ],
      transcriptEN: "Let's pin down the radix mirror precisely. The 10's complement of a number B is ten raised to the number of digits, minus B. For a single digit that's just ten minus B, so the 10's complement of four is six, and of seven is three. There's a lovely shortcut hiding here: the 10's complement is simply the 9's complement plus one. Mirror against nine as you already know how, then add a single unit. And that little plus-one is the secret to why this method is cleaner. In the 9's system you had to recover that missing unit at the end with the end-around carry. The 10's complement bakes the plus-one in from the start, pre-paying the debt, so when you add A to the complement and a carry appears, there's nothing left owing - you just discard it. Same goal as last time, A minus B equals A plus the complement of B, but a smoother finish.",
      transcriptHI: "चलिए radix mirror को ठीक से पकड़ें। किसी संख्या B का 10's complement है दस की घात digits-की-संख्या, minus B। single digit के लिए यह बस दस minus B है, तो चार का 10's complement छह, और सात का तीन। यहाँ एक प्यारा shortcut छिपा है: 10's complement बस 9's complement plus एक है। 9 के सामने mirror कीजिए जैसा आप जानते हैं, फिर एक unit जोड़ दीजिए। और वही छोटा सा plus-one इस विधि के साफ़-सुथरे होने का राज़ है। 9's system में आपको वह छूटा हुआ unit अंत में end-around carry से वापस लाना पड़ता था। 10's complement उस plus-one को शुरू से ही पका लेता है, क़र्ज़ पहले चुका देता है, तो जब आप A को complement में जोड़ते हैं और carry आता है, तो कुछ बक़ाया नहीं रहता - आप बस उसे discard कर देते हैं। वही लक्ष्य जो पिछली बार था, A minus B बराबर A plus B का complement, पर अंत और चिकना।",
      visualNote: "Equation card: '10's comp(B) = 10^n - B = 9's comp(B) + 1'. A small worked strip: 4 -> 6, 7 -> 3. A faded loop-arrow crossed out: 'no end-around carry'."
    },
    {
      id: "S03_TensCalc",
      label: "Run The 10's Subtractor",
      kind: "activity",
      subtitle: "Set A and B; watch the complement form, the add happen, and the spare carry get discarded.",
      theoryEN: [
        "Interactive: set A (minuend) and B (subtrahend); the panel forms 10^n - B, adds A, and inspects the carry.",
        "Positive case - try 7 - 4: complement of 4 is 6, 7 + 6 = 13, a carry appears, DISCARD it, answer = 3.",
        "Negative case - try 4 - 7: complement of 7 is 3, 4 + 3 = 7, NO carry, so re-complement (10 - 7 = 3) and write -3.",
        "Notice there is never an end-around carry here - a leftover carry is simply dropped.",
        "Try two-digit values too (like 52 - 18) and confirm the same discard-or-re-complement rule holds."
      ],
      theoryHI: [
        "Interactive: A (minuend) और B (subtrahend) तय कीजिए; panel 10^n - B बनाता है, A जोड़ता है, और carry जाँचता है।",
        "धनात्मक हालत - आज़माइए 7 - 4: 4 का complement 6, 7 + 6 = 13, carry आता है, उसे DISCARD कीजिए, जवाब = 3।",
        "ऋणात्मक हालत - आज़माइए 4 - 7: 7 का complement 3, 4 + 3 = 7, कोई carry नहीं, तो फिर से complement (10 - 7 = 3) और लिखिए -3।",
        "ग़ौर कीजिए यहाँ कभी end-around carry नहीं होता - बचा हुआ carry बस गिरा दिया जाता है।",
        "दो-digit मान भी आज़माइए (जैसे 52 - 18) और पक्का कीजिए वही discard-या-फिर-complement नियम चलता है।"
      ],
      transcriptEN: "Your turn at the controls. Set A, the minuend, and B, the subtrahend, and the panel does the radix method live. Start with the positive case, seven minus four. The complement of four is six. Seven plus six is thirteen, and a carry has spilled out of the top. In the 9's world you'd loop that carry back; here you simply discard it, and what remains, three, is your answer. Now the negative case, four minus seven. The complement of seven is three. Four plus three is seven, and this time no carry came out. That missing carry flags a negative result, so you take the 10's complement of the sum once more, ten minus seven is three, and you write a minus in front, giving negative three. Watch closely and you'll see there is never an end-around carry on this side of the family - a spare carry is always just dropped. Then push it harder with two-digit numbers and confirm the rule never changes.",
      transcriptHI: "अब controls आपके हाथ। A यानी minuend और B यानी subtrahend तय कीजिए, और panel radix विधि live चलाता है। शुरुआत धनात्मक हालत से, सात minus चार। चार का complement छह। सात plus छह तेरह, और ऊपर से एक carry छलक गया। 9's दुनिया में आप उस carry को वापस loop करते; यहाँ आप बस उसे discard कर देते हैं, और जो बचता है, तीन, वही आपका जवाब है। अब ऋणात्मक हालत, चार minus सात। सात का complement तीन। चार plus तीन सात, और इस बार कोई carry नहीं निकला। वह छूटा carry ऋणात्मक नतीजे की झंडी है, तो आप sum का 10's complement एक बार और लेते हैं, दस minus सात तीन, और आगे minus लिखते हैं, देता है ऋण तीन। ध्यान से देखिए और आप पाएँगे परिवार के इस ओर कभी end-around carry नहीं होता - फ़ालतू carry हमेशा बस गिरा दिया जाता है। फिर इसे दो-digit संख्याओं से और कसिए और पक्का कीजिए नियम कभी नहीं बदलता।",
      visualNote: "TensCalc sandbox: A and B inputs, a worked column showing 10^n - B, the A + complement addition with the carry digit highlighted, and an animated 'discard' of that carry into a bin (positive) or a re-complement + minus (negative)."
    },
    {
      id: "S04_TwoCases",
      label: "The Two Endings",
      kind: "theory",
      subtitle: "Carry out = discard and you're positive. No carry = re-complement and go negative.",
      theoryEN: [
        "Case 1 (carry out = 1): the minuend was larger, the answer is POSITIVE. Discard the carry; the rest is the answer.",
        "Case 2 (carry out = 0): the subtrahend was larger, the answer is NEGATIVE.",
        "In Case 2 the sum is still in complement form, so take its 10's complement and prepend a minus sign.",
        "The same single bit - the top carry - decides both the sign and the finishing move, exactly as with 9's.",
        "The ONLY difference from the 9's method is Case 1: discard the carry instead of an end-around carry."
      ],
      theoryHI: [
        "Case 1 (carry out = 1): minuend बड़ी थी, जवाब धनात्मक (POSITIVE)। carry discard कीजिए; बाक़ी ही जवाब है।",
        "Case 2 (carry out = 0): subtrahend बड़ी थी, जवाब ऋणात्मक (NEGATIVE)।",
        "Case 2 में sum अब भी complement रूप में है, तो इसका 10's complement लेकर आगे minus चिह्न लगाइए।",
        "वही एक bit - ऊपरी carry - sign भी तय करता है और आख़िरी चाल भी, बिलकुल 9's की तरह।",
        "9's विधि से एकमात्र फ़र्क़ Case 1 में है: end-around carry के बजाय carry को discard कीजिए।"
      ],
      transcriptEN: "Let's name the two endings cleanly, because they're the whole method. Case one: a carry came out of the top. That means the minuend was the bigger number and your answer is positive. You discard the carry and read off the remaining digits - that is the final answer, no extra steps. Case two: no carry came out. That means the subtrahend was bigger and your answer is negative. The digits you're staring at are still in complement disguise, so you take the 10's complement one more time to recover the true magnitude, and you write a minus sign in front. Notice the symmetry with the 9's method: the very same bit, the presence or absence of the top carry, tells you the sign and tells you the finishing move. The single solitary difference between the two complement systems lives in case one - the 9's method does an end-around carry there, while the 10's method just throws the carry away.",
      transcriptHI: "चलिए दोनों अंत को साफ़ नाम दें, क्योंकि यही पूरी विधि है। पहली हालत: ऊपर से carry निकला। मतलब minuend बड़ी संख्या थी और आपका जवाब धनात्मक है। आप carry को discard करके बचे digits पढ़ लेते हैं - वही आख़िरी जवाब है, कोई अतिरिक्त कदम नहीं। दूसरी हालत: कोई carry नहीं निकला। मतलब subtrahend बड़ी थी और जवाब ऋणात्मक है। जिन digits को आप देख रहे हैं वे अब भी complement के भेस में हैं, तो असली magnitude वापस पाने के लिए 10's complement एक बार और लीजिए, और आगे minus चिह्न लिखिए। 9's विधि के साथ symmetry देखिए: वही एक bit, ऊपरी carry का होना या न होना, sign भी बताता है और आख़िरी चाल भी। दोनों complement systems के बीच एकमात्र अकेला फ़र्क़ पहली हालत में है - 9's विधि वहाँ end-around carry करती है, जबकि 10's विधि बस carry को फेंक देती है।",
      visualNote: "Two case cards: Case 1 'carry=1 -> discard -> positive' (green, trash icon); Case 2 'carry=0 -> re-complement -> negative' (rose, minus icon). Each with its worked 7-4 / 4-7 example."
    },
    {
      id: "S05_CarryContrast",
      label: "9's vs 10's: The Carry",
      kind: "theory",
      subtitle: "Same subtraction, two complement systems - one wraps the carry, one bins it.",
      theoryEN: [
        "Run the SAME subtraction through both systems and the only divergence is how the final carry is treated.",
        "9's complement (diminished radix): a top carry is folded back in - the END-AROUND CARRY.",
        "10's complement (radix): a top carry is simply DISCARDED.",
        "Both reach the identical final answer; the 10's method just needs one fewer add at the end.",
        "Rule of thumb: diminished radix (9's, 1's) wraps; radix (10's, 2's) discards."
      ],
      theoryHI: [
        "वही subtraction दोनों systems से चलाइए और एकमात्र फ़र्क़ है आख़िरी carry का बर्ताव।",
        "9's complement (diminished radix): ऊपरी carry वापस मोड़ा जाता है - END-AROUND CARRY।",
        "10's complement (radix): ऊपरी carry बस DISCARD कर दिया जाता है।",
        "दोनों एक ही आख़िरी जवाब पर पहुँचते हैं; 10's विधि को अंत में बस एक जोड़ कम चाहिए।",
        "अंगूठे का नियम: diminished radix (9's, 1's) wrap करता है; radix (10's, 2's) discard करता है।"
      ],
      transcriptEN: "Let's put the two cousins side by side on the exact same problem, because seeing them together makes the difference unforgettable. Feed the identical subtraction into both. The 9's complement path mirrors against nine, adds, and when a carry spills out of the top it folds it all the way back to the bottom - the end-around carry, an extra little addition. The 10's complement path mirrors against ten, adds, and when the same carry spills out, it just drops it in the bin and walks away. Run the numbers and you'll find both paths land on precisely the same final answer - they have to, they're computing the same difference. The 10's method simply saves you that last fold-back addition. So engrave the rule of thumb: the diminished-radix complements, nine's and one's, wrap their carry around; the radix complements, ten's and two's, discard it. That one sentence is the heart of both modules.",
      transcriptHI: "चलिए दोनों चचेरे भाइयों को ठीक उसी समस्या पर अग़ल-बग़ल रखें, क्योंकि उन्हें साथ देखना फ़र्क़ को अविस्मरणीय बना देता है। वही subtraction दोनों में डालिए। 9's complement का रास्ता नौ के सामने mirror करता है, जोड़ता है, और जब ऊपर से carry छलकता है तो उसे पूरा नीचे तक मोड़ देता है - end-around carry, एक अतिरिक्त छोटा जोड़। 10's complement का रास्ता दस के सामने mirror करता है, जोड़ता है, और जब वही carry छलकता है, बस उसे कूड़े में डालकर आगे बढ़ जाता है। संख्याएँ चलाइए और आप पाएँगे दोनों रास्ते बिलकुल एक ही आख़िरी जवाब पर पहुँचते हैं - पहुँचना ही होगा, वे एक ही difference निकाल रहे हैं। 10's विधि बस आपका वह आख़िरी मोड़-वाला जोड़ बचा देती है। तो अंगूठे का नियम गुदवा लीजिए: diminished-radix complement, नौ का और एक का, अपना carry wrap करते हैं; radix complement, दस का और दो का, उसे discard करते हैं। यही एक वाक्य दोनों modules का दिल है।",
      visualNote: "Side-by-side panels for one shared subtraction. Left '9's: end-around carry' with a loop arrow. Right '10's: discard' with a trash icon. Both footers show the same final answer."
    },
    {
      id: "S06_Hardware",
      label: "The Hardware Bridge",
      kind: "theory",
      subtitle: "A 10's-complement generator plus a BCD adder - the doorway to the next module.",
      theoryEN: [
        "Block 1 - the 10's-complement generator: builds 10^n - B, made from one 4-bit binary adder and XOR gates.",
        "The XOR gates flip B's bits to form the diminished complement; the adder's carry-in supplies the plus-one.",
        "Block 2 - the BCD adder: adds A to that generated complement, working in decimal-coded form.",
        "Key fact for next time: the BCD adder must add 6 whenever a digit's raw sum exceeds 9.",
        "That '+6 when over 9' correction is the entire subject of the final module - the BCD adder itself."
      ],
      theoryHI: [
        "Block 1 - 10's-complement generator: 10^n - B बनाता है, एक 4-bit binary adder और XOR gates से।",
        "XOR gates, B के bits पलट कर diminished complement बनाते हैं; adder का carry-in वह plus-one देता है।",
        "Block 2 - BCD adder: A को उस बने हुए complement में जोड़ता है, decimal-coded रूप में काम करते हुए।",
        "अगली बार के लिए अहम बात: BCD adder को 6 जोड़ना पड़ता है जब किसी digit का कच्चा sum 9 से ज़्यादा हो।",
        "वही '9 से ऊपर हो तो +6' सुधार आख़िरी module का पूरा विषय है - ख़ुद BCD adder।"
      ],
      transcriptEN: "Let's peek at the actual silicon, because it sets up everything that follows. The method needs two blocks. The first is the 10's-complement generator - the circuit that produces ten-to-the-n minus B. Cleverly, it's built from just one four-bit binary adder and a bank of XOR gates: the XOR gates flip the bits of B to make the diminished, nine's-style complement, and the adder's carry-in quietly injects the plus-one that upgrades it to the full ten's complement. The second block is the BCD adder, which takes A and adds that generated complement, but it works in binary-coded decimal, where each decimal digit lives in four bits. And here's the cliffhanger: a BCD adder can't just add naively, because four bits can hold values up to fifteen while a decimal digit only goes up to nine. So whenever a digit's raw sum climbs above nine, the BCD adder has to add six to drag it back into a valid decimal digit. That plus-six correction is the whole story of our final module - the BCD adder, up close.",
      transcriptHI: "चलिए असली silicon पर एक झलक डालें, क्योंकि यह आगे का सब कुछ तय करता है। विधि को दो blocks चाहिए। पहला है 10's-complement generator - वह circuit जो दस-की-घात-n minus B बनाता है। चतुराई से, यह बस एक four-bit binary adder और XOR gates के एक समूह से बना है: XOR gates, B के bits पलट कर diminished, नौ-शैली का complement बनाते हैं, और adder का carry-in चुपचाप वह plus-one डाल देता है जो इसे पूरे ten's complement में upgrade कर देता है। दूसरा block है BCD adder, जो A लेकर उस बने हुए complement को जोड़ता है, पर यह binary-coded decimal में काम करता है, जहाँ हर decimal digit चार bits में रहता है। और यहाँ cliffhanger है: BCD adder सीधे-सीधे जोड़ नहीं सकता, क्योंकि चार bits पंद्रह तक मान रख सकते हैं जबकि decimal digit सिर्फ़ नौ तक जाता है। तो जब भी किसी digit का कच्चा sum नौ से ऊपर चढ़े, BCD adder को छह जोड़कर उसे वापस वैध decimal digit में खींचना पड़ता है। वही plus-six सुधार हमारे आख़िरी module की पूरी कहानी है - BCD adder, क़रीब से।",
      visualNote: "Block diagram: B -> [10's-complement generator: 4-bit adder + XOR] -> complement; A and complement -> [BCD adder] -> result. A glowing arrow points to the BCD adder labelled 'NEXT: +6 correction'."
    },
    {
      id: "S07_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Eight flip-cards to lock in the radix mirror and the discard rule.",
      theoryEN: [
        "Drill the formula 10^n - B, the discard rule, and the negative-case re-complement until they're reflex.",
        "Cover the back, recall out loud, then flip - focus on the contrast with the 9's end-around carry.",
        "If you keep one fact: radix complements DISCARD the carry; diminished ones WRAP it."
      ],
      theoryHI: [
        "Formula 10^n - B, discard नियम, और ऋणात्मक-हालत के re-complement को तब तक रटिए जब तक reflex न बन जाएँ।",
        "पीछे ढककर ज़ोर से याद कीजिए, फिर पलटिए - 9's के end-around carry से contrast पर ध्यान दीजिए।",
        "अगर एक बात रखें: radix complement carry को DISCARD करते हैं; diminished वाले उसे WRAP करते हैं।"
      ],
      transcriptEN: "Eight fast flip-cards to set it solid. Front asks, back answers - cover the back, say it aloud, then flip to check. Give extra reps to the card that contrasts discard versus end-around carry, because mixing those two up is the classic exam trap that bridges these two modules.",
      transcriptHI: "इसे पक्का करने के लिए आठ तेज़ flip-cards। आगे सवाल, पीछे जवाब - पीछे ढककर ज़ोर से बोलिए, फिर जाँचने के लिए पलटिए। discard बनाम end-around carry वाले contrast card को ज़्यादा दोहराइए, क्योंकि इन दोनों को मिला देना वही classic exam trap है जो इन दो modules को जोड़ता है।",
      visualNote: "Standard bilingual flip deck, eight cards."
    },
    {
      id: "S08_Quiz",
      label: "Quiz Arena",
      kind: "quiz",
      subtitle: "Six questions - prove you can take the 10's complement and read the carry.",
      theoryEN: [
        "Six multiple-choice questions on the formula, the discard rule, the negative case, and the 9's-vs-10's contrast.",
        "At least two questions test what to do with the top carry in each system.",
        "Aim for full marks before moving on to the BCD adder."
      ],
      theoryHI: [
        "छह bahu-vikalp सवाल - formula, discard नियम, ऋणात्मक हालत, और 9's-बनाम-10's contrast पर।",
        "कम से कम दो सवाल परखते हैं कि हर system में ऊपरी carry का क्या करना है।",
        "BCD adder पर बढ़ने से पहले पूरे अंक का लक्ष्य रखिए।"
      ],
      transcriptEN: "Six questions in the arena. They check whether you can build the 10's complement on demand, whether you reach for discard rather than an end-around carry, and whether you handle the negative case by complementing the sum again. The trickiest ones pit the 9's behaviour against the 10's - read those slowly. Clear all six before you meet the BCD adder.",
      transcriptHI: "Arena में छह सवाल। ये जाँचते हैं कि आप माँगने पर 10's complement बना सकते हैं या नहीं, आप end-around carry के बजाय discard की ओर हाथ बढ़ाते हैं या नहीं, और ऋणात्मक हालत को sum का फिर से complement लेकर सँभालते हैं या नहीं। सबसे पेचीदा सवाल 9's के बर्ताव को 10's के सामने रखते हैं - उन्हें धीरे पढ़िए। BCD adder से मिलने से पहले छहों साफ़ कीजिए।",
      visualNote: "Parameterized QuizArena."
    },
    {
      id: "S09_Recap",
      label: "Recap & What's Next",
      kind: "recap",
      subtitle: "Radix subtraction mastered - next, the BCD adder and its famous +6 correction.",
      theoryEN: [
        "10's complement of B = 10^n - B = the 9's complement plus 1. Compute A - B as A + (10's complement of B).",
        "Carry out = positive: DISCARD the carry (no end-around carry); the rest is the answer.",
        "No carry out = negative: take the 10's complement of the sum again and attach a minus sign.",
        "Hardware: a 10's-complement generator (adder + XOR) feeds a BCD adder working in decimal-coded bits.",
        "Next module - the BCD adder: why a digit's sum over 9 is illegal, and how adding 6 (the odometer hack) fixes it."
      ],
      theoryHI: [
        "B का 10's complement = 10^n - B = 9's complement plus 1. A - B को A + (B का 10's complement) से निकालिए।",
        "carry out = धनात्मक: carry को DISCARD कीजिए (कोई end-around carry नहीं); बाक़ी ही जवाब है।",
        "carry out न हो = ऋणात्मक: sum का 10's complement फिर से लेकर minus चिह्न लगाइए।",
        "Hardware: एक 10's-complement generator (adder + XOR) एक BCD adder को feed करता है जो decimal-coded bits में काम करता है।",
        "अगला module - BCD adder: किसी digit का sum 9 से ऊपर अवैध क्यों है, और 6 जोड़ना (odometer hack) इसे कैसे ठीक करता है।"
      ],
      transcriptEN: "Let's bank what you own. The 10's complement of B is ten-to-the-n minus B, which is just the 9's complement plus one. To subtract, you add A to that complement. If a carry comes out of the top, the answer is positive and you discard the carry - no looping, no end-around carry. If no carry comes out, the answer is negative, so you take the 10's complement of the sum a second time and write a minus sign. And you've seen the hardware that does it: a 10's-complement generator made of an adder and XOR gates, feeding a BCD adder that works in decimal-coded bits. That BCD adder hides one last secret. Four bits can represent up to fifteen, but a decimal digit stops at nine, so any digit sum above nine is illegal and has to be repaired by adding six - the famous odometer hack. That correction, and the neat little circuit that performs it, is exactly where we go next.",
      transcriptHI: "अब जो आपका है उसे जमा कर लें। B का 10's complement है दस-की-घात-n minus B, जो बस 9's complement plus एक है। घटाने के लिए, आप A को उस complement में जोड़ते हैं। अगर ऊपर से carry निकले, जवाब धनात्मक है और आप carry को discard कर देते हैं - कोई looping नहीं, कोई end-around carry नहीं। अगर कोई carry न निकले, जवाब ऋणात्मक है, तो आप sum का 10's complement दूसरी बार लेकर minus चिह्न लिखते हैं। और आपने वह hardware देख लिया जो यह करता है: एक adder और XOR gates से बना 10's-complement generator, जो एक BCD adder को feed करता है जो decimal-coded bits में काम करता है। वह BCD adder एक आख़िरी राज़ छिपाए है। चार bits पंद्रह तक दिखा सकते हैं, पर decimal digit नौ पर रुक जाता है, तो नौ से ऊपर का कोई भी digit sum अवैध है और छह जोड़कर ठीक करना पड़ता है - वही मशहूर odometer hack। वही सुधार, और वह सुथरी सी circuit जो इसे करती है, ठीक वहीं हम आगे जाते हैं।",
      visualNote: "Recap card: formula + discard rule on the left, the two-block hardware on the right. Teaser tile 'NEXT: BCD Adder - the odometer hack (+6)' with a decimal wheel rolling 9 -> 0."
    }
  ],
  flashcards: [
    {
      frontEN: "What is the 10's complement of a number B (n digits)?",
      backEN: "10^n - B. Equivalently, the 9's complement of B plus 1. Example (1 digit): 10's complement of 4 is 10 - 4 = 6.",
      frontHI: "किसी संख्या B (n digits) का 10's complement क्या है?",
      backHI: "10^n - B। यानी, B का 9's complement plus 1। उदाहरण (1 digit): 4 का 10's complement है 10 - 4 = 6।"
    },
    {
      frontEN: "How do you compute A - B with the 10's complement?",
      backEN: "Add A to the 10's complement of B: A - B = A + (10^n - B), using ordinary addition.",
      frontHI: "10's complement से A - B कैसे निकालते हैं?",
      backHI: "A में B का 10's complement जोड़िए: A - B = A + (10^n - B), साधारण addition से।"
    },
    {
      frontEN: "After adding, a carry comes out of the top. What do you do?",
      backEN: "DISCARD it. The answer is positive, and the remaining digits are the final answer - no end-around carry.",
      frontHI: "जोड़ने के बाद ऊपर से carry निकलता है। आप क्या करते हैं?",
      backHI: "उसे DISCARD कीजिए। जवाब धनात्मक है, और बचे digits ही आख़िरी जवाब हैं - कोई end-around carry नहीं।"
    },
    {
      frontEN: "After adding, NO carry comes out of the top. What do you do?",
      backEN: "The answer is negative. Take the 10's complement of the sum again and attach a minus sign.",
      frontHI: "जोड़ने के बाद ऊपर से कोई carry नहीं निकलता। आप क्या करते हैं?",
      backHI: "जवाब ऋणात्मक है। Sum का 10's complement फिर से लीजिए और minus चिह्न लगाइए।"
    },
    {
      frontEN: "Compute 7 - 4 using the 10's complement.",
      backEN: "10's complement of 4 = 6. 7 + 6 = 13. A carry appears, discard it -> answer = 3.",
      frontHI: "10's complement से 7 - 4 निकालिए।",
      backHI: "4 का 10's complement = 6। 7 + 6 = 13। carry आता है, उसे discard कीजिए -> जवाब = 3।"
    },
    {
      frontEN: "Compute 4 - 7 using the 10's complement.",
      backEN: "10's complement of 7 = 3. 4 + 3 = 7. No carry, so re-complement: 10 - 7 = 3, attach minus -> -3.",
      frontHI: "10's complement से 4 - 7 निकालिए।",
      backHI: "7 का 10's complement = 3। 4 + 3 = 7। कोई carry नहीं, तो फिर से complement: 10 - 7 = 3, minus लगाइए -> -3।"
    },
    {
      frontEN: "What is the ONE difference between the 9's and 10's complement methods?",
      backEN: "The final carry: 9's (diminished) does an end-around carry (wrap); 10's (radix) discards it.",
      frontHI: "9's और 10's complement विधियों में एकमात्र फ़र्क़ क्या है?",
      backHI: "आख़िरी carry: 9's (diminished) end-around carry करता है (wrap); 10's (radix) उसे discard करता है।"
    },
    {
      frontEN: "Which two hardware blocks perform 10's-complement subtraction?",
      backEN: "A 10's-complement generator (one 4-bit adder + XOR gates) and a BCD adder (which adds 6 when a digit sum exceeds 9).",
      frontHI: "10's-complement subtraction कौन से दो hardware blocks करते हैं?",
      backHI: "एक 10's-complement generator (एक 4-bit adder + XOR gates) और एक BCD adder (जो digit sum 9 से ऊपर हो तो 6 जोड़ता है)।"
    }
  ],
  quiz: [
    {
      questionEN: "What is the 10's complement of the digit 4 (single digit)?",
      options: ["5", "6", "4", "10"],
      answerIndex: 1,
      explainEN: "10's complement of a single digit B is 10 - B, so 10 - 4 = 6. (It also equals the 9's complement 5, plus 1.)",
      explainHI: "single digit B का 10's complement है 10 - B, तो 10 - 4 = 6। (यह 9's complement 5 जमा 1 के भी बराबर है।)",
      questionHI: "अंक 4 (single digit) का 10's complement क्या है?"
    },
    {
      questionEN: "To compute A - B with the radix method, you compute:",
      options: [
        "A + (9's complement of B), then end-around carry",
        "A + (10's complement of B), then discard any top carry",
        "B + (10's complement of A)",
        "A - (10's complement of B)"
      ],
      answerIndex: 1,
      explainEN: "Add A to the 10's complement of B. If a carry leaves the top, discard it (positive result); if not, re-complement and add a minus sign.",
      explainHI: "A में B का 10's complement जोड़िए। अगर ऊपर से carry निकले, उसे discard कीजिए (धनात्मक नतीजा); अगर नहीं, फिर से complement लेकर minus लगाइए।",
      questionHI: "Radix विधि से A - B निकालने के लिए आप क्या निकालते हैं?"
    },
    {
      questionEN: "Computing 7 - 4: complement of 4 is 6, and 7 + 6 = 13. What happens to the carry, and what is the answer?",
      options: [
        "End-around carry: 3 + 1 = 4",
        "Discard the carry: answer is 3",
        "Keep the carry: answer is 13",
        "The result is negative: -3"
      ],
      answerIndex: 1,
      explainEN: "In the 10's (radix) method the top carry is simply discarded, leaving 3. The carry's presence also confirms the answer is positive.",
      explainHI: "10's (radix) विधि में ऊपरी carry बस discard कर दिया जाता है, बचता है 3। carry का होना यह भी पक्का करता है कि जवाब धनात्मक है।",
      questionHI: "7 - 4 निकालते हुए: 4 का complement 6, और 7 + 6 = 13। carry का क्या होता है, और जवाब क्या है?"
    },
    {
      questionEN: "Computing 4 - 7: complement of 7 is 3, and 4 + 3 = 7 with NO carry. What is the final answer?",
      options: [
        "+7",
        "+3",
        "-3",
        "-7"
      ],
      answerIndex: 2,
      explainEN: "No carry means the result is negative. The sum 7 is still in complement form, so re-complement (10 - 7 = 3) and attach a minus sign: -3.",
      explainHI: "कोई carry न होना मतलब नतीजा ऋणात्मक है। sum 7 अब भी complement रूप में है, तो फिर से complement (10 - 7 = 3) और minus लगाइए: -3।",
      questionHI: "4 - 7 निकालते हुए: 7 का complement 3, और 4 + 3 = 7, कोई carry नहीं। आख़िरी जवाब क्या है?"
    },
    {
      questionEN: "What is the single key difference between the 9's-complement and 10's-complement subtraction methods?",
      options: [
        "They use different adders",
        "The 9's method discards the carry; the 10's method wraps it",
        "The 9's method does an end-around carry; the 10's method discards the carry",
        "Only the 10's method can give negative results"
      ],
      answerIndex: 2,
      explainEN: "Both turn subtraction into addition. The diminished-radix 9's method folds the top carry back (end-around carry); the radix 10's method simply discards it.",
      explainHI: "दोनों subtraction को addition में बदलते हैं। diminished-radix 9's विधि ऊपरी carry को वापस मोड़ती है (end-around carry); radix 10's विधि उसे बस discard कर देती है।",
      questionHI: "9's-complement और 10's-complement subtraction विधियों में एकमात्र अहम फ़र्क़ क्या है?"
    },
    {
      questionEN: "In the hardware, a BCD adder must add 6 to a digit's result whenever:",
      options: [
        "The digit sum is exactly 0",
        "The digit's raw sum exceeds 9 (or produces a carry)",
        "The minuend is larger than the subtrahend",
        "Every time, unconditionally"
      ],
      answerIndex: 1,
      explainEN: "Four bits reach 15 but a decimal digit stops at 9. When a digit's raw sum goes above 9, adding 6 corrects it back to a valid BCD digit - the subject of the next module.",
      explainHI: "चार bits पंद्रह तक पहुँचते हैं पर decimal digit नौ पर रुकता है। जब किसी digit का कच्चा sum नौ से ऊपर जाए, छह जोड़ना उसे वैध BCD digit में ठीक कर देता है - अगले module का विषय।",
      questionHI: "Hardware में, BCD adder को किसी digit के नतीजे में 6 कब जोड़ना पड़ता है?"
    }
  ]
};
