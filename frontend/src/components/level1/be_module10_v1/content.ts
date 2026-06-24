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
        'This module is a friendly fight between two kinds of transistor, the BJT and the FET, and they solve the same problem in two very different ways. Both let a tiny input signal control a much bigger output current, which is what makes amplifiers and switches possible. The difference is in HOW each one listens to that input.',
        'Picture the BJT (Bipolar Junction Transistor) as a water wheel that you have to keep pushing with your hand. The moment you stop pushing, it stops turning. In the same way, a BJT only keeps its output flowing while you keep feeding a small but real input current into it, and pushing all day tires your hand and steals water from the supply.',
        'Now picture the FET (Field-Effect Transistor) as a garden hose lying on the ground that you control by stepping on it. Your foot is a pure squeeze, a voltage, and it pinches the flow without you adding a single drop of water. Because your foot takes no water, the FET barely draws any input current at all, which is its great advantage.',
        'These two pictures come from two real physical facts. A BJT is bipolar, meaning it conducts using both kinds of charge carrier (electrons AND holes), and it is current-controlled. A FET is unipolar, meaning only one kind of carrier does the work (just electrons, or just holes), and it is voltage-controlled.',
        'The JFET (Junction FET) is the version we study in detail here. Instead of a foot from outside, the hose squeezes itself shut from the inside using two reverse-biased gate junctions, so the gate draws almost no current. By the end you will understand why this gives the FET a near-infinite input resistance, and you will be able to derive its square-law current equation (the Shockley equation) step by step.',
      ],
      theoryHI: [
        'यह module दो तरह के transistor, BJT और FET, के बीच एक दोस्ताना मुक़ाबला है, और दोनों एक ही समस्या को दो बहुत अलग तरीक़ों से हल करते हैं। दोनों एक छोटे से input signal को बड़े output current पर control करने देते हैं, जिससे amplifiers और switches बनते हैं। फ़र्क़ इसमें है कि हर एक उस input को सुनता KAISE है।',
        'BJT (Bipolar Junction Transistor) को एक water wheel समझिए जिसे आपको हाथ से धकेलते रहना पड़ता है। जैसे ही आप धकेलना बंद करते हैं, वह रुक जाता है। वैसे ही BJT अपना output तभी तक बहाता रहता है जब तक आप उसमें एक छोटा पर असली input current देते रहते हैं, और दिन भर धकेलने से आपका हाथ थक जाता है और supply से पानी भी चुरा लेता है।',
        'अब FET (Field-Effect Transistor) को ज़मीन पर पड़ा एक garden hose समझिए जिसे आप उस पर पैर रखकर control करते हैं। आपका पैर एक pure दबाव है, यानी एक voltage, और यह बिना एक बूँद पानी डाले flow को pinch कर देता है। क्योंकि आपका पैर पानी नहीं लेता, FET लगभग कोई input current नहीं खींचता, और यही उसका बड़ा फ़ायदा है।',
        'ये दोनों तस्वीरें दो असली physical सच्चाइयों से आती हैं। BJT bipolar है, यानी यह दोनों तरह के charge carriers (electrons AND holes) से conduct करता है, और यह current-controlled है। FET unipolar है, यानी सिर्फ़ एक तरह का carrier काम करता है (या तो electrons, या holes), और यह voltage-controlled है।',
        'JFET (Junction FET) वही version है जिसे हम यहाँ विस्तार से पढ़ेंगे। बाहर से पैर रखने के बजाय, hose gate पर लगी दो reverse-biased junctions से अंदर से ही खुद को बंद करता है, इसलिए gate लगभग कोई current नहीं खींचता। अंत तक आप समझ जाएँगे कि इसी से FET को near-infinite input resistance मिलता है, और आप उसकी square-law current equation (Shockley equation) को step by step derive कर पाएँगे।',
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
        'Everything that follows grows from one basic split, so it is worth getting clear first. The split has two halves: which charge carriers do the conducting, and what you use to control the device.',
        'A BJT is a bipolar device. "Bipolar" simply means two polarities of carrier are involved: both electrons (negative) and holes (the empty spots left when electrons move, which act positive) take part in carrying the current. A FET is a unipolar device, which means only one majority carrier type does all the work - electrons in an n-channel FET, or holes in a p-channel FET.',
        'The second half of the split is about control. A BJT is current-controlled: to set how much current flows out of the collector, you have to inject a small control current into the base. This is exactly the water wheel you must keep pushing - stop the push and the output dies.',
        'A FET, by contrast, is voltage-controlled. You do not inject a current to steer it; instead you apply a voltage at the gate, and that voltage creates an electric field that quietly throttles the output current. This is the foot on the hose: a force that shapes the flow without any fluid of its own being spent.',
        'Hold on to this one sentence and the rest of the module unfolds from it: a BJT means two carriers plus current control, while a FET means one carrier plus voltage control. Every practical difference in input resistance, stability, and size traces straight back to this single choice.',
      ],
      theoryHI: [
        'आगे जो कुछ भी है वह एक बुनियादी split से निकलता है, इसलिए इसे पहले साफ़ करना ज़रूरी है। इस split के दो हिस्से हैं: conduction कौन से charge carriers करते हैं, और device को control करने के लिए आप क्या इस्तेमाल करते हैं।',
        'BJT एक bipolar device है। "Bipolar" का मतलब बस इतना है कि दो polarity के carriers शामिल हैं: दोनों electrons (negative) और holes (वे ख़ाली जगहें जो electrons के हटने पर बनती हैं और positive की तरह काम करती हैं) current बहाने में भाग लेते हैं। FET एक unipolar device है, यानी सिर्फ़ एक majority carrier सारा काम करता है - n-channel FET में electrons, या p-channel FET में holes।',
        'split का दूसरा हिस्सा control के बारे में है। BJT current-controlled है: collector से कितना current निकलेगा यह तय करने के लिए आपको base में एक छोटा control current inject करना पड़ता है। यही वह water wheel है जिसे आपको धकेलते रहना है - धकेलना रुका तो output भी रुक गया।',
        'इसके उलट, FET voltage-controlled है। आप उसे चलाने के लिए current inject नहीं करते; बल्कि gate पर एक voltage लगाते हैं, और वह voltage एक electric field बनाता है जो चुपचाप output current को throttle करता है। यही hose पर पैर है: एक force जो flow को आकार देता है, बिना अपना कोई पानी ख़र्च किए।',
        'इस एक वाक्य को पकड़े रहिए और बाक़ी module इसी से खुलता जाएगा: BJT यानी दो carriers plus current control, जबकि FET यानी एक carrier plus voltage control। input resistance, stability, और size का हर practical फ़र्क़ सीधे इसी एक चुनाव तक जाता है।',
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
        'Once you know that a BJT is current-controlled and a FET is voltage-controlled, the everyday differences between them almost fall out on their own. Let us walk through them the way an engineer compares two parts before choosing one.',
        'Start with input impedance, which means how hard it is for a signal source to push current into the device (a high impedance is good because it barely loads the source). A BJT has a low to medium input impedance, only a few thousand ohms (a few kilohm), because its input junction is forward-biased and genuinely sips current. A FET has a very high input impedance, from about a million ohms (1 MOhm) up to several hundred MOhm, because its gate sips almost nothing.',
        'The reason sits in the conduction style we just met. The BJT is bipolar, conducting with both electrons and holes, while the FET is unipolar, conducting with majority carriers only. That simpler one-carrier path also makes the FET steadier with heat: a BJT has poorer thermal stability and can fall into thermal runaway (it heats up, conducts more, heats up further), whereas a FET stays well behaved as temperature rises.',
        'Size matters too. A BJT tends to need a larger discrete footprint, while a FET can be made very small, which is exactly why FETs dominate inside integrated circuits where millions of them must fit on one chip.',
        'If you remember only one line, make it this: the BJT loads your source because its input current is its own worst enemy, while the FET barely touches the source at all. Whenever you must read a delicate signal without disturbing it, the FET wins.',
      ],
      theoryHI: [
        'एक बार आप जान लें कि BJT current-controlled है और FET voltage-controlled, तो उनके बीच के रोज़मर्रा के फ़र्क़ लगभग अपने आप निकल आते हैं। आइए उन्हें वैसे देखें जैसे एक engineer किसी एक को चुनने से पहले दो parts की तुलना करता है।',
        'input impedance से शुरू करें, यानी किसी signal source के लिए device में current डालना कितना मुश्किल है (high impedance अच्छा है क्योंकि यह source को मुश्किल से load करता है)। BJT का input impedance low से medium है, सिर्फ़ कुछ हज़ार ohm (कुछ kilohm), क्योंकि उसका input junction forward-biased है और सचमुच current पीता है। FET का input impedance बहुत high है, लगभग दस लाख ohm (1 MOhm) से कई सौ MOhm तक, क्योंकि उसका gate लगभग कुछ नहीं पीता।',
        'इसकी वजह उसी conduction style में है जो हमने अभी देखी। BJT bipolar है, electrons और holes दोनों से conduct करता है, जबकि FET unipolar है, सिर्फ़ majority carriers से। यही सरल एक-carrier रास्ता FET को गर्मी में भी ज़्यादा स्थिर बनाता है: BJT की thermal stability कमज़ोर है और वह thermal runaway में फँस सकता है (गर्म होता है, ज़्यादा conduct करता है, और गर्म होता है), जबकि FET temperature बढ़ने पर भी शांत रहता है।',
        'size भी मायने रखता है। BJT को आमतौर पर बड़ा discrete footprint चाहिए, जबकि FET को बहुत छोटा बनाया जा सकता है, और यही वजह है कि integrated circuits के अंदर FETs का बोलबाला है जहाँ एक chip पर लाखों fit होने चाहिए।',
        'अगर सिर्फ़ एक लाइन याद रखें, तो यह: BJT आपके source को load करता है क्योंकि उसका input current ही उसका सबसे बड़ा दुश्मन है, जबकि FET source को मुश्किल से छूता है। जब भी आपको किसी नाज़ुक signal को बिना छेड़े पढ़ना हो, FET जीतता है।',
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
        'Let us meet the JFET (Junction Field-Effect Transistor) properly. It is a three-terminal device, meaning it has exactly three leads you connect to, and it is unipolar, so just one kind of carrier flows through it. Those three terminals are the Source, the Drain, and the Gate, and each has a simple job.',
        'The Source (S) is where the carriers enter the device, and the Drain (D) is where those same carriers leave it again. So you can read the names literally: the current is sourced in at one end and drained out at the other, flowing through a connecting path called the channel that runs between them.',
        'The Gate (G) is the controlling terminal, and it is the whole point of the device. You apply a voltage to the gate, and that voltage sets up an electric field reaching into the channel. By making the field stronger or weaker you squeeze or relax the channel, which raises or lowers the source-to-drain current. This is why it is called a "field-effect" transistor.',
        'The key thing to notice is what the gate does NOT need: it needs no input current to do its controlling. The control is purely by the field, that is, purely by voltage. This is the deep reason a FET barely loads its input source, and it is what the rest of the module keeps coming back to.',
        'Tying it to the garden hose: water enters at the Source, leaves at the Drain, and the Gate is the foot that decides how open the hose is. Pressing harder (more gate voltage) squeezes the flow; easing off lets it run freely.',
      ],
      theoryHI: [
        'आइए JFET (Junction Field-Effect Transistor) से ठीक से मिलें। यह एक three-terminal device है, यानी इसमें ठीक तीन leads होती हैं जिनसे आप connect करते हैं, और यह unipolar है, तो इसमें सिर्फ़ एक तरह का carrier बहता है। वे तीन terminals हैं Source, Drain, और Gate, और हर एक का काम सीधा है।',
        'Source (S) वह है जहाँ carriers device में घुसते हैं, और Drain (D) वह है जहाँ वही carriers फिर बाहर निकलते हैं। तो नामों को सीधा पढ़ सकते हैं: current एक सिरे पर source होता है और दूसरे सिरे पर drain होता है, बीच में एक जोड़ने वाले रास्ते से बहते हुए जिसे channel कहते हैं।',
        'Gate (G) controlling terminal है, और यही device का पूरा मक़सद है। आप gate पर एक voltage लगाते हैं, और वह voltage channel तक पहुँचने वाला एक electric field बनाता है। field को तेज़ या कमज़ोर करके आप channel को दबाते या ढीला छोड़ते हैं, जिससे source-से-drain current बढ़ता या घटता है। इसीलिए इसे "field-effect" transistor कहते हैं।',
        'ध्यान देने की मुख्य बात यह है कि gate को क्या नहीं चाहिए: control करने के लिए उसे कोई input current नहीं चाहिए। control पूरी तरह field से, यानी पूरी तरह voltage से होता है। यही गहरी वजह है कि FET अपने input source को मुश्किल से load करता है, और बाक़ी module बार-बार इसी पर लौटता है।',
        'इसे garden hose से जोड़ें: पानी Source से घुसता है, Drain से निकलता है, और Gate वह पैर है जो तय करता है hose कितना खुला है। ज़्यादा दबाना (ज़्यादा gate voltage) flow को pinch करता है; पैर ढीला करने पर वह खुलकर बहता है।',
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
        'To see how the squeezing actually happens, it helps to look at how an n-channel JFET is built. The heart of it is a single bar of n-type semiconductor (silicon that has been doped, or seasoned, to have spare electrons). This bar is the channel, the open pipe through which the current will flow from Source to Drain.',
        'Into the two sides of that n-bar, two heavily-doped p-type regions are embedded. "p-type" means the silicon there has been doped the opposite way, to have holes rather than spare electrons. These two p-regions are the gate, and they are wired together internally so that a single gate terminal controls both at once.',
        'Wherever a p-type region touches the n-type channel, a p-n junction forms (a boundary between p and n material, which behaves like a one-way valve for current). Because there are two p-gates, there are two such junctions, one on each side of the channel.',
        'At the Source, Drain, and Gate leads, the metal connections are made as ohmic contacts. "Ohmic" just means non-rectifying, behaving like an ordinary resistor, so the lead itself does not act like a junction; it lets current pass equally in both directions and adds no surprises.',
        'Put it together and the picture is simple: carriers flow straight down the n-channel from Source to Drain, while the two p-gates sit on either side ready to squeeze the channel from the sides. Those two gates are exactly the two cuffs inside the garden hose.',
      ],
      theoryHI: [
        'squeezing असल में कैसे होती है यह देखने के लिए यह जानना मददगार है कि n-channel JFET कैसे बना होता है। इसका दिल है n-type semiconductor का एक अकेला bar (ऐसा silicon जिसे doped, यानी seasoned, किया गया है ताकि उसमें फ़ालतू electrons हों)। यह bar channel है, वह खुली नली जिससे current Source से Drain तक बहेगा।',
        'उस n-bar के दोनों किनारों में दो heavily-doped p-type regions embedded होती हैं। "p-type" का मतलब है वहाँ का silicon उल्टी तरह doped किया गया है ताकि उसमें फ़ालतू electrons के बजाय holes हों। ये दो p-regions gate हैं, और भीतर से आपस में जुड़ी होती हैं ताकि एक single gate terminal दोनों को एक साथ control करे।',
        'जहाँ भी कोई p-type region n-type channel को छूती है, वहाँ एक p-n junction बनता है (p और n material के बीच की सीमा, जो current के लिए एक one-way valve की तरह काम करती है)। चूँकि दो p-gates हैं, ऐसे दो junctions बनते हैं, channel के हर किनारे पर एक।',
        'Source, Drain, और Gate leads पर metal connections ohmic contacts के रूप में बनाए जाते हैं। "Ohmic" का बस मतलब है non-rectifying, यानी एक साधारण resistor की तरह बर्ताव, ताकि lead ख़ुद junction की तरह काम न करे; यह दोनों दिशाओं में बराबर current जाने देता है और कोई surprise नहीं जोड़ता।',
        'इन सबको जोड़ें तो तस्वीर सीधी है: carriers n-channel से सीधे Source से Drain तक बहते हैं, जबकि दोनों p-gates दोनों ओर बैठे channel को किनारों से दबाने को तैयार रहते हैं। वही दो gates garden hose के अंदर की दो cuffs हैं।',
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
        'Now we can explain the "field effect" itself, the trick that lets a voltage alone do the controlling. It starts with something that happens for free. Even with no voltage applied at all, a thin depletion region naturally forms at each of the two p-n junctions. A depletion region is a zone right at the junction that has been emptied of free carriers, so it cannot carry current; think of it as a small dead band along the edge of the channel.',
        'In normal operation we deliberately make this dead band controllable by reverse-biasing the gate. "Reverse bias" means we apply the voltage in the blocking direction of the junction; for an n-channel JFET that means making the gate negative compared to the source. The gate-to-source input is always kept strictly reverse-biased - we never let it go forward.',
        'Here is the beautiful part. A reverse-biased junction is a junction told NOT to conduct, so it carries essentially no current. Because the gate junctions are always reverse-biased, the gate current is practically zero, no matter how we use the voltage to control the channel.',
        'That near-zero gate current is the whole secret of the FET. Input resistance is just input voltage divided by input current, so when the input current is almost nothing, the input resistance becomes enormous - the near-infinite input impedance we keep praising.',
        'This is the foot-on-the-hose moment in physics form: we control the flow without drawing any water, that is, we steer the output without drawing any meaningful current from the input.',
      ],
      theoryHI: [
        'अब हम ख़ुद "field effect" समझा सकते हैं, वह तरकीब जो अकेले एक voltage को control करने देती है। इसकी शुरुआत एक ऐसी चीज़ से होती है जो मुफ़्त में होती है। बिल्कुल भी voltage न लगाने पर भी, दोनों p-n junctions में से हर एक पर एक पतली depletion region अपने आप बन जाती है। depletion region junction के ठीक पास का वह इलाक़ा है जो free carriers से ख़ाली हो चुका है, इसलिए वह current नहीं बहा सकता; इसे channel के किनारे की एक छोटी मरी हुई पट्टी समझिए।',
        'सामान्य operation में हम इस मरी हुई पट्टी को जानबूझकर controllable बनाते हैं, gate को reverse-bias करके। "Reverse bias" का मतलब है हम voltage को junction की रोकने वाली दिशा में लगाते हैं; n-channel JFET के लिए इसका मतलब है gate को source के मुक़ाबले negative बनाना। gate-to-source input को हमेशा सख़्ती से reverse-biased रखा जाता है - हम उसे कभी forward नहीं जाने देते।',
        'अब सबसे सुंदर हिस्सा। reverse-biased junction एक ऐसा junction है जिसे conduct NA करने को कहा गया है, इसलिए वह लगभग कोई current नहीं बहाता। चूँकि gate junctions हमेशा reverse-biased होते हैं, gate current practically zero रहता है, चाहे हम voltage से channel को जैसे भी control करें।',
        'वही near-zero gate current FET का पूरा राज़ है। input resistance बस input voltage बटा input current है, तो जब input current लगभग कुछ नहीं है, input resistance बहुत बड़ा हो जाता है - वही near-infinite input impedance जिसकी हम तारीफ़ करते रहते हैं।',
        'यही foot-on-the-hose पल है physics की शक्ल में: हम बिना पानी खींचे flow को control करते हैं, यानी input से कोई मतलब का current खींचे बिना output को steer करते हैं।',
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
        'We have the dead bands (the depletion regions) at the edges of the channel; now let us watch the gate voltage actually use them. When you apply the reverse-bias voltage, it creates an internal electric field stretching across each junction, and the strength of that field is set by how much voltage you apply.',
        'The size of the field decides the width of the depletion regions. The harder you reverse-bias the gate, the wider those dead bands grow. So gate voltage is really a width knob: turn it up, and the empty zones at the channel edges get thicker.',
        'Because the dead bands grow inward from both sides, they eat into the n-channel, leaving a narrower and narrower path in the middle for the current to flow through. This is the foot pressing on the hose: the opening shrinks. And when the open path narrows, the drain current (Id, the current flowing Source to Drain) is throttled down. The current was modulated by voltage alone, with no input current spent.',
        'You can picture the two ends of the range. At low reverse bias the dead bands are thin and the channel stays wide open, so a large Id flows. At high reverse bias the dead bands swell until they almost touch in the middle, choking the channel and squeezing Id down toward zero.',
        'In the lab below, drag the gate-voltage slider and watch this happen live: the cuffs swell inward, the channel pinches, and the displayed Id drops - all of it driven by voltage, none of it costing any input current.',
      ],
      theoryHI: [
        'channel के किनारों पर मरी हुई पट्टियाँ (depletion regions) हमारे पास हैं; अब देखें कि gate voltage असल में उन्हें कैसे इस्तेमाल करता है। जब आप reverse-bias voltage लगाते हैं, तो वह हर junction के पार फैला एक internal electric field बनाता है, और उस field की ताक़त इस पर निर्भर है कि आप कितना voltage लगाते हैं।',
        'field का आकार depletion regions की चौड़ाई तय करता है। आप gate को जितना ज़्यादा reverse-bias करते हैं, वे मरी हुई पट्टियाँ उतनी ही चौड़ी बढ़ती हैं। तो gate voltage असल में एक width knob है: इसे बढ़ाइए, और channel के किनारों के ख़ाली इलाक़े मोटे हो जाते हैं।',
        'चूँकि मरी हुई पट्टियाँ दोनों ओर से अंदर की तरफ़ बढ़ती हैं, वे n-channel को खाती जाती हैं, बीच में current के बहने के लिए और-और संकरा रास्ता छोड़ते हुए। यही hose पर पैर दबाना है: opening सिकुड़ता है। और जब खुला रास्ता संकरा होता है, drain current (Id, यानी Source से Drain बहने वाला current) throttle हो जाता है। current अकेले voltage से modulate हुआ, बिना कोई input current ख़र्च किए।',
        'आप range के दोनों सिरों की कल्पना कर सकते हैं। कम reverse bias पर मरी हुई पट्टियाँ पतली रहती हैं और channel चौड़ा खुला रहता है, तो बड़ा Id बहता है। high reverse bias पर वे पट्टियाँ तब तक फूलती हैं जब तक बीच में लगभग छू न जाएँ, channel को choke करते हुए और Id को zero की ओर दबाते हुए।',
        'नीचे lab में, gate-voltage slider खींचिए और इसे live होते देखिए: cuffs अंदर फूलती हैं, channel pinch होता है, और दिखाया गया Id गिरता है - सब कुछ voltage से चलता है, और इसमें कोई input current ख़र्च नहीं होता।',
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
        'We now turn the pinching story into an equation, and we only need two special points to anchor it. The first is the wide-open case. When the gate-source voltage Vgs is zero (the gate simply shorted to the source), the dead bands are at their thinnest, the channel is at its widest, and the drain current reaches its biggest value. We give this maximum current a name: Idss, the drain-to-source current with the gate shorted to the source.',
        'The second special point is the fully closed case. As you make Vgs more negative, the dead bands keep growing and Id keeps falling. At one particular negative voltage the bands meet in the middle and seal the channel completely, driving Id essentially to zero. That voltage is the pinch-off voltage, written Vp (also called Vgs(off)).',
        'Between these two anchors, the drain current follows a clean square-law curve discovered by Shockley: Id = Idss*(1 - Vgs/Vp)^2. It holds in the saturation (active) region, for gate voltages in the range Vp <= Vgs <= 0. You can sanity-check it at the anchors: at Vgs = 0 the bracket is 1 and Id = Idss, and at Vgs = Vp the bracket is 0 and Id = 0, exactly as the physics demanded.',
        'This behaviour has a name: depletion-mode operation. The device is normally ON at Vgs = 0 (it already conducts Idss with no help), and you turn it OFF by reverse-biasing the gate toward Vp. You cannot push it above Idss either, because driving the current higher would mean forward-biasing the gate, and that would let real current into the gate and destroy the very high input resistance that makes the FET worth using.',
        'The panel below walks the full derivation one step at a time, showing how the two boundary conditions (at Vgs = 0 and at Vgs = Vp) fix the constant and confirm that the curve really is a square law. The draggable transfer curve next to it lets you watch Id trace out the parabola as you move Vgs.',
      ],
      theoryHI: [
        'अब हम pinching की कहानी को एक equation में बदलते हैं, और इसे टिकाने के लिए हमें सिर्फ़ दो ख़ास points चाहिए। पहला है पूरी तरह खुला हुआ case। जब gate-source voltage Vgs zero हो (gate को बस source से short कर दिया गया हो), मरी हुई पट्टियाँ सबसे पतली होती हैं, channel सबसे चौड़ा होता है, और drain current अपने सबसे बड़े value तक पहुँचता है। इस maximum current को हम एक नाम देते हैं: Idss, यानी gate को source से short करने पर drain-to-source current।',
        'दूसरा ख़ास point पूरी तरह बंद हुआ case है। जैसे-जैसे आप Vgs को ज़्यादा negative करते हैं, मरी हुई पट्टियाँ बढ़ती रहती हैं और Id गिरता रहता है। किसी एक ख़ास negative voltage पर पट्टियाँ बीच में मिलकर channel को पूरी तरह बंद कर देती हैं, Id को लगभग zero कर देती हैं। वही voltage pinch-off voltage है, जिसे Vp लिखते हैं (इसे Vgs(off) भी कहते हैं)।',
        'इन दो anchors के बीच, drain current Shockley द्वारा खोजे गए एक साफ़ square-law curve का पालन करता है: Id = Idss*(1 - Vgs/Vp)^2. यह saturation (active) region में, Vp <= Vgs <= 0 की range वाले gate voltages के लिए लागू होता है। आप इसे anchors पर जाँच सकते हैं: Vgs = 0 पर bracket 1 है और Id = Idss, और Vgs = Vp पर bracket 0 है और Id = 0, ठीक वैसे ही जैसे physics ने माँगा था।',
        'इस बर्ताव का एक नाम है: depletion-mode operation। device Vgs = 0 पर normally ON रहता है (बिना किसी मदद के पहले से ही Idss conduct करता है), और आप gate को Vp की ओर reverse-bias करके इसे OFF करते हैं। आप इसे Idss से ऊपर भी नहीं ले जा सकते, क्योंकि current को और बढ़ाने का मतलब होगा gate को forward-bias करना, और वह gate में असली current घुसा देगा और उसी बहुत high input resistance को नष्ट कर देगा जो FET को क़ीमती बनाता है।',
        'नीचे का panel पूरी derivation को एक-एक step में चलाता है, दिखाते हुए कि कैसे दो boundary conditions (Vgs = 0 पर और Vgs = Vp पर) constant को तय करती हैं और पुष्टि करती हैं कि curve सचमुच एक square law है। उसके बग़ल का draggable transfer curve आपको Vgs घुमाते हुए Id को parabola खींचते देखने देता है।',
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
        'The Shockley equation tells us how much current flows for a given gate voltage, but to build an amplifier we care about something slightly different: how strongly the current RESPONDS when we wiggle the gate voltage a little. That responsiveness is called transconductance, written gm. By definition it is the slope of the transfer curve, gm = dId/dVgs, meaning the change in drain current per small change in gate voltage.',
        'We can get a formula for gm just by differentiating the Shockley equation, which the panel below does step by step. The result is gm = -2*Idss/Vp*(1 - Vgs/Vp). Notice it still depends on Vgs, which makes sense: the curve is a parabola, and a parabola is steeper in some places than others.',
        'The steepest place is where the channel is wide open, at Vgs = 0. There gm reaches its peak value, called gm0 = -2*Idss/Vp, which equals 2*Idss/|Vp| (the same number written with the magnitude of Vp, since Vp is negative for an n-channel device). As Vgs moves toward pinch-off the slope flattens, and gm falls all the way to zero at Vp.',
        'gm is measured in siemens, which is just amps per volt (here conveniently mA per volt). It is the FET\'s gain handle: it is literally the rule that turns a small input voltage into a controlled output current, which is the whole meaning of voltage control.',
        'Put the two ideas together and you see why the FET is special. It gives you a useful gm (real gain) while drawing almost no input current, so it makes an excellent high-input-impedance amplifier and an ideal building block inside integrated circuits, where it can read a signal strongly without ever loading it down.',
      ],
      theoryHI: [
        'Shockley equation हमें बताता है कि किसी gate voltage पर कितना current बहता है, पर amplifier बनाने के लिए हमें थोड़ी अलग चीज़ चाहिए: जब हम gate voltage को थोड़ा हिलाते हैं तो current कितनी ज़ोर से RESPOND करता है। उसी responsiveness को transconductance कहते हैं, जिसे gm लिखते हैं। परिभाषा से यह transfer curve की slope है, gm = dId/dVgs, यानी gate voltage के छोटे बदलाव पर drain current का बदलाव।',
        'हम gm का formula बस Shockley equation को differentiate करके पा सकते हैं, जो नीचे का panel step by step करता है। नतीजा है gm = -2*Idss/Vp*(1 - Vgs/Vp)। ध्यान दीजिए यह अब भी Vgs पर निर्भर है, जो ठीक है: curve एक parabola है, और parabola कहीं ज़्यादा खड़ी होती है कहीं कम।',
        'सबसे खड़ी जगह वहाँ है जहाँ channel पूरा खुला है, यानी Vgs = 0 पर। वहाँ gm अपने peak value तक पहुँचता है, जिसे gm0 = -2*Idss/Vp कहते हैं, जो 2*Idss/|Vp| के बराबर है (वही संख्या Vp के magnitude से लिखी हुई, क्योंकि n-channel device के लिए Vp negative है)। जैसे-जैसे Vgs pinch-off की ओर बढ़ता है slope सपाट होती जाती है, और gm Vp पर पूरी तरह zero तक गिर जाता है।',
        'gm को siemens में मापते हैं, जो बस amps per volt है (यहाँ सुविधा से mA per volt)। यह FET का gain handle है: यह सचमुच वह नियम है जो एक छोटे input voltage को एक controlled output current में बदलता है, और यही voltage control का पूरा मतलब है।',
        'दोनों विचारों को जोड़िए और आप देखेंगे कि FET ख़ास क्यों है। यह आपको एक काम का gm (असली gain) देता है जबकि लगभग कोई input current नहीं खींचता, इसलिए यह एक बेहतरीन high-input-impedance amplifier बनता है और integrated circuits के अंदर एक आदर्श building block, जहाँ यह किसी signal को बिना load किए ज़ोर से पढ़ सकता है।',
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
        'Let us step back and see how every piece fits into one design idea. A JFET controls its output by using a voltage (an electric field) to change the WIDTH of its channel on the fly. That single move completely replaces the BJT\'s way of working, which was to keep injecting a control current.',
        'Because the gate junctions are always reverse-biased, the gate draws essentially no input current, and that is what hands the JFET its standout feature: an input impedance of many megohms. Nothing is being stolen from the source, so the source hardly feels the FET is there.',
        'The conduction is also clean and simple. It is strictly unipolar, carried by one type of carrier flowing through a single uninterrupted channel, with no carrier ever having to cross a forward-biased junction the way a BJT requires. Fewer junctions in the active path means less noise and less fuss.',
        'Add it all up and you get a device that is low-noise, high-impedance, temperature-stable, and easy to pack into integrated circuits. That is why the FET wins the showdown in any situation where the cardinal rule is "do not load the input source."',
        'There is an honest trade-off, though. A single JFET usually has a lower gm than a single BJT, meaning a bit less raw gain per device. The JFET happily pays that price, because in exchange it gives you a vastly higher input resistance - and in most sensing and amplifier front-ends, not disturbing the signal matters far more than squeezing out the last bit of gain.',
      ],
      theoryHI: [
        'आइए एक क़दम पीछे हटें और देखें कि हर हिस्सा एक ही design idea में कैसे बैठता है। JFET अपने output को एक voltage (एक electric field) से control करता है जो उसके channel की WIDTH को तुरंत बदल देता है। यही एक चाल BJT के काम करने के तरीक़े को पूरी तरह बदल देती है, जो एक control current inject करते रहना था।',
        'चूँकि gate junctions हमेशा reverse-biased होते हैं, gate लगभग कोई input current नहीं खींचता, और यही JFET को उसकी ख़ास ख़ूबी देता है: कई megohm का input impedance। source से कुछ चुराया नहीं जाता, इसलिए source को मुश्किल से एहसास होता है कि FET वहाँ है।',
        'conduction भी साफ़ और सरल है। यह सख़्ती से unipolar है, एक तरह के carrier से जो एक अखंड channel से बहता है, और किसी carrier को कभी BJT की तरह किसी forward-biased junction को पार नहीं करना पड़ता। active रास्ते में कम junctions यानी कम noise और कम झंझट।',
        'सब जोड़ें तो आपको एक ऐसा device मिलता है जो low-noise, high-impedance, temperature-stable, और integrated circuits में आसानी से fit होने वाला है। यही वजह है कि FET हर उस स्थिति में showdown जीतता है जहाँ मुख्य नियम है "input source को load मत करो।"',
        'एक ईमानदार trade-off ज़रूर है। एक अकेले JFET का gm आमतौर पर एक अकेले BJT से कम होता है, यानी per device थोड़ा कम raw gain। JFET ख़ुशी से यह क़ीमत चुकाता है, क्योंकि बदले में यह आपको बहुत ज़्यादा input resistance देता है - और ज़्यादातर sensing और amplifier front-ends में, signal को न छेड़ना gain की आख़िरी बूँद निचोड़ने से कहीं ज़्यादा मायने रखता है।',
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
        'Here is the whole showdown on one page. It all began with a single split: the BJT is bipolar and current-controlled, the water wheel you must keep pushing, while the FET is unipolar and voltage-controlled, the hose you control with a foot. That one difference set up everything else.',
        'We then met the JFET as a three-terminal unipolar device: carriers enter at the Source, leave at the Drain, and the Gate controls them with a pure field. Inside, it is just one n-type bar for the channel and two p-type gates wired together, with a p-n junction where each gate meets the channel.',
        'The magic is the field effect. The gate-source junction is always reverse-biased, so the gate current is nearly zero, and that is exactly what gives the FET its near-infinite input impedance - it barely loads whatever drives it.',
        'Controlling the current then comes down to pinching the hose: turning up the reverse bias widens the depletion cuffs, narrows the channel, and throttles the drain current Id, all accomplished by voltage with no input current spent.',
        'The math captured this in two equations. The Shockley square law Id = Idss*(1 - Vgs/Vp)^2 gives the current (Idss when Vgs = 0, and zero when Vgs = Vp), and its slope gm = -2*Idss/Vp*(1 - Vgs/Vp) is the gain handle that turns input voltage into output current.',
        'The verdict: the JFET trades a little raw gain for an enormous input resistance, so it wins anywhere the rule is that you must not load the source. If you want to dig deeper, the sources below are where these results come from.',
      ],
      theoryHI: [
        'यह रहा पूरा showdown एक page पर। सब कुछ एक ही split से शुरू हुआ: BJT bipolar और current-controlled है, वह water wheel जिसे आपको धकेलते रहना है, जबकि FET unipolar और voltage-controlled है, वह hose जिसे आप पैर से control करते हैं। उसी एक फ़र्क़ ने बाक़ी सब तय कर दिया।',
        'फिर हम JFET से एक three-terminal unipolar device के रूप में मिले: carriers Source से घुसते हैं, Drain से निकलते हैं, और Gate उन्हें एक pure field से control करता है। अंदर, यह बस channel के लिए एक n-type bar और आपस में जुड़ी दो p-type gates है, हर gate के channel से मिलने पर एक p-n junction के साथ।',
        'जादू field effect है। gate-source junction हमेशा reverse-biased रहता है, तो gate current लगभग zero होता है, और यही FET को उसका near-infinite input impedance देता है - यह उसे चलाने वाले को मुश्किल से load करता है।',
        'फिर current को control करना hose को pinch करने पर आ जाता है: reverse bias बढ़ाने से depletion cuffs चौड़ी होती हैं, channel संकरा होता है, और drain current Id throttle हो जाता है, सब voltage से होते हुए बिना कोई input current ख़र्च किए।',
        'math ने इसे दो equations में पकड़ा। Shockley square law Id = Idss*(1 - Vgs/Vp)^2 current देता है (Vgs = 0 पर Idss, और Vgs = Vp पर zero), और उसकी slope gm = -2*Idss/Vp*(1 - Vgs/Vp) वह gain handle है जो input voltage को output current में बदलता है।',
        'फ़ैसला: JFET थोड़े raw gain के बदले बहुत बड़ा input resistance देता है, इसलिए यह हर जगह जीतता है जहाँ नियम है कि source को load नहीं करना। और गहराई में जाना हो, तो नीचे दिए sources वही जगह हैं जहाँ से ये नतीजे आते हैं।',
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
