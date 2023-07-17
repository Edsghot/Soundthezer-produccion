import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  idPasar: any;
  accesUser: FormGroup;
  User: User | undefined;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private _loginService: LoginService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.accesUser = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.pattern(/.{8,}/)]],
    });
    this.aRoute.snapshot.paramMap.get('id');
    this.idPasar = this.aRoute.snapshot.paramMap.get('id')!;
  }
  //-----------------------------------------------------------------------ACCESO USUARIO
  accesUsuario() {
    const user = {
      email: this.accesUser?.get('email')?.value,
      password: this.accesUser?.get('password')?.value,
    };

    this._loginService.getLogin(user.email,user.password).subscribe(
      (result) => {
        this.idPasar = result.data.id;

        this.toastr.success('Acceso', 'Bienvenido!');
        this.router.navigate(['/video']);
      },
      (error) => {
        this.toastr.error('Registrate ya!', 'No tienes cuenta');
        console.log(error);
      }
    );
  }
  accesUserGoogle() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:4200', // Reemplaza con el origen correcto de tu aplicación frontend
      }),
    };

    this.http
      .get<any>('/api/users/auth/google', httpOptions)
      .subscribe(
        (data) => {
          const name = data.name;
          const email = data.email;
          console.log('GOOGLE');
          console.log('Nombre:', name);
          console.log('Email:', email);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
  accesUserFacebook() {
    this.http.get<any>('/api/users/auth/facebook').subscribe(
      (data) => {
        // Aquí puedes redirigir al usuario a la URL recibida del servidor backend
        window.location.href = data;
      },
      (error) => {
        console.error('Error al iniciar la autenticación de Facebook:', error);
      }
    );
  }
}
