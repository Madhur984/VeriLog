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
        "Welcome to the Digital Ledger, where we tell the whole story of binary subtraction as if it were personal finance. Instead of memorising dry rules, you will picture a wallet, the bills you must pay, and the debts that follow you from one month to the next. By the end, subtracting binary numbers will feel as familiar as balancing your own bank account.",
        "Subtraction in a computer happens one column (one bit position) at a time, and each column is really a tiny money transaction. In every column three facts matter: how much you have on hand, how much is being demanded from you right now, and how much you already owed from before. Read each column that way and the binary patterns stop looking random.",
        "The full subtractor is the small circuit that keeps this ledger honest across many columns at once. A single column can borrow from the column to its left, just like overdrawing this month creates a debt you carry forward, and the full subtractor is built precisely to pass that debt along. Master one column and you have mastered the subtraction of numbers of any size."
      ],
      "theoryHI": [
        "Digital Ledger में आपका स्वागत है, जहाँ हम पूरी binary subtraction की कहानी personal finance की तरह सुनाएँगे। सूखे rules रटने के बजाय आप एक wallet की कल्पना कीजिए, वे bills जो आपको चुकाने हैं, और वे debts जो एक महीने से अगले महीने तक आपका पीछा करते हैं। अंत तक binary numbers घटाना आपके अपने bank account को balance करने जितना जाना-पहचाना लगेगा।",
        "Computer में subtraction एक बार में एक column (एक bit position) पर होती है, और हर column असल में एक छोटा money transaction है। हर column में तीन बातें मायने रखती हैं: आपके पास अभी कितना है, अभी आपसे कितना माँगा जा रहा है, और पहले से आप पर कितना उधार था। हर column को ऐसे पढ़िए और binary patterns random दिखना बंद हो जाएँगे।",
        "Full subtractor वह छोटा circuit है जो इस ledger को कई columns तक सही रखता है। एक column अपने बाएँ column से उधार ले सकता है, ठीक वैसे जैसे इस महीने overdraft करने से एक debt बनता है जो आप आगे ले जाते हैं, और full subtractor उसी debt को आगे पास करने के लिए बना है। एक column पर महारत पा लीजिए और आपने किसी भी size के numbers की subtraction पर महारत पा ली।"
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
        "As you watch, follow how a single subtraction column quietly turns into a money transaction: cash arrives, a bill is paid, and an old debt tugs on the balance until the account settles.",
        "Keep your eye on the three inputs (your balance, the current bill, and the old debt carried in) and the two outputs (the coins remaining and any new overdraft). These five quantities are the entire machine, and naming them now makes everything later feel obvious.",
        "Hold the ledger idea firmly in mind, because every logic gate we build in the coming pages maps straight back to one of these money moments. The picture comes first, then we open up the wiring."
      ],
      "theoryHI": [
        "देखते समय ध्यान दीजिए कि एक subtraction column कैसे चुपचाप एक money transaction बन जाता है: cash आता है, एक bill चुकता है, और एक पुराना debt balance को तब तक खींचता है जब तक account settle न हो जाए।",
        "तीन inputs (आपका balance, current bill, और अंदर आया पुराना debt) और दो outputs (बचे coins और कोई नया overdraft) पर नज़र रखिए। यही पाँच quantities पूरी machine हैं, और अभी इन्हें नाम दे देने से आगे सब कुछ आसान लगेगा।",
        "Ledger वाला idea मज़बूती से याद रखिए, क्योंकि आगे के pages में बनने वाला हर logic gate इन्हीं money moments में से किसी एक से जुड़ता है। पहले तस्वीर, फिर हम wiring खोलेंगे।"
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
        "The first input, x, is the minuend, which is just the formal word for the number you are subtracting from. In our ledger it is your wallet balance: the money you actually have on hand in this column. Whenever you see x, think 'what is in my pocket right now'.",
        "The second input, y, is the subtrahend, the number being taken away. In the ledger it is the current bill, the amount someone is demanding from you at this very moment. So x is what you own and y is what you must hand over.",
        "The third input, z, is the borrow-in, often written Bin. It is your existing debt: the memory of a borrow that happened in the column to the right, one position lower in value. This is the input the half subtractor lacked, and it is exactly what lets one column remember the trouble created by the column before it.",
        "All three of these are single bits, meaning each can only be 0 or 1. A 0 means 'nothing here at all' (an empty wallet, no bill, or no debt), while a 1 means 'one unit is present'. There are no in-between values, which is what keeps binary circuits simple and reliable.",
        "Put together, the full subtractor's entire job is to compute x minus y minus z for one column at a time. That is it: take what you have, remove the bill, remove the old debt, and report what is left. Everything else in this module is just the careful machinery that performs this one small calculation."
      ],
      "theoryHI": [
        "पहला input, x, minuend है, जो उस number का formal नाम है जिसमें से आप घटा रहे हैं। हमारे ledger में यह आपका wallet balance है: इस column में अभी आपके हाथ में जो पैसा है। जब भी x दिखे, सोचिए 'अभी मेरी जेब में क्या है'।",
        "दूसरा input, y, subtrahend है, यानी वह number जो घटाया जा रहा है। ledger में यह current bill है, वह रक़म जो अभी इसी पल कोई आपसे माँग रहा है। तो x वह है जो आपके पास है और y वह है जो आपको देना है।",
        "तीसरा input, z, borrow-in है, जिसे अक्सर Bin लिखते हैं। यह आपका existing debt है: दाईं ओर वाले column में हुए borrow की memory, जो एक position नीचे और कम value का है। यही वह input है जो half subtractor में नहीं था, और यही एक column को पिछले column की मुसीबत याद रखने देता है।",
        "ये तीनों single bits हैं, यानी हर एक सिर्फ़ 0 या 1 हो सकता है। 0 का मतलब 'यहाँ कुछ भी नहीं' (खाली wallet, कोई bill नहीं, या कोई debt नहीं), और 1 का मतलब 'एक unit मौजूद है'। बीच की कोई value नहीं होती, और यही binary circuits को सरल और भरोसेमंद रखता है।",
        "मिलाकर देखें तो full subtractor का पूरा काम है एक बार में एक column के लिए x minus y minus z निकालना। बस इतना ही: जो आपके पास है लीजिए, bill घटाइए, पुराना debt घटाइए, और बताइए कितना बचा। इस module में बाक़ी सब कुछ बस वह सावधान machinery है जो यही एक छोटा calculation करती है।"
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
        "The half subtractor is amnesic, like a shopkeeper with no memory at all. It sees only two inputs, x and y, so it can compare your wallet against the current bill but knows nothing about the past. Every transaction feels brand new to it, as if no debt could possibly exist.",
        "Because it has no input for a borrow-in, the half subtractor can only ever handle one standalone column in isolation. That is fine if you are subtracting two single-bit numbers, but real numbers span many columns, and the moment one column needs to borrow, the half subtractor simply has no way to hear about it.",
        "The full subtractor fixes this by being continuous instead of amnesic. It keeps the two original inputs and adds an important third one, z, the borrow-in, so it can remember the debt left behind by the previous column. That single extra wire is the entire difference between the two devices.",
        "With three inputs, full subtractors can be cascaded, meaning you wire the borrow-out of one column into the borrow-in of the next, column after column. A 4-bit subtraction simply chains four full subtractors together. This is how a circuit that handles only one bit position scales up to subtract numbers of any width.",
        "In one line: the half subtractor is a single isolated transaction, while the full subtractor is a running account that never forgets what it owes. The rest of this module is really the story of that one remembered debt."
      ],
      "theoryHI": [
        "Half subtractor amnesic है, बिल्कुल उस दुकानदार जैसा जिसकी कोई memory ही नहीं। यह सिर्फ़ दो inputs x और y देखता है, इसलिए आपके wallet की current bill से तुलना तो कर लेता है पर past के बारे में कुछ नहीं जानता। हर transaction इसे बिल्कुल नया लगता है, मानो कोई debt हो ही नहीं सकता।",
        "क्योंकि इसमें borrow-in के लिए कोई input नहीं है, half subtractor सिर्फ़ एक अकेले column को अलग-थलग ही सँभाल सकता है। दो single-bit numbers घटाने के लिए तो ठीक है, पर असली numbers कई columns में फैले होते हैं, और जैसे ही किसी column को borrow करना पड़े, half subtractor के पास यह सुनने का कोई रास्ता ही नहीं।",
        "Full subtractor इसे amnesic के बजाय continuous बनाकर ठीक करता है। यह दोनों मूल inputs रखता है और एक ज़रूरी तीसरा input z, यानी borrow-in, जोड़ता है, ताकि पिछले column का छोड़ा हुआ debt याद रहे। बस वही एक extra wire दोनों devices के बीच का पूरा फ़र्क़ है।",
        "तीन inputs के साथ full subtractors को cascade किया जा सकता है, यानी एक column का borrow-out अगले column के borrow-in में wire कर दीजिए, column दर column। एक 4-bit subtraction बस चार full subtractors को chain कर देती है। इसी तरह एक circuit जो सिर्फ़ एक bit position सँभालता है, किसी भी width के numbers घटाने तक scale हो जाता है।",
        "एक लाइन में: half subtractor एक अकेला अलग-थलग transaction है, जबकि full subtractor एक चलता हुआ account है जो अपना उधार कभी नहीं भूलता। इस module का बाक़ी हिस्सा असल में उसी एक याद रखे गए debt की कहानी है।"
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
        "Every column produces exactly two answers, and the first is D, the difference. Think of D as your loose coins: the funds still sitting in your hand in this column once both the bill and the old debt have been settled. It is the visible result of the subtraction, the part you actually keep.",
        "The second answer is Bout, the borrow-out, which is your overdraft. When this column simply did not have enough to cover what was owed, you reach over and borrow one unit from the next column to the left, and Bout records that you did so. It is brand-new debt being handed forward.",
        "When the column had enough money, the arithmetic is calm: D tells you precisely how much is left and Bout stays at 0, meaning no overdraft was needed. The account balanced on its own and nothing has to be carried anywhere.",
        "When the column fell short, the rule is mechanical and always the same: you borrow exactly one unit from the next column, which in binary is worth two units here (since each column to the left carries double the weight), and Bout flips to 1. That borrowed unit is what lets the difference come out as a valid bit.",
        "It helps to read both outputs as a single sentence: 'After paying everything, I have D coins left, and I owe Bout forward to next month.' Difference is what you keep; borrow-out is what you owe. Once you can say that sentence for any column, the full subtractor holds no mystery."
      ],
      "theoryHI": [
        "हर column ठीक दो जवाब देता है, और पहला है D, यानी difference। D को अपने loose coins की तरह सोचिए: bill और पुराना debt दोनों चुकाने के बाद इस column में आपके हाथ में बचा हुआ पैसा। यह subtraction का दिखने वाला नतीजा है, वह हिस्सा जो आप सच में रखते हैं।",
        "दूसरा जवाब है Bout, यानी borrow-out, जो आपका overdraft है। जब इस column के पास उधार चुकाने के लिए काफ़ी नहीं था, तो आप बाईं ओर के अगले column से एक unit उधार ले लेते हैं, और Bout यह दर्ज करता है कि आपने ऐसा किया। यह बिल्कुल नया debt है जो आगे पास किया जा रहा है।",
        "जब column के पास काफ़ी पैसा था, गणित शांत रहता है: D ठीक-ठीक बता देता है कितना बचा और Bout 0 रहता है, यानी किसी overdraft की ज़रूरत नहीं पड़ी। account ख़ुद ही balance हो गया और कुछ भी कहीं ले जाना नहीं पड़ा।",
        "जब column कम पड़ गया, नियम यांत्रिक और हमेशा एक जैसा है: आप अगले column से ठीक एक unit उधार लेते हैं, जो binary में यहाँ दो units के बराबर होता है (क्योंकि बाईं ओर का हर column दोगुना weight रखता है), और Bout 1 हो जाता है। वही उधार लिया unit difference को एक valid bit के रूप में निकलने देता है।",
        "दोनों outputs को एक वाक्य की तरह पढ़ना मदद करता है: 'सब चुकाने के बाद मेरे पास D coins बचे, और मुझ पर अगले महीने Bout का उधार है।' Difference वह है जो आप रखते हैं; borrow-out वह है जो आप चुकाते हैं। जब आप किसी भी column के लिए यह वाक्य बोल सकें, तो full subtractor में कोई रहस्य नहीं बचता।"
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
        "It helps to read every row of the ledger as a little story, and every story falls into one of two camps. A No-Debt row is one where Bout equals 0, meaning your wallet covered everything and nothing had to be borrowed. An Overdraft row is one where Bout equals 1, meaning the wallet came up short and you had to reach into the next column.",
        "The clearest overdraft is an empty wallet facing a demand. If x is 0 but a bill arrives (y=1) or an old debt is waiting (z=1), you simply cannot pay from nothing, so you must borrow and Bout becomes 1. An empty pocket with any claim against it always means trouble.",
        "There is also a sneakier overdraft, and it is the one most people get wrong. When your wallet holds a single unit (x=1) but must cover both a bill and an old debt at once (y=1 and z=1), that one unit is not enough for two demands. You spend it, you are still short, so you borrow and Bout is 1 even though you started with money.",
        "Many rows are perfectly calm. If the wallet holds 1 and only one small claim arrives, such as x=1, y=1, z=0, the single unit covers the single bill exactly and you are left settled with no overdraft, so Bout stays 0. The account balances on its own and nothing carries forward.",
        "The quietest row of all is the empty column where x, y and z are all 0. Nothing comes in, nothing is demanded, nothing was owed, so D is 0 and Bout is 0. It is the financial equivalent of a day where you neither earned nor spent a single coin."
      ],
      "theoryHI": [
        "ledger की हर row को एक छोटी कहानी की तरह पढ़ना मदद करता है, और हर कहानी दो खेमों में से एक में आती है। No-Debt row वह है जहाँ Bout 0 है, यानी आपके wallet ने सब कुछ cover कर लिया और कुछ उधार लेना नहीं पड़ा। Overdraft row वह है जहाँ Bout 1 है, यानी wallet कम पड़ा और आपको अगले column में हाथ डालना पड़ा।",
        "सबसे साफ़ overdraft है एक खाली wallet जिसके सामने कोई माँग हो। अगर x 0 है पर एक bill आता है (y=1) या एक पुराना debt इंतज़ार कर रहा है (z=1), तो आप शून्य से कुछ चुका नहीं सकते, इसलिए आपको उधार लेना पड़ता है और Bout 1 हो जाता है। खाली जेब पर कोई भी claim हमेशा मुसीबत है।",
        "एक चालाक overdraft भी है, और यही वह है जिसे ज़्यादातर लोग ग़लत समझते हैं। जब आपके wallet में एक ही unit हो (x=1) पर एक साथ bill और पुराना debt दोनों चुकाने हों (y=1 और z=1), तो वह एक unit दो माँगों के लिए काफ़ी नहीं। आप उसे ख़र्च कर देते हैं, फिर भी कम पड़ता है, इसलिए उधार लेते हैं और Bout 1 हो जाता है, भले ही आपने पैसे से शुरू किया था।",
        "कई rows बिल्कुल शांत होती हैं। अगर wallet में 1 है और सिर्फ़ एक छोटा claim आता है, जैसे x=1, y=1, z=0, तो वह एक unit उस एक bill को बिल्कुल पूरा कर देता है और आप बिना किसी overdraft के संतुलित रह जाते हैं, इसलिए Bout 0 रहता है। account ख़ुद balance हो जाता है और कुछ आगे नहीं जाता।",
        "सबसे शांत row वह खाली column है जहाँ x, y और z सभी 0 हैं। न कुछ आता है, न कुछ माँगा जाता है, न कुछ उधार था, इसलिए D 0 और Bout 0 है। यह उस दिन के बराबर है जब आपने न एक coin कमाया न ख़र्च किया।"
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
        "With three single-bit inputs there are exactly eight possible combinations, two choices for x times two for y times two for z, so the complete ledger fits neatly into eight rows. The table beside this text lists every one of them with its difference D and borrow-out Bout already computed, and the overdraft rows are highlighted so you can spot the stressful situations at a glance.",
        "Look first at the four rows where the wallet is empty, where x equals 0. Three of them owe something: paying an old debt alone (0,0,1), facing a bill alone (0,1,0), or facing both at once (0,1,1) each force a borrow, so Bout is 1 every time. Only the truly empty column (0,0,0) escapes, sitting quietly with D=0 and Bout=0 because nothing was ever demanded.",
        "Now look at the four rows where the wallet holds a unit, where x equals 1. Three of them stay calm: money in with nothing owed (1,0,0) leaves D=1, one unit paying one old debt exactly (1,0,1) leaves D=0, and one unit paying one bill exactly (1,1,0) leaves D=0, all with Bout=0 because the wallet covered the claim.",
        "The single tricky row in the entire table is the last one, x=1, y=1, z=1. Here your one wallet unit is asked to cover both a bill and an old debt together. It cannot, so the unit is exhausted yet you are still short, and you must borrow anyway, giving the surprising result D=1 and Bout=1. This is the row worth memorising precisely because it defies the naive guess.",
        "Notice the overall pattern instead of treating these as eight random bit patterns: an overdraft (Bout=1) appears whenever an empty wallet faces any claim, or whenever a bill and a debt pile onto the same column at once. Read each row as one of eight money stories and the table becomes something you understand rather than something you memorise blindly."
      ],
      "theoryHI": [
        "तीन single-bit inputs के साथ ठीक आठ संभव combinations होते हैं, x के दो विकल्प गुणा y के दो गुणा z के दो, इसलिए पूरा ledger साफ़-सुथरे आठ rows में आ जाता है। इस text के बग़ल वाली table हर एक को उसके difference D और borrow-out Bout के साथ पहले से computed दिखाती है, और overdraft rows highlight हैं ताकि तनाव वाली स्थितियाँ एक नज़र में दिख जाएँ।",
        "पहले उन चार rows को देखिए जहाँ wallet खाली है, जहाँ x 0 है। इनमें से तीन पर कुछ उधार है: अकेले पुराना debt चुकाना (0,0,1), अकेले bill का सामना (0,1,0), या दोनों एक साथ (0,1,1) हर बार borrow कराते हैं, इसलिए Bout हर बार 1 है। सिर्फ़ सचमुच खाली column (0,0,0) बच निकलता है, D=0 और Bout=0 के साथ शांत बैठा, क्योंकि कभी कुछ माँगा ही नहीं गया।",
        "अब उन चार rows को देखिए जहाँ wallet में एक unit है, जहाँ x 1 है। इनमें से तीन शांत रहती हैं: पैसा आया और कुछ उधार नहीं (1,0,0) से D=1 बचता है, एक unit एक पुराना debt बिल्कुल चुकाए (1,0,1) से D=0, और एक unit एक bill बिल्कुल चुकाए (1,1,0) से D=0, सभी Bout=0 के साथ क्योंकि wallet ने claim cover कर लिया।",
        "पूरी table की एकमात्र tricky row आख़िरी है, x=1, y=1, z=1। यहाँ आपके एक wallet unit से एक साथ bill और पुराना debt दोनों cover करने को कहा जाता है। वह नहीं कर सकता, इसलिए unit ख़त्म हो जाता है फिर भी आप कम पड़ते हैं, और आपको वैसे भी उधार लेना पड़ता है, जिससे चौंकाने वाला नतीजा D=1 और Bout=1 आता है। यही row याद रखने लायक है क्योंकि यह सीधे-सादे अनुमान को ग़लत साबित करती है।",
        "इन्हें आठ random bit patterns मानने के बजाय कुल pattern पर ध्यान दीजिए: overdraft (Bout=1) तब आता है जब खाली wallet किसी भी claim का सामना करे, या जब bill और debt एक ही column पर एक साथ आ जाएँ। हर row को आठ money stories में से एक की तरह पढ़िए और table कुछ ऐसी बन जाती है जिसे आप समझते हैं, न कि आँख मूँदकर रटते हैं।"
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
        "Two short equations run this entire circuit, and the first one handles the difference. D equals x XOR y XOR z, where XOR (exclusive-OR) is the gate that outputs 1 only when its inputs disagree. Chained across all three inputs, this means D flips to 1 exactly when an odd number of the three (one of them, or all three) are 1, and settles to 0 when an even number are 1. The interactive scale below lets you tip it back and forth and watch this parity rule play out.",
        "The borrow-out is a little richer, written Bout = (x' AND y) OR (x' AND z) OR (y AND z), which is usually shortened to x'y + x'z + yz. Here the apostrophe in x' means NOT x, so x' is 1 precisely when your wallet is empty. The whole expression is true if any one of its three product terms is true, and each term is one specific reason you would slip into overdraft.",
        "The term x'y is the empty wallet meeting a bill: x' being 1 means no money, y being 1 means a bill has arrived, so AND-ing them flags exactly the case where you must borrow to pay. It is the most basic overdraft cause and it lines up with truth-table rows like (0,1,0).",
        "The term x'z is the twin of the first, except the demand is an old debt rather than a fresh bill: an empty wallet (x'=1) facing a carried-in borrow (z=1) again forces you to overdraft. Notice that x'y and x'z together cover every situation where the wallet is empty but something is owed.",
        "The term yz catches the sneaky case the wallet-empty terms miss: a bill and a debt arriving on the same column at once. When both y and z are 1, two separate demands land together, and even a wallet holding a full unit cannot satisfy two claims with one coin, so it overdraws. This single term is why the all-ones row (1,1,1) still produces Bout=1.",
        "Because these two expressions were derived straight from the eight-row table, they reproduce every single row exactly, no exceptions. If you ever doubt a result, you can compute D and Bout by hand from these formulas and you will always match the ledger, which is the whole point of turning the money stories into algebra."
      ],
      "theoryHI": [
        "दो छोटी equations इस पूरे circuit को चलाती हैं, और पहली difference सँभालती है। D बराबर x XOR y XOR z, जहाँ XOR (exclusive-OR) वह gate है जो तभी 1 देता है जब उसके inputs अलग हों। तीनों inputs पर chain होने पर इसका मतलब है D तभी 1 होता है जब तीनों में से odd संख्या (एक, या तीनों) 1 हों, और even संख्या 1 होने पर 0 रहता है। नीचे का interactive scale आपको इसे आगे-पीछे झुकाकर यह parity नियम देखने देता है।",
        "Borrow-out थोड़ा अमीर है, लिखा जाता है Bout = (x' AND y) OR (x' AND z) OR (y AND z), जिसे आम तौर पर x'y + x'z + yz में छोटा कर देते हैं। यहाँ x' में लगा apostrophe मतलब NOT x, इसलिए x' तभी 1 होता है जब आपका wallet खाली हो। पूरा expression तब true है जब इसके तीन product terms में से कोई एक भी true हो, और हर term overdraft में जाने का एक ख़ास कारण है।",
        "Term x'y है खाली wallet का bill से सामना: x' का 1 होना मतलब पैसा नहीं, y का 1 होना मतलब bill आ गया, इसलिए इन्हें AND करना ठीक वही case पकड़ता है जहाँ चुकाने के लिए उधार लेना पड़े। यह सबसे बुनियादी overdraft कारण है और यह (0,1,0) जैसी truth-table rows से मेल खाता है।",
        "Term x'z पहले का जुड़वाँ है, बस माँग ताज़ा bill के बजाय पुराना debt है: खाली wallet (x'=1) का अंदर आए borrow (z=1) से सामना फिर से overdraft कराता है। ध्यान दीजिए कि x'y और x'z मिलकर हर उस स्थिति को cover कर देते हैं जहाँ wallet खाली हो पर कुछ उधार हो।",
        "Term yz वह चालाक case पकड़ता है जो wallet-empty terms छोड़ देते हैं: एक ही column पर bill और debt का एक साथ आना। जब y और z दोनों 1 हों, दो अलग माँगें एक साथ आती हैं, और भरा एक unit वाला wallet भी एक coin से दो claims पूरे नहीं कर सकता, इसलिए overdraft हो जाता है। यही एक term है जिसकी वजह से all-ones row (1,1,1) भी Bout=1 देती है।",
        "क्योंकि ये दोनों expressions सीधे आठ-row table से निकाले गए हैं, ये हर एक row को बिल्कुल सही reproduce करते हैं, कोई अपवाद नहीं। अगर कभी किसी नतीजे पर शक हो, तो आप इन formulas से D और Bout हाथ से निकाल सकते हैं और हमेशा ledger से मेल खाएगा, और money stories को algebra में बदलने का यही पूरा मक़सद है।"
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
        "Rather than wiring raw gates from scratch, the cleanest way to build a full subtractor is to reuse a block you already know: the half subtractor. It turns out you need exactly two half subtractors plus a single OR gate, and this mirrors the full adder almost perfectly, which is a satisfying piece of symmetry between addition and subtraction circuits.",
        "The first half subtractor handles the easy part, your wallet versus the current bill. Fed x and y, it produces a difference of (x XOR y) and a small borrow of (x' AND y). This is the same standalone subtraction the amnesic half subtractor could already do; we are just using it as the first stage of something larger.",
        "The second half subtractor then brings in the old debt that the half subtractor alone could never handle. It takes the intermediate result (x XOR y) and subtracts z from it, so its difference is (x XOR y) XOR z, which is precisely the final answer D = x XOR y XOR z. The borrow-in has finally been folded into the calculation.",
        "That second half subtractor also coughs up its own little borrow, equal to ((x XOR y)' AND z), generated whenever subtracting the debt forced a borrow at this stage. So now we have two separate borrow signals floating around, one from each half subtractor, and we need to combine them into a single overdraft answer.",
        "An OR gate does exactly that merging: if either half subtractor had to borrow, the column as a whole is in overdraft. The OR produces Bout = x'y + (x XOR y)'z, and a little Boolean algebra shows this equals the x'y + x'z + yz we derived earlier, confirming the build matches the formula bit for bit.",
        "So the whole recipe collapses to one memorable sentence: chain two half subtractors to get the difference, then OR their two borrows to get the borrow-out. The interactive circuit and the 4-bit ripple below let you watch this structure compute a real column and then chain across a whole number."
      ],
      "theoryHI": [
        "ख़ाली gates को शुरू से wire करने के बजाय, full subtractor बनाने का सबसे साफ़ तरीका है एक ऐसे block को दोबारा इस्तेमाल करना जो आप पहले से जानते हैं: half subtractor। पता चलता है कि आपको ठीक दो half subtractors और एक OR gate चाहिए, और यह full adder से लगभग बिल्कुल मेल खाता है, जो addition और subtraction circuits के बीच एक संतोषजनक symmetry है।",
        "पहला half subtractor आसान हिस्सा सँभालता है, आपका wallet बनाम current bill। x और y देने पर यह (x XOR y) का difference और (x' AND y) का छोटा borrow देता है। यह वही अकेली subtraction है जो amnesic half subtractor पहले से कर सकता था; हम बस इसे किसी बड़ी चीज़ के पहले stage के रूप में इस्तेमाल कर रहे हैं।",
        "दूसरा half subtractor फिर वह पुराना debt लाता है जिसे अकेला half subtractor कभी सँभाल ही नहीं सकता था। यह बीच का result (x XOR y) लेता है और उसमें से z घटाता है, इसलिए इसका difference है (x XOR y) XOR z, जो ठीक final जवाब D = x XOR y XOR z है। borrow-in आख़िरकार calculation में शामिल हो गया।",
        "वह दूसरा half subtractor अपना एक छोटा borrow भी निकालता है, बराबर ((x XOR y)' AND z), जो तब बनता है जब debt घटाने से इस stage पर borrow करना पड़ा। तो अब हमारे पास दो अलग borrow signals घूम रहे हैं, हर half subtractor से एक, और हमें इन्हें एक overdraft जवाब में मिलाना है।",
        "एक OR gate ठीक यही मिलाना करता है: अगर किसी एक भी half subtractor को borrow करना पड़ा, तो पूरा column overdraft में है। OR देता है Bout = x'y + (x XOR y)'z, और थोड़ा Boolean algebra दिखाता है कि यह पहले निकाले गए x'y + x'z + yz के बराबर है, जो पुष्टि करता है कि build formula से bit दर bit मेल खाता है।",
        "तो पूरी recipe एक याद रखने लायक वाक्य में सिमट जाती है: difference पाने के लिए दो half subtractors chain कीजिए, फिर borrow-out पाने के लिए उनके दो borrows को OR कीजिए। नीचे का interactive circuit और 4-bit ripple आपको यह structure एक असली column को compute करते और फिर पूरे number भर chain होते दिखाता है।"
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
        "Let us close the ledger by tying the whole story back together. Every column of a binary subtraction is a money transaction with three inputs: x is your wallet balance (the minuend, what you have), y is the current bill (the subtrahend, what is demanded), and z is the borrow-in (the old debt carried from the column to the right).",
        "Each column then reports two outputs. D, the difference, is the loose coins you keep after settling everything, and Bout, the borrow-out, is the overdraft you owe forward when the wallet could not cover the demands. Difference is what stays in your hand; borrow-out is what travels to the next column on the left.",
        "The reason we needed a full subtractor at all is memory. A half subtractor is amnesic with only two inputs and cannot accept a borrow, so it handles a single isolated column. The full subtractor adds the third input z, making it continuous and cascadable, so chaining several of them subtracts numbers of any width.",
        "Two equations capture all of it: the difference is the three-way parity D = x XOR y XOR z, true when an odd number of inputs are 1, and the overdraft is Bout = x'y + x'z + yz, true when an empty wallet meets a bill, an empty wallet meets a debt, or a bill and a debt arrive together. To build it physically you chain two half subtractors for the difference and OR their two borrows into Bout.",
        "Above all, keep reading each row as a transaction rather than a random bit pattern. When the wallet covers the claim it is a calm No-Debt row with Bout=0, and when it falls short it is an Overdraft row with Bout=1. Balance that ledger column by column and you have genuinely mastered the full subtractor."
      ],
      "theoryHI": [
        "चलिए पूरी कहानी को आपस में बाँधकर ledger बंद करते हैं। binary subtraction का हर column तीन inputs वाला एक money transaction है: x आपका wallet balance है (minuend, जो आपके पास है), y current bill है (subtrahend, जो माँगा गया है), और z borrow-in है (दाईं ओर के column से आया पुराना debt)।",
        "हर column फिर दो outputs बताता है। D, यानी difference, सब चुकाने के बाद बचे loose coins हैं, और Bout, यानी borrow-out, वह overdraft है जो आप आगे चुकाते हैं जब wallet माँगें cover न कर पाए। Difference वह है जो आपके हाथ में रहता है; borrow-out वह है जो बाईं ओर के अगले column तक जाता है।",
        "हमें full subtractor की ज़रूरत ही memory की वजह से पड़ी। half subtractor amnesic है, सिर्फ़ दो inputs के साथ, और borrow नहीं ले सकता, इसलिए एक अकेला अलग column सँभालता है। full subtractor तीसरा input z जोड़ता है, जिससे यह continuous और cascadable बन जाता है, और कई को chain करने पर किसी भी width के numbers घट जाते हैं।",
        "दो equations सब कुछ पकड़ लेती हैं: difference तीन-तरफ़ा parity D = x XOR y XOR z है, जो odd संख्या में inputs 1 होने पर true है, और overdraft Bout = x'y + x'z + yz है, जो तब true है जब खाली wallet को bill मिले, खाली wallet को debt मिले, या bill और debt एक साथ आएँ। इसे भौतिक रूप से बनाने के लिए difference के लिए दो half subtractors chain कीजिए और उनके दो borrows को OR करके Bout बनाइए।",
        "सबसे बढ़कर, हर row को random bit pattern नहीं, बल्कि एक transaction की तरह पढ़ते रहिए। जब wallet claim cover कर ले तो यह शांत No-Debt row है, Bout=0 के साथ, और जब कम पड़े तो यह Overdraft row है, Bout=1 के साथ। उस ledger को column दर column balance कीजिए और आपने सचमुच full subtractor पर महारत पा ली।"
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
