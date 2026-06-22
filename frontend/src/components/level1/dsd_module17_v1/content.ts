import type { SubContent } from '../_subtractor/kit';

export const CONTENT = ({
  "moduleTitle": "The Full Subtractor",
  "moduleSubtitle": "The Digital Ledger - Wallet, Bill & Debt",
  "scenes": [
    {
      "id": "S00_Cover",
      "label": "The Full Subtractor",
      "kind": "cover",
      "subtitle": "The Digital Ledger - Wallet, Bill & Debt",
      "theoryEN": [
        "Welcome to THE DIGITAL LEDGER: subtraction told as personal finance.",
        "Every binary subtraction column is a transaction: what you have, what you owe now, and what you already owed.",
        "The full subtractor is the circuit that keeps your ledger honest across many columns."
      ],
      "theoryHI": [
        "THE DIGITAL LEDGER में आपका स्वागत है: subtraction को personal finance की तरह समझेंगे।",
        "हर binary subtraction column एक transaction है: आपके पास क्या है, अभी क्या चुकाना है, और पहले से क्या उधार था।",
        "Full subtractor वह circuit है जो कई columns तक आपका ledger सही रखता है।"
      ],
      "transcriptEN": "Imagine your money lives in binary columns. In each column you have a balance, a bill arrives, and an old debt may be hanging over from before. The full subtractor reads all three and tells you exactly what is left and whether you slipped into overdraft. Let's open the ledger.",
      "transcriptHI": "मान लीजिए आपका पैसा binary columns में रहता है। हर column में आपके पास एक balance है, एक bill आता है, और पहले से कोई पुराना debt भी लटका हो सकता है। Full subtractor तीनों को पढ़ता है और बताता है कि कितना बचा और क्या आप overdraft में चले गए। चलिए ledger खोलते हैं।"
    },
    {
      "id": "S01_Video",
      "label": "Watch: Full Subtractor",
      "kind": "video",
      "subtitle": "The Digital Ledger in motion",
      "theoryEN": [
        "Watch how a single subtraction column turns into a money transaction.",
        "Notice the three inputs (balance, bill, old debt) and two outputs (remaining coins, new overdraft).",
        "Keep the ledger idea in mind - every gate we build later maps back to it."
      ],
      "theoryHI": [
        "देखिए कि एक subtraction column कैसे एक money transaction बन जाता है।",
        "तीन inputs (balance, bill, पुराना debt) और दो outputs (बचे coins, नया overdraft) पर ध्यान दें।",
        "Ledger वाला idea याद रखिए - आगे बनने वाला हर gate इसी से जुड़ा होगा।"
      ],
      "transcriptEN": "This short film walks through one ledger column from start to finish. You'll see money come in, a bill go out, an old debt pull on the balance, and the circuit settle the account. Watch first, then we'll dissect every wire.",
      "transcriptHI": "यह छोटी video एक ledger column को शुरू से अंत तक दिखाती है। आप देखेंगे पैसा आता है, bill जाता है, पुराना debt balance को खींचता है, और circuit account settle करता है। पहले देखिए, फिर हम हर wire को खोलकर समझेंगे।"
    },
    {
      "id": "S02_Variables",
      "label": "The Three Inputs",
      "kind": "theory",
      "subtitle": "Wallet, Bill, and Old Debt",
      "theoryEN": [
        "x = Minuend = Wallet Balance: the money you currently have in this column.",
        "y = Subtrahend = Current Bill: the money being requested from you right now.",
        "z = Bin (Borrow-in) = Existing Debt: memory of a borrow that happened in the previous column.",
        "All three are single bits: 0 means 'nothing here', 1 means 'one unit present'.",
        "The full subtractor's whole job is x minus y minus z, one column at a time."
      ],
      "theoryHI": [
        "x = Minuend = Wallet Balance: इस column में अभी आपके पास जितना पैसा है।",
        "y = Subtrahend = Current Bill: अभी आपसे जितना पैसा माँगा जा रहा है।",
        "z = Bin (Borrow-in) = Existing Debt: पिछले column में हुए borrow की memory।",
        "तीनों single bits हैं: 0 का मतलब 'यहाँ कुछ नहीं', 1 का मतलब 'एक unit मौजूद है'।",
        "Full subtractor का पूरा काम है x minus y minus z, एक बार में एक column।"
      ],
      "transcriptEN": "Three things land in every column. x is your wallet balance - what you actually have. y is the current bill - what someone wants from you now. z is the borrow-in - an old debt carried from the column to your right. Hold these three names tight, because the entire ledger is built on them.",
      "transcriptHI": "हर column में तीन चीज़ें आती हैं। x आपका wallet balance है - जो आपके पास सच में है। y current bill है - जो अभी कोई आपसे माँग रहा है। z borrow-in है - दाईं ओर के column से आया पुराना debt। इन तीन नामों को मज़बूती से पकड़िए, क्योंकि पूरा ledger इन्हीं पर खड़ा है।"
    },
    {
      "id": "S03_HalfVsFull",
      "label": "Half vs Full",
      "kind": "theory",
      "subtitle": "Amnesia vs Continuous Memory",
      "theoryEN": [
        "The half subtractor is amnesic: it sees only two inputs, x and y, and forgets the past entirely.",
        "It cannot accept a borrow-in, so it can only ever subtract one standalone column.",
        "The full subtractor is continuous: it adds the third input z (borrow-in) to remember past debt.",
        "With three inputs it can be cascaded - column after column - to subtract full multi-bit numbers.",
        "Upgrade in one line: half subtractor = single transaction; full subtractor = a running account."
      ],
      "theoryHI": [
        "Half subtractor amnesic है: यह सिर्फ़ दो inputs x और y देखता है, और past को पूरी तरह भूल जाता है।",
        "यह borrow-in नहीं ले सकता, इसलिए सिर्फ़ एक अकेला column ही subtract कर पाता है।",
        "Full subtractor continuous है: यह तीसरा input z (borrow-in) जोड़ता है ताकि पुराना debt याद रहे।",
        "तीन inputs के साथ इसे cascade किया जा सकता है - column दर column - पूरे multi-bit numbers subtract करने के लिए।",
        "एक लाइन में upgrade: half subtractor = एक transaction; full subtractor = एक चलता हुआ account।"
      ],
      "transcriptEN": "The half subtractor is like a shopkeeper with no memory: each sale is brand new, the past doesn't exist. That's fine for one column, but real numbers have many columns. The full subtractor adds a third wire, the borrow-in, so it remembers the debt from the previous column. Now you can chain them and subtract numbers of any size - a continuous running account instead of an amnesic one.",
      "transcriptHI": "Half subtractor उस दुकानदार जैसा है जिसकी कोई memory नहीं: हर sale बिल्कुल नई है, past का कोई वजूद नहीं। एक column के लिए ठीक है, पर असली numbers में कई columns होते हैं। Full subtractor एक तीसरा wire जोड़ता है, borrow-in, ताकि पिछले column का debt याद रहे। अब आप इन्हें chain करके किसी भी size के numbers subtract कर सकते हैं - amnesic के बजाय एक continuous चलता account।"
    },
    {
      "id": "S04_Processing",
      "label": "The Two Outputs",
      "kind": "theory",
      "subtitle": "Loose Coins and Overdraft",
      "theoryEN": [
        "Output D = Difference = 'loose coins': the funds remaining in this column after the bill and old debt are settled.",
        "Output Bout = Borrow-out = 'overdraft': new debt you must carry to the next column on the left.",
        "If you had enough money, D shows what is left and Bout stays 0 (no overdraft).",
        "If you fell short, you borrow one unit from the next column: Bout becomes 1.",
        "Read it as a sentence: 'After paying, I have D coins left, and I owe Bout to next month.'"
      ],
      "theoryHI": [
        "Output D = Difference = 'loose coins': bill और पुराना debt चुकाने के बाद इस column में बचा हुआ पैसा।",
        "Output Bout = Borrow-out = 'overdraft': नया debt जो आपको बाईं ओर के अगले column तक ले जाना है।",
        "अगर पैसा काफ़ी था, D बताता है कितना बचा और Bout 0 रहता है (कोई overdraft नहीं)।",
        "अगर कम पड़ गया, आप अगले column से एक unit उधार लेते हैं: Bout 1 हो जाता है।",
        "इसे वाक्य की तरह पढ़िए: 'चुकाने के बाद मेरे पास D coins बचे, और मुझ पर अगले महीने Bout का उधार है।'"
      ],
      "transcriptEN": "Two answers come out of every column. D, the difference, is your loose change - the coins still in your hand after settling the bill and the old debt. Bout, the borrow-out, is your overdraft - if the column couldn't cover what was owed, you borrow one unit from the next column and Bout flips to 1. Difference is what you keep; borrow-out is what you owe forward.",
      "transcriptHI": "हर column से दो जवाब निकलते हैं। D, यानी difference, आपका loose change है - bill और पुराना debt चुकाने के बाद हाथ में बचे coins। Bout, यानी borrow-out, आपका overdraft है - अगर column उधार को cover नहीं कर पाया, तो आप अगले column से एक unit उधार लेते हैं और Bout 1 हो जाता है। Difference वह है जो आप रखते हैं; borrow-out वह है जो आप आगे चुकाते हैं।"
    },
    {
      "id": "S05_TransactionLog",
      "label": "The Transaction Log",
      "kind": "truth",
      "subtitle": "No-Debt states vs Overdraft states",
      "theoryEN": [
        "Read every row of the ledger as a story split into two camps: No-Debt (Bout=0) and Overdraft (Bout=1).",
        "Wallet empty but a bill or debt exists (e.g. x=0, y=1 or z=1) -> you can't pay -> Overdraft, Bout=1.",
        "Wallet has 1 but must pay BOTH bill and old debt (x=1, y=1, z=1) -> exhausted and still short -> Overdraft, Bout=1.",
        "Wallet has 1 and only one small claim comes (e.g. x=1, y=1, z=0) -> you cover it exactly -> No-Debt, Bout=0.",
        "Quiet column (x=0, y=0, z=0) -> nothing happens -> No-Debt, D=0, Bout=0."
      ],
      "theoryHI": [
        "ledger की हर row को एक कहानी की तरह पढ़िए, दो खेमों में बँटी: No-Debt (Bout=0) और Overdraft (Bout=1)।",
        "Wallet खाली पर bill या debt मौजूद (जैसे x=0, y=1 या z=1) -> आप चुका नहीं सकते -> Overdraft, Bout=1।",
        "Wallet में 1 पर bill और पुराना debt दोनों चुकाने हैं (x=1, y=1, z=1) -> सब ख़त्म पर फिर भी कम -> Overdraft, Bout=1।",
        "Wallet में 1 और सिर्फ़ एक छोटा claim आया (जैसे x=1, y=1, z=0) -> आप बिल्कुल पूरा कर देते हैं -> No-Debt, Bout=0।",
        "शांत column (x=0, y=0, z=0) -> कुछ नहीं होता -> No-Debt, D=0, Bout=0।"
      ],
      "transcriptEN": "Think of the ledger as a transaction log. Some rows are calm - No-Debt - where your wallet covers everything and Bout stays zero. Other rows are stressful - Overdraft - where the wallet is empty but a bill or an old debt still demands payment, or where your single unit must cover both a bill and a debt at once. In every stressful row you borrow from the next column and Bout rises to one. Same circuit, eight little stories.",
      "transcriptHI": "ledger को एक transaction log की तरह सोचिए। कुछ rows शांत हैं - No-Debt - जहाँ wallet सब कुछ cover कर लेता है और Bout zero रहता है। कुछ rows तनावपूर्ण हैं - Overdraft - जहाँ wallet खाली है पर bill या पुराना debt फिर भी payment माँगता है, या जहाँ आपके एक unit को एक साथ bill और debt दोनों चुकाने पड़ते हैं। हर तनावपूर्ण row में आप अगले column से उधार लेते हैं और Bout एक हो जाता है। एक ही circuit, आठ छोटी कहानियाँ।"
    },
    {
      "id": "S06_TruthTable",
      "label": "Truth Table",
      "kind": "truth",
      "subtitle": "All 8 ledger entries (x,y,z -> D,Bout)",
      "theoryEN": [
        "x=0,y=0,z=0 -> D=0, Bout=0  (quiet column, No-Debt).",
        "x=0,y=0,z=1 -> D=1, Bout=1  (empty wallet must pay old debt -> Overdraft).",
        "x=0,y=1,z=0 -> D=1, Bout=1  (empty wallet faces a bill -> Overdraft).",
        "x=0,y=1,z=1 -> D=0, Bout=1  (empty wallet, bill and debt both -> Overdraft).",
        "x=1,y=0,z=0 -> D=1, Bout=0  (money in, nothing owed -> No-Debt).",
        "x=1,y=0,z=1 -> D=0, Bout=0  (one unit pays one old debt exactly -> No-Debt).",
        "x=1,y=1,z=0 -> D=0, Bout=0  (one unit pays one bill exactly -> No-Debt).",
        "x=1,y=1,z=1 -> D=1, Bout=1  (one unit can't cover bill+debt -> exhausted, Overdraft)."
      ],
      "theoryHI": [
        "x=0,y=0,z=0 -> D=0, Bout=0  (शांत column, No-Debt)।",
        "x=0,y=0,z=1 -> D=1, Bout=1  (खाली wallet को पुराना debt चुकाना है -> Overdraft)।",
        "x=0,y=1,z=0 -> D=1, Bout=1  (खाली wallet के सामने bill -> Overdraft)।",
        "x=0,y=1,z=1 -> D=0, Bout=1  (खाली wallet, bill और debt दोनों -> Overdraft)।",
        "x=1,y=0,z=0 -> D=1, Bout=0  (पैसा आया, कुछ उधार नहीं -> No-Debt)।",
        "x=1,y=0,z=1 -> D=0, Bout=0  (एक unit एक पुराना debt बिल्कुल चुका देता है -> No-Debt)।",
        "x=1,y=1,z=0 -> D=0, Bout=0  (एक unit एक bill बिल्कुल चुका देता है -> No-Debt)।",
        "x=1,y=1,z=1 -> D=1, Bout=1  (एक unit bill+debt cover नहीं कर सकता -> सब ख़त्म, Overdraft)।"
      ],
      "transcriptEN": "Here is the full ledger, all eight rows. Notice the pattern: whenever your wallet bit x is 0 but something is owed, you overdraft. The one tricky row is the last - wallet has 1, but both a bill and a debt arrive, so the single unit is exhausted and you still borrow, giving D=1 and Bout=1. Memorize this table as eight money stories, not eight random bits.",
      "transcriptHI": "यह रहा पूरा ledger, सभी आठ rows। pattern देखिए: जब भी आपका wallet bit x 0 है पर कुछ उधार है, आप overdraft में जाते हैं। एक tricky row आख़िरी है - wallet में 1 है, पर bill और debt दोनों आ जाते हैं, तो एक unit ख़त्म हो जाता है और आप फिर भी उधार लेते हैं, जिससे D=1 और Bout=1। इस table को आठ random bits नहीं, बल्कि आठ money stories की तरह याद रखिए।"
    },
    {
      "id": "S07_Logic",
      "label": "The Logic",
      "kind": "theory",
      "subtitle": "D = x XOR y XOR z, Bout = x'y + x'z + yz",
      "theoryEN": [
        "Difference: D = x XOR y XOR z. The coins flip to 1 only when an ODD number of the three inputs are 1.",
        "Borrow-out: Bout = (x' AND y) OR (x' AND z) OR (y AND z), written x'y + x'z + yz.",
        "Term x'y: empty wallet faces a bill -> overdraft.",
        "Term x'z: empty wallet faces an old debt -> overdraft.",
        "Term yz: a bill AND a debt land together, overwhelming even a full wallet -> overdraft.",
        "Both expressions reproduce every one of the eight truth-table rows exactly."
      ],
      "theoryHI": [
        "Difference: D = x XOR y XOR z। coins तभी 1 होते हैं जब तीनों inputs में से ODD संख्या में 1 हों।",
        "Borrow-out: Bout = (x' AND y) OR (x' AND z) OR (y AND z), यानी x'y + x'z + yz।",
        "Term x'y: खाली wallet के सामने bill -> overdraft।",
        "Term x'z: खाली wallet के सामने पुराना debt -> overdraft।",
        "Term yz: bill और debt एक साथ आ जाते हैं, भरा wallet भी हार जाता है -> overdraft।",
        "दोनों expressions truth table की आठों rows को बिल्कुल सही reproduce करते हैं।"
      ],
      "transcriptEN": "Two clean equations run the whole circuit. The difference is a three-way XOR: D equals x XOR y XOR z, true whenever an odd number of inputs are one. The borrow-out is a sum of three product terms: x prime y plus x prime z plus y z. Each term is one overdraft cause - empty wallet versus a bill, empty wallet versus a debt, or a bill and a debt arriving together. Match each term to its money story and the algebra stops being scary.",
      "transcriptHI": "दो साफ़ equations पूरे circuit को चलाते हैं। Difference एक three-way XOR है: D बराबर x XOR y XOR z, जो तब true होता है जब odd संख्या में inputs एक हों। Borrow-out तीन product terms का sum है: x prime y plus x prime z plus y z। हर term एक overdraft का कारण है - खाली wallet बनाम bill, खाली wallet बनाम debt, या bill और debt एक साथ आना। हर term को उसकी money story से मिलाइए और algebra डरावना नहीं रहेगा।"
    },
    {
      "id": "S08_Circuit",
      "label": "The Circuit",
      "kind": "circuit",
      "subtitle": "Two half subtractors + one OR gate",
      "theoryEN": [
        "A full subtractor is built from two half subtractors plus one OR gate - mirroring the full adder's structure.",
        "Half subtractor 1 takes x and y: its difference is (x XOR y), its borrow is (x' AND y).",
        "Half subtractor 2 takes (x XOR y) and z: its difference is the final D = x XOR y XOR z.",
        "The second half subtractor also produces borrow ((x XOR y)' AND z).",
        "The OR gate combines the two intermediate borrows to give Bout = x'y + (x XOR y)'z, equal to x'y + x'z + yz.",
        "So: chain two half subtractors for the difference, OR their borrows for the borrow-out."
      ],
      "theoryHI": [
        "Full subtractor दो half subtractors और एक OR gate से बनता है - full adder की structure जैसा ही।",
        "Half subtractor 1 लेता है x और y: इसका difference है (x XOR y), borrow है (x' AND y)।",
        "Half subtractor 2 लेता है (x XOR y) और z: इसका difference ही final D = x XOR y XOR z है।",
        "दूसरा half subtractor एक borrow भी देता है ((x XOR y)' AND z)।",
        "OR gate दोनों बीच के borrows को मिलाकर देता है Bout = x'y + (x XOR y)'z, जो x'y + x'z + yz के बराबर है।",
        "तो: difference के लिए दो half subtractors chain करें, borrow-out के लिए उनके borrows को OR करें।"
      ],
      "transcriptEN": "The build is beautifully symmetric with the full adder. Take two half subtractors. The first subtracts the bill y from the wallet x. The second subtracts the old debt z from that intermediate result, and its difference is your final D. Each half subtractor coughs up a small borrow; an OR gate merges those two borrows into the single overdraft signal Bout. Two half subtractors and one OR gate - that's the entire machine.",
      "transcriptHI": "यह build full adder के साथ बहुत symmetric है। दो half subtractors लीजिए। पहला wallet x में से bill y subtract करता है। दूसरा उस बीच के result में से पुराना debt z subtract करता है, और इसका difference ही आपका final D है। हर half subtractor एक छोटा borrow निकालता है; एक OR gate उन दोनों borrows को मिलाकर एक overdraft signal Bout बना देता है। दो half subtractors और एक OR gate - बस यही पूरी machine है।"
    },
    {
      "id": "S09_Activity",
      "label": "Try It Yourself",
      "kind": "activity",
      "subtitle": "Toggle x, y, z and watch D, Bout",
      "theoryEN": [
        "Toggle the three switches - x (wallet), y (bill), z (debt) - and predict D and Bout before you look.",
        "Start with x=1, y=0, z=0: money in, no claims -> expect D=1, Bout=0 (No-Debt).",
        "Now set x=0, y=1, z=1: empty wallet, both bill and debt -> expect D=0, Bout=1 (Overdraft).",
        "Try the hard one x=1, y=1, z=1: one unit, two demands -> expect D=1, Bout=1 (exhausted).",
        "For each setting, say the money sentence out loud: 'wallet has ___, bill is ___, old debt is ___, so I keep D and owe Bout.'"
      ],
      "theoryHI": [
        "तीन switches - x (wallet), y (bill), z (debt) - को toggle कीजिए और देखने से पहले D और Bout का अनुमान लगाइए।",
        "शुरू कीजिए x=1, y=0, z=0 से: पैसा आया, कोई claim नहीं -> उम्मीद D=1, Bout=0 (No-Debt)।",
        "अब set कीजिए x=0, y=1, z=1: खाली wallet, bill और debt दोनों -> उम्मीद D=0, Bout=1 (Overdraft)।",
        "मुश्किल वाला try कीजिए x=1, y=1, z=1: एक unit, दो माँगें -> उम्मीद D=1, Bout=1 (सब ख़त्म)।",
        "हर setting पर money sentence ज़ोर से बोलिए: 'wallet में ___ है, bill ___ है, पुराना debt ___ है, तो मैं D रखता हूँ और Bout चुकाता हूँ।'"
      ],
      "transcriptEN": "Now you drive the ledger. Flip the three switches and, before peeking at the outputs, narrate the money story. Wallet has this, bill is that, old debt is this - therefore I keep so many coins and owe so much forward. Test the calm rows first, then the overdraft rows, and finally the exhausting all-ones row. When your spoken prediction matches the lights, you truly own the full subtractor.",
      "transcriptHI": "अब ledger आपके हाथ में है। तीन switches पलटिए और outputs देखने से पहले money story सुनाइए। wallet में इतना है, bill इतना है, पुराना debt इतना है - इसलिए मैं इतने coins रखता हूँ और इतना आगे चुकाता हूँ। पहले शांत rows test कीजिए, फिर overdraft rows, और आख़िर में थका देने वाली all-ones row। जब आपकी बोली हुई prediction lights से मिल जाए, तो आपने full subtractor सच में सीख लिया।"
    },
    {
      "id": "S10_Flashcards",
      "label": "Flashcards",
      "kind": "flashcards",
      "subtitle": "Lock in the ledger terms",
      "theoryEN": [
        "Flip through eight cards covering inputs, outputs, logic, and the build.",
        "Recall the money meaning first, then the formal name.",
        "Pay special attention to the borrow-out expression cards."
      ],
      "theoryHI": [
        "आठ cards पलटिए जो inputs, outputs, logic और build को cover करती हैं।",
        "पहले money meaning याद कीजिए, फिर formal नाम।",
        "borrow-out expression वाली cards पर ख़ास ध्यान दीजिए।"
      ],
      "transcriptEN": "Time to lock it in. These eight flashcards turn every ledger idea into a quick recall. Cover the answer, say the money story, then check the formal definition. Loop until the borrow-out expression feels as natural as your own bank balance.",
      "transcriptHI": "अब इसे पक्का करने का समय। ये आठ flashcards हर ledger idea को एक quick recall बना देती हैं। answer ढक दीजिए, money story बोलिए, फिर formal definition check कीजिए। तब तक दोहराइए जब तक borrow-out expression आपके अपने bank balance जितना natural न लगे।"
    },
    {
      "id": "S11_Quiz",
      "label": "Quiz",
      "kind": "quiz",
      "subtitle": "Prove you can balance the ledger",
      "theoryEN": [
        "Six questions test inputs, outputs, the truth table, and especially the borrow-out logic.",
        "Read each money scenario, then pick the bit answer.",
        "Two questions focus directly on Bout = x'y + x'z + yz."
      ],
      "theoryHI": [
        "छह सवाल inputs, outputs, truth table, और ख़ासकर borrow-out logic को test करते हैं।",
        "हर money scenario पढ़िए, फिर bit answer चुनिए।",
        "दो सवाल सीधे Bout = x'y + x'z + yz पर हैं।"
      ],
      "transcriptEN": "Final check. Six questions, each a small ledger puzzle. Translate the money story into bits, apply the equations, and choose. Two of them target the borrow-out expression directly, so make sure each product term's meaning is crystal clear before you start.",
      "transcriptHI": "आख़िरी जाँच। छह सवाल, हर एक एक छोटा ledger puzzle। money story को bits में बदलिए, equations लगाइए, और चुनिए। इनमें से दो सीधे borrow-out expression पर हैं, इसलिए शुरू करने से पहले हर product term का मतलब बिल्कुल साफ़ रखिए।"
    },
    {
      "id": "S12_Recap",
      "label": "Recap",
      "kind": "recap",
      "subtitle": "The ledger in one page",
      "theoryEN": [
        "Inputs: x = wallet balance, y = current bill, z = borrow-in (old debt).",
        "Outputs: D = difference (loose coins kept), Bout = borrow-out (overdraft owed forward).",
        "Half subtractor is amnesic (2 inputs); the full subtractor is continuous (3 inputs) and cascadable.",
        "Logic: D = x XOR y XOR z; Bout = x'y + x'z + yz.",
        "Build: two half subtractors give the difference, an OR gate merges their borrows into Bout.",
        "Read every row as a transaction: No-Debt (Bout=0) when the wallet covers it, Overdraft (Bout=1) when it can't."
      ],
      "theoryHI": [
        "Inputs: x = wallet balance, y = current bill, z = borrow-in (पुराना debt)।",
        "Outputs: D = difference (बचे loose coins), Bout = borrow-out (आगे चुकाया जाने वाला overdraft)।",
        "Half subtractor amnesic है (2 inputs); full subtractor continuous है (3 inputs) और cascadable।",
        "Logic: D = x XOR y XOR z; Bout = x'y + x'z + yz।",
        "Build: दो half subtractors difference देते हैं, एक OR gate उनके borrows को मिलाकर Bout बनाता है।",
        "हर row को transaction की तरह पढ़िए: No-Debt (Bout=0) जब wallet cover कर ले, Overdraft (Bout=1) जब न कर पाए।"
      ],
      "transcriptEN": "Let's close the ledger. Three inputs - wallet, bill, old debt. Two outputs - loose coins and overdraft. The half subtractor forgets the past; the full subtractor remembers it through the borrow-in and chains across columns. Difference is a triple XOR, borrow-out is x prime y plus x prime z plus y z, and the machine is two half subtractors with an OR gate. Every row is just a transaction: covered means No-Debt, short means Overdraft. Balance the ledger and you've mastered the full subtractor.",
      "transcriptHI": "चलिए ledger बंद करते हैं। तीन inputs - wallet, bill, पुराना debt। दो outputs - loose coins और overdraft। Half subtractor past भूल जाता है; full subtractor उसे borrow-in के ज़रिए याद रखता है और columns भर chain करता है। Difference एक triple XOR है, borrow-out है x prime y plus x prime z plus y z, और machine है दो half subtractors एक OR gate के साथ। हर row बस एक transaction है: cover हो गया तो No-Debt, कम पड़ा तो Overdraft। ledger balance कर लिया, तो आपने full subtractor में महारत हासिल कर ली।"
    }
  ],
  "flashcards": [
    {
      "frontEN": "In the Digital Ledger, what do the three inputs x, y, z represent?",
      "backEN": "x = Minuend = Wallet Balance (money you have); y = Subtrahend = Current Bill (money requested now); z = Borrow-in = Existing Debt (memory from the previous column).",
      "frontHI": "Digital Ledger में तीन inputs x, y, z किसे represent करते हैं?",
      "backHI": "x = Minuend = Wallet Balance (आपके पास पैसा); y = Subtrahend = Current Bill (अभी माँगा गया पैसा); z = Borrow-in = Existing Debt (पिछले column की memory)।"
    },
    {
      "frontEN": "What do the two outputs D and Bout mean in money terms?",
      "backEN": "D = Difference = 'loose coins' (funds remaining this column). Bout = Borrow-out = 'overdraft' (new debt carried to the next column).",
      "frontHI": "दो outputs D और Bout का money में क्या मतलब है?",
      "backHI": "D = Difference = 'loose coins' (इस column में बचा पैसा)। Bout = Borrow-out = 'overdraft' (अगले column तक ले जाया गया नया debt)।"
    },
    {
      "frontEN": "How is the full subtractor an upgrade over the half subtractor?",
      "backEN": "The half subtractor is amnesic with 2 inputs (x, y) and can't accept past debt. The full subtractor adds a 3rd input z (borrow-in), making it continuous and cascadable across many columns.",
      "frontHI": "Full subtractor, half subtractor का upgrade कैसे है?",
      "backHI": "Half subtractor amnesic है, 2 inputs (x, y) के साथ, और पुराना debt नहीं ले सकता। Full subtractor एक तीसरा input z (borrow-in) जोड़ता है, जिससे यह continuous और कई columns भर cascadable बन जाता है।"
    },
    {
      "frontEN": "What is the formula for the Difference D?",
      "backEN": "D = x XOR y XOR z. The coins go to 1 only when an odd number of the three inputs are 1.",
      "frontHI": "Difference D का formula क्या है?",
      "backHI": "D = x XOR y XOR z। coins तभी 1 होते हैं जब तीनों inputs में से odd संख्या में 1 हों।"
    },
    {
      "frontEN": "What is the formula for the Borrow-out Bout?",
      "backEN": "Bout = x'y + x'z + yz, i.e. (x' AND y) OR (x' AND z) OR (y AND z).",
      "frontHI": "Borrow-out Bout का formula क्या है?",
      "backHI": "Bout = x'y + x'z + yz, यानी (x' AND y) OR (x' AND z) OR (y AND z)।"
    },
    {
      "frontEN": "Explain each term of Bout = x'y + x'z + yz as a money story.",
      "backEN": "x'y = empty wallet faces a bill -> overdraft. x'z = empty wallet faces an old debt -> overdraft. yz = a bill AND a debt arrive together, exhausting even a full wallet -> overdraft.",
      "frontHI": "Bout = x'y + x'z + yz के हर term को money story के रूप में समझाइए।",
      "backHI": "x'y = खाली wallet के सामने bill -> overdraft। x'z = खाली wallet के सामने पुराना debt -> overdraft। yz = bill और debt एक साथ आते हैं, भरा wallet भी ख़त्म -> overdraft।"
    },
    {
      "frontEN": "How is a full subtractor built from smaller blocks?",
      "backEN": "Two half subtractors plus one OR gate (mirroring the full adder). The two half subtractors produce the difference; the OR gate merges their two borrows into Bout.",
      "frontHI": "Full subtractor छोटे blocks से कैसे बनता है?",
      "backHI": "दो half subtractors और एक OR gate (full adder जैसा)। दो half subtractors difference देते हैं; OR gate उनके दो borrows को मिलाकर Bout बनाता है।"
    },
    {
      "frontEN": "For x=1, y=1, z=1, what are D and Bout, and why?",
      "backEN": "D=1, Bout=1. One wallet unit must pay BOTH a bill and an old debt; it's exhausted and still short, so you borrow from the next column (Overdraft).",
      "frontHI": "x=1, y=1, z=1 के लिए D और Bout क्या होंगे, और क्यों?",
      "backHI": "D=1, Bout=1। एक wallet unit को bill और पुराना debt दोनों चुकाने हैं; वह ख़त्म हो जाता है पर फिर भी कम पड़ता है, इसलिए आप अगले column से उधार लेते हैं (Overdraft)।"
    }
  ],
  "quiz": [
    {
      "questionEN": "In the Digital Ledger analogy, what does the borrow-in z represent?",
      "options": [
        "The money currently in your wallet",
        "The existing debt carried from the previous column",
        "The loose coins remaining after paying",
        "The current bill requested now"
      ],
      "answerIndex": 1,
      "explainEN": "z = Borrow-in = Existing Debt: it is the memory of a borrow from the previous column. x is the wallet, y is the bill, and the leftover coins are the difference D.",
      "explainHI": "z = Borrow-in = Existing Debt: यह पिछले column से आए borrow की memory है। x wallet है, y bill है, और बचे coins difference D हैं।"
    },
    {
      "questionEN": "Which Boolean expression correctly gives the Borrow-out of a full subtractor?",
      "options": [
        "Bout = xy + xz + yz",
        "Bout = x'y + x'z + yz",
        "Bout = x XOR y XOR z",
        "Bout = x'y' + xz + y'z"
      ],
      "answerIndex": 1,
      "explainEN": "Bout = x'y + x'z + yz. Each term is an overdraft cause: empty wallet vs a bill (x'y), empty wallet vs a debt (x'z), or a bill and debt arriving together (yz). Note: xy+xz+yz is the carry-out of an ADDER, not a subtractor.",
      "explainHI": "Bout = x'y + x'z + yz। हर term overdraft का कारण है: खाली wallet बनाम bill (x'y), खाली wallet बनाम debt (x'z), या bill और debt एक साथ (yz)। ध्यान दें: xy+xz+yz तो ADDER का carry-out है, subtractor का नहीं।"
    },
    {
      "questionEN": "In Bout = x'y + x'z + yz, what money situation does the term yz describe?",
      "options": [
        "An empty wallet facing a single bill",
        "A full wallet with no claims at all",
        "A bill and an old debt arriving together, exhausting even a full wallet",
        "Loose coins left over after a successful payment"
      ],
      "answerIndex": 2,
      "explainEN": "yz is true when both the bill (y) and the old debt (z) are 1. Even a wallet holding 1 unit cannot cover two demands, so it overdraws and Bout=1. This is the case x=1,y=1,z=1 giving Bout=1.",
      "explainHI": "yz तब true होता है जब bill (y) और पुराना debt (z) दोनों 1 हों। 1 unit वाला wallet भी दो माँगें cover नहीं कर सकता, इसलिए overdraft होता है और Bout=1। यही case है x=1,y=1,z=1 जो Bout=1 देता है।"
    },
    {
      "questionEN": "For inputs x=1, y=1, z=1, what are the outputs D and Bout?",
      "options": [
        "D=0, Bout=0",
        "D=1, Bout=0",
        "D=0, Bout=1",
        "D=1, Bout=1"
      ],
      "answerIndex": 3,
      "explainEN": "D = 1 XOR 1 XOR 1 = 1 (odd number of 1s). Bout: yz=1 (and x'=0 kills the other terms), so Bout=1. The single wallet unit must pay both a bill and a debt, gets exhausted, and still borrows -> Overdraft.",
      "explainHI": "D = 1 XOR 1 XOR 1 = 1 (odd संख्या में 1)। Bout: yz=1 (और x'=0 बाक़ी terms ख़त्म कर देता है), तो Bout=1। एक wallet unit को bill और debt दोनों चुकाने हैं, वह ख़त्म होकर भी उधार लेता है -> Overdraft।"
    },
    {
      "questionEN": "Why is a full subtractor preferred over a half subtractor for multi-bit subtraction?",
      "options": [
        "It uses fewer logic gates than a half subtractor",
        "It has a third input (borrow-in z) so it can be cascaded across columns",
        "It produces only one output instead of two",
        "It does not need any XOR gates"
      ],
      "answerIndex": 1,
      "explainEN": "The half subtractor is amnesic with only x and y, so it can't accept a borrow from the previous column. The full subtractor adds borrow-in z, making it continuous and cascadable to subtract full multi-bit numbers.",
      "explainHI": "Half subtractor amnesic है, सिर्फ़ x और y के साथ, इसलिए पिछले column से borrow नहीं ले सकता। Full subtractor borrow-in z जोड़ता है, जिससे यह continuous और cascadable बन जाता है और पूरे multi-bit numbers subtract कर सकता है।"
    },
    {
      "questionEN": "A full subtractor can be built from which combination of blocks?",
      "options": [
        "Two half adders and one AND gate",
        "Two half subtractors and one OR gate",
        "One half subtractor and one XOR gate",
        "Two full adders and one NOT gate"
      ],
      "answerIndex": 1,
      "explainEN": "A full subtractor = two half subtractors + one OR gate, mirroring the full adder. The two half subtractors generate the difference (x XOR y XOR z); the OR gate combines their two intermediate borrows into Bout.",
      "explainHI": "Full subtractor = दो half subtractors + एक OR gate, full adder जैसा। दो half subtractors difference (x XOR y XOR z) बनाते हैं; OR gate उनके दो बीच के borrows को मिलाकर Bout बनाता है।"
    }
  ]
}) as unknown as SubContent;
