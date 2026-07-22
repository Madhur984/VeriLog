import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/26 - Universal Logic & Shannon ("The Swiss Army Knife & The Traffic
 * Intersection").
 * Source: dsd26.json (Universal Logic & Shannon's Expansion Theorem) +
 * dsd26-shannon-en.mp4.
 *
 * Two big ideas, one analogy each.  NAND (and NOR) is the digital SWISS ARMY
 * KNIFE: a single gate type folds out into NOT, AND, OR, XOR and beyond, so it
 * can build ANY logic at all (it is functionally complete / universal).  Shannon
 * expansion F = x'.F0 + x.F1 is a TRAFFIC INTERSECTION that, looking at one
 * variable, routes a function down one of two roads - which is exactly a 2-to-1
 * MUX, so the MUX is universal too.  Boolean algebra is ASCII: NOT = ', AND = .,
 * OR = +, XOR = ^.  Every value in the scenes is computed in code.
 */
export const CONTENT = ({
  moduleTitle: 'Universal Logic & Shannon',
  moduleSubtitle:
    'One gate - NAND - is a Swiss Army knife that folds out into every other gate, and one theorem turns any function into a traffic intersection of 2-to-1 MUXes.',
  scenes: [
    {
      id: 'S00_Cover',
      label: 'One Tool For All',
      kind: 'cover',
      subtitle:
        'NAND is the Swiss Army knife of logic, and Shannon expansion is the traffic intersection - both let one simple thing build everything.',
      theoryEN: [
        "This module is about UNIVERSALITY: the surprising fact that you do not need a drawer full of different logic gates to build a computer. You can build every gate, every adder, every CPU, out of copies of just one gate type. The two heroes of the story are the NAND gate and the Shannon expansion theorem, and each one carries a picture you should hold onto for the whole module.",
        "First picture: the NAND gate is the digital SWISS ARMY KNIFE. A Swiss Army knife is one small body that folds out into a blade, scissors, a screwdriver and a corkscrew - one object that becomes every tool you need at the campsite. In exactly the same way, copies of a single NAND gate fold out into NOT, AND, OR and XOR, so one gate type alone is enough to build any Boolean function. We say NAND is functionally complete, or universal.",
        "Second picture: Shannon's expansion is a TRAFFIC INTERSECTION. Stand at a fork in the road with one traffic light. If the light (one variable x) says 0, you take the left road; if it says 1, you take the right road. Written as algebra this is F = x'.F0 + x.F1, and that is exactly what a 2-to-1 multiplexer (MUX) does: x is the select line, and the two roads F0 and F1 are the data inputs. So the MUX is universal too.",
        "Why care? Chip factories love to repeat ONE transistor pattern millions of times, so a fabric built from a single gate type is cheaper to manufacture, needs fewer transistors and shrinks the library of cells the designer must keep. In CMOS, NAND and NOR are naturally inverting, which makes them genuinely cheaper in silicon than buffered AND and OR gates.",
        "By the end you will be able to fold NOT, AND and OR out of NAND yourself, write Shannon's expansion F = x'.F0 + x.F1 for any function, find its cofactors F0 and F1, and wire that expansion onto a 2-to-1 MUX - then chain MUXes into a tree that can build literally any logic at all."
      ],
      theoryHI: [
        "यह module UNIVERSALITY के बारे में है: यह हैरान कर देने वाली बात कि computer बनाने के लिए आपको अलग-अलग logic gates से भरा एक दराज़ नहीं चाहिए। आप हर gate, हर adder, हर CPU को सिर्फ़ एक ही gate type की copies से बना सकते हैं। कहानी के दो नायक हैं NAND gate और Shannon expansion theorem, और हर एक के साथ एक तस्वीर है जिसे पूरे module में पकड़े रखिए।",
        "पहली तस्वीर: NAND gate digital SWISS ARMY KNIFE है। एक Swiss Army knife एक छोटा सा body होता है जो एक blade, scissors, एक screwdriver और एक corkscrew में खुल जाता है - एक ही चीज़ जो campsite पर हर tool बन जाती है। बिलकुल इसी तरह, एक अकेले NAND gate की copies NOT, AND, OR और XOR में खुल जाती हैं, तो अकेला एक gate type किसी भी Boolean function को बनाने के लिए काफ़ी है। हम कहते हैं NAND functionally complete, या universal, है।",
        "दूसरी तस्वीर: Shannon की expansion एक TRAFFIC INTERSECTION है। एक traffic light वाले सड़क के fork पर खड़े होइए। अगर light (एक variable x) 0 कहे, आप बाईं सड़क लीजिए; अगर 1 कहे, दाईं सड़क लीजिए। algebra में यह F = x'.F0 + x.F1 है, और यही ठीक वही है जो एक 2-to-1 multiplexer (MUX) करता है: x select line है, और दोनों सड़कें F0 और F1 data inputs हैं। तो MUX भी universal है।",
        "परवाह क्यों करें? Chip factories एक ही transistor pattern को लाखों बार दोहराना पसंद करती हैं, तो एक ही gate type से बना fabric बनाने में सस्ता पड़ता है, कम transistors चाहिए और designer को रखने वाली cells की library छोटी हो जाती है। CMOS में, NAND और NOR स्वभाव से inverting हैं, जो उन्हें silicon में buffered AND और OR gates से सचमुच सस्ता बनाता है।",
        "अंत तक आप ख़ुद NAND से NOT, AND और OR खोल पाएँगे, किसी भी function के लिए Shannon की expansion F = x'.F0 + x.F1 लिख पाएँगे, उसके cofactors F0 और F1 निकाल पाएँगे, और उस expansion को एक 2-to-1 MUX पर wire कर पाएँगे - फिर MUXes को एक tree में जोड़कर सचमुच कोई भी logic बना पाएँगे।"
      ],
      transcriptEN:
        "Welcome to Universal Logic and Shannon's expansion. Here is the big surprise: you do not need a drawer of different gates to build a computer. One gate type is enough. Picture a Swiss Army knife - one body that folds out into a blade, scissors and a screwdriver. The NAND gate is that knife for logic: copies of NAND fold out into NOT, AND, OR and XOR, so NAND alone can build any function. We call that universal, or functionally complete. The second hero is Shannon's expansion. Picture a traffic intersection with one light: if the light reads zero you take the left road, if one you take the right. That is F equals x-prime times F-zero plus x times F-one, and that is exactly a two-to-one multiplexer, where x is the select and the two roads are the data inputs. So the MUX is universal too. Chip factories love one repeated pattern, so a fabric of a single gate is cheaper, smaller and simpler. By the end you will fold NOT, AND and OR out of NAND, write Shannon's expansion for any function, and wire it onto a tree of MUXes that can build literally anything.",
      transcriptHI:
        "Universal Logic और Shannon की expansion में आपका स्वागत है। बड़ी हैरानी यह है: computer बनाने के लिए आपको अलग-अलग gates का दराज़ नहीं चाहिए। एक gate type काफ़ी है। एक Swiss Army knife सोचिए - एक body जो एक blade, scissors और एक screwdriver में खुल जाती है। NAND gate logic के लिए वही knife है: NAND की copies NOT, AND, OR और XOR में खुल जाती हैं, तो अकेला NAND कोई भी function बना सकता है। हम इसे universal, या functionally complete, कहते हैं। दूसरा नायक है Shannon की expansion। एक traffic light वाला traffic intersection सोचिए: अगर light zero पढ़े तो बाईं सड़क, एक पढ़े तो दाईं। यह है F बराबर x-prime गुना F-zero plus x गुना F-one, और यही ठीक एक two-to-one multiplexer है, जहाँ x select है और दोनों सड़कें data inputs हैं। तो MUX भी universal है। Chip factories एक दोहराए pattern को पसंद करती हैं, तो एक ही gate का fabric सस्ता, छोटा और सरल पड़ता है। अंत तक आप NAND से NOT, AND और OR खोलेंगे, किसी भी function के लिए Shannon की expansion लिखेंगे, और उसे MUXes के एक tree पर wire करेंगे जो सचमुच कुछ भी बना सके।",
      visualNote:
        'Hero: a Swiss Army knife whose folded-out tools are labelled NOT, AND, OR, XOR; beside it a road fork with a traffic light (x) routing to roads F0 and F1, captioned F = x\'.F0 + x.F1.'
    },
    {
      id: 'S01_Video',
      label: 'Universal Logic & Shannon',
      kind: 'video',
      subtitle: 'A short film: one gate that builds everything, and one theorem that turns logic into MUXes.',
      theoryEN: [
        "Before you watch, fix the two analogies in your head. The NAND gate is the Swiss Army knife: a single gate-type that, copied and wired, folds out into every other gate. The Shannon expansion is the traffic intersection: looking at one variable x it routes a whole function down one of two roads, which is a 2-to-1 MUX.",
        "A NAND gate computes NAND(A,B) = (A.B)' - it ANDs its two inputs and then inverts, where the apostrophe means NOT, the dot means AND, and a plus will mean OR. Because that little bubble at the output is built in, NAND already contains an inversion, and inversion is the seed of every other gate.",
        "Watch for the three foldouts in the film. NOT is one NAND with both inputs tied together. AND is a NAND followed by a second NAND wired as an inverter. OR uses DeMorgan: invert both inputs first, then NAND them, because (A'.B')' = A + B. That is one, two and three NAND gates respectively.",
        "Then the film pivots to Shannon. It takes a function, forces one variable x to 0 to get the cofactor F0, forces it to 1 to get F1, and recombines them as F = x'.F0 + x.F1. Line that up against the 2-to-1 MUX equation Y = S'.I0 + S.I1 and they are letter-for-letter the same circuit.",
        "Keep one running example in mind: XOR. We will expand A XOR B about A and find F0 = B and F1 = B', so A XOR B is just a 2-to-1 MUX with select A, data B and B'. That single example shows how Shannon turns the whole job of logic design into choosing what to route through a MUX."
      ],
      theoryHI: [
        "देखने से पहले, दोनों analogies मन में बिठा लीजिए। NAND gate Swiss Army knife है: एक अकेला gate-type जो, copy और wire करने पर, हर दूसरे gate में खुल जाता है। Shannon expansion traffic intersection है: एक variable x को देखकर यह एक पूरे function को दो सड़कों में से एक पर route करता है, जो एक 2-to-1 MUX है।",
        "एक NAND gate NAND(A,B) = (A.B)' निकालता है - यह अपने दो inputs को AND करता है फिर invert करता है, जहाँ apostrophe का मतलब NOT, dot का मतलब AND, और plus का मतलब OR होगा। चूँकि output पर वह छोटा सा bubble built-in है, NAND में पहले से एक inversion है, और inversion ही हर दूसरे gate का बीज है।",
        "film में तीन foldouts पर ध्यान दीजिए। NOT एक NAND है जिसके दोनों inputs जोड़ दिए जाएँ। AND एक NAND है जिसके बाद दूसरा NAND inverter की तरह wire हो। OR DeMorgan इस्तेमाल करता है: पहले दोनों inputs को invert कीजिए, फिर उन्हें NAND कीजिए, क्योंकि (A'.B')' = A + B। यानी क्रमशः एक, दो और तीन NAND gates।",
        "फिर film Shannon की ओर मुड़ती है। यह एक function लेती है, एक variable x को 0 पर मजबूर करके cofactor F0 पाती है, 1 पर मजबूर करके F1 पाती है, और उन्हें F = x'.F0 + x.F1 के रूप में फिर जोड़ देती है। इसे 2-to-1 MUX के समीकरण Y = S'.I0 + S.I1 के सामने रखिए और वे अक्षर-दर-अक्षर वही circuit हैं।",
        "एक उदाहरण मन में रखिए: XOR। हम A XOR B को A के बारे में expand करेंगे और पाएँगे F0 = B और F1 = B', तो A XOR B बस एक 2-to-1 MUX है जिसका select A और data B और B' है। वह अकेला उदाहरण दिखाता है कि Shannon logic design के पूरे काम को 'MUX से क्या route करना है' चुनने में कैसे बदल देता है।"
      ],
      transcriptEN:
        "Here is the whole story in one breath. A NAND gate computes A-and-B, then inverts. That built-in inversion is the seed of everything. Tie both inputs of one NAND together and you get NOT. Follow a NAND with a second NAND wired as an inverter and you get AND, two gates. Invert both inputs first, then NAND them, and DeMorgan gives you OR, three gates. So NAND alone builds NOT, AND and OR, which is a complete set - NAND is universal. Now Shannon. Take any function, set one variable x to zero to get the cofactor F-zero, set it to one to get F-one, and recombine: F equals x-prime F-zero plus x F-one. That is exactly a two-to-one MUX: x is the select, F-zero and F-one are the data inputs. Worked example: expand A-XOR-B about A. F-zero is B, F-one is B-prime, so XOR is one MUX selected by A. Recurse on the cofactors and a tree of MUXes builds any function at all.",
      transcriptHI:
        "पूरी कहानी एक साँस में। एक NAND gate A-and-B निकालता है, फिर invert करता है। वही built-in inversion सबका बीज है। एक NAND के दोनों inputs जोड़ दीजिए और आपको NOT मिलता है। एक NAND के बाद दूसरा NAND inverter की तरह लगाइए और आपको AND मिलता है, दो gates। पहले दोनों inputs invert कीजिए, फिर NAND कीजिए, और DeMorgan आपको OR देता है, तीन gates। तो अकेला NAND, NOT, AND और OR बनाता है, जो एक complete set है - NAND universal है। अब Shannon। कोई भी function लीजिए, एक variable x को zero कीजिए ताकि cofactor F-zero मिले, उसे one कीजिए ताकि F-one मिले, और फिर जोड़िए: F बराबर x-prime F-zero plus x F-one। यही ठीक एक two-to-one MUX है: x select है, F-zero और F-one data inputs हैं। उदाहरण: A-XOR-B को A के बारे में expand कीजिए। F-zero है B, F-one है B-prime, तो XOR एक MUX है जिसका select A है। cofactors पर recurse कीजिए और MUXes का एक tree कोई भी function बना देता है।",
      visualNote:
        'Animated explainer: a NAND symbol folding out into NOT/AND/OR wirings, then a function splitting at a traffic light x into roads F0 and F1 that merge in a 2-to-1 MUX whose output is F.'
    },
    {
      id: 'S02_Universal',
      label: 'What Universal Means',
      kind: 'theory',
      subtitle: 'A functionally complete gate can build every Boolean function with no other gate type.',
      theoryEN: [
        "A gate is called UNIVERSAL, or functionally complete, when copies of just that one gate, wired together, can build ANY Boolean function with no other gate type needed at all. This is the campsite test for our Swiss Army knife: if the knife alone can handle every job, you can leave every other tool at home.",
        "The two classic universal gates are NAND and NOR. NAND computes NAND(A,B) = (A.B)', meaning 'AND then invert', and NOR computes NOR(A,B) = (A+B)', meaning 'OR then invert'. Each one, all by itself, is enough to build NOT, AND, OR, XOR and everything beyond, which is what makes it universal.",
        "The reason a single universal gate matters so much is manufacturing. A chip fabrication plant would rather stamp out ONE repeated transistor pattern millions of times than juggle a dozen different gate designs. Building everything from one cell drastically simplifies the process, lowers the total transistor count and shrinks the standard-cell library the designer has to verify.",
        "There is a bonus in CMOS, the silicon technology behind almost every chip. NAND and NOR are naturally inverting gates, so they fall out of CMOS with the fewest transistors. A plain AND or OR is actually a NAND or NOR followed by an extra inverter, so the universal gates are literally cheaper in silicon than the gates they replace.",
        "So 'universal' is not a vague compliment - it is a precise, provable property. In the next pages we will actually fold NOT, AND and OR out of NAND, gate by gate, and watch a live panel verify that every truth-table row matches, so you can trust the Swiss-army claim instead of taking it on faith."
      ],
      theoryHI: [
        "एक gate को UNIVERSAL, या functionally complete, तब कहते हैं जब सिर्फ़ उसी एक gate की copies, आपस में wire करके, किसी भी Boolean function को बना सकें और किसी दूसरे gate type की ज़रूरत बिलकुल न हो। यह हमारे Swiss Army knife की campsite-कसौटी है: अगर अकेला knife हर काम संभाल ले, तो आप हर दूसरा tool घर छोड़ सकते हैं।",
        "दो classic universal gates हैं NAND और NOR। NAND निकालता है NAND(A,B) = (A.B)', यानी 'AND फिर invert', और NOR निकालता है NOR(A,B) = (A+B)', यानी 'OR फिर invert'। हर एक, अकेले ही, NOT, AND, OR, XOR और उससे आगे सब कुछ बनाने के लिए काफ़ी है, और यही उसे universal बनाता है।",
        "एक अकेला universal gate इतना मायने क्यों रखता है, इसका कारण manufacturing है। एक chip fabrication plant एक ही दोहराए transistor pattern को लाखों बार ठप्पा लगाना पसंद करेगा, बजाय एक दर्जन अलग gate designs को संभालने के। एक ही cell से सब कुछ बनाना process को बहुत सरल कर देता है, कुल transistor count घटाता है और designer को जाँचने वाली standard-cell library छोटी कर देता है।",
        "CMOS में एक bonus है, वह silicon technology जो लगभग हर chip के पीछे है। NAND और NOR स्वभाव से inverting gates हैं, तो वे CMOS से सबसे कम transistors में निकलते हैं। एक सादा AND या OR असल में एक NAND या NOR के बाद एक अतिरिक्त inverter है, तो universal gates उन gates से silicon में सचमुच सस्ते हैं जिन्हें वे बदलते हैं।",
        "तो 'universal' कोई धुँधली तारीफ़ नहीं है - यह एक सटीक, साबित होने वाला गुण है। अगले pages में हम सचमुच NAND से NOT, AND और OR को gate-दर-gate खोलेंगे, और एक live panel को हर truth-table row का मिलान जाँचते देखेंगे, ताकि आप Swiss-army दावे पर भरोसा कर सकें, उसे आँख मूँदकर मानने के बजाय।"
      ],
      transcriptEN:
        "What does universal mean? A gate is universal, or functionally complete, when copies of just that one gate, wired together, can build any Boolean function with no other gate type at all. It is the campsite test for the Swiss Army knife: if one tool does every job, leave the rest at home. The two classic universal gates are NAND and NOR. NAND is A-and-B inverted; NOR is A-or-B inverted. Each one alone builds NOT, AND, OR and XOR. Why does this matter? Chip factories would rather repeat one transistor pattern than juggle a dozen designs. One cell means fewer transistors, simpler manufacturing and a smaller cell library. And in CMOS there is a bonus: NAND and NOR are naturally inverting, so they are cheaper in silicon than buffered AND and OR. Universal is a precise, provable property, and next we will fold NOT, AND and OR out of NAND and verify every row.",
      transcriptHI:
        "Universal का मतलब क्या है? एक gate universal, या functionally complete, तब है जब सिर्फ़ उसी एक gate की copies, आपस में wire करके, किसी भी Boolean function को बना सकें और कोई दूसरा gate type बिलकुल न चाहिए। यह Swiss Army knife की campsite-कसौटी है: अगर एक tool हर काम करे, बाक़ी घर छोड़ दीजिए। दो classic universal gates NAND और NOR हैं। NAND है A-and-B inverted; NOR है A-or-B inverted। हर एक अकेला NOT, AND, OR और XOR बनाता है। यह क्यों मायने रखता है? Chip factories एक transistor pattern दोहराना पसंद करती हैं, बजाय एक दर्जन designs संभालने के। एक cell का मतलब कम transistors, सरल manufacturing और छोटी cell library। और CMOS में एक bonus: NAND और NOR स्वभाव से inverting हैं, तो वे silicon में buffered AND और OR से सस्ते हैं। Universal एक सटीक, साबित गुण है, और आगे हम NAND से NOT, AND और OR खोलकर हर row जाँचेंगे।",
      visualNote:
        'Two captioned gate symbols: a NAND (AND shape + bubble) and a NOR (OR shape + bubble), each tagged "Universal", with a NOT/AND/OR/XOR icon fanning out from the NAND.'
    },
    {
      id: 'S03_NandFoldout',
      label: 'Folding NOT, AND, OR Out Of NAND',
      kind: 'theory',
      subtitle: "NOT = 1 NAND, AND = 2 NANDs, OR = 3 NANDs - the knife unfolds.",
      theoryEN: [
        "Now we actually unfold the Swiss Army knife, one blade at a time, and watch the gate count grow from one to three. Each construction uses nothing but NAND gates, and every output below is computed live so you can check it against a standard gate.",
        "The first blade is NOT. Take a single NAND and tie BOTH of its inputs to the same signal A. Then NAND(A,A) = (A.A)' = A', because ANDing a value with itself just gives the value back (A.A = A), and the built-in bubble inverts it. So one shorted NAND is an inverter - the simplest blade, costing exactly 1 gate.",
        "The second blade is AND. A NAND already computes (A.B)', which is AND with an extra inversion, so to get plain AND we just undo that inversion. Stage one: NAND(A,B) gives (A.B)'. Stage two: feed that into a second NAND wired as a NOT (inputs shorted). The two inversions cancel - ((A.B)')' = A.B - so AND costs 2 NAND gates.",
        "The third blade is OR, and it leans on DeMorgan's theorem, which says (A'.B')' = A + B. In words: if you invert both inputs before ANDing-and-inverting, the logic flips from AND into OR. Stage one and two: two shorted NANDs make A' and B'. Stage three: NAND(A',B') = (A'.B')' = A + B. So OR costs 3 NAND gates.",
        "Step back and the pattern is tidy: NOT is one gate, AND is two, OR is three, and from {NOT, AND, OR} - a known complete set - you can already reach XOR, adders, multiplexers, anything. The live panel below lets you toggle a and b and confirm each NAND-built gate matches its standard-gate twin, row for row."
      ],
      theoryHI: [
        "अब हम सचमुच Swiss Army knife को खोलते हैं, एक बार में एक blade, और देखते हैं gate count एक से तीन तक बढ़ती है। हर construction सिर्फ़ NAND gates इस्तेमाल करती है, और नीचे हर output live गिना जाता है ताकि आप उसे एक standard gate के सामने जाँच सकें।",
        "पहला blade NOT है। एक अकेला NAND लीजिए और उसके दोनों inputs को एक ही signal A से जोड़ दीजिए। तब NAND(A,A) = (A.A)' = A', क्योंकि किसी मान को ख़ुद से AND करने पर वही मान वापस मिलता है (A.A = A), और built-in bubble उसे invert कर देता है। तो एक shorted NAND एक inverter है - सबसे सरल blade, ठीक 1 gate की क़ीमत।",
        "दूसरा blade AND है। एक NAND पहले से (A.B)' निकालता है, जो एक अतिरिक्त inversion के साथ AND है, तो सादा AND पाने के लिए हम बस वह inversion वापस हटा देते हैं। पहला चरण: NAND(A,B) देता है (A.B)'। दूसरा चरण: उसे एक दूसरे NAND में डालिए जो NOT की तरह wire हो (inputs जुड़े)। दोनों inversions cancel हो जाती हैं - ((A.B)')' = A.B - तो AND की क़ीमत 2 NAND gates है।",
        "तीसरा blade OR है, और यह DeMorgan के theorem पर टिकता है, जो कहता है (A'.B')' = A + B। शब्दों में: अगर आप AND-और-invert करने से पहले दोनों inputs को invert कर दें, तो logic AND से OR में पलट जाता है। पहला और दूसरा चरण: दो shorted NANDs A' और B' बनाते हैं। तीसरा चरण: NAND(A',B') = (A'.B')' = A + B। तो OR की क़ीमत 3 NAND gates है।",
        "पीछे हटिए और pattern सुथरा है: NOT एक gate, AND दो, OR तीन, और {NOT, AND, OR} - एक जाना-माना complete set - से आप पहले ही XOR, adders, multiplexers, कुछ भी पहुँच सकते हैं। नीचे का live panel आपको a और b toggle करने देता है और पुष्टि करता है कि हर NAND-बना gate अपने standard-gate जुड़वाँ से row-दर-row मिलता है।"
      ],
      transcriptEN:
        "Let us unfold the knife one blade at a time. Blade one, NOT: take one NAND and tie both inputs to the same signal A. NAND of A with A is A-and-A inverted, and A-and-A is just A, so the output is A-prime. One shorted NAND is an inverter, one gate. Blade two, AND: a NAND already gives A-and-B inverted, so just undo the inversion. First NAND gives the inverted AND, then a second NAND wired as a NOT flips it back to A-and-B. Two gates. Blade three, OR: use DeMorgan, which says A-prime-and-B-prime, inverted, equals A-or-B. So invert both inputs with two shorted NANDs to get A-prime and B-prime, then NAND them. Three gates. Now from NOT, AND and OR you can reach XOR, adders, anything. The live panel lets you toggle a and b and confirm every NAND-built gate matches its standard twin.",
      transcriptHI:
        "चलिए knife को एक बार में एक blade खोलें। blade एक, NOT: एक NAND लीजिए और दोनों inputs को एक ही signal A से जोड़िए। A का A के साथ NAND है A-and-A inverted, और A-and-A बस A है, तो output है A-prime। एक shorted NAND एक inverter है, एक gate। blade दो, AND: एक NAND पहले से A-and-B inverted देता है, तो बस inversion वापस हटाइए। पहला NAND inverted AND देता है, फिर एक दूसरा NAND NOT की तरह उसे A-and-B में वापस पलट देता है। दो gates। blade तीन, OR: DeMorgan इस्तेमाल कीजिए, जो कहता है A-prime-and-B-prime, inverted, बराबर A-or-B। तो दो shorted NANDs से दोनों inputs invert करके A-prime और B-prime पाइए, फिर उन्हें NAND कीजिए। तीन gates। अब NOT, AND और OR से आप XOR, adders, कुछ भी पहुँच सकते हैं। live panel आपको a और b toggle करने देता है और पुष्टि करता है हर NAND-बना gate अपने standard जुड़वाँ से मिलता है।",
      visualNote:
        'NandUniversal block: toggle a and b; three rows NOT a / a AND b / a OR b each showing its NAND-only build, the live value and a green check vs the standard gate.'
    },
    {
      id: 'S04_GateLevel',
      label: 'The Gate-Level Build',
      kind: 'theory',
      subtitle: "Draw the wires: OR = NAND(A',B') with two inverters - DeMorgan in silicon.",
      theoryEN: [
        "Folding the knife out is one thing; drawing the actual wires is another, and a hardware engineer must be able to do both. On this page we draw the gate-level build of the OR-from-NAND construction, because it is the richest of the three - it shows DeMorgan turning AND-logic into OR-logic right on the schematic.",
        "Recall the identity we are building: OR(A,B) = (A'.B')'. Read it from the inside out. First invert A to get A' and invert B to get B'. Then AND those two inverted signals and invert the result. That final 'AND then invert' is exactly one NAND, and the two inversions in front are two more NANDs with their inputs shorted - three NANDs in total.",
        "The picture below shows it computing live. Two NAND-inverters produce ia = A' and ib = B'. Those feed a third NAND whose output is Y = (A'.B')' = A + B. Because each input arrives already inverted, this third gate is often drawn as a NAND with two little bubbles on its input wires, which is the standard 'bubbled-input NAND = OR' symbol you will see on real schematics.",
        "It pays to read the same construction through DeMorgan, because that is the law making it work: (A'.B')' = A + B says that inverting the inputs flips an AND into an OR. So a NAND, which is an AND with an output bubble, becomes an OR the moment you also bubble its inputs. The bubbles 'slide' from output to inputs and the gate changes personality.",
        "Toggle A and B in the live gates below and watch the chain compute. When either input is 1, its inverter drops to 0, the final NAND sees at least one 0 on its inputs, and its output goes high - exactly OR behaviour. This is the gate-level proof that the Swiss-army claim is real silicon, not just algebra."
      ],
      theoryHI: [
        "knife को खोलना एक बात है; असली wires बनाना दूसरी, और एक hardware engineer को दोनों आने चाहिए। इस page पर हम OR-from-NAND construction का gate-level circuit बनाते हैं, क्योंकि यह तीनों में सबसे समृद्ध है - यह DeMorgan को AND-logic से OR-logic में बदलते हुए ठीक schematic पर दिखाता है।",
        "जो identity हम बना रहे हैं उसे याद कीजिए: OR(A,B) = (A'.B')'। इसे अंदर से बाहर पढ़िए। पहले A को invert करके A' पाइए और B को invert करके B' पाइए। फिर उन दो inverted signals को AND कीजिए और नतीजे को invert कीजिए। वह आख़िरी 'AND फिर invert' ठीक एक NAND है, और आगे की दो inversions दो और NANDs हैं जिनके inputs जुड़े हैं - कुल तीन NANDs।",
        "नीचे की तस्वीर इसे live गिनते दिखाती है। दो NAND-inverters बनाते हैं ia = A' और ib = B'। वे एक तीसरे NAND को feed करते हैं जिसका output है Y = (A'.B')' = A + B। चूँकि हर input पहले से inverted आता है, यह तीसरा gate अक्सर एक NAND के रूप में बनाया जाता है जिसके input wires पर दो छोटे bubbles हों, जो standard 'bubbled-input NAND = OR' चिह्न है जिसे आप असली schematics पर देखेंगे।",
        "उसी construction को DeMorgan से पढ़ना फ़ायदेमंद है, क्योंकि वही नियम इसे काम करवाता है: (A'.B')' = A + B कहता है कि inputs को invert करना एक AND को OR में पलट देता है। तो एक NAND, जो output bubble वाला AND है, OR बन जाता है जैसे ही आप उसके inputs को भी bubble कर दें। bubbles output से inputs की ओर 'सरक' जाते हैं और gate का स्वभाव बदल जाता है।",
        "नीचे live gates में A और B toggle कीजिए और chain को गिनते देखिए। जब कोई भी input 1 हो, उसका inverter 0 पर गिरता है, आख़िरी NAND अपने inputs पर कम से कम एक 0 देखता है, और उसका output high हो जाता है - ठीक OR व्यवहार। यही gate-level सबूत है कि Swiss-army दावा असली silicon है, सिर्फ़ algebra नहीं।"
      ],
      transcriptEN:
        "Folding the knife out is one thing; drawing the wires is another. Let us draw OR from NAND, the richest of the three. The identity is OR equals A-prime-and-B-prime, all inverted. Read it inside out: invert A to get A-prime, invert B to get B-prime, then AND them and invert - which is one NAND. The two inversions in front are two shorted NANDs, so three NANDs total. Two inverters produce A-prime and B-prime, and a third NAND outputs A-or-B. Because the inputs arrive inverted, that third gate is drawn as a NAND with bubbles on its inputs, the standard bubbled-input NAND equals OR symbol. DeMorgan is the law: A-prime-and-B-prime inverted equals A-or-B, so bubbling the inputs of a NAND flips it from AND to OR. The bubbles slide from output to inputs and the gate changes personality. Toggle A and B and watch the chain go high whenever either input is one - exactly OR.",
      transcriptHI:
        "knife खोलना एक बात है; wires बनाना दूसरी। चलिए NAND से OR बनाएँ, तीनों में सबसे समृद्ध। identity है OR बराबर A-prime-and-B-prime, सब inverted। अंदर से बाहर पढ़िए: A invert करके A-prime, B invert करके B-prime, फिर उन्हें AND करके invert - जो एक NAND है। आगे की दो inversions दो shorted NANDs हैं, तो कुल तीन NANDs। दो inverters A-prime और B-prime बनाते हैं, और एक तीसरा NAND A-or-B देता है। चूँकि inputs inverted आते हैं, वह तीसरा gate एक NAND के रूप में बनता है जिसके inputs पर bubbles हों, standard bubbled-input NAND बराबर OR चिह्न। DeMorgan नियम है: A-prime-and-B-prime inverted बराबर A-or-B, तो एक NAND के inputs bubble करना उसे AND से OR में पलट देता है। bubbles output से inputs की ओर सरकते हैं और gate स्वभाव बदलता है। A और B toggle कीजिए और देखिए chain तब high होता है जब कोई भी input one हो - ठीक OR।",
      visualNote:
        'Live gates: NOT A -> A\', NOT B -> B\', feeding an OR-shaped LiveGate that shows Y = A + B; a callout reads (A\'.B\')\' = A + B (DeMorgan).'
    },
    {
      id: 'S05_NorDual',
      label: 'NOR Is Universal Too',
      kind: 'theory',
      subtitle: 'The second blade: by duality NOR builds NOT (1), OR (2) and AND (3).',
      theoryEN: [
        "The Swiss Army knife comes in two models, and NOR is the second blade. Everything that worked for NAND works for NOR by duality - a simple swap of AND for OR and 0 for 1 throughout. So if NAND is universal, NOR must be universal too, and the constructions are mirror images.",
        "NOR computes NOR(A,B) = (A+B)', meaning 'OR then invert'. The NOT blade is the same trick as before: tie both inputs together, and NOR(A,A) = (A+A)' = A', because ORing a value with itself just gives the value back (A+A = A) and the bubble inverts it. One shorted NOR is an inverter, costing 1 gate.",
        "The OR blade is now the cheap one. A NOR already gives (A+B)', which is OR with an extra inversion, so follow it with a NOR-inverter to cancel that inversion: ((A+B)')' = A+B. That is 2 NOR gates for an OR, the dual of how AND cost 2 NANDs.",
        "The AND blade uses DeMorgan again, in its dual form (A'+B')' = A.B. Invert both inputs first with two shorted NORs to get A' and B', then NOR them: NOR(A',B') = (A'+B')' = A.B. So AND costs 3 NOR gates, mirroring how OR cost 3 NANDs.",
        "Line up the two columns and the symmetry is perfect. With NAND the cheap blade is NOT then AND then OR (1, 2, 3); with NOR it is NOT then OR then AND (1, 2, 3) - the AND and OR simply swap places. From either complete set you can reach XOR, multiplexers and full adders, so a chip fabric made entirely of NOR gates, or entirely of NAND gates, can build a whole CPU."
      ],
      theoryHI: [
        "Swiss Army knife दो models में आता है, और NOR दूसरा blade है। जो कुछ NAND के लिए काम करता था वह NOR के लिए duality से काम करता है - हर जगह AND की जगह OR और 0 की जगह 1 का सीधा बदलाव। तो अगर NAND universal है, NOR भी universal होगा, और constructions आईने की छवियाँ हैं।",
        "NOR निकालता है NOR(A,B) = (A+B)', यानी 'OR फिर invert'। NOT blade वही पहले वाली चाल है: दोनों inputs जोड़ दीजिए, और NOR(A,A) = (A+A)' = A', क्योंकि किसी मान को ख़ुद से OR करने पर वही मान वापस मिलता है (A+A = A) और bubble उसे invert करता है। एक shorted NOR एक inverter है, क़ीमत 1 gate।",
        "OR blade अब सस्ता है। एक NOR पहले से (A+B)' देता है, जो एक अतिरिक्त inversion के साथ OR है, तो उसके बाद एक NOR-inverter लगाइए जो वह inversion cancel करे: ((A+B)')' = A+B। यानी एक OR के लिए 2 NOR gates, ठीक उसी तरह जैसे AND की क़ीमत 2 NANDs थी, का dual।",
        "AND blade फिर DeMorgan इस्तेमाल करता है, उसके dual रूप में (A'+B')' = A.B। पहले दो shorted NORs से दोनों inputs invert करके A' और B' पाइए, फिर उन्हें NOR कीजिए: NOR(A',B') = (A'+B')' = A.B। तो AND की क़ीमत 3 NOR gates है, ठीक उसी तरह जैसे OR की क़ीमत 3 NANDs थी।",
        "दोनों columns को सामने रखिए और symmetry सटीक है। NAND के साथ सस्ता blade NOT फिर AND फिर OR है (1, 2, 3); NOR के साथ यह NOT फिर OR फिर AND है (1, 2, 3) - AND और OR बस जगह बदल लेते हैं। किसी भी complete set से आप XOR, multiplexers और full adders पहुँच सकते हैं, तो पूरी तरह NOR gates से बना, या पूरी तरह NAND gates से बना, एक chip fabric एक पूरा CPU बना सकता है।"
      ],
      transcriptEN:
        "NOR is the second blade of the knife. Everything that worked for NAND works for NOR by duality - swap AND for OR and zero for one. NOR is A-or-B inverted. NOT is the same trick: tie both inputs together, NOR of A with A is A-or-A inverted, which is A-prime. One gate. Now OR is the cheap one: a NOR already gives the inverted OR, so a second NOR wired as an inverter flips it back to A-or-B. Two gates. AND uses DeMorgan in its dual form: A-prime-or-B-prime inverted equals A-and-B. Invert both inputs with two shorted NORs, then NOR them. Three gates. So with NAND the order is NOT, AND, OR; with NOR it is NOT, OR, AND - the AND and OR swap places. From either complete set you reach XOR, multiplexers and full adders, so a chip made entirely of NOR, or entirely of NAND, can build a whole CPU.",
      transcriptHI:
        "NOR knife का दूसरा blade है। जो NAND के लिए काम करता था वह NOR के लिए duality से काम करता है - AND की जगह OR और zero की जगह one। NOR है A-or-B inverted। NOT वही चाल है: दोनों inputs जोड़िए, A का A के साथ NOR है A-or-A inverted, जो A-prime है। एक gate। अब OR सस्ता है: एक NOR पहले से inverted OR देता है, तो एक दूसरा NOR inverter की तरह उसे A-or-B में वापस पलटता है। दो gates। AND DeMorgan के dual रूप का इस्तेमाल करता है: A-prime-or-B-prime inverted बराबर A-and-B। दो shorted NORs से दोनों inputs invert कीजिए, फिर NOR कीजिए। तीन gates। तो NAND के साथ क्रम NOT, AND, OR है; NOR के साथ NOT, OR, AND - AND और OR जगह बदलते हैं। किसी भी complete set से आप XOR, multiplexers और full adders पहुँचते हैं, तो पूरी तरह NOR, या पूरी तरह NAND, से बना chip एक पूरा CPU बना सकता है।",
      visualNote:
        'Mirror of the NAND panel with NOR gates: NOR-as-inverter (1), NOR -> NOR for OR (2), and inverted-input NOR -> AND (3), tagged with the dual DeMorgan (A\'+B\')\' = A.B.'
    },
    {
      id: 'S06_Shannon',
      label: "Shannon's Expansion: IF-THEN-ELSE",
      kind: 'theory',
      subtitle: "F = x'.F0 + x.F1 - the hidden traffic intersection inside every function.",
      theoryEN: [
        "Now the second hero, and the second analogy. Shannon's expansion theorem (first written by Boole in 1854, often credited to Shannon) takes ANY Boolean function of N variables, isolates just ONE variable x, and exposes a hidden IF-THEN-ELSE structure that was inside the function all along. That structure is our traffic intersection.",
        "Read the theorem as a decision at a fork in the road: IF x = 0 THEN evaluate F with x set to 0, ELSE (x = 1) evaluate F with x set to 1. The traffic light is the single variable x; the two roads waiting beyond the fork are the two simplified versions of the function.",
        "In standard sum-of-products form the theorem is F = x'.F0 + x.F1. Here F0 is 'F with x forced to 0' and F1 is 'F with x forced to 1'. When x = 0 the x' term switches on and routes you to F0; when x = 1 the x term switches on and routes you to F1. The algebra is doing exactly what the intersection does.",
        "F0 and F1 have a name: they are the COFACTORS of F with respect to x. The key point is that each cofactor is a function of the REMAINING variables only - x has been removed from it, because we already decided x's value at the fork. The two roads are simpler than the junction you came from.",
        "There is also a dual, product-of-sums form: F = (x' + F1).(x + F0). It describes the very same decomposition from the OR-of-ANDs side instead of the AND-of-ORs side, and it is handy when you would rather build the circuit out of OR gates. Both forms reconstruct the original function exactly - we will prove that on the next page."
      ],
      theoryHI: [
        "अब दूसरा नायक, और दूसरी analogy। Shannon की expansion theorem (पहली बार 1854 में Boole ने लिखी, अक्सर Shannon को श्रेय) किसी भी N variables के Boolean function को लेती है, सिर्फ़ एक variable x को अलग करती है, और एक छिपी IF-THEN-ELSE संरचना उजागर करती है जो function के अंदर हमेशा से थी। वही संरचना हमारा traffic intersection है।",
        "theorem को सड़क के fork पर एक फ़ैसले की तरह पढ़िए: IF x = 0 THEN F को x = 0 के साथ हल करो, ELSE (x = 1) F को x = 1 के साथ हल करो। traffic light अकेला variable x है; fork के पार इंतज़ार करती दो सड़कें function के दो सरल किए रूप हैं।",
        "standard sum-of-products रूप में theorem है F = x'.F0 + x.F1। यहाँ F0 है 'F जिसमें x को 0 पर मजबूर किया' और F1 है 'F जिसमें x को 1 पर मजबूर किया'। जब x = 0 हो तो x' term चालू हो जाता है और आपको F0 की ओर route करता है; जब x = 1 हो तो x term चालू होकर आपको F1 की ओर route करता है। algebra ठीक वही कर रहा है जो intersection करता है।",
        "F0 और F1 का एक नाम है: ये x के सापेक्ष F के COFACTORS हैं। अहम बात यह है कि हर cofactor सिर्फ़ बचे हुए variables का function है - उसमें से x हटा दिया गया है, क्योंकि हम fork पर x का मान पहले ही तय कर चुके। दोनों सड़कें उस junction से सरल हैं जहाँ से आप आए।",
        "एक dual, product-of-sums रूप भी है: F = (x' + F1).(x + F0)। यह वही decomposition AND-of-ORs पक्ष के बजाय OR-of-ANDs पक्ष से बताता है, और तब काम आता है जब आप circuit को OR gates से बनाना चाहें। दोनों रूप मूल function को ठीक-ठीक फिर बना देते हैं - यह हम अगले page पर साबित करेंगे।"
      ],
      transcriptEN:
        "Now the second hero. Shannon's expansion takes any function of N variables, isolates one variable x, and reveals a hidden if-then-else that was inside it all along. Read it as a fork in the road: if x is zero, evaluate F with x equal to zero; else evaluate F with x equal to one. The traffic light is x, and the two roads are the two simplified functions. In standard form it is F equals x-prime times F-zero plus x times F-one, where F-zero is F with x forced to zero and F-one is F with x forced to one. When x is zero the x-prime term routes you to F-zero; when x is one the x term routes you to F-one. F-zero and F-one are called cofactors, and each is a function of the remaining variables only, because x has already been decided at the fork. There is a dual product-of-sums form too: F equals x-prime-or-F-one, times x-or-F-zero. Both reconstruct the original function exactly.",
      transcriptHI:
        "अब दूसरा नायक। Shannon की expansion किसी भी N variables के function को लेती है, एक variable x को अलग करती है, और एक छिपा if-then-else उजागर करती है जो उसके अंदर हमेशा से था। इसे सड़क के fork की तरह पढ़िए: अगर x zero है, F को x बराबर zero के साथ हल करो; वरना F को x बराबर one के साथ हल करो। traffic light x है, और दोनों सड़कें दो सरल functions हैं। standard रूप में यह है F बराबर x-prime गुना F-zero plus x गुना F-one, जहाँ F-zero है F जिसमें x को zero पर मजबूर किया और F-one है F जिसमें x को one पर मजबूर किया। जब x zero है x-prime term आपको F-zero पर route करता है; जब x one है x term आपको F-one पर route करता है। F-zero और F-one cofactors कहलाते हैं, और हर एक सिर्फ़ बचे variables का function है, क्योंकि x fork पर पहले ही तय हो चुका। एक dual product-of-sums रूप भी है: F बराबर x-prime-or-F-one, गुना x-or-F-zero। दोनों मूल function को ठीक फिर बना देते हैं।",
      visualNote:
        'A decision tree: root box "Evaluate F on x" branching left "x=0 -> F0" and right "x=1 -> F1", drawn over a road fork with a traffic light x.'
    },
    {
      id: 'S07_Derivation',
      label: 'Worked Derivation & Proof',
      kind: 'theory',
      subtitle: "Expand a majority function on w1, and prove F = x'.F0 + x.F1 by cases.",
      theoryEN: [
        "Let us make Shannon concrete with a worked example and then prove the theorem outright. The step-through below does both, computing every cofactor in code so nothing is taken on trust. Our example function is a 3-input majority-style function F = w1.w2 + w1.w3 + w2.w3, and we will expand it about w1.",
        "Forcing w1 = 0 gives the negative cofactor F0. Every term that contained w1 collapses to 0, leaving only the w2.w3 term, so F0 = w2.w3. This is the 'left road' you take when the w1 traffic light reads 0.",
        "Forcing w1 = 1 gives the positive cofactor F1. The terms w1.w2 and w1.w3 become plain w2 and w3, and using absorption (w2 + w3 + w2.w3 = w2 + w3, because the extra product is already covered) we get F1 = w2 + w3. This is the 'right road' for w1 = 1.",
        "Recombine with Shannon: F = w1'.F0 + w1.F1 = w1'.(w2.w3) + w1.(w2 + w3). Multiply that back out and you land exactly on the original w1.w2 + w1.w3 + w2.w3, so the expansion has reconstructed the function perfectly - a small but complete proof for this case.",
        "The general proof is even shorter and lives in the step-through too. Because x is a single binary variable, you only have two cases to check. At x = 0 the formula gives 1.F0 + 0.F1 = F0, which is F by definition; at x = 1 it gives 0.F0 + 1.F1 = F1, again F. Both cases agree, so F = x'.F0 + x.F1 holds identically for every function. QED."
      ],
      theoryHI: [
        "चलिए Shannon को एक worked example से ठोस बनाएँ और फिर theorem को सीधे साबित करें। नीचे का step-through दोनों करता है, हर cofactor को code में गिनते हुए ताकि कुछ भी भरोसे पर न लिया जाए। हमारा example function एक 3-input majority-शैली function F = w1.w2 + w1.w3 + w2.w3 है, और हम इसे w1 के बारे में expand करेंगे।",
        "w1 = 0 पर मजबूर करने से negative cofactor F0 मिलता है। हर वह term जिसमें w1 था 0 पर ढह जाता है, सिर्फ़ w2.w3 term बचता है, तो F0 = w2.w3। यही वह 'बाईं सड़क' है जो आप तब लेते हैं जब w1 traffic light 0 पढ़े।",
        "w1 = 1 पर मजबूर करने से positive cofactor F1 मिलता है। terms w1.w2 और w1.w3 सादे w2 और w3 बन जाते हैं, और absorption इस्तेमाल करके (w2 + w3 + w2.w3 = w2 + w3, क्योंकि अतिरिक्त product पहले से ढका है) हम पाते हैं F1 = w2 + w3। यही w1 = 1 के लिए 'दाईं सड़क' है।",
        "Shannon से फिर जोड़िए: F = w1'.F0 + w1.F1 = w1'.(w2.w3) + w1.(w2 + w3)। इसे वापस गुणा करके खोलिए और आप ठीक मूल w1.w2 + w1.w3 + w2.w3 पर पहुँचते हैं, तो expansion ने function को पूरी तरह फिर बना दिया - इस case का एक छोटा पर पूरा सबूत।",
        "सामान्य सबूत और भी छोटा है और step-through में भी है। चूँकि x एक अकेला binary variable है, आपको सिर्फ़ दो cases जाँचने हैं। x = 0 पर formula देता है 1.F0 + 0.F1 = F0, जो परिभाषा से F है; x = 1 पर यह देता है 0.F0 + 1.F1 = F1, फिर F। दोनों cases मिलते हैं, तो F = x'.F0 + x.F1 हर function के लिए समान रूप से सही है। QED।"
      ],
      transcriptEN:
        "Let us make Shannon concrete and then prove it. Take the majority-style function F equals w1-w2 plus w1-w3 plus w2-w3, and expand about w1. Force w1 to zero: every term with w1 vanishes, leaving F-zero equals w2-w3, the left road. Force w1 to one: w1-w2 and w1-w3 become w2 and w3, and by absorption w2 plus w3 plus w2-w3 is just w2 plus w3, so F-one equals w2 plus w3, the right road. Recombine: F equals w1-prime times w2-w3, plus w1 times w2-plus-w3. Multiply back out and you land on the original function exactly. Now the general proof. Because x is binary you only check two cases. At x equals zero the formula is one times F-zero plus zero times F-one, which is F-zero, which is F. At x equals one it is zero plus one times F-one, which is F-one, which is F. Both cases agree, so the expansion holds for every function.",
      transcriptHI:
        "चलिए Shannon को ठोस बनाएँ और फिर साबित करें। majority-शैली function F बराबर w1-w2 plus w1-w3 plus w2-w3 लीजिए, और w1 के बारे में expand कीजिए। w1 को zero कीजिए: w1 वाला हर term ग़ायब हो जाता है, F-zero बराबर w2-w3 बचता है, बाईं सड़क। w1 को one कीजिए: w1-w2 और w1-w3, w2 और w3 बन जाते हैं, और absorption से w2 plus w3 plus w2-w3 बस w2 plus w3 है, तो F-one बराबर w2 plus w3, दाईं सड़क। फिर जोड़िए: F बराबर w1-prime गुना w2-w3, plus w1 गुना w2-plus-w3। वापस गुणा कीजिए और आप ठीक मूल function पर पहुँचते हैं। अब सामान्य सबूत। चूँकि x binary है आप सिर्फ़ दो cases जाँचते हैं। x बराबर zero पर formula है one गुना F-zero plus zero गुना F-one, जो F-zero है, जो F है। x बराबर one पर यह zero plus one गुना F-one है, जो F-one है, जो F है। दोनों cases मिलते हैं, तो expansion हर function के लिए सही है।",
      visualNote:
        'StepThrough: state the function, evaluate w1=0 -> F0 = w2.w3, evaluate w1=1 -> F1 = w2+w3, recombine, then the two-case proof at x=0 and x=1.'
    },
    {
      id: 'S08_MuxShannon',
      label: 'Shannon = A 2-to-1 MUX',
      kind: 'theory',
      subtitle: "F = x'.F0 + x.F1 IS the MUX equation Y = S'.I0 + S.I1 - so the MUX is universal.",
      theoryEN: [
        "This is the page where the two heroes meet. Put Shannon's expansion F = x'.F0 + x.F1 directly above a 2-to-1 multiplexer's output equation Y = S'.I0 + S.I1, and they are the same expression. The match is the whole point of the module, so let us read it carefully.",
        "Map the symbols one to one. The expansion variable x becomes the MUX SELECT line S. The negative cofactor F0 becomes data input I0. The positive cofactor F1 becomes data input I1. With that mapping the MUX output equals F exactly - the traffic intersection IS the multiplexer.",
        "The immediate consequence is striking: ANY Boolean function, no matter how complicated, can be wrapped as a single 2-to-1 MUX whose two data inputs are its cofactors. You do not first simplify the function to AND-OR logic; you just pick a control variable and route its two cofactors. The interactive below lets you toggle a 2-variable truth table and watch the same bits flow through a live 2-to-1 MUX.",
        "Then comes recursion, and this is where it explodes into universality. Each cofactor F0 and F1 is itself a smaller function of the remaining variables, so expand each of them about a second variable into two more 2-to-1 MUXes. Keep going until the inputs are just constants 0 and 1, or single literals - the tree bottoms out.",
        "The conclusion is the second half of the module's promise: a TREE of 2-to-1 MUXes can implement ANY function, so the multiplexer is a universal building block, exactly like NAND. This is not a textbook curiosity - it is precisely how an FPGA's lookup table (LUT) works, routing a stored truth table through layers of selection to compute whatever logic you programmed."
      ],
      theoryHI: [
        "यही वह page है जहाँ दोनों नायक मिलते हैं। Shannon की expansion F = x'.F0 + x.F1 को सीधे एक 2-to-1 multiplexer के output समीकरण Y = S'.I0 + S.I1 के ऊपर रखिए, और वे एक ही expression हैं। यही मिलान पूरे module का मक़सद है, तो इसे ध्यान से पढ़िए।",
        "symbols को एक-से-एक map कीजिए। expansion variable x, MUX SELECT line S बन जाता है। negative cofactor F0, data input I0 बन जाता है। positive cofactor F1, data input I1 बन जाता है। उस mapping के साथ MUX output ठीक F के बराबर है - traffic intersection ही multiplexer है।",
        "तत्काल नतीजा चौंकाने वाला है: कोई भी Boolean function, चाहे कितना भी जटिल हो, एक अकेले 2-to-1 MUX के रूप में लपेटा जा सकता है जिसके दो data inputs उसके cofactors हों। आप पहले function को AND-OR logic में सरल नहीं करते; आप बस एक control variable चुनते हैं और उसके दो cofactors route करते हैं। नीचे का interactive आपको एक 2-variable truth table toggle करने देता है और वही bits एक live 2-to-1 MUX से बहते देखने देता है।",
        "फिर आता है recursion, और यहीं यह universality में फूट पड़ता है। हर cofactor F0 और F1 ख़ुद बचे variables का एक छोटा function है, तो हर एक को एक दूसरे variable के बारे में दो और 2-to-1 MUXes में expand कीजिए। तब तक चलते रहिए जब तक inputs सिर्फ़ constants 0 और 1, या single literals न रह जाएँ - tree तल तक पहुँच जाता है।",
        "निष्कर्ष module के वादे का दूसरा आधा है: 2-to-1 MUXes का एक TREE किसी भी function को बना सकता है, तो multiplexer एक universal building block है, ठीक NAND की तरह। यह कोई किताबी अजूबा नहीं है - यह ठीक वही है जैसे एक FPGA का lookup table (LUT) काम करता है, एक संग्रहित truth table को selection की परतों से route करके वह logic गिनता है जो आपने program की।"
      ],
      transcriptEN:
        "This is where the two heroes meet. Put Shannon's expansion above a two-to-one MUX equation: F equals x-prime F-zero plus x F-one, and Y equals S-prime I-zero plus S I-one. They are the same expression. Map the symbols: x becomes the select S, F-zero becomes data input I-zero, F-one becomes data input I-one. So any Boolean function can be wrapped as a single MUX whose data inputs are its cofactors - you do not simplify first, you just route. Then recurse: each cofactor is a smaller function, so expand it about a second variable into two more MUXes, and keep going until the inputs are constants or single literals. A tree of two-to-one MUXes can implement any function, so the MUX is universal, exactly like NAND. This is precisely how an FPGA lookup table works: it routes a stored truth table through layers of selection to compute whatever logic you programmed.",
      transcriptHI:
        "यहीं दोनों नायक मिलते हैं। Shannon की expansion को एक two-to-one MUX समीकरण के ऊपर रखिए: F बराबर x-prime F-zero plus x F-one, और Y बराबर S-prime I-zero plus S I-one। वे एक ही expression हैं। symbols map कीजिए: x select S बनता है, F-zero data input I-zero बनता है, F-one data input I-one बनता है। तो कोई भी Boolean function एक अकेले MUX के रूप में लपेटा जा सकता है जिसके data inputs उसके cofactors हों - आप पहले सरल नहीं करते, बस route करते हैं। फिर recurse कीजिए: हर cofactor एक छोटा function है, तो उसे एक दूसरे variable के बारे में दो और MUXes में expand कीजिए, और तब तक चलिए जब तक inputs constants या single literals न रहें। 2-to-1 MUXes का एक tree किसी भी function को बना सकता है, तो MUX universal है, ठीक NAND की तरह। यह ठीक वही है जैसे एक FPGA lookup table काम करता है: एक संग्रहित truth table को selection की परतों से route करके वह logic गिनता है जो आपने program की।",
      visualNote:
        'ShannonExpander block: toggle the 4 outputs of F(x,y); the cofactors F0,F1 feed a 2-to-1 MUX selected by x; the equation F = x\'.F0 + x.F1 sits beside Y = S\'.I0 + S.I1.'
    },
    {
      id: 'S09_MuxTree',
      label: 'Building A MUX Tree',
      kind: 'theory',
      subtitle: 'A 2^n-to-1 MUX = (2^n - 1) 2-to-1 MUXes in n stages - a city of intersections.',
      theoryEN: [
        "If one intersection is a 2-to-1 MUX, a whole city of intersections is a bigger MUX, and Shannon recursion is the map that lays the city out. On this page we size that city: how many select lines and how many little 2-to-1 MUXes a large multiplexer really costs.",
        "First the select lines. A 2^n-to-1 MUX has 2^n data inputs and needs n select lines, because each select bit halves the number of choices - one bit picks between 2, two bits pick among 4, three bits pick among 8. In short, select lines = log2(N) = n for N = 2^n inputs.",
        "Now the count of 2-to-1 building blocks. A 2^n-to-1 MUX is built from exactly (2^n - 1) 2-to-1 MUXes arranged in n stages, like a knockout bracket where each round halves the contenders. A 4-to-1 MUX is three 2-to-1 MUXes: two in the first stage selecting pairs on s0, and one in the second stage merging the winners on s1.",
        "Scale it up and the pattern continues cleanly. An 8-to-1 MUX is seven 2-to-1 MUXes, arranged 4 then 2 then 1 across three levels, driven by select bits s2, s1, s0 - one level per select bit. Four leaf MUXes feed two middle MUXes feed one output MUX, exactly a binary tree.",
        "Tie the two halves of the module together. Because Shannon recursion maps any function onto exactly such a MUX tree, you now have two universal routes to the very same circuit: a NAND-only net built from the Swiss-army gate, or a MUX tree built from traffic intersections. Choose whichever your fabric makes cheap - the logic is identical."
      ],
      theoryHI: [
        "अगर एक intersection एक 2-to-1 MUX है, तो intersections का एक पूरा शहर एक बड़ा MUX है, और Shannon recursion वह नक़्शा है जो शहर बिछाता है। इस page पर हम उस शहर का आकार नापते हैं: एक बड़ा multiplexer असल में कितनी select lines और कितने छोटे 2-to-1 MUXes माँगता है।",
        "पहले select lines। एक 2^n-to-1 MUX के 2^n data inputs होते हैं और n select lines चाहिए, क्योंकि हर select bit choices की संख्या आधी कर देता है - एक bit 2 में से चुनता है, दो bits 4 में से, तीन bits 8 में से। संक्षेप में, N = 2^n inputs के लिए select lines = log2(N) = n।",
        "अब 2-to-1 building blocks की गिनती। एक 2^n-to-1 MUX ठीक (2^n - 1) 2-to-1 MUXes से बनता है, n stages में सजे, एक knockout bracket की तरह जहाँ हर round प्रतियोगियों को आधा कर देता है। एक 4-to-1 MUX तीन 2-to-1 MUXes है: पहले stage में दो जो s0 पर जोड़े चुनते हैं, और दूसरे stage में एक जो विजेताओं को s1 पर मिलाता है।",
        "इसे बड़ा कीजिए और pattern साफ़-साफ़ चलता रहता है। एक 8-to-1 MUX सात 2-to-1 MUXes है, तीन levels में 4 फिर 2 फिर 1 सजे, select bits s2, s1, s0 से चलाए - हर select bit के लिए एक level। चार leaf MUXes दो बीच के MUXes को feed करते हैं जो एक output MUX को feed करते हैं, ठीक एक binary tree।",
        "module के दोनों आधे जोड़िए। चूँकि Shannon recursion किसी भी function को ठीक ऐसे ही एक MUX tree पर map करता है, अब आपके पास उसी एक circuit तक दो universal रास्ते हैं: Swiss-army gate से बना एक NAND-only net, या traffic intersections से बना एक MUX tree। जो भी आपका fabric सस्ता बनाए वही चुनिए - logic एक ही है।"
      ],
      transcriptEN:
        "One intersection is a two-to-one MUX; a whole city of them is a bigger MUX, and Shannon recursion lays out the city. First, select lines: a two-to-the-n to one MUX needs n select lines, because each bit halves the choices - one bit picks between two, two bits among four, three among eight. So select lines equal log-two of N. Now the count of building blocks: a two-to-the-n to one MUX is built from two-to-the-n minus one little two-to-one MUXes, arranged in n stages, like a knockout bracket. A four-to-one MUX is three two-to-one MUXes: two selecting pairs on s-zero, one merging on s-one. An eight-to-one MUX is seven, arranged four then two then one across three levels, driven by s-two, s-one, s-zero. Because Shannon recursion maps any function onto exactly such a tree, you have two universal routes to the same circuit: a NAND-only net, or a MUX tree. Pick whichever your fabric makes cheap.",
      transcriptHI:
        "एक intersection एक two-to-one MUX है; उनका एक पूरा शहर एक बड़ा MUX है, और Shannon recursion शहर बिछाता है। पहले, select lines: एक two-to-the-n to one MUX को n select lines चाहिए, क्योंकि हर bit choices आधी करता है - एक bit दो में से, दो bits चार में से, तीन आठ में से। तो select lines बराबर log-two of N। अब building blocks की गिनती: एक two-to-the-n to one MUX, two-to-the-n minus one छोटे two-to-one MUXes से बनता है, n stages में सजे, एक knockout bracket की तरह। एक four-to-one MUX तीन two-to-one MUXes है: दो s-zero पर जोड़े चुनते, एक s-one पर मिलाता। एक eight-to-one MUX सात है, तीन levels में चार फिर दो फिर एक, s-two, s-one, s-zero से चलाए। चूँकि Shannon recursion किसी भी function को ठीक ऐसे tree पर map करता है, आपके पास उसी circuit तक दो universal रास्ते हैं: एक NAND-only net, या एक MUX tree। जो भी आपका fabric सस्ता बनाए वही चुनिए।",
      visualNote:
        'A binary tree of 2-to-1 MUX blocks: 4 leaves -> 2 middle -> 1 output, select bits s2,s1,s0 labelling the three levels; counter shows select lines = log2(N) and 2:1 count = 2^n - 1.'
    },
    {
      id: 'S10_Build',
      label: 'Build It For Real',
      kind: 'build',
      subtitle: 'Wire NAND gates on the live workbench and prove the universality yourself.',
      theoryEN: [
        "You have seen the knife fold out in theory; now open the real workbench and fold it out in silicon. The guided build hands you a sandbox of NAND gates and asks you to wire them into the gates you just learned, then verify each one against its truth table on actual simulated hardware.",
        "Start with the three core blades. Tie one NAND's inputs together for NOT, chain a NAND into a NAND-inverter for AND, and feed two inverted inputs into a NAND for OR. Each time, drive the inputs through all combinations and watch the output column match the standard gate exactly.",
        "When those click, push to the headline challenge: build XOR from NAND only. It takes four NANDs, and getting there forces you to combine the AND, OR and inversion tricks at once - the moment XOR lights up correctly, you have proven to yourself that one gate type really does build everything.",
        "Keep both analogies running while you wire. Every NAND you drop is another fold of the Swiss-army knife, and if you instead think in MUXes, every selection you make is another traffic intersection routing a cofactor. Same universality, two pictures.",
        "There is no single 'right' wiring - only circuits that match the target truth table and circuits that do not. The workbench checks completeness against the goal row by row, so build, test, and let real hardware confirm the theorem you have been reading."
      ],
      theoryHI: [
        "आपने theory में knife को खुलते देखा; अब असली workbench खोलिए और उसे silicon में खोलिए। guided build आपको NAND gates का एक sandbox देता है और कहता है कि उन्हें उन gates में wire कीजिए जो आपने अभी सीखे, फिर हर एक को असली simulated hardware पर उसकी truth table के सामने जाँचिए।",
        "तीन मूल blades से शुरू कीजिए। NOT के लिए एक NAND के inputs जोड़िए, AND के लिए एक NAND को एक NAND-inverter में chain कीजिए, और OR के लिए दो inverted inputs एक NAND में feed कीजिए। हर बार, inputs को सभी combinations से चलाइए और देखिए output column standard gate से ठीक मिलता है।",
        "जब वे जम जाएँ, मुख्य चुनौती की ओर बढ़िए: सिर्फ़ NAND से XOR बनाइए। इसमें चार NANDs लगते हैं, और वहाँ पहुँचना आपको AND, OR और inversion की तरकीबें एक साथ मिलाने पर मजबूर करता है - जिस पल XOR सही जलता है, आपने ख़ुद को साबित कर दिया कि एक gate type सचमुच सब कुछ बनाता है।",
        "wire करते समय दोनों analogies चलाते रखिए। हर NAND जो आप गिराते हैं Swiss-army knife का एक और fold है, और अगर आप MUXes में सोचें, तो हर selection जो आप करते हैं एक और traffic intersection है जो एक cofactor route करता है। वही universality, दो तस्वीरें।",
        "कोई एक 'सही' wiring नहीं है - सिर्फ़ वे circuits जो target truth table से मिलते हैं और वे जो नहीं मिलते। workbench लक्ष्य के सामने completeness row-दर-row जाँचता है, तो बनाइए, परखिए, और असली hardware को वह theorem confirm करने दीजिए जिसे आप पढ़ते आए हैं।"
      ],
      transcriptEN:
        "You have seen the knife fold out in theory; now open the real workbench and fold it out in silicon. The guided build gives you a sandbox of NAND gates. Start with the three blades: tie one NAND's inputs together for NOT, chain a NAND into a NAND-inverter for AND, and feed two inverted inputs into a NAND for OR, checking each against its truth table. Then push to the headline challenge: build XOR from NAND only, which takes four NANDs and forces you to combine AND, OR and inversion at once. Keep both pictures running - every NAND is a fold of the Swiss-army knife, every selection a traffic intersection. The workbench checks completeness row by row, so build, test, and let real hardware confirm the theorem.",
      transcriptHI:
        "आपने theory में knife को खुलते देखा; अब असली workbench खोलिए और उसे silicon में खोलिए। guided build आपको NAND gates का एक sandbox देता है। तीन blades से शुरू कीजिए: NOT के लिए एक NAND के inputs जोड़िए, AND के लिए एक NAND को NAND-inverter में chain कीजिए, और OR के लिए दो inverted inputs एक NAND में feed कीजिए, हर एक को उसकी truth table के सामने जाँचते हुए। फिर मुख्य चुनौती की ओर बढ़िए: सिर्फ़ NAND से XOR बनाइए, जिसमें चार NANDs लगते हैं और जो आपको AND, OR और inversion एक साथ मिलाने पर मजबूर करता है। दोनों तस्वीरें चलाते रखिए - हर NAND Swiss-army knife का एक fold है, हर selection एक traffic intersection। workbench completeness row-दर-row जाँचता है, तो बनाइए, परखिए, और असली hardware को theorem confirm करने दीजिए।",
      visualNote:
        'WorkbenchCTA opening /workbench?tutorial=nand-universal: a sandbox of NAND gates with a target truth table, building NOT/AND/OR and the 4-NAND XOR.'
    },
    {
      id: 'S11_Flashcards',
      label: 'Flashcards',
      kind: 'flashcards',
      subtitle: 'Flip through universality, the NAND constructions, cofactors and the MUX mapping.',
      theoryEN: ['Flip each card to lock in the key facts of universal logic and Shannon expansion.'],
      theoryHI: ['हर card पलटिए ताकि universal logic और Shannon expansion के मुख्य तथ्य पक्के हो जाएँ।'],
      transcriptEN: 'Flip each card: universality, NOT/AND/OR from NAND, why one gate type, Shannon expansion, cofactors, and the MUX as a universal module.',
      transcriptHI: 'हर card पलटिए: universality, NAND से NOT/AND/OR, एक gate type क्यों, Shannon expansion, cofactors, और universal module के रूप में MUX।',
      visualNote: 'Eight flip cards drawn from the spec flashcards.'
    },
    {
      id: 'S12_Quiz',
      label: 'Quiz',
      kind: 'quiz',
      subtitle: 'Count gates, name cofactors, and reason about minterms and select lines.',
      theoryEN: ['Eight circuit-building questions on universality, NAND/NOR constructions, cofactors and MUX sizing.'],
      theoryHI: ['universality, NAND/NOR constructions, cofactors और MUX sizing पर आठ circuit-बनाने वाले सवाल।'],
      transcriptEN: 'Answer eight questions: why NAND/NOR are universal, NOT/OR gate counts, cofactor meaning, Shannon-as-MUX, a 1-cofactor, and how many 2-to-1 MUXes make an 8-to-1.',
      transcriptHI: 'आठ सवालों के जवाब दीजिए: NAND/NOR universal क्यों, NOT/OR gate counts, cofactor का मतलब, Shannon-as-MUX, एक 1-cofactor, और 8-to-1 बनाने में कितने 2-to-1 MUXes।',
      visualNote: 'QuizArena with the eight spec questions.'
    },
    {
      id: 'S13_Recap',
      label: 'Recap',
      kind: 'recap',
      subtitle: 'One knife, one intersection: both let a single simple thing build all of logic.',
      theoryEN: [
        "Step back and hold both pictures together. The NAND gate is the Swiss Army knife: copies of one gate fold out into NOT (1 gate), AND (2 gates) and OR (3 gates), and from that complete set you can build XOR, adders and entire CPUs - so NAND is functionally complete, or universal. NOR is the dual blade, building NOT (1), OR (2) and AND (3) by the same DeMorgan tricks.",
        "Shannon's expansion is the traffic intersection: F = x'.F0 + x.F1 isolates one variable x and routes the function down one of two roads, the cofactors F0 = F with x = 0 and F1 = F with x = 1, each a function of the remaining variables only. The dual product-of-sums form is F = (x' + F1).(x + F0).",
        "The two heroes shake hands at the multiplexer. F = x'.F0 + x.F1 is letter-for-letter the 2-to-1 MUX equation Y = S'.I0 + S.I1, with x as select and the cofactors as data - so any function is one MUX, and recursing the cofactors builds a tree of MUXes that implements anything. A 2^n-to-1 MUX needs n = log2(N) select lines and (2^n - 1) 2-to-1 MUXes, so an 8-to-1 MUX is seven 2-to-1 MUXes.",
        "The payoff is practical. One repeated gate type is cheaper to fabricate, needs fewer transistors and shrinks the cell library, and in CMOS the naturally inverting NAND and NOR are cheaper than buffered AND and OR. The very same recursion is how an FPGA lookup table computes logic, routing a stored truth table through layers of selection.",
        "So whether you reach for the Swiss-army NAND or the traffic-intersection MUX, the lesson is the same: you never need a drawer full of gates - one simple, repeatable element, wired cleverly, is enough to build all of logic."
      ],
      theoryHI: [
        "पीछे हटिए और दोनों तस्वीरें साथ पकड़िए। NAND gate Swiss Army knife है: एक gate की copies NOT (1 gate), AND (2 gates) और OR (3 gates) में खुल जाती हैं, और उस complete set से आप XOR, adders और पूरे CPUs बना सकते हैं - तो NAND functionally complete, या universal, है। NOR dual blade है, जो उन्हीं DeMorgan तरकीबों से NOT (1), OR (2) और AND (3) बनाता है।",
        "Shannon की expansion traffic intersection है: F = x'.F0 + x.F1 एक variable x को अलग करता है और function को दो सड़कों में से एक पर route करता है, cofactors F0 = F जिसमें x = 0 और F1 = F जिसमें x = 1, हर एक सिर्फ़ बचे variables का function। dual product-of-sums रूप है F = (x' + F1).(x + F0)।",
        "दोनों नायक multiplexer पर हाथ मिलाते हैं। F = x'.F0 + x.F1 अक्षर-दर-अक्षर 2-to-1 MUX समीकरण Y = S'.I0 + S.I1 है, x select और cofactors data के रूप में - तो कोई भी function एक MUX है, और cofactors पर recurse करने से MUXes का एक tree बनता है जो कुछ भी बनाता है। एक 2^n-to-1 MUX को n = log2(N) select lines और (2^n - 1) 2-to-1 MUXes चाहिए, तो एक 8-to-1 MUX सात 2-to-1 MUXes है।",
        "फ़ायदा व्यावहारिक है। एक दोहराया gate type बनाने में सस्ता है, कम transistors चाहिए और cell library छोटी करता है, और CMOS में स्वभाव से inverting NAND और NOR, buffered AND और OR से सस्ते हैं। वही recursion वह तरीक़ा है जिससे एक FPGA lookup table logic गिनता है, एक संग्रहित truth table को selection की परतों से route करके।",
        "तो चाहे आप Swiss-army NAND उठाएँ या traffic-intersection MUX, सबक़ एक ही है: आपको कभी gates से भरा दराज़ नहीं चाहिए - एक सरल, दोहराने योग्य तत्व, चतुराई से wire किया, सारी logic बनाने के लिए काफ़ी है।"
      ],
      transcriptEN: 'Recap. NAND is the Swiss Army knife: NOT one gate, AND two, OR three, and that complete set builds anything, so NAND is universal; NOR is the dual blade. Shannon expansion is the traffic intersection: F equals x-prime F-zero plus x F-one, with cofactors F-zero and F-one of the remaining variables. That equation is the two-to-one MUX equation, so any function is one MUX and a tree of MUXes builds anything - an eight-to-one MUX is seven two-to-one MUXes, needing three select lines. One repeated gate is cheaper to fabricate, and the same recursion is how an FPGA lookup table computes. One knife or one intersection - either way, one simple element builds all of logic.',
      transcriptHI: 'सार। NAND Swiss Army knife है: NOT एक gate, AND दो, OR तीन, और वह complete set कुछ भी बनाता है, तो NAND universal है; NOR dual blade है। Shannon expansion traffic intersection है: F बराबर x-prime F-zero plus x F-one, cofactors F-zero और F-one बचे variables के। वह समीकरण two-to-one MUX समीकरण है, तो कोई भी function एक MUX है और MUXes का एक tree कुछ भी बनाता है - एक eight-to-one MUX सात two-to-one MUXes है, तीन select lines चाहिए। एक दोहराया gate बनाने में सस्ता है, और वही recursion वह तरीक़ा है जिससे एक FPGA lookup table गिनता है। एक knife या एक intersection - किसी भी तरह, एक सरल तत्व सारी logic बनाता है।',
      visualNote: 'Recap prose + the shared FlowRail, with the four source links listed below.'
    }
  ],
  flashcards: [
    {
      frontEN: 'Functionally complete (universal) gate',
      backEN: 'A gate whose copies alone can implement every Boolean function, with no other gate type needed. NAND and NOR both qualify.',
      frontHI: 'Functionally complete (universal) gate',
      backHI: 'एक gate जिसकी अकेली copies हर Boolean function बना सकें, बिना किसी दूसरे gate type के। NAND और NOR दोनों योग्य हैं।'
    },
    {
      frontEN: 'NOT from NAND',
      backEN: "NAND(A,A) = (A.A)' = A' - short both inputs of one NAND. Cost: 1 gate.",
      frontHI: 'NAND से NOT',
      backHI: "NAND(A,A) = (A.A)' = A' - एक NAND के दोनों inputs जोड़ दीजिए। क़ीमत: 1 gate।"
    },
    {
      frontEN: 'AND from NAND',
      backEN: "A NAND followed by a NAND-inverter: ((A.B)')' = A.B. Cost: 2 gates.",
      frontHI: 'NAND से AND',
      backHI: "एक NAND के बाद एक NAND-inverter: ((A.B)')' = A.B। क़ीमत: 2 gates।"
    },
    {
      frontEN: 'OR from NAND',
      backEN: "Invert both inputs, then NAND: NAND(A',B') = (A'.B')' = A + B (DeMorgan). Cost: 3 gates.",
      frontHI: 'NAND से OR',
      backHI: "दोनों inputs invert कीजिए, फिर NAND: NAND(A',B') = (A'.B')' = A + B (DeMorgan)। क़ीमत: 3 gates।"
    },
    {
      frontEN: 'Why one gate type in fabrication',
      backEN: 'Repeating a single cell cuts the transistor count, simplifies manufacturing and shrinks the standard-cell library. NAND/NOR are also naturally inverting in CMOS, so they are cheaper than buffered AND/OR.',
      frontHI: 'fabrication में एक gate type क्यों',
      backHI: 'एक ही cell दोहराना transistor count घटाता है, manufacturing सरल करता है और standard-cell library छोटी करता है। NAND/NOR CMOS में स्वभाव से inverting भी हैं, तो buffered AND/OR से सस्ते हैं।'
    },
    {
      frontEN: "Shannon's Expansion Theorem",
      backEN: "F = x'.F0 + x.F1: isolate one variable to expose an IF-x-THEN-F1-ELSE-F0 structure. Dual form: F = (x' + F1).(x + F0).",
      frontHI: 'Shannon की Expansion Theorem',
      backHI: "F = x'.F0 + x.F1: एक variable को अलग करके एक IF-x-THEN-F1-ELSE-F0 संरचना उजागर कीजिए। dual रूप: F = (x' + F1).(x + F0)।"
    },
    {
      frontEN: 'Cofactor',
      backEN: 'F0 = F with x = 0, F1 = F with x = 1 - each a function of the REMAINING variables only.',
      frontHI: 'Cofactor',
      backHI: 'F0 = F जिसमें x = 0, F1 = F जिसमें x = 1 - हर एक सिर्फ़ बचे हुए variables का function।'
    },
    {
      frontEN: 'MUX as a universal module',
      backEN: "Shannon expansion IS a 2-to-1 MUX (select x, data F0/F1); recursing the cofactors builds any function as a MUX tree. A 2^n-to-1 MUX = 2^n - 1 2-to-1 MUXes.",
      frontHI: 'universal module के रूप में MUX',
      backHI: "Shannon expansion ही एक 2-to-1 MUX है (select x, data F0/F1); cofactors पर recurse करने से कोई भी function एक MUX tree के रूप में बनता है। एक 2^n-to-1 MUX = 2^n - 1 2-to-1 MUXes।"
    }
  ],
  quiz: [
    {
      questionEN: "Why are NAND and NOR called 'universal' gates?",
      questionHI: "NAND और NOR को 'universal' gates क्यों कहते हैं?",
      options: [
        'They are the fastest gates in silicon',
        'Copies of just that one gate can build ANY Boolean function',
        'They never consume power',
        'They only work inside multiplexers'
      ],
      answerIndex: 1,
      explainEN: 'Universal = functionally complete: a NAND-only (or NOR-only) net builds every Boolean function, with no other gate type needed.',
      explainHI: 'Universal = functionally complete: एक NAND-only (या NOR-only) net हर Boolean function बनाता है, बिना किसी दूसरे gate type के।'
    },
    {
      questionEN: 'How do you turn a single NAND gate into a NOT gate?',
      questionHI: 'एक अकेले NAND gate को NOT gate में कैसे बदलते हैं?',
      options: [
        'Tie both inputs together to the same signal',
        'Ground one input',
        'Connect the output back to an input',
        'Add a pull-up resistor'
      ],
      answerIndex: 0,
      explainEN: "NAND(A,A) = (A.A)' = A', so shorting both inputs to the same signal yields an inverter.",
      explainHI: "NAND(A,A) = (A.A)' = A', तो दोनों inputs को एक ही signal से जोड़ने पर एक inverter बनता है।"
    },
    {
      questionEN: 'How many NAND gates are needed to build an OR gate, and how?',
      questionHI: 'एक OR gate बनाने के लिए कितने NAND gates चाहिए, और कैसे?',
      options: [
        '1 NAND, inputs shorted',
        '2 NANDs in series',
        '3 NANDs: invert A, invert B, then NAND them',
        '4 NANDs in a ring'
      ],
      answerIndex: 2,
      explainEN: "By DeMorgan, NAND(A',B') = (A'.B')' = A + B; two NANDs invert the inputs and a third combines them - 3 gates.",
      explainHI: "DeMorgan से, NAND(A',B') = (A'.B')' = A + B; दो NANDs inputs को invert करते हैं और एक तीसरा उन्हें मिलाता है - 3 gates।"
    },
    {
      questionEN: 'To implement AND using only NAND gates you must...',
      questionHI: 'सिर्फ़ NAND gates से AND बनाने के लिए आपको...',
      options: [
        'Use one NAND directly - it already is AND',
        'Follow a NAND with a NAND-inverter (2 gates)',
        'Use three NANDs like OR',
        'Use a NOR gate instead'
      ],
      answerIndex: 1,
      explainEN: "A NAND gives (A.B)'; a second shorted NAND inverts it back to A.B, so AND costs 2 NANDs total.",
      explainHI: "एक NAND (A.B)' देता है; एक दूसरा shorted NAND उसे वापस A.B में invert करता है, तो AND की क़ीमत कुल 2 NANDs है।"
    },
    {
      questionEN: "In Shannon's expansion F = x'.F0 + x.F1, what are F0 and F1?",
      questionHI: "Shannon की expansion F = x'.F0 + x.F1 में, F0 और F1 क्या हैं?",
      options: [
        'The two select lines',
        'The function with x forced to 0 and to 1 (the cofactors)',
        'Random minterms',
        'The carry and sum bits'
      ],
      answerIndex: 1,
      explainEN: 'F0 = F evaluated at x = 0 and F1 = F evaluated at x = 1; they are the cofactors, functions of the remaining variables.',
      explainHI: 'F0 = F जिसमें x = 0 और F1 = F जिसमें x = 1; ये cofactors हैं, बचे variables के functions।'
    },
    {
      questionEN: "Shannon's expansion maps directly onto which hardware block?",
      questionHI: 'Shannon की expansion सीधे किस hardware block पर map होती है?',
      options: [
        'A 2-to-1 multiplexer',
        'A full adder',
        'A D flip-flop',
        'A tri-state buffer'
      ],
      answerIndex: 0,
      explainEN: "F = x'.F0 + x.F1 matches the MUX equation Y = S'.I0 + S.I1: x is the select, F0/F1 are the data inputs.",
      explainHI: "F = x'.F0 + x.F1, MUX समीकरण Y = S'.I0 + S.I1 से मिलता है: x select है, F0/F1 data inputs हैं।"
    },
    {
      questionEN: 'Expand F = w1.w2 + w1.w3 + w2.w3 about w1. What is the 1-cofactor F1?',
      questionHI: 'F = w1.w2 + w1.w3 + w2.w3 को w1 के बारे में expand कीजिए। 1-cofactor F1 क्या है?',
      options: [
        'w2.w3',
        'w2 + w3',
        'w1 + w2',
        '0'
      ],
      answerIndex: 1,
      explainEN: 'Set w1 = 1: F1 = w2 + w3 + w2.w3 = w2 + w3 by absorption (the extra product is already covered).',
      explainHI: 'w1 = 1 कीजिए: F1 = w2 + w3 + w2.w3 = w2 + w3 absorption से (अतिरिक्त product पहले से ढका है)।'
    },
    {
      questionEN: 'How many 2-to-1 MUXes are needed to build an 8-to-1 MUX?',
      questionHI: 'एक 8-to-1 MUX बनाने के लिए कितने 2-to-1 MUXes चाहिए?',
      options: [
        '3',
        '4',
        '7',
        '8'
      ],
      answerIndex: 2,
      explainEN: 'A 2^n-to-1 MUX uses 2^n - 1 two-to-one MUXes; for n = 3 that is 4 + 2 + 1 = 7 across three select levels.',
      explainHI: 'एक 2^n-to-1 MUX, 2^n - 1 two-to-one MUXes इस्तेमाल करता है; n = 3 के लिए यह तीन select levels में 4 + 2 + 1 = 7 है।'
    }
  ]
}) as unknown as SubContent;
