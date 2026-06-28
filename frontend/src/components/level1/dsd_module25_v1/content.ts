import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/25 - Code Converters ("The International Translator Booth").
 * Source: specs/dsd25.json. A code converter is pure combinational logic that
 * rewrites the SAME numeric value from one binary code into another - Binary,
 * Gray, BCD, Excess-3 - exactly like a translator turning "Hello" into "Hola"
 * without changing the meaning. Binary->Gray uses g_i = b_{i+1} ^ b_i (the MSB
 * passes straight through); Gray->Binary is a running XOR b_i = b_{i+1} ^ g_i;
 * BCD->Excess-3 adds 0011 (+3) and Excess-3->BCD subtracts it (-3).
 */
export const CONTENT = ({
  moduleTitle: "Code Converters - Translating Number Languages",
  moduleSubtitle: "Combinational bridges that rewrite the same value from one binary code into another: Binary, Gray, BCD, Excess-3 - the meaning never changes, only the spelling.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The Translator Booth",
      kind: "cover",
      subtitle: "Decimal 5 is still 5 in every language - a code converter just re-spells it in the one the next device understands.",
      theoryEN: [
        "This module builds code converters, the small combinational circuits that let two digital devices which 'speak' different number languages talk to each other. One chip might talk plain binary, the next might talk Gray code, a third might talk BCD or Excess-3 - they all mean the same value, but they spell it with different bit patterns. A code converter is the translator booth wedged between them.",
        "Hold this one picture for the whole module: an international translator. When you say 'Hello' and the translator says 'Hola', the meaning never changes - only the word does. A code converter does exactly that with numbers: decimal 5 is 5 in every code, and the converter only re-spells the 5 from the source language into the target language, never altering the value it stands for.",
        "Because a code converter is pure gate logic with no flip-flops and no clock (it is combinational), the translation is instant. The moment you change the input word, the output word changes to match, with nothing but a tiny propagation delay - the translator answers the moment you speak and never stores a past word.",
        "We will build the four conversions every student must know. Binary to Gray and Gray to Binary are XOR conversions: g_i = b_{i+1} ^ b_i going out, and a running XOR coming back. BCD to Excess-3 and Excess-3 to BCD are arithmetic conversions: add binary 0011 (+3) going out, subtract it (-3) coming back.",
        "By the end you will be able to design any converter the disciplined way - write its truth table, minimise each output bit with a K-map into a Sum-Of-Products expression, and wire up the gates - and you will know exactly why Gray code, where only one bit changes per step, is the language of choice for mechanical and optical sensors."
      ],
      theoryHI: [
        "इस module में हम code converters बनाएँगे, वे छोटी combinational circuits जो दो digital devices को - जो अलग-अलग number language 'बोलते' हैं - आपस में बात करने देती हैं। एक chip सादा binary बोल सकता है, अगला Gray code, तीसरा BCD या Excess-3 - ये सब एक ही value का मतलब रखते हैं, पर उसे अलग bit patterns से spell करते हैं। एक code converter उनके बीच ठुँसी translator booth है।",
        "पूरे module के लिए यह एक तस्वीर पकड़े रखिए: एक international translator। जब आप 'Hello' कहते हैं और translator 'Hola' कहता है, मतलब कभी नहीं बदलता - सिर्फ़ शब्द बदलता है। एक code converter संख्याओं के साथ ठीक यही करता है: decimal 5 हर code में 5 है, और converter सिर्फ़ उस 5 को source language से target language में दोबारा spell करता है, वह जिस value को दर्शाता है उसे कभी नहीं बदलता।",
        "चूँकि एक code converter बिना किसी flip-flop और clock के शुद्ध gate logic है (यह combinational है), translation तुरंत होता है। जैसे ही आप input शब्द बदलते हैं, output शब्द उससे मिलने के लिए बदल जाता है, बस एक नन्हे propagation delay के सिवा कुछ नहीं - translator आपके बोलते ही जवाब देता है और कोई पुराना शब्द कभी store नहीं करता।",
        "हम चार conversions बनाएँगे जो हर student को आनी चाहिए। Binary to Gray और Gray to Binary XOR conversions हैं: जाते समय g_i = b_{i+1} ^ b_i, और लौटते समय एक running XOR। BCD to Excess-3 और Excess-3 to BCD arithmetic conversions हैं: जाते समय binary 0011 जोड़ो (+3), लौटते समय घटाओ (-3)।",
        "अंत तक आप किसी भी converter को अनुशासित तरीक़े से design कर पाएँगे - उसकी truth table लिखिए, हर output bit को K-map से Sum-Of-Products में minimise कीजिए, और gates wire कीजिए - और आप ठीक-ठीक जानेंगे कि Gray code, जहाँ हर कदम पर सिर्फ़ एक bit बदलता है, mechanical और optical sensors की पसंदीदा language क्यों है।"
      ],
      transcriptEN: "Welcome to the translator booth. Imagine two digital devices that each speak a different number language - one talks plain binary, another talks Gray code, a third talks BCD or Excess-3. They all mean the same value; decimal five is five in every language. They just spell it with different bit patterns. A code converter is the translator who sits between them and re-spells the word without ever changing its meaning, exactly like turning Hello into Hola. And because it's pure gate logic with no memory and no clock, the translation is instant. In this module we build four conversions: binary to Gray and back, which are pure XOR, and BCD to Excess-3 and back, which are just adding or subtracting three. By the end you'll design any converter the disciplined way - truth table, K-map, Sum-Of-Products, gates - and you'll know why Gray code, where only one bit changes per step, is the language of mechanical and optical sensors.",
      transcriptHI: "Translator booth में आपका स्वागत है। दो digital devices सोचिए जो हर एक अलग number language बोलते हैं - एक सादा binary, दूसरा Gray code, तीसरा BCD या Excess-3। ये सब एक ही value का मतलब रखते हैं; decimal पाँच हर language में पाँच है। बस उसे अलग bit patterns से spell करते हैं। एक code converter वह translator है जो उनके बीच बैठता है और शब्द को उसका मतलब बदले बिना दोबारा spell करता है, बिलकुल Hello को Hola में बदलने जैसा। और चूँकि यह बिना memory और clock के शुद्ध gate logic है, translation तुरंत होता है। इस module में हम चार conversions बनाते हैं: binary to Gray और वापस, जो शुद्ध XOR है, और BCD to Excess-3 और वापस, जो बस तीन जोड़ना या घटाना है। अंत तक आप किसी भी converter को अनुशासित तरीक़े से design करेंगे - truth table, K-map, Sum-Of-Products, gates - और आप जानेंगे कि Gray code, जहाँ हर कदम पर सिर्फ़ एक bit बदलता है, mechanical और optical sensors की language क्यों है।",
      visualNote: "Hero: a labelled 'Code Converter' box with a teal source-code bus entering on the left (In) and an orange target-code bus leaving on the right (Out); a source device feeds it and a target device receives it."
    },
    {
      id: "S01_Video",
      label: "Code Converters - Number Languages",
      kind: "video",
      subtitle: "A short film: why one value needs many spellings, and how gates translate between them.",
      theoryEN: [
        "Here is the whole idea in one breath before you watch. Different digital systems pick different binary codes on purpose, because each code buys a specific advantage - binary is best for arithmetic, Gray code reduces mechanical reading errors, BCD drives decimal displays cleanly, and Excess-3 simplifies decimal subtraction. The catch is that two systems built around different codes cannot understand each other until something translates between them.",
        "That translator is a code converter: a purely combinational circuit, gates only, that listens to the source code word on its inputs and immediately produces the matching target code word on its outputs. It never changes the value; it only changes the encoding, so the output of device 1 lines up perfectly with the expected input of device 2.",
        "The video walks the same four conversions we build in this module. Binary to Gray drops the MSB straight through and XORs each remaining bit with its higher neighbour. Gray to Binary feeds each freshly computed binary bit forward into the next XOR - a cascading running XOR. BCD to Excess-3 simply adds three, and Excess-3 to BCD simply subtracts three.",
        "Keep one running example in your head the whole time. Binary 0110 (decimal 6) translates to Gray 0101, because the MSB stays 0, then 0^1=1, 1^1=0, 1^0=1. And BCD 0101 (decimal 5) translates to Excess-3 1000, because 5 + 3 = 8. Same values, different spellings - that is every code converter in a nutshell.",
        "Notice how the translator analogy keeps paying off. Gray code is the careful translator who changes only one letter at a time so the listener never mishears mid-word, while the +3 and -3 converters are inverse translators - chain them and the word comes back exactly as it started."
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार एक साँस में। अलग-अलग digital systems जान-बूझकर अलग binary codes चुनते हैं, क्योंकि हर code एक ख़ास फ़ायदा देता है - binary arithmetic के लिए सबसे अच्छा है, Gray code mechanical reading errors घटाता है, BCD decimal displays साफ़ चलाता है, और Excess-3 decimal subtraction आसान करता है। पेच यह है कि अलग codes पर बने दो systems एक-दूसरे को तब तक नहीं समझ सकते जब तक कोई उनके बीच translate न करे।",
        "वह translator एक code converter है: एक शुद्ध combinational circuit, सिर्फ़ gates, जो अपने inputs पर source code शब्द सुनता है और तुरंत अपने outputs पर मिलता-जुलता target code शब्द बनाता है। यह value कभी नहीं बदलता; यह सिर्फ़ encoding बदलता है, ताकि device 1 का output device 2 के अपेक्षित input से बिलकुल मिल जाए।",
        "Video उन्हीं चार conversions को दिखाता है जो हम इस module में बनाते हैं। Binary to Gray MSB को सीधे गिराता है और बाक़ी हर bit को उसके ऊँचे पड़ोसी के साथ XOR करता है। Gray to Binary हर ताज़ा बने binary bit को अगले XOR में आगे feed करता है - एक cascading running XOR। BCD to Excess-3 बस तीन जोड़ता है, और Excess-3 to BCD बस तीन घटाता है।",
        "पूरे समय एक उदाहरण मन में रखिए। Binary 0110 (decimal 6) Gray 0101 में बदलता है, क्योंकि MSB 0 रहता है, फिर 0^1=1, 1^1=0, 1^0=1। और BCD 0101 (decimal 5) Excess-3 1000 में बदलता है, क्योंकि 5 + 3 = 8। वही values, अलग spellings - संक्षेप में यही हर code converter है।",
        "ग़ौर कीजिए कि translator वाली analogy कैसे काम आती रहती है। Gray code वह सावधान translator है जो एक बार में सिर्फ़ एक अक्षर बदलता है ताकि सुनने वाला बीच-शब्द में कभी ग़लत न सुने, जबकि +3 और -3 converters inverse translators हैं - इन्हें chain कीजिए और शब्द बिलकुल वैसा ही लौट आता है जैसा शुरू हुआ था।"
      ],
      transcriptEN: "Here's the whole idea in one breath. Different digital systems pick different binary codes on purpose, because each code buys an advantage - binary for arithmetic, Gray code for mechanical reliability, BCD for decimal displays, Excess-3 for decimal subtraction. But two systems on different codes can't understand each other until something translates between them, and that translator is a code converter: pure combinational gates that read the source code word and immediately produce the matching target word, changing the encoding but never the value. We'll walk four conversions. Binary to Gray drops the MSB through and XORs each remaining bit with its higher neighbour. Gray to Binary feeds each computed binary bit forward into the next XOR. BCD to Excess-3 just adds three; Excess-3 to BCD just subtracts three. Keep one example in mind: binary 0110 is six, which becomes Gray 0101; and BCD 0101 is five, which becomes Excess-3 1000, because five plus three is eight. Same value, different spelling - that's every code converter.",
      transcriptHI: "पूरा विचार एक साँस में। अलग-अलग digital systems जान-बूझकर अलग binary codes चुनते हैं, क्योंकि हर code एक फ़ायदा देता है - binary arithmetic के लिए, Gray code mechanical भरोसे के लिए, BCD decimal displays के लिए, Excess-3 decimal subtraction के लिए। पर अलग codes पर बने दो systems एक-दूसरे को तब तक नहीं समझ सकते जब तक कोई translate न करे, और वह translator एक code converter है: शुद्ध combinational gates जो source code शब्द पढ़ते हैं और तुरंत मिलता-जुलता target शब्द बनाते हैं, encoding बदलते हैं पर value कभी नहीं। हम चार conversions चलेंगे। Binary to Gray MSB को सीधे गिराता है और बाक़ी हर bit को उसके ऊँचे पड़ोसी के साथ XOR करता है। Gray to Binary हर बने binary bit को अगले XOR में आगे feed करता है। BCD to Excess-3 बस तीन जोड़ता है; Excess-3 to BCD बस तीन घटाता है। एक उदाहरण मन में रखिए: binary 0110 छह है, जो Gray 0101 बनता है; और BCD 0101 पाँच है, जो Excess-3 1000 बनता है, क्योंकि पाँच plus तीन आठ है। वही value, अलग spelling - यही हर code converter है।",
      visualNote: "Animated explainer: a value flows left to right through a labelled converter box; the bit pattern visibly re-spells while a decimal tag stays constant, proving the value is unchanged."
    },
    {
      id: "S02_WhatIs",
      label: "What a Code Converter Is",
      kind: "theory",
      subtitle: "A combinational bridge that changes the encoding of a value, never the value itself.",
      theoryEN: [
        "Let us pin down exactly what a code converter is. It is a purely combinational circuit - gates only, no flip-flops and no clock - that takes one and the same numeric value expressed in a source code and re-expresses it in a target code. The word 'value' is the key: decimal 5 is still decimal 5 after conversion, the only thing that has changed is the pattern of bits that encodes the 5.",
        "This is precisely the act of translation. When a translator turns 'Hello' into 'Hola' the shared meaning is untouched, only the spelling differs. A code converter does the same thing with numbers, which is why we keep returning to the translator-booth picture: the converter sits between two devices and re-spells every word so each one hears its own language.",
        "Why bother having different languages at all? Because each binary code is chosen for a concrete advantage. Plain binary is efficient for arithmetic. Gray code changes only one bit between consecutive numbers, which is gentle on mechanical sensors. BCD keeps each decimal digit separate so it is easy to drive a display. Excess-3 makes decimal subtraction simpler by being self-complementing. A converter is what lets a system that prefers one of these advantages cooperate with a system that prefers another.",
        "The job of the converter, stated plainly, is to guarantee that the OUTPUT of device 1 matches the expected INPUT of device 2. Without it the two systems are incompatible; with it they interoperate as if they had spoken the same language all along - the converter never being seen, exactly like a good interpreter.",
        "In this module we detail four essential conversions that show every important technique: Binary to Gray and Gray to Binary (XOR logic) and BCD to Excess-3 and Excess-3 to BCD (arithmetic). Toggle the binary input below and watch the same value appear simultaneously in Gray and Excess-3 - one meaning, several spellings, all computed live."
      ],
      theoryHI: [
        "चलिए ठीक-ठीक तय करें कि code converter है क्या। यह एक शुद्ध combinational circuit है - सिर्फ़ gates, कोई flip-flop नहीं और कोई clock नहीं - जो एक ही numeric value को source code में लेता है और उसे target code में दोबारा व्यक्त करता है। 'value' शब्द ही चाबी है: decimal 5 conversion के बाद भी decimal 5 ही है, सिर्फ़ वह bit pattern बदला है जो 5 को encode करता है।",
        "यह ठीक translation का काम है। जब एक translator 'Hello' को 'Hola' में बदलता है तो साझा मतलब अछूता रहता है, सिर्फ़ spelling बदलती है। एक code converter संख्याओं के साथ वही करता है, इसीलिए हम translator-booth वाली तस्वीर पर बार-बार लौटते हैं: converter दो devices के बीच बैठता है और हर शब्द को दोबारा spell करता है ताकि हर एक अपनी भाषा सुने।",
        "अलग languages रखने की ज़हमत क्यों? क्योंकि हर binary code एक ठोस फ़ायदे के लिए चुना जाता है। सादा binary arithmetic के लिए कारगर है। Gray code लगातार संख्याओं के बीच सिर्फ़ एक bit बदलता है, जो mechanical sensors पर नरम है। BCD हर decimal digit को अलग रखता है ताकि display चलाना आसान हो। Excess-3 self-complementing होकर decimal subtraction आसान बनाता है। एक converter वही है जो एक फ़ायदा पसंद करने वाले system को दूसरा फ़ायदा पसंद करने वाले system के साथ काम करने देता है।",
        "converter का काम, साफ़ कहें तो, यह पक्का करना है कि device 1 का OUTPUT device 2 के अपेक्षित INPUT से मिले। इसके बिना दोनों systems असंगत हैं; इसके साथ वे ऐसे interoperate करते हैं मानो शुरू से एक ही भाषा बोलते रहे हों - converter कभी दिखता नहीं, बिलकुल एक अच्छे interpreter की तरह।",
        "इस module में हम चार ज़रूरी conversions विस्तार से देखते हैं जो हर अहम तकनीक दिखाते हैं: Binary to Gray और Gray to Binary (XOR logic) और BCD to Excess-3 और Excess-3 to BCD (arithmetic)। नीचे binary input toggle कीजिए और देखिए वही value एक साथ Gray और Excess-3 में दिखती है - एक मतलब, कई spellings, सब live गिना हुआ।"
      ],
      transcriptEN: "What exactly is a code converter? It's a purely combinational circuit - gates only, no flip-flops, no clock - that takes one numeric value in a source code and re-expresses it in a target code. The key word is value: decimal five stays five; only the bit pattern that encodes it changes. That's translation - Hello to Hola, same meaning, different spelling. Why have different languages at all? Because each code buys an advantage: binary for arithmetic, Gray for mechanical sensors, BCD for displays, Excess-3 for subtraction. The converter's job is to make the output of device one match the expected input of device two, so two otherwise incompatible systems interoperate. In this module we cover four conversions that show every technique: binary to and from Gray, which is XOR logic, and BCD to and from Excess-3, which is arithmetic. Toggle the binary input and watch the same value appear at once in Gray and Excess-3.",
      transcriptHI: "code converter आख़िर है क्या? यह एक शुद्ध combinational circuit है - सिर्फ़ gates, कोई flip-flop नहीं, कोई clock नहीं - जो एक numeric value को source code में लेता है और उसे target code में दोबारा व्यक्त करता है। चाबी वाला शब्द है value: decimal पाँच पाँच ही रहता है; सिर्फ़ उसे encode करने वाला bit pattern बदलता है। यही translation है - Hello से Hola, वही मतलब, अलग spelling। अलग languages क्यों? क्योंकि हर code एक फ़ायदा देता है: binary arithmetic के लिए, Gray mechanical sensors के लिए, BCD displays के लिए, Excess-3 subtraction के लिए। converter का काम यह है कि device एक का output device दो के अपेक्षित input से मिले, ताकि दो असंगत systems interoperate करें। इस module में हम चार conversions देखते हैं जो हर तकनीक दिखाते हैं: binary to और from Gray, जो XOR logic है, और BCD to और from Excess-3, जो arithmetic है। binary input toggle कीजिए और देखिए वही value एक साथ Gray और Excess-3 में दिखती है।",
      visualNote: "CodeConverter block: toggle the 4 binary bits; the same value shows live in Gray and Excess-3, with a BCD-validity flag."
    },
    {
      id: "S03_Method",
      label: "The General Design Method",
      kind: "theory",
      subtitle: "Truth table -> K-map per output -> minimised SOP -> gates. Every converter, same recipe.",
      theoryEN: [
        "Every code converter, no matter how exotic the code, is designed by the same disciplined recipe. The first step is always to write a TRUTH TABLE that lists every possible input code word in one set of columns and the required output code word in another. The table is the contract: it says, for each thing the source might say, exactly what the target must say.",
        "The crucial realisation is that an n-input, m-output converter is not one giant function - it is m independent Boolean functions, one per output bit, all read off the same shared truth table. Output bit y3 depends on the inputs one way, y2 another way, and so on; you treat each output column as its own little problem.",
        "For each output column you minimise its Boolean function with a Karnaugh map (K-map), grouping the 1s into the largest possible blocks to read off a Sum-Of-Products (SOP) expression - a few AND terms ORed together. When the source code has unused patterns (as BCD does, with codes 1010 through 1111), those rows become DON'T-CARE entries you are free to treat as 0 or 1, whichever makes the groups bigger and the expression smaller.",
        "Once each output has its minimised SOP, you implement it with gates - AND gates feeding an OR gate for a general SOP, or, in the lucky XOR cases like the Gray conversions, just a single XOR gate per output. The full converter is simply the collection of these little gate networks sharing the same input bits.",
        "Because every gate network is combinational, the same input pattern always yields the same output pattern after only a propagation delay - there is no stored state and no clock to wait for. Keep this recipe in mind for the rest of the module: every equation you are about to see, like g_i = b_{i+1} ^ b_i or W = A + BC + BD, is just the already-minimised SOP that fell out of this exact procedure."
      ],
      theoryHI: [
        "हर code converter, चाहे code कितना भी अनोखा हो, उसी अनुशासित recipe से design होता है। पहला कदम हमेशा एक TRUTH TABLE लिखना है जो हर संभव input code शब्द को एक columns के समूह में और ज़रूरी output code शब्द को दूसरे में सूचीबद्ध करती है। यह table एक अनुबंध है: यह कहती है कि source जो भी कहे, उसके लिए target को ठीक क्या कहना है।",
        "अहम एहसास यह है कि एक n-input, m-output converter एक विशाल function नहीं है - यह m स्वतंत्र Boolean functions है, हर output bit के लिए एक, सब उसी साझा truth table से पढ़े गए। output bit y3 inputs पर एक तरह से निर्भर है, y2 दूसरी तरह, और यों ही; आप हर output column को उसकी अपनी छोटी समस्या मानते हैं।",
        "हर output column के लिए आप उसके Boolean function को Karnaugh map (K-map) से minimise करते हैं, 1s को सबसे बड़े संभव blocks में समूहित करके एक Sum-Of-Products (SOP) expression पढ़ते हैं - कुछ AND terms जो OR से जुड़े हों। जब source code में अनुपयोगी patterns हों (जैसे BCD में codes 1010 से 1111), वे rows DON'T-CARE entries बन जाती हैं जिन्हें आप 0 या 1, जो भी groups बड़े और expression छोटा करे, मान सकते हैं।",
        "जब हर output को उसका minimised SOP मिल जाए, आप उसे gates से बनाते हैं - एक सामान्य SOP के लिए AND gates जो एक OR gate को feed करें, या, Gray conversions जैसे ख़ुशक़िस्मत XOR मामलों में, हर output के लिए बस एक अकेला XOR gate। पूरा converter बस इन छोटे gate networks का संग्रह है जो वही input bits साझा करते हैं।",
        "चूँकि हर gate network combinational है, वही input pattern हमेशा वही output pattern देता है, बस एक propagation delay के बाद - कोई stored state नहीं और इंतज़ार करने को कोई clock नहीं। बाक़ी module के लिए यह recipe मन में रखिए: हर समीकरण जो आप देखने वाले हैं, जैसे g_i = b_{i+1} ^ b_i या W = A + BC + BD, बस वही पहले से minimised SOP है जो इसी प्रक्रिया से निकला।"
      ],
      transcriptEN: "Every code converter is designed the same disciplined way. First, write a truth table listing every input code word and its required output code word. The key realisation: an n-input, m-output converter is m independent Boolean functions, one per output bit, all read from the same table. For each output column you minimise its function with a Karnaugh map, grouping the ones into the largest blocks to read off a Sum-Of-Products expression. When the source has unused patterns - like BCD's codes ten to fifteen - those rows are don't-cares you can treat as zero or one, whichever makes the groups bigger. Then implement each SOP with gates: AND feeding OR in general, or a single XOR gate per output in the lucky Gray cases. The whole converter is just these little gate networks sharing the input bits. And because it's combinational, the same input always gives the same output after a propagation delay. Every equation you'll see in this module is just the already-minimised SOP from this procedure.",
      transcriptHI: "हर code converter उसी अनुशासित तरीक़े से design होता है। पहले, एक truth table लिखिए जो हर input code शब्द और उसका ज़रूरी output code शब्द सूचीबद्ध करे। अहम एहसास: एक n-input, m-output converter m स्वतंत्र Boolean functions है, हर output bit के लिए एक, सब उसी table से पढ़े। हर output column के लिए आप उसके function को Karnaugh map से minimise करते हैं, 1s को सबसे बड़े blocks में समूहित करके Sum-Of-Products expression पढ़ते हैं। जब source में अनुपयोगी patterns हों - जैसे BCD के codes दस से पंद्रह - वे rows don't-cares हैं जिन्हें आप 0 या 1 मान सकते हैं, जो भी groups बड़े करे। फिर हर SOP को gates से बनाइए: आम तौर पर AND जो OR को feed करे, या Gray जैसे मामलों में हर output के लिए एक अकेला XOR gate। पूरा converter बस ये छोटे gate networks है जो input bits साझा करते हैं। और चूँकि यह combinational है, वही input हमेशा वही output देता है propagation delay के बाद। इस module में आप जो हर समीकरण देखेंगे वह बस इसी प्रक्रिया से निकला minimised SOP है।",
      visualNote: "Recipe rail: Truth table -> four 4-variable K-maps (one per output bit) -> minimised SOP -> gate schematic, shown as a left-to-right pipeline."
    },
    {
      id: "S04_Bin2Gray",
      label: "Binary to Gray - The Forward XOR Cascade",
      kind: "theory",
      subtitle: "MSB passes straight through; every other Gray bit is the XOR of two adjacent binary bits.",
      theoryEN: [
        "Gray code is an unweighted code whose entire purpose is that only ONE bit changes between consecutive numbers. To translate plain binary into Gray we use a remarkably clean two-rule recipe that needs nothing but XOR gates - no AND, no OR, no carry.",
        "Rule 1 is for the Most Significant Bit: it passes straight through unchanged. The top binary bit simply becomes the top Gray bit, g_{n-1} = b_{n-1}. In hardware this is not even a gate, it is a bare wire dropping straight down from input to output.",
        "Rule 2 is for every other bit: each lower Gray bit is the XOR of two ADJACENT binary bits, g_i = b_{i+1} ^ b_i. This is bitwise, not arithmetic - there are no carries to propagate, so every output is independent and the whole thing settles in a single gate delay. For a 4-bit converter that is exactly three two-input XOR gates (one per non-MSB output), with the MSB as a plain wire, so the gate count is n - 1.",
        "Work the running example by hand to feel it. Binary 0110 (decimal 6) has b3 b2 b1 b0 = 0,1,1,0. Then g3 = b3 = 0; g2 = b3 ^ b2 = 0 ^ 1 = 1; g1 = b2 ^ b1 = 1 ^ 1 = 0; g0 = b1 ^ b0 = 1 ^ 0 = 1. The Gray word is 0101, and you can check that adjacent Gray numbers really do differ in only one bit.",
        "In the translator-booth picture this is the outbound translation: the source speaks binary, and three little XOR gates - the grammar rules the translator applies in their head - instantly re-spell the same value as Gray. Watch the live XOR gates below compute each adjacent-pair XOR, and toggle the binary input to see the Gray word reform."
      ],
      theoryHI: [
        "Gray code एक unweighted code है जिसका पूरा मक़सद यह है कि लगातार संख्याओं के बीच सिर्फ़ एक bit बदले। सादे binary को Gray में translate करने के लिए हम एक बेहद साफ़ दो-नियम recipe वापरते हैं जिसे XOR gates के सिवा कुछ नहीं चाहिए - कोई AND नहीं, कोई OR नहीं, कोई carry नहीं।",
        "नियम 1 Most Significant Bit के लिए है: यह बिना बदले सीधे गुज़र जाता है। ऊपर वाला binary bit बस ऊपर वाला Gray bit बन जाता है, g_{n-1} = b_{n-1}। hardware में यह gate भी नहीं है, यह एक नंगा wire है जो input से output तक सीधे नीचे गिरता है।",
        "नियम 2 बाक़ी हर bit के लिए है: हर निचला Gray bit दो ADJACENT binary bits का XOR है, g_i = b_{i+1} ^ b_i। यह bitwise है, arithmetic नहीं - propagate करने को कोई carries नहीं, तो हर output स्वतंत्र है और पूरी चीज़ एक gate delay में settle हो जाती है। एक 4-bit converter के लिए यह ठीक तीन two-input XOR gates है (हर non-MSB output के लिए एक), MSB एक सादा wire के रूप में, तो gate गिनती n - 1 है।",
        "इसे महसूस करने के लिए running उदाहरण हाथ से कीजिए। Binary 0110 (decimal 6) में b3 b2 b1 b0 = 0,1,1,0 है। तब g3 = b3 = 0; g2 = b3 ^ b2 = 0 ^ 1 = 1; g1 = b2 ^ b1 = 1 ^ 1 = 0; g0 = b1 ^ b0 = 1 ^ 0 = 1। Gray शब्द 0101 है, और आप जाँच सकते हैं कि सटे Gray संख्याएँ सचमुच सिर्फ़ एक bit में भिन्न हैं।",
        "translator-booth वाली तस्वीर में यह बाहर जाता translation है: source binary बोलता है, और तीन छोटे XOR gates - वे grammar के नियम जो translator अपने दिमाग़ में लगाता है - तुरंत उसी value को Gray के रूप में दोबारा spell करते हैं। नीचे live XOR gates को हर adjacent-pair XOR गिनते देखिए, और binary input toggle करके Gray शब्द को फिर से बनते देखिए।"
      ],
      transcriptEN: "Gray code's whole purpose is that only one bit changes between consecutive numbers. To translate binary into Gray we use two rules and nothing but XOR gates. Rule one: the most significant bit passes straight through, g of n minus one equals b of n minus one - in hardware that's a bare wire, not even a gate. Rule two: every other Gray bit is the XOR of two adjacent binary bits, g sub i equals b sub i plus one XOR b sub i. It's bitwise, no carries, so every output is independent and settles in one gate delay. For four bits that's exactly three two-input XOR gates plus the MSB wire, so the gate count is n minus one. Work the example: binary 0110 is six. g3 is b3 is zero; g2 is zero XOR one is one; g1 is one XOR one is zero; g0 is one XOR zero is one. Gray is 0101. In the booth picture this is the outbound translation - three little XOR gates re-spell the same value as Gray instantly.",
      transcriptHI: "Gray code का पूरा मक़सद यह है कि लगातार संख्याओं के बीच सिर्फ़ एक bit बदले। binary को Gray में translate करने के लिए हम दो नियम और XOR gates के सिवा कुछ नहीं वापरते। नियम एक: most significant bit सीधे गुज़र जाता है, g of n minus one बराबर b of n minus one - hardware में यह एक नंगा wire है, gate भी नहीं। नियम दो: बाक़ी हर Gray bit दो adjacent binary bits का XOR है, g sub i बराबर b sub i plus one XOR b sub i। यह bitwise है, कोई carries नहीं, तो हर output स्वतंत्र है और एक gate delay में settle होता है। चार bits के लिए यह ठीक तीन two-input XOR gates जमा MSB wire है, तो gate गिनती n minus one है। उदाहरण कीजिए: binary 0110 छह है। g3, b3, शून्य है; g2, शून्य XOR एक, एक है; g1, एक XOR एक, शून्य है; g0, एक XOR शून्य, एक है। Gray 0101 है। booth वाली तस्वीर में यह बाहर जाता translation है - तीन छोटे XOR gates तुरंत उसी value को Gray के रूप में दोबारा spell करते हैं।",
      visualNote: "Forward cascade: 4 binary inputs; MSB wire straight across; three live XOR gates each fed by an adjacent pair, producing g2,g1,g0. The CodeConverter block shows 0110 -> 0101."
    },
    {
      id: "S05_Gray2Bin",
      label: "Gray to Binary - The Running XOR",
      kind: "theory",
      subtitle: "The MSB carries down; each new binary bit XORs the just-computed bit above it with the next Gray bit.",
      theoryEN: [
        "To recover the original data from a Gray-coded reading we decode Gray back into standard binary, which simply reverses the forward cascade. Again there are exactly two rules and again it is pure XOR, but the wiring is subtly different and worth seeing clearly.",
        "Rule 1 is the same comforting start: the MSB carries straight down unchanged, b_{n-1} = g_{n-1}. The top Gray bit becomes the top binary bit through a bare wire, seeding everything that follows.",
        "Rule 2 is the twist: each new binary bit is the XOR of the JUST-COMPUTED higher binary bit with the next Gray bit, b_i = b_{i+1} ^ g_i. Notice that it uses b_{i+1}, an output we just made, not g_{i+1}, an input. That makes it a running (cascading) XOR - a diagonal feedback path where each stage feeds the next - rather than the independent adjacent pairs of the forward direction. It is still combinational; there is no clock, just a chain of XOR delays settling from the MSB down to the LSB.",
        "There is also a tidy closed form worth knowing: unrolling the recursion gives b_i = g_{n-1} ^ g_{n-2} ^ ... ^ g_i, the cumulative XOR of all Gray bits from the MSB down to position i. So each binary bit is just the running parity of the Gray bits above and including it.",
        "Run the worked example. Gray 1110 has g3 g2 g1 g0 = 1,1,1,0. Then b3 = g3 = 1; b2 = b3 ^ g2 = 1 ^ 1 = 0; b1 = b2 ^ g1 = 0 ^ 1 = 1; b0 = b1 ^ g0 = 1 ^ 0 = 1. Binary is 1011. In the booth this is the return translation, the careful interpreter undoing the outbound step so the original word comes back exactly - which is why the forward and reverse converters are perfect inverses of each other."
      ],
      theoryHI: [
        "किसी Gray-coded reading से असली data वापस पाने के लिए हम Gray को standard binary में decode करते हैं, जो बस forward cascade को उलट देता है। फिर ठीक दो नियम हैं और फिर यह शुद्ध XOR है, पर wiring थोड़ी अलग है और इसे साफ़ देखना ज़रूरी है।",
        "नियम 1 वही सुकून भरी शुरुआत है: MSB बिना बदले सीधे नीचे आता है, b_{n-1} = g_{n-1}। ऊपर वाला Gray bit एक नंगे wire से ऊपर वाला binary bit बन जाता है, जो आगे सब कुछ का बीज बोता है।",
        "नियम 2 पेच है: हर नया binary bit JUST-COMPUTED ऊँचे binary bit का अगले Gray bit के साथ XOR है, b_i = b_{i+1} ^ g_i। ग़ौर कीजिए यह b_{i+1} वापरता है, एक output जो हमने अभी बनाया, न कि g_{i+1}, एक input। यह इसे एक running (cascading) XOR बनाता है - एक diagonal feedback path जहाँ हर चरण अगले को feed करता है - न कि forward दिशा के स्वतंत्र adjacent pairs। यह अब भी combinational है; कोई clock नहीं, बस XOR delays की एक chain जो MSB से LSB तक settle होती है।",
        "एक सुथरा closed form भी जानने लायक़ है: recursion खोलने पर मिलता है b_i = g_{n-1} ^ g_{n-2} ^ ... ^ g_i, MSB से position i तक सभी Gray bits का cumulative XOR। तो हर binary bit बस उसके ऊपर वाले और ख़ुद उस Gray bit की running parity है।",
        "worked उदाहरण चलाइए। Gray 1110 में g3 g2 g1 g0 = 1,1,1,0 है। तब b3 = g3 = 1; b2 = b3 ^ g2 = 1 ^ 1 = 0; b1 = b2 ^ g1 = 0 ^ 1 = 1; b0 = b1 ^ g0 = 1 ^ 0 = 1। Binary 1011 है। booth में यह वापसी translation है, सावधान interpreter बाहर जाते कदम को उलटता है ताकि असली शब्द बिलकुल वैसा लौटे - इसीलिए forward और reverse converters एक-दूसरे के सटीक inverse हैं।"
      ],
      transcriptEN: "To recover the original data we decode Gray back into binary, reversing the forward cascade. Two rules again, pure XOR again, but the wiring differs. Rule one: the MSB carries straight down, b of n minus one equals g of n minus one - a bare wire that seeds everything. Rule two, the twist: each new binary bit is the XOR of the just-computed higher binary bit with the next Gray bit, b sub i equals b sub i plus one XOR g sub i. Notice it uses b i plus one, an output we just made, not an input - that's a running, cascading XOR, a diagonal feedback chain, settling from MSB down to LSB, still combinational. There's a closed form too: b sub i equals the XOR of all Gray bits from the MSB down to position i, the cumulative parity. Example: Gray 1110. b3 is g3 is one; b2 is one XOR one is zero; b1 is zero XOR one is one; b0 is one XOR zero is one. Binary is 1011. This is the return translation, undoing the outbound step exactly - the forward and reverse converters are perfect inverses.",
      transcriptHI: "असली data वापस पाने के लिए हम Gray को binary में decode करते हैं, forward cascade को उलटते हुए। फिर दो नियम, फिर शुद्ध XOR, पर wiring अलग है। नियम एक: MSB सीधे नीचे आता है, b of n minus one बराबर g of n minus one - एक नंगा wire जो सब कुछ का बीज बोता है। नियम दो, पेच: हर नया binary bit just-computed ऊँचे binary bit का अगले Gray bit के साथ XOR है, b sub i बराबर b sub i plus one XOR g sub i। ग़ौर कीजिए यह b i plus one वापरता है, एक output जो हमने अभी बनाया, input नहीं - यह एक running, cascading XOR है, एक diagonal feedback chain, MSB से LSB तक settle होती, अब भी combinational। एक closed form भी है: b sub i बराबर MSB से position i तक सभी Gray bits का XOR, cumulative parity। उदाहरण: Gray 1110। b3, g3, एक है; b2, एक XOR एक, शून्य; b1, शून्य XOR एक, एक; b0, एक XOR शून्य, एक। Binary 1011 है। यह वापसी translation है, बाहर जाते कदम को बिलकुल उलटता - forward और reverse converters सटीक inverse हैं।",
      visualNote: "Reverse cascade with diagonal feedback: MSB Gray wire straight across; each XOR takes the previously generated binary bit (fed back diagonally) and the next Gray bit. Step-through walks 1110 -> 1011."
    },
    {
      id: "S06_WhyGray",
      label: "Why Gray Code - Glitch-Free Steps",
      kind: "theory",
      subtitle: "Plain binary can flip every bit at once; Gray flips exactly one, so a sensor never reads a phantom value.",
      theoryEN: [
        "Now the payoff: why does Gray code exist at all? The answer is about what happens during a transition. In plain binary, counting from 3 to 4 flips every single bit at once: 011 becomes 100. If those bits do not change at exactly the same instant - and in real hardware they never quite do - then for a fleeting moment the wires might read 111 or 000 or any other in-between pattern. A sensor sampling at that instant reads a wildly wrong value. That momentary lie is called a glitch.",
        "Gray code is built so that exactly ONE bit changes at every step. Counting in Gray goes 000, 001, 011, 010, 110, and so on, and at each step you can point to the single bit that flipped. Because only one wire is ever in motion, there is no ambiguous in-between pattern at all: a reading is always either the clean old value or the clean new value, never a phantom.",
        "This is precisely why Gray code is the language of rotary and optical shaft encoders, mechanical position sensors, and any system where a transition must be read reliably. As the shaft turns past a boundary, the worst that can happen is the reading lags by one count - it can never jump to a nonsense position the way multi-bit binary can.",
        "In the translator-booth analogy, Gray is the careful translator who changes only one letter at a time, so the listener never mishears a half-formed word mid-change. It also means fewer simultaneous switching events, which lowers switching noise and error in positional sensors.",
        "One caveat to remember: Gray code is unweighted, meaning a bit's position carries no fixed numeric weight the way the 8-4-2-1 of binary does. You cannot do arithmetic directly on Gray - you must convert back to binary first - which is exactly why the Gray-to-Binary converter from the last page matters. Toggle the binary input below and watch the Gray row: you will see only a single Gray bit move for each step of the count."
      ],
      theoryHI: [
        "अब फ़ायदा: Gray code आख़िर मौजूद ही क्यों है? जवाब इस बारे में है कि transition के दौरान क्या होता है। सादे binary में, 3 से 4 गिनना एक साथ हर एक bit पलट देता है: 011, 100 बन जाता है। अगर वे bits ठीक एक ही पल में न बदलें - और असली hardware में वे कभी पूरी तरह नहीं बदलते - तो एक झलक भर के लिए wires शायद 111 या 000 या कोई और बीच का pattern पढ़ें। उस पल sample लेता sensor एक बेहद ग़लत value पढ़ता है। उस पल भर के झूठ को glitch कहते हैं।",
        "Gray code ऐसे बना है कि हर कदम पर ठीक एक bit बदले। Gray में गिनना जाता है 000, 001, 011, 010, 110, वग़ैरह, और हर कदम पर आप उस अकेले bit की ओर इशारा कर सकते हैं जो पलटा। चूँकि कभी सिर्फ़ एक wire गति में होता है, कोई अस्पष्ट बीच का pattern है ही नहीं: एक reading हमेशा या तो साफ़ पुरानी value या साफ़ नई value होती है, कभी कोई phantom नहीं।",
        "ठीक इसीलिए Gray code rotary और optical shaft encoders, mechanical position sensors, और किसी भी ऐसे system की language है जहाँ transition को भरोसे से पढ़ना ज़रूरी हो। जैसे shaft किसी सीमा के पार घूमता है, सबसे बुरा यह हो सकता है कि reading एक count पीछे रह जाए - यह कभी multi-bit binary की तरह किसी बेतुकी position पर नहीं कूद सकता।",
        "translator-booth analogy में, Gray वह सावधान translator है जो एक बार में सिर्फ़ एक अक्षर बदलता है, ताकि सुनने वाला बदलाव के बीच कोई आधा-बना शब्द कभी ग़लत न सुने। इसका मतलब कम एक-साथ switching events भी है, जो positional sensors में switching noise और error घटाता है।",
        "एक बात याद रखिए: Gray code unweighted है, यानी एक bit की position कोई तय numeric weight नहीं रखती जैसे binary का 8-4-2-1 रखता है। आप Gray पर सीधे arithmetic नहीं कर सकते - पहले binary में वापस convert करना ज़रूरी है - ठीक इसीलिए पिछले page का Gray-to-Binary converter मायने रखता है। नीचे binary input toggle कीजिए और Gray row देखिए: आप count के हर कदम पर सिर्फ़ एक Gray bit हिलता देखेंगे।"
      ],
      transcriptEN: "Why does Gray code exist? It's about transitions. In plain binary, counting three to four flips every bit at once - 011 becomes 100. If those bits don't change at exactly the same instant, and in real hardware they never do, then for a moment the wires might read 111 or 000 or some other in-between pattern, and a sensor sampling then reads a wildly wrong value. That's a glitch. Gray code is built so exactly one bit changes per step: 000, 001, 011, 010, 110, and so on. Only one wire is ever moving, so there's no ambiguous pattern - a reading is always the clean old value or the clean new value. That's why Gray is the language of rotary and optical encoders and mechanical position sensors: the worst case is lagging by one count, never jumping to nonsense. It's the careful translator who changes one letter at a time. One caveat: Gray is unweighted, so you can't do arithmetic on it directly - convert back to binary first, which is exactly why the Gray-to-Binary converter matters.",
      transcriptHI: "Gray code क्यों मौजूद है? यह transitions के बारे में है। सादे binary में, तीन से चार गिनना एक साथ हर bit पलटता है - 011, 100 बनता है। अगर वे bits ठीक एक ही पल में न बदलें, और असली hardware में कभी नहीं बदलते, तो एक पल wires शायद 111 या 000 या कोई और बीच का pattern पढ़ें, और तब sample लेता sensor एक बेहद ग़लत value पढ़ता है। यह glitch है। Gray code ऐसे बना है कि हर कदम पर ठीक एक bit बदले: 000, 001, 011, 010, 110, वग़ैरह। कभी सिर्फ़ एक wire हिलता है, तो कोई अस्पष्ट pattern नहीं - एक reading हमेशा साफ़ पुरानी या साफ़ नई value होती है। इसीलिए Gray rotary और optical encoders तथा mechanical position sensors की language है: सबसे बुरा हाल एक count पीछे रहना है, कभी बेतुकेपन पर कूदना नहीं। यह वह सावधान translator है जो एक बार में एक अक्षर बदलता है। एक बात: Gray unweighted है, तो आप उस पर सीधे arithmetic नहीं कर सकते - पहले binary में वापस convert कीजिए, ठीक इसीलिए Gray-to-Binary converter मायने रखता है।",
      visualNote: "Side-by-side counting table: binary 000..111 flagging multi-bit jumps in red; Gray 000,001,011,010,110,... with the single changing bit highlighted green at each step."
    },
    {
      id: "S07_BcdXs3",
      label: "BCD and Excess-3 - Decimal-Friendly Codes",
      kind: "theory",
      subtitle: "Two ways to spell a decimal digit: weighted 8-4-2-1, and the self-complementing digit-plus-3.",
      theoryEN: [
        "We now switch from the XOR world to the decimal world with two codes built for handling human digits. BCD, short for binary-coded decimal and also called 8421, encodes each decimal digit 0 through 9 in its own 4-bit group using the ordinary binary weights 8, 4, 2, 1. So 0 is 0000, 5 is 0101, 9 is 1001, and the six patterns 1010 through 1111 are invalid - they are not used because a decimal digit never exceeds 9.",
        "Excess-3, often written XS-3, encodes the same digit as its BCD value plus 3 - that is, the binary of (digit + 3). Digit 0 becomes 0011 (which is 0 + 3), digit 5 becomes 1000 (5 + 3 = 8), and digit 9 becomes 1100 (9 + 3 = 12). Every Excess-3 code word is simply the digit shifted up by three.",
        "Excess-3 has a beautiful property that BCD lacks: it is UNWEIGHTED and SELF-COMPLEMENTING. Self-complementing means that to find the 9's complement of a digit - the value you need for decimal subtraction - you just invert all four bits. For example digit 2 is 0101 in XS-3; invert to get 1010, which is XS-3 for 7, and indeed 9 - 2 = 7. That single bitwise NOT replaces a whole subtraction, which dramatically simplifies decimal subtraction hardware.",
        "Excess-3 also guarantees that a valid digit never has an all-zero code - the lowest is 0011 for digit 0 - which is handy for detecting a dead or blank line: all zeros can be read as 'no signal' rather than a legitimate digit. BCD has no such guarantee, since its digit 0 is 0000.",
        "Both codes represent the very same decimal value; choosing between them is a trade-off. BCD gives you direct binary weights, easy to read and to drive a seven-segment display. Excess-3 gives you self-complementing arithmetic. A converter between them is exactly the translator who knows both decimal dialects. Toggle the binary input below: when it is 0 to 9 you will see a valid BCD digit, and the Excess-3 row shows the same value shifted up by 3."
      ],
      theoryHI: [
        "अब हम XOR दुनिया से decimal दुनिया में जाते हैं, दो codes के साथ जो इंसानी digits सँभालने के लिए बने हैं। BCD, यानी binary-coded decimal और जिसे 8421 भी कहते हैं, हर decimal digit 0 से 9 को उसके अपने 4-bit समूह में सामान्य binary weights 8, 4, 2, 1 से encode करता है। तो 0 है 0000, 5 है 0101, 9 है 1001, और छह patterns 1010 से 1111 अमान्य हैं - ये वापरे नहीं जाते क्योंकि एक decimal digit कभी 9 से ज़्यादा नहीं होता।",
        "Excess-3, जिसे अक्सर XS-3 लिखते हैं, उसी digit को उसकी BCD value जमा 3 के रूप में encode करता है - यानी (digit + 3) का binary। digit 0 बनता है 0011 (जो 0 + 3 है), digit 5 बनता है 1000 (5 + 3 = 8), और digit 9 बनता है 1100 (9 + 3 = 12)। हर Excess-3 code शब्द बस digit को तीन से ऊपर खिसकाया हुआ है।",
        "Excess-3 में एक सुंदर गुण है जो BCD में नहीं: यह UNWEIGHTED और SELF-COMPLEMENTING है। Self-complementing का मतलब है कि किसी digit का 9's complement पाने के लिए - वह value जो decimal subtraction के लिए चाहिए - आप बस चारों bits invert कर देते हैं। मसलन digit 2 XS-3 में 0101 है; invert करने पर मिलता है 1010, जो 7 का XS-3 है, और सचमुच 9 - 2 = 7। वह एक bitwise NOT पूरी subtraction की जगह ले लेता है, जो decimal subtraction hardware को नाटकीय रूप से आसान करता है।",
        "Excess-3 यह भी पक्का करता है कि किसी मान्य digit का code कभी पूरा-शून्य न हो - सबसे नीचा digit 0 के लिए 0011 है - जो किसी dead या blank line पहचानने में काम आता है: सब शून्य को एक मान्य digit के बजाय 'कोई signal नहीं' पढ़ा जा सकता है। BCD में ऐसी कोई गारंटी नहीं, क्योंकि उसका digit 0 0000 है।",
        "दोनों codes बिलकुल वही decimal value दर्शाते हैं; इनके बीच चुनाव एक trade-off है। BCD आपको सीधे binary weights देता है, पढ़ने और seven-segment display चलाने में आसान। Excess-3 आपको self-complementing arithmetic देता है। इनके बीच एक converter ठीक वह translator है जो दोनों decimal बोलियाँ जानता है। नीचे binary input toggle कीजिए: जब यह 0 से 9 हो आप एक मान्य BCD digit देखेंगे, और Excess-3 row वही value तीन से ऊपर खिसकाई दिखाती है।"
      ],
      transcriptEN: "Now we switch from the XOR world to the decimal world with two codes built for human digits. BCD, binary-coded decimal or 8421, encodes each decimal digit zero through nine in its own four-bit group with weights eight four two one - so zero is 0000, five is 0101, nine is 1001, and the six patterns ten to fifteen are invalid. Excess-3 encodes the same digit as its value plus three: zero becomes 0011, five becomes 1000, nine becomes 1100. Excess-3 has a beautiful property BCD lacks: it's self-complementing, meaning the nine's complement of a digit, needed for decimal subtraction, is just inverting all four bits. Digit two is 0101; invert to 1010, which is seven, and nine minus two is seven. That single NOT replaces a subtraction. Excess-3 also never has an all-zero valid digit, handy for detecting dead lines. Both codes mean the same decimal value - BCD gives direct weights for displays, Excess-3 gives self-complementing arithmetic.",
      transcriptHI: "अब हम XOR दुनिया से decimal दुनिया में जाते हैं, दो codes के साथ जो इंसानी digits के लिए बने हैं। BCD, binary-coded decimal या 8421, हर decimal digit शून्य से नौ को उसके अपने four-bit समूह में weights आठ चार दो एक से encode करता है - तो शून्य 0000 है, पाँच 0101, नौ 1001, और छह patterns दस से पंद्रह अमान्य हैं। Excess-3 उसी digit को उसकी value जमा तीन के रूप में encode करता है: शून्य 0011 बनता है, पाँच 1000, नौ 1100। Excess-3 में एक सुंदर गुण है जो BCD में नहीं: यह self-complementing है, यानी किसी digit का nine's complement, जो decimal subtraction के लिए चाहिए, बस चारों bits invert करना है। digit दो 0101 है; 1010 में invert कीजिए, जो सात है, और नौ minus दो सात है। वह एक NOT एक subtraction की जगह लेता है। Excess-3 में किसी मान्य digit का code कभी पूरा-शून्य नहीं होता, dead lines पहचानने में काम का। दोनों codes वही decimal value रखते हैं - BCD displays के लिए सीधे weights देता है, Excess-3 self-complementing arithmetic।",
      visualNote: "Mapping table: Decimal | BCD(8421) | Excess-3, rows 0..9, each XS-3 row equal to the BCD row plus 0011; invalid BCD codes 1010-1111 greyed out. The CodeConverter block shows the live value."
    },
    {
      id: "S08_Matrix",
      label: "BCD <-> Excess-3 & The Master Matrix",
      kind: "theory",
      subtitle: "Out is +3 with an adder, back is -3 with a subtractor; then the whole four-conversion matrix in one view.",
      theoryEN: [
        "The BCD-to-Excess-3 conversion is the simplest rule in the module: take the 4-bit BCD input and ADD binary 0011 (decimal 3) using ordinary binary addition, and the result is the Excess-3 word. The carries propagate exactly as in any 4-bit add. For example BCD 0101 (decimal 5) plus 0011 gives Excess-3 1000, the code for 5 + 3 = 8. You can build it literally as a 4-bit adder with one operand fixed to 0011, or hand-minimise it per output bit; the standard K-map result is W = A + BC + BD, X = B'C + B'D + BC'D', Y = CD + C'D', Z = D', where the unused BCD codes 1010 to 1111 are exploited as don't-cares.",
        "The Excess-3-to-BCD conversion is the exact reverse: once arithmetic is done and you need plain BCD for a display, take the 4-bit Excess-3 input and SUBTRACT binary 0011 (decimal 3), which safely removes the constant offset. Excess-3 1000 minus 0011 gives BCD 0101, the digit 5 again. You build it as a 4-bit subtractor with the constant 0011, or as the mirror-image SOP network of the +3 converter.",
        "These two are inverse translators in the purest sense: chain a +3 converter into a -3 converter and the word comes back exactly as it started, because adding three and then subtracting three is a no-op. That round-trip identity is the same one you saw with Binary->Gray->Binary, and it is the deep reason every forward converter on this track has a clean reverse.",
        "Step back and the whole module fits into one master translation matrix. Binary<->Gray are XOR-logic conversions: the forward cascade going out and the feedback running-XOR coming back, with no carries, which makes them extremely fast. BCD<->Excess-3 are arithmetic conversions: +3 going out and -3 coming back, which do involve carry or borrow propagation and so are a touch slower.",
        "Each conversion has exactly one primary rule to memorise - G(i) = B(i) ^ B(i+1); B(i) = B(i+1) ^ G(i); XS3 = BCD + 0011; BCD = XS3 - 0011 - and remember that all four were designed by the very same truth-table -> K-map -> SOP recipe; the equations are just the already-minimised results. Their key applications round out the picture: Gray for positional and optical sensors, Excess-3 for self-complementing decimal arithmetic, and BCD for human-readable decimal display. The step-by-step proofs below derive each equation in full."
      ],
      theoryHI: [
        "BCD-to-Excess-3 conversion module का सबसे आसान नियम है: 4-bit BCD input लीजिए और सामान्य binary addition से binary 0011 (decimal 3) जोड़िए, और नतीजा Excess-3 शब्द है। carries ठीक किसी भी 4-bit add की तरह propagate होते हैं। मसलन BCD 0101 (decimal 5) जमा 0011 देता है Excess-3 1000, जो 5 + 3 = 8 का code है। आप इसे सचमुच एक 4-bit adder के रूप में बना सकते हैं जिसका एक operand 0011 पर तय हो, या हर output bit के लिए हाथ से minimise कर सकते हैं; मानक K-map नतीजा है W = A + BC + BD, X = B'C + B'D + BC'D', Y = CD + C'D', Z = D', जहाँ अनुपयोगी BCD codes 1010 से 1111 don't-cares के रूप में वापरे जाते हैं।",
        "Excess-3-to-BCD conversion ठीक उल्टा है: जब arithmetic हो जाए और display के लिए सादा BCD चाहिए, 4-bit Excess-3 input लीजिए और binary 0011 (decimal 3) घटाइए, जो उस तय offset को सुरक्षित हटा देता है। Excess-3 1000 minus 0011 देता है BCD 0101, फिर वही digit 5। आप इसे एक 4-bit subtractor के रूप में बनाते हैं जिसका स्थिरांक 0011 हो, या +3 converter के दर्पण-प्रतिबिंब SOP network के रूप में।",
        "ये दोनों सबसे शुद्ध अर्थ में inverse translators हैं: एक +3 converter को एक -3 converter में chain कीजिए और शब्द बिलकुल वैसा लौट आता है जैसा शुरू हुआ, क्योंकि तीन जोड़कर फिर तीन घटाना एक no-op है। वह round-trip पहचान वही है जो आपने Binary->Gray->Binary में देखी, और यही गहरी वजह है कि इस track का हर forward converter एक साफ़ reverse रखता है।",
        "पीछे हटिए और पूरा module एक master translation matrix में बैठ जाता है। Binary<->Gray XOR-logic conversions हैं: जाते समय forward cascade और लौटते समय feedback running-XOR, बिना carries, जो उन्हें बेहद तेज़ बनाता है। BCD<->Excess-3 arithmetic conversions हैं: जाते समय +3 और लौटते समय -3, जिनमें carry या borrow propagation शामिल है और इसलिए ज़रा धीमे हैं।",
        "हर conversion का ठीक एक प्राथमिक नियम याद रखना है - G(i) = B(i) ^ B(i+1); B(i) = B(i+1) ^ G(i); XS3 = BCD + 0011; BCD = XS3 - 0011 - और याद रखिए चारों उसी truth-table -> K-map -> SOP recipe से design हुए; समीकरण बस पहले से minimised नतीजे हैं। इनके अहम applications तस्वीर पूरी करते हैं: Gray positional और optical sensors के लिए, Excess-3 self-complementing decimal arithmetic के लिए, और BCD इंसानी-पठनीय decimal display के लिए। नीचे step-by-step proofs हर समीकरण को पूरा derive करते हैं।"
      ],
      transcriptEN: "BCD-to-Excess-3 is the simplest rule: take the four-bit BCD input and add binary 0011, decimal three, by ordinary binary addition - that's the Excess-3 word. BCD 0101, which is five, plus 0011 gives Excess-3 1000, the code for eight. Build it as a four-bit adder with one operand fixed to 0011, or hand-minimise per bit: W equals A plus BC plus BD, X equals B-prime-C plus B-prime-D plus B-C-prime-D-prime, Y equals CD plus C-prime-D-prime, Z equals D-prime, using the unused BCD codes as don't-cares. Excess-3-to-BCD is the exact reverse: subtract 0011 to remove the offset. These two are inverse translators - chain plus-three into minus-three and the word returns unchanged, just like Binary to Gray to Binary. Step back and the whole module is one matrix: Binary and Gray are XOR conversions, no carries, very fast; BCD and Excess-3 are arithmetic, plus-three and minus-three with carry propagation. Each has one rule, all four designed by the same truth-table, K-map, SOP recipe.",
      transcriptHI: "BCD-to-Excess-3 सबसे आसान नियम है: four-bit BCD input लीजिए और सामान्य binary addition से binary 0011, decimal तीन, जोड़िए - वही Excess-3 शब्द है। BCD 0101, जो पाँच है, जमा 0011 देता है Excess-3 1000, आठ का code। इसे एक four-bit adder के रूप में बनाइए जिसका एक operand 0011 पर तय हो, या हर bit के लिए हाथ से minimise कीजिए: W बराबर A plus BC plus BD, X बराबर B-prime-C plus B-prime-D plus B-C-prime-D-prime, Y बराबर CD plus C-prime-D-prime, Z बराबर D-prime, अनुपयोगी BCD codes को don't-cares मानते हुए। Excess-3-to-BCD ठीक उल्टा है: offset हटाने को 0011 घटाइए। ये दोनों inverse translators हैं - plus-three को minus-three में chain कीजिए और शब्द बिना बदले लौटता है, बिलकुल Binary to Gray to Binary की तरह। पीछे हटिए और पूरा module एक matrix है: Binary और Gray XOR conversions हैं, कोई carries नहीं, बहुत तेज़; BCD और Excess-3 arithmetic हैं, plus-three और minus-three, carry propagation के साथ। हर एक का एक नियम, चारों उसी truth-table, K-map, SOP recipe से design।",
      visualNote: "Two blocks: Adder (+3) BCD->XS3 and Subtractor (-3) XS3->BCD with worked column arithmetic; then a 4-row master matrix: Conversion | Operation Type | Primary Logic Rule | Key Application. A StepThrough derives all equations."
    },
    {
      id: "S09_Build",
      label: "Build the Converters For Real",
      kind: "build",
      subtitle: "Open the live workbench and wire the Binary-to-Gray XOR cascade yourself.",
      theoryEN: [
        "You have seen every converter computed live and derived from first principles; now wire one up on real hardware. The build launches the live CircuitVerse workbench with a guided rail for the Binary-to-Gray converter, the cleanest possible starting point because it is pure XOR with no carries to worry about.",
        "On the bench you will place four binary input switches, drop the MSB straight through to the top Gray output as a bare wire, and add three two-input XOR gates - one for g2 = b3 ^ b2, one for g1 = b2 ^ b1, and one for g0 = b1 ^ b0. That is the whole circuit: three gates and a wire, exactly the n - 1 gate count we proved.",
        "Once it is wired, test it against the truth table you now know cold. Feed in 0110 and confirm the output is 0101; step the input up one count at a time and watch the Gray output change exactly one bit per step, the glitch-free property made real on hardware you built. When the forward converter works, try wiring its inverse - the running-XOR Gray-to-Binary chain - and prove the round-trip returns your original word. That moment, when the value comes back unchanged, is the translator booth working end to end."
      ],
      theoryHI: [
        "आपने हर converter को live गिनते और मूल सिद्धांतों से derive होते देखा; अब एक को असली hardware पर wire कीजिए। यह build live CircuitVerse workbench को Binary-to-Gray converter के एक guided rail के साथ खोलता है, सबसे साफ़ शुरुआती बिंदु क्योंकि यह शुद्ध XOR है, चिंता करने को कोई carries नहीं।",
        "bench पर आप चार binary input switches रखेंगे, MSB को सीधे ऊपर वाले Gray output तक एक नंगे wire के रूप में गिराएँगे, और तीन two-input XOR gates जोड़ेंगे - एक g2 = b3 ^ b2 के लिए, एक g1 = b2 ^ b1 के लिए, और एक g0 = b1 ^ b0 के लिए। यही पूरी circuit है: तीन gates और एक wire, ठीक वही n - 1 gate गिनती जो हमने साबित की।",
        "जब यह wire हो जाए, इसे उस truth table के सामने जाँचिए जो अब आपको रट्टे याद है। 0110 feed कीजिए और पुष्टि कीजिए कि output 0101 है; input को एक-एक count बढ़ाइए और देखिए Gray output हर कदम पर ठीक एक bit बदलता है, glitch-free गुण आपके बनाए hardware पर हक़ीक़त बना। जब forward converter चले, इसका inverse wire करने की कोशिश कीजिए - running-XOR Gray-to-Binary chain - और साबित कीजिए कि round-trip आपका असली शब्द लौटाता है। वह पल, जब value बिना बदले लौटती है, translator booth का सिरे से सिरे तक चलना है।"
      ],
      transcriptEN: "You've seen every converter computed live; now wire one on real hardware. The build opens the CircuitVerse workbench with a guided rail for the Binary-to-Gray converter, the cleanest start because it's pure XOR with no carries. Place four input switches, drop the MSB straight through as a bare wire, and add three XOR gates: g2 is b3 XOR b2, g1 is b2 XOR b1, g0 is b1 XOR b0. Three gates and a wire - exactly the n minus one count we proved. Test it against the truth table: feed 0110, confirm 0101, step the input and watch exactly one Gray bit change per step. Then wire the inverse running-XOR chain and prove the round-trip returns your original word. That's the translator booth working end to end.",
      transcriptHI: "आपने हर converter को live गिनते देखा; अब एक को असली hardware पर wire कीजिए। build CircuitVerse workbench को Binary-to-Gray converter के guided rail के साथ खोलता है, सबसे साफ़ शुरुआत क्योंकि यह शुद्ध XOR है, कोई carries नहीं। चार input switches रखिए, MSB को सीधे एक नंगे wire के रूप में गिराइए, और तीन XOR gates जोड़िए: g2, b3 XOR b2; g1, b2 XOR b1; g0, b1 XOR b0। तीन gates और एक wire - ठीक वही n minus one गिनती जो हमने साबित की। इसे truth table के सामने जाँचिए: 0110 feed कीजिए, 0101 की पुष्टि कीजिए, input बढ़ाइए और देखिए हर कदम पर ठीक एक Gray bit बदलता है। फिर inverse running-XOR chain wire कीजिए और साबित कीजिए कि round-trip आपका असली शब्द लौटाता है। यही translator booth का सिरे से सिरे तक चलना है।",
      visualNote: "WorkbenchCTA panel launching /workbench?tutorial=binary-to-gray."
    },
    {
      id: "S10_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Eight flip-cards to lock in the rules, the codes and the design recipe.",
      theoryEN: [
        "These eight flip-cards drill the facts that matter most: the definition of a code converter, the four conversion rules, what BCD and Excess-3 actually are, why Gray code wins for sensors, and the universal truth-table -> K-map -> SOP recipe. Cover the back, say the answer out loud, then flip to check, and repeat any card you stumble on until recall is reflex.",
        "Give extra reps to the two XOR rules, g_i = b_{i+1} ^ b_i for Binary->Gray and b_i = b_{i+1} ^ g_i for Gray->Binary, because examiners love asking you to derive or apply them on the spot, and it is easy to confuse which one feeds back an output versus an input.",
        "If you walk away remembering only one idea, make it the translator booth: a code converter changes the spelling of a value, never the value itself, with pure combinational gates - that single sentence anchors every rule on these cards."
      ],
      theoryHI: [
        "ये आठ flip-cards सबसे ज़रूरी तथ्य रटाते हैं: code converter की परिभाषा, चार conversion नियम, BCD और Excess-3 असल में क्या हैं, Gray code sensors के लिए क्यों जीतता है, और सार्वभौमिक truth-table -> K-map -> SOP recipe। पीछे ढककर जवाब ज़ोर से बोलिए, फिर जाँचने के लिए पलटिए, और जो card अटके उसे तब तक दोहराइए जब तक याद reflex न बन जाए।",
        "दो XOR नियमों को ज़्यादा दोहराइए, Binary->Gray के लिए g_i = b_{i+1} ^ b_i और Gray->Binary के लिए b_i = b_{i+1} ^ g_i, क्योंकि examiner इन्हें मौक़े पर derive या apply करवाना पसंद करते हैं, और यह गड़बड़ाना आसान है कि कौन सा एक output feed करता है बनाम input।",
        "अगर आप सिर्फ़ एक विचार याद रखकर जाएँ, तो वह translator booth हो: एक code converter किसी value की spelling बदलता है, ख़ुद value कभी नहीं, शुद्ध combinational gates से - वह एक वाक्य इन cards के हर नियम को थामे रखता है।"
      ],
      transcriptEN: "Eight quick flip-cards to set it solid. They drill the definition of a code converter, the four conversion rules, what BCD and Excess-3 are, why Gray wins for sensors, and the universal truth-table, K-map, SOP recipe. Cover the back, say it aloud, then flip to check. Give extra reps to the two XOR rules - g sub i equals b i plus one XOR b i for Binary to Gray, and b sub i equals b i plus one XOR g i for Gray to Binary - because it's easy to confuse which one feeds back an output versus an input. If you remember only one idea, make it the translator booth: a converter changes the spelling, never the value.",
      transcriptHI: "इसे पक्का करने के लिए आठ तेज़ flip-cards। ये code converter की परिभाषा, चार conversion नियम, BCD और Excess-3 क्या हैं, Gray sensors के लिए क्यों जीतता है, और सार्वभौमिक truth-table, K-map, SOP recipe रटाते हैं। पीछे ढककर ज़ोर से बोलिए, फिर जाँचने के लिए पलटिए। दो XOR नियमों को ज़्यादा दोहराइए - Binary to Gray के लिए g sub i बराबर b i plus one XOR b i, और Gray to Binary के लिए b sub i बराबर b i plus one XOR g i - क्योंकि यह गड़बड़ाना आसान है कि कौन सा एक output feed करता है बनाम input। अगर सिर्फ़ एक विचार याद रखें, तो वह translator booth हो: एक converter spelling बदलता है, value कभी नहीं।",
      visualNote: "Standard bilingual flip deck, eight cards."
    },
    {
      id: "S11_Quiz",
      label: "Quiz Arena",
      kind: "quiz",
      subtitle: "Eight questions - prove you can convert by hand and reason about the gates.",
      theoryEN: [
        "Eight multiple-choice questions now check that the translator booth has truly sunk in. They probe what a code converter is, walk you through actual conversions like binary 0110 to Gray and BCD 0101 to Excess-3, ask which gates implement a specific output bit, count the XOR gates a 4-bit Gray converter needs, and test the reasoning behind the running-XOR feedback and Excess-3's self-complementing property.",
        "Several questions hand you a specific code word and ask for the translated result, so work those by hand bit by bit rather than guessing - apply the rule, XOR the adjacent pair or add the 0011, and read off the answer rather than pattern-matching the options.",
        "Aim for full marks, because clearing all eight means you can both design a converter from its truth table and predict its output for any input - which is exactly the skill the build scene asked you to prove on real hardware."
      ],
      theoryHI: [
        "आठ bahu-vikalp सवाल अब जाँचते हैं कि translator booth सचमुच बैठा या नहीं। ये पूछते हैं कि code converter क्या है, असली conversions चलाते हैं जैसे binary 0110 to Gray और BCD 0101 to Excess-3, पूछते हैं कि कौन से gates किसी ख़ास output bit को बनाते हैं, गिनते हैं कि एक 4-bit Gray converter को कितने XOR gates चाहिए, और running-XOR feedback तथा Excess-3 के self-complementing गुण के पीछे की reasoning जाँचते हैं।",
        "कई सवाल आपको एक ख़ास code शब्द देकर translated नतीजा पूछते हैं, तो उन्हें अंदाज़े के बजाय bit-दर-bit हाथ से कीजिए - नियम लगाइए, adjacent pair को XOR कीजिए या 0011 जोड़िए, और options को pattern-match करने के बजाय जवाब पढ़ लीजिए।",
        "पूरे अंक का लक्ष्य रखिए, क्योंकि आठों साफ़ करने का मतलब है आप एक converter को उसकी truth table से design भी कर सकते हैं और किसी भी input के लिए उसका output भी बता सकते हैं - ठीक वही skill जो build scene ने आपसे असली hardware पर साबित करने को कहा।"
      ],
      transcriptEN: "Eight questions in the arena. They check what a code converter is, walk you through real conversions like binary 0110 to Gray and BCD 0101 to Excess-3, ask which gates implement a specific output bit, count the XOR gates a four-bit Gray converter needs, and test the reasoning behind the running-XOR feedback and Excess-3's self-complementing property. Several hand you a specific code word and ask for the translated result - work those by hand, bit by bit, applying the rule rather than guessing. Clear all eight and you can both design a converter from its truth table and predict its output for any input.",
      transcriptHI: "Arena में आठ सवाल। ये जाँचते हैं कि code converter क्या है, असली conversions चलाते हैं जैसे binary 0110 to Gray और BCD 0101 to Excess-3, पूछते हैं कि कौन से gates किसी ख़ास output bit को बनाते हैं, गिनते हैं कि एक four-bit Gray converter को कितने XOR gates चाहिए, और running-XOR feedback तथा Excess-3 के self-complementing गुण की reasoning जाँचते हैं। कई आपको एक ख़ास code शब्द देकर translated नतीजा पूछते हैं - उन्हें bit-दर-bit हाथ से कीजिए, नियम लगाते हुए, अंदाज़े के बजाय। आठों साफ़ कीजिए और आप एक converter को उसकी truth table से design भी कर सकते हैं और किसी भी input के लिए उसका output भी बता सकते हैं।",
      visualNote: "Parameterized QuizArena."
    },
    {
      id: "S12_Recap",
      label: "Recap & Track Complete",
      kind: "recap",
      subtitle: "You can now translate between number languages - the booth is yours.",
      theoryEN: [
        "Let us bank the whole thing. A code converter is pure combinational logic - gates only, no memory, no clock - that rewrites the SAME value from one binary code into another. It is the translator booth: decimal 5 stays 5, only the spelling changes, and the output of one device lines up perfectly with the expected input of the next.",
        "The two XOR conversions are the fast ones. Binary to Gray drops the MSB through and computes g_i = b_{i+1} ^ b_i, costing only n - 1 XOR gates with no carries. Gray to Binary reverses it with a running feedback XOR, b_i = b_{i+1} ^ g_i, equivalently the cumulative XOR from the MSB down. Gray code earns its keep because exactly one bit changes per step, so optical and mechanical sensors never read a transition glitch.",
        "The two arithmetic conversions handle decimal. BCD to Excess-3 adds 0011 (+3) and Excess-3 to BCD subtracts it (-3); they are exact inverses, so chaining them returns the original word. BCD is the weighted 8-4-2-1 display code, while Excess-3 is unweighted and self-complementing, turning a 9's-complement into a single bitwise NOT for easy decimal subtraction.",
        "Every one of the four was designed by the identical recipe - write the truth table, K-map each output bit (using BCD's unused codes as don't-cares), read off the minimised SOP, and wire the gates - so the equations g_i = b_{i+1} ^ b_i, b_i = b_{i+1} ^ g_i, XS3 = BCD + 0011 and BCD = XS3 - 0011 are just the polished end results of one disciplined procedure.",
        "Step back and notice what unifies this whole combinational track: a MUX routes, a decoder selects, an encoder votes, and a code converter translates - each is the same idea of a small, fast, memoryless gate network reshaping bits to fit the next stage. Master that mindset and you can build the bridge between any two digital systems. The code-converters topic is now complete."
      ],
      theoryHI: [
        "चलिए पूरी बात जमा कर लें। एक code converter शुद्ध combinational logic है - सिर्फ़ gates, कोई memory नहीं, कोई clock नहीं - जो उसी value को एक binary code से दूसरे में फिर से लिखता है। यह translator booth है: decimal 5 5 ही रहता है, सिर्फ़ spelling बदलती है, और एक device का output अगले के अपेक्षित input से बिलकुल मिलता है।",
        "दो XOR conversions तेज़ वाली हैं। Binary to Gray MSB को सीधे गिराता है और g_i = b_{i+1} ^ b_i गिनता है, सिर्फ़ n - 1 XOR gates की क़ीमत पर बिना carries। Gray to Binary इसे एक running feedback XOR से उलटता है, b_i = b_{i+1} ^ g_i, समतुल्य रूप से MSB से नीचे तक cumulative XOR। Gray code अपनी क़ीमत वसूल करता है क्योंकि हर कदम पर ठीक एक bit बदलता है, तो optical और mechanical sensors कभी transition glitch नहीं पढ़ते।",
        "दो arithmetic conversions decimal सँभालती हैं। BCD to Excess-3 0011 जोड़ता है (+3) और Excess-3 to BCD उसे घटाता है (-3); ये सटीक inverse हैं, तो इन्हें chain करने पर असली शब्द लौटता है। BCD weighted 8-4-2-1 display code है, जबकि Excess-3 unweighted और self-complementing है, जो एक 9's-complement को एक अकेले bitwise NOT में बदलकर decimal subtraction आसान करता है।",
        "चारों में से हर एक उसी एक recipe से design हुआ - truth table लिखिए, हर output bit को K-map कीजिए (BCD के अनुपयोगी codes को don't-cares मानते हुए), minimised SOP पढ़िए, और gates wire कीजिए - तो समीकरण g_i = b_{i+1} ^ b_i, b_i = b_{i+1} ^ g_i, XS3 = BCD + 0011 और BCD = XS3 - 0011 बस एक अनुशासित प्रक्रिया के चमकाए नतीजे हैं।",
        "पीछे हटकर देखिए इस पूरे combinational track को क्या जोड़ता है: एक MUX route करता है, एक decoder select करता है, एक encoder vote करता है, और एक code converter translate करता है - हर एक वही विचार है एक छोटे, तेज़, बिना-memory वाले gate network का जो bits को अगले चरण में फ़िट करने के लिए नया आकार देता है। उस सोच में महारत पाइए और आप किसी भी दो digital systems के बीच पुल बना सकते हैं। code-converters topic अब पूरा हो गया।"
      ],
      transcriptEN: "Let's bank the whole thing. A code converter is pure combinational logic - gates only, no memory, no clock - that rewrites the same value from one binary code into another. It's the translator booth: decimal five stays five, only the spelling changes. The two XOR conversions are fast: binary to Gray drops the MSB through and computes g sub i equals b i plus one XOR b i, just n minus one gates with no carries; Gray to binary reverses it with a running feedback XOR. Gray earns its keep because exactly one bit changes per step, so sensors never read a glitch. The two arithmetic conversions handle decimal: BCD to Excess-3 adds three, Excess-3 to BCD subtracts three, exact inverses. BCD is the weighted display code; Excess-3 is unweighted and self-complementing. All four came from the same recipe - truth table, K-map, SOP, gates. And notice what unifies the whole track: a MUX routes, a decoder selects, an encoder votes, a code converter translates - each a small, fast, memoryless gate network reshaping bits for the next stage. The topic is complete.",
      transcriptHI: "चलिए पूरी बात जमा कर लें। एक code converter शुद्ध combinational logic है - सिर्फ़ gates, कोई memory नहीं, कोई clock नहीं - जो उसी value को एक binary code से दूसरे में फिर से लिखता है। यह translator booth है: decimal पाँच पाँच ही रहता है, सिर्फ़ spelling बदलती है। दो XOR conversions तेज़ हैं: binary to Gray MSB को सीधे गिराता है और g sub i बराबर b i plus one XOR b i गिनता है, सिर्फ़ n minus one gates बिना carries; Gray to binary इसे एक running feedback XOR से उलटता है। Gray अपनी क़ीमत वसूल करता है क्योंकि हर कदम पर ठीक एक bit बदलता है, तो sensors कभी glitch नहीं पढ़ते। दो arithmetic conversions decimal सँभालती हैं: BCD to Excess-3 तीन जोड़ता है, Excess-3 to BCD तीन घटाता है, सटीक inverse। BCD weighted display code है; Excess-3 unweighted और self-complementing है। चारों उसी recipe से आए - truth table, K-map, SOP, gates। और देखिए पूरे track को क्या जोड़ता है: एक MUX route करता है, एक decoder select करता है, एक encoder vote करता है, एक code converter translate करता है - हर एक एक छोटा, तेज़, बिना-memory वाला gate network जो bits को अगले चरण के लिए नया आकार देता है। topic पूरा हो गया।",
      visualNote: "Recap card: the master 4-row matrix on the left, the round-trip Binary->Gray->Binary loop on the right; plain-link source list below."
    }
  ],
  flashcards: [
    {
      frontEN: "What is a code converter?",
      backEN: "Pure combinational logic (gates only, no memory, no clock) that rewrites the SAME value from one binary code into another - a translator booth that changes the spelling, never the value.",
      frontHI: "Code converter क्या है?",
      backHI: "शुद्ध combinational logic (सिर्फ़ gates, कोई memory नहीं, कोई clock नहीं) जो उसी value को एक binary code से दूसरे में फिर से लिखती है - एक translator booth जो spelling बदलती है, value कभी नहीं।"
    },
    {
      frontEN: "Binary -> Gray rule and gate count?",
      backEN: "MSB passes through (g_{n-1} = b_{n-1}); every other bit g_i = b_{i+1} ^ b_i. A 4-bit converter needs 3 two-input XOR gates (n - 1); the MSB is a bare wire.",
      frontHI: "Binary -> Gray नियम और gate गिनती?",
      backHI: "MSB सीधे गुज़रता है (g_{n-1} = b_{n-1}); बाक़ी हर bit g_i = b_{i+1} ^ b_i। एक 4-bit converter को 3 two-input XOR gates (n - 1) चाहिए; MSB एक नंगा wire है।"
    },
    {
      frontEN: "Gray -> Binary rule?",
      backEN: "MSB passes through (b_{n-1} = g_{n-1}); then b_i = b_{i+1} ^ g_i - a running/feedback XOR that uses the just-computed binary bit, equal to the cumulative XOR of Gray bits from the MSB down.",
      frontHI: "Gray -> Binary नियम?",
      backHI: "MSB सीधे गुज़रता है (b_{n-1} = g_{n-1}); फिर b_i = b_{i+1} ^ g_i - एक running/feedback XOR जो अभी बने binary bit को वापरता है, MSB से नीचे तक Gray bits के cumulative XOR के बराबर।"
    },
    {
      frontEN: "Why is Gray code used for sensors?",
      backEN: "Exactly one bit changes between consecutive numbers, so a rotary/optical encoder never reads an ambiguous multi-bit glitch during a transition - worst case it lags by one count.",
      frontHI: "Gray code sensors के लिए क्यों वापरते हैं?",
      backHI: "लगातार संख्याओं के बीच ठीक एक bit बदलता है, तो एक rotary/optical encoder transition के दौरान कभी अस्पष्ट multi-bit glitch नहीं पढ़ता - सबसे बुरा हाल एक count पीछे रहना।"
    },
    {
      frontEN: "What is BCD (8421)?",
      backEN: "A weighted code: each decimal digit 0-9 in its own 4-bit group using weights 8,4,2,1. The six codes 1010-1111 are invalid/unused.",
      frontHI: "BCD (8421) क्या है?",
      backHI: "एक weighted code: हर decimal digit 0-9 अपने 4-bit समूह में weights 8,4,2,1 से। छह codes 1010-1111 अमान्य/अनुपयोगी हैं।"
    },
    {
      frontEN: "What is Excess-3 and its special property?",
      backEN: "An unweighted, self-complementing code: digit encoded as binary of (digit + 3), so 0 = 0011, 9 = 1100. Inverting all 4 bits gives the 9's complement, which simplifies decimal subtraction.",
      frontHI: "Excess-3 क्या है और उसका ख़ास गुण?",
      backHI: "एक unweighted, self-complementing code: digit को (digit + 3) के binary के रूप में encode किया, तो 0 = 0011, 9 = 1100। चारों bits invert करने पर 9's complement मिलता है, जो decimal subtraction आसान करता है।"
    },
    {
      frontEN: "BCD <-> Excess-3 conversions?",
      backEN: "BCD -> XS3: add 0011 (+3) with an adder. XS3 -> BCD: subtract 0011 (-3) with a subtractor. They are exact inverses - chaining them returns the original word.",
      frontHI: "BCD <-> Excess-3 conversions?",
      backHI: "BCD -> XS3: एक adder से 0011 (+3) जोड़ो। XS3 -> BCD: एक subtractor से 0011 (-3) घटाओ। ये सटीक inverse हैं - इन्हें chain करने पर असली शब्द लौटता है।"
    },
    {
      frontEN: "The design recipe for any converter?",
      backEN: "Truth table -> K-map each output bit (use unused source codes as don't-cares) -> minimised SOP -> gate network. An m-output converter = m independent Boolean functions from one shared table.",
      frontHI: "किसी भी converter की design recipe?",
      backHI: "Truth table -> हर output bit को K-map (अनुपयोगी source codes को don't-cares मानो) -> minimised SOP -> gate network। एक m-output converter = एक साझा table से m स्वतंत्र Boolean functions।"
    }
  ],
  quiz: [
    {
      questionEN: "What is a code converter?",
      options: [
        "A sequential circuit that stores past inputs in flip-flops",
        "A combinational circuit that re-expresses the same value from one binary code into another",
        "An amplifier that boosts a binary signal's voltage",
        "A circuit that changes the numeric value from one number to another"
      ],
      answerIndex: 1,
      explainEN: "A code converter is pure combinational logic; it changes only the encoding, never the value, and has no memory.",
      explainHI: "एक code converter शुद्ध combinational logic है; यह सिर्फ़ encoding बदलता है, value कभी नहीं, और इसमें कोई memory नहीं।",
      questionHI: "Code converter क्या है?"
    },
    {
      questionEN: "Convert binary 0110 to Gray code using g(i) = b(i+1) XOR b(i).",
      options: ["0110", "0101", "1010", "0011"],
      answerIndex: 1,
      explainEN: "g3 = b3 = 0; g2 = 0^1 = 1; g1 = 1^1 = 0; g0 = 1^0 = 1 -> 0101.",
      explainHI: "g3 = b3 = 0; g2 = 0^1 = 1; g1 = 1^1 = 0; g0 = 1^0 = 1 -> 0101।",
      questionHI: "g(i) = b(i+1) XOR b(i) वापरकर binary 0110 को Gray code में बदलिए।"
    },
    {
      questionEN: "Which gates implement output bit g2 = b3 XOR b2 in a 4-bit Binary-to-Gray converter?",
      options: [
        "An AND gate fed by b3 and b2",
        "A single 2-input XOR gate fed by b3 and b2",
        "An OR gate fed by b3 and b2",
        "A NOT gate on b2 only"
      ],
      answerIndex: 1,
      explainEN: "Every non-MSB Gray output is a single 2-input XOR of two adjacent binary bits; here b3 and b2.",
      explainHI: "हर non-MSB Gray output दो adjacent binary bits का एक अकेला 2-input XOR है; यहाँ b3 और b2।",
      questionHI: "एक 4-bit Binary-to-Gray converter में output bit g2 = b3 XOR b2 को कौन से gates बनाते हैं?"
    },
    {
      questionEN: "How many 2-input XOR gates are needed to build a 4-bit Binary-to-Gray converter?",
      options: ["4", "3", "2", "8"],
      answerIndex: 1,
      explainEN: "The MSB is a straight wire (no gate); the other 3 outputs each need one XOR gate, so n - 1 = 3.",
      explainHI: "MSB एक सीधा wire है (कोई gate नहीं); बाक़ी 3 outputs में से हर एक को एक XOR gate चाहिए, तो n - 1 = 3।",
      questionHI: "एक 4-bit Binary-to-Gray converter बनाने को कितने 2-input XOR gates चाहिए?"
    },
    {
      questionEN: "In Gray-to-Binary conversion, how is bit b1 generated (4-bit case)?",
      options: [
        "b1 = g1 only (straight wire)",
        "b1 = b2 XOR g1, where b2 was just computed (running XOR feedback)",
        "b1 = g2 XOR g1",
        "b1 = b3 XOR g0"
      ],
      answerIndex: 1,
      explainEN: "Gray-to-Binary uses a cascading feedback XOR: each binary bit XORs the previously generated higher binary bit with the next Gray bit.",
      explainHI: "Gray-to-Binary एक cascading feedback XOR वापरता है: हर binary bit पहले बने ऊँचे binary bit को अगले Gray bit के साथ XOR करता है।",
      questionHI: "Gray-to-Binary conversion में, bit b1 कैसे बनता है (4-bit मामला)?"
    },
    {
      questionEN: "Why is Gray code preferred for mechanical and optical position sensors?",
      options: [
        "It uses fewer bits than binary",
        "Only one bit changes between consecutive numbers, preventing transition glitches",
        "It is a weighted code so arithmetic is faster",
        "Every code word contains at least one '1'"
      ],
      answerIndex: 1,
      explainEN: "Single-bit transitions mean the reading is always the old or new value, never an ambiguous multi-bit glitch.",
      explainHI: "एक-bit transitions का मतलब reading हमेशा पुरानी या नई value होती है, कभी कोई अस्पष्ट multi-bit glitch नहीं।",
      questionHI: "Gray code mechanical और optical position sensors के लिए क्यों पसंद किया जाता है?"
    },
    {
      questionEN: "Convert BCD 0101 to Excess-3.",
      options: ["0010", "0101", "1000", "1100"],
      answerIndex: 2,
      explainEN: "Excess-3 = BCD + 0011: 0101 + 0011 = 1000 (decimal 5 + 3 = 8).",
      explainHI: "Excess-3 = BCD + 0011: 0101 + 0011 = 1000 (decimal 5 + 3 = 8)।",
      questionHI: "BCD 0101 को Excess-3 में बदलिए।"
    },
    {
      questionEN: "Which property makes Excess-3 attractive for decimal arithmetic hardware?",
      options: [
        "It is weighted 8-4-2-1 like BCD",
        "It is self-complementing: inverting all 4 bits gives the 9's complement",
        "It needs only 3 bits per digit",
        "It is identical to standard binary"
      ],
      answerIndex: 1,
      explainEN: "Excess-3 is self-complementing, so the 9's complement (needed for subtraction) is just a bitwise NOT.",
      explainHI: "Excess-3 self-complementing है, तो 9's complement (subtraction के लिए ज़रूरी) बस एक bitwise NOT है।",
      questionHI: "कौन सा गुण Excess-3 को decimal arithmetic hardware के लिए आकर्षक बनाता है?"
    }
  ]
}) as unknown as SubContent;
