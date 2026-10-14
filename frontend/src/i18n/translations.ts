import type { Category, Product } from '../types';

export type Language = 'ua' | 'pl' | 'ru';

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

  // AI Florist
  aiFloristBannerTitle: string;
  aiFloristBannerSubtitle: string;
  aiFloristOpenButton: string;
  aiFloristModalTitle: string;
  aiFloristStep1: string;
  aiFloristStep2: string;
  aiFloristStep3: string;
  aiFloristResultsTitle: string;
  aiFloristResultsSubtitle: string;
  aiFloristBack: string;
  aiFloristNext: string;
  aiFloristClose: string;
  aiFloristRestart: string;

  // Occasions
  occLove: string;
  occBirthday: string;
  occMom: string;
  occWedding: string;
  occSorry: string;
  occJustBecause: string;

  // Budgets (UAH)
  budgetUnder200: string;
  budget200To350: string;
  budget350To500: string;
  budgetVip: string;

  // Palettes
  palettePastel: string;
  paletteRed: string;
  paletteYellow: string;
  paletteMixed: string;

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
    inStock: 'Свіжа поставка в студії',
    inCart: 'У кошику',
    cart: 'Квітковий кошик',
    cartEmptyTitle: 'У кошику поки немає квітів',
    cartEmptyDesc: 'Оберіть чарівний букет у каталозі, щоб оформити доставку по Львову або самовивіз з вул. Топольної.',
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
    cardMessagePlaceholder: 'Напишіть теплі слова, наші флористи красиво підпишуть листівку від руки...',
    itemsInOrder: 'Букетів та подарунків',
    delivery: "Кур'єрська доставка по Львову",
    freeDelivery: 'Безкоштовно від 1 500 ₴',
    totalToPay: 'Разом до сплати:',
    proceedToCheckout: 'Оформити та оплатити замовлення',
    orderSuccessTitle: 'Замовлення квітів успішно оформлено!',
    orderSuccessDesc: 'Флористи Flowers Lviv на Топольній вже почали складати ваш свіжий букет. Ми доставимо його дбайливо та вчасно!',
    orderNumber: 'Замовлення',
    orderStatus: 'Статус:',
    orderPending: 'Нове / Очікує',
    orderPaid: 'Оплачено',
    orderAssembling: 'Флорист Flowers Lviv складає букет',
    orderReadyForPickup: "Готовий для кур'єра / Самовивіз",
    orderInDelivery: "Кур'єр у дорозі по Львову",
    orderCompleted: 'Доставлено одержувачу',
    orderCancelled: 'Скасовано',
    backToShopping: 'Повернутися до квітів',
    roleBuyer: 'Клієнт',
    roleAdmin: 'Флорист / Адмін',
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
    adminPrice: 'Ціна (₴ / UAH) *',
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
    adminCategoryNamePlaceholder: 'Наприклад: Flower Box & Кошики',
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
    publishedSuccess: 'Букет успішно опубліковано в канал із кнопкою замовлення!',

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
    pickupInfo: 'Самовивіз: вул. Топольна, 4В (безкоштовно)',

    aiFloristBannerTitle: '🌸 AI-Флорист: Підібрати букет за 15 секунд',
    aiFloristBannerSubtitle: 'Дайте відповідь на 3 короткі запитання та отримайте ідеальну добірку квітів Flowers Lviv',
    aiFloristOpenButton: 'Підібрати букет ✨',
    aiFloristModalTitle: 'AI-Флорист • Flowers Lviv',
    aiFloristStep1: '1. З якої нагоди даруєте квіти?',
    aiFloristStep2: '2. Комфортний бюджет у гривнях:',
    aiFloristStep3: '3. Бажана колірна гама:',
    aiFloristResultsTitle: '✨ Ідеальні букети для вас у Львові:',
    aiFloristResultsSubtitle: 'Ми підібрали найкращі композиції за вашими вподобаннями',
    aiFloristBack: 'Назад',
    aiFloristNext: 'Далі →',
    aiFloristClose: 'Закрити',
    aiFloristRestart: 'Пройти знову ↺',

    occLove: '❤️ Романтика / Кохання',
    occBirthday: '🎂 День народження / Свято',
    occMom: '👩 Улюбленій Мамі / Бабусі',
    occWedding: '💍 Весілля / Річниця',
    occSorry: '🥺 Вибачення / Примирення',
    occJustBecause: '✨ Просто так / Без приводу',

    budgetUnder200: 'До 1 200 ₴ (Затишний)',
    budget200To350: '1 200 – 2 200 ₴ (Популярний)',
    budget350To500: '2 200 – 3 800 ₴ (Пишний XL)',
    budgetVip: 'Від 3 800 ₴ (Royal VIP / 101 троянда)',

    palettePastel: '🌸 Ніжна пастельна (пудровий, крем, еустома)',
    paletteRed: '🌹 Пристрасна червона (Red Naomi, оксамит)',
    paletteYellow: '🌻 Сонячна тепла (жовті троянди, соняшники)',
    paletteMixed: '🎨 Яскравий різнокольоровий авторський мікс',

    courierDashboardTitle: "Кабінет кур'єра Flowers Lviv",
    courierActiveDeliveries: 'До вручення',
    courierCompletedDeliveries: 'Вручено',
    courierNoDeliveries: "Наразі немає активних доставок по Львову 🌸",
    courierStartDelivery: "🚗 Виїхав до одержувача",
    courierMarkDelivered: '✅ Букет вручено!',
    courierOpenMap: 'Навігатор (Google Maps)',
    courierCallRecipient: 'Зателефонувати',
    courierSurpriseBadge: '🤫 СЮРПРИЗ (Анонімно)',
    courierCallNeededBadge: '📞 Уточнити адресу',
    courierDeliveryTime: 'Час доставки:',
  },

  pl: {
    appName: 'Flowers Lviv',
    subtitle: 'Kwiaciarnia & Autorskie bukiety we Lwowie',
    searchPlaceholder: 'Szukaj bukietów, róż, upominków...',
    allCategories: 'Wszystkie bukiety',
    emptyProductsTitle: 'Brak bukietów',
    emptyProductsDesc: 'W tej kategorii nie ma jeszcze kwiatów lub nic nie znaleziono dla Twojego zapytania',
    resetFilters: 'Pokaż wszystkie kwiaty',
    loadingCatalog: 'Przygotowujemy świeże kwiaty Flowers Lviv...',
    retry: 'Ponów próbę',
    addToCart: 'Do koszyka',
    outOfStock: 'Brak w kwiaciarni',
    inStock: 'Świeża dostawa w studio',
    inCart: 'W koszyku',
    cart: 'Koszyk kwiatowy',
    cartEmptyTitle: 'Twój koszyk jest pusty',
    cartEmptyDesc: 'Wybierz wyjątkowy bukiet z kwiaciarni Flowers Lviv, aby zamówić dostawę we Lwowie lub odbiór osobisty.',
    goToCatalog: 'Wybierz bukiet',
    clearCart: 'Wyczyść',
    backToCatalog: 'Wróć do bukietów',
    contactInfo: 'Dostawa we Lwowie i dane odbiorcy',
    customerName: 'Imię i nazwisko odbiorcy / zamawiającego *',
    customerNamePlaceholder: 'Np. Anna Nowak / Jan Kowalski',
    phoneNumber: 'Numer telefonu odbiorcy (+380)',
    phoneNumberPlaceholder: '+380 (98) 123-45-67',
    addressComment: 'Adres dostawy we Lwowie (lub Odbiór osobisty)',
    addressCommentPlaceholder: 'Lwów, ul. Horodecka 12 m. 5... lub odbiór: ul. Topolna 4B',
    cardMessage: 'Treść darmowego bileciku do bukietu',
    cardMessagePlaceholder: 'Napisz kilka ciepłych słów, które ręcznie wpiszemy do bileciku...',
    itemsInOrder: 'Bukietów i dodatków',
    delivery: 'Dostawa kurierska we Lwowie',
    freeDelivery: 'Darmowa od 1 500 ₴',
    totalToPay: 'Łącznie do zapłaty:',
    proceedToCheckout: 'Zamów i opłać kwiaty',
    orderSuccessTitle: 'Zamówienie kwiatów zostało przyjęte!',
    orderSuccessDesc: 'Floryści Flowers Lviv przy ul. Topolnej 4B rozpoczęli już układanie Twojego bukietu. Dostarczymy go z dbałością o każdy detal!',
    orderNumber: 'Zamówienie',
    orderStatus: 'Status:',
    orderPending: 'Nowe / Oczekuje',
    orderPaid: 'Opłacone',
    orderAssembling: 'Florysta układa bukiet',
    orderReadyForPickup: 'Gotowy dla kuriera / Odbiór',
    orderInDelivery: 'Kurier w drodze po Lwowie',
    orderCompleted: 'Dostarczone do odbiorcy',
    orderCancelled: 'Anulowane',
    backToShopping: 'Wróć do kwiaciarni',
    roleBuyer: 'Klient',
    roleAdmin: 'Florysta / Admin',
    roleCourier: 'Kurier',
    adminProducts: 'Bukiety',
    adminCategories: 'Kategorie',
    adminOrders: 'Zamówienia',
    adminAddProduct: 'Dodaj bukiet',
    adminManageCategories: 'Kategorie',
    adminEditProduct: 'Edytuj bukiet',
    adminNewProduct: 'Nowy bukiet lub dodatek',
    adminProductTitle: 'Nazwa bukietu / kompozycji *',
    adminProductTitlePlaceholder: 'Np. Bukiet «Różany Poranek» XL',
    adminCategory: 'Kategoria *',
    adminPrice: 'Cena (₴ / UAH) *',
    adminDescription: 'Skład kwiatów i opis',
    adminDescriptionPlaceholder: 'Skład: róże gałązkowe, eustoma, piwonie, eukaliptus, papier ozdobny...',
    adminImage: 'Zdjęcie bukietu',
    adminImagePlaceholder: 'Link do zdjęcia (URL) lub plik...',
    adminUploadImage: 'Prześlij zdjęcie',
    adminProductInStock: 'Świeże kwiaty dostępne w studio',
    adminPublishToChannel: '📢 Opublikuj w kanale Telegram po zapisaniu',
    adminChannelUsername: 'Kanał Telegram do publikacji',
    adminChannelUsernamePlaceholder: '@nazwa_kanalu lub -100xxxxxxxx',
    adminSave: 'Zapisz zmiany',
    adminCreate: 'Dodaj do witryny',
    adminCategoriesTitle: 'Zarządzanie kategoriami kwiatów',
    adminNewCategory: 'Nowa kategoria',
    adminEditCategory: 'Edycja kategorii',
    adminCategoryName: 'Nazwa kategorii *',
    adminCategoryNamePlaceholder: 'Np. Flower Box & Kosze',
    adminIcon: 'Ikona',
    adminCurrentCategories: 'Aktualne kategorie',
    adminOrdersTitle: 'Wszystkie zamówienia Flowers Lviv',
    adminOrderItems: 'Skład zamówienia:',
    adminChangeStatus: 'Zmień status:',
    adminNoOrders: 'Brak zamówień',
    adminDeleteConfirm: 'Czy na pewno chcesz usunąć ten bukiet?',
    adminDeleteCategoryConfirm: 'Usunąć kategorię? Wszystkie powiązane bukiety zostaną usunięte.',
    errorNameRequired: 'Proszę podać imię i nazwisko odbiorcy',
    errorOrderFailed: 'Wystąpił błąd podczas składania zamówienia',
    errorPriceRequired: 'Proszę podać prawidłową cenę w ₴ (UAH)',
    errorTitleRequired: 'Nazwa bukietu jest wymagana',
    errorCategoryNameRequired: 'Nazwa kategorii jest wymagana',
    paczkomatOrAddress: 'Szybka dostawa kurierem na terenie Lwowa i okolic',
    upsellTitle: 'Coś do bukietu? 🎁',
    upsellSubtitle: 'Spraw, aby prezent był jeszcze bardziej wyjątkowy:',
    addToOrder: '+ Dodaj',
    addedToOrder: '✓ W zamówieniu',
    publishedSuccess: 'Bukiet został pomyślnie opublikowany w kanale z przyciskiem zakupu!',

    deliveryTimingTitle: 'Data i godzina dostawy we Lwowie',
    deliveryDateLabel: 'Data dostawy',
    deliveryTimeLabel: 'Godzina doręczenia (10:00 – 20:00)',
    surpriseDeliveryTitle: 'Dostawa-niespodzianka (Anonimowo)',
    surpriseDeliveryDesc: 'Nie podawać imienia zamawiającego do momentu wręczenia',
    needCallRecipientTitle: 'Ustal dokładny adres u odbiorcy',
    needCallRecipientDesc: 'Kurier skontaktuje się z odbiorcą i ustali dogodny adres doręczenia',
    today: 'Dziś',
    tomorrow: 'Jutro',

    storeAddress: 'Lwów, ul. Topolna 4B',
    workingHours: 'Codziennie 10:00 – 20:00',
    instagramBadge: '@flowers___lviv',
    fastDeliveryBadge: 'Dostawa od 60 min',
    chrysalFreeBadge: 'Chrysal gratis',
    pickupInfo: 'Odbiór osobisty: ul. Topolna 4B (bezpłatnie)',

    aiFloristBannerTitle: '🌸 AI-Florysta: Dobierz bukiet w 15 sekund',
    aiFloristBannerSubtitle: 'Odpowiedz na 3 pytania i otrzymaj idealny bukiet dopasowany do okazji i budżetu',
    aiFloristOpenButton: 'Dobierz bukiet ✨',
    aiFloristModalTitle: 'AI-Florysta • Flowers Lviv',
    aiFloristStep1: '1. Na jaką okazję szukasz kwiatów?',
    aiFloristStep2: '2. Twój budżet w hrywnach (₴):',
    aiFloristStep3: '3. Preferowana kolorystyka:',
    aiFloristResultsTitle: '✨ Idealne bukiety dla Ciebie we Lwowie:',
    aiFloristResultsSubtitle: 'Wybraliśmy najpiękniejsze kompozycje dopasowane do Twoich potrzeb',
    aiFloristBack: 'Wstecz',
    aiFloristNext: 'Dalej →',
    aiFloristClose: 'Zamknij',
    aiFloristRestart: 'Zacznij od nowa ↺',

    occLove: '❤️ Romantyczna / Miłość',
    occBirthday: '🎂 Urodziny / Imieniny',
    occMom: '👩 Dla Mamy / Babci',
    occWedding: '💍 Ślub / Rocznica',
    occSorry: '🥺 Przeprosiny / Zgoda',
    occJustBecause: '✨ Bez okazji / Niespodzianka',

    budgetUnder200: 'Do 1 200 ₴ (Kameralny)',
    budget200To350: '1 200 – 2 200 ₴ (Popularny)',
    budget350To500: '2 200 – 3 800 ₴ (Okazały XL)',
    budgetVip: 'Od 3 800 ₴ (Royal VIP / 101 róż)',

    palettePastel: '🌸 Delikatna pastelowa (róż, krem, eustoma)',
    paletteRed: '🌹 Namiętna czerwona / bordowa (Red Naomi)',
    paletteYellow: '🌻 Słoneczna żółta / ciepła',
    paletteMixed: '🎨 Kolorowy autorski miks florystyczny',

    courierDashboardTitle: 'Panel Kuriera • Flowers Lviv',
    courierActiveDeliveries: 'Do doręczenia',
    courierCompletedDeliveries: 'Doręczone',
    courierNoDeliveries: 'Brak aktywnych dostaw we Lwowie w tym momencie 🌸',
    courierStartDelivery: '🚗 W drodze do odbiorcy',
    courierMarkDelivered: '✅ Bukiet doręczony!',
    courierOpenMap: 'Nawigacja (Google Maps)',
    courierCallRecipient: 'Zadzwoń',
    courierSurpriseBadge: '🤫 NIESPODZIANKA (Anonim)',
    courierCallNeededBadge: '📞 Ustal adres',
    courierDeliveryTime: 'Godzina dostawy:',
  },

  ru: {
    appName: 'Flowers Lviv',
    subtitle: 'Цветы и авторские букеты во Львове',
    searchPlaceholder: 'Поиск букетов, роз, подарков во Львове...',
    allCategories: 'Все букеты',
    emptyProductsTitle: 'Букеты не найдены',
    emptyProductsDesc: 'В этой категории пока нет цветов или ничего не найдено по запросу',
    resetFilters: 'Показать все букеты',
    loadingCatalog: 'Собираем свежие букеты Flowers Lviv...',
    retry: 'Повторить',
    addToCart: 'В корзину',
    outOfStock: 'Нет в наличии',
    inStock: 'Свежая поставка в студии',
    inCart: 'В корзине',
    cart: 'Корзина',
    cartEmptyTitle: 'В корзине пока нет цветов',
    cartEmptyDesc: 'Выберите понравившийся букет Flowers Lviv, чтобы оформить доставку по Львову или самовывоз с ул. Топольной 4В.',
    goToCatalog: 'Выбрать букет',
    clearCart: 'Очистить',
    backToCatalog: 'Назад к цветам',
    contactInfo: 'Доставка по Львову и контакты',
    customerName: 'Имя и фамилия получателя / заказчика *',
    customerNamePlaceholder: 'Например: Елена Ковальчук / Тарас',
    phoneNumber: 'Телефон получателя или заказчика (+380)',
    phoneNumberPlaceholder: '+380 (98) 123-45-67',
    addressComment: 'Адрес доставки во Львове (или Самовывоз)',
    addressCommentPlaceholder: 'г. Львов, ул. Городоцкая 12, кв. 5... или самовывоз: ул. Топольная, 4В',
    cardMessage: 'Текст к бесплатной открытке в букет',
    cardMessagePlaceholder: 'Напишите ваши пожелания, флористы бережно подпишут авторскую открытку...',
    itemsInOrder: 'Букетов и подарков',
    delivery: 'Курьерская доставка по Львову',
    freeDelivery: 'Бесплатно от 1 500 ₴',
    totalToPay: 'Итого к оплате:',
    proceedToCheckout: 'Оформить и оплатить заказ',
    orderSuccessTitle: 'Заказ цветов успешно оформлен!',
    orderSuccessDesc: 'Флористы Flowers Lviv на Топольной 4В уже начали собирать ваш свежий букет. Доставим бережно и вовремя!',
    orderNumber: 'Заказ',
    orderStatus: 'Статус:',
    orderPending: 'Новый / Ожидает',
    orderPaid: 'Оплачен',
    orderAssembling: 'Флорист собирает букет',
    orderReadyForPickup: 'Готов к выдаче / Самовывоз',
    orderInDelivery: 'Курьер в пути по Львову',
    orderCompleted: 'Доставлен получателю',
    orderCancelled: 'Отменен',
    backToShopping: 'Вернуться в студию',
    roleBuyer: 'Клиент',
    roleAdmin: 'Флорист / Админ',
    roleCourier: 'Курьер',
    adminProducts: 'Букеты',
    adminCategories: 'Категории',
    adminOrders: 'Заказы',
    adminAddProduct: 'Добавить букет',
    adminManageCategories: 'Категории',
    adminEditProduct: 'Редактировать букет',
    adminNewProduct: 'Новый букет или подарок',
    adminProductTitle: 'Название букета / композиции *',
    adminProductTitlePlaceholder: 'Например: Букет «Пионовый рассвет» XL',
    adminCategory: 'Категория *',
    adminPrice: 'Цена (₴ / UAH) *',
    adminDescription: 'Состав цветов и описание',
    adminDescriptionPlaceholder: 'Состав: пионы, кустовая роза, эвкалипт, оксипеталум, дизайнерская упаковка...',
    adminImage: 'Фотография букета',
    adminImagePlaceholder: 'Ссылка на фото (URL) или загрузка...',
    adminUploadImage: 'Загрузить фото',
    adminProductInStock: 'Свежие цветы в наличии в студии',
    adminPublishToChannel: '📢 Опубликовать в Telegram-канал при сохранении',
    adminChannelUsername: 'Telegram-канал для автопостинга',
    adminChannelUsernamePlaceholder: '@nazwa_kanalu или -100xxxxxxxx',
    adminSave: 'Сохранить изменения',
    adminCreate: 'Добавить в витрину',
    adminCategoriesTitle: 'Управление категориями цветов',
    adminNewCategory: 'Новая категория',
    adminEditCategory: 'Редактирование категории',
    adminCategoryName: 'Название категории *',
    adminCategoryNamePlaceholder: 'Например: Flower Box & Коробки',
    adminIcon: 'Иконка',
    adminCurrentCategories: 'Текущие категории',
    adminOrdersTitle: 'Все заказы цветов Flowers Lviv',
    adminOrderItems: 'Состав заказа:',
    adminChangeStatus: 'Изменить статус:',
    adminNoOrders: 'Заказов пока нет',
    adminDeleteConfirm: 'Удалить этот букет?',
    adminDeleteCategoryConfirm: 'Удалить категорию? Все привязанные букеты также будут удалены.',
    errorNameRequired: 'Пожалуйста, укажите имя получателя или заказчика',
    errorOrderFailed: 'Ошибка при оформлении заказа',
    errorPriceRequired: 'Укажите корректную стоимость букета в ₴',
    errorTitleRequired: 'Укажите название букета',
    errorCategoryNameRequired: 'Введите название категории',
    paczkomatOrAddress: 'Быстрая доставка курьером по Львову и области',
    upsellTitle: 'Добавить к букету 🎁',
    upsellSubtitle: 'Сделайте ваш сюрприз еще более запоминающимся:',
    addToOrder: '+ Добавить',
    addedToOrder: '✓ В заказе',
    publishedSuccess: 'Букет успешно опубликован в канал с кнопкой заказа!',

    deliveryTimingTitle: 'Дата и время доставки по Львову',
    deliveryDateLabel: 'Дата доставки',
    deliveryTimeLabel: 'Время доставки (10:00 – 20:00)',
    surpriseDeliveryTitle: 'Доставка-сюрприз (Анонимно)',
    surpriseDeliveryDesc: 'Не называть имя заказчика до момента торжественного вручения',
    needCallRecipientTitle: 'Уточнить точный адрес у получателя',
    needCallRecipientDesc: 'Курьер вежливо позвонит получателю и согласует адрес и время',
    today: 'Сегодня',
    tomorrow: 'Завтра',

    storeAddress: 'г. Львов, ул. Топольная, 4В',
    workingHours: 'Ежедневно 10:00 – 20:00',
    instagramBadge: '@flowers___lviv',
    fastDeliveryBadge: 'Доставка от 60 мин',
    chrysalFreeBadge: 'Chrysal в подарок',
    pickupInfo: 'Самовывоз: ул. Топольная, 4В (бесплатно)',

    aiFloristBannerTitle: '🌸 AI-Флорист: Подобрать букет за 15 секунд',
    aiFloristBannerSubtitle: 'Ответьте на 3 вопроса и получите персональную подборку композиций Flowers Lviv',
    aiFloristOpenButton: 'Подобрать букет ✨',
    aiFloristModalTitle: 'AI-Флорист • Flowers Lviv',
    aiFloristStep1: '1. По какому поводу дарите цветы?',
    aiFloristStep2: '2. Комфортный бюджет в гривнах (₴):',
    aiFloristStep3: '3. Предпочтительная цветовая гамма:',
    aiFloristResultsTitle: '✨ Идеальные букеты для вас во Львове:',
    aiFloristResultsSubtitle: 'Мы подобрали лучшие композиции под ваш запрос',
    aiFloristBack: 'Назад',
    aiFloristNext: 'Далее →',
    aiFloristClose: 'Закрыть',
    aiFloristRestart: 'Начать сначала ↺',

    occLove: '❤️ Романтика / Любовь',
    occBirthday: '🎂 День рождения / Праздник',
    occMom: '👩 Любимой Маме / Бабушке',
    occWedding: '💍 Свадьба / Годовщина',
    occSorry: '🥺 Извинение / Примирение',
    occJustBecause: '✨ Просто так / Без повода',

    budgetUnder200: 'До 1 200 ₴ (Уютный комплимент)',
    budget200To350: '1 200 – 2 200 ₴ (Популярный букет)',
    budget350To500: '2 200 – 3 800 ₴ (Пышный XL)',
    budgetVip: 'От 3 800 ₴ (Royal VIP / 101 роза)',

    palettePastel: '🌸 Нежная пастельная (розовый, крем, эустома)',
    paletteRed: '🌹 Страстная красная (Red Naomi, бордо)',
    paletteYellow: '🌻 Солнечная теплая (подсолнухи, желтые розы)',
    paletteMixed: '🎨 Яркий разноцветный авторский микс',

    courierDashboardTitle: 'Кабинет курьера Flowers Lviv',
    courierActiveDeliveries: 'К доставке',
    courierCompletedDeliveries: 'Доставлено',
    courierNoDeliveries: 'Сейчас нет активных доставок по Львову 🌸',
    courierStartDelivery: '🚗 Выехал к получателю',
    courierMarkDelivered: '✅ Букет вручен!',
    courierOpenMap: 'Навигатор (Google Maps)',
    courierCallRecipient: 'Позвонить',
    courierSurpriseBadge: '🤫 СЮРПРИЗ (Анонимно)',
    courierCallNeededBadge: '📞 Уточнить адрес',
    courierDeliveryTime: 'Время доставки:',
  },
};

