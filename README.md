# ארבעה אבות — אתר למידה

אתר סטטי (HTML/CSS/JS פשוטים, ללא build step) ללימוד מסכת בבא קמא, שמתחיל בשיעור
"ארבעה אבות נזיקין". האתר תומך RTL, מצב כהה/בהיר, ומבנה שמאפשר להוסיף בקלות שיעורים
חדשים ותמונות/סרטונים לכל שיעור.

## הרצה מקומית

אין תלות בכלים חיצוניים — פשוט פותחים את `index.html` בדפדפן, או מריצים שרת סטטי:

```bash
python3 -m http.server 8000
# ואז נכנסים ל־http://localhost:8000
```

## מבנה התיקיות

```
index.html                          # עמוד הבית עם רשימת השיעורים
register.html                       # הרשמה
login.html                          # התחברות
firestore.rules                     # כללי אבטחה ל-Firestore (מדביקים בקונסולת Firebase)
lessons/
  arba-avot-nezikin.html            # השיעור הראשון: ארבעה אבות נזיקין
assets/
  css/style.css                     # כל העיצוב
  js/main.js                        # פתיחת הסעיף הראשון בשיעור
  js/firebase-config.js             # פרטי חיבור ל-Firebase (למלא לפי ההנחיות למטה)
  js/auth.js                        # הרשמה/התחברות/התנתקות מול Firebase
  js/header-auth.js                 # עדכון אזור ההתחברות ב-header בכל עמוד
  js/progress.js                    # קריאה/כתיבה של התקדמות בשיעור למשתמש מחובר
  js/lesson-progress.js             # חיווט כפתורי "סימון כהושלם" בעמוד שיעור
  images/<שם-שיעור>/                # תמונות של השיעור
  videos/<שם-שיעור>/                # סרטונים של השיעור
```

## הוספת תמונה או סרטון לשיעור קיים

בכל שיעור, כל דוגמה מכילה תיבת placeholder בסגנון:

```html
<div class="media-slot" data-media-for="shen-1">
  <span class="icon">🖼️</span>
  <span>מקום לתמונה</span>
  <code>assets/images/arba-avot-nezikin/shen-1.jpg</code>
</div>
```

כדי להחליף אותה בתמונה אמיתית: שמים את הקובץ בנתיב שמופיע בתוך ה־`<code>`,
ומחליפים את כל תוכן ה־`div.media-slot` ב:

```html
<figure class="media-slot" style="border-style: solid; padding: 0;">
  <img src="../assets/images/arba-avot-nezikin/shen-1.jpg" alt="תיאור התמונה" style="border-radius:10px;" />
</figure>
```

לסרטון (קובץ מקומי):

```html
<video controls style="width:100%; border-radius:10px;">
  <source src="../assets/videos/arba-avot-nezikin/shen-2.mp4" type="video/mp4" />
</video>
```

או הטמעת יוטיוב:

```html
<iframe width="100%" height="220" style="border:0; border-radius:10px;"
  src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
```

## הוספת שיעור חדש

1. יוצרים קובץ חדש תחת `lessons/` (למשל `lessons/mazik-adam-be-adam.html`),
   ומעתיקים ממנו את השלד של `lessons/arba-avot-nezikin.html` (header, footer, קישור ל־CSS/JS).
2. יוצרים תיקיות מדיה תואמות: `assets/images/<שם-השיעור>/` ו־`assets/videos/<שם-השיעור>/`.
3. מוסיפים כרטיס חדש ל־`index.html` בתוך `.lesson-grid`.

## עיצוב

- כותרות: Frank Ruhl Libre · גוף הטקסט: Heebo (גופני Google Fonts, עברית מלאה).
- לכל אב נזיקין (שן/רגל/בור/אש) יש צבע משלו, המוגדר ב־`assets/css/style.css` תחת המשתנים
  `--shen`, `--regel`, `--bor`, `--esh`.
## הרשמה, התחברות ומעקב התקדמות

גלישה באתר לא דורשת חשבון. משתמש שנרשם (שם פרטי, שם משפחה, טלפון אבא, טלפון אמא,
וקוד אישי בן 4 ספרות) יכול לסמן סעיפים כ"הושלם" בכל שיעור, וההתקדמות נשמרת עבורו.
התחברות היא לפי שם פרטי + שם משפחה + הקוד האישי — אין שם משתמש נפרד.

**מגבלה לדעת:** כניסה מתבססת רק על שם מלא, בלי שם משתמש ייחודי. אם שני אנשים
נרשמים עם אותו שם פרטי ושם משפחה בדיוק, ההרשמה השנייה תיכשל עם הודעה שהשם כבר
תפוס. וקוד בן 4 ספרות (10,000 אפשרויות) הוא נוח לזכירה אך לא מאובטח במיוחד —
מתאים לשמירת התקדמות לימודית ולא למידע רגיש.

זה בנוי על **Firebase** (Authentication + Firestore) — שירות חינמי של Google שמתאים
לאתרים סטטיים כמו זה, בלי לדרוש שרת משלכם.

### הגדרה חד-פעמית

1. נכנסים ל-[console.firebase.google.com](https://console.firebase.google.com/) ויוצרים
   פרויקט חדש (חינמי, לא דורש כרטיס אשראי).
2. **Build → Authentication → Get started** → מפעילים ספק **Email/Password**.
   (המערכת משתמשת בו מאחורי הקלעים כדי לתמוך בהתחברות עם שם מלא וקוד אישי בלבד —
   ראו הסבר ב־`assets/js/auth.js`.)
3. **Build → Firestore Database → Create database** → מצב **Production**.
4. בלשונית **Rules** של Firestore, מדביקים את התוכן של `firestore.rules` מהריפו הזה
   ולוחצים **Publish**.
5. **Project settings → General → Your apps** → מוסיפים אפליקציית **Web** (`</>`),
   ומעתיקים את אובייקט ה-config שמופיע.
6. מדביקים את הערכים בקובץ `assets/js/firebase-config.js` במקום ה-`PASTE_...`.

לאחר מכן הרשמה, התחברות ומעקב התקדמות יעבדו אוטומטית — אין צורך בשינוי קוד נוסף.

### איפה רואים את רשימת הנרשמים

בקונסולת Firebase, תחת **Firestore Database → Data**, באוסף `users` — כל מסמך הוא
משתמש, עם שם פרטי, שם משפחה וטלפוני ההורים. הגישה הזו פתוחה רק לבעל פרויקט
ה-Firebase (כלומר אתה), ולא לגולשים באתר.
