import type { SubContent } from '../_subtractor/kit';

export const CONTENT = ({
  "moduleTitle": "The Calculator Illusion - How Computers Subtract",
  "moduleSubtitle": "Recall the adder, then discover the grand deception: a CPU never subtracts - it adds a negative number in disguise.",
  "scenes": [
    {
      "id": "S00_Cover",
      "label": "The Calculator Illusion",
      "kind": "cover",
      "subtitle": "Recall & Big Idea - opening the Subtractor Track",
      "theoryEN": [
        "Your calculator has no 'subtract' machine inside it. Press minus, and it secretly adds.",
        "This module recalls the adder you already built, then reveals the one trick that powers every subtraction in every CPU on Earth.",
        "Big idea in one line: A − B is never computed. The hardware computes A + (NOT B) + 1 instead.",
        "Recall hooks you will lean on: the XOR gate, the half adder (sum = a ^ b), the full adder (sum = a ^ b ^ cin, carry = majority), and the idea of borrow vs carry.",
        "By the end you will see how a single Mode bit M turns the very same adder into a subtractor - no new arithmetic hardware at all."
      ],
      "theoryHI": [
        "आपके calculator के अंदर कोई अलग 'subtract' मशीन नहीं होती। minus दबाते ही वह चुपके से जोड़ (add) कर देता है।",
        "यह module पहले उस adder को recall कराता है जो आपने बनाया था, फिर वह एक trick दिखाता है जो दुनिया के हर CPU की हर subtraction चलाती है।",
        "मुख्य विचार एक लाइन में: A − B कभी सीधे निकाला ही नहीं जाता। Hardware उसकी जगह A + (NOT B) + 1 निकालता है।",
        "जिन recall hooks पर हम टिकेंगे: XOR gate, half adder (sum = a ^ b), full adder (sum = a ^ b ^ cin, carry = majority), और borrow बनाम carry का अंतर।",
        "अंत तक आप देखेंगे कि एक अकेला Mode bit M उसी adder को subtractor बना देता है - कोई नया arithmetic hardware लगता ही नहीं।"
      ],
      "transcriptEN": "Welcome back. You already know how to add - you built the half adder and the full adder with your own hands. Now I am going to show you a secret that most engineers use every day without ever noticing. When your phone, your calculator, or a giant server CPU subtracts two numbers, there is no subtractor doing the work. The minus sign is an illusion. Behind the screen, the machine quietly reuses the exact adder you already understand. In this opening lesson we recall that adder, then reveal the single elegant trick - two's complement and one Mode bit - that lets the same hardware both add and subtract. Hold on to one sentence: A minus B is really A plus the negative of B.",
      "transcriptHI": "वापस स्वागत है। आप जोड़ना तो जानते ही हैं - आपने half adder और full adder अपने हाथों से बनाया है। अब मैं आपको एक राज़ दिखाऊँगा जिसे ज़्यादातर engineers रोज़ इस्तेमाल करते हैं पर कभी ध्यान नहीं देते। जब आपका phone, calculator, या कोई बड़ा server CPU दो numbers को subtract करता है, तो असल में कोई subtractor काम ही नहीं कर रहा होता। वह minus का चिह्न एक illusion है। screen के पीछे मशीन चुपचाप वही adder दोबारा इस्तेमाल करती है जिसे आप पहले से समझते हैं। इस पहले lesson में हम उस adder को recall करेंगे, फिर वह एक खूबसूरत trick दिखाएँगे - two's complement और एक Mode bit - जो उसी hardware से जोड़ भी कराता है और घटा भी। एक वाक्य याद रखिए: A minus B असल में A plus B का negative है।",
      "visualNote": "Cover: a calculator with the minus key glowing, and a translucent reveal behind it showing an adder block + an XOR row + a small 'M' switch. Recall chips for XOR, half adder, full adder float along the bottom."
    },
    {
      "id": "S01_Video",
      "label": "Video - How Computers Subtract",
      "kind": "video",
      "subtitle": "Lesson lecture: the trick behind every minus sign",
      "theoryEN": [
        "Watch the lesson 'How Computers Subtract' (file: How_Computers_Subtract.mp4) before the deep dive.",
        "It frames the central claim: subtraction is addition in disguise - the CPU adds a negative number.",
        "It walks the three steps of two's complement: invert B, add 1, then add to A.",
        "It introduces the Mode bit M: M = 0 makes the unit add, M = 1 makes it subtract.",
        "Watch for the XOR row sitting in front of B - that controlled inverter is the whole secret made physical.",
        "Keep the recall in mind: every Sum bit is still just a ^ b ^ cin from your full adder."
      ],
      "theoryHI": [
        "गहराई में जाने से पहले lesson 'How Computers Subtract' देखें (file: How_Computers_Subtract.mp4)।",
        "यह मुख्य दावा रखता है: subtraction असल में छुपी हुई addition है - CPU एक negative number जोड़ता है।",
        "यह two's complement के तीन steps दिखाता है: B को invert करो, 1 जोड़ो, फिर A में जोड़ो।",
        "यह Mode bit M से परिचय कराता है: M = 0 पर unit जोड़ता है, M = 1 पर वही unit घटाता है।",
        "B के सामने बैठी XOR row पर ध्यान दें - वही controlled inverter पूरा राज़ है, hardware में साकार।",
        "Recall याद रखें: हर Sum bit अब भी आपके full adder वाला a ^ b ^ cin ही है।"
      ],
      "transcriptEN": "In this video the idea lands in plain words: a computer does not know how to subtract. It only knows how to add. So when you ask it for A minus B, it performs a small magic trick. First it flips every bit of B - every 1 becomes 0 and every 0 becomes 1. Then it adds 1 to that flipped value. That two-step recipe is called taking the two's complement, and it produces the negative of B. Finally it feeds A and this negative-B into the ordinary adder you already built. Out comes A minus B, computed entirely by addition. The video also shows the one control wire that decides the machine's mood: the Mode bit M. Leave M at 0 and the unit adds; raise M to 1 and the very same unit subtracts. Watch closely how M reaches both the carry-in and a row of XOR gates - that is the hinge everything turns on.",
      "transcriptHI": "इस video में बात बिल्कुल साफ़ शब्दों में आती है: computer को subtract करना आता ही नहीं। उसे सिर्फ़ add करना आता है। तो जब आप उससे A minus B माँगते हैं, वह एक छोटा सा जादू करता है। पहले वह B के हर bit को flip कर देता है - हर 1 बन जाता है 0 और हर 0 बन जाता है 1। फिर उस flipped value में 1 जोड़ देता है। इस दो-कदम वाली recipe को two's complement लेना कहते हैं, और इससे B का negative बनता है। आख़िर में वह A और इस negative-B को उसी साधारण adder में डालता है जिसे आप पहले से बना चुके हैं। बाहर आता है A minus B, पूरी तरह सिर्फ़ addition से निकला हुआ। video उस एक control wire को भी दिखाता है जो मशीन का मिज़ाज तय करती है: Mode bit M। M को 0 रखो तो unit जोड़ता है; M को 1 कर दो तो वही unit घटाता है। ध्यान से देखिए कि M कैसे carry-in तक और XOR gates की एक row तक पहुँचता है - वही वह कब्ज़ा है जिस पर सब कुछ घूमता है।",
      "visualNote": "Embed How_Computers_Subtract.mp4 with chapter markers: 'The lie', 'Flip the bits', 'Add one', 'Reuse the adder', 'The mode switch M'."
    },
    {
      "id": "S02_Deception",
      "label": "The Grand Deception",
      "kind": "theory",
      "subtitle": "A CPU does not know how to subtract",
      "theoryEN": [
        "There is no subtractor circuit inside a normal ALU. The arithmetic hardware can only add.",
        "Subtraction is addition in disguise: to do A − B, the machine adds A and the negative of B.",
        "The same adder you built - the row of full adders - is reused for both jobs. Nothing is duplicated.",
        "This is a deliberate design win: one piece of hardware doing two jobs means a smaller, cheaper, faster chip.",
        "So the question changes shape. Instead of 'how do we subtract?', engineers ask 'how do we make a negative number to add?'.",
        "The answer to that question is two's complement - the subject of the next scene."
      ],
      "theoryHI": [
        "एक सामान्य ALU के अंदर कोई subtractor circuit होता ही नहीं। arithmetic hardware सिर्फ़ जोड़ सकता है।",
        "Subtraction छुपी हुई addition है: A − B करने के लिए मशीन A और B का negative जोड़ देती है।",
        "वही adder जो आपने बनाया - full adders की row - दोनों कामों के लिए दोबारा इस्तेमाल होती है। कुछ भी duplicate नहीं होता।",
        "यह एक सोची-समझी design जीत है: एक ही hardware का दो काम करना यानी छोटा, सस्ता और तेज़ chip।",
        "तो सवाल का रूप बदल जाता है। 'हम subtract कैसे करें?' की जगह engineers पूछते हैं 'जोड़ने के लिए negative number कैसे बनाएँ?'।",
        "उस सवाल का जवाब है two's complement - जो अगली scene का विषय है।"
      ],
      "transcriptEN": "Let us name the deception clearly. Inside the arithmetic core of a CPU there is no machine that subtracts. There is only an adder - the same chain of full adders you built, each computing sum equals a XOR b XOR carry-in. So how does the chip ever show you a smaller answer on the screen? It cheats, beautifully. Instead of inventing a second circuit just for minus, the designers asked a smarter question. Subtracting B is the same as adding negative B. If we can build the negative of B using only logic gates, then subtraction collapses into addition, and one adder serves both purposes. This is not laziness - it is elegance. One block, two jobs, less silicon, lower cost, higher speed. The whole problem of subtraction has now turned into a single new problem: how do we represent a negative number in binary so the adder just works? Hold that thought.",
      "transcriptHI": "आइए इस deception को साफ़-साफ़ नाम दें। CPU के arithmetic core के अंदर कोई मशीन subtract नहीं करती। वहाँ सिर्फ़ एक adder है - वही full adders की chain जो आपने बनाई, हर एक sum equals a XOR b XOR carry-in निकालता हुआ। तो फिर chip आपको screen पर छोटा जवाब दिखाता कैसे है? वह बेहद ख़ूबसूरती से चालाकी करता है। minus के लिए दूसरा circuit बनाने की बजाय designers ने एक समझदार सवाल पूछा। B को घटाना वही है जो negative B को जोड़ना। अगर हम सिर्फ़ logic gates से B का negative बना लें, तो subtraction सिमटकर addition बन जाता है, और एक ही adder दोनों काम कर देता है। यह आलस नहीं है - यह elegance है। एक block, दो काम, कम silicon, कम लागत, ज़्यादा speed। अब subtraction की पूरी समस्या एक नई समस्या में बदल गई है: हम binary में negative number को इस तरह कैसे दिखाएँ कि adder अपने-आप सही चले? यह बात पकड़े रखिए।",
      "visualNote": "Split panel: left shows a row of full adders labelled 'the only arithmetic hardware'; right shows a crossed-out subtractor block with a red 'does not exist' stamp. Arrow loops from the subtractor X back into the adder."
    },
    {
      "id": "S03_TwosComplement",
      "label": "Two's Complement - The Negative Maker",
      "kind": "theory",
      "subtitle": "A − B = A + (NOT B) + 1",
      "theoryEN": [
        "To compute A − B, never use a minus sign. Build the negative of B instead, in two cheap steps.",
        "Step 1 - invert: flip every bit of B. This is the one's complement, NOT B. Every 1 → 0, every 0 → 1.",
        "Step 2 - add one: add 1 to NOT B. Now you have the two's complement, which equals −B.",
        "Step 3 - add: feed A + (NOT B) + 1 into the ordinary adder. The result is exactly A − B.",
        "So the master formula is: A − B = A + (NOT B) + 1. No subtraction anywhere - only inversion and addition.",
        "Worked example (4-bit): A = 7 (0111), B = 5 (0101). NOT B = 1010. A + 1010 + 1 = 0111 + 1010 + 1 = 10010. Drop the carry-out → 0010 = 2. And 7 − 5 = 2."
      ],
      "theoryHI": [
        "A − B निकालने के लिए minus का चिह्न कभी इस्तेमाल मत करिए। उसकी जगह B का negative बनाइए, दो सस्ते steps में।",
        "Step 1 - invert: B के हर bit को flip करो। यही one's complement है, यानी NOT B। हर 1 → 0, हर 0 → 1।",
        "Step 2 - add one: NOT B में 1 जोड़ो। अब आपके पास two's complement है, जो −B के बराबर है।",
        "Step 3 - add: A + (NOT B) + 1 को साधारण adder में डालो। नतीजा बिल्कुल A − B होता है।",
        "तो मुख्य सूत्र है: A − B = A + (NOT B) + 1। कहीं कोई subtraction नहीं - सिर्फ़ inversion और addition।",
        "हल किया हुआ उदाहरण (4-bit): A = 7 (0111), B = 5 (0101)। NOT B = 1010। A + 1010 + 1 = 0111 + 1010 + 1 = 10010। carry-out छोड़ दो → 0010 = 2। और 7 − 5 = 2।"
      ],
      "transcriptEN": "Here is the recipe that makes the whole illusion work, and it has exactly three steps. Suppose you want seven minus five. Step one: take B, which is five - in four bits that is 0101 - and invert every single bit. Ones become zeros, zeros become ones, so you get 1010. That flipped value is called the one's complement, or simply NOT B. Step two: add one to it. 1010 plus 1 is 1011. This is the two's complement, and it is the binary way of writing negative five. Step three: hand A and this negative-five to your adder. Seven is 0111; add 1010 and the extra plus-one, and the adder produces 10010. Throw away the carry that falls off the top, and you are left with 0010, which is two. Seven minus five equals two - and notice we never subtracted anything. We inverted, we added one, we added. That is the entire formula: A minus B equals A plus NOT B plus one.",
      "transcriptHI": "यह रही वह recipe जो पूरे illusion को चलाती है, और इसमें ठीक तीन steps हैं। मान लीजिए आपको सात में से पाँच घटाना है। Step एक: B लो, जो पाँच है - चार bits में 0101 - और हर एक bit को invert करो। एक शून्य बन जाते हैं, शून्य एक बन जाते हैं, तो मिलता है 1010। उस flipped value को one's complement कहते हैं, या सीधे NOT B। Step दो: उसमें 1 जोड़ो। 1010 plus 1 है 1011। यही two's complement है, और यही negative पाँच को binary में लिखने का तरीक़ा है। Step तीन: A और इस negative-पाँच को अपने adder को सौंप दो। सात है 0111; उसमें 1010 और वह extra plus-one जोड़ो, तो adder देता है 10010। ऊपर से गिरने वाली carry को फेंक दो, बचता है 0010, यानी दो। सात minus पाँच बराबर दो - और ध्यान दीजिए, हमने कुछ subtract किया ही नहीं। हमने invert किया, एक जोड़ा, फिर जोड़ा। यही पूरा सूत्र है: A minus B बराबर A plus NOT B plus one।",
      "visualNote": "Animated 4-bit example: B=0101 → invert to 1010 → +1 → 1011, then a column addition of 0111 + 1010 + 1 showing the carry-out being discarded and result 0010 highlighted = 2."
    },
    {
      "id": "S04_ModeBit",
      "label": "The Mode Bit M - One Circuit, Two Jobs",
      "kind": "truth",
      "subtitle": "M = 0 adds · M = 1 subtracts",
      "theoryEN": [
        "One control line, the Mode bit M, decides whether the unit adds or subtracts.",
        "M = 0 → the unit ADDS. The B bits pass through unchanged and the carry-in is 0, so you get plain A + B.",
        "M = 1 → the unit SUBTRACTS. The B bits get inverted and the carry-in is 1, giving A + (NOT B) + 1 = A − B.",
        "The clever part: M is wired to the carry-in. M = 1 IS the '+1' of two's complement - the same wire does both jobs.",
        "Truth of the design: invert-B is controlled by M, and the '+1' is also controlled by M. One bit triggers both halves of the two's-complement recipe at once.",
        "So the adder/subtractor is just your adder, plus a row of controlled inverters, plus M routed to carry-in. That is all."
      ],
      "theoryHI": [
        "एक control line, Mode bit M, तय करती है कि unit जोड़ेगा या घटाएगा।",
        "M = 0 → unit जोड़ता है। B के bits बिना बदले गुज़र जाते हैं और carry-in 0 होता है, तो मिलता है सीधा A + B।",
        "M = 1 → unit घटाता है। B के bits invert हो जाते हैं और carry-in 1 होता है, जिससे बनता है A + (NOT B) + 1 = A − B।",
        "चतुराई यहाँ है: M carry-in से जुड़ा होता है। M = 1 ही two's complement का '+1' है - वही एक wire दोनों काम करता है।",
        "Design की सच्चाई: invert-B को M control करता है, और '+1' को भी M control करता है। एक bit एक साथ two's-complement recipe के दोनों हिस्सों को चालू कर देता है।",
        "तो adder/subtractor बस आपका adder है, साथ में controlled inverters की एक row, साथ में M को carry-in तक भेज देना। बस इतना ही।"
      ],
      "transcriptEN": "Now meet the smallest, most powerful wire in the whole design: the Mode bit, M. It is a single control line, and it decides the personality of the circuit. When M is zero, the unit is in add mode. The bits of B flow straight through, the carry-in is zero, and the adder computes plain A plus B. When M is one, everything changes at once. The bits of B are inverted on their way in, and - here is the beautiful part - that same M is wired into the carry-in. So the carry-in becomes one. Look at what that gives you: A, plus inverted B, plus one. That is exactly the two's complement formula, A minus B. The reason one bit can flip the whole machine is that M is doing two jobs simultaneously: it tells the inverters to flip B, and being one, it supplies the plus-one through the carry-in. Add mode and subtract mode are not two circuits. They are one circuit wearing two faces, and M chooses the face.",
      "transcriptHI": "अब मिलिए पूरे design की सबसे छोटी पर सबसे ताक़तवर wire से: Mode bit, M। यह एक अकेली control line है, और यही circuit का स्वभाव तय करती है। जब M शून्य होता है, unit add mode में होता है। B के bits सीधे गुज़र जाते हैं, carry-in शून्य होता है, और adder निकालता है सीधा A plus B। जब M एक होता है, सब कुछ एक साथ बदल जाता है। B के bits अंदर आते-आते invert हो जाते हैं, और - यहाँ ख़ूबसूरत बात है - वही M carry-in से जुड़ा होता है। तो carry-in एक बन जाता है। देखिए इससे क्या मिलता है: A, plus inverted B, plus one। यही तो two's complement का सूत्र है, A minus B। एक bit पूरी मशीन को पलट सकता है क्योंकि M एक साथ दो काम कर रहा है: वह inverters को B flip करने को कहता है, और ख़ुद एक होकर carry-in के ज़रिए वह plus-one भी देता है। Add mode और subtract mode दो circuits नहीं हैं। यह एक ही circuit है जो दो चेहरे पहनता है, और M चेहरा चुनता है।",
      "visualNote": "Truth-style panel with two columns: M=0 (ADD) - B passes, Cin=0, result A+B; M=1 (SUB) - B inverted, Cin=1, result A−B. A bright wire from M splits into the inverter-control line and the carry-in of the lowest full adder."
    },
    {
      "id": "S05_XorShapeShifter",
      "label": "The XOR Shape-Shifter",
      "kind": "circuit",
      "subtitle": "A controlled inverter: open door or mirror",
      "theoryEN": [
        "How does one M bit invert all of B only when needed? Each bit of B passes through an XOR gate controlled by M.",
        "Recall the XOR rule: B XOR 0 = B (unchanged), and B XOR 1 = NOT B (inverted). That single identity is the whole mechanism.",
        "M = 0 → XOR is an 'open door': B XOR 0 leaves every bit exactly as it was, so the adder sees plain B → A + B.",
        "M = 1 → XOR is a 'mirror': B XOR 1 flips every bit, so the adder sees NOT B, and with Cin = 1 you get A + NOT B + 1 = A − B.",
        "This XOR-per-bit block is called a controlled inverter - it inverts on command. It is the exact part that upgrades an adder into an adder/subtractor.",
        "Nothing else changed: every full adder still computes sum = a ^ b ^ cin. We only changed what 'b' is before it arrives."
      ],
      "theoryHI": [
        "एक M bit पूरी B को सिर्फ़ ज़रूरत पर invert कैसे कर देता है? B का हर bit एक XOR gate से गुज़रता है जिसे M control करता है।",
        "XOR का नियम याद करें: B XOR 0 = B (अपरिवर्तित), और B XOR 1 = NOT B (inverted)। यही एक identity पूरा mechanism है।",
        "M = 0 → XOR एक 'खुला दरवाज़ा' है: B XOR 0 हर bit को वैसा ही छोड़ देता है, तो adder को सीधा B दिखता है → A + B।",
        "M = 1 → XOR एक 'आईना' है: B XOR 1 हर bit को flip कर देता है, तो adder को NOT B दिखता है, और Cin = 1 के साथ मिलता है A + NOT B + 1 = A − B।",
        "इस XOR-per-bit block को controlled inverter कहते हैं - यह आदेश पर invert करता है। यही वह हिस्सा है जो adder को adder/subtractor में बदल देता है।",
        "बाक़ी कुछ नहीं बदला: हर full adder अब भी sum = a ^ b ^ cin ही निकालता है। हमने सिर्फ़ यह बदला कि 'b' पहुँचने से पहले क्या है।"
      ],
      "transcriptEN": "So how does a single M bit reach in and flip an eight-bit, or thirty-two-bit, value of B exactly when we want? The answer is an old friend: the XOR gate, used as a shape-shifter. Put one XOR gate in front of every bit of B, and connect M to the second input of all of them. Now remember the two XOR identities you already know. B XOR zero is just B - the gate becomes an open door, letting the bit pass untouched. B XOR one is NOT B - the gate becomes a mirror, flipping the bit. So when M is zero, every door is open and the adder receives B unchanged: it adds. When M is one, every gate becomes a mirror, the adder receives NOT B, and with the carry-in also at one, it computes A plus NOT B plus one, which is A minus B. This row of XOR gates is called a controlled inverter, and it is the single upgrade that turns the adder you built into a full adder-subtractor. The full adders never changed - sum is still a XOR b XOR carry-in. We only changed what b looks like on the way in.",
      "transcriptHI": "तो एक अकेला M bit B की आठ-bit, या बत्तीस-bit value को ठीक तभी कैसे flip कर देता है जब हम चाहें? जवाब है एक पुराना दोस्त: XOR gate, एक shape-shifter की तरह। B के हर bit के सामने एक XOR gate लगा दो, और M को उन सबके दूसरे input से जोड़ दो। अब वही दो XOR identities याद करो जो आप पहले से जानते हैं। B XOR शून्य बस B है - gate एक खुला दरवाज़ा बन जाता है, bit बिना छुए गुज़र जाता है। B XOR एक है NOT B - gate एक आईना बन जाता है, bit को flip कर देता है। तो जब M शून्य है, हर दरवाज़ा खुला है और adder को B बिना बदले मिलता है: वह जोड़ता है। जब M एक है, हर gate आईना बन जाता है, adder को NOT B मिलता है, और carry-in भी एक होने से वह A plus NOT B plus one निकालता है, जो A minus B है। XOR gates की इस row को controlled inverter कहते हैं, और यही वह अकेला upgrade है जो आपके बनाए adder को पूरा adder-subtractor बना देता है। Full adders कभी बदले ही नहीं - sum अब भी a XOR b XOR carry-in है। हमने सिर्फ़ यह बदला कि b अंदर आते वक़्त कैसा दिखता है।",
      "visualNote": "Circuit: four B bits each entering an XOR gate whose other input is the shared M line; outputs feed a 4-bit full-adder chain whose Cin is also M. Toggle M to animate gates flipping between 'open door' (pass) and 'mirror' (invert)."
    },
    {
      "id": "S06_Flashcards",
      "label": "Flashcards - Lock It In",
      "kind": "flashcards",
      "subtitle": "Eight cards: the illusion, the formula, the mechanism",
      "theoryEN": [
        "Flip each card: term on the front, the plain explanation on the back.",
        "These eight cover two's complement, the Mode bit M, XOR as a controlled inverter, why we add instead of subtract, the master formula A − B = A + NOT B + 1, borrow vs carry, one's vs two's complement, and the adder/subtractor unit.",
        "Aim to explain each back in your own words before flipping - that is real recall."
      ],
      "theoryHI": [
        "हर card को पलटें: सामने term, पीछे सीधी व्याख्या।",
        "ये आठ cards two's complement, Mode bit M, XOR को controlled inverter के रूप में, हम subtract की जगह add क्यों करते हैं, मुख्य सूत्र A − B = A + NOT B + 1, borrow बनाम carry, one's बनाम two's complement, और adder/subtractor unit को cover करते हैं।",
        "पलटने से पहले हर पीछे वाली बात अपने शब्दों में बताने की कोशिश करें - यही असली recall है।"
      ],
      "transcriptEN": "Eight cards to lock the big idea into memory. Cover the back, read the term, and say the explanation out loud before you flip. If you can teach the back in your own words, you own it.",
      "transcriptHI": "बड़े विचार को याददाश्त में बैठाने के लिए आठ cards। पीछे का हिस्सा ढक दें, term पढ़ें, और पलटने से पहले व्याख्या ज़ोर से बोलें। अगर आप पीछे वाली बात अपने शब्दों में सिखा सकें, तो वह आपकी हो गई।",
      "visualNote": "Watermarked shareable flip-card deck (reuse FlashCardDeck): front shows the bold term, back shows the explanation; accent colours per card."
    },
    {
      "id": "S07_Quiz",
      "label": "Quiz - Test the Illusion",
      "kind": "quiz",
      "subtitle": "Six questions on recall and the trick",
      "theoryEN": [
        "Six multiple-choice questions. Each tests either the adder recall or the subtraction illusion.",
        "Read every option - the wrong ones are the misconceptions this module exists to break.",
        "Explanations follow each answer so a miss becomes a lesson."
      ],
      "theoryHI": [
        "छह multiple-choice सवाल। हर एक या तो adder recall जाँचता है या subtraction illusion।",
        "हर option पढ़ें - ग़लत वाले वही misconceptions हैं जिन्हें तोड़ने के लिए यह module बना है।",
        "हर जवाब के बाद explanation है ताकि चूक भी एक सबक़ बन जाए।"
      ],
      "transcriptEN": "Six quick questions. Some test the adder you recalled, some test the subtraction trick you just learned. Read all four options each time - the wrong answers are exactly the traps students fall into.",
      "transcriptHI": "छह तेज़ सवाल। कुछ उस adder को जाँचते हैं जिसे आपने recall किया, कुछ उस subtraction trick को जो आपने अभी सीखी। हर बार चारों options पढ़ें - ग़लत जवाब ठीक वही जाल हैं जिनमें students फँसते हैं।",
      "visualNote": "QuizArena with six problems; show running score and reveal explanation on answer."
    },
    {
      "id": "S08_Recap",
      "label": "Recap - The Secret in One Page",
      "kind": "recap",
      "subtitle": "Everything that makes the minus sign an illusion",
      "theoryEN": [
        "The deception: a CPU has no subtractor - it only adds, and reuses the same adder for everything.",
        "The trick: to do A − B, build the negative of B and add it. A − B = A + (NOT B) + 1.",
        "Two's complement = invert B (one's complement), then add 1. That is −B in binary.",
        "The Mode bit M: M = 0 adds, M = 1 subtracts. M also feeds the carry-in, supplying the '+1'.",
        "The XOR shape-shifter: a row of XOR gates controlled by M is a controlled inverter - open door at M = 0, mirror at M = 1.",
        "Recall that held it all up: XOR identities, the full adder (sum = a ^ b ^ cin), and the borrow-vs-carry intuition. Next on the track: building real subtractor circuits."
      ],
      "theoryHI": [
        "Deception: CPU में कोई subtractor है ही नहीं - वह सिर्फ़ जोड़ता है, और हर काम के लिए वही adder दोबारा इस्तेमाल करता है।",
        "Trick: A − B करने के लिए B का negative बनाओ और जोड़ दो। A − B = A + (NOT B) + 1।",
        "Two's complement = B को invert करो (one's complement), फिर 1 जोड़ो। यही binary में −B है।",
        "Mode bit M: M = 0 जोड़ता है, M = 1 घटाता है। M carry-in को भी देता है, जिससे '+1' मिलता है।",
        "XOR shape-shifter: M से controlled XOR gates की एक row एक controlled inverter है - M = 0 पर खुला दरवाज़ा, M = 1 पर आईना।",
        "जिस recall ने यह सब टिकाया: XOR identities, full adder (sum = a ^ b ^ cin), और borrow-बनाम-carry की समझ। track पर आगे: असली subtractor circuits बनाना।"
      ],
      "transcriptEN": "Let us close by pulling the whole secret onto one page. A CPU does not subtract - it only adds, and it reuses your adder for every job. To compute A minus B, it builds the negative of B and adds that: A minus B equals A plus NOT B plus one. The negative is made by two's complement - invert B to get the one's complement, then add one. A single Mode bit M flips the machine's mood: zero means add, one means subtract, and because M also drives the carry-in, it quietly supplies the plus-one of the formula. And the magic that lets M invert B on demand is a row of XOR gates acting as a controlled inverter - an open door when M is zero, a mirror when M is one. All of it rests on what you already knew: the XOR gate, the full adder with sum equals a XOR b XOR carry-in, and the feel for borrow versus carry. The illusion is solved. Next on the subtractor track, you will build the real circuits.",
      "transcriptHI": "आइए पूरे राज़ को एक page पर समेटकर समाप्त करें। CPU subtract करता ही नहीं - वह सिर्फ़ जोड़ता है, और हर काम के लिए आपका adder दोबारा इस्तेमाल करता है। A minus B निकालने के लिए वह B का negative बनाता है और उसे जोड़ देता है: A minus B बराबर A plus NOT B plus one। वह negative two's complement से बनता है - B को invert करके one's complement पाओ, फिर एक जोड़ो। एक अकेला Mode bit M मशीन का मिज़ाज पलट देता है: शून्य यानी add, एक यानी subtract, और चूँकि M carry-in को भी चलाता है, वह चुपचाप सूत्र का plus-one दे देता है। और वह जादू जो M को माँग पर B invert करने देता है, वह है controlled inverter की तरह काम करती XOR gates की एक row - M शून्य पर खुला दरवाज़ा, M एक पर आईना। यह सब उसी पर टिका है जो आप पहले से जानते थे: XOR gate, full adder जिसमें sum बराबर a XOR b XOR carry-in, और borrow बनाम carry की समझ। illusion हल हो गया। subtractor track पर आगे, आप असली circuits बनाएँगे।",
      "visualNote": "One-page cheat grid: three columns 'The lie / The trick / The mechanism', plus a small footer linking back to the full adder module and forward to the half/full subtractor builds."
    }
  ],
  "flashcards": [
    {
      "frontEN": "Two's complement",
      "backEN": "The binary way to write a negative number. Take B, invert every bit (one's complement), then add 1. The result equals −B, so the ordinary adder can 'subtract' just by adding it.",
      "frontHI": "Two's complement",
      "backHI": "Binary में negative number लिखने का तरीक़ा। B लो, हर bit invert करो (one's complement), फिर 1 जोड़ो। नतीजा −B के बराबर होता है, इसलिए साधारण adder उसे जोड़कर ही 'subtract' कर देता है।"
    },
    {
      "frontEN": "Mode bit M",
      "backEN": "A single control line that picks the operation. M = 0 → the unit ADDS (A + B). M = 1 → the unit SUBTRACTS (A − B). M is also wired to the carry-in, so it supplies the '+1' of two's complement.",
      "frontHI": "Mode bit M",
      "backHI": "एक अकेली control line जो operation चुनती है। M = 0 → unit जोड़ता है (A + B)। M = 1 → unit घटाता है (A − B)। M carry-in से भी जुड़ा होता है, इसलिए वह two's complement का '+1' भी देता है।"
    },
    {
      "frontEN": "XOR as a controlled inverter",
      "backEN": "B XOR 0 = B (pass unchanged), B XOR 1 = NOT B (inverted). Put an XOR on each bit of B with M as the control: M = 0 is an open door, M = 1 is a mirror. This is what inverts B only when subtracting.",
      "frontHI": "XOR एक controlled inverter के रूप में",
      "backHI": "B XOR 0 = B (बिना बदले गुज़र), B XOR 1 = NOT B (inverted)। B के हर bit पर एक XOR लगाओ जिसका control M हो: M = 0 खुला दरवाज़ा, M = 1 आईना। यही B को सिर्फ़ subtract करते वक़्त invert करता है।"
    },
    {
      "frontEN": "Why add instead of subtract",
      "backEN": "A CPU has no subtractor circuit - building one would waste silicon. Subtracting B equals adding −B, so the same adder does both jobs. One block, two operations: smaller, cheaper, faster.",
      "frontHI": "Subtract की जगह add क्यों",
      "backHI": "CPU में कोई subtractor circuit होता ही नहीं - उसे बनाना silicon की बर्बादी होती। B को घटाना वही है जो −B को जोड़ना, तो वही adder दोनों काम कर देता है। एक block, दो operations: छोटा, सस्ता, तेज़।"
    },
    {
      "frontEN": "A − B = A + (NOT B) + 1",
      "backEN": "The master formula of the subtractor. Invert B (NOT B), add A and the inverted B, and add 1 (delivered through the carry-in). The carry-out that falls off the top is discarded. No minus sign anywhere.",
      "frontHI": "A − B = A + (NOT B) + 1",
      "backHI": "Subtractor का मुख्य सूत्र। B को invert करो (NOT B), A और inverted B जोड़ो, और 1 जोड़ो (जो carry-in से आता है)। ऊपर से गिरने वाली carry-out छोड़ दी जाती है। कहीं कोई minus चिह्न नहीं।"
    },
    {
      "frontEN": "Borrow vs carry",
      "backEN": "In a true subtractor, a column that can't pay takes a borrow from the next column. In the two's-complement adder there is no borrow at all - there is only carry, because subtraction has been turned into addition.",
      "frontHI": "Borrow बनाम carry",
      "backHI": "असली subtractor में, जो column चुका न सके वह अगले column से borrow लेता है। two's-complement adder में borrow होता ही नहीं - सिर्फ़ carry होता है, क्योंकि subtraction को addition में बदल दिया गया है।"
    },
    {
      "frontEN": "One's vs two's complement",
      "backEN": "One's complement = just invert every bit (NOT B). Two's complement = one's complement + 1. Only the two's complement is a clean −B that lets the adder give the right answer; the extra +1 is the whole difference.",
      "frontHI": "One's बनाम two's complement",
      "backHI": "One's complement = बस हर bit invert करो (NOT B)। Two's complement = one's complement + 1। सिर्फ़ two's complement ही साफ़ −B है जो adder से सही जवाब दिलाता है; वह extra +1 ही पूरा अंतर है।"
    },
    {
      "frontEN": "Adder/subtractor unit",
      "backEN": "Your full-adder chain, plus a row of XOR gates on B controlled by M, plus M routed to the carry-in. One circuit: M = 0 adds, M = 1 subtracts. The full adders are unchanged - sum is still a ^ b ^ cin.",
      "frontHI": "Adder/subtractor unit",
      "backHI": "आपकी full-adder chain, साथ में B पर M से controlled XOR gates की एक row, साथ में M को carry-in तक भेज देना। एक circuit: M = 0 जोड़ता है, M = 1 घटाता है। Full adders वैसे ही रहते हैं - sum अब भी a ^ b ^ cin है।"
    }
  ],
  "quiz": [
    {
      "questionEN": "How does a normal CPU compute A − B?",
      "questionHI": "एक सामान्य CPU A − B कैसे निकालता है?",
      "options": [
        "It uses a dedicated subtractor circuit built from borrow logic",
        "It adds A and the two's complement of B using the same adder",
        "It counts down from A, B times",
        "It converts both numbers to decimal first"
      ],
      "answerIndex": 1,
      "explainEN": "There is no subtractor. The CPU forms −B as the two's complement of B (invert, then +1) and feeds A + (NOT B) + 1 into the very same adder. Subtraction is addition in disguise.",
      "explainHI": "कोई subtractor होता ही नहीं। CPU −B को B के two's complement के रूप में बनाता है (invert, फिर +1) और A + (NOT B) + 1 को उसी adder में डालता है। Subtraction छुपी हुई addition है।"
    },
    {
      "questionEN": "What are the two steps to take the two's complement of B?",
      "questionHI": "B का two's complement लेने के दो steps क्या हैं?",
      "options": [
        "Add 1 to B, then invert every bit",
        "Invert every bit of B, then add 1",
        "Shift B left by one, then invert",
        "Invert every bit of B, then subtract 1"
      ],
      "answerIndex": 1,
      "explainEN": "Two's complement = one's complement + 1. First invert every bit of B (that is NOT B, the one's complement), then add 1. The order matters: inverting after adding gives the wrong value.",
      "explainHI": "Two's complement = one's complement + 1। पहले B के हर bit को invert करो (वही NOT B, one's complement), फिर 1 जोड़ो। क्रम मायने रखता है: जोड़ने के बाद invert करना ग़लत value देगा।"
    },
    {
      "questionEN": "In the adder/subtractor, what does the Mode bit M = 1 do?",
      "questionHI": "Adder/subtractor में Mode bit M = 1 क्या करता है?",
      "options": [
        "Inverts B through the XOR gates AND sets carry-in to 1, so the unit subtracts",
        "Only inverts B, while carry-in stays 0",
        "Only sets carry-in to 1, leaving B unchanged",
        "Turns the adder off completely"
      ],
      "answerIndex": 0,
      "explainEN": "M does both jobs at once. As the control input to the XOR row it inverts B, and because M is wired to the carry-in, M = 1 supplies the '+1'. Together that is A + NOT B + 1 = A − B.",
      "explainHI": "M एक साथ दोनों काम करता है। XOR row के control input के रूप में वह B को invert करता है, और M carry-in से जुड़ा होने के कारण M = 1 वह '+1' देता है। दोनों मिलकर बनते हैं A + NOT B + 1 = A − B।"
    },
    {
      "questionEN": "Why is an XOR gate used as the controlled inverter on each bit of B?",
      "questionHI": "B के हर bit पर controlled inverter के रूप में XOR gate क्यों इस्तेमाल होता है?",
      "options": [
        "Because XOR always inverts its input",
        "Because B XOR 0 = B (pass) and B XOR 1 = NOT B (invert), so M decides per-bit",
        "Because XOR stores the bit like a flip-flop",
        "Because XOR is faster than every other gate"
      ],
      "answerIndex": 1,
      "explainEN": "The XOR identity is the trick: with M = 0 the gate is an open door (B XOR 0 = B), with M = 1 it is a mirror (B XOR 1 = NOT B). One control line therefore inverts B only when subtracting.",
      "explainHI": "XOR की identity ही trick है: M = 0 पर gate खुला दरवाज़ा (B XOR 0 = B), M = 1 पर आईना (B XOR 1 = NOT B)। इसलिए एक control line B को सिर्फ़ subtract करते वक़्त invert करती है।"
    },
    {
      "questionEN": "Recall: in every full adder of this unit, what is the Sum bit?",
      "questionHI": "Recall: इस unit के हर full adder में Sum bit क्या होता है?",
      "options": [
        "sum = a AND b AND cin",
        "sum = a OR b OR cin",
        "sum = a ^ b ^ cin",
        "sum = NOT (a ^ b)"
      ],
      "answerIndex": 2,
      "explainEN": "Nothing about the full adder changes when we add subtract mode - Sum is still a ^ b ^ cin and the carry is the majority of the three inputs. Only the value of 'b' (B or NOT B) is altered before it arrives.",
      "explainHI": "Subtract mode जोड़ने पर full adder में कुछ नहीं बदलता - Sum अब भी a ^ b ^ cin है और carry तीनों inputs का majority। बस 'b' की value (B या NOT B) पहुँचने से पहले बदलती है।"
    },
    {
      "questionEN": "Using two's complement to do 6 − 4 in 4 bits, what happens to the final carry-out of the adder?",
      "questionHI": "4 bits में two's complement से 6 − 4 करते समय adder की आख़िरी carry-out का क्या होता है?",
      "options": [
        "It is added back to the result",
        "It is discarded; the low 4 bits hold the answer (0010 = 2)",
        "It signals an error and stops the operation",
        "It becomes the new Mode bit M"
      ],
      "answerIndex": 1,
      "explainEN": "B = 0100, NOT B = 1011, plus M's carry-in 1 gives 1100 (= −4). 0110 + 1100 = 1 0010. The carry-out that falls off the top is dropped, leaving 0010 = 2, and 6 − 4 = 2. The dropped carry just confirms a non-negative result.",
      "explainHI": "B = 0100, NOT B = 1011, और M की carry-in 1 मिलाकर 1100 (= −4)। 0110 + 1100 = 1 0010। ऊपर से गिरने वाली carry-out छोड़ दी जाती है, बचता है 0010 = 2, और 6 − 4 = 2। गिरी हुई carry बस यह पुष्टि करती है कि नतीजा non-negative है।"
    }
  ]
}) as unknown as SubContent;
