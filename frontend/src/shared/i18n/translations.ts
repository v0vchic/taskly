export type Lang = 'en' | 'ru'

export interface Translations {
  // Sidebar
  projects: string
  newProject: string
  projectName: string
  create: string
  developer: string

  // Board Header
  manager: string
  signOut: string
  openSidebar: string
  closeSidebar: string

  // Column
  rename: string
  deleteColumn: string
  addCard: string
  cardTitle: string
  addCardBtn: string
  addList: string
  columnName: string
  addColumn: string

  // Card Modal
  editCard: string
  title: string
  cardTitlePlaceholder: string
  description: string
  descriptionPlaceholder: string
  dueDate: string
  assignee: string
  unassigned: string
  notAssigned: string
  labels: string
  addLabel: string
  labelText: string
  add: string
  cancel: string
  delete: string
  save: string

  // Comments
  comments: string
  noComments: string
  loadingComments: string
  writeComment: string
  saveComment: string
  cancelComment: string

  // Login
  signIn: string
  signingIn: string
  email: string
  password: string
  invalidCredentials: string
  demoAccounts: string
  signInSubtitle: string

  // App states
  loadingProjects: string
  noProjects: string
  backToLogin: string

  // Language toggle
  language: string
}

export const t: Record<Lang, Translations> = {
  en: {
    projects: 'Projects',
    newProject: 'New project',
    projectName: 'Project name...',
    create: 'Create',
    developer: 'Developer',

    manager: 'Manager',
    signOut: 'Sign out',
    openSidebar: 'Open sidebar',
    closeSidebar: 'Close sidebar',

    rename: 'Rename',
    deleteColumn: 'Delete column',
    addCard: 'Add a card',
    cardTitle: 'Card title...',
    addCardBtn: 'Add card',
    addList: 'Add another list',
    columnName: 'Column name...',
    addColumn: 'Add column',

    editCard: 'Edit Card',
    title: 'Title',
    cardTitlePlaceholder: 'Card title...',
    description: 'Description',
    descriptionPlaceholder: 'Add a description...',
    dueDate: 'Due Date',
    assignee: 'Assignee',
    unassigned: '— Unassigned —',
    notAssigned: 'Not assigned',
    labels: 'Labels',
    addLabel: '+ Add label',
    labelText: 'Label text...',
    add: 'Add',
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',

    comments: 'Comments',
    noComments: 'No comments yet. Be the first!',
    loadingComments: 'Loading comments…',
    writeComment: 'Write a comment… (Enter to send)',
    saveComment: 'Save',
    cancelComment: 'Cancel',

    signIn: 'Sign in',
    signingIn: 'Signing in…',
    email: 'Email',
    password: 'Password',
    invalidCredentials: 'Invalid credentials',
    demoAccounts: 'Demo accounts:',
    signInSubtitle: 'Sign in to continue',

    loadingProjects: 'Loading projects…',
    noProjects: 'No projects found.',
    backToLogin: 'Back to login',

    language: 'EN',
  },

  ru: {
    projects: 'Проекты',
    newProject: 'Новый проект',
    projectName: 'Название проекта...',
    create: 'Создать',
    developer: 'Разработчик',

    manager: 'Менеджер',
    signOut: 'Выйти',
    openSidebar: 'Открыть панель',
    closeSidebar: 'Закрыть панель',

    rename: 'Переименовать',
    deleteColumn: 'Удалить колонку',
    addCard: 'Добавить карточку',
    cardTitle: 'Название карточки...',
    addCardBtn: 'Добавить',
    addList: 'Добавить список',
    columnName: 'Название колонки...',
    addColumn: 'Добавить колонку',

    editCard: 'Редактировать карточку',
    title: 'Заголовок',
    cardTitlePlaceholder: 'Название карточки...',
    description: 'Описание',
    descriptionPlaceholder: 'Добавить описание...',
    dueDate: 'Срок',
    assignee: 'Исполнитель',
    unassigned: '— Не назначен —',
    notAssigned: 'Не назначен',
    labels: 'Метки',
    addLabel: '+ Добавить метку',
    labelText: 'Текст метки...',
    add: 'Добавить',
    cancel: 'Отмена',
    delete: 'Удалить',
    save: 'Сохранить',

    comments: 'Комментарии',
    noComments: 'Комментариев пока нет. Будьте первым!',
    loadingComments: 'Загрузка комментариев…',
    writeComment: 'Написать комментарий… (Enter для отправки)',
    saveComment: 'Сохранить',
    cancelComment: 'Отмена',

    signIn: 'Войти',
    signingIn: 'Вход…',
    email: 'Электронная почта',
    password: 'Пароль',
    invalidCredentials: 'Неверные учётные данные',
    demoAccounts: 'Демо-аккаунты:',
    signInSubtitle: 'Войдите, чтобы продолжить',

    loadingProjects: 'Загрузка проектов…',
    noProjects: 'Проекты не найдены.',
    backToLogin: 'Вернуться к входу',

    language: 'RU',
  },
} as const
