import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    // Public declarations 
  public type:any;
  public showeyeIcon:any;
  public user_name:any;
  public user_password:any;
  public user_info:any=[];

constructor(private http:HttpClient,private api:ApiService,private router:Router,private toastr: ToastrService)
{
  this.type='password';
      // Get Users API 
  this.api.getUsers().subscribe((users:any) => {
    this.user_info=users;
  });
}

  hideShow() 
  {
    if (this.type === 'text') 
    {
      this.type = 'password';
      this.showeyeIcon = false;
    } 
    else 
    {
      this.type = 'text';
      this.showeyeIcon = true;
    }
  }
  loginButton()
  {
    if(this.user_name!='' && this.user_name!=undefined && this.user_password!='' && this.user_password!=undefined)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  loginUser()
  {
    if(this.user_name!='' && this.user_name!=undefined && this.user_password!='' && this.user_password!=undefined)
    {
      var userIndex=this.user_info.findIndex((x:any)=>x.user_name==this.user_name && x.user_password==this.user_password);
      if(userIndex>=0)
      {
        this.toastr.success('Login Successfully');
        this.router.navigate(['/home/']);
        localStorage.setItem('uname',this.user_name);
        $('#signin').modal('hide');
      }
      else
      {
        this.toastr.error('User name or password is incorrect');
      }
    }
    else
    {
      this.toastr.error('please fill the username and password details');
    }
  }
}
