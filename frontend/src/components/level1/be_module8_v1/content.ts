import type { SubContent } from '../_transistor/kit';

/**
 * be8 - "BJT AC Analysis & the Small-Signal Model".
 * Central analogy woven through EVERY scene: the VIP Megaphone Club. A quiet
 * whisper (vin) is broadcast loud; the DC bias is the steady house power; beta is
 * the loudness multiplier; re is the bouncer at the emitter door; coupling/bypass
 * caps are velvet ropes that pass the music (AC) but block the DC barriers; the
 * minus sign is the upside-down broadcast (180-degree inversion).
 */
export const CONTENT = ({
  moduleTitle: 'BJT AC Analysis & the Small-Signal Model',
  moduleSubtitle:
    'From two-port h-parameters to the physical re model: isolate the AC whisper and turn it into a loud, predictable amplifier.',
  scenes: [
    {
      id: 'S00_Cover',
      label: 'BJT AC Analysis',
      kind: 'cover',
      subtitle: 'The VIP Megaphone Club - turning a whisper into a broadcast',
      theoryEN: [
        'Imagine a tiny club where a singer only whispers, yet that whisper has to fill a whole stadium. The transistor is the club\'s megaphone system: the faint voice walks in at one end and comes out loud and clear at the other. That is exactly what an amplifier does to a small electrical signal.',
        'Behind the scenes the club runs on a steady house power supply, which never changes. In our circuit this steady supply is the DC bias: it switches the transistor on and parks it at a comfortable resting point (called the operating point or Q-point) so it is always ready to amplify. The whisper, on the other hand, is the small AC signal that carries the actual information and keeps wiggling up and down in time.',
        'The whole trick of AC analysis is to listen only to the music (the small AC signal) and ignore the constant background hum of the house power (the DC bias). When we do that, the maths becomes far simpler, and we can predict exactly how loud the broadcast will be.',
        'Throughout this module we keep three characters in mind. The bouncer at the emitter door is a small internal resistance called re, which decides how hard you must push to get the signal in. The loudness multiplier is beta (the current gain), which scales the whisper into a roar. And the velvet ropes are the coupling and bypass capacitors, which let the music (AC) pass straight through while blocking the steady DC barriers.',
        'By the end you will be able to take a real common-emitter amplifier and work out its input impedance (Zi, how much the signal source feels held back), its output impedance (Zo, what the load sees looking back in), and its voltage gain (Av, how many times louder the output is) entirely by hand.',
      ],
      theoryHI: [
        'सोचिए एक छोटा सा club है जहाँ singer सिर्फ़ whisper करता है, फिर भी उस whisper को पूरा stadium भरना है। Transistor इस club का megaphone system है: हल्की आवाज़ एक तरफ़ से अंदर जाती है और दूसरी तरफ़ से ज़ोरदार और साफ़ निकलती है। एक amplifier एक छोटे electrical signal के साथ ठीक यही करता है।',
        'पर्दे के पीछे club एक steady house power supply पर चलता है, जो कभी बदलती नहीं। हमारे circuit में यही steady supply DC bias है: यह transistor को ON करके उसे एक आरामदायक resting point (जिसे operating point या Q-point कहते हैं) पर खड़ा रखती है, ताकि वह हमेशा amplify करने को तैयार रहे। दूसरी तरफ़ whisper वह छोटा AC signal है जो असली information रखता है और समय के साथ ऊपर-नीचे हिलता रहता है।',
        'AC analysis की पूरी चालाकी यही है कि हम सिर्फ़ music (छोटा AC signal) सुनें और house power की लगातार background hum (DC bias) को ignore कर दें। ऐसा करते ही गणित बहुत आसान हो जाता है, और हम ठीक-ठीक बता सकते हैं कि broadcast कितना ज़ोरदार होगा।',
        'पूरे module में हम तीन किरदार याद रखते हैं। Emitter door का bouncer एक छोटा internal resistance है जिसे re कहते हैं, जो तय करता है कि signal अंदर डालने के लिए कितना ज़ोर लगाना पड़े। Loudness multiplier beta (current gain) है, जो whisper को roar में बदल देता है। और velvet ropes coupling और bypass capacitors हैं, जो music (AC) को सीधे गुज़रने देती हैं पर steady DC barriers को रोक देती हैं।',
        'अंत तक आप एक असली common-emitter amplifier लेकर उसका input impedance (Zi, signal source को कितनी रुकावट महसूस होती है), output impedance (Zo, load पीछे देखने पर क्या देखता है), और voltage gain (Av, output कितने गुना ज़्यादा ज़ोरदार है) पूरी तरह हाथ से निकालना सीख जाएँगे।',
      ],
      transcriptEN:
        'Welcome to the VIP Megaphone Club, where a whisper becomes a broadcast. This module is about AC analysis of the BJT.',
      transcriptHI:
        'VIP Megaphone Club में स्वागत है, जहाँ एक whisper एक broadcast बन जाती है। यह module BJT के AC analysis के बारे में है।',
      visualNote:
        'Cover: a small blue signal enters the npn device and exits as a large inverted accent-colored swing - a small change in, a big change out.',
    },
    {
      id: 'S01_Video',
      label: 'Video - The Small-Signal Idea',
      kind: 'video',
      subtitle: 'Lesson lecture: isolating the AC whisper from the DC hum',
      theoryEN: [
        'Watch this lesson before the deep dive, because it sets up the single big idea behind everything that follows: every working amplifier carries a steady DC level and a tiny wiggling AC signal at the same time, and our job is to study them one at a time.',
        'The video shows the small AC whisper riding on top of the steady DC house power, like ripples on the surface of a calm pond. It then explains why a rule called superposition lets us pull the two apart and analyse the bias and the signal completely separately, and add the answers back at the end.',
        'It introduces the cornerstone formula re = VT/IE, where re is the bouncer at the emitter door and VT is a fixed number from physics (about 26 mV). From there it builds up to the master result for the loudness, the voltage gain Av = -(Rc||RL)/re.',
        'Keep an eye on the velvet-rope capacitors. At the frequency of a real signal, a capacitor\'s opposition to current (its reactance, Xc) shrinks almost to zero, so the capacitor behaves like a plain wire and simply passes the music through.',
        'Finally, do not forget the minus sign in the gain. It is not an accident: it tells us the output is a flipped, upside-down copy of the input, a guaranteed 180-degree phase inversion. When the singer leans in, the speaker pushes out.',
      ],
      theoryHI: [
        'गहराई में जाने से पहले यह lesson देखिए, क्योंकि यह उस एक बड़े idea को set करता है जिस पर आगे सब कुछ टिका है: हर चलता amplifier एक साथ एक steady DC level और एक छोटा हिलता AC signal रखता है, और हमारा काम है इन्हें एक-एक करके पढ़ना।',
        'Video दिखाता है कि छोटा AC whisper steady DC house power के ऊपर सवार है, ठीक जैसे शांत तालाब की सतह पर लहरें। फिर यह बताता है कि superposition नाम का एक नियम हमें दोनों को अलग करके bias और signal को पूरी तरह अलग-अलग पढ़ने देता है, और अंत में जवाबों को जोड़ देता है।',
        'यह आधारशिला formula re = VT/IE से परिचय कराता है, जहाँ re emitter door का bouncer है और VT physics का एक तय number है (लगभग 26 mV)। यहाँ से यह loudness के master result, यानी voltage gain Av = -(Rc||RL)/re तक पहुँचता है।',
        'velvet-rope capacitors पर नज़र रखिए। असली signal की frequency पर capacitor का current के विरुद्ध विरोध (उसका reactance, Xc) घटकर लगभग शून्य हो जाता है, तो capacitor एक साधारण तार की तरह बर्ताव करता है और बस music को गुज़रने देता है।',
        'आख़िर में, gain में minus चिह्न को मत भूलिए। यह कोई दुर्घटना नहीं है: यह बताता है कि output, input की एक पलटी हुई, उल्टी copy है, एक पक्का 180-degree phase inversion। जब singer झुकता है, speaker बाहर धकेलता है।',
      ],
      transcriptEN:
        'Every working amplifier carries two things at once: a constant DC level that fixes the operating point, and a tiny time-varying AC signal riding on top of it. DC biasing is the foundation - the house power that switches the transistor on and parks it in the linear sweet spot. The AC small-signal is the actual information being amplified, the singer\'s whisper, with its own amplitude, frequency and phase. The whole job of AC analysis is to isolate and study the AC behaviour without the DC clutter, so the maths stays simple. Because the AC signal is small, the transistor behaves as a nearly linear device around the Q-point, and that linearity is exactly what lets us split the two and analyse them separately. We replace the device with its re model: a resistance beta times re looking into the base, a controlled current source beta times the base current at the collector, and the output resistance ro. From there a couple of Kirchhoff loops hand us the input impedance, the output impedance and the voltage gain. And that gain carries a minus sign - the broadcast always comes out upside-down, a mandatory 180-degree phase inversion.',
      transcriptHI:
        'हर चलता हुआ amplifier एक साथ दो चीज़ें रखता है: एक constant DC level जो operating point तय करता है, और उसके ऊपर सवार एक छोटा time-varying AC signal। DC biasing नींव है - वही house power जो transistor को ON करके linear sweet spot पर खड़ा रखती है। AC small-signal असली amplify होने वाली information है, singer की whisper, अपने amplitude, frequency और phase के साथ। AC analysis का पूरा काम है AC behaviour को DC clutter के बिना अलग करके पढ़ना, ताकि गणित आसान रहे। चूँकि AC signal छोटा है, transistor Q-point के आसपास लगभग linear device की तरह बर्ताव करता है, और यही linearity हमें दोनों को अलग करके पढ़ने देती है। हम device को उसके re model से बदल देते हैं: base में देखने पर beta गुना re का resistance, collector पर base current का beta गुना एक controlled current source, और output resistance ro। यहाँ से कुछ Kirchhoff loops हमें input impedance, output impedance और voltage gain दे देते हैं। और उस gain के साथ एक minus चिह्न होता है - broadcast हमेशा उल्टा निकलता है, एक ज़रूरी 180-degree phase inversion।',
      visualNote: 'Embed be8-bjt-ac video with chapters: DC vs AC, superposition, re=VT/IE, the AC equivalent, gain and inversion.',
    },
    {
      id: 'S02_SignalInTheNoise',
      label: 'The Signal in the Noise',
      kind: 'theory',
      subtitle: 'DC bias vs the AC whisper - and superposition',
      theoryEN: [
        'At any instant the voltage at a point in a working amplifier is made of two parts added together: a steady DC level that never moves, and a tiny AC ripple that wiggles up and down on top of it. We can write this simply as v_total = V_DC + v_ac, where v_ac is the part that actually changes with time.',
        'The steady part comes from DC biasing, and it is the foundation of the whole amplifier. Think of it as the house power that switches the transistor on and parks it in the middle of its useful range (the linear "sweet spot"), so that the signal has room to swing up and down without hitting a wall. Because it is constant, the DC bias carries no information by itself.',
        'The wiggling part is the AC small-signal, and this is the singer\'s whisper: the real information we want to amplify. It has a size (amplitude), a speed of wiggling (frequency), and a timing (phase). Everything interesting about the amplifier is about what happens to this small wiggle.',
        'The goal of AC analysis is to study only that wiggle, with the steady DC clutter taken out of the picture, so the maths stays clean and simple. We are not throwing the DC away; we are just looking at one thing at a time.',
        'We are allowed to do this because of a rule called superposition. Since the AC signal is small, the transistor behaves almost like a straight-line (linear) device around its resting point, and for linear devices the effect of the DC source and the effect of the AC source can be found separately and then simply added back together. So we solve the DC bias first to find the Q-point, then solve the AC on its own to find the gain and impedances, and the real circuit is the sum of the two.',
      ],
      theoryHI: [
        'किसी भी पल पर चलते amplifier में किसी point का voltage दो हिस्सों का जोड़ होता है: एक steady DC level जो कभी हिलता नहीं, और उसके ऊपर ऊपर-नीचे हिलता एक छोटा AC ripple। इसे हम आसानी से v_total = V_DC + v_ac लिख सकते हैं, जहाँ v_ac वही हिस्सा है जो समय के साथ बदलता है।',
        'Steady हिस्सा DC biasing से आता है, और यही पूरे amplifier की नींव है। इसे house power समझिए जो transistor को ON करके उसके useful range के बीच में (linear "sweet spot" पर) खड़ा रखती है, ताकि signal को बिना किसी दीवार से टकराए ऊपर-नीचे झूलने की जगह मिले। constant होने की वजह से DC bias अपने आप में कोई information नहीं रखता।',
        'हिलता हुआ हिस्सा AC small-signal है, और यही singer की whisper है: असली information जिसे हम amplify करना चाहते हैं। इसका एक size (amplitude), हिलने की एक रफ़्तार (frequency), और एक timing (phase) होती है। amplifier की हर दिलचस्प बात इसी छोटे wiggle के साथ क्या होता है, उसके बारे में है।',
        'AC analysis का goal सिर्फ़ उसी wiggle को पढ़ना है, steady DC clutter को तस्वीर से हटाकर, ताकि गणित साफ़ और आसान रहे। हम DC को फेंक नहीं रहे; हम बस एक बार में एक चीज़ देख रहे हैं।',
        'ऐसा करने की इजाज़त हमें superposition नाम के नियम से मिलती है। चूँकि AC signal छोटा है, transistor अपने resting point के आसपास लगभग एक सीधी-रेखा (linear) device की तरह बर्ताव करता है, और linear devices के लिए DC source का असर और AC source का असर अलग-अलग निकालकर बस जोड़ दिए जा सकते हैं। तो हम पहले DC bias हल करके Q-point निकालते हैं, फिर AC को अकेले हल करके gain और impedances निकालते हैं, और असली circuit इन दोनों का जोड़ है।',
      ],
      transcriptEN:
        'Two things ride together: a flat DC house power and a tiny AC whisper. Isolate the whisper and the maths stays simple.',
      transcriptHI:
        'दो चीज़ें साथ चलती हैं: एक flat DC house power और एक छोटी AC whisper। whisper को अलग कर लीजिए, गणित आसान रहता है।',
      visualNote:
        'A sine wave (AC whisper) oscillating around a flat DC line, then a toggle peeling the DC away to show the pure isolated AC sine.',
    },
    {
      id: 'S03_TwoPortAndHybrid',
      label: 'The Two-Port Black Box',
      kind: 'theory',
      subtitle: 'Hybrid h-parameter equations from a four-variable port',
      theoryEN: [
        'Before we worry about what is happening inside the silicon, we can treat the transistor as a sealed black box with two pairs of terminals, called a two-port network. Any linear device with three terminals can be wrapped up this way. Here port 1 is the input, formed at the base-emitter junction, and port 2 is the output, formed at the collector-base junction.',
        'Only four quantities are needed to describe what happens at these ports: the input voltage Vi and input current Ii on one side, and the output voltage Vo and output current Io on the other. The beauty of this picture is that we never need to know the internal physics; if we know how these four relate, we can predict everything the box does.',
        'The relationships are written as the hybrid, or h-parameter, equations. They are called "hybrid" because they mix a voltage and a current together in each equation, so the constants in them end up with mixed units (some are in Ohms, some in Siemens, and some are just plain numbers). The two equations are Vi = h11*Ii + h12*Vo for the input and Io = h21*Ii + h22*Vo for the output.',
        'For a transistor in the common-emitter arrangement these four constants get familiar names: h11 = hie is the input impedance (in Ohms), h12 = hre is the reverse voltage ratio (a tiny pure number), h21 = hfe is the forward current gain (the small-signal beta), and h22 = hoe is the output admittance (in Siemens, the inverse of a resistance).',
        'The clever thing is that each h-parameter can be measured cleanly by forcing one variable to zero. If you AC-short the output so Vo = 0, the input equation hands you hie and hfe directly; if you open the input so Ii = 0, the equations hand you hre and hoe. Because they can be measured this neatly, manufacturers can list them on a datasheet for any transistor.',
      ],
      theoryHI: [
        'इससे पहले कि हम silicon के अंदर क्या हो रहा है इसकी चिंता करें, हम transistor को दो जोड़ी terminals वाला एक बंद black box मान सकते हैं, जिसे two-port network कहते हैं। तीन terminals वाली कोई भी linear device इस तरह लपेटी जा सकती है। यहाँ port 1 input है, जो base-emitter junction पर बनता है, और port 2 output है, जो collector-base junction पर बनता है।',
        'इन ports पर क्या होता है, यह बताने के लिए सिर्फ़ चार राशियाँ चाहिए: एक तरफ़ input voltage Vi और input current Ii, और दूसरी तरफ़ output voltage Vo और output current Io। इस तस्वीर की ख़ूबसूरती यह है कि हमें कभी अंदर की physics जानने की ज़रूरत नहीं; अगर हमें पता है कि ये चारों आपस में कैसे जुड़े हैं, तो हम box का हर बर्ताव predict कर सकते हैं।',
        'इन रिश्तों को hybrid, यानी h-parameter, equations के रूप में लिखा जाता है। इन्हें "hybrid" इसलिए कहते हैं क्योंकि हर equation में एक voltage और एक current मिल जाते हैं, जिससे इनके constants के units भी मिले-जुले हो जाते हैं (कुछ Ohms में, कुछ Siemens में, और कुछ बस सादे number)। दोनों equations हैं: input के लिए Vi = h11*Ii + h12*Vo और output के लिए Io = h21*Ii + h22*Vo।',
        'common-emitter व्यवस्था वाले transistor के लिए इन चार constants को जाने-पहचाने नाम मिलते हैं: h11 = hie input impedance है (Ohms में), h12 = hre reverse voltage ratio है (एक बहुत छोटा सादा number), h21 = hfe forward current gain है (small-signal beta), और h22 = hoe output admittance है (Siemens में, एक resistance का inverse)।',
        'चालाकी की बात यह है कि हर h-parameter को एक variable को शून्य करके साफ़-साफ़ मापा जा सकता है। अगर output को AC-short कर दें ताकि Vo = 0 हो, तो input equation सीधे hie और hfe दे देती है; अगर input खोल दें ताकि Ii = 0 हो, तो equations hre और hoe दे देती हैं। इतनी साफ़ तरह माप पाने की वजह से ही manufacturers इन्हें किसी भी transistor के लिए datasheet पर list कर पाते हैं।',
      ],
      transcriptEN:
        'Treat the BJT as a four-variable black box; the hybrid equations mix voltage and current and give the hie/hre/hfe/hoe set.',
      transcriptHI:
        'BJT को चार-variable black box मानिए; hybrid equations voltage और current को mix करके hie/hre/hfe/hoe set देती हैं।',
      visualNote:
        'A grey box with terminals 1-1\' (Vi, Ii) on the left and 2-2\' (Vo, Io) on the right, with the two stacked hybrid equations beside it.',
    },
    {
      id: 'S04_FourHParameters',
      label: 'The Four h-Parameters & the Hybrid Circuit',
      kind: 'theory',
      subtitle: 'hie, hre, hfe, hoe - defined and drawn',
      theoryEN: [
        'The first parameter, hie, is the input impedance. It tells you how much the base voltage changes when you push a little more current into the base, with the output voltage held steady (in symbols, hie = dVbe/dIb at constant Vce). Since it relates a voltage to a current, it is just a resistance, and we draw it as a plain resistor at the input.',
        'The second, hre, is the reverse voltage ratio. It measures how much of the output voltage sneaks back and shows up at the input (hre = dVbe/dVce at constant Ib). Because it is the output reaching back to the input, we draw it as a small dependent voltage source. In practice it is tiny, around one ten-thousandth, so it barely matters.',
        'The third, hfe, is the forward current gain, and it is the star of the show: it is the small-signal current gain beta, telling you how much extra collector current you get for a little extra base current (hfe = dIc/dIb at constant Vce). Since a small input current controls a larger output current, we draw it as a dependent current source.',
        'The fourth, hoe, is the output admittance. It captures the small amount of leakage at the output, that is, how the collector current drifts when the output voltage changes (hoe = dIc/dVce at constant Ib). It has units of Siemens (the inverse of Ohms), and its reciprocal is the output resistance ro, so it is drawn as a resistor at the output.',
        'Putting all four together gives the complete hybrid circuit. On the input side we have hie in series with the little feedback source hre*Vce. On the output side we have the current source hfe*Ib sitting in parallel with the resistance 1/hoe. This model is fully accurate, but it is cluttered, mostly by that tiny hre feedback term that we will soon be able to drop.',
      ],
      theoryHI: [
        'पहला parameter, hie, input impedance है। यह बताता है कि जब आप base में थोड़ा और current डालते हैं तो base voltage कितना बदलता है, output voltage को स्थिर रखते हुए (symbols में, hie = dVbe/dIb, Vce constant)। चूँकि यह एक voltage को एक current से जोड़ता है, यह बस एक resistance है, और हम इसे input पर एक सादे resistor की तरह बनाते हैं।',
        'दूसरा, hre, reverse voltage ratio है। यह मापता है कि output voltage का कितना हिस्सा चुपके से वापस आकर input पर दिखता है (hre = dVbe/dVce, Ib constant)। चूँकि यह output का input तक पहुँचना है, हम इसे एक छोटे dependent voltage source की तरह बनाते हैं। असल में यह बहुत छोटा होता है, लगभग दस-हज़ारवाँ हिस्सा, तो इसका असर न के बराबर है।',
        'तीसरा, hfe, forward current gain है, और यही असली हीरो है: यह small-signal current gain beta है, जो बताता है कि थोड़े अतिरिक्त base current के बदले कितना अतिरिक्त collector current मिलता है (hfe = dIc/dIb, Vce constant)। चूँकि एक छोटा input current एक बड़े output current को control करता है, हम इसे dependent current source की तरह बनाते हैं।',
        'चौथा, hoe, output admittance है। यह output पर थोड़ी सी leakage पकड़ता है, यानी output voltage बदलने पर collector current कैसे खिसकता है (hoe = dIc/dVce, Ib constant)। इसके units Siemens हैं (Ohms का inverse), और इसका reciprocal output resistance ro है, तो इसे output पर एक resistor की तरह बनाया जाता है।',
        'चारों को मिलाने पर पूरा hybrid circuit बनता है। input तरफ़ hie, छोटे feedback source hre*Vce के series में होता है। output तरफ़ current source hfe*Ib, resistance 1/hoe के parallel में बैठता है। यह model पूरी तरह सटीक है, पर भरा-भरा है, ज़्यादातर उसी छोटे hre feedback term की वजह से जिसे हम जल्द ही हटा पाएँगे।',
      ],
      transcriptEN:
        'Four h-parameters: hie a resistor, hre a tiny feedback source, hfe a current-gain source, hoe an output conductance whose inverse is ro.',
      transcriptHI:
        'चार h-parameters: hie एक resistor, hre एक छोटा feedback source, hfe एक current-gain source, hoe एक output conductance जिसका inverse ro है।',
      visualNote:
        'Four lettered panels pairing each definition with its symbol, then the two-box hybrid schematic (hie + hre*Vce on input, hfe*Ib || 1/hoe on output).',
    },
    {
      id: 'S05_ReModel',
      label: 'The re Model: Physical Foundation',
      kind: 'theory',
      subtitle: 're = VT/IE - the bouncer at the emitter door',
      theoryEN: [
        'The datasheet h-parameters are handy because every manufacturer lists them, but they are just numbers, and they do not tell you what is physically going on inside the device. The re model fixes this by tying the small-signal behaviour straight to the device physics and to the actual DC bias current your circuit is running.',
        'At the heart of the model is re, the dynamic AC resistance of the forward-biased base-emitter diode. This is our bouncer guarding the emitter door: it sets how stiff the door is, that is, how hard the small signal has to push to get current flowing into the emitter.',
        'The master formula is re = VT/IE. Here VT is the thermal voltage, a fixed quantity from physics worth about 26 mV at room temperature, and IE is the DC bias emitter current, which you already found when you solved the DC bias. So re is decided entirely by how you biased the transistor, with no extra mystery.',
        'The most important thing to notice is the inverse relationship between IE and re: a larger DC bias current gives a smaller re. A smaller re means a stiffer-door bouncer steps aside, the signal gets in more easily, and the amplifier ends up louder. In short, push the bias current up and you get more gain.',
        'One more quantity falls straight out of this: the transconductance gm = IC/VT = 1/re. It is simply the inverse of re, and it measures how much output collector current you get for each volt of input. The full step-by-step proof of re = VT/IE, starting from the diode equation, is worked out on the right.',
      ],
      theoryHI: [
        'datasheet के h-parameters इसलिए सुविधाजनक हैं क्योंकि हर manufacturer इन्हें list करता है, पर ये बस numbers हैं, और ये नहीं बताते कि device के अंदर physically क्या हो रहा है। re model इसे ठीक करता है, small-signal बर्ताव को सीधे device physics और आपके circuit में चल रहे असली DC bias current से जोड़कर।',
        'model के केंद्र में re है, forward-biased base-emitter diode का dynamic AC resistance। यही हमारा emitter door की रखवाली करता bouncer है: यह तय करता है कि door कितना सख़्त है, यानी emitter में current बहाने के लिए छोटे signal को कितना ज़ोर लगाना पड़े।',
        'master formula है re = VT/IE। यहाँ VT thermal voltage है, physics से तय एक राशि जो room temperature पर लगभग 26 mV होती है, और IE DC bias emitter current है, जो आप DC bias हल करते समय पहले ही निकाल चुके हैं। तो re पूरी तरह इस बात से तय होता है कि आपने transistor को कैसे bias किया, बिना किसी अतिरिक्त रहस्य के।',
        'ध्यान देने वाली सबसे ज़रूरी बात IE और re के बीच का inverse relationship है: ज़्यादा DC bias current से re छोटा होता है। छोटा re यानी सख़्त-door bouncer हट जाता है, signal आसानी से अंदर आता है, और amplifier ज़्यादा ज़ोरदार बनता है। संक्षेप में, bias current बढ़ाइए और ज़्यादा gain पाइए।',
        'एक और राशि सीधे इसी से निकलती है: transconductance gm = IC/VT = 1/re। यह बस re का inverse है, और मापता है कि input के हर volt के बदले कितना output collector current मिलता है। diode equation से शुरू करके re = VT/IE का पूरा step-by-step proof दाईं ओर हल किया गया है।',
      ],
      transcriptEN:
        're = VT/IE is the cornerstone: a dynamic diode resistance set by the bias current. Higher IE means smaller re means more gain.',
      transcriptHI:
        're = VT/IE आधारशिला है: bias current से तय एक dynamic diode resistance। ज़्यादा IE यानी छोटा re यानी ज़्यादा gain।',
      visualNote:
        'An IE slider driving re = 26mV/IE live, with the bouncer door narrowing (low re) or widening (high re), plus a StepThrough deriving re from the diode equation.',
    },
    {
      id: 'S06_BridgingModels',
      label: 'Bridging the Models',
      kind: 'theory',
      subtitle: 'h-parameters collapse into the clean re model',
      theoryEN: [
        'The h-parameter model and the re model are two descriptions of the same transistor, so they must agree, and matching them up turns the messy hybrid box into something much simpler. Let us line up the four parameters one by one.',
        'First, hie becomes beta*re. The reason is the impedance reflection rule: a little base current produces a much larger emitter current (about beta times larger), so when the base "looks down" into the emitter resistance re, it appears multiplied by beta. The input resistance at the base is therefore beta*re.',
        'Next, hfe simply becomes beta, the current gain. This is the core amplifying factor, and it is exactly the same idea in both models, so nothing changes here except the name.',
        'Then hre becomes approximately zero. We already saw it is the tiny output-to-input feedback (around one ten-thousandth), and because it is so small we safely neglect it. Setting hre to zero is the same as shorting out that little feedback source, which cleans up the input side completely.',
        'Finally, hoe becomes 1/ro. The output admittance and the output resistance are just inverses of each other, so ro = 1/hoe. With these four substitutions the cluttered hybrid box collapses into one clean blueprint: a single resistance beta*re at the input, and at the output a current source beta*Ib sitting in parallel with the output resistance ro.',
      ],
      theoryHI: [
        'h-parameter model और re model एक ही transistor के दो वर्णन हैं, तो इन्हें आपस में मिलना ही चाहिए, और इन्हें मिलाने से भरा-भरा hybrid box बहुत आसान चीज़ बन जाता है। आइए चारों parameters को एक-एक करके मिलाएँ।',
        'पहला, hie बन जाता है beta*re। इसकी वजह impedance reflection rule है: थोड़ा base current एक कहीं बड़ा emitter current पैदा करता है (लगभग beta गुना बड़ा), तो जब base, emitter resistance re में "नीचे देखता" है, वह beta से गुणा होकर दिखता है। इसलिए base पर input resistance beta*re है।',
        'अगला, hfe बस beta बन जाता है, यानी current gain। यही मूल amplifying factor है, और दोनों models में बिलकुल यही idea है, तो नाम के अलावा यहाँ कुछ नहीं बदलता।',
        'फिर hre लगभग शून्य बन जाता है। हम पहले ही देख चुके हैं कि यह छोटा output-to-input feedback है (लगभग दस-हज़ारवाँ हिस्सा), और इतना छोटा होने की वजह से हम इसे सुरक्षित रूप से neglect कर देते हैं। hre को शून्य रखना उसी छोटे feedback source को short करने जैसा है, जो input तरफ़ को पूरी तरह साफ़ कर देता है।',
        'आख़िर में, hoe बन जाता है 1/ro। output admittance और output resistance बस एक-दूसरे के inverse हैं, तो ro = 1/hoe। इन चार substitutions के साथ भरा-भरा hybrid box एक साफ़ blueprint में सिमट जाता है: input पर एक अकेला resistance beta*re, और output पर एक current source beta*Ib जो output resistance ro के parallel में बैठा है।',
      ],
      transcriptEN:
        'hie becomes beta*re, hfe becomes beta, hre becomes zero, hoe becomes 1/ro - the hybrid box collapses into a clean re blueprint.',
      transcriptHI:
        'hie बनता है beta*re, hfe बनता है beta, hre बनता है zero, hoe बनता है 1/ro - hybrid box एक साफ़ re blueprint में सिमट जाता है।',
      visualNote:
        'Arrow mappings hie->beta*re, hfe->beta_ac, hre->0, hoe->1/ro, ending in the simplified equivalent: beta*re input, beta*Ib source and ro on output.',
    },
    {
      id: 'S07_ThreeStepTransform',
      label: 'The 3-Step AC Transformation',
      kind: 'theory',
      subtitle: 'Short the velvet ropes, ground the DC, redraw',
      theoryEN: [
        'To analyse a real amplifier we turn the full circuit into a simpler AC-only version in three clear steps. Step one is just to draw the complete biased common-emitter amplifier as it really is, with the supply Vcc, the bias resistors R1 and R2, the collector resistor Rc, the emitter resistor Re, and all the coupling and bypass capacitors in place.',
        'Step two is where the velvet ropes do their work: we short the capacitors and ground the DC supply. At the frequency of a real signal, a capacitor\'s reactance Xc = 1/(2*pi*f*C) becomes so small that it is practically zero, so every coupling and bypass capacitor behaves like a plain wire. That is the velvet rope swinging open to let the music (AC) straight through.',
        'At the same time, the DC supply node Vcc is held at a constant voltage, and anything that never changes looks like a fixed reference to the wiggling signal. So for the AC, the Vcc rail becomes an AC ground. The steady DC crowd-control barriers simply vanish from the AC picture.',
        'Step three is to redraw what is left, which is now a clean AC-only circuit, and then replace the transistor symbol with its re engine: a resistance beta*re looking into the base, a current source beta*Ib at the collector, and the output resistance ro across the output.',
        'With this tidy AC equivalent in front of us, we can now apply the basic circuit laws (Kirchhoff\'s voltage and current laws) to read off the three things we care about: the input impedance Zi, the output impedance Zo, and the voltage gain Av.',
      ],
      theoryHI: [
        'एक असली amplifier को analyse करने के लिए हम पूरे circuit को तीन साफ़ steps में एक आसान AC-only version में बदल देते हैं। पहला step बस इतना है कि biased common-emitter amplifier को जैसा वह सच में है वैसा पूरा बना लें, supply Vcc, bias resistors R1 और R2, collector resistor Rc, emitter resistor Re, और सारे coupling व bypass capacitors के साथ।',
        'दूसरे step में velvet ropes अपना काम करती हैं: हम capacitors को short करते हैं और DC supply को ground करते हैं। असली signal की frequency पर capacitor का reactance Xc = 1/(2*pi*f*C) इतना छोटा हो जाता है कि वह व्यावहारिक रूप से शून्य है, तो हर coupling और bypass capacitor एक सादे तार की तरह बर्ताव करता है। यही velvet rope का खुलकर music (AC) को सीधे गुज़रने देना है।',
        'इसी समय, DC supply node Vcc एक constant voltage पर रहता है, और जो चीज़ कभी बदलती नहीं वह हिलते signal को एक fixed reference जैसी दिखती है। तो AC के लिए Vcc rail एक AC ground बन जाता है। steady DC crowd-control barriers AC तस्वीर से बस ग़ायब हो जाते हैं।',
        'तीसरा step है जो बचा उसे फिर से बनाना, जो अब एक साफ़ AC-only circuit है, और फिर transistor symbol को उसके re engine से बदलना: base में देखने पर एक resistance beta*re, collector पर एक current source beta*Ib, और output पर output resistance ro।',
        'यह सुथरा AC equivalent सामने होने पर, हम अब बुनियादी circuit नियम (Kirchhoff के voltage और current नियम) लगाकर वे तीन चीज़ें पढ़ सकते हैं जिनकी हमें परवाह है: input impedance Zi, output impedance Zo, और voltage gain Av।',
      ],
      transcriptEN:
        'At AC the caps short and Vcc grounds, so the biased schematic morphs into a clean AC equivalent ready for the re model.',
      transcriptHI:
        'AC पर caps short और Vcc ground हो जाता है, तो biased schematic एक साफ़ AC equivalent में बदल जाता है जो re model के लिए तैयार है।',
      visualNote:
        'A coupling-cap visual showing DC blocked and AC passed, plus an SVG of the full CE amplifier (Vcc, R1/R2, Rc, Re, Ce, coupling caps).',
    },
    {
      id: 'S08_GoldenTrinity',
      label: 'The Golden Trinity: Zi, Zo, Av',
      kind: 'theory',
      subtitle: 'Voltage gain, phase inversion and the unbypassed emitter',
      theoryEN: [
        'Once we have the clean AC equivalent, the entire analysis of the amplifier comes down to three numbers, which we can call the golden trinity. They are Zi, the input impedance that the incoming signal source has to push against; Zo, the output impedance that the load sees when it looks back into the amplifier; and Av = Vo/Vi, the voltage gain, which is simply how many times bigger the output voltage is than the input.',
        'For the input impedance, we first look into the base. With the emitter bypassed, the resistance there is Zb = beta*re. The source, however, also sees the bias resistors in parallel with this, so Zi = RB||beta*re (or R1||R2||beta*re when divider bias is used). Because the bias resistors are usually large, the parallel combination is mostly set by beta*re, so beta*re is what really dominates Zi.',
        'For the output impedance, we use a standard trick: turn the input signal off by setting Vi = 0. With no input, there is no base current (Ib = 0), so the controlled source beta*Ib produces nothing and behaves like an open circuit. What is left looking back into the output is just Zo = RC||ro, which is close to RC whenever ro is large.',
        'The voltage gain is the heart of the module, and it comes from two short statements. On the input side, the signal voltage sits across beta*re, so Vi = Ib*(beta*re). On the output side, the collector current beta*Ib flows through the collector load RC||RL and develops Vo = -(beta*Ib)*(RC||RL). Dividing the second by the first, the beta*Ib cancels and we are left with Av = -(RC||RL)/re (or just -RC/re with no load). The full step-by-step version is worked out beside this scene. The minus sign is not optional: it is a guaranteed 180-degree phase inversion, so the broadcast always comes out upside-down.',
        'Finally, there is a useful trade-off hiding in the bypass capacitor Ce. If we remove it, the whole AC signal now has to travel through the emitter resistor RE, and that resistance is reflected up to the base beta times larger, giving Zb = beta*(re+RE). The gain drops to Av = -(RC||RL)/(re+RE), which is smaller, but in exchange the input impedance rises and the amplifier becomes far more stable and linear. You give up some loudness to get steadiness and a friendlier input.',
      ],
      theoryHI: [
        'एक बार साफ़ AC equivalent मिल जाए, तो amplifier का पूरा analysis तीन numbers पर आ टिकता है, जिन्हें हम golden trinity कह सकते हैं। ये हैं Zi, वह input impedance जिसके विरुद्ध आने वाले signal source को धकेलना पड़ता है; Zo, वह output impedance जो load amplifier में पीछे देखने पर देखता है; और Av = Vo/Vi, voltage gain, जो बस इतना है कि output voltage, input से कितने गुना बड़ा है।',
        'input impedance के लिए, हम पहले base में देखते हैं। emitter bypassed होने पर वहाँ resistance Zb = beta*re है। पर source इसके parallel में bias resistors भी देखता है, तो Zi = RB||beta*re (या divider bias में R1||R2||beta*re)। चूँकि bias resistors आमतौर पर बड़े होते हैं, parallel combination ज़्यादातर beta*re से तय होता है, इसलिए Zi को असल में beta*re ही हावी करता है।',
        'output impedance के लिए हम एक मानक trick इस्तेमाल करते हैं: input signal को बंद कर देते हैं, यानी Vi = 0 रखते हैं। बिना input के कोई base current नहीं (Ib = 0), तो controlled source beta*Ib कुछ नहीं बनाता और एक open circuit की तरह बर्ताव करता है। output में पीछे देखने पर जो बचता है वह बस Zo = RC||ro है, जो जब भी ro बड़ा हो तो RC के क़रीब होता है।',
        'voltage gain module का दिल है, और यह दो छोटे कथनों से निकलता है। input तरफ़, signal voltage beta*re के आर-पार पड़ता है, तो Vi = Ib*(beta*re)। output तरफ़, collector current beta*Ib, collector load RC||RL से बहकर Vo = -(beta*Ib)*(RC||RL) बनाता है। दूसरे को पहले से भाग देने पर beta*Ib कट जाता है और बचता है Av = -(RC||RL)/re (या बिना load के बस -RC/re)। पूरा step-by-step रूप इस scene के साथ हल किया गया है। minus चिह्न वैकल्पिक नहीं है: यह एक पक्का 180-degree phase inversion है, तो broadcast हमेशा उल्टा निकलता है।',
        'आख़िर में, bypass capacitor Ce में एक काम का trade-off छिपा है। अगर हम इसे हटा दें, तो पूरा AC signal अब emitter resistor RE से गुज़रना पड़ता है, और वह resistance base तक beta गुना बड़ा reflect होता है, जिससे Zb = beta*(re+RE)। gain गिरकर Av = -(RC||RL)/(re+RE) हो जाता है, जो छोटा है, पर बदले में input impedance बढ़ जाता है और amplifier कहीं ज़्यादा stable और linear बन जाता है। आप कुछ loudness छोड़कर steadiness और एक दोस्ताना input पाते हैं।',
      ],
      transcriptEN:
        'Zi = RB||beta*re, Zo = RC||ro, and Av = -(RC||RL)/re with the mandatory inversion. Unbypassing RE trades gain for stability and Zi.',
      transcriptHI:
        'Zi = RB||beta*re, Zo = RC||ro, और Av = -(RC||RL)/re ज़रूरी inversion के साथ। RE को unbypass करना gain को stability और Zi से बदल देता है।',
      visualNote:
        'The SmallSignalGain lab (live Av, in/out waves) plus a bypassed-vs-unbypassed Ce toggle comparing -(RC||RL)/re against -(RC||RL)/(re+RE).',
    },
    {
      id: 'S09_EarlyAndLoading',
      label: 'The Early Effect, Loading & Synthesis',
      kind: 'theory',
      subtitle: 'ro, source and load loading, and the master matrix',
      theoryEN: [
        'Our gain formula assumed the transistor was a perfect controlled current source, but real transistors leak a little. As the collector-emitter voltage rises, the collector current creeps up slightly too, an effect called the Early effect, and we model it with an internal output resistance ro = (VA + VCEQ)/ICQ, where VA is the Early voltage. Because ro sits across the output, it parallels the collector load and trims the gain a touch, giving Av = -(RC||ro)/re. Since ro is usually large, this is only a small correction.',
        'There is also loss at the very entrance, called source loading. A real signal source has its own internal resistance Rs, and this Rs together with the amplifier\'s input impedance Zi forms a voltage divider. The result is that the voltage that actually reaches the base, Vi, is a little smaller than the open source voltage Vs. In the club, this is the crowd at the door soaking up part of the whisper before it even gets inside.',
        'There is a matching loss at the exit, called output loading. The load resistor RL sits in parallel with the collector resistor RC, and a parallel combination is always smaller than either resistor alone, so the effective collector load drops. The loaded gain Av_L = -(RC||RL)/re is therefore always less than the ideal no-load gain. This is the room\'s crowd soaking up part of the broadcast.',
        'It helps to collect the standard results in one place, a kind of synthesis matrix. For a fixed-bias stage the answers are Zi = RB||beta*re, Zo = RC, and Av = -RC/re.',
        'For voltage-divider bias they are Zi = R1||R2||beta*re, Zo = RC, and Av = -RC/re, the same gain but with the two bias resistors in parallel at the input. For an unbypassed-emitter stage they become Zi = RB||beta*(re+RE), Zo = RC, and Av = -RC/(re+RE), showing once more how leaving RE in the signal path raises Zi but lowers the gain.',
      ],
      theoryHI: [
        'हमारे gain formula ने माना था कि transistor एक perfect controlled current source है, पर असली transistors थोड़ा leak करते हैं। जैसे-जैसे collector-emitter voltage बढ़ता है, collector current भी थोड़ा सरककर बढ़ता है, इस असर को Early effect कहते हैं, और हम इसे एक internal output resistance ro = (VA + VCEQ)/ICQ से model करते हैं, जहाँ VA Early voltage है। चूँकि ro output के आर-पार बैठता है, यह collector load के parallel में आकर gain को थोड़ा कम कर देता है, जिससे Av = -(RC||ro)/re। चूँकि ro आमतौर पर बड़ा होता है, यह बस एक छोटा सुधार है।',
        'एकदम प्रवेश पर भी नुक़सान होता है, जिसे source loading कहते हैं। एक असली signal source का अपना internal resistance Rs होता है, और यह Rs, amplifier के input impedance Zi के साथ मिलकर एक voltage divider बना देता है। नतीजा यह कि जो voltage असल में base तक पहुँचता है, Vi, खुले source voltage Vs से थोड़ा छोटा होता है। club में यह door पर खड़ी भीड़ है जो whisper के अंदर पहुँचने से पहले ही उसका कुछ हिस्सा सोख लेती है।',
        'निकास पर भी मिलता-जुलता नुक़सान होता है, जिसे output loading कहते हैं। load resistor RL, collector resistor RC के parallel में बैठता है, और parallel combination हमेशा अकेले किसी भी resistor से छोटा होता है, तो effective collector load गिर जाता है। इसलिए loaded gain Av_L = -(RC||RL)/re हमेशा ideal no-load gain से कम होता है। यह कमरे की भीड़ है जो broadcast का कुछ हिस्सा सोख लेती है।',
        'मानक नतीजों को एक जगह इकट्ठा करना मददगार है, एक तरह का synthesis matrix। fixed-bias stage के लिए जवाब हैं Zi = RB||beta*re, Zo = RC, और Av = -RC/re।',
        'voltage-divider bias के लिए ये हैं Zi = R1||R2||beta*re, Zo = RC, और Av = -RC/re, वही gain पर input पर दोनों bias resistors parallel में। unbypassed-emitter stage के लिए ये बन जाते हैं Zi = RB||beta*(re+RE), Zo = RC, और Av = -RC/(re+RE), जो एक बार फिर दिखाते हैं कि RE को signal path में छोड़ना Zi बढ़ाता है पर gain घटाता है।',
      ],
      transcriptEN:
        'ro from the Early effect and the source/load dividers all trim the gain; the synthesis matrix tabulates Zi, Zo, Av for the three configs.',
      transcriptHI:
        'Early effect से ro और source/load dividers सब gain को कम करते हैं; synthesis matrix तीनों configs के लिए Zi, Zo, Av tabulate करता है।',
      visualNote:
        'A loading lab with Rs and RL sliders showing Vi < Vs and RC||RL shrinking the load, plus a synthesis-matrix table for the three CE configurations.',
    },
    {
      id: 'S10_Flashcards',
      label: 'Flashcards - Lock It In',
      kind: 'flashcards',
      subtitle: 'Eight cards: re, superposition, caps, gain, the h-to-re bridge',
      theoryEN: [
        'Flip each card: term on the front, the plain explanation on the back.',
        'These eight cover re = VT/IE, why we split DC and AC, the coupling cap at AC, the CE gain, the hie->re map, hre/hoe, the output impedance Zo and the unbypassed-emitter trade-off.',
        'Aim to explain each back in your own words before flipping - that is real recall.',
      ],
      theoryHI: [
        'हर card पलटें: सामने term, पीछे सीधी व्याख्या।',
        'ये आठ cards re = VT/IE, DC और AC को क्यों अलग करते हैं, AC पर coupling cap, CE gain, hie->re map, hre/hoe, output impedance Zo और unbypassed-emitter trade-off को cover करते हैं।',
        'पलटने से पहले हर पीछे वाली बात अपने शब्दों में बताने की कोशिश करें - यही असली recall है।',
      ],
      transcriptEN: 'Eight cards to lock the small-signal model into memory. Teach the back in your own words before flipping.',
      transcriptHI: 'small-signal model को याददाश्त में बैठाने के लिए आठ cards। पलटने से पहले पीछे वाली बात अपने शब्दों में सिखाइए।',
      visualNote: 'Watermarked shareable flip-card deck: bold term on the front, explanation on the back, accent colours per card.',
    },
    {
      id: 'S11_Quiz',
      label: 'Quiz - Test the Amplifier',
      kind: 'quiz',
      subtitle: 'Eight questions on re, gain, caps and the h-model',
      theoryEN: [
        'Eight multiple-choice questions on the small-signal model, re, the AC equivalent and the voltage gain.',
        'Read every option - the wrong ones are the misconceptions this module exists to break.',
        'Explanations follow each answer so a miss becomes a lesson.',
      ],
      theoryHI: [
        'small-signal model, re, AC equivalent और voltage gain पर आठ multiple-choice सवाल।',
        'हर option पढ़ें - ग़लत वाले वही misconceptions हैं जिन्हें तोड़ने के लिए यह module बना है।',
        'हर जवाब के बाद explanation है ताकि चूक भी एक सबक़ बन जाए।',
      ],
      transcriptEN: 'Eight quick questions on the re model and CE amplifier gain. Read all four options - the wrong ones are the classic traps.',
      transcriptHI: 're model और CE amplifier gain पर आठ तेज़ सवाल। चारों options पढ़ें - ग़लत वाले classic traps हैं।',
      visualNote: 'QuizArena with eight problems; show running score and reveal the explanation on answer.',
    },
    {
      id: 'S12_Recap',
      label: 'Recap - The Amplifier in One Page',
      kind: 'recap',
      subtitle: 'Everything that turns the whisper into a broadcast',
      theoryEN: [
        'Here is the whole amplifier on a single page. The first idea is to split DC and AC using superposition: the DC bias is the steady house power that sets the resting point, and the AC small-signal is the music we actually want. We solve each one on its own and add the answers back, which keeps the maths simple.',
        'The bouncer at the emitter door is re = VT/IE, where VT is about 26 mV. The key takeaway is the inverse relationship: a higher bias current IE makes re smaller, and a smaller re makes the gain larger. The closely related transconductance is gm = IC/VT = 1/re.',
        'The coupling and bypass capacitors are the velvet ropes. At signal frequency their reactance Xc drops toward zero, so they behave as shorts: they let the music (AC) pass straight through and they turn the Vcc rail into an AC ground, which is exactly what lets us draw the simple AC equivalent.',
        'The full h-parameter box collapses neatly into the re blueprint: hie becomes beta*re, hfe becomes beta, hre becomes about zero, and hoe becomes 1/ro. Four messy parameters turn into one clean input resistance and one clean output stage.',
        'The golden trinity ties it together: the input impedance is Zi = RB||beta*re, the output impedance is Zo = RC||ro, and the voltage gain is Av = -(RC||RL)/re. Remember that the minus sign is a guaranteed 180-degree phase inversion, so the broadcast always comes out upside-down.',
        'The references used for these formulas and the worked derivations are listed below.',
      ],
      theoryHI: [
        'यह रहा पूरा amplifier एक ही page पर। पहला idea superposition से DC और AC को अलग करना है: DC bias वह steady house power है जो resting point तय करती है, और AC small-signal वह music है जो हमें असल में चाहिए। हम हर एक को अकेले हल करके जवाबों को जोड़ देते हैं, जिससे गणित आसान रहता है।',
        'emitter door का bouncer re = VT/IE है, जहाँ VT लगभग 26 mV है। मुख्य बात inverse relationship है: ज़्यादा bias current IE से re छोटा होता है, और छोटा re से gain बड़ा होता है। इससे जुड़ा transconductance gm = IC/VT = 1/re है।',
        'coupling और bypass capacitors velvet ropes हैं। signal frequency पर उनका reactance Xc शून्य की ओर गिरता है, तो वे shorts की तरह बर्ताव करती हैं: वे music (AC) को सीधे गुज़रने देती हैं और Vcc rail को एक AC ground बना देती हैं, जो ठीक वही है जो हमें आसान AC equivalent बनाने देता है।',
        'पूरा h-parameter box सफ़ाई से re blueprint में सिमट जाता है: hie बनता है beta*re, hfe बनता है beta, hre बनता है लगभग शून्य, और hoe बनता है 1/ro। चार भरे-भरे parameters एक साफ़ input resistance और एक साफ़ output stage में बदल जाते हैं।',
        'golden trinity सबको बाँध देता है: input impedance Zi = RB||beta*re है, output impedance Zo = RC||ro है, और voltage gain Av = -(RC||RL)/re है। याद रखिए कि minus चिह्न एक पक्का 180-degree phase inversion है, तो broadcast हमेशा उल्टा निकलता है।',
        'इन formulas और हल किए गए derivations के लिए इस्तेमाल किए गए references नीचे दिए हैं।',
      ],
      transcriptEN:
        'The whole amplifier on one page: split DC and AC, re = VT/IE sets the gain, caps short at AC, the h-model becomes the re blueprint, and Av = -(RC||RL)/re inverts the signal.',
      transcriptHI:
        'पूरा amplifier एक page पर: DC और AC अलग करिए, re = VT/IE gain तय करता है, caps AC पर short होती हैं, h-model re blueprint बनता है, और Av = -(RC||RL)/re signal को invert करता है।',
      visualNote:
        'One-page cheat grid: split / re / caps / h-to-re / trinity, plus a small Sources list of the reference links.',
    },
  ],
  flashcards: [
    {
      frontEN: 're (emitter resistance)',
      backEN:
        'The dynamic AC resistance of the forward-biased base-emitter diode: re = VT/IE ~ 26mV/IE. It is the bouncer at the emitter door - higher bias current makes it smaller, raising the gain.',
      frontHI: 're (emitter resistance)',
      backHI:
        'Forward-biased base-emitter diode का dynamic AC resistance: re = VT/IE ~ 26mV/IE। यह emitter door का bouncer है - ज़्यादा bias current इसे छोटा करता है, gain बढ़ाता है।',
    },
    {
      frontEN: 'Why split DC and AC analysis?',
      backEN:
        'Superposition. The AC signal is small, so the transistor is locally linear around the Q-point. Analyse the DC bias (the house power) and the AC small-signal (the music) separately, then add them back.',
      frontHI: 'DC और AC analysis क्यों अलग करें?',
      backHI:
        'Superposition। AC signal छोटा है, तो transistor Q-point के आसपास locally linear है। DC bias (house power) और AC small-signal (music) को अलग-अलग पढ़कर फिर जोड़ लीजिए।',
    },
    {
      frontEN: 'Coupling/bypass capacitor at AC',
      backEN:
        'Its reactance Xc = 1/(2*pi*f*C) -> 0 at signal frequency, so it acts as a short. A velvet rope that passes the music (AC) but blocks the DC barrier - and it makes Vcc an AC ground.',
      frontHI: 'AC पर coupling/bypass capacitor',
      backHI:
        'Signal frequency पर इसका reactance Xc = 1/(2*pi*f*C) -> 0, तो यह short की तरह काम करता है। एक velvet rope जो music (AC) गुज़रने देती है पर DC barrier रोकती है - और Vcc को AC ground बना देती है।',
    },
    {
      frontEN: 'CE voltage gain (bypassed)',
      backEN:
        'Av = -(Rc||RL)/re. The whisper is multiplied by the ratio of collector resistance to the bouncer resistance. The minus sign is the mandatory 180-degree phase inversion - the broadcast comes out upside-down.',
      frontHI: 'CE voltage gain (bypassed)',
      backHI:
        'Av = -(Rc||RL)/re। whisper को collector resistance और bouncer resistance के ratio से गुणा किया जाता है। minus चिह्न ज़रूरी 180-degree phase inversion है - broadcast उल्टा निकलता है।',
    },
    {
      frontEN: 'hie -> re model',
      backEN:
        'hie ~ beta*re: the input impedance at the base equals the emitter resistance reflected by the current gain. The base "sees" re multiplied by beta.',
      frontHI: 'hie -> re model',
      backHI:
        'hie ~ beta*re: base पर input impedance, current gain से reflect हुए emitter resistance के बराबर है। base, re को beta गुना "देखता" है।',
    },
    {
      frontEN: 'hre and hoe in the re model',
      backEN:
        'hre ~ 0: the reverse feedback (~1e-4) is so tiny it is neglected, the input source shorted out. hoe = 1/ro: the output admittance is the inverse of the output resistance ro.',
      frontHI: 're model में hre और hoe',
      backHI:
        'hre ~ 0: reverse feedback (~1e-4) इतना छोटा है कि neglect कर दिया जाता है, input source short हो जाता है। hoe = 1/ro: output admittance, output resistance ro का inverse है।',
    },
    {
      frontEN: 'Output impedance Zo',
      backEN:
        'Set Vi = 0, so Ib = 0 and the beta*Ib current source opens. What remains is Zo = RC||ro, which is approximately RC when ro is large.',
      frontHI: 'Output impedance Zo',
      backHI:
        'Vi = 0 रखिए, तो Ib = 0 और beta*Ib current source खुल जाता है। जो बचता है वह Zo = RC||ro है, जो ro बड़ा होने पर लगभग RC होता है।',
    },
    {
      frontEN: 'Unbypassed emitter trade-off',
      backEN:
        'Remove Ce and the full AC flows through RE: Zb = beta*(re+RE) raises Zi and stabilises gain, but Av falls to -(Rc||RL)/(re+RE). Emitter resistance is reflected beta times larger at the base.',
      frontHI: 'Unbypassed emitter trade-off',
      backHI:
        'Ce हटाइए तो पूरा AC RE से बहता है: Zb = beta*(re+RE) Zi बढ़ाता है और gain stable करता है, पर Av गिरकर -(Rc||RL)/(re+RE) हो जाता है। Emitter resistance base पर beta गुना बड़ा reflect होता है।',
    },
  ],
  quiz: [
    {
      questionEN: 'What does the small-signal emitter resistance re equal?',
      questionHI: 'small-signal emitter resistance re किसके बराबर होता है?',
      options: ['re = IE/VT', 're = VT/IE', 're = beta*IE', 're = VT*IE'],
      answerIndex: 1,
      explainEN: 're = VT/IE, with VT ~ 26 mV. A higher bias current IE gives a smaller re - the bouncer steps aside and the gain rises.',
      explainHI: 're = VT/IE, जहाँ VT ~ 26 mV। ज़्यादा bias current IE से re छोटा होता है - bouncer हट जाता है और gain बढ़ता है।',
    },
    {
      questionEN: 'Why do we short coupling and bypass capacitors when drawing the AC equivalent circuit?',
      questionHI: 'AC equivalent circuit बनाते समय हम coupling और bypass capacitors को short क्यों करते हैं?',
      options: [
        'They block AC and pass DC',
        'At signal frequency their reactance Xc is near zero, so they act as shorts to AC',
        'They become open circuits to AC',
        'They turn into current sources',
      ],
      answerIndex: 1,
      explainEN: 'At AC, Xc = 1/(2*pi*f*C) is very small, so caps behave as shorts - the velvet ropes pass the music and Vcc becomes an AC ground.',
      explainHI: 'AC पर Xc = 1/(2*pi*f*C) बहुत छोटा है, तो caps short की तरह काम करती हैं - velvet ropes music गुज़रने देती हैं और Vcc AC ground बन जाता है।',
    },
    {
      questionEN: 'For a common-emitter amp with the emitter fully bypassed, the voltage gain is:',
      questionHI: 'emitter पूरी तरह bypassed वाले common-emitter amp के लिए voltage gain है:',
      options: ['Av = +(Rc||RL)/re', 'Av = -(Rc||RL)/re', 'Av = -re/(Rc||RL)', 'Av = -(Rc||RL)*re'],
      answerIndex: 1,
      explainEN: 'Av = -(Rc||RL)/re. The minus sign signals the mandatory 180-degree phase inversion - the broadcast is amplified but flipped.',
      explainHI: 'Av = -(Rc||RL)/re। minus चिह्न ज़रूरी 180-degree phase inversion दिखाता है - broadcast amplify तो होता है पर उल्टा।',
    },
    {
      questionEN: 'In the re model, the hybrid parameter hie corresponds to:',
      questionHI: 're model में hybrid parameter hie किसके बराबर होता है?',
      options: ['1/ro', 'beta*re', 'beta_ac', 'approximately 0'],
      answerIndex: 1,
      explainEN: 'hie ~ beta*re: the base sees the emitter resistance multiplied by the current gain, so the input impedance is beta*re.',
      explainHI: 'hie ~ beta*re: base, emitter resistance को current gain से गुणा करके देखता है, तो input impedance beta*re है।',
    },
    {
      questionEN: 'Why is hre usually neglected when converting to the re model?',
      questionHI: 're model में बदलते समय hre को आमतौर पर क्यों neglect किया जाता है?',
      options: [
        'It is infinitely large',
        'The reverse feedback effect is extremely small and can be safely shorted out',
        'It equals beta',
        'It sets the output impedance',
      ],
      answerIndex: 1,
      explainEN: 'hre (~1e-4) represents a tiny output-to-input feedback that is negligible, so hre ~ 0 and the source is shorted out.',
      explainHI: 'hre (~1e-4) एक छोटा output-to-input feedback है जो नगण्य है, तो hre ~ 0 और source short कर दिया जाता है।',
    },
    {
      questionEN: 'To find the output impedance Zo of the CE amplifier, you:',
      questionHI: 'CE amplifier का output impedance Zo निकालने के लिए आप:',
      options: [
        'Set Vo = 0 and solve for Ii',
        'Set Vi = 0, which makes Ib = 0 and opens the beta*Ib source, leaving Zo = RC||ro',
        'Open the load RL only',
        'Short the collector to ground',
      ],
      answerIndex: 1,
      explainEN: 'With Vi = 0, Ib = 0 so the dependent source opens; Zo = RC||ro, which is approximately RC when ro is large.',
      explainHI: 'Vi = 0 पर Ib = 0, तो dependent source खुल जाता है; Zo = RC||ro, जो ro बड़ा होने पर लगभग RC है।',
    },
    {
      questionEN: 'Removing the emitter bypass capacitor Ce causes the base input resistance to become:',
      questionHI: 'emitter bypass capacitor Ce हटाने से base input resistance बन जाता है:',
      options: ['beta*re only', 'beta*(re + RE)', 're/beta', 'RE/beta'],
      answerIndex: 1,
      explainEN: 'Without the bypass, the full AC travels through RE, reflected to the base as beta*(re+RE) - so Zi rises and the gain falls.',
      explainHI: 'bypass के बिना, पूरा AC RE से गुज़रता है, base पर beta*(re+RE) के रूप में reflect होकर - तो Zi बढ़ता है और gain गिरता है।',
    },
    {
      questionEN: 'The transconductance gm of a BJT is best expressed as:',
      questionHI: 'किसी BJT का transconductance gm सबसे सही ढंग से कैसे लिखा जाता है?',
      options: ['gm = re/VT', 'gm = IC/VT = 1/re', 'gm = VT/IC', 'gm = beta*re'],
      answerIndex: 1,
      explainEN: 'gm = IC/VT, which is exactly 1/re - the slope converting input voltage into output current. Higher IC means a larger gm.',
      explainHI: 'gm = IC/VT, जो बिल्कुल 1/re है - वह slope जो input voltage को output current में बदलती है। ज़्यादा IC यानी बड़ा gm।',
    },
  ],
}) as unknown as SubContent;
