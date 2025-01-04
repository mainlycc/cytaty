'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  pl: {
    translation: {
      // Ogólne
      'web_record_video_hover_cursor_effect_highlight': 'Efekt kursora',
      'web_record_video_hover_cursor_effect_spotlight': 'Efekt reflektora',
      'web_record_video_hover_cursor_effect_magnifier': 'Efekt lupy',
      
      // Memy
      'meme_wall_title': 'Ściana Memów',
      'meme_sort_today': 'Dzisiaj',
      'meme_sort_week': 'W tym tygodniu',
      'meme_sort_month': 'W tym miesiącu',
      'meme_sort_year': 'W tym roku',
      'meme_add_comment': 'Dodaj komentarz...',
      'meme_anonymous': 'Anonim',
      
      // Quizy
      'quiz_title': 'Filmowe Quizy',
      'quiz_ranking': 'Ranking graczy',
      'quiz_games_played': 'Rozegrane gry',
      'quiz_points': 'pkt',
      'quiz_no_results': 'Brak wyników do wyświetlenia',
      'quiz_available': 'Dostępne quizy',
      'quiz_level': 'Poziom',
      'quiz_questions': 'Pytań'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pl',
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })
  .then(() => {
    console.log('i18n initialized successfully')
  })
  .catch((error) => {
    console.error('Error initializing i18n:', error)
  })

export default i18n 