import type { Category, Product } from '../types';

export type Language = 'ru' | 'pl' | 'ua';

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

  // Budgets
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
  ru: {
    appName: 'Flora Boutique',
    subtitle: 'Цветы и авторские букеты',
    searchPlaceholder: 'Поиск букетов, роз, подарков...',
    allCategories: 'Все букеты',
    emptyProductsTitle: 'Букеты не найдены',
    emptyProductsDesc: 'В этой категории пока нет цветов или ничего не найдено по запросу',
    resetFilters: 'Показать все букеты',
    loadingCatalog: 'Собираем свежие букеты...',
    retry: 'Повторить',
    addToCart: 'В корзину',
    outOfStock: 'Нет в наличии',
    inStock: 'Свежая поставка',
    inCart: 'В корзине',
    cart: 'Корзина',
    cartEmptyTitle: 'В корзине пока нет цветов',
    cartEmptyDesc: 'Выберите понравившийся букет в каталоге, чтобы оформить доставку или самовывоз.',
    goToCatalog: 'Выбрать букет',
    clearCart: 'Очистить',
    backToCatalog: 'Назад к цветам',
    contactInfo: 'Доставка цветов и контакты',
    customerName: 'Имя и фамилия получателя / заказчика *',
    customerNamePlaceholder: 'Например: Jan Kowalski / Анна',
    phoneNumber: 'Телефон получателя или заказчика (+48)',
    phoneNumberPlaceholder: '+48 500 123 456',
    addressComment: 'Адрес доставки (город, улица, дом, квартира)',
    addressCommentPlaceholder: 'Warszawa, ul. Złota 44 m. 12 (домофон 12, оставить у консьержа)...',
    cardMessage: 'Текст к бесплатной открытке в букет',
    cardMessagePlaceholder: 'Напишите ваши пожелания, мы бережно перенесем их на фирменную открытку...',
    itemsInOrder: 'Букетов и подарков',
    delivery: 'Курьерская доставка цветов',
    freeDelivery: 'Бесплатно от 250 zł',
    totalToPay: 'Итого к оплате:',
    proceedToCheckout: 'Оформить и оплатить заказ',
    orderSuccessTitle: 'Заказ цветов успешно оформлен!',
    orderSuccessDesc: 'Флористы уже начали собирать ваш свежий букет. Мы доставим его бережно и вовремя!',
    orderNumber: 'Заказ',
    orderStatus: 'Статус:',
    orderPending: 'Принят флористом / Ожидает',
    orderPaid: 'Оплачен',
    orderInDelivery: 'Курьер в пути 🚗',
    orderCompleted: 'Доставлен получателю 🎉',
    orderCancelled: 'Отменен',
    backToShopping: 'Вернуться в бутик',
    roleBuyer: 'Клиент',
    roleAdmin: 'Флорист / Админ',
    roleCourier: 'Курьер 🚗',
    adminProducts: 'Букеты',
    adminCategories: 'Категории',
    adminOrders: 'Заказы',
    adminAddProduct: 'Добавить букет',
    adminManageCategories: 'Категории',
    adminEditProduct: 'Редактировать букет',
    adminNewProduct: 'Новый букет или подарок',
    adminProductTitle: 'Название букета / композиции *',
    adminProductTitlePlaceholder: 'Например: Букет «Пионовый закат» XL',
    adminCategory: 'Категория *',
    adminPrice: 'Цена (zł / PLN) *',
    adminDescription: 'Состав цветов и описание',
    adminDescriptionPlaceholder: 'Состав: пионы, кустовая роза, эвкалипт, оксипеталум, дизайнерская упаковка...',
    adminImage: 'Фотография букета',
    adminImagePlaceholder: 'Ссылка на фото (URL) или загрузка...',
    adminUploadImage: 'Загрузить фото',
    adminProductInStock: 'Свежие цветы в наличии (Dostępny)',
    adminPublishToChannel: '📢 Опубликовать в Telegram-канал при сохранении',
    adminChannelUsername: 'Telegram-канал для автопостинга',
    adminChannelUsernamePlaceholder: '@nazwa_kanalu или -100xxxxxxxx',
    adminSave: 'Сохранить изменения',
    adminCreate: 'Добавить в витрину',
    adminCategoriesTitle: 'Управление категориями цветов',
    adminNewCategory: 'Новая категория',
    adminEditCategory: 'Редактирование категории',
    adminCategoryName: 'Название категории *',
    adminCategoryNamePlaceholder: 'Например: Bukiety Ślubne',
    adminIcon: 'Иконка',
    adminCurrentCategories: 'Текущие категории',
    adminOrdersTitle: 'Все заказы цветов',
    adminOrderItems: 'Состав заказа:',
    adminChangeStatus: 'Изменить статус:',
    adminNoOrders: 'Заказов пока нет',
    adminDeleteConfirm: 'Удалить этот букет?',
    adminDeleteCategoryConfirm: 'Удалить категорию? Все привязанные букеты также будут удалены.',
    errorNameRequired: 'Пожалуйста, укажите имя получателя или заказчика',
    errorOrderFailed: 'Ошибка при оформлении заказа',
    errorPriceRequired: 'Укажите корректную стоимость букета в zł',
    errorTitleRequired: 'Укажите название букета',
    errorCategoryNameRequired: 'Введите название категории',
    paczkomatOrAddress: 'Бережная доставка курьером по Польше',
    upsellTitle: 'Добавить к букету 🎁',
    upsellSubtitle: 'Сделайте ваш цветочный подарок еще приятнее:',
    addToOrder: '+ Добавить',
    addedToOrder: '✓ В заказе',
    publishedSuccess: 'Букет успешно опубликован в канал с кнопкой заказа!',

    deliveryTimingTitle: '📅 Дата и время доставки цветов',
    deliveryDateLabel: 'Дата доставки',
    deliveryTimeLabel: 'Точное время вручения (с шагом 30 мин)',
    surpriseDeliveryTitle: '🤫 Доставка-сюрприз (Анонимно)',
    surpriseDeliveryDesc: 'Не называть имя заказчика до момента вручения букета',
    needCallRecipientTitle: '📞 Уточнить точный адрес у получателя',
    needCallRecipientDesc: 'Курьер вежливо свяжется с получателем и согласует адрес доставки',

    aiFloristBannerTitle: '🌸 AI-Флорист: Подобрать букет за 15 секунд',
    aiFloristBannerSubtitle: 'Ответьте на 3 вопроса и получите идеальную подборку под ваш бюджет и повод',
    aiFloristOpenButton: 'Подобрать букет ✨',
    aiFloristModalTitle: 'AI-Флорист • Подбор букета',
    aiFloristStep1: '1. По какому поводу дарите цветы?',
    aiFloristStep2: '2. Комфортный бюджет:',
    aiFloristStep3: '3. Предпочитаемая цветовая гамма:',
    aiFloristResultsTitle: '✨ Идеальные букеты для вас:',
    aiFloristResultsSubtitle: 'Мы подобрали лучшие авторские композиции по вашим предпочтениям',
    aiFloristBack: 'Назад',
    aiFloristNext: 'Далее →',
    aiFloristClose: 'Закрыть',
    aiFloristRestart: 'Пройти заново ↺',

    occLove: '❤️ Романтика / Любовь',
    occBirthday: '🎂 День рождения',
    occMom: '👩 Любимой Маме / Бабушке',
    occWedding: '💍 Свадьба / Годовщина',
    occSorry: '🥺 Извинения / Примирение',
    occJustBecause: '✨ Просто так / Без повода',

    budgetUnder200: 'До 200 zł (Уютный)',
    budget200To350: '200 – 350 zł (Популярный)',
    budget350To500: '350 – 500 zł (Пышный)',
    budgetVip: 'От 500 zł (Royal VIP)',

    palettePastel: '🌸 Нежная пастельная (розовый, крем)',
    paletteRed: '🌹 Страстная красная / бордо',
    paletteYellow: '🌻 Солнечная желтая / теплая',
    paletteMixed: '🎨 Яркий разноцветный микс',

    courierDashboardTitle: 'Кабинет курьера • Доставки',
    courierActiveDeliveries: 'К доставке',
    courierCompletedDeliveries: 'Доставлено',
    courierNoDeliveries: 'На данный момент активных доставок нет 🌸',
    courierStartDelivery: '🚗 Выехал к получателю',
    courierMarkDelivered: '✅ Букет вручен!',
    courierOpenMap: 'Навигатор (Google Maps)',
    courierCallRecipient: 'Позвонить',
    courierSurpriseBadge: '🤫 СЮРПРИЗ (Анонимно)',
    courierCallNeededBadge: '📞 Уточнить адрес',
    courierDeliveryTime: 'Время доставки:',
  },
  pl: {
    appName: 'Flora Boutique',
    subtitle: 'Kwiaciarnia & Bukiety autorskie',
    searchPlaceholder: 'Szukaj bukietów, róż, upominków...',
    allCategories: 'Wszystkie bukiety',
    emptyProductsTitle: 'Brak bukietów',
    emptyProductsDesc: 'W tej kategorii nie ma jeszcze kwiatów lub nic nie znaleziono dla Twojego zapytania',
    resetFilters: 'Pokaż wszystkie kwiaty',
    loadingCatalog: 'Przygotowujemy świeże kwiaty...',
    retry: 'Ponów próbę',
    addToCart: 'Do koszyka',
    outOfStock: 'Brak w kwiaciarni',
    inStock: 'Świeża dostawa',
    inCart: 'W koszyku',
    cart: 'Koszyk kwiatowy',
    cartEmptyTitle: 'Twój koszyk jest pusty',
    cartEmptyDesc: 'Wybierz wyjątkowy bukiet z naszej kwiaciarni, aby zamówić dostawę prosto pod drzwi.',
    goToCatalog: 'Wybierz bukiet',
    clearCart: 'Wyczyść',
    backToCatalog: 'Wróć do bukietów',
    contactInfo: 'Dane do dostawy i odbiorcy',
    customerName: 'Imię i nazwisko odbiorcy / zamawiającego *',
    customerNamePlaceholder: 'Np. Anna Nowak / Jan Kowalski',
    phoneNumber: 'Numer telefonu odbiorcy (+48)',
    phoneNumberPlaceholder: '+48 500 123 456',
    addressComment: 'Dokładny adres dostawy kwiatów (miasto, ulica, m.)',
    addressCommentPlaceholder: 'Warszawa, ul. Marszałkowska 10 m. 4 (kod domofonu, wskazówki)...',
    cardMessage: 'Treść darmowego bileciku do bukietu',
    cardMessagePlaceholder: 'Napisz kilka ciepłych słów, które ręcznie wpiszemy do bileciku...',
    itemsInOrder: 'Bukietów i dodatków',
    delivery: 'Dostawa kurierska kwiatów',
    freeDelivery: 'Darmowa od 250 zł',
    totalToPay: 'Łącznie do zapłaty:',
    proceedToCheckout: 'Zamów i opłać kwiaty',
    orderSuccessTitle: 'Zamówienie kwiatów zostało przyjęte!',
    orderSuccessDesc: 'Nasi floryści rozpoczęli już układanie Twojego świeżego bukietu. Dostarczymy go z dbałością o każdy detal!',
    orderNumber: 'Zamówienie',
    orderStatus: 'Status:',
    orderPending: 'Przyjęte przez florystę / Nowe',
    orderPaid: 'Opłacone',
    orderInDelivery: 'Kurier w drodze 🚗',
    orderCompleted: 'Dostarczone do odbiorcy 🎉',
    orderCancelled: 'Anulowane',
    backToShopping: 'Wróć do kwiaciarni',
    roleBuyer: 'Klient',
    roleAdmin: 'Florysta / Admin',
    roleCourier: 'Kurier 🚗',
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
    adminPrice: 'Cena (zł / PLN) *',
    adminDescription: 'Skład kwiatów i opis',
    adminDescriptionPlaceholder: 'Skład: róże gałązkowe, eustoma, piwonie, eukaliptus, papier ozdobny...',
    adminImage: 'Zdjęcie bukietu',
    adminImagePlaceholder: 'Link do zdjęcia (URL) lub plik...',
    adminUploadImage: 'Prześlij zdjęcie',
    adminProductInStock: 'Świeże kwiaty dostępne w kwiaciarni',
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
    adminOrdersTitle: 'Wszystkie zamówienia kwiatów',
    adminOrderItems: 'Skład zamówienia:',
    adminChangeStatus: 'Zmień status:',
    adminNoOrders: 'Brak zamówień',
    adminDeleteConfirm: 'Czy na pewno chcesz usunąć ten bukiet?',
    adminDeleteCategoryConfirm: 'Usunąć kategorię? Wszystkie powiązane bukiety zostaną usunięte.',
    errorNameRequired: 'Proszę podać imię i nazwisko odbiorcy',
    errorOrderFailed: 'Wystąpił błąd podczas składania zamówienia',
    errorPriceRequired: 'Proszę podać prawidłową cenę w zł',
    errorTitleRequired: 'Nazwa bukietu jest wymagana',
    errorCategoryNameRequired: 'Nazwa kategorii jest wymagana',
    paczkomatOrAddress: 'Dostawa kurierska na terenie całej Polski',
    upsellTitle: 'Coś do bukietu? 🎁',
    upsellSubtitle: 'Spraw, aby prezent był jeszcze bardziej wyjątkowy:',
    addToOrder: '+ Dodaj',
    addedToOrder: '✓ W zamówieniu',
    publishedSuccess: 'Bukiet został pomyślnie opublikowany w kanale z przyciskiem zakupu!',

    deliveryTimingTitle: '📅 Data i godzina doręczenia kwiatów',
    deliveryDateLabel: 'Data doręczenia',
    deliveryTimeLabel: 'Dokładna godzina dostawy (co 30 min)',
    surpriseDeliveryTitle: '🤫 Dostawa-niespodzianka (Anonimowo)',
    surpriseDeliveryDesc: 'Nie podawać imienia zamawiającego do momentu wręczenia',
    needCallRecipientTitle: '📞 Ustal adres u odbiorcy',
    needCallRecipientDesc: 'Kurier skontaktuje się z odbiorcą i ustali dogodny adres doręczenia',

    aiFloristBannerTitle: '🌸 AI-Florysta: Dobierz bukiet w 15 sekund',
    aiFloristBannerSubtitle: 'Odpowiedz na 3 pytania i otrzymaj idealny bukiet dopasowany do okazji i budżetu',
    aiFloristOpenButton: 'Dobierz bukiet ✨',
    aiFloristModalTitle: 'AI-Florysta • Dobór bukietu',
    aiFloristStep1: '1. Na jaką okazję szukasz kwiatów?',
    aiFloristStep2: '2. Twój budżet:',
    aiFloristStep3: '3. Preferowana kolorystyka:',
    aiFloristResultsTitle: '✨ Idealne bukiety dla Ciebie:',
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

    budgetUnder200: 'Do 200 zł (Kameralny)',
    budget200To350: '200 – 350 zł (Popularny)',
    budget350To500: '350 – 500 zł (Okazały)',
    budgetVip: 'Od 500 zł (Royal VIP)',

    palettePastel: '🌸 Delikatna pastelowa (róż, krem)',
    paletteRed: '🌹 Namiętna czerwona / bordo',
    paletteYellow: '🌻 Słoneczna żółta / ciepła',
    paletteMixed: '🎨 Kolorowy miks florystyczny',

    courierDashboardTitle: 'Panel Kuriera • Dostawy',
    courierActiveDeliveries: 'Do doręczenia',
    courierCompletedDeliveries: 'Doręczone',
    courierNoDeliveries: 'Brak aktywnych dostaw w tym momencie 🌸',
    courierStartDelivery: '🚗 W drodze do odbiorcy',
    courierMarkDelivered: '✅ Bukiet doręczony!',
    courierOpenMap: 'Nawigacja (Google Maps)',
    courierCallRecipient: 'Zadzwoń',
    courierSurpriseBadge: '🤫 NIESPODZIANKA (Anonim)',
    courierCallNeededBadge: '📞 Ustal adres',
    courierDeliveryTime: 'Godzina dostawy:',
  },
  ua: {
    appName: 'Flora Boutique',
    subtitle: 'Квіти та авторські букети',
    searchPlaceholder: 'Пошук букетів, троянд, подарунків...',
    allCategories: 'Усі букети',
    emptyProductsTitle: 'Букети не знайдено',
    emptyProductsDesc: 'У цій категорії поки немає квітів або нічого не знайдено за запитом',
    resetFilters: 'Показати всі квіти',
    loadingCatalog: 'Збираємо свіжі квіти...',
    retry: 'Повторити',
    addToCart: 'У кошик',
    outOfStock: 'Немає в наявності',
    inStock: 'Свіжа поставка',
    inCart: 'У кошику',
    cart: 'Квітковий кошик',
    cartEmptyTitle: 'У кошику поки немає квітів',
    cartEmptyDesc: 'Оберіть чарівний букет у каталозі, щоб оформити доставку або самовивіз.',
    goToCatalog: 'Обрати букет',
    clearCart: 'Очистити',
    backToCatalog: 'Назад до квітів',
    contactInfo: 'Доставка квітів та контакти',
    customerName: "Ім'я та прізвище одержувача / замовника *",
    customerNamePlaceholder: 'Наприклад: Анна Ковальчук / Іван',
    phoneNumber: 'Телефон одержувача або замовника (+48)',
    phoneNumberPlaceholder: '+48 500 123 456',
    addressComment: 'Адреса доставки (місто, вулиця, кв., домофон)',
    addressCommentPlaceholder: 'Warszawa, ul. Złota 44 m. 12 (домофон 12, залишити консьєржу)...',
    cardMessage: 'Текст безкоштовної листівки у букет',
    cardMessagePlaceholder: 'Напишіть теплі слова, ми з турботою підпишемо листівку...',
    itemsInOrder: 'Букетів та подарунків',
    delivery: "Кур'єрська доставка квітів",
    freeDelivery: 'Безкоштовно від 250 zł',
    totalToPay: 'Разом до сплати:',
    proceedToCheckout: 'Оформити та оплатити замовлення',
    orderSuccessTitle: 'Замовлення квітів успішно оформлено!',
    orderSuccessDesc: 'Наші флористи вже почали складати ваш свіжий букет. Ми доставимо його дбайливо та вчасно!',
    orderNumber: 'Заказ',
    orderStatus: 'Статус:',
    orderPending: 'Прийнято флористом / Очікує',
    orderPaid: 'Оплачено',
    orderInDelivery: "Кур'єр у дорозі 🚗",
    orderCompleted: 'Доставлено одержувачу 🎉',
    orderCancelled: 'Скасовано',
    backToShopping: 'Повернутися до бутику',
    roleBuyer: 'Клієнт',
    roleAdmin: 'Флорист / Адмін',
    roleCourier: "Кур'єр 🚗",
    adminProducts: 'Букети',
    adminCategories: 'Категорії',
    adminOrders: 'Закази',
    adminAddProduct: 'Додати букет',
    adminManageCategories: 'Категорії',
    adminEditProduct: 'Редагувати букет',
    adminNewProduct: 'Новий букет або подарунок',
    adminProductTitle: 'Назва букету / композиції *',
    adminProductTitlePlaceholder: 'Наприклад: Букет «Півонієвий світанок» XL',
    adminCategory: 'Категорія *',
    adminPrice: 'Ціна (zł / PLN) *',
    adminDescription: 'Склад квітів та опис',
    adminDescriptionPlaceholder: 'Склад: півонії, кущова троянда, евкаліпт, дизайнерське пакування...',
    adminImage: 'Фотографія букету',
    adminImagePlaceholder: 'Посилання на фото (URL) або завантаження...',
    adminUploadImage: 'Завантажити фото',
    adminProductInStock: 'Свіжі квіти в наявності (Dostępny)',
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
    adminOrdersTitle: 'Усі замовлення квітів',
    adminOrderItems: 'Склад замовлення:',
    adminChangeStatus: 'Змінити статус:',
    adminNoOrders: 'Замовлень поки немає',
    adminDeleteConfirm: 'Видалити цей букет?',
    adminDeleteCategoryConfirm: 'Видалити категорію? Усі прив’язані букети також будуть видалені.',
    errorNameRequired: "Будь ласка, вкажіть ім'я одержувача",
    errorOrderFailed: 'Помилка під час оформлення замовлення',
    errorPriceRequired: 'Вкажіть коректну вартість букету в zł',
    errorTitleRequired: 'Вкажіть назву букету',
    errorCategoryNameRequired: 'Введіть назву категорії',
    paczkomatOrAddress: "Дбайлива кур'єрська доставка по Польщі",
    upsellTitle: 'Додати до букету 🎁',
    upsellSubtitle: 'Зробіть ваш квітковий подарунок ще приємнішим:',
    addToOrder: '+ Додати',
    addedToOrder: '✓ У замовленні',
    publishedSuccess: 'Букет успішно опубліковано в канал із кнопкою замовлення!',

    deliveryTimingTitle: '📅 Дата та час доставки квітів',
    deliveryDateLabel: 'Дата доставки',
    deliveryTimeLabel: 'Точний час вручення (з кроком 30 хв)',
    surpriseDeliveryTitle: '🤫 Доставка-сюрприз (Анонімно)',
    surpriseDeliveryDesc: 'Не називати ім’я замовника до моменту вручення',
    needCallRecipientTitle: '📞 Уточнити адресу в одержувача',
    needCallRecipientDesc: "Кур'єр ввічливо зателефонує одержувачу та узгодить адресу",

    aiFloristBannerTitle: '🌸 AI-Флорист: Підібрати букет за 15 секунд',
    aiFloristBannerSubtitle: 'Дайте відповідь на 3 запитання та отримайте ідеальну добірку квітів',
    aiFloristOpenButton: 'Підібрати букет ✨',
    aiFloristModalTitle: 'AI-Флорист • Підбір букету',
    aiFloristStep1: '1. З якої нагоди даруєте квіти?',
    aiFloristStep2: '2. Комфортний бюджет:',
    aiFloristStep3: '3. Бажана колірна гама:',
    aiFloristResultsTitle: '✨ Ідеальні букети для вас:',
    aiFloristResultsSubtitle: 'Ми підібрали найкращі композиції за вашими вподобаннями',
    aiFloristBack: 'Назад',
    aiFloristNext: 'Далі →',
    aiFloristClose: 'Закрити',
    aiFloristRestart: 'Пройти знову ↺',

    occLove: '❤️ Романтика / Кохання',
    occBirthday: '🎂 День народження',
    occMom: '👩 Улюбленій Мамі / Бабусі',
    occWedding: '💍 Весілля / Річниця',
    occSorry: '🥺 Вибачення / Примирення',
    occJustBecause: '✨ Просто так / Без приводу',

    budgetUnder200: 'До 200 zł (Затишний)',
    budget200To350: '200 – 350 zł (Популярний)',
    budget350To500: '350 – 500 zł (Пишний)',
    budgetVip: 'Від 500 zł (Royal VIP)',

    palettePastel: '🌸 Ніжна пастельна (рожевий, крем)',
    paletteRed: '🌹 Пристрасна червона / бордо',
    paletteYellow: '🌻 Сонячна жовта / тепла',
    paletteMixed: '🎨 Яскравий різнокольоровий мікс',

    courierDashboardTitle: "Кабінет кур'єра • Доставки",
    courierActiveDeliveries: 'До вручення',
    courierCompletedDeliveries: 'Вручено',
    courierNoDeliveries: "Наразі немає активних доставок 🌸",
    courierStartDelivery: "🚗 Виїхав до одержувача",
    courierMarkDelivered: '✅ Букет вручено!',
    courierOpenMap: 'Навігатор (Google Maps)',
    courierCallRecipient: 'Зателефонувати',
    courierSurpriseBadge: '🤫 СЮРПРИЗ (Анонімно)',
    courierCallNeededBadge: '📞 Уточнити адресу',
    courierDeliveryTime: 'Час доставки:',
  },
};

