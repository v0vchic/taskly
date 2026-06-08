import type { AppState } from '@/shared/types'

export const initialAppState: AppState = {
  activeProjectId: 'board-1',
  projects: [
    {
      id: 'board-1',
      title: 'Доска проекта',
      color: '#6366f1',
      columns: [
        { id: 'col-1', title: 'В работе', cardIds: ['card-1', 'card-2'] },
        { id: 'col-2', title: 'На проверке', cardIds: ['card-3'] },
        { id: 'col-3', title: 'Готово', cardIds: ['card-4', 'card-5'] },
      ],
      cards: {
        'card-1': { id: 'card-1', title: 'Компоненты дизайн-системы', description: 'Библиотека переиспользуемых компонентов', columnId: 'col-1', labels: [{ id: 'l1', text: 'Дизайн', color: '#ec4899' }] },
        'card-2': { id: 'card-2', title: 'Интеграция с API', columnId: 'col-1', labels: [{ id: 'l2', text: 'Бэкенд', color: '#8b5cf6' }] },
        'card-3': { id: 'card-3', title: 'Аутентификация пользователей', description: 'Проверка безопасности OAuth2', columnId: 'col-2', labels: [{ id: 'l3', text: 'Безопасность', color: '#ef4444' }] },
        'card-4': { id: 'card-4', title: 'Редизайн лендинга', columnId: 'col-3', labels: [{ id: 'l4', text: 'Дизайн', color: '#ec4899' }] },
        'card-5': { id: 'card-5', title: 'Схема базы данных', columnId: 'col-3', labels: [{ id: 'l5', text: 'Бэкенд', color: '#8b5cf6' }] },
      },
    },
    {
      id: 'board-2',
      title: 'Маркетинговая кампания',
      color: '#f59e0b',
      columns: [
        { id: 'col-m1', title: 'Идеи', cardIds: ['card-m1', 'card-m2'] },
        { id: 'col-m2', title: 'В работе', cardIds: ['card-m3'] },
        { id: 'col-m3', title: 'Готово', cardIds: ['card-m4'] },
      ],
      cards: {
        'card-m1': { id: 'card-m1', title: 'Стратегия соцсетей на Q2', columnId: 'col-m1', labels: [{ id: 'lm1', text: 'Соцсети', color: '#f59e0b' }] },
        'card-m2': { id: 'card-m2', title: 'Шаблон рассылки', columnId: 'col-m1', labels: [{ id: 'lm2', text: 'Контент', color: '#10b981' }] },
        'card-m3': { id: 'card-m3', title: 'Мероприятие по запуску продукта', description: 'Планирование запуска в Q2', columnId: 'col-m2', labels: [{ id: 'lm3', text: 'Мероприятие', color: '#6366f1' }] },
        'card-m4': { id: 'card-m4', title: 'Гайдлайны бренда v2', columnId: 'col-m3', labels: [{ id: 'lm4', text: 'Дизайн', color: '#ec4899' }] },
      },
    },
    {
      id: 'board-3',
      title: 'Дизайн-система',
      color: '#ec4899',
      columns: [
        { id: 'col-d1', title: 'Запланировано', cardIds: ['card-d1', 'card-d2'] },
        { id: 'col-d2', title: 'В разработке', cardIds: ['card-d3'] },
        { id: 'col-d3', title: 'Выпущено', cardIds: [] },
      ],
      cards: {
        'card-d1': { id: 'card-d1', title: 'Система цветовых токенов', columnId: 'col-d1', labels: [{ id: 'ld1', text: 'Токены', color: '#ec4899' }] },
        'card-d2': { id: 'card-d2', title: 'Поддержка тёмной темы', description: 'Тёмные варианты для всех компонентов', columnId: 'col-d1', labels: [{ id: 'ld2', text: 'Тема', color: '#8b5cf6' }] },
        'card-d3': { id: 'card-d3', title: 'Компонент Button', columnId: 'col-d2', labels: [{ id: 'ld3', text: 'Компонент', color: '#6366f1' }] },
      },
    },
  ],
}
