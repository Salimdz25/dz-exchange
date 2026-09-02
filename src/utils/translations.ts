export type Language = 'fr' | 'ar';

export interface Translations {
  // Brand & Slogan
  appName: string;
  appSubtitle: string;
  threePillarsBadge: string;
  liveBadge: string;
  square100Eur: string;
  square100Usd: string;
  usdtP2p: string;
  wiseEur: string;
  parallelGap: string;
  lastUpdated: string;
  dailyUpdate: string;

  // Nav Actions
  btnDetailedView: string;
  btnSimpleView: string;
  btnAlerts: string;
  btnSimulator: string;
  btnBulletin: string;
  btnRefresh: string;
  switchLangTitle: string;

  // 3 Pillars
  pillar1Badge: string;
  pillar1Title: string;
  pillar1Subtitle: string;
  pillar1HandToHand: string;
  pillar2Badge: string;
  pillar2Title: string;
  pillar2Subtitle: string;
  pillar2BaridiMobInfo: string;
  pillar2AliExpressInfo: string;
  pillar3Badge: string;
  pillar3Title: string;
  pillar3Subtitle: string;
  pillar3BankNotice: string;
  pillar3BankDesc: string;
  pillar3DailyFixing: string;
  pillar3BankCounters: string;
  squareGap: string;
  btnCalculate: string;
  buyLabel: string;
  sellLabel: string;
  rechargeLabel: string;
  clientBuyLabel: string;
  clientSellLabel: string;

  // Multi Market Converter
  converterTitle: string;
  converterSubtitle: string;
  dirForeignToDzd: string;
  dirDzdToForeign: string;
  labelAmount: string;
  labelChooseCurrency: string;
  labelSelected: string;
  labelBaridiMobFee: string;
  labelBaridiMobFeeDesc: string;
  labelReverseQuote: string;
  resSquareTitle: string;
  resSquareBadge: string;
  resBankTitle: string;
  resBankBadge: string;
  resVirtualTitle: string;
  resVirtualBadge: string;
  valInDinars: string;
  amountObtained: string;
  valAtBank: string;
  valOfficialTheory: string;
  valBaridiMobRecharge: string;
  valDigitalNet: string;
  rateApplied: string;
  rateOfficialMid: string;
  gapWithSquare: string;
  btnCopyResult: string;
  copiedText: string;
  centimesEquiv: string;

  // Toggle More Details
  moreDetailsTitle: string;
  moreDetailsDesc: string;
  fullModeActiveTitle: string;
  fullModeActiveDesc: string;
  btnShowDetails: string;
  btnHideDetails: string;

  // Alerts Modal & Banner
  alertsModalTitle: string;
  alertsModalSubtitle: string;
  tabMyAlerts: string;
  tabCreateAlert: string;
  alertStep1: string;
  alertStep2: string;
  alertStep3: string;
  alertStep4: string;
  alertStep5: string;
  alertMarketSquare: string;
  alertMarketVirtual: string;
  alertMarketOfficial: string;
  alertCurrentRate: string;
  alertCondAbove: string;
  alertCondBelow: string;
  alertTargetRatePlaceholder: string;
  alertShortcuts: string;
  alertNotePlaceholder: string;
  alertBtnSubmit: string;
  alertEmptyTitle: string;
  alertEmptyDesc: string;
  alertBtnCreateFirst: string;
  alertTriggeredBadge: string;
  alertConditionLabel: string;
  alertTestBtn: string;
  alertGoalReached: string;
  alertRemaining: string;
  alertSoundOn: string;
  alertSoundOff: string;
  alertFooterNotice: string;
  alertLocalPersistence: string;
  alertBannerHitTitle: string;
  alertBannerHitDesc: string;
  alertBannerManageBtn: string;

  // Share Bulletin Modal
  bulletinModalTitle: string;
  bulletinModalSubtitle: string;
  bulletinPreviewLabel: string;
  bulletinCopyBtn: string;
  bulletinCopiedBtn: string;
  bulletinShareWhatsapp: string;
  bulletinShareTelegram: string;