// Localized mapping for Categories
export const CATEGORY_TRANSLATIONS: Record<number, Record<Language, string>> = {
  1: {
    ua: 'Авторські букети',
    pl: 'Bukiety Autorskie',
    ru: 'Авторские букеты',
  },
  2: {
    ua: 'Троянди & Монобукети',
    pl: 'Róże & Mono',
    ru: 'Розы и монобукеты',
  },
  3: {
    ua: 'Flower Box & Кошики',
    pl: 'Flower Box & Kosze',
    ru: 'Цветочные коробки и корзины',
  },
  4: {
    ua: 'Кімнатні рослини & Орхідеї',
    pl: 'Rośliny & Storczyki',
    ru: 'Комнатные растения и орхидеи',
  },
  5: {
    ua: 'Подарунки & Аксесуари',
    pl: 'Upominki & Akcesoria',
    ru: 'Подарки и аксессуары',
  },
};

// Localized mapping for Products with realistic Lviv floristry descriptions
export const PRODUCT_TRANSLATIONS: Record<
  number,
  Record<Language, { title: string; description: string }>
> = {
  1: {
    ua: {
      title: 'Букет «Рожева Магія» Преміум',
      description:
        'Пишна авторська композиція з кущових півонієподібних троянд, ніжної кремової еустоми, хризантем, гвоздик та свіжого запашного евкаліпта. Дизайнерське матове пакування Flowers Lviv із шовковими стрічками.',
    },
    pl: {
      title: 'Bukiet «Różowa Magia» Premium',
      description:
        'Puszysta kompozycja z róż gałązkowych, kremowej eustomy, chryzantem pastelowych, goździków i pachnącego eukaliptusa w eleganckim matowym papierze Flowers Lviv.',
    },
    ru: {
      title: 'Букет «Розовая Магия» Премиум',
      description:
        'Пышная авторская композиция из пионовидных кустовых роз, нежной эустомы, хризантем, гвоздик и эвкалипта в дизайнерской упаковке Flowers Lviv.',
    },
  },
  2: {
    ua: {
      title: 'Букет «Сонячний Ранок» XL',
      description:
        'Життєрадісний яскравий букет із добірних соняшників, теплих жовтих троянд, ромашок, альстромерій та декоративної зелені. Наповнює дім теплом та щирою радістю!',
    },
    pl: {
      title: 'Bukiet «Słoneczny Poranek» XL',
      description:
        'Energetyczny bukiet ze słoneczników, żółtych róż ogrodowych, rumianku, alstromerii oraz zieleni dekoracyjnej. Rozświetli każdy dzień!',
    },
    ru: {
      title: 'Букет «Солнечное Утро» XL',
      description:
        'Яркий и жизнерадостный букет из подсолнухов, желтых роз, ромашек, альстромерий и декоративной зелени. Дарит свет и улыбки!',
    },
  },
  3: {
    ua: {
      title: 'Букет «Півонієвий Сон» Grand Luxury',
      description:
        'Ексклюзивний букет королівського масштабу: голландські півонії Sarah Bernhardt, пишна гортензія, сортові троянди та сизий евкаліпт Populus. Розмір XXL для найважливіших моментів життя.',
    },
    pl: {
      title: 'Bukiet «Piwoniowy Sen» Grand Luxury',
      description:
        'Ekskluzywny bukiet z holenderskich piwonii Sarah Bernhardt, hortensji różowej, róż Madame Red i eukaliptusa Populus. Rozmiar XXL.',
    },
    ru: {
      title: 'Букет «Пионовый Сон» Grand Luxury',
      description:
        'Эксклюзивный королевский букет из голландских пионов Sarah Bernhardt, пышной гортензии, сортовых роз и эвкалипта Populus. Размер XXL.',
    },
  },
  4: {
    ua: {
      title: 'Монобукет із 25 червоних троянд Red Naomi',
      description:
        'Класичні оксамитові червоні троянди найвищого ґатунку висотою 60 см. Ідеальний і перевірений символ справжнього палкого кохання, перев’язаний атласною стрічкою.',
    },
    pl: {
      title: 'Mono Bukiet 25 Czerwonych Róż Red Naomi',
      description:
        'Klasyczne, aksamitne czerwone róże premium o długości 60 cm. Związane czerwoną satynową wstążką.',
    },
    ru: {
      title: 'Монобукет из 25 красных роз Red Naomi',
      description:
        'Классические бархатные красные розы премиум-класса длиной 60 см. Идеальный символ любви, перевязанный шелковой лентой.',
    },
  },
  5: {
    ua: {
      title: 'Монобукет із 19 пудрових троянд Mondial',
      description:
        'Ніжні кремово-пудрові троянди з великими хвилястими пелюстками в мінімалістичному фірмовому оформленні. Бездоганний вибір для витонченого подарунка.',
    },
    pl: {
      title: 'Mono Bukiet 19 Róż Pudrowych Mondial',
      description:
        'Delikatne kremowo-pudrowe róże wielkokwiatowe w minimalistycznym opakowaniu.',
    },
    ru: {
      title: 'Монобукет из 19 пудровых роз Mondial',
      description:
        'Нежные кремово-пудровые розы с крупными бутонами в лаконичной фирменной упаковке.',
    },
  },
  6: {
    ua: {
      title: 'Flower Box «Пудровий Оксамит» Velvet',
      description:
        'Стильна кругла оксамитова коробка Flowers Lviv на флористичному оазисі з водою. Троянда, еустома, гортензія та евкаліпт. Не потребує вази та довго зберігає свіжість!',
    },
    pl: {
      title: 'Flower Box «Pudrowy Aksamit» Velvet',
      description:
        'Kompozycja w welurowym okrągłym pudle z gąbką florystyczną nasączoną wodą. Kwiaty nie wymagają wazonu!',
    },
    ru: {
      title: 'Flower Box «Пудровый Бархат» Velvet',
      description:
        'Стильная бархатная круглая коробка на флористическом оазисе с водой. Цветы не требуют вазы!',
    },
  },
  7: {
    ua: {
      title: 'Плетений кошик квітів «Прованс»',
      description:
        'Ароматна та повітряна композиція в натуральному плетеному кошику ручної роботи: гортензія, гілочки лаванди, кущова півонієподібна троянда та еустома. Стійкість до 10 днів.',
    },
    pl: {
      title: 'Kosz Wiklinowy «Prowansja»',
      description:
        'Rustykalny wiklinowy kosz pełen eustomy, lawendy, hortensji oraz róż gałązkowych. Trwałość do 10 dni.',
    },
    ru: {
      title: 'Плетеный корзинный букет «Прованс»',
      description:
        'Воздушная композиция в натуральной плетеной корзине: гортензия, лаванда, кустовая роза и эустома.',
    },
  },
  8: {
    ua: {
      title: 'Орхідея Фаленопсис 2-стовбурова в кашпо',
      description:
        'Елегантна білосніжна орхідея преміум-сорту в керамічному дизайнерському кашпо. Квітне до 3–4 місяців та прикрашає будь-який інтер’єр.',
    },
    pl: {
      title: 'Storczyk Orchidea Phalaenopsis 2-pędowa',
      description:
        'Długokwitnąca biała orchidea w designerskiej ceramicznej osłonce.',
    },
    ru: {
      title: 'Орхидея Фаленопсис 2-ствольная в кашпо',
      description:
        'Элегантная орхидея в керамическом кашпо. Цветет до 3–4 месяцев!',
    },
  },
  9: {
    ua: {
      title: 'Монстера делікатесна (Monstera Deliciosa) XL',
      description:
        'Розкішна кімнатна рослина з великим різьбленим смарагдовим листям. Висота 65–70 см, висаджена у поживний ґрунт.',
    },
    pl: {
      title: 'Monstera Deliciosa Dziurawa XL',
      description:
        'Królowa roślin domowych o spektakularnych, powcinanych liściach. Wysokość ok. 65 cm.',
    },
    ru: {
      title: 'Монстера деликатесная (Monstera Deliciosa) XL',
      description:
        'Эффектное интерьерное растение с крупными резными изумрудными листьями.',
    },
  },
  10: {
    ua: {
      title: 'Скляна циліндрична ваза для букетів 25 см',
      description:
        'Міцне прозоре скло класичної форми. Ідеально підходить за висотою та об’ємом для будь-якого букета з нашої студії.',
    },
    pl: {
      title: 'Szklany Wazon Cylindryczny 25cm',
      description:
        'Grube, przezroczyste szkło idealnie pasujące do bukietów średnich i dużych.',
    },
    ru: {
      title: 'Стеклянная цилиндрическая ваза 25 см',
      description:
        'Прочное прозрачное стекло идеального диаметра для средних и больших букетов.',
    },
  },
  11: {
    ua: {
      title: 'Цукерки Ferrero Rocher / Raffaello 200г',
      description:
        'Вишукані шоколадні цукерки у золотистій святковій упаковці — найсолодший додаток до квітів.',
    },
    pl: {
      title: 'Praliny Ferrero Rocher / Raffaello 200g',
      description:
        'Kultowe słodkie praliny dla wyjątkowej osoby w Twoim życiu.',
    },
    ru: {
      title: 'Конфеты Ferrero Rocher / Raffaello 200г',
      description:
        'Изысканные конфеты в подарочной упаковке — идеальное дополнение к букету.',
    },
  },
  12: {
    ua: {
      title: '51 червона троянда «Палаюче Кохання»',
      description:
        'Незабутній величний букет із 51 свіжої червоної троянди 60 см від майстрів Flowers Lviv. Ідеально для пропозиції руки та серця чи річниці.',
    },
    pl: {
      title: '51 Czerwonych Róż «Płonąca Miłość»',
      description:
        'Niezapomniany bukiet z 51 wyselekcjonowanych czerwonych róż 60 cm. Idealny na oświadczyny i rocznice.',
    },
    ru: {
      title: '51 красная роза «Пылкая Любовь»',
      description:
        'Впечатляющий букет из 51 отборной красной розы 60 см. Идеально для предложения руки и сердца.',
    },
  },
  13: {
    ua: {
      title: 'Букет «Ніжна Гортензія & Еустома»',
      description:
        'Повітряний блакитно-кремовий авторський букет з об’ємної голландської гортензії, білої еустоми, фрезії та евкаліпта.',
    },
    pl: {
      title: 'Bukiet «Błękitna Hortensja & Eustoma»',
      description:
        'Świeży błękitno-kremowy bukiet z holenderskiej hortensji, eustomy, frezji oraz pachnącego eukaliptusa.',
    },
    ru: {
      title: 'Букет «Нежная Гортензия & Эустома»',
      description:
        'Воздушный небесно-кремовый букет из голландской гортензии, эустомы и эвкалипта.',
    },
  },
  14: {
    ua: {
      title: 'Весняний мікс із 35 тюльпанів «Львівський Ранок»',
      description:
        'Ніжний та свіжий мікс із добірних сортових тюльпанів пастельних, рожевих та сонячних відтінків у крафті.',
    },
    pl: {
      title: 'Wiosenny Miks 35 Tulipanów',
      description:
        'Pachnący miks świeżych tulipanów w pastelowych i żółtych odcieniach.',
    },
    ru: {
      title: 'Весенний микс из 35 тюльпанов',
      description:
        'Нежный и свежий букет из 35 сортовых тюльпанов в крафтовом оформлении.',
    },
  },
  15: {
    ua: {
      title: 'Flower Box «Пристрасть & Золото» 29 троянд',
      description:
        'Елегантна преміальна коробка Flowers Lviv із золотим тисненням, наповнена 29 оксамитовими бордовими трояндами.',
    },
    pl: {
      title: 'Flower Box «Pasja & Złoto» 29 Róż',
      description:
        'Eleganckie czarne pudełko ze złotym tłoczeniem wypełnione 29 aksamitnymi bordowymi różami.',
    },
    ru: {
      title: 'Flower Box «Страсть & Золото» 29 роз',
      description:
        'Премиальная бархатная коробка с золотым тиснением, наполненная 29 бордовыми розами.',
    },
  },
  16: {
    ua: {
      title: 'Королівський кошик 101 троянда «Імператор»',
      description:
        'Гігантський кошик ручної роботи зі 101 свіжої троянди преміум-ґатунку. Справжній шедевр флористичного мистецтва студії Flowers Lviv.',
    },
    pl: {
      title: 'Królewski Kosz 101 Róż «Imperator»',
      description:
        'Imponujący wiklinowy kosz gigant ze 101 różami premium. Symbol najwyższego luksusu.',
    },
    ru: {
      title: 'Королевская корзина 101 роза «Император»',
      description:
        'Огромная плетеная корзина со 101 премиальной розой. Максимальный вау-эффект!',
    },
  },
  17: {
    ua: {
      title: 'Букет авторський «Лавандовий Світанок»',
      description:
        'Витончений букет у фіолетово-рожевих відтінках: левкої, кущові троянди, лімоніум та евкаліпт.',
    },
    pl: {
      title: 'Bukiet Autorski «Lawendowy Zmierzch»',
      description:
        'Subtelny bukiet w fioletowo-różowej tonacji z lewkonii, róż gałązkowych i limonium.',
    },
    ru: {
      title: 'Букет авторский «Лавандовый Рассвет»',
      description:
        'Утонченный букет в лавандово-розовых оттенках с кустовыми розами и эвкалиптом.',
    },
  },
  18: {
    ua: {
      title: 'Монобукет із 15 півонієподібних троянд «Misty Bubbles»',
      description:
        'Круглі шароподібні троянди насиченого фіолетово-малинового кольору з п’янким легким ароматом.',
    },
    pl: {
      title: 'Mono Bukiet 15 Róż «Misty Bubbles»',
      description:
        'Urocze kuliste róże piwoniowe o głębokim fioletowo-różowym odcieniu.',
    },
    ru: {
      title: 'Монобукет из 15 пионовидных роз «Misty Bubbles»',
      description:
        'Очаровательные шаровидные розы насыщенного малиново-пурпурного оттенка.',
    },
  },
  19: {
    ua: {
      title: 'Букет «Вершковий Пломбір» із садовими трояндами',
      description:
        'Ніжний кремово-ванільний букет із французьких садових троянд garden, хмаринки гіпсофіли та білих альстромерій.',
    },
    pl: {
      title: 'Bukiet «Śmietankowe Lody»',
      description:
        'Kremowo-waniliowy bukiet z francuskich róż garden, gipsówki i białych alstromerii.',
    },
    ru: {
      title: 'Букет «Сливочный Пломбир» с садовыми розами',
      description:
        'Кремово-ванильный букет из садовых роз, белой гипсофилы и альстромерий.',
    },
  },
  20: {
    ua: {
      title: 'Flower Box «Сонячні Промені»',
      description:
        'Яскрава коробочка з міні-соняшниками, ромашкою та жовтими кущовими трояндами. Покращує настрій з першого погляду!',
    },
    pl: {
      title: 'Flower Box «Słoneczne Promienie»',
      description:
        'Jasny Flower Box ze słonecznikami, rumiankami i żółtymi goździkami.',
    },
    ru: {
      title: 'Flower Box «Солнечные Лучи»',
      description:
        'Яркая коробка с мини-подсолнухами, ромашками и желтыми розами.',
    },
  },
  21: {
    ua: {
      title: '101 ніжно-рожева троянда «Aqua Romance»',
      description:
        'Приголомшливий букет зі 101 рожевої троянди. Незабутній жест для найдорожчої людини у світі.',
    },
    pl: {
      title: 'Mono Bukiet 101 Róż «Aqua Romance»',
      description:
        'Olśniewający bukiet 101 różowych róż dla najważniejszej osoby w życiu.',
    },
    ru: {
      title: '101 нежно-розовая роза «Aqua Romance»',
      description:
        'Ослепительный букет из 101 розовой розы для самого важного человека.',
    },
  },
  22: {
    ua: {
      title: 'Композиція «Лісова Казка» у дерев’яному кашпо',
      description:
        'Еко-композиція в натуральному дерев’яному ящичку зі стабілізованим мохом, міні-трояндами та сукулентами.',
    },
    pl: {
      title: 'Kompozycja «Leśna Baśń» w Drewnie',
      description:
        'Naturalna kompozycja w drewnianej skrzyneczce z mchem i mini-różami.',
    },
    ru: {
      title: 'Композиция «Лесная Сказка» в деревянном кашпо',
      description:
        'Эко-композиция в деревянном ящичке с живым мхом, мини-розами и сухоцветами.',
    },
  },
  23: {
    ua: {
      title: 'Букет «Чисте Натхнення» з білих лілій та троянд',
      description:
        'Шляхетний білий букет з ароматних східних лілій, білих троянд Avalanche та евкаліпта.',
    },
    pl: {
      title: 'Bukiet «Czysta Inspiracja» z Lilii i Róż',
      description:
        'Klasyczny biały bukiet z pachnących lilii orientalnych, białych róż avalanche i eukaliptusa.',
    },
    ru: {
      title: 'Букет «Чистое Вдохновение» из белых лилий и роз',
      description:
        'Благородный белый букет из восточных лилий, белоснежных роз Avalanche и эвкалипта.',
    },
  },
  24: {
    ua: {
      title: 'Букет із 11 пухнастих гортензій «Хмаринка Ніжності»',
      description:
        'Величезний оберемок свіжих сортових гортензій пастельно-рожевих, білих та блакитних кольорів. Вау-ефект гарантовано!',
    },
    pl: {
      title: 'Bukiet 11 Hortensji «Obłok Czułości»',
      description:
        'Puszyste pastelowe hortensje w odcieniach różu, błękitu i bieli.',
    },
    ru: {
      title: 'Букет из 11 пушистых гортензий «Облако Нежности»',
      description:
        'Пышное облако гортензий пастельных оттенков с колоссальным объемом.',
    },
  },
  101: {
    ua: {
      title: 'Авторська листівка з вашим текстом (від руки)',
      description:
        'Красива листівка з щільного паперу, на якій флорист красиво виведе ваші побажання каліграфічним почерком.',
    },
    pl: {
      title: 'Bilecik z Twoją dedykacją',
      description:
        'Elegancki kartonik, w którym odręcznie wykaligrafujemy Twoje życzenia.',
    },
    ru: {
      title: 'Авторская открытка с вашим текстом (от руки)',
      description:
        'Плотная дизайнерская открытка, которую флорист подпишет красивым почерком.',
    },
  },
  102: {
    ua: {
      title: 'Підживлення для квітів Chrysal (3 саше)',
      description:
        'Професійне голландське добриво, що зберігає кришталеву чистоту води та подовжує життя букета до 2 тижнів.',
    },
    pl: {
      title: 'Odżywka do kwiatów Chrysal (3 szt)',
      description:
        'Przedłuża świeżość i trwałość ciętych kwiatów nawet o tydzień.',
    },
    ru: {
      title: 'Подкормка для цветов Chrysal (3 саше)',
      description:
        'Продлевает жизнь срезанных цветов и сохраняет воду в вазе чистой.',
    },
  },
  103: {
    ua: {
      title: 'Повітряна кулька з гелієм «Серце»',
      description:
        'Фольговане глянцеве серце на довгій шовковій стрічці, прив’язане до букета.',
    },
    pl: {
      title: 'Balon Foliowy z Helem «Serce»',
      description:
        'Czerwony lub różowy balon z helem na wstążce przywiązany do bukietu.',
    },
    ru: {
      title: 'Воздушный шар с гелием «Сердце»',
      description:
        'Фольгированное глянцевое сердце на шелковой ленте к букету.',
    },
  },
};

