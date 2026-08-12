import type { SubContent } from '../_subtractor/kit';

/**
 * dsd/33 - Flip-Flop Conversions, "The Flip-Flop Adapter" (Sequential Logic track).
 * You own one flip-flop type but the design needs another's behaviour. The fix is
 * an adapter: a small COMBINATIONAL glue block that maps the target flip-flop's
 * external inputs (and, when required, the present state Q fed back) onto the
 * inputs of the available flip-flop, so the available FF now behaves exactly like
 * the target. The 4-step method: (1) identify target + available and their
 * equations, (2) build the master conversion table = target truth table + the
 * available FF's excitation entries, (3) minimise those input columns with K-maps,
 * (4) realise the circuit. Worked here: JK->D gives J=D, K=D' (NO feedback), and
 * SR->T gives S=T·Q', R=T·Q (feedback from Q REQUIRED). All values are computed in
 * scenes.tsx from ffNext / ffExcite - never hardcoded.
 */
export const CONTENT: SubContent = {
  moduleTitle: "Flip-Flop Conversions - The Flip-Flop Adapter",
  moduleSubtitle: "Have one flip-flop type, need another's behaviour? Wrap it in a little combinational glue and it obeys.",
  scenes: [
    {
      id: "S00_Cover",
      label: "The Flip-Flop Adapter",
      kind: "cover",
      subtitle: "A combinational adapter that makes the flip-flop you HAVE behave like the one you NEED.",
      theoryEN: [
        "This module builds flip-flop conversion: the trick that turns a flip-flop of one type into the behaviour of another, without changing the flip-flop itself. You keep the AVAILABLE flip-flop as your memory element and bolt a small COMBINATIONAL logic block in front of it. That block is the adapter.",
        "Why bother? Resource constraints. A chip or a lab kit gives you a drawer full of, say, JK flip-flops, but the design on the spec sheet is written in D or T flip-flops. Rather than order new parts, you convert - you map the target inputs onto the available inputs with a few gates.",
        "The model is always the same shape: the target flip-flop's external inputs, plus the present state Q fed back when needed, enter a combinational glue block; the glue drives the available flip-flop's inputs; the available flip-flop produces Q. From the outside it now looks and acts exactly like the target flip-flop.",
        "Two conversions run through the whole module. JK -> D needs only J = D and K = D' - pure combinational, no feedback. SR -> T needs S = T·Q' and R = T·Q - here the glue must read the present state Q, so a feedback wire is unavoidable.",
        "By the end you will run the 4-step method (identify, build the master conversion table, minimise with K-maps, realise the circuit), read a universal conversion matrix that covers every target-from-every-available pair, and build a JK-as-D flip-flop for real on the workbench."
      ],
      theoryHI: [
        "इस module में हम flip-flop conversion बनाएँगे: वह trick जो एक type के flip-flop को दूसरे के बर्ताव में बदल देती है, बिना ख़ुद flip-flop बदले। आप AVAILABLE flip-flop को अपना memory element रखते हैं और उसके आगे एक छोटा COMBINATIONAL logic block जोड़ देते हैं। वही block adapter है।",
        "क्यों? Resource constraints। किसी chip या lab kit में आपके पास, मान लीजिए, JK flip-flops का ढेर है, पर spec sheet का design D या T flip-flops में लिखा है। नए parts मँगाने के बजाय आप convert करते हैं - कुछ gates से target inputs को available inputs पर map कर देते हैं।",
        "Model का आकार हमेशा एक जैसा है: target flip-flop के external inputs, और ज़रूरत पड़ने पर present state Q feedback, एक combinational glue block में घुसते हैं; glue available flip-flop के inputs चलाता है; available flip-flop Q बनाता है। बाहर से यह अब बिलकुल target flip-flop जैसा दिखता और काम करता है।",
        "दो conversions पूरे module में चलती हैं। JK -> D को सिर्फ़ J = D और K = D' चाहिए - शुद्ध combinational, कोई feedback नहीं। SR -> T को S = T·Q' और R = T·Q चाहिए - यहाँ glue को present state Q पढ़ना पड़ता है, तो एक feedback तार अनिवार्य है।",
        "अंत तक आप 4-step method चलाएँगे (identify, master conversion table बनाना, K-maps से minimise, circuit realise), एक universal conversion matrix पढ़ेंगे जो हर target-हर-available pair समेटता है, और workbench पर असली में एक JK-as-D flip-flop बनाएँगे।"
      ],
      transcriptEN: "Welcome to the Flip-Flop Adapter. You own one kind of flip-flop but the design needs another. Instead of swapping parts, you convert: keep the available flip-flop and bolt a small combinational glue block in front of it. That glue takes the target flip-flop's external inputs - plus the present state Q fed back when needed - and drives the available flip-flop's inputs, so from the outside the whole thing behaves exactly like the target. Two examples run through the module. JK to D needs only J equals D and K equals D-not, pure combinational, no feedback. SR to T needs S equals T and Q-not, R equals T and Q, so the glue must read the present state and a feedback wire is unavoidable. You'll learn the four-step method - identify, build the master conversion table, minimise with K-maps, realise the circuit - read a universal conversion matrix for every pair, and build a JK-as-D flip-flop for real.",
      transcriptHI: "Flip-Flop Adapter में आपका स्वागत है। आपके पास एक तरह का flip-flop है पर design को दूसरा चाहिए। parts बदलने के बजाय आप convert करते हैं: available flip-flop को रखिए और उसके आगे एक छोटा combinational glue block जोड़िए। वह glue target flip-flop के external inputs - और ज़रूरत पर present state Q feedback - लेकर available flip-flop के inputs चलाता है, तो बाहर से पूरी चीज़ बिलकुल target जैसा बर्ताव करती है। दो उदाहरण module में चलते हैं। JK to D को सिर्फ़ J बराबर D और K बराबर D-not चाहिए, शुद्ध combinational, कोई feedback नहीं। SR to T को S बराबर T और Q-not, R बराबर T और Q चाहिए, तो glue को present state पढ़ना पड़ता है और एक feedback तार अनिवार्य है। आप 4-step method सीखेंगे - identify, master conversion table बनाना, K-maps से minimise, circuit realise - हर pair के लिए universal conversion matrix पढ़ेंगे, और असली में एक JK-as-D flip-flop बनाएँगे।",
      visualNote: "Hero: an interactive conversion machine - pick a TARGET flip-flop and an AVAILABLE flip-flop; a combinational glue box maps the target inputs (and Q feedback when needed) to the available FF's inputs, and the glue equations plus a computed master conversion table appear."
    },
    {
      id: "S01_Video",
      label: "Flip-Flop Conversions, The Adapter",
      kind: "video",
      subtitle: "A short film: how a combinational glue block makes one flip-flop imitate another.",
      theoryEN: [
        "Here is the whole idea in one breath before you watch. A flip-flop conversion inserts a combinational logic block between your inputs and the flip-flop you actually own, so the pair behaves like the flip-flop you wanted. The flip-flop is still the memory; the glue just translates.",
        "Picture it as a travel adapter. Your laptop's plug (the target's inputs) does not fit the foreign wall socket (the available flip-flop's inputs), so you slot an adapter between them. The power - the actual behaviour - is unchanged; only the shape of the connection is remapped.",
        "The engine of the method is the excitation table of the AVAILABLE flip-flop. For every required transition Q -> Q(t+1) that the target demands, the excitation table tells you exactly what inputs the available flip-flop needs. Collect those into a master conversion table, K-map each input column, and you have the glue equations.",
        "Two facts to hold on to from the worked examples. JK -> D collapses to J = D and K = D' with no feedback at all, because the JK excitation table's don't-cares let the K-map ignore Q. SR -> T collapses to S = T·Q' and R = T·Q, which explicitly contain Q, so the present state must be fed back.",
        "Keep one running mantra for the module: the available flip-flop's excitation table is the blueprint, and the don't-cares of JK and SR are what make their conversions so clean."
      ],
      theoryHI: [
        "देखने से पहले पूरा विचार एक साँस में। एक flip-flop conversion आपके inputs और आपके पास मौजूद flip-flop के बीच एक combinational logic block डालती है, ताकि यह जोड़ी उस flip-flop जैसा बर्ताव करे जो आप चाहते थे। flip-flop अब भी memory है; glue सिर्फ़ अनुवाद करता है।",
        "इसे एक travel adapter की तरह सोचिए। आपके laptop का plug (target के inputs) विदेशी wall socket (available flip-flop के inputs) में फ़िट नहीं होता, तो आप बीच में एक adapter लगाते हैं। बिजली - असली behaviour - वही रहती है; सिर्फ़ जोड़ का आकार फिर से map होता है।",
        "method का engine है AVAILABLE flip-flop की excitation table। target जो भी transition Q -> Q(t+1) माँगता है, उसके लिए excitation table ठीक बताती है कि available flip-flop को कौन से inputs चाहिए। इन्हें एक master conversion table में इकट्ठा कीजिए, हर input column का K-map बनाइए, और आपके पास glue equations हैं।",
        "worked examples से दो तथ्य पकड़े रखिए। JK -> D बिना किसी feedback के J = D और K = D' में सिमट जाता है, क्योंकि JK excitation table के don't-cares K-map को Q अनदेखा करने देते हैं। SR -> T S = T·Q' और R = T·Q में सिमटता है, जिनमें Q साफ़ मौजूद है, तो present state को feedback करना पड़ता है।",
        "module के लिए एक mantra रखिए: available flip-flop की excitation table blueprint है, और JK तथा SR के don't-cares ही इनकी conversions को इतना साफ़ बनाते हैं।"
      ],
      transcriptEN: "Here's the whole idea in one breath. A flip-flop conversion inserts a combinational logic block between your inputs and the flip-flop you actually own, so the pair behaves like the one you wanted. The flip-flop is still the memory; the glue just translates. Picture a travel adapter: your plug, the target's inputs, doesn't fit the foreign socket, the available flip-flop's inputs, so you slot an adapter between them. The power - the behaviour - is unchanged; only the connection is remapped. The engine of the method is the excitation table of the available flip-flop: for every transition the target demands, it tells you exactly what inputs the available flip-flop needs. Collect those into a master conversion table, K-map each input column, and you have the glue equations. Two facts: JK to D collapses to J equals D and K equals D-not with no feedback, because the JK don't-cares let the K-map ignore Q; SR to T collapses to S equals T Q-not and R equals T Q, which contain Q, so the present state must be fed back.",
      transcriptHI: "पूरा विचार एक साँस में। एक flip-flop conversion आपके inputs और आपके पास मौजूद flip-flop के बीच एक combinational logic block डालती है, ताकि जोड़ी उस जैसा बर्ताव करे जो आप चाहते थे। flip-flop अब भी memory है; glue सिर्फ़ अनुवाद करता है। एक travel adapter सोचिए: आपका plug, target के inputs, विदेशी socket में फ़िट नहीं होता, तो आप बीच में adapter लगाते हैं। बिजली - behaviour - वही रहती है; सिर्फ़ जोड़ फिर से map होता है। method का engine है available flip-flop की excitation table: target जो transition माँगता है, यह ठीक बताती है कि available flip-flop को कौन से inputs चाहिए। इन्हें master conversion table में इकट्ठा कीजिए, हर input column का K-map बनाइए, glue equations मिल गए। दो तथ्य: JK to D बिना feedback J बराबर D और K बराबर D-not में सिमटता है, क्योंकि JK के don't-cares K-map को Q अनदेखा करने देते हैं; SR to T S बराबर T Q-not और R बराबर T Q में सिमटता है, जिनमें Q है, तो present state feedback करना पड़ता है।",
      visualNote: "Animated explainer: a target plug morphing through a glue adapter into the available flip-flop's socket; JK->D shows no feedback line, SR->T lights up a Q feedback line."
    },
    {
      id: "S02_Facts",
      label: "Why Convert, And The Model",
      kind: "theory",
      subtitle: "One flip-flop in the drawer, another's behaviour on the spec sheet - bridge them with logic.",
      theoryEN: [
        "The problem that motivates every conversion is a resource constraint. In practice you rarely get to choose your flip-flop; a chip, an FPGA library cell or a lab kit hands you one type - very often JK, because it is the most general - while the design you must implement is specified in terms of D, T or SR. Converting is cheaper and faster than sourcing new parts, so it is a bread-and-butter skill.",
        "Every conversion follows one fixed model, and it pays to draw it once and keep it. The flip-flop you own - the AVAILABLE flip-flop - stays exactly as it is and remains the memory element. In front of it you place a purely COMBINATIONAL logic block. Into that block go the external inputs of the TARGET flip-flop (the D, or the T, or the S and R the outside world will apply), and, when the maths demands it, the present state Q fed back from the flip-flop's own output.",
        "The combinational block's outputs are wired to the available flip-flop's inputs. So the signal path is: target inputs (and maybe Q) -> combinational glue -> available flip-flop inputs -> available flip-flop -> Q. Seen as a black box, the whole assembly now has the target flip-flop's inputs on the outside and reproduces the target flip-flop's next-state behaviour exactly.",
        "The single most important tool in this model is the excitation table of the AVAILABLE flip-flop. Recall it is the reverse of the characteristic table: instead of asking what next state a set of inputs produces, it asks what inputs are required to force a given transition Q -> Q(t+1). That is precisely the question conversion asks, because the target tells us the transition and we must find the available flip-flop's inputs that deliver it.",
        "Notice a design fork hiding in the model. If the required inputs turn out to depend only on the target's external inputs, the glue is memoryless and no feedback wire is needed - JK -> D is the clean case. If the required inputs depend on the present state as well, the glue must read Q, and a feedback path from the output back into the combinational block becomes part of the circuit - SR -> T is that case. Whether feedback appears is decided entirely by the algebra, not by choice."
      ],
      theoryHI: [
        "हर conversion के पीछे की समस्या एक resource constraint है। असल में आपको शायद ही अपना flip-flop चुनने को मिलता है; कोई chip, FPGA library cell या lab kit आपको एक type थमा देता है - अक्सर JK, क्योंकि वह सबसे सामान्य है - जबकि जो design आपको बनाना है वह D, T या SR में लिखा है। convert करना नए parts मँगाने से सस्ता और तेज़ है, तो यह रोज़मर्रा का कौशल है।",
        "हर conversion एक तय model पर चलती है, और इसे एक बार बनाकर रखना फ़ायदेमंद है। जो flip-flop आपके पास है - AVAILABLE flip-flop - वैसा ही रहता है और memory element बना रहता है। उसके आगे आप एक शुद्ध COMBINATIONAL logic block रखते हैं। उस block में जाते हैं TARGET flip-flop के external inputs (वह D, या T, या S और R जो बाहरी दुनिया लगाएगी), और जब गणित माँगे, flip-flop के अपने output से feedback किया present state Q।",
        "combinational block के outputs available flip-flop के inputs से जुड़ते हैं। तो signal path है: target inputs (और शायद Q) -> combinational glue -> available flip-flop inputs -> available flip-flop -> Q। एक black box के रूप में देखें तो पूरी असेंबली के बाहर अब target flip-flop के inputs हैं और यह target flip-flop का next-state बर्ताव ठीक-ठीक दोहराती है।",
        "इस model का सबसे ज़रूरी औज़ार है AVAILABLE flip-flop की excitation table। याद कीजिए यह characteristic table की उलटी है: यह नहीं पूछती कि कोई inputs कौन सा next state देते हैं, बल्कि पूछती है कि किसी दिए transition Q -> Q(t+1) को मजबूर करने के लिए कौन से inputs चाहिए। conversion ठीक यही सवाल पूछती है, क्योंकि target हमें transition बताता है और हमें वे available-flip-flop inputs ढूँढने हैं जो उसे दें।",
        "model में छिपा एक design दोराहा देखिए। अगर ज़रूरी inputs सिर्फ़ target के external inputs पर निर्भर निकलें, तो glue memoryless है और कोई feedback तार नहीं चाहिए - JK -> D साफ़ case है। अगर ज़रूरी inputs present state पर भी निर्भर हों, तो glue को Q पढ़ना पड़ता है, और output से वापस combinational block तक एक feedback path circuit का हिस्सा बन जाता है - SR -> T वही case है। feedback आता है या नहीं, यह पूरी तरह algebra तय करता है, पसंद नहीं।"
      ],
      transcriptEN: "The problem is a resource constraint: a chip or kit hands you one flip-flop type - often JK - while your design is specified in D, T or SR, and converting beats buying new parts. Every conversion follows one model. The available flip-flop stays as the memory element; in front of it sits a purely combinational logic block. Into that block go the target flip-flop's external inputs and, when the maths demands, the present state Q fed back from the output. The block's outputs drive the available flip-flop's inputs. As a black box the whole thing now has the target's inputs and reproduces the target's next-state behaviour. The key tool is the available flip-flop's excitation table: it gives the inputs required to force a transition Q to Q-next, which is exactly what conversion needs. And here's the fork: if the required inputs depend only on the external inputs, the glue is memoryless - JK to D - but if they depend on the present state too, the glue must read Q through a feedback wire - SR to T.",
      transcriptHI: "समस्या एक resource constraint है: कोई chip या kit आपको एक flip-flop type देता है - अक्सर JK - जबकि आपका design D, T या SR में लिखा है, और convert करना नए parts ख़रीदने से बेहतर है। हर conversion एक model पर चलती है। available flip-flop memory element बना रहता है; उसके आगे एक शुद्ध combinational logic block बैठता है। उस block में जाते हैं target flip-flop के external inputs और, जब गणित माँगे, output से feedback किया present state Q। block के outputs available flip-flop के inputs चलाते हैं। black box के रूप में पूरी चीज़ के अब target के inputs हैं और यह target का next-state बर्ताव दोहराती है। मुख्य औज़ार है available flip-flop की excitation table: यह transition Q to Q-next मजबूर करने को ज़रूरी inputs देती है, ठीक वही जो conversion को चाहिए। और दोराहा: अगर ज़रूरी inputs सिर्फ़ external inputs पर निर्भर हों, glue memoryless है - JK to D - पर अगर present state पर भी निर्भर हों, glue को feedback तार से Q पढ़ना पड़ता है - SR to T।",
      visualNote: "The general conversion model as an SVG (target inputs + Q feedback -> combinational glue -> available FF -> Q), a live available flip-flop, and an excitation-table explorer that shows the blueprint for any available FF."
    },
    {
      id: "S03_Method",
      label: "The 4-Step Method",
      kind: "theory",
      subtitle: "Identify -> master conversion table -> K-map minimise -> realise.",
      theoryEN: [
        "Every flip-flop conversion, however exotic the pair, is solved by the same four disciplined steps. Learn them as a fixed pipeline and no conversion can surprise you; the only thing that changes from problem to problem is the arithmetic inside each box.",
        "Step 1 - Identify. Name the TARGET flip-flop (the behaviour you must reproduce) and the AVAILABLE flip-flop (the part you actually have). Write both of their defining equations: the target's characteristic equation tells you the next state it demands, and the available flip-flop's excitation table tells you how to command any transition. For JK -> D that is: target D has Q(t+1) = D; available JK has the excitation table with its don't-cares.",
        "Step 2 - Construct the master conversion table. List every combination of the target's external inputs together with the present state Q. For each row compute the desired next state Q(t+1) from the target's characteristic equation, then look up, in the AVAILABLE flip-flop's excitation table, the inputs required to move Q to that Q(t+1). Those required inputs become extra columns - they are the outputs the glue must produce.",
        "Step 3 - Minimise with K-maps. Treat each required-input column as a Boolean function of the target inputs and Q, and minimise it on a Karnaugh map. This is where JK and SR earn their keep: their excitation tables are riddled with don't-cares (x), and every don't-care is a free choice on the map that usually collapses the expression dramatically - which is why JK -> D reduces all the way to J = D, K = D'.",
        "Step 4 - Realise. Draw the combinational glue from the minimised equations and wire its outputs to the available flip-flop's inputs. If any equation contains Q or Q', run a feedback wire from the flip-flop's output back into the glue; if none does, the glue is purely feed-forward. Then verify by walking every row: the assembled circuit's next state must match the target's for all inputs and all present states."
      ],
      theoryHI: [
        "हर flip-flop conversion, चाहे जोड़ी कितनी भी अनोखी हो, इन्हीं चार अनुशासित steps से हल होती है। इन्हें एक तय pipeline की तरह सीख लीजिए और कोई conversion आपको चौंका नहीं सकती; हर समस्या में सिर्फ़ हर box के अंदर का गणित बदलता है।",
        "Step 1 - Identify। TARGET flip-flop (जो behaviour दोहराना है) और AVAILABLE flip-flop (जो part आपके पास है) का नाम लीजिए। दोनों के defining equations लिखिए: target का characteristic equation बताता है वह कौन सा next state माँगता है, और available flip-flop की excitation table बताती है किसी भी transition को कैसे command करें। JK -> D के लिए: target D का Q(t+1) = D; available JK की excitation table उसके don't-cares के साथ।",
        "Step 2 - master conversion table बनाइए। target के external inputs का हर combination present state Q के साथ list कीजिए। हर row के लिए target के characteristic equation से चाहा गया next state Q(t+1) निकालिए, फिर AVAILABLE flip-flop की excitation table में देखिए कि Q को उस Q(t+1) तक ले जाने को कौन से inputs चाहिए। वे ज़रूरी inputs अतिरिक्त columns बनते हैं - यही वे outputs हैं जो glue को बनाने हैं।",
        "Step 3 - K-maps से minimise कीजिए। हर required-input column को target inputs और Q का एक Boolean function मानिए, और उसे Karnaugh map पर minimise कीजिए। यहीं JK और SR अपनी क़ीमत वसूलते हैं: इनकी excitation tables don't-cares (x) से भरी हैं, और हर don't-care map पर एक मुफ़्त चुनाव है जो अक्सर expression को नाटकीय रूप से सिकोड़ देता है - इसीलिए JK -> D पूरा J = D, K = D' तक घट जाता है।",
        "Step 4 - Realise। minimised equations से combinational glue बनाइए और इसके outputs available flip-flop के inputs से जोड़िए। अगर कोई equation Q या Q' रखता है, तो flip-flop के output से वापस glue तक एक feedback तार चलाइए; अगर कोई नहीं रखता, तो glue शुद्ध feed-forward है। फिर हर row चलकर verify कीजिए: बनी circuit का next state सभी inputs और सभी present states के लिए target से मेल खाना चाहिए।"
      ],
      transcriptEN: "Every conversion is solved by the same four steps. Step one, identify: name the target flip-flop, the behaviour you must reproduce, and the available flip-flop, the part you have, and write both equations - the target's characteristic equation and the available flip-flop's excitation table. Step two, build the master conversion table: list every combination of the target's external inputs with the present state Q; for each row compute the desired next state from the target's characteristic equation, then read from the available flip-flop's excitation table the inputs required to reach it. Those required inputs become new columns - the outputs the glue must make. Step three, minimise with K-maps: treat each required-input column as a function of the target inputs and Q and minimise it; JK and SR shine here because their excitation don't-cares collapse the expressions, which is why JK to D reduces to J equals D, K equals D-not. Step four, realise: draw the glue and wire it to the available flip-flop; if any equation contains Q, add a feedback wire; then verify row by row.",
      transcriptHI: "हर conversion इन्हीं चार steps से हल होती है। Step एक, identify: target flip-flop, जो behaviour दोहराना है, और available flip-flop, जो part आपके पास है, का नाम लीजिए, और दोनों equations लिखिए - target का characteristic equation और available flip-flop की excitation table। Step दो, master conversion table बनाइए: target के external inputs का हर combination present state Q के साथ list कीजिए; हर row के लिए target के characteristic equation से चाहा गया next state निकालिए, फिर available flip-flop की excitation table से उसे पाने को ज़रूरी inputs पढ़िए। वे required inputs नए columns बनते हैं - वही outputs जो glue को बनाने हैं। Step तीन, K-maps से minimise: हर required-input column को target inputs और Q का function मानकर minimise कीजिए; JK और SR यहाँ चमकते हैं क्योंकि इनके don't-cares expressions सिकोड़ देते हैं, इसीलिए JK to D J बराबर D, K बराबर D-not तक घटता है। Step चार, realise: glue बनाइए और available flip-flop से जोड़िए; अगर कोई equation Q रखता है, feedback तार जोड़िए; फिर row-दर-row verify कीजिए।",
      visualNote: "A bespoke 4-step pipeline: four clickable stages (Identify, Master table, K-map minimise, Realise); each stage reveals the concrete artifact for the JK->D example, all computed."
    },
    {
      id: "S04_JKtoD",
      label: "Worked: JK -> D",
      kind: "theory",
      subtitle: "Make a JK behave as a D flip-flop - the glue is J = D, K = D', with no feedback.",
      theoryEN: [
        "Take the most common conversion in real hardware: you have JK flip-flops and the design wants a D flip-flop. A D flip-flop's law is trivially Q(t+1) = D - whatever D is now becomes Q on the next edge. Our job is to find what J and K the JK flip-flop must see so that it copies D just like that.",
        "Run step 2 and build the master conversion table. There is one external input, D, and the present state Q, so there are four rows. For each row the desired next state is simply Q(t+1) = D. Now read the JK excitation table for each transition. When D = 0 and Q = 0 the transition is 0 -> 0, needing J = 0, K = x. When D = 0 and Q = 1 the transition is 1 -> 0, needing J = x, K = 1. When D = 1 and Q = 0 the transition is 0 -> 1, needing J = 1, K = x. When D = 1 and Q = 1 the transition is 1 -> 1, needing J = x, K = 0.",
        "Now step 3, the K-maps, one for J and one for K, each over the variables D and Q. The J column reads 0, x, 1, x across the rows above; plotting it, the two don't-cares are free, and the cleanest cover is simply J = D (J is 1 exactly where D is 1, and the don't-cares agree). The K column reads x, 1, x, 0; its cleanest cover is K = D' (K is 1 exactly where D is 0, don't-cares agreeing).",
        "So the glue is astonishingly small: J = D and K = D'. Wire the D input straight to J, pass the same D input through a single inverter to make D' and wire that to K. That is the entire adapter - one wire and one NOT gate.",
        "Crucially, neither J nor K contains Q, so there is NO feedback path: the glue is purely feed-forward. You can check the result directly with the JK characteristic equation: Q(t+1) = J·Q' + K'·Q = D·Q' + (D')'·Q = D·Q' + D·Q = D·(Q' + Q) = D. The JK flip-flop, fed J = D and K = D', reproduces Q(t+1) = D exactly - it is now a D flip-flop."
      ],
      theoryHI: [
        "असली hardware की सबसे आम conversion लीजिए: आपके पास JK flip-flops हैं और design को D flip-flop चाहिए। D flip-flop का नियम सीधा है Q(t+1) = D - अभी D जो है वही अगले edge पर Q बन जाता है। हमारा काम है ढूँढना कि JK flip-flop को कौन से J और K दिखें ताकि वह D को बिलकुल वैसे ही copy करे।",
        "Step 2 चलाइए और master conversion table बनाइए। एक external input है, D, और present state Q, तो चार rows हैं। हर row के लिए चाहा गया next state बस Q(t+1) = D है। अब हर transition के लिए JK excitation table पढ़िए। D = 0 और Q = 0 पर transition 0 -> 0 है, चाहिए J = 0, K = x। D = 0 और Q = 1 पर transition 1 -> 0, चाहिए J = x, K = 1। D = 1 और Q = 0 पर transition 0 -> 1, चाहिए J = 1, K = x। D = 1 और Q = 1 पर transition 1 -> 1, चाहिए J = x, K = 0।",
        "अब step 3, K-maps, एक J के लिए और एक K के लिए, हर एक variables D और Q पर। J column ऊपर की rows में 0, x, 1, x पढ़ता है; इसे plot कीजिए, दोनों don't-cares मुफ़्त हैं, और सबसे साफ़ cover बस J = D है (J ठीक वहीं 1 है जहाँ D 1 है, और don't-cares सहमत हैं)। K column x, 1, x, 0 पढ़ता है; इसका सबसे साफ़ cover K = D' है (K ठीक वहीं 1 है जहाँ D 0 है, don't-cares सहमत)।",
        "तो glue हैरान कर देने वाला छोटा है: J = D और K = D'। D input सीधे J से जोड़िए, उसी D input को एक inverter से गुज़ारकर D' बनाइए और उसे K से जोड़िए। यही पूरा adapter है - एक तार और एक NOT gate।",
        "अहम बात, न J न K में Q है, तो कोई feedback path नहीं: glue शुद्ध feed-forward है। नतीजा सीधे JK characteristic equation से जाँचिए: Q(t+1) = J·Q' + K'·Q = D·Q' + (D')'·Q = D·Q' + D·Q = D·(Q' + Q) = D। JK flip-flop, J = D और K = D' दिए, Q(t+1) = D ठीक-ठीक दोहराता है - अब यह एक D flip-flop है।"
      ],
      transcriptEN: "The most common conversion: you have JK, the design wants D. A D flip-flop's law is Q-next equals D. Build the master conversion table - one external input D plus the present state Q, four rows - and for each the desired next state is D. Read the JK excitation table: D zero Q zero is transition zero to zero, J zero K don't-care; D zero Q one is one to zero, J don't-care K one; D one Q zero is zero to one, J one K don't-care; D one Q one is one to one, J don't-care K zero. K-map the J column, zero, x, one, x: the don't-cares are free, cleanest cover J equals D. K-map the K column, x, one, x, zero: cleanest cover K equals D-not. So the glue is J equals D, K equals D-not: wire D straight to J, and D through one inverter to K. Neither contains Q, so there is no feedback. Check with the characteristic equation: J Q-not plus K-not Q equals D Q-not plus D Q equals D. The JK is now a D flip-flop.",
      transcriptHI: "सबसे आम conversion: आपके पास JK है, design को D चाहिए। D flip-flop का नियम Q-next बराबर D। master conversion table बनाइए - एक external input D और present state Q, चार rows - और हर के लिए चाहा गया next state D है। JK excitation table पढ़िए: D zero Q zero transition zero to zero, J zero K don't-care; D zero Q one one to zero, J don't-care K one; D one Q zero zero to one, J one K don't-care; D one Q one one to one, J don't-care K zero। J column का K-map, zero, x, one, x: don't-cares मुफ़्त, सबसे साफ़ cover J बराबर D। K column का K-map, x, one, x, zero: सबसे साफ़ cover K बराबर D-not। तो glue है J बराबर D, K बराबर D-not: D सीधे J से, और D एक inverter से K तक। किसी में Q नहीं, तो कोई feedback नहीं। characteristic equation से जाँचिए: J Q-not plus K-not Q बराबर D Q-not plus D Q बराबर D। JK अब एक D flip-flop है।",
      visualNote: "A StepThrough that builds the JK->D master conversion table and the J and K K-maps from ffExcite (all computed), then a live JK-as-D circuit: D wired to J directly and through a NOT gate (LiveGate) to K, proving Q(t+1)=D for both present states."
    },
    {
      id: "S05_SRtoT",
      label: "Worked: SR -> T",
      kind: "theory",
      subtitle: "Make an SR behave as a T flip-flop - the glue is S = T·Q', R = T·Q, feedback required.",
      theoryEN: [
        "Now a conversion that forces feedback into the open: you have SR flip-flops and the design wants a T (toggle) flip-flop. A T flip-flop's law is Q(t+1) = T ⊕ Q - when T = 0 it holds, when T = 1 it toggles. We must find the S and R the SR flip-flop needs so it toggles or holds on command.",
        "Build the master conversion table with the external input T and the present state Q, four rows, and the desired next state Q(t+1) = T ⊕ Q in each. When T = 0, Q = 0 the transition is 0 -> 0, needing S = 0, R = x. When T = 0, Q = 1 the transition is 1 -> 1, needing S = x, R = 0. When T = 1, Q = 0 the transition is 0 -> 1, needing S = 1, R = 0. When T = 1, Q = 1 the transition is 1 -> 0, needing S = 0, R = 1.",
        "K-map the S column - 0, x, 1, 0 - and the single 1 sits where T = 1 and Q = 0, with the don't-care unable to enlarge the group usefully, giving S = T·Q'. K-map the R column - x, 0, 0, 1 - whose single 1 sits where T = 1 and Q = 1, giving R = T·Q. Both minimal expressions explicitly contain Q, so this conversion cannot avoid reading the present state.",
        "Realise it with two AND gates. The S input is the AND of T with Q' (the complemented output), and the R input is the AND of T with Q (the true output). Because Q and Q' come from the flip-flop's own outputs, you must run feedback wires from those outputs back into the two AND gates - the feedback path is an essential, non-optional part of the SR -> T adapter.",
        "Verify the toggle behaviour. With T = 1 and Q = 0: S = 1·1 = 1, R = 1·0 = 0, so the SR sets to Q = 1. With T = 1 and Q = 1: S = 1·0 = 0, R = 1·1 = 1, so the SR resets to Q = 0. It flips every clock, exactly like a T flip-flop. And note S and R are never both 1 (that needs T = 1 with Q' = 1 and Q = 1 simultaneously, which is impossible), so the SR forbidden state is safely never entered."
      ],
      theoryHI: [
        "अब एक conversion जो feedback को खुलकर सामने लाती है: आपके पास SR flip-flops हैं और design को T (toggle) flip-flop चाहिए। T flip-flop का नियम Q(t+1) = T ⊕ Q - T = 0 पर hold, T = 1 पर toggle। हमें वे S और R ढूँढने हैं जो SR flip-flop को command पर toggle या hold कराएँ।",
        "external input T और present state Q के साथ master conversion table बनाइए, चार rows, हर में चाहा गया next state Q(t+1) = T ⊕ Q। T = 0, Q = 0 पर transition 0 -> 0, चाहिए S = 0, R = x। T = 0, Q = 1 पर transition 1 -> 1, चाहिए S = x, R = 0। T = 1, Q = 0 पर transition 0 -> 1, चाहिए S = 1, R = 0। T = 1, Q = 1 पर transition 1 -> 0, चाहिए S = 0, R = 1।",
        "S column का K-map - 0, x, 1, 0 - और इकलौता 1 वहाँ बैठता है जहाँ T = 1 और Q = 0, don't-care group को उपयोगी रूप से बड़ा नहीं कर पाता, देता है S = T·Q'। R column का K-map - x, 0, 0, 1 - जिसका इकलौता 1 वहाँ है जहाँ T = 1 और Q = 1, देता है R = T·Q। दोनों minimal expressions में Q साफ़ मौजूद है, तो यह conversion present state पढ़े बिना नहीं रह सकती।",
        "इसे दो AND gates से realise कीजिए। S input है T और Q' (complemented output) का AND, और R input है T और Q (सच्चा output) का AND। चूँकि Q और Q' flip-flop के अपने outputs से आते हैं, आपको उन outputs से वापस दोनों AND gates तक feedback तार चलाने होंगे - feedback path SR -> T adapter का अनिवार्य, ऐच्छिक-नहीं हिस्सा है।",
        "toggle behaviour verify कीजिए। T = 1 और Q = 0 पर: S = 1·1 = 1, R = 1·0 = 0, तो SR set होकर Q = 1। T = 1 और Q = 1 पर: S = 1·0 = 0, R = 1·1 = 1, तो SR reset होकर Q = 0। यह हर clock पलटता है, बिलकुल T flip-flop जैसा। और ध्यान दें S और R कभी दोनों 1 नहीं होते (उसके लिए T = 1 के साथ Q' = 1 और Q = 1 एक साथ चाहिए, जो असंभव है), तो SR की forbidden state में कभी सुरक्षित रूप से प्रवेश नहीं होता।"
      ],
      transcriptEN: "Now a conversion that forces feedback: you have SR, the design wants T. A T flip-flop's law is Q-next equals T xor Q - hold when T is zero, toggle when T is one. Build the master conversion table with input T and present state Q, next state T xor Q. T zero Q zero is zero to zero, S zero R don't-care; T zero Q one is one to one, S don't-care R zero; T one Q zero is zero to one, S one R zero; T one Q one is one to zero, S zero R one. K-map the S column, zero x one zero: the single one sits at T one Q zero, giving S equals T Q-not. K-map the R column, x zero zero one: the single one sits at T one Q one, giving R equals T Q. Both contain Q, so feedback is unavoidable. Realise with two AND gates: S is T and Q-not, R is T and Q, and Q and Q-not come from the flip-flop's own outputs fed back. Check: T one Q zero gives S one R zero, set to one; T one Q one gives S zero R one, reset to zero - it toggles, and S and R are never both one, so the forbidden state is never entered.",
      transcriptHI: "अब एक conversion जो feedback मजबूर करती है: आपके पास SR है, design को T चाहिए। T flip-flop का नियम Q-next बराबर T xor Q - T zero पर hold, T one पर toggle। input T और present state Q के साथ master conversion table बनाइए, next state T xor Q। T zero Q zero zero to zero, S zero R don't-care; T zero Q one one to one, S don't-care R zero; T one Q zero zero to one, S one R zero; T one Q one one to zero, S zero R one। S column का K-map, zero x one zero: इकलौता one T one Q zero पर, देता है S बराबर T Q-not। R column का K-map, x zero zero one: इकलौता one T one Q one पर, देता है R बराबर T Q। दोनों में Q है, तो feedback अनिवार्य। दो AND gates से realise: S है T and Q-not, R है T and Q, और Q तथा Q-not flip-flop के अपने outputs से feedback होते हैं। जाँच: T one Q zero देता है S one R zero, set to one; T one Q one देता है S zero R one, reset to zero - यह toggle करता है, और S तथा R कभी दोनों one नहीं, तो forbidden state में कभी प्रवेश नहीं।",
      visualNote: "A StepThrough that builds the SR->T master conversion table and the S and R K-maps from ffExcite (all computed), then a live SR-as-T circuit: two AND gates (LiveGate) with T and the fed-back Q / Q', proving the toggle and that S,R never collide."
    },
    {
      id: "S06_Matrix",
      label: "The Universal Conversion Matrix",
      kind: "theory",
      subtitle: "Every target from every available flip-flop, in one grid you can look up.",
      theoryEN: [
        "Once you have ground through JK -> D and SR -> T by hand, it is efficient to collect every standard conversion into one lookup grid. The rows are the TARGET flip-flop (the behaviour you want) and the columns are the AVAILABLE flip-flop (the part you have); each cell is the glue equation set that adapts one to the other, derived by exactly the 4-step method.",
        "Reading the D-target row: from an SR you need S = D, R = D'; from a JK you need J = D, K = D'. Both are feed-forward - no Q appears - so converting anything into a D flip-flop is always the simplest job, needing at most one inverter.",
        "Reading the T-target row: from an SR you need S = T·Q', R = T·Q; from a JK you need the beautifully symmetric J = T, K = T (tie both JK inputs together to the T line); and from a D flip-flop you need D = T ⊕ Q, a single XOR of the toggle input with the fed-back state. The SR and D routes read Q; the JK route does not.",
        "Reading the JK-target and SR-target rows: to build a JK from an SR you need S = J·Q', R = K·Q; to build a JK from a D you need D = J·Q' + K'·Q (which is literally the JK characteristic equation dropped into the D input). To build an SR from a JK you need only J = S, K = R; to build an SR from a D you need D = S + R'·Q (the SR characteristic equation on the D input).",
        "Two patterns are worth memorising from the grid. First, any conversion TO a D flip-flop or FROM a JK/SR tends to be cheapest, because D is a direct target and JK/SR excitation tables are full of simplifying don't-cares. Second, whenever a cell's equation contains Q or Q', that conversion needs a feedback wire; whenever it does not (JK -> D, SR -> D... i.e. D as target, and JK -> T with J = K = T), the glue is purely combinational."
      ],
      theoryHI: [
        "एक बार JK -> D और SR -> T हाथ से पीस लेने के बाद, हर standard conversion को एक lookup grid में इकट्ठा करना कुशल है। rows हैं TARGET flip-flop (जो behaviour चाहिए) और columns हैं AVAILABLE flip-flop (जो part है); हर cell वह glue equation set है जो एक को दूसरे में ढालता है, ठीक 4-step method से निकाला गया।",
        "D-target row पढ़िए: SR से चाहिए S = D, R = D'; JK से चाहिए J = D, K = D'। दोनों feed-forward हैं - कोई Q नहीं - तो किसी भी चीज़ को D flip-flop में बदलना हमेशा सबसे आसान काम है, अधिकतम एक inverter चाहिए।",
        "T-target row पढ़िए: SR से चाहिए S = T·Q', R = T·Q; JK से चाहिए ख़ूबसूरत symmetric J = T, K = T (दोनों JK inputs को T line से जोड़ दीजिए); और D flip-flop से चाहिए D = T ⊕ Q, toggle input का fed-back state के साथ एक XOR। SR और D रास्ते Q पढ़ते हैं; JK रास्ता नहीं।",
        "JK-target और SR-target rows पढ़िए: SR से JK बनाने को चाहिए S = J·Q', R = K·Q; D से JK बनाने को चाहिए D = J·Q' + K'·Q (जो शब्दशः JK characteristic equation D input में डाला गया है)। JK से SR बनाने को सिर्फ़ J = S, K = R चाहिए; D से SR बनाने को चाहिए D = S + R'·Q (SR characteristic equation D input पर)।",
        "grid से दो pattern याद रखने लायक़ हैं। पहला, D flip-flop में कोई भी conversion, या JK/SR से कोई conversion, आमतौर पर सबसे सस्ती होती है, क्योंकि D सीधा target है और JK/SR excitation tables सरलीकरण करने वाले don't-cares से भरी हैं। दूसरा, जब किसी cell का equation Q या Q' रखता है, उस conversion को feedback तार चाहिए; जब नहीं रखता (D as target, और JK -> T जिसमें J = K = T), glue शुद्ध combinational है।"
      ],
      transcriptEN: "Collect every standard conversion into one grid: rows are the target flip-flop, columns the available one, each cell the glue derived by the four-step method. D-target row: from SR you need S equals D, R equals D-not; from JK, J equals D, K equals D-not - both feed-forward. T-target row: from SR, S equals T Q-not, R equals T Q; from JK, the symmetric J equals T, K equals T; from D, D equals T xor Q. JK-target: from SR, S equals J Q-not, R equals K Q; from D, D equals J Q-not plus K-not Q, the JK characteristic equation on the D input. SR-target: from JK, J equals S, K equals R; from D, D equals S plus R-not Q. Two patterns: converting to a D, or from a JK or SR, is usually cheapest; and any cell whose equation contains Q needs a feedback wire, while those without - D as target, and JK to T with J equals K equals T - are purely combinational.",
      transcriptHI: "हर standard conversion को एक grid में इकट्ठा कीजिए: rows target flip-flop, columns available, हर cell 4-step method से निकाला glue। D-target row: SR से चाहिए S बराबर D, R बराबर D-not; JK से J बराबर D, K बराबर D-not - दोनों feed-forward। T-target row: SR से S बराबर T Q-not, R बराबर T Q; JK से symmetric J बराबर T, K बराबर T; D से D बराबर T xor Q। JK-target: SR से S बराबर J Q-not, R बराबर K Q; D से D बराबर J Q-not plus K-not Q, JK characteristic equation D input पर। SR-target: JK से J बराबर S, K बराबर R; D से D बराबर S plus R-not Q। दो pattern: D में, या JK/SR से conversion आमतौर पर सबसे सस्ती; और जिस cell का equation Q रखता है उसे feedback तार चाहिए, जो नहीं रखते - D as target, और JK to T जिसमें J बराबर K बराबर T - वे शुद्ध combinational हैं।",
      visualNote: "The universal conversion matrix rendered as a clickable grid (target rows x available columns); clicking a cell selects that pair, shows its glue equations big, and renders the computed master conversion table underneath from ffExcite."
    },
    {
      id: "S07_Analogy",
      label: "The Power-Plug Adapter",
      kind: "theory",
      subtitle: "Same power, different socket - the adapter is the combinational glue.",
      theoryEN: [
        "Here is the picture to keep for life: a travel power adapter. You fly abroad with a laptop whose plug is shaped for your home sockets, but the hotel wall gives you a completely different socket. You do not rewire the laptop and you do not rewire the building - you slot a small adapter between them, and the laptop runs perfectly.",
        "Map it onto conversion piece by piece. The electrical POWER flowing through is the behaviour you care about - the next-state function - and it is genuinely unchanged; a D flip-flop's job is still to store D. The laptop plug is the TARGET flip-flop's inputs, the shape the outside world expects to connect to. The wall socket is the AVAILABLE flip-flop's inputs, the shape you actually have to plug into.",
        "The adapter itself is the COMBINATIONAL glue block. It carries no power of its own and stores nothing; it is a passive remapping of pin shapes, exactly like the glue that only rewires target inputs into available inputs. A cheap adapter (a plain reshaping) is the feed-forward case like JK -> D; nothing but a mechanical remap is needed.",
        "When does the adapter need to be smarter - a powered one that senses something? That is the feedback case. In SR -> T the glue must look at the present state Q to decide S and R, just as a fancy adapter might sense the current voltage to adapt correctly. The extra sensing wire back from the output is the price of a conversion whose equations contain Q.",
        "The lesson the analogy locks in is the same fact the algebra proved: conversion never touches the stored behaviour, only the shape of the connection. Keep the available flip-flop as your reliable power source, add the smallest adapter the K-maps allow, and add a feedback sensing wire only when the equations demand the present state."
      ],
      theoryHI: [
        "जीवन भर के लिए यह तस्वीर रखिए: एक travel power adapter। आप विदेश जाते हैं एक laptop के साथ जिसका plug आपके घर के sockets के आकार का है, पर hotel की दीवार बिलकुल अलग socket देती है। आप न laptop की wiring बदलते हैं न इमारत की - आप बीच में एक छोटा adapter लगाते हैं, और laptop बढ़िया चलता है।",
        "इसे टुकड़ा-टुकड़ा conversion पर बैठाइए। जो electrical POWER बहती है वह वह behaviour है जिसकी आपको परवाह है - next-state function - और यह सचमुच नहीं बदलती; D flip-flop का काम अब भी D store करना है। laptop plug है TARGET flip-flop के inputs, वह आकार जिससे बाहरी दुनिया जुड़ने की उम्मीद करती है। wall socket है AVAILABLE flip-flop के inputs, वह आकार जो असल में आपके पास plug करने को है।",
        "adapter ख़ुद है COMBINATIONAL glue block। यह अपनी कोई power नहीं रखता और कुछ store नहीं करता; यह pin आकारों का एक passive remapping है, ठीक उस glue जैसा जो सिर्फ़ target inputs को available inputs में फिर से wire करता है। एक सस्ता adapter (सादा reshaping) JK -> D जैसा feed-forward case है; एक mechanical remap के सिवा कुछ नहीं चाहिए।",
        "adapter को कब ज़्यादा समझदार होना पड़ता है - एक powered जो कुछ भाँपे? वह feedback case है। SR -> T में glue को S और R तय करने के लिए present state Q देखना पड़ता है, ठीक जैसे एक fancy adapter सही ढलने को मौजूदा voltage भाँप सकता है। output से वापस वह अतिरिक्त sensing तार उस conversion की क़ीमत है जिसके equations में Q है।",
        "analogy जो सबक़ पक्का करती है वही तथ्य है जो algebra ने साबित किया: conversion store किए behaviour को कभी नहीं छूती, सिर्फ़ जोड़ के आकार को। available flip-flop को अपना भरोसेमंद power source रखिए, K-maps जो सबसे छोटा adapter दें वह जोड़िए, और feedback sensing तार सिर्फ़ तब जोड़िए जब equations present state माँगें।"
      ],
      transcriptEN: "Keep this picture for life: a travel power adapter. Your laptop's plug is shaped for home, the hotel wall gives a different socket, so you slot a small adapter between them and the laptop runs perfectly. Map it on: the power flowing through is the behaviour, the next-state function, genuinely unchanged. The laptop plug is the target flip-flop's inputs, the shape the world expects; the wall socket is the available flip-flop's inputs, the shape you have. The adapter is the combinational glue - it stores nothing, it just remaps pin shapes. A cheap reshaping adapter is the feed-forward case, JK to D. When does the adapter need to sense something? The feedback case: SR to T must look at the present state Q to set S and R, like a smart adapter sensing the voltage, and that sensing wire back from the output is the price of equations containing Q. The lesson: conversion never touches the stored behaviour, only the shape of the connection.",
      transcriptHI: "यह तस्वीर जीवन भर रखिए: एक travel power adapter। आपके laptop का plug घर के आकार का है, hotel की दीवार अलग socket देती है, तो आप बीच में छोटा adapter लगाते हैं और laptop बढ़िया चलता है। बैठाइए: जो power बहती है वह behaviour है, next-state function, सचमुच नहीं बदली। laptop plug है target flip-flop के inputs, वह आकार जो दुनिया चाहती है; wall socket है available flip-flop के inputs, वह आकार जो आपके पास है। adapter है combinational glue - यह कुछ store नहीं करता, बस pin आकार remap करता है। सस्ता reshaping adapter feed-forward case है, JK to D। adapter को कब कुछ भाँपना पड़ता है? feedback case: SR to T को S और R तय करने present state Q देखना पड़ता है, जैसे smart adapter voltage भाँपता है, और output से वापस वह sensing तार Q वाले equations की क़ीमत है। सबक़: conversion store किए behaviour को कभी नहीं छूती, सिर्फ़ जोड़ के आकार को।",
      visualNote: "A power-plug adapter SVG: a target plug shape feeding a glue adapter box (showing the chosen pair's equations) into the available socket, with a Q sensing wire that lights only for feedback conversions."
    },
    {
      id: "S08_Build",
      label: "Build JK -> D For Real",
      kind: "theory",
      subtitle: "Open the workbench and wire a JK flip-flop into a D flip-flop.",
      theoryEN: [
        "Stop reading and build the cleanest conversion of all. On the workbench, take a JK flip-flop and turn it into a D flip-flop using the glue you derived: J = D and K = D'. The entire adapter is one wire and one inverter, so it is the perfect first build.",
        "Place a JK flip-flop and a single data input D. Wire D straight to the J input. Then run D through a NOT gate and wire that inverted signal, D', to the K input. There is no feedback and there are no other gates - that is the complete circuit.",
        "Now prove it behaves as a D flip-flop by walking all four cases. With D = 0: J = 0, K = 1, so on the clock the JK resets and Q becomes 0. With D = 1: J = 1, K = 0, so the JK sets and Q becomes 1. In both cases Q(t+1) = D regardless of the old Q, which is exactly the D flip-flop law.",
        "If you want to feel the difference feedback makes, try the SR -> T build next: two AND gates forming S = T·Q' and R = T·Q, with the flip-flop's Q and Q' outputs wired back into those ANDs. Toggle T and clock it - the output flips every tick when T = 1 and holds when T = 0. Open the workbench below and adapt your first flip-flop."
      ],
      theoryHI: [
        "पढ़ना रोकिए और सबसे साफ़ conversion बनाइए। workbench पर, एक JK flip-flop लीजिए और उसे आपके निकाले glue से D flip-flop में बदलिए: J = D और K = D'। पूरा adapter एक तार और एक inverter है, तो यह बेहतरीन पहला build है।",
        "एक JK flip-flop और एक data input D रखिए। D सीधे J input से जोड़िए। फिर D को एक NOT gate से गुज़ारिए और उस inverted signal, D', को K input से जोड़िए। कोई feedback नहीं और कोई और gates नहीं - यही पूरी circuit है।",
        "अब सभी चार cases चलकर साबित कीजिए कि यह D flip-flop जैसा बर्ताव करता है। D = 0 पर: J = 0, K = 1, तो clock पर JK reset होता है और Q 0 बनता है। D = 1 पर: J = 1, K = 0, तो JK set होता है और Q 1 बनता है। दोनों cases में Q(t+1) = D पुराने Q की परवाह किए बिना, जो ठीक D flip-flop का नियम है।",
        "अगर feedback का फ़र्क़ महसूस करना हो, अगला SR -> T build आज़माइए: दो AND gates जो S = T·Q' और R = T·Q बनाते हैं, flip-flop के Q और Q' outputs उन ANDs में वापस wired। T toggle कीजिए और clock कीजिए - T = 1 पर output हर tick पलटता है और T = 0 पर hold करता है। नीचे workbench खोलिए और अपना पहला flip-flop adapt कीजिए।"
      ],
      transcriptEN: "Stop reading and build the cleanest conversion. On the workbench, turn a JK flip-flop into a D flip-flop with the glue you derived: J equals D, K equals D-not. The whole adapter is one wire and one inverter. Place a JK and a data input D. Wire D straight to J, then run D through a NOT gate and wire that D-not to K. No feedback, no other gates. Prove it: D zero gives J zero K one, so the JK resets and Q becomes zero; D one gives J one K zero, so it sets and Q becomes one - Q-next equals D regardless of the old Q, the D flip-flop law. To feel feedback, try SR to T next: two AND gates for S equals T Q-not and R equals T Q, with Q and Q-not fed back; toggle T and clock it, and the output flips every tick when T is one. Open the workbench and adapt your first flip-flop.",
      transcriptHI: "पढ़ना रोकिए और सबसे साफ़ conversion बनाइए। workbench पर, एक JK flip-flop को आपके निकाले glue से D flip-flop में बदलिए: J बराबर D, K बराबर D-not। पूरा adapter एक तार और एक inverter है। एक JK और data input D रखिए। D सीधे J से, फिर D को NOT gate से गुज़ारकर वह D-not K से जोड़िए। कोई feedback नहीं, कोई और gates नहीं। साबित कीजिए: D zero देता है J zero K one, तो JK reset होकर Q zero; D one देता है J one K zero, तो set होकर Q one - Q-next बराबर D पुराने Q की परवाह किए बिना, D flip-flop का नियम। feedback महसूस करने को, अगला SR to T आज़माइए: दो AND gates S बराबर T Q-not और R बराबर T Q के लिए, Q और Q-not feedback; T toggle और clock कीजिए, T one पर output हर tick पलटता है। workbench खोलिए और अपना पहला flip-flop adapt कीजिए।",
      visualNote: "WorkbenchCTA opening /workbench?tutorial=jk-to-d, plus the reminder that the whole adapter is D straight to J and D through one NOT to K."
    },
    {
      id: "S09_Flashcards",
      label: "Flashcards",
      kind: "flashcards",
      subtitle: "Eight flip-cards to lock in the model, the 4 steps, and the two worked conversions.",
      theoryEN: [
        "These eight flip-cards drill the facts that matter most: what a conversion is, the fixed model, the 4-step method, which table is the blueprint, when feedback is required, and the two worked glue results JK -> D and SR -> T. Cover the back, say the answer aloud, then flip to check.",
        "Give extra reps to the two glue-equation cards - J = D, K = D' and S = T·Q', R = T·Q - and to the feedback rule, because those are exactly what examiners ask you to derive and justify.",
        "If you keep only one idea, keep this: conversion never changes the flip-flop, only wraps it in combinational glue built from the available flip-flop's excitation table - and feedback appears exactly when the glue equations contain Q."
      ],
      theoryHI: [
        "ये आठ flip-cards सबसे ज़रूरी तथ्य रटाते हैं: conversion क्या है, तय model, 4-step method, कौन सी table blueprint है, feedback कब चाहिए, और दो worked glue नतीजे JK -> D और SR -> T। पीछे ढककर जवाब ज़ोर से बोलिए, फिर जाँचने को पलटिए।",
        "दो glue-equation cards - J = D, K = D' और S = T·Q', R = T·Q - और feedback नियम को ज़्यादा दोहराइए, क्योंकि examiner ठीक इन्हें derive और justify करवाते हैं।",
        "अगर सिर्फ़ एक विचार रखें, तो यह: conversion flip-flop को कभी नहीं बदलती, बस उसे available flip-flop की excitation table से बने combinational glue में लपेटती है - और feedback ठीक तब आता है जब glue equations में Q हो।"
      ],
      transcriptEN: "Eight quick flip-cards to set it solid. Front asks, back answers - cover the back, say it aloud, then flip. Give extra reps to the two glue-equation cards, J equals D with K equals D-not, and S equals T Q-not with R equals T Q, and to the feedback rule. Keep one idea: conversion never changes the flip-flop, it wraps it in combinational glue built from the available flip-flop's excitation table, and feedback appears exactly when the glue equations contain Q.",
      transcriptHI: "इसे पक्का करने को आठ तेज़ flip-cards। आगे सवाल, पीछे जवाब - पीछे ढककर ज़ोर से बोलिए, फिर पलटिए। दो glue-equation cards, J बराबर D और K बराबर D-not, और S बराबर T Q-not और R बराबर T Q, तथा feedback नियम को ज़्यादा दोहराइए। एक विचार रखिए: conversion flip-flop को कभी नहीं बदलती, इसे available flip-flop की excitation table से बने combinational glue में लपेटती है, और feedback ठीक तब आता है जब glue equations में Q हो।",
      visualNote: "Standard bilingual flip deck, eight cards."
    },
    {
      id: "S10_Quiz",
      label: "Quiz Arena",
      kind: "quiz",
      subtitle: "Seven questions - prove you can convert any flip-flop into any other.",
      theoryEN: [
        "Seven multiple-choice questions now check that the adapter idea has really sunk in. They probe the JK -> D glue, the SR -> T glue and its feedback, which conversion needs no feedback, what step 2 of the method produces, the D -> T single equation, why JK and SR give simpler glue, and what feeds the combinational block in the model.",
        "Several are derivation questions, not recall: you will read a glue equation off a required-input column and decide whether a conversion needs feedback. Work them by writing the target's next state, reading the available flip-flop's excitation entry, and checking whether Q appears.",
        "Aim for full marks, because clearing all seven means you can adapt any flip-flop into any other - the reusable skill behind counters, registers and every FSM you will build next."
      ],
      theoryHI: [
        "सात bahu-vikalp सवाल अब जाँचते हैं कि adapter विचार सचमुच बैठा या नहीं। ये पूछते हैं JK -> D glue, SR -> T glue और उसका feedback, कौन सी conversion को feedback नहीं चाहिए, method का step 2 क्या बनाता है, D -> T single equation, JK और SR सरल glue क्यों देते हैं, और model में combinational block को क्या feed करता है।",
        "कई derivation सवाल हैं, याद नहीं: आप एक required-input column से glue equation पढ़ेंगे और तय करेंगे कि किसी conversion को feedback चाहिए या नहीं। इन्हें target का next state लिखकर, available flip-flop की excitation entry पढ़कर, और जाँचकर कि Q आता है या नहीं, कीजिए।",
        "पूरे अंक का लक्ष्य रखिए, क्योंकि सातों साफ़ करना मतलब आप किसी भी flip-flop को किसी और में ढाल सकते हैं - वही दोबारा-वापरने-योग्य कौशल जो counters, registers और हर FSM के पीछे है जो आप अगला बनाएँगे।"
      ],
      transcriptEN: "Seven questions in the arena. They check the JK to D glue, the SR to T glue and its feedback, which conversion needs no feedback, what step two produces, the D to T single equation, why JK and SR give simpler glue, and what feeds the combinational block. Several are derivation, not recall: read a glue equation off a required-input column and decide whether feedback is needed by checking whether Q appears. Clear all seven and you can adapt any flip-flop into any other.",
      transcriptHI: "Arena में सात सवाल। ये जाँचते हैं JK to D glue, SR to T glue और उसका feedback, कौन सी conversion को feedback नहीं चाहिए, step दो क्या बनाता है, D to T single equation, JK और SR सरल glue क्यों देते हैं, और combinational block को क्या feed करता है। कई derivation हैं, याद नहीं: required-input column से glue equation पढ़िए और जाँचकर कि Q आता है या नहीं तय कीजिए कि feedback चाहिए। सातों साफ़ कीजिए और आप किसी भी flip-flop को किसी और में ढाल सकते हैं।",
      visualNote: "Parameterized QuizArena with the seven spec questions."
    },
    {
      id: "S11_Recap",
      label: "Recap & The Big Picture",
      kind: "recap",
      subtitle: "You can now adapt any flip-flop into any other - the last piece before counters and FSMs.",
      theoryEN: [
        "Let us bank the whole thing. Flip-flop conversion adapts the flip-flop you HAVE into the behaviour you NEED by inserting a combinational glue block: target inputs, plus the present state Q when required, flow into the glue, which drives the available flip-flop's inputs, and the pair reproduces the target's next-state function exactly. The flip-flop stays the memory; the glue only translates.",
        "The 4-step method is the fixed recipe: identify the target and available flip-flops with their equations; build the master conversion table (target truth table + the available flip-flop's excitation entries); minimise each required-input column with a K-map, exploiting JK/SR don't-cares; and realise the glue, adding a feedback wire only when an equation contains Q.",
        "The two worked results are the ones to carry. JK -> D gives J = D, K = D' - one inverter, no feedback, verifiable as J·Q' + K'·Q = D. SR -> T gives S = T·Q', R = T·Q - two AND gates with the output fed back, toggling exactly like a T flip-flop and never hitting the SR forbidden state. The universal matrix collects every other pair the same way.",
        "Step back and see where this sits. Flip-flops (module 30) gave you edge-triggered memory; representations (module 32) gave you the characteristic and excitation tables; conversion is the synthesis skill that lets you build the flip-flop a design assumes out of the flip-flop you were handed. It is the exact same excitation-table reasoning you will now scale up.",
        "That scaling up is the whole rest of the track: counters and registers are just many flip-flops wired so their next states step through a sequence, and finite-state machines generalise that to arbitrary state graphs - all synthesised by writing required transitions and reading each flip-flop's excitation table, precisely the move you just mastered on a single cell."
      ],
      theoryHI: [
        "चलिए पूरी बात जमा कर लें। Flip-flop conversion आपके पास मौजूद flip-flop को ज़रूरी behaviour में ढालती है एक combinational glue block डालकर: target inputs, और ज़रूरत पर present state Q, glue में बहते हैं, जो available flip-flop के inputs चलाता है, और जोड़ी target का next-state function ठीक-ठीक दोहराती है। flip-flop memory बना रहता है; glue सिर्फ़ अनुवाद करता है।",
        "4-step method तय नुस्ख़ा है: target और available flip-flops को उनके equations के साथ identify कीजिए; master conversion table बनाइए (target truth table + available flip-flop की excitation entries); हर required-input column को K-map से minimise कीजिए, JK/SR don't-cares का फ़ायदा उठाते हुए; और glue realise कीजिए, feedback तार सिर्फ़ तब जोड़ते हुए जब कोई equation Q रखे।",
        "दो worked नतीजे साथ ले जाने लायक़ हैं। JK -> D देता है J = D, K = D' - एक inverter, कोई feedback नहीं, J·Q' + K'·Q = D से verify होने योग्य। SR -> T देता है S = T·Q', R = T·Q - दो AND gates output feedback के साथ, बिलकुल T flip-flop जैसा toggle करते और SR की forbidden state कभी न छूते। universal matrix हर दूसरी जोड़ी को वैसे ही समेटती है।",
        "पीछे हटकर देखिए यह कहाँ बैठता है। Flip-flops (module 30) ने edge-triggered memory दी; representations (module 32) ने characteristic और excitation tables दीं; conversion वह synthesis कौशल है जो आपको वह flip-flop बनाने देता है जो design मानकर चलता है, उस flip-flop से जो आपको थमाया गया। यह ठीक वही excitation-table तर्क है जिसे आप अब बड़ा करेंगे।",
        "वही बड़ा करना पूरे बाक़ी track है: counters और registers बस कई flip-flops हैं ऐसे wired कि उनके next states एक sequence में क़दम रखें, और finite-state machines इसे किसी भी state graph तक सामान्य कर देती हैं - सब ज़रूरी transitions लिखकर और हर flip-flop की excitation table पढ़कर synthesise, ठीक वही चाल जो आपने अभी एक cell पर सीखी।"
      ],
      transcriptEN: "Let's bank the whole thing. Flip-flop conversion adapts the flip-flop you have into the behaviour you need with a combinational glue block: target inputs, plus present state Q when required, drive the available flip-flop's inputs, and the pair reproduces the target's next state exactly. The four-step method: identify target and available with their equations; build the master conversion table, the target truth table plus the available flip-flop's excitation entries; minimise each input column with a K-map using JK and SR don't-cares; realise the glue, adding feedback only when an equation contains Q. The two results to carry: JK to D gives J equals D, K equals D-not, one inverter, no feedback; SR to T gives S equals T Q-not, R equals T Q, two ANDs with feedback, toggling like a T. The universal matrix collects the rest. Where does this sit? Flip-flops gave edge-triggered memory, representations gave the tables, conversion is the synthesis skill - and counters, registers and finite-state machines are just that same excitation-table reasoning scaled to many cells.",
      transcriptHI: "चलिए पूरी बात जमा कर लें। Flip-flop conversion आपके पास मौजूद flip-flop को ज़रूरी behaviour में एक combinational glue block से ढालती है: target inputs, और ज़रूरत पर present state Q, available flip-flop के inputs चलाते हैं, और जोड़ी target का next state ठीक दोहराती है। 4-step method: target और available को उनके equations के साथ identify कीजिए; master conversion table बनाइए, target truth table और available flip-flop की excitation entries; हर input column को JK और SR don't-cares से K-map से minimise कीजिए; glue realise कीजिए, feedback सिर्फ़ तब जब equation में Q हो। दो नतीजे: JK to D देता है J बराबर D, K बराबर D-not, एक inverter, कोई feedback नहीं; SR to T देता है S बराबर T Q-not, R बराबर T Q, दो ANDs feedback के साथ, T जैसा toggle। universal matrix बाक़ी समेटती है। यह कहाँ बैठता है? Flip-flops ने edge-triggered memory दी, representations ने tables दीं, conversion synthesis कौशल है - और counters, registers तथा finite-state machines बस वही excitation-table तर्क कई cells तक बड़ा किया हुआ हैं।",
      visualNote: "Recap card: the conversion model and the two worked glue results on the left, the 4-step pipeline and the feedback rule on the right; a track ribbon Flip-Flops -> Representations -> Conversions -> Counters -> FSMs."
    }
  ],
  flashcards: [
    {
      frontEN: "What is flip-flop conversion?",
      backEN: "Keeping the flip-flop you HAVE (the available FF) as the memory and adding a combinational GLUE block in front so it behaves like the flip-flop you NEED (the target). The FF is unchanged; the glue only remaps inputs.",
      frontHI: "Flip-flop conversion क्या है?",
      backHI: "जो flip-flop आपके पास है (available FF) उसे memory रखना और आगे एक combinational GLUE block जोड़ना ताकि यह उस flip-flop जैसा बर्ताव करे जो आपको चाहिए (target)। FF वैसा ही; glue सिर्फ़ inputs remap करता है।"
    },
    {
      frontEN: "State the conversion model (signal path).",
      backEN: "Target inputs (+ present state Q fed back when needed) -> combinational glue block -> available FF inputs -> available FF -> Q. As a black box it shows the target's inputs and reproduces the target's next state.",
      frontHI: "Conversion model (signal path) बताइए।",
      backHI: "Target inputs (+ ज़रूरत पर feedback किया present state Q) -> combinational glue block -> available FF inputs -> available FF -> Q। black box के रूप में यह target के inputs दिखाता है और target का next state दोहराता है।"
    },
    {
      frontEN: "List the 4-step conversion method.",
      backEN: "1) Identify target + available FF and their equations. 2) Build the master conversion table = target truth table + the available FF's excitation entries. 3) Minimise each required-input column with K-maps. 4) Realise the glue circuit (add feedback only if an equation contains Q).",
      frontHI: "4-step conversion method गिनाइए।",
      backHI: "1) target + available FF और उनके equations identify कीजिए। 2) master conversion table बनाइए = target truth table + available FF की excitation entries। 3) हर required-input column K-maps से minimise कीजिए। 4) glue circuit realise कीजिए (feedback सिर्फ़ तब जब equation में Q हो)।"
    },
    {
      frontEN: "Which table is the blueprint for conversion, and why do JK/SR help?",
      backEN: "The AVAILABLE flip-flop's excitation table (required inputs for each Q -> Q(t+1) transition). JK and SR excitation tables are full of don't-cares (x), which give free choices on the K-map and collapse the glue equations.",
      frontHI: "Conversion का blueprint कौन सी table है, और JK/SR क्यों मदद करते हैं?",
      backHI: "AVAILABLE flip-flop की excitation table (हर Q -> Q(t+1) transition के लिए ज़रूरी inputs)। JK और SR excitation tables don't-cares (x) से भरी हैं, जो K-map पर मुफ़्त चुनाव देकर glue equations सिकोड़ देते हैं।"
    },
    {
      frontEN: "Give the JK -> D glue and say if feedback is needed.",
      backEN: "J = D and K = D'. No feedback: neither equation contains Q, so the glue is purely feed-forward (one wire + one inverter). Check: J·Q' + K'·Q = D·Q' + D·Q = D.",
      frontHI: "JK -> D glue दीजिए और बताइए feedback चाहिए या नहीं।",
      backHI: "J = D और K = D'। कोई feedback नहीं: किसी equation में Q नहीं, तो glue शुद्ध feed-forward (एक तार + एक inverter)। जाँच: J·Q' + K'·Q = D·Q' + D·Q = D।"
    },
    {
      frontEN: "Give the SR -> T glue and say if feedback is needed.",
      backEN: "S = T·Q' and R = T·Q. Feedback IS required: both equations contain Q, so the flip-flop's Q and Q' outputs must be fed back into the two AND gates. S and R are never both 1, so the forbidden state is safe.",
      frontHI: "SR -> T glue दीजिए और बताइए feedback चाहिए या नहीं।",
      backHI: "S = T·Q' और R = T·Q। feedback चाहिए ही: दोनों equations में Q है, तो flip-flop के Q और Q' outputs को दोनों AND gates में feedback करना पड़ता है। S और R कभी दोनों 1 नहीं, तो forbidden state सुरक्षित।"
    },
    {
      frontEN: "When exactly does a conversion need a feedback wire?",
      backEN: "Exactly when a minimised glue equation contains Q or Q'. Feed-forward examples: JK -> D, and JK -> T (J = K = T). Feedback examples: SR -> T, D -> T (D = T ⊕ Q), JK -> SR, D -> JK, D -> SR.",
      frontHI: "किसी conversion को feedback तार ठीक कब चाहिए?",
      backHI: "ठीक तब जब कोई minimised glue equation Q या Q' रखे। Feed-forward उदाहरण: JK -> D, और JK -> T (J = K = T)। Feedback उदाहरण: SR -> T, D -> T (D = T ⊕ Q), JK -> SR, D -> JK, D -> SR।"
    },
    {
      frontEN: "Recall four key cells of the universal conversion matrix.",
      backEN: "T from D: D = T ⊕ Q. JK from D: D = J·Q' + K'·Q. SR from D: D = S + R'·Q. JK -> T: J = K = T. (And the two worked ones: JK -> D gives J = D, K = D'; SR -> T gives S = T·Q', R = T·Q.)",
      frontHI: "Universal conversion matrix के चार अहम cells याद कीजिए।",
      backHI: "T from D: D = T ⊕ Q। JK from D: D = J·Q' + K'·Q। SR from D: D = S + R'·Q। JK -> T: J = K = T। (और दो worked: JK -> D देता है J = D, K = D'; SR -> T देता है S = T·Q', R = T·Q।)"
    }
  ],
  quiz: [
    {
      questionEN: "To make a JK flip-flop behave as a D flip-flop, what glue do you wire?",
      options: [
        "J = D, K = D",
        "J = D, K = D'",
        "J = D', K = D",
        "J = D·Q, K = D'·Q'"
      ],
      answerIndex: 1,
      explainEN: "From the master table, J = D and K = D'. Check: J·Q' + K'·Q = D·Q' + D·Q = D. No feedback is needed.",
      explainHI: "master table से, J = D और K = D'। जाँच: J·Q' + K'·Q = D·Q' + D·Q = D। कोई feedback नहीं चाहिए।",
      questionHI: "एक JK flip-flop को D flip-flop जैसा बनाने के लिए कौन सा glue wire करते हैं?"
    },
    {
      questionEN: "To make an SR flip-flop behave as a T flip-flop, what glue is required?",
      options: [
        "S = T, R = T' (no feedback)",
        "S = T·Q, R = T·Q' (no feedback)",
        "S = T·Q', R = T·Q (Q fed back)",
        "S = T ⊕ Q, R = T ⊕ Q (Q fed back)"
      ],
      answerIndex: 2,
      explainEN: "S = T·Q' and R = T·Q. Both contain Q, so the flip-flop's Q and Q' must be fed back into the two AND gates.",
      explainHI: "S = T·Q' और R = T·Q। दोनों में Q है, तो flip-flop के Q और Q' को दोनों AND gates में feedback करना पड़ता है।",
      questionHI: "एक SR flip-flop को T flip-flop जैसा बनाने के लिए कौन सा glue चाहिए?"
    },
    {
      questionEN: "Which of these conversions needs NO feedback wire from the output?",
      options: [
        "SR -> T",
        "D -> T",
        "JK -> D",
        "D -> JK"
      ],
      answerIndex: 2,
      explainEN: "JK -> D gives J = D, K = D' - neither equation contains Q, so the glue is purely feed-forward. The others all have Q in their equations.",
      explainHI: "JK -> D देता है J = D, K = D' - किसी equation में Q नहीं, तो glue शुद्ध feed-forward है। बाक़ी सबके equations में Q है।",
      questionHI: "इनमें से किस conversion को output से कोई feedback तार नहीं चाहिए?"
    },
    {
      questionEN: "Step 2 of the conversion method produces which table?",
      options: [
        "The master conversion table: target truth table + the available FF's required (excitation) inputs per row",
        "The available FF's characteristic table only",
        "A state diagram of the target",
        "The K-map of the final circuit"
      ],
      answerIndex: 0,
      explainEN: "Step 2 lists the target's inputs and Q, computes each desired Q(t+1), then reads the available FF's excitation table for the inputs required - the master conversion table.",
      explainHI: "Step 2 target के inputs और Q list करता है, हर चाहा गया Q(t+1) निकालता है, फिर available FF की excitation table से ज़रूरी inputs पढ़ता है - master conversion table।",
      questionHI: "Conversion method का step 2 कौन सी table बनाता है?"
    },
    {
      questionEN: "To convert an available D flip-flop into a T flip-flop, what single equation do you wire to D?",
      options: [
        "D = T",
        "D = T·Q",
        "D = T ⊕ Q",
        "D = T + Q"
      ],
      answerIndex: 2,
      explainEN: "A T flip-flop's next state is Q(t+1) = T ⊕ Q, and a D flip-flop copies its input, so setting D = T ⊕ Q makes it toggle. Q is fed back.",
      explainHI: "T flip-flop का next state Q(t+1) = T ⊕ Q है, और D flip-flop अपना input copy करता है, तो D = T ⊕ Q रखने से यह toggle करता है। Q feedback होता है।",
      questionHI: "एक available D flip-flop को T flip-flop में बदलने के लिए D पर कौन सा एक equation wire करते हैं?"
    },
    {
      questionEN: "Why do JK and SR available flip-flops usually give the simplest glue?",
      options: [
        "They have more inputs, so more wires",
        "Their excitation tables contain don't-cares (x) that simplify the K-maps",
        "They have no forbidden states",
        "They are always edge-triggered"
      ],
      answerIndex: 1,
      explainEN: "Every don't-care in the JK/SR excitation table is a free 0-or-1 choice on the Karnaugh map, letting the glue equations collapse (e.g. JK -> D all the way to J = D, K = D').",
      explainHI: "JK/SR excitation table का हर don't-care Karnaugh map पर एक मुफ़्त 0-या-1 चुनाव है, जो glue equations सिकोड़ देता है (जैसे JK -> D पूरा J = D, K = D' तक)।",
      questionHI: "JK और SR available flip-flops आमतौर पर सबसे सरल glue क्यों देते हैं?"
    },
    {
      questionEN: "In the conversion model, what enters the combinational glue block?",
      options: [
        "Only the clock signal",
        "The target flip-flop's external inputs, plus the present state Q when the equations require it",
        "The available flip-flop's outputs only",
        "The power supply and reset"
      ],
      answerIndex: 1,
      explainEN: "The glue is fed the target's external inputs and, when a glue equation contains Q, the present state fed back from the flip-flop's output; it drives the available FF's inputs.",
      explainHI: "glue को target के external inputs दिए जाते हैं और, जब कोई glue equation Q रखता है, flip-flop के output से feedback किया present state; यह available FF के inputs चलाता है।",
      questionHI: "Conversion model में combinational glue block में क्या घुसता है?"
    }
  ]
};
