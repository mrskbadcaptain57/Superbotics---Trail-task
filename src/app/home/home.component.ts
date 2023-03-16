import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

        // Public declarations 
  public restaurant_info:any=[];
  public selectedSort:any;
  public menu_card:any=[];
  public restaurant_name:any;
  public meal_types:any=[];
  public selectedMealType:any;
  public filterdMenu:any=[];
  public selectedRestaurantName:any;
  public selectedRestaurantRating:any;
  public selectedRestaurantCuisine:any;
  public selectedRestaurantId:any;
  public show_screen:any;
  public cart_items:any=[];
  public item_cost:any;
  public current_time:any;
  public available_meal:any;
  public service_charges:any;
  public total_cost:any;
  public district_name:any;
  public street_name:any;
  public district_info:any=[];
  public city_info:any=[];
  public city_name:any;
  public pincode:any;
  public uname:any;
  public pro_name:any;
  public my_orders:any=[];

  constructor(private api:ApiService,private router:Router,private toastr: ToastrService)
  {
    this.show_screen='home';
    this.selectedSort='A to Z'
    this.meal_types=['Breakfast','Lunch','Dinner'];
          // Get Restaurants API
    this.api.getRestaurants().subscribe((restaurants:any) => {
      this.restaurant_info=restaurants;
    });
    this.uname=localStorage.getItem('uname');
    this.pro_name=this.uname.slice('')[0];
  }
  changeSort(value:any)
  {
    this.selectedSort=value;
    switch(value)
    {
      case 'star_rating':
        this.restaurant_info=this.restaurant_info.sort((a:any, b:any) => {let retval = 0;if (a.star_rating > b.star_rating)retval = -1;return retval;});
      break;
      case 'A to Z':
        this.restaurant_info = this.restaurant_info.sort((a:any, b:any) => {let retval = -1;if (a.restaurant_name > b.restaurant_name)retval = 0;return retval;});
      break;
      case 'Z to A':
        this.restaurant_info = this.restaurant_info.sort((a:any, b:any) => {let retval = 0;if (a.restaurant_name > b.restaurant_name)retval = -1;return retval;});
      break;
    }
  }
  openRestaurant(index:any)
  {
    var res=this.restaurant_info[index];
    this.selectedRestaurantName=res.restaurant_name;
    this.selectedRestaurantRating=res.star_rating;
    this.selectedRestaurantCuisine=res.cuisine;
    this.menu_card=res.menu_card;
    this.filterdMenu=this.menu_card;
    const date = new Date();
    this.current_time= date.getHours();
    
    this.show_screen='menu';
    if(this.current_time>=6 && this.current_time<=10)
    {
      this.available_meal='Breakfast';
    }
    else if(this.current_time>=11 && this.current_time<=17)
    {
      this.available_meal='Lunch';
    }
    else if(this.current_time>=18 && this.current_time<=24)
    {
      this.available_meal='Dinner';
    }
    this.selectedMealType=this.available_meal;
    this.filterdMenu=this.menu_card.filter((x:any)=> { return x.meal_type==this.selectedMealType });
  }
  showAllMealTypes(value:any)
  {
    this.selectedMealType=value;
    this.filterdMenu=this.menu_card
  }
  changeMealTypes(index:any)
  {
    this.selectedMealType=this.meal_types[index];
    this.filterdMenu=this.menu_card.filter((x:any)=> { return x.meal_type==this.selectedMealType });
  }
  getTotalCost()
  {
    this.item_cost=this.cart_items.reduce((sum:any, item:any) => sum + parseFloat(item.food_cost||0),0);
    this.service_charges=this.item_cost*0.18;
    this.total_cost=this.item_cost+this.service_charges;
  }
  addItems(mealType:any,index:any)
  {
   var item=this.filterdMenu[index];
   var resIndex=this.restaurant_info.findIndex((x:any)=>x.restaurant_id==item.food_id)
   var res=this.restaurant_info[resIndex];
   var random= Math.floor(Math.random() * 100) + 1;
   if(mealType==this.available_meal)
   {
    this.cart_items.push({
      "id":random,
      "restaurant_name":res.restaurant_name,
      "food_name":item.food_name,
      "food_type":item.food_type,
      "quantity":item.quantity,
      "per_cost":item.food_cost,
      "food_cost":item.quantity*item.food_cost,
      "date":new Date()
     });
     this.toastr.success('Added successfully')
     this.getTotalCost();
   }
   else
   {
    var error='';
    if(mealType=='Breakfast')
    {
      error='Available at 6 Am to 11 Am'
    }
    else if(mealType=='Lunch')
    {
      error='Available at 11 Am to 6 Pm'
    }
    else if(mealType=='Dinner')
    {
      error='Available at 6 Pm to 1 Am'
    }
    this.toastr.error(error);
   }
   
  }
  changeQuantity(event:any,index:any,field:any)
  {
    var res:any;
    if(field=='home')
    {
      res=this.filterdMenu[index];
    }
    else if(field=='cart')
    {
      res=this.cart_items[index];
    }
    switch (field)
    {
      case 'home':
        res.quantity=event.target.value;
      break;
      case 'cart':
        res.quantity=event.target.value;
        res.food_cost=event.target.value*res.per_cost;
        this.getTotalCost();
      break;
    }
  }
  removeItem(id:any)
  {
    var ans='Do you want to remove the food item ?'
    if(confirm(ans))
    {
      this.cart_items=this.cart_items.filter((x:any)=> { return x.id!=id });
    }
    this.getTotalCost();
  }
  showCart()
  {
    if(this.cart_items.length>0)
    {
      this.show_screen='cart';
            // Get Cities API
      this.api.getCities().subscribe((cities:any) => {
        this.district_info=cities;
      });
    }
    else
    {
      this.toastr.warning('Cart is empty')
    }
  }
  backToHome()
  {
    this.show_screen='home';
  }
  backToMenu()
  {
    this.show_screen='menu';
  }
  changeDistrict()
  {
    var distIndex=this.district_info.findIndex((x:any)=>x.district_name==this.district_name);
    this.city_info=this.district_info[distIndex].city_info;
  }
  changeCity()
  {
    var cityIndex=this.city_info.findIndex((x:any)=>x.city_name==this.city_name);
    if(cityIndex>=0)
    {
      this.pincode=this.city_info[cityIndex].pincode;
    }
    else
    {
      this.pincode='';
    }
    
  }
  saveAddressButton()
  {
    if(this.district_name!='' && this.district_name!=undefined && this.city_name!='' && this.city_name!=undefined && this.street_name!='' && this.street_name!=undefined)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  saveAddress()
  {
    if(this.district_name!='' && this.district_name!=undefined && this.city_name!='' && this.city_name!=undefined && this.street_name!='' && this.street_name!=undefined && this.pincode!='' && this.pincode!=undefined)
    {
      $('#address').modal('hide');
      this.toastr.success('Address saved successfully');
    }
    else
    {
      this.toastr.error('Please fill the details');
    }
  }
  clearAll()
  {
    this.cart_items=[];
    this.district_name='';
    this.city_name='';
    this.street_name='';
    this.pincode='';
    this.item_cost='';
    this.service_charges='';
    this.total_cost='';
  }
  ConfirmOrder()
  {
    if(this.district_name!='' && this.district_name!=undefined && this.city_name!='' && this.city_name!=undefined && this.street_name!='' && this.street_name!=undefined && this.pincode!='' && this.pincode!=undefined)
    {
      this.toastr.success('Order Placed Successfully');
      this.my_orders=this.my_orders.concat(this.cart_items);
      this.clearAll();
      this.show_screen='home';
    }
    else
    {
      this.toastr.error('Please fill the address and try to place the order');
    }
  }
  showMyOrders()
  {
    if(this.my_orders.length>0)
    {
      this.show_screen='orders';
    }
    else
    {
      this.toastr.warning('Order History is empty')
    }
  }
  logout()
  {
    this.toastr.success('Logout Successfully');
    this.router.navigate(['']);
  }
}
