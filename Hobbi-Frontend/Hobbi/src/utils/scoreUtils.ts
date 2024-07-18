function getLetterGrade(percentage: number): string {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
}

export function getSleepGrade(sleep: number): string {
    const grade = getLetterGrade(sleep);
    const sleepPercentage = sleep.toFixed(2);
    return `${grade} (${sleepPercentage}%)`;
}

export function getJournalGrade(score: number): string {
    const percentage = ((score + 1) / 2) * 100; // Mapping -1 to 1 range to 0-100
    const grade = getLetterGrade(percentage);
    const formattedPercentage = percentage.toFixed(2);
    return `${grade} (${formattedPercentage}%)`;
}

export function getOverallGrade(score: number): string {
    const percentage = score * 100; // Mapping 0 to 1 range to 0-100
    const grade = getLetterGrade(percentage);
    const formattedPercentage = percentage.toFixed(2);
    return `${grade} (${formattedPercentage}%)`;

}

export function getRecommendation(sentimentScore: number, sleepScore: number, exerciseScore: number, journalDate: string): string {
    const date = new Date();
    const dateString = date.toDateString();
    
    let rec = ""
    let depressed = 0;
    if (journalDate === dateString){
      if (sentimentScore < 0.25) {
        rec = "It sounds like you're having a tough day. Consider reaching out to a friend or practicing mindfulness to help lift your mood.";
        depressed = 1;
      } else if (sentimentScore < 0.5) {
        rec = "You're not feeling your best today. Why not spend some time outdoors or engage in a hobby you enjoy? It might help improve your mood.";
      } else if (sentimentScore < 0.75) {
        rec = "You're doing okay, but there's room for improvement. Take care of any outstanding tasks or chores to alleviate any stress.";
      } else {
        rec = "You're feeling good today! Why not challenge yourself to learn something new or try a new activity?";
      }
      
      if (sleepScore < 1)
      {
        rec += " If you're feeling tired, consider taking a short nap to recharge.";
      } else if (exerciseScore < 1)
      {
        if (depressed == 1){
          rec += " If you haven't met your exercise goal, try incorporating some light physical activity into your routine, such as stretching or a short walk. However, if you're not feeling up to it, it's okay to prioritize self-care and relaxation."
        } else {
          rec += " Incorporating some physical activity into your day can boost your mood and energy levels. Maybe go for a walk or do some exercise?";
        }
      } else
      {
        rec += " It seems like you're on track with your sleep and exercise goals. Take some time to relax and enjoy yourself!";
      }
    } else {
      rec = "Please write today's journal to get today's overall recommendation."
    }
    return rec;
}


