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
        'Picture the transistor as a three-zone shopping mall: a jam-packed ENTRANCE (emitter), a razor-thin under-staffed CORRIDOR (base), and a wide RECEIVING HALL (collector).',
        'A featherweight trickle of shoppers turning into the corridor (the base current Ib) steers a heavyweight river pouring into the hall (the collector current Ic). That is amplification.',
        'This module builds the BJT from the silicon up: sizes and doping, NPN vs PNP, the two PN junctions, carrier flow, the three operating regions, and the output curves.',
        'Big idea in one line: a tiny base current controls a large collector current - Ic = beta*Ib - because the base is too thin to absorb the crowd.',
        'By the end you will see why amplification is not magic but the inevitable result of geometry + biasing + conservation of charge.',
      ],
      theoryHI: [
        'transistor को एक तीन-zone वाला shopping mall समझिए: एक खचाखच भरा ENTRANCE (emitter), एक बेहद पतला under-staffed CORRIDOR (base), और एक चौड़ा RECEIVING HALL (collector)।',
        'corridor में मुड़ते कुछ हल्के-फुल्के shoppers की trickle (base current Ib) उस भारी river को steer करती है जो hall में गिरती है (collector current Ic)। यही amplification है।',
        'यह module BJT को silicon से बनाता है: sizes और doping, NPN बनाम PNP, दो PN junctions, carrier flow, तीन operating regions, और output curves।',
        'मुख्य विचार एक लाइन में: एक छोटी सी base current एक बड़ी collector current को control करती है - Ic = beta*Ib - क्योंकि base इतना पतला है कि crowd को absorb ही नहीं कर सकता।',
        'अंत तक आप देखेंगे कि amplification कोई जादू नहीं, बल्कि geometry + biasing + charge के conservation का inevitable नतीजा है।',
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
        'Watch the lesson before the deep dive: it tours the BJT as the Silicon Shopping Mall - entrance, corridor, hall.',
        'It frames the central claim: a small base current Ib steers a large collector current Ic, so Ic = beta*Ib.',
        'It walks the three regions: active (amplify), saturation (closed switch), cut-off (open switch).',
        'Watch for the asymmetry - heavy emitter doping, thin lightly-doped base, wide collector - that is the entire secret.',
        'Keep in mind the conservation law you will lean on the whole module: Ie = Ic + Ib.',
      ],
      theoryHI: [
        'गहराई में जाने से पहले lesson देखें: यह BJT को Silicon Shopping Mall की तरह घुमाता है - entrance, corridor, hall।',
        'यह मुख्य दावा रखता है: एक छोटी base current Ib एक बड़ी collector current Ic को steer करती है, यानी Ic = beta*Ib।',
        'यह तीन regions दिखाता है: active (amplify), saturation (closed switch), cut-off (open switch)।',
        'उस asymmetry पर ध्यान दें - भारी emitter doping, पतला lightly-doped base, चौड़ा collector - वही पूरा राज़ है।',
        'पूरे module में जिस conservation law पर टिकेंगे उसे याद रखें: Ie = Ic + Ib।',
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
        'A Bipolar Junction Transistor (BJT) is a three-terminal semiconductor: Emitter (E), Base (B), Collector (C), built from two PN junctions back-to-back.',
        '"Bipolar" means BOTH electrons and holes carry current - unlike a unipolar FET that uses only one carrier type.',
        'The three regions are deliberately different in size and doping; this asymmetry is the entire secret of amplification, not an accident.',
        'Mall picture: entrance (emitter), thin corridor (base), receiving hall (collector) - three connected zones, one crowd flow.',
        'Two junctions sit inside: the emitter-base junction (EBJ) and the collector-base junction (CBJ). How you bias each one sets the whole behaviour.',
      ],
      theoryHI: [
        'एक Bipolar Junction Transistor (BJT) एक तीन-terminal semiconductor है: Emitter (E), Base (B), Collector (C), जो दो PN junctions को back-to-back जोड़कर बनता है।',
        '"Bipolar" का मतलब है दोनों - electrons और holes - current ले जाते हैं, उस unipolar FET के विपरीत जो सिर्फ़ एक carrier type इस्तेमाल करता है।',
        'तीनों regions जानबूझकर size और doping में अलग हैं; यह asymmetry ही amplification का पूरा राज़ है, कोई संयोग नहीं।',
        'Mall picture: entrance (emitter), पतला corridor (base), receiving hall (collector) - तीन जुड़े zones, एक crowd flow।',
        'अंदर दो junctions बैठते हैं: emitter-base junction (EBJ) और collector-base junction (CBJ)। हर एक को कैसे bias करते हैं, वही पूरा behaviour तय करता है।',
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
        'The EMITTER is HEAVILY doped - its job is to inject a flood of majority carriers into the base.',
        'The BASE is extraordinarily THIN (about 0.001 in) and LIGHTLY doped, so very few carriers recombine there; most pass straight through.',
        'The COLLECTOR is the largest, lightly-doped outer region that receives the carriers; it is also physically wide (about 0.150 in) to dissipate heat.',
        'The roughly 150:1 width ratio (device width vs base thickness) is what stops the crowd from being absorbed inside the corridor.',
        'Mall picture: a jam-packed entrance, a paper-thin under-staffed corridor, and a big receiving hall.',
      ],
      theoryHI: [
        'EMITTER भारी doped होता है - इसका काम base में majority carriers की बाढ़ inject करना है।',
        'BASE असाधारण रूप से पतला (लगभग 0.001 in) और lightly doped होता है, इसलिए वहाँ बहुत कम carriers recombine करते हैं; ज़्यादातर सीधे पार निकल जाते हैं।',
        'COLLECTOR सबसे बड़ा, lightly-doped बाहरी region है जो carriers को receive करता है; यह heat निकालने के लिए physically चौड़ा भी होता है (लगभग 0.150 in)।',
        'लगभग 150:1 का width ratio (device width बनाम base thickness) ही crowd को corridor के अंदर absorb होने से रोकता है।',
        'Mall picture: खचाखच भरा entrance, paper-thin under-staffed corridor, और एक बड़ा receiving hall।',
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
        'NPN = two n-type layers sandwiching one p-type base; PNP = two p-type layers sandwiching one n-type base.',
        'In an NPN the majority carriers are ELECTRONS and minority carriers are holes; in a PNP it is reversed (majority = holes).',
        'The symbol difference is the emitter arrow: NPN arrow points OUT of the emitter ("Not Pointing iN"); PNP arrow points IN.',
        'The arrow shows conventional current direction at the emitter, which sets the supply polarity for the whole circuit.',
        'Both types obey identical equations - only the carrier type and the voltage polarities flip. Mall picture: same mall, doors hung the opposite way.',
      ],
      theoryHI: [
        'NPN = दो n-type layers एक p-type base को sandwich करती हैं; PNP = दो p-type layers एक n-type base को sandwich करती हैं।',
        'NPN में majority carriers ELECTRONS होते हैं और minority carriers holes; PNP में यह उल्टा है (majority = holes)।',
        'symbol का फर्क emitter arrow है: NPN arrow emitter से BAHAR की ओर ("Not Pointing iN"); PNP arrow ANDAR की ओर।',
        'arrow emitter पर conventional current की दिशा दिखाता है, जो पूरे circuit की supply polarity तय करता है।',
        'दोनों types एक जैसे equations मानते हैं - सिर्फ़ carrier type और voltage polarities पलटती हैं। Mall picture: वही mall, दरवाज़े उलटी तरफ़ लगे।',
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
        'At each PN junction a DEPLETION REGION forms - a carrier-free zone of fixed charges that acts like a barrier.',
        'FORWARD bias NARROWS the depletion region, collapsing the barrier and letting a heavy flood of majority carriers cross.',
        'REVERSE bias WIDENS the depletion region, raising the barrier so only a tiny minority-carrier (leakage) current crosses.',
        'A BJT works by holding one junction forward (let the crowd in) and one reverse (sweep the crowd onward and block backflow).',
        'Mall picture: forward = turnstile spun the easy way so crowds flood in; reverse = a door that only sweeps people one way.',
      ],
      theoryHI: [
        'हर PN junction पर एक DEPLETION REGION बनता है - fixed charges का carrier-free zone जो एक barrier की तरह काम करता है।',
        'FORWARD bias depletion region को SANKRA (narrow) कर देता है, barrier गिरा देता है और majority carriers की भारी बाढ़ को पार जाने देता है।',
        'REVERSE bias depletion region को CHAUDA (wide) कर देता है, barrier ऊँचा कर देता है ताकि सिर्फ़ एक छोटी minority-carrier (leakage) current पार करे।',
        'एक BJT एक junction को forward (crowd अंदर आने दो) और एक को reverse (crowd को आगे sweep करो और backflow रोको) रखकर काम करता है।',
        'Mall picture: forward = turnstile आसान तरफ़ घुमाया गया ताकि crowd अंदर बाढ़ की तरह आए; reverse = वह दरवाज़ा जो लोगों को सिर्फ़ एक तरफ़ sweep करता है।',
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
        'The emitter injects a large current; about 98 to 99 percent of those carriers shoot through the thin base and are collected - becoming Ic.',
        'Only about 1 to 2 percent recombine in the base or exit the base terminal, forming the tiny base current Ib (microamps).',
        "By Kirchhoff's Current Law, everything in must equal everything out: Ie = Ic + Ib.",
        'Because Ib is so small, Ic is almost equal to Ie, so alpha = Ic/Ie sits around 0.98 to 0.99.',
        'Mall picture: nearly the whole crowd reaches the receiving hall; only a thin trickle leaks into the corridor.',
      ],
      theoryHI: [
        'emitter एक बड़ी current inject करता है; उन carriers में से लगभग 98 से 99 प्रतिशत पतले base से पार निकलकर collect हो जाते हैं - यही Ic बनते हैं।',
        'सिर्फ़ लगभग 1 से 2 प्रतिशत base में recombine होते हैं या base terminal से बाहर निकलते हैं, यही छोटी base current Ib (microamps) बनाते हैं।',
        "Kirchhoff's Current Law से, जो अंदर जाता है वही बाहर आना चाहिए: Ie = Ic + Ib।",
        'क्योंकि Ib इतना छोटा है, Ic लगभग Ie के बराबर होता है, तो alpha = Ic/Ie लगभग 0.98 से 0.99 के आसपास रहता है।',
        'Mall picture: लगभग पूरी crowd receiving hall तक पहुँचती है; सिर्फ़ एक पतली trickle corridor में leak होती है।',
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
        'ACTIVE: emitter-base junction FORWARD, collector-base junction REVERSE -> linear amplifier; Ic is set by Ib (Ic = beta*Ib).',
        'SATURATION: BOTH junctions forward -> "closed switch", logic ON, Vce near zero, current at its maximum.',
        'CUT-OFF: BOTH junctions reverse -> "open switch", logic OFF, essentially no collector current.',
        'Amplifiers live in the active region; digital logic flips between saturation and cut-off.',
        'Mall picture: active = doors set to steer; saturation = both doors jammed open; cut-off = both doors locked.',
      ],
      theoryHI: [
        'ACTIVE: emitter-base junction FORWARD, collector-base junction REVERSE -> linear amplifier; Ic को Ib तय करता है (Ic = beta*Ib)।',
        'SATURATION: DONO junctions forward -> "closed switch", logic ON, Vce लगभग zero, current अपने maximum पर।',
        'CUT-OFF: DONO junctions reverse -> "open switch", logic OFF, लगभग कोई collector current नहीं।',
        'Amplifiers active region में रहते हैं; digital logic saturation और cut-off के बीच flip करता है।',
        'Mall picture: active = दरवाज़े steer करने के लिए set; saturation = दोनों दरवाज़े jam होकर खुले; cut-off = दोनों दरवाज़े locked।',
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
        'Plotting Ic against Vce for several fixed Ib values gives a fan of nearly-flat curves - the operating map of the device.',
        'ACTIVE region (flat middle): curves are almost horizontal, so Ic depends on Ib (set by the base) and barely on Vce - maximum linearity.',
        'SATURATION region (steep left edge, near Vce = 0): Ic rises sharply and is limited only by the external resistance.',
        'CUT-OFF region (bottom axis, Ib = 0): Ic drops to just the tiny reverse-saturation leakage current Iceo.',
        'Each curve is one value of Ib; stepping Ib up shifts the whole curve up - visual proof of current control.',
      ],
      theoryHI: [
        'कई fixed Ib values के लिए Ic को Vce के against plot करने पर लगभग-flat curves का एक पंखा मिलता है - device का operating map।',
        'ACTIVE region (बीच का flat हिस्सा): curves लगभग horizontal हैं, तो Ic, Ib पर निर्भर करता है (base तय करता है) और Vce पर मुश्किल से - maximum linearity।',
        'SATURATION region (बाएँ का steep किनारा, Vce = 0 के पास): Ic तेज़ी से बढ़ता है और सिर्फ़ external resistance से limited होता है।',
        'CUT-OFF region (नीचे की axis, Ib = 0): Ic गिरकर सिर्फ़ छोटी reverse-saturation leakage current Iceo रह जाती है।',
        'हर curve Ib का एक value है; Ib बढ़ाने पर पूरी curve ऊपर खिसकती है - current control का दृश्य प्रमाण।',
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
        'BETA (beta) = current GAIN: the ratio of DC collector current to base current, beta = Ic/Ib; typically 50 to over 400.',
        'ALPHA (alpha) = Ic/Ie, always just under 1 (typically about 0.99) because almost all of the emitter current reaches the collector.',
        'Alpha and beta are linked: beta = alpha/(1 - alpha) and alpha = beta/(beta + 1).',
        'A high beta means a featherweight base current controls a heavyweight collector current - that IS amplification.',
        'Mall picture: beta = how many shoppers reach the hall per single shopper who turns into the corridor.',
      ],
      theoryHI: [
        'BETA (beta) = current GAIN: DC collector current और base current का ratio, beta = Ic/Ib; आमतौर पर 50 से 400 के ऊपर।',
        'ALPHA (alpha) = Ic/Ie, हमेशा 1 से थोड़ा कम (आमतौर पर लगभग 0.99) क्योंकि लगभग पूरी emitter current collector तक पहुँचती है।',
        'Alpha और beta जुड़े हुए हैं: beta = alpha/(1 - alpha) और alpha = beta/(beta + 1)।',
        'ऊँचा beta मतलब एक हल्की-फुल्की base current एक भारी collector current को control करती है - यही amplification है।',
        'Mall picture: beta = corridor में मुड़ते हर एक shopper के बदले कितने shoppers hall तक पहुँचते हैं।',
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
        'Physical constraint: the ultra-thin, lightly-doped base (about 150:1 geometry) prevents the injected carriers from recombining - they MUST go somewhere.',
        'Operational biasing: the forward EBJ injects the flood, the reverse CBJ sweeps it across as minority-carrier flow into the collector.',
        'Mathematical inevitability: escaping that bottleneck via the tiny base terminal forces a proportionally huge surge at the collector, so beta = Ic/Ib.',
        "Amplification isn't magic; it is geometry + biasing + conservation of charge working together.",
        'Mall picture: a thin corridor that cannot absorb the crowd, plus one-way doors, means a tiny turnstile trickle inevitably steers a massive through-flow.',
      ],
      theoryHI: [
        'Physical constraint: बेहद पतला, lightly-doped base (लगभग 150:1 geometry) injected carriers को recombine होने से रोकता है - उन्हें कहीं न कहीं जाना ही है।',
        'Operational biasing: forward EBJ बाढ़ inject करता है, reverse CBJ उसे minority-carrier flow के रूप में collector में sweep कर देता है।',
        'Mathematical inevitability: उस bottleneck से छोटे base terminal के ज़रिए निकलना collector पर एक proportionally बड़ा surge मजबूर कर देता है, यानी beta = Ic/Ib।',
        'Amplification जादू नहीं है; यह geometry + biasing + charge का conservation मिलकर काम करते हैं।',
        'Mall picture: एक पतला corridor जो crowd absorb नहीं कर सकता, साथ में one-way दरवाज़े, मतलब एक छोटी turnstile trickle अनिवार्य रूप से एक विशाल through-flow को steer कर देती है।',
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
        'Flip each card: term on the front, the plain explanation on the back.',
        'These eight cover the thin base, what bipolar means, alpha, beta, active-region biasing, saturation vs cut-off, depletion-region bias, and NPN vs PNP.',
        'Aim to explain each back in your own words before flipping - that is real recall.',
      ],
      theoryHI: [
        'हर card को पलटें: सामने term, पीछे सीधी व्याख्या।',
        'ये आठ cards पतले base, bipolar का मतलब, alpha, beta, active-region biasing, saturation बनाम cut-off, depletion-region bias, और NPN बनाम PNP को cover करते हैं।',
        'पलटने से पहले हर पीछे वाली बात अपने शब्दों में बताने की कोशिश करें - यही असली recall है।',
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
        'Eight multiple-choice questions. Each tests either the BJT structure or its operation.',
        'Read every option - the wrong ones are the misconceptions this module exists to break.',
        'Explanations follow each answer so a miss becomes a lesson.',
      ],
      theoryHI: [
        'आठ multiple-choice सवाल। हर एक या तो BJT structure जाँचता है या उसका operation।',
        'हर option पढ़ें - ग़लत वाले वही misconceptions हैं जिन्हें तोड़ने के लिए यह module बना है।',
        'हर जवाब के बाद explanation है ताकि चूक भी एक सबक़ बन जाए।',
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
        'The structure: emitter (heavy, injects), base (thin and light, lets the crowd through), collector (wide, receives). Two junctions: EBJ and CBJ.',
        'The conservation law: Ie = Ic + Ib, and because Ib is tiny, alpha = Ic/Ie is just under 1.',
        'The gain: beta = Ic/Ib (50 to 400+); linked by beta = alpha/(1-alpha) and alpha = beta/(beta+1).',
        'The regions: active (EBJ forward, CBJ reverse) amplifies; saturation (both forward) is a closed switch; cut-off (both reverse) is an open switch.',
        'The output map: flat Ic-Vce curves in active prove Ic is set by Ib, not Vce. Next on the track: DC biasing - setting the Q-point.',
      ],
      theoryHI: [
        'Structure: emitter (भारी, inject करता है), base (पतला और हल्का, crowd को गुज़रने देता है), collector (चौड़ा, receive करता है)। दो junctions: EBJ और CBJ।',
        'Conservation law: Ie = Ic + Ib, और चूँकि Ib छोटा है, alpha = Ic/Ie 1 से थोड़ा कम है।',
        'Gain: beta = Ic/Ib (50 से 400+); जुड़े हुए beta = alpha/(1-alpha) और alpha = beta/(beta+1) से।',
        'Regions: active (EBJ forward, CBJ reverse) amplify करता है; saturation (दोनों forward) एक closed switch है; cut-off (दोनों reverse) एक open switch है।',
        'Output map: active में flat Ic-Vce curves साबित करती हैं कि Ic को Ib तय करता है, Vce नहीं। track पर आगे: DC biasing - Q-point set करना।',
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
