import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./App.css";
import Offline from "./Component/Offline";
import { useEffect, useState } from "react";

import ScrollToTop from "./Component/ScrollToTop";
import Home from "./Component/Home";
import Testlar from "./Component/Testlar";
import QuizPage from "./Component/QuizPage";
import NotFound from "./Component/NotFound";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import Profil from "./Component/Profil";
import BooksComponent from "./Component/Books";
import BookReader from "./Component/BookReader";
import Login from "./Component/Login";



// ================= LOADING =================

function Loading(){

  return (

    <div className="
      min-h-screen
      flex
      flex-col
      items-center
      justify-center
      bg-slate-900
      text-white
    ">


      <div className="
        w-16
        h-16
        border-4
        border-white
        border-t-transparent
        rounded-full
        animate-spin
      "></div>


      <h2 className="mt-5 text-xl font-bold">
        Yuklanmoqda...
      </h2>


      <p className="text-gray-400 mt-2">
        Iltimos kuting
      </p>


    </div>

  );

}




// ================= LAYOUT =================


function Layout(){


  const [online,setOnline] = useState(
    navigator.onLine
  );


  const [loading,setLoading] = useState(true);




  useEffect(()=>{



    // sayt kirish loading

    const timer = setTimeout(()=>{

      setLoading(false);

    },1000);





    const check = async()=>{


      try{


        await fetch(

          "https://www.google.com/favicon.ico",

          {

            method:"HEAD",

            mode:"no-cors",

            cache:"no-cache"

          }

        );


        setOnline(true);



      }catch{


        setOnline(false);


      }


    };




    check();




    const interval = setInterval(()=>{


      check();


    },3000);





    return ()=>{


      clearTimeout(timer);

      clearInterval(interval);


    };



  },[]);





  // birinchi kirish loading

  if(loading){

    return <Loading />;

  }




  // internet yo'q

  if(!online){

    return <Offline />;

  }





  return (

    <div className="max-w-[1300px] mx-auto">


      <Navbar />



      <div className="min-h-screen">

        <Outlet />

      </div>




      <Footer />



      <ScrollToTop />



    </div>

  );

}





// ================= APP =================


function App(){


  const router = createBrowserRouter([


    {


      path:"/",


      element:<Layout />,



      children:[


        {
          index:true,
          element:<Home />
        },


        {
          path:"testlar",
          element:<Testlar />
        },


        {
          path:"login",
          element:<Login />
        },


        {
          path:"quiz",
          element:<QuizPage />
        },


        {
          path:"profil",
          element:<Profil />
        },


        {
          path:"kitoblar",
          element:<BooksComponent />
        },


        {
          path:"kitoblar/oqish/:id",
          element:<BookReader />
        },


      ]


    },



    {


      path:"*",


      element:<NotFound />


    }



  ]);





  return (

    <RouterProvider router={router}/>

  );


}



export default App;