import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/31 - Flip-Flop Timing & Race-Around, "The Clock's Deadlines"
 * (Sequential Logic track). Every clocked cell obeys three timing numbers -
 * setup t_su (data stable BEFORE the edge), hold t_h (data stable AFTER the
 * edge) and clock-to-Q propagation t_pcq - and a clock can only run as fast as
 * Tc >= t_pcq + t_pd + t_su, giving f_max = 1/Tc. Break the setup/hold window and
 * the cell goes metastable. The level-triggered JK has its own hazard: with
 * J = K = 1 and the clock held high, Q oscillates 0->1->0->1 for the whole pulse
 * (because tp << T fits many toggles in one level), leaving the final Q
 * unpredictable - the race-around problem. The 100% fix is master-slave / edge
 * triggering (two JK FFs on opposite clock phases; phase isolation breaks the
 * feedback loop). Every value shown in the module is COMPUTED in code.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Flip-Flop Timing & Race-Around - The Clock's Deadlines",
  moduleSubtitle: "Three timing numbers (setup, hold, clock-to-Q) set the top speed; the level-triggered JK's race-around and its master-slave cure.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The Clock's Deadlines",
      kind: "cover",
      subtitle: "A flip-flop captures at the edge - but only if the data is quiet through a tiny window around it.",
      theoryEN: [
        "A flip-flop looks instantaneous - it grabs its data at the clock edge - but the real silicon has deadlines. The data must arrive early enough and stay still long enough around that edge, or the capture fails. This module puts numbers on those deadlines and shows what happens when you miss them.",
        "Three timing numbers describe every clocked cell. Setup time t_su is how long the data must be stable BEFORE the active edge. Hold time t_h is how long it must stay stable AFTER the edge. Clock-to-Q time t_pcq is how long after the edge the new output Q actually becomes valid. Together they carve out a small keep-out window that the data must not cross.",
        "Those numbers also cap the clock speed. In one clock period the data has to leave one flip-flop (t_pcq), travel through the combinational logic (t_pd) and settle before the next flip-flop's setup deadline (t_su). So the period must satisfy Tc >= t_pcq + t_pd + t_su, and the top clock frequency is f_max = 1 / Tc.",
        "There is also a purely logical hazard hiding in the level-triggered JK flip-flop. Set J = K = 1 (the toggle command) and hold the clock high, and Q flips 0->1->0->1 over and over for the entire pulse, because one gate delay tp is far smaller than the pulse width T. This is the race-around problem, and its final value is anyone's guess.",
        "By the end you will read the three timing numbers off a waveform, slide a data edge into the forbidden window to trigger metastability, compute Tc and f_max with a live calculator, watch a level JK race around, and build the master-slave fix that breaks the loop with clean phase isolation."
      ],
      theoryHI: [
        "Flip-flop तात्कालिक लगता है - यह अपना data clock edge पर पकड़ लेता है - पर असली silicon की deadlines होती हैं। Data को उस edge के आसपास काफ़ी जल्दी आना और काफ़ी देर स्थिर रहना पड़ता है, वरना capture नाकाम हो जाता है। यह module उन deadlines पर संख्याएँ रखता है और दिखाता है कि चूकने पर क्या होता है।",
        "तीन timing संख्याएँ हर clocked cell का वर्णन करती हैं। Setup time t_su यह है कि data को active edge से पहले कितनी देर स्थिर रहना चाहिए। Hold time t_h यह है कि edge के बाद कितनी देर स्थिर रहना चाहिए। Clock-to-Q time t_pcq यह है कि edge के कितनी देर बाद नया output Q असल में valid बनता है। मिलकर ये एक छोटा keep-out window बनाती हैं जिसे data को पार नहीं करना।",
        "ये संख्याएँ clock speed भी सीमित करती हैं। एक clock period में data को एक flip-flop से निकलना (t_pcq), combinational logic से गुज़रना (t_pd) और अगले flip-flop की setup deadline से पहले settle होना पड़ता है (t_su)। तो period को Tc >= t_pcq + t_pd + t_su संतुष्ट करना होगा, और सबसे ऊँची clock frequency है f_max = 1 / Tc।",
        "एक विशुद्ध तार्किक hazard भी level-triggered JK flip-flop में छिपा है। J = K = 1 (toggle आदेश) रखिए और clock को high पकड़िए, तो Q पूरे pulse भर 0->1->0->1 बार-बार पलटता है, क्योंकि एक gate delay tp, pulse width T से बहुत छोटा है। यही race-around problem है, और इसका अंतिम मान कोई नहीं जानता।",
        "अंत तक आप waveform से तीनों timing संख्याएँ पढ़ेंगे, एक data edge को forbidden window में सरकाकर metastability भड़काएँगे, एक live calculator से Tc और f_max निकालेंगे, एक level JK को race-around करते देखेंगे, और master-slave इलाज बनाएँगे जो साफ़ phase isolation से loop तोड़ता है।"
      ],
      transcriptEN: "A flip-flop looks instantaneous, but the silicon has deadlines. Three numbers describe every clocked cell: setup time, how long data must be stable before the edge; hold time, how long after; and clock-to-Q, how long after the edge the output becomes valid. Together they carve out a tiny keep-out window the data must not cross. Those numbers also cap the clock: in one period data must leave a flip-flop, cross the logic, and settle before the next setup deadline, so Tc must be at least t-p-c-q plus t-p-d plus t-s-u, and the top frequency is one over Tc. There's also a logical hazard in the level-triggered JK: set J and K to one and hold the clock high, and Q flips over and over for the whole pulse because one gate delay is far smaller than the pulse width. That's the race-around problem, and its final value is unpredictable. By the end you'll read the three numbers, trigger metastability, compute f-max, watch a level JK race around, and build the master-slave fix.",
      transcriptHI: "Flip-flop तात्कालिक लगता है, पर silicon की deadlines होती हैं। तीन संख्याएँ हर clocked cell का वर्णन करती हैं: setup time, data को edge से पहले कितनी देर स्थिर रहना; hold time, बाद में कितनी देर; और clock-to-Q, edge के कितनी देर बाद output valid बनता है। मिलकर ये एक छोटा keep-out window बनाती हैं जिसे data पार न करे। ये संख्याएँ clock भी सीमित करती हैं: एक period में data को flip-flop से निकलना, logic पार करना, और अगली setup deadline से पहले settle होना पड़ता है, तो Tc कम से कम t-p-c-q जमा t-p-d जमा t-s-u होना चाहिए, और सबसे ऊँची frequency है एक बटा Tc। एक तार्किक hazard level-triggered JK में भी है: J और K को एक रखिए और clock high पकड़िए, तो Q पूरे pulse भर बार-बार पलटता है क्योंकि एक gate delay, pulse width से बहुत छोटा है। यही race-around problem है, और इसका अंतिम मान अनिश्चित है। अंत तक आप तीनों संख्याएँ पढ़ेंगे, metastability भड़काएँगे, f-max निकालेंगे, level JK को race-around देखेंगे, और master-slave इलाज बनाएँगे।",
      visualNote: "Hero: a live setup/hold capture window around a rising clock edge - a shaded setup zone before the edge, a hold zone after, a data value settling before the window, and the captured Q updating each tick."
    },
    {
      id: "S01_Video",
      label: "Timing & Race-Around",
      kind: "video",
      subtitle: "A short film: the setup/hold window, the maximum clock frequency, and the level-JK race-around.",
      theoryEN: [
        "Here is the whole story in one breath before you watch. Every flip-flop needs the data to be still for a small window straddling the clock edge - a little before (setup) and a little after (hold). Change the data inside that window and the flip-flop can go metastable, hanging at an undefined voltage before settling to a random 0 or 1.",
        "The same numbers set the speed limit. One clock tick must be long enough to launch data out of a flip-flop, push it through the logic, and land it before the next flip-flop's setup deadline: Tc >= t_pcq + t_pd + t_su. Flip that around and the fastest the clock can run is f_max = 1 / Tc.",
        "Then there is the race-around problem, which is about the level-triggered JK, not about speed limits. When J = K = 1 the JK is commanded to toggle. If the clock is a level that stays high, the toggled output races back around the feedback loop and toggles again, and again, for the whole time the clock is high.",
        "The reason it races is the inequality tp << T: a single gate propagation delay tp is far smaller than the clock-high width T, so floor(T / tp) toggles fit inside one pulse. Q ends up oscillating 0->1->0->1, and whatever value it happens to hold when the clock finally falls is unpredictable.",
        "The cure is master-slave (edge) triggering. Two JK flip-flops are chained on opposite clock phases: while the clock is high the master accepts and the slave is locked; while the clock is low the master is locked and the slave drives the output. They are never open at the same time, so the feedback loop is broken - phase isolation - and Q can change at most once per clock."
      ],
      theoryHI: [
        "देखने से पहले पूरी कहानी एक साँस में। हर flip-flop को data का एक छोटे window भर स्थिर रहना ज़रूरी है जो clock edge को घेरता है - थोड़ा पहले (setup) और थोड़ा बाद (hold)। उस window के अंदर data बदलिए और flip-flop metastable हो सकता है, एक अपरिभाषित voltage पर लटककर फिर किसी random 0 या 1 पर settle होता।",
        "वही संख्याएँ speed limit तय करती हैं। एक clock tick इतना लंबा होना चाहिए कि data को एक flip-flop से launch करे, logic से धकेले, और अगले flip-flop की setup deadline से पहले उतारे: Tc >= t_pcq + t_pd + t_su। इसे पलटिए तो clock सबसे तेज़ जितना चल सकता है वह है f_max = 1 / Tc।",
        "फिर race-around problem है, जो level-triggered JK के बारे में है, speed limits के बारे में नहीं। जब J = K = 1 तो JK को toggle का आदेश मिलता है। अगर clock एक level है जो high रहता है, तो toggle हुआ output feedback loop से वापस दौड़कर फिर toggle करता है, और फिर, पूरे उस समय जब clock high रहता है।",
        "यह दौड़ता क्यों है इसका कारण असमानता tp << T है: एक अकेला gate propagation delay tp, clock-high width T से बहुत छोटा है, तो एक pulse के अंदर floor(T / tp) toggles समा जाते हैं। Q आख़िर में 0->1->0->1 दोलन करता रह जाता है, और जब clock आख़िरकार गिरता है तब जो मान वह पकड़े होता है वह अनिश्चित है।",
        "इलाज है master-slave (edge) triggering। दो JK flip-flops उलटी clock phases पर श्रृंखलाबद्ध हैं: जब clock high हो master स्वीकारता है और slave locked; जब clock low हो master locked और slave output चलाता है। वे कभी एक साथ खुले नहीं होते, तो feedback loop टूट जाता है - phase isolation - और Q हर clock पर अधिकतम एक बार बदल सकता है।"
      ],
      transcriptEN: "Here's the whole story in one breath. Every flip-flop needs the data still for a small window straddling the clock edge: a little before, called setup, and a little after, called hold. Change the data inside that window and the flip-flop can go metastable, hanging at an undefined voltage before settling to a random zero or one. The same numbers set the speed limit: one tick must launch data out of a flip-flop, push it through the logic, and land it before the next setup deadline, so Tc is at least t-p-c-q plus t-p-d plus t-s-u, and f-max is one over Tc. Then there's the race-around problem in the level-triggered JK. With J and K both one, the JK is told to toggle; if the clock stays high as a level, the toggled output races back around and toggles again and again, because one gate delay is far smaller than the pulse width, so many toggles fit in one pulse. Q oscillates and its final value is unpredictable. The cure is master-slave triggering: two JKs on opposite clock phases, never open together, so the feedback loop is broken and Q changes at most once per clock.",
      transcriptHI: "पूरी कहानी एक साँस में। हर flip-flop को data का एक छोटे window भर स्थिर रहना चाहिए जो clock edge को घेरता है: थोड़ा पहले, जिसे setup कहते हैं, और थोड़ा बाद, जिसे hold। उस window के अंदर data बदलिए और flip-flop metastable हो सकता है, अपरिभाषित voltage पर लटककर फिर random शून्य या एक पर settle। वही संख्याएँ speed limit तय करती हैं: एक tick को data flip-flop से launch करना, logic से धकेलना, और अगली setup deadline से पहले उतारना है, तो Tc कम से कम t-p-c-q जमा t-p-d जमा t-s-u है, और f-max है एक बटा Tc। फिर level-triggered JK में race-around problem है। J और K दोनों एक होने पर JK को toggle कहा जाता है; अगर clock level के रूप में high रहे, तो toggle हुआ output वापस दौड़कर बार-बार toggle करता है, क्योंकि एक gate delay pulse width से बहुत छोटा है, तो कई toggles एक pulse में समाते हैं। Q दोलन करता है और इसका अंतिम मान अनिश्चित है। इलाज है master-slave triggering: दो JK उलटी clock phases पर, कभी एक साथ खुले नहीं, तो feedback loop टूटता है और Q हर clock पर अधिकतम एक बार बदलता है।",
      visualNote: "Animated explainer: a rising edge with shaded setup/hold windows, a period bar splitting into t_pcq + t_pd + t_su, and a level JK oscillating while the clock is held high."
    },
    {
      id: "S02_Facts",
      label: "The Three Timing Numbers",
      kind: "theory",
      subtitle: "Setup t_su before the edge, hold t_h after the edge, clock-to-Q t_pcq for the output.",
      theoryEN: [
        "A flip-flop does not really capture in zero time. Its internal latches need the data to be settled and quiet for a small window that straddles the active clock edge, and they need a moment after the edge to drive the new output. Three numbers, printed on every device datasheet, quantify that behaviour: setup time, hold time, and clock-to-Q propagation delay.",
        "Setup time, written t_su, is the minimum time the data input must be stable and valid BEFORE the active clock edge. Think of it as arriving early for a train: if the data is still changing when the edge is only t_su away, the flip-flop has not had enough time to sense it, and the capture is unsafe. The data edge must land no later than t_su ahead of the clock edge.",
        "Hold time, written t_h, is the minimum time the data must remain stable and valid AFTER the active clock edge. Even though the clock has already ticked, the internal circuit is still latching, so the data must not move for at least t_h more. Setup and hold together define an aperture window from t_su before the edge to t_h after it - the keep-out zone the data may not cross.",
        "Clock-to-Q propagation delay, written t_pcq, is the time from the active edge until the new value actually appears and is valid at the output Q. Unlike setup and hold, which are constraints on the input, t_pcq is a delay you observe on the output: the edge happens, and t_pcq later Q is guaranteed correct. Every register you clock pays this delay once per cycle.",
        "These numbers are small - typically a fraction of a nanosecond to a few nanoseconds - but they are absolute. As long as the data honours the setup/hold aperture, the flip-flop captures cleanly and Q is valid t_pcq after the edge. Miss the aperture, and you invite metastability, which is exactly what the next page lets you trigger."
      ],
      theoryHI: [
        "Flip-flop असल में शून्य समय में capture नहीं करता। इसके भीतरी latches को data का एक छोटे window भर settled और शांत रहना ज़रूरी है जो active clock edge को घेरता है, और edge के बाद नया output चलाने को उन्हें एक पल चाहिए। तीन संख्याएँ, हर device datasheet पर छपी, उस बर्ताव को मापती हैं: setup time, hold time, और clock-to-Q propagation delay।",
        "Setup time, लिखा t_su, वह न्यूनतम समय है जितना data input को active clock edge से पहले स्थिर और valid रहना चाहिए। इसे train के लिए जल्दी पहुँचने जैसा सोचिए: अगर edge सिर्फ़ t_su दूर है और data अब भी बदल रहा है, तो flip-flop को इसे भाँपने का पर्याप्त समय नहीं मिला, और capture असुरक्षित है। Data edge को clock edge से कम से कम t_su आगे उतरना चाहिए।",
        "Hold time, लिखा t_h, वह न्यूनतम समय है जितना data को active clock edge के बाद स्थिर और valid रहना चाहिए। भले ही clock टिक चुका हो, भीतरी circuit अब भी latch कर रहा है, तो data को कम से कम t_h और नहीं हिलना चाहिए। Setup और hold मिलकर एक aperture window परिभाषित करते हैं जो edge से t_su पहले से edge के t_h बाद तक फैलता है - वह keep-out zone जिसे data पार न करे।",
        "Clock-to-Q propagation delay, लिखा t_pcq, वह समय है active edge से लेकर जब तक नया मान असल में output Q पर आकर valid बने। Setup और hold के विपरीत, जो input पर बंदिशें हैं, t_pcq एक delay है जो आप output पर देखते हैं: edge होता है, और t_pcq बाद Q की शुद्धता की गारंटी है। हर register जिसे आप clock करते हैं यह delay हर cycle में एक बार चुकाता है।",
        "ये संख्याएँ छोटी हैं - आम तौर पर एक nanosecond के अंश से कुछ nanoseconds तक - पर निरपेक्ष हैं। जब तक data setup/hold aperture का मान रखता है, flip-flop साफ़ capture करता है और Q, edge के t_pcq बाद valid होता है। Aperture चूकिए, और आप metastability बुलाते हैं, जो ठीक वही है जो अगला पन्ना आपको भड़काने देता है।"
      ],
      transcriptEN: "A flip-flop doesn't capture in zero time. Its latches need the data settled for a small window straddling the edge, plus a moment after to drive the output. Three numbers describe it. Setup time, t-s-u, is how long data must be stable before the active edge - arrive too late and the flip-flop can't sense it. Hold time, t-h, is how long data must stay stable after the edge - the internal latch is still closing. Together they form an aperture from t-s-u before to t-h after the edge: the keep-out zone the data must not cross. Clock-to-Q, t-p-c-q, is the delay from the edge until Q is valid - a delay you see on the output, paid once per cycle. These numbers are tiny, sub-nanosecond to a few nanoseconds, but absolute: honour the aperture and Q is valid t-p-c-q after the edge; miss it and you invite metastability.",
      transcriptHI: "Flip-flop शून्य समय में capture नहीं करता। इसके latches को data का एक छोटे window भर settled रहना चाहिए जो edge को घेरता है, और output चलाने को edge के बाद एक पल। तीन संख्याएँ इसका वर्णन करती हैं। Setup time, t-s-u, data को active edge से पहले कितनी देर स्थिर रहना - बहुत देर से आइए और flip-flop भाँप नहीं सकता। Hold time, t-h, data को edge के बाद कितनी देर स्थिर रहना - भीतरी latch अब भी बंद हो रहा है। मिलकर ये edge से t-s-u पहले से t-h बाद तक एक aperture बनाती हैं: keep-out zone जिसे data पार न करे। Clock-to-Q, t-p-c-q, edge से Q के valid होने तक का delay - एक delay जो आप output पर देखते हैं, हर cycle एक बार चुकाया। ये संख्याएँ छोटी हैं, sub-nanosecond से कुछ nanoseconds, पर निरपेक्ष: aperture का मान रखिए और Q edge के t-p-c-q बाद valid; चूकिए और metastability बुलाइए।",
      visualNote: "A ClockWave plus a bespoke annotated waveform: a rising edge, a shaded setup window before it and hold window after it on the data track, and a t_pcq arrow to Q; a table listing the three numbers, their meaning and rule."
    },
    {
      id: "S03_SetupHold",
      label: "Setup/Hold Violation & Metastability",
      kind: "theory",
      subtitle: "Slide the data edge into the forbidden window and the output hangs undefined.",
      theoryEN: [
        "What actually goes wrong when the data breaks the aperture rule? The flip-flop enters metastability. Instead of resolving cleanly to 0 or 1, its output hovers at an in-between, undefined voltage for an unpredictable length of time before finally snapping - randomly - to one of the two valid levels. It is the digital equivalent of a coin landing on its edge.",
        "There are two ways to violate the aperture. A setup violation happens when the data changes too late - closer than t_su before the edge - so it is still moving when the flip-flop tries to sense it. A hold violation happens when the data changes too soon - sooner than t_h after the edge - disturbing the internal latch while it is still closing. Either one drops the data transition inside the keep-out window.",
        "Metastability is dangerous because its duration is unbounded in principle: the cell might resolve in picoseconds or, rarely, hang long enough to feed a half-valid level into the next stage and corrupt it. In real systems the risk is measured as a mean time between failures, and the standard defence for asynchronous inputs is a synchronizer - two flip-flops in series that give the first one extra time to resolve.",
        "In the interactive, drag the data transition across the timeline. While the transition sits safely before the setup window, the data is stable through the whole aperture and Q captures the new value cleanly. Slide it into the shaded window and the computed verdict flips to metastable - the output is drawn as an undefined, jittering question mark. Pull it past the hold window and Q instead holds the old, still-stable value.",
        "The takeaway is a design rule, not just a warning. For synchronous logic you guarantee the aperture by making the combinational path deliver stable data with margin before every capturing edge; for signals that arrive from another clock domain, where you cannot guarantee it, you insert synchronizer flip-flops and accept a tiny, quantified failure probability instead of a certain one."
      ],
      theoryHI: [
        "Data जब aperture नियम तोड़ता है तो असल में क्या बिगड़ता है? Flip-flop metastability में घुस जाता है। साफ़-साफ़ 0 या 1 पर हल होने के बजाय, इसका output एक बीच के, अपरिभाषित voltage पर एक अनिश्चित समय भर मँडराता है, फिर आख़िरकार - randomly - दोनों valid स्तरों में से एक पर झटके से बैठता है। यह digital में सिक्के के किनारे पर टिकने के बराबर है।",
        "Aperture तोड़ने के दो तरीक़े हैं। Setup violation तब होता है जब data बहुत देर से बदलता है - edge से t_su से भी क़रीब - तो जब flip-flop इसे भाँपना चाहता है तब भी यह हिल रहा होता है। Hold violation तब होता है जब data बहुत जल्दी बदलता है - edge के t_h से भी पहले - भीतरी latch को छेड़ते हुए जब वह अब भी बंद हो रहा है। दोनों में से कोई भी data transition को keep-out window के अंदर गिरा देता है।",
        "Metastability ख़तरनाक है क्योंकि इसकी अवधि सैद्धांतिक रूप से असीमित है: cell picoseconds में हल हो सकता है या, कभी-कभार, इतनी देर लटके कि अगले stage में आधा-valid स्तर भेजकर उसे भी बिगाड़ दे। असली systems में जोखिम mean time between failures के रूप में मापा जाता है, और asynchronous inputs के लिए मानक बचाव है एक synchronizer - श्रृंखला में दो flip-flops जो पहले को हल होने का अतिरिक्त समय देते हैं।",
        "Interactive में, data transition को timeline पर खींचिए। जब तक transition setup window से सुरक्षित पहले बैठा है, data पूरे aperture भर स्थिर है और Q नया मान साफ़ पकड़ता है। इसे shaded window में सरकाइए और computed फ़ैसला metastable में पलट जाता है - output एक अपरिभाषित, काँपते प्रश्नचिह्न के रूप में बनाया जाता है। इसे hold window के पार खींचिए और Q इसके बजाय पुराना, अब भी स्थिर मान पकड़े रखता है।",
        "सीख एक design नियम है, महज़ चेतावनी नहीं। Synchronous logic के लिए आप हर capturing edge से पहले combinational path को margin सहित स्थिर data पहुँचवाकर aperture की गारंटी देते हैं; जो signals किसी और clock domain से आते हैं, जहाँ आप गारंटी नहीं दे सकते, वहाँ आप synchronizer flip-flops डालते हैं और एक निश्चित के बजाय एक छोटी, नापी हुई failure probability स्वीकारते हैं।"
      ],
      transcriptEN: "What goes wrong when the data breaks the aperture? The flip-flop goes metastable: instead of resolving to zero or one, its output hovers at an undefined voltage for an unpredictable time before snapping randomly to one level - like a coin landing on its edge. There are two violations. A setup violation is data changing too late, closer than t-s-u before the edge. A hold violation is data changing too soon, sooner than t-h after. Either drops the transition inside the keep-out window. It's dangerous because the duration is unbounded in principle - it can feed a half-valid level into the next stage. The defence for asynchronous inputs is a synchronizer: two flip-flops in series giving the first extra time to resolve. In the demo, drag the data transition: safely before the setup window, Q captures the new value cleanly; inside the shaded window, the verdict is metastable, drawn as a jittering question mark; past the hold window, Q holds the old value.",
      transcriptHI: "Data जब aperture तोड़ता है तो क्या बिगड़ता है? Flip-flop metastable होता है: शून्य या एक पर हल होने के बजाय, इसका output एक अपरिभाषित voltage पर अनिश्चित समय मँडराता है फिर randomly एक स्तर पर झटके से बैठता है - सिक्के के किनारे टिकने जैसा। दो violations हैं। Setup violation यानी data बहुत देर से बदलना, edge से t-s-u से क़रीब। Hold violation यानी बहुत जल्दी बदलना, edge के t-h से पहले। दोनों transition को keep-out window में गिराते हैं। यह ख़तरनाक है क्योंकि अवधि सैद्धांतिक रूप से असीमित है - अगले stage में आधा-valid स्तर भेज सकती है। Asynchronous inputs का बचाव synchronizer है: श्रृंखला में दो flip-flops जो पहले को हल होने का अतिरिक्त समय देते हैं। Demo में transition खींचिए: setup window से सुरक्षित पहले Q नया मान साफ़ पकड़ता है; shaded window के अंदर फ़ैसला metastable, काँपते प्रश्नचिह्न के रूप में; hold window के पार Q पुराना मान पकड़े रखता है।",
      visualNote: "A draggable data transition on a timeline with shaded setup/hold windows around the edge; the computed verdict is clean-new, clean-old or metastable, with Q shown as a value or a jittering '?'."
    },
    {
      id: "S04_Fmax",
      label: "Maximum Clock Frequency",
      kind: "theory",
      subtitle: "Tc >= t_pcq + t_pd + t_su, so f_max = 1 / Tc.",
      theoryEN: [
        "The three timing numbers do more than protect a single capture - they set how fast the whole synchronous system can be clocked. Picture two flip-flops with a block of combinational logic between them. On one edge the first flip-flop launches its data; that data must travel through the logic and be stable at the second flip-flop before the very next edge. The clock period is the deadline for that journey.",
        "Add up the journey. After the launching edge, the data takes t_pcq to appear at the first flip-flop's output. It then takes t_pd, the propagation delay of the combinational path, to travel through the logic. And it must arrive and be stable at least t_su before the next edge, to satisfy the capturing flip-flop's setup time. So the period must satisfy the inequality Tc >= t_pcq + t_pd + t_su.",
        "Turn the period into a frequency. Since frequency is one over the period, the maximum clock frequency the design can safely run at is f_max = 1 / Tc. Any faster and the data would still be settling when the next edge arrives - a setup violation on the second flip-flop, and back to metastability.",
        "Grind a concrete example. Take t_pcq = 2 ns, a combinational path t_pd = 5 ns, and t_su = 1 ns. Then Tc = 2 + 5 + 1 = 8 ns is the shortest safe period, and f_max = 1 / 8 ns = 125 MHz. Shrink the logic delay to t_pd = 3 ns and Tc drops to 6 ns, pushing f_max up to about 167 MHz - which is exactly why designers pipeline long logic paths into shorter ones.",
        "Two subtleties finish the picture. First, hold time does not appear in this formula: setup sets the maximum frequency (the longest path), while hold is a separate minimum-delay rule on the shortest path and does not change with clock speed. Second, the t_pd you must use is the worst-case, slowest path through the logic - the whole clock is only as fast as its slowest stage. The calculator below recomputes Tc and f_max live as you nudge the three numbers."
      ],
      theoryHI: [
        "तीन timing संख्याएँ केवल एक capture की रक्षा से ज़्यादा करती हैं - ये तय करती हैं कि पूरा synchronous system कितनी तेज़ clock हो सकता है। दो flip-flops की कल्पना कीजिए जिनके बीच combinational logic का एक block है। एक edge पर पहला flip-flop अपना data launch करता है; उस data को logic से गुज़रकर अगले edge से ठीक पहले दूसरे flip-flop पर स्थिर होना चाहिए। Clock period उस यात्रा की deadline है।",
        "यात्रा जोड़िए। Launching edge के बाद, data को पहले flip-flop के output पर आने में t_pcq लगते हैं। फिर इसे combinational path के propagation delay t_pd में logic से गुज़रना पड़ता है। और इसे capturing flip-flop की setup time पूरी करने को अगले edge से कम से कम t_su पहले आकर स्थिर होना चाहिए। तो period को असमानता Tc >= t_pcq + t_pd + t_su संतुष्ट करनी होगी।",
        "Period को frequency में बदलिए। चूँकि frequency period का व्युत्क्रम है, design सुरक्षित रूप से जितनी अधिकतम clock frequency पर चल सकता है वह है f_max = 1 / Tc। इससे तेज़ और data अगले edge के आने तक भी settle हो रहा होगा - दूसरे flip-flop पर setup violation, और वापस metastability।",
        "एक ठोस उदाहरण पीसिए। लीजिए t_pcq = 2 ns, एक combinational path t_pd = 5 ns, और t_su = 1 ns। तब Tc = 2 + 5 + 1 = 8 ns सबसे छोटा सुरक्षित period है, और f_max = 1 / 8 ns = 125 MHz। logic delay को t_pd = 3 ns तक घटाइए और Tc गिरकर 6 ns हो जाता है, f_max को क़रीब 167 MHz तक चढ़ाते हुए - यही कारण है कि designers लंबे logic paths को छोटों में pipeline करते हैं।",
        "दो सूक्ष्मताएँ तस्वीर पूरी करती हैं। पहली, hold time इस सूत्र में नहीं आता: setup अधिकतम frequency तय करता है (सबसे लंबा path), जबकि hold सबसे छोटे path पर एक अलग minimum-delay नियम है और clock speed से नहीं बदलता। दूसरी, आपको जो t_pd लेना है वह logic से गुज़रता सबसे बुरा, सबसे धीमा path है - पूरा clock उतना ही तेज़ है जितना उसका सबसे धीमा stage। नीचे calculator Tc और f_max को live फिर से गिनता है जैसे आप तीनों संख्याएँ नज़ करते हैं।"
      ],
      transcriptEN: "The three numbers also set how fast the whole system can be clocked. Picture two flip-flops with logic between them: one edge launches data from the first, and it must be stable at the second before the next edge. Add up the journey: t-p-c-q to leave the first flip-flop, t-p-d to cross the logic, and it must arrive at least t-s-u before the next edge. So Tc must be at least t-p-c-q plus t-p-d plus t-s-u. Since frequency is one over the period, f-max is one over Tc. A worked example: t-p-c-q of two nanoseconds, a path of five, and setup of one gives Tc equals eight nanoseconds and f-max of a hundred twenty-five megahertz. Shrink the logic to three and Tc drops to six, pushing f-max to about a hundred sixty-seven - which is why designers pipeline long paths. Two subtleties: hold time isn't in this formula, it's a separate short-path rule; and the t-p-d you use is the worst-case slowest path. The calculator recomputes Tc and f-max live.",
      transcriptHI: "तीन संख्याएँ यह भी तय करती हैं कि पूरा system कितनी तेज़ clock हो सकता है। दो flip-flops बीच में logic के साथ: एक edge पहले से data launch करता है, और इसे अगले edge से पहले दूसरे पर स्थिर होना चाहिए। यात्रा जोड़िए: पहले flip-flop से निकलने को t-p-c-q, logic पार करने को t-p-d, और अगले edge से कम से कम t-s-u पहले आना चाहिए। तो Tc कम से कम t-p-c-q जमा t-p-d जमा t-s-u है। चूँकि frequency period का व्युत्क्रम है, f-max है एक बटा Tc। एक उदाहरण: t-p-c-q दो nanosecond, path पाँच, setup एक देता है Tc बराबर आठ nanosecond और f-max एक सौ पच्चीस megahertz। logic को तीन तक घटाइए और Tc छह हो जाता है, f-max को क़रीब एक सौ सड़सठ तक चढ़ाते - इसीलिए designers लंबे paths को pipeline करते हैं। दो सूक्ष्मताएँ: hold time इस सूत्र में नहीं, यह अलग short-path नियम है; और जो t-p-d आप लें वह सबसे बुरा सबसे धीमा path है। Calculator Tc और f-max live फिर से गिनता है।",
      visualNote: "A live calculator with steppers for t_pcq, t_pd and t_su; a stacked bar splitting the period into the three contributions; Tc and f_max recomputed and shown big."
    },
    {
      id: "S05_RaceAround",
      label: "The Race-Around Problem",
      kind: "theory",
      subtitle: "Level JK, J = K = 1, clock held high: Q oscillates because tp << T.",
      theoryEN: [
        "The race-around problem is a hazard of the level-triggered JK flip-flop - the kind whose clock enables it for the entire time the clock is high, not just at an edge. It appears in exactly one situation: when both inputs are set to J = K = 1, which is the toggle command, and the clock is held high for a while.",
        "Follow the loop. With J = K = 1 the JK's job is to invert its output: Q becomes Q'. But the output is fed back to the inputs, and while the clock stays high the flip-flop is still enabled, so the freshly toggled output immediately commands another toggle. Q flips 0->1->0->1 continuously for as long as the clock pulse lasts.",
        "The reason it can toggle many times in one pulse is the inequality tp << T. Each trip around the feedback loop costs one gate propagation delay tp, while the clock is held high for a pulse width T that is far larger. So the number of toggles that fit inside a single pulse is about floor(T / tp), which can be dozens or hundreds.",
        "The damage is that the final value of Q is unpredictable. When the clock finally falls and freezes the output, Q holds whichever phase of the oscillation it happened to be in - and since that depends on the exact ratio of T to tp and on manufacturing spread, it is effectively random. A flip-flop whose toggle output you cannot predict is useless.",
        "Notice the hazard is specific to the toggle case. With J and K set to hold, set or reset, the commanded next state is stable and re-applying it changes nothing, so there is no oscillation. It is only J = K = 1 that creates a self-toggling loop - but toggling is exactly what the JK is prized for, so the race-around must be engineered away. The demo generates the oscillation: choose tp and T, and it computes floor(T / tp) toggles and the unpredictable final Q."
      ],
      theoryHI: [
        "Race-around problem level-triggered JK flip-flop का एक hazard है - वह किस्म जिसका clock इसे पूरे उस समय enable रखता है जब clock high हो, सिर्फ़ एक edge पर नहीं। यह ठीक एक स्थिति में प्रकट होता है: जब दोनों inputs J = K = 1 पर set हों, जो toggle आदेश है, और clock कुछ देर high पकड़ा जाए।",
        "Loop का पीछा कीजिए। J = K = 1 के साथ JK का काम अपना output उलटना है: Q बन जाता है Q'। पर output वापस inputs पर feed होता है, और जब तक clock high रहता है flip-flop अब भी enabled है, तो अभी-अभी toggle हुआ output तुरंत एक और toggle का आदेश देता है। Q जब तक clock pulse चलता है 0->1->0->1 लगातार पलटता है।",
        "यह एक pulse में कई बार toggle क्यों कर सकता है इसका कारण असमानता tp << T है। Feedback loop का हर चक्कर एक gate propagation delay tp लेता है, जबकि clock एक pulse width T भर high पकड़ा रहता है जो कहीं बड़ा है। तो एक अकेले pulse के अंदर जितने toggles समाते हैं वे लगभग floor(T / tp) हैं, जो दर्जनों या सैकड़ों हो सकते हैं।",
        "नुक़सान यह है कि Q का अंतिम मान अनिश्चित है। जब clock आख़िरकार गिरता है और output को जमा देता है, Q दोलन के जिस चरण में संयोग से होता है वही पकड़ लेता है - और चूँकि यह T और tp के ठीक अनुपात और निर्माण की भिन्नता पर निर्भर करता है, यह प्रभावी रूप से random है। एक flip-flop जिसका toggle output आप अनुमान नहीं लगा सकते बेकार है।",
        "ग़ौर कीजिए hazard toggle case के लिए ख़ास है। J और K को hold, set या reset पर रखने से आदेशित next state स्थिर है और उसे फिर से लगाना कुछ नहीं बदलता, तो कोई दोलन नहीं। सिर्फ़ J = K = 1 ही एक स्व-toggle करता loop बनाता है - पर toggling ही वह है जिसके लिए JK सराहा जाता है, तो race-around को engineering से हटाना ज़रूरी है। Demo दोलन उत्पन्न करता है: tp और T चुनिए, और यह floor(T / tp) toggles और अनिश्चित अंतिम Q गिनता है।"
      ],
      transcriptEN: "The race-around problem is a hazard of the level-triggered JK, whose clock enables it for the whole time it's high, not just at an edge. It appears only when J and K are both one - the toggle command - and the clock is held high. Follow the loop: with J and K one, the JK inverts its output, Q becomes Q-prime, but the output feeds back and while the clock stays high the flip-flop is still enabled, so the toggled output immediately commands another toggle. Q flips zero-one-zero-one continuously for the whole pulse. It can toggle many times because one loop trip costs a gate delay tp, while the pulse width T is far larger, so about floor of T over tp toggles fit in one pulse - dozens or hundreds. The damage: the final Q is unpredictable, whatever phase it's in when the clock falls, effectively random. It's specific to the toggle case - hold, set and reset are stable - but toggling is exactly what the JK is for, so race-around must be engineered away. The demo computes the toggle count and the final Q.",
      transcriptHI: "Race-around problem level-triggered JK का hazard है, जिसका clock इसे पूरे high समय enable रखता है, सिर्फ़ edge पर नहीं। यह तभी प्रकट होता है जब J और K दोनों एक हों - toggle आदेश - और clock high पकड़ा हो। Loop का पीछा: J और K एक होने पर JK अपना output उलटता है, Q बनता है Q-prime, पर output वापस feed होता है और जब clock high रहता है flip-flop अब भी enabled है, तो toggle हुआ output तुरंत एक और toggle का आदेश देता है। Q पूरे pulse भर शून्य-एक-शून्य-एक लगातार पलटता है। यह कई बार toggle कर सकता है क्योंकि एक loop चक्कर एक gate delay tp लेता है, जबकि pulse width T कहीं बड़ा है, तो क़रीब floor of T over tp toggles एक pulse में समाते हैं - दर्जनों या सैकड़ों। नुक़सान: अंतिम Q अनिश्चित है, clock गिरने पर जिस चरण में हो, प्रभावी रूप से random। यह toggle case के लिए ख़ास है - hold, set, reset स्थिर हैं - पर toggling ही JK का काम है, तो race-around को हटाना ज़रूरी है। Demo toggle गिनती और अंतिम Q गिनता है।",
      visualNote: "A generated oscillation: a clock held high for width T, Q toggling every tp inside it (computed), a live count of floor(T/tp) toggles and the unpredictable final Q; plus the race-around video clip."
    },
    {
      id: "S06_MasterSlave",
      label: "The Master-Slave Fix",
      kind: "theory",
      subtitle: "Two JK FFs on opposite clock phases: phase isolation breaks the loop.",
      theoryEN: [
        "The race-around problem exists because a level-triggered flip-flop stays open for a whole clock level, giving the feedback loop time to toggle repeatedly. The definitive cure removes that open window: build the flip-flop so it effectively captures at an edge, and the classic way to do that is the master-slave configuration.",
        "A master-slave JK is two JK flip-flops (latches) in series driven by opposite clock phases: the master gets the clock directly, the slave gets its inverse. When the clock is high the master is enabled and accepts the JK command from the fed-back output, while the slave is locked and simply holds the output steady. When the clock is low the master is locked and the slave is enabled, passing the master's captured value out to Q.",
        "The key is that the master and the slave are never open at the same time - this is phase isolation. Because the output the loop feeds back from is the slave's, and the slave is frozen for the whole time the master is listening, the master sees a stable input and toggles at most once. The feedback loop that used to race is broken into two half-cycles that never connect, so Q can change at most once per full clock period. The live diagram shows the master accepting on the high phase and the slave releasing on the low phase.",
        "Master-slave is only one of three ways people have tried to stop race-around, and comparing them shows why it wins. You could increase the flip-flop's propagation delay until tp approaches T so only one toggle fits - but that deliberately makes the part slower and the margin is fragile. You could shrink the clock pulse until only one toggle fits inside it - but generating a reliably tiny pulse is hard and brittle across temperature and process.",
        "The master-slave (edge-trigger) approach, by contrast, fixes the problem completely with no speed penalty: it does not slow the flip-flop or demand a razor-thin pulse, it just isolates the two phases so the loop can never run. That is why modern designs are built almost entirely from edge-triggered flip-flops, and the comparison table sums up the trade-offs of all three methods."
      ],
      theoryHI: [
        "Race-around problem इसलिए मौजूद है क्योंकि level-triggered flip-flop पूरे clock level भर खुला रहता है, feedback loop को बार-बार toggle करने का समय देते हुए। निश्चित इलाज उस खुली window को हटाता है: flip-flop ऐसे बनाइए कि वह प्रभावी रूप से एक edge पर capture करे, और ऐसा करने का चिरपरिचित तरीक़ा master-slave configuration है।",
        "Master-slave JK दो JK flip-flops (latches) श्रृंखला में हैं जो उलटी clock phases से चलते हैं: master को clock सीधे मिलता है, slave को इसका उलटा। जब clock high हो master enabled है और feed-back output से JK आदेश स्वीकारता है, जबकि slave locked है और बस output स्थिर पकड़े रखता है। जब clock low हो master locked है और slave enabled है, master के पकड़े मान को Q पर बाहर भेजते हुए।",
        "कुंजी यह है कि master और slave कभी एक साथ खुले नहीं होते - यही phase isolation है। चूँकि loop जिस output से feed back करता है वह slave का है, और slave पूरे उस समय जमा रहता है जब master सुन रहा हो, master एक स्थिर input देखता है और अधिकतम एक बार toggle करता है। जो feedback loop पहले दौड़ता था वह दो अर्ध-चक्रों में टूट जाता है जो कभी नहीं जुड़ते, तो Q हर पूरे clock period में अधिकतम एक बार बदल सकता है। Live diagram दिखाता है master को high phase पर स्वीकारते और slave को low phase पर छोड़ते।",
        "Master-slave race-around रोकने के तीन तरीक़ों में से केवल एक है, और उनकी तुलना दिखाती है यह क्यों जीतता है। आप flip-flop का propagation delay तब तक बढ़ा सकते हैं जब तक tp, T के क़रीब न आ जाए ताकि केवल एक toggle समाए - पर यह जानबूझकर part को धीमा करता है और margin नाज़ुक है। आप clock pulse तब तक छोटा कर सकते हैं जब तक उसके अंदर केवल एक toggle समाए - पर विश्वसनीय रूप से बहुत छोटा pulse बनाना कठिन है और तापमान व process पर भंगुर।",
        "इसके विपरीत master-slave (edge-trigger) तरीक़ा problem को बिना speed दंड के पूरी तरह ठीक करता है: यह न flip-flop को धीमा करता है न उस्तरे-पतले pulse की माँग करता है, यह बस दोनों phases को अलग कर देता है ताकि loop कभी चल न सके। इसीलिए आधुनिक designs लगभग पूरी तरह edge-triggered flip-flops से बनते हैं, और तुलना table तीनों तरीक़ों के समझौते सारांशित करती है।"
      ],
      transcriptEN: "Race-around exists because a level-triggered flip-flop stays open for a whole clock level, giving the loop time to toggle repeatedly. The cure removes that window by capturing at an edge, and the classic way is master-slave. It's two JK flip-flops in series on opposite clock phases: the master gets the clock, the slave its inverse. When the clock is high the master accepts the command from the fed-back output while the slave is locked and holds the output; when the clock is low the master is locked and the slave passes the captured value to Q. The key is they're never open together - phase isolation. Because the loop feeds back from the slave, and the slave is frozen while the master listens, the master sees a stable input and toggles at most once, so Q changes at most once per clock. Master-slave is one of three fixes. Increasing the flip-flop delay so one toggle fits makes the part slower and is fragile. Shrinking the clock pulse is hard and brittle. Master-slave fixes it completely with no speed penalty, which is why modern designs are almost all edge-triggered.",
      transcriptHI: "Race-around इसलिए है क्योंकि level-triggered flip-flop पूरे clock level भर खुला रहता है, loop को बार-बार toggle करने का समय देते। इलाज उस window को edge पर capture करके हटाता है, और चिरपरिचित तरीक़ा master-slave है। यह दो JK flip-flops श्रृंखला में उलटी clock phases पर हैं: master को clock, slave को इसका उलटा। जब clock high हो master feed-back output से आदेश स्वीकारता है जबकि slave locked रहकर output पकड़े; जब clock low हो master locked और slave पकड़ा मान Q पर भेजता है। कुंजी: वे कभी एक साथ खुले नहीं - phase isolation। चूँकि loop slave से feed back करता है, और slave master के सुनते समय जमा है, master स्थिर input देखता है और अधिकतम एक बार toggle करता है, तो Q हर clock पर अधिकतम एक बार बदलता है। Master-slave तीन इलाजों में से एक है। Flip-flop delay बढ़ाना ताकि एक toggle समाए part को धीमा करता है और नाज़ुक है। Clock pulse छोटा करना कठिन और भंगुर है। Master-slave बिना speed दंड के पूरी तरह ठीक करता है, इसीलिए आधुनिक designs लगभग सब edge-triggered हैं।",
      visualNote: "A live master-slave: two JK latch boxes, plain clock to the master and a bubbled clock to the slave, J and K toggles; plus a StateTable comparing the three prevention methods by feasibility, speed and reliability."
    },
    {
      id: "S07_Analogy",
      label: "The Relay-Race Baton Pass",
      kind: "theory",
      subtitle: "The baton (data) must be steady through the exchange zone (setup + hold) around the handoff (edge).",
      theoryEN: [
        "Picture a relay race. An incoming runner must place the baton into the outgoing runner's hand, and the rules only allow the handoff inside a marked exchange zone on the track. The handoff is the clock edge; the baton is the data; and the exchange zone is the setup-plus-hold window around that edge.",
        "For a clean pass the baton has to be steady and in position through the whole zone - held firmly a moment before the outgoing runner grabs it (that is setup time, data stable before the edge) and kept in the hand a moment after so it is not snatched away (that is hold time, data stable after the edge). Get both and the baton transfers cleanly, exactly as a flip-flop cleanly captures a stable data value.",
        "If the baton is still being fumbled or is moving as the runners cross in the zone, the handoff fails and the baton is dropped. That dropped, tumbling baton is metastability: for a while nobody holds a clean value, and which runner ends up with it is anyone's guess until it finally settles on the ground.",
        "The race-around problem is a different failure of the same picture: imagine the handoff window is left open far too long and an over-eager runner keeps grabbing the baton back and forth, back and forth, so that when the window finally closes no one can say who is holding it. Master-slave triggering is the referee's rule that the exchange may happen only once per lap - a single, clean pass, never a tug-of-war.",
        "So the whole module reduces to one athletic image: keep the baton dead steady through the exchange zone, hand it over at one clean instant, and never leave the window open long enough for a scramble. Steady through setup and hold gives a clean capture; a fumble in the zone gives metastability; and one pass per lap is the edge-triggered discipline that banishes race-around."
      ],
      theoryHI: [
        "एक relay race की कल्पना कीजिए। एक आता हुआ धावक baton को जाते धावक के हाथ में रखे, और नियम handoff केवल track पर एक चिह्नित exchange zone के अंदर देते हैं। Handoff है clock edge; baton है data; और exchange zone है उस edge के आसपास setup-जमा-hold window।",
        "साफ़ pass के लिए baton को पूरे zone भर स्थिर और स्थिति में रहना है - जाते धावक के पकड़ने से एक पल पहले मज़बूती से थमा (यही setup time, edge से पहले data स्थिर) और एक पल बाद हाथ में रखा ताकि छिन न जाए (यही hold time, edge के बाद data स्थिर)। दोनों पाइए और baton साफ़ स्थानांतरित होता है, ठीक वैसे जैसे flip-flop एक स्थिर data मान साफ़ पकड़ता है।",
        "अगर baton अब भी फुसलाया जा रहा है या धावकों के zone में मिलते समय हिल रहा है, तो handoff नाकाम होता है और baton गिर जाता है। वह गिरा, लुढ़कता baton metastability है: कुछ देर कोई साफ़ मान नहीं पकड़े, और आख़िरकार ज़मीन पर टिकने तक कौन धावक उसे पाता है यह कोई नहीं जानता।",
        "Race-around problem उसी तस्वीर की एक अलग नाकामी है: कल्पना कीजिए handoff window बहुत देर खुली छोड़ दी जाए और एक अति-उत्साही धावक baton को बार-बार आगे-पीछे पकड़ता रहे, तो जब window आख़िरकार बंद हो तो कोई नहीं कह सकता कि इसे कौन पकड़े है। Master-slave triggering रेफ़री का नियम है कि exchange हर lap में केवल एक बार हो सकता है - एक अकेला, साफ़ pass, कभी रस्साकशी नहीं।",
        "तो पूरा module एक खेल-चित्र में सिमट जाता है: baton को exchange zone भर बिल्कुल स्थिर रखिए, इसे एक साफ़ पल पर सौंपिए, और window कभी इतनी देर खुली न छोड़िए कि छीना-झपटी हो। Setup और hold भर स्थिर देता है साफ़ capture; zone में फुसलाहट देती है metastability; और हर lap में एक pass वह edge-triggered अनुशासन है जो race-around को भगाता है।"
      ],
      transcriptEN: "Picture a relay race. An incoming runner places the baton in the outgoing runner's hand, but only inside a marked exchange zone. The handoff is the clock edge, the baton is the data, and the exchange zone is the setup-plus-hold window. For a clean pass the baton must be steady through the whole zone - held firm a moment before the grab, that's setup, and kept in the hand a moment after, that's hold. Get both and it transfers cleanly, like a flip-flop capturing stable data. Fumble the baton or move it as the runners cross, and it's dropped - that's metastability, nobody holding a clean value until it settles randomly. Race-around is a different failure: leave the window open too long and an over-eager runner keeps grabbing the baton back and forth, so no one can say who holds it when it closes. Master-slave is the referee's rule of one exchange per lap: a single clean pass, never a tug-of-war. Keep the baton steady through setup and hold, hand over at one instant, and never leave the window open for a scramble.",
      transcriptHI: "एक relay race की कल्पना कीजिए। एक आता धावक baton को जाते धावक के हाथ में रखे, पर केवल एक चिह्नित exchange zone के अंदर। Handoff है clock edge, baton है data, और exchange zone है setup-जमा-hold window। साफ़ pass के लिए baton पूरे zone भर स्थिर रहे - पकड़ने से एक पल पहले मज़बूती से थमा, यह setup, और एक पल बाद हाथ में रखा, यह hold। दोनों पाइए और यह साफ़ स्थानांतरित होता है, flip-flop द्वारा स्थिर data पकड़ने जैसा। Baton फुसलाइए या धावकों के मिलते समय हिलाइए, और यह गिर जाता है - यह metastability, कोई साफ़ मान नहीं पकड़े जब तक यह randomly settle न हो। Race-around एक अलग नाकामी है: window बहुत देर खुली छोड़िए और एक अति-उत्साही धावक baton बार-बार आगे-पीछे पकड़ता रहे, तो बंद होने पर कोई नहीं कह सकता इसे कौन पकड़े है। Master-slave रेफ़री का हर lap एक exchange का नियम है: एक साफ़ pass, कभी रस्साकशी नहीं। Baton को setup और hold भर स्थिर रखिए, एक पल पर सौंपिए, और window कभी छीना-झपटी के लिए खुली न छोड़िए।",
      visualNote: "A live baton relay: two runners and an exchange zone (the setup+hold window); a steady baton passes cleanly, a wobbling one is dropped (metastable) - computed from a 'hold steady' toggle."
    },
    {
      id: "S08_Build",
      label: "Build The Master-Slave JK",
      kind: "theory",
      subtitle: "Wire two JK latches on opposite clock phases and prove the race-around is gone.",
      theoryEN: [
        "Now make the fix real on the workbench. You will wire a master-slave JK flip-flop: two JK latches in series, the master clocked directly and the slave clocked by the inverted clock, with the slave's output fed back to the master's inputs.",
        "Set J = K = 1 - the toggle command that made the level JK race around - and drive the clock. Because the master and slave are never enabled together, the output advances by exactly one toggle per full clock cycle instead of oscillating. That is phase isolation doing its job.",
        "Then confirm the other three commands still behave: J = K = 0 holds, J = 1 K = 0 sets, and J = 0 K = 1 resets, each captured cleanly once per clock. Seeing the toggle tamed to a single, predictable flip per cycle is the whole point of edge triggering.",
        "This is the same structure that underlies every counter and register you will build next, so getting the master-slave clocking right here pays off across the rest of the sequential track."
      ],
      theoryHI: [
        "अब इलाज को workbench पर असली बनाइए। आप एक master-slave JK flip-flop wire करेंगे: दो JK latches श्रृंखला में, master सीधे clocked और slave उलटे clock से clocked, slave के output को master के inputs पर वापस feed करते हुए।",
        "J = K = 1 रखिए - वही toggle आदेश जिसने level JK को race-around कराया था - और clock चलाइए। चूँकि master और slave कभी एक साथ enabled नहीं होते, output दोलन के बजाय हर पूरे clock cycle में ठीक एक toggle आगे बढ़ता है। यही phase isolation अपना काम करते हुए है।",
        "फिर पुष्टि कीजिए कि बाक़ी तीन आदेश अब भी सही बर्ताव करते हैं: J = K = 0 hold, J = 1 K = 0 set, और J = 0 K = 1 reset, हर एक हर clock पर एक बार साफ़ पकड़ा। Toggle को हर cycle एक अकेले, अनुमेय flip पर पालतू होते देखना ही edge triggering का पूरा मक़सद है।",
        "यही संरचना हर counter और register के नीचे है जो आप आगे बनाएँगे, तो यहाँ master-slave clocking ठीक करना बाक़ी पूरे sequential track में फल देता है।"
      ],
      transcriptEN: "Now make the fix real on the workbench. Wire a master-slave JK: two JK latches in series, the master clocked directly and the slave by the inverted clock, with the slave's output fed back to the master's inputs. Set J and K both to one - the toggle command that made the level JK race around - and drive the clock. Because master and slave are never enabled together, the output advances by exactly one toggle per full clock cycle instead of oscillating: phase isolation at work. Then confirm the other commands still behave - hold, set and reset, each captured cleanly once per clock. This master-slave structure underlies every counter and register you'll build next.",
      transcriptHI: "अब इलाज को workbench पर असली बनाइए। एक master-slave JK wire कीजिए: दो JK latches श्रृंखला में, master सीधे clocked और slave उलटे clock से, slave के output को master के inputs पर वापस feed करते। J और K दोनों एक रखिए - वही toggle आदेश जिसने level JK को race-around कराया - और clock चलाइए। चूँकि master और slave कभी एक साथ enabled नहीं, output दोलन के बजाय हर पूरे clock cycle में ठीक एक toggle आगे बढ़ता है: phase isolation काम पर। फिर पुष्टि कीजिए बाक़ी आदेश अब भी सही - hold, set, reset, हर एक हर clock पर साफ़ पकड़ा। यही master-slave संरचना हर counter और register के नीचे है जो आप आगे बनाएँगे।",
      visualNote: "WorkbenchCTA launching the guided master-slave-jk build."
    },
    {
      id: "S09_Flashcards",
      label: "Timing Flashcards",
      kind: "flashcards",
      subtitle: "Eight cards: the three timing numbers, metastability, f_max, race-around and the fix.",
      theoryEN: ["Flip the cards: term on the front, the real definition and rule on the back."],
      theoryHI: ["Cards पलटिए: सामने पद, पीछे असली परिभाषा और नियम।"],
      transcriptEN: "Eight flashcards covering setup, hold, clock-to-Q, metastability, the maximum-frequency formula, the race-around condition and the master-slave fix.",
      transcriptHI: "आठ flashcards जो setup, hold, clock-to-Q, metastability, अधिकतम-frequency सूत्र, race-around शर्त और master-slave इलाज समेटती हैं।",
      visualNote: "Flip-card deck."
    },
    {
      id: "S10_Quiz",
      label: "Timing Quiz",
      kind: "quiz",
      subtitle: "Seven questions across the timing numbers, f_max, race-around and master-slave.",
      theoryEN: ["Seven questions to lock in setup/hold, clock-to-Q, metastability, the Tc / f_max formula and the race-around problem with its master-slave cure."],
      theoryHI: ["सात सवाल setup/hold, clock-to-Q, metastability, Tc / f_max सूत्र और race-around problem को उसके master-slave इलाज सहित पक्का करने को।"],
      transcriptEN: "Prove you can read the three timing numbers, compute f_max, and explain why the level JK races around and how master-slave stops it.",
      transcriptHI: "साबित कीजिए कि आप तीन timing संख्याएँ पढ़ सकते हैं, f_max निकाल सकते हैं, और समझा सकते हैं कि level JK race-around क्यों करता है और master-slave इसे कैसे रोकता है।",
      visualNote: "QuizArena with 7 problems."
    },
    {
      id: "S11_Recap",
      label: "Recap",
      kind: "recap",
      subtitle: "Three timing numbers, one speed formula, the race-around and its master-slave cure.",
      theoryEN: [
        "Every clocked cell obeys three timing numbers. Setup time t_su is how long the data must be stable before the active edge; hold time t_h is how long after; and clock-to-Q t_pcq is how long after the edge the output Q becomes valid. Setup and hold together are a keep-out aperture - break it by changing data inside it and the flip-flop goes metastable, hovering at an undefined level before settling randomly.",
        "The same numbers cap the clock. In one period the data must launch (t_pcq), cross the logic (t_pd) and settle before the next setup deadline (t_su), so Tc >= t_pcq + t_pd + t_su and f_max = 1 / Tc. With t_pcq = 2, t_pd = 5 and t_su = 1 ns, Tc = 8 ns and f_max = 125 MHz; shrink the logic path and the clock can go faster.",
        "The level-triggered JK has its own hazard. With J = K = 1 and the clock held high, the toggled output feeds back and toggles again and again, because one gate delay tp is far smaller than the pulse width T, so about floor(T / tp) toggles fit in one pulse and the final Q is unpredictable - the race-around problem. Of the three fixes - bigger FF delay, shorter clock pulse, or master-slave - only master-slave wins: two JK latches on opposite clock phases never open together, and that phase isolation breaks the loop with no speed penalty. Master the aperture, the f_max formula and the master-slave cure, and clocked timing holds no more surprises."
      ],
      theoryHI: [
        "हर clocked cell तीन timing संख्याओं का पालन करता है। Setup time t_su, data को active edge से पहले कितनी देर स्थिर रहना; hold time t_h, बाद में कितनी देर; और clock-to-Q t_pcq, edge के कितनी देर बाद output Q valid बनता है। Setup और hold मिलकर एक keep-out aperture हैं - इसके अंदर data बदलकर इसे तोड़िए और flip-flop metastable होता है, एक अपरिभाषित स्तर पर मँडराकर फिर randomly settle होता।",
        "वही संख्याएँ clock सीमित करती हैं। एक period में data को launch (t_pcq), logic पार (t_pd) और अगली setup deadline से पहले settle (t_su) होना चाहिए, तो Tc >= t_pcq + t_pd + t_su और f_max = 1 / Tc। t_pcq = 2, t_pd = 5 और t_su = 1 ns के साथ, Tc = 8 ns और f_max = 125 MHz; logic path छोटा कीजिए और clock तेज़ जा सकता है।",
        "Level-triggered JK का अपना hazard है। J = K = 1 और clock high पकड़े, toggle हुआ output वापस feed होकर बार-बार toggle करता है, क्योंकि एक gate delay tp, pulse width T से बहुत छोटा है, तो क़रीब floor(T / tp) toggles एक pulse में समाते हैं और अंतिम Q अनिश्चित है - race-around problem। तीन इलाजों में - बड़ा FF delay, छोटा clock pulse, या master-slave - केवल master-slave जीतता है: दो JK latches उलटी clock phases पर कभी एक साथ खुले नहीं, और वह phase isolation loop को बिना speed दंड के तोड़ता है। Aperture, f_max सूत्र और master-slave इलाज में महारत पाइए, और clocked timing कोई और अचंभा नहीं रखता।"
      ],
      transcriptEN: "Every clocked cell obeys three numbers: setup before the edge, hold after, and clock-to-Q for the output. Setup and hold are a keep-out aperture - break it and the flip-flop goes metastable. The same numbers cap the clock: Tc is at least t-p-c-q plus t-p-d plus t-s-u, and f-max is one over Tc; two plus five plus one nanoseconds gives eight nanoseconds and a hundred twenty-five megahertz. The level JK races around when J and K are one and the clock is held high, toggling floor of T over tp times to an unpredictable final value. Of the three fixes, master-slave wins: two JK latches on opposite phases never open together, breaking the loop with no speed penalty.",
      transcriptHI: "हर clocked cell तीन संख्याओं का पालन करता है: edge से पहले setup, बाद में hold, और output के लिए clock-to-Q। Setup और hold एक keep-out aperture हैं - इसे तोड़िए और flip-flop metastable होता है। वही संख्याएँ clock सीमित करती हैं: Tc कम से कम t-p-c-q जमा t-p-d जमा t-s-u है, और f-max एक बटा Tc; दो जमा पाँच जमा एक nanosecond देता है आठ nanosecond और एक सौ पच्चीस megahertz। Level JK race-around करता है जब J और K एक हों और clock high पकड़ा हो, floor of T over tp बार toggle करते एक अनिश्चित अंतिम मान तक। तीन इलाजों में master-slave जीतता है: दो JK latches उलटी phases पर कभी एक साथ खुले नहीं, loop को बिना speed दंड के तोड़ते।",
      visualNote: "FlowRail recap loop, then the summary prose."
    }
  ],
  flashcards: [
    {
      frontEN: "Setup time (t_su)",
      backEN: "The minimum time the data input must be stable and valid BEFORE the active clock edge. If the data is still changing within t_su of the edge, the flip-flop cannot sense it reliably - a setup violation.",
      frontHI: "Setup time (t_su)",
      backHI: "वह न्यूनतम समय जितना data input को active clock edge से पहले स्थिर और valid रहना चाहिए। अगर data edge के t_su के अंदर अब भी बदल रहा है, तो flip-flop इसे विश्वसनीय रूप से नहीं भाँप सकता - एक setup violation।"
    },
    {
      frontEN: "Hold time (t_h)",
      backEN: "The minimum time the data must remain stable and valid AFTER the active clock edge, while the internal latch is still closing. Changing data within t_h of the edge is a hold violation.",
      frontHI: "Hold time (t_h)",
      backHI: "वह न्यूनतम समय जितना data को active clock edge के बाद स्थिर और valid रहना चाहिए, जब भीतरी latch अब भी बंद हो रहा हो। edge के t_h के अंदर data बदलना एक hold violation है।"
    },
    {
      frontEN: "Clock-to-Q (t_pcq)",
      backEN: "The propagation delay from the active clock edge until the new value is valid at the output Q. Unlike setup/hold (input constraints), t_pcq is a delay observed on the output, paid once every clock cycle.",
      frontHI: "Clock-to-Q (t_pcq)",
      backHI: "active clock edge से लेकर जब तक नया मान output Q पर valid न बने, उतना propagation delay। Setup/hold (input बंदिशें) के विपरीत, t_pcq output पर देखा गया delay है, हर clock cycle में एक बार चुकाया।"
    },
    {
      frontEN: "Setup/hold aperture",
      backEN: "The keep-out window from t_su before the edge to t_h after it, during which the data must not change. Honour it and Q captures cleanly; cross it with a data transition and the cell can go metastable.",
      frontHI: "Setup/hold aperture",
      backHI: "edge से t_su पहले से t_h बाद तक की keep-out window, जिसके दौरान data नहीं बदलना चाहिए। इसका मान रखिए और Q साफ़ पकड़ता है; इसे data transition से पार कीजिए और cell metastable हो सकता है।"
    },
    {
      frontEN: "Metastability",
      backEN: "When a setup/hold violation leaves the output hovering at an undefined, in-between voltage for an unpredictable time before settling randomly to 0 or 1. Guarded against with synchronizer flip-flops on asynchronous inputs.",
      frontHI: "Metastability",
      backHI: "जब setup/hold violation output को एक अपरिभाषित, बीच के voltage पर एक अनिश्चित समय मँडराता छोड़ता है, फिर randomly 0 या 1 पर settle। Asynchronous inputs पर synchronizer flip-flops से बचाव किया जाता है।"
    },
    {
      frontEN: "Maximum clock frequency",
      backEN: "In one period data must launch (t_pcq), cross the logic (t_pd) and meet setup (t_su), so Tc >= t_pcq + t_pd + t_su and f_max = 1 / Tc. Example: 2 + 5 + 1 = 8 ns gives f_max = 125 MHz.",
      frontHI: "अधिकतम clock frequency",
      backHI: "एक period में data को launch (t_pcq), logic पार (t_pd) और setup पूरा (t_su) करना है, तो Tc >= t_pcq + t_pd + t_su और f_max = 1 / Tc। उदाहरण: 2 + 5 + 1 = 8 ns देता है f_max = 125 MHz।"
    },
    {
      frontEN: "Race-around problem",
      backEN: "A level-triggered JK with J = K = 1 and the clock held high oscillates Q 0->1->0->1 for the whole pulse, because one gate delay tp << the pulse width T lets floor(T/tp) toggles fit in one level - so the final Q is unpredictable.",
      frontHI: "Race-around problem",
      backHI: "J = K = 1 और clock high पकड़े एक level-triggered JK, Q को पूरे pulse भर 0->1->0->1 दोलन कराता है, क्योंकि एक gate delay tp << pulse width T से floor(T/tp) toggles एक level में समाते हैं - तो अंतिम Q अनिश्चित है।"
    },
    {
      frontEN: "Master-slave / phase isolation",
      backEN: "Two JK latches on opposite clock phases: master accepts while the clock is high, slave outputs while it is low, never open together. That phase isolation breaks the feedback loop, so Q changes at most once per clock - the 100% race-around fix with no speed penalty.",
      frontHI: "Master-slave / phase isolation",
      backHI: "दो JK latches उलटी clock phases पर: clock high रहते master स्वीकारता है, low रहते slave output देता है, कभी एक साथ खुले नहीं। वह phase isolation feedback loop तोड़ता है, तो Q हर clock पर अधिकतम एक बार बदलता है - बिना speed दंड के 100% race-around इलाज।"
    }
  ],
  quiz: [
    {
      questionEN: "Setup time (t_su) is the time the data must be stable...",
      questionHI: "Setup time (t_su) वह समय है जितना data को स्थिर रहना चाहिए...",
      options: [
        "before the active clock edge",
        "after the active clock edge",
        "for the whole clock-high level",
        "only while the clock is low"
      ],
      answerIndex: 0,
      explainEN: "Setup time is the minimum interval the data must be stable and valid BEFORE the active edge, so the flip-flop can sense it. Stability required AFTER the edge is the hold time.",
      explainHI: "Setup time वह न्यूनतम अंतराल है जितना data को active edge से पहले स्थिर और valid रहना चाहिए, ताकि flip-flop इसे भाँप सके। edge के बाद ज़रूरी स्थिरता hold time है।"
    },
    {
      questionEN: "A data transition that lands inside the setup/hold aperture causes...",
      questionHI: "जो data transition setup/hold aperture के अंदर उतरता है वह कारण बनता है...",
      options: [
        "metastability - an undefined output that settles randomly",
        "a guaranteed correct capture",
        "the clock frequency to double",
        "the hold time to disappear"
      ],
      answerIndex: 0,
      explainEN: "Changing data inside the keep-out window violates setup or hold, and the flip-flop can go metastable: the output hovers at an undefined level for an unpredictable time before resolving randomly to 0 or 1.",
      explainHI: "keep-out window के अंदर data बदलना setup या hold तोड़ता है, और flip-flop metastable हो सकता है: output एक अपरिभाषित स्तर पर अनिश्चित समय मँडराता है फिर randomly 0 या 1 पर हल होता है।"
    },
    {
      questionEN: "The clock-to-Q delay (t_pcq) is measured...",
      questionHI: "Clock-to-Q delay (t_pcq) कहाँ से मापा जाता है...",
      options: [
        "from the active edge until Q is valid at the output",
        "from when the data arrives until the edge",
        "from one clock edge to the next",
        "from Q changing until the data changes"
      ],
      answerIndex: 0,
      explainEN: "t_pcq is the propagation delay from the active clock edge until the new value is valid at Q. It is an output delay, paid once per cycle, not an input constraint like setup or hold.",
      explainHI: "t_pcq active clock edge से लेकर जब तक नया मान Q पर valid न बने, उतना propagation delay है। यह एक output delay है, हर cycle एक बार चुकाया, setup या hold जैसी input बंदिश नहीं।"
    },
    {
      questionEN: "The maximum clock period must satisfy which inequality?",
      questionHI: "अधिकतम clock period को कौन सी असमानता संतुष्ट करनी चाहिए?",
      options: [
        "Tc >= t_pcq + t_pd + t_su",
        "Tc >= t_pcq + t_pd + t_h",
        "Tc >= t_su + t_h",
        "Tc >= t_pd - t_su"
      ],
      answerIndex: 0,
      explainEN: "In one period the data must leave the first flip-flop (t_pcq), cross the combinational logic (t_pd), and meet the next flip-flop's setup (t_su): Tc >= t_pcq + t_pd + t_su. Hold time is a separate short-path rule, not part of the period.",
      explainHI: "एक period में data को पहले flip-flop से निकलना (t_pcq), combinational logic पार करना (t_pd), और अगले flip-flop का setup पूरा करना (t_su) है: Tc >= t_pcq + t_pd + t_su। Hold time एक अलग short-path नियम है, period का हिस्सा नहीं।"
    },
    {
      questionEN: "With t_pcq = 2 ns, t_pd = 5 ns and t_su = 1 ns, the maximum clock frequency is:",
      questionHI: "t_pcq = 2 ns, t_pd = 5 ns और t_su = 1 ns के साथ, अधिकतम clock frequency है:",
      options: ["125 MHz", "8 MHz", "1000 MHz", "62.5 MHz"],
      answerIndex: 0,
      explainEN: "Tc = 2 + 5 + 1 = 8 ns, so f_max = 1 / Tc = 1 / (8 ns) = 125 MHz.",
      explainHI: "Tc = 2 + 5 + 1 = 8 ns, तो f_max = 1 / Tc = 1 / (8 ns) = 125 MHz।"
    },
    {
      questionEN: "The race-around problem occurs in a level-triggered JK when...",
      questionHI: "Race-around problem एक level-triggered JK में तब होता है जब...",
      options: [
        "J = K = 1 and the clock is held high, with tp << T",
        "J = K = 0 and the clock is low",
        "J = 1, K = 0 at a single edge",
        "the setup time equals the hold time"
      ],
      answerIndex: 0,
      explainEN: "Only the toggle command J = K = 1, combined with a level clock held high long enough that the gate delay tp is much smaller than the pulse width T, lets Q toggle floor(T/tp) times and end unpredictably.",
      explainHI: "केवल toggle आदेश J = K = 1, एक level clock के साथ जो इतनी देर high पकड़ा हो कि gate delay tp, pulse width T से बहुत छोटा हो, Q को floor(T/tp) बार toggle कराकर अनिश्चित रूप से समाप्त होने देता है।"
    },
    {
      questionEN: "Why does a master-slave flip-flop eliminate race-around?",
      questionHI: "Master-slave flip-flop race-around को क्यों ख़त्म करता है?",
      options: [
        "The master and slave are never open together, so phase isolation breaks the feedback loop",
        "It removes the clock entirely",
        "It makes the gate delay tp larger than T",
        "It forbids the J = K = 1 input"
      ],
      answerIndex: 0,
      explainEN: "Master and slave latches are enabled on opposite clock phases and never transparent at the same time. That phase isolation breaks the feedback loop, so Q can change at most once per clock - the complete fix with no speed penalty.",
      explainHI: "Master और slave latches उलटी clock phases पर enabled होते हैं और कभी एक साथ transparent नहीं। वह phase isolation feedback loop तोड़ता है, तो Q हर clock पर अधिकतम एक बार बदल सकता है - बिना speed दंड के पूरा इलाज।"
    }
  ]
};