  // Detailed Tables & Charts
  ratesTableTitle: string;
  ratesTableSubtitle: string;
  colCurrency: string;
  colCountry: string;
  colParallelBuy: string;
  colParallelSell: string;
  colOfficialMid: string;
  colGap: string;
  colActions: string;
  chartTitle: string;
  chartSubtitle: string;
  chart30Days: string;
  chart90Days: string;
  chart1Year: string;
  chartLegendParallelEur: string;
  chartLegendOfficialEur: string;
  chartLegendVirtualWise: string;
  chartLegendUsdt: string;
  virtualSectionTitle: string;
  virtualSectionSubtitle: string;
  regionalSectionTitle: string;
  regionalSectionSubtitle: string;
  insightsSectionTitle: string;
  insightsSectionSubtitle: string;

  // Footer & Notices
  footerDisclaimer: string;
  footerRights: string;

  // Regional Markets
  cityAlger: string;
  locAlger: string;
  cityOran: string;
  locOran: string;
  cityConstantine: string;
  locConstantine: string;
  citySetif: string;
  locSetif: string;
  cityAnnaba: string;
  locAnnaba: string;
  cityTiziOuzou: string;
  locTiziOuzou: string;
  cityBejaia: string;
  locBejaia: string;
  cityBatna: string;
  locBatna: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: 'DZ EXCHANGE',
    appSubtitle: 'Square Port-Saïd • Devises Virtuelles BaridiMob • Banque d\'Algérie',
    threePillarsBadge: '3 Piliers du Marché',
    liveBadge: 'En Direct :',
    square100Eur: 'Square 100€ :',
    square100Usd: 'Square 100$ :',
    usdtP2p: 'USDT (P2P) :',
    wiseEur: 'Wise Euro :',
    parallelGap: 'Écart Parallèle :',
    lastUpdated: 'Mise à jour :',
    dailyUpdate: 'Quotidienne',

    btnDetailedView: 'Vue Détaillée',
    btnSimpleView: 'Vue Simplifiée',
    btnAlerts: 'Alertes',
    btnSimulator: 'Simulateur',
    btnBulletin: 'Bulletin',
    btnRefresh: 'Actualiser',
    switchLangTitle: 'Changer vers l\'Arabe',

    pillar1Badge: 'Pilier 1 : Espèces',
    pillar1Title: 'Square Port-Saïd',
    pillar1Subtitle: 'Marché Parallèle / Informel',
    pillar1HandToHand: 'Échange physique de main à main',
    pillar2Badge: 'Pilier 2 : BaridiMob / P2P',
    pillar2Title: 'Euro & Dollar Digital',
    pillar2Subtitle: 'Soldes Wise, Paysera & USDT',
    pillar2BaridiMobInfo: 'Transfert instantané P2P',
    pillar2AliExpressInfo: 'Idéal pour AliExpress & Publicité Ads',
    pillar3Badge: 'Pilier 3 : Bancaire',
    pillar3Title: 'Banque d\'Algérie',
    pillar3Subtitle: 'Marché Officiel / Interbancaire',
    pillar3BankNotice: 'Allocation voyage & Commerce',
    pillar3BankDesc: 'Allocation touristique réglementée (750 € par an via carte bancaire), scolarité & crédits documentaires (LC).',
    pillar3DailyFixing: 'Fixing officiel quotidien',
    pillar3BankCounters: 'Guichets bancaires',
    squareGap: 'Écart Square :',
    btnCalculate: 'Calculer',
    buyLabel: 'Achat :',
    sellLabel: 'Vente :',
    rechargeLabel: 'Recharge Achat :',
    clientBuyLabel: 'Achat Client :',
    clientSellLabel: 'Vente Client :',

