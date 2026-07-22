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
        "Here is a fact most people never question: your calculator has no 'subtract' machine inside it. When you press the minus key, it does not run some special subtracting circuit - it quietly performs an addition instead, and the minus you see on the screen is a clever cover story.",
        "This module is built in two halves. First we recall the adder you already built with your own hands - the half adder and the full adder - because that exact circuit is about to do double duty. Then we reveal the single trick that lets it 'subtract', the same trick running inside every CPU on Earth, from a cheap calculator to a server chip.",
        "The big idea fits in one line: A - B is never actually computed. The hardware computes A + (NOT B) + 1 instead, where 'NOT B' means every bit of B flipped. That looks like a detour, but it turns subtraction into ordinary addition, which the chip already knows how to do.",
        "You will lean on a few things you have already learned, so keep them handy: the XOR gate, the half adder whose sum is a ^ b, the full adder whose sum is a ^ b ^ cin and whose carry is the majority of its three inputs, and the everyday difference between a borrow (in subtraction) and a carry (in addition).",
        "By the end you will see how one tiny control wire, the Mode bit M, turns that very same adder into a subtractor on demand - M = 0 to add, M = 1 to subtract - without adding a single piece of new arithmetic hardware."
      ],
      "theoryHI": [
        "एक fact जिस पर ज़्यादातर लोग कभी सवाल नहीं करते: आपके calculator के अंदर कोई अलग 'subtract' मशीन होती ही नहीं। जब आप minus key दबाते हैं, तो वह कोई special subtracting circuit नहीं चलाता - वह चुपचाप एक addition कर देता है, और screen पर दिखता minus बस एक चालाक cover story है।",
        "यह module दो हिस्सों में बना है। पहले हम उस adder को recall करते हैं जो आपने अपने हाथों से बनाया - half adder और full adder - क्योंकि वही circuit अब double duty करने वाला है। फिर हम वह अकेली trick दिखाते हैं जो उसी से 'subtract' कराती है, वही trick जो दुनिया के हर CPU में चलती है, सस्ते calculator से लेकर server chip तक।",
        "मुख्य विचार एक लाइन में: A - B असल में कभी निकाला ही नहीं जाता। Hardware उसकी जगह A + (NOT B) + 1 निकालता है, जहाँ 'NOT B' का मतलब है B के हर bit को flip कर देना। यह घुमावदार रास्ता लगता है, पर यह subtraction को साधारण addition में बदल देता है, जो chip पहले से जानता है।",
        "कुछ चीज़ें जो आप पहले सीख चुके हैं उन्हें पास रखें: XOR gate, half adder जिसका sum है a ^ b, full adder जिसका sum है a ^ b ^ cin और carry तीनों inputs का majority है, और रोज़मर्रा का अंतर - borrow (subtraction में) बनाम carry (addition में)।",
        "अंत तक आप देखेंगे कि एक नन्ही सी control wire, Mode bit M, उसी adder को माँग पर subtractor बना देती है - M = 0 पर जोड़ो, M = 1 पर घटाओ - और एक भी नया arithmetic hardware लगाए बिना।"
      ],
      "transcriptEN": "Welcome back. You already know how to add - you built the half adder and the full adder with your own hands. Now I am going to show you a secret that most engineers use every day without ever noticing. When your phone, your calculator, or a giant server CPU subtracts two numbers, there is no subtractor doing the work. The minus sign is an illusion. Behind the screen, the machine quietly reuses the exact adder you already understand. In this opening lesson we recall that adder, then reveal the single neat trick - two's complement and one Mode bit - that lets the same hardware both add and subtract. Hold on to one sentence: A minus B is really A plus the negative of B.",
      "transcriptHI": "वापस स्वागत है। आप जोड़ना तो जानते ही हैं - आपने half adder और full adder अपने हाथों से बनाया है। अब मैं आपको एक राज़ दिखाऊँगा जिसे ज़्यादातर engineers रोज़ इस्तेमाल करते हैं पर कभी ध्यान नहीं देते। जब आपका phone, calculator, या कोई बड़ा server CPU दो numbers को subtract करता है, तो असल में कोई subtractor काम ही नहीं कर रहा होता। वह minus का चिह्न एक illusion है। screen के पीछे मशीन चुपचाप वही adder दोबारा इस्तेमाल करती है जिसे आप पहले से समझते हैं। इस पहले lesson में हम उस adder को recall करेंगे, फिर वह एक खूबसूरत trick दिखाएँगे - two's complement और एक Mode bit - जो उसी hardware से जोड़ भी कराता है और घटा भी। एक वाक्य याद रखिए: A minus B असल में A plus B का negative है।",
      "visualNote": "Cover: a calculator with the minus key glowing, and a translucent reveal behind it showing an adder block + an XOR row + a small 'M' switch. Recall chips for XOR, half adder, full adder float along the bottom."
    },
    {
      "id": "S01_Video",
      "label": "Video - How Computers Subtract",
      "kind": "video",
      "subtitle": "Lesson lecture: the trick behind every minus sign",
      "theoryEN": [
        "Watch the lesson 'How Computers Subtract' before the deep dive below - it lays the whole illusion out in plain words and pictures.",
        "Its central claim is the one to hold onto: subtraction is addition in disguise, because the CPU does not subtract B, it adds the negative of B instead.",
        "It walks the three steps of the two's complement out loud - invert every bit of B, add 1 to get -B, then add that to A on the ordinary adder.",
        "It introduces the Mode bit M, the single control wire that sets the machine's mood: M = 0 makes the unit add A + B, and M = 1 makes the very same unit subtract A - B.",
        "Watch for the row of XOR gates sitting in front of B - that controlled inverter is the whole secret made physical, an open door when adding and a mirror when subtracting.",
        "Keep one recall fact in mind throughout: nothing about the full adder changes, so every Sum bit is still just a ^ b ^ cin - only what feeds in as 'b' changes."
      ],
      "theoryHI": [
        "नीचे गहराई में जाने से पहले lesson 'How Computers Subtract' देखें - यह पूरे illusion को साफ़ शब्दों और चित्रों में रख देता है।",
        "इसका मुख्य दावा वही है जिसे पकड़े रखना है: subtraction छुपी हुई addition है, क्योंकि CPU B को घटाता नहीं, वह उसकी जगह B का negative जोड़ देता है।",
        "यह two's complement के तीन steps खोलकर दिखाता है - B के हर bit को invert करो, 1 जोड़कर -B पाओ, फिर उसे साधारण adder पर A में जोड़ दो।",
        "यह Mode bit M से परिचय कराता है, वह अकेली control wire जो मशीन का मिज़ाज तय करती है: M = 0 पर unit A + B जोड़ता है, और M = 1 पर वही unit A - B घटाता है।",
        "B के सामने बैठी XOR gates की row पर ध्यान दें - वही controlled inverter पूरा राज़ है, hardware में साकार, जोड़ते वक़्त खुला दरवाज़ा और घटाते वक़्त आईना।",
        "एक recall fact पूरे समय याद रखें: full adder में कुछ नहीं बदलता, इसलिए हर Sum bit अब भी सिर्फ़ a ^ b ^ cin है - बस 'b' के रूप में अंदर क्या जाता है, वह बदलता है।"
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
        "Let us name the deception out loud. Inside a normal ALU - the Arithmetic Logic Unit, the part of a CPU that does the maths - there is no subtractor circuit at all. The arithmetic hardware can do exactly one thing: add. So when the calculator on your desk shows a smaller number after you press minus, no machine in there subtracted anything.",
        "The escape is one simple idea: subtraction is addition in disguise. To compute A - B, the machine adds A and the negative of B, because taking five away from seven gives the same answer as adding negative-five to seven. The minus is handled not by a new operation but by making one of the numbers negative.",
        "The beauty is that the very same adder you built - the row of full adders chained together - is reused for both jobs. Nothing is duplicated. Add mode and subtract mode are the same silicon doing the same addition; only the input changes.",
        "This is a deliberate engineering win, not a shortcut taken out of laziness. A dedicated subtractor would mean a second pile of gates that sits idle whenever you are adding. Reusing one block for two jobs gives a smaller, cheaper, cooler, and faster chip - and in a processor with billions of transistors, that saving repeated everywhere truly matters.",
        "Notice how the whole problem has quietly changed shape. Engineers stopped asking 'how do we build a circuit that subtracts?' and started asking 'how do we make a negative number out of B, so the adder can just add it?'. That is a far easier question, and it has a clean answer.",
        "That answer is the two's complement - the recipe for writing a negative number in binary - and it is exactly what the next scene builds, step by step."
      ],
      "theoryHI": [
        "आइए इस deception को साफ़-साफ़ नाम दें। एक सामान्य ALU के अंदर - ALU यानी Arithmetic Logic Unit, CPU का वह हिस्सा जो गणित करता है - कोई subtractor circuit होता ही नहीं। arithmetic hardware ठीक एक ही काम कर सकता है: जोड़ना। तो जब आपकी मेज़ का calculator minus दबाने पर छोटा number दिखाता है, तब अंदर किसी मशीन ने कुछ subtract किया ही नहीं।",
        "इससे बचने का रास्ता एक सीधा विचार है: subtraction छुपी हुई addition है। A - B निकालने के लिए मशीन A और B का negative जोड़ देती है, क्योंकि सात में से पाँच घटाना वही जवाब देता है जो सात में negative-पाँच जोड़ना। minus को नए operation से नहीं, बल्कि एक number को negative बनाकर सँभाला जाता है।",
        "ख़ूबसूरती यह है कि वही adder जो आपने बनाया - full adders की एक row एक साथ जुड़ी हुई - दोनों कामों के लिए दोबारा इस्तेमाल होती है। कुछ भी duplicate नहीं होता। Add mode और subtract mode वही silicon हैं जो वही addition कर रहे हैं; सिर्फ़ input बदलता है।",
        "यह सोची-समझी engineering जीत है, आलस का shortcut नहीं। एक अलग subtractor का मतलब होता gates का दूसरा ढेर जो जब आप जोड़ रहे हों तब बेकार पड़ा रहता। एक ही block से दो काम लेना देता है छोटा, सस्ता, ठंडा और तेज़ chip - और अरबों transistors वाले processor में हर जगह दोहराई गई यह बचत सच में मायने रखती है।",
        "ध्यान दीजिए कि पूरी समस्या ने चुपचाप अपना रूप बदल लिया। engineers ने 'ऐसा circuit कैसे बनाएँ जो subtract करे?' पूछना बंद किया और 'B का negative number कैसे बनाएँ, ताकि adder उसे बस जोड़ दे?' पूछना शुरू किया। यह कहीं आसान सवाल है, और इसका एक साफ़ जवाब है।",
        "वह जवाब है two's complement - binary में negative number लिखने की recipe - और ठीक यही अगली scene कदम-दर-कदम बनाती है।"
      ],
      "transcriptEN": "Let us name the deception clearly. Inside the arithmetic core of a CPU there is no machine that subtracts. There is only an adder - the same chain of full adders you built, each computing sum equals a XOR b XOR carry-in. So how does the chip ever show you a smaller answer on the screen? It cheats, beautifully. Instead of inventing a second circuit just for minus, the designers asked a smarter question. Subtracting B is the same as adding negative B. If we can build the negative of B using only logic gates, then subtraction collapses into addition, and one adder serves both purposes. This is not laziness - it is smart design. One block, two jobs, less silicon, lower cost, higher speed. The whole problem of subtraction has now turned into a single new problem: how do we represent a negative number in binary so the adder just works? Hold that thought.",
      "transcriptHI": "आइए इस deception को साफ़-साफ़ नाम दें। CPU के arithmetic core के अंदर कोई मशीन subtract नहीं करती। वहाँ सिर्फ़ एक adder है - वही full adders की chain जो आपने बनाई, हर एक sum equals a XOR b XOR carry-in निकालता हुआ। तो फिर chip आपको screen पर छोटा जवाब दिखाता कैसे है? वह बेहद ख़ूबसूरती से चालाकी करता है। minus के लिए दूसरा circuit बनाने की बजाय designers ने एक समझदार सवाल पूछा। B को घटाना वही है जो negative B को जोड़ना। अगर हम सिर्फ़ logic gates से B का negative बना लें, तो subtraction सिमटकर addition बन जाता है, और एक ही adder दोनों काम कर देता है। यह आलस नहीं है - यह समझदारी भरा design है। एक block, दो काम, कम silicon, कम लागत, ज़्यादा speed। अब subtraction की पूरी समस्या एक नई समस्या में बदल गई है: हम binary में negative number को इस तरह कैसे दिखाएँ कि adder अपने-आप सही चले? यह बात पकड़े रखिए।",
      "visualNote": "Split panel: left shows a row of full adders labelled 'the only arithmetic hardware'; right shows a crossed-out subtractor block with a red 'does not exist' stamp. Arrow loops from the subtractor X back into the adder."
    },
    {
      "id": "S03_TwosComplement",
      "label": "Two's Complement - The Negative Maker",
      "kind": "theory",
      "subtitle": "A − B = A + (NOT B) + 1",
      "theoryEN": [
        "Here is the negative-maker that makes the whole illusion work, and it is surprisingly cheap. To compute A - B we never write a minus sign anywhere. Instead we build the negative of B out of B itself, using just two tiny steps that any logic gate can do, and then we add. This recipe is called taking the two's complement of B.",
        "Step 1 is to invert. Flip every single bit of B: every 1 becomes 0 and every 0 becomes 1. The flipped pattern is called the one's complement, written NOT B. For example, if B is 0101, then NOT B is 1010. On its own this is not yet the negative of B - it is one short, which the next step fixes.",
        "Step 2 is to add one. Take NOT B and add a single 1 to it. Now you hold the two's complement, and that value behaves exactly like -B inside the adder. That lonely +1 is the entire difference between the one's complement (which is almost-negative) and the two's complement (which is truly -B), so it is worth remembering.",
        "Step 3 is to add as usual. Hand A and this -B to the ordinary adder you already built and let it run. Because you fed it the negative of B, the answer that comes out is exactly A - B - computed with nothing but inversion and addition.",
        "Put together, the master formula is A - B = A + (NOT B) + 1. Read it slowly: there is no subtraction anywhere in it. There is one inversion (the NOT) and two additions (the +1 and the +A). Every minus you will ever see a computer do is really this formula in disguise.",
        "Work a concrete 4-bit example to lock it in. Let A = 7 (which is 0111) and B = 5 (which is 0101). Invert B to get NOT B = 1010, then the full sum is 0111 + 1010 + 1 = 10010, a 5-bit result. Throw away the leftmost carry-out and you are left with 0010, which is 2 - and indeed 7 - 5 = 2. The carry that fell off the top is normal and simply means the answer came out non-negative."
      ],
      "theoryHI": [
        "यह रहा वह negative-maker जो पूरे illusion को चलाता है, और यह हैरान कर देने वाला सस्ता है। A - B निकालने के लिए हम कहीं भी minus का चिह्न नहीं लिखते। उसकी जगह हम B से ही B का negative बनाते हैं, सिर्फ़ दो नन्हे steps से जो कोई भी logic gate कर सकता है, और फिर जोड़ देते हैं। इस recipe को B का two's complement लेना कहते हैं।",
        "Step 1 है invert करना। B के हर एक bit को flip करो: हर 1 बने 0 और हर 0 बने 1। इस flipped pattern को one's complement कहते हैं, लिखते हैं NOT B। जैसे अगर B है 0101, तो NOT B है 1010। यह अकेला अभी B का negative नहीं है - यह एक कम है, जिसे अगला step ठीक कर देता है।",
        "Step 2 है एक जोड़ना। NOT B लो और उसमें सिर्फ़ एक 1 जोड़ दो। अब आपके पास two's complement है, और यह value adder के अंदर बिल्कुल -B की तरह बर्ताव करती है। वही अकेला +1 ही one's complement (जो लगभग-negative है) और two's complement (जो सच में -B है) के बीच का पूरा अंतर है, इसलिए इसे याद रखना ज़रूरी है।",
        "Step 3 है हमेशा की तरह जोड़ना। A और इस -B को उसी साधारण adder को सौंप दो जो आपने पहले बनाया और उसे चलने दो। चूँकि आपने उसे B का negative दिया, बाहर आने वाला जवाब बिल्कुल A - B होता है - सिर्फ़ inversion और addition से निकला हुआ।",
        "सब मिलाकर मुख्य सूत्र है A - B = A + (NOT B) + 1। इसे धीरे पढ़िए: इसमें कहीं subtraction है ही नहीं। एक inversion (NOT) है और दो additions (+1 और +A)। कोई भी minus जो आप कभी किसी computer को करते देखेंगे, असल में यही सूत्र छुपे रूप में है।",
        "इसे पक्का करने के लिए एक ठोस 4-bit उदाहरण चलाइए। मान लीजिए A = 7 (यानी 0111) और B = 5 (यानी 0101)। B को invert करके NOT B = 1010 पाओ, फिर पूरा जोड़ है 0111 + 1010 + 1 = 10010, एक 5-bit नतीजा। सबसे बाएँ की carry-out फेंक दो और बचता है 0010, यानी 2 - और सचमुच 7 - 5 = 2। ऊपर से गिरी carry सामान्य है और बस यह बताती है कि जवाब non-negative निकला।"
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
        "Meet the smallest, most powerful wire in the whole design: the Mode bit M. It is a single control line - one bit, just a 0 or a 1 - and it alone decides the personality of the circuit. Think of M as a switch on the front of the calculator that the minus key secretly flips: it chooses whether the machine is in a mood to add or in a mood to subtract.",
        "When M = 0 the unit adds. The bits of B flow through untouched, the carry-in to the bottom of the adder is 0, and so the hardware computes plain A + B. Nothing clever is happening here - it is just an adder being an adder.",
        "When M = 1 the unit subtracts. Now the bits of B are inverted on their way in, and the carry-in is set to 1, which gives A + (NOT B) + 1. From the previous scene you already know that this expression equals A - B. The same chain of full adders produced a subtraction without changing at all.",
        "Here is the clever part that makes one bit enough: M is wired straight into the carry-in of the lowest full adder. So when M = 1, that 1 flowing into the carry-in IS the '+1' of the two's complement. The single wire that selects subtract mode also delivers the plus-one the formula needs - one wire, two jobs.",
        "That is the real truth of the design. M controls the invert-B step (it tells the inverters to flip B), and the very same M supplies the +1 step (through the carry-in). One bit therefore triggers both halves of the two's-complement recipe at the exact same instant, which is why nothing else needs to switch.",
        "So strip the adder/subtractor down to its parts and it is almost embarrassingly simple: your existing full-adder chain, plus a row of controlled inverters sitting in front of B, plus the M wire routed into the carry-in. Add those two small things to the adder you already built and you have a circuit that adds and subtracts. That is all there is to it."
      ],
      "theoryHI": [
        "मिलिए पूरे design की सबसे छोटी पर सबसे ताक़तवर wire से: Mode bit M। यह एक अकेली control line है - एक bit, बस 0 या 1 - और यही अकेले circuit का स्वभाव तय करती है। M को calculator के सामने वाले उस switch की तरह सोचिए जिसे minus key चुपके से पलटाती है: यह चुनता है कि मशीन जोड़ने के मूड में है या घटाने के मूड में।",
        "जब M = 0 होता है, unit जोड़ता है। B के bits बिना छुए गुज़र जाते हैं, adder के सबसे नीचे की carry-in 0 होती है, और hardware निकालता है सीधा A + B। यहाँ कुछ चालाकी नहीं हो रही - बस एक adder, adder का काम कर रहा है।",
        "जब M = 1 होता है, unit घटाता है। अब B के bits अंदर आते-आते invert हो जाते हैं, और carry-in 1 कर दी जाती है, जिससे बनता है A + (NOT B) + 1। पिछली scene से आप पहले से जानते हैं कि यह expression A - B के बराबर है। वही full adders की chain ने बिना बदले एक subtraction निकाल दिया।",
        "यहाँ है वह चतुराई जो एक bit को काफ़ी बना देती है: M सीधे सबसे नीचे वाले full adder की carry-in से जुड़ा होता है। तो जब M = 1 होता है, carry-in में बहता वह 1 ही two's complement का '+1' है। वही एक wire जो subtract mode चुनती है, वही सूत्र का ज़रूरी plus-one भी पहुँचा देती है - एक wire, दो काम।",
        "यही design की असली सच्चाई है। M, invert-B step को control करता है (वह inverters को B flip करने को कहता है), और वही M, +1 step को देता है (carry-in के ज़रिए)। इसलिए एक bit ठीक एक ही पल में two's-complement recipe के दोनों हिस्सों को चालू कर देता है, और इसीलिए बाक़ी कुछ बदलने की ज़रूरत नहीं।",
        "तो adder/subtractor को उसके हिस्सों में तोड़ें तो वह लगभग शर्मनाक हद तक सरल है: आपकी मौजूदा full-adder chain, साथ में B के सामने बैठी controlled inverters की एक row, साथ में M wire को carry-in तक भेज देना। पहले बनाए adder में ये दो छोटी चीज़ें जोड़ दो और आपके पास एक circuit है जो जोड़ता भी है और घटाता भी। बस इतना ही है।"
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
        "We still owe one explanation: how can a single M bit reach in and invert an entire B - whether B is 4 bits, 8 bits, or 32 bits - but only when we are subtracting? The answer is an old friend used as a shape-shifter: the XOR gate. We place one XOR gate in front of every bit of B and connect M to the second input of all of them at once.",
        "The trick rests entirely on one XOR identity you already know. B XOR 0 = B, meaning the bit passes through unchanged, and B XOR 1 = NOT B, meaning the bit is flipped. That single rule - 'XOR with the control bit either passes or inverts' - is the whole mechanism, nothing more.",
        "When M = 0 the XOR gate behaves like an open door. Because B XOR 0 leaves each bit exactly as it was, the adder receives plain B and computes A + B. Every door in the row is open and B walks straight through.",
        "When M = 1 the same gate becomes a mirror. Because B XOR 1 flips each bit, the adder now receives NOT B; and since M also drives the carry-in to 1, the hardware computes A + NOT B + 1, which is A - B. The open doors became mirrors the instant M went high, and the row inverted B for us.",
        "A row of XOR gates wired this way has a name: a controlled inverter. It inverts on command and leaves the data alone otherwise. This little block is the exact, single upgrade that turns the plain adder you built into a full adder/subtractor - door when adding, mirror when subtracting.",
        "And here is the reassuring part: nothing inside the adder itself changed. Every full adder still computes sum = a ^ b ^ cin and a carry that is the majority of its inputs, exactly as before. All we did was change what 'b' looks like in the moment before it arrives at the adder - B when adding, NOT B when subtracting."
      ],
      "theoryHI": [
        "एक explanation अभी बाक़ी है: एक अकेला M bit पूरी B को - चाहे B 4 bit की हो, 8 bit की या 32 bit की - कैसे invert कर देता है, पर सिर्फ़ तभी जब हम subtract कर रहे हों? जवाब है एक पुराना दोस्त जो shape-shifter की तरह इस्तेमाल होता है: XOR gate। हम B के हर bit के सामने एक XOR gate लगाते हैं और M को उन सबके दूसरे input से एक साथ जोड़ देते हैं।",
        "पूरी trick एक XOR identity पर टिकी है जो आप पहले से जानते हैं। B XOR 0 = B, यानी bit बिना बदले गुज़र जाता है, और B XOR 1 = NOT B, यानी bit flip हो जाता है। यही एक नियम - 'control bit के साथ XOR या तो गुज़ार देता है या invert कर देता है' - पूरा mechanism है, इससे ज़्यादा कुछ नहीं।",
        "जब M = 0 होता है, XOR gate एक खुले दरवाज़े की तरह बर्ताव करता है। चूँकि B XOR 0 हर bit को वैसा ही छोड़ देता है, adder को सीधा B मिलता है और वह A + B निकालता है। row का हर दरवाज़ा खुला है और B सीधा गुज़र जाता है।",
        "जब M = 1 होता है, वही gate एक आईना बन जाता है। चूँकि B XOR 1 हर bit को flip करता है, अब adder को NOT B मिलता है; और चूँकि M, carry-in को भी 1 कर देता है, hardware A + NOT B + 1 निकालता है, जो A - B है। M के ऊँचा होते ही खुले दरवाज़े आईने बन गए, और row ने हमारे लिए B को invert कर दिया।",
        "इस तरह जुड़ी XOR gates की एक row का एक नाम है: controlled inverter। यह आदेश पर invert करता है और बाक़ी समय data को वैसा ही छोड़ देता है। यही नन्हा block वह अकेला upgrade है जो आपके बनाए साधारण adder को पूरा adder/subtractor बना देता है - जोड़ते वक़्त दरवाज़ा, घटाते वक़्त आईना।",
        "और यह रही सुकून देने वाली बात: adder के अंदर कुछ नहीं बदला। हर full adder अब भी sum = a ^ b ^ cin और inputs के majority वाला carry निकालता है, बिल्कुल पहले जैसा। हमने सिर्फ़ यह बदला कि adder तक पहुँचने से ठीक पहले 'b' कैसा दिखता है - जोड़ते वक़्त B, घटाते वक़्त NOT B।"
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
        "Let us pull the whole secret onto one page. The deception is this: a CPU has no subtractor inside it at all. Its arithmetic hardware can only add, and it reuses that one adder for every job - so the minus sign you see is a cover story, and that reuse is what keeps the chip small, cheap, and fast.",
        "The trick that hides behind the minus sign is to build the negative of B and add it. In one line: A - B = A + (NOT B) + 1. There is no subtraction in that formula - only an inversion and two additions - yet it gives the right answer every time.",
        "The negative itself is made by the two's complement. You invert every bit of B to get the one's complement (NOT B), then add 1. The bare inversion is one short of -B; that extra +1 is what makes it a clean -B in binary, which is why the step order matters.",
        "The Mode bit M is the one wire that flips the machine's mood: M = 0 makes it add A + B, M = 1 makes it subtract A - B. Cleverly, M is also wired into the carry-in, so when M = 1 it quietly supplies the '+1' the formula needs - one bit doing two jobs at once.",
        "The mechanism that lets M invert B on demand is the XOR shape-shifter: a row of XOR gates, all controlled by M, acting as a controlled inverter. At M = 0 each gate is an open door (B XOR 0 = B, pass), and at M = 1 each gate is a mirror (B XOR 1 = NOT B, flip). That is the whole magic, built from one identity.",
        "And every bit of it rested on what you already knew: the two XOR identities, the full adder with sum = a ^ b ^ cin, and the feel for borrow versus carry. The illusion is now solved. Next on the subtractor track you stop reusing the adder and build the real half-subtractor and full-subtractor circuits from scratch."
      ],
      "theoryHI": [
        "आइए पूरे राज़ को एक page पर समेट लें। Deception यह है: CPU के अंदर कोई subtractor है ही नहीं। उसका arithmetic hardware सिर्फ़ जोड़ सकता है, और वह उसी एक adder को हर काम के लिए दोबारा इस्तेमाल करता है - तो जो minus आपको दिखता है वह एक cover story है, और यही दोबारा-इस्तेमाल chip को छोटा, सस्ता और तेज़ रखता है।",
        "minus चिह्न के पीछे छुपी trick है B का negative बनाकर जोड़ देना। एक लाइन में: A - B = A + (NOT B) + 1। उस सूत्र में कोई subtraction नहीं - सिर्फ़ एक inversion और दो additions - फिर भी यह हर बार सही जवाब देता है।",
        "वह negative ख़ुद two's complement से बनता है। B के हर bit को invert करके one's complement (NOT B) पाओ, फिर 1 जोड़ो। केवल inversion -B से एक कम है; वही extra +1 इसे binary में साफ़ -B बना देता है, इसीलिए steps का क्रम मायने रखता है।",
        "Mode bit M वह अकेली wire है जो मशीन का मिज़ाज पलटती है: M = 0 उसे A + B जोड़ने देता है, M = 1 उसे A - B घटाने देता है। चतुराई से, M carry-in से भी जुड़ा होता है, तो M = 1 पर वह चुपचाप सूत्र का ज़रूरी '+1' दे देता है - एक bit एक साथ दो काम करता हुआ।",
        "M को माँग पर B invert करने देने वाला mechanism है XOR shape-shifter: M से controlled XOR gates की एक row, जो controlled inverter की तरह काम करती है। M = 0 पर हर gate एक खुला दरवाज़ा है (B XOR 0 = B, गुज़ार दो), और M = 1 पर हर gate एक आईना है (B XOR 1 = NOT B, flip)। यही पूरा जादू है, एक ही identity से बना।",
        "और इसका हर हिस्सा उसी पर टिका जो आप पहले से जानते थे: दो XOR identities, full adder जिसका sum = a ^ b ^ cin, और borrow बनाम carry की समझ। illusion अब हल हो गया। subtractor track पर आगे आप adder को दोबारा इस्तेमाल करना बंद करते हैं और असली half-subtractor तथा full-subtractor circuits शुरू से बनाते हैं।"
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
