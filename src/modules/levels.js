export const Levels = {
  EASY: 'easy',
  HARD: 'hard',
  CRAZY: 'crazy'
}

export const LevelConf = {
  [Levels.EASY]: {
    noteRanges: {
      first: 60,
      last: 72
    },
    initScore: 5,
    rangeHintNotes: 10, // Assuming noteRanges > rangeHintNotes
    numHintNotes: 5
  },
  [Levels.HARD]: {
    noteRanges: {
      first: 48,
      last: 84
    },
    initScore: 7,
    rangeHintNotes: 15, // Assuming noteRanges > rangeHintNotes
    numHintNotes: 7
  },
  [Levels.CRAZY]: {
    noteRanges: {
      first: 31,
      last: 98
    },
    initScore: 10,
    rangeHintNotes: 20, // Assuming noteRanges > rangeHintNotes
    numHintNotes: 10
  }
}

Object.freeze(Levels);