    converterTitle: 'Convertisseur & Simulateur Multi-Marchés',
    converterSubtitle: 'Comparez instantanément la valeur de vos devises sur le Square Port-Saïd, la Banque d\'Algérie et en Devises Virtuelles (BaridiMob / P2P).',
    dirForeignToDzd: 'Je possède des devises (Ex: 100 €) → Obtenir des Dinars (DA)',
    dirDzdToForeign: 'Je possède des Dinars (Ex: 100 000 DA) → Acheter des devises',
    labelAmount: 'Montant à convertir :',
    labelChooseCurrency: 'Choisir le Pays & la Devise',
    labelSelected: 'Sélectionné :',
    labelBaridiMobFee: 'Inclure les frais de virement BaridiMob / CCP',
    labelBaridiMobFeeDesc: 'Estimation officielle des frais postaux',
    labelReverseQuote: 'Calcul inversé : combien de Dinars vous coûte cet achat de devises.',
    resSquareTitle: 'Square Port-Saïd',
    resSquareBadge: 'Taux Réel Espèces',
    resBankTitle: 'Banque d\'Algérie',
    resBankBadge: 'Officiel',
    resVirtualTitle: 'Wise / Paysera / Digital',
    resVirtualBadge: 'Taux Numérique',
    valInDinars: 'Valeur en Dinars (Vente au cambiste) :',
    amountObtained: 'Montant obtenu en devises :',
    valAtBank: 'Valeur au guichet bancaire :',
    valOfficialTheory: 'Montant théorique officiel :',
    valBaridiMobRecharge: 'Valeur Euro/USD Digital :',
    valDigitalNet: 'Montant net reçu (Wise/USDT) :',
    rateApplied: 'Cours appliqué :',
    rateOfficialMid: 'Cours officiel moyen :',
    gapWithSquare: 'Différence avec le Square :',
    btnCopyResult: 'Copier ce calcul',
    copiedText: 'Copié !',
    centimesEquiv: 'Équivalent en Centimes :',

    moreDetailsTitle: 'Envie d\'explorer plus de détails ?',
    moreDetailsDesc: 'Tableaux de cotations complètes (13 devises), graphiques d\'évolution, bourses régionales par wilaya et guides.',
    fullModeActiveTitle: 'Mode Vue Complète Activé',
    fullModeActiveDesc: 'Toutes les données approfondies du marché algérien sont affichées ci-dessous.',
    btnShowDetails: 'Afficher tous les détails',
    btnHideDetails: 'Masquer les détails',

    alertsModalTitle: 'Alertes & Notifications de Taux',
    alertsModalSubtitle: 'Alerte visuelle dès qu\'un cours atteint votre seuil cible en Dinars (DZD)',
    tabMyAlerts: 'Mes Alertes',
    tabCreateAlert: 'Créer une Alerte',
    alertStep1: '1. Choisir le Pays & la Devise',
    alertStep2: '2. Marché de référence',
    alertStep3: '3. Condition de déclenchement',
    alertStep4: '4. Seuil Cible (en Dinars Algériens - DA)',
    alertStep5: '5. Note personnelle (facultatif)',
    alertMarketSquare: 'Square Port-Saïd',
    alertMarketVirtual: 'Virtuel / P2P',
    alertMarketOfficial: 'Banque Officiel',
    alertCurrentRate: 'Cours actuel :',
    alertCondAbove: 'Supérieur ou Égal (≥ Hausse)',
    alertCondBelow: 'Inférieur ou Égal (≤ Baisse)',
    alertTargetRatePlaceholder: 'Ex: 255.0',
    alertShortcuts: 'Raccourcis :',
    alertNotePlaceholder: 'Ex: Acheter pour voyage Espagne, Vendre solde Wise...',
    alertBtnSubmit: 'Enregistrer cette Alerte de Taux',
    alertEmptyTitle: 'Aucune alerte active',
    alertEmptyDesc: 'Définissez un seuil cible (ex: 🇪🇺 100€ à 25 300 DA ou 🪙 USDT à 242 DA) pour être prévenu dès que le marché l\'atteint.',
    alertBtnCreateFirst: 'Créer ma 1ère alerte',
    alertTriggeredBadge: 'OBJECTIF ATTEINT !',
    alertConditionLabel: 'Condition :',
    alertTestBtn: 'Tester l\'alerte',
    alertGoalReached: 'Objectif validé ✅',
    alertRemaining: 'restant',
    alertSoundOn: 'Désactiver le signal sonore',
    alertSoundOff: 'Activer le signal sonore',
    alertFooterNotice: 'Vérification automatique lors de chaque actualisation',
    alertLocalPersistence: 'Persistance Locale',
    alertBannerHitTitle: 'Alerte Seuil Atteinte !',
    alertBannerHitDesc: 'Le cours a atteint votre objectif de',
    alertBannerManageBtn: 'Gérer les alertes',

