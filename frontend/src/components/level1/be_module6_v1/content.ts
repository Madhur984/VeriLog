import type { SubContent } from '../_transistor/kit';

/**
 * Basic Electronics module 6 - "BJT Construction & Operation".
 * Central analogy woven through every page: "The Silicon Shopping Mall".
 * Bilingual EN / Hinglish-Devanagari. All numbers/logic are computed in scenes.tsx.
 */
export const CONTENT: SubContent = {
  moduleTitle: 'BJT Construction & Operation',
  moduleSubtitle:
    'The anatomy of a phenomenon: physical architecture, dynamic behaviour, and the mechanics of amplification - told as a walk through the Silicon Shopping Mall.',
  scenes: [
    {
      id: 'S00_Cover',
      label: 'BJT Construction & Operation',
      kind: 'cover',
      subtitle: 'The Silicon Shopping Mall - opening the BJT track',
      theoryEN: [
        'A transistor is one of the most important parts in all of electronics, and the best way to picture it is as a small shopping mall with three areas. There is a crowded main entrance, a very narrow corridor in the middle, and a big receiving hall at the far end. In the real device these three areas have proper names: the entrance is the emitter, the thin corridor is the base, and the receiving hall is the collector.',
        'The whole point of the device is this: a very small number of shoppers who turn off into the narrow corridor can decide how huge the crowd flowing into the receiving hall becomes. In electrical terms, a tiny base current (the small current that flows into the middle terminal, written Ib) controls a much larger collector current (the big current that flows through the device, written Ic). When a small input controls a much bigger output like this, we call it amplification.',
        'In this module we will build the transistor up slowly, starting from the silicon itself. We will look at how big each region is and how heavily it is doped (how many extra charge carriers were added to it), the difference between the two main types called NPN and PNP, the two junctions inside, how the carriers actually move, the three ways the device can operate, and finally the graphs that describe its behaviour.',
        'If you remember only one sentence, make it this one: a small base current controls a large collector current, and we write that as Ic = beta times Ib. This works because the middle corridor (the base) is made so thin that it cannot soak up the crowd passing through.',
        'By the end you will see that amplification is not a trick or magic at all. It follows directly and unavoidably from three simple things: the shape and size of the regions (geometry), the way we connect the voltages (biasing), and the basic rule that charge cannot appear or vanish (conservation of charge).',
      ],
      theoryHI: [
        'transistor पूरी electronics के सबसे ज़रूरी parts में से एक है, और इसे समझने का सबसे अच्छा तरीक़ा है इसे तीन हिस्सों वाला एक छोटा shopping mall मान लेना। एक भरा हुआ मुख्य entrance है, बीच में एक बहुत पतला corridor है, और दूर सिरे पर एक बड़ा receiving hall है। असली device में इन तीनों के नाम हैं: entrance को emitter कहते हैं, पतले corridor को base, और receiving hall को collector।',
        'इस device का पूरा मक़सद यही है: corridor में मुड़ने वाले बहुत थोड़े से shoppers यह तय कर देते हैं कि receiving hall में कितनी बड़ी crowd जाएगी। बिजली की भाषा में, एक छोटी सी base current (बीच वाले terminal में जाने वाली current, जिसे Ib लिखते हैं) एक बहुत बड़ी collector current (device से बहने वाली बड़ी current, जिसे Ic लिखते हैं) को control करती है। जब एक छोटा input एक बड़े output को इस तरह control करता है, उसे amplification कहते हैं।',
        'इस module में हम transistor को धीरे-धीरे silicon से ही बनाएँगे। हम देखेंगे कि हर region कितना बड़ा है और कितना doped है (उसमें कितने extra charge carriers डाले गए हैं), NPN और PNP नाम के दो मुख्य types का फर्क, अंदर के दो junctions, carriers असल में कैसे चलते हैं, device के काम करने के तीन तरीक़े, और आख़िर में वे graphs जो इसका behaviour बताते हैं।',
        'अगर सिर्फ़ एक वाक्य याद रखना हो तो यह: एक छोटी base current एक बड़ी collector current को control करती है, और इसे हम Ic = beta गुना Ib लिखते हैं। यह इसलिए होता है क्योंकि बीच वाला corridor (base) इतना पतला बनाया जाता है कि वह गुज़रती crowd को सोख ही नहीं सकता।',
        'अंत तक आप देखेंगे कि amplification कोई trick या जादू नहीं है। यह सीधे तीन सरल बातों से निकलता है: regions की shape और size (geometry), voltages जोड़ने का तरीक़ा (biasing), और यह बुनियादी नियम कि charge न तो पैदा हो सकता है न ग़ायब (charge का conservation)।',
      ],
      transcriptEN:
        'Welcome to the Silicon Shopping Mall. A bipolar junction transistor is just three zones built from silicon: a packed entrance called the emitter, a paper-thin corridor called the base, and a big receiving hall called the collector. The whole trick of amplification is that a tiny number of shoppers who turn into the corridor controls the enormous crowd that pours through to the hall. In this module we will build the device piece by piece and see why that control is inevitable.',
      transcriptHI:
        'Silicon Shopping Mall में आपका स्वागत है। एक bipolar junction transistor सिर्फ़ silicon से बने तीन zones हैं: एक भरा entrance जिसे emitter कहते हैं, एक paper-thin corridor जिसे base कहते हैं, और एक बड़ा receiving hall जिसे collector कहते हैं। amplification का पूरा trick यह है कि corridor में मुड़ते कुछ shoppers ही उस बड़ी crowd को control करते हैं जो hall में गिरती है।',
      visualNote:
        'Cover: a blueprint-style NPN schematic symbol on a dark engineering grid, with three glowing mall zones - entrance, thin corridor, receiving hall - mapped onto emitter/base/collector.',
    },
    {
      id: 'S01_Video',
      label: 'Video - Inside the BJT',
      kind: 'video',
      subtitle: 'Lesson lecture: the three-layer sandwich that amplifies',
      theoryEN: [
        'Before we go into the details, watch this short lesson. It takes you on a quick tour of the transistor as our Silicon Shopping Mall, showing the entrance, the corridor, and the receiving hall so the big picture is clear in your head first.',
        'The video keeps coming back to one main idea, so listen for it: a small base current Ib steers a much larger collector current Ic, which we write as Ic = beta times Ib. Everything else in this module is really just an explanation of why that one sentence is true.',
        'You will also meet the three ways a transistor can work. In the active mode it amplifies (it makes a small signal bigger). In saturation it behaves like a switch that is fully closed, letting current through. In cut-off it behaves like a switch that is open, blocking the current.',
        'As you watch, keep your eye on how unequal the three regions are. The entrance (emitter) is packed full, the middle corridor (base) is thin and almost empty, and the receiving hall (collector) is wide. That deliberate inequality, not any clever trickery, is the whole secret behind amplification.',
        'Finally, hold on to one simple accounting rule that we will use again and again: the current going in equals the current coming out. For a transistor this becomes Ie = Ic + Ib, where Ie is the emitter current. Nothing is lost, the totals always balance.',
      ],
      theoryHI: [
        'detail में जाने से पहले यह छोटा lesson देखिए। यह transistor को हमारे Silicon Shopping Mall की तरह घुमाकर दिखाता है - entrance, corridor और receiving hall - ताकि बड़ी तस्वीर पहले ही दिमाग़ में साफ़ हो जाए।',
        'video बार-बार एक मुख्य बात पर लौटता है, उस पर ध्यान दीजिए: एक छोटी base current Ib एक बहुत बड़ी collector current Ic को steer करती है, जिसे हम Ic = beta गुना Ib लिखते हैं। इस module का बाक़ी सब कुछ बस यही समझाता है कि यह एक वाक्य सच क्यों है।',
        'आप transistor के काम करने के तीन तरीक़े भी देखेंगे। active mode में यह amplify करता है (छोटे signal को बड़ा करता है)। saturation में यह पूरी तरह बंद (closed) switch की तरह काम करता है, current निकलने देता है। cut-off में यह खुले (open) switch की तरह current रोक देता है।',
        'देखते समय इस बात पर नज़र रखिए कि तीनों regions कितने अलग हैं। entrance (emitter) खचाखच भरा है, बीच का corridor (base) पतला और लगभग ख़ाली है, और receiving hall (collector) चौड़ा है। यही जानबूझकर रखी गई असमानता, न कि कोई चालाकी, amplification का पूरा राज़ है।',
        'आख़िर में, एक सरल हिसाब का नियम याद रखिए जिसे हम बार-बार इस्तेमाल करेंगे: अंदर जाने वाली current बराबर बाहर आने वाली current। transistor के लिए यह बनता है Ie = Ic + Ib, जहाँ Ie emitter current है। कुछ खोता नहीं, हिसाब हमेशा बराबर रहता है।',
      ],
      transcriptEN:
        'In this video the idea lands in plain words. A transistor is a sandwich of three silicon layers, and the middle layer - the base - is deliberately made razor-thin and lightly doped. Because of that, almost every carrier the emitter injects shoots straight across to the collector, and only a tiny fraction leaks out of the base. So the small base current ends up controlling a much larger collector current, and that ratio is called beta. Add the right bias - emitter-base junction forward, collector-base junction reverse - and the device becomes a linear amplifier.',
      transcriptHI:
        'इस video में बात साफ़ शब्दों में आती है। एक transistor तीन silicon layers का sandwich है, और बीच की layer - base - जानबूझकर बेहद पतली और lightly doped बनाई जाती है। इसी वजह से emitter जो भी carriers inject करता है उनमें से लगभग सब सीधे collector तक पहुँच जाते हैं, और सिर्फ़ एक छोटा हिस्सा base से बाहर निकलता है। तो छोटी base current एक बहुत बड़ी collector current को control करती है, और उस ratio को beta कहते हैं।',
      visualNote:
        'Embed be6-bjt-construction-hi.mp4 with chapter markers: The sandwich, Sizes and doping, The two junctions, Carrier flow, The three regions, Alpha and beta.',
    },
    {
      id: 'S02_ThreeLayerSandwich',
      label: 'What a BJT Is: The Three-Layer Sandwich',
      kind: 'theory',
      subtitle: 'Three terminals, two junctions, one crowd flow',
      theoryEN: [
        'The full name of our device is the Bipolar Junction Transistor, usually shortened to BJT. It is a piece of semiconductor (a material like silicon whose ability to carry current we can carefully control) with three connecting wires, called terminals. The three terminals are the Emitter (E), the Base (B), and the Collector (C). Inside, the device is really just two PN junctions placed back to back, where a PN junction is simply the boundary where a p-type region (rich in positive carriers) meets an n-type region (rich in negative carriers).',
        'The word "bipolar" in the name has a clear meaning. It tells us that both kinds of charge carriers do the work here: electrons (the negative carriers) and holes (the empty spots that behave like positive carriers). This is different from another family of transistors, the field-effect transistors or FETs, which are called unipolar because only one kind of carrier carries the current.',
        'The three regions are made deliberately different in size and in doping (how many extra carriers were added to each region). This is the single most important fact about the whole device. The inequality between the regions is not an accident of manufacturing; it is the exact reason a transistor can amplify at all, as we will see.',
        'In the mall picture these three regions are our familiar zones: the crowded entrance is the emitter, the thin corridor is the base, and the wide receiving hall is the collector. They are connected one after the other, and a single flow of shoppers (the current) moves through all three.',
        'Hiding inside the device are the two junctions we mentioned. The boundary between the emitter and the base is called the emitter-base junction (EBJ), and the boundary between the collector and the base is called the collector-base junction (CBJ). The way we connect voltages across each of these two junctions (called biasing) is what decides how the whole transistor behaves.',
      ],
      theoryHI: [
        'हमारे device का पूरा नाम है Bipolar Junction Transistor, जिसे छोटा करके BJT कहते हैं। यह एक semiconductor का टुकड़ा है (silicon जैसी material जिसकी current ले जाने की क्षमता को हम control कर सकते हैं) जिसके तीन जोड़ने वाले तार हैं, जिन्हें terminals कहते हैं। तीन terminals हैं: Emitter (E), Base (B), और Collector (C)। अंदर से यह device दरअसल दो PN junctions को back to back रखकर बना है, जहाँ एक PN junction बस वह सीमा है जहाँ p-type region (positive carriers से भरा) n-type region (negative carriers से भरा) से मिलता है।',
        '"bipolar" शब्द का साफ़ मतलब है। यह बताता है कि यहाँ दोनों तरह के charge carriers काम करते हैं: electrons (negative carriers) और holes (ख़ाली जगहें जो positive carriers की तरह व्यवहार करती हैं)। यह transistors के एक दूसरे परिवार, field-effect transistors या FETs, से अलग है, जिन्हें unipolar कहते हैं क्योंकि उनमें सिर्फ़ एक तरह का carrier current ले जाता है।',
        'तीनों regions जानबूझकर size और doping (हर region में कितने extra carriers डाले गए) में अलग बनाई जाती हैं। यह पूरे device की सबसे ज़रूरी बात है। regions के बीच की यह असमानता manufacturing का कोई संयोग नहीं है; यही वह वजह है जिससे transistor amplify कर पाता है, जैसा हम आगे देखेंगे।',
        'mall की तस्वीर में ये तीनों regions हमारे जाने-पहचाने zones हैं: भरा हुआ entrance emitter है, पतला corridor base है, और चौड़ा receiving hall collector है। ये एक के बाद एक जुड़े हैं, और shoppers का एक ही flow (current) तीनों में से होकर गुज़रता है।',
        'device के अंदर वे दो junctions छिपे हैं जिनकी बात हमने की। emitter और base के बीच की सीमा को emitter-base junction (EBJ) कहते हैं, और collector तथा base के बीच की सीमा को collector-base junction (CBJ)। इन दोनों junctions पर हम voltages कैसे जोड़ते हैं (जिसे biasing कहते हैं), वही पूरे transistor का behaviour तय करता है।',
      ],
      transcriptEN:
        'Let us name the parts. A BJT has three terminals - emitter, base, and collector - and inside it there are two PN junctions placed back to back. The word bipolar tells you both carrier types, electrons and holes, do the work here, unlike a field-effect transistor that relies on just one. The three regions are made on purpose with different sizes and doping levels, and that built-in asymmetry is exactly what makes amplification possible. Think of it as a mall: a crowded entrance, a thin corridor, and a wide hall, all carrying one flow of shoppers.',
      transcriptHI:
        'आइए हिस्सों को नाम दें। एक BJT के तीन terminals हैं - emitter, base, collector - और इसके अंदर दो PN junctions back to back लगे हैं। शब्द bipolar बताता है कि यहाँ दोनों carrier types, electrons और holes, काम करते हैं। तीनों regions जानबूझकर अलग size और doping के साथ बनाई जाती हैं, और वही built-in asymmetry amplification को संभव बनाती है।',
      visualNote:
        'Title-style blueprint of an NPN symbol; callouts label E, B, C and the two junctions EBJ and CBJ on a dark grid.',
    },
    {
      id: 'S03_Architecture',
      label: 'Physical Architecture: Sizes & Doping',
      kind: 'theory',
      subtitle: 'Heavy entrance, paper-thin corridor, wide hall',
      theoryEN: [
        'This is the page where amplification is really built in, so it is worth slowing down. The emitter is doped very heavily, meaning it is packed with a huge number of free charge carriers. Its job is to push, or inject, a flood of these carriers into the next region. Think of the entrance to the mall being so crowded that people are constantly being shoved inward whether they want to go or not. These carriers that the emitter is full of are called its majority carriers.',
        'The base is the special region. It is made extraordinarily thin (only about 0.001 of an inch, thinner than a sheet of paper) and it is lightly doped, meaning it has very few carriers of its own. Because it is so thin and so empty, almost none of the incoming carriers get a chance to recombine here. Recombining means an electron falling into a hole and cancelling out, which would remove it from the flow. Since recombination barely happens, nearly all the carriers pass straight through to the other side.',
        'The collector is the largest region. It is lightly doped and physically wide, about 0.150 of an inch across. Its first job is to receive and collect the carriers that streamed through the base. It is also made wide for a second practical reason: a wide region can spread out and get rid of heat more easily, which keeps the device from overheating.',
        'Now compare the sizes. The whole device is roughly 150 times wider than the base is thin, a ratio of about 150 to 1. This enormous difference is exactly what stops the crowd from being soaked up inside the corridor. The corridor is simply too short for shoppers to get stuck in it, so they spill out the far end.',
        'Put together, the mall picture is now complete: a jam-packed entrance that keeps shoving people in, a paper-thin and almost empty corridor that nobody can get stuck in, and a big receiving hall waiting on the far side to catch everyone who comes through.',
      ],
      theoryHI: [
        'यही वह page है जहाँ amplification असल में बनता है, इसलिए यहाँ थोड़ा रुकना ठीक है। emitter को बहुत भारी doped किया जाता है, यानी इसमें बहुत बड़ी संख्या में free charge carriers भरे होते हैं। इसका काम है इन carriers की बाढ़ अगले region में धकेलना (inject करना)। समझिए mall का entrance इतना भरा है कि लोग लगातार अंदर धकेले जा रहे हैं चाहें या न चाहें। emitter में भरे ये carriers इसके majority carriers कहलाते हैं।',
        'base ख़ास region है। इसे असाधारण रूप से पतला (सिर्फ़ लगभग 0.001 इंच, काग़ज़ की शीट से भी पतला) और lightly doped बनाया जाता है, यानी इसके अपने carriers बहुत कम होते हैं। इतना पतला और ख़ाली होने से, आते हुए carriers में से लगभग किसी को recombine होने का मौक़ा नहीं मिलता। recombine होने का मतलब है एक electron का किसी hole में गिरकर ख़त्म हो जाना, जो उसे flow से हटा देता। चूँकि recombination मुश्किल से होता है, लगभग सारे carriers सीधे दूसरी तरफ़ निकल जाते हैं।',
        'collector सबसे बड़ा region है। यह lightly doped और physically चौड़ा है, लगभग 0.150 इंच चौड़ा। इसका पहला काम है उन carriers को receive और collect करना जो base से होकर बहे। इसे चौड़ा बनाने की एक दूसरी practical वजह भी है: चौड़ा region heat को आसानी से फैलाकर निकाल सकता है, जिससे device गरम होकर ख़राब नहीं होता।',
        'अब sizes की तुलना कीजिए। पूरा device base की पतलाई से लगभग 150 गुना चौड़ा है, यानी लगभग 150 से 1 का ratio। यही बड़ा फर्क crowd को corridor के अंदर सोखे जाने से रोकता है। corridor इतना छोटा है कि shoppers उसमें फँस ही नहीं सकते, तो वे दूर सिरे से बाहर निकल जाते हैं।',
        'सब मिलाकर mall की तस्वीर अब पूरी है: एक खचाखच भरा entrance जो लोगों को अंदर धकेलता रहता है, एक काग़ज़-जैसा पतला और लगभग ख़ाली corridor जिसमें कोई फँस नहीं सकता, और दूर सिरे पर एक बड़ा receiving hall जो आने वाले सबको पकड़ने के लिए तैयार है।',
      ],
      transcriptEN:
        'Now look at the sizes and doping, because this is where amplification is engineered in. The emitter is doped heavily so it can shove a huge crowd of carriers inward. The base is made incredibly thin, about a thousandth of an inch, and lightly doped, so the crowd barely gets a chance to recombine before it reaches the far side. The collector is wide and lightly doped, both to receive that crowd and to spread out heat. That roughly one-hundred-fifty to one ratio between the device and the base is the reason the corridor cannot swallow the crowd.',
      transcriptHI:
        'अब sizes और doping देखिए, क्योंकि यहीं amplification को engineer किया जाता है। emitter को भारी doped किया जाता है ताकि वह carriers की बड़ी crowd अंदर धकेल सके। base बेहद पतला बनाया जाता है, लगभग एक हज़ारवें इंच का, और lightly doped, ताकि crowd को recombine होने का मौक़ा ही न मिले। collector चौड़ा और lightly doped होता है। यही लगभग 150:1 ratio corridor को crowd निगलने से रोकता है।',
      visualNote:
        'A 3D block split into Emitter (n+) / thin Base (p) / Collector (n) with dimension callouts 0.150 in across and base ~0.001 in thick; side notes define each region.',
    },
    {
      id: 'S04_NpnVsPnp',
      label: 'NPN vs PNP: The Structural Dichotomy',
      kind: 'theory',
      subtitle: 'Same maths, flipped carriers and arrow',
      theoryEN: [
        'There are two main kinds of BJT, and they are mirror images of each other. An NPN transistor is built by sandwiching one thin p-type base between two n-type layers (the n-type emitter and the n-type collector), which is where the name N-P-N comes from. A PNP transistor is the exact opposite: one thin n-type base sandwiched between two p-type layers.',
        'The type changes which carrier does most of the work. In an NPN the majority carriers (the ones doing the heavy lifting) are electrons, and the few minority carriers are holes. In a PNP everything swaps: holes become the majority carriers and electrons become the minority. The physics is the same; only the leading actor changes.',
        'On a circuit diagram you tell the two apart by looking at the small arrow drawn on the emitter. For an NPN the arrow points outward, away from the device. A handy memory aid is "NPN: Not Pointing iN". For a PNP the arrow points inward, toward the device.',
        'That little arrow is not just decoration. It shows the direction of conventional current (the direction we imagine positive charge flowing) at the emitter. Because the current must flow this way, the arrow also tells you which way round the battery or power supply has to be connected for the circuit to work.',
        'The most reassuring part is that both types follow exactly the same equations. Only the type of carrier and the direction of the voltages flip over. In the mall picture it is the same mall with the same layout; the only difference is that all the doors have been hung to swing the opposite way.',
      ],
      theoryHI: [
        'BJT के दो मुख्य प्रकार हैं, और वे एक-दूसरे की आईने जैसी छवि (mirror image) हैं। एक NPN transistor एक पतले p-type base को दो n-type layers (n-type emitter और n-type collector) के बीच sandwich करके बनता है, इसी से नाम N-P-N आता है। एक PNP transistor इसका बिल्कुल उल्टा है: एक पतला n-type base दो p-type layers के बीच sandwich।',
        'type बदलने से यह बदलता है कि कौन सा carrier ज़्यादातर काम करता है। NPN में majority carriers (भारी काम करने वाले) electrons होते हैं, और थोड़े-से minority carriers holes। PNP में सब बदल जाता है: holes majority carriers बन जाते हैं और electrons minority। physics वही रहती है; सिर्फ़ मुख्य किरदार बदलता है।',
        'circuit diagram पर इन दोनों को emitter पर बने छोटे arrow से पहचानते हैं। NPN में arrow बाहर की ओर, device से दूर इशारा करता है। याद रखने की एक trick है "NPN: Not Pointing iN"। PNP में arrow अंदर की ओर, device की तरफ़ इशारा करता है।',
        'यह छोटा arrow सिर्फ़ सजावट नहीं है। यह emitter पर conventional current (जिस दिशा में हम positive charge का बहना मानते हैं) की दिशा दिखाता है। चूँकि current इसी तरफ़ बहनी है, arrow यह भी बता देता है कि circuit के चलने के लिए battery या power supply किस तरफ़ जुड़नी चाहिए।',
        'सबसे आश्वस्त करने वाली बात यह है कि दोनों types बिल्कुल एक जैसे equations मानते हैं। सिर्फ़ carrier का प्रकार और voltages की दिशा पलटती है। mall की तस्वीर में यह वही mall है वही layout के साथ; फर्क बस इतना कि सारे दरवाज़े उलटी तरफ़ खुलने के लिए लगाए गए हैं।',
      ],
      transcriptEN:
        'There are two flavours of BJT, and they are mirror images. An NPN puts two n-type layers around a p-type base; a PNP does the opposite. In an NPN the heavy lifting is done by electrons; in a PNP it is done by holes. On the schematic you tell them apart by the emitter arrow: it points out of the emitter for an NPN - a handy memory is Not Pointing iN - and into the emitter for a PNP. That arrow just shows conventional current direction, which fixes which way the batteries must face. The equations, though, are exactly the same for both.',
      transcriptHI:
        'BJT के दो flavours हैं, और वे एक-दूसरे के mirror images हैं। NPN एक p-type base के चारों ओर दो n-type layers रखता है; PNP इसका उल्टा। NPN में भारी काम electrons करते हैं; PNP में holes। schematic पर इन्हें emitter arrow से पहचानते हैं: NPN में यह emitter से बाहर की ओर होता है - याद रखने की trick है Not Pointing iN - और PNP में अंदर की ओर। equations दोनों के लिए बिल्कुल एक जैसे हैं।',
      visualNote:
        'A live NPN/PNP toggle: layer stack and schematic symbol morph, swapping majority/minority labels and the arrow direction, with synced captions.',
    },
    {
      id: 'S05_JunctionEngine',
      label: "The PN Junction Engine: Depletion & Bias",
      kind: 'theory',
      subtitle: 'Forward floods the crowd, reverse blocks the backflow',
      theoryEN: [
        'To understand how the transistor controls current, we first need to look at a single PN junction, because there are two of them inside. Right at the boundary where the p-type and n-type meet, something happens automatically: a few electrons and holes near the join cancel each other out and leave behind a thin zone with no free carriers in it. This empty zone is called the depletion region (depleted means emptied out). The fixed charges left behind in it create a small built-in barrier, like a low wall that carriers must climb over to cross.',
        'We control that wall by applying a voltage, and which way we connect it matters a lot. Connecting the voltage in the helpful direction is called forward bias. Forward bias makes the depletion region narrower and lowers the wall until it almost collapses. With the wall down, a heavy flood of majority carriers pours across the junction. This is the easy direction.',
        'Connecting the voltage the other way is called reverse bias. Reverse bias does the opposite: it pulls carriers away from the junction, making the depletion region wider and the wall taller. Now almost nothing can cross. Only a tiny trickle of minority carriers leaks over, and we call this small unwanted current the leakage current.',
        'A working transistor uses both tricks at once. It holds one junction in forward bias so the crowd can flood in, and it holds the other junction in reverse bias. The reverse junction does an interesting job here: even though it blocks majority carriers, it readily sweeps onward any carriers that arrive at it from the base side, and it stops them from flowing backward. So one junction lets the crowd in, and the other sweeps the crowd onward in one direction only.',
        'In the mall picture, forward bias is a turnstile spun the easy way, so crowds flood through with no resistance. Reverse bias is a one-way door at the exit: it will only sweep people onward to the next hall and will never let them push back the way they came.',
      ],
      theoryHI: [
        'transistor current को कैसे control करता है यह समझने के लिए, पहले हमें एक अकेले PN junction को देखना होगा, क्योंकि अंदर इनमें से दो हैं। ठीक उस सीमा पर जहाँ p-type और n-type मिलते हैं, अपने आप कुछ होता है: जोड़ के पास के कुछ electrons और holes एक-दूसरे को ख़त्म कर देते हैं और पीछे एक पतला zone छोड़ जाते हैं जिसमें कोई free carrier नहीं होता। इस ख़ाली zone को depletion region कहते हैं (depleted मतलब ख़ाली हो गया)। इसमें बची fixed charges एक छोटी built-in barrier बनाती हैं, एक नीची दीवार की तरह जिसे carriers को पार करने के लिए चढ़ना पड़ता है।',
        'हम उस दीवार को voltage लगाकर control करते हैं, और इसे किस तरफ़ जोड़ें यह बहुत मायने रखता है। voltage को मददगार दिशा में जोड़ने को forward bias कहते हैं। forward bias depletion region को पतला कर देता है और दीवार को इतना नीचा कर देता है कि वह लगभग गिर जाती है। दीवार गिरते ही majority carriers की भारी बाढ़ junction के पार बह जाती है। यह आसान दिशा है।',
        'voltage को दूसरी तरफ़ जोड़ने को reverse bias कहते हैं। reverse bias उल्टा करता है: यह carriers को junction से दूर खींचता है, जिससे depletion region चौड़ा और दीवार ऊँची हो जाती है। अब लगभग कुछ भी पार नहीं हो सकता। सिर्फ़ minority carriers की एक छोटी trickle रिसती है, और इस छोटी अनचाही current को leakage current कहते हैं।',
        'एक चलता हुआ transistor दोनों तरकीबें एक साथ इस्तेमाल करता है। यह एक junction को forward bias में रखता है ताकि crowd अंदर बाढ़ की तरह आ सके, और दूसरे junction को reverse bias में। reverse junction यहाँ एक दिलचस्प काम करता है: भले ही यह majority carriers को रोकता है, पर base की तरफ़ से आने वाले carriers को यह आसानी से आगे sweep कर देता है, और उन्हें पीछे बहने से रोकता है। तो एक junction crowd को अंदर आने देता है, और दूसरा crowd को सिर्फ़ एक ही दिशा में आगे sweep करता है।',
        'mall की तस्वीर में, forward bias एक turnstile है जो आसान तरफ़ घुमाया गया है, तो crowd बिना रुकावट उससे होकर बाढ़ की तरह बहती है। reverse bias exit पर एक one-way door है: यह लोगों को सिर्फ़ अगले hall की ओर sweep करेगा और कभी वापस उसी रास्ते पीछे नहीं आने देगा।',
      ],
      transcriptEN:
        'Each junction has a little engine inside it called the depletion region - a thin zone swept clean of free carriers, left with fixed charge that behaves like a wall. When you forward bias the junction, that wall shrinks and collapses, and a heavy flood of majority carriers pours across. When you reverse bias it, the wall grows thicker and almost nothing gets through except a trickle of minority carriers, the leakage. A working transistor keeps the emitter-base junction forward so the crowd floods in, and the collector-base junction reverse so the crowd is swept onward and cannot push back.',
      transcriptHI:
        'हर junction के अंदर एक छोटा engine होता है जिसे depletion region कहते हैं - एक पतला zone जो free carriers से साफ़ कर दिया जाता है, बचती है fixed charge जो एक दीवार की तरह व्यवहार करती है। forward bias करने पर वह दीवार सिकुड़कर गिर जाती है और majority carriers की भारी बाढ़ पार आती है। reverse bias करने पर दीवार मोटी हो जाती है और leakage के अलावा कुछ पार नहीं होता।',
      visualNote:
        'Two stacked junction diagrams: forward-biased EBJ with a narrow depletion region and big majority-carrier arrow; reverse-biased CBJ with a wide depletion region and a thin leakage arrow.',
    },
    {
      id: 'S06_CarrierFlowKCL',
      label: "Carrier Flow & Kirchhoff's Current Law",
      kind: 'theory',
      subtitle: 'Ie = Ic + Ib, and almost all of it is Ic',
      theoryEN: [
        'Now let us follow the crowd from start to finish. The emitter injects a large current of carriers into the base. Because the base is so thin, about 98 to 99 percent of those carriers shoot straight across it and are caught by the collector. This large stream that reaches the collector is the collector current, written Ic. It is by far the biggest part of the flow.',
        'What about the rest? Only about 1 to 2 percent of the carriers do not make it across. A few recombine inside the base, and a few leave through the base wire. Together these form a very small current at the base terminal, called the base current Ib. It is so small that we usually measure it in microamps (millionths of an amp), while Ic and the emitter current are measured in the much larger milliamps.',
        "Now we apply a basic rule of circuits called Kirchhoff's Current Law. It simply says that whatever current flows into a junction of wires must equal whatever flows out; charge is never created or destroyed. For the transistor, the current entering at the emitter must equal the two currents leaving at the collector and base. In symbols this is Ie = Ic + Ib, where Ie is the emitter current. This single equation is true for the transistor in every situation.",
        'Because Ib is such a tiny sliver of the total, the collector current Ic is almost equal to the whole emitter current Ie. We give this near-equality a name. The fraction of the emitter current that successfully reaches the collector is called alpha, defined as alpha = Ic / Ie. Since Ic is almost all of Ie, alpha sits very close to one, usually around 0.98 to 0.99.',
        'In the mall picture, nearly the entire crowd that enters at the emitter streams all the way through to the receiving hall (the collector). Only a thin trickle peels off into the side corridor (the base). That is why the base current is so small compared to the collector current.',
      ],
      theoryHI: [
        'अब crowd का शुरू से आख़िर तक पीछा करते हैं। emitter carriers की एक बड़ी current base में inject करता है। base इतना पतला होने से, उन carriers का लगभग 98 से 99 प्रतिशत हिस्सा सीधे इसके पार निकल जाता है और collector पकड़ लेता है। collector तक पहुँचने वाली यह बड़ी धारा collector current है, जिसे Ic लिखते हैं। यह flow का अब तक का सबसे बड़ा हिस्सा है।',
        'बाक़ी का क्या? सिर्फ़ लगभग 1 से 2 प्रतिशत carriers ही पार नहीं पहुँचते। कुछ base के अंदर recombine हो जाते हैं, और कुछ base के तार से बाहर निकल जाते हैं। ये मिलकर base terminal पर एक बहुत छोटी current बनाते हैं, जिसे base current Ib कहते हैं। यह इतनी छोटी होती है कि हम इसे आमतौर पर microamps (एम्पीयर के दस लाखवें हिस्से) में नापते हैं, जबकि Ic और emitter current बहुत बड़ी milliamps में नापी जाती हैं।',
        "अब हम circuits का एक बुनियादी नियम लगाते हैं जिसे Kirchhoff's Current Law कहते हैं। यह बस इतना कहता है कि तारों के किसी जोड़ में जितनी current अंदर जाती है उतनी ही बाहर आनी चाहिए; charge न तो बनता है न मिटता है। transistor के लिए, emitter पर अंदर जाने वाली current, collector और base पर बाहर जाने वाली दो currents के बराबर होनी चाहिए। symbols में यह है Ie = Ic + Ib, जहाँ Ie emitter current है। यह एक equation transistor के लिए हर हालत में सच है।",
        'चूँकि Ib पूरे का इतना छोटा हिस्सा है, collector current Ic लगभग पूरी emitter current Ie के बराबर होती है। इस लगभग-बराबरी को हम एक नाम देते हैं। emitter current का वह हिस्सा जो सफलतापूर्वक collector तक पहुँचता है alpha कहलाता है, जिसे alpha = Ic / Ie से परिभाषित करते हैं। चूँकि Ic लगभग पूरा Ie है, alpha एक के बहुत क़रीब रहता है, आमतौर पर लगभग 0.98 से 0.99।',
        'mall की तस्वीर में, emitter पर घुसने वाली लगभग पूरी crowd पूरे रास्ते receiving hall (collector) तक बहती है। सिर्फ़ एक पतली trickle बग़ल के corridor (base) में मुड़ती है। इसीलिए base current, collector current के मुक़ाबले इतनी छोटी है।',
      ],
      transcriptEN:
        'Now follow the crowd. The emitter pushes in a large current, and because the base is so thin, roughly ninety-eight to ninety-nine percent of those carriers sail straight across and are caught by the collector. That is the collector current. Only one or two percent peel off into the base and leave through the base terminal as a tiny current, measured in microamps. Kirchhoff says current in equals current out, so the emitter current equals the collector current plus the base current. Since the base current is so small, the collector current is almost the entire emitter current, and the ratio alpha sits just under one.',
      transcriptHI:
        'अब crowd का पीछा कीजिए। emitter एक बड़ी current अंदर धकेलता है, और base इतना पतला होने से उन carriers का लगभग अट्ठानवे से निन्यानवे प्रतिशत सीधे पार निकल जाता है और collector पकड़ लेता है। यही collector current है। सिर्फ़ एक या दो प्रतिशत base में मुड़कर base terminal से एक छोटी current के रूप में निकलते हैं। Kirchhoff कहता है अंदर की current बराबर बाहर की current, तो Ie = Ic + Ib।',
      visualNote:
        'An NPN symbol with a big shaded E->C arrow labelled Ic and a thin branch from the base labelled Ib; banner Ie = Ic + Ib, noting Ib is microamps while Ic and Ie are milliamps.',
    },
    {
      id: 'S07_ThreeRegions',
      label: 'The Three Operating Regions',
      kind: 'theory',
      subtitle: 'Active amplifies, saturation and cut-off switch',
      theoryEN: [
        'A transistor has two junctions, and each one can be either forward biased or reverse biased. That gives a few possible combinations, and three of them are genuinely useful. We call these three the operating regions, and which one the transistor is in is decided entirely by how we bias its two junctions.',
        'The first and most important region is the active region. Here the emitter-base junction is forward biased and the collector-base junction is reverse biased. This is the combination we built up over the last few pages, and it turns the device into a clean, linear amplifier. In this region the collector current faithfully follows the base current through the simple relation Ic = beta times Ib, where beta is the amplification factor we will meet next.',
        'The second region is saturation, where both junctions are forward biased. Now the transistor is turned fully on, like a switch that has been pressed firmly closed. Current flows freely, it reaches its maximum value, and the voltage across the device from collector to emitter (written Vce) drops down near zero. The transistor has stopped amplifying and is now just acting as a closed switch.',
        'The third region is cut-off, where both junctions are reverse biased. Now both doors are shut, the transistor is turned fully off like an open switch, and essentially no collector current flows at all. Saturation means ON and cut-off means OFF, which is exactly the behaviour digital logic circuits need.',
        'So there are really two jobs a transistor can do. To amplify a signal, we keep it in the active region. To act as a digital switch, we flip it back and forth between saturation (fully on) and cut-off (fully off). In the mall picture, active means the doors are set to gently steer the crowd, saturation means both doors are jammed wide open, and cut-off means both doors are locked shut.',
      ],
      theoryHI: [
        'एक transistor में दो junctions होते हैं, और हर एक या तो forward biased हो सकता है या reverse biased। इससे कुछ संभव combinations बनते हैं, और इनमें से तीन सचमुच काम के हैं। इन तीनों को हम operating regions कहते हैं, और transistor किसमें है यह पूरी तरह इस बात से तय होता है कि हम इसके दोनों junctions को कैसे bias करते हैं।',
        'पहला और सबसे ज़रूरी region है active region। यहाँ emitter-base junction forward biased और collector-base junction reverse biased होता है। यही वह combination है जो हमने पिछले कुछ pages में बनाया, और यह device को एक साफ़, linear amplifier बना देता है। इस region में collector current ईमानदारी से base current के पीछे चलती है, सरल संबंध Ic = beta गुना Ib के ज़रिए, जहाँ beta वह amplification factor है जिससे हम अगली बार मिलेंगे।',
        'दूसरा region है saturation, जहाँ दोनों junctions forward biased होते हैं। अब transistor पूरी तरह on हो जाता है, उस switch की तरह जिसे मज़बूती से दबाकर बंद (closed) कर दिया गया हो। current खुलकर बहती है, अपने maximum तक पहुँचती है, और device के आर-पार collector से emitter तक का voltage (जिसे Vce लिखते हैं) गिरकर लगभग zero हो जाता है। transistor अब amplify करना बंद करके सिर्फ़ एक closed switch की तरह काम कर रहा है।',
        'तीसरा region है cut-off, जहाँ दोनों junctions reverse biased होते हैं। अब दोनों दरवाज़े बंद हैं, transistor एक open switch की तरह पूरी तरह off हो जाता है, और लगभग कोई collector current बहती ही नहीं। saturation का मतलब ON और cut-off का मतलब OFF, जो ठीक वही behaviour है जो digital logic circuits को चाहिए।',
        'तो transistor असल में दो काम कर सकता है। किसी signal को amplify करने के लिए हम इसे active region में रखते हैं। एक digital switch की तरह काम करने के लिए हम इसे saturation (पूरा on) और cut-off (पूरा off) के बीच आगे-पीछे flip करते हैं। mall की तस्वीर में, active मतलब दरवाज़े crowd को हल्के से steer करने के लिए set हैं, saturation मतलब दोनों दरवाज़े पूरे खुले jam हैं, और cut-off मतलब दोनों दरवाज़े locked बंद हैं।',
      ],
      transcriptEN:
        'A transistor has three useful moods, set entirely by how the two junctions are biased. In the active region the emitter-base junction is forward and the collector-base junction is reverse, and the device becomes a clean amplifier where the collector current follows the base current. In saturation both junctions are forward, the transistor slams fully on like a closed switch, and the collector-emitter voltage drops near zero. In cut-off both junctions are reverse, the device shuts off like an open switch, and almost no current flows. Amplifiers stay in active; digital logic just snaps between saturation and cut-off.',
      transcriptHI:
        'एक transistor के तीन काम के mood होते हैं, जो पूरी तरह इस बात से तय होते हैं कि दोनों junctions कैसे biased हैं। active region में emitter-base junction forward और collector-base junction reverse होता है, और device एक साफ़ amplifier बन जाता है। saturation में दोनों junctions forward होते हैं, transistor closed switch की तरह पूरा on हो जाता है। cut-off में दोनों junctions reverse होते हैं, device open switch की तरह बंद हो जाता है।',
      visualNote:
        'A 3-row matrix: Active / Saturation / Cut-off vs Base-Emitter bias, Base-Collector bias, Application (Linear amplifier / Closed switch / Open switch).',
    },
    {
      id: 'S08_OutputCurves',
      label: 'Output Characteristics: Ic vs Vce',
      kind: 'theory',
      subtitle: 'A fan of flat curves - the operating map',
      theoryEN: [
        'There is one graph that ties everything in this module together, and it is called the output characteristic. To make it, we put the collector current Ic up the vertical axis and the collector-to-emitter voltage Vce along the horizontal axis. Then we pick a fixed base current Ib, sweep the voltage, and trace out one curve. Repeating this for several values of Ib gives a whole family, or fan, of curves stacked one above the other. This single picture is the operating map of the device.',
        'Look first at the wide, flat middle of the graph. This is the active region. Notice that as you move right (increasing Vce) the curve stays almost perfectly horizontal. That flatness is telling you something important: the collector current barely changes when the voltage changes. Instead, Ic is set by the base current Ib. This is exactly the linear, well-behaved amplifier we want.',
        'Now look at the steep left edge of the graph, very close to Vce equal to zero. Here the curves shoot upward sharply. This is the saturation region. The transistor has lost its grip on the current, and how much flows is now limited only by the resistors connected outside the device, not by the transistor itself.',
        'Finally look along the very bottom of the graph, where the base current Ib is zero. This is the cut-off region. The collector current has dropped almost to nothing. The only current that remains is the tiny leakage we met earlier, here given the special name Iceo (the reverse-saturation leakage that flows even with no base current).',
        'The most satisfying thing about this graph is what happens when you step the base current up. Each curve belongs to one value of Ib, and increasing Ib lifts the whole curve higher up the page. You can literally see the base current commanding the collector current. That visible lifting is current control made into a picture.',
      ],
      theoryHI: [
        'इस module की हर चीज़ को जोड़ने वाला एक graph है, जिसे output characteristic कहते हैं। इसे बनाने के लिए हम collector current Ic को ऊर्ध्वाधर (vertical) axis पर और collector से emitter तक का voltage Vce को क्षैतिज (horizontal) axis पर रखते हैं। फिर हम एक fixed base current Ib चुनते हैं, voltage को घुमाते हैं, और एक curve खींच लेते हैं। Ib के कई values के लिए यही दोहराने पर curves का एक पूरा परिवार, या पंखा, एक के ऊपर एक मिलता है। यह एक तस्वीर device का operating map है।',
        'पहले graph के चौड़े, flat बीच को देखिए। यह active region है। ध्यान दीजिए कि जैसे-जैसे आप दाईं ओर बढ़ते हैं (Vce बढ़ाते हैं) curve लगभग बिल्कुल horizontal रहती है। यह flatness एक ज़रूरी बात बता रही है: voltage बदलने पर collector current मुश्किल से बदलती है। बजाय इसके, Ic को base current Ib तय करता है। यही वह linear, अच्छे ढंग से चलने वाला amplifier है जो हमें चाहिए।',
        'अब graph के बाएँ steep किनारे को देखिए, Vce के zero के बहुत क़रीब। यहाँ curves तेज़ी से ऊपर की ओर भागती हैं। यह saturation region है। transistor की current पर पकड़ छूट गई है, और कितनी बहती है यह अब सिर्फ़ device के बाहर जुड़े resistors से limited होता है, ख़ुद transistor से नहीं।',
        'आख़िर में graph के बिल्कुल नीचे देखिए, जहाँ base current Ib zero है। यह cut-off region है। collector current गिरकर लगभग शून्य हो गई है। जो current बचती है वही छोटी leakage है जिससे हम पहले मिले थे, यहाँ इसे ख़ास नाम Iceo दिया गया है (वह reverse-saturation leakage जो base current न होने पर भी बहती है)।',
        'इस graph की सबसे संतोषजनक बात तब दिखती है जब आप base current बढ़ाते हैं। हर curve Ib के एक value की है, और Ib बढ़ाने पर पूरी curve page पर ऊपर उठ जाती है। आप शब्दशः base current को collector current पर हुक्म चलाते देख सकते हैं। यह दिखने वाला उठना ही current control की तस्वीर है।',
      ],
      transcriptEN:
        'Here is the map that ties it all together. Plot collector current on the vertical axis and collector-emitter voltage on the horizontal axis, and draw one curve for each fixed base current. You get a fan of nearly flat lines. The flat middle is the active region: notice the collector current barely changes as you increase the voltage, because it is set by the base current, not the voltage. Near the left edge the curves shoot up steeply - that is saturation. Along the bottom, with zero base current, only a whisper of leakage flows - that is cut-off. Step the base current up and the whole curve lifts, which is current control made visible.',
      transcriptHI:
        'यह रहा वह map जो सब कुछ जोड़ता है। vertical axis पर collector current और horizontal axis पर collector-emitter voltage plot कीजिए, और हर fixed base current के लिए एक curve खींचिए। आपको लगभग flat lines का पंखा मिलता है। flat बीच active region है: collector current voltage बढ़ाने पर मुश्किल से बदलता है क्योंकि उसे base current तय करता है। बाएँ किनारे पर curves तेज़ी से ऊपर जाती हैं - वही saturation है।',
      visualNote:
        'An Ic vs Vce graph: a family of flat curves stacked by increasing Ib; left band Saturation, large centre Active, bottom strip Cut-off (Ib=0, Ic=Iceo).',
    },
    {
      id: 'S09_AlphaBeta',
      label: 'Amplification Factors: Alpha & Beta',
      kind: 'theory',
      subtitle: 'beta = Ic/Ib, alpha = Ic/Ie, and how they link',
      theoryEN: [
        'We measure how good a transistor is at amplifying using two numbers, alpha and beta. The more useful of the two is beta (sometimes written as the Greek letter or just called the current gain). Beta is simply the collector current divided by the base current: beta = Ic / Ib. For real transistors beta is usually somewhere between 50 and over 400. A beta of 100, for example, means the collector current is 100 times the base current.',
        'The second number is alpha, which we already met. Alpha is the collector current divided by the emitter current: alpha = Ic / Ie. Because almost all of the emitter current reaches the collector, alpha is always just a little less than one, typically about 0.99. Alpha can never reach one exactly, because some current always peels off into the base.',
        'Alpha and beta are two views of the same device, so they must be linked, and they are. You can convert between them with two formulas: beta = alpha / (1 - alpha) and alpha = beta / (beta + 1). We will work through where these come from on the synthesis page, deriving every step. For now, notice the key behaviour: as alpha creeps closer and closer to one, the bottom of the beta formula (1 - alpha) gets tiny, and so beta shoots up to very large values.',
        'This is the whole point of the device in one line. A high beta means that a featherweight base current is controlling a heavyweight collector current. A few microamps in at the base produce a few milliamps out at the collector. That multiplication is exactly what we mean by amplification.',
        'In the mall picture, beta answers a simple question: for every single shopper who turns off into the side corridor, how many shoppers make it all the way through to the receiving hall? If beta is 100, then one shopper in the corridor corresponds to a hundred shoppers reaching the hall.',
      ],
      theoryHI: [
        'एक transistor amplify करने में कितना अच्छा है यह हम दो numbers, alpha और beta, से नापते हैं। इन दोनों में ज़्यादा काम का है beta (इसे current gain भी कहते हैं)। beta बस collector current बँटा base current है: beta = Ic / Ib। असली transistors में beta आमतौर पर 50 से 400 के ऊपर के बीच होता है। मिसाल के लिए beta का 100 होना मतलब collector current, base current की 100 गुना है।',
        'दूसरा number alpha है, जिससे हम पहले मिल चुके हैं। alpha collector current बँटा emitter current है: alpha = Ic / Ie। चूँकि लगभग पूरी emitter current collector तक पहुँचती है, alpha हमेशा एक से थोड़ा ही कम होता है, आमतौर पर लगभग 0.99। alpha कभी ठीक एक तक नहीं पहुँच सकता, क्योंकि कुछ current हमेशा base में मुड़ जाती है।',
        'alpha और beta एक ही device के दो नज़रिए हैं, इसलिए इन्हें जुड़ा होना ही चाहिए, और ये जुड़े हैं। आप इनके बीच दो formulas से बदल सकते हैं: beta = alpha / (1 - alpha) और alpha = beta / (beta + 1)। ये कहाँ से आते हैं यह हम synthesis वाले page पर हर step के साथ निकालेंगे। फ़िलहाल मुख्य behaviour पर ध्यान दीजिए: जैसे-जैसे alpha एक के और क़रीब रेंगता है, beta वाले formula का निचला हिस्सा (1 - alpha) बहुत छोटा हो जाता है, और इसलिए beta बहुत बड़े values तक उछल जाता है।',
        'यही पूरे device की बात एक लाइन में है। ऊँचा beta मतलब एक हल्की-फुल्की base current एक भारी collector current को control कर रही है। base पर कुछ microamps अंदर, collector पर कुछ milliamps बाहर पैदा कर देते हैं। यही गुणा (multiplication) ही वह चीज़ है जिसे हम amplification कहते हैं।',
        'mall की तस्वीर में, beta एक सरल सवाल का जवाब देता है: बग़ल के corridor में मुड़ने वाले हर एक shopper के बदले, कितने shoppers पूरे रास्ते receiving hall तक पहुँचते हैं? अगर beta 100 है, तो corridor में एक shopper के बराबर सौ shoppers hall तक पहुँचते हैं।',
      ],
      transcriptEN:
        'Two numbers measure the gain. Beta is the common-emitter current gain: collector current divided by base current. A typical transistor has a beta of fifty to a few hundred, which means a base current of a few microamps can command a collector current of a few milliamps. Alpha is the common-base gain: collector current divided by emitter current. Because nearly all the emitter current is collected, alpha sits just under one, around point nine nine. The two are tied together: beta equals alpha over one minus alpha, and alpha equals beta over beta plus one. As alpha creeps toward one, beta explodes.',
      transcriptHI:
        'gain को दो numbers नापते हैं। beta common-emitter current gain है: collector current बँटा base current। एक typical transistor का beta पचास से कुछ सौ होता है, यानी कुछ microamps की base current कुछ milliamps की collector current चला सकती है। alpha common-base gain है: collector current बँटा emitter current, जो 1 से थोड़ा कम, लगभग point nine nine रहता है। दोनों जुड़े हैं: beta = alpha/(1-alpha) और alpha = beta/(beta+1)।',
      visualNote:
        'Large beta = Ic/Ib centred with a callout (DC gain 50-400); a boxed alpha = Ic/Ie noting alpha approaches unity; coupled alpha<->beta slider proving beta = alpha/(1-alpha).',
    },
    {
      id: 'S10_Synthesis',
      label: 'Synthesis: Why Amplification Is Inevitable',
      kind: 'theory',
      subtitle: 'Geometry + biasing + charge conservation',
      theoryEN: [
        'Now let us step back and put all the pieces together, because once you see them lined up, amplification stops looking like magic and starts looking unavoidable. There are three reasons it has to happen, and they reinforce one another.',
        'The first reason is the physical shape, the geometry. The base is made so thin and so lightly doped, with that roughly 150 to 1 ratio, that the carriers injected into it simply have nowhere to recombine. They cannot disappear inside the base, so they have no choice but to keep moving onward to the collector.',
        'The second reason is the biasing, how we connect the voltages. The forward-biased emitter-base junction injects the flood of carriers in the first place, and the reverse-biased collector-base junction does not block them. Instead it eagerly sweeps every carrier that reaches it across into the collector and keeps the flow moving in one direction only.',
        'The third reason is the mathematics, and it follows directly from charge conservation. Because only a tiny fraction of carriers can escape sideways through the narrow base terminal, the rest are forced to pour out at the collector. A small base current therefore forces a proportionally huge collector current, and the ratio between them is exactly beta = Ic / Ib. The worked algebra for the alpha-beta relationship is shown step by step in the proof below this text.',
        'So amplification is not a trick. It is geometry, biasing, and conservation of charge all agreeing with each other at once. In the mall picture: a corridor too thin to absorb the crowd, combined with one-way doors, means that a tiny trickle through the turnstile cannot help but steer a massive flow through the whole mall.',
      ],
      theoryHI: [
        'अब थोड़ा पीछे हटकर सारे टुकड़े जोड़ते हैं, क्योंकि जैसे ही आप इन्हें क़तार में देखेंगे, amplification जादू जैसा दिखना बंद होकर अनिवार्य दिखने लगता है। यह होने के तीन कारण हैं, और ये एक-दूसरे को मज़बूत करते हैं।',
        'पहला कारण है physical shape, यानी geometry। base को इतना पतला और इतना lightly doped बनाया जाता है, उस लगभग 150 से 1 के ratio के साथ, कि उसमें inject हुए carriers के पास recombine होने की कोई जगह ही नहीं होती। वे base के अंदर ग़ायब नहीं हो सकते, इसलिए उनके पास collector की ओर आगे बढ़ते रहने के सिवा कोई चारा नहीं।',
        'दूसरा कारण है biasing, यानी हम voltages कैसे जोड़ते हैं। forward-biased emitter-base junction सबसे पहले carriers की बाढ़ inject करता है, और reverse-biased collector-base junction उन्हें रोकता नहीं। बजाय इसके, जो भी carrier इस तक पहुँचता है उसे यह बेताबी से collector में sweep कर देता है और flow को सिर्फ़ एक ही दिशा में चलाता रहता है।',
        'तीसरा कारण है mathematics, और यह सीधे charge conservation से निकलता है। चूँकि carriers का सिर्फ़ एक छोटा हिस्सा ही पतले base terminal से बग़ल में निकल सकता है, बाक़ी सब को collector पर बहना पड़ता है। इसलिए एक छोटी base current एक proportionally बहुत बड़ी collector current को मजबूर कर देती है, और इनके बीच का ratio ठीक beta = Ic / Ib है। alpha-beta संबंध का पूरा algebra इस text के नीचे दिए proof में step दर step दिखाया गया है।',
        'तो amplification कोई trick नहीं है। यह geometry, biasing और charge का conservation एक साथ एक-दूसरे से सहमत होना है। mall की तस्वीर में: एक corridor जो crowd सोखने के लिए बहुत पतला है, साथ में one-way दरवाज़े, मतलब turnstile से गुज़रती एक छोटी trickle पूरे mall में एक विशाल flow को steer किए बिना रह ही नहीं सकती।',
      ],
      transcriptEN:
        'Step back and the whole thing becomes inevitable. First, the geometry: the base is so thin and so lightly doped that the injected carriers simply cannot recombine in time - they have to keep going. Second, the biasing: the forward emitter-base junction floods carriers in, and the reverse collector-base junction sweeps them across into the collector. Third, the maths: because so few carriers can escape through the narrow base terminal, the only place the rest can go is the collector, and that forces a large collector current for a tiny base current. Beta equals collector over base. Amplification is not a trick; it is geometry, biasing, and conservation of charge agreeing with each other.',
      transcriptHI:
        'थोड़ा पीछे हटिए तो पूरी बात inevitable हो जाती है। पहला, geometry: base इतना पतला और इतना lightly doped है कि injected carriers समय रहते recombine ही नहीं कर सकते - उन्हें आगे जाते रहना है। दूसरा, biasing: forward emitter-base junction carriers को अंदर बाढ़ की तरह भरता है, और reverse collector-base junction उन्हें collector में sweep कर देता है। तीसरा, maths: इसलिए beta = Ic/Ib। amplification कोई trick नहीं, geometry, biasing और charge का conservation है।',
      visualNote:
        'A three-panel synthesis: thin-base geometry (Physical Constraint), a bottleneck funnel of carriers (Operational Biasing), and beta = Ic/Ib (Mathematical Inevitability), chained by arrows. Walk the KCL/alpha-beta proof here.',
    },
    {
      id: 'S11_Flashcards',
      label: 'Flashcards - Lock It In',
      kind: 'flashcards',
      subtitle: 'Eight cards: structure, junctions, gain',
      theoryEN: [
        'These flashcards are a quick way to lock the main ideas into your memory. Each card shows a term on the front, and when you flip it over, the back gives a plain-language explanation.',
        'The eight cards together cover everything we built: why the base is so thin, what the word bipolar really means, the two gain numbers alpha and beta, how the junctions are biased in the active region, the difference between saturation and cut-off, how forward and reverse bias change the depletion region, and how to tell NPN and PNP apart.',
        'Here is the best way to use them. Before you flip a card, try to say the answer out loud in your own words. If you can explain the back without looking, you have genuinely understood it, and that is what real learning feels like.',
      ],
      theoryHI: [
        'ये flashcards मुख्य विचारों को अपनी याददाश्त में बैठाने का एक तेज़ तरीक़ा हैं। हर card सामने एक term दिखाता है, और पलटने पर पीछे एक सीधी-सादी व्याख्या मिलती है।',
        'आठों cards मिलकर वह सब cover करते हैं जो हमने बनाया: base इतना पतला क्यों है, bipolar शब्द का असल मतलब, दो gain numbers alpha और beta, active region में junctions कैसे biased होते हैं, saturation और cut-off का फर्क, forward और reverse bias depletion region को कैसे बदलते हैं, और NPN तथा PNP को कैसे पहचानें।',
        'इन्हें इस्तेमाल करने का सबसे अच्छा तरीक़ा यह है। किसी card को पलटने से पहले, जवाब अपने शब्दों में ज़ोर से बोलने की कोशिश कीजिए। अगर आप बिना देखे पीछे वाली बात समझा सकते हैं, तो आपने सचमुच समझ लिया है, और असली सीखना यही महसूस होता है।',
      ],
      transcriptEN:
        'Eight cards to lock the big ideas into memory. Cover the back, read the term, and say the explanation out loud before you flip. If you can teach the back in your own words, you own it.',
      transcriptHI:
        'बड़े विचारों को याददाश्त में बैठाने के लिए आठ cards। पीछे का हिस्सा ढक दें, term पढ़ें, और पलटने से पहले व्याख्या ज़ोर से बोलें।',
      visualNote: 'Watermarked shareable flip-card deck; front shows the bold term, back shows the explanation.',
    },
    {
      id: 'S12_Quiz',
      label: 'Quiz - Test the Build',
      kind: 'quiz',
      subtitle: 'Eight questions on structure, bias, and gain',
      theoryEN: [
        'Now it is time to test what you have built. There are eight multiple-choice questions ahead, and each one checks either how the BJT is put together (its structure) or how it behaves when you connect it up (its operation).',
        'Take your time and read all four options every time, even the ones that look obviously wrong. The wrong answers are not random; they are the exact misunderstandings that students most often fall into, and this whole module was written to clear them up.',
        'After you answer each question, a short explanation appears telling you why the right answer is right. So even if you pick the wrong one, you still walk away having learned something.',
      ],
      theoryHI: [
        'अब वक़्त है जो आपने बनाया उसे जाँचने का। आगे आठ multiple-choice सवाल हैं, और हर एक या तो यह जाँचता है कि BJT कैसे बना है (इसका structure) या जोड़ने पर यह कैसा व्यवहार करता है (इसका operation)।',
        'समय लीजिए और हर बार चारों options पढ़िए, वे भी जो साफ़ ग़लत लगते हैं। ग़लत जवाब बेतरतीब नहीं हैं; ये ठीक वही ग़लतफ़हमियाँ हैं जिनमें students अक्सर फँसते हैं, और यह पूरा module उन्हीं को दूर करने के लिए लिखा गया है।',
        'हर सवाल का जवाब देने के बाद एक छोटी explanation आती है जो बताती है कि सही जवाब सही क्यों है। तो अगर आप ग़लत भी चुनें, फिर भी आप कुछ सीखकर आगे बढ़ते हैं।',
      ],
      transcriptEN:
        'Eight quick questions. Some test the construction, some test the operation. Read all four options each time - the wrong answers are exactly the traps students fall into.',
      transcriptHI:
        'आठ तेज़ सवाल। कुछ construction जाँचते हैं, कुछ operation। हर बार चारों options पढ़ें - ग़लत जवाब ठीक वही जाल हैं जिनमें students फँसते हैं।',
      visualNote: 'QuizArena with eight problems; show running score and reveal explanation on answer.',
    },
    {
      id: 'S13_Recap',
      label: 'Recap - The Mall in One Page',
      kind: 'recap',
      subtitle: 'Everything that makes the tiny base control the crowd',
      theoryEN: [
        'Let us gather the whole Silicon Shopping Mall onto one page. The structure has three regions: the emitter is heavily doped and injects the crowd of carriers, the base is thin and lightly doped so the crowd streams straight through it, and the collector is wide and receives them all. Between these regions sit the two junctions, the emitter-base junction (EBJ) and the collector-base junction (CBJ).',
        'The accounting rule never changes: Ie = Ic + Ib, because charge is always conserved. Since the base current Ib is only a tiny sliver of the total, the collector current Ic is almost the whole emitter current, which means alpha = Ic / Ie sits just under one (around 0.99).',
        'The amplification itself is captured by beta, the current gain, defined as beta = Ic / Ib and usually 50 to 400 or more. Alpha and beta are two views of the same device, tied together by beta = alpha / (1 - alpha) and, the other way round, alpha = beta / (beta + 1).',
        'The transistor has three operating regions, set by how we bias the two junctions. In the active region (EBJ forward, CBJ reverse) it amplifies. In saturation (both junctions forward) it acts as a closed switch, fully on. In cut-off (both junctions reverse) it acts as an open switch, fully off.',
        'Finally, the output map ties it all together: the flat Ic-versus-Vce curves in the active region are the visible proof that the collector current is set by the base current and barely by the voltage. That is amplification you can see. Next on the track we will learn DC biasing, which is the art of choosing the right resting point, called the Q-point, so the transistor sits comfortably in its active region.',
      ],
      theoryHI: [
        'पूरे Silicon Shopping Mall को एक page पर समेटते हैं। structure में तीन regions हैं: emitter भारी doped है और carriers की crowd inject करता है, base पतला और lightly doped है ताकि crowd सीधे इसमें से बह जाए, और collector चौड़ा है और उन सबको receive करता है। इन regions के बीच दो junctions बैठते हैं, emitter-base junction (EBJ) और collector-base junction (CBJ)।',
        'हिसाब का नियम कभी नहीं बदलता: Ie = Ic + Ib, क्योंकि charge हमेशा conserve होता है। चूँकि base current Ib पूरे का सिर्फ़ एक छोटा हिस्सा है, collector current Ic लगभग पूरी emitter current है, यानी alpha = Ic / Ie एक से थोड़ा ही कम (लगभग 0.99) रहता है।',
        'amplification ख़ुद beta में पकड़ी जाती है, यानी current gain, जिसे beta = Ic / Ib से परिभाषित करते हैं और जो आमतौर पर 50 से 400 या उससे ज़्यादा होता है। alpha और beta एक ही device के दो नज़रिए हैं, जो beta = alpha / (1 - alpha) और उल्टी तरफ़ alpha = beta / (beta + 1) से जुड़े हैं।',
        'transistor के तीन operating regions हैं, जो इस बात से तय होते हैं कि हम दोनों junctions को कैसे bias करते हैं। active region में (EBJ forward, CBJ reverse) यह amplify करता है। saturation में (दोनों junctions forward) यह एक closed switch की तरह, पूरा on। cut-off में (दोनों junctions reverse) यह एक open switch की तरह, पूरा off।',
        'आख़िर में, output map सब कुछ जोड़ देता है: active region में flat Ic-बनाम-Vce curves यह दिखता हुआ प्रमाण हैं कि collector current को base current तय करती है, voltage मुश्किल से। यह वह amplification है जिसे आप देख सकते हैं। track पर आगे हम DC biasing सीखेंगे, जो सही विश्राम बिंदु (Q-point) चुनने की कला है, ताकि transistor आराम से अपने active region में बैठा रहे।',
      ],
      transcriptEN:
        'Let us pull the whole mall onto one page. The emitter is heavily doped and injects the crowd; the base is thin and lightly doped so the crowd streams through; the collector is wide and receives them. Charge is conserved, so the emitter current equals the collector plus base current, and because the base current is tiny, alpha sits just under one. The current gain beta is collector over base, fifty to several hundred, and it links to alpha by beta equals alpha over one minus alpha. Bias the junctions one way and you amplify in the active region; bias them both forward or both reverse and you get a switch. The flat output curves are the proof that the base, not the voltage, is in charge. Next, we learn to set the operating point.',
      transcriptHI:
        'पूरे mall को एक page पर समेटते हैं। emitter भारी doped है और crowd inject करता है; base पतला और lightly doped है तो crowd streamकरके निकलती है; collector चौड़ा है और उन्हें receive करता है। charge conserve होता है, तो Ie = Ic + Ib, और Ib छोटा होने से alpha 1 से थोड़ा कम रहता है। current gain beta = Ic/Ib, पचास से कई सौ। आगे हम operating point set करना सीखेंगे।',
      visualNote:
        'One-page cheat grid: Structure / Conservation / Gain / Regions / Output map, plus a Sources list of the proof references and a footer linking forward to DC biasing.',
    },
  ],
  flashcards: [
    {
      frontEN: 'Why is the base made thin and lightly doped?',
      backEN:
        'So most carriers injected from the emitter pass straight through to the collector instead of recombining - this is what enables high gain.',
      frontHI: 'Base को पतला और lightly doped क्यों बनाते हैं?',
      backHI:
        'ताकि emitter से inject हुए ज़्यादातर carriers recombine होने के बजाय सीधे collector तक पहुँच जाएँ - यही high gain को संभव बनाता है।',
    },
    {
      frontEN: "What does 'bipolar' in BJT mean?",
      backEN: 'Current is carried by BOTH electrons and holes (two carrier types), unlike unipolar FETs that use only one.',
      frontHI: "BJT में 'bipolar' का क्या मतलब है?",
      backHI: 'current दोनों - electrons और holes (दो carrier types) - से ले जाई जाती है, उन unipolar FETs के विपरीत जो सिर्फ़ एक इस्तेमाल करते हैं।',
    },
    {
      frontEN: 'Alpha (common-base gain)',
      backEN: 'alpha = Ic/Ie, the fraction of emitter current that reaches the collector; always just under 1 (about 0.99).',
      frontHI: 'Alpha (common-base gain)',
      backHI: 'alpha = Ic/Ie, emitter current का वह हिस्सा जो collector तक पहुँचता है; हमेशा 1 से थोड़ा कम (लगभग 0.99)।',
    },
    {
      frontEN: 'Beta (common-emitter gain)',
      backEN: 'beta = Ic/Ib, the DC current gain; typically 50 to over 400. A tiny Ib controls a large Ic.',
      frontHI: 'Beta (common-emitter gain)',
      backHI: 'beta = Ic/Ib, DC current gain; आमतौर पर 50 से 400 के ऊपर। एक छोटी Ib एक बड़ी Ic को control करती है।',
    },
    {
      frontEN: 'Active-region junction biasing',
      backEN: 'Emitter-base junction FORWARD, collector-base junction REVERSE -> the device is a linear amplifier with Ic = beta*Ib.',
      frontHI: 'Active-region junction biasing',
      backHI: 'Emitter-base junction FORWARD, collector-base junction REVERSE -> device एक linear amplifier है जिसमें Ic = beta*Ib।',
    },
    {
      frontEN: 'Saturation vs Cut-off as switches',
      backEN:
        'Saturation (both junctions forward) = closed switch / logic ON, Vce near 0. Cut-off (both reverse) = open switch / logic OFF, Ic near 0.',
      frontHI: 'Saturation बनाम Cut-off switches के रूप में',
      backHI:
        'Saturation (दोनों junctions forward) = closed switch / logic ON, Vce लगभग 0। Cut-off (दोनों reverse) = open switch / logic OFF, Ic लगभग 0।',
    },
    {
      frontEN: 'Effect of forward vs reverse bias on the depletion region',
      backEN: 'Forward bias NARROWS it (heavy majority-carrier flow); reverse bias WIDENS it (only a tiny minority-carrier leakage).',
      frontHI: 'depletion region पर forward बनाम reverse bias का असर',
      backHI: 'Forward bias इसे SANKRA करता है (भारी majority-carrier flow); reverse bias इसे CHAUDA करता है (सिर्फ़ छोटी minority-carrier leakage)।',
    },
    {
      frontEN: 'NPN vs PNP symbol & carriers',
      backEN: 'NPN: arrow OUT of emitter, majority carriers = electrons. PNP: arrow INTO emitter, majority carriers = holes.',
      frontHI: 'NPN बनाम PNP symbol और carriers',
      backHI: 'NPN: arrow emitter से BAHAR, majority carriers = electrons। PNP: arrow emitter में ANDAR, majority carriers = holes।',
    },
  ],
  quiz: [
    {
      questionEN: 'In a BJT, which region is made extraordinarily thin and lightly doped?',
      questionHI: 'एक BJT में कौन सा region असाधारण रूप से पतला और lightly doped बनाया जाता है?',
      options: ['Emitter', 'Base', 'Collector', 'All three equally'],
      answerIndex: 1,
      explainEN: 'The base is thin and lightly doped so most injected carriers pass through to the collector without recombining - the source of high gain.',
      explainHI: 'base पतला और lightly doped होता है ताकि ज़्यादातर injected carriers बिना recombine हुए collector तक पहुँच जाएँ - यही high gain का स्रोत है।',
    },
    {
      questionEN: "Kirchhoff's Current Law for a BJT gives which relationship?",
      questionHI: 'एक BJT के लिए Kirchhoff का Current Law कौन सा relationship देता है?',
      options: ['Ic = Ie + Ib', 'Ie = Ic + Ib', 'Ib = Ic + Ie', 'Ie = Ic - Ib'],
      answerIndex: 1,
      explainEN: 'Current in equals current out: the emitter current is the sum of the collector and base currents, Ie = Ic + Ib.',
      explainHI: 'अंदर की current बराबर बाहर की current: emitter current, collector और base currents का योग है, Ie = Ic + Ib।',
    },
    {
      questionEN: 'For active-region amplification, how are the two junctions biased?',
      questionHI: 'active-region amplification के लिए दोनों junctions कैसे biased होते हैं?',
      options: ['EBJ reverse, CBJ forward', 'Both forward', 'EBJ forward, CBJ reverse', 'Both reverse'],
      answerIndex: 2,
      explainEN: 'Active mode requires the emitter-base junction forward-biased and the collector-base junction reverse-biased, giving Ic = beta*Ib.',
      explainHI: 'active mode के लिए emitter-base junction forward-biased और collector-base junction reverse-biased चाहिए, जिससे Ic = beta*Ib मिलता है।',
    },
    {
      questionEN: 'A transistor with both junctions forward-biased is in which region?',
      questionHI: 'जिस transistor के दोनों junctions forward-biased हों वह कौन से region में है?',
      options: ['Active', 'Saturation', 'Cut-off', 'Breakdown'],
      answerIndex: 1,
      explainEN: 'Both junctions forward = saturation, behaving as a closed switch (logic ON) with Vce near zero.',
      explainHI: 'दोनों junctions forward = saturation, जो एक closed switch (logic ON) की तरह Vce लगभग zero पर व्यवहार करता है।',
    },
    {
      questionEN: 'If beta = 100 and Ib = 20 microamps, what is Ic?',
      questionHI: 'अगर beta = 100 और Ib = 20 microamps हो, तो Ic क्या है?',
      options: ['2 mA', '0.2 mA', '20 mA', '5 mA'],
      answerIndex: 0,
      explainEN: 'Ic = beta*Ib = 100 * 20 uA = 2000 uA = 2 mA.',
      explainHI: 'Ic = beta*Ib = 100 * 20 uA = 2000 uA = 2 mA।',
    },
    {
      questionEN: 'Which expression correctly converts alpha to beta?',
      questionHI: 'कौन सा expression alpha को beta में सही बदलता है?',
      options: ['beta = (1-alpha)/alpha', 'beta = alpha/(1-alpha)', 'beta = alpha*(1+alpha)', 'beta = 1/alpha'],
      answerIndex: 1,
      explainEN: 'beta = alpha/(1-alpha); as alpha approaches 1, the denominator shrinks and beta becomes very large.',
      explainHI: 'beta = alpha/(1-alpha); जैसे-जैसे alpha 1 की ओर बढ़ता है, denominator घटता है और beta बहुत बड़ा हो जाता है।',
    },
    {
      questionEN: 'In an NPN transistor, the emitter arrow on the symbol and the majority carriers are:',
      questionHI: 'एक NPN transistor में symbol पर emitter arrow और majority carriers हैं:',
      options: [
        'Arrow into emitter, majority holes',
        'Arrow out of emitter, majority electrons',
        'Arrow out of emitter, majority holes',
        'Arrow into emitter, majority electrons',
      ],
      answerIndex: 1,
      explainEN: 'NPN: the emitter arrow points OUT of the emitter and the majority carriers are electrons.',
      explainHI: 'NPN: emitter arrow emitter से BAHAR की ओर है और majority carriers electrons हैं।',
    },
    {
      questionEN: 'On the output characteristics, what happens in the active region as Vce increases at fixed Ib?',
      questionHI: 'output characteristics पर, fixed Ib पर Vce बढ़ने पर active region में क्या होता है?',
      options: [
        'Ic rises sharply with Vce',
        'Ic stays nearly constant, set by Ib',
        'Ic drops to zero',
        'Ic equals only the leakage current',
      ],
      answerIndex: 1,
      explainEN: 'Active-region curves are nearly flat: Ic is controlled by Ib and barely depends on Vce - the signature of a linear amplifier.',
      explainHI: 'active-region की curves लगभग flat हैं: Ic को Ib control करता है और Vce पर मुश्किल से निर्भर करता है - एक linear amplifier की पहचान।',
    },
  ],
};
