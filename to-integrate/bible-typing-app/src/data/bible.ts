export type BookKey = "genesis" | "john" | "romans" | "psalms" | "matthew" | "mark" | "luke" | "acts" | "ephesians" | "philippians" | "colossians" | "thessalonians" | "hebrews" | "james" | "peter" | "revelation";

export type Testament = "old" | "new";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface BookInfo {
  key: BookKey;
  label: string;
  testament: Testament;
  difficulty: Difficulty;
  description: string;
  popularVerses: Array<{ chapter: number; verse: number; text: string }>;
}

export type BibleData = {
  [K in BookKey]: {
    [chapter: number]: string[];
  };
};

export const bible: BibleData = {
  genesis: {
    1: [
      "In the beginning God created the heaven and the earth.",
      "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      "And God said, Let there be light: and there was light.",
      "And God saw the light, that it was good: and God divided the light from the darkness.",
      "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
      "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.",
      "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.",
      "And God called the firmament Heaven. And the evening and the morning were the second day.",
      "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.",
      "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.",
      "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.",
      "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.",
      "And the evening and the morning were the third day.",
      "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:",
      "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.",
      "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.",
      "And God set them in the firmament of the heaven to give light upon the earth,",
      "And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.",
      "And the evening and the morning were the fourth day.",
      "And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.",
      "And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.",
      "And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.",
      "And the evening and the morning were the fifth day.",
      "And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.",
      "And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.",
      "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.",
      "So God created man in his own image, in the image of God created he him; male and female created he them.",
      "And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.",
      "And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.",
      "And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.",
      "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.",
    ],
  },
  john: {
    1: [
      "In the beginning was the Word, and the Word was with God, and the Word was God.",
      "The same was in the beginning with God.",
      "All things were made by him; and without him was not any thing made that was made.",
      "In him was life; and the life was the light of men.",
      "And the light shineth in the darkness; and the darkness comprehended it not.",
      "There was a man sent from God, whose name was John.",
      "The same came for a witness, to bear witness of the Light, that all men through him might believe.",
      "He was not that Light, but was sent to bear witness of that Light.",
      "That was the true Light, which lighteth every man that cometh into the world.",
      "He was in the world, and the world was made by him, and the world knew him not.",
      "He came unto his own, and his own received him not.",
      "But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:",
      "Which were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.",
      "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
    ],
    3: [
      "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:",
      "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.",
      "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.",
      "Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother's womb, and be born?",
      "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.",
      "That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.",
      "Marvel not that I said unto thee, Ye must be born again.",
      "The wind bloweth where it listeth, and thou hearest the sound thereof, but canst not tell whence it cometh, and whither it goeth: so is every one that is born of the Spirit.",
      "Nicodemus answered and said unto him, How can these things be?",
      "Jesus answered and said unto him, Art thou a master of Israel, and knowest not these things?",
      "Verily, verily, I say unto thee, We speak that we do know, and testify that we have seen; and ye receive not our witness.",
      "If I have told you earthly things, and ye believe not, how shall ye believe, if I tell you of heavenly things?",
      "And no man hath ascended up to heaven, but he that came down from heaven, even the Son of man which is in heaven.",
      "And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:",
      "That whosoever believeth in him should not perish, but have eternal life.",
      "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
      "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.",
      "And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.",
      "For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved.",
      "But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.",
    ],
  },
  romans: {
    1: [
      "Paul, a servant of Jesus Christ, called to be an apostle, separated unto the gospel of God,",
      "(Which he had promised afore by his prophets in the holy scriptures,)",
      "Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;",
      "And declared to be the Son of God with power, according to the spirit of holiness, by the resurrection from the dead:",
      "By whom we have received grace and apostleship, for obedience to the faith among all nations, for his name:",
      "Among whom are ye also the called of Jesus Christ:",
      "To all that be in Rome, beloved of God, called to be saints: Grace to you and peace from God our Father, and the Lord Jesus Christ.",
      "First, I thank my God through Jesus Christ for you all, that your faith is spoken of throughout the whole world.",
      "For God is my witness, whom I serve with my spirit in the gospel of his Son, that without ceasing I make mention of you always in my prayers;",
      "Making request, if by any means now at length I might have a prosperous journey by the will of God to come unto you.",
      "For I long to see you, that I may impart unto you some spiritual gift, to the end ye may be established;",
      "That is, that I may be comforted together with you by the mutual faith both of you and me.",
      "Now I would not have you ignorant, brethren, that oftentimes I purposed to come unto you, (but was let hitherto,) that I might have some fruit among you also, even as among other Gentiles.",
      "I am debtor both to the Greeks, and to the Barbarians; both to the wise, and to the unwise.",
      "So, as much as in me is, I am ready to preach the gospel to you that are at Rome also.",
      "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth; to the Jew first, and also to the Greek.",
      "For therein is the righteousness of God revealed from faith to faith: as it is written, The just shall live by faith.",
    ],
    8: [
      "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
      "For the law of the Spirit of life in Christ Jesus hath made me free from the law of sin and death.",
      "For what the law could not do, in that it was weak through the flesh, God sending his own Son in the likeness of sinful flesh, and for sin, condemned sin in the flesh:",
      "That the righteousness of the law might be fulfilled in us, who walk not after the flesh, but after the Spirit.",
      "For they that are after the flesh do mind the things of the flesh; but they that are after the Spirit the things of the Spirit.",
      "For to be carnally minded is death; but to be spiritually minded is life and peace.",
      "Because the carnal mind is enmity against God: for it is not subject to the law of God, neither indeed can be.",
      "So then they that are in the flesh cannot please God.",
      "But ye are not in the flesh, but in the Spirit, if so be that the Spirit of God dwell in you. Now if any man have not the Spirit of Christ, he is none of his.",
      "And if Christ be in you, the body is dead because of sin; but the Spirit is life because of righteousness.",
      "But if the Spirit of him that raised up Jesus from the dead dwell in you, he that raised up Christ from the dead shall also quicken your mortal bodies by his Spirit that dwelleth in you.",
      "Therefore, brethren, we are debtors, not to the flesh, to live after the flesh.",
      "For if ye live after the flesh, ye shall die: but if ye through the Spirit do mortify the deeds of the body, ye shall live.",
      "For as many as are led by the Spirit of God, they are the sons of God.",
      "For ye have not received the spirit of bondage again to fear; but ye have received the Spirit of adoption, whereby we cry, Abba, Father.",
      "The Spirit itself beareth witness with our spirit, that we are the children of God:",
      "And if children, then heirs; heirs of God, and joint-heirs with Christ; if so be that we suffer with him, that we may be also glorified together.",
      "For I reckon that the sufferings of this present time are not worthy to be compared with the glory which shall be revealed in us.",
      "For the earnest expectation of the creature waiteth for the manifestation of the sons of God.",
      "For the creature was made subject to vanity, not willingly, but by reason of him who hath subjected the same in hope,",
      "Because the creature itself also shall be delivered from the bondage of corruption into the glorious liberty of the children of God.",
      "For we know that the whole creation groaneth and travaileth in pain together until now.",
      "And not only they, but ourselves also, which have the firstfruits of the Spirit, even we ourselves groan within ourselves, waiting for the adoption, to wit, the redemption of our body.",
      "For we are saved by hope: but hope that is seen is not hope: for what a man seeth, why doth he yet hope for?",
      "But if we hope for that we see not, then do we with patience wait for it.",
      "Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered.",
      "And he that searcheth the hearts knoweth what is the mind of the Spirit, because he maketh intercession for the saints according to the will of God.",
      "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      "For whom he did foreknow, he also did predestinate to be conformed to the image of his Son, that he might be the firstborn among many brethren.",
      "Moreover whom he did predestinate, them he also called: and whom he called, them he also justified: and whom he justified, them he also glorified.",
      "What shall we then say to these things? If God be for us, who can be against us?",
      "He that spared not his own Son, but delivered him up for us all, how shall he not with him also freely give us all things?",
      "Who shall lay any thing to the charge of God's elect? It is God that justifieth.",
      "Who is he that condemneth? It is Christ that died, yea rather, that is risen again, who is even at the right hand of God, who also maketh intercession for us.",
      "Who shall separate us from the love of Christ? shall tribulation, or distress, or persecution, or famine, or nakedness, or peril, or sword?",
      "As it is written, For thy sake we are killed all the day long; we are accounted as sheep for the slaughter.",
      "Nay, in all these things we are more than conquerors through him that loved us.",
      "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,",
      "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
    ],
  },
  psalms: {
    23: [
      "The Lord is my shepherd; I shall not want.",
      "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
      "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
      "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.",
    ],
    1: [
      "Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",
      "But his delight is in the law of the Lord; and in his law doth he meditate day and night.",
      "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.",
      "The ungodly are not so: but are like the chaff which the wind driveth away.",
      "Therefore the ungodly shall not stand in the judgment, nor sinners in the congregation of the righteous.",
      "For the Lord knoweth the way of the righteous: but the way of the ungodly shall perish.",
    ],
  },
  matthew: {
    5: [
      "And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:",
      "And he opened his mouth, and taught them, saying,",
      "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
      "Blessed are they that mourn: for they shall be comforted.",
      "Blessed are the meek: for they shall inherit the earth.",
      "Blessed are they which do hunger and thirst after righteousness: for they shall be filled.",
      "Blessed are the merciful: for they shall obtain mercy.",
      "Blessed are the pure in heart: for they shall see God.",
      "Blessed are the peacemakers: for they shall be called the children of God.",
      "Blessed are they which are persecuted for righteousness' sake: for theirs is the kingdom of heaven.",
      "Blessed are ye, when men shall revile you, and persecute you, and shall say all manner of evil against you falsely, for my sake.",
      "Rejoice, and be exceeding glad: for great is your reward in heaven: for so persecuted they the prophets which were before you.",
    ],
  },
  mark: {
    1: [
      "The beginning of the gospel of Jesus Christ, the Son of God;",
      "As it is written in the prophets, Behold, I send my messenger before thy face, which shall prepare thy way before thee.",
      "The voice of one crying in the wilderness, Prepare ye the way of the Lord, make his paths straight.",
      "John did baptize in the wilderness, and preach the baptism of repentance for the remission of sins.",
    ],
  },
  luke: {
    1: [
      "Forasmuch as many have taken in hand to set forth in order a declaration of those things which are most surely believed among us,",
      "Even as they delivered them unto us, which from the beginning were eyewitnesses, and ministers of the word;",
      "It seemed good to me also, having had perfect understanding of all things from the very first, to write unto thee in order, most excellent Theophilus,",
      "That thou mightest know the certainty of those things, wherein thou hast been instructed.",
    ],
  },
  acts: {
    1: [
      "The former treatise have I made, O Theophilus, of all that Jesus began both to do and teach,",
      "Until the day in which he was taken up, after that he through the Holy Ghost had given commandments unto the apostles whom he had chosen:",
      "To whom also he shewed himself alive after his passion by many infallible proofs, being seen of them forty days, and speaking of the things pertaining to the kingdom of God:",
      "And, being assembled together with them, commanded them that they should not depart from Jerusalem, but wait for the promise of the Father, which, saith he, ye have heard of me.",
    ],
  },
  ephesians: {
    1: [
      "Paul, an apostle of Jesus Christ by the will of God, to the saints which are at Ephesus, and to the faithful in Christ Jesus:",
      "Grace be to you, and peace, from God our Father, and from the Lord Jesus Christ.",
      "Blessed be the God and Father of our Lord Jesus Christ, who hath blessed us with all spiritual blessings in heavenly places in Christ:",
    ],
  },
  philippians: {
    1: [
      "Paul and Timotheus, the servants of Jesus Christ, to all the saints in Christ Jesus which are at Philippi, with the bishops and deacons:",
      "Grace be unto you, and peace, from God our Father, and from the Lord Jesus Christ.",
      "I thank my God upon every remembrance of you,",
    ],
  },
  colossians: {
    1: [
      "Paul, an apostle of Jesus Christ by the will of God, and Timotheus our brother,",
      "To the saints and faithful brethren in Christ which are at Colosse: Grace be unto you, and peace, from God our Father and the Lord Jesus Christ.",
      "We give thanks to God and the Father of our Lord Jesus Christ, praying always for you,",
    ],
  },
  thessalonians: {
    1: [
      "Paul, and Silvanus, and Timotheus, unto the church of the Thessalonians which is in God the Father and in the Lord Jesus Christ: Grace be unto you, and peace, from God our Father, and the Lord Jesus Christ.",
      "We give thanks to God always for you all, making mention of you in our prayers;",
      "Remembering without ceasing your work of faith, and labour of love, and patience of hope in our Lord Jesus Christ, in the sight of God and our Father;",
    ],
  },
  hebrews: {
    1: [
      "God, who at sundry times and in divers manners spake in time past unto the fathers by the prophets,",
      "Hath in these last days spoken unto us by his Son, whom he hath appointed heir of all things, by whom also he made the worlds;",
      "Who being the brightness of his glory, and the express image of his person, and upholding all things by the word of his power, when he had by himself purged our sins, sat down on the right hand of the Majesty on high;",
    ],
  },
  james: {
    1: [
      "James, a servant of God and of the Lord Jesus Christ, to the twelve tribes which are scattered abroad, greeting.",
      "My brethren, count it all joy when ye fall into divers temptations;",
      "Knowing this, that the trying of your faith worketh patience.",
      "But let patience have her perfect work, that ye may be perfect and entire, wanting nothing.",
    ],
  },
  peter: {
    1: [
      "Peter, an apostle of Jesus Christ, to the strangers scattered throughout Pontus, Galatia, Cappadocia, Asia, and Bithynia,",
      "Elect according to the foreknowledge of God the Father, through sanctification of the Spirit, unto obedience and sprinkling of the blood of Jesus Christ: Grace unto you, and peace, be multiplied.",
      "Blessed be the God and Father of our Lord Jesus Christ, which according to his abundant mercy hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead,",
    ],
  },
  revelation: {
    1: [
      "The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass; and he sent and signified it by his angel unto his servant John:",
      "Who bare record of the word of God, and of the testimony of Jesus Christ, and of all things that he saw.",
      "Blessed is he that readeth, and they that hear the words of this prophecy, and keep those things which are written therein: for the time is at hand.",
    ],
  },
};