    bulletinModalTitle: 'Bulletin Quotidien des Taux',
    bulletinModalSubtitle: 'Format prêt à partager sur WhatsApp, Telegram & Réseaux Sociaux',
    bulletinPreviewLabel: 'Aperçu du bulletin :',
    bulletinCopyBtn: 'Copier le texte du bulletin',
    bulletinCopiedBtn: 'Bulletin copié !',
    bulletinShareWhatsapp: 'Partager sur WhatsApp',
    bulletinShareTelegram: 'Partager sur Telegram',

    ratesTableTitle: 'Tableau Comparatif Complet des Devises',
    ratesTableSubtitle: 'Comparaison des 13 principales devises étrangères : Square Port-Saïd vs Banque d\'Algérie.',
    colCurrency: 'Devise & Pays',
    colCountry: 'Pays',
    colParallelBuy: 'Square Achat',
    colParallelSell: 'Square Vente (Client)',
    colOfficialMid: 'Banque d\'Algérie',
    colGap: 'Écart (%)',
    colActions: 'Action',
    chartTitle: 'Historique & Évolution des Cours (DZD)',
    chartSubtitle: 'Analyse comparative de l\'Euro, Dollar US, USDT et Wise face au Dinar Algérien.',
    chart30Days: '30 Jours',
    chart90Days: '90 Jours',
    chart1Year: '1 An',
    chartLegendParallelEur: 'Euro Square (Marché Noir)',
    chartLegendOfficialEur: 'Euro Banque d\'Algérie (Officiel)',
    chartLegendVirtualWise: 'Wise Euro (Solde Digital)',
    chartLegendUsdt: 'USDT Tether (Binance P2P)',
    virtualSectionTitle: 'Devises Virtuelles, Néobanques & Crypto P2P',
    virtualSectionSubtitle: 'Recharge de comptes en Dinars Algériens via BaridiMob, CCP et plateformes sécurisées.',
    regionalSectionTitle: 'Bourses Régionales du Marché Parallèle par Wilaya',
    regionalSectionSubtitle: 'Variations et cours constatés sur les principales places de change en Algérie.',
    insightsSectionTitle: 'Analyses & Facteurs d\'Influence du Marché',
    insightsSectionSubtitle: 'Comprendre les tendances, l\'offre, la demande et les actualités économiques.',

    footerDisclaimer: 'Avertissement : Les cours du marché parallèle (Square Port-Saïd) et des devises virtuelles sont donnés à titre indicatif selon les moyennes constatées sur les places d\'échange et plateformes P2P.',
    footerRights: 'DinarDZ Exchange Tracker • Algérie • Taux de Change Temps Réel',

