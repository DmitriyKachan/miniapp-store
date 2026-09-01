// Floral & retail smart vocabulary dictionary for instant accurate offline translations
const VOCABULARY: Record<string, { pl: string; ua: string; ru: string }> = {
  'букет': { pl: 'bukiet', ua: 'букет', ru: 'букет' },
  'роза': { pl: 'róża', ua: 'троянда', ru: 'роза' },
  'розы': { pl: 'róże', ua: 'троянди', ru: 'розы' },
  'красные': { pl: 'czerwone', ua: 'червоні', ru: 'красные' },
  'белые': { pl: 'białe', ua: 'білі', ru: 'белые' },
  'розовые': { pl: 'różowe', ua: 'рожеві', ru: 'розовые' },
  'желтые': { pl: 'żółte', ua: 'жовті', ru: 'желтые' },
  'пион': { pl: 'piwonia', ua: 'півонія', ru: 'пион' },
  'пионы': { pl: 'piwonie', ua: 'півонії', ru: 'пионы' },
  'тюльпан': { pl: 'tulipan', ua: 'тюльпан', ru: 'тюльпан' },
  'тюльпаны': { pl: 'tulipany', ua: 'тюльпани', ru: 'тюльпаны' },
  'гортензия': { pl: 'hortensja', ua: 'гортензія', ru: 'гортензия' },
  'гортензии': { pl: 'hortensje', ua: 'гортензії', ru: 'гортензии' },
  'эустома': { pl: 'eustoma', ua: 'еустома', ru: 'эустома' },
  'гвоздики': { pl: 'goździki', ua: 'гвоздики', ru: 'гвоздики' },
  'орхидея': { pl: 'orchidea', ua: 'орхідея', ru: 'орхидея' },
  'хризантемы': { pl: 'chryzantemy', ua: 'хризантеми', ru: 'хризантемы' },
  'подсолнухи': { pl: 'słoneczniki', ua: 'соняшники', ru: 'подсолнухи' },
  'корзина': { pl: 'kosz', ua: 'кошик', ru: 'корзина' },
  'коробка': { pl: 'pudełko', ua: 'коробка', ru: 'коробка' },
  'ваза': { pl: 'wazon', ua: 'ваза', ru: 'ваза' },
  'подарок': { pl: 'prezent', ua: 'подарунок', ru: 'подарок' },
  'открытка': { pl: 'bilecik', ua: 'листівка', ru: 'открытка' },
  'конфеты': { pl: 'praliny', ua: 'цукерки', ru: 'конфеты' },
  'шары': { pl: 'balony', ua: 'кульки', ru: 'шары' },
  'свежие': { pl: 'świeże', ua: 'свіжі', ru: 'свежие' },
  'авторский': { pl: 'autorski', ua: 'авторський', ru: 'авторский' },
  'авторские': { pl: 'autorskie', ua: 'авторські', ru: 'авторские' },
  'премиум': { pl: 'premium', ua: 'преміум', ru: 'премиум' },
};

export async function translateText(
  text: string,
  fromLang: 'ru' | 'pl' | 'ua',
  toLang: 'ru' | 'pl' | 'ua'
): Promise<string> {
  if (!text || !text.trim() || fromLang === toLang) return text;

  const trimmed = text.trim();

  // 1. Try public translation API (MyMemory free translation)
  try {
    const pair = `${fromLang}|${toLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${pair}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText && !data.responseData.translatedText.includes('MYMEMORY WARNING')) {
        return data.responseData.translatedText;
      }
    }
  } catch (e) {
    // Fallback to vocabulary and rule-based translation
  }

  // 2. Rule-based word-by-word replacement fallback
  let result = trimmed;
  for (const [key, map] of Object.entries(VOCABULARY)) {
    const fromWord = map[fromLang] || key;
    const toWord = map[toLang];
    if (toWord && fromWord) {
      const regex = new RegExp(`\\b${fromWord}\\b`, 'gi');
      result = result.replace(regex, toWord);
    }
  }

  return result;
}

export async function autoTranslateAll(
  text: string,
  sourceLang: 'ru' | 'pl' | 'ua'
): Promise<{ ru: string; pl: string; ua: string }> {
  if (!text.trim()) {
    return { ru: '', pl: '', ua: '' };
  }

  const result = {
    ru: sourceLang === 'ru' ? text : '',
    pl: sourceLang === 'pl' ? text : '',
    ua: sourceLang === 'ua' ? text : '',
  };

  const targets: ('ru' | 'pl' | 'ua')[] = (['ru', 'pl', 'ua'] as const).filter((l) => l !== sourceLang);

  await Promise.all(
    targets.map(async (target) => {
      try {
        const translated = await translateText(text, sourceLang, target);
        result[target] = translated;
      } catch {
        result[target] = text;
      }
    })
  );

  return result;
}
