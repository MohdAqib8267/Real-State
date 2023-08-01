import { Suspense, useState } from "react";
import "./App.css";
import Website from "./Pages/Website";
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Layout from "./components/Layout/Layout";
import Properties from "./Pages/Properties/Properties";
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Property from "./Pages/Property/Property";
import { userDetailContext } from "./components/Context/userDetailContext";
import Bookings from "./Pages/Bookings/Bookings";
import Favorites from "./Pages/Favorites/Favorites";

function App() {
  const queryClient = new QueryClient();
  const [userDetails,setUserDetails]=useState({
    favorites:[],
    bookings:[],
    token:null
  })
  console.log(userDetails);
  return (
    <userDetailContext.Provider value={{userDetails,setUserDetails}}>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route element={<Layout />}>

      <Route path="/" element={<Website />}/>
      
      <Route path="/properties">
        <Route index element={<Properties />}/>
        <Route path=":propertyId" element={<Property />} />
      </Route>
      <Route path="/bookings" element={<Bookings/>} />
      <Route path="/favorites" element={<Favorites />} />
      </Route>
    </Routes>
    </Suspense>
    </BrowserRouter>
    <ToastContainer />
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </userDetailContext.Provider>
  );
}

export default App;
