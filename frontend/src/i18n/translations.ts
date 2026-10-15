import type { Category, Product } from '../types';

export type Language = 'ua';

export interface TranslationDictionary {
  appName: string;
  subtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  emptyProductsTitle: string;
  emptyProductsDesc: string;
  resetFilters: string;
  loadingCatalog: string;
  retry: string;
  addToCart: string;
  outOfStock: string;
  inStock: string;
  inCart: string;
  cart: string;
  cartEmptyTitle: string;
  cartEmptyDesc: string;
  goToCatalog: string;
  clearCart: string;
  backToCatalog: string;
  contactInfo: string;
  customerName: string;
  customerNamePlaceholder: string;
  phoneNumber: string;
  phoneNumberPlaceholder: string;
  addressComment: string;
  addressCommentPlaceholder: string;
  cardMessage: string;
  cardMessagePlaceholder: string;
  itemsInOrder: string;
  delivery: string;
  freeDelivery: string;
  totalToPay: string;
  proceedToCheckout: string;
  orderSuccessTitle: string;
  orderSuccessDesc: string;
  orderNumber: string;
  orderStatus: string;
  orderPending: string;
  orderPaid: string;
  orderAssembling: string;
  orderReadyForPickup: string;
  orderInDelivery: string;
  orderCompleted: string;
  orderCancelled: string;
  backToShopping: string;
  roleBuyer: string;
  roleAdmin: string;
  roleCourier: string;
  adminProducts: string;
  adminCategories: string;
  adminOrders: string;
  adminAddProduct: string;
  adminManageCategories: string;
  adminEditProduct: string;
  adminNewProduct: string;
  adminProductTitle: string;
  adminProductTitlePlaceholder: string;
  adminCategory: string;
  adminPrice: string;
  adminDescription: string;
  adminDescriptionPlaceholder: string;
  adminImage: string;
  adminImagePlaceholder: string;
  adminUploadImage: string;
  adminProductInStock: string;
  adminPublishToChannel: string;
  adminChannelUsername: string;
  adminChannelUsernamePlaceholder: string;
  adminSave: string;
  adminCreate: string;
  adminCategoriesTitle: string;
  adminNewCategory: string;
  adminEditCategory: string;
  adminCategoryName: string;
  adminCategoryNamePlaceholder: string;
  adminIcon: string;
  adminCurrentCategories: string;
  adminOrdersTitle: string;
  adminOrderItems: string;
  adminChangeStatus: string;
  adminNoOrders: string;
  adminDeleteConfirm: string;
  adminDeleteCategoryConfirm: string;
  errorNameRequired: string;
  errorOrderFailed: string;
  errorPriceRequired: string;
  errorTitleRequired: string;
  errorCategoryNameRequired: string;
  paczkomatOrAddress: string;
  upsellTitle: string;
  upsellSubtitle: string;
  addToOrder: string;
  addedToOrder: string;
  publishedSuccess: string;

  // Delivery Date & Time & Surprise options
  deliveryTimingTitle: string;
  deliveryDateLabel: string;
  deliveryTimeLabel: string;
  surpriseDeliveryTitle: string;
  surpriseDeliveryDesc: string;
  needCallRecipientTitle: string;
  needCallRecipientDesc: string;
  today: string;
  tomorrow: string;

  // Lviv Studio & Instagram Specific
  storeAddress: string;
  workingHours: string;
  instagramBadge: string;
  fastDeliveryBadge: string;
  chrysalFreeBadge: string;
  pickupInfo: string;

