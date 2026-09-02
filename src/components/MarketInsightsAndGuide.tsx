import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';
import { MarketInsight } from '../types';
import { Language, translations } from '../utils/translations';

interface MarketInsightsAndGuideProps {
  insights: MarketInsight[];
  theme: 'light' | 'dark';
  language: Language;
}

export const MarketInsightsAndGuide: React.FC<MarketInsightsAndGuideProps> = ({ insights, theme, language }) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const isDark = theme === 'dark';
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = isAr
    ? [
        {
          question: "لماذا يوجد فارق كبير بين السعر الرسمي للبنك وسوق السكوار ؟",
          answer: "تعتمد الجزائر نظاماً صارماً للرقابة على الصرف. منحة السفر السياحية التي تقدمها البنوك (750 يورو سنوياً) لا تكفي لاحتياجات المواطنين من سفر وعلاج وتجارة. هذا النقص في العرض الرسمي يدفع الجميع نحو السوق الموازي، أين يخضع السعر حصرياً لقانون العرض والطلب وحجم السيولة المتوفرة.",
        },
        {
          question: "كيف تتم معاملات الأرصدة الرقمية في الجزائر ؟",
          answer: "تتم المبادلات بنظام الند للند، حيث يرسل البائع رصيد العملة الصعبة من حسابه البنكي الأجنبي إلى حساب المشتري مباشرة. وفي المقابل، يتم دفع القيمة بالدينار الجزائري عبر تطبيق بريدي موب أو الحوالات البريدية، وفي حالات المبالغ الضخمة يفضل المتعاملون التبادل نقداً يداً بيد لضمان الأمان.",
        },
        {
          question: "لماذا سعر اليورو الرقمي أغلى من اليورو الورقي ؟",
          answer: "الأرصدة الرقمية في وايز أو بايسيرا هي أموال مودعة فعلياً في بنوك أوروبية، مما يجعلها الأداة الوحيدة المتاحة للجزائريين لاستيراد السيارات أقل من 3 سنوات من أوروبا والصين. فهي تسمح بسداد ثمن المركبة للمورد الأجنبي فوراً وبكل أمان، على عكس العملة الورقية التي يصعب نقلها دولياً وتخضع لقيود جمركية مشددة عند السفر.",
        },
        {
          question: "لماذا تحظى البطاقات الدولية مثل بايسيرا وريدوت باي بشعبية كبيرة ؟",
          answer: "هذه البطاقات تمنح الجزائريين هوية مصرفية دولية، مما يتيح لهم الشراء من المواقع العالمية، حجز الفنادق، تمويل الإعلانات الممولة على شبكات التواصل الاجتماعي، واستلام أجور العمل الحر من الخارج دون أي عوائق تقنية أو إدارية محلية.",
        },
        {
          question: "كيف يتم حساب السنتيم والملايين في سوق الصرف ؟",
          answer: "التداول اليومي يتم بالسنتيم لسهولة الحساب. فمثلاً: 1,000 دينار تساوي 'مية ألف سنتيم'، و 10,000 دينار تساوي 'مليون سنتيم'. عندما يكون سعر اليورو 276.0، فإن 100 يورو تعادل 'مليونين و760 ألف سنتيم'.",
        },
      ]
    : [
        {
          question: "Pourquoi existe-t-il un tel écart entre le cours officiel et le Square ?",
          answer: "L'Algérie applique un contrôle des changes strict. L'allocation touristique de 750 € par an est insuffisante pour couvrir les besoins réels (voyages, santé, importations). Cette pénurie de devises au guichet bancaire reporte toute la demande sur le marché parallèle du Square Port-Saïd, où le prix est fixé par l'équilibre entre l'offre et la demande.",
        },
        {
          question: "Comment fonctionnent les échanges de soldes numériques (P2P) ?",
          answer: "Les transactions s'effectuent de pair-à-pair. Le vendeur crédite le compte bancaire étranger de l'acheteur (Wise, Paysera, etc.) et l'acheteur règle la contrepartie en Dinars Algériens. Le paiement se fait via virement BaridiMob, mandat CCP ou en espèces (main à main) pour sécuriser les transactions de montants importants.",
        },
        {
          question: "Pourquoi l'Euro digital est-il plus cher que l'Euro physique ?",
          answer: "L'Euro numérique réside déjà dans des banques étrangères, ce qui en fait le levier indispensable pour l'importation de véhicules de moins de 3 ans. Il permet de régler les fournisseurs en Europe ou en Chine instantanément par virement international. Cette utilité logistique, impossible avec des billets physiques soumis aux limites douanières et aux risques de transport, justifie son prix premium.",
        },
        {
          question: "Quelle est l'utilité des banques en ligne comme Wise ou RedotPay ?",
          answer: "Elles offrent aux Algériens des moyens de paiement internationaux pour le commerce en ligne (AliExpress), le sponsoring publicitaire et les abonnements. Elles permettent aussi aux freelances de recevoir leurs honoraires en devises et de les utiliser librement à l'international sans passer par le système bancaire local.",
        },
        {
          question: "Comment comprendre la conversion en Centimes (Mlayen) ?",
          answer: "En Algérie, les prix s'expriment couramment en Centimes (1 DA = 100 Centimes). Par exemple, 10 000 DA équivalent à '1 Million de centimes'. Au cours actuel de 276.0, une coupure de 100 € s'échange pour '2 Millions 760 Mille Centimes'.",
        },
      ];

  return (
    <section id="market-guide-section" className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Market Insights */}
        <div className={`lg:col-span-5 rounded-[2.5rem] border p-8 shadow-xl flex flex-col justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'اتجاهات السوق' : 'Analyses du Marché'}
              </h3>
            </div>

            <div className="space-y-4">
              {insights.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isDark ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-100 hover:border-amber-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{item.date}</span>
                  </div>
                  <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: FAQ Guide */}
        <div className={`lg:col-span-7 rounded-[2.5rem] border p-8 shadow-xl ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
               <BookOpen className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
               <h3 className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'دليل التعاملات' : 'Guide Pratique'}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {isAr ? 'فهم آليات سوق الصرف في الجزائر' : 'Comprendre le fonctionnement du marché'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? (isDark ? 'bg-slate-950 border-emerald-500/30' : 'bg-slate-50 border-emerald-500/30')
                      : (isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-100')
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className={`w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold cursor-pointer ${
                      isDark ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className={`px-4 pb-4 pt-1 text-xs leading-relaxed border-t ${isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-100'}`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
