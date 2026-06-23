import type { SubContent } from '../_transistor/kit';

export const CONTENT: SubContent = {
  moduleTitle: 'Transistor Topologies & JFETs',
  moduleSubtitle:
    'BJT vs FET - voltage control, near-infinite input resistance, and the pinched-channel physics of the JFET. A garden hose vs a water wheel.',
  scenes: [
    {
      id: 'S00_Cover',
      label: 'The FET vs BJT Showdown',
      kind: 'cover',
      subtitle: 'Two rival ways to control a flow of current',
      theoryEN: [
        'Two devices, two philosophies. The BJT is a water wheel you must keep pushing with your hand - it needs a real input current to stay on.',
        'The FET is a garden hose you control by stepping on it - your foot is a pure voltage that pinches the flow without adding a single drop of water.',
        'A BJT is BIPOLAR (electrons AND holes) and CURRENT-controlled. A FET is UNIPOLAR (one carrier) and VOLTAGE-controlled.',
        'The JFET squeezes its own channel shut from the inside using two reverse-biased p-n cuffs at the gate - so the gate draws almost zero current.',
        'By the end you will know why the FET wins wherever you must not load the input source: near-infinite input resistance and the square-law Shockley equation.',
      ],
      theoryHI: [
        'दो devices, दो सोच। BJT एक water wheel है जिसे आपको हाथ से धकेलते रहना पड़ता है - on रहने के लिए उसे असली input current चाहिए।',
        'FET एक garden hose है जिसे आप उस पर पैर रखकर control करते हैं - आपका पैर एक pure voltage है जो बिना एक बूँद पानी डाले flow को pinch कर देता है।',
        'BJT BIPOLAR है (electrons AND holes) और CURRENT-controlled। FET UNIPOLAR है (एक carrier) और VOLTAGE-controlled।',
        'JFET अपने channel को gate पर लगी दो reverse-biased p-n cuffs से अंदर से ही बंद करता है - इसलिए gate लगभग zero current खींचता है।',
        'अंत तक आप समझ जाएँगे कि FET वहाँ क्यों जीतता है जहाँ input source को load नहीं करना - near-infinite input resistance और square-law Shockley equation।',
      ],
      transcriptEN:
        'Welcome to the showdown between the BJT and the FET. Think of the BJT as a water wheel you keep spinning with your hand, and the FET as a garden hose you control with your foot.',
      transcriptHI:
        'BJT और FET के showdown में स्वागत है। BJT को एक water wheel समझिए जिसे आप हाथ से घुमाते हैं, और FET को एक garden hose जिसे आप पैर से control करते हैं।',
      visualNote:
        'Cover: an amplifier hero with an n-channel JFET symbol, a small signal flowing in and a big inverted swing out. Side chips: water wheel (BJT) and garden hose with a foot (FET).',
    },
    {
      id: 'S01_Video',
      label: 'Video - FET vs BJT and the JFET',
      kind: 'video',
      subtitle: 'The lesson lecture: voltage control and the pinched channel',
      theoryEN: [
        'Watch the lesson before the deep dive - it frames the central showdown: current-controlled BJT vs voltage-controlled FET.',
        'It walks the garden-hose analogy: the gate voltage is a foot stepping on the hose, pinching the channel without drawing water.',
        'It introduces the JFET as a three-terminal unipolar device: Drain, Source, and a Gate that controls by a field, not a current.',
        'Watch for the reverse-biased gate junctions - that is exactly why the gate current is ~zero and the input resistance is enormous.',
        'Keep the square-law in mind: drain current follows Id = Idss*(1 - Vgs/Vp)^2 across the whole module.',
      ],
      theoryHI: [
        'गहराई में जाने से पहले lesson देखें - यह मुख्य showdown रखता है: current-controlled BJT बनाम voltage-controlled FET।',
        'यह garden-hose analogy दिखाता है: gate voltage एक पैर है जो hose पर रखकर channel को pinch करता है, बिना पानी खींचे।',
        'यह JFET को एक three-terminal unipolar device के रूप में पेश करता है: Drain, Source, और एक Gate जो current नहीं, field से control करता है।',
        'reverse-biased gate junctions पर ध्यान दें - यही वजह है कि gate current ~zero है और input resistance बहुत बड़ा।',
        'square-law याद रखें: drain current पूरे module में Id = Idss*(1 - Vgs/Vp)^2 का पालन करता है।',
      ],
      transcriptEN:
        'In this video the idea lands in plain words. A BJT is a current-controlled device: to keep collector current flowing, you must keep feeding a small base current, and that very input current is its worst enemy - it loads the source and drops the input resistance. A FET is different. You control the output by a voltage at the gate, like a foot pressing on a garden hose. The foot pinches the hose shut but takes no water from it - so the input draws essentially no current, and the input resistance becomes enormous, from one megohm up to hundreds of megohms. The JFET takes this further. Instead of a foot, the hose squeezes itself shut from the inside using two reverse-biased p-n cuffs at the gate. Apply more reverse voltage and the depletion cuffs swell inward, choking the n-channel and throttling the drain current. Because the cuffs are reverse-biased, they draw almost no current from your hand. That is the secret of the FET. Drain current obeys a clean square law, the Shockley equation, and the slope of that curve, the transconductance gm, is the gain handle that turns an input voltage into an output current.',
      transcriptHI:
        'इस video में बात साफ़ शब्दों में आती है। BJT एक current-controlled device है: collector current बहता रखने के लिए आपको लगातार छोटा सा base current देना पड़ता है, और वही input current उसका सबसे बड़ा दुश्मन है - वह source को load करता है और input resistance गिरा देता है। FET अलग है। आप output को gate पर एक voltage से control करते हैं, जैसे garden hose पर पैर दबाना। पैर hose को बंद कर देता है पर उससे पानी नहीं लेता - तो input लगभग कोई current नहीं खींचता, और input resistance बहुत बड़ा हो जाता है, एक megohm से लेकर सैकड़ों megohm तक। JFET इसे और आगे ले जाता है। पैर की जगह, hose gate पर लगी दो reverse-biased p-n cuffs से अंदर से ही खुद को बंद करता है। ज़्यादा reverse voltage दीजिए तो depletion cuffs अंदर की ओर फूलती हैं, n-channel को choke करती हैं और drain current को throttle कर देती हैं। cuffs reverse-biased होने से वे आपके हाथ से लगभग कोई current नहीं लेतीं। यही FET का राज़ है। Drain current एक साफ़ square law - Shockley equation - का पालन करता है, और उस curve की slope, transconductance gm, वह gain handle है जो input voltage को output current में बदलती है।',
      visualNote:
        'Embed the Hindi cut be10-jfet-topologies-hi.mp4 with chapter markers: BJT vs FET, the foot on the hose, the JFET terminals, reverse-biased cuffs, the Shockley curve.',
    },
    {
      id: 'S02_Dichotomy',
      label: 'The Core Dichotomy - Bipolar vs Unipolar',
      kind: 'theory',
      subtitle: 'Two carriers + current control vs one carrier + voltage control',
      theoryEN: [
        'A BJT is a BIPOLAR device: conduction depends on BOTH charge carriers - electrons AND holes participate.',
        'A FET is a UNIPOLAR device: conduction relies on only ONE majority carrier type - electrons (n-channel) or holes (p-channel).',
        'BJT is CURRENT-controlled: the collector current is set by injecting a base control current (the water wheel you must keep pushing).',
        'FET is VOLTAGE-controlled: the output current is modulated by an applied electric field - a voltage, not an injected current (the foot on the hose).',
        'This single split - two carriers plus current control versus one carrier plus voltage control - drives every practical difference that follows.',
      ],
      theoryHI: [
        'BJT एक BIPOLAR device है: conduction दोनों charge carriers पर निर्भर है - electrons AND holes दोनों भाग लेते हैं।',
        'FET एक UNIPOLAR device है: conduction सिर्फ़ एक majority carrier पर टिका है - electrons (n-channel) या holes (p-channel)।',
        'BJT CURRENT-controlled है: collector current एक base control current inject करके सेट होता है (वह water wheel जिसे आपको धकेलते रहना है)।',
        'FET VOLTAGE-controlled है: output current एक applied electric field से modulate होता है - एक voltage, कोई injected current नहीं (hose पर पैर)।',
        'यही एक split - दो carriers plus current control बनाम एक carrier plus voltage control - आगे आने वाले हर practical फ़र्क़ को चलाता है।',
      ],
      transcriptEN:
        'The whole story begins with one split. A BJT is bipolar and current-controlled; a FET is unipolar and voltage-controlled.',
      transcriptHI:
        'पूरी कहानी एक split से शुरू होती है। BJT bipolar और current-controlled है; FET unipolar और voltage-controlled है।',
      visualNote:
        'Split slide. Left: two interlocking rings labelled Electrons and Holes circulating opposite ways (BJT). Right: a single bright upward arrow of one carrier type (FET).',
    },
    {
      id: 'S03_Comparison',
      label: 'General Characteristics Comparison',
      kind: 'theory',
      subtitle: 'Where the BJT and the FET truly differ',
      theoryEN: [
        'Control variable: BJT is current-controlled; FET is voltage-controlled.',
        'Input impedance: BJT is low to medium (a few kilohm); FET is very high - roughly 1 MOhm up to several hundred MOhm.',
        'Conduction: BJT is bipolar (electrons and holes); FET is unipolar (majority carriers only).',
        'Thermal stability: the BJT has lower stability and is prone to thermal runaway; the FET has high temperature stability.',
        'Physical footprint: a BJT needs a larger discrete footprint; a FET is smaller and ideal for integrated circuits.',
        'The bar to remember: the BJT loads your source (its input current is its worst enemy); the FET barely touches it.',
      ],
      theoryHI: [
        'Control variable: BJT current-controlled है; FET voltage-controlled है।',
        'Input impedance: BJT low से medium है (कुछ kilohm); FET बहुत high है - लगभग 1 MOhm से कई सौ MOhm तक।',
        'Conduction: BJT bipolar है (electrons और holes); FET unipolar है (सिर्फ़ majority carriers)।',
        'Thermal stability: BJT की stability कम है और thermal runaway का ख़तरा रहता है; FET की temperature stability high है।',
        'Physical footprint: BJT को बड़ा discrete footprint चाहिए; FET छोटा है और integrated circuits के लिए आदर्श।',
        'याद रखने वाली बात: BJT आपके source को load करता है (उसका input current ही उसका सबसे बड़ा दुश्मन); FET उसे मुश्किल से छूता है।',
      ],
      transcriptEN:
        'Side by side: control variable, input impedance, conduction, thermal stability, and footprint all favour the FET when you must not load the source.',
      transcriptHI:
        'आमने-सामने: control variable, input impedance, conduction, thermal stability, और footprint - source को load न करना हो तो सब FET के पक्ष में हैं।',
      visualNote:
        'A five-row comparison table (Parameter | BJT | FET) covering Control Variable, Input Impedance, Conduction, Thermal Stability, and Physical Footprint, plus an input-resistance bar.',
    },
    {
      id: 'S04_JfetTerminals',
      label: 'The JFET - A Three-Terminal Unipolar Architecture',
      kind: 'theory',
      subtitle: 'Drain, Source, and a Gate that controls by a field',
      theoryEN: [
        'The Junction Field-Effect Transistor (JFET) is a three-terminal unipolar semiconductor device.',
        'Drain (D): the exit point where majority carriers leave the channel.',
        'Source (S): the entry point where majority carriers enter the channel.',
        'Gate (G): the controlling terminal - an externally applied voltage sets up an electric field that modulates the current between source and drain.',
        'No input current is needed at the gate to control the device; control is purely by the field, i.e. by voltage.',
        'In the hose analogy: water enters at the Source, leaves at the Drain, and the Gate is the foot that decides how open the hose is.',
      ],
      theoryHI: [
        'Junction Field-Effect Transistor (JFET) एक three-terminal unipolar semiconductor device है।',
        'Drain (D): वह exit point जहाँ majority carriers channel से बाहर निकलते हैं।',
        'Source (S): वह entry point जहाँ majority carriers channel में घुसते हैं।',
        'Gate (G): controlling terminal - एक externally applied voltage एक electric field बनाता है जो source और drain के बीच current को modulate करता है।',
        'device को control करने के लिए gate पर कोई input current नहीं चाहिए; control पूरी तरह field से, यानी voltage से होता है।',
        'hose analogy में: पानी Source से घुसता है, Drain से निकलता है, और Gate वह पैर है जो तय करता है hose कितना खुला है।',
      ],
      transcriptEN:
        'The JFET has three terminals. Carriers enter at the Source, leave at the Drain, and the Gate steers them with a pure voltage - no input current required.',
      transcriptHI:
        'JFET के तीन terminals हैं। Carriers Source से घुसते हैं, Drain से निकलते हैं, और Gate उन्हें एक pure voltage से चलाता है - कोई input current नहीं चाहिए।',
      visualNote:
        'An n-channel JFET symbol next to an npn BJT symbol with callouts: D = carrier exit, S = carrier entry, G = the field-controlling terminal.',
    },
    {
      id: 'S05_Construction',
      label: 'N-Channel JFET Construction',
      kind: 'theory',
      subtitle: 'One n-bar, two p-gates, two p-n junctions',
      theoryEN: [
        'Primary structure: a bar of n-type semiconductor forms the central conducting channel.',
        'Gate regions: two heavily-doped p-type regions are embedded into the sides of the n-channel and are internally connected together to a single gate terminal.',
        'The interface between each p-type gate region and the n-type channel forms a p-n junction - there are two such junctions.',
        'Ohmic (non-rectifying, metallic) contacts are placed at the Source, Drain, and Gate so the leads themselves do not rectify.',
        'Carriers flow through the n-channel from Source to Drain; the two p-gates squeeze it from the sides - the two cuffs inside the hose.',
      ],
      theoryHI: [
        'मुख्य संरचना: एक n-type semiconductor का bar central conducting channel बनाता है।',
        'Gate regions: दो heavily-doped p-type regions n-channel के दोनों किनारों में embedded होती हैं और भीतर से एक single gate terminal से जुड़ी होती हैं।',
        'हर p-type gate region और n-type channel के बीच का interface एक p-n junction बनाता है - ऐसे दो junctions होते हैं।',
        'Source, Drain, और Gate पर Ohmic (non-rectifying, metallic) contacts लगाए जाते हैं ताकि leads ख़ुद rectify न करें।',
        'Carriers n-channel से Source से Drain तक बहते हैं; दोनों p-gates उसे किनारों से दबाते हैं - hose के अंदर की दो cuffs।',
      ],
      transcriptEN:
        'Construction: a single n-type bar is the channel, two p-type gate regions are embedded on its sides and joined as one gate, forming two p-n junctions. Ohmic contacts finish the leads.',
      transcriptHI:
        'संरचना: एक n-type bar channel है, दो p-type gate regions उसके किनारों में embedded होकर एक gate के रूप में जुड़ती हैं, जिससे दो p-n junctions बनते हैं। Ohmic contacts leads पूरा करते हैं।',
      visualNote:
        'Cross-section: a central n-type bar with Drain on top and Source on bottom; two orange p-type gate blocks on the sides wired to one Gate; labels point to the p-n junctions and ohmic contacts.',
    },
    {
      id: 'S06_FieldEffect',
      label: 'Establishing the Field Effect',
      kind: 'theory',
      subtitle: 'Reverse-biased gate = the foot on the hose, drawing no water',
      theoryEN: [
        'No-bias condition: even with no applied voltage, natural depletion regions form at the two p-n junctions.',
        'Reverse-bias principle: in normal operation the gate-to-source input circuit is STRICTLY reverse-biased (the gate is made negative relative to the source for an n-channel JFET).',
        'A reverse-biased junction carries essentially no current - so the gate current is practically zero.',
        'Zero gate current is exactly what gives the FET its exceptional, near-infinite input impedance.',
        'This is the foot-on-the-hose moment: control without drawing any water - that is, without drawing any current from the input.',
      ],
      theoryHI: [
        'No-bias condition: कोई applied voltage न होने पर भी, दोनों p-n junctions पर natural depletion regions बन जाती हैं।',
        'Reverse-bias सिद्धांत: सामान्य operation में gate-to-source input circuit STRICTLY reverse-biased होता है (n-channel JFET के लिए gate को source के सापेक्ष negative बनाया जाता है)।',
        'एक reverse-biased junction लगभग कोई current नहीं बहाता - इसलिए gate current practically zero होता है।',
        'यही zero gate current FET को उसका असाधारण, near-infinite input impedance देता है।',
        'यही foot-on-the-hose पल है: बिना पानी खींचे control - यानी input से बिना कोई current खींचे।',
      ],
      transcriptEN:
        'In normal operation the gate-source junction is held reverse-biased. A reverse-biased junction passes almost no current, so the gate draws almost nothing - and that is where the huge input impedance comes from.',
      transcriptHI:
        'सामान्य operation में gate-source junction reverse-biased रखा जाता है। reverse-biased junction लगभग कोई current नहीं बहाता, तो gate लगभग कुछ नहीं खींचता - और यहीं से वह बड़ा input impedance आता है।',
      visualNote:
        'Vertical n-channel block with two stacked P gate regions on the left wired through a battery that reverse-biases gate-to-source; shaded depletion borders surround the junctions.',
    },
    {
      id: 'S07_Pinching',
      label: 'Channel Modulation - Pinching the Hose',
      kind: 'theory',
      subtitle: 'More reverse bias = wider depletion = narrower channel',
      theoryEN: [
        'The reverse-bias gate voltage generates an internal electric field across the junctions.',
        'The strength of that field sets the spatial WIDTH of the depletion regions - more reverse bias means wider depletion.',
        'Expanding depletion regions intrude into the n-channel, narrowing the path left for drain current.',
        'As the channel narrows, the drain current is throttled - current modulation achieved purely by voltage.',
        'At low reverse bias the depletion zones are thin and the channel is wide (high Id); at high reverse bias they swell until they nearly meet, choking Id.',
        'Drag the gate-voltage slider in the lab and watch the channel pinch and the live Id fall - no input current spent to do it.',
      ],
      theoryHI: [
        'reverse-bias gate voltage junctions के पार एक internal electric field बनाता है।',
        'उस field की ताक़त depletion regions की spatial WIDTH तय करती है - ज़्यादा reverse bias यानी चौड़ी depletion।',
        'फैलती depletion regions n-channel में घुसती हैं, drain current के लिए बचा रास्ता संकरा कर देती हैं।',
        'channel संकरा होते ही drain current throttle हो जाता है - current modulation पूरी तरह voltage से।',
        'कम reverse bias पर depletion zones पतली होती हैं और channel चौड़ा (high Id); high reverse bias पर वे तब तक फूलती हैं जब तक लगभग मिल न जाएँ, Id को choke करते हुए।',
        'lab में gate-voltage slider खींचिए और देखिए channel pinch होता है और live Id गिरता है - इसमें कोई input current खर्च नहीं होता।',
      ],
      transcriptEN:
        'More reverse bias widens the depletion regions, which bulge inward and pinch the channel. The narrower channel throttles the drain current - all done by voltage alone.',
      transcriptHI:
        'ज़्यादा reverse bias depletion regions को चौड़ा करता है, जो अंदर की ओर फूलकर channel को pinch करती हैं। संकरा channel drain current को throttle कर देता है - सब सिर्फ़ voltage से।',
      visualNote:
        'Two side-by-side cross-sections: Low Reverse Bias (thin depletion, wide channel, strong flow) and High Reverse Bias (thick depletion, narrow channel, throttled flow), bound to a live Id readout.',
    },
    {
      id: 'S08_Shockley',
      label: 'Pinch-Off, Idss, and the Shockley Equation',
      kind: 'theory',
      subtitle: 'Id = Idss*(1 - Vgs/Vp)^2 - the square law, derived',
      theoryEN: [
        'When Vgs = 0 the channel is widest and the drain current saturates at its maximum value Idss (drain-to-source current with the gate shorted to source).',
        'As Vgs is made more negative, depletion grows and Id falls.',
        'The pinch-off voltage Vp (= Vgs(off)) is the gate voltage at which the channel is fully choked and Id is driven essentially to zero.',
        'Drain current follows Shockley\'s square law: Id = Idss*(1 - Vgs/Vp)^2, valid in the saturation (active) region for Vp <= Vgs <= 0.',
        'This is DEPLETION-MODE operation: the device is normally ON at Vgs = 0 and is turned OFF by reverse-biasing the gate. It cannot be enhanced beyond Idss, because forward-biasing the gate would destroy its high input resistance.',
        'Step through the derivation in the panel below: boundary conditions at Vgs = 0 and Vgs = Vp pin the constant and confirm the square law.',
      ],
      theoryHI: [
        'जब Vgs = 0 हो तो channel सबसे चौड़ा होता है और drain current अपने maximum value Idss पर saturate करता है (gate को source से short करने पर drain-to-source current)।',
        'जैसे-जैसे Vgs ज़्यादा negative होता है, depletion बढ़ती है और Id गिरता है।',
        'pinch-off voltage Vp (= Vgs(off)) वह gate voltage है जिस पर channel पूरी तरह choke हो जाता है और Id लगभग zero हो जाता है।',
        'Drain current Shockley के square law का पालन करता है: Id = Idss*(1 - Vgs/Vp)^2, saturation (active) region में Vp <= Vgs <= 0 के लिए मान्य।',
        'यह DEPLETION-MODE operation है: device Vgs = 0 पर normally ON रहता है और gate को reverse-bias करके OFF किया जाता है। इसे Idss से आगे enhance नहीं किया जा सकता, क्योंकि gate को forward-bias करने से उसका high input resistance नष्ट हो जाएगा।',
        'नीचे के panel में derivation step-by-step देखिए: Vgs = 0 और Vgs = Vp की boundary conditions constant को pin करती हैं और square law की पुष्टि करती हैं।',
      ],
      transcriptEN:
        'At Vgs equals zero the channel is wide open and Id equals Idss, the maximum. As the gate is made more negative the channel pinches and Id falls, reaching zero at the pinch-off voltage Vp. The drain current obeys the square law Id equals Idss times one minus Vgs over Vp, all squared.',
      transcriptHI:
        'Vgs बराबर zero पर channel पूरा खुला है और Id बराबर Idss, यानी maximum। gate जितना negative होता है channel pinch होता है और Id गिरता है, pinch-off voltage Vp पर zero तक पहुँचता है। drain current square law का पालन करता है: Id बराबर Idss गुणा one minus Vgs बटा Vp, पूरा squared।',
      visualNote:
        'Transfer characteristic parabola of Id vs Vgs from (0, Idss) down to (Vp, 0), with a StepThrough deriving the Shockley equation alongside the draggable JfetTransfer lab.',
      formulas: [
        'Id = Idss*(1 - Vgs/Vp)^2',
        'Id(max) = Idss at Vgs = 0',
        'Id = 0 at Vgs = Vp',
      ],
    },
    {
      id: 'S09_Transconductance',
      label: 'Transconductance gm - The Gain Handle',
      kind: 'theory',
      subtitle: 'gm = dId/dVgs = -2*Idss/Vp*(1 - Vgs/Vp)',
      theoryEN: [
        'Transconductance gm measures how strongly a change in gate voltage changes the drain current - it is the slope of the transfer curve, gm = dId/dVgs.',
        'Differentiating Shockley\'s equation gives gm = -2*Idss/Vp*(1 - Vgs/Vp).',
        'gm is largest at Vgs = 0 (channel wide open), where gm0 = -2*Idss/Vp = 2*Idss/|Vp|, and falls to zero at pinch-off.',
        'gm has units of siemens (mA/V) and is the FET\'s gain handle - it converts an input voltage into an output current, the essence of voltage control.',
        'High gm with near-zero input current is exactly why FETs make excellent high-input-impedance amplifiers and IC building blocks.',
      ],
      theoryHI: [
        'Transconductance gm बताता है कि gate voltage में बदलाव drain current को कितनी ज़ोर से बदलता है - यह transfer curve की slope है, gm = dId/dVgs।',
        'Shockley equation को differentiate करने पर मिलता है gm = -2*Idss/Vp*(1 - Vgs/Vp)।',
        'gm Vgs = 0 पर सबसे बड़ा होता है (channel पूरा खुला), जहाँ gm0 = -2*Idss/Vp = 2*Idss/|Vp|, और pinch-off पर zero हो जाता है।',
        'gm की units siemens (mA/V) हैं और यह FET का gain handle है - यह input voltage को output current में बदलता है, voltage control का सार।',
        'high gm के साथ near-zero input current ही वजह है कि FETs बेहतरीन high-input-impedance amplifiers और IC building blocks बनते हैं।',
      ],
      transcriptEN:
        'Transconductance gm is the slope of the transfer curve - how much drain current changes per volt of gate voltage. Differentiating Shockley gives gm equals minus two Idss over Vp times one minus Vgs over Vp, largest at Vgs equals zero.',
      transcriptHI:
        'Transconductance gm transfer curve की slope है - per volt gate voltage drain current कितना बदलता है। Shockley को differentiate करने पर gm बराबर minus two Idss बटा Vp गुणा one minus Vgs बटा Vp, जो Vgs बराबर zero पर सबसे बड़ा है।',
      visualNote:
        'The transfer parabola with a tangent at a chosen Q-point; the slope is annotated as gm. A small inset shows gm shrinking from gm0 at Vgs=0 down to 0 at Vgs=Vp.',
      formulas: [
        'gm = dId/dVgs',
        'gm = -2*Idss/Vp*(1 - Vgs/Vp)',
        'gm0 = -2*Idss/Vp = 2*Idss/|Vp|',
      ],
    },
    {
      id: 'S10_Synthesis',
      label: 'Architectural Synthesis - Why It Matters',
      kind: 'theory',
      subtitle: 'The JFET wins wherever you must not load the input',
      theoryEN: [
        'JFETs use voltage (electric fields) to dynamically modulate channel WIDTH, wholly replacing the BJT\'s current-injection mechanics.',
        'Reverse-biased gate junctions eliminate input current, yielding the exceptional multi-megohm input impedance.',
        'Conduction is strictly unipolar and occurs seamlessly through one uninterrupted channel, without carriers crossing any forward-biased active junction.',
        'Net effect: a low-noise, high-impedance, temperature-stable, IC-friendly device that wins the showdown wherever you must not load the input source.',
        'Trade-off vs BJT: the JFET typically offers lower gm (less raw gain per device) than a BJT, but pays for it with a vastly higher input resistance.',
      ],
      theoryHI: [
        'JFETs voltage (electric fields) से channel WIDTH को dynamically modulate करते हैं, BJT के current-injection mechanics को पूरी तरह बदलते हुए।',
        'reverse-biased gate junctions input current को ख़त्म कर देते हैं, जिससे असाधारण multi-megohm input impedance मिलता है।',
        'Conduction सख़्ती से unipolar है और एक अखंड channel से बिना रुके होता है, बिना किसी forward-biased active junction को पार किए।',
        'कुल असर: एक low-noise, high-impedance, temperature-stable, IC-friendly device जो वहाँ showdown जीतता है जहाँ input source को load नहीं करना।',
        'BJT बनाम trade-off: JFET आमतौर पर कम gm देता है (per device कम raw gain) BJT की तुलना में, पर बदले में बहुत ज़्यादा input resistance देता है।',
      ],
      transcriptEN:
        'To sum up: the JFET modulates channel width by voltage, draws almost no input current thanks to reverse-biased gates, and conducts unipolar through one clean channel. It trades some raw gain for an enormous input resistance.',
      transcriptHI:
        'सारांश: JFET channel width को voltage से modulate करता है, reverse-biased gates की वजह से लगभग कोई input current नहीं खींचता, और एक साफ़ channel से unipolar conduct करता है। यह कुछ raw gain के बदले बहुत बड़ा input resistance देता है।',
      visualNote:
        'Three icon panels: a rotary knob (voltage modulates width), an infinity symbol in a frame (near-infinite Zin), and two crossing lines with one bright node (uninterrupted unipolar conduction).',
    },
    {
      id: 'S11_Flashcards',
      label: 'Flashcards - Lock It In',
      kind: 'flashcards',
      subtitle: 'Eight cards: the dichotomy, the physics, the formulas',
      theoryEN: [
        'Flip each card: the term on the front, the plain explanation on the back.',
        'These eight cover bipolar vs unipolar, the control variable, why the input impedance is huge, Idss, pinch-off Vp, the Shockley equation, transconductance gm, and depletion-mode operation.',
        'Aim to explain each back in your own words before flipping - that is real recall.',
      ],
      theoryHI: [
        'हर card पलटें: सामने term, पीछे सीधी व्याख्या।',
        'ये आठ cards bipolar बनाम unipolar, control variable, input impedance इतना बड़ा क्यों, Idss, pinch-off Vp, Shockley equation, transconductance gm, और depletion-mode operation को cover करते हैं।',
        'पलटने से पहले हर पीछे वाली बात अपने शब्दों में बताने की कोशिश करें - यही असली recall है।',
      ],
      transcriptEN:
        'Eight cards to lock the big ideas into memory. Cover the back, read the term, and say the explanation out loud before you flip.',
      transcriptHI:
        'बड़े विचारों को याददाश्त में बैठाने के लिए आठ cards। पीछे का हिस्सा ढक दें, term पढ़ें, और पलटने से पहले व्याख्या ज़ोर से बोलें।',
      visualNote:
        'Watermarked shareable flip-card deck: front shows the bold term, back shows the explanation; accent colours per card.',
    },
    {
      id: 'S12_Quiz',
      label: 'Quiz - Test the Showdown',
      kind: 'quiz',
      subtitle: 'Eight questions on BJT vs FET and JFET physics',
      theoryEN: [
        'Eight multiple-choice questions. Each tests either the BJT-vs-FET contrast or the JFET physics.',
        'Read every option - the wrong ones are the misconceptions this module exists to break.',
        'Explanations follow each answer so a miss becomes a lesson.',
      ],
      theoryHI: [
        'आठ multiple-choice सवाल। हर एक या तो BJT-बनाम-FET contrast जाँचता है या JFET physics।',
        'हर option पढ़ें - ग़लत वाले वही misconceptions हैं जिन्हें तोड़ने के लिए यह module बना है।',
        'हर जवाब के बाद explanation है ताकि चूक भी एक सबक़ बन जाए।',
      ],
      transcriptEN:
        'Eight quick questions across the showdown and the JFET physics. Read all four options each time - the wrong answers are exactly the traps students fall into.',
      transcriptHI:
        'showdown और JFET physics पर आठ तेज़ सवाल। हर बार चारों options पढ़ें - ग़लत जवाब ठीक वही जाल हैं जिनमें students फँसते हैं।',
      visualNote: 'QuizArena with eight problems; show running score and reveal explanation on answer.',
    },
    {
      id: 'S13_Recap',
      label: 'Recap - The Showdown in One Page',
      kind: 'recap',
      subtitle: 'Everything that makes the FET win',
      theoryEN: [
        'The dichotomy: BJT is bipolar and current-controlled (a water wheel you keep pushing); FET is unipolar and voltage-controlled (a foot on a hose).',
        'The JFET: a three-terminal unipolar device - Source in, Drain out, Gate as the field control - built from one n-bar and two internally-joined p-gates.',
        'The field effect: the gate-source junction is reverse-biased, so the gate current is ~zero, giving the FET its near-infinite input impedance.',
        'Pinching the hose: more reverse bias widens the depletion cuffs, narrows the channel, and throttles Id - all by voltage.',
        'The square law: Id = Idss*(1 - Vgs/Vp)^2, with Idss at Vgs=0 and Id=0 at Vgs=Vp; gm = -2*Idss/Vp*(1 - Vgs/Vp) is the gain handle.',
        'The verdict: the JFET trades some raw gain for an enormous input resistance, winning wherever you must not load the source.',
      ],
      theoryHI: [
        'Dichotomy: BJT bipolar और current-controlled है (एक water wheel जिसे आप धकेलते रहते हैं); FET unipolar और voltage-controlled है (hose पर पैर)।',
        'JFET: एक three-terminal unipolar device - Source में, Drain बाहर, Gate field control - एक n-bar और भीतर से जुड़ी दो p-gates से बना।',
        'field effect: gate-source junction reverse-biased है, तो gate current ~zero, जो FET को उसका near-infinite input impedance देता है।',
        'hose pinch करना: ज़्यादा reverse bias depletion cuffs को चौड़ा करता है, channel संकरा करता है, और Id throttle कर देता है - सब voltage से।',
        'square law: Id = Idss*(1 - Vgs/Vp)^2, Vgs=0 पर Idss और Vgs=Vp पर Id=0; gm = -2*Idss/Vp*(1 - Vgs/Vp) gain handle है।',
        'फ़ैसला: JFET कुछ raw gain के बदले बहुत बड़ा input resistance देता है, वहाँ जीतते हुए जहाँ source को load नहीं करना।',
      ],
      transcriptEN:
        'One page closes the showdown. The BJT is current-controlled and bipolar; the FET is voltage-controlled and unipolar. The JFET pinches its own channel with reverse-biased gates, draws almost no input current, and follows the square-law Shockley equation. It trades raw gain for an enormous input resistance.',
      transcriptHI:
        'एक page पर showdown ख़त्म। BJT current-controlled और bipolar है; FET voltage-controlled और unipolar है। JFET reverse-biased gates से अपना channel pinch करता है, लगभग कोई input current नहीं खींचता, और square-law Shockley equation का पालन करता है। यह raw gain के बदले बहुत बड़ा input resistance देता है।',
      visualNote:
        'One-page cheat grid: three columns (The dichotomy / The physics / The formulas), plus a small Sources list linking the references used.',
    },
  ],
  flashcards: [
    {
      frontEN: 'Bipolar vs Unipolar',
      backEN:
        'A BJT (bipolar) conducts via BOTH electrons and holes; a FET (unipolar) conducts via a SINGLE majority carrier type - electrons in an n-channel, holes in a p-channel.',
      frontHI: 'Bipolar बनाम Unipolar',
      backHI:
        'BJT (bipolar) BOTH electrons और holes से conduct करता है; FET (unipolar) एक SINGLE majority carrier से - n-channel में electrons, p-channel में holes।',
    },
    {
      frontEN: 'Control variable: BJT vs FET',
      backEN:
        'A BJT is current-controlled (Ic = beta*Ib): you must keep feeding a base current. A FET is voltage-controlled: the drain current is set by the gate voltage (field), with ~zero input current.',
      frontHI: 'Control variable: BJT बनाम FET',
      backHI:
        'BJT current-controlled है (Ic = beta*Ib): आपको base current देते रहना पड़ता है। FET voltage-controlled है: drain current gate voltage (field) से सेट होता है, ~zero input current के साथ।',
    },
    {
      frontEN: 'Why FET input impedance is huge',
      backEN:
        'The gate-source junction is reverse-biased, so the gate current is ~0. With almost no input current drawn, Rin is enormous - from about 1 MOhm up to hundreds of MOhm.',
      frontHI: 'FET का input impedance इतना बड़ा क्यों',
      backHI:
        'gate-source junction reverse-biased है, तो gate current ~0 है। लगभग कोई input current न खिंचने से Rin बहुत बड़ा होता है - लगभग 1 MOhm से सैकड़ों MOhm तक।',
    },
    {
      frontEN: 'Idss',
      backEN:
        'The drain-to-source saturation current with the gate shorted to the source (Vgs = 0) - the maximum drain current, with the channel fully open.',
      frontHI: 'Idss',
      backHI:
        'gate को source से short करने (Vgs = 0) पर drain-to-source saturation current - maximum drain current, channel पूरा खुला।',
    },
    {
      frontEN: 'Pinch-off voltage Vp (Vgs(off))',
      backEN:
        'The gate-source voltage at which the depletion regions fully choke the channel and drive Id to ~zero. For an n-channel JFET it is negative.',
      frontHI: 'Pinch-off voltage Vp (Vgs(off))',
      backHI:
        'वह gate-source voltage जिस पर depletion regions channel को पूरी तरह choke कर देती हैं और Id को ~zero कर देती हैं। n-channel JFET के लिए यह negative होता है।',
    },
    {
      frontEN: 'Shockley equation',
      backEN:
        'Id = Idss*(1 - Vgs/Vp)^2 - the square-law transfer relation in the JFET saturation region, valid for Vp <= Vgs <= 0.',
      frontHI: 'Shockley equation',
      backHI:
        'Id = Idss*(1 - Vgs/Vp)^2 - JFET saturation region में square-law transfer relation, Vp <= Vgs <= 0 के लिए मान्य।',
    },
    {
      frontEN: 'Transconductance gm',
      backEN:
        'gm = dId/dVgs = -2*Idss/Vp*(1 - Vgs/Vp); the FET gain handle that converts input voltage into output current. Maximum at Vgs = 0, where gm0 = 2*Idss/|Vp|.',
      frontHI: 'Transconductance gm',
      backHI:
        'gm = dId/dVgs = -2*Idss/Vp*(1 - Vgs/Vp); FET का gain handle जो input voltage को output current में बदलता है। Vgs = 0 पर maximum, जहाँ gm0 = 2*Idss/|Vp|।',
    },
    {
      frontEN: 'Depletion-mode operation',
      backEN:
        'A JFET is normally ON at Vgs = 0 and is turned OFF by reverse-biasing the gate toward Vp. It cannot be enhanced, because forward-biasing the gate would destroy its high input resistance.',
      frontHI: 'Depletion-mode operation',
      backHI:
        'JFET Vgs = 0 पर normally ON रहता है और gate को Vp की ओर reverse-bias करके OFF होता है। इसे enhance नहीं किया जा सकता, क्योंकि gate को forward-bias करने से उसका high input resistance नष्ट हो जाएगा।',
    },
  ],
  quiz: [
    {
      questionEN: 'What fundamentally distinguishes a BJT from a FET in terms of control?',
      questionHI: 'Control के लिहाज़ से BJT को FET से मूल रूप से क्या अलग करता है?',
      options: [
        'BJT is voltage-controlled; FET is current-controlled',
        'BJT is current-controlled; FET is voltage-controlled',
        'Both are current-controlled',
        'Both are voltage-controlled',
      ],
      answerIndex: 1,
      explainEN:
        'A BJT is steered by an injected base CURRENT, while a FET is steered by an applied gate VOLTAGE (field). That is the whole showdown in one line.',
      explainHI:
        'BJT एक injected base CURRENT से चलता है, जबकि FET एक applied gate VOLTAGE (field) से। यही पूरा showdown एक लाइन में है।',
    },
    {
      questionEN: 'Why does a JFET have such a high input impedance?',
      questionHI: 'JFET का input impedance इतना high क्यों होता है?',
      options: [
        'The gate is forward-biased, drawing large current',
        'The gate-source junction is reverse-biased, so gate current is ~zero',
        'The channel is made of insulating material',
        'The drain and source are shorted together',
      ],
      answerIndex: 1,
      explainEN:
        'A reverse-biased gate junction conducts essentially no current, so almost no current is drawn from the input - giving near-infinite input resistance.',
      explainHI:
        'reverse-biased gate junction लगभग कोई current नहीं बहाता, तो input से लगभग कोई current नहीं खिंचता - जो near-infinite input resistance देता है।',
    },
    {
      questionEN: 'In an n-channel JFET, what does increasing the reverse gate bias do?',
      questionHI: 'n-channel JFET में reverse gate bias बढ़ाने से क्या होता है?',
      options: [
        'Widens the channel and increases Id',
        'Widens the depletion regions, narrowing the channel and reducing Id',
        'Has no effect on the channel',
        'Forward-biases the junctions',
      ],
      answerIndex: 1,
      explainEN:
        'More reverse bias swells the depletion regions inward, pinching the n-channel and throttling the drain current - the foot pressing harder on the hose.',
      explainHI:
        'ज़्यादा reverse bias depletion regions को अंदर की ओर फुलाता है, n-channel को pinch करता है और drain current को throttle कर देता है - hose पर पैर ज़्यादा दबाना।',
    },
    {
      questionEN: 'What is Idss?',
      questionHI: 'Idss क्या है?',
      options: [
        'Drain current when the gate is at pinch-off voltage',
        'Drain current with the gate shorted to the source (Vgs = 0)',
        'The gate leakage current',
        'The maximum allowable gate voltage',
      ],
      answerIndex: 1,
      explainEN:
        'Idss is the drain-to-source saturation current measured with Vgs = 0 - the channel fully open, giving the maximum Id.',
      explainHI:
        'Idss वह drain-to-source saturation current है जो Vgs = 0 पर मापा जाता है - channel पूरा खुला, जो maximum Id देता है।',
    },
    {
      questionEN: 'The Shockley equation for JFET drain current is:',
      questionHI: 'JFET drain current के लिए Shockley equation है:',
      options: [
        'Id = Idss*(1 - Vgs/Vp)',
        'Id = Idss*(1 - Vgs/Vp)^2',
        'Id = Idss*(Vgs/Vp)^2',
        'Id = beta*Vgs',
      ],
      answerIndex: 1,
      explainEN:
        'JFET saturation current follows a square law: Id = Idss*(1 - Vgs/Vp)^2. It equals Idss at Vgs=0 and 0 at Vgs=Vp.',
      explainHI:
        'JFET saturation current square law का पालन करता है: Id = Idss*(1 - Vgs/Vp)^2। यह Vgs=0 पर Idss और Vgs=Vp पर 0 होता है।',
    },
    {
      questionEN: 'A JFET is described as a "unipolar" device because:',
      questionHI: 'JFET को "unipolar" device इसलिए कहा जाता है क्योंकि:',
      options: [
        'It uses both electrons and holes for conduction',
        'Conduction relies on only one majority carrier type',
        'It has only one terminal',
        'It works on only one polarity of supply',
      ],
      answerIndex: 1,
      explainEN:
        'Unipolar means a single majority-carrier type carries the current - electrons in an n-channel, holes in a p-channel. Only the BJT uses both.',
      explainHI:
        'Unipolar का मतलब है एक ही majority-carrier current बहाता है - n-channel में electrons, p-channel में holes। दोनों सिर्फ़ BJT इस्तेमाल करता है।',
    },
    {
      questionEN: 'At what gate voltage does a JFET deliver its maximum transconductance gm?',
      questionHI: 'किस gate voltage पर JFET अपना maximum transconductance gm देता है?',
      options: [
        'At Vgs = Vp (pinch-off)',
        'At Vgs = 0',
        'At a forward-biased Vgs',
        'gm is constant for all Vgs',
      ],
      answerIndex: 1,
      explainEN:
        'gm = -2*Idss/Vp*(1 - Vgs/Vp) is largest at Vgs = 0 (gm0 = 2*Idss/|Vp|) and falls to zero at pinch-off, where the channel is choked.',
      explainHI:
        'gm = -2*Idss/Vp*(1 - Vgs/Vp) Vgs = 0 पर सबसे बड़ा होता है (gm0 = 2*Idss/|Vp|) और pinch-off पर zero हो जाता है, जहाँ channel choke होता है।',
    },
    {
      questionEN: 'The JFET operates in which mode?',
      questionHI: 'JFET किस mode में काम करता है?',
      options: [
        'Enhancement mode only - off at Vgs = 0',
        'Depletion mode - on at Vgs = 0, turned off by reverse-biasing the gate',
        'Avalanche mode',
        'Forward-conduction mode of the gate',
      ],
      answerIndex: 1,
      explainEN:
        'A JFET is normally ON at Vgs = 0 (conducting Idss) and is turned OFF by reverse-biasing the gate toward Vp - classic depletion-mode behaviour.',
      explainHI:
        'JFET Vgs = 0 पर normally ON रहता है (Idss बहाते हुए) और gate को Vp की ओर reverse-bias करके OFF होता है - classic depletion-mode व्यवहार।',
    },
  ],
} as unknown as SubContent;