  // Courier Dashboard
  courierDashboardTitle: string;
  courierActiveDeliveries: string;
  courierCompletedDeliveries: string;
  courierNoDeliveries: string;
  courierStartDelivery: string;
  courierMarkDelivered: string;
  courierOpenMap: string;
  courierCallRecipient: string;
  courierSurpriseBadge: string;
  courierCallNeededBadge: string;
  courierDeliveryTime: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  ua: {
    appName: 'Flowers Lviv',
    subtitle: 'Квіти та авторські букети у Львові',
    searchPlaceholder: 'Пошук букетів, півоній, троянд, подарунків...',
    allCategories: 'Усі букети',
    emptyProductsTitle: 'Букети не знайдено',
    emptyProductsDesc: 'У цій категорії поки немає квітів або нічого не знайдено за запитом',
    resetFilters: 'Показати всі квіти',
    loadingCatalog: 'Збираємо свіжі квіти Flowers Lviv...',
    retry: 'Повторити',
    addToCart: 'У кошик',
    outOfStock: 'Немає в наявності',
    inStock: 'В наявності в студії на Топольній',
    inCart: 'У кошику',
    cart: 'Квітковий кошик',
    cartEmptyTitle: 'У кошику поки немає квітів',
    cartEmptyDesc: 'Оберіть букет у каталозі, щоб оформити доставку по Львову або швидкий самовивіз.',
    goToCatalog: 'Обрати букет',
    clearCart: 'Очистити',
    backToCatalog: 'Назад до квітів',
    contactInfo: 'Доставка по Львову та контакти',
    customerName: "Ім'я та прізвище одержувача / замовника *",
    customerNamePlaceholder: 'Наприклад: Олена Ковальчук / Тарас',
    phoneNumber: 'Телефон одержувача або замовника (+380)',
    phoneNumberPlaceholder: '+380 (98) 123-45-67',
    addressComment: 'Адреса доставки у Львові (або Самовивіз)',
    addressCommentPlaceholder: 'м. Львів, вул. Городоцька 12, кв. 5 (під’їзд 2, поверх 3)... або самовивіз: вул. Топольна, 4В',
    cardMessage: 'Текст безкоштовної авторської листівки у букет',
    cardMessagePlaceholder: 'Напишіть теплі слова, флористи студії каліграфічно підпишуть листівку від руки...',
    itemsInOrder: 'Букетів та подарунків',
    delivery: "Кур'єрська доставка по Львову",
    freeDelivery: 'Безкоштовно від 1 500 ₴',
    totalToPay: 'Разом до сплати:',
    proceedToCheckout: 'Оформити та оплатити замовлення',
    orderSuccessTitle: 'Замовлення квітів успішно оформлено!',
    orderSuccessDesc: 'Флористи Flowers Lviv на вул. Топольній вже почали складати ваш свіжий букет. Доставимо дбайливо та вчасно!',
    orderNumber: 'Замовлення',
    orderStatus: 'Статус:',
    orderPending: 'Нове / Очікує',
    orderPaid: 'Оплачено',
    orderAssembling: 'Флорист складає букет',
    orderReadyForPickup: "Готовий до видачі / Самовивіз",
    orderInDelivery: "Кур'єр у дорозі по Львову",
    orderCompleted: 'Успішно доставлено',
    orderCancelled: 'Скасовано',
    backToShopping: 'Повернутися до квітів',
    roleBuyer: 'Клієнт (Вітрина)',
    roleAdmin: 'Флорист (Адмін)',
    roleCourier: "Кур'єр",
    adminProducts: 'Букети',
    adminCategories: 'Категорії',
    adminOrders: 'Замовлення',
    adminAddProduct: 'Додати букет',
    adminManageCategories: 'Категорії',
    adminEditProduct: 'Редагувати букет',
    adminNewProduct: 'Новий букет або подарунок',
    adminProductTitle: 'Назва букету / композиції *',
    adminProductTitlePlaceholder: 'Наприклад: Букет «Півонієвий світанок» XL',
    adminCategory: 'Категорія *',
    adminPrice: 'Ціна (₴ / грн) *',
    adminDescription: 'Склад квітів та опис',
    adminDescriptionPlaceholder: 'Склад: півонії, кущова троянда, евкаліпт, дизайнерське матове пакування...',
    adminImage: 'Фотографія букету',
    adminImagePlaceholder: 'Посилання на фото (URL) або завантаження...',
    adminUploadImage: 'Завантажити фото',
    adminProductInStock: 'Свіжі квіти в наявності (В студії)',
    adminPublishToChannel: '📢 Опублікувати в Telegram-канал при збереженні',
    adminChannelUsername: 'Telegram-канал для автопостингу',
    adminChannelUsernamePlaceholder: '@nazwa_kanalu або -100xxxxxxxx',
    adminSave: 'Зберегти зміни',
    adminCreate: 'Додати до вітрини',
    adminCategoriesTitle: 'Керування категоріями квітів',
    adminNewCategory: 'Нова категорія',
    adminEditCategory: 'Редагування категорії',
    adminCategoryName: 'Назва категорії *',
    adminCategoryNamePlaceholder: 'Наприклад: Авторські букети',
    adminIcon: 'Іконка',
    adminCurrentCategories: 'Поточні категорії',
    adminOrdersTitle: 'Усі замовлення Flowers Lviv',
    adminOrderItems: 'Склад замовлення:',
    adminChangeStatus: 'Змінити статус:',
    adminNoOrders: 'Замовлень поки немає',
    adminDeleteConfirm: 'Видалити цей букет?',
    adminDeleteCategoryConfirm: 'Видалити категорію? Усі прив’язані букети також будуть видалені.',
    errorNameRequired: "Будь ласка, вкажіть ім'я одержувача чи замовника",
    errorOrderFailed: 'Помилка під час оформлення замовлення',
    errorPriceRequired: 'Вкажіть коректну вартість букету в грн (₴)',
    errorTitleRequired: 'Вкажіть назву букету',
    errorCategoryNameRequired: 'Введіть назву категорії',
    paczkomatOrAddress: "Швидка доставка кур'єром по Львову та області",
    upsellTitle: 'Додати до букету 🎁',
    upsellSubtitle: 'Зробіть ваш квітковий подарунок ще приємнішим:',
    addToOrder: '+ Додати',
    addedToOrder: '✓ У замовленні',
    publishedSuccess: 'Букет успішно опубліковано в Telegram-канал із кнопкою замовлення!',

    deliveryTimingTitle: 'Дата та час доставки по Львову',
    deliveryDateLabel: 'Дата доставки',
    deliveryTimeLabel: 'Час вручення (10:00 – 20:00)',
    surpriseDeliveryTitle: 'Доставка-сюрприз (Анонімно)',
    surpriseDeliveryDesc: 'Не називати ім’я замовника до моменту урочистого вручення',
    needCallRecipientTitle: 'Уточнити точну адресу в одержувача',
    needCallRecipientDesc: "Кур'єр ввічливо зателефонує одержувачу та узгодить зручний час і місце",
    today: 'Сьогодні',
    tomorrow: 'Завтра',

    storeAddress: 'м. Львів, вул. Топольна, 4В',
    workingHours: 'Щодня 10:00 – 20:00',
    instagramBadge: '@flowers___lviv',
    fastDeliveryBadge: 'Доставка від 60 хв',
    chrysalFreeBadge: 'Chrysal у подарунок',
    pickupInfo: 'Самовивіз зі студії: вул. Топольна, 4В (безкоштовно)',

    courierDashboardTitle: "Панель кур'єра Flowers Lviv",
    courierActiveDeliveries: 'До вручення',
    courierCompletedDeliveries: 'Вручено',
    courierNoDeliveries: "Наразі немає активних доставок по Львову 🌸",
    courierStartDelivery: "🚗 Виїхав до одержувача",
    courierMarkDelivered: '✅ Букет вручено!',
    courierOpenMap: 'Навігатор (Google Maps)',
    courierCallRecipient: 'Зателефонувати одержувачу',
    courierSurpriseBadge: '🤫 СЮРПРИЗ (Анонімно)',
    courierCallNeededBadge: '📞 Уточнити адресу',
    courierDeliveryTime: 'Час доставки:',
  },
};

