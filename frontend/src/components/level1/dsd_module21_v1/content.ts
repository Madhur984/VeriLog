import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/21 - The Multiplexer (MUX), "The Digital Track Switch".
 * Source: dsd21.json (spec). A MUX is a many-to-1 data selector: n select lines
 * route exactly one of 2^n data inputs to a single output Y. Central analogy: a
 * railroad track switch where many input trains wait on parallel tracks and the
 * operator (the select lines) throws the switch so only ONE chosen train rolls
 * onto the single output main line. Boolean (ASCII): 2-to-1 Y = S'.D0 + S.D1 ;
 * 4-to-1 Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3. A 2^n-to-1 MUX is a
 * universal LUT for any function of n+1 variables (Shannon expansion).
 */
export const CONTENT: SubContent = {
  moduleTitle: "The Multiplexer (MUX) - The Digital Track Switch",
  moduleSubtitle: "A many-to-1 data selector: n select lines route exactly one of 2^n input trains onto a single output track.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The Digital Track Switch",
      kind: "cover",
      subtitle: "Many input trains, one output track, and a switch operator who lets exactly one through.",
      theoryEN: [
        "This module builds the multiplexer, almost always written MUX, which is one of the most useful blocks in all of digital design. A multiplexer is a combinational circuit that picks ONE of many data inputs and forwards it, unchanged, to a single output line. Engineers call it a many-to-1 data selector, because it selects exactly one input from the many and routes it through.",
        "Hold this one picture in your head for the entire module: a busy railroad yard. Many trains wait on parallel approach tracks, all of them leading toward a single shared main line, and a switch operator stands at the junction. The operator reads a control code and throws the switch so that exactly ONE chosen train rolls onto the main track, while every other train simply waits.",
        "Map that yard onto the circuit. The waiting trains are the data inputs I0, I1, I2 and so on. The control code the operator dials is the select lines. The single main-line track every train must leave on is the one output Y. At any instant the operator connects exactly one input to the output - never two - and changing the code re-throws the switch to route a different track through.",
        "The sizing is the heart of it and is worth memorising right now: a MUX with n select lines can address 2^n data inputs and always has exactly 1 output. One select gives a 2-to-1 MUX, two selects give a 4-to-1, three selects give an 8-to-1. The binary value carried on the select lines is simply the index of the input that gets connected.",
        "By the end you will read and write the MUX boolean equations, draw the gate-level build from inverters, AND gates and an OR gate, prove on paper which input a select code chooses, and even use a single MUX as a universal lookup table that can imitate any logic function. Then you will build a 4-to-1 MUX for real on the workbench."
      ],
      theoryHI: [
        "इस module में हम multiplexer बनाएँगे, जिसे लगभग हमेशा MUX लिखा जाता है, और यह पूरे digital design के सबसे उपयोगी blocks में से एक है। Multiplexer एक combinational circuit है जो कई data inputs में से एक को चुनकर, बिना बदले, एक अकेली output line पर भेज देता है। Engineer इसे many-to-1 data selector कहते हैं, क्योंकि यह कई में से ठीक एक input चुनकर आगे route कर देता है।",
        "पूरे module के लिए यह एक तस्वीर मन में पकड़े रखिए: एक व्यस्त railroad yard। कई trains समानांतर approach tracks पर इंतज़ार करती हैं, सब एक ही साझा main line की ओर जाती हैं, और एक switch operator junction पर खड़ा है। Operator एक control code पढ़ता है और switch ऐसे throw करता है कि ठीक एक चुनी हुई train main track पर चढ़े, जबकि बाक़ी हर train बस इंतज़ार करती रहे।",
        "उस yard को circuit पर बैठाइए। इंतज़ार करती trains हैं data inputs I0, I1, I2 वग़ैरह। जो control code operator dial करता है वह है select lines। जिस अकेली main-line track पर हर train को निकलना है वह है एक output Y। किसी भी पल operator ठीक एक input को output से जोड़ता है - कभी दो नहीं - और code बदलना switch को फिर से throw करके किसी दूसरी track को route कर देता है।",
        "Sizing ही इसका दिल है और इसे अभी याद कर लेना सही है: n select lines वाला MUX 2^n data inputs को address कर सकता है और हमेशा ठीक 1 output रखता है। एक select देता है 2-to-1 MUX, दो selects देते हैं 4-to-1, तीन selects देते हैं 8-to-1। Select lines पर जो binary मान है वह बस उस input का index है जो जुड़ता है।",
        "अंत तक आप MUX के boolean equations पढ़ और लिख पाएँगे, inverters, AND gates और एक OR gate से gate-level build बनाएँगे, काग़ज़ पर साबित करेंगे कि कोई select code कौन सा input चुनता है, और एक अकेले MUX को universal lookup table की तरह वापरेंगे जो किसी भी logic function की नक़ल कर सके। फिर आप workbench पर एक 4-to-1 MUX असली में बनाएँगे।"
      ],
      transcriptEN: "Welcome to the Digital Track Switch. Picture a busy rail yard: many trains waiting on parallel tracks, all leading to one shared main line, and a switch operator at the junction. The operator dials a control code and throws the switch so exactly one chosen train rolls onto the main track while the others wait. That is a multiplexer - a many-to-1 data selector. The waiting trains are the data inputs, the control code is the select lines, and the main line is the single output. A MUX with n select lines addresses two-to-the-n inputs and always has one output: one select gives a two-to-one, two selects a four-to-one, three a eight-to-one. The binary value on the select lines is just the index of the input that gets through. By the end you'll read the MUX equations, draw the gate build, prove which input a code selects, use a MUX as a universal lookup table, and build a four-to-one for real.",
      transcriptHI: "Digital Track Switch में आपका स्वागत है। एक व्यस्त rail yard सोचिए: कई trains समानांतर tracks पर इंतज़ार कर रही हैं, सब एक साझा main line की ओर, और junction पर एक switch operator। Operator एक control code dial करता है और switch throw करता है ताकि ठीक एक चुनी train main track पर चढ़े जबकि बाक़ी इंतज़ार करें। यही multiplexer है - एक many-to-1 data selector। इंतज़ार करती trains हैं data inputs, control code है select lines, और main line है अकेला output। n select lines वाला MUX two-to-the-n inputs को address करता है और हमेशा एक output रखता है: एक select देता है two-to-one, दो selects four-to-one, तीन eight-to-one। Select lines पर जो binary मान है वह बस उस input का index है जो निकलता है। अंत तक आप MUX equations पढ़ेंगे, gate build बनाएँगे, साबित करेंगे कि कोई code कौन सा input चुनता है, MUX को universal lookup table की तरह वापरेंगे, और एक four-to-one असली में बनाएँगे।",
      visualNote: "Hero: a railroad junction with 4 trains on tracks I0..I3, a switch operator holding a 2-bit code, and one chosen train rolling onto a single main line labelled Y."
    },
    {
      id: "S01_Video",
      label: "Multiplexers, The Track Switch",
      kind: "video",
      subtitle: "A short film: how select lines route one of many inputs to a single output.",
      theoryEN: [
        "Here is the whole idea in one breath before you watch. A multiplexer is a switchboard with many incoming wires and exactly one outgoing wire, plus a small set of select wires that act as a dial. Whatever number you dial onto the select wires becomes the index of the single input that gets connected straight through to the output.",
        "Picture it once more as the rail yard. The data inputs are trains parked on numbered tracks, the select lines are the levers the operator pulls, and the output is the one main line leaving the station. Pull the levers to the binary code for track 2 and train I2 rolls out; the rest stay parked, untouched.",
        "The counting rule is the single most important fact: n select levers can be set to 2^n different codes, so n select lines choose among 2^n inputs, and there is always exactly one output. That is why a 2-to-1 needs 1 select, a 4-to-1 needs 2 selects, and an 8-to-1 needs 3 selects.",
        "Underneath, the magic is plain Boolean algebra. For a 2-to-1 MUX the output is Y = S'.D0 + S.D1, which reads literally as pass D0 when the select S is 0, and pass D1 when S is 1. Each input is gated by the unique select pattern (its minterm) that addresses it, and the gated terms are OR-ed together.",
        "Keep one running example in your head for the whole module: a 4-to-1 MUX with inputs D0 D1 D2 D3 and select code S1 S0. Set the code to 10 (that is S1 = 1, S0 = 0, decimal 2) and the output becomes D2, because the binary value of the select code is exactly the index of the chosen input."
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार एक साँस में। Multiplexer एक switchboard है जिसमें कई incoming wires और ठीक एक outgoing wire है, साथ ही कुछ select wires जो एक dial की तरह काम करती हैं। आप select wires पर जो भी संख्या dial करते हैं वह उस अकेले input का index बन जाती है जो सीधे output से जुड़ जाता है।",
        "इसे एक बार फिर rail yard की तरह देखिए। Data inputs हैं numbered tracks पर खड़ी trains, select lines हैं वे levers जो operator खींचता है, और output है station छोड़ती अकेली main line। Levers को track 2 के binary code पर खींचिए और train I2 निकल जाती है; बाक़ी खड़ी रहती हैं, अछूती।",
        "गिनती का नियम सबसे ज़रूरी तथ्य है: n select levers को 2^n अलग codes पर set किया जा सकता है, तो n select lines 2^n inputs में से चुनती हैं, और हमेशा ठीक एक output होता है। इसीलिए 2-to-1 को 1 select चाहिए, 4-to-1 को 2 selects, और 8-to-1 को 3 selects।",
        "नीचे, जादू सादा Boolean algebra है। एक 2-to-1 MUX के लिए output है Y = S'.D0 + S.D1, जो शब्दशः पढ़ता है: जब select S 0 हो तो D0 pass करो, और जब S 1 हो तो D1 pass करो। हर input को उस अनोखे select pattern (उसके minterm) से gate किया जाता है जो उसे address करता है, और gated terms को OR कर दिया जाता है।",
        "पूरे module के लिए एक उदाहरण मन में रखिए: एक 4-to-1 MUX जिसके inputs D0 D1 D2 D3 और select code S1 S0 हैं। Code को 10 पर set कीजिए (यानी S1 = 1, S0 = 0, decimal 2) और output बन जाता है D2, क्योंकि select code का binary मान ठीक चुने input का index है।"
      ],
      transcriptEN: "Here's the whole idea in one breath. A multiplexer is a switchboard: many incoming wires, exactly one outgoing wire, and a small set of select wires that act as a dial. Whatever number you dial onto the select lines becomes the index of the single input that gets connected straight through. Picture the rail yard: data inputs are trains on numbered tracks, select lines are the operator's levers, the output is the one main line leaving the station. The counting rule is the key fact: n select levers give two-to-the-n codes, so n selects choose among two-to-the-n inputs, and there's always one output. A two-to-one needs one select, a four-to-one needs two, an eight-to-one needs three. Underneath it's plain boolean algebra. For a two-to-one, Y equals S-prime AND D0, OR S AND D1: pass D0 when S is zero, pass D1 when S is one. Keep one example in mind: a four-to-one with select code S1 S0 set to one-zero, decimal two, gives output D2, because the binary value of the code is the index of the chosen input.",
      transcriptHI: "पूरा विचार एक साँस में। Multiplexer एक switchboard है: कई incoming wires, ठीक एक outgoing wire, और कुछ select wires जो dial की तरह काम करती हैं। आप select lines पर जो संख्या dial करते हैं वह उस अकेले input का index बन जाती है जो सीधे जुड़ जाता है। Rail yard सोचिए: data inputs हैं numbered tracks पर trains, select lines हैं operator के levers, output है station छोड़ती अकेली main line। गिनती का नियम कुंजी है: n select levers देते हैं two-to-the-n codes, तो n selects two-to-the-n inputs में से चुनते हैं, और हमेशा एक output। Two-to-one को एक select, four-to-one को दो, eight-to-one को तीन। नीचे यह सादा boolean algebra है। Two-to-one के लिए Y बराबर S-prime AND D0, OR S AND D1: S शून्य पर D0 pass करो, S एक पर D1 pass करो। एक उदाहरण मन में रखिए: एक four-to-one जिसका select code S1 S0 one-zero पर, decimal दो, output D2 देता है, क्योंकि code का binary मान चुने input का index है।",
      visualNote: "Animated explainer: a 4-to-1 MUX trapezoid; the select dial turns to 10, the I2 wire lights orange all the way through to Y while I0, I1, I3 stay dim."
    },
    {
      id: "S02_WhatIs",
      label: "What A Multiplexer Is",
      kind: "theory",
      subtitle: "Three port groups: 2^n data inputs, n select lines, exactly 1 output.",
      theoryEN: [
        "Let us be precise about what a multiplexer actually is. A MUX is a combinational circuit - meaning its output depends only on its current inputs, with no memory - that selects one of many data inputs and forwards it to a single output line. That single sentence is the whole definition, and the rail-yard operator who lets one train through at a time is its perfect mental model.",
        "Every multiplexer has exactly three groups of ports, and keeping them straight is half the battle. First, the DATA inputs: there are 2^n of them, written I0, I1, up to I at index 2^n minus 1, and these are the trains waiting on the tracks. Second, the SELECT or control lines: there are n of them, and they carry the address of which data input to route. Third, the OUTPUT: there is always exactly one, the single main line called Y.",
        "A subtle but important point: the select lines do not carry data. They never appear in the output value directly. Their only job is to carry the binary address that decides which data input is connected. In the rail yard, the operator's control code is not itself a train - it just tells the switch which train to let through.",
        "Because exactly one input is connected at any instant, a multiplexer behaves like a single-pole, many-throw switch. Just as the operator throws the junction so only one train rolls onto the main line while the others wait, the MUX wires exactly one Di to Y while the rest are ignored. Two inputs are never merged - that would be two trains crashing onto one track.",
        "On a diagram a MUX is usually drawn as a trapezoid, wide on the input side and narrowing to a point at the output. The 2^n data lines enter the wide left edge, the single output Y leaves the narrow right point, and the n select lines enter from the bottom, exactly where the operator stands to throw the switch."
      ],
      theoryHI: [
        "चलिए ठीक-ठीक साफ़ हों कि multiplexer असल में है क्या। MUX एक combinational circuit है - यानी इसका output सिर्फ़ इसके मौजूदा inputs पर निर्भर करता है, कोई memory नहीं - जो कई data inputs में से एक को चुनकर एक अकेली output line पर भेज देता है। यही एक वाक्य पूरी परिभाषा है, और एक-एक करके एक train छोड़ता rail-yard operator इसका perfect mental model है।",
        "हर multiplexer में ठीक तीन groups के ports होते हैं, और इन्हें अलग-अलग पकड़े रखना आधी लड़ाई है। पहला, DATA inputs: ये 2^n होते हैं, लिखे जाते हैं I0, I1, से लेकर index 2^n minus 1 तक, और ये tracks पर इंतज़ार करती trains हैं। दूसरा, SELECT या control lines: ये n होती हैं, और ये यह address ले जाती हैं कि कौन सा data input route करना है। तीसरा, OUTPUT: हमेशा ठीक एक होता है, अकेली main line जिसे Y कहते हैं।",
        "एक सूक्ष्म पर ज़रूरी बात: select lines data नहीं ले जातीं। ये कभी सीधे output मान में नहीं दिखतीं। इनका एकमात्र काम वह binary address ले जाना है जो तय करे कि कौन सा data input जुड़े। Rail yard में, operator का control code ख़ुद कोई train नहीं है - यह बस switch को बताता है कि कौन सी train छोड़नी है।",
        "चूँकि किसी भी पल ठीक एक input जुड़ा होता है, multiplexer एक single-pole, many-throw switch की तरह बर्ताव करता है। जैसे operator junction throw करता है ताकि सिर्फ़ एक train main line पर चढ़े जबकि बाक़ी इंतज़ार करें, MUX ठीक एक Di को Y से wire करता है जबकि बाक़ी को अनदेखा कर दिया जाता है। दो inputs कभी merge नहीं होते - वह तो दो trains का एक ही track पर टकराना होगा।",
        "Diagram पर MUX आमतौर पर एक trapezoid की तरह बनाया जाता है, input तरफ़ चौड़ा और output पर एक नोक में सिमटता हुआ। 2^n data lines चौड़े बाएँ किनारे से घुसती हैं, अकेला output Y दाईं नोक से निकलता है, और n select lines नीचे से घुसती हैं, ठीक वहाँ जहाँ operator switch throw करने खड़ा होता है।"
      ],
      transcriptEN: "Let's be precise about what a multiplexer is. A MUX is a combinational circuit - output depends only on current inputs, no memory - that selects one of many data inputs and forwards it to a single output line. The rail-yard operator who lets one train through at a time is its perfect model. Every MUX has three port groups. First, the data inputs: two-to-the-n of them, written I0 up to I at two-to-the-n minus one, the trains on the tracks. Second, the select lines: n of them, carrying the address of which input to route. Third, the output: always exactly one, the main line Y. A subtle point: the select lines don't carry data, they carry the address that decides which input connects. Because exactly one input is connected at any instant, a MUX is a single-pole many-throw switch: one train rolls through, the rest wait, and two inputs are never merged. On a diagram it's a trapezoid: data lines enter the wide left, Y leaves the narrow right point, and the select lines enter from the bottom.",
      transcriptHI: "चलिए ठीक साफ़ हों कि multiplexer क्या है। MUX एक combinational circuit है - output सिर्फ़ मौजूदा inputs पर, कोई memory नहीं - जो कई data inputs में से एक चुनकर एक अकेली output line पर भेजता है। एक-एक करके train छोड़ता rail-yard operator इसका perfect model है। हर MUX में तीन port groups हैं। पहला, data inputs: two-to-the-n, लिखे I0 से I at two-to-the-n minus one तक, tracks पर trains। दूसरा, select lines: n, जो यह address ले जाती हैं कि कौन सा input route करना है। तीसरा, output: हमेशा ठीक एक, main line Y। एक सूक्ष्म बात: select lines data नहीं, वह address ले जाती हैं जो तय करे कौन सा input जुड़े। चूँकि किसी पल ठीक एक input जुड़ता है, MUX एक single-pole many-throw switch है: एक train निकलती है, बाक़ी इंतज़ार करती हैं, और दो inputs कभी merge नहीं होते। Diagram पर यह एक trapezoid है: data lines चौड़े बाएँ से, Y दाईं नोक से, और select lines नीचे से घुसती हैं।",
      visualNote: "MuxViz (4 inputs): toggle the data inputs and select lines, the chosen input routes to Y. Also a small 2-to-1 instance beside it."
    },
    {
      id: "S03_Sizing",
      label: "Sizing Rule, Inputs vs Selects",
      kind: "theory",
      subtitle: "n select lines give 2^n codes, so they pick 1 of 2^n inputs.",
      theoryEN: [
        "The single most useful rule about multiplexers is the sizing relationship between inputs, select lines and output, and it falls straight out of binary counting. With n select lines you can dial 2^n different binary codes, one per data input, so n select lines can address exactly 2^n inputs. Turn it around and the number of select lines you need is n = log2 of the number of inputs.",
        "Run the small cases so the pattern sticks. One select line gives two codes, 0 and 1, so it builds a 2-to-1 MUX. Two select lines give four codes, 00 01 10 11, so they build a 4-to-1 MUX. Three select lines give eight codes and an 8-to-1 MUX; four select lines give sixteen codes and a 16-to-1 MUX. Every extra select line doubles how many trains the operator can choose between.",
        "Notice the output count never changes. No matter how many data inputs or select lines you add, a multiplexer always has exactly 1 output - there is only ever one main line leaving the yard. Adding inputs widens the choice; it never adds a second exit.",
        "A homely everyday version of this is a smart TV. Four source devices - a game console, a laptop, a camera and an antenna - all feed one TV screen, which is the single output. The remote's input button sets a 2-bit code, acting as the 2 select lines, and that code chooses which one of the four devices is shown. Four inputs, two selects, one screen: a 4-to-1 MUX you already use at home.",
        "So whenever you meet a MUX, immediately read its size from any one of the three numbers. Told it has 3 selects, you know it is 8-to-1 with 1 output. Told it routes 16 inputs, you know it needs log2 of 16 = 4 select lines. The three numbers always lock together as 2^n inputs, n selects, 1 output."
      ],
      theoryHI: [
        "Multiplexer के बारे में सबसे उपयोगी नियम inputs, select lines और output के बीच का sizing रिश्ता है, और यह सीधे binary गिनती से निकलता है। n select lines से आप 2^n अलग binary codes dial कर सकते हैं, हर data input के लिए एक, तो n select lines ठीक 2^n inputs को address कर सकती हैं। पलटिए तो आपको जितनी select lines चाहिए वह है n = log2 of inputs की संख्या।",
        "छोटे cases चला लीजिए ताकि pattern बैठ जाए। एक select line देती है दो codes, 0 और 1, तो यह एक 2-to-1 MUX बनाती है। दो select lines देती हैं चार codes, 00 01 10 11, तो ये एक 4-to-1 MUX बनाती हैं। तीन select lines देती हैं आठ codes और एक 8-to-1 MUX; चार select lines देती हैं सोलह codes और एक 16-to-1 MUX। हर अतिरिक्त select line दोगुना कर देती है कि operator कितनी trains में से चुन सके।",
        "ग़ौर कीजिए output की गिनती कभी नहीं बदलती। चाहे आप कितने भी data inputs या select lines जोड़ें, multiplexer में हमेशा ठीक 1 output होता है - yard छोड़ती हमेशा सिर्फ़ एक main line होती है। Inputs जोड़ना choice चौड़ी करता है; यह कभी दूसरा exit नहीं जोड़ता।",
        "इसका एक रोज़मर्रा वाला रूप है smart TV। चार source devices - एक game console, एक laptop, एक camera और एक antenna - सब एक TV screen को feed करते हैं, जो अकेला output है। Remote का input button एक 2-bit code set करता है, जो 2 select lines की तरह काम करता है, और वह code चुनता है कि चारों में से कौन सा device दिखे। चार inputs, दो selects, एक screen: एक 4-to-1 MUX जो आप पहले से घर पर वापरते हैं।",
        "तो जब भी आप किसी MUX से मिलें, उसके आकार को तीनों संख्याओं में से किसी एक से तुरंत पढ़ लीजिए। बताया गया कि इसमें 3 selects हैं, तो आप जानते हैं यह 8-to-1 है 1 output के साथ। बताया गया यह 16 inputs route करता है, तो आप जानते हैं इसे log2 of 16 = 4 select lines चाहिए। तीनों संख्याएँ हमेशा 2^n inputs, n selects, 1 output के रूप में आपस में बँधी रहती हैं।"
      ],
      transcriptEN: "The most useful rule is the sizing relationship, and it falls out of binary counting. With n select lines you can dial two-to-the-n codes, one per input, so n selects address exactly two-to-the-n inputs; turn it around, n equals log-base-two of the inputs. Run the cases: one select gives two codes, a two-to-one. Two selects give four codes, a four-to-one. Three give eight, an eight-to-one; four give sixteen, a sixteen-to-one. Every extra select doubles the choice. But the output count never changes - a MUX always has exactly one output, one main line leaving the yard. A homely version is a smart TV: four devices, console, laptop, camera, antenna, all feed one screen; the remote sets a two-bit code, the two select lines, choosing which device shows. Four inputs, two selects, one screen, a four-to-one MUX you already use. So read a MUX's size from any one number: three selects means eight-to-one; sixteen inputs means four selects.",
      transcriptHI: "सबसे उपयोगी नियम sizing रिश्ता है, और यह binary गिनती से निकलता है। n select lines से आप two-to-the-n codes dial कर सकते हैं, हर input के लिए एक, तो n selects ठीक two-to-the-n inputs को address करती हैं; पलटिए, n बराबर log-base-two of inputs। Cases चलाइए: एक select देता है दो codes, two-to-one। दो selects देते हैं चार codes, four-to-one। तीन देते हैं आठ, eight-to-one; चार देते हैं सोलह, sixteen-to-one। हर अतिरिक्त select choice दोगुनी करता है। पर output गिनती कभी नहीं बदलती - MUX में हमेशा ठीक एक output, yard छोड़ती एक main line। एक रोज़मर्रा रूप smart TV है: चार devices, console, laptop, camera, antenna, सब एक screen को feed करते हैं; remote एक two-bit code set करता है, दो select lines, चुनते हुए कौन सा device दिखे। चार inputs, दो selects, एक screen, एक four-to-one MUX जो आप पहले से वापरते हैं। तो MUX का आकार किसी एक संख्या से पढ़िए: तीन selects मतलब eight-to-one; सोलह inputs मतलब चार selects।",
      visualNote: "A table n=1->2 in, n=2->4 in, n=3->8 in, n=4->16 in, beside a smart-TV picture of 4 devices feeding 1 screen via a 2-bit remote code."
    },
    {
      id: "S04_TwoToOne",
      label: "The 2-to-1 MUX, Gate Level",
      kind: "theory",
      subtitle: "Y = S'.D0 + S.D1, built from one NOT, two ANDs and one OR.",
      theoryEN: [
        "The smallest possible multiplexer is the 2-to-1, and it is the seed from which every larger MUX grows. It has just two data inputs, D0 and D1, one select line S, and one output Y. Its behaviour is a single sentence: when S = 0 the output equals D0, and when S = 1 the output equals D1. The operator has only two tracks and one lever.",
        "Write that behaviour as Boolean algebra and you get the equation Y = S'.D0 + S.D1. Read it aloud as it is built: S' (S-not) AND D0 forms the first term, S AND D1 forms the second, and the OR (the plus) combines them. The first term passes D0 only while S is 0, the second passes D1 only while S is 1, and since S and S' can never both be 1, exactly one term is ever active.",
        "Check it against the behaviour. With S = 0, S' is 1, so the first term is 1.D0 = D0 and the second is 0.D1 = 0, giving Y = D0. With S = 1, S' is 0, so the first term dies and the second is 1.D1 = D1, giving Y = D1. The algebra agrees exactly with the track-switch story - S is a one-bit address that connects either track 0 or track 1.",
        "Now the gate-level build, which you should be able to draw from memory. You need exactly four gates: one NOT gate (an inverter) to produce S' from S; two 2-input AND gates, one computing S'.D0 and the other computing S.D1; and one 2-input OR gate that ORs those two AND outputs into Y. That is the entire 2-to-1 multiplexer - 1 NOT plus 2 ANDs plus 1 OR equals 4 gates.",
        "Trace a signal through it. The select S splits into two paths: straight into the lower AND, and through the inverter (becoming S') into the upper AND. Each AND is a gate that only opens its train when its select pattern matches, and the OR simply merges the single open path onto the output track Y. The live gates beside this text compute every term as you toggle the bits.",
        "To cement it, grind one example by hand with the step-through below. Take D0 = 0, D1 = 1, S = 1. Write the law Y = S'.D0 + S.D1, substitute (S = 1 makes S' = 0) to get Y = (0).(0) + (1).(1), do the arithmetic 0 + 1, and solve to Y = 1. Sanity-check it: S = 1 addresses track 1, so the output should equal D1, which was 1 - exactly the Y = 1 we computed, the train I1 rolling through."
      ],
      theoryHI: [
        "सबसे छोटा संभव multiplexer है 2-to-1, और यही वह बीज है जिससे हर बड़ा MUX उगता है। इसमें बस दो data inputs हैं, D0 और D1, एक select line S, और एक output Y। इसका बर्ताव एक वाक्य है: जब S = 0 तो output बराबर D0, और जब S = 1 तो output बराबर D1। Operator के पास सिर्फ़ दो tracks और एक lever है।",
        "उस बर्ताव को Boolean algebra में लिखिए और मिलता है equation Y = S'.D0 + S.D1। इसे बनते हुए ज़ोर से पढ़िए: S' (S-not) AND D0 बनाता है पहला term, S AND D1 बनाता है दूसरा, और OR (plus) इन्हें जोड़ता है। पहला term D0 तभी pass करता है जब S 0 हो, दूसरा D1 तभी pass करता है जब S 1 हो, और चूँकि S और S' कभी दोनों 1 नहीं हो सकते, हमेशा ठीक एक term active रहता है।",
        "इसे बर्ताव के सामने जाँचिए। S = 0 पर, S' 1 है, तो पहला term 1.D0 = D0 और दूसरा 0.D1 = 0, देता है Y = D0। S = 1 पर, S' 0 है, तो पहला term मर जाता है और दूसरा 1.D1 = D1, देता है Y = D1। Algebra ठीक track-switch कहानी से मेल खाता है - S एक one-bit address है जो या तो track 0 या track 1 जोड़ता है।",
        "अब gate-level build, जिसे आपको याद से बना पाना चाहिए। आपको ठीक चार gates चाहिए: एक NOT gate (inverter) S से S' बनाने को; दो 2-input AND gates, एक S'.D0 निकालता और दूसरा S.D1; और एक 2-input OR gate जो उन दो AND outputs को Y में OR करता है। यही पूरा 2-to-1 multiplexer है - 1 NOT जमा 2 ANDs जमा 1 OR बराबर 4 gates।",
        "इसमें से एक signal trace कीजिए। Select S दो रास्तों में बँटता है: सीधे निचले AND में, और inverter से होकर (S' बनकर) ऊपरी AND में। हर AND एक gate है जो अपनी train तभी खोलता है जब उसका select pattern मेल खाए, और OR बस उस अकेले खुले रास्ते को output track Y पर मिला देता है। इस text के साथ वाले live gates हर term को compute करते हैं जैसे आप bits toggle करते हैं।",
        "इसे जमाने को नीचे step-through से एक उदाहरण हाथ से पीसिए। लीजिए D0 = 0, D1 = 1, S = 1। नियम Y = S'.D0 + S.D1 लिखिए, substitute कीजिए (S = 1 से S' = 0) तो Y = (0).(0) + (1).(1), arithmetic 0 + 1 कीजिए, और हल कीजिए Y = 1। Sanity-check: S = 1 track 1 को address करता है, तो output बराबर D1 होना चाहिए, जो 1 था - ठीक वही Y = 1 जो हमने निकाला, train I1 निकलती हुई।"
      ],
      transcriptEN: "The smallest multiplexer is the two-to-one, the seed of every larger MUX. Two data inputs D0 and D1, one select S, one output Y. Behaviour in one sentence: S equals zero gives Y equals D0, S equals one gives Y equals D1. As boolean algebra that's Y equals S-prime AND D0, OR S AND D1. The first term passes D0 only while S is zero, the second passes D1 only while S is one, and since S and S-prime can't both be one, exactly one term is ever active. Check it: S zero makes S-prime one, so Y is D0; S one kills the first term, so Y is D1. The gate build you should draw from memory: one NOT for S-prime, two two-input ANDs for S-prime-D0 and S-D1, and one two-input OR combining them into Y. That's one NOT plus two ANDs plus one OR - four gates total. The select splits two ways, straight into the lower AND and through the inverter into the upper AND; each AND opens its train only when the select matches, and the OR merges the one open path onto Y.",
      transcriptHI: "सबसे छोटा multiplexer two-to-one है, हर बड़े MUX का बीज। दो data inputs D0 और D1, एक select S, एक output Y। बर्ताव एक वाक्य में: S बराबर शून्य देता है Y बराबर D0, S बराबर एक देता है Y बराबर D1। Boolean algebra में यह Y बराबर S-prime AND D0, OR S AND D1। पहला term D0 तभी pass करता है जब S शून्य, दूसरा D1 तभी जब S एक, और चूँकि S और S-prime दोनों एक नहीं हो सकते, हमेशा ठीक एक term active। जाँचिए: S शून्य S-prime को एक बनाता है, तो Y है D0; S एक पहला term मारता है, तो Y है D1। Gate build जो याद से बनाएँ: S-prime के लिए एक NOT, S-prime-D0 और S-D1 के लिए दो two-input ANDs, और इन्हें Y में जोड़ता एक two-input OR। यह एक NOT जमा दो ANDs जमा एक OR - कुल चार gates। Select दो रास्तों में बँटता है, सीधे निचले AND में और inverter से ऊपरी AND में; हर AND अपनी train तभी खोलता है जब select मेल खाए, और OR उस एक खुले रास्ते को Y पर मिला देता है।",
      visualNote: "LiveGate trio: NOT(S)=S', AND(D0,S'), AND(D1,S), then the OR; a 2-to-1 truth table S/D0/D1 -> Y computed in code, plus a 4-step worked StepThrough ending Y=1."
    },
    {
      id: "S06_FourToOne",
      label: "The 4-to-1 MUX, Gate Level",
      kind: "theory",
      subtitle: "Y = S1'S0'.D0 + S1'S0.D1 + S1S0'.D2 + S1S0.D3.",
      theoryEN: [
        "Step up to the 4-to-1 MUX, the workhorse you will meet most often. It has four data inputs D0 D1 D2 D3, two select lines named S1 (the more significant bit) and S0 (the less significant bit), and one output Y. Now the operator has four tracks and a two-lever code, and the binary number S1S0 is exactly the index of the train that gets through.",
        "Each input is connected only when the select lines spell out its unique address, and that address is a product term called a minterm. Code 00 addresses D0, code 01 addresses D1, code 10 addresses D2, and code 11 addresses D3. The minterm for an input is the AND of the two select literals that are 1 for that code, so D2 at code 10 needs S1 (which is 1) and S0' (since S0 is 0).",
        "Gather the four gated inputs and OR them, and you have the full equation: Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3. Because the four minterms are mutually exclusive - exactly one of the four select codes is present at a time - exactly one product term is ever 1, so Y always equals the single addressed input.",
        "The gate-level build scales up cleanly from the 2-to-1. You need two NOT gates to produce S1' and S0' from the two selects, four 3-input AND gates (each fed one data line plus the correct two select literals, for example A2 = AND of I2, S1, S0'), and one 4-input OR gate to fold all four AND outputs into Y. That is 2 NOT plus 4 AND plus 1 OR, exactly 7 gates.",
        "Read off a concrete route to make it physical. Dial the select code to 10, decimal 2. Now S1 = 1 and S0' = 1 while S1' = 0 and S0 = 0, so only the term S1.S0'.D2 has both its select literals at 1; every other term has at least one 0 select literal and collapses to 0. The output therefore equals D2, the train on track 2 rolls onto the main line, and the live 4-to-1 below proves it as you toggle.",
        "Now grind a full example by hand with the step-through below, so the minterm machinery becomes second nature. Take D0 = 1, D1 = 0, D2 = 1, D3 = 0 and select code S1 = 1, S0 = 0. Substituting (S1' = 0, S0' = 1) gives Y = (0)(1)(1) + (0)(0)(0) + (1)(1)(1) + (1)(0)(0). The first, second and fourth terms each carry a 0 select literal and vanish; only S1.S0'.D2 = 1.1.1 = 1 survives, so Y = 1. Confirm: code 10 is decimal 2, addressing D2, which was 1 - one code, one surviving minterm, one train through."
      ],
      theoryHI: [
        "अब चढ़िए 4-to-1 MUX पर, वह workhorse जिससे आप सबसे ज़्यादा मिलेंगे। इसमें चार data inputs D0 D1 D2 D3, दो select lines जिनके नाम S1 (ज़्यादा महत्वपूर्ण bit) और S0 (कम महत्वपूर्ण bit), और एक output Y हैं। अब operator के पास चार tracks और दो-lever code है, और binary संख्या S1S0 ठीक उस train का index है जो निकलती है।",
        "हर input तभी जुड़ता है जब select lines उसका अनोखा address बोलें, और वह address एक product term है जिसे minterm कहते हैं। Code 00 D0 को address करता है, code 01 D1 को, code 10 D2 को, और code 11 D3 को। किसी input का minterm उन दो select literals का AND है जो उस code के लिए 1 हों, तो code 10 पर D2 को चाहिए S1 (जो 1 है) और S0' (चूँकि S0 0 है)।",
        "चार gated inputs इकट्ठा कीजिए और उन्हें OR कीजिए, और आपके पास पूरा equation है: Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3। चूँकि चारों minterms परस्पर-अनन्य हैं - एक समय में चार select codes में से ठीक एक मौजूद होता है - हमेशा ठीक एक product term 1 होता है, तो Y हमेशा उस अकेले address किए input के बराबर होता है।",
        "Gate-level build 2-to-1 से साफ़ ऊपर चढ़ता है। आपको दो NOT gates चाहिए दो selects से S1' और S0' बनाने को, चार 3-input AND gates (हर एक को एक data line जमा सही दो select literals दिए, जैसे A2 = AND of I2, S1, S0'), और एक 4-input OR gate चारों AND outputs को Y में मोड़ने को। यह 2 NOT जमा 4 AND जमा 1 OR, ठीक 7 gates।",
        "इसे ठोस बनाने को एक route पढ़िए। Select code को 10, decimal 2, पर dial कीजिए। अब S1 = 1 और S0' = 1 जबकि S1' = 0 और S0 = 0, तो सिर्फ़ term S1.S0'.D2 के दोनों select literals 1 हैं; बाक़ी हर term में कम से कम एक 0 select literal है और वह 0 में ढह जाता है। इसलिए output बराबर D2, track 2 की train main line पर चढ़ती है, और नीचे का live 4-to-1 इसे साबित करता है जैसे आप toggle करते हैं।",
        "अब नीचे step-through से एक पूरा उदाहरण हाथ से पीसिए, ताकि minterm की मशीनरी सहज हो जाए। लीजिए D0 = 1, D1 = 0, D2 = 1, D3 = 0 और select code S1 = 1, S0 = 0। Substitute करने पर (S1' = 0, S0' = 1) मिलता है Y = (0)(1)(1) + (0)(0)(0) + (1)(1)(1) + (1)(0)(0)। पहला, दूसरा और चौथा term हर एक में एक 0 select literal है और वे ग़ायब; सिर्फ़ S1.S0'.D2 = 1.1.1 = 1 बचता है, तो Y = 1। पुष्टि: code 10 decimal 2 है, D2 को address करते, जो 1 था - एक code, एक बचता minterm, एक train पार।"
      ],
      transcriptEN: "Step up to the four-to-one, the workhorse. Four data inputs D0 to D3, two selects S1 the high bit and S0 the low bit, one output Y. The binary number S1-S0 is the index of the train that gets through. Each input connects only when the selects spell its address, a product term called a minterm: code zero-zero addresses D0, zero-one D1, one-zero D2, one-one D3. The minterm is the AND of the two select literals that are one for that code, so D2 at code one-zero needs S1 and S0-prime. OR the four gated inputs and you get Y equals S1-prime S0-prime D0, plus S1-prime S0 D1, plus S1 S0-prime D2, plus S1 S0 D3. Because the four minterms are mutually exclusive, exactly one term is ever one, so Y equals the single addressed input. The gate build: two NOTs for S1-prime and S0-prime, four three-input ANDs each fed a data line and the right two literals, and one four-input OR - seven gates. Dial code one-zero and only S1 S0-prime D2 survives, so Y equals D2.",
      transcriptHI: "चढ़िए four-to-one पर, workhorse। चार data inputs D0 से D3, दो selects S1 high bit और S0 low bit, एक output Y। Binary संख्या S1-S0 उस train का index है जो निकलती है। हर input तभी जुड़ता है जब selects उसका address बोलें, एक product term जिसे minterm कहते हैं: code zero-zero D0 को address करता है, zero-one D1, one-zero D2, one-one D3। Minterm उन दो select literals का AND है जो उस code के लिए एक हों, तो code one-zero पर D2 को चाहिए S1 और S0-prime। चारों gated inputs को OR कीजिए और मिलता है Y बराबर S1-prime S0-prime D0, plus S1-prime S0 D1, plus S1 S0-prime D2, plus S1 S0 D3। चूँकि चारों minterms परस्पर-अनन्य हैं, हमेशा ठीक एक term एक होता है, तो Y उस अकेले address किए input के बराबर। Gate build: S1-prime और S0-prime के लिए दो NOTs, चार three-input ANDs हर एक को एक data line और सही दो literals, और एक four-input OR - सात gates। Code one-zero dial कीजिए और सिर्फ़ S1 S0-prime D2 बचता है, तो Y बराबर D2।",
      visualNote: "MuxViz (4 inputs) plus a 4-row minterm table: code 00/01/10/11 -> minterm S1'S0' / S1'S0 / S1S0' / S1S0 -> selected input; a worked 4-step StepThrough where three terms vanish and only S1.S0'.D2 survives, Y=1=D2."
    },
    {
      id: "S08_Lut",
      label: "MUX As A Universal LUT",
      kind: "theory",
      subtitle: "A 2^n-to-1 MUX is a lookup table for any function of n+1 variables.",
      theoryEN: [
        "Here is the surprising superpower of multiplexers: a single MUX can imitate any logic function. A 2^n-to-1 MUX can implement ANY Boolean function of up to n+1 variables, which means a humble 4-to-1 MUX (n = 2) can build any function of 3 variables, AND, OR, XOR, majority, anything. The MUX is acting as a lookup table, or LUT, the very building block inside every FPGA chip.",
        "The method is mechanical and worth memorising. Connect the function's input variables to the SELECT lines, and connect each DATA input to the truth-table output value (a 0 or a 1) for that exact select combination. Because the select code marches through every row of the truth table as the inputs change, the MUX simply looks up and outputs the value stored on the corresponding data input.",
        "Think of it as the rail yard pre-loaded with answers. Each track Di is parked with the constant the truth table demands for address i. When the select code addresses track i, the MUX rolls out the pre-stored answer for that row. The select lines walk the address, the data inputs hold the answer column - that is exactly a lookup table.",
        "There is an even neater version using one fewer select line. A 2^n-to-1 MUX can build any function of n+1 variables, not just n, by putting n of the variables on the select lines and feeding each data input not with a bare 0 or 1 but with one of {0, 1, x, x'}, where x is the leftover variable. This follows from Shannon expansion, F = x'.F0 + x.F1, the algebra a 2-to-1 MUX literally computes.",
        "This universality is why MUXes are everywhere in programmable hardware. With nothing but constants 0 and 1, the variable itself, and at most one inverter on the data inputs, a single MUX reproduces any gate or any small function. You are about to prove it concretely by building XOR out of a 4-to-1 MUX."
      ],
      theoryHI: [
        "यहाँ multiplexer की चौंकाने वाली महाशक्ति है: एक अकेला MUX किसी भी logic function की नक़ल कर सकता है। एक 2^n-to-1 MUX n+1 तक variables के किसी भी Boolean function को implement कर सकता है, यानी एक मामूली 4-to-1 MUX (n = 2) किसी भी 3 variables के function को बना सकता है, AND, OR, XOR, majority, कुछ भी। MUX एक lookup table, या LUT, की तरह काम कर रहा है, वही building block जो हर FPGA chip के अंदर है।",
        "तरीक़ा यांत्रिक है और याद रखने लायक़ है। Function के input variables को SELECT lines से जोड़िए, और हर DATA input को उस ठीक select combination के लिए truth-table output मान (एक 0 या 1) से जोड़िए। चूँकि inputs बदलने पर select code truth table की हर row से गुज़रता है, MUX बस उस संगत data input पर रखे मान को look up करके output कर देता है।",
        "इसे जवाबों से पहले-से-भरे rail yard की तरह सोचिए। हर track Di पर वह स्थिरांक खड़ा है जो truth table address i के लिए माँगती है। जब select code track i को address करता है, MUX उस row का पहले-से-रखा जवाब निकाल देता है। Select lines address चलती हैं, data inputs जवाब column रखते हैं - यही ठीक एक lookup table है।",
        "एक और चालाक रूप है जो एक कम select line वापरता है। एक 2^n-to-1 MUX सिर्फ़ n नहीं बल्कि n+1 variables के किसी function को साकार कर सकता है, n variables को select lines पर रखकर और हर data input को नंगे 0 या 1 के बजाय {0, 1, x, x'} में से एक देकर, जहाँ x बचा हुआ variable है। यह Shannon expansion से निकलता है, F = x'.F0 + x.F1, वही algebra जो एक 2-to-1 MUX शब्दशः compute करता है।",
        "यही universality है जिससे MUX programmable hardware में हर जगह हैं। सिर्फ़ स्थिरांक 0 और 1, ख़ुद variable, और data inputs पर अधिकतम एक inverter के साथ, एक अकेला MUX किसी भी gate या किसी छोटे function की नक़ल कर देता है। आप इसे अभी ठोस रूप से साबित करने वाले हैं, एक 4-to-1 MUX से XOR बनाकर।"
      ],
      transcriptEN: "Here's the surprising superpower: a single MUX can imitate any logic function. A two-to-the-n-to-one MUX implements any boolean function of up to n-plus-one variables, so a humble four-to-one - n equals two - builds any function of three variables: AND, OR, XOR, anything. The MUX acts as a lookup table, a LUT, the block inside every FPGA. The method is mechanical: connect the input variables to the select lines, and connect each data input to the truth-table output for that select combination. As the select code marches through every truth-table row, the MUX looks up and outputs the stored value. Think of the rail yard pre-loaded with answers: each track parks the constant the truth table demands, and the code rolls out the answer for that row. There's a neater version using one fewer select: put n variables on the selects and feed each data input one of zero, one, x, or x-prime, where x is the leftover variable. That's Shannon expansion, F equals x-prime F0 plus x F1, the algebra a two-to-one MUX literally computes. That's why MUXes are everywhere in programmable hardware.",
      transcriptHI: "यहाँ चौंकाने वाली महाशक्ति है: एक अकेला MUX किसी भी logic function की नक़ल कर सकता है। एक two-to-the-n-to-one MUX n-plus-one तक variables के किसी boolean function को implement करता है, तो एक मामूली four-to-one - n बराबर दो - किसी भी तीन variables के function को बनाता है: AND, OR, XOR, कुछ भी। MUX एक lookup table, LUT, की तरह काम करता है, वह block जो हर FPGA के अंदर है। तरीक़ा यांत्रिक है: input variables को select lines से जोड़िए, और हर data input को उस select combination के truth-table output से जोड़िए। जैसे select code हर truth-table row से गुज़रता है, MUX rखे मान को look up करके output करता है। जवाबों से पहले-भरे rail yard को सोचिए: हर track वह स्थिरांक खड़ा करता है जो truth table माँगती है, और code उस row का जवाब निकाल देता है। एक चालाक रूप एक कम select वापरता है: n variables selects पर रखिए और हर data input को zero, one, x, या x-prime में से एक दीजिए, जहाँ x बचा variable है। यह Shannon expansion है, F बराबर x-prime F0 plus x F1, वही algebra जो two-to-one MUX शब्दशः compute करता है। इसीलिए MUX programmable hardware में हर जगह हैं।",
      visualNote: "A truth table A,B -> Y with arrows mapping A,B onto select lines S1,S0 and the Y column onto data inputs D0..D3 of a box labelled 'MUX AS LUT'."
    },
    {
      id: "S09_XorLut",
      label: "Worked Example, XOR From A 4-to-1 MUX",
      kind: "theory",
      subtitle: "Wire S1=A, S0=B, data 0,1,1,0 and the MUX becomes A xor B.",
      theoryEN: [
        "Let us prove the universal-LUT claim with the cleanest possible example: build the exclusive-OR function Y = A xor B using only a single 4-to-1 multiplexer. XOR is 1 exactly when its two inputs differ, and we will make a MUX reproduce that without a single dedicated XOR gate.",
        "Step one, choose the select wiring. We have two input variables, A and B, and a 4-to-1 MUX has two select lines, so put S1 = A and S0 = B. Now the select code S1S0 is just the pair of input values, and as A and B run through their four combinations the code walks 00, 01, 10, 11 - every row of the XOR truth table in order.",
        "Step two, load the data inputs from the truth table. XOR gives A,B = 00 -> 0, so D0 = 0; 01 -> 1, so D1 = 1; 10 -> 1, so D2 = 1; 11 -> 0, so D3 = 0. So the data inputs, in order D0 D1 D2 D3, are 0, 1, 1, 0 - literally the output column of the XOR truth table parked on the four tracks.",
        "Step three, write what the MUX now computes. Substituting those constants into the 4-to-1 equation gives Y = A'.B'.(0) + A'.B.(1) + A.B'.(1) + A.B.(0). The first and last terms are multiplied by 0 and vanish, leaving Y = A'.B + A.B'.",
        "Step four, recognise the result. A'.B + A.B' is the textbook sum-of-products for exclusive-OR, that is Y = A xor B exactly. The MUX, with select lines carrying A and B and the four constants 0,1,1,0 parked on its tracks, behaves identically to an XOR gate. You just built XOR from a lookup table - the same trick an FPGA uses to become any circuit you program into it."
      ],
      theoryHI: [
        "चलिए universal-LUT दावे को सबसे साफ़ संभव उदाहरण से साबित करें: सिर्फ़ एक 4-to-1 multiplexer से exclusive-OR function Y = A xor B बनाइए। XOR ठीक तब 1 है जब इसके दो inputs अलग हों, और हम एक MUX से वह दोहरवाएँगे बिना एक भी समर्पित XOR gate के।",
        "Step एक, select wiring चुनिए। हमारे पास दो input variables हैं, A और B, और एक 4-to-1 MUX की दो select lines हैं, तो रखिए S1 = A और S0 = B। अब select code S1S0 बस input मानों की जोड़ी है, और जैसे A और B अपने चार combinations से गुज़रते हैं code चलता है 00, 01, 10, 11 - XOR truth table की हर row क्रम में।",
        "Step दो, truth table से data inputs load कीजिए। XOR देता है A,B = 00 -> 0, तो D0 = 0; 01 -> 1, तो D1 = 1; 10 -> 1, तो D2 = 1; 11 -> 0, तो D3 = 0। तो data inputs, क्रम D0 D1 D2 D3 में, हैं 0, 1, 1, 0 - शब्दशः XOR truth table का output column चार tracks पर खड़ा।",
        "Step तीन, लिखिए MUX अब क्या compute करता है। उन स्थिरांकों को 4-to-1 equation में डालने पर मिलता है Y = A'.B'.(0) + A'.B.(1) + A.B'.(1) + A.B.(0)। पहला और आख़िरी term 0 से गुणा होकर ग़ायब, बचता है Y = A'.B + A.B'।",
        "Step चार, नतीजे को पहचानिए। A'.B + A.B' exclusive-OR का पाठ्यपुस्तक sum-of-products है, यानी Y = A xor B ठीक-ठीक। MUX, select lines A और B ले जाते हुए और चार स्थिरांक 0,1,1,0 अपनी tracks पर खड़े, एक XOR gate जैसा ही बर्ताव करता है। आपने अभी एक lookup table से XOR बनाया - वही trick जो FPGA वापरता है किसी भी circuit बनने को जो आप program करें।"
      ],
      transcriptEN: "Prove the universal-LUT claim with the cleanest example: build exclusive-OR, Y equals A xor B, from a single four-to-one MUX. Step one, choose the select wiring: two variables A and B, two select lines, so S1 equals A and S0 equals B. The code walks zero-zero, zero-one, one-zero, one-one, every XOR truth-table row in order. Step two, load the data from the table: XOR gives zero-zero to zero so D0 is zero; zero-one to one so D1 is one; one-zero to one so D2 is one; one-one to zero so D3 is zero. The data inputs are zero, one, one, zero, the XOR output column parked on the tracks. Step three, what the MUX computes: substitute those constants into the four-to-one equation to get Y equals A-prime B-prime times zero, plus A-prime B times one, plus A B-prime times one, plus A B times zero. The first and last vanish, leaving Y equals A-prime B plus A B-prime. Step four, recognise it: A-prime B plus A B-prime is exclusive-OR, so Y equals A xor B exactly. You built XOR from a lookup table.",
      transcriptHI: "Universal-LUT दावे को सबसे साफ़ उदाहरण से साबित कीजिए: एक अकेले four-to-one MUX से exclusive-OR, Y बराबर A xor B, बनाइए। Step एक, select wiring चुनिए: दो variables A और B, दो select lines, तो S1 बराबर A और S0 बराबर B। Code चलता है zero-zero, zero-one, one-zero, one-one, हर XOR truth-table row क्रम में। Step दो, table से data load कीजिए: XOR देता है zero-zero को zero तो D0 शून्य; zero-one को one तो D1 एक; one-zero को one तो D2 एक; one-one को zero तो D3 शून्य। Data inputs हैं zero, one, one, zero, XOR output column tracks पर खड़ा। Step तीन, MUX क्या compute करता है: उन स्थिरांकों को four-to-one equation में डालिए तो Y बराबर A-prime B-prime times शून्य, plus A-prime B times एक, plus A B-prime times एक, plus A B times शून्य। पहला और आख़िरी ग़ायब, बचता है Y बराबर A-prime B plus A B-prime। Step चार, पहचानिए: A-prime B plus A B-prime exclusive-OR है, तो Y बराबर A xor B ठीक। आपने एक lookup table से XOR बनाया।",
      visualNote: "XOR truth table feeding D0=0,D1=1,D2=1,D3=0 of a 4-to-1 MUX with S1=A, S0=B; output equation reduces live to A'.B + A.B' = A xor B."
    },
    {
      id: "S10_EnableCascade",
      label: "Enable Input And Cascading",
      kind: "theory",
      subtitle: "An enable master-gate, and 2^k-to-1 from 2^k-1 little 2-to-1 MUXes.",
      theoryEN: [
        "Two practical extensions round out the multiplexer. The first is the ENABLE input, which acts like the master signal box at the rail junction. When the enable is de-asserted (disabled), the whole junction is closed and the output is forced inactive - a 0 or a high-impedance state - no matter what the select and data lines are doing. When enable is asserted, the MUX behaves completely normally and routes the selected input.",
        "In algebra the enable is just one more AND on the output: Y = EN . (selected input), or fully written for a 4-to-1, Y = EN.(S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3). With EN = 1 the output is the normal core, and with EN = 0 the whole thing is forced to 0. You can build it with one extra 2-input AND on the output, costing the 8th gate of an enabled 4-to-1.",
        "The second extension is cascading: small multiplexers snap together to make big ones. The cleanest example is the 8-to-1 built from two 4-to-1 MUXes feeding one 2-to-1 MUX. The two 4-to-1 blocks share the lower select bits S1 and S0 and each select one input from its half (inputs 0 to 3 and inputs 4 to 7); the final 2-to-1, driven by the high bit S2, picks which half's output passes through.",
        "Algebraically the cascade is honest: Y = S2'.(low 4-to-1 output) + S2.(high 4-to-1 output), and expanding it gives back the full 8-minterm sum over S2 S1 S0. The high select bit chooses the half, the low bits choose within the half, and the tree reproduces a true 8-to-1.",
        "There is a tidy counting rule for the all-2-to-1 version. If you build a 2^k-to-1 MUX entirely out of 2-to-1 MUXes arranged as a balanced tree, it takes exactly 2^k minus 1 of them. For an 8-to-1 that is 2^3 minus 1 = 7 little 2-to-1 MUXes; for a 16-to-1 it is 15. Each layer of the tree halves the number of surviving signals until just one reaches the output."
      ],
      theoryHI: [
        "दो व्यावहारिक विस्तार multiplexer को पूरा करते हैं। पहला है ENABLE input, जो rail junction पर master signal box की तरह काम करता है। जब enable de-assert (disabled) हो, पूरा junction बंद है और output मजबूरन inactive है - एक 0 या high-impedance state - चाहे select और data lines कुछ भी कर रही हों। जब enable assert हो, MUX बिलकुल सामान्य बर्ताव करता है और चुना input route करता है।",
        "Algebra में enable बस output पर एक और AND है: Y = EN . (selected input), या 4-to-1 के लिए पूरा लिखा, Y = EN.(S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3)। EN = 1 पर output सामान्य core है, और EN = 0 पर पूरी चीज़ मजबूरन 0 हो जाती है। आप इसे output पर एक अतिरिक्त 2-input AND से बना सकते हैं, जो enabled 4-to-1 का 8वाँ gate है।",
        "दूसरा विस्तार है cascading: छोटे multiplexers आपस में जुड़कर बड़े बनाते हैं। सबसे साफ़ उदाहरण है दो 4-to-1 MUXes से बना 8-to-1 जो एक 2-to-1 MUX को feed करते हैं। दोनों 4-to-1 blocks निचले select bits S1 और S0 साझा करते हैं और हर एक अपने आधे से एक input चुनता है (inputs 0 से 3 और inputs 4 से 7); आख़िरी 2-to-1, high bit S2 से चलाया, चुनता है कि किस आधे का output निकले।",
        "Algebra में cascade ईमानदार है: Y = S2'.(low 4-to-1 output) + S2.(high 4-to-1 output), और इसे फैलाने पर वापस मिलता है S2 S1 S0 पर पूरा 8-minterm sum। High select bit आधा चुनता है, low bits आधे के भीतर चुनते हैं, और tree एक सच्चा 8-to-1 दोहराता है।",
        "All-2-to-1 रूप के लिए एक सुथरा गिनती नियम है। अगर आप एक 2^k-to-1 MUX पूरी तरह 2-to-1 MUXes से एक संतुलित tree की तरह बनाएँ, तो इसमें ठीक 2^k minus 1 लगते हैं। एक 8-to-1 के लिए वह 2^3 minus 1 = 7 छोटे 2-to-1 MUXes; एक 16-to-1 के लिए 15। Tree की हर परत बचे signals की संख्या आधी कर देती है जब तक सिर्फ़ एक output तक पहुँचे।"
      ],
      transcriptEN: "Two practical extensions round out the MUX. First, the enable input, like the master signal box at the junction. When disabled, the whole junction closes and the output is forced inactive - zero or high-impedance - regardless of select and data. When enabled, the MUX routes normally. In algebra it's one more AND on the output: Y equals EN AND the selected input, costing one extra two-input AND, the eighth gate of an enabled four-to-one. Second, cascading: small MUXes snap into big ones. The cleanest example, an eight-to-one from two four-to-ones feeding one two-to-one. The two four-to-ones share S1 and S0 and each pick from their half; the final two-to-one, driven by S2, picks which half passes. Algebraically Y equals S2-prime times the low output plus S2 times the high output, which expands to the full eight-minterm sum. And the counting rule for the all-two-to-one version: a two-to-the-k-to-one tree takes exactly two-to-the-k minus one of them - seven for an eight-to-one, fifteen for a sixteen-to-one.",
      transcriptHI: "दो व्यावहारिक विस्तार MUX को पूरा करते हैं। पहला, enable input, junction पर master signal box की तरह। Disabled पर पूरा junction बंद होता है और output मजबूरन inactive - शून्य या high-impedance - select और data चाहे जो हों। Enabled पर MUX सामान्य route करता है। Algebra में यह output पर एक और AND है: Y बराबर EN AND चुना input, जो एक अतिरिक्त two-input AND, enabled four-to-one का आठवाँ gate। दूसरा, cascading: छोटे MUXes बड़े में जुड़ते हैं। सबसे साफ़ उदाहरण, दो four-to-ones से एक eight-to-one जो एक two-to-one को feed करते हैं। दोनों four-to-ones S1 और S0 साझा करते हैं और हर एक अपने आधे से चुनता है; आख़िरी two-to-one, S2 से चलाया, चुनता है कौन सा आधा निकले। Algebra में Y बराबर S2-prime times low output plus S2 times high output, जो पूरे eight-minterm sum में फैलता है। और all-two-to-one रूप का गिनती नियम: एक two-to-the-k-to-one tree ठीक two-to-the-k minus one लेता है - eight-to-one के लिए सात, sixteen-to-one के लिए पंद्रह।",
      visualNote: "A tree schematic: two 4-to-1 MUXes (selects S1,S0) feeding a final 2-to-1 MUX (select S2) producing one 8-to-1 output, with an enable line ANDed at the output and a 2^k-1 counter."
    },
    {
      id: "S11_Build",
      label: "Build The 4-to-1 MUX For Real",
      kind: "theory",
      subtitle: "Open the workbench and wire 2 NOTs, 4 ANDs and one OR into a real 4-to-1 MUX.",
      theoryEN: [
        "Now stop reading and build one. Everything in this module collapses to a tiny pile of gates you can wire yourself: a 4-to-1 multiplexer is just two inverters, four 3-input AND gates and one 4-input OR gate, exactly 7 gates building Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3.",
        "On the workbench, place the two select inputs S1 and S0 and run each through a NOT gate to create S1' and S0'. Then build the four minterm AND gates: A0 takes D0 with S1' and S0', A1 takes D1 with S1' and S0, A2 takes D2 with S1 and S0', and A3 takes D3 with S1 and S0. Feed all four AND outputs into the single 4-input OR gate, and its output is Y.",
        "Then prove it row by row, the way a real engineer signs off a circuit. Dial each select code in turn - 00, 01, 10, 11 - and confirm that the output follows D0, then D1, then D2, then D3, while toggling the data inputs to see exactly one of them reach Y at a time. If the wrong train ever rolls through, you have a miswire to chase, usually a swapped select literal on one AND.",
        "Once the bare 4-to-1 works, try the universality trick on real hardware: tie the data inputs to the XOR pattern 0,1,1,0 with S1 = A and S0 = B, and watch your MUX behave as an XOR gate. That single experiment makes the lookup-table idea unforgettable. Open the workbench below and route your first train."
      ],
      theoryHI: [
        "अब पढ़ना रोकिए और एक बनाइए। इस module का सब कुछ gates के एक छोटे ढेर में सिमट जाता है जिसे आप ख़ुद wire कर सकते हैं: एक 4-to-1 multiplexer बस दो inverters, चार 3-input AND gates और एक 4-input OR gate है, ठीक 7 gates जो Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3 साकार करते हैं।",
        "Workbench पर, दो select inputs S1 और S0 रखिए और हर एक को एक NOT gate से चलाकर S1' और S0' बनाइए। फिर चार minterm AND gates बनाइए: A0 लेता है D0 को S1' और S0' के साथ, A1 लेता है D1 को S1' और S0 के साथ, A2 लेता है D2 को S1 और S0' के साथ, और A3 लेता है D3 को S1 और S0 के साथ। चारों AND outputs को अकेले 4-input OR gate में feed कीजिए, और उसका output है Y।",
        "फिर इसे row-दर-row साबित कीजिए, जैसे एक असली engineer circuit पर मुहर लगाता है। हर select code बारी-बारी dial कीजिए - 00, 01, 10, 11 - और पुष्टि कीजिए कि output D0, फिर D1, फिर D2, फिर D3 का पीछा करता है, data inputs toggle करते हुए यह देखने को कि एक समय में ठीक एक Y तक पहुँचे। अगर कभी ग़लत train निकले, तो आपके पास एक miswire पकड़ने को है, आमतौर पर किसी एक AND पर एक बदला select literal।",
        "जब नंगा 4-to-1 चल जाए, असली hardware पर universality trick आज़माइए: data inputs को XOR pattern 0,1,1,0 से बाँधिए S1 = A और S0 = B के साथ, और देखिए आपका MUX एक XOR gate जैसा बर्ताव करे। वही एक प्रयोग lookup-table विचार को अविस्मरणीय बना देता है। नीचे workbench खोलिए और अपनी पहली train route कीजिए।"
      ],
      transcriptEN: "Now stop reading and build one. A four-to-one MUX is just two inverters, four three-input ANDs and one four-input OR - seven gates building Y equals S1-prime S0-prime D0 plus S1-prime S0 D1 plus S1 S0-prime D2 plus S1 S0 D3. On the workbench, run S1 and S0 through NOTs to get S1-prime and S0-prime, then build the four minterm ANDs - A0 with D0, S1-prime, S0-prime; A1 with D1, S1-prime, S0; A2 with D2, S1, S0-prime; A3 with D3, S1, S0 - and OR them into Y. Then prove it row by row: dial each code, zero-zero, zero-one, one-zero, one-one, and confirm the output follows D0, D1, D2, D3 in turn. If the wrong train rolls through, chase the miswire, usually a swapped select literal. Then try the universality trick: tie the data to zero-one-one-zero with S1 equals A and S0 equals B and watch your MUX behave as XOR. Open the workbench and route your first train.",
      transcriptHI: "अब पढ़ना रोकिए और एक बनाइए। एक four-to-one MUX बस दो inverters, चार three-input ANDs और एक four-input OR है - सात gates जो Y बराबर S1-prime S0-prime D0 plus S1-prime S0 D1 plus S1 S0-prime D2 plus S1 S0 D3 साकार करते हैं। Workbench पर, S1 और S0 को NOTs से चलाकर S1-prime और S0-prime बनाइए, फिर चार minterm ANDs बनाइए - A0 को D0, S1-prime, S0-prime; A1 को D1, S1-prime, S0; A2 को D2, S1, S0-prime; A3 को D3, S1, S0 - और इन्हें Y में OR कीजिए। फिर row-दर-row साबित कीजिए: हर code dial कीजिए, zero-zero, zero-one, one-zero, one-one, और पुष्टि कीजिए कि output बारी-बारी D0, D1, D2, D3 का पीछा करता है। अगर ग़लत train निकले, miswire पकड़िए, आमतौर पर एक बदला select literal। फिर universality trick आज़माइए: data को zero-one-one-zero से बाँधिए S1 बराबर A और S0 बराबर B के साथ और देखिए MUX XOR जैसा बर्ताव करे। Workbench खोलिए और अपनी पहली train route कीजिए।",
      visualNote: "WorkbenchCTA opening /workbench?tutorial=mux-4to1, plus a static reminder schematic of the 7-gate 4-to-1 build."
    },
    {
      id: "S12_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Eight flip-cards to lock in the sizing rule, the equations and the LUT trick.",
      theoryEN: [
        "These eight flip-cards drill the facts that matter most: what a MUX is, the sizing rule inputs = 2^n, the 2-to-1 and 4-to-1 equations, the universal-LUT property, the enable behaviour and the cascading count. Cover the back, say the answer out loud, then flip to check, and repeat any card you fumble until recall is reflex.",
        "Give extra reps to the two equation cards, Y = S'.D0 + S.D1 and the four-term 4-to-1 sum, because those are what examiners most often ask you to write from scratch and to map onto a gate count.",
        "If you keep only one idea, keep this: the binary value on the select lines is the index of the input that gets through, and n select lines route 2^n inputs to 1 output - the whole track switch in a single line."
      ],
      theoryHI: [
        "ये आठ flip-cards सबसे ज़रूरी तथ्य रटाते हैं: MUX क्या है, sizing नियम inputs = 2^n, 2-to-1 और 4-to-1 equations, universal-LUT गुण, enable बर्ताव और cascading गिनती। पीछे ढककर जवाब ज़ोर से बोलिए, फिर जाँचने को पलटिए, और जो card अटके उसे तब तक दोहराइए जब तक याद reflex न बन जाए।",
        "दो equation cards, Y = S'.D0 + S.D1 और चार-term 4-to-1 sum, को ज़्यादा दोहराइए, क्योंकि examiner इन्हें शुरू से लिखवाना और gate count पर map करवाना सबसे ज़्यादा पूछते हैं।",
        "अगर आप सिर्फ़ एक विचार रखें, तो यह: select lines पर जो binary मान है वह उस input का index है जो निकलता है, और n select lines 2^n inputs को 1 output पर route करती हैं - पूरा track switch एक line में।"
      ],
      transcriptEN: "Eight quick flip-cards to set it solid. Front asks, back answers - cover the back, say it aloud, then flip to check. Give extra reps to the two equation cards, Y equals S-prime D0 plus S D1 and the four-term four-to-one sum, because those are what examiners ask you to write from scratch and map onto a gate count. Keep one idea: the binary value on the select lines is the index of the input that gets through, and n selects route two-to-the-n inputs to one output.",
      transcriptHI: "इसे पक्का करने को आठ तेज़ flip-cards। आगे सवाल, पीछे जवाब - पीछे ढककर ज़ोर से बोलिए, फिर पलटिए। दो equation cards, Y बराबर S-prime D0 plus S D1 और चार-term four-to-one sum, को ज़्यादा दोहराइए, क्योंकि examiner इन्हें शुरू से लिखवाते और gate count पर map करवाते हैं। एक विचार रखिए: select lines पर जो binary मान है वह उस input का index है जो निकलता है, और n selects two-to-the-n inputs को एक output पर route करती हैं।",
      visualNote: "Standard bilingual flip deck, eight cards."
    },
    {
      id: "S13_Quiz",
      label: "Quiz Arena",
      kind: "quiz",
      subtitle: "Eight questions - prove you can size, build and reason about a MUX.",
      theoryEN: [
        "Eight multiple-choice questions now check that the track switch has really sunk in. They probe the sizing rule (how many inputs and outputs for n selects), the 2-to-1 behaviour when S=1, which gates implement a chosen minterm, the cascading count for an 8-to-1, the two-4-to-1-plus-2-to-1 build, the XOR-from-MUX data values, the universal-LUT reasoning, and what an enable input does when disabled.",
        "Several questions are circuit-building questions, not recall: you will count gates, decide which AND implements the D2 term, and read off the data values for a function you build. Work those carefully rather than guessing - write the minterm, count the literals, and check the index.",
        "Aim for full marks here, because clearing all eight means you can both analyse a multiplexer and build one from scratch, which is exactly the skill the workbench tutorial will put in your hands."
      ],
      theoryHI: [
        "आठ bahu-vikalp सवाल अब जाँचते हैं कि track switch सचमुच बैठा या नहीं। ये पूछते हैं sizing नियम (n selects के लिए कितने inputs और outputs), S=1 पर 2-to-1 बर्ताव, कौन से gates एक चुने minterm को implement करते हैं, एक 8-to-1 के लिए cascading गिनती, दो-4-to-1-जमा-2-to-1 build, XOR-from-MUX data मान, universal-LUT तर्क, और disabled पर enable input क्या करता है।",
        "कई सवाल circuit-building हैं, याद नहीं: आप gates गिनेंगे, तय करेंगे कौन सा AND D2 term implement करता है, और आपके बनाए एक function के data मान पढ़ेंगे। उन्हें अंदाज़े के बजाय ध्यान से कीजिए - minterm लिखिए, literals गिनिए, और index जाँचिए।",
        "यहाँ पूरे अंक का लक्ष्य रखिए, क्योंकि आठों साफ़ करना मतलब आप एक multiplexer का विश्लेषण भी कर सकते हैं और उसे शुरू से बना भी सकते हैं, ठीक वही कौशल जो workbench tutorial आपके हाथ में देगा।"
      ],
      transcriptEN: "Eight questions in the arena. They check the sizing rule, the two-to-one behaviour when S is one, which gates implement a chosen minterm, the cascading count for an eight-to-one, the two-four-to-one-plus-two-to-one build, the XOR-from-MUX data values, the universal-LUT reasoning, and what an enable does when disabled. Several are circuit-building: count gates, decide which AND implements the D2 term, read off the data for a function you build. Work those carefully - write the minterm, count the literals, check the index. Clear all eight and you can both analyse a MUX and build one from scratch.",
      transcriptHI: "Arena में आठ सवाल। ये जाँचते हैं sizing नियम, S एक पर two-to-one बर्ताव, कौन से gates एक चुने minterm को implement करते हैं, एक eight-to-one के लिए cascading गिनती, two-four-to-one-जमा-two-to-one build, XOR-from-MUX data मान, universal-LUT तर्क, और disabled पर enable क्या करता है। कई circuit-building हैं: gates गिनिए, तय कीजिए कौन सा AND D2 term implement करता है, आपके बनाए एक function का data पढ़िए। उन्हें ध्यान से कीजिए - minterm लिखिए, literals गिनिए, index जाँचिए। आठों साफ़ कीजिए और आप एक MUX का विश्लेषण भी और उसे शुरू से बना भी सकते हैं।",
      visualNote: "Parameterized QuizArena with the eight spec questions."
    },
    {
      id: "S14_Recap",
      label: "Recap & Sources",
      kind: "recap",
      subtitle: "You can now route any of many inputs to one output - the track switch is yours.",
      theoryEN: [
        "Let us bank the whole thing. A multiplexer is a combinational many-to-1 data selector: n select lines carry a binary address that routes exactly one of 2^n data inputs to a single output Y, exactly like a switch operator throwing a junction so one of many waiting trains rolls onto the single main line. The three numbers always lock together as inputs = 2^n, select lines = n, outputs = 1.",
        "The equations are the law. A 2-to-1 MUX is Y = S'.D0 + S.D1, built from 1 NOT, 2 ANDs and 1 OR (4 gates). A 4-to-1 MUX is Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3, built from 2 NOTs, four 3-input ANDs and one 4-input OR (7 gates). In both, each input is gated by its address minterm and exactly one term is ever active.",
        "Two big ideas extend the block. First, a 2^n-to-1 MUX is a universal lookup table for any function of n+1 variables - we built XOR from a 4-to-1 by parking 0,1,1,0 on its data inputs - which is the Shannon-expansion trick at the heart of every FPGA. Second, an enable input is a master gate (Y = EN . selected input) and small MUXes cascade into big ones, with a 2^k-to-1 tree of 2-to-1 MUXes costing 2^k minus 1 of them.",
        "Step back and see the pattern of the whole combinational-blocks track you are climbing. The multiplexer routes many inputs to one output; next comes its mirror image the demultiplexer, which routes one input to one of many outputs, and then decoders and encoders that translate between addresses and one-hot lines. Each is the humble AND-OR-NOT trio arranged to do one specific routing job.",
        "The quiet lesson is that a few inverters, AND gates and an OR gate, wired to honour a select address, give you a data selector flexible enough to imitate any logic at all. Master the MUX and you have mastered the most reusable routing primitive in digital design."
      ],
      theoryHI: [
        "चलिए पूरी बात जमा कर लें। Multiplexer एक combinational many-to-1 data selector है: n select lines एक binary address ले जाती हैं जो 2^n data inputs में से ठीक एक को एक अकेले output Y पर route करता है, ठीक वैसे जैसे एक switch operator junction throw करता है ताकि कई इंतज़ार करती trains में से एक अकेली main line पर चढ़े। तीनों संख्याएँ हमेशा inputs = 2^n, select lines = n, outputs = 1 के रूप में बँधी रहती हैं।",
        "Equations ही नियम हैं। एक 2-to-1 MUX है Y = S'.D0 + S.D1, बना 1 NOT, 2 ANDs और 1 OR (4 gates) से। एक 4-to-1 MUX है Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3, बना 2 NOTs, चार 3-input ANDs और एक 4-input OR (7 gates) से। दोनों में, हर input अपने address minterm से gate होता है और हमेशा ठीक एक term active रहता है।",
        "दो बड़े विचार block को विस्तार देते हैं। पहला, एक 2^n-to-1 MUX n+1 variables के किसी function के लिए universal lookup table है - हमने एक 4-to-1 से XOR बनाया उसके data inputs पर 0,1,1,0 खड़ा करके - जो हर FPGA के दिल में बैठा Shannon-expansion trick है। दूसरा, enable input एक master gate है (Y = EN . selected input) और छोटे MUXes बड़े में cascade होते हैं, एक 2^k-to-1 tree of 2-to-1 MUXes में 2^k minus 1 लगते हैं।",
        "पीछे हटकर पूरे combinational-blocks track का pattern देखिए जिस पर आप चढ़ रहे हैं। Multiplexer कई inputs को एक output पर route करता है; अगला आता है इसका दर्पण-प्रतिबिंब demultiplexer, जो एक input को कई outputs में से एक पर route करता है, और फिर decoders तथा encoders जो addresses और one-hot lines के बीच अनुवाद करते हैं। हर एक वही मामूली AND-OR-NOT तिकड़ी है, एक ख़ास routing काम करने को सजी।",
        "चुपचाप सबक़ यह है कि कुछ inverters, AND gates और एक OR gate, एक select address का सम्मान करने को wired, आपको एक data selector देते हैं जो किसी भी logic की नक़ल करने जितना लचीला है। MUX में महारत पाइए और आपने digital design का सबसे दोबारा-वापरने-योग्य routing primitive पा लिया।"
      ],
      transcriptEN: "Let's bank the whole thing. A multiplexer is a combinational many-to-1 data selector: n select lines carry a binary address that routes exactly one of two-to-the-n data inputs to one output Y, like a switch operator throwing a junction so one waiting train rolls onto the main line. The three numbers lock together: inputs equals two-to-the-n, selects equals n, outputs equals one. The equations are the law: a two-to-one is Y equals S-prime D0 plus S D1, four gates; a four-to-one is the four-minterm sum, seven gates. Two big ideas extend it: a two-to-the-n-to-one MUX is a universal lookup table for any function of n-plus-one variables - we built XOR from a four-to-one - and an enable is a master gate while small MUXes cascade into big ones, a two-to-the-k tree of two-to-ones costing two-to-the-k minus one. Next comes the demultiplexer, the mirror image, then decoders and encoders. Master the MUX and you've mastered the most reusable routing primitive in digital design.",
      transcriptHI: "चलिए पूरी बात जमा कर लें। Multiplexer एक combinational many-to-1 data selector है: n select lines एक binary address ले जाती हैं जो two-to-the-n data inputs में से ठीक एक को एक output Y पर route करता है, जैसे एक switch operator junction throw करता है ताकि एक इंतज़ार करती train main line पर चढ़े। तीनों संख्याएँ बँधी रहती हैं: inputs बराबर two-to-the-n, selects बराबर n, outputs बराबर एक। Equations नियम हैं: two-to-one है Y बराबर S-prime D0 plus S D1, चार gates; four-to-one है चार-minterm sum, सात gates। दो बड़े विचार इसे विस्तार देते हैं: एक two-to-the-n-to-one MUX n-plus-one variables के किसी function के लिए universal lookup table है - हमने four-to-one से XOR बनाया - और enable एक master gate है जबकि छोटे MUXes बड़े में cascade होते हैं, एक two-to-the-k tree of two-to-ones में two-to-the-k minus one लगते हैं। अगला आता है demultiplexer, दर्पण-प्रतिबिंब, फिर decoders और encoders। MUX में महारत पाइए और आपने digital design का सबसे दोबारा-वापरने-योग्य routing primitive पा लिया।",
      visualNote: "Recap card: the two MUX equations and gate counts on the left, the trapezoid symbol and select-index rule on the right; a track ribbon MUX -> DEMUX -> Decoder -> Encoder."
    }
  ],
  flashcards: [
    {
      frontEN: "What is a multiplexer (MUX)?",
      backEN: "A combinational many-to-1 data selector: it routes ONE of 2^n data inputs to a single output, chosen by n select lines.",
      frontHI: "Multiplexer (MUX) क्या है?",
      backHI: "एक combinational many-to-1 data selector: यह 2^n data inputs में से एक को एक अकेले output पर route करता है, जो n select lines से चुना जाता है।"
    },
    {
      frontEN: "What do the select lines carry, and how many inputs do n of them address?",
      backEN: "They carry the binary 'address' of which data input to pass through; n select lines pick 1 of 2^n inputs. They never carry data themselves.",
      frontHI: "Select lines क्या ले जाती हैं, और इनमें से n कितने inputs को address करती हैं?",
      backHI: "ये उस data input का binary 'address' ले जाती हैं जिसे pass करना है; n select lines 2^n inputs में से 1 चुनती हैं। ये ख़ुद कभी data नहीं ले जातीं।"
    },
    {
      frontEN: "State the MUX sizing rule (inputs, selects, outputs).",
      backEN: "inputs = 2^n, select lines = n = log2(inputs), outputs = 1 (a MUX always has exactly one output).",
      frontHI: "MUX का sizing नियम बताइए (inputs, selects, outputs)।",
      backHI: "inputs = 2^n, select lines = n = log2(inputs), outputs = 1 (MUX में हमेशा ठीक एक output होता है)।"
    },
    {
      frontEN: "Write the 2-to-1 MUX equation and its gate count.",
      backEN: "Y = S'.D0 + S.D1 - passes D0 when S=0, D1 when S=1. Built from 1 NOT, 2 ANDs and 1 OR = 4 gates.",
      frontHI: "2-to-1 MUX equation और इसका gate count लिखिए।",
      backHI: "Y = S'.D0 + S.D1 - S=0 पर D0 pass करता है, S=1 पर D1। बना 1 NOT, 2 ANDs और 1 OR = 4 gates से।"
    },
    {
      frontEN: "Write the 4-to-1 MUX equation and its gate count.",
      backEN: "Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3. The binary value of S1S0 indexes the input. Built from 2 NOT, four 3-input ANDs, one 4-input OR = 7 gates.",
      frontHI: "4-to-1 MUX equation और इसका gate count लिखिए।",
      backHI: "Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3। S1S0 का binary मान input को index करता है। बना 2 NOT, चार 3-input ANDs, एक 4-input OR = 7 gates से।"
    },
    {
      frontEN: "Why is a MUX a universal lookup table (LUT)?",
      backEN: "A 2^n-to-1 MUX implements any Boolean function of n+1 variables: wire the variables to the select lines, and the truth-table outputs (0,1,x or x') to the data inputs (Shannon expansion).",
      frontHI: "MUX एक universal lookup table (LUT) क्यों है?",
      backHI: "एक 2^n-to-1 MUX n+1 variables के किसी Boolean function को implement करता है: variables को select lines से, और truth-table outputs (0,1,x या x') को data inputs से जोड़िए (Shannon expansion)।"
    },
    {
      frontEN: "What does an enable input do?",
      backEN: "A master control like a signal box: when disabled it forces the output inactive (0 or high-Z) regardless of select/data; when enabled the MUX routes the selected input normally. Y = EN.(selected input).",
      frontHI: "Enable input क्या करता है?",
      backHI: "एक master control, signal box की तरह: disabled होने पर output को मजबूरन inactive (0 या high-Z) करता है, select/data चाहे जो हों; enabled होने पर MUX चुना input सामान्य route करता है। Y = EN.(selected input)।"
    },
    {
      frontEN: "How do small MUXes cascade into big ones?",
      backEN: "Two 4-to-1 MUXes (sharing S1,S0) feeding one 2-to-1 MUX (select S2) make an 8-to-1. A 2^k-to-1 tree built only from 2-to-1 MUXes needs 2^k - 1 of them (8-to-1 needs 7).",
      frontHI: "छोटे MUXes बड़े में कैसे cascade होते हैं?",
      backHI: "दो 4-to-1 MUXes (S1,S0 साझा करते) एक 2-to-1 MUX (select S2) को feed करके एक 8-to-1 बनाते हैं। सिर्फ़ 2-to-1 MUXes से बने एक 2^k-to-1 tree में 2^k - 1 लगते हैं (8-to-1 को 7)।"
    }
  ],
  quiz: [
    {
      questionEN: "A multiplexer with 3 select lines has how many data inputs and outputs?",
      options: [
        "3 inputs, 3 outputs",
        "8 inputs, 1 output",
        "6 inputs, 1 output",
        "8 inputs, 8 outputs"
      ],
      answerIndex: 1,
      explainEN: "inputs = 2^n = 2^3 = 8, and a MUX always has exactly 1 output.",
      explainHI: "inputs = 2^n = 2^3 = 8, और MUX में हमेशा ठीक 1 output होता है।",
      questionHI: "3 select lines वाले multiplexer में कितने data inputs और outputs होते हैं?"
    },
    {
      questionEN: "For a 2-to-1 MUX with Y = S'.D0 + S.D1, what is Y when S=1?",
      options: ["Y = D0", "Y = D1", "Y = D0.D1", "Y = 0"],
      answerIndex: 1,
      explainEN: "S=1 makes S'=0, killing the D0 term and leaving Y = 1.D1 = D1.",
      explainHI: "S=1 से S'=0 हो जाता है, D0 term मर जाता है और बचता है Y = 1.D1 = D1।",
      questionHI: "Y = S'.D0 + S.D1 वाले 2-to-1 MUX के लिए, S=1 पर Y क्या है?"
    },
    {
      questionEN: "In a 4-to-1 MUX, which gates implement the term that selects D2 (select code S1S0=10)?",
      options: [
        "S1.S0.D2 (two ANDs feeding the term)",
        "S1'.S0'.D2",
        "A 3-input AND of S1, S0', and D2",
        "S1' + S0 + D2 using an OR"
      ],
      answerIndex: 2,
      explainEN: "Code 10 means S1=1, S0=0, so the minterm is S1.S0', giving a 3-input AND of S1, S0', and D2.",
      explainHI: "Code 10 मतलब S1=1, S0=0, तो minterm है S1.S0', जो S1, S0', और D2 का 3-input AND देता है।",
      questionHI: "एक 4-to-1 MUX में, कौन से gates उस term को implement करते हैं जो D2 चुनता है (select code S1S0=10)?"
    },
    {
      questionEN: "How many 2-to-1 MUXes are needed to build an 8-to-1 MUX as a tree?",
      options: ["3", "4", "7", "8"],
      answerIndex: 2,
      explainEN: "A 2^k-to-1 tree needs 2^k - 1 two-to-1 MUXes; for k=3 that is 8 - 1 = 7.",
      explainHI: "एक 2^k-to-1 tree को 2^k - 1 two-to-1 MUXes चाहिए; k=3 के लिए वह 8 - 1 = 7 है।",
      questionHI: "एक 8-to-1 MUX को tree के रूप में बनाने के लिए कितने 2-to-1 MUXes चाहिए?"
    },
    {
      questionEN: "To build an 8-to-1 MUX from two 4-to-1 MUXes, what extra component is required and what selects between the two halves?",
      options: [
        "An OR gate; selected by S0",
        "One 2-to-1 MUX; selected by the highest select bit S2",
        "An inverter; selected by S1",
        "A decoder; no extra select needed"
      ],
      answerIndex: 1,
      explainEN: "Two 4-to-1 MUXes handle the low bits S1S0; a final 2-to-1 MUX driven by the high bit S2 picks which 4-to-1 output passes.",
      explainHI: "दो 4-to-1 MUXes low bits S1S0 सँभालते हैं; high bit S2 से चलाया एक आख़िरी 2-to-1 MUX चुनता है कि कौन सा 4-to-1 output निकले।",
      questionHI: "दो 4-to-1 MUXes से एक 8-to-1 MUX बनाने के लिए कौन सा अतिरिक्त component चाहिए और दोनों हिस्सों के बीच क्या चुनता है?"
    },
    {
      questionEN: "You want to build Y = A xor B using a 4-to-1 MUX with S1=A, S0=B. What values go on D0,D1,D2,D3?",
      options: ["1,0,0,1", "0,1,1,0", "1,1,1,1", "0,0,1,1"],
      answerIndex: 1,
      explainEN: "XOR truth table: 00->0, 01->1, 10->1, 11->0, so D0=0, D1=1, D2=1, D3=0.",
      explainHI: "XOR truth table: 00->0, 01->1, 10->1, 11->0, तो D0=0, D1=1, D2=1, D3=0।",
      questionHI: "आप S1=A, S0=B वाले 4-to-1 MUX से Y = A xor B बनाना चाहते हैं। D0,D1,D2,D3 पर कौन से मान जाते हैं?"
    },
    {
      questionEN: "Why can a 4-to-1 MUX implement any Boolean function of 3 variables?",
      options: [
        "Because it has 3 select lines",
        "Because 2^2-to-1 implements any function of 2+1 = 3 variables via Shannon expansion",
        "Because it has 4 outputs to cover all cases",
        "Because OR gates are universal"
      ],
      answerIndex: 1,
      explainEN: "A 2^n-to-1 MUX (here n=2) builds any function of n+1 = 3 variables: 2 go to the select lines, the third (and constants) feed the data inputs.",
      explainHI: "एक 2^n-to-1 MUX (यहाँ n=2) n+1 = 3 variables के किसी function को साकार करता है: 2 select lines पर जाते हैं, तीसरा (और स्थिरांक) data inputs को feed करते हैं।",
      questionHI: "एक 4-to-1 MUX 3 variables के किसी भी Boolean function को क्यों implement कर सकता है?"
    },
    {
      questionEN: "What does an ENABLE input do when it is de-asserted (disabled) on a MUX?",
      options: [
        "Forces the output to follow D0",
        "Inverts the selected input",
        "Forces the output inactive (0 or high-Z) regardless of select/data",
        "Doubles the number of inputs"
      ],
      answerIndex: 2,
      explainEN: "Enable acts as a master gate: disabled means the output is forced to an inactive state no matter what the select and data lines are.",
      explainHI: "Enable एक master gate की तरह काम करता है: disabled मतलब output मजबूरन inactive state में, select और data lines चाहे जो हों।",
      questionHI: "एक MUX पर ENABLE input जब de-assert (disabled) हो तो क्या करता है?"
    }
  ]
};
