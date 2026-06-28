import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/24 - Encoders ("The Voting Booth").
 * Source: dsd24.json (Encoders - The Voting Booth).
 * An encoder is the inverse of a decoder: 2^n one-hot input lines in, an n-bit
 * binary code out. Simple 4-to-2: Y0 = D1 + D3, Y1 = D2 + D3 (two OR gates).
 * It fails on multiple-active inputs (D1+D2 -> 11, a fabricated code) and on
 * zero inputs (00, ambiguous with D0). A PRIORITY encoder ranks the inputs
 * (D3 > D2 > D1 > D0): A1 = D3 + D2, A0 = D3 + D1.D2', and a VALID bit
 * V = D0 + D1 + D2 + D3 lights only on a real vote. All values computed in code.
 */
export const CONTENT = ({
  moduleTitle: 'Encoders - The Voting Booth',
  moduleSubtitle:
    "2^n inputs in, n-bit binary code out: the inverse of a decoder, and why priority plus a valid bit make it trustworthy.",
  scenes: [
    {
      id: 'S00_Cover',
      label: 'The Voting Booth',
      kind: 'cover',
      subtitle:
        'Many candidate switches, one pressed, and out comes its binary ID. That is an encoder - and a referee plus a valid lamp keep it honest.',
      theoryEN: [
        "This module builds the encoder, the combinational circuit that turns a wide one-hot signal into a short binary code. If a decoder is the circuit that takes a number and lights exactly one of many output lines, an encoder is the exact opposite: it takes one lit line and reports its number. It is data compression in hardware - 2^n input wires collapse into just n output bits.",
        "Hold one picture for the whole module: a VOTING BOOTH. There are 2^n candidate switches, one per candidate, and the rule is that exactly one switch should be pressed at a time. The machine does not announce a long list of who is who; it simply prints the binary number of whichever candidate was pressed. Press candidate D3 and out comes 11, press D1 and out comes 01.",
        "But real booths get jammed. If two switches are pressed at once, a naive encoder fabricates a wrong answer - a candidate nobody chose. The fix is a PRIORITY encoder: a referee that ranks the candidates and, on a double-press, declares the highest-ranked one the winner instead of producing garbage.",
        "There is one more trap. If nobody votes, the output is all zeros - which looks identical to the legitimate code for candidate 0. So we add a VALID bit V, a 'someone actually voted' lamp that lights only when at least one switch is down. Code 00 with V = 1 means D0 genuinely won; code 00 with V = 0 means no vote at all.",
        "By the end you will derive the simple 4-to-2 equations Y0 = D1 + D3 and Y1 = D2 + D3 from the truth table, see exactly why the simple encoder fails, and build the priority version A1 = D3 + D2, A0 = D3 + D1.D2' with its valid bit V = D0 + D1 + D2 + D3.",
      ],
      theoryHI: [
        "इस module में हम encoder बनाएँगे, वह combinational circuit जो एक चौड़े one-hot signal को एक छोटे binary code में बदलती है। अगर decoder वह circuit है जो एक number लेकर कई output lines में से ठीक एक को जलाती है, तो encoder बिलकुल उल्टा है: यह एक जली हुई line लेकर उसका number बताती है। यह hardware में data compression है - 2^n input wires सिमटकर सिर्फ़ n output bits बन जाते हैं।",
        "पूरे module के लिए एक तस्वीर पकड़े रखिए: एक VOTING BOOTH। यहाँ 2^n candidate switches हैं, हर candidate के लिए एक, और नियम है कि एक बार में ठीक एक switch दबना चाहिए। machine कौन-कौन है इसकी लंबी सूची नहीं बताती; वह बस जिस candidate को दबाया गया उसका binary number छाप देती है। candidate D3 दबाइए तो आता है 11, D1 दबाइए तो आता है 01।",
        "पर असली booths jam हो जाते हैं। अगर दो switches एक साथ दब जाएँ, तो एक भोली encoder एक ग़लत जवाब गढ़ देती है - एक ऐसा candidate जिसे किसी ने नहीं चुना। इसका इलाज है एक PRIORITY encoder: एक referee जो candidates को rank देता है और double-press पर सबसे ऊँचे rank वाले को विजेता घोषित करता है, garbage बनाने के बजाय।",
        "एक और जाल है। अगर कोई vote न दे, तो output सब शून्य होता है - जो candidate 0 के वैध code जैसा ही दिखता है। तो हम एक VALID bit V जोड़ते हैं, एक 'किसी ने सचमुच vote दिया' lamp जो तभी जलता है जब कम से कम एक switch दबा हो। code 00 के साथ V = 1 मतलब D0 सचमुच जीता; code 00 के साथ V = 0 मतलब कोई vote ही नहीं।",
        "अंत तक आप truth table से सादे 4-to-2 equations Y0 = D1 + D3 और Y1 = D2 + D3 निकाल पाएँगे, ठीक देखेंगे कि सादी encoder क्यों fail होती है, और priority version A1 = D3 + D2, A0 = D3 + D1.D2' अपने valid bit V = D0 + D1 + D2 + D3 के साथ बनाएँगे।",
      ],
      transcriptEN:
        'Welcome to the voting booth. Picture a wall of candidate switches, one per candidate, and the rule that exactly one should be pressed. An encoder is the machine that reads which switch is down and prints its binary ID - press candidate three and out comes one-one, press candidate one and out comes zero-one. That is the inverse of a decoder, and it is data compression: two-to-the-n input wires squeeze into just n output bits. But booths jam. Press two switches at once and a naive encoder fabricates a code nobody chose, so we add a referee - a priority encoder that ranks the candidates and declares the highest one the winner. And if nobody votes, all-zeros looks just like candidate zero, so we add a valid bit, a someone-actually-voted lamp. By the end you will derive the simple equations, see why they fail, and build the priority encoder with its valid bit.',
      transcriptHI:
        'Voting booth में आपका स्वागत है। candidate switches की एक दीवार सोचिए, हर candidate के लिए एक, और नियम कि ठीक एक दबना चाहिए। encoder वह machine है जो पढ़ती है कौन सा switch दबा है और उसका binary ID छापती है - candidate three दबाइए तो one-one आता है, candidate one दबाइए तो zero-one। यह decoder का उल्टा है, और यह data compression है: two-to-the-n input wires सिमटकर सिर्फ़ n output bits बनते हैं। पर booths jam होते हैं। दो switches एक साथ दबाइए और एक भोली encoder एक ऐसा code गढ़ देती है जिसे किसी ने नहीं चुना, तो हम एक referee जोड़ते हैं - एक priority encoder जो candidates को rank देता है और सबसे ऊँचे को विजेता घोषित करता है। और अगर कोई vote न दे, तो all-zeros candidate zero जैसा दिखता है, तो हम एक valid bit जोड़ते हैं, एक किसी-ने-सचमुच-vote-दिया lamp। अंत तक आप सादे equations निकालेंगे, देखेंगे वे क्यों fail होते हैं, और priority encoder अपने valid bit के साथ बनाएँगे।',
      visualNote:
        'Hero: a stack of candidate switches D0..D3 feeding a translucent encoder cube; the live 4-to-2 priority EncoderViz with a green valid lamp.',
    },
    {
      id: 'S01_Video',
      label: 'Encoders - The Voting Booth',
      kind: 'video',
      subtitle: 'A short film: from a wall of one-hot lines to a compact binary ID.',
      theoryEN: [
        "Here is the whole idea in one breath before you watch. An encoder takes 2^n input lines and outputs the n-bit binary index of whichever line is active. It is literally the inverse of a decoder: a decoder turns a number into one lit line, an encoder turns one lit line back into the number. Think of a funnel - many parallel streams enter on the left, one clean binary code flows out on the right.",
        "The simplest version assumes exactly one input is high at a time, the one-hot assumption, like only one candidate switch pressed in the booth. Under that assumption each output bit is just an OR of the inputs whose binary index has that bit set. For a 4-to-2 encoder that gives two tiny equations and two OR gates - nothing more.",
        "The catch the video dwells on is what happens when the booth misbehaves. Press two switches and the OR logic bit-wise combines their codes into a third, wrong code - a candidate nobody pressed. Press nothing and the output is all zeros, indistinguishable from candidate 0. These are the two fatal flaws the rest of the module fixes.",
        "The repair is two ideas working together: a PRIORITY rule that resolves a jam to the highest-ranked active input, and a VALID bit that is 1 only when at least one input is active. Together they turn a fragile OR-of-inputs into a trustworthy circuit fit for keypads, interrupt controllers and address generators.",
        "Keep one running example in mind the whole time: in the priority encoder with D3 highest, drive D1 and D2 both high. A simple encoder would spark garbage, but the priority encoder cleanly reports D2's index, 10, and ignores the lower D1. That is the referee doing its job.",
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार एक साँस में। एक encoder 2^n input lines लेती है और जो line active हो उसका n-bit binary index output करती है। यह सचमुच decoder का उल्टा है: decoder एक number को एक जली line में बदलता है, encoder एक जली line को वापस number में बदलती है। एक funnel सोचिए - कई parallel streams बाएँ से अंदर आती हैं, एक साफ़ binary code दाएँ से बाहर बहती है।",
        "सबसे सादा version मानता है कि एक बार में ठीक एक input high है, यह one-hot assumption है, जैसे booth में सिर्फ़ एक candidate switch दबा हो। उस assumption के तहत हर output bit बस उन inputs का OR है जिनके binary index में वह bit set है। एक 4-to-2 encoder के लिए यह दो नन्हे equations और दो OR gates देता है - इससे ज़्यादा कुछ नहीं।",
        "जिस पेच पर video टिकता है वह यह है कि जब booth बिगड़ता है तब क्या होता है। दो switches दबाइए और OR logic उनके codes को bit-wise मिलाकर एक तीसरा, ग़लत code बना देती है - एक candidate जिसे किसी ने नहीं दबाया। कुछ न दबाइए और output सब शून्य होता है, candidate 0 से अलग नहीं पहचाना जा सकता। ये वही दो fatal flaws हैं जिन्हें बाक़ी module ठीक करता है।",
        "इलाज दो विचार साथ काम करते हैं: एक PRIORITY नियम जो jam को सबसे ऊँचे rank वाले active input तक हल कर देता है, और एक VALID bit जो तभी 1 है जब कम से कम एक input active हो। साथ मिलकर वे एक नाज़ुक OR-of-inputs को एक भरोसेमंद circuit बना देते हैं जो keypads, interrupt controllers और address generators के लायक है।",
        "पूरे समय एक उदाहरण मन में रखिए: D3 सबसे ऊँचे वाली priority encoder में, D1 और D2 दोनों high कीजिए। एक सादी encoder garbage spark करती, पर priority encoder साफ़-साफ़ D2 का index, 10, बताती है और नीचे वाले D1 को नज़रअंदाज़ कर देती है। यही referee अपना काम कर रहा है।",
      ],
      transcriptEN:
        "Here is the whole idea in one breath. An encoder takes two-to-the-n input lines and outputs the n-bit binary index of whichever line is active. It is the inverse of a decoder - a decoder turns a number into one lit line, an encoder turns one lit line back into the number, like a funnel squeezing many streams into one code. The simplest version assumes exactly one input is high, the one-hot assumption, and then each output bit is just an OR of the inputs whose index has that bit set. But press two switches and the OR logic fabricates a third wrong code; press nothing and all-zeros looks just like candidate zero. The fix is a priority rule that resolves a jam to the highest active input, plus a valid bit that is one only when at least one input is active. Run this example: drive D1 and D2 both high in a priority encoder with D3 highest, and it cleanly reports D2's index, one-zero, ignoring the lower D1. That is the referee doing its job.",
      transcriptHI:
        "पूरा विचार एक साँस में। एक encoder two-to-the-n input lines लेती है और जो line active हो उसका n-bit binary index output करती है। यह decoder का उल्टा है - decoder एक number को एक जली line में बदलता है, encoder एक जली line को वापस number में बदलती है, एक funnel की तरह जो कई streams को एक code में सिकोड़ देता है। सबसे सादा version मानता है कि ठीक एक input high है, one-hot assumption, और फिर हर output bit बस उन inputs का OR है जिनके index में वह bit set है। पर दो switches दबाइए और OR logic एक तीसरा ग़लत code गढ़ देती है; कुछ न दबाइए और all-zeros candidate zero जैसा दिखता है। इलाज है एक priority नियम जो jam को सबसे ऊँचे active input तक हल करता है, साथ में एक valid bit जो तभी one है जब कम से कम एक input active हो। यह उदाहरण चलाइए: D3 सबसे ऊँचे वाली priority encoder में D1 और D2 दोनों high कीजिए, और वह साफ़-साफ़ D2 का index, one-zero, बताती है, नीचे वाले D1 को छोड़कर। यही referee अपना काम कर रहा है।",
      visualNote:
        'Animated explainer: a wall of one-hot lines funnelling into an encoder; a double-press sparking garbage in simple mode, resolved cleanly in priority mode; the valid lamp toggling on a real vote.',
    },
    {
      id: 'S02_Inverse',
      label: 'What An Encoder Does',
      kind: 'theory',
      subtitle: 'The inverse of a decoder: 2^n one-hot lines in, n binary bits out.',
      theoryEN: [
        "Let us pin down exactly what an encoder is. It is a combinational block that takes 2^n input lines and produces n output lines, and those n outputs are simply the binary index of whichever input line is currently active. With n = 2 you have 4 input lines (D0, D1, D2, D3) and 2 output bits. The sizing rule is just inputs = 2^n, outputs = n - the same powers-of-two relationship you met with decoders, run backwards.",
        "That 'run backwards' is the whole point: an encoder is the exact inverse of a decoder. A decoder is the ballot printer - feed it the number 2 and it lights output line D2 and nothing else. An encoder is the vote reader - light line D2 and it hands you back the number 10 (binary 2). Chain a decoder into an encoder and you get your original number out the far end; they undo each other.",
        "For the simple encoder we make one firm assumption: at any moment exactly ONE input line is active. That is the one-hot assumption, and it matches the booth's rule that only one candidate switch is pressed at a time. Everything in this first half of the module rides on that assumption; the second half is all about what to do when the booth breaks it.",
        "The reason this circuit is worth building is compression. A one-hot signal is wasteful - 2^n wires carrying just one piece of information (which line is hot). The encoder funnels that wide, sparse signal down into a compact n-bit address. Picture a funnel: many parallel streams enter on the left, and one clean binary code flows out on the right. That is why encoders show up wherever many possibilities must be named by a short number - keypad scanning, interrupt IDs, and address generation.",
      ],
      theoryHI: [
        "चलिए ठीक-ठीक तय करें कि encoder है क्या। यह एक combinational block है जो 2^n input lines लेता है और n output lines बनाता है, और वे n outputs बस उस input line का binary index हैं जो इस समय active है। n = 2 के साथ आपके पास 4 input lines (D0, D1, D2, D3) और 2 output bits हैं। sizing नियम बस है inputs = 2^n, outputs = n - वही powers-of-two रिश्ता जो आपने decoders के साथ देखा, उल्टा चलाया हुआ।",
        "वही 'उल्टा चलाना' पूरी बात है: encoder decoder का बिलकुल उल्टा है। decoder ballot printer है - इसे number 2 दीजिए और यह output line D2 जलाता है और कुछ नहीं। encoder vote reader है - line D2 जलाइए और यह आपको number 10 (binary 2) वापस देती है। एक decoder को encoder में chain कीजिए और आपको दूसरे छोर पर आपका मूल number मिलता है; ये एक-दूसरे को रद्द कर देते हैं।",
        "सादी encoder के लिए हम एक पक्की assumption करते हैं: किसी भी पल ठीक एक input line active है। यह one-hot assumption है, और यह booth के नियम से मेल खाती है कि एक बार में सिर्फ़ एक candidate switch दबा हो। module के इस पहले आधे में सब कुछ उस assumption पर टिका है; दूसरा आधा पूरी तरह इस बारे में है कि जब booth इसे तोड़ दे तो क्या करें।",
        "यह circuit बनाने लायक होने की वजह compression है। एक one-hot signal बेकार है - 2^n wires बस एक जानकारी ढो रही हैं (कौन सी line hot है)। encoder उस चौड़े, बिखरे signal को एक compact n-bit address में सिकोड़ देती है। एक funnel सोचिए: कई parallel streams बाएँ से अंदर आती हैं, और एक साफ़ binary code दाएँ से बाहर बहती है। इसीलिए encoders वहाँ दिखती हैं जहाँ कई संभावनाओं को एक छोटे number से नाम देना हो - keypad scanning, interrupt IDs, और address generation।",
      ],
      transcriptEN:
        "What exactly is an encoder? It is a block that takes two-to-the-n input lines and produces n output lines, and those n outputs are simply the binary index of whichever input is active. With n equals two you have four inputs and two output bits; the rule is inputs equals two-to-the-n, outputs equals n - the decoder relationship run backwards. And that is the point: an encoder is the exact inverse of a decoder. A decoder is the ballot printer - feed it two and it lights line D2. An encoder is the vote reader - light D2 and it hands back the number two. For the simple encoder we assume exactly one input is active at a time, the one-hot assumption, matching the booth's rule. Why bother? Compression. A one-hot signal wastes two-to-the-n wires to carry one fact; the encoder funnels it into a compact n-bit address, which is why encoders appear in keypads, interrupt controllers, and address generators.",
      transcriptHI:
        "encoder है क्या? यह एक block है जो two-to-the-n input lines लेता है और n output lines बनाता है, और वे n outputs बस उस input का binary index हैं जो active है। n बराबर two के साथ आपके पास चार inputs और दो output bits हैं; नियम है inputs बराबर two-to-the-n, outputs बराबर n - decoder का रिश्ता उल्टा चलाया हुआ। और यही बात है: encoder decoder का बिलकुल उल्टा है। decoder ballot printer है - इसे two दीजिए और यह line D2 जलाता है। encoder vote reader है - D2 जलाइए और यह number two वापस देती है। सादी encoder के लिए हम मानते हैं कि एक बार में ठीक एक input active है, one-hot assumption, booth के नियम से मेल खाती। क्यों? compression। एक one-hot signal एक fact ढोने के लिए two-to-the-n wires बर्बाद करता है; encoder उसे एक compact n-bit address में सिकोड़ देती है, इसीलिए encoders keypads, interrupt controllers, और address generators में दिखती हैं।",
      visualNote:
        'A funnel block: 2^n input lines on the left fanning into a funnel, a single n-bit binary bus exiting on the right, labelled "inverse of a decoder". The live EncoderViz below.',
    },
    {
      id: 'S03_Booth',
      label: 'The Voting Booth Mapping',
      kind: 'theory',
      subtitle: 'Four candidates, one winner: pressing Di routes its index out as two bits.',
      theoryEN: [
        "Now make the analogy concrete with a 4-to-2 encoder. Wire four candidates D0, D1, D2, D3 to the four input lines - 'four candidates, one winner'. The output is two bits, Y1 Y0, and all the encoder ever does is print the index of the candidate who was pressed, in binary.",
        "The mapping could not be simpler because the code IS the candidate's number. Press D0 and the receipt reads 00; press D1 and it reads 01; press D2 and it reads 10; press D3 and it reads 11. That is just 0, 1, 2, 3 written in two-bit binary - the index of the active line and nothing more.",
        "So the encoder's entire behaviour is 'which input number is currently active?'. There is no arithmetic, no decoding of meaning - it is a pure lookup from a one-hot position to its address. The booth does not care who the candidates are; it only reports the seat number of the one switch that is down.",
        "This is exactly why encoders are everywhere in real systems. A keypad has many keys but you want a short code for which key was pressed - that is an encoder. An interrupt controller has many devices but the CPU wants a short ID for which device interrupted - that is a priority encoder. Address generation, register selection, and one-hot-to-binary conversion are all the same job: turn a wall of named buttons into one short number.",
      ],
      theoryHI: [
        "अब analogy को एक 4-to-2 encoder से ठोस बनाइए। चार candidates D0, D1, D2, D3 को चार input lines से wire कीजिए - 'चार candidates, एक winner'। output दो bits है, Y1 Y0, और encoder जो कुछ करती है वह बस उस candidate का index binary में छापना है जिसे दबाया गया।",
        "mapping इससे सरल हो ही नहीं सकती क्योंकि code ही candidate का number है। D0 दबाइए और receipt पढ़ती है 00; D1 दबाइए और पढ़ती है 01; D2 दबाइए और पढ़ती है 10; D3 दबाइए और पढ़ती है 11। यह बस 0, 1, 2, 3 दो-bit binary में लिखे हुए हैं - active line का index और कुछ नहीं।",
        "तो encoder का पूरा व्यवहार है 'इस समय कौन सा input number active है?'। कोई arithmetic नहीं, मतलब का कोई decoding नहीं - यह एक one-hot position से उसके address तक का शुद्ध lookup है। booth को परवाह नहीं कि candidates कौन हैं; वह बस उस एक switch का seat number बताता है जो दबा है।",
        "यही वजह है कि encoders असली systems में हर जगह हैं। एक keypad में कई keys हैं पर आपको एक छोटा code चाहिए कि कौन सी key दबी - वह encoder है। एक interrupt controller में कई devices हैं पर CPU को एक छोटा ID चाहिए कि किस device ने interrupt किया - वह priority encoder है। address generation, register selection, और one-hot-to-binary conversion सब वही काम हैं: नामों वाले buttons की एक दीवार को एक छोटे number में बदलना।",
      ],
      transcriptEN:
        "Make it concrete with a four-to-two encoder. Wire four candidates, D0 through D3, to the four inputs - four candidates, one winner. The output is two bits, Y1 Y0, and all the encoder ever does is print the index of the candidate pressed, in binary. The mapping is trivial because the code is the candidate's number: D0 gives zero-zero, D1 gives zero-one, D2 gives one-zero, D3 gives one-one - just zero, one, two, three in two-bit binary. So its whole job is which input number is active, a pure lookup from a one-hot position to its address. That is why encoders are everywhere: keypads needing a short key code, interrupt controllers needing a short device ID, address generation - all the same job of turning a wall of named buttons into one short number.",
      transcriptHI:
        "इसे एक four-to-two encoder से ठोस बनाइए। चार candidates, D0 से D3, को चार inputs से wire कीजिए - चार candidates, एक winner। output दो bits है, Y1 Y0, और encoder बस उस candidate का index binary में छापती है जिसे दबाया गया। mapping मामूली है क्योंकि code ही candidate का number है: D0 देता है zero-zero, D1 देता है zero-one, D2 देता है one-zero, D3 देता है one-one - बस zero, one, two, three दो-bit binary में। तो इसका पूरा काम है कौन सा input number active है, एक one-hot position से उसके address तक का शुद्ध lookup। इसीलिए encoders हर जगह हैं: keypads को एक छोटा key code चाहिए, interrupt controllers को एक छोटा device ID चाहिए, address generation - सब वही काम, नामों वाले buttons की दीवार को एक छोटे number में बदलना।",
      visualNote:
        'Voting-booth figure: stacked buttons D0..D3 feeding a translucent encoder cube, with the four output codes 00, 01, 10, 11 shown on the right. Live EncoderViz.',
    },
    {
      id: 'S04_Core',
      label: '4-to-2 Logic Core',
      kind: 'theory',
      subtitle: "Deriving Y0 = D1 + D3 and Y1 = D2 + D3 - two OR gates, and D0 needs no gate.",
      theoryEN: [
        "Time to derive the gates. Write the one-hot truth table for the simple 4-to-2 encoder: D0 active gives output 00, D1 gives 01, D2 gives 10, D3 gives 11. To find each output bit's equation, read down its column and ask 'which inputs make this bit a 1?'",
        "Start with Y0, the low bit. Scanning the codes, Y0 is 1 for code 01 (that is D1) and for code 11 (that is D3). Those are the only two rows where the low bit is set, so Y0 = D1 + D3 - a single 2-input OR gate. The plus is OR; whenever D1 or D3 is high, Y0 goes high.",
        "Now Y1, the high bit. Y1 is 1 for code 10 (that is D2) and code 11 (that is D3). So Y1 = D2 + D3 - a second 2-input OR gate. The pattern is beautifully regular: each output bit is just an OR of the inputs whose binary index has that bit set. Bit 0 is set in indices 1 and 3; bit 1 is set in indices 2 and 3.",
        "And here is the quiet detail that becomes the whole problem later: D0 appears in NEITHER equation. Its index is 0, binary 00, the all-zeros codeword, so it does not need to drive any gate - when D0 is the active line, both outputs are simply 0 because no gate is pulling them high. The complete simple 4-to-2 encoder is therefore just two OR gates, and D0 is wired to nothing.",
        "Toggle the live encoder below and watch the two OR gates compute. Press one input at a time (the one-hot case) and confirm the code matches the candidate's index every time. This is the gate-level build the rest of the module sharpens into a priority encoder.",
      ],
      theoryHI: [
        "अब gates निकालने का समय। सादी 4-to-2 encoder के लिए one-hot truth table लिखिए: D0 active देता है output 00, D1 देता है 01, D2 देता है 10, D3 देता है 11। हर output bit का equation ढूँढने के लिए उसके column को नीचे पढ़िए और पूछिए 'कौन से inputs इस bit को 1 बनाते हैं?'",
        "Y0 से शुरू कीजिए, low bit। codes देखते हुए, Y0 1 है code 01 के लिए (वह D1 है) और code 11 के लिए (वह D3 है)। यही दो rows हैं जहाँ low bit set है, तो Y0 = D1 + D3 - एक अकेला 2-input OR gate। plus का मतलब OR है; जब भी D1 या D3 high हो, Y0 high हो जाता है।",
        "अब Y1, high bit। Y1 1 है code 10 के लिए (वह D2 है) और code 11 के लिए (वह D3 है)। तो Y1 = D2 + D3 - एक दूसरा 2-input OR gate। pattern बहुत सुंदर और नियमित है: हर output bit बस उन inputs का OR है जिनके binary index में वह bit set है। bit 0 indices 1 और 3 में set है; bit 1 indices 2 और 3 में set है।",
        "और यहाँ वह चुपचाप वाली बात है जो आगे चलकर पूरी समस्या बन जाती है: D0 किसी भी equation में नहीं दिखता। इसका index 0 है, binary 00, all-zeros codeword, तो इसे किसी gate को चलाने की ज़रूरत नहीं - जब D0 active line हो, दोनों outputs बस 0 होते हैं क्योंकि कोई gate उन्हें high नहीं खींच रहा। तो पूरी सादी 4-to-2 encoder बस दो OR gates है, और D0 किसी चीज़ से wire नहीं।",
        "नीचे live encoder toggle कीजिए और दो OR gates को compute करते देखिए। एक बार में एक input दबाइए (one-hot case) और हर बार पुष्टि कीजिए कि code candidate के index से मेल खाता है। यही gate-level build है जिसे बाक़ी module एक priority encoder में तेज़ करता है।",
      ],
      transcriptEN:
        "Time to derive the gates. Write the one-hot truth table: D0 gives zero-zero, D1 gives zero-one, D2 gives one-zero, D3 gives one-one. For each output bit, ask which inputs make it a one. Y0, the low bit, is one for code zero-one which is D1, and code one-one which is D3, so Y0 equals D1 OR D3 - one two-input OR gate. Y1, the high bit, is one for code one-zero which is D2, and one-one which is D3, so Y1 equals D2 OR D3 - a second OR gate. Each output is just an OR of the inputs whose index has that bit set. And the quiet detail: D0 appears in neither equation, because its index is the all-zeros codeword - it drives no gate at all. So the simple four-to-two encoder is just two OR gates, with D0 wired to nothing.",
      transcriptHI:
        "अब gates निकालने का समय। one-hot truth table लिखिए: D0 देता है zero-zero, D1 देता है zero-one, D2 देता है one-zero, D3 देता है one-one। हर output bit के लिए पूछिए कौन से inputs इसे one बनाते हैं। Y0, low bit, one है code zero-one के लिए जो D1 है, और code one-one के लिए जो D3 है, तो Y0 बराबर D1 OR D3 - एक two-input OR gate। Y1, high bit, one है code one-zero के लिए जो D2 है, और one-one के लिए जो D3 है, तो Y1 बराबर D2 OR D3 - एक दूसरा OR gate। हर output बस उन inputs का OR है जिनके index में वह bit set है। और चुपचाप वाली बात: D0 किसी equation में नहीं दिखता, क्योंकि इसका index all-zeros codeword है - यह किसी gate को नहीं चलाता। तो सादी four-to-two encoder बस दो OR gates है, D0 किसी चीज़ से wire नहीं।",
      visualNote:
        'Gate schematic: two OR gates. OR1 inputs D1, D3 -> Y0. OR2 inputs D2, D3 -> Y1. D0 left unconnected, annotated "contributes 00". A live truth table and two LiveGate OR gates computing Y0 and Y1.',
    },
    {
      id: 'S05_Flaws',
      label: 'The Two Fatal Flaws',
      kind: 'theory',
      subtitle: 'Double-press fabricates a wrong code; zero-press is ambiguous with D0.',
      theoryEN: [
        "The simple encoder is elegant, but it only works while the one-hot promise holds. Break that promise and it betrays you in two distinct ways. Both flaws come straight from the fact that the outputs are just ORs of inputs, with no logic policing how many inputs are active.",
        "Flaw one is the multiple-active case. Drive D1 and D2 both high at once. Y0 = D1 + D3 sees D1 = 1, so Y0 = 1. Y1 = D2 + D3 sees D2 = 1, so Y1 = 1. The output is 11 - the code for candidate D3 - even though D3 is completely low and nobody pressed it. The OR logic has bit-wise merged the two real codes (01 OR 10 = 11) and fabricated a third candidate out of thin air.",
        "That is genuinely dangerous: on any double-press the simple encoder does not error out or stall, it silently announces a wrong winner. In the booth it is as if jamming two switches elected a candidate neither voter chose.",
        "Flaw two is the zero-active case. Press nothing, so D0 = D1 = D2 = D3 = 0. Both ORs see all-zero inputs, so the output is 00. But 00 is also the legitimate code for candidate D0 winning. The bus simply cannot tell 'D0 is the active line' apart from 'no line is active at all'. A silent booth looks identical to a vote for candidate 0.",
        "So the simple encoder is only correct for genuinely one-hot inputs. Multiple-active yields a fabricated index; zero-active is ambiguous with D0. The cure is two ideas at once: impose a PRIORITY rule so a jam resolves to a single defined index, and add a VALID bit so an empty booth is never mistaken for a vote. Force two inputs high in the demo below and watch the output lie - then we fix it.",
      ],
      theoryHI: [
        "सादी encoder सुंदर है, पर यह सिर्फ़ तभी काम करती है जब one-hot वादा बना रहे। उस वादे को तोड़िए और यह दो अलग तरीक़ों से धोखा देती है। दोनों flaws सीधे इस बात से आते हैं कि outputs बस inputs के ORs हैं, बिना किसी logic के जो जाँचे कि कितने inputs active हैं।",
        "पहला flaw multiple-active case है। D1 और D2 दोनों एक साथ high कीजिए। Y0 = D1 + D3 को D1 = 1 दिखता है, तो Y0 = 1। Y1 = D2 + D3 को D2 = 1 दिखता है, तो Y1 = 1। output है 11 - candidate D3 का code - जबकि D3 बिलकुल low है और किसी ने इसे नहीं दबाया। OR logic ने दो असली codes को bit-wise मिला दिया (01 OR 10 = 11) और हवा से एक तीसरा candidate गढ़ दिया।",
        "यह सचमुच ख़तरनाक है: किसी भी double-press पर सादी encoder error नहीं देती या रुकती नहीं, वह चुपचाप एक ग़लत winner घोषित कर देती है। booth में यह ऐसा है जैसे दो switches jam करने से एक ऐसा candidate चुन लिया गया जिसे किसी voter ने नहीं चुना।",
        "दूसरा flaw zero-active case है। कुछ न दबाइए, तो D0 = D1 = D2 = D3 = 0। दोनों ORs को सब-शून्य inputs दिखते हैं, तो output है 00। पर 00 candidate D0 के जीतने का वैध code भी है। bus बस नहीं बता सकता कि 'D0 active line है' और 'कोई line active ही नहीं' में फ़र्क़ क्या है। एक ख़ामोश booth candidate 0 के vote जैसा ही दिखता है।",
        "तो सादी encoder सिर्फ़ सचमुच one-hot inputs के लिए सही है। multiple-active एक गढ़ा हुआ index देता है; zero-active D0 से अस्पष्ट है। इलाज दो विचार एक साथ हैं: एक PRIORITY नियम लगाइए ताकि jam एक तय index तक हल हो, और एक VALID bit जोड़िए ताकि खाली booth कभी vote न समझा जाए। नीचे demo में दो inputs high कीजिए और output को झूठ बोलते देखिए - फिर हम इसे ठीक करते हैं।",
      ],
      transcriptEN:
        "The simple encoder only works while the one-hot promise holds. Break it and it betrays you twice. Flaw one, multiple active: drive D1 and D2 both high. Y0 equals D1 OR D3 sees D1, so it is one; Y1 equals D2 OR D3 sees D2, so it is one; the output is one-one, the code for D3 - a candidate nobody pressed. The OR logic merged the two codes, zero-one OR one-zero equals one-one, fabricating a third candidate. On any double-press it silently announces a wrong winner. Flaw two, zero active: press nothing, all inputs zero, output is zero-zero - but that is also the legitimate code for D0 winning. The bus cannot tell D0 active from nothing active. So the simple encoder is correct only for true one-hot inputs. The cure is a priority rule that resolves a jam to one defined index, plus a valid bit so an empty booth is never mistaken for a vote.",
      transcriptHI:
        "सादी encoder सिर्फ़ तभी काम करती है जब one-hot वादा बना रहे। इसे तोड़िए और यह दो बार धोखा देती है। पहला flaw, multiple active: D1 और D2 दोनों high कीजिए। Y0 बराबर D1 OR D3 को D1 दिखता है, तो वह one है; Y1 बराबर D2 OR D3 को D2 दिखता है, तो वह one है; output है one-one, D3 का code - एक candidate जिसे किसी ने नहीं दबाया। OR logic ने दो codes को मिला दिया, zero-one OR one-zero बराबर one-one, एक तीसरा candidate गढ़ते हुए। किसी भी double-press पर यह चुपचाप एक ग़लत winner घोषित कर देती है। दूसरा flaw, zero active: कुछ न दबाइए, सब inputs zero, output है zero-zero - पर वह D0 के जीतने का वैध code भी है। bus D0 active को कुछ-नहीं-active से अलग नहीं बता सकता। तो सादी encoder सिर्फ़ सच्चे one-hot inputs के लिए सही है। इलाज है एक priority नियम जो jam को एक तय index तक हल करता है, साथ में एक valid bit ताकि खाली booth कभी vote न समझा जाए।",
      visualNote:
        'Collision figure: D1 and D2 crashing into a red spark labelled "multiple active = garbage = 11", beside a note "all-zero output = 00 looks like D0". Live EncoderViz to force the failure.',
    },
    {
      id: 'S06_Priority',
      label: 'Priority Encoders',
      kind: 'theory',
      subtitle: "The referee: A1 = D3 + D2, A0 = D3 + D1.D2'. On a jam, the highest input wins.",
      theoryEN: [
        "The priority encoder is the referee that resolves a jam. The idea is to assign every input a RANK, and on any collision the highest rank wins, so the output is never a fabricated value - it is always the index of a genuinely active line, just the most senior one. Our convention here is D3 is highest priority, then D2, then D1, and D0 lowest.",
        "Stated in words, the rule is: report the index of the highest-numbered active input, and ignore every lower one. If D3 and D1 are both high, the answer is 11 (D3's index), because D3 outranks D1. If D2 and D1 are both high, the answer is 10 (D2's index). The lower inputs are masked the moment a higher one is active.",
        "Now turn that rule into equations. Take the high bit first. Y1 should be 1 exactly when the winner is D3 or D2, because those are the two indices (11 and 10) whose high bit is set. Since 'winner is D3 or D2' is just 'D3 is active OR D2 is active' (D3 already outranks anything below), we get the clean Y1 = D3 + D2.",
        "The low bit is the subtle one. Y0 should be 1 when the winner's index has its low bit set - that is indices 11 (D3) and 01 (D1). D3 always sets Y0. But D1 may only set Y0 when no higher-priority input has taken over - specifically when the senior D2 is inactive, written D2'. (D3 being active is already handled by the first term, so we just need D2' to gate D1.) That gives Y0 = D3 + D1.D2', where the dot is AND and the apostrophe is NOT.",
        "Read it back in the booth: D3 always pulls Y0 high because its index ends in 1; D1 only gets to pull Y0 high if the more senior candidate D2 is NOT in the race. Flip the demo into priority mode and force D1 and D2 high together - instead of garbage, it cleanly reports D2's index, 10, with the ranking D3 > D2 > D1 > D0 doing the deciding.",
      ],
      theoryHI: [
        "priority encoder वह referee है जो jam हल करता है। विचार है हर input को एक RANK देना, और किसी भी collision पर सबसे ऊँचा rank जीतता है, तो output कभी गढ़ा हुआ मान नहीं होता - यह हमेशा किसी सचमुच active line का index होता है, बस सबसे वरिष्ठ वाला। हमारी convention यहाँ है D3 सबसे ऊँची priority, फिर D2, फिर D1, और D0 सबसे नीची।",
        "शब्दों में नियम है: सबसे ऊँचे number वाले active input का index बताइए, और हर नीचे वाले को नज़रअंदाज़ कीजिए। अगर D3 और D1 दोनों high हों, जवाब है 11 (D3 का index), क्योंकि D3, D1 से ऊँचा है। अगर D2 और D1 दोनों high हों, जवाब है 10 (D2 का index)। जैसे ही कोई ऊँचा active होता है नीचे वाले inputs mask हो जाते हैं।",
        "अब उस नियम को equations में बदलिए। पहले high bit लीजिए। Y1 ठीक तब 1 होना चाहिए जब winner D3 या D2 हो, क्योंकि यही दो indices (11 और 10) हैं जिनका high bit set है। चूँकि 'winner D3 या D2 है' बस 'D3 active है OR D2 active है' है (D3 पहले से नीचे किसी से ऊँचा है), हमें साफ़ Y1 = D3 + D2 मिलता है।",
        "low bit सूक्ष्म वाला है। Y0 तब 1 होना चाहिए जब winner के index का low bit set हो - यानी indices 11 (D3) और 01 (D1)। D3 हमेशा Y0 set करता है। पर D1 तभी Y0 set कर सकता है जब किसी ऊँची-priority input ने कब्ज़ा न किया हो - ख़ासकर जब वरिष्ठ D2 inactive हो, जिसे D2' लिखते हैं। (D3 का active होना पहले term से संभल चुका है, तो हमें बस D2' चाहिए जो D1 को gate करे।) यह देता है Y0 = D3 + D1.D2', जहाँ dot का मतलब AND और apostrophe का मतलब NOT है।",
        "इसे booth में वापस पढ़िए: D3 हमेशा Y0 को high खींचता है क्योंकि इसका index 1 पर ख़त्म होता है; D1 तभी Y0 को high खींच पाता है अगर ज़्यादा वरिष्ठ candidate D2 दौड़ में नहीं है। demo को priority mode में पलटिए और D1 तथा D2 साथ high कीजिए - garbage के बजाय, यह साफ़-साफ़ D2 का index, 10, बताती है, ranking D3 > D2 > D1 > D0 फ़ैसला करते हुए।",
      ],
      transcriptEN:
        "The priority encoder is the referee. Assign every input a rank, and on a collision the highest rank wins, so the output is always a genuinely active line, just the most senior. Convention: D3 highest, then D2, then D1, D0 lowest. The rule in words: report the index of the highest active input, ignore the rest. For equations, take the high bit first: Y1 is one when the winner is D3 or D2, which is just D3 active OR D2 active, so Y1 equals D3 plus D2. The low bit is subtler: Y0 is one for indices D3 and D1. D3 always sets it; D1 only sets it when the senior D2 is inactive, written D2-prime. So Y0 equals D3 plus D1 AND D2-prime. Force D1 and D2 high together in priority mode and, instead of garbage, it cleanly reports D2's index, one-zero, with the ranking D3 over D2 over D1 over D0 deciding.",
      transcriptHI:
        "priority encoder referee है। हर input को एक rank दीजिए, और collision पर सबसे ऊँचा rank जीतता है, तो output हमेशा एक सचमुच active line होती है, बस सबसे वरिष्ठ। convention: D3 सबसे ऊँची, फिर D2, फिर D1, D0 सबसे नीची। शब्दों में नियम: सबसे ऊँचे active input का index बताइए, बाक़ी को छोड़िए। equations के लिए पहले high bit: Y1 one है जब winner D3 या D2 हो, जो बस D3 active OR D2 active है, तो Y1 बराबर D3 plus D2। low bit सूक्ष्म है: Y0 one है indices D3 और D1 के लिए। D3 हमेशा इसे set करता है; D1 तभी set करता है जब वरिष्ठ D2 inactive हो, D2-prime लिखा। तो Y0 बराबर D3 plus D1 AND D2-prime। priority mode में D1 और D2 साथ high कीजिए और, garbage के बजाय, यह साफ़ D2 का index, one-zero, बताती है, ranking D3 over D2 over D1 over D0 फ़ैसला करते हुए।",
      visualNote:
        'Side-by-side: left simple encoder sparking on D1+D2; right priority encoder cleanly outputting the higher input, with ranking D3 > D2 > D1 > D0 annotated. LiveGate for the AND term D1.D2\' and the OR. Live EncoderViz.',
    },
    {
      id: 'S07_Valid',
      label: 'The Valid Bit V',
      kind: 'theory',
      subtitle: "V = D0 + D1 + D2 + D3 - the 'someone actually voted' lamp.",
      theoryEN: [
        "The priority rule fixed the multiple-active flaw, but the zero-active ambiguity is still open: an empty booth and a vote for D0 both read 00. The fix is one extra output, the VALID bit V, and it is delightfully simple.",
        "V is 1 exactly when at least one input is active, and the cheapest way to say 'at least one of these is high' is a big OR: V = D0 + D1 + D2 + D3. It is just an OR of every input line, usually built as a small two-level OR tree (OR the first two, OR the last two, then OR those together).",
        "Now the ambiguity dissolves. Read the code AND the valid bit together. Output 00 with V = 1 means 'D0 genuinely won' - at least one switch is down, and the code says it was D0. Output 00 with V = 0 means 'no vote at all' - the booth is empty and the two address bits are meaningless. The valid bit is the booth's 'someone actually voted' lamp.",
        "This is why a priority truth table can legally put don't-cares on the data outputs for the all-zero row: V = 0 in that row tells downstream logic to ignore the address bits entirely, so whatever they happen to be does not matter. The valid bit is what makes those don't-cares safe.",
        "In practice, V is wired as an enable or qualifier: the n address bits are only trusted when V = 1. An interrupt controller, for example, only acts on the device ID when V says a device actually requested service. Toggle the inputs below and watch V: press D0 and the code stays 00 but the lamp goes green; release everything and the lamp goes dark while the code, deceptively, stays 00.",
      ],
      theoryHI: [
        "priority नियम ने multiple-active flaw ठीक कर दिया, पर zero-active अस्पष्टता अब भी खुली है: एक खाली booth और D0 का vote दोनों 00 पढ़ते हैं। इसका इलाज है एक अतिरिक्त output, VALID bit V, और यह ख़ुशनुमा रूप से सरल है।",
        "V ठीक तब 1 है जब कम से कम एक input active हो, और 'इनमें से कम से कम एक high है' कहने का सबसे सस्ता तरीक़ा एक बड़ा OR है: V = D0 + D1 + D2 + D3। यह बस हर input line का OR है, आम तौर पर एक छोटे दो-स्तरीय OR tree के रूप में बनाया जाता है (पहले दो को OR, आख़िरी दो को OR, फिर उन दोनों को OR)।",
        "अब अस्पष्टता घुल जाती है। code AND valid bit को साथ पढ़िए। output 00 के साथ V = 1 मतलब 'D0 सचमुच जीता' - कम से कम एक switch दबा है, और code कहता है वह D0 था। output 00 के साथ V = 0 मतलब 'कोई vote ही नहीं' - booth खाली है और दोनों address bits बेमतलब हैं। valid bit booth का 'किसी ने सचमुच vote दिया' lamp है।",
        "इसीलिए एक priority truth table all-zero row के लिए data outputs पर वैध रूप से don't-cares रख सकती है: उस row में V = 0 downstream logic को बताता है कि address bits को पूरी तरह नज़रअंदाज़ कर दो, तो वे जो भी हों कोई फ़र्क़ नहीं पड़ता। valid bit ही वह है जो उन don't-cares को सुरक्षित बनाता है।",
        "व्यवहार में, V एक enable या qualifier की तरह wire होता है: n address bits पर तभी भरोसा किया जाता है जब V = 1 हो। एक interrupt controller, उदाहरण के लिए, device ID पर तभी काम करता है जब V कहे कि किसी device ने सचमुच सेवा माँगी। नीचे inputs toggle कीजिए और V देखिए: D0 दबाइए और code 00 रहता है पर lamp हरा हो जाता है; सब छोड़िए और lamp बुझ जाता है जबकि code, धोखे से, 00 ही रहता है।",
      ],
      transcriptEN:
        "Priority fixed the multiple-active flaw, but zero-active is still open: an empty booth and a vote for D0 both read zero-zero. The fix is one extra output, the valid bit V. V is one exactly when at least one input is active, and the cheapest way to say at least one is high is a big OR: V equals D0 plus D1 plus D2 plus D3 - just an OR of every input. Now read the code and V together. Zero-zero with V one means D0 genuinely won; zero-zero with V zero means no vote at all, address bits meaningless. That is why a priority truth table can put don't-cares on the data outputs for the all-zero row - V equals zero tells downstream logic to ignore them. In practice V is an enable: the address bits are only trusted when V is one. Press D0 and the code stays zero-zero but the lamp goes green; release everything and the lamp goes dark while the code deceptively stays zero-zero.",
      transcriptHI:
        "priority ने multiple-active flaw ठीक किया, पर zero-active अब भी खुला है: एक खाली booth और D0 का vote दोनों zero-zero पढ़ते हैं। इसका इलाज है एक अतिरिक्त output, valid bit V। V ठीक तब one है जब कम से कम एक input active हो, और कम-से-कम-एक-high कहने का सबसे सस्ता तरीक़ा एक बड़ा OR है: V बराबर D0 plus D1 plus D2 plus D3 - बस हर input का OR। अब code और V को साथ पढ़िए। zero-zero के साथ V one मतलब D0 सचमुच जीता; zero-zero के साथ V zero मतलब कोई vote ही नहीं, address bits बेमतलब। इसीलिए एक priority truth table all-zero row के लिए data outputs पर don't-cares रख सकती है - V बराबर zero downstream logic को बताता है कि उन्हें छोड़ दो। व्यवहार में V एक enable है: address bits पर तभी भरोसा जब V one हो। D0 दबाइए और code zero-zero रहता है पर lamp हरा हो जाता है; सब छोड़िए और lamp बुझ जाता है जबकि code धोखे से zero-zero ही रहता है।",
      visualNote:
        'A green V indicator wired to D0 + D1 + D2 + D3, lighting whenever any input is high, captioned "confirms at least one input is genuinely active, preventing false reads of 00". Live EncoderViz with the V lamp.',
    },
    {
      id: 'S08_Table',
      label: 'Worked Priority Truth Table',
      kind: 'theory',
      subtitle: "Read by priority with don't-cares: 1XXX -> 11, 01XX -> 10, 001X -> 01, 0001 -> 00.",
      theoryEN: [
        "Let us compress the whole priority encoder into one compact truth table, read by priority. The columns are D3 D2 D1 D0 on the input side and Y1 Y0 V on the output side. The trick that keeps it short is the don't-care, written X: once a higher-priority input is active, the lower ones simply do not matter, so we mark them X instead of listing every combination.",
        "Top row, the most senior: D3 = 1 with everything below it don't-care, written 1XXX. D3 wins outright, so Y1 Y0 = 11 and V = 1. Next, 01XX: D3 is low but D2 = 1, so D2 wins and the lower D1, D0 are don't-cares; output is 10, V = 1.",
        "Continuing down the ranks: 001X means D3 and D2 are low and D1 = 1, so D1 wins regardless of D0; output is 01, V = 1. Then 0001 means only D0 is high; D0 wins, output is 00, V = 1. Notice each row pushes the don't-cares one position to the right as we descend the priority ladder.",
        "Finally the all-zero row, 0000: no input is active, so the address bits are don't-care (the X's on Y1 Y0) and crucially V = 0. This is the single row that distinguishes 'no vote' (00 with V = 0) from 'D0 won' (00 with V = 1). Without V those two situations would be indistinguishable - exactly the zero-active flaw.",
        "Scan the live, code-computed table below for all 16 input combinations. Watch how every multi-input row collapses to the index of its highest active line, how V is simply the OR of all inputs, and how only the truly empty row carries V = 0. That single column is the whole reason the priority encoder is trustworthy.",
      ],
      theoryHI: [
        "चलिए पूरी priority encoder को एक compact truth table में दबा दें, priority से पढ़ी हुई। columns हैं input तरफ़ D3 D2 D1 D0 और output तरफ़ Y1 Y0 V। जो trick इसे छोटा रखती है वह है don't-care, X लिखा हुआ: जैसे ही कोई ऊँची-priority input active हो, नीचे वाले बस मायने नहीं रखते, तो हम हर combination गिनाने के बजाय उन्हें X mark करते हैं।",
        "सबसे ऊपरी row, सबसे वरिष्ठ: D3 = 1 के साथ इसके नीचे सब don't-care, 1XXX लिखा। D3 सीधा जीतता है, तो Y1 Y0 = 11 और V = 1। अगला, 01XX: D3 low है पर D2 = 1, तो D2 जीतता है और नीचे वाले D1, D0 don't-cares हैं; output है 10, V = 1।",
        "ranks में नीचे जाते हुए: 001X मतलब D3 और D2 low हैं और D1 = 1, तो D1 जीतता है चाहे D0 कुछ भी हो; output है 01, V = 1। फिर 0001 मतलब सिर्फ़ D0 high है; D0 जीतता है, output है 00, V = 1। ग़ौर कीजिए हर row don't-cares को एक position दाएँ धकेलती है जैसे-जैसे हम priority सीढ़ी उतरते हैं।",
        "आख़िर में all-zero row, 0000: कोई input active नहीं, तो address bits don't-care हैं (Y1 Y0 पर X's) और अहम बात V = 0। यही अकेली row 'कोई vote नहीं' (00 के साथ V = 0) को 'D0 जीता' (00 के साथ V = 1) से अलग करती है। V के बिना वे दोनों हालात एक जैसे होते - ठीक वही zero-active flaw।",
        "नीचे live, code में गिनी हुई table को सभी 16 input combinations के लिए देखिए। देखिए हर multi-input row कैसे अपनी सबसे ऊँची active line के index में सिमट जाती है, V कैसे बस सभी inputs का OR है, और कैसे सिर्फ़ सचमुच खाली row V = 0 ढोती है। वही अकेला column पूरी वजह है कि priority encoder भरोसेमंद है।",
      ],
      transcriptEN:
        "Compress the priority encoder into one compact truth table, read by priority. Columns: D3 D2 D1 D0 in, Y1 Y0 V out. The don't-care X keeps it short - once a higher input is active, the lower ones do not matter. Top row, 1XXX: D3 wins, output one-one, V one. Then 01XX: D2 wins, output one-zero, V one. Then 001X: D1 wins, output zero-one, V one. Then 0001: D0 wins, output zero-zero, V one. Each row shoves the don't-cares one step right as we descend. Finally 0000: no input active, address bits don't-care, and crucially V is zero. That one row distinguishes no vote, zero-zero with V zero, from D0 won, zero-zero with V one. Without V they would be identical - the zero-active flaw. Scan the computed table for all sixteen combinations and watch every row collapse to its highest active index.",
      transcriptHI:
        "priority encoder को एक compact truth table में दबाइए, priority से पढ़ी। columns: D3 D2 D1 D0 अंदर, Y1 Y0 V बाहर। don't-care X इसे छोटा रखता है - जैसे ही कोई ऊँची input active हो, नीचे वाले मायने नहीं रखते। ऊपरी row, 1XXX: D3 जीतता है, output one-one, V one। फिर 01XX: D2 जीतता है, output one-zero, V one। फिर 001X: D1 जीतता है, output zero-one, V one। फिर 0001: D0 जीतता है, output zero-zero, V one। हर row don't-cares को एक कदम दाएँ धकेलती है जैसे हम उतरते हैं। आख़िर में 0000: कोई input active नहीं, address bits don't-care, और अहम बात V zero है। वही एक row कोई-vote-नहीं, zero-zero with V zero, को D0-जीता, zero-zero with V one, से अलग करती है। V के बिना वे एक जैसे होते - zero-active flaw। computed table को सभी सोलह combinations के लिए देखिए और हर row को उसके सबसे ऊँचे active index में सिमटते देखिए।",
      visualNote:
        'Truth table with columns D3 D2 D1 D0 | Y1 Y0 V, X for don\'t-cares, rows ordered by descending priority; plus a code-computed exhaustive 16-row map. Live EncoderViz.',
    },
    {
      id: 'S09_Family',
      label: 'Building Bigger & The Family',
      kind: 'theory',
      subtitle: 'Scaling to 8-to-3, cascading two 4-input encoders, and encoder vs MUX.',
      theoryEN: [
        "The same idea scales. An 8-to-3 priority encoder has 8 inputs, 3 output bits (since 2^3 = 8), and one valid bit V = D0 + D1 + ... + D7. The logic is the same OR-of-higher-priority idea, just with more terms: each output bit is an OR over the active inputs whose index has that bit set, with lower inputs masked by higher ones.",
        "You do not even have to design the 8-input version from scratch. A neat cascade trick chains two 4-input priority encoders plus a little glue logic to form an 8-input encoder: the upper encoder handles inputs 4 to 7, the lower handles 0 to 3, and their V/enable signals are chained so the lower group is only consulted when the upper group is empty. That is priority across whole blocks, the same ranking idea one level up.",
        "It helps to place the encoder in its family. A multiplexer (MUX) uses n select lines to PICK one of 2^n data inputs and route it to a single output. An encoder does the mirror image: it PRODUCES those n select bits from a one-hot input. They are complementary - an encoder generates an address, a MUX consumes one. Put an encoder's output into a MUX's select and you have routed by 'which line was hot'.",
        "Likewise a decoder and an encoder are inverses, as we saw: decoder turns a number into a one-hot line, encoder turns a one-hot line back into a number. So encoder-then-MUX, or decoder-then-encoder, are classic building blocks for routing and addressing - the same few primitives wired in different orders.",
        "These are not academic toys. Priority encoders sit at the heart of keypad and keyboard scanning (which key is down), interrupt controllers (which device interrupted, and which is most urgent), and priority arbitration (which requester gets the bus). Every one of those is 'many candidates, one winner, reported as a short binary ID with a valid flag' - the voting booth, in silicon.",
      ],
      theoryHI: [
        "वही विचार scale होता है। एक 8-to-3 priority encoder में 8 inputs, 3 output bits (क्योंकि 2^3 = 8), और एक valid bit V = D0 + D1 + ... + D7 हैं। logic वही OR-of-higher-priority विचार है, बस ज़्यादा terms के साथ: हर output bit उन active inputs पर एक OR है जिनके index में वह bit set है, नीचे वाले inputs ऊँचों से mask होते हुए।",
        "आपको 8-input version शुरू से design करने की ज़रूरत भी नहीं। एक सुथरी cascade trick दो 4-input priority encoders साथ में थोड़ी glue logic को chain करके एक 8-input encoder बनाती है: ऊपरी encoder inputs 4 से 7 संभालता है, नीचे वाला 0 से 3, और उनके V/enable signals ऐसे chained हैं कि नीचे वाले group से तभी पूछा जाए जब ऊपरी group खाली हो। यह पूरे blocks पर priority है, वही ranking विचार एक स्तर ऊपर।",
        "encoder को उसके परिवार में रखना मदद करता है। एक multiplexer (MUX) n select lines से 2^n data inputs में से एक को PICK करके एक output पर route करता है। encoder उल्टा करती है: यह उन n select bits को एक one-hot input से PRODUCE करती है। ये पूरक हैं - encoder एक address बनाती है, MUX एक खपाता है। encoder का output किसी MUX के select में डालिए और आपने 'कौन सी line hot थी' से route कर लिया।",
        "इसी तरह decoder और encoder उल्टे हैं, जैसा हमने देखा: decoder एक number को one-hot line में बदलता है, encoder one-hot line को वापस number में बदलती है। तो encoder-फिर-MUX, या decoder-फिर-encoder, routing और addressing के classic building blocks हैं - वही कुछ primitives अलग क्रमों में wire किए हुए।",
        "ये academic खिलौने नहीं हैं। priority encoders keypad और keyboard scanning (कौन सी key दबी है), interrupt controllers (किस device ने interrupt किया, और कौन सबसे ज़रूरी है), और priority arbitration (किस requester को bus मिले) के दिल में बैठते हैं। इनमें से हर एक है 'कई candidates, एक winner, एक छोटे binary ID और एक valid flag के रूप में बताया गया' - voting booth, silicon में।",
      ],
      transcriptEN:
        "The idea scales. An eight-to-three priority encoder has eight inputs, three output bits since two cubed is eight, and one valid bit, the OR of all eight inputs - same OR-of-higher-priority idea, more terms. And you can cascade: chain two four-input priority encoders plus glue logic into an eight-input encoder, the upper handling four to seven, the lower zero to three, with their valid signals chained so the lower group is consulted only when the upper is empty. Place the encoder in its family: a MUX uses n select lines to pick one of two-to-the-n inputs; an encoder produces those select bits from a one-hot input - they are complementary. A decoder and encoder are inverses. So encoder-then-MUX or decoder-then-encoder are classic routing blocks. These run real keypad scanning, interrupt controllers, and priority arbitration - many candidates, one winner, a short binary ID with a valid flag. The voting booth, in silicon.",
      transcriptHI:
        "विचार scale होता है। एक eight-to-three priority encoder में आठ inputs, तीन output bits क्योंकि two cubed आठ है, और एक valid bit, सभी आठ inputs का OR - वही OR-of-higher-priority विचार, ज़्यादा terms। और आप cascade कर सकते हैं: दो four-input priority encoders साथ glue logic को एक eight-input encoder में chain कीजिए, ऊपरी चार से सात संभालता, नीचे वाला zero से three, उनके valid signals chained ताकि नीचे वाले group से तभी पूछा जाए जब ऊपरी खाली हो। encoder को उसके परिवार में रखिए: एक MUX n select lines से two-to-the-n inputs में से एक चुनता है; एक encoder उन select bits को one-hot input से बनाती है - ये पूरक हैं। एक decoder और encoder उल्टे हैं। तो encoder-फिर-MUX या decoder-फिर-encoder classic routing blocks हैं। ये असली keypad scanning, interrupt controllers, और priority arbitration चलाते हैं - कई candidates, एक winner, एक छोटा binary ID एक valid flag के साथ। voting booth, silicon में।",
      visualNote:
        'Block diagram: two 4-to-2 priority encoders feeding an OR/merge stage to form an 8-to-3 encoder; beside it a MUX shown as the mirror image (select-in vs code-out). Live EncoderViz.',
    },
    {
      id: 'S10_Build',
      label: 'Build The Encoders For Real',
      kind: 'theory',
      subtitle: 'Open the workbench and wire the 4-to-2 encoder yourself, gate by gate.',
      theoryEN: [
        "You have derived every equation; now build the circuit on real gates. The workbench rail walks you through wiring the 4-to-2 encoder yourself: place the OR gates, connect the right inputs, and prove each output against the truth table on live hardware. Nothing here is taken on faith - you toggle the inputs and watch the gates compute.",
        "For the simple core, the build is tiny: Y0 = D1 + D3 is one OR gate, Y1 = D2 + D3 is a second OR gate, and D0 connects to nothing because its index is the all-zeros codeword. Two gates, and the whole simple encoder is done - then you can deliberately drive two inputs high and watch it fabricate a wrong code, exactly the flaw we discussed.",
        "To upgrade to the priority encoder you add a little more: an inverter to make D2', an AND gate for the term D1.D2', and the OR gates for A1 = D3 + D2 and A0 = D3 + D1.D2'. Add one more OR tree for V = D0 + D1 + D2 + D3 and you have a complete, trustworthy 4-to-2 priority encoder with a valid bit.",
        "Because every gate in here can be built from NAND alone (NOT is one NAND, AND is two, OR is three), the same circuit maps directly onto a real CMOS standard-cell library - which is how an encoder is actually fabricated in a chip. Open the workbench, build it step by step, and prove every row yourself.",
      ],
      theoryHI: [
        "आपने हर equation निकाल लिया; अब circuit को असली gates पर बनाइए। workbench rail आपको 4-to-2 encoder ख़ुद wire करने से चलाता है: OR gates रखिए, सही inputs जोड़िए, और हर output को truth table के सामने live hardware पर साबित कीजिए। यहाँ कुछ भी भरोसे पर नहीं - आप inputs toggle करते हैं और gates को compute करते देखते हैं।",
        "सादे core के लिए build नन्हा है: Y0 = D1 + D3 एक OR gate है, Y1 = D2 + D3 एक दूसरा OR gate है, और D0 किसी चीज़ से नहीं जुड़ता क्योंकि इसका index all-zeros codeword है। दो gates, और पूरी सादी encoder हो गई - फिर आप जान-बूझकर दो inputs high कर सकते हैं और इसे एक ग़लत code गढ़ते देख सकते हैं, ठीक वही flaw जिस पर हमने चर्चा की।",
        "priority encoder में upgrade करने के लिए थोड़ा और जोड़िए: D2' बनाने को एक inverter, term D1.D2' के लिए एक AND gate, और A1 = D3 + D2 तथा A0 = D3 + D1.D2' के लिए OR gates। V = D0 + D1 + D2 + D3 के लिए एक और OR tree जोड़िए और आपके पास एक पूरी, भरोसेमंद 4-to-2 priority encoder एक valid bit के साथ है।",
        "चूँकि यहाँ का हर gate अकेले NAND से बन सकता है (NOT एक NAND है, AND दो, OR तीन), वही circuit सीधे एक असली CMOS standard-cell library पर map होता है - यही तरीक़ा है जिससे एक encoder असल में chip में बनाई जाती है। workbench खोलिए, इसे कदम-दर-कदम बनाइए, और हर row ख़ुद साबित कीजिए।",
      ],
      transcriptEN:
        "You have derived every equation; now build it on real gates. The workbench rail walks you through wiring the four-to-two encoder: place the OR gates, connect the inputs, prove each output against the truth table on live hardware. For the simple core it is tiny - Y0 is D1 OR D3, one gate; Y1 is D2 OR D3, a second; D0 connects to nothing. Then drive two inputs high and watch it fabricate a wrong code. To upgrade to priority, add an inverter for D2-prime, an AND for D1 AND D2-prime, the OR gates for A1 and A0, and an OR tree for the valid bit. Every gate here can be built from NAND alone, so the same circuit maps onto a real CMOS standard-cell library. Open the workbench and prove every row yourself.",
      transcriptHI:
        "आपने हर equation निकाल लिया; अब इसे असली gates पर बनाइए। workbench rail आपको four-to-two encoder wire करने से चलाता है: OR gates रखिए, inputs जोड़िए, हर output को truth table के सामने live hardware पर साबित कीजिए। सादे core के लिए यह नन्हा है - Y0 है D1 OR D3, एक gate; Y1 है D2 OR D3, एक दूसरा; D0 किसी चीज़ से नहीं जुड़ता। फिर दो inputs high कीजिए और इसे एक ग़लत code गढ़ते देखिए। priority में upgrade करने के लिए, D2-prime को एक inverter, D1 AND D2-prime को एक AND, A1 और A0 को OR gates, और valid bit को एक OR tree जोड़िए। यहाँ का हर gate अकेले NAND से बन सकता है, तो वही circuit एक असली CMOS standard-cell library पर map होता है। workbench खोलिए और हर row ख़ुद साबित कीजिए।",
      visualNote: 'WorkbenchCTA panel that launches /workbench?tutorial=encoder-4to2, plus the live EncoderViz to preview before building.',
    },
    {
      id: 'S11_Flashcards',
      label: 'Flashcards',
      kind: 'flashcards',
      subtitle: 'Eight flip-cards to lock in encoders, the two flaws, priority and the valid bit.',
      theoryEN: [
        "These eight flip-cards drill the facts that matter most: the encoder/decoder inverse, the simple 4-to-2 equations, the two fatal flaws, the priority equations and the valid bit. Cover the back, say the answer out loud, then flip to check, and repeat any card you fumble until recall is reflex.",
        "Give extra reps to the priority low-bit card, Y0 = D3 + D1.D2', because that D2' factor is the single most-tested subtlety of the whole topic - it is exactly the bit of logic that masks the lower input when a higher one is active.",
        "If you walk away remembering only one thing, make it this: an encoder maps 2^n one-hot lines to n binary bits, priority resolves collisions to the highest active input, and the valid bit V = D0 + D1 + D2 + D3 is the only thing that tells 'D0 won' apart from 'nobody voted'.",
      ],
      theoryHI: [
        "ये आठ flip-cards सबसे ज़रूरी तथ्य रटाते हैं: encoder/decoder उल्टा, सादे 4-to-2 equations, दो fatal flaws, priority equations और valid bit। पीछे ढककर जवाब ज़ोर से बोलिए, फिर जाँचने को पलटिए, और जो card अटके उसे तब तक दोहराइए जब तक याद reflex न बन जाए।",
        "priority low-bit card, Y0 = D3 + D1.D2', को ज़्यादा दोहराइए, क्योंकि वह D2' factor पूरे topic की सबसे ज़्यादा पूछी जाने वाली सूक्ष्मता है - यही वह logic है जो नीचे वाले input को mask करती है जब कोई ऊँचा active हो।",
        "अगर आप सिर्फ़ एक बात याद रखकर जाएँ, तो यह हो: एक encoder 2^n one-hot lines को n binary bits में map करती है, priority collisions को सबसे ऊँचे active input तक हल करता है, और valid bit V = D0 + D1 + D2 + D3 ही एकमात्र चीज़ है जो 'D0 जीता' को 'किसी ने vote नहीं दिया' से अलग बताती है।",
      ],
      transcriptEN:
        "Eight quick flip-cards to set it solid. Cover the back, say it aloud, then flip. Give extra reps to the priority low-bit card, Y0 equals D3 plus D1 AND D2-prime, because that D2-prime factor is the most-tested subtlety. Remember the one thing: an encoder maps two-to-the-n one-hot lines to n binary bits, priority resolves collisions to the highest active input, and the valid bit tells D0-won apart from nobody-voted.",
      transcriptHI:
        "इसे पक्का करने को आठ तेज़ flip-cards। पीछे ढककर ज़ोर से बोलिए, फिर पलटिए। priority low-bit card, Y0 बराबर D3 plus D1 AND D2-prime, को ज़्यादा दोहराइए, क्योंकि वह D2-prime factor सबसे ज़्यादा पूछी जाने वाली सूक्ष्मता है। एक बात याद रखिए: एक encoder two-to-the-n one-hot lines को n binary bits में map करती है, priority collisions को सबसे ऊँचे active input तक हल करता है, और valid bit D0-जीता को किसी-ने-vote-नहीं-दिया से अलग बताता है।",
      visualNote: 'Standard bilingual flip deck, eight cards.',
    },
    {
      id: 'S12_Quiz',
      label: 'Quiz Arena',
      kind: 'quiz',
      subtitle: 'Eight questions - prove you can size, derive and build the encoder.',
      theoryEN: [
        "Eight multiple-choice questions now check that the voting booth has really sunk in: they probe the sizing rule (how many inputs for n outputs), which Boolean equation gives each output bit, which gates implement them, the multiple-active failure, why the valid bit exists, the priority low-bit form, a worked priority output, and a MUX-building count.",
        "Several questions are circuit-building: they hand you a specific input pattern or ask for a gate count, so reason it out bit by bit rather than guessing - read the highest active input, write its index, and check the valid bit.",
        "Aim for full marks. Clearing all eight means you can take a wall of one-hot lines and turn it into a trustworthy binary code with priority and a valid bit - the complete encoder, derived and built.",
      ],
      theoryHI: [
        "आठ bahu-vikalp सवाल अब जाँचते हैं कि voting booth सचमुच बैठा या नहीं: ये पूछते हैं sizing नियम (n outputs के लिए कितने inputs), कौन सा Boolean equation हर output bit देता है, कौन से gates इन्हें बनाते हैं, multiple-active failure, valid bit क्यों है, priority low-bit रूप, एक worked priority output, और एक MUX-building गिनती।",
        "कई सवाल circuit-building हैं: वे आपको एक ख़ास input pattern देते हैं या एक gate count पूछते हैं, तो अंदाज़े के बजाय bit-दर-bit सोचिए - सबसे ऊँची active input पढ़िए, उसका index लिखिए, और valid bit जाँचिए।",
        "पूरे अंक का लक्ष्य रखिए। आठों साफ़ करना मतलब आप one-hot lines की एक दीवार लेकर उसे priority और एक valid bit के साथ एक भरोसेमंद binary code में बदल सकते हैं - पूरी encoder, निकाली और बनाई हुई।",
      ],
      transcriptEN:
        "Eight questions in the arena. They check the sizing rule, which equation gives each output bit, which gates implement them, the multiple-active failure, why the valid bit exists, the priority low-bit form, a worked priority output, and a MUX-building count. Several are circuit-building - reason bit by bit: read the highest active input, write its index, check the valid bit. Clear all eight and you can turn a wall of one-hot lines into a trustworthy binary code with priority and a valid bit.",
      transcriptHI:
        "Arena में आठ सवाल। ये जाँचते हैं sizing नियम, कौन सा equation हर output bit देता है, कौन से gates इन्हें बनाते हैं, multiple-active failure, valid bit क्यों है, priority low-bit रूप, एक worked priority output, और एक MUX-building गिनती। कई circuit-building हैं - bit-दर-bit सोचिए: सबसे ऊँची active input पढ़िए, उसका index लिखिए, valid bit जाँचिए। आठों साफ़ कीजिए और आप one-hot lines की दीवार को priority और एक valid bit के साथ एक भरोसेमंद binary code में बदल सकते हैं।",
      visualNote: 'Parameterized QuizArena.',
    },
    {
      id: 'S13_Recap',
      label: 'Recap & Encoder Mastered',
      kind: 'recap',
      subtitle: 'One-hot in, binary out - priority and a valid bit make it trustworthy.',
      theoryEN: [
        "Let us bank the whole module. An encoder is the inverse of a decoder: it takes 2^n one-hot input lines and outputs the n-bit binary index of the active line, compressing a wide sparse signal into a compact address. The sizing rule is inputs = 2^n, outputs = n.",
        "For the simple 4-to-2 encoder, each output bit is an OR of the inputs whose index has that bit set: Y0 = D1 + D3 and Y1 = D2 + D3, two OR gates, with D0 wired to nothing because its index is the all-zeros codeword. That economy is also its weakness - it has two fatal flaws.",
        "The flaws: a double-press makes the OR logic fabricate a wrong code (D1 + D2 -> 11, a candidate nobody chose), and an empty booth outputs 00, indistinguishable from D0. Both are fixed at once. A PRIORITY encoder resolves collisions to the highest active input - A1 = D3 + D2, A0 = D3 + D1.D2' with D3 > D2 > D1 > D0 - and a VALID bit V = D0 + D1 + D2 + D3 lights only on a real vote, so 00 with V = 1 means D0 won and 00 with V = 0 means no vote.",
        "All of this scales: an 8-to-3 encoder is the same OR-of-higher-priority idea with more terms, and you can cascade two 4-input encoders into an 8-input one by chaining their valid/enable signals. And the encoder sits in a family - it is the mirror of a MUX (which consumes select bits that an encoder produces) and the inverse of a decoder.",
        "Step back: the voting booth taught you the whole thing. Many candidate switches, exactly one pressed, out comes its binary ID; a referee for jams, and a 'someone voted' lamp so silence is never mistaken for a vote. That is the encoder at the heart of keypads, interrupt controllers and arbiters - and it is now yours, derived and built.",
      ],
      theoryHI: [
        "चलिए पूरा module जमा कर लें। एक encoder decoder का उल्टा है: यह 2^n one-hot input lines लेती है और active line का n-bit binary index output करती है, एक चौड़े बिखरे signal को एक compact address में सिकोड़ते हुए। sizing नियम है inputs = 2^n, outputs = n।",
        "सादी 4-to-2 encoder के लिए, हर output bit उन inputs का OR है जिनके index में वह bit set है: Y0 = D1 + D3 और Y1 = D2 + D3, दो OR gates, D0 किसी चीज़ से wire नहीं क्योंकि इसका index all-zeros codeword है। वही किफ़ायत इसकी कमज़ोरी भी है - इसमें दो fatal flaws हैं।",
        "flaws: एक double-press OR logic से एक ग़लत code गढ़वा देता है (D1 + D2 -> 11, एक candidate जिसे किसी ने नहीं चुना), और एक खाली booth 00 output करता है, D0 से अलग नहीं पहचाना जा सकता। दोनों एक साथ ठीक होते हैं। एक PRIORITY encoder collisions को सबसे ऊँचे active input तक हल करती है - A1 = D3 + D2, A0 = D3 + D1.D2' के साथ D3 > D2 > D1 > D0 - और एक VALID bit V = D0 + D1 + D2 + D3 सिर्फ़ असली vote पर जलता है, तो 00 के साथ V = 1 मतलब D0 जीता और 00 के साथ V = 0 मतलब कोई vote नहीं।",
        "यह सब scale होता है: एक 8-to-3 encoder वही OR-of-higher-priority विचार है ज़्यादा terms के साथ, और आप दो 4-input encoders को एक 8-input में cascade कर सकते हैं उनके valid/enable signals chain करके। और encoder एक परिवार में बैठती है - यह एक MUX का दर्पण है (जो उन select bits को खपाता है जो encoder बनाती है) और एक decoder का उल्टा।",
        "पीछे हटिए: voting booth ने आपको पूरी बात सिखाई। कई candidate switches, ठीक एक दबा, उसका binary ID बाहर आता है; jams के लिए एक referee, और एक 'किसी ने vote दिया' lamp ताकि ख़ामोशी कभी vote न समझी जाए। यही encoder keypads, interrupt controllers और arbiters के दिल में है - और अब यह आपकी है, निकाली और बनाई हुई।",
      ],
      transcriptEN:
        "Let us bank the whole module. An encoder is the inverse of a decoder: two-to-the-n one-hot lines in, the n-bit index of the active line out, compressing a wide signal into a compact address. The simple four-to-two is Y0 equals D1 plus D3 and Y1 equals D2 plus D3, two OR gates, D0 wired to nothing. But it has two flaws: a double-press fabricates a wrong code, and an empty booth reads zero-zero, just like D0. The priority encoder resolves collisions to the highest active input - A1 equals D3 plus D2, A0 equals D3 plus D1 AND D2-prime - and the valid bit, the OR of all inputs, lights only on a real vote, so zero-zero with V one means D0 won and with V zero means no vote. It scales to eight-to-three and cascades. And it sits in a family: the mirror of a MUX and the inverse of a decoder. The voting booth taught it all - many candidates, one winner, a binary ID, a referee, and a someone-voted lamp. The encoder is now yours.",
      transcriptHI:
        "चलिए पूरा module जमा कर लें। एक encoder decoder का उल्टा है: two-to-the-n one-hot lines अंदर, active line का n-bit index बाहर, एक चौड़े signal को एक compact address में सिकोड़ते हुए। सादी four-to-two है Y0 बराबर D1 plus D3 और Y1 बराबर D2 plus D3, दो OR gates, D0 किसी चीज़ से wire नहीं। पर इसमें दो flaws हैं: एक double-press एक ग़लत code गढ़ता है, और एक खाली booth zero-zero पढ़ता है, बिलकुल D0 जैसा। priority encoder collisions को सबसे ऊँचे active input तक हल करती है - A1 बराबर D3 plus D2, A0 बराबर D3 plus D1 AND D2-prime - और valid bit, सभी inputs का OR, सिर्फ़ असली vote पर जलता है, तो zero-zero with V one मतलब D0 जीता और with V zero मतलब कोई vote नहीं। यह eight-to-three तक scale होता है और cascade करता है। और यह एक परिवार में बैठती है: एक MUX का दर्पण और एक decoder का उल्टा। voting booth ने सब सिखाया - कई candidates, एक winner, एक binary ID, एक referee, और एक किसी-ने-vote-दिया lamp। encoder अब आपकी है।",
      visualNote:
        'Recap card: the simple equations and the priority equations side by side, the valid bit, and a family ribbon Decoder -> Encoder -> MUX. Live EncoderViz. Sources listed as links.',
    },
  ],
  flashcards: [
    {
      frontEN: 'What is an encoder, and how does it relate to a decoder?',
      backEN:
        'A combinational circuit that converts 2^n one-hot input lines into an n-bit binary code. It is the exact inverse of a decoder: a decoder turns a number into one lit line, an encoder turns one lit line back into the number.',
      frontHI: 'encoder क्या है, और इसका decoder से क्या रिश्ता है?',
      backHI:
        'एक combinational circuit जो 2^n one-hot input lines को एक n-bit binary code में बदलती है। यह decoder का बिलकुल उल्टा है: decoder एक number को एक जली line में बदलता है, encoder एक जली line को वापस number में बदलती है।',
    },
    {
      frontEN: 'What is the one-hot assumption?',
      backEN:
        'In a simple encoder exactly one input is active at a time, like only one candidate switch pressed in the voting booth. The simple OR equations are only valid under this assumption.',
      frontHI: 'one-hot assumption क्या है?',
      backHI:
        'एक सादी encoder में एक बार में ठीक एक input active होता है, जैसे voting booth में सिर्फ़ एक candidate switch दबा हो। सादे OR equations सिर्फ़ इस assumption के तहत वैध हैं।',
    },
    {
      frontEN: 'Write the simple 4-to-2 encoder equations.',
      backEN:
        "Y0 = D1 + D3 and Y1 = D2 + D3. Each output ORs the inputs whose binary index has that bit set; D0 (index 00) needs no gate, so the whole circuit is two OR gates.",
      frontHI: 'सादी 4-to-2 encoder के equations लिखिए।',
      backHI:
        'Y0 = D1 + D3 और Y1 = D2 + D3। हर output उन inputs को OR करता है जिनके binary index में वह bit set है; D0 (index 00) को कोई gate नहीं चाहिए, तो पूरी circuit दो OR gates है।',
    },
    {
      frontEN: 'What is the multiple-input flaw of a simple encoder?',
      backEN:
        'If two inputs are high, the OR logic combines their codes and outputs a third, wrong code. For example D1 + D2 gives 01 OR 10 = 11, the code for D3 - a candidate nobody pressed.',
      frontHI: 'सादी encoder का multiple-input flaw क्या है?',
      backHI:
        'अगर दो inputs high हों, OR logic उनके codes मिलाकर एक तीसरा, ग़लत code देती है। उदाहरण के लिए D1 + D2 देता है 01 OR 10 = 11, D3 का code - एक candidate जिसे किसी ने नहीं दबाया।',
    },
    {
      frontEN: 'What is the zero-input flaw, and what fixes it?',
      backEN:
        'With no input active the output is 00, indistinguishable from the real code of D0. A Valid bit V = D0 + D1 + D2 + D3 fixes it: 00 with V = 1 means D0 won, 00 with V = 0 means no vote.',
      frontHI: 'zero-input flaw क्या है, और इसे क्या ठीक करता है?',
      backHI:
        'कोई input active न होने पर output 00 होता है, D0 के असली code से अलग नहीं। एक Valid bit V = D0 + D1 + D2 + D3 इसे ठीक करता है: 00 के साथ V = 1 मतलब D0 जीता, 00 के साथ V = 0 मतलब कोई vote नहीं।',
    },
    {
      frontEN: 'What does a priority encoder do, and what are its 4-to-2 equations?',
      backEN:
        "It ranks the inputs and outputs the index of the highest-priority active one (D3 > D2 > D1 > D0), so collisions never make garbage. A1 = D3 + D2 and A0 = D3 + D1.D2'.",
      frontHI: 'priority encoder क्या करती है, और इसके 4-to-2 equations क्या हैं?',
      backHI:
        "यह inputs को rank देती है और सबसे ऊँची-priority active का index output करती है (D3 > D2 > D1 > D0), तो collisions कभी garbage नहीं बनाते। A1 = D3 + D2 और A0 = D3 + D1.D2'।",
    },
    {
      frontEN: 'What is the valid bit V, and why is it needed?',
      backEN:
        'V = D0 + D1 + D2 + D3; it is 1 only when at least one input is active. It confirms a genuine vote and prevents a false read of 00, letting downstream logic ignore the address bits when V = 0.',
      frontHI: 'valid bit V क्या है, और क्यों चाहिए?',
      backHI:
        'V = D0 + D1 + D2 + D3; यह तभी 1 है जब कम से कम एक input active हो। यह एक असली vote की पुष्टि करता है और 00 के झूठे पाठ को रोकता है, downstream logic को V = 0 पर address bits नज़रअंदाज़ करने देता है।',
    },
    {
      frontEN: 'How is an encoder related to a multiplexer?',
      backEN:
        'They are complementary. A MUX uses n select bits to PICK one of 2^n data inputs; an encoder PRODUCES those select bits from a one-hot signal. Feed an encoder output into a MUX select to route by which line was hot.',
      frontHI: 'encoder का multiplexer से क्या रिश्ता है?',
      backHI:
        'ये पूरक हैं। एक MUX n select bits से 2^n data inputs में से एक PICK करता है; एक encoder उन select bits को एक one-hot signal से PRODUCE करती है। encoder output को MUX select में डालिए ताकि कौन-सी-line-hot-थी से route हो।',
    },
  ],
  quiz: [
    {
      questionEN: 'An encoder with n output bits has how many input lines?',
      options: ['n', '2n', '2^n', 'n^2'],
      answerIndex: 2,
      explainEN:
        'An encoder is the inverse of a decoder: it maps 2^n one-hot inputs to n binary outputs. With n outputs there are 2^n inputs.',
      explainHI:
        'एक encoder decoder का उल्टा है: यह 2^n one-hot inputs को n binary outputs में map करती है। n outputs के साथ 2^n inputs होते हैं।',
      questionHI: 'n output bits वाली एक encoder में कितनी input lines होती हैं?',
    },
    {
      questionEN: 'In the simple 4-to-2 encoder, which Boolean equation gives the low output bit Y0?',
      options: ['Y0 = D2 + D3', 'Y0 = D1 + D3', 'Y0 = D0 + D2', 'Y0 = D1 . D3'],
      answerIndex: 1,
      explainEN: 'Y0 is 1 for codes 01 (D1) and 11 (D3), the two indices whose low bit is set, so Y0 = D1 + D3.',
      explainHI: 'Y0 1 है codes 01 (D1) और 11 (D3) के लिए, यही दो indices हैं जिनका low bit set है, तो Y0 = D1 + D3।',
      questionHI: 'सादी 4-to-2 encoder में, कौन सा Boolean equation low output bit Y0 देता है?',
    },
    {
      questionEN: 'To build the simple 4-to-2 encoder, which gates implement the two outputs?',
      options: ['Two AND gates', 'Two OR gates (D1+D3 and D2+D3)', 'One XOR and one OR', 'Four NAND gates'],
      answerIndex: 1,
      explainEN:
        'Each output is an OR of the inputs whose index has that bit set: Y0 = D1 + D3, Y1 = D2 + D3. That is two OR gates; D0 needs no gate.',
      explainHI:
        'हर output उन inputs का OR है जिनके index में वह bit set है: Y0 = D1 + D3, Y1 = D2 + D3। यह दो OR gates है; D0 को कोई gate नहीं चाहिए।',
      questionHI: 'सादी 4-to-2 encoder बनाने के लिए, कौन से gates दोनों outputs बनाते हैं?',
    },
    {
      questionEN: 'In a simple (non-priority) 4-to-2 encoder, if D1 and D2 are BOTH high, what is Y1Y0?',
      options: ['01', '10', '11', '00'],
      answerIndex: 2,
      explainEN:
        'D1 sets Y0 = 1 and D2 sets Y1 = 1, giving 11 - the code for D3, a wrong answer the plain OR logic fabricates.',
      explainHI:
        'D1, Y0 = 1 set करता है और D2, Y1 = 1 set करता है, देता है 11 - D3 का code, एक ग़लत जवाब जो सादी OR logic गढ़ती है।',
      questionHI: 'एक सादी (non-priority) 4-to-2 encoder में, अगर D1 और D2 दोनों high हों, Y1Y0 क्या है?',
    },
    {
      questionEN: 'Why is a Valid (V) output added to an encoder?',
      options: [
        'To double the speed',
        "To distinguish 'no input active' from the legitimate all-zero code of D0",
        'To invert the outputs',
        'To select between two encoders',
      ],
      answerIndex: 1,
      explainEN:
        'With all inputs 0 the data output is 00, identical to D0’s code; V = D0 + D1 + D2 + D3 lights only on a real vote, removing the ambiguity.',
      explainHI:
        'सभी inputs 0 होने पर data output 00 है, D0 के code जैसा ही; V = D0 + D1 + D2 + D3 सिर्फ़ असली vote पर जलता है, अस्पष्टता हटाते हुए।',
      questionHI: 'encoder में एक Valid (V) output क्यों जोड़ा जाता है?',
    },
    {
      questionEN: 'For the priority 4-to-2 encoder, which expression correctly gives Y0?',
      options: ['Y0 = D1 + D3', "Y0 = D3 + D1.D2'", 'Y0 = D2 + D3', 'Y0 = D1.D3'],
      answerIndex: 1,
      explainEN:
        "D3 always sets Y0; D1 may set it only when the higher-priority D2 is inactive (D2'), so Y0 = D3 + D1.D2'.",
      explainHI:
        "D3 हमेशा Y0 set करता है; D1 तभी इसे set कर सकता है जब ऊँची-priority D2 inactive हो (D2'), तो Y0 = D3 + D1.D2'।",
      questionHI: 'priority 4-to-2 encoder के लिए, कौन सा expression सही Y0 देता है?',
    },
    {
      questionEN: 'In a priority encoder (D3 highest), inputs are D3D2D1D0 = 0110. What does it output (Y1Y0)?',
      options: ['01', '11', '10', '00'],
      answerIndex: 2,
      explainEN:
        "Highest active input is D2, so the output is D2's index 10; the lower active D1 is ignored.",
      explainHI:
        'सबसे ऊँची active input D2 है, तो output है D2 का index 10; नीचे वाली active D1 नज़रअंदाज़ होती है।',
      questionHI: 'एक priority encoder (D3 सबसे ऊँची) में, inputs D3D2D1D0 = 0110 हैं। यह क्या output (Y1Y0) देती है?',
    },
    {
      questionEN: 'How many 2-to-1 multiplexers are needed to build one 8-to-1 multiplexer?',
      options: ['3', '4', '7', '8'],
      answerIndex: 2,
      explainEN:
        'A balanced tree uses 4 + 2 + 1 = 7 two-to-one MUXes, each layer halving the inputs: 8 -> 4 -> 2 -> 1.',
      explainHI:
        'एक balanced tree 4 + 2 + 1 = 7 two-to-one MUXes वापरता है, हर layer inputs को आधा करते हुए: 8 -> 4 -> 2 -> 1।',
      questionHI: 'एक 8-to-1 multiplexer बनाने के लिए कितने 2-to-1 multiplexers चाहिए?',
    },
  ],
}) as unknown as SubContent;