    cityAlger: 'Alger',
    locAlger: 'Square Port-Saïd & Rue Abane Ramdane',
    cityOran: 'Oran',
    locOran: 'Mdina Jdida & Rue Larbi Ben M\'hidi',
    cityConstantine: 'Constantine',
    locConstantine: 'Souk El Asser & Souk Dubaï',
    citySetif: 'Sétif',
    locSetif: 'El Eulma (Bourse Dubaï & Commerce Gros)',
    cityAnnaba: 'Annaba',
    locAnnaba: 'Cours de la Révolution',
    cityTiziOuzou: 'Tizi Ouzou',
    locTiziOuzou: 'Boulevard Stiti & Centre Ville',
    cityBejaia: 'Béjaïa',
    locBejaia: 'Place du 1er Novembre',
    cityBatna: 'Batna',
    locBatna: 'Aures Market',
  },
  ar: {
    appName: 'ديزاد إكسشينج DZ EXCHANGE',
    appSubtitle: 'سكوار بورسعيد • العملات الرقمية وبريدي موب • بنك الجزائر الرسمي',
    threePillarsBadge: 'الركائز الـ 3 لسوق الصرف',
    liveBadge: 'مباشر الآن :',
    square100Eur: 'السكوار 100€ :',
    square100Usd: 'السكوار 100$ :',
    usdtP2p: 'USDT (رقمي) :',
    wiseEur: 'وايز Wise يورو :',
    parallelGap: 'الفارق الموازي :',
    lastUpdated: 'آخر تحديث :',
    dailyUpdate: 'يومي',

    btnDetailedView: 'عرض مفصل',
    btnSimpleView: 'عرض مبسط',
    btnAlerts: 'التنبيهات',
    btnSimulator: 'محاكي التحويل',
    btnBulletin: 'نشرة الأسعار',
    btnRefresh: 'تحديث الأسعار',
    switchLangTitle: 'Passer en Français',

    pillar1Badge: 'الركيزة 1 : نقد كاش',
    pillar1Title: 'سكوار بورسعيد',
    pillar1Subtitle: 'السوق الموازي / غير الرسمي (كاش)',
    pillar1HandToHand: 'تبادل يد بيد بالعملة النقدية',
    pillar2Badge: 'الركيزة 2 : بريدي موب / P2P',
    pillar2Title: 'يورو ودولار رقمي',
    pillar2Subtitle: 'رصيد وايز، بايسيرا و USDT',
    pillar2BaridiMobInfo: 'تحويل فوري بين الحسابات',
    pillar2AliExpressInfo: 'مثالي للشراء من الإنترنت والإعلانات',
    pillar3Badge: 'الركيزة 3 : بنكي رسمي',
    pillar3Title: 'بنك الجزائر',
    pillar3Subtitle: 'السعر الرسمي / بين البنوك',
    pillar3BankNotice: 'منحة السفر والتجارة الخارجية',
    pillar3BankDesc: 'منحة السفر السياحية المنظمة (750 يورو سنوياً عبر البطاقة البنكية)، الدراسة في الخارج والاعتمادات المستندية.',
    pillar3DailyFixing: 'التسعيرة اليومية الرسمية',
    pillar3BankCounters: 'الشبابيك البنكية',
    squareGap: 'فارق السكوار :',
    btnCalculate: 'تحويل',
    buyLabel: 'شراء (من الزبون) :',
    sellLabel: 'بيع (للزبون) :',
    rechargeLabel: 'شحن رصيد :',
    clientBuyLabel: 'شراء الزبون :',
    clientSellLabel: 'بيع الزبون :',

    converterTitle: 'محاكي وتحويل العملات عبر كافة الأسواق',
    converterSubtitle: 'قارن فوراً قيمة أموالك بين سكوار بورسعيد، البنوك الرسمية والعملات الرقمية (بريدي موب / P2P).',
    dirForeignToDzd: 'أملك عملة أجنبية (مثلاً: 100 €) ← تحويل إلى دينار جزائري (DA)',
    dirDzdToForeign: 'أملك دينار جزائري (مثلاً: 100,000 دج) ← شراء عملة أجنبية',
    labelAmount: 'المبلغ المراد تحويله :',
    labelChooseCurrency: 'اختر الدولة والعملة',
    labelSelected: 'العملة المحددة :',
    labelBaridiMobFee: 'احتساب عمولة التحويل عبر بريدي موب / CCP',
    labelBaridiMobFeeDesc: 'تقدير رسمي لرسوم بريد الجزائر',
    labelReverseQuote: 'حساب عكسي: تكلفة شراء العملة الأجنبية بالدينار الجزائري.',
    resSquareTitle: 'سكوار بورسعيد',
    resSquareBadge: 'سعر الكاش الحقيقي',
    resBankTitle: 'بنك الجزائر',
    resBankBadge: 'رسمي',
    resVirtualTitle: 'وايز / بايسيرا / رقمي',
    resVirtualBadge: 'سعر الرصيد الرقمي',
    valInDinars: 'القيمة بالدينار (البيع للصراف) :',
    amountObtained: 'المبلغ المحصل بالعملة الأجنبية :',
    valAtBank: 'القيمة لدى البنك الرسمي :',
    valOfficialTheory: 'المبلغ النظري الرسمي :',
    valBaridiMobRecharge: 'قيمة اليورو/الدولار الرقمي :',
    valDigitalNet: 'الرصيد الصافي المستلم (وايز/USDT) :',
    rateApplied: 'سعر الصرف المعتمد :',
    rateOfficialMid: 'سعر الصرف البنكي الوسطي :',
    gapWithSquare: 'الفارق مقارنة بالسكوار :',
    btnCopyResult: 'نسخ نتيجة التحويل',
    copiedText: 'تم النسخ بنجاح !',
    centimesEquiv: 'المعادل بالسنتيم الجزائري :',

    moreDetailsTitle: 'هل ترغب في استكشاف تفاصيل إضافية ؟',
    moreDetailsDesc: 'جداول كاملة لـ 13 عملة، رسوم بيانية، بورصات الولايات وتحليلات السوق.',
    fullModeActiveTitle: 'وضع العرض الكامل مفعل',
    fullModeActiveDesc: 'جميع البيانات المعمقة لسوق الصرف الجزائري معروضة بالأسفل.',
    btnShowDetails: 'إظهار كافة التفاصيل',
    btnHideDetails: 'إخفاء التفاصيل',

    alertsModalTitle: 'تنبيهات وإشعارات أسعار الصرف',
    alertsModalSubtitle: 'تنبيه فوري عند وصول العملة إلى السعر المستهدف بالدينار الجزائري (DZD)',
    tabMyAlerts: 'تنبيهاتي النشطة',
    tabCreateAlert: 'إنشاء تنبيه جديد',
    alertStep1: '1. اختر الدولة والعملة',
    alertStep2: '2. سوق الصرف المرجعي',
    alertStep3: '3. شرط التنبيه',
    alertStep4: '4. السعر المستهدف (بالدينار الجزائري - DA)',
    alertStep5: '5. ملاحظة شخصية (اختياري)',
    alertMarketSquare: 'سكوار بورسعيد',
    alertMarketVirtual: 'رقمي / بريدي موب',
    alertMarketOfficial: 'البنك الرسمي',
    alertCurrentRate: 'السعر الحالي :',
    alertCondAbove: 'أعلى أو يساوي (≥ في حالة الارتفاع)',
    alertCondBelow: 'أدنى أو يساوي (≤ في حالة الانخفاض)',
    alertTargetRatePlaceholder: 'مثال: 255.0',
    alertShortcuts: 'أزرار سريعة :',
    alertNotePlaceholder: 'مثال: شراء لرحلة سياحية، بيع رصيد وايز...',
    alertBtnSubmit: 'حفظ تنبيه سعر الصرف',
    alertEmptyTitle: 'لا توجد تنبيهات حالياً',
    alertEmptyDesc: 'حدد سعراً مستهدفاً (مثلاً: 🇪🇺 100 يورو عند 25,300 دج أو 🪙 USDT عند 242 دج) لتصلك إشارة فور بلوغ السوق لهذا الحد.',
    alertBtnCreateFirst: 'إنشاء أول تنبيه',
    alertTriggeredBadge: 'تم بلوغ الهدف !',
    alertConditionLabel: 'الشرط :',
    alertTestBtn: 'تجربة التنبيه',
    alertGoalReached: 'تم تحقيق الهدف بنجاح ✅',
    alertRemaining: 'متبقي للهدف',
    alertSoundOn: 'كتم الرنين الصوتي',
    alertSoundOff: 'تفعيل الرنين الصوتي',
    alertFooterNotice: 'فحص آلي للأسعار عند كل تحديث فوري',
    alertLocalPersistence: 'حفظ محلي آمن',
    alertBannerHitTitle: 'تنبيه: تم بلوغ السعر المستهدف !',
    alertBannerHitDesc: 'وصل سعر الصرف إلى الهدف المحدد وهو',
    alertBannerManageBtn: 'إدارة التنبيهات',

    bulletinModalTitle: 'النشرة اليومية لأسعار الصرف',
    bulletinModalSubtitle: 'نص منسق وجاهز للمشاركة فوراً على واتساب وتيليجرام ومواقع التواصل',
    bulletinPreviewLabel: 'معاينة نص النشرة :',
    bulletinCopyBtn: 'نسخ نص النشرة',
    bulletinCopiedBtn: 'تم نسخ النشرة !',
    bulletinShareWhatsapp: 'مشاركة عبر واتساب',
    bulletinShareTelegram: 'مشاركة عبر تيليجرام',

    ratesTableTitle: 'الجدول الشامل لمقارنة أسعار العملات',
    ratesTableSubtitle: 'مقارنة بين 13 عملة أجنبية رئيسية: سكوار بورسعيد مقابل بنك الجزائر الرسمي.',
    colCurrency: 'العملة والدولة',
    colCountry: 'الدولة',
    colParallelBuy: 'شراء السكوار',
    colParallelSell: 'بيع السكوار (للزبون)',
    colOfficialMid: 'بنك الجزائر (رسمي)',
    colGap: 'الفارق (%)',
    colActions: 'إجراء',
    chartTitle: 'تطور وتاريخ أسعار الصرف (بالدينار)',
    chartSubtitle: 'تحليل مقارن لليورو، الدولار، USDT و وايز مقابل الدينار الجزائري.',
    chart30Days: '30 يوماً',
    chart90Days: '90 يوماً',
    chart1Year: 'سنة كاملة',
    chartLegendParallelEur: 'يورو السكوار (السوق الموازي)',
    chartLegendOfficialEur: 'يورو بنك الجزائر (الرسمي)',
    chartLegendVirtualWise: 'رصيد وايز يورو Wise',
    chartLegendUsdt: 'USDT تيثر (بينانس P2P)',
    virtualSectionTitle: 'العملات الرقمية، النئوبنوك و P2P',
    virtualSectionSubtitle: 'شحن وسحب الأرصدة بالدينار الجزائري عبر بريدي موب و CCP والمواقع الموثوقة.',
    regionalSectionTitle: 'بورصات السكوار عبر ولايات الجزائر',
    regionalSectionSubtitle: 'الأسعار والفوارق الميدانية في أهم ولايات الوطن (وهران، قسنطينة، سطيف، عنابة...).',
    insightsSectionTitle: 'تحليلات وعوامل تحرك سوق الصرف',
    insightsSectionSubtitle: 'فهم أسباب العرض والطلب والمستجدات الاقتصادية المؤثرة في الدينار.',

    footerDisclaimer: 'تنبيه: أسعار السوق الموازي (سكوار بورسعيد) والعملات الرقمية مبنية على المتوسطات الحقيقية المتداولة في ساحات الصرف وتطبيقات P2P للاسترشاد.',
    footerRights: 'دينار ديزاد DinarDZ Exchange Tracker • الجزائر • أسعار الصرف لحظة بلحظة',

    cityAlger: 'الجزائر العاصمة',
    locAlger: 'ساحة بورسعيد (السكوار)',
    cityOran: 'وهران الباهية',
    locOran: 'ساحة أول نوفمبر / المدينة الجديدة',
    cityConstantine: 'قسنطينة',
    locConstantine: 'باب الوادي / وسط المدينة',
    citySetif: 'سطيف العالي',
    locSetif: 'محيط عين الفوارة والسوق',
    cityAnnaba: 'عنابة',
    locAnnaba: 'شارع الثورة (الكور)',
    cityTiziOuzou: 'تيزي وزو',
    locTiziOuzou: 'الشارع الرئيسي ووسط المدينة',
    cityBejaia: 'بجاية',
    locBejaia: 'ساحة أول نوفمبر والميناء',
    cityBatna: 'باتنة',
    locBatna: 'سوق الأوراس ووسط المدينة',
  },
};