export const books: BookInfo[] = [
  {
    key: "genesis",
    label: "Genesis",
    testament: "old",
    difficulty: "intermediate",
    description: "The book of beginnings - creation, humanity, and God's covenant",
    popularVerses: [
      { chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth." },
      { chapter: 1, verse: 27, text: "So God created man in his own image..." },
    ],
  },
  {
    key: "john",
    label: "John",
    testament: "new",
    difficulty: "beginner",
    description: "The Gospel of love - Jesus as the Word made flesh",
    popularVerses: [
      { chapter: 1, verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
      { chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son..." },
    ],
  },
  {
    key: "romans",
    label: "Romans",
    testament: "new",
    difficulty: "advanced",
    description: "Paul's theological masterpiece on salvation and righteousness",
    popularVerses: [
      { chapter: 1, verse: 16, text: "For I am not ashamed of the gospel of Christ..." },
      { chapter: 8, verse: 28, text: "And we know that all things work together for good..." },
    ],
  },
  {
    key: "psalms",
    label: "Psalms",
    testament: "old",
    difficulty: "beginner",
    description: "Songs of worship, praise, and prayer",
    popularVerses: [
      { chapter: 23, verse: 1, text: "The Lord is my shepherd; I shall not want." },
      { chapter: 1, verse: 1, text: "Blessed is the man that walketh not in the counsel of the ungodly..." },
    ],
  },
  {
    key: "matthew",
    label: "Matthew",
    testament: "new",
    difficulty: "beginner",
    description: "The Gospel of the King - Jesus as the promised Messiah",
    popularVerses: [
      { chapter: 5, verse: 3, text: "Blessed are the poor in spirit: for theirs is the kingdom of heaven." },
    ],
  },
  {
    key: "mark",
    label: "Mark",
    testament: "new",
    difficulty: "beginner",
    description: "The Gospel of action - Jesus as the suffering servant",
    popularVerses: [
      { chapter: 1, verse: 1, text: "The beginning of the gospel of Jesus Christ, the Son of God;" },
    ],
  },
  {
    key: "luke",
    label: "Luke",
    testament: "new",
    difficulty: "intermediate",
    description: "The Gospel of compassion - Jesus as the Son of Man",
    popularVerses: [
      { chapter: 1, verse: 3, text: "It seemed good to me also, having had perfect understanding..." },
    ],
  },
  {
    key: "acts",
    label: "Acts",
    testament: "new",
    difficulty: "intermediate",
    description: "The early church and the spread of the Gospel",
    popularVerses: [
      { chapter: 1, verse: 8, text: "But ye shall receive power, after that the Holy Ghost is come..." },
    ],
  },
  {
    key: "ephesians",
    label: "Ephesians",
    testament: "new",
    difficulty: "intermediate",
    description: "Paul's letter on spiritual warfare and unity in Christ",
    popularVerses: [
      { chapter: 1, verse: 3, text: "Blessed be the God and Father of our Lord Jesus Christ..." },
    ],
  },
  {
    key: "philippians",
    label: "Philippians",
    testament: "new",
    difficulty: "beginner",
    description: "Paul's letter of joy and contentment in Christ",
    popularVerses: [
      { chapter: 1, verse: 3, text: "I thank my God upon every remembrance of you," },
    ],
  },
  {
    key: "colossians",
    label: "Colossians",
    testament: "new",
    difficulty: "intermediate",
    description: "Christ's supremacy and fullness",
    popularVerses: [
      { chapter: 1, verse: 3, text: "We give thanks to God and the Father of our Lord Jesus Christ..." },
    ],
  },
  {
    key: "thessalonians",
    label: "1 Thessalonians",
    testament: "new",
    difficulty: "beginner",
    description: "Paul's encouragement to a young church",
    popularVerses: [
      { chapter: 1, verse: 3, text: "Remembering without ceasing your work of faith..." },
    ],
  },
  {
    key: "hebrews",
    label: "Hebrews",
    testament: "new",
    difficulty: "advanced",
    description: "Christ as our great high priest",
    popularVerses: [
      { chapter: 1, verse: 1, text: "God, who at sundry times and in divers manners spake..." },
    ],
  },
  {
    key: "james",
    label: "James",
    testament: "new",
    difficulty: "beginner",
    description: "Practical wisdom for Christian living",
    popularVerses: [
      { chapter: 1, verse: 2, text: "My brethren, count it all joy when ye fall into divers temptations;" },
    ],
  },
  {
    key: "peter",
    label: "1 Peter",
    testament: "new",
    difficulty: "intermediate",
    description: "Hope and perseverance in suffering",
    popularVerses: [
      { chapter: 1, verse: 3, text: "Blessed be the God and Father of our Lord Jesus Christ..." },
    ],
  },
  {
    key: "revelation",
    label: "Revelation",
    testament: "new",
    difficulty: "advanced",
    description: "The unveiling of Jesus Christ and the end times",
    popularVerses: [
      { chapter: 1, verse: 1, text: "The Revelation of Jesus Christ, which God gave unto him..." },
    ],
  },
];
