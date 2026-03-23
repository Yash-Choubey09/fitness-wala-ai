// Mocked AI Controller for Fitness Wala AI
// Later, this can plug into @google/generative-ai
export const generateWorkoutPlan = async (req, res) => {
  try {
    const { goal, experienceLevel, age, weight, height } = req.body;
    
    // Mock response parsing
    const mockedPlan = {
      message: `Personalized ${goal} plan for a ${experienceLevel} level user.`,
      workouts: [
        {
          id: 1,
          name: 'Push Ups',
          sets: 3,
          reps: '10-15',
          restTime: '60s',
          youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
        },
        {
          id: 2,
          name: 'Squats',
          sets: 4,
          reps: '12',
          restTime: '90s',
          youtubeUrl: 'https://www.youtube.com/watch?v=gcNh17Ckjgg'
        },
        {
          id: 3,
          name: 'Planks',
          sets: 3,
          reps: '60s',
          restTime: '30s',
          youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw'
        }
      ]
    };
    
    res.json(mockedPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Workout Plan Generation Failed' });
  }
};

export const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    
    let reply = "I'm your AI fitness coach! Keep pushing yourself. Make sure to hydrate and consume enough protein.";
    if (message.toLowerCase().includes('chest')) {
      reply = "For chest, I recommend bench press, push-ups, and dumbbell flyes. Aim for 3-4 sets of 8-12 reps for hypertrophy.";
    } else if (message.toLowerCase().includes('belly fat')) {
      reply = "To lose belly fat, focus on a caloric deficit, high-protein diet, and consistent cardiovascular exercises combined with core strength training like planks.";
    }
    
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Chat Failed' });
  }
};
