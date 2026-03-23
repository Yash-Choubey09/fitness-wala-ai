const fs = require('fs');
const path = require('path');

const createExercises = () => {
  const db = [];
  let idCounter = 1;

  const cats = {
    Chest: [
      { n: 'Push-Ups', d: 'Beginner', e: 'None', i: 'Medium', m: 'Pectoralis Major' },
      { n: 'Incline Push-Ups', d: 'Beginner', e: 'None', i: 'Low', m: 'Lower Chest' },
      { n: 'Knee Push-Ups', d: 'Beginner', e: 'None', i: 'Low', m: 'Chest / Triceps' },
      { n: 'Dumbbell Bench Press', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Chest' },
      { n: 'Incline Dumbbell Press', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Upper Chest' },
      { n: 'Dumbbell Flyes', d: 'Intermediate', e: 'Dumbbell', i: 'Low', m: 'Chest' },
      { n: 'Barbell Bench Press', d: 'Intermediate', e: 'Barbell', i: 'High', m: 'Chest' },
      { n: 'Decline Barbell Press', d: 'Advanced', e: 'Barbell', i: 'High', m: 'Lower Chest' },
      { n: 'Weighted Dips', d: 'Advanced', e: 'None', i: 'High', m: 'Chest / Triceps' },
      { n: 'Cable Crossovers', d: 'Advanced', e: 'Machine', i: 'Medium', m: 'Inner Chest' }
    ],
    Back: [
      { n: 'Supermans', d: 'Beginner', e: 'None', i: 'Low', m: 'Erectors' },
      { n: 'Reverse Snow Angels', d: 'Beginner', e: 'None', i: 'Low', m: 'Upper Back' },
      { n: 'Wall Slides', d: 'Beginner', e: 'None', i: 'Low', m: 'Scapula' },
      { n: 'Dumbbell Rows', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Lats' },
      { n: 'Lat Pulldown', d: 'Intermediate', e: 'Machine', i: 'Medium', m: 'Lats' },
      { n: 'Seated Cable Row', d: 'Intermediate', e: 'Machine', i: 'Medium', m: 'Mid Back' },
      { n: 'Barbell Row', d: 'Intermediate', e: 'Barbell', i: 'High', m: 'Lats / Mid Back' },
      { n: 'Pull-Ups', d: 'Advanced', e: 'None', i: 'High', m: 'Lats' },
      { n: 'T-Bar Row', d: 'Advanced', e: 'Machine', i: 'High', m: 'Mid Back' },
      { n: 'Deadlift', d: 'Advanced', e: 'Barbell', i: 'High', m: 'Lower Back / Hamstrings' }
    ],
    Legs: [
      { n: 'Bodyweight Squats', d: 'Beginner', e: 'None', i: 'Medium', m: 'Quads' },
      { n: 'Glute Bridges', d: 'Beginner', e: 'None', i: 'Low', m: 'Glutes' },
      { n: 'Walking Lunges', d: 'Beginner', e: 'None', i: 'Medium', m: 'Quads / Glutes' },
      { n: 'Goblet Squat', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Quads' },
      { n: 'Romanian Deadlift', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Hamstrings' },
      { n: 'Leg Press', d: 'Intermediate', e: 'Machine', i: 'Medium', m: 'Quads' },
      { n: 'Bulgarian Split Squat', d: 'Intermediate', e: 'Dumbbell', i: 'High', m: 'Quads / Glutes' },
      { n: 'Barbell Back Squat', d: 'Advanced', e: 'Barbell', i: 'High', m: 'Quads' },
      { n: 'Barbell Front Squat', d: 'Advanced', e: 'Barbell', i: 'High', m: 'Quads / Core' },
      { n: 'Hack Squat', d: 'Advanced', e: 'Machine', i: 'High', m: 'Quads' }
    ],
    Core: [
      { n: 'Crunches', d: 'Beginner', e: 'None', i: 'Low', m: 'Upper Abs' },
      { n: 'Plank', d: 'Beginner', e: 'None', i: 'Medium', m: 'Global Core' },
      { n: 'Lying Leg Raises', d: 'Beginner', e: 'None', i: 'Low', m: 'Lower Abs' },
      { n: 'Russian Twists', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Obliques' },
      { n: 'Bicycle Crunches', d: 'Intermediate', e: 'None', i: 'Medium', m: 'Obliques' },
      { n: 'Hanging Knee Raises', d: 'Intermediate', e: 'None', i: 'Medium', m: 'Lower Abs' },
      { n: 'Cable Crunches', d: 'Intermediate', e: 'Machine', i: 'Medium', m: 'Abs' },
      { n: 'Ab Wheel Rollout', d: 'Advanced', e: 'None', i: 'High', m: 'Global Core' },
      { n: 'Hanging Leg Raises', d: 'Advanced', e: 'None', i: 'High', m: 'Lower Abs' },
      { n: 'Dragon Flags', d: 'Advanced', e: 'None', i: 'High', m: 'Global Core' }
    ],
    Arms: [
      { n: 'Bench Dips', d: 'Beginner', e: 'None', i: 'Low', m: 'Triceps' },
      { n: 'Diamond Push-Ups (Knees)', d: 'Beginner', e: 'None', i: 'Medium', m: 'Triceps' },
      { n: 'Arm Circles', d: 'Beginner', e: 'None', i: 'Low', m: 'Shoulders' },
      { n: 'Bicep Curls', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Biceps' },
      { n: 'Tricep Pushdown', d: 'Intermediate', e: 'Machine', i: 'Medium', m: 'Triceps' },
      { n: 'Hammer Curls', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Biceps / Brachialis' },
      { n: 'Lateral Raises', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Side Delts' },
      { n: 'Overhead Tricep Ext', d: 'Advanced', e: 'Dumbbell', i: 'High', m: 'Triceps' },
      { n: 'Barbell Curl', d: 'Advanced', e: 'Barbell', i: 'High', m: 'Biceps' },
      { n: 'Preacher Curl', d: 'Advanced', e: 'Machine', i: 'High', m: 'Biceps' }
    ],
    Cardio: [
      { n: 'Jumping Jacks', d: 'Beginner', e: 'None', i: 'Low', m: 'Full Body' },
      { n: 'High Knees', d: 'Beginner', e: 'None', i: 'Medium', m: 'Legs / Core' },
      { n: 'Butt Kicks', d: 'Beginner', e: 'None', i: 'Low', m: 'Hamstrings' },
      { n: 'Jump Rope', d: 'Intermediate', e: 'None', i: 'Medium', m: 'Calves' },
      { n: 'Mountain Climbers', d: 'Intermediate', e: 'None', i: 'Medium', m: 'Core / Shoulders' },
      { n: 'Rowing Machine', d: 'Intermediate', e: 'Machine', i: 'High', m: 'Full Body' },
      { n: 'Cycling', d: 'Intermediate', e: 'Machine', i: 'Medium', m: 'Legs' },
      { n: 'Sprints', d: 'Advanced', e: 'None', i: 'High', m: 'Legs' },
      { n: 'Double Unders', d: 'Advanced', e: 'None', i: 'High', m: 'Calves' },
      { n: 'Stair Climber', d: 'Advanced', e: 'Machine', i: 'High', m: 'Legs' }
    ],
    'Full Body': [
      { n: 'Inchworms', d: 'Beginner', e: 'None', i: 'Low', m: 'Core / Shoulders' },
      { n: 'Bear Crawls', d: 'Beginner', e: 'None', i: 'Medium', m: 'Shoulders / Quads' },
      { n: 'Step-Ups', d: 'Beginner', e: 'None', i: 'Medium', m: 'Quads / Glutes' },
      { n: 'Burpees', d: 'Intermediate', e: 'None', i: 'High', m: 'Chest / Legs / Cardio' },
      { n: 'Kettlebell Swings', d: 'Intermediate', e: 'Dumbbell', i: 'Medium', m: 'Posterior Chain' },
      { n: 'Thrusters', d: 'Intermediate', e: 'Dumbbell', i: 'High', m: 'Quads / Shoulders' },
      { n: 'Renegade Rows', d: 'Intermediate', e: 'Dumbbell', i: 'High', m: 'Back / Core' },
      { n: 'Clean and Press', d: 'Advanced', e: 'Barbell', i: 'High', m: 'Full Body' },
      { n: 'Snatch', d: 'Advanced', e: 'Barbell', i: 'High', m: 'Full Body' },
      { n: 'Muscle-Ups', d: 'Advanced', e: 'None', i: 'High', m: 'Lats / Chest / Triceps' }
    ]
  };

  const images = [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80',
    'https://images.unsplash.com/photo-1598971639058-38e6b8c6d5b3?w=800&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
    'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&q=80'
  ];

  for (const [category, exercises] of Object.entries(cats)) {
    for (const ex of exercises) {
      db.push({
        id: idCounter++,
        name: ex.n,
        muscle: ex.m,
        category: category,
        difficulty: ex.d,
        equipment: ex.e,
        intensity: ex.i,
        duration: ex.d === 'Beginner' ? '3–4 min' : ex.d === 'Intermediate' ? '4–5 min' : '5–8 min',
        sets: ex.d === 'Beginner' ? '3' : '4',
        reps: ex.d === 'Beginner' ? '12-15' : ex.d === 'Intermediate' ? '8-12' : '5-8',
        calories: ex.d === 'Beginner' ? '~50' : ex.d === 'Intermediate' ? '~80' : '~120',
        tut: 'Controlled',
        rpe: ex.d === 'Beginner' ? 6 : ex.d === 'Intermediate' ? 8 : 9,
        thumbnail: images[idCounter % images.length],
        gifUrl: '',
        youtubeId: 'IODxDxX7oi4',
        description: `Complete ${ex.n} to engage your ${ex.m} for maximum performance. Maintain strict form.`,
        tips: [
          'Maintain a neutral spine',
          'Focus on the mind-muscle connection',
          'Control the eccentric phase'
        ],
        goals: ['fat loss', 'muscle gain', 'endurance', 'maintenance'],
        levels: ['beginner', 'intermediate', 'advanced']
      });
    }
  }
  return db;
};

const output = `// Auto-generated 70-exercise database for AI Fitness Coach
export const EXERCISE_DATABASE = ${JSON.stringify(createExercises(), null, 2)};
`;

fs.writeFileSync('c:\\\\Users\\\\LENOVO\\\\Desktop\\\\AGAutonomous AI Based Fitness Coach - Project\\\\frontend\\\\src\\\\data\\\\exerciseData.js', output);
console.log('Successfully generated 70 exercises.');
