/**
 * BJT DC Biasing & The Operating Point (be7) - "Setting the Party Vibe".
 * Before any music (the AC signal) plays, a good DJ sets a stable baseline vibe:
 * lights at a comfortable level, room not too bright, not too dark. That resting
 * state is the Q-point, and DC biasing is the act of choosing it. We weave this
 * single analogy through every page: fixed-bias balances the see-saw with one
 * hand and topples the moment beta drifts; voltage-divider bias bolts the pivot
 * to the floor with an emitter resistor so the vibe stays locked. Bilingual
 * (English / Hinglish-Devanagari), all numbers computed live in scenes.tsx.
 */
import type { SubContent } from '../_transistor/kit';

export const CONTENT: SubContent = {
  moduleTitle: 'BJT DC Biasing & The Operating Point',
  moduleSubtitle:
    'Set a stable Q-point on the DC load line so the amplifier stays steady when beta and temperature drift - the baseline vibe set before the music plays.',
  scenes: [
    {
      id: 'S00_Cover',
      label: 'BJT DC Biasing',
      kind: 'cover',
      subtitle: 'Setting the Q-point - the resting baseline before the signal',
      theoryEN: [
        'Before any music (your AC signal) plays, a good DJ sets a baseline vibe - lights not too bright, not too dark. That resting state is the Q-point.',
        'DC biasing is choosing that baseline: feed the transistor a steady DC current and voltage so it sits in the middle of the active region.',
        'A great bias is a perfectly balanced see-saw - the signal swings up and down symmetrically without slamming into cutoff (floor) or saturation (ceiling).',
        'The villain is drift: temperature rises, beta wanders from 50 to 400+, and the see-saw threatens to tip.',
        'By the end you will see why fixed-bias topples instantly while voltage-divider bias - bolted down by an emitter resistor Re - stays rock-steady.',
      ],
      theoryHI: [
        'किसी भी music (आपका AC signal) के बजने से पहले एक अच्छा DJ एक baseline vibe सेट करता है - lights न बहुत तेज़, न बहुत मद्धम। वही resting state ही Q-point है।',
        'DC biasing यही baseline चुनना है: transistor को एक steady DC current और voltage दो ताकि वह active region के बीचों-बीच बैठे।',
        'एक बढ़िया bias एक perfectly balanced see-saw है - signal ऊपर-नीचे symmetric झूलता है, न cutoff (फ़र्श) से टकराता है न saturation (छत) से।',
        'villain है drift: temperature बढ़ता है, beta 50 से 400+ तक भटकता है, और see-saw लुढ़कने को होता है।',
        'अंत तक आप देखेंगे कि fixed-bias तुरंत लुढ़क जाता है जबकि voltage-divider bias - emitter resistor Re से ज़मीन में बोल्ट किया हुआ - rock-steady रहता है।',
      ],
      transcriptEN:
        'Setting the party vibe before the music plays: DC biasing places the transistor at a resting Q-point in the active region so the signal can swing both ways.',
      transcriptHI:
        'music बजने से पहले party vibe सेट करना: DC biasing transistor को active region में एक resting Q-point पर बिठाता है ताकि signal दोनों तरफ़ झूल सके।',
      visualNote:
        'Cover hero: a small signal in, a big inverted swing out, with an npn at the centre; a dimmer-fader motif marks the centred Q-point.',
    },
    {
      id: 'S01_Video',
      label: 'Video - Setting the Q-point',
      kind: 'video',
      subtitle: 'The lesson: biasing, the load line, and why Re wins',
      theoryEN: [
        'Watch the lesson before the deep dive - it frames biasing as setting a stable baseline vibe before the signal plays.',
        'It builds the DC load line from the external network (Vcc and Rc) and places the Q-point on it.',
        'It exposes the fatal flaw of fixed-bias: Ic = beta*Ib scales directly with beta, so a 50% beta change shoves the Q-point over 300%.',
        'It introduces voltage-divider bias and the emitter resistor Re as negative feedback that bolts the Q-point in place.',
        'Keep one sentence in mind: a good bias leaves equal swing room above and below the Q-point.',
      ],
      theoryHI: [
        'गहराई में जाने से पहले lesson देखें - यह biasing को signal बजने से पहले एक stable baseline vibe सेट करने के रूप में रखता है।',
        'यह external network (Vcc और Rc) से DC load line बनाता है और Q-point को उस पर बिठाता है।',
        'यह fixed-bias का fatal flaw दिखाता है: Ic = beta*Ib सीधे beta के साथ बढ़ता है, तो 50% beta बदलाव Q-point को 300% से ज़्यादा धकेल देता है।',
        'यह voltage-divider bias और emitter resistor Re को negative feedback के रूप में पेश करता है जो Q-point को जगह पर बोल्ट कर देता है।',
        'एक वाक्य याद रखें: एक अच्छा bias Q-point के ऊपर और नीचे बराबर swing room छोड़ता है।',
      ],
      transcriptEN:
        'Think of biasing like a DJ setting the room before the night begins. The lights at rest - that is the Q-point, a pair of values: a resting collector current Icq and a resting collector-emitter voltage Vceq. We pick them with steady DC so the transistor sits in the active region. Why the middle? Because when the music starts, the signal pushes the operating point up and down a straight track called the DC load line. Sit too high and the upswing slams into saturation, the ceiling. Sit too low and the downswing crashes into cutoff, the floor. Sit in the centre and both halves of the wave survive cleanly. The load line itself is set entirely by the outside network - the supply Vcc and the collector resistor Rc - not by the transistor. Now the danger. In the simplest fixed-bias circuit a single resistor Rb sets the base current, and the collector current is just beta times that. But beta is a wanderer - it ranges from fifty to over four hundred and climbs with heat. Since nothing pushes back, a fifty percent change in beta can shove the Q-point by more than three hundred percent, straight into saturation. That is one hand balancing a see-saw. The fix is to bolt the pivot to the floor: a resistor divider sets a stiff base voltage, and an emitter resistor Re adds negative feedback. If the current tries to rise, the emitter voltage rises, the base-emitter voltage falls, and the current is pulled right back. The result is a Q-point that barely notices beta or temperature - the vibe stays locked.',
      transcriptHI:
        'biasing को ऐसे सोचिए जैसे एक DJ रात शुरू होने से पहले कमरा सेट करता है। rest पर lights - वही Q-point है, मानों की एक जोड़ी: एक resting collector current Icq और एक resting collector-emitter voltage Vceq। हम इन्हें steady DC से चुनते हैं ताकि transistor active region में बैठे। बीच में क्यों? क्योंकि जब music शुरू होता है, signal operating point को एक सीधी पटरी पर ऊपर-नीचे धकेलता है जिसे DC load line कहते हैं। बहुत ऊपर बैठो तो upswing saturation - छत - से टकराता है। बहुत नीचे बैठो तो downswing cutoff - फ़र्श - से टकराता है। बीच में बैठो तो wave के दोनों आधे साफ़ बचते हैं। load line ख़ुद पूरी तरह बाहरी network से तय होती है - supply Vcc और collector resistor Rc - transistor से नहीं। अब ख़तरा। सबसे सरल fixed-bias circuit में एक अकेला resistor Rb base current सेट करता है, और collector current बस उसका beta गुना होता है। पर beta एक भटकता राही है - यह पचास से चार सौ से ऊपर तक जाता है और गर्मी के साथ बढ़ता है। चूँकि कुछ भी पीछे नहीं धकेलता, beta में पचास प्रतिशत बदलाव Q-point को तीन सौ प्रतिशत से ज़्यादा धकेल सकता है, सीधे saturation में। यह एक हाथ से see-saw संभालने जैसा है। हल है pivot को फ़र्श में बोल्ट कर देना: एक resistor divider एक stiff base voltage सेट करता है, और एक emitter resistor Re negative feedback जोड़ता है। अगर current बढ़ने लगे, emitter voltage बढ़ता है, base-emitter voltage गिरता है, और current वापस खींच लिया जाता है। नतीजा एक ऐसा Q-point है जो beta या temperature पर मुश्किल से ध्यान देता है - vibe locked रहता है।',
      visualNote:
        'Embed the be7 lecture (EN/HI cuts). Chapter markers: The baseline vibe, The load line, The fixed-bias flaw, Re feedback, A stable Q-point.',
    },
    {
      id: 'S02_QPoint',
      label: 'The Q-Point: A Resting Baseline',
      kind: 'theory',
      subtitle: 'Q-point = (Icq, Vceq), the still operating state',
      theoryEN: [
        'The quiescent point (Q-point) is the steady DC operating state with NO signal applied. "Quiescent" literally means still / at rest.',
        'It is one coordinate pair (Icq, Vceq): a resting collector current and a resting collector-emitter voltage.',
        'Its whole purpose is to confine operation to the active region so the device amplifies linearly, without distortion.',
        'Like setting the party baseline lighting before the music: pick it in the centre and the signal can swing both ways evenly.',
        'Drag the Q-point in the lab below: too high or too low clips the wave; the green band is the symmetric-swing sweet spot.',
      ],
      theoryHI: [
        'quiescent point (Q-point) वह steady DC operating state है जब कोई signal नहीं लगा हो। "Quiescent" का शाब्दिक अर्थ है स्थिर / rest पर।',
        'यह एक coordinate जोड़ी है (Icq, Vceq): एक resting collector current और एक resting collector-emitter voltage।',
        'इसका पूरा मक़सद operation को active region में सीमित रखना है ताकि device बिना distortion के linearly amplify करे।',
        'जैसे music से पहले party की baseline lighting सेट करना: इसे बीच में चुनो और signal दोनों तरफ़ बराबर झूल सकता है।',
        'नीचे lab में Q-point को drag करें: बहुत ऊपर या बहुत नीचे wave clip हो जाती है; green band ही symmetric-swing वाला sweet spot है।',
      ],
      transcriptEN:
        'The Q-point is the resting DC state (Icq, Vceq) with no signal - the baseline vibe centred for maximum symmetric swing.',
      transcriptHI:
        'Q-point बिना signal वाली resting DC state (Icq, Vceq) है - अधिकतम symmetric swing के लिए केंद्रित baseline vibe।',
      visualNote:
        'A vertical fader: top = Destruction/Max Power, glowing centre handle = Active Region / Q-point, bottom = Inactive. Centred for max swing.',
    },
    {
      id: 'S03_ActiveRegion',
      label: 'Active-Region Constraints',
      kind: 'theory',
      subtitle: 'Forward B-E, reverse B-C - or no clean amplification',
      theoryEN: [
        'Constraint 1: the base-emitter junction must be FORWARD-biased, so Vbe is about 0.6 V to 0.7 V for silicon.',
        'Constraint 2: the base-collector junction must be REVERSE-biased; this blocks the collector side and lets the device amplify.',
        'Cutoff region: Ib is at or below ~0 uA, the transistor is OFF (Ic ~ 0) - the lights are jammed fully off.',
        'Saturation region: Vce has collapsed to its minimum (Vce <= Vce,sat), the transistor is fully ON - the lights are jammed fully bright.',
        'Staying inside the active region also avoids stressing the device and shortening its lifetime.',
      ],
      theoryHI: [
        'Constraint 1: base-emitter junction FORWARD-biased होना चाहिए, तो silicon के लिए Vbe लगभग 0.6 V से 0.7 V होता है।',
        'Constraint 2: base-collector junction REVERSE-biased होना चाहिए; यह collector side को block करता है और device को amplify करने देता है।',
        'Cutoff region: Ib लगभग ~0 uA या उससे कम, transistor OFF (Ic ~ 0) - lights पूरी तरह बुझी जाम।',
        'Saturation region: Vce अपने minimum तक गिर गया (Vce <= Vce,sat), transistor पूरा ON - lights पूरी तरह तेज़ जाम।',
        'active region के अंदर रहना device पर ज़ोर डालने और उसकी उम्र घटाने से भी बचाता है।',
      ],
      transcriptEN:
        'Active region needs a forward-biased B-E junction (Vbe ~ 0.7 V) and a reverse-biased B-C junction; outside it lie cutoff and saturation.',
      transcriptHI:
        'Active region को forward-biased B-E junction (Vbe ~ 0.7 V) और reverse-biased B-C junction चाहिए; इसके बाहर cutoff और saturation हैं।',
      visualNote:
        'BJT symbol with forward-biased flow into B-E and a hatched reverse-biased block across the collector; a 3-column Active / Cutoff / Saturation table.',
    },
    {
      id: 'S04_LoadLine',
      label: 'The DC Load Line & Finding the Q-Point',
      kind: 'theory',
      subtitle: 'The dimmer-track Ic = (Vcc - Vce)/Rc, where network meets device',
      theoryEN: [
        'The DC load line is fixed ENTIRELY by the external network (Vcc and Rc), not by the transistor - it is the dimmer-track the lights slide along.',
        'Saturation end (top-left): set Vce = 0, giving the maximum current Ic,sat = Vcc/Rc. Cutoff end (bottom-right): set Ic = 0, giving Vce = Vcc.',
        'The device characteristics are a family of non-linear curves, one per value of base current Ib.',
        'The Q-point is the single intersection of the load line with the curve for the actual biasing Ib (= Ibq), handing you (Vceq, Icq).',
        'A well-placed Q-point sits near the middle of the load line for maximum symmetric swing. Drag Vcc, Rc and Ib in the lab to re-pivot it live.',
      ],
      theoryHI: [
        'DC load line पूरी तरह external network (Vcc और Rc) से तय होती है, transistor से नहीं - यही वह dimmer-track है जिस पर lights सरकती हैं।',
        'Saturation end (ऊपर-बाएँ): Vce = 0 रखो, मिलता है maximum current Ic,sat = Vcc/Rc। Cutoff end (नीचे-दाएँ): Ic = 0 रखो, मिलता है Vce = Vcc।',
        'device characteristics non-linear curves का एक परिवार हैं, हर base current Ib के मान के लिए एक।',
        'Q-point load line का असली biasing Ib (= Ibq) वाली curve से अकेला intersection है, जो आपको (Vceq, Icq) देता है।',
        'एक अच्छी जगह बैठा Q-point अधिकतम symmetric swing के लिए load line के बीचों-बीच होता है। lab में Vcc, Rc और Ib drag करके इसे live re-pivot करें।',
      ],
      transcriptEN:
        'The DC load line Ic = (Vcc - Vce)/Rc runs from saturation to cutoff; the Q-point is where it crosses the transistor curve at the biased Ibq, giving (Vceq, Icq).',
      transcriptHI:
        'DC load line Ic = (Vcc - Vce)/Rc saturation से cutoff तक जाती है; Q-point वहाँ है जहाँ यह biased Ibq पर transistor curve को काटती है, जिससे (Vceq, Icq) मिलता है।',
      visualNote:
        'Ic-vs-Vce axes with the load line crossing the Ib curve family; saturation Vcc/Rc top-left, cutoff Vcc bottom-right, a glowing dot at the Q-point.',
    },
    {
      id: 'S06_FixedBias',
      label: 'Attempt 1: The Fixed-Bias Configuration',
      kind: 'theory',
      subtitle: 'One base resistor Rb - one hand on the see-saw',
      theoryEN: [
        'The simplest possible bias: a single base resistor Rb connects the base to Vcc, plus a collector resistor Rc.',
        'Rb sets a constant base current straight from the supply - one hand balancing the see-saw.',
        'Input loop (KVL around base-emitter): Vcc - Ib*Rb - Vbe = 0, which gives Ib = (Vcc - Vbe)/Rb.',
        'Output loop (KVL around collector-emitter): Vce = Vcc - Ic*Rc.',
        'The collector current follows the base current through the amplification factor: Ic = beta*Ib. Walk the full derivation below.',
      ],
      theoryHI: [
        'सबसे सरल bias: एक अकेला base resistor Rb base को Vcc से जोड़ता है, साथ में collector resistor Rc।',
        'Rb सीधे supply से एक constant base current सेट करता है - एक हाथ see-saw संभालता हुआ।',
        'Input loop (base-emitter के चारों ओर KVL): Vcc - Ib*Rb - Vbe = 0, जिससे Ib = (Vcc - Vbe)/Rb।',
        'Output loop (collector-emitter के चारों ओर KVL): Vce = Vcc - Ic*Rc।',
        'collector current amplification factor से base current का अनुसरण करता है: Ic = beta*Ib। नीचे पूरी derivation चलाएँ।',
      ],
      transcriptEN:
        'Fixed-bias: Ib = (Vcc - Vbe)/Rb sets a constant base current, Ic = beta*Ib, and Vce = Vcc - Ic*Rc - the simplest, weakest bias.',
      transcriptHI:
        'Fixed-bias: Ib = (Vcc - Vbe)/Rb एक constant base current सेट करता है, Ic = beta*Ib, और Vce = Vcc - Ic*Rc - सबसे सरल, सबसे कमज़ोर bias।',
      visualNote:
        'Fixed-bias schematic: Vcc feeding Rb to base and Rc to collector, emitter to ground; side note "single Rb sets constant Ib".',
    },
    {
      id: 'S07_FatalFlaw',
      label: 'The Fatal Flaw & Thermal Runaway',
      kind: 'theory',
      subtitle: 'Ic = beta*Ib scales with beta - the see-saw tips',
      theoryEN: [
        'Because Ib is locked by Rb (independent of beta), Ic = beta*Ib scales DIRECTLY with beta. Nothing pushes back - there is no feedback.',
        'Beta is wildly variable: ~50 to over 400 across units, and it rises with temperature.',
        'Empirical evidence: a 50% change in beta produces an over-300% shift in the Q-point - it bolts toward saturation. The fixed-bias stability factor is terrible: S(Ico) ~ beta + 1.',
        'Thermal runaway: higher temperature raises the leakage Ico, which raises Ic, which heats the device further - a runaway feedback loop, and beta climbs too.',
        'Stability is quantified by S = dIc/dIco; a smaller S means a more stable circuit. Three sensitivities matter: S(Ico), S(Vbe), S(beta). Sweep beta in the lab to watch the see-saw tip.',
      ],
      theoryHI: [
        'चूँकि Ib को Rb lock करता है (beta से स्वतंत्र), Ic = beta*Ib सीधे beta के साथ बढ़ता है। कुछ भी पीछे नहीं धकेलता - कोई feedback नहीं।',
        'beta बेहद चंचल है: units में ~50 से 400 से ऊपर तक, और यह temperature के साथ बढ़ता है।',
        'अनुभवजन्य सबूत: beta में 50% बदलाव Q-point में 300% से ज़्यादा shift पैदा करता है - यह saturation की ओर भागता है। fixed-bias stability factor बहुत ख़राब है: S(Ico) ~ beta + 1।',
        'Thermal runaway: ज़्यादा temperature leakage Ico बढ़ाता है, जो Ic बढ़ाता है, जो device को और गरम करता है - एक runaway feedback loop, और beta भी चढ़ता है।',
        'Stability को S = dIc/dIco से नापा जाता है; छोटा S यानी ज़्यादा stable circuit। तीन sensitivities मायने रखती हैं: S(Ico), S(Vbe), S(beta)। lab में beta sweep करके see-saw को लुढ़कते देखें।',
      ],
      transcriptEN:
        'Fixed-bias Ic tracks beta one-for-one with no feedback; a 50% beta change shifts the Q-point over 300% and thermal runaway makes it worse. S(Ico) ~ beta + 1.',
      transcriptHI:
        'Fixed-bias Ic बिना feedback के beta का एक-के-एक अनुसरण करता है; 50% beta बदलाव Q-point को 300% से ज़्यादा shift करता है और thermal runaway इसे बदतर करता है। S(Ico) ~ beta + 1।',
      visualNote:
        'Two load-line plots: initial Q centred, then after +50% beta a thick arrow shoves Q into saturation; warning triangles on S(Ico) ~ beta.',
    },
    {
      id: 'S08_DividerBias',
      label: 'The Solution: Voltage-Divider Bias',
      kind: 'theory',
      subtitle: 'R1-R2 divider + Re feedback bolts the pivot down',
      theoryEN: [
        'The fix uses a resistor divider R1-R2 at the base plus an emitter resistor Re for vital negative feedback.',
        'Re is the key: if Ic tries to rise, the emitter voltage Ve rises, which reduces Vbe and throttles the current back down.',
        'This negative feedback bolts the see-saw pivot to the floor so beta and temperature cannot tip it.',
        'Result: the Q-point (Icq, Vceq) becomes largely independent of temperature and transistor beta.',
        'Cost: a little more complexity (two divider resistors + emitter resistor) than fixed-bias - but far more stable. Sweep beta below to compare both biases side by side.',
      ],
      theoryHI: [
        'हल base पर एक resistor divider R1-R2 और एक emitter resistor Re के साथ vital negative feedback का उपयोग करता है।',
        'Re कुंजी है: अगर Ic बढ़ने लगे, emitter voltage Ve बढ़ता है, जो Vbe घटाता है और current को वापस नीचे दबा देता है।',
        'यह negative feedback see-saw pivot को फ़र्श में बोल्ट कर देता है ताकि beta और temperature इसे न लुढ़का सकें।',
        'नतीजा: Q-point (Icq, Vceq) काफ़ी हद तक temperature और transistor beta से स्वतंत्र हो जाता है।',
        'क़ीमत: fixed-bias से थोड़ी ज़्यादा complexity (दो divider resistors + emitter resistor) - पर कहीं ज़्यादा stable। नीचे beta sweep करके दोनों biases की तुलना करें।',
      ],
      transcriptEN:
        'Voltage-divider bias: R1-R2 stiffens the base voltage and Re adds negative feedback so the Q-point stops tracking beta and temperature.',
      transcriptHI:
        'Voltage-divider bias: R1-R2 base voltage को stiff करता है और Re negative feedback जोड़ता है ताकि Q-point beta और temperature का अनुसरण करना बंद कर दे।',
      visualNote:
        'Voltage-divider schematic: R1/R2 into base, Rc to collector, Re to ground with coupling caps; Re highlighted as the feedback element.',
    },
    {
      id: 'S09_Thevenin',
      label: 'Exact Analysis: The Thevenin Equivalent',
      kind: 'theory',
      subtitle: 'Rth = R1||R2, Vth = Vcc*R2/(R1+R2), then KVL for Ib',
      theoryEN: [
        'Replace the divider R1, R2 with its Thevenin equivalent looking into the base. Thevenin resistance: Rth = R1 parallel R2; Thevenin voltage: Vth = Vcc*R2/(R1+R2).',
        'Apply KVL around the base-emitter loop: Vth - Ib*Rth - Vbe - Ie*Re = 0.',
        'Substitute Ie = (beta+1)*Ib and solve: Ib = (Vth - Vbe)/(Rth + (beta+1)*Re); then Ic = beta*Ib, Ie ~ Ic, and Vce = Vcc - Ic*(Rc+Re).',
        'The exact solve below uses real deck values (Vth ~ 11.5 V, Rth ~ 1.6 kohm, Re = 1.8 kohm, beta = 120) - every number computed live.',
        'Notice the (beta+1)*Re term dominating the denominator: that is exactly why Ib, and the whole Q-point, barely depend on beta.',
      ],
      theoryHI: [
        'divider R1, R2 को base में देखते हुए उसके Thevenin equivalent से बदलो। Thevenin resistance: Rth = R1 parallel R2; Thevenin voltage: Vth = Vcc*R2/(R1+R2)।',
        'base-emitter loop के चारों ओर KVL लगाओ: Vth - Ib*Rth - Vbe - Ie*Re = 0।',
        'Ie = (beta+1)*Ib रखो और हल करो: Ib = (Vth - Vbe)/(Rth + (beta+1)*Re); फिर Ic = beta*Ib, Ie ~ Ic, और Vce = Vcc - Ic*(Rc+Re)।',
        'नीचे exact solve असली deck मानों का उपयोग करता है (Vth ~ 11.5 V, Rth ~ 1.6 kohm, Re = 1.8 kohm, beta = 120) - हर number live computed।',
        'denominator में (beta+1)*Re पद का हावी होना देखिए: यही ठीक वह कारण है कि Ib, और पूरा Q-point, beta पर मुश्किल से निर्भर करता है।',
      ],
      transcriptEN:
        'Theveninize the divider: Vth = Vcc*R2/(R1+R2), Rth = R1||R2, then Ib = (Vth - Vbe)/(Rth + (beta+1)*Re) from the base-emitter KVL, and Vce = Vcc - Ic*(Rc+Re).',
      transcriptHI:
        'divider को Theveninize करो: Vth = Vcc*R2/(R1+R2), Rth = R1||R2, फिर base-emitter KVL से Ib = (Vth - Vbe)/(Rth + (beta+1)*Re), और Vce = Vcc - Ic*(Rc+Re)।',
      visualNote:
        'Left: R1/R2/Vcc divider. Big arrow to right: a single Vth source in series with Rth driving the base, Re at the emitter, beta=120 labelled; a step-through solve.',
    },
    {
      id: 'S10_StabilityProof',
      label: 'The Stability Condition & Beta-Independent Proof',
      kind: 'theory',
      subtitle: 'beta*Re >= 10*R2 => Icq ~ Ve/Re, no beta',
      theoryEN: [
        'Stability rule of thumb: beta*Re >= 10*R2 (the reflected emitter resistance dwarfs R2).',
        'When it holds, the base current is negligible, the divider current flows almost untouched (I1 ~ I2), and pure divider rules set Vb ~ Vcc*R2/(R1+R2) - decoupled from beta.',
        'Then: Ve = Vb - Vbe, Ie = Ve/Re, and Icq ~ Ie = Ve/Re - beta has VANISHED from the operating-current equation.',
        'Because the final equation contains no beta, the Q-point is stable against beta and temperature; Vce = Vcc - Ic*(Rc+Re) places it on the load line, still beta-free.',
        'Use the checker below: sweep beta, Re and R2 to see when the condition flips valid and the Icq-vs-beta bars go flat.',
      ],
      theoryHI: [
        'Stability का अंगूठा-नियम: beta*Re >= 10*R2 (reflected emitter resistance R2 को बौना कर देता है)।',
        'जब यह सही होता है, base current नगण्य होता है, divider current लगभग बिना छुए बहता है (I1 ~ I2), और शुद्ध divider नियम Vb ~ Vcc*R2/(R1+R2) सेट करते हैं - beta से अलग।',
        'फिर: Ve = Vb - Vbe, Ie = Ve/Re, और Icq ~ Ie = Ve/Re - operating-current समीकरण से beta ग़ायब हो गया है।',
        'चूँकि अंतिम समीकरण में कोई beta नहीं, Q-point beta और temperature के विरुद्ध stable है; Vce = Vcc - Ic*(Rc+Re) इसे load line पर बिठाता है, फिर भी beta-free।',
        'नीचे checker का उपयोग करें: beta, Re और R2 sweep करके देखें कि condition कब valid होती है और Icq-vs-beta bars कब सपाट हो जाते हैं।',
      ],
      transcriptEN:
        'When beta*Re >= 10*R2, Vb ~ Vcc*R2/(R1+R2), Ve = Vb - Vbe, and Icq ~ Ve/Re - the operating current has no beta, so the Q-point is stable.',
      transcriptHI:
        'जब beta*Re >= 10*R2, Vb ~ Vcc*R2/(R1+R2), Ve = Vb - Vbe, और Icq ~ Ve/Re - operating current में कोई beta नहीं, तो Q-point stable है।',
      visualNote:
        'Flow chart: beta*Re >= 10*R2 -> Ib ~ 0 -> I1 ~ I2 -> Vb decoupled from beta -> Ve = Vb - Vbe -> Icq ~ Ve/Re (no beta).',
    },
    {
      id: 'S11_Synthesis',
      label: 'Synthesis: Fixed-Bias vs Voltage-Divider Bias',
      kind: 'theory',
      subtitle: 'One hand vs a bolted pivot - which holds the vibe?',
      theoryEN: [
        'Complexity: fixed-bias is minimal (1 base resistor); divider bias is moderate (divider + emitter resistor).',
        'Ib determination: fixed by Rb in fixed-bias; set by Vth and Rth in divider bias.',
        'Beta dependency: EXTREME for fixed-bias (Ic scales directly with beta); NEGLIGIBLE for divider bias when beta*Re >= 10*R2.',
        'Stability factor: very poor (S ~ beta+1) for fixed-bias; excellent (S approaches 1 as Re grows) for divider bias.',
        'Under a 50% beta change: fixed-bias shifts >300%, divider bias shifts <3% - the divider is the recommended architecture for stable analog design.',
      ],
      theoryHI: [
        'Complexity: fixed-bias न्यूनतम (1 base resistor); divider bias मध्यम (divider + emitter resistor)।',
        'Ib निर्धारण: fixed-bias में Rb से तय; divider bias में Vth और Rth से सेट।',
        'Beta निर्भरता: fixed-bias के लिए अत्यधिक (Ic सीधे beta के साथ बढ़ता है); divider bias के लिए नगण्य जब beta*Re >= 10*R2।',
        'Stability factor: fixed-bias के लिए बहुत ख़राब (S ~ beta+1); divider bias के लिए उत्कृष्ट (Re बढ़ने पर S 1 की ओर जाता है)।',
        '50% beta बदलाव पर: fixed-bias >300% shift होता है, divider bias <3% shift - stable analog design के लिए divider ही अनुशंसित architecture है।',
      ],
      transcriptEN:
        'Fixed-bias is simple but beta-sensitive (S ~ beta+1, >300% shift); voltage-divider bias is moderate but beta-independent (S -> 1, <3% shift).',
      transcriptHI:
        'Fixed-bias सरल पर beta-sensitive है (S ~ beta+1, >300% shift); voltage-divider bias मध्यम पर beta-independent है (S -> 1, <3% shift)।',
      visualNote:
        'Comparison table: Complexity, Ib determination, Beta dependency, Stability factor; Fixed vs Voltage-Divider (Recommended). <3% vs >300% shift.',
    },
    {
      id: 'S12_Flashcards',
      label: 'Flashcards - Lock It In',
      kind: 'flashcards',
      subtitle: 'Eight cards: Q-point, load line, the two biases',
      theoryEN: [
        'Flip each card: the term on the front, the plain explanation on the back.',
        'These eight cover the Q-point, the DC load line, active-region conditions, the fixed-bias equations and its fatal flaw, the voltage-divider fix, the stability condition, and the stability factor S.',
        'Explain each back in your own words before flipping - that is real recall.',
      ],
      theoryHI: [
        'हर card को पलटें: सामने term, पीछे सीधी व्याख्या।',
        'ये आठ cards Q-point, DC load line, active-region conditions, fixed-bias समीकरण और उसका fatal flaw, voltage-divider fix, stability condition, और stability factor S को cover करते हैं।',
        'पलटने से पहले हर पीछे वाली बात अपने शब्दों में बताएँ - यही असली recall है।',
      ],
      transcriptEN:
        'Eight flashcards to lock in the Q-point, the load line, and why the voltage divider beats fixed-bias.',
      transcriptHI:
        'Q-point, load line, और voltage divider fixed-bias को क्यों हराता है - इन्हें बैठाने के लिए आठ flashcards।',
      visualNote: 'Watermarked shareable flip-card deck; front shows the bold term, back the explanation.',
    },
    {
      id: 'S13_Quiz',
      label: 'Quiz - Test the Q-Point',
      kind: 'quiz',
      subtitle: 'Eight questions on biasing and stability',
      theoryEN: [
        'Eight multiple-choice questions, each testing the Q-point, the load line, fixed-bias, or the voltage-divider stability.',
        'Read every option - the wrong ones are the misconceptions this module exists to break.',
        'Explanations follow each answer so a miss becomes a lesson.',
      ],
      theoryHI: [
        'आठ multiple-choice सवाल, हर एक Q-point, load line, fixed-bias, या voltage-divider stability जाँचता है।',
        'हर option पढ़ें - ग़लत वाले वही misconceptions हैं जिन्हें तोड़ने के लिए यह module बना है।',
        'हर जवाब के बाद explanation है ताकि चूक भी एक सबक़ बन जाए।',
      ],
      transcriptEN: 'Eight quick questions on biasing, the load line, and stability. Read all four options each time.',
      transcriptHI: 'biasing, load line, और stability पर आठ तेज़ सवाल। हर बार चारों options पढ़ें।',
      visualNote: 'QuizArena with eight problems; running score and reveal explanation on answer.',
    },
    {
      id: 'S14_Recap',
      label: 'Recap - The Stable Vibe in One Page',
      kind: 'recap',
      subtitle: 'Everything that keeps the Q-point locked',
      theoryEN: [
        'The vibe: the Q-point (Icq, Vceq) is the resting DC state; centre it on the load line for maximum symmetric swing.',
        'The track: the DC load line Ic = (Vcc - Vce)/Rc is set by the network alone - saturation at Vcc/Rc, cutoff at Vcc.',
        'The flaw: fixed-bias Ic = beta*Ib scales with beta (S ~ beta+1), so a 50% beta change shifts the Q-point over 300%.',
        'The fix: voltage-divider bias stiffens Vb and adds Re feedback, so Icq ~ Ve/Re contains no beta and S approaches 1 (<3% shift).',
        'The condition: beta*Re >= 10*R2 makes the base current negligible and the bias beta-independent. See the sources below.',
      ],
      theoryHI: [
        'vibe: Q-point (Icq, Vceq) resting DC state है; अधिकतम symmetric swing के लिए इसे load line पर केंद्रित करो।',
        'track: DC load line Ic = (Vcc - Vce)/Rc अकेले network से तय होती है - saturation Vcc/Rc पर, cutoff Vcc पर।',
        'flaw: fixed-bias Ic = beta*Ib beta के साथ बढ़ता है (S ~ beta+1), तो 50% beta बदलाव Q-point को 300% से ज़्यादा shift करता है।',
        'fix: voltage-divider bias Vb को stiff करता है और Re feedback जोड़ता है, तो Icq ~ Ve/Re में कोई beta नहीं और S 1 की ओर जाता है (<3% shift)।',
        'condition: beta*Re >= 10*R2 base current को नगण्य और bias को beta-independent बनाता है। नीचे sources देखें।',
      ],
      transcriptEN:
        'Centre the Q-point on the network load line; fixed-bias tracks beta (S ~ beta+1) but voltage-divider bias with Re holds it (Icq ~ Ve/Re, S -> 1).',
      transcriptHI:
        'Q-point को network load line पर केंद्रित करो; fixed-bias beta का अनुसरण करता है (S ~ beta+1) पर Re वाला voltage-divider bias इसे थामे रखता है (Icq ~ Ve/Re, S -> 1)।',
      visualNote:
        'One-page cheat grid: The vibe / The flaw / The fix, plus a Sources footer with the proof references.',
    },
  ],
  flashcards: [
    {
      frontEN: 'Q-point (quiescent point)',
      backEN:
        "The transistor's resting DC operating state (Icq, Vceq) with no signal applied - the baseline vibe set before the music plays. Centre it on the load line for maximum symmetric swing.",
      frontHI: 'Q-point (quiescent point)',
      backHI:
        'transistor की resting DC operating state (Icq, Vceq) जब कोई signal न लगा हो - music बजने से पहले सेट किया गया baseline vibe। अधिकतम symmetric swing के लिए इसे load line पर केंद्रित करो।',
    },
    {
      frontEN: 'DC load line',
      backEN:
        'The straight line of all allowed (Ic, Vce) points set by the external network: Ic = (Vcc - Vce)/Rc. Endpoints: saturation Ic,sat = Vcc/Rc (at Vce=0) and cutoff Vce = Vcc (at Ic=0).',
      frontHI: 'DC load line',
      backHI:
        'external network से तय सभी अनुमत (Ic, Vce) बिंदुओं की सीधी रेखा: Ic = (Vcc - Vce)/Rc। Endpoints: saturation Ic,sat = Vcc/Rc (Vce=0 पर) और cutoff Vce = Vcc (Ic=0 पर)।',
    },
    {
      frontEN: 'Active-region conditions',
      backEN:
        'The B-E junction must be forward-biased (Vbe ~ 0.6-0.7 V) AND the B-C junction reverse-biased - required for linear amplification. Cutoff: Ib ~ 0. Saturation: Vce <= Vce,sat.',
      frontHI: 'Active-region conditions',
      backHI:
        'B-E junction forward-biased होना चाहिए (Vbe ~ 0.6-0.7 V) और B-C junction reverse-biased - linear amplification के लिए ज़रूरी। Cutoff: Ib ~ 0। Saturation: Vce <= Vce,sat।',
    },
    {
      frontEN: 'Fixed-bias key equations',
      backEN:
        'Ib = (Vcc - Vbe)/Rb, Ic = beta*Ib, Vce = Vcc - Ic*Rc. Ib is fixed by Rb alone, so Ic tracks beta directly - one hand on the see-saw.',
      frontHI: 'Fixed-bias मुख्य समीकरण',
      backHI:
        'Ib = (Vcc - Vbe)/Rb, Ic = beta*Ib, Vce = Vcc - Ic*Rc। Ib को अकेला Rb तय करता है, तो Ic सीधे beta का अनुसरण करता है - see-saw पर एक हाथ।',
    },
    {
      frontEN: 'The fatal flaw of fixed-bias',
      backEN:
        'Ic = beta*Ib scales directly with beta and nothing offsets it. Beta ranges ~50 to 400+ and rises with heat, so a 50% beta change causes a >300% Q-point shift. S(Ico) ~ beta + 1.',
      frontHI: 'Fixed-bias का fatal flaw',
      backHI:
        'Ic = beta*Ib सीधे beta के साथ बढ़ता है और कुछ भी इसे offset नहीं करता। beta ~50 से 400+ तक और गर्मी के साथ बढ़ता है, तो 50% beta बदलाव >300% Q-point shift करता है। S(Ico) ~ beta + 1।',
    },
    {
      frontEN: 'Voltage-divider bias fix',
      backEN:
        'An R1-R2 divider sets a stiff base voltage and Re adds negative feedback: if Ic rises, Ve rises, Vbe drops, Ic falls back. The Q-point becomes beta-independent - the pivot bolted to the floor.',
      frontHI: 'Voltage-divider bias fix',
      backHI:
        'एक R1-R2 divider एक stiff base voltage सेट करता है और Re negative feedback जोड़ता है: अगर Ic बढ़े, Ve बढ़ता है, Vbe गिरता है, Ic वापस गिरता है। Q-point beta-independent हो जाता है - pivot फ़र्श में बोल्ट।',
    },
    {
      frontEN: 'Stability condition',
      backEN:
        'beta*Re >= 10*R2 makes the base current negligible, so Vb ~ Vcc*R2/(R1+R2), Ve = Vb - Vbe, and Icq ~ Ve/Re - all free of beta. The reflected emitter resistance dwarfs R2.',
      frontHI: 'Stability condition',
      backHI:
        'beta*Re >= 10*R2 base current को नगण्य बनाता है, तो Vb ~ Vcc*R2/(R1+R2), Ve = Vb - Vbe, और Icq ~ Ve/Re - सब beta से मुक्त। reflected emitter resistance R2 को बौना कर देता है।',
    },
    {
      frontEN: 'Stability factor S',
      backEN:
        'S(Ico) = dIc/dIco, S(Vbe) = dIc/dVbe, S(beta) = dIc/dbeta. A small S means the Q-point barely drifts. Fixed-bias: S ~ beta+1 (poor). Divider bias: S -> 1 as Re grows (excellent).',
      frontHI: 'Stability factor S',
      backHI:
        'S(Ico) = dIc/dIco, S(Vbe) = dIc/dVbe, S(beta) = dIc/dbeta। छोटा S यानी Q-point मुश्किल से बहता है। Fixed-bias: S ~ beta+1 (ख़राब)। Divider bias: Re बढ़ने पर S -> 1 (उत्कृष्ट)।',
    },
  ],
  quiz: [
    {
      questionEN: "What does the 'quiescent' in quiescent point (Q-point) mean?",
      questionHI: "quiescent point (Q-point) में 'quiescent' का क्या अर्थ है?",
      options: [
        'The point of maximum power dissipation',
        'The DC operating state with no AC signal applied (at rest)',
        'The frequency at which the amplifier resonates',
        'The point where the transistor switches fully off',
      ],
      answerIndex: 1,
      explainEN:
        'Quiescent means still / at rest - the Q-point is the steady DC operating state (Icq, Vceq) before any signal is applied.',
      explainHI:
        'Quiescent का अर्थ है स्थिर / rest पर - Q-point किसी signal लगने से पहले की steady DC operating state (Icq, Vceq) है।',
    },
    {
      questionEN: 'For a BJT to operate in the active region, the junctions must be biased how?',
      questionHI: 'BJT को active region में चलाने के लिए junctions को कैसे bias करना चाहिए?',
      options: [
        'Both junctions reverse-biased',
        'Both junctions forward-biased',
        'Base-emitter forward-biased, base-collector reverse-biased',
        'Base-emitter reverse-biased, base-collector forward-biased',
      ],
      answerIndex: 2,
      explainEN:
        'Active-region operation requires a forward-biased B-E junction (Vbe ~ 0.7 V) and a reverse-biased B-C junction.',
      explainHI:
        'Active-region operation को forward-biased B-E junction (Vbe ~ 0.7 V) और reverse-biased B-C junction चाहिए।',
    },
    {
      questionEN: 'What is the collector current at the saturation end of the DC load line?',
      questionHI: 'DC load line के saturation सिरे पर collector current क्या होता है?',
      options: [
        'Ic = Vcc/Rc (when Vce = 0)',
        'Ic = 0 (when Vce = Vcc)',
        'Ic = beta*Ib',
        'Ic = Vcc/Rb',
      ],
      answerIndex: 0,
      explainEN:
        'At saturation Vce = 0, so from Ic = (Vcc - Vce)/Rc the current is the maximum Ic,sat = Vcc/Rc.',
      explainHI:
        'Saturation पर Vce = 0, तो Ic = (Vcc - Vce)/Rc से current अधिकतम Ic,sat = Vcc/Rc होता है।',
    },
    {
      questionEN: 'In fixed-bias, why does the Q-point shift so badly when beta changes?',
      questionHI: 'Fixed-bias में beta बदलने पर Q-point इतना बुरी तरह क्यों shift होता है?',
      options: [
        'Because Rb changes with temperature',
        'Because Ib is fixed by Rb, so Ic = beta*Ib scales directly with beta and nothing offsets it',
        'Because Vce becomes negative',
        'Because the emitter resistor saturates',
      ],
      answerIndex: 1,
      explainEN:
        'Ib is set by Rb independent of beta, so Ic = beta*Ib tracks beta directly with no feedback - a 50% beta change gives a >300% shift.',
      explainHI:
        'Ib को Rb beta से स्वतंत्र रूप से सेट करता है, तो Ic = beta*Ib बिना feedback के सीधे beta का अनुसरण करता है - 50% beta बदलाव >300% shift देता है।',
    },
    {
      questionEN: 'The DC load line is determined by which elements?',
      questionHI: 'DC load line किन elements से तय होती है?',
      options: [
        'Beta and Vbe of the transistor',
        'The external network: Vcc and Rc',
        'R1 and R2 only',
        'The leakage current Ico',
      ],
      answerIndex: 1,
      explainEN:
        'The load line is fixed strictly by the external network (Vcc and Rc); the transistor characteristic curves are separate.',
      explainHI:
        'Load line पूरी तरह external network (Vcc और Rc) से तय होती है; transistor की characteristic curves अलग होती हैं।',
    },
    {
      questionEN: 'What is the Thevenin voltage of the base voltage-divider?',
      questionHI: 'base voltage-divider का Thevenin voltage क्या है?',
      options: [
        'Vth = Vcc*R1/(R1+R2)',
        'Vth = Vcc*R2/(R1+R2)',
        'Vth = Vcc - Vbe',
        'Vth = R1||R2',
      ],
      answerIndex: 1,
      explainEN:
        'Vth = Vcc*R2/(R1+R2); R1||R2 is the Thevenin resistance Rth, not the voltage.',
      explainHI:
        'Vth = Vcc*R2/(R1+R2); R1||R2 तो Thevenin resistance Rth है, voltage नहीं।',
    },
    {
      questionEN: 'Which condition makes voltage-divider bias essentially beta-independent?',
      questionHI: 'कौन सी condition voltage-divider bias को मूलतः beta-independent बनाती है?',
      options: ['Rc >= 10*Re', 'beta*Re >= 10*R2', 'R1 = R2', 'Vbe = 0'],
      answerIndex: 1,
      explainEN:
        'When beta*Re >= 10*R2 the base current is negligible, the divider sets Vb directly, and Icq ~ Ve/Re contains no beta.',
      explainHI:
        'जब beta*Re >= 10*R2, base current नगण्य होता है, divider सीधे Vb सेट करता है, और Icq ~ Ve/Re में कोई beta नहीं होता।',
    },
    {
      questionEN: 'Why is a smaller stability factor S = dIc/dIco desirable?',
      questionHI: 'छोटा stability factor S = dIc/dIco क्यों वांछनीय है?',
      options: [
        'It increases the voltage gain',
        'It means the collector current changes little when conditions (leakage/temperature) drift',
        'It maximizes power dissipation',
        'It pushes the Q-point into saturation',
      ],
      answerIndex: 1,
      explainEN:
        'S measures how much Ic moves per change in Ico; a small S means the Q-point barely drifts, so the circuit is stable.',
      explainHI:
        'S नापता है कि Ico में बदलाव पर Ic कितना हिलता है; छोटा S यानी Q-point मुश्किल से बहता है, तो circuit stable है।',
    },
  ],
};
