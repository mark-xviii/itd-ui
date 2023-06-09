enum AVAILABLE_AP_ENTITIES_ENUM {
  SEQUENCES = 'sequences',
  CHARACTERS = 'characters',
  CARDS = 'cards',
  USERS = 'users',
  SESSIONS = 'sessions',
  LOGIN = 'auth/login',
  REGISTER = 'auth/register',
}

enum AVAILABLE_AP_ACTIONS_ENUM {
  LIST = 'list',
  POST = 'post',
  EDIT = 'edit',
}

enum CARD_TYPES_ENUM {
  SEQUENCE_BEGINNING = 'Sequence beginning',
  SEQUENCE_ENDING = 'Sequence ending',
  SEQUENCED = 'Sequenced',
  COMMON = 'Common',
}

export const Constants = {
  API_URL: process.env.REACT_APP_API_URL,
  AVAILABLE_AP_ENTITIES_ENUM,
  AVAILABLE_AP_ACTIONS_ENUM,
  CARD_TYPES_ENUM,
};