export function getLocalizedCategoryName(category: Category, lang: Language): string {
  if (lang === 'ua' && category.name_ua) return category.name_ua;
  if (lang === 'pl' && category.name_pl) return category.name_pl;
  if (lang === 'ru' && category.name_ru) return category.name_ru;

  const translation = CATEGORY_TRANSLATIONS[category.id];
  if (translation && translation[lang]) {
    return translation[lang];
  }

  return category.name;
}

export function getLocalizedProduct(product: Product, lang: Language): Product {
  let title = product.title;
  let description = product.description;

  if (lang === 'ua') {
    if (product.title_ua) title = product.title_ua;
    if (product.description_ua) description = product.description_ua;
  } else if (lang === 'pl') {
    if (product.title_pl) title = product.title_pl;
    if (product.description_pl) description = product.description_pl;
  } else if (lang === 'ru') {
    if (product.title_ru) title = product.title_ru;
    if (product.description_ru) description = product.description_ru;
  }

  const mapTranslation = PRODUCT_TRANSLATIONS[product.id];
  if (mapTranslation && mapTranslation[lang]) {
    title = mapTranslation[lang].title;
    description = mapTranslation[lang].description;
  }

  const catTranslation = CATEGORY_TRANSLATIONS[product.category_id];
  const category_name =
    catTranslation && catTranslation[lang]
      ? catTranslation[lang]
      : product.category_name;

  return {
    ...product,
    title,
    description,
    category_name,
  };
}
