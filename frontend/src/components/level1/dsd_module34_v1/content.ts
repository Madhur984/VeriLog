import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/34 - Registers & Shift Registers, "The Word-Wide Memory Row"
 * (Sequential Logic track).
 * A register is n flip-flops on a COMMON clock, one flip-flop per bit, storing an
 * n-bit word all at once. A buffer register adds a Load/enable "drawbridge": Load=0
 * gates the clock and holds; Load=1 accepts new data. A shift register wires the
 * flip-flops in a chain so the whole word slides one position every clock edge.
 * The four I/O modes (SISO / SIPO / PISO / PIPO) trade write cycles, read cycles and
 * pin count against each other - the time-vs-space law. A serial read is destructive
 * (the word shifts out and is lost) unless the serial-out is routed back to the
 * serial-in through a MUX (recirculating, non-destructive). The universal shift
 * register folds hold / shift-left / shift-right / parallel-load under one mode
 * control. Every displayed value (loaded word, shifted word, cycle counts, the
 * synthesis matrix, the recirculating loop, the universal next-word) is COMPUTED in
 * code from the actual bit array, never hardcoded.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Registers & Shift Registers - The Word-Wide Memory Row",
  moduleSubtitle: "n flip-flops on one clock hold an n-bit word; chain them and the whole word marches one step every tick.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The Word-Wide Memory Row",
      kind: "cover",
      subtitle: "A row of flip-flops that stores a whole word, and slides it one step on every clock edge.",
      theoryEN: [
        "A register is simply n flip-flops sharing one common clock, one flip-flop per bit, so together they store an n-bit word and update all at once on the same edge.",
        "A buffer register adds a Load line that works like a drawbridge: Load=0 gates the clock and holds the word, Load=1 lets a fresh word in on the next edge.",
        "Wire the flip-flops into a chain and you get a shift register: the whole word slides exactly one position, left or right, every single clock edge.",
        "Four I/O modes - SISO, SIPO, PISO, PIPO - trade write cycles, read cycles and pins against each other; that trade is the time-versus-space law.",
        "Feed the serial output back to the serial input through a MUX and the read stops being destructive; a mode control that also does parallel-load gives you the universal shift register."
      ],
      theoryHI: [
        "Register बस n flip-flops हैं जो एक common clock साझा करते हैं, हर bit के लिए एक flip-flop, तो मिलकर वे एक n-bit word store करते हैं और उसी edge पर एक साथ update होते हैं।",
        "Buffer register एक Load line जोड़ता है जो एक drawbridge की तरह काम करती है: Load=0 clock को gate करके word को होल्ड करता है, Load=1 अगले edge पर एक नया word अंदर आने देता है।",
        "Flip-flops को एक chain में wire कीजिए और मिलता है shift register: पूरा word हर एक clock edge पर ठीक एक position, बाएँ या दाएँ, सरकता है।",
        "चार I/O modes - SISO, SIPO, PISO, PIPO - write cycles, read cycles और pins को आपस में trade करते हैं; यही trade time-बनाम-space का नियम है।",
        "Serial output को एक MUX के ज़रिए serial input में वापस feed कीजिए और read destructive रहना बंद कर देता है; एक mode control जो parallel-load भी करे, आपको universal shift register देता है।"
      ],
      transcriptEN: "A register is n flip-flops on one clock, one per bit, holding an n-bit word. Add a Load line and it becomes a buffer that holds or accepts on command. Chain the flip-flops and the whole word shifts one step every edge - that is a shift register. Meet the four I/O modes, the recirculating read, and the universal shift register.",
      transcriptHI: "Register एक clock पर n flip-flops है, हर bit के लिए एक, जो एक n-bit word रखता है। एक Load line जोड़िए और यह एक buffer बन जाता है जो आदेश पर होल्ड या स्वीकार करता है। Flip-flops को chain कीजिए और पूरा word हर edge पर एक कदम shift होता है - वही shift register है। चार I/O modes, recirculating read, और universal shift register से मिलिए।",
      visualNote: "Hero: a live 4-bit shift register (SIPO) - toggle the serial-in bit, press the clock, and watch every bit slide one stage right."
    },
    {
      id: "S01_Video",
      label: "Registers, Row By Row",
      kind: "video",
      subtitle: "A short film: storing a word, gating a load, and marching bits down a chain.",
      theoryEN: [
        "Before you watch, hold the core picture: a register is a row of one-bit memory cells (flip-flops) that all share the same clock, so an n-bit word is captured in a single edge.",
        "A plain buffer register just latches whatever is on its data inputs; adding a Load enable lets it choose between holding the old word and accepting a new one.",
        "A shift register connects each flip-flop's output to the next one's input, so on every edge the contents move over by one bit - new data arrives at one end, old data falls off the other.",
        "The way you get data in and out - all bits at once (parallel) or one bit at a time down a single wire (serial) - gives the four modes SISO, SIPO, PISO and PIPO.",
        "Keep one running example: the 4-bit word 1011. You will watch it load in parallel in one tick, or crawl in serially over four ticks, and even circulate back to where it started."
      ],
      theoryHI: [
        "देखने से पहले मूल तस्वीर पकड़िए: register एक-bit memory cells (flip-flops) की एक पंक्ति है जो सब एक ही clock साझा करती हैं, तो एक n-bit word एक अकेले edge में पकड़ा जाता है।",
        "सादा buffer register बस वही latch करता है जो उसके data inputs पर है; एक Load enable जोड़ना उसे पुराने word को होल्ड करने और नया स्वीकार करने के बीच चुनने देता है।",
        "Shift register हर flip-flop के output को अगले के input से जोड़ता है, तो हर edge पर contents एक bit खिसक जाते हैं - नया data एक सिरे पर आता है, पुराना data दूसरे सिरे से गिर जाता है।",
        "आप data को अंदर-बाहर कैसे करते हैं - सब bits एक साथ (parallel) या एक-एक करके एक अकेली wire पर (serial) - यही चार modes SISO, SIPO, PISO और PIPO देता है।",
        "एक उदाहरण मन में रखिए: 4-bit word 1011। आप इसे एक tick में parallel load होते, या चार ticks में serially रेंगते, और यहाँ तक कि वापस अपनी शुरुआती जगह circulate होते देखेंगे।"
      ],
      transcriptEN: "A register is a row of flip-flops sharing one clock, so an n-bit word is stored in a single edge. A buffer register adds a Load enable to hold or accept. A shift register chains the cells so the word marches one bit per edge - data in one end, out the other. How you move data - parallel or serial, in and out - defines the four modes. Keep the word 1011 in mind as it loads, shifts and recirculates.",
      transcriptHI: "Register एक clock साझा करते flip-flops की पंक्ति है, तो एक n-bit word एक अकेले edge में store होता है। Buffer register होल्ड या स्वीकार करने को एक Load enable जोड़ता है। Shift register cells को chain करता है ताकि word हर edge पर एक bit march करे - data एक सिरे से अंदर, दूसरे से बाहर। आप data को कैसे हिलाते हैं - parallel या serial, अंदर-बाहर - यही चार modes तय करता है। Word 1011 को मन में रखिए जैसे यह load, shift और recirculate होता है।",
      visualNote: "Animated explainer: four D flip-flops in a row on a shared clock; a word loads, then a chain wire lights up as the bits march one stage per tick."
    },
    {
      id: "S02_Facts",
      label: "What A Register Is",
      kind: "theory",
      subtitle: "n flip-flops, one common clock, one flip-flop per bit - an n-bit word captured at once.",
      theoryEN: [
        "Let us be exact about the definition. A register is a group of n flip-flops that all receive the same clock signal, with exactly one flip-flop dedicated to each bit of the data. A single flip-flop stores one bit; wire n of them side by side onto a common clock and you have a device that stores an n-bit word. A 4-bit register is four flip-flops; an 8-bit register is eight, and so on.",
        "The word common clock is doing real work here. Because every flip-flop is triggered by the very same edge, all n bits are captured in the same instant. There is no bit that lands a little early or a little late - the whole word updates in lockstep, which is exactly what you want when the bits together mean a single number or code.",
        "Contrast that with the flip-flop you already met. One flip-flop is a one-bit memory; a register is just that idea widened to a full word. Nothing new is happening inside each cell - each is still governed by its own characteristic equation, most often the D flip-flop's simple Q(t+1) = D - but now they act as a team, holding a byte, an address, or an instruction.",
        "This is why registers are the fundamental storage element of every processor. The program counter, the accumulator, the instruction register, the general-purpose registers you write to in assembly - each is a bank of flip-flops on a shared clock. When a datasheet says a CPU has thirty-two 64-bit registers, it is literally describing thirty-two rows of sixty-four flip-flops.",
        "So the mental model for the whole module is a row of boxes, each holding one bit, all wired to the same clock wire underneath. Change the data inputs, pulse the clock once, and the entire row snaps to the new word together. Everything that follows - buffering, shifting, the four modes - is built by adding wiring around this one simple row."
      ],
      theoryHI: [
        "परिभाषा के बारे में ठीक-ठीक साफ़ हों। Register n flip-flops का एक समूह है जो सब एक ही clock signal पाते हैं, data के हर bit के लिए ठीक एक flip-flop समर्पित। एक अकेला flip-flop एक bit store करता है; n को अगल-बगल एक common clock पर wire कीजिए और आपके पास एक device है जो एक n-bit word store करता है। एक 4-bit register चार flip-flops है; एक 8-bit register आठ, वग़ैरह।",
        "यहाँ common clock शब्द असली काम कर रहा है। चूँकि हर flip-flop उसी एक edge से trigger होता है, सभी n bits उसी पल में पकड़े जाते हैं। कोई bit थोड़ा जल्दी या थोड़ा देर से नहीं उतरता - पूरा word lockstep में update होता है, जो ठीक वही है जो आप चाहते हैं जब bits मिलकर एक अकेली संख्या या code का अर्थ रखते हैं।",
        "इसकी तुलना उस flip-flop से कीजिए जिससे आप पहले मिल चुके हैं। एक flip-flop एक-bit memory है; register बस उसी विचार को पूरे word तक चौड़ा किया गया है। हर cell के अंदर कुछ नया नहीं हो रहा - हर एक अब भी अपने characteristic equation से शासित है, अक्सर D flip-flop का सादा Q(t+1) = D - पर अब वे एक team की तरह काम करते हैं, एक byte, address, या instruction रखते हुए।",
        "इसीलिए registers हर processor का बुनियादी storage element हैं। Program counter, accumulator, instruction register, वे general-purpose registers जिनमें आप assembly में लिखते हैं - हर एक एक साझा clock पर flip-flops का bank है। जब कोई datasheet कहती है कि एक CPU में बत्तीस 64-bit registers हैं, वह शब्दशः चौंसठ flip-flops की बत्तीस पंक्तियाँ बता रही है।",
        "तो पूरे module का mental model boxes की एक पंक्ति है, हर एक एक bit रखता, सब नीचे उसी clock wire से जुड़े। Data inputs बदलिए, clock एक बार pulse कीजिए, और पूरी पंक्ति नए word पर एक साथ snap कर जाती है। इसके आगे जो कुछ आता है - buffering, shifting, चार modes - इसी एक सादी पंक्ति के इर्द-गिर्द wiring जोड़कर बनाया जाता है।"
      ],
      transcriptEN: "A register is n flip-flops on one common clock, one flip-flop per bit, so it stores an n-bit word. Because every cell is triggered by the same edge, all bits are captured in the same instant - the word updates in lockstep. Each cell is still an ordinary flip-flop, usually a D with Q-next equals D, but together they hold a byte, an address, or an instruction. That is why registers are the storage element of every processor. Picture a row of one-bit boxes on a shared clock wire; pulse the clock and the whole row snaps to the new word.",
      transcriptHI: "Register एक common clock पर n flip-flops है, हर bit के लिए एक, तो यह एक n-bit word store करता है। चूँकि हर cell उसी edge से trigger होता है, सभी bits उसी पल में पकड़े जाते हैं - word lockstep में update होता है। हर cell अब भी एक सामान्य flip-flop है, अक्सर एक D जिसका Q-next बराबर D, पर मिलकर वे एक byte, address, या instruction रखते हैं। इसीलिए registers हर processor का storage element हैं। एक साझा clock wire पर एक-bit boxes की पंक्ति सोचिए; clock pulse कीजिए और पूरी पंक्ति नए word पर snap कर जाती है।",
      visualNote: "RegisterBank: four D flip-flops in a row on one clock line; toggle each data bit, pulse the shared clock, and all four load together into the stored word."
    },
    {
      id: "S03_Buffer",
      label: "The Buffer Register & Load",
      kind: "theory",
      subtitle: "A Load/enable drawbridge: Load=0 gates the clock and holds; Load=1 accepts new data.",
      theoryEN: [
        "The plainest register just captures its data inputs on every clock edge, whether you wanted it to or not. That is fine when new data really does arrive every tick, but usually you want to hold a value steady for many cycles and only overwrite it when you choose. The fix is a buffer register: the same row of flip-flops plus a single control line called Load, or enable.",
        "Think of Load as a drawbridge across the clock's path to the flip-flops. When Load=1 the bridge is down, the clock reaches the cells, and on the next edge the register accepts the new data on its inputs. When Load=0 the bridge is up, the effective clock to the cells is gated off, and the register simply holds whatever it already stored - the data inputs can wiggle all they like and nothing changes.",
        "There are two honest ways to build this, and it is worth knowing both. One is clock gating: AND the real clock with Load so the flip-flops only see edges when Load=1. It is simple but risky, because a poorly timed Load can chop a clock edge and cause glitches. The safer, industry-standard way is a load-enable multiplexer on each D input: when Load=1 the flip-flop sees the new data, and when Load=0 it sees its own output Q fed back, so it re-loads its current value and appears to hold.",
        "Either way the behaviour is identical from outside: Load=1 means write, Load=0 means keep. This one control turns a dumb every-tick latch into a proper storage cell you can command. It is the difference between a whiteboard that erases itself every second and one that stays until you deliberately wipe it.",
        "This enable idea scales straight up to memory. A row of buffer registers, each with its own Load line driven by an address decoder, is the heart of a small register file or static RAM: the address picks exactly which register's Load goes high, so a write lands in one chosen row while every other row holds. Master the single Load line here and the memory array is just many of them."
      ],
      theoryHI: [
        "सबसे सादा register बस अपने data inputs को हर clock edge पर पकड़ लेता है, चाहे आप चाहते हों या नहीं। यह तब ठीक है जब सचमुच हर tick पर नया data आता हो, पर आमतौर पर आप एक मान को कई cycles तक स्थिर होल्ड करना चाहते हैं और सिर्फ़ तभी overwrite करना जब आप चुनें। इलाज है buffer register: वही flip-flops की पंक्ति जमा एक अकेली control line जिसे Load, या enable कहते हैं।",
        "Load को flip-flops तक clock के रास्ते पर एक drawbridge की तरह सोचिए। जब Load=1 पुल नीचे है, clock cells तक पहुँचता है, और अगले edge पर register अपने inputs पर मौजूद नया data स्वीकार करता है। जब Load=0 पुल ऊपर है, cells तक असली clock gate होकर कट जाता है, और register बस वही होल्ड करता है जो पहले से store था - data inputs जितना चाहें हिलें, कुछ नहीं बदलता।",
        "इसे बनाने के दो ईमानदार तरीके हैं, और दोनों जानना सही है। एक है clock gating: असली clock को Load से AND कीजिए ताकि flip-flops सिर्फ़ तभी edges देखें जब Load=1। यह सादा पर जोखिम भरा है, क्योंकि ग़लत समय पर आया Load एक clock edge को काट सकता है और glitches पैदा कर सकता है। सुरक्षित, industry-standard तरीका हर D input पर एक load-enable multiplexer है: जब Load=1 flip-flop नया data देखता है, और जब Load=0 वह अपना ही output Q वापस feed होते देखता है, तो अपना मौजूदा मान फिर से load करता है और होल्ड करता दिखता है।",
        "किसी भी तरह बाहर से बर्ताव एक जैसा है: Load=1 यानी write, Load=0 यानी रखो। यह एक control एक बेवक़ूफ़ हर-tick latch को एक असली storage cell बना देता है जिसे आप आदेश दे सकते हैं। यह एक ऐसे whiteboard और एक ऐसे whiteboard का फ़र्क़ है जो हर सेकंड ख़ुद को मिटा देता है बनाम एक जो तब तक रहता है जब तक आप जानबूझकर न पोंछें।",
        "यह enable विचार सीधे memory तक बढ़ता है। buffer registers की एक पंक्ति, हर एक की अपनी Load line एक address decoder से चलती, एक छोटे register file या static RAM का दिल है: address ठीक चुनता है कि किस register की Load high हो, तो एक write एक चुनी पंक्ति में उतरता है जबकि हर दूसरी पंक्ति होल्ड करती है। यहाँ अकेली Load line में महारत हासिल कीजिए और memory array बस उनमें से कई है।"
      ],
      transcriptEN: "The plainest register captures its inputs every edge. A buffer register adds a Load enable so you write only when you choose. Picture Load as a drawbridge on the clock's path: Load=1 lowers it, the clock reaches the cells, and new data is accepted; Load=0 raises it, the clock is gated, and the word holds. Build it either by gating the clock with Load, or the safer way, a mux on each D input that feeds back Q when Load=0. From outside: Load=1 writes, Load=0 keeps. Give each register its own Load from an address decoder and you have a register file or RAM.",
      transcriptHI: "सबसे सादा register हर edge पर अपने inputs पकड़ता है। Buffer register एक Load enable जोड़ता है ताकि आप सिर्फ़ चुनने पर लिखें। Load को clock के रास्ते पर एक drawbridge सोचिए: Load=1 उसे गिराता है, clock cells तक पहुँचता है, नया data स्वीकार होता है; Load=0 उसे उठाता है, clock gate होता है, word होल्ड करता है। इसे या तो clock को Load से gate करके बनाइए, या सुरक्षित तरीक़े से, हर D input पर एक mux जो Load=0 पर Q वापस feed करे। बाहर से: Load=1 लिखता है, Load=0 रखता है। हर register को एक address decoder से अपनी Load दीजिए और आपके पास एक register file या RAM है।",
      visualNote: "BufferRegister: a 4-bit register with a Load toggle drawn as a drawbridge on the clock line; with Load=0 the clock is gated and pressing tick does nothing, with Load=1 the new data loads."
    },
    {
      id: "S04_Shift",
      label: "The Shift Register",
      kind: "theory",
      subtitle: "Chain the flip-flops and the whole word slides one position on every clock edge.",
      theoryEN: [
        "Now change the wiring. Instead of giving every flip-flop its own independent data input, connect each flip-flop's output to the next flip-flop's D input, forming a chain. Keep the common clock. The result is a shift register: on every clock edge each bit copies its left neighbour, so the entire stored word slides over by exactly one position.",
        "Follow the mechanics one edge at a time. Just before the edge, cell 1 is holding some value; cell 2's D input is wired to cell 1's output, so at the edge cell 2 grabs what cell 1 had. Simultaneously cell 3 grabs cell 2's old value, cell 4 grabs cell 3's, and so on down the line. Because they all sample on the same edge, every cell takes its neighbour's OLD value, not its new one - the whole word shifts cleanly by one.",
        "One end needs a source and the other end has somewhere to fall off. The free input at the head of the chain is the serial input, where a new bit enters each edge; the output of the last cell is the serial output, where the oldest bit leaves. A right-shift register moves bits from the first cell toward the last; a left-shift register is the same chain wired the other way.",
        "Grind the classic example: feed the bit stream 1, 0, 1, 1 into an empty 4-bit register, one bit per edge. After edge one the register reads 1000; after edge two, 0100; after edge three, 1010; after edge four, 1101. The very first bit you pushed in has travelled all the way to the far cell, and the four bits you fed now sit spread across the four stages - the word has been shifted in, bit by bit.",
        "That single behaviour - one clean slide per edge - is the whole basis of serial data movement. It is how a UART shifts a byte out onto one wire, how data crosses a serial bus, and how a delay line holds a value for a fixed number of ticks. Everything else in this module is a shift register with a little extra wiring at its two ends."
      ],
      theoryHI: [
        "अब wiring बदलिए। हर flip-flop को उसका अपना स्वतंत्र data input देने के बजाय, हर flip-flop के output को अगले flip-flop के D input से जोड़िए, एक chain बनाते हुए। Common clock रखिए। नतीजा है shift register: हर clock edge पर हर bit अपने बाएँ पड़ोसी की नक़ल करता है, तो पूरा store किया word ठीक एक position खिसक जाता है।",
        "एक बार में एक edge, mechanics का पीछा कीजिए। edge से ठीक पहले, cell 1 कोई मान होल्ड कर रहा है; cell 2 का D input cell 1 के output से wired है, तो edge पर cell 2 वही पकड़ता है जो cell 1 के पास था। साथ ही cell 3 cell 2 का पुराना मान पकड़ता है, cell 4 cell 3 का, और ऐसे ही line भर। चूँकि वे सब उसी edge पर sample करते हैं, हर cell अपने पड़ोसी का पुराना मान लेता है, नया नहीं - पूरा word साफ़-साफ़ एक से shift होता है।",
        "एक सिरे को एक स्रोत चाहिए और दूसरे सिरे पर कहीं गिरने की जगह है। chain के सिर पर मुक्त input serial input है, जहाँ हर edge एक नया bit घुसता है; आख़िरी cell का output serial output है, जहाँ सबसे पुराना bit निकलता है। एक right-shift register bits को पहले cell से आख़िरी की ओर हिलाता है; एक left-shift register वही chain दूसरी तरफ़ wired है।",
        "classic उदाहरण पीसिए: एक ख़ाली 4-bit register में bit stream 1, 0, 1, 1 feed कीजिए, हर edge एक bit। edge एक के बाद register पढ़ता है 1000; edge दो के बाद, 0100; edge तीन के बाद, 1010; edge चार के बाद, 1101। जो पहला bit आपने अंदर धकेला वह दूर के cell तक पूरा सफ़र कर चुका है, और जो चार bits आपने feed किए अब चारों stages में फैले बैठे हैं - word bit-दर-bit shift होकर अंदर आ गया है।",
        "वही एक बर्ताव - हर edge एक साफ़ slide - serial data movement का पूरा आधार है। यही है कैसे एक UART एक byte को एक wire पर shift करता है, कैसे data एक serial bus पार करता है, और कैसे एक delay line एक मान को तय संख्या के ticks तक रखता है। इस module में बाक़ी सब अपने दो सिरों पर थोड़ी अतिरिक्त wiring वाला एक shift register है।"
      ],
      transcriptEN: "Rewire the register: connect each flip-flop's output to the next one's D input, keeping the common clock. Now every edge each bit copies its left neighbour, so the whole word slides one position. Because all cells sample the same edge, each takes its neighbour's old value - a clean shift by one. The free head input is the serial input; the last cell's output is the serial output. Feed 1,0,1,1 into an empty 4-bit register and it reads 1000, 0100, 1010, 1101 edge by edge - the first bit walks to the far cell. This one slide per edge is the basis of all serial data movement, from UARTs to delay lines.",
      transcriptHI: "Register को फिर से wire कीजिए: हर flip-flop के output को अगले के D input से जोड़िए, common clock रखते हुए। अब हर edge हर bit अपने बाएँ पड़ोसी की नक़ल करता है, तो पूरा word एक position सरकता है। चूँकि सब cells उसी edge पर sample करते हैं, हर एक अपने पड़ोसी का पुराना मान लेता है - एक साफ़ एक-का shift। मुक्त सिर input serial input है; आख़िरी cell का output serial output है। एक ख़ाली 4-bit register में 1,0,1,1 feed कीजिए और यह edge-दर-edge 1000, 0100, 1010, 1101 पढ़ता है - पहला bit दूर के cell तक चलता है। हर edge यह एक slide सारे serial data movement का आधार है, UARTs से delay lines तक।",
      visualNote: "ShiftRegisterViz (live) plus a computed walkthrough table: feed 1,0,1,1 into an empty 4-bit register and show Q0..Q3 after each of the four edges."
    },
    {
      id: "S05_Modes",
      label: "The Four I/O Modes",
      kind: "theory",
      subtitle: "SISO / SIPO / PISO / PIPO - the synthesis matrix of write cycles, read cycles and pins.",
      theoryEN: [
        "A shift register can move data in and out either serially, one bit at a time down a single wire, or in parallel, all n bits at once on n wires. Since the input and the output are chosen independently, there are exactly four combinations, and their four-letter names read left to right as input-then-output: SISO, SIPO, PISO and PIPO.",
        "PIPO, parallel-in parallel-out, is the fast one. You load all n bits in a single clock (write = 1 cycle) and read all n bits at once (read = 1 cycle), but it costs the most pins because every bit needs its own input line and its own output line. This is the fast memory buffer - it is essentially the plain buffer register you already built.",
        "SIPO, serial-in parallel-out, takes n clocks to shift the word in one bit at a time (write = n cycles) but presents all bits together once loaded (read = 1 cycle). That makes it the natural serial-to-parallel converter: a receiver clocks a serial stream in over one wire and then reads the assembled word in parallel. PISO, parallel-in serial-out, is the mirror image: load all bits in one clock (write = 1) then shift them out one at a time (read = n cycles), which is exactly what a UART transmitter does - and because it must both accept a parallel load and shift, it needs a Shift/Load control.",
        "SISO, serial-in serial-out, is the frugal one. Data crawls in one bit per clock and crawls out one bit per clock (write = n, read = n), so it is the slowest, but it needs the fewest pins - just one input, one output and the clock. That makes it a delay line or pipeline stage: a bit put in appears at the output exactly n clocks later.",
        "The whole family collapses into one synthesis matrix you should be able to reconstruct from the two independent choices. Serial costs n cycles and saves pins; parallel costs 1 cycle and spends pins. Read the mode's first letter for the write side, its second letter for the read side, and the pins and use-case follow. PIPO for speed, SISO for pin economy, and the two mixed modes SIPO and PISO for converting between the serial and parallel worlds."
      ],
      theoryHI: [
        "एक shift register data को अंदर-बाहर या तो serially हिला सकता है, एक-एक bit एक अकेली wire पर, या parallel में, सभी n bits एक साथ n wires पर। चूँकि input और output स्वतंत्र रूप से चुने जाते हैं, ठीक चार combinations हैं, और उनके चार-अक्षर नाम बाएँ से दाएँ input-फिर-output पढ़े जाते हैं: SISO, SIPO, PISO और PIPO।",
        "PIPO, parallel-in parallel-out, तेज़ वाला है। आप सभी n bits एक अकेले clock में load करते हैं (write = 1 cycle) और सभी n bits एक साथ पढ़ते हैं (read = 1 cycle), पर इसमें सबसे ज़्यादा pins लगते हैं क्योंकि हर bit को अपनी input line और अपनी output line चाहिए। यह fast memory buffer है - यह मूलतः वही सादा buffer register है जो आप पहले बना चुके हैं।",
        "SIPO, serial-in parallel-out, word को एक-एक bit अंदर shift करने में n clocks लेता है (write = n cycles) पर एक बार load होने पर सभी bits एक साथ पेश करता है (read = 1 cycle)। यह इसे स्वाभाविक serial-to-parallel converter बनाता है: एक receiver एक serial stream को एक wire पर clock करके अंदर लाता है फिर जुड़े word को parallel में पढ़ता है। PISO, parallel-in serial-out, दर्पण-छवि है: सभी bits एक clock में load कीजिए (write = 1) फिर उन्हें एक-एक करके बाहर shift कीजिए (read = n cycles), जो ठीक वही है जो एक UART transmitter करता है - और चूँकि इसे एक parallel load स्वीकार भी करना है और shift भी, इसे एक Shift/Load control चाहिए।",
        "SISO, serial-in serial-out, किफ़ायती वाला है। Data एक-एक bit प्रति clock अंदर रेंगता है और एक-एक bit प्रति clock बाहर रेंगता है (write = n, read = n), तो यह सबसे धीमा है, पर इसे सबसे कम pins चाहिए - बस एक input, एक output और clock। यह इसे एक delay line या pipeline stage बनाता है: अंदर डाला एक bit ठीक n clocks बाद output पर आता है।",
        "पूरा परिवार एक synthesis matrix में सिमट जाता है जिसे आप दो स्वतंत्र चुनावों से फिर बना पाने चाहिए। Serial में n cycles लगते हैं और pins बचते हैं; parallel में 1 cycle लगता है और pins ख़र्च होते हैं। write side के लिए mode का पहला अक्षर पढ़िए, read side के लिए दूसरा अक्षर, और pins और use-case पीछे-पीछे आते हैं। गति के लिए PIPO, pin किफ़ायत के लिए SISO, और serial और parallel दुनियाओं के बीच converting के लिए दो मिश्रित modes SIPO और PISO।"
      ],
      transcriptEN: "Data can move serially, one bit on one wire, or in parallel, all n bits at once. Input and output are chosen independently, giving four modes named input-then-output: SISO, SIPO, PISO, PIPO. PIPO is fast - write one cycle, read one cycle - but the most pins; it is the buffer register. SIPO writes in n cycles and reads in one, the serial-to-parallel converter. PISO writes in one and reads in n, the UART transmitter, and needs a Shift/Load control. SISO writes n and reads n, slowest but fewest pins, a delay line. The rule: serial costs n cycles and saves pins, parallel costs one cycle and spends pins; read the first letter for write, the second for read.",
      transcriptHI: "Data serially हिल सकता है, एक bit एक wire पर, या parallel में, सभी n bits एक साथ। Input और output स्वतंत्र रूप से चुने जाते हैं, चार modes देते हुए जो input-फिर-output नामित हैं: SISO, SIPO, PISO, PIPO। PIPO तेज़ है - write एक cycle, read एक cycle - पर सबसे ज़्यादा pins; यह buffer register है। SIPO n cycles में लिखता है और एक में पढ़ता है, serial-to-parallel converter। PISO एक में लिखता है और n में पढ़ता है, UART transmitter, और एक Shift/Load control चाहिए। SISO n लिखता है और n पढ़ता है, सबसे धीमा पर सबसे कम pins, एक delay line। नियम: serial में n cycles और pins बचत, parallel में एक cycle और pins ख़र्च; write के लिए पहला अक्षर, read के लिए दूसरा।",
      visualNote: "ModeSelector: pick SISO/SIPO/PISO/PIPO and see the data-flow (1 wire vs 4 wires on each side), beside the exact synthesis matrix rendered as a computed StateTable (write/read cycles for n=4, pins, use-case)."
    },
    {
      id: "S06_SerialParallel",
      label: "Serial vs Parallel",
      kind: "theory",
      subtitle: "n cycles on one line, or one cycle on n lines - the time-versus-space trade-off.",
      theoryEN: [
        "Strip the four modes down to their single underlying choice and you are left with one law. To move an n-bit word you can either spend time or spend wires, and you cannot avoid spending one of them. Serial transfer uses a single wire but takes n clock cycles; parallel transfer uses n wires but takes one clock cycle. That is the time-versus-space trade-off, and it governs far more than shift registers.",
        "Count it out for the word 1011 on a 4-bit path. Serially, you clock in bit 1, then 0, then 1, then 1 - four cycles down one wire. In parallel, all four bits sit on four separate wires and a single clock loads them together. Same word, same information, but one design pays in time and the other pays in physical lines.",
        "Notice the product is conserved. Serial is one wire times n cycles; parallel is n wires times one cycle; both equal n wire-cycles of cost. You are not getting something for nothing when you go parallel - you are trading a resource you have plenty of (cycles) for one that is scarce (pins and board traces), or the reverse.",
        "That is exactly why real systems mix them. Inside a chip, where wires are almost free, buses are wide and parallel for speed. The moment a signal has to leave the chip, cross a cable, or travel any distance, wires become expensive and error-prone, so the data is serialised onto one or two lines - which is why USB, PCIe, SATA, Ethernet and HDMI are all fast serial links, not hundred-wire parallel ribbons.",
        "So the shift register is the hinge between these two worlds. A SIPO register deserialises an incoming stream back into a parallel word for the chip to use; a PISO register serialises a parallel word for transmission. Understanding this one trade-off tells you why every interface you touch made the choice it did."
      ],
      theoryHI: [
        "चार modes को उनके अकेले अंतर्निहित चुनाव तक छीलिए और आपके पास एक नियम बचता है। एक n-bit word हिलाने के लिए आप या तो समय ख़र्च कर सकते हैं या wires, और आप उनमें से एक ख़र्च किए बिना नहीं रह सकते। Serial transfer एक अकेली wire वापरता है पर n clock cycles लेता है; parallel transfer n wires वापरता है पर एक clock cycle लेता है। यही time-बनाम-space trade-off है, और यह shift registers से कहीं ज़्यादा को शासित करता है।",
        "4-bit path पर word 1011 के लिए गिन लीजिए। Serially, आप bit 1, फिर 0, फिर 1, फिर 1 clock करते हैं - एक wire पर चार cycles। Parallel में, चारों bits चार अलग wires पर बैठे हैं और एक अकेला clock उन्हें एक साथ load करता है। वही word, वही जानकारी, पर एक design समय में चुकाता है और दूसरा भौतिक lines में।",
        "ग़ौर कीजिए गुणनफल संरक्षित है। Serial एक wire गुणा n cycles है; parallel n wires गुणा एक cycle है; दोनों बराबर n wire-cycles लागत। Parallel जाने पर आप मुफ़्त में कुछ नहीं पा रहे - आप एक ऐसा संसाधन जो आपके पास बहुत है (cycles) एक दुर्लभ संसाधन (pins और board traces) के बदले trade कर रहे हैं, या उलटा।",
        "इसीलिए असली systems इन्हें मिलाते हैं। एक chip के अंदर, जहाँ wires लगभग मुफ़्त हैं, buses गति के लिए चौड़े और parallel हैं। जिस पल एक signal को chip छोड़ना पड़े, एक cable पार करना, या कोई दूरी तय करनी हो, wires महँगे और त्रुटि-प्रवण हो जाते हैं, तो data एक या दो lines पर serialise कर दिया जाता है - इसीलिए USB, PCIe, SATA, Ethernet और HDMI सब तेज़ serial links हैं, सौ-wire वाले parallel ribbons नहीं।",
        "तो shift register इन दो दुनियाओं के बीच का कब्ज़ा है। एक SIPO register एक आती stream को chip के उपयोग के लिए वापस एक parallel word में deserialise करता है; एक PISO register एक parallel word को transmission के लिए serialise करता है। यह एक trade-off समझना आपको बताता है कि आप जिस भी interface को छूते हैं उसने वह चुनाव क्यों किया।"
      ],
      transcriptEN: "Underneath the four modes is one law: to move an n-bit word you spend either time or wires. Serial uses one wire but n cycles; parallel uses n wires but one cycle. The product is conserved - both cost n wire-cycles - so parallel just trades plentiful cycles for scarce pins. That is why chips use wide parallel buses inside, where wires are cheap, but serialise onto one or two lines to leave the chip: USB, PCIe, SATA, Ethernet and HDMI are all serial. The shift register is the hinge - SIPO deserialises a stream into a word, PISO serialises a word for transmission.",
      transcriptHI: "चार modes के नीचे एक नियम है: एक n-bit word हिलाने के लिए आप या तो समय या wires ख़र्च करते हैं। Serial एक wire पर n cycles; parallel n wires पर एक cycle। गुणनफल संरक्षित है - दोनों n wire-cycles - तो parallel बस बहुतायत cycles को दुर्लभ pins के बदले trade करता है। इसीलिए chips अंदर चौड़े parallel buses वापरते हैं, जहाँ wires सस्ते हैं, पर chip छोड़ने को एक या दो lines पर serialise करते हैं: USB, PCIe, SATA, Ethernet और HDMI सब serial हैं। Shift register कब्ज़ा है - SIPO एक stream को word में deserialise करता है, PISO एक word को transmission के लिए serialise करता है।",
      visualNote: "SerialVsParallel: load the same word 1011 two ways - a serial loader that fills one bit per tick over four ticks, and a parallel loader that fills all four in one tick - with the computed cycle/wire counts and the conserved product."
    },
    {
      id: "S07_Recirculate",
      label: "Destructive vs Recirculating Read",
      kind: "theory",
      subtitle: "A serial read shifts data out and loses it - unless a MUX feeds serial-out back to serial-in.",
      theoryEN: [
        "There is a hidden cost to reading a shift register serially: it is destructive. To get the word out you have to shift it, and shifting pushes bits off the far end while pulling new bits (usually zeros) in the near end. After n clocks the original word has left the building - the register now holds whatever came in behind it. You read it once and it is gone.",
        "Sometimes that is fine, but often you want to read a stored word AND still keep it - to inspect a value, cycle it through some logic, and put it back unchanged. The trick is to stop throwing the shifted-out bit away. Route the serial output back around to the serial input, so the bit that falls off the far end is exactly the bit that enters the near end. Now nothing is lost; the word just rotates within the register.",
        "You do not want that feedback wired permanently, though, or you could never load new data. So you put a 2-to-1 MUX on the serial input. One MUX input is the external serial-in (normal load/shift); the other is the register's own serial-out (the feedback). A single control line - call it Recirculate - selects between them: Recirculate=0 shifts fresh external data in, Recirculate=1 loops the word around on itself.",
        "Trace it on 1011 in recirculate mode. The last cell's bit is fed back to the first, so each clock rotates the pattern by one position. After exactly n clocks - four, here - every bit has made a full lap and the register reads 1011 again, identical to where it started. The read was non-destructive: you saw all four bits pass the serial output, yet the stored word survived intact.",
        "This recirculating shift register is a genuinely useful building block. It is how you build a circulating memory or a repeating waveform generator, how a bit pattern can be presented over and over on a single line, and it is the same feedback idea that, with a small twist in what you feed back, turns an ordinary shift register into a ring or Johnson counter later in the track."
      ],
      theoryHI: [
        "एक shift register को serially पढ़ने की एक छिपी लागत है: यह destructive है। Word बाहर पाने के लिए आपको इसे shift करना पड़ता है, और shifting bits को दूर सिरे से धकेलती है जबकि नए bits (आमतौर पर zeros) पास सिरे में खींचती है। n clocks बाद मूल word इमारत छोड़ चुका है - register अब वही रखता है जो उसके पीछे आया। आप इसे एक बार पढ़ते हैं और यह चला जाता है।",
        "कभी-कभी यह ठीक है, पर अक्सर आप एक store किया word पढ़ना भी चाहते हैं और उसे रखना भी - एक मान की जाँच करना, उसे कुछ logic से चक्कर लगवाना, और उसे बिना बदले वापस रख देना। तरकीब है shift-हुए-बाहर bit को फेंकना बंद करना। serial output को घुमाकर serial input में वापस route कीजिए, ताकि जो bit दूर सिरे से गिरता है वही bit पास सिरे में घुसे। अब कुछ नहीं खोता; word बस register के भीतर घूमता है।",
        "पर आप वह feedback स्थायी रूप से wired नहीं चाहते, वरना आप कभी नया data load नहीं कर पाएँगे। तो आप serial input पर एक 2-to-1 MUX लगाते हैं। एक MUX input external serial-in है (सामान्य load/shift); दूसरा register का अपना serial-out है (feedback)। एक अकेली control line - इसे Recirculate कहिए - इनके बीच चुनती है: Recirculate=0 ताज़ा external data अंदर shift करता है, Recirculate=1 word को अपने ऊपर loop करता है।",
        "recirculate mode में 1011 पर trace कीजिए। आख़िरी cell का bit पहले को वापस feed होता है, तो हर clock pattern को एक position घुमाता है। ठीक n clocks बाद - यहाँ चार - हर bit एक पूरा चक्कर लगा चुका है और register फिर से 1011 पढ़ता है, ठीक वहीं जहाँ से शुरू हुआ। Read non-destructive था: आपने चारों bits को serial output से गुज़रते देखा, फिर भी store किया word अक्षुण्ण बचा।",
        "यह recirculating shift register सचमुच उपयोगी building block है। यही है कैसे आप एक circulating memory या एक दोहराता waveform generator बनाते हैं, कैसे एक bit pattern एक अकेली line पर बार-बार पेश किया जा सकता है, और यही वही feedback विचार है जो, आप क्या वापस feed करते हैं उसमें एक छोटे मोड़ के साथ, आगे track में एक साधारण shift register को ring या Johnson counter बना देता है।"
      ],
      transcriptEN: "Reading a shift register serially is destructive: shifting the word out pulls new bits in behind it, so after n clocks the original is gone. To read without losing, feed the serial output back to the serial input, so the bit falling off the far end re-enters the near end - the word just rotates. Put a 2-to-1 MUX on the serial input: Recirculate=0 shifts external data in, Recirculate=1 loops the word on itself. On 1011, each clock rotates by one, and after n clocks it reads 1011 again - a non-destructive read. This is how you build circulating memories, and the same feedback becomes a ring or Johnson counter later.",
      transcriptHI: "एक shift register को serially पढ़ना destructive है: word को बाहर shift करना उसके पीछे नए bits खींचता है, तो n clocks बाद मूल चला जाता है। बिना खोए पढ़ने को, serial output को serial input में वापस feed कीजिए, ताकि दूर सिरे से गिरता bit पास सिरे में फिर घुसे - word बस घूमता है। serial input पर एक 2-to-1 MUX लगाइए: Recirculate=0 external data अंदर shift करता है, Recirculate=1 word को अपने ऊपर loop करता है। 1011 पर, हर clock एक घुमाता है, और n clocks बाद यह फिर 1011 पढ़ता है - एक non-destructive read। यही है कैसे आप circulating memories बनाते हैं, और वही feedback आगे ring या Johnson counter बनता है।",
      visualNote: "Recirculate: a 4-bit register with a MUX on the serial input; toggle Recirculate, press the clock, and watch the word either shift out to zeros (destructive) or rotate back to itself after n clocks (non-destructive)."
    },
    {
      id: "S08_Universal",
      label: "The Universal Shift Register",
      kind: "theory",
      subtitle: "One mode control does it all: hold, shift-left, shift-right, and parallel-load.",
      theoryEN: [
        "So far each capability needed its own wiring: one register shifts right, another shifts left, a buffer just holds, a PIPO loads in parallel. The universal shift register rolls all four into one block by putting a small multiplexer in front of every flip-flop and steering them together with a shared mode control, usually two select bits S1 S0.",
        "The four operations map cleanly onto the two control bits. S1S0 = 00 is HOLD: each flip-flop reloads its own output, so the word stays put. S1S0 = 01 is SHIFT RIGHT: each cell takes its left neighbour and a fresh bit enters at the right-shift serial input. S1S0 = 10 is SHIFT LEFT: each cell takes its right neighbour and a fresh bit enters at the left-shift serial input. S1S0 = 11 is PARALLEL LOAD: every flip-flop takes its own external data line, loading a whole word in one clock.",
        "The mechanism is just four MUX inputs per cell. Each flip-flop's D is driven by a 4-to-1 MUX whose select is S1 S0, choosing among {its own Q, its right neighbour, its left neighbour, its parallel-data bit}. Because all the MUXes share S1 S0, one command reconfigures the entire register on the fly, edge to edge, with no rewiring - the classic 74194 chip is exactly this, four bits wide.",
        "Watch it compute on a live word. Load a pattern in parallel with S1S0=11, then set S1S0=01 and each tick slides it right; flip to 10 and it slides back left; drop to 00 and it freezes wherever it is. Every next-word is produced by applying the selected operation to the current bit array, so nothing is memorised - the register genuinely transforms its own contents according to the mode.",
        "This is why the universal shift register is the workhorse behind so much real logic. Serial-to-parallel and parallel-to-serial conversion, arithmetic shifts for multiply and divide, bit rotations, and the datapaths inside simple processors all lean on a block that can hold, shift either way, or load on command - all selected by a couple of control bits."
      ],
      theoryHI: [
        "अब तक हर क्षमता को अपनी wiring चाहिए थी: एक register दाएँ shift करता है, दूसरा बाएँ, एक buffer बस होल्ड करता है, एक PIPO parallel में load करता है। Universal shift register चारों को एक block में समेट देता है, हर flip-flop के आगे एक छोटा multiplexer रखकर और उन्हें एक साझा mode control से साथ steer करके, आमतौर पर दो select bits S1 S0।",
        "चार operations दो control bits पर साफ़ mapping करते हैं। S1S0 = 00 HOLD है: हर flip-flop अपना ही output फिर load करता है, तो word वहीं रहता है। S1S0 = 01 SHIFT RIGHT है: हर cell अपना बायाँ पड़ोसी लेता है और एक ताज़ा bit right-shift serial input पर घुसता है। S1S0 = 10 SHIFT LEFT है: हर cell अपना दायाँ पड़ोसी लेता है और एक ताज़ा bit left-shift serial input पर घुसता है। S1S0 = 11 PARALLEL LOAD है: हर flip-flop अपनी external data line लेता है, एक clock में पूरा word load करते हुए।",
        "तंत्र बस हर cell पर चार MUX inputs है। हर flip-flop का D एक 4-to-1 MUX से चलता है जिसका select S1 S0 है, {अपना Q, दायाँ पड़ोसी, बायाँ पड़ोसी, अपना parallel-data bit} में से चुनते हुए। चूँकि सब MUXes S1 S0 साझा करते हैं, एक आदेश पूरे register को चलते-चलते, edge-दर-edge, बिना re-wiring के फिर configure करता है - classic 74194 chip ठीक यही है, चार bits चौड़ा।",
        "इसे एक live word पर compute होते देखिए। S1S0=11 से एक pattern parallel में load कीजिए, फिर S1S0=01 सेट कीजिए और हर tick इसे दाएँ सरकाता है; 10 पर पलटिए और यह वापस बाएँ सरकता है; 00 पर गिराइए और यह जहाँ है वहीं जम जाता है। हर अगला-word मौजूदा bit array पर चुने operation को लगाकर बनता है, तो कुछ याद नहीं रखा जाता - register सचमुच mode के अनुसार अपने contents को बदलता है।",
        "इसीलिए universal shift register इतनी असली logic के पीछे का workhorse है। Serial-to-parallel और parallel-to-serial conversion, गुणा और भाग के लिए arithmetic shifts, bit rotations, और सादे processors के अंदर datapaths सब एक ऐसे block पर टिके हैं जो होल्ड कर सके, किसी भी तरफ़ shift कर सके, या आदेश पर load कर सके - सब कुछ दो control bits से चुना गया।"
      ],
      transcriptEN: "The universal shift register folds four operations into one block by putting a mux in front of every flip-flop and steering them with two select bits S1 S0. 00 holds - each cell reloads its own Q. 01 shifts right, a bit entering at the right-shift input. 10 shifts left. 11 parallel-loads every cell from its data line. Each D is a 4-to-1 mux choosing its own Q, its right neighbour, its left neighbour, or its parallel bit; sharing S1 S0 reconfigures the whole register edge to edge - that is the 74194. Load a word, shift it right, back left, then freeze - every next-word is computed from the current bits. It powers serial conversion, arithmetic shifts and processor datapaths.",
      transcriptHI: "Universal shift register चार operations को एक block में समेटता है, हर flip-flop के आगे एक mux रखकर और दो select bits S1 S0 से steer करके। 00 होल्ड - हर cell अपना Q फिर load करता है। 01 दाएँ shift, एक bit right-shift input पर घुसते हुए। 10 बाएँ shift। 11 हर cell को उसकी data line से parallel-load। हर D एक 4-to-1 mux है जो अपना Q, दायाँ पड़ोसी, बायाँ पड़ोसी, या अपना parallel bit चुनता है; S1 S0 साझा करना पूरे register को edge-दर-edge फिर configure करता है - वही 74194 है। एक word load कीजिए, दाएँ shift, वापस बाएँ, फिर freeze - हर अगला-word मौजूदा bits से compute होता है। यह serial conversion, arithmetic shifts और processor datapaths को चलाता है।",
      visualNote: "UniversalShiftRegister: set S1 S0 to hold / shift-right / shift-left / parallel-load, feed serial-in bits or parallel data, and press the clock to see the next word computed from the live bit array."
    },
    {
      id: "S09_Analogy",
      label: "The Bucket Brigade",
      kind: "theory",
      subtitle: "A line of people passing water hand to hand - each hand is one D flip-flop.",
      theoryEN: [
        "Picture an old-fashioned bucket brigade fighting a fire: a line of people standing shoulder to shoulder, passing a bucket of water from one pair of hands to the next. Nobody runs anywhere; each person just hands their bucket to the neighbour on their right and receives a new bucket from the neighbour on their left. That single, synchronised pass is exactly a shift register clock edge.",
        "Map it bit for bit. Each person is one D flip-flop, and the bucket they are currently holding is that flip-flop's stored bit - full bucket for a 1, empty bucket for a 0. The person at the head of the line is fed fresh buckets from the well; that is the serial input. The person at the far end tips their bucket onto the fire and it is gone; that is the serial output, and it is why an unread serial shift is destructive.",
        "The common clock is the captain's whistle. When the captain blows once, everyone passes simultaneously - not one at a time, but all together on the same beat. That simultaneity is the whole point of the shared clock: because everyone hands over at the same instant, each person passes the bucket they were holding, not one that has already moved, and the line of water advances cleanly by one position.",
        "The analogy even explains recirculating. If, instead of throwing the last bucket onto the fire, the person at the end passes it back up to the head of the line, no water is ever lost - the same buckets just circle the brigade forever. That loop is precisely the MUX that feeds serial-out back to serial-in for a non-destructive read.",
        "Hold this picture whenever the wiring gets abstract. A register is a row of hands each holding one bit; a clock edge is one synchronised pass; serial means single-file down the line, parallel means everyone drawing from the well at once. The bucket brigade is a shift register you can see."
      ],
      theoryHI: [
        "एक पुराने ज़माने की bucket brigade सोचिए जो आग बुझा रही है: कंधे से कंधा मिलाकर खड़े लोगों की एक पंक्ति, पानी की एक बाल्टी एक जोड़ी हाथों से अगली को पास करती। कोई कहीं नहीं दौड़ता; हर व्यक्ति बस अपनी बाल्टी दाईं ओर के पड़ोसी को थमाता है और बाईं ओर के पड़ोसी से एक नई बाल्टी पाता है। वह एक अकेला, synchronised पास ठीक एक shift register clock edge है।",
        "इसे bit-दर-bit map कीजिए। हर व्यक्ति एक D flip-flop है, और जो बाल्टी वे इस समय पकड़े हैं वह उस flip-flop का store किया bit है - 1 के लिए भरी बाल्टी, 0 के लिए ख़ाली। पंक्ति के सिर पर खड़े व्यक्ति को कुएँ से ताज़ी बाल्टियाँ दी जाती हैं; वह serial input है। दूर सिरे पर खड़ा व्यक्ति अपनी बाल्टी आग पर उँडेल देता है और वह चली जाती है; वह serial output है, और इसीलिए एक बिना-पढ़ा serial shift destructive है।",
        "Common clock captain की सीटी है। जब captain एक बार सीटी बजाता है, हर कोई एक साथ पास करता है - एक-एक करके नहीं, बल्कि सब एक ही ताल पर। वह एक-साथपन साझा clock का पूरा मक़सद है: चूँकि हर कोई उसी पल थमाता है, हर व्यक्ति वही बाल्टी पास करता है जो वे पकड़े थे, वह नहीं जो पहले ही हिल चुकी है, और पानी की पंक्ति साफ़-साफ़ एक position आगे बढ़ती है।",
        "यह analogy recirculating भी समझाता है। अगर, आख़िरी बाल्टी आग पर फेंकने के बजाय, सिरे का व्यक्ति उसे वापस पंक्ति के सिर पर पास कर दे, कोई पानी कभी नहीं खोता - वही बाल्टियाँ बस brigade का चक्कर हमेशा लगाती रहती हैं। वह loop ठीक वही MUX है जो एक non-destructive read के लिए serial-out को serial-in में वापस feed करता है।",
        "जब भी wiring अमूर्त हो जाए यह तस्वीर पकड़े रखिए। Register हाथों की एक पंक्ति है हर एक एक bit पकड़े; एक clock edge एक synchronised पास है; serial यानी पंक्ति में single-file, parallel यानी हर कोई एक साथ कुएँ से खींचता। Bucket brigade एक shift register है जिसे आप देख सकते हैं।"
      ],
      transcriptEN: "Picture a bucket brigade: a line of people passing water hand to hand, each handing their bucket right and receiving one from the left. That synchronised pass is one shift-register clock edge. Each person is a D flip-flop; their bucket is the stored bit. The head is fed from the well - the serial input; the far end tips water on the fire - the serial output, which is why an unread serial read is destructive. The captain's whistle is the common clock: everyone passes at once, so each hands over the bucket they held, and the water advances by one. Pass the last bucket back to the head instead, and nothing is lost - that loop is the recirculating MUX.",
      transcriptHI: "एक bucket brigade सोचिए: पानी हाथ से हाथ पास करते लोगों की पंक्ति, हर एक अपनी बाल्टी दाएँ थमाता और बाएँ से एक पाता। वह synchronised पास एक shift-register clock edge है। हर व्यक्ति एक D flip-flop है; उनकी बाल्टी store किया bit है। सिर को कुएँ से दिया जाता है - serial input; दूर सिरा पानी आग पर उँडेलता है - serial output, इसीलिए एक बिना-पढ़ा serial read destructive है। Captain की सीटी common clock है: हर कोई एक साथ पास करता है, तो हर एक वही बाल्टी थमाता है जो पकड़े था, और पानी एक से आगे बढ़ता है। आख़िरी बाल्टी सिर पर वापस पास कीजिए, और कुछ नहीं खोता - वह loop recirculating MUX है।",
      visualNote: "BucketBrigade: a row of people (hands) each holding a bucket (bit); press the clock and every bucket passes one position right, a fresh one entering from the well and the last tipping onto the fire."
    },
    {
      id: "S10_Build",
      label: "Build A Shift Register",
      kind: "theory",
      subtitle: "Wire four D flip-flops into a chain on the workbench and shift a word through them.",
      theoryEN: [
        "You now have every idea you need to build a shift register with your own hands, so head to the workbench and wire one up. Start from four D flip-flops in a row and give them all the same clock - that alone is a 4-bit register.",
        "Then make it shift: connect the output Q of each flip-flop to the D input of the next one down the chain, leaving the first D free as the serial input and taking the last Q as the serial output. That is the entire shift register - the magic is only in the wiring between the cells.",
        "Drive it and prove the theory. Put a bit on the serial input, pulse the clock, and watch it appear at Q0; keep clocking and watch that bit march one stage per edge until it falls off the serial output four ticks later. Feed 1, 0, 1, 1 and confirm the register walks through 1000, 0100, 1010, 1101 exactly as the walkthrough showed.",
        "If you want to go further, add a load-enable MUX on each D input to build a buffer, or a mode control to approach the universal register - but even the bare four-flip-flop chain is enough to feel, physically, why the whole word slides one place on every single clock edge."
      ],
      theoryHI: [
        "अब आपके पास हर वह विचार है जो अपने हाथों से एक shift register बनाने को चाहिए, तो workbench पर जाइए और एक wire कीजिए। एक पंक्ति में चार D flip-flops से शुरू कीजिए और उन सबको एक ही clock दीजिए - वह अकेला एक 4-bit register है।",
        "फिर इसे shift कराइए: हर flip-flop के output Q को chain में अगले के D input से जोड़िए, पहले D को serial input के रूप में मुक्त छोड़ते हुए और आख़िरी Q को serial output के रूप में लेते हुए। वही पूरा shift register है - जादू सिर्फ़ cells के बीच की wiring में है।",
        "इसे चलाइए और theory साबित कीजिए। serial input पर एक bit रखिए, clock pulse कीजिए, और उसे Q0 पर आते देखिए; clock करते रहिए और उस bit को हर edge एक stage march करते देखिए जब तक वह चार ticks बाद serial output से न गिर जाए। 1, 0, 1, 1 feed कीजिए और पुष्टि कीजिए कि register ठीक walkthrough की तरह 1000, 0100, 1010, 1101 से गुज़रता है।",
        "अगर आप और आगे जाना चाहें, एक buffer बनाने को हर D input पर एक load-enable MUX जोड़िए, या universal register के पास पहुँचने को एक mode control - पर नंगी चार-flip-flop chain भी काफ़ी है भौतिक रूप से महसूस करने को कि पूरा word हर एक clock edge पर एक जगह क्यों सरकता है।"
      ],
      transcriptEN: "Head to the workbench and build a shift register. Start with four D flip-flops on a shared clock - that is a 4-bit register. Then chain them: each flip-flop's Q into the next flip-flop's D, the first D as serial input, the last Q as serial output. Drive a bit into the serial input and watch it march one stage per edge, falling off four ticks later. Feed 1,0,1,1 and confirm 1000, 0100, 1010, 1101. Add a load-enable mux for a buffer, or a mode control toward the universal register.",
      transcriptHI: "Workbench पर जाइए और एक shift register बनाइए। एक साझा clock पर चार D flip-flops से शुरू कीजिए - वह एक 4-bit register है। फिर उन्हें chain कीजिए: हर flip-flop का Q अगले flip-flop के D में, पहला D serial input, आख़िरी Q serial output। serial input में एक bit चलाइए और उसे हर edge एक stage march करते देखिए, चार ticks बाद गिरते हुए। 1,0,1,1 feed कीजिए और 1000, 0100, 1010, 1101 पुष्टि कीजिए। एक buffer को load-enable mux जोड़िए, या universal register की ओर एक mode control।",
      visualNote: "WorkbenchCTA: open the live workbench and wire four D flip-flops into a shift-register chain on a common clock, then shift 1011 through and read every stage."
    },
    {
      id: "S11_Flashcards",
      label: "Flip To Remember",
      kind: "flashcards",
      subtitle: "Eight cards on registers, buffering, shifting, the four modes and recirculation.",
      theoryEN: [
        "Flip each card to turn a term into the real logic behind it.",
        "Registers, buffers, shift registers, the four I/O modes, recirculation and the universal shift register - the whole module on eight cards."
      ],
      theoryHI: [
        "हर card पलटकर एक पद को उसके पीछे की असली logic में बदलिए।",
        "Registers, buffers, shift registers, चार I/O modes, recirculation और universal shift register - पूरा module आठ cards पर।"
      ],
      transcriptEN: "Flip each card to test yourself on registers, buffers, shift registers, the four modes and recirculation.",
      transcriptHI: "Registers, buffers, shift registers, चार modes और recirculation पर ख़ुद को परखने को हर card पलटिए।",
      visualNote: "Eight flip cards, term on the front, the real logic on the back."
    },
    {
      id: "S12_Quiz",
      label: "Prove You've Got It",
      kind: "quiz",
      subtitle: "Seven questions across registers, buffering, shifting, the modes and recirculation.",
      theoryEN: [
        "Seven questions to check every idea in the module.",
        "Definitions, the Load enable, the shift mechanic, the mode matrix, the time-space trade-off, recirculation and the universal register."
      ],
      theoryHI: [
        "Module के हर विचार को जाँचने को सात सवाल।",
        "परिभाषाएँ, Load enable, shift mechanic, mode matrix, time-space trade-off, recirculation और universal register।"
      ],
      transcriptEN: "Seven questions across definitions, the Load enable, shifting, the mode matrix, the trade-off, recirculation and the universal register.",
      transcriptHI: "परिभाषाएँ, Load enable, shifting, mode matrix, trade-off, recirculation और universal register पर सात सवाल।",
      visualNote: "A seven-question quiz with per-question explanations."
    },
    {
      id: "S13_Recap",
      label: "The Whole Row, In One Breath",
      kind: "recap",
      subtitle: "From one clocked cell to a universal shift register.",
      theoryEN: [
        "A register is n flip-flops on a common clock, one per bit, storing an n-bit word that updates all at once on the same edge - the fundamental storage element of every processor.",
        "A buffer register adds a Load enable that acts like a drawbridge on the clock: Load=1 accepts new data, Load=0 holds; wired per-row from an address decoder, that is how a register file or RAM writes one chosen row.",
        "Chain the flip-flops output-to-input and the whole word shifts one position per clock edge. How you move data in and out gives the four modes - PIPO (fast, most pins), SIPO (serial-to-parallel), PISO (parallel-to-serial, needs Shift/Load), SISO (fewest pins, a delay line) - and underneath sits one law: serial spends n cycles to save wires, parallel spends wires to save cycles.",
        "A serial read is destructive unless a MUX feeds the serial-out back to the serial-in, rotating the word non-destructively. Put a mux in front of every cell steered by two select bits and you get the universal shift register: hold, shift-right, shift-left or parallel-load, all on command - the 74194 and the backbone of real datapaths."
      ],
      theoryHI: [
        "Register एक common clock पर n flip-flops है, हर bit के लिए एक, एक n-bit word store करता जो उसी edge पर एक साथ update होता है - हर processor का बुनियादी storage element।",
        "Buffer register एक Load enable जोड़ता है जो clock पर एक drawbridge की तरह काम करता है: Load=1 नया data स्वीकार करता है, Load=0 होल्ड करता है; एक address decoder से हर-row wired, वही है कैसे एक register file या RAM एक चुनी row लिखता है।",
        "Flip-flops को output-से-input chain कीजिए और पूरा word हर clock edge पर एक position shift होता है। आप data को अंदर-बाहर कैसे हिलाते हैं यह चार modes देता है - PIPO (तेज़, सबसे ज़्यादा pins), SIPO (serial-to-parallel), PISO (parallel-to-serial, Shift/Load चाहिए), SISO (सबसे कम pins, एक delay line) - और नीचे एक नियम बैठा है: serial wires बचाने को n cycles ख़र्च करता है, parallel cycles बचाने को wires ख़र्च करता है।",
        "एक serial read destructive है जब तक एक MUX serial-out को serial-in में वापस न feed करे, word को non-destructively घुमाते हुए। हर cell के आगे दो select bits से steer किया एक mux रखिए और आपको universal shift register मिलता है: होल्ड, shift-right, shift-left या parallel-load, सब आदेश पर - वही 74194 और असली datapaths की रीढ़।"
      ],
      transcriptEN: "A register is n flip-flops on one clock holding an n-bit word. A Load enable makes it a buffer that holds or accepts, the basis of register files and RAM. Chain the cells and the word shifts one place per edge; the four modes PIPO, SIPO, PISO, SISO trade cycles against pins under the time-space law. A MUX feeding serial-out back to serial-in makes the read non-destructive, and a mux per cell under two select bits gives the universal shift register - hold, shift either way, or load, all on command.",
      transcriptHI: "Register एक clock पर n flip-flops है जो एक n-bit word रखता है। एक Load enable इसे एक buffer बनाता है जो होल्ड या स्वीकार करता है, register files और RAM का आधार। Cells को chain कीजिए और word हर edge पर एक जगह shift होता है; चार modes PIPO, SIPO, PISO, SISO time-space नियम के तहत cycles को pins के बदले trade करते हैं। एक MUX serial-out को serial-in में वापस feed करके read को non-destructive बनाता है, और दो select bits के तहत हर cell पर एक mux universal shift register देता है - होल्ड, किसी भी तरफ़ shift, या load, सब आदेश पर।",
      visualNote: "Recap: the flow rail plus a plain-language summary from one clocked cell to the universal shift register."
    }
  ],
  flashcards: [
    {
      frontEN: "Register",
      backEN: "A group of n flip-flops sharing one common clock, one flip-flop per bit, storing an n-bit word. Because every cell is triggered by the same edge, all bits are captured in the same instant - the fundamental storage element of every processor.",
      frontHI: "Register",
      backHI: "n flip-flops का एक समूह जो एक common clock साझा करता है, हर bit के लिए एक flip-flop, एक n-bit word store करते हुए। चूँकि हर cell उसी edge से trigger होता है, सभी bits उसी पल में पकड़े जाते हैं - हर processor का बुनियादी storage element।"
    },
    {
      frontEN: "Buffer register & Load",
      backEN: "A register plus a Load (enable) line that acts like a drawbridge on the clock: Load=1 accepts new data on the next edge, Load=0 holds the word. Built by gating the clock, or safer, a mux on each D that feeds Q back when Load=0.",
      frontHI: "Buffer register और Load",
      backHI: "एक register जमा एक Load (enable) line जो clock पर एक drawbridge की तरह काम करती है: Load=1 अगले edge पर नया data स्वीकार करता है, Load=0 word को होल्ड करता है। clock को gate करके बना, या सुरक्षित, हर D पर एक mux जो Load=0 पर Q वापस feed करे।"
    },
    {
      frontEN: "Shift register",
      backEN: "Flip-flops chained output-to-input on a common clock, so on every edge the whole word slides one position. Each cell takes its neighbour's OLD value because all sample the same edge - a clean shift by one. A new bit enters the serial input, the oldest leaves the serial output.",
      frontHI: "Shift register",
      backHI: "एक common clock पर output-से-input chained flip-flops, तो हर edge पर पूरा word एक position सरकता है। हर cell अपने पड़ोसी का पुराना मान लेता है क्योंकि सब उसी edge पर sample करते हैं - एक साफ़ एक-का shift। एक नया bit serial input में घुसता है, सबसे पुराना serial output से निकलता है।"
    },
    {
      frontEN: "The four I/O modes",
      backEN: "SISO, SIPO, PISO, PIPO - named input-then-output. PIPO: write 1 cycle, read 1 cycle, most pins (fast buffer). SIPO: write n, read 1 (serial-to-parallel). PISO: write 1, read n (parallel-to-serial, needs Shift/Load). SISO: write n, read n, fewest pins (delay line).",
      frontHI: "चार I/O modes",
      backHI: "SISO, SIPO, PISO, PIPO - input-फिर-output नामित। PIPO: write 1 cycle, read 1 cycle, सबसे ज़्यादा pins (fast buffer)। SIPO: write n, read 1 (serial-to-parallel)। PISO: write 1, read n (parallel-to-serial, Shift/Load चाहिए)। SISO: write n, read n, सबसे कम pins (delay line)।"
    },
    {
      frontEN: "Time-vs-space trade-off",
      backEN: "To move an n-bit word you spend either time or wires. Serial = 1 wire but n cycles; parallel = n wires but 1 cycle. The product (n wire-cycles) is conserved. Chips go parallel inside where wires are cheap, and serial off-chip (USB, PCIe, SATA, Ethernet).",
      frontHI: "Time-बनाम-space trade-off",
      backHI: "एक n-bit word हिलाने को आप या तो समय या wires ख़र्च करते हैं। Serial = 1 wire पर n cycles; parallel = n wires पर 1 cycle। गुणनफल (n wire-cycles) संरक्षित है। Chips अंदर parallel जाते हैं जहाँ wires सस्ते, और off-chip serial (USB, PCIe, SATA, Ethernet)।"
    },
    {
      frontEN: "Destructive vs recirculating read",
      backEN: "A serial read shifts the word out and loses it - after n clocks the original is gone. Route serial-out back to serial-in through a MUX (Recirculate=1) and the word rotates instead: after n clocks it reads identically, a non-destructive read.",
      frontHI: "Destructive बनाम recirculating read",
      backHI: "एक serial read word को बाहर shift करके खो देता है - n clocks बाद मूल चला जाता है। serial-out को एक MUX से serial-in में वापस route कीजिए (Recirculate=1) और word इसके बजाय घूमता है: n clocks बाद यह ठीक वैसा ही पढ़ता है, एक non-destructive read।"
    },
    {
      frontEN: "Universal shift register",
      backEN: "A mux in front of every flip-flop, all steered by two select bits S1 S0: 00 hold, 01 shift-right, 10 shift-left, 11 parallel-load. One command reconfigures the whole register edge to edge - the classic 74194, the backbone of serial conversion and processor datapaths.",
      frontHI: "Universal shift register",
      backHI: "हर flip-flop के आगे एक mux, सब दो select bits S1 S0 से steered: 00 होल्ड, 01 shift-right, 10 shift-left, 11 parallel-load। एक आदेश पूरे register को edge-दर-edge फिर configure करता है - classic 74194, serial conversion और processor datapaths की रीढ़।"
    },
    {
      frontEN: "Common clock (lockstep)",
      backEN: "Every flip-flop in a register shares the same clock edge, so all n bits update at the same instant - no bit lands early or late. This lockstep is what lets a group of cells represent one coherent number, address or instruction.",
      frontHI: "Common clock (lockstep)",
      backHI: "एक register में हर flip-flop उसी clock edge को साझा करता है, तो सभी n bits उसी पल में update होते हैं - कोई bit जल्दी या देर से नहीं उतरता। यही lockstep cells के एक समूह को एक सुसंगत संख्या, address या instruction दर्शाने देता है।"
    }
  ],
  quiz: [
    {
      questionEN: "What exactly is an n-bit register?",
      questionHI: "एक n-bit register ठीक-ठीक क्या है?",
      options: [
        "n flip-flops on a common clock, one flip-flop per bit",
        "One flip-flop clocked n times",
        "n logic gates with no clock",
        "A single flip-flop that stores n bits"
      ],
      answerIndex: 0,
      explainEN: "A register is n flip-flops sharing one common clock, with one flip-flop dedicated to each bit, so an n-bit word is captured together on the same edge.",
      explainHI: "Register एक common clock साझा करते n flip-flops है, हर bit के लिए एक flip-flop समर्पित, तो एक n-bit word उसी edge पर एक साथ पकड़ा जाता है।"
    },
    {
      questionEN: "In a buffer register, what does Load=0 do?",
      questionHI: "एक buffer register में, Load=0 क्या करता है?",
      options: [
        "Holds the stored word - the clock is gated so new data is ignored",
        "Loads the new data on the next edge",
        "Clears the register to all zeros",
        "Shifts the word one position right"
      ],
      answerIndex: 0,
      explainEN: "Load acts like a drawbridge: Load=1 lets the clock through so new data is accepted, while Load=0 gates the clock (or feeds Q back) so the register holds its current word.",
      explainHI: "Load एक drawbridge की तरह काम करता है: Load=1 clock को गुज़रने देता है ताकि नया data स्वीकार हो, जबकि Load=0 clock को gate करता है (या Q वापस feed करता है) ताकि register अपना मौजूदा word होल्ड करे।"
    },
    {
      questionEN: "On each clock edge, a shift register...",
      questionHI: "हर clock edge पर, एक shift register...",
      options: [
        "moves the whole word one position; each cell takes its neighbour's old value",
        "swaps the first and last bits only",
        "loads all bits from independent inputs at once",
        "inverts every bit"
      ],
      answerIndex: 0,
      explainEN: "The flip-flops are chained output-to-input on one clock, so all cells sample the same edge and each grabs its neighbour's OLD value - the word slides cleanly by one position.",
      explainHI: "Flip-flops एक clock पर output-से-input chained हैं, तो सब cells उसी edge पर sample करते हैं और हर एक अपने पड़ोसी का पुराना मान पकड़ता है - word साफ़-साफ़ एक position सरकता है।"
    },
    {
      questionEN: "Feed the stream 1, 0, 1, 1 into an empty 4-bit right-shift register (new bit enters at Q0). What does it read (Q0 Q1 Q2 Q3) after four edges?",
      questionHI: "एक ख़ाली 4-bit right-shift register (नया bit Q0 पर घुसता है) में stream 1, 0, 1, 1 feed कीजिए। चार edges बाद यह (Q0 Q1 Q2 Q3) क्या पढ़ता है?",
      options: [
        "1 1 0 1",
        "1 0 1 1",
        "0 0 0 0",
        "1 1 1 1"
      ],
      answerIndex: 0,
      explainEN: "Iterating: 1000, then 0100, then 1010, then 1101. The first bit fed (1) has travelled to Q3, so the register reads 1 1 0 1 across Q0..Q3.",
      explainHI: "Iterate करते: 1000, फिर 0100, फिर 1010, फिर 1101। पहला feed किया bit (1) Q3 तक सफ़र कर चुका है, तो register Q0..Q3 भर 1 1 0 1 पढ़ता है।"
    },
    {
      questionEN: "Which mode is the natural parallel-to-serial converter used by a UART transmitter?",
      questionHI: "कौन सा mode एक UART transmitter द्वारा वापरा जाने वाला स्वाभाविक parallel-to-serial converter है?",
      options: [
        "PISO (parallel-in, serial-out), needing a Shift/Load control",
        "SIPO (serial-in, parallel-out)",
        "PIPO (parallel-in, parallel-out)",
        "SISO (serial-in, serial-out)"
      ],
      answerIndex: 0,
      explainEN: "PISO loads a whole word in parallel in one cycle, then shifts it out one bit per clock (read = n cycles). Because it must both parallel-load and shift, it needs a Shift/Load control - exactly a UART transmitter.",
      explainHI: "PISO एक पूरे word को एक cycle में parallel load करता है, फिर उसे एक-एक bit प्रति clock बाहर shift करता है (read = n cycles)। चूँकि इसे parallel-load और shift दोनों करना है, इसे एक Shift/Load control चाहिए - ठीक एक UART transmitter।"
    },
    {
      questionEN: "Serial transfer uses 1 wire and n cycles; parallel uses n wires and 1 cycle. What does this show?",
      questionHI: "Serial transfer 1 wire और n cycles वापरता है; parallel n wires और 1 cycle। यह क्या दिखाता है?",
      options: [
        "A time-versus-space trade-off - the wire-cycle product is conserved",
        "Parallel is always strictly better than serial",
        "Serial moves more total information than parallel",
        "The clock speed determines the number of wires"
      ],
      answerIndex: 0,
      explainEN: "Both cost n wire-cycles (1xn = nx1), so going parallel just trades plentiful cycles for scarce pins, or the reverse. That is why chips are parallel inside but serialise to leave the chip.",
      explainHI: "दोनों n wire-cycles ख़र्च करते हैं (1xn = nx1), तो parallel जाना बस बहुतायत cycles को दुर्लभ pins के बदले trade करता है, या उलटा। इसीलिए chips अंदर parallel हैं पर chip छोड़ने को serialise करते हैं।"
    },
    {
      questionEN: "How do you make a serial read non-destructive?",
      questionHI: "आप एक serial read को non-destructive कैसे बनाते हैं?",
      options: [
        "Route serial-out back to serial-in through a MUX so the word recirculates",
        "Clock the register twice as fast",
        "Add a second independent clock",
        "Remove the serial output entirely"
      ],
      answerIndex: 0,
      explainEN: "A plain serial read shifts the word out and loses it. A 2-to-1 MUX on the serial input can select the register's own serial-out (Recirculate=1), so the bit falling off the far end re-enters the near end and, after n clocks, the word reads identically.",
      explainHI: "एक सादा serial read word को बाहर shift करके खो देता है। serial input पर एक 2-to-1 MUX register का अपना serial-out चुन सकता है (Recirculate=1), तो दूर सिरे से गिरता bit पास सिरे में फिर घुसता है और, n clocks बाद, word ठीक वैसा ही पढ़ता है।"
    }
  ]
};
