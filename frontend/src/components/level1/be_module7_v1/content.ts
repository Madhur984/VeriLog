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
        'A transistor is an amplifier: a tiny input signal goes in and a much larger copy comes out. But before we send any signal in, we first have to decide where the transistor should sit when it is doing nothing at all. Think of a DJ setting the room lights to a comfortable level before the music starts. That comfortable resting level is what we call the operating point, or Q-point.',
        'Setting that resting level is what biasing means. We connect the transistor to a steady supply voltage (called Vcc) through a few resistors. These resistors push a small, steady DC current into the transistor and hold a steady DC voltage across it. There is no signal yet; we are just choosing the calm starting position.',
        'We want that starting position to sit right in the middle of the useful operating range (the active region), like a see-saw resting perfectly level. Then when a signal arrives, it can rock the transistor up and down by equal amounts. If we instead parked it too high or too low, one side of the signal would slam into a limit and get cut off, distorting the sound.',
        'The trouble is that transistors are not all identical and they change with heat. Their gain (a number called beta) can be anywhere from about 50 to over 400, and it climbs as the device warms up. If our chosen resting point moves every time beta changes, the amplifier becomes unreliable.',
        'This module shows two ways to set the resting point. The simple way (fixed bias) uses a single resistor and falls apart the moment beta drifts. The better way (voltage-divider bias) adds an emitter resistor that quietly corrects itself, holding the resting point steady no matter what beta or temperature do.',
      ],
      theoryHI: [
        'एक transistor एक amplifier है: एक छोटा सा input signal अंदर जाता है और उसकी कहीं बड़ी copy बाहर आती है। पर कोई signal भेजने से पहले हमें यह तय करना होता है कि जब transistor कुछ भी नहीं कर रहा हो तब उसे कहाँ बैठना चाहिए। सोचिए एक DJ music शुरू होने से पहले lights को एक आरामदेह level पर सेट करता है। वही आरामदेह resting level ही operating point, यानी Q-point, कहलाता है।',
        'वही resting level सेट करना ही biasing कहलाता है। हम transistor को एक steady supply voltage (जिसे Vcc कहते हैं) से कुछ resistors के ज़रिए जोड़ते हैं। ये resistors transistor में एक छोटा, steady DC current भेजते हैं और उस पर एक steady DC voltage बनाए रखते हैं। अभी कोई signal नहीं है; हम बस शांत शुरुआती स्थिति चुन रहे हैं।',
        'हम चाहते हैं कि यह शुरुआती स्थिति useful operating range (active region) के ठीक बीच में बैठे, जैसे एक see-saw बिलकुल level पर टिका हो। फिर जब signal आता है, वह transistor को बराबर मात्रा में ऊपर-नीचे झुला सकता है। अगर हम इसे बहुत ऊपर या बहुत नीचे खड़ा कर दें, तो signal का एक हिस्सा किसी limit से टकराकर कट जाएगा और आवाज़ बिगड़ जाएगी।',
        'दिक्कत यह है कि सारे transistors एक जैसे नहीं होते और गर्मी से बदलते हैं। उनका gain (एक संख्या जिसे beta कहते हैं) लगभग 50 से 400 से ऊपर तक कुछ भी हो सकता है, और device गरम होने पर यह बढ़ता है। अगर beta बदलने पर हमारी चुनी हुई resting स्थिति हर बार खिसक जाए, तो amplifier भरोसेमंद नहीं रहता।',
        'यह module resting point सेट करने के दो तरीके दिखाता है। सरल तरीका (fixed bias) एक अकेले resistor से काम चलाता है और beta खिसकते ही बिखर जाता है। बेहतर तरीका (voltage-divider bias) एक emitter resistor जोड़ता है जो चुपचाप ख़ुद को सुधार लेता है, और beta या temperature चाहे जो करें, resting point को स्थिर रखता है।',
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
        'Watch this lesson first; it walks through the whole story before we do the algebra. The single idea to hold on to is that biasing means setting a calm, steady resting point for the transistor before any signal arrives.',
        'The video starts by drawing the DC load line. This is simply the set of all current-and-voltage combinations the outside circuit (the supply Vcc and the collector resistor Rc) will allow. The resting point, or Q-point, has to sit somewhere on this line, and the middle is the safest spot.',
        'It then shows why the simplest circuit fails. In fixed bias the collector current is just beta times the base current, so when beta changes the current changes by exactly the same fraction. Because nothing pushes back, a 50 percent change in beta can shove the resting point by more than 300 percent.',
        'Finally the video introduces the fix: a voltage-divider bias with an emitter resistor called Re. Re provides negative feedback, meaning it automatically opposes any unwanted change in current. This locks the resting point in place even as beta and temperature wander.',
        'Keep one plain rule in mind throughout: a good bias leaves equal room for the signal to swing both above and below the resting point, so neither half of the wave gets clipped.',
      ],
      theoryHI: [
        'पहले यह lesson देखें; algebra करने से पहले यह पूरी कहानी समझा देता है। पकड़ने लायक एक ही विचार यह है कि biasing का मतलब है signal आने से पहले transistor के लिए एक शांत, steady resting point सेट करना।',
        'video DC load line खींचकर शुरू होता है। यह बस current-और-voltage के उन सभी combinations का समूह है जिन्हें बाहरी circuit (supply Vcc और collector resistor Rc) की अनुमति है। resting point, यानी Q-point, को इसी line पर कहीं बैठना है, और बीच सबसे सुरक्षित जगह है।',
        'फिर यह दिखाता है कि सबसे सरल circuit क्यों फेल होता है। fixed bias में collector current बस base current का beta गुना होता है, तो beta बदलने पर current ठीक उसी अनुपात में बदल जाता है। चूँकि कुछ भी पीछे नहीं धकेलता, beta में 50 प्रतिशत बदलाव resting point को 300 प्रतिशत से ज़्यादा खिसका सकता है।',
        'अंत में video हल पेश करता है: एक voltage-divider bias जिसमें Re नाम का emitter resistor होता है। Re negative feedback देता है, यानी यह current में किसी भी अनचाहे बदलाव का अपने आप विरोध करता है। इससे beta और temperature भटकें भी तो resting point अपनी जगह बना रहता है।',
        'पूरे समय एक सीधा नियम याद रखें: एक अच्छा bias signal को resting point के ऊपर और नीचे बराबर झूलने की जगह देता है, ताकि wave का कोई आधा हिस्सा कटे नहीं।',
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
        'The resting point of a transistor has a proper name: the quiescent point, usually shortened to Q-point. The word quiescent just means still or at rest, so the Q-point is simply where the transistor sits when no signal is being applied and everything is quiet.',
        'This resting state is described by two numbers. The first is the steady collector current flowing through the transistor, which we write as Icq. The second is the steady voltage measured from the collector terminal to the emitter terminal, written Vceq. Together they form the coordinate pair (Icq, Vceq), which is just a single dot on a graph of current against voltage.',
        'The reason we care so much about where this dot sits is that we need the transistor to amplify cleanly. To do that it must stay inside its useful working range, called the active region. If the resting dot is parked inside that region, the transistor multiplies the signal faithfully; if it strays outside, the output gets distorted.',
        'This is exactly the DJ setting the baseline lighting before the music plays. If the lights start in the middle, they can brighten and dim by equal amounts. If they start almost fully on, they cannot get any brighter, and the upper half of every beat is lost. Centering the Q-point gives the signal equal room to swing in both directions.',
        'Try this in the lab below. Drag the Q-point up and the upper part of the wave flattens against the ceiling; drag it down and the lower part flattens against the floor. The green band in the middle is the sweet spot where the whole wave survives untouched.',
      ],
      theoryHI: [
        'transistor की resting स्थिति का एक नाम है: quiescent point, जिसे आम तौर पर Q-point कहते हैं। quiescent शब्द का मतलब है स्थिर या rest पर, तो Q-point बस वह जगह है जहाँ transistor तब बैठता है जब कोई signal नहीं लगा हो और सब शांत हो।',
        'इस resting state को दो संख्याओं से बताया जाता है। पहली है transistor में बहता steady collector current, जिसे हम Icq लिखते हैं। दूसरी है collector terminal से emitter terminal तक नापा गया steady voltage, जिसे Vceq लिखते हैं। मिलकर ये coordinate जोड़ी (Icq, Vceq) बनाते हैं, जो current बनाम voltage के graph पर बस एक बिंदु है।',
        'हमें इस बिंदु की जगह की इतनी परवाह इसलिए है क्योंकि हमें transistor से साफ़ amplification चाहिए। इसके लिए उसे अपने useful working range, यानी active region, के अंदर रहना होगा। अगर resting बिंदु उस region के अंदर खड़ा है, तो transistor signal को ईमानदारी से गुणा करता है; अगर यह बाहर भटक जाए, तो output बिगड़ जाता है।',
        'यह ठीक वही DJ है जो music बजने से पहले baseline lighting सेट करता है। अगर lights बीच से शुरू हों, तो वे बराबर मात्रा में तेज़ और मद्धम हो सकती हैं। अगर वे लगभग पूरी जली शुरू हों, तो और तेज़ नहीं हो सकतीं, और हर beat का ऊपरी आधा खो जाता है। Q-point को बीच में रखना signal को दोनों दिशाओं में बराबर झूलने की जगह देता है।',
        'नीचे lab में आज़माएँ। Q-point को ऊपर खींचें तो wave का ऊपरी हिस्सा छत से चिपककर चपटा हो जाता है; नीचे खींचें तो निचला हिस्सा फ़र्श से चपटा हो जाता है। बीच का green band वही sweet spot है जहाँ पूरी wave बिना छुए बच जाती है।',
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
        'A transistor has two internal junctions where its layers meet: the base-emitter junction and the base-collector junction. The active region is the special condition where the transistor amplifies, and it only happens when these two junctions are set up in a particular way.',
        'The first requirement is that the base-emitter junction must be forward-biased, meaning it is pushed on so current can flow across it. For a silicon transistor this junction holds a roughly fixed voltage drop of about 0.6 V to 0.7 V, which we call Vbe. We almost always use 0.7 V in our sums.',
        'The second requirement is that the base-collector junction must be reverse-biased, meaning it is pushed the other way so it blocks. This blocking is what lets the collector act like a controlled valve, and it is essential for amplification. With one junction forward-biased and the other reverse-biased, the transistor sits in its active region.',
        'If we get this wrong the transistor falls out of the active region into one of two useless extremes. In cutoff the base current drops to nearly zero, so the collector current is essentially zero and the transistor is fully OFF, like lights jammed dark. In saturation the collector-to-emitter voltage collapses to its smallest possible value (Vce,sat), the transistor is fully ON, and like lights jammed at full brightness it can do nothing more.',
        'Staying in the middle, inside the active region, is therefore not just about clean sound. It also keeps the transistor from being overworked, which protects it from overheating and extends its lifetime.',
      ],
      theoryHI: [
        'एक transistor के अंदर दो junctions होते हैं जहाँ उसकी परतें मिलती हैं: base-emitter junction और base-collector junction। active region वह ख़ास हालत है जहाँ transistor amplify करता है, और यह तभी होता है जब ये दोनों junctions एक ख़ास तरीके से सेट हों।',
        'पहली शर्त यह है कि base-emitter junction forward-biased होना चाहिए, यानी इसे इस तरह चालू किया गया हो कि उसके आर-पार current बह सके। silicon transistor के लिए यह junction लगभग एक तय voltage drop, करीब 0.6 V से 0.7 V, बनाए रखता है, जिसे हम Vbe कहते हैं। हम हिसाब में लगभग हमेशा 0.7 V लेते हैं।',
        'दूसरी शर्त यह है कि base-collector junction reverse-biased होना चाहिए, यानी इसे उल्टी दिशा में धकेला गया हो ताकि यह block करे। यही blocking collector को एक controlled valve की तरह काम करने देती है, और amplification के लिए ज़रूरी है। एक junction forward-biased और दूसरा reverse-biased होने पर transistor अपनी active region में बैठता है।',
        'अगर यह ग़लत हो जाए तो transistor active region से निकलकर दो बेकार छोरों में से एक में गिर जाता है। cutoff में base current लगभग शून्य हो जाता है, तो collector current भी मूलतः शून्य और transistor पूरी तरह OFF, जैसे lights बुझी जाम। saturation में collector-से-emitter voltage अपने सबसे छोटे मान (Vce,sat) तक गिर जाता है, transistor पूरी तरह ON, और lights के पूरे जले जाम होने जैसा यह और कुछ नहीं कर सकता।',
        'इसलिए बीच में, active region के अंदर, रहना सिर्फ़ साफ़ आवाज़ की बात नहीं है। यह transistor को ज़्यादा काम से भी बचाता है, जो उसे ज़्यादा गरम होने से रोकता है और उसकी उम्र बढ़ाता है।',
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
        'We now need a way to see every possible resting point at once. The trick is to apply Kirchhoff\'s voltage law (the simple rule that voltages around a loop add up to the supply) to the collector side of the circuit. Following the loop from the supply down through the collector resistor Rc and across the transistor gives Vcc = Ic*Rc + Vce. Rearranging it to put the current on its own gives the load-line equation, Ic = (Vcc - Vce)/Rc.',
        'This equation is a straight line on a graph of collector current Ic against collector-emitter voltage Vce, and we call it the DC load line. The important thing is that it depends only on the supply Vcc and the resistor Rc, which we choose. The transistor itself does not set this line; the outside circuit does. It is the dimmer track the operating point is allowed to slide along.',
        'To draw the line we only need its two ends. At one end imagine the transistor turned fully on so that no voltage is left across it, Vce = 0. The equation then gives the largest possible current, Ic,sat = Vcc/Rc. This is the saturation end, at the top-left. At the other end imagine the transistor fully off so that no current flows, Ic = 0. The equation then gives Vce = Vcc, the whole supply appearing across the transistor. This is the cutoff end, at the bottom-right.',
        'On the same graph the real transistor is described by a family of curves, one curve for each value of base current Ib, showing how much collector current it carries. These curves are the device\'s own behaviour, separate from the line.',
        'The actual resting point is found where the straight load line crosses the particular curve set by our chosen bias current Ibq. That single crossing point reads off as (Vceq, Icq), our Q-point. For the cleanest signal we aim for that crossing to land near the middle of the line. In the lab below, changing Vcc, Rc or Ib re-draws the line and moves the crossing in real time.',
      ],
      theoryHI: [
        'अब हमें एक ही नज़र में हर संभव resting point देखने का तरीका चाहिए। तरकीब यह है कि circuit की collector side पर Kirchhoff का voltage law (वह सरल नियम कि एक loop के चारों ओर के voltage जुड़कर supply बनाते हैं) लगाएँ। supply से नीचे collector resistor Rc के ज़रिए और transistor के आर-पार loop को followकरने पर मिलता है Vcc = Ic*Rc + Vce। current को अलग करने के लिए इसे फिर से सजाने पर मिलता है load-line equation, Ic = (Vcc - Vce)/Rc।',
        'यह equation collector current Ic बनाम collector-emitter voltage Vce के graph पर एक सीधी रेखा है, और इसे हम DC load line कहते हैं। ख़ास बात यह है कि यह सिर्फ़ supply Vcc और resistor Rc पर निर्भर करती है, जिन्हें हम चुनते हैं। यह line transistor ख़ुद तय नहीं करता; बाहरी circuit करता है। यही वह dimmer track है जिस पर operating point को सरकने की इजाज़त है।',
        'line खींचने के लिए हमें बस उसके दो सिरे चाहिए। एक सिरे पर मान लो transistor पूरी तरह चालू है ताकि उस पर कोई voltage न बचे, Vce = 0। तब equation सबसे बड़ा संभव current देता है, Ic,sat = Vcc/Rc। यह saturation सिरा है, ऊपर-बाएँ। दूसरे सिरे पर मान लो transistor पूरी तरह बंद है ताकि कोई current न बहे, Ic = 0। तब equation देता है Vce = Vcc, पूरी supply transistor पर दिखती हुई। यह cutoff सिरा है, नीचे-दाएँ।',
        'उसी graph पर असली transistor को curves के एक परिवार से बताया जाता है, हर base current Ib के मान के लिए एक curve, जो दिखाती है कि वह कितना collector current ले जाता है। ये curves device का अपना व्यवहार हैं, line से अलग।',
        'असली resting point वहाँ मिलता है जहाँ सीधी load line हमारे चुने हुए bias current Ibq वाली ख़ास curve को काटती है। वही एक crossing बिंदु (Vceq, Icq) के रूप में पढ़ा जाता है, हमारा Q-point। सबसे साफ़ signal के लिए हम चाहते हैं कि यह crossing line के बीच के पास गिरे। नीचे lab में Vcc, Rc या Ib बदलने पर line फिर से खिंचती है और crossing real time में हिलता है।',
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
        'Let us try the simplest circuit that could possibly work. We connect the base to the supply Vcc through a single resistor called Rb, and we connect the collector to Vcc through the collector resistor Rc. The emitter goes straight to ground. That single base resistor Rb is the whole bias network, which is why it is called fixed bias.',
        'To find the base current we apply Kirchhoff\'s voltage law to the input loop, the path from the supply, through Rb, across the base-emitter junction, to ground. The voltages must add up to Vcc, giving Vcc = Ib*Rb + Vbe. Solving for the base current gives Ib = (Vcc - Vbe)/Rb. Notice that this depends only on the supply, the resistor and the fixed 0.7 V junction drop; the transistor has no say in it.',
        'The transistor then takes this base current and amplifies it. The collector current is the base current multiplied by the gain beta, so Ic = beta*Ib. This is the one place the transistor enters the calculation, and as we will see, it is exactly where the trouble starts.',
        'To find the resting voltage we apply Kirchhoff\'s voltage law to the output loop, the path from the supply, through Rc, across the transistor, to ground. This gives Vcc = Ic*Rc + Vce, which rearranges to Vce = Vcc - Ic*Rc. That is the resting voltage Vceq, and together with Icq it fixes our Q-point.',
        'In the see-saw picture, this single resistor Rb is like balancing the see-saw with one hand. It works fine as long as nothing disturbs it, but there is nothing holding it steady if conditions change. The full step-by-step calculation is worked out below.',
      ],
      theoryHI: [
        'चलिए सबसे सरल circuit आज़माते हैं जो शायद काम कर सके। हम base को supply Vcc से Rb नाम के एक अकेले resistor के ज़रिए जोड़ते हैं, और collector को Vcc से collector resistor Rc के ज़रिए। emitter सीधे ground पर जाता है। वही अकेला base resistor Rb पूरा bias network है, इसीलिए इसे fixed bias कहते हैं।',
        'base current पता करने के लिए हम input loop पर Kirchhoff का voltage law लगाते हैं, यानी supply से Rb के ज़रिए, base-emitter junction के आर-पार, ground तक का रास्ता। voltages जुड़कर Vcc बनने चाहिए, जिससे मिलता है Vcc = Ib*Rb + Vbe। base current के लिए हल करने पर मिलता है Ib = (Vcc - Vbe)/Rb। ध्यान दें यह सिर्फ़ supply, resistor और तय 0.7 V junction drop पर निर्भर करता है; इसमें transistor का कोई दख़ल नहीं।',
        'फिर transistor इस base current को लेकर amplify करता है। collector current base current का gain beta गुना होता है, तो Ic = beta*Ib। यही एकमात्र जगह है जहाँ transistor हिसाब में घुसता है, और जैसा हम देखेंगे, ठीक यहीं से मुसीबत शुरू होती है।',
        'resting voltage पता करने के लिए हम output loop पर Kirchhoff का voltage law लगाते हैं, यानी supply से Rc के ज़रिए, transistor के आर-पार, ground तक का रास्ता। इससे मिलता है Vcc = Ic*Rc + Vce, जो फिर से सजने पर बनता है Vce = Vcc - Ic*Rc। यही resting voltage Vceq है, और Icq के साथ मिलकर हमारा Q-point तय करता है।',
        'see-saw वाली तस्वीर में, यह अकेला resistor Rb see-saw को एक हाथ से संभालने जैसा है। जब तक कुछ इसे न छेड़े तब तक यह ठीक काम करता है, पर हालात बदलें तो इसे स्थिर रखने वाला कुछ नहीं है। पूरा step-by-step हिसाब नीचे निकाला गया है।',
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
        'Here is why fixed bias fails. We found that the base current Ib is set entirely by Rb and does not depend on beta. But the collector current is Ic = beta*Ib. Since Ib is locked, the collector current is directly proportional to beta. If we put this on paper and ask how Ic changes when beta changes, the fractional change in Ic exactly equals the fractional change in beta: a 10 percent rise in beta gives a 10 percent rise in Ic, and there is nothing in the circuit that pushes back to undo it.',
        'This would be harmless if beta were a fixed number, but it is not. The same part number can have a beta anywhere from about 50 to over 400, and on top of that beta climbs as the device heats up. So the very thing our resting current depends on is the thing we can least rely on.',
        'When you fold real numbers in, the result is alarming. Because Vce = Vcc - Ic*Rc, a large swing in Ic produces an even larger swing in the resting voltage. In practice a 50 percent change in beta can shove the Q-point by more than 300 percent, dragging it right up into saturation where the amplifier stops working. The standard measure of this sensitivity is the stability factor, and for fixed bias it comes out as roughly S = beta + 1, which is enormous and therefore very bad.',
        'Heat makes it worse through a vicious circle called thermal runaway. A warmer transistor leaks a small reverse current called Ico, and this leakage adds to the collector current. More collector current means more power dissipated, which raises the temperature further, which raises the leakage again. Each step feeds the next, and since beta also grows with heat, the resting point keeps climbing on its own.',
        'Engineers measure how badly a bias drifts using three stability factors: S(Ico) for sensitivity to leakage, S(Vbe) for sensitivity to the junction voltage, and S(beta) for sensitivity to gain. In every case a smaller number means a steadier circuit. Fixed bias scores terribly on all three. Sweep beta in the lab below and watch the resting point slide away.',
      ],
      theoryHI: [
        'fixed bias क्यों फेल होता है, यह रहा। हमने देखा कि base current Ib पूरी तरह Rb से तय होता है और beta पर निर्भर नहीं करता। पर collector current है Ic = beta*Ib। चूँकि Ib locked है, collector current सीधे beta के समानुपाती है। अगर इसे काग़ज़ पर रखकर पूछें कि beta बदलने पर Ic कैसे बदलता है, तो Ic का अनुपातिक बदलाव ठीक beta के अनुपातिक बदलाव के बराबर होता है: beta में 10 प्रतिशत बढ़त Ic में 10 प्रतिशत बढ़त देती है, और circuit में कुछ नहीं जो इसे पीछे धकेलकर पलटे।',
        'यह नुक़सानदेह न होता अगर beta एक तय संख्या होती, पर ऐसा नहीं है। एक ही part number का beta लगभग 50 से 400 से ऊपर तक कुछ भी हो सकता है, और ऊपर से device गरम होने पर beta बढ़ता भी है। तो जिस चीज़ पर हमारा resting current निर्भर है वही सबसे कम भरोसेमंद है।',
        'जब आप असली संख्याएँ डालते हैं तो नतीजा चौंकाने वाला होता है। चूँकि Vce = Vcc - Ic*Rc, Ic में बड़ा झूला resting voltage में और भी बड़ा झूला पैदा करता है। व्यवहार में beta में 50 प्रतिशत बदलाव Q-point को 300 प्रतिशत से ज़्यादा खिसका सकता है, इसे सीधे saturation में घसीटता हुआ जहाँ amplifier काम करना बंद कर देता है। इस sensitivity का मानक माप stability factor है, और fixed bias के लिए यह करीब S = beta + 1 निकलता है, जो बहुत बड़ा और इसलिए बहुत ख़राब है।',
        'गर्मी इसे thermal runaway नाम के एक दुष्चक्र से और बिगाड़ देती है। गरम transistor एक छोटा reverse current लीक करता है जिसे Ico कहते हैं, और यह leakage collector current में जुड़ जाता है। ज़्यादा collector current यानी ज़्यादा power खर्च, जो temperature और बढ़ाता है, जो leakage फिर बढ़ाता है। हर कदम अगले को खिलाता है, और चूँकि beta भी गर्मी से बढ़ता है, resting point अपने आप चढ़ता रहता है।',
        'engineers नापते हैं कि एक bias कितना बुरा बहता है, तीन stability factors से: leakage के लिए S(Ico), junction voltage के लिए S(Vbe), और gain के लिए S(beta)। हर मामले में छोटी संख्या यानी ज़्यादा steady circuit। fixed bias तीनों पर बहुत ख़राब अंक पाता है। नीचे lab में beta sweep करें और resting point को खिसकते देखें।',
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
        'The cure for all of this is a smarter bias network with two new ideas. First, instead of one base resistor we use two resistors, R1 and R2, in a chain from the supply to ground. This chain is called a voltage divider, and the point between the two resistors gives the base a firm, predictable voltage that the transistor cannot easily pull around. Second, we add a resistor called Re between the emitter and ground.',
        'That emitter resistor Re is the real hero, because it creates negative feedback. Negative feedback simply means the circuit watches its own output and automatically pushes back against any unwanted change. Here is how it works: if the collector current tries to rise for any reason, the same current flows through Re and raises the emitter voltage Ve. But the base voltage is held fixed by the divider, so a higher emitter voltage shrinks the difference Vbe = Vb - Ve. A smaller Vbe means the transistor conducts less, which pulls the current straight back down.',
        'In the see-saw picture this is the difference between balancing with one hand and bolting the pivot firmly to the floor. Any attempt to tip the see-saw is met by an immediate restoring push, so it stays level. Beta and temperature can try whatever they like, but the feedback cancels their effect.',
        'The payoff is that the resting point (Icq, Vceq) becomes almost completely independent of the transistor. Swap in a transistor with double the beta, or let the circuit warm up, and the Q-point barely moves. This is exactly the stability that fixed bias could never deliver.',
        'The only price we pay is a little extra complexity: two divider resistors and one emitter resistor instead of a single base resistor. That is a small cost for a circuit that holds its resting point steady. Sweep beta in the lab below to compare the two biases side by side.',
      ],
      theoryHI: [
        'इस सबका इलाज एक होशियार bias network है जिसमें दो नए विचार हैं। पहला, एक base resistor की जगह हम दो resistors, R1 और R2, supply से ground तक एक श्रृंखला में इस्तेमाल करते हैं। इस श्रृंखला को voltage divider कहते हैं, और दोनों resistors के बीच का बिंदु base को एक मज़बूत, अनुमानित voltage देता है जिसे transistor आसानी से इधर-उधर नहीं खींच सकता। दूसरा, हम emitter और ground के बीच Re नाम का एक resistor जोड़ते हैं।',
        'वही emitter resistor Re असली hero है, क्योंकि यह negative feedback बनाता है। negative feedback का बस मतलब है कि circuit अपने ही output पर नज़र रखता है और किसी भी अनचाहे बदलाव के विरुद्ध अपने आप पीछे धकेलता है। यह ऐसे काम करता है: अगर collector current किसी भी वजह से बढ़ने लगे, वही current Re से बहकर emitter voltage Ve बढ़ा देता है। पर base voltage को divider तय रखता है, तो ऊँचा emitter voltage अंतर Vbe = Vb - Ve को घटा देता है। छोटा Vbe यानी transistor कम conduct करता है, जो current को सीधे वापस नीचे खींच लेता है।',
        'see-saw वाली तस्वीर में यह एक हाथ से संभालने और pivot को मज़बूती से फ़र्श में बोल्ट कर देने के बीच का फ़र्क़ है। see-saw को झुकाने की किसी भी कोशिश का जवाब तुरंत एक restoring धक्का देता है, तो यह level बना रहता है। beta और temperature जो चाहें कोशिश करें, feedback उनके असर को रद्द कर देता है।',
        'फ़ायदा यह है कि resting point (Icq, Vceq) लगभग पूरी तरह transistor से स्वतंत्र हो जाता है। दोगुने beta वाला transistor लगा दो, या circuit को गरम होने दो, Q-point मुश्किल से हिलता है। यही वह stability है जो fixed bias कभी नहीं दे सका।',
        'हमें बस थोड़ी अतिरिक्त complexity की क़ीमत चुकानी पड़ती है: एक base resistor की जगह दो divider resistors और एक emitter resistor। एक ऐसे circuit के लिए यह छोटी क़ीमत है जो अपना resting point steady रखता है। नीचे lab में beta sweep करके दोनों biases की तुलना करें।',
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
        'To analyse the divider circuit exactly, we use a standard simplification called Thevenin\'s theorem. It says that any network of resistors and sources feeding a point can be replaced by a single voltage source in series with a single resistor, without changing how the rest of the circuit behaves. We apply this to the R1-R2 divider as seen from the base.',
        'The replacement voltage, Vth, is just the voltage the divider would produce at the base with the transistor disconnected. By the ordinary divider rule that is Vth = Vcc*R2/(R1+R2). The replacement resistance, Rth, is what you would measure looking back into the divider with the supply treated as a short; the two resistors then appear in parallel, so Rth = R1*R2/(R1+R2), written R1||R2. Now the messy divider is just one source Vth behind one resistor Rth.',
        'With that simpler picture we write Kirchhoff\'s voltage law around the base-emitter loop. Starting at Vth and going through Rth, across the base-emitter junction, and through Re back to ground gives Vth = Ib*Rth + Vbe + Ie*Re. The emitter current is slightly larger than the base current because Ie = (beta+1)*Ib (the emitter carries both the base and collector currents). Substituting that and solving for the base current gives Ib = (Vth - Vbe)/(Rth + (beta+1)*Re).',
        'From there the rest of the Q-point follows easily: the collector current is Ic = beta*Ib, the emitter current Ie is almost identical to it, and the resting voltage is Vce = Vcc - Ic*(Rc+Re), now including the small drop across Re. The worked solve below uses real circuit values (Vth about 11.5 V, Rth about 1.6 kohm, Re = 1.8 kohm, beta = 120), with every number computed live.',
        'Look closely at the denominator Rth + (beta+1)*Re. Because beta is large and Re is sizeable, the (beta+1)*Re term is far bigger than Rth and dominates the whole expression. That domination is the secret to stability: since beta appears in a term we have deliberately made huge, small changes in beta hardly move Ib at all, and so the entire Q-point barely depends on the transistor.',
      ],
      theoryHI: [
        'divider circuit का ठीक-ठीक विश्लेषण करने के लिए हम एक मानक सरलीकरण इस्तेमाल करते हैं जिसे Thevenin\'s theorem कहते हैं। यह कहता है कि किसी बिंदु को feed करने वाला resistors और sources का कोई भी network एक अकेले voltage source और एक अकेले resistor की श्रृंखला से बदला जा सकता है, बाक़ी circuit के व्यवहार को बदले बिना। हम इसे base से देखे गए R1-R2 divider पर लगाते हैं।',
        'बदला हुआ voltage, Vth, बस वही voltage है जो transistor हटाकर divider base पर बनाता। आम divider नियम से वह है Vth = Vcc*R2/(R1+R2)। बदली हुई resistance, Rth, वही है जो supply को short मानकर divider में पीछे देखने पर नापी जाए; तब दोनों resistors parallel में दिखते हैं, तो Rth = R1*R2/(R1+R2), जिसे R1||R2 लिखते हैं। अब उलझा हुआ divider बस एक source Vth के पीछे एक resistor Rth है।',
        'उस सरल तस्वीर के साथ हम base-emitter loop के चारों ओर Kirchhoff का voltage law लिखते हैं। Vth से शुरू होकर Rth के ज़रिए, base-emitter junction के आर-पार, और Re के ज़रिए वापस ground तक जाने पर मिलता है Vth = Ib*Rth + Vbe + Ie*Re। emitter current base current से थोड़ा बड़ा होता है क्योंकि Ie = (beta+1)*Ib (emitter base और collector दोनों currents ले जाता है)। इसे रखकर base current के लिए हल करने पर मिलता है Ib = (Vth - Vbe)/(Rth + (beta+1)*Re)।',
        'वहाँ से बाक़ी Q-point आसानी से निकल आता है: collector current है Ic = beta*Ib, emitter current Ie इससे लगभग समान है, और resting voltage है Vce = Vcc - Ic*(Rc+Re), जिसमें अब Re पर का छोटा drop भी शामिल है। नीचे का हल किया गया solve असली circuit मान इस्तेमाल करता है (Vth करीब 11.5 V, Rth करीब 1.6 kohm, Re = 1.8 kohm, beta = 120), हर संख्या live computed।',
        'denominator Rth + (beta+1)*Re को ग़ौर से देखिए। चूँकि beta बड़ा है और Re भी ठीक-ठाक है, (beta+1)*Re पद Rth से कहीं बड़ा है और पूरे expression पर हावी रहता है। यही हावी होना stability का राज़ है: चूँकि beta एक ऐसे पद में आता है जिसे हमने जानबूझकर विशाल बनाया है, beta में छोटे बदलाव Ib को मुश्किल से हिलाते हैं, और इसलिए पूरा Q-point transistor पर मुश्किल से निर्भर करता है।',
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
        'The exact formula is correct but clumsy. In practice designers use a simple test to decide when the maths can be made cleaner: the stability condition beta*Re >= 10*R2. In words, the emitter resistance as felt at the base (which is beta times Re) should be at least ten times R2. When this holds, the base draws so little current compared with the divider that we can treat the base as taking essentially none.',
        'If the base takes almost no current, then nearly the same current flows through R1 and R2 (so I1 is about equal to I2), and the divider behaves like an undisturbed pair of resistors. The base voltage is then set by the plain divider rule, Vb = Vcc*R2/(R1+R2). The crucial point is that this expression contains no beta at all; the base voltage is pinned by the two resistors we chose, not by the fickle transistor.',
        'Now we walk the resting current down from that fixed base voltage. The emitter sits one junction drop below the base, so Ve = Vb - Vbe. The same emitter voltage across Re sets the emitter current by Ohm\'s law, Ie = Ve/Re. And since the collector and emitter currents are nearly equal, the resting collector current is Icq = Ie = Ve/Re. Read that final equation carefully: beta has completely vanished from it.',
        'This is the whole proof of stability. Because the operating-current equation has no beta in it, swapping transistors or heating the circuit cannot move the resting current. We finish by placing the Q-point on the load line with Vce = Vcc - Ic*(Rc+Re), and since Ic itself carried no beta, this voltage is beta-free too.',
        'Use the checker below to feel the rule in action. Sweep beta, Re and R2, and watch the condition flip to valid the moment beta*Re crosses 10*R2. At the same time the bars showing Icq against beta flatten out, a direct picture of the resting current no longer caring about beta.',
      ],
      theoryHI: [
        'ठीक formula सही है पर भारी-भरकम है। व्यवहार में designers एक सरल test इस्तेमाल करते हैं यह तय करने को कि गणित कब साफ़ की जा सकती है: stability condition beta*Re >= 10*R2। शब्दों में, base पर महसूस होने वाली emitter resistance (जो beta गुना Re है) R2 से कम से कम दस गुना होनी चाहिए। जब यह सही होता है, base divider के मुक़ाबले इतना कम current खींचता है कि हम base को लगभग शून्य current लेने वाला मान सकते हैं।',
        'अगर base लगभग कोई current नहीं लेता, तो R1 और R2 से लगभग एक ही current बहता है (तो I1 करीब-करीब I2 के बराबर), और divider बिना छेड़े गए resistors की जोड़ी की तरह बर्ताव करता है। तब base voltage सादे divider नियम से तय होता है, Vb = Vcc*R2/(R1+R2)। अहम बात यह है कि इस expression में कोई beta नहीं है; base voltage को हमारे चुने हुए दो resistors पिन करते हैं, चंचल transistor नहीं।',
        'अब हम उस तय base voltage से resting current नीचे की ओर निकालते हैं। emitter base से एक junction drop नीचे बैठता है, तो Ve = Vb - Vbe। वही emitter voltage Re पर Ohm के नियम से emitter current तय करता है, Ie = Ve/Re। और चूँकि collector और emitter currents लगभग बराबर हैं, resting collector current है Icq = Ie = Ve/Re। उस अंतिम equation को ध्यान से पढ़िए: beta उसमें से पूरी तरह ग़ायब हो गया है।',
        'यही stability का पूरा प्रमाण है। चूँकि operating-current equation में कोई beta नहीं, transistor बदलना या circuit गरम करना resting current को नहीं हिला सकता। हम Q-point को load line पर Vce = Vcc - Ic*(Rc+Re) से बिठाकर ख़त्म करते हैं, और चूँकि Ic ख़ुद कोई beta नहीं ले गया, यह voltage भी beta-free है।',
        'नीचे checker से नियम को काम करते महसूस करें। beta, Re और R2 sweep करें, और देखें कि beta*Re के 10*R2 को पार करते ही condition valid में बदल जाती है। उसी समय Icq बनाम beta दिखाने वाली bars सपाट हो जाती हैं, resting current के अब beta की परवाह न करने की सीधी तस्वीर।',
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
        'Let us put the two approaches next to each other and see what we have learned. Fixed bias is the simpler circuit, needing just one base resistor, while voltage-divider bias is a little more involved with its pair of divider resistors plus an emitter resistor. That extra hardware is the price of stability.',
        'The deeper difference lies in how each one sets the base current. In fixed bias the base current is pinned by Rb alone, which sounds reassuring but means the collector current then rides directly on beta. In divider bias the operating current is governed by the Thevenin voltage Vth and resistance Rth together with Re, an arrangement built so that beta drops out of the answer.',
        'That is why their sensitivity to beta is night and day. Fixed bias is extremely beta-dependent: the collector current is simply proportional to beta, so it follows every wobble of the transistor. Divider bias is nearly beta-independent whenever the stability condition beta*Re >= 10*R2 is met, because the resting current reduces to Ve/Re with no beta in sight.',
        'We can put a single number on this using the stability factor S, which measures how much the collector current moves when conditions drift. For fixed bias S is roughly beta + 1, a large and alarming value. For divider bias S can be pushed close to its best possible value of 1 simply by making Re large enough, which is the signature of a rock-steady circuit.',
        'The bottom line is stark. Under a realistic 50 percent change in beta, the fixed-bias resting point lurches by more than 300 percent, while the divider-bias resting point shifts by less than 3 percent. For any analog design that has to work reliably across many transistors and temperatures, voltage-divider bias is the standard, recommended choice.',
      ],
      theoryHI: [
        'चलिए दोनों तरीक़ों को आमने-सामने रखें और देखें कि हमने क्या सीखा। fixed bias सरल circuit है, बस एक base resistor चाहिए, जबकि voltage-divider bias अपनी divider resistors की जोड़ी और एक emitter resistor के साथ थोड़ा ज़्यादा जटिल है। वह अतिरिक्त hardware ही stability की क़ीमत है।',
        'गहरा फ़र्क़ इसमें है कि हर एक base current कैसे सेट करता है। fixed bias में base current अकेले Rb से पिन होता है, जो भरोसेमंद लगता है पर इसका मतलब है कि collector current फिर सीधे beta पर सवार हो जाता है। divider bias में operating current को Thevenin voltage Vth और resistance Rth, Re के साथ मिलकर, चलाते हैं, एक ऐसी व्यवस्था जो इस तरह बनी है कि beta जवाब से निकल जाए।',
        'इसीलिए beta के प्रति उनकी sensitivity में ज़मीन-आसमान का अंतर है। fixed bias बेहद beta-dependent है: collector current बस beta के समानुपाती है, तो यह transistor के हर डगमगाहट का अनुसरण करता है। divider bias लगभग beta-independent है जब भी stability condition beta*Re >= 10*R2 पूरी हो, क्योंकि resting current घटकर Ve/Re रह जाता है जिसमें कहीं beta नहीं दिखता।',
        'हम इस पर एक अकेली संख्या रख सकते हैं stability factor S से, जो नापता है कि हालात बदलने पर collector current कितना हिलता है। fixed bias के लिए S करीब beta + 1 है, एक बड़ा और चिंताजनक मान। divider bias के लिए S को सिर्फ़ Re को काफ़ी बड़ा बनाकर उसके सबसे बेहतर संभव मान 1 के पास धकेला जा सकता है, जो एक rock-steady circuit की पहचान है।',
        'निचोड़ साफ़ है। beta में एक वास्तविक 50 प्रतिशत बदलाव पर, fixed-bias resting point 300 प्रतिशत से ज़्यादा लुढ़कता है, जबकि divider-bias resting point 3 प्रतिशत से कम खिसकता है। किसी भी ऐसे analog design के लिए जिसे कई transistors और temperatures पर भरोसे से चलना हो, voltage-divider bias ही मानक, अनुशंसित विकल्प है।',
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
        'Here is a quick way to lock the ideas into memory. Each card shows a key term on the front and a plain-language explanation on the back, so you can test yourself one concept at a time.',
        'The eight cards walk through the whole module in order: the Q-point, the DC load line, the conditions for the active region, the fixed-bias equations and the fatal flaw that sinks them, the voltage-divider fix, the stability condition, and the stability factor S.',
        'For the best results, look at the front and try to explain the back in your own words before you flip the card. Saying it out loud forces you to actually recall the idea rather than just recognise it.',
      ],
      theoryHI: [
        'विचारों को याददाश्त में बैठाने का एक तेज़ तरीक़ा यह रहा। हर card सामने एक key term और पीछे सादी भाषा में व्याख्या दिखाता है, ताकि आप एक बार में एक concept पर ख़ुद को परख सकें।',
        'ये आठ cards पूरे module को क्रम में ले चलते हैं: Q-point, DC load line, active region की शर्तें, fixed-bias समीकरण और वह fatal flaw जो उन्हें डुबो देता है, voltage-divider fix, stability condition, और stability factor S।',
        'सबसे अच्छे नतीजों के लिए, सामने देखें और card पलटने से पहले पीछे वाली बात अपने शब्दों में समझाने की कोशिश करें। ज़ोर से कहना आपको idea को सिर्फ़ पहचानने के बजाय सचमुच याद करने पर मजबूर करता है।',
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
        'Now test yourself with eight multiple-choice questions. Each one probes a core idea from the module, whether that is the meaning of the Q-point, how the load line is built, why fixed bias is fragile, or what makes the voltage divider so stable.',
        'Take the time to read every option, not just the one that looks right. The wrong answers are written to match the common misunderstandings this module is meant to clear up, so spotting why they are wrong is part of the learning.',
        'After each answer you will see a short explanation, so even a question you miss turns into a quick lesson rather than just a red mark.',
      ],
      theoryHI: [
        'अब ख़ुद को आठ multiple-choice सवालों से परखें। हर एक module के किसी मुख्य विचार को टटोलता है, चाहे वह Q-point का मतलब हो, load line कैसे बनती है, fixed bias क्यों कमज़ोर है, या voltage divider को इतना stable क्या बनाता है।',
        'सिर्फ़ सही दिखने वाले विकल्प को नहीं, हर option को पढ़ने का समय लें। ग़लत जवाब उन्हीं आम ग़लतफ़हमियों से मेल खाने के लिए लिखे गए हैं जिन्हें यह module दूर करना चाहता है, तो यह समझना कि वे क्यों ग़लत हैं, सीखने का ही हिस्सा है।',
        'हर जवाब के बाद आपको एक छोटी explanation दिखेगी, ताकि जो सवाल आप चूकें वह भी सिर्फ़ एक लाल निशान के बजाय एक त्वरित सबक़ बन जाए।',
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
        'Let us gather the whole story onto one page. The resting point, or Q-point, is the pair (Icq, Vceq) where the transistor sits with no signal applied. We aim to centre it on the load line so the incoming signal has equal room to swing up and down without being clipped.',
        'The load line itself is the track the resting point lives on. From the collector-loop KVL we get Ic = (Vcc - Vce)/Rc, a straight line fixed only by the supply Vcc and the resistor Rc. Its two ends are the saturation point at Ic = Vcc/Rc and the cutoff point at Vce = Vcc.',
        'The simplest circuit, fixed bias, has a fatal weakness. Because the collector current is Ic = beta*Ib and the base current is locked, the resting current is directly proportional to beta. Its stability factor is about beta + 1, so a 50 percent change in beta drags the Q-point by more than 300 percent.',
        'Voltage-divider bias cures this with two moves. A divider holds the base voltage Vb firm, and an emitter resistor Re adds negative feedback. The resting current then reduces to Icq = Ve/Re, an expression with no beta in it at all, so the stability factor falls toward its ideal value of 1 and the Q-point shifts by under 3 percent.',
        'The shortcut that makes this work is the stability condition beta*Re >= 10*R2. When it holds, the base draws negligible current, the divider sets Vb on its own, and the bias becomes essentially independent of the transistor. The sources below back up every formula used here.',
      ],
      theoryHI: [
        'चलिए पूरी कहानी एक पन्ने पर समेटें। resting point, यानी Q-point, वह जोड़ी (Icq, Vceq) है जहाँ transistor बिना signal लगे बैठता है। हम इसे load line पर बीच में रखना चाहते हैं ताकि आने वाले signal को बिना कटे ऊपर-नीचे झूलने की बराबर जगह मिले।',
        'load line ख़ुद वह track है जिस पर resting point रहता है। collector-loop KVL से हमें मिलता है Ic = (Vcc - Vce)/Rc, एक सीधी रेखा जो सिर्फ़ supply Vcc और resistor Rc से तय होती है। इसके दो सिरे हैं Ic = Vcc/Rc पर saturation point और Vce = Vcc पर cutoff point।',
        'सबसे सरल circuit, fixed bias, में एक घातक कमज़ोरी है। चूँकि collector current है Ic = beta*Ib और base current locked है, resting current सीधे beta के समानुपाती है। इसका stability factor करीब beta + 1 है, तो beta में 50 प्रतिशत बदलाव Q-point को 300 प्रतिशत से ज़्यादा घसीट देता है।',
        'voltage-divider bias इसे दो चालों से ठीक करता है। एक divider base voltage Vb को मज़बूत रखता है, और एक emitter resistor Re negative feedback जोड़ता है। तब resting current घटकर Icq = Ve/Re रह जाता है, एक ऐसा expression जिसमें कहीं beta नहीं, तो stability factor अपने आदर्श मान 1 की ओर गिरता है और Q-point 3 प्रतिशत से कम खिसकता है।',
        'इसे काम कराने वाला शॉर्टकट है stability condition beta*Re >= 10*R2। जब यह सही होता है, base नगण्य current खींचता है, divider अपने आप Vb सेट करता है, और bias मूलतः transistor से स्वतंत्र हो जाता है। नीचे के sources यहाँ इस्तेमाल हुए हर formula का समर्थन करते हैं।',
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
