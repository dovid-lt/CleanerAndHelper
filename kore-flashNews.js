const LAST_NEWS_ID_STORAGE_KEY = 'lastNewsID';
const NEW_ITEM_CLASS = 'unread';
const AUTO_MARK_READ_TIME_PER_ITEM = 3300;
const AUTO_MARK_READ_MAX_TIME = 2 * 60 * 1000;
const TIMER_INTERVAL_STEP = 1000;

$(document).ready(() => {
    const markItemAsUnread = (item) => $(item).addClass(NEW_ITEM_CLASS);
    const removeUnreadClassFromItem = (item) => $(item).removeClass(NEW_ITEM_CLASS);
    const toggleUnreadClassOnItem = (item, condition) => $(item).toggleClass(NEW_ITEM_CLASS, condition);
    const setLastNewsIDInLocalStorage = (id) => localStorage.setItem(LAST_NEWS_ID_STORAGE_KEY, id);

    const savedLastRead = parseInt(localStorage.getItem(LAST_NEWS_ID_STORAGE_KEY), 10) || 0;
    const initialUnreadItems = new Set();
    const newsItems = $('.newsflash_list .item');
    let newItemsCount = 0;

    newsItems.each((index, item) => {
        const itemId = parseInt(item.id, 10);
        if (itemId > savedLastRead) {
            markItemAsUnread(item);
            initialUnreadItems.add(itemId);
            newItemsCount++;
        }
    });

    let remainingTime = Math.min(newItemsCount * AUTO_MARK_READ_TIME_PER_ITEM, AUTO_MARK_READ_MAX_TIME);
    let timerInterval;

    const extraButtonsContainer = $('<div>').css({
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    });

    const markAsReadButton = $('<span>').text('סמן הכל כנקרא').css('cursor', 'pointer');
    const countdownElement = $('<span>').hide();
    const markBackAsUnreadButton = $('<span>').text(' (סמן חזרה כלא נקרא)').css({
        cursor: 'pointer',
    }).hide();
    const separator1 = $('<span>').text('|').css('margin', '0 5px');
    const markAsUnreadButton = $('<span>').text('סמן הכל כלא נקרא').css('cursor', 'pointer');

    const updateCountdown = () => {
        const seconds = Math.ceil(remainingTime / 1000);
        countdownElement.text(`(סימון אוטומטי בעוד ${seconds} שניות)`);
    };

    const startTimer = () => {
        if (newItemsCount > 0) {
            updateCountdown();
            countdownElement.show();
            markBackAsUnreadButton.hide();
            timerInterval = setInterval(() => {
                remainingTime -= TIMER_INTERVAL_STEP;
                updateCountdown();
                if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                    markAllAsRead();
                    countdownElement.hide();
                    markBackAsUnreadButton.show();
                }
            }, TIMER_INTERVAL_STEP);
        } else {
            countdownElement.hide();
            markBackAsUnreadButton.hide();
        }
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
        countdownElement.hide();
    };

    const pauseTimer = () => {
        clearInterval(timerInterval);
    };

    const resumeTimer = () => {
        if (remainingTime > 0 && newItemsCount > 0) {
            timerInterval = setInterval(() => {
                remainingTime -= TIMER_INTERVAL_STEP;
                updateCountdown();
                if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                    markAllAsRead();
                    countdownElement.hide();
                    markBackAsUnreadButton.show();
                }
            }, TIMER_INTERVAL_STEP);
        }
    };

    const markAllAsRead = () => {
        newsItems.each((index, item) => removeUnreadClassFromItem(item));
        setLastNewsIDInLocalStorage(newsItems.first().attr('id'));
    };

    const restoreInitialUnreadItems = () => {
        newsItems.each((index, item) => {
            const itemId = parseInt(item.id, 10);
            toggleUnreadClassOnItem(item, initialUnreadItems.has(itemId));
        });
        setLastNewsIDInLocalStorage(savedLastRead);
    };

    markAsReadButton.on('click', () => {
        stopTimer();
        markAllAsRead();
        markBackAsUnreadButton.hide();
        newItemsCount = 0;
    });

    markBackAsUnreadButton.on('click', () => {
        stopTimer();
        restoreInitialUnreadItems();
        markBackAsUnreadButton.hide();
    });

    markAsUnreadButton.on('click', () => {
        stopTimer();
        newsItems.each((index, item) => markItemAsUnread(item));
        setLastNewsIDInLocalStorage(0);
        newItemsCount = newsItems.length;
        markBackAsUnreadButton.hide();
    });

    extraButtonsContainer.append(markAsReadButton, countdownElement, markBackAsUnreadButton, separator1, markAsUnreadButton);

    $('.inner_sec_title').after(extraButtonsContainer);

    document.addEventListener('visibilitychange', () => {
        document.hidden ? pauseTimer() : resumeTimer();
    });

    if (newItemsCount > 0) {
        startTimer();
	if (document.hidden) {
	   pauseTimer()
	}
     }
});
