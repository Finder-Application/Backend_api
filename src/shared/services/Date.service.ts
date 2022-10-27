export class DateService {
  static getOnlyDate(dateString?: string): string | undefined {
    if (dateString) {
      return new Date(dateString).toISOString()?.split('T')[0];
    }
    return dateString;
  }
}
