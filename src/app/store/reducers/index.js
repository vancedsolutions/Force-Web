import {
    combineReducers
} from "redux";
import UserReducer from "./User";
import PatientReducer from "./reports/patienthours";
import NoPayrollActiveReducer from "./reports/nopayrollactive";
import BankReducer from "./file-conversion/bank";
import TaxCollectionReducer from "./file-conversion/tax-collection";
import TaxPaymentReducer from "./file-conversion/tax-payment";
import ConversionToolReducer from "./file-conversion/soh-tool";
import CompaniesReducer from "./Admin/clients";
import WageReducer from "./Admin/wage";
import WageLocationReducer from "./wagelocation";
import CostCenterReducer from "./Admin/costcenter";
import EarningCodeReducer from "./Admin/earningcode";
import WageParityReducer from "./reports/wageparity";
import TeamSupportRegisterReducer from "./Admin/teamsupportregister";
import LatePayrollReducer from "./reports/latePayrollDetail";
import savedEarningsCodes from "./Admin/savedEarningsCodesR";
import clientsR from "./api-setup/clientsR";
import clientR from "./api-setup/clientR";
import wageRateLocationsR from "./Admin/wageRateLocationsR";
import WPSetupR from "./Admin/WPSetup";
import PermissionReducer from "./Admin/permission";
import backgroundTasks from "./Admin/backgroundTasksR";
import Users from "./Admin/users";
import ExportEarningCode from "./Admin/exportEarningCodeR";
import PermissionByCompanyReducer from "./Admin/permissionByCompany";
import DefaultEinReducer from "./Admin/defaultEin";
import payrollR from "./payrollR";
import EditClientData from "./Admin/editReportData";
import ReportIdReducer from "./Admin/reportIdR";
import FlatRateR from "./Admin/flatRateR";
import roleList from "./Admin/roleListR";
import Role from "./Admin/roleR";
import UserRolePermissionReducer from "./Admin/userRolePermissionR";
import PurchasedOrderR from "./Admin/purchaseOrder";
import OutboundOrder from "./Admin/outboundOrder";
import UserErrorReducer from "./userError";
import ItemsOrderR from "./Admin/itemsOrder";
import GetAccrualsReportR from "./reports/accruals_report";
import BillingServicesR from "./Admin/billing-services";
import ItemStatusR from "./Admin/itemStatus";
import WarrantyExpirationR from "./Admin/warrantyExpiration";
import OrderIdR from "./Admin/orderId";
import SerialNumberR from "./Admin/serialNumber";
import RoleConfigReducer from "./Admin/roleConfigR";
import NewHireReducer from "./file-conversion/new-hire";
import CsrAssignmentsR from "./Admin/csrAssignments";
import ReportSettingsReducer from "./Admin/report-settings";
import DirectDepositReducer from "./file-conversion/direct-deposit";

const Reducers = combineReducers({
    USER: UserReducer,
    GET_PATIENT_HOUR: PatientReducer,
    NO_PAYROLL_ACTIVITY: NoPayrollActiveReducer,
    BANK_CONVERSION: BankReducer,
    TAX_COLLECTIONS: TaxCollectionReducer,
    TAX_PAYMENT: TaxPaymentReducer,
    CONVERSION_TOOL: ConversionToolReducer,
    GET_COMPANIES: CompaniesReducer,
    WAGE: WageReducer,
    WAGE_LOCATION: WageLocationReducer,
    COST_CENTERS: CostCenterReducer,
    earningsCodes: EarningCodeReducer,
    WAGE_PARITY: WageParityReducer,
    TEAM_SUPPORT_REGISTER: TeamSupportRegisterReducer,
    LATE_PAYROLL_REPORT: LatePayrollReducer,
    savedEarningsCodes,
    clients: clientsR,
    client: clientR,
    wageRateLocations: wageRateLocationsR,
    WPSetup: WPSetupR,
    PERMISSIONS: PermissionReducer,
    backgroundTasks,
    GET_USERS: Users,
    getPermissionActive: PermissionByCompanyReducer,
    ExportEarningCode,
    DefaultEinReducer,
    PayrollDetail: payrollR,
    EDIT_CLIENT_DATA: EditClientData,
    defaultEins: DefaultEinReducer,
    report_ID: ReportIdReducer,
    flatRateLocation: FlatRateR,
    add_Role: Role,
    roleConfigList: RoleConfigReducer,
    role_List: roleList,
    user_Error: UserErrorReducer,
    PurchasedOrder: PurchasedOrderR,
    OutboundOrderR: OutboundOrder,
    UserRolePermission: UserRolePermissionReducer,
    ItemsOrderR: ItemsOrderR,
    AccrualsReportList: GetAccrualsReportR,
    BillingServices: BillingServicesR,
    ItemStatusList: ItemStatusR,
    EXPIRATION_DATE: WarrantyExpirationR,
    OrderIdR: OrderIdR,
    SERIAL_NUMBER_R: SerialNumberR,
    NewHire: NewHireReducer,
    DirectDeposit: DirectDepositReducer,
    CSR: CsrAssignmentsR,
    REPORT_SETTINGS: ReportSettingsReducer

});
export default Reducers;