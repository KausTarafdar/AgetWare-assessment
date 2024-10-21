export function getMonthsLeft(start_date: Date, no_of_years_till_end: number, current_date: Date) {
    // Calculate the end date by adding the number of years to the start_date
    const end_date = new Date(start_date);
    end_date.setFullYear(end_date.getFullYear() + no_of_years_till_end);

    // Calculate year and month difference between current_date and end_date
    const yearsDiff = end_date.getFullYear() - current_date.getFullYear();
    const monthsDiff = end_date.getMonth() - current_date.getMonth();

    // Total months left between current_date and end_date
    return yearsDiff * 12 + monthsDiff;
  }
