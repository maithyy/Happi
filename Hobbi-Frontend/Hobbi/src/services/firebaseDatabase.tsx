export const saveUserData = async (
  id: string,
  firstName: string,
  lastName: string,
  email: string
) => {
  try {
    const data = {
      user_id: id,
      first_name: firstName,
      last_name: lastName,
      email: email,
    };

    const response = await fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);
  } catch (error) {
    console.error("Failed to save user data:", error);
  }
};

export const savePreferenceData = async (
  id: string,
  exercise_goal: number,
  skill: string,
  equipment: string[],
  sleep_goal: number,
  wakeup_time: number
) => {
  try {
    const data = {
      user_id: id,
      exercise_goal: exercise_goal,
      skill: skill,
      equipment: equipment,
      sleep_goal: sleep_goal,
      wakeup_time: wakeup_time,
    };

    const response = fetch("http://127.0.0.1:5000/signup/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);
  } catch (error) {
    console.error("Failed to save preference data:", error);
  }
};