// Localized mapping for Categories in Ukrainian
export const CATEGORY_TRANSLATIONS: Record<number, string> = {
  1: 'Авторські букети',
  2: 'Троянди & Монобукети',
  3: 'Flower Box & Кошики',
  4: 'Кімнатні рослини & Орхідеї',
  5: 'Подарунки & Аксесуари',
};

// Localized mapping for Products with authentic Ukrainian floristry descriptions
export const PRODUCT_TRANSLATIONS: Record<
  number,
  { title: string; description: string }
> = {
  1: {
    title: 'Букет «Рожева Магія» Преміум',
    description:
      'Пишна авторська композиція з кущових півонієподібних троянд, ніжної кремової еустоми, хризантем, гвоздик та свіжого запашного евкаліпта. Дизайнерське матове пакування Flowers Lviv із шовковими стрічками.',
  },
  2: {
    title: 'Букет «Сонячний Ранок» XL',
    description:
      'Життєрадісний яскравий букет із добірних соняшників, теплих жовтих троянд, ромашок, альстромерій та декоративної зелені. Наповнює дім теплом та щирою радістю!',
  },
  3: {
    title: 'Букет «Півонієвий Сон» Grand Luxury',
    description:
      'Ексклюзивний букет королівського масштабу: голландські півонії Sarah Bernhardt, пишна гортензія, сортові троянди та сизий евкаліпт Populus. Розмір XXL для найважливіших моментів життя.',
  },
  4: {
    title: 'Монобукет із 25 червоних троянд Red Naomi',
    description:
      'Класичні оксамитові червоні троянди найвищого ґатунку висотою 60 см. Ідеальний і перевірений символ справжнього палкого кохання, перев’язаний атласною стрічкою.',
  },
  5: {
    title: 'Монобукет із 19 пудрових троянд Mondial',
    description:
      'Ніжні кремово-пудрові троянди з великими хвилястими пелюстками в мінімалістичному фірмовому оформленні. Бездоганний вибір для витонченого подарунка.',
  },
  6: {
    title: 'Flower Box «Пудровий Оксамит» Velvet',
    description:
      'Стильна кругла оксамитова коробка Flowers Lviv на флористичному оазисі з водою. Троянда, еустома, гортензія та евкаліпт. Не потребує вази та довго зберігає свіжість!',
  },
  7: {
    title: 'Плетений кошик квітів «Прованс»',
    description:
      'Ароматна та повітряна композиція в натуральному плетеному кошику ручної роботи: гортензія, гілочки лаванди, кущова півонієподібна троянда та еустома. Стійкість до 10 днів.',
  },
  8: {
    title: 'Орхідея Фаленопсис 2-стовбурова в кашпо',
    description:
      'Елегантна білосніжна орхідея преміум-сорту в керамічному дизайнерському кашпо. Квітне до 3–4 місяців та прикрашає будь-який інтер’єр.',
  },
  9: {
    title: 'Монстера делікатесна (Monstera Deliciosa) XL',
    description:
      'Розкішна кімнатна рослина з великим різьбленим смарагдовим листям. Висота 65–70 см, висаджена у поживний ґрунт.',
  },
  10: {
    title: 'Скляна циліндрична ваза для букетів 25 см',
    description:
      'Міцне прозоре скло класичної форми. Ідеально підходить за висотою та об’ємом для будь-якого букета з нашої студії.',
  },
  11: {
    title: 'Цукерки Ferrero Rocher / Raffaello 200г',
    description:
      'Вишукані шоколадні цукерки у золотистій святковій упаковці — найсолодший додаток до квітів.',
  },
  12: {
    title: '51 червона троянда «Палаюче Кохання»',
    description:
      'Незабутній величний букет із 51 свіжої червоної троянди 60 см від майстрів Flowers Lviv. Ідеально для пропозиції руки та серця чи річниці.',
  },
  13: {
    title: 'Букет «Ніжна Гортензія & Еустома»',
    description:
      'Повітряний блакитно-кремовий авторський букет з об’ємної голландської гортензії, білої еустоми, фрезії та евкаліпта.',
  },
  14: {
    title: 'Весняний мікс із 35 тюльпанів «Львівський Ранок»',
    description:
      'Ніжний та свіжий мікс із добірних сортових тюльпанів пастельних, рожевих та сонячних відтінків у крафті.',
  },
  15: {
    title: 'Flower Box «Пристрасть & Золото» 29 троянд',
    description:
      'Елегантна преміальна коробка Flowers Lviv із золотим тисненням, наповнена 29 оксамитовими бордовими трояндами.',
  },
  16: {
    title: 'Королівський кошик 101 троянда «Імператор»',
    description:
      'Гігантський кошик ручної роботи зі 101 свіжої троянди преміум-ґатунку. Справжній шедевр флористичного мистецтва студії Flowers Lviv.',
  },
  17: {
    title: 'Букет авторський «Лавандовий Світанок»',
    description:
      'Витончений букет у фіолетово-рожевих відтінках: левкої, кущові троянди, лімоніум та евкаліпт.',
  },
  18: {
    title: 'Монобукет із 15 півонієподібних троянд «Misty Bubbles»',
    description:
      'Круглі шароподібні троянди насиченого фіолетово-малинового кольору з п’янким легким ароматом.',
  },
  19: {
    title: 'Букет «Вершковий Пломбір» із садовими трояндами',
    description:
      'Ніжний кремово-ванільний букет із французьких садових троянд garden, хмаринки гіпсофіли та білих альстромерій.',
  },
  20: {
    title: 'Flower Box «Сонячні Промені»',
    description:
      'Яскрава коробочка з міні-соняшниками, ромашкою та жовтими кущовими трояндами. Покращує настрій з першого погляду!',
  },
  21: {
    title: '101 ніжно-рожева троянда «Aqua Romance»',
    description:
      'Приголомшливий букет зі 101 рожевої троянди. Незабутній жест для найдорожчої людини у світі.',
  },
  22: {
    title: 'Композиція «Лісова Казка» у дерев’яному кашпо',
    description:
      'Еко-композиція в натуральному дерев’яному ящичку зі стабілізованим мохом, міні-трояндами та сукулентами.',
  },
  23: {
    title: 'Букет «Чисте Натхнення» з білих лілій та троянд',
    description:
      'Шляхетний білий букет з ароматних східних лілій, білих троянд Avalanche та евкаліпта.',
  },
  24: {
    title: 'Букет із 11 пухнастих гортензій «Хмаринка Ніжності»',
    description:
      'Величезний оберемок свіжих сортових гортензій пастельно-рожевих, білих та блакитних кольорів. Вау-ефект гарантовано!',
  },
  101: {
    title: 'Авторська листівка з вашим текстом (від руки)',
    description:
      'Красива листівка з щільного паперу, на якій флорист красиво виведе ваші побажання каліграфічним почерком.',
  },
  102: {
    title: 'Підживлення для квітів Chrysal (3 саше)',
    description:
      'Професійне голландське добриво, що зберігає кришталеву чистоту води та подовжує життя букета до 2 тижнів.',
  },
  103: {
    title: 'Повітряна кулька з гелієм «Серце»',
    description:
      'Фольговане глянцеве серце на довгій шовковій стрічці, прив’язане до букета.',
  },
};

export function getLocalizedCategoryName(category: Category, _lang?: Language): string {
  if (category.name_ua) return category.name_ua;
  const translation = CATEGORY_TRANSLATIONS[category.id];
  if (translation) return translation;
  return category.name;
}

export function getLocalizedProduct(product: Product, _lang?: Language): Product {
  let title = product.title_ua || product.title;
  let description = product.description_ua || product.description;

  const mapTranslation = PRODUCT_TRANSLATIONS[product.id];
  if (mapTranslation) {
    title = mapTranslation.title;
    description = mapTranslation.description;
  }

  const catTranslation = CATEGORY_TRANSLATIONS[product.category_id];
  const category_name = catTranslation || product.category_name;

  return {
    ...product,
    title,
    description,
    category_name,
  };
}
