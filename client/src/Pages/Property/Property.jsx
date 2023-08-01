import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty, removeBooking } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import "./Property.css";
import Map from "../../components/Map/Map";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../../components/BookingModal/BookingModal";
import { userDetailContext } from "../../components/Context/userDetailContext";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import Heart from "../../components/Heart/Heart";
const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  // console.log(id);
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );
  const [modalOpened,setModalOpened]=useState(false);
  const {validateLogin} = useAuthCheck();
  const {user} = useAuth0();
  // console.log(user);
  const [email,setEmail]=useState('');
  useEffect(()=>{
    setEmail(user?.email);
  },[user]);

  const {userDetails:{token,bookings},setUserDetails} = useContext(userDetailContext);
// console.log(bookings);
// console.log(token);

const {mutate:cancelBooking,isLoading:cencelling}=useMutation({
  mutationFn:()=>removeBooking(id,email,token),
  onSuccess:()=>{
    setUserDetails((prev)=>({
      ...prev,
      bookings:prev.bookings.filter((booking)=>booking.id!==id)
    }))
    toast.success("Booking Cancelled",{position:'bottom-right'});
  }

})
  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <PuffLoader />
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>Error white fetching the property Information</span>
        </div>
      </div>
    );
  }
  return (
    <div className="wrapper">
      <div className="flexColStart property-card paddings innerWidth property-container">
        {/* like */}
        <div className="like">
          <Heart id={id} />
        </div>
        {/* image */}
        <img src={data?.image} alt="home image" />
        {/* property details */}
        <div className="property-details flexCenter">
          {/* left */}
          <div className="flexColStart left">
            {/* head */}
            <div className="flexStart head">
              <span className="primaryText">{data?.title}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                $ {data?.price}
              </span>
            </div>
            {/* facilities */}
            <div className="flexStart facilities">
              {/* bathrooms */}
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} Bathrooms</span>
              </div>
              {/* parkings */}
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities.parkings} Parking</span>
              </div>
              {/* rooms */}
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities.bedrooms} Room/s</span>
              </div>
            </div>
            {/* description */}

            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>

            {/* address */}

            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data?.address} {data?.city} {data?.country}
              </span>
            </div>

            {/* button */}
            { 
              bookings?.map((booking)=>booking.id).includes(id)?
              <>
              <Button disabled={cencelling} variant="outline" w="100%" color="red" onClick={()=>cancelBooking()}>
                Cancel Booking
              </Button>
              
              <span>
              Your Visit Already Booked For Date {bookings?.filter((date)=>date.id==id)[0].date}
              </span>
              </>
              :
              <button className="button" onClick={()=>{
              validateLogin() && setModalOpened(true)
            }}>
              book your visit
            </button>}

            <BookingModal
            opened={modalOpened}
            setOpened={setModalOpened}
            propertyId={id}
            email={email}
            />
          </div>
          {/* right side */}
          <div className="flexColStart right">

            <Map address={data?.address} 
            city={data?.city}
            country={data?.country}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
