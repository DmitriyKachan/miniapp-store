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
  orderCompleted: string;
  orderCancelled: string;
  backToShopping: string;
  roleBuyer: string;
  roleAdmin: string;
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
    orderCompleted: 'Доставлен получателю',
    orderCancelled: 'Отменен',
    backToShopping: 'Вернуться в бутик',
    roleBuyer: 'Клиент',
    roleAdmin: 'Флорист / Админ',
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
    orderCompleted: 'Dostarczone do odbiorcy',
    orderCancelled: 'Anulowane',
    backToShopping: 'Wróć do kwiaciarni',
    roleBuyer: 'Klient',
    roleAdmin: 'Florysta / Admin',
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
    orderNumber: 'Замовлення',
    orderStatus: 'Статус:',
    orderPending: 'Прийнято флористом / Очікує',
    orderPaid: 'Оплачено',
    orderCompleted: 'Доставлено одержувачу',
    orderCancelled: 'Скасовано',
    backToShopping: 'Повернутися до бутику',
    roleBuyer: 'Клієнт',
    roleAdmin: 'Флорист / Адмін',
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
  },
};