// Localized mapping for Categories
export const CATEGORY_TRANSLATIONS: Record<number, Record<Language, string>> = {
  1: {
    pl: 'Bukiety Autorskie',
    ru: 'Авторские букеты',
    ua: 'Авторські букети',
  },
  2: {
    pl: 'Róże & Mono',
    ru: 'Розы и монобукеты',
    ua: 'Троянди та монобукети',
  },
  3: {
    pl: 'Flower Box & Kosze',
    ru: 'Цветочные коробки и корзины',
    ua: 'Квіткові коробки та кошики',
  },
  4: {
    pl: 'Rośliny & Doniczki',
    ru: 'Комнатные растения и кашпо',
    ua: 'Кімнатні рослини та кашпо',
  },
  5: {
    pl: 'Dodatki & Akcesoria',
    ru: 'Подарки и аксессуары',
    ua: 'Подарунки та аксесуари',
  },
};

// Localized mapping for Products
export const PRODUCT_TRANSLATIONS: Record<
  number,
  Record<Language, { title: string; description: string }>
> = {
  1: {
    pl: {
      title: 'Bukiet «Różowa Magia» Premium',
      description:
        'Puszysta kompozycja z róż gałązkowych, kremowej eustomy, chryzantem pastelowych, goździków i pachnącego eukaliptusa w eleganckim matowym papierze z jedwabną wstążką.',
    },
    ru: {
      title: 'Букет «Розовая Магия» Премиум',
      description:
        'Пышная авторская композиция из кустовых роз, кремовой эустомы, пастельных хризантем, гвоздик и эвкалипта в дизайнерской матовой упаковке с шелковой лентой.',
    },
    ua: {
      title: 'Букет «Рожева Магія» Преміум',
      description:
        'Пишна авторська композиція з кущових троянд, кремової еустоми, пастельних хризантем, гвоздик та евкаліпта у дизайнерському матовому пакуванні з шовковою стрічкою.',
    },
  },
  2: {
    pl: {
      title: 'Bukiet «Słoneczny Poranek» XL',
      description:
        'Energetyczny bukiet ze słoneczników, żółtych róż ogrodowych, rumianku, alstromerii oraz zieleni dekoracyjnej. Rozświetli każdy dzień!',
    },
    ru: {
      title: 'Букет «Солнечное Утро» XL',
      description:
        'Яркий и жизнерадостный букет из подсолнухов, садовых желтых роз, ромашек, альстромерий и декоративной зелени. Дарит тепло и улыбки!',
    },
    ua: {
      title: 'Букет «Сонячний Ранок» XL',
      description:
        'Яскравий та життєрадісний букет із соняшників, садових жовтих троянд, ромашок, альстромерій та свіжої зелені. Дарує тепло та радість!',
    },
  },
  3: {
    pl: {
      title: 'Bukiet «Piwoniowy Sen» Grand Luxury',
      description:
        'Ekskluzywny bukiet z holenderskich piwonii Sarah Bernhardt, hortensji różowej, róż Madame Red i eukaliptusa Populus. Rozmiar XXL.',
    },
    ru: {
      title: 'Букет «Пионовый Сон» Grand Luxury',
      description:
        'Эксклюзивный королевский букет из голландских пионов Sarah Bernhardt, пышной розовой гортензии, роз Madame Red и эвкалипта. Размер XXL.',
    },
    ua: {
      title: 'Букет «Півонієвий Сон» Grand Luxury',
      description:
        'Ексклюзивний королівський букет із голландських півоній Sarah Bernhardt, пишної рожевої гортензії, троянд Madame Red та евкаліпта. Розмір XXL.',
    },
  },
  4: {
    pl: {
      title: 'Mono Bukiet 25 Czerwonych Róż Red Naomi',
      description:
        'Klasyczne, aksamitne czerwone róże premium o długości 60 cm z polskich szklarni. Związane czerwoną satynową wstążką.',
    },
    ru: {
      title: 'Монобукет из 25 красных роз Red Naomi',
      description:
        'Классические бархатные красные розы премиум-класса (60 см). Идеальный символ любви и страсти, перевязанный атласной лентой.',
    },
    ua: {
      title: 'Монобукет із 25 червоних троянд Red Naomi',
      description:
        'Класичні оксамитові червоні троянди преміум-класу (60 см). Ідеальний символ кохання, перев\'язаний червоною атласною стрічкою.',
    },
  },
  5: {
    pl: {
      title: 'Mono Bukiet 19 Róż Pudrowych Mondial',
      description:
        'Delikatne kremowo-pudrowe róże wielkokwiatowe w minimalistycznym opakowaniu. Idealne na wyznanie uczuć.',
    },
    ru: {
      title: 'Монобукет из 19 пудровых роз Mondial',
      description:
        'Изысканные крупнобутонные розы нежно-пудрового кремового оттенка в лаконичной матовой бумаге.',
    },
    ua: {
      title: 'Монобукет із 19 пудрових троянд Mondial',
      description:
        'Вишукані троянди з великими бутонами ніжно-пудрового кремового відтінку в лаконічному матовому пакуванні.',
    },
  },
  6: {
    pl: {
      title: 'Flower Box «Pudrowy Aksamit» Velvet',
      description:
        'Kompozycja w welurowym okrągłym pudle ze specjalną gąbką florystyczną nasączoną wodą. Kwiaty nie wymagają wazonu!',
    },
    ru: {
      title: 'Flower Box «Пудровый Бархат» Velvet',
      description:
        'Композиция в элегантной круглой бархатной коробке на флористической губке с водой. Цветы не требуют вазы и долго сохраняют свежесть!',
    },
    ua: {
      title: 'Flower Box «Пудровий Оксамит» Velvet',
      description:
        'Композиція в елегантній круглій оксамитовій коробці на флористичній губці з водою. Квіти не потребують вази та довго стоять!',
    },
  },
  7: {
    pl: {
      title: 'Kosz Wiklinowy «Prowansja»',
      description:
        'Rustykalny wiklinowy kosz pełen eustomy, lawendy, hortensji oraz róż gałązkowych. Trwałość do 10 dni.',
    },
    ru: {
      title: 'Плетеный корзинный букет «Прованс»',
      description:
        'Ароматная и воздушная композиция в натуральной плетеной корзине: эустома, лаванда, гортензия и кустовые розы. Стойкость до 10 дней.',
    },
    ua: {
      title: 'Плетений кошиковий букет «Прованс»',
      description:
        'Ароматна та повітряна композиція у натуральному плетеному кошику: еустома, лаванда, гортензія та кущові троянди. Стійкість до 10 днів.',
    },
  },
  8: {
    pl: {
      title: 'Storczyk Orchidea Phalaenopsis 2-pędowa',
      description:
        'Długokwitnąca biała orchidea w designerskiej ceramicznej osłonce. Idealna roślina do domu i biura.',
    },
    ru: {
      title: 'Двухствольная орхидея фаленопсис Premium',
      description:
        'Долгоцветущая белоснежная орхидея в дизайнерском керамическом кашпо. Прекрасное живое украшение для дома и офиса.',
    },
    ua: {
      title: 'Двостовбурна орхідея фаленопсис Premium',
      description:
        'Довгоквітуча білосніжна орхідея у дизайнерському керамічному кашпо. Прекрасна жива прикраса для дому та офісу.',
    },
  },
  9: {
    pl: {
      title: 'Monstera Deliciosa Dziurawa XL',
      description:
        'Królowa roślin domowych o spektakularnych, powcinanych liściach. Wysokość ok. 65 cm.',
    },
    ru: {
      title: 'Монстера деликатесная (Deliciosa) XL',
      description:
        'Королева комнатных растений с крупными резными глянцевыми листьями. Высота около 65 см.',
    },
    ua: {
      title: 'Монстера делікатесна (Deliciosa) XL',
      description:
        'Королева кімнатних рослин із великим різьбленим глянцевим листям. Висота близько 65 см.',
    },
  },
  10: {
    pl: {
      title: 'Szklany Wazon Cylindryczny 25cm',
      description:
        'Grube, przezroczyste szkło idealnie pasujące do bukietów średnich i dużych.',
    },
    ru: {
      title: 'Стеклянная цилиндрическая ваза 25 см',
      description:
        'Премиальное прозрачное толстое стекло, идеально подходящее для любых букетов.',
    },
    ua: {
      title: 'Скляна циліндрична ваза 25 см',
      description:
        'Преміальне прозоре товсте скло, яке ідеально підходить для будь-яких букетів.',
    },
  },
  11: {
    pl: {
      title: 'Praliny Czekoladowe Lindt Lindor 200g',
      description:
        'Kultowe szwajcarskie praliny z rozpływającym się kremowym nadzieniem.',
    },
    ru: {
      title: 'Шоколадные конфеты Lindt Lindor 200 г',
      description:
        'Знаменитые швейцарские шоколадные трюфели с тающей кремовой начинкой.',
    },
    ua: {
      title: 'Шоколадні цукерки Lindt Lindor 200 г',
      description:
        'Знамениті швейцарські шоколадні трюфелі з ніжною кремовою начинкою.',
    },
  },
  101: {
    pl: {
      title: 'Bilecik z Twoją dedykacją',
      description:
        'Elegancki kartonik, w którym odręcznie wykaligrafujemy Twoje życzenia.',
    },
    ru: {
      title: 'Фирменная открытка с вашим текстом',
      description:
        'Бесплатная открытка, в которую флорист каллиграфически впишет ваши пожелания.',
    },
    ua: {
      title: 'Фірмова листівка з вашим текстом',
      description:
        'Безкоштовна листівка, в яку флорист каліграфічно впише ваші побажання.',
    },
  },
  102: {
    pl: {
      title: 'Odżywka do kwiatów Chrysal (3 szt)',
      description:
        'Przedłuża świeżość i trwałość ciętych kwiatów nawet o tydzień.',
    },
    ru: {
      title: 'Подкормка для цветов Chrysal (3 шт)',
      description:
        'Продлевает свежесть и стойкость срезанных цветов в вазе до двух недель.',
    },
    ua: {
      title: 'Підживка для квітів Chrysal (3 шт)',
      description:
        'Подовжує свіжість та стійкість зрізаних квітів у вазі до двох тижнів.',
    },
  },
  103: {
    pl: {
      title: 'Balon Foliowy z Helem «Serce»',
      description:
        'Czerwony lub różowy balon z helem na wstążce przywiązany do bukietu.',
    },
    ru: {
      title: 'Воздушный шар с гелием «Сердце»',
      description:
        'Фольгированное алое или нежно-розовое сердце на шелковой ленте к букету.',
    },
    ua: {
      title: 'Повітряна куля з гелієм «Серце»',
      description:
        'Фольговане яскраво-червоне або ніжне серце на шовковій стрічці до букету.',
    },
  },
};

export function getLocalizedCategoryName(category: Category, lang: Language): string {
  if (lang === 'ru' && category.name_ru) return category.name_ru;
  if (lang === 'pl' && category.name_pl) return category.name_pl;
  if (lang === 'ua' && category.name_ua) return category.name_ua;

  const translation = CATEGORY_TRANSLATIONS[category.id];
  if (translation && translation[lang]) {
    return translation[lang];
  }

  return category.name;
}

export function getLocalizedProduct(product: Product, lang: Language): Product {
  let title = product.title;
  let description = product.description;

  if (lang === 'ru') {
    if (product.title_ru) title = product.title_ru;
    if (product.description_ru) description = product.description_ru;
  } else if (lang === 'pl') {
    if (product.title_pl) title = product.title_pl;
    if (product.description_pl) description = product.description_pl;
  } else if (lang === 'ua') {
    if (product.title_ua) title = product.title_ua;
    if (product.description_ua) description = product.description_ua;
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
