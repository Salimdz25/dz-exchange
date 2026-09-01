import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Lightbulb, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MarketInsight } from '../types';
import { Language, translations } from '../utils/translations';

interface MarketInsightsAndGuideProps {
  insights: MarketInsight[];
  language: Language;
}

export const MarketInsightsAndGuide: React.FC<MarketInsightsAndGuideProps> = ({ insights, language }) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = isAr
    ? [
        {
          question: "لماذا يوجد فارق كبير بين السعر الرسمي للبنك وسوق السكوار ؟",
          answer: "تعتمد الجزائر نظاماً صارماً للرقابة على الصرف. منحة السفر السياحية القانونية الممنوحة للمواطنين عبر البنوك محددة بما يعادل 15,000 دج سنوياً (حوالي 95 إلى 100 يورو). لتغطية نفقات السفر، العلاج، الدراسة بالخارج، أو استيراد السلع، يلجأ المواطنون والتجار إلى السوق الموازي (السكوار) أين يتحكم قانون العرض والطلب المباشر في تحديد السعر.",
        },
        {
          question: "كيف تتم معاملات العملات الرقمية (USDT، وايز Wise، بايسيرا Paysera) في الجزائر ؟",
          answer: "تتم المبادلات بطريقة الند للند (P2P). يقوم البائع بتحويل رصيد اليورو أو الدولار مباشرة إلى حساب المشتري في Wise أو بايسيرا أو تحرير USDT على Binance، بينما يقوم المشتري بدفع المقابل بالدينار الجزائري فورياً عبر تطبيق بريدي موب BaridiMob أو حوالة CCP.",
        },
        {
          question: "ما هي الحدود اليومية للتحويل عبر تطبيق بريدي موب ؟",
          answer: "يسمح بريد الجزائر بإجراء تحويلات حتى 200,000 دج (20 مليون سنتيم) يومياً عبر تطبيق بريدي موب. للمبالغ الأكبر من ذلك، تتم المعاملات عبر مكاتب البريد (CCP) أو نقداً يداً بيد.",
        },
        {
          question: "لماذا تحظى البطاقات الدولية (Wise، بايسيرا، ريدوت باي) بشعبية كبيرة ؟",
          answer: "تمنح الجزائريين بطاقات فيزا وماستركارد حقيقية للشراء من AliExpress و Shein، حجز الفنادق وتذاكر الطيران، تمويل الإعلانات الممولة (Facebook Ads, TikTok)، واستلام مستحقات العمل الحر (Freelance).",
        },
        {
          question: "كيف يتم حساب السنتيم والملايين في الجزائر ؟",
          answer: "في الجزائر، التداول اليومي يتم بالسنتيم (1 دينار = 100 سنتيم). بالتالي: 1,000 دج = 100 ألف سنتيم (مية ألف)، 10,000 دج = 1 مليون سنتيم (مليون)، و 100,000 دج = 10 ملايين سنتيم (عشرة ملايين). في السكوار، 100 يورو بسعر 25,250 دج تعني 'مليونين و525 ألف سنتيم'.",
        },
      ]
    : [
        {
          question: "Pourquoi existe-t-il un tel écart entre le cours officiel et le Square Port-Saïd ?",
          answer: "L'Algérie applique un système de contrôle des changes strict. L'allocation touristique légale accordée aux citoyens par les banques est plafonnée à l'équivalent de 15 000 DA (environ 95 € à 100 € par an). Pour voyager, faire des études à l'étranger, soigner des proches ou importer des marchandises hors circuits officiels, les citoyens et commerçants se tournent vers le marché parallèle (Square), où le prix est dicté par la loi de l'offre et de la demande.",
        },
        {
          question: "Comment fonctionnent les devises virtuelles (USDT, Wise, Paysera, RedotPay) en Algérie ?",
          answer: "Les devises virtuelles et les soldes néobanques sont échangés de pair-à-pair (P2P). Le vendeur transfère les Euros/Dollars directement sur le compte Wise/Paysera de l'acheteur ou libère des USDT sur Binance, tandis que l'acheteur effectue un virement instantané en Dinars Algériens via l'application BaridiMob ou par mandat CCP.",
        },
        {
          question: "Quels sont les plafonds de transfert BaridiMob pour l'achat de devises ?",
          answer: "Algérie Poste permet un transfert jusqu'à 200 000 DA (20 Millions de centimes) par jour et par compte via l'application BaridiMob. Pour des montants supérieurs, les transactions se font par virement de compte à compte au bureau de poste (CCP) ou de main à main en espèces.",
        },
        {
          question: "Pourquoi les banques non algériennes (Wise, Paysera, RedotPay) sont-elles si populaires ?",
          answer: "Elles permettent aux Algériens d'obtenir des cartes Visa/Mastercard internationales pour payer sur AliExpress, Shein, réserver des hôtels sur Booking, sponsoriser des publicités sur Facebook/Instagram/TikTok, ou recevoir des salaires freelance (Upwork, Fiverr) sans blocage bancaire.",
        },
        {
          question: "Comment comprendre les 'Centimes' (Millions / Mlayen) en Algérie ?",
          answer: "En Algérie, les prix du quotidien s'expriment en Centimes (1 Dinar = 100 Centimes). Ainsi, 1 000 DA = 100 000 Centimes (Miat Alef), 10 000 DA = 1 Million de centimes (Mlyoun), et 100 000 DA = 10 Millions de centimes (Achra Mlayen). Au Square, quand on dit que 100 € valent '25 000 DA', cela correspond à '2 Millions 500 Mille Centimes'.",
        },
      ];

  return (
    <section id="market-guide-section" className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Market Insights & News */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">
                {isAr ? 'عوامل واتجاهات سوق الصرف الجزائري' : 'Facteurs & Tendances du Marché DZ'}
              </h3>
            </div>

            <div className="space-y-3">
              {insights.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: FAQ Guide */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-white">
                {isAr ? 'دليل وإجابات حول سوق الصرف في الجزائر' : 'Guide Pratique : Comprendre le Marché de Change'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'كل ما تحتاج معرفته عن السكوار، بريدي موب، بنك الجزائر والسنتيم' : 'Tout comprendre sur le Square, BaridiMob, la Banque d\'Algérie et les Centimes'}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-200 hover:text-white cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-900">
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
