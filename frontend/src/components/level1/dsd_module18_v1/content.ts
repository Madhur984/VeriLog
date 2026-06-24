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
        "This module is about COMPLEMENTS, the clever trick that lets a machine turn subtraction (taking one number away from another) into plain addition. A complement is simply the 'mirror image' of a number inside its own number system, and the whole idea is that adding a mirror does the same job as subtracting the original. By the end you will never want to subtract the hard way again.",
        "One picture runs through everything you will see: every digit has a mirror, and the moment you mirror the second number, the minus sign in front of it quietly flips into a plus. Picture a number standing in front of a mirror - the reflection that stares back is its complement, and that reflection is what we actually add.",
        "There are two complement families, and we deliberately pick one. We focus on the DIMINISHED-radix family, which means 'one less than the base': the 9's complement in base 10 (because 9 is 10 minus 1) and the 1's complement in base 2 (because 1 is 2 minus 1). The other family, the radix complement (10's and 2's), is the very next module.",
        "You will learn one short three-step recipe and then run it on autopilot: mirror the subtrahend (the number being taken away), add that mirror to the first number, and then wrap any leftover carry back around to the bottom. That wrap-around has a name, the end-around carry, and it is the signature move of this whole family.",
        "Your last stop is reading the sign for free. After the add, a single bit - whether a carry popped out of the top or not - tells you instantly whether the true answer is positive or negative, and which finishing move to use. One mirror, one add, one carry to read: that is the entire method."
      ],
      theoryHI: [
        "यह module COMPLEMENTS के बारे में है - वह चतुर trick जो machine को subtraction (एक संख्या से दूसरी घटाना) को सादे addition में बदलने देती है। Complement बस किसी संख्या का उसके अपने number system के भीतर का 'mirror image' है, और पूरा विचार यही है कि mirror को जोड़ना उतना ही काम करता है जितना असली को घटाना। अंत तक आप कभी मुश्किल तरीक़े से घटाना नहीं चाहेंगे।",
        "एक ही तस्वीर पूरे module में चलती है: हर digit का एक mirror होता है, और जैसे ही आप दूसरी संख्या को mirror करते हैं, उसके आगे का minus चिह्न चुपचाप plus में बदल जाता है। कल्पना कीजिए एक संख्या आईने के सामने खड़ी है - जो परछाईं वापस झाँकती है वही उसका complement है, और हम असल में वही परछाईं जोड़ते हैं।",
        "Complement के दो परिवार हैं, और हम जान-बूझकर एक चुनते हैं। हम DIMINISHED-radix परिवार पर ध्यान देते हैं, यानी 'base से एक कम': base 10 में 9's complement (क्योंकि 9 यानी 10 minus 1) और base 2 में 1's complement (क्योंकि 1 यानी 2 minus 1)। दूसरा परिवार, radix complement (10's और 2's), ठीक अगला module है।",
        "आप एक छोटी तीन-कदम वाली विधि सीखेंगे और फिर उसे अपने-आप चलाएँगे: subtrahend (जिसे घटाना है) को mirror कीजिए, उस mirror को पहली संख्या में जोड़िए, और बचे हुए किसी carry को घुमा कर वापस सबसे नीचे लाइए। इस घुमाव का नाम है end-around carry, और यही पूरे परिवार की ख़ास पहचान है।",
        "आख़िरी पड़ाव है sign को मुफ़्त में पढ़ना। जोड़ने के बाद एक अकेला bit - ऊपर से carry निकला या नहीं - तुरंत बता देता है कि असली जवाब धनात्मक है या ऋणात्मक, और कौन सी आख़िरी चाल वापरनी है। एक mirror, एक add, एक carry पढ़ना: यही पूरी विधि है।"
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
        "Here is how the video frames the whole idea. We want to compute A minus B, but we refuse to subtract. So we rewrite the problem as A plus the complement of B, where the complement is B's mirror inside its number system. The minus has vanished, and an ordinary adder is now doing subtraction.",
        "The film makes one distinction crystal clear: there are two complement systems, not one. The RADIX system uses the base itself (10's complement in decimal, 2's complement in binary), while the DIMINISHED-RADIX system uses one less than the base (9's and 1's, since 9 = 10 - 1 and 1 = 2 - 1). They are cousins that give the same answer but finish in opposite ways.",
        "This module follows the diminished-radix method, and it has one special last step that the radix method does not need: the end-around carry. Whenever the add throws a carry out of the most significant (left-most) digit, that carry is precious - it must be brought all the way back around.",
        "Watch carefully how that top carry is treated. It is never thrown away. Instead it loops out of the top of the sum, travels around, and is added back into the least significant (right-most) digit - like a ball rolling off one end of a table and being caught at the other end and dropped back on.",
        "Keep exactly one question in your head for the whole film: did the top of the sum produce a carry, yes or no? That single yes-or-no decides the sign of the answer and which finishing move you perform, so it is the only thing you really have to watch for."
      ],
      theoryHI: [
        "Video पूरे विचार को ऐसे रखती है। हमें A minus B निकालना है, पर हम घटाने से इनकार करते हैं। तो हम समस्या को फिर से लिखते हैं: A plus B का complement, जहाँ complement, B का उसके number system के भीतर का mirror है। Minus ग़ायब हो गया, और एक साधारण adder अब subtraction कर रहा है।",
        "Film एक फ़र्क़ बिलकुल साफ़ कर देती है: complement systems दो हैं, एक नहीं। RADIX system base को ख़ुद वापरता है (decimal में 10's complement, binary में 2's complement), जबकि DIMINISHED-RADIX system base से एक कम वापरता है (9's और 1's, क्योंकि 9 = 10 - 1 और 1 = 2 - 1)। ये चचेरे भाई हैं जो जवाब एक देते हैं पर ख़त्म उल्टे तरीक़ों से होते हैं।",
        "यह module diminished-radix विधि का पीछा करता है, और इसका एक ख़ास आख़िरी कदम है जो radix विधि को नहीं चाहिए: end-around carry। जब भी add सबसे ऊपरी (बाएँ) digit से carry फेंके, वह carry क़ीमती है - उसे पूरा घुमा कर वापस लाना ज़रूरी है।",
        "ध्यान से देखिए कि उस ऊपरी carry के साथ क्या होता है। उसे कभी फेंका नहीं जाता। बजाय इसके वह sum के ऊपर से निकलता है, घूमकर आता है, और सबसे नीचे वाले (दाएँ) digit में वापस जोड़ दिया जाता है - जैसे एक गेंद मेज़ के एक सिरे से लुढ़के और दूसरे सिरे पर पकड़कर वापस रख दी जाए।",
        "पूरी film के लिए मन में बस एक सवाल रखिए: sum के ऊपरी सिरे से carry निकला, हाँ या नहीं? यह अकेला हाँ-या-ना जवाब का sign और कौन सी आख़िरी चाल करनी है दोनों तय करता है, इसलिए असल में आपको बस यही देखना है।"
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
        "Let us be honest about why ordinary subtraction is painful for a machine. Standard subtraction relies on BORROWING: when a column comes up short and cannot cope, it reaches over and pulls a unit from the column to its left. On paper that is mildly annoying; for a chip it is genuinely expensive.",
        "The real problem is that the borrow does not stay put. In hardware that borrow must ripple left through every column, one after another, like a line of dominoes toppling - if the next column is also empty it borrows again, and the worst case has a borrow crawling across the entire number before the answer settles. Dedicated borrow logic is slow and complicated to build.",
        "Addition has none of this drama. Adder hardware is everywhere, cheap, fast, and the most heavily optimised block in all of digital design - the same circuit sits inside every CPU, calculator, and phone. So the engineer's instinct is irresistible: build one excellent adder and find a way to make it subtract too, rather than designing a second, fiddlier circuit.",
        "Complements let them do exactly that, and this is where the mirror walks in. Subtraction becomes a two-word recipe - 'mirror, then add'. You replace the number you are taking away with its mirror image, feed both into the adder, and the difference falls out the other side. The borrow logic disappears completely.",
        "The payoff is one piece of silicon doing two jobs. Same adder, addition and subtraction both - and that economy is precisely why every CPU on earth subtracts with complements, never with borrows. Reusing one good circuit beats building two, every single time."
      ],
      theoryHI: [
        "ईमानदारी से देखें कि साधारण subtraction machine के लिए दर्द क्यों है। Standard subtraction BORROWING पर टिकी है: जब कोई column कम पड़ जाए और सँभाल न पाए, तो वह अपनी बाईं ओर वाले column से एक unit खींच लेता है। काग़ज़ पर यह थोड़ा खिजाने वाला है; chip के लिए यह सचमुच महँगा है।",
        "असली समस्या यह है कि borrow एक जगह नहीं रुकता। Hardware में वह borrow हर column से होते हुए, एक के बाद एक, बाईं ओर ripple करता है - जैसे dominoes की कतार गिरती है - अगर अगला column भी ख़ाली हो तो वह फिर borrow करता है, और सबसे ख़राब हालत में borrow पूरी संख्या में रेंगता है तब जाकर जवाब टिकता है। अलग borrow logic बनाना धीमा और पेचीदा है।",
        "Addition में ऐसा कोई नाटक नहीं। Adder का hardware हर जगह है, सस्ता है, तेज़ है, और पूरे digital design का सबसे ज़्यादा optimise किया गया block है - वही circuit हर CPU, calculator और phone के अंदर बैठा है। तो engineer की प्रवृत्ति अटल है: एक बढ़िया adder बनाओ और उसी से घटाने का तरीक़ा निकालो, बजाय दूसरा झंझटी circuit बनाने के।",
        "Complements उन्हें ठीक यही करने देते हैं, और यहीं mirror आता है। Subtraction दो-शब्द की विधि बन जाती है - 'mirror करो, फिर जोड़ो'। जिस संख्या को घटाना है उसे उसके mirror image से बदलिए, दोनों को adder में डालिए, और difference दूसरी ओर से निकल आता है। Borrow logic पूरी तरह ग़ायब हो जाती है।",
        "नतीजा यह कि एक ही silicon दो काम करता है। वही adder, जोड़ और घटाव दोनों - और यही किफ़ायत ठीक वजह है कि धरती का हर CPU complement से घटाता है, borrow से कभी नहीं। एक अच्छे circuit को दोबारा वापरना दो बनाने से हर बार बेहतर है।"
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
        "There is not just one complement - there are two whole families, and keeping them apart will save you a lot of confusion later. The first is the RADIX complement, named after the base (radix) itself: that is the 10's complement in decimal and the 2's complement in binary. 'Radix' is just the formal word for the base, the number of distinct digits a system uses.",
        "The second family is the DIMINISHED-RADIX complement, named after one less than the base: the 9's complement in decimal and the 1's complement in binary. The name literally spells out the rule - 9 is 10 minus 1, and 1 is 2 minus 1 - so the diminished system mirrors every digit against Base minus 1 instead of against the base.",
        "Think of them as two mirrors hung side by side. They are cousins and they produce almost the same answer, but they handle the leftover carry in exactly opposite ways - and that one difference is the whole reason we keep them separate.",
        "Here is the signature behaviour. The diminished-radix family needs an END-AROUND CARRY: any carry that spills out of the top is looped back into the bottom and added in. The radix family does the opposite - it simply DISCARDS that top carry and throws it away. Remember this contrast and you can never confuse the two.",
        "This entire module lives in the diminished-radix mirror - the 9's and 1's complement with their end-around carry. The radix mirror (the 10's and 2's complement that discards the carry) is the very next module, so for now keep your eyes locked on the right-hand family."
      ],
      theoryHI: [
        "Complement सिर्फ़ एक नहीं होता - पूरे दो परिवार होते हैं, और इन्हें अलग रखना आपको आगे बहुत उलझन से बचाएगा। पहला है RADIX complement, जो base (radix) के नाम पर है: यानी decimal में 10's complement और binary में 2's complement। 'Radix' base का ही औपचारिक शब्द है - किसी system में कितने अलग digit होते हैं उनकी गिनती।",
        "दूसरा परिवार है DIMINISHED-RADIX complement, जो base से एक कम के नाम पर है: decimal में 9's complement और binary में 1's complement। नाम ही नियम बता देता है - 9 यानी 10 minus 1, और 1 यानी 2 minus 1 - तो diminished system हर digit को base के बजाय Base minus 1 के सामने mirror करता है।",
        "इन्हें अग़ल-बग़ल टँगे दो आईने समझिए। ये चचेरे भाई हैं और लगभग एक ही जवाब देते हैं, पर बचे हुए carry को बिलकुल उल्टे तरीक़ों से सँभालते हैं - और यही एक फ़र्क़ पूरी वजह है कि हम इन्हें अलग रखते हैं।",
        "इनकी ख़ास पहचान यह है। Diminished-radix परिवार को END-AROUND CARRY चाहिए: ऊपर से छलकने वाला कोई भी carry वापस नीचे loop करके जोड़ दिया जाता है। Radix परिवार उल्टा करता है - वह उस ऊपरी carry को बस DISCARD कर देता है, फेंक देता है। यह फ़र्क़ याद रखिए और आप दोनों को कभी नहीं उलझाएँगे।",
        "यह पूरा module diminished-radix mirror में बसता है - 9's और 1's complement अपने end-around carry के साथ। Radix mirror (10's और 2's complement जो carry को discard करता है) ठीक अगला module है, तो फ़िलहाल दाईं ओर वाले परिवार पर नज़र टिकाए रखिए।"
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
        "Making the mirror is the easy part, and it is the heart of the whole trick, so let us be precise. In base 10 the 9's complement replaces every digit d with 9 minus d. The mirror of 2 is 7, the mirror of 0 is 9, the mirror of 5 is 4 - so the number 03250 mirrors digit by digit into 96749. No magic, just nine-minus-each-digit.",
        "In base 2 it is even simpler. The 1's complement replaces every bit b with 1 minus b, and one-minus-a-bit is just the flip: 0 becomes 1 and 1 becomes 0. So the 1's complement is literally the inverted bit pattern - exactly what a row of NOT gates (inverters) produces in hardware, which is why binary complements are practically free to build.",
        "The most important property is that the mirror is purely LOCAL: each digit is mirrored entirely on its own. There is no carrying and no borrowing while you build the complement, because no digit ever looks at its neighbour. That independence is what makes the mirror fast - every digit flips in parallel, all at once.",
        "Keep one quick sanity check in your head, drawn straight from the analogy: a digit and its 9's-complement always sum to 9, because 2 + 7 = 9 and 5 + 4 = 9; in binary a bit and its flip always sum to 1. If your pair does not add up to Base minus 1, you mirrored it wrong - the reflection has to balance the original.",
        "Play with the toggle below to feel it: pick a base, set any number, and watch its diminished-radix mirror form digit by digit, with each pair shown adding up to Base minus 1. Mirror enough numbers and soon you will reflect them on sight, without thinking."
      ],
      theoryHI: [
        "Mirror बनाना आसान हिस्सा है, और यही पूरी trick का दिल है, तो ठीक से समझ लें। Base 10 में 9's complement हर digit d को 9 minus d से बदल देता है। 2 का mirror 7, 0 का mirror 9, 5 का mirror 4 - तो संख्या 03250 digit-दर-digit 96749 में mirror हो जाती है। कोई जादू नहीं, बस नौ-minus-हर-digit।",
        "Base 2 में तो और भी आसान। 1's complement हर bit b को 1 minus b से बदलता है, और एक-minus-एक-bit बस flip है: 0 बन जाता है 1 और 1 बन जाता है 0. तो 1's complement सचमुच उल्टा किया हुआ bit pattern है - ठीक वही जो NOT gates (inverters) की एक कतार hardware में बनाती है, इसीलिए binary complement बनाना लगभग मुफ़्त है।",
        "सबसे ज़रूरी गुण यह है कि mirror पूरी तरह LOCAL है: हर digit अपने-आप, बिलकुल अकेले mirror होता है। Complement बनाते समय कोई carry और कोई borrow नहीं होता, क्योंकि कोई digit अपने पड़ोसी को देखता ही नहीं। यही स्वतंत्रता mirror को तेज़ बनाती है - हर digit एक साथ, समानांतर में पलटता है।",
        "मन में एक झटपट जाँच रखिए, सीधे analogy से निकली: एक digit और उसका 9's-complement हमेशा मिलकर 9 बनाते हैं, क्योंकि 2 + 7 = 9 और 5 + 4 = 9; binary में एक bit और उसका flip हमेशा मिलकर 1 बनाते हैं। अगर आपकी जोड़ी Base minus 1 नहीं बनाती, तो आपने mirror ग़लत बनाया - परछाईं को असली के साथ संतुलित होना ही पड़ता है।",
        "नीचे toggle से खेलिए और महसूस कीजिए: base चुनिए, कोई भी संख्या तय कीजिए, और देखिए उसका diminished-radix mirror digit-दर-digit बनता हुआ, हर जोड़ी Base minus 1 बनाती दिखती हुई। काफ़ी संख्याएँ mirror कीजिए और जल्द ही आप उन्हें देखते ही, बिना सोचे, परछाईं में बदल देंगे।"
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
        "The whole method is three short steps, and you will soon do them on autopilot. Step 1 is COMPLEMENT: take the diminished-radix mirror of the subtrahend - that is the number being taken away, the B in A minus B. You leave the first number untouched and only mirror the one you are subtracting.",
        "Step 2 is ADD: add that mirror directly to the minuend, the number you started with (the A in A minus B), using nothing but ordinary, everyday addition. This is the step that quietly does the subtraction for you - because adding the mirror is the same as taking the original away.",
        "Step 3 is the END-AROUND CARRY, the move that gives this family its name. Look at the very top of your sum. If the addition produced a carry out of the most significant digit, you do not keep it up there - you peel that 1 off the top and add it back in at the very bottom (the least significant digit), then add once more.",
        "That little wrap-around is the entire personality of the diminished-radix system, and the analogy makes it stick: the carry rolls off the top of the table and you catch it and drop it back on at the bottom - never thrown away, always brought home. Forget this fold-back and the answer comes out one short.",
        "There is a bonus hidden in step 3: that top carry is also a signal. A carry of 1 guarantees the true answer is positive, and when the carry is missing the answer is negative. So the same bit you wrap around also tells you the sign - which is exactly what the next page is about."
      ],
      theoryHI: [
        "पूरी विधि तीन छोटे कदम है, और जल्द ही आप इन्हें अपने-आप करेंगे। Step 1 है COMPLEMENT: subtrahend का diminished-radix mirror लीजिए - यानी जिस संख्या को घटाना है, A minus B वाला B। पहली संख्या को छेड़े बिना, सिर्फ़ जिसे घटाना है उसी को mirror कीजिए।",
        "Step 2 है ADD: उस mirror को सीधे minuend में जोड़िए, यानी जहाँ से आपने शुरू किया था (A minus B वाला A), सिर्फ़ साधारण, रोज़मर्रा की addition से। यही वह कदम है जो चुपचाप आपके लिए subtraction कर देता है - क्योंकि mirror को जोड़ना उतना ही है जितना असली को घटाना।",
        "Step 3 है END-AROUND CARRY, वही चाल जो इस परिवार को उसका नाम देती है। अपने sum के बिलकुल ऊपरी सिरे को देखिए। अगर addition ने सबसे ऊपरी digit से carry पैदा किया, तो उसे ऊपर मत रखिए - उस 1 को ऊपर से छीलिए और बिलकुल नीचे (least significant digit) में वापस जोड़िए, फिर एक बार और जोड़ लीजिए।",
        "यही छोटा सा wrap-around diminished-radix system का पूरा स्वभाव है, और analogy इसे चिपका देती है: carry मेज़ के ऊपरी सिरे से लुढ़कता है और आप उसे पकड़कर नीचे वापस रख देते हैं - कभी फेंका नहीं जाता, हमेशा घर वापस लाया जाता है। यह मोड़ना भूलिए और जवाब एक कम निकलता है।",
        "Step 3 में एक bonus छिपा है: वह ऊपरी carry एक संकेत भी है। carry का 1 पक्का करता है कि असली जवाब धनात्मक है, और जब carry ग़ायब हो तो जवाब ऋणात्मक है। तो जिस bit को आप wrap करते हैं वही sign भी बता देता है - और अगला पन्ना ठीक इसी के बारे में है।"
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
        "Step three really splits into two different endings, and the top carry is the signpost that tells you which one you are in. After the add, look at the very top of the sum. A carry-out of 1 means the minuend (the number you started with) was the larger of the two, so the true answer is POSITIVE.",
        "In the positive case you finish with the end-around carry you already know: drop the leading 1 from the top and add 1 at the bottom. Whatever number remains IS the final answer, full stop - no further work, no sign to add, because positive is the default.",
        "A carry-out of 0 means the opposite: the subtrahend (the number you took away) was the larger one, so the true answer is NEGATIVE. The absence of a carry is just as informative as its presence - it is the system quietly telling you the result dipped below zero.",
        "The negative case has one subtle twist. The sum sitting in front of you is not the magnitude yet - it is still wearing its mirror disguise, still a reflection. To unmask the real number you take its diminished-radix complement ONE MORE TIME (mirror the mirror), and then write a minus sign in front of the result.",
        "So everything hangs on a single bit. The top carry simultaneously tells you the sign of the answer AND which finishing ritual to perform - wrap-around for positive, mirror-again-and-add-minus for negative. Read that one bit first, every single time, and you will never get lost in the method."
      ],
      theoryHI: [
        "तीसरा कदम असल में दो अलग अंत में बँट जाता है, और ऊपरी carry वही signboard है जो बताता है कि आप किसमें हैं। जोड़ने के बाद sum के बिलकुल ऊपरी सिरे को देखिए। carry-out का 1 मतलब minuend (जहाँ से शुरू किया) दोनों में बड़ी थी, तो असली जवाब धनात्मक (POSITIVE) है।",
        "धनात्मक हालत में आप उसी end-around carry से ख़त्म करते हैं जिसे आप जानते हैं: अग्रणी 1 को ऊपर से हटाइए और नीचे 1 जोड़िए। जो संख्या बचती है वही आख़िरी जवाब है, बस - कोई और काम नहीं, कोई sign जोड़ना नहीं, क्योंकि धनात्मक तो default है।",
        "carry-out का 0 मतलब उल्टा: subtrahend (जिसे घटाया) बड़ी थी, तो असली जवाब ऋणात्मक (NEGATIVE) है। carry का न होना उतना ही बताता है जितना उसका होना - यह system चुपचाप कह रहा है कि नतीजा शून्य के नीचे चला गया।",
        "ऋणात्मक हालत में एक बारीक मोड़ है। आपके सामने बैठा sum अभी magnitude नहीं है - वह अब भी अपना mirror भेस पहने है, अब भी एक परछाईं है। असली संख्या को बेनक़ाब करने के लिए इसका diminished-radix complement एक बार और लीजिए (mirror का mirror), और फिर नतीजे के आगे minus चिह्न लिख दीजिए।",
        "तो सब कुछ एक अकेले bit पर टिका है। ऊपरी carry एक साथ जवाब का sign भी बताता है और कौन सी आख़िरी रस्म करनी है यह भी - धनात्मक के लिए wrap-around, ऋणात्मक के लिए फिर-से-mirror-और-minus। हर बार पहले वही एक bit पढ़िए, और आप विधि में कभी नहीं भटकेंगे।"
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
        "Now you drive the mirror yourself. In the interactive below, choose your base - DEC runs the 9's complement, BIN runs the 1's complement - then set A, the minuend (the number you start with), and B, the subtrahend (the number you take away). Every digit in the panel is computed live in code, so you can trust it as ground truth.",
        "The panel walks all three steps in front of you: Step 1 shows the mirror of B, Step 2 shows A plus that mirror with any top carry highlighted, and Step 3 resolves the ending - either the end-around carry for a positive result or a second complement-and-minus for a negative one. Read the carry, follow the branch.",
        "Start with the classic positive proof, 72532 minus 03250. Watch B mirror into 96749 (each digit is 9 minus itself), watch the addition 72532 + 96749 throw a carry out of the top, wrap that carry back to the bottom, and land exactly on 69282 - which is indeed 72532 - 03250.",
        "Now flip the two operands and try 03250 minus 72532. This time no carry appears, which flags a negative result, so the machine takes the complement of the sum a second time and stamps a minus sign, giving -69282 - the same magnitude as before, opposite sign, exactly as arithmetic demands.",
        "Finally switch to BIN and subtract 61 from 84 as 1010100 minus 0111101. Flip every bit of the subtrahend, add, do the end-around carry, and read 0010111, which is 23 in decimal - and 84 - 61 really is 23. Feel all three cases under your fingers and the method becomes second nature."
      ],
      theoryHI: [
        "अब आप ख़ुद mirror चलाइए। नीचे के interactive में अपना base चुनिए - DEC 9's complement चलाता है, BIN 1's complement - फिर A यानी minuend (जहाँ से शुरू करते हैं) और B यानी subtrahend (जिसे घटाते हैं) तय कीजिए। Panel का हर digit code में live गिना जाता है, तो आप इसे पक्का सच मान सकते हैं।",
        "Panel तीनों कदम आपके सामने चलाता है: Step 1 B का mirror दिखाता है, Step 2 A plus वह mirror दिखाता है और ऊपरी carry को उजागर करता है, और Step 3 अंत तय करता है - धनात्मक नतीजे के लिए end-around carry या ऋणात्मक के लिए दूसरी बार complement-और-minus। carry पढ़िए, शाखा का पीछा कीजिए।",
        "शुरुआत classic धनात्मक proof से कीजिए, 72532 minus 03250. देखिए B, 96749 में mirror होता है (हर digit 9 minus ख़ुद), देखिए addition 72532 + 96749 ऊपर से एक carry फेंकता है, उस carry को वापस नीचे wrap कीजिए, और ठीक 69282 पर पहुँचिए - जो सचमुच 72532 - 03250 है।",
        "अब दोनों operands पलट दीजिए और आज़माइए 03250 minus 72532. इस बार कोई carry नहीं आता, जो ऋणात्मक नतीजे की झंडी है, तो machine sum का complement दूसरी बार लेती है और minus चिह्न ठोक देती है, देती है -69282 - वही magnitude जैसा पहले, उल्टा sign, ठीक जैसा गणित माँगता है।",
        "आख़िर में BIN पर जाइए और 84 में से 61 घटाइए 1010100 minus 0111101 के रूप में। subtrahend का हर bit पलटिए, जोड़िए, end-around carry कीजिए, और पढ़िए 0010111, जो decimal में 23 है - और 84 - 61 सचमुच 23 है। तीनों हालतें उँगलियों में महसूस कर लीजिए और विधि स्वभाव बन जाती है।"
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
        "These eight flip-cards drill the four things that matter: the two mirrors (9's and 1's complement), the three-step recipe, and the rule that turns a carry into a sign. Run them until each one is pure reflex, so that in an exam you mirror, add, and read the carry without a second thought.",
        "Use them actively, not passively. Cover the back, say the answer out loud from memory, then flip the card to check - and give extra reps to the negative-result card, because forgetting to complement the sum a second time is the single most common slip in the whole method.",
        "If you carry only two facts out of this module, make them these: always mirror against Base minus 1 (9 in decimal, 1 in binary), and remember that a top carry means the answer is positive so you finish with the end-around carry. Everything else follows from those two."
      ],
      theoryHI: [
        "ये आठ flip-cards उन चार चीज़ों को रटाते हैं जो मायने रखती हैं: दोनों mirror (9's और 1's complement), तीन-कदम विधि, और वह नियम जो carry को sign में बदलता है। इन्हें तब तक चलाइए जब तक हर एक पूरा reflex न बन जाए, ताकि exam में आप बिना दोबारा सोचे mirror करें, जोड़ें, और carry पढ़ें।",
        "इन्हें सक्रिय रूप से वापरिए, निष्क्रिय नहीं। पीछे का हिस्सा ढकिए, जवाब याद से ज़ोर से बोलिए, फिर जाँचने के लिए card पलटिए - और ऋणात्मक-नतीजे वाले card को ज़्यादा बार दोहराइए, क्योंकि sum का दूसरी बार complement लेना भूल जाना पूरी विधि की सबसे आम फिसलन है।",
        "अगर इस module से सिर्फ़ दो बातें साथ ले जाएँ, तो ये हों: हमेशा Base minus 1 के सामने mirror कीजिए (decimal में 9, binary में 1), और याद रखिए कि ऊपरी carry मतलब जवाब धनात्मक है तो आप end-around carry से ख़त्म करते हैं। बाक़ी सब इन्हीं दो से निकलता है।"
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
        "Six multiple-choice questions wait in the arena, covering the full module: telling the two families apart, building both mirrors (9's and 1's) on demand, the end-around carry, and the sign rule. They are designed to catch the exact places students slip, so read each option carefully before choosing.",
        "At least two of the six zero in on the carry, because that is where understanding really shows: what a top carry means, and what to do when it is absent (the negative case where you mirror the sum again and add a minus). Take those questions slowly - the wrong options are the classic mistakes dressed up to look right.",
        "Aim for full marks before you move on. Once you can clear all six cleanly, you have genuinely mastered the diminished-radix mirror and you are ready for its cousin next door - the 10's complement, which discards the carry instead of wrapping it."
      ],
      theoryHI: [
        "Arena में छह bahu-vikalp सवाल इंतज़ार कर रहे हैं, जो पूरा module समेटते हैं: दोनों परिवार अलग करना, माँगने पर दोनों mirror (9's और 1's) बनाना, end-around carry, और sign नियम। ये ठीक उन जगहों को पकड़ने के लिए बने हैं जहाँ students फिसलते हैं, तो चुनने से पहले हर विकल्प ध्यान से पढ़िए।",
        "छह में से कम से कम दो सीधे carry पर निशाना लगाते हैं, क्योंकि समझ असल में वहीं दिखती है: ऊपरी carry का मतलब क्या है, और जब वह ग़ायब हो तो क्या करना है (ऋणात्मक हालत जहाँ आप sum को फिर से mirror करते हैं और minus लगाते हैं)। उन सवालों को धीरे लीजिए - ग़लत विकल्प classic ग़लतियों को सही दिखने के भेस में रखते हैं।",
        "आगे बढ़ने से पहले पूरे अंक का लक्ष्य रखिए। जब आप छहों साफ़-साफ़ निकाल लें, तब आपने सचमुच diminished-radix mirror पर महारत पा ली है और आप बग़ल वाले इसके चचेरे भाई के लिए तैयार हैं - 10's complement, जो carry को wrap करने के बजाय discard कर देता है।"
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
        "Let us bank what you now own. You can turn any subtraction A minus B into the addition A plus the mirror of B, so a plain adder does all the work and no borrow logic is needed anywhere - that single insight is the whole reason chips never subtract the hard way.",
        "You can build both diminished-radix mirrors on sight. The 9's complement replaces each decimal digit d with 9 minus d (so 03250 becomes 96749), and the 1's complement simply flips every bit, 0 to 1 and 1 to 0 - just a row of NOT gates. Each digit mirrors on its own, with no carrying.",
        "You know the three-step recipe cold: complement the subtrahend, add it to the minuend, then do the end-around carry. And you can read the top carry like a signpost - a carry of 1 means the answer is positive, so you finish with the wrap-around and that number is the answer.",
        "You also handle the harder ending. No top carry means the answer is negative: the sum is still in mirror form, so you complement it once more (mirror the mirror) and attach a minus sign. One bit, the top carry, drives both the sign and the finishing move.",
        "Next door is the radix cousin, the 10's complement in decimal and the 2's complement in binary. It chases the very same goal with the very same mirror idea, but it has a cleaner ending: when a carry spills out of the top, it does not loop it back at all - it simply DISCARDS it, throws it straight in the bin. Let us go see why discarding works."
      ],
      theoryHI: [
        "अब जो आपका है उसे जमा कर लें। आप किसी भी subtraction A minus B को addition A plus B के mirror में बदल सकते हैं, तो एक सादा adder ही पूरा काम कर देता है और कहीं कोई borrow logic नहीं चाहिए - यही एक समझ पूरी वजह है कि chips कभी मुश्किल तरीक़े से नहीं घटाते।",
        "आप दोनों diminished-radix mirror देखते ही बना सकते हैं। 9's complement हर decimal digit d को 9 minus d से बदलता है (तो 03250 बन जाता है 96749), और 1's complement बस हर bit पलट देता है, 0 को 1 और 1 को 0 - सिर्फ़ NOT gates की कतार। हर digit अपने-आप mirror होता है, कोई carry नहीं।",
        "आपको तीन-कदम विधि ज़बानी याद है: subtrahend का complement लीजिए, उसे minuend में जोड़िए, फिर end-around carry कीजिए। और आप ऊपरी carry को signboard की तरह पढ़ सकते हैं - carry का 1 मतलब जवाब धनात्मक है, तो आप wrap-around से ख़त्म करते हैं और वही संख्या जवाब है।",
        "आप मुश्किल अंत भी सँभालते हैं। ऊपरी carry न होना मतलब जवाब ऋणात्मक है: sum अब भी mirror रूप में है, तो आप इसका एक बार और complement लेते हैं (mirror का mirror) और minus चिह्न लगाते हैं। एक bit, ऊपरी carry, sign और आख़िरी चाल दोनों चलाता है।",
        "बग़ल में radix चचेरा भाई है, decimal में 10's complement और binary में 2's complement। यह ठीक वही लक्ष्य उसी mirror विचार से पीछा करता है, पर इसका अंत और साफ़ है: जब ऊपर से carry छलकता है, यह उसे वापस loop करता ही नहीं - बस DISCARD कर देता है, सीधे कूड़े में फेंक देता है। चलिए देखें discard क्यों काम करता है।"
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
