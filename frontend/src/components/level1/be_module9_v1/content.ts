import type { SubContent } from '../_transistor/kit';

/**
 * be9 - MOSFET Construction & Operation. The waterpark sluice gate analogy runs
 * through every page: gate voltage = water pressure on a SEALED GLASS gate (the
 * SiO2 oxide), so no current enters the gate. Past a threshold pressure the
 * gate cracks open and the river (drain current) flows from source to drain.
 */
export const CONTENT: SubContent = {
  moduleTitle: 'MOSFET Construction & Operation',
  moduleSubtitle:
    'The anatomy of Depletion and Enhancement architectures - how a sealed glass gate controls a river of current.',
  scenes: [
    {
      id: 'S00_Cover',
      label: 'The Voltage Gate',
      kind: 'cover',
      subtitle: 'The sealed glass sluice gate that runs a river of current',
      theoryEN: [
        'A MOSFET is a switch you control with a voltage instead of a current. You apply a voltage to one terminal called the gate, and that voltage decides how much current is allowed to flow through the device from one side to the other. The surprising part is that the gate itself takes almost no current at all - you are only steering the flow, not feeding it.',
        'To picture this, imagine a water channel at a waterpark with a sealed glass gate across it. You never touch the water; you only press on the outside of the glass. Because the glass is sealed, no water leaks back into your hand, yet the pressure you apply can open or close a path for the water on the far side. In this picture the pressure you apply is the gate voltage (written VGS), and the river of water is the current that flows through the device (the drain current, Id).',
        'You will meet two kinds of MOSFET in this module. The enhancement type is built fully shut, so it carries no current until you press hard enough - it is "normally off". The depletion type is built already slightly open, so it carries current on its own even before you press - it is "normally on".',
        'A few names to hold onto: the sealed glass plate is really a thin layer of silicon dioxide (SiO2), an insulator that blocks current but lets the gate voltage push through as a field. The minimum pressure needed before any river starts to flow is the threshold voltage (Vt). Everything that follows is just these ideas in more detail.',
        'By the end you will be able to derive the threshold voltage, write down the current laws for both the triode and saturation regions, and understand why the n-type and p-type MOSFETs behave like mirror images of each other in CMOS circuits.',
      ],
      theoryHI: [
        'MOSFET एक ऐसा switch है जिसे आप current के बजाय voltage से control करते हैं। आप gate नाम के एक terminal पर voltage लगाते हैं, और वही voltage तय करता है कि device के एक तरफ़ से दूसरी तरफ़ कितना current बहने दिया जाए। हैरानी की बात यह है कि gate खुद लगभग कोई current नहीं लेता - आप सिर्फ़ बहाव को मोड़ रहे हैं, उसे खिला नहीं रहे।',
        'इसे समझने के लिए एक waterpark के पानी के channel की कल्पना कीजिए जिस पर एक sealed glass gate लगा है। आप पानी को कभी छूते नहीं; बस glass के बाहर से उस पर दबाव डालते हैं। चूँकि glass sealed है, कोई पानी वापस आपके हाथ में नहीं रिसता, फिर भी आपका दबाव दूसरी तरफ़ पानी के लिए रास्ता खोल या बंद कर सकता है। इस तस्वीर में आपका दबाव gate voltage (VGS) है, और पानी की नदी device में बहने वाला current (drain current, Id) है।',
        'इस module में आप दो तरह के MOSFET से मिलेंगे। enhancement type पूरी तरह बंद बना होता है, इसलिए जब तक आप ज़ोर से न दबाएँ यह कोई current नहीं बहाता - यह "normally off" है। depletion type पहले से थोड़ा खुला बना होता है, इसलिए दबाने से पहले भी अपने-आप current बहाता है - यह "normally on" है।',
        'कुछ नाम याद रखिए: वह sealed glass plate असल में silicon dioxide (SiO2) की एक पतली परत है, एक insulator जो current रोकता है पर gate voltage को एक field की तरह आर-पार जाने देता है। वह न्यूनतम दबाव जिसके बाद कोई नदी बहना शुरू होती है, वही threshold voltage (Vt) है। आगे जो भी है वह बस इन्हीं विचारों का ज़्यादा विस्तार है।',
        'अंत तक आप threshold voltage derive कर पाएँगे, triode और saturation दोनों regions के current laws लिख पाएँगे, और समझ पाएँगे कि CMOS circuits में n-type और p-type MOSFET एक-दूसरे के आईने जैसे क्यों होते हैं।',
      ],
      transcriptEN:
        'Imagine a sealed glass sluice gate at a waterpark. You never touch the water - you only press on the glass.',
      transcriptHI:
        'एक waterpark के sealed glass sluice gate की कल्पना कीजिए। आप पानी को कभी छूते नहीं - बस glass पर दबाव डालते हैं।',
      visualNote:
        'Cover: an nMOS symbol with a small signal in, a big channel of current out; a sluice-gate motif behind it with a sealed glass plate and a river.',
    },
    {
      id: 'S01_Video',
      label: 'Video - The MOSFET',
      kind: 'video',
      subtitle: 'The voltage gate that never leaks',
      theoryEN: [
        'Before we go into the details, watch this short lesson on how a MOSFET is built and how it works. It will give you the whole picture so the later pages feel like filling in a sketch you already understand.',
        'The single most important idea is this: a very thin layer of silicon dioxide (SiO2) sits under the gate and insulates it. Because of this insulator, you control the device with a voltage (the field it creates), not by pushing current into the gate.',
        'The video also walks through the layers that give the device its name. Reading from the top down, there is metal for the contacts, then the thin oxide insulator, then the semiconductor that carries the current - that is the "M-O-S" in MOSFET.',
        'Finally it compares the two families you will study. The enhancement type starts off with no path for current and you have to create one, while the depletion type comes with a path already built in. Keep the sluice-gate picture in mind: press on the sealed glass hard enough and the river finally begins to flow.',
      ],
      theoryHI: [
        'विस्तार में जाने से पहले यह छोटा lesson देखिए कि MOSFET कैसे बनता है और कैसे काम करता है। यह आपको पूरी तस्वीर दे देगा ताकि आगे के pages एक ऐसे sketch को भरने जैसे लगें जिसे आप पहले से समझते हैं।',
        'सबसे ज़रूरी विचार यही है: gate के नीचे silicon dioxide (SiO2) की एक बहुत पतली परत होती है जो उसे insulate करती है। इस insulator की वजह से आप device को एक voltage (और उससे बनने वाले field) से control करते हैं, gate में current डालकर नहीं।',
        'video उन परतों से भी गुज़रता है जिनसे device को इसका नाम मिलता है। ऊपर से नीचे पढ़िए तो पहले contacts के लिए metal, फिर पतला oxide insulator, फिर current ले जाने वाला semiconductor - यही MOSFET का "M-O-S" है।',
        'अंत में यह उन दो परिवारों की तुलना करता है जिन्हें आप पढ़ेंगे। enhancement type में शुरू में current के लिए कोई रास्ता नहीं होता और आपको एक बनाना पड़ता है, जबकि depletion type में रास्ता पहले से बना होता है। sluice-gate की तस्वीर याद रखिए: sealed glass पर इतना ज़ोर से दबाइए कि नदी आख़िरकार बहने लगे।',
      ],
      transcriptEN:
        'A MOSFET does not let you push current into its gate. The gate sits on a thin layer of silicon dioxide - an insulator, like a sealed glass plate. When you raise the gate voltage VGS, an electric field reaches THROUGH that glass and reshapes the silicon underneath. No water enters your hand; you only press on the glass. That field is the whole story: the name field-effect transistor literally means a transistor controlled by a field. In an enhancement device there is no channel at rest - you must press past a threshold pressure Vt to crack the gate open and start the river of drain current. In a depletion device the gate is built already cracked, so the river runs even at zero pressure, and you press to widen it or to squeeze it shut. Watch how the metal, the oxide, and the semiconductor stack up - that M-O-S sandwich is where everything comes from.',
      transcriptHI:
        'एक MOSFET आपको अपने gate में current डालने नहीं देता। gate, silicon dioxide की एक पतली परत पर बैठता है - एक insulator, जैसे एक sealed glass plate। जब आप gate voltage VGS बढ़ाते हैं, एक electric field उस glass के आर-पार पहुँचकर नीचे के silicon को reshape करता है। आपके हाथ में पानी नहीं आता; आप सिर्फ़ glass पर दबाव डालते हैं। वही field पूरी कहानी है: field-effect transistor नाम का मतलब ही है एक field से control होने वाला transistor। एक enhancement device में शुरू में कोई channel नहीं होता - आपको threshold दबाव Vt के पार दबाना पड़ता है ताकि gate खुले और drain current की नदी शुरू हो। एक depletion device में gate पहले से खुला बना होता है, इसलिए नदी शून्य दबाव पर भी बहती है, और आप उसे चौड़ा करने या बंद करने के लिए दबाते हैं। देखिए कैसे metal, oxide और semiconductor एक के ऊपर एक जमते हैं - वही M-O-S sandwich हर चीज़ की जड़ है।',
      visualNote:
        'Embed the MOSFET video with markers: the sealed gate, the M-O-S stack, enhancement vs depletion, inversion, the three regions.',
    },
    {
      id: 'S02_WhatIsMosfet',
      label: 'What a MOSFET Is',
      kind: 'theory',
      subtitle: 'Why the gate is a sealed glass plate',
      theoryEN: [
        'The name MOSFET is just a description of how the device is built and how it works: Metal-Oxide-Semiconductor Field-Effect Transistor. In plain terms it is a switch you turn with a voltage. It has three terminals you actually work with - the gate (G), the drain (D), and the source (S) - and a fourth one, the body or substrate (B), which is usually tied to the source.',
        'The key feature is where the gate sits. It rests on a very thin layer of silicon dioxide (SiO2), which is an insulator. This thin glassy layer separates the gate completely from the silicon underneath, so the metal of the gate never actually touches the part of the device that carries the current.',
        'Because that insulating layer is in the way, almost no current can flow into the gate. You are not feeding current in; you are simply putting a voltage there, and that voltage creates an electric field that reaches down into the silicon. The control knob for the whole device is therefore the gate-to-source voltage (VGS), which is a voltage, not a current.',
        'This is exactly the sluice-gate idea. Pressing on the sealed glass lets your force pass through to the water on the other side, but no water ever comes back into your hand. In the same way, the gate voltage reaches through the oxide and reshapes the silicon surface beneath it, yet no current crosses into the gate.',
        'That reshaping by an electric field is the heart of the device, and it is where the words "field-effect" in the name come from. The gate field does not pour charge in; it merely rearranges the charges already present in the silicon, and that is enough to open or close the path for current.',
      ],
      theoryHI: [
        'MOSFET नाम बस इस बात का वर्णन है कि device कैसे बना है और कैसे काम करता है: Metal-Oxide-Semiconductor Field-Effect Transistor। सीधे शब्दों में यह एक ऐसा switch है जिसे आप voltage से चालू करते हैं। इसके तीन terminals होते हैं जिनके साथ आप असल में काम करते हैं - gate (G), drain (D), और source (S) - और एक चौथा, body या substrate (B), जो आमतौर पर source से जुड़ा रहता है।',
        'सबसे ख़ास बात यह है कि gate कहाँ बैठता है। यह silicon dioxide (SiO2) की एक बहुत पतली परत पर टिका होता है, जो एक insulator है। यह पतली काँच जैसी परत gate को नीचे के silicon से पूरी तरह अलग कर देती है, इसलिए gate का metal उस हिस्से को कभी नहीं छूता जो current ले जाता है।',
        'चूँकि यह insulating परत बीच में है, gate में लगभग कोई current नहीं जा सकता। आप current नहीं भर रहे; आप बस वहाँ एक voltage रख रहे हैं, और वही voltage एक electric field बनाता है जो नीचे silicon तक पहुँचता है। इसलिए पूरे device का control knob है gate-to-source voltage (VGS), जो एक voltage है, current नहीं।',
        'यही बिल्कुल sluice-gate वाला विचार है। sealed glass पर दबाव डालने से आपका बल दूसरी तरफ़ के पानी तक पहुँच जाता है, पर पानी कभी आपके हाथ में वापस नहीं आता। उसी तरह gate voltage oxide के आर-पार पहुँचकर नीचे की silicon सतह को reshape करता है, फिर भी कोई current gate में नहीं घुसता।',
        'एक electric field से यह reshape होना ही device का दिल है, और यहीं से नाम में "field-effect" शब्द आते हैं। gate field charge अंदर नहीं डालता; यह बस silicon में पहले से मौजूद charges को फिर से सजा देता है, और current के लिए रास्ता खोलने या बंद करने को इतना ही काफ़ी है।',
      ],
      transcriptEN:
        'The gate is sealed glass: press on it and the field passes through, but no current does.',
      transcriptHI:
        'gate एक sealed glass है: उस पर दबाव डालिए और field आर-पार जाता है, पर कोई current नहीं।',
      visualNote:
        'Cutaway of a MOSFET: gate over oxide on top, n+ source and drain in a p-substrate, glowing field lines reaching through the oxide.',
    },
    {
      id: 'S03_FamilyTree',
      label: 'The FET Family Tree',
      kind: 'theory',
      subtitle: 'Where the MOSFET sits in the transistor world',
      theoryEN: [
        'The MOSFET belongs to a larger family called field-effect transistors, or FETs, which are all devices that steer current using a voltage and the electric field it makes. The family has three main branches: the JFET, the MESFET, and the MOSFET. They differ mainly in how the gate is built, but they share the same basic idea of control by field.',
        'Among these, the MOSFET is by far the most common in real chips, both digital and analog. The reason is the insulated gate we just discussed: because it draws almost no current, you can pack billions of these switches together and still keep the power low, which is exactly what a modern processor needs.',
        'The MOSFET itself comes in two flavours that are worth keeping straight. A depletion-type MOSFET conducts even when the gate voltage is zero, so we call it "normally on". An enhancement-type MOSFET blocks current when the gate voltage is zero, so we call it "normally off". The whole difference comes down to whether the device is built with a ready-made path for current or not.',
        'On top of that, each flavour exists in two polarities. An nMOS carries current using electrons, while a pMOS carries it using holes (the absence of an electron, which behaves like a positive charge). Having both polarities available is what lets CMOS logic build any gate it needs.',
        'In sluice-gate language the picture is simple. A depletion device is like a gate that was built already cracked open, so the river runs by itself. An enhancement device is like a gate built fully shut, so the river cannot flow until you press it open.',
      ],
      theoryHI: [
        'MOSFET एक बड़े परिवार का हिस्सा है जिसे field-effect transistors या FETs कहते हैं, जो सभी एक voltage और उससे बनने वाले electric field से current को मोड़ते हैं। इस परिवार की तीन मुख्य शाखाएँ हैं: JFET, MESFET, और MOSFET। ये मुख्यतः इसमें भिन्न होते हैं कि gate कैसे बना है, पर field से control वाला बुनियादी विचार इनमें एक जैसा है।',
        'इनमें से MOSFET असली chips में अब तक का सबसे आम है, digital और analog दोनों में। कारण वही insulated gate है जिसकी हमने अभी बात की: चूँकि यह लगभग कोई current नहीं खींचता, आप इन switches के अरबों को एक साथ रख सकते हैं और फिर भी power कम रख सकते हैं, जो एक आधुनिक processor को ठीक यही चाहिए।',
        'MOSFET खुद दो किस्मों में आता है जिन्हें अलग समझना ज़रूरी है। एक depletion-type MOSFET तब भी conduct करता है जब gate voltage शून्य हो, इसलिए हम इसे "normally on" कहते हैं। एक enhancement-type MOSFET gate voltage शून्य पर current रोक देता है, इसलिए हम इसे "normally off" कहते हैं। पूरा फ़र्क़ बस इस पर है कि device में current का बना-बनाया रास्ता है या नहीं।',
        'इसके ऊपर, हर किस्म दो polarities में मौजूद है। एक nMOS electrons से current ले जाता है, जबकि एक pMOS holes से (hole यानी एक electron का अभाव, जो एक positive charge जैसा व्यवहार करता है)। दोनों polarities का उपलब्ध होना ही CMOS logic को कोई भी ज़रूरी gate बनाने देता है।',
        'sluice-gate की भाषा में तस्वीर सरल है। एक depletion device ऐसा gate है जो पहले से थोड़ा खुला बना था, इसलिए नदी अपने-आप बहती है। एक enhancement device ऐसा gate है जो पूरी तरह बंद बना था, इसलिए जब तक आप उसे दबाकर न खोलें नदी बह नहीं सकती।',
      ],
      transcriptEN:
        'The MOSFET branch wins the IC world because its sealed gate draws no current.',
      transcriptHI:
        'MOSFET शाखा IC की दुनिया जीतती है क्योंकि उसका sealed gate कोई current नहीं खींचता।',
      visualNote:
        'A circuit-board style tree: FET branching to JFET, MESFET, MOSFET; MOSFET branching to a solid Depletion (Normally ON) box and a dashed Enhancement (Normally OFF) box.',
    },
    {
      id: 'S04_MosStack',
      label: 'The Metal-Oxide-Semiconductor Stack',
      kind: 'theory',
      subtitle: 'The sealed glass plate in the middle',
      theoryEN: [
        'If you slice a MOSFET and look at it from the side, you see three layers stacked on top of each other, like a sandwich. On top is metal for the electrical contacts, in the middle is a thin layer of oxide (the silicon dioxide insulator), and below that is the semiconductor where the current actually flows. Those three layers - metal, oxide, semiconductor - are the M, O, and S in the name.',
        'The semiconductor block at the bottom is called the body or substrate, and in the device we study it is p-type silicon (silicon doped so that its main moving charges are holes). Set into the top of this block are two small regions of the opposite type, heavily n-doped (we write this n+, meaning lots of free electrons). One of these regions becomes the source and the other becomes the drain.',
        'The oxide layer in the middle is a dielectric, which is just another word for an insulator that responds to an electric field. When you apply a field across it, the charges inside it shift slightly and set up their own opposing field, but no current actually passes through. This is exactly our sealed glass plate: it transmits the push of the field while blocking any real flow of charge.',
        'It helps to notice that the gate, the oxide, and the silicon underneath together form a capacitor - two conducting plates with an insulator between them. The amount of charge this capacitor can hold for each volt, measured per unit area, is written Cox and equals eps_ox / t_ox, where eps_ox is a property of the oxide material and t_ox is the oxide thickness.',
        'The shape of that formula tells you something practical right away. Because the thickness t_ox is in the bottom of the fraction, a thinner oxide gives a larger Cox, which means the gate has a stronger grip on the silicon below. That is why chip makers work so hard to make the gate oxide extremely thin.',
      ],
      theoryHI: [
        'अगर आप एक MOSFET को काटकर बग़ल से देखें, तो आपको एक के ऊपर एक तीन परतें दिखती हैं, एक sandwich की तरह। ऊपर electrical contacts के लिए metal है, बीच में oxide की एक पतली परत है (वही silicon dioxide insulator), और उसके नीचे semiconductor है जहाँ असल में current बहता है। यही तीन परतें - metal, oxide, semiconductor - नाम का M, O, और S हैं।',
        'नीचे का semiconductor block body या substrate कहलाता है, और जिस device को हम पढ़ते हैं उसमें यह p-type silicon है (ऐसा doped silicon जिसमें मुख्य चलने वाले charges holes हैं)। इस block के ऊपरी हिस्से में उल्टे type के दो छोटे regions बैठाए गए हैं, भारी n-doped (इसे हम n+ लिखते हैं, यानी ढेर सारे free electrons)। इनमें से एक region source बनता है और दूसरा drain।',
        'बीच की oxide परत एक dielectric है, जो बस एक insulator का दूसरा नाम है जो electric field के प्रति response करता है। जब आप इसके आर-पार एक field लगाते हैं, इसके अंदर के charges थोड़ा खिसकते हैं और अपना एक विपरीत field बना लेते हैं, पर असल में कोई current पार नहीं होता। यही ठीक हमारी sealed glass plate है: यह field के दबाव को आर-पार जाने देती है पर charge के किसी असली बहाव को रोक देती है।',
        'यह देखना मददगार है कि gate, oxide, और नीचे का silicon मिलकर एक capacitor बनाते हैं - दो conducting plates जिनके बीच एक insulator हो। यह capacitor प्रति volt कितना charge रख सकता है, प्रति इकाई क्षेत्रफल में मापा जाए, उसे Cox लिखते हैं और यह eps_ox / t_ox के बराबर है, जहाँ eps_ox oxide material का एक गुण है और t_ox oxide की मोटाई।',
        'उस formula का आकार तुरंत एक काम की बात बता देता है। चूँकि मोटाई t_ox भिन्न के नीचे है, एक पतला oxide बड़ा Cox देता है, यानी gate की नीचे के silicon पर पकड़ ज़्यादा मज़बूत होती है। इसीलिए chip बनाने वाले gate oxide को बेहद पतला बनाने की इतनी मेहनत करते हैं।',
      ],
      transcriptEN:
        'Metal on top, sealed glass oxide in the middle, semiconductor below - the M-O-S sandwich.',
      transcriptHI:
        'ऊपर metal, बीच में sealed glass oxide, नीचे semiconductor - यही M-O-S sandwich है।',
      visualNote:
        'Cross-section of the MOS stack: p-substrate, two n+ regions, a bright SiO2 layer, metal contacts, callout explaining the dielectric.',
    },
    {
      id: 'S05_GateCurrentZero',
      label: 'Gate Current is Zero',
      kind: 'theory',
      subtitle: 'Why no water enters your hand',
      theoryEN: [
        'Let us pin down why the gate draws essentially no current, because it is the feature that defines the whole device. The gate is kept apart from the silicon below by that thin layer of silicon dioxide, and silicon dioxide is an excellent insulator. In a good insulator the electrons are bound so tightly (a large "band gap") that they simply cannot drift across, so there is no easy path for current to enter the gate.',
        'There is a cleaner way to see the same fact. The gate and the silicon channel act as the two plates of a capacitor, with the oxide as the insulator between them. A capacitor only passes current while its voltage is changing; once the gate voltage VGS is held steady, the current into it drops to zero. Written as a formula, the gate current is Ig = Cox*A*(dVGS/dt), and when VGS is constant the rate of change dVGS/dt is zero, so Ig becomes zero.',
        'In a real device the gate is not perfectly current-free. A tiny leakage of around a femto-amp to a pico-amp can sneak through a very thin oxide by a quantum effect called tunnelling. But this is so small next to the drain current (often milliamps) that for ordinary purposes we treat the gate current as zero.',
        'The consequence is the single most useful property of a MOSFET: it is controlled by voltage, not current. The drain current Id is set by the field the gate voltage creates, and because almost no current flows in, the resistance looking into the gate is enormous, often a billion ohms or more.',
        'It is worth contrasting this with the bipolar transistor (BJT) you may have met earlier. A BJT must be fed a real base current, Ib = Ic/beta, because its control junction is forward-biased with no insulator in the way. The MOSFET avoids this entirely, which is part of why it dominates modern electronics.',
        'And once more in the sluice-gate picture: you press on the sealed glass, and your effort bends the flow of water on the far side, but not a drop leaks back through the glass into your hand. The gate voltage shapes the current without ever joining it.',
      ],
      theoryHI: [
        'आइए तय कर लें कि gate असल में कोई current क्यों नहीं खींचता, क्योंकि यही वह गुण है जो पूरे device को परिभाषित करता है। gate को नीचे के silicon से silicon dioxide की वह पतली परत अलग रखती है, और silicon dioxide एक बेहतरीन insulator है। एक अच्छे insulator में electrons इतने मज़बूती से बँधे होते हैं (एक बड़ा "band gap") कि वे आर-पार बह ही नहीं सकते, इसलिए gate में current घुसने का कोई आसान रास्ता नहीं होता।',
        'इसी बात को देखने का एक साफ़ तरीक़ा है। gate और silicon channel एक capacitor की दो plates की तरह काम करते हैं, जिनके बीच oxide insulator है। एक capacitor तभी current गुज़ारता है जब उसका voltage बदल रहा हो; जैसे ही gate voltage VGS को स्थिर रखा जाता है, उसमें जाने वाला current शून्य हो जाता है। formula में gate current है Ig = Cox*A*(dVGS/dt), और जब VGS स्थिर है तो बदलाव की दर dVGS/dt शून्य है, इसलिए Ig शून्य हो जाता है।',
        'असली device में gate बिल्कुल current-मुक्त नहीं होता। लगभग एक femto-amp से एक pico-amp जितना नन्हा leakage एक बहुत पतले oxide से एक quantum असर से चुपके निकल सकता है जिसे tunnelling कहते हैं। पर यह drain current (अक्सर milliamps) के सामने इतना छोटा है कि आम कामों के लिए हम gate current को शून्य ही मान लेते हैं।',
        'इसका नतीजा MOSFET का सबसे काम का गुण है: यह voltage से control होता है, current से नहीं। drain current Id, gate voltage से बने field से तय होता है, और चूँकि लगभग कोई current अंदर नहीं जाता, gate में देखने पर resistance बहुत बड़ा होता है, अक्सर एक अरब ohm या उससे ज़्यादा।',
        'इसे उस bipolar transistor (BJT) से तुलना करना ठीक रहेगा जिससे आप पहले मिले होंगे। एक BJT को असली base current देना पड़ता है, Ib = Ic/beta, क्योंकि उसका control junction बिना किसी insulator के forward-biased होता है। MOSFET इससे पूरी तरह बच जाता है, और यही एक कारण है कि वह आधुनिक electronics में छाया हुआ है।',
        'और एक बार फिर sluice-gate की तस्वीर में: आप sealed glass पर दबाव डालते हैं, और आपकी मेहनत दूसरी तरफ़ पानी के बहाव को मोड़ती है, पर एक बूँद भी glass के पार आपके हाथ में वापस नहीं रिसती। gate voltage current को आकार देता है पर कभी उसमें शामिल नहीं होता।',
      ],
      transcriptEN:
        'A capacitor passes no DC current, so the oxide-insulated gate draws essentially nothing.',
      transcriptHI:
        'एक capacitor DC current नहीं गुज़ारता, इसलिए oxide-insulated gate असल में कुछ नहीं खींचता।',
      visualNote:
        'Hand pressing on a sealed glass plate; a tiny crossed-out current arrow at the gate; a big drain current arrow on the far side.',
    },
    {
      id: 'S06_Depletion',
      label: 'Depletion-Type: A Channel Built In',
      kind: 'theory',
      subtitle: 'A gate built already cracked open',
      theoryEN: [
        'The depletion-type MOSFET is the one that is built "already open". During manufacturing, a thin strip of n-type silicon - an n-channel - is deliberately placed between the source and the drain. This strip is a real, physical path that connects the two even before you do anything to the gate.',
        'Because that path is already there, current can flow from drain to source even when the gate voltage is zero. This is what we mean by calling the device normally on: at VGS = 0 it conducts instead of blocking.',
        'That zero-gate current is important enough to have its own name. It is called IDSS, the drain-to-source current measured with the gate connected (shorted) to the source so that VGS is exactly zero. You can think of IDSS as the natural flow of the river when you are not pressing on the gate at all.',
        'The special talent of the depletion device is that you can push its current in either direction from this baseline. The same gate that can squeeze the channel can also widen it, depending on the sign of the voltage you apply.',
        'If you apply a negative gate voltage, the gate pushes electrons out of the channel and down toward the p-type body, where they meet holes and disappear. The channel gets narrower, so the current falls below IDSS - this is the "depletion" mode that gives the device its name. If instead you apply a positive gate voltage, you pull even more electrons into the channel, widening it so the current rises above IDSS - this is the "enhancement" mode.',
        'In the sluice-gate picture, this device is the gate that was built already cracked open. The river runs on its own, and your pressure simply widens the opening or squeezes it down, but it never has to start the flow from nothing.',
      ],
      theoryHI: [
        'depletion-type MOSFET वह है जो "पहले से खुला" बना होता है। बनाते समय n-type silicon की एक पतली पट्टी - एक n-channel - जानबूझकर source और drain के बीच रखी जाती है। यह पट्टी एक असली, भौतिक रास्ता है जो gate को कुछ करने से पहले ही दोनों को जोड़ देता है।',
        'चूँकि वह रास्ता पहले से वहाँ है, current drain से source तक तब भी बह सकता है जब gate voltage शून्य हो। इसी का मतलब है device को normally on कहना: VGS = 0 पर यह रोकने के बजाय conduct करता है।',
        'उस zero-gate current का अपना एक नाम है। इसे IDSS कहते हैं, यानी वह drain-to-source current जो gate को source से जोड़कर (short करके) मापा जाता है ताकि VGS बिल्कुल शून्य हो। आप IDSS को नदी का प्राकृतिक बहाव मान सकते हैं जब आप gate पर बिल्कुल भी दबाव नहीं डाल रहे।',
        'depletion device की ख़ास प्रतिभा यह है कि आप इसके current को इस baseline से किसी भी दिशा में धकेल सकते हैं। वही gate जो channel को दबा सकता है, उसे चौड़ा भी कर सकता है, इस पर निर्भर कि आप कौन-से sign का voltage लगाते हैं।',
        'अगर आप एक negative gate voltage लगाते हैं, gate electrons को channel से बाहर p-type body की तरफ़ नीचे धकेलता है, जहाँ वे holes से मिलकर ग़ायब हो जाते हैं। channel सँकरा होता है, इसलिए current IDSS से नीचे गिरता है - यही "depletion" mode है जो device को इसका नाम देता है। अगर इसके बजाय आप एक positive gate voltage लगाते हैं, आप और भी electrons channel में खींचते हैं, उसे चौड़ा करते हैं ताकि current IDSS से ऊपर चढ़े - यही "enhancement" mode है।',
        'sluice-gate की तस्वीर में यह device वह gate है जो पहले से थोड़ा खुला बना था। नदी अपने-आप बहती है, और आपका दबाव बस उस खुलाव को चौड़ा करता है या उसे दबाता है, पर उसे कभी शून्य से बहाव शुरू नहीं करना पड़ता।',
      ],
      transcriptEN:
        'A depletion MOSFET has a built-in channel, so it flows at zero gate - that flow is IDSS.',
      transcriptHI:
        'एक depletion MOSFET में built-in channel होता है, इसलिए वह शून्य gate पर भी बहता है - वही बहाव IDSS है।',
      visualNote:
        'Cross-section of a depletion MOSFET with a pre-existing n-channel bridging drain and source; callout: current flows even at VGS = 0.',
    },
    {
      id: 'S07_Enhancement',
      label: 'Enhancement-Type: No Channel Yet',
      kind: 'theory',
      subtitle: 'A gate that starts fully shut',
      theoryEN: [
        'The enhancement-type MOSFET is the opposite case: it is built with no channel at all. When it leaves the factory there are only the two n-type regions for the source and drain, sitting in the p-type body with plain, untouched silicon in the gap between them. Nothing connects the drain to the source yet.',
        'Because there is no path across that gap, no current can flow when the gate voltage is zero. We write this as Id = 0 A at VGS = 0, and we call the device normally off: at rest it blocks rather than conducts.',
        'To turn it on, you have to make a channel where there was none. You apply a positive gate voltage, and if it is large enough the field it creates pulls a layer of electrons up to the surface and forms a fresh n-type path on the spot. We say the channel is "induced" - created electrically on demand - rather than built in during manufacturing. The next page works through exactly how that happens.',
        'In the sluice-gate picture this is the gate built fully shut. The river cannot move at all until you press hard enough to crack a path open; only then does the water begin to flow.',
        'This is the workhorse of digital electronics. CMOS logic is built almost entirely from enhancement MOSFETs, an n-type one paired with a p-type one so that in any steady state one of them is off, which keeps the power consumption very low.',
      ],
      theoryHI: [
        'enhancement-type MOSFET उल्टा मामला है: यह बिल्कुल बिना किसी channel के बना होता है। जब यह factory से निकलता है तो सिर्फ़ source और drain के लिए दो n-type regions होते हैं, जो p-type body में बैठे होते हैं और जिनके बीच के gap में सादा, अनछुआ silicon होता है। अभी drain को source से कुछ नहीं जोड़ता।',
        'चूँकि उस gap के आर-पार कोई रास्ता नहीं है, gate voltage शून्य होने पर कोई current नहीं बह सकता। इसे हम VGS = 0 पर Id = 0 A लिखते हैं, और device को normally off कहते हैं: आराम की हालत में यह conduct करने के बजाय रोकता है।',
        'इसे चालू करने के लिए आपको वहाँ एक channel बनाना पड़ता है जहाँ कोई नहीं था। आप एक positive gate voltage लगाते हैं, और अगर वह काफ़ी बड़ा हो तो उससे बना field electrons की एक परत सतह तक खींच लाता है और तुरंत एक नया n-type रास्ता बना देता है। हम कहते हैं कि channel "induce" हुई - माँग पर electrically बनी - न कि बनाते समय अंदर रखी गई। अगला page ठीक यही दिखाता है कि यह कैसे होता है।',
        'sluice-gate की तस्वीर में यह पूरी तरह बंद बना gate है। नदी तब तक बिल्कुल नहीं हिल सकती जब तक आप इतना ज़ोर से न दबाएँ कि एक रास्ता खुल जाए; तभी पानी बहना शुरू होता है।',
        'यही digital electronics का असली घोड़ा है। CMOS logic लगभग पूरी तरह enhancement MOSFETs से बनती है, एक n-type को एक p-type के साथ जोड़कर ताकि किसी भी स्थिर हालत में उनमें से एक off रहे, जिससे power की खपत बहुत कम रहती है।',
      ],
      transcriptEN:
        'An enhancement MOSFET has no channel at rest - press past Vt to induce one.',
      transcriptHI:
        'एक enhancement MOSFET में शुरू में कोई channel नहीं होती - Vt के पार दबाकर एक बनाइए।',
      visualNote:
        'Cross-section of an enhancement MOSFET: n drain and n source in a p-body with a dashed circle in the gap labelled absence of a channel.',
    },
    {
      id: 'S08_Inversion',
      label: 'Inversion - Creating the Channel',
      kind: 'theory',
      subtitle: 'Cracking the sealed gate open',
      theoryEN: [
        'Now let us watch a channel being born in an enhancement device. Start by applying a positive voltage to the gate. Remember the silicon underneath is p-type, which means its plentiful moving charges are holes (positive), with only a few stray electrons mixed in.',
        'The first thing the positive gate field does is push like-charges away. Holes are positive, so the positive gate repels them downward, away from the oxide and deeper into the body. This clears the holes out of a thin region right under the oxide, leaving behind a "depletion region" that has fixed charges but no free carriers to conduct yet.',
        'As you keep raising the voltage, the same field now does the opposite to the electrons. The few stray (minority) electrons in the silicon are negative, so the positive gate pulls them up toward the oxide, where they collect in a thin sheet against the insulator.',
        'When enough electrons have gathered, something striking happens: that surface layer now has more electrons than holes, so it behaves like n-type silicon even though the bulk below it is still p-type. The surface has effectively flipped its type, and we call this inversion. That inverted layer is the new n-channel, and it bridges the source to the drain so current can finally flow.',
        'There is a particular gate voltage at which the surface just reaches this inverted, conducting state. That voltage is the threshold voltage, written Vt. Below Vt there is no channel and the device is off; above Vt the channel exists and current can flow. This is exactly the sluice gate cracking open the moment your pressure passes the threshold.',
        'So the on/off rule is simple to state. When VGS is less than Vt there is no channel and Id is zero - the cutoff state. When VGS is greater than Vt the inversion layer forms and Id flows. The panel below steps through the full derivation of Vt, so you can see where that threshold actually comes from.',
      ],
      theoryHI: [
        'अब आइए एक enhancement device में एक channel को जन्म लेते देखें। gate पर एक positive voltage लगाने से शुरू कीजिए। याद रखिए नीचे का silicon p-type है, यानी उसके भरपूर चलने वाले charges holes (positive) हैं, जिनमें बस कुछ इक्के-दुक्के electrons मिले होते हैं।',
        'positive gate field सबसे पहले समान-charges को दूर धकेलता है। holes positive हैं, इसलिए positive gate उन्हें नीचे, oxide से दूर body में गहरे धकेलता है। इससे oxide के ठीक नीचे की एक पतली परत से holes साफ़ हो जाते हैं, और पीछे एक "depletion region" बच जाता है जिसमें स्थिर charges तो हैं पर conduct करने के लिए अभी कोई free carrier नहीं।',
        'जैसे-जैसे आप voltage बढ़ाते रहते हैं, वही field अब electrons के साथ उल्टा करता है। silicon में जो कुछ इक्के-दुक्के (minority) electrons हैं वे negative हैं, इसलिए positive gate उन्हें oxide की तरफ़ ऊपर खींचता है, जहाँ वे insulator से सटी एक पतली चादर में जमा हो जाते हैं।',
        'जब पर्याप्त electrons जमा हो जाते हैं, एक हैरान करने वाली बात होती है: उस सतही परत में अब holes से ज़्यादा electrons हैं, इसलिए वह n-type silicon जैसा व्यवहार करती है भले ही नीचे का bulk अब भी p-type हो। सतह ने मानो अपना type पलट लिया है, और इसे हम inversion कहते हैं। वही पलटी हुई परत नया n-channel है, और यह source को drain से जोड़ देती है ताकि current आख़िरकार बह सके।',
        'एक ख़ास gate voltage होता है जिस पर सतह बस इस पलटी हुई, conducting हालत तक पहुँचती है। वही voltage threshold voltage है, जिसे Vt लिखते हैं। Vt के नीचे कोई channel नहीं और device off; Vt के ऊपर channel मौजूद और current बह सकता है। यह बिल्कुल वही sluice gate है जो आपके दबाव के threshold पार करते ही खुल जाता है।',
        'तो on/off का नियम कहने में सरल है। जब VGS, Vt से कम हो तो कोई channel नहीं और Id शून्य - यह cutoff हालत है। जब VGS, Vt से ज़्यादा हो तो inversion परत बनती है और Id बहता है। नीचे का panel Vt की पूरी derivation step-by-step दिखाता है, ताकि आप देख सकें कि वह threshold असल में कहाँ से आता है।',
      ],
      transcriptEN:
        'Push holes down, pull electrons up; once the surface inverts to n-type, the channel exists.',
      transcriptHI:
        'holes को नीचे धकेलिए, electrons को ऊपर खींचिए; सतह n-type में पलटते ही channel बन जाती है।',
      visualNote:
        'Two stacked cross-sections: top charge repulsion pushing holes away, bottom electron accumulation forming the n-type channel under SiO2.',
    },
    {
      id: 'S09_OperatingRegions',
      label: 'The Three Operating Regions',
      kind: 'theory',
      subtitle: 'Cutoff, triode, and saturation',
      theoryEN: [
        'Once a channel can form, a MOSFET behaves in three clearly different ways depending on the two voltages you apply. It helps to keep one quantity in mind throughout: the overdrive voltage, Vov = VGS - Vt, which simply measures how far past the threshold you have pushed the gate. A bigger overdrive means a thicker channel and more current available.',
        'The first behaviour is cutoff. If VGS is below Vt there is no channel at all, so no current can pass and Id = 0. This is the device acting as an open switch, fully off.',
        'The second behaviour is the triode region (also called ohmic or linear), which you get when the gate is on (VGS > Vt) but the drain-to-source voltage VDS is still small (specifically VDS < VGS - Vt). Here a complete channel stretches from source to drain and behaves like a resistor whose value you set with the gate. The current grows as you raise VDS, and the exact law is Id = k[(VGS - Vt)*VDS - VDS^2/2]. For very small VDS the squared term is tiny and Id is nearly proportional to VDS, which is why it looks like an ordinary resistor.',
        'The third behaviour is saturation (the active region), which you reach once VDS becomes large enough, VDS >= VGS - Vt. Now the channel is squeezed to nothing right at the drain end - it "pinches off" - and pushing VDS higher no longer moves much more current. The current settles at Id = (k/2)*(VGS - Vt)^2, which depends on the overdrive but, ideally, not on VDS. This flat, steady current is what makes the MOSFET useful as an amplifier.',
        'All of this physics is collected into the single constant k = mu*Cox*(W/L). Here mu is how easily the carriers move (their mobility), Cox is the gate-oxide capacitance per area from before, and W/L is the ratio of the channel width to its length. Make the channel wider or shorter, or the oxide thinner, and k rises, so more current flows for the same overdrive.',
        'One last point ties the regions together neatly. The boundary between triode and saturation sits exactly at VDS = VGS - Vt. If you put that value of VDS into the triode law, the algebra collapses straight onto the saturation law - so the two formulas agree perfectly at the knee, and one curve flows smoothly into the other.',
      ],
      theoryHI: [
        'जैसे ही एक channel बन सकता है, MOSFET आपके लगाए दो voltages के अनुसार तीन साफ़-साफ़ अलग तरीक़ों से व्यवहार करता है। पूरे समय एक राशि याद रखना मददगार है: overdrive voltage, Vov = VGS - Vt, जो बस यह मापता है कि आपने gate को threshold के कितने पार धकेला है। बड़ा overdrive यानी मोटा channel और ज़्यादा उपलब्ध current।',
        'पहला व्यवहार cutoff है। अगर VGS, Vt से नीचे है तो कोई channel ही नहीं, इसलिए कोई current नहीं गुज़र सकता और Id = 0। यह device एक खुले switch की तरह, पूरी तरह off।',
        'दूसरा व्यवहार triode region है (इसे ohmic या linear भी कहते हैं), जो तब मिलता है जब gate on हो (VGS > Vt) पर drain-to-source voltage VDS अभी छोटा हो (ख़ासकर VDS < VGS - Vt)। यहाँ एक पूरा channel source से drain तक फैला होता है और एक ऐसे resistor की तरह व्यवहार करता है जिसका मान आप gate से तय करते हैं। VDS बढ़ाने पर current बढ़ता है, और पूरा law है Id = k[(VGS - Vt)*VDS - VDS^2/2]। बहुत छोटे VDS पर squared term नन्हा होता है और Id लगभग VDS के समानुपाती होता है, इसीलिए यह एक साधारण resistor जैसा दिखता है।',
        'तीसरा व्यवहार saturation है (active region), जो तब मिलता है जब VDS काफ़ी बड़ा हो जाए, VDS >= VGS - Vt। अब channel ठीक drain के सिरे पर शून्य तक दब जाता है - यह "pinch off" हो जाता है - और VDS को और ऊँचा करने से ख़ास ज़्यादा current नहीं हिलता। current ठहर जाता है Id = (k/2)*(VGS - Vt)^2 पर, जो overdrive पर निर्भर है पर आदर्श रूप से VDS पर नहीं। यही सपाट, स्थिर current MOSFET को एक amplifier के रूप में उपयोगी बनाता है।',
        'यह सारी physics एक अकेले constant k = mu*Cox*(W/L) में सिमट जाती है। यहाँ mu यह है कि carriers कितनी आसानी से चलते हैं (उनकी mobility), Cox पहले वाला gate-oxide capacitance per area है, और W/L channel की चौड़ाई और लंबाई का अनुपात। channel को चौड़ा या छोटा कीजिए, या oxide को पतला, और k बढ़ता है, इसलिए उसी overdrive के लिए ज़्यादा current बहता है।',
        'एक आख़िरी बात regions को सफ़ाई से जोड़ देती है। triode और saturation के बीच की सीमा ठीक VDS = VGS - Vt पर है। अगर आप VDS का यह मान triode law में रख दें, बीजगणित सीधे saturation law पर सिमट जाता है - इसलिए दोनों formulas knee पर बिल्कुल मेल खाते हैं, और एक curve दूसरे में सहजता से बह जाता है।',
      ],
      transcriptEN:
        'Cutoff off, triode a resistor, saturation a current source - VDS = VGS - Vt is the boundary.',
      transcriptHI:
        'Cutoff off, triode एक resistor, saturation एक current source - VDS = VGS - Vt सीमा है।',
      visualNote:
        'Id vs VDS curves for rising VGS: steep triode near the origin, knee at VDS = VGS - Vt, flat saturation plateau, with a region indicator.',
    },
    {
      id: 'S10_DiagnosticMatrix',
      label: 'Depletion vs Enhancement',
      kind: 'theory',
      subtitle: 'The diagnostic matrix and pMOS mirror',
      theoryEN: [
        'It is worth gathering the two MOSFET types side by side so the differences stand out clearly. Everything really follows from one question: was the channel built into the device, or does it have to be created by the gate?',
        'Start with the channel itself. A depletion device has a real channel already implanted during manufacture, so a path exists from the very beginning. An enhancement device has no channel until the gate makes one, so the path has to be induced.',
        'That single fact decides what happens at rest, when the gate voltage is zero. The depletion device, having a ready-made path, conducts its natural current IDSS and is therefore normally on. The enhancement device, having no path, carries Id = 0 and is therefore normally off.',
        'It also decides what the gate voltage is for. In a depletion device the channel is already flowing, so the gate merely adjusts an existing current up or down (it can work in both the enhancement and depletion modes from page six). In an enhancement device there is nothing to adjust until you first cross the threshold Vt; only then does any current begin.',
        'Finally, remember that every type comes in two polarities. If you swap the n-type and p-type silicon throughout, you get a pMOS, whose channel is made of holes and whose controlling voltages all flip sign. An nMOS turns on when VGS is above its (positive) threshold; a pMOS turns on when VGS is below its (negative) threshold, that is, when the gate is pulled negative relative to the source.',
        'This sign-mirror is exactly what CMOS exploits. An enhancement nMOS and an enhancement pMOS are wired together so that, in any steady logic state, one of them is off. With one device always blocking, there is no direct path from supply to ground, and the circuit burns almost no power while it is just holding a value.',
      ],
      theoryHI: [
        'दोनों MOSFET types को आमने-सामने रखना फ़ायदेमंद है ताकि फ़र्क़ साफ़ उभर आएँ। सब कुछ असल में एक सवाल से निकलता है: channel device में बनाया गया था, या उसे gate से बनाना पड़ता है?',
        'channel से ही शुरू कीजिए। एक depletion device में बनाते समय ही एक असली channel implanted होता है, इसलिए एक रास्ता शुरू से मौजूद रहता है। एक enhancement device में तब तक कोई channel नहीं जब तक gate एक न बना दे, इसलिए रास्ते को induce करना पड़ता है।',
        'यही एक बात तय कर देती है कि आराम की हालत में, जब gate voltage शून्य हो, क्या होता है। depletion device, जिसके पास बना-बनाया रास्ता है, अपना प्राकृतिक current IDSS बहाता है और इसलिए normally on है। enhancement device, जिसके पास कोई रास्ता नहीं, Id = 0 रखता है और इसलिए normally off है।',
        'यही यह भी तय करती है कि gate voltage किस लिए है। एक depletion device में channel पहले से बह रहा है, इसलिए gate बस एक मौजूद current को ऊपर या नीचे adjust करता है (यह छठे page वाले enhancement और depletion दोनों modes में काम कर सकता है)। एक enhancement device में adjust करने को कुछ नहीं जब तक आप पहले threshold Vt पार न करें; तभी कोई current शुरू होता है।',
        'अंत में, याद रखिए कि हर type दो polarities में आता है। अगर आप पूरे device में n-type और p-type silicon आपस में बदल दें, तो एक pMOS मिलता है, जिसका channel holes का बना होता है और जिसके control करने वाले सारे voltages का sign उलट जाता है। एक nMOS तब चालू होता है जब VGS उसके (positive) threshold से ऊपर हो; एक pMOS तब चालू होता है जब VGS उसके (negative) threshold से नीचे हो, यानी जब gate को source के सापेक्ष negative खींचा जाए।',
        'यही sign का आईना CMOS इस्तेमाल करता है। एक enhancement nMOS और एक enhancement pMOS आपस में ऐसे जुड़े होते हैं कि किसी भी स्थिर logic हालत में उनमें से एक off रहे। एक device के हमेशा रोकते रहने से supply से ground तक कोई सीधा रास्ता नहीं बनता, और circuit सिर्फ़ एक मान पकड़े रहते हुए लगभग कोई power नहीं जलाता।',
      ],
      transcriptEN:
        'Depletion is implanted and normally on; enhancement is induced and normally off; pMOS mirrors the signs.',
      transcriptHI:
        'Depletion implanted और normally on है; enhancement induced और normally off है; pMOS signs का आईना है।',
      visualNote:
        'A comparison table: Depletion vs Enhancement across physical channel, default state, operating modes, conduction catalyst; nMOS and pMOS symbols side by side.',
    },
    {
      id: 'S11_Flashcards',
      label: 'Flashcards - Lock It In',
      kind: 'flashcards',
      subtitle: 'Eight cards: the gate, the channel, the laws',
      theoryEN: [
        'These cards are a quick way to lock in the ideas from this module. Each one shows a term on the front, and flipping it reveals a plain explanation on the back.',
        'Between them the eight cards cover the whole story: what the letters in MOSFET stand for, why the gate draws almost no current, what the threshold voltage means, how enhancement and depletion devices differ, the triode and saturation current laws, what inversion is, and how nMOS and pMOS mirror each other.',
        'For the best results, look at the front and try to say the back in your own words before you flip the card. Recalling the answer yourself is what actually moves it into long-term memory.',
      ],
      theoryHI: [
        'ये cards इस module के विचारों को पक्का करने का एक तेज़ तरीक़ा हैं। हर एक सामने एक term दिखाता है, और उसे पलटने पर पीछे एक सीधी व्याख्या सामने आती है।',
        'मिलकर ये आठ cards पूरी कहानी को समेटते हैं: MOSFET के अक्षरों का मतलब, gate लगभग कोई current क्यों नहीं खींचता, threshold voltage का अर्थ, enhancement और depletion devices में फ़र्क़, triode और saturation के current laws, inversion क्या है, और nMOS तथा pMOS एक-दूसरे का आईना कैसे हैं।',
        'सबसे अच्छे नतीजे के लिए सामने वाला हिस्सा देखिए और पलटने से पहले पीछे वाली बात अपने शब्दों में कहने की कोशिश कीजिए। जवाब को ख़ुद याद करना ही उसे लंबी याददाश्त में ले जाता है।',
      ],
      transcriptEN:
        'Eight cards to lock the MOSFET idea into memory; say the back before you flip.',
      transcriptHI:
        'MOSFET के विचार को याददाश्त में बैठाने के लिए आठ cards; पलटने से पहले पीछे वाली बात बोलें।',
      visualNote: 'Watermarked shareable flip-card deck; bold term front, explanation back.',
    },
    {
      id: 'S12_Quiz',
      label: 'Quiz - Test the Gate',
      kind: 'quiz',
      subtitle: 'Eight questions on construction and operation',
      theoryEN: [
        'Here are eight multiple-choice questions that walk across the whole module - the sealed gate, the channel and how it forms, and the current laws for each region.',
        'Take a moment to read every option, not just the one that looks right. The wrong answers are deliberately the common misunderstandings this module set out to fix, so spotting why they are wrong is part of the practice.',
        'A short explanation appears after each answer, so even a question you miss turns into a quick lesson rather than just a wrong mark.',
      ],
      theoryHI: [
        'यहाँ आठ multiple-choice सवाल हैं जो पूरे module से गुज़रते हैं - sealed gate, channel और वह कैसे बनता है, और हर region के current laws।',
        'एक पल रुककर हर option पढ़िए, सिर्फ़ वह नहीं जो सही दिखता है। ग़लत जवाब जानबूझकर वही आम ग़लतफ़हमियाँ हैं जिन्हें यह module ठीक करने निकला था, इसलिए यह पहचानना कि वे ग़लत क्यों हैं अभ्यास का हिस्सा है।',
        'हर जवाब के बाद एक छोटी explanation आती है, इसलिए जो सवाल आप चूकते हैं वह भी सिर्फ़ एक ग़लत निशान के बजाय एक तेज़ सबक़ बन जाता है।',
      ],
      transcriptEN:
        'Eight quick questions on MOSFET construction and operation; read all four options each time.',
      transcriptHI:
        'MOSFET construction और operation पर आठ तेज़ सवाल; हर बार चारों options पढ़ें।',
      visualNote: 'Quiz arena with eight problems; running score and reveal explanation on answer.',
    },
    {
      id: 'S13_Recap',
      label: 'Recap - The Gate in One Page',
      kind: 'recap',
      subtitle: 'Everything that makes the MOSFET a voltage gate',
      theoryEN: [
        'Let us bring the whole module back together in one place. The defining feature of a MOSFET is its sealed gate: a thin layer of silicon dioxide insulates the gate, so almost no current flows into it (Ig is about 0) and you steer the device with the gate voltage VGS through the field it makes. That is the sealed glass sluice gate from the very first page.',
        'Physically the device is a sandwich of three layers - metal on top, the oxide insulator in the middle, and the semiconductor below. The oxide is a dielectric, and together with the gate and silicon it forms a capacitor whose value per area is Cox = eps_ox / t_ox; a thinner oxide gives a firmer grip on the channel.',
        'The two architectures split on whether a channel exists at rest. The enhancement type is normally off (Id = 0 at VGS = 0): it has no channel until you push past the threshold Vt and create one by inversion. The depletion type is normally on (Id = IDSS at VGS = 0): its channel is built in, and the gate either widens it with a positive voltage or squeezes it shut with a negative one.',
        'Once a channel is present, three regions describe the current. In cutoff (VGS < Vt) there is no channel and Id = 0. In the triode region the channel acts as a resistor and Id = k[(VGS - Vt)VDS - VDS^2/2]. In saturation the channel pinches off and the current flattens to Id = (k/2)(VGS - Vt)^2. The constant k = mu*Cox*(W/L) carries all the device physics, and the two regions meet exactly at VDS = VGS - Vt.',
        'Finally, polarity. An nMOS uses an electron channel and turns on when VGS rises above a positive threshold, while a pMOS uses a hole channel and turns on when VGS falls below a negative one. Pairing the two is what makes CMOS so efficient. The sources behind these formulas and definitions are listed below if you want to read further.',
      ],
      theoryHI: [
        'आइए पूरे module को एक जगह वापस जोड़ें। MOSFET का परिभाषित गुण उसका sealed gate है: silicon dioxide की एक पतली परत gate को insulate करती है, इसलिए उसमें लगभग कोई current नहीं जाता (Ig लगभग 0) और आप device को gate voltage VGS से, उसके बनाए field के ज़रिए, मोड़ते हैं। यही पहले page वाला sealed glass sluice gate है।',
        'भौतिक रूप से device तीन परतों का sandwich है - ऊपर metal, बीच में oxide insulator, और नीचे semiconductor। oxide एक dielectric है, और gate तथा silicon के साथ मिलकर एक capacitor बनाता है जिसका प्रति-क्षेत्रफल मान Cox = eps_ox / t_ox है; पतला oxide channel पर मज़बूत पकड़ देता है।',
        'दोनों architectures इस पर बँटती हैं कि आराम की हालत में channel मौजूद है या नहीं। enhancement type normally off है (VGS = 0 पर Id = 0): जब तक आप threshold Vt के पार न दबाएँ और inversion से एक न बनाएँ तब तक कोई channel नहीं। depletion type normally on है (VGS = 0 पर Id = IDSS): उसका channel बना-बनाया है, और gate उसे या तो positive voltage से चौड़ा करता है या negative से बंद।',
        'channel मौजूद होते ही, तीन regions current को बताते हैं। cutoff में (VGS < Vt) कोई channel नहीं और Id = 0। triode region में channel एक resistor की तरह काम करता है और Id = k[(VGS - Vt)VDS - VDS^2/2]। saturation में channel pinch off हो जाता है और current सपाट होकर Id = (k/2)(VGS - Vt)^2 हो जाता है। constant k = mu*Cox*(W/L) सारी device physics ढोता है, और दोनों regions ठीक VDS = VGS - Vt पर मिलते हैं।',
        'अंत में, polarity। एक nMOS electron channel इस्तेमाल करता है और तब चालू होता है जब VGS एक positive threshold से ऊपर चढ़े, जबकि एक pMOS hole channel इस्तेमाल करता है और तब चालू होता है जब VGS एक negative threshold से नीचे गिरे। इन दोनों को जोड़ना ही CMOS को इतना कुशल बनाता है। इन formulas और definitions के पीछे के sources नीचे सूचीबद्ध हैं अगर आप और पढ़ना चाहें।',
      ],
      transcriptEN:
        'Sealed gate, M-O-S stack, induce or implant the channel, three regions - the MOSFET in one page.',
      transcriptHI:
        'sealed gate, M-O-S stack, channel induce करो या implant, तीन regions - एक page में MOSFET।',
      visualNote:
        'One-page cheat grid: the gate / the stack / enhancement vs depletion / the three laws, with a Sources footer.',
    },
  ],
  flashcards: [
    {
      frontEN: 'MOSFET (what the letters mean)',
      backEN:
        'Metal-Oxide-Semiconductor Field-Effect Transistor: a stack of metal contacts, a thin SiO2 oxide insulator, and a semiconductor substrate, controlled by a gate field.',
      frontHI: 'MOSFET (अक्षरों का मतलब)',
      backHI:
        'Metal-Oxide-Semiconductor Field-Effect Transistor: metal contacts, एक पतला SiO2 oxide insulator, और एक semiconductor substrate का stack, जो gate field से control होता है।',
    },
    {
      frontEN: 'Why Ig is about 0',
      backEN:
        'The gate sits on an insulating SiO2 oxide, so it draws virtually no current - you control the device by voltage (field), like pressing on a sealed glass sluice gate.',
      frontHI: 'Ig लगभग 0 क्यों',
      backHI:
        'gate एक insulating SiO2 oxide पर बैठता है, इसलिए वह लगभग कोई current नहीं खींचता - आप device को voltage (field) से control करते हैं, जैसे एक sealed glass sluice gate पर दबाव डालना।',
    },
    {
      frontEN: 'Threshold voltage Vt',
      backEN:
        'The minimum VGS needed to invert the surface and form a conducting channel; below Vt the MOSFET is off, above it current can flow.',
      frontHI: 'Threshold voltage Vt',
      backHI:
        'वह न्यूनतम VGS जो सतह को invert करके एक conducting channel बनाता है; Vt के नीचे MOSFET off है, ऊपर current बह सकता है।',
    },
    {
      frontEN: 'Enhancement-type MOSFET',
      backEN:
        'Normally OFF: no built-in channel, Id = 0 at VGS = 0. You must apply VGS > Vt to induce a channel - a sluice gate that starts fully shut.',
      frontHI: 'Enhancement-type MOSFET',
      backHI:
        'Normally OFF: कोई built-in channel नहीं, VGS = 0 पर Id = 0। channel induce करने के लिए VGS > Vt लगाना पड़ता है - एक sluice gate जो पूरी तरह बंद शुरू होता है।',
    },
    {
      frontEN: 'Depletion-type MOSFET',
      backEN:
        'Normally ON: has a physically implanted channel, so Id = IDSS even at VGS = 0. Gate voltage can widen (enhance) or narrow (deplete) the existing flow.',
      frontHI: 'Depletion-type MOSFET',
      backHI:
        'Normally ON: एक भौतिक रूप से implanted channel होती है, इसलिए VGS = 0 पर भी Id = IDSS। gate voltage मौजूद बहाव को चौड़ा (enhance) या सँकरा (deplete) कर सकता है।',
    },
    {
      frontEN: 'Triode vs Saturation',
      backEN:
        'Triode (VDS < VGS - Vt): Id = k[(VGS - Vt)VDS - VDS^2/2], a voltage-controlled resistor. Saturation (VDS >= VGS - Vt): Id = (k/2)(VGS - Vt)^2, channel pinched off.',
      frontHI: 'Triode बनाम Saturation',
      backHI:
        'Triode (VDS < VGS - Vt): Id = k[(VGS - Vt)VDS - VDS^2/2], एक voltage-controlled resistor। Saturation (VDS >= VGS - Vt): Id = (k/2)(VGS - Vt)^2, channel pinch off।',
    },
    {
      frontEN: 'Inversion',
      backEN:
        'Under a positive gate field, holes are repelled and minority electrons accumulate against the oxide, flipping the p-type surface to n-type and creating the induced channel.',
      frontHI: 'Inversion',
      backHI:
        'एक positive gate field के नीचे, holes दूर धकेले जाते हैं और minority electrons oxide से सटकर जमा होते हैं, p-type सतह को n-type में पलटकर induced channel बना देते हैं।',
    },
    {
      frontEN: 'nMOS vs pMOS',
      backEN:
        'nMOS conducts electrons and turns on with positive VGS (Vt > 0); pMOS conducts holes and turns on with negative VGS (Vt < 0). All controlling voltages reverse sign.',
      frontHI: 'nMOS बनाम pMOS',
      backHI:
        'nMOS electrons conduct करता है और positive VGS पर चालू होता है (Vt > 0); pMOS holes conduct करता है और negative VGS पर चालू होता है (Vt < 0)। सभी control करने वाले voltages का sign उलट जाता है।',
    },
  ],
  quiz: [
    {
      questionEN: 'Why does almost no current flow into the gate terminal of a MOSFET?',
      questionHI: 'MOSFET के gate terminal में लगभग कोई current क्यों नहीं जाता?',
      options: [
        'The gate is made of a perfect superconductor',
        'A thin SiO2 oxide layer insulates the gate from the channel',
        'The gate is connected to ground internally',
        'The drain absorbs all the gate current',
      ],
      answerIndex: 1,
      explainEN:
        'The gate sits on an insulating silicon-dioxide layer, so it controls the channel by field/voltage, not by drawing current - like pressing on sealed glass.',
      explainHI:
        'gate एक insulating silicon-dioxide परत पर बैठता है, इसलिए वह channel को field/voltage से control करता है, current खींचकर नहीं - जैसे sealed glass पर दबाव डालना।',
    },
    {
      questionEN: 'An enhancement-type nMOS has VGS = 0 V. What is the drain current Id?',
      questionHI: 'एक enhancement-type nMOS में VGS = 0 V है। drain current Id क्या है?',
      options: [
        'Id = IDSS (it conducts fully)',
        'Id = (k/2)Vt^2',
        'Id = 0 A (it is non-conducting)',
        'Id depends only on VDS',
      ],
      answerIndex: 2,
      explainEN:
        'An enhancement MOSFET has no built-in channel, so at VGS = 0 there is no path between drain and source: it is Normally OFF, Id = 0 A.',
      explainHI:
        'एक enhancement MOSFET में कोई built-in channel नहीं होती, इसलिए VGS = 0 पर drain और source के बीच कोई path नहीं: यह Normally OFF है, Id = 0 A।',
    },
    {
      questionEN:
        'What distinguishes a depletion-type MOSFET from an enhancement-type at the construction level?',
      questionHI:
        'construction के स्तर पर एक depletion-type MOSFET को enhancement-type से क्या अलग करता है?',
      options: [
        'It has a physically implanted channel connecting drain and source',
        'It has no oxide layer',
        'Its gate is directly tied to the substrate',
        'It uses metal instead of semiconductor for the body',
      ],
      answerIndex: 0,
      explainEN:
        'The depletion device is built with a pre-existing physical channel, so it conducts (Id = IDSS) even at VGS = 0; the enhancement device channel must be induced.',
      explainHI:
        'depletion device एक पहले से मौजूद भौतिक channel के साथ बना होता है, इसलिए वह VGS = 0 पर भी conduct करता है (Id = IDSS); enhancement device की channel induce करनी पड़ती है।',
    },
    {
      questionEN: 'In the saturation region, the drain current of a MOSFET is given by:',
      questionHI: 'saturation region में, एक MOSFET का drain current किससे दिया जाता है:',
      options: [
        'Id = k[(VGS - Vt)VDS - VDS^2/2]',
        'Id = (k/2)(VGS - Vt)^2',
        'Id = VDS / RDS',
        'Id = beta * Ib',
      ],
      answerIndex: 1,
      explainEN:
        'Once the channel pinches off (VDS >= VGS - Vt), Id = (k/2)(VGS - Vt)^2, depending on the overdrive squared and ideally not on VDS.',
      explainHI:
        'channel के pinch off होते ही (VDS >= VGS - Vt), Id = (k/2)(VGS - Vt)^2, जो overdrive के वर्ग पर निर्भर है और आदर्श रूप से VDS पर नहीं।',
    },
    {
      questionEN: 'What does the threshold voltage Vt represent?',
      questionHI: 'threshold voltage Vt क्या दर्शाता है?',
      options: [
        'The voltage at which the oxide breaks down',
        'The minimum VGS required to form a channel and allow measurable Id',
        'The maximum drain-source voltage allowed',
        'The voltage that turns the device permanently off',
      ],
      answerIndex: 1,
      explainEN:
        'Vt is the minimum gate-source voltage that inverts the surface into a channel; below Vt the device is off, above it current can flow.',
      explainHI:
        'Vt वह न्यूनतम gate-source voltage है जो सतह को एक channel में invert कर देता है; Vt के नीचे device off है, ऊपर current बह सकता है।',
    },
    {
      questionEN: 'Applying a NEGATIVE VGS to a depletion-type nMOS does what to its channel?',
      questionHI: 'एक depletion-type nMOS पर NEGATIVE VGS लगाने से उसकी channel का क्या होता है?',
      options: [
        'Widens the channel and increases Id above IDSS',
        'Has no effect because the gate is insulated',
        'Narrows the channel and reduces Id below IDSS',
        'Destroys the oxide layer',
      ],
      answerIndex: 2,
      explainEN:
        'Negative gate potential pushes electrons toward the substrate to recombine with holes, restricting the channel - depletion mode reduces Id below IDSS.',
      explainHI:
        'negative gate potential electrons को substrate की तरफ़ धकेलता है ताकि वे holes से recombine हों, channel को सीमित करता है - depletion mode Id को IDSS से नीचे कर देता है।',
    },
    {
      questionEN: 'In the parameter k = mu*Cox*(W/L), what does increasing the W/L ratio do?',
      questionHI: 'parameter k = mu*Cox*(W/L) में, W/L ratio बढ़ाने से क्या होता है?',
      options: [
        'Decreases the drain current for a given overdrive',
        'Increases k and therefore the drain current',
        'Raises the threshold voltage Vt',
        'Has no effect on current',
      ],
      answerIndex: 1,
      explainEN:
        'k scales with the width-to-length ratio; a wider/shorter channel raises k, so more drain current flows for the same (VGS - Vt).',
      explainHI:
        'k, width-to-length ratio के साथ बढ़ता है; एक चौड़ा/छोटा channel k बढ़ाता है, इसलिए उसी (VGS - Vt) के लिए ज़्यादा drain current बहता है।',
    },
    {
      questionEN:
        'During channel formation in an enhancement nMOS, the substrate surface "inverts". This means:',
      questionHI:
        'एक enhancement nMOS में channel बनते समय substrate की सतह "invert" होती है। इसका मतलब:',
      options: [
        'The p-type surface becomes n-type as electrons accumulate under the oxide',
        'The oxide turns into a conductor',
        'The drain and source swap roles',
        'The gate voltage reverses polarity',
      ],
      answerIndex: 0,
      explainEN:
        'A positive gate field repels holes and pulls minority electrons to the surface; once enough gather, the p-type surface inverts to n-type, forming the channel.',
      explainHI:
        'एक positive gate field holes को दूर धकेलता है और minority electrons को सतह तक खींचता है; पर्याप्त जमा होते ही p-type सतह n-type में invert हो जाती है, channel बन जाती है।',
    },
  ],
};
