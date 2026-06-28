import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/23 - Decoders ("The One-Hot Selector").
 * Source: dsd23.json content spec (theory, boolean equations, analogy, quiz,
 * flashcards, proofs).
 *
 * A decoder turns n binary inputs into 2^n one-hot outputs: exactly one output
 * line is HIGH per input code, and that line is the i-th minterm of the inputs.
 * 2-to-4: Y0 = A'.B', Y1 = A'.B, Y2 = A.B', Y3 = A.B (A is the MSB, B the LSB).
 * Build cost: 2^n AND gates (one per output) + n NOT gates. An enable E gates
 * every output (Yi = E.minterm_i). Because all minterms appear on their own
 * wires, OR-ing the chosen lines builds ANY sum-of-products function. The
 * central analogy threaded through every page is a classroom roll-call: the
 * teacher (the input code) calls one number and exactly ONE student (one output)
 * stands up.
 */
export const CONTENT = ({
  moduleTitle: 'Decoders - The One-Hot Selector',
  moduleSubtitle:
    'n binary inputs in, 2^n lines out, and exactly ONE of them lights up - the address decoder that turns a compressed code into a single physical who-or-where.',
  scenes: [
    {
      id: 'S00_Cover',
      label: 'The One-Hot Selector',
      kind: 'cover',
      subtitle: 'A teacher calls one roll number and exactly one student stands. That is a decoder.',
      theoryEN: [
        'This module builds the decoder, the combinational circuit that takes a short binary code on n input lines and switches on exactly one of 2^n output lines. The active output tells you which code was presented, so a decoder is really a translator: it turns a compressed binary address into one specific physical action or location. There is no clock and no memory here - change the inputs and the chosen output moves instantly.',
        'Here is the single picture to keep for the whole module: a classroom roll-call. The teacher speaks a short coded number (the n input bits, say 10 for two bits) and out of all the seated students (the 2^n output lines) exactly ONE student, the one whose ID matches that exact code, rises. Everyone else stays seated. That is the one-hot rule made physical - one HIGH at a time, never two.',
        'Each output line Di is the i-th minterm of the inputs, the single product term that is 1 for one and only one input combination. For two inputs A (the MSB) and B (the LSB), output Y2 answers only to the code 10, and its equation is Y2 = A.B prime. Because the 2^n minterms are mutually exclusive, the outputs are naturally one-hot with no extra effort.',
        'Once every minterm is sitting on its own wire, you get a bonus superpower: OR together the output lines for the minterms where your function is 1 and you have built any Boolean function in sum-of-products form. One decoder plus one OR gate per output realises real logic - we will literally build XOR this way (XOR = Y1 + Y2).',
        'By the end you will read the 2-to-4 truth table on sight, derive each minterm equation, add an enable, morph the same silicon into a demultiplexer, flip it active-low, and use the decoder as a universal SOP builder - all anchored to that one student who stands up.',
      ],
      theoryHI: [
        'इस module में हम decoder बनाएँगे, वह combinational circuit जो n input lines पर एक छोटा binary code लेती है और 2^n output lines में से ठीक एक को ON कर देती है। जो output active होता है वह बताता है कि कौन सा code दिया गया था, तो decoder असल में एक translator है: यह एक compressed binary address को एक ख़ास physical action या location में बदल देता है। यहाँ कोई clock और कोई memory नहीं - input बदलिए और चुना हुआ output तुरंत बदल जाता है।',
        'पूरे module के लिए यह एक तस्वीर पकड़े रखिए: एक classroom roll-call। teacher एक छोटा coded number बोलता है (n input bits, मान लीजिए 10, दो bits के लिए) और सभी बैठे students (2^n output lines) में से ठीक एक student, वही जिसका ID उस code से मिलता है, खड़ा होता है। बाक़ी सब बैठे रहते हैं। यही one-hot rule हक़ीक़त में है - एक बार में एक HIGH, कभी दो नहीं।',
        'हर output line Di inputs का i-th minterm है, वह अकेला product term जो किसी एक ही input combination के लिए 1 होता है। दो inputs A (MSB) और B (LSB) के लिए, output Y2 सिर्फ़ code 10 का जवाब देता है, और इसका equation है Y2 = A.B prime। चूँकि 2^n minterms आपस में mutually exclusive हैं, outputs बिना किसी अतिरिक्त मेहनत के अपने-आप one-hot होते हैं।',
        'जब हर minterm अपनी ख़ुद की wire पर बैठ जाता है, तो एक bonus superpower मिलती है: जिन minterms पर आपका function 1 है उन output lines को OR कर दीजिए और आपने sum-of-products रूप में कोई भी Boolean function बना लिया। एक decoder जमा हर output के लिए एक OR gate असली logic बनाते हैं - हम XOR को ठीक इसी तरह बनाएँगे (XOR = Y1 + Y2)।',
        'अंत तक आप 2-to-4 truth table देखते ही पढ़ लेंगे, हर minterm equation derive करेंगे, एक enable जोड़ेंगे, उसी silicon को demultiplexer में बदलेंगे, उसे active-low करेंगे, और decoder को universal SOP builder की तरह वापरेंगे - सब उसी एक student पर टिका जो खड़ा होता है।',
      ],
      transcriptEN:
        'Welcome to decoders, the one-hot selector. Picture a classroom roll-call. The teacher speaks a short coded number - the input bits - and out of all the seated students, the output lines, exactly one student stands up: the one whose personal ID matches the code. Everyone else stays seated. That is a decoder. It takes n binary inputs and drives 2^n output lines, with exactly one HIGH at any time. The active line tells you which code was presented. Each output is a minterm, the single product term true for one input combination, so for two inputs A and B the four outputs are A prime B prime, A prime B, A B prime, and A B. Add an enable and you can switch the whole chip on or off; reinterpret that enable as data and the same circuit becomes a demultiplexer. And because every minterm sits on its own wire, you can OR the lines you want to build any logic function at all. By the end the decoder will feel as simple as a teacher calling one name.',
      transcriptHI:
        'Decoders में आपका स्वागत है, the one-hot selector. एक classroom roll-call सोचिए। teacher एक छोटा coded number बोलता है - input bits - और सभी बैठे students, यानी output lines, में से ठीक एक student खड़ा होता है: वही जिसका personal ID उस code से मिलता है। बाक़ी सब बैठे रहते हैं। यही decoder है। यह n binary inputs लेता है और 2^n output lines चलाता है, किसी भी समय ठीक एक HIGH। जो line active है वह बताती है कि कौन सा code दिया गया। हर output एक minterm है, वह अकेला product term जो एक input combination के लिए सच है, तो दो inputs A और B के लिए चार outputs हैं A prime B prime, A prime B, A B prime, और A B। एक enable जोड़िए और आप पूरी chip को ON या OFF कर सकते हैं; उसी enable को data मानिए और वही circuit एक demultiplexer बन जाता है। और चूँकि हर minterm अपनी wire पर बैठा है, आप मनचाही lines को OR करके कोई भी logic function बना सकते हैं। अंत तक decoder एक teacher के किसी एक नाम बुलाने जितना आसान लगेगा।',
      visualNote:
        'Hero: a DECODER box with n thin input wires on the left labelled n and a fan of 2^n output wires on the right labelled 2^n; exactly one output wire glows to show the one-hot selection.',
    },
    {
      id: 'S01_Video',
      label: 'Decoders - The Digital Selector',
      kind: 'video',
      subtitle: 'A short film: how n bits light exactly one of 2^n lines.',
      theoryEN: [
        'Here is the whole idea in one breath before you watch. A decoder is a combinational circuit that converts up to n binary inputs into as many as 2^n separate output lines. The golden rule is simple: exactly ONE output is active at a time, and which one is active tells you the input code. There is no clock - it is pure combinational logic, so the active output follows the inputs the instant they change.',
        'Think of the input code as an ADDRESS and the outputs as numbered slots. The decoder switches on the single slot whose number equals the address, exactly the way a memory chip selects one word line or a building directory lights up one floor for the number you punched in. Only one slot can win because each output answers to one unique input combination - no two codes overlap.',
        'Mathematically each output Di equals the i-th minterm of the inputs. A minterm includes every input variable, true or complemented, so it is HIGH for one and only one row of the truth table. For inputs A1 (MSB) and A0 (LSB), the index i is just the decimal value of the binary code A1A0, so code 10 (decimal 2) lights output Y2.',
        'The video walks the 2-to-4 build: two NOT gates make the complements A1 prime and A0 prime, then four AND gates each take one specific true-or-complemented pair to form Y0 = A1 prime.A0 prime, Y1 = A1 prime.A0, Y2 = A1.A0 prime, Y3 = A1.A0. The one-hot property simply falls out of the wiring - every code makes exactly one AND gate fire.',
        'Keep one running example in your head the whole time: the teacher calls 10. Student Y2, whose ID is A1.A0 prime = 10, recognises the match and stands up, while Y0, Y1 and Y3 stay seated. One code in, one student up - that is everything a decoder does.',
      ],
      theoryHI: [
        'देखने से पहले पूरा विचार एक साँस में। एक decoder एक combinational circuit है जो अधिकतम n binary inputs को अधिकतम 2^n अलग output lines में बदलती है। golden rule सीधा है: एक बार में ठीक एक output active होता है, और कौन सा active है यह बताता है कि input code क्या था। कोई clock नहीं - यह शुद्ध combinational logic है, तो जैसे ही inputs बदलते हैं active output उसी पल बदल जाता है।',
        'input code को एक ADDRESS समझिए और outputs को numbered slots। decoder उसी अकेले slot को ON करता है जिसका number address के बराबर है, ठीक वैसे ही जैसे एक memory chip एक word line चुनता है या एक building directory आपके दबाए number के लिए एक floor जलाता है। सिर्फ़ एक slot जीत सकता है क्योंकि हर output एक unique input combination का जवाब देता है - कोई दो codes overlap नहीं करते।',
        'गणित में हर output Di inputs का i-th minterm है। एक minterm में हर input variable होता है, सीधा या complemented, तो यह truth table की किसी एक ही row के लिए HIGH होता है। inputs A1 (MSB) और A0 (LSB) के लिए, index i बस binary code A1A0 का decimal मान है, तो code 10 (decimal 2) output Y2 को जलाता है।',
        'video 2-to-4 build दिखाता है: दो NOT gates complements A1 prime और A0 prime बनाते हैं, फिर चार AND gates हर एक एक ख़ास सीधा-या-complemented pair लेकर Y0 = A1 prime.A0 prime, Y1 = A1 prime.A0, Y2 = A1.A0 prime, Y3 = A1.A0 बनाते हैं। one-hot गुण बस wiring से निकल आता है - हर code ठीक एक AND gate को fire करवाता है।',
        'पूरे समय एक उदाहरण मन में रखिए: teacher 10 बोलता है। student Y2, जिसका ID A1.A0 prime = 10 है, मिलान पहचानकर खड़ा होता है, जबकि Y0, Y1 और Y3 बैठे रहते हैं। एक code अंदर, एक student ऊपर - decoder बस यही करता है।',
      ],
      transcriptEN:
        'Here is the whole idea in one breath. A decoder converts up to n binary inputs into as many as two-to-the-n output lines, and the golden rule is that exactly one output is active at a time. Which one is active tells you the input code. There is no clock; it is pure combinational logic. Picture the input as an address and the outputs as numbered slots - the decoder switches on the single slot whose number equals the address, just like a memory chip selecting one word line. Each output is a minterm: for inputs A1 and A0, the four outputs are A1 prime A0 prime, A1 prime A0, A1 A0 prime, and A1 A0. The index of the active output is just the decimal value of the code, so code one-zero lights output Y2. The build is two NOT gates for the complements and four AND gates, one per output. The one-hot property simply falls out of the wiring: every code makes exactly one AND gate fire. Hold one example throughout: the teacher calls one-zero, and student Y2, whose ID is A1 A0 prime equals one-zero, stands up while everyone else stays seated.',
      transcriptHI:
        'पूरा विचार एक साँस में। एक decoder अधिकतम n binary inputs को अधिकतम two-to-the-n output lines में बदलता है, और golden rule यह है कि एक बार में ठीक एक output active होता है। कौन सा active है यह input code बताता है। कोई clock नहीं; यह शुद्ध combinational logic है। input को एक address समझिए और outputs को numbered slots - decoder उसी अकेले slot को ON करता है जिसका number address के बराबर है, ठीक एक memory chip की तरह जो एक word line चुनता है। हर output एक minterm है: inputs A1 और A0 के लिए चार outputs हैं A1 prime A0 prime, A1 prime A0, A1 A0 prime, और A1 A0। active output का index बस code का decimal मान है, तो code one-zero output Y2 जलाता है। build है complements के लिए दो NOT gates और चार AND gates, हर output के लिए एक। one-hot गुण बस wiring से निकलता है: हर code ठीक एक AND gate को fire करवाता है। पूरे समय एक उदाहरण पकड़े रखिए: teacher one-zero बोलता है, और student Y2, जिसका ID A1 A0 prime बराबर one-zero है, खड़ा होता है जबकि बाक़ी सब बैठे रहते हैं।',
      visualNote:
        'Animated explainer: an n-input DECODER box; a dial sets a binary code, a fan of 2^n output lamps with only the addressed one glowing, and the matching minterm equation appearing beside it.',
    },
    {
      id: 'S02_NinTwoPowN',
      label: 'n In, 2^n Out',
      kind: 'theory',
      subtitle: 'The output count is always 2 raised to the number of inputs.',
      theoryEN: [
        'Start with the headline fact: a decoder with n input lines produces up to 2^n output lines, because each distinct input combination deserves its own output. Two inputs give four outputs (a 2-to-4 decoder), three inputs give eight (3-to-8), four inputs give sixteen (4-to-16). The output count is simply 2 raised to the number of inputs, every time.',
        'The defining behaviour - the golden rule - is that exactly ONE output is active at any moment. This is called one-hot: among all 2^n lines, a single line is HIGH and the rest are LOW. The position of that single HIGH line names the input code, so reading a decoder output is like reading which student stood up to know which roll number the teacher called.',
        'A decoder is purely combinational, meaning there is no clock and no stored state. If the inputs change, the active output shifts instantly to follow them. Compare this to the roll-call: the moment the teacher calls a new number, a different student stands and the previous one sits down, with no waiting and no memory of the past.',
        'Because the circuit is just translating a code, it does the same job as countless real systems: selecting one memory word out of many, lighting one floor in a building directory, enabling one chip on a shared bus. Anywhere a compressed address must pick exactly one physical target, a decoder is doing the work. Toggle the inputs in the interactive below and watch the lit line jump.',
      ],
      theoryHI: [
        'मुख्य तथ्य से शुरू कीजिए: n input lines वाला एक decoder अधिकतम 2^n output lines बनाता है, क्योंकि हर अलग input combination अपने ख़ुद के output का हक़दार है। दो inputs चार outputs देते हैं (एक 2-to-4 decoder), तीन inputs आठ (3-to-8), चार inputs सोलह (4-to-16)। output की गिनती बस 2 की inputs जितनी घात है, हर बार।',
        'परिभाषित व्यवहार - golden rule - यह है कि किसी भी पल ठीक एक output active होता है। इसे one-hot कहते हैं: सभी 2^n lines में से एक अकेली line HIGH होती है और बाक़ी LOW। उस अकेली HIGH line की जगह input code का नाम बताती है, तो decoder का output पढ़ना ऐसा है जैसे यह देखना कि कौन सा student खड़ा हुआ ताकि पता चले teacher ने कौन सा roll number बुलाया।',
        'एक decoder शुद्ध combinational है, यानी कोई clock और कोई stored state नहीं। अगर inputs बदलते हैं, active output तुरंत उनके पीछे चल पड़ता है। इसकी तुलना roll-call से कीजिए: जैसे ही teacher एक नया number बुलाता है, एक अलग student खड़ा होता है और पिछला बैठ जाता है, बिना किसी इंतज़ार और बिना अतीत की कोई memory के।',
        'चूँकि circuit बस एक code का translate कर रही है, यह वही काम करती है जो अनगिनत असली systems करते हैं: कई memory words में से एक चुनना, building directory में एक floor जलाना, shared bus पर एक chip enable करना। जहाँ भी एक compressed address को ठीक एक physical target चुनना हो, वहाँ एक decoder काम कर रहा है। नीचे interactive में inputs toggle कीजिए और जली हुई line को कूदते देखिए।',
      ],
      transcriptEN:
        'Start with the headline: a decoder with n inputs produces up to two-to-the-n outputs, because each input combination deserves its own line. Two inputs give four, three give eight, four give sixteen. The golden rule is that exactly one output is active at a time - one-hot - and the position of that single HIGH line names the input code. It is purely combinational: no clock, no memory, so the active output shifts instantly when the inputs change. It is the same job a memory chip does selecting one word line, or a directory lighting one floor. Toggle the inputs and watch the lit line jump.',
      transcriptHI:
        'मुख्य बात से शुरू: n inputs वाला एक decoder अधिकतम two-to-the-n outputs बनाता है, क्योंकि हर input combination अपनी line का हक़दार है। दो inputs चार देते हैं, तीन आठ, चार सोलह। golden rule यह है कि एक बार में ठीक एक output active होता है - one-hot - और उस अकेली HIGH line की जगह input code का नाम बताती है। यह शुद्ध combinational है: कोई clock नहीं, कोई memory नहीं, तो inputs बदलने पर active output तुरंत बदल जाता है। यह वही काम है जो एक memory chip एक word line चुनते हुए करता है, या एक directory एक floor जलाते हुए। inputs toggle कीजिए और जली line को कूदते देखिए।',
      visualNote:
        'DecoderViz (bits=2): two toggle bits A,B set a code; four output cells Y0..Y3 with exactly one lit, each labelled with its minterm.',
    },
    {
      id: 'S03_Minterms',
      label: 'Outputs Are Minterms',
      kind: 'theory',
      subtitle: 'Each output line is the i-th minterm - the math core of one-hot.',
      theoryEN: [
        'Now the mathematical heart of the decoder: each output line Di equals the i-th MINTERM of the n input variables. A minterm is a product term that includes every single input variable, each one either true or complemented, so it evaluates to 1 for exactly one row of the truth table and 0 for all the others. That is precisely the behaviour we want from a one-hot output.',
        'Take the two-input case with A1 the MSB and A0 the LSB. The four minterms are m0 = A1 prime.A0 prime, m1 = A1 prime.A0, m2 = A1.A0 prime, and m3 = A1.A0. The index i of each minterm is simply the decimal value of the binary code: m2 is HIGH for the code 10, which is decimal 2, so it lands on output Y2.',
        'Because the 2^n minterms are mutually exclusive (no two can be 1 for the same input) and collectively exhaustive (every input lights exactly one of them), the decoder outputs are one-hot for free. You do not have to engineer the single-HIGH rule; it is a mathematical property of minterms that the gate wiring inherits automatically.',
        'This is why a decoder is often called a minterm generator: it physically materialises every minterm of its inputs on a separate wire, all at once. That single idea - every minterm available on its own line - is what makes the decoder so powerful as a building block, and it is the foundation for the universal-logic trick we reach later in the module.',
        'In the roll-call picture, each student personal ID is exactly one minterm: student Y2 only answers to A1.A0 prime, a code that one and only one student in the room recognises. Walk the truth table below and watch the single 1 march down the diagonal as the code climbs 00, 01, 10, 11.',
      ],
      theoryHI: [
        'अब decoder का गणितीय दिल: हर output line Di n input variables का i-th MINTERM है। एक minterm एक product term है जिसमें हर एक input variable होता है, हर एक या तो सीधा या complemented, तो यह truth table की ठीक एक row के लिए 1 और बाक़ी सबके लिए 0 होता है। यही ठीक वह व्यवहार है जो हमें one-hot output से चाहिए।',
        'दो-input केस लीजिए जिसमें A1 MSB और A0 LSB है। चार minterms हैं m0 = A1 prime.A0 prime, m1 = A1 prime.A0, m2 = A1.A0 prime, और m3 = A1.A0। हर minterm का index i बस binary code का decimal मान है: m2 code 10 के लिए HIGH है, जो decimal 2 है, तो यह output Y2 पर बैठता है।',
        'चूँकि 2^n minterms आपस में mutually exclusive हैं (एक ही input के लिए कोई दो 1 नहीं हो सकते) और collectively exhaustive (हर input ठीक एक को जलाता है), decoder outputs मुफ़्त में one-hot होते हैं। आपको single-HIGH नियम बनाना नहीं पड़ता; यह minterms का गणितीय गुण है जिसे gate wiring अपने-आप विरासत में पाती है।',
        'इसीलिए decoder को अक्सर minterm generator कहते हैं: यह अपने inputs के हर minterm को एक अलग wire पर, सब एक साथ, physically बना देता है। वही एक विचार - हर minterm अपनी line पर उपलब्ध - decoder को एक building block के रूप में इतना शक्तिशाली बनाता है, और यही module में आगे आने वाली universal-logic trick की नींव है।',
        'roll-call तस्वीर में, हर student का personal ID ठीक एक minterm है: student Y2 सिर्फ़ A1.A0 prime का जवाब देता है, एक code जिसे कमरे में सिर्फ़ एक ही student पहचानता है। नीचे truth table पर चलिए और देखिए कि जैसे code 00, 01, 10, 11 चढ़ता है अकेला 1 diagonal के नीचे कैसे मार्च करता है।',
      ],
      transcriptEN:
        'Now the mathematical heart. Each output Di equals the i-th minterm of the inputs. A minterm includes every input variable, true or complemented, so it is 1 for exactly one truth-table row. For two inputs A1 and A0, the four minterms are A1 prime A0 prime, A1 prime A0, A1 A0 prime, and A1 A0, and the index is the decimal value of the code, so m2 lands on Y2 for code one-zero. Because the minterms are mutually exclusive and collectively exhaustive, the outputs are one-hot for free - you never engineer the single-HIGH rule, it is inherited. That is why a decoder is a minterm generator: every minterm appears on its own wire at once. Watch the single 1 march down the diagonal as the code climbs.',
      transcriptHI:
        'अब गणितीय दिल। हर output Di inputs का i-th minterm है। एक minterm में हर input variable होता है, सीधा या complemented, तो यह ठीक एक truth-table row के लिए 1 है। दो inputs A1 और A0 के लिए चार minterms हैं A1 prime A0 prime, A1 prime A0, A1 A0 prime, और A1 A0, और index code का decimal मान है, तो code one-zero के लिए m2 Y2 पर बैठता है। चूँकि minterms mutually exclusive और collectively exhaustive हैं, outputs मुफ़्त में one-hot हैं - आप single-HIGH नियम कभी नहीं बनाते, यह विरासत में मिलता है। इसीलिए decoder एक minterm generator है: हर minterm एक साथ अपनी wire पर दिखता है। देखिए कैसे code चढ़ते ही अकेला 1 diagonal के नीचे मार्च करता है।',
      visualNote:
        'Truth table for 2-to-4: A1 A0 | Y0 Y1 Y2 Y3 with a single 1 walking down the diagonal (00->Y0, 01->Y1, 10->Y2, 11->Y3).',
    },
    {
      id: 'S04_Hardware',
      label: 'Inside The 2-to-4 Hardware',
      kind: 'theory',
      subtitle: 'Four AND gates, two NOT gates, and the one-hot property emerges.',
      theoryEN: [
        'Time to open the box and see the actual gates. A standard 2-to-4 decoder is built from exactly 4 AND gates - one per output - and 2 NOT gates that produce the complements A1 prime and A0 prime. That is the whole part list: six gates, and you could wire it on a breadboard this afternoon.',
        'Each AND gate is fed one specific combination of true and complemented inputs so that it fires for its own unique code. Y0 = A1 prime.A0 prime is HIGH only when both inputs are 0; Y1 = A1 prime.A0 is HIGH for code 01; Y2 = A1.A0 prime is HIGH for code 10; and Y3 = A1.A0 is HIGH when both inputs are 1. Each gate watches for one pattern and ignores the other three.',
        'Notice that the one-hot guarantee is not a separate piece of circuitry - it emerges purely from this wiring. For any input code, exactly one AND gate has all of its inputs HIGH at the same time, so exactly one output goes to 1 and the other three stay 0. The mathematics of mutually exclusive minterms becomes a physical fact the instant you connect the wires.',
        'The pattern generalises cleanly. An n-to-2^n decoder needs 2^n AND gates (one for each output minterm) and n NOT gates (one to complement each input), where each AND gate has n inputs. So a 3-to-8 decoder is 8 AND gates plus 3 NOT gates, and a 4-to-16 is 16 AND gates plus 4 NOT gates - the cost is predictable and grows exactly with the output count.',
        'In roll-call terms, each AND gate is one student listening for their exact ID: student Y2 only stands when it hears A1 = 1 AND A0 prime = 1, that is the code 10. Below, the live gates compute each output for whatever code you set, so you can confirm by eye that only one fires.',
      ],
      theoryHI: [
        'अब डिब्बा खोलकर असली gates देखने का समय। एक standard 2-to-4 decoder ठीक 4 AND gates से बनता है - हर output के लिए एक - और 2 NOT gates से जो complements A1 prime और A0 prime बनाते हैं। यही पूरी part list है: छह gates, और आप इसे आज दोपहर breadboard पर wire कर सकते हैं।',
        'हर AND gate को सीधे और complemented inputs का एक ख़ास combination दिया जाता है ताकि यह अपने unique code के लिए fire करे। Y0 = A1 prime.A0 prime सिर्फ़ तब HIGH है जब दोनों inputs 0 हों; Y1 = A1 prime.A0 code 01 के लिए HIGH है; Y2 = A1.A0 prime code 10 के लिए HIGH है; और Y3 = A1.A0 तब HIGH है जब दोनों inputs 1 हों। हर gate एक pattern की ताक में रहता है और बाक़ी तीन को नज़रअंदाज़ करता है।',
        'ग़ौर कीजिए कि one-hot guarantee कोई अलग circuitry नहीं है - यह बस इसी wiring से निकलता है। किसी भी input code के लिए, ठीक एक AND gate के सारे inputs एक ही समय HIGH होते हैं, तो ठीक एक output 1 हो जाता है और बाक़ी तीन 0 रहते हैं। mutually exclusive minterms का गणित उसी पल एक physical सच बन जाता है जब आप wires जोड़ते हैं।',
        'pattern साफ़-साफ़ generalise होता है। एक n-to-2^n decoder को 2^n AND gates चाहिए (हर output minterm के लिए एक) और n NOT gates (हर input को complement करने को एक), जहाँ हर AND gate के n inputs हैं। तो एक 3-to-8 decoder 8 AND gates जमा 3 NOT gates है, और एक 4-to-16, 16 AND gates जमा 4 NOT gates - लागत अनुमान योग्य है और ठीक output गिनती के साथ बढ़ती है।',
        'roll-call की भाषा में, हर AND gate एक student है जो अपना ठीक ID सुन रहा है: student Y2 सिर्फ़ तब खड़ा होता है जब वह A1 = 1 AND A0 prime = 1 सुने, यानी code 10। नीचे live gates आपके सेट किए किसी भी code के लिए हर output निकालते हैं, तो आप आँख से पुष्टि कर सकते हैं कि सिर्फ़ एक fire करता है।',
      ],
      transcriptEN:
        'Open the box. A standard 2-to-4 decoder is four AND gates, one per output, and two NOT gates for the complements A1 prime and A0 prime. Each AND gate is fed one specific true-or-complemented pair so it fires for its own code: Y0 is A1 prime A0 prime, Y1 is A1 prime A0, Y2 is A1 A0 prime, Y3 is A1 A0. The one-hot guarantee is not extra circuitry - it emerges from the wiring, because for any code exactly one AND gate has all its inputs high. It generalises: an n-to-2^n decoder needs two-to-the-n AND gates and n NOT gates, each AND with n inputs. So three-to-eight is eight ANDs and three NOTs. Each AND gate is one student listening for an exact ID.',
      transcriptHI:
        'डिब्बा खोलिए। एक standard 2-to-4 decoder चार AND gates है, हर output के लिए एक, और complements A1 prime और A0 prime के लिए दो NOT gates। हर AND gate को एक ख़ास सीधा-या-complemented pair दिया जाता है ताकि यह अपने code के लिए fire करे: Y0 है A1 prime A0 prime, Y1 है A1 prime A0, Y2 है A1 A0 prime, Y3 है A1 A0। one-hot guarantee कोई अतिरिक्त circuitry नहीं - यह wiring से निकलता है, क्योंकि किसी भी code के लिए ठीक एक AND gate के सारे inputs high होते हैं। यह generalise होता है: एक n-to-2^n decoder को two-to-the-n AND gates और n NOT gates चाहिए, हर AND के n inputs। तो three-to-eight आठ ANDs और तीन NOTs है। हर AND gate एक student है जो अपना ठीक ID सुन रहा है।',
      visualNote:
        'Gate schematic: A1, A0 each split into a buffer and a NOT giving A1 prime, A0 prime; four 2-input AND gates fed the proper pairs; LiveGate panels compute each Y for the chosen code.',
    },
    {
      id: 'S05_Enable',
      label: 'The Enable Input',
      kind: 'theory',
      subtitle: 'One extra line that switches the whole chip on or off: Yi = E.minterm_i.',
      theoryEN: [
        'Real decoder chips add one more input called ENABLE, written E, and it controls the entire chip at once. Think of E as the teacher permission to answer at all: if E = 0 the whole class must stay silent, and if E = 1 the normal roll-call proceeds. One line, total control over every output.',
        'The behaviour is exactly that. When E = 0, ALL outputs are forced to 0 - the chip is silent, no output is active, and the one-hot rule is suspended because not even one line is HIGH. When E = 1, the decoder behaves normally and the selected minterm output goes HIGH as usual. Nothing else about the addressing changes.',
        'The implementation is beautifully cheap: feed E into every AND gate as an extra input, so each output becomes Yi = E.minterm_i. With E = 0 the product is 0 no matter what the address bits are; with E = 1 the product reduces back to the plain minterm. The detection of the address is untouched - E just gates the result.',
        'Why bother with an enable at all? Two big reasons. First, you can disable a chip when it is not being addressed, which matters when many chips share a bus and only one should respond at a time. Second, and more elegantly, the enable lets you cascade decoders: feed the high address bit and its complement into the enables of two smaller decoders and you have built the next size up, a 3-to-8 from two 2-to-4s.',
        'Toggle E in the panel below. With E = 1 you get the familiar one student standing; flip E to 0 and the entire class sits down at once, every output zeroed regardless of the code on the address lines.',
      ],
      theoryHI: [
        'असली decoder chips एक और input जोड़ती हैं जिसे ENABLE कहते हैं, E लिखा जाता है, और यह पूरी chip को एक साथ control करता है। E को teacher की जवाब देने की अनुमति समझिए: अगर E = 0 तो पूरी class को चुप रहना है, और अगर E = 1 तो सामान्य roll-call चलता है। एक line, हर output पर पूरा control।',
        'व्यवहार बिलकुल वही है। जब E = 0, सारे outputs 0 कर दिए जाते हैं - chip चुप है, कोई output active नहीं, और one-hot rule निलंबित है क्योंकि एक भी line HIGH नहीं। जब E = 1, decoder सामान्य रूप से काम करता है और चुना minterm output हमेशा की तरह HIGH हो जाता है। addressing के बारे में और कुछ नहीं बदलता।',
        'implementation ख़ूबसूरती से सस्ता है: E को हर AND gate में एक अतिरिक्त input के रूप में feed कीजिए, तो हर output बन जाता है Yi = E.minterm_i। E = 0 के साथ product 0 है चाहे address bits कुछ भी हों; E = 1 के साथ product वापस सादे minterm में घट जाता है। address की पहचान अछूती रहती है - E बस नतीजे को gate करता है।',
        'enable की ज़रूरत ही क्यों? दो बड़े कारण। पहला, आप एक chip को disable कर सकते हैं जब उसे address नहीं किया जा रहा, जो तब मायने रखता है जब कई chips एक bus साझा करें और एक बार में सिर्फ़ एक को जवाब देना हो। दूसरा, और ज़्यादा सुरुचिपूर्ण, enable आपको decoders cascade करने देता है: high address bit और उसके complement को दो छोटे decoders के enables में feed कीजिए और आपने अगला बड़ा size बना लिया, दो 2-to-4 से एक 3-to-8।',
        'नीचे panel में E toggle कीजिए। E = 1 के साथ आपको जाना-पहचाना एक student खड़ा मिलता है; E को 0 कीजिए और पूरी class एक साथ बैठ जाती है, हर output 0 चाहे address lines पर code कुछ भी हो।',
      ],
      transcriptEN:
        'Real chips add one more input, ENABLE, written E, and it controls the whole chip at once. Think of E as the teacher permission to answer: E equals zero, the class stays silent; E equals one, the roll-call proceeds. When E is zero, all outputs are forced to zero and the one-hot rule is suspended. When E is one, the decoder works normally. The implementation is cheap: feed E into every AND gate, so each output becomes E AND the minterm. E zero makes every product zero; E one reduces back to the plain minterm. Why bother? You can disable a chip not being addressed, and you can cascade decoders by driving the enables of two smaller decoders with the high address bit and its complement - a three-to-eight from two two-to-fours. Toggle E and watch the whole class sit down at once.',
      transcriptHI:
        'असली chips एक और input जोड़ती हैं, ENABLE, E लिखा जाता है, और यह पूरी chip को एक साथ control करता है। E को teacher की जवाब देने की अनुमति समझिए: E बराबर शून्य, class चुप रहती है; E बराबर एक, roll-call चलता है। जब E शून्य है, सारे outputs शून्य कर दिए जाते हैं और one-hot rule निलंबित है। जब E एक है, decoder सामान्य रूप से काम करता है। implementation सस्ता है: E को हर AND gate में feed कीजिए, तो हर output बन जाता है E AND minterm। E शून्य हर product शून्य बनाता है; E एक वापस सादे minterm में घट जाता है। ज़रूरत क्यों? आप उस chip को disable कर सकते हैं जिसे address नहीं किया जा रहा, और आप decoders cascade कर सकते हैं, दो छोटे decoders के enables को high address bit और उसके complement से चलाकर - दो two-to-four से एक three-to-eight। E toggle कीजिए और पूरी class को एक साथ बैठते देखिए।',
      visualNote:
        'The 2-to-4 schematic redrawn with each AND gate now 3-input, the extra input a shared E line; an E toggle that, at E=0, greys out and zeroes every output at once.',
    },
    {
      id: 'S06_Demux',
      label: 'Decoder vs Demultiplexer',
      kind: 'theory',
      subtitle: 'Same silicon, new role: reinterpret the enable as a data input.',
      theoryEN: [
        'Here is a lovely twist: a demultiplexer (DEMUX) and a decoder are the same circuit wearing different hats. A DEMUX routes ONE data input to one of many outputs, chosen by select lines. To turn a 2-to-4 decoder into a 1-to-4 DEMUX you do not change a single gate - you simply reinterpret the Enable pin as the Data input and the address pins as the Select lines.',
        'Read the new roles carefully. In the 1-to-4 DEMUX, the line that was E becomes Data, and A1 and A0 become the Select lines that choose the destination. The selection logic is identical; only the name and the meaning of the bottom pin change. The minterm that used to pick which output is HIGH now picks which output receives the data.',
        'Watch the data flow. If Data (the old E) is 1, exactly one output mirrors that 1 - the one chosen by the select lines - while all others are 0. If Data is 0, the selected output passes a 0. Either way the data value is faithfully steered to exactly one chosen line, because each output is Yi = Data.minterm_i(select).',
        'So the equation makes the duality crisp: a decoder is Yi = E.minterm_i and a 1-to-2^n DEMUX is Yi = Data.minterm_i(select). When the bottom pin is held as an enable you call it a decoder; when you actively drive a data stream into it you call it a demultiplexer. Same silicon, two names, chosen by what you connect to that one pin.',
        'In roll-call terms, the decoder is a teacher checking attendance (is this student present? yes or no), while the DEMUX is a teacher handing a single note to exactly one chosen student. The address still selects the same student - you have just changed what flows down the selected wire. The interactive below shows the one data line routed to the single selected output.',
      ],
      theoryHI: [
        'यहाँ एक प्यारा मोड़ है: एक demultiplexer (DEMUX) और एक decoder एक ही circuit हैं जो अलग-अलग टोपियाँ पहने हैं। एक DEMUX एक data input को कई outputs में से एक तक भेजता है, select lines से चुना हुआ। एक 2-to-4 decoder को 1-to-4 DEMUX बनाने के लिए आप एक भी gate नहीं बदलते - आप बस Enable pin को Data input और address pins को Select lines मान लेते हैं।',
        'नई भूमिकाएँ ध्यान से पढ़िए। 1-to-4 DEMUX में, जो line E थी वह Data बन जाती है, और A1 तथा A0 Select lines बन जाती हैं जो destination चुनती हैं। selection logic बिलकुल वही है; सिर्फ़ नीचे वाले pin का नाम और अर्थ बदलता है। जो minterm पहले चुनता था कि कौन सा output HIGH हो, अब चुनता है कि कौन सा output data पाए।',
        'data flow देखिए। अगर Data (पुराना E) 1 है, तो ठीक एक output उस 1 को mirror करता है - वही जिसे select lines चुनती हैं - जबकि बाक़ी सब 0 हैं। अगर Data 0 है, तो चुना output एक 0 पास करता है। दोनों ही तरह data मान ईमानदारी से ठीक एक चुनी line तक भेजा जाता है, क्योंकि हर output Yi = Data.minterm_i(select) है।',
        'तो equation duality को साफ़ कर देता है: एक decoder Yi = E.minterm_i है और एक 1-to-2^n DEMUX Yi = Data.minterm_i(select) है। जब नीचे वाला pin enable के रूप में रखा हो तो इसे decoder कहते हैं; जब आप उसमें सक्रिय रूप से एक data stream चलाएँ तो इसे demultiplexer कहते हैं। वही silicon, दो नाम, इस आधार पर चुने कि आप उस एक pin से क्या जोड़ते हैं।',
        'roll-call की भाषा में, decoder एक teacher है जो हाज़िरी जाँच रहा है (क्या यह student मौजूद है? हाँ या ना), जबकि DEMUX एक teacher है जो एक अकेली पर्ची ठीक एक चुने student को थमाता है। address अब भी वही student चुनता है - आपने बस बदल दिया कि चुनी wire से क्या बहता है। नीचे interactive एक data line को अकेले चुने output तक भेजा हुआ दिखाता है।',
      ],
      transcriptEN:
        'A demultiplexer and a decoder are the same circuit wearing different hats. A DEMUX routes one data input to one of many outputs chosen by select lines. To turn a 2-to-4 decoder into a 1-to-4 DEMUX you change no gates - you reinterpret the enable pin as data and the address pins as select. If data is one, exactly one output, chosen by the selects, mirrors that one; if data is zero, the selected output passes a zero. Either way the data is steered to one chosen line, because each output is data AND the select minterm. The equation makes it crisp: a decoder is E AND minterm, a demux is data AND minterm of the selects. Same silicon, two names, decided by what you wire to that bottom pin.',
      transcriptHI:
        'एक demultiplexer और एक decoder एक ही circuit हैं जो अलग टोपियाँ पहने हैं। एक DEMUX एक data input को select lines से चुने कई outputs में से एक तक भेजता है। एक 2-to-4 decoder को 1-to-4 DEMUX बनाने के लिए आप कोई gate नहीं बदलते - आप enable pin को data और address pins को select मान लेते हैं। अगर data एक है, तो select से चुना ठीक एक output उस एक को mirror करता है; अगर data शून्य है, तो चुना output एक शून्य पास करता है। दोनों तरह data एक चुनी line तक भेजा जाता है, क्योंकि हर output data AND select minterm है। equation इसे साफ़ करता है: एक decoder E AND minterm है, एक demux data AND selects का minterm है। वही silicon, दो नाम, इस से तय कि आप उस नीचे वाले pin से क्या wire करते हैं।',
      visualNote:
        'Two side-by-side blocks: left DECODER (A1,A0 in, Y0..Y3 out, E enable at bottom); right 1-to-4 DEMUX with A1,A0 as select dials and E relabelled E (Data Input); a DemuxViz routes one D to the selected output.',
    },
    {
      id: 'S07_ActiveLow',
      label: 'Active-High vs Active-Low',
      kind: 'theory',
      subtitle: 'Same selection, flipped polarity: one LOW among HIGHs.',
      theoryEN: [
        'So far every decoder has been active-high: the selected output goes to 1 and all the others stay 0. That is the natural minterm form you have been watching. But many real chips do the opposite, and it is worth understanding why the difference is only skin deep.',
        'An active-low decoder selects the same output, but it drives that output to 0 (LOW) while all the others sit at 1 (HIGH). You build it by inverting each output, which in practice means using a NAND gate instead of an AND gate for every minterm. The selected NAND pulls its line LOW; the rest stay HIGH.',
        'Algebraically, an active-low output is Yi = (minterm_i) prime - the complement of the minterm, which is the maxterm. Exactly one output is LOW at a time, so it is still one-hot in spirit, just with inverted polarity: instead of one HIGH among LOWs, you read one LOW among HIGHs. The crucial point is that the SELECTION is identical - the same code still picks the same line.',
        'Why would a designer choose active-low? Because it matches the rest of the system. In real ICs like the 74138, chip-select, output-enable and memory-read lines are conventionally active-low, so an active-low decoder drops straight into that world without extra inverters. The voltage convention of active simply flips to agree with the chips around it.',
        'In the roll-call, active-high is everyone seated except the chosen student who stands; active-low is everyone standing except the chosen student who raises a hand (sits) - the same student is selected, you are just reading the inverse signal. The two truth tables below differ in exactly one thing: where the single 1 sits versus where the single 0 sits.',
      ],
      theoryHI: [
        'अब तक हर decoder active-high रहा है: चुना output 1 हो जाता है और बाक़ी सब 0 रहते हैं। यही जाना-पहचाना minterm रूप है जो आप देखते आए हैं। पर कई असली chips उल्टा करती हैं, और यह समझना ज़रूरी है कि यह फ़र्क़ बस सतही है।',
        'एक active-low decoder वही output चुनता है, पर उस output को 0 (LOW) कर देता है जबकि बाक़ी सब 1 (HIGH) पर बैठे रहते हैं। आप इसे हर output को invert करके बनाते हैं, जिसका व्यवहार में मतलब है हर minterm के लिए AND gate की जगह NAND gate वापरना। चुना NAND अपनी line को LOW खींचता है; बाक़ी HIGH रहते हैं।',
        'बीजगणित में, एक active-low output Yi = (minterm_i) prime है - minterm का complement, जो maxterm है। एक बार में ठीक एक output LOW होता है, तो यह भावना में अब भी one-hot है, बस उल्टी polarity के साथ: LOWs के बीच एक HIGH के बजाय, आप HIGHs के बीच एक LOW पढ़ते हैं। अहम बात यह है कि SELECTION बिलकुल वही है - वही code अब भी वही line चुनता है।',
        'एक designer active-low क्यों चुनेगा? क्योंकि यह बाक़ी system से मेल खाता है। 74138 जैसी असली ICs में, chip-select, output-enable और memory-read lines परंपरा से active-low होती हैं, तो एक active-low decoder बिना अतिरिक्त inverters के सीधे उस दुनिया में फ़िट हो जाता है। active का voltage convention बस आसपास की chips से सहमत होने के लिए flip हो जाता है।',
        'roll-call में, active-high सब बैठे सिवाय चुने student के जो खड़ा होता है; active-low सब खड़े सिवाय चुने student के जो हाथ उठाता है (बैठता है) - वही student चुना जाता है, आप बस उल्टा signal पढ़ रहे हैं। नीचे दो truth tables ठीक एक चीज़ में अलग हैं: अकेला 1 कहाँ बैठता है बनाम अकेला 0 कहाँ बैठता है।',
      ],
      transcriptEN:
        'So far every decoder has been active-high: the selected output goes to one, the rest stay zero. An active-low decoder selects the same line but drives it to zero while all others sit at one - built by using a NAND gate instead of an AND for each minterm. Algebraically the output is the complement of the minterm, the maxterm, so exactly one output is LOW at a time. It is still one-hot, just inverted: one LOW among HIGHs. The selection is identical - the same code picks the same line. Designers use active-low because real chips like the 74138 have active-low chip-select and enable lines, so it drops right in. In the roll-call, instead of one student standing, everyone stands except the chosen one who sits - the same student selected, the inverse signal read.',
      transcriptHI:
        'अब तक हर decoder active-high रहा है: चुना output एक हो जाता है, बाक़ी शून्य रहते हैं। एक active-low decoder वही line चुनता है पर उसे शून्य कर देता है जबकि बाक़ी सब एक पर बैठे रहते हैं - हर minterm के लिए AND की जगह NAND gate वापरकर बना। बीजगणित में output minterm का complement है, maxterm, तो एक बार में ठीक एक output LOW होता है। यह अब भी one-hot है, बस उल्टा: HIGHs के बीच एक LOW। selection बिलकुल वही है - वही code वही line चुनता है। designers active-low वापरते हैं क्योंकि 74138 जैसी असली chips में active-low chip-select और enable lines होती हैं, तो यह सीधे फ़िट हो जाता है। roll-call में, एक student खड़े होने के बजाय, सब खड़े होते हैं सिवाय चुने एक के जो बैठता है - वही student चुना, उल्टा signal पढ़ा।',
      visualNote:
        'Two truth tables side by side: active-high (a single 1 among 0s) and active-low (a single 0 among 1s), with the selected row circled in each.',
    },
    {
      id: 'S08_BuildAnyFunction',
      label: 'Build Any Function With A Decoder',
      kind: 'theory',
      subtitle: 'OR the minterm lines where F=1 - that is XOR in one OR gate.',
      theoryEN: [
        'Now the payoff that makes decoders a design tool, not just a selector. Because a decoder outputs every minterm of its inputs on its own line, you can build ANY Boolean function in sum-of-products (SOP) form with almost no thinking. The recipe is mechanical: list the minterms where your function is 1, wire exactly those output lines into a single OR gate, done.',
        'Any function F of n variables can be written canonically as the sum of the minterms in its on-set, the set of input codes where F = 1. The decoder has already produced Di = minterm_i on a physical wire for every i, so F is literally the OR of the decoder outputs whose indices are in the on-set: F = OR of the selected Di. The OR gate just has one input per minterm you need.',
        'Take the cleanest example: XOR. The function F(A,B) = A prime.B + A.B prime is the sum of minterms 1 and 2. On a 2-to-4 decoder those are outputs Y1 and Y2, so XOR is built as OR(Y1, Y2) - one decoder and one OR gate, and you have exclusive-OR with no Karnaugh map and no algebra to minimise.',
        'The economy gets better when you need several functions of the same inputs. One decoder serves them all: each output function simply gets its own OR gate tapping the minterm lines it needs. The classic case is a full adder, where SUM and CARRY are both read off a single 3-to-8 decoder, SUM = OR(D1,D2,D4,D7) and CARRY = OR(D3,D5,D6,D7), sharing the same eight minterm wires.',
        'This is why the decoder is a universal, beautifully readable design method. You never minimise; you just translate the truth table directly into hardware: pick the rows where the output is 1, OR those lines, and the circuit is correct by construction. The interactive below shows OR(Y1,Y2) computing XOR for whatever A and B you set.',
      ],
      theoryHI: [
        'अब वह फ़ायदा जो decoders को सिर्फ़ एक selector नहीं बल्कि एक design tool बनाता है। चूँकि एक decoder अपने inputs के हर minterm को उसकी ख़ुद की line पर देता है, आप sum-of-products (SOP) रूप में लगभग बिना सोचे कोई भी Boolean function बना सकते हैं। नुस्ख़ा यांत्रिक है: जिन minterms पर आपका function 1 है उन्हें सूचीबद्ध कीजिए, ठीक उन्हीं output lines को एक OR gate में wire कीजिए, हो गया।',
        'n variables का कोई भी function F canonically अपने on-set के minterms के योग के रूप में लिखा जा सकता है, यानी उन input codes का set जहाँ F = 1 है। decoder पहले ही हर i के लिए Di = minterm_i एक physical wire पर बना चुका है, तो F सचमुच उन decoder outputs का OR है जिनके indices on-set में हैं: F = चुने Di का OR। OR gate में बस हर ज़रूरी minterm के लिए एक input होता है।',
        'सबसे साफ़ उदाहरण लीजिए: XOR। function F(A,B) = A prime.B + A.B prime, minterms 1 और 2 का योग है। एक 2-to-4 decoder पर वे outputs Y1 और Y2 हैं, तो XOR OR(Y1, Y2) के रूप में बनता है - एक decoder और एक OR gate, और आपके पास exclusive-OR है बिना किसी Karnaugh map और बिना minimise करने वाले बीजगणित के।',
        'जब आपको एक ही inputs के कई functions चाहिए तो किफ़ायत और बढ़ जाती है। एक decoder सबकी सेवा करता है: हर output function को बस अपना OR gate मिल जाता है जो ज़रूरी minterm lines tap करता है। classic केस एक full adder है, जहाँ SUM और CARRY दोनों एक अकेले 3-to-8 decoder से पढ़े जाते हैं, SUM = OR(D1,D2,D4,D7) और CARRY = OR(D3,D5,D6,D7), वही आठ minterm wires साझा करते हुए।',
        'इसीलिए decoder एक universal, ख़ूबसूरती से पठनीय design method है। आप कभी minimise नहीं करते; आप बस truth table को सीधे hardware में translate करते हैं: जिन rows में output 1 है उन्हें चुनिए, उन lines को OR कीजिए, और circuit बनावट से ही सही है। नीचे interactive आपके सेट किए किसी भी A और B के लिए OR(Y1,Y2) को XOR निकालते दिखाता है।',
      ],
      transcriptEN:
        'Now the payoff. Because a decoder outputs every minterm on its own line, you can build any Boolean function in sum-of-products form mechanically: list the minterms where the function is one, wire those output lines into a single OR gate, done. Any function is the OR of the decoder outputs whose indices are in its on-set. The cleanest example is XOR: F equals A prime B plus A B prime, minterms one and two, so on a two-to-four decoder XOR is OR of Y1 and Y2 - one decoder, one OR gate, no Karnaugh map. And one decoder serves several functions of the same inputs at once: a full adder reads SUM from minterms one, two, four, seven and CARRY from three, five, six, seven off the same eight wires. You never minimise; you translate the truth table straight into hardware.',
      transcriptHI:
        'अब फ़ायदा। चूँकि एक decoder हर minterm को उसकी अपनी line पर देता है, आप sum-of-products रूप में कोई भी Boolean function यांत्रिक रूप से बना सकते हैं: जिन minterms पर function एक है उन्हें सूचीबद्ध कीजिए, उन output lines को एक OR gate में wire कीजिए, हो गया। कोई भी function उन decoder outputs का OR है जिनके indices इसके on-set में हैं। सबसे साफ़ उदाहरण XOR है: F बराबर A prime B plus A B prime, minterms एक और दो, तो एक two-to-four decoder पर XOR, Y1 और Y2 का OR है - एक decoder, एक OR gate, कोई Karnaugh map नहीं। और एक decoder एक ही inputs के कई functions की एक साथ सेवा करता है: एक full adder, SUM को minterms एक, दो, चार, सात से और CARRY को तीन, पाँच, छह, सात से उन्हीं आठ wires से पढ़ता है। आप कभी minimise नहीं करते; आप truth table को सीधे hardware में translate करते हैं।',
      visualNote:
        'A 2-to-4 decoder feeding an OR gate; only Y1 and Y2 connect into the OR, whose output is labelled F = A XOR B; a live LiveGate XOR confirms the result.',
    },
    {
      id: 'S09_Derivations',
      label: 'Proofs, Step By Step',
      kind: 'theory',
      subtitle: 'Derive the minterm outputs, the enable, and the decoder+OR theorem.',
      theoryEN: [
        'It is one thing to be told the 2-to-4 outputs are the four minterms and quite another to derive them from the one-hot requirement yourself. The guided walkthrough below does exactly that, building each result from first principles so the equations stop being something to memorise and become something you can re-create on demand.',
        'The first proof derives the four outputs. We demand that Di be HIGH for exactly one input combination, write that condition as a product of literals, and read off D0 = A prime.B prime, D1 = A prime.B, D2 = A.B prime, D3 = A.B. We then check completeness: D0 + D1 + D2 + D3 simplifies to 1, proving exactly one output is HIGH for every input.',
        'The second proof adds the enable. We want a single line E that silences everything at 0 and passes normal decode at 1, so we AND E into every output: Di = E.minterm_i. The two cases E = 0 and E = 1 confirm the behaviour, and the same AND is what lets us cascade two 2-to-4 decoders into a 3-to-8 by enabling one with A2 prime and the other with A2.',
        'The third proof is the keystone: the canonical-form theorem that a decoder plus OR gates realises any function. Any F is the sum of its on-set minterms, the decoder supplies every minterm on a wire, so F is the OR of the selected outputs. The worked example builds the full-adder SUM = OR(D1,D2,D4,D7) on a 3-to-8 decoder.',
        'Step through all three below. Each step shows the algebra explicitly in ASCII - apostrophe for NOT, dot for AND, plus for OR - so you can follow every substitution and reproduce the whole chain in an exam without looking anything up.',
      ],
      theoryHI: [
        'यह बताया जाना कि 2-to-4 outputs चार minterms हैं एक बात है और उन्हें ख़ुद one-hot ज़रूरत से derive करना बिलकुल दूसरी। नीचे का guided walkthrough ठीक यही करता है, हर नतीजे को मूल सिद्धांतों से बनाता है ताकि equations रटने की चीज़ न रहें और ऐसी चीज़ बन जाएँ जिन्हें आप माँगने पर फिर से बना सकें।',
        'पहला proof चार outputs derive करता है। हम माँगते हैं कि Di ठीक एक input combination के लिए HIGH हो, उस शर्त को literals के product के रूप में लिखते हैं, और पढ़ लेते हैं D0 = A prime.B prime, D1 = A prime.B, D2 = A.B prime, D3 = A.B। फिर हम completeness जाँचते हैं: D0 + D1 + D2 + D3, 1 में सरल हो जाता है, जो साबित करता है कि हर input के लिए ठीक एक output HIGH है।',
        'दूसरा proof enable जोड़ता है। हम एक अकेली line E चाहते हैं जो 0 पर सब चुप कर दे और 1 पर सामान्य decode पास करे, तो हम E को हर output में AND करते हैं: Di = E.minterm_i। दो केस E = 0 और E = 1 व्यवहार की पुष्टि करते हैं, और वही AND हमें दो 2-to-4 decoders को एक 3-to-8 में cascade करने देता है, एक को A2 prime और दूसरे को A2 से enable करके।',
        'तीसरा proof keystone है: canonical-form theorem कि एक decoder जमा OR gates कोई भी function बना देते हैं। कोई भी F अपने on-set minterms का योग है, decoder हर minterm एक wire पर देता है, तो F चुने outputs का OR है। worked example एक 3-to-8 decoder पर full-adder SUM = OR(D1,D2,D4,D7) बनाता है।',
        'नीचे तीनों से step कीजिए। हर step बीजगणित को साफ़-साफ़ ASCII में दिखाता है - NOT के लिए apostrophe, AND के लिए dot, OR के लिए plus - ताकि आप हर substitution का पीछा कर सकें और पूरी chain को exam में बिना कुछ देखे फिर से बना सकें।',
      ],
      transcriptEN:
        'Deriving the equations beats memorising them. The first proof demands each output be HIGH for exactly one combination, writes it as a product of literals, and reads off D0 equals A prime B prime through D3 equals A B; then it checks that the four sum to one, proving exactly one is HIGH. The second proof ANDs an enable E into every output, so Di equals E times the minterm; E zero silences all, E one decodes normally, and the same AND cascades two two-to-fours into a three-to-eight. The third proof is the keystone: any function is the OR of its on-set minterms, the decoder supplies every minterm on a wire, so a decoder plus an OR gate realises any function - the worked example builds the full-adder SUM from minterms one, two, four, seven on a three-to-eight decoder. Step through all three.',
      transcriptHI:
        'equations derive करना उन्हें रटने से बेहतर है। पहला proof माँगता है कि हर output ठीक एक combination के लिए HIGH हो, इसे literals के product के रूप में लिखता है, और पढ़ता है D0 बराबर A prime B prime से D3 बराबर A B तक; फिर जाँचता है कि चारों का योग एक है, जो साबित करता है ठीक एक HIGH है। दूसरा proof एक enable E को हर output में AND करता है, तो Di बराबर E गुणा minterm; E शून्य सब चुप करता है, E एक सामान्य decode करता है, और वही AND दो two-to-fours को एक three-to-eight में cascade करता है। तीसरा proof keystone है: कोई भी function अपने on-set minterms का OR है, decoder हर minterm एक wire पर देता है, तो एक decoder जमा एक OR gate कोई भी function बना देते हैं - worked example एक three-to-eight decoder पर minterms एक, दो, चार, सात से full-adder SUM बनाता है। तीनों से step कीजिए।',
      visualNote:
        'A StepThrough with three proofs: (1) the four minterm outputs + completeness D0+D1+D2+D3=1, (2) the enable Di=E.minterm_i with both cases, (3) F = OR of on-set minterms with the full-adder SUM example.',
    },
    {
      id: 'S10_Build',
      label: 'Build The Decoder For Real',
      kind: 'theory',
      subtitle: 'Open the workbench and wire the 2-to-4 decoder yourself.',
      theoryEN: [
        'You have read the theory, derived the minterms and watched the lit line jump. Now build the 2-to-4 decoder yourself on real hardware in the live CircuitVerse workbench, where you place the gates, draw the wires, and prove every row of the truth table with your own hands.',
        'Your part list is the six gates we derived: two NOT gates to make A1 prime and A0 prime, and four AND gates, one per output. Wire AND0 to A1 prime and A0 prime for Y0, AND1 to A1 prime and A0 for Y1, AND2 to A1 and A0 prime for Y2, and AND3 to A1 and A0 for Y3. Then toggle the two inputs through all four codes and confirm exactly one output lights each time.',
        'Once the basic decoder works, try the extensions you learned. Add a shared enable line into every AND gate to make each output E.minterm_i, and verify that E = 0 zeroes the whole chip. Then OR Y1 and Y2 together into one gate and watch the output compute XOR of A1 and A0 - the universal-SOP trick made real on the bench.',
        'Building it by hand is where the one-hot rule stops being a slogan and becomes something you have seen with your own probe: one code in, one line HIGH, every single time. Open the workbench below and wire it up.',
      ],
      theoryHI: [
        'आप theory पढ़ चुके, minterms derive कर चुके और जली line को कूदते देख चुके। अब live CircuitVerse workbench में असली hardware पर 2-to-4 decoder ख़ुद बनाइए, जहाँ आप gates रखते हैं, wires खींचते हैं, और truth table की हर row अपने हाथों से साबित करते हैं।',
        'आपकी part list वही छह gates है जो हमने derive किए: A1 prime और A0 prime बनाने को दो NOT gates, और चार AND gates, हर output के लिए एक। Y0 के लिए AND0 को A1 prime और A0 prime से, Y1 के लिए AND1 को A1 prime और A0 से, Y2 के लिए AND2 को A1 और A0 prime से, और Y3 के लिए AND3 को A1 और A0 से wire कीजिए। फिर दो inputs को चारों codes से toggle कीजिए और पुष्टि कीजिए कि हर बार ठीक एक output जलता है।',
        'जब बुनियादी decoder काम कर जाए, तो वे extensions आज़माइए जो आपने सीखे। हर AND gate में एक साझा enable line जोड़कर हर output को E.minterm_i बनाइए, और जाँचिए कि E = 0 पूरी chip को 0 कर देता है। फिर Y1 और Y2 को एक gate में OR कीजिए और देखिए output A1 और A0 का XOR निकालता है - universal-SOP trick bench पर हक़ीक़त बनी।',
        'इसे हाथ से बनाना ही वह जगह है जहाँ one-hot rule एक नारा नहीं रह जाता और ऐसी चीज़ बन जाता है जिसे आपने अपने probe से देखा है: एक code अंदर, एक line HIGH, हर बार। नीचे workbench खोलिए और इसे wire कीजिए।',
      ],
      transcriptEN:
        'You have read the theory and derived the minterms; now build the two-to-four decoder yourself in the live workbench. The part list is the six gates: two NOT gates for the complements and four AND gates, one per output, wired to the right true-or-complemented pairs. Toggle all four codes and confirm exactly one output lights each time. Then extend it: add a shared enable into every AND to gate the whole chip, and OR Y1 and Y2 into one gate to compute XOR. Building it by hand is where one-hot stops being a slogan.',
      transcriptHI:
        'आप theory पढ़ चुके और minterms derive कर चुके; अब live workbench में two-to-four decoder ख़ुद बनाइए। part list वही छह gates है: complements के लिए दो NOT gates और चार AND gates, हर output के लिए एक, सही सीधे-या-complemented pairs से wire किए। चारों codes toggle कीजिए और पुष्टि कीजिए कि हर बार ठीक एक output जलता है। फिर इसे बढ़ाइए: हर AND में एक साझा enable जोड़कर पूरी chip को gate कीजिए, और Y1 तथा Y2 को एक gate में OR करके XOR निकालिए। इसे हाथ से बनाना ही वह जगह है जहाँ one-hot एक नारा नहीं रह जाता।',
      visualNote: 'WorkbenchCTA panel launching /workbench?tutorial=decoder-2to4.',
    },
    {
      id: 'S11_Flashcards',
      label: 'Flashcards',
      kind: 'flashcards',
      subtitle: 'Eight flip-cards to lock in one-hot, minterms, the enable and the SOP trick.',
      theoryEN: [
        'These eight flip-cards drill the facts that matter most: what a decoder is, the one-hot rule, why each output is a minterm, the 2-to-4 equations, the gate count, the enable, the decoder-versus-DEMUX duality, and the decoder-plus-OR universal trick. Cover the back, say the answer out loud, then flip to check, and repeat any card you fumble until recall is reflex.',
        'Give extra reps to the four 2-to-4 equations (Y0 = A1 prime.A0 prime, Y1 = A1 prime.A0, Y2 = A1.A0 prime, Y3 = A1.A0) and the gate count (2^n AND, n NOT), because examiners love asking you to write those from scratch.',
        'If you walk away remembering only one idea, make it this: a decoder puts every minterm on its own wire, so exactly one line is HIGH per code, and OR-ing the lines you want builds any function. That single sentence is the whole module.',
      ],
      theoryHI: [
        'ये आठ flip-cards सबसे ज़रूरी तथ्य रटाते हैं: decoder क्या है, one-hot rule, हर output minterm क्यों है, 2-to-4 equations, gate गिनती, enable, decoder-बनाम-DEMUX duality, और decoder-जमा-OR universal trick। पीछे ढककर जवाब ज़ोर से बोलिए, फिर जाँचने को पलटिए, और जो card अटके उसे तब तक दोहराइए जब तक याद reflex न बन जाए।',
        'चार 2-to-4 equations (Y0 = A1 prime.A0 prime, Y1 = A1 prime.A0, Y2 = A1.A0 prime, Y3 = A1.A0) और gate गिनती (2^n AND, n NOT) को ज़्यादा दोहराइए, क्योंकि examiner इन्हें शुरू से लिखवाना पसंद करते हैं।',
        'अगर आप सिर्फ़ एक विचार याद रखकर जाएँ, तो यह हो: एक decoder हर minterm को उसकी अपनी wire पर रखता है, तो हर code के लिए ठीक एक line HIGH होती है, और मनचाही lines को OR करना कोई भी function बना देता है। वही एक वाक्य पूरा module है।',
      ],
      transcriptEN:
        'Eight quick flip-cards to set it solid. Front asks, back answers - cover the back, say it aloud, then flip. Give extra reps to the four 2-to-4 equations and the gate count, two-to-the-n AND gates and n NOT gates, because examiners love asking you to write those from scratch. One idea to carry: a decoder puts every minterm on its own wire, so one line is HIGH per code and OR-ing the lines you want builds any function.',
      transcriptHI:
        'इसे पक्का करने को आठ तेज़ flip-cards। आगे सवाल, पीछे जवाब - पीछे ढककर ज़ोर से बोलिए, फिर पलटिए। चार 2-to-4 equations और gate गिनती, two-to-the-n AND gates और n NOT gates, को ज़्यादा दोहराइए, क्योंकि examiner इन्हें शुरू से लिखवाना पसंद करते हैं। साथ ले जाने वाला एक विचार: एक decoder हर minterm को उसकी wire पर रखता है, तो हर code के लिए एक line HIGH होती है और मनचाही lines को OR करना कोई भी function बना देता है।',
      visualNote: 'Standard bilingual flip deck, eight cards.',
    },
    {
      id: 'S12_Quiz',
      label: 'Quiz Arena',
      kind: 'quiz',
      subtitle: 'Eight questions - prove you can size, wire and use a decoder.',
      theoryEN: [
        'Eight multiple-choice questions now check that the decoder has really sunk in: they probe the output count 2^n, the one-hot golden rule, which Boolean expression implements a given output, the exact gate count of a 2-to-4 build, what the enable does at E = 0, the decoder-to-DEMUX reinterpretation, which outputs to OR for XOR, and how active-low polarity behaves.',
        'Several questions are circuit-building: you will be asked which two outputs feed the OR gate to make XOR, and which expression is output Y2, so reason about minterms and indices rather than guessing - the index of an output is the decimal value of its code.',
        'Aim for full marks here. Clearing all eight means you can size a decoder, wire its gates, add an enable, morph it into a demux, flip it active-low, and use it as a universal SOP builder - the complete decoder toolkit.',
      ],
      theoryHI: [
        'आठ bahu-vikalp सवाल अब जाँचते हैं कि decoder सचमुच बैठा या नहीं: ये पूछते हैं output गिनती 2^n, one-hot golden rule, कौन सी Boolean expression एक दिए output को बनाती है, एक 2-to-4 build की ठीक gate गिनती, E = 0 पर enable क्या करता है, decoder-to-DEMUX पुनर्व्याख्या, XOR के लिए कौन से outputs OR करें, और active-low polarity कैसे बरतती है।',
        'कई सवाल circuit-building हैं: आपसे पूछा जाएगा कि XOR बनाने को कौन से दो outputs OR gate में जाते हैं, और कौन सी expression output Y2 है, तो अंदाज़े के बजाय minterms और indices पर सोचिए - किसी output का index उसके code का decimal मान है।',
        'यहाँ पूरे अंक का लक्ष्य रखिए। आठों साफ़ करना मतलब आप एक decoder size कर सकते हैं, इसके gates wire कर सकते हैं, एक enable जोड़ सकते हैं, इसे demux में बदल सकते हैं, active-low कर सकते हैं, और इसे universal SOP builder की तरह वापर सकते हैं - पूरा decoder toolkit।',
      ],
      transcriptEN:
        'Eight questions in the arena. They check the output count two-to-the-n, the one-hot rule, which expression implements a given output, the gate count of a two-to-four, what the enable does at zero, the decoder-to-demux reinterpretation, which outputs to OR for XOR, and active-low polarity. Several are circuit-building - reason about minterms and indices rather than guessing, because the index of an output is the decimal value of its code. Clear all eight and you own the whole decoder toolkit.',
      transcriptHI:
        'Arena में आठ सवाल। ये जाँचते हैं output गिनती two-to-the-n, one-hot rule, कौन सी expression एक दिए output को बनाती है, एक two-to-four की gate गिनती, E शून्य पर enable क्या करता है, decoder-to-demux पुनर्व्याख्या, XOR के लिए कौन से outputs OR करें, और active-low polarity। कई circuit-building हैं - अंदाज़े के बजाय minterms और indices पर सोचिए, क्योंकि किसी output का index उसके code का decimal मान है। आठों साफ़ कीजिए और आप पूरे decoder toolkit के मालिक हैं।',
      visualNote: 'Parameterized QuizArena.',
    },
    {
      id: 'S13_Recap',
      label: 'Recap & Selector Mastered',
      kind: 'recap',
      subtitle: 'One code in, one line out - the decoder is yours.',
      theoryEN: [
        'Let us bank the whole thing. A decoder takes n binary inputs and drives 2^n output lines, with exactly one line active per input code - the one-hot rule. Each output Di is the i-th minterm of the inputs, so the active line is the student whose ID equals the code the teacher called.',
        'The 2-to-4 build is six gates: two NOT gates for the complements and four AND gates giving Y0 = A1 prime.A0 prime, Y1 = A1 prime.A0, Y2 = A1.A0 prime, Y3 = A1.A0, with the one-hot property emerging straight from the wiring. Generalised, an n-to-2^n decoder is 2^n AND gates plus n NOT gates.',
        'One extra enable line turns into total control: Yi = E.minterm_i, so E = 0 silences the whole chip and E = 1 decodes normally, and the same AND lets you cascade small decoders into big ones. Reinterpret that enable as data and the identical circuit becomes a 1-to-2^n demultiplexer, Yi = Data.minterm_i(select). Invert each output (NAND instead of AND) and you have an active-low decoder, one LOW among HIGHs - same selection, flipped polarity.',
        'The deepest idea is the design tool: because the decoder puts every minterm on its own wire, you build any sum-of-products function by OR-ing the lines where the function is 1, with one decoder shared across many output functions. XOR is just OR(Y1,Y2); a full adder reads SUM and CARRY off one 3-to-8 decoder.',
        'Step back and see what you have: a single circuit that selects, enables, demultiplexes, inverts polarity, and builds arbitrary logic - all from the humble idea that exactly one student stands when their number is called. The selector is yours; carry the one-hot picture into encoders, memories and every addressed system you meet next.',
      ],
      theoryHI: [
        'चलिए पूरी बात जमा कर लें। एक decoder n binary inputs लेता है और 2^n output lines चलाता है, हर input code के लिए ठीक एक line active - one-hot rule। हर output Di inputs का i-th minterm है, तो active line वह student है जिसका ID teacher के बुलाए code के बराबर है।',
        '2-to-4 build छह gates है: complements के लिए दो NOT gates और चार AND gates जो देते हैं Y0 = A1 prime.A0 prime, Y1 = A1 prime.A0, Y2 = A1.A0 prime, Y3 = A1.A0, one-hot गुण सीधे wiring से निकलते हुए। generalise करने पर, एक n-to-2^n decoder, 2^n AND gates जमा n NOT gates है।',
        'एक अतिरिक्त enable line पूरा control बन जाती है: Yi = E.minterm_i, तो E = 0 पूरी chip को चुप करता है और E = 1 सामान्य decode करता है, और वही AND आपको छोटे decoders को बड़ों में cascade करने देता है। उस enable को data मानिए और वही circuit एक 1-to-2^n demultiplexer बन जाता है, Yi = Data.minterm_i(select)। हर output को invert कीजिए (AND की जगह NAND) और आपके पास एक active-low decoder है, HIGHs के बीच एक LOW - वही selection, उल्टी polarity।',
        'सबसे गहरा विचार design tool है: चूँकि decoder हर minterm को उसकी अपनी wire पर रखता है, आप जिन lines पर function 1 है उन्हें OR करके कोई भी sum-of-products function बनाते हैं, एक decoder कई output functions में साझा। XOR बस OR(Y1,Y2) है; एक full adder, SUM और CARRY को एक 3-to-8 decoder से पढ़ता है।',
        'पीछे हटकर देखिए आपके पास क्या है: एक अकेली circuit जो select करती है, enable करती है, demultiplex करती है, polarity उलटती है, और मनमाना logic बनाती है - सब इस मामूली विचार से कि किसी का number बुलाने पर ठीक एक student खड़ा होता है। selector आपका है; one-hot तस्वीर को encoders, memories और हर addressed system में ले जाइए जो आगे मिले।',
      ],
      transcriptEN:
        'Let us bank it. A decoder takes n inputs and drives two-to-the-n outputs, exactly one active per code - one-hot - and each output is the i-th minterm. The two-to-four build is six gates: two NOTs and four ANDs giving the four minterms, with one-hot emerging from the wiring. An enable gives total control, Yi equals E times the minterm, and cascades small decoders into big ones. Reinterpret the enable as data and the same circuit is a demultiplexer; invert each output and it is active-low, one LOW among HIGHs. The deepest idea is the design tool: every minterm sits on its own wire, so OR-ing the lines where a function is one builds any sum-of-products function, one decoder shared across many. XOR is OR of Y1 and Y2; a full adder reads SUM and CARRY off one three-to-eight. One circuit that selects, enables, demultiplexes, inverts, and builds arbitrary logic - all from one student standing when their number is called.',
      transcriptHI:
        'चलिए जमा करें। एक decoder n inputs लेता है और two-to-the-n outputs चलाता है, हर code के लिए ठीक एक active - one-hot - और हर output i-th minterm है। two-to-four build छह gates है: दो NOTs और चार ANDs जो चार minterms देते हैं, one-hot wiring से निकलते हुए। एक enable पूरा control देता है, Yi बराबर E गुणा minterm, और छोटे decoders को बड़ों में cascade करता है। enable को data मानिए और वही circuit एक demultiplexer है; हर output को invert कीजिए और यह active-low है, HIGHs के बीच एक LOW। सबसे गहरा विचार design tool है: हर minterm अपनी wire पर बैठा है, तो जिन lines पर function एक है उन्हें OR करना कोई भी sum-of-products function बनाता है, एक decoder कई में साझा। XOR, Y1 और Y2 का OR है; एक full adder, SUM और CARRY को एक three-to-eight से पढ़ता है। एक circuit जो select, enable, demultiplex, invert करती है, और मनमाना logic बनाती है - सब एक student के अपना number बुलाने पर खड़े होने से।',
      visualNote:
        'Recap card: the one-hot fan + the four minterm equations on the left, the enable/DEMUX/active-low variants on the right. Sources listed as plain links below.',
    },
  ],
  flashcards: [
    {
      frontEN: 'What is a decoder?',
      backEN:
        'A combinational circuit converting n binary inputs into up to 2^n one-hot outputs; exactly one output is active per input code, and it equals that code i-th minterm.',
      frontHI: 'Decoder क्या है?',
      backHI:
        'एक combinational circuit जो n binary inputs को अधिकतम 2^n one-hot outputs में बदलती है; हर input code के लिए ठीक एक output active होता है, और वह उस code का i-th minterm है।',
    },
    {
      frontEN: 'What is a one-hot output?',
      backEN:
        'A pattern where exactly one line is HIGH (active) and all the others are LOW - the signature of a decoder. The position of the HIGH line names the input code.',
      frontHI: 'One-hot output क्या है?',
      backHI:
        'एक pattern जहाँ ठीक एक line HIGH (active) हो और बाक़ी सब LOW - decoder की पहचान। HIGH line की जगह input code का नाम बताती है।',
    },
    {
      frontEN: 'Why is each decoder output a minterm?',
      backEN:
        'Output Di equals the i-th minterm of the inputs, a product of all variables (true or complemented) that is HIGH for exactly one input combination - so the outputs are one-hot for free.',
      frontHI: 'हर decoder output एक minterm क्यों है?',
      backHI:
        'Output Di inputs का i-th minterm है, सभी variables (सीधे या complemented) का एक product जो ठीक एक input combination के लिए HIGH है - तो outputs मुफ़्त में one-hot होते हैं।',
    },
    {
      frontEN: 'Write the four 2-to-4 decoder equations.',
      backEN:
        'Y0 = A1 prime.A0 prime, Y1 = A1 prime.A0, Y2 = A1.A0 prime, Y3 = A1.A0 (A1 is the MSB, A0 the LSB) - one AND gate per output.',
      frontHI: 'चार 2-to-4 decoder equations लिखिए।',
      backHI:
        'Y0 = A1 prime.A0 prime, Y1 = A1 prime.A0, Y2 = A1.A0 prime, Y3 = A1.A0 (A1 MSB, A0 LSB) - हर output के लिए एक AND gate।',
    },
    {
      frontEN: 'How many gates does an n-to-2^n decoder need?',
      backEN:
        'It needs 2^n AND gates (one per output minterm) and n NOT gates (one to complement each input). So a 2-to-4 is 4 AND + 2 NOT = 6 gates.',
      frontHI: 'एक n-to-2^n decoder को कितने gates चाहिए?',
      backHI:
        'इसे 2^n AND gates चाहिए (हर output minterm के लिए एक) और n NOT gates (हर input को complement करने को एक)। तो एक 2-to-4, 4 AND + 2 NOT = 6 gates है।',
    },
    {
      frontEN: 'What does the enable input E do?',
      backEN:
        'Master on/off: Yi = E.minterm_i. E = 1 gives normal operation (selected output HIGH); E = 0 forces ALL outputs to 0. It also lets decoders cascade.',
      frontHI: 'Enable input E क्या करता है?',
      backHI:
        'Master on/off: Yi = E.minterm_i। E = 1 सामान्य operation देता है (चुना output HIGH); E = 0 सारे outputs 0 कर देता है। यह decoders को cascade भी करने देता है।',
    },
    {
      frontEN: 'How is a decoder related to a DEMUX?',
      backEN:
        'Same circuit. As a decoder, E is an enable. As a 1-to-2^n demultiplexer, E becomes the data input and the address bits become select lines: Yi = Data.minterm_i(select).',
      frontHI: 'Decoder और DEMUX में क्या संबंध है?',
      backHI:
        'वही circuit। decoder के रूप में E एक enable है। 1-to-2^n demultiplexer के रूप में E data input बन जाता है और address bits select lines: Yi = Data.minterm_i(select)।',
    },
    {
      frontEN: 'How does a decoder build any logic function?',
      backEN:
        'It exposes every minterm on its own wire, so OR the minterm lines where F = 1 to realise any SOP function. Example: XOR = Y1 + Y2 = A prime.B + A.B prime.',
      frontHI: 'एक decoder कोई भी logic function कैसे बनाता है?',
      backHI:
        'यह हर minterm को उसकी अपनी wire पर देता है, तो जिन minterm lines पर F = 1 है उन्हें OR करके कोई भी SOP function बनाइए। उदाहरण: XOR = Y1 + Y2 = A prime.B + A.B prime।',
    },
  ],
  quiz: [
    {
      questionEN: 'A decoder has n input lines. What is the maximum number of output lines?',
      options: ['n', '2*n', '2^n', 'n^2'],
      answerIndex: 2,
      explainEN: 'Each of the 2^n input combinations gets its own output line, so outputs = 2^n.',
      explainHI: 'हर एक 2^n input combination को अपना output line मिलता है, तो outputs = 2^n।',
      questionHI: 'एक decoder के n input lines हैं। output lines की अधिकतम संख्या क्या है?',
    },
    {
      questionEN: "What is the defining 'golden rule' of a normal active-high decoder's outputs?",
      options: [
        'All outputs are HIGH together',
        'Exactly one output is HIGH at a time',
        'Half the outputs are HIGH',
        'Outputs depend on a clock edge',
      ],
      answerIndex: 1,
      explainEN: 'A decoder is one-hot: exactly one output is active (HIGH) for each input code.',
      explainHI: 'एक decoder one-hot है: हर input code के लिए ठीक एक output active (HIGH) होता है।',
      questionHI: 'एक सामान्य active-high decoder के outputs का परिभाषित golden rule क्या है?',
    },
    {
      questionEN: 'In a 2-to-4 decoder with inputs A1,A0, which Boolean expression implements output Y2?',
      options: ['A1 prime.A0 prime', 'A1 prime.A0', 'A1.A0 prime', 'A1.A0'],
      answerIndex: 2,
      explainEN: 'Y2 corresponds to code 10, i.e. A1 = 1, A0 = 0, so Y2 = A1.A0 prime.',
      explainHI: 'Y2, code 10 से मेल खाता है, यानी A1 = 1, A0 = 0, तो Y2 = A1.A0 prime।',
      questionHI: 'inputs A1,A0 वाले एक 2-to-4 decoder में, कौन सी Boolean expression output Y2 बनाती है?',
    },
    {
      questionEN: 'How many AND gates and NOT gates does a standard 2-to-4 decoder need?',
      options: ['2 AND, 4 NOT', '4 AND, 2 NOT', '4 AND, 4 NOT', '2 AND, 2 NOT'],
      answerIndex: 1,
      explainEN: 'One AND gate per output (4) and one NOT per input to make A1 prime, A0 prime (2).',
      explainHI: 'हर output के लिए एक AND gate (4) और A1 prime, A0 prime बनाने को हर input के लिए एक NOT (2)।',
      questionHI: 'एक standard 2-to-4 decoder को कितने AND gates और NOT gates चाहिए?',
    },
    {
      questionEN: 'When the ENABLE input E = 0 on an enabled decoder, the outputs are:',
      options: ['All HIGH', 'Unchanged from before', 'All LOW (0)', 'Only Y0 HIGH'],
      answerIndex: 2,
      explainEN: 'E gates every AND output: Yi = E.minterm_i, so E = 0 forces all outputs to 0.',
      explainHI: 'E हर AND output को gate करता है: Yi = E.minterm_i, तो E = 0 सारे outputs 0 कर देता है।',
      questionHI: 'एक enabled decoder पर जब ENABLE input E = 0 हो, तो outputs हैं:',
    },
    {
      questionEN: 'A 1-to-4 demultiplexer is built from a 2-to-4 decoder by treating which signal as the data input?',
      options: ['A1', 'A0', 'The Enable (E) input', 'One of the outputs'],
      answerIndex: 2,
      explainEN: 'The Enable becomes the Data input; A1, A0 become select lines that route data to one output.',
      explainHI: 'Enable, Data input बन जाता है; A1, A0 select lines बन जाती हैं जो data को एक output तक भेजती हैं।',
      questionHI: 'एक 1-to-4 demultiplexer एक 2-to-4 decoder से किस signal को data input मानकर बनाया जाता है?',
    },
    {
      questionEN: 'You want to build F = A prime.B + A.B prime (XOR) using a 2-to-4 decoder. Which outputs feed the OR gate?',
      options: ['Y0 and Y3', 'Y1 and Y2', 'Y0 and Y1', 'Y2 and Y3'],
      answerIndex: 1,
      explainEN: 'A prime.B is minterm 01 = Y1 and A.B prime is minterm 10 = Y2, so OR(Y1,Y2) gives XOR.',
      explainHI: 'A prime.B, minterm 01 = Y1 है और A.B prime, minterm 10 = Y2 है, तो OR(Y1,Y2) XOR देता है।',
      questionHI: 'आप एक 2-to-4 decoder से F = A prime.B + A.B prime (XOR) बनाना चाहते हैं। कौन से outputs OR gate में जाते हैं?',
    },
    {
      questionEN: 'In an ACTIVE-LOW decoder, the selected output line is:',
      options: [
        'HIGH while all others are LOW',
        'LOW while all others are HIGH',
        'Floating (high impedance)',
        'Toggling at the clock rate',
      ],
      answerIndex: 1,
      explainEN: 'Active-low inverts the polarity: the chosen output goes LOW (0) and the rest stay HIGH (1).',
      explainHI: 'Active-low polarity उलट देता है: चुना output LOW (0) हो जाता है और बाक़ी HIGH (1) रहते हैं।',
      questionHI: 'एक ACTIVE-LOW decoder में, चुनी हुई output line होती है:',
    },
  ],
}) as unknown as SubContent;
