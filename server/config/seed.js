const bcrypt = require('bcryptjs');

const wilayasData = [
  { code: 1,  name: "Adrar",              nameAr: "أدرار",         communes: ["Adrar","Aoulef","Timimoun","Reggane","Zaouiet Kounta","Aougrout","Tsabit","Tinerkouk","Fenoughil","Bouda","Charouine","Akabli","Metarfa","Sali","Ouled Said","Ouled Ahmed Timmi","Bordj Badji Mokhtar","In Zghmir","Timiaouine"] },
  { code: 2,  name: "Chlef",              nameAr: "الشلف",         communes: ["Chlef","Ténès","Benairia","El Karimia","Taougrite","Beni Haoua","Sobha","Harchoun","Ouled Fares","Sidi Abderrahmane","Moussadek","Beni Bouattab","El Hadjadj","Zeboudja","Oued Goussine","Djendel","Abou El Hassen","Chettia","Sidi Akkacha","Boukadir","Beni Rached","Talassa","Herenfa","Oued Sly","Oued Fodda","Labiod Medjadja","El Marsa"] },
  { code: 3,  name: "Laghouat",           nameAr: "الأغواط",       communes: ["Laghouat","Ksar El Hirane","Bennasser Ben Chohra","Sidi Makhlouf","Hassi Delaa","Hassi R'Mel","Ain Mahdi","Tadjemout","Aflou","Brida","El Ghicha","Oued Morra","Oued M'Zi","El Haouaita","Gueltat Sidi Saad","Ain Sidi Ali","Beidha","Taouiala"] },
  { code: 4,  name: "Oum El Bouaghi",     nameAr: "أم البواقي",    communes: ["Oum El Bouaghi","Ain Beida","Ain M'Lila","El Amiria","Souk Naamane","Ain Fakroun","Rahia","Bir Chouhada","Ksar Sbahi","Ouled Hamla","Dhalaa","Ain Zitoun","Fkirina","El Djazia","Behir Chergui","Ain Babouche","Hanchir Toumghani","Ain Kercha","El Harmilia"] },
  { code: 5,  name: "Batna",              nameAr: "باتنة",         communes: ["Batna","Ain Touta","Tazoult","N'Gaous","Barika","Merouana","Seriana","Menaa","El Madher","Timgad","Ain Djasser","Ouled Si Slimane","Ghassira","Ras El Aioun","Boumagueur","Bouzina","Chemora","Oued El Ma","Djezzar","Bitam","Taxlent","Ichmoul","Foum Toub","Boulhilat","Lazrou","Tkout","Arris","Oued Chaaba","Inoughissen","Ouyoun El Assafir","Djerma","Ain Yagout","Fesdis","Boulhaf Dyr","Tighanimine","Lemsane","Ksar Belezma","Seggana","El Hassi"] },
  { code: 6,  name: "Béjaïa",             nameAr: "بجاية",         communes: ["Béjaïa","Amizour","Feraoun","Taourirt Ighil","Chelata","Akbou","Ighram","Amalou","Ighil Ali","Fenaia Il Maten","Tizi N'Berber","Beni Maouche","Aokas","Tichy","Souk El Tenine","Melbou","Kendira","Tala Hamza","Barbacha","Beni Djellil","Adekar","Akfadou","Leflaye","Kherrata","Draa El Caïd","Tamokra","Semaoun","Oued Ghir","Boukhlifa","Taskriout","Tibane","Tifra","Ait Smaïl","Oued El Djemaa"] },
  { code: 7,  name: "Biskra",             nameAr: "بسكرة",         communes: ["Biskra","Oumache","Branis","Chetma","Ouled Djellal","Sidi Okba","Ain Naga","El Haouch","Zeribet El Oued","Besbes","M'Ziraa","Foughala","Bordj Ben Azzouz","El Kantara","Mchouneche","El Hadjeb","Lioua","Lichana","Outaya","Tolga","Bouchagroune","Ras El Miad","El Feidh","Chaiba","Doucen","El Ghrous","Ain Skhouna","Meziraa"] },
  { code: 8,  name: "Béchar",             nameAr: "بشار",          communes: ["Béchar","Beni Ounif","Boukais","Meridja","Lahmar","Igli","Mougheul","Erg Ferradj","Abadla","El Ouata","Beni Abbes","Tamtert","Kerzaz","Charouine"] },
  { code: 9,  name: "Blida",              nameAr: "البليدة",       communes: ["Blida","Ouled Yaich","Chrea","El Affroun","Chebli","Meftah","Beni Tamou","Bougara","Soumaa","Beni Mered","Bouarfa","Oued El Alleug","Ain Romana","Chiffa","Hammam Melouane","Ben Khellil","Bouinan","Oued Djer","Djebabra"] },
  { code: 10, name: "Bouira",             nameAr: "البويرة",       communes: ["Bouira","El Asnam","Ain Bessem","Bir Ghbalou","Mchedallah","Sour El Ghozlane","Haizer","Bechloul","Bordj Okhriss","Dirah","El Hachimia","Raouraoua","Chorfa","Ain El Hadjar","Boukram","Ridane","El Adjiba","El Khabouzia","Ait Laaziz","Taguedit","Ain Turk","Aghbalou","Zbarbar","Tikjda","Dechmia","Oued El Berdi","Guelt Zerka","Saharidj","Guerrouma"] },
  { code: 11, name: "Tamanrasset",        nameAr: "تمنراست",       communes: ["Tamanrasset","Abalessa","In Ghar","In Guezzam","Tazrouk","Ideles","Tin Zaouatine"] },
  { code: 12, name: "Tébessa",            nameAr: "تبسة",          communes: ["Tébessa","Cheria","Ain Zerga","Ouenza","El Maafer","Bir Mokadem","Safsaf El Ouesra","Bir El Ater","Bekkaria","Boukhadra","Ouled Moumen","Guorriguer","El Ogla","Thlidjen","Ain El Assel","Oum Ali","Ain El Arab","El Houidjbet","El Meridj","Ferkane","Negrine","Stah Guentis"] },
  { code: 13, name: "Tlemcen",            nameAr: "تلمسان",        communes: ["Tlemcen","Beni Mester","Amieur","Ain Tallout","Remchi","El Fehoul","Sabra","Ghazaouet","Souahlia","Ain Fezza","Ouled Mimoun","Chetouane","Mansourah","Beni Semiel","Ain Nehala","Hennaya","Maghnia","Hammam Boughrara","Nedroma","Beni Snous","El Aricha","Sidi Djilali","Bab El Assa","El Bouihi","Fellaoucene","Ain Fetah","Zenata"] },
  { code: 14, name: "Tiaret",             nameAr: "تيارت",         communes: ["Tiaret","Mehdia","Ain Dheb","Ain El Hadid","Madna","Medrissa","Sougueur","Ain Kermes","Ksar Chellala","Guertoufa","Sidi Bakhti","Hamadia","Dahmouni","Ain Bouchekif","Sebt","Meghila","Naima","Frenda","Mahia","Rahouia","Tousnina","Takhemaret","Zmalet El Emir","Chehaida","Oued Lilli","Mechraa Safa"] },
  { code: 15, name: "Tizi Ouzou",         nameAr: "تيزي وزو",      communes: ["Tizi Ouzou","Ain El Hammam","Akbil","Freha","Souama","Mechtrass","Irdjen","Tirmitine","Ait Chafaa","Beni Zmenzer","Iferhounene","Agouni Gueghrane","Ouacifs","Illilten","Beni Yenni","Tizi Gheniff","Assi Youcef","Bounouh","Ain Zaouia","M'Kira","Ait Yahia","Maatka","Ait Bouaddou","Bouzguene","Ouadhia","Tizi Rached","Draa Ben Khedda","Abi Youcef","Aghrib","Iflissen","Tigzirt","Draa El Mizan","Djebel Aissa Mimoun","Beni Douala","Mechtras","Beni Aissi","Ouaguenoun","Azeffoun","Akerrou","Timizart","Makouda","Sidi Naamane"] },
  { code: 16, name: "Alger",              nameAr: "الجزائر",       communes: ["Alger Centre","Sidi M'Hamed","El Madania","Belouizdad","Bab El Oued","Bologhine","Casbah","Oued Koriche","Birtouta","Tessala El Merdja","Ain Benian","Staoueli","Zeralda","Mahelma","Rahmania","Souidania","Cheraga","Ouled Fayet","El Achour","Draria","Baba Hassen","Khraicia","Saoula","Douera","Baraki","Larbaa","Meftah","Reghaia","Ain Taya","Bordj El Bahri","El Marsa","Heraoua","Rouiba","El Hamiz","Bab Ezzouar","Ben Aknoun","Dely Ibrahim","El Biar","Bouzareah","Birkhadem","Hydra","Mohammadia","Bordj El Kiffan","El Magharia","Oued Smar","Bachdjerrah","Hussein Dey","Kouba","Bourouba","El Harrach"] },
  { code: 17, name: "Djelfa",             nameAr: "الجلفة",        communes: ["Djelfa","Moudjebara","El Idrissia","Ain Maabed","Hassi Bahbah","Ain El Ibel","Faidh El Botma","Birine","Selmana","Charef","El Khenafis","Douis","Had Sahary","Dar Chioukh","Zaafrane","El Guedid","Deldoul","Beni Yacoub","M'liliha","Ain Chouhada","Oum Laadham","Zaccar","Sed Rahal","Boukhezana","Oued Morra","Guettara","Ain Feka"] },
  { code: 18, name: "Jijel",              nameAr: "جيجل",          communes: ["Jijel","El Aouana","Ziama Mansouriah","El Milia","El Ancer","Sidi Maarouf","Texenna","Djimla","Kaous","Settara","El Kennar","Ouled Yahia","Ghebala","Bouraoui Belhadef","Ouled Rabah","Chekfa","Emir Abdelkader","Taher","Selma Ben Ziada"] },
  { code: 19, name: "Sétif",              nameAr: "سطيف",          communes: ["Sétif","Ain El Kebira","Ain Arnat","Ain Azel","Ain Oulmene","Ain Roua","Amoucha","Beni Aziz","Beni Fouda","Beni Ourtilane","Bir El Arch","Bouandas","Dehamcha","El Eulma","Guidjel","Guellal","Hamma","El Ouricia","Ksar El Abtal","Ouled Addouane","Ouled Sabor","Ouled Tebane","Rasfa","Salah Bey","Serdj El Ghoul","Talaifacene","Taya","Bougaa","Babor","Draa Kebila","Maaouia","Mezloug","Ain Legradj","Bir Haddada","Guenzet"] },
  { code: 20, name: "Saïda",              nameAr: "سعيدة",         communes: ["Saïda","Ain El Hadjar","Ouled Brahim","Sidi Boubekeur","El Hassasna","Moulay Larbi","Youb","Doui Thabet","Sidi Ahmed","Ain Sekhouna","El Braria","Tircine"] },
  { code: 21, name: "Skikda",             nameAr: "سكيكدة",        communes: ["Skikda","Ben Azzouz","El Hadaiek","Hamadi Krouma","Ramdane Djamel","Azzaba","Tamalous","Collo","El Mharza","Ain Zouit","Beni Bechir","Kerkera","El Harrouch","Oued Zehour","Ain Kechra","Filfila","Sidi Mezghiche","Ouled Attia","Boumessoeur","Zerdazas","Emdjez Edchich"] },
  { code: 22, name: "Sidi Bel Abbès",    nameAr: "سيدي بلعباس",   communes: ["Sidi Bel Abbès","Tessala","Moulay Slissen","Ras El Ma","Tilmouni","Mezaourou","Ain Adden","Tenira","Sidi Chaib","Ain Thrid","Bedrabine El Mokrani","Oued Sebaa","Ben Badis","Ain El Berd","Sidi Khaled","Mostefa Ben Brahim","Oued Sfia","Marhoum","Merine","Lamtar","Tabia","Sidi Brahim","Hassi Zahana","Sidi Hamadouche","Boudjebha El Bordj","Zerouala"] },
  { code: 23, name: "Annaba",             nameAr: "عنابة",         communes: ["Annaba","El Bouni","El Hadjar","Eulma","Chetaïbi","Seraïdi","Ain Berda","Berrahal","Oued El Aneb","Cheurfa","Treat","Kherraza"] },
  { code: 24, name: "Guelma",             nameAr: "قالمة",         communes: ["Guelma","Bouchegouf","Nechmaya","Oued Zenati","Héliopolis","Hammam Maskhoutine","Ain Makhlouf","Ain Ben Beida","El Fedjoudj","Bouati Mahmoud","Medjez Amar","Ben Djarah","Ras El Agba","Tamlouka","Khezahra","Medjez Sfa","Dahouara","Ain Sandel","Djeballah Khemissi","Ain Larbi"] },
  { code: 25, name: "Constantine",        nameAr: "قسنطينة",       communes: ["Constantine","El Khroub","Ain Abid","Beni Hamidane","Didouche Mourad","Hamma Bouziane","Ibn Ziad","Messaoud Boudjriou","Ouled Rahmoune","Zighoud Youcef"] },
  { code: 26, name: "Médéa",              nameAr: "المدية",        communes: ["Médéa","Ain Boucif","Ouzera","Oum El Djillali","Beni Slimane","Mihoub","Ksar El Boukhari","Tablat","Seghouane","Bouchrahil","Berrouaghia","Ouled Antar","El Azizia","Ait Rached","Draa Essamar","Chellalet El Adhaoura","El Omaria","Ain Ouksir","Tafraout","El Hamdania","Sidi Damed","Mezghenna","Si Mahmoud","Saneg","Boghar","Ouled Maaref","Rebaia","Benchicao","Ain Dheb","Ain El Ksiba","El Guettar"] },
  { code: 27, name: "Mostaganem",         nameAr: "مستغانم",       communes: ["Mostaganem","Ain Nouissy","Ain Tedles","Stidia","Ain Boudinar","Khadra","Fornaka","El Hassiane","Sidi Ali","Achaacha","Mesra","Souaflia","Bouguirat","Sirat","Kheir Eddine","Hadjadj","Safsaf","Oued El Khalij","Ouled Maalah"] },
  { code: 28, name: "M'Sila",             nameAr: "المسيلة",       communes: ["M'Sila","Hammam Dalaa","Maadid","Ain El Melh","Khoubana","Chellal","Belaiba","Ain El Hadjel","Sid Aïssa","Berhoum","Ouled Mansour","Tarmount","Ouanougha","Sidi Ameur","Ain El Rich","Metarfa","El Houamed","El Hamel","Ain Fares","Djebel Messaad","Magra","Maarif","Souamaa","Ben Srour","Ouled Addi Guebala","Bou Saada","Ain Soltane","Bouti Sayah","Ouled Derradj","Oued Charef","Sidi Abdelaziz","Dehahna","Souadek"] },
  { code: 29, name: "Mascara",            nameAr: "معسكر",         communes: ["Mascara","Tizi","Ain Fares","Ras El Ain","Ain Ferah","Hachem","Ghriss","Mocta Douz","Bouhanifia","El Keurt","Maoussa","Oggaz","Sidi Kada","Ain Frass","Benian","El Bordj","Sidi Abdelmoumen","Froha","El Ghomri","Tighennif","El Mamounia","Nesmoth","Sidi Boussaid","Matemore","Khalouia","Ain Fekan","Aouf","Zahana","Ferraguig"] },
  { code: 30, name: "Ouargla",            nameAr: "ورقلة",         communes: ["Ouargla","Rouissat","N'Goussa","Ain Beida","El Hedjira","Sidi Khouiled","Hassi Messaoud","Hassi Ben Abdallah","Tebesbest","Blidet Amor","Touggourt","El Hadjira","Temacine","Nezla","Zaouia El Abidia","Megarine","M'Nagueur","El Borma","Sidi Slimane"] },
  { code: 31, name: "Oran",               nameAr: "وهران",         communes: ["Oran","Bir El Djir","Hassi Bounif","Arzew","Bethioua","Marsat El Hadjadj","Ain El Turk","El Ançor","Messerghine","El Braya","Hassi Ben Okba","Ben Freha","Bousfer","Tafraoui","Senia","Oued Tlelat","Es Senia","Ain El Kerma","Boufatis","Gdyel"] },
  { code: 32, name: "El Bayadh",          nameAr: "البيض",         communes: ["El Bayadh","Stitten","El Abiodh Sidi Cheikh","Ain El Orak","Rogassa","Sidi Ameur","Ghassoul","El Bnoud","Cheguig","Kef El Ahmar","Boussemghoun","Brezina","El Mehara","Boualem","Oulad Khoudir","Tousmouline","Sidi Tifour","Arbaout"] },
  { code: 33, name: "Illizi",             nameAr: "إليزي",         communes: ["Illizi","Djanet","In Amenas","Bordj Omar Driss"] },
  { code: 34, name: "Bordj Bou Arréridj", nameAr: "برج بوعريريج",  communes: ["Bordj Bou Arréridj","Ras El Oued","El Main","Medjana","Bordj Zemoura","Mansourah","Djaafra","Bir Kasdali","El Hamadia","Tixter","Ain Taghrout","El Achir","Colla","Tassameurt","Belimour","Ouled Dahmane","Ouled Sidi Brahim","Rabta","Aïn Tesra","Hasnaoua","Khelil"] },
  { code: 35, name: "Boumerdès",          nameAr: "بومرداس",       communes: ["Boumerdès","Boudouaou","Ouled Moussa","Isser","Bordj Menaiel","Baghlia","Souk El Had","Taourga","Si Mustapha","Naciria","Djinet","Ammal","Zemmouri","Tidjelabine","Thenia","Chabat","Ouled Aissa","Hammedi","Khemis El Khechna","Bouzegza Keddara","Attatba","Chabet El Ameur","Berber","Ben Choud","Dellys","Afir"] },
  { code: 36, name: "El Tarf",            nameAr: "الطارف",        communes: ["El Tarf","El Kala","Besbes","Dréan","Ben M'Hidi","Zerizer","Berrihane","El Ayoun","Ain El Assel","Bouteldja","Chefia","Raml Souk","Lac Des Oiseaux","Ain Kerma","Chihani","Ouled Zouai","Oum Teboul","Hammam Beni Salah","Souarekh"] },
  { code: 37, name: "Tindouf",            nameAr: "تندوف",         communes: ["Tindouf","Oum El Assel"] },
  { code: 38, name: "Tissemsilt",         nameAr: "تيسمسيلت",      communes: ["Tissemsilt","Theniet El Had","Lardjem","Lazharia","Bordj Bou Naama","Sidi Lantri","Khemisti","Beni Chaib","Sidi Boutouchent","Ouled Bessem","Layoune","Youssoufia","Melaab","Boucaid"] },
  { code: 39, name: "El Oued",            nameAr: "الوادي",        communes: ["El Oued","Robbah","Oued El Alenda","Bayadha","Nakhla","Guemar","Kouinine","Trifaoui","Magrane","Beni Guecha","Ourmas","Taleb Larbi","Douar El Ma","El Ogla","Hassani Abdelkrim","Hamraia","Taghzout","Debila","Sidi Aoun","Mihoub"] },
  { code: 40, name: "Khenchela",          nameAr: "خنشلة",         communes: ["Khenchela","Babar","Ain Touila","Bouhmama","M'Sara","El Hamma","Djellal","Remila","Chenaoura","Tamza","Taouziant","Yabous","El Oueldja","Ensigha","Kais"] },
  { code: 41, name: "Souk Ahras",         nameAr: "سوق أهراس",     communes: ["Souk Ahras","Sedrata","Mechroha","Tiffech","Bir Bou Haouch","Oum El Adhaim","Merahna","Khedara","Sidi Fredj","Ain Zana","Safel","Oued Mellah","Drea","Ain Soltane","Ouled Moumene","Terraguelt","Ain Bara","Oued Keberit","Haddada"] },
  { code: 42, name: "Tipasa",             nameAr: "تيبازة",        communes: ["Tipasa","Hadjout","Ain Tagourait","Meurad","Bou Ismail","Ahmer El Ain","Kolea","Fouka","Bou Haroun","Cherchell","Damous","Gouraya","Nador","Larhat","Menaceur","Sidi Amar","Sidi Ghiles","Messelmoun","Sidi Semiane","Bourkika","Khemisti","Agha","Attatba"] },
  { code: 43, name: "Mila",               nameAr: "ميلة",          communes: ["Mila","Ferdjioua","Chelghoum Laid","Grarem Gouga","Ain Beida Harriche","Oued Endja","Telerghma","Ain Tine","Rouached","Tadjenanet","El Mechira","Oued Seguen","Hamala","Benyahia Abderrahmane","Ain Mellouk","Ouled Khalouf","Sidi Merouane","Chigara","Derradji Bousselah","Ahmed Rachedi","Tessala Lemtai","Zeghaia"] },
  { code: 44, name: "Aïn Defla",          nameAr: "عين الدفلى",    communes: ["Aïn Defla","El Attaf","Ain Benian","Bordj Emir Khaled","Djendel","Ain Soltane","El Abadia","Djelida","El Hassania","Hammam Righa","Miliana","Aïn Torki","Ben Allal","Boumedfaa","Tiberkanine","Rouina","Ain Lechiekh","Hoceinia","Khemis Miliana","Oued El Djemaa"] },
  { code: 45, name: "Naâma",              nameAr: "النعامة",       communes: ["Naâma","Mecheria","Ain Sefra","Tiout","Sfissifa","Moghrar","Assela","Djeniene Bourezg","El Biod","Kasdir","El Kheither"] },
  { code: 46, name: "Aïn Témouchent",     nameAr: "عين تيموشنت",   communes: ["Aïn Témouchent","Ain El Arbaa","Ain Kihal","Oulhaça El Gheraba","Beni Saf","El Amria","Hassasna","El Malah","El Emir Abdelkader","Sidi Ben Adda","Mesra","Aoubellil","Terga","Aghlal","Chaabat El Leham","Oued Berkeche","Sid El Abed","El Ourdania","Sidi Ouriache"] },
  { code: 47, name: "Ghardaïa",           nameAr: "غرداية",        communes: ["Ghardaïa","Noumerate","El Guerrara","Berrian","Metlili","Sebseb","Mansoura","Zelfana","El Atteuf","Bounoura","Daya Ben Dahoua"] },
  { code: 48, name: "Relizane",           nameAr: "غليزان",        communes: ["Relizane","Djidiouia","Ramka","El Hassi","Mazouna","Sidi M'Hamed Ben Ali","Ain Tarek","Ouled Aiche","Beni Dergoun","Ammi Moussa","Sidi Khettab","El Matmar","Mendes","Ain El Djasser","Had Echkalla","Lahlef","Bendaoud","Oued Essalem","Kalaa","Belaassel Bouzegza","El Ouldja","Sidi Abd El Djabar"] },
  { code: 49, name: "Timimoun",           nameAr: "تيميمون",       communes: ["Timimoun","Ouled Said","Aougrout","Charouine","Deldoul","Ouled Aissa"] },
  { code: 50, name: "Bordj Badji Mokhtar",nameAr: "برج باجي مختار",communes: ["Bordj Badji Mokhtar","Timiaouine"] },
  { code: 51, name: "Ouled Djellal",      nameAr: "أولاد جلال",    communes: ["Ouled Djellal","Doucen","Ras El Miad"] },
  { code: 52, name: "Béni Abbès",         nameAr: "بني عباس",      communes: ["Béni Abbès","Kerzaz","Charouine","Ksabi"] },
  { code: 53, name: "In Salah",           nameAr: "عين صالح",      communes: ["In Salah","Foggaret El Zoua","In Ghar"] },
  { code: 54, name: "In Guezzam",         nameAr: "عين قزام",      communes: ["In Guezzam","Tin Zaouatine"] },
  { code: 55, name: "Touggourt",          nameAr: "تقرت",          communes: ["Touggourt","Tebesbest","Nezla","Zaouia El Abidia","Megarine","Mnagueur"] },
  { code: 56, name: "Djanet",             nameAr: "جانت",          communes: ["Djanet","Bordj El Haouasse"] },
  { code: 57, name: "El M'Ghair",         nameAr: "المغير",        communes: ["El M'Ghair","Djamaa","Sidi Khellil","Oued Allenda","Bayadha","Kouinine"] },
  { code: 58, name: "El Meniaa",          nameAr: "المنيعة",            communes: ["El Meniaa","Hassi Gara","Berriane"] },
  { code: 59, name: "Aflou",              nameAr: "أفلو",               communes: ["Aflou","El Ghicha","Brida","Sebgag","Hassi Delaa"] },
  { code: 60, name: "Barika",             nameAr: "بريكة",              communes: ["Barika","Bitam","N'Gaous","Djezzar","Taxenna"] },
  { code: 61, name: "El Kantara",         nameAr: "القنطرة",            communes: ["El Kantara","Aïn Zaatout","Foum Toub","El Outaya"] },
  { code: 62, name: "Bir El Ater",        nameAr: "بئر العاتر",         communes: ["Bir El Ater","El Kouif","El Aouinet","Safsaf El Ouesra"] },
  { code: 63, name: "El Aricha",          nameAr: "العريشة",            communes: ["El Aricha","Moghrar","Mecheria","Naâma"] },
  { code: 64, name: "Ksar Chellala",      nameAr: "قصر الشلالة",        communes: ["Ksar Chellala","Sougueur","Rechaiga","Djelfa"] },
  { code: 65, name: "Aïn Oussara",        nameAr: "عين وسارة",          communes: ["Aïn Oussara","Hassi Bahbah","Zmalet El Emir Abdelkader","Gueltat Sidi Saâd"] },
  { code: 66, name: "Messaad",            nameAr: "مسعد",               communes: ["Messaad","El Idrissia","Hassi El Euch","Sidi Makhlouf"] },
  { code: 67, name: "Ksar El Boukhari",   nameAr: "قصر البخاري",        communes: ["Ksar El Boukhari","Berrouaghia","Chahbounia","Médéa"] },
  { code: 68, name: "Bou Saâda",          nameAr: "بوسعادة",            communes: ["Bou Saâda","Aïn El Melh","Sidi Aïssa","Ouled Sidi Brahim","Slim"] },
  { code: 69, name: "El Abiodh Sidi Cheikh", nameAr: "الأبيض سيدي الشيخ", communes: ["El Abiodh Sidi Cheikh","Moghrar","Brezina","Boussemghoun"] },
];

