export const predefinedPlans = [
  {
    id: "bro-split",
    name: "Bro Split",
    description: "Chest, Back, Shoulders, Arms, Legs",
    isDefault: true,
    days: {
      Monday: ["chest"],
      Tuesday: ["back"],
      Wednesday: ["shoulders"],
      Thursday: ["arms"],
      Friday: ["legs"],
      Saturday: [],
      Sunday: [],
    },
  },
  {
    id: "push-pull-legs",
    name: "Push/Pull/Legs",
    description: "Push, Pull, Legs split",
    isDefault: true,
    days: {
      Monday: ["chest", "shoulders", "triceps"],
      Tuesday: ["back", "biceps"],
      Wednesday: ["legs"],
      Thursday: ["chest", "shoulders", "triceps"],
      Friday: ["back", "biceps"],
      Saturday: ["legs"],
      Sunday: [],
    },
  },
  {
    id: "full-body",
    name: "Full Body",
    description: "Full body workouts",
    isDefault: true,
    days: {
      Monday: ["chest", "back", "legs", "shoulders", "arms"],
      Tuesday: [],
      Wednesday: ["chest", "back", "legs", "shoulders", "arms"],
      Thursday: [],
      Friday: ["chest", "back", "legs", "shoulders", "arms"],
      Saturday: [],
      Sunday: [],
    },
  },
  {
    id: "upper-lower",
    name: "Upper/Lower",
    description: "Upper and lower body split",
    isDefault: true,
    days: {
      Monday: ["chest", "back", "shoulders", "arms"],
      Tuesday: ["legs"],
      Wednesday: [],
      Thursday: ["chest", "back", "shoulders", "arms"],
      Friday: ["legs"],
      Saturday: [],
      Sunday: [],
    },
  },
];

export const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
