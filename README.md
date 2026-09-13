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
lessons/
  arba-avot-nezikin.html            # השיעור הראשון: ארבעה אבות נזיקין
assets/
  css/style.css                     # כל העיצוב (RTL, בהיר/כהה)
  js/main.js                        # מתג ערכת נושא + פתיחת הסעיף הראשון
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
- מצב כהה/בהיר נשמר בדפדפן (`localStorage`) דרך הכפתור בפינת ה־header.
