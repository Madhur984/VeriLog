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
        "This module is about the 10's complement, which is the radix complement of decimal. 'Radix' just means the base of the number system, so for decimal the radix is 10. This same idea, applied to binary, becomes the 2's complement that real computers use to subtract, so what you learn here transfers directly to digital hardware.",
        "One rule drives everything. The 10's complement of a number B is 10^n - B, where n is how many digits B has. To work out A - B you never borrow; instead you compute A + (the 10's complement of B) with ordinary addition. Think of the complement as B reflected in a mirror whose surface sits at the value 10^n.",
        "Here is the signature move that names the module. When the addition produces a carry that spills out past the top digit, you simply DISCARD it - you flick that leftover carry straight into the bin. There is no end-around carry (the looping-the-carry-back trick from the 9's method), and no wrap of any kind.",
        "That spilled carry is also a sign flag. If a carry appears, the answer is positive and you are done. If no carry appears, the answer is negative, and you finish by taking the complement one more time and writing a minus sign in front.",
        "The last stop is the real silicon that does all this: a 10's-complement generator (which builds 10^n - B from an adder and some XOR gates) feeding a BCD adder. That pairing is exactly the doorway into the next module, so this lesson sets up the finale."
      ],
      theoryHI: [
        "यह module 10's complement के बारे में है, जो decimal का radix complement है। 'Radix' का मतलब बस number system का base, तो decimal के लिए radix 10 है। यही idea binary पर लगाने से 2's complement बन जाता है जिससे असली computers घटाते हैं, इसलिए यहाँ जो सीखेंगे वह सीधे digital hardware में काम आता है।",
        "एक नियम सब कुछ चलाता है। किसी संख्या B का 10's complement है 10^n - B, जहाँ n = B के digits की संख्या। A - B निकालने के लिए आप कभी borrow नहीं करते; बल्कि A + (B का 10's complement) को साधारण addition से जोड़ते हैं। complement को B का एक mirror image समझिए, जिसका शीशा 10^n की value पर रखा है।",
        "अब वह ख़ास चाल जिससे module का नाम पड़ा। जब addition ऊपरी digit से आगे carry छलकाए, तो आप उसे बस DISCARD कर देते हैं - उस बचे carry को सीधे कूड़ेदान में फेंक देते हैं। कोई end-around carry नहीं (9's विधि वाला carry-वापस-loop करने का तरीक़ा), और किसी तरह का कोई wrap नहीं।",
        "वह छलका carry एक sign झंडी भी है। अगर carry आता है, जवाब धनात्मक है और काम ख़त्म। अगर carry नहीं आता, जवाब ऋणात्मक है, और आप एक बार और complement लेकर आगे minus चिह्न लिखकर ख़त्म करते हैं।",
        "आख़िरी पड़ाव वह असली silicon है जो यह सब करता है: एक 10's-complement generator (जो एक adder और कुछ XOR gates से 10^n - B बनाता है) जो एक BCD adder को feed करता है। यही जोड़ी अगले module का दरवाज़ा है, तो यह पाठ finale की तैयारी कर देता है।"
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
        "Before the film rolls, fix the frame in your head. The radix complement turns the subtraction A - B into the addition A + (the 10's complement of B), exactly the way the 9's method did. Subtraction is hard for hardware because borrowing ripples across digits, so we trade it for addition, which a single adder already does well.",
        "The one thing that separates this radix family from the previous diminished-radix family is what happens to the leftover carry. The radix method (10's, and its binary cousin 2's) throws that top carry away. The diminished method (9's, and binary 1's) instead folds it back around. That single choice is the whole distinction the video is built around.",
        "The goal stays simple: compute A - B. The rule, for a single digit, is to add A to (10 - B); in general, for an n-digit number, you add A to (10^n - B). For example, 10 - B for B = 4 gives the complement 6, and 8 + that complement would be your A + comp sum.",
        "Watch for exactly two endings. Either a carry appears at the top - the answer is positive, so discard the carry and read off the rest - or no carry appears - the answer is negative, so you re-complement the sum and stamp a minus sign in front.",
        "The film closes on hardware, pointing at the two blocks that perform the method: the 10's-complement generator and the BCD adder. The BCD adder is the one you will build fully in the next module, so treat this ending as a trailer."
      ],
      theoryHI: [
        "Film चलने से पहले frame दिमाग़ में बैठा लीजिए। radix complement, घटाव A - B को जोड़ A + (B का 10's complement) में बदल देता है, ठीक वैसे जैसे 9's विधि करती थी। घटाव hardware के लिए मुश्किल है क्योंकि borrow digits में फैलता है, तो हम इसे जोड़ से बदल देते हैं, जो एक अकेला adder पहले से अच्छे से करता है।",
        "इस radix परिवार को पिछले diminished-radix परिवार से अलग करने वाली एक ही बात है - बचे carry का क्या होता है। radix विधि (10's, और इसका binary भाई 2's) उस ऊपरी carry को फेंक देती है। diminished विधि (9's, और binary 1's) उसे वापस मोड़ देती है। वही एक चुनाव पूरा फ़र्क़ है जिस पर video बना है।",
        "लक्ष्य सरल रहता है: A - B निकालिए। नियम, single digit के लिए, A में (10 - B) जोड़िए; आम तौर पर, n-digit संख्या के लिए, A में (10^n - B) जोड़िए। जैसे B = 4 के लिए 10 - B देता है complement 6, और 8 + वह complement आपका A + comp sum होगा।",
        "ठीक दो अंत देखिए। या तो ऊपर carry आता है - जवाब धनात्मक, तो carry discard कीजिए और बाक़ी पढ़ लीजिए - या कोई carry नहीं आता - जवाब ऋणात्मक, तो sum का फिर से complement लेकर आगे minus चिह्न ठोक दीजिए।",
        "Film hardware पर ख़त्म होती है, उन दो blocks की ओर इशारा करते जो विधि करते हैं: 10's-complement generator और BCD adder। BCD adder वही है जिसे आप अगले module में पूरा बनाएँगे, तो इस अंत को एक trailer समझिए।"
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
        "Let us pin the radix mirror down precisely. The 10's complement of a number B is the full base raised to the digit count, minus B: that is 10^n - B, where n is the number of digits in B. Picture a mirror standing at the value 10^n; the complement is simply how far B sits on the far side of that mirror.",
        "There is a lovely shortcut that saves you the big subtraction. The 10's complement is just the 9's complement plus 1. So you mirror B against 9 the way you already know - 9 minus each digit - and then add a single 1 to the whole thing. The 9's part is easy because no digit ever needs a borrow, and the +1 is just one tiny addition.",
        "A couple of one-digit examples nail it down. The 10's complement of 4 is 10 - 4 = 6 (and indeed the 9's complement 5, plus 1, is also 6). The 10's complement of 7 is 10 - 7 = 3 (the 9's complement 2, plus 1, again gives 3).",
        "The goal is unchanged from the 9's lesson: we want A - B. The rule is A - B = A + (the 10's complement of B), carried out as one ordinary addition with no borrowing anywhere.",
        "And here is why this method finishes so cleanly. Because the complement already 'pre-paid' that extra +1 up front, the debt is settled before you even add. So when a carry pops out of the top later, nothing is owed - you just discard it, with no end-around carry to perform. That pre-paid +1 is the secret behind the discard rule."
      ],
      theoryHI: [
        "चलिए radix mirror को ठीक से पकड़ें। किसी संख्या B का 10's complement है पूरे base की घात digits-गिनती, minus B: यानी 10^n - B, जहाँ n = B के digits की संख्या। एक mirror की कल्पना कीजिए जो 10^n की value पर खड़ा है; complement बस इतना है कि B उस शीशे के उस पार कितनी दूर बैठा है।",
        "एक प्यारा shortcut है जो बड़ी subtraction बचा देता है। 10's complement बस 9's complement plus 1 है। तो B को 9 के सामने mirror कीजिए जैसा आप पहले से जानते हैं - हर digit का 9 minus - और फिर पूरी चीज़ में एक 1 जोड़ दीजिए। 9's वाला हिस्सा आसान है क्योंकि किसी digit को कभी borrow नहीं चाहिए, और +1 बस एक छोटा सा जोड़ है।",
        "एक-digit के दो उदाहरण इसे पक्का कर देते हैं। 4 का 10's complement है 10 - 4 = 6 (और सचमुच 9's complement 5, plus 1, भी 6 है)। 7 का 10's complement है 10 - 7 = 3 (9's complement 2, plus 1, फिर 3 देता है)।",
        "लक्ष्य 9's पाठ से नहीं बदला: हमें A - B चाहिए। नियम है A - B = A + (B का 10's complement), एक साधारण addition के रूप में, कहीं कोई borrow नहीं।",
        "और यही वजह है कि यह विधि इतने सफ़ाई से ख़त्म होती है। क्योंकि complement ने वह अतिरिक्त +1 पहले ही 'चुका' दिया, क़र्ज़ जोड़ने से पहले ही चुक जाता है। तो जब बाद में ऊपर से carry निकलता है, कुछ बक़ाया नहीं रहता - आप बस उसे discard कर देते हैं, कोई end-around carry करने की ज़रूरत नहीं। वही पहले-चुकाया +1 discard नियम का राज़ है।"
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
        "The whole method has exactly two possible endings, and a single bit - the carry out of the top - tells you which one you are in. Naming them cleanly is most of the work, because everything else is just the addition you already know.",
        "Case 1 is when a carry comes out of the top, carry = 1. That means the minuend (the number you subtract from, A) was the larger one, so the true answer is positive. You discard the carry - toss it in the bin - and the digits that remain are the final answer, with no extra steps. For instance 7 - 4: the complement of 4 is 6, 7 + 6 = 13, you drop the leading 1, and 3 is your answer.",
        "Case 2 is when no carry comes out, carry = 0. That means the subtrahend (the number being subtracted, B) was the larger one, so the true answer is negative. But the digits you are looking at are still wearing a complement disguise, so they are not the answer yet.",
        "To undo that disguise in Case 2, you take the 10's complement of the sum one more time to recover the true magnitude, then write a minus sign in front. For instance 4 - 7: the complement of 7 is 3, 4 + 3 = 7 with no carry, so re-complement 10 - 7 = 3 and the answer is -3.",
        "Notice the symmetry with the 9's method: the very same bit decides both the sign and the finishing move. In fact the ONLY difference between the two systems lives in Case 1. The 9's method does an end-around carry there (it loops the 1 back and re-adds); the 10's method simply discards it. Everything else is identical."
      ],
      theoryHI: [
        "पूरी विधि के ठीक दो ही संभव अंत हैं, और एक अकेला bit - ऊपर से निकलता carry - बता देता है कि आप किसमें हैं। इन्हें साफ़ नाम देना ही ज़्यादातर काम है, क्योंकि बाक़ी सब बस वही जोड़ है जो आप जानते हैं।",
        "Case 1 तब है जब ऊपर से carry निकलता है, carry = 1। मतलब minuend (जिसमें से घटाते हैं, A) बड़ी संख्या थी, तो असली जवाब धनात्मक है। आप carry को discard कीजिए - कूड़े में डालिए - और जो digits बचते हैं वही आख़िरी जवाब हैं, कोई अतिरिक्त कदम नहीं। जैसे 7 - 4: 4 का complement 6, 7 + 6 = 13, आगे का 1 गिरा दीजिए, और 3 आपका जवाब है।",
        "Case 2 तब है जब कोई carry नहीं निकलता, carry = 0। मतलब subtrahend (जो घटाया जा रहा, B) बड़ी संख्या थी, तो असली जवाब ऋणात्मक है। पर जिन digits को आप देख रहे हैं वे अब भी complement का भेस पहने हैं, इसलिए वे अभी जवाब नहीं हैं।",
        "Case 2 में उस भेस को उतारने के लिए, sum का 10's complement एक बार और लेकर असली magnitude वापस पाइए, फिर आगे minus चिह्न लिखिए। जैसे 4 - 7: 7 का complement 3, 4 + 3 = 7, कोई carry नहीं, तो फिर से complement 10 - 7 = 3 और जवाब है -3।",
        "9's विधि के साथ symmetry देखिए: वही एक bit sign भी तय करता है और आख़िरी चाल भी। असल में दोनों systems के बीच एकमात्र फ़र्क़ Case 1 में है। 9's विधि वहाँ end-around carry करती है (1 को वापस loop करके फिर जोड़ती है); 10's विधि बस उसे discard कर देती है। बाक़ी सब बिलकुल एक जैसा है।"
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
        "The fastest way to make the difference unforgettable is to put the two cousins side by side on the exact same problem. Feed one identical subtraction, say 7 - 4, into both systems and watch where they part ways. The setup is the same and the answer is the same; only the treatment of the final carry diverges.",
        "Take the 9's complement first - the diminished-radix method. You mirror against 9, add, and a carry spills out of the top. Here that carry is folded all the way back to the bottom and added in again. That loop-back is the END-AROUND CARRY, an extra little addition you cannot skip in this system.",
        "Now the 10's complement - the radix method. You mirror against 10, add, and the same carry spills out of the top. This time you do nothing fancy: you simply DISCARD it, drop it in the bin, and walk away. No loop, no extra addition.",
        "Run the numbers and both paths land on precisely the same final answer of 3 - they must, since they compute the same difference. The only thing the 10's method buys you is skipping that last fold-back addition, which is why it is the cleaner of the two.",
        "Engrave this rule of thumb, because it covers all four complements you will ever meet. The diminished-radix complements (9's in decimal, 1's in binary) WRAP their carry around with an end-around carry. The radix complements (10's in decimal, 2's in binary) DISCARD it. That one sentence is the shared heart of both modules."
      ],
      theoryHI: [
        "फ़र्क़ को अविस्मरणीय बनाने का सबसे तेज़ तरीक़ा है दोनों चचेरे भाइयों को ठीक उसी समस्या पर अग़ल-बग़ल रखना। एक ही subtraction, जैसे 7 - 4, दोनों systems में डालिए और देखिए वे कहाँ अलग होते हैं। setup एक जैसा है और जवाब भी एक, सिर्फ़ आख़िरी carry का बर्ताव अलग होता है।",
        "पहले 9's complement लीजिए - diminished-radix विधि। 9 के सामने mirror कीजिए, जोड़िए, और ऊपर से एक carry छलकता है। यहाँ उस carry को पूरा नीचे तक मोड़कर फिर से जोड़ा जाता है। वही loop-back END-AROUND CARRY है, एक अतिरिक्त छोटा जोड़ जिसे इस system में छोड़ा नहीं जा सकता।",
        "अब 10's complement - radix विधि। 10 के सामने mirror कीजिए, जोड़िए, और वही carry ऊपर से छलकता है। इस बार आप कुछ ख़ास नहीं करते: बस उसे DISCARD करके, कूड़े में डालकर आगे बढ़ जाते हैं। कोई loop नहीं, कोई अतिरिक्त जोड़ नहीं।",
        "संख्याएँ चलाइए और दोनों रास्ते बिलकुल एक ही आख़िरी जवाब 3 पर पहुँचते हैं - पहुँचना ही होगा, क्योंकि वे एक ही difference निकालते हैं। 10's विधि बस आपका वह आख़िरी मोड़-वाला जोड़ बचाती है, इसीलिए यह दोनों में साफ़-सुथरी है।",
        "यह अंगूठे का नियम गुदवा लीजिए, क्योंकि यह उन चारों complements को समेट लेता है जिनसे आप कभी मिलेंगे। diminished-radix complement (decimal में 9's, binary में 1's) अपना carry end-around carry से WRAP करते हैं। radix complement (decimal में 10's, binary में 2's) उसे DISCARD करते हैं। यही एक वाक्य दोनों modules का साझा दिल है।"
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
        "Now let us peek at the actual silicon, because it sets up everything that follows. The whole method needs only two blocks wired in series. The first turns B into its 10's complement; the second adds that complement to A. That is the entire subtractor.",
        "Block 1 is the 10's-complement generator - the circuit that produces 10^n - B. Cleverly, it is built from just one 4-bit binary adder plus a bank of XOR gates, and it gets the +1 almost for free, as the next sentence explains.",
        "Inside that generator the XOR gates do the flipping. An XOR gate outputs 1 only when its two inputs differ, so feeding each bit of B alongside a constant 1 flips that bit. Flipping all the bits produces the diminished, 9's-style complement. Then the adder's carry-in is tied to 1, and that quietly injects the +1 that upgrades the 9's complement into the full 10's complement - the same pre-paid +1 from earlier, now done in hardware.",
        "Block 2 is the BCD adder. It takes A and adds the generated complement, but it works in binary-coded decimal, meaning each decimal digit (0 through 9) is stored in its own group of four bits. Adding two BCD digits is where the next module's twist hides.",
        "Here is the cliffhanger, with the numbers that cause it. Four bits can represent values up to 15, but a single decimal digit only legally goes up to 9. So whenever a digit's raw sum climbs above 9, the result is an illegal code, and the BCD adder must add 6 to drag it back into a valid decimal digit. That '+6 when over 9' correction is the entire subject of the final module - the BCD adder itself, up close."
      ],
      theoryHI: [
        "अब असली silicon पर एक झलक डालिए, क्योंकि यह आगे का सब कुछ तय करता है। पूरी विधि को series में जुड़े बस दो blocks चाहिए। पहला B को उसके 10's complement में बदलता है; दूसरा उस complement को A में जोड़ता है। यही पूरा subtractor है।",
        "Block 1 है 10's-complement generator - वह circuit जो 10^n - B बनाता है। चतुराई से, यह बस एक 4-bit binary adder और XOR gates के एक समूह से बना है, और +1 लगभग मुफ़्त में मिल जाता है, जैसा अगला वाक्य बताता है।",
        "उस generator के अंदर XOR gates पलटने का काम करते हैं। XOR gate तभी 1 देता है जब इसके दो inputs अलग हों, तो B के हर bit के साथ एक स्थिर 1 देने से वह bit पलट जाता है। सारे bits पलटने से diminished, 9's-शैली का complement बनता है। फिर adder का carry-in 1 से बँधा होता है, और वह चुपचाप वह +1 डाल देता है जो 9's complement को पूरे 10's complement में upgrade कर देता है - वही पहले-चुकाया +1, अब hardware में।",
        "Block 2 है BCD adder। यह A लेकर बने हुए complement को जोड़ता है, पर binary-coded decimal में काम करता है, यानी हर decimal digit (0 से 9) अपने चार bits के समूह में रखा जाता है। दो BCD digits जोड़ने में ही अगले module का पेच छिपा है।",
        "यह रहा cliffhanger, उन्हीं संख्याओं के साथ जो इसकी वजह हैं। चार bits 15 तक की values दिखा सकते हैं, पर एक decimal digit वैध रूप से सिर्फ़ 9 तक जाता है। तो जब भी किसी digit का कच्चा sum 9 से ऊपर चढ़े, नतीजा एक अवैध code होता है, और BCD adder को 6 जोड़कर उसे वापस वैध decimal digit में खींचना पड़ता है। वही '9 से ऊपर हो तो +6' सुधार आख़िरी module का पूरा विषय है - ख़ुद BCD adder, क़रीब से।"
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
        "Let us bank what you now own. The 10's complement of B is 10^n - B, which is the same as the 9's complement plus 1, so you can always reach it by mirroring against 9 and adding one. To subtract, you compute A - B as A + (the 10's complement of B), one ordinary addition with no borrowing.",
        "Then you read the carry out of the top like a sign flag. If a carry appears, the answer is positive: you DISCARD that carry - drop it in the bin, no end-around carry, no loop - and the remaining digits are the answer. For example 7 - 4 gives 13, discard the 1, answer 3.",
        "If no carry appears, the answer is negative. The sum is still in complement form, so you take its 10's complement once more to recover the magnitude and write a minus sign in front. For example 4 - 7 gives 7 with no carry, so 10 - 7 = 3 and the answer is -3.",
        "On the hardware side, two blocks do the work: a 10's-complement generator (a 4-bit adder whose XOR gates flip B's bits while its carry-in supplies the +1) feeds a BCD adder that operates in decimal-coded bits, four bits per digit.",
        "Next up is that BCD adder and its one famous secret. Four bits can hold up to 15, but a decimal digit stops at 9, so any digit sum above 9 is illegal and must be repaired by adding 6 - the odometer hack, where the wheel rolls past 9 back to 0 and carries. That correction, and the neat little circuit that performs it, is exactly where we go next."
      ],
      theoryHI: [
        "अब जो आपका है उसे जमा कर लें। B का 10's complement है 10^n - B, जो 9's complement plus 1 के बराबर है, तो आप इसे हमेशा 9 के सामने mirror करके और एक जोड़कर पा सकते हैं। घटाने के लिए, A - B को A + (B का 10's complement) से निकालिए, एक साधारण addition, कोई borrow नहीं।",
        "फिर ऊपर से निकलते carry को एक sign झंडी की तरह पढ़िए। अगर carry आता है, जवाब धनात्मक है: उस carry को DISCARD कीजिए - कूड़े में डालिए, कोई end-around carry नहीं, कोई loop नहीं - और बचे digits ही जवाब हैं। जैसे 7 - 4 देता है 13, 1 को discard कीजिए, जवाब 3।",
        "अगर कोई carry नहीं आता, जवाब ऋणात्मक है। sum अब भी complement रूप में है, तो magnitude वापस पाने के लिए इसका 10's complement एक बार और लीजिए और आगे minus चिह्न लिखिए। जैसे 4 - 7 देता है 7, कोई carry नहीं, तो 10 - 7 = 3 और जवाब है -3।",
        "Hardware की ओर, दो blocks काम करते हैं: एक 10's-complement generator (एक 4-bit adder जिसके XOR gates B के bits पलटते हैं जबकि carry-in वह +1 देता है) एक BCD adder को feed करता है जो decimal-coded bits में काम करता है, हर digit चार bits।",
        "अगला है वही BCD adder और उसका एक मशहूर राज़। चार bits 15 तक रख सकते हैं, पर decimal digit 9 पर रुक जाता है, तो 9 से ऊपर का कोई भी digit sum अवैध है और 6 जोड़कर ठीक करना पड़ता है - वही odometer hack, जहाँ पहिया 9 के आगे घूमकर वापस 0 पर आता है और carry देता है। वही सुधार, और वह सुथरी सी circuit जो इसे करती है, ठीक वहीं हम आगे जाते हैं।"
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
