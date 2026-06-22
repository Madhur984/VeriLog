import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/18 - Complements ("The Mirror Trick").
 * Source: Complements_Explained.mp4 + Complement_Subtraction.pdf.
 * Covers the DIMINISHED-radix method (Base - 1): 9's complement (base 10) and
 * 1's complement (base 2), the three-step algorithm, the end-around carry, and
 * how the final carry decides the sign. All numbers below are verified against
 * the source proofs (72532-03250=69282, 84-61=23, and the two negatives).
 */
export const CONTENT: SubContent = {
  moduleTitle: "Complements - The Mirror Trick",
  moduleSubtitle: "Every borrow-heavy subtraction can be turned into a clean addition - if you first replace one number with its mirror image.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The Mirror Trick",
      kind: "cover",
      subtitle: "Hardware hates borrowing. Complements let a machine subtract using nothing but an adder.",
      theoryEN: [
        "This module teaches COMPLEMENTS - the trick that turns subtraction into addition.",
        "One picture runs through it all: every digit has a mirror, and mirroring the second number flips a minus into a plus.",
        "We focus on the DIMINISHED-radix family: 9's complement in base 10, and 1's complement in base 2.",
        "You will learn one three-step recipe: mirror the subtrahend, add, then wrap the carry around (the end-around carry).",
        "Last stop: reading the final carry tells you instantly whether the answer is positive or negative."
      ],
      theoryHI: [
        "इस module में हम COMPLEMENTS सीखेंगे - वह trick जो घटाने (subtraction) को जोड़ने (addition) में बदल देती है।",
        "एक ही तस्वीर पूरे module में चलती है: हर digit का एक mirror होता है, और दूसरी संख्या को mirror करते ही minus, plus बन जाता है।",
        "हम DIMINISHED-radix परिवार पर ध्यान देंगे: base 10 में 9's complement, और base 2 में 1's complement।",
        "एक तीन-कदम वाली विधि सीखेंगे: subtrahend को mirror कीजिए, जोड़िए, फिर carry को घुमा कर वापस लाइए (end-around carry)।",
        "आख़िरी पड़ाव: आख़िरी carry देखकर तुरंत पता चल जाता है कि जवाब धनात्मक है या ऋणात्मक।"
      ],
      transcriptEN: "Welcome to the Mirror Trick. Subtraction looks innocent on paper, but inside a chip it is a nightmare: every borrow has to ripple from one column to the next, and borrowing logic is slow and fiddly. So engineers play a beautiful trick. They never subtract at all. Instead they take the number being taken away, replace it with its mirror image - its complement - and then simply add. The borrow vanishes, and the same adder that already does addition now does subtraction for free. In this module we use the diminished-radix mirror: in decimal that is the 9's complement, in binary the 1's complement. By the end you will mirror a number on sight, add, wrap the leftover carry around, and read the sign straight off the result.",
      transcriptHI: "Mirror Trick में आपका स्वागत है। काग़ज़ पर subtraction मासूम दिखता है, पर chip के अंदर यह एक दुःस्वप्न है: हर borrow को एक column से अगले column तक ripple करना पड़ता है, और borrowing की logic धीमी और झंझट भरी होती है। इसलिए engineers एक सुंदर trick खेलते हैं। वे subtraction करते ही नहीं। बजाय इसके, वे जिस संख्या को घटाना है उसे उसके mirror image - उसके complement - से बदल देते हैं, और फिर बस जोड़ देते हैं। Borrow ग़ायब हो जाता है, और वही adder जो पहले से जोड़ता है अब मुफ़्त में घटाना भी कर देता है। इस module में हम diminished-radix mirror वापरते हैं: decimal में यह 9's complement है, binary में 1's complement। अंत तक आप किसी संख्या को देखते ही mirror कर देंगे, जोड़ेंगे, बचे हुए carry को घुमाएँगे, और नतीजे से सीधे sign पढ़ लेंगे।",
      visualNote: "Hero: a number reflected in a mirror, the reflection labelled 'complement'. A minus sign in front of the original morphs into a plus in front of the reflection."
    },
    {
      id: "S01_Video",
      label: "Complements Explained",
      kind: "video",
      subtitle: "A short film: why every machine would rather mirror than borrow.",
      theoryEN: [
        "Video framing: subtraction A - B is rebuilt as the addition A + (complement of B).",
        "Two complement systems exist: RADIX (10's, 2's) and DIMINISHED-RADIX (9's, 1's = Base - 1).",
        "This module uses the diminished-radix method, which needs a special last step: the end-around carry.",
        "Watch how a carry coming out of the top digit is not thrown away - it is folded back into the bottom digit.",
        "Keep one question in mind throughout: did the top of the sum produce a carry, yes or no?"
      ],
      theoryHI: [
        "Video का सार: subtraction A - B को addition A + (B का complement) के रूप में फिर से बनाया जाता है।",
        "दो complement systems हैं: RADIX (10's, 2's) और DIMINISHED-RADIX (9's, 1's = Base - 1)।",
        "यह module diminished-radix विधि वापरता है, जिसे एक ख़ास आख़िरी कदम चाहिए: end-around carry।",
        "देखिए कैसे सबसे ऊपर वाले digit से निकला carry फेंका नहीं जाता - उसे वापस सबसे नीचे वाले digit में मोड़ दिया जाता है।",
        "पूरे समय एक सवाल मन में रखिए: क्या sum के ऊपरी सिरे से carry निकला, हाँ या नहीं?"
      ],
      transcriptEN: "Here is the whole story in one breath. We want A minus B, but we refuse to borrow. So we rewrite the problem as A plus the complement of B, where the complement is the mirror of B inside its number system. There are actually two mirrors to choose from. The radix complement - 10's in decimal, 2's in binary - and the diminished-radix complement, which is just one less: 9's in decimal, 1's in binary. This film follows the diminished-radix mirror, and it has one signature move that the radix mirror does not. When you add A to the mirror of B, a carry may pop out of the most significant end. In the diminished system you never discard that carry. You bring it all the way back around and add it into the least significant digit. That loop is called the end-around carry, and the single question you keep asking is simply: was there a carry out of the top, or not? That yes-or-no decides everything that follows.",
      transcriptHI: "पूरी कहानी एक साँस में। हमें A minus B चाहिए, पर हम borrow करने से इनकार करते हैं। तो हम समस्या को फिर से लिखते हैं: A plus B का complement, जहाँ complement, B का उसके number system के भीतर का mirror है। चुनने के लिए असल में दो mirror हैं। Radix complement - decimal में 10's, binary में 2's - और diminished-radix complement, जो बस एक कम है: decimal में 9's, binary में 1's। यह film diminished-radix mirror का पीछा करती है, और इसका एक ख़ास कदम है जो radix mirror में नहीं होता। जब आप A को B के mirror के साथ जोड़ते हैं, तो सबसे ऊपरी सिरे से एक carry निकल सकता है। diminished system में आप उस carry को कभी फेंकते नहीं। आप उसे पूरा घुमा कर वापस लाते हैं और सबसे नीचे वाले digit में जोड़ देते हैं। इस loop को end-around carry कहते हैं, और जो एक सवाल आप बार-बार पूछते हैं वह बस यही है: ऊपर से carry निकला या नहीं? यह हाँ-या-ना आगे का सब कुछ तय कर देता है।",
      visualNote: "Animated explainer. Show A - B crossed out, replaced by A + comp(B). A carry bit travels out of the MSB, loops around the bottom of the sum, and re-enters at the LSB."
    },
    {
      id: "S02_WhyBorrow",
      label: "Why Borrowing Is Expensive",
      kind: "theory",
      subtitle: "The problem complements were invented to kill.",
      theoryEN: [
        "Standard subtraction relies on BORROWING: when a column can't cope, it pulls a unit from the column to its left.",
        "In hardware, that borrow must ripple left through every column, one after another - slow and complicated.",
        "Addition hardware is everywhere, cheap, and fast. Engineers would rather build one adder and reuse it.",
        "Complements let them do exactly that: subtraction becomes 'mirror, then add', so the adder does both jobs.",
        "Same silicon, two operations - that economy is why every CPU subtracts with complements, not with borrows."
      ],
      theoryHI: [
        "साधारण subtraction BORROWING पर टिकी है: जब कोई column नहीं सँभाल पाता, तो वह अपनी बाईं ओर वाले column से एक unit खींच लेता है।",
        "Hardware में वह borrow हर column से होते हुए, एक के बाद एक, बाईं ओर ripple करता है - धीमा और पेचीदा।",
        "Addition का hardware हर जगह है, सस्ता है, और तेज़ है। Engineers एक ही adder बनाकर उसे दोबारा वापरना चाहते हैं।",
        "Complements उन्हें ठीक यही करने देते हैं: subtraction बन जाता है 'mirror करो, फिर जोड़ो', तो adder ही दोनों काम कर देता है।",
        "वही silicon, दो operations - यही किफ़ायत है जिसकी वजह से हर CPU borrow से नहीं, complement से घटाता है।"
      ],
      transcriptEN: "Let's be honest about why ordinary subtraction is a problem. When you subtract on paper and a column comes up short, you borrow: you reach into the column on the left and pull down a unit. Sometimes that column is also empty, so it borrows from its left, and the borrow ripples across the whole number like a line of dominoes. For a human that's mildly annoying. For a chip it's genuinely expensive - you need dedicated borrow logic, and the worst case has the borrow crawling through every single column before the answer settles. Addition has no such drama, and adders are the most common, most optimised block in all of digital design. So the engineer's instinct is irresistible: build one excellent adder, and find a way to make it subtract too. Complements are that way. Replace the number you're subtracting with its mirror, feed both into the adder, and out comes the difference. One circuit, two operations, no borrow logic at all.",
      transcriptHI: "ईमानदारी से देखें कि साधारण subtraction समस्या क्यों है। जब आप काग़ज़ पर घटाते हैं और कोई column कम पड़ जाता है, तो आप borrow करते हैं: बाईं ओर वाले column में हाथ डालकर एक unit नीचे खींच लेते हैं। कभी-कभी वह column भी ख़ाली होता है, तो वह अपनी बाईं ओर से borrow करता है, और borrow पूरी संख्या में dominoes की कतार की तरह ripple करता है। इंसान के लिए यह थोड़ा खिजाने वाला है। chip के लिए यह सचमुच महँगा है - आपको अलग borrow logic चाहिए, और सबसे ख़राब हालत में borrow हर एक column से रेंगता हुआ गुज़रता है तब जाकर जवाब टिकता है। Addition में ऐसा कोई नाटक नहीं, और adder पूरे digital design का सबसे आम, सबसे optimise किया गया block है। तो engineer की प्रवृत्ति अटल है: एक बढ़िया adder बनाओ, और उसी से घटाने का भी तरीक़ा निकालो। Complements वही तरीक़ा हैं। जिस संख्या को घटाना है उसे उसके mirror से बदलो, दोनों को adder में डालो, और difference बाहर आ जाता है। एक circuit, दो operations, borrow logic बिलकुल नहीं।"
      ,
      visualNote: "Left: a subtraction with a borrow rippling left across columns (dominoes). Right: the same sum as 'mirror + add' through a single reused adder block."
    },
    {
      id: "S03_TwoFamilies",
      label: "Two Families Of Mirror",
      kind: "theory",
      subtitle: "Radix vs diminished-radix - and which one we use here.",
      theoryEN: [
        "RADIX complement (Base): the 10's complement in decimal, the 2's complement in binary.",
        "DIMINISHED-RADIX complement (Base - 1): the 9's complement in decimal, the 1's complement in binary.",
        "The name says the rule: 9 is 10 minus 1; 1 is 2 minus 1. The diminished system mirrors against Base - 1.",
        "Their signature behaviours differ: diminished-radix needs an END-AROUND CARRY; radix just DISCARDS the carry.",
        "This module is entirely about the diminished-radix mirror. The radix (10's / 2's) mirror is the next module."
      ],
      theoryHI: [
        "RADIX complement (Base): decimal में 10's complement, binary में 2's complement।",
        "DIMINISHED-RADIX complement (Base - 1): decimal में 9's complement, binary में 1's complement।",
        "नाम ही नियम बता देता है: 9 यानी 10 minus 1; 1 यानी 2 minus 1. diminished system, Base - 1 के सामने mirror करता है।",
        "इनका ख़ास बर्ताव अलग है: diminished-radix को END-AROUND CARRY चाहिए; radix बस carry को DISCARD कर देता है।",
        "यह module पूरी तरह diminished-radix mirror के बारे में है। Radix (10's / 2's) mirror अगला module है।"
      ],
      transcriptEN: "There isn't just one complement - there are two families, and keeping them apart will save you a lot of grief. The first is the radix complement, named after the base itself: the 10's complement in decimal, the 2's complement in binary. The second is the diminished-radix complement, named after one less than the base: the 9's complement in decimal, because nine is ten minus one, and the 1's complement in binary, because one is two minus one. They are cousins, and they produce almost the same answer, but they handle the final carry in opposite ways. The diminished family - the one we study here - takes any carry that spills out of the top and loops it back into the bottom; that's the end-around carry. The radix family, which we meet in the very next module, does the opposite: it simply throws the top carry away. Same goal, two personalities. For now, lock onto the diminished-radix mirror and its end-around carry.",
      transcriptHI: "सिर्फ़ एक complement नहीं होता - दो परिवार होते हैं, और इन्हें अलग रखना आपको बहुत परेशानी से बचाएगा। पहला है radix complement, जो base के नाम पर है: decimal में 10's complement, binary में 2's complement। दूसरा है diminished-radix complement, जो base से एक कम के नाम पर है: decimal में 9's complement, क्योंकि नौ यानी दस minus एक, और binary में 1's complement, क्योंकि एक यानी दो minus एक। ये चचेरे भाई हैं, और लगभग एक ही जवाब देते हैं, पर आख़िरी carry को उलटे तरीक़ों से सँभालते हैं। diminished परिवार - जिसे हम यहाँ पढ़ते हैं - ऊपर से छलकने वाले किसी भी carry को वापस नीचे loop कर देता है; वही end-around carry है। Radix परिवार, जिससे हम ठीक अगले module में मिलते हैं, उल्टा करता है: ऊपरी carry को बस फेंक देता है। एक ही लक्ष्य, दो स्वभाव। फ़िलहाल diminished-radix mirror और उसके end-around carry पर ध्यान टिका लीजिए।",
      visualNote: "Two-column comparison card. Left 'RADIX (Base)': 10's, 2's, badge 'DISCARD carry'. Right 'DIMINISHED (Base-1)': 9's, 1's, badge 'END-AROUND carry'. Highlight the right column."
    },
    {
      id: "S04_TheMirror",
      label: "Making The Mirror",
      kind: "theory",
      subtitle: "9's complement = each digit's distance from 9. 1's complement = flip every bit.",
      theoryEN: [
        "9's complement (base 10): replace every digit d with 9 - d. So 03250 becomes 96749.",
        "1's complement (base 2): replace every bit b with 1 - b, which is just flipping 0 to 1 and 1 to 0.",
        "Each digit is mirrored on its own - there is no carrying or borrowing while you build the complement.",
        "Quick check: a digit and its 9's-complement always sum to 9 (2 + 7 = 9); a bit and its flip always sum to 1.",
        "Use the toggle below: pick a base, set the number, and watch its diminished-radix mirror form digit by digit."
      ],
      theoryHI: [
        "9's complement (base 10): हर digit d को 9 - d से बदलिए। तो 03250 बन जाता है 96749।",
        "1's complement (base 2): हर bit b को 1 - b से बदलिए, यानी बस 0 को 1 और 1 को 0 पलट दीजिए।",
        "हर digit अपने-आप mirror होता है - complement बनाते समय कोई carry या borrow नहीं होता।",
        "झटपट जाँच: एक digit और उसका 9's-complement हमेशा मिलकर 9 बनाते हैं (2 + 7 = 9); एक bit और उसका flip हमेशा मिलकर 1 बनाते हैं।",
        "नीचे toggle वापरिए: base चुनिए, संख्या तय कीजिए, और देखिए उसका diminished-radix mirror digit-दर-digit बनता हुआ।"
      ],
      transcriptEN: "Making the mirror is the easy part, and it is purely local - you treat each digit completely on its own. In decimal, the 9's complement replaces every digit with nine minus that digit. The mirror of two is seven, the mirror of zero is nine, the mirror of five is four. Run it across 03250 and you get 96749, no carrying involved. In binary it's even simpler: the 1's complement replaces every bit with one minus that bit, and one minus a bit is just the flip - zero becomes one, one becomes zero. So the 1's complement is literally the inverted bit pattern, exactly what a row of NOT gates produces. Here is a handy sanity check you can do in your head: any digit plus its 9's complement is nine, and any bit plus its flip is one. If two and seven don't add to nine, you mirrored it wrong. Play with the toggle: switch base, set a number, and watch each digit find its mirror independently.",
      transcriptHI: "Mirror बनाना आसान हिस्सा है, और यह पूरी तरह स्थानीय (local) है - हर digit को बिलकुल अकेले निपटाते हैं। Decimal में, 9's complement हर digit को नौ minus उस digit से बदल देता है। दो का mirror सात, शून्य का mirror नौ, पाँच का mirror चार। इसे 03250 पर चलाइए और आपको 96749 मिलता है, कोई carry नहीं। Binary में तो और भी आसान: 1's complement हर bit को एक minus उस bit से बदलता है, और एक minus एक bit बस flip है - शून्य बन जाता है एक, एक बन जाता है शून्य। तो 1's complement सचमुच उल्टा किया हुआ bit pattern है, ठीक वही जो NOT gates की एक कतार बनाती है। एक काम की जाँच जो आप मन में कर सकते हैं: कोई भी digit जमा उसका 9's complement नौ होता है, और कोई भी bit जमा उसका flip एक होता है। अगर दो और सात मिलकर नौ नहीं बनते, तो आपने mirror ग़लत बनाया। Toggle से खेलिए: base बदलिए, संख्या तय कीजिए, और देखिए हर digit अपना mirror स्वतंत्र रूप से ढूँढता हुआ।",
      visualNote: "Interactive MirrorMachine: a base toggle (DEC/BIN) and an editable number; below it each digit shows d -> (base-1 - d). A faint check 'd + mirror = base-1' under each pair."
    },
    {
      id: "S05_ThreeSteps",
      label: "The Three-Step Recipe",
      kind: "theory",
      subtitle: "Complement, add, end-around carry.",
      theoryEN: [
        "Step 1 - COMPLEMENT: take the diminished-radix mirror of the subtrahend (the number being taken away).",
        "Step 2 - ADD: add that mirror directly to the minuend (the number you start with), using ordinary addition.",
        "Step 3 - END-AROUND CARRY: if the sum produced a carry out of the top digit, remove it and add 1 at the bottom.",
        "That little wrap-around is the whole personality of the diminished-radix system - never throw the top carry away.",
        "A carry of 1 is also a signal: it guarantees the true answer is positive (more on that next)."
      ],
      theoryHI: [
        "Step 1 - COMPLEMENT: subtrahend (जिसे घटाना है) का diminished-radix mirror लीजिए।",
        "Step 2 - ADD: उस mirror को सीधे minuend (जहाँ से शुरू करते हैं) में जोड़िए, साधारण addition से।",
        "Step 3 - END-AROUND CARRY: अगर sum से सबसे ऊपरी digit से carry निकला, तो उसे हटाइए और सबसे नीचे 1 जोड़िए।",
        "यही छोटा सा wrap-around diminished-radix system का पूरा स्वभाव है - ऊपरी carry को कभी फेंकिए मत।",
        "carry का 1 एक संकेत भी है: यह पक्का करता है कि असली जवाब धनात्मक है (इस पर आगे और बात)।"
      ],
      transcriptEN: "The whole method is three short steps, and you'll do them on autopilot soon. Step one, complement: take the number you are subtracting - the subtrahend - and replace it with its diminished-radix mirror. Step two, add: add that mirror straight onto the minuend, the number you started with, using nothing but plain addition. Step three, the end-around carry: look at the very top of your sum. If a carry spilled out past the most significant digit, you do not discard it - you peel it off the top and add it back in at the very bottom, the least significant digit. That fold-back is the soul of the diminished-radix system. And there is a bonus hidden in step three: the mere existence of that top carry is a flag telling you the real answer came out positive. When the carry is missing, the answer is negative, and we handle that case slightly differently. So: complement, add, wrap. Three moves, and a borrow-free subtraction falls out.",
      transcriptHI: "पूरी विधि तीन छोटे कदम है, और जल्द ही आप इन्हें अपने-आप करेंगे। पहला कदम, complement: जिस संख्या को घटाना है - subtrahend - उसे उसके diminished-radix mirror से बदल दीजिए। दूसरा कदम, add: उस mirror को सीधे minuend पर जोड़िए, जहाँ से आपने शुरू किया था, सिर्फ़ साधारण addition से। तीसरा कदम, end-around carry: अपने sum के बिलकुल ऊपरी सिरे को देखिए। अगर सबसे ऊपरी digit के पार कोई carry छलका, तो उसे फेंकिए मत - उसे ऊपर से छीलिए और बिलकुल नीचे, least significant digit में वापस जोड़ दीजिए। यही मोड़कर वापस लाना diminished-radix system की आत्मा है। और तीसरे कदम में एक bonus छिपा है: उस ऊपरी carry का बस होना ही एक झंडी है जो बताती है कि असली जवाब धनात्मक निकला। जब carry ग़ायब हो, तो जवाब ऋणात्मक है, और उस हालत को हम थोड़ा अलग तरीक़े से सँभालते हैं। तो: complement, add, wrap. तीन चालें, और borrow-मुक्त subtraction निकल आता है।",
      visualNote: "Three numbered cards: 1 Complement (mirror icon), 2 Add (plus icon), 3 End-Around Carry (loop arrow from MSB back to LSB). A small green flag on step 3: 'carry = answer is positive'."
    },
    {
      id: "S06_ReadCarry",
      label: "Reading The Final Carry",
      kind: "theory",
      subtitle: "Carry = 1 means positive. Carry = 0 means negative - and you mirror once more.",
      theoryEN: [
        "After the add, look at the top: a carry-out of 1 means the minuend was the larger number - the answer is POSITIVE.",
        "Positive case: do the end-around carry (drop the top 1, add 1 at the bottom). That final number IS the answer.",
        "A carry-out of 0 means the subtrahend was larger - the answer is NEGATIVE.",
        "Negative case: the current sum is still in mirror form. Take its diminished-radix complement AGAIN, then attach a minus sign.",
        "So one bit - the top carry - tells you both the sign and which finishing move to use."
      ],
      theoryHI: [
        "जोड़ने के बाद ऊपर देखिए: carry-out का 1 मतलब minuend बड़ी संख्या थी - जवाब धनात्मक (POSITIVE) है।",
        "धनात्मक हालत: end-around carry कीजिए (ऊपरी 1 हटाइए, नीचे 1 जोड़िए)। वही आख़िरी संख्या ही जवाब है।",
        "carry-out का 0 मतलब subtrahend बड़ी थी - जवाब ऋणात्मक (NEGATIVE) है।",
        "ऋणात्मक हालत: मौजूदा sum अब भी mirror रूप में है। इसका diminished-radix complement फिर से लीजिए, फिर minus चिह्न लगाइए।",
        "तो एक bit - ऊपरी carry - आपको sign भी बताता है और कौन सी आख़िरी चाल वापरनी है यह भी।"
      ],
      transcriptEN: "Step three really splits into two endings, and the top carry tells you which one you're in. If a carry came out of the top, congratulations - the minuend was the bigger number, so the true answer is positive. You finish with the end-around carry you already know: strike off the leading one and add one at the bottom, and what remains is your final, correct, positive answer. But if no carry came out of the top, the subtrahend was the bigger number and the answer is negative. Here's the subtle bit: in that case the sum sitting in front of you is not the magnitude yet - it is still wearing its mirror disguise. To unmask it, take the diminished-radix complement one more time, and then write a minus sign in front. That's it. A single bit, the presence or absence of the top carry, simultaneously tells you the sign of the answer and which finishing ritual to perform. Read that bit first, every time, and you'll never get lost.",
      transcriptHI: "तीसरा कदम असल में दो अंत में बँट जाता है, और ऊपरी carry बताता है कि आप किसमें हैं। अगर ऊपर से carry निकला - बधाई हो - minuend बड़ी संख्या थी, तो असली जवाब धनात्मक है। आप उसी end-around carry से ख़त्म करते हैं जिसे आप जानते हैं: अग्रणी एक को काट दीजिए और नीचे एक जोड़ दीजिए, और जो बचता है वही आपका आख़िरी, सही, धनात्मक जवाब है। पर अगर ऊपर से कोई carry नहीं निकला, तो subtrahend बड़ी संख्या थी और जवाब ऋणात्मक है। यहाँ बारीक बात है: उस हालत में आपके सामने बैठा sum अभी magnitude नहीं है - वह अब भी अपना mirror भेस पहने है। इसे बेनक़ाब करने के लिए, diminished-radix complement एक बार और लीजिए, फिर आगे minus चिह्न लिखिए। बस इतना ही। एक अकेला bit, ऊपरी carry का होना या न होना, एक साथ जवाब का sign भी बताता है और कौन सी आख़िरी रस्म करनी है यह भी। हर बार पहले वही bit पढ़िए, और आप कभी नहीं भटकेंगे।",
      visualNote: "A fork diagram from the sum: top branch 'carry = 1 -> POSITIVE -> end-around carry'; bottom branch 'carry = 0 -> NEGATIVE -> complement again, add minus sign'."
    },
    {
      id: "S07_WorkedProofs",
      label: "Work It Through",
      kind: "activity",
      subtitle: "Pick a base and two numbers; the machine mirrors, adds, and resolves the sign live.",
      theoryEN: [
        "Interactive: choose DEC (9's complement) or BIN (1's complement), then set A (minuend) and B (subtrahend).",
        "The panel shows Step 1 (mirror of B), Step 2 (A + mirror), and Step 3 (end-around carry or re-complement).",
        "Try the proof 72532 - 03250: mirror 03250 to 96749, add to get a carry, wrap it, land on 69282.",
        "Try the reverse 03250 - 72532: no carry appears, so re-complement the sum and attach a minus - giving -69282.",
        "Switch to BIN and try 1010100 - 0111101 (84 - 61): flip, add, end-around carry, read 0010111 = 23."
      ],
      theoryHI: [
        "Interactive: DEC (9's complement) या BIN (1's complement) चुनिए, फिर A (minuend) और B (subtrahend) तय कीजिए।",
        "Panel दिखाता है Step 1 (B का mirror), Step 2 (A + mirror), और Step 3 (end-around carry या फिर से complement)।",
        "Proof आज़माइए 72532 - 03250: 03250 का mirror 96749, जोड़िए तो carry आता है, उसे wrap कीजिए, 69282 पर पहुँचिए।",
        "उल्टा आज़माइए 03250 - 72532: कोई carry नहीं आता, तो sum का फिर से complement लीजिए और minus लगाइए - मिलता है -69282।",
        "BIN पर जाइए और आज़माइए 1010100 - 0111101 (84 - 61): flip, add, end-around carry, पढ़िए 0010111 = 23।"
      ],
      transcriptEN: "Now you drive. Pick your base - decimal runs the 9's complement, binary runs the 1's complement - then dial in A, the minuend, and B, the subtrahend. The panel walks all three steps live. Start with the classic positive proof, seventy-two thousand five hundred thirty-two minus three thousand two hundred fifty. Watch B mirror into ninety-six thousand seven hundred forty-nine, watch the addition throw a carry out of the top, watch the end-around carry fold it back, and land exactly on sixty-nine thousand two hundred eighty-two. Now flip the operands and try three thousand two hundred fifty minus seventy-two thousand five hundred thirty-two. This time no carry appears, which flags a negative result, so the machine takes the complement of the sum a second time and stamps a minus sign, giving negative sixty-nine thousand two hundred eighty-two - the same magnitude, opposite sign, exactly as it should be. Then jump to binary and subtract sixty-one from eighty-four as 1010100 minus 0111101; the 1's complement, the add, the wrap, and out comes 0010111, which is twenty-three. Feel all three cases in your fingers and the method is yours.",
      transcriptHI: "अब आप चलाइए। अपना base चुनिए - decimal 9's complement चलाता है, binary 1's complement - फिर A यानी minuend और B यानी subtrahend तय कीजिए। Panel तीनों कदम live चलाता है। शुरुआत classic धनात्मक proof से कीजिए, बहत्तर हज़ार पाँच सौ बत्तीस minus तीन हज़ार दो सौ पचास। देखिए B, छियानवे हज़ार सात सौ उनचास में mirror होता है, देखिए addition ऊपर से एक carry फेंकता है, देखिए end-around carry उसे वापस मोड़ता है, और ठीक उनहत्तर हज़ार दो सौ बयासी पर पहुँचता है। अब operands पलट दीजिए और आज़माइए तीन हज़ार दो सौ पचास minus बहत्तर हज़ार पाँच सौ बत्तीस। इस बार कोई carry नहीं आता, जो ऋणात्मक नतीजे की झंडी है, तो machine sum का complement दूसरी बार लेती है और minus चिह्न ठोक देती है, देती है ऋण उनहत्तर हज़ार दो सौ बयासी - वही magnitude, उल्टा sign, ठीक जैसा होना चाहिए। फिर binary पर कूदिए और चौरासी में से इकसठ घटाइए 1010100 minus 0111101 के रूप में; 1's complement, add, wrap, और निकलता है 0010111, जो तेईस है। तीनों हालतें उँगलियों में महसूस कर लीजिए और विधि आपकी हो गई।",
      visualNote: "ComplementSubtractor sandbox: base toggle, two editable operands, and a vertical worked column - mirror row, addition row with the carry highlighted, and a resolved final line showing sign + magnitude."
    },
    {
      id: "S08_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Eight flip-cards to make complements automatic.",
      theoryEN: [
        "Drill the two mirrors (9's and 1's), the three-step recipe, and the carry-to-sign rule until they're reflex.",
        "Cover the back, recall out loud, then flip - pay special attention to the negative-result card.",
        "If you keep only two facts: mirror against Base - 1, and a top carry means positive (do the end-around carry)."
      ],
      theoryHI: [
        "दोनों mirror (9's और 1's), तीन-कदम विधि, और carry-से-sign नियम को तब तक रटिए जब तक वे reflex न बन जाएँ।",
        "पीछे का हिस्सा ढककर ज़ोर से याद कीजिए, फिर पलटिए - ऋणात्मक-नतीजे वाले card पर ख़ास ध्यान दीजिए।",
        "अगर सिर्फ़ दो बातें रखें: Base - 1 के सामने mirror कीजिए, और ऊपरी carry मतलब धनात्मक (end-around carry कीजिए)।"
      ],
      transcriptEN: "Eight quick flip-cards to set everything in concrete. Front asks, back answers - cover the back, say it out loud, then flip to check. Give extra reps to the negative-result card, because forgetting to complement the sum a second time is the single most common slip in the whole method.",
      transcriptHI: "सब कुछ पक्का करने के लिए आठ झटपट flip-cards। आगे सवाल, पीछे जवाब - पीछे ढककर ज़ोर से बोलिए, फिर जाँचने के लिए पलटिए। ऋणात्मक-नतीजे वाले card को ज़्यादा बार दोहराइए, क्योंकि sum का दूसरी बार complement लेना भूल जाना पूरी विधि की सबसे आम फिसलन है।",
      visualNote: "Standard bilingual flip deck, eight cards from the flashcards array."
    },
    {
      id: "S09_Quiz",
      label: "Quiz Arena",
      kind: "quiz",
      subtitle: "Six questions - prove you can mirror, add, and read the sign.",
      theoryEN: [
        "Six multiple-choice questions on the two families, the mirrors, the end-around carry, and the sign rule.",
        "At least two questions test the carry: what it means and what to do when it's absent.",
        "Aim for full marks before moving on to the 10's complement."
      ],
      theoryHI: [
        "छह bahu-vikalp सवाल - दोनों परिवार, mirror, end-around carry, और sign नियम पर।",
        "कम से कम दो सवाल carry की परख करते हैं: इसका मतलब क्या है और जब यह ग़ायब हो तो क्या करना है।",
        "10's complement पर बढ़ने से पहले पूरे अंक का लक्ष्य रखिए।"
      ],
      transcriptEN: "Six questions in the arena. They probe whether you can tell a radix mirror from a diminished one, whether you can build the 9's and 1's complement on demand, and above all whether you truly understand the end-around carry and the sign rule. Take the carry questions slowly - the wrong answers are the classic mistakes dressed to look right. Clear all six before you meet the 10's complement next door.",
      transcriptHI: "Arena में छह सवाल। ये परखते हैं कि आप radix mirror को diminished से अलग कर सकते हैं या नहीं, माँगने पर 9's और 1's complement बना सकते हैं या नहीं, और सबसे बढ़कर कि आप end-around carry और sign नियम सचमुच समझते हैं या नहीं। carry वाले सवाल धीरे लीजिए - ग़लत विकल्प classic ग़लतियों को सही दिखने के भेस में रखते हैं। बग़ल वाले 10's complement से मिलने से पहले छहों साफ़ कीजिए।",
      visualNote: "Parameterized QuizArena fed by the quiz array."
    },
    {
      id: "S10_Recap",
      label: "Recap & What's Next",
      kind: "recap",
      subtitle: "You can now subtract with an adder - next, the radix mirror that just discards the carry.",
      theoryEN: [
        "Subtraction A - B is rebuilt as A + (mirror of B), so a plain adder does the work - no borrow logic.",
        "Diminished-radix mirrors: 9's complement is 9 - d per digit; 1's complement flips every bit.",
        "Recipe: complement, add, end-around carry. A top carry means positive; finish with the wrap.",
        "No top carry means negative: complement the sum once more and attach a minus sign.",
        "Next module - the 10's complement (radix): same idea, but instead of wrapping the carry, you simply DISCARD it."
      ],
      theoryHI: [
        "Subtraction A - B को A + (B का mirror) के रूप में फिर से बनाते हैं, तो एक सादा adder ही काम कर देता है - कोई borrow logic नहीं।",
        "Diminished-radix mirror: 9's complement यानी हर digit पर 9 - d; 1's complement हर bit को पलट देता है।",
        "विधि: complement, add, end-around carry. ऊपरी carry मतलब धनात्मक; wrap से ख़त्म कीजिए।",
        "ऊपरी carry न होना मतलब ऋणात्मक: sum का एक बार और complement लीजिए और minus चिह्न लगाइए।",
        "अगला module - 10's complement (radix): वही विचार, पर carry को wrap करने के बजाय आप उसे बस DISCARD कर देते हैं।"
      ],
      transcriptEN: "Let's bank what you own. You can now turn any subtraction into an addition by mirroring the subtrahend - that's the entire reason chips never need borrow logic. You can build both diminished-radix mirrors on sight: in decimal, nine minus each digit; in binary, flip every bit. You know the three-step recipe cold - complement, add, end-around carry - and you can read the top carry like a sign post: a one means the answer is positive and you finish with the wrap-around; a zero means the answer is negative, so you complement the sum a second time and write a minus. That is a complete, borrow-free subtractor living inside an adder. Next door we meet its cousin, the radix complement - the 10's complement in decimal, the 2's complement in binary. It chases the very same goal, but it has a cleaner ending: when a carry spills out of the top, it doesn't loop it back at all. It just throws it away. Let's go see why discarding works.",
      transcriptHI: "अब जो आपका है उसे जमा कर लें। आप अब किसी भी subtraction को addition में बदल सकते हैं, बस subtrahend को mirror करके - यही पूरी वजह है कि chips को कभी borrow logic नहीं चाहिए। आप दोनों diminished-radix mirror देखते ही बना सकते हैं: decimal में, नौ minus हर digit; binary में, हर bit पलट दीजिए। आपको तीन-कदम विधि ज़बानी याद है - complement, add, end-around carry - और आप ऊपरी carry को signboard की तरह पढ़ सकते हैं: एक मतलब जवाब धनात्मक और आप wrap से ख़त्म करते हैं; शून्य मतलब जवाब ऋणात्मक, तो sum का दूसरी बार complement लीजिए और minus लिखिए। यह एक पूरा, borrow-मुक्त subtractor है जो एक adder के अंदर बसा है। बग़ल में हम इसके चचेरे भाई से मिलते हैं, radix complement - decimal में 10's complement, binary में 2's complement। यह ठीक वही लक्ष्य पीछा करता है, पर इसका अंत और भी साफ़ है: जब ऊपर से carry छलकता है, यह उसे वापस loop करता ही नहीं। बस फेंक देता है। चलिए देखें discard क्यों काम करता है।",
      visualNote: "Recap card: the three-step recipe on the left, the sign fork on the right. Teaser tile 'NEXT: 10's complement - DISCARD the carry' with a carry bit dropping into a trash icon."
    }
  ],
  flashcards: [
    {
      frontEN: "Why do machines subtract with complements instead of borrowing?",
      backEN: "Borrowing ripples across columns and needs special slow logic. Complements turn A - B into A + (mirror of B), so one ordinary adder does both addition and subtraction.",
      frontHI: "मशीनें borrow के बजाय complement से क्यों घटाती हैं?",
      backHI: "Borrow columns में ripple करता है और ख़ास धीमी logic माँगता है। Complement, A - B को A + (B का mirror) में बदल देता है, तो एक साधारण adder ही जोड़ और घटाव दोनों कर देता है।"
    },
    {
      frontEN: "What is the difference between radix and diminished-radix complements?",
      backEN: "Radix is the Base complement (10's, 2's) and DISCARDS the top carry. Diminished-radix is Base - 1 (9's, 1's) and uses an END-AROUND CARRY.",
      frontHI: "Radix और diminished-radix complement में फ़र्क़ क्या है?",
      backHI: "Radix यानी Base complement (10's, 2's) और ऊपरी carry को DISCARD करता है। Diminished-radix यानी Base - 1 (9's, 1's) और END-AROUND CARRY वापरता है।"
    },
    {
      frontEN: "How do you form the 9's complement of a decimal number?",
      backEN: "Replace every digit d with 9 - d. Example: 9's complement of 03250 is 96749. Each digit and its mirror sum to 9.",
      frontHI: "किसी decimal संख्या का 9's complement कैसे बनाते हैं?",
      backHI: "हर digit d को 9 - d से बदलिए। उदाहरण: 03250 का 9's complement 96749 है। हर digit और उसका mirror मिलकर 9 बनाते हैं।"
    },
    {
      frontEN: "How do you form the 1's complement of a binary number?",
      backEN: "Flip every bit: 0 becomes 1 and 1 becomes 0. It is just the inverted bit pattern (a row of NOT gates).",
      frontHI: "किसी binary संख्या का 1's complement कैसे बनाते हैं?",
      backHI: "हर bit पलट दीजिए: 0 बन जाता है 1 और 1 बन जाता है 0. यह बस उल्टा किया हुआ bit pattern है (NOT gates की कतार)।"
    },
    {
      frontEN: "What are the three steps of diminished-radix subtraction?",
      backEN: "1) Complement the subtrahend. 2) Add it to the minuend. 3) End-around carry: if a carry leaves the top, drop it and add 1 at the bottom.",
      frontHI: "Diminished-radix subtraction के तीन कदम क्या हैं?",
      backHI: "1) Subtrahend का complement लीजिए। 2) उसे minuend में जोड़िए। 3) End-around carry: अगर ऊपर से carry निकले, उसे हटाइए और नीचे 1 जोड़िए।"
    },
    {
      frontEN: "After adding, what does a carry-out of 1 tell you?",
      backEN: "The result is POSITIVE (the minuend was larger). Finish with the end-around carry; that number is the final answer.",
      frontHI: "जोड़ने के बाद carry-out का 1 क्या बताता है?",
      backHI: "नतीजा धनात्मक (POSITIVE) है (minuend बड़ी थी)। End-around carry से ख़त्म कीजिए; वही संख्या आख़िरी जवाब है।"
    },
    {
      frontEN: "After adding, what do you do when the carry-out is 0?",
      backEN: "The result is NEGATIVE. The sum is still in mirror form, so take its complement again and attach a minus sign.",
      frontHI: "जोड़ने के बाद carry-out 0 हो तो क्या करते हैं?",
      backHI: "नतीजा ऋणात्मक (NEGATIVE) है। Sum अब भी mirror रूप में है, तो इसका फिर से complement लीजिए और minus चिह्न लगाइए।"
    },
    {
      frontEN: "Subtract 03250 from 72532 using 9's complement. What is the answer and why?",
      backEN: "Mirror 03250 -> 96749; 72532 + 96749 = 169281; a carry exists, so end-around carry gives 69282 (positive).",
      frontHI: "9's complement से 72532 में से 03250 घटाइए। जवाब क्या और क्यों?",
      backHI: "03250 का mirror 96749; 72532 + 96749 = 169281; carry मौजूद है, तो end-around carry देता है 69282 (धनात्मक)।"
    }
  ],
  quiz: [
    {
      questionEN: "Why do digital systems prefer complements over ordinary subtraction?",
      options: [
        "Complements are easier for humans to read",
        "Subtraction by borrowing needs slow ripple logic; complements let one adder do the job",
        "Complements use fewer digits",
        "Complements avoid the need for any addition"
      ],
      answerIndex: 1,
      explainEN: "Borrowing ripples across columns and needs dedicated logic. Complements rewrite A - B as A + (mirror of B), so the existing adder performs subtraction too.",
      explainHI: "Borrow columns में ripple करता है और अलग logic माँगता है। Complement, A - B को A + (B का mirror) में लिख देता है, तो मौजूद adder ही subtraction भी कर देता है।",
      questionHI: "Digital systems साधारण subtraction के बजाय complement को क्यों पसंद करते हैं?"
    },
    {
      questionEN: "Which pair is the DIMINISHED-radix complement family?",
      options: [
        "10's complement and 2's complement",
        "9's complement and 1's complement",
        "9's complement and 2's complement",
        "10's complement and 1's complement"
      ],
      answerIndex: 1,
      explainEN: "Diminished-radix means Base - 1: 9's complement in decimal (10 - 1) and 1's complement in binary (2 - 1). The 10's and 2's complements are the radix family.",
      explainHI: "Diminished-radix यानी Base - 1: decimal में 9's complement (10 - 1) और binary में 1's complement (2 - 1)। 10's और 2's complement radix परिवार हैं।",
      questionHI: "DIMINISHED-radix complement परिवार कौन सा युग्म है?"
    },
    {
      questionEN: "What is the 9's complement of the digit string 5408?",
      options: [
        "4591",
        "5409",
        "4592",
        "9999"
      ],
      answerIndex: 0,
      explainEN: "Replace each digit d with 9 - d: 9-5=4, 9-4=5, 9-0=9, 9-8=1, giving 4591. Check: each digit plus its mirror is 9.",
      explainHI: "हर digit d को 9 - d से बदलिए: 9-5=4, 9-4=5, 9-0=9, 9-8=1, यानी 4591। जाँच: हर digit जमा उसका mirror 9 होता है।",
      questionHI: "अंक-श्रृंखला 5408 का 9's complement क्या है?"
    },
    {
      questionEN: "In the diminished-radix method, what is the END-AROUND CARRY?",
      options: [
        "Throwing away the carry that leaves the top digit",
        "Removing the carry from the top and adding it back into the least significant digit",
        "Adding an extra zero on the left",
        "Carrying a borrow to the next column"
      ],
      answerIndex: 1,
      explainEN: "If the addition produces a carry out of the most significant digit, you drop that 1 from the top and add it back at the bottom (the LSB). That fold-back is the end-around carry.",
      explainHI: "अगर addition सबसे ऊपरी digit से carry पैदा करे, तो उस 1 को ऊपर से हटाइए और सबसे नीचे (LSB) वापस जोड़िए। वही मोड़कर लाना end-around carry है।",
      questionHI: "Diminished-radix विधि में END-AROUND CARRY क्या है?"
    },
    {
      questionEN: "After adding the minuend and the complement, the sum produced NO carry out of the top. What does this mean?",
      options: [
        "The answer is positive; do the end-around carry",
        "The answer is negative; complement the sum again and attach a minus sign",
        "You made an arithmetic mistake",
        "The two numbers were equal"
      ],
      answerIndex: 1,
      explainEN: "No top carry means the subtrahend was larger, so the result is negative. The sum is still in mirror form, so complement it once more and write a minus sign.",
      explainHI: "ऊपरी carry न होना मतलब subtrahend बड़ी थी, तो नतीजा ऋणात्मक है। Sum अब भी mirror रूप में है, तो इसका एक बार और complement लीजिए और minus चिह्न लिखिए।",
      questionHI: "Minuend और complement जोड़ने के बाद sum से कोई ऊपरी carry नहीं निकला। इसका क्या मतलब है?"
    },
    {
      questionEN: "Using 1's complement, compute 1010100 - 0111101 (84 - 61). What is the result?",
      options: [
        "0010110 (22)",
        "0010111 (23)",
        "1101000 (104)",
        "0011000 (24)"
      ],
      answerIndex: 1,
      explainEN: "1's complement of 0111101 is 1000010. 1010100 + 1000010 = 10010110; a carry exists, so end-around carry gives 0010111 = 23.",
      explainHI: "0111101 का 1's complement 1000010 है। 1010100 + 1000010 = 10010110; carry मौजूद है, तो end-around carry देता है 0010111 = 23।",
      questionHI: "1's complement से 1010100 - 0111101 (84 - 61) निकालिए। नतीजा क्या है?"
    }
  ]
};
