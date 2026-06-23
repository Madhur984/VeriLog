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
        'A MOSFET is a voltage-controlled switch: you press a voltage on a sealed gate and a river of current flows on the other side - but no current ever enters the gate.',
        'Central picture for the whole module - a waterpark sluice gate: gate voltage = water pressure on a sealed glass gate, no current into the gate.',
        'You will meet two architectures: the Enhancement MOSFET (a gate that starts fully shut, Normally OFF) and the Depletion MOSFET (a gate built already cracked open, Normally ON).',
        'The sealed glass plate is the silicon-dioxide (SiO2) insulator; the pressure is VGS; the threshold pressure is Vt; the river is the drain current Id.',
        'By the end you will derive the threshold voltage, the triode and saturation current laws, and see why nMOS and pMOS mirror each other in CMOS.',
      ],
      theoryHI: [
        'MOSFET एक voltage-controlled switch है: आप एक sealed gate पर voltage का दबाव डालते हैं और दूसरी तरफ़ current की एक नदी बहने लगती है - पर gate में current कभी घुसता ही नहीं।',
        'पूरे module की मुख्य तस्वीर - एक waterpark sluice gate: gate voltage = एक sealed glass gate पर पानी का दबाव, gate में कोई current नहीं।',
        'आप दो architectures से मिलेंगे: Enhancement MOSFET (एक gate जो पूरी तरह बंद शुरू होता है, Normally OFF) और Depletion MOSFET (एक gate जो पहले से थोड़ा खुला बना होता है, Normally ON)।',
        'वह sealed glass plate है silicon-dioxide (SiO2) insulator; दबाव है VGS; threshold दबाव है Vt; नदी है drain current Id।',
        'अंत तक आप threshold voltage, triode और saturation current laws derive करेंगे, और देखेंगे कि CMOS में nMOS और pMOS एक-दूसरे का आईना क्यों हैं।',
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
        'Watch the lesson on MOSFET construction and operation before the deep dive.',
        'It frames the one idea: a thin SiO2 oxide insulates the gate, so you control the device with a field (VGS), not a current.',
        'It walks the M-O-S stack: Metal contacts, a thin Oxide insulator, and the Semiconductor substrate below.',
        'It contrasts Enhancement (Normally OFF, channel induced) with Depletion (Normally ON, channel implanted).',
        'Keep the sluice-gate picture in mind: press the sealed glass past a threshold and the river starts to flow.',
      ],
      theoryHI: [
        'गहराई में जाने से पहले MOSFET construction और operation का lesson देखें।',
        'यह एक विचार रखता है: एक पतला SiO2 oxide gate को insulate करता है, इसलिए आप device को एक field (VGS) से control करते हैं, current से नहीं।',
        'यह M-O-S stack दिखाता है: Metal contacts, एक पतला Oxide insulator, और नीचे Semiconductor substrate।',
        'यह Enhancement (Normally OFF, channel induced) की तुलना Depletion (Normally ON, channel implanted) से करता है।',
        'sluice-gate की तस्वीर याद रखें: sealed glass को threshold के पार दबाइए और नदी बहने लगती है।',
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
        'MOSFET = Metal-Oxide-Semiconductor Field-Effect Transistor: a voltage-controlled switch with three working terminals - Gate (G), Drain (D), Source (S) - plus a Body/Substrate (B).',
        'The Gate sits on a very thin layer of silicon dioxide (SiO2) that insulates it completely from the channel below - the metal gate never touches the semiconductor.',
        'Because of that oxide, almost no current flows into the gate: you control the device purely by VGS (an electric field), not by injecting current.',
        'This is the sluice-gate idea exactly - you press on sealed glass, and the water never enters your hand.',
        'The field reaches THROUGH the oxide and reshapes the semiconductor surface - this field effect is what gives the device its name.',
        'Key facts: Ig is about 0 (gate is oxide-insulated); the control variable is VGS, a voltage and not a current.',
      ],
      theoryHI: [
        'MOSFET = Metal-Oxide-Semiconductor Field-Effect Transistor: एक voltage-controlled switch जिसके तीन working terminals हैं - Gate (G), Drain (D), Source (S) - साथ में Body/Substrate (B)।',
        'Gate, silicon dioxide (SiO2) की एक बहुत पतली परत पर बैठता है जो उसे नीचे के channel से पूरी तरह insulate करती है - metal gate semiconductor को कभी छूता ही नहीं।',
        'उस oxide की वजह से gate में लगभग कोई current नहीं जाता: आप device को सिर्फ़ VGS (एक electric field) से control करते हैं, current डालकर नहीं।',
        'यही बिल्कुल sluice-gate वाला विचार है - आप sealed glass पर दबाव डालते हैं, और पानी कभी आपके हाथ में नहीं आता।',
        'वह field oxide के आर-पार पहुँचकर semiconductor की सतह को reshape करता है - यही field effect device को इसका नाम देता है।',
        'मुख्य तथ्य: Ig लगभग 0 है (gate oxide-insulated है); control variable है VGS, एक voltage न कि current।',
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
        'All field-effect transistors (FETs) split into three branches: JFET, MESFET, and MOSFET.',
        'The MOSFET is the dominant type in digital and analog ICs precisely because its insulated gate draws almost no current.',
        'MOSFETs come in two flavours: Depletion-Type (Normally ON - conducts at VGS = 0) and Enhancement-Type (Normally OFF - blocks at VGS = 0).',
        'Each flavour exists for both polarities: nMOS (electron channel) and pMOS (hole channel) - giving the full set of switches CMOS logic needs.',
        'In sluice-gate terms: a depletion gate is built cracked open (flows on its own); an enhancement gate is built fully shut (must be pressed open).',
        'Mappings: FET -> {JFET, MESFET, MOSFET}; MOSFET -> {Depletion (Normally ON), Enhancement (Normally OFF)}.',
      ],
      theoryHI: [
        'सभी field-effect transistors (FETs) तीन शाखाओं में बँटते हैं: JFET, MESFET, और MOSFET।',
        'MOSFET digital और analog ICs में प्रमुख type है, ठीक इसलिए क्योंकि उसका insulated gate लगभग कोई current नहीं खींचता।',
        'MOSFETs दो किस्मों में आते हैं: Depletion-Type (Normally ON - VGS = 0 पर conduct करता है) और Enhancement-Type (Normally OFF - VGS = 0 पर block करता है)।',
        'हर किस्म दोनों polarities के लिए मौजूद है: nMOS (electron channel) और pMOS (hole channel) - जिससे CMOS logic को चाहिए वे सभी switches मिल जाते हैं।',
        'sluice-gate की भाषा में: एक depletion gate थोड़ा खुला बना होता है (अपने-आप बहता है); एक enhancement gate पूरी तरह बंद बना होता है (दबाकर खोलना पड़ता है)।',
        'Mappings: FET -> {JFET, MESFET, MOSFET}; MOSFET -> {Depletion (Normally ON), Enhancement (Normally OFF)}।',
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
        'Every MOSFET is a sandwich: METAL contacts on top, a thin OXIDE (SiO2) insulator in the middle, and the SEMICONDUCTOR substrate below - that is literally the M-O-S in the name.',
        'The substrate (Body) here is p-type silicon; the source and drain are heavily n-doped (n+) regions diffused into it.',
        'The SiO2 layer is a dielectric (an insulator). Under an external field it sets up an opposing internal field - it transmits the field rather than conducting through it.',
        'This is the sealed glass plate: it lets the gate influence pass through as a field while blocking any actual current.',
        'Because the gate and channel form a parallel-plate capacitor, the oxide capacitance per area is Cox = eps_ox / t_ox - thinner oxide means stronger control.',
        'Stack = Metal | Oxide (SiO2) | Semiconductor; SiO2 is a dielectric, not a conductor.',
      ],
      theoryHI: [
        'हर MOSFET एक sandwich है: ऊपर METAL contacts, बीच में एक पतला OXIDE (SiO2) insulator, और नीचे SEMICONDUCTOR substrate - यही नाम का M-O-S है।',
        'यहाँ substrate (Body) p-type silicon है; source और drain उसमें diffuse किए गए भारी n-doped (n+) regions हैं।',
        'SiO2 परत एक dielectric (insulator) है। बाहरी field के नीचे यह एक विपरीत internal field बना देती है - यह field को transmit करती है, उसमें से conduct नहीं करती।',
        'यही sealed glass plate है: यह gate के असर को एक field के रूप में आर-पार जाने देती है पर किसी असली current को रोक देती है।',
        'चूँकि gate और channel एक parallel-plate capacitor बनाते हैं, oxide capacitance per area है Cox = eps_ox / t_ox - पतला oxide यानी मज़बूत control।',
        'Stack = Metal | Oxide (SiO2) | Semiconductor; SiO2 एक dielectric है, conductor नहीं।',
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
        'The gate is separated from the channel by the thin SiO2 layer, an electrical insulator with a very large band gap.',
        'Gate plus channel form a capacitor, and in DC steady state a capacitor passes no current: Ig = Cox*A*(dVGS/dt) -> 0 for a fixed VGS.',
        'Real oxide leakage is only on the order of femto- to pico-amps (tunneling at very thin oxides), utterly negligible next to the drain current.',
        'So the MOSFET is a voltage-controlled device: Id is set by the gate FIELD (VGS), not by gate current, and the dc input resistance is enormous (10^9 ohm and up).',
        'Contrast with a BJT, whose base draws a real current Ib = Ic/beta because its base-emitter junction is forward-biased with no insulator.',
        'Sluice-gate truth: you press on sealed glass and your effort bends the flow on the far side - none of it leaks back through the glass into your hand.',
      ],
      theoryHI: [
        'gate को channel से वह पतली SiO2 परत अलग करती है, एक electrical insulator जिसका band gap बहुत बड़ा है।',
        'gate और channel मिलकर एक capacitor बनाते हैं, और DC steady state में capacitor कोई current नहीं गुज़ारता: एक स्थिर VGS पर Ig = Cox*A*(dVGS/dt) -> 0।',
        'असली oxide leakage सिर्फ़ femto- से pico-amps के स्तर का होता है (बहुत पतले oxides पर tunneling), जो drain current के सामने बिल्कुल नगण्य है।',
        'तो MOSFET एक voltage-controlled device है: Id, gate FIELD (VGS) से तय होता है, gate current से नहीं, और dc input resistance बहुत बड़ा होता है (10^9 ohm और ऊपर)।',
        'इसकी तुलना BJT से करें, जिसका base असली current Ib = Ic/beta खींचता है क्योंकि उसका base-emitter junction बिना किसी insulator के forward-biased है।',
        'sluice-gate सच: आप sealed glass पर दबाव डालते हैं और आपकी मेहनत दूसरी तरफ़ की धारा को मोड़ती है - उसमें से कुछ भी glass के पार आपके हाथ में वापस नहीं रिसता।',
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
        'A Depletion MOSFET is manufactured with a physical n-channel already implanted, electrically connecting drain to source.',
        'Because the channel pre-exists, drain current Id flows even when VGS = 0 V - the device is Normally ON.',
        'This baseline zero-gate current has a name: IDSS (drain-to-source current with the gate shorted to source).',
        'Its special power is dual-mode operation - you can push it BOTH ways from IDSS.',
        'Depletion mode (negative VGS): a negative gate pushes electrons toward the p-substrate to recombine with holes, narrowing the channel - so Id < IDSS.',
        'Enhancement mode (positive VGS): a positive gate attracts extra free electrons, widening the channel - so Id > IDSS. In sluice-gate terms, the gate is built already cracked open; the river runs on its own, and pressure widens or squeezes it.',
      ],
      theoryHI: [
        'एक Depletion MOSFET बनते समय ही एक भौतिक n-channel के साथ बना होता है, जो drain को source से electrically जोड़ देता है।',
        'चूँकि channel पहले से मौजूद है, drain current Id तब भी बहता है जब VGS = 0 V - device Normally ON है।',
        'इस baseline zero-gate current का एक नाम है: IDSS (gate को source से short करके drain-to-source current)।',
        'इसकी ख़ास ताक़त है dual-mode operation - आप इसे IDSS से दोनों तरफ़ धकेल सकते हैं।',
        'Depletion mode (negative VGS): एक negative gate electrons को p-substrate की तरफ़ धकेलता है ताकि वे holes से recombine हों, channel सिकुड़ता है - तो Id < IDSS।',
        'Enhancement mode (positive VGS): एक positive gate अतिरिक्त free electrons खींचता है, channel चौड़ा होता है - तो Id > IDSS। sluice-gate की भाषा में, gate पहले से थोड़ा खुला बना है; नदी अपने-आप बहती है, और दबाव उसे चौड़ा करता है या दबाता है।',
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
        'An Enhancement MOSFET has NO physical channel as a manufactured component - just source and drain n-regions in a p-type body, separated by bare substrate.',
        'At VGS = 0 V the device is entirely non-conducting: Id = 0 A, because no path connects drain to source. It is Normally OFF.',
        'To turn it on you must apply enough positive VGS to electrically create (induce) a channel on the fly.',
        'In sluice-gate terms: the gate starts fully shut - the river cannot flow at all until you press hard enough to open a path.',
        'This is the device CMOS logic is built from, paired with its pMOS mirror so one is on while the other is off.',
        'Key facts: at VGS = 0, Id = 0 A (no channel); the channel must be electrically induced, not implanted.',
      ],
      theoryHI: [
        'एक Enhancement MOSFET में बनी-बनाई कोई भौतिक channel नहीं होती - बस एक p-type body में source और drain n-regions, जिनके बीच नंगा substrate है।',
        'VGS = 0 V पर device पूरी तरह non-conducting है: Id = 0 A, क्योंकि कोई path drain को source से नहीं जोड़ता। यह Normally OFF है।',
        'इसे चालू करने के लिए आपको इतना positive VGS लगाना पड़ता है कि एक channel हाथों-हाथ electrically बन (induce हो) जाए।',
        'sluice-gate की भाषा में: gate पूरी तरह बंद शुरू होता है - नदी तब तक बह ही नहीं सकती जब तक आप इतना ज़ोर से न दबाएँ कि एक path खुल जाए।',
        'यही वह device है जिससे CMOS logic बनती है, अपने pMOS आईने के साथ जोड़ी में, ताकि एक ON हो तो दूसरा OFF।',
        'मुख्य तथ्य: VGS = 0 पर, Id = 0 A (कोई channel नहीं); channel को electrically induce करना पड़ता है, वह implanted नहीं होती।',
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
        'Apply +VGS to the gate. Step 1 (Charge Repulsion): the positive field pushes the p-type substrate majority holes DOWN, away from the oxide, clearing a depletion region at the surface.',
        'Step 2 (Electron Accumulation): the same field then pulls minority electrons UP toward the SiO2, piling them against the oxide.',
        'When enough electrons gather, the surface flips from p-type to n-type - this is INVERSION. An induced n-channel now bridges source and drain.',
        'The minimum VGS that establishes this channel and allows measurable Id is the THRESHOLD VOLTAGE Vt. Below Vt: off. Above Vt: on.',
        'This is exactly the sluice gate cracking open once your pressure passes the threshold pressure.',
        'Conditions: VGS < Vt -> no channel -> Id = 0 (cutoff); VGS > Vt -> inversion layer forms -> Id flows. Step through the full Vt derivation in the panel below.',
      ],
      theoryHI: [
        'gate पर +VGS लगाइए। Step 1 (Charge Repulsion): positive field p-type substrate के majority holes को oxide से दूर नीचे धकेलता है, सतह पर एक depletion region साफ़ कर देता है।',
        'Step 2 (Electron Accumulation): वही field फिर minority electrons को SiO2 की तरफ़ ऊपर खींचता है, उन्हें oxide से सटाकर जमा कर देता है।',
        'जब पर्याप्त electrons जमा हो जाते हैं, सतह p-type से n-type में पलट जाती है - यही INVERSION है। अब एक induced n-channel source और drain को जोड़ देता है।',
        'वह न्यूनतम VGS जो यह channel बनाता है और measurable Id बहने देता है, वही THRESHOLD VOLTAGE Vt है। Vt के नीचे: off। Vt के ऊपर: on।',
        'यह बिल्कुल वही sluice gate है जो आपके दबाव के threshold दबाव पार करते ही खुल जाता है।',
        'शर्तें: VGS < Vt -> कोई channel नहीं -> Id = 0 (cutoff); VGS > Vt -> inversion layer बनती है -> Id बहता है। पूरी Vt derivation नीचे के panel में step-by-step देखें।',
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
        'Cutoff: VGS < Vt. No channel, Id = 0. The switch is OFF.',
        'Triode / ohmic / linear region: VGS > Vt and VDS small (VDS < VGS - Vt). A continuous channel acts like a voltage-controlled resistor; Id rises with VDS. Id = k[(VGS - Vt)*VDS - VDS^2/2].',
        'Saturation / active region: VGS > Vt and VDS large (VDS >= VGS - Vt). The channel pinches off near the drain; Id becomes (ideally) independent of VDS: Id = (k/2)*(VGS - Vt)^2.',
        'The overdrive voltage Vov = VGS - Vt - how far past threshold you press the gate - sets how much current flows. More overdrive = wider channel = more river.',
        'k = mu*Cox*(W/L) bundles the physics: carrier mobility mu, oxide capacitance per area Cox, and the channel width-to-length ratio W/L.',
        'The pinch-off boundary sits exactly at VDS = VGS - Vt: substitute it into the triode law and you land precisely on the saturation law - one curve flows into the other.',
      ],
      theoryHI: [
        'Cutoff: VGS < Vt। कोई channel नहीं, Id = 0। switch OFF है।',
        'Triode / ohmic / linear region: VGS > Vt और VDS छोटा (VDS < VGS - Vt)। एक लगातार channel एक voltage-controlled resistor की तरह काम करता है; Id, VDS के साथ बढ़ता है। Id = k[(VGS - Vt)*VDS - VDS^2/2]।',
        'Saturation / active region: VGS > Vt और VDS बड़ा (VDS >= VGS - Vt)। channel drain के पास pinch off हो जाता है; Id (आदर्श रूप से) VDS से स्वतंत्र हो जाता है: Id = (k/2)*(VGS - Vt)^2।',
        'overdrive voltage Vov = VGS - Vt - आप gate को threshold के कितने पार दबाते हैं - तय करता है कितना current बहेगा। ज़्यादा overdrive = चौड़ा channel = ज़्यादा नदी।',
        'k = mu*Cox*(W/L) physics को बाँधता है: carrier mobility mu, oxide capacitance per area Cox, और channel की width-to-length ratio W/L।',
        'pinch-off की सीमा ठीक VDS = VGS - Vt पर है: इसे triode law में रखिए और आप बिल्कुल saturation law पर पहुँचते हैं - एक curve दूसरे में बह जाता है।',
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
        'Physical channel: Depletion = implanted (present); Enhancement = absent (must be induced).',
        'Default state at VGS = 0: Depletion conducts (Id = IDSS, Normally ON); Enhancement blocks (Id = 0 A, Normally OFF).',
        'Operating modes: Depletion works in BOTH depletion and enhancement modes; Enhancement works in enhancement mode only.',
        'Conduction catalyst: in a depletion device the gate voltage MODULATES an existing flow; in an enhancement device current requires CROSSING the threshold voltage Vt first.',
        'Polarity note: swap n-type for p-type and you get pMOS, where the channel is holes and the controlling voltages reverse sign.',
        'Turn-on signs: nMOS conducts with VGS > Vt (Vt > 0); pMOS conducts with VGS < Vt (Vt < 0). In CMOS an enhancement nMOS and an enhancement pMOS pair so one is on while the other is off - near-zero static power.',
      ],
      theoryHI: [
        'भौतिक channel: Depletion = implanted (मौजूद); Enhancement = अनुपस्थित (induce करनी पड़ती है)।',
        'VGS = 0 पर default state: Depletion conduct करता है (Id = IDSS, Normally ON); Enhancement block करता है (Id = 0 A, Normally OFF)।',
        'Operating modes: Depletion दोनों depletion और enhancement modes में काम करता है; Enhancement सिर्फ़ enhancement mode में।',
        'Conduction catalyst: एक depletion device में gate voltage एक मौजूद बहाव को MODULATE करता है; एक enhancement device में current के लिए पहले threshold voltage Vt CROSS करना ज़रूरी है।',
        'Polarity note: n-type को p-type से बदलिए और pMOS मिलता है, जहाँ channel holes का है और control करने वाले voltages का sign उलट जाता है।',
        'Turn-on signs: nMOS, VGS > Vt पर conduct करता है (Vt > 0); pMOS, VGS < Vt पर (Vt < 0)। CMOS में एक enhancement nMOS और एक enhancement pMOS जोड़ी बनाते हैं ताकि एक ON हो तो दूसरा OFF - लगभग शून्य static power।',
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
        'Flip each card: term on the front, the plain explanation on the back.',
        'These eight cover what MOSFET means, why Ig is about 0, the threshold voltage, enhancement vs depletion, triode vs saturation, inversion, and nMOS vs pMOS.',
        'Try to explain each back in your own words before flipping - that is real recall.',
      ],
      theoryHI: [
        'हर card को पलटें: सामने term, पीछे सीधी व्याख्या।',
        'ये आठ cards बताते हैं कि MOSFET का मतलब क्या है, Ig लगभग 0 क्यों है, threshold voltage, enhancement बनाम depletion, triode बनाम saturation, inversion, और nMOS बनाम pMOS।',
        'पलटने से पहले हर पीछे वाली बात अपने शब्दों में बताने की कोशिश करें - यही असली recall है।',
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
        'Eight multiple-choice questions across the gate, the channel, and the current laws.',
        'Read every option - the wrong ones are the misconceptions this module exists to break.',
        'Explanations follow each answer so a miss becomes a lesson.',
      ],
      theoryHI: [
        'gate, channel, और current laws पर आठ multiple-choice सवाल।',
        'हर option पढ़ें - ग़लत वाले वही misconceptions हैं जिन्हें तोड़ने के लिए यह module बना है।',
        'हर जवाब के बाद explanation है ताकि चूक भी एक सबक़ बन जाए।',
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
        'The sealed gate: a thin SiO2 oxide insulates the gate, so Ig is about 0 and you control the device by VGS, a field - the sealed glass sluice gate.',
        'The stack: Metal | Oxide (SiO2) | Semiconductor; the oxide is a dielectric forming Cox = eps_ox / t_ox.',
        'Enhancement (Normally OFF, Id = 0 at VGS = 0): no channel until you press past Vt to induce one by inversion.',
        'Depletion (Normally ON, Id = IDSS at VGS = 0): a channel is implanted; the gate widens it (+VGS) or squeezes it shut (-VGS).',
        'The laws: cutoff (VGS < Vt, Id = 0); triode Id = k[(VGS - Vt)VDS - VDS^2/2]; saturation Id = (k/2)(VGS - Vt)^2; with k = mu*Cox*(W/L) and the boundary at VDS = VGS - Vt.',
        'nMOS vs pMOS: nMOS turns on with VGS > Vt (Vt > 0); pMOS with VGS < Vt (Vt < 0). Sources for the formulas and definitions are listed below.',
      ],
      theoryHI: [
        'sealed gate: एक पतला SiO2 oxide gate को insulate करता है, इसलिए Ig लगभग 0 है और आप device को VGS, एक field से control करते हैं - वही sealed glass sluice gate।',
        'stack: Metal | Oxide (SiO2) | Semiconductor; oxide एक dielectric है जो Cox = eps_ox / t_ox बनाता है।',
        'Enhancement (Normally OFF, VGS = 0 पर Id = 0): कोई channel नहीं जब तक आप Vt के पार दबाकर inversion से एक induce न करें।',
        'Depletion (Normally ON, VGS = 0 पर Id = IDSS): एक channel implanted है; gate उसे चौड़ा करता है (+VGS) या बंद करता है (-VGS)।',
        'laws: cutoff (VGS < Vt, Id = 0); triode Id = k[(VGS - Vt)VDS - VDS^2/2]; saturation Id = (k/2)(VGS - Vt)^2; जहाँ k = mu*Cox*(W/L) और सीमा VDS = VGS - Vt पर।',
        'nMOS बनाम pMOS: nMOS, VGS > Vt पर चालू होता है (Vt > 0); pMOS, VGS < Vt पर (Vt < 0)। formulas और definitions के sources नीचे सूचीबद्ध हैं।',
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