const seedDatabase = async () => {
  try {
    const Admin    = require('../models/Admin');
    const { Wilaya, Commune } = require('../models/Wilaya');
    const { Product, Variant, Size } = require('../models/Product');

    // ── Admin ──────────────────────────────────────────
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@edge.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      });
      console.log('✅ Admin account created');
    }

    // ── Wilayas + Communes ─────────────────────────────
    const wilayaCount = await Wilaya.count();
    if (wilayaCount === 0) {
      // Fresh install: seed all 69 wilayas
      for (const w of wilayasData) {
        const wilaya = await Wilaya.create({
          code: w.code,
          name: w.name,
          nameAr: w.nameAr,
          livraisonDomicile: 400,
          livraisonBureau: 300,
        });
        await Commune.bulkCreate(
          w.communes.map(c => ({ name: c, wilayaId: wilaya.id }))
        );
      }
      console.log(`✅ 69 Wilayas + communes seeded`);
    } else {
      // Existing DB: add any missing wilayas (codes 59-69)
      let added = 0;
      for (const w of wilayasData) {
        const exists = await Wilaya.findOne({ where: { code: w.code } });
        if (!exists) {
          const wilaya = await Wilaya.create({
            code: w.code,
            name: w.name,
            nameAr: w.nameAr,
            livraisonDomicile: 400,
            livraisonBureau: 300,
          });
          await Commune.bulkCreate(
            w.communes.map(c => ({ name: c, wilayaId: wilaya.id }))
          );
          added++;
        }
      }
      if (added > 0) console.log(`✅ Added ${added} missing wilaya(s) to existing database`);
    }

    // ── Sample Product ─────────────────────────────────
    const productCount = await Product.count();
    if (productCount === 0) {
      const product = await Product.create({
        name: 'EDGE Raglan Performance Tee',
        description: 'High-performance raglan t-shirt with moisture-wicking fabric. Perfect for training and everyday wear.',
        price: 2500,
        category: 'T-Shirt',
        isActive: true,
      });

      const colorVariants = [
        { color: 'Navy/White',  colorHex: '#0a1628' },
        { color: 'Black/White', colorHex: '#111111' },
        { color: 'White/Navy',  colorHex: '#ffffff' },
      ];
      const sizes = ['XS','S','M','L','XL','XXL'];

      for (const cv of colorVariants) {
        const variant = await Variant.create({
          productId: product.id,
          color: cv.color,
          colorHex: cv.colorHex,
          images: [],
        });
        await Size.bulkCreate(
          sizes.map(s => ({ variantId: variant.id, size: s, stock: 15 }))
        );
      }
      console.log('✅ Sample product seeded');
    }
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
};

module.exports = seedDatabase;
