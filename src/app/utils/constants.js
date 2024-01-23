const app_env = process.env.REACT_APP_ENV;

export const apiEndPoint = app_env?.trim() === 'development' ?
    'http://localhost:5001/' :
    // "http://excelforceapi.datavanced.com/" :
    app_env?.trim() === 'test' ?
        "https://excelforce-beta.azurewebsites.net" :
        "https://excelforce.azurewebsites.net/";

export const BILLING_CATEGORIES = [
    "ACA Manager™",
    "CMS Staffing Data Submission",
    "EverythingBenefits",
    "HR",
    "HRAnswerLink SSO",
    "Labor Posters",
    "PR",
    "SMS Integration with Twilio",
    "TLM"
];

export const weekDays = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];
export const fileFormat = [
    "pdf", "csv"
];
export const weekZone = [
    "Daily", "Weekly", "Monthly", "Quarterly"
];

export const weekDaysNew = [
    { "day": "Sunday", "isActive": false },
    { "day": "Monday", "isActive": false },
    { "day": "Tuesday", "isActive": false },
    { "day": "Wednesday", "isActive": false },
    { "day": "Thursday", "isActive": false },
    { "day": "Friday", "isActive": false },
    { "day": "Saturday", "isActive": false },
];

export const clientPermissionsList = [
    {
        key: "WAGE_PARITY",
        label: "Wage Parity",
        group: "REPORTS"
    },
    {
        key: "PATIENT_HOURS",
        label: "Patient Hours",
        group: "REPORTS"
    },
    {
        key: "CERTIFIED_PAYROLL",
        label: "Certified Payroll",
        group: "REPORTS"
    },
    {
        key: "EMPLOYEES_ACCRUALS",
        label: "Employee Accrual Totals",
        group: "REPORTS"
    },
    {
        key: "SPREAD_OF_HOURS_TOOL",
        label: "Spread of hours tool",
        group: "TOOLS"
    }, {
        key: "DIRECT_DEPOSIT_TOOL",
        label: "Direct Deposit tool",
        group: "TOOLS"
    }, {
        key: "STRAIGHT_COMPARISON",
        label: "Straight Comparison",
        group: "COMPARISON_COLUMNS"
    },
    {
        key: "REGULAR_PAY_ONLY",
        label: "Regular pay only",
        group: "COMPARISON_COLUMNS"
    },
    {
        key: "COMBINED_METHOD",
        label: "Combined Method",
        group: "COMPARISON_COLUMNS"
    }
];


