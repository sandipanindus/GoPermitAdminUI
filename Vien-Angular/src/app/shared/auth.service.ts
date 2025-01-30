import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, from } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Headers, HttpModule, Http } from '@angular/http';
import { LoginDto } from './loginDto';
export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  baseUrl: any

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {
    // this.baseUrl = 'http://smartpermitapi.eisappserver.net/'
    //this.baseUrl = "http://smartpermitapi.fadelsoft.com/";
  //   this.baseUrl = 'http://localhost:53846/';
 this.baseUrl = 'http://goapi.fadelsoft.co.in/'
    // this.baseUrl='http://webapi.enhanceai.ca/'
    //this.baseUrl = 'https://api.gopermit.co.uk/';
  }

  signIn(credentials: ISignInCredentials): Observable<auth.UserCredential> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password));
  }

  signOut() {
    return from(this.afAuth.auth.signOut());
  }

  registration1(obj) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.baseUrl + "Reports/Cmstatusdetails_pdf", obj, { headers })
  }

  GetProfileById(Id) {
    return this.http.get(this.baseUrl + "api/Admin/GetTenantUserById?Id=" + Id)
  }

  getvehiclestimedetails(id, bayno): Observable<any> {
    return this.http.get(this.baseUrl + "api/Tenant/getvehcilecounts?tenantid=" + id + "&bayno=" + bayno)

  }

  public Gettoken(data): Observable<any> {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.baseUrl + "api/Login/Authenticate", data,
      { responseType: 'text' })
  }
  public GetValue(): Observable<any> {

    // let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    // headers.append('Content-Type', 'application/json');
    // let authToken = localStorage.getItem('token');
    // headers.append('Authorization', `Bearer ${authToken}`);

    return this.http.get(this.baseUrl + "api/Login/GetValue")
    // .map(response => response.json())
    // .catch();
    //return this.http.get(this.baseUrl + "api/Login/GetValue",httpOptions)
  }
  public GetModulesScreens(RoleId) {
    return this.http.get(this.baseUrl + "api/Admin/GetModulesScreens?RoleId=" + RoleId, { responseType: 'text' });
  }
  public SavePermissionData(data) {
    return this.http.post(this.baseUrl + "api/Admin/SavePermissionsData", data, { responseType: 'text' });
  }
  public GetScreens(RoleId, ClientId, LoginId) {
    return this.http.get(this.baseUrl + "api/Admin/GetScreens?RoleId=" + RoleId + "&ClientId=" + ClientId + "&LoginId=" + LoginId, { responseType: 'text' });
  }
  public SaveUser(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddRegisterUser", data, { responseType: 'text' })
  }
  public SaveTenantUser(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddTenantUser", data, { responseType: 'text' })
  }
  SaveTenantUseruploads(formdata) {
    return this.http.post(this.baseUrl + "api/Admin/AddTenantUseruploads", formdata);
  }
  public SaveBulkTenants(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddBulkTenants", data, { responseType: 'text' });
  }
  public SaveRole(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddRole", data, { responseType: 'text' });
  }
  public SaveTeam(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddTeam", data, { responseType: 'text' });
  }
  public SaveProject(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddProject", data, { responseType: 'text' });
  }
  public AddUser(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddUser", data, { responseType: 'text' });
  }
  public UpdateUser(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateUserProfile", data, { responseType: 'text' });
  }
  public UpdateTenantUser(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateTenantUser", data, { responseType: 'text' });
  }
  public UpdateRole(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateRole", data, { responseType: 'text' });
  }
  public UpdateTeam(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateTeam", data, { responseType: 'text' });
  }
  public UpdateProject(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateProject", data, { responseType: 'text' });
  }
  public GetRoles(PageNo, PageSize, Id, RoleId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetRoles?PageNo=" + PageNo + "&PageSize=" + PageSize + "&LoginId=" + Id + "&RoleId=" + RoleId, { responseType: 'text' });
  }
  public GetTeams(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetTeams?LoginId=" + Id, { responseType: 'text' });
  }
  public GetProjects(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetProjects?LoginId=" + Id, { responseType: 'text' });
  }
  public GetImportDataById(Id, pagesize, currentpage, search): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetDatasetsById?Id=" + Id, { responseType: 'text' });
  }
  public GetDataSourceName(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetDataSourceName?ProjectId=" + Id, { responseType: 'text' });
  }
  public GetCountries(): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetCountries", { responseType: 'text' });
  }
  public GetRolesById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetRoleById?Id=" + Id, { responseType: 'text' });
  }
  public GetTeamsById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetTeamById?Id=" + Id, { responseType: 'text' });
  }
  public GetProjectById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetProjectById?Id=" + Id, { responseType: 'text' });
  }
  public GetUsers(PageNo, PageSize, Id, RoleId, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetUsers?PageNo=" + PageNo + "&PageSize=" + PageSize + "&LoginId=" + Id + "&RoleId=" + RoleId + "&SiteId=" + SiteId, { responseType: 'text' });
  }
  public GetSearchUsers(PageNo, PageSize, FirstName, LastName, Email, SiteName, LoginId, RoleId, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSearchUser?PageNo=" + PageNo + "&PageSize=" + PageSize + "&FirstName=" + FirstName + "&LastName=" + LastName + "&Email=" + Email + "&SiteName=" + SiteName + "&LoginId=" + LoginId + "&RoleId=" + RoleId + "&SiteId=" + SiteId, { responseType: 'text' });
  }
  public GetSearchTenants(PageNo, PageSize, FirstName, LastName, Email, MobileNumber, SiteName, SiteId,vrm): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSearchTenant?PageNo=" + PageNo + "&PageSize=" + PageSize + "&FirstName=" + FirstName + "&LastName=" + LastName + "&Email=" + Email + "&MobileNumber=" + MobileNumber + "&SiteName=" + SiteName + "&SiteId=" + SiteId+ "&VRM=" + vrm, { responseType: 'text' });
  }
  public GetTenantUsers(PageNo, PageSize, Id, RoleId, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetTenantUsers?PageNo=" + PageNo + "&PageSize=" + PageSize + "&LoginId=" + Id + "&RoleId=" + RoleId + "&SiteId=" + SiteId, { responseType: 'text' });
  }
  public GetRegisterUsers(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetRegisterUsers?LoginId=" + Id, { responseType: 'text' });
  }
  public GetUsersById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetUserById?Id=" + Id, { responseType: 'text' });
  }
  public GetTenantUserById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetTenantUserById?Id=" + Id, { responseType: 'text' });
  }
  public DeleteRole(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/RoleDelete?Id=" + Id, { responseType: 'text' });
  }
  public DeleteTeam(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/TeamDelete?Id=" + Id, { responseType: 'text' });
  }
  public DeleteProject(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/ProjectDelete?Id=" + Id, { responseType: 'text' });
  }
  public DeleteUser(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/UserDelete?Id=" + Id, { responseType: 'text' });
  }
  public getdomain(): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetDomainNames");
  }
  public SaveDatasource(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddDataSource", data, { responseType: 'text' });
  }
  public SaveVehicleData(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddVehicles", data, { responseType: 'text' });
  }
  public SaveSite(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddSite", data, { responseType: 'text' });
  }
  public SaveLabelclass(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddLabelClass", data, { responseType: 'text' });
  }
  public SaveImportDataImage(data, ProjectId, Dataset, LoginId): Observable<any> {
    //let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'multipart/form-data');
    return this.http.post(this.baseUrl + "api/Admin/SaveImportDataImage?ProjectId=" + ProjectId + '&Dataset=' + Dataset + '&LoginId=' + LoginId, data, { responseType: 'text' });
  }
  public GetDatasetResponse(Id, pagesize, currentpage, search): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetDatasetResponse?Id=" + Id + "&pagesize=" + pagesize + "&currentpage=" + currentpage + "&search=" + search, { responseType: 'text' })
  }
  public DeleteDatasetFile(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/DatasetFileDelete?Id=" + Id, { responseType: 'text' })
  }
  public DeleteMutipleDatasetFile(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/DatasetMultipleDelete?Id=" + Id, { responseType: 'text' })
  }
  public SaveFtpData(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/SaveFtpData", data, { responseType: 'text' });
  }
  public UpdateDataSource(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateDataSource", data, { responseType: 'text' });
  }
  public UpdateSupport(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateSupport", data, { responseType: 'text' });
  }
  public ReplySupport(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Tenant/ReplySupport", data, { responseType: 'text' });
  }
  public UpdateSite(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateSite", data, { responseType: 'text' });
  }
  public UpdateLabelClass(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateLabelClass", data, { responseType: 'text' });
  }
  public GetDataSources(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetDataSources?LoginId=" + Id, { responseType: 'text' });
  }
  public GetSupportList(PageNo, PageSize, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSupportlistAdmin?PageNo=" + PageNo + "&PageSize=" + PageSize + "&SiteId=" + SiteId, { responseType: 'text' });
  }
  public GetisReadNotifications(RoleId, LoginId, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetIsReadNotifications?RoleId=" + RoleId + "&LoginId=" + LoginId + "&SiteId=" + SiteId, { responseType: 'text' });
  }
  public GetSearchSupportList(PageNo, PageSize, SiteId, SiteName, Name, Email, MobileNumber, Subject): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSearchSupportlist?PageNo=" + PageNo + "&PageSize=" + PageSize + "&SiteId=" + SiteId + "&SiteName=" + SiteName + "&Name=" + Name + "&Email=" + Email + "&MobileNumber=" + MobileNumber + "&Subject=" + Subject, { responseType: 'text' });
  }
  public GetSupportById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSupportById?Id=" + Id, { responseType: 'text' });
  }
  public GetSupportMessages(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSupportAdminById?id=" + Id, { responseType: 'text' });
  }
  public GetVehicleDetails(): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetVehicleDetails", { responseType: 'text' });
  }
  public GetSites(PageNo, PageSize, Id, RoleId, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSites?PageNo=" + PageNo + "&PageSize=" + PageSize + "&LoginId=" + Id + "&RoleId=" + RoleId + "&SiteId=" + SiteId, { responseType: 'text' });
  }

  public Saveauditlog(obj): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/auditlog", obj, { responseType: 'text' });
  }
  public GetZatparkLogs(PageNo, PageSize, Id, RoleId, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetZatparkLogs?PageNo=" + PageNo + "&PageSize=" + PageSize + "&LoginId=" + Id + "&RoleId=" + RoleId + "&SiteId=" + SiteId, { responseType: 'text' });
  }
  public GetAuditLogs(PageNo, PageSize, RoleId, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetAuditLogs?PageNo=" + PageNo + "&PageSize=" + PageSize + "&RoleId=" + RoleId + "&SiteId=" + SiteId, { responseType: 'text' });
  }
  public GetSearchSites(PageNo, PageSize, SiteName, Email, MobileNumber, Id, RoleId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSearchSite?PageNo=" + PageNo + "&PageSize=" + PageSize + "&SiteName=" + SiteName + "&Email=" + Email + "&MobileNumber=" + MobileNumber + "&LoginId=" + Id + "&RoleId=" + RoleId, { responseType: 'text' });
  }
  public GetSearchZatParkLogs(PageNo, PageSize, Tenant, SiteName, BayNo, FromDate, ToDate, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSearchZatpark?PageNo=" + PageNo + "&PageSize=" + PageSize + "&Tenant=" + Tenant + "&SiteName=" + SiteName + "&BayNo=" + BayNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&SiteId=" + SiteId, { responseType: 'text' });
  }

  public GetSearchPingLogs(PageNo, PageSize, UserId, SiteId, FromDate, ToDate): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSearchPingFilter?PageNo=" + PageNo + "&PageSize=" + PageSize + "&UserId=" + UserId + "&SiteId=" + SiteId + "&FromDate=" + FromDate + "&ToDate=" + ToDate, { responseType: 'text' });
  }

  public GetSearchAuditLogs(PageNo, PageSize, Tenant, SiteName, FromDate, ToDate, SiteId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSearchAuditReport?PageNo=" + PageNo + "&PageSize=" + PageSize + "&Tenant=" + Tenant + "&SiteName=" + SiteName + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&SiteId=" + SiteId, { responseType: 'text' });
  }etS
  public GetSitesbylogin(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSitesbylogin?LoginId=" + Id, { responseType: 'text' });
  }

  public GetParkingBayNobysite(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetParkingBayNobysiteid?Siteid=" + Id, { responseType: 'text' });
  }


  public Getvistordeatilsbysite(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetVisitorParkingBysiteId?Id=" + Id, { responseType: 'text' });
  }

  public Getvistordeatilsbyid(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetVisitordetailsById?Id=" + Id, { responseType: 'text' });
  }

  public Getvistorbysitedate(Id, date): Observable<any> {
    return this.http.get(this.baseUrl + 'api/Admin/GetVisitorParkingBysiteIdanddate?Id=' + Id + '&date=' + date, { responseType: 'text' });
  }


  public GetParkingBayNo(Id, Date, endate): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetParkingBayNo?Siteid=" + Id + "&Date=" + Date + "&EndDate=" + endate, { responseType: 'text' });
  }
  public GetParkingBayNoEdit(Id, UserId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetParkingBayNoEdit?Siteid=" + Id + "&UserId=" + UserId, { responseType: 'text' });
  }
  public GetTenantsBySite(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetTenantsBySite?SiteId=" + Id, { responseType: 'text' });
  }
  public GetLabelClasses(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetLabelClasses?LoginId=" + Id, { responseType: 'text' });
  }
  public GetDatasets(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetDatasets?LoginId=" + Id, { responseType: 'text' });
  }
  public GetDataSourceById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetDataSourceById?Id=" + Id, { responseType: 'text' });
  }
  public GetSiteById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetSiteById?Id=" + Id, { responseType: 'text' });
  }
  public GetLabelClassById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetLabelClassById?Id=" + Id, { responseType: 'text' });
  }
  public DeleteDataSource(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/DataSourceDelete?Id=" + Id, { responseType: 'text' });
  }
  public DeleteSite(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/SiteDelete?Id=" + Id, { responseType: 'text' });
  }
  public DeleteLabelClass(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/LabelClassDelete?Id=" + Id, { responseType: 'text' });
  }
  public DeleteDataset(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/DatasetDelete?Id=" + Id, { responseType: 'text' });
  }
  public SaveDatatype(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddDataType", data, { responseType: 'text' });
  }
  public UpdateDataType(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateDataType", data, { responseType: 'text' });
  }
  public GetDataTypes(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetDataTypes?LoginId=" + Id, { responseType: 'text' });
  }
  public GetDataTypeById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetDataTypeById?Id=" + Id, { responseType: 'text' });
  }
  public DeleteDataType(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/DataTypeDelete?Id=" + Id, { responseType: 'text' });
  }
  public SaveAnnotationtype(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/AddAnnotationType", data, { responseType: 'text' });
  }
  public UpdateAnnotationtype(data): Observable<any> {
    return this.http.post(this.baseUrl + "api/Admin/UpdateAnnotationType", data, { responseType: 'text' });
  }
  public GetAnnotationtypes(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetAnnotationtypes?LoginId=" + Id, { responseType: 'text' });
  }
  public GetAnnotationTypeById(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetAnnotationtypeById?Id=" + Id, { responseType: 'text' });
  }
  public GetAnnotationByDataTypeId(LoginId, datatypeId): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/GetAnnotationByDataTypeId?LoginId=" + LoginId + "&DataTypeId=" + datatypeId, { responseType: 'text' });
  }
  public DeleteAnnotationtype(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/AnnotationtypeDelete?Id=" + Id, { responseType: 'text' });
  }
  public UserLogin(Email, password): Observable<any> {
    let logindto = new LoginDto(Email, password);
    return this.http.post(this.baseUrl + "api/Admin/UserLogin", logindto);
    //return this.http.get(this.baseUrl + "api/Admin/UserLogin?Email=" + Email + "&Password=" + password);
  }
  register(credentials: ICreateCredentials) {
    return from(
      this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(
        () => {
          this.afAuth.auth.currentUser.updateProfile({ displayName: credentials.displayName });
          this.afAuth.auth.updateCurrentUser(this.afAuth.auth.currentUser);
        }
      )
    );
  }
  public EmailVerification(Id) {
    return this.http.get(this.baseUrl + "api/Admin/VerifyMail?EmailCode=" + Id, { responseType: 'text' })
  }
  public ResetPassword(code, password) {
    return this.http.get(this.baseUrl + "api/Admin/VerifyForgetPassword?EmailCode=" + code + "&Password=" + password, { responseType: 'text' })
  }
  public setPassword(code, password) {
    return this.http.get(this.baseUrl + "api/Admin/SetPassword?EmailCode=" + code + "&Password=" + password, { responseType: 'text' })
  }
  public ForgetPassword(email) {
    return this.http.get(this.baseUrl + "api/Admin/ForgetPassword?email=" + email, { responseType: 'text' })
  }
  sendPasswordEmail(email) {
    return from(this.afAuth.auth.sendPasswordResetEmail(email));
  }

  resetPassword(credentials: IPasswordReset) {
    return from(this.afAuth.auth.confirmPasswordReset(credentials.code, credentials.newPassword));
  }

  get user(): firebase.User {
    return this.afAuth.auth.currentUser;
  }
  public CloseTicket(Id): Observable<any> {
    return this.http.get(this.baseUrl + "api/Admin/CloseTicket?Id=" + Id, { responseType: 'text' });
  }





  public getvehiclestimedetailsbydate(id, bayno, date): Observable<any> {
    return this.http.get(this.baseUrl + "api/Tenant/getvehcilecountsbydates?tenantid=" + id + "&bayno=" + bayno + "&date=" + date)

  }
}
