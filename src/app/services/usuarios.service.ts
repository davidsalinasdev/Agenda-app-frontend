
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// El tap dispara un efecto secundario
import { tap, map } from "rxjs/operators";
import { Observable, of } from 'rxjs';

// Variables globales
import { environment } from './../../environments/environment';

// Variables globales
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  // Token de usuario
  get token() {
    return localStorage.getItem('token');
  }

  // Validar token
  /**
   * validarToken
   */
  public validarToken(): Observable<boolean> {

    const token = localStorage.getItem('token') || '';
    // Implementando rxjs
    let tokenInfo$: Observable<string>;
    tokenInfo$ = of(token);
    return tokenInfo$.pipe(
      tap((resp: any) => {
        if (resp != '') {
          localStorage.setItem('token', resp);
        }
      }),
      map(resp => (resp === '') ? false : true)
    );
  }

  // Servicio para el login
  /**
   * login
   */
  public login(formData: any) {
    return this.http.post(`${base_url}/api/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  // Por David Salinas Poma
  /**
  * Store servidores publicos 
  */
  public storeServidoresPublicos(reuniones: any) {

    /*
       Antes sin interceptores
        let headers = new HttpHeaders();
        headers = headers.set('token-usuario', this.token);
        const options = { headers: headers };
        return this.http.post<any>(base_url + '/api/servidores', reuniones, options);
    */

    // Ahora con interceptores
    return this.http.post<any>(base_url + '/api/user', reuniones);

  }

  /**
* Store servidores publicos 
*/
  public indexServidoresPublicos(page: number) {

    // Manda parametros por params(URL) -  https://reqres.in/api/user?page=2
    let params = new HttpParams()
    params = params.set('page', page.toString())

    const options = { params: params };

    return this.http.get<any>(base_url + `/api/user`, options);
  }

  /**
 * ShowReuniones
 */
  public showServidoresPublicos(id: number) {

    return this.http.get<any>(base_url + `/api/user/${id}`);
  }

  /**
   * updateServidores
   */
  public updateServidores(updateDatos: any, id: number) {

    return this.http.put<any>(base_url + `/api/user/${id}`, updateDatos);

  }

  /**
   * eliminar Servidor
   */
  public destroyServidorPublico(id: number) {

    return this.http.delete<any>(base_url + '/api/user/' + id);

  }

  /**
   * Buscar servidores publicos
   */
  public searchServidoresPublicos(servidor: any) {

    return this.http.post<any>(base_url + '/api/user/buscarusuarios', servidor);

  }

  /**
   * paginateServidores
   */
  public paginateServidores(formData: any) {

    // Manda parametros por params(URL) -  https://reqres.in/api/user?page=2
    let params = new HttpParams()
    params = params.set('page', (formData.page).toString())

    const options = { params: params };

    return this.http.get<any>(base_url + '/api/user', options);
  }

  // para cambiar la contraseña
  /**
  * Servicio para cambio de password
  */
  public loginChangesPassword(formData: any) {

    return this.http.post<any>(`${base_url}/api/login`, formData);

  }

  /**
   * Actualizacion de password
   */
  public updateChangesPassword(password: any) {

    return this.http.post<any>(base_url + '/api/user/changespassword', password);

  }


}

