import type { SubContent } from '../_subtractor/kit';

export const CONTENT = ({
  "moduleTitle": "The Half Subtractor - Binary Parking Logic",
  "moduleSubtitle": "Adarsh the traffic cop, his parking lot, and the two wires that do binary subtraction",
  "scenes": [
    {
      "id": "S00_Cover",
      "label": "Binary Parking Logic",
      "kind": "cover",
      "subtitle": "Meet Adarsh - the traffic cop whose parking lot quietly performs one-bit binary subtraction.",
      "theoryEN": [
        "This module teaches the Half Subtractor - the circuit that subtracts one bit from another.",
        "Whole module runs on one story: Adarsh's parking lot, where empty spaces meet arriving cars.",
        "Two outputs to track: D (Difference) - what's left on the ground, and B (Borrow) - the overflow car.",
        "You will leave knowing two equations cold: D = x XOR y and B = x'·y.",
        "Last stop: why this circuit is 'amnesic' - and why that flaw forces engineers to build the full subtractor."
      ],
      "theoryHI": [
        "इस module में हम Half Subtractor सीखेंगे - वह circuit जो एक bit में से दूसरा bit घटाती है।",
        "पूरा module एक ही कहानी पर चलता है: Adarsh की parking lot, जहाँ खाली जगहें और आती हुई गाड़ियाँ मिलती हैं।",
        "दो outputs पर नज़र रखनी है: D (Difference) - ज़मीन पर जो बचता है, और B (Borrow) - overflow वाली गाड़ी।",
        "अंत तक दो equations आपको ज़बानी याद होंगी: D = x XOR y और B = x'·y।",
        "आख़िरी पड़ाव: यह circuit 'भुलक्कड़' (amnesic) क्यों है - और यही कमी engineers को full subtractor बनाने पर मजबूर करती है।"
      ],
      "transcriptEN": "Welcome to Binary Parking Logic. Subtraction sounds harder than addition, but in binary it comes down to one tiny question repeated over and over: do these two bits match, and did I run out of room? To answer it we hire Adarsh, a traffic cop with a small parking lot. Empty spaces are one input, arriving cars are the other, and what happens in the lot - a car parks, a space sits empty, or a car has to be sent next door - is exactly what a half subtractor computes. By the end you'll read its two outputs, Difference and Borrow, as naturally as Adarsh reads his lot.",
      "transcriptHI": "Binary Parking Logic में आपका स्वागत है। घटाना (subtraction) जोड़ने से कठिन लगता है, पर binary में यह बार-बार दोहराए जाने वाले एक छोटे से सवाल पर आ टिकता है: क्या ये दो bits आपस में मेल खाते हैं, और क्या जगह ख़त्म हो गई? इसका जवाब देने के लिए हमने Adarsh को रखा है - एक traffic cop जिसकी एक छोटी parking lot है। खाली जगहें एक input हैं, आती गाड़ियाँ दूसरा input, और lot में जो होता है - गाड़ी park हो जाए, जगह खाली रह जाए, या गाड़ी को बग़ल वाले lot में भेजना पड़े - वही half subtractor निकालता है। अंत तक आप इसके दोनों outputs, Difference और Borrow, को उतनी ही सहजता से पढ़ेंगे जितनी सहजता से Adarsh अपनी lot पढ़ता है।",
      "visualNote": "Hero: a stylised top-down parking lot at night, neon sign 'ADARSH'S LOT', one empty space glowing, one car at the entrance. Title 'BINARY PARKING LOGIC' in mono caps."
    },
    {
      "id": "S01_Video",
      "label": "The Half Subtractor",
      "kind": "video",
      "subtitle": "A two-minute story: how a parking lot becomes a subtraction machine.",
      "theoryEN": [
        "Video framing: a half subtractor takes two single bits, x and y, and computes x − y.",
        "x is the minuend (the number you start with); y is the subtrahend (the number you take away).",
        "The lot model: x = empty spaces available, y = cars arriving that want a space.",
        "Two results come out: D = Difference (the on-the-ground result) and B = Borrow (did we run short?).",
        "Watch for the one tricky case - 0 spaces but a car arrives - that's where Borrow lights up."
      ],
      "theoryHI": [
        "Video का सार: half subtractor दो single bits, x और y, लेता है और x − y निकालता है।",
        "x है minuend (वह संख्या जहाँ से शुरू करते हैं); y है subtrahend (वह संख्या जो घटाई जाती है)।",
        "Lot का model: x = उपलब्ध खाली जगहें, y = आती हुई गाड़ियाँ जिन्हें जगह चाहिए।",
        "दो results निकलते हैं: D = Difference (ज़मीनी नतीजा) और B = Borrow (क्या जगह कम पड़ गई?)।",
        "एक tricky case पर ध्यान दें - 0 जगहें पर एक गाड़ी आ गई - यहीं Borrow जलता है।"
      ],
      "transcriptEN": "Here's the whole idea in one breath. A half subtractor has two input wires, x and y, each carrying a single bit. It outputs x minus y. In subtraction language, x is the minuend - the amount you start with - and y is the subtrahend - the amount being taken away. Now picture Adarsh's lot. x is how many parking spaces are free, either zero or one. y is how many cars roll up to the gate, zero or one. The lot reports two things back to him. The Difference, D, is what's physically true on the ground afterwards. The Borrow, B, is a red flag that says: I didn't have room, so a car had to borrow a slot from the next lot down the road. Keep your eye on that last situation - zero free spaces and a car still arrives - because that single case is the entire reason Borrow exists.",
      "transcriptHI": "पूरा विचार एक साँस में। Half subtractor के दो input wires हैं, x और y, हर एक पर एक single bit। यह x minus y output करता है। Subtraction की भाषा में x है minuend - वह मात्रा जहाँ से शुरू करते हैं - और y है subtrahend - वह मात्रा जो घटाई जा रही है। अब Adarsh की lot की कल्पना कीजिए। x बताता है कितनी parking जगहें खाली हैं, या तो शून्य या एक। y बताता है कितनी गाड़ियाँ gate पर आती हैं, शून्य या एक। Lot उसे दो चीज़ें वापस बताती है। Difference, D, वह है जो बाद में ज़मीन पर सचमुच सच होता है। Borrow, B, एक लाल झंडी है जो कहती है: मेरे पास जगह नहीं थी, इसलिए एक गाड़ी को अगले lot से एक slot borrow करना पड़ा। उस आख़िरी स्थिति पर नज़र रखिए - शून्य खाली जगह पर फिर भी गाड़ी आ गई - क्योंकि यही एक case Borrow के होने की पूरी वजह है।",
      "visualNote": "Animated explainer slot. Show x and y as two toggles feeding a box labelled 'HALF SUBTRACTOR', box emits D and B. Cut to lot top-view for each of the four cases."
    },
    {
      "id": "S02_Setup",
      "label": "Adarsh & The Variables",
      "kind": "theory",
      "subtitle": "Pinning each symbol to something you can see in the lot.",
      "theoryEN": [
        "x = Minuend = number of EMPTY parking spaces Adarsh has right now (0 or 1).",
        "y = Subtrahend = number of CARS arriving that want a space (0 or 1).",
        "D = Difference = the result on the ground: a space left empty, or a car newly parked.",
        "B = Borrow = overflow: a car that found no room and had to borrow a space from the NEXT lot.",
        "The operation is always x − y: spaces you have, minus cars that want them.",
        "Everything in this module is one column, one bit each - no carrying anything in yet."
      ],
      "theoryHI": [
        "x = Minuend = इस समय Adarsh के पास कितनी खाली parking जगहें हैं (0 या 1)।",
        "y = Subtrahend = कितनी गाड़ियाँ आ रही हैं जिन्हें जगह चाहिए (0 या 1)।",
        "D = Difference = ज़मीन पर नतीजा: या तो एक जगह खाली रह गई, या एक गाड़ी नई park हुई।",
        "B = Borrow = overflow: वह गाड़ी जिसे जगह नहीं मिली और जिसे अगले (NEXT) lot से एक जगह borrow करनी पड़ी।",
        "operation हमेशा x − y है: आपके पास जितनी जगहें, उनमें से जितनी गाड़ियाँ चाहती हैं उतनी घटा दो।",
        "इस module में सब कुछ एक ही column है, हर एक एक bit - अभी कोई borrow अंदर नहीं आ रहा।"
      ],
      "transcriptEN": "Let's lock the four symbols to things you can point at. x, the minuend, is the empty spaces in the lot - zero or one. y, the subtrahend, is the cars showing up at the gate - zero or one. The whole machine computes x minus y, spaces minus cars. Out the other side come two numbers. D, the Difference, is the honest state of the lot afterwards - was a space left open, or did a car settle into one. B, the Borrow, is the alarm: it goes high only when the lot couldn't cope and a car had to be borrowed against the next lot over. Notice we are dealing with exactly one column of subtraction here - one bit of spaces, one bit of cars - and crucially, nothing is being passed IN from a previous column yet. Remember that detail; it comes back to bite us at the very end.",
      "transcriptHI": "चलिए चारों symbols को ऐसी चीज़ों से बाँध दें जिन्हें आप उँगली से दिखा सकें। x, minuend, lot की खाली जगहें हैं - शून्य या एक। y, subtrahend, gate पर आती गाड़ियाँ हैं - शून्य या एक। पूरी machine x minus y निकालती है, जगहें minus गाड़ियाँ। दूसरी तरफ़ से दो संख्याएँ निकलती हैं। D, Difference, बाद में lot की सच्ची स्थिति है - कोई जगह खुली रही, या कोई गाड़ी उसमें बैठ गई। B, Borrow, अलार्म है: यह तभी high होता है जब lot सँभाल नहीं पाई और एक गाड़ी को अगले lot के ख़िलाफ़ borrow करना पड़ा। ग़ौर कीजिए कि यहाँ हम subtraction के ठीक एक column से जूझ रहे हैं - जगहों का एक bit, गाड़ियों का एक bit - और सबसे अहम, अभी पिछले column से कुछ भी अंदर pass नहीं हो रहा। यह बात याद रखिए; अंत में यही हमें काटने वापस आती है।",
      "visualNote": "Four labelled chips: x (Minuend / empty spaces), y (Subtrahend / arriving cars), D (Difference / on-ground), B (Borrow / next-lot). Side diagram of one parking column."
    },
    {
      "id": "S03_Logbook",
      "label": "Adarsh's Logbook - 4 Scenarios",
      "kind": "theory",
      "subtitle": "Every possible morning at the lot, written in Adarsh's own logbook.",
      "theoryEN": [
        "Quiet Day - 0 spaces, 0 cars (x=0, y=0): nothing happens. D=0, B=0.",
        "Empty Spot - 1 space, 0 cars (x=1, y=0): a space sits open all day. D=1, B=0.",
        "Perfect Match - 1 space, 1 car (x=1, y=1): the car parks neatly, lot is full and even. D=0, B=0.",
        "The Catch - 0 spaces, 1 car (x=0, y=1): no room! The car borrows from the next lot. D=1, B=1.",
        "Only one of four mornings ('The Catch') ever raises a Borrow - that asymmetry is the heart of subtraction.",
        "Read every scenario as 'spaces minus cars', and D is just the leftover digit in this column."
      ],
      "theoryHI": [
        "Quiet Day - 0 जगहें, 0 गाड़ियाँ (x=0, y=0): कुछ नहीं होता। D=0, B=0।",
        "Empty Spot - 1 जगह, 0 गाड़ियाँ (x=1, y=0): एक जगह दिन भर खुली रहती है। D=1, B=0।",
        "Perfect Match - 1 जगह, 1 गाड़ी (x=1, y=1): गाड़ी सुथरे से park हो जाती है, lot भरी और बराबर। D=0, B=0।",
        "The Catch - 0 जगहें, 1 गाड़ी (x=0, y=1): जगह नहीं! गाड़ी अगले lot से borrow करती है। D=1, B=1।",
        "चार में से सिर्फ़ एक सुबह ('The Catch') कभी Borrow उठाती है - यही asymmetry subtraction का दिल है।",
        "हर scenario को 'जगहें minus गाड़ियाँ' की तरह पढ़िए, और D बस इस column में बचा हुआ अंक है।"
      ],
      "transcriptEN": "Adarsh keeps a logbook, and there are only four mornings it can ever record. Morning one, the Quiet Day: no empty spaces, no cars. The lot does nothing, the difference is zero, no borrow. Morning two, the Empty Spot: one space free, no cars come. The space just sits there glowing all day - difference one, no borrow. Morning three, the Perfect Match: one free space, one car arrives, the car slides in and the lot is neatly full. The accounts balance, so difference is zero and again no borrow. And then morning four, the one Adarsh dreads - The Catch: zero free spaces, but a car still rolls up. There's no room. To honour the demand, the car is borrowed against the next lot down the street. On the ground a car still needs placing, so the difference reads one, and this time the borrow flag flies. Four mornings, and only The Catch ever borrows. Hold that thought.",
      "transcriptHI": "Adarsh एक logbook रखता है, और इसमें सिर्फ़ चार ही सुबहें दर्ज हो सकती हैं। पहली सुबह, Quiet Day: कोई खाली जगह नहीं, कोई गाड़ी नहीं। Lot कुछ नहीं करती, difference शून्य, कोई borrow नहीं। दूसरी सुबह, Empty Spot: एक जगह खाली, कोई गाड़ी नहीं आती। जगह बस दिन भर चमकती बैठी रहती है - difference एक, कोई borrow नहीं। तीसरी सुबह, Perfect Match: एक खाली जगह, एक गाड़ी आती है, गाड़ी अंदर सरक जाती है और lot सुथरे से भर जाती है। हिसाब बराबर हो जाता है, इसलिए difference शून्य और फिर कोई borrow नहीं। और फिर चौथी सुबह, जिससे Adarsh डरता है - The Catch: शून्य खाली जगह, पर फिर भी एक गाड़ी आ जाती है। जगह नहीं है। माँग पूरी करने के लिए गाड़ी को अगले lot के ख़िलाफ़ borrow किया जाता है। ज़मीन पर अब भी एक गाड़ी को जगह चाहिए, इसलिए difference एक पढ़ता है, और इस बार borrow का झंडा लहराता है। चार सुबहें, और सिर्फ़ The Catch ही कभी borrow करती है। यह बात पकड़े रखिए।",
      "visualNote": "Open notebook graphic with four rows. Each row: tiny lot top-view + label (Quiet Day / Empty Spot / Perfect Match / The Catch) + D,B values. Highlight 'The Catch' row in rose/red."
    },
    {
      "id": "S04_TruthTable",
      "label": "The Truth Table",
      "kind": "truth",
      "subtitle": "The four mornings compressed into one rigorous table.",
      "theoryEN": [
        "Inputs x, y → Outputs D, B. Read each row as the subtraction x − y in one column.",
        "x=0, y=0 → D=0, B=0  (Quiet Day).",
        "x=1, y=0 → D=1, B=0  (Empty Spot).",
        "x=1, y=1 → D=0, B=0  (Perfect Match).",
        "x=0, y=1 → D=1, B=1  (The Catch - the only borrow).",
        "Scan the D column: it's 1 exactly when x and y DIFFER - that's a XOR fingerprint.",
        "Scan the B column: it's 1 in only one row, where x=0 and y=1 - remember that single row."
      ],
      "theoryHI": [
        "Inputs x, y → Outputs D, B। हर row को एक column में x − y subtraction की तरह पढ़िए।",
        "x=0, y=0 → D=0, B=0  (Quiet Day)।",
        "x=1, y=0 → D=1, B=0  (Empty Spot)।",
        "x=1, y=1 → D=0, B=0  (Perfect Match)।",
        "x=0, y=1 → D=1, B=1  (The Catch - एकमात्र borrow)।",
        "D column देखिए: यह ठीक तब 1 है जब x और y अलग (DIFFER) हों - यह XOR की पहचान है।",
        "B column देखिए: यह सिर्फ़ एक row में 1 है, जहाँ x=0 और y=1 - वह अकेली row याद रखिए।"
      ],
      "transcriptEN": "Now we drop the story and write the same four mornings as a hard truth table. Two input columns, x and y; two output columns, D and B. Row by row: zero, zero gives difference zero, borrow zero. One, zero gives difference one, borrow zero. One, one gives difference zero, borrow zero. And zero, one gives difference one, borrow one. Now do what an engineer always does - read down each output column on its own. Look at D: it is one in exactly the two rows where x and y disagree, and zero where they agree. A wire that fires only on disagreement has a name, and that name is XOR. Now look at B: it is high in a single solitary row, the one where x is zero and y is one. One row. Don't blur it with any other row - especially not with the x-equals-one, y-equals-zero row, which keeps B firmly at zero.",
      "transcriptHI": "अब हम कहानी छोड़ कर उन्हीं चार सुबहों को एक सख़्त truth table के रूप में लिखते हैं। दो input columns, x और y; दो output columns, D और B। row दर row: शून्य, शून्य देता है difference शून्य, borrow शून्य। एक, शून्य देता है difference एक, borrow शून्य। एक, एक देता है difference शून्य, borrow शून्य। और शून्य, एक देता है difference एक, borrow एक। अब वह कीजिए जो engineer हमेशा करता है - हर output column को अकेले नीचे तक पढ़िए। D देखिए: यह ठीक उन्हीं दो rows में एक है जहाँ x और y असहमत हैं, और जहाँ वे सहमत हैं वहाँ शून्य। जो wire सिर्फ़ असहमति पर जलती है उसका एक नाम है, और वह नाम है XOR। अब B देखिए: यह सिर्फ़ एक अकेली row में high है, वही जहाँ x शून्य और y एक है। एक row। इसे किसी और row से मत मिलाइए - ख़ासकर उस row से जहाँ x एक और y शून्य है, जो B को मज़बूती से शून्य पर रखती है।",
      "visualNote": "Clean 4-row truth table, columns x | y | D | B. Colour the D=1 cells cyan, the single B=1 cell rose. Footnote arrows: 'D = x⊕y', 'B high only here'."
    },
    {
      "id": "S05_Difference",
      "label": "The Difference: D = x ⊕ y",
      "kind": "theory",
      "subtitle": "Difference is 1 only when spaces and cars MISMATCH.",
      "theoryEN": [
        "Equation: D = x XOR y. The Difference wire is a plain two-input XOR gate.",
        "Meaning in the lot: D=1 only when spaces and cars MISMATCH (one present, the other not).",
        "x=1, y=0 (space, no car) → mismatch → D=1: a space is left over this column.",
        "x=0, y=1 (no space, a car) → mismatch → D=1: a car is still left to place this column.",
        "x=0,y=0 and x=1,y=1 are MATCHES → D=0: nothing is left over in this column.",
        "XOR is the universal 'are these two bits different?' detector - that's all Difference asks."
      ],
      "theoryHI": [
        "Equation: D = x XOR y। Difference wire एक सीधा-सादा two-input XOR gate है।",
        "Lot में मतलब: D=1 सिर्फ़ तब जब जगहें और गाड़ियाँ मेल न खाएँ (MISMATCH) - एक मौजूद, दूसरा नहीं।",
        "x=1, y=0 (जगह है, गाड़ी नहीं) → mismatch → D=1: इस column में एक जगह बच जाती है।",
        "x=0, y=1 (जगह नहीं, गाड़ी है) → mismatch → D=1: इस column में एक गाड़ी अब भी जगह माँग रही है।",
        "x=0,y=0 और x=1,y=1 दोनों MATCH हैं → D=0: इस column में कुछ नहीं बचता।",
        "XOR सार्वभौमिक 'क्या ये दो bits अलग हैं?' detector है - Difference बस यही पूछता है।"
      ],
      "transcriptEN": "The first output, the Difference, has a beautifully simple law: D equals x XOR y. In plain words, the Difference is one only when the two inputs mismatch - when one of them is present and the other isn't. Walk it through the lot. A space but no car: mismatch, so D is one, because a leftover space remains in this column. No space but a car: also a mismatch, so D is one again, because a car is still left needing a slot. Now the matches. No space and no car - both absent, they agree, nothing is left, D is zero. A space and a car - both present, the car fills the space, they cancel, D is zero. So Difference never cares about the meaning of one versus zero; it only asks the single question, 'are these two bits different?' That question is precisely what an XOR gate answers, which is why one XOR gate is the entire Difference circuit.",
      "transcriptHI": "पहला output, Difference, का नियम बेहद सरल है: D बराबर है x XOR y। सीधे शब्दों में, Difference तभी एक होता है जब दोनों inputs mismatch करें - जब एक मौजूद हो और दूसरा न हो। इसे lot में चलाइए। जगह है पर गाड़ी नहीं: mismatch, तो D एक है, क्योंकि इस column में एक बची हुई जगह रह जाती है। जगह नहीं पर गाड़ी है: यह भी mismatch, तो फिर D एक, क्योंकि एक गाड़ी अब भी slot माँग रही है। अब matches। न जगह न गाड़ी - दोनों ग़ैरहाज़िर, वे सहमत हैं, कुछ नहीं बचता, D शून्य। जगह और गाड़ी दोनों - दोनों मौजूद, गाड़ी जगह भर देती है, वे cancel हो जाते हैं, D शून्य। तो Difference को कभी एक बनाम शून्य के मतलब की परवाह नहीं; यह बस एक सवाल पूछता है, 'क्या ये दो bits अलग हैं?' यही सवाल XOR gate जवाब देता है, इसीलिए एक XOR gate ही पूरी Difference circuit है।",
      "visualNote": "Big centred 'D = x ⊕ y'. Two-by-two MATCH/MISMATCH grid with the two mismatch cells lit. Single XOR gate symbol with x,y in and D out."
    },
    {
      "id": "S06_Borrow",
      "label": "The Borrow: B = x'·y",
      "kind": "theory",
      "subtitle": "Borrow fires ONLY when there are 0 spaces but a car arrives.",
      "theoryEN": [
        "Equation: B = (NOT x) AND y, written x'·y. Note the NOT is on x, the spaces.",
        "Borrow is 1 only in 'The Catch': x=0 (no spaces) AND y=1 (a car arrives).",
        "In words: you must borrow precisely when you have nothing to give but are asked to give.",
        "Build it from two parts: invert x to get x', then AND that with y.",
        "Common trap: B is NOT x·y' (that would borrow on 'space, no car' - the Empty Spot - which is wrong).",
        "Sanity check against the table: x'·y is 1 only at the single row x=0, y=1 - exactly where B should fire."
      ],
      "theoryHI": [
        "Equation: B = (NOT x) AND y, यानी x'·y। ध्यान दें NOT, x यानी जगहों पर लगा है।",
        "Borrow सिर्फ़ 'The Catch' में 1 है: x=0 (कोई जगह नहीं) AND y=1 (एक गाड़ी आती है)।",
        "शब्दों में: borrow ठीक तब करना पड़ता है जब देने को कुछ न हो पर देने को कहा जाए।",
        "इसे दो हिस्सों से बनाइए: x को invert करके x' पाइए, फिर उसे y के साथ AND कीजिए।",
        "आम जाल (trap): B यह नहीं है x·y' (वह 'जगह है, गाड़ी नहीं' - Empty Spot - पर borrow कर देता, जो ग़लत है)।",
        "Table से जाँच: x'·y सिर्फ़ अकेली row x=0, y=1 पर 1 है - ठीक वहीं जहाँ B को जलना चाहिए।"
      ],
      "transcriptEN": "Now the famous output - the Borrow - and the one place students slip. The law is B equals NOT-x AND y, written x-prime dot y. The NOT sits on x, the spaces, and this is not negotiable. Borrow is high in exactly one situation, The Catch: there are zero free spaces, x is zero, AND a car still arrives, y is one. Put it in human terms: you are forced to borrow precisely when you have nothing left to give but someone is still demanding. To build it, you take x, run it through a NOT gate to get x-prime, then feed x-prime and y into an AND gate. Now the trap, and please tattoo this on your memory: Borrow is NOT x AND NOT-y. That wrong formula, x dot y-prime, would raise a borrow on the Empty Spot morning - a space but no car - which is absurd; you never borrow when you have room to spare. Check it against the table: x-prime dot y is one in a single row, x zero and y one, and that is the only row where the real borrow ever fires. Match the equation to that one row and you can never get it backwards.",
      "transcriptHI": "अब वह मशहूर output - Borrow - और वही एक जगह जहाँ students फिसलते हैं। नियम है B बराबर NOT-x AND y, यानी x-prime dot y। NOT, x यानी जगहों पर बैठा है, और इसमें कोई समझौता नहीं। Borrow ठीक एक स्थिति में high है, The Catch: शून्य खाली जगहें हैं, x शून्य है, AND फिर भी एक गाड़ी आती है, y एक है। इंसानी भाषा में: borrow ठीक तब करना मजबूरी है जब देने को कुछ बचा न हो पर कोई फिर भी माँग रहा हो। इसे बनाने के लिए, x को एक NOT gate से गुज़ार कर x-prime पाइए, फिर x-prime और y को एक AND gate में डालिए। अब वह जाल, और कृपया इसे याद में गुदवा लीजिए: Borrow का formula x AND NOT-y नहीं है। वह ग़लत formula, x dot y-prime, Empty Spot वाली सुबह पर borrow उठा देता - जगह है पर गाड़ी नहीं - जो बेतुका है; जब जगह फ़ालतू हो तो आप कभी borrow नहीं करते। इसे table से मिलाइए: x-prime dot y अकेली row में एक है, x शून्य और y एक, और असली borrow सिर्फ़ उसी row पर जलता है। equation को उस एक row से मिला लीजिए, फिर आप इसे कभी उलटा नहीं करेंगे।",
      "visualNote": "Big centred \"B = x'·y\". Pipeline: x → NOT → x' → into AND with y → B. Red 'WRONG ✗' badge crossing out 'x·y′'. Truth-table mini with only the x=0,y=1 row glowing."
    },
    {
      "id": "S07_Circuit",
      "label": "The Blueprint",
      "kind": "circuit",
      "subtitle": "Two gates, two wires: the complete half subtractor.",
      "theoryEN": [
        "The whole circuit is just two outputs wired from the same two inputs x and y.",
        "Difference path: x and y into one XOR gate → D = x ⊕ y.",
        "Borrow path: x into a NOT gate → x', then x' and y into an AND gate → B = x'·y.",
        "Total gate count: one XOR, one NOT (inverter), one AND. That's the full half subtractor.",
        "Both paths share the same input wires x and y - they just read them differently.",
        "Compare to the half adder (XOR for sum, AND for carry): the subtractor adds one inverter on x for the borrow."
      ],
      "theoryHI": [
        "पूरी circuit बस दो outputs है, जो उन्हीं दो inputs x और y से wire किए गए हैं।",
        "Difference path: x और y एक XOR gate में → D = x ⊕ y।",
        "Borrow path: x एक NOT gate में → x', फिर x' और y एक AND gate में → B = x'·y।",
        "कुल gate गिनती: एक XOR, एक NOT (inverter), एक AND। यही पूरा half subtractor है।",
        "दोनों paths वही input wires x और y साझा करते हैं - बस उन्हें अलग ढंग से पढ़ते हैं।",
        "Half adder से तुलना (sum के लिए XOR, carry के लिए AND): subtractor borrow के लिए x पर एक inverter जोड़ देता है।"
      ],
      "transcriptEN": "Time to draw the machine. It's smaller than you'd fear. Two inputs come in, x and y, and they fan out to two independent little circuits. The top branch is the Difference: route x and y straight into a single XOR gate, and its output is D. The bottom branch is the Borrow: first send x through a NOT gate to flip it into x-prime, then take that x-prime together with the original y into an AND gate, and its output is B. Count the hardware - one XOR, one inverter, one AND - three gates, and you've built a complete half subtractor. Here's a memory hook: it's almost identical to the half adder, which uses XOR for its sum and AND for its carry. The subtractor reuses the very same XOR and AND; the only structural difference is that single NOT gate slipped onto x before the AND. Add an inverter, and an adder's carry logic becomes a subtractor's borrow logic.",
      "transcriptHI": "अब machine बनाने का वक़्त। यह जितना डरते हैं उससे छोटी है। दो inputs आते हैं, x और y, और वे दो स्वतंत्र छोटी circuits में बँट जाते हैं। ऊपरी शाखा है Difference: x और y को सीधे एक XOR gate में भेजिए, और उसका output है D। निचली शाखा है Borrow: पहले x को एक NOT gate से भेज कर x-prime में पलटिए, फिर उस x-prime को मूल y के साथ एक AND gate में लीजिए, और उसका output है B। hardware गिनिए - एक XOR, एक inverter, एक AND - तीन gates, और आपने पूरा half subtractor बना लिया। एक याद रखने का सूत्र: यह लगभग half adder जैसा ही है, जो अपने sum के लिए XOR और carry के लिए AND इस्तेमाल करता है। Subtractor वही XOR और AND दोबारा वापरता है; एकमात्र संरचनात्मक अंतर है AND से पहले x पर खिसकाया गया वह एक NOT gate। एक inverter जोड़िए, और adder की carry logic, subtractor की borrow logic बन जाती है।",
      "visualNote": "Schematic: x,y on the left rail. Top: XOR → D. Bottom: x → NOT(inverter triangle+bubble) → x', then (x',y) → AND → B. Side note 'vs half adder: +1 inverter on x'."
    },
    {
      "id": "S08_Activity",
      "label": "Run The Lot",
      "kind": "activity",
      "subtitle": "Toggle x and y, watch the parking lot and the D, B outputs respond live.",
      "theoryEN": [
        "Interactive: two toggles, x (empty spaces) and y (arriving cars), each 0 or 1.",
        "Live outputs update instantly: D = x ⊕ y and B = x'·y.",
        "Set x=1, y=1 (Perfect Match): the car parks, watch D and B both fall to 0.",
        "Set x=0, y=1 (The Catch): no room - watch B jump to 1 and a car get borrowed from the next lot.",
        "Challenge: find the ONLY input combination that lights the Borrow lamp (answer: 0,1).",
        "Confirm the trap: try x=1, y=0 and verify B stays 0 - having a free space never forces a borrow."
      ],
      "theoryHI": [
        "Interactive: दो toggles, x (खाली जगहें) और y (आती गाड़ियाँ), हर एक 0 या 1।",
        "Live outputs तुरंत update होते हैं: D = x ⊕ y और B = x'·y।",
        "x=1, y=1 रखिए (Perfect Match): गाड़ी park होती है, देखिए D और B दोनों 0 हो जाते हैं।",
        "x=0, y=1 रखिए (The Catch): जगह नहीं - देखिए B 1 पर कूदता है और एक गाड़ी अगले lot से borrow होती है।",
        "Challenge: वह एकमात्र input combination ढूँढिए जो Borrow lamp जलाता है (उत्तर: 0,1)।",
        "Trap की पुष्टि: x=1, y=0 आज़माइए और जाँचिए B 0 पर ही रहता है - खाली जगह होना कभी borrow नहीं करवाता।"
      ],
      "transcriptEN": "Your turn to run Adarsh's lot. You've got two switches - x for empty spaces, y for arriving cars - and two lamps that update the instant you flip anything, one for the Difference and one for the Borrow. Start safe: set both to one, the Perfect Match, and watch the car slot in while both lamps go dark, D and B at zero. Now create trouble: drop x to zero but keep y at one - that's The Catch - and watch the Borrow lamp snap on as a little car gets handed off to the next lot. Here's your challenge: hunt for every combination that lights the Borrow lamp, and convince yourself there is exactly one, x equals zero with y equals one. Then close the loop on the classic mistake: set x to one and y to zero - a free space, no car - and watch the Borrow lamp stay stubbornly off. Having room to spare never, ever forces a borrow. Feel that in your fingers and the equation x-prime dot y is yours for life.",
      "transcriptHI": "अब आपकी बारी है Adarsh की lot चलाने की। आपके पास दो switches हैं - x खाली जगहों के लिए, y आती गाड़ियों के लिए - और दो lamps जो आपके कुछ भी पलटते ही update होते हैं, एक Difference के लिए और एक Borrow के लिए। सुरक्षित शुरुआत: दोनों को एक कीजिए, Perfect Match, और देखिए गाड़ी slot में बैठती है जबकि दोनों lamps बुझ जाते हैं, D और B शून्य पर। अब परेशानी पैदा कीजिए: x को शून्य कीजिए पर y एक रखिए - यह है The Catch - और देखिए Borrow lamp झट से जल उठता है जैसे एक नन्ही गाड़ी अगले lot को सौंप दी जाए। आपकी चुनौती: हर वह combination खोजिए जो Borrow lamp जलाता है, और ख़ुद को यक़ीन दिलाइए कि ठीक एक ही है, x बराबर शून्य और y बराबर एक। फिर classic ग़लती पर लूप बंद कीजिए: x को एक और y को शून्य कीजिए - खाली जगह, कोई गाड़ी नहीं - और देखिए Borrow lamp ज़िद्दी की तरह बुझा रहता है। जगह फ़ालतू होना कभी, कभी भी borrow नहीं करवाता। इसे उँगलियों में महसूस कर लीजिए और equation x-prime dot y ज़िंदगी भर के लिए आपका हो जाएगा।",
      "visualNote": "Interactive sandbox: lot top-view reacting to two toggles. D lamp (cyan) and B lamp (rose). Live readout 'x=_ y=_ → D=_ B=_' and the current scenario name."
    },
    {
      "id": "S09_Flashcards",
      "label": "Flashcards",
      "kind": "flashcards",
      "subtitle": "Eight flip-cards to lock the half subtractor into memory.",
      "theoryEN": [
        "Use these to drill the two equations and the single borrow condition until they're automatic.",
        "Cover the back, recall, then flip - especially for the x'·y card.",
        "If you only memorise two things, make them D = x⊕y and B = x'·y."
      ],
      "theoryHI": [
        "इनसे दोनों equations और एकमात्र borrow condition को तब तक रटिए जब तक वे अपने-आप न आ जाएँ।",
        "पीछे का हिस्सा ढककर याद कीजिए, फिर पलटिए - ख़ासकर x'·y वाले card के लिए।",
        "अगर सिर्फ़ दो चीज़ें याद रखनी हों, तो वे हों D = x⊕y और B = x'·y।"
      ],
      "transcriptEN": "Eight quick flip-cards to cement everything. Front asks, back answers - cover the back, say your answer out loud, then flip to check. Give extra reps to the borrow card, because that x-prime dot y is the one the exam loves to trip you on.",
      "transcriptHI": "सब कुछ पक्का करने के लिए आठ झटपट flip-cards। आगे सवाल, पीछे जवाब - पीछे का हिस्सा ढककर अपना जवाब बोलिए, फिर जाँचने के लिए पलटिए। Borrow वाले card को ज़्यादा बार दोहराइए, क्योंकि वही x-prime dot y है जिस पर exam आपको गिराना पसंद करता है।",
      "visualNote": "Standard FlashCardDeck (watermarked, shareable). Eight cards from the flashcards array."
    },
    {
      "id": "S10_Quiz",
      "label": "Quiz Arena",
      "kind": "quiz",
      "subtitle": "Six questions - prove you can read D and especially B.",
      "theoryEN": [
        "Six multiple-choice questions covering inputs, outputs, the two equations, and the borrow trap.",
        "At least two questions specifically test when Borrow fires - read x and y carefully.",
        "Aim for full marks before moving on to the full subtractor."
      ],
      "theoryHI": [
        "छह bahu-vikalp (multiple-choice) सवाल - inputs, outputs, दोनों equations और borrow trap पर।",
        "कम से कम दो सवाल ख़ासतौर पर जाँचते हैं कि Borrow कब जलता है - x और y ध्यान से पढ़िए।",
        "Full subtractor पर बढ़ने से पहले पूरे अंक लाने का लक्ष्य रखिए।"
      ],
      "transcriptEN": "Six questions in the arena. They cover the variables, both equations, and they will absolutely probe whether you really know when the Borrow fires versus when it stays quiet. Read x and y slowly on the borrow questions - the wrong answers are the common mistakes dressed up to look right. Try to clear all six before you meet the full subtractor.",
      "transcriptHI": "Arena में छह सवाल। ये variables, दोनों equations को कवर करते हैं, और ज़रूर परखेंगे कि आप सचमुच जानते हैं Borrow कब जलता है बनाम कब चुप रहता है। borrow वाले सवालों पर x और y धीरे पढ़िए - ग़लत विकल्प आम ग़लतियों को सही दिखने के भेस में रखते हैं। Full subtractor से मिलने से पहले छहों साफ़ करने की कोशिश कीजिए।",
      "visualNote": "Parameterized QuizArena fed by the quiz array."
    },
    {
      "id": "S11_Recap",
      "label": "Recap & The Amnesia Problem",
      "kind": "recap",
      "subtitle": "What you mastered - and the one flaw that demands a full subtractor.",
      "theoryEN": [
        "Half subtractor computes x − y on one bit, outputting D = x⊕y and B = x'·y.",
        "Difference fires on MISMATCH (XOR); Borrow fires ONLY at x=0, y=1 (The Catch).",
        "Circuit = one XOR + one NOT-on-x + one AND. Three gates, two outputs.",
        "The flaw: the half subtractor is 'amnesic' - it has no input for a borrow coming IN from a previous column.",
        "Real multi-bit subtraction passes a borrow from column to column; a half subtractor can't accept one.",
        "Next module: the FULL subtractor adds a borrow-in (Bin) so columns can be chained - curing the amnesia."
      ],
      "theoryHI": [
        "Half subtractor एक bit पर x − y निकालता है, outputs D = x⊕y और B = x'·y।",
        "Difference MISMATCH पर जलता है (XOR); Borrow सिर्फ़ x=0, y=1 पर (The Catch)।",
        "Circuit = एक XOR + x पर एक NOT + एक AND। तीन gates, दो outputs।",
        "कमी: half subtractor 'भुलक्कड़' (amnesic) है - इसमें पिछले column से अंदर आते borrow के लिए कोई input नहीं है।",
        "असली multi-bit subtraction borrow को column-दर-column pass करती है; half subtractor एक को स्वीकार ही नहीं कर सकता।",
        "अगला module: FULL subtractor एक borrow-in (Bin) जोड़ता है ताकि columns chain हो सकें - amnesia का इलाज।"
      ],
      "transcriptEN": "Let's bank what you own now. A half subtractor takes two single bits and computes x minus y, handing back two wires: the Difference, D equals x XOR y, high on mismatch; and the Borrow, B equals x-prime dot y, high in one and only one case - zero spaces yet a car arrives. The hardware is three gates: an XOR, a NOT on x, and an AND. Clean, complete, done. But here's the catch that sends us to the next module. Real subtraction of multi-bit numbers works column by column, and when one column borrows, the very next column must accept that borrow coming IN. Our half subtractor has no wire for that - it can produce a borrow-out, but it cannot receive a borrow-in. It is, in a word, amnesic: it forgets there was ever a column before it. To chain columns and subtract real numbers, we need a third input, a borrow-in, and that upgraded circuit is the full subtractor - exactly where we head next.",
      "transcriptHI": "अब जो आपके पास है उसे जमा कर लें। Half subtractor दो single bits लेता है और x minus y निकालता है, दो wires लौटाते हुए: Difference, D बराबर x XOR y, mismatch पर high; और Borrow, B बराबर x-prime dot y, सिर्फ़ और सिर्फ़ एक case में high - शून्य जगहें पर फिर भी गाड़ी आ जाए। hardware तीन gates है: एक XOR, x पर एक NOT, और एक AND। साफ़, पूरा, ख़त्म। पर यही वह catch है जो हमें अगले module की ओर भेजता है। multi-bit संख्याओं की असली subtraction column दर column चलती है, और जब एक column borrow करता है, तो ठीक अगले column को वह अंदर आता borrow स्वीकार करना ही पड़ता है। हमारे half subtractor में इसके लिए कोई wire नहीं - यह borrow-out पैदा कर सकता है, पर borrow-in ले नहीं सकता। यह, एक शब्द में, भुलक्कड़ (amnesic) है: यह भूल जाता है कि इससे पहले कोई column था भी। columns को chain करने और असली संख्याएँ घटाने के लिए हमें एक तीसरा input चाहिए, एक borrow-in, और वही उन्नत circuit है full subtractor - ठीक वहीं जहाँ हम आगे जाते हैं।",
      "visualNote": "Two-column recap card (equations + circuit on left, 'The Amnesia Problem' on right). Teaser tile: a half subtractor with a greyed-out missing 'Bin' input port and an arrow to 'FULL SUBTRACTOR →'."
    }
  ],
  "flashcards": [
    {
      "frontEN": "What does a half subtractor compute, and from which two inputs?",
      "backEN": "It computes x − y on single bits. x = minuend (empty spaces), y = subtrahend (arriving cars).",
      "frontHI": "Half subtractor क्या निकालता है, और किन दो inputs से?",
      "backHI": "यह single bits पर x − y निकालता है। x = minuend (खाली जगहें), y = subtrahend (आती गाड़ियाँ)।"
    },
    {
      "frontEN": "Name the two outputs of a half subtractor and what each means in the lot.",
      "backEN": "D = Difference (the on-the-ground result) and B = Borrow (a car borrowed from the next lot).",
      "frontHI": "Half subtractor के दो outputs के नाम और lot में हर एक का मतलब?",
      "backHI": "D = Difference (ज़मीनी नतीजा) और B = Borrow (अगले lot से borrow की गई गाड़ी)।"
    },
    {
      "frontEN": "Write the equation for the Difference output.",
      "backEN": "D = x XOR y. Difference is 1 only when x and y MISMATCH.",
      "frontHI": "Difference output का equation लिखिए।",
      "backHI": "D = x XOR y। Difference तभी 1 है जब x और y में MISMATCH हो।"
    },
    {
      "frontEN": "Write the equation for the Borrow output.",
      "backEN": "B = (NOT x) AND y = x'·y. The NOT is on x (the spaces).",
      "frontHI": "Borrow output का equation लिखिए।",
      "backHI": "B = (NOT x) AND y = x'·y। NOT, x (जगहों) पर लगा है।"
    },
    {
      "frontEN": "Under exactly which input condition does Borrow = 1?",
      "backEN": "Only when x = 0 and y = 1 - zero spaces but a car arrives ('The Catch').",
      "frontHI": "ठीक किस input condition पर Borrow = 1 होता है?",
      "backHI": "सिर्फ़ तब जब x = 0 और y = 1 - शून्य जगहें पर एक गाड़ी आ जाए ('The Catch')।"
    },
    {
      "frontEN": "Why is B = x·y' (x AND NOT-y) wrong for the borrow?",
      "backEN": "It would borrow on x=1, y=0 (a free space, no car) - absurd; you never borrow when you have room. Correct is x'·y.",
      "frontHI": "Borrow के लिए B = x·y' (x AND NOT-y) ग़लत क्यों है?",
      "backHI": "यह x=1, y=0 (खाली जगह, कोई गाड़ी नहीं) पर borrow कर देता - बेतुका; जगह होने पर कभी borrow नहीं करते। सही है x'·y।"
    },
    {
      "frontEN": "List the gates in a complete half subtractor.",
      "backEN": "One XOR (for D), one NOT/inverter on x, and one AND (for B). Three gates total.",
      "frontHI": "पूरे half subtractor में कौन-कौन से gates होते हैं?",
      "backHI": "एक XOR (D के लिए), x पर एक NOT/inverter, और एक AND (B के लिए)। कुल तीन gates।"
    },
    {
      "frontEN": "Why is the half subtractor called 'amnesic', and what fixes it?",
      "backEN": "It has no borrow-in input, so it can't accept a borrow from a previous column. The full subtractor adds a Bin input to fix it.",
      "frontHI": "Half subtractor को 'भुलक्कड़' (amnesic) क्यों कहते हैं, और इसका इलाज क्या है?",
      "backHI": "इसमें borrow-in input नहीं है, इसलिए यह पिछले column से borrow स्वीकार नहीं कर सकता। Full subtractor एक Bin input जोड़कर इसे ठीक करता है।"
    }
  ],
  "quiz": [
    {
      "questionEN": "In Adarsh's parking analogy, what does the input x (the minuend) represent?",
      "options": [
        "The number of empty parking spaces available",
        "The number of cars arriving at the gate",
        "The car borrowed from the next lot",
        "The total capacity of the lot"
      ],
      "answerIndex": 0,
      "explainEN": "x is the minuend - the number of empty spaces Adarsh starts with. y (subtrahend) is the arriving cars.",
      "explainHI": "x minuend है - Adarsh के पास शुरू में जितनी खाली जगहें होती हैं। y (subtrahend) आती गाड़ियाँ हैं।",
      "questionHI": "Adarsh की parking वाली analogy में input x (minuend) किसका प्रतिनिधित्व करता है?"
    },
    {
      "questionEN": "Which equation correctly gives the Difference output D?",
      "options": [
        "D = x AND y",
        "D = x XOR y",
        "D = (NOT x) AND y",
        "D = x OR y"
      ],
      "answerIndex": 1,
      "explainEN": "D = x XOR y. The Difference is 1 only when x and y mismatch (one present, the other absent).",
      "explainHI": "D = x XOR y। Difference तभी 1 है जब x और y mismatch करें (एक मौजूद, दूसरा ग़ैरहाज़िर)।",
      "questionHI": "कौन सा equation Difference output D को सही देता है?"
    },
    {
      "questionEN": "For inputs x = 0, y = 1 ('The Catch'), what are the outputs D and B?",
      "options": [
        "D = 0, B = 0",
        "D = 1, B = 0",
        "D = 1, B = 1",
        "D = 0, B = 1"
      ],
      "answerIndex": 2,
      "explainEN": "No spaces but a car arrives: a borrow is taken from the next lot, so B = 1, and a car still needs placing, so D = 1.",
      "explainHI": "कोई जगह नहीं पर गाड़ी आ जाती है: अगले lot से borrow लिया जाता है, इसलिए B = 1, और एक गाड़ी अब भी जगह माँगती है, इसलिए D = 1।",
      "questionHI": "inputs x = 0, y = 1 ('The Catch') के लिए outputs D और B क्या होंगे?"
    },
    {
      "questionEN": "Under which single input combination does the Borrow output B equal 1?",
      "options": [
        "x = 1, y = 0",
        "x = 1, y = 1",
        "x = 0, y = 0",
        "x = 0, y = 1"
      ],
      "answerIndex": 3,
      "explainEN": "Borrow = x'·y is high only when x = 0 (no spaces) AND y = 1 (a car arrives). That is the only row where B = 1.",
      "explainHI": "Borrow = x'·y सिर्फ़ तब high है जब x = 0 (कोई जगह नहीं) AND y = 1 (गाड़ी आती है)। यही एकमात्र row है जहाँ B = 1।",
      "questionHI": "किस एकमात्र input combination पर Borrow output B बराबर 1 होता है?"
    },
    {
      "questionEN": "A student writes B = x·y' (x AND NOT-y) for the borrow. Why is this wrong?",
      "options": [
        "It is actually correct and equivalent to x'·y",
        "It would raise a borrow on x=1, y=0 (a free space, no car), which never needs a borrow",
        "It always outputs 1 regardless of inputs",
        "It computes the Difference, not the Borrow"
      ],
      "answerIndex": 1,
      "explainEN": "x·y' is 1 at x=1, y=0 - a free space with no car - where you'd never borrow. The correct borrow is B = x'·y, high only at x=0, y=1.",
      "explainHI": "x·y' का मान x=1, y=0 पर 1 है - खाली जगह, कोई गाड़ी नहीं - जहाँ कभी borrow नहीं होता। सही borrow है B = x'·y, जो सिर्फ़ x=0, y=1 पर high है।",
      "questionHI": "एक student borrow के लिए B = x·y' (x AND NOT-y) लिखता है। यह ग़लत क्यों है?"
    },
    {
      "questionEN": "Why can't a single half subtractor be chained to subtract multi-bit numbers, and what cures this?",
      "options": [
        "It lacks a Difference output; the full adder cures it",
        "It has too many gates; removing the XOR cures it",
        "It has no borrow-in input ('amnesic'); the full subtractor adds a Bin input",
        "It only works for addition; an OR gate cures it"
      ],
      "answerIndex": 2,
      "explainEN": "The half subtractor produces a borrow-out but has no input to ACCEPT a borrow from a previous column - it is amnesic. The full subtractor adds a borrow-in (Bin) so columns can be chained.",
      "explainHI": "Half subtractor borrow-out पैदा करता है पर पिछले column से borrow स्वीकार करने के लिए कोई input नहीं रखता - यह भुलक्कड़ (amnesic) है। Full subtractor एक borrow-in (Bin) जोड़ता है ताकि columns chain हो सकें।",
      "questionHI": "अकेला half subtractor multi-bit संख्याओं को घटाने के लिए chain क्यों नहीं हो सकता, और इसका इलाज क्या है?"
    }
  ]
}) as unknown as SubContent;
